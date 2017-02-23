/**
 * 分组详细视图里，分组列表
 * @author cluezhang
 * @date 2013-11-13
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        View = require('./group.View'),
        tmpl = require('./tmpl'),
        
        jquery_ui,
        
        $ = require('$');
    var Module = inherit(View, {
        enable_hovering : false,
        enable_context_menu : false,
        droppable : false,
        droppable_key : 'test',
        set_droppable : function(droppable){
            this.droppable = droppable;
            this.update_droppable();
        },
        list_tpl : function(){
            return tmpl.detail_group_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.detail_group_items({
                records : records
            });
        },
        item_selector : 'li.list',
        item_selected_class : 'list-focus',
        item_hover_class : 'list-hover',
        item_dropping_class : 'list-dropping',
        shortcuts : {
            selected : function(value, view){
                $(this).find('>div').toggleClass(view.item_selected_class, value);
            },
            hovering : function(value, view, record){
                $(this).find('>div').toggleClass(view.item_hover_class, value && !record.get('selected'));
            }
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            this.set_group_record(this.group_record);
            
            // 当store更新后，保持选中状态
            var me = this;
            me.listenTo(me.store, 'datachanged', function(){
                var record = me.group_record;
                if(record && record.get){
                    record = me.store.get(''+record.get('id'));
                    me.set_group_record(record);
                }
            });
        },
        set_group_record : function(group_record){
            var old_record = this.group_record;
            if(old_record){
                old_record.set('selected', false);
            }
            group_record.set('hovering', false);
            group_record.set('selected', true);
            this.group_record = group_record;
            this.update_droppable();
        },
        /**
         * 定位到当前选中的节点
         */
        focus : function(){
            if(!this.rendered){
                return;
            }
            var $dom = this.get_dom(this.group_record), $list, offset_top, scroll_height, height, element_height;
            if($dom){
                //$dom[0].scrollIntoView();
                offset_top = $dom[0].offsetTop; // 要定位的记录所处的高度
                $list = this.$list;
                scroll_height = $list[0].scrollHeight; // 列表内容总高度
                height = $list.innerHeight(); // 列表高度
                element_height = $dom.height(); // 每条记录的高度
                if(offset_top > height - 3*element_height){ // 如果不在可视范围内，移动到使它显示在第3个位置
                    $list.scrollTop(offset_top - 3*element_height);
                }
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this.handle_click, this);
            this.$list.on('mouseenter', this.item_selector, function(){
                me.get_record(this).set('hovering', true);
            }).on('mouseleave', this.item_selector, function(){
                me.get_record(this).set('hovering', false);
            });
            this.focus();
        },
//        handle_click : function(record, event){
//            var old_record = this.selected_record;
//            if(old_record){
//                old_record.set('selected', false);
//            }
//            this.selected_record = record;
//            record.set('selected', true);
//            record.set('hovering', false);
//            event.preventDefault();
//        },
//        get_selected : function(){
//            return this.selected_record;
//        },
        on_destroy : function(){
            var record = this.group_record;
            if(record){
                record.set('selected', false);
            }
            Module.superclass.on_destroy.apply(this, arguments);
        },
        // ----------------------拖动-----------------
        when_droppable_ready : function(){
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
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_droppable();
        },
//        on_update : function(){
//            Module.superclass.on_update.apply(this, arguments);
//            this.update_droppable();
//        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_droppable();
        },
        update_droppable : function(){
            if(!this.rendered || !this.droppable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this, last_droppable;
            this.when_droppable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $.each($items, function(index, dom){
                    var record = me.get_record(dom, true);
                    var $dom = $(dom).children();
                    // 销毁旧的droppable
                    if($dom.data('droppable')){
                        $dom.droppable('destroy');
                    }
                    if(record === me.group_record){
                        // 显示为禁止样
                        last_droppable = $dom.droppable({
                            scope: me.droppable_key,
                            tolerance: 'pointer',
                            hoverClass: false,
                            drop: function(){
                                return false;
                            },
                            over : function(e, ui){
                                ui.helper.addClass('photo-list-thedrag-disabled');
                            },
                            out : function(e, ui){
                                ui.helper.removeClass('photo-list-thedrag-disabled');
                            }
                        });
                    }else{
                        last_droppable = $dom.droppable({
                            scope: me.droppable_key,
                            tolerance: 'pointer',
                            hoverClass: 'list-dropping',
                            drop: $.proxy(me.handle_drop, me),
                            over : function(e, ui){
                                ui.helper.addClass('photo-list-thedrag-enabled');
                            },
                            out : function(e, ui){
                                ui.helper.removeClass('photo-list-thedrag-enabled');
                            }
                        });
                    }
                });
                // 主动更新拖拽坐标缓存，以使当前正在拖拽时不会出现无法响应drop的情况
                // 这里算是hack吧，不知道有没有更好的方法。
                last_droppable = last_droppable.data('droppable');
                $.ui.ddmanager.prepareOffsets(last_droppable);
            });
        },
        handle_drop : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.droppable || !record){
                return false;
            }
            // 如果是当前分组，无视掉
            if(record === this.group_record){
                return false;
            }
            var photos = ui.helper.data('records');

            this.trigger('dropmove', photos, record, e);
        },
        handle_over : function(e, ui){
            
        },
        handle_out : function(e, ui){
            
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 64,
        thumb_height : 64,
        update_record_dom_thumb : function(record, $dom, $img){
//            $dom.find('div.img').prepend($img);
            $dom.find('img').replaceWith($img);
        },
        update_ellipsis : $.noop
        // --------------- 缩略图结束 -----------------
    });
    return Module;
});