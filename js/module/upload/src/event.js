define(function(require, exports, module) {
	var $ = require('$'),
		upload_route = require('./upload_route'),
		upload_cache = require('./tool.upload_cache'),
		console = require('lib').get('./console'),
		common = require('common'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		functional = common.get('./util.functional'),
		mini_tip = common.get('./ui.mini_tip'),
		view,
		Static = require('./tool.upload_static'),
		stop_prop_default = function(e) {//阻止默认行为和冒泡
			e.preventDefault();
			e.stopImmediatePropagation();
		};

	var dom_event = {
		init: function() {//上传管理器 事件初始化
			view = this;
			view.switch_upbox_btn.on('click', function(e) {//切换上传“mini窗口”和“主窗口”
				stop_prop_default(e);
				Static.dom_events[ view.switch_upbox_btn.attr('data-action') ](true);
			});

			view.clear_all_btn.on('click', function(e) {//全部清除
				stop_prop_default(e);
				Static.dom_events.click_clear_all(true);
			});

			view.upload_files.on('click', '[data-upload=click_event]', function(e) {//删除、暂停、继续上传
				stop_prop_default(e);
				var $ele = $(e.target),
					upload_obj = view.get_task($ele.closest('li').attr('v_id')),
					action = $ele.attr('data-action');
				view.before_hander_click(action);
				upload_obj.dom_events[ action ].call(upload_obj);
				view.after_hander_click(action);

			}).on('click', '.data-dir a', function(e) {//打开指定目录
				stop_prop_default(e);
				view.get_task($(e.target).closest('li').attr('v_id'))
					.open_to_target();
				view.min();//最小化上传管理器
			}).on('mouseover', '[data-action=folder-errors]', function(e) {
				var $target = $(e.target),
					errors = view.get_task($target.closest('[v_id]').attr('v_id'))
						.get_translated_errors();
				// 当用时已经超过1秒时，不再使用性能低下的精确缩略不
				var start_time = new Date(), limit = 1000, reach_limit = false;
				$.each(errors, function(index, error) {
					var fullname = error.fullname = error.name;
					if(!reach_limit) {
						error.name = view.compact_file_path(fullname);
						reach_limit = new Date() - start_time > limit;
					} else {
						error.name = view.revise_file_name(fullname);
					}
				});
				view.show_errors($target, errors);
			});
			/**
			 * 点击页面内容其他部分，最小化上传管理器
			 */
			view.$dom.hover(function() {
				dom_event._is_over_$dom = true;
				$('body').off('mouseup.out_upload');
			}, function() {
				dom_event._is_over_$dom = false;
				$('body').on('mouseup.out_upload', function() {
					view.min();
				});
			});
			/**
			 * 监听面板容器的滚动事件
			 */
			/*
			 view.upload_box.on('scroll',functional.throttle(function(){
			 console.debug('scroll has trigger');
			 view.on_box_change_scroll();
			 },100));
			 */
			view.upload_box.on('scroll', function() {
				view.on_box_change_scroll();
			});
			/**
			 * 最大化
			 */
			view.min_box.click(function() {
				view.max();
			});
			/**
			 * 失败列表 添加到管理器底部，重新上传
			 */
			view.upload_process.on('click', 'a', function(e) {
				stop_prop_default(e);
				Static[$(e.target).attr('action')]();
			});
			//极速上传相关事件
			/**
			 * 开通会员，跳转会员中心
			 */
			view.speedup_vip.on('click', function(e) {
				stop_prop_default(e);
				var cur_user = query_user.get_cached_user() || {},
					is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
					from = is_weixin_user? 1024 : 1013;
				window.pvClickSend && window.pvClickSend('weiyun.speedup.vip.click');
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
			});
			/**
			 * 体验极速上传
			 */
			view.speedup_try.on('click', function(e) {
				var upload_object = upload_route.upload_plugin;
				var upload_task = upload_cache.get_curr_real_upload();
				var isSpeedupFail = false;
				if(upload_object && upload_object.experience && upload_task) {
					upload_object.experience(upload_task).done(function(msg, can_experience) {
						//隐藏加速入口
						view.hideExperience(can_experience);
					}).fail(function(msg) {
						mini_tip.error(msg);
						view.hideExperience(false);
						view.remainClear();
						isSpeedupFail = true;
					});
					//启动倒计时，上面的体验请求如果结果是fail，有可能会（只在二次加速的情况下秒回fail，具体看upload_object.experience里面的代码）先于这里执行
					//所以要判断一下如果fail就不显示加速倒计时icon
					if(!isSpeedupFail) {
						view.remainSpeedup().done(function() {
							upload_object.stopExperience().done(function(isvip) {
								if(isvip) {
									view.hideExperience();
									view.showSpeedup();
								}
							}).fail(function() {
							});
						});
					}
					window.pvClickSend && window.pvClickSend('weiyun.speedup.try.click');
				} else {
					view.remainClear();
					mini_tip.warn('需要先上传文件，才能体验极速上传哦');
					window.pvClickSend && window.pvClickSend('weiyun.speedup.try.reject');
				}
			});
		},
		/**
		 * 判断鼠标是否在任务管理器之上
		 * @returns {boolean}
		 */
		is_on_the_panel: function() {
			return this._is_over_$dom;
		}
	};
	return dom_event;
});