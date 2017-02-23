/**
 * 分组 -> 详情 -> 更改分组
 * @author xixinhuang
 * @date 2016-09-08
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        View = lib.get('./data.View'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        tmpl = require('./tmpl');

    var groupView = inherit(View, {
        enable_box_select : false,
        enable_context_menu : false,
        enable_select : true,
        list_selector : 'ul',
        item_selector : 'li[data-record-id]',
        //dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        item_checked_class : 'checked',
        initial_record: null,
        //enable_empty_ui: true,
        //initial_cover : null,
        shortcuts : {
            checked : function(checked, view){
                $(this).find('.link').toggleClass(view.item_checked_class, checked);
            }
        },
        list_tpl : function(){
            return tmpl.dialog_group_list();
        },
        tpl : function(groups){
            return this.get_html([groups]);
        },
        get_html : function(groups){
            var me = this;
            return tmpl.dialog_group_items({
                records : me.store.get_records(),
                groups: groups
            });
        },
        constructor : function(){
            groupView.superclass.constructor.apply(this, arguments);
            // 当找到初始封面时，设定为已选中
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
            groupView.superclass.after_render.apply(this, arguments);
            // 点击选择
            this.on('recordclick', this.handle_click, this);
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            if(record.get('dummy')){
                return; // 正在新建的记录不能选
            }
            this.set_selected(record);
        },
        set_selected : function(record){
            var old_record = this.selected_record;
            if(old_record){
                old_record.set('checked', false);
            }
            this.selected_record = record;
            this.store.set_group(record);
            record.set('checked', true);
        },
        get_selected : function(){
            return this.selected_record || this.initial_record;
        },
        // 如何更新缩略图
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },

        move_photos_dialog: function() {
            var me = this,
                $fragment_ct = $('<div></div>');
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };

            this.render($fragment_ct);
            //等view进行render完毕后再load数据
            this.store.load_groups();
            var dialog=  new widgets.Dialog({
                klass : 'full-pop-medium',
                title: '更改分组',
                destroy_on_hide: true,
                content: $fragment_ct,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : '选定',
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : '取消',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : true
                    }
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        var _data = me.store.get_data();
                        if(!_data.old_group_id || !_data.new_group_id){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                        } else if(_data.old_group_id === _data.new_group_id){
                            mini_tip.error('请选择不同的分组');
                        } else {
                            ds_event.trigger('move', _data, {
                                src : me.store,
                                move_photos: true
                            });
                        }
                    }
                }
            });
            dialog.once('render', function(){
                // 初始化消息提示
                $msg_ct = dialog.$el.find('.edit-cover-msg');
            });
            dialog.once('destroy', function(){
                dialog.hide();
            });
            dialog.show();
            return dialog;
        },

        on_destroy : function(){
            var record = this.selected_record;
            if(record){
                record.set('checked', false);
            }
            groupView.superclass.on_destroy.apply(this, arguments);
        }
    });
    return groupView;
});