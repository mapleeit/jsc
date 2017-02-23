/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var config = require('./config');
var Token = require('weiyun/util/Token');
var Deferred = plug('pengyou/util/Deferred');

module.exports = {
	batchLoadData: function() {
		var def = Deferred.create();
		async.parallel([
				function(callback) {
					loadUserInfo(callback);
				}],
			function(err, results) {
				if(!err) {
					def.resolve(results[0]); //按parallel顺序返回
				} else {
					def.reject(err);
				}
			});
		return def;
	},
	queryHTTPProtocol: function() {
		var def = Deferred.create();
		ajax.proxy(window.request, window.response).request({
			l5api: config['l5api'],
			dcapi: config['dcapi']['CloudConfigGet'],
			url: 'http://web2.cgi.weiyun.com/weiyun_config.fcg',
			cmd: 'CloudConfigGet',
			data: {
				item: [
					{
						key: 'is_use_https',
						value: ''
					}
				]
			}
		}).done(function(data) {
			if(data && data.item) {
				def.resolve(data.item[0].value);
			} else {
				def.reject()
			}
		}).fail(function(msg, ret) {
			def.reject(msg, ret);
		});

		return def;
	}
};

function loadUserInfo(callback) {
	ajax.proxy(window.request, window.response).request({
		l5api: config['l5api'],
		dcapi: config['dcapi']['DiskUserInfoGet'],
		url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
		cmd: 'DiskUserInfoGet',
		data: {
			is_get_upload_flow_flag: true,
			is_get_weiyun_flag: true
		}
	}).done(function(data) {
		callback(null, data);
	}).fail(function(msg, ret) {
		callback({
			cmd: 'DiskUserInfoGet',
			msg: msg,
			ret: ret
		}, null);
	})
}