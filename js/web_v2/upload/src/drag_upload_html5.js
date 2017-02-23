/**
 *
 * @author unitwang
 * @date
 */
define(function(require, exports, module) {

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
