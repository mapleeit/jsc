/**
 * 回收站文件列表
 * @author jameszuo
 * @date 13-3-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
//        store = lib.get('./store'),
        date_time = lib.get('./date_time'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        RecFile = require('./rec_file_object'),
        restore = require('./rec_list.restore'),

        selection,

        all_files = [],
        file_set = {},

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

    var rec_list = new Module('recycle_list', {

        ui: require('./rec_list.ui'),

        render: function () {

            selection = require('./rec_list.selection.selection');

            this
                .on('activate', function () {
                    // 激活时刷新列表
                    this.reload();
                    this.listenTo(global_event, 'recycle_refresh', this.refresh);
                    // 监听是否勾选全选
                    this.listenTo(selection, 'check_checkall', this.check_checkall);
                })
                .on('deactivate', function () {
                    // 清空缓存
                    this.clear_cached_files();
                    this.stopListening(global_event, 'recycle_refresh', this.refresh);
                    // 停止监听是否勾选全选
                    this.stopListening(selection, 'check_checkall', this.check_checkall);
                })
                .listenTo(global_event, 'recycle_refresh', function () {
                    this.last_click_record= null;
                    this.reload(true);
                });

            if (this.is_activated()) {
                this.reload();
            }
        },

        // fix bug 48746919 by cluezhang, at 2013/06/06
        // 原本它是定义为常量，但如果加载此模块时用户还没有登录，就会导致key异常
        // 如果一开始登录就进去的是回收站(#m=recycle)，就是没有uin
        // 如果一开始登录的是网盘，再切换到回收站就是带uin
        get_ck_clear_time: function () {
            return 'rec_c_tm' + query_user.get_uin_num();
        },

        refresh: function () {
            refresh_loaded = true;
            this.reload();
        },

        /**
         * 重新加载回收站文件列表
         * @param {Boolean} reset_ui
         */
        reload: function (reset_ui) {
            var me = this;

            selection.trigger('cancel_checkall');
            me.set_checkalled(false);                   //取消全选

            query_user
                .get(false, true)
                .ok(function () {
                    me.load(0, first_page_size, reset_ui);
                });
        },

        //获取已加载的文件
        get_loaded_files: function () {
            return all_files;
        },

        //检查是否勾选上“全选”
        check_checkall: function (is_all) {
            this._checkalled = !!is_all;
            selection.trigger('set_checkall', this._checkalled);
        },

        /**
         * 全选时，补足2000个文件
         * @param {Boolean} checkalled 是否全选
         */
        set_checkalled: function (checkalled) {
            //获取当前已加载的文件列表
            var files = this.get_loaded_files();
            if (checkalled === true) {

                // 如果加载的文件个数不足X个，且有更多，那么点击全选时加载到X个
                var limit = constants.CGI2_RECYCLE_LIST_LIMIT,
                    loaded_count = files.length,
                    me = this;

                if (loaded_count < limit && this.has_more()) {
                    selection.toggle_select(files, true);

                    // 加载全部
                    this.load_all(function () {
                        selection.toggle_select(me.get_loaded_files(), true);
                    });
                }
                // 已加载超过x个了，就选中全部
                else {
                    selection.toggle_select(files, true);
                }
            }
            else {
                selection.toggle_select(files, false);
            }
            this._checkalled = checkalled;
        },

        get_checkalled: function () {
            return this._checkalled;
        },

//        set_total: function (total) {
//            this.total = total;
//        },
//
//        get_total: function () {
//            return this.total;
//        },

        has_more: function () {
            return has_more;
        },

        /**
         * 拉取当前目录的所有文件
         * @param node 当前目录
         * @param callback 回调方法
         * @returns {*}
         */
        load_all: function(callback) {

            callback._limit_count = typeof callback._limit_count === 'undefined' ? 30 : callback._limit_count;

            var loaded_files = this.get_loaded_files(),
                me = this;

            var def = this.load(loaded_files.length, 100);
            def.done(function() {
                callback._limit_count--;
                if(me.has_more()) {//还有文件
                    if(!callback._limit_count) { //最多加载7次就能加载完3000个文件的，避免死循环
                        callback(true);
                    } else {
                        me.load_all(callback);
                    }
                } else {
                    callback(true);
                }
            }).fail(function() {
                callback(false);
            });

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
                cmd: 'DiskRecycleList',
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
                    total_file_count = body['total_dir_count'];

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

            if (!is_single_file) { //点击了还原按钮
                file = selection.get_selected_files();
            }

            restore.restore_files(file).done(function(files) {
                me.remove_files(files);
            });

        },

        /**
         * 清空
         */
        clear_files: function () {
            var me = this;

            me.trigger('clear_start');

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleClear',
                cavil: true,
                pb_v2: true
            })
                .ok(function (msg, body) {

                    all_files = [];
                    file_set = {};

                    me.trigger('clear', msg);
                    me.trigger_empty_if();

                    // 记录清空回收站的时间，以便在加载列表前筛选掉『已删除』的文件
                    // store.set(me.get_ck_clear_time(), body['timestamp']);
                })
                .fail(function (msg) {
                    me.trigger('clear_fail', msg);
                })
                .done(function () {
                    me.trigger('clear_done');
                })
        },

        /**
         * 获取回收站文件列表
         * @returns {Array<RecFile>}
         */
        get_files: function () {
            return all_files;
        },

        /**
         * 判断回收站本地缓存是否有文件
         */
        has_files: function () {
            return all_files.length > 0;
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
         * 清空缓存中的文件
         * @param {Array<Recycle_file>} files
         * @returns {Array<RecFile>} 已删除的文件
         */
        remove_files: function (to_remove_files) {
            var files = this.get_files(),
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
         * 清空缓存中的所有文件
         */
        clear_cached_files: function () {
            all_files = [];
            this.trigger('clear_cached_files');
        },

        _last_empty_trigger: null,

        /**
         * 触发是否有文件的事件
         */
        trigger_empty_if: function () {
            var trigger;
            // 空的
            if (all_files.length === 0) {
                trigger = 'empty';
            } else {
                trigger = 'not_empty';
            }
            if (this._last_empty_trigger !== trigger) {
                this.trigger(trigger);
            }
        }
    });

    return rec_list;
});