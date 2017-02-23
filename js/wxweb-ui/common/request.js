/**
 * 网络请求
 */

var global = (getApp() || {}).global || {};

var md = require('md.js'),
	cmds = require('cmds.js'),
	user = require('user.js');

var default_headers = {

};

function get(option) {
	option.method = 'GET';
	return send(option)
}

function post(option) {
	option.method = 'POST';
	return send(option)
}

function send(option) {
	return new global.Promise(function (resolve, reject) {
		//发起网络请求
		wx.request({
			url: option.url,
			data: option.data,
			method: option.method,
			success: function(res) {
				var result = (res || {}).data || {},
					retcode = result.retcode;
				if(retcode === 0) {
					md.report(option.url, 0, 0);
				} else {
					md.report(option.url, retcode, 1);
				}
				resolve(res);
			},
			fail: function(res) {
				md.report(option.url, 50004, 1);
				reject(res);
			}
		});
	});
}

function pb(option) {
	return new global.Promise(function (resolve, reject) {
		var cmdInfo = cmds.get(option.cmd);
		if(global.cookie && global.cookie.wx_login_ticket) {
			if(cmdInfo.url && cmdInfo.cmdId) {
				//发起网络请求
				wx.request({
					url: cmdInfo.url,
					data: {
						wx_tk: user.token(global.cookie.wx_login_ticket),
						cmd: cmdInfo.cmdId,
						data: formatData(cmdInfo, option.data)
					},
					header: {
						Cookie: 'wx_login_ticket=' + global.cookie.wx_login_ticket + '; key_type=' + global.cookie.key_type + '; wy_uf=1'
					},
					success: function(res) {
						//var result = ((((res || {}).data || {}).rsp_body || {}).RspMsg_body || {})['weiyun.' + cmdInfo.cmd + 'MsgRsp_body'] || {},
						var data = (res || {}).data,
							body, header, result;
						if(data && data.rsp_body && data.rsp_header) {
							body = data.rsp_body;
							header = data.rsp_header;
							if(header.retcode === 0) {
								md.report(cmdInfo.cmd, 0, 0);
								result = (body.RspMsg_body || {})['weiyun.' + cmdInfo.cmd + 'MsgRsp_body'] || {};
								resolve(result);
							} else if(header.retcode === 190011) {
								//登录态失效，重新登录
							} else {
								md.report(cmdInfo.cmd, header.retcode, 1);
								reject(res);
							}
						} else {
							reject(res);
						}
					},
					fail: function(res) {
						md.report(cmdInfo.cmd, 50004, 1);
						reject(res);
					}
				});
			} else {
				reject();
			}
		} else {
			reject();
		}
	});
}

function webapp(option) {
	return new global.Promise(function (resolve, reject) {
		global.Wns.login().then(function(res) {
			var cmdInfo = cmds.get(option.cmd);
			var tokenInfo = res;
			var reqMsg_body = {};
			if(!tokenInfo.uid) {
				//取不到uin直接报错
				md.report(option.cmd, 40003, 1);
				md.log('[request]: webapp request no uid');
				md.write();
				reject(tokenInfo, 40003);
			} else {
				reqMsg_body['.weiyun.' + cmdInfo.cmd + 'MsgReq_body'] = option.data;
				md.log('[request]: wns request, uin: ' + tokenInfo.uid);
				global.Wns.request({
					'webapp': cmdInfo.webapp,
					'data': {
						'uin': tokenInfo.uid || 0,
						'params': {
							'wyMsgHeader': {
								'type': 1,
								'uin': tokenInfo.uid || 0,
								'cmd': cmdInfo.cmdId,
								'appid': 30120,
								'major_version': 1,
								'minor_version': 0,
								'version': 0
							},
							'ReqMsg_body': reqMsg_body
						},
						'authenticate': true
					}
				}).then(function(result) {
					var status = result.msg && result.msg.split('|');
					if(status && status[0] && status[1]) {
						result.code = parseInt(status[0]);
						result.msg = status[1];
						md.report(option.cmd, result.code, result.code === 0 ? 0 : 2);
						md.log('[request]: wns request, code: ' + result.code + ', msg: ' + result.msg);
					} else {
						md.report(option.cmd, 40004, 2);
					}
					md.log('[request]: wns request, uin: ' + tokenInfo.uid + ', cmd: ' + option.cmd);
					resolve(result);
				}, function(result) {
					md.report(option.cmd, 40002, 1);
					reject(result);
				});
			}
		}, function(result) {
			md.report(option.cmd, 40001, 1);
			reject(result);
		});
	});
}

function formatData(cmdInfo, data) {
	var reqBody = {};
	reqBody['weiyun.' + cmdInfo.cmd + 'MsgReq_body'] = data;

	return  JSON.stringify({
		req_header: {
			cmd: cmdInfo.cmdId,
			appid: 30013,
			version: 2,
			major_version: 2
		},
		req_body: {
			ReqMsg_body: reqBody
		}
	});
}

module.exports = {
	pb: pb,
	get: get,
	post: post,
	webapp: webapp
};