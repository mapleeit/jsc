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
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        header = require('./header.header'),

        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        undefined;
    
    var store = new Store();
    var loader = new Loader();
    var view = new View({
        store : store
    });

    header.bind_store(store);//绑定数据源

    var mgr = new Mgr({
        header: header,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : 'share',
        list_view : view,
        list_header: header,
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
	                var flag = '21254-1-14';
	                if(window.g_start_time) {
		                huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		                huatuo_speed.report();
	                }
                } catch(e) {

                }

                mgr.load_files(0, first_page_num);

                scroller = main_ui.get_scroller();

                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
            this.listenTo(global_event, 'share_refresh', this.on_refresh);
            this.listenTo(global_event, 'window_resize', this.on_win_resize);
//            this.listenTo(global_event, 'window_scroll', this.on_win_scroll);
            //this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
        },
        on_activate: function() {
            var me = this;
            me.init();
            //document.title = '分享的链接 - 微云';

            main_ui.sync_size();
        },

        on_deactivate: function() {
            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            //this.stopListening(global_event, 'window_scroll' , this.on_win_scroll);
            //this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'share_refresh', this.on_refresh, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }

            mgr.load_files(0, first_page_num, is_from_nav === false ? false : true);
            header.get_column_model().cancel_checkall();
            loader.set_checkalled(false);
            if(is_from_nav !== false) {
                user_log('NAV_SHARE_REFRESH');
            }
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            console.log('share on_win_resize');
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.load_files(size, num - size);//从后加载
            }

            header.sync_scrollbar_width_if();//同步滚动条宽度到表头
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            console.log('share on_win_scroll');
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files(store.size(), STEP_NUM);
            }
        }
    });
    
    return module.get_common_module();
});