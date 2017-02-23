/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        collections = lib.get('./collections'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        Scroller = common.get('./ui.scroller'),
        ContextMenu = common.get('./ui.context_menu'),
        store = require('./store'),
        selection = require('./selection'),
        image_lazy_loader = require('./image_lazy_loader'),
        ad_link = require('./ad_banner.ad_link'),
        tmpl = require('./tmpl'),
        reach_bottom_px = 300,   // 距离页面底部300px时加载文件


        undefined;

    var file_list = new Module('outlink.file_list', {

        render: function() {
            if(this._inited) {
                return;
            }

            this.scroller = new Scroller(this.get_$main_box());

            this.bind_events();

            this.ajaust_size();

            selection.init(true);
            image_lazy_loader.init(this.get_$ct_list(), this.scroller);

            $('html').css('overflow', 'hidden');//避免出现滚动条
            this._inited = true;
        },

        bind_events: function() {

            var me = this;
            this.listenTo(store, 'before_refresh', function() {
                me.get_$ct_list().empty();
                widgets.loading.show();
            }).listenTo(store, 'refresh_done', function(files) {
                me.on_refresh(files);
                widgets.loading.hide();
                selection.clear();
            }).listenTo(store, 'before_load', function() {
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
            }).listenTo(store, 'load_fail', function(msg, ret) {
                mini_tip.warn(msg);
                widgets.loading.hide();
            });

            this.listenTo(ad_link, 'show_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height - 100)+ "px");
            }).listenTo(ad_link, 'hide_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            }).listenTo(ad_link, 'remove_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            });

            this.get_$ct_list().on('click', '[data-file-id]', function(e) {
                var $target = $(e.target),
                    file_id = $target.closest('[data-file-id]').attr('data-file-id');

                if($target.is('.checkbox')) {
                    selection.toggle_select(file_id);
                } else {
                    me.trigger('action', 'enter', file_id, e);
                }
            }).on('contextmenu', function(e) {
                me.show_ctx_menu(e);
            });

            this.listenTo(this.scroller, 'scroll', function() {
                if(me.is_reach_bottom()) {
                    store.load_more();
                }
            });

            this.listenTo(global_event, 'window_resize', function() {
                me.ajaust_size();
            });
        },

        show_ctx_menu: function(e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                is_temporary = store.get_share_info()['share_flag'] == 12,
                $target_item = $(e.target).closest('[data-file-id]'),
                target_file_id = $target_item.attr('data-file-id'),
                selected_items = selection.get_selected();

            var target_in_selected = collections.any(selected_items, function(item) {
                if(item.get_id() === target_file_id) {
                    return true;
                }
            });

            //目标不在选择文件里
            if(!target_in_selected) {
                selection.clear();
                selection.select(target_file_id);
                selected_items = selection.get_selected();
            }

            var has_note = false;
            $.each(selected_items, function(i, item) {
                if(item.is_note()) {
                    has_note = true;
                    return false;
                }
            });

            var x = e.pageX,
                y = e.pageY;
            if(has_note) {
                items = [{
                    id: 'store',
                    text: '保存到微云',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                }];
            } else {
                items = [{
                    id: 'download',
                    text: '下载',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                },{
                    id: 'store',
                    text: is_temporary ? '保存到中转站' : '保存到微云',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                }];
            }

            menu = new ContextMenu({
                items: items
            });

            $target_item.addClass('context-menu');

            menu.show(x, y);
            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, selected_items, e);
            }
        },

        ajaust_size: function() {
            var top_h = $('#top').height(),
                win_h = $(window).height();

            this.get_$main().height(win_h - top_h);
        },

        on_refresh: function(files) {
            this.get_$ct_list().empty();
            if(!files || !files.length) {
                this.view_empty();
            } else {
                this.get_$disk_view().removeClass('ui-view-empty');
                this.get_$ct_list().append(tmpl.file_list(files)).show();
                image_lazy_loader.load_image();
                //if(this.get_$main_box().height() < $(window).height() - this.get_$top().height() && !store.get_cur_node().is_load_done()) {
                if(this.is_reach_bottom()) {
                    store.load_more();
                }
            }
        },

        on_add: function(files) {
            if(!files || !files.length) {
                return;
            }
            this.get_$ct_list().append(tmpl.file_list(files));
        },

        view_empty: function() {
            this.get_$ct_list().hide();
            this.get_$disk_view().addClass('ui-view-empty');
        },

        note_preview: function(note, extra) {

        },

        is_reach_bottom: function() {
            var $list = this.get_$ct_list(),
                $main = this.get_$main_box();

            var main_h = $main.height(),
                scroll_top = $main[0].scrollTop,
                list_h = $list[0].scrollHeight;

            if(main_h + scroll_top > list_h - reach_bottom_px) {
                return true;
            }

            return false;
        },

        get_$top: function() {
            return this._$top = this._$top || (this._$top = $('#top'));
        },

        get_$ct_list: function() {
           return this._$ct_list = this._$ct_list || (this._$ct_list = $('#_file_list'));
        },

        get_$main: function() {
           return this._$main = this._$main || (this._$main = $('#lay-main-con'));
        },

        get_$main_box: function() {
            return this._$main_box = this._$main_box || (this._$main_box = $('#_main_box'));
        },

        get_$disk_view: function() {
            return this._$disk_view = this._$disk_view || (this._$disk_view = $('#_disk_view'));
        }
    });

    return file_list;
});