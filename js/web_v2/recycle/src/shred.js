/**
 * （批量）彻底删除文件（即回收站清除文件）
 * @author : maplemiao
 * @time : 2016/8/3
 **/

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        events = lib.get('./events'),
        Event = lib.get('./Event'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        ret_msgs = common.get('./ret_msgs'),

        shredder,

        undefined;

    var shred = new Module('recycle_file_shred' , {
        shred_files: function (files) {
            if(!$.isArray(files)) {
                files = [files];
            }

            shredder = new Shredder(files);

            var me = this,
                def = $.Deferred();

            shredder
                .do_shred()
                .progress(function(success_files){
                    progress.show("正在清除" + success_files.length+"/"+files.length);
                })
                .done(function(success_files, failure_files){
                    me.on_shred(success_files, failure_files);
                    def.resolve(success_files);
                })
                .fail(function(msg){
                    mini_tip.error(msg);
                })
                .always(function(){
                    progress.hide();
                });

            return def;
        },

        on_shred: function (succ_files, fail_files) {
            var is_all_ok = !fail_files.length,
                msg;

            if (is_all_ok) {
                var dir_len = 0, file_len = 0;
                $.each(succ_files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                msg = '成功清除' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
            } else if (succ_files.length) {
                msg = '部分文件还原失败：' + shredder.get_part_fail_msg();
            } else {
                msg = '文件还原失败';
            }

            if(fail_files.length){
                mini_tip.warn(msg);
            }else{
                mini_tip.ok(msg);
            }
        }

    });

    var Shredder = inherit(Event, {
        /**
         * 后台接口对一次彻底删除的条目数量有限制，因此如果多于此数量，应分多条请求进行
         */
        step : 100,

        constructor: function (files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_rec_shred_step_size() || 100;
            this.ok_rets = [0];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.serialize_files(files);
        },

        /**
         * 把文件分成dir和file两类，并分别存储在this.dirs & this.files
         * @param total_files
         */
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

        /**
         * 入口
         * @returns {*}
         */
        do_shred: function () {
            var def = $.Deferred();
            this.step_shred(def);
            return def;
        },

        // 单步彻底删除，数量上限为this.step
        step_shred: function (def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleDirFileClear',
                pb_v2: true,
                cavil: true,
                body: data
            })
                .ok(function (msg, body) {
                    var succ_list = [],
                        fail_list = [];
                    if(body.dir_list && body.dir_list.length) {
                        $.each(body.dir_list, function(i, dir) {
                            var true_dir = me.step_dirs[i];
                            if(me.is_shred_ok(dir)) {
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
                            if(me.is_shred_ok(file)) {
                                succ_list.push(true_file);
                            } else {
                                me.set_one_fail_result(file);
                                fail_list.push(true_file);
                            }
                        });
                    }
                    me.save_has_shred(succ_list, fail_list);
                    def.notify(me.succ_list, me.fail_list);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                })
                .done(function () {
                    if(me.is_shred_all()) {
                        def.resolve(me.succ_list, me.fail_list);
                        me.trigger('shred_has_ok', me.succ_list); // 抛出事件，其他模块可能会使用到
                        me.destroy();
                    } else {
                        me.step_shred(def);
                    }
                })
        },

        get_step_data: function () {
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
                }
                if(!this.dirs.length && !this.files.length) {
                    break;
                }
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
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

        is_shred_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        /**
         * 在分步完成彻底删除时，有一个出错则置错
         * @param result
         */
        set_one_fail_result: function (result) {
            if (this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },

        save_has_shred: function (succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        is_shred_all: function () {
            return !this.dirs.length && !this.files.length;
        },

        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '还原失败';
        },

        destroy: function () {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
        }

    });

    return shred;
});