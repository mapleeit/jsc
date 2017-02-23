/**
 * 分组视图中的 分组列表
 * @author cluezhang
 * @date 2013-11-27
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        
        View_mode = require('./View_mode'),
        Group_mgr = require('./group.Mgr'),
        Group_view = require('./group.View'),
        
        $ = require('$');
    var Module = inherit(View_mode, {
        create_view : function(){
            var me = this;
            var view = new Group_view({
                store : this.store,
                thumb_loader : this.thumb_loader,
                $ct: this.$ct,
                enable_drag_sort: true
            });
            view.on('opengroup', function(record){
                me.trigger('entergroup', record);
                user_log('ALBUM_GROUP_ENTER');
            });
            var mgr = this.get_singleton('mgr');
            view.on('action', mgr.process_action, mgr);
            return view;
        },
        create_mgr : function(){
            var mgr = new Group_mgr({
                store : this.store,
                thumb_loader : this.thumb_loader
            });
            return mgr;
        },
        // 当处于编辑时，要锁住外界触发的组列表更新
        is_editing : function(){
            return this.get_singleton('view').is_editing();
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.store.reload().done(function(){
                mini_tip.ok('列表已更新');
            });
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.store.reload();
            this.get_singleton('view').render(this.$ct);
        },
        on_deactivate : function(){
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('view').refresh_drag_sort();
        },
        on_toolbar_act : function(act, e){
            var records, mgr, view;
            mgr = this.get_singleton('mgr');
            view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected ? view.get_selected() : [], e, view.get_action_extra());
        },
        get_toolbar_meta : function(){
            return {
                create_group : 1
            };
        }
    });
    return Module;
});