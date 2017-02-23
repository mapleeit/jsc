/**
 * 外链管理模块
 * @author hibincheng
 * @date 2013-8-15
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record'),
        console = lib.get('./console'),
        global_event = common.get('./global.global_event'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        group_store = require('./Store'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        tbar = require('./toolbar.tbar'),
        selection = require('./selection'),
        file_path = require('./file_path.file_path'),
        view_switch = require('./view_switch.view_switch'),
        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,
        last_refresh_time = new Date(),
        timer,
        timer_time = 0,
        doc = document, body = doc.body, $body = $(body),
        undefined;

    var store = new Store();
    var loader = new Loader();
    var view = new View({
        store : store
    });

    var mgr = new Mgr({
        view: view,
        loader: loader,
        store: store,
        group_store: group_store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : 'photo_group',
        list_view : view,
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
                if(view_switch.is_group_view()) {
                    mgr.load_groups();
                } else {
                    mgr.load_all_files();
                }

                scroller = main_ui.get_scroller();
                inited = true;
            } else {
                this.on_refresh();
            }

            this.listenTo(global_event, 'share_refresh', this.on_refresh);
            this.listenTo(global_event, 'window_resize', this.on_win_resize);
            this.listenTo(global_event, 'switch_mode', this.on_switch_mode);
            this.listenTo(global_event, 'edit_cancel_all', this.on_cancel_sel);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            this.listenTo(ds_photo_event, 'add remove move update', this.handle_group_changed);
            this.listenTo(ds_photogroup_event, 'add update', this.handle_group_changed);
        },
        on_activate: function() {
            $body.addClass('page-picture');
            this.init();

            file_path.on_activate();
            //if(view_switch.is_group_view()) {
                view.render_path();
            //}

            tbar.on_activate();
            view.render_editbar();

            view_switch.on_activate();
            view_switch.render(main_ui.get_$bar0());
            selection.disable_selection();
            main_ui.sync_size();
        },

        on_deactivate: function() {
            $body.removeClass('page-picture');
            selection.disable_selection();
            file_path.on_deactivate();
            view_switch.on_deactivate();
            tbar.on_deactivate();

            //file_path.toggle(false);
            view.back_to_group();
            main_ui.get_$bar2().hide();

            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            this.stopListening(global_event, 'switch_mode', this.on_switch_mode);
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'share_refresh', this.on_refresh, this);
            this.stopListening(global_event, 'edit_cancel_all', this.on_cancel_sel, this);
            this.stopListening(ds_photo_event, 'add remove move update', this.handle_group_changed);
            this.stopListening(ds_photogroup_event, 'add update', this.handle_group_changed);
        },

        load_more: function() {
            if(view_switch.is_group_view() && view.is_group_view()) {
                mgr.load_groups();
            } else {
                mgr.load_all_files();
            }
        },

        on_switch_mode: function(group) {
            // 更新路径
            file_path.update(group);
            main_ui.get_$bar2().show();
        },

        // 如果是group_store自身触发的事件，bypass
        handle_group_changed: function(records, meta){
            if(meta.src === store){
                return;
            }
            if(meta.move_photos) {
                mgr.on_move_photos(records);
                return;
            }
            this.buffer_group_reload(1500);
        },

        buffer_group_reload: function(delay){
            // 如果上次刷新在3秒内，则到第3秒才刷新
            // 如果在3秒开外，则delay秒后刷新（此时间看后台的反应速度）
            delay = delay || 1500;
            var me = this;
            var wait_time = Math.max(delay, 3000 - (new Date() - last_refresh_time));
            var will_time = new Date() + wait_time;
            // 如果本次预计刷新的时间比原定时间还要提前，无视掉
            // 因为原定时间可能是考虑到后台更新延时
            if(will_time <timer_time){
                return;
            }
            clearTimeout(timer);

            timer = setTimeout(function() {
                me.on_refresh();
            }, wait_time);
            timer_time = will_time;
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            store.clear();
            this.load_more();
            loader.set_checkalled(false);
        },

        /**
         * 编辑态bar中，点击取消选择
         */
        on_cancel_sel: function() {
            this.list_view.cancel_sel();
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                this.load_more();
            }

            //窗口大小改变时，也需要调整item的width
            view.update_item_width();
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                this.load_more();
            }
        }
    });

    return module.get_common_module();
});