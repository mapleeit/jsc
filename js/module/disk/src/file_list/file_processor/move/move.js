/**
 * 文件移动（包括批量移动、拖拽移动）
 * @author jameszuo
 * @date 13-3-16
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        Module = common.get('./module'),
        request = common.get('./request'),
        RequestTask = common.get('./request_task'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),
        ret_msgs = common.get('./ret_msgs'),
	    logger = common.get('./util.logger'),

        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),

        tmpl = require('./tmpl'),

        encode = encodeURIComponent,

        undefined;

    var move = new Module('disk_file_move', {

        ui: require('./file_list.file_processor.move.ui'),

        /**
         * 显示『移动到』目录选择对话框
         * @param {Array<FileNode>} files
         * @param {String} op op in ops
         */
        show_move_to: function (files, op) {
            if (!constants.IS_DEBUG
                && files.length > constants.CGI2_DISK_BATCH_LIMIT) {
                mini_tip.warn('一次移动文件不能超' + constants.CGI2_DISK_BATCH_LIMIT + '个');
                return;
            }

            this.trigger('show_move_to', files, op);
        },

        /**
         * 移动文件到指定目录中
         * @param {Array<FileNode>} files
         * @param {String} par_id 目标目录ID
         * @param {String} dir_id 目标父目录ID
         */
        start_move: function (files, par_id, dir_id) {
            var me = this,
                mover = new Mover(files, par_id, dir_id);

            var total = files.length;
            me.trigger('start');
            mover.start().progress(function(success_list) {
                me.trigger('step', success_list.length, total);
            }).done(function(success_list, fail_list,retcode, retmsg) {
                me.trigger('has_moved', success_list, par_id, dir_id);
                if(fail_list.length) {
                    me.trigger('part_moved', success_list, fail_list, retcode, retmsg);
                } else {
                    me.trigger('all_moved');
                }
            }).fail(function(msg, ret) {
                me.trigger('error', msg, ret);
	            logger.write([
		            'disk error --------> move_error',
			            'disk error --------> msg: ' + msg,
			            'disk error --------> err: ' + ret,
			            'disk error --------> par_id: ' + par_id,
			            'disk error --------> dir_id: ' + dir_id,
			            'disk error --------> time: ' + new Date()
	            ], 'disk_error', ret);
            }).always(function() {
                me.trigger('done');
            });
        },

        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         */
        load_sub_dirs: function (node_par_id, node_id) {
            var me = this;

            me.trigger('before_load_sub_dirs', node_id);

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskDirBatchList',
                cavil: true,
                resent: true,
                pb_v2: true,
                body: {
                    pdir_key: node_par_id,
                    dir_list: [{
                        dir_key: node_id,
                        //dir_mtime: long_long_ago,
                        get_type: 1
                    }]
                }
            })
                .ok(function (msg, body) {
                    var result = body['dir_list'][0],
                        retcode = result['retcode'],
                        dirs;
                    if(!retcode) {
                        dirs = result['dir_list'];
                        dirs = file_node_from_cgi.dirs_from_cgi2(dirs);
                        me.trigger('load_sub_dirs', dirs, node_id);
                    } else {
                        var msg = result.retmsg || ret_msgs.get(retcode);
                        me.trigger('load_sub_dirs_error', msg, retcode);
                    }
                })
                .fail(function (msg, ret) {
                    me.trigger('load_sub_dirs_error', msg, ret);
		            logger.write([
			            'disk error --------> load_sub_dirs_error',
			            'disk error --------> msg: ' + msg,
			            'disk error --------> err: ' + ret,
			            'disk error --------> pdir_key: ' + node_par_id,
			            'disk error --------> dir_list dir_key: ' + node_id,
			            'disk error --------> time: ' + new Date()
		            ], 'disk_error', ret);
                })
                .done(function () {
                    me.trigger('after_load_sub_dirs', node_id);
                });
        }

    });

    var Mover = inherit(Event, {

        step: 10,

        constructor: function(files, dst_ppdir_key, dst_pdir_key) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_files_move_step_size() || 10;
            this.ok_rets = [0];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.dst_ppdir_key = dst_ppdir_key;
            this.dst_pdir_key = dst_pdir_key;
            this.retcode = 0;
            this.retmsg = '';
            this.serialize_files(files);
        },

        serialize_files: function(total_files) {
            var dirs = [];
            var files = [];

            $.each(total_files, function(i, file) {
                if(file.is_dir()) {
                    dirs.push(file);
                } else {
                    files.push(file);
                }
            });

            this.dirs = dirs;
            this.files = files;
            var file = this.total_files[0];
            this.ppdir_key = file.get_parent().get_pid();
            this.pdir_key = file.get_pid();
        },

        is_move_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_move_all: function() {
            return !this.dirs.length && !this.files.length;
        },

        save_has_move: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        start: function() {
            var def = $.Deferred();
            this.step_move(def);
            return def;
        },

        get_step_data: function() {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list;

            var step = this.step;
            while(step--) {
                if(this.dirs.length) {
                    step_dirs.push(this.dirs.shift());
                } else if(this.files.length) {
                    step_files.push(this.files.shift());
                };
                if(!this.dirs.length && !this.files.length) {
                    break;
                }
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        dir_key: file.get_id(),
                        dir_name: file.get_name(),
                        src_dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        file_id: file.get_id(),
                        filename: file.get_name(),
                        src_filename: file.get_name()
                    };
                });
            }

            this.step_dirs = step_dirs;
            this.step_files = step_files;

            return {
                src_ppdir_key: this.ppdir_key,
                src_pdir_key: this.pdir_key,
                dst_ppdir_key: this.dst_ppdir_key,
                dst_pdir_key: this.dst_pdir_key,
                dir_list: step_dir_list,
                file_list: step_file_list
            };
        },

        step_move: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskDirFileBatchMove',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_move_ok(dir)) {
                            succ_list.push(true_dir);
                        } else {
                            me.retcode = me.retcode ? me.retcode : dir.retcode;
                            me.retmsg = me.retmsg ? me.retmsg : dir.retmsg;
                            fail_list.push(true_dir);
                        }
                    });
                }
                if(body.file_list && body.file_list.length) {
                    $.each(body.file_list, function(i, file) {
                        var true_file = me.step_files[i];
                        if(me.is_move_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.retcode = me.retcode ? me.retcode : file.retcode;
                            me.retmsg = me.retmsg ? me.retmsg : file.retmsg;
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_move(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_move_all()) {
                    def.resolve(me.succ_list, me.fail_list, me.retcode, me.retmsg);
                    me.destroy();
                } else {
                    me.step_move(def);
                }
            });
        },

        destroy: function() {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
        }
    });


    return move;
});