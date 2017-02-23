/**
 * User: iscowei
 * Date: 16-04-25
 * 多线程HTML5上传
 */
define(function(require, exports, module) {
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
		undefined;

	//私有变量
	var KB1 = Math.pow(2, 10),
		fragment = KB1 * 512,
		experiencing = false; //体验极速上传的标识

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
				task.ftn_flag = task.channel_count === 0 ? 1 : 0;   //请求上传时返回0通道，flag就置1，走单通道老上传
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
				'flag': task.ftn_flag
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
				'flag': task.ftn_flag
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
								//网络请求出错，把通道放到等待队列中重试
								task.waitting.push(uploadData);
								task.channel_count--;
								if(task.channel_count === 0) {
									if(result.retcode === 2000011) {
										//createfile时效过期（5分钟没有数据传输），重新发起checkFile
										task.holding = [];
										task._srv_rsp_body = null;
										that.checkFile(task);
									} else {
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
				//一个通道上传完毕，如果有还等待中的通道，不要忘记启动上传
				if(task.waitting && task.waitting.length) {
					that.uploadFregment(task, task.waitting.pop());
				}
			}
		},
		//执行上传
		uploadRequest: function(task, uploadData) {
			var defer = $.Deferred();

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
					'flag': task.ftn_flag
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
				delete task.loadedMap[uploadData.channel.id];
				//重复上传的通道id，出现这个一般是同一个任务请求了两次试用加速，但这里有做判断容错，所以这个逻辑错误可以忽略
				console.log('uploadRequest error, duplicate channel id: ' + uploadData.channel.id);
				defer.reject({ 'retcode': 2000008 }, uploadData);
			}

			function doUpload(blob) {
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
						if(xhr.status == 200) {
							//这个计算的目的是保证进度条只到99%，因为在上传过程中可能会有偏差，真正上传完成会直接切成完成状态的
							task.loadedLen = Math.min(task.loadedLen + end - uploadData.channel.offset, task.file_size - 1);
							if(data.retcode == 0) {
								defer.resolve(data);
							} else if(data.retcode == -89012) { //暂停超过5分钟，继续上传时需要重新createfile
								defer.reject({ 'retcode': 2000011 }, uploadData);
							} else {
								console.log('uploadRequest data error' + (data.retcode && (', retcode: ' + data.retcode)) + (data.msg ? (', msg: ' + data.msg) : ''));
								console.log('error channel id: ' + uploadData.channel.id);
								defer.reject({ 'retcode': data.retcode === -89012 ? 2000011 : 2000007 }, uploadData);
							}
						} else {
							console.log('uploadRequest error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText ? (', xhr statusText: ' + xhr.statusText) : ''));
							console.log('error channel id: ' + uploadData.channel.id);
							defer.reject({ 'retcode': 2000006 }, uploadData);
						}
					},
					error: function(xhr, errorType, error) {
						delete task.loadedMap[uploadData.channel.id];
						console.log('uploadRequest error, xhr.readyState: ' + xhr.readyState + ', xhr status: ' + xhr.status + (xhr.statusText ? (', xhr statusText: ' + xhr.statusText) : ''));
						console.log('error channel id: ' + uploadData.channel.id);
						if(errorType === 'timeout') {
							defer.reject({ 'retcode': 2000009 }, uploadData);
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
				var $form = upload_dom.find('.upload-form');
				$('<input id="_upload_html5_input" name="file" type="file" multiple="multiple" class="ui-file" aria-label="上传文件，按空格选择文件。"/>').appendTo($form);
			}
		}
	};

	(function() {
		if(upload_route.upload_plugin == null) {
			upload_dom.empty();
			var form = $('<div class="uploads upload-form"><input id="_upload_html5_input" name="file" type="file" multiple="multiple" class="ui-file" aria-label="上传文件，按空格选择文件。"/></div>').appendTo(upload_dom);
			form.change(function() {
				upload_route.upload_plugin.change();
			});
		}
	})();

	//获取请求id
	function getReqId(str) {
		return str.replace(/[xy]/g, function( c ){
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r&0x3|0x8 );
			return v.toString( 16 )
		})
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
		var worker = new Worker('//www.weiyun.com/proxy/domain/img.weiyun.com/club/weiyun/js-dist/worker/sha.js');
		var tempHashList = [];
		var handler = {
			//FileReader回调
			onFileReaderHandler: function(base64) {
				worker.postMessage({
					'cmd': 'update',
					'base64': base64
				});
			},
			onFileErrorHandler: function(e) {
				worker.terminate();
				defer.reject({ 'retcode': 2000001 });
			},
			//worker线程回调
			onUpdateHandler: function() {
				//如果扫描过程中取消上传，就中止进程
				if(task.is_stop_upload) {
					worker.terminate();
					return;
				}
				//完成一次sha更新，如果文件还有余下的分片，继续读取文件；没有分片就获取整个sha进入上传
				if(task.endingByte < task.file_size) {
					//update完成获取累积sha
					worker.postMessage({
						'cmd': 'getTempHash'
					});
				} else {
					//扫描完成获取最终sha
					worker.postMessage({
						'cmd': 'getHash'
					});
				}
				//扫描进度更新
				task.change_state('file_sign_update_process', task.endingByte);
			},
			onGetHashHandler: function(data) {
				worker.terminate();
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
			},
			onWorkerErrorHandler: function(e) {
				if(e && (e.lineno || e.message || e.filename)) {
					console.log('worker error, ' + (e.lineno || '') + ' - ' + (e.message || '') + ' in ' + (e.filename || ''));
				}
				worker.terminate();
				defer.reject({ 'retcode': 2000002 });
			}
		};

		worker.onmessage = function(e) {
			var data = e.data;
			switch(data.cmd) {
				case 'update':
					handler.onUpdateHandler();
					break;
				case 'getHash':
					handler.onGetHashHandler(data);
					break;
				case 'getTempHash':
					handler.onGetTempHashHandler(data);
					break;
				default:
					handler.onWorkerErrorHandler();
					break;
			}
		};

		worker.onerror = function(e) {
			handler.onWorkerErrorHandler(e);
		};

		function chunk() {
			task.startingByte = task.endingByte;
			task.endingByte = Math.min(task.endingByte + fragment, task.file_size);
			readerFile(task.file, task.startingByte, task.endingByte).done(handler.onFileReaderHandler).fail(handler.onFileErrorHandler);
		}

		//扫描进度更新
		task.change_state('file_sign_update_process', 0);
		chunk();

		return defer;
	}
	//-------------------------------- sha模块 end --------------------------------

	module.exports = Upload;
});