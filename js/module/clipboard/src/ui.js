/**
 * 剪贴板模块 ui
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),

        main_ui = require('main').get('./ui'),

        TabView = require('./tab.TabView'),
        Send = require('./send.Send'),
        Receive = require('./receive.Receive'),

        clipboard_plugin = require('main').get('./clipboard_plugin'),
        tmpl = require('./tmpl'),


        tabview,

        undefined;

    var ui = new Module('clipboard_ui', {

        render: function() {

            var me = this;
            this._$ct = $(tmpl.clipboard()).appendTo(main_ui.get_$body_box());

            query_user.on_ready(function() {
                var has_unread_num = !!clipboard_plugin.get_unread_records_num(); //是否有未读消息
	            //测速
	            try{
		            var flag = '21254-1-20';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
                //tabview 两个tab:发送和接收（详细视图在接收tab里）
                tabview = new TabView({
                    $render_to: me._$ct,
                    activeIndex: has_unread_num ? 1 : 0, //默认显示发送tab，有未读消息时进入接收列表
                    items: [new Send(), new Receive()]
                });

                //模块切换时处理
                me
                    .on('activate', function() {
                        var has_unread_num = !!clipboard_plugin.get_unread_records_num(); //是否有未读消息
                        me.show();
                        tabview.activate(has_unread_num ? 1 : 0);
                    })
                    .on('deactivate', function() {
                        me.hide();
                        tabview.deactivate();
                    });
            });
        },

        show: function() {
            this.get_$ct().show();
        },

        hide: function() {
            this.get_$ct().hide();
        },

        get_$ct: function() {
            return this._$ct || (this._$ct = $('#_clipboard_body'));
        }

    });

    return ui;
});