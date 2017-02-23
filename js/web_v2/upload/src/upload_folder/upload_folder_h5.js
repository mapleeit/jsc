/**
 * 上传文件夹 by trump
 */
define(function(require, exports, module) {

	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		text = lib.get('./text'),
		random = lib.get('./random'),
		console = lib.get('./console'),
		urls = common.get('./urls'),
		query_user = common.get('./query_user'),
		functional = common.get('./util.functional'),

		msg = require('./msg'),
		View = require('./view'),
		disk_mod = require('disk'),
		Class = require('./Upload_class'),
		upload_route = require('./upload_route'),
		bar_info = require('./tool.bar_info'),
		Static = require('./tool.upload_static'),
		Cache = require('./tool.upload_cache'),

		sub_task_run_states = {fake_done: 1, done: 1, error: 1},
		burst_num = common.get('./constants').IS_APPBOX ? 8 : 50,//添加上传频率

		file_list,
		FileNode,
		sub_class,

		query = urls.parse_params(),
		cur_uin = query_user.get_uin_num(),
		user = query_user.get_cached_user() || {},
		isvip = user.is_weiyun_vip && user.is_weiyun_vip(),

		get_sub_class = function() {
			if(!sub_class) {
				if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
					sub_class = require('./upload_html5_pro_class');
				} else {
					sub_class = require('./Upload_html5_class');
				}
			}
			return sub_class;
		};

	var Upload = Class.sub(function(upload_plugin, attrs) {
		this.file_count = attrs.file_count;
		this.upload_plugin = upload_plugin;
		this.local_id = random.random();
		this.del_local_id = random.random();
		this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
		this.pdir = attrs.pdir;   //上传到指定的目录ID
		this.path = attrs.local_path || attrs.path;
		this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
		this.file_name = attrs.dir_name;
		this.processed = 0;
		this.code = null;
		this.log_code = 0;
		this.can_pause = false; //不支持暂停，以后把扫描阶段实现了暂停后才能支持
		this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.
		this.state = null;
		this.sub_cache_key = attrs.sub_cache_key;
		this.init(attrs.dir_id_paths, attrs.dir_paths, '', 'folder');
		this.file_type = Static.FOLDER_TYPE;
		this.file_id = attrs.file_id;
		this.is_use_html5 = true;
		this.upload_type = upload_route.is_support_flash() ? 'upload_h5_flash' : 'upload_html5';
		if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
			this.upload_type = upload_route.is_support_html5_pro() ? 'upload_html5_pro' : (upload_route.is_support_flash() ? 'upload_h5_flash' : 'upload_html5');
		}
		if(!FileNode) {
			FileNode = disk_mod.get('./file.file_node');
			file_list = disk_mod.get('./file_list.file_list');
		}
		this.prepend_to_disk();
	});

	Upload.interface('states', $.extend({}, Class.getPrototype().states));

	var cover_method = {
		//将文件夹插入到网盘中
		prepend_to_disk: function() {

			if(!this.file_id || this.has_append_to_disk) {
				return;
			}

			this.push_done_file_id(this.file_id);
			try {
				file_list.prepend_node(
					new FileNode({
						is_dir: true,
						id: this.file_id,
						name: this.file_name
					}),
					true,
					this.pdir);

				this.has_append_to_disk = true;//标识已插入到网盘中
			} catch(xe) {
				console.error('folder prepend_to_disk error');
			}
		},
		//删除文件夹
		get_sub_cache: function() {
			return Cache.get(this.sub_cache_key);
		},
		//删除文件夹
		remove_file: function() {
			this.get_sub_cache()
				.each(function() {
					if(this.state !== 'done') {
						this.remove_file();
					}
				});
		},

		//停止上传
		stop_upload: function(stop_all) {
			if(stop_all === true) {
				this.force_stop = true;//bugfix:增加文件夹子任务状态切换判断条件(force_stop：来自全部取消上传)；
			}
			else {
				var sub_cache = this.get_sub_cache();
				if(sub_cache) {
					var running = sub_cache.get_curr_upload();
					running && running.can_pause_self() && running.stop_upload();
				}
			}
			return true;
		},
		//暂停后，重新续传
		resume_file_local: function() {
			this.when_change_state('continuee');

			this.view.upload_file_update_process();
			this.view.set_cur_doing_vid();

			var running = this.get_sub_cache().get_curr_upload();
			if(sub_task_run_states[running.state]) {
				running.get_queue().dequeue();
				//running.events.nex_task.call(this);
			}
		},
		//页面断开，重新续传 ，返回 local_id;
		resume_file_remote: function() {
			this.when_change_state('continuee');
			var sub_cache = this.get_sub_cache(),
				resume_task;
			sub_cache.each(function() {
				if(this.state === 'resume_pause') {//重新上传第一个被暂停的任务；
					resume_task = this;
					return false;
				}
			});
			this.view.upload_file_update_process();
			this.view.set_cur_doing_vid();
			bar_info.update(bar_info.OPS.UP_CHECK);
			if(resume_task) {
				Static.batch_pause_to_run([resume_task], 'resume_continuee');
			} else {
				sub_cache.do_next();
			}
		},
		//暂停后，重新上传
		get_resume_param: function() {
			var arys = [];
			if(!Static.can_resume(this.state)) {
				return;
			}
			this.get_sub_cache().each(function() {
				if('done' !== this.state) {//没有传完的文件可继续上传
					arys.push(this.get_resume_param());
				}
			});
			if(arys.length > 0) {
				var obj = this.get_dir_ids_paths() || {};
				return {
					'attrs': {
						path: this.path,
						dir_name: this.file_name,
						ppdir: this.ppdir,
						pdir: this.pdir,
						ppdir_name: this.ppdir_name,
						pdir_name: this.pdir_name,
						dir_paths: obj.paths,
						dir_id_paths: obj.ids,
						file_id: this.file_id
					},
					'files': arys
				};
			}
		},
		//能否重试
		can_re_start: function() {
			if(this.can_not_re_start) {
				return false;
			}
			var result = false;
			this.get_sub_cache().each(function() {
				if(this.can_re_start() === true) {
					result = true;
					return false;
				}
			});
			return result;
		},
		//重新开始
		re_start_action: function() {
			var me = this,
				key = me.sub_cache_key;
			if(me.re_try_text) {//重试动作
				/*select_folder.folder_error_retry(me.re_try_text).done(function () {
					delete me.re_try_text;
					delete me.folder_can_not_start;
					me.re_start_action();
				}).fail(function () {
					me.change_state('error', me.log_code);
				});*/
			} else {
				var re_start_lists = [];
				Cache.get(key).each(function() {
					if(this.state === 'error' && this.can_re_start()) {
						re_start_lists.push(this);
					}
				});
				this._is_finished = false;
				Static.batch_re_start(re_start_lists, this.sub_cache_key);
			}
		},

		get_translated_error: function() {
			var error = this.get_sub_cache().get_count_nums().error;
			if(0 === error && this.log_code) {//取文件夹错误信息
				return Static.get_error_msg(this.log_code);
			}
			return error > 0 ? text.format(
				'{0}个文件上传失败，<a href="javascript: void(0);" class="link" data-action="folder-errors">查看详情</a>',
				[error/*error_count*/]
			) : '';
		},

		get_translated_errors: function() {
			var errors = [];
			this.get_sub_cache().each(function() {
				if(this.state === 'error') {
					errors.push({
						//is_drag_upload: true,
						name: '\\\\' + this.file.relativePath.replace(/\//g, '\\'),
						size: this.file_size,
						error: this.dir_create_fail_msg || this.get_translated_error('simple'),
						error_tip: this.dir_create_fail_msg || this.get_translated_error('tip')
					});
				}
			});
			return errors;
		},
		//子任务准备好了
		on_sub_task_ready: function() {
			this.view.set_folder_size_ready();
		},
		/**
		 * 是否文件夹上传
		 */
		is_upload_folder: function() {
			return true;
		}
	};

	for(var key in cover_method) {
		Upload.interface(key, cover_method[key]);
	}

	//文件夹
	var folder_status = {
		start: function() {
			var me = this;
			if(me.folder_can_not_start || me.can_not_re_start) {
				return;
			}
			me.start_time = +new Date();//开始上传时间
			me.change_state('upload_file_update_process', {'Processed': me.processed});
			me.get_sub_cache().do_next();
		},
		done: function() {
			this.view.after_done();
		},
		error: function() {
			this.view.after_error();
		}
	};

	//子任务
	var sub_task_state = {
		start: function(folder) {
			folder.change_state('upload_file_update_process',
				{'Processed': this.get_passed_size()}
			);
		},

		done: function(folder) {
			sub_task_state._when_one_end.call(this, folder);//更新folder进度
		},
		error: function(folder) {
			/*if (folder.sub_cache_key === this.cache_key) {
				 console.log(Cache.get(this.cache_key).get_count_nums())
				 folder.view.upload_file_update_process();
			 }*/
			sub_task_state._when_one_end.call(this, folder);//更新folder进度
		},
		//更新文件夹 总体进度
		upload_file_update_process: function(folder) {
			if(folder.sub_cache_key === this.cache_key) {
				folder.processed = this.processed + this.get_passed_size();
				folder.view.upload_file_update_process();
			}
		},
		file_sign_update_process: function(folder) {
			if(!this.no_show_sign) {
				folder.folder_scan_percent = this.file_sign_update_process / this.file_size * 100;
				folder.view.file_sign_update_process();
			}
		},
		file_sign_done: function(folder) {
			if(!this.no_show_sign) {
				folder.view.file_sign_done();
			}
		},
		//预扫描
		don_next_file_sign: function() {
			var cache = this.get_belong_cache();
			var next_task = cache.get_next_task();
			if(next_task) {
				next_task.change_state('pre_file_sign');
			}
		},
		_when_one_end: function(folder, state) {
			if(folder._is_finished) {
				return;
			}

			var cache = this.get_belong_cache();

			if(cache.is_done()) {//已完成，查看是否含有上传错误的子任务,并响应更新folder结果信息
				folder._is_finished = true;
				if(folder.state === 'pause') {//文件夹暂停后，其中最后一个子任务，不能被暂停，并且报错，则直接减去一个pause状态
					folder.minus_info('pause');
				}
				if(cache.get_count_nums().error > 0) {
					var can_re_start = false;
					cache.each(function() {
						if(this.state === 'error' && this.can_re_start()) {//如果能重试上传，则将folder任务设置为可上传,错误码取第一条可重试任务的错误码
							can_re_start = true;
							return false;
						}
					});
					if(!can_re_start) {//子任务不能重试,将folder置为不可重试的任务
						folder.can_not_re_start = true;
					}
					folder.change_state('error', folder.log_code);
				} else {
					folder.change_state('done');
				}

			} else {//更新folder进度信息

				if(folder.state !== 'pause') {
					folder.change_state('upload_file_update_process', {'Processed': this.get_passed_size()});
				}
			}
		}
	};
	var manager = {
		aop_task: function() {
			if(this.is_init)
				return;
			this.is_init = true;
			//用于阻塞整个队列继续执行  sub task before nex_task
			get_sub_class().getPrototype().events.nex_task = functional.before(get_sub_class().getPrototype().events.nex_task, function() {
				var f_id = this.folder_id,
					folder;
				if(f_id) {
					//子任务通过条件
					//1:必须能找到自己的所属文件夹
					//2:所属文件夹没有被停止运行
					folder = Cache.get_folder_by_id(f_id);
					if(!folder || folder.force_stop) {
						return false;
					}
				}

				/*if(f_id && (folder = Cache.get_folder_by_id(f_id) )) {
					if(!folder.get_curr_cache()[f_id]) {
						return false;
					}
				}*/
			});
			//监控子类状态变化
			get_sub_class().interface('change_state',
				functional.after(get_sub_class().getPrototype().change_state, function(change_state) {
					var me = this,
						f_id = me.folder_id;
					/*if(me.pdir_create_ret && me.state == 'start') {
					    me.change_state('error', me.pdir_create_ret);
					}*/
					if(f_id) {
						var folder = Cache.get_folder_by_id(f_id);
						if(folder) {
							if(folder.state === 'pause') {
								if(me.can_pause_self()) {
									console.log('sub-task change_state add into resume_file_local');
									me.stop_upload();
									me.state = 'fake_done';//文件夹续传的时候，支持继续上传标志
									me.get_queue().head(me, function() {
										//this.resume_file_local();
									});
								} else {
									console.warn('can not pause this task : ', me.state, me.file_name);
								}
								return;
							}
                            // 把最后一个子任务的错误码记录为文件夹的错误码
							folder.log_code = me.code;

							sub_task_state[me.state] && sub_task_state[me.state].call(me, folder);
						}
						//文件上传时启动下个文件预扫描
						if(change_state === 'start_upload') {
							sub_task_state['don_next_file_sign'] && sub_task_state['don_next_file_sign'].call(me);
						} else if(change_state === 'start') {
							//启动文件上传后，预扫描不显示进度的标志位重置，让扫描进度显示出来
							me.no_show_sign = false;
						}
					}
				})
			);
			//监控父类状态变化
			Upload.interface('change_state',
				functional.after(Upload.getPrototype().change_state, function() {
					if(this.file_type === Static.FOLDER_TYPE) {
						if(folder_status[this.state]) {
							folder_status[this.state].call(this);
						}
					}
				})
			);

			//清理子任务   folder before clear
			Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function() {
				if(this.file_type === Static.FOLDER_TYPE) {
					Static.clear_upload_all(this.sub_cache_key);//清除子任务；
				}
			});
			//清理子任务   folder after clear
			Upload.getPrototype().dom_events.click_cancel = functional.after(Upload.getPrototype().dom_events.click_cancel, function() {
				if(this.file_type === Static.FOLDER_TYPE) {
					Cache.get_up_main_cache().is_contain_folder(true);//更新是否含有文件夹
				}
			});
		},
		cache: {},
		folder_ids_queue: [],
		/**
		 * @param [upload_plugin]
		 * @param folder_id  上传文件夹任务ID
		 * @param files  文件夹下新添加的子文件
		 * @param [cache_key] 缓存key
		 * @param [length] 文件夹下的文件总长度
		 */
		add_sub_task: function(upload_plugin, folder_id, files, cache_key, length) {
			var me = this;
			if(!me.cache[folder_id]) {
				//第一次添加子任务文件
				me.cache[folder_id] = {
					plugin: upload_plugin,
					files: [],
					consuming: false, //正在消费中
					cache_key: cache_key,
					batch_length: 200,
					length: length
				};
				me.folder_ids_queue.push(folder_id);
			}

			me.cache[folder_id].files = me.cache[folder_id].files.concat(files);

			if(!me.cache[folder_id].consuming) {
				me._consume_sub_task(folder_id);
			}
		},
		/**
		 *
		 * @param folder_id
		 * @returns {*|boolean} 是否有待继续消费
		 */
		_consume_sub_task: function(folder_id) {
			var me = this,
				f_cache = me.cache[folder_id];
			if(f_cache && f_cache.length > 0) {
				var files = f_cache.files.splice(0, f_cache.batch_length);
				f_cache.length -= files.length;

				if(files.length) {
					manager._instance_sub_task(files, f_cache.plugin, f_cache.cache_key, folder_id);
				}
			} else {
				delete me.cache[folder_id];
			}
		},
		/**
		 * 一批任务实例化完成后，检查父目录是否需要继续加载
		 * @param folder_id
		 * @returns {*|boolean}
		 * @private
		 */
		_check_sub_task: function(folder_id) {
			var me = this;
			if(me.cache[folder_id] && me.cache[folder_id].length > 0) {
				me.cache[folder_id].consuming = false;
			}

			me._consume_sub_task(folder_id);
			return !me.cache[folder_id] || me.cache[folder_id].length === 0;
		},
		/**
		 * 添加子任务 默认状态为wait，支持刷新续传
		 * @param files 子任务构造参数对象数组
		 * @param upload_plugin
		 * @param cache_key
		 * @param folder_id 所属文件夹的local_id 文件夹的local_id为不变值
		 * @returns {number}
		 */
		_instance_sub_task: function(files, upload_plugin, cache_key, folder_id) {
			manager.cache[folder_id].consuming = true;
			var len = files.length;//总长度
			var me = this;
			functional.burst(files, function(unit) {
				var task = get_sub_class().getInstance(
					upload_plugin,
					random.random(),
						unit.file || unit.path,//file.file来自上传文件夹，file.path来自续传
					{
						'ppdir': unit.ppdir,
						'pdir': unit.pdir,
						'ppdir_name': unit.ppdir_name,
						'pdir_name': unit.pdir_name,
						'dir_paths': unit.dir_paths,
						'dir_id_paths': unit.dir_id_paths,
						'cache_key': cache_key,
						'view_key': 'empty',
						'pdir_create_ret': unit.pdir_create_ret
					},
					folder_id
				);
				task.err_msg = unit.pdir_create_ret ? '(' + unit.pdir_create_ret + ')父目录创建失败' : '';
				if(unit.server) {//来自续传
					task.change_state('resume_pause', unit);//状态转为续传
					task.get_passed_size(task.get_passed_size() + task.processed);//设置已传输大小
				} else {
					task.change_state('wait');//状态转为wait，放入队列等待.
				}
				if((len -= 1) === 0 && manager._check_sub_task(folder_id)) {//当子任务全部添加后，将文件夹置入执行状态
					var folder = Cache.get_task(folder_id);
					folder.on_sub_task_ready();

					if(folder.state === 'wait' && folder.local_id === me.folder_ids_queue[0]) {
						me.folder_ids_queue.shift();
						folder.events.nex_task.call(folder);//执行下一个任务
					} else {
						for(var i = 0, l = me.folder_ids_queue.length; i < l; i++) {
							if(folder.local_id === me.folder_ids_queue[i]) {
								me.folder_ids_queue.splice(i, 1);
								return;
							}
						}
					}
				}

			}, burst_num, 63).start();
		},

		/**
		 * 添加文件夹上传任务
		 * @param upload_plugin
		 * @param files 子任务构造参数对象数组
		 * @param attrs 文件夹构造参数对象
		 * @param folder_size 文件夹总大小
		 * @returns {*}
		 */
		add_upload: function(upload_plugin, files, attrs, folder_size) {//添加上传对象
			manager.aop_task();
			var folder = Upload.getInstance(upload_plugin, attrs); //生成上传对象
			folder.get_total_size(folder.get_total_size() + (folder.file_size = folder_size));
			return folder;
		}
	};

	var action = {
		/**
		 * @param upload_plugin
		 * @param files
		 * @param attrs{dir_name, ppdir, pdir, ppdir_name, pdir_name, dir_paths, dir_id_paths}
		 * @param response
		 * @param folder_size 总文件大小
		 * @param file_length 总文件数
		 */
		add_upload: function(upload_plugin, files, attrs, response, folder_size, file_length) {//添加上传对象
			View.showManageNum();
			attrs = $.extend(attrs, {'sub_cache_key': 'cache_key_' + random.random(), 'file_count': file_length});
			var folder = manager.add_upload(upload_plugin, files, attrs, folder_size);
			Cache.get_up_main_cache().is_contain_folder(true);

			switch(response.code) {
				case(1)://正常任务
				{
					folder.change_state('wait');//状态转为wait，放入队列等待.
					break;
				}
				case(2)://空目录
				{
					folder.change_state('start');
					folder.change_state('done');
					break;
				}
				case(3)://创建目录失败，不可重试的
				{
					folder.can_not_re_start = true;
					folder.error_type = 'client';
					folder.change_state('error', 103);
					return;
				}
				case(4)://低概率的创建目录失败，可重试创建目录
				{
					folder.folder_can_not_start = true;
					folder.re_try_text = response.text;
					folder.change_state('error');
					break;
				}
				case(100)://来自续传
				{
					folder.change_state('resume_pause', 0);//状态转为续传
					break;
				}
			}

			manager.add_sub_task(upload_plugin, folder.local_id, files, attrs.sub_cache_key, file_length);

			//返回用于子任务添加
			return folder.local_id;
		},
		/**
		 * 添加剩下的子任务
		 * @param upload_plugin
		 * @param folder_id
		 * @param files
		 * @param response
		 */
		add_sub_task: function(upload_plugin, folder_id, files, response) {
			//console.log('add_sub_task:',folder_id, files);
			if(response === 'create_dir_error') {
				var folder = Cache.get_folder_by_id(folder_id);
				folder.can_not_re_start = true;
				folder.error_type = 'client';
				folder.get_queue().remove(folder.local_id);
				folder.change_state('error', 103);
				return;
			}
			else {
				manager.add_sub_task(upload_plugin, folder_id, files);
			}

		}
	};

	return action;
});