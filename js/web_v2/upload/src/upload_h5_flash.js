/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-7-31
 * Time: 下午4:51
 * HTML5上传
 */
define(function(require, exports, module) {

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


});