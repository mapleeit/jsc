/**
 *
 * @author hibincheng
 * @date 2015-05-08
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        tmpl = require('./tmpl'),
        main_ui = require('main').get('./ui'),
        global_event = common.get('./global.global_event'),

        image_lazy_loader = require('./image_lazy_loader'),
        list_hover_class = 'list-hover',

        sel_box,

        get_el = function (id) { return document.getElementById(id); },

        undefined;

    var File_view = inherit(View, {

        list_selector: '#_station_view_list>.files',
        item_selector: 'div[data-file-id]',
        action_property_name: 'data-action',
        record_dom_map_perfix: 'station-item-',


        _select_items_cnt: 0,//已勾选的文件个数

        list_tpl: function () {
            return tmpl.station_list();
        },

        tpl: function (file) {
            return tmpl.file_item([file]);
        },

        get_html: function (files) {
            return tmpl.file_item(files);
        },
        shortcuts: {
            selected: function (value) {
                //$(this).toggleClass('ui-selected', value);
                if (sel_box)
                    sel_box.set_selected_status([this.attr('id')], value);
            },
            filename: function(value, $item, record) {
                if(record.is_image()) {
                    var $icon = this.find('.filetype');
                    $icon.attr('src', $icon.attr('data-src'));
                }

                $(this).find('[data-name=file_name]').text(value);
            }
        },

        get_record_by_id: function (id) {
            return this.store.get(id);
        },

        //插入记录，扩展父类
        on_add: function (store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            var prefix = this.record_dom_map_perfix;
            $.each(records, function(i, item) {
                if(item.get('selected')) {
                    sel_box.set_selected_status([prefix + item.id], true);
                }
            });

        },

        after_render: function () {
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_item_click, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

        },

        on_show: function () {
            this._enable_box_selection();
            this._activated = true;
        },

        on_hide: function () {
            //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
            this.copy && this.copy.destroy();
            this.copy = null;
            this._disable_box_selection();
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        //启用框选
        _enable_box_selection: function () {
            var me = this,
                sel_box = this._get_sel_box();

            sel_box.enable();

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var sel_cnt = 0;
                for (var el_id in sel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', true, true);
                        sel_cnt++;
                    }
                }
                for (var el_id in unsel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', false, true);
                    }
                }

                me._block_hoverbar_if(sel_cnt);
                me.trigger('box_select');
            });
        },

        //禁用框选
        _disable_box_selection: function () {
            var sel_box = this._get_sel_box();
            sel_box.disable();

            this.stopListening(sel_box, 'select_change');
        },

        on_datachanged: function () {
            var me = this;
            File_view.superclass.on_datachanged.apply(this, arguments);
            if (this.store.size() === 0) {//无数据时，显示空白运营页

                this.get_$view_ct().addClass('ui-view-empty');
            } else {
                this.get_$view_ct().removeClass('ui-view-empty');
            }
        },

        _handle_action: function (action, record, e) {
            switch (action) {
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        _handle_item_click: function (record, e) {
            var $target = $(e.target);
            var $record = $target.closest(this.item_selector);
            var is_checkbox = $target.closest('.checkbox', $record).length;
            var is_data_action = !!$target.closest('[' + this.action_property_name + ']').length;
            var last_click_record = this.last_click_record,
                store = this.store,
                index = store.indexOf(record),
                start, end,
                multi_select = false,
                clear_selected = true;
            if (is_data_action) {//如果是功能性操作直接返回，对应的mgr中已有相应处理
                return;
            } else if(!is_checkbox) {//不是勾选则是直接打开文件
                this.trigger('action', 'open', record, e);
                return;
            }
            if (is_checkbox || e.ctrlKey || e.metaKey) { // 如果是checkbox或按了ctrl键，不清除已选项
                clear_selected = false;
            }
            // 如果按了shift，表示区域选择
            if (e.shiftKey) {
                multi_select = true;
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
                this.last_click_record = record;
            } else { // 否则，只选或反选这条，记录当前操作的记录
                if(!record.get("selected")){
                    this.last_click_record = record;
                }
            }

            store.each(function (rec, idx) {
                var selected, old_selected = rec.get('selected');
                // 是否是操作目标
                var in_range = multi_select ? (idx >= start && idx <= end || idx >= end && idx <= start) : idx === index;
                if (multi_select) { // 多选时，范围内的必定选中，范围外的如果没有ctrl则不选，如果有则保持
                    if (in_range) {
                        selected = true;
                    } else {
                        selected = clear_selected ? false : old_selected;
                    }
                } else { // 单选时
                    if (clear_selected) { // 如果没按ctrl，目标记录一定选中，其它的则不选
                        selected = in_range;
                    } else { // 如果按了ctrl，其它记录不变，目标记录切换状态
                        selected = in_range ? !old_selected : old_selected;
                    }
                }
                if (selected !== old_selected) {
                    rec.set('selected', selected);
                }
            });
            this._block_hoverbar_if(this.get_selected_files().length);
        },
        /**
         * 获取已选择的列表项
         * @returns {Array}
         */
        get_selected_files: function() {
            var store = this.store,
                selected_files = [];
            $.each(store.data, function(i, item) {
                if(item.get('selected')) {
                    selected_files.push(item);
                }
            });

            return selected_files;
        },

        show_ctx_menu: function (record, e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                $target_item = $(e.target).closest(me.item_selector),
                $view_ct = this.get_$view_ct(),
                records;

            if(record.get('selected')){
                records = this.get_selected_files();
            }else{
                this.store.each(function (rec, idx) {
                    rec.set('selected', false);
                });
                record.set('selected', true);
                records = [record];
            }

            var x = e.pageX,
                y = e.pageY;

            if(records.length > 1) {
                items = [
                    {
                        id: 'download',
                        text: '下载',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'share',
                        text: '分享',
                        icon_class: 'ico-share',
                        group: 'share',
                        split: true,
                        click: default_handle_item_click
                    }
                ];
            } else {
                items = [
                    {
                        id: 'download',
                        text: '下载',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },/*
                    {
                        id: 'rename',
                        text: '重命名',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },*/
                    {
                        id: 'qrcode',
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'qrcode',
                        split: true,
                        click: default_handle_item_click
                    },
                    {
                        id: 'share',
                        text: '分享',
                        icon_class: 'ico-share',
                        group: 'share',
                        split: true,
                        click: default_handle_item_click
                    }
                ];
            }

            menu = new ContextMenu({
                items: items
            });


            menu.on('hide', function () {
                $view_ct.removeClass('block-hover');
                $target_item.removeClass('context-menu');
            });

            $view_ct.addClass('block-hover');
            $target_item.addClass('context-menu');

            menu.show(x, y);

            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, records, e);
            }
        },


        set_$last_hover_item: function ($item) {
            this._$last_hover_item = $item;
        },
        get_$last_hover_item: function () {
            return this._$last_hover_item;
        },

        // 显示loading
        on_beforeload: function () {
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load: function () {
            this.get_$load_more().hide();
        },

        on_before_refresh: function () {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function () {
            this.last_expanded_record = null;
            this.last_click_record = null;
            this.set_$last_hover_item(null);
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
            image_lazy_loader.init(this.get_$view_list());
            //测速
            try {
	            var flag = '21254-1-17';
	            if(window.g_start_time) {
		            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		            huatuo_speed.report();
	            }
            } catch (e) {

            }
        },
        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                this.get_$view_ct().addClass('block-hover');
            } else {
                this.get_$view_ct().removeClass('block-hover');
            }
        },

        get_$view_empty: function () {
            // return this.$view_empty || (this.$view_empty = $('#_share_view_empty'));
        },

        get_$main_bar1: function () {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },

        get_$view_list: function () {
            return this.$view_list || (this.$view_list = $('#_station_view_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_station_body'));
        },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        _get_sel_box: function () {
            if (!sel_box) {
                var SelectBox = common.get('./ui.SelectBox');
                var $list = $(this.list_selector);
                sel_box = new SelectBox({
                    ns: 'station',
                    $el: $list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    all_same_size: false,
                    keep_on: function ($tar) {
                        return $tar.is('label');
                    },
                    clear_on: function ($tar) {
                        return $tar.closest('[data-record-id]').length === 0;
                    },
                    container_width: function () {
                        return $list.width();
                    }
                });
            }
            return sel_box;
        }
    });
    return File_view;
});