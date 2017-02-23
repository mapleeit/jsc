/**
 * 分组 -> 设置封面视图
 * @author cluezhang
 * @date 2013-11-15
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        Scroller = common.get('./ui.scroller'),
        ds_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        View = lib.get('./data.View'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        tmpl = require('./tmpl');

    var coverView = inherit(View, {
        enable_box_select : false,
        enable_context_menu : false,
        enable_select : true,
        list_selector : 'ul',
        item_selector : 'li[data-record-id]',
        dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        item_checked_class : 'checked',
        enable_empty_ui: true,
        initial_cover : null,
        shortcuts : {
            checked : function(checked, view){
                $(this).find('.link').toggleClass(view.item_checked_class, checked);
            }
        },
        list_tpl : function(){
            return tmpl.cover_list();
        },
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.cover_items({
                records : records,
                group: me.store.get_group()
            });
        },

        /**
         * @cfg {Object} old_cover 当前设置的封面
         */
        constructor : function(){
            coverView.superclass.constructor.apply(this, arguments);
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
            coverView.superclass.after_render.apply(this, arguments);
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
        list_height : 60,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.cover_empty()).insertAfter(this.$list);
            this.$list.hide();
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            this.set_checked(record);
        },
        set_checked : function(record){
            if(!record) {
                return;
            }
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

        set_cover: function() {
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
            var dialog=  new widgets.Dialog({
                klass : 'full-pop-medium',
                title: '更改封面',
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
                        var check_record = me.get_checked();
                        if(!check_record){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                            return;
                        }
                        me.store.set_group_cover(check_record).done(function() {
                            //trigger 出来，更新分组
                            ds_event.trigger('update', check_record, {
                                src : me.store,
                                changes : {
                                    cover : 1
                                }
                            });
                            dialog.hide();
                            mini_tip.ok('设置成功');
                        }).fail(function(msg) {
                            mini_tip.ok(msg || '服务器繁忙，请稍后重试！');
                        });
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
        },

        on_destroy : function(){
            coverView.superclass.on_destroy.apply(this, arguments);
            if(this.scroller){
                this.scroller.destroy();
            }
        }
    });
    return coverView;
});