/**
 * 将文件列表与Dom视图关联起来
 * @author cluezhang
 * @date 2013-8-12
 */
define(function(require, exports, module){
    var $ = require('$'),
        inherit = require('./inherit'),
        Event = require('./Event');
    var id_seed = 0;
    var View = inherit(Event, {
        constructor : function(cfg){
            cfg = cfg || {};
            $.extend(this, cfg);
            
            this.bind_store(this.store, true);
            /**
             * @event action
             * @param {String} act 动作名称，比如rename、delete等
             * @param {File} file 文件对象
             * @param {Number} index 在列表中的位置
             * @param {jQueryElement} $dom 对应的dom
             * @param {jQueryEvent} e
             */
            /**
             * TODO
             * @event reachbottom
             * @param {View} this 在列表中的位置
             */
            if(!this.id){
                this.id = 'dataview'+(++id_seed);
            }
            /*
             * 初始化action事件，放在constructor内是为了让它最先，从而可以在action事件中取消recordclick事件
             */
            if(this.action_property_name){
                this.on('recordclick', this.handle_record_click, this);
            }
        },
        /**
         * @cfg {Function} tpl 每条记录对应的渲染接口，返回html代码
         */
        tpl : function(data){
            return '<div class="item" style="background-color:{color}">记录模板</div>';
        },
        /**
         * @cfg {Object} shortcuts (optional) 属性快捷更新映射，例如selected属性映射到一个快速切换selected样式的函数上
         */
        shortcuts : {
            selected : function(value, view){
                $(this).toggleClass('ui-selected', value);
            }
        },
        empty_tpl : function(){
            return '<div>没有可显示的数据</div>';
        },
        list_tpl : function(){
            return '<div class="list"></div>';
        },
        list_selector : 'div.list',
        item_selector : 'div.item',
        action_property_name : 'data-action',
        /**
         * @cfg {String} record_dom_map_perfix (optional) 如果每个元素的dom的id都有配置，并且是特定前缀+record.id，
         *      则配置它为该前缀，以便快速从record定位到dom
         */
        /**
         * @cfg {String} dom_record_map_attr (optional) 如果每个元素的dom上都有属性存储的record.id，
         *      则配置它为该属性名，以便快速从dom定位到record
         */
        dom_record_map_attr : null,
        /*
         * 获取多条记录的html
         * @private
         */
        get_html : function(records, index){
            var me = this;
            return $.map(records, function(record){
                return me.tpl(record);
            }).join('');
        },
        /*
         * 将view与store绑定
         * @private
         */
        bind_store : function(store, initial){
            var old_store = this.store;
            if(!initial && old_store){
                old_store.off('add', this.on_add, this);
                old_store.off('remove', this.on_remove, this);
                old_store.off('datachanged', this.on_datachanged, this);
                old_store.off('clear', this.on_clear, this);
                old_store.off('update', this.on_update, this);
            }
            this.store = store;
            if(store){
                store.on('add', this.on_add, this);
                store.on('remove', this.on_remove, this);
                store.on('datachanged', this.on_datachanged, this);
                store.on('clear', this.on_clear, this);
                store.on('update', this.on_update, this);
                
                this.refresh();
            }
        },
        // 插入记录
        on_add : function(store, records, index){
            if(!this.rendered){
                return;
            }
            // dom更新前操作empty_ui，避免某些将empty_ui放置于列表中的设计
            this.refresh_empty_text();
            this.insert_html(index, this.get_html(records, index));
            this.trigger('add');
        },
        insert_html : function(index, html){
            var $list = this.$list;
            var $childs = $list.children(this.item_selector);
            var size = $childs.length;
            if(index<=0){
                $list.prepend(html);
            }else if(index >= size){
                $list.append(html);
            }else{
                $childs.eq(index).before(html);
            }
        },
        // 删除记录
        on_remove : function(store, records, index){
            if(!this.rendered){
                return;
            }
            var size = records.length, start, end;
            start = index<=0 ? '' : ':gt('+(index-1)+')';
            end = ':lt('+(size)+')';
            this.$list.children(this.item_selector+start + end).remove();
            this.refresh_empty_text();
            this.trigger('remove');
        },
        // 大变动，重新绘
        on_datachanged : function(){
            this.refresh();
        },
        refresh : function(){
            if(!this.rendered){
                return;
            }
            this.refresh_empty_text();
            var records = this.store.data;
            this.$list.html(this.get_html(records, 0));
            this.trigger('refresh');
        },
        /**
         * 更新空白界面
         * @private
         */
        refresh_empty_text : function(){
            var empty, empty_ui_visible;
            if(this.enable_empty_ui){
                empty = !!this.store.loaded && this.store.size() <= 0;
                empty_ui_visible = !!this.empty_ui_visible;
                if(empty_ui_visible !== empty){
                    if(empty){
                        this.show_empty_ui();
                    }else{
                        this.hide_empty_ui();
                    }
                    this.empty_ui_visible = empty;
                }
            }
        },
        show_empty_ui : $.noop,
        hide_empty_ui : $.noop,
        // 清空
        on_clear : function(){
            this.refresh();
        },
        // 显示loading
        on_beforeload : function(){},
        // 去掉loading
        on_load : function(){},
        on_update : function(store, record, olds){
            if(!this.rendered){
                return;
            }
            var index = this.store.indexOf(record);
            var $dom = this.$list.children(':eq('+index+')');
            var can_shortcut_update = olds && (typeof olds === 'object'),
                shortcuts = this.shortcuts,
                name;
            // 判断是否都能快捷更新
            if(can_shortcut_update){
                for(name in olds){
                    if(olds.hasOwnProperty(name)){
                        if(!shortcuts.hasOwnProperty(name)){
                            can_shortcut_update = false;
                            break;
                        }
                    }
                }
            }
            if(can_shortcut_update){
                for(name in olds){
                    if(olds.hasOwnProperty(name)){
                        shortcuts[name].call($dom, record.get(name), this, record);
                    }
                }
            }else{ // 如果不能，直接全量更新html
                $dom.replaceWith(this.get_html([record]));
            }
            this.trigger('update');
        },
        render : function($ct){
            var $el = this.$el = $(this.list_tpl()),
                list_selector = this.list_selector;
            this.rendered = true;
            this.set_visible(!this.hidden);
            $el.appendTo($ct);
            
            this.$list = $el.is(list_selector) ? $el : $el.find(list_selector);
            this.on_render();
            
            this.trigger('render');
            
            this.after_render();
            
            this.trigger('afterrender');
        },
        on_render : $.noop,
        after_render : function(){
            var me = this;
            this.$el.on('click', function(e){
                me.process_event('click', e);
            });
            this.$el.on('contextmenu', function(e){
                me.process_event('contextmenu', e);
            });
            this.refresh();
        },
        show : function(){
            this.set_visible(true);
            this.trigger('show');
            this.on_show();
        },
        hide : function(){
            this.set_visible(false);
            this.trigger('hide');
            this.on_hide();
        },
        on_show : $.noop,
        on_hide : $.noop,
        set_visible : function(visible){
            this.hidden = !visible;
            if(this.rendered){
                this.$el.toggle(!!visible);
            }
        },
        // private
        get_dom : function(index){
            if(!this.rendered){
                return null;
            }
            var record, id;
            if(typeof index !== 'number'){
                index = this.store.indexOf(index);
            }
            if(this.record_dom_map_perfix){
                record = this.store.get(index);
                id = this.record_dom_map_perfix + record.id;
                return $('#'+id);
            }
            
            return this.$list.children(this.item_selector+':eq('+index+')');
        },
        // private
        get_record : function(dom, is_already_root_dom){
            // 给DOM增加自定义属性或data来映射到record中 - cluezhang
            var $item_dom = $(dom);
            if(!is_already_root_dom){
                $item_dom = $item_dom.closest(this.item_selector, this.$list);
            }
            if(!$item_dom.length){
                return null;
            }
            if(this.dom_record_map_attr){
                return this.store.get($item_dom.attr(this.dom_record_map_attr));
            }
            return this.store.get(this.$list.find(this.item_selector).index($item_dom));
        },
        // private
        get_action_extra : function(extra){
            return $.extend({
                view : this,
                store : this.store
            }, extra);
        },
        // private
        handle_record_click : function(record, e){
            var $target = $(e.target),
                action_property_name = this.action_property_name,
                $action_el;
            if(action_property_name){
                $action_el = $target.closest('['+action_property_name+']', this.$list);
                if($action_el.length){
                    return this.trigger('action', $action_el.attr(action_property_name), record, e, this.get_action_extra());
                }
            }
        },
        // private
        process_event : function(name, e){
            this.trigger(name, e);
            var $target = $(e.target),
                $record = $target.closest(this.item_selector),
                record = this.get_record($target);
            if(!record){
                // 如果没有点到记录，则发出其它事件
                this.trigger('container'+name, e);
                return;
            }
            this.trigger('record'+name, record, e);
        },
        destroy : function(){
            this.destroyed = true;
            this.on_destroy();
            this.trigger('destroy');
            this.bind_store(null);
            this.stopListening();
            if(this.rendered){
                if(this.empty_ui_visible){
                    this.hide_empty_ui();
                }
                this.$el.remove();
            }
        },
        on_destroy : $.noop
    });
    return View;
});