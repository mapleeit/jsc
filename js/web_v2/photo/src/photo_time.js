/**
 * 图片时间轴模块
 * @author xixinhuang
 * @date 2016-09-21
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        time_global_event = common.get('./global.global_event').namespace('photo_time'),
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

        module_name = 'photo_time',//库分类模块名
        menu = require('./time.menu'),
        Select = require('./time.Select'),

        scroller,
        doc = document, body = doc.body, $body = $(body),
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
        Select: Select,
        menu: menu,
        list_selector : '#_photo_time_body'
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
                mgr.load_files(true);
                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                mgr.load_files(true);
            }
        },
        on_activate: function() {
            var me = this;
            $body.addClass('page-picture');
            me.init();
            this.listenTo(global_event, 'doc_refresh', this.on_refresh);
            this.listenTo(global_event, 'edit_cancel_all', this.on_cancel_sel);
            this.listenTo(time_global_event, 'delete_item', this.on_delete_item);
            this.listenTo(time_global_event, 'delete_group', this.on_delete_group);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            $body.removeClass('page-picture');
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'doc_refresh', this.on_refresh, this);
            this.stopListening(global_event, 'edit_cancel_all', this.on_cancel_sel, this);
            this.stopListening(time_global_event, 'delete_item', this.on_delete_item, this);
            this.stopListening(time_global_event, 'delete_group', this.on_delete_group, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            mgr.load_files(true);
        },

        /**
         * 编辑态bar中，点击取消选择
         */
        on_cancel_sel: function() {
            this.list_view.cancel_sel();
        },
        /**
         * 删除图片
         */
        on_delete_item: function(record) {
            this.list_view.delete_item(record);
        },
        /**
         * 删除图片日期分组
         */
        on_delete_group: function(group) {
            this.list_view.delete_group(group);
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
                mgr.load_files();//从后加载
            }

            //窗口大小改变时，也需要调整item的width
            view.update_item_width();
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files();
            }
        }
    });

    return module.get_common_module();
});