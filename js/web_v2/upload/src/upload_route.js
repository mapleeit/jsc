/**
 * 上传控件入口, 选择使用哪种上传方式
 * @author svenzeng
 * @date 13-3-1
 */

define(function(require, exports, module) {
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



