/**
 * 文档模块
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
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
        Toolbar = require('./header.Toolbar'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        module_name = 'doc',//库分类模块名

        scroller,

        undefined;

    var store = new Store();
    var loader = new Loader({
        module_name: module_name
    });
    var toolbar = new Toolbar({
        module_name: module_name
    });
    var view = new View({
        module_name: module_name,
        store : store,
        list_selector : '#_doc_view_list>.files'
    });


    var mgr = new Mgr({
        module_name: module_name,
        header: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : module_name,
        list_view : view,
        list_header: toolbar,
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

	            //测速
	            try{
		            var flag = '21254-1-11';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }

                mgr.load_files({
                    offset: 0,
                    count: first_page_num,
                    sort_type: 'mtime',
                    filter_type: 'all'
                });
                mgr.set_first_page_num(first_page_num);
                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
        },
        on_activate: function() {
            var me = this;
            me.init();
            this.listenTo(global_event, 'doc_refresh', this.on_refresh);
            this.listenTo(global_event, 'edit_cancel_all', this.on_cancel_sel);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'doc_refresh', this.on_refresh, this);
            this.stopListening(global_event, 'edit_cancel_all', this.on_cancel_sel, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }
	        //测速
	        try{
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }

            mgr.load_files({
                offset: 0,
                count: first_page_num
            }, is_from_nav === false ? false : true);
            if(is_from_nav !== false) {
                user_log('NAV_DOC_REFRESH');
            }
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
                mgr.set_first_page_num(first_page_num);
                mgr.load_files({
                    offset: size,
                    count: num - size
                });//从后加载
            }
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files({
                    offset: store.size(),
                    count: STEP_NUM
                });
            }
        }
    });

    return module.get_common_module();
});