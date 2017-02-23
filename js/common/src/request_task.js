/**
 * 异步请求队列（壳用于批量删除、批量移动、还原回收站文件等类似功能）
 * @author jameszuo
 * @date 13-3-16
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        ret_msgs = require('./ret_msgs'),
        user_log = require('./user_log'),
        request = require('./request'),
        ops = require('./configs.ops'),

        D = Date,

        undefined;


    /**
     * 抽象构造函数
     * @param {String} options.url CGI url
     * @param {Array<File>|Array<FileNode>} options.files 要处理的文件
     * @param {String} options.op in ops 操作名称
     * @param {Array<Number>} options.ok_rets 认为成功的返回码，默认 [0]
     * @param {Number} options.step_size 每次最多处理的个数
     * @param {Function} options.cmd_parser 计算命令字，回调参数(FileNode[] frag_files)
     * @param {Function} options.data_parser 计算请求参数，回调参数(FileNode[] frag_files)
     * @constructor
     */
    var RequestTask = function (options) {
        var me = this;

        this.options = options;

        me._todo_files = options.files.slice();
        me._step_size = options.step_size;
        me._org_len = options.files.length;
        me._ok_rets = options.ok_rets instanceof Array ? collections.array_to_set(options.ok_rets) : [0];
        me._results = {};

        me._step_index = 0;
    };

    RequestTask.prototype = {

        /**
         * 启动请求
         * @returns {RequestTask}
         */
        start: function () {

            var todo_files = this._todo_files;
            if (todo_files && todo_files.length) {
                this.trigger('start');
                this._step();
            }
            return this;
        },
        
        // 提取要处理的部分文件
        _pickup_files : function(){
            var me = this,
                options = me.options,
                same_parent = options.same_parent,
                records = me._todo_files,
                todos = [],
                todo_indexes = [],
                is_dir = records[0].is_dir(),
                pdir_key = records[0].get_pid();
            $.each(records, function(index, record){
                if(record.is_dir() === is_dir && (!same_parent ||  record.get_pid() === pdir_key)){
                    todos.push(record);
                    todo_indexes.push(index);
                }
                if(todos.length >= options.step_size){
                    return false;
                }
            });
            // 删除
            todo_indexes = todo_indexes.sort(function(a, b){ return b - a; });
            $.each(todo_indexes, function(i, index){
                records.splice(index, 1);
            });
            
            return todos;
        },

        _step: function () {
            var
                me = this,
                options = me.options,
                step_size = me._step_size,
                todo_files = me._todo_files,
                todo_len = me._todo_files.length,
                org_len = me._org_len,

            // 取出要处理的部分（每次取N个类型(is_dir)相同的文件）
                frag_files = this._pickup_files();

            if (frag_files.length) {

                if (org_len == todo_files.length) {   // 防止出现异常情况导致死循环
                    console.error('RequestTask 出现异常：collections.sub() 未成功剔除元素');
                    me._process_done();
                    return;
                }

                me._step_index++;

                me.trigger('step', org_len - todo_len + 1, org_len, me._step_index);

                var cmd = me._get_cmd(frag_files),
                    data = me._get_data(frag_files),
                    post_data = {
                        url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
                        cmd: cmd,
                        body: data,
                        cavil: true
                    };
                if (me.options.url) {
                    post_data.url = me.options.url;
                }
                request.xhr_post(post_data)
                    .ok(function (msg, body) {
                        if(me.body_parse[cmd]){
                            me.body_parse[cmd].call(me,body,frag_files,cmd);
                        } else {
                            if (body.results) {
                                me.trigger('step_ok', body.results.length, me._step_index, cmd);

                                var results = body.results;
                                $.each(frag_files, function (i, it) {
                                    me._results[it.get_id()] = results ? parseInt(results[i].result) : ret_msgs.UNKNOWN_CODE;
                                });
                            }
                        }
                    })
                    .fail(function (msg, ret) {

                        $.each(frag_files, function (i, it) {
                            me._results[it.get_id()] = ret;
                        });
                    })
                    .done(function (msg, ret) {

                        me.trigger('step_done', ret);

                        // 如果处理完了，会返回
                        if (!todo_files.length) {
                            me._process_done();
                        } else {
                            me._step();
                        }
                    });

            }
        },
        body_parse:{
            delete_virtual_file: function(body,frag_files,cmd){//离线文件
                var me = this,
                    files = body.files;
                me.trigger('step_ok', files.length, me._step_index, cmd);
                $.each(frag_files, function (i, it) {
                    me._results[it.get_id()] = 0;
                });
            }
        },
        /**
         * 获取请求命令字
         * @param {Array<FileNode>} frag_files 要处理的文件
         * @return {String} 命令字
         * @private
         */
        _get_cmd: function (frag_files) {
            return this.options.cmd_parser(frag_files);
        },

        /**
         * 生成请求参数
         * @param {Array<FileNode>} frag_files 要处理的文件
         * @return {Object} 请求参数
         * @private
         */
        _get_data: function (frag_files) {
            return this.options.data_parser(frag_files);
        },

        /**
         * 处理结果
         * @private
         */
        _process_done: function () {
            var ok_rets = this._ok_rets,
                first_err_ret = 0,
                has_ok = false,
                ok_count = 0, // 成功处理的个数
                ok_ids = {},
                ok_id_arr = [],
                todo_files = this._todo_files;

            $.each(this._results, function (id, ret) {
                var this_is_ok = (ret in ok_rets);
                // 取第一个错误码
                if (!first_err_ret && !this_is_ok) {
                    first_err_ret = ret;
                }
                else if (this_is_ok) {
                    has_ok = true;
                    ok_ids[id] = null;
                    ok_id_arr.push(id);
                    ok_count++;
                }
            });

            // 移除已成功的
            if (has_ok) {
                collections.remove(todo_files, function (file) {
                    return file.get_id() in ok_ids;
                });
                todo_files.length ? console.log('剩余未成功', todo_files.length) : console.log('批量处理完成');
            }

            var all_ok = first_err_ret == 0,
                msg = ret_msgs.get(first_err_ret);

            // 记录log
            if (this.options.op) {
                log(this.options.op, first_err_ret);
            }


            if (all_ok) {
                this.trigger('all_ok', msg, ok_id_arr);
            }
            else if (has_ok && !all_ok) {
                this.trigger('part_ok', msg, ok_id_arr, first_err_ret);
            }
            else if (!has_ok && !all_ok) {
                this.trigger('error', msg, first_err_ret);
            }

            if (has_ok) {
                this.trigger('has_ok', ok_id_arr, first_err_ret, msg);
            }

            this.trigger('done', first_err_ret);

            this.destroy();
        },

        destroy: function () {
            this.off().stopListening();
        }
    };

    var log = function (op, ret) {
        if (op) {
            user_log(op, ret);
        } else {
            console.error('未指定有效的 op 参数');
        }
    };

    $.extend(RequestTask.prototype, events);

    return RequestTask;
});