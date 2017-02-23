/**
 * 回收站文件列表
 * @author : maplemiao
 * @time : 2016/7/28
 **/

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),
        ui = require('./ui'),
        RecFile = require('./rec_file_object'), // 回收站文件对象
        restore = require('./restore'), // （批量）还原文件
        shred = require('./shred'), // （批量）清除（彻底删除）文件
        selection,

        undefined;

    // cgi cmd
    var CLEAR_FILES_CMD = 'DiskRecycleClear',
        LOAD_FILES_CMD = 'DiskRecycleList',

        undefined;

    var all_files = [], // 缓存
        file_set = {}, // 缓存，所谓缓存就是在前端js保存的一套文件列表内容

        loading = false,
        first_loaded = false,
        refresh_loaded = false,

        has_more = true,

        start_load_size = 0,   //滚动加载时的开始位置
        first_page_size = 100, // 首屏加载个数
        page_size = 30,        // 滚动分页加载个数
        no_thumb_limit = 100, // 拉取列表时，100个以内可以返回缩略图，100个以上不支持返回缩略图

        total_dir_count, //所有删除的目录数量
        total_file_count,  //所有删除的文件数量

        undefined;


    var recycle_list = new Module('recycle_list', {
        ui: require('./recycle_list.ui'),

        render : function () {
            selection = require('./recycle_list.selection.selection');

            this
                .on('activate', function () {
                    // 激活时刷新列表
                    this.reload(false);
                })
                .on('deactivate', function () {
                    this.clear_cached_files(); // 清空缓存
                });

            if (this.is_activated()) {
                this.reload(false);
            }
        },

        /**
         * 重新加载回收站文件列表
         * @param {Boolean} reset_ui
         */
        reload: function (reset_ui) {
            var me = this;

            selection.trigger('cancel_checkall');

            query_user
                .get(false, true)
                .ok(function () {
                    me.load(0, first_page_size, reset_ui);
                })
        },

        /**
         * 加载回收站文件列表
         * @param {Number} offset
         * @param {Number} size
         * @param {Boolean} reset_ui
         */
        load: function (offset, size, reset_ui) {
            var me = this,
                def = $.Deferred();

            if (loading) // 防止重复加载
                return def.reject();

            loading = true;
            this.trigger('before_load', reset_ui);

            console.debug('加载 ' + offset + ' 到 ' + (offset + size) + ' 的文件');
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: LOAD_FILES_CMD,
                cavil: true,
                resend: true,
                pb_v2: true,
                body: {
                    start: offset,
                    count: size,
                    sort_field: 2,
                    reverse_order: false,
                    // 一页拉取个数超过100个时，存储不支持返回缩略图
                    get_abstract_url: true
                }
            })
                .ok(function (msg, body) {
                    var _datas = [].concat(body['dir_list'] || [], body['file_list'] || []),
                        _files = $.map(_datas, function (obj) {
                            return RecFile.from_cgi(obj);
                        });

                    total_dir_count = body['total_dir_count'];
                    total_file_count = body['total_file_count'];

                    // 使用后台返回的finish_flag标志是否已拉取完
                    has_more = !body.finish_flag;
                    start_load_size += size;
                    // 如果是从0开始加载，则重置缓存；否则追加到缓存中
                    if (offset === 0) {
                        all_files = [];
                        file_set = {};
                    }

                    all_files = all_files.concat(_files);
                    for (var i = 0, l = all_files.length; i < l; i++) {
                        var f = all_files[i];
                        file_set[f.get_id()] = f;
                    }

                    me.trigger('load', offset, size, _files);

                    me.trigger_empty_if();
                    loading = false;
                    def.resolve(_files);
                })
                .fail(function (msg, ret) {
                    loading = false;
                    def.reject(msg, ret);
                    me.trigger('load_error', msg, ret);
                })
                .done(function () {
                    me.trigger('after_load');

                    // 首次加载列表
                    if (!first_loaded) {
                        first_loaded = true;
                        me.trigger('first_load_done');
                    }

                    // 如果是刷新
                    if (refresh_loaded) {
                        refresh_loaded = false;
                        //me.trigger('after_refresh', '列表已更新');
                    }
                });

            return def;
        },

        /**
         * 根据文件ID获取RecFile
         * @param {String} id
         * @returns {RecFile}
         */
        get_file_by_id: function (id) {
            return file_set[id];
        },

        /**
         * 获取回收站文件列表
         * @returns {Array<RecFile>}
         */
        get_files: function () {
            return all_files;
        },


        /**
         * 是否还有更多数据未从后台拉取
         * @returns {boolean}
         */
        has_more: function () {
            return has_more;
        },

        /**
         * 加载下一页内容，在删除节点和滚动栏监听处需要
         */
        load_next_page: function () {
            return this.load(start_load_size, start_load_size === 0 ? first_page_size : page_size, false);
        },

        /**
         * 还原文件
         * @param file
         */
        restore_files: function(file) {
            var is_single_file = !!file, // 是否点击单个文件还原
                me = this;

            if (!is_single_file) { //点击编辑态上的还原按钮
                file = selection.get_selected_files();
            }

            restore.restore_files(file).done(function(files) {
                me.remove_files(files);
            });
        },

        /**
         * 彻底删除文件
         * @param file
         */
        shred_files: function (file) {
            var is_single_file = !!file,
                me = this;

            if (!is_single_file) { // 点击编辑态上的删除按钮
                file = selection.get_selected_files();
            }

            shred.shred_files(file).done(function (files) {
                me.remove_files(files);
            });
        },

        get_all_files: function () {
            return all_files;
        },
        /**
         * 清除缓存中选中部分的文件
         * @param to_remove_files
         * @returns {*}
         */
        remove_files: function (to_remove_files) {
            var files = this.get_all_files(),
                to_removed_file_set = collections.array_to_set(to_remove_files, function (f) {
                    return f.get_id();
                });

            for (var i = files.length - 1; i >= 0; i--) {
                var f = files[i];
                var id = f.get_id();
                if (id in to_removed_file_set) {
                    files.splice(i, 1);
                    delete file_set[id];
                }
            }

            this.trigger('remove_files', to_remove_files);
            this.trigger_empty_if();

            return to_remove_files;
        },

        /**
         * 清空回收站
         */
        clear_files: function () {
            var me = this;

            me.trigger('clear_start');

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: CLEAR_FILES_CMD,
                cavil: true,
                pb_v2: true
            })
                .ok(function (msg, body) {
                    all_files = [];
                    file_set = {};

                    me.trigger('clear', msg);
                    me.trigger_empty_if();
                })
                .fail(function (msg) {
                    me.trigger('clear_fail', msg);
                })
                .done(function () {
                    me.trigger('clear_done');
                });
        },

        /**
         * 清空缓存中的所有文件
         */
        clear_cached_files: function () {
            all_files = [];
            this.trigger('clear_cached_files');
        },

        _last_empty_trigger: null,

        /**
         * 判断现在文件列表状态（空/非空），并触发相应的事件
         */
        trigger_empty_if: function () {
            var trigger;
            // 空的
            if (all_files.length === 0) {
                trigger = 'empty';
            } else {
                trigger = 'not_empty';
            }
            if (this._last_empty_trigger !== trigger) { // 若状态发生改变
                this.trigger(trigger);
            }
        }
    });

    return recycle_list;

});