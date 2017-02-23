/**
 * 管理器
 * @author hibincheng
 * date 2015-05-08
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        request = common.get('./request'),
        Record = lib.get('./data.Record'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),

        Remover = require('./Remover'),
        Rename = require('./Rename'),
        downloader,
        share_enter,
        file_qrcode,
            undefined;

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
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    e.preventDefault();
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件（工具栏（取消分享）、表头（全选，排序操作））
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {

                    if(action_name === 'checkall' || action_name === 'change_checkall') {
                        this.process_action(action_name, data, e);
                        return;
                    }
                    var records = this.view.get_selected_files();
                    if(action_name !== 'refresh' && !records.length) {
                        mini_tip.warn('请选择文件');
                        return;
                    }
                    e = data;
                    this.process_action(action_name, records, e);
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
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },
        /**
         * 框选处理，更改表头全选状态
         */
        on_box_select: function() {
            this.header.on_data_update(this.store);
        },
        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {
            this.store.each(function(item) {
                item.set('selected', checkalled);
            });

            this.loader.set_checkalled(checkalled);
            user_log('SHARE_SELECT_ALL');

        },

        /**
         * 更改全选状态
         * @param checkalled
         */
        on_change_checkall: function(checkalled) {
            this.loader.set_checkalled(checkalled);
        },


        /**
         * 判断是否要补充数据
         */
        supply_files_if: function() {
            if (!this.loader.is_loading() && this.scroller.is_reach_bottom()) {
                if(this.loader.is_all_load_done()){
                    if(this.store.size()==0){
                        this.store.load([]);
                    }
                }else{
                    this.load_files(this.store.size(), this.step_num);
                }
            }
        },

        /**
         * 刷新操作
         * @param e
         */
        on_refresh: function(e) {
            global_event.trigger('station_refresh');//保持原有逻辑，直接触发
        },

        on_open: function(records, e) {
            if(this.rename && this.rename.renaming) { //正在修改名称中
                return
            }
            var cur_record = $.isArray(records) ? records[0] : records;
            //目录点击文件点支持图片预览
            if(!cur_record.is_image()) {
                this.on_download(records, e);
                return;
            }

            var me = this;
            this.appbox_preview(cur_record).fail(function () {
                me.preview_image(cur_record);
            });

        },

        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} record
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (record) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(record.get_name())) ||
                    (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(record.get_name()))
                    );

            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        if(record.is_image()) {
                            full_screen_preview.preview_img(record.get_thumb_url() + '&size=1024*1024', record.get_name());
                        } else {
                            full_screen_preview.preview(record);
                        }
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + record.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },

        preview_image: function(record) {

            var all_images = [];
            this.store.each(function(item) {
                if(item.is_image()) {
                    all_images.push(item);
                }
            });

            var me = this;
            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前图片所在的索引位置
                var index = $.inArray(record, all_images);
                image_preview.start({
                    total: all_images.length,
                    index: index,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return all_images[index].get_thumb_url() + '&size=64*64';
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return all_images[index].get_thumb_url()+ '&size=1024*1024';
                    },
                    download: function(index, e) {
                        me.on_download(all_images[index], e);
                    }
                });
            });

        },

        on_delete: function(records, e) {
            records = $.isArray(records) ? records : [records];
            var me = this;
            records = [].concat(records);
            this.remover = this.remover || new Remover();
            this.remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.supply_files_if();
                me.header.update_info();
            })
        },

        on_share: function(records, e) {
            records = $.isArray(records) ? records : [records];
            if(!share_enter) {
                require.async('share_enter', function (mod) {//异步加载downloader
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records);
                });
            } else {
                share_enter.start_share(records);
            }
        },

        on_download: function(records, e) {
            records = $.isArray(records) ? records : [records];
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(records, e);
                });
            } else {
                downloader.down(records, e);
            }
        },

        on_qrcode: function(record, e) {
            record = $.isArray(record) ? record : [record];
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//异步加载downloader
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(record);
                });
            } else {
                file_qrcode.show(record);
            }
        },

        on_rename: function(record, e) {
            if($.isArray(record) && record.length > 1) {
                mini_tip.warn('只能对单个文件进行重命名');
                return;
            }
            record = $.isArray(record) ? record[0] : record;
            var $file_name = this.view.get_dom(record).find('[data-name=file_name]');
            this.rename = this.rename || new Rename();
            this.rename.start(record, $file_name, e);
        },
        /**
         * 分批加载数据
         * @param offset 开始的下标
         * @param num 加数的数据量
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(offset, num, is_refresh) {
            this.store.load([]);
            //var me = this,
            //    store = me.store,
            //    loader = me.loader;
            //
            //loader.load({
            //    start: offset,
            //    count: num
            //}, function(rs, total) {
            //    if(offset === 0) {//开始下标从0开始表示重新加载
            //        store.load(rs);
            //    } else {
            //        store.add(rs, store.size());
            //    }
            //});
        },
        /**
         * 配置分批加载数据的辅助判断工具
         * @param {Scroller} scroller
         */
        set_scroller: function(scroller) {
            this.scroller = scroller;
        }
    });
    return Mgr;
});