/**
 * 分组 -> 设置封面视图
 * @author cluezhang
 * @date 2013-11-15
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        Scroller = common.get('./ui.scroller'),
        
        Photo_view = require('./photo.View'),
        
        tmpl = require('./tmpl'),
        Thumb_loader = require('./photo.Thumb_loader'),
        
        $ = require('$');
    var Module = inherit(Photo_view, {
        enable_box_select : true,
        enable_context_menu : true,
        enable_select : true,
        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        // 初始封面
        initial_cover : null,
        list_tpl : function(){
            return tmpl.group_cover_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.group_cover_items({
                records : records,
                id_perfix : this.record_dom_map_perfix
            });
        },
        item_selector : 'li',
        item_checked_class : 'checked',
        shortcuts : {
            checked : function(checked, view){
                $(this).toggleClass(view.item_checked_class, checked);
            }
        },
        /**
         * @cfg {Object} old_cover 当前设置的封面
         */
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 当找到初始封面时，设定为已选中
            if(this.initial_cover){
                this.listenTo(this.store, 'datachanged add', this.mark_initial_cover, this);
                this.mark_initial_cover(); // 如果store已经加载过，执行一次
            }
        },
        // 初始时标记选中状态
        mark_initial_cover : function(){
            var me = this,
                initial_cover = me.initial_cover;
            me.store.each(function(record){
                if(record.get_pid() === initial_cover.pdir_key && record.get_id() === initial_cover.file_id){
                    // 找到了
                    me.set_checked(record);
                    return false;
                }
            });
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            // 点击选择
            this.on('recordclick', this.handle_click, this);
            // 滚动加载更多
            var scroller = this.scroller = new Scroller(this.$list);
            scroller.on('scroll', this.if_reachbottom, this);
        },
        if_reachbottom : function(){
            if(this.scroller.is_reach_bottom()){
                this.trigger('reachbottom');
            }
        },
        // ------------- 这里的空白页面不能用那个通用的图片了，自己加个空白说明吧
        list_height : 60,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.cover_empty()).height(this.get_list_height()).insertAfter(this.$list);
            this.$list.hide();
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            this.set_checked(record);
        },
        set_checked : function(record){
            if(this.initial_cover){
                this.initial_cover = null;
                this.store.off('add datachanged', this.mark_initial_cover, this);
            }
            var old_record = this.checked_record;
            if(old_record && old_record !== record){
                old_record.set('checked', false);
            }
            this.checked_record = record;
            record.set('checked', true);
        },
        get_checked : function(){
            return this.checked_record;
        },
        // 如何更新缩略图
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            if(this.scroller){
                this.scroller.destroy();
            }
        }
    });
    return Module;
});