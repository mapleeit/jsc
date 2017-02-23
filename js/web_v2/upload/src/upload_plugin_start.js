/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */


define(function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		c = lib.get('./console'),
		JSON = lib.get('./json'),
		text = lib.get('./text'),
		store = lib.get('./store'),
		Module = common.get('./module'),
		widgets = common.get('./ui.widgets'),
		user_log = common.get('./user_log'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		functional = common.get('./util.functional'),
		upload_event = common.get('./global.global_event').namespace('upload2'),

		disk = require('disk').get('./disk'),
		loading = require('./upload_folder.loading'),
		file_list = require('disk').get('./file_list.file_list'),
		upload_route = require('./upload_route'),
		select_folder = require('./select_folder.select_folder'),
		FolderValidata = require('./upload_file_validata.upload_folder_validata'),
		upload_file_check = require('./upload_file_validata.upload_file_check'),
		upload_plugin_files = require('./upload_plugin.upload_plugin'),
		get_up_folder_files = require('./upload_folder.get_up_folder_files'),
		upload_plugin_folder = require('./upload_plugin.upload_plugin_folder'),
		tmpl = require('./tmpl'),

		upload_folder,

		is_newest_version = function() {
			return common.get('./util.plugin_detect').is_newest_version();
		}(),

		//比较控件版本是否大于等于指定的版本
		compare_plugin_ver = function(ie_ver, webkit_ver) {
			var plugin_detect = common.get('./util.plugin_detect'),
				ver, cur_ver;
			if(upload_route.type === 'webkit_plugin') {
				ver = plugin_detect.get_webkit_plugin_version();
				cur_ver = parseInt(ver.split('.').join(''), 10);
				return cur_ver >= webkit_ver;
			} else {
				ver = plugin_detect.get_ie_plugin_version();
				cur_ver = parseInt(ver.split('.').join(''), 10);
				return cur_ver >= ie_ver;
			}
		},

		is_support_new_folder = function() {
			//IE控件 1.0.3.17开始支持新方式文件夹上传
			return compare_plugin_ver(10317, 10011);
		}(),

		G1 = Math.pow(2, 30),
		G2 = G1 * 2,
		G4 = G1 * 4,
		G32 = G1 * 32;

	upload_event.on('add_upload', upload_plugin_files.add_upload);
	upload_event.on('add_folder_upload', upload_plugin_folder.add_upload);
	//新增一个在已有的文件夹上传的任务中添加子文件上传事件
	upload_event.on('add_folder_files_upload', upload_plugin_folder.add_sub_task);

	if(constants.IS_APPBOX) {
		//QQ2.0 appbox的文件夹读取
		upload_folder = require('./upload_folder.upload_folder_appbox');
	} else if($.browser.msie && is_support_new_folder) {
		//新版IE控件上传文件夹
		upload_folder = require('./upload_folder.upload_folder_ie');
	}

	//是否支持选3000+的文件上传,
	//{
		//ie控件大于1.0.3.17，
		//webkit控件大于1.0.0.11
		//appbox 待定
	//}
	var is_support_gt3000_files = function() {
		if(constants.IS_APPBOX) { //appbox暂时还不支持
			return false;
		}

		return compare_plugin_ver(10320, 10013);
	};

	//老控件选择文件上传
	var old_select_files = function(upload_plugin) {
		//chrome
		if(upload_plugin.SelectFilesAsync && !$.browser.safari) {      //firefox和chrome下都有异步选取文件的方法. 且如果用同步, firefox会卡死. safari不能用异步选取文件.
			return upload_plugin.SelectFilesAsync(window, function(files) {
				var __files;

				if(!files) {
					return;
				}

				__files = files.split('\r\n');
				__files.pop();
				if(!__files || !__files.length) { //没有选中文件退出
					return;
				}

				upload_file_check.check_start_upload(__files, upload_plugin, G2);
			});
		}

		//IE
		var files = functional.try_it(function() {
			//上传文件
			var ary = upload_plugin.SelectFiles(window).split('\r\n');
			ary.pop(); //选取的文件

			return ary;
		});

		if(!files || !files.length) { //没有选中文件退出
			return;
		}

		upload_file_check.check_start_upload(files, upload_plugin, G4);
	};

	//文件上传 选择框
	var start_upload = function(upload_plugin) {    //用户通过选择框上传
		var upload_files;
		//如果是老版本控件，提示安装新版本控件
		if(!is_newest_version && !constants.IS_APPBOX) {
			upload_event.trigger('install_plugin', '请升级最新微云极速上传控件', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
			return;
		}
		if(is_support_gt3000_files()) {
			if(upload_route.type === 'webkit_plugin') {
				upload_plugin.SelectFilesAsyncCallback(window);
				upload_files = require('./upload_files.upload_files_webkit');
				upload_files.init(upload_plugin);
			} else {
				upload_plugin.AsyncSelectFiles(window, '');
				upload_files = require('./upload_files.upload_files_ie');
				upload_files.init(upload_plugin);
			}
		} else {
			old_select_files(upload_plugin);
		}
	};

	//上传文件夹 选择框
	var start_folder_upload = function(upload_plugin) {
		var is_canceled = false;
		//先判断下控件是否支持上传文件夹
		try {
			//以下是异步方式
			var num = constants.UPLOAD_FOLDER_LEVEL;
			var cached_user = query_user.get_cached_user();
			if(cached_user && cached_user.get_dir_layer_max_number) {
				num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
			}
			upload_plugin.AsyncSelectFolder(window, num, '');
			//预先定义一个回调函数给控件调用，在这里拿返回值
			var selectFolderCallback = function(event_param) {
				//appbox是字符串，需要处理下
				if((typeof event_param).toLowerCase() === 'string') {
					event_param = JSON.parse(event_param);
				}
				var filestr = event_param.testx,
					error_code = event_param.ErrorCode;

				if(is_canceled == true) return 1; //用户点击了取消，后面的都不执行了

				if(error_code == 42260001) { //选择了整个磁盘
					loading.hide();
					var ret = ['暂不支持上传整个盘符，请重新选择。', 1];
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
					var ret = folderValidata.run();
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
			}
			else {
				//web:upload_plugin.OnAsyncSelectFolderEvent
				upload_plugin.OnAsyncSelectFolderEvent = selectFolderCallback;
			}
		}
		catch(e) {
			c.log(e);
			//触发升级控件提示
			upload_event.trigger('install_plugin', '请升级控件以支持文件夹上传', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
			return;
		}

	};

	//选择4G大文件 选择框
	var start_4g_upload = function(upload_plugin, is_support_4g) {
		//先判断是否支持大文件上传，不支持就提示升级控件
		if(is_support_4g === false) {
			upload_event.trigger('install_plugin', '请升级控件以支持超大文件上传', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
			return;
		}
		else {
			//firefox必须使用回调.
			if(upload_plugin.SelectFileAsync && !$.browser.safari) {
				return upload_plugin.SelectFileAsync(window, function(_files) {
					if(!_files) {
						return;
					}

					var files = _files.split('\r\n');
					//__files.pop();

					if(!files || !files.length) { //没有选中文件退出
						return;
					}

					upload_file_check.check_max_files_size(files, upload_plugin);
					return;

				});
			}
			else {
				//IE 只支持选一个文件
				var files = functional.try_it(function() {
					//上传文件
					var ary = upload_plugin.SelectFile(window).split('\r\n');

					//ary.pop(); //选取的文件
					return ary;
				});

				if(!files || !files.length || files[0] == '') { //没有选中文件退出
					return;  //当点击取消也会调用这里
				}

				upload_file_check.check_max_files_size(files, upload_plugin);
				return;
			}

		}

	};

	var plugin_start = new Module('plugin_start', {  //初始化
		render: function() {
			upload_event.on('start_upload', start_upload);
			upload_event.on('start_folder_upload', start_folder_upload);
			upload_event.on('start_4g_upload', function(upload_plugin, is_support_4g) {
				start_4g_upload(upload_plugin, is_support_4g);
			});

			this.listenTo(upload_route, 'render', function() {
				//拖拽或者通过QQ上传到微云按钮上传
				upload_event.off('start_upload_from_client').on('start_upload_from_client', function(files, is_qq_receive) {
					var ppdir, pdir, ppdir_name, pdir_name, node, node_name;
					if(disk.is_rendered() && disk.is_activated()) {
						//var node = file_list.get_cur_node() || file_list.get_root_node();
						node = file_list.get_cur_node();
						//判断是否虚拟目录,是虚拟目录强制回到根目录
						if(node && node.is_vir_dir()) {
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

					//c.log(ppdir,pdir,ppdir_name,pdir_name);
					return upload_event.trigger('add_upload', upload_route.upload_plugin, files, {
						'ppdir': ppdir,
						'pdir': pdir,
						'ppdir_name': ppdir_name,
						'pdir_name': pdir_name,
						'dir_paths': [],
						'dir_id_paths': [],
						'is_qq_receive': is_qq_receive
					});
				});

				//断点续传 code by bondli 直出导致upload_route没有render，代码提前
				var start = function() {
					var json_str = store.get(query_user.get_uin() + 'resume_store');
					if(json_str) {
						functional.try_it(function() {
							var resume_lists = JSON.parse(json_str);
							if(resume_lists.tasks && resume_lists.tasks.length) {
								upload_plugin_files.add_resume(resume_lists.tasks, upload_route.upload_plugin);
							}
							if(resume_lists.folder_tasks && resume_lists.folder_tasks.length) {
								upload_plugin_folder.add_resume(resume_lists.folder_tasks, upload_route.upload_plugin);
							}
						});
					}
				};
			});
		}
	});

	plugin_start.render();

	upload_event.on('set_resume_store', function(files) {   //离开页面前设置需要续传的文件.
		var key = query_user.get_uin() + 'resume_store';
		store.set(key, JSON.stringify(files));
	});

	//获取正在上传的文件ID
	upload_event.on('get_curr_upload_file_id', function() {
		var key = query_user.get_uin() + 'upload_file_id',
			id = store.get(key);
		return id ? id : null;
	});

	//设置正在上传的文件ID
	upload_event.on('set_curr_upload_file_id', function(id) {
		var key = query_user.get_uin() + 'upload_file_id';
		if(id) {
			store.set(key, id);
		}
		else {
			store.remove(key);
		}
	});


	module.exports = plugin_start;

	return module;


});