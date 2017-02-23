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

        Select = require('./time.Select'),
        item_maps = {
            //时间轴
            time: {
                download: 1,
                'delete': 1,
                share: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;

    var menu = new Module('photo_time_menu', {

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
        get_photo_context_menu: function (records, e) {
            var visible_items = $.extend({}, item_maps.time);
            if(records.length > 1 ){
                delete visible_items['download'];
                delete visible_items['share'];
                delete visible_items['qrcode'];
                delete visible_items['jump'];
            }
            this.context_records = records;
            this.photo_time_menu = this.photo_time_menu || this._create_photo_time_menu();
            this.photo_time_menu.show(e.pageX, e.pageY, visible_items);

            return this.photo_time_menu;
        },
        /**
         * 隐藏相册时间轴右键菜单
         */
        hide_photo_time_menu: function(){
            this.photo_time_menu && this.photo_time_menu.hide();
        },

        _create_photo_time_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            var me = this;
            switch (id) {
                case 'share':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'delete':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'download':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
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
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
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
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
            }
        }
    });
    return menu;
});