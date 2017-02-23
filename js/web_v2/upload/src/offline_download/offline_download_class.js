/**
 * 离线下载模块
 * @author iscowei
 * @date 2016-09-29
 */
define(function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		console = lib.get('./console').namespace('offline_download'),
		logger = common.get('./util.logger'),
		offline_download_event = common.get('./global.global_event').namespace('offline_download'),

		Class = require('./Upload_class'),
		Static = require('./tool.upload_static'),
		Cache = require('./tool.upload_cache'),
		view = require('./view'),
		offline_download_object = require('./offline_download.offline_download'),
		undefined;

	var offline_download = Class.sub(function (task) {
		this.task = task;
		this.file_name = task.task_name;  //文件名
		this.file_size = task.task_size;
		this.dir_path = task.dir_path || '';
		this.pdir = task.pdir_key || '';
		this.file_id  = task.file_id || '';
		this.file_dir = task.dir_path;
		this.processed = task.current_size;
		this.local_id = this.del_local_id = task.task_id; //文件上传的local_id
		this.state = null;  //下载状态
		this.upload_type = 'offline_download';
		this.file_type = Static.OFFLINE_TYPE;
		this.op_type = Static.OP_TYPES.OFFLINE;//任务类型
		this.init('', '', Cache.default_offline_cache_key, 'offline_download', Static.OP_TYPES.OFFLINE);
	});

	var update_task = function(task_list) {
		var offlineInstance,
			len = task_list.length,
			task,
			task_list_done = [],
			task_list_undone = [];
		// bug fix @maplemiao
		// 如果第一次进来，拉取的task_list的完成状态为：1/1/4/1/1（完成、完成、未完成、完成、完成）
		// 那么前两个会立即完成，但是第三个会阻塞到后面两个完成的任务，此时任务列表中仍然会显示三个，而非一个
		// 首先对task_list进行一次排序，把"已完成"的放在最上面
		for (var item in task_list) {
			if (task_list[item].task_status === 1) {
				task_list_done.push(task_list[item]);
			} else {
				task_list_undone.push(task_list[item]);
			}
		}
		task_list = task_list_done.concat(task_list_undone);

		for(var i in task_list) {
			if(task = Cache.get_task(task_list[i].task_id)) {
				//任务已经存在，就更新进度或状态
				//有错误码时，任务失败
				if(task_list[i].retcode !== 0) {
					task.state !== 'error' && task.change_state('error', task_list[i].retcode);
				} else {
					if(task_list[i].task_status === 1) {    //任务完成
						task.task = task_list[i];
						if(!task.file_id || !task.pdir || !task.dir_path) {
							task.file_id = task_list[i].file_id;
							task.pdir = task_list[i].pdir_key;
							task.dir_path = task_list[i].dir_path;
						}
						if(task.state !== 'done') {
							task.change_state('done');
						}
					} else if(task_list[i].task_status === 2) {     //任务失败
						task.state !== 'error' && task.change_state('error', task_list[i].retcode);
					} else {      //下载中
						task.processed = task_list[i].current_size;
						task.change_state('upload_file_update_process', task.processed);
					}
				}
			} else {
				offlineInstance = offline_download.getInstance(task_list[i]);
				offlineInstance.change_state('wait');    //状态转为wait，放入队列等待
				if((len -= 1) === 0) {
					offlineInstance.events.nex_task.call(offlineInstance);
				}
			}
		}
	};

	offline_download.interface('states', $.extend({}, Class.getPrototype().states));
	offline_download.interface('events', $.extend({}, Class.getPrototype().events));
	offline_download_event.off('update_task').on('update_task', update_task);

	offline_download.interface('states.wait', function() {
		this.get_queue().tail(this, function() {
			if(this.state !== 'done') {
				this.change_state('start');
			}
		});
	});

	offline_download.interface('states.start', function() {
		this.is_stop_upload = false;

		//有错误码时，任务失败
		if(this.task.retcode !== 0) {
			this.state !== 'error' && this.change_state('error', this.task.retcode);
		} else {
			if(this.task.task_status === 1) {    //任务完成
				if(this.state !== 'done') {
					this.change_state('done');
				}
			} else if(this.task.task_status === 2) {     //任务失败
				this.state !== 'error' && this.change_state('error', this.task.retcode);
			} else {      //下载中
				this.change_state('start_upload');
			}
		}
	});

	offline_download.interface('states.start_upload', function() {
		this.change_state('upload_file_update_process', this.task.processed);
	});

	offline_download.interface('states.upload_file_update_process', function (processed) {
		this.processed = processed;
	});

	/**
	 * 出错后，能否重试
	 */
	offline_download.interface('can_re_start', function() {
		return false;
	});

	offline_download.interface('dom_events', {
		click_cancel: function() {
			var me = this,
				option = {
					'task_id': [this.task.task_id]
				};
			me.old_state = me.state;
			offline_download_object.cancel_task(option).done(function() {}).fail(function() {
				//取消失败再来一次
				offline_download_object.cancel_task(option).done(function() {}).fail(function() {
					logger.dcmdWrite([
						'offline_download_cancel_error --------> task_id: ' + me.task.task_id,
						'offline_download_cancel_error --------> file_name: ' + me.file_name,
						'offline_download_cancel_error --------> file_size: ' + me.file_size,
						'offline_download_cancel_error --------> processed: ' + me.processed,
						'offline_download_cancel_error --------> create_time: ' + me.task.create_time,
						'offline_download_cancel_error --------> task_status: ' + me.task.task_status
					], 'offline_download_monitor', 2001011, 1);
				});
			});
			me.events.clear.call(this, true);
		}
	});

	/**
	 * 打开至目的地
	 */
	offline_download.interface('open_to_target', function() {
		var me = this;
		require.async('jump_path', function (mod) {
			var jump_path = mod.get('./jump_path');
			jump_path.jump({
				'_id': me.file_id,
				'_pid': me.pdir
			});
		});
	});

	return offline_download;
});