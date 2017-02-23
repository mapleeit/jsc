define(function(require, exports, module) {
	//基础库
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		text = lib.get('./text'),
		random = lib.get('./random'),
		console = lib.get('./console').namespace('html5_upload_pro'),
		logger = common.get('./util.logger'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		widgets = common.get('./ui.widgets'),
		request = common.get('./request'),
		ret_msgs = common.get('./ret_msgs'),
		stat_log = common.get('./stat_log'),
		functional = common.get('./util.functional'),
		file_object = common.get('./file.file_object'),
		global_function = common.get('./global.global_function'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		undefined;

	//扩展模块
	var View = require('./view'),
		file_exif = require('./file_exif'),
		upload_route = require('./upload_route'),
		Upload_class = require('./Upload_class'),
		upload_static = require('./tool.upload_static'),
		upload_cache = require('./tool.upload_cache'),
		upload_plugin_files = require('./upload_plugin.upload_plugin'),
		upload_plugin_folder = require('./upload_plugin.upload_plugin_folder'),
		photo_group = require('./select_folder.photo_group'),
		select_folder = require('./select_folder.select_folder'),
		Validata = require('./upload_file_validata.upload_file_validata'),
		loading = require('./upload_folder.loading'),
		get_up_folder_files = require('./upload_folder.get_up_folder_files'),
		FolderValidata = require('./upload_file_validata.upload_folder_validata'),
		undefined;

	//扩展模块
	var disk = require('disk').get('./disk'),
		file_list = require('disk').get('./file_list.file_list'),
		upload_folder = require('./upload_folder.upload_folder_appbox');
		undefined;

	var G_1 = Math.pow(2, 30); //1GB

	document.domain = 'weiyun.com';

	var add_upload = function(upload_plugin, files, attrs, source) {
		if(source === 'plugin') {
			if(upload_plugin && upload_plugin.UploadFile) {
				upload_plugin_files.add_upload.call(upload_plugin_files, upload_plugin, files, attrs, source);
			}
			return;
		}
		var len = files.length,
			uploadObj;
		for(var file in files) {
			uploadObj = Upload.getInstance(upload_plugin, random.random(), files[file], attrs);
			uploadObj.change_state('wait');    //状态转为wait，放入队列等待.
			if((len -= 1) === 0) {
				uploadObj.events.nex_task.call(uploadObj);
			}
		}
	};
	//appbox上传文件夹选择框
	var start_folder_upload = function() {
		var upload_plugin = window.external;
		var is_canceled = false;
		//先判断下控件是否支持上传文件夹
		try {
			//以下是异步方式
			var num = constants.UPLOAD_FOLDER_LEVEL;
			var cached_user = query_user.get_cached_user();
			if(cached_user && cached_user.get_dir_layer_max_number) {
				num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
			}
			var taskId = upload_plugin.AsyncSelectFolder(window, num, '');
			//预先定义一个回调函数给控件调用，在这里拿返回值
			var selectFolderCallback = function(event_param) {
				//appbox是字符串，需要处理下
				if((typeof event_param).toLowerCase() === 'string') {
					event_param = JSON.parse(event_param);
				}
				var filestr = event_param.testx,
					error_code = event_param.ErrorCode,
					ret;

				if(is_canceled == true) return 1; //用户点击了取消，后面的都不执行了

				if(error_code == 42260001) { //选择了整个磁盘
					loading.hide();
					ret = ['暂不支持上传整个盘符，请重新选择。', 1];
				} else if(error_code == 42260002) { //点击了取消
					loading.hide();
					return 1;
				} else {
					if((typeof filestr) === 'undefined') { //第一次进来，扫描开始
						loading.show('正在获取文件夹信息', function() {
							is_canceled = true;
							loading.hide();
						});
						return 1;
					}

					loading.hide();

					var __files = filestr.split('\r\n');
					__files.pop();

					if(!__files || !__files.length) { //没有选中文件退出
						return 1;
					}

					var files = get_up_folder_files(__files);
					var folderValidata = FolderValidata.create();
					folderValidata.add_validata('max_dir_size', files.dir_total_num, query_user.get_cached_user().get_dir_count());  //目录数太多验证
					var max_file_num_dir_name = text.smart_cut(files.max_file_num_dir_name, 20);
					folderValidata.add_validata('max_level_size', files.dir_level_num, max_file_num_dir_name, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
					folderValidata.add_validata('max_files_size', files.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
					ret = folderValidata.run();
				}

				if(ret) {
					var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + ret[0] + '</span></p>');
					var dialog = new widgets.Dialog({
						title: '上传提醒',
						empty_on_hide: true,
						destroy_on_hide: true,
						content: $el,
						tmpl: tmpl.dialog3,
						mask_ns: 'gt_4g_tips',
						buttons: [
							{id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true}
						],
						handlers: {
						}
					});
					dialog.show();
					return 1;
				} else {
					select_folder.show_by_upfolder(files, upload_plugin);
					return 1;
				}

				return 1;
			};

			//appbox:window.OnAsyncSelectFolderEvent
			window.OnAsyncSelectFolderEvent = selectFolderCallback;

			//QQ2.0 appbox || 新版本ie控件的文件夹读取
			if(upload_folder) {
				upload_folder.init(upload_plugin);
			} else {
				//web:upload_plugin.OnAsyncSelectFolderEvent
				upload_plugin.OnAsyncSelectFolderEvent = selectFolderCallback;
			}
		} catch(e) {
			//触发升级控件提示
			upload_event.trigger('install_plugin', '请升级控件以支持文件夹上传', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
			return;
		}
	};

	upload_event.off('add_upload').on('add_upload', add_upload);
	upload_event.off('start_folder_upload').on('start_folder_upload', start_folder_upload);
	upload_event.off('add_folder_upload').on('add_folder_upload', upload_plugin_folder.add_upload);
	//新增一个在已有的文件夹上传的任务中添加子文件上传事件
	upload_event.off('add_folder_files_upload').on('add_folder_files_upload', upload_plugin_folder.add_sub_task);
	//响应appbox拖曳上传
	upload_event.off('start_upload_from_client').on('start_upload_from_client', function (files, is_qq_receive) {
		var ppdir, pdir, ppdir_name, pdir_name, node, node_name;
		if (disk.is_rendered() && disk.is_activated()) {
			node = file_list.get_cur_node();
			//判断是否虚拟目录,是虚拟目录强制回到根目录
			if (node && node.is_vir_dir()) {
				node = file_list.get_root_node();
			}
			node_name = node.get_name();
			pdir = node.get_id();
			ppdir = node.get_parent().get_id();
			pdir_name = node_name;
			ppdir_name = node.get_parent().get_name() || '';
		} else {
			var node_id = query_user.get_cached_user().get_main_key();
			node_name = query_user.get_cached_user().get_main_dir_name();
			pdir = node_id;
			ppdir = query_user.get_cached_user().get_root_key();
			pdir_name = node_name;
			ppdir_name = '';
		}

		return upload_event.trigger('add_upload', window.external, files, {
			'ppdir': ppdir,
			'pdir': pdir,
			'ppdir_name': ppdir_name,
			'pdir_name': pdir_name,
			'dir_paths': [],
			'dir_id_paths': [],
			'is_qq_receive': is_qq_receive
		}, 'plugin');
	});

	var Upload = Upload_class.sub(function(upload_plugin, id, file, attrs, folder_id) {
		this.file = file.file || file;
		this.upload_plugin = upload_plugin;
		this.local_id = id;
		this.del_local_id = id;
		this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
		this.pdir = attrs.pdir;   //上传到指定的目录ID
		this.path = file.name;
		this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
		this.pdir_create_ret = attrs.pdir_create_ret; //父目录创建结果
		this.file_name = file.name;
		this.file_size = file.size;
		this.temporary = '';  //下线中转站  //!!attrs.temporary; //是否是中转站文件上传
		this.processed = 0;
		this.code = null;
		this.log_code = 0;
		this.can_pause = true;
		this.state = null;
		this.view = null;
		//计算SHA的参数
		this.endingByte = 0;
		this.startingByte = 0;
		this.sha = '';
		this.md5 = '';
		this.file_sign_update_process = 0; //当前扫描进度
		//appbox拖曳上传，需通过控件取 file_name 和 file_size
		/*if(constants.IS_APPBOX) {
			if(!this.file_name) {
				this.file_name = this.get_file_name();
			}
			if(!this.file_size && window.external && window.external.GetFileSizeString) {
				this.file_size = this.get_file_size();
			}
		}*/
		//校验
		this.validata = Validata.create();
		//this.validata.add_validata('check_name',this.file_name);//名称校验
		this.validata.add_validata('check_video', this.file_name);//视频文件
		this.validata.add_validata('h5_pro_max_size', this.file_size, G_1 * 4);
		this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
		this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
		//初始化
		this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
		if(folder_id) {
			this.folder_id = folder_id;
		}
		this.upload_type = 'upload_html5_pro';
	});

	Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

	Upload.interface('events', $.extend({}, Upload_class.getPrototype().events));

	/*Upload.interface('get_file_size', function () {
		var self = this;
		var file_size = functional.try_it(function () {
			return window.external.GetFileSizeString(self.file) - 0;
		}) || 0;

		file_size = file_size - 0;
		if (file_size < 0) {
			file_size += 4 * 1024 * 1024 * 1024;
		}

		return file_size;
	});

	Upload.interface('get_file_name', function () {
		var me = this;
		if( me.file_name ){
			return me.file_name;
		}
		if ( me.file ) {
			return functional.try_it(function () { //文件名称
				var ary = me.file.split(/\\|\//);
				return ary[ary.length - 1] || '';
			}) || '';
		}
		return '';
	});*/

	//扫描进度
	Upload.interface('states.file_sign_update_process', function(percent) {
		this.file_sign_update_process = percent;
	});

	//预扫描
	Upload.interface('states.pre_file_sign', function () {
		if(!this.is_pre_file_sining) {
			this.is_pre_file_sining = true;
			this.upload_plugin.varityFile(this);
		}
	});

	Upload.interface('states.start', function() {
		var __self = this;

		if(this.pdir_create_ret) {
			this.change_state('error', this.pdir_create_ret);
			return;
		}
		this.start_time = +new Date();
		var ret = this.superClass.states.start.apply(this, arguments);
		//获取里面的返回值，防止本地错误了，还会继续执行上传
		if(ret === false) {
			return;
		}

		this.is_stop_upload = false;
		if(this.file_size === 0) {
			var data = this.get_upload_param.call(this, '', '');
			data.file_sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
			data.file_md5 = 'd41d8cd98f00b204e9800998ecf8427e';
			data.upload_type = 0; //走分片上传的协议
			data.file_size = 0;
			data.use_mutil_channel = true;
			this.request_upload(data, function(rsp_body, data) {
				if(rsp_body.file_exist) {
					__self.change_state('done', rsp_body, data);
				} else {
					//空文件会秒传
				}
			});
		} else if(this.is_pre_file_sining) {//已经在扫描中
			this.is_pre_file_sining = false;//转为开始状态
		} else {
			__self.upload_plugin.varityFile(__self);
		}
	});

	Upload.interface('states.start_upload', function() {
		try {
			//日志上报
			console.log('start_upload, upload_type: ' + this.upload_type);
			console.log('start_upload, start_time, : ' + this.start_time);
			console.log('start_upload, file_sha: ' + this.file_sha);
			console.log('start_upload, file_name: ' + this.file_name);
			console.log('start_upload, file_type: ' + this.file_type);
			console.log('start_upload, file_size: ' + this.file_size);
			console.log('start_upload, server_name: ' + this.server_name);
			console.log('start_upload, server_port: ' + this.server_port);
			console.log('start_upload, remain_flow_size: ' + this.remain_flow_size);
			console.log('start_upload, inside_upload_ip: ' + this.inside_upload_ip);
			console.log('start_upload, orig_channel_count: ' + this.orig_channel_count);
			console.log('start_upload, path: ' + this.path);
			logger.report({
				report_console_log: true
			});
		} catch(e) {}

		this.is_stop_upload = false;
		this.upload_plugin.uploadFile(this);

		//启动预扫描
		if(!this.folder_id) {
			this.don_next_task_sign();
		}
	});

	//暂停后再继续上传
	Upload.interface('states.to_continuee', function () {
		this.is_stop_upload = false;
		this.start_file_processed = this.processed; //本次传输是从什么时候开始的．
		//做为下一个执行，准备执行
		this.get_queue().head(this, function () {
			this.get_belong_cache().push_curr_cache(this.del_local_id, this);
			this.upload_plugin.uploadFile(this);
		});
	});

	//取消上传
	Upload.interface('stop_upload', function () {
		//设置标记，强制中断下一个通道的上传
		//如果不设置标记，虽然界面是删掉任务了，但后面的分片上传还会继续执行
		this.is_stop_upload = true;
	});

	Upload.interface('states.done', function () {
		this.superClass.states.done.apply(this, arguments);
		//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
		if (disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) { //正在当前目录下，才刷新列表
			file_list.reload(false, false);
		}
		this.file = null;
	});

	Upload.interface('don_next_task_sign', function () {
		var cache = upload_cache.get_up_main_cache();
		var next_task = cache.get_next_task();
		if(next_task) {
			next_task.change_state('pre_file_sign');
		}
	});

	/**
	 * 重试的上传
	 */
	Upload.interface('re_start_action', function () {
		var that = this;
		var data;

		if(that.file_sha) {
			data = this.get_upload_param.call(this, that.file_md5, that.file_sha);
			data.upload_type = 0; //走分片上传的协议
			data.file_size = that.file_size;
			data.use_mutil_channel = true;
			that.request_upload(data, function(rsp_body, data) {
				if(rsp_body.file_exist) {
					that.change_state('done', rsp_body, data);
				} else {
					that.change_state('start_upload', rsp_body, data);
				}
			});
		} else {
			that.change_state('start');
		}
	});

	Upload.interface('states.upload_file_update_process', function (processed) {
		this.processed = processed;
	});

	/**
	 * 是否妙传
	 */
	Upload.interface('is_miaoc', function () {
		return this.file_exist;
	});

	module.exports = Upload;
});