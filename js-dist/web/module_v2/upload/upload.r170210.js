//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/upload/upload.r170210",["lib","common","$","disk","main"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//upload/src/Upload_class.js
//upload/src/Upload_h5_flash_class.js
//upload/src/Upload_html5_class.js
//upload/src/aop_wrap_log.js
//upload/src/download/appbox.js
//upload/src/drag_upload_active.js
//upload/src/drag_upload_html5.js
//upload/src/event.js
//upload/src/exif.js
//upload/src/file_exif.js
//upload/src/msg.js
//upload/src/offline_download/file_dir_list.js
//upload/src/offline_download/offline_download.js
//upload/src/offline_download/offline_download_class.js
//upload/src/offline_download/offline_download_start.js
//upload/src/select_folder/dropdown_menu.js
//upload/src/select_folder/file_dir_list.js
//upload/src/select_folder/photo_group.js
//upload/src/select_folder/select_folder.js
//upload/src/select_folder/select_folder_msg.js
//upload/src/select_folder/select_folder_view.js
//upload/src/speed/count_box.js
//upload/src/speed/download.js
//upload/src/speed/speed_task.js
//upload/src/speed/upload.js
//upload/src/tool/bar_info.js
//upload/src/tool/sha.js
//upload/src/tool/temporary_upload.js
//upload/src/tool/upload_cache.js
//upload/src/tool/upload_queue.js
//upload/src/tool/upload_static.js
//upload/src/upload_dropdown_menu.js
//upload/src/upload_file_validata/upload_4g_validata.js
//upload/src/upload_file_validata/upload_file_check.js
//upload/src/upload_file_validata/upload_file_validata.js
//upload/src/upload_file_validata/upload_folder_validata.js
//upload/src/upload_files/upload_files_ie.js
//upload/src/upload_files/upload_files_webkit.js
//upload/src/upload_folder/Create_dirs_class.js
//upload/src/upload_folder/TreeNode.js
//upload/src/upload_folder/create_dirs.js
//upload/src/upload_folder/get_up_folder_files.js
//upload/src/upload_folder/loading.js
//upload/src/upload_folder/upload_folder_appbox.js
//upload/src/upload_folder/upload_folder_h5.js
//upload/src/upload_folder/upload_folder_h5_start.js
//upload/src/upload_folder/upload_folder_ie.js
//upload/src/upload_form_start.js
//upload/src/upload_global_function.js
//upload/src/upload_h5_flash.js
//upload/src/upload_h5_flash_start.js
//upload/src/upload_html5.js
//upload/src/upload_html5_pro.js
//upload/src/upload_html5_pro_class.js
//upload/src/upload_html5_start.js
//upload/src/upload_plugin/upload_plugin.js
//upload/src/upload_plugin/upload_plugin_folder.js
//upload/src/upload_plugin_start.js
//upload/src/upload_route.js
//upload/src/upload_tips.js
//upload/src/view.js
//upload/src/view_type/empty.js
//upload/src/view_type/folder.js
//upload/src/view_type/offline_download.js
//upload/src/view_type/webkit_down.js
//upload/src/offline_download/offline_download.tmpl.html
//upload/src/select_folder/photo_group.tmpl.html
//upload/src/select_folder/select_folder.tmpl.html
//upload/src/upload.tmpl.html
//upload/src/upload_button.tmpl.html
//upload/src/upload_folder/loading.tmpl.html

//js file list:
//upload/src/Upload_class.js
//upload/src/Upload_h5_flash_class.js
//upload/src/Upload_html5_class.js
//upload/src/aop_wrap_log.js
//upload/src/download/appbox.js
//upload/src/drag_upload_active.js
//upload/src/drag_upload_html5.js
//upload/src/event.js
//upload/src/exif.js
//upload/src/file_exif.js
//upload/src/msg.js
//upload/src/offline_download/file_dir_list.js
//upload/src/offline_download/offline_download.js
//upload/src/offline_download/offline_download_class.js
//upload/src/offline_download/offline_download_start.js
//upload/src/select_folder/dropdown_menu.js
//upload/src/select_folder/file_dir_list.js
//upload/src/select_folder/photo_group.js
//upload/src/select_folder/select_folder.js
//upload/src/select_folder/select_folder_msg.js
//upload/src/select_folder/select_folder_view.js
//upload/src/speed/count_box.js
//upload/src/speed/download.js
//upload/src/speed/speed_task.js
//upload/src/speed/upload.js
//upload/src/tool/bar_info.js
//upload/src/tool/sha.js
//upload/src/tool/temporary_upload.js
//upload/src/tool/upload_cache.js
//upload/src/tool/upload_queue.js
//upload/src/tool/upload_static.js
//upload/src/upload_dropdown_menu.js
//upload/src/upload_file_validata/upload_4g_validata.js
//upload/src/upload_file_validata/upload_file_check.js
//upload/src/upload_file_validata/upload_file_validata.js
//upload/src/upload_file_validata/upload_folder_validata.js
//upload/src/upload_files/upload_files_ie.js
//upload/src/upload_files/upload_files_webkit.js
//upload/src/upload_folder/Create_dirs_class.js
//upload/src/upload_folder/TreeNode.js
//upload/src/upload_folder/create_dirs.js
//upload/src/upload_folder/get_up_folder_files.js
//upload/src/upload_folder/loading.js
//upload/src/upload_folder/upload_folder_appbox.js
//upload/src/upload_folder/upload_folder_h5.js
//upload/src/upload_folder/upload_folder_h5_start.js
//upload/src/upload_folder/upload_folder_ie.js
//upload/src/upload_form_start.js
//upload/src/upload_global_function.js
//upload/src/upload_h5_flash.js
//upload/src/upload_h5_flash_start.js
//upload/src/upload_html5.js
//upload/src/upload_html5_pro.js
//upload/src/upload_html5_pro_class.js
//upload/src/upload_html5_start.js
//upload/src/upload_plugin/upload_plugin.js
//upload/src/upload_plugin/upload_plugin_folder.js
//upload/src/upload_plugin_start.js
//upload/src/upload_route.js
//upload/src/upload_tips.js
//upload/src/view.js
//upload/src/view_type/empty.js
//upload/src/view_type/folder.js
//upload/src/view_type/offline_download.js
//upload/src/view_type/webkit_down.js
define.pack("./Upload_class",["lib","common","$","disk","./view","./msg","./upload_route","./speed.speed_task","./aop_wrap_log","./tool.upload_static","./tool.upload_cache","./tool.bar_info","./select_folder.photo_group","main"],function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),
		disk_mod = require('disk'),

		console = lib.get('./console').namespace('upload'),
		Class = lib.get('./class'),
		routers = lib.get('./routers'),
		query_user = common.get('./query_user'),
		plugin_detect = common.get('./util.plugin_detect'),
		functional = common.get('./util.functional'),
		file_type_map = common.get('./file.file_type_map'),
		constants = common.get('./constants'),
		request = common.get('./request'),
		file_object = common.get('./file.file_object'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		dataChanged_event = common.get('./global.global_event').namespace('datasource.photo'),
		https_tool = common.get('./util.https_tool'),
		stat_log = common.get('./stat_log'),
		logger = common.get('./util.logger'),

		disk = disk_mod.get('./disk'),
		file_list = disk_mod.get('./file_list.file_list'),
		file_list_ui = disk_mod.get('./file_list.ui'),
		remove = disk_mod.get('./file_list.file_processor.remove.remove'),
		FileNode = disk_mod.get('./file.file_node'),
		all_file_map = disk_mod.get('./file.utils.all_file_map'),

		View = require('./view'),
		msg = require('./msg'),
		upload_route = require('./upload_route'),
		speed_task = require('./speed.speed_task'),
		aop_wrap_log = require('./aop_wrap_log'),
		upload_static = require('./tool.upload_static'),
		upload_cache = require('./tool.upload_cache'),
		bar_info = require('./tool.bar_info'),//统计信息类
		photo_group = require('./select_folder.photo_group'),
		main = require('main').get('./main');

	var get_plugin_version = function() { //获取控件的版本号
		if(constants.IS_APPBOX) {
			if(window.external.GetVersion) {
				return 'appbox-' + window.external.GetVersion();
			} else {
				return 'appbox';
			}
		}
		switch(upload_route.type) {
			case('active_plugin'):
				return plugin_detect.get_ie_plugin_version();
			case('webkit_plugin'):
				//1.0.0.4以前的版本通过plugin_detect获取不到
				var v = plugin_detect.get_webkit_plugin_version();
				if(v === '0') {
					try {
						return upload_route.upload_plugin.Version;
					}
					catch(e) {
						return 0;
					}
				}
				return v;
			default :
				return '-';
		}
	};

	var Upload = (function() {
		var G1 = Math.pow(2, 30),
			G4 = G1 * 4,
			dir_cache = {},//目录cache
			done_file_id_cache = {},
			__Upload = Class.create();

		//建立 和 Cache联系的 methods
		var link_methods = {
			get_belong_cache: function() {
				return upload_cache.get(this.cache_key);
			},
			get_cache: function() {
				return this.get_belong_cache().get_cache();
			},
			get_curr_cache: function() {
				return this.get_belong_cache().get_curr_cache();
			},
			get_total_size: function(total_size) {
				if(total_size - 0 >= 0) { //set
					this.get_belong_cache().get_total_size(total_size);
				} else {//get
					return this.get_belong_cache().get_total_size();
				}
			},
			get_passed_size: function(passed_size) {
				if(passed_size - 0 >= 0) {//set
					this.get_belong_cache().get_passed_size(passed_size);
				} else {//get
					return this.get_belong_cache().get_passed_size();
				}
			},
			get_queue: function() {
				return this.get_belong_cache().get_queue();
			},
			get_curr_upload: function() {
				return this.get_belong_cache().get_curr_upload();
			},
			plus_info: function(key) {
				this.get_belong_cache().plus_info(key, this);
			},
			minus_info: function(key) {
				this.get_belong_cache().minus_info(key, this);
			},
			call_next_task: function() {
				this.get_belong_cache().do_next();
			}
		};
		for(var method_name in link_methods) {
			__Upload.interface(method_name, link_methods[method_name]);
		}


		/**
		 * @param dir_id_paths 目录id路径
		 * @param dir_paths 目录名称路径
		 * @param cache_key 缓存key
		 * @param view_key 试图key
		 * @param op_type 操作类型
		 */
		__Upload.interface('init', function(dir_id_paths, dir_paths, cache_key, view_key, op_type) {
			this.cache_key = cache_key || upload_cache.default_cache_key;
			var me = this;
			this.get_belong_cache().push_cache(me.local_id, me);

			this._state_log = {msg: []};
			me.upload_type = me.upload_type || upload_route.type;
			me.file_type = me.file_type || upload_static.FILE_TYPE;//文件类型
			me.view = View.add(me, view_key);
			if(dir_id_paths && dir_id_paths.length) {//存储目录路径信息
				dir_cache[ dir_id_paths[ dir_id_paths.length - 1 ] ] = {'paths': dir_paths, 'ids': dir_id_paths  };
			}
			me.op_type = op_type || upload_static.OP_TYPES.UPLOAD;//任务类型
			me.err_msg = '';//错误提示信息
			me.update_state_info('init');
			me.when_change_state('init');
			me.view.invoke_state('init');
		});
		/**
		 * 释放控件资源
		 */
		__Upload.interface('release_plugin', function() {
		});

		/**
		 * 是下载
		 */
		__Upload.interface('is_download', function() {
			return this.op_type === upload_static.OP_TYPES.DOWN;
		});

		/**
		 * 是离线下载
		 */
		__Upload.interface('is_offline', function() {
			return this.op_type === upload_static.OP_TYPES.OFFLINE;
		});

		/**
		 * 是上传
		 */
		__Upload.interface('is_upload', function() {
			return this.op_type === upload_static.OP_TYPES.UPLOAD;
		});

		/**
		 * 是否文件夹上传,用于屏蔽上传成功的上报
		 */
		__Upload.interface('is_upload_folder', function() {
			return false;
		});

		/**
		 * 选中网盘目录文件
		 */
		__Upload.interface('chose_disk_files', function() {
			var ids_paths = this.get_dir_ids_paths(),
				file_ids = this.get_file_id_by_dir(),
				ids = [],
				paths = [];
			if(ids_paths && ids_paths.ids) {
				ids = ids_paths.ids.slice(1);
				paths = ids_paths.paths.slice(1);
			}

			if(ids.length > 0 && paths.length > 0) {
				var def = file_list.load_path(ids, paths, false);//快速打开视图
				if(file_ids && file_ids.length) {
					def.done(function() {
						file_list_ui.highlight_$item(file_ids);//高亮完成文件
					});
				}
			} else if(this.pdir) {
				file_list.load(this.pdir, true);//网盘打开指定目录
				file_list_ui.highlight_$item(file_ids);//高亮完成文件
			}
		});

		/**
		 * 打开至目的地
		 */
		__Upload.interface('open_to_target', function() {
			var me = this;
			//跳到中转站
			//if(this.is_temporary()) {
			//    routers.go({ m: 'station' });
			//    return;
			//}
			if(me.pdir == constants.UPLOAD_DIR_PHOTO) {//相册
				main.switch_mod('photo');//菜单打开相册
				try {
					$('iframe[name=photo_bridge_iframe]')[0].contentWindow.WEIYUN_WEB.View.showPhotostream(1, 1);
				} catch(xe) {
					console.warn('open_to_target :', xe);
				}

			} else {//网盘
				main.switch_mod('disk', { reload: 0 });//菜单打开网盘
				if(!file_list.is_first_loaded()) {
					file_list.load_root(false).done(function() {
						setTimeout(function() {
							me.chose_disk_files();
						}, 50);
					})
				} else {
					me.chose_disk_files();
				}
			}
		});
		/**
		 * 获取进度显示进度位数
		 */
		__Upload.interface('get_the_precision', function() {
			return this._precision || (this._precision = ( (G1 <= this.file_size && this.upload_type !== 'upload_form') ? 2 : 0 ));
		});
		/**
		 * 获取目录路径的ids，names
		 */
		__Upload.interface('get_dir_ids_paths', function() {
			return dir_cache[ this.pdir ];
		});
		/**
		 * 将完成的file_id放到对应的目录中
		 * @param file_id
		 */
		__Upload.interface('push_done_file_id', function(file_id) {
			if(!done_file_id_cache[this.pdir]) { //添加 完成的file_id
				done_file_id_cache[this.pdir] = [];
			}
			done_file_id_cache[this.pdir].push(file_id);
		});
		/**
		 * 获取目录路径下已完成 file_id
		 */
		__Upload.interface('get_file_id_by_dir', function() {
			return done_file_id_cache[this.pdir] ? done_file_id_cache[this.pdir] : [];
		});

		__Upload.interface('change_state', function() {

			var state = Array.prototype.shift.call(arguments),
				__statefn = this.states[state];
			if(__statefn) {
				if(state !== this.state) {
					this.update_state_info(state, this.del_local_id);//更新全局信息
					this.view.transform_state.call(this.view, state);     //转化状态的一瞬间

					//改变状态的时候改变文件上传的状态
					var set_curr_upload_fileid = 'start_upload upload_file_update_process',
						del_curr_upload_fileid = 'done error clear pause';
					if(-1 !== set_curr_upload_fileid.indexOf(state)) {
						if(this.file_id && !this.is_download()) upload_event.trigger('set_curr_upload_file_id', this.file_id);
					}
					else if(-1 !== del_curr_upload_fileid.indexOf(state)) {
						upload_event.trigger('set_curr_upload_file_id');
					}
				}
				this.state = state;
				__statefn.apply(this, arguments);
				this.when_change_state(this.state);
				this.view.change_state();

			}


			this._state_log.msg = this._state_log.msg || [];

			if(this.state === 'file_sign_update_process' || this.state === 'upload_file_update_process' || this.state === 'processing') {
				if(!this._state_log[this.state]) {
					this._state_log.msg.push(this.state);
					this._state_log[this.state] = 'processing';
				}
			} else {
				this._state_log.msg.push(this.state);
			}

		});

		/**
		 * 监听任务之间的状态切换
		 */
		__Upload.interface('when_change_state', function(target_state) {
			if(bar_info.process_states[target_state]) {
				bar_info.check_error(this);
				bar_info.update(this.is_download() ? bar_info.OPS.DOWN_CHECK : bar_info.OPS.UP_CHECK);
			}
		});

		__Upload.interface('set_local_id', function(local_id) {
			this.get_belong_cache().pop_cache(this.local_id);
			if(!local_id && local_id !== 0) {
				return;
			}
			this.get_queue().set_only_key(this.local_id, local_id);
			this.local_id = local_id;
			this.get_belong_cache().push_cache(this.local_id, this);
		});

		__Upload.interface('get_file_size', function() {
			var self = this;
			var file_size = functional.try_it(function() {
				return self.upload_plugin.GetFileSizeString(self.path) - 0;
			}) || this.upload_plugin.GetFileSize(self.path) || 0;

			file_size = file_size - 0;
			if(file_size < 0) {
				file_size += 4 * 1024 * 1024 * 1024;
			}

			return file_size;
		});

		__Upload.interface('get_file_name', function() {
			var me = this;
			if(me.file_name) {
				return me.file_name;
			}
			if(me.path) {
				return functional.try_it(function() { //文件名称
					var ary = me.path.split(/\\|\//);
					return ary[ary.length - 1] || '';
				}) || '';
			}
			return '';
		});

		//事件分发
		__Upload.interface('dispatch_event', function() {
			if(this.is_upload() && this.is_image()) {
				var file = {
					id: this.file_id,
					name: this.new_name || this.file_name,
					size: this.file_size,
					cur_size: this.file_size,
					create_time: this.file_ctime,
					modify_time: this.file_ctime,
					file_ver: this.file_ver,
					file_md5: this.file_md5,
					file_sha: this.file_sha,
					ppid: this.ppdir,
					pid: this.pdir
				};
				try {
					dataChanged_event.trigger('add', [file], {
						src: this,
						group_id: this.group_id
					});
				} catch(xe) {
				}
			}
		});

		__Upload.interface('is_image', function() {
			return file_object.is_image(this.get_file_name());
		});

		__Upload.interface('get_upload_param', function(md5, sha) {
			//var file_mtime = '2000-01-01 10:00:00',
			//bugfix: 48680617【微云web】接收到本地的QQ文件”上传到微云“，由于文件名多个”.“导致提示文件名不合法
			var re_file_name = this.file_name.replace(/(^\.*|\.*$)/g, ''),
				data;

			data = {
				ppdir_key: this.ppdir || '',
				pdir_key: this.pdir || '',
				upload_type: 0,
				file_sha: sha,
				file_size: this.file_size + '',
				filename: re_file_name,
				file_exist_option: 6 //2015.3.26 应sunny要求改为6
			};

			if(md5) {
				data.file_md5 = md5;
			}

			return data;

		});

		__Upload.interface('get_file_type', function() {
			var self = this;
			var suffix = functional.try_it(function() {
				var ary = self.path.split('.'),
					__suffix = ary[ary.length - 1];
				return __suffix;
			}) || '';
			if(!file_type_map.can_identify_v2(suffix.toLowerCase())) {
				return 'nor';
			}
			return file_type_map.get_type_by_ext_v2(suffix.toLowerCase());
		});

		__Upload.interface('get_translated_error', function(msg_type) {
			if(this.is_download()) {
				return upload_static.get_error_msg(this.log_code, msg_type, 'download_error', this.err_msg);
			} else if(this.is_offline()) {
				return upload_static.get_error_msg(this.log_code, msg_type, 'offline_download_error', this.err_msg);
			} else {
				return upload_static.get_error_msg(this.log_code, msg_type, null, this.error_step, this.err_msg);
			}
		});

		//just_curr_cache 标识仅仅清除 运行缓存中的对象
		__Upload.interface('destroy', function(just_curr_cache) {
			if(!just_curr_cache) {
				this.get_belong_cache().pop_cache(this.local_id);
			}
			this.get_belong_cache().pop_curr_cache(this.del_local_id);

			//如果需要自动保存进度,这里就需要删除
			if(this.need_auto_save_process()) {
				var resume_files = {'tasks': []};
				upload_event.trigger('set_resume_store', resume_files);
			}
		});

		__Upload.interface('dom_events', {
			click_cancel: function() {
				this.old_state = this.state;
				if(this.upload_type !== 'offline_download') {
					//已完成的文件，在清除记录时不需要同步删除网盘文件
					this.events.clear.call(this, this.state === 'done');
				}
			},
			click_pause: function() {
				if(this.can_pause_self()) {
					this.change_state('pause');
				}
			},
			click_continuee: function() {
				View.upload_end_time(true);
				upload_static.batch_pause_to_run([this], 'continuee');
			},
			click_resume_continuee: function() {
				View.upload_end_time(true);
				upload_static.batch_pause_to_run([this], 'resume_continuee');
			},
			click_re_try: function() {
				upload_static.batch_re_start([this]);
			}
		});
		__Upload.interface('is_plugin_upload', function() {
			return false;
		});
		/**
		 * 2.0图片申请上传CGI
		 */
		__Upload.interface('photo_request_upload', function(data, callback) {
			var __self = this;
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			this.group_id = photo_group.get_photo_group_id();

			if(this.group_id > 1) {
				data.ext_info = data.ext_info || {};
				data.ext_info.group_id = this.group_id - 0; //整型，相册分组ID
			}
			if(data.upload_type == null) {
				data.upload_type = (__self.is_plugin_upload() ? 0 : 1)//整型,上传方式, 0代表传统控件上传,1非控件上传
			}
			/*if( data.file_attr && data.file_attr.file_name ){//2.0的file_name变更为外层
			 data.file_name = data.file_attr.file_name;
			 }*/

			if(data.file_size) {//2.0的file_size变更为int类型
				data.file_size -= 0;
			}
			if(!data.ppdir_key || !data.pdir_key) {
				__self.change_state('error', 1000013);//缺少参数
				return;
			}
			var url = this.is_temporary() ? 'http://web2.cgi.weiyun.com/temporary_file.fcg' : 'http://web2.cgi.weiyun.com/qdisk_upload.fcg',
				cmd = this.is_temporary() ? 'TemporaryFileDiskFileUpload' : 'DiskFileUpload';
			if(data.filename.length >= 100) {  //文件名长度大于等于100的时候采用post，tgw对于长文件的get请求会阻断
				request.xhr_post({
					url: url,
					cmd: cmd,
					body: data,
					cavil: true,
					pb_v2: true
				})
					.fail(function(msg, ret, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						__self.err_msg = msg;
						__self.change_state('error', ret);//相册请求上传，激活错误状态
					})
					.ok(function(msg, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
						rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
						rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
						$.extend(__self, rsp_body);
						__self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
						callback(rsp_body, data);
					});
			}
			else {
				request.xhr_get({
					url: url,
					cmd: cmd,
					body: data,
					cavil: true,
					pb_v2: true
				})
					.fail(function(msg, ret, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						__self.err_msg = msg;
						__self.change_state('error', ret);//相册请求上传，激活错误状态
					})
					.ok(function(msg, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
						rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
						rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
						$.extend(__self, rsp_body);
						__self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);

						// 解决秒传请求已经发出，但是用户取消本文件上传的场景下，统计显示有问题的情况 s
						// 检查一下状态map，如果发现在回调前用户已经取消此文件上传，则截断接下来的步骤
						if (!View.close_status_map) {
							View.close_status_map = [];
						}
						for (var i = 0; i < View.close_status_map.length; i++) {
							var item = View.close_status_map[i];
							if (item.file_id === rsp_body.file_id) {
								return;
							}
						}
						// e

						callback(rsp_body, data);
					});
			}

		});
		__Upload.interface('request_upload', function(data, callback) {
			var __self = this;
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			if(file_object.is_image(__self.get_file_name())) {//
				__self.photo_request_upload(data, callback);
				return;
			}
			//code by bondli 增加支持相册上传参数，相册设置的upload_to为-1
			/* var url = 'http://pre.cgi.weiyun.com/uploadv2.fcg';
			var cmd = 'upload';
			if (this.pdir == constants.UPLOAD_DIR_PHOTO) {
				url = 'http://web.cgi.weiyun.com/upload.fcg';
				url += '?module=1';
				cmd = 'file_upload';
			 }*/
			if(data.upload_type == null) {
				data.upload_type = (__self.is_plugin_upload() ? 0 : 1)//整型,上传方式, 0代表传统控件上传,1非控件上传
			}

			/*if( data.file_attr && data.file_attr.file_name ){//2.0的file_name变更为外层
				data.file_name = data.file_attr.file_name;
			}*/
			if(data.file_size) {//2.0的file_size变更为int类型
				data.file_size -= 0;
			}
			//console.debug(data);
			if(!data.ppdir_key || !data.pdir_key) {
				__self.change_state('error', 1000013);//缺少参数
				return;
			}

			var url = this.is_temporary() ? 'http://web2.cgi.weiyun.com/temporary_file.fcg' : 'http://web2.cgi.weiyun.com/qdisk_upload.fcg',
				cmd = this.is_temporary() ? 'TemporaryFileDiskFileUpload' : 'DiskFileUpload';

			this._state_log.msg.push('start request_upload');
			if(data.filename.length >= 100) {  //文件名长度大于等于100的时候采用post，tgw对于长文件的get请求会阻断
				request.xhr_post({
					url: url,
					cmd: cmd,
					body: data,
					cavil: true,
					pb_v2: true
				})
					.fail(function(msg, ret, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						__self.err_msg = msg;
						__self.change_state('error', ret);//相册请求上传，激活错误状态
					})
					.ok(function(msg, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
						rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
						rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
						$.extend(__self, rsp_body);
						__self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
						callback(rsp_body, data);
					});
			}
			else {
				request.xhr_get({
					url: url,
					cmd: cmd,
					body: data,
					cavil: true,
					pb_v2: true
				})
					.fail(function(msg, ret, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						__self.err_msg = msg;
						__self.change_state('error', ret);//相册请求上传，激活错误状态
					})
					.ok(function(msg, rsp_body, rsp_header) {
						if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
							user.set_remain_flow_size(rsp_body.remain_flow_size);
						}
						console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
						rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
						rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
						$.extend(__self, rsp_body);
						__self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
						callback(rsp_body, data);
					});
			}


		});

		__Upload.interface('remove_file', function(delete_complete) {
			if(!this.file_id || this.pdir === -1) {
				return;
			}

			var node = all_file_map.get(this.file_id);
			if(node) {//从本地删除
				file_list.remove_nodes([node]);
			}

			remove.silent_remove(all_file_map.get(this.pdir), this.file_id, this.file_name, delete_complete || false);//从服务器删除
		});

		__Upload.interface('get_resume_param', function() {
			var ret = {
				server: this.server,
				port: this.port,
				check_key: this.check_key,
				file_key: this.file_key,
				file_sha: this.file_sha,
				path: this.path,
				filename: this.file_name,
				file_index: this.file_index,
				processed: this.processed,
				file_id: this.file_id,
				file_ctime: this.file_ctime,
				file_ver: this.file_ver,
				file_size: this.file_size  //新增filesize用于文件夹续传直接获取
			};
			$.extend(ret, {
				ppdir: this.ppdir,
				pdir: this.pdir,
				ppdir_name: this.ppdir_name,
				pdir_name: this.pdir_name
			});
			return ret;
		});

		/**
		 * 自己能否暂停
		 */
		__Upload.interface('can_pause_self', function() {
			return this.state === 'upload_file_update_process';
		});

		/**
		 * 将节点插入到网盘中
		 */
		__Upload.interface('prepend_to_disk', function() {
			if(!this.file_id || this.pdir === -1 || this.state === 'error') {//没有file_id 或者 pdir为相册 或者是出错就不插入了
				return;
			}
			this.push_done_file_id(this.file_id);
			var node = new FileNode({
				is_dir: false,
				id: this.file_id,
				name: this.new_name || this.filename || this.file_name,
				size: this.file_size,
				//先判断是否秒传，秒传就显示完成，再判断是否tpmini加速,APPBOX暂时屏蔽该功能
				cur_size: (constants.IS_APPBOX || this.file_exist) ? this.file_size : (this.tp_key ? 0 : this.file_size),
				create_time: this.file_ctime,
				modify_time: this.file_ctime,
				file_ver: this.file_ver,
				file_md5: this.file_md5,
				file_sha: this.file_sha,
				//增加tpmini加速信息,APPBOX暂时屏蔽该功能
				tp_key: constants.IS_APPBOX ? 0 : (this.tp_key || 0),
				tp_fail: false
			});
			node.pdir = this.pdir;
			upload_static.disk_route.prepend(node);
		});

		/**
		 * 状态信息更新，相关信息同步更新(总进度信息)
		 * @param t_type : 目标状态
		 * @param del_local_id
		 */
		__Upload.interface('update_state_info', function(t_type, del_local_id) {
			var me = this,
				has_size = me.file_size > 1,
				total_size = this.get_total_size(),
				passed_size = this.get_passed_size();

			//目标状态为下面状态，停止上传;
			if(-1 !== ' pause clear re_start '.indexOf(' ' + t_type + ' ')) {
				this.stop_upload();
			}
			//目标状态为下面状态，开始测速度
			if(this.upload_type !== 'upload_form' && this.upload_type !== 'offline_download' && -1 !== ' start_upload to_resume_continuee to_continuee re_start '.indexOf(' ' + t_type + ' ')) {
				speed_task.start();
			}

			//更新状态
			switch(t_type) {
				case('init'):
				{
					if(has_size) {
						total_size += me.file_size;
					}
					break;
				}
				case('re_start'):
				{
					if(has_size) {
						total_size += me.file_size;
					}
					break;
				}
				case('done'):
				{
					if(has_size) {
						passed_size += me.file_size;
					}
					break;
				}
				case('error'):
				{
					if(has_size) {
						total_size -= me.file_size;
					}
					break;
				}

				case('pause'):
				{
					if(has_size) {
						total_size -= me.file_size;
					}
					break;
				}
				case('to_continuee'):
				{
					if(has_size) {
						total_size += me.file_size;
					}
					break;
				}
			}
			//更新总量和passed量
			this.get_total_size(total_size);
			this.get_passed_size(passed_size);
		});

		/**
		 * 停止上传 do nothing, 父类空实现，子类覆盖实现
		 */
		__Upload.interface('stop_upload', function() {
		});

		/**
		 * 出错后，能否重试
		 */
		__Upload.interface('can_re_start', function() {
			//if (this.state === 'error' && ( this.error_type !== 'client' || msg.able_res_start(this.log_code) )) {
			if(this.state === 'error') {
				if(msg.able_res_start(this.log_code) === false) {
					return false;
				}
				if(msg.able_res_start(this.log_code) || this.error_type !== 'client') {
					return true;
				}
			}
			return false;
		});
		/**
		 * 是否妙传
		 */
		__Upload.interface('is_miaoc', function() {
			return false;
		});
		/**
		 * 是否tpmini加速
		 */
		__Upload.interface('is_tpmini', function() {
			return false;
		});

		/**
		 * 是否是上传到中转站的文件
		 */
		__Upload.interface('is_temporary', function() {
			//中转站下线，禁掉上传入口
			return false;
			//return !!this.temporary;
		});

		/**
		 * 设置该上传任务是上传到中转站文件的
		 */
		__Upload.interface('set_temporary', function(is_temporary) {
			this.temporary = is_temporary;
		});

		/**
		 * 设置是否忽略上传到中转站
		 */
		__Upload.interface('ignore_temporary_upload', function(ignore) {
			this.temporary_ignored = !!ignore;
		});
		/**
		 * 是否忽略上传到中转站
		 */
		__Upload.interface('is_temporary_ignored', function() {
			//下线中转站
			return true;
			//return !!this.temporary_ignored;
		});
		/**
		 * 是否需要自动保存进度，防止断电等情况下
		 */
		__Upload.interface('need_auto_save_process', function() {
			return false;
		});

		/**
		 * 获取最大显示进度
		 */
		__Upload.interface('fix_percent', function(percent, precision) {
			//precision = precision || this.get_the_precision();
			//code by bondli fixed precision为0时的bug
			precision = precision !== undefined ? precision : this.get_the_precision();
			if(!this._max_size) {
				this._max_size = 100 - (precision === 0 ? 1 : 1 / Math.pow(10, precision) );
			}
			//code by bondli 进度修改成0%开始
			percent = percent > this._max_size ? this._max_size : (percent > 0 ? percent.toFixed(precision) : 0);
			return percent;
		});

		/*********************************** 默认的状态 ********************************/
		upload_static.add_state.call(__Upload, 'wait', function() {

			this.get_queue().tail(this, function() {
				this.change_state('start');
			});

		});

		upload_static.add_state.call(__Upload, 'start', function() {
			this.get_belong_cache().push_curr_cache(this.del_local_id, this);
			var ret = this.validata && this.validata.run();
			if(ret) {
				//本地校验出错，不必重试.
				this.error_type = 'client';     //是本地出错.
				if($.isArray(ret)) {
					this.change_state('error', ret[0], ret[1]);//本地出错，激活错误状态
				} else {
					this.change_state('error', ret);//本地出错，激活错误状态
				}
				return false;
			}
		});

		upload_static.add_state.call(__Upload, 'start_upload', function() {
			//code by bondli 增加上传开始时间点记录
			this.start_time = +new Date();
		});

		upload_static.add_state.call(__Upload, 'error', function(error_code, error_step) {
			if($.isFunction(error_code)) {
				error_code = error_code();
			}
			if($.isArray(error_code)) {
				this.code = error_code[0];
				this.log_code = error_code[1];
			} else if(!!parseInt(error_code)) {
				this.code = this.log_code = error_code;
			} else {
				this.code = error_step;
				this.log_code = error_code;
			}
			this.error_step = error_step;//控件调试位置
			this._is_request_upload = false;
			this.stop_upload();
			this.destroy(true);
			this.plus_info('error');
			this.prepend_to_disk();
			this.events.nex_task.call(this); //错误的时候继续下一个任务.
			if(this.time) {
				this.time.clear();
			}
			//如果是视频上传错误，这里需要增加提示
			if(this.log_code === 1000009) {
				if(!View.upbox_tips[0].has_show_tips) {
					//任务栏最大化
					View.max();
					var tips = '为了保护知识产权，遵守相关法律法规，我们暂时停止了视频上传服务，具体开放时间敬请关注腾讯微云官方网站。';
					View.upbox_tips.addClass('upbox-video-err').html(tips).show()[0].has_show_tips = true;
				}
			}

			//日志上报
			var console_log = [];
			console_log.push('error --------> code: ' + this.code + ', log_code: ' + this.log_code + (this.error_step ? (', step: ' + this.error_step) : ''));
			if(this._state_log && this._state_log.msg && this._state_log.msg.length) {
				console_log.push('error --------> state_log: ' + this._state_log.msg.join(', '));
			}
			if(this.err_msg && this.err_msg != 'undefined') {
				console_log.push('error --------> err_msg: ' + this.err_msg);
			}
			console_log.push(
					'error --------> upload_type: ' + this.upload_type,
					'error --------> start_time: ' + this.start_time,
					'error --------> file_name: ' + this.file_name
			);
			if(this.file_type) {
				console_log.push('error --------> file_type: ' + this.file_type);
			}
			if(this.path) {
				console_log.push('error --------> path: ' + this.path);
			}
			if(this.inside_upload_ip) {
				console_log.push('error --------> upload_ip: ' + this.inside_upload_ip);
			}
			if(this.check_key) {
				console_log.push('error --------> upload_key: ' + this.check_key);
			}
			if(this.ukeyid) {
				console_log.push('error --------> ukeyid: ' + this.ukeyid);
			}
			//上报模调、错误码和错误信息到罗盘
			if(this.upload_type === 'upload_html5_pro') {
				logger.write(console_log, 'upload_html5_pro_error', this.log_code);
			} else if(this.upload_type === 'offline_download') {
				if(this.log_code === 1026 || this.log_code === 1029) {
					//逻辑错误
					logger.dcmdWrite(console_log, 'offline_download_monitor', this.log_code, 2);
				} else {
					logger.dcmdWrite(console_log, 'offline_download_monitor', this.log_code, 1);
				}
			} else {
				logger.write(console_log, 'upload_error', this.log_code);
			}
		});

		upload_static.add_state.call(__Upload, 'pause', function() {
			//上报统计用.
			this.pause_mode = 1;
			this.destroy(true);
			this.plus_info('pause');
			this.events.nex_task.call(this);//暂停的时候，执行下一个
		});

		upload_static.add_state.call(__Upload, 'to_continuee', function() {
			//记录任务的开始时间
			this.startTime = +new Date();
			this.start_time = +new Date();
			this.start_file_processed = this.processed;//本次传输是从什么时候开始的．
			//做为下一个执行，准备执行
			this.get_queue().head(this, function() {
				this.get_belong_cache().push_curr_cache(this.del_local_id, this);
				this.resume_file_local();
			});
		});

		upload_static.add_state.call(__Upload, 'continuee', function() {
		});

		//页面加载的时候，停留在暂停状态
		upload_static.add_state.call(__Upload, 'resume_pause', function(obj) {
			if(obj) {
				$.extend(this, obj); //缓存在本地的属性，复制上去
				if(obj.local_id) {
					this.set_local_id(obj.local_id);
				}
			}
			this.plus_info('pause');
		});

		upload_static.add_state.call(__Upload, 'to_resume_continuee', function() {
			//记录任务的开始时间
			this.startTime = +new Date();
			this.start_time = +new Date();
			this.start_file_processed = this.processed;//本次传输是从什么时候开始的．
			//做为下一个执行，准备执行
			this.get_queue().head(this, function() {
				this.pause_mode = 1;
				//this.view.start();
				this.view.invoke_state('start');
				this.get_belong_cache().push_curr_cache(this.del_local_id, this);
				if(this.file_type === upload_static.FILE_TYPE) {
					this.set_local_id(this.resume_file_remote());
				} else {
					this.resume_file_remote();
				}
			});
		});

		upload_static.add_state.call(__Upload, 'resume_continuee', function() {
		});


		upload_static.add_state.call(__Upload, 'file_sign_update_process', functional.throttle(function(event_param) {
			if(this.is_pre_file_sining) {
				return;
			}


			//低位大小：控件返回的是有符号的32位数值，当大于2G时会变成负数，然后向0累加，所以当负数时加4G就是实现的2G向4G累加的过程
			var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量
			if(event_param.ProcessedH) { //如果是计算大文件
				//ProcessedH 高位，单位是4G，所以乘以G4
				processlow = event_param.ProcessedH * G4 + processlow;
			}

			this.file_sign_update_process = processlow;

		}), 1000);


		upload_static.add_state.call(__Upload, 'file_sign_done', function(e_param) {
			this._state_log.msg.push('file_sign_done');
			if(this.file_sign_done_flag === true) {    //如果已经回调过扫描完成
				return;
			}
			if(!this.get_cache()[ this.local_id ]) {//已经被删除
				return;
			}

			this.file_sign_done_flag = true;
			//增加CRC32的值
			var crc32 = '';
			try {
				crc32 = e_param.CRC32Value;
			}
			catch(e) {
			}
			;

			//存起来，重新上传时不需要再file_sign
			this.file_md5 = e_param.Md5;
			this.file_sha = e_param.SHA;

			var data = this.get_upload_param.call(this, e_param.Md5, e_param.SHA, crc32),
				__self = this;
			if(this._srv_rsp_body) {
				this.change_state('start_upload', this._srv_rsp_body, data);
				// yuyanghe 2014-1-13 加入数据上报
				stat_log.upload_stat_report_41(this, get_plugin_version(), 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');

				return;
			}

			if(this._is_request_upload) {//正在预扫描
				this.is_pre_file_sining = false;
				return;
			}

			this._is_request_upload = true;
			this.request_upload(data, function(rsp_body, data) {

				__self._is_request_upload = false;
				if(__self.is_pre_file_sining) {
					__self._srv_rsp_body = rsp_body;
					__self.is_pre_file_sining = false;
					return;
				}
				__self.change_state('start_upload', rsp_body, data);
				// yuyanghe 2014-1-13 加入数据上报
				stat_log.upload_stat_report_41(__self, get_plugin_version(), 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');

			});
		});


		upload_static.add_state.call(__Upload, 'upload_file_update_process', functional.throttle(function(event_param) {
			/*
			 this.test_time = this.test_time - (+new Date());
			 console.debug('call start_upload by active : ',this.test_time, this.del_local_id);
			 */
			//大于4G的逻辑 todo. 跟扫描一样.
			var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量

			if(event_param.ProcessedH) { //如果是计算大文件
				//ProcessedH 高位，单位是4G，所以乘以G4
				processlow = event_param.ProcessedH * G4 + processlow;
			}
			this.processed = processlow;

			this.file_index = event_param.FileIndex;

			//如果需要自动保存进度,并且每5%的进度就保存一次
			var range = (this.processed / this.file_size * 100) % 5;
			if(this.need_auto_save_process() && (range >= 0 && range < 1)) {
				var resume_files = {'tasks': [], 'folder_tasks': [], 'down_tasks': []},
					unit = this.get_resume_param();
				if(unit) {
					resume_files.tasks.push(unit);
				}
				upload_event.trigger('set_resume_store', resume_files);
			}
		}), 1000);


		upload_static.add_state.call(__Upload, 'done', function(event_param) {
			this.end_time = +new Date();//结束时间
			var node = all_file_map.get(this.pdir);

			if(node) {
				node.set_dirty(true);    //已有更新, 重新拉取文件夹下的内容。
			}

			if(this.time) {
				this.time.clear();
			}

			if(this.is_miaoc()) {//妙传文件
				var maioc_speed = this.file_size / Math.ceil((this.end_time - this.start_time) / 1000);
				speed_task.set_maioc(maioc_speed);
			}

			this.destroy(true);
			this.plus_info('done');
			//修复bug ： 取消控件失效;
			this.minus_info('error');
			this.minus_info('pause');
			this.release_plugin();
			this.prepend_to_disk();
			this.dispatch_event();
			this.after_done();
			upload_event.trigger('upload_done', this);
			this.events.nex_task.call(this);//一个任务完成，执行下一个任务，flag为true时表示文件已完成上传，此时更新队列.
		});

		//重新上传一次，网络超时，错误码10000出现的时候替换成再来一次上传
		upload_static.add_state.call(__Upload, 're_try', function() {
			this.release_plugin();
			//console.log('auto retry...');
			this.set_retry();
			this.remove_file(true); //删除已经生成的幽灵文件
			this.file_sign_done_flag = false; //设置扫描状态为未扫描
			this.file_size = this.get_file_size(); //重新计算文件大小
			this.change_state('start');
		});

		/**
		 * 上传完成后做的一些特殊处理
		 */
		__Upload.interface('after_done', function() {
		});

		/**
		 * 是否重新来一次上传
		 */
		__Upload.interface('get_is_retry', function() {
		});

		/**
		 * 设置重新来一次上传
		 */
		__Upload.interface('set_retry', function() {
		});

		/**
		 * 删除任务
		 * @param flag: 删除远程文件
		 * @param from_all_clear: 调用者是是全部清除操作
		 */
		upload_static.add_events.call(__Upload, 'clear', function(flag, from_all_clear) {
			this.update_state_info('clear');

			this.get_queue().remove(this.del_local_id);
			if(!flag) {
				this.remove_file();
			}
			this.destroy();

			if(!from_all_clear) {   //如果状态不等于wait, 表示正在删除正在上传的文件. 此时继续下一个文件.
				if(this.old_state === 'pause' || this.old_state === 'resume_pause') {
					this.minus_info('pause');
				} else if(this.old_state === 'error') {
					this.minus_info('error');
				} else if(this.old_state === 'done') {
					this.minus_info('done');
				}
				this.when_change_state('clear');
				this.view.invoke_state('clear');
				this.events.nex_task.call(this);//删除任务后，执行一个任务
			}
		});
		/**
		 * 重试任务
		 * @param by_user true: 用户点击行为； false: 因为网络延迟，有程序自动重试;
		 */
		upload_static.add_events.call(__Upload, 're_start', function(by_user) {
			if(by_user) {
				//已失败的任务，重试任务;需要，
				// 1：将其放入正在运行数组中
				// 2：重置local_id
				// 3：更新info信息；
				this.update_state_info('re_start');
				this.set_local_id(this.local_id);
				this.get_belong_cache().push_curr_cache(this.del_local_id, this);
				this.state = 'start';
			}
			this.re_start_action();

			if(this.state === 'start') {
				//this.view.re_start(by_user);
				this.view.invoke_state('re_start');
				this.when_change_state('re_start');
			}

		});
		/**
		 * 继续下一个任务
		 */
		upload_static.add_events.call(__Upload, 'nex_task', function() {
			this.call_next_task();
		});

		return aop_wrap_log(__Upload);

	})();


	return Upload;

});define.pack("./Upload_h5_flash_class",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./view","./upload_file_validata.upload_file_validata","disk","./select_folder.photo_group"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        photo_group = require('./select_folder.photo_group');

    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (upload_plugin, id, file, attrs, folder_id) {
        this.file = file.file || file;
        this.path = file.name;
        this.endingByte=0;
        this.startingByte=0;
        this.upload_plugin = upload_plugin;
        this.local_id = id;
        this.del_local_id = id;
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.sha ="";
        this.md5 ="";
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
        this.file_name = file.name;
        this.file_size = file.size;
	    this.temporary = '';  //下线中转站  //!!attrs.temporary; //是否是中转站文件上传
        this.pdir_create_ret = attrs.pdir_create_ret; //父目录创建结果
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = true;
        this.state = null;
        this.view = null;
        this.file_sign_update_process = 0; //当前签名进度
        this.validata = Validata.create();
        this.validata.add_validata('check_video', this.file_name);//视频文件
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.upload_type = 'upload_h5_flash';
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));


    Upload.interface( 'states.file_sign_update_process', function(percent) {
        this.file_sign_update_process =  percent;
    });

    Upload.interface('states.pre_file_sign', function () {
        if(!this.is_pre_file_sining) {
            this.is_pre_file_sining = true;
            this.upload_plugin.varityFile(this);
        }
    });

    Upload.interface('states.start', function () {
        if(this.pdir_create_ret) {
            this.change_state('error', this.pdir_create_ret);
            return;
        }
        var __self = this;
        this.start_time = +new Date();
        var ret = this.superClass.states.start.apply(this, arguments);
        //获取里面的返回值，防止本地错误了，还会继续执行上传
        if(ret === false){
            return;
        }

        //之前已扫描过，中转站文件直接申请上传
        if(this.file_sha || this.file_md5) {
            global_function.get('FileUploaderCallback')(0, {
                id: this.local_id,
                sha: this.file_sha,
                md5: this.file_md5
            });
            /*this.change_state('file_sign_done', {
                Md5: this.file_md5,
                SHA: this.file_sha
            });*/
            return;
        }

        if(this.file_size === 0) {
            var data = this.get_upload_param.call(this, '','');
            data.file_sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
            data.file_md5 = 'd41d8cd98f00b204e9800998ecf8427e';
            data.upload_type = 0; //走分片上传的协议
            data.file_size = 0;
            var me = this;
            this.request_upload(data, function (rsp_body, data) {
                if(rsp_body.file_exist){
                    me.change_state('done', rsp_body, data);
                }else{
                    //空文件会秒传
                }
            });
        } else if(this.is_pre_file_sining){//已经在扫描中
            this.is_pre_file_sining = false;//转为开始状态
        }else {
            __self.upload_plugin.varityFile(__self);
        }
    });

    Upload.interface('states.start_upload', function () {
        this.upload_plugin.uploadFile(this);
        //this.change_state("upload_file_update_process",0);
        if(!this.folder_id) {
            this.don_next_task_sign();    //先禁用掉预扫描
        }
    });

    Upload.interface('states.to_continuee', function () {
        //记录任务的开始时间
        this.startTime=+new Date();
        this.start_time=+new Date();
        this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
        //做为下一个执行，准备执行
        this.get_queue().head(this, function () {
            this.get_belong_cache().push_curr_cache(this.del_local_id, this);
            this.upload_plugin.uploadFile(this);
        });
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
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
        var me = this;
        var data;
	    if(me.file_md5 && me.file_sha) {
		    data = this.get_upload_param.call(this, me.file_md5, me.file_sha);
		    this.startingByte = 0;
		    this.endingByte = 0;
		    data.upload_type = 0; //走分片上传的协议
		    data.file_size = me.file_size;
		    me.request_upload(data, function(rsp_body, data) {
			    if(rsp_body.file_exist) {
				    me.change_state('done', rsp_body, data);
			    } else {
				    me.change_state('start_upload', rsp_body, data);
			    }
		    });
	    } else {
		    me.change_state('start');
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


});define.pack("./Upload_html5_class",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./file_exif","./view","./upload_file_validata.upload_file_validata","disk","./select_folder.photo_group"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        file_object = common.get('./file.file_object'),
        file_exif = require('./file_exif'),
        View = require('./view'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        stat_log = common.get('./stat_log'),
        photo_group = require('./select_folder.photo_group');

    var M_1 = Math.pow(2, 20); //1M

    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (upload_plugin, id, file, attrs, folder_id) {
        this.file = file.file||file;
        this.upload_plugin = upload_plugin;
        this.local_id = id;
        this.del_local_id = id;
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.path = file.name;
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
        this.temporary = '';//下线中转站 //!!attrs.temporary; //是否是中转站文件上传
        this.file_name = file.name;
        this.file_size = file.size;
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        this.view = null;
        this.validata = Validata.create();
        this.validata.add_validata('check_video', this.file_name);//视频文件
        this.validata.add_validata('h5_max_size', this.file_size, M_1 * 300);
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.upload_type = 'upload_html5';
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) { //正在当前目录下，才刷新列表
            file_list.reload(false, false);
        }
    });
    /**
     * 停止上传
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            _xhr = me.xhr;
        if (_xhr) {
            _xhr.abort();
        }
    });

    Upload.interface('states.start', function () {
        if(this.pdir_create_ret) {
            this.change_state('error', this.pdir_create_ret);
            return;
        }
        var __self = this;
        this.start_time = +new Date();
        var ret = this.superClass.states.start.apply(this, arguments);
        //获取里面的返回值，防止本地错误了，还会继续执行上传
        if(ret === false){
            return;
        }
        var data = this.get_upload_param.call(this, '', ''); //flash的md5和sha为空值.
        data.upload_type = 1; //html5
        data.file_size = __self.file_size;
        if(__self.file_size === 0) {
            data.file_sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
            data.file_md5 = 'd41d8cd98f00b204e9800998ecf8427e';
        }

        if(file_object.is_image(this.file_name)) {
            file_exif.get_exif_by_file(this.file, function(obj) {
                data.ext_info = obj;
                __self.request_upload(data, function (rsp_body, data) {
                    __self.change_state('start_upload', rsp_body, data);
                    stat_log.upload_stat_report_41(__self, '-', 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');
                });
            });
        } else{
            this.request_upload(data, function (rsp_body, data) {
                __self.change_state('start_upload', rsp_body, data);
                stat_log.upload_stat_report_41(__self,'-','UPLOAD_ACTIONTYPE_ID','UPLOAD_PRE_SUBACTIONTYPE_ID','UPLOAD_PRE_THRACTIONTYPE_ID');
            });
        }

    });

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
	    this.change_state('start');
    });

    Upload.interface('states.start_upload', function () {
        var uploadFileData = {
            local_id: this.local_id,
            server_name: this.server_name,
            port: (this.server_port - 0),
            file_key: this.file_key,
            check_key: this.check_key
        };
        this.upload_plugin.uploadFile(uploadFileData, this);

    });

    Upload.interface('states.upload_file_update_process', function (processed) {
        this.processed = processed;
    });

    module.exports = Upload;


});define.pack("./aop_wrap_log",["$","lib","common","./tool.upload_static","./tool.upload_cache","./upload_route"],function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        c = lib.get('./console').namespace('upload2'),
        functional = common.get('./util.functional'),
        plugin_detect = common.get('./util.plugin_detect'),
        user_log = common.get('./user_log'),
        stat_log = common.get('./stat_log'),
        constants = common.get('./constants'),
        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        upload_route = require('./upload_route'),

        normal_code = [ //正常逻辑错误,当成功上报
            1000001, 1000002, 1000003, 1000004,1000005,1000006,1000007,1000008,1000009,1000010,1000011,1000012,1000013,
            1024,1026, 1053, 1083, 1051, 1028, 1088, 100027, 8, 16, 17, 1029, 101, 102,
            -5950, 2, 3,  //文件被选入了上传队列中，但是用户在文件还没有被扫描的时候就删除了
            -5999, 6,  //文件正在上传过程中被删除了
            32252995,   //上传过程中删除了文件所在目录
            1019,   //扫描过程中删除了上传目录，导致CGI返回了错误
            92260005,  //文件上传过程中被修改
            1016,    //新用户一进页面就上传图片到相册
            32,     //另一个程序正在使用此文件，进程无法访问
            21,      //用户传U盘中的文件，U盘不稳定，导致控件读取文件失败
            1392,     //用户文件或目录损坏，无法读取
            53, 87,   //找不到网络,网络文件不可读
            200,     //请求成功
            190040, 190049, 190067,   //UIN在黑名单中，文件在黑名单中，文件敏感词
            190072,//新疆或者国外地区受限了
            1126, //文件超过大小限制，逻辑错误
            1127, //今日文件上传量已达到上限，请明日重试
            5        //文件没有读取权限，估计是被其他程序占用
        ],
        get_plugin_version = function () { //获取控件的版本号
            if(constants.IS_APPBOX){
                if(window.external.GetVersion){
                    return 'appbox-' + window.external.GetVersion();
                }else{
                    return 'appbox';
                }
            }
            switch (upload_route.type) {
                case('active_plugin'):
                    return plugin_detect.get_ie_plugin_version();
                case('webkit_plugin'):
                    //1.0.0.4以前的版本通过plugin_detect获取不到
                    var v = plugin_detect.get_webkit_plugin_version();
                    if( v === '0'){
                        try{
                            return upload_route.upload_plugin.Version;
                        }
                        catch(e){
                            return 0;
                        }
                    }
                    return v;
                default :
                    return '-';
            }
        },



        wrap_log = function (Upload) {

            Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function () {
                if (!this.is_upload()) {
                    return;
                }
                var cache = this.get_cache(),
                    process = cache[this.local_id];

                if (!process) {    //删除上传错误的, 不上报
                    return; //这里要改;
                }
                if (process.state === 'wait') {    //还未开始上传的.
                    return user_log('DISK_UPLOAD_CANCEL'); //;
                }

                return user_log('DISK_UPLOAD_HAS_DATA_CANCEL');  //已经开始上传的.

            });

            //暂停
            Upload.getPrototype().dom_events.click_pause = functional.before(Upload.getPrototype().dom_events.click_pause, function () {
                //user_log('UPLOAD_FILE_MANAGER_PAUSE');
                this.transresult=1;
                stat_log.upload_stat_report_41(this,get_plugin_version());
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_PAUSE');
                }
                else{
                    user_log('DOWNLOAD_FILE_MANAGER_PAUSE');
                }
            });

            //重试
            Upload.getPrototype().dom_events.click_continuee = functional.after(Upload.getPrototype().dom_events.click_continuee, function () {
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_CONTINUE');
                }
            });

            //续传
            Upload.getPrototype().dom_events.click_resume_continuee = functional.after(Upload.getPrototype().dom_events.click_resume_continuee, function () {
                user_log('UPLOAD_FILE_MANAGER_RESUME');
                //记录任务的开始时间
                if(!this.is_upload()){
                    this.startTime=+new Date();
                }else{
                    this.start_time=+new Date();
                }

                this.start_file_prcessed=this.processed;//本次传输是从什么时候开始的．
            });

            //展开上传管理器
            Static.dom_events.click_to_max = functional.after(Static.dom_events.click_to_max, function () {
                user_log('UPLOAD_FILE_MANAGER_OPEN', 0);
            });

            //收拢上传管理器
            Static.dom_events.click_to_min = functional.after(Static.dom_events.click_to_min, function () {
                user_log('UPLOAD_FILE_MANAGER_CLOSE', 0);
            });

            //全部重试统计
            Static.click_re_try_all = functional.after(Static.click_re_try_all, function () {
                user_log('UPLOAD_FILE_MANAGER_ALL_RETRY', 0);
            });


            Upload.getPrototype().states.error = functional.after(Upload.getPrototype().states.error, function (error_code) {
                this.transresult=3;

                //上传文件夹，不上报
                if (this.is_upload_folder()){
                    return;
                }

                stat_log.upload_stat_report_41(this,get_plugin_version());
                if (!this.is_upload()) {
                    return;
                }
                var rpt_data = {
                    "extInt1": this.start_time ? (+new Date()) - this.start_time : 0,
                    "extInt2": this.log_code,
                    "extInt3": this.file_type,//1:文件 2:文件夹
                    "str_file_size": this.file_size + '',
                    //"app_version": get_plugin_version(), //code by 20131014 增加控件版本上报
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',//get_plugin_version(),
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name //这个字段被转化成int，所以展示不处理，需要更换
                };
                user_log(
                    this.upload_type,
                    $.inArray(this.log_code, normal_code) > -1 ? 0 : this.log_code,
                    rpt_data,
                    {"weiyun_ver": get_plugin_version()} //code by 20131014 增加控件版本上报
                );
            });

            Upload.getPrototype().states.done = functional.after(Upload.getPrototype().states.done, function (error_code) {
                this.transresult=0;
                this.processed=this.file_size;

                //上传文件夹，不上报
                if (this.is_upload_folder()){
                    return;
                }

                if (!this.is_upload()) {
                    return;
                }

                var ret,
                    is_file_exit;

                if (this.is_miaoc()) {
                    is_file_exit = true;
                }

                if (is_file_exit) {
                    ret = 30000002;
                } else if (this.pause_mode === 1) {
                    ret = 30000003;
                } else {
                    ret = 30000001;
                }

                user_log(this.upload_type, 0, {  //需要上报参数：文件后缀，耗时，文件大小，采用的上传类型，返回状态
                    "extInt1": is_file_exit ? 0 : (+new Date() - this.start_time),//秒传时间为0
                    "extInt2": ret,
                    "str_file_size": this.file_size + '',
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name, //这个字段被转化成int，所以展示不处理，需要更换
                    "subop": this.upload_type
                },{
                    "weiyun_ver": get_plugin_version() //code by 20131014 增加控件版本上报
                });


            });
            return Upload;
        };


    return function (Upload) {
        return wrap_log(Upload);
    };

});/**
 * appbox下载控件组件
 * @author trump
 * @date 13-3-1
 */
define.pack("./download.appbox",["$","lib","common","./Upload_class","./tool.upload_static","./tool.upload_cache","./view"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        console = lib.get('./console'),
        common = require('common'),

        file_type_map = common.get('./file.file_type_map'),
        functional = common.get('./util.functional'),
        download_route,

        Class = require('./Upload_class'),
        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        view = require('./view');

    require.async('download_route', function (mod) {
        download_route = mod.get('./download_route');
    });

    var Down = Class.sub(function (e) {
        var me = this;
        me.local_id = me.del_local_id = e.task_id;//任务ID
        me.file_name = e.file_name;//文件名
        me.file_id = e.file_id;//文件ID
        me.file_size = functional.try_it(function(){//文件大小
            return e.file_size - 0;
        })  || 0;
        me.is_package_size = (me.file_size <= 1 || e.is_package);//标识打包下载
        me.real_target_path = e.target_path;//下载的本地目录
        me.download_url = e.download_url;

        (function(path) {
            var paths = path.split('\\'),
                dir_name = paths[paths.length-2];
            if(dir_name === 'Desktop'){
                paths[paths.length-2] = dir_name = '桌面';
            }
            me.dir_name = dir_name;//本地的目录名
            me.target_path = paths.join('\\');//本地的目录路径
        })(e.target_path);

        me.file_thum_url = e.file_thum_url;// 待确认
        me.cover_file = e.cover_file;//是否已经下载过，做覆盖下载
        me.validata = null;
        me.percent = '0%';  //默认进度
        me.init('', '', Cache.default_down_cache_key, 'webkit_down', Static.OP_TYPES.DOWN);
        me.startTime = (+new Date());
        me.detect_down_die();
    });
    var prototype_method = {
        /**
         * 覆盖基类方法 下载不需要插入网盘
         * @returns {boolean}
         */
        prepend_to_disk: function(){
            return false;
        },
        /**
         * 覆盖基类方法 下载暂时不能重试
         * @returns {boolean}
         */
        can_re_start: function(){
            return false;
        },
        /**
         * 是否打包下载
         */
        is_package: function () {
            return this.is_package_size;
        },
        /**
         * 删除下载
         */
        remove_file: function () {
            download_route && download_route.abort_download(this.local_id);
        },
        /**
         * 获取文件类型
         */
        get_file_type: function () {
            return file_type_map.get_type_by_ext_v2(this.file_thum_url.split('-')[1]);
        },
        /**
         * 获取下载文件大小
         */
        get_file_size: function () {
            return this.file_size;
        },
        /**
         * 任务调度方法 在下载中什么也不做
         */
        call_next_task: $.noop,
        /**
         * 打开至目的地
         */
        open_to_target: function () {
            download_route && download_route.open_file_directory(this.local_id, this.real_target_path, this.file_name);
        },

        detect_down_die: function() {
            var me = this;
            this.die_detect_timer && clearTimeout(this.die_detect_timer);

            //200s还没进度响应则认为网络繁忙
            this.die_detect_timer = setTimeout(function() {
                me.change_state('error', 100);
            }, 200*1000);
        }
    };
    for(var key in prototype_method){
        Down.interface(key, prototype_method[key]);
    }

    /**
     * 暂停下载
     */
    Class.getPrototype().dom_events.click_pause = 
        functional.before(Class.getPrototype().dom_events.click_pause,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('pause:'+taskid);
                window.external.PauseDownload(taskid);
                clearInterval(this.die_detect_timer);
                //return false;
            };
        });

    /**
     * 继续下载
     */
    Class.getPrototype().dom_events.click_continuee = 
        functional.before(Class.getPrototype().dom_events.click_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                this.startTime=+new Date();
                this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
                window.external.ResumeDownload(taskid);
                this.detect_down_die();
                //return false;
            };
        });

    /**
     * 从缓存中续传
     *
    Class.getPrototype().dom_events.click_resume_continuee = 
        functional.before(Class.getPrototype().dom_events.click_resume_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('resume continuee:'+taskid);
                window.external.ResumeDownload(taskid);
                return false;
            };
        });
    */


    Down.interface('states', $.extend({}, Class.getPrototype().states));
    /**
     * 预备下载
     */
    Down.interface('states.start', $.noop);
    /**
     * 下载中
     */
    Down.interface('states.processing', function (percent, speed) {
        if(!this.is_package()){//打包下载暂时不更新进度
            this.percent = parseInt(percent);
            this.processed = ( (this.file_size * this.percent) / 100 );
        }
        this.detect_down_die();
    });
    Down.interface('states.done', functional.after(Class.getPrototype().states.done, function () {
        clearTimeout(this.die_detect_timer);
    }));

    /**
     * 获取下载参数，续传需要
     */
    Down.interface('get_resume_param', function () {
        var ret = {
            task_id: this.local_id,
            file_name: this.file_name,
            file_size: this.file_size,
            target_path: this.real_target_path,
            file_thum_url: this.file_thum_url,
            cover_file: this.cover_file
        };
        return ret;
    });

    /*
    var add_resume = function (files) { //断点续传
        //console.log('add_resume:'+files);
        if(files.length){
            view.show();
        }
        $.each(files, function () {
            var obj = this;    //转化store中读取的记录
            var e = {
                'task_id': obj.task_id,
                'file_name': obj.file_name,
                'file_size': obj.file_size,
                'target_path': obj.target_path,
                'file_thum_url': obj.file_thum_url,
                'cover_file': obj.cover_file
            };
            var down_obj = Down.getInstance(e); //生成下载对象
            functional.try_it(function () {
                down_obj.change_state('resume_pause', obj);   //状态转为续传
            });
        });

    };
    */


    return {
        /**
         * 创建下载对象
         * 下载对象默认为 状态默认为开始
         * @param e
         */
        create: function (e) {
            view.show();
            Down.getInstance(e).change_state('start');
        }
        //,add_resume: add_resume
    };
});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */

define.pack("./drag_upload_active",["lib","common","$","main"],function (require, exports, module) {

        var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        functional = common.get( './util.functional' ),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        console = lib.get('./console').namespace('drag_upload_active'),
        constants = common.get('./constants');


        var parent;
        var active_event = {
            mouse_down: false
        };
        var plugin = functional.try_it(function(){
            var plugin = new ActiveXObject("TXGYMailActiveX.ScreenCapture");
            var plugin_name = plugin.GetDLLFileName();
            var $obj;

            if ( plugin_name.indexOf("_2.dll") > -1 ){
                $obj = $( '<object classid="CLSID:B0F77C07-8507-4AB9-B130-CC882FDDC046" width=100% height=100%>' );
            }else{
                $obj = $( '<object classid="CLSID:F4BA5508-8AB7-45C1-8D0A-A1237AD82399" width=100% height=100%>' );
            }

            parent = $('<div class="ui-dnd" style="top:100px;background:#FFF;height:230px;z-index:10004">&nbsp;<a class="ui-pos-right ui-dnd-close" href="javascript:void(0)">关闭</a></div>').appendTo( $('body')).hide();

            parent.find( 'a').on( 'click', function(){
                parent.hide();
            });
            var body = document.body;
            body.onmousedown = function(){
                active_event.mouse_down = true;
            };
            body.onmouseup = function(){
                active_event.mouse_down = false;
            };
            body.ondragover = function(){
                if( active_event.mouse_down === false  && main.get_cur_mod_alias()=='disk' ){
                    parent.show();
                }
            };
            return $obj.appendTo( parent )[0];
        });


        var module = new Module( 'drag_upload_active', {

            render: function(){

                if ( !plugin ){
                    return;
                }

                plugin.text = '将文件拖拽至此区域';

                plugin.OnFilesDroped = function( type ){

                    if ( type === 'ENTER' ){
                        return plugin.text = '释放鼠标';
                    }

                    if ( type === 'LEAVE' ){
                        return plugin.text = '将文件拖拽至此区域';
                    }

                    if ( type === 'OVER' ){
                        return;
                    }

                    parent.hide();

                    var _oFiles = type.split("\r\n");
                    var _oFileList = [];
                    for (var i = 0; i < _oFiles.length; i++){
                        var _oFilePart = _oFiles[i].split(" ");
                        if (_oFilePart.length >= 2){
                            var _sFid = _oFilePart.shift(),
                            _sFileName = _oFilePart.join(" ");
                             _oFileList.push(_sFileName);
                         }
                    }
                    if(_oFileList.length){
                        upload_event.trigger( 'start_upload_from_client', _oFileList );
                        return;
                    }




                };

            }

        });


        setTimeout(function(){
            module.render();

            
        }, 1000 );


});/**
 *
 * @author unitwang
 * @date
 */
define.pack("./drag_upload_html5",["lib","common","$","disk","./upload_file_validata.upload_file_validata","./upload_route","./view","./Upload_class","./tool.upload_cache","./upload_folder.upload_folder_h5_start","main","./upload_html5_pro_class","./upload_html5_pro","./Upload_html5_class","./upload_html5"],function(require, exports, module) {

	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),

		c = lib.get('./console').namespace('upload'),
		random = lib.get('./random'),
		collections = lib.get('./collections'),

		functional = common.get('./util.functional'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),
		constants = common.get('./constants'),
	//upload_event = common.get('./global.global_event').namespace('upload2'),
		ret_msgs = common.get('./ret_msgs'),
		session_event = common.get('./global.global_event').namespace('session'),
		global_function = common.get('./global.global_function'),
		global_variable = common.get('./global.global_variable'),
		https_tool = common.get('./util.https_tool'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		user_log = common.get('./user_log'),
		urls = common.get('./urls'),

	//upload = require('upload'),
		disk_mod = require('disk'),
		disk = disk_mod.get('./disk'),
		file_list = disk_mod.get('./file_list.file_list'),

		Validata = require('./upload_file_validata.upload_file_validata'),
		upload_route = require('./upload_route'),
		View = require('./view'),
		Upload_class = require('./Upload_class'),
		upload_cache = require('./tool.upload_cache'),
		upload_folder_h5_start = require('./upload_folder.upload_folder_h5_start'),
		main_mod = require('main'),
		main = main_mod.get('./main'),
		upload_dom = main_mod.get('./ui').get_$uploader(),
		M = Math.pow(2, 20), //1M
		COUNT_TO_REFRESH,    //记录一次拖拽的文件数，上传结束后刷新file_list
		COUNT_DONE = 0;

	var query = urls.parse_params(),
		cur_uin = query_user.get_uin_num(),
		user = query_user.get_cached_user() || {},
		isvip = user.is_weiyun_vip && user.is_weiyun_vip();

	var html_xml_http = {
		_xhr: null,
		_get: function() {
			var me = this;
			if(!me._xhr) {
				me._xhr = new XMLHttpRequest();
			}
			return me._xhr;
		},
		get: function(id) {
			var me = this;
			me.abort();
			me._get().open('post', https_tool.translate_cgi('http://diffsync.cgi.weiyun.com'), true);
			//me._get().open('post', 'http://wfup.cgi.weiyun.com/', true);
			me._get().local_id = id;
			return me._xhr;
		},
		abort: function() {
			this._get().abort();
		}
	};

	// 任务结束且有已成功上传的文件。刷新file_list
	var refresh_check = function() {
		if(COUNT_DONE > 0 && COUNT_TO_REFRESH === 0) {
			file_list.reload(false, false);
			COUNT_DONE = 0;
		}
	};
	document.domain = 'weiyun.com';


	var Upload = Upload_class.sub(function(file, upload_plugin, path, size, ppdir, pdir, skey, ppdir_name, pdir_name) {
		this.file = file;
		this.upload_plugin = upload_plugin;
		this.local_id = random.random();
		this.del_local_id = this.local_id;
		this.path = path;
		this.file_size = size;
		this.ppdir = ppdir; //上传到指定的目录父级目录ID
		this.pdir = pdir;   //上传到指定的目录ID

		this.ppdir_name = ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = pdir_name; //上传到指定的目录的名称

		this.skey = skey;
		this.file_name = this.get_file_name();  //文件名;
		this.processed = 0;
		this.code = null;
		this.log_code = 0;
		this.can_pause = false;
		this.state = null;
		//(this.validata = Validata.create()).add_validata('empty_file', this.file_size);  //空文件验证
		this.validata = Validata.create();
		this.validata.add_validata('empty_file', this.file_size);  //空文件验证
		this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
		this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
		this.validata.add_validata('check_video', this.file_name);//视频文件
		this.time = this.get_timeout(480000); //超时
		this.init();
	});

	Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

	Upload.interface('get_timeout', function(__time) {
		var t,
			__self = this,
			timeout = function() {
				t = setTimeout(function() {
					__self.change_state('error', 10002);//表单超时，激活错误状态
				}, __time);
			},
			clear = function() {
				clearTimeout(t);
			};
		return {
			timeout: timeout,
			clear: clear
		};
	});
	/** 1029
	 * 不能重试
	 */
	Upload.interface('can_re_start', function() {
		return false;
	});
	Upload.interface('states.done', function() {
		COUNT_DONE++;
		html_xml_http.abort();
		this.superClass.states.done.apply(this, arguments);
		//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
		if(disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) {
			file_list.reload(false, false);
			COUNT_DONE = 0;
		}
	});

	Upload.getPrototype().dom_events.click_cancel = functional.after(Upload.getPrototype().dom_events.click_cancel, function() {
		if(this.state === 'wait') {
			COUNT_TO_REFRESH--;
		}
		html_xml_http.abort();
		refresh_check();
	});


	Upload.interface('states.error', function() {
		html_xml_http.abort();
		this.superClass.states.error.apply(this, arguments);
		refresh_check();
	});


	Upload.interface('states.start', function() {
		COUNT_TO_REFRESH--;
		this.start_time = +new Date();
		if(false === this.superClass.states.start.apply(this, arguments)) {
			return;
		}

		var file = this.file;
		/*if(file.size > 30 * M) {
			upload_cache.get_task(this.local_id).change_state('error', 1000001);
			return;
		}*/

		this.time.timeout(this.time);
		var xhr = html_xml_http.get(this.local_id),
			formData = new FormData();
		formData.append('file', file);
		formData.append('name', 'web');
		formData.append('ppdir', this.ppdir);
		formData.append('pdir', this.pdir);
		formData.append('skey', this.skey);
		formData.append('random', (+new Date()));
		xhr.send(formData);
		xhr.onreadystatechange = function() {
			var me = this;//xhr对象
			if(me.readyState == 4) {
				var reg_exp = /\d+/,
					ret = me.responseText.match(reg_exp),
					task = upload_cache.get_task(me.local_id);
				if(!ret) {
					return;
				}
				ret = ret[0];
				if(ret === '0') {
					task.change_state('done');

				} else {
					task.change_state('error', ret);
					if(ret === ret_msgs.INVALID_SESSION) {//会话过期，登陆框弹出显示。(其它上传在Upload_class.js request_upload方法中rqeuest请求配置cavil参数即可) by hibinchen
						session_event.trigger('session_timeout');
					}
				}
			}
		};
	});

	var stop_prop_default = function(e) {//阻止默认行为和冒泡
		e.preventDefault();
		e.stopImmediatePropagation();
	};
	var h5_event = {
		mouse_down: false
	};
	(function() {

		//修改dropbox提示内容及相关判断
//        var dropbox_title_change = function (child_node, title) {
//            var text_node = collections.first(child_node, function (el) {
//                return el.nodeType === 3;
//            });
//            if (text_node.data !== '') {
//                text_node.data = title;
//            }
//        }


		var $dropbox = $('<div class="ui-dnd" style="position:fixed;z-index:9999;background-color: rgb(249, 245, 245);opacity: 0.2;border: 5px solid;border-style: dashed;top: 0px;left: 0px;"><div style="top:50%;left:50%;margin-left:-50px;margin-top:-50px;font-size:24px;opacity:1;position:absolute;">文件拖放到此处</div></div>').appendTo($('body')).hide();
		var dropbox = $dropbox[0];
		document.addEventListener('mousedown', function() {
			h5_event.mouse_down = true;
		});
		document.addEventListener('mouseup', function() {
			h5_event.mouse_down = false;
		});
		document.addEventListener("dragenter", function(e) {
			if(h5_event.mouse_down) {
				return;
			}
			stop_prop_default(e);
			if(main.get_cur_mod_alias() == 'disk' && main.get_cur_nav_mod_alias() !== 'offline' && !file_list.get_cur_node().is_offline_dir()) {
				$dropbox.show();
			}
		}, false);


		dropbox.addEventListener("dragenter", function(e) {
			stop_prop_default(e);
		});

		dropbox.addEventListener("dragover", function(e) {
			stop_prop_default(e);
		});

		dropbox.addEventListener("dragleave", function(e) {
			stop_prop_default(e);
			$dropbox.hide();
		});

		dropbox.addEventListener("drop", function(e) {
			stop_prop_default(e);
			user_log('UPLOAD_BY_DRAG');
			global_variable.set('upload_file_type', 'normal');//拖拽先只支持普通上传到目录吧，中转站先不支持
			var rawFiles = $.makeArray(e.dataTransfer.files),
				items = $.makeArray(e.dataTransfer.items),
				files = [],
				dirEntries = [];
			if(!rawFiles.length) {
				$dropbox.hide();
				return;
			}
			// 判断拖拽文件中是否包含文件夹（不支持文件夹上传）
			for(var i = 0; i < rawFiles.length; i++) {
				try {
					//var _file = items[i].webkitGetAsEntry();
					if(items[i].webkitGetAsEntry) {
						var _file = items[i].webkitGetAsEntry();
					}
					else if(items[i].getAsEntry) {
						var _file = items[i].getAsEntry();
					}
				}
				catch(e) {
				}

				if(_file && _file.isDirectory) {
					//$dropbox.hide();
					//common.get('./ui.widgets').confirm('提示', "暂不支持文件夹拖拽上传！", '', $.noop, null, ['确定']);
					//return;
					//drop_upload_folder.upload(_file);
					//$dropbox.hide();
					dirEntries.push(_file);
				} else {
					files.push(rawFiles[i]);
				}
			}
			$dropbox.hide();

			if(dirEntries.length) {
				upload_folder_h5_start.upload(dirEntries, !!files.length);
			}

			if(!files.length) {//下面代码是上传文件的，没有文件就不用执行了
				return;
			}
			var node = file_list.get_cur_node();
			if(node && node.is_vir_dir()) {
				node = file_list.get_root_node();
			}
			var pdir = node.get_id();
			var ppdir = node.get_parent().get_id();
			var pdir_name = node.get_name();
			var ppdir_name = node.get_parent().get_name();
			View.showManageNum();
			//队列，顺序执行传入的数组
			var len = COUNT_TO_REFRESH = files.length;
			functional.burst(files, function(file) {
				len--;
				var upload_obj;
				var attrs = {
					ppdir_name: ppdir_name,
					pdir_name: pdir_name,
					ppdir: ppdir,
					pdir: pdir
				};

				if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
					//iscowei 优先使用html5极速上传
					upload_obj = require('./upload_html5_pro_class').getInstance(require("./upload_html5_pro"), random.random(), file, attrs);
					upload_obj.upload_type = 'upload_html5_pro';
				} else if(!$.browser.mozilla && !constants.IS_HTTPS) { //https暂不支持纯h5上传
					upload_obj = require('./Upload_html5_class').getInstance(require("./upload_html5"), random.random(), file, attrs);
					upload_obj.upload_type = 'upload_html5';
				} else {
					upload_obj = Upload.getInstance(file, upload_route.upload_plugin, file.name, file.size, ppdir, pdir, query_user.get_skey(), ppdir_name, pdir_name);
					upload_obj.upload_type = 'upload_form';
				}
				upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
				if(len === 0) {
					upload_obj.events.nex_task.call(upload_obj);
					upload_event.trigger('drag_upload_files_ready');
				}
			}, 8).start();
		});

		c.log('drag env ok');

	})();

	module.exports = Upload;


});
define.pack("./event",["$","./upload_route","./tool.upload_cache","lib","common","main","./tool.upload_static"],function(require, exports, module) {
	var $ = require('$'),
		upload_route = require('./upload_route'),
		upload_cache = require('./tool.upload_cache'),
		console = require('lib').get('./console'),
		common = require('common'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		functional = common.get('./util.functional'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		global_event = common.get('./global.global_event'),
		main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		$content = main_ui.get_$main_content(),
		view,
		Static = require('./tool.upload_static'),
		stop_prop_default = function(e) {//阻止默认行为和冒泡
			e.preventDefault();
			e.stopImmediatePropagation();
		};

	var dom_event = {
		init: function() {//上传管理器 事件初始化
			view = this;

			view.clear_process.on('click', function(e) {//全部清除
				stop_prop_default(e);
				Static.dom_events.click_clear_process(true);
			});

			view.clear_complete.on('click', function(e) {//全部清除
				stop_prop_default(e);
				Static.dom_events.click_clear_complete(true);
			});

			view.process_files.add(view.complete_files).on('click', '[data-upload=click_event]', function(e) {//删除、暂停、继续上传
				stop_prop_default(e);
				var $elm = $(e.target),
					upload_obj = view.get_task($elm.closest('.j-upload-item').data('vid')),
					action = $elm.closest('.j-upload-oper').data('action') || $elm.data('action');
				view.before_hander_click(action);

				// 解决秒传请求已经发出，但是用户取消本文件上传的场景下，统计显示有问题的情况 s
				if (action === 'click_cancel') {
					//	建立删除状态map
					if (!view.close_status_map) {
						view.close_status_map = [upload_obj];
					} else {
						view.close_status_map.push(upload_obj);
					}
				}
				// e

				if(upload_obj && upload_obj.dom_events && upload_obj.dom_events[ action ]) {
					upload_obj.dom_events[ action ].call(upload_obj);
				}
				view.after_hander_click(action);
			}).on('click', '.j-upload-path', function(e) {//打开指定目录
				stop_prop_default(e);
				main_ui.get_$body_hd().show();
				view.get_task($(e.target).closest('.j-upload-item').data('vid'))
					.open_to_target();
				view.min();//最小化上传管理器
			}).on('click', '[data-action=folder-errors]', function(e) {
				var $target = $(e.target),
					errors = view.get_task($target.closest('.j-upload-item').data('vid'))
						.get_translated_errors();
				// 当用时已经超过1秒时，不再使用性能低下的精确缩略名
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
			 * 监听面板容器的滚动事件
			 */
			$content.off('scroll.upload').on('scroll.upload', function() {
				if(view.is_show()) {
					view.on_box_change_scroll();
				}
			});

			/**
			 * 最大最小化切换
			 */
			view.manage_toggle.click(function() {
				if(view.is_show()) {
					view.hide();
				} else {
					view.show();
				}
			});
			/**
			 * 失败列表 添加到管理器底部，重新上传
			 */
			view.process_files.on('click', 'a', function(e) {
				var action = $(e.target).attr('action');
				if(action) {
					stop_prop_default(e);
					Static[$(e.target).attr('action')]();
				}
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
             * 开通会员，跳转会员中心 - 上传容量受限
             */
            view.capacity_vip.on('click', function(e) {
                stop_prop_default(e);
                var cur_user = query_user.get_cached_user() || {},
                    is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
                    from = is_weixin_user? 1028 : 1027;
                window.pvClickSend && window.pvClickSend('weiyun.capacity.vip.click');
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
});define.pack("./exif",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        //Module = common.get('./module'),
        console = lib.get('./console'),

        debug = false,
        undefined;

    var BinaryFile = function(strData, iDataOffset, iDataLength) {
        var data = strData;
        var dataOffset = iDataOffset || 0;
        var dataLength = 0;

        this.getRawData = function() {
            return data;
        };

        if (typeof strData == "string") {
            dataLength = iDataLength || data.length;

            this.getByteAt = function(iOffset) {
                return data.charCodeAt(iOffset + dataOffset) & 0xFF;
            };
        } else if (typeof strData == "unknown") {
            dataLength = iDataLength || IEBinary_getLength(data);

            this.getByteAt = function(iOffset) {
                return IEBinary_getByteAt(data, iOffset + dataOffset);
            };
        }

        this.getLength = function() {
            return dataLength;
        };

        this.getSByteAt = function(iOffset) {
            var iByte = this.getByteAt(iOffset);
            if (iByte > 127)
                return iByte - 256;
            else
                return iByte;
        };

        this.getShortAt = function(iOffset, bBigEndian) {
            var iShort = bBigEndian ?
            (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
            if (iShort < 0) iShort += 65536;
            return iShort;
        };
        this.getSShortAt = function(iOffset, bBigEndian) {
            var iUShort = this.getShortAt(iOffset, bBigEndian);
            if (iUShort > 32767)
                return iUShort - 65536;
            else
                return iUShort;
        };
        this.getLongAt = function(iOffset, bBigEndian) {
            var iByte1 = this.getByteAt(iOffset),
                iByte2 = this.getByteAt(iOffset + 1),
                iByte3 = this.getByteAt(iOffset + 2),
                iByte4 = this.getByteAt(iOffset + 3);

            var iLong = bBigEndian ?
            (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
            if (iLong < 0) iLong += 4294967296;
            return iLong;
        };
        this.getSLongAt = function(iOffset, bBigEndian) {
            var iULong = this.getLongAt(iOffset, bBigEndian);
            if (iULong > 2147483647)
                return iULong - 4294967296;
            else
                return iULong;
        };
        this.getStringAt = function(iOffset, iLength) {
            var aStr = [];
            for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
                aStr[j] = String.fromCharCode(this.getByteAt(i));
            }
            return aStr.join("");
        };

        this.getCharAt = function(iOffset) {
            return String.fromCharCode(this.getByteAt(iOffset));
        };
        this.toBase64 = function() {
            return window.btoa(data);
        };
        this.fromBase64 = function(strBase64) {
            data = window.atob(strBase64);
        };
    };


    var BinaryAjax = function() {

        function createRequest() {
            var oHTTP = null;
            if (window.XMLHttpRequest) {
                oHTTP = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return oHTTP;
        }

        function getHead(strURL, fncCallback, fncError) {
            var oHTTP = createRequest();
            if (oHTTP) {
                if (fncCallback) {
                    if (typeof(oHTTP.onload) != "undefined") {
                        oHTTP.onload = function() {
                            if (oHTTP.status == "200") {
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        };
                    } else {
                        oHTTP.onreadystatechange = function() {
                            if (oHTTP.readyState == 4) {
                                if (oHTTP.status == "200") {
                                    fncCallback(this);
                                } else {
                                    if (fncError) fncError();
                                }
                                oHTTP = null;
                            }
                        };
                    }
                }
                oHTTP.open("HEAD", strURL, true);
                oHTTP.send(null);
            } else {
                if (fncError) fncError();
            }
        }

        function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
            var oHTTP = createRequest();
            if (oHTTP) {

                var iDataOffset = 0;
                if (aRange && !bAcceptRanges) {
                    iDataOffset = aRange[0];
                }
                var iDataLen = 0;
                if (aRange) {
                    iDataLen = aRange[1]-aRange[0]+1;
                }

                if (fncCallback) {
                    if (typeof(oHTTP.onload) != "undefined") {
                        oHTTP.onload = function() {

                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                this.binaryResponse = new BinaryFile(this.responseText, iDataOffset, iDataLen);
                                this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        };
                    } else {
                        oHTTP.onreadystatechange = function() {
                            if (oHTTP.readyState == 4) {
                                if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                    this.binaryResponse = new BinaryFile(oHTTP.responseBody, iDataOffset, iDataLen);
                                    this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                                    fncCallback(this);
                                } else {
                                    if (fncError) fncError();
                                }
                                oHTTP = null;
                            }
                        };
                    }
                }
                oHTTP.open("GET", strURL, true);

                if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

                if (aRange && bAcceptRanges) {
                    oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
                }

                oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

                oHTTP.send(null);
            } else {
                if (fncError) fncError();
            }
        }

        return function(strURL, fncCallback, fncError, aRange) {

            if (aRange) {
                getHead(
                    strURL,
                    function(oHTTP) {
                        var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"),10);
                        var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

                        var iStart, iEnd;
                        iStart = aRange[0];
                        if (aRange[0] < 0)
                            iStart += iLength;
                        iEnd = iStart + aRange[1] - 1;

                        sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
                    }
                );

            } else {
                sendRequest(strURL, fncCallback, fncError);
            }
        };

    };

    //所需要的tag列表，取前面的索引值
    var needTags = [1, 2, 3, 4, 306, 34665, 34853, 40962, 40963, 36867, 36868];

    var exif = {};//new Module('exif', { //function (obj) {//
        //if (obj instanceof exif) return obj;
        //if (!(this instanceof exif)) return new exif(obj);
        //this.EXIFwrapped = obj;
        //exif: {}
  //  });

    exif.Tags = {

        //// version tags
        //0x9000 : "ExifVersion",         // EXIF version
        //0xA000 : "FlashpixVersion",     // Flashpix format version
        //
        //// colorspace tags
        //0xA001 : "ColorSpace",          // Color space information tag
        //
        //// image configuration
        0xA002 : "PixelXDimension",     // Valid width of meaningful image
        0xA003 : "PixelYDimension",     // Valid height of meaningful image
        //0x9101 : "ComponentsConfiguration", // Information about channels
        //0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel
        //
        //// user information
        //0x927C : "MakerNote",           // Any desired information written by the manufacturer
        //0x9286 : "UserComment",         // Comments by user
        //
        //// related file
        //0xA004 : "RelatedSoundFile",        // Name of related sound file
        //
        //// date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized"       // Date and time when the image was stored digitally
        //0x9290 : "SubsecTime",          // Fractions of seconds for DateTime
        //0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        //0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized
        //
        //// picture-taking conditions
        //0x829A : "ExposureTime",        // Exposure time (in seconds)
        //0x829D : "FNumber",         // F number
        //0x8822 : "ExposureProgram",     // Exposure program
        //0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        //0x8827 : "ISOSpeedRatings",     // ISO speed rating
        //0x8828 : "OECF",            // Optoelectric conversion factor
        //0x9201 : "ShutterSpeedValue",       // Shutter speed
        //0x9202 : "ApertureValue",       // Lens aperture
        //0x9203 : "BrightnessValue",     // Value of brightness
        //0x9204 : "ExposureBias",        // Exposure bias
        //0x9205 : "MaxApertureValue",        // Smallest F number of lens
        //0x9206 : "SubjectDistance",     // Distance to subject in meters
        //0x9207 : "MeteringMode",        // Metering mode
        //0x9208 : "LightSource",         // Kind of light source
        //0x9209 : "Flash",           // Flash status
        //0x9214 : "SubjectArea",         // Location and area of main subject
        //0x920A : "FocalLength",         // Focal length of the lens in mm
        //0xA20B : "FlashEnergy",         // Strobe energy in BCPS
        //0xA20C : "SpatialFrequencyResponse",    //
        //0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        //0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        //0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        //0xA214 : "SubjectLocation",     // Location of subject in image
        //0xA215 : "ExposureIndex",       // Exposure index selected on camera
        //0xA217 : "SensingMethod",       // Image sensor type
        //0xA300 : "FileSource",          // Image source (3 == DSC)
        //0xA301 : "SceneType",           // Scene type (1 == directly photographed)
        //0xA302 : "CFAPattern",          // Color filter array geometric pattern
        //0xA401 : "CustomRendered",      // Special processing
        //0xA402 : "ExposureMode",        // Exposure mode
        //0xA403 : "WhiteBalance",        // 1 = auto white balance, 2 = manual
        //0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        //0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        //0xA406 : "SceneCaptureType",        // Type of scene
        //0xA407 : "GainControl",         // Degree of overall image gain adjustment
        //0xA408 : "Contrast",            // Direction of contrast processing applied by camera
        //0xA409 : "Saturation",          // Direction of saturation processing applied by camera
        //0xA40A : "Sharpness",           // Direction of sharpness processing applied by camera
        //0xA40B : "DeviceSettingDescription",    //
        //0xA40C : "SubjectDistanceRange",    // Distance to subject
        //
        //// other tags
        //0xA005 : "InteroperabilityIFDPointer",
        //0xA420 : "ImageUniqueID"        // Identifier assigned uniquely to each image
    };

    exif.TiffTags = {
        //0x0100 : "ImageWidth",
        //0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        //0xA005 : "InteroperabilityIFDPointer",
        //0x0102 : "BitsPerSample",
        //0x0103 : "Compression",
        //0x0106 : "PhotometricInterpretation",
        //0x0112 : "Orientation",
        //0x0115 : "SamplesPerPixel",
        //0x011C : "PlanarConfiguration",
        //0x0212 : "YCbCrSubSampling",
        //0x0213 : "YCbCrPositioning",
        //0x011A : "XResolution",
        //0x011B : "YResolution",
        //0x0128 : "ResolutionUnit",
        //0x0111 : "StripOffsets",
        //0x0116 : "RowsPerStrip",
        //0x0117 : "StripByteCounts",
        //0x0201 : "JPEGInterchangeFormat",
        //0x0202 : "JPEGInterchangeFormatLength",
        //0x012D : "TransferFunction",
        //0x013E : "WhitePoint",
        //0x013F : "PrimaryChromaticities",
        //0x0211 : "YCbCrCoefficients",
        //0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime"
        //0x010E : "ImageDescription",
        //0x010F : "Make",
        //0x0110 : "Model",
        //0x0131 : "Software",
        //0x013B : "Artist",
        //0x8298 : "Copyright"
    };

    exif.GPSTags = {
        //0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude"
        //0x0005 : "GPSAltitudeRef",
        //0x0006 : "GPSAltitude",
        //0x0007 : "GPSTimeStamp",
        //0x0008 : "GPSSatellites",
        //0x0009 : "GPSStatus",
        //0x000A : "GPSMeasureMode",
        //0x000B : "GPSDOP",
        //0x000C : "GPSSpeedRef",
        //0x000D : "GPSSpeed",
        //0x000E : "GPSTrackRef",
        //0x000F : "GPSTrack",
        //0x0010 : "GPSImgDirectionRef",
        //0x0011 : "GPSImgDirection",
        //0x0012 : "GPSMapDatum",
        //0x0013 : "GPSDestLatitudeRef",
        //0x0014 : "GPSDestLatitude",
        //0x0015 : "GPSDestLongitudeRef",
        //0x0016 : "GPSDestLongitude",
        //0x0017 : "GPSDestBearingRef",
        //0x0018 : "GPSDestBearing",
        //0x0019 : "GPSDestDistanceRef",
        //0x001A : "GPSDestDistance",
        //0x001B : "GPSProcessingMethod",
        //0x001C : "GPSAreaInformation",
        //0x001D : "GPSDateStamp",
        //0x001E : "GPSDifferential"
    };

    exif.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(oElement, strEvent, fncHandler)
    {
        if (oElement.addEventListener) {
            oElement.addEventListener(strEvent, fncHandler, false);
        } else if (oElement.attachEvent) {
            oElement.attachEvent("on" + strEvent, fncHandler);
        }
    }


    function imageHasData(oImg)
    {
        return !!(oImg.exifdata);
    }

    function getImageData(oImg, fncCallback)
    {
        BinaryAjax(
            oImg.src,
            function(oHTTP) {
                var oEXIF = findEXIFinJPEG(oHTTP.binaryResponse);
                oImg.exifdata = oEXIF || {};
                if (fncCallback) fncCallback();
            }
        );
    }

    function findEXIFinJPEG(oFile) {
        var aMarkers = [];

        if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
            return false; // not a valid jpeg
        }

        var iOffset = 2;
        var iLength = oFile.getLength();
        while (iOffset < iLength) {
            if (oFile.getByteAt(iOffset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
                return false; // not a valid marker, something is wrong
            }

            var iMarker = oFile.getByteAt(iOffset+1);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (iMarker == 22400) {
                if (debug) console.log("Found 0xFFE1 marker");
                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);
                // iOffset += 2 + oFile.getShortAt(iOffset+2, true);
                // WTF?

            } else if (iMarker == 225) {
                // 0xE1 = Application-specific 1 (for EXIF)
                if (debug) console.log("Found 0xFFE1 marker");
                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);

            } else {
                iOffset += 2 + oFile.getShortAt(iOffset+2, true);
            }

        }

    }


    function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd)
    {
        var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
        var oTags = {};
        for (var i=0;i<iEntries;i++) {
            var iEntryOffset = iDirStart + i*12 + 2;
            //console.log("now index: " + oFile.getShortAt(iEntryOffset, bBigEnd));
            var index = oFile.getShortAt(iEntryOffset, bBigEnd);
            if(needTags.indexOf(index) != -1) {
                var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
                if (!strTag && debug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
                //console.log('tag:' + oFile.getShortAt(iEntryOffset, bBigEnd) +':'+ readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd))
                oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
            }
        }
        return oTags;
    }


    function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd)
    {
        var iType = oFile.getShortAt(iEntryOffset+2, bBigEnd);
        var iNumValues = oFile.getLongAt(iEntryOffset+4, bBigEnd);
        var iValueOffset = oFile.getLongAt(iEntryOffset+8, bBigEnd) + iTIFFStart;

        switch (iType) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (iNumValues == 1) {
                    return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var iValOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getByteAt(iValOffset + n);
                    }
                    return aVals;
                }
                break;

            case 2: // ascii, 8-bit byte
                var iStringOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
                return oFile.getStringAt(iStringOffset, iNumValues-1);
            // break;

            case 3: // short, 16 bit int
                if (iNumValues == 1) {
                    return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var iValOffset = iNumValues > 2 ? iValueOffset : (iEntryOffset + 8);
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getShortAt(iValOffset + 2*n, bBigEnd);
                    }
                    return aVals;
                }
            // break;

            case 4: // long, 32 bit int
                if (iNumValues == 1) {
                    return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getLongAt(iValueOffset + 4*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 5: // rational = two long values, first is numerator, second is denominator
                if (iNumValues == 1) {
                    return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset+4, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getLongAt(iValueOffset+4 + 8*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 9: // slong, 32 bit signed int
                if (iNumValues == 1) {
                    return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getSLongAt(iValueOffset + 4*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (iNumValues == 1) {
                    return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset+4, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getSLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getSLongAt(iValueOffset+4 + 8*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
        }
    }


    function readEXIFData(oFile, iStart, iLength)
    {
        if (oFile.getStringAt(iStart, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
            return false;
        }

        var bBigEnd;

        var iTIFFOffset = iStart + 6;

        // test for TIFF validity and endianness
        if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
            bBigEnd = false;
        } else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
            bBigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (oFile.getShortAt(iTIFFOffset+2, bBigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        if (oFile.getLongAt(iTIFFOffset+4, bBigEnd) != 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset+4, bBigEnd));
            return false;
        }

        var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset+8, exif.TiffTags, bBigEnd);

        if (oTags.ExifIFDPointer) {
            var oEXIFTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.ExifIFDPointer, exif.Tags, bBigEnd);
            for (var strTag in oEXIFTags) {
                switch (strTag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        oEXIFTags[strTag] = exif.StringValues[strTag][oEXIFTags[strTag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        oEXIFTags[strTag] = String.fromCharCode(oEXIFTags[strTag][0], oEXIFTags[strTag][1], oEXIFTags[strTag][2], oEXIFTags[strTag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        oEXIFTags[strTag] =
                            exif.StringValues.Components[oEXIFTags[strTag][0]]
                            + exif.StringValues.Components[oEXIFTags[strTag][1]]
                            + exif.StringValues.Components[oEXIFTags[strTag][2]]
                            + exif.StringValues.Components[oEXIFTags[strTag][3]];
                        break;
                }
                oTags[strTag] = oEXIFTags[strTag];
            }
        }

        if (oTags.GPSInfoIFDPointer) {
            var oGPSTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.GPSInfoIFDPointer, exif.GPSTags, bBigEnd);
            for (var strTag in oGPSTags) {
                switch (strTag) {
                    case "GPSVersionID" :
                        oGPSTags[strTag] = oGPSTags[strTag][0]
                            + "." + oGPSTags[strTag][1]
                            + "." + oGPSTags[strTag][2]
                            + "." + oGPSTags[strTag][3];
                        break;
                }
                oTags[strTag] = oGPSTags[strTag];
            }
        }

        return oTags;
    }


    exif.getData = function(oImg, fncCallback)
    {
        if (!oImg.complete) return false;
        if (!imageHasData(oImg)) {
            getImageData(oImg, fncCallback);
        } else {
            if (fncCallback) fncCallback();
        }
        return true;
    };

    exif.getTag = function(oImg, strTag)
    {
        if (!imageHasData(oImg)) return;
        return oImg.exifdata[strTag];
    };

    exif.getAllTags = function(oImg)
    {
        if (!imageHasData(oImg)) return {};
        var oData = oImg.exifdata;
        var oAllTags = {};
        for (var a in oData) {
            if (oData.hasOwnProperty(a)) {
                oAllTags[a] = oData[a];
            }
        }
        return oAllTags;
    };

    exif.pretty = function(oImg)
    {
        if (!imageHasData(oImg)) return "";
        var oData = oImg.exifdata;
        var strPretty = "";
        for (var a in oData) {
            if (oData.hasOwnProperty(a)) {
                if (typeof oData[a] == "object") {
                    strPretty += a + " : [" + oData[a].length + " values]\r\n";
                } else {
                    strPretty += a + " : " + oData[a] + "\r\n";
                }
            }
        }
        return strPretty;
    };

    exif.readFromBinaryFile = function(oFile) {
        return findEXIFinJPEG(oFile);
    };

    var getFilePart = function(file) {
        if (file.slice) {
            filePart = file.slice(0, 131072);
        } else if (file.webkitSlice) {
            filePart = file.webkitSlice(0, 131072);
        } else if (file.mozSlice) {
            filePart = file.mozSlice(0, 131072);
        } else {
            filePart = file;
        }

        return filePart;
    };

    exif.fileExif = function(id, file, callback) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var content = event.target.result;
            var binaryResponse = new BinaryFile(content);

            callback(id, exif.readFromBinaryFile(binaryResponse));
        };
        reader.onerror = function(event) {
            callback(null);
        };

	    if(reader.readAsBinaryString) {
		    reader.readAsBinaryString(getFilePart(file));
	    } else {
		    callback(null);
	    }
    };

    exif.fileExif = function(file, callback) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var content = event.target.result;
            var binaryResponse = new BinaryFile(content);

            callback(exif.readFromBinaryFile(binaryResponse));
        };
        reader.onerror = function(event) {
            callback(null);
        };

	    if(reader.readAsBinaryString) {
		    reader.readAsBinaryString(getFilePart(file));
	    } else {
		    callback(null);
	    }
    };

    return exif;
});


define.pack("./file_exif",["lib","common","$","./exif"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        Module = common.get('./module'),

        exif = require('./exif'),

        undefined;

    var file_exif = new Module('file_exif', {
        take_time: 0,

	    get_exif_by_file: function(file, callback) {
		    this.take_time = file['lastModified'];
		    var me = this;
		    exif.fileExif(file, function(exif_obj) {
			    var exif_info;
			    if(exif_obj) {
				    exif_info = me.get_exif(exif_obj);
				    if(!exif_info.take_time) {
					    exif_info.take_time = me.take_time;
				    }
			    } else{
				    exif_info = me.get_default_exif();
			    }
			    callback(exif_info);
		    });
	    },
        get_default_exif: function() {
            var default_exif = {'take_time': this.take_time};
            return default_exif;
        },
        get_exif: function(obj) {
            var exif_info = {},
                gps_ref = this.get_gps_ref(obj);
            exif_info.take_time = this.get_take_time(obj);
            if(obj.GPSLongitude && !!this.get_gps(obj.GPSLongitude[0], obj.GPSLongitude[1], obj.GPSLongitude[2])){
                exif_info.longitude = this.get_gps(obj.GPSLongitude[0], obj.GPSLongitude[1], obj.GPSLongitude[2]);
                if(!gps_ref.GPSLongitude){
                    exif_info.longitude = -exif_info.longitude;
                }
            }
            if(obj.GPSLatitude && !!this.get_gps(obj.GPSLatitude[0], obj.GPSLatitude[1], obj.GPSLatitude[2])){
                exif_info.latitude = this.get_gps(obj.GPSLatitude[0], obj.GPSLatitude[1], obj.GPSLatitude[2]);
                if(!gps_ref.GPSLatitude){
                    exif_info.latitude = -exif_info.latitude;
                }
            }
            exif_info.width = obj.PixelXDimension;
            exif_info.height = obj.PixelYDimension;
            return exif_info;
        },

        get_take_time: function(obj) {
            var time = obj.DateTimeOriginal || obj.DateTime,
                time_str,
                take_time;
            if(!time){
                return this.take_time;
            } else{
                time_str = time.replace(':','/').replace(':','/');
                take_time = new Date(time_str).getTime();
            }
            return take_time;
        },
        get_gps_ref: function(obj) {
            var ref = {};
            if(obj.GPSLongitudeRef && obj.GPSLongitudeRef.toLowerCase() == 'e') {
                ref.GPSLongitude = true;
            } else {
                ref.GPSLongitude = false;
            }
            if(obj.GPSLatitudeRef && obj.GPSLatitudeRef.toLowerCase() == 'n') {
                ref.GPSLatitude = true;
            } else {
                ref.GPSLatitude = false;
            }
            return ref;
        },
        get_gps: function(degree, min, second) {
            var gps;
            if (Math.abs(degree)>180.0 || Math.abs(min)>60.0 || Math.abs(second)>60.0) {
                return;
            }
            gps = degree;
            gps += min / 60;
            gps += second / 3600;
            return gps;
        }
    });

    return file_exif;
});define.pack("./msg",["$","common","lib","main","./upload_route"],function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),
        console = require('lib').get('./console'),
        constants = common.get('./constants'),
        main = require('main').get('./main'),
        query_user = common.get('./query_user'),
	    upload_route = require('./upload_route'),

        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        undefined;
    var g = {};

    g.upload_error = {

        //come from erric
        //高频码 - 错误类
        404: {
            simple : '连接失败',
            normal : '网络中断，暂时连接不上服务器，请重试'
        },
        10060: {
            simple : '连接失败',
            tip : '未能连接服务器，请重试。',
            normal : '未能连接服务器，请重试。{反馈}'
        },
        100009: {
            simple : '获取文件失败',
            normal : '获取源文件信息失败，请尝试重新上传'
        },
        1000: {
            simple : '上传出错',
            tip : '上传出错，请重试。',
            normal : '上传出错，请重试。{反馈}'
        },

        10001: '网络中断，控件上传超时，请检查网络并重试上传',//控件超时
        10002: '网络中断，拖曳上传超时，请检查网络并重试上传',//拖拽h5上传超时
        10003: '网络中断，请检查网络并重试上传',//纯h5上传出错

        //扫描过程中删除了本地文件
        2: '文件已被删除',
        3: '文件已被删除',
        '-5950': '文件已被删除',

         //上传过程中删除了本地文件
        '-5999': '文件已被删除',
        6: '文件已被删除',
        32: '另一个程序正在使用此文件',
        21: '设备未就绪,上传失败',
        1392: '文件或目录损坏，无法读取',
        53: '网络链接失败，请检查网络',
        87: '网络文件不可读取，请检查网络',
        5: '文件没有访问权限',

	    190011: '您的登录态已失效，请<a class="link" href="//www.weiyun.com" target="_self">重新登录</a>',
        190040: '你已被禁止上传文件',   //UIN在黑名单中
        190049: '可能违反互联网法律法规或腾讯服务协议',   //文件在黑名单中
        190067: '文件名存在敏感文字',
        190072: '系统升级维护，暂不支持该操作',

        32221980: '上传过程中文件被修改，请重新上传',

        32252995: '上传过程中微云文件目录被删除',

        92260005: '文件上传过程中被修改，请重新上传',

        //高频码 - 逻辑限制类
        //web本地验证错误码
	    1000001: {
		    simple : '文件大小超出限制，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
			    ? '请开启浏览器flash插件' : $.browser.msie ? '请<a class="link" href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a class="link" href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>'),
		    normal : '上传失败，文件大小超出限制，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
			    ? '请开启浏览器flash插件' : $.browser.msie ? '请<a class="link" href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a class="link" href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>')
	    },
        1000002:'',
        1000003: {
            simple : '容量不足',
            normal : '容量不足，请删除一些旧文件后重试'
        },
        1000004: '文件大小为空',
        1000005: {//老控件时，超过大小提示，非控件或cgi返回 by hibincheng
            simple : '文件过大',
            normal : '上传失败，文件大小超出限制'
        },
        1000006:'文件名为空，不支持上传',
        1000007:'文件名不能包含以下字符之一 /\\:?*\"><|',
        1000008:'文件名过长，请重命名后重传',
        1000009:'视频文件暂无法上传',
        1000010: query_user.get_cached_user() && query_user.get_cached_user().is_weiyun_vip() ?
                    '单文件大小超限，会员用户请下载<a class="link" href="http://www.weiyun.com/download.html?source=windows" target="_blank">Windows客户端</a>体验更多特权' : '单文件大小超限',
        1000011: $.browser.safari ? 'safari暂不支持文件夹上传，您可以使用chrome体验此功能' : '暂不支持上传文件夹，请检查flash插件是否可用，<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>',
        1000012: 'Flash上传出错，请检查插件或重试上传，<a class="link" href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>',
        1000013: '上传参数出错，请重新上传',
	    1000014: '读取文件出错，请检查文件后重试上传',
	    1000015: '文件超过当日剩余流量',

	    //200000以上错误码定义h5极速上传的逻辑错误
	    2000001: '读取文件出错，请检查文件后重试上传',
	    2000002: '扫描文件出错，请重试上传',
	    2000003: '文件扫描结果异常，请重试上传',
	    2000004: '申请分配上传空间出错，请重试上传',
	    2000005: {
		    simple : '上传通道中断[2000005]',
		    normal : '上传通道中断，{续传文件}[2000005]'
	    }, //执行通道上传，但却没有正确的通道信息
	    2000006: {
		    simple : '网络异常，文件上传中断',
		    normal : '网络异常，文件上传中断，{续传文件}'
	    },
	    2000007: {
		    simple : '分片上传失败[2000007]',
		    normal : '分片上传失败，{续传文件}[2000007]'
	    }, //通道上传server返回错误的retcode
	    2000008: {
		    simple : '分片上传失败[2000008]',
		    normal : '分片上传失败，{续传文件}[2000008]'
	    }, //重复上传的通道id
	    2000009: {
		    simple : '网速过低，文件上传超时',
		    normal : '网速过低，文件上传超时，{续传文件}'
	    }, //上传请求超时
	    2000010: '网速过低，文件上传超时，请重试上传', //createfile的时候就超时（这种一般出现在网速很慢，文件小于512K的情况下，createfile同时上传文件）
	    2000011: '上传时效过期，请重新上传', //暂停5分钟后重新上传，时效过期，需重新createfile（一般会静默重新发起createfile，如果在用户侧出现这个提示，需要检查代码逻辑）
	    2000012: {
		    simple : '分片上传失败[2000012]',
		    normal : '分片上传失败，文件上传中断，{续传文件}'
	    },
	    2000013: {
		    simple : '分片上传失败[2000013]',
		    normal : '分片上传失败，文件上传中断，{续传文件}'
	    },
	    2000014: {
		    simple : '分片上传失败[2000014]',
		    normal : '分片上传失败，文件上传中断，{续传文件}'
	    },

        1053: {
            simple : '容量不足',
            normal : '容量不足，请删除一些旧文件后重试'
        },
        1083: {
            simple : '文件过多',
            normal : '该目录下文件过多，请选择其他目录'
        },

	    1024: '您的登录态已失效，请<a class="link" href="//www.weiyun.com" target="_self">重新登录</a>',

        1126: {
            simple : '文件过大',
            normal : '上传失败，文件大小超出限制'
        },

        //低频码 - 逻辑类
        1051: {
            simple : '文件同名',
            normal : '该目录下已存在同名文件'
        },
        1016: {
            simple : '相册还没初始化',
            normal : '请先访问相册再上传照片到相册'
        },
        1019: {
            simple : '目录已被删除',
            normal : '上传目录已被删除，请另选目录'
        },
        1028: {
            simple : '微云文件过多',
            normal : '微云中文件过多，请删除一些旧文件后重试'
        },
        1088: {
            simple : '文件名不合法',
            normal : '文件名包含特殊字符，请重命名后重传'
        },
        100027: '无效的字符',
        8: {
            simple : '文件名过长',
            normal : '文件名过长，请重命名后重传'
        },
        16: '文件大小为空',
        17: '文件已被删除',
	    1029: {
		    simple: '单文件大小超限',
		    tip : '您的浏览器暂不支持上传10M以上的文件，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
			    ? '请开启浏览器flash插件' : $.browser.msie ? '请<a class="link" href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a class="link" href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>'),
		    normal: '单文件大小超限，{开通会员}支持大文件上传'
	    },
        101: '目录所在层级过深，请上传至其他目录',  //code by bondli 特殊设置了错误码
        102: '目录创建失败(目录达到上限)，无法上传',
        103: '子目录创建失败，无法上传',
        190013: '请求参数错误，请稍后尝试',
        190042: '服务器超时，请稍后尝试',
        190045: '网络失败，请稍后尝试',
        1013: '系统繁忙，请稍后尝试',
        1026: '父目录不存在，请另选目录',
        1127: {
            simple: '今日已达到文件上传上限',
            normal: '今日已达到文件上传上限，{开通会员}上传更多文件'
        },
	    1137: '您的登录态已失效，请<a class="link" href="//www.weiyun.com" target="_self">重新登录</a>'
    };
    g.download_error = {
        1:"下载失败，请重新下载。",
        2:"连接已丢失，请重新下载。",
        3:"所选本地目录不允许下载文件，请选择其他位置。",
        4:"您的本地硬盘已满，请选择其他位置重新下载。",
        5:"下载失败，请重新下载。",
        100:"网络繁忙，请重新下载。"
    };
	g.offline_download_error = {
		1026: '(1026)离线下载保存目标目录不存在或已被删除',
		1029: {
			simple: '(1029)单文件大小超限',
			tip : '(1029)单文件大小超限，{开通会员}支持大文件上传',
			normal: '(1029)单文件大小超限，{开通会员}支持大文件上传'
		},
		190041: '(190041)内部错误，请稍后重试',
		25305: '(25305)搜索不到种子资源，离线下载失败',
		25316: '(25316)种子文件解析失败',
		//2001000以上错误码定义web侧离线下载的逻辑错误
		2001001: '(2001001)种子文件读取出错',
		2001002: '(2001002)种子文件解析失败',
		2001003: '(2001003)链接解析失败',
		2001004: '(2001004)微云种子文件解析失败',
		2001011: '(2001011)取消离线任务失败',
		2001021: '(2001021)添加离线任务失败',
		2001031: '(2001031)拉取任务列表失败'
	};
    g.able_res_start ={
        2: false,
        3: false,
        6: false,
        '-5950': false,
        '-5999': false,
        32221980: false,
        32252995: false,
        92260005: false,
        1126: false,
        1019: false,
        1016: false,
        21: false,
        1392: false,
        190040: false,   //UIN在黑名单中
        190049: false,   //文件在黑名单中
        190067: false,
        10001: true,
        10002: true,
        10003: true,
	    22000: false,
        1000003:true,//空间不足
        1053:true,//空间不足
        500: true, //h5+flash失败后只会返回500，所以可以重试吧
        1000006: false,
        1000007: false,
        1000008: false,
        1000009: false,
        1000010: false,
        1000011: false,
        1000012: false,
        1000013: false,
	    1000014: false,
	    1000015: false
    };

    //替换 急速上传链接
    (function(){
       if( gbIsWin && !$.browser.safari ){
           if(constants.IS_APPBOX){
               g.upload_error[1000002] = '文件超过300M，请<a class="link" target="_blank" href="http://im.qq.com/qq/">安装新版本QQ</a>后上传';
           } else{
               g.upload_error[1000002] = '文件大小超过300M，请启用' + '<a class="link" href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank" '
                   + common.get('./configs.click_tj').make_tj_str('UPLOAD_FILE_MANAGER_INSTALL') + '>极速上传</a>';
           }
       } else {
           g.upload_error[1000002] = '该文件超过300M，暂不支持上传';
       }
       if(constants.IS_APPBOX){//appbox 暂时只支持到4G以内，QQ1.98后放开 todo
           g.upload_error[1000005].normal = '该文件超过2G暂不支持上传。';
       }
    })();

    //替换{反馈}
    var replace_fankui =function(error_text){
        var text = '';
        if( main.get_cur_mod_alias() === 'photo' ) {
            text = '<a class="link" href="http://support.qq.com/discuss/715_1.shtml?WYTAG=weiyun.app.web.photo" target="_blank" data-tj-action="btn-adtag-tj" data-tj-value="50003">反馈</a>';
        } else {
            text = '<a class="link" href="'+main.get_feedback_url()+'" target="_blank">反馈</a>';
        }
        return error_text.replace('{反馈}',text);
    };

    //替换{开通会员}
    var replace_qzone_vip = function(code, error_text, msg_type, type) {
	    type = type || 'upload_error';
        var user = query_user.get_cached_user();
        if(user.is_weiyun_vip()) {
            return g[type][code][msg_type === 'tip' ? 'tip' : 'simple'];
        } else {
            var msg = '<a class="link" href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>';
            return error_text.replace('{开通会员}', msg);
        }
    };

	//替换{续传文件}
	var continue_upload = function(code, error_text) {
		var msg = '<a class="link" href="javascript: void(0);" target="_self" data-upload="click_event" data-action="click_re_try">续传文件</a>';
		return error_text.replace('{续传文件}', msg);
	};

    var get = function (type, code, msg_type ,error_step, err_msg) {
        if ( typeof code === 'string' && !$.isNumeric(code)){
            return code;
        }

        var o = g[ type ][ code ], msg;
        switch(msg_type){
            case 'simple':
            case 'tip':
                break;
            default:
                msg_type = 'normal';
        }
        if(typeof o === 'object'){
            msg = o[msg_type];
            if(!msg){
                msg = o['normal'];
            }
        }else{
            msg = o;
        }
        if(!msg){
            if(!err_msg) {
                msg = msg_type === 'simple' ? '系统繁忙' : '('+ code +(error_step ? ('-' + error_step) : '')+')系统繁忙，请稍后重试';
            } else {
                msg = err_msg;
            }
        }

        if(type === 'upload_error') {
	        if(code === 10060 || code === 1000) {
		        return replace_fankui(msg);
	        } else if(code === 1029 || code === 1127) {
		        return replace_qzone_vip(code, msg, msg_type);
	        } else if(code >= 2000005 && code <= 2000009) {
		        return continue_upload(code, msg);
	        }
        } else if(type === 'offline_download_error') {
	        if(code === 10060 || code === 1000) {
		        return replace_fankui(msg);
	        } else if(code === 1029 || code === 1127) {
		        return replace_qzone_vip(code, msg, msg_type, type);
	        }
        } else { //下载错误，旧版本提示升级
            if(!external.GetVersion || external.GetVersion() < 5287) {
                msg = msg + '请<a class="link" href="http://im.qq.com/pcqq/" target="_blank">更新QQ版本</a>后，再重试。'
            } else {
                msg = msg + '或尝试使用<a class="link" href="http://www.weiyun.com/disk/index.html" target="_blank">网页版</a>重试';
            }
        }
        return msg;
    };

    module.exports = {
        get: get,
        able_res_start:function(code){
            if(typeof g.able_res_start[code] !== 'undefined') {
                return !!g.able_res_start[code];
            } else {
                return true;
            }
        }
    };

});/**
 * 拉取微云目录结构树
 * @author bondli
 * @date 13-7-4
 */
define.pack("./offline_download.file_dir_list",["lib","common","$","disk","./upload_route","./tmpl","./offline_download.offline_download_start"],function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),

		$ = require('$'),
		collections = lib.get('./collections'),
		console = lib.get('./console'),
		text = lib.get('./text'),
		events = lib.get('./events'),

		Module = common.get('./module'),

		disk_mod = require('disk'),
		disk = disk_mod.get('./disk'),
		file_list = disk_mod.get('./file_list.file_list'),
		file_node_from_cgi = disk_mod.get('./file.utils.file_node_from_cgi'),

		query_user = common.get('./query_user'),
		constants = common.get('./constants'),

		upload_route = require('./upload_route'),
		tmpl = require('./tmpl'),
		parse_file = common.get('./file.parse_file'),
		request = common.get('./request'),
		upload_event = common.get('./global.global_event').namespace('upload2'),


		offline_download,
		FileNode,

		long_long_ago = '1970-01-01 00:00:00',

		file_box,

		undefined;

	var file_dir_list = new Module('file_dir_list', {

		render: function() {
			offline_download = require('./offline_download.offline_download_start');
		},

		/**
		 * 显示目录列表
		 * @param {jQuery|HTMLElement}
		 */
		show: function($container, selected_id, isNew) {
			this.render();

			//强行把原来选中的都去掉选中
			$container.find('a').removeClass('selected');

			if(!file_box || isNew) {
				file_box = new FileBox($container);
			}
			file_box.show(selected_id);
		},

		/**
		 * 隐藏目录列表
		 */
		hide: function() {
			if(file_box) {
				file_box.hide();
			}
		},

		/**
		 * 获取指定目录的子目录
		 * @param {String} node_par_id
		 * @param {String} node_id
		 * @param {Number} level
		 */
		load_sub_dirs: function(node_par_id, node_id, level) {
			var me = this;

			me.trigger('before_load_sub_dirs', node_id);

			request.xhr_get({
				url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
				cmd: 'DiskDirBatchList',
				cavil: true,
				resent: true,
				pb_v2: true,
				body: {
					pdir_key: node_par_id,
					dir_list: [
						{
							dir_key: node_id,
							get_type: 1
						}
					]
				}
			})
				.ok(function(msg, body) {

					var result = body['dir_list'][0],
						retcode = result['retcode'],
						dirs;
					if(!retcode) {
						dirs = result['dir_list'];
						dirs = file_node_from_cgi.dirs_from_cgi2(dirs);
						me.trigger('load_sub_dirs', dirs, node_id, level);
					} else {
						var msg = result.retmsg || ret_msgs.get(retcode);
						me.trigger('load_sub_dirs_error', msg, retcode);
					}

				})
				.fail(function(msg, ret) {
					me.trigger('load_sub_dirs_error', msg, ret);
				})
				.done(function() {
					me.trigger('after_load_sub_dirs', node_id);
				});
		}
	});

	/**
	 * 目录对话框
	 * @constructor
	 */
	var FileBox = function($container) {

		var me = this;

		me._chosen_id = me._chosen_par_id = null;

		var root_dir = file_list.get_root_node();
		var par_id = root_dir.get_parent().get_id();
		//根目录ID
		this.root_id = root_dir.get_id();

		me._$el = $(tmpl.file_box({
			root_dir: root_dir,
			par_id: par_id,
			is_root: true//标识是根目录
		})).appendTo($container);

		// 点击目录名选中并展开
		me._$el.off('click', 'li[data-file-id]').on('click', 'li[data-file-id]', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var $dir = $(e.target).closest('[data-file-id]'),
				par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),
				level = parseInt($dir.attr('data-level'));
			if(dir_id === me.root_id) {//根目录不折起来 todo ku2.0
				me.set_chosen(par_id, dir_id);
				return;
			}
			if(dir_id !== "-1") {//相册返回
				me.toggle_expand($dir, level);
			}
			me.set_chosen(par_id, dir_id);
		});

		// 显示对话框时，监听拉取子目录列表事件
		file_dir_list.off('load_sub_dirs').on('load_sub_dirs', function(dir_nodes, par_id, level) {
			me.render_$dirs_dom(dir_nodes, par_id, level);
		});
		file_dir_list.off('before_load_sub_dirs').on('before_load_sub_dirs', function(dir_id) {
			me.mark_loading(dir_id, true);
		});
		file_dir_list.off('after_load_sub_dirs').on('after_load_sub_dirs', function(dir_id) {
			// 标记当前的选择
			if(me._chosen_id) {
				me.get_$node(me._chosen_id).children('a').addClass('selected');
			}
			// 计算宽度，判断是否超出，如果超出增加左右滚动条
			var $node = me.get_$node(me._chosen_id);
			if(!$node[0]) {//选中ID没有被加载过(网盘默认目录上传)
				me.mark_loading(dir_id, false);
				return;
			}
			var bar_width = ($.browser.chrome) ? 10 : 18;
			var container_width = $('#_offline_download_dialog .dirbox-tree').width() - bar_width,
				$cur_a = $node.children('a'),
				cur_span_width = $cur_a.children('span')[0].offsetWidth,
				total_width = parseInt($cur_a.css('paddingLeft'), 10) + cur_span_width;

			//展开了，需要读取下级目录
			if($cur_a.hasClass('expand')) {
				var $lis = $cur_a.siblings('ul').children('li');
				var lis_widths = [];
				$.each($lis, function(i, n) {
					var tmp = parseInt($(n).children('a').css('paddingLeft'), 10) + $(n).children('a').children('span')[0].offsetWidth;
					lis_widths.push(tmp);
				});
				var total_width = Math.max.apply(null, lis_widths);
			}

			var $tree = $('#_offline_download_dialog ._tree')[0];
			if($tree) {
				if(total_width > container_width) {
					$tree.style.width = total_width + 'px';
				}
				else {
					$tree.style.width = container_width + 'px';
				}
			}
			me.mark_loading(dir_id, false);
		});

		// 选择目录前的判断
		me.off('chosen').on('chosen', function(par_id, dir_id) {
			var cur_node = file_list.get_cur_node(),
				cur_dir_id = cur_node ? cur_node.get_id() : undefined;

			// 选中的节点DOM
			var $node = this.get_$node(dir_id),
				dir_paths = $.map($node.add($node.parents('[data-dir-name]')), function(node) {
					return $(node).attr('data-dir-name');
				}),
			//增加路径ID数组
				dir_id_paths = $.map($node.add($node.parents('[data-file-id]')), function(node) {
					return $(node).attr('data-file-id');
				});

			//派发事件
			offline_download.trigger('selected', par_id, dir_id, dir_paths, dir_id_paths);
		});
	};

	FileBox.prototype = $.extend({

		parse_file_node: function(obj) {
			if(!FileNode) {
				FileNode = require('disk').get('./file.file_node');
			}
			return obj && new FileNode(parse_file.parse_file_attr(obj));
		},

		show: function(selected_id) {
			this._chosen_id = selected_id;
			var root_dir = file_list.get_root_node(),
				root_id = root_dir.get_id(),
				root_par_id = root_dir.get_parent().get_id();
			this.expand_load(root_par_id, root_id, 0);
		},

		hide: function() {
			var root_dir = file_list.get_root_node(),
				root_id = root_dir.get_id();
			this.get_$node(root_id).children('ul').remove();
		},

		/**
		 * 渲染子目录DOM
		 * @param {Array<File>} dirs
		 * @param {String} dir_par_id
		 * @param {Number} level
		 */
		render_$dirs_dom: function(dirs, dir_par_id, level) {
			var me = this,
				$dir = this.get_$node(dir_par_id);
			if($dir[0]) {

				$dir.children('ul').remove();

				// 箭头。
				var $arrow = $dir.children('a');
				if(dirs.length > 0) {

					// 标记节点为已读取过
					$dir.attr('data-loaded', 'true');

					// 插入DOM
					var $dirs_dom = $(tmpl.file_box_node_list({
						files: dirs,
						par_id: dir_par_id,
						level: level
					}));

					//默认是相册的时候不需要展开
					if(me._chosen_id != constants.UPLOAD_DIR_PHOTO) {
						// 箭头
						$arrow.addClass('expand');
						// 展开
						$dirs_dom.hide().appendTo($dir).slideDown('fast');
					}
					else {
						// 箭头
						$arrow.removeClass('expand');
						// 不展开
						$dirs_dom.hide().appendTo($dir);
					}
				}
				// 没有子节点就
				else {
					// 隐藏箭头（如果移除箭头会导致滚动条抖一下）
					$arrow.children('.ui-text').children('._expander').css('visibility', 'hidden');
				}
			}
		},

		/**
		 * 展开节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 * @param {Number} level
		 */
		expand_load: function(par_id, dir_id, level) {
			file_dir_list.load_sub_dirs(par_id, dir_id, level);
		},

		/**
		 * 展开、收起文件夹
		 * @param {jQuery|HTMLElement} $dir
		 * @param {Number} level
		 */
		toggle_expand: function($dir, level) {
			$dir = $($dir);

			var par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),

				$ul = $dir.children('ul'),
				loaded = 'true' === $dir.attr('data-loaded');

			// 已加载过
			if(loaded) {
				var $arrow = $dir.children('a'),
					expanded = $arrow.is('.expand');

				if(expanded) {
					$ul.stop(false, true).slideUp('fast', function() {
						$arrow.removeClass('expand');
					});
				} else {
					$ul.stop(false, true).slideDown('fast');
					$arrow.addClass('expand');
				}
			}
			else {
				// 有 UL 节点表示已加载
				this.expand_load(par_id, dir_id, level);
			}
		},

		/**
		 * 设置指定节点ID为已选中的节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 */
		set_chosen: function(par_id, dir_id) {
			if(this._chosen_id === dir_id && this._chosen_par_id === par_id) {
				return;
			}

			// 清除现有的选择
			if(this._chosen_id) {
				this.get_$node(this._chosen_id).children('a').removeClass('selected');
			}

			this._chosen_id = dir_id;
			this._chosen_par_id = par_id;
			this.get_$node(dir_id).children('a').addClass('selected');

			this.trigger('chosen', par_id, dir_id);
		},

		get_$node: function(dir_id) {
			return $('#_file_box_node_' + dir_id);
		},

		mark_loading: function(dir_id, loading) {
			if(dir_id == constants.UPLOAD_DIR_PHOTO) {
				return;
			}
			this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
		}

	}, upload_event);

	return file_dir_list;
});/**
 * 离线下载接口
 * @author iscowei
 * @date 2016-09-29
 */
define.pack("./offline_download.offline_download",["$","lib","common"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		console = lib.get('./console').namespace('offline_download'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),
		undefined;

	var offline_download = {
		/**
		 * 拉取离线任务列表
		 */
		get_task_list: function() {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdGetTaskList',
				pb_v2: true,
				cavil: true,
				body: {}
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		},
		/**
		 * 解析微云里的种子信息
		 */
		parse_weiyun_torrent: function(file) {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdAddBtFileInWeiyun',
				pb_v2: true,
				cavil: true,
				body: {
					pdir_key: file.get_pid(),
					file_id: file.get_id(),
					filename: file.get_name(),
					file_sha: file.get_file_sha(),
					file_size: file.get_size()
				}
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		},
		/**
		 * 上传解析种子信息
		 */
		parse_torrent: function(torrent) {
			var defer = $.Deferred();

			readerFile(torrent).done(function(bin) {
				request.xhr_post({
					url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
					cmd: 'OdAddBtTorrentFile',
					pb_v2: true,
					cavil: true,
					body: {
						torrent_name: torrent.name,
						torrent_data: binb2hex(bin)
					}
				}).ok(function(msg, body) {
					defer.resolve(body);
				}).fail(function(msg, ret) {
					defer.reject({ ret: ret, msg: msg });
				});
			}).fail(function() {
				defer.reject({ ret: 2001001, msg: '种子文件读取出错' });
			});

			return defer;
		},

		/**
		 * 解析磁力链接信息
		 */
		parse_magnet: function(option) {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdAddUrlTask',
				pb_v2: true,
				cavil: true,
				body: option
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		},

		/**
		 * 启动种子离线下载任务
		 */
		add_task: function(option) {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdAddBtTask',
				pb_v2: true,
				cavil: true,
				body: option
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		},

		/**
		 * 取消离线下载任务
		 */
		cancel_task: function(option) {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdDelTaskItem',
				pb_v2: true,
				cavil: true,
				body: option
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		},

		/**
		 * 取消全部离线下载任务
		 */
		cancel_all_task: function() {
			var defer = $.Deferred();

			request.xhr_post({
				url: 'http://web2.cgi.weiyun.com/offline_download.fcg',
				cmd: 'OdClearTaskList',
				pb_v2: true,
				cavil: true,
				body: {}
			}).ok(function(msg, body) {
				defer.resolve(body);
			}).fail(function(msg, ret) {
				defer.reject({ ret: ret, msg: msg });
			});

			return defer;
		}
	};

	function binb2hex(bin) {
		var dataView = new DataView(bin);
		var hex = '';
		for (var i=0, len=dataView.byteLength, byte; i < len; i++) {
			try {
				byte = dataView.getUint8(i, false).toString(16);
				//转二进制不够位数要补0
				hex += byte.length === 2 ? byte : ('0' + byte).slice(-2);
			} catch(e) {
				//文件转十六进制出错
			}
		}
		return hex;
	}

	function readerFile(file) {
		var defer = $.Deferred();
		var h5_file_reader = new FileReader();

		h5_file_reader.onload = function(e) {
			defer.resolve(e.target.result);
		};

		h5_file_reader.onerror = function(e) {
			defer.reject(e);
		};

		h5_file_reader.readAsArrayBuffer(file);

		return defer;
	}

	module.exports = offline_download;
});/**
 * 离线下载模块
 * @author iscowei
 * @date 2016-09-29
 */
define.pack("./offline_download.offline_download_class",["$","lib","common","./Upload_class","./tool.upload_static","./tool.upload_cache","./view","./offline_download.offline_download"],function(require, exports, module) {
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
});/**
 * 离线下载模块
 * @author iscowei
 * @date 2016-09-29
 */
define.pack("./offline_download.offline_download_start",["$","lib","common","./tmpl","./upload_file_validata.upload_file_validata","./tool.upload_static","./offline_download.file_dir_list","./offline_download.offline_download","main","disk"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		text = lib.get('./text'),
		Module = common.get('./module'),
		widgets = common.get('./ui.widgets'),
		logger = common.get('./util.logger'),
		toast = common.get('./ui.toast'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		ui_center = common.get('./ui.center'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		offline_event = common.get('./global.global_event').namespace('offline_download'),

		tmpl = require('./tmpl'),
		validata = require('./upload_file_validata.upload_file_validata'),
		upload_static = require('./tool.upload_static'),
		file_dir_list = require('./offline_download.file_dir_list'),
		offline_download = require('./offline_download.offline_download'),

		//扩展模块
		main = require('main').get('./main'),
		main_ui = require('main').get('./ui'),
		disk = require('disk').get('./disk'),
		file_list = require('disk').get('./file_list.file_list'),
		undefined;

	var	cur_user = query_user.get_cached_user() || {},
		coupon_count = 0,
		per_node_id,
		cur_node_id,
		cur_node_path,
		interval,
		save_lock = false,
		parse_lock = false,
		TIP_TEXT = '会员专享离线下载';

	var stop_prop_default = function(e) {//阻止默认行为和冒泡
		e.preventDefault();
		e.stopImmediatePropagation();
	};

	var offline_download_start = new Module('offline_download.offline_download_start', {
		init: function() {
			var me = this;

			//接收右键菜单离线下载事件
			offline_event.off('menu_selected_offline_download').on('menu_selected_offline_download', function(node) {
				me.destroy();
				if(node) {
					//关闭操作栏
					main_ui.toggle_edit(false);
					//拉取离线下载试用券
					upload_static.get_od_info().done(function(res) {
						coupon_count = res.coupon_count;

						toast.loading('正在解析种子文件...');
						me.torrent = {
							name: node.get_name(),
							size: node.get_size(),
							lastModified: node.get_modify_time()
						};
						offline_download.parse_weiyun_torrent(node).done(function(result) {
							toast.hide();
							me.torrent_info = result;
							me.select_file();
						}).fail(function(result) {
							toast.tips(result.msg, 3);
							me.report_error('offline_download_parse_weiyun_torrent', result.msg, result.ret || 2001004, null, result);
						});
					}).fail(function(msg, ret, body, header) {
						mini_tip.error(msg);
					});
					pvClickSend && pvClickSend('weiyun.offline.menu');
				} else {
					toast.tips('文件读取失败，请重试', 3);
				}
			});

			me.get_task_list();
			interval = setInterval(me.get_task_list, 30000);
		},

		//拉取任务列表
		get_task_list: function() {
			var me = this;
			offline_download.get_task_list().done(function(result) {
				if(result.task_list && result.task_list.length) {
					offline_event.trigger('update_task', result.task_list);
				}
			}).fail(function(result) {
				me.report_error('offline_download_get_task_list', result.msg, result.ret || 2001031, null, result);
			});
		},

		//获取当前网盘路径
		get_current_path: function() {
			var node,
				node_id,
				per_node_id,
				node_name,
				path = ['微云'],
				path_name;

			if (disk.is_rendered() && disk.is_activated()) {
				node = file_list.get_cur_node();
				//判断是否虚拟目录,是虚拟目录强制回到根目录
				if ( node && node.is_vir_dir() ) {
					node = file_list.get_root_node();
				}
				node_id = node.get_id();
				per_node_id = node.get_parent().get_id();
				node_name = node.get_name();
			} else {
				node_id = query_user.get_cached_user().get_main_key();
				per_node_id = query_user.get_cached_user().get_root_key();
				node_name = query_user.get_cached_user().get_main_dir_name();
			}

			if( node_name == '微云' || node_name == '网盘' ){
				path = ['微云'];
			} else {
				while(node_name != '微云' && node_name != '网盘') {
					path.push(node_name);
					node = node.get_parent();
					node_name = node.get_name();
				}
			}

			path_name = $.isArray(path) ? path.join('\\') : path;

			return {
				path_name: path_name,
				node_id: node_id,
				per_node_id: per_node_id
			};
		},

		//选择离线下载种子文件 & 添加磁力链接
		select_torrent: function() {
			var me = this,
				$el = tmpl.offline_download();
			me.dialog = new widgets.Dialog({
				title: '离线下载',
				empty_on_hide: true,
				destroy_on_hide: true,
				content: $el,
				tmpl: tmpl.offline_download_dialog,
				klass: 'pop-offline-select',
				mask_ns: 'gt_4g_tips',
				buttons: [
					{id: 'OK', text: '保存', klass: 'g-btn g-btn-blue j-parse-magnet', visible: false},
					{id: 'CANCEL', text: '取消', klass: 'g-btn g-btn-gray j-offline-cancel', visible: true}
				]
			});
			me.dialog.show();
			//当关闭或者隐藏的时候
			me.listenTo(me.dialog, 'hide', function () {
				file_dir_list.hide();
			});

			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			var el = me.dialog.get_$el(),
				okBtn = el.find('.j-parse-magnet'),
				cancelBtn = el.find('.j-offline-cancel'),
				tabs = el.find('[data-id=offline_tab]'),
				textNode = el.find('.j-offline-magnet'),
				tryNode = el.find('[data-id=try_tips]'),
				vipNode = el.find('[data-id=vip_tips]'),
				vipBtn = el.find('[data-action=open_vip]'),
				dir_change = el.find('[data-action=change_dir]'),
				dir_text = el.find('.j-offline-dir'),
				dir_tree = el.find('.j-tree-container'),
				tipsNode = is_vip ? vipNode : tryNode,
				countNode = tipsNode.find('[data-id=' + (is_vip ? 'vip' : 'try') + '_count]'),
				perDayNode = tipsNode.find('[data-id=use_count]'),
				dir_cur = me.get_current_path();

			dir_text.text(cur_node_path || '微云/离线下载');

			//定义一个选择的目录的事件
			offline_download_start.off('selected').on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ) {
				cur_node_id = pdir;
				per_node_id = ppdir;
				cur_node_path = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
				dir_text.text(cur_node_path);
			});

			//每日可用次数
			perDayNode.text(cur_user.get_od_count_per_day() || TIP_TEXT);
			//磁力链接
			okBtn.off('click').on('click', function(e) {
				var target = $(e.target);
				if(!target.hasClass('disabled')) {
					me.magnet = textNode.val().replace(/(^\s*)|(\s*$)/g, '');
					me.on_parse_magnet();
					pvClickSend && pvClickSend('weiyun.offline.magnet');
				}
			});
			//开通会员
			vipBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				var is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
					from = is_weixin_user? 1026 : 1021;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
				pvClickSend && pvClickSend('weiyun.offline.vip');
			});
			//tab
			tabs.off('click').on('click', function(e) {
				stop_prop_default(e);

				var elm = $(e.target).closest('[data-id=offline_tab]'),
					tab = elm.data('tab');
				tabs.each(function(i, t) {
					var node = $(t),
						nodeTab = node.data('tab');
					if(nodeTab === tab) {
						node.addClass('on');
						me.dialog.set_button_visible('OK', nodeTab !== 'bt');
						el.find('[data-id=offline_' + nodeTab + ']').show();
					} else {
						node.removeClass('on');
						el.find('[data-id=offline_' + nodeTab + ']').hide();
					}
					pvClickSend && pvClickSend('weiyun.offline.tab' + i);
				});
			});
			//取消
			cancelBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				me.dialog.hide();
				pvClickSend && pvClickSend('weiyun.offline.cancel');
			});
			//保存目录
			dir_change.off('click').on('click', function(e) {
				stop_prop_default(e);

				//加载目录列表
				file_dir_list.show(dir_tree, dir_cur.node_id, true);
				dir_change.hide();
				dir_tree.show();
				//调整选择框的位置
				ui_center.update(me.dialog.get_$el());
				pvClickSend && pvClickSend('weiyun.offline.dir_change');
			});
			//开通引导，使用次数
			me.dialog.set_button_enable('OK', false);
			textNode.off('change keyup paste').on('change keyup paste', function() {
				if(textNode.val().replace(/(^\s*)|(\s*$)/g, '') != '' && coupon_count > 0) {
					me.dialog.set_button_enable('OK', true);
				} else {
					me.dialog.set_button_enable('OK', false);
				}
			});
			if(coupon_count > 0) {
				el.find('[data-action=select_torrent]').off('click').on('click', function(e) {
					stop_prop_default(e);
					me.on_select();
				}).focus();
				perDayNode.text((is_vip ? cur_user.get_od_count_per_day() : ('您还可以试用离线下载' + coupon_count + '次')) || TIP_TEXT);
				countNode.text('(' + (is_vip ? '剩余' : '试用机会') + coupon_count + '次)');
			} else {
				el.find('[data-action=select_torrent] .btn-inner').addClass('disabled');
				perDayNode.text(is_vip ? ('今日使用已超过限制，请明日再试' || TIP_TEXT) : TIP_TEXT);
				countNode.text(is_vip ? '(次数用完)' : '(次数用完)');
			}
			if(is_vip) {
				tryNode.hide();
				vipNode.show();
			} else {
				vipNode.hide();
				tryNode.show();
			}
		},

		//校验选好的种子文件
		on_select: function() {
			var me = this;
			$('<input type="file" accept=".torrent, application/x-bittorrent" style="margin-left:-9999px">').appendTo(document.body).on('change', function(e) {
				var file = (e.target.files && e.target.files.length) ? e.target.files[0] : null,
					validator = validata.create(),
					ret;
				if(file) {
					validator.add_validata('check_name', file.name);
					validator.add_validata('check_torrent', file.name);
					ret = validator.run();
					if(ret) {
						mini_tip.error(ret[0]);
					} else {
						me.torrent = file;
						me.on_torrent_select();
					}
					pvClickSend && pvClickSend('weiyun.offline.select');
				} else {
					mini_tip.error('种子文件读取失败');
				}

				$(e.target).remove();
			}).click();
		},

		//发送磁力链接到后台解析文件信息
		on_parse_magnet: function() {
			var me = this, params;
			if(parse_lock) {
				return;
			}
			parse_lock = true;
			me.dialog.hide();
			if(me.magnet) {
				toast.loading('正在解析链接...');
				params = {
					url: me.magnet
				};
				if(cur_node_id && per_node_id) {
					params.is_default_dir = false;
					params.ppdir_key = per_node_id;
					params.pdir_key = cur_node_id;
				}
				offline_download.parse_magnet(params).done(function(result) {
					toast.hide();
					if(result && result.is_magnet_url) {
						me.torrent_info = result;
						me.select_file();
					} else {
						//http或电驴链接，不用选择文件直接加入任务列表
						toast.hide();
						me.destroy();
						//刷新网盘文件列表
						file_list.reload(false, false);
						//更新任务
						me.get_task_list();
						main_ui.show_manage_num();
					}
					parse_lock = false;
				}).fail(function(result) {
					toast.tips(result.msg, 3);
					me.report_error('offline_download_parse_magnet', result.msg, result.ret || 2001003, null, result);
					parse_lock = false;
				});
			} else {
				toast.tips('链接解析失败，请重试', 3);
				parse_lock = false;
			}
		},

		//上传种子文件到后台解析文件信息
		on_torrent_select: function() {
			var me = this;
			me.dialog.hide();
			if(me.torrent) {
				toast.loading('正在解析种子文件...');
				offline_download.parse_torrent(me.torrent).done(function(result) {
					toast.hide();
					me.torrent_info = result;
					me.select_file();
				}).fail(function(result) {
					toast.tips(result.msg, 3);
					me.report_error('offline_download_parse_torrent', result.msg, result.ret || 2001002, null, result);
				});
			} else {
				toast.tips('文件读取失败，请重试', 3);
				me.report_error('offline_download_parse_torrent', '种子文件读取失败', 2001001, null, {
					'torrent_name': me.torrent.name,
					'torrent_size': me.torrent.size
				});
			}
		},

		//选择种子里的文件确认离线下载
		select_file: function() {
			var me = this;
			var $el = tmpl.offline_file_select({
				torrent: me.torrent,
				magnet: me.magnet,
				files: me.torrent_info.file_list
			});

			me.dialog = new widgets.Dialog({
				title: '离线下载',
				empty_on_hide: true,
				destroy_on_hide: true,
				content: $el,
				tmpl: tmpl.offline_download_dialog,
				klass: 'pop-offline-download',
				mask_ns: 'gt_4g_tips',
				buttons: [
					{id: 'OK', text: '保存', klass: 'g-btn g-btn-blue j-add-task', visible: true},
					{id: 'CANCEL', text: '取消', klass: 'g-btn g-btn-gray j-offline-cancel', visible: true}
				]
			});
			me.dialog.show();
			//当关闭或者隐藏的时候
			me.listenTo(me.dialog, 'hide', function () {
				file_dir_list.hide();
			});

			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			var el = me.dialog.get_$el(),
				tryNode = el.find('[data-id=try_tips]'),
				vipNode = el.find('[data-id=vip_tips]'),
				tipsNode = is_vip ? vipNode : tryNode,
				countNode = tipsNode.find('[data-id=' + (is_vip ? 'vip' : 'try') + '_count]'),
				perDayNode = tipsNode.find('[data-id=use_count]');

			//每日可用次数
			perDayNode.text(cur_user.get_od_count_per_day() || TIP_TEXT);
			//开通引导，使用次数
			if(coupon_count > 0) {
				perDayNode.text((is_vip ? cur_user.get_od_count_per_day() : ('您还可以试用离线下载' + coupon_count + '次')) || TIP_TEXT);
				countNode.text('(' + (is_vip ? '剩余' : '试用机会') + coupon_count + '次)');
				me.dialog.set_button_enable('OK', true);
			} else {
				el.find('[data-action=select_torrent] .btn-inner').addClass('disabled');
				perDayNode.text(is_vip ? ('今日使用已超过限制，请明日再试' || TIP_TEXT) : TIP_TEXT);
				countNode.text(is_vip ? '(次数用完)' : '(次数用完)');
				me.dialog.set_button_enable('OK', false);
			}
			if(is_vip) {
				tryNode.hide();
				vipNode.show();
			} else {
				vipNode.hide();
				tryNode.show();
			}
			me.bind_select_file_event(el);
		},

		bind_select_file_event: function(wrap) {
			var me = this;
			var list = wrap.find('.j-offline-file'),
				all = wrap.find('[data-action=offline_select_all]'),
				dir_change = wrap.find('[data-action=change_dir]'),
				dir_text = wrap.find('.j-offline-dir'),
				dir_tree = wrap.find('.j-tree-container'),
				add_task = wrap.find('.j-add-task'),
				offline_cancel = wrap.find('.j-offline-cancel'),
				vipBtn = wrap.find('[data-action=open_vip]'),
				dir_cur = this.get_current_path();

			dir_text.text(cur_node_path || '微云/离线下载');

			//开通会员
			vipBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				var is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
					from = is_weixin_user? 1026 : 1021;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
				pvClickSend && pvClickSend('weiyun.offline.vip');
			});
			//保存
			add_task.off('click').on('click', function(e) {
				stop_prop_default(e);
				var target = $(e.target);
				if(!target.hasClass('disabled')) {
					me.on_file_select();
					pvClickSend && pvClickSend('weiyun.offline.confirm');
				}
			});

			//取消
			offline_cancel.off('click').on('click', function(e) {
				stop_prop_default(e);
				me.dialog.hide();

				pvClickSend && pvClickSend('weiyun.offline.cancel');
			});

			//全选
			if(list.size() === wrap.find('.j-offline-file.act').size()) {
				all.data('act', 1).addClass('act');
			} else {
				all.data('act', 0).removeClass('act');
			}
			wrap.off('click').on('click', '[data-action=offline_select_all]', function(e) {
				stop_prop_default(e);

				if(parseInt(all.data('act')) === 0) {
					all.data('act', 1).addClass('act');
					list.data('act', 1).addClass('act');
				} else {
					all.data('act', 0).removeClass('act');
					list.data('act', 0).removeClass('act');
				}
			});

			//单选
			list.off('click').on('click', function(e) {
				stop_prop_default(e);

				var target = $(e.target).closest('.j-offline-file');
				if(!target.size()) {
					return;
				}

				if(parseInt(target.data('act')) === 0) {
					target.data('act', 1).addClass('act');
				} else {
					target.data('act', 0).removeClass('act');
				}

				if(list.size() === wrap.find('.j-offline-file.act').size()) {
					all.data('act', 1).addClass('act');
				} else {
					all.data('act', 0).removeClass('act');
				}
			});

			//选择目录
			dir_change.off('click').on('click',function(e) {
				stop_prop_default(e);

				//加载目录列表
				file_dir_list.show(dir_tree, dir_cur.node_id, true);
				dir_change.hide();
				dir_tree.show();
				//调整选择框的位置
				ui_center.update(me.dialog.get_$el());

				pvClickSend && pvClickSend('weiyun.offline.dir_change');
			});

			//定义一个选择的目录的事件
			offline_download_start.off('selected').on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ) {
				cur_node_id = pdir;
				per_node_id = ppdir;
				cur_node_path = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
				dir_text.text(cur_node_path);
			});
		},

		//确认要保存的离线文件，发起离起下载请求
		on_file_select: function() {
			//操作锁
			if(save_lock) {
				return;
			}
			save_lock = true;

			var me = this;
			var el = me.dialog.get_$el(),
				list = el.find('.j-offline-file.act'),
				torrent = me.torrent_info.file_list,
				files = [];

			for(var i=0, ilen=list.length; i<ilen; i++) {
				for(var j=0, jlen=torrent.length; j<jlen; j++) {
					if(parseInt($(list[i]).data('index')) === torrent[j].torrent_index) {
						files.push(torrent[j]);
						break;
					}
				}
			}

			if(files.length) {
				me.dialog.hide();
				toast.loading('正在添加离线任务...');
				offline_download.add_task({
					torrent_hex: me.torrent_info.torrent_hex,
					is_default_dir: (cur_node_id && per_node_id) ? false : true,
					dir_name: me.torrent_info.dir_name,
					ppdir_key: per_node_id || '',
					pdir_key: cur_node_id || '',
					file_list: files
				}).done(function() {
					save_lock = false;
					toast.hide();
					me.destroy();
					//刷新网盘文件列表
					file_list.reload(false, false);
					//更新任务
					me.get_task_list();
					main_ui.show_manage_num();
				}).fail(function(result) {
					save_lock = false;
					toast.tips(result.msg, 3);
					me.destroy();
					me.report_error('offline_download_add_task', result.msg, result.ret || 2001021, null, result);
				});
			} else {
				save_lock = false;
				mini_tip.error('请选择需要保存的离线文件');
			}
		},

		destroy: function() {
			var me = this;
			me.dialog = null;
			me.magnet = null;
			me.torrent = null;
			me.torrent_info = null;
			per_node_id = null;
			cur_node_id = null;
			cur_node_path = null;
		},

		start: function() {
			var me = this;
			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			me.destroy();

			//拉取离线下载试用券
			upload_static.get_od_info().done(function(res) {
				coupon_count = res.coupon_count;
				me.select_torrent();
			}).fail(function(msg, ret, body, header) {
				mini_tip.error(msg);
				me.report_error('offline_download_get_od_info', msg, ret, body, header);
			});

			pvClickSend && pvClickSend('weiyun.offline.enter');
		},

		report_error: function(mod, msg, ret, body, header) {
			var error = msg;
			try {
				error = JSON.stringify(header);
			} catch(e) {}
			logger.dcmdWrite([mod + ' error: --------> ' + error], 'offline_download_monitor', ret, 2);
		}
	});

	return offline_download_start;
});/**
 * 上传按钮下拉框选择
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./select_folder.dropdown_menu",["$","common"],function (require, exports, module) {
    var $ = require('$'),
        common = require('common'),
        Pop_panel = common.get('./ui.pop_panel'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        panel;

    return {
        render: function () {
            // 针对读屏软件不显示上传文件夹和超大文件菜单 - james
            if (scr_reader_mode.is_enable()) return;

            var $dropdown_menu = $('#upload_dropdown_menu');
            panel = new Pop_panel({
                $dom: $dropdown_menu,//弹层对象
                host_$dom: $('#upload_dropdown_inner'),//弹层的依覆对象
                show: function () {
                    $dropdown_menu.show();
                },
                hide: function () {
                    $dropdown_menu.hide();
                },
                delay_time: 50//延时50毫秒消失
            });
        },
        hide: function () {
            panel && panel.hide();
        }
    };
});/**
 * 拉取微云目录结构树
 * @author bondli
 * @date 13-7-4
 */
define.pack("./select_folder.file_dir_list",["lib","common","$","disk","./upload_route","./tmpl","./select_folder.select_folder"],function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),

		$ = require('$'),
		collections = lib.get('./collections'),
		console = lib.get('./console'),
		text = lib.get('./text'),
		events = lib.get('./events'),

		Module = common.get('./module'),

		disk_mod = require('disk'),
		disk = disk_mod.get('./disk'),
		file_list = disk_mod.get('./file_list.file_list'),
		file_node_from_cgi = disk_mod.get('./file.utils.file_node_from_cgi'),

		query_user = common.get('./query_user'),
		constants = common.get('./constants'),

		upload_route = require('./upload_route'),
		tmpl = require('./tmpl'),
		parse_file = common.get('./file.parse_file'),
		request = common.get('./request'),
		upload_event = common.get('./global.global_event').namespace('upload2'),


		select_folder,
		FileNode,

		long_long_ago = '1970-01-01 00:00:00',

		file_box,

		undefined;

	var file_dir_list = new Module('file_dir_list', {

		render: function() {
			select_folder = require('./select_folder.select_folder');
		},

		/**
		 * 显示目录列表
		 * @param {jQuery|HTMLElement}
		 */
		show: function($container, selected_id) {
			this.render();

			//强行把原来选中的都去掉选中
			$container.find('a').removeClass('selected');

			if(!file_box) {
				file_box = new FileBox($container);
			}
			file_box.show(selected_id);
		},

		/**
		 * 隐藏目录列表
		 */
		hide: function() {
			if(file_box) {
				file_box.hide();
			}
		},

		/**
		 * 获取指定目录的子目录
		 * @param {String} node_par_id
		 * @param {String} node_id
		 * @param {Number} level
		 */
		load_sub_dirs: function(node_par_id, node_id, level) {
			var me = this;

			me.trigger('before_load_sub_dirs', node_id);

			request.xhr_get({
				url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
				cmd: 'DiskDirBatchList',
				cavil: true,
				resent: true,
				pb_v2: true,
				body: {
					pdir_key: node_par_id,
					dir_list: [
						{
							dir_key: node_id,
							get_type: 1
						}
					]
				}
			})
				.ok(function(msg, body) {

					var result = body['dir_list'][0],
						retcode = result['retcode'],
						dirs;
					if(!retcode) {
						dirs = result['dir_list'];
						dirs = file_node_from_cgi.dirs_from_cgi2(dirs);
						me.trigger('load_sub_dirs', dirs, node_id, level);
					} else {
						var msg = result.retmsg || ret_msgs.get(retcode);
						me.trigger('load_sub_dirs_error', msg, retcode);
					}

				})
				.fail(function(msg, ret) {
					me.trigger('load_sub_dirs_error', msg, ret);
				})
				.done(function() {
					me.trigger('after_load_sub_dirs', node_id);
				});
		}
	});

	/**
	 * 目录对话框
	 * @constructor
	 */
	var FileBox = function($container) {

		var me = this;

		me._chosen_id = me._chosen_par_id = null;

		var root_dir,
			par_id;
		//var root_dir = file_list.get_root_node();

		//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
		if(disk.is_rendered() && disk.is_activated()) {
			root_dir = file_list.get_root_node();
			par_id = root_dir.get_parent().get_id();
		}
		else {
			var node_id = query_user.get_cached_user().get_main_key();
			var file_obj = {
				"dir_attr": {"dir_name": upload_route.get_root_name()},
				"dir_attr_bit": "1",
				"dir_ctime": "2012-07-15 15:23:51 754",
				"dir_is_shared": 0,
				"dir_key": node_id,
				"dir_mtime": "2012-07-15 16:07:42 863"
			};
			root_dir = me.parse_file_node(file_obj);
			par_id = query_user.get_cached_user().get_root_key();
		}
		//根目录ID
		this.root_id = root_dir.get_id();

		me._$el = $(tmpl.file_box({
			root_dir: root_dir,
			par_id: par_id,
			is_root: true//标识是根目录
		})).appendTo($container);

		// 点击目录名选中并展开
		me._$el.off('click', 'li[data-file-id]').on('click', 'li[data-file-id]', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var $dir = $(e.target).closest('[data-file-id]'),
				par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),
				level = parseInt($dir.attr('data-level'));
			if(dir_id === me.root_id) {//根目录不折起来 todo ku2.0
				me.set_chosen(par_id, dir_id);
				return;
			}
			if(dir_id !== "-1") {//相册返回
				me.toggle_expand($dir, level);
			}
			me.set_chosen(par_id, dir_id);
		});

		// 显示对话框时，监听拉取子目录列表事件
		me
			.listenTo(file_dir_list, 'load_sub_dirs', function(dir_nodes, par_id, level) {
				this.render_$dirs_dom(dir_nodes, par_id, level);
			})
			.listenTo(file_dir_list, 'before_load_sub_dirs', function(dir_id) {
				this.mark_loading(dir_id, true);
			})
			.listenTo(file_dir_list, 'after_load_sub_dirs', function(dir_id) {
				// 标记当前的选择
				if(me._chosen_id) {
					me.get_$node(me._chosen_id).children('a').addClass('selected');
				}
				// 计算宽度，判断是否超出，如果超出增加左右滚动条
				var $node = me.get_$node(me._chosen_id);
				if(!$node[0]) {//选中ID没有被加载过(网盘默认目录上传)
					this.mark_loading(dir_id, false);
					return;
				}
				var bar_width = ($.browser.chrome) ? 10 : 18;
				var container_width = $('#_upload_dialog .dirbox-tree').width() - bar_width,
					$cur_a = $node.children('a'),
					cur_span_width = $cur_a.children('span')[0].offsetWidth,
					total_width = parseInt($cur_a.css('paddingLeft'), 10) + cur_span_width;

				//展开了，需要读取下级目录
				if($cur_a.hasClass('expand')) {
					var $lis = $cur_a.siblings('ul').children('li');
					var lis_widths = [];
					$.each($lis, function(i, n) {
						var tmp = parseInt($(n).children('a').css('paddingLeft'), 10) + $(n).children('a').children('span')[0].offsetWidth;
						lis_widths.push(tmp);
					});
					var total_width = Math.max.apply(null, lis_widths);
				}

				var $tree = $('#_upload_dialog ._tree')[0];
				if(total_width > container_width) {
					$tree.style.width = total_width + 'px';
				}
				else {
					$tree.style.width = container_width + 'px';
				}
				this.mark_loading(dir_id, false);
			});


		// 选择目录前的判断
		me.off('chosen').on('chosen', function(par_id, dir_id) {
			var cur_node = file_list.get_cur_node(),
				cur_dir_id = cur_node ? cur_node.get_id() : undefined;

			// 选中的节点DOM
			var $node = this.get_$node(dir_id),
				dir_paths = $.map($node.add($node.parents('[data-dir-name]')), function(node) {
					return $(node).attr('data-dir-name');
				}),
			//增加路径ID数组
				dir_id_paths = $.map($node.add($node.parents('[data-file-id]')), function(node) {
					return $(node).attr('data-file-id');
				});

			//派发事件
			select_folder.trigger('selected', par_id, dir_id, dir_paths, dir_id_paths);
		});
	};

	FileBox.prototype = $.extend({

		parse_file_node: function(obj) {
			if(!FileNode) {
				FileNode = require('disk').get('./file.file_node');
			}
			return obj && new FileNode(parse_file.parse_file_attr(obj));
		},

		show: function(selected_id) {
			this._chosen_id = selected_id;

			//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
			if(disk.is_rendered() && disk.is_activated()) {
				var root_dir = file_list.get_root_node(),
					root_id = root_dir.get_id(),
					root_par_id = root_dir.get_parent().get_id();
			}
			else {
				var root_id = query_user.get_cached_user().get_main_key();
				var file_obj = {
					"dir_attr": {"dir_name": upload_route.get_root_name()},
					"dir_attr_bit": "1",
					"dir_ctime": "2012-07-15 15:23:51 754",
					"dir_is_shared": 0,
					"dir_key": root_id,
					"dir_mtime": "2012-07-15 16:07:42 863"
				};
				var root_dir = this.parse_file_node(file_obj);
				var root_par_id = query_user.get_cached_user().get_root_key();
			}
			this.expand_load(root_par_id, root_id, 0);

		},

		hide: function() {

			//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
			if(disk.is_rendered() && disk.is_activated()) {
				var root_dir = file_list.get_root_node(),
					root_id = root_dir.get_id();
			}
			else {
				var root_id = query_user.get_cached_user().get_main_key();
			}

			this.get_$node(root_id).children('ul').remove();
		},

		/**
		 * 渲染子目录DOM
		 * @param {Array<File>} dirs
		 * @param {String} dir_par_id
		 * @param {Number} level
		 */
		render_$dirs_dom: function(dirs, dir_par_id, level) {
			var me = this,
				$dir = this.get_$node(dir_par_id);
			if($dir[0]) {

				$dir.children('ul').remove();

				// 箭头。
				var $arrow = $dir.children('a');
				if(dirs.length > 0) {

					// 标记节点为已读取过
					$dir.attr('data-loaded', 'true');

					// 插入DOM
					var $dirs_dom = $(tmpl.file_box_node_list({
						files: dirs,
						par_id: dir_par_id,
						level: level
					}));

					//默认是相册的时候不需要展开
					if(me._chosen_id != constants.UPLOAD_DIR_PHOTO) {
						// 箭头
						$arrow.addClass('expand');
						// 展开
						$dirs_dom.hide().appendTo($dir).slideDown('fast');
					}
					else {
						// 箭头
						$arrow.removeClass('expand');
						// 不展开
						$dirs_dom.hide().appendTo($dir);
					}
				}
				// 没有子节点就
				else {
					// 隐藏箭头（如果移除箭头会导致滚动条抖一下）
					$arrow.children('.ui-text').children('._expander').css('visibility', 'hidden');
				}
			}
		},

		/**
		 * 展开节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 * @param {Number} level
		 */
		expand_load: function(par_id, dir_id, level) {
			file_dir_list.load_sub_dirs(par_id, dir_id, level);
		},

		/**
		 * 展开、收起文件夹
		 * @param {jQuery|HTMLElement} $dir
		 * @param {Number} level
		 */
		toggle_expand: function($dir, level) {
			$dir = $($dir);

			var par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),

				$ul = $dir.children('ul'),
				loaded = 'true' === $dir.attr('data-loaded');

			// 已加载过
			if(loaded) {
				var $arrow = $dir.children('a'),
					expanded = $arrow.is('.expand');

				if(expanded) {
					$ul.stop(false, true).slideUp('fast', function() {
						$arrow.removeClass('expand');
					});
				} else {
					$ul.stop(false, true).slideDown('fast');
					$arrow.addClass('expand');
				}
			}
			else {
				// 有 UL 节点表示已加载
				this.expand_load(par_id, dir_id, level);
			}
		},

		/**
		 * 设置指定节点ID为已选中的节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 */
		set_chosen: function(par_id, dir_id) {
			if(this._chosen_id === dir_id && this._chosen_par_id === par_id) {
				return;
			}

			// 清除现有的选择
			if(this._chosen_id) {
				this.get_$node(this._chosen_id).children('a').removeClass('selected');
			}

			this._chosen_id = dir_id;
			this._chosen_par_id = par_id;
			this.get_$node(dir_id).children('a').addClass('selected');

			this.trigger('chosen', par_id, dir_id);
		},

		get_$node: function(dir_id) {
			return $('#_file_box_node_' + dir_id);
		},

		mark_loading: function(dir_id, loading) {
			if(dir_id == constants.UPLOAD_DIR_PHOTO) {
				return;
			}
			this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
		}

	}, upload_event);

	return file_dir_list;
});/**
 * 选择上传分组
 * @author trump
 * @date 13-11-05
 */
define.pack("./select_folder.photo_group",["lib","common","$","./tmpl","disk","main","./upload_route"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),

        File = common.get('./file.file_object'),
        request = common.get('./request'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),

        main =  require('main').get('./main'),
        album_mod,
        upload_route = require('./upload_route'),
        DISABLE_NEW_GROUP_CLASS = 'disabled',
        undefined;
    var Group_record = function (cfg) {
        this.id = cfg.id;
        this.name = cfg.name;
    };

    var upload_photo_group = new Module('upload_photo_group',{
        on_photogroup_change: function(){
            group_route.load_groups(true);
        },
        render: function(){
            this.listenTo(ds_photogroup_event,'add remove update',function(records,meta){
                if( meta.src === group_route ){
                    return;
                }
                this.on_photogroup_change();
            });
        }
    });

    var lib_v3_enable = false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
        }
    });

    upload_photo_group.render();
    //分组信息
    var group_route = {

        /**
         * 获取当前页面的组记录id
         * @returns {*}
         */
        getCurPageGroupId: function(){
            if(!album_mod){
                require.async('album',function(mod){
                    album_mod = mod;
                });
            }
            if( !album_mod || main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return album_mod.get('./photo').get_simple_module().get_group_id();
        },
        /**
         * 获取当前页面的组记录name
         * @returns {*}
         */
        getCurPageGroupName: function(){
            if( !album_mod ){
                require.async('album',function(mod){
                    album_mod = mod;
                });
            }
            if( !album_mod || main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return album_mod.get('./photo').get_simple_module().get_group_name();
        },
        _canceled: {},
        _group_cgi: 'http://web2.cgi.weiyun.com/pic_group.fcg',
        _request: function (url, cmd, header, body, post_process) {
            var def = $.Deferred(), me = this;
            var pb_v2 = cmd.indexOf('_') < 0 ? true : false;
            var req = request.xhr_get({
                url: url,
                cmd: cmd,
                pb_v2: pb_v2,
                header: header,
                body: body,
                cavil: true
            });
            req.ok(function (msg, body, header, data) {
                var args;
                if (post_process) {
                    args = post_process.apply(this, arguments);
                } else {
                    args = $.makeArray(arguments);
                }
                def.resolve.apply(def, args);
            }).fail(function (msg, ret, body, header, data) {
                    def.reject(msg, ret, body, header, data);
                });
            return def;
        },
        //创建分组
        create_group: function (name) {
            var me = this;
            var cmd = lib_v3_enable ? 'LibCreatePicGroup' : 'create_group';

	        if(!name || name.replace(/(^\s*)|(\s*$)/g, '') === '') {
		        mini_tip.error('需要输入分组名称才能创建分组');
		        return;
	        }

            if(lib_v3_enable) {
                this._group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return me._request(
                me._group_cgi,
                cmd,
                {},
                {
                    group_name: name
                },
                function (msg, body, header, data) {
                    return [{
                        id: body.group_id,
                        name: body.group_name
                    }, body.group_id];
                }
            ).done(function (record, total) {
                photo_group.on_create_group_ok(record.id,record.name);
                ds_photogroup_event.trigger('add',[record],{src: me});
                me.load_groups();
            }).fail(function (msg){
                mini_tip.error(msg);
            });
        },
        //加载分组
        load_groups: function (just_ask_data) {
            var cmd = lib_v3_enable ? 'LibGetPicGroup' : 'get_group';

            if(lib_v3_enable) {
                this._group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            this._request(
                this._group_cgi,
                cmd,
                {},
                {},
                function (msg, body, header, data) {
                    var groups = [],
                        pic_group;
                    pic_group = lib_v3_enable ? body.groups : body.pic_group;
                    if(pic_group) {
                        $.each(pic_group, function (index, group) {
                            groups.push(new Group_record({
                                id: group.group_id,
                                name: group.group_name
                            }, group.group_id));
                        });
                    }
                    return [groups];
                }
            ).done(function (records, total) {
                group_route.groups = records;
                if(!just_ask_data){
                    photo_group.paint_group();
                }
            }).fail(function (msg) {
                if(!just_ask_data){
                    mini_tip.error(msg);
                }
            });
        },
        /**
         * 输入的名字是否可以创建新的分组
         * @param name
         * @returns {boolean}
         */
        is_suit_for_new: function (name) {
            if (!name || !name.length) {
                return false;
            }
            return true;
        },
        /**
         * 返回所有分组信息
         * @returns {Array<Group_record>}
         */
        find_all: function () {
            if (this.groups) {
                return this.groups;
            }
            return [];
        }
    };
    var photo_group = {
        /**
         * 分组新建成功后的处理逻辑
         * @param id
         * @param name
         */
        on_create_group_ok: function(id,name){
            this.on_chose_done(id,name);
        },
        /**
         * 显示/隐藏图片分组
         * @param {jQuery} [$render_to]
         * @param {Array} files
         * @param {boolean} [force_hide]
         */
        toggle_photo_group: function ($render_to, files, force_hide) {
            var me = this;
            if(!me.is_render && (!$render_to || !files)) {
                return;
            }
            if (!me.is_render) {
                me._render($render_to);
            }
            me.when_click('group_hide');
            if( !!force_hide || !me.is_all_image(files)){
                me.get_$check_parent().hide();//隐藏分组
            } else {
                me.set_photo_group_id(0);
                me.get_$check_parent().show();//显示分组
                me.reset_photo_group();//重置默认分组
                me.paint_group();
                var groupId = group_route.getCurPageGroupId(),
                    groupName = group_route.getCurPageGroupName();
                //如若处在一个有分组模块，那么就将这些分组信息设置为默认信息上传信息
                if( groupId && groupName){//设置默认分组
                    me.$check_prent.trigger('click');
                    me.set_photo_group_id( groupId );
                    me.get_$select_btn().find('span').html( groupName +'<i></i>');
                }
            }
        },
        /**
         * 重置分组html结构
         */
        reset_photo_group: function(){
            //设置默认分组
            this.set_photo_group_id(1);
            this.get_$select_btn().find('span').html('未分组<i></i>');
        },
        /**
         * 渲染组列表
         */
        paint_group: function () {
            var place = this.$panel,array = group_route.find_all();
            if(!place){
                place = this.get_$panel();
            }
            return place.empty().append(tmpl.photo_group_items({array:array}))
                .height(array.length > 5 ? 115 : 'auto')
        },
        /**
         * 初始化渲染
         * @param $render_to
         * @private
         */
        _render: function ($render_to) {
            var me = this;
            if (me.is_render) {
                return;
            }
            group_route.load_groups();
            me.is_render = true;
            me.get_$new_input();
            me.get_$new_btn();
            me.get_$select_btn();
            (me.$check_prent =
                ( me.$check = $render_to.find('[data-id=upload_group_check]') )
                    .parent()
                )
                .on('click', function (e) {
                    e.stopPropagation();
                    var is_checked = me.get_$check().hasClass('checked');
                    if (is_checked) {
                        me.when_click('group_hide');
                    } else {
                        me.reset_photo_group();//重置默认分组
                        me.when_click('group_show');
                    }
                });
        },
        /**
         * 获取图片组ID
         * @returns {int}
         */
        get_photo_group_id: function () {
            if(this._chose_group_id){
                return this._chose_group_id - 0;
            }
            return 0;
        },
        /**
         * 设置图片组ID
         * @param id
         */
        set_photo_group_id: function (id) {
            this._chose_group_id = id;
        },
        /**
         * 是否控件上传
         * @returns {boolean}
         * @private
         */
        _is_plugin: function () {
            return upload_route.type == 'active_plugin' || upload_route.type == 'webkit_plugin';
        },
        /**
         * 获取文件名
         */
        _get_name: $.noop(),
        /**
         * 输入的文件全部为图片文件
         * @param files
         */
        is_all_image: function(files){
            if (!files || !files.length) {
                return false;
            }

            if (!this._get_file_name) {//初始化获取名称的函数
                this._get_file_name = this._is_plugin() ? function (path) {
                    var ary = path.split(/\\|\//);
                    return ary[ary.length - 1] || '';
                } : function (path) {
                    return path.name;
                };
            }
            var i = 0, file;
            //中断条件：出现不为图片的文件
            while(file = files[i]){
                if(!File.is_image(this._get_file_name(file))){
                    return false;
                }
                i+=1;
            }
            return true;
        }
    };
    $.extend(photo_group,{
        /**
         * 分组信息的包装层
         * @returns {jQuery}
         */
        get_$group: function () {
            var me = this;
            if (me.$group) {
                return me.$group;
            }
            return me.$group = $('#upload_dropdown_group')
                .hover(function () {
                    $('body').off('mouseup.out_upload_group');
                }, function () {
                    $('body').on('mouseup.out_upload_group', function () {
                        //处于新建分组的输入状态时，回到选择分组的状态 ； 否则隐藏选择分组
                        if( me.get_$wrap().css('display').toLowerCase() !== 'none' ){
                            me.get_$select_btn().trigger('click');
                        } else {
                            me.when_click('out_upload_group');
                        }
                    });
                });
        },
        /**
         * 选择指定分组的下拉框按钮
         * @returns {jQuery}
         */
        get_$select_btn: function () {
            var me = this;
            if (me.$select_btn) {
                return me.$select_btn;
            }
            return (me.$select_btn = $('#upload_select_group')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_select_group');
            });
        },
        /**
         * 下拉面板容纳所有的组信息
         * @returns {jQuery}
         */
        get_$panel: function () {
            var me = this;
            if (me.$panel) {
                return me.$panel;
            }
            me.$panel = $('#upload_group_panel');

            me.$panel.on('click', 'li', function (e) {
                e.preventDefault();
                var _self = $(this).find('a'),
                    id = _self.attr('data-group-id');
                if (!id || id == 0) {
                    return;
                }
                me.on_chose_done(id,_self.text());
            });
            return me.paint_group();
        },
        /**
         * 当被选中一个分组时的处理逻辑
         * @param group_id 组id
         * @param group_name 组名
         */
        on_chose_done: function(group_id,group_name){
            var me = this;
            me.get_$select_btn().find('span').html(group_name+'<i></i>');//修改选中的分组TEXT
            me.set_photo_group_id(group_id);
            me.when_click('li');
        },
        /**
         * 新建分组的输入框和创建按钮的 容器
         * @returns {jQuery}
         */
        get_$wrap: function () {
            return this.$add_wrap || ( this.$add_wrap = $('#upload_new_group_wrap'));
        },
        /**
         * 新建分组的创建按钮
         * @returns {jQuery}
         */
        get_$new_btn: function () {
            if (this.$new_btn) {
                return this.$new_btn;
            }
            var me = this;
            return (me.$new_btn = $('#upload_new_btn'))
                .on('click', function (e) {
                    e.stopPropagation();
                    group_route.create_group(me.get_$new_input().val())
                });
        },
        /**
         * 新建分组的输入框
         * @returns {jQuery}
         */
        get_$new_input: function () {
            if (this.$new_input) {
                return this.$new_input;
            }
            var me = this;
            return (me.$new_input = $('#upload_new_group_input'))
                .on('focus', function (e) {
                    e.stopPropagation();
                    if (this.value === '新建分组') {
                        this.value = '';
                    }
                    me.$new_btn[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                })
                .on('keyup', function (e) {
                    e.stopPropagation();
                    me.$new_btn[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                });
        },
        /**
        * 新建分组的入口按钮
        * @returns {jQuery}
        * */
        get_$add_btn: function () {
            var me = this;
            if (me.$add_btn) {
                return me.$add_btn;
            }
            return (me.$add_btn = $('#upload_new_group_btn')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_new_group_btn');
                me.get_$new_input().focus().val('');
            });
        },
        /**
         * checkbox 选择一个指定的分组的CheckBox对象
         * @returns {jQuery}
         */
        get_$check: function () {
            return this.$check;
        },
        /**
         * checkbox的包装层
         * @returns {jQuery}
         */
        get_$check_parent: function () {
            return this.$check_prent;
        },
        /**
         * 各种操作的UI展示效果
         * @param target
         */
        when_click: function (target) {
            switch (target) {
                case('li'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('upload_select_group'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().show();
                    this.get_$wrap().hide();
                    this.get_$panel().show();
                    return;
                case('upload_new_group_btn'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().hide();
                    this.get_$wrap().show();
                    this.get_$panel().show();
                    return;
                case('out_upload_group'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('group_hide'):
                    this.get_$group().hide();//隐藏分组信息
                    this.get_$check().removeClass('checked');
                    return;
                case('group_show'):
                    this.get_$group().show();//隐藏分组信息
                    this.get_$check().addClass('checked');
                    return;
            }
        }
    });

    return photo_group;
});/**
 * 上传选择文件框
 * @author bondli
 * @date 13-7-3
 */
define.pack("./select_folder.select_folder",["lib","common","$","./tmpl","disk","main","./select_folder.file_dir_list","./upload_folder.create_dirs","./select_folder.select_folder_msg","./select_folder.select_folder_view","./select_folder.photo_group","./upload_route"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        JSON = lib.get('./json'),

        security = lib.get('./security'),

        constants = common.get('./constants'),
        Module = common.get('./module'),


        upload_event = common.get('./global.global_event').namespace('upload2'),
        global_event = common.get('./global.global_event'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        query_user = common.get('./query_user'),

	    main_mod = require('main'),
        main = main_mod.get('./main'),
	    main_ui = main_mod.get('./ui'),

        widgets = common.get('./ui.widgets'),
        text = lib.get('./text'),
        File = common.get('./file.file_object'),

        file_dir_list = require('./select_folder.file_dir_list'),

        user_log = common.get('./user_log'),
        request = common.get('./request'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        plugin_detect = common.get('./util.plugin_detect.js'),
        create_dirs = require('./upload_folder.create_dirs'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        select_folder_view = require('./select_folder.select_folder_view'),
        photo_group = require('./select_folder.photo_group'),
        upload_route = require('./upload_route'),

        $body = $(document.body),

        //mac系统, safari 下不显示下载按钮
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        dialog,

        $icon, $name,

        undefined;

    var select_folder = new Module('upload_select_folder', {

        ppdir : '',  //上传到的父级目录

        pdir : '',   //上传到的目录

        ppdir_name : '',  //上传到的父级目录名称

        pdir_name : '',  //上传到的目录名称

        files : [],  //选定要上传的文件

        upload_plugin : {},  //上传对象

        upload_type : 'plugin',  //上传类型，plugin,form,flash

        $tree_ct : '',   //目录树容器

        dir_paths : [],  //选择的目录路径名称

        dir_id_paths : [], //选择的目录路径ID

        upload_mode : 1,  //上传模式，1：上传文件，2：上传文件夹

        cache : [],

        dir_level : 1, //所选目录的层级

        //初始化
        render: function () {
            var me = this;
            var read_mode = scr_reader_mode.is_enable();

	        me.manage_toggle = main_ui.get_$manage();//上传小红点
	        var manage_num = me.manage_toggle.find('.j-manage-num');

            select_folder_view.render();

            //根据当前的上传类型，确定按钮
            var upload_button = [];
            if ( me.upload_type == 'plugin' || plugin_detect.is_newest_version() || (!constants.IS_APPBOX && $.browser.chrome) || upload_route.is_support_html5_pro() ) {
                upload_button.push({
                    id: 'OK', text: '开始上传', aria_label: read_mode ? '开始上传' : '', tips: 'jisu', klass: 'g-btn g-btn-blue', visible: true
                });
                upload_button.push({
                    id: 'CANCEL',
                    text: '取消',
                    klass: 'g-btn g-btn-gray'
                });
            }
            else {
                if(gbIsWin && !read_mode){ // 读屏软件很难处理复杂的弹出层逻辑，这里屏蔽掉安装极速上传控件的提示 - james
                    upload_button.push({
                        id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'g-btn g-btn-blue', visible: true
                    });
                }
                upload_button.push({
                    id: 'OK', text: '普通上传', aria_label: read_mode ? '开始上传' : '', klass: 'g-btn g-btn-gray', visible: true
                });
            }

            if (!dialog) {
                dialog = new widgets.Dialog({
                    title: '上传文件',
                    empty_on_hide: false,
                    destroy_on_hide: false,
                    content: select_folder_view.$dom,
                    tmpl: tmpl.dialog,
                    mask_bg: 'ui-mask-white',
                    buttons: upload_button,
                    handlers: {
                        OK: function () {
                            submit();
                            return false;
                        },
                        OTHER: function() {
                            other();
                            return false;
                        }
                    }
                });
                //当关闭或者隐藏的时候
                me.listenTo(dialog, 'hide', function (isUser) {
                    me.hide();
                    file_dir_list.hide();
                    if(isUser == false) {
                        try{
                            if(me.upload_type == "form") {
	                            upload_route.upload_plugin.reset();
                            }
                        }
                        catch(e) {}
                    }
                });
            }
            // 提交
            var submit = function () {

                if( me.upload_mode == 2 ) {
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO) {
                        select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                        return;
                    }
                    //执行创建目录前先判断目录层级是否太深
                    if( me.get_dir_level() + me.files.select_dir_level >= 20 ){
                        select_folder_view.set_error_text('目录所在层级过深，请上传至其他目录');
                        return;
                    }
                }
                else{
                    //表单模式不允许上传相册
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.upload_type == 'form' ) {
                        select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                        return;
                    }

                    //上传到相册需要过滤文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.getPhotoFiles() == false ) {
                        return;
                    }

                    //获取上传到相册的文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO ) {
                        me.files = me.getPhotoFiles();
                    }
                }

                //动画效果
                var $dialog = dialog.get_$el();

                widgets.mask.hide('ui.widgets.Dialog');

                var width = $dialog.width(),
                    marginLeft = $dialog.css('marginLeft');
	            manage_num.hide();
	            $dialog.animate({
		            "width": "15px",
		            "height": "15px"
	            }, 'slow', function() {
		            //最终隐藏起来
		            $dialog.hide();
		            dialog.hide();
		            $dialog.css({
			            "width": width,
			            "height": 'auto',
			            "marginLeft": marginLeft
		            });

		            //小红点动画
		            var isShow = manage_num.is(':visible');
		            main_ui.show_manage_num(function() {
			            if(!isShow) {
				            manage_num.hide();
			            }
		            });
	            });

                //console.log(me.ppdir, me.pdir, me.ppdir_name, me.pdir_name, me.dir_paths, me.dir_id_paths);
                if( me.upload_mode == 2 ) {
                    create_dirs.init(me.files, me.upload_plugin, {
                        'ppdir': me.ppdir,
                        'pdir': me.pdir,
                        'ppdir_name': me.ppdir_name,
                        'pdir_name': me.pdir_name,
                        'dir_paths': me.dir_paths,
                        'dir_id_paths': me.dir_id_paths
                    });
                }
                else{
                    upload_event.trigger('add_upload', me.upload_plugin, me.files, {
                        'ppdir': me.ppdir,
                        'pdir': me.pdir,
                        'ppdir_name': me.ppdir_name,
                        'pdir_name': me.pdir_name,
                        'dir_paths': me.dir_paths,
                        'dir_id_paths': me.dir_id_paths
                    });
                }


                // for ARIA 开始上传后，将焦点设置到上传按钮以便盲人继续选择文件 - james
                if (scr_reader_mode.is_enable()) {
                    upload_route.focus_upload_button();
                }
            };

            // 点击安装控件或者装新版QQ
            var other = function() {
                if(constants.IS_APPBOX){
                    window.open('http://im.qq.com/qq/');
                }
                else{
                    dialog.hide();
                    upload_event.once('upload_dialog_show',function(){
                        dialog.show();
                        //显示“修改按钮”
                        select_folder_view.show_chdir_btn();
                        //调整按钮提示信息框位置
                        select_folder_view.reset_box_pop_postion();
                    });
                    upload_event.trigger('install_plugin', '您还未安装微云极速上传控件', 'UPLOAD_SUBMIT_BTN_PLUGIN' );  //0, 上报用
                }
                return false;
            }
        },

        //设置node所在的dir层数
        set_dir_level: function (node) {
            var i = 0;
            while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                i++;
            }
            this.dir_level = i;
        },

        get_dir_level: function () {
          return this.dir_level;
        },

        //判断是否选择了非图片文件
        hasNotPhotoFiles: false,

        //从选择的文件中获取照片文件
        getPhotoFiles: function () {
            var me = this,
                __files = [],
                photo_type = ['jpg','jpeg','gif','png','bmp'];

            $.each(me.files, function(i, n){
                if( me.upload_type == 'plugin' ) {
                    var ary = n.split(/\\|\//);
                    var file_name = ary[ary.length - 1] || '';
                }
                else if( me.upload_type == 'flash' ) {
                    var file_name = n.name;
                }

                var file_type = File.get_type(file_name);

                if( $.inArray(file_type, photo_type) != -1 ) {
                    __files.push( n );
                }
                else{
                    me.hasNotPhotoFiles = true;
                }
            });

            if( __files.length == 0 ){
                return false;
            }
            else {
                return __files;
            }

        },

        //超过大小的提示
        show_max_size_dialog : function ( wording, btn ) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">'+wording+'</span></p>');
            var dialog = new widgets.Dialog({
                title: '上传提醒',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog2,
                buttons: [ btn ],
                handlers: {
                    OTHER: function(){
                        var url = (constants.IS_APPBOX) ? 'http://im.qq.com/qq/' :
                        'http://www.weiyun.com/plugin_install.html?from=ad';
                        window.open(url);
                        return false;
                   }
                }
            });
            dialog.show();
        },

        //超过4G的提示
        flash_max_size_4G_tips : function () {
            var wording = select_folder_msg.get('NO_SUPPORT_G4_FILE');
            var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            this.show_max_size_dialog(wording, btn);
        },

        //超过2G的提示
        flash_max_size_2G_tips : function () {
            if( !$.browser.msie ){
                var wording = select_folder_msg.get('CHANGE_IE_TO_SUPPORT_G4_FILE');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            }
            else{
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            /*
            var top = '243px',right = '-20px';
            if(constants.IS_APPBOX){
                top = '193px';
                right = '-65px';
            }
            */
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //单文件超过300M的提示
        flash_max_size_tips : function () {
            //判断是否支持装控件
            if ( $.browser.safari || !gbIsWin ) {
                var wording = select_folder_msg.get('BROWSER_NO_SUPPORT_M300_FILE');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            }
            else {
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //获取当前选择目录的名称
        get_cur_node_paths: function() {
            //获取当前的文件位置，如果是“最近文件”，“回收站”设置为“网盘”
            var node,
                node_name,
                ret_name = upload_route.get_root_name();
            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                //var node = file_list.get_cur_node() || file_list.get_root_node();
                node = file_list.get_cur_node(); 
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_name = node.get_name();

                this.pdir = node.get_id();
                this.ppdir = node.get_parent().get_id();
                this.pdir_name = node_name;
                this.ppdir_name = node.get_parent().get_name() || '';

                //设置所选目录的层级
                this.set_dir_level(node);
            } 
            else 
            {
                var node_id = query_user.get_cached_user().get_main_key();
                node_name = query_user.get_cached_user().get_main_dir_name();

                this.pdir = node_id;
                this.ppdir = query_user.get_cached_user().get_root_key();
                this.pdir_name = node_name;
                this.ppdir_name = '';

                //设置所选目录的层级
                this.dir_level = 1;
            }
            if( node_name == '微云' || node_name == '网盘' ){
                return [ret_name];
            }
            var path = [node_name];
            while(node_name != '微云' && node_name != '网盘') {
                node = node.get_parent();
                node_name = node.get_name();
                path.unshift(node_name);
            }
            return path;
        },

        //显示默认的路径
        set_default_path_name : function(dir_paths, is_upfolder) {
            this.measure_upload_paths(dir_paths, true);
        },
        //显示上传位置选择框
        show: function (files, upload_plugin, upload_type) {

            //先隐藏上传管理器
            //global_event.trigger('upload_to_min');

            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = upload_type;

            this.upload_mode = 1;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();


            //根据选择的文件个数，获取文件名称，文件后缀
            var full_name = '',
                file_name = '',
                file_ext = '';
            if( this.upload_type == 'plugin' ) {
                var ary = this.files[0].split(/\\|\//);
                full_name = ary[ary.length - 1] || '';
            }
            else if( this.upload_type == 'flash' ) {
                full_name = this.files[0].name;
            }
            else {
                full_name = this.files[0].name;
            }

            //flash上传，并且是单文件需要判断是否超过大小
            if ( this.upload_type == 'flash' && this.files.length == 1 ) {
                var cur_file_size = this.files[0].size;
                //判断是否大于4G,这个时候size=-1
                if( cur_file_size === -1 ){
                    this.flash_max_size_2G_tips();
                    return;
                }
                //判断是否大于2G
                if( cur_file_size > 1024 * 1024 * 1024 * 2 ){
                    this.flash_max_size_2G_tips();
                    return;
                }
                //限制:300M
                else if( cur_file_size > 1024 * 1024 * 300 ){
                    this.flash_max_size_tips();
                    return;
                }
            };

            var is_all_image = photo_group.is_all_image( files ); //是否全都是图片

            //处理文件名和文件icon
            if( this.files.length == 1 ){
                file_ext = File.get_type(full_name);
                if(file_ext == '') {
                    file_ext = 'file';
                }
                //截取
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );
            }
            else{ //多个文件
                var m_word = is_all_image ? '张图片' : '个文件';
                file_ext = File.get_type(full_name);
                if(file_ext == '') {
                    file_ext = 'file';
                }
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 16 : 20 ) + ' <em>等'+ (this.files.length) +m_word+'</em>';
                full_name = full_name + ' 等'+ (this.files.length) +m_word;
            }
            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var paths = this.get_cur_node_paths();

            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();

            select_folder_view.set_box_pop();

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(paths);

            if(is_all_image) {
                photo_group.toggle_photo_group(select_folder_view.$dom,files);
            }

            //上报用户选了多少个文件,临时上报就不写入ops的配置了
            user_log(59010,0,{"file_num": this.files.length});

        },

        /**
         * 上传文件夹特殊处理下
         */
        show_by_upfolder: function (files, upload_plugin) {
            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = 'plugin';

            this.upload_mode = 2;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();

            //根据选择的文件个数，获取文件名称，文件后缀
            var file_ext = 'file',
                full_name = files.dir_name,
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );

            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var paths = this.get_cur_node_paths();


            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();
            dialog.set_title('上传文件');

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(paths, 1);

            photo_group.toggle_photo_group(select_folder_view.$dom,files);

        },

        //设置目录列表隐藏
        hide : function() {
            select_folder_view.$tree_ct[0].style.display = 'none';
            this.trigger('hide');
            photo_group.toggle_photo_group(null,null,true);
        },

        /**
         * 设置提交按钮为禁用
         */
        set_submit_disable : function () {
            var btn = dialog.get_$el().find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.find('.btn-inner').addClass('disabled');
            }
            else {
                btn.find('.btn-inner').addClass('disabled');
            }

            dialog.set_button_enable('OK', false);
        },

        /**
         * 启用提交按钮
         */
        set_submit_enable : function () {
            var btn = dialog.get_$el().find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.find('.btn-inner').removeClass('disabled');
            }
            else {
                btn.find('.btn-inner').removeClass('disabled');
            }
        },
    
        //更新上传到的路径显示
        update : function( ppdir, pdir, dir_paths, dir_id_paths ){
            this.ppdir = ppdir;
            this.pdir = pdir;
            //$('#disk_upload_upload_to').html( dir_paths[dir_paths.length-1] );
            //设置所选目录的层级
            this.dir_level = dir_paths.length;

            select_folder_view.set_error_text(''); //用户选择变更的时候将错误信息隐藏

            if( this.pdir == constants.UPLOAD_DIR_PHOTO ) {
                //表单模式不允许上传相册
                if( this.upload_type == 'form' ){
                    select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //文件夹模式不允许上传到相册
                if( this.upload_mode == 2 ) {
                    select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //上传到相册需要过滤文件
                if( this.getPhotoFiles() == false ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                    //按钮也灰掉
                    this.set_submit_disable();
                    return;
                }

                //选的文件中有部分是图片，有部分是非图片的时候也需要提示
                if( this.hasNotPhotoFiles == true ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                }
            }
            else{
                select_folder_view.set_album_text();
                this.set_submit_enable();
            }

            this.measure_upload_paths(dir_paths);

            //增加选择的目录的路径和路径ID
            this.dir_paths = dir_paths;
            this.dir_id_paths = dir_id_paths;
            this.ppdir_name = '';
            this.pdir_name = dir_paths[dir_paths.length - 1];
            if( dir_paths.length > 1 ) {
                this.ppdir_name = dir_paths[dir_paths.length - 2];
            }
        },

        measure_upload_paths: function(dir_paths, is_default) {
            var $paths = $('#disk_upload_upload_to'),
                paths = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
            $paths.text(paths);
            $paths.attr('title', paths);

            //判断长度是否超出
            var size = text.measure($paths, paths),
                limit_width = is_default ? 280 : 320;
            if( size.width > limit_width ) {
                var len = dir_paths.length;
                //$('#disk_upload_upload_to').html( text.smart_sub(dir_paths[len-1], 20) );
                var output = [];
                if( len>4 ) {
                    var output = text.smart_sub(dir_paths[len-2], 8) + '\\' + text.smart_sub(dir_paths[len-1], 8);
                    $paths.text( upload_route.get_root_name()+'\\...\\' + output );
                }
                else {
                    $.each(dir_paths,function(i,n) {
                        output.push( text.smart_sub(n,5) );
                    });
                    $paths.text(output.join('\\'));
                }
            }
        }
    });

    //定义一个选择的目录的事件
    select_folder.on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ){
        select_folder.update( ppdir, pdir, dir_paths, dir_id_paths );
    });

    module.exports = select_folder;
});/**
 * 上传:选择上传位置提示信息wording
 * @author bondli
 * @date 13-8-29
 */
define.pack("./select_folder.select_folder_msg",["$","common"],function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants'),

        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1;


    var _wording = ($.browser.safari || !gbIsWin) ? 'Flash' : '极速上传',
    	_install_qq_url = 'http://im.qq.com/',
    	_use_plugin_tips = ($.browser.msie) ? '<br>– 文件夹上传' : '',

    select_folder_msg = {
    	'NO_SUPPORT_UPLOAD_TO_PHOTO'     : '不支持上传文件夹到相册',
    	'PLEASE_INSTALL_PLUGIN_TO_PHOTO' : '请安装'+_wording+'控件以支持上传到相册',
    	'DIR_LEVEL_REACH_MAX_LIMIT'      : '目录所在层级过深，请上传至其他目录',
    	'NO_SUPPORT_G4_FILE'             : '文件大小超出限制，暂时无法上传。',
    	'CHANGE_IE_TO_SUPPORT_G4_FILE'   : '文件大小超出限制，暂时无法上传。',
    	'FLASH_UPLOAD_FILE_THAN_M300'    : '您要上传的文件超过300M，请启用极速上传。',
    	'BROWSER_NO_SUPPORT_M300_FILE'   : '您的浏览器暂不支持上传300M以上的文件。',
    	'ONLY_SUPPORT_UPLOAD_PHOTO'      : '仅可上传图片文件',
    	'USE_PLUGIN_UPLOAD'              : '启用极速上传，立即享受：'+_use_plugin_tips+' <br>– 极速秒传 <br>– 断点续传'
    };

    //APPBOX中重置部分变量
    if( constants.IS_APPBOX ){
    	select_folder_msg['FLASH_UPLOAD_FILE_THAN_M300'] = '您要上传的文件超过300M，请安装最新版QQ。';
    	select_folder_msg['USE_PLUGIN_UPLOAD'] = '点击安装新版QQ启用极速上传，立即享受：<br>– 极速秒传 <br>– 断点续传';
    	select_folder_msg['NO_SUPPORT_G4_FILE'] = '文件大小超出限制，暂时无法上传。';
    	select_folder_msg['CHANGE_IE_TO_SUPPORT_G4_FILE'] = '文件大小超出限制，请安装最新版本QQ。';
    }
    
    module.exports = {
        get : function( name ){
            return select_folder_msg[ name ];
        }
    };


});/**
 * 上传:选择上传位置UI
 * @author bondli
 * @date 13-8-29
 */
define.pack("./select_folder.select_folder_view",["lib","common","$","./tmpl","disk","main","./select_folder.file_dir_list","./select_folder.select_folder_msg"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),
        query_user = common.get('./query_user'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        Module = common.get('./module'),

        main = require('main').get('./main'),

        file_dir_list = require('./select_folder.file_dir_list'),
        select_folder_msg = require('./select_folder.select_folder_msg'),

        undefined;

    var select_folder_view = new Module('select_folder_view', {

    	render : function () {
            var me = this;
            me.$dom = $(tmpl.select_folder());        //位置选择框对象
            me.$icon = me.$dom.find('[data-id=icon]');    //文件图标
            me.$name = me.$dom.find('[data-id=name]');    //文件名
            me.$chdir = me.$dom.find('[data-btn-id=CHDIR]');    //修改按钮
            me.$tree_ct = me.$dom.find('[data-id=tree-container]');  //目录树对象

            me.$chdir.on('click',function(e){
            	e.preventDefault();
                $(this).hide();
                me.click_chdir();
            });

        },

        /**
         * 显示修改路径的按钮
         */
        show_chdir_btn : function() {
        	this.$chdir.show();
        },

        /**
         * 显示icon和文件名
         */
        show_icon_and_name : function(icon, fullname, name) {
        	this.$icon.attr('class', 'filetype icon icon-m icon-' + icon + '-m');
        	this.$name.attr('title', fullname).html(name);
        },

        /**
		 * 点击修改默认路径
         */
        click_chdir : function(){
        	var me = this;
        	me.$tree_ct.fadeIn();

        	var node,
        		node_id;

            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                node = file_list.get_cur_node();
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_id = node.get_id();
            } 
            else 
            {
                node_id = query_user.get_cached_user().get_main_key();
            }
            //当前停留在相册的时候
            if(main.get_cur_mod_alias() == 'photo'){
                node_id = constants.UPLOAD_DIR_PHOTO;
            }

            //加载目录列表
            file_dir_list.show( me.$tree_ct, node_id );

            //调整选择框的位置
            ui_center.update( me.$dom.closest('#_upload_dialog') );

            //更新相册的文字显示和去掉上次选中的样式
            me.set_album_text();
            me.clear_album_selected();
        },
        /**
         * 设置按钮提示信息框位置
         */
        reset_box_pop_postion: function() {
            var me = this;
            if( constants.IS_APPBOX ){
                me.set_box_pop();
                me.$box_pop.find('.ui-pop-darr').show();
                me.$box_pop.find('.ui-pop-uarr').hide();
            }
            else{
                me.set_box_pop();
            }
        },
        /**
         * 设置按钮提示信息框
         */
        set_box_pop : function(right) {
            var me = this;
            me.$box_pop = $('#_upload_box_pop');
            me.$box_pop.find('.ui-pop-uarr').show();
            me.$box_pop.find('.ui-pop-darr').hide();

            if(constants.IS_APPBOX){
                me.$box_pop.css({top:'auto',right: right || '30px',bottom:'-70px'});
            } else {
                me.$box_pop.css({top:'auto',right: right || '80px',bottom:($.browser.msie ? '-60px' : '-40px')});
            }
            new Pop_panel({
                $dom: me.$box_pop,
                host_$dom: $('#_upload_dialog a[data-btn-id=OTHER]'),
                show: function () {
                    me.$box_pop.show();
                },
                hide: function () {
                    me.$box_pop.hide();
                },
                delay_time: 50
            });
        },
        /**
         * 设置相册目录旁边的文字
         */
        set_album_text : function (text) {
            var default_text = '<i style="visibility:hidden;"></i>相册';
            text = (text) ? '<label>（'+ text +'）</label>' : '';
            $('#album').html(default_text + text);
        },

        /**
         * 清除相册上的选中样式
         */
        clear_album_selected : function() {
        	$('#_file_box_node_-1').children('a').removeClass('selected');
        },

        set_error_text : function(text) {
            var $el = $('#tips-err');
            $el.text(text);
            if(text.length){
                $el.show();
            }
            else {
                $el.hide();
            }
        }

    });

    //select_folder_view.render();

    module.exports = select_folder_view;

});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.count_box",["lib"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        BOX = function () {
            var me = this;
            me.max = 4;//最大缓冲区长度
            me.cur = 0;//当前缓冲区位置
            me.speed = 0;//输出的速度
            me.total = 0;//缓冲区内总大小
            me.zero_times = 0;//连续出现速度为0的次数
            me.last= {
                time: 0,
                processed: 0,
                task: null
            };
        };
    BOX.prototype = {
        set: function (speed) {//设置平均速度
            var me = this;
            /*me.cur += 1;
            if (me.max === me.cur) {
                me.cur -= 1;
            }
            me.total += speed;
            //console.log('total:',me.total,'cur:',me.cur);
            me.total = me.speed = ( me.total / me.cur ) | 0;*/
            me.speed = speed;
            me.zero_times = me.speed > 0 ? 0 : (me.zero_times + 1);
        },
        get: function () {//获取平均速度
            return this.speed;
        },
        reset: function () {
            var me = this;
            me.cur = me.speed = me.total = me.zero_times = 0;
            me.init_task(null, 0);
        },
        init_task: function (task, time) {
            var me = this;
            me.last = {
                time: time,
                processed: task && task.processed || 0,
                task: task
            }
            //console.log('time:',me.last.time,'processed:',me.last.processed);
            //console.log('new speed:',speed);
        }
    };
    var upload = new BOX(), //上传
        downloads = {};//下载
    var count_box = {
        /**
         * 获取当前的网络速度
         * @param [running]
         * @returns {*}
         */
        get_speed: function (running) {
            var time = +new Date(),
                running = running || upload,
                last_task_speed = 0;
            if (running.last.time) {
                if (running.last.task === this) {
                    running.set(Math.max((this.processed - running.last.processed) / (time - running.last.time) * 1000 | 0, 0));
                } else {
                    //一个计算周期内上一个任务已经完成了，则用完成的大小加上当前完成的大小来计算速度
                    if(!running.last.task.is_miaoc()) {
                        last_task_speed = Math.max((running.last.task.processed - running.last.processed + this.processed) / (time - running.last.time) * 1000 | 0, 0);
                    }
                    running.reset();
                }
            }
            running.init_task(this, time);

            return last_task_speed || running.get();
        },
	    /**
	     * 获取单通道上传速度
	     * 单通道速度 = 分片大小*速度*通道数/(分片大小*通道数 +（通道数-1）*速度*架平耗时)
	     * 架平耗时暂时锁定200ms
	     * @param [speed]
	     * @returns {*}
	     */
	    get_cn_speed: function (running, speed) {
		    if(running && running.channel_count && running.channel_count > 1) {
			    return parseInt(running.fragment * speed * running.channel_count / (running.fragment * running.channel_count + (running.channel_count - 1) * speed * 0.2));
		    } else {
			    //只有一个通道就不用算了，通道速度就是总速度
			    return speed;
		    }
	    },
	    /**
	     * 获取增量上传速度
	     * 增量速度 = (速度 - 单通道速度)*(95 + rand()%10)/100
	     * 随机在95% - 105%之间
	     * @param [speed]
	     * @returns {*}
	     */
	    get_ex_speed: function (speed, cn_speed) {
		    return parseInt((speed - cn_speed) * (95 + parseInt(Math.random() * 10)) / 100);
	    },
        /**
         * 重置速度计算器
         * @param [running]
         */
        reset_speed: function (running) {
            (running || upload).reset();
        },
        delay_times:{
            'upload_flash':120,
            'active_plugin':120,
            'webkit_plugin':120,
            'h5_flash_plugin': 120
        },
        /**
         * 是否网络延迟：一段时间内，同一个文件传输的量没有变化，就被认为网络超时
         * @returns {boolean}
         */
        network_is_delay: function () {
            return upload.zero_times > count_box.delay_times[upload.last.task.upload_type];
        },
        /**
         * 获取当前正在计速的文件
         * @param [running]
         * @returns {null}
         */
        get_task: function (running) {
            return (running || upload).last.task;
        },

        down: {
            get_speed: function (key) {
                return count_box.get_speed.call(this, downloads[key]);
            },
            reset_speed: function () {
                for (var key in downloads) {
                    count_box.reset_speed(downloads[key]);
                }
            },
            remove: function (key) {
                delete downloads[key];
            },
            add: function (key) {
                if(!downloads[key]){
                    downloads[key] = new BOX();
                }
            }
        }
    };
    return count_box;
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.download",["lib","./tool.upload_cache","./speed.count_box","./tool.bar_info"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        Cache= require('./tool.upload_cache'),
        bar_info,//统计信息UI模块
        BOX= require('./speed.count_box'),//正真的速度计算模块

        done_states = ' done error ',//已完成的状态
        get_bar = function(){
            return bar_info || (bar_info = require('./tool.bar_info'));
        },
        watch_fn = function () {
            if (Cache.get_dw_main_cache().is_done()) {//任务已经完成，返回
                return;
            }
            var cache = Cache.get_dw_main_cache().get_cache(),
                speed = 0;
            for (var key in cache) {
                if(key !== 'length'){
                    var unit = cache[key];
                    if( -1 !== done_states.indexOf(' '+ unit.state + ' ') ){
                        BOX.down.remove(key);
                    } else{
                        BOX.down.add(key);
                        var tmp = BOX.down.get_speed.call(unit,key);
                        speed += tmp;
                    }
                }
            }
            get_bar().update(get_bar().OPS.DOWN_SPEED, speed );
        };

    return {
        /**
         * 速度计算轮询函数
         */
        watch_fn: watch_fn,
        /**
         * 重置计速
         */
        reset: function(){
            BOX && BOX.reset_speed();
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.speed_task",["./tool.upload_cache","./speed.upload","./speed.download","lib","./tool.bar_info"],function (require, exports, module) {
    var Cache = require('./tool.upload_cache'),
        up = require('./speed.upload'),//上传测算速度模块
        dw = require('./speed.download'),//下载测算速度模块
        console = require('lib').get('./console'),
        inter_code,
        bar_info,
        get_bar = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        };
    return {
        /**
         * 妙传文件，重设速度
         * @param speed
         */
        set_maioc: function (speed) {
            up.set_miaoc_speed(speed);
        },
        /**
         * 开启 速度检查定时器
         */
        start: function () {
            if (!inter_code) {
                var up_num = Cache.get_up_main_cache().has_task_running(),//有上传任务处于运行状态
                    dw_num = Cache.get_dw_main_cache().has_task_running();//有下载任务处于运行状态
                if (up_num + dw_num === 1) {//只有一种任务在跑，并且没有被当前任务watch，才进行新的watch
                    if (up_num === 1) {
	                    setTimeout(up.watch_fn, 500);//先跑一次让速度外显出来
                        inter_code = setInterval(up.watch_fn, 2000);//上传频率2秒
                    } else {
                        inter_code = setInterval(dw.watch_fn, 1500);//下载频率1.5秒
                    }
                }
            }
            get_bar().toggle_speed_msg();
        },
        /**
         * 停止 速度检查定时器
         */
        stop: function () {
            if (inter_code) {
                clearInterval(inter_code);
                inter_code = false;
                dw.reset();
                up.reset();
            }
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.upload",["lib","common","./tool.upload_cache","./speed.count_box","./tool.bar_info"],function (require, exports, module) {
    var lib = require('lib'),
        console = lib.get('./console'),
	    common = require('common'),
	    huatuo_speed = common.get('./huatuo_speed'),

        Cache = require('./tool.upload_cache'),
        BOX = require('./speed.count_box'),//正真的速度计算模块
        bar_info,//统计信息类
        get_bar = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        },

        two_m = Math.pow(2, 21),//2M
        limit_time = {//检查最大次数
            'upload_flash': 0,
            'webkit_plugin': 0,
            'active_plugin': 0
        },

        speed = 0,
	    cnSpeed = 0,    //ChannelSpeed，单通道上传速度
	    exSpeed = 0,    //增量速度

	//上报测速相关变量
	    report_point = '21254-1-1',
	    report_point2 = '21254-1-25',
	    report_queue = [],
	    report_interval = 0,

        able_state = {'upload_file_update_process': 1},//能获取速度的运行状态
    //计算平均速度，单位为KB/s
	    get_avg_speed = function() {
		    var count = 0;
		    for(var i=0, len=report_queue.length; i<len; i++) {
			    count += report_queue[i];
		    }
		    report_queue = [];
		    return parseInt(count / len / 1024);
	    },
	    report_speed = function() {
		    var running = Cache.get_curr_real_upload();
		    if (running) {//可获取速度的状态
			    if(report_queue.length) {
				    var avg_speed = get_avg_speed(),
					    avg_speed_single;
				    if(running.upload_type === 'upload_html5_pro') {
					    report_point = '21254-1-24';
					    if(running.channel_count) {
						    avg_speed_single = parseInt(avg_speed / running.channel_count);
						    huatuo_speed.store_point(report_point2, 1, avg_speed_single);
						    huatuo_speed.report(report_point2, false);
					    }
				    } else {
					    report_point = '21254-1-1';
				    }
				    huatuo_speed.store_point(report_point, 1, avg_speed);
				    huatuo_speed.report(report_point, false);
			    }

			    //停止上报上传测速并清空变量
			    if(running.state == 'done') {
				    clearInterval(report_interval);
				    report_queue = [];
			    }
		    }
	    },
	    make_speed = function () {// 获取当前速度  {number :　0: 网络超时， 1：有可用速度 ,-1:不能获取速度的状态 }
		    var running = Cache.get_curr_real_upload();
		    if (running && running.state != 'done') {//可获取速度的状态
			    speed = BOX.get_speed.call(running);//获取上传速度
			    //极速上传获通道速度和增量速度用于外显
			    if(running.upload_type === 'upload_html5_pro') {
				    cnSpeed = BOX.get_cn_speed.call(running, running, speed);
				    exSpeed = BOX.get_ex_speed.call(running, speed, cnSpeed);
			    }
			    if (speed === 0 && BOX.network_is_delay()) {
				    return 0;
			    } else {
				    //上传大于2M的文件才上报测速
				    if(running.file_size >= 2 * 1024 * 1024) {
					    if(speed) {
						    report_queue.push(speed);
					    }
					    if(!report_interval) {
						    //每十秒取平均值上报一次
						    report_interval = setInterval(function() {
							    report_speed();
						    }, 5000);
					    }
				    }
				    return 1;
			    }
		    } else {//不能获取速度状态
			    speed = -1;
			    //停止上报上传测速并清空变量
			    report_speed();
			    clearInterval(report_interval);
			    report_queue = [];
			    return 1;
		    }
	    },
        watch_fn = function () {
            if (Cache.get_up_main_cache().is_done()) {//上传任务已经完成，返回
                return;
            }
            var sign = make_speed();
	        var task = BOX.get_task(),//获取 计算速度的 上传对象
		        state = task.state,
		        type = task.upload_type;

            if (state != 'file_sign_update_process' && state != 'error' && sign === 0) {//超时
                if (task && type !== 'upload_form') {//表单上传不参与 超时重试，form有自己的超时机制
                    var time = task.re_try_time ? task.re_try_time : (task.re_try_time = 0);
                    if (time >= limit_time[type]) {
                        console.debug('re_try times over max ,trigger error');
                        //if(task.get_is_retry() === false){ //判断是否重试，不是重试就重来一次
                        //    task.change_state('re_try');
                        //}
                        //else{
                            task.change_state('error', 10001);//自动重试后，报出超时错误
                        //}

                        task.re_try_time = 0;
                    } else {
                        task.re_try_time = !task.re_try_time ? 1 : ( task.re_try_time + 1 );//更新重试次数
                        console.debug('re_try by network time:', task.re_try_time);
                        BOX.reset_speed();//计速重置
                        task.events.re_start.call(task);
                    }
                }
            } else {
	            get_bar().set_dom(task);
	            if(task.upload_type === 'upload_html5_pro') {
		            get_bar().update(get_bar().OPS.UP_SPEED, speed, cnSpeed, exSpeed);
	            } else {
		            get_bar().update(get_bar().OPS.UP_SPEED, speed);
	            }
            }
        };

    return {
        /**
         * 设置妙传速度
         * @param miaoc_speed
         */
        set_miaoc_speed: function (miaoc_speed) {
            speed = miaoc_speed > two_m ? two_m : miaoc_speed;
        },
        /**
         * 速度计算轮询函数
         */
        watch_fn: watch_fn,
        /**
         * 重置计速
         */
        reset: function () {
            BOX && BOX.reset_speed();
        }
    };
});define.pack("./tool.bar_info",["$","lib","common","./upload_route","./speed.speed_task","./tool.upload_cache","./tool.upload_static","./tool.temporary_upload","./view"],function(require, exports, module) {
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
});/**
 * @preserve A JavaScript implementation of the SHA family of hashes, as
 * defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 * as defined in FIPS PUB 198a
 *
 * Copyright Brian Turek 2008-2016
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 *
 * Several functions taken from Paul Johnston
 */

/**
 * SUPPORTED_ALGS is the stub for a compile flag that will cause pruning of
 * functions that are not needed when a limited number of SHA families are
 * selected
 *
 * @define {number} ORed value of SHA variants to be supported
 *   1 = SHA-1, 2 = SHA-224/SHA-256, 4 = SHA-384/SHA-512
 */
define.pack("./tool.sha",[],function(require, exports, module) {
	var SUPPORTED_ALGS = 4 | 2 | 1;

	(function (global)
	{
		"use strict";

		/* Globals */
		var TWO_PWR_32 = (1 << 16) * (1 << 16);

		/**
		 * Int_64 is a object for 2 32-bit numbers emulating a 64-bit number
		 *
		 * @private
		 * @constructor
		 * @this {Int_64}
		 * @param {number} msint_32 The most significant 32-bits of a 64-bit number
		 * @param {number} lsint_32 The least significant 32-bits of a 64-bit number
		 */
		function Int_64(msint_32, lsint_32)
		{
			this.highOrder = msint_32;
			this.lowOrder = lsint_32;
		}

		/**
		 * Convert a string to an array of big-endian words
		 *
		 * There is a known bug with an odd number of existing bytes and using a
		 * UTF-16 encoding.  However, this function is used such that the existing
		 * bytes are always a result of a previous UTF-16 str2binb call and
		 * therefore there should never be an odd number of existing bytes
		 *
		 * @private
		 * @param {string} str String to be converted to binary representation
		 * @param {string} utfType The Unicode type, UTF8 or UTF16BE, UTF16LE, to
		 *   use to encode the source string
		 * @param {Array.<number>} existingBin A packed int array of bytes to
		 *   append the results to
		 * @param {number} existingBinLen The number of bits in the existingBin
		 *   array
		 * @return {{value : Array.<number>, binLen : number}} Hash list where
		 *   "value" contains the output number array and "binLen" is the binary
		 *   length of "value"
		 */
		function str2binb(str, utfType, existingBin, existingBinLen)
		{
			var bin = [], codePnt, binArr = [], byteCnt = 0, i, j, existingByteLen,
				intOffset, byteOffset;

			bin = existingBin || [0];
			existingBinLen = existingBinLen || 0;
			existingByteLen = existingBinLen >>> 3;

			if ("UTF8" === utfType)
			{
				for (i = 0; i < str.length; i += 1)
				{
					codePnt = str.charCodeAt(i);
					binArr = [];

					if (0x80 > codePnt)
					{
						binArr.push(codePnt);
					}
					else if (0x800 > codePnt)
					{
						binArr.push(0xC0 | (codePnt >>> 6));
						binArr.push(0x80 | (codePnt & 0x3F));
					}
					else if ((0xd800 > codePnt) || (0xe000 <= codePnt)) {
						binArr.push(
								0xe0 | (codePnt >>> 12),
								0x80 | ((codePnt >>> 6) & 0x3f),
								0x80 | (codePnt & 0x3f)
						);
					}
					else
					{
						i += 1;
						codePnt = 0x10000 + (((codePnt & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
						binArr.push(
								0xf0 | (codePnt >>> 18),
								0x80 | ((codePnt >>> 12) & 0x3f),
								0x80 | ((codePnt >>> 6) & 0x3f),
								0x80 | (codePnt & 0x3f)
						);
					}

					for (j = 0; j < binArr.length; j += 1)
					{
						byteOffset = byteCnt + existingByteLen;
						intOffset = byteOffset >>> 2;
						while (bin.length <= intOffset)
						{
							bin.push(0);
						}
						/* Known bug kicks in here */
						bin[intOffset] |= binArr[j] << (8 * (3 - (byteOffset % 4)));
						byteCnt += 1;
					}
				}
			}
			else if (("UTF16BE" === utfType) || "UTF16LE" === utfType)
			{
				for (i = 0; i < str.length; i += 1)
				{
					codePnt = str.charCodeAt(i);
					/* Internally strings are UTF-16BE so only change if UTF-16LE */
					if ("UTF16LE" === utfType)
					{
						j = codePnt & 0xFF;
						codePnt = (j << 8) | (codePnt >>> 8);
					}

					byteOffset = byteCnt + existingByteLen;
					intOffset = byteOffset >>> 2;
					while (bin.length <= intOffset)
					{
						bin.push(0);
					}
					bin[intOffset] |= codePnt << (8 * (2 - (byteOffset % 4)));
					byteCnt += 2;
				}
			}
			return {"value" : bin, "binLen" : byteCnt * 8 + existingBinLen};
		}

		/**
		 * Convert a hex string to an array of big-endian words
		 *
		 * @private
		 * @param {string} str String to be converted to binary representation
		 * @param {Array.<number>} existingBin A packed int array of bytes to
		 *   append the results to
		 * @param {number} existingBinLen The number of bits in the existingBin
		 *   array
		 * @return {{value : Array.<number>, binLen : number}} Hash list where
		 *   "value" contains the output number array and "binLen" is the binary
		 *   length of "value"
		 */
		function hex2binb(str, existingBin, existingBinLen)
		{
			var bin, length = str.length, i, num, intOffset, byteOffset,
				existingByteLen;

			bin = existingBin || [0];
			existingBinLen = existingBinLen || 0;
			existingByteLen = existingBinLen >>> 3;

			if (0 !== (length % 2))
			{
				throw new Error("String of HEX type must be in byte increments");
			}

			for (i = 0; i < length; i += 2)
			{
				num = parseInt(str.substr(i, 2), 16);
				if (!isNaN(num))
				{
					byteOffset = (i >>> 1) + existingByteLen;
					intOffset = byteOffset >>> 2;
					while (bin.length <= intOffset)
					{
						bin.push(0);
					}
					bin[intOffset] |= num << 8 * (3 - (byteOffset % 4));
				}
				else
				{
					throw new Error("String of HEX type contains invalid characters");
				}
			}

			return {"value" : bin, "binLen" : length * 4 + existingBinLen};
		}

		/**
		 * Convert a string of raw bytes to an array of big-endian words
		 *
		 * @private
		 * @param {string} str String of raw bytes to be converted to binary representation
		 * @param {Array.<number>} existingBin A packed int array of bytes to
		 *   append the results to
		 * @param {number} existingBinLen The number of bits in the existingBin
		 *   array
		 * @return {{value : Array.<number>, binLen : number}} Hash list where
		 *   "value" contains the output number array and "binLen" is the binary
		 *   length of "value"
		 */
		function bytes2binb(str, existingBin, existingBinLen)
		{
			var bin = [], codePnt, i, existingByteLen, intOffset,
				byteOffset;

			bin = existingBin || [0];
			existingBinLen = existingBinLen || 0;
			existingByteLen = existingBinLen >>> 3;

			for (i = 0; i < str.length; i += 1)
			{
				codePnt = str.charCodeAt(i);

				byteOffset = i + existingByteLen;
				intOffset = byteOffset >>> 2;
				if (bin.length <= intOffset)
				{
					bin.push(0);
				}
				bin[intOffset] |= codePnt << 8 * (3 - (byteOffset % 4));
			}

			return {"value" : bin, "binLen" : str.length * 8 + existingBinLen};
		}

		/**
		 * Convert a base-64 string to an array of big-endian words
		 *
		 * @private
		 * @param {string} str String to be converted to binary representation
		 * @param {Array.<number>} existingBin A packed int array of bytes to
		 *   append the results to
		 * @param {number} existingBinLen The number of bits in the existingBin
		 *   array
		 * @return {{value : Array.<number>, binLen : number}} Hash list where
		 *   "value" contains the output number array and "binLen" is the binary
		 *   length of "value"
		 */
		function b642binb(str, existingBin, existingBinLen)
		{
			var bin = [], byteCnt = 0, index, i, j, tmpInt, strPart, firstEqual,
				b64Tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
				existingByteLen, intOffset, byteOffset;

			bin = existingBin || [0];
			existingBinLen = existingBinLen || 0;
			existingByteLen = existingBinLen >>> 3;

			if (-1 === str.search(/^[a-zA-Z0-9=+\/]+$/))
			{
				throw new Error("Invalid character in base-64 string");
			}
			firstEqual = str.indexOf('=');
			str = str.replace(/\=/g, '');
			if ((-1 !== firstEqual) && (firstEqual < str.length))
			{
				throw new Error("Invalid '=' found in base-64 string");
			}

			for (i = 0; i < str.length; i += 4)
			{
				strPart = str.substr(i, 4);
				tmpInt = 0;

				for (j = 0; j < strPart.length; j += 1)
				{
					index = b64Tab.indexOf(strPart[j]);
					tmpInt |= index << (18 - (6 * j));
				}

				for (j = 0; j < strPart.length - 1; j += 1)
				{
					byteOffset = byteCnt + existingByteLen;
					intOffset = byteOffset >>> 2;
					while (bin.length <= intOffset)
					{
						bin.push(0);
					}
					bin[intOffset] |= ((tmpInt >>> (16 - (j * 8))) & 0xFF) <<
						8 * (3 - (byteOffset % 4));
					byteCnt += 1;
				}
			}

			return {"value" : bin, "binLen" : byteCnt * 8 + existingBinLen};
		}

		/**
		 * Convert an ArrayBuffer to an array of big-endian words
		 *
		 * @private
		 * @param {ArrayBuffer} arr ArrayBuffer to be converted to binary
		 *   representation
		 * @param {Array.<number>} existingBin A packed int array of bytes to
		 *   append the results to
		 * @param {number} existingBinLen The number of bits in the existingBin
		 *   array
		 * @return {{value : Array.<number>, binLen : number}} Hash list where
		 *   "value" contains the output number array and "binLen" is the binary
		 *   length of "value"
		 */
		function arraybuffer2binb(arr, existingBin, existingBinLen)
		{
			var bin = [], i, existingByteLen, intOffset, byteOffset;

			bin = existingBin || [0];
			existingBinLen = existingBinLen || 0;
			existingByteLen = existingBinLen >>> 3;

			for (i = 0; i < arr.byteLength; i += 1)
			{
				byteOffset = i + existingByteLen;
				intOffset = byteOffset >>> 2;
				if (bin.length <= intOffset)
				{
					bin.push(0);
				}
				bin[intOffset] |= arr[i] << 8 * (3 - (byteOffset % 4));
			}

			return {"value" : bin, "binLen" : arr.byteLength * 8 + existingBinLen};
		}

		/**
		 * Convert an array of big-endian words to a hex string.
		 *
		 * @private
		 * @param {Array.<number>} binarray Array of integers to be converted to
		 *   hexidecimal representation
		 * @param {{outputUpper : boolean, b64Pad : string}} formatOpts Hash list
		 *   containing validated output formatting options
		 * @return {string} Hexidecimal representation of the parameter in string
		 *   form
		 */
		function binb2hex(binarray, formatOpts)
		{
			var hex_tab = "0123456789abcdef", str = "",
				length = binarray.length * 4, i, srcByte;

			for (i = 0; i < length; i += 1)
			{
				/* The below is more than a byte but it gets taken care of later */
				srcByte = binarray[i >>> 2] >>> ((3 - (i % 4)) * 8);
				str += hex_tab.charAt((srcByte >>> 4) & 0xF) +
					hex_tab.charAt(srcByte & 0xF);
			}

			return (formatOpts["outputUpper"]) ? str.toUpperCase() : str;
		}

		/**
		 * add by isco
		 * 计算SHA中间累积结果
		 *
		 * @private
		 * @param {Array.<number>} binarray Array of integers to be converted to
		 *   hexidecimal representation
		 * @param {{outputUpper : boolean, b64Pad : string}} formatOpts Hash list
		 *   containing validated output formatting options
		 * @return {string} Hexidecimal representation of the parameter in string
		 *   form
		 */
		function binb2tempHex(binarray, formatOpts)
		{
			var hex_tab = "0123456789abcdef", str = "", temp = "",
				length = binarray.length, i, j, k, srcByte;

			for (i = 0; i < length; i += 1)
			{
				for(j = 0; j < 4; j += 1) {
					k = i * 4 + j;
					/* The below is more than a byte but it gets taken care of later */
					srcByte = binarray[k >>> 2] >>> ((3 - (k % 4)) * 8);
					temp += hex_tab.charAt((srcByte >>> 4) & 0xF) +
						hex_tab.charAt(srcByte & 0xF);
				}
				str += temp.match(/(\w\w)(\w\w)(\w\w)(\w\w)/).slice(1).reverse().join('');
				temp = "";
			}

			return (formatOpts["outputUpper"]) ? str.toUpperCase() : str;
		}

		/**
		 * Convert an array of big-endian words to a base-64 string
		 *
		 * @private
		 * @param {Array.<number>} binarray Array of integers to be converted to
		 *   base-64 representation
		 * @param {{outputUpper : boolean, b64Pad : string}} formatOpts Hash list
		 *   containing validated output formatting options
		 * @return {string} Base-64 encoded representation of the parameter in
		 *   string form
		 */
		function binb2b64(binarray, formatOpts)
		{
			var str = "", length = binarray.length * 4, i, j, triplet, offset, int1, int2,
				b64Tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

			for (i = 0; i < length; i += 3)
			{
				offset = (i + 1) >>> 2;
				int1 = (binarray.length <= offset) ? 0 : binarray[offset];
				offset = (i + 2) >>> 2;
				int2 = (binarray.length <= offset) ? 0 : binarray[offset];
				triplet = (((binarray[i >>> 2] >>> 8 * (3 - i % 4)) & 0xFF) << 16) |
					(((int1 >>> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) |
					((int2 >>> 8 * (3 - (i + 2) % 4)) & 0xFF);
				for (j = 0; j < 4; j += 1)
				{
					if (i * 8 + j * 6 <= binarray.length * 32)
					{
						str += b64Tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
					}
					else
					{
						str += formatOpts["b64Pad"];
					}
				}
			}
			return str;
		}

		/**
		 * Convert an array of big-endian words to raw bytes string
		 *
		 * @private
		 * @param {Array.<number>} binarray Array of integers to be converted to
		 *   a raw bytes string representation
		 * @return {string} Raw bytes representation of the parameter in string
		 *   form
		 */
		function binb2bytes(binarray)
		{
			var str = "", length = binarray.length * 4, i, srcByte;

			for (i = 0; i < length; i += 1)
			{
				srcByte = (binarray[i >>> 2] >>> ((3 - (i % 4)) * 8)) & 0xFF;
				str += String.fromCharCode(srcByte);
			}

			return str;
		}

		/**
		 * Convert an array of big-endian words to an ArrayBuffer
		 *
		 * @private
		 * @param {Array.<number>} binarray Array of integers to be converted to
		 *   an ArrayBuffer
		 * @return {ArrayBuffer} Raw bytes representation of the parameter in an
		 *   ArrayBuffer
		 */
		function binb2arraybuffer(binarray)
		{
			var length = binarray.length * 4, i, retVal = new ArrayBuffer(length);

			for (i = 0; i < length; i += 1)
			{
				retVal[i] = (binarray[i >>> 2] >>> ((3 - (i % 4)) * 8)) & 0xFF;
			}

			return retVal;
		}

		/**
		 * Validate hash list containing output formatting options, ensuring
		 * presence of every option or adding the default value
		 *
		 * @private
		 * @param {{outputUpper : (boolean|undefined), b64Pad : (string|undefined)}=}
		 *   options Hash list of output formatting options
		 * @return {{outputUpper : boolean, b64Pad : string}} Validated hash list
		 *   containing output formatting options
		 */
		function getOutputOpts(options)
		{
			var retVal = {"outputUpper" : false, "b64Pad" : "="}, outputOptions;
			outputOptions = options || {};

			retVal["outputUpper"] = outputOptions["outputUpper"] || false;

			if (true === outputOptions.hasOwnProperty("b64Pad"))
			{
				retVal["b64Pad"] = outputOptions["b64Pad"];
			}

			if ("boolean" !== typeof(retVal["outputUpper"]))
			{
				throw new Error("Invalid outputUpper formatting option");
			}

			if ("string" !== typeof(retVal["b64Pad"]))
			{
				throw new Error("Invalid b64Pad formatting option");
			}

			return retVal;
		}

		/**
		 * Function that takes an input format and UTF encoding and returns the
		 * appropriate function used to convert the input.
		 *
		 * @private
		 * @param {string} format The format of the string to be converted
		 * @param {string} utfType The string encoding to use (UTF8, UTF16BE,
		 *	UTF16LE)
		 * @return {function(string, Array.<number>=, number=): {value :
		 *   Array.<number>, binLen : number}} Function that will convert an input
		 *   string to a packed int array
		 */
		function getStrConverter(format, utfType)
		{
			var retVal;

			/* Validate encoding */
			switch (utfType)
			{
				case "UTF8":
				/* Fallthrough */
				case "UTF16BE":
				/* Fallthrough */
				case "UTF16LE":
					/* Fallthrough */
					break;
				default:
					throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
			}

			/* Map inputFormat to the appropriate converter */
			switch (format)
			{
				case "HEX":
					retVal = hex2binb;
					break;
				case "TEXT":
					retVal = function(str, existingBin, existingBinLen)
					{
						return str2binb(str, utfType, existingBin, existingBinLen);
					};
					break;
				case "B64":
					retVal = b642binb;
					break;
				case "BYTES":
					retVal = bytes2binb;
					break;
				case "ARRAYBUFFER":
					try {
						retVal = new ArrayBuffer(0);
					} catch (err) {
						throw new Error("ARRAYBUFFER not supported by this environment");
					}
					retVal = arraybuffer2binb;
					break;
				default:
					throw new Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
			}

			return retVal;
		}

		/**
		 * The 32-bit implementation of circular rotate left
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @param {number} n The number of bits to shift
		 * @return {number} The x shifted circularly by n bits
		 */
		function rotl_32(x, n)
		{
			return (x << n) | (x >>> (32 - n));
		}

		/**
		 * The 32-bit implementation of circular rotate right
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @param {number} n The number of bits to shift
		 * @return {number} The x shifted circularly by n bits
		 */
		function rotr_32(x, n)
		{
			return (x >>> n) | (x << (32 - n));
		}

		/**
		 * The 64-bit implementation of circular rotate right
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @param {number} n The number of bits to shift
		 * @return {Int_64} The x shifted circularly by n bits
		 */
		function rotr_64(x, n)
		{
			var retVal = null, tmp = new Int_64(x.highOrder, x.lowOrder);

			if (32 >= n)
			{
				retVal = new Int_64(
						(tmp.highOrder >>> n) | ((tmp.lowOrder << (32 - n)) & 0xFFFFFFFF),
						(tmp.lowOrder >>> n) | ((tmp.highOrder << (32 - n)) & 0xFFFFFFFF)
				);
			}
			else
			{
				retVal = new Int_64(
						(tmp.lowOrder >>> (n - 32)) | ((tmp.highOrder << (64 - n)) & 0xFFFFFFFF),
						(tmp.highOrder >>> (n - 32)) | ((tmp.lowOrder << (64 - n)) & 0xFFFFFFFF)
				);
			}

			return retVal;
		}

		/**
		 * The 32-bit implementation of shift right
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @param {number} n The number of bits to shift
		 * @return {number} The x shifted by n bits
		 */
		function shr_32(x, n)
		{
			return x >>> n;
		}

		/**
		 * The 64-bit implementation of shift right
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @param {number} n The number of bits to shift
		 * @return {Int_64} The x shifted by n bits
		 */
		function shr_64(x, n)
		{
			var retVal = null;

			if (32 >= n)
			{
				retVal = new Int_64(
						x.highOrder >>> n,
						x.lowOrder >>> n | ((x.highOrder << (32 - n)) & 0xFFFFFFFF)
				);
			}
			else
			{
				retVal = new Int_64(
					0,
						x.highOrder >>> (n - 32)
				);
			}

			return retVal;
		}

		/**
		 * The 32-bit implementation of the NIST specified Parity function
		 *
		 * @private
		 * @param {number} x The first 32-bit integer argument
		 * @param {number} y The second 32-bit integer argument
		 * @param {number} z The third 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function parity_32(x, y, z)
		{
			return x ^ y ^ z;
		}

		/**
		 * The 32-bit implementation of the NIST specified Ch function
		 *
		 * @private
		 * @param {number} x The first 32-bit integer argument
		 * @param {number} y The second 32-bit integer argument
		 * @param {number} z The third 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function ch_32(x, y, z)
		{
			return (x & y) ^ (~x & z);
		}

		/**
		 * The 64-bit implementation of the NIST specified Ch function
		 *
		 * @private
		 * @param {Int_64} x The first 64-bit integer argument
		 * @param {Int_64} y The second 64-bit integer argument
		 * @param {Int_64} z The third 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function ch_64(x, y, z)
		{
			return new Int_64(
					(x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
					(x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
			);
		}

		/**
		 * The 32-bit implementation of the NIST specified Maj function
		 *
		 * @private
		 * @param {number} x The first 32-bit integer argument
		 * @param {number} y The second 32-bit integer argument
		 * @param {number} z The third 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function maj_32(x, y, z)
		{
			return (x & y) ^ (x & z) ^ (y & z);
		}

		/**
		 * The 64-bit implementation of the NIST specified Maj function
		 *
		 * @private
		 * @param {Int_64} x The first 64-bit integer argument
		 * @param {Int_64} y The second 64-bit integer argument
		 * @param {Int_64} z The third 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function maj_64(x, y, z)
		{
			return new Int_64(
					(x.highOrder & y.highOrder) ^
					(x.highOrder & z.highOrder) ^
					(y.highOrder & z.highOrder),
					(x.lowOrder & y.lowOrder) ^
					(x.lowOrder & z.lowOrder) ^
					(y.lowOrder & z.lowOrder)
			);
		}

		/**
		 * The 32-bit implementation of the NIST specified Sigma0 function
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function sigma0_32(x)
		{
			return rotr_32(x, 2) ^ rotr_32(x, 13) ^ rotr_32(x, 22);
		}

		/**
		 * The 64-bit implementation of the NIST specified Sigma0 function
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function sigma0_64(x)
		{
			var rotr28 = rotr_64(x, 28), rotr34 = rotr_64(x, 34),
				rotr39 = rotr_64(x, 39);

			return new Int_64(
					rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
					rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder);
		}

		/**
		 * The 32-bit implementation of the NIST specified Sigma1 function
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function sigma1_32(x)
		{
			return rotr_32(x, 6) ^ rotr_32(x, 11) ^ rotr_32(x, 25);
		}

		/**
		 * The 64-bit implementation of the NIST specified Sigma1 function
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function sigma1_64(x)
		{
			var rotr14 = rotr_64(x, 14), rotr18 = rotr_64(x, 18),
				rotr41 = rotr_64(x, 41);

			return new Int_64(
					rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
					rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder);
		}

		/**
		 * The 32-bit implementation of the NIST specified Gamma0 function
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function gamma0_32(x)
		{
			return rotr_32(x, 7) ^ rotr_32(x, 18) ^ shr_32(x, 3);
		}

		/**
		 * The 64-bit implementation of the NIST specified Gamma0 function
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function gamma0_64(x)
		{
			var rotr1 = rotr_64(x, 1), rotr8 = rotr_64(x, 8), shr7 = shr_64(x, 7);

			return new Int_64(
					rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
					rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
			);
		}

		/**
		 * The 32-bit implementation of the NIST specified Gamma1 function
		 *
		 * @private
		 * @param {number} x The 32-bit integer argument
		 * @return {number} The NIST specified output of the function
		 */
		function gamma1_32(x)
		{
			return rotr_32(x, 17) ^ rotr_32(x, 19) ^ shr_32(x, 10);
		}

		/**
		 * The 64-bit implementation of the NIST specified Gamma1 function
		 *
		 * @private
		 * @param {Int_64} x The 64-bit integer argument
		 * @return {Int_64} The NIST specified output of the function
		 */
		function gamma1_64(x)
		{
			var rotr19 = rotr_64(x, 19), rotr61 = rotr_64(x, 61),
				shr6 = shr_64(x, 6);

			return new Int_64(
					rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
					rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
			);
		}

		/**
		 * Add two 32-bit integers, wrapping at 2^32. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {number} a The first 32-bit integer argument to be added
		 * @param {number} b The second 32-bit integer argument to be added
		 * @return {number} The sum of a + b
		 */
		function safeAdd_32_2(a, b)
		{
			var lsw = (a & 0xFFFF) + (b & 0xFFFF),
				msw = (a >>> 16) + (b >>> 16) + (lsw >>> 16);

			return ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
		}

		/**
		 * Add four 32-bit integers, wrapping at 2^32. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {number} a The first 32-bit integer argument to be added
		 * @param {number} b The second 32-bit integer argument to be added
		 * @param {number} c The third 32-bit integer argument to be added
		 * @param {number} d The fourth 32-bit integer argument to be added
		 * @return {number} The sum of a + b + c + d
		 */
		function safeAdd_32_4(a, b, c, d)
		{
			var lsw = (a & 0xFFFF) + (b & 0xFFFF) + (c & 0xFFFF) + (d & 0xFFFF),
				msw = (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) +
					(lsw >>> 16);

			return ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
		}

		/**
		 * Add five 32-bit integers, wrapping at 2^32. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {number} a The first 32-bit integer argument to be added
		 * @param {number} b The second 32-bit integer argument to be added
		 * @param {number} c The third 32-bit integer argument to be added
		 * @param {number} d The fourth 32-bit integer argument to be added
		 * @param {number} e The fifth 32-bit integer argument to be added
		 * @return {number} The sum of a + b + c + d + e
		 */
		function safeAdd_32_5(a, b, c, d, e)
		{
			var lsw = (a & 0xFFFF) + (b & 0xFFFF) + (c & 0xFFFF) + (d & 0xFFFF) +
					(e & 0xFFFF),
				msw = (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) +
					(e >>> 16) + (lsw >>> 16);

			return ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
		}

		/**
		 * Add two 64-bit integers, wrapping at 2^64. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {Int_64} x The first 64-bit integer argument to be added
		 * @param {Int_64} y The second 64-bit integer argument to be added
		 * @return {Int_64} The sum of x + y
		 */
		function safeAdd_64_2(x, y)
		{
			var lsw, msw, lowOrder, highOrder;

			lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
			msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
			lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
			msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
			highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			return new Int_64(highOrder, lowOrder);
		}

		/**
		 * Add four 64-bit integers, wrapping at 2^64. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {Int_64} a The first 64-bit integer argument to be added
		 * @param {Int_64} b The second 64-bit integer argument to be added
		 * @param {Int_64} c The third 64-bit integer argument to be added
		 * @param {Int_64} d The fouth 64-bit integer argument to be added
		 * @return {Int_64} The sum of a + b + c + d
		 */
		function safeAdd_64_4(a, b, c, d)
		{
			var lsw, msw, lowOrder, highOrder;

			lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) +
				(c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
			msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) +
				(c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
			lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) +
				(c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
			msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) +
				(c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
			highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			return new Int_64(highOrder, lowOrder);
		}

		/**
		 * Add five 64-bit integers, wrapping at 2^64. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 *
		 * @private
		 * @param {Int_64} a The first 64-bit integer argument to be added
		 * @param {Int_64} b The second 64-bit integer argument to be added
		 * @param {Int_64} c The third 64-bit integer argument to be added
		 * @param {Int_64} d The fouth 64-bit integer argument to be added
		 * @param {Int_64} e The fouth 64-bit integer argument to be added
		 * @return {Int_64} The sum of a + b + c + d + e
		 */
		function safeAdd_64_5(a, b, c, d, e)
		{
			var lsw, msw, lowOrder, highOrder;

			lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) +
				(c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) +
				(e.lowOrder & 0xFFFF);
			msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) +
				(c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) +
				(lsw >>> 16);
			lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) +
				(c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) +
				(e.highOrder & 0xFFFF) + (msw >>> 16);
			msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) +
				(c.highOrder >>> 16) + (d.highOrder >>> 16) +
				(e.highOrder >>> 16) + (lsw >>> 16);
			highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

			return new Int_64(highOrder, lowOrder);
		}

		/**
		 * Gets the H values for the specified SHA variant
		 *
		 * @param {string} variant The SHA variant
		 * @return {Array.<number|Int_64>} The initial H values
		 */
		function getH(variant)
		{
			var retVal, H_trunc, H_full;

			if (("SHA-1" === variant) && (1 & SUPPORTED_ALGS))
			{
				retVal = [
					0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0
				];
			}
			else if (6 & SUPPORTED_ALGS)
			{
				H_trunc = [
					0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
					0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
				];
				H_full = [
					0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
					0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
				];

				switch (variant)
				{
					case "SHA-224":
						retVal = H_trunc;
						break;
					case "SHA-256":
						retVal = H_full;
						break;
					case "SHA-384":
						retVal = [
							new Int_64(0xcbbb9d5d, H_trunc[0]),
							new Int_64(0x0629a292a, H_trunc[1]),
							new Int_64(0x9159015a, H_trunc[2]),
							new Int_64(0x0152fecd8, H_trunc[3]),
							new Int_64(0x67332667, H_trunc[4]),
							new Int_64(0x98eb44a87, H_trunc[5]),
							new Int_64(0xdb0c2e0d, H_trunc[6]),
							new Int_64(0x047b5481d, H_trunc[7])
						];
						break;
					case "SHA-512":
						retVal = [
							new Int_64(H_full[0], 0xf3bcc908),
							new Int_64(H_full[1], 0x84caa73b),
							new Int_64(H_full[2], 0xfe94f82b),
							new Int_64(H_full[3], 0x5f1d36f1),
							new Int_64(H_full[4], 0xade682d1),
							new Int_64(H_full[5], 0x2b3e6c1f),
							new Int_64(H_full[6], 0xfb41bd6b),
							new Int_64(H_full[7], 0x137e2179)
						];
						break;
					default:
						throw new Error("Unknown SHA variant");
				}
			}
			else
			{
				throw new Error("No SHA variants supported");
			}

			return retVal;
		}

		/**
		 * Performs a round of SHA-1 hashing over a 512-byte block
		 *
		 * @private
		 * @param {Array.<number>} block The binary array representation of the
		 *   block to hash
		 * @param {Array.<number>} H The intermediate H values from a previous
		 *   round
		 * @return {Array.<number>} The resulting H values
		 */
		function roundSHA1(block, H)
		{
			var W = [], a, b, c, d, e, T, ch = ch_32, parity = parity_32,
				maj = maj_32, rotl = rotl_32, safeAdd_2 = safeAdd_32_2, t,
				safeAdd_5 = safeAdd_32_5;

			a = H[0];
			b = H[1];
			c = H[2];
			d = H[3];
			e = H[4];

			for (t = 0; t < 80; t += 1)
			{
				if (t < 16)
				{
					W[t] = block[t];
				}
				else
				{
					W[t] = rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
				}

				if (t < 20)
				{
					T = safeAdd_5(rotl(a, 5), ch(b, c, d), e, 0x5a827999, W[t]);
				}
				else if (t < 40)
				{
					T = safeAdd_5(rotl(a, 5), parity(b, c, d), e, 0x6ed9eba1, W[t]);
				}
				else if (t < 60)
				{
					T = safeAdd_5(rotl(a, 5), maj(b, c, d), e, 0x8f1bbcdc, W[t]);
				} else {
					T = safeAdd_5(rotl(a, 5), parity(b, c, d), e, 0xca62c1d6, W[t]);
				}

				e = d;
				d = c;
				c = rotl(b, 30);
				b = a;
				a = T;
			}

			H[0] = safeAdd_2(a, H[0]);
			H[1] = safeAdd_2(b, H[1]);
			H[2] = safeAdd_2(c, H[2]);
			H[3] = safeAdd_2(d, H[3]);
			H[4] = safeAdd_2(e, H[4]);

			return H;
		}

		/**
		 * Finalizes the SHA-1 hash
		 *
		 * @private
		 * @param {Array.<number>} remainder Any leftover unprocessed packed ints
		 *   that still need to be processed
		 * @param {number} remainderBinLen The number of bits in remainder
		 * @param {number} processedBinLen The number of bits already
		 *   processed
		 * @param {Array.<number>} H The intermediate H values from a previous
		 *   round
		 * @return {Array.<number>} The array of integers representing the SHA-1
		 *   hash of message
		 */
		function finalizeSHA1(remainder, remainderBinLen, processedBinLen, H)
		{
			var i, appendedMessageLength, offset, totalLen;

			/* The 65 addition is a hack but it works.  The correct number is
			 actually 72 (64 + 8) but the below math fails if
			 remainderBinLen + 72 % 512 = 0. Since remainderBinLen % 8 = 0,
			 "shorting" the addition is OK. */
			offset = (((remainderBinLen + 65) >>> 9) << 4) + 15;
			while (remainder.length <= offset)
			{
				remainder.push(0);
			}
			/* Append '1' at the end of the binary string */
			remainder[remainderBinLen >>> 5] |= 0x80 << (24 - (remainderBinLen % 32));
			/* Append length of binary string in the position such that the new
			 * length is a multiple of 512.  Logic does not work for even multiples
			 * of 512 but there can never be even multiples of 512. JavaScript
			 * numbers are limited to 2^53 so it's "safe" to treat the totalLen as
			 * a 64-bit integer. */
			totalLen = remainderBinLen + processedBinLen;
			remainder[offset] = totalLen & 0xFFFFFFFF;
			/* Bitwise operators treat the operand as a 32-bit number so need to
			 * use hacky division and round to get access to upper 32-ish bits */
			remainder[offset - 1] = (totalLen / TWO_PWR_32) | 0;

			appendedMessageLength = remainder.length;

			/* This will always be at least 1 full chunk */
			for (i = 0; i < appendedMessageLength; i += 16)
			{
				H = roundSHA1(remainder.slice(i, i + 16), H);
			}

			return H;
		}

		/* Put this here so the K arrays aren't put on the stack for every block */
		var K_sha2, K_sha512;
		if (6 & SUPPORTED_ALGS)
		{
			K_sha2 = [
				0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
				0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
				0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
				0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
				0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
				0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
				0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
				0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
				0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
				0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
				0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
				0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
				0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
				0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
				0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
				0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
			];

			if (4 & SUPPORTED_ALGS)
			{
				K_sha512 = [
					new Int_64(K_sha2[ 0], 0xd728ae22), new Int_64(K_sha2[ 1], 0x23ef65cd),
					new Int_64(K_sha2[ 2], 0xec4d3b2f), new Int_64(K_sha2[ 3], 0x8189dbbc),
					new Int_64(K_sha2[ 4], 0xf348b538), new Int_64(K_sha2[ 5], 0xb605d019),
					new Int_64(K_sha2[ 6], 0xaf194f9b), new Int_64(K_sha2[ 7], 0xda6d8118),
					new Int_64(K_sha2[ 8], 0xa3030242), new Int_64(K_sha2[ 9], 0x45706fbe),
					new Int_64(K_sha2[10], 0x4ee4b28c), new Int_64(K_sha2[11], 0xd5ffb4e2),
					new Int_64(K_sha2[12], 0xf27b896f), new Int_64(K_sha2[13], 0x3b1696b1),
					new Int_64(K_sha2[14], 0x25c71235), new Int_64(K_sha2[15], 0xcf692694),
					new Int_64(K_sha2[16], 0x9ef14ad2), new Int_64(K_sha2[17], 0x384f25e3),
					new Int_64(K_sha2[18], 0x8b8cd5b5), new Int_64(K_sha2[19], 0x77ac9c65),
					new Int_64(K_sha2[20], 0x592b0275), new Int_64(K_sha2[21], 0x6ea6e483),
					new Int_64(K_sha2[22], 0xbd41fbd4), new Int_64(K_sha2[23], 0x831153b5),
					new Int_64(K_sha2[24], 0xee66dfab), new Int_64(K_sha2[25], 0x2db43210),
					new Int_64(K_sha2[26], 0x98fb213f), new Int_64(K_sha2[27], 0xbeef0ee4),
					new Int_64(K_sha2[28], 0x3da88fc2), new Int_64(K_sha2[29], 0x930aa725),
					new Int_64(K_sha2[30], 0xe003826f), new Int_64(K_sha2[31], 0x0a0e6e70),
					new Int_64(K_sha2[32], 0x46d22ffc), new Int_64(K_sha2[33], 0x5c26c926),
					new Int_64(K_sha2[34], 0x5ac42aed), new Int_64(K_sha2[35], 0x9d95b3df),
					new Int_64(K_sha2[36], 0x8baf63de), new Int_64(K_sha2[37], 0x3c77b2a8),
					new Int_64(K_sha2[38], 0x47edaee6), new Int_64(K_sha2[39], 0x1482353b),
					new Int_64(K_sha2[40], 0x4cf10364), new Int_64(K_sha2[41], 0xbc423001),
					new Int_64(K_sha2[42], 0xd0f89791), new Int_64(K_sha2[43], 0x0654be30),
					new Int_64(K_sha2[44], 0xd6ef5218), new Int_64(K_sha2[45], 0x5565a910),
					new Int_64(K_sha2[46], 0x5771202a), new Int_64(K_sha2[47], 0x32bbd1b8),
					new Int_64(K_sha2[48], 0xb8d2d0c8), new Int_64(K_sha2[49], 0x5141ab53),
					new Int_64(K_sha2[50], 0xdf8eeb99), new Int_64(K_sha2[51], 0xe19b48a8),
					new Int_64(K_sha2[52], 0xc5c95a63), new Int_64(K_sha2[53], 0xe3418acb),
					new Int_64(K_sha2[54], 0x7763e373), new Int_64(K_sha2[55], 0xd6b2b8a3),
					new Int_64(K_sha2[56], 0x5defb2fc), new Int_64(K_sha2[57], 0x43172f60),
					new Int_64(K_sha2[58], 0xa1f0ab72), new Int_64(K_sha2[59], 0x1a6439ec),
					new Int_64(K_sha2[60], 0x23631e28), new Int_64(K_sha2[61], 0xde82bde9),
					new Int_64(K_sha2[62], 0xb2c67915), new Int_64(K_sha2[63], 0xe372532b),
					new Int_64(0xca273ece, 0xea26619c), new Int_64(0xd186b8c7, 0x21c0c207),
					new Int_64(0xeada7dd6, 0xcde0eb1e), new Int_64(0xf57d4f7f, 0xee6ed178),
					new Int_64(0x06f067aa, 0x72176fba), new Int_64(0x0a637dc5, 0xa2c898a6),
					new Int_64(0x113f9804, 0xbef90dae), new Int_64(0x1b710b35, 0x131c471b),
					new Int_64(0x28db77f5, 0x23047d84), new Int_64(0x32caab7b, 0x40c72493),
					new Int_64(0x3c9ebe0a, 0x15c9bebc), new Int_64(0x431d67c4, 0x9c100d4c),
					new Int_64(0x4cc5d4be, 0xcb3e42b6), new Int_64(0x597f299c, 0xfc657e2a),
					new Int_64(0x5fcb6fab, 0x3ad6faec), new Int_64(0x6c44198c, 0x4a475817)
				];
			}
		}

		/**
		 * Performs a round of SHA-2 hashing over a block
		 *
		 * @private
		 * @param {Array.<number>} block The binary array representation of the
		 *   block to hash
		 * @param {Array.<number|Int_64>} H The intermediate H values from a previous
		 *   round
		 * @param {string} variant The desired SHA-2 variant
		 * @return {Array.<number|Int_64>} The resulting H values
		 */
		function roundSHA2(block, H, variant)
		{
			var a, b, c, d, e, f, g, h, T1, T2, numRounds, t, binaryStringMult,
				safeAdd_2, safeAdd_4, safeAdd_5, gamma0, gamma1, sigma0, sigma1,
				ch, maj, Int, W = [], int1, int2, offset, K;

			/* Set up the various function handles and variable for the specific
			 * variant */
			if ((variant === "SHA-224" || variant === "SHA-256") &&
				(2 & SUPPORTED_ALGS))
			{
				/* 32-bit variant */
				numRounds = 64;
				binaryStringMult = 1;
				Int = Number;
				safeAdd_2 = safeAdd_32_2;
				safeAdd_4 = safeAdd_32_4;
				safeAdd_5 = safeAdd_32_5;
				gamma0 = gamma0_32;
				gamma1 = gamma1_32;
				sigma0 = sigma0_32;
				sigma1 = sigma1_32;
				maj = maj_32;
				ch = ch_32;
				K = K_sha2;
			}
			else if ((variant === "SHA-384" || variant === "SHA-512") &&
				(4 & SUPPORTED_ALGS))
			{
				/* 64-bit variant */
				numRounds = 80;
				binaryStringMult = 2;
				Int = Int_64;
				safeAdd_2 = safeAdd_64_2;
				safeAdd_4 = safeAdd_64_4;
				safeAdd_5 = safeAdd_64_5;
				gamma0 = gamma0_64;
				gamma1 = gamma1_64;
				sigma0 = sigma0_64;
				sigma1 = sigma1_64;
				maj = maj_64;
				ch = ch_64;
				K = K_sha512;
			}
			else
			{
				throw new Error("Unexpected error in SHA-2 implementation");
			}

			a = H[0];
			b = H[1];
			c = H[2];
			d = H[3];
			e = H[4];
			f = H[5];
			g = H[6];
			h = H[7];

			for (t = 0; t < numRounds; t += 1)
			{
				if (t < 16)
				{
					offset = t * binaryStringMult;
					int1 = (block.length <= offset) ? 0 : block[offset];
					int2 = (block.length <= offset + 1) ? 0 : block[offset + 1];
					/* Bit of a hack - for 32-bit, the second term is ignored */
					W[t] = new Int(int1, int2);
				}
				else
				{
					W[t] = safeAdd_4(
						gamma1(W[t - 2]), W[t - 7],
						gamma0(W[t - 15]), W[t - 16]
					);
				}

				T1 = safeAdd_5(h, sigma1(e), ch(e, f, g), K[t], W[t]);
				T2 = safeAdd_2(sigma0(a), maj(a, b, c));
				h = g;
				g = f;
				f = e;
				e = safeAdd_2(d, T1);
				d = c;
				c = b;
				b = a;
				a = safeAdd_2(T1, T2);
			}

			H[0] = safeAdd_2(a, H[0]);
			H[1] = safeAdd_2(b, H[1]);
			H[2] = safeAdd_2(c, H[2]);
			H[3] = safeAdd_2(d, H[3]);
			H[4] = safeAdd_2(e, H[4]);
			H[5] = safeAdd_2(f, H[5]);
			H[6] = safeAdd_2(g, H[6]);
			H[7] = safeAdd_2(h, H[7]);

			return H;
		}

		/**
		 * Finalizes the SHA-2 hash
		 *
		 * @private
		 * @param {Array.<number>} remainder Any leftover unprocessed packed ints
		 *   that still need to be processed
		 * @param {number} remainderBinLen The number of bits in remainder
		 * @param {number} processedBinLen The number of bits already
		 *   processed
		 * @param {Array.<number|Int_64>} H The intermediate H values from a previous
		 *   round
		 * @param {string} variant The desired SHA-2 variant
		 * @return {Array.<number>} The array of integers representing the SHA-2
		 *   hash of message
		 */
		function finalizeSHA2(remainder, remainderBinLen, processedBinLen, H, variant)
		{
			var i, appendedMessageLength, offset, retVal, binaryStringInc, totalLen;

			if ((variant === "SHA-224" || variant === "SHA-256") &&
				(2 & SUPPORTED_ALGS))
			{
				/* 32-bit variant */
				/* The 65 addition is a hack but it works.  The correct number is
				 actually 72 (64 + 8) but the below math fails if
				 remainderBinLen + 72 % 512 = 0. Since remainderBinLen % 8 = 0,
				 "shorting" the addition is OK. */
				offset = (((remainderBinLen + 65) >>> 9) << 4) + 15;
				binaryStringInc = 16;
			}
			else if ((variant === "SHA-384" || variant === "SHA-512") &&
				(4 & SUPPORTED_ALGS))
			{
				/* 64-bit variant */
				/* The 129 addition is a hack but it works.  The correct number is
				 actually 136 (128 + 8) but the below math fails if
				 remainderBinLen + 136 % 1024 = 0. Since remainderBinLen % 8 = 0,
				 "shorting" the addition is OK. */
				offset = (((remainderBinLen + 129) >>> 10) << 5) + 31;
				binaryStringInc = 32;
			}
			else
			{
				throw new Error("Unexpected error in SHA-2 implementation");
			}

			while (remainder.length <= offset)
			{
				remainder.push(0);
			}
			/* Append '1' at the end of the binary string */
			remainder[remainderBinLen >>> 5] |= 0x80 << (24 - remainderBinLen % 32);
			/* Append length of binary string in the position such that the new
			 * length is correct. JavaScript numbers are limited to 2^53 so it's
			 * "safe" to treat the totalLen as a 64-bit integer. */
			totalLen = remainderBinLen + processedBinLen;
			remainder[offset] = totalLen & 0xFFFFFFFF;
			/* Bitwise operators treat the operand as a 32-bit number so need to
			 * use hacky division and round to get access to upper 32-ish bits */
			remainder[offset - 1] = (totalLen / TWO_PWR_32) | 0;

			appendedMessageLength = remainder.length;

			/* This will always be at least 1 full chunk */
			for (i = 0; i < appendedMessageLength; i += binaryStringInc)
			{
				H = roundSHA2(remainder.slice(i, i + binaryStringInc), H, variant);
			}

			if (("SHA-224" === variant) && (2 & SUPPORTED_ALGS))
			{
				retVal = [
					H[0], H[1], H[2], H[3],
					H[4], H[5], H[6]
				];
			}
			else if (("SHA-256" === variant) && (2 & SUPPORTED_ALGS))
			{
				retVal = H;
			}
			else if (("SHA-384" === variant) && (4 & SUPPORTED_ALGS))
			{
				retVal = [
					H[0].highOrder, H[0].lowOrder,
					H[1].highOrder, H[1].lowOrder,
					H[2].highOrder, H[2].lowOrder,
					H[3].highOrder, H[3].lowOrder,
					H[4].highOrder, H[4].lowOrder,
					H[5].highOrder, H[5].lowOrder
				];
			}
			else if (("SHA-512" === variant) && (4 & SUPPORTED_ALGS))
			{
				retVal = [
					H[0].highOrder, H[0].lowOrder,
					H[1].highOrder, H[1].lowOrder,
					H[2].highOrder, H[2].lowOrder,
					H[3].highOrder, H[3].lowOrder,
					H[4].highOrder, H[4].lowOrder,
					H[5].highOrder, H[5].lowOrder,
					H[6].highOrder, H[6].lowOrder,
					H[7].highOrder, H[7].lowOrder
				];
			}
			else /* This should never be reached */
			{
				throw new Error("Unexpected error in SHA-2 implementation");
			}

			return retVal;
		}

		/**
		 * jsSHA is the workhorse of the library.  Instantiate it with the string to
		 * be hashed as the parameter
		 *
		 * @constructor
		 * @this {jsSHA}
		 * @param {string} variant The desired SHA variant (SHA-1, SHA-224, SHA-256,
		 *   SHA-384, or SHA-512)
		 * @param {string} inputFormat The format of srcString: HEX, TEXT, B64,
		 *   BYTES, or ARRAYBUFFER
		 * @param {{encoding: (string|undefined), numRounds: (number|undefined)}=}
		 *   options Optional values
		 */
		var jsSHA = function(variant, inputFormat, options)
		{
			var processedLen = 0, remainder = [], remainderLen = 0, utfType,
				intermediateH, converterFunc, shaVariant = variant, outputBinLen,
				variantBlockSize, roundFunc, finalizeFunc,
				hmacKeySet = false, keyWithIPad = [], keyWithOPad = [], numRounds,
				updatedCalled = false, inputOptions;

			inputOptions = options || {};
			utfType = inputOptions["encoding"] || "UTF8";
			numRounds = inputOptions["numRounds"] || 1;

			converterFunc = getStrConverter(inputFormat, utfType);

			if ((numRounds !== parseInt(numRounds, 10)) || (1 > numRounds))
			{
				throw new Error("numRounds must a integer >= 1");
			}

			if (("SHA-1" === shaVariant) && (1 & SUPPORTED_ALGS))
			{
				variantBlockSize = 512;
				roundFunc = roundSHA1;
				finalizeFunc = finalizeSHA1;
				outputBinLen = 160;
			}
			else
			{
				if (6 & SUPPORTED_ALGS)
				{
					roundFunc = function (block, H) {
						return roundSHA2(block, H, shaVariant);
					};
					finalizeFunc = function (remainder, remainderBinLen, processedBinLen, H)
					{
						return finalizeSHA2(remainder, remainderBinLen, processedBinLen, H, shaVariant);
					};
				}

				if (("SHA-224" === shaVariant) && (2 & SUPPORTED_ALGS))
				{
					variantBlockSize = 512;
					outputBinLen = 224;
				}
				else if (("SHA-256" === shaVariant) && (2 & SUPPORTED_ALGS))
				{
					variantBlockSize = 512;
					outputBinLen = 256;
				}
				else if (("SHA-384" === shaVariant) && (4 & SUPPORTED_ALGS))
				{
					variantBlockSize = 1024;
					outputBinLen = 384;
				}
				else if (("SHA-512" === shaVariant) && (4 & SUPPORTED_ALGS))
				{
					variantBlockSize = 1024;
					outputBinLen = 512;
				}
				else
				{
					throw new Error("Chosen SHA variant is not supported");
				}
			}

			intermediateH = getH(shaVariant);

			/**
			 * Sets the HMAC key for an eventual getHMAC call.  Must be called
			 * immediately after jsSHA object instantiation
			 *
			 * @expose
			 * @param {string} key The key used to calculate the HMAC
			 * @param {string} inputFormat The format of key, HEX, TEXT, B64, BYTES,
			 *   or ARRAYBUFFER
			 * @param {{encoding : (string|undefined)}=} options Associative array
			 *   of input format options
			 */
			this.setHMACKey = function(key, inputFormat, options)
			{
				var keyConverterFunc, convertRet, keyBinLen, keyToUse, blockByteSize,
					i, lastArrayIndex, keyOptions;

				if (true === hmacKeySet)
				{
					throw new Error("HMAC key already set");
				}


				if (true === updatedCalled)
				{
					throw new Error("Cannot set HMAC key after calling update");
				}

				keyOptions = options || {};
				utfType = keyOptions["encoding"] || "UTF8";

				keyConverterFunc = getStrConverter(inputFormat, utfType);

				convertRet = keyConverterFunc(key);
				keyBinLen = convertRet["binLen"];
				keyToUse = convertRet["value"];

				blockByteSize = variantBlockSize >>> 3;

				/* These are used multiple times, calculate and store them */
				lastArrayIndex = (blockByteSize / 4) - 1;

				/* Figure out what to do with the key based on its size relative to
				 * the hash's block size */
				if (blockByteSize < (keyBinLen / 8))
				{
					keyToUse = finalizeFunc(keyToUse, keyBinLen, 0, getH(shaVariant));
					/* For all variants, the block size is bigger than the output
					 * size so there will never be a useful byte at the end of the
					 * string */
					while (keyToUse.length <= lastArrayIndex)
					{
						keyToUse.push(0);
					}
					keyToUse[lastArrayIndex] &= 0xFFFFFF00;
				}
				else if (blockByteSize > (keyBinLen / 8))
				{
					/* If the blockByteSize is greater than the key length, there
					 * will always be at LEAST one "useless" byte at the end of the
					 * string */
					while (keyToUse.length <= lastArrayIndex)
					{
						keyToUse.push(0);
					}
					keyToUse[lastArrayIndex] &= 0xFFFFFF00;
				}

				/* Create ipad and opad */
				for (i = 0; i <= lastArrayIndex; i += 1)
				{
					keyWithIPad[i] = keyToUse[i] ^ 0x36363636;
					keyWithOPad[i] = keyToUse[i] ^ 0x5C5C5C5C;
				}

				intermediateH = roundFunc(keyWithIPad, intermediateH);
				processedLen = variantBlockSize;

				hmacKeySet = true;
			};

			/**
			 * Takes strString and hashes as many blocks as possible.  Stores the
			 * rest for either a future update or getHash call.
			 *
			 * @expose
			 * @param {string} srcString The string to be hashed
			 */
			this.update = function(srcString)
			{
				var convertRet, chunkBinLen, chunkIntLen, chunk, i, updateProcessedLen = 0,
					variantBlockIntInc = variantBlockSize >>> 5;

				convertRet = converterFunc(srcString, remainder, remainderLen);
				chunkBinLen = convertRet["binLen"];
				chunk = convertRet["value"];

				chunkIntLen = chunkBinLen >>> 5;
				for (i = 0; i < chunkIntLen; i += variantBlockIntInc)
				{
					if (updateProcessedLen + variantBlockSize <= chunkBinLen)
					{
						intermediateH = roundFunc(
							chunk.slice(i, i + variantBlockIntInc),
							intermediateH
						);
						updateProcessedLen += variantBlockSize;
					}
				}
				processedLen += updateProcessedLen;
				remainder = chunk.slice(updateProcessedLen >>> 5);
				remainderLen = chunkBinLen % variantBlockSize;
				updatedCalled = true;
			};

			/**
			 * Returns the desired SHA hash of the string specified at instantiation
			 * using the specified parameters
			 *
			 * @expose
			 * @param {string} format The desired output formatting (B64, HEX,
			 *   BYTES, or ARRAYBUFFER)
			 * @param {{outputUpper : (boolean|undefined), b64Pad : (string|undefined)}=}
			 *   options Hash list of output formatting options
			 * @return {string|ArrayBuffer} The string representation of the hash
			 *   in the format specified.
			 */
			this.getHash = function(format, options)
			{
				var formatFunc, i, outputOptions, finalizedH;

				if (true === hmacKeySet)
				{
					throw new Error("Cannot call getHash after setting HMAC key");
				}

				outputOptions = getOutputOpts(options);

				/* Validate the output format selection */
				switch (format)
				{
					case "HEX":
						formatFunc = function(binarray) {return binb2hex(binarray, outputOptions);};
						break;
					case "B64":
						formatFunc = function(binarray) {return binb2b64(binarray, outputOptions);};
						break;
					case "BYTES":
						formatFunc = binb2bytes;
						break;
					case "ARRAYBUFFER":
						try {
							i = new ArrayBuffer(0);
						} catch (err) {
							throw new Error("ARRAYBUFFER not supported by this environment");
						}
						formatFunc = binb2arraybuffer;
						break;
					default:
						throw new Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
				}

				finalizedH = finalizeFunc(remainder.slice(), remainderLen, processedLen, intermediateH.slice());
				for (i = 1; i < numRounds; i += 1)
				{
					finalizedH = finalizeFunc(finalizedH, outputBinLen, 0, getH(shaVariant));
				}

				return formatFunc(finalizedH);
			};

			/**
			 * add by isco
			 * 计算架平要求的文件累积SHA用以分片上传
			 * 在binb2tempHex中会把本机字节顺序转化为网络字节顺序，中间结果才能跟架平的结果匹配上
			 * 当然这只是一个规则，你完全不用在意这个逻辑
			 */
			this.getTempHash = function(options)
			{
				return binb2tempHex(intermediateH.slice(), getOutputOpts(options));
			};

			/**
			 * Returns the the HMAC in the specified format using the key given by
			 * a previous setHMACKey call.
			 *
			 * @expose
			 * @param {string} format The desired output formatting
			 *   (B64, HEX, BYTES, or ARRAYBUFFER)
			 * @param {{outputUpper : (boolean|undefined), b64Pad : (string|undefined)}=}
			 *   options associative array of output formatting options
			 * @return {string|ArrayBuffer} The string representation of the hash in the
			 *   format specified.
			 */
			this.getHMAC = function(format, options)
			{
				var formatFunc,	firstHash, outputOptions, finalizedH;

				if (false === hmacKeySet)
				{
					throw new Error("Cannot call getHMAC without first setting HMAC key");
				}

				outputOptions = getOutputOpts(options);

				/* Validate the output format selection */
				switch (format)
				{
					case "HEX":
						formatFunc = function(binarray) {return binb2hex(binarray, outputOptions);};
						break;
					case "B64":
						formatFunc = function(binarray) {return binb2b64(binarray, outputOptions);};
						break;
					case "BYTES":
						formatFunc = binb2bytes;
						break;
					case "ARRAYBUFFER":
						try {
							formatFunc = new ArrayBuffer(0);
						} catch (err) {
							throw new Error("ARRAYBUFFER not supported by this environment");
						}
						formatFunc = binb2arraybuffer;
						break;
					default:
						throw new Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
				}

				firstHash = finalizeFunc(remainder.slice(), remainderLen, processedLen, intermediateH.slice());
				finalizedH = roundFunc(keyWithOPad, getH(shaVariant));
				finalizedH = finalizeFunc(firstHash, outputBinLen, variantBlockSize, finalizedH);

				return formatFunc(finalizedH);
			};
		};

		if (("function" === typeof define) && (define["amd"])) /* AMD Support */
		{
			define.pack("./tool.sha",[],function()
			{
				return jsSHA;
			});
		} else if ("undefined" !== typeof exports) /* Node Support */
		{
			if (("undefined" !== typeof module) && module["exports"])
			{
				module["exports"] = exports = jsSHA;
			}
			else {
				//exports = jsSHA;
			}
		} else { /* Browsers and Web Workers*/
			global["jsSHA"] = jsSHA;
		}
	}(this));

	/**
	 * html_pro 上传文件，计算sha的worker
	 * @iscowei 05/25/2016
	 */
	var shaObj;
	onmessage = function (e) {
		var data = e.data, output = {};
		if(!data || !data.cmd) {
			return;
		}

		switch(data.cmd) {
			case 'create':
				shaObj = new exports("SHA-1", "B64");
				break;
			case 'update':
				if(data.base64) {
					shaObj.update(data.base64);
					output = {
						cmd: data.cmd,
						result: 0
					};
				}
				break;
			case 'getHash':
				output = {
					cmd: data.cmd,
					result: 0,
					hash: shaObj.getHash("HEX")
				};
				break;
			case 'getTempHash':
				output = {
					cmd: data.cmd,
					result: 0,
					hash: shaObj.getTempHash()
				};
				break;
			case 'debug':
				output = {
					cmd: data.cmd,
					result: 0,
					message: data.message
				};
				break;
			default:
				break;
		}

		return output;
	};

	module.exports = {
		'postMessage': function(data) {
			return onmessage({
				data: data
			})
		}
	};
});/**
 * 中转站文件上传
 * @author hibincheng
 * @date 2015-05-11
 */
define.pack("./tool.temporary_upload",["lib","common","$","./tool.upload_cache","./upload_route"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        routers = lib.get('./routers'),
        widgets = common.get('./ui.widgets'),
        query_user = common.get('./query_user'),
        File_object = common.get('./file.file_object'),
        constants = common.get('./constants'),
        request = common.get('./request'),

        upload_cache = require('./tool.upload_cache'),
        upload_route = require('./upload_route'),

        undefined;

    var temporary_file_max_valid_day;

    var temporary = {
        /**
         * 尝试是否可以上传到中转站
         */
        upload_if: function() {
            var cache = upload_cache.get_up_main_cache(),
                over_max_size_tasks = [],
                over_flow_tasks = [],
                success_count = 0,
                can_temporary_upload_count = 0,
                me = this;

            if(query_user.get_cached_user().is_weixin_user()) {
                return;
            }

	        //表单上传不支持上传中转站
	        if(upload_route.type == 'upload_form') {
		        return;
	        }

            //这个each方法实现得有问题，导致要用this获取item
            cache.each(function() {
                var task = this;
                if(!task.folder_id && task.log_code && !task.is_temporary() && !task.is_temporary_ignored()) {
                    if(task.log_code == 1127) {
                        over_flow_tasks.push(task);
                        can_temporary_upload_count++;
                    } else if(task.log_code == 1029 || task.log_code == 1131) {
                        over_max_size_tasks.push(task);
                        can_temporary_upload_count++;
                    }
                }
                if(!task.log_code){
                    success_count++;
                }
            });
            if(!over_flow_tasks.length && !over_max_size_tasks.length) {
                return;
            }

            if(!temporary_file_max_valid_day) {
                me.load_valid_time().done(function(body) {
                    temporary_file_max_valid_day = Math.ceil(body.temporary_file_max_valid_time/(60*60*24));
                    me.show_confirm(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks);
                }).fail(function() {
                    temporary_file_max_valid_day = 7;
                });
            } else {
                me.show_confirm(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks);
            }

        },

        show_confirm: function(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks) {
            var me = this;
            var user = query_user.get_cached_user(),
                max_single_size = user.get_max_single_file_size(),
                max_flow_size = user.get_flow_info()['flow_every_day_max_upload_size'];

            max_single_size = File_object.get_readability_size(max_single_size, false);
            max_flow_size = File_object.get_readability_size(max_flow_size, false);
            var title = over_flow_tasks.length
		            ? '您今日流量超过' + max_flow_size + '，' + success_count + '个文件上传成功'
		            : '有' + over_max_size_tasks.length + '个文件超过' + (upload_route.type == 'upload_form' ? '10M' : max_single_size) + '，' + success_count + '个文件上传成功',
	            desc = '剩余' + can_temporary_upload_count + '个可继续上传到中转站，为你暂存' + temporary_file_max_valid_day + '天';

            if(!user.is_weiyun_vip() && !user.is_weixin_user()) {
                desc += '或<a href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>上传更大文件';
            }

            widgets.confirm('提示', title, desc, function(e) {
                me.re_upload(over_flow_tasks.concat(over_max_size_tasks));
            }, function() {
                me.ignore_temporary_upload(over_flow_tasks.concat(over_max_size_tasks));
            }, ['继续上传到中转站', '取消'], false);
        },

        load_valid_time: function() {
            var def = $.Deferred();

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                def.reject();
            });

            return def;
        },

        /**
         * 可以上传到中转站的文件重新上传
         * @param retry_tasks
         */
        re_upload: function(retry_tasks) {
            $.each(retry_tasks, function(i, task) {
                task.set_temporary(true);
                task.log_code = 0;
                task.minus_info('error');
                task.change_state('wait');
            });

            retry_tasks[0].events.nex_task.call(retry_tasks[0]); //从第一个从新开始上传

            this.go_station();
        },

        ignore_temporary_upload: function(retry_tasks) {
            $.each(retry_tasks, function(i, task) {
                task.ignore_temporary_upload(true);
            });
        },

        /**
         * 跳转到中转站
         */
        go_station: function() {
            setTimeout(function() {
                routers.go({ m: 'station' });
            }, 500);

        }
    };

    $.extend(temporary, events);

    return temporary;
});/**
 * User: trumpli
 * Date: 13-7-30
 * Time: 下午8:29
 */
define.pack("./tool.upload_cache",["lib","$","./tool.upload_queue","./tool.upload_static"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        $ = require('$'),
        Queue = require('./tool.upload_queue'),
        Static,
        get_static= function(){
            return Static || (Static = require('./tool.upload_static'));
        };

    var Cache = function (cache_key) {
        this.cache_key = cache_key;
        this.cache = {length:0};
        this.curr_cache = {length: 0};//当前正在上传的任务
        this.task_list = [];
        this.total_size = 0;//上传总量
        this.passed_size = 0;//已上传量
        this.count_nums = {'pause':0,'error':0,'done':0,'length':0};
        this.folder_type = -1;
    };

    $.extend(
        Cache.prototype,
        {
            _clear: function () {//清空
                this.passed_size = this.total_size = 0;
                this.cache = {length:0};
                this.count_nums = {'pause':0,'error':0,'done':0};
                this.curr_cache = {length:0};
                this.task_list = [];
                Queue.clear(this.cache_key);
                delete this._queue;
            },

            plus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(!task[has_key]){
                    this.count_nums[key] += 1;
                    task[has_key] = true;
                }
            },
            minus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(task[has_key]) {
                    this.count_nums[key] -= 1;
                    task[has_key] = false;
                }
            },
            get_all_length: function () {
                return this.cache.length;
            },
            get_total_size: function (total_size) {
                if (total_size) {
                    this.total_size = total_size;
                }
                return this.total_size;
            },
            get_passed_size: function (passed_size) {
                if (passed_size) {
                    this.passed_size = passed_size;
                }
                return this.passed_size;
            },
            get_count_nums: function(){
                this.count_nums.length = this.cache.length;
                return this.count_nums;
            },
            is_done: function () {
                var counts = this.get_count_nums();
                return counts.length <= counts.error + counts.pause + counts.done;
            },

            get_curr_upload: function () {
                return this.cache[this.get_queue().get_only_key()];
            },
            get_curr_cache: function () {
                return this.curr_cache;
            },

            pop_curr_cache: function(del_id){
                if(this.curr_cache[del_id]){
                    delete this.curr_cache[del_id];
                    this.curr_cache.length-=1;
                }
            },
            push_curr_cache: function(id,ctx){
                if(!this.curr_cache[ id ]){
                    this.curr_cache[ id ] = ctx;
                    this.curr_cache.length += 1;
                }
            },

            get_cache: function () {
                return this.cache;
            },
            push_cache: function(id,ctx){
                if( !this.cache[id] ){

                    this.cache[id] = ctx;
                    this.cache.length+=1;
	                this.count_nums.length = this.cache.length;
                    this.task_list.push(ctx);
                }
            },
            pop_cache: function(id){
                if( !!this.cache[id] ){
                    delete this.cache[id];
                    this.cache.length-=1;
	                this.count_nums.length = this.cache.length;
                }
            },
            each: function (fn) {
                var cache = this.get_cache();
                for(var key in cache){
                    if(key!=='length'){
                        if( false === fn.call(cache[key])){
                            return;
                        }
                    }
                }
            },
            get_queue: function () {
                return this._queue || ( this._queue = Queue.get(this.cache_key) );
            },
            /**
             * 任务中是否含有文件夹
             * @param force强制从缓存中读取
             */
            is_contain_folder: function( force ){
                var me = this;
                if(me.folder_type === -1 || force){
                    me.folder_type = false;
                    me.each(function(){
                        if( get_static().FOLDER_TYPE  === this.file_type ){
                            me.folder_type = true;
                            return false;
                        }
                    });
                }
                return me.folder_type;
            },
            /**
             * 执行下一个任务
             */
            do_next: function(){
                var me = this;
                if(me.curr_cache.length == 0){
                    if( ! get_static().cpu.is_proxy_able(
                        function(){
                            me.get_queue().dequeue();
                        }
                    )){
                        setTimeout(function(){
                            me.get_queue().dequeue();
                        },get_static().cpu.get_immediate_time());
                    }
                }
            },
            /**
             * 集合中是否有正在运行的任务
             * @returns {number} 1:有任务正在运行，0:已经没有任务在运行了
             */
            has_task_running: function(){
                if(this.get_all_length() > 0 && !this.is_done())
                    return 1;
                return 0;
            },

            get_next_task: function() {
                var cur_upload_task = this.get_curr_upload();
                var next_task_index = -1;
                var task_list = this.task_list || [];
                $.each(task_list, function(i, task) {
                    if(task == cur_upload_task) {
                        next_task_index = i + 1;
                        return false;
                    }
                });

                var find = false;
                while(task_list[next_task_index]) {
                    if(task_list[next_task_index].state == 'wait') {
                        find = true;
                        break;
                    } else {
                        next_task_index++;
                    }
                }

                if(find) {
                    return task_list[next_task_index];
                }
            }
        }
    );

    var caches = {length: 0};

    return {
        default_cache_key: 'default_cache_key',//上传默认Cache
        default_down_cache_key: 'down_cache_key',//下载默认Cache
	    default_offline_cache_key: 'offline_cache_key',//离线下载默认Cache
        /**
         * 上传管理器中的总长度
         */
        length: function(){
            return this.get_up_main_cache().get_count_nums().length + this.get_dw_main_cache().get_count_nums().length + this.get_od_main_cache().get_count_nums().length;
        },
        /**
         * 是否初始化
         * @returns {boolean}
         */
        is_init: function () {
            return caches.length > 0;
        },
        /**
         * 获取cache
         * @param cache_key
         * @returns {*}
         */
        get: function (cache_key) {
            var _key = cache_key || this.default_cache_key;
            if (!caches[_key]) {
                caches[_key] = new Cache(_key);
                caches.length += 1;
            }
            return caches[_key];
        },
        /**
         * 清空
         * @param key 可选
         */
        clear: function (key) {
            var key = key || this.default_cache_key;
            if(caches[key]){
                caches[key]._clear();
                caches[key] = null;
                delete caches[key];
                caches.length -= 1;
            }
        },
        /**
         * 获取指定local_id的任务对象
         * @param local_id
         * @returns {*}
         */
        get_task: function(local_id){
            for (var key in caches) {
                if (key === 'length')
                    continue;
                var task = caches[key].get_cache()[local_id];
                if (task) {
                    return task;
                }
            }
        },
        /**
         * 获取上传主任务cache
         * @returns {*}
         */
        get_up_main_cache: function () {
            return this.get(this.default_cache_key);
        },
        /**
         * 获取下载主任务cache
         * @returns {*}
         */
        get_dw_main_cache: function () {
            return this.get(this.default_down_cache_key);
        },
	    /**
	     * 获取离线下载主任务cache
	     * @returns {*}
	     */
	    get_od_main_cache: function () {
		    return this.get(this.default_offline_cache_key);
	    },
        /**
         * 通过 local_id 获取主任务中的对象，注意：这种获取方式，只适用于文件夹
         * @param local_id
         * @returns {*}
         */
        get_folder_by_id: function (local_id) {
            return this.get_up_main_cache().cache[local_id];
        },
        /**
         * 获取当前正真上传的任务
         * @returns {*}
         */
        get_curr_real_upload: function () {
            var task = this.get_up_main_cache().get_curr_upload();
            if (task && get_static().FOLDER_TYPE  === task.file_type) {
                return task.get_sub_cache().get_curr_upload();
            }
            return task;
        }
    }
});
define.pack("./tool.upload_queue",["$","lib"],function (require, exports, module) {

    var $ = require('$'),
        console = require('lib').get('./console'),
        Queue = function () {
            this.fn_stack = [];
            this.ctx_stack = [];
            this.only_key = 0;
        },
        queues = {length: 0};

    $.extend(Queue.prototype,
        {
            length: function(){
                return this.fn_stack.length;
            },
            head: function (ctx, fn) {
                this.remove(this.del_local_id);
                this.fn_stack.unshift(fn);
                this.ctx_stack.unshift(ctx);
            },
            tail: function (ctx, fn) {
                fn.del_local_id = ctx.del_local_id;
                this.fn_stack.push(fn);
                this.ctx_stack.push(ctx);
            },
            dequeue: function (len) {
                if (this.fn_stack.length === 0) {
                    return;
                }

                len = Math.min(this.fn_stack.length, len || 1);

                var fn, ctx;
                for (var i = 0; i < len; i++) {
                    fn = this.fn_stack.shift();
                    ctx = this.ctx_stack.shift();
                    this.only_key = ctx.local_id;
                    fn && fn.call(ctx);
                }
            },
            clear: function () {
                this.fn_stack.length = 0;
                this.ctx_stack.length = 0;
            },

            remove: function (del_local_id) {
                if(!del_local_id)
                    return;
                for (var len = this.fn_stack.length - 1; len >= 0; len--) {
                    var c = this.fn_stack[len];
                    if (c.del_local_id === del_local_id) {
                        this.fn_stack.splice(len, 1);
                        this.ctx_stack.splice(len, 1);
                        return true;
                    }
                }
            },
            get_only_key: function () {
                return this.only_key;
            },
            set_only_key: function (s_id, t_id) {//扫描后更新了local_id需要做出调整
                if (!s_id || this.only_key === s_id) {
                    this.only_key = t_id;
                }
            }
        });


    module.exports = {
        get: function (key) {
            var _key = key || 'default_key';
            if (!queues[_key]) {
                queues[_key] = new Queue();
                queues.length += 1;
            }
            return queues[_key];
        },
        clear: function (key) {
            var _key = key || 'default_key';
            if(queues[_key]){
                queues[_key].clear();
                queues[_key] = null;
                queues.length -= 1;
                delete queues[_key];
            }
        }
    }
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-1
 * Time: 下午3:53
 */
define.pack("./tool.upload_static",["lib","common","$","./tool.upload_cache","./speed.speed_task","./msg","disk","./offline_download.offline_download","./view","./tool.bar_info"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        common = require('common'),
        $ = require('$'),

        upload_event = common.get('./global.global_event').namespace('upload2'),
        widgets = common.get('./ui.widgets'),
        functional = common.get('./util.functional'),
	    request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),

        Cache = require('./tool.upload_cache'),
        speed_task = require('./speed.speed_task'),
        msg = require('./msg'),
        disk_mod = require('disk'),
        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),
	    offline_download = require('./offline_download.offline_download'),

        view,//视图模块
        get_view = function () {
            return view || (view = require('./view'));
        },
        bar_info,//
        get_bar_info = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        };

    var Static = {
        FILE_TYPE: 1,//文件标识
        FOLDER_TYPE: 2,//文件夹标识
	    OFFLINE_TYPE: 3,//离线下载标识
        OP_TYPES: {
            DOWN: 1,//下载
            UPLOAD: 2,//上传
	        OFFLINE: 3//离线下载
        },
        /**
         * 能暂定上传的状态
         */
        _can_stop_states: { 'start': 1, 'upload_file_update_process': 1, 'file_sign_update_process': 1, 'file_sign_done': 1, 'continuee': 1 },
        /**
         * 能继续传的状态
         */
        _can_resume_states: {'upload_file_update_process': 1, 'pause': 1, 'resume_pause': 1, 'processing': 1},
        /**
         * 获取错误提示消息
         * @param code
         * @param msg_type
         * @param error_type
         * @param error_step 控件错误的调试位置
         * @returns {*}
         */
        get_error_msg: function (code, msg_type, error_type, error_step, err_msg) {
            return msg.get(error_type || 'upload_error', code, msg_type, error_step, err_msg);
        },
        /**
         * 停止上传
         * @param cache_key cache的对应的key
         */
        stop_upload_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length' && this._can_stop_states[cache[key].state]) {
                    cache[key].stop_upload(true);
                }
            }
        },
        /**
         * 停止下载
         * @param cache_key cache的对应的key
         */
        stop_down_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_down_cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length') {
                    cache[key].remove_file();
                }
            }
        },
	    /**
	     * 停止正在进行的
         * 离线下载任务
	     * @param cache_key cache的对应的key
	     */
	    stop_offline_all: function (cache_key) {
            var completed_od_task_ids = [];
		    var cache = Cache.get(cache_key || Cache.default_offline_cache_key).get_cache();
		    for (var key in cache) {
                var item = cache[key];
			    if (key !== 'length' && (item.state !== 'done')) {
				    item.remove_file();
                    completed_od_task_ids.push(item.task.task_id);
			    }
		    }
		    offline_download.cancel_task({
                task_id: completed_od_task_ids
            });
	    },
        /**
         * 清理删除文件
         */
        remove_all: function (cache_key) {
	        var cache = Cache.get(cache_key || Cache.default_cache_key),
		        list = cache.get_cache(),
		        task;
            for (var key in list) {
                if (key !== 'length') {
	                task = list[key];
                    if (task.state !== 'done') {
	                    task.remove_file();
	                    cache.pop_cache(task.local_id);//清理cache
	                    cache.pop_curr_cache(task.del_local_id);
	                    cache.get_queue().remove(task.del_local_id);
	                    task.view.invoke_state('clear');
                    }
                }
            }
        },
        /**
         * 清除指定cache_key的上传任务
         * @param cache_key
         */
        clear_upload_all: function (cache_key) {
            Static.stop_upload_all(cache_key);//停止上传
            Static.remove_all(cache_key);//删除文件
        },
        /**
         * 清除指定cache_key的下载任务
         * @param cache_key
         */
        clear_down_all: function (cache_key) {
            Static.stop_down_all(cache_key);//停止上传
            Cache.clear(cache_key);//清理cache
        },
	    /**
	     * 清除正在进行的
         * 指定cache_key的离线下载任务
	     * @param cache_key
	     */
	    clear_offline_all: function (cache_key) {
		    Static.stop_offline_all(cache_key);//停止上传
		    Static.remove_all(cache_key);//删除文件
	    },
	    /**
	     * 清除指定cache_key的上传任务
	     * @param {[]} cache_keys
	     */
	    clear_complete_all: function (cache_keys) {
            cache_keys = $.isArray(cache_keys) ? cache_keys : [cache_keys];
            var caches = {},
                lists = {},
                completed_od_task_ids = [],
                task, key, list, cache_key, i;
            for (i in cache_keys) {
                cache_key = cache_keys[i];
                caches[cache_key] = Cache.get(cache_key);
                lists[cache_key] = caches[cache_key].get_cache();
            }
            for (cache_key in lists) {
                list = lists[cache_key];
                for (key in list) {
                    if(key !== 'length') {
                        task = list[key];
                        if(task.state === 'done') {
                            caches[cache_key].minus_info(task.state, task);
                            caches[cache_key].pop_cache(task.local_id);//清理cache
                            caches[cache_key].pop_curr_cache(task.del_local_id);
                            task.view.invoke_state('clear');
                            /**
                             * 当任务是离线下载时，需要记录下已完成的任务id，向后台发出请求删除
                             * 而当是普通上传任务时，无需发请求删除
                             */
                            if (cache_key === Cache.default_offline_cache_key) {
                                completed_od_task_ids.push(task.task.task_id);
                            }
                        }
                    }
                }
            }

            /**
             * 发出请求删除已完成的离线下载任务
             */
            offline_download.cancel_task({
                task_id: completed_od_task_ids
            });
	    },
        /**
         * 获取关闭提示
         * @returns {{num: number, text: string}}
         * @private
         */
        _get_close_info: function () {
            var num = 0,
                text = '',
                up_counts = Cache.get_up_main_cache().get_count_nums(),
	            od_counts = Cache.get_od_main_cache().get_count_nums(),
                dw_counts = Cache.get_dw_main_cache().get_count_nums();
            if (up_counts.length > up_counts.done + up_counts.error) {
                num += 1;
            }
            if (dw_counts.length > dw_counts.done + dw_counts.error) {
                num += 2;
            }
	        if (od_counts.length > od_counts.done + od_counts.error) {
		        num += 4;
	        }
            if (num > 0) {
                text = num === 1 ? '未上传完成' : (num === 2 ? '未下载完成' : (num === 3 ? '未完成离线' : '未完成'));
            }
            return {'num': num, 'text': text};
        },
        dom_events: {
            click_to_max: function () {
                get_view().max();
            },
            click_to_min: function () {
                get_view().min();
            },
            /**
             * 点击“取消”
             * @param {Boolean} by_user 是否是由用户触发
             */
            click_clear_process: function (by_user) {
                var tip_info = Static._get_close_info(),
                    sure_fn = function () {
                        Static.clear_upload_all(Cache.default_cache_key);
                        Static.clear_down_all(Cache.default_down_cache_key);
	                    Static.clear_offline_all(Cache.default_offline_cache_key);
                        speed_task.stop();//停止测速度
	                    get_view().clear('process');
                        get_bar_info().upload.set_process();
	                    get_bar_info().destroy();
                        Static.disk_route.prepend_left();
                    },
                    fail_fn = function () {//权宜之计，点取消，任务管理器不进行最小化
                        get_view().max();
                    };
                if (tip_info.num !== 0) {
                    widgets.confirm('全部取消', "列表中有" + tip_info.text + "的任务，确定要取消吗？", '', sure_fn, fail_fn, ['是', '否']);
                } else {
                    sure_fn();
                }
                if (!by_user) {//非用户手动点击，返回false，用于阻断日志上报
                    return false;
                }
            },
	        /**
	         * 点击“清空记录”
	         * @param {Boolean} by_user 是否是由用户触发
	         */
	        click_clear_complete: function () {
		        get_view().clear('complete');
		        Static.clear_complete_all([
                    Cache.default_cache_key,
                    Cache.default_offline_cache_key
                ]);
	        }
        },
        /**
         * 暂停状态转换为续传状态
         * @param ary
         * @param state
         */
        batch_pause_to_run: function (ary, state) {
            if (!ary.length)
                return;
            //第一个任务，需要判断是否可以执行
            var waiter = ary[0],
                runner = waiter.get_curr_upload();
            waiter.minus_info('pause'); //减掉自身添加的暂停数
            if (waiter.get_curr_cache().length === 0) {//进入执行队列
                waiter.change_state('to_' + state);
                //waiter.view.change_state(state);//更新UI
                waiter.events.nex_task.call(waiter);
            } else {
                waiter.change_state('to_' + state);
                //waiter.view.wait();//更新UI
                waiter.view.invoke_state('wait');
                if (!!runner && runner.can_pause_self()) {//当前任务可暂停，则立刻暂停
                    runner.change_state('pause');
                }
            }

            if (ary.length > 1) {//有多个任务同时进行时，分别进入预运行状态
                setTimeout(function () {//加定时器，是因为 nex_task是通过setTimeout(xx,0)调用的
                    //除第一个外，其余放到等待队列
                    for (var i = ary.length - 1; i > 0; i--) {
                        ary[i].minus_info('pause');//减掉自身添加的暂停数
                        ary[i].change_state('to_' + state);//任务进入预执行状态
                        //ary[i].view.wait();//等待UI
                        waiter.view.invoke_state('wait');
                    }
                }, 10);
            }
        },
        /**
         * @param state_name
         * @param state_fn
         */
        add_state: function (state_name, state_fn) {
            this.interface('states.' + state_name, state_fn);
        },
        /**
         *
         * @param event_name
         * @param event_fn
         */
        add_events: function (event_name, event_fn) {
            this.interface('events.' + event_name, event_fn);
        },
        /**
         * 批量重试任务
         * @param ary
         * @param cache_key
         */
        batch_re_start: function (ary, cache_key) {
            if (ary.length) {
                var queue = Cache.get(cache_key).get_queue();
                //for (var i = 0, j = ary.length; i < j; i++) {
                //重试的顺序改成从前往后
                for (var i = ary.length-1, j = 0; i >= j; i--) {
                    //延后执行
                    queue.head(ary[i], function () {
                        this.events.re_start.call(this, true);//用户点击重试
                    });
                    ary[i].minus_info('error');//错误减1
                    ary[i].view.invoke_state('wait');//将队列中所有对象的 view改为等待状态；
                    //ary[i].view.wait();//将队列中所有对象的 view改为等待状态；
                }
                var waiter = ary[0],
                    running = waiter.get_curr_upload(),
                    space = waiter.get_curr_cache().length;
                if (space === 0) {
                    return waiter.events.nex_task.call(waiter);
                } else {
                    if (running) {
                        if (running.can_pause_self()) {
                            //暂停运行者
                            return running.change_state('pause');
                        }
                    }
                    //继续等待
                }
            }
        },
        /**
         * 能否执行续传
         * @param state
         * @returns {boolean}
         */
        can_resume: function (state) {
            return this._can_resume_states[state];
        },
        /**
         * 关闭页面时，当前上传对象时否可被保存进度（只有控件可以保存，其它丢失了文件句柄，无法续传，控件是可以根据文件路径来读取文件的所以可以）
         */
        can_resume_upload_obj: function(upload_obj) {
            if(upload_obj.upload_type === 'active_plugin' || upload_obj.upload_type === 'webkit_plugin') {
                return true;
            }
            return false;
        },
        /**
         * 当页面关闭，本地保存上传/下载进度，用于续传
         */
        store_upload_down_progress: function () {
            var resume_files = {'tasks': [], 'folder_tasks': [], 'down_tasks': []},
                me = this;
            //上传
            Cache.get_up_main_cache().each(function () {
                if (me.can_resume(this.state) && me.can_resume_upload_obj(this)) {
                    var unit = this.get_resume_param();
                    if (unit) {
                        if (this.file_type === me.FOLDER_TYPE) {//文件夹
                            resume_files.folder_tasks.push(unit);
                        } else {
                            resume_files.tasks.push(unit);
                        }
                    }
                }
            });
            upload_event.trigger('set_resume_store', resume_files);
        },
        /**
         * 获取关闭页面时的提示
         * @param cache_key
         */
        get_page_unload_confirm: function (cache_key) {
            var tip_info = Static._get_close_info();
            return tip_info.num!==0 ? '您有'+tip_info.text+'的文件, 确定要关闭微云吗？' : undefined;
        },
        /**
         * 点击 全部重试（错误的任务，可重试时）
         * todo: process/complete
         */
        click_re_try_all: function () {
            var view = get_view();
            view.max();
            view.upload_box.scrollTop(view.upload_files.height());
            var er_list = [];
            view.upload_files
                .find('li.error')
                .appendTo(view.upload_files)
                .each(function () {
                    var task = view.get_task($(this).data('vid'));
                    if (task.can_re_start()) {
                        er_list.push(task);
                    }
                });
            this.batch_re_start(er_list);
        },
        /**
         * 点击 全部续传（被暂停的任务）
         */
        click_resume: function () {
            var pause = [],
                resume_pause = [];
            Cache.get_up_main_cache().each(function () {
                if (this.state === 'pause')
                    pause.push(this);
                else if (this.state === 'resume_pause')
                    resume_pause.push(this);
            });
            this.batch_pause_to_run(pause, 'continuee');
            this.batch_pause_to_run(resume_pause, 'resume_continuee');
        },
        /**
         * 网盘路由
         */
        disk_route: {
            _stack: [],
            _max_stack_dept: 3,//最大缓存深度
            _max_depart_time: 4000,//最大插入时间间隔
            _real_prepend: function(){
                var me = Static.disk_route,
                    stack = me._stack,
                    len = me._stack.length,
                    cache = {};
                me._last_prepend_time = +new Date();
                for (var i = 0 ; i < len; i++) {
                    var node = stack.shift();
                    if (!cache[node.pdir]) {
                        cache[node.pdir] = [];
                    }
                    cache[node.pdir].push(node);
                }
                for (var pdir in cache) {
                    cache[pdir].reverse();
                    try {
                        file_list.prepend_nodes(cache[pdir], true, pdir);//按父目录批量插入
                    } catch (xe) {
                        console.warn('disk_route prepend: file_list.prepend_nodes : ', xe);
                    }
                }
                me._last_cost = +new Date() - me._last_prepend_time;
                Static.cpu.set_immediate_time(me._last_cost , true);
                Static.cpu.disable_proxy();
            },
             /**
             * 批量插入
             * @private
             */
            _prepend: function () {
                 var me = this;
                 Static.cpu.set_immediate_time( me._last_cost ? me._last_cost : 32 );
                 Static.cpu.able_proxy();
                 setTimeout( me._real_prepend  ,0);
            },
            /**
             * 是否满足可以插入的条件
             * @returns {boolean}
             * @private
             */
            _can_prepend: function(){
                var me = this,
                    len = me._stack.length;
                if(!len){
                    return false;
                }
                if(!me._last_prepend_time//第一次
                    ||
                  ((+new Date() - me._last_prepend_time) > me._max_depart_time)//超过最大插入时间间隔
                    ||
                    len > me._max_stack_dept//已经达到最大缓存深度
                    ||
                  Cache.get_up_main_cache().is_done()//上传已经完成
                ){
                    return true;
                }
                return false;
            },
            /**
             * 上传成功后节点批量插入网盘 (原因：大批量文件单个插入，有性能问题)
             * @param node
             */
            prepend: function (node) {
                this._stack.push(node);
                if(this._can_prepend()){
                    this._prepend();
                } else {
                    Static.cpu.disable_proxy();
                }
            },
            /**
             * 插入剩下的node节点
             */
            prepend_left: function(){
                if(this._stack.length>0){
                    this._prepend();
                }
                this._last_prepend_time = null;
            }
        },
        /**
         * cpu信息
         */
        cpu: {
            _min: 4,//最小中断时间
            _max: 3200,//最大中断时间
            _inter_time: 16,//中断时间
            /**
             * 设置 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @param {int} time
             * @param {boolean} [done_hard_task] 完成了困难的任务
             */
            set_immediate_time: function (time , done_hard_task) {
                if(time >= this._max){//扩大_max的时间
                    this._max = this.time > 5000 ? 5000 : this.time;
                    console.debug('expend:',this._max);
                }

                if ( time <= this._min ) {//输出最大中断时间
                    this._inter_time = this._min;
                } else {
                    this._inter_time = (time > this._max) ? this._max : time ;
                }

                if(done_hard_task){//完成了困难任务后，执行剩下的任务
                    if(!this._proxy_fn)
                        return;
                    var me = this;
                    setTimeout(function(){
                        me._proxy_fn.call();
                        me._proxy_fn = null;
                    },16);
                }
            },
            /**
             * 获取 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @returns {number}
             */
            get_immediate_time: function () {
                return this._inter_time;
            },
            able_proxy: function(){
                this._proxy_albe = true;
            },
            disable_proxy: function(){
                this._proxy_albe = false;
            },
            is_proxy_able: function(fn){
                if( this._proxy_albe && this._inter_time > 100 ){
                    this._proxy_fn = fn;
                    return true;
                }
            }
        },
	    /**
	     * 非会员查询极速上传体验券
	     * @returns {String}
	     */
	    get_coupon_info: function() {
		    var defer = $.Deferred();

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
			    cmd: 'DiskUserConfigGet',
			    cavil: true,
			    pb_v2: true,
			    header: { appid: 30013 },
			    body: {
				    get_coupon: true
			    }
		    }).done(function(msg, ret, body, header) {
			    if(ret == 0 && body && body.coupon_info) {
				    defer.resolve(body.coupon_info);
			    } else {
				    defer.reject(null);
			    }
		    }).fail(function(msg, ret, body, header) {
			    defer.reject(msg, ret, body, header);
		    });

		    return defer;
	    },
	    /**
	     * 非会员查询离线下载体验券
	     * @returns {String}
	     */
	    get_od_info: function() {
		    var defer = $.Deferred();

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
			    cmd: 'DiskUserConfigGet',
			    cavil: true,
			    pb_v2: true,
			    header: { appid: 30013 },
			    body: {
				    get_od_coupon: true
			    }
		    }).done(function(msg, ret, body, header) {
			    if(ret == 0 && body && body.od_coupon_info) {
				    defer.resolve(body.od_coupon_info);
			    } else {
				    defer.reject(null);
			    }
		    }).fail(function(msg, ret, body, header) {
			    defer.reject(msg, ret, body, header);
		    });

		    return defer;
	    }
    };

    return Static;
});/**
 * 上传按钮下拉框选择
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./upload_dropdown_menu",["$","common"],function (require, exports, module) {
    var $ = require('$'),
        Pop_panel = require('common').get('./ui.pop_panel'),
        panel;

    return {
        render: function (o) {
            var $dropdown_menu = $('#upload_dropdown_menu');
            panel = new Pop_panel({
                $dom: $dropdown_menu,//弹层对象
                host_$dom: o.host,
                show: function () {
                    var offset = this.o.host_$dom.offset();
                    var height = this.o.host_$dom.height();
                    $dropdown_menu.css({
                        top: offset.top+height-1,
                        left: offset.left
                    }).show();
                },
                hide: function () {
                    $dropdown_menu.hide();
                },
                delay_time: 50//延时50毫秒消失
            });
        },
        hide: function () {
            panel.hide();
        }
    };
});/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define.pack("./upload_file_validata.upload_4g_validata",["common","$"],function(require, exports, module) {

	var common = require('common'),
		$ = require('$');

	var map = {
		max_file_size: function( file_size, max_size ){
			if ( file_size > max_size ){
				return ['上传失败，文件大小超出限制。', 1];
			}
		},
		/*low_file_size: function( file_size, size ){
			if ( file_size < size ){
				return ['你选择的文件小于4G。', 2];
			}
		},
		arrive_max_space: function( space_all, max_space ){
			if ( space_all >= max_space ){
				return ['你的容量达到上限1T，不会再赠送容量了。', 4];
			}
		},*/
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return ['容量不足，请参与送容量活动', 3];
			}
		}

	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});/**
 * 展示loading
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author bondli
 * @date 13-10-08
 */
define.pack("./upload_file_validata.upload_file_check",["lib","$","common","./upload_file_validata.upload_folder_validata","./upload_file_validata.upload_4g_validata","./select_folder.select_folder","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        routers = lib.get('./routers'),
        functional = common.get('./util.functional'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        global_variable = common.get('./global.global_variable'),
        upload_event = common.get('./global.global_event').namespace('upload2'),

        FolderValidata = require('./upload_file_validata.upload_folder_validata'),
        G4Validata = require('./upload_file_validata.upload_4g_validata'),
        select_folder = require('./select_folder.select_folder'),

        is_newest_version = function () {
            return common.get('./util.plugin_detect').is_newest_version();
        }(),

        tmpl = require('./tmpl'),

        G1 = Math.pow(2, 30),
        G2 = G1 * 2,
        G4 = G1 * 4,
        G32 = G1 * 32;


    var upload_file_check = {

        upload_plugin : '',

        //检查文件大小的合法性
        check_max_files_size : function (files, upload_plugin) {
            var me = this;
            this.upload_plugin = upload_plugin;
            if (files.length > 1) {//选择的文件个数大于1个时，直接进入到任务管理器中，这里不进行32G限制检测
                select_folder.show(files, upload_plugin, 'plugin');
                return;
            }
            var file_size = me._get_file_size(files[0]),
                g4Validata = G4Validata.create(),
                ret;

           // var max_upload_size = query_user.get_cached_user().get_max_single_file_size();
            //max_upload_size = max_upload_size*1024 > 0 ? max_upload_size*1024 : Math.pow(2, 30);

           // g4Validata.add_validata('max_file_size', file_size, max_upload_size);
            ret = g4Validata.run();

            if ( ret ) {
                var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + ret[0] + '</span></p>');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
                var dialog = new widgets.Dialog({
                    title: '上传提醒',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: $el,
                    tmpl: tmpl.dialog3,
                    mask_ns: 'gt_4g_tips',
                    buttons: [ btn ],
                    handlers: {
                    }
                });
                dialog.show();
                return;
            }
            else {
                select_folder.show(files, upload_plugin, 'plugin');
                return;
            }
        },

        //获取文件大小
        _get_file_size : function (path) {
            var me = this;
            var file_size = functional.try_it(function () {
                return me.upload_plugin.GetFileSizeString(path) - 0;
            }) || me.upload_plugin.GetFileSize(path) || 0;

            file_size = file_size - 0;
            if (file_size < 0) {
                file_size += G4;
            }

            return file_size;
        },

        //上传前对文件进行检查
        check_start_upload : function(files, upload_plugin, max){
            var me = this;
            this.upload_plugin = upload_plugin;
            var cur_user = query_user.get_cached_user(),
                main_key = cur_user.get_main_dir_key(),
                root_key = cur_user.get_root_key();

            //上传到中转站文件直接上传，不用进入选择目的地
            if(global_variable.get('upload_file_type') == 'temporary') {
                upload_event.trigger('add_upload', upload_plugin, files, {
                    'temporary': true,
                    'ppdir': root_key,
                    'pdir': main_key,
                    'ppdir_name': '微云',
                    'pdir_name': '中转站',
                    'dir_paths': ['中转站'],
                    'dir_id_paths': [main_key]
                });
                routers.go({ m: 'station' });
            } else {
                me.check_max_files_size(files, upload_plugin);
            }


        }

    };

    return upload_file_check;
});/**
 * 添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./upload_file_validata.upload_file_validata",["common","$","./msg"],function(require, exports, module) {

	var common = require('common'),
		query_user = common.get('./query_user'),
		File = common.get('./file.file_object'),
		$ = require('$'),
		msg = require('./msg'),
		error_names = {
			EMPTY_NAME: ['', 1000006],
			DENY_CHAR: ['', 1000007],
			OVER_LIMIT: ['', 1000008]
		},
		video_ext = ['asf', 'avi', 'rm', 'mpeg', '3gp', 'rmvb', 'mov', 'mpg', 'mkv', '3gpp', 'wmv', 'mp4', 'wmf', 'flv', 'f4a', 'webm', 'mod', 'mpe', 'asx', 'vob', 'f4v', 'dv', 'm2ts', 'mts', 'dat'];

	var map = {
		check_name: function(file_name) {
			var code = File.check_name_error_code(file_name);
			if(code) {
				return error_names[code];
			}
		},
		check_video: function(file_name) {
			return;//放开视频上传
			var file_ext = File.get_ext(file_name);
			if($.inArray(file_ext, video_ext) > -1) {
				return ['视频文件暂无法上传', 1000009];
			}
		},
		check_torrent: function(file_name) {
			var file_ext = File.get_ext(file_name);
			if(file_ext !== 'torrent') {
				return ['请选择后缀名为.torrent的种子文件', 1500001];
			}
		},
		//大于4G，提示升级控件（老控件使用）
		up4g_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['大小超过' + File.get_readability_size(max_size) + '请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。', 1000005];
			}
		},
		max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size), 1000001];
			}
		},

		h5_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size) + '请<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>，上传更大文件', 1000001];
			}
		},

		h5_pro_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size)
						+ ((typeof config_data !== 'undefined' && config_data.windows && config_data.windows.download_url)
							? '，请<a href="' + config_data.windows.download_url + '" target="_blank">安装微云客户端</a>，上传'
							: '，请安装微云客户端上传')
						, 1000001];
			}
		},

		max_single_file_size: function(curr_size) {
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			var isvip = user.is_weiyun_vip && user.is_weiyun_vip();
			var max_size = (user.get_max_single_file_size && user.get_max_single_file_size());
			if(!max_size) {
				//非会员1G，会员4G
				max_size = isvip ? Math.pow(2, 30) * 4 : Math.pow(2, 30);
			}
			if(curr_size > max_size) {
				return ['单文件超过' + File.get_readability_size(max_size)
					+ (isvip ? '' : '，<a href="http://ptlogin2.weiyun.com/ho_cross_domain?&amp;tourl=http://jump.weiyun.qq.com/?from%3D1012" target="_blank">开通会员</a>支持大文件上传')
					, 1000010];
			}
		},

		remain_flow_size: function(curr_size) {
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			var isvip = user.is_weiyun_vip && user.is_weiyun_vip();
			var remain_size = (user.get_remain_flow_size && user.get_remain_flow_size());
			if(!remain_size) {
				//非会员1G，会员4G
				remain_size = isvip ? Math.pow(2, 30) * 4 : Math.pow(2, 30);
			}
			//remain_size = -1, 白名单用户，不限制
			if(remain_size > -1 && curr_size > remain_size) {
				return ['文件大小超过当日剩余流量' + File.get_readability_size(remain_size)
					+ (isvip ? '' : '，<a href="http://ptlogin2.weiyun.com/ho_cross_domain?&amp;tourl=http://jump.weiyun.qq.com/?from%3D1012" target="_blank">开通会员</a>上传更多文件')
					, 1000015];
			}
		},

		plugin_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size), 1000010];
			}
		},
		flash_max_size: function(curr_size, max_size) {
			if(curr_size === -1) {
				return ['文件超过' + File.get_readability_size(max_size), 1000001];
			}
			if(curr_size > max_size) {
				if(max_size)
					return [msg.get('upload_error', 1000002), 1000002];
			}
		},
		max_space: function(curr_size, space, space_totle) {
			if(curr_size + space > space_totle) {
				return [msg.get('upload_error', 1000003), 1000003];
			}
		},
		empty_file: function(curr_size) {
			if(curr_size - 0 === 0) {
				return [msg.get('upload_error', 1000004), 1000004];
			}
		}
	};


	var Validata = function() {
		var __map = $.extend({}, map),
			stack = {},
			__self = this;

		var add_validata = function() {
			var key = Array.prototype.shift.call(arguments);
			stack[ key ] = Array.prototype.slice.call(arguments);
		};

		var add_rule = function(fn_name, fn) {
			__map[ fn_name ] = fn;
		};

		var run = function() {
			var flag = false;
			$.each(__map, function(key, fn) {
				var param = stack[ key ];
				if(!param) {
					return;
				}
				var ret = fn.apply(__self, param);
				if(ret) {
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function() {
		return Validata.call(this);
	};

	return {
		create: create
	};

});
/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define.pack("./upload_file_validata.upload_folder_validata",["common","$"],function(require, exports, module) {

	var common = require('common'),
		$ = require('$'),

		constants = common.get('./constants');

	var map = {
		empty_files: function(files){
			if ( files == false ){
				return ['暂不支持上传整个盘符，请重新选择。', 1];
			}
		},
		max_dir_size: function( dir_total_num, used_dir_mun ){
			var max_num = constants.CGI2_DISK_BATCH_LIMIT;
			if ( dir_total_num + used_dir_mun >= max_num ){
				return ['文件夹中的目录总数过多（已选：'+dir_total_num+',已使用：'+used_dir_mun+',总限制：'+max_num+'）。', 2];
			}
		},
		max_level_size: function( dir_level_num, max_level_num ){
			if ( dir_level_num  > max_level_num ){
				return ['所选文件夹下某个目录中文件总数超过'+ max_level_num +'个，请管理后上传。', 3];
			}
		},
		max_files_size: function( files_size, max_files_num ){
			if ( files_size > max_files_num ){
				return ['文件夹中文件总数超过'+ max_files_num +'个，请分批上传。', 4];
			}
		},
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return ['容量不足，请删除一些旧文件或升级空间', 5];
			}
		}

	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});/**
 * 选择文件（IE）
 * @author bondli
 * @date 13-10-17
 */
define.pack("./upload_files.upload_files_ie",["$","lib","common","./tmpl","./upload_folder.loading","./upload_file_validata.upload_file_check"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),
        JSON = lib.get('./json'),

        console = lib.get('./console').namespace('upload2'),

        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./upload_folder.loading'),

        widgets = common.get('./ui.widgets'),

        upload_file_check = require('./upload_file_validata.upload_file_check'),

        G4 = Math.pow(2, 30) * 4,

        is_over_total_num = false,
        is_canceled = false,
        is_finished = false,

        undefined;

    var plugin_callback = {
        /**
         * 控件告知该次文件读取开始
         * @param taskId  
         */
        OnAsyncSelectFileBegin : function(taskId) {
            console.debug('WYCLIENT_OnAsyncSelectFileBegin', taskId);
            is_over_total_num = false;
            is_canceled = false;
            //显示loading
            setTimeout(function(){
                if(is_finished === false && is_over_total_num === false){
                    loading.show('正在获取文件', function(){
                        is_canceled = true;
                        loading.hide();
                        upload_files.release(taskId);
                        upload_files.re_set();
                    });
                }
                
            },300);
            
        },

        /**
         * 控件更新所选的数据
         * @param taskId  
         * @param currentFileCount 已获取的文件数
         */
        OnFilesInfoUpdate : function (taskId, currentFileCount) {
            console.debug('WYCLIENT_OnFilesInfoUpdate', taskId, currentFileCount);
            if(is_canceled === true || is_over_total_num === true) return 1;
            //当文件数大于我们的限制（3000）的时候，直接抛错
            if(currentFileCount > 3000){
                is_over_total_num = true;
                loading.hide();
                upload_files.release(taskId);
                upload_files.show_error_dialog('一次性上传文件总数不能超过3000个');
                return 1;
            }

            upload_files.get_files(taskId, currentFileCount);
            return 1;
        },

        /**
         * 控件告知该次文件读取完毕
         * @param taskId
         * @param totalFileCount 总文件数
         * @param errCode 错误码
         */
        OnAsyncSelectFileComplete : function (taskId, totalFileCount, errCode) {
            is_finished = true;
            console.debug('WYCLIENT_OnAsyncSelectFileComplete', taskId, totalFileCount, errCode);
            if(is_canceled == true || is_over_total_num === true) return;

            if(errCode === 42260002){ //点击了取消
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_files.release(taskId);
            }
            else {
                upload_files.set_total(taskId, totalFileCount);
                if(upload_files.check_finish(taskId)){
                    //隐藏显示的loading
                    loading.hide();
                    var files = upload_files.get_files_arr(taskId);
                    if(files){
                        //调用控件的接口，读取完成后释放内存
                        upload_files.release(taskId);
                        upload_files.show_select_folder(files);
                    }
                }
                else {
                    var times = 1;
                    var t = setInterval(function(){  //都是容错
                        times ++;
                        if(upload_files.check_finish(taskId)){
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            var files = upload_files.get_files_arr(taskId);
                            if(files){
                                //调用控件的接口，读取完成后释放内存
                                upload_files.release(taskId);
                                upload_files.show_select_folder(files);
                            }
                        }
                        if(times>=100){  //长时间没有正确提示错误
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            upload_files.release(taskId);
                            upload_files.re_set();
                            upload_files.show_error_dialog('读取文件出错，请稍后再试。');
                            return false;
                        }
                    },50);
                }
                
            }
            return 1;
        }
    }
    

    var upload_files = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : {},

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
            upload_plugin.OnAsyncBatchSelectFolderEvent = function(event_param){
                var taskId = event_param.LocalID,
                    fileCount = event_param.FileCount, 
                    errCode = event_param.ErrorCode,
                    eventType = event_param.EventType;
                //console.log(taskId,fileCount,errCode,eventType);
                switch(eventType){
                    case 11:    //begin
                        plugin_callback.OnAsyncSelectFileBegin(taskId);
                        break;
                    case 12:    //end
                        plugin_callback.OnAsyncSelectFileComplete(taskId, fileCount, errCode);
                        break;
                    case 13:    //update
                        plugin_callback.OnFilesInfoUpdate(taskId, fileCount);
                        break;
                }
            };
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.GetAsynBatchSelectFileCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('GetFilesCount:'+this._total);
        },

        //开始取数据
        get_files: function (taskId, select_count) {
            if(this._offset[taskId] === undefined){
                this._offset[taskId] = 0;
            }

            var me = this,
                filestr = '',
                pre_count = 100,
                need_get_count = select_count - me._offset[taskId],
                times = Math.floor(need_get_count/pre_count),
                left = need_get_count % pre_count;
            

            //次数大于等于1
            if(times >= 1){
                for(var i=1; i<=times; i++){
                    
                    //console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], pre_count);
                    var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                        console.log('GetFolderFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;

                    //更新offset
                    me._offset[taskId] += pre_count;
                }
            }

            //生效不足一次的
            if(left) {

                //console.log('GetFolderFilesInfo1:',taskId, me._offset[taskId], left);
                var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                    console.log('GetFolderFilesInfo failed,retry...');
                }
                filestr += tmpstr;

                //更新offset
                me._offset[taskId] += left;
            }

            //console.log('filestr:',filestr.length);

            var __files = filestr.split('\r\n');
            __files.pop();

            if (!__files || !__files.length) { //没有选中文件退出
                return false;
            }
            
            //构造本次任务的数组
            if(me._file_obj[taskId]){
                me._file_obj[taskId] = $.merge(me._file_obj[taskId], __files);
            }
            else{
                me._file_obj[taskId] = __files;
            }
            
        },

        //检查是否获取完成，都是容错
        check_finish: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                return false;
            }
            //console.log(this._total, this._file_obj[taskId].length);
            return (this._total == this._file_obj[taskId].length) ? true : false;
        },

        //获取文件数组
        get_files_arr: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                this.show_error_dialog('分析文件出错，请稍后再试。');
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = this._file_obj[taskId];
            //console.log(files);
            this.re_set();

            return files;
        },

        //显示错误的提示框
        show_error_dialog: function (msg) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
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
        },

        //释放资源
        release: function (taskId) {
            console.log('ReleaseFilesData');
            return this.upload_plugin.ReleaseLocal(taskId);
        },

        //重新设置初始值
        re_set: function () {
            this._taskId = '';
            this._file_arr = [];
            this._offset = {};
            this._total = 0;
        },

        show_select_folder: function (files) {
            return upload_file_check.check_start_upload(files, this.upload_plugin, G4);
        }

    };

    return upload_files;

});/**
 * 选择文件（webkit）
 * @author bondli
 * @date 13-10-17
 */
define.pack("./upload_files.upload_files_webkit",["$","lib","common","./tmpl","./upload_folder.loading","./upload_file_validata.upload_file_check"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),

        console = lib.get('./console').namespace('upload2'),

        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./upload_folder.loading'),
        widgets = common.get('./ui.widgets'),

        upload_file_check = require('./upload_file_validata.upload_file_check'),

        G2 = Math.pow(2, 30) * 2,

        is_over_total_num = false,
        is_canceled = false,
        is_finished = false,

        undefined;

    /**
     * 控件告知该次文件读取开始
     * @param taskId  
     */
    window.OnEventSelectFilesBegin = function (taskId) {
        console.debug('WYCLIENT_OnAsyncSelectFilesBegin', taskId);
        is_over_total_num = false;
        is_canceled = false;
        //显示loading
        setTimeout(function(){
            if(is_finished === false && is_over_total_num === false){
                loading.show('正在获取文件', function(){
                    is_canceled = true;
                    loading.hide();
                    upload_files.release(taskId);
                    upload_files.re_set();
                });
            }
        },300);
    };

    /**
     * 控件更新所选的数据
     * @param taskId  
     * @param currentFileCount 已获取的文件数
     */
    window.OnEventSelectFilesUpdate = function (taskId, currentFileCount) {
        console.debug('WYCLIENT_OnFilesInfoUpdate', taskId, currentFileCount);
        if(is_canceled === true || is_over_total_num === true) return 1;
        //当文件数大于我们的限制（3000）的时候，直接抛错
        if(currentFileCount > 3000){
            is_over_total_num = true;
            loading.hide();
            upload_files.release(taskId);
            upload_files.show_error_dialog('一次性上传文件总数不能超过3000个');
            return 1;
        }
        //setTimeout(function(){  //延时都是容错
            upload_files.get_files(taskId, currentFileCount);
        //},20);
        return 1;
    };

    /**
     * 控件告知该次文件读取完毕
     * @param taskId
     * @param totalFileCount 总文件数
     * @param errCode 错误码
     */
    window.OnEventSelectFilesEnd = function (taskId, totalFileCount, errCode) {
        is_finished = true;
        console.debug('WYCLIENT_OnAsyncSelectFilesComplete', taskId, totalFileCount, errCode);
        if(is_canceled === true || is_over_total_num === true) return 1;

        if(errCode === 42260002){ //点击了取消
            //隐藏显示的loading
            loading.hide();
            //调用控件的接口，读取完成后释放内存
            upload_files.release(taskId);
        }
        else {
            upload_files.set_total(taskId, totalFileCount);
            if(upload_files.check_finish(taskId)){
                //隐藏显示的loading
                loading.hide();
                var files = upload_files.get_files_arr(taskId);
                if(files){
                    //调用控件的接口，读取完成后释放内存
                    upload_files.release(taskId);
                    upload_files.show_select_folder(files);
                }
            }
            else {
                var times = 1;
                var t = setInterval(function(){  //都是容错
                    times ++;
                    if(upload_files.check_finish(taskId)){
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        var files = upload_files.get_files_arr(taskId);
                        if(files){
                            //调用控件的接口，读取完成后释放内存
                            upload_files.release(taskId);
                            upload_files.show_select_folder(files);
                        }
                    }
                    if(times>=100){  //长时间没有正确提示错误
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        upload_files.release(taskId);
                        upload_files.re_set();
                        upload_files.show_error_dialog('读取文件出错，请稍后再试。');
                        return false;
                    }
                },50);
            }
            
        }
        return 1;
    };
    

    var upload_files = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : {},

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
            this.upload_plugin.OnEventSelectFilesBegin = window.OnEventSelectFilesBegin;
            this.upload_plugin.OnEventSelectFilesUpdate = window.OnEventSelectFilesUpdate;
            this.upload_plugin.OnEventSelectFilesEnd = window.OnEventSelectFilesEnd;
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.ObtainSelectFilesCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('ObtainSelectFilesCount:'+this._total);
        },

        //开始取数据
        get_files: function (taskId, select_count) {
            if(this._offset[taskId] === undefined){
                this._offset[taskId] = 0;
            }

            var me = this,
                filestr = '',
                pre_count = 100,
                need_get_count = select_count - me._offset[taskId],
                times = Math.floor(need_get_count/pre_count),
                left = need_get_count % pre_count;
            

            //次数大于等于1
            if(times >= 1){
                for(var i=1; i<=times; i++){
                    
                    //console.log('ObtainSelectFilesInfo:',taskId, me._offset[taskId], pre_count);
                    var tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], pre_count);
                        console.log('ObtainSelectFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;

                    //更新offset
                    me._offset[taskId] += pre_count;
                }
            }

            //生效不足一次的
            if(left) {

                //console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], left);
                var tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], left);
                    console.log('ObtainSelectFilesInfo failed,retry...');
                }
                filestr += tmpstr;

                //更新offset
                me._offset[taskId] += left;
            }

            //console.log('filestr:',filestr.length);

            var __files = filestr.split('\r\n');
            __files.pop();

            if (!__files || !__files.length) { //没有选中文件退出
                return false;
            }
            
            //构造本次任务的数组
            if(me._file_obj[taskId]){
                me._file_obj[taskId] = $.merge(me._file_obj[taskId], __files);
            }
            else{
                me._file_obj[taskId] = __files;
            }
            
        },

        //检查是否获取完成，都是容错
        check_finish: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                return false;
            }
            //console.log(this._total, this._file_obj[taskId].length);
            return (this._total == this._file_obj[taskId].length) ? true : false;
        },

        //获取文件数组
        get_files_arr: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                this.show_error_dialog('分析文件出错，请稍后再试。');
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = this._file_obj[taskId];
            //console.log(files);
            this.re_set();

            return files;
        },

        //显示错误的提示框
        show_error_dialog: function (msg) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
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
        },

        //释放资源
        release: function (taskId) {
            console.log('ReleaseSelectFilesInfo');
            return this.upload_plugin.ReleaseSelectFilesInfo(taskId);
        },

        //重新设置初始值
        re_set: function () {
            this._taskId = '';
            this._file_arr = [];
            this._offset = {};
            this._total = 0;
        },

        //弹出上传位置选择框
        show_select_folder: function (files) {
            return upload_file_check.check_start_upload(files, this.upload_plugin, G2);
        }

    };

    return upload_files;

});/**
 * 拖拽上传创建目录工具类
 */
define.pack("./upload_folder.Create_dirs_class",["lib","common","$","./upload_folder.create_dirs"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        create_dirs = require('./upload_folder.create_dirs'),

        undefined;

    var Create_dirs_class = function(cfg) {
        $.extend(this, cfg);
    };

    Create_dirs_class.prototype = create_dirs;

    return Create_dirs_class;

});/**
 * 将获取到的文件转化成数结构
 * @author bondli
 * @date 13-12-10
 */
define.pack("./upload_folder.TreeNode",["$","lib"],function (require, exports, module) {

    var $ = require('$'),

        lib = require('lib'),
        console = lib.get('./console'),

        undefined;

    function TreeNode(name) {
        this.name = name;
        this.ppdir = null;
        this.pdir = null;
        this.dir = null;
        this.dirNodes = new Array();
        this.fileNodes = new Array();
        this.parentNode = null;
    };

    TreeNode.prototype.get_dir_keys = function() {
        var pdir = this.parentNode.dir,
            ppdir = this.ppdir ? this.ppdir : this.parentNode.pdir;
        return {"ppdir": ppdir, "pdir": pdir};
    };

    TreeNode.prototype.set_ppdir = function(ppdir) {
        //console.log('set_ppdir',ppdir);
        this.ppdir = ppdir;
    };

    TreeNode.prototype.set_pdir = function(pdir) {
        //console.log('set_pdir',pdir);
        this.pdir = pdir;
    };

    TreeNode.prototype.set_dir = function(dir) {
        //console.log('set_dir',dir);
        this.dir = dir;
    };

    TreeNode.prototype.addFile = function(file) {
        file.parentNode = this;
        this.fileNodes[this.fileNodes.length] = file;
    };

    TreeNode.prototype.addDir = function(dir) {
        dir.parentNode = this;
        this.dirNodes[this.dirNodes.length] = dir;
    };
    TreeNode.prototype.getSubdirByName = function(dirName) {
        var parentNode = this,
            subDir,
            has_found = false;

        if(parentNode.dirNodes.length) {
            for(var i = 0, len = parentNode.dirNodes.length; i < len; i++) {
                if(parentNode.dirNodes[i].name == dirName) {
                    subDir = parentNode.dirNodes[i];
                    has_found = true;
                    break;
                }
            }
        }

        if(has_found) {
            return subDir;
        }
    };

    return TreeNode;

});/**
 * 创建目录
 * 1、创建根目录ok后，添加一个上传任务，开始上传
 * 2、创建一个子目录ok了，就把改目录下的文件添加到上传的任务中
 * 3、创建一个子目录失败，就放弃上传
 *
 * @author bondli
 * @date 13-12-09
 */
define.pack("./upload_folder.create_dirs",["lib","$","common","./upload_folder.upload_folder_h5"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        common = require('common'),

        console = lib.get('./console'),
		security = lib.get('./security'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        logger = common.get('./util.logger'),
        upload_folder_h5 = require('./upload_folder.upload_folder_h5'),

        undefined;

    var create_dirs = {
    	folder_id : '',
    	folder_size : 0,
    	file_length : 0,
    	upload_plugin : '', 
    	chosed_dir_attr : '',
        chosed_dir_name : '',

    	init: function (files, upload_plugin, chosed_dir_attr) {
    		var me = this;
            me.upload_plugin = upload_plugin;
    		me.folder_size = files.file_total_size;
    		me.file_length = files.file_total_num;
    		me.chosed_dir_attr = chosed_dir_attr;
            me.chosed_dir_name = files.dir_name;
            me.is_from_h5 = !!files.is_from_h5;

            var treeNode = files.file_tree_node; //获取目录文件关系数据节点
            //启动循环
            function run(file_node){
                var dir_name = file_node.name,
                    dir_files = file_node.fileNodes;

                if(file_node === treeNode){
                    var ppdir = me.chosed_dir_attr.ppdir,
                        pdir = me.chosed_dir_attr.pdir;
                   // console.debug('root:',ppdir,pdir);
                    me.create_root_dir(dir_name, ppdir, pdir)
                        .done(function (rsp_body) {
                            var main_dir = rsp_body;
                         //   console.debug('create root dir_name:'+main_dir.dir_name);
                            var dir_key = main_dir.dir_key;
                            dir_name = main_dir.dir_name || dir_name;
                            //设置节点的ppdir和pdir和自身的key
                            file_node.set_ppdir(ppdir);
                            file_node.set_pdir(pdir);
                            file_node.set_dir(dir_key);

                            //添加到上传，这里如果本目录下为空也要添加上传
                            me.add_upload(dir_files, pdir, dir_key, dir_name, false);
                            //下一个子节点的继续
                            if(file_node.dirNodes) {
                                create_dir_pool = create_dir_pool.concat(file_node.dirNodes);
                            }
                            run_pool();
                            /*$.each(file_node.dirNodes, function(i, dirNode){
                                run(dirNode);
                            });*/
                        }).fail(function (msg, ret) {
                       //     console.debug('create root ret:'+ret);
                            logger.report('weiyun_create_dir', {
                                msg: msg,
                                ret:ret,
                                is_from_h5:me.is_from_h5
                            });
                            /*if(me.is_from_h5) {
                                //mini_tip.error(msg || '创建目录失败，请重试');
                                me._add_folder_failed(ret, dir_name);
                            } else {
                                me._add_folder_failed(ret, dir_name);
                            }*/
                            var kids = [];

                            get_all_kids(file_node, kids);

                            me.add_upload(kids, pdir, '_', dir_name, false, ret);
                            run_pool();
                        });
                }
                else{
                    var dir_keys = file_node.get_dir_keys(),
                        ppdir = dir_keys.ppdir,
                        pdir = dir_keys.pdir;
                  //  console.debug('sub:',ppdir,pdir);
                    var dir_path_arr = dir_name.split('\\');
                    dir_name = dir_path_arr[dir_path_arr.length-1];
                    me.create_sub_dir(dir_name, ppdir, pdir)
                        .done(function (rsp_body) {
                            var dir_key = rsp_body.dir_key;
                            //console.debug('create sub_dir ret:'+dir_key);
                            //设置节点的ppdir和pdir和自身的key
                            file_node.set_ppdir(ppdir);
                            file_node.set_pdir(pdir);
                            file_node.set_dir(dir_key);
                            //添加到上传
                            if(dir_files.length){
                                me.add_upload(dir_files, pdir, dir_key, dir_name, true);
                            }

                            //下一个子节点的继续
                            if(file_node.dirNodes) {
                                create_dir_pool = create_dir_pool.concat(file_node.dirNodes);
                            }

                            run_pool();
                           /* $.each(file_node.dirNodes, function(i, dirNode){
                                run(dirNode);
                            });*/
                        }).fail(function (msg, ret) {
                           // console.debug('create sub_dir ret:'+ret);
                            logger.report('weiyun_create_dir', {
                                msg: msg,
                                ret:ret,
                                is_from_h5:me.is_from_h5
                            });
                            /*if(me.is_from_h5) {
                                //mini_tip.error(msg || '创建子目录失败，请重试');
                                me._add_sub_folder_failed(ret, dir_path_arr.join('\\'));
                            } else {
                                me._add_sub_folder_failed(ret, dir_path_arr.join('\\'));
                            }*/

                            var kids = [];

                            get_all_kids(file_node, kids);

                            me.add_upload(kids, pdir, '_', dir_name, true, ret);
                            run_pool();
                        });
                }                
            };

            function get_all_kids(parent_node, list) {
                var sub_dirs = parent_node.dirNodes;
                var sub_files = parent_node.fileNodes;
                var fn = arguments.callee;
                if(sub_files) {
                    $.each(sub_files, function(i, file) {
                        list.push(file);
                    });
                }

                if(sub_dirs) {
                    $.each(sub_dirs, function(i, dir) {
                        fn(dir, list);
                    });
                }

            }

            var create_dir_pool = [];
            var has_run_max = false; //是否达到了最大并发请求
            function run_pool() {
                var dirNodes;
                if(!has_run_max) {
                    dirNodes = create_dir_pool.slice(0, 4);
                    create_dir_pool = create_dir_pool.slice(dirNodes.length);
                    if(dirNodes.length === 4) {
                        has_run_max = true;
                    }
                } else {
                    dirNodes = [create_dir_pool.shift()];
                }

                $.each(dirNodes, function(i, dirNode) {
                    dirNode && run(dirNode);
                });

            }

            run(treeNode);

    	},

    	//创建根目录，可能有同名目录，用这个cgi支持重名创建
    	create_root_dir: function (dir_name, ppdir_key, pdir_key) {
    		var me = this,
                def = $.Deferred();
			request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskDirCreate',
                pb_v2 : true,
                re_try: 0,
                body: {
                    ppdir_key: ppdir_key,
                    pdir_key: pdir_key,
                    "dir_name": dir_name,
                    file_exist_option: 1
                }
            })
                .ok(function (rsp_msg, rsp_body) {
                	/*
                    var dir_key = rsp_body.sub_dir[0].dir_key,
                		dir_name = rsp_body.sub_dir[0].new_dir_name || dir_name;
                    */
                    def.resolve(rsp_body);
                })
                .fail(function (msg, ret) {
                    //me.add_folder_failed(ret, dir_name);
                    def.reject(msg, ret);
                });

            return def;
    	},

    	//创建子目录
    	create_sub_dir: function (dir_name, ppdir_key, pdir_key){
			var def = $.Deferred();
			request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskDirCreate',
                pb_v2 : true,
                re_try: 0,
                body: {
                    ppdir_key: ppdir_key,
                    pdir_key: pdir_key,
                    dir_name: dir_name
                }
            })
                .ok(function (rsp_msg, rsp_body) {
                	//var dir_key = rsp_body.dir_key;
                    def.resolve(rsp_body);
                })
                .fail(function (msg, ret) {
                    //me.trigger('create_dir_fail', msg, ret);
                    def.reject(msg, ret);
                });

            return def;
    	},

        add_upload: function (dir_files, pdir_key, dir_key, dir_name, is_sub, pdir_create_ret) {
            var me = this,
                files = [];
                //console.log('up file:',dir_files);
            $.each(dir_files, function(i, file){
                files.push({
                    'file': file.h5file || file, //h5拖动上传的文件句柄采用h5file标识
                    'ppdir': pdir_key,
                    'pdir': dir_key,
                    'ppdir_name': 0,
                    'pdir_name': 0,
                    'dir_paths': 0,
                    'dir_id_paths': 0,
                    'pdir_create_ret': pdir_create_ret
                });
            });

            if(is_sub){
                me._add_sub_upload(files);
            }
            else {
                me.folder_id = me._add_folder_upload(files, dir_key, dir_name);
            }
        },

    	//第一次添加文件上传
    	_add_folder_upload: function (files, dir_key, dir_name) {
    		var me = this,
    			ext_param = me.file_length == 0 ? {"code":2,"text":""} : {"code":1,"text":""},
    			upload_attrs = {
		            'file_id': dir_key,
		            'dir_name': dir_name, 
		            'local_path': me.chosed_dir_attr.dir_path,
		            'ppdir': me.chosed_dir_attr.ppdir,
		            'pdir': me.chosed_dir_attr.pdir,
		            'ppdir_name': me.chosed_dir_attr.ppdir_name,
		            'pdir_name': me.chosed_dir_attr.pdir_name,
		            'dir_paths': me.chosed_dir_attr.dir_paths,
		            'dir_id_paths': me.chosed_dir_attr.dir_id_paths
		        };
            if(me.is_from_h5) {
                return upload_folder_h5.add_upload(me.upload_plugin,
                    files,
                    upload_attrs,
                    ext_param,
                    me.folder_size,
                    me.file_length
                );
            }
            //返回的是folder_id
			return upload_event.trigger('add_folder_upload', 
				me.upload_plugin, 
				files, 
				upload_attrs, 
				ext_param, 
				me.folder_size, 
				me.file_length
			);       
    	},

    	//添加子目录文件上传
    	_add_sub_upload: function (files) {
    		var me = this;

            if(me.folder_id == ''){
                setTimeout(function(){
                    if(me.is_from_h5) {
                        upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id, files);
                    } else {
                        upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, files);
                    }
                },300);
            }
            else{
                if(me.is_from_h5) {
                    upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id, files);
                } else {
                    upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, files);
                }
            }
    	},

        //创建根目录出错了
        _add_folder_failed: function (ret, dir_name) {

            var me = this,
            ext_param = {"code":3,"text":ret},
            upload_attrs = {
                'dir_name':dir_name,
                'local_path':me.chosed_dir_attr.dir_path,
                'ppdir':me.chosed_dir_attr.ppdir,
                'pdir':me.chosed_dir_attr.pdir,
                'ppdir_name':me.chosed_dir_attr.ppdir_name,
                'pdir_name':me.chosed_dir_attr.pdir_name,
                'dir_paths':me.chosed_dir_attr.dir_paths,
                'dir_id_paths':me.chosed_dir_attr.dir_id_paths
            };
            if(me.is_from_h5) {
                upload_folder_h5.add_upload(me.upload_plugin,[],upload_attrs,ext_param,me.folder_size,me.file_length);
            } else {
                //console.log(upload_attrs,ext_param);
                upload_event.trigger('add_folder_upload',
                    me.upload_plugin,
                    [],
                    upload_attrs,
                    ext_param,
                    me.folder_size,
                    me.file_length
                );
            }
        },

        //创建子目录出错了
        _add_sub_folder_failed: function (ret, dir_name) {
            var me = this,
                dir_full_path = me.chosed_dir_attr.dir_path + dir_name;
            if(me.is_from_h5) {
                upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id,null, 'create_dir_error');
            }else if(me.folder_id == ''){
                setTimeout(function(){
                    upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, dir_full_path, 'create_dir_error');
                },300);
            }
            else{
                upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, dir_full_path, 'create_dir_error');
            }
        }

    };

    return create_dirs;
});/**
 * 上传文件夹时获取所选的文件信息
 * @author bondli
 * @date 13-7-29
 */
define.pack("./upload_folder.get_up_folder_files",["lib","common","$","./upload_folder.TreeNode"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        constants = common.get('./constants'),
	    query_user = common.get('./query_user'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        TreeNode = require('./upload_folder.TreeNode'),
        JSON = lib.get('./json'),

        G4 = Math.pow(2,30) * 4,

        undefined;

    function findParent(parentNode, curr, root){
        if(curr === root){
            return root;
        }
        if(curr.name == null){
            return null;
        }
        if(curr.name !== parentNode){
            return findParent(parentNode, curr.parentNode, root);
        }else{
            return curr;
        }
    };


    var get_up_folder_files = function ( files_arr ) {
        var dir_name = '',          //所选目录名称
            dir_path = '',          //所选目录路径（包含目录名称）
            file_total_size = 0,          //所选文件总大小
            file_total_num = 0,
            prefix_dir_num = 0,     //所选的目录的前缀目录层数 
            dir_level_num = 0,      //单层目录下最大值   
            dir_total_num = 0,      //总目录数
            select_dir_level = 1,   //所选目录的层级
            is_exist_4g = false;    //是否存在4G大文件

        var _file_arr_length = files_arr.length,
            _path_min_arr = null
            _level_num_arr = [];

        var _is_exist_folder_be_ignore = false; //是否存在最后一级目录被忽略

        var root = null,
            currNode = null;

        $.each(files_arr, function(i, fileinfo){ 
            var item = fileinfo.split(' '); //这里纯粹的用空格分割会带来问题，文件名中可以也有空格
            var isdir = item[0] == 'D' ? true : false,
                filepath = '',
                file = '',
                filesize = parseFloat(item[item.length-1]);
            item.pop();
            item.shift(); //移除首尾元素就是文件路径了
            file = item.join(' ');
            //兼容新版本的appbox，移除目录最后面的斜杠
            if(file.charAt(file.length - 1) === '\\'){
                file = file.substr(0,file.length-1);
            }
            filepath = file.split('\\');

            if(i == 0) { //第一个记录
                _path_min_arr = filepath;
                prefix_dir_num = _path_min_arr.length - 1;
                dir_name = _path_min_arr[prefix_dir_num];
                dir_path = file;

                //创建根节点
                root = new TreeNode(dir_name);
                currNode = root;
            }

            //统计每层的文件+目录总数
            if(_level_num_arr[filepath.length]){
                _level_num_arr[filepath.length] ++;
            }
            else {
                _level_num_arr[filepath.length] = 1;
            }

            //文件
            if(isdir == false) {
                if (filesize >= G4) {
                    is_exist_4g = true;
                }

                file_total_num ++;

                var temp = file.split('\\');
                temp.pop();
                var t = prefix_dir_num;
                do {
                    temp.shift();
                    t--;
                }
                while(t>0);

                var parentNode = temp.join('\\');

                if(currNode.name != parentNode){
                    currNode = findParent(parentNode, currNode, root);
                }
                currNode.addFile(file);
            }
            //目录
            else {
                if(filepath.length > select_dir_level) {
                    select_dir_level = filepath.length;
                }
                //剔除最后一层的目录，这个时候只取到目录，目录下文件没有取到
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                if( filepath.length-1 == prefix_dir_num + num ){
                    _is_exist_folder_be_ignore = true;
                }
                else{
                    dir_total_num ++; //统计目录总数

                    if(i > 0) { //第一个前面已经执行了

                        var temp = file.split('\\'),
                            nodeName = file.split('\\');
                        temp.pop();
                        var t = prefix_dir_num;
                        do {
                            temp.shift();
                            nodeName.shift();
                            t--;
                        }
                        while(t>0);
                        var parentNode = temp.join('\\'),
                            node_Name = nodeName.join('\\'),
                            dirNode = new TreeNode(node_Name);

                        if(currNode.name != parentNode){
                            currNode = findParent(parentNode, currNode, root);
                        }
                        currNode.addDir(dirNode);
                        currNode = dirNode;

                    }

                }
                
            }
            file_total_size += filesize; //统计文件大小

        });

        //取每层的最大值
        _level_num_arr = $.map(_level_num_arr, function(i){
            if(i != null) return i;
        });
        dir_level_num = Math.max.apply(null, _level_num_arr);

        //获取出现最大值的目录名称
        //var _index = $.inArray(dir_level_num, _level_num_arr),
           // _max_file_num_dir_name = _path_min_arr[ prefix_dir_num + _index ];

        return {
            file_total_size : file_total_size,
            dir_name : dir_name,
            file_tree_node : root,
            file_total_num : file_total_num,
            dir_total_num : dir_total_num,
            dir_level_num : dir_level_num,
            prefix_dir_num : prefix_dir_num,
            //max_file_num_dir_name : _max_file_num_dir_name,
            dir_path : dir_path,
            is_exist_folder_be_ignore : _is_exist_folder_be_ignore,
            select_dir_level : select_dir_level - prefix_dir_num,
            is_exist_4g : is_exist_4g
        };
    };

    return get_up_folder_files;

});/**
 * 展示loading
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author bondli
 * @date 13-10-08
 */
define.pack("./upload_folder.loading",["lib","$","common","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        template = lib.get('./template'),
        common = require('common'),

        widgets = common.get('./ui.widgets'),

        tmpl = require('./tmpl'),
        ui_center = common.get('./ui.center'),

        undefined;


    var loading = {
        $el: null,

        render_if: function () {
            if (!this.$el) {
                this.$el = $(tmpl.loading_mark()).hide().appendTo(document.body);
            }
        },
        /**
         * 显示进度
         * @param {String} msg 消息，支持HTML代码
         * @param {Function} cancel_fn 取消时调用的方法
         */
        show: function (msg, cancel_fn) {

            var me = this;

            me.render_if();

            var $el = me.$el;

            if (!$el.parent()[0]) {
                $el.appendTo(document.body).hide();
            }

            // 文字
            $el.find('._n').html(msg);

            //取消事件
            $el.find('._cancel').on('click', function(){
                cancel_fn();
            }).toggle(cancel_fn ? true : false);

            // 显示进度框
            if ($el.is(':hidden')) {

                $el.fadeIn('fast');

                // IE6 居中
                ui_center.listen($el);

                // 显示遮罩
                this.mask(true, true);
            }

        },

        hide: function (mask) {
            if (this.$el) {
                this.$el.stop(true, true).fadeOut('fast', function () {
                    var $el = $(this);
                    ui_center.stop_listen($el);
                    $el.detach();
                });
            }
            // 隐藏遮罩
            if (mask !== false) {
                this.mask(false);
            }
        },

        mask: function (visible, white_mask) {
            white_mask = white_mask !== false;

            widgets.mask.toggle(visible, 'ui.progress', this.$el, white_mask);
        }
    };

    return loading;
});/**
 * 从appbox拖拽发送qq文件
 * @author bondli
 * @date 13-10-17
 */
define.pack("./upload_folder.upload_folder_appbox",["$","lib","common","./upload_folder.loading","./upload_folder.get_up_folder_files","./select_folder.select_folder","./upload_file_validata.upload_folder_validata","./tmpl"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		text = lib.get('./text'),
		console = lib.get('./console').namespace('upload2'),
		logger = common.get('./util.logger'),
		widgets = common.get('./ui.widgets'),
		user_log = common.get('./user_log'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),

		loading = require('./upload_folder.loading'),
		get_up_folder_files = require('./upload_folder.get_up_folder_files'),
		select_folder = require('./select_folder.select_folder'),
		FolderValidata = require('./upload_file_validata.upload_folder_validata'),
		tmpl = require('./tmpl'),

		is_over_total_num = false,
		is_canceled = false,
		undefined;

	/**
	 * 控件告知该次文件读取开始
	 * @param taskId
	 */
	window.WYCLIENT_OnAsyncSelectFolderBegin = function(taskId) {
		console.debug('WYCLIENT_OnAsyncSelectFolderBegin', taskId);
		is_over_total_num = false;
		is_canceled = false;
		//显示loading
		loading.show('正在获取文件夹信息', function() {
			is_canceled = true;
			loading.hide();
			upload_folder.release(taskId);
			upload_folder.re_set();
		});
	};

	/**
	 * 控件更新所选的数据
	 * @param taskId
	 * @param currentFileCount 已获取的文件数
	 */
	window.WYCLIENT_OnFolderFilesInfoUpdate = function(taskId, currentFileCount) {
		console.debug('WYCLIENT_OnFolderFilesInfoUpdate', taskId, currentFileCount);
		if(is_canceled === true || is_over_total_num === true) return 1;
		//当文件数大于我们的限制的时候，直接抛错
		if(currentFileCount > 2 * constants.UPLOAD_FOLDER_MAX_FILE_NUM) {
			is_over_total_num = true;
			loading.hide();
			upload_folder.release(taskId);
			upload_folder.show_error_dialog('所选文件夹下文件总数超过' + constants.UPLOAD_FOLDER_MAX_FILE_NUM + '个，请管理后上传。');
			return 1;
		}
		//setTimeout(function(){  //延时都是容错
		upload_folder.get_files(taskId, currentFileCount);
		//},20);
		return 1;
	};

	/**
	 * 控件告知该次文件读取完毕
	 * @param taskId
	 * @param totalFileCount 总文件数
	 * @param errCode 错误码
	 */
	window.WYCLIENT_OnAsyncSelectFolderComplete = function(taskId, totalFileCount, errCode) {
		console.debug('WYCLIENT_OnAsyncSelectFolderComplete', taskId, totalFileCount, errCode);
		if(is_canceled === true || is_over_total_num === true) return 1;

		//上报日志
		var console_log = [];
		if(errCode * 1) {
			console_log.push('plugin error --------> errCode: ' + errCode);
			taskId && console_log.push('plugin error --------> taskId: ' + taskId);
			totalFileCount && console_log.push('plugin error --------> totalFileCount: ' + totalFileCount);
			logger.write(console_log, 'upload_plugin_error', errCode);
		}

		if(errCode === '42260001') { //选择了整个磁盘
			//隐藏显示的loading
			loading.hide();
			//调用控件的接口，读取完成后释放内存
			upload_folder.release(taskId);
			upload_folder.show_error_dialog('暂不支持上传整个盘符，请重新选择。');
		}
		else if(errCode === '42260002') { //点击了取消
			//隐藏显示的loading
			loading.hide();
			//调用控件的接口，读取完成后释放内存
			upload_folder.release(taskId);
		}
		else {
			upload_folder.set_total(taskId, totalFileCount);
			if(upload_folder.check_finish(taskId)) {
				//隐藏显示的loading
				loading.hide();
				var files = upload_folder.get_files_arr(taskId);
				if(files) {
					//调用控件的接口，读取完成后释放内存
					upload_folder.release(taskId);
					upload_folder.show_select_folder(files);
				}
			}
			else {
				var times = 1;
				var t = setInterval(function() {  //都是容错
					times++;
					if(upload_folder.check_finish(taskId)) {
						clearInterval(t);
						//隐藏显示的loading
						loading.hide();
						var files = upload_folder.get_files_arr(taskId);
						if(files) {
							//调用控件的接口，读取完成后释放内存
							upload_folder.release(taskId);
							upload_folder.show_select_folder(files);
						}
					}
					if(times >= 50) {  //长时间没有正确提示错误
						clearInterval(t);
						//隐藏显示的loading
						loading.hide();
						upload_folder.release(taskId);
						upload_folder.re_set();
						upload_folder.show_error_dialog('分析文件夹超时，请不要上传过大文件夹。');
						return false;
					}
				}, 50);
			}

		}
		return 1;
	};


	var upload_folder = {
		_file_obj: {},
		_taskId: '',
		upload_plugin: '',
		_offset: {},
		_total: 0,

		init: function(upload_plugin) {
			this.upload_plugin = upload_plugin;
		},

		//设置这次的文件总数
		set_total: function(taskId, totalFileCount) {
			this._taskId = taskId;
			var total = this.upload_plugin.GetFolderFilesCount(taskId);
			this._total = total * 1;
			if(this._total === 0) {
				this._total = totalFileCount * 1;  //都是容错
			}
			console.log('GetFolderFilesCount:' + this._total);
		},

		//开始取数据
		get_files: function(taskId, select_count) {
			if(this._offset[taskId] === undefined) {
				this._offset[taskId] = 0;
			}

			var me = this,
				filestr = '',
				pre_count = 100,
				need_get_count = select_count - me._offset[taskId],
				left = need_get_count % pre_count,
				times = Math.floor(need_get_count / pre_count),
				tmpstr;


			//次数大于等于1
			if(times >= 1) {
				for(var i = 1; i <= times; i++) {
					//console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], pre_count);
					tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset[taskId], pre_count);
					if(tmpstr === null || tmpstr === 'null' || tmpstr === '') { //重试一次
						tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset[taskId], pre_count);
						console.log('GetFolderFilesInfo failed,retry...');
					}
					filestr += tmpstr;

					//更新offset
					me._offset[taskId] += pre_count;
				}
			}

			//生效不足一次的
			if(left) {
				//console.log('GetFolderFilesInfo1:',taskId, me._offset[taskId], left);
				tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset[taskId], left);
				if(tmpstr === null || tmpstr === 'null' || tmpstr === '') { //重试一次
					tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset[taskId], left);
					console.log('GetFolderFilesInfo failed,retry...');
				}
				filestr += tmpstr;

				//更新offset
				me._offset[taskId] += left;
			}

			//console.log('filestr:',filestr.length);

			var __files = filestr.split('\r\n');
			__files.pop();
			if(!__files || !__files.length) { //没有选中文件退出
				return false;
			}

			//构造本次任务的数组
			if(me._file_obj[taskId]) {
				me._file_obj[taskId] = $.merge(me._file_obj[taskId], __files);
			} else {
				me._file_obj[taskId] = __files;
			}

		},

		//检查是否获取完成，都是容错
		check_finish: function(taskId) {
			if(this._file_obj[taskId] === undefined) {
				return false;
			}
			console.log(this._total, this._file_obj[taskId].length);
			return (this._total == this._file_obj[taskId].length) ? true : false;
		},

		//获取文件数组
		get_files_arr: function(taskId) {
			if(this._file_obj[taskId] === undefined) {
				this.show_error_dialog('分析文件夹出错，找不到指定的文件。');
				return false;
			}
			var files = get_up_folder_files(this._file_obj[taskId]);
			this.re_set();

			//判断是是否所选的文件夹超过10层
			var num = constants.UPLOAD_FOLDER_LEVEL;
			var cached_user = query_user.get_cached_user();
			if(files.is_exist_folder_be_ignore == true) {
				if(cached_user && cached_user.get_dir_layer_max_number) {
					num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
				}
				this.show_error_dialog('所选的文件夹目录超过' + num + '层，请整理后再传。');
				return false;
			}

			var folderValidata = FolderValidata.create();
			folderValidata.add_validata('max_dir_size', files.dir_total_num, cached_user.get_dir_count());  //目录数太多验证
			folderValidata.add_validata('max_level_size', files.dir_level_num, cached_user.get_max_indexs_per_dir());  //单层目录下太多验证
			folderValidata.add_validata('max_files_size', files.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
			var ret = folderValidata.run();
			if(ret) {
				this.show_error_dialog(ret[0]);
				return false;
			}
			return files;
		},

		//显示错误的提示框
		show_error_dialog: function(msg) {
			var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
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
		},

		//释放资源
		release: function(taskId) {
			console.log('ReleaseFolderFilesData');
			return this.upload_plugin.ReleaseFolderFilesData(taskId);
		},

		//重新设置初始值
		re_set: function() {
			this._taskId = '';
			this._file_arr = [];
			this._offset = {};
			this._total = 0;
		},

		//弹出上传位置选择框
		show_select_folder: function(files) {
			return select_folder.show_by_upfolder(files, this.upload_plugin);
		}

	};

	return upload_folder;

});/**
 * 上传文件夹 by trump
 */
define.pack("./upload_folder.upload_folder_h5",["$","lib","common","./msg","./view","disk","./Upload_class","./upload_route","./tool.bar_info","./tool.upload_static","./tool.upload_cache","./upload_html5_pro_class","./Upload_html5_class"],function(require, exports, module) {

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
});/**
 * 拖拽上传文件夹模块
 * @author hibincheng
 * @date 2015-01-16
 */
define.pack("./upload_folder.upload_folder_h5_start",["$","lib","common","./upload_folder.loading","./upload_folder.TreeNode","disk","./upload_route","./select_folder.select_folder","./upload_file_validata.upload_folder_validata","./upload_folder.Create_dirs_class","./tmpl","./upload_html5_pro","./upload_html5"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		urls = common.get('./urls'),
		Module = common.get('./module'),
		widgets = common.get('./ui.widgets'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		plugin_detect = common.get('./util.plugin_detect'),

		loading = require('./upload_folder.loading'),
		TreeNode = require('./upload_folder.TreeNode'),
		file_list = require('disk').get('./file_list.file_list'),
		upload_route = require('./upload_route'),
		select_folder = require('./select_folder.select_folder'),
		FolderValidata = require('./upload_file_validata.upload_folder_validata'),
		Create_dirs_class = require('./upload_folder.Create_dirs_class'),
		tmpl = require('./tmpl'),

		undefined;

	var query = urls.parse_params(),
		cur_uin = query_user.get_uin_num(),
		user = query_user.get_cached_user() || {},
		isvip = user.is_weiyun_vip && user.is_weiyun_vip();

	function walk_file_system(parent_node, directory, callback, error) {
		if(!callback.pending) {
			callback.pending = 0;
		}

		if(!callback.files) {
			callback.files = [];
			callback.root_node = parent_node;
		}

		if(!callback.dir_total_num) { //上传的目录数
			callback.dir_total_num = 0;
		}

		if(!callback.dir_level_num) { //单目录的文件数
			callback.dir_level_num = 0;
		}

		if(!callback.file_total_num) { //总文件数
			callback.file_total_num = 0;
		}

		if(!callback.file_total_size) { //总文件大小
			callback.file_total_size = 0;
		}

		callback.pending++;

		var reader = directory.createReader(),
			relativePath = directory.fullPath.replace(/^\//, "").replace(/(.+?)\/?$/, "$1/");

		callback.dir_indexs_total_num++;
		var entries = [];
		var readEntries = function() {
			reader.readEntries(function(results) {
				if(results.length) {
					entries = entries.concat(results);
					readEntries();
					return;
				}
				callback.pending--;
				callback.dir_level_num = Math.max(callback.dir_level_num, entries.length);
				entries.sort();
				$.each(entries, function(i, entry) {
					if(entry.isFile) {
						callback.pending++;
						entry.file(function(File) {
							if(!File.name && !File.size || (File.name == '.' || File.name == '..')) {//360浏览器会获取. ..这样的文件
								return;
							}
							File.relativePath = relativePath + File.name;
							var cur_node = new TreeNode(File.name);
							cur_node.h5file = File;
							callback.file_total_size += File.size;
							callback.file_total_num++;
							callback.files.push(cur_node);
							parent_node.addFile(cur_node);
							if(--callback.pending === 0) {
								callback({
									root_node: callback.root_node,
									dir_total_num: callback.dir_total_num,
									dir_level_num: callback.dir_level_num,
									file_total_num: callback.file_total_num,
									file_total_size: callback.file_total_size
								});
								delete callback.root_node;
								delete callback.dir_total_num;
								delete callback.dir_level_num;
								delete callback.file_total_num;
								delete callback.file_total_size;
								delete callback.files;
							}
						}, error);
					} else {
						var cur_node = new TreeNode(entry.name);
						callback.dir_total_num++;
						callback.files.push(cur_node);
						parent_node.addDir(cur_node);
						walk_file_system(cur_node, entry, callback, error);
					}
				});

				if(callback.pending === 0) {
					callback({
						root_node: callback.root_node,
						dir_total_num: callback.dir_total_num,
						dir_level_num: callback.dir_level_num,
						file_total_num: callback.file_total_num,
						file_total_size: callback.file_total_size
					});
					delete callback.root_node;
					delete callback.dir_total_num;
					delete callback.dir_level_num;
					delete callback.file_total_num;
					delete callback.file_total_size;
					delete callback.files;
				}
			}, error);
		};
		readEntries();
	}

	var upload_folder_h5_start = new Module('upload.upload_folder_h5_start', {
		/**
		 * 选择上传文件夹
		 */
		on_select: function() {
			var root_node = new TreeNode('root'),
				me = this;

			//非webkit内核的浏览器，没安装控件时弹提示安装控件
			if(!$.browser.chrome && !plugin_detect.is_newest_version()) {
				upload_event.trigger('install_plugin', '请升级最新微云极速上传控件', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
				return;
			}

			$('<input type="file" webkitdirectory directory style="margin-left:-9999px">').appendTo(document.body).on('change', function(e) {
				var files = e.target.files,
					total_num = files.length,
					dir_deep_num = 0,
					total_size = 0;
				$.each(files, function(i, file) {
					if(!file.name && !file.size || (file.name == '.' || file.name == '..')) { //360浏览器会获取. ..这样的文件
						return;
					}
					var paths = file.webkitRelativePath.split('/');
					paths.pop();
					var parent_node = root_node,
						len = paths.length;

					dir_deep_num = Math.max(dir_deep_num, len);//所选的文件夹目录深度
					for(var i = 0; i < len; i++) {
						var sub_dir = parent_node.getSubdirByName(paths.slice(i, i + 1));
						if(!sub_dir) {
							sub_dir = new TreeNode(paths[i]);
							parent_node.addDir(sub_dir);
						}
						parent_node = sub_dir;
					}
					var file_node = new TreeNode(file.name);
					file.relativePath = file.webkitRelativePath;
					file_node.h5file = file;
					total_size += file.size;
					parent_node.addFile(file_node);
				});

				me.select_upload(root_node, total_num, total_size, dir_deep_num);
				$(e.target).remove();
			}).click();
		},

		select_upload: function(root_node, total_num, total_size, dir_deep_num) {
			var upload_plugin,
				file_tree_node = root_node.dirNodes[0];
			//判断是否所选的文件夹超过10层
			var num = constants.UPLOAD_FOLDER_LEVEL;
			var cached_user = query_user.get_cached_user();
			if(cached_user && cached_user.get_dir_layer_max_number) {
				num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
			}
			if(dir_deep_num > num) {
				this.show_error_dialog('所选的' + file_tree_node.name + '文件夹目录超过' + num + '层，请整理后再传。');
				return false;
			}

			if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
				upload_plugin = require('./upload_html5_pro');
			} else if(window.FileReader && !$.browser.mozilla && !constants.IS_HTTPS) { //https暂不支持纯h5上传
				upload_plugin = require('./upload_html5');
			} else {
				mini_tip.error('HTTPS模式下请安装Flash以支持拖拽上传文件夹');
				return;
			}

			select_folder.show_by_upfolder({
				dir_name: file_tree_node.name,
				file_total_num: total_num,
				file_total_size: total_size,
				file_tree_node: file_tree_node,
				is_from_h5: true
			}, upload_plugin);
		},

		upload: function(dirEntries, has_file) {
			var me = this;
			if(has_file) { //如果有文件则先由文件上传再上传文件夹
				upload_event.once('drag_upload_files_ready', function() {
					me.async_gain_dict_files(dirEntries);
				});
			}
			loading.show('正在分析文件夹');
			this.async_gain_dict_files(dirEntries);
		},

		async_gain_dict_files: function(dirEntries) {
			var root_node = new TreeNode('root');
			walk_file_system(root_node, dirEntries[0].filesystem.root, WY_async_gain_dict_files_succ_callback, WY_async_gain_dict_files_fail_callback);

		},

		start_upload: function(data) {
			var upload_plugin;
			if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
				upload_plugin = require('./upload_html5_pro');
			} else if(window.FileReader && !$.browser.mozilla && !constants.IS_HTTPS) { //https暂不支持纯h5上传
				upload_plugin = require('./upload_html5');
			} else {
				mini_tip.error('HTTPS模式下请安装Flash以支持拖拽上传文件夹');
				return;
			}

			for(var i = 0, len = data.root_node.dirNodes.length; i < len; i++) {
				var dir = data.root_node.dirNodes[i];
				var dir_options = {
					total_num: 0,
					total_size: 0,
					dir_deep_num: 0
				};
				this.recursive_dir(dir, dir_options);

				//判断是否所选的文件夹超过10层
				var num = constants.UPLOAD_FOLDER_LEVEL;
				var cached_user = query_user.get_cached_user();
				if(cached_user && cached_user.get_dir_layer_max_number) {
					num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
				}
				if(dir_options.dir_deep_num > num) {
					upload_folder_h5_start.show_error_dialog('所选的' + dir.name + '文件夹目录超过' + num + '层，请整理后再传。');
					return false;
				}
				(new Create_dirs_class()).init({
					is_from_h5: true,
					file_tree_node: dir,
					dir_name: dir.name,
					file_total_num: dir_options['total_num'],
					file_total_size: dir_options['total_size']
				}, upload_plugin, this.get_disk_path_options());
			}
		},

		/**
		 * 递归所选的目录，获取目录的文件数、文件总大小、目录层级数
		 * @param dir_node
		 * @param opt
		 */
		recursive_dir: function(dir_node, opt) {
			if(dir_node.fileNodes.length) {
				opt.total_num += dir_node.fileNodes.length;
				for(var i = 0, len = dir_node.fileNodes.length; i < len; i++) {
					opt.total_size += dir_node.fileNodes[i].h5file.size;
				}
				var deep_num = 0,
					deep_node = dir_node.fileNodes[0];
				while(deep_node.parentNode) {
					deep_node = deep_node.parentNode;
					deep_num++;
				}
				opt.dir_deep_num = Math.max(opt.dir_deep_num, deep_num);
			}
			if(dir_node.dirNodes.length) {
				for(var i = 0, len = dir_node.dirNodes.length; i < len; i++) {
					this.recursive_dir(dir_node.dirNodes[i], opt);
				}
			}
		},

		get_disk_path_options: function() {
			var node = file_list.get_cur_node();
			//判断是否虚拟目录,是虚拟目录强制回到根目录
			if(node && node.is_vir_dir()) {
				node = file_list.get_root_node();
			}
			var node_name = node.get_name();
			return {
				pdir: node.get_id(),
				ppdir: node.get_parent().get_id(),
				pdir_name: node_name,
				ppdir_name: node.get_parent().get_name() || ''
			};
		},

		//显示错误的提示框
		show_error_dialog: function(msg) {
			var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
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
		}
	});

	window.WY_async_gain_dict_files_succ_callback = function(data) {
		loading.hide();

		var folderValidata = FolderValidata.create();
		folderValidata.add_validata('max_dir_size', data.dir_total_num, query_user.get_cached_user().get_dir_count());  //目录数太多验证
		folderValidata.add_validata('max_level_size', data.dir_level_num, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
		folderValidata.add_validata('max_files_size', data.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证

		var ret = folderValidata.run();
		if(ret) {
			upload_folder_h5_start.show_error_dialog(ret[0]);
			return false;
		}

		if(data.file_total_num === 0) {
			upload_folder_h5_start.show_error_dialog('要上传的文件夹为空');
			return false;
		}

		upload_folder_h5_start.start_upload(data);//上传所选择的目录
	};

	window.WY_async_gain_dict_files_fail_callback = function() {
		loading.hide();
		mini_tip.error('分析文件夹失败，请重新选择文件夹');
	};

	return upload_folder_h5_start;
});/**
 * 从appbox拖拽发送qq文件
 * @author bondli
 * @date 13-10-17
 */
define.pack("./upload_folder.upload_folder_ie",["$","lib","common","./tmpl","./upload_folder.loading","./upload_folder.get_up_folder_files","./upload_file_validata.upload_folder_validata","./select_folder.select_folder"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),
        JSON = lib.get('./json'),

        console = lib.get('./console').namespace('upload2'),

        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./upload_folder.loading'),
        get_up_folder_files = require('./upload_folder.get_up_folder_files'),
        FolderValidata = require('./upload_file_validata.upload_folder_validata'),
        select_folder = require('./select_folder.select_folder'),
        widgets = common.get('./ui.widgets'),

        is_over_total_num = false,

        is_canceled = false,

        undefined;

    var plugin_callback = {
        /**
         * 控件告知该次文件读取开始
         * @param taskId  
         */
        OnAsyncSelectFolderBegin : function(taskId) {
            console.debug('WYCLIENT_OnAsyncSelectFolderBegin', taskId);
            is_over_total_num = false;
            is_canceled = false;
            //显示loading
            loading.show('正在获取文件夹信息', function(){
                is_canceled = true;
                loading.hide();
                upload_folder.release(taskId);
                upload_folder.re_set();
            });
        },

        /**
         * 控件更新所选的数据
         * @param taskId  
         * @param currentFileCount 已获取的文件数
         */
        OnFolderFilesInfoUpdate : function (taskId, currentFileCount) {
            console.debug('WYCLIENT_OnFolderFilesInfoUpdate', taskId, currentFileCount);
            if(is_canceled === true || is_over_total_num === true) return 1;
            //当文件数大于我们的限制的时候，直接抛错
            if(currentFileCount > 2*constants.UPLOAD_FOLDER_MAX_FILE_NUM){
                is_over_total_num = true;
                loading.hide();
                upload_folder.release(taskId);
                upload_folder.show_error_dialog('所选文件夹下文件总数超过'+ constants.UPLOAD_FOLDER_MAX_FILE_NUM +'个，请管理后上传。');
                return 1;
            }
            upload_folder.get_files(taskId, currentFileCount);
            return 1;
        },

        /**
         * 控件告知该次文件读取完毕
         * @param taskId
         * @param totalFileCount 总文件数
         * @param errCode 错误码
         */
        OnAsyncSelectFolderComplete : function (taskId, totalFileCount, errCode) {
            console.debug('WYCLIENT_OnAsyncSelectFolderComplete', taskId, totalFileCount, errCode);
            if(is_canceled == true) return;

            if(errCode === 42260001){ //选择了整个磁盘
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
                upload_folder.show_error_dialog('暂不支持上传整个盘符，请重新选择。');
            }
            else if(errCode === 42260002){ //点击了取消
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
            }
            else if(errCode === 42260003) { //选择的文件夹中超过10层了
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                upload_folder.show_error_dialog('所选的文件夹目录超过'+num+'层，请整理后再传。');
            }
            else {
                upload_folder.set_total(taskId, totalFileCount);
                if(upload_folder.check_finish(taskId)){
                    //隐藏显示的loading
                    loading.hide();
                    var files = upload_folder.get_files_arr(taskId);
                    if(files){
                        //调用控件的接口，读取完成后释放内存
                        upload_folder.release(taskId);
                        upload_folder.show_select_folder(files);
                    }
                }
                else {
                    var times = 1;
                    var t = setInterval(function(){  //都是容错
                        times ++;
                        if(upload_folder.check_finish(taskId)){
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            var files = upload_folder.get_files_arr(taskId);
                            if(files){
                                //调用控件的接口，读取完成后释放内存
                                upload_folder.release(taskId);
                                upload_folder.show_select_folder(files);
                            }
                        }
                        if(times>=50){  //长时间没有正确提示错误
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            upload_folder.release(taskId);
                            upload_folder.re_set();
                            upload_folder.show_error_dialog('分析文件夹超时，请不要上传过大文件夹。');
                            return false;
                        }
                    },50);
                }
                
            }
            return 1;
        }
    }
    

    var upload_folder = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : {},

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
            upload_plugin.OnAsyncBatchSelectFolderEvent = function(event_param){
                var taskId = event_param.LocalID,
                    fileCount = event_param.FileCount, 
                    errCode = event_param.ErrorCode,
                    eventType = event_param.EventType;
                //console.log(taskId,fileCount,errCode,eventType);
                switch(eventType){
                    case 11:    //begin
                        plugin_callback.OnAsyncSelectFolderBegin(taskId);
                        break;
                    case 12:    //end
                        plugin_callback.OnAsyncSelectFolderComplete(taskId, fileCount, errCode);
                        break;
                    case 13:    //update
                        plugin_callback.OnFolderFilesInfoUpdate(taskId, fileCount);
                        break;
                }
            };
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.GetAsynBatchSelectFileCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('GetFolderFilesCount:'+this._total);
        },

        //开始取数据
        get_files: function (taskId, select_count) {
            if(this._offset[taskId] === undefined){
                this._offset[taskId] = 0;
            }

            var me = this,
                filestr = '',
                pre_count = 100,
                need_get_count = select_count - me._offset[taskId],
                times = Math.floor(need_get_count/pre_count),
                left = need_get_count % pre_count;
            

            //次数大于等于1
            if(times >= 1){
                for(var i=1; i<=times; i++){
                    
                    //console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], pre_count);
                    var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                        console.log('GetFolderFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;

                    //更新offset
                    me._offset[taskId] += pre_count;
                }
            }

            //生效不足一次的
            if(left) {

                //console.log('GetFolderFilesInfo1:',taskId, me._offset[taskId], left);
                var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                    console.log('GetFolderFilesInfo failed,retry...');
                }
                filestr += tmpstr;

                //更新offset
                me._offset[taskId] += left;
            }

            //console.log('filestr:',filestr.length);

            var __files = filestr.split('\r\n');
            __files.pop();

            if (!__files || !__files.length) { //没有选中文件退出
                return false;
            }
            
            //构造本次任务的数组
            if(me._file_obj[taskId]){
                me._file_obj[taskId] = $.merge(me._file_obj[taskId], __files);
            }
            else{
                me._file_obj[taskId] = __files;
            }
            
        },

        //检查是否获取完成，都是容错
        check_finish: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                return false;
            }
            console.log(this._total, this._file_obj[taskId].length);
            return (this._total == this._file_obj[taskId].length) ? true : false;
        },

        //获取文件数组
        get_files_arr: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                this.show_error_dialog('分析文件夹出错，找不到指定的文件。');
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = get_up_folder_files(this._file_obj[taskId]);
            //console.log(files);
            this.re_set();

            //判断是是否所选的文件夹超过10层
            if(files.is_exist_folder_be_ignore == true){
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                this.show_error_dialog('所选的文件夹目录超过'+num+'层，请整理后再传。');
                return false;
            }

            var folderValidata = FolderValidata.create();
            folderValidata.add_validata('max_dir_size', files.dir_total_num, query_user.get_cached_user().get_dir_count());  //目录数太多验证
            //var max_file_num_dir_name = text.smart_cut(files.max_file_num_dir_name, 20);
            //console.log(files.dir_level_num, max_file_num_dir_name);
            folderValidata.add_validata('max_level_size', files.dir_level_num, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
            folderValidata.add_validata('max_files_size', files.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
            var ret = folderValidata.run();
            if(ret){
                this.show_error_dialog(ret[0]);
                return false;
            }
            return files;
        },

        //显示错误的提示框
        show_error_dialog: function (msg) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
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
        },

        //释放资源
        release: function (taskId) {
            console.log('ReleaseFolderFilesData');
            return this.upload_plugin.ReleaseLocal(taskId);
        },

        //重新设置初始值
        re_set: function () {
            this._taskId = '';
            this._file_arr = [];
            this._offset = {};
            this._total = 0;
        },

        //弹出上传位置选择框
        show_select_folder: function (files) {
            return select_folder.show_by_upfolder(files, this.upload_plugin);
        }

    };

    return upload_folder;

});define.pack("./upload_form_start",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./view","./upload_file_validata.upload_file_validata","disk","./select_folder.photo_group"],function(require, exports, module) {

	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),

		upload_route = require('./upload_route'),
		Upload_class = require('./Upload_class'),
		select_folder = require('./select_folder.select_folder'),
		upload_static = require('./tool.upload_static'),
		upload_cache = require('./tool.upload_cache'),
		View = require('./view'),
		Validata = require('./upload_file_validata.upload_file_validata'),

		disk = require('disk').get('./disk'),
		file_list = require('disk').get('./file_list.file_list'),

		console = lib.get('./console'),
		random = lib.get('./random'),

		functional = common.get('./util.functional'),
		Module = common.get('./module'),
		global_function = common.get('./global.global_function'),
		query_user = common.get('./query_user'),
		session_event = common.get('./global.global_event').namespace('session'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		ret_msgs = common.get('./ret_msgs'),

		photo_group = require('./select_folder.photo_group');

	var upload_lock = false;

	var clear_input_file = function() {
		//清除表单的值，这样下次就能够继续选择上次的文件
		if(upload_route.upload_plugin && upload_route.upload_plugin.reset) {
			upload_route.upload_plugin.reset();
		}
	};

	document.domain = 'weiyun.com';

	var Upload = Upload_class.sub(function(upload_plugin, id, path, attrs) {

		this.upload_plugin = upload_plugin;
		this.local_id = id;
		this.del_local_id = id;
		this.path = path;
		this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
		this.pdir = attrs.pdir;   //上传到指定的目录ID
		this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
		this.skey = attrs.skey;
		this.file_name = this.get_file_name();
		this.processed = 0;
		this.code = null;
		this.log_code = 0;
		this.can_pause = false;
		this.state = null;
		this.view = null;
		this.time = this.get_timeout(180000); //超时
		this.validata = Validata.create();
		this.validata.add_validata('check_video', this.file_name);//视频文件
		this.init(attrs.dir_id_paths, attrs.dir_paths);

	});

	Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

	Upload.interface('get_timeout', function(__time) {

		var t,
			__self = this;

		var timeout = function() {
			t = setTimeout(function() {
				__self.change_state('error', 10001);//表单超时，激活错误状态
			}, __time);
		};

		var clear = function() {
			clearTimeout(t);
		};

		return {
			timeout: timeout,
			clear: clear
		};

	});
	/**
	 * 不能重试
	 */
	Upload.interface('can_re_start', function() {
		return false;
	});
	Upload.interface('states.done', function() {
		this.superClass.states.done.apply(this, arguments);
		this.upload_plugin.destory();
		//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
		if(disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) {
			file_list.reload(false, false);
		}
	});


	Upload.interface('states.error', function() {
		this.superClass.states.error.apply(this, arguments);
		this.upload_plugin.destory();
	});


	Upload.interface('states.start', function() {
		this.start_time = +new Date();
		var ret = this.superClass.states.start.apply(this, arguments);
		//获取里面的返回值，防止本地错误了，还会继续执行上传
		if(ret === false) {
			clear_input_file();
			this.upload_plugin.destory();
			return;
		}
		var send_param = {
			name: 'web',
			ppdir: this.ppdir,
			pdir: this.pdir,
			skey: this.skey
		};
		var group_id = photo_group.get_photo_group_id();
		if(group_id > 0) {
			this.group_id = send_param.group_id = group_id;
			send_param.upload_type = 1;//非控件上传
		}
		this.upload_plugin.send(send_param);
		this.time.timeout();

		clear_input_file();

	});

	var add_upload = function(upload_plugin, files, attrs) {
		attrs.skey = query_user.get_skey();

		functional.burst([upload_route.upload_plugin.get_path()], function(path) {

			var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), path, attrs);

			upload_obj.change_state('wait');    //状态转为wait，放入队列等待.

			upload_obj.events.nex_task.call(upload_obj);

		}, 3).start();
	};

	upload_event.on('add_upload', add_upload);

	var form_upload = new Module('form_upload', {

		render: function() {

			var me = this;

			this.listenTo(upload_route, 'render', function() {

				upload_route.upload_plugin.change(function() {

					//获取用户选择的文件名
					var file_name = $('#_upload_form_input').val(),
						ary = file_name.split(/\\|\//);
					me.file_name = ary[ary.length - 1] || '';

					var __files = [
						{"name": me.file_name, "size": 0}
					];

					//弹出上传路径选择框，第三个参数标识是上传类型
					select_folder.show(__files, upload_route.upload_plugin, 'form');

				});

			});
		}
	});


	global_function.register('weiyun_post_end', function(json) {
		//code by bondli 防止用户重复选择同一文件上传导致不会触发表单的change事件
		//try{$('#_upload_form_input').val('');}catch(e){};
		//code by iscowei 上面那行代码会导致失败重试上传时提交的表单空值，另外IE下不支持修改type="file"的value
		if(upload_route.upload_plugin && upload_route.upload_plugin.reset) {
			upload_route.upload_plugin.reset();
		}

		setTimeout(function() { // fix response try
			if(json.ret === 0) {
				upload_cache.get_curr_real_upload().change_state('done');
				return upload_lock = false; //清空single_upload，方便下一次上传.
			} else {
				upload_cache.get_curr_real_upload().change_state('error', json.ret);
				if(json.ret === ret_msgs.INVALID_SESSION) {//fixed bug 48758599 by hibincheng Form表单上传，会话过期，登陆框弹出显示。(其它上传在Upload_class.js request_upload方法中rqeuest请求配置cavil参数即可)
					session_event.trigger('session_timeout');
				}
				return upload_lock = false;
			}
		}, 0);
	});


	form_upload.render();

	module.exports = Upload;


});define.pack("./upload_global_function",["lib","common","$","./tool.upload_static","./tool.upload_cache"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        c = lib.get('./console'),
        JSON = lib.get('./json'),

        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        page_event = common.get('./global.global_event').namespace('page'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),

        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        op_map = [ null, 'file_sign_done', 'file_sign_update_process', 'done', 'upload_file_update_process', 'create_file_done', 'get_resume_info_done' ],

        undefined;

    global_function.register('OnEvent', window.OnEvent = function (param) {

        if(!Cache.is_init()){
            return 1;
        }


        param = functional.try_it(function () {
            return JSON.parse(param);
        }) || param || {};

        //c.log(param.LocalID,param.EventType,param.ErrorCode,param.Step);

        var task = Cache.get_task(param.LocalID);

        if (!task) {
            return 1;
        }

        //调试模式，总是打印控件回调,用于判断是否控件卡死
        if (constants.IS_DEBUG) {
            //c.log('upload_plugin_callback:'+param.LocalID);
            c.log(param.LocalID,param.EventType,param.ErrorCode,param.Step);
        }

        var op = op_map[ param.EventType ], //回调操作
            error_code = param.ErrorCode;   //回调操作结果码
	    var error_map = {
		    '2': '系统找不到指定的文件，请确认文件可用并重试上传'
	    };
	    if (error_code !== undefined && error_code !== 'undefined' && error_code !== 0) {
		    var error_step = param.Step;    //控件错误调试step
		    c.warn('fileupload '+op+' errorCode= ' + error_code);
		    c.warn('fileupload '+op+' step= ' + error_step);
		    task.change_state('error', [(error_map[error_code.toString()] || '存储服务繁忙') + '(' + error_code + ')' , error_code] , error_step);
		    return 1;
	    }
	    task.change_state(op, param);   //具体的回调函数
	    return 1;
    });

    // global_function.register('WYCLIENT_UploadFiles', );  已移至 /imgcache.qq.com/club/weiyun/js/module/disk/src/ui.js 中 @james


    // appbox 关闭拦截，return true 表示关闭，return false 表示不关闭
    global_function.register('WYCLIENT_BeforeCloseWindow', function (is_close_QQ) {
        var close = true, no_close = false;

        if (is_close_QQ === "TRUE") { // 直接关闭QQ时不提示，直接关闭
            return close;
        }
        else {
            //解决弹出后停留5秒后点击取消会自己关闭的bug
            var is_new_qq = false;
            if(window.external.GetVersion){
                var ver = window.external.GetVersion();
                if(ver >= 5311){
                    is_new_qq = true;
                }
            }
            var msg = page_event.trigger('before_unload');
            if (msg) {
                if(is_new_qq){
                    return '{"MsgTitle":"提示", "MsgContent":"'+msg+'", "IconType":1}';
                }
                else{
                    if(window.external.MsgBox_Confirm('提示', msg, 1)){
                        page_event.trigger('confirm_unload');
                        return close;
                    } else {
                        return no_close;
                    }
                }
            }
        }

	    //todo: ptlogin.qq.com切换
	    //query_user.destroy();
        if(typeof pt_logout !== 'undefined') {
            pt_logout.logoutQQCom(function() {
                query_user.destroy();
            });
        } else {
            require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
	            typeof pt_logout !== 'undefined' && pt_logout.logoutQQCom &&  pt_logout.logoutQQCom(function() {
                    query_user.destroy();
                });
            });
        }
        return close;
    });


    window.support_plugin_drag_upload = function () {
        if (page_event.trigger('check_file_upload_draggable') === false) {
            return 0;
        }
        return 1;
    };

    // code by james：上传过程中关闭窗口不弹框确认的bug fix

    // 关闭、刷新页面前的检查和获取提示
    page_event.on('before_unload', function () {
        return Static.get_page_unload_confirm();
    });

    // 用户已确认允许关闭（加这个标识是为了避免重复弹框的问题）
    var unload_confirmed = false;

    // 确认将要关闭、刷新页面的事件
    page_event.on('confirm_unload', function () {
        if (!unload_confirmed) {
            // 标识用户已确认关闭
            unload_confirmed = true;
            // 记录上传/下载进度以便续传
            Static.store_upload_down_progress();
            // 停止上传动作
            Static.stop_upload_all();
            // 记录下载进度以便续传
            //Static.store_down_progress();
            // 停止下载
            Static.stop_down_all();

            upload_event.trigger('set_curr_upload_file_id');
        }
    });

    // 浏览器关闭、刷新前弹出确认框
    global_function.register('onbeforeunload', function () {
        // 如果用户未确认过关闭（未触发过confirm_unload），则需要弹框确认
        if (!unload_confirmed) {
            return page_event.trigger('before_unload');
        }
    });

    // 浏览器关闭、刷新时，停止上传
    $(window).on('unload', function () {
        page_event.trigger('confirm_unload');
    });


    return global_function.get('OnEvent');
});/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-7-31
 * Time: 下午4:51
 * HTML5上传
 */
define.pack("./upload_h5_flash",["$","lib","common","main","./file_exif","./upload_route","./tool.upload_cache","./select_folder.select_folder","./Upload_html5_class","./upload_html5"],function(require, exports, module) {

	var $ = require('$'),
		lib = require('lib'),
		common = require('common');

	var random = lib.get('./random'),
		routers = lib.get('./routers'),
		console = lib.get('./console').namespace('upload'),
		urls = common.get('./urls'),
		stat_log = common.get('./stat_log'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		file_object = common.get('./file.file_object'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		global_function = common.get('./global.global_function'),
		global_variable = common.get('./global.global_variable'),
		logger = common.get('./util.logger'),
		reportMD = common.get('./report_md'),
		huatuo_speed = common.get('./huatuo_speed');

	var main_mod = require('main'),
		file_exif = require('./file_exif'),
		upload_route = require('./upload_route'),
		upload_cache = require('./tool.upload_cache'),
		select_folder = require('./select_folder.select_folder'),
		main_ui = main_mod.get('./ui'),
		upload_dom = main_ui.get_$uploader();

	var MB1 = 1024 * 1024,
		MB2 = MB1 * 2,
		MB10 = MB1 * 10,
		K128 = 1024 * 128;

	var h5_file_reader;
	var calc_nums = 10;
	var upload_blob_size = K128;
	var calc_times = [];

	//动态计算网速，然后计算出合适的分片上传大小（一开始以128K上传）
	function calc_upload_blob_size() {
		var total_times = 0;
		var speed = 0;
		var size = 0;
		for(var i = 0, len = calc_times.length; i < len; i++) {
			total_times += calc_times[i];
		}

		speed = (total_times / 10) / 1000;
		size = 128 / speed;
		if(size < 128 || size < 256) {
			upload_blob_size = 128;
		} else if(size < 384) {
			upload_blob_size = 256;
		} else if(size < 512) {
			upload_blob_size = 384;
		} else if(size < 1024) {
			upload_blob_size = 512;
		} else {
			upload_blob_size = 1024;
		}

		console.log('upload_blob_size:', upload_blob_size + 'KB');

		upload_blob_size = upload_blob_size * 1024;
	}

	var Upload = {
		upload_type: "upload_h5_flash",
		$upload_html5_input: null,
		flash: null,
		change: function() {
			//获取用户选择的文件名
			var me = this;
			var __files = [];
			var _filearray = me.get_files();
			for(var i = 0; i < _filearray.length; i++) {
				var file_name = _filearray[i].name,
					ary = file_name.split(/\\|\//),
					file_size = _filearray[i].size;
				file_name = ary[ary.length - 1] || '';
				__files.push({"name": file_name, "size": file_size, "file": _filearray[i]});
			}
			var cur_user = query_user.get_cached_user(),
				main_key = cur_user.get_main_dir_key(),
				root_key = cur_user.get_root_key();
			//上传到中转站文件直接上传，不用进入选择目的地
			if(global_variable.get('upload_file_type') == 'temporary') {
				upload_event.trigger('add_upload', upload_route.upload_plugin, __files, {
					'temporary': true,
					'ppdir': root_key,
					'pdir': main_key,
					'ppdir_name': '微云',
					'pdir_name': '中转站',
					'dir_paths': ['中转站'],
					'dir_id_paths': [main_key]
				});
				routers.go({ m: 'station' });
			} else {
				//弹出上传路径选择框，第三个参数标识是上传类型
				select_folder.show(__files, upload_route.upload_plugin, 'h5_flash');
			}
			me.destory();
		},

		varityFile: function(task) {
			this._getSHAandMD5(task);
		},

		_back2html5: function(task) {
			var file = task.file;
			var attrs = {
				ppdir_name: task.ppdir_name,
				pdir_name: task.pdir_name,
				ppdir: task.ppdir,
				pdir: task.pdir
			};
			if(task.pdir_create_ret) {//父目录创建失败
				return;
			}
			task.dom_events['click_cancel'].call(task);//失败的任务删除
			//重新使用html5创建上传任务
			var upload_obj = require('./Upload_html5_class').getInstance(require("./upload_html5"), random.random(), file, attrs);
			upload_obj.upload_type = 'upload_html5';
			upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
			upload_obj.events.nex_task.call(upload_obj);
			console.log('降级使用html5');
		},

		_getSHAandMD5: function(task) {
			var me = this;
			var file = task.file,
				fid = task.local_id;

			task.endingByte = 0;
			task.startingByte = 0;

			var endingTime,
				startingTime = new Date(),
				h5_file_reader = new FileReader(),
				speedRst,
				flashHandle = 0,
				flashError = 0;

			h5_file_reader.onload = function(e) {
				task.startingByte = task.endindByte;
				if(me.flash == null) {
					me.flash = $('#swfFileUploader')[0];
				}

				var _slice = e.target.result.indexOf("base64,") + 7;
				try {
					//统计一下flash的调用次数
					if(!flashHandle) {
						if(me.flash && me.flash.updateSHAandMD5) {
							reportMD(277000034, 177000194);
						} else {
							reportMD(277000034, 177000195);
						}
						flashHandle = 1;
					}

					me.flash.updateSHAandMD5(fid, e.target.result.slice(_slice));
				} catch(e) {
					if(!constants.IS_HTTPS && !task.folder_id) { //chrome才能上传文件夹，所以flash过期失效才降级采用html5 只有mac safari上传文件才会出现
						me._back2html5(task);
					} else {
						task.change_state('error', 1000012);
					}
					//上报错误日志和模调
					if(!flashError && me.flash && me.flash.updateSHAandMD5) {
						reportMD(277000034, 177000196);
						logger.write([
								'flash error --------> e: ' + e,
								'flash error --------> file_name: ' + task.file_name,
								'flash error --------> file_type: ' + task.file_type,
								'flash error --------> file_size: ' + task.file_size,
								'flash error --------> endindByte: ' + task.endindByte,
								'flash error --------> path: ' + task.path
						], 'flash_error', 1000012);
						flashError = 1;
					}
					return;
				}
				if(task.endindByte < task.file_size) {
					if(!task.is_pre_file_sining) { //预扫描不更新进度
						task.change_state('file_sign_update_process', task.endindByte);
					}
					me._slice_blob(h5_file_reader, file, task);
				} else {
					//扫描结束上报时间
					try {
						endingTime = new Date();
						if(task.file_size > MB10) {
							speedRst = Math.round(task.file_size / (endingTime - startingTime));
							huatuo_speed.store_point('21254-1-2', '1', speedRst);
							huatuo_speed.report('21254-1-2', false);
						}
					} catch(e) {}
					//计算SHA
					me.flash.getSHAandMD5Result(fid);
					//获取到SHA 和 MD5以后  归0
					task.endingByte = 0;
					task.startingByte = 0;
				}
			};
			h5_file_reader.onerror = function() {
				task.change_state('error', 1000014);
			};
			me._slice_blob(h5_file_reader, file, task);
		},

		_slice_blob: function(reader, file, task, size) {
			var blob;
			var _size = MB2;
			if(!!size) {
				_size = size;
			}
			task.endindByte = task.startingByte + _size;
			if(task.endindByte > task.file_size) {
				task.endindByte = task.file_size;
			}
			if(file.webkitSlice) {
				blob = file.webkitSlice(task.startingByte, task.endindByte);
			} else if(file.mozSlice) {
				blob = file.mozSlice(task.startingByte, task.endindByte);
			} else {
				blob = file.slice(task.startingByte, task.endindByte);
			}
			reader.readAsDataURL(blob);
		},

		get_input: function() {
			return this.$upload_html5_input || (this.$upload_html5_input = $('#_upload_html5_input'));
		},

		get_files: function() {
			return this.get_input()['0'].files;
		},

		destory: function() {
			//重置上传按钮，清空已选文件的状态
			if(this.$upload_html5_input) {
				this.$upload_html5_input.remove();
				this.$upload_html5_input = null;
				$('<input id="_upload_html5_input" name="file" type="file" multiple="multiple" aria-label="上传文件，按空格选择文件。" style="display: none;" />').prependTo(upload_dom);
			}
		},

		uploadFile: function(task) {
			var me = this;
			var file = task.file;
			if(task.startingByte >= task.file_size) {
				task.change_state("done");
				return;
			}

			if(task.state === 'pause') {
				return;
			}
			h5_file_reader = h5_file_reader || new FileReader();
			h5_file_reader.onload = function(e) {
				var _slice = e.target.result.indexOf("base64,") + 7;
				if(calc_nums) {
					calc_times.push(+new Date());
				}
				//不能以对象方法传递参数，不然会引起内存泄漏
				me.flash.h5uploadFile(task.local_id, task.startingByte, task.sha || task.file_sha, task.md5 || task.file_md5, task.server_name, task.server_port, task.file_key, task.check_key, task.file_size, e.target.result.slice(_slice));

			};
			h5_file_reader.onerror = function() {
				task.change_state('error', 100009);
			};
			me._slice_blob(h5_file_reader, file, task, upload_blob_size);
		},

		pauseUpload: function(task) {
		},

		continueUpload: function(task) {
			Upload.uploadFile(task);
		}
	};

	var h5_flash_upload_render = function() {
		//只有上传的类型为h5+flash才更改上传按钮，拖拽时不更改按钮
		if(upload_route.type === 'upload_h5_flash') {
			upload_dom.change(function() {
				upload_route.upload_plugin.change();
			});
		}

		var $upload_obj = $('#uploadswf');
		if(!$upload_obj.length) {
			var flash_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/club/qqdisk/web/FileUploader.swf?r=' + random.random(),
				isIe = $.browser.msie && $.browser.version < 11;
			var mode = 1;
			$upload_obj = $(['<b class="icon_upload"></b><span id="uploadswf">', '<object id="swfFileUploader"' + (isIe ? '' : ' data="' + flash_url + '"') + ' style="width:' + 1 + 'px;height:' + 1 + 'px;left:0px;top:0px;position:absolute"' + (isIe ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + '>', isIe ? '<param name="movie" value="' + flash_url + '"/>' : '', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="wmode" value="transparent" />', '<param name="flashVars" value="callback=window.FileUploaderCallback&selectionMode=' + (mode === 1 ? 1 : 0) + '&buttonSkinURL=' + '"/>', '<param name="menu" value="false" />', '</object></span>'].join(''))
				.appendTo(upload_dom);
		}
		Upload.flash = $upload_obj.find('object')[0];
	};

	h5_flash_upload_render();

	global_function.register('FileUploaderCallback', function(code, opt) {
		var task = upload_cache.get_task(opt.id);
		var op = ["getShaAndMD5", "upload_done", 'upload_progress', "upload_error"];
		var _code = op[code - 0];

		if(task) {
			if(_code === 'getShaAndMD5') {
				var data = task.get_upload_param.call(task, opt.md5, opt.sha);
				task.file_sha = opt.sha;
				task.file_md5 = opt.md5;
				data.upload_type = 0; //走分片上传的协议
				data.file_size = task.file_size;
				task._state_log.msg.push('file_sign_done');
				if(task._srv_rsp_body) {
					if(task._srv_rsp_body.file_exist) {
						task.change_state('done', task._srv_rsp_body);
						h5_file_reader = null;
					} else {
						task.change_state('start_upload', task._srv_rsp_body, data);
						stat_log.upload_stat_report_41(task, '-', 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');
					}
					return;
				}

				if(task._is_request_upload) {//正在预扫描
					task.is_pre_file_sining = false;
					return;
				}

				task._is_request_upload = true;

				if(file_object.is_image(task.get_file_name())) {//
					file_exif.get_exif_by_file(task.file, function(obj) {
						data.ext_info = obj;
						task.request_upload(data, function(rsp_body, data) {
							task._is_request_upload = false;
							if(task.is_pre_file_sining) {
								task._srv_rsp_body = rsp_body;
								task.is_pre_file_sining = false;
								return;
							}
							if(rsp_body.file_exist) {
								task.change_state('done', rsp_body, data);
								h5_file_reader = null;
							} else {
								task.change_state('start_upload', rsp_body, data);
								stat_log.upload_stat_report_41(task, '-', 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');
							}
						});
					});
				} else {
					task.request_upload(data, function(rsp_body, data) {
						task._is_request_upload = false;
						if(task.is_pre_file_sining) {
							task._srv_rsp_body = rsp_body;
							task.is_pre_file_sining = false;
							return;
						}
						if(rsp_body.file_exist) {
							if(task.file_size > MB10) {
								//大文件秒传上报
								reportMD(277000034, 177000207);
							}
							task.change_state('done', rsp_body, data);
							h5_file_reader = null;
						} else {
							if(task.file_size > MB10) {
								//大文件非秒传上报
								reportMD(277000034, 177000208);
							}
							task.change_state('start_upload', rsp_body, data);
							stat_log.upload_stat_report_41(task, '-', 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');
						}
					});
				}
			} else if(_code === 'upload_done') {
				if(calc_nums--) {
					calc_times.push(+new Date() - calc_times.pop());
					if(!calc_nums) {
						calc_upload_blob_size();
					}
				}

				if(opt.flag == 0) {
					if(opt.offset != -1) {
						task.startingByte = opt.offset;
					} else {
						console.log('exception:', opt);
					}
					Upload.uploadFile(task);

				} else {
					h5_file_reader = null;
					task.change_state('done');
				}

			} else if(_code === 'upload_progress') {
				if(task.state !== 'pause') {
					task.change_state("upload_file_update_process", task.startingByte + (opt.loaded - 0));
				}
			}
			else if(_code === 'upload_error') {
				//console.log('upload_error', opt);
				logger.report($.extend(opt, {
					file_name: task.file_name,
					file_id: task.file_id,
					file_sha: task.file_sha,
					file_size: '' + task.file_size,
					server_name: task.server_name,
					server_port: task.server_port,
					msg: task._state_log && task._state_log.msg
				}));
				if(!task.folder_id && !constants.IS_HTTPS) { //降级使用html5重试
					Upload._back2html5(task);
					return;
				}
				var ret = -1;
				if(opt.status == "500") {
					ret = 500;
					task.change_state('error', ret);
				} else if(opt.status == "404") {
					task.change_state('error', 404);
				} else {
					task.change_state('error', 407); //跨域出错？
				}
			}
		}
	});

	module.exports = Upload;


});define.pack("./upload_h5_flash_start",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./view","disk","./select_folder.photo_group","./Upload_h5_flash_class"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        photo_group = require('./select_folder.photo_group'),
        Upload = require('./Upload_h5_flash_class');

    document.domain = 'weiyun.com';

    var add_upload = function (upload_plugin, files, attrs) {
        var len=files.length;
        for(var file in files){
            var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), files[file], attrs);
            upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
            if ((len -= 1) === 0) {
                upload_obj.events.nex_task.call(upload_obj);
            }
        }
    };

    upload_event.on('add_upload', add_upload);
});/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-7-31
 * Time: 下午4:51
 * HTML5上传
 */
define.pack("./upload_html5",["lib","common","$","./upload_route","./select_folder.select_folder","main","./tool.upload_cache"],function(require, exports, module) {

	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),
		constants = common.get('./constants'),
		https_tool = common.get('./util.https_tool'),
		routers = lib.get('./routers'),
		query_user = common.get('./query_user'),
		global_variable = common.get('./global.global_variable'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		upload_route = require('./upload_route'),
		select_folder = require('./select_folder.select_folder'),
		main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		upload_cache = require('./tool.upload_cache'),
		upload_dom = main_ui.get_$uploader();
	var Upload = {
		upload_type: "upload_html5",
		$upload_html5_input: null,
		change: function() {
			//获取用户选择的文件名
			var me = this;
			var __files = [];
			var _filearray = me.get_files();
			for(var i = 0; i < _filearray.length; i++) {
				var file_name = _filearray[i].name,
					ary = file_name.split(/\\|\//),
					file_size = _filearray[i].size;
				file_name = ary[ary.length - 1] || '';
				__files.push({"name": file_name, "size": file_size, "file": _filearray[i]});
			}

			var cur_user = query_user.get_cached_user(),
				main_key = cur_user.get_main_dir_key(),
				root_key = cur_user.get_root_key();
			//上传到中转站文件直接上传，不用进入选择目的地
			if(global_variable.get('upload_file_type') == 'temporary') {
				upload_event.trigger('add_upload', upload_route.upload_plugin, __files, {
					'temporary': true,
					'ppdir': root_key,
					'pdir': main_key,
					'ppdir_name': '微云',
					'pdir_name': '中转站',
					'dir_paths': ['中转站'],
					'dir_id_paths': [main_key]
				});
				routers.go({ m: 'station' });
			} else {
				//弹出上传路径选择框，第三个参数标识是上传类型
				select_folder.show(__files, upload_route.upload_plugin, 'html5');
			}
			me.destory();
		},
		get_input: function() {
			return this.$upload_html5_input || (this.$upload_html5_input = $('#_upload_html5_input'));
		},

		get_files: function() {
			return this.get_input()['0'].files;
		},

		destory: function() {
			//重置上传按钮，清空已选文件的状态
			if(this.$upload_html5_input) {
				this.$upload_html5_input.remove();
				this.$upload_html5_input = null;
				$('<input id="_upload_html5_input" name="file" type="file" multiple="multiple" aria-label="上传文件，按空格选择文件。" style="display: none;" />').prependTo(upload_dom);
			}
		},

		uploadFile: function(data, Upload) {
			var xhr = new XMLHttpRequest();
			Upload.xhr = xhr;
			//因非分片上传还不支持https，所以直接写死端口，后续支持后采用data.port
			var _url = 'http://' + data.server_name + ':8080/ftn_handler/?ver=12345&ukey=' + data.check_key + '&filekey=' + data.file_key + '&';
			var fd = new FormData();
			fd.append('file', Upload.file);
			//xhr.withCredentials =true;
			xhr.open("post", _url);
			xhr.upload.addEventListener('progress', function(e) {
				if(e.lengthComputable) {
					var task = upload_cache.get_task(data.local_id);
					if(task) {
						task.change_state('upload_file_update_process', e.loaded);
					}
				}
			}, false);
			var file_type = Upload.file.type;
			//error 事件都需要监听
			xhr.upload.addEventListener('error', function(e) {
				var task = upload_cache.get_task(data.local_id);
				if(task) {
					if(!file_type) { //可能是文件夹
						task.change_state('error', 1000011);
					} else {
						task.change_state('error', 10003);
					}
				}
			});
			xhr.addEventListener('error', function(e) {
				var task = upload_cache.get_task(data.local_id);
				if(task) {
					if(e.target.readyState != 4 || e.target.status != 200) {
						//网络问题
						task.change_state('error', 10003);
					} else if(!file_type) { //可能是文件夹
						task.change_state('error', 1000011);
					} else {
						//其它的也都归为网络问题
						task.change_state('error', 10003);
					}
				}
			});

			xhr.onreadystatechange = function(e) {
				if(xhr.readyState === 4) {
					var task = upload_cache.get_task(data.local_id);
					if(xhr.status === 200 && task) {
						task.change_state('done');
					}
				}
			};
			xhr.send(fd);

		}
	};

	(function() {
		if(upload_route.upload_plugin == null) {
			upload_dom.change(function() {
				upload_route.upload_plugin.change();
			});
		}
	})();

	module.exports = Upload;
});/**
 * User: iscowei
 * Date: 16-04-25
 * 多线程HTML5上传
 */
define.pack("./upload_html5_pro",["$","lib","common","main","./upload_route","./tool.upload_static","./select_folder.select_folder","./file_exif","./tool.sha"],function(require, exports, module) {
	//基础库
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		console = lib.get('./console').namespace('html5_upload_pro'),
		urls = common.get('./urls'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		file_object = common.get('./file.file_object'),
		undefined;

	//界面ui
	var main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		upload_dom = main_ui.get_$uploader(),
		undefined;

	//扩展模块
	var upload_route = require('./upload_route'),
		upload_static = require('./tool.upload_static'),
		select_folder = require('./select_folder.select_folder'),
		file_exif = require('./file_exif'),
		sha = require('./tool.sha'),
		undefined;

	//私有变量
	var KB1 = Math.pow(2, 10),
		fragment = KB1 * 512,
		fragmentLogNum = 10,    //错误时上报分片信息的数量
		timeoutRetryLimit = 2,  //超时重试次数
		experiencing = false, //体验极速上传的标识
		errorMap = { //不可重试错误，直接抛error
			'-89104': 1,
			'-89105': 1,
			'-44602': 1
		};

	var user = query_user.get_cached_user() || {};
	var isvip = user.is_weiyun_vip && user.is_weiyun_vip();

	var uploadUrl;
	//全走https，只有需要调试的时候才用http
	if(constants.IS_DEBUG) {
		uploadUrl = 'http://upload.weiyun.com/ftnup/weiyun';
		//下面这个连的是ocean的测试机
		//uploadUrl = 'http://weiyunpc.upqzfile.com:14000/ftnup/weiyun';
	} else {
		uploadUrl = 'https://upload.weiyun.com/ftnup/weiyun';
	}

	var Upload = {
		//标识
		upload_type: 'upload_html5_pro',
		//dom元素
		$upload_html5_input: null,
		//上传确认入口
		change: function() {
			//获取用户选择的文件名
			var that = this;
			var _files = [];
			var _filearray = that.getFiles();
			for(var i = 0, file_name, file_size, ary; i < _filearray.length; i++) {
				file_name = _filearray[i].name;
				file_size = _filearray[i].size;
				ary = file_name.split(/\\|\//);
				file_name = ary[ary.length - 1] || '';
				_files.push({'name': file_name, 'size': file_size, 'file': _filearray[i]});
			}

			//弹出上传路径选择框，第三个参数标识是上传类型
			select_folder.show(_files, upload_route.upload_plugin, 'upload_html5_pro');
			that.destory();
		},
		getInput: function() {
			return this.$upload_html5_input || (this.$upload_html5_input = $('#_upload_html5_input'));
		},
		getFiles: function() {
			return this.getInput()['0'].files;
		},
		//扫描入口
		varityFile: function(task) {
			var that = this;
			//保存下分片大小，计算速度时要用到
			task.fragment = fragment;
			//扫描文件计算sha，如果文件已经完成预扫描，就直接进入checkFile
			if(task.file_sha && task.hash) {
				that.checkFile(task);
			} else {
				encryptSHA(task).done(function(result) {
					//如果扫描过程中取消上传，就中止进程
					if(task.is_stop_upload) {
						return;
					}

					task._state_log.msg.push('file_sign_done');
					// result = { sha: sha, hash: [{"sha":"xxx","offset":xxx,"size":xxx}, {"sha":"xxx","offset":xxx,"size":xxx}] }
					task.file_sha = result.sha;
					task.hash = result.hash;
					that.checkFile(task);
				}).fail(function(result) {
					task.change_state('error', result.retcode);
				});
			}
		},
		//扫描完sha，检查文件是否已存在云端
		checkFile: function(task) {
			var data = task.get_upload_param.call(task, null, task.file_sha);
			//通知后台下发极速上传信息的标志位
			data.use_mutil_channel = true;

			//已经在预扫描时拉到文件云端信息，就不用发送请求，直接执行请求回调
			if(task._srv_rsp_body) {
				onRequestUploadHandler(task._srv_rsp_body, data);
				return;
			}

			//预扫描中的文件，重复请求时，重置标识
			if(task._is_request_upload) {
				task.is_pre_file_sining = false;
				return;
			}

			task._is_request_upload = true;
			if(file_object.is_image(task.get_file_name())) {
				file_exif.get_exif_by_file(task.file, function(obj) {
					data.ext_info = obj;
					task.request_upload(data, onRequestUploadHandler);
				});
			} else {
				task.request_upload(data, onRequestUploadHandler);
			}

			function onRequestUploadHandler(rsp_body, data) {
				task.channel_count = rsp_body.channel_count;
				task.orig_channel_count = rsp_body.channel_count;   //请求上传时server返回的通道数原始值
				task._is_request_upload = false;

				//预扫描的文件，不执行上传
				if(task.is_pre_file_sining) {
					task._srv_rsp_body = rsp_body;
					task.is_pre_file_sining = false;
					return;
				}

				//判断秒传
				if(rsp_body.file_exist) {
					task.change_state('done', rsp_body, data);
				} else {
					task.change_state('start_upload', rsp_body, data);
				}
			}
		},
		//启动文件上传
		uploadFile: function(task) {
			var that = this;

			if(task.state === 'pause') {
				return;
			}

			//上传开始前，先把“准备中”状态改为“正在上传”
			//暂停后继续上传的话，task.loadedLen是有值的，需要恢复进度
			task.change_state('upload_file_update_process', task.loadedLen || 0);

			//暂停后继续，断点续传
			//之所以要判断task.loadedMap是否为空，是因为如果点了暂停后马上点继续
			//这个时候由于请求还没回包，task.holding可能还没有push通道信息，但这种情况下，task.loadedMap是有值的
			if(!$.isEmptyObject(task.loadedMap) || (task.holding && task.holding.length)) {
				if(task.holding && task.holding.length > 0) {
					for(var i=0, len=task.holding.length; i<len; i++) {
						that.uploadFregment(task, task.holding[i]);
					}
					task.holding = [];
				}
				return;
			}

			//已上传的数据大小，多个通道上传时，展示总进度条用，只在每个通道上传成功后更新
			task.loadedLen = 0;
			//这个map用来记录每个正在上传中的通道当前已上传的数据量，计算进度时需要把这些数据量累加起来跟loadedLen求和才是实际的上传量
			//这里以通道id作为索引值，注意在上传成功或失败后，都要把对应的id从map里删除，避免垃圾数据产生
			//补充：同时把loadedMap作为判断一个通道是否正在上传的依据，如果一个通道id有已上传数据，说明正在上传中，重复的id不会再发起上传
			//体验时间结束后，多出的通道会先进入等待，回归到单通道模式
			task.loadedMap = {};
			//单通道上传时的等待对列
			task.waitting = [];
			//暂停上传时保存的通道信息，恢复上传时需要用到
			task.holding = [];
			//上传分片信息，上报log用
			task.fragmentInfo = [];

			that.createFile(task).done(function(result) {
				task.ukeyid = result.ukeyid;
				task.loadedLen = result.uploadeddatalen;
				//前一个文件体验加速，到这个文件体验时间还没结束时，会有下面这种特殊情况：
				//request_upload里返回单通道，但createFile后通道数会变成多通道，所以这里要更新一下task.channel_count
				task.channel_count = result.channels.length;
				console.log('channels count: ' + (result.channels ? result.channels.length : 1));
				that.uploadFregment(task, result);
			}).fail(function(result) {
				console.log('createFile error, retcode: ' + result.retcode + ', msg: ' + result.msg);
				task.change_state('error', result.retcode || 2000004);
			});
		},
		//申请分配上传空间
		createFile: function(task) {
			var defer = $.Deferred();
			var param = {
				'method': 'createfile',
				'uin': query_user.get_uin_num(),
				'qua': 'web',
				'filesha': task.file_sha,
				'filesize': task.file_size,
				//网络类型，0:未知，1:wifi，2:2G，3:3G，4:4G，5:有线宽带
				'nettype': 5,
				//请求id，请求侧指定，后台原样返回
				'reqid': getReqId('xxxxxxxx'),
				//0:多通道ftn，1:单通道ftn
				'flag': 0
			};

			var formData = new FormData();
			formData.append('json', JSON.stringify({
				'uploadkey': task.check_key,
				'ftntoken': ip2num(task.inside_upload_ip).toString(),
				'channelcount': task.channel_count,
				'blocks': task.hash,
				'addchannel': experiencing ? 1 : 0 //这个标识在体验阶段里通知后台下发多个通道
			}));

			//如果只有一个分片，文件创建的同时直接上传
			if(task.file_size <= fragment) {
				formData.append('data', task.file);
			}

			$.ajax({
				type: 'POST',
				cache: false,
				url: urls.make_url(uploadUrl, param, false),
				data: formData,
				dataType: 'json',
				//必须设置这个contentType为false，告诉js不要设置请求头，后台才能正确解包
				contentType: false,
				processData: false,
				timeout: 120000,
				//xhr回调是jquery暴露给外部修改内部xhr对象用的
				//这里用于绑定更新进度用的progress事件，注意返回值必须是一个xhr对象
				xhr: function() {
					var xhr = $.ajaxSettings.xhr();
					if(xhr.upload) {
						xhr.upload.addEventListener('progress', function(event) {
							//上传中的状态才需要更新进度条
							if(task.state === 'upload_file_update_process' || task.state === 'processing') {
								task.change_state('upload_file_update_process', event.loaded);
							}
						});
					}
					return xhr;
				},
				success: function(data, status, xhr) {
					if(xhr.status == 200) {
						if(data.retcode == 0) {
							defer.resolve(data);
						} else {
							defer.reject(data);
						}
					} else {
						defer.reject({
							'retcode': xhr.status,
							'msg': status || ''
						});
					}
				},
				error: function(xhr, errorType, error) {
					console.log('createFile error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText && (', xhr statusText: ' + xhr.statusText)));
					if(errorType === 'timeout') {
						defer.reject({ 'retcode': 2000010 });
					} else {
						defer.reject({ 'retcode': 2000004 });
					}
				}
			});

			return defer;
		},
		//体验极速上传
		experience: function(task) {
			var defer = $.Deferred();
			var that = this;

			if(experiencing) {
				defer.resolve(null, false);
			} else {
				experiencing = true;

				//只有以下状态才执行加速逻辑，否则只标记experiencing
				//因为上传文件夹时是不同状态的连续，文件的状态有可能在这3种状态之外
				if(task.state === 'start_upload' || task.state === 'upload_file_update_process' || task.state === 'processing') {
					//task.waitting有值时说明是从多通道降级到单通道的体验结束状态
					//再进行体验加速时，不作重复申请，直接从waitting里取缓存的通道发起上传
					if(task.waitting.length || task.channel_count > task.orig_channel_count) {
						while(task.waitting.length > 0) {
							task.channel_count++;
							that.uploadFregment(task, task.waitting.pop());
						}
						console.log('add channels, current channels count: ' + task.channel_count);
					} else {
						that.addChannel(task).done(function(result) {
							if(result.origchannelcount === result.finalchannelcount && result.finalchannelcount !== 1) {
								experiencing = false;
								defer.reject('今天极速上传体验次数已用完，请明天再体验', false);
							} else {
								task.ukeyid = result.ukeyid;
								task.channel_count = result.finalchannelcount;
								task.orig_channel_count = result.origchannelcount;
								result.uploadstate = 1;
								that.uploadFregment(task, result);
								console.log('add channels, current channels count: ' + task.channel_count);
								//增加通道完成，重发查询是否有体验券，没有就隐藏体验入口
								updateCouponInfo();
							}
						}).fail(function(result) {
							//上传文件夹，如果文件夹里都是小文件，有可能在某个小文件里触发申请增加通道
							//但请求发到server端时，文件已经上传完成了，这种情况下，会返回-102
							//可以不用处理这个错误，保持experiencing = true就行，下一个文件会在createfile时用多通道上传
							if(result.retcode == -102) {
								updateCouponInfo();
							} else {
								experiencing = false;
								defer.reject('网络异常，极速上传启动失败，请稍侯重试', false);
							}
						});
					}
				} else {
					updateCouponInfo();
				}
			}

			function updateCouponInfo() {
				upload_static.get_coupon_info().done(function(result) {
					//有体验券就显示试用入口
					if(result.coupon_count <= 0) {
						//查不到体验券，加速入口隐藏掉
						defer.resolve(null, false);
					} else {
						//还有体验券，加速入口保留着
						defer.resolve(null, true);
					}
				}).fail(function() {
					//查体验券失败，但加速成功了，加速入口隐藏
					defer.resolve(null, false);
				});
			}

			return defer;
		},
		//停止体验极速上传
		stopExperience: function() {
			var defer = $.Deferred();

			experiencing = false;
			query_user.get(true, false, false, function() {
				user = query_user.get_cached_user() || {};
				isvip = user.is_weiyun_vip && user.is_weiyun_vip();
				defer.resolve(isvip);
			});

			return defer;
		},
		//申请增加上传通道
		addChannel: function(task, ftnip) {
			var defer = $.Deferred();
			var param = {
				'method': 'addchannel',
				'uin': query_user.get_uin_num(),
				'qua': 'web',
				//网络类型，0:未知，1:wifi，2:2G，3:3G，4:4G，5:有线宽带
				'nettype': 5,
				//请求id，请求侧指定，后台原样返回
				'reqid': getReqId('xxxxxxxx'),
				//0:多通道ftn，1:单通道ftn
				'flag': 0
			};

			var formData = new FormData();
			formData.append('json', JSON.stringify({
				'ukeyid': task.ukeyid,    //createfile返回
				'ftntoken': ip2num(ftnip || task.inside_upload_ip).toString(),
				'channelcount': task.channel_count
			}));

			$.ajax({
				type: 'POST',
				cache: false,
				url: urls.make_url(uploadUrl, param, false),
				data: formData,
				dataType: 'json',
				//必须设置这个contentType为false，告诉js不要设置请求头，后台才能正确解包
				contentType: false,
				processData: false,
				timeout: 120000,
				success: function(data, status, xhr) {
					if(xhr.status == 200) {
						if(data.retcode === 0 && data.channels && data.channels.length >= 0) {
							defer.resolve(data);
						} else {
							defer.reject(data);
						}
					} else {
						defer.reject({
							'retcode': xhr.status,
							'msg': status || ''
						});
					}
				},
				error: function(xhr, errorType, error) {
					console.log('addChannel error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText && (', xhr statusText: ' + xhr.statusText)));
					defer.reject({ 'retcode': xhr.code || -400 });
				}
			});

			return defer;
		},
		//分发上传通道
		uploadFregment: function(task, param) {
			var that = this;

			//1:uploadNextPacket    继续下一个通道上传
			//2:UploadFinished      上传完成
			//3:waitOtherFinish     没有下一个通道，等待其它通道上传完成
			//4:holdToWait          暂时无用
			//只有uploadstate是1，或者试用加速才能进入上传
			if(param.uploadstate === 1) {
				if(!param.channels && param.channel) {
					param.channels = [param.channel];
				}

				if(param.channels && param.channels.length) {
					for(var i = 0, len = param.channels.length; i < len; i++) {
						//会员或者体验时才走多通道上传
						if(i >= task.orig_channel_count && !isvip && !experiencing) {
							task.channel_count--;
							task.waitting.push({
								'uploadstate': 1,
								'channel': param.channels[i]
							});
							console.log('reduce channels id: ' + param.channels[i].id + ', current channels count: ' + task.channel_count);
						} else {
							that.uploadRequest(task, {
								'ukeyid': task.ukeyid,    //createfile返回
								'ftntoken': ip2num(task.inside_upload_ip).toString(),
								'channel': param.channels[i]
							}).done(function(result) {
								//任务暂停时，把下个分片的通道先缓存起来备用
								if(task.state === 'pause') {
									task.holding.push(result);
								} else if(!task.is_stop_upload && (task.state === 'start_upload' || task.state === 'upload_file_update_process')) {
									//非会员非体验加速时，减少通道数到原始值
									if(!experiencing && task.channel_count > task.orig_channel_count) {
										if(isvip) {
											while(task.waitting.length > 0) {
												task.channel_count++;
												that.uploadFregment(task, task.waitting.pop());
												console.log('isvip: ' + isvip + ', add channels, current channels count: ' + task.channel_count);
											}
											that.uploadFregment(task, result);
										} else {
											task.waitting.push(result);
											task.channel_count--;
											console.log('reduce channels id: ' + result.channel.id + ', current channels count: ' + task.channel_count);
										}
									} else {
										that.uploadFregment(task, result);
									}
								}
							}).fail(function(result, uploadData) {
								//不可重试错误直接抛异常
								if(result.errorcode && errorMap[result.errorcode.toString()]) {
									if(uploadData && uploadData.channel) {
										console.log('error channels id: ' + uploadData.channel.id);
									}
									task.change_state('error', 2000014);
								} else if(result.retcode === 2000011) {
									task.channel_count--;
									console.log('error by 5min out of time, task.channel_count: ' + task.channel_count);
									//createfile时效过期（5分钟没有数据传输），重新发起checkFile
									if(task.channel_count === 0) {
										console.log('error by 5min out of time, retry check file');
										task.holding = [];
										task._srv_rsp_body = null;
										that.checkFile(task);
									}
								} else {
									//网络请求出错，把通道放到等待队列中重试
									task.waitting.push(uploadData);
									task.channel_count--;
									if(task.channel_count === 0) {
										task.change_state('error', result.retcode);
									}
								}
							});
						}
					}
				} else {
					//上传通道中断，没有上传的通道信息
					task.change_state('error', 2000005);
				}
			} else if(param.uploadstate === 2) {
				//上传完毕
				task.change_state('done');
				task.loadedLen = task.file_size;
				task.loadedMap = {};
				task.holding = [];
			} else if(param.uploadstate === 3) {
				//一定要把通道数减掉，不然其它分片上传失败后，通道数还没归零，导致无法触发重试逻辑，ui的上传进度就会卡着永远动不了
				task.channel_count--;
				//一个通道上传完毕，如果有还等待中的通道，不要忘记启动上传
				if(task.waitting && task.waitting.length) {
					that.uploadFregment(task, task.waitting.pop());
				} else if(task.channel_count === 0) {
					task.change_state('error', 2000012);
				}
			} else {
				task.change_state('error', 2000013);
			}
		},
		//执行上传
		uploadRequest: function(task, uploadData) {
			var defer = $.Deferred();
			var timeoutRetry = 0;

			if(task.loadedMap[uploadData.channel.id] === undefined) {
				task.loadedMap[uploadData.channel.id] = 0;

				var param = {
					'method': 'upload',
					'uin': query_user.get_uin_num(),
					'qua': 'web',
					//网络类型，0:未知，1:wifi，2:2G，3:3G，4:4G，5:有线宽带
					'nettype': 5,
					//请求id，请求侧指定，后台原样返回
					'reqid': getReqId('xxxxxxxx'),
					//0:多通道ftn，1:单通道ftn
					'flag': 0
				};

				var fd = new FormData();
				var end = Math.min(uploadData.channel.offset + fragment, task.file_size);
				var sliceBlob;

				//appbox是真的有毒，直接用file.slice出来的blob，上传时blob变成整个文件上传
				//所以只能先fileReader出base64，再用base64转回blob才能成功上传
				if(constants.IS_APPBOX) {
					readerFile(task.file, uploadData.channel.offset, end).done(function(base64) {
						sliceBlob = convertBase64UrlToBlob(base64);
						doUpload(sliceBlob);
					});
				} else {
					sliceBlob = blobFile(task.file, uploadData.channel.offset, end);
					doUpload(sliceBlob);
				}
			} else {
				//重复上传的通道id，出现这个一般是同一个任务请求了两次试用加速，但这里有做判断容错，所以这个逻辑错误可以忽略
				console.log('uploadRequest error, duplicate channel id: ' + uploadData.channel.id);
				delete task.loadedMap[uploadData.channel.id];
				defer.reject({ 'retcode': 2000008 }, uploadData);
			}

			function doUpload(blob) {
				var channelInfo;
				try {
					channelInfo = JSON.stringify(uploadData.channel);
				} catch(e) {
					channelInfo = '{ id: ' + uploadData.channel.id + ' }';
				}
				task.fragmentInfo.push('start fregment upload, upload time: ' + (new Date()).toString() + ', channel info: ' + channelInfo);

				fd.append('json', JSON.stringify(uploadData));
				fd.append('data', blob);

				$.ajax({
					type: 'POST',
					cache: false,
					url: urls.make_url(uploadUrl, param, false),
					data: fd,
					dataType: 'json',
					//必须设置这个contentType为false，告诉js不要设置请求头，后台才能正确解包
					contentType: false,
					processData: false,
					timeout: 120000,
					//xhr回调是jquery暴露给外部修改内部xhr对象用的
					//这里用于绑定更新进度用的progress事件，注意返回值必须是一个xhr对象
					xhr: function() {
						var xhr = $.ajaxSettings.xhr();
						if(xhr.upload) {
							xhr.upload.addEventListener('progress', function(event) {
								task.loadedMap[uploadData.channel.id] = event.loaded;
								//上传中的状态才需要更新进度条
								if(task.state === 'upload_file_update_process' || task.state === 'processing') {
									task.change_state('upload_file_update_process', task.loadedLen + loadedCount(task.loadedMap));
								}
							}, false);
						}
						return xhr;
					},
					success: function(data, status, xhr) {
						delete task.loadedMap[uploadData.channel.id];
						timeoutRetry = 0;
						if(xhr.status == 200) {
							//这个计算的目的是保证进度条只到99%，因为在上传过程中可能会有偏差，真正上传完成会直接切成完成状态的
							task.loadedLen = Math.min(task.loadedLen + end - uploadData.channel.offset, task.file_size - 1);
							if(data.retcode == 0) {
								defer.resolve(data);
							} else if(data.retcode === -89012) { //暂停超过5分钟，继续上传时需要重新createfile
								defer.reject({ 'errorcode': data.retcode, 'retcode': 2000011 }, uploadData);
							} else {
								console.log('uploadRequest data error' + (data.retcode && (', retcode: ' + data.retcode)) + (data.msg ? (', msg: ' + data.msg) : ''));
								console.log('error channel info: ' + channelInfo);
								console.log('error fragment info:' + task.fragmentInfo.slice(0, fragmentLogNum).join('; '));
								defer.reject({ 'errorcode': data.retcode, 'retcode': 2000007 }, uploadData);
							}
						} else {
							console.log('uploadRequest error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText ? (', xhr statusText: ' + xhr.statusText) : ''));
							console.log('error channel info: ' + channelInfo);
							console.log('error fragment info:' + task.fragmentInfo.slice(0, fragmentLogNum).join('; '));
							defer.reject({ 'retcode': 2000006 }, uploadData);
						}
					},
					error: function(xhr, errorType, error) {
						console.log('uploadRequest error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText ? (', xhr statusText: ' + xhr.statusText) : ''));
						delete task.loadedMap[uploadData.channel.id];
						if(errorType === 'timeout') {
							if(timeoutRetry++ < timeoutRetryLimit) {
								console.log('error channel info: ' + channelInfo + ', retry: ' + timeoutRetry + ' time');
								doUpload(blob);
							} else {
								console.log('error channel info: ' + channelInfo);
								console.log('error fragment info:' + task.fragmentInfo.slice(0, fragmentLogNum).join('; '));
								defer.reject({ 'retcode': 2000009 }, uploadData);
							}
						} else {
							defer.reject({ 'retcode': 2000006 }, uploadData);
						}
					}
				});
			}

			return defer;
		},
		destory: function() {
			//重置上传按钮，清空已选文件的状态
			if(this.$upload_html5_input) {
				this.$upload_html5_input.remove();
				this.$upload_html5_input = null;
				$('<input id="_upload_html5_input" name="file" type="file" multiple="multiple" aria-label="上传文件，按空格选择文件。" style="display: none;" />').prependTo(upload_dom);
			}
		}
	};

	(function() {
		if(upload_route.upload_plugin == null) {
			upload_dom.change(function() {
				upload_route.upload_plugin.change();
			});
		}
	})();

	//获取请求id
	function getReqId(str) {
		return str.replace(/[xy]/g, function( c ){
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r&0x3|0x8 );
			return v.toString( 16 )
		});
	}

	//ftn内网ip转数字
	function ip2num(dot) {
		var d = dot.split('.');
		return (+d[3]) * Math.pow(2, 24) + (+d[2]) * Math.pow(2, 16) + (+d[1]) * Math.pow(2, 8) + (+d[0]);
	}

	//计算task.loadedMap里正在上传中的通道的上传量
	function loadedCount(map) {
		var count = 0;
		for(var key in map) {
			if(map[key]) {
				count += map[key];
			}
		}
		return count;
	}

	//-------------------------------- readerFile模块 start --------------------------------
	function readerFile(file, start, end) {
		var defer = $.Deferred();
		var h5_file_reader = new FileReader();

		h5_file_reader.onload = function(e) {
			var slice = e.target.result.indexOf('base64,') + 7;
			defer.resolve(e.target.result.slice(slice));
		};

		h5_file_reader.onerror = function(e) {
			defer.reject(e);
		};

		h5_file_reader.readAsDataURL(blobFile(file, start, end));

		return defer;
	}

	function blobFile(file, start, end) {
		if(file.webkitSlice) {
			return file.webkitSlice(start, end);
		} else if(file.mozSlice) {
			return file.mozSlice(start, end);
		} else {
			return file.slice(start, end);
		}
	}

	/**
	 * 将以base64的图片url数据转换为Blob
	 * @param urlData
	 * 用url方式表示的base64图片数据
	 */
	function convertBase64UrlToBlob(urlData) {
		var bytes = window.atob(urlData);        //去掉url的头，并转换为byte

		//处理异常,将ascii码小于0的转换为大于0
		var ab = new ArrayBuffer(bytes.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}

		return new Blob([ab], {type: 'application/octet-stream'});
	}
	//-------------------------------- readerFile模块 end --------------------------------

	//-------------------------------- sha模块 start --------------------------------
	//做个闭包实现多文件同时计算sha
	function encryptSHA(task) {
		var defer = $.Deferred();
		var tempHashList = [];
		var handler = {
			//FileReader回调
			onFileReaderHandler: function(base64) {
				sha.postMessage({
					'cmd': 'update',
					'base64': base64
				});
				handler.onUpdateHandler();
			},
			onFileErrorHandler: function(e) {
				defer.reject({ 'retcode': 2000001 });
			},
			//sha计算结果处理
			onUpdateHandler: function() {
				//如果扫描过程中取消上传，就中止进程
				if(task.is_stop_upload) {
					return;
				}
				//完成一次sha更新，如果文件还有余下的分片，继续读取文件；没有分片就获取整个sha进入上传
				if(task.endingByte < task.file_size) {
					//update完成获取累积sha
					handler.onGetTempHashHandler(sha.postMessage({
						'cmd': 'getTempHash'
					}));
				} else {
					//扫描完成获取最终sha
					handler.onGetHashHandler(sha.postMessage({
						'cmd': 'getHash'
					}));
				}
				//扫描进度更新
				task.change_state('file_sign_update_process', task.endingByte);
			},
			onGetHashHandler: function(data) {
				if(data.result === 0) {
					tempHashList.push({
						'sha': data.hash,
						'offset': task.startingByte,
						'size': task.endingByte - task.startingByte
					});
					defer.resolve({
						sha: data.hash,
						hash: tempHashList
					});
				} else {
					defer.reject({ 'retcode': 2000003 });
				}
			},
			onGetTempHashHandler: function(data) {
				tempHashList.push({
					'sha': data.hash,
					'offset': task.startingByte,
					'size': task.endingByte - task.startingByte
				});
				chunk();
			}
		};

		function chunk() {
			task.startingByte = task.endingByte;
			task.endingByte = Math.min(task.endingByte + fragment, task.file_size);
			readerFile(task.file, task.startingByte, task.endingByte).done(handler.onFileReaderHandler).fail(handler.onFileErrorHandler);
		}

		//扫描进度更新
		task.change_state('file_sign_update_process', 0);
		sha.postMessage({
			'cmd': 'create'
		});
		chunk();

		return defer;
	}
	//-------------------------------- sha模块 end --------------------------------

	module.exports = Upload;
});define.pack("./upload_html5_pro_class",["$","lib","common","./view","./file_exif","./upload_route","./Upload_class","./tool.upload_static","./tool.upload_cache","./upload_plugin.upload_plugin","./upload_plugin.upload_plugin_folder","./select_folder.photo_group","./select_folder.select_folder","./upload_file_validata.upload_file_validata","./upload_folder.loading","./upload_folder.get_up_folder_files","./upload_file_validata.upload_folder_validata","disk","./upload_folder.upload_folder_appbox"],function(require, exports, module) {
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
});define.pack("./upload_html5_start",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./view","./upload_file_validata.upload_file_validata","disk","./select_folder.photo_group","./Upload_html5_class"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        stat_log = common.get('./stat_log'),
        photo_group = require('./select_folder.photo_group'),
        Upload = require('./Upload_html5_class');



    document.domain = 'weiyun.com';


    var add_upload = function (upload_plugin, files, attrs) {
        var len=files.length;
        for(var file in files){
            var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), files[file], attrs);
            upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
            if ((len -= 1) === 0) {
                upload_obj.events.nex_task.call(upload_obj);
            }
        }
    };

    upload_event.on('add_upload', add_upload);

    //module.exports = Upload;


});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./upload_plugin.upload_plugin",["$","lib","common","./msg","./view","disk","./Upload_class","./upload_route","./tool.upload_cache","./tool.upload_static","./upload_file_validata.upload_file_validata"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		c = lib.get('./console'),
		random = lib.get('./random'),
		functional = common.get('./util.functional'),
		query_user = common.get('./query_user'),
		constants = common.get('./constants'),
		plugin_detect = common.get('./util.plugin_detect'),

		msg = require('./msg'),
		View = require('./view'),
		disk_mod = require('disk'),
		Upload_class = require('./Upload_class'),
		upload_route = require('./upload_route'),
		upload_cache = require('./tool.upload_cache'),
		upload_static = require('./tool.upload_static'),
		Validata = require('./upload_file_validata.upload_file_validata'),

		file_list_ui = disk_mod.get('./file_list.ui'),

		G4 = Math.pow(2, 30) * 4,
		G2 = Math.pow(2, 30) * 2,
		G32 = Math.pow(2, 30) * 32,

		burst_num = constants.IS_APPBOX ? 8 : 50,//添加上传频率
		is_newest_version = function() {//频繁验证，在大批量上传时，有性能有问题；这里用一个缓存读取
			return plugin_detect.is_newest_version();
		}(),

		//appbox等控件升级后再开放,ie控件小于1.0.3.17，webkit控件小于1.0.0.11就不是tpmini了
		is_support_tpmini = function() {
			if(constants.IS_APPBOX) { //appbox暂时还不支持
				return false;
			}
			var cur_ver = plugin_detect.get_cur_upload_plugin_version();
			if($.browser.msie || window.ActiveXObject !== undefined) {
				return cur_ver >= 10317;
			} else {
				return cur_ver >= 10011;
			}
		}();

	var Upload = Upload_class.sub(function(file_path, upload_plugin, attrs, folder_id) {
		this.path = file_path; //文件路径
		this.file_name = this.get_file_name();  //文件名
		this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
		this.pdir = attrs.pdir;   //上传到指定的目录ID
		this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
		this.pdir_create_ret = attrs.pdir_create_ret; //父目录创建结果
		this.temporary = ''; //下线中转站 //!!attrs.temporary; //是否是中转站文件上传
		this.upload_plugin = upload_plugin; //上传插件
		this.local_id = random.random(); //文件上传的local_id
		this.del_local_id = random.random(); //用来删除缓存队列里的id
		this.state = null;  //上传状态
		this.file_size = this.get_file_size(); //文件总大小
		this.file_sign_update_process = 0; //当前签名进度
		this.code = 0; //当前错误吗
		this.log_code = 0;  //上报的错误吗
		this.processed = 0; //已上传进度
		this.event_param = null;
		this.can_pause = true; //能暂停
		this.view = null; //视图
		this.file_sign_done_flag = false;    //计算回调次数, 修改客户端偶尔扫描完成之后不回调的bug(客户端现在是多次回调).
		this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.
		this.is_retry = false; //是否重新来一次上传
		this.is_qq_receive = attrs.is_qq_receive || false; //添加一个是否从qq客户端接收到的文件上传

		this.validata = Validata.create();
		this.validata.add_validata('check_name', this.file_name);//名称校验
		this.validata.add_validata('check_video', this.file_name);//视频文件

		if(constants.IS_APPBOX) {
			var m = navigator.userAgent.match(/QQ\/([\d\.]+)/i),
				version = m && m[1];
			if(version && parseInt(version[0], 10) < 7) {
				this.validata.add_validata('plugin_max_size', this.file_size, Math.pow(2, 30));
			}
		}
		this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
		this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证

		if(folder_id) {
			this.folder_id = folder_id;
		}
		this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
	});

	Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));
	/**
	 * 是否控件上传
	 */
	Upload.interface('is_plugin_upload', function() {
		return true;
	});
	/**
	 * 是否妙传
	 */
	Upload.interface('is_miaoc', function() {
		return this.file_exist;
	});

	/**
	 * 是否tpmin加速
	 */
	Upload.interface('is_tpmini', function() {
		//appbox等控件升级后再开放,ie控件小于1.0.3.17，webkit控件小于1.0.0.11就不是tpmini了
		if(!is_support_tpmini) {
			return false;
		}
		return this.tp_key;
	});

	/**
	 * 是否需要自动保存进度，防止断电等情况下
	 */
	Upload.interface('need_auto_save_process', function() {
		return false; //由服务端返回nextOffset来续传
		//return this.file_size>=Math.pow(2, 20) * 500 && !this.file_exist;
	});

	/**
	 * 停止上传
	 * return {boolean} true停止上传成功， false停止上传失败
	 */
	Upload.interface('stop_upload', function() {
		var me = this,
			ret;
		if(me.upload_plugin && (me.local_id === 0 || me.local_id > 0)) {
			//判断如果是扫描状态下cancel的，需要停止扫描
			if(me.state === 'file_sign_update_process' || me.state === 'error' && me.processed == 0) {
				try {
					me.upload_plugin.StopFileSign(me.local_id);
					ret = 0;
				} catch(e) {
					c.error('停止扫描错误:', (typeof me.local_id), me.local_id);
				}
			} else if(me.state === 'upload_file_update_process' || me.state === 'error') {
				ret = me.upload_plugin.StopUpload(me.local_id);//WEB浏览器
				if(0 !== ret) {
					try {
						me.upload_plugin.StopUpload(me.local_id + ''); //APPBOX
						ret = 0;
					} catch(xe) {
						c.error('停止上传错误:', (typeof me.local_id), me.local_id, ret);
					}
				}
			}
		}
		return ret === 0;
	});

	/**
	 * 自己能否暂停
	 */
	Upload.interface('can_pause_self', function() {
		return (this.state === 'upload_file_update_process' && this.stop_upload());
	});

	/**
	 * 正真重试动作
	 */
	Upload.interface('resume_file_local', function() {
		var ret = this.upload_plugin.ResumeFileLocal(this.local_id); //继续上传的时候不重新分配local_id
		if(ret !== 0) {//续传失败
			try {
				this.upload_plugin.ResumeFileLocal(this.local_id + '');
			} catch(xe) {
				c.error('续传出错:', (typeof this.local_id), this.local_id, ret);
				this.change_state('pause');
			}
		}
	});
	/**
	 * 页面断开，重新续传 ，返回 local_id;
	 */
	Upload.interface('resume_file_remote', function() {
		var me = this;
		//新增设置每个分片大小
		if(upload_route.type === 'webkit_plugin') {
			me.upload_plugin.BreakSize = 128 * 1024;
			c.log('resume uplaod BreakSize:128k');
		}
		//webkit下大于2G的需要新的续传接口,APPBOX下也没有这个方法
		if(upload_route.type === 'webkit_plugin' && this.file_size > G2 && !constants.IS_APPBOX) {
			return this.upload_plugin.ResumeFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 0, 'weiyun');
		} else {
			return this.upload_plugin.ResumeFile(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 'weiyun');
		}
	});

	Upload.interface('states.pre_file_sign', function() {
		if(!this.is_pre_file_sining) {
			this.is_pre_file_sining = true;
			var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
				__self = this,
				callee = arguments.callee;
			if(!local_id || local_id == -1) {   //客户端的bug, 扫描可能未发起.
				return setTimeout(function() {
					return callee.call(__self);
				}, 1000);
			}

			this.set_local_id(local_id);
		}
	});

	Upload.interface('don_next_task_sign', function() {
		var cache = upload_cache.get_up_main_cache();
		var next_task = cache.get_next_task();
		if(next_task) {
			next_task.change_state('pre_file_sign');
		}
	});

	Upload.interface('states.start', functional.after(Upload_class.getPrototype().states.start, function() {
		if(this.is_qq_receive) { //上传时就让上传任务管理器最大化
			View.max();
		}
		if(this.file_size < Math.pow(2, 20) * 20) {//小于20M的文件不显示扫描.
			this.no_show_sign = true;
		}
		if(this.is_retry) {  //重新开始上传也不显示扫描
			this.no_show_sign = true;
		}
		if(this.pdir_create_ret) {
			this.change_state('error', this.pdir_create_ret);
			return;
		}
		//之前已扫描过，中转站文件直接申请上传
		if(this.file_sha || this.file_md5) {
			this.file_sign_done_flag = false;
			this.change_state('file_sign_done', {
				Md5: this.file_md5,
				SHA: this.file_sha
			});
			return;
		}

		if(!this.is_pre_file_sining) {
			var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
				__self = this,
				callee = arguments.callee;
			c.log('filesign start:', local_id, this.filename);
			if(!local_id || local_id == -1) {   //客户端的bug, 扫描可能未发起.
				return setTimeout(function() {
					return callee.call(__self);
				}, 1000);
			}

			this.set_local_id(local_id);
		} else {
			this.is_pre_file_sining = false;
		}
	}));

	/**
	 * 重试的正真动作
	 */
	Upload.interface('re_start_action', function() {
		this.stop_upload();
		this.file_sign_done_flag = false;//标识未扫描完成
		if(this.file_md5 && this.file_sha) {
			this.resume_file_local();
		} else {
			var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
				__self = this,
				callee = arguments.callee;
			if(!local_id) {   //客户端的bug, 扫描可能未发起.
				return setTimeout(function() {
					return callee.call(__self);
				}, 1000);
			}
			this.set_local_id(local_id);
		}
	});
	/**
	 * 释放控件资源
	 */
	Upload.interface('release_plugin', function() {
		try {
			this.upload_plugin.ReleaseLocal(constants.IS_APPBOX ? (this.local_id + '') : this.local_id);
		} catch(xe) {
			c.error('释放控件资源错误:', (typeof this.local_id), this.local_id, xe);
		}
	});

	/**
	 * 高亮文件
	 */
	Upload.interface('highlight_files', function() {
		var me = this;
		var file_ids = me.file_id;//me.get_file_id_by_dir();
		if(file_ids && file_ids.length) {
			file_list_ui.highlight_$item(file_ids);//高亮完成文件
		}
	});

	/**
	 * 上传完成后做的一些特殊处理
	 */
	Upload.interface('after_done', function() {
		var me = this;
		if(this.is_qq_receive) {
			me.highlight_files();
		}
	});

	/**
	 * 是否重新来一次上传
	 */
	Upload.interface('get_is_retry', function() {
		return this.is_retry;
	});

	/**
	 * 设置重新来一次上传
	 */
	Upload.interface('set_retry', function() {
		this.is_retry = true;
	});

	Upload.interface('states.start_upload', function(rsp_body, data) {   //这次是真的开始上传
		//code by bondli 增加上传开始时间点记录
		var me = this;
		me.start_time = +new Date();
		if(rsp_body && data) {
			me.server = rsp_body.server_name;
			me.port = rsp_body.server_port;
			me.new_name = rsp_body.filename;
			me.check_key = rsp_body.check_key;
			me.file_key = rsp_body.file_key;
			me.file_md5 = data.file_md5;
			me.file_sha = data.file_sha;
			me.file_exist = rsp_body.file_exist;
			//增加tp_key
			me.tp_key = rsp_body.tp_key;
			this.release_plugin();//获取到上传的存储连接后，释放控件上传线程
		}
		if(!me.server && !me.file_exist) {//未请求过server，调用者可能来自（远程服务爆出的容量不足错误，这个情况下是请求CGI是没有 返回这些数据的）
			return setTimeout(function() {
				me.change_state('error', me.code);
			}, 200);
		}
		if(!me.file_exist) {//非妙传用户，打印server
			c.log('start_upload url:', me.server);
		} else { //秒传的话，直接提示成功
			me.change_state('done');
			return;
		}

		//新增设置tp_key
		if(!me.file_exist && me.tp_key) {
			try {
				me.upload_plugin.ThirdPartyUploadKey = 'tp_key=' + me.tp_key;
				c.log('upload ThirdPartyUploadKey:', me.tp_key);
				//tpmini下设置分片大小为1M
				me.upload_plugin.BreakSize = 1024 * 1024;
				me.upload_plugin.UseServerBlockSize = false;
				c.log('upload BreakSize:1M');
			} catch(e) {
				c.log('upload tpkey');
			}
		} else {
			//新增设置每个分片大小为128K
			if(upload_route.type === 'webkit_plugin') {
				me.upload_plugin.BreakSize = 128 * 1024;
				c.log('upload BreakSize:128k');
			}
		}

		//大于2G的走新接口
		var local_id, callee;
		if(!constants.IS_APPBOX) {
			local_id = me.upload_plugin.UploadFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun', 0, 0);
			callee = arguments.callee;
		} else {
			local_id = me.upload_plugin.UploadFile(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun');
			callee = arguments.callee;
		}

		if(!local_id) {   //客户端的bug, 上传可能未发起.
			return setTimeout(function() {
				return callee.call(me, rsp_body, data);
			}, 1000);
		}

		this.set_local_id(local_id); //local_id已变化,  重新分配.
		if(!this.folder_id) {
			this.don_next_task_sign(); //先禁掉预扫描
		}
	});

	var add_upload = function(upload_plugin, files, attrs) {   //添加上传对象
		setTimeout(function() {//延时执行，给浏览器以喘气的机会
			var len = files.length;
			functional.burst(files, function(path) {
				var upload_obj = Upload.getInstance(path, upload_plugin, attrs);
				upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
				if((len -= 1) === 0) {
					upload_obj.events.nex_task.call(upload_obj);
				}
			}, burst_num, 63).start();
		}, 16);
	};

	var add_resume = function(files, upload_plugin) { //断点续传
		if(files.length) {
			View.showManageNum();
		}
		$.each(files, function() {
			//var obj = JSON.parse(this);    //转化store中读取的记录
			var obj = this;    //转化store中读取的记录
			var attrs = {
				'ppdir': obj.ppdir,
				'pdir': obj.pdir,
				'ppdir_name': obj.ppdir_name,
				'pdir_name': obj.pdir_name
			};
			var upload_obj = Upload.getInstance(obj.path, upload_plugin, attrs); //生成上传对象
			functional.try_it(function() {
				upload_obj.change_state('resume_pause', obj);   //状态转为续传
			});
		});

	};

	return {
		get_class: function() {
			return Upload;
		},
		add_resume: add_resume,
		add_upload: add_upload
	}
});/**
 * 上传文件夹 by trump
 */
define.pack("./upload_plugin.upload_plugin_folder",["lib","common","$","./view","./Upload_class","./msg","./upload_route","./tool.upload_static","./tool.upload_cache","./tool.bar_info","disk","./upload_plugin.upload_plugin"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        functional = common.get('./util.functional'),

        View = require('./view'),
        Class = require('./Upload_class'),
        msg = require('./msg'),
        upload_route = require('./upload_route'),

        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        bar_info = require('./tool.bar_info'),
        //select_folder = require('./select_folder.select_folder'),

        query_user = common.get('./query_user'),
        c = lib.get('./console'),
        text = lib.get('./text'),

        disk_mod = require('disk'),
        file_list,
        FileNode,

        upload_event = common.get('./global.global_event').namespace('upload2'),

        random = lib.get('./random'),

        sub_class,
        get_sub_class = function () {
            return sub_class || (sub_class = require('./upload_plugin.upload_plugin').get_class());
        },
        burst_num = common.get('./constants').IS_APPBOX ? 8 : 50,//添加上传频率

        fake_size = Math.pow(2, 30) * 10,//假定的文件夹大小

        sub_task_run_states = {fake_done:1,done:1,error:1};

    var Upload = Class.sub(function (upload_plugin, attrs) {
        this.file_name = attrs.dir_name;  //文件名
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.path = attrs.local_path || attrs.path;
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.upload_plugin = upload_plugin; //上传插件
        this.local_id = this.del_local_id = random.random(); //文件上传的local_id
        this.state = null;  //上传状态
        this.file_count = attrs.file_count;
        this.code = 0; //当前错误吗
        this.log_code = 0;  //上报的错误吗
        this.processed = 0; //已上传进度
        this.can_pause = true; //能暂停
        this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.
        this.sub_cache_key = attrs.sub_cache_key;
        this.init(attrs.dir_id_paths, attrs.dir_paths, '', 'folder');
        this.file_type = Static.FOLDER_TYPE;
        this.file_id = attrs.file_id;
        if (!FileNode) {
            FileNode = disk_mod.get('./file.file_node');
            file_list = disk_mod.get('./file_list.file_list');
        }
        this.prepend_to_disk();
    });
    Upload.interface('states', $.extend({}, Class.getPrototype().states));

    var cover_method = {
        //将文件夹插入到网盘中
        prepend_to_disk: function () {

            if (!this.file_id || this.has_append_to_disk) {
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
            } catch (xe) {
                c.error('folder prepend_to_disk error');
            }
        },
        //删除文件夹
        get_sub_cache: function () {
            return Cache.get(this.sub_cache_key);
        },
        //删除文件夹
        remove_file: function () {
            this.get_sub_cache()
                .each(function () {
                    if (this.state !== 'done') {
                        this.remove_file();
                    }
                });
        },
        //停止上传
        stop_upload: function (stop_all) {
            if (stop_all === true) {
                this.force_stop = true;//bugfix:增加文件夹子任务状态切换判断条件(force_stop：来自全部取消上传)；
            } 
            else {
                var sub_cache = this.get_sub_cache();
                if ( sub_cache ) {
                    var running = sub_cache.get_curr_upload();
                    running && running.can_pause_self() && running.stop_upload();
                }
            }
            return true;
        },
        //暂停后，重新续传
        resume_file_local: function () {
            this.when_change_state('continuee');

            this.view.upload_file_update_process();
            this.view.set_cur_doing_vid();

            var running = this.get_sub_cache().get_curr_upload();
            if(sub_task_run_states[running.state]){
                running.get_queue().dequeue();
                //running.events.nex_task.call(this);
            }
        },
        //页面断开，重新续传 ，返回 local_id;
        resume_file_remote: function () {
            this.when_change_state('continuee');
            var sub_cache = this.get_sub_cache(),
                resume_task;
            sub_cache.each(function () {
                if (this.state === 'resume_pause') {//重新上传第一个被暂停的任务；
                    resume_task = this;
                    return false;
                }
            });
            this.view.upload_file_update_process();
            this.view.set_cur_doing_vid();
            bar_info.update(bar_info.OPS.UP_CHECK);
            if (resume_task) {
                Static.batch_pause_to_run([resume_task], 'resume_continuee');
            } else {
                sub_cache.do_next();
            }
        },
        //暂停后，重新上传
        get_resume_param: function () {
            var arys = [];
            if (!Static.can_resume(this.state)) {
                return;
            }
            this.get_sub_cache().each(function () {
                if ('done' !== this.state) {//没有传完的文件可继续上传
                    arys.push(this.get_resume_param());
                }
            });
            if (arys.length > 0) {
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
        can_re_start: function () {
            if (this.can_not_re_start) {
                return false;
            }
            var result = false;
            this.get_sub_cache().each(function () {
                if (this.can_re_start() === true) {
                    result = true;
                    return false;
                }
            });
            return result;
        },
        //重新开始
        re_start_action: function () {
            var me = this,
                key = me.sub_cache_key;
            if (me.re_try_text) {//重试动作
                /*select_folder
                    .folder_error_retry(me.re_try_text)
                    .done(function () {
                        delete me.re_try_text;
                        delete me.folder_can_not_start;
                        me.re_start_action();
                    }).fail(function () {
                        me.change_state('error', me.log_code);
                    });*/
            } else {
                var re_start_lists = [];
                Cache.get(key).each(function () {
                    if (this.state === 'error' && this.can_re_start()) {
                        re_start_lists.push(this);
                    }
                });
                this._is_finished = false;
                Static.batch_re_start(re_start_lists, this.sub_cache_key);
            }
        },

        get_translated_error: function () {
            var error = this.get_sub_cache().get_count_nums().error;
            if (0 === error && this.log_code) {//取文件夹错误信息
                return Static.get_error_msg(this.log_code);
            }
            return error > 0 ? text.format(
                '{0}个文件上传失败，<span class="sim-link" data-action="folder-errors">详情</span>',
                [error/*error_count*/]
            ) : '';
        },

        get_translated_errors: function () {
            var errors = [];
            this.get_sub_cache().each(function () {
                if (this.state === 'error') {
                    errors.push({
                        name: this.path,
                        size: this.file_size,
                        error: this.get_translated_error('simple'),
                        error_tip: this.get_translated_error('tip')
                    });
                }
            });
            return errors;
        },
        //子任务准备好了
        on_sub_task_ready: function () {
            this.view.set_folder_size_ready();
        },
        /**
         * 是否文件夹上传
         */
        is_upload_folder: function () {
            return true;
        }
    };
    for (var key in cover_method) {
        Upload.interface(key, cover_method[key]);
    }
    //文件夹
    var folder_status = {
        start: function () {
            var me = this;
            if (me.folder_can_not_start || me.can_not_re_start) {
                return;
            }
            me.start_time = +new Date();//开始上传时间
            me.change_state('upload_file_update_process', {'Processed': me.processed});
            me.get_sub_cache().do_next();
        },
        done: function () {
            this.view.after_done();
        },
        error: function () {
            this.view.after_error();
        }
    };

    //子任务
    var sub_task_state = {
        start: function (folder) {
            folder.change_state('upload_file_update_process',
                {'Processed': this.get_passed_size()}
            );
        },

        done: function (folder) {
            sub_task_state._when_one_end.call(this, folder);//更新folder进度
        },
        error: function (folder) {
            /*if (folder.sub_cache_key === this.cache_key) {
                c.log(Cache.get(this.cache_key).get_count_nums())
                folder.view.upload_file_update_process();
            }*/
            sub_task_state._when_one_end.call(this, folder);//更新folder进度
        },
        //更新文件夹 总体进度
        upload_file_update_process: function (folder) {
            if (folder.sub_cache_key === this.cache_key) {
                folder.processed = this.processed + this.get_passed_size();
                folder.view.upload_file_update_process();
            }
        },
        file_sign_update_process: function (folder) {
            if (!this.no_show_sign) {
                folder.folder_scan_percent = this.file_sign_update_process / this.file_size * 100;
                folder.view.file_sign_update_process();
            }
        },
        file_sign_done: function (folder) {
            if (!this.no_show_sign) {
                folder.view.file_sign_done();
            }
        },

        _when_one_end: function (folder, state) {
            if (folder._is_finished) {
                return;
            }

            var cache = this.get_belong_cache();

            if (cache.is_done()) {//已完成，查看是否含有上传错误的子任务,并响应更新folder结果信息
                folder._is_finished = true;
                if (folder.state === 'pause') {//文件夹暂停后，其中最后一个子任务，不能被暂停，并且报错，则直接减去一个pause状态
                    folder.minus_info('pause');
                }
                if (cache.get_count_nums().error > 0) {
                    var can_re_start = false;
                    cache.each(function () {
                        if (this.state === 'error' && this.can_re_start()) {//如果能重试上传，则将folder任务设置为可上传,错误码取第一条可重试任务的错误码
                            can_re_start = true;
                            return false;
                        }
                    });
                    if (!can_re_start) {//子任务不能重试,将folder置为不可重试的任务
                        folder.can_not_re_start = true;
                    }
                    folder.change_state('error', folder.log_code);
                } else {
                    folder.change_state('done');
                }

            } else {//更新folder进度信息

                if (folder.state !== 'pause') {
                    folder.change_state('upload_file_update_process', {'Processed': this.get_passed_size()});
                }
            }
        }
    };
    var manager = {
        aop_task: function () {
            if (this.is_init)
                return;
            this.is_init = true;
            //用于阻塞整个队列继续执行  sub task before nex_task
            get_sub_class().getPrototype().events.nex_task = functional.before(get_sub_class().getPrototype().events.nex_task, function () {
                var f_id = this.folder_id,
                    folder;
                if( f_id ){
                    //子任务通过条件
                    //1:必须能找到自己的所属文件夹
                    //2:所属文件夹没有被停止运行
                    folder = Cache.get_folder_by_id(f_id);
                    if( !folder || folder.force_stop ){
                        console.log('no found folder id');
                        return false;
                    }
                }
                /*
                if( f_id && (folder = Cache.get_folder_by_id(f_id) ) ){
                    if(!folder.get_curr_cache()[f_id]){
                        return false;
                    }
                }
                */
            });
            //监控子类状态变化
            get_sub_class().interface('change_state',
                functional.after(get_sub_class().getPrototype().change_state, function () {
                    var me = this,
                        f_id = me.folder_id;
                    if (f_id) {
                        var folder = Cache.get_folder_by_id(f_id);
                        if (folder) {
                            if (folder.state === 'pause') {
                                if (me.can_pause_self()) {
                                    c.log('sub-task change_state add into resume_file_local');
                                    me.stop_upload();
                                    me.state = 'fake_done';//文件夹续传的时候，支持继续上传标志
                                    me.get_queue().head(me, function () {
                                        this.resume_file_local();
                                    });
                                } else {
                                    c.warn('can not pause this task : ', me.state, me.file_name);
                                }
                                return;
                            }
                            // 把最后一个子任务的错误码记录为文件夹的错误码
                            folder.log_code = me.code;

                            sub_task_state[me.state] && sub_task_state[me.state].call(me, folder);
                        }
                    }
                })
            );
            //监控父类状态变化
            Upload.interface('change_state',
                functional.after(Upload.getPrototype().change_state, function () {
                    if (this.file_type === Static.FOLDER_TYPE) {
                        if (folder_status[this.state]) {
                            folder_status[this.state].call(this);
                        }
                    }
                })
            );

            //清理子任务   folder before clear
            Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function () {
                if (this.file_type === Static.FOLDER_TYPE) {
                    Static.clear_upload_all(this.sub_cache_key);//清除子任务；
                }
            });
            //清理子任务   folder after clear
            Upload.getPrototype().dom_events.click_cancel = functional.after(Upload.getPrototype().dom_events.click_cancel, function () {
                if (this.file_type === Static.FOLDER_TYPE) {
                    Cache.get_up_main_cache().is_contain_folder(true);//更新是否含有文件夹
                }
            });
        },
        cache: {},
        /**
         * @param [upload_plugin]
         * @param folder_id  上传文件夹任务ID
         * @param files  文件夹下新添加的子文件
         * @param [cache_key] 缓存key
         * @param [length] 文件夹下的文件总长度
         */
        add_sub_task: function( upload_plugin, folder_id, files, cache_key, length ){
            var me = this;
            if(!me.cache[folder_id]){
                //第一次添加子任务文件
                me.cache[folder_id] = {
                    plugin: upload_plugin,
                    files:[],
                    consuming: false, //正在消费中
                    cache_key: cache_key,
                    batch_length: 200,
                    length: length
                };
            }
            
            me.cache[folder_id].files = me.cache[folder_id].files.concat(files);

            if(!me.cache[folder_id].consuming){
                me._consume_sub_task(folder_id);
            }
        },
        /**
         *
         * @param folder_id
         * @returns {*|boolean} 是否有待继续消费
         */
        _consume_sub_task: function(folder_id){
            var me = this,
                f_cache = me.cache[folder_id];
            if( f_cache && f_cache.length > 0 ){
                var files = f_cache.files.splice(0, f_cache.batch_length);
                f_cache.length -= files.length;

                if(files.length){
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
        _check_sub_task: function(folder_id){
            var me = this;
            if(me.cache[folder_id] && me.cache[folder_id].length > 0){
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
        _instance_sub_task: function (files, upload_plugin, cache_key, folder_id) {
            manager.cache[folder_id].consuming = true;
            var len = files.length;//总长度
            functional.burst(files, function (unit) {
                var task = get_sub_class().getInstance(
                    unit.file || unit.path,//file.file来自上传文件夹，file.path来自续传
                    upload_plugin,
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

                task.err_msg = unit.pdir_create_ret ? '('+unit.pdir_create_ret+')父目录创建失败' : '';

                if (unit.server) {//来自续传
                    task.change_state('resume_pause', unit);//状态转为续传
                    task.get_passed_size(task.get_passed_size() + task.processed);//设置已传输大小
                } else {
                    task.change_state('wait');//状态转为wait，放入队列等待.
                }
                if ((len -= 1) === 0 && manager._check_sub_task(folder_id)) {//当子任务全部添加后，将文件夹置入执行状态
                    var folder = Cache.get_task(folder_id);
                    folder.on_sub_task_ready();
                    if (folder.state === 'wait') {
                        folder.events.nex_task.call(folder);//执行下一个任务
                    }
                }

            }, burst_num,63).start();
        },

        /**
         * 添加文件夹上传任务
         * @param upload_plugin
         * @param files 子任务构造参数对象数组
         * @param attrs 文件夹构造参数对象
         * @param folder_size 文件夹总大小
         * @returns {*}
         */
        add_upload: function (upload_plugin, files, attrs, folder_size) {//添加上传对象
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
        add_upload: function (upload_plugin, files, attrs, response, folder_size, file_length) {//添加上传对象
	        View.showManageNum();
            attrs = $.extend(attrs, {'sub_cache_key': 'cache_key_' + random.random(), 'file_count': file_length});
            var folder = manager.add_upload(upload_plugin, files, attrs, folder_size);
            Cache.get_up_main_cache().is_contain_folder(true);
    
            switch (response.code) {
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
                    folder.change_state('error', response.text);
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
        add_resume: function (files, upload_plugin) { //断点续传
            $.each(files, function () {
                if (this.files && this.attrs) {
                    var files = this.files,
                        length = files.length,
                        size = 0;
                    $.each(files, function(i, file){
                        size += file.file_size;
                    });
                    action.add_upload(upload_plugin, files, this.attrs, {'code': 100}, size, length); //生成上传对象
                }
            });
        },
        /**
         * 添加剩下的子任务
         * @param upload_plugin
         * @param folder_id
         * @param files
         * @param response
         */
        add_sub_task: function(upload_plugin, folder_id, files, response){
            //c.log('add_sub_task:',folder_id, files);
            if(response === 'create_dir_error'){
                var folder = Cache.get_folder_by_id(folder_id);
                folder.can_not_re_start = true;
                folder.error_type = 'client';
                folder.get_queue().remove(folder.local_id);
                folder.change_state('error', 103);
                return;
            }
            else{
                manager.add_sub_task(upload_plugin, folder_id, files);
            }
            
        }
    };
    return action;
});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */


define.pack("./upload_plugin_start",["$","lib","common","disk","./upload_folder.loading","./upload_route","./select_folder.select_folder","./upload_file_validata.upload_folder_validata","./upload_file_validata.upload_file_check","./upload_plugin.upload_plugin","./upload_folder.get_up_folder_files","./upload_plugin.upload_plugin_folder","./tmpl","./upload_folder.upload_folder_appbox","./upload_folder.upload_folder_ie","./upload_files.upload_files_webkit","./upload_files.upload_files_ie"],function(require, exports, module) {
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


});/**
 * 上传控件入口, 选择使用哪种上传方式
 * @author svenzeng
 * @date 13-3-1
 */

define.pack("./upload_route",["$","lib","common","./tmpl","main","./tool.upload_cache","./upload_global_function","./Upload_class","./upload_plugin_start","./drag_upload_active","./upload_form_start","./upload_html5_start","./upload_html5","./upload_html5_pro_class","./upload_html5_pro","./upload_h5_flash","./upload_h5_flash_start","./offline_download.offline_download_class","./offline_download.offline_download_start","./offline_download.offline_download","./drag_upload_html5","./upload_folder.upload_folder_h5_start"],function(require, exports, module) {
	//基础库
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),
		random = lib.get('./random'),
		console = lib.get('./console').namespace('upload'),
		urls = common.get('./urls'),
		Module = common.get('./module'),
		constants = common.get('./constants'),
		functional = common.get('./util.functional'),
		reportMD = common.get('./report_md'),
		query_user = common.get('./query_user'),
		https_tool = common.get('./util.https_tool'),
		scr_reader_mode = common.get('./scr_reader_mode'),
		plugin_detect = common.get('./util.plugin_detect'),
		global_event = common.get('./global.global_event'),
		upload_event = global_event.namespace('upload2'),
		global_variable = common.get('./global.global_variable');

	//界面ui
	var tmpl = require('./tmpl'),
		main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		upload_dom = main_ui.get_$uploader(),
		upload_drop = main_ui.get_$upload_drop(),
		upload_files = upload_drop.find('[data-action="upload_files"]'),
		upload_folder = upload_drop.find('[data-action="upload_folder"]'),
		create_folder = upload_drop.find('[data-action="create_folder"]'),
		offline_download = upload_drop.find('[data-action="offline_download"]'),
		add_note = upload_drop.find('[data-action="add_note"]');

	//扩展模块
	var upload_cache = require('./tool.upload_cache'),
		global_function = require('./upload_global_function'),
		offline_download_start,
		offline_download_class;

	//私有变量
	var	cur_user = query_user.get_cached_user() || {},
		is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip(),
		is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
		is_ie = $.browser.msie,
		is_chrome = $.browser.chrome,
		is_safari = $.browser.safari,
		ua = navigator.userAgent.toLowerCase(),
		is_windows = ua.indexOf("windows") > -1 || ua.indexOf("win32") > -1,
		is_support_active = is_windows & !is_safari,
		IS_PLUGIN_DRAG = false,
		flash_init = false;

	//灰度用的变量
	var query = urls.parse_params(),
		cur_uin = query_user.get_uin_num();

	var is_support_html5_pro = function() {
		return window.FileReader;
	};

	var is_support_offline_download = function() {
		return window.FileReader && window.DataView;
	};

	var is_support_flash = function() {
		var flash_version = 10; //给一个默认值

		var hasFlash = function() {
			if($.browser.msie) {
				try {
					var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					if(swf) {
						var VSwf = swf.GetVariable("$version");
						flash_version = parseInt(VSwf.split(" ")[1].split(",")[0], 10);
						return true;
					}
				} catch(e) {}
			} else {
				var plugs = window.navigator.plugins;
				if(plugs && plugs.length > 0 && plugs['Shockwave Flash']) {
					flash_version = plugs['Shockwave Flash'].description.split('Shockwave Flash ')[1];
					flash_version = parseInt(flash_version, 10);
					return true;
				}
			}

			return false;
		}();

		if(!hasFlash) {
			console.log('flash not init');
		}

		//判断flash的版本是否小于10，小于10就降级为form上传
		if(flash_version < 10) {
			hasFlash = false;
			console.log('flash version:' + flash_version + ' no support upload file');
			//throw new Error('flash version no support upload file');
		}

		return function() {
			return hasFlash;
		};
	}();

	var detect_flash_env = function() {
		var defer = $.Deferred();
		var flash_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/club/qqdisk/web/FileUploader.swf?r=' + random.random() ,
			isIe = $.browser.msie && $.browser.version < 11,
			mode = 1,
			$flash = $(['<b class="icon_upload"></b><span id="uploadswf">', '<object id="swfFileUploader"' + (isIe ? '' : ' data="' + flash_url + '"') + ' style="width:' + 1 + 'px;height:' + 1 + 'px;left:0px;top:0px;position:absolute"' + (isIe ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + '>', isIe ? '<param name="movie" value="' + flash_url + '"/>' : '', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="wmode" value="transparent" />', '<param name="flashVars" value="callback=window.FileUploaderCallback&selectionMode=' + (mode === 1 ? 1 : 0) + '&buttonSkinURL=' + '"/>', '<param name="menu" value="false" />', '</object></span>'].join(''))
				.appendTo(document.body),
			timer;

		window.FileUploaderCallback = function(code, opt) {
			if(code == 0) {
				flash_init = true;
				console.log('flash env ok');
			} else {
				window.FileUploaderCallback = null;
				$flash.remove();
			}
			clearTimeout(timer);
			defer.resolve();
		};

		timer = setTimeout(function() {
			window.FileUploaderCallback = function() {};
			$flash.remove();
			defer.resolve();
		}, 3000);

		return defer;
	};

	var get_upload_plugin = function() {
		var plugins = {};
		var pluginsMap = [];

		//IE控件
		var get_active_plugin = function() {
			if(!is_support_active) {  // 控件不支持非windows，不支持safari（包括windows safari）
				throw new Error('unsupported system or browser');
			}

			var obj,
				version;

			//先加载新控件，新控件不存在再加载老控件，老控件也没有就没有了
			try {
				obj = new ActiveXObject("TXWYFTNActiveX.FTNUpload");
				require('./Upload_class');    //上传类        惰性加载
				require('./upload_plugin_start');    //开始上传之前的就绪工作
				require('./drag_upload_active');    //准备IE下拖拽上传

				// TODO 设一个标志位，来标志该拖拽上传方式是否可用
				IS_PLUGIN_DRAG = true;

				obj.OnEvent = global_function;
				obj.Upload_UseHttps = constants.IS_HTTPS ? true : false;
				//增加控件版本信息
				try {
					version = ', version:' + obj.Version;
					this.is_support_4g = plugin_detect.is_newest_version() ? true : false;//最新版本支持4G以上
				} catch(e) {
					version = '';
					this.is_support_4g = false;
				}
				console.debug('ActiveXObject plugin' + version);
				this.type = 'active_plugin';
				return obj;
			} catch(e) {
				throw new Error('ActiveXObject plugin init error');
			}
		};

		//appbox控件
		var get_webkit_plugin = function() {
			if(!is_support_active) {  // 控件不支持非windows，不支持safari（包括windows safari）
				throw new Error('unsupported system or browser');
			}

			if(window.external && window.external.UploadFile) {
				require('./Upload_class');    //上传类        惰性加载
				require('./upload_plugin_start');    //开始上传之前的就绪工作
				window.external.OnEvent = global_function;   //设置上传的client相关回调
				window.external.UseHttpsMode = constants.IS_HTTPS ? true : false;
				window.external.__type = 'webkit_plugin';
				console.debug('webkit_plugin plugin');
				this.type = 'webkit_plugin';
				return window.external;
			} else {
				throw new Error('webkit plugin init error');
			}
		};

		//表单上传，无进度
		var get_form = function() {
			var upload_btn = $('#_upload_html5_input').hide();
			upload_btn.next().hide();
			console.debug('form_plugin');
			this.type = 'upload_form';

			require('./Upload_class');
			require('./upload_form_start');
			var __random = random.random(),
				body = $('body');

			var form_up_url = https_tool.translate_cgi('http://diffsync.cgi.weiyun.com');
			var iframe = $('<iframe name=' + __random + ' id=' + __random + ' style="display:none;width:0px;height:0px;" tabindex="-1"></iframe>').appendTo(body);
			var form = $('<form method="post" action="' + form_up_url + '" target=' + __random + ' enctype="multipart/form-data"></form>');
			var container = $('<div class="uploads upload-form"><label for="_upload_form_input"><span class="btn btn-l btn-upload"><i class="icon icon-add"></i><span class="btn-txt">上传</span></span></label></div>');
			var input = $('<input id="_upload_form_input" name="file" type="file" class="ui-file" aria-label="上传文件，按空格选择文件。" style="display: none;"/>');
			input.appendTo(container);
			container.appendTo(form);
			form.appendTo(upload_dom);

			if(is_support_active) {
				var install_plugin = $('<a href="' + (is_ie ? 'http://imgcache.qq.com/club/qqdisk/web/data/TencentWeiYunActiveXInstall.exe' : 'http://imgcache.qq.com/club/qqdisk/web/data/WeiYunWebKitPlugin.exe') + '" onclick="this.setAttribute(\'aria-label\', \'' + (is_ie ? '您可能需要重新启动浏览器访问微云，并聚焦到运行加载项菜单来启用控件。' : (is_chrome ? '您可能需要按下Ctrl+J键打开下载内容页运行安装程序' : '')) + '\')" target="_blank" tabindex="0" aria-label="当前上传方式成功率较低，点击下载安装更稳定的极速上传控件。完成后需要重新启动浏览器。" style="position:absolute;top:-500px;">&nbsp;</a>');
				upload_dom.before(install_plugin);
			}

			var parentNode = form.find('div');

			var send = function(param) {
				for(var key in param) {
					$('<input class="j-upload-form-value" type="hidden">').attr('name', key).val(param[ key ]).appendTo(parentNode);
				}
				try {
					form.submit();
				} catch(e) {
					//选个几G的文件就会进入这里，因为JQuery会报“计算结果超过32位”的错误
					setTimeout(function() {
						upload_cache.get_curr_real_upload().change_state('error', 1029);
					}, 0);
				}
			};

			var reset = function() {
				//触发后重置表单
				if(form[0] && form[0].reset) {
					form[0].reset();
				}
			};

			var destory = function() {
				parentNode.find('.j-upload-form-value').remove();
			};

			var get_path = function() {
				return $('.ui-file').val();
			};

			var change_fn,
				change = function(fn) {
					change_fn = fn;
				};

			input.on('change', function() {
				if(!change_fn) {
					return;
				}
				change_fn();
			});

			return {
				send: send,
				reset: reset,
				destory: destory,
				form: form,
				change: change,
				get_path: get_path
			};
		};

		var get_html5 = function() {
			//检查是否允许使用HTML5，暂不支持https
			if(window.FileReader && !$.browser.mozilla && !constants.IS_HTTPS) {
				require('./Upload_class');
				require('./upload_html5_start');
				var upload_obj = require('./upload_html5');
				this.type = 'upload_html5';
				console.debug('html5_plugin');
				return upload_obj;
			} else {
				throw "not support html5 upload";
			}
		};

		var get_html5_pro = function() {
			//检查是否允许使用HTML5
			if (window.FileReader && window.Worker) {
				this.type = 'upload_html5_pro';
				require('./Upload_class');
				require('./upload_html5_pro_class');
				var uploadObj = require('./upload_html5_pro');
				console.debug('get html5 pro plugin success');
				return uploadObj;
			} else {
				throw "not support html5 upload";
			}
		};

		var get_h5_flash = function() {
			//检查是否允许使用HTML5
			if(window.FileReader) {
				if(is_support_flash() && flash_init) {
					this.type = 'upload_h5_flash';
					require('./Upload_class');
					var upload_obj = require('./upload_h5_flash');
					require('./upload_h5_flash_start');
					console.debug('h5_flash_plugin');
					return upload_obj;
				} else {
					throw "not support flash + html5 upload";
				}
			} else {
				throw "not support html5 upload";
			}
		};

		plugins = {
			get_active_plugin: get_active_plugin,
			get_webkit_plugin: get_webkit_plugin,
			get_html5_pro: get_html5_pro,
			get_h5_flash: get_h5_flash,
			get_html5: get_html5,
			get_form: get_form
		};

		//用map控制加载优先级
		if(constants.IS_APPBOX) {
			pluginsMap = ['get_webkit_plugin'];
		} else if(query.upload !== 'plugin') {
			pluginsMap = ['get_active_plugin', 'get_html5_pro' ,'get_h5_flash', 'get_html5', 'get_form'];
		} else {
			pluginsMap = ['get_active_plugin', 'get_h5_flash', 'get_html5', 'get_form'];
		}

		//内核统计
		if($.browser.chrome) {
			if(constants.IS_APPBOX) {
				reportMD(277000034, 177000168); //appbox
			} else {
				reportMD(277000034, 177000167); //chrome webkit
			}
		} else {
			if(is_support_html5_pro()) {
				reportMD(277000034, 178000366); //非 webkit 支持 html5 极速上传
			} else {
				reportMD(277000034, 177000169); //非 webkit
			}
		}

		return functional.getSingle(function() {
			for(var i= 0, len=pluginsMap.length; i<len; i++) {
				try {
					if(pluginsMap[i] && plugins[ pluginsMap[i] ]) {
						return plugins[ pluginsMap[i] ].call(this);
					}
				} catch(e) {}
			}
		});
	}();

	var get_offline_download_plugin = function() {
		if(is_support_offline_download()) {
			var offline_download_obj;
			offline_download_class = require('./offline_download.offline_download_class');
			offline_download_start = require('./offline_download.offline_download_start');
			offline_download_obj = require('./offline_download.offline_download');
			offline_download_start.init();
			console.debug('get offline download plugin success');
			return offline_download_obj;
		} else {
			console.debug('not support offline download');
			return false;
		}
	};

	var upload = new Module('upload', {
		//初始化上传入口
		render: function() {
			var self = this;
			if(is_support_html5_pro()) {
				self.init_upload_plugin();
			} else {
				detect_flash_env().done(function() {
					self.init_upload_plugin();
				}).fail(function() {
				});
			}
		},

		init_upload_plugin: function() {
			var self = this;
			//加载上传控件
			self.upload_plugin = get_upload_plugin.call(self);
			//加载离线下载控件
			//if(query.offline || parseInt(cur_uin) % 10 < 5) {
			self.offline_download_plugin = get_offline_download_plugin.call(self);

			//判断是否安装了支持拖拽上传的控件
			//todo:ie下有问题，不能加载html5的拖曳上传
			if(IS_PLUGIN_DRAG === false && !is_ie && !constants.IS_APPBOX && window.FileReader) {
				require('./drag_upload_html5');
			}

			//区分上传到网盘还是中转站，中转站已下线 normal / temporary
			global_variable.set('upload_file_type', 'normal');

			/*
			 * 监听选择框上传按钮事件
			 */
			if(self.type === 'active_plugin') {
				var upload_btn = $('#_upload_html5_input');
				upload_btn.off('click').on('click', function(e) {
					e.preventDefault();
					upload_event.trigger('start_upload', self.upload_plugin);
				});
			} else if(self.type === 'upload_html5_pro') {
			}
			//上传文件
			upload_files.off('click').on('click', function(e) {
				e.preventDefault();
				//每次点击按钮都会重新生成dom（为了重置change事件），所以这里每次都要重新取dom
				var upload_btn = (self.type === 'upload_form' ? $('#_upload_form_input') : $('#_upload_html5_input'));
				upload_btn && upload_btn.click && upload_btn.click();
			});
			//上传文件夹(h5)
			upload_folder.on('click', function(e) {
				e.preventDefault();
				require('./upload_folder.upload_folder_h5_start').on_select();
			});
			//新建文件夹
			create_folder.on('click', function(e) {
				e.preventDefault();
				//先触发个事件，关闭任务管理器
				global_event.trigger('before_create_folder');
				var main_main = main_mod.get('./main');
				if(main_main.get_cur_mod_alias() === "disk") {
					//需要做个延时才不会跟before_create_folder的ui操作冲突，导致新建icon显示不出来
					setTimeout(function() {
						global_event.trigger('create_folder');
					}, 500);
				} else {
					main_main.async_render_module('disk', { create_folder: true });
				}
			});
			//离线下载
			var offline_download_lock = false;
			offline_download.on('click', function(e) {
				e.preventDefault();
				if(offline_download_lock) {
					return;
				}
				offline_download_lock = true;
				offline_download_start.start();
				setTimeout(function() {
					offline_download_lock = false;
				}, 1000);
			});
			//添加笔记
			add_note.on('click', function(e) {
				e.preventDefault();
				//先触发个事件，关闭任务管理器
				global_event.trigger('before_add_note');
				var main_main = main_mod.get('./main');
				if(main_main.get_cur_mod_alias() === "note") {
					global_event.trigger('add_note');
				} else {
					main_main.async_render_module('note', { add_note: true });
				}
			});
			//下拉菜单
			upload_files.show();
			self.offline_download_plugin && offline_download.show();
			(self.type === 'upload_form' || is_ie || is_safari) ? upload_folder.hide() : upload_folder.show();
			create_folder.show();
			//异步加载笔记
			require.async('note');
			add_note.show();

			self.trigger('render');
		},

		/**
		 * 获取根目录名称  库2.0为微云，老微云为 网盘
		 * @returns {String}
		 */
		get_root_name: function() {
			if(!this.root_name) {
				this.root_name = '微云';
			}
			return this.root_name;
		},

		/**
		 * 聚焦到上传按钮
		 */
		focus_upload_button: function() {
			upload_dom.focus();
		},

		is_support_flash: function() {
			return is_support_flash() && flash_init;
		},

		is_support_html5_pro: is_support_html5_pro,

		is_support_offline_download: is_support_offline_download
	});

	module.exports = upload;
});



/**
 * 上传控件上面的小黄条tips
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./upload_tips",["common","$","./upload_route","./tool.upload_cache"],function (require, exports, module) {

    var common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Cache = require('./tool.upload_cache'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        mini_holding_tip = common.get('./ui.mini_holding_tip'),

        ie = $.browser.msie,
        safari = $.browser.safari,
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        install_tip_options = (function () {
            if(constants.IS_APPBOX){
                return {
                    msgText: '当前的上传方式成功率较低，建议安装最新版的QQ，上传更稳定并支持查看进度。',
                    linkBtnHref: 'http://im.qq.com/qq/',
                    linkBtnTarget: '_blank',
                    linkBtnText: '立即安装'
                };
            }
            var href, wording;
            if (safari || !gbIsWin) {//非safari，window 显示插件安装
                href = 'http://www.adobe.com/go/getflashplayer';
                wording = 'Flash';
            } else {
                href = 'http://www.weiyun.com/plugin_install.html' ;
                wording = '极速上传';
            }

            return {
                msgText: '当前的上传方式成功率较低，建议安装' + wording + '控件，更稳定并支持查看进度。',
                linkBtnHref: href,
                linkBtnTarget: '_blank',
                linkBtnText: '立即安装'
            };
        })();

    var stack = [
        /**
         *1:表单上传时，判断是否显示小黄条
         *2:条件 form，总数小于7条;
         */
        function () {
            if (upload_route.type === 'upload_form' && Cache.length() < 7) {//显示提示信息
                mini_holding_tip.show($.extend(install_tip_options, {priority: 10}));
            }
        }
    ];
    return {
        public_tip: function () {
            $.each(stack, function () {
                this();
            });
        }
    }
});/**
 * 上传控件UI
 * 改造思路 拆分：
 *      1：区分方法类型 静态，原型（状态类，工具类）,$dom方法 (已完成)
 *      2：缩短调用原型链接(todo)
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./view",["lib","common","$","main","./upload_route","./tmpl","./upload_tips","./tool.upload_static","./tool.upload_cache","./event","./tool.bar_info","./view_type.empty","./view_type.folder","./view_type.webkit_down","./view_type.offline_download"],function(require, exports, module) {

	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),

		console = lib.get('./console').namespace('upload_view'),
		text = lib.get('./text'),

		functional = common.get('./util.functional'),
		constants = common.get('./constants'),
		Module = common.get('./module'),
		file_type_map = common.get('./file.file_type_map'),
		global_event = common.get('./global.global_event'),
		search_event = global_event.namespace('search'),
		query_user = common.get('./query_user'),
		File = common.get('./file.file_object'),
		widgets = common.get('./ui.widgets'),

		main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		main = main_mod.get('./main'),
		space_info = main_mod.get('./space_info.space_info'),

		upload_route = require('./upload_route'),
		tmpl = require('./tmpl'),
		upload_tips = require('./upload_tips'),
		upload_static = require('./tool.upload_static'),
		upload_cache = require('./tool.upload_cache'),
		event = require('./event'),
		bar_info,

		$box = main_ui.get_$body_box(),
		$content = main_ui.get_$main_content(),
		ie6 = $.browser.msie && $.browser.version < 7,
		lt_ie9 = $.browser.msie && $.browser.version < 9, //ie6,7,8
		position = 'absolute',

		make_wrap = function() {
			return {//性能优化 面板中的wrap对象
				_wrap_id_prefix: 'upload_row_wrap_', //管理器中，列的包装对象ID前缀
				_visable_index: 1,//当前可见索引ID
				set_visable_index: function(index) {//设置可见索引ID
					this._visable_index = index;
				},
				get_visable_index: function() {//获取可见索引ID
					return this._visable_index;
				},
				batch: 30,//每个显示区域显示的总数
				current: 0//当前最大显示区域索引ID
			};
		},
		dom_cache = { length: 0 },//view instance ，映射 upload_obj对象的集合; 加上这一层用于 分开 dom对象 和 内存对象
		instance_wrap = make_wrap(),
		row_id_prefix = 'upload_row_',//管理器中，列ID前缀
		default_height = 61,//默认行高
		error_height = 61,//出错时的行高
		experienceDuration = 30;//极速上传体验时间

	if(!constants.IS_APPBOX) {//web才有控件安装样式
		require.async('upload_install_css');//加载控件安装样式  该样式依赖upbox_css 因此必须再它之后加载
	}

	// 文本长度略缩计算相关
	var measurer, separator_width, ellipsis_width;

	var view = new Module('upload2_view', {
		/**
		 * 使用position absolute定位 ，需要重置窗口位置
		 */
		on_window_scroll: function() {
			if(this.is_show() && ie6) {
				var height = this.$dom.height(),
					real_top = ( this._win_visable_height + $(window).scrollTop() - height ) - 3;
				this.$dom.css('top', (real_top + 'px'));
				// 当有影响定位的情况发生时，关掉浮动TIP
				this.hide_float_tips();
			}
		},
		// 现在的方法定义有些问题，下面定义的hide_float_tips在第一次render时还没添加上
		hide_float_tips: $.noop,
		/**
		 * 窗口重置时，修改可见高度，并触发视图的窗口滚动处理
		 */
		on_window_resize: function() {
			this._win_visable_height = window.innerHeight && !$.browser.msie ? window.innerHeight : document.documentElement.clientHeight;//可视高度
			this.on_window_scroll();
			this.hide_float_tips();
		},
		/**
		 * 是否显示中
		 */
		is_show: function() {
			return this._is_show;
		},
		/**
		 * 上传管理器最大化
		 */
		max: function() {
			this._is_show = true;
			this._currentDom = $box.children(':visible').hide();//隐藏当前的模块
			this._currentBar = main_ui.get_$bar0().children(':visible').hide();//隐藏当前的操作栏
			this._currentTab = main_ui._get_$nav().find('[data-mod][class=cur]').removeClass('cur');//关闭tab选中态
			this.manage_toggle.addClass('act');
			this.$dom.show();
			this.on_window_scroll();
			this.on_done_reset_scroll(0, true);
			if(!bar_info.is_done()) {
				this.on_box_change_scroll(true);
			}
			global_event.trigger('manage_toggle', 'show');
		},
		/**
		 * 上传管理器最小化
		 */
		min: function() {
			if(!this.is_show()) {//避免重复调用
				return;
			}
			this._is_show = false;
			this._currentDom.show();
			this._currentBar.show();
			this._currentTab.addClass('cur');
			this.manage_toggle.removeClass('act');
			this.$dom.hide();
			this.on_window_scroll();
			global_event.trigger('manage_toggle', 'hide');
		},
		clear: function(group) {
			var group_box = view[group + '_box'],
				group_dom = view[group + '_files'];
			if(group !== 'complete') {
				instance_wrap = make_wrap();
			}
			group_box && group_box.hide();
			group_dom && group_dom.empty();
		},
		render: function() {
			var me = this;
			me.$dom = $(tmpl.box()).appendTo($box);//上传主面板
			me.empty_box = me.$dom.find('.j-upload-empty');//空内容
			me.process_box = me.$dom.find('.j-process-group');//上传中文件
			me.process_files = me.$dom.find('ul.j-process-list');//上传中文件列表
			me.process_count = me.process_box.find('.j-process-count');//剩余上传文件数
			me.complete_box = me.$dom.find('.j-complete-group');//已上传文件
			me.complete_files = me.$dom.find('ul.j-complete-list');//已上传文件列表
			me.complete_count = me.complete_box.find('.j-complete-count');//已上传文件数
			me.manage_toggle = main_ui.get_$manage();//折叠按钮
			//极速上传相关ui
			me.speedup = me.$dom.find('.j-upbox-speedup').show();//极速上传信息
			me.speedup_novip = me.$dom.find('.j-novip-inner');//非会员显示的信息
			me.speedup_active = me.$dom.find('.j-vip-inner');//“加速中”外显
			me.speedup_vip = me.$dom.find('[data-upload="speedup_vip"]');//开通会员
			me.speedup_try = me.$dom.find('[data-upload="speedup_try"]');//试用极速上传
			me.speedup_remain = me.speedup_novip.find('.j-speedup-try-num');//体验倒计时

            me.capacity_vip = me.$dom.find('[data-upload="capacity_vip"]');//开通会员 - 上传容量受限
			// 顶部浮动条关闭按钮
			me.$dom.find('.j-tips-close').on('click', function(e) {
                $(this).closest('span.tips').hide();
			});

			//支持极速上传的浏览器，非会员显示引导信息，会员用户，开通按钮改成续费会员
			var user = query_user.get_cached_user() || {};
			me.speedup_vip.text(user.is_weiyun_vip() ? '续费会员' : '开通会员');
			if (upload_route.type === 'upload_html5_pro' && user.is_weiyun_vip && !user.is_weiyun_vip()) {
				upload_static.get_coupon_info().done(function (result) {
					//有体验券就显示试用入口
					console.log('upload_html5_pro coupon count: ' + result.coupon_count + (result.experience_duration ? (', experience_duration: ' + result.experience_duration) : ''));
					if(result.experience_duration) {
						experienceDuration = result.experience_duration;
					}
					//初始化时不显示入口，所以默认隐藏
					me.can_experience = false;
					//非appbox长驻开通会员入口
					if(!constants.IS_APPBOX) {
						me.showSpeedup();
					}
					//有体验券时，变更me.can_experience的状态
					if(result.coupon_count > 0) {
						me.can_experience = true;
						setTimeout(function() {
							window.pvClickSend && window.pvClickSend('weiyun.speedup.try.display');
						}, 1000);
					}
					setTimeout(function() {
						window.pvClickSend && window.pvClickSend('weiyun.speedup.vip.display');
					}, 1000);
				}).fail(function() {});
			} else {
				console.log('upload_html5_pro hide entrance, upload_route.type: ' + upload_route.type + ', is_weiyun_vip: ' + (user.is_weiyun_vip ? !!user.is_weiyun_vip() : 'no function'));
			}

			(bar_info = require('./tool.bar_info')).init(
				{//上传信息条构造参数
					'$empty_box': me.empty_box,
					'$process_box': me.process_box,
					'$process_files': me.process_files,
					'$process_count': me.process_count,
					'$complete_box': me.complete_box,
					'$complete_files': me.complete_files,
					'$complete_count': me.complete_count,
					'$manage_icon': me.manage_toggle.find('.j-manage-icon'),
					'$manage_num': me.manage_toggle.find('.j-manage-num')
				}
			);
			me.clear_process = me.$dom.find('[data-upload=clear_process]');//全部清除按钮
			me.clear_complete = me.$dom.find('[data-upload=clear_complete]');//全部清除按钮

			event.init.call(me);
			me.$dom.css('position', position);
			me.min();//初始化为最小状态
			// 计算
			measurer = text.create_measurer(me.upbox_tips);
			separator_width = measurer.measure('\\').width;
			ellipsis_width = measurer.measure('...').width;

			/**
			 * 监听搜索框
			 * 如果开始搜索，那么隐藏任务管理器
			 */
			search_event.off('before_search_begin').on('before_search_begin', function () {
				main_ui.get_$body_hd().show();
				me._is_show = false;
				me.$dom.hide();
			});

			//切换tab时隐藏任务管理器
			me.listenTo(main_ui, 'before_activate_sub_module', function() {
				main_ui.get_$body_hd().show();
				me._is_show = false;
				me.$dom.hide();
			});

			//新建文件夹时隐藏任务管理器
			me.listenTo(global_event, 'before_create_folder', function() {
				main_ui.get_$body_hd().show();
				me._is_show = false;
				me.$dom.hide();
			});

			//新建笔记时隐藏任务管理器
			me.listenTo(global_event, 'before_add_note', function() {
				main_ui.get_$body_hd().show();
				me._is_show = false;
				me.$dom.hide();
			});
		}
	});

	view.render();

	/**
	 * 静态方法
	 */
	$.extend(view, {
		/**
		 * 上传管理器，当前列表的长度   called by public_tip
		 */
		length: function() {
			return upload_cache.get_up_main_cache().get_all_length() + upload_cache.get_dw_main_cache().get_all_length() + upload_cache.get_od_main_cache().get_all_length();
		},
		/**
		 * @param time  0: 上传时间归零； 存在的时间：上传时间设置为这个时间； 不存在的数据，并且不为0：返回上传时间
		 */
		upload_start_time: function(time) {
			if(time === 0) {
				this._upload_start_time = 0; //归零
			} else if(time) {
				this._upload_start_time = time;//设置上传开始时间
			} else {
				return this._upload_start_time;//返回上传开始时间
			}
		},
		/**
		 * @param clear
		 */
		upload_end_time: function(clear) {
			if(clear) {
				this._upload_end_time = 0; //归零
			} else {
				return this._upload_end_time || (this._upload_end_time = +new Date());//返回结束开始时间
			}
		},
		/**
		 * 显示上传列表
		 */
		show: function() {   //强制显示
			var me = this;
			if(!me.is_show()) {
				main_ui.get_$body_hd().hide();
				me.on_window_resize();//重置上传管理器位置
				me.listenTo(global_event, 'window_resize', me.on_window_resize)//窗口resize时，设置上传管理器的定位位置
					.listenTo(global_event, 'window_scroll', me.on_window_scroll);//滚动时，设置上传管理器的定位位置
				me.max();
			}
		},
		/**
		 * 上传管理器隐藏
		 */
		hide: function() {
			var me = this;
			main_ui.get_$body_hd().show();
			me.off(global_event, 'window_resize').off(global_event, 'window_scroll');
			me.refresh_space_info();//刷新网盘空间大小
			me.min();//关闭上传管理器之前，将其最小化
		},
		/**
		 * 显示小红点动画
		 */
		showManageNum: function() {
			main_ui.show_manage_num();
		},
		/**
		 * 显示极速体验入口
		 */
		showExperience: function () {
			if(this.can_experience) {
				this.speedup_try.css('visibility', 'visible');
			}
		},
		/**
		 * 隐藏极速体验入口
		 */
		hideExperience: function (can_experience) {
			if(typeof can_experience !== 'undefined') {
				this.can_experience = can_experience;
			}
			this.speedup_try.css('visibility', 'hidden');
		},
		/**
		 * 显示极速上传icon tips
		 * onlyChange: 只改变内部的ui状态，不变更tips的显示，tips的显示统一在bar_info里控制
		 */
		showSpeedup: function(onlyChange) {
			var me = this;
			var user = query_user.get_cached_user() || {};
			var curr_upload = upload_cache.get_curr_real_upload && upload_cache.get_curr_real_upload();
			var is_webkit_plugin = curr_upload ? curr_upload.upload_plugin ? curr_upload.upload_plugin.__type === 'webkit_plugin' : false : false;
			//必须是极速上传，并且不是appbox的拖曳上传才显示icon
			//appbox虽然加载的是极速上传控件，但拖曳上传用的还是webkit_plugin
			if(upload_route.type === 'upload_html5_pro' && !is_webkit_plugin) {
				if(user.is_weiyun_vip && user.is_weiyun_vip()) {
					me.speedup_novip.hide();
					me.speedup_active.show();
				} else if(me.experience) {
					me.speedup_active.hide();
					me.speedup_novip.show();
				} else {
					me.speedup_active.hide();
					me.speedup_novip.hide();
				}
				if(me.can_experience) {
					me.speedup_try.show();
				} else {
					me.speedup_try.hide();
				}
				if(!onlyChange) {
					me.speedup.show();
				}
			}
		},
		/**
		 * 隐藏极速上传icon tips
		 */
		hideSpeedup: function() {
			var me = this;
			me.speedup_active.hide();
			me.speedup_novip.hide();
			me.speedup_try.show();
			me.speedup.hide();
		},
		/**
		 * 极速上传体验倒计时
		 */
		remainSpeedup: function() {
			var defer = $.Deferred();
			var me = this;
			var remain = experienceDuration;
			me.speedup_remain.html(remain);
			me.experience = true;
			me.showSpeedup(true);
			me.hideExperience();
			me.experienceInterval = setInterval(function() {
				if(remain > 0) {
					remain--;
					me.speedup_remain.html(remain);
				} else {
					me.experience = false;
					me.showSpeedup(true);//显示非加速时的引导信息
					clearInterval(me.experienceInterval);
					defer.resolve();
				}
			}, 1000);

			return defer;
		},
		/**
		 * 清除倒计时
		 */
		remainClear: function() {
			var me = this;
			clearInterval(me.experienceInterval);
			me.experience = false;
			me.showSpeedup(true);//显示非加速时的引导信息
		},
		/**
		 * 设置 完成按钮 样式
		 * @param is_done
		 * @param text
		 */
		set_end_btn_style: function(is_done, text) {
			if(!is_done) {
				view.$all_time.hide();
			}

			view.clear_process.html(text).removeClass('g-btn-blue').removeClass('g-btn-gray').addClass(text === '<span class="btn-inner">完成</span>' ? 'g-btn-blue' :
				'g-btn-gray');
		},
		/**
		 * 获取上传对象
		 * @param v_id
		 * @returns {*}
		 */
		get_upload_obj: function(v_id) {
			return dom_cache[ v_id ] && dom_cache[ v_id ].upload_obj;
		},
		/**
		 * 获取上传对象
		 * @param v_id
		 * @returns {*}
		 */
		get_task: function(v_id) {
			return dom_cache[ v_id ] && dom_cache[ v_id ].task;
		},
		/**
		 * 截取文件名显示
		 * @param file_name
		 * @returns {*}
		 */
		//全中文40
		revise_file_name: function(file_name) {
			// file_name
			return file_name.length > 40 ? [ file_name.substring(0, 14), '...', file_name.substring(file_name.length - 25) ].join('') : file_name;
		},
		compact_file_path: function(path) {
			// 示例路径： F:\tmp\测试一个名字很长很长的目录\看看它在地址栏如何处理的，特别是当完全无法显示全的时候\testwwwwwwwwwwwwwwwwwwwww.txt
			// 保留盘符，保留后缀（最后7字符？）
			var separator = '\\';
			var paths = path.split(separator);
			var disk = paths[0], file = paths[paths.length - 1];
			var tail = file.slice(-8);
			file = file.slice(0, -8);
			return disk + separator +
				text.compact_paths(paths.slice(1, paths.length - 1).concat(file), {
					totalWidth: 270 - measurer.measure(disk + separator + separator + tail).width,
					keepFirstDirectoryNum: 1,
					keepLastDirectoryNum: 2,
					ellipsisPathWidth: 70,
					separatorWidth: separator_width,
					hidePathWidth: ellipsis_width
				}, measurer).join(separator) +
				tail;
		},
		cur_start_vid: 1,//当前正在执行的任务vid
		/**
		 * 上传完一个文件后，重置滚动条位置
		 * @param {int} [v_id]
		 * @param {boolean} [force] 强制定位
		 * todo: process/complete
		 */
		on_done_reset_scroll: function(v_id, force) {
			var me = this;
			if(bar_info.is_done()) {
				return;
			}
			// bug fix
			// 当任务移动到已完成列表中，抛出scroll事件，重新规划可见区域
			me.$dom.trigger('scroll.upload');
		},
		/**
		 * 滚动时，监视区域显示的逻辑
		 * @param {boolean} [force]
		 * todo: process/complete
		 */
		on_box_change_scroll: function(force) {
			var top = $content.scrollTop() + $(document).height(),//得出位置，显示对应的区块
				k = 1,
				c_height = 0;
			while(instance_wrap[k]) {
				c_height += instance_wrap[k].height;
				if(c_height > top) {//结束遍历
					if(force || k !== instance_wrap.get_visable_index()) {//这块区域已经不是当前的中心区域时，才处理显示逻辑
						instance_wrap.set_visable_index(k);
						var refer1 = k + 2 , refer2 = k - 2 , m = 1;
						while(instance_wrap[m]) {
							if(m === k || (m <= refer1 && m >= refer2)) {
								$('#' + instance_wrap[m].id).css('visibility', 'visible');//将与自己邻居的区域和自己都显示出来
							} else {
								$('#' + instance_wrap[m].id).css('visibility', 'hidden');//将自己显示处理
							}
							m += 1;
						}
					}
					return;
				}
				k += 1;
			}
		},
		/**
		 * 刷新容量信息  全部清空 和 完成的时候，刷新容量
		 */
		refresh_space_info: function() {
			setTimeout(function() {
				space_info.refresh();//刷新空间存储信息
			}, 2000);
		},
		before_hander_click: function(action) {
		},
		/**
		 * 手动删除上传任务后，更新上传管理器公用信息
		 * @param action 动作
		 */
		after_hander_click: function(action) {
			switch(action) {
				case('click_cancel'):
					//上传-下载管理器中没有 元素后，促发全部清理操作
					if(0 === upload_cache.get_up_main_cache().cache.length + upload_cache.get_dw_main_cache().cache.length + upload_cache.get_od_main_cache().cache.length) {//上传管理器中没有 元素后，促发全部清理操作
						upload_static.dom_events.click_clear_process();
					}
					break;
			}
			if(!bar_info.is_done()) {
				this.on_box_change_scroll(true);
			}
		},
		unregister_float_tip: function(hide_handler) {
			var handlers = this._float_tip_handlers || [];
			handlers.splice($.inArray(hide_handler, handlers), 1);
		},
		register_float_tip: function(hide_handler) {
			var me = this;
			(me._float_tip_handlers = me._float_tip_handlers || []).push(hide_handler);
			if(!me._scroll_tip_reset_hook) {
				me._scroll_tip_reset_hook = true;
			}
		},
		// 隐藏所有浮动的TIP
		hide_float_tips: function() {
			var handlers = this._float_tip_handlers;
			if(handlers && handlers.length) {
				$.each(handlers, function(index, hide_handler) {
					hide_handler();
				});
				this._float_tip_handlers = [];
			}
		},
		_get_errors_tip: function() {
			var $dom = this.$errors_tip;
			if(!$dom) {
				$dom = this.$errors_tip = $(tmpl.err_pop()).appendTo(this.$dom).hide();
			}
			return $dom;
		},
		show_errors: function($dom, errors, direction) {
			return this.show_errors_tip($dom, tmpl.folder_errors(errors), errors, direction);
		},
		/**
		 * 在何处显示Tip
		 * @param {jQuery Element} $dom
		 * @param {String} html
		 * @param {String} direction (optional) TIP相对于$dom的显示位置，可以为above或under，默认为above。
		 */
		show_errors_tip: function($dom, html, errors) {
			var dialog = new widgets.Dialog({
				klass: 'full-pop-small failtask-pop',
				title: '有' + errors.length + '个文件上传失败',
				destroy_on_hide: true,
				content: html,
				buttons: [
					{ id: 'OK', text: '完成', klass: 'g-btn-blue', disabled: false, visible: true }
				],
				handlers: {
					OK: function () {
						dialog.hide();
					}
				}
			});
			dialog.show();
		}
	});

	view.refresh_space_info = functional.throttle(view.refresh_space_info, 1000);

	// 坐标计算相关接口
	var position_util = {
//        fix_margin : function($dom, offset){
//            return this.add(offset, { // 修正jQuery position未计算目标margin的问题
//                left : parseInt($dom.css('margin-left'), 10) || 0,
//                top : parseInt($dom.css('margin-top'), 10) || 0
//            });
//        },
		// 取得目标DOM的某个部位的相对坐标
		// 例如下中心的坐标就是 [width/2, height]
		// 共有9组合： [l,c,r] * [t,c,b]
		of: function($dom, place) {
			var x_place = place.charAt(0),
				y_place = place.charAt(1),
				width = $dom.outerWidth(),
				height = $dom.outerHeight(),
				x, y;
			switch(x_place) {
				case 'l':
					x = 0;
					break;
				case 'c':
					x = width / 2;
					break;
				case 'r':
					x = width;
					break;
			}
			switch(y_place) {
				case 't':
					y = 0;
					break;
				case 'c':
					y = height / 2;
					break;
				case 'b':
					y = height;
					break;
			}
			return {
				left: x,
				top: y
			};
		},
		add: function(offset1, offset2) {
			return {
				left: offset1.left + offset2.left,
				top: offset1.top + offset2.top
			};
		},
		sub: function(offset1, offset2) {
			return {
				left: offset1.left - offset2.left,
				top: offset1.top - offset2.top
			};
		}
	};

	var View_instance = function() {
		this.state = null;
		this.file_sign_update_process = functional.throttle(this.file_sign_update_process, 500);//文件扫描
		this.upload_file_update_process = functional.throttle(this.upload_file_update_process, 1000);//上传进度更新
		this.processing && (this.processing = functional.throttle(this.processing, 1000));//下载进度更新
	};

	/**
	 * 原型方法： view对象与$dom对象的桥梁
	 */
	$.extend(View_instance.prototype, {
		clear_soft_link: function() {
			this._$dom = null;
			this._msg = null;
			this._remain = null;
			this._speed = null;
			this._file_size = null;
			this._delete = null;
			this._click = null;
			this._percent_face = null;
			this._miaoc = null;
			this._error_msg = null;
			this._up4g = null;
			this._process = null;
			this._complete = null;
		},
		get_upload_obj: function() {//上传对象
			var cache = dom_cache[ this.v_id ];
			return cache && cache.upload_obj || {};
		},
		get_task: function() {//上传对象
			var cache = dom_cache[ this.v_id ];
			return cache && cache.task || {};
		},
		get_dom: function(id) {//jQuery(dom对象)
			return this._$dom || (this._$dom = $('#' + row_id_prefix + (id || this.v_id)));
		},
		get_msg: function() {//上传状态提示消息
			return this._msg || (this._msg = this.get_dom().find('.j-upload-state-text'));
		},
		get_remain: function() {//剩余时间
			return this._remain || (this._remain = this.get_dom().find('.j-upload-remain-time'));
		},
		get_speed: function() {//上传速度
			return this._speed || (this._speed = this.get_dom().find('.j-upload-speed'));
		},
		get_file_size: function() {//文件大小
			return this._file_size || (this._file_size = this.get_dom().find('.j-upload-data-size'));
		},
		get_delete: function() {//删除
			return this._delete || (this._delete = this.get_dom().find('.j-upload-cancel'));
		},
		get_click: function() {//暂停/续传对象
			return this._click || (this._click = this.get_dom().find('.j-upload-switch'));
		},
		get_percent_face: function() {//样式进度
			return this._percent_face || (this._percent_face = this.get_dom().find('.j-upload-mask'));
		},
		get_miaoc: function() {
			return this._miaoc || (this._miaoc = this.get_dom().find('.upbox-success-text'));
		},
		get_error_msg: function() {//单任务的提示信息
			return this._error_msg || (this._error_msg = this.get_dom().find('.j-upload-error'));
		},
		get_up4g: function() {
			return this._up4g || (this._up4g = this.get_dom().find('.up4g'));
		},
		get_dest: function() { //目的地
			return this._dest || (this._dest = this.get_dom().find('.j-upload-path'));
		},
		get_process: function() {
			return this._process || (this._process = $('.j-process-list'));
		},
		get_complete: function() {
			return this._complete || (this._complete = $('.j-complete-list'));
		},

        //顶部tips切换相关ui
        get_top_tips_capacity_purchase: function () {
			return this._top_tips_capacity_purchase || (this._top_tips_capacity_purchase = $('.j-capacity-purchase-a'));
        },
        get_top_tips_speedup_vip: function () {
            return this._top_tips_speedup_vip || (this._top_tips_speedup_vip = $('.j-speedup-vip-span'));
        },
		get_top_tips_capacity_vip: function () {
            return this._top_tips_capacity_vip || (this._top_tips_capacity_vip = $('.j-capacity-vip-span'));
        }
	});
	/**
	 * 原型方法 ：通用方法
	 */
	$.extend(View_instance.prototype, {
		is_exist: function() {
			return this.v_id !== 0 && !!dom_cache[this.v_id] && !!this.get_upload_obj();
		},
		/**
		 * 变更对应wrap的高度;
		 * @param {String} state
		 */
		change_$wrap_height: function(state) {
			var wrap_height;
			if(instance_wrap[ this._wrap_info.pos ]) {
				wrap_height = instance_wrap[ this._wrap_info.pos ].height;
				if(this.height) {
					wrap_height -= this.height;
				}
				if(state !== 'clear') {
					this.height = (state === 'error' ? error_height : default_height);
					if(state !== 'done') {
						wrap_height += this.height;//修改总高度,行高
					}
				}
				instance_wrap[ this._wrap_info.pos ].height = wrap_height;
			}
		},
		get_$wrap: function() {
			var collect = instance_wrap[instance_wrap.current];
			if(!collect || collect.is_full) {
				instance_wrap.current += 1;
				collect = instance_wrap[instance_wrap.current] = {
					index: 0,
					id: instance_wrap._wrap_id_prefix + instance_wrap.current,
					height: 0
				};
				//todo: process/complete
				view.process_files.append($(tmpl.instance_wrap({id: collect.id})));
			}

			collect.index += 1;

			collect.is_full = collect.index > instance_wrap.batch;
			this._wrap_info = {
				id: collect.id,//包装元素的ID
				pos: instance_wrap.current//包装元素所在位置
			};
			return $('#' + collect.id);
		},
		init_dom: function(task) {
			this.v_id = (dom_cache.length += 1);
			$(tmpl.instance(this.get_html(task, this.v_id))).appendTo(this.get_$wrap());
			dom_cache[this.v_id] = {
				'v_id': this.v_id,
				'upload_obj': task,
				'task': task
			};
			this.get_msg().text('等待上传').show();//上传状态提示信息
			this.get_click().hide();//暂停 or 继续
			//todo: 引导切换上传方式
			upload_tips.public_tip();//公共消息提示
		},
		set_cur_doing_vid: function() {
			view.cur_start_vid = this.v_id;
		},
		get_html: function(upload_obj, view_id) {
			var dir_name = upload_obj.pdir_name,
				upload_type = upload_obj.upload_type,
				file_type = upload_obj.get_file_type();
			return {
				"view_id": view_id,
				"mask_width": ( upload_type === 'upload_form' ? '100' : '0'),
				"file_type": file_type,
				'full_name': upload_obj.file_name,
				'file_name': view.revise_file_name(upload_obj.file_name),
				'file_size': File.get_readability_size(upload_obj.file_size),
				'file_dir': dir_name,
				'local_path': (upload_type.indexOf('plugin') ? upload_obj.path : '')
			};
		},
		/**
		 * 重试
		 */
		re_start: function() {
			this.hide_error();
			if(this.get_upload_obj().can_pause) {
				this.show_click('click_pause');
			} else {
				this.get_click().hide();
			}
			this.start();//修改上传外观
		},
		/**
		 * 显示错误信息
		 * @param html 错误码
		 */
		show_error: function(html) {
			this.get_error_msg().html(html).css('display', 'inline');
		},
		/**
		 * 隐藏错误信息
		 */
		hide_error: function() {
			this.get_error_msg().hide();
		},
		/**
		 * 显示暂停/开始按钮 ，支持显示不同属性
		 * @param cls    样式className
		 * @param title  属性title
		 * @param action 点击执行的动作key值
		 * @private
		 */
		show_click: function(action) {
			var dom = this.get_click();
			if(action === 'click_pause') {
				dom.data('action', action).attr('title', '暂停上传').removeClass('pause').show();
			} else {
				dom.data('action', action).attr('title', '继续上传').addClass('pause').show();
			}
		},
		/**
		 * 状态：删除
		 */
		clear: function() {
			if(this.v_id === 0)
				return;
			this.get_dom().remove();//dom删除
			delete dom_cache[this.v_id];//删除关联引用
			this.v_id = 0;
		}
	});

	/**
	 * 原型方法 : 状态
	 */
	$.extend(View_instance.prototype, {
		/**
		 * 直接切换到某种状态 (临时方法，稍后的重构将这些特殊调用地方统一到change_state方法中 todo )
		 * @param {String} [state] 目标状态
		 */
		invoke_state: function(state) {
			if(!this.is_exist() || !this[ state ]) {
				return;
			}
			if(this.old_state !== state) {
				this.change_$wrap_height(state);
			}
			this.old_state = this.state;
			this.state = state;
			this[ state ].call(this, state);
		},
		/**
		 * 状态控制点
		 */
		change_state: function() {
			if(!this.is_exist()) {//取消上传的文件，没成功；手工返回
				return;
			}
			var __state = this.get_upload_obj().state,
				state = this[ __state ];
			if(!state) {
				return;
			}
			if(this.old_state !== __state) {
				this.change_$wrap_height(__state);
			}
			this.state = __state;

			state.call(this, __state);
			this.old_state = this.state;
		},

		/**
		 * 转换的一瞬间
		 */
		transform_state: (function() {

			var g = {};
			g.file_sign_update_process = function() {
				this.get_click().hide();  //停止扫描的接口暂时未提供. 所以扫描的时候先影藏删除按钮.
			};
			g.upload_file_update_process = function() {
				var me = this;
				me.get_msg().html('正在上传').show();
				//修复bug： 出错后，停止上传失效，控件继续回调
				if('error' === this.last_trans_state) {
					me.hide_error();
					me.last_trans_state = 'upload_file_update_process';
				}
				if(me.get_task().can_pause) {    //如果能暂停的情况， 更新进度的时候影藏删除按钮
					me.show_click('click_pause');
				}
			};

			return function(state) {
				if(this.v_id === 0) {//取消上传的文件，没成功；手工返回
					return;
				}
				if(!g[ state ]) {
					this.last_trans_state = state;
					return;
				}
				g[ state ].call(this, state);
			};

		})(),
		/**
		 * 状态：初始化
		 */
		init: function() {
			view.upload_end_time(true);
		},
		/**
		 * 状态：等待
		 */
		wait: function() {
			this.get_file_size().html(File.get_readability_size(this.get_upload_obj().file_size)).show();
			this.get_msg().text('等待上传').show();
			this.get_click().hide();
			this.get_delete().css('display', 'inline-block');
			var task = this.get_task();
			this.hide_error();
			this.clear_soft_link();
		},
		/**
		 * 状态：开始
		 */
		start: function() {
			var w = ( this.get_upload_obj().upload_type === 'upload_form' ? '100%' : '1%');
			this.get_delete().css('display', 'inline-block');
			this.get_msg().text('正在上传').show();
			this.get_percent_face().width(w); //显示进度百分比-样式
			this.set_cur_doing_vid();
		},
		/**
		 * 状态：扫描状态
		 */
		file_sign_update_process: function() {
			var upload_obj = this.get_upload_obj();
			//can_show_sign_state: 解决出错了还会进来扫描
			var can_show_sign_state = this.old_state === 'wait' || this.old_state === 'start' || this.old_state === 'file_sign_update_process';
			if(this.state !== 'file_sign_update_process' || upload_obj.no_show_sign || !can_show_sign_state) {
				return;
			}
			var percent = upload_obj.file_sign_update_process / upload_obj.file_size * 100;

			//点击了取消，怎么都还会进来一次，导致get_msg为null的js错误
			if(upload_obj.file_sign_update_process === undefined) {
				return;
			}

			if(percent >= 100 && upload_obj.is_pre_file_sining) {
				this.get_msg().text('排队中').show();
			} else {
				this.get_msg().text('准备中:' + upload_obj.fix_percent(percent) + '%').show();
			}
		},
		/**
		 * 状态：扫描完成
		 */
		file_sign_done: function() {
			var upload_obj = this.get_upload_obj();
			if(!upload_obj.is_pre_file_sining) {
				this.get_msg().text('正在上传').show();
			}
		},
		/**
		 * 状态：更新进度
		 * @param hide_process_size
		 */
		upload_file_update_process: function(hide_process_size) {
			var upload_obj = this.get_upload_obj();
			if(this.v_id === 0 || !upload_obj.processed || this.state !== 'upload_file_update_process') {
				return;
			}

			var width = upload_obj.processed / upload_obj.file_size * 100;
			width = upload_obj.fix_percent(width);

			this.get_percent_face().width((width < 1 ? 1 : width) + '%');//显示进度百分比-样式
			this.get_msg().text(width + '%').show();//显示进度百分比-文本

			if(!hide_process_size) {
				var curr_file_size;
				curr_file_size = upload_obj.file_size * width / 100;
				curr_file_size = Math.min(curr_file_size, upload_obj.file_size);
				this.get_file_size().html(File.get_readability_size(curr_file_size) + '/' + File.get_readability_size(upload_obj.file_size));
			}

		},
		/**
		 * 状态：错误
		 * */
		error: function() {
			var me = this,
				task = me.get_upload_obj(),
				user = query_user.get_cached_user() || {};
			if (task.code === 1053 || task.code === 22081) { // 容量不足，显示购买容量
                if (user.is_weiyun_vip()) { // 会员引导购买容量
                    me.get_top_tips_capacity_vip().hide();
                    me.get_top_tips_capacity_purchase().show();
                } else { // 非会员引导开通会员
                    me.get_top_tips_capacity_purchase().hide();
                    me.get_top_tips_capacity_vip().show();
				}
                me.get_top_tips_speedup_vip().hide();
			} else {
                me.get_top_tips_speedup_vip().show();
                me.get_top_tips_capacity_vip().hide();
                me.get_top_tips_capacity_purchase().hide();
			}

			me.get_delete().css('display', 'inline-block');//可以删除
			me.get_click().hide();//默认不能再上传、暂停
			me.show_error(task.get_translated_error(upload_route.type === 'upload_form' ? 'tip' : null));//显示错误信息
			me.get_msg().text('');//隐藏进度信息
			me.get_file_size().text('');
			me.get_speed().hide();
			me.get_remain().text('');
			if(task.can_re_start()) {     //非本地校验出错 可以重试
				me.show_click('click_re_try');
			}
			me.get_up4g().hide();//有错误就不显示“超大文件”提示了，不够位置
			me.get_dom().removeClass('upbig');
			me.get_percent_face().width('100%').hide(); //隐藏进度
			view.on_done_reset_scroll(me.v_id);
			me.clear_soft_link();
		},
		/**
		 * 状态：完成
		 */
		done: function() {
			var new_name = file_type_map.revise_file_name(this.get_upload_obj().new_name || '', 1),//换新名字
				upload_obj = this.get_upload_obj(),
				real_size = upload_obj.file_size,
				file_size = File.get_readability_size(real_size);

			if(new_name) {
				this.get_dom().find('.filename').html(new_name);
			}
			this.get_file_size().html(file_size);//显示 实际尺寸
			this.get_msg().remove();//隐藏 上传信息提示
			this.get_remain().remove();//隐藏 剩余时间
			this.get_speed().remove();//隐藏上传速度
			this.get_click().remove();//隐藏 暂停/继续
			this.get_dest().children(0).text(upload_obj.dir_path).attr('title', text.text(upload_obj.dir_path));
			this.get_dest().show();//显示文件目录
			this.get_percent_face().width('100%').hide(); //隐藏进度
			this.get_complete().prepend(this.get_dom());
			if(upload_obj.is_miaoc()) {
				this.get_miaoc().text('极速秒传').show();
			} else if(upload_obj.is_tpmini()) {
				this.get_miaoc().text('已上传至TP mini').show();
			}
			this.hide_error();
			view.on_done_reset_scroll(this.v_id);
			this.clear_soft_link();
		},
		/**
		 * 状态：暂停
		 */
		pause: function() {
			this.show_click('click_continuee');
			this.get_delete().css('display', 'inline-block');
			this.get_msg().text('暂停').show();//显示上传
			this.get_remain().text('');//隐藏 剩余时间
			this.get_speed().hide();//隐藏上传速度
			this.clear_soft_link();
		},
		/**
		 * 状态：继续
		 */
		continuee: function() {
			this.show_click('click_pause');
			this.get_msg().text('正在上传').show();//显示上传
			this.get_speed().show();//隐藏上传速度
			this.hide_error();
		},
		/**
		 * 状态：续传暂停
		 */
		resume_pause: function() {
			this.upload_file_update_process('resume_pause');
			this.show_click('click_resume_continuee');
			this.get_delete().css('display', 'inline-block');
			this.clear_soft_link();
		},
		/**
		 * 状态：续传继续
		 */
		resume_continuee: function() {
			this.show_click('click_pause');
		}
	});


	view.add = function(upload_obj, view_key) {
		var instance = new View_instance();
		if(view_key) {
			var view_type;

			// 这么写是因为 require 必须使用明文字符串常量作为参数 - james
			switch(view_key) {
				case 'empty':
					view_type = require('./view_type.empty');
					break;
				case 'folder':
					view_type = require('./view_type.folder');
					break;
				case 'webkit_down':
					view_type = require('./view_type.webkit_down');
					break;
				case 'offline_download':
					view_type = require('./view_type.offline_download');
					break;
			}
			$.extend(instance, view_type);
		}
		instance.init_dom(upload_obj);
		return instance;
	};

	module.exports = view;

});


//优化点, 状态过度的时候开关.
//优化点, cache放到一个更小的集合中.
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.empty",["$"],function (require, exports, module) {
    var $ = require('$'),
        methods = {};
    $.each('init_dom invoke_state change_state transform_state init wait start re_start file_sign_update_process file_sign_done upload_file_update_process error done pause continuee resume_pause resume_continuee clear'.split(' '),function(i,n){
        methods[n] = $.noop;
    });
    return methods;
});


/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.folder",["common","./tool.upload_cache","./view","./upload_route"],function (require, exports, module) {
    var functional = require('common').get('./util.functional'),
        Cache = require('./tool.upload_cache'),
        view = require('./view'),
        upload_route = require('./upload_route'),
        get_info = function( cache_key ){
            return Cache.get(cache_key).get_count_nums();
        };
    var folder_view={
        get_html: function (upload_obj,view_id) {
            var dir_name = upload_obj.pdir_name;//目录名称
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "file_type": 'file',
                'full_name': upload_obj.file_name,
                'file_name': view.revise_file_name(upload_obj.file_name),
                'file_size': upload_obj.file_count+'个文件',
                'file_dir': dir_name,
                'local_path': upload_obj.path
            };
        },
        after_done: function(){
            this.set_folder_size('done');
        },
        after_error: function () {
            this.set_folder_size('done');
        },
        set_folder_size: function(state){
            var task = this.get_upload_obj(),
                info = get_info(task.sub_cache_key),
                html = '空文件夹';
            if(task.file_count !== 0){
                if(state === 'update'){
                    html = info.error  + info.done + 1 + '/' + ( info.length - info.pause )+'个文件';
                } else if(state ==='wait'){
                    //防止点击了暂停后再次进入等待状态，仍然显示正在计算
                    if(this.folder_has_ready){
                        html = info.length + '个文件';
                    }else{
                        html = '正在计算...';    
                    }
                } else if(state ==='done'){
                    html = info.length + '个文件';
                } else if(state === 'start'){
                    html = '1/'+(info.length - info.pause);
                } else if(state === 'resume_pause'){
                    html = info.length + '个文件';
                }
            }
            this.get_file_size().html(html);
        },
        set_folder_size_ready: function(){
            var info = get_info(this.get_upload_obj().sub_cache_key);
            this.get_file_size().html(info.length + '个文件');
            //文件计算是否完毕
            this.folder_has_ready = true;
        },
        start: function(){
            var me = this;
            me.set_folder_size('start');
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('正在上传').show();
            me.get_percent_face().width('1%'); //显示进度百分比-样式
            me.set_cur_doing_vid();
        },
        wait: function () {
            var me = this ;
            me.set_folder_size('wait');
            me.get_msg().html('等待上传').show();
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.hide_error();
        },
        upload_file_update_process: function () {
            var me = this,
                upload_obj = me.get_upload_obj();
            if (!upload_obj) {
                return;
            }
            upload_obj.state = 'upload_file_update_process';
            upload_obj.can_pause && me.show_click('icon-pause', '暂停', 'click_pause');
            var width = upload_obj.processed / upload_obj.file_size * 100;
            width = upload_obj.fix_percent(width);
            me.get_percent_face().width((width<1?1:width)+'%');//显示进度百分比-样式
            me.get_msg().html(width+'%').show();//显示进度百分比-文本

            me.set_folder_size('update');
        },
        /**
         * 状态：续传暂停
         */
        resume_pause: function () {
            var me = this;
            me.show_click('icon-continue', '续传', 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.set_folder_size('resume_pause');
        },
        /**
         * 状态：扫描状态
         */
        file_sign_update_process: function () {
            var upload_obj = this.get_upload_obj();
            var percent = upload_obj.folder_scan_percent;
	        if(upload_obj.state !== 'error') {
		        percent = upload_obj.fix_percent(percent);
		        this.get_msg().html('准备中:' + percent + '%').show();
		        this.get_click().hide();

		        var width = upload_obj.processed / upload_obj.file_size * 100;
		        width = upload_obj.fix_percent(width);
		        this.get_percent_face().width((width < 1 ? 1 : width) + '%');//显示进度百分比-样式
	        }
        },
        /**
         * 状态：扫描完成
         */
        file_sign_done: function () {
            this.get_msg().html('正在上传').show();
        }
    };

    folder_view.file_sign_update_process = functional.throttle(folder_view.file_sign_update_process, 500);//文件扫描

    return folder_view;
});/**
 * Created with JetBrains WebStorm.
 * User: iscowei
 * Date: 16-11-03
 * Time: 14:41
 */
define.pack("./view_type.offline_download",["common","./view","./upload_route"],function(require, exports, module) {
	var common = require('common'),
		File = common.get('./file.file_object'),
		functional = common.get('./util.functional'),

		view = require('./view'),
		upload_route = require('./upload_route');

	var offline_download_view = {
		get_html: function(upload_obj, view_id) {
			return {
				'view_id': view_id,
				'mask_width': '0',
				'li_class': 'waiting',
				'file_type': 'file',
				'full_name': upload_obj.file_name,
				'file_name': view.revise_file_name(upload_obj.file_name),
				'file_size': File.get_readability_size(upload_obj.file_size),
				'file_dir': upload_obj.file_dir
			};
		},
		start: function() {
			var me = this;
			me.get_click().hide();
			me.get_delete().css('display', 'inline-block');
			me.get_msg().html('离线下载中').show();
			me.get_percent_face().width('1%'); //显示进度百分比-样式
			me.set_cur_doing_vid();
		},
		wait: function() {
			var me = this;
			me.get_msg().html('排队中').show();
			me.get_click().hide();
			me.get_delete().css('display', 'inline-block');
			me.hide_error();
		},
		upload_file_update_process: function() {
			var me = this,
				upload_obj = me.get_upload_obj();
			if(!upload_obj) {
				return;
			}
			upload_obj.state = 'upload_file_update_process';
			var width = upload_obj.processed / upload_obj.file_size * 100;
			width = upload_obj.fix_percent(width);
			me.get_percent_face().width((width < 1 ? 1 : width) + '%');//显示进度百分比-样式
			me.get_msg().html(width + '%').show();//显示进度百分比-文本
		},
		/**
		 * 状态：错误
		 * */
		error: function() {
			var me = this,
				task = me.get_upload_obj();
			me.get_delete().css('display', 'inline-block');//可以删除
			me.get_click().hide();//默认不能再上传、暂停
			me.show_error(task.get_translated_error(upload_route.type === 'upload_form' ? 'tip' : null));//显示错误信息
			me.get_msg().text('');//隐藏进度信息
			me.get_file_size().text('');
			me.get_speed().hide();
			me.get_remain().text('');
			if(task.can_re_start()) {     //非本地校验出错 可以重试
				me.show_click('click_re_try');
			}
			me.get_percent_face().width('100%').hide(); //隐藏进度
			view.on_done_reset_scroll(me.v_id);
			me.clear_soft_link();
		}
	};

	return offline_download_view;
});/**
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.webkit_down",["common","lib","./view"],function (require, exports, module) {
    var common = require('common'),
        lib = require('lib'),
        console = lib.get('./console'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),

        is_newest_version = function () {//频繁验证，有性能有问题；这里用一个缓存读取
            return common.get('./util.plugin_detect').is_newest_version();
        }(),

        view = require('./view');
    return {
        get_html: function (task,view_id) {
            var file_type = task.get_file_type(),
                file_size = File.get_readability_size(task.file_size);
            if(task.is_package()){//打包下载  使用下面的提示
                file_size = '-';
            }
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "icon": "icon-down",
                "icon_err": "下载失败",
                "file_type": file_type,
                'full_name': task.file_name,
                'file_name': view.revise_file_name(task.file_name),
                'file_size': file_size,
                'file_dir': task.dir_name,
                'target_path': (task.target_path + task.file_name)
            };
        },
        start: function () {
            var me = this;
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('正在下载').css('display','inline');
            if(me.get_task().is_package()){
                me.get_percent_face().addClass('package-download').width('100%');
            }else{
                me.get_percent_face().width('0%');
            }
            me.set_cur_doing_vid();
            me.old_state = me.state;
        },
        /**
         * 状态：暂停
         */
        pause: function () {
            var me = this;
            this.show_click('icon-continue', '续传', 'click_continuee');
            this.get_delete().css('display', 'inline-block');
            //修改成暂停前保存上次的文本
            me.old_text = this.get_msg().html();
            this.get_msg().html('暂停').show();

            //解决点击了暂停，还是被进入了processing，导致按钮样式不对
            me.old_state = me.state;

            //解决点击了暂停，还是被进入了processing，导致状态文字不对
            //setTimeout(function(){
            //    me.get_msg().html('暂停');
            //},300);
            
        },
        /**
         * 状态：继续
         */
        continuee: function () {
            var me = this;
            this.show_click('icon-pause', '暂停', 'click_pause');
            //this.get_msg().html('正在下载').show();
            this.get_msg().html(me.old_text==='暂停' ? '正在下载' : me.old_text).show();
            this.hide_error();
        },
        /**
         * 状态：续传暂停
         *
        resume_pause: function () {
            var me = this;
            me.show_click('icon-continue', '续传', 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('等待下载').css('display','inline');
        },*/
        processing: function () {
            var me = this,
                task = me.get_task(),
                percent = task.fix_percent(Math.max(task.percent, 1), 0) + '%';

            //添加暂停功能 最新版QQ才出现暂停功能，打包下载不提供暂停功能
            if( !me.get_task().is_package() && me.old_state==='start' && is_newest_version ){
                me.show_click('icon-pause', '暂停', 'click_pause');
            }
            //打包下载不显示进度
            if(!task.is_package()){
                me.get_msg().html(percent).show();//显示进度百分比-文本
                me.get_percent_face().width(percent);//显示样式进度
            }
            
        },
        done: function () {
            var me = this;
            me.get_click().remove();
            me.get_msg().remove();
            view.on_done_reset_scroll(me.v_id);
        }
    };
});
//tmpl file list:
//upload/src/offline_download/offline_download.tmpl.html
//upload/src/select_folder/photo_group.tmpl.html
//upload/src/select_folder/select_folder.tmpl.html
//upload/src/upload.tmpl.html
//upload/src/upload_button.tmpl.html
//upload/src/upload_folder/loading.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'offline_download': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="popshare-make">\r\n\
		<ul class="tab-head">\r\n\
			<li class="bt on" data-id="offline_tab" data-tab="bt"><a href="javascript:void(0);"><i class="icon"></i>BT下载</a></li>\r\n\
			<li class="link" data-id="offline_tab" data-tab="link"><a href="javascript:void(0);"><i class="icon"></i>链接下载</a></li>\r\n\
		</ul>\r\n\
		<ul class="tab-body">\r\n\
			<!-- 选择bt种子 -->\r\n\
			<li class="bt" data-id="offline_bt" style="display: block;">\r\n\
				<a class="g-btn g-btn-blue" data-action="select_torrent" href="javascript:void(0);"><span class="btn-inner">选择本地BT种子</span></a>\r\n\
			</li>\r\n\
			<!-- 输入下载链接 -->\r\n\
			<li class="link" data-id="offline_link" style="display: none;">\r\n\
				<p class="infor">请输入下载文件的链接：</p><!--magnet:?xt=urn:btih:-->\r\n\
				<textarea class="copyurl j-offline-magnet" placeholder="支持http/磁力链/电驴"></textarea>\r\n\
\r\n\
				<div class="dirbox-dir dirbox-curdir j-path-container">\r\n\
					<label>保存到：</label>\r\n\
					<span class="j-offline-dir">微云/离线下载</span>\r\n\
					<a class="dirbox-chdir" href="javascript: void(0);" data-action="change_dir">修改</a>\r\n\
				</div>\r\n\
\r\n\
				<div class="dirbox-tree j-tree-container" style="display:none"></div>\r\n\
			</li>\r\n\
		</ul>\r\n\
	</div>');

return __p.join("");
},

'offline_file_select': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

	var common = require('common'),
		lib = require('lib'),
		file = common.get('./file.file_object'),
		file_type_map = common.get('./file.file_type_map'),
		text = lib.get('./text'),
		date = lib.get('./date_time');
	__p.push('	<div class="mod-dirbox">\r\n\
		<div class="dirbox-file">');
 if(data.torrent) { __p.push('            <span class="fileimg">\r\n\
                <span class="imgborder"><i class="icon icon-m icon-bt-m"></i></span>\r\n\
            </span>\r\n\
			<div class="filewrap">\r\n\
				<span class="filename">');
_p(text.text(data.torrent.name));
__p.push('</span>\r\n\
				<span class="filetxt">');
_p(date.timestamp2date_ymdhm(data.torrent.lastModified));
__p.push(' ');
_p(file.get_readability_size(data.torrent.size));
__p.push('</span>\r\n\
			</div>');
 } else { __p.push('			<div class="filewrap">\r\n\
				<span class="filename">');
_p(text.text(data.magnet));
__p.push('</span>\r\n\
			</div>');
 } __p.push('		</div>\r\n\
\r\n\
		<div class="dirbox-dirs">\r\n\
			<div class="offline-list">\r\n\
				<div class="mod-check" style="cursor: pointer" data-action="offline_select_all" data-act="1">\r\n\
					<i class="icon icon-check-s icon-checkbox"></i>\r\n\
					<span class="check-txt">全选</span>\r\n\
				</div>\r\n\
\r\n\
				<!-- [ATTENTION!!] 多选后 添加 .block-hover -->\r\n\
				<div class="mod-list-group mod-list-group-short">\r\n\
					<div class="list-group-bd">\r\n\
						<ul class="list-group">\r\n\
							<!-- [ATTENTION!!] 选中时加 .act -->');

							var EXT_VIDEO_TYPES = { video: 1, swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 };
							var item, ext, can_identify, object;
							for(var i=0, len=data.files.length; i < len; i++) {
								item = data.files[i];
								ext = file.get_ext(item.filename);
								can_identify = file_type_map.can_identify_v2(ext);
								is_video = ext in EXT_VIDEO_TYPES;
							__p.push('							<li class="list-group-item ');
_p(is_video?'act':'');
__p.push(' j-offline-file" data-act="');
_p(is_video?'1':'0');
__p.push('" data-index="');
_p(item.torrent_index);
__p.push('">\r\n\
								<div class="item-tit">\r\n\
									<div class="label"><i class="icon icon-check-s icon-checkbox"></i></div>\r\n\
									<div class="thumb"><i class="icon icon-m icon-');
_p(can_identify?file_type_map.get_type_by_ext_v2(ext):'nor');
__p.push('-m"></i></div>\r\n\
									<div class="info">\r\n\
										<span class="tit">');
_p(text.text(item.filename));
__p.push('</span>\r\n\
										<span class="tit tit-sub">');
_p(file.get_readability_size(item.filesize));
__p.push('</span>\r\n\
									</div>\r\n\
								</div>\r\n\
							</li>');
 } __p.push('						</ul>\r\n\
					</div>\r\n\
				</div>\r\n\
			</div>\r\n\
\r\n\
			<div class="dirbox-dir dirbox-curdir j-path-container">\r\n\
				<label>保存到：</label>\r\n\
				<span class="j-offline-dir">微云/离线下载</span>\r\n\
				<a class="dirbox-chdir" href="javascript: void(0);" data-action="change_dir">修改</a>\r\n\
			</div>\r\n\
\r\n\
			<div class="dirbox-tree j-tree-container" style="display:none"></div>\r\n\
		</div>\r\n\
	</div>');

return __p.join("");
},

'offline_download_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

	var $ = require('$'),
	lib = require('lib'),
	text = lib.get('./text');
	__p.push('	<div id="_offline_download_dialog" data-no-selection class="full-pop full-pop-large ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
		<h3 class="full-pop-header">\r\n\
			<div class="inner __title">');
_p( text.text(data.config.title) );
__p.push('</div>\r\n\
		</h3>\r\n\
		<div class="__content full-pop-content"></div>\r\n\
\r\n\
		<div class="full-pop-btn pop-offline-btn clearfix">\r\n\
			<div class="box-btns __buttons">\r\n\
				<span class="infor" style="display: none;" data-id="try_tips"><i class="icon icon-wy-s"></i><span data-id="use_count"></span>&nbsp;<span data-id="try_count" style="display: none;"></span><a class="link" data-action="open_vip" href="javascript: void(0);">开通会员</a></span>\r\n\
				<span class="infor" style="display: none;" data-id="vip_tips"><i class="icon icon-wy-s"></i><span data-id="use_count"></span>&nbsp;<span data-id="vip_count" style="display: none;">当前剩余次</span></span>');

				$.each(data.buttons || [], function(i, btn) {
					var is_ok = (btn.id === 'OK'),
					btn_aria_label = text.text(btn.aria_label),
					btn_text = btn_aria_label || text.text(btn.text);
				__p.push('				<div data-id="button" data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" ');
_p(is_ok?'tabindex="0"':'tabindex="-1"');
__p.push(' ');
_p(btn.visible?'':'style="display:none;"');
__p.push('>\r\n\
					<span class="btn-inner">');
_p(btn_text);
__p.push('</span>\r\n\
				</div>');

				});
				__p.push('			</div>\r\n\
		</div>\r\n\
		<a data-btn-id="CANCEL" class="full-pop-close j-offline-cancel" aria-label="关闭上传窗口" tabindex="0" href="javascript: void(0);" hidefocus="on">×</a>\r\n\
	</div>');

return __p.join("");
},

'photo_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="check-group" style="display:none;cursor: pointer;width:100px;"><i data-id="upload_group_check" class="checkbox"></i>指定分组\r\n\
    </div>');
_p(require('./tmpl')._upload_dropdown_group());
__p.push('');

return __p.join("");
},

'photo_group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var array = data.array,
        ret = ['<ul>'];
    if(array && array.length){
        for(var i = 0,j = array.length; i< j ;i++){
            ret.push('<li><a href="javascript:;" data-group-id="'+array[i].id+'">'+array[i].name+'</a></li>');
        }
    } else {
        ret.push('<li><a href="javascript:;" data-group-id="1">没有分组数据</a></li>');
    }
    ret.push('</ul>');
    __p.push('    ');
_p(ret.join(''));
__p.push('');

return __p.join("");
},

'_upload_dropdown_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var default_text = '新建分组';
    __p.push('    <div id="upload_dropdown_group" class="dropdown-group" style="display:none;width:220px;">\r\n\
        <a class="g-btn g-btn-gray" href="javascript:void(0);" id="upload_select_group"><span class="btn-inner">未分组<i></i></span></a>\r\n\
        <a id="upload_new_group_btn" href="javascript:void(0);" style="display:none;" class="create-group">+ 创建新分组</a>\r\n\
        <div id="upload_new_group_wrap" class="input-new-group" style="display:none;">\r\n\
            <input id="upload_new_group_input" type="text" value="');
_p(default_text);
__p.push('">\r\n\
            <a class="g-btn g-btn-blue" href="javascript:void(0)">\r\n\
                <span class="btn-inner disabled" id="upload_new_btn">创建</span>\r\n\
            </a>\r\n\
        </div>\r\n\
        <div class="dropdown-box" id="upload_group_panel" style="display:none;"></div>\r\n\
    </div>');

return __p.join("");
},

'select_folder': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('    <div class="mod-dirbox">\r\n\
        <div class="dirbox-file">\r\n\
            <span class="fileimg">\r\n\
                <i data-id="icon" class="filetype"></i>\r\n\
            </span>\r\n\
            <span data-id="name" class="filename"></span>\r\n\
        </div>\r\n\
\r\n\
        <div class="dirbox-dirs">\r\n\
\r\n\
            <div class="dirbox-dir dirbox-curdir">\r\n\
                <label>上传到：</label>\r\n\
                <label id="disk_upload_upload_to" title="上传到路径：" tabindex="0"></label>\r\n\
                <a data-btn-id="CHDIR" href="#" class="dirbox-chdir" tabindex="0" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_PATH_MODIFY'));
__p.push('>修改<s style="display:none">上传路径</s></a>\r\n\
            </div>\r\n\
\r\n\
            <div data-id="tree-container" class="dirbox-tree" style="display:none"></div>\r\n\
\r\n\
        </div>');
_p(require('./tmpl').photo_group());
__p.push('    </div>');

return __p.join("");
},

'file_box_node_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        files = data.files,
        par_id = data.par_id,
        level = data.level;
    __p.push('    <ul class="dirbox-sub-tree" role="tree">');
 $.each(files, function (i, file) {
            _p( tmpl.file_box_node({
                file: file,
                par_id: par_id,
                level: level + 1
            }) );

        }); __p.push('    </ul>');

return __p.join("");
},

'file_box_node': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),
        upload_route = require('./upload_route'),

        common = require('common'),

        file = data.file,
        par_id = data.par_id,
        level = data.level;
    var dir_name = text.text(file.get_name()),
        no_cursor = data.is_root ? 'cursor:default;' : '';
    __p.push('    <li id="_file_box_node_');
_p( file.get_id() );
__p.push('" data-file-id="');
_p( file.get_id() );
__p.push('" data-file-pid="');
_p( par_id || '' );
__p.push('" data-level="');
_p( level );
__p.push('" data-dir-name="');
_p( dir_name );
__p.push('" role="treeitem">\r\n\
        <a href="#" hidefocus="on" style="');
_p(no_cursor);
__p.push('padding-left:');
_p( level * 20 );
__p.push('px;" aria-label="按下回车展开。目录级别');
_p(level+1);
__p.push('">\r\n\
            <span class="ui-text"><i class="_expander"></i>');
_p( dir_name );
__p.push('</span>\r\n\
        </a>\r\n\
    </li>');

return __p.join("");
},

'file_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        root_dir = data.root_dir;
        par_id = data.par_id,
        is_root = data.is_root;//是否是根节点
    __p.push('\r\n\
        <ul class="_tree dirbox-tree-body">');
_p( tmpl.file_box_node({
                file: root_dir,
                par_id: par_id, //root_dir.get_parent().get_id(),
                level: 0,
                is_root: is_root
            }) );
__p.push('        </ul>\r\n\
');

return __p.join("");
},

'dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        show_install_flash = false,
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div id="_upload_dialog" data-no-selection class="full-pop full-pop-medium __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
            <h3 class="full-pop-header"><div class="inner __title">');
_p( text.text(data.config.title) );
__p.push('</div></h3>\r\n\
            <div class="__content full-pop-content">\r\n\
            \r\n\
            \r\n\
            </div>\r\n\
        \r\n\
            <div class="full-pop-btn clearfix">\r\n\
                <span id="tips-err" class="__msg infor err" style="background:#fff;color:red;display:none;"></span>\r\n\
                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                        var is_ok = btn.id === 'OK',
                            btn_aria_label = text.text(btn.aria_label),
                            btn_text = btn_aria_label || text.text(btn.text);

                        if(btn.tips == 'jisu' && btn.klass == 'ui-btn-other'){
                            //表单和flash上传特殊处理下
                            var upload_type = require('./upload_route').type;
                            if( upload_type === 'upload_form' && ($.browser.safari || !gbIsWin) ){
                                //显示安装flash的文字
                                show_install_flash = true;
                            }
                            else if( upload_type === 'upload_flash' && ($.browser.safari || !gbIsWin) ){
                                //flash上传下什么都不显示
                            }
                            else{
                                //提示安装控件
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" href="#" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_INSTALL_BTN_PLUGIN'));
__p.push('>\r\n\
                             <span class="btn-inner">');
_p( btn_text );
__p.push('</span>\r\n\
                        </a>');

                            }
                        }
                        else if(btn.tips == 'jisu' && btn.klass == 'ui-btn-ok' && !read_mode){
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" href="#" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_SUBMIT_BTN_PLUGIN'));
__p.push('>\r\n\
                           <span class="btn-inner">');
_p( btn_text );
__p.push('</span>\r\n\
                        </a>');

                        }
                        else {
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" href="#" tabindex="');
_p( btn_aria_label ? 0 : -1 );
__p.push('" ');
_p( is_ok ? 'tabindex="0"' : 'tabindex="-1"' );
__p.push('" ');
_p(click_tj.make_tj_str('UPLOAD_SUBMIT_BTN_NORMAL'));
__p.push('>\r\n\
                            <span class="btn-inner">');
_p( btn_text );
__p.push('</span>\r\n\
                        </a>');

                        }
                    });
                    __p.push('                </div>');

                if( show_install_flash ) {
                __p.push('                    <p class="box-tips">\r\n\
                        建议您安装flash以帮助大幅提高上传的成功率。<br/>\r\n\
                        <a href="http://www.adobe.com/go/getflashplayer" target="_blank" tabindex="-1">安装Flash</a>\r\n\
                    </p>');

                }
                __p.push('                \r\n\
            </div>\r\n\
        \r\n\
        <a data-btn-id="CANCEL" class="full-pop-close" aria-label="关闭上传窗口" tabindex="0" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_PATH_CLOSE'));
__p.push('>×</a>');
_p( tmpl.upload_box_pop({ text: select_folder_msg.get('USE_PLUGIN_UPLOAD') }) );
__p.push('        <div class="warning">严禁存储、处理、传输、发布任何涉密、色情、暴力、侵权等违法违规信息</div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'upload_box_pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text');
    __p.push('    <div id="_upload_box_pop" class="ui-pop box-pop upload-box-pop" style="top:225px;right:95px;display:none;">\r\n\
        <p class="ui-pop-text">');
_p( data.text );
__p.push('        </p>\r\n\
        <span class="ui-pop-darr hide">\r\n\
            <i class="ui-darr"></i>\r\n\
            <i class="ui-darr ui-darr-mask"></i>\r\n\
        </span>\r\n\
        <span class="ui-pop-uarr">\r\n\
            <i class="ui-uarr"></i>\r\n\
            <i class="ui-uarr ui-uarr-mask"></i>\r\n\
        </span>\r\n\
    </div>');

return __p.join("");
},

'dialog2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div data-no-selection class="full-pop full-pop-large __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <h3 class="full-pop-header"><div class="inner __title">');
_p( text.text(data.config.title) );
__p.push('</div></h3>\r\n\
\r\n\
        <div class="__content full-pop-content">\r\n\
\r\n\
\r\n\
        </div>\r\n\
\r\n\
        <div class="full-pop-btn">\r\n\
            <p class="__msg infor err" style="display:none;"></p>');

            $.each(data.buttons || [], function(i, btn) {
                if(btn.tips == 'jisu' && btn.klass == 'ui-btn-other'){
                    if( !$.browser.safari && gbIsWin ){
                __p.push('\r\n\
                <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" href="javascript:void(0)" class="g-btn upbox-btn-speed" ');
_p(click_tj.make_tj_str('UPLOAD_FILE_OVER_LIMIT_INSTALL'));
__p.push('>\r\n\
                  <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                </a>');

                    }
                }
                else {
                __p.push('                <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button">\r\n\
                    <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                </a>');

                }
            });
            __p.push('        </div>\r\n\
        \r\n\
        <a data-btn-id="CANCEL" class="full-pop-close" href="javascript:void(0)" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_FILE_OVER_LIMIT_CLOSE'));
__p.push('>×</a>');
_p( tmpl.upload_box_pop({ text: select_folder_msg.get('USE_PLUGIN_UPLOAD') }) );
__p.push('\r\n\
    </div>\r\n\
');

return __p.join("");
},

'dialog3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common');
    __p.push('    <div data-no-selection class="full-pop full-pop-large __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <h3 class="full-pop-header"><div class="inner __title">');
_p( text.text(data.config.title) );
__p.push('</div></h3>\r\n\
\r\n\
        <div class="__content full-pop-content">\r\n\
\r\n\
\r\n\
        </div>\r\n\
\r\n\
        <div class="full-pop-btn">\r\n\
            <p class="__msg infor err" style="display:none;"></p>');

            $.each(data.buttons || [], function(i, btn) {
            __p.push('                <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button">\r\n\
                    <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                </a>');

            });
            __p.push('\r\n\
        </div>\r\n\
        \r\n\
        <a data-btn-id="CANCEL" class="full-pop-close" href="javascript:void(0)" hidefocus="on">×</a>\r\n\
\r\n\
    </div>\r\n\
');

return __p.join("");
},

'box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div id="_task_body" class="mod-list-group task-ctrl-list mod-list-group-with-loc" style="background: #fff; display: none;">\r\n\
		<div class="group-item j-process-group" style="display: none;">\r\n\
			<div class="list-group-hd">\r\n\
				<p class="tit">\r\n\
					进行中 (剩余<span class="j-process-count"></span>)\r\n\
					<span class="tips j-top-tips">\r\n\
						<span class="tips with-border loc-abs with-logo j-speedup-vip-span">会员专享传输最高提速500%<a class="txt-link" href="javascript: void(0);" data-upload="speedup_vip">开通会员</a></span>\r\n\
						<a href="//www.weiyun.com/vip/capacity_purchase.html?from=web_capacity" class="tips with-border loc-abs j-capacity-purchase-a" style="display: none;" target="_blank"><i class="icon icon-assert"></i>容量不足，超大容量立即购买<i class="icon icon-link-to">跳转</i></a>\r\n\
						<span class="tips with-border loc-abs with-logo j-capacity-vip-span" style="display: none;">容量不足，会员专享3T容量<a class="txt-link" href="javascript: void(0);" data-upload="capacity_vip">开通会员</a><i class="icon icon-tips-close j-tips-close">关闭</i></span>\r\n\
					</span>\r\n\
				</p>\r\n\
				<div class="btn-group">\r\n\
					<div class="btn-vip-wrapper j-upbox-speedup" style="display: none;">\r\n\
						<button class="btn btn-m btn-vip" data-upload="speedup_try" style="display: none;">体验加速</button>\r\n\
						<!-- [ATTENTION!!] 加速体验 s -->\r\n\
						<div class="accelerate-wrapper try-accelerate j-novip-inner" style="display:none;">\r\n\
							<!-- 60s 倒数 -->\r\n\
							<i class="icon icon-count-down j-speedup-try-num">30</i>\r\n\
							加速中\r\n\
							<b class="effect-wrapper"></b>\r\n\
						</div>\r\n\
						<!-- [ATTENTION!!] 加速体验 e -->\r\n\
						<!-- [ATTENTION!!] 会员加速 s -->\r\n\
						<div class="accelerate-wrapper vip-accelerate j-vip-inner" style="display:none;">\r\n\
							<i class="icon icon-vip-accelerate" aria-hidden="true"></i>\r\n\
							会员加速中\r\n\
							<b class="effect-wrapper"></b>\r\n\
						</div>\r\n\
						<!-- [ATTENTION!!] 会员加速 e -->\r\n\
					</div>\r\n\
					<button class="btn btn-m" data-upload="clear_process">取消</button>\r\n\
				</div>\r\n\
			</div>\r\n\
			<div class="list-group-bd">\r\n\
				<ul class="list-group j-process-list"></ul>\r\n\
			</div>\r\n\
		</div>\r\n\
		<div class="group-item j-complete-group" style="display: none;">\r\n\
			<div class="list-group-hd">\r\n\
				<p class="tit">已完成 (<span class="j-complete-count"></span>)</p>\r\n\
				<div class="btn-group">\r\n\
					<button class="btn btn-m" data-upload="clear_complete">清空记录</button>\r\n\
				</div>\r\n\
			</div>\r\n\
			<div class="list-group-bd">\r\n\
				<ul class="list-group j-complete-list"></ul>\r\n\
			</div>\r\n\
		</div>\r\n\
		<!--空内容展示-->\r\n\
		<div class="empty-box j-upload-empty">\r\n\
			<!-- 任务为空 -->\r\n\
			<div class="status-inner" id="js-nofile" style="">\r\n\
				<i class="icon icon-nofile"></i>\r\n\
				<h2 class="title">没有任务</h2>\r\n\
			</div>\r\n\
		</div>\r\n\
	</div>');

return __p.join("");
},

'instance_wrap': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<li id="');
_p(data.id);
__p.push('"></li>');

return __p.join("");
},

'instance': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var text = require('lib').get('./text');
    __p.push('    <div class="list-group-item j-upload-item" id="upload_row_');
_p(data.view_id);
__p.push('" data-vid="');
_p(data.view_id);
__p.push('">\r\n\
	    <div class="processing j-upload-mask" style="width: ');
_p(data.mask_width);
__p.push('%;"></div>\r\n\
	    <div class="item-tit">\r\n\
		    <div class="label"><i class="icon ');
_p((data.icon ? data.icon : 'icon-upload-mini'));
__p.push('"></i></div>\r\n\
		    <div class="thumb"><i class="icon icon-m icon-');
_p(data.file_type);
__p.push('-m"></i></div>\r\n\
		    <div class="info">\r\n\
			    <span class="tit ellipsis">');
_p(text.text(data.file_name));
__p.push('</span>\r\n\
					<span class="sub-info">\r\n\
						<span class="item-info-list item-info-status fail j-upload-error" style="display: none;">\r\n\
							<span class="j-upload-error-text">上传失败</span>\r\n\
							<a href="javascript: void(0);" class="link">反馈</a>\r\n\
						</span>\r\n\
						<span class="item-info-list item-info-size j-upload-data-size">');
_p(data.file_size);
__p.push('</span>\r\n\
						<span class="item-info-list item-info-status j-upload-state-text" style="display: none;"></span>\r\n\
						<span class="item-info-list item-info-duration j-upload-remain-time" style="display: none;"></span>\r\n\
					</span>\r\n\
				</span>\r\n\
		    </div>\r\n\
	    </div>\r\n\
	    <div class="item-info">\r\n\
		    <!-- [ATTENTION!!] 会员加速速度显示 -->\r\n\
		    <span class="item-info-list item-info-speed j-upload-speed" style="display: none;">\r\n\
			    <i class="icon icon-speed j-upload-speed-up" style="display: none;"></i>\r\n\
			    <span class="j-upload-speed-text"></span>\r\n\
		    </span>\r\n\
		    <span class="item-info-list item-info-loc j-upload-path" style="display: none;">\r\n\
                <a href="javascript: void(0);" class="txt txt-link" title="');
_p((data.target_path ? data.target_path : data.file_dir));
__p.push('">');
_p(data.file_dir);
__p.push('</a>\r\n\
            </span>\r\n\
			<span class="item-info-list">\r\n\
				<span class="mod-act-list">\r\n\
				<!-- [ATTENTION!!] .pause 切换，继续上传 || 暂停上传 -->\r\n\
					<a href="javascript: void(0);" class="act-list pause j-upload-oper j-upload-switch" title="暂停上传" data-upload="click_event" data-action="click_pause"><i class="icon icon-upload-switch"></i></a>\r\n\
					<a href="javascript: void(0);" class="act-list j-upload-oper j-upload-cancel" title="取消上传" data-upload="click_event" data-action="click_cancel"><i class="icon icon-upload-cancel"></i></a>\r\n\
				</span>\r\n\
			</span>\r\n\
	    </div>\r\n\
    </div>');

return __p.join("");
},

'pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="ui-pop box-pop" style="right:auto;">\r\n\
		<p class="ui-pop-text"></p>\r\n\
		<span class="ui-pop-darr hide"> <i class="ui-darr"></i> <i class="ui-darr ui-darr-mask"></i> </span>\r\n\
		<span class="ui-pop-uarr hide"> <i class="ui-uarr"></i> <i class="ui-uarr ui-uarr-mask"></i> </span>\r\n\
	</div>');

return __p.join("");
},

'err_pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-pop box-pop upbox-err-pop" style="right:auto;">\r\n\
        <div class="ui-pop-inner"></div>\r\n\
        <span class="ui-pop-darr hide" style="left:30%;"> <i class="ui-darr"></i> <i class="ui-darr ui-darr-mask"></i> </span>\r\n\
        <span class="ui-pop-uarr hide"> <i class="ui-uarr"></i> <i class="ui-uarr ui-uarr-mask"></i> </span>\r\n\
    </div>');

return __p.join("");
},

'folder_errors': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var i, file;
        var common = require('common'),
            File = common.get('./file.file_object'),
            lib = require('lib'),
            text = lib.get('./text');
    __p.push('    <ul class="task-group" style="margin-bottom: 20px;">');
 for(i=0; i<data.length; i++){ file = data[i]; error_tip = (file.error_tip|| '').replace(/<\/?[^>]*>/g,'');__p.push('        <li class="item">\r\n\
            <p class="name" title="');
_p(text.text(file.fullname));
__p.push('">');
_p(text.text(file.name));
__p.push('</p>\r\n\
            <p class="size">');
_p(File.get_readability_size(file.size));
__p.push('</p>\r\n\
            <p class="exp" title="');
_p(error_tip);
__p.push('">');
_p(file.error||file.error_tip);
__p.push('</p>\r\n\
        </li>');
 } __p.push('    </ul>');

return __p.join("");
},

'file_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a class="g-btn g-btn-blue" href="javascript: void(0);" hidefocus="on" tabindex="-1"><span class="btn-inner"><i>+</i><span class="text">上传</span></span></a>');

return __p.join("");
},

'appbox_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('        <!--<a id="upload_dropdown_inner" class="btn" href="#" hidefocus="on" data-action="upload_files" aria-label="点击这里上传文件" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
        </a>-->\r\n\
    <a id="upload_dropdown_inner" data-action="upload_files" class="g-btn g-btn-blue" href="#" hidefocus="on" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('><span class="btn-inner"><i>+</i><span class="text">上传</span></span></a>');

return __p.join("");
},

'folder_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('    <a id="upload_dropdown_inner" data-action="upload_files" class="g-btn g-btn-blue" href="#" hidefocus="on" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('><span class="btn-inner"><i>+</i><span class="text">上传</span></span></a>');

return __p.join("");
},

'g4files_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('    <a id="upload_dropdown_inner" data-action="upload_files" class="g-btn g-btn-blue" href="#" hidefocus="on" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('><span class="btn-inner"><i>+</i><span class="text">上传</span></span></a>');

return __p.join("");
},

'appbox_btn_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj');__p.push('    <ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
        <li><a href="#" hidefocus="on" data-action="upload_files" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
        <li><a href="#" hidefocus="on" data-action="upload_folder" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_DIR'));
__p.push('>文件夹</a></li>');
if(data.is_show_temp_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="upload_temporary" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_TEMP'));
__p.push('>文件中转站<i></i></a></li>');
 } __p.push('        ');
if(data.is_show_note_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="add_note" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_NOTE'));
__p.push('>笔记</a></li>');
 } __p.push('\r\n\
    </ul>');

return __p.join("");
},

'folder_btn_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj');__p.push('    <ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
        <li><a href="#" hidefocus="on" data-action="upload_files" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
        <li><a href="#" hidefocus="on" data-action="upload_folder" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_DIR'));
__p.push('>文件夹</a></li>');
if(data.is_show_temp_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="upload_temporary" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_TEMP'));
__p.push('>文件中转站<i></i></a></li>');
 } __p.push('        ');
if(data.is_show_note_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="add_note" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_NOTE'));
__p.push('>笔记</a></li>');
 } __p.push('    </ul>');

return __p.join("");
},

'note_btn_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$');
        var is_chrome = $.browser.chrome;
        var common = require('common');
        var click_tj = common.get('./configs.click_tj');
    __p.push('    <ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">');
 if(data.is_show_label_btn) { __p.push('        <li><label for="_upload_form_input" hidefocus="on" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</label></li>');
 } else { __p.push('	    <li><a href="#" hidefocus="on" data-action="upload_files" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>');
 } __p.push('        ');
 if(data.is_show_foloder_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="upload_folder_h5" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_DIR'));
__p.push('>文件夹</a></li>');
 } __p.push('        ');
 if(data.is_show_temp_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="upload_temporary" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_TEMP'));
__p.push('>文件中转站<i></i></a></li>');
 } __p.push('        ');
if(data.is_show_note_btn) { __p.push('        <li><a href="#" hidefocus="on" data-action="add_note" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_NOTE'));
__p.push('>笔记</a></li>');
 } __p.push('    </ul>');

return __p.join("");
},

'g4files_btn_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj');__p.push('    <ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
        <li><a href="#" hidefocus="on" data-action="upload_files" tabindex="-1" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
    </ul>');

return __p.join("");
},

'loading_mark': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-no-selection class="ui-waiting">\r\n\
        <i class="icon-loading"></i>\r\n\
        <span class="_n ui-text"></span>\r\n\
        <a class="_cancel ui-text" href="javascript:;">取消</a>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
