/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author trump
 * @date 13-11-09
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        photo_time_event = common.get('./global.global_event').namespace('photo_time_event'),
        click_tj = common.get('./configs.click_tj'),

        Select = require('./time.Select'),
        item_maps = {
            //时间轴
            time: {
                download_time: 1,
                remove_time: 1,
                share_time: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;
    var menu = new Module('photo_file_menu', {

        render: function () {
            var me = this;
            me.photo_time_menu = me._create_photo_time_menu();
        },

        /**
         * 显示相册时间轴右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_photo_time_menu: function (x, y, $on) {
            var visible_items = $.extend({}, item_maps.time);
            if( Select.get_selected_length() > 1 ){
                delete visible_items['download_time'];
                delete visible_items['share_time'];
                delete visible_items['qrcode'];
                delete visible_items['jump'];
            }
            this.photo_time_menu.show(x, y, visible_items, $on);
        },
        /**
         * 隐藏相册时间轴右键菜单
         */
        hide_photo_time_menu: function(){
            this.photo_time_menu.hide();
        },

        _create_photo_time_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('download_time'),
                    me.create_item('remove_time'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share_time')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            switch (id) {
                case 'share_time':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            photo_time_event.trigger('share_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'remove_time':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('remove_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'download_time':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('download_time', e);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'jump':
                    return {
                        id: id,
                        text: '查看所在目录',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('jump');
                            menu.hide_photo_time_menu();
                            //user_log('FILE_QRCODE_PHOTO_RIGHT');
                        }
                    };
                case 'qrcode':
                    return {
                        id: id,
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'edit',
                        split: true,
                        click: function (e) {
                            photo_time_event.trigger('qrcode_file');
                            menu.hide_photo_time_menu();
                            user_log('FILE_QRCODE_PHOTO_RIGHT');
                        }
                    };
            }
        }
    });
    return menu;
});