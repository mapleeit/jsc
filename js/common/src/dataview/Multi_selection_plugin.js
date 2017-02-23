/**
 * View多选插件，要实现以下功能：
 * 1. 在shortcuts中增加selected（可配置选中样式）
 * 2. 优先监听recordclick事件，
 * @author cluezhang
 * @date 2013-11-29
 */
define(function(require, exports, module){
    var lib = require('lib'),
        constants = require('./constants'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {String} checkbox_selector
         */
        checkbox_selector : (constants.IS_OLD || constants.IS_APPBOX)? '.checkbox' : '.j-icon-checkbox',
        /**
         * @cfg {String} item_selected_class 当记录选中时，增加什么样式
         */
        item_selected_class : (constants.IS_OLD || constants.IS_APPBOX)? 'ui-selected' : 'act',
        /**
         * @cfg {String} selected_property_name 选中状态存于record的哪个属性中
         */
        selected_property_name : 'selected',
        /**
         * @cfg {Boolean} clear_on_click_void 当点击空白界面时，是否清除选择，默认为true
         */
        clear_on_click_void : true,
        /**
         * @cfg {String} no_void_selector 排除某些dom为非空白界面，即点击它们时不触发清除选择的行为
         */
        no_void_selector : '[data-no-selection], input, textarea, button, object, embed',
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        init : function(view){
            this.view = view;
            this.on_init();
        },
        on_init : function(){
            var view = this.view;
            this.register_selection_shortcuts();
            
            this.listenTo(view, 'destroy', this.destroy, this);
            this.listenTo(view, 'recordclick', this.handle_record_click, this);
            if(this.clear_on_click_void){
                this.if_click_void_handler = $.proxy(this.handle_if_click_void, this);
                $(document.body).on('click', this.if_click_void_handler);
            }
        },
        register_selection_shortcuts : function(){
            var view = this.view, me = this;
            var addition_shortcuts = {};
            addition_shortcuts[this.selected_property_name] = function(value, view){
                $(this).toggleClass(me.item_selected_class, value);
            };
            $.extend(view.shortcuts, addition_shortcuts);
        },
        /**
         * 点击空白界面时清除选择
         */
        handle_if_click_void : function(e){
            var $dom = $(e.target);
            if(!$dom.closest('[data-no-selection]').length && !this.view.get_record($dom)){
                this.clear();
            }
        },
        /**
         * @private
         */
        handle_record_click : function(record, e){
            e.preventDefault();
            var $target = $(e.target);
            var is_checkbox = $target.is(this.checkbox_selector);
            var is_data_action = !!$target.closest('[' + this.view.action_property_name + ']').length;
            var range_select = false,
                clear_selection = true,
                directly_click = true;
            if (is_data_action) {//如果是功能性操作直接返回，对应的mgr中已有相应处理
                return;
            }
            if (is_checkbox || e.ctrlKey || e.metaKey) { // 如果是checkbox或按了ctrl键，不清除已选项
                clear_selection = false;
                directly_click = false;
            }
            // 如果按了shift，表示区域选择
            if (e.shiftKey) {
                range_select = true;
                directly_click = false;
            } else { // 选中操作记录当前操作的记录
                if(!record.get("selected")){
                    this.last_click_record = record;
                }

            }
            // 如果点了checkbox、按了ctrl、shift、meta键，当作选择处理
            // 如果都不是，则触发before_select_click事件，如果返回为非false才进行后续选择，以便视图实现直接点击打开、展开等逻辑
            if (!directly_click || this.trigger('before_select_click', record, e) !== false) {
                this.select(record, clear_selection, range_select);
            }
            //  如果按了shift  选中操作结束以后再记录当前的操作记录
            if(e.shiftKey){
                this.last_click_record = record;
            }
        },
        /**
         * 执行选择操作
         * @param {Record} record 当前选择的记录
         * @param {Boolean} clear_selection (optional) 是否清除之前的选中，如果是则清除本次选中外的选中。如果不是则为增量选择。默认为true
         *      需要注意的一点是，如果clear_selection为false时，当前记录如果已经选中过，则会取消选择
         * @param {Boolean} range_select (optional) 是否为范围选择，如果是表示从上次范围选择前的记录到当前记录，中间的都选中。默认为false。
         */
        select : function(record, clear_selection, range_select){
            var last_click_record = this.last_click_record,
                store = this.view.store,
                selected_property_name = this.selected_property_name,
                index = store.indexOf(record),
                start, end;
            if(range_select){
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
            }
            var selected_records = [];
            store.each(function (rec, idx) {
                var selected, old_selected = rec.get(selected_property_name);
                // 是否是操作目标
                var in_range = range_select ? (idx >= start && idx <= end || idx >= end && idx <= start) : idx === index;
                if (range_select) { // 多选时，范围内的必定选中，范围外的如果没有ctrl则不选，如果有则保持
                    if (in_range) {
                        selected = true;
                    } else {
                        selected = clear_selection ? false : old_selected;
                    }
                } else { // 单选时
                    if (clear_selection) { // 如果没按ctrl，目标记录一定选中，其它的则不选
                        selected = in_range;
                    } else { // 如果按了ctrl，其它记录不变，目标记录切换状态
                        selected = in_range ? !old_selected : old_selected;
                    }
                }
                if (selected !== old_selected) {
                    rec.set(selected_property_name, selected);
                }
                if(selected){
                    selected_records.push(selected);
                }
            });
            this.trigger('selectionchanged', selected_records);
        },
        clear : function(){
            var me = this,
                view = me.view;
            if(!view.destroyed && view.store){
                view.store.each(function(record){
                    record.set(me.selected_property_name, false);
                });
                this.trigger('selectionchanged', []);
            }
        },
        get_selected : function(){
            var records = this.view.store.slice(), i, record, selected = [];
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.data.selected){
                    selected.push(record);
                }
            }
            return selected;
        },
        destroy : function(){
            this.stopListening();
            if(this.clear_on_click_void){
                $(document.body).off('click', this.if_click_void_handler);
            }
            this.on_destroy();
        },
        on_destroy : $.noop
    });
    return Module;
});