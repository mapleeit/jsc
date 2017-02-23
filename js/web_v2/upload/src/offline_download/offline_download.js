/**
 * 离线下载接口
 * @author iscowei
 * @date 2016-09-29
 */
define(function(require, exports, module) {
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
});