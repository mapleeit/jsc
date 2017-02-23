/**
 * 组视图界面
 * 有GroupMgr, InGroupMgr, GroupStore, GroupView, InGroupStore, InGroupView
 * @author cluezhang
 * @date 2013-11-5
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scoller'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record');
    var View_mode = require('./View_mode'),
        Composite_view_mode = require('./Composite_view_mode'),
        Requestor = require('./Requestor'),
        
        Group_store = require('./group.Store');
    var Group_panel = require('./group.Group_panel'),
        Detail_panel = require('./group.detail.Panel');
    var requestor = new Requestor();
    var Module = inherit(Composite_view_mode, {
        create_group_store : function(){
            var store = new Group_store({
                
            });
            var me = this,
                last_refresh_time = new Date(),
                timer,
                timer_time = 0,
                handle_group_changed = function(records, meta){
                    // 如果是group_store自身触发的事件，bypass
                    if(meta.src === store){
                        return;
                    }
                    buffer_group_reload(1500);
                },
                buffer_group_reload = function(delay){
                    // 如果上次刷新在3秒内，则到第3秒才刷新
                    // 如果在3秒开外，则delay秒后刷新（此时间看后台的反应速度）
                    delay = delay || 1500;
                    var wait_time = Math.max(delay, 3000 - (new Date() - last_refresh_time));
                    var will_time = new Date() + wait_time;
                    // 如果本次预计刷新的时间比原定时间还要提前，无视掉
                    // 因为原定时间可能是考虑到后台更新延时
                    if(will_time <timer_time){
                        return;
                    }
                    clearTimeout(timer);
                    
                    timer = setTimeout(group_change_handler, wait_time);
                    timer_time = will_time;
                },
                group_change_handler = function(records, meta){
                    if(me.activated){
                        // 如果正在编辑，延后
                        if(me.mode === 'list' && me.get_mode_instance('list').is_editing()){
                            buffer_group_reload();
                        }else{
                            store.reload();
                        }
                    }
                };
            // 当外界的数据有变动时，更新之
            // 秒传时，add事件可能会很频繁
            store.listenTo(ds_photo_event, 'add remove move update', handle_group_changed);
            store.listenTo(ds_photogroup_event, 'add update', handle_group_changed);
//            store.reload();
            return store;
        },
        create_mode_list : function(){
            var mode = new Group_panel({
                store : this.get_singleton('group_store'),
                $ct : this.$ct,
                thumb_loader : this.thumb_loader
            });
            
            mode.on('entergroup', this.enter_group, this);
            
            return mode;
        },
        create_mode_detail : function(){
            var mode = new Detail_panel({
                group_store : this.get_singleton('group_store'),
                $ct : this.$ct,
                thumb_loader : this.thumb_loader
            });
            
            mode.on('back', this.back_to_list, this);
            
            return mode;
        },
        enter_group : function(record){
            this.get_mode_instance('detail').set_group(record);
            this.switch_mode('detail');
        },
        back_to_list : function(){
            this.switch_mode('list');
        },
        on_activate : function(){
            this.switch_mode('list');
            Module.superclass.on_activate.apply(this, arguments);
        },
        // private
        // 获取当前进入的组记录，如果是列表则返回null
        get_current_group : function(){
            if(this.mode === 'detail'){
                return this.get_mode_instance('detail').get_group();
            }
            return null;
        }
    });
    return Module;
});