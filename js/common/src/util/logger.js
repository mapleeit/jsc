/**
 * 上报日志到闹歌系统
 * @date 2015-02-28
 * @author hibincheng
 */
define(function(require, exports, module) {
	var lib = require('lib'),
		$ = require('$'),

		query_user = require('./query_user'),
		constants = require('./constants'),
		reportMD = require('./report_md'),
		console = lib.get('./console'),
		date_time = lib.get('./date_time'),
		undefined;

	var uin = query_user.get_uin_num(),
		view_key = 'weiyun_' + uin,
		last_time,
		cache_log = [],
		timer = {},
		ie67 = $.browser.msie && $.browser.version < 8;

	/**
	 * 上报罗盘log，获取用户的错误记录，以便处理用户反馈
	 * @param key
	 * @param str
	 */
	function report(key, str) {
		if(ie67) {
			return;
		}

		if(!str) {
			str = key;
			key = view_key;
		}

		try {
			var request,
				now = new Date().getTime(),
				take_time = last_time ? (now - last_time) / 1000 : 4,
				url = constants.IS_HTTPS ? 'https://www.weiyun.com/log/post/' + key : 'http://www.weiyun.com/log/post/' + key;

			var user_log = [], user_date, line, rep_log = [];
			if(typeof str === 'object') {
				str.time = new Date().toString();
				str.uin = uin;
				if(str.url) {
					url = str.url;
				}
				if(str.report_console_log) {
					str.log = console.get_log();
				}
				//构造日志内容
				user_log.push('【用户日志】');
				if(str.time) {
					user_log.push('记录时间 ' + date_time.timestamp2date_ymdhm(new Date(str.time).getTime()));
				}
				if(str.uin) {
					user_log.push('uin ' + str.uin);
				}
				for(var key in str.log) {
					if(str.log[key] && str.log[key].length) {
						//只取前10条log，避免上报数据太大
						rep_log = str.log[key].slice(-10);
						user_log.push('\n【' + key + '】：');
						for(var i = 0, len = rep_log.length; i < len; i++) {
							line = rep_log[i];
							user_log.push('[' + line[0] + '] ' + (line[2] ? ('[' + line[2] + '] ') : '') + line[1]);
						}
					}
				}
				str = user_log.join('\n') + '\n';
			} else {
				str = 'time:' + new Date().toString() + 'uin:' + uin + ' ' + str;
			}
			//三秒上报一次, 这里last_time标识上次上报的时间点。
			if(take_time > 3) {
				timer && clearTimeout(timer);
				cache_log.push(str);
				timer = (function(reportUrl) {
					setTimeout(function() {
						$.ajax({
							url: reportUrl,
							type: 'post',
							data: cache_log.join('\n'),
							contentType: 'text/plain',
							xhrFields: {
								withCredentials: true
							}
						});
						cache_log = [];
					}, 3 * 1000);
				})(url);
				last_time = now;
			} else {
				cache_log.push(str);
			}
		} catch(e) {
		}
	}

	/**
	 * 写控制台信息并上报罗盘、返回码
	 * 都会上报成功
	 * @param log
	 * @param mode
	 * @param ret
	 */
	function write(log, mode, ret) {
		var now = new Date().getTime(),
			take_time = last_time ? (now - last_time) / 1000 : 4,
			url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
			interfaceMap = {
				'upload_error': 177000185,
				'upload_plugin_error': 177000186,
				'upload_html5_pro_error': 178000358,
				'offline_download_error': 179000151,
				'save_note_error': 179000177,
				'download_error': 177000187,
				'disk_error': 178000314,
				'flash_error': 177000197,
				'hash_error': 178000306
			};

		if(log instanceof Array) {
			for(var i=0, len=log.length; i<len; i++) {
				console.log(log[i]);
			}
		} else if(log instanceof String) {
			console.log(log);
		}

		report({
			report_console_log: true,
			url: url
		});

		if(mode && (typeof ret != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
		}
	}

	/**
	 * 若是成功，则上报模调
	 * 若是失败，则分别上报罗盘和模调
	 * @param log
	 * @param mode
	 * @param ret
	 * @param result 0：成功，1:失败，2:逻辑失败
	 */
	function dcmdWrite(log, mode, ret, result) {
		result = result || 0;
		var now = new Date().getTime(),
			take_time = last_time ? (now - last_time) / 1000 : 4,
			url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
			interfaceMap = {
				'video_preview_monitor': 179000145,
				'offline_download_monitor': 179000152,
				'web_capacity_purchase_monitor': 17900205
			};

		if(log instanceof Array) {
			for(var i=0, len=log.length; i<len; i++) {
				console.log(log[i]);
			}
		} else if(log instanceof String) {
			console.log(log);
		}

		// 成功不上报罗盘
		result && report({
			report_console_log: true,
			url: url
		});

		if(mode && (typeof ret != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
		}
	}

	//前台JS错误监控，目前针对：下载文件，参数错误(错误码1000500)上报
	function monitor(mode, ret, result) {
		var interfaceMap = {
				'js_download_error': 178000367
			};

		if(mode && (typeof ret != undefined) && (typeof result != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
		}
	}

	return {
		report: report,
		write: write,
		monitor: monitor,
		dcmdWrite: dcmdWrite
	}
});