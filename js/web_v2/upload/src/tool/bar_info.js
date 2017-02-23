define(function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		inherit = lib.get('./inherit'),
		console = lib.get('./console'),
		logger = common.get('./util.logger'),
		constants = common.get('./constants'),
		File = common.get('./file.file_object'),
		scr_reader_mode = common.get('./scr_reader_mode'),

		upload_route = require('./upload_route'),
		speed_task = require('./speed.speed_task'),
		Cache = require('./tool.upload_cache'),
		Static = require('./tool.upload_static'),
		temporary_upload = require('./tool.temporary_upload'),

		view,//视图模块
		hide_whole_info = false,//是否隐藏 耗时/速度/剩余时间
		text_resume = '{num}个上传任务已暂停，<a action="click_resume" style="cursor:pointer;">继续上传</a>',

		get_view = function() {//获取视图对象
			return view || (view = require('./view'));
		};

	//上传的信息条
	var upload_bar = function(e) {
		this.$empty_box = e.$empty_box;
		this.$process_box = e.$process_box;
		this.$process_files = e.$process_files;
		this.$process_count = e.$process_count;
		this.$complete_box = e.$complete_box;
		this.$complete_files = e.$complete_files;
		this.$complete_count = e.$complete_count;
		this.$manage_icon = e.$manage_icon;
		this.$manage_num = e.$manage_num;
	};

	$.extend(upload_bar.prototype, {
		/**
		 * 空内容展示
		 * @returns {jQuery Element}
		 */
		get_$empty_box: function() {
			return this.$empty_box;
		},
		/**
		 * 结果、进度信息展示
		 * @returns {jQuery Element}
		 */
		get_$process_files: function() {
			return this.$process_files;
		},
		/**
		 * $process 包装的元素
		 * @returns {jQuery Element}
		 */
		get_$process_box: function() {
			return this.$process_box;
		},
		/**
		 * $process 任务数
		 * @returns {jQuery Element}
		 */
		get_$process_count: function() {
			return this.$process_count;
		},
		/**
		 * 结果、进度信息展示的地方
		 * @returns {jQuery Element}
		 */
		get_$complete_files: function() {
			return this.$complete_files;
		},
		/**
		 * $complete 包装的元素
		 * @returns {jQuery Element}
		 */
		get_$complete_box: function() {
			return this.$complete_box;
		},
		/**
		 * $complete 任务数
		 * @returns {jQuery Element}
		 */
		get_$complete_count: function() {
			return this.$complete_count;
		},
		/**
		 * 上传中图标
		 * @returns {jQuery Element}
		 */
		get_$manage_icon: function() {
			return this.$manage_icon;
		},
		/**
		 * 上传中数量
		 * @returns {jQuery Element}
		 */
		get_$manage_num: function() {
			return this.$manage_num;
		},
		/**
		 * 最大剩余时间
		 * @returns {number}
		 */
		get_max_time: function() {
			return this._max_secs || ( this._max_secs = 24 * 60 * 60);//24小时
		},
		/**
		 * 格式化时间格式
		 * @param secs
		 * @returns {string}
		 * @private
		 */
		format_time: function(secs) {
			var h = '', m = '' , s = '';
			if(secs < 60) {
				s = secs > 0 ? (secs + "秒") : '';
			} else if(secs > 3600) {
				h = Math.floor(secs / 3600),
					m = Math.floor((secs - h * 3600) / 60);
				h = h > 0 ? ( h + "小时" ) : '';
				m = m > 0 ? ( (m < 10 ? ('0' + m) : m) + "分" ) : '';
			} else {
				m = Math.floor(secs / 60);
				s = secs % 60;
				m = m > 0 ? (m + "分") : '';
				s = s > 0 ? ( (s < 10 ? ('0' + s) : s) + "秒") : '';
			}
			return h + m + s;
		},
		/**
		 * 获取测速对应的cache
		 * @returns {*}
		 */
		get_cache: function() {
			return Cache.get_up_main_cache();
		},
		get_offline_cache: function() {
			return Cache.get_od_main_cache();
		},
		get_down_cache: function() {
			return Cache.get_dw_main_cache();
		},
		/**
		 * 总大小
		 * @returns {number}
		 */
		get_total: function() {
			return this.get_cache().get_total_size() + this.get_down_cache().get_total_size() + this.get_offline_cache().get_total_size();
		},
		/**
		 * 已传输大小
		 * @returns {number}
		 */
		get_passed: function() {
			var cache = this.get_cache(),
				passed = cache.get_passed_size(),
				running = cache.get_curr_upload();
			if(running && running.processed) {
				passed += running.processed;
			}
			return passed;
		},

		get_offline_passed: function() {
			var cache = this.get_offline_cache(),
				passed = cache.get_passed_size(),
				running = cache.get_curr_upload();
			if(running && running.processed) {
				passed += running.processed;
			}
			return passed;
		},

		get_down_passed: function() {
			try {
				var cache = this.get_down_cache(),
					passed = cache.get_passed_size(),
					tasks = cache.get_down_cache();
				if(tasks.length > 0) {
					for(var key in tasks.length) {
						if(key !== 'length' && -1 === ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
							passed += tasks[key].processed;
						}
					}
				}
			} catch(e) {
				return 0
			}
			return passed;
		},
		/**
		 * 是否已经完成
		 * @returns {boolean}
		 */
		is_done: function() {
			return this.get_cache().is_done() && this.get_down_cache().is_done() && this.get_offline_cache().is_done();
		},
		/**
		 * 设置进度信息
		 */
		set_process: function() {
			var up_cache = this.get_cache(),
				offline_cache = this.get_offline_cache(),
				down_cache = this.get_down_cache(),
				up_info = up_cache.get_count_nums(),
				offline_info = offline_cache.get_count_nums(),
				down_info = down_cache.get_count_nums(),
				complete_count = up_info.done + down_info.done + offline_info.done,
				process_count = up_info.length + down_info.length + offline_info.length - complete_count;
			//上传任务完成就把提速标识隐藏掉，因为离线下载不需要这个标识
			var view = get_view();
			if(up_cache.is_done()) {
				view.hideSpeedup();//隐藏上传提速icon tips
				view.hideExperience();//隐藏体验入口，只在上传时显示
			}
			if(up_cache.is_done() && offline_cache.is_done() && down_cache.is_done()) {
				speed_task.stop();//停止计速
				bar_info.when_tasks_end(this.task_name);
			}
			this.toggle('both', process_count, complete_count);
		},
		/**
		 * 设置任务完成(没有正在和server交互的任务执行)
		 */
		set_done: function() {
			var up_cache = this.get_cache(),
				offline_cache = this.get_offline_cache(),
				down_cache = this.get_down_cache(),
				down_info = down_cache.get_count_nums(),
				up_info = up_cache.get_count_nums(),
				offline_info = offline_cache.get_count_nums(),
				complete_count = up_info.done + down_info.done + offline_info.done,
				process_count = up_info.length + down_info.length + offline_info.length - complete_count,
				error_text;

			this.toggle('both', process_count, complete_count);

			//上报log
			var tail = up_cache.is_contain_folder() ? '个文件' : '个文件',
				html = (up_info.done + down_info.done) > 0 ? ((up_info.done + down_info.done) + tail + this.task_name + '成功') : '';
			if(up_info.error + down_info.error + offline_info.error > 0) {
				error_text = (html ? '   ' : '') + this.task_name + '失败：' + (up_info.error + down_info.error + offline_info.error) + tail + ' '; //失败信息
				if(html == '') {
					error_text = (up_info.error + down_info.error + offline_info.error) + tail + '传输失败'
				} else {
					error_text = "，" + (up_info.error + down_info.error + offline_info.error) + '个失败'
				}
			}
			var logData = {
				report_console_log: true
			};
			if(error_text) {
				logData.error_text = error_text;
			}
			logger.report(logData);
		},
		/**
		 * 条目的显示与隐藏/填充进度信息/样式操作
		 * @param {String} [group] 要设置的是哪一个分组：进行中/已完成
		 * @param {Number} [process] 正在上传的任务数
		 * @param {Number} [complete] 已完成的任务数
		 */
		toggle: function(group, process, complete) {
			process = process || 0;
			complete = complete || 0;
			switch (group) {
				case 'process':
					this.process_state = process ? 'show' : 'hide';
					this.get_$process_count().text(process || 0);
					this.get_$process_box().css('display', process ? 'block' : 'none');
					break;
				case 'complete':
					this.complete_state = complete ? 'show' : 'hide';
					this.get_$complete_count().text(complete || 0);
					this.get_$complete_box().css('display', complete ? 'block' : 'none');
					break;
				default:
					this.process_state = process ? 'show' : 'hide';
					this.get_$process_count().text(process || 0);
					this.get_$process_box().css('display', process ? 'block' : 'none');
					this.complete_state = complete ? 'show' : 'hide';
					this.get_$complete_count().text(complete || 0);
					this.get_$complete_box().css('display', complete ? 'block' : 'none');
					break;
			}
			if(!process) {
				this.get_$manage_num().text('').hide();
				this.get_$manage_icon().removeClass('icon-sync').addClass('icon-act');
			} else {
				this.get_$manage_icon().removeClass('icon-act').addClass('icon-sync');
				this.get_$manage_num().text(process).show();
			}

			if(!process && !complete) {
				this.get_$empty_box().show();
			} else {
				this.get_$empty_box().hide();
			}
		},
		/**
		 * 当前显示状态是否隐藏
		 */
		is_hide: function(group) {
			return this[group + '_state'] === 'hide';
		},

		/**
		 *判断正在运行的任务全部都是打包下载
		 */
		is_all_package: function() {
			var me = this;
			if(me.is_done()) {
				return false;
			}
			var tasks = this.get_down_cache().get_cache();
			for(var key in tasks) {
				if(key !== 'length' && ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
					if(!tasks[key].is_package()) {
						return false;
					}
				}
			}
			return true;
		},

		/**
		 * 清除上一次的html和icon
		 */
		destroy: function() {
			this.get_$process_box().hide();
			this.get_$process_files().empty();
		}
	});

	function getAvg(array) {
		var sumSpeed = 0, sumExSpeed = 0, sumCount = 0,
			lastSpeed = 0, lastExSpeed = 0, lastCount = 0,
			avgSpeed, avgExSpeed, random = 0;
		for(var i=0, len=array.length; i<len; i++) {
			sumSpeed += array[i].speed;
			sumExSpeed += array[i].exSpeed;
			sumCount++;
			if(i < 3) {
				lastSpeed += array[i].speed;
				lastExSpeed += array[i].exSpeed;
				lastCount++;
			}
		}
		avgSpeed = Math.max(parseInt(sumSpeed / sumCount), parseInt(lastSpeed / lastCount));
		avgExSpeed = Math.max(parseInt(sumExSpeed / sumCount), parseInt(lastExSpeed / lastCount));
		//给个随机数做波动
		//random = Math.min(avgSpeed * 0.1, Math.random() * 10000);
		return {
			avgSpeed: avgSpeed - random,
			avgExSpeed: avgExSpeed===0 ? 0 : (avgExSpeed + random)
		}
	}

	var bar_info = {
		$v_id: 0,
		$speed: null,
		$speed_up: null,
		$speed_text: null,
		$left_time: null,
		$speeds: [],
		/**
		 * 初始化
		 */
		init: function(upload_param, com) {
			this.upload = new upload_bar(upload_param);
		},
		destroy: function() {
			this.upload && this.upload.destroy();
			this.can_re_start_error = {length: 0};
		},
		get_$speed_up: function() {
			return this.$speed_up || (this.$speed_up = this.$speed.find('.j-upload-speed-up'));
		},
		get_$speed_text: function() {
			return this.$speed_text || (this.$speed_text = this.$speed.find('.j-upload-speed-text'));
		},
		/**
		 * 设置任务速度
		 * @param speed
		 */
		set_speed: function(speed, cnSpeed, exSpeed) {
			var html, avg;
			if(speed > 0) {//运行任务已具备获取速度的必备条件
				this.$speeds.unshift({ speed: speed, cnSpeed: cnSpeed, exSpeed: exSpeed });
				this.$speeds.length > 10 && (this.$speeds.length = 10);
				if(cnSpeed && exSpeed) {
					html = File.get_readability_size(cnSpeed + exSpeed) + '/s<span class="speedup-num">(+' + File.get_readability_size(exSpeed) + '/s)</span>';
				} else {
					html = File.get_readability_size(speed) + '/s';
				}
				this.get_$speed_text().html(html);
				if(exSpeed) {
					this.get_$speed_up().show();
					this.$speed.addClass('item-info-vip').show();
				} else {
					this.get_$speed_up().hide();
					this.$speed.removeClass('item-info-vip').show();
				}
			} else if(this.$speeds.length) {
				avg = getAvg(this.$speeds);
				if(avg.avgExSpeed) {
				html = File.get_readability_size(avg.avgSpeed) + '/s<span class="speedup-num">(+' + File.get_readability_size(avg.avgExSpeed) + '/s)</span>';
				} else {
					html = File.get_readability_size(avg.avgSpeed) + '/s';
				}
				this.get_$speed_text().html(html);
			} else {
				this.$speed.hide();
			}
		},
		/**
		 * 设置任务剩余时间
		 * @param speed
		 */
		set_left_time: function(speed) {
			if(speed === -1 || speed === 0) {
				this.$left_time.hide();
				return;
			}
			var secs = ( (this.$task.file_size - this.$task.processed) / speed ) | 0;
			if(secs <= 0 || this.upload.get_max_time() < secs) {
				secs = this.upload.get_max_time();
			}
			this.$left_time.html('剩余' + this.upload.format_time(secs)).show();
		},
		/**
		 * 满足有另外一个类任务运行时，开始测速
		 * @param task_name
		 */
		when_tasks_end: function(task_name) {
			var who = this.upload;
			if(!who.is_done() && who.get_cache().get_all_length() > 0) {
				speed_task.start();//重新开始测速
			}
		},
		/**
		 * 根据 上传、下载任务种类个数  控制上传、下载条目的显示
		 */
		toggle_speed_msg: function() {
			var up_num = Cache.get_up_main_cache().has_task_running(),//有上传任务处于运行状态
				dw_num = Cache.get_dw_main_cache().has_task_running(),//有下载任务处于运行状态
				od_num = Cache.get_od_main_cache().has_task_running();//有离线任务处于运行状态

			(up_num + dw_num + od_num) === 0 && !this.upload.is_hide('process') && this.upload.toggle('process');//隐藏

			//上传提速的icon tips
			var view = get_view();
			if(up_num > 0) {
				view.showSpeedup();
			} else {
				view.showExperience();//上传时显示体验入口
			}
		},
		OPS: {
			DOWN_SPEED: 1,//更新下载速度
			UP_SPEED: 2,//更新上载速度
			DOWN_CHECK: 3,//检查下载进度
			UP_CHECK: 4//检查上载进度
		},
		process_states: {//可进行 更新进度信息的状态
			'init': 1,
			'start_upload': 1,
			'to_continuee': 1,
			'continuee': 1,
			'to_resume_continuee': 1,
			'start': 1,
			'error': 1,
			're_start': 1,
			'clear': 1,
			'done': 1,
			'pause': 1,
			'resume_pause': 1,
			'resume_continuee': 1
		},
		can_re_start_error: {length: 0}, //用于任务完成后，判断是否显示 "全部重试"
		check_error: function(task) {
			var list = this.can_re_start_error,
				id = task.del_local_id,
				state = task.state;
			if(state === 'error') {
				if(!list[id]) {
					if(task.can_re_start()) {
						list[id] = id;
						list.length += 1;
					}
				}
			} else if(-1 !== ' re_start clear '.indexOf(' ' + state + ' ')) {
				if(list[id]) {
					delete list[id];
					list.length -= 1;
					if(list.length === 0) {
						var a_tag = this.upload.$process.find('a');
						if(a_tag.length > 0) {
							a_tag.hide();
						}
					}
				}
			}
		},
		/**
		 * 所有任务是否已经完成（没有正在上传、下载任务在执行）
		 * @returns {*}
		 */
		is_done: function() {
			return this._is_done;
		},
		/**
		 * 全部完成
		 */
		finished: function() {
			var me = this,
				taskView = get_view();

			taskView.hideSpeedup();//隐藏上传提速icon tips
			taskView.hideExperience();//隐藏体验入口，只在上传时显示
			speed_task.stop();//停止计速
			me.upload.set_done();//更新传输条目显示的完成信息
			me._is_done = true;//标识完成
			// for 读屏软件，使用alert - james
			me.tip_for_scr_reader();
		},
		/**
		 * 任务管理器中的任务已完成(上传、下载，其中的暂停/出错不计算在内)
		 */
		is_finished: function() {
			return this.upload.is_done();
		},
		set_dom: function(task) {
			var taskView = task.view;
			var dom = this.upload.$process_files.find('#upload_row_' + taskView.v_id);
			!dom.size() && (dom = taskView.get_$wrap());
			this.$task = task;
			this.$speed = dom.find('.j-upload-speed');
			this.$speed_up = this.$speed.find('.j-upload-speed-up');
			this.$speed_text = this.$speed.find('.j-upload-speed-text');
			this.$left_time = dom.find('.j-upload-remain-time');
		},
		/**
		 * 更新bar的相关信息
		 * @param type
		 * @param speed
		 */
		update: function(type, speed, cnSpeed, exSpeed) {
			var me = this,
				ops = me.OPS;
			me._is_done = false;//任务完成标志
			switch(type) {
				case(ops.UP_SPEED)://更新上传速度
					if(!hide_whole_info) {
						me.set_speed(speed, cnSpeed, exSpeed);
						me.set_left_time(speed);
					}
					break;
				case(ops.DOWN_SPEED)://更新下载速度
					if(!hide_whole_info) {
						me.set_speed(speed);
						me.set_left_time(speed);
					}
					break;
				case(ops.DOWN_CHECK)://下载状态变换更新
					me.upload.set_process();
					if(me.is_finished()) {
						me.finished();
					} else {
						me.toggle_speed_msg();
					}
					break;
				case(ops.UP_CHECK)://上传状态变换更新
					me.upload.set_process();
					if(me.upload.is_done()) {
						get_view().refresh_space_info();//上传任务完成时，刷新容量
					}
					if(me.is_finished()) {
						me.finished();
					}
					break;
			}
		},

		/**
		 * for 读屏软件，使用alert - james
		 */
		tip_for_scr_reader: function() {
			if(scr_reader_mode.is_enable()) {
				var has_ok, has_err,
					ok_list = [],
					err_list = [];
				// console.log('this.upload.get_cache()', this.upload.get_cache());
				this.upload.get_cache().each(function() {
					if(!this.__aria_alerted) {
						if(this.state === 'error') {
							err_list.push((err_list.length + 1) + '、' + this.file_name + '，原因：' + Static.get_error_msg(this.code));
							this.__aria_alerted = 1;
						} else if(this.state === 'done') {
							ok_list.push((err_list.length + 1) + '、' + this.file_name);
							this.__aria_alerted = 1;
						}
					}
				});
				var tip;
				if(has_ok = !!ok_list.length) {
					tip = ok_list.length + '个文件上传成功；';
				}
				if(has_err = !!err_list.length) {
					tip = err_list.length + '个文件上传失败。';
				}
				if(tip) {
					tip = [
						'上传进度结束。',
						tip,
						has_ok ? '成功的文件如下：\n' + ok_list.join('\n') : '',
						has_err ? '失败的文件如下：\n' + err_list.join('\n') : ''
					].join('\n');
					alert(tip);
				}
			}
		}
	};
	return bar_info;
});