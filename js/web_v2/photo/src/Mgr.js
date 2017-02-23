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
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        Remover = require('./Remover'),
        time_store = require('./time.Store'),
        DEFAULT_PAGE_SIZE = 100,
        share_enter,
        downloader,
        file_qrcode,
        undefined;

    var TIP_TEXT = {
        photo_time: '时间',
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
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                    return false;// 不再触发recordclick
                }, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {
                    var records = this.view.get_selected();
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
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        // 删除
        on_delete : function(nodes, event){
            this.do_delete(nodes);
        },
        get_tip_text: function() {
            return TIP_TEXT[this.module_name];
        },
        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete : function(records, callback, scope){
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                time_store.batch_remove(success_nodes);
                //me.view.remove_refresh(success_nodes);
                me.view.cancel_sel();
                if(callback && typeof callback === 'function') {
                    callback.call(scope, true);
                }
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择' + this.get_tip_text());
                return;
            }
            this.do_delete(records);
        },

        // 直接点击记录
        on_open : function(records, e){
            var record = records[0];
            // 如果可预览，预览之
            if(e.target && e.target.tagName.toUpperCase() === 'INPUT') {//得命名时，点击文本框，不进行预览
                return;
            }

            e.preventDefault();
            this.preview_image(record);
        },

        /**
         * 图片预览（重写 FileListUIModule 的默认实现）
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        preview_image: function (file) {
            var me = this;

            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前目录下的图片
                var images = [];
                var read_images = function(){
                    me.store.each(function(record){
                        images.push(record);
                    });
                };
                read_images();
                image_preview.start({
                    complete : me.store.is_complete(),
                    total: images.length,
                    index: $.inArray(file, images),// 当前图片所在的索引位置
                    images: images,
                    load_more: function( callback ){
                        // 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
                        if(!me.store.is_complete()){ // 未加载，尝试加载之
                            me.load_files().done(function(){
                                images.splice(0, images.length);
                                read_images();

                                callback({
                                    'total': images.length,
                                    'complete': me.store.is_complete(),
                                    'images': images
                                });

                            }).fail(function(){
                                callback({ 'fail': true });
                            });
                        }
                        //加载完了
                        else{
                            callback({
                                'total': images.length,
                                'complete': me.store.is_complete(),
                                'images': images
                            });
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        downloader.down(file, e);
                    },
                    share: function(index){
                        require.async('share_enter', function(share_enter){
                            share_enter.get('./share_enter').start_share(images[index]);
                        });
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function(success){
                            if(success){
                                images.splice(index, 1);
                            }
                            callback();
                        });
                    }
                });
            });
        },
        /**
         * 排序操作
         * @param {String} sort_type 排序类型
         */
        on_sort: function(records, e) {
            var sort_type = extra.data;
            var size = this.store.size();
            if((size === 0 || size === 1) && this.loader.is_all_load_done()) {//无数据，就不排序了
                return;
            }
            this.load_files();
        },
        /**
         * 过滤文件类型操作
         * @param {String} filter_type 要过滤的文件类型
         */
        on_filter: function(records, e) {
        },
        /**
         * 重命名操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_rename: function(records, e) {

        },
        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_share: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(record);
                });
            } else {
                share_enter.start_share(record);
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(record, e);
                });
            } else {
                downloader.down(record, e);
            }
        },
        /**
         * 获取二维码操作
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_qrcode: function(records, e) {
            e.preventDefault();
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//file_qrcode
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(records);
                });
            } else {
                file_qrcode.show(records);
            }
        },
        /**
         * 右键跳转至具体路径
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         */
        on_jump: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(records.length == 1) {
                this.view.cancel_sel();
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }
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
                    this.load_files();
                }
            }
        },
        /**
         * 分批加载数据
         */
        load_files: function(is_refresh) {
            var me = this,
                store = me.store,
                offset = is_refresh? 0 : store.size(),
                loader = me.loader;

            loader.load_photos(offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                if(offset === 0) {//开始下标从0开始表示重新加载
                    me.store.load(records, is_finish ? null : Number.MAX_VALUE);
                } else {
                    me.store.add(records);
                }
            }).fail(function(msg){
                //todo
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