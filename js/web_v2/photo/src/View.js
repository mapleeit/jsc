/**
 * 库分类（文档、视频、音频）列表视图类
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        image_loader = lib.get('./image_loader'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        blank_tip = common.get('./ui.blank_tip'),
        ThumbHelper = common.get('./ui.thumb_helper'),

        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        SelectBox = common.get('./ui.SelectBox'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        Thumb_loader = require('./Thumb_loader'),
        time_store = require('./time.Store'),

        thumb_loader = new Thumb_loader({
            width : 256,
            height : 256
        }),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        thumb_helper,
        undefined;

    var File_view = inherit(View, {

        module_name: '',
        list_selector : '',
        item_selector : 'li[data-record-id]',
        action_property_name : 'data-action',

        enable_box_select : true,
        enable_select : true,

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        scroller : main_ui.get_scroller(),
        //enable_empty_ui : true,
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;
        },

        list_tpl : function(){
            return tmpl[this.module_name+'_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_file_item']([file]);
        },

        get_html : function(records){
            if(this.module_name === 'photo_time') {
                records = time_store.init_data(records);
                if(records.length && records[0].offset) {
                    //防止超过100的，这里用-1来标识
                    var is_finish = (records[0].length >= 100 || records.length === 1)? false : true;
                    records[0].set_offset(is_finish? 0 : -1);
                    this.append_$items(records[0]);
                    records = records.slice(1);
                }
            }
            return tmpl[this.module_name+'_file_item']({
                records : records,
                item_width: this.get_item_width()
            });
        },

        item_menu_class : 'context-menu',
        shortcuts: {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            selected: function(checked, view) {
                //todo
            },
            //实际上对应的是File_object的属性
            _name: function(name) {
                var can_ident = file_type_map.can_identify(File.get_ext(name)),
                    $dom = $(this),
                    is_video = $dom.attr('data-video');//视频要显示出后缀名

                $dom.find('[data-name=file_name]').attr('title', name).text(can_ident && !is_video ? name.slice(0,name.lastIndexOf('.')) : name);
            }
        },

        on_show: function() {
            this._activated = true;
        },

        on_hide: function() {
            this._activated = false;
            this.disable_selection();
            this.cancel_sel();
            time_store.destroy();
        },

        is_activated: function() {
            return this._activated;
        },

        //插入记录，扩展父类
        on_add: function(store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_update : function(){
            File_view.superclass.on_update.apply(this, arguments);
            this.update_thumb();
        },
        refresh : function(){
            File_view.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },

        after_render : function(){
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_record_click, this);

            thumb_helper = new ThumbHelper({
                container: '#_photo_time_body',
                height_selector: '.figure-list-item-pic',
                item_selector: 'li[data-record-id]'
            });
        },

        on_datachanged: function() {
            File_view.superclass.on_datachanged.apply(this, arguments);
            if(this.store.size() === 0) {//无数据时，显示空白运营页
                this.refresh_empty_view();
                this.get_$view_ct().hide();
            } else {
                this.init_sel_box();
                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$view_ct().show();
            }
        },

        /**
         * 插入同个日期的数据
         */
        append_$items: function(group) {
            var $ct = $('#time_' + group.get_day_id());
            $(tmpl.photo_time_file_cell({records: group.get_array()})).appendTo($ct.find('.figure-list'));
        },

        _handle_select_change: function() {
            var records = this.Select.get_selected_nodes();
            this.show_edit(records);
        },

        _handle_record_click: function (file, e) {
           var $target = $(e.target),
               $item = $target.closest('li[data-list]'),
               is_check = $target.closest('.icon-check-m').length > 0;
            if(is_check) {
                //勾选文件
                this.Select.select($item, file.get_id());
                file.set('selected', true);
                this.show_edit();
            } else {
                this.trigger('action', 'open', file, e);
            }
        },

        show_edit: function(records) {
            records = records || this.get_selected();
            if(!records || records.length === 0) {
                main_ui.toggle_edit(false);
            } else {
                main_ui.toggle_edit(true, records.length);
            }
        },

        cancel_sel: function() {
            var records = this.Select.get_selected_nodes();
            $.each(records, function(i, record) {
                record.set('selected', false);
            });
            this.Select.clear();
            main_ui.toggle_edit(false);
        },

        set_selected : function(records){
            records = $.isArray(records) ? records : [records];
            var file_id,
                me = this,
                $ct = this.get_$view_ct();
            $.each(records, function(i, record) {
                file_id = record.get_id();
                if (!me.Select.is_selected(file_id)) {
                    me.Select.select($ct.find('[data-record-id='+file_id+']'), file_id);
                }
            });
        },

        get_selected : function(){
            if(this.enable_select){
                return this.Select.get_selected_nodes();
            }
            return [];
        },

        _if_block_hover : function(){
            var $view_ct = this.get_$view_ct();
            $view_ct.toggleClass('block-hover', !!this.is_multi_selection || !!this.is_menu_on);
        },

        /**
         * 删除图片
         */
        delete_item: function(record) {
            var dom_id = this.Select.get_dom_id(record.get_id());
            var $dom = $('#' + dom_id);
            if($dom) {
                $dom.remove();
            }
            this.refresh_empty_view();
            ////更新空页面状态
            //File_view.superclass.refresh_empty_text.apply(this, arguments);
        },

        /**
         * 删除图片日期分组
         */
        delete_group: function(group) {
            var day_id = group.get_day_id();
            var $dom = $('#time_' + day_id);
            if($dom) {
                $dom.remove();
            }
            this.refresh_empty_view();
        },

        refresh_empty_view: function() {
            if(this.store.size() === 0) {
                if(!this.$view_empty) {
                    this.show_empty_ui();
                } else if(!this.get_$view_empty().length){
                    this.$view_empty.appendTo(this.get_$view_ct());
                } else{
                    this.get_$view_empty().show();
                }
            }
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$view_empty && this.$view_empty.hide();
        },
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$view_empty = blank_tip.show({
                id: 'j-photo-time-empty',
                to: this.get_$view_ct(),
                icon_class: 'icon-nopicture',
                title: '暂无图片',
                content: '请点击右上角的“添加”按钮添加'
            });
        },
        /**
         * 勾选文件
         * @param e
         */
        select_file: function (e) {
            e.stopPropagation();
            var me = View,
                file = me.get_file_by_el(this);
            this.Select[ file.toggle_check() ? 'select' : 'un_select'](me.get_$item(this), file.get_id());
        },
        /**
         * 禁用框选
         */
        disable_selection: function () {
            this.stopListening(this.Select, 'select_change', this._handle_select_change);
            this.sel_box && this.sel_box.disable();
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            this.sel_box && this.sel_box.enable();
        },

        init_sel_box: function() {
            if(this.sel_box) {
                //this.Select.bind_select_box(this.store, this.sel_box);
                this.listenTo(this.Select, 'select_change', this._handle_select_change);
                this.enable_selection();
                return;
            }
            var me = this;
            me.sel_box = new SelectBox({
                ns: 'photo_time',
                //$el: me.get_$view_list(),
                get_$els: me.get_$els,
                $scroller: this.scroller.get_$el(),
                selected_class: 'act',
                keep_on: function ($tar) {
                    return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return $tar.closest('.figure-list-item').length === 0;
                },
                container_width: function () {
                    return me.get_$view_ct().width() - 110;
                }
            });
            this.Select.bind_select_box(me.store, me.sel_box);
            this.listenTo(this.Select, 'select_change', this._handle_select_change);
            this.enable_selection();
        },
        /**
         * 刷新框选
         */
        refresh_SelectBox: function () {
            this.Select.clear();
            if (this.sel_box) {
                this.sel_box.refresh();
            }
        },
        /**
         * 更新所有缩略图
         */
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.get_$view_ct().find(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
                    me._fetch_photo_thumb(record, $item);
                }
            });
        },

        _fetch_photo_thumb: function(record, $item) {
            var me = this;
            thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                var $img = $(img), $replace_img;
                $replace_img = $('<img src="' + url +'"/><i class="icon icon-check-m j-icon-checkbox"></i>');
                $replace_img.attr('unselectable', 'on');
                me.update_record_dom_thumb(record, $item, $replace_img);
            });
        },

        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('[data-id=img]').empty().append($img);
        },

        _handle_action : function(action, record, e){
            switch(action){
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_ctx_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var records;

            if(record.get('selected')){
                records = this.Select.get_selected_nodes();
            }else{
                this.cancel_sel();
                record.set('selected', true);
                records = [record];
            }
            this.context_records = records;
            this.set_selected(records);
            this.show_edit(records);

            var menu = this.menu.get_photo_context_menu(records, e);


            var me = this;
            me.is_menu_on = true;
            me._if_block_hover();
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                //if(records.length === 1 && record.get('selected')) {
                    //record.set('selected', false);
                //}
                me.context_records = null;
                me.is_menu_on = false;
                me._if_block_hover();
                me.stopListening(me.menu, 'action');
            });
            this.listenTo(this.menu, 'action', function(config_id) {
                me.trigger('action', config_id, me.context_records, e);
            });
        },

        // 显示loading
        on_beforeload : function(){
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load : function(){
            this.get_$load_more().hide();
        },

        on_before_refresh: function() {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function() {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
        },

        update_item_width: function() {
            if(thumb_helper) {
                var body_width = this.get_$view_ct().width();
                thumb_helper.update_item_width(body_width);
            }
        },

        get_$els: function() {
            return $('#_photo_time_body .figure-list');
        },

        get_item_width: function() {
            if(!thumb_helper) {
                return null;
            }
            var body_width = this.get_$view_ct().width();
            return thumb_helper.get_item_width(body_width);
        },

        get_$view_empty: function() {
            return this.get_$view_ct().find('#j-photo-time-empty');
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_normal'));
        },

        get_$view_list: function() {
            return this.$view_list || (this.$view_list = this.get_$view_ct().find('.figure-list'));
        },

        get_$view_items: function() {
            return this.$view_items || (this.$view_items = this.get_$view_list().children());
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_' + this.module_name + '_body'));
        },

        get_$load_more: function() {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(main_ui.get_$main_content()));
        },

        get_$rename_editor: function() {
            return this.$rename_editor || (this.$rename_editor = $(tmpl.rename_editor()));
        }
    });
    return File_view;
});