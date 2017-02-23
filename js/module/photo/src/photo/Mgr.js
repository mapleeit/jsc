/**
 * 
 * @author cluezhang
 * @date 2013-11-7
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        console = lib.get('./console'),
        
        common = require('common'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        
        Remover = require('./Remover'),
        
        $ = require('$');
    var Mgr = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
            this.init_operators();
        },
        init_operators : function(){
            var me = this;
            require.async('downloader', function(downloader){
                me.downloader = downloader.get('./downloader');
            });
            require.async('file_qrcode', function(file_qrcode){
                me.file_qrcode = file_qrcode.get('./file_qrcode');
            });
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
        on_open : function(records, event){
            if (scr_reader_mode.is_enable()) {
                return this.on_download(records, event);
            }

            var me = this;
            var node = records[0];
            me.appbox_preview(node).fail(function () {
                me.preview_image(node);
            });
            return;
        },
        on_qrcode : function(records, event){
            var me = this;
            if(me.file_qrcode){
                me.file_qrcode.show(records);
                user_log('FILE_QRCODE_PHOTO_RIGHT');
            }
        },
        on_download : function(records, event){
            // 其他文件，下载
            var me = this;
            if(me.downloader){
                me.downloader.down(records[0], event);
            }
        },
        // 删除
        on_delete : function(nodes, event){
            this.do_delete(nodes);
        },
        on_jump: function(records, event, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            event.preventDefault();
            if(records.length == 1) {
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }
        },
//        when_remover_ready : function(){
//            var def = $.Deferred(),
//                me = this,
//                remover = me.remover;
//            
//            if(remover){
//                def.resolve(remover);
//            }else{
//                require.async('disk', function(disk){
//                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
//                    remover.render();
//                    def.resolve(remover);
//                });
//            }
//            
//            return def;
//        },
//        get_delete_params : function(first_file_name, count){
//            return {
//                title : '删除图片',
//                thing : '图片',
//                single_unit : '张',
//                multi_unit : '些',
//                up_msg : count>1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？'
//            }; 
//        },

        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete: function(nodes, callback, scope) {
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(nodes).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                ds_event.trigger('remove', success_nodes, {
                    src : me.store
                });
                if(callback){
                    callback.call(scope, true);
                }
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
            this.do_delete(records);
        },
        on_share : function(records){
            require.async('share_enter', function(share_enter){
                share_enter.get('./share_enter').start_share(records[0]);
            });
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
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
                        (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
                    );

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
                            me.store.load_more().done(function(){
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
                    code: function(index){
                        var file = images[index];
                        if(me.file_qrcode){
                            me.file_qrcode.show([file]);
                        }
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
        }
    });
    return Mgr;
});