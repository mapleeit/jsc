/**
 * 右键菜单UI逻辑
 * @author trump
 * @date 13-11-09
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),

        //多选状态下应该剔除的右键菜单项
        item_maps = {
            //分组
            group: {
                rename: 1,
                remove: 1,
                set_cover: 1
            },
            detail: {
                download: 1,
                'delete': 1,
                set_group: 1,
                set_as_cover: 1,
                share: 1,
                qrcode: 1,
                jump: 1
            },
            photo: {
                download: 1,
                'delete': 1,
                share: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;

    var menu = new Module('photo_ctx_menu', {

        render: function () {
            var me = this;
            me.photo_time_menu = me._create_photo_time_menu();
        },

        get_photo_context_menu: function(records, e) {
            var visible_items = $.extend({}, item_maps.photo);
            if(records.length>1) {
                visible_items = {
                    'delete' : 1
                }
            }

            this.context_records = records;
            this.photo_ctx_menu = this.photo_ctx_menu || this.create_photo_menu();
            this.photo_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.photo_ctx_menu;
        },

        create_photo_menu: function() {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ]
            });

            return menu;
        },

        get_group_context_menu: function(record, e) {
            var visible_items = $.extend({}, item_maps.group);
            if(record.get('readonly')){
                visible_items = {
                    set_cover : 1
                };
            }
            this.context_record = record;

            this.group_ctx_menu = this.group_ctx_menu || this.create_group_menu();
            this.group_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.group_ctx_menu;
        },

        create_group_menu: function() {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('rename'),
                    me.create_item('remove'),
                    me.create_item('set_cover')
                ]
            });

            return menu;
        },

        get_detail_context_menu: function(records, e) {
            var visible_items = $.extend({}, item_maps.detail);
            if(records.length>1) {
                visible_items = {
                    set_group: 1,
                    'delete' : 1
                }
            }

            this.context_records = records;

            this.detail_ctx_menu = this.detail_ctx_menu || this.create_detail_menu();
            this.detail_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.detail_ctx_menu;
        },

        create_detail_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('set_as_cover'),
                    me.create_item('set_group'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ]
            });

            return menu;
        },

        hide_menu: function() {
            this.group_ctx_menu && this.group_ctx_menu.hide();
            this.detail_ctx_menu && this.detail_ctx_menu.hide();
            this.photo_ctx_menu && this.photo_ctx_menu.hide();
        },

        create_item: function (id) {
            var me = this;
            switch (id) {
                case 'rename':
                    return {
                        id: id,
                        text: '重命名',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'remove':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'set_cover':
                    return {
                        id: id,
                        text: '更改封面',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'share':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
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
                            me.hide_menu();
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
                            me.hide_menu();
                        }
                    };
                case 'set_as_cover':
                    return {
                        id: id,
                        text: '设置为封面',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'set_group':
                    return {
                        id: id,
                        text: '更改分组',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
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
                            me.hide_menu();
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
                            me.hide_menu();
                        }
                    };
            }
        }
    });
    return menu;
});