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
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        file_path = require('./file_path.file_path'),
        tmpl = require('./tmpl'),
        ThumbHelper = common.get('./ui.thumb_helper'),
        Editor = common.get('./ui.Editor'),
        Loader = require('./Loader'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        view_switch = require('./view_switch.view_switch'),
        Thumb_loader = require('./Thumb_loader'),
        store = require('./Store'),
        tbar = require('./toolbar.tbar'),
        ctx_menu = require('./ctx_menu'),
        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        thumb_loader = new Thumb_loader({
            width : 256,
            height : 256
        }),
        thumb_helper,

        undefined;
    var loader = new Loader();

    var File_view = inherit(View, {

        module_name: 'photo',
        list_selector : 'ul.figure-list',
        item_selector : 'li[data-list]',
        action_property_name : 'data-action',

        //enable_box_select : false,
        enable_select : true,

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : '',
        scroller : main_ui.get_scroller(),
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;

            var selection = this.selection = new Box_selection_plugin();
            selection.init(this);
        },

        list_tpl : function(){
            return tmpl['group_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_items']([file]);
        },

        get_html : function(records){
            return tmpl[this.module_name+'_items']({
                records : records,
                item_width: this.get_item_width(),
                module_name : this.module_name
            });
        },

        item_menu_class : 'context-menu',
        shortcuts: {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
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
            // 多选时不要hover
            var me = this;

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e);
                return false;
            }, this);

            this.listenTo(view_switch, 'switch.view', function(mode, e) {
                file_path.update();
                me.trigger('action', 'switch_' + mode, null, e);
            });

            thumb_helper = new ThumbHelper({
                container: '#_group_body',
                height_selector: '.figure-list-item-pic',
                item_selector: 'li[data-record-id]'
            });


            this.selection.on('selectionchanged', function(records){
                me.is_multi_selection = records.length > 1;
                me.is_need_edit = records.length > 0;
                me.show_edit(records);
            });
        },

        render_path: function() {
            file_path.render(main_ui.get_$bar2());
            main_ui.get_$bar2().show();

            var me = this,
                $path = $('#_photo_file_path');
            $path.on('click', '[data-more]', function(e) {
                e.stopPropagation();
                var $target = $(e.target).closest('li');
                if(!$target.hasClass('cur')) {
                    me.back_to_group();
                    me.trigger('action', 'switch_group');
                    file_path.update();
                }
            });
        },

        render_editbar: function() {

            tbar.render(main_ui.get_$bar1());
            var me = this;

            // 编辑态工具栏事件
            this.listenTo(tbar, {
                // 打包下载
                pack_down: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'download', files, e);
                },
                // 分享入口
                share: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'share', files, e);
                },
                // 删除
                del: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'delete', files, e);
                },
                // 更改分组
                set_group: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'set_group', files, e);
                }
            });
        },

        cancel_sel: function() {
            this.selection.clear();
            main_ui.toggle_edit(false);
        },

        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
            }
        },

        on_datachanged: function() {
            File_view.superclass.on_datachanged.apply(this, arguments);
            if(this.store.size() === 0) {//无数据时，显示空白运营页
                if(!this.$view_empty) {
                    this._init_view_empty();
                }
                this.get_$view_ct().addClass('ui-view-empty');
//                this.get_$view_empty().show();
                this.get_$photo_list().hide();

            } else {
                this.get_$view_ct().removeClass('ui-view-empty');
                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$photo_list().show();
            }
        },

        /**
         * 初始化列表为空时的提示页面
         * @private
         */
        _init_view_empty: function() {
            if(this.$view_empty) {
                this.$view_empty.show();
            } else {
                this.$view_empty = $(tmpl.view_empty()).appendTo(this.get_$view_ct());
            }

            this.$view_empty.find('.title').text(view_switch.is_whole_view()? '暂无图片' : '该分组暂无图片');
        },

        _handle_action : function(action, record, e){
            switch(action){
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        is_editing : function(){
            var records = store.get_groups(), i, record;
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.get('editing')){
                    return true;
                }
            }
            return false;
        },

        show_edit: function(records) {
            records = records || this.get_selected();
            if(!records || records.length === 0) {
                main_ui.toggle_edit(false);
            } else {
                main_ui.toggle_edit(true, records.length);
            }
        },

        //用于判断此时是分组中还是全部中
        is_group_view: function() {
            return this.module_name === 'group';
        },

        show_detail: function() {
            this.module_name = 'photo';
            this.dom_record_map_attr = '';
            this.get_$photo_list().show();
            this.get_$group_list().hide();
        },

        back_to_group: function() {
            if(view_switch.is_group_view()) {
                this.module_name = 'group';
                this.dom_record_map_attr = 'data-record-id';
                this.get_$photo_list().empty().hide();
                this.get_$group_list().show();
            }
            if(this.$view_empty) {
                this.$view_empty.remove();
                this.$view_empty = null;
            }
        },

        group_render: function() {
            var me = this,
                groups = store.get_groups();

            this.module_name = 'group';
            $(tmpl.group_items({records: groups, item_width: this.get_item_width()})).appendTo(this.get_$group_list().empty());
            this.update_thumb();

            // 绑定右键
            this.get_$group_list().on('contextmenu',  function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    group = store.get_group($target.attr('data-record-id'));
                if(group) {
                    me.show_group_ctx_menu(group, e);
                }
            });

            this.get_$group_list().on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action'),
                    group = store.get_group($target.attr('data-record-id'));
                if(!me.is_editing()) {
                    me.trigger('action', action_name, group, e);
                }
            });
        },

        show_group_ctx_menu : function(record, e){
            e.preventDefault();
            var menu = ctx_menu.get_group_context_menu(record, e), me = this;
            this.context_record = record;

            record.set('menu_active', true);
            menu.once('hide', function(){
                me.context_record = null;
                record.set('menu_active', false);
                me.stopListening(ctx_menu, 'action');
            });
            this.listenTo(ctx_menu, 'action', function(config_id) {
               me.trigger('action', config_id, me.context_record, e);
            });
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

            var records,
                me = this;

            if(record.get('selected')){
                records = this.selection.get_selected();
            }else{
                //清除之前的选择状态
               this.cancel_sel();
                record.set('selected', true);
                records = [record];
            }
            this.show_edit(records);

            var menu = view_switch.is_whole_view()? ctx_menu.get_photo_context_menu(records, e) : ctx_menu.get_detail_context_menu(records, e);

            this.context_records = records;
            me.is_menu_on = true;
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.context_records = null;
                me.is_menu_on = false;
                me.stopListening(ctx_menu, 'action');
            });
            this.listenTo(ctx_menu, 'action', function(config_id) {
                me.trigger('action', config_id, me.context_records, e);
            });
        },

        /**
         * 开始重命名
         * @param {File_record} record 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(record, rename_callback) {
            var file_name = record.get_name();
            var $file_name = this.add_group().find('[data-name=file_name]');
            var $editor = this.get_$rename_editor();
            var $input = $editor.find('input[type=text]');

            var me = this;
            $file_name
                .hide()
                .after($editor.show());

            var auto_blur_handler = function(e){
                if(!$(e.target).is($input)){
                    $input.blur();
                }
            }, $body = $(document.body);
            $body.on('mousedown', auto_blur_handler);
            $input.val(file_name).focus()
                .on(key_event + '.rename', function(e) {
                    if (e.which === 13) {//ENTER
                        var val = $.trim(this.value),
                            dotLastIndex = val.lastIndexOf('.');
                        if(!val || dotLastIndex === 0 && val.length > 1) {
                            return;
                        }

                        if(file_name === val) {//未修改
                            me.remove_rename_editor();
                            return;
                        }
                        var err = File.check_name(val);
                        if(err) {
                            mini_tip.error(err);
                            return;
                        }
                        rename_callback(val);

                    } else if (e.which == 27) { //ESC
                        me.remove_rename_editor();
                    }
                })
                .on('blur.rename', function(e) {
                    var val = $.trim(this.value),
                        err = File.check_name(val),
                        dotLastIndex = val.lastIndexOf('.');
                    if(err) {
                        mini_tip.error(err);
                        me.remove_rename_editor();
                    } else if(val && val !== file_name && !(dotLastIndex === 0 && val.length > 1)) {
                        rename_callback(val);
                    } else {
                        me.remove_rename_editor();
                    }
                    $body.off('mousedown', auto_blur_handler);
                });

            me._select_text_before($input, '.');//聚焦选中

        },

        remove: function(group) {
            var $group = $('#group_items_' + group.id);
            $group && $group.remove();
        },

        /**
         * 开始编辑某个分组，返回一个editor对象，有save及cancel事件，表示用户触发保存、取消；完成编辑则调用destroy方法
         * @param {Record} record
         * @return {Editor} editor
         */
        start_edit : function(record){
            var $dom,
                $input;

            //区分重命名和新建分组
            if(record.get('dummy')) {
                $dom = $(tmpl.add_photo_group({item_width: this.get_item_width()}));
                if(this.get_$group_list().children().length) {
                    $(this.get_$group_list().children()[0]).after($dom);
                } else {
                    $dom.appendTo(this.get_$group_list());
                }
            } else {
                var $group = $('#group_items_' + record.get('id'));
                $dom = $('<div class="pic-group-item-edit"><input type="text" value="' + record.get('name') + '"></div>');
                $dom.appendTo($group);
                $group.find('.pic-group-item-txt').hide();
            }

            // 初始值设置
            var old_value = record.get('name');
            // 状态切换
            record.set('editing', true);
            // 防止record click触发
            $input = $dom.find('input');
            $input.val(old_value);
            // $input.on('click', this._prevent_record_click);

            // 开始编辑
            var editor = new Editor({
                initial_value : old_value,
                $input : $input
            });
            var me = this;
            this.on('destroy', editor.destroy, editor);
            // 编辑结束后回滚事件
            editor.on('destroy', function(){
                record.set('editing', false);
                if(record.get('dummy')) {
                    me.get_$group_list().find('#add_group').remove();
                } else {
                    $group.find('.pic-group-item-edit').remove();
                    $group.find('.pic-group-item-txt').show();
                }
                // $input.off('click', this._prevent_record_click);
                me.off('destroy', editor.destroy, editor);
            });

            // 定位
            $dom[0].scrollIntoView();

            return editor;
        },

        add_group: function(groups) {
            this.get_$group_list().find('#add_group').remove();
            var $new_group = $(tmpl.new_group({records: groups, item_width: this.get_item_width()}));
            if(this.get_$group_list().children().length) {
                $(this.get_$group_list().children()[0]).after($new_group);
            } else {
                $new_group.appendTo(this.get_$group_list());
            }
            this.update_thumb();
        },

        update_group: function(group) {
            var $group = $('#group_items_' + group.get('id'));
            $group.find('.pic-group-item-edit').remove();
            $group.find('.pic-group-item-txt .txt').text(group.get('name'));
            $group.find('.pic-group-item-txt').show();
        },

        /**
         * 选中文件名而不包括扩展名
         * @param {jQuery|HTMLElement} $input
         * @param {String} sep
         * @private
         */
        _select_text_before: function ($input, sep) {
            var input = $($input)[0],
                text = $input.val(),
                before = (text.lastIndexOf(sep) == -1) ? text.length : text.lastIndexOf(sep);

            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(0, before);
            }
            else if (input.createTextRange) {
                var text_range = input.createTextRange();
                text_range.collapse(true);
                text_range.moveEnd('character', before);
                text_range.moveStart('character', 0);
                text_range.select();
            }
            else {
                input.select();
            }
        },

        remove_rename_editor: function() {
            var $editor = this.get_$rename_editor();
            $editor.prev('[data-name=file_name]').show();
            $editor.remove();
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
            this.update_thumb();
        },

        //防止thumb_helper取到的是旧的group，这里重新设置$container
        update_item_width: function() {
            var body_width = this.get_$photo_list().width();
            thumb_helper.set_$container(this.get_$photo_list());
            thumb_helper.update_item_width(body_width);
        },

        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('[data-id=img]').empty().append($img);
        },
        /**
         * 更新所有缩略图
         */
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.get_$list().children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    if(me.module_name === 'group') {
                        record = store.get_group($item.attr('data-record-id'));
                        me._fetch_group_cover(record, $item);
                    } else if(me.module_name === 'photo') {
                        record = me.get_record($item);
                        me._fetch_photo_thumb(record, $item);
                    }
                }
            });
        },

        _fetch_group_cover: function(record, $item) {
            var coverUrl,
                cover,
                me = this,
                covers = record.get('cover');
            if(!covers || !covers.length){
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
                return;
            }
            cover = covers[0];
            if(!cover.file_id) {
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
                //没有file_id说明封面不存在，这里显示默认图
                return
            }
            if(cover.ext_info) {
                coverUrl = constants.IS_HTTPS ? cover.ext_info.https_url : cover.ext_info.thumb_url;
            }
            thumb_loader.get(cover.pdir_key, cover.file_id, '', coverUrl).done(function(url, img){
                var $img = $(img);
                if(!$img.data('used')){
                    $img.data('used', true);
//                            $img_holder.replaceWith($img);
                }else{
                    $img = $('<img />').attr('src', url);
//                            $img_holder.attr('src', url);
                }
                me.update_record_dom_thumb(record, $item, $img);
            }).fail(function() {
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
            });
        },

        _fetch_photo_thumb: function(record, $item) {
            var me = this;
            thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                var $img = $(img), $replace_img;
                //if(!$img.data('used')){
                //    $img.data('used', true);
                //    $replace_img = $img;
                //}else{
                    $replace_img = $('<img src="' + url +'"/><i class="icon icon-check-m j-icon-checkbox"></i>');
                //}
                $replace_img.attr('unselectable', 'on');
                me.update_record_dom_thumb(record, $item, $replace_img);
            });
        },

        get_$view_empty: function() {
            return this.$view_empty;
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#main_bar1'));
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_group_body'));
        },

        get_$group_list: function() {
            return this.$view_list || (this.$view_list = $('#group_view_list'));
        },

        get_$photo_list: function() {
            return this.$photo_list || (this.$photo_list = $('#photo_view_list'));
        },

        get_$list: function() {
            if(this.module_name === 'group') {
                return this.get_$group_list();
            } else if(this.module_name === 'photo') {
                return this.get_$photo_list();
            }
        },

        get_item_width: function() {
            if(!thumb_helper) {
                return null;
            }
            var body_width = this.get_$photo_list().width();

            // 如果有滚动条，那么加上滚动条宽度，否则计算出来的和初始的不一致了
            if( main_ui.get_$main_content().scrollTop() > 0 ){
                body_width += this.scroller.get_scrollbar_width();
            }

            return thumb_helper.get_item_width(body_width);
        },

        get_$load_more: function() {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        get_$rename_editor: function() {
            return this.$rename_editor || (this.$rename_editor = $(tmpl.rename_editor()));
        }
    });

    return File_view;
});