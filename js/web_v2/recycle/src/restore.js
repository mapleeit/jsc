/**
 * (批量)还原文件
 * @author hibincheng
 * @date 14-07-15
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
        mini_tip = common.get('./ui.mini_tip_v2'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),
        global_var = common.get('./global.global_variable'),

        restorer,
        undefined;

    var restore = new Module('disk_file_restore', {
        _is_restoring : false,
        restore_files: function (files) {
            if(!$.isArray(files)) {
                files = [files];
            }

            //检测还原文件大小是否超出网盘剩余容量
            if (space_info) {
                var total_restore = 0;
                for (var i = 0; i < files.length; i++) {
                    total_restore += files[i].get_size();
                }
                if (total_restore > space_info.ui.get_total_space() - space_info.ui.get_used_space()) {
                    mini_tip.warn('还原文件大小超过剩余容量');
                    return;
                }
            }

            restorer = new Restorer(files);

            var me = this,
                def = $.Deferred();
            if (me._is_restoring) {
                mini_tip.warn('当前有文件正在恢复，请稍后重试');
                return;
            } else {
                me._is_restoring = true;
            }
            restorer
                .do_restore()
                .progress(function(success_files){
                    progress.show("正在还原" + success_files.length+"/"+files.length);
                }).done(function(success_files, failure_files){
                    me._is_restoring = false;

                    me.on_restore(success_files, failure_files);
                    def.resolve(success_files);
                }).fail(function(msg){
                    if(msg !== me.canceled){
                        mini_tip.error(msg);
                    }
                }).always(function(){
                    progress.hide();
                });

            return def;
        },

        on_restore: function(success_files, failure_files) {
            var is_all_ok = !failure_files.length;
            var msg = this._get_to_disk_msg(is_all_ok, success_files)
            if(!success_files.length && failure_files.length) {//全部不成功
                mini_tip.warn(msg);
            }if(failure_files.length){
                mini_tip.warn(msg);
            }else{
                mini_tip.ok(msg);
            }

            var ok_ids = $.map(success_files, function(file) {
                return file.get_id();
            });

            //还原文件后刷新用户空间
            space_info.refresh();

            // 回到网盘后会高亮的ID
            global_var.set('recycle_restored_ids', (global_var.get('recycle_restored_ids') || []).concat(ok_ids));
        },

        _get_to_disk_msg: function (is_all_ok, files) {
            var msg;
            if (is_all_ok) {
                // for wording
                var dir_len = 0, file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                msg = '成功还原' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
            }
            else if (files.length) {
                msg = '部分文件还原失败：' + restorer.get_part_fail_msg();
            } else {
                msg = '文件还原失败';
            }
            return msg;
        }
    });

    var Restorer = inherit(Event, {

        step: 10,

        constructor: function(files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_rec_restore_step_size() || 10;
            this.ok_rets = [0];
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
        },

        is_restore_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_restore_all: function() {
            return !this.dirs.length && !this.files.length;
        },

        save_has_restore: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        set_one_fail_result: function(result) {
            if(this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },

        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '还原失败';
        },

        do_restore: function() {
            var def = $.Deferred();
            this.step_restore(def);
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
                        recycle_dir_key: file.get_id(),
                        recycle_dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        recycle_file_id: file.get_id(),
                        recycle_filename: file.get_name()
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

        step_restore: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleDirFileBatchRestore',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_restore_ok(dir)) {
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
                        if(me.is_restore_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_restore(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_restore_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.trigger('has_ok', me.succ_list);
                    me.destroy();
                } else {
                    me.step_restore(def);
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

    return restore;
});