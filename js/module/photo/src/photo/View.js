/**
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('photo.all.view'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        Multi_selection_plugin = common.get('./dataview.Multi_selection_plugin'),
	    huatuo_speed = common.get('./huatuo_speed'),
        
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),

        constants = common.get('./constants'),
        jquery_ui,
        drag_files,
        
        $ = require('$');
    var View = lib.get('./data.View'),
        Thumb_loader = require('./photo.Thumb_loader'),
        tmpl = require('./tmpl');

    var Module = inherit(View, {
        enable_box_select : true,
        enable_context_menu : true,
        enable_select : true,

        //拖拽的支持
        draggable : false,
        draggable_key : 'all_photo',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        thumb_size : 128,
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            if(!this.thumb_loader){
                this.thumb_loader = new Thumb_loader({
                    width : this.thumb_size,
                    height : this.thumb_size
                });
            }
            var selection, selection_cfg, Selection;
            if(this.enable_select){
                selection_cfg = {
                    checkbox_selector : '.photo-view-list-checkbox',
                    item_selected_class : this.item_selected_class
                };
                Selection = this.enable_box_select ? Box_selection_plugin : Multi_selection_plugin;
                selection = new Selection(selection_cfg);
                selection.init(this);
                this.selection = selection;
            }
        },
        list_tpl : function(){
            return tmpl.photo_list();
        },
        list_selector : '.photo-view',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.photo_items({
                records : records,
                id_perfix : this.record_dom_map_perfix
            });
        },
        item_selector : 'div[data-list]',
        item_selected_class : 'photo-view-list-selected',
        item_menu_class : 'photo-view-list-menu',
        shortcuts : {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            }
        },
        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
            }
        },
        cancel_selected : function(e){
            if(this.enable_select){
                this.selection.clear();
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            if(this.enable_context_menu){
                this.on('recordcontextmenu', this.show_context_menu, this);
            }
            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e, this.get_action_extra());
                return false;
            }, this);

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {
                var me = this;
                // 如果启用拖拽，则在记录上按下时，不能框选
                this.selection.on('before_box_select', function($tar){
                    return !me.draggable || !me.get_record($tar);
                });

                this.set_draggable(true);

                me._render_drag_files();

            }
        },

        set_size : function(size){
            this.list_height = size.height;
            if(this.$empty_ui){
                this.$empty_ui.height(this.get_list_height());
            }
        },
        get_list_height : function(){
            return this.list_height - parseInt(this.$el.css('padding-top'), 10) - parseInt(this.$el.css('padding-bottom'), 10) - 10;
        },
        
        // ------------- 空白界面 ---------------
        enable_empty_ui : true,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.empty(this.empty_type)).height(this.get_list_height()).insertAfter(this.$list);
            this.$list.hide();
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$empty_ui.remove();
            this.$list.show();
        },
        // ------------ 空白界面结束 --------------
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var menu = this.get_context_menu(),
                records;
            
            if(record.get('selected')){
                records = this.get_selected();
            }else{
                this.cancel_selected();
                record.set('selected', true);
                records = [record];
            }
            
            this.context_records = records;
            
            var visibles = records.length>1 ? {
                'delete' : 1,
                set_group : 1
            } : undefined;
            
            menu.show(e.pageX, e.pageY, visibles);
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_records, e, me.get_action_extra({src:'contextmenu'}));
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            return [
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'download',
                    text: '下载'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'delete',
                    text: '删除'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'jump',
                    text: '查看所在目录'
                },
                {
                    icon_class: 'ico-dimensional-menu',
                    group: 'edit',
                    id: 'qrcode',
                    split: true,
                    text: '获取二维码'
                },
                {
                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    split: true,
                    text: '分享'
                }
            ];
        },
        // --------------- 缩略图及文本缩略部分 -----------------
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_thumb();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },
        update_record_dom_thumb : function(record, $dom, $img){
            var $img_ct = $dom.find('>.photo-view-list-link');
            $img_ct.removeClass('photo-view-loading');
            $img_ct.find('img').remove().end().prepend($img);
        },
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
//                    console.log('try load thumb of '+record.get_name());
                    me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                        var $img = $(img), $replace_img;
                        if(!$img.data('used')){
                            $img.data('used', true);
                            $replace_img = $img;
                        }else{
                            $replace_img = $('<img />').attr('src', url);
                        }
                        $replace_img.attr('unselectable', 'on');
                        me.update_record_dom_thumb(record, $item, $replace_img);
                    });/*.fail(function(){
                        $item.find('img').replaceWith($('<img />').attr('src', 'http://imgcache.qq.com/vipstyle/nr/box/img/preview/ico_fail_min104470.png'));
                    });*/
                }
            });
            this.update_draggable();
            //认为已加载到数据并渲染完DOM
            if($items.length) {
	            //测速
	            try{
		            var flag = '21254-1-10';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
            }
        },
        // --------------- 缩略图结束 -----------------

        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },

        update_draggable : function(){
            if(!this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var items = [];
            // 如果拖动的文件已经选中，则表示拖动所有选中的文件
            if(record.get('selected')){
                items = this.get_selected();
            }else{ // 反之，只拖动当前一个，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                items = [record];
            }

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if(items.length>1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        }
        
    });
    return Module;
});