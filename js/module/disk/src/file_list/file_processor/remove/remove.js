/**
 * (批量)删除文件\目录
 * @author jameszuo
 * @date 13-3-5
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
        covert = lib.get('./covert'),

        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),

        undefined;

    var remove = new Module('disk_file_remove', {

        //ui: require('./file_list.file_processor.remove.ui'),

        /**
         * 删除文件前的确认框
         * @param {FileNode|Array<FileNode>} files
         * @param {String} type : normal or offline
         */
        remove_confirm: function (files, type) {

            if (!constants.IS_DEBUG
                && query_user.is_use_cgiv2()
                // 网盘下批量删除现在有了上限 - james
                && files.length > constants.CGI2_DISK_BATCH_LIMIT) {
                mini_tip.warn('一次删除文件不能超' + constants.CGI2_DISK_BATCH_LIMIT + '个');
                return;
            }

            var me = this,
                desc = '已删除的文件可以在回收站找到';

            files = [].concat(files);
            if(type === 'offline') {
                desc = '';
                $.each(files, function (i, item) {
                    if (item.get_down_type() === 1) {
                        desc = '如果对方未接收，删除会导致对方接收失败';
                        return false;
                    }
                });
                var remover = new OfflineRemover(files);
            } else {
                var remover = new Remover(files);
            }

            widgets.confirm(
                '删除文件',
                    files.length>1 ? '确定要删除这些文件吗？' : files[0].is_dir() ? '确定要删除这个文件夹吗？' : '确定要删除这个文件吗？',
                desc,
                function () {
                    progress.show("正在删除0/"+files.length);
                    remover
                        .do_remove()
                        .progress(function(success_files){
                            progress.show("正在删除" + success_files.length+"/"+files.length);
                        }).done(function(success_files, failure_files){
                            //me.trigger('has_removed', success_files);
                            if(!success_files.length && failure_files.length) {//全部不成功
                                mini_tip.warn('文件删除失败');
                            }if(failure_files.length){
                                mini_tip.warn('部分文件删除失败:' + remover.get_part_fail_msg());
                            }else{
                                mini_tip.ok('删除文件成功');
                            }
                            me.trigger('has_removed', success_files);
                        }).fail(function(msg){
                            if(msg !== me.canceled){
                                mini_tip.error(msg);
                            }
                        }).always(function(){
                            progress.hide();
                        });
                },
                $.noop,
                null,
                true
            );

            return remover;
        },

        /**
         * 静默删除
         * @param {FileNode} target_dir
         * @param {String} file_id
         * @param {String} file_name
         */
        silent_remove: function (target_dir, file_id, file_name, delete_completely) {
            if (target_dir) {
                var target_par = target_dir.get_parent();
                if (target_par) {
                    var file_data = {
	                    delete_completely: delete_completely || false,
                        file_list: [{
	                        ppdir_key: target_par.get_id(),
                            pdir_key: target_dir.get_id(),
                            file_id: file_id,
                            filename: file_name
                        }]
                    };

                    request.xhr_get({
                        url: 'http://web2.cgi.weiyun.com/qdisk_delete.fcg',
                        cmd: 'DiskDirFileBatchDeleteEx',
                        pb_v2: true,
                        body: file_data
                    });


                    this.trigger('has_removed', [file_id]);
                }
            }
        }
    });

    var Remover = inherit(Event, {

        step: 10,

        constructor: function(files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_files_remove_step_size() || 10;
            this.ok_rets = [0, 1019, 1020, 1026];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
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
            this.ppdir_key = file.get_parent && file.get_parent() && file.get_parent().get_pid() || '';
            this.pdir_key = file.get_pid();
        },

        is_remove_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_remove_all: function() {
            return !this.dirs.length && !this.files.length;
        },

        save_has_remove: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },
        set_one_fail_result: function(result) {
            if(this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },
        /**
         * 删除时有部分失败时的错误提示
         * @returns {string|*|string}
         */
        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '未知错误';
        },

        do_remove: function() {
            var def = $.Deferred();
            this.step_remove(def);
            return def;
        },

        get_step_data: function() {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list,
                ppdir_key = this.ppdir_key,
                pdir_key = this.pdir_key;

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
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
                        file_id: file.get_id(),
                        filename: file.get_name()
                    };
                });
            }

            this.step_dirs = step_dirs;
            this.step_files = step_files;

            return {
                dir_list: step_dir_list,
                file_list: step_file_list
            };
        },

        step_remove: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_delete.fcg',
                cmd: 'DiskDirFileBatchDeleteEx',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_remove_ok(dir)) {
                            succ_list.push(true_dir);
                        } else {
                            me.set_one_fail_result(dir);
                            fail_list.push(true_dir);
                        }
                    });
                }
                if(body.file_list && body.file_list.length) {
                    $.each(body.file_list, function(i, file) {
                        var true_file = me.step_files[i];
                        if(me.is_remove_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_remove(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_remove_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.trigger('has_ok', me.succ_list);
                    me.destroy();
                } else {
                    me.step_remove(def);
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

    var OfflineRemover = inherit(Remover, {

        get_step_data: function() {
            var step_files = [],
                step_file_list;

            var step = this.step;
            while(step--) {
                step_files.push(this.files.shift());
                if(!this.files.length) {
                    break;
                }
            }

            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        file_id: file.get_id(),
                        filename: file.get_name(),
                        delete_type: file.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
                        peer_uin: file.get_uin()
                    };
                });
            }

            this.step_files = step_files;

            return {
                ppdir_key: this.ppdir_key,
                pdir_key: this.pdir_key,
                delete_list: step_file_list
            };
        },

        step_remove: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'VirtualDirBatchItemDelete',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.ret_list && body.ret_list.length) {
                    $.each(body.ret_list, function(i, file) {
                        var true_file = me.step_files[i];
                        if(me.is_remove_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_remove(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_remove_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.trigger('has_ok', me.succ_list);
                    me.destroy();
                } else {
                    me.step_remove(def);
                }
            });
        }
    });

    return remove;
});