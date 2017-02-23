/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */


define(function (require, exports, module) //noinspection JSValidateTypes,JSValidateTypes
{
    var
        lib = require('lib'),
        common = require('common');
    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),
        main_mod = require('main').get('./main'),
        main_ui = require('main').get('./ui'),
        Module = require('./Module'),
        Loader = require('./Loader'),
        View = require('./View'),
        Toolbar  = require('./header.Toolbar'),
        Mgr = require('./Mgr'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,
        module_name = 'note',//
        window_resize_event = 'window_resize_real_time',
        scroller,
        console = lib.get('./console'),
        undefined;

    var store = new Store();
    var loader = new Loader({
        store:store
    });
    var toolbar = new Toolbar({
    });

    var view = new View({
        store : store,
        toolbar :toolbar,
        loader:loader
    });
    var mgr = new Mgr({
        toolbar: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    require('note_css');

    var module = new Module({
        name: module_name,
        list_view: view,
        list_header: toolbar,
        loader: loader,
        init: function () {
	        window.maskZyj = true;
            if (!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
	            //测速
	            try{
		            var flag = '21254-1-12';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
                mgr.view.get_note_editor_frame();
                //先加载iframe  延迟 加载数据100ms
              //  setTimeout(function(){
                    mgr.load_files();
              //  },100)
                scroller = view.get_scroller();
                mgr.set_scroller(scroller);
                this.listenTo(scroller, 'scroll', this.on_win_scroll);
                inited = true;
            }

        },
        on_activate: function (params) {
            var me = this;
            me.init();
            main_ui.sync_size();
            global_event.trigger("note_timing_save");
            mgr.view.sync_editor_size();
            me.listenTo(global_event, window_resize_event, function() {
                mgr.view.sync_editor_size();
            });
            me.listenTo(global_event, "add_note", function() {
                mgr.view.trigger('action','create');
            });
            if(params && params.add_note==true){
                window.location.hash='m=note';      //手动修改hash,防止hash值错误无法跳转到其他目录
                mgr.view.trigger('action','create');
            }

            me.listenTo(global_event, 'page_unload', function() {
                mgr.auto_save_note();//关闭窗口时自动保存一下笔记
            });
            // 浏览器关闭、刷新前弹出确认框
            global_function.register('onbeforeunload', function () {
                if(main_mod.get_cur_mod_alias() === 'note' && query_user.get_skey()) {
                    //关闭窗口时自动保存一下笔记
                    mgr.auto_save_note();
                    return '您可能有数据没有保存';
                }
            });
            //appbox监听窗口关闭和刷新
            global_function.register('WYCLIENT_BeforeCloseWindow', function (is_close_QQ) {
                if(main_mod.get_cur_mod_alias() === 'note' && query_user.get_skey()) {
                    //关闭窗口时自动保存一下笔记
                    mgr.auto_save_note();
                    return true;
                }
            });
        },

        on_deactivate: function () {
            var me =  this;
            global_event.trigger("note_stop_timing_save");
            me.stopListening(global_event, window_resize_event);
            me.stopListening(global_event, "add_note");
            me.stopListening(global_event, 'page_unload');
            mgr.auto_save_note();//切换到别的tab时自动保存一下笔记
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
           if ( !loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files();
           }
        }
    });

    return module.get_common_module();
})