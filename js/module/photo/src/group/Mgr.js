/**
 * 
 * @author cluezhang
 * @date 2013-11-7
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        ds_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Requestor = require('./Requestor'),
        Group_record = lib.get('./data.Record'),
        Group_detail_store = require('./group.detail.Store'),
        Group_cover_view = require('./group.cover.View'),
        tmpl = require('./tmpl'),
        
        $ = require('$');
    var requestor = new Requestor();
    var byte_len = function(str){
        return encodeURIComponent(str).replace(/%\w\w/g, 'a').length;
    };
    var group_name_validator = {
        verify : function(name){
            if(!name){
                return '不能为空';
            }
            if(byte_len(name)>512){
                return '过长';
            }
            if(/[\\:*?\/"<>|]/.test(name)){
                return '不能含有特殊字符';
            }
            return true;
        }
    };
    var Mgr = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        report: function(action,event){
            var self = $(event.currentTarget),
                is_menu = !!self.attr('data-action');
            switch(action){
                case('rename'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_RENAME');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_RENAME');
                    return;
                case('delete'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_DEL');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_DEL');
                    return;
                case('set_cover'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_SET_COVER');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_SET_COVER');
                    return;
            }
        },
        // 分派动作
        process_action : function(action_name, data, event, extra){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this.report(action_name,event);
                this[fn_name]([].concat(data), event, extra);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        common_request_fail : function(msg){
            if(msg !== requestor.canceled){
                mini_tip.error(msg);
            }
        },
        on_delete : function(records, event){
            var record = records[0],
                me = this;
            widgets.confirm(
                '删除分组',
                '确定要删除这个分组吗？',
                record.get('name'),
                function () {
                    requestor.delete_group(record).done(function(){
                        me.store.remove(record);
                        me.store.total_length --;
                        ds_event.trigger('remove', [record], {src:me.store});
                        mini_tip.ok('删除成功');
                    }).fail(function(msg){
                        if(msg !== requestor.canceled){
                            mini_tip.error(msg);
                        }
                    });
                },
                $.noop,
                null,
                true
            );
        },
        // 重命名分组
        on_rename : function(records, event, info){
            if(this.rename_task){
                //this.rename_task.reject();
                return;
            }
            var me = this,
                record = records[0],
                old_value = record.get('name'),
                def = this.rename_task = $.Deferred(),
                view = info.view;
            var editor = view.start_edit(record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    requestor.rename_group(record.get('id'), old_value, value).done(function(){
                        mini_tip.ok('修改成功');
                        def.resolve(value);
                    }).fail(function(msg){
                        me.common_request_fail(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(value){
                record.set('name', value);
                ds_event.trigger('update', record, {
                    src : me.store,
                    changes : {
                        name:1
                    }
                });
            }).always(function(){
                editor.destroy();
                me.rename_task = null;
            });
        },
        // 创建分组
        on_create_group : function(records, event, info){
            if(this.create_task){
                //this.create_task.reject();
                return;
            }
            var me = this,
                def = this.create_task = $.Deferred(),
                view = info.view,
                store = me.store,
                // 占位分组，仅用于新建
                old_value = '',
                dummy_record = new Group_record({
                    name : old_value,
                    dummy : true
                });
            store.add(dummy_record, 0);
            store.total_length++;
            var editor = view.start_edit(dummy_record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    requestor.create_group(value).done(function(record){
                        mini_tip.ok('创建成功');
                        def.resolve(record);
                    }).fail(function(msg){
                        me.common_request_fail(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(record){
                store.add(record, 0);
                store.total_length++;
                ds_event.trigger('add', [record], {
                    index : 0,
                    src : me.store
                });
            }).fail(function(){
                
            }).always(function(){
                store.remove(dummy_record);
                me.store.total_length--;
                editor.destroy();
                me.create_task = null;
            });
            
            return def;
        },
        // 设置封面
        on_set_cover : function(records, event){
            var me = this;
            var group_record = records[0];
            var $fragment_ct = $('<div></div>');
            // 当前的封面
            var old_cover = group_record.get('cover');
            old_cover = old_cover ? old_cover[0] : null;
            var cover_store = new Group_detail_store({
                group_record : group_record,
                page_size : 20
            });
            
            cover_store.reload();
            var view = new Group_cover_view({
                store : cover_store,
                initial_cover : old_cover,
                thumb_loader : this.thumb_loader
            });
            view.on('reachbottom', cover_store.load_more, cover_store);
            view.render($fragment_ct);
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
                title: '更改封面',
                destroy_on_hide: true,
                content: $fragment_ct,
                //tmpl : tmpl.dialog,
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
                        var record = view.get_checked();
                        if(!record){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                            return;
                        }
                        var group_id = group_record.get('id');
                        requestor.set_group_album(group_id, record).done(function(){
                            group_record.set('cover', [{
                                pdir_key : record.get_pid(),
                                file_id : record.get_id()
                            }]);
                            ds_event.trigger('update', group_record, {
                                src : me.store,
                                changes : {
                                    cover : 1
                                }
                            });
                            dialog.hide();
                            user_log('ALBUM_GROUP_SET_COVER_CHOSE_PIC');
                            mini_tip.ok('设置成功');
                        }).fail(function(msg){
                            if(msg !== requestor.canceled){
                                warn(msg); // TODO 移到按钮右侧显示
                            }
                        });
                    }
                }
            });
            dialog.once('render', function(){
                // 初始化消息提示
                $msg_ct = dialog.$el.find('.edit-cover-msg');
            });
            dialog.once('destroy', function(){
                view.destroy();
            });
            view.once('refresh', function() {
                dialog.show();
            });

            return dialog;
        },
        //拖动排序
        on_drag_sort: function(records, event, info){
            var me = this,
                source = records[0],
                target = records[1];
            me.store.remove(source);
            me.store.add(source , me.store.indexOf(target) +(info.is_before ? 0 : 1));
            requestor.set_group_orders(me.store.slice(0)).done(function(){
                mini_tip.ok('排序成功');
            }).fail(function(msg){
                    if(msg !== requestor.canceled){
                        mini_tip.error(msg);
                    }
                    me.store.reload();
                });
        }
    });
    return Mgr;
});