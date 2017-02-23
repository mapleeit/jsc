/**
 * 文件中转站模块
 * @author xixinhuang
 * @date 2015-11-08
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        global_event = common.get('./global.global_event'),
        update_cookie = common.get('./update_cookie'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        cookie = lib.get('./cookie'),
        image_lazy_loader = require('./image_lazy_loader'),
        header = require('./header.header');

    var store = require('./store'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        parse = require('./file.parse'),
        Loader = require('./loader'),

        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        is_from_nav = true,
        scroller,
        last_upload_refresh_time,
        refresh_flag,                  //刷新标志
        refresh_interval = 1000 * 5,  //每次刷新间隔时间
        BIG_FILE_SIZE = 1024 * 20,
        inited = false,

        undefined;
    var loader = new Loader();
    var mgr = new Mgr();
    header.bind_store(store);//绑定数据源

    var station = new Module('client._station', {
        render: function(data) {
            var me = this;

            this.render_bar();
            View.render();
            store.init(data);
            mgr.init({
                header: header,
                view: View,
                store: store,
                loader: loader,
                step_num: STEP_NUM
            });
            //update_cookie.init();

            first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
            window.onresize = function() {
                var height = $(window).height(),
                    width = $(window).width();
                //global_event.trigger('window_resize', width, height);
                me.on_win_resize(width, height);
            };

            scroller = View.get_scroller();

            this.listenTo(global_event, 'station_refresh', function(size) {
                me.on_refresh(true, size);
            });

            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            this.speed_time_report();
        },

        async: function() {
            this.render([]);
        },

        /**
         * 刷新操作，大文件立即刷新，小文件隔10秒刷新一次
         */
        on_refresh: function(is_refresh_now, size) {
            var me = this;
            if(is_refresh_now) {
               this.do_refresh();
            } else if(!last_upload_refresh_time) {
                var now_time = new Date().getTime();
                last_upload_refresh_time = now_time;
                refresh_flag = false;
                this.do_refresh();
            } else if(!this.can_refresh() && !refresh_flag) {
                var now_time = new Date().getTime(),
                    next_refresh_time = refresh_interval - (now_time - last_upload_refresh_time);
                refresh_flag = true;
                setTimeout(function() {
                    me.do_refresh();
                }, next_refresh_time);
            } else if(this.can_refresh() && refresh_flag) {
                var now_time = new Date().getTime();
                last_upload_refresh_time = now_time;
                refresh_flag = false;
                this.do_refresh();
            }
        },

        do_refresh: function() {
            location.reload();
            //Mgr.load_files(0, STEP_NUM, is_from_nav === false ? false : true);
            //header.get_column_model().cancel_checkall();
            //header.update_info();
        },

        //上传多文件，减少闪动，每隔一段时间刷新
        can_refresh: function() {
            var now = new Date().getTime();
            if(!last_upload_refresh_time && (now - last_upload_refresh_time) > refresh_interval) {
                return true;
            }
            return false;
        },

        render_bar: function() {
            //this.$top_ct = $('#_main_top');
            //this.$bar1_ct = $('#_main_bar1');
            //this.$column_ct = $('#_main_station_header');
            //this.$body_ct = $('#_main_box');
            //header.render(this.$top_ct, this.$bar1_ct, this.$column_ct);
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            console.log('share on_win_resize' + first_page_num +':'+ width +':'+ height);
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT);
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                console.log('share first_page_num' + first_page_num);//从后加载
                mgr.load_files(View.get_total_size(), STEP_NUM, false);
            }

            //header.sync_scrollbar_width_if();//同步滚动条宽度到表头
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                console.log('station on_win_scroll');
                mgr.load_files(View.get_total_size(), STEP_NUM, false);
            }
            image_lazy_loader.load_image();
        },

        /*
        * 测速上报到华佗
        * */
        speed_time_report: function() {
            var render_time = +new Date();
            //延时以便获取performance数据
            setTimeout(function() {
                //huatuo_speed.store_point('client', 20, g_serv_taken);
                //huatuo_speed.store_point('client', 21, g_css_time - g_start_time);
                //huatuo_speed.store_point('client', 22, (g_end_time - g_start_time) + g_serv_taken);
                //huatuo_speed.store_point('client', 23, g_js_time - g_end_time);
                //huatuo_speed.store_point('client', 24, (render_time - g_start_time) + g_serv_taken);
                //huatuo_speed.report('client', true);
            }, 1000);
        }
    });

    return station;
});