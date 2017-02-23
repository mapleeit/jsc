/**
 * 框选功能
 * 需注意的是，框选功能开启时，View必须要有record_dom_map_perfix、scroller配置
 * @author cluezhang
 * @date 2013-11-29
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        SelectBox = require('./ui.SelectBox'),
	    global_event = require('./global.global_event'),
        
        Multi_selection_plugin = require('./dataview.Multi_selection_plugin'),
        
        $ = require('$');
    var Module = inherit(Multi_selection_plugin, {
        /**
         * 当开始框选时触发，可以返回false取消
         * @event before_box_select
         * @param {jQueryElement} $target
         */
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 框选默认就有此功能，所以关掉父类的
            this.clear_on_click_void = false;
        },
        on_init : function(){
            Module.superclass.on_init.apply(this, arguments);
            var view = this.view;
            
            this.select_box_namespace = 'selectbox/'+view.id;
            this.listenTo(view, 'render show hide', this._refresh_box_select_state);
            this.listenTo(view, 'add remove refresh', this._update_box_selection);
	        this.listenTo(global_event, 'manage_toggle', this._toggle_box_select_state);
        },
        register_selection_shortcuts : function(){
            var view = this.view, me = this;
            var addition_shortcuts = {};
            addition_shortcuts[this.selected_property_name] = function(value, view){
                var sel_box = me.get_select_box(true);
                if(sel_box){
                    sel_box.set_selected_status([this.attr('id')], value);
                }
            };
            // fix bug，原本是直接覆盖shortcuts，但shortcuts为对象，所以可能会影响到多个实例（库分类就是这样）
            // 正确的做法是新建一个对象
//            $.extend(view.shortcuts, addition_shortcuts);
            view.shortcuts = $.extend({}, view.shortcuts, addition_shortcuts);
        },
         /**
         * 更新框选的dom映射，以便框选中加载的记录也能被选中
         * @private
         */
        _update_box_selection : function(){
            var sel_box = this.get_select_box(true);
            if(!sel_box){
                return;
            }
            sel_box.refresh();
        },
        // -----------------框选---------------------
        _refresh_box_select_state : function(){
            var view = this.view, enable, cur_enabled;
            enable = view.rendered && !view.hidden;
            cur_enabled = this.get_select_box().is_enabled();
            if(enable === cur_enabled){
                return;
            }
            if(enable){
                this._enable_box_selection();
            }else{
                this._disable_box_selection();
            }
        },
	    _toggle_box_select_state: function(state) {
		    if(state === 'show') {
			    this._disable_box_selection();
		    } else if(state === 'hide') {
			    this._refresh_box_select_state();
		    }
	    },
        _enable_box_selection: function () {
            var sel_box = this.get_select_box();

            sel_box.enable();

            sel_box.on('select_change', this._update_selection, this);
        },
        //禁用框选
        _disable_box_selection: function () {
            var sel_box = this.get_select_box(true);
            if(!sel_box){
                return;
            }
            sel_box.disable();

            sel_box.off('select_change', this._update_selection, this);
        },
        _update_selection : function(sel_id_map, unsel_id_map){
            var store = this.store, id, record;
            for (id in sel_id_map) {
                if(sel_id_map.hasOwnProperty(id)){
                    record = this.get_record_by_domid(id);
                    if(record){
                        record.set(this.selected_property_name, true, true);
                    }
                }
            }
            for (id in unsel_id_map) {
                if(unsel_id_map.hasOwnProperty(id)){
                    record = this.get_record_by_domid(id);
                    if(record){
                        record.set(this.selected_property_name, false, true);
                    }
                }
            }
            this.trigger('selectionchanged', this.get_selected());
        },
        // 根据id获取record
        get_record_by_domid : function(domid){
            return this.view.get_record(document.getElementById(domid), true);
        },
        // 框选
        get_select_box : function(dont_construct){
            var me = this,
                view = me.view,
                $list = view.$list,
                sel_box = me.sel_box,
                ids;
            if(!sel_box && !dont_construct){
                sel_box = me.sel_box = new SelectBox({
                    ns: me.select_box_namespace,
                    $el: view.$list,
                    $scroller: view.scroller ? view.scroller.get_$el() : undefined,
                    selected_class: me.item_selected_class,
                    before_start_select : function($tar){
                        return me.trigger('before_box_select', $tar);
                    },
                    keep_on_selector : me.no_void_selector,
                    keep_on: function($tar) {
                        return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                    },
                    clear_on: function ($tar) {
                        // 如果没有点到记录上，清除
                        return !view.get_record($tar);
                    },
                    container_width: function () {
                        return $list.width();
                    }
                });
                ids = [];
                view.store.each(function(record){
                    if(record.get(me.selected_property_name)){
                        ids.push(view.get_dom(record).attr('id'));
                    }
                });
                sel_box.set_selected_status(ids, true);
            }
            return sel_box;
        },
        // ------------- 框选结束 ---------------
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this._disable_box_selection();
            var sel_box = this.get_select_box(true);
            if(sel_box){
                sel_box.destroy();
            }
        }
    });
    return Module;
});