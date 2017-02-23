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
		global_variable = common.get('./global.global_variable'),
		//上传主按钮统计ID
		OP_CFG_UPLOAD_SELECT_FILE = common.get('./configs.ops').get_op_config('UPLOAD_SELECT_FILE');

	//界面ui
	var tmpl = require('./tmpl'),
		main_mod = require('main'),
		main_ui = main_mod.get('./ui'),
		upload_dom = main_ui.get_$uploader();

	//扩展模块
	var upload_cache = require('./tool.upload_cache'),
		global_function = require('./upload_global_function');

	//私有变量
	var cur_user = query_user.get_cached_user() || {};
	var isvip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
	var	is_ie = $.browser.msie,
		is_chrome = $.browser.chrome,
		is_safari = $.browser.safari,
		ua = navigator.userAgent.toLowerCase(),
		is_windows = ua.indexOf("windows") > -1 || ua.indexOf("win32") > -1,
		is_support_active = is_windows & !is_safari,
		flash_init = false,
		IS_PLUGIN_DRAG = false;

	var is_support_html5_pro = function() {
		return window.FileReader && window.Worker;
	};

	var is_support_flash = function() {
		var flash_version = 10; //给一个默认值

		var hasFlash = function() {
			// appbox
			var ext = window.external;
			if(ext && ext.FlashEnable && ext.FlashEnable()) {
				return true;
			}
			else if($.browser.msie) {
				// 上面的flash版本判断没有使用到，暂时注释掉，改为下面的方式，因为 #1 代码块会导致IE的浏览器标题栏变为“微云#disk”，原因不明 - james 2013-5-11
				try {
					var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					if(swf) {
						var VSwf = swf.GetVariable("$version");
						flash_version = parseInt(VSwf.split(" ")[1].split(",")[0], 10);
						return true;
					}
				}
				catch(e) {
				}
			}
			else {
				var plugs = navigator.plugins;
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
		}
	}();

	var get_upload_plugin = function() {
		var plugins = {};
		var pluginsMap = [];

		var get_active_plugin = function() {

			if(!is_support_active) {  // 控件不支持非windows，不支持safari（包括windows safari）
				throw new Error('unsupported system or browser');
			}

			var obj;

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
					var version = ', version:' + obj.Version;
					this.is_support_4g = plugin_detect.is_newest_version() ? true : false;//最新版本支持4G以上
				}
				catch(e) {
					var version = '';
					this.is_support_4g = false;
				}
				console.debug('ActiveXObject plugin' + version);
				this.type = 'active_plugin';
				return obj;
			}
			catch(e) {
				if(!constants.IS_APPBOX) {
					throw new Error('ActiveXObject plugin init error');
				} else {
					try {
						obj = new ActiveXObject("TXFTNActiveX.FTNUpload");
						require('./Upload_class');    //上传类        惰性加载
						require('./upload_plugin_start');    //开始上传之前的就绪工作
						require('./drag_upload_active');    //准备IE下拖拽上传
						// 设一个标志位，来标志该拖拽上传方式是否可用
						IS_PLUGIN_DRAG = true;
						obj.OnEvent = global_function;
						obj.Upload_UseHttps = constants.IS_HTTPS ? true : false;
						console.debug('ActiveXObject plugin');
						this.is_support_4g = false;
						this.type = 'active_plugin';
						return obj;
					}
					catch(e) {
						throw new Error('ActiveXObject plugin init error');
					}
				}
			}
		};

		var get_webkit_plugin = function() {

			if(!is_support_active || !constants.IS_APPBOX) {  // webkit控件只支持appbox
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
			}

			var embed = $('<embed id="npftnPlugin" type="application/txftn-webkit" width="0" height="0" style="position:absolute"></embed>').appendTo($('body'))[ 0 ];

			//var embed = $('<embed id="QQMailFFPluginIns" type="application/x-tencent-qmail-webkit" hidden="true">').appendTo( $('body') )[ 0 ];

			if(embed.UploadFile) {

				require('./Upload_class');    //上传类        惰性加载
				require('./upload_plugin_start');    //开始上传之前的就绪工作

				//require('./upload.drag_upload_active')('webkit_plugin');    //准备webkit下拖拽上传
				embed.OnEvent = global_function;   //设置上传的client相关回调
				embed.UseHttpsMode = constants.IS_HTTPS ? true : false;
				window.upload_obj = embed;
				embed.__type = 'webkit_plugin';
				//增加控件版本信息
				try {
					var version = ', version:' + plugin_detect.get_webkit_plugin_version();
					this.is_support_4g = plugin_detect.is_newest_version() ? true : false;//最新版本支持4G以上
					//this.is_support_4g = ( embed.UploadFileV2 ) ? true : false;
				}
				catch(e) {
					var version = '';
					this.is_support_4g = false;
				}
				console.debug('webkit_plugin' + version);

				this.type = 'webkit_plugin';
				return embed;
			}

			throw new Error('webkit plugin init error');

		};

		var get_flash = function() {
			// 读屏软件不使用flash上传，flash支持有问题 - james

			if(scr_reader_mode.is_enable()) {
				throw new Error('读屏软件不使用flash上传');
			}
			if(!is_support_flash() || !flash_init) {
				throw new Error('flash not init');
			}
			var flash_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/club/qqdisk/web/FileUploader.swf?r=' + random.random(),
				img_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/upload_02.png',
				isIe = $.browser.msie && $.browser.version < 11;

			var mode = 1;
			upload_dom.empty();
			//code by bondli 去掉背景图，才能保证设置的宽度和高度都是手型，flash会根据背景图的大小设置该大小的宽度和高度
			var $upload_obj = $(['<b class="icon_upload"></b><span id="uploadswf">', '<object id="swfFileUploader"' + (isIe ? '' : ' data="' + flash_url + '"') + ' style="width:' + 130 + 'px;height:' + 39 + 'px;left:0px;top:0px;position:absolute"' + (isIe ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + '>', isIe ? '<param name="movie" value="' + flash_url + '"/>' : '', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="wmode" value="transparent" />', '<param name="flashVars" value="callback=window.FileUploaderCallback&selectionMode=' + (mode === 1 ? 1 : 0) + '&buttonSkinURL=' + img_url + '"/>', '<param name="menu" value="false" />', '</object></span>'].join(''))
				.appendTo(upload_dom);

			var upload_obj = $upload_obj.find('object')[0];

			if(isIe) {
				setTimeout(function() {
					upload_obj.LoadMovie(0, flash_url);
				}, 0);
			} else {
				upload_obj.setAttribute("data", flash_url);
			}

			require('./Upload_class');
			require('./upload_flash_start');
			console.debug('flash_plugin');
			this.type = 'upload_flash';
			return upload_obj;
		};

		var get_form = function() {

			console.debug('form_plugin');
			this.type = 'upload_form';

			require('./Upload_class');
			require('./upload_form_start');
			var __random = random.random(),
				body = $('body');

			upload_dom.empty();
			var form_up_url = https_tool.translate_cgi('http://diffsync.cgi.weiyun.com');
			var iframe = $('<iframe name=' + __random + ' id=' + __random + ' style="display:none;width:0px;height:0px;" tabindex="-1"></iframe>').appendTo(body);
			var form = $('<form method="post" action="' + form_up_url + '" target=' + __random + ' enctype="multipart/form-data"></form>');
			var container = $('<div class="uploads upload-form"></div>');
			var input = $('<input id="_upload_form_input" name="file" type="file" class="ui-file" aria-label="上传文件，按空格选择文件。"/>');
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
					$('<input type="hidden">').attr('name', key).val(param[ key ]).appendTo(parentNode);
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
				parentNode.find('input:hidden').remove();
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
			//检车是否允许使用HTML5

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
			get_h5_flash: get_h5_flash,
			get_flash: get_flash,
			get_html5: get_html5,
			get_form: get_form,
			get_html5_pro: get_html5_pro
		};
		//用map控制加载优先级
		var query = urls.parse_params(),
			cur_uin = query_user.get_uin_num();
		if(query.upload !== 'plugin') {
			if(is_ie) {
				pluginsMap = ['get_active_plugin', 'get_webkit_plugin', 'get_h5_flash', 'get_flash', 'get_html5', 'get_form'];
			} else {
				pluginsMap = ['get_html5_pro', 'get_active_plugin', 'get_webkit_plugin', 'get_h5_flash', 'get_flash', 'get_html5', 'get_form'];
			}
		} else {
			pluginsMap = ['get_active_plugin', 'get_webkit_plugin', 'get_h5_flash', 'get_flash', 'get_html5', 'get_form'];
		}

		if(constants.IS_HTTPS) { //https下，纯h5上传不支持，在最新chrome浏览器下https下的http请求会给block掉 （等h5上传支持https后再打开）
			delete plugins['get_html5'];
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

	var detect_flash_env = function(callback) {
		var flash_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/club/qqdisk/web/FileUploader.swf?r=' + random.random() ,
			isIe = $.browser.msie && $.browser.version < 11;
		var mode = 1;
		var $flash = $(['<b class="icon_upload"></b><span id="uploadswf">', '<object id="swfFileUploader"' + (isIe ? '' : ' data="' + flash_url + '"') + ' style="width:' + 1 + 'px;height:' + 1 + 'px;left:0px;top:0px;position:absolute"' + (isIe ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + '>', isIe ? '<param name="movie" value="' + flash_url + '"/>' : '', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="wmode" value="transparent" />', '<param name="flashVars" value="callback=window.FileUploaderCallback&selectionMode=' + (mode === 1 ? 1 : 0) + '&buttonSkinURL=' + '"/>', '<param name="menu" value="false" />', '</object></span>'].join(''))
			.appendTo(document.body);
		window.FileUploaderCallback = function(code, opt) {
			if(code == 0) {
				flash_init = true;
				console.log('flash env ok')
			}
		};

		setTimeout(function() {
			//delete window.FileUploaderCallback;
			window.FileUploaderCallback = null;
			$flash.remove();
			callback();
		}, 3000);
	};


	var upload = new Module('upload', {

		upload_plugin_type: 'form',
		/**
		 * 是否库2.0
		 * @returns {boolean}
		 */
		is_ku20: function() {
			return true;
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

		/*
		 * 开始上传
		 *
		 */
		_render: function() {
			var self = this;

			this.upload_plugin = get_upload_plugin.call(self); //上传控件对象
			//判断是否安装了支持拖拽上传的控件
			//todo:ie下有问题，不能加载html5的上传
			if(IS_PLUGIN_DRAG === false && !is_ie && !constants.IS_APPBOX) {
				if(window.FileReader) {
					require('./drag_upload_html5');
				}
			}

			if(constants.IS_APPBOX) {
				window.external.OnEvent = global_function;   //设置上传的client相关回调
				window.external.UseHttpsMode = constants.IS_HTTPS ? true : false;
				window.external.__type = 'webkit_plugin';
			}

			if(cur_user.is_weixin_user && !cur_user.is_weixin_user()) {
				//异步加载笔记
				require.async('note');
			}
			/*
			 * 监听选择框上传按钮事件
			 *
			 */
			//装了控件才加载“上传文件夹”,“上传超大文件”的按钮
			if(this.type == 'active_plugin' || this.type == 'webkit_plugin') {
				var button_type;
				//appbox支持文件夹，超大文件
				if(constants.IS_APPBOX) {
					//新版appbox才出现下拉菜单
					if(plugin_detect.is_newest_version()) {
						upload_dom.css('height', '39px');
						upload_dom.html(tmpl.appbox_btn());
						upload_dom.addClass('upload-dropdown');
						button_type = 'appbox_btn';
					}
					else {
						upload_dom.css('height', '39px');
						upload_dom.html(tmpl.file_btn());
						upload_dom.addClass('nav-upload-plugin-free');
						button_type = 'file_btn';
						upload_dom.on('click', function(e) {
							if($(e.target).closest('a')[0]) { //这里不能直接阻止，form上传是弹不出文件选择框的
								e.preventDefault();
							}
							global_variable.set('upload_file_type', 'normal');
							//开始上传, 上传对象，上传ui
							upload_event.trigger('start_upload', self.upload_plugin);
						});
					}
				}
				else {
					if(this.type == 'active_plugin') {
						$(tmpl.folder_btn()).appendTo(upload_dom.html('').addClass('upload-dropdown'));
						button_type = 'folder_btn';
					}
					else {
						upload_dom.empty();
						$(tmpl.g4files_btn()).appendTo(upload_dom.addClass('upload-dropdown'));
						button_type = 'note_btn';
					}
				}

				if(typeof tmpl[button_type + '_menu'] === 'function') {
					var $drop = $(tmpl[button_type + '_menu']({
						is_show_foloder_btn: !constants.IS_APPBOX,
						is_show_temp_btn: false,
						is_show_note_btn: (cur_user.is_weixin_user && cur_user.is_weixin_user()) ? false : true
					}));
					$('body').append($drop);
					//加载下拉收拢上传文件夹按钮
					var upload_dropdown_menu = require('./upload_dropdown_menu');
					upload_dropdown_menu.render({'host': upload_dom});
					//上传文件
					upload_dom.find('[data-action="upload_files"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						setTimeout(function() {
							global_variable.set('upload_file_type', 'normal');
							upload_event.trigger('start_upload', self.upload_plugin);
						}, 100);
					});
					//上传文件
					$drop.find('[data-action="upload_files"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						setTimeout(function() {
							global_variable.set('upload_file_type', 'normal');
							upload_event.trigger('start_upload', self.upload_plugin);
						}, 100);
					});
					//上传文件夹
					$drop.find('[data-action="upload_folder"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						setTimeout(function() {
							upload_event.trigger('start_folder_upload', self.upload_plugin);
						}, 100);
					});
					//上传文件中转站
					/*$drop.find('[data-action="upload_temporary"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						setTimeout(function() {
							global_variable.set('upload_file_type', 'temporary');
							upload_event.trigger('start_upload', self.upload_plugin);
						}, 100);
					});*/
					//上传文件夹(h5)
					$drop.find('[data-action="upload_folder_h5"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						require('./upload_folder.upload_folder_h5_start').on_select();
					});
					//添加笔记
					$drop.find('[data-action="add_note"]').on('click', function(e) {
						e.preventDefault();
						upload_dropdown_menu.hide();
						var main_main = main_mod.get('./main');
						if(main_main.get_cur_mod_alias() == "note") {
							global_event.trigger('add_note');
						} else {
							main_main.async_render_module('note', {add_note: true});
						}
						return false;
					});
				}
			} else {
				if(this.type == 'upload_flash') {
					$(tmpl.file_btn()).appendTo(upload_dom);
					upload_dom.addClass('nav-upload-plugin-free');
					upload_dom.on('click', function(e) {
						if($(e.target).closest('a')[0]) { //这里不能直接阻止，form上传是弹不出文件选择框的
							e.preventDefault();
						}
						global_variable.set('upload_file_type', 'normal');
						//开始上传, 上传对象，上传ui
						upload_event.trigger('start_upload', self.upload_plugin);
					});
				} else {
					$(tmpl.file_btn()).appendTo(upload_dom);
					upload_dom.addClass('upload-dropdown');
					button_type = 'note_btn';
					if(typeof tmpl[button_type + '_menu'] === 'function') {
						var $drop = $(tmpl[button_type + '_menu']({
							is_show_label_btn: this.type === 'upload_form',
							is_show_foloder_btn: true,
							is_show_temp_btn: false,
							is_show_note_btn: (cur_user.is_weixin_user && cur_user.is_weixin_user()) ? false : true
						}));
						$('body').append($drop);
						var upload_dropdown_menu = require('./upload_dropdown_menu');
						upload_dropdown_menu.render({'host': upload_dom});
						//上传文件
						$drop.find('[data-action="upload_files"]').on('click', function(e) {
							e.preventDefault();
							upload_dropdown_menu.hide();
							global_variable.set('upload_file_type', 'normal');
							var _upload_click = document.getElementById('_upload_html5_input') || document.getElementById('_upload_form_input');
							if(_upload_click.click) {
								_upload_click.click();
							}
						});
						//上传文件夹
						$drop.find('[data-action="upload_folder_h5"]').on('click', function(e) {
							e.preventDefault();
							upload_dropdown_menu.hide();
							if(constants.IS_APPBOX) {
								setTimeout(function() {
									upload_event.trigger('start_folder_upload', self.upload_plugin);
								}, 100);
							} else {
								require('./upload_folder.upload_folder_h5_start').on_select();
							}
						});
						//上传文件中转站
						/*$drop.find('[data-action="upload_temporary"]').on('click', function(e) {
							e.preventDefault();
							upload_dropdown_menu.hide();
							global_variable.set('upload_file_type', 'temporary');
							var _upload_click = document.getElementById('_upload_html5_input') || document.getElementById('_upload_form_input');
							if(_upload_click.click) {
								_upload_click.click();
							}
						});*/
						//添加笔记
						$drop.find('[data-action="add_note"]').on('click', function(e) {
							e.preventDefault();
							upload_dropdown_menu.hide();
							var main_main = main_mod.get('./main');
							if(main_main.get_cur_mod_alias() == "note") {
								global_event.trigger('add_note');
							} else {
								main_main.async_render_module('note', {add_note: true});
							}
						});
					}
				}
				//flash，form下上传按钮统计
				if(this.type == 'upload_flash' || this.type == 'upload_form' && OP_CFG_UPLOAD_SELECT_FILE) {
					upload_dom.attr('data-tj-action', 'btn-adtag-tj').attr('data-tj-value', OP_CFG_UPLOAD_SELECT_FILE.op);
				}

			}

			self.trigger('render');

		},

		render: function() {
			var me = this;
			if(constants.IS_APPBOX) {
				me._render();
			} else {
				detect_flash_env(function() {
					me._render();
				});
			}
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

		is_support_html5_pro: is_support_html5_pro
	});

	module.exports = upload;
});



