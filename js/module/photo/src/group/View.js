/**
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        $ = require('$');
    var scroller = require('main').get('./ui').get_scroller();
    var View = lib.get('./data.View'),
        tmpl = require('./tmpl'),
        Editor = common.get('./ui.Editor');
    var Module = inherit(View, {
        dom_record_map_attr : 'data-record-id',
        enable_hovering : true,
        enable_context_menu : true,
        enable_drag_sort: false,
        list_tpl : function(){
            return tmpl.group_list();
        },
        list_selector : 'div.photo-group-box',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.group_items({
                records : records
            });
        },
        item_selector : 'div[data-list]',
        item_hover_class : 'photo-group-list-hover',
        item_menu_class : 'photo-group-menu',
        item_editing_class : 'photo-group-list-editing',
        item_tool_selector : 'a.photo-group-tool',
        item_tool_menu_selector : 'ul.photo-group-toolmenu',
        item_tool_hover_class : 'photo-group-tool-hover',
        item_tool_menu_hover_class : 'photo-group-toolmenu-hover',
        shortcuts : {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            hovering : function(value, view){
                $(this).toggleClass(view.item_hover_class, value);
            },
            toolhovering : function(value, view){
                var $dom = $(this);
                $dom.find(view.item_tool_selector).toggleClass(view.item_tool_hover_class, value);
                $dom.find(view.item_tool_menu_selector).toggleClass(view.item_tool_menu_hover_class, value);
            },
            editing : function(value, view){
                $(this).toggleClass(view.item_editing_class, value);
            },
            selected : $.noop,
            checked : $.noop
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 点击浮动层上的按钮后，浮动层本身隐藏
            if(this.enable_hovering){
                this.on('action', function(action, records){
                    records = [].concat(records);
                    $.each(records, function(index, record){
                        record.set('toolhovering', false);
                    });
                });
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this._if_enter_group, this);
            if(this.enable_hovering){
                this.$list.on('mouseenter', '>'+this.item_selector, function(){
                    // hovering时，不响应
                    if(me.context_record){
                        return;
                    }
                    var record = me.get_record(this);
                    record.set('hovering', true);
                });
                this.$list.on('mouseleave',  '>'+this.item_selector, function(){
                    var record = me.get_record(this);
                    record.set('hovering', false);
                });
                this.$list.on('mouseenter', this.item_tool_selector+','+this.item_tool_menu_selector, function(){
                    // hovering时，不响应
                    if(me.context_record){
                        return;
                    }
                    var record = me.get_record(this);
                    record.set('toolhovering', true);
                });
                this.$list.on('mouseleave', this.item_tool_selector+','+this.item_tool_menu_selector, function(){
                    var record = me.get_record(this);
                    record.set('toolhovering', false);
                });
            }
            if(this.enable_context_menu){
                this.on('recordcontextmenu', this.show_context_menu, this);
            }
        },
        // 点击浮动菜单时不触发进入分组
        _if_enter_group : function(record, event){
            event.preventDefault();
            if(!$(event.target).closest(this.item_tool_selector+','+this.item_tool_menu_selector).length && !this.is_editing()){
                this.trigger('opengroup', record, event);
            }
        },
        is_editing : function(){
            var records = this.store.slice(), i, record;
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.data.editing){
                    return true;
                }
            }
        },
        /**
         * 开始编辑某个分组，返回一个editor对象，有save及cancel事件，表示用户触发保存、取消；完成编辑则调用destroy方法
         * @param {Record} record
         * @return {Editor} editor
         */
        start_edit : function(record){
            var $dom = this.get_dom(record),
                $input;
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
               // $input.off('click', this._prevent_record_click);
                me.off('destroy', editor.destroy, editor);
            });
            
            // 定位
            $dom[0].scrollIntoView();
            
            return editor;
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 128,
        thumb_height : 128,
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
        },
        on_remove: function(){
            Module.superclass.on_remove.apply(this, arguments);
            this.refresh_drag_sort();
        },
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
            this.refresh_drag_sort();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
            this.refresh_drag_sort();
        },
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('.photo-group-img-border').removeClass('photo-group-loading').empty().append($img);
        },
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record, covers, cover/*, $img_holder = $item.find('img')*/;
                var thumb_state = $item.data(thumb_state_attr);
	            var coverUrl;
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
                    covers = record.get('cover');
                    if(!covers || !covers.length){
//                        $img_holder.css({height: me.thumb_height+'px', width: me.thumb_width+'px'}).attr('src', me.default_empty_thumb_url);
                        return;
                    }
                    cover = covers[0];
                    if(!cover.file_id) {
                        return
                    }
	                if(cover.ext_info) {
		                coverUrl = constants.IS_HTTPS ? cover.ext_info.https_url : cover.ext_info.thumb_url;
	                }
                    me.thumb_loader.get(cover.pdir_key, cover.file_id, '', coverUrl).done(function(url, img){
                        var $img = $(img);
                        if(!$img.data('used')){
                            $img.data('used', true);
//                            $img_holder.replaceWith($img);
                        }else{
                            $img = $('<img />').attr('src', url);
//                            $img_holder.attr('src', url);
                        }
                        me.update_record_dom_thumb(record, $item, $img);
                    });/*.fail(function(){
                        $img_holder.css({height: me.thumb_height+'px', width: me.thumb_width+'px'}).attr('src', me.default_fail_thumb_url);
                    });*/
                }
            });
        },
        // IE6下字体缩略
        update_ellipsis : function(){
            if(!$.browser.msie || $.browser.version>6 || !this.rendered){
                return;
            }
            var ellipsis_state_attr = 'data-ellipsis-hooked',
                max_len_attr = 'data-textlen';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var ellipsis_state = $item.data(ellipsis_state_attr);
                if(!ellipsis_state){ // 没有进行处理
                    $item.data(ellipsis_state_attr, true);
                    $item.find('['+max_len_attr+']').each(function(){
                        var $dom = $(this),
                            max_len = $dom.attr(max_len_attr);
                        if($dom.width()>max_len){
                            $dom.css('width', max_len + 'px');
                        }
                    });
                }
            });
        },
        // --------------- 缩略图结束 -----------------
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            e.preventDefault();
            
            var visibles;
            if(record.get('readonly')){
                visibles = {
                    set_cover : 1
                };
            }
            
            this.context_record = record;
            if(this.enable_hovering){
                record.set('hovering', false);
                record.set('toolhovering', false);
            }

            var menu = this.get_context_menu(), me = this;
            menu.show(e.pageX, e.pageY, visibles);
            record.set('menu_active', true);
            menu.once('hide', function(){
                me.context_record = null;
                record.set('menu_active', false);
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_record, e, me.get_action_extra({src:'contextmenu'}));
                };
                menu = this.context_menu = new ContextMenu({
                    items: [
                        {
                            id: 'rename',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '重命名',
                            click: handler
                        },
                        {
                            id: 'delete',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '删除',
                            click: handler
                        },
                        {
                            id: 'set_cover',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '更改封面',
                            click: handler
                        }
                    ]
                });
            }
            return menu;
        },
        /**
         * 刷新拖动分组
         */
        refresh_drag_sort: function(){
            var me = this;
            return;//3.0不能对分组排序了
            if(!me.drag_sort){
                me.drag_sort = require('./group.drag_sort');
            }
            if(me.rendered && me.enable_drag_sort){
                me.drag_sort.render({
                    $el: me.$list,
                    child_filter: '.photo-group-list-wrap',
                    drag_class: 'photo-group-themove',
                    helper_class: 'photo-group-thedrag cursor-no-drop',
                    parent: me.$ct,
                    width: 152,//组元素宽度
                    height: 187,//组元素高度
                    get_parent_all_height: function(){
                        return $('#photo-group').height();
                    },
                    $scroller: scroller.get_$el(),
                    left_class: 'photo-group-left',//元素靠左的样式
                    right_class: 'photo-group-right',//元素靠右的样式
                    success: function(event, $source, $target ,is_before){
                        me.trigger('action', 'drag_sort',
                            [me.get_record( $source ),me.get_record( $target )],
                            {preventDefault: $.noop},
                            me.get_action_extra({is_before : is_before}));
                    }
                });
            }
        }
    });
    return Module;
});