/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) { //noinspection JSValidateTypes,JSValidateTypes
	var lib = require('lib'),
		common = require('common'),
		$ = require('$');

	var inherit = lib.get('./inherit'),
		Store = lib.get('./data.Store'),
		global_event = common.get('./global.global_event'),
		global_function = common.get('./global.global_function'),
		update_cookie = common.get('./update_cookie'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		user_log = common.get('./user_log'),
		Module = require('./Module'),
		Loader = require('./Loader'),
		View = require('./View'),
		Toolbar = require('./header.Toolbar'),
		Mgr = require('./Mgr'),
		first_page_num,//首屏加载文件条数
		LINE_HEIGHT = 47,//列表每行的高度
		STEP_NUM = 20,//每次拉取数据条数
		inited = false,
		window_resize_event = 'window_resize_real_time',
		scroller,
		console = lib.get('./console'),
		undefined;

	$.fn.extend({
		repaint : function(){
			var el = $(this);
			el.addClass("x-repaint");
			// 原Ext用的是setTimeout，使用中发现可能会导致有快速闪现，就直接读取计算使浏览器强制重绘
			el.height();
			//setTimeout(function(){
			el.removeClass("x-repaint");
			//}, 1);
		}
	});

	require('note_css');

	var store = new Store();
	var loader = new Loader({
		store: store
	});
	var toolbar = new Toolbar({
	});
	var view = new View({
		store: store,
		toolbar: toolbar,
		loader: loader
	});
	var mgr = new Mgr({
		toolbar: toolbar,
		view: view,
		loader: loader,
		store: store,
		step_num: STEP_NUM
	});

	//显示子模块
	toolbar.render('#_main_bar1');
	toolbar.show();
	view.render('#_main_box');
	view.show();

	var note = new Module('note', {
		init: function() {
			var me = this;
			if(!inited) {
				first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

				mgr.view.get_note_editor_frame();
				mgr.load_files();
				scroller = view.get_scroller();
				mgr.set_scroller(scroller);
				update_cookie.init();

				window.onresize = function() {
					var height = $(window).height(),
						width = $(window).width();
					me.on_win_resize(width, height);
				};

				//手动触发on_activate
				this.on_activate();
				this.listenTo(scroller, 'scroll', this.on_win_scroll);

				//提供给客户端调用的保存接口
				global_function.register('on_client_change_tab', function() {
					mgr.auto_save_note();
				});
				global_function.register('on_client_exit', function() {
					mgr.auto_save_note();
				});
				//提供给客户端调用的新建接口
				global_function.register('on_client_create_note', function() {
					mgr.on_create();
				});

				inited = true;

				//通知客户端页面已经初始化完成，可以调用接口了
				if(window.external && window.external.LoadNotePageComplete) {
					try {
						window.external.LoadNotePageComplete();
					} catch(e) {

					}
				}
				// 浏览器关闭、刷新前弹出确认框
				global_function.register('onbeforeunload', function () {
					mgr.auto_save_note();
				});
			}
		},

		on_activate: function(params) {
			var me = this;
			//me.init();

			global_event.trigger("note_timing_save");
			mgr.view.sync_editor_size();

			me.listenTo(global_event, window_resize_event, function() {
				mgr.view.sync_editor_size();
			});

			me.listenTo(global_event, "add_note", function() {
				mgr.view.trigger('action', 'create');
			});

			if(params && params.add_note == true) {
				window.location.hash = 'm=note';      //手动修改hash,防止hash值错误无法跳转到其他目录
				mgr.view.trigger('action', 'create');
			}

			me.listenTo(global_event, 'page_unload', function() {
				mgr.auto_save_note();//关闭窗口时自动保存一下笔记
			});
		},

		on_deactivate: function() {
			var me = this;
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
			if(!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
				mgr.load_files();
			}
		},

		/**
		 * 窗口大小改变时，判断是否需要加载更多数据
		 * @param width window.width
		 * @param height  window.height
		 */
		on_win_resize: function(width, height) {
			first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
			mgr.view.sync_editor_size();
		}
	});

	return note;
});