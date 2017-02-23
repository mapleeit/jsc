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
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        
        Record = lib.get('./data.Record');
    var View_mode = require('./View_mode'),
        Mgr = require('./photo.Mgr'),
        View = require('./photo.View'),
        Store = require('./photo.Store'),
        Requestor = require('./Requestor');
    var requestor = new Requestor();
    var Module = inherit(View_mode, {
        /**
         * 获取每张图占位大小，用于计算每页可显示的张数
         * @return {Object} size 有width与height属性
         */
        get_element_size : function(){
            return {
                width : 140,
                height : 140
            };
        },
        get_page_size : function(){
            var view_size = this.size,
                element_size = this.get_element_size();
            return Math.round(view_size.width*view_size.height / ( element_size.width*element_size.height ));
        },
        create_store : function(){
            var store = new Store({
                page_size : this.get_page_size()
            });
            return store;
        },
        create_view : function(){
            var me = this;
            var view = new View({
                store : this.get_singleton('store'),
                thumb_loader : this.thumb_loader,
                $ct : this.$ct,
                list_height : this.size ? this.size.height : 'auto'
            });
            view.on('action', me.on_view_action, me);
            return view;
        },
        create_mgr : function(){
            var mgr = new Mgr({
                store : this.get_singleton('store')
            });
            return mgr;
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.get_singleton('view').render(this.$ct);
            this.get_singleton('mgr'); // 初始化mgr，因为下载模块要提前加载，否则会因为异步而无法触发
            this.get_singleton('store').reload();
        },
        on_deactivate : function(){
            // 销毁界面
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.get_singleton('store').reload().done(function(){
                //mini_tip.ok('列表已更新');
            });
            // TODO 可考虑将view的可视条数重置
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('store').page_size = this.get_page_size();
            this.get_singleton('view').set_size(this.size);
        },
        on_reachbottom : function(){
            this.get_singleton('store').load_more();
        },
        on_view_action : function(act, records, event, info){
            var mgr = this.get_singleton('mgr');
            mgr.process_action(act, records, event, info);
            return false;
        },
        get_toolbar_meta : function(){
            return {
                batch_delete : 1
            };
        },
        on_toolbar_act : function(act, e){
            var mgr = this.get_singleton('mgr');
            var view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected(), e);
        }
    });
    return Module;
});