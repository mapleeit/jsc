/**
 * 更改分组时弹出的精简分组列表
 * @author cluezhang
 * @date 2013-11-10
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
        
        $ = require('$');
    var Module = inherit(View, {
        enable_hovering : false,
        enable_context_menu : false,
        list_tpl : function(){
            return tmpl.detail_group_dialog_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.detail_group_dialog_items({
                records : records
            });
        },
        item_selector : 'li.list',
        item_checked_class : 'checked',
        shortcuts : {
            checked : function(value, view){
                $(this).find('a').toggleClass(view.item_checked_class, value);
            },
            editing : function(value, view, record){
                var $text_ct = $(this).find('span'),
                    name = record.get('name');
                if(value){
                    $text_ct.empty().append($('<input style="text" value="爱情">').val(name));
                }else{
                    $text_ct.text(name);
                }
            }
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 当store刷新后，重新设定选中项
            this.listenTo(this.store, 'datachanged', this.mark_initial_selected, this);
            this.mark_initial_selected(); // 如果store已经加载过，执行一次
        },
        // 初始化选中
        mark_initial_selected : function(){
            var me = this,
                initial_record = this.get_selected();
            if(!initial_record){
                return;
            }
            me.store.each(function(record){
                if(record.get('id') === initial_record.get('id')){
                    // 找到了
                    me.set_selected(record);
                    return false;
                }
            });
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this.handle_click, this);
        },
        handle_click : function(record, event){
            event.preventDefault();
            if(record.get('dummy')){
                return; // 正在新建的记录不能选
            }
            this.set_selected(record);
            user_log('ALBUM_GROUP_SET_COVER_CHOSE_PIC');
        },
        set_selected : function(record){
            var old_record = this.selected_record;
            if(old_record){
                old_record.set('checked', false);
            }
            this.selected_record = record;
            record.set('checked', true);
        },
        get_selected : function(){
            return this.selected_record;
        },
        on_destroy : function(){
            var record = this.selected_record;
            if(record){
                record.set('checked', false);
            }
            Module.superclass.on_destroy.apply(this, arguments);
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 64,
        thumb_height : 64,
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },
        update_ellipsis : $.noop
        // --------------- 缩略图结束 -----------------
    });
    return Module;
});