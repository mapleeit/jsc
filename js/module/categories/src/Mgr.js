/**
 * 库分类文件列表操作逻辑处理
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        
        Remover = require('./Remover'),

        share_enter,
        downloader,
        file_qrcode,
        undefined;

    var TIP_TEXT = {
        doc: '文档',
        audio: '音乐',
        video: '视频'
    };

    var Mgr = inherit(Event, {

        step_num: 20,

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },
        /**
         * @cfg {View} view
         */
        /**
         * @cfg {Store} store
         */
        /**
         * @cfg {Loader} loader
         */


        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e, extra){
                    this.process_action(action_name, record, e, extra);
                    return false;// 不再触发recordclick
                }, this);
//                this.listenTo(this.view, 'recordclick', this.handle_record_click, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {
                    var records = this.view.selection.get_selected();
                    this.process_action(action_name, records, e, {
                        src : 'toolbar',
                        data : data
                    });
                }, this);
            }
            //数据加载器相关事件
            if(this.loader) {
                this
                    .listenTo(this.loader,'error', function(msg) {
                        mini_tip.error(msg);
                    }, this)
                    .listenTo(this.loader, 'before_load', function() {
                        this.view.on_beforeload();
                    }, this)
                    .listenTo(this.loader, 'after_load', function() {
                        this.view.on_load();
                    })
                    .listenTo(this.loader, 'before_refresh', function() {
                        widgets.loading.show();
                        this.view.on_before_refresh();
                    })
                    .listenTo(this.loader, 'after_refresh', function() {
                        widgets.loading.hide();
                        this.view.on_refresh();
                    });
            }
        },
        // 分派动作
        process_action : function(action_name, data, event, extra){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event, extra);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
         // 删除
        on_delete : function(nodes, event, extra){
            this.do_delete(nodes);
            //点击统计上报
            if(extra.src === 'contextmenu') {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_DELETE');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_DELETE');
            }
        },
        get_tip_text: function() {
            return TIP_TEXT[this.module_name];
        },
        do_delete : function(nodes, callback, scope){
            var me = this;
            nodes = [].concat(nodes);
            this.remover = this.remover || new Remover();
            this.remover.remove_confirm(nodes).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.supply_files_if();
                if(callback){
                    callback.call(scope, true);
                }
            })
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择' + this.get_tip_text());
                return;
            }
            this.do_delete(records);
        },

        // 直接点击记录
        on_open : function(records, e, extra){
            var record = records[0];
            // 如果可预览，预览之
            var me = this;
            if(e.target && e.target.tagName.toUpperCase() === 'INPUT') {//得命名时，点击文本框，不进行预览
                return;
            }
            // 文档预览
            // 如果是可预览的文档，则执行预览操作
            if (preview_dispatcher.is_preview_doc(record)) {
                preview_dispatcher.preview(record);
                user_log('ITEM_CLICK_DOC_PREVIEW');
                return;
            }

            // 如果不能，下载之
            this.on_download(records, e, extra);
            e.preventDefault();
        },
        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} node
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (node) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()));
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        full_screen_preview.preview(node);
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },
        /**
         * 排序操作
         * @param {String} sort_type 排序类型
         */
        on_sort: function(records, e, extra) {
            var sort_type = extra.data;
            var size = this.store.size();
            if((size === 0 || size === 1) && this.loader.is_all_load_done()) {//无数据，就不排序了
                return;
            }
            this.load_files({
                offset: 0,
                sort_type: sort_type
            });
            //统计上报
            user_log('CATEGORY_'+ this.module_name.toUpperCase() + '_SORT'+ '_' + sort_type.toUpperCase());
        },
        /**
         * 过滤文件类型操作
         * @param {String} filter_type 要过滤的文件类型
         */
        on_filter: function(records, e, extra) {
            var filter_type = extra.data;
            this.load_files({
                offset: 0,
                filter_type: filter_type
            });
            //统计上报
            switch(filter_type) {
                case 'all':
                    user_log('CATEGORY_DOC_FILTER_ALL');
                    break;
                case 'word':
                    user_log('CATEGORY_DOC_FILTER_DOC');
                    break;
                case 'excel':
                    user_log('CATEGORY_DOC_FILTER_XLS');
                    break;
                case 'ppt':
                    user_log('CATEGORY_DOC_FILTER_PPT');
                    break;
                case 'pdf':
                    user_log('CATEGORY_DOC_FILTER_PDF');
                    break;
            }
        },
        /**
         * 重命名操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_rename: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            var ori_name = record.get_name();
            var me = this;
            me.view.start_rename(record, function(new_name) {
                if(ori_name !== new_name) {//有变化才修改
                    me.do_rename(record, new_name);
                } else {
                    me.view.remove_rename_editor();
                }
            });

            //点击统计上报  erric 还未提供
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_RENAME');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_RENAME');
            }
        },
        /**
         *真正重命名
         * @param {File_record} record 文件对象
         * @param {String} new_name 新的文件名
         */
        do_rename: function(record, new_name) {
            var view = this.view,
                data = {
                    ppdir_key: '',
                    pdir_key: record.get_pid(),
                    file_list: [{
                        file_id: record.get_id(),
                        filename: new_name,
                        src_filename: record.get_name()
                    }]
                };
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskFileBatchRename',
                cavil: true,
                pb_v2: true,
                body: data
            })
                .ok(function(msg, body) {
                    var result = body['file_list'] && body['file_list'][0] || {};
                    if(result.retcode) {
                        mini_tip.warn(result.retmsg || '更名失败');
                        return;
                    }
                    mini_tip.ok('更名成功');
                    record.set_name(new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.warn(msg || '更名失败');
                })
                .done(function() {
                    view.remove_rename_editor();
                });

        },
        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_share: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(record);
                });
            } else {
                share_enter.start_share(record);
            }

            //点击统计上报
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_SHARE');
            } else {
                user_log('CATEGORY_'+ this.module_name.toUpperCase() +'_HOVERBAR_SHARE');
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e, extra) {

            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(record, e);
                });
            } else {
                downloader.down(record, e);
            }
            //点击统计上报
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_DOWNLOAD');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_DOWNLOAD');
            }
        },
        /**
         * 获取二维码操作
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_qrcode: function(records, e, extra) {
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();

            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//file_qrcode
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(records);
                });
            } else {
                file_qrcode.show(records);
            }
            if(from_menu){
                user_log('FILE_QRCODE_' + this.module_name.toUpperCase() + '_RIGHT');
            }else{
                user_log('FILE_QRCODE_' + this.module_name.toUpperCase() + '_ITEM');
            }
        },
        /**
         * 右键跳转至具体路径
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_jump: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(records.length == 1) {
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }

            //if(from_menu) {
            //    user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_JUMP');
            //}
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            global_event.trigger(this.module_name + '_refresh');
        },

        /**
         * 计算出符合阅读的文件名
         * @param {String} file_name
         * @returns {String} name
         */
        get_realable_name: function(file_name) {
            var append_str = file_name.slice(file_name.length-6),
                cut_len = 16;

            file_name = text.smart_sub(file_name.slice(0, file_name.length-6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            return file_name;
        },
        /**
         * 判断是否要补充数据
         */
        supply_files_if: function() {
            if (!this.loader.is_loading() && this.scroller.is_reach_bottom()) {
                if(this.loader.is_all_load_done()){
                    if(this.store.size()===0){
                        this.store.load([]);
                    }
                }else{
                    this.load_files(this.store.size(), this.step_num);
                }
            }
        },
        /**
         * 分批加载数据
         * @param cfg 拉取请求配置
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(cfg, is_refresh) {
            var me = this,
                store = me.store,
                loader = me.loader;

            loader.load({
                offset: cfg.offset || 0,
                count: cfg.count || this.first_page_num,
                sort_type: cfg.sort_type || 'mtime',
                filter_type: cfg.filter_type
            }, function(rs) {
                if(cfg.offset === 0) {//开始下标从0开始表示重新加载
                    store.load(rs);
                } else {
                    store.add(rs, store.size());
                }

                /*if(is_refresh) {
                    mini_tip.ok('列表已更新');
                }*/
            });
        },
        /**
         * 配置分批加载数据的辅助判断工具
         * @param scroller
         */
        set_scroller: function(scroller) {
            this.scroller = scroller;
        },
        /**
         * 配置首屏显示文件个数
         * @param first_page_num
         */
        set_first_page_num: function(first_page_num) {
            this.first_page_num = first_page_num;
        }
    });
    return Mgr;
});