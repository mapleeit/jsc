/**
 * 
 * @author cluezhang
 * @date 2013-11-8
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_group_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Mgr = require('./photo.Mgr'),
        Group_mgr = require('./group.Mgr'),
        
        Group_dialog_view = require('./group.detail.groupdialog.View'),
        Thumb_loader = require('./photo.Thumb_loader'),
        Requestor = require('./Requestor'),
        tmpl = require('./tmpl'),
        
        $ = require('$');
    var /*group_thumb_loader = new Thumb_loader({
        width : 64,
        height : 64
    }), */requestor = new Requestor();
    var requestor = new Requestor();
    var Inner_mgr = inherit(Mgr, {
        on_set_group : function(records, event){
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
//            if(records.length>=100){
//                mini_tip.warn('一次最多只能修改100张图片');
//                return;
//            }
            // 多张移动分组
            this.moving_records = records;
            this.get_move_dialog().show();
        },
        on_set_as_cover : function(records, event){
            var me = this,
                group_record = me.store.get_group(),
                group_id = group_record.get('id'),
                record = records[0];
            requestor.set_group_album(group_id, record).done(function(){
                group_record.set('cover', [{
                    pdir_key : record.get_pid(),
                    file_id : record.get_id()
                }]);
                ds_group_event.trigger('update', group_record, {
                    src : me.store,
                    changes : {
                        cover : 1
                    }
                });
                mini_tip.ok('设置成功');
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            });
        },
        get_move_dialog : function(){
            var me = this;
            var $fragment_ct = $('<div style="overflow-y:auto;"></div>');
            var group_selection_view = new Group_dialog_view({
                store : this.group_store,
                thumb_loader : this.thumb_loader
            });
            var group_selection_mgr = new Group_mgr({
                store : this.group_store
            });
            group_selection_view.render($fragment_ct);
            var old_group_record = me.store.get_group();
            // 显示错误消息
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };
            var dialog=  new widgets.Dialog({
//                out_look_2_0 : true,
                klass : 'full-pop-medium',
                title: '更改分组',
                destroy_on_hide: true,
                content: $fragment_ct,
                //tmpl : tmpl.dialog,
                show_create_group : true,
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
                    }/*, {
                        id : 'CREATE',
                        text : '创建分组',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : false
                    }*/
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        if(group_selection_view.is_editing()){
                            return;
                        }
                        var record = group_selection_view.get_selected();
                        if(!record){
                            warn('请选择分组');
                            return;
                        }
                        if(old_group_record.get('id') === record.get('id')){
                            warn('请选择不同的分组');
                            return;
                        }
                        me.do_move_photos(me.moving_records, record).done(function(){
                            dialog.hide();
                        });
                    }
                }
            });
            // 绑定新建分组
            dialog.once('render', function(){
                // 初始化消息提示
//                $msg_ct = dialog.$el.find('.edit-cover-msg');
                dialog.$el.on('click', 'a.new-group', function(e){
                    e.preventDefault();
                    // 复用分组列表的新建分组逻辑
                    var task = group_selection_mgr.on_create_group([], e, {
                        store : me.group_store,
                        view : group_selection_view
                    });
                    // 有可能当前正在创建，不用管
                    if(task){
                        // 新建完后自动选中！
                        task.done(function(record){
                            group_selection_view.set_selected(record);
                        });
                    }
                });
            });
            dialog.once('destroy', function(){
                group_selection_view.destroy();
            });
            dialog.show();
            return dialog;
        },
        do_move_photos : function(photos, record){
            var me = this,
                old_group_id = me.store.get_group().get('id'),
                new_group_id = record.get('id');
            // 如果要分批操作，才显示progress
            var show_progress = photos.length > requestor.move_photo_threshold;
            if(show_progress){
                progress.show("正在移动0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return requestor.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show("正在移动" + success_photos.length+"/"+photos.length);
                }
            }).done(function(success_photos, failure_photos){
                me.store.batch_remove(success_photos);
                me.store.total_length -= success_photos.length;
                ds_event.trigger('move', success_photos, {
                    old_group_id : old_group_id,
                    new_group_id : new_group_id,
                    src : me.store
                });
                if(failure_photos.length){
                    mini_tip.warn('部分图片更改分组失败');
                }else{
                    mini_tip.ok('更改分组成功');
                }
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                if(show_progress){
                    progress.hide();
                }else{
                    widgets.loading.hide();
                }
            });
        }
    });
    return Inner_mgr;
});