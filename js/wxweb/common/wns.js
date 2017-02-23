/**
 * wns用户登录相关
 * @author iscowei
 * @date 2016-10-20
 * @returns {Promise}
 */
var global = (getApp() || {}).global || {};
var md = require('md.js');
var loginWebapp = '/webapp/json/wnsLogin/getuid';
var expire = 90 * 60 * 1000;    //登录超过90min静默重登录
var assert_time = 5 * 60 * 1000;    //校验登录态间隔时间
var option = {};

function init(params) {
	if (!params || !params.appid || !params.appName || !params.qua || !params.domain) {
		throw new Error('[wns login]: lack of params');
	}

	option.params = params;
	option.inited = true;

	setInterval(assert, assert_time);
}

function login(refresh) {
	return new global.Promise(function(resolve, reject) {
		var storageData;
		if(!refresh) {
			storageData = wx.getStorageSync('wns_token_info');
			if(storageData && storageData.uid && storageData.openid && storageData.accesstoken) {
				md.log('[wns login]: wns.request tokenInfo already exist');
				resolve(storageData);
				return;
			}
		}

		function handler(loginCode, userData) {
			if(!loginCode || !userData) {
				return;
			}

			var url = 'https://' + option.params.domain + loginWebapp;
			option.params.code = loginCode;
			option.params.userData = userData;

			md.log('[wns login]: prepare request, code: ' + loginCode);
			//发起网络请求
			wx.request({
				url: url,
				method: 'POST',
				data: JSON.stringify(option.params),
				header: {
					'Content-Type': 'application/json'
				},
				success: function(result) {
					var data = ((result || {}).data || {}).data || {};
					data.login_time = new Date().getTime();
					md.log('[wns login]: wx.request success, uid: ' + data.uid);
					try {
						wx.setStorageSync('wns_token_info', data);
						md.log(JSON.stringify(data));
						report('wns_login', 0, 0);
						resolve(data);
					} catch (e) {
						md.log('[wns login]: wx.setStorageSync wns_token_info fail');
						report('wns_login', 50005, 1);
						reject(result);
					}
				},
				fail: function(result) {
					md.log('[wns login]: wx.request fail');
					report('wns_login', 50004, 1);
					reject(result);
				}
			});
		}

		md.log('[wns login]: wx.login start');
		wx.login({
			success: function(resLogin) {
				if(resLogin.code) {
					md.log('[wns login]: wx.login success, wns.login start');
					wx.getUserInfo({
						success: function(resUserInfo) {
							md.log('[wns login]: wx.getUserInfo success');
							report('wx_login', 0, 0);
							handler(resLogin.code, resUserInfo);
						},
						fail: function(res) {
							md.log('[wns login]: wx.getUserInfo fail');
							report('wx_login', 50003, 1);
							reject(res);
						}
					});
				} else {
					md.log('[wns login]: wx.login success, no code');
					report('wns_login', 50002, 1);
					reject(resLogin);
				}
			},
			fail: function(res) {
				md.log('[wns login]: wx.login fail');
				report('wns_login', 50001, 1);
				reject(res);
			}
		});
	});
}

function request(params) {
	return new global.Promise(function(resolve, reject) {
		var url = 'https://' + option.params.domain + params.webapp;
		var sendCount = 0;
		var tokenInfo;
		//没有登录票据先登录再发请求
		login().then(function(res) {
			tokenInfo = res;
			params.data.tokenInfo = {
				'openid': tokenInfo.openid,
				'expire_time': tokenInfo.expire_time,
				'accesstoken': tokenInfo.accesstoken,
				'accesstoken_expire': tokenInfo.accesstoken_expire
			};
			send();
		}, function(result) {
			//没有登录票据，尝试登录失败
			md.log('[wns request]: wx.request no tokenInfo, wns login fail');
			report('wns_request', 60001, 1);
			reject(result);
		});

		//发起网络请求
		function send() {
			wx.request({
				url: url,
				method: 'POST',
				data: JSON.stringify(params.data),
				header: {
					'Content-Type': 'application/json'
				},
				success: function(result) {
					var data = ((result || {}).data || {}).data || {};
					if(data && data.rsp_wns) {
						if(data.rsp_wns.WnsCode === 1950 || data.rsp_wns.WnsCode === 1952 || data.rsp_wns.WnsCode === 1953) {
							if(sendCount < 2) {
								//登录态过期，重登录
								md.log('[wns request]: wx.request wns code: ' + data.rsp_wns.WnsCode + ', retry login');
								report('wns_request', 60004, 2);
								login(true).then(function(res) {
									sendCount++;
									//更新登录票据
									tokenInfo = res;
									params.data.tokenInfo = {
										'openid': tokenInfo.openid,
										'expire_time': tokenInfo.expire_time,
										'accesstoken': tokenInfo.accesstoken,
										'accesstoken_expire': tokenInfo.accesstoken_expire
									};
									//重发请求
									send();
								}, function(ret) {
									//重登录失败
									md.log('[wns request]: wx.request wns code: ' + data.rsp_wns.WnsCode + ', retry login fail');
									report('wns_request', 60005, 1);
									reject(ret);
								});
							} else {
								//超过重登录次数
								md.log('[wns request]: wx.request wns code: ' + data.rsp_wns.WnsCode + ', exceeded retry login count');
								report('wns_request', 60006, 1);
								reject(result);
							}
						} else {
							if(data.rsp_wns.WnsCode === 0) {
								report('wns_request', 0, 0);
							} else {
								report('wns_request', data.rsp_wns.WnsCode, 2);
							}
							//请求成功
							md.log('[wns request]: wx.request success');
							if(!data.rsp_body) {
								data.rsp_body = {};
							}
							data.rsp_body.msg = data.rsp_wns.WnsErrorMsg;
							resolve(data.rsp_body);
						}
					} else {
						//回包错误，没有data.rsp_wns字段
						md.log('[wns request]: wx.request wns respond fail');
						report('wns_request', 60003, 1);
						reject(result);
					}
				},
				fail: function(result) {
					//请求错误
					md.log('[wns request]: wx.request fail');
					report('wns_request', 60002, 1);
					reject(result);
				}
			});
		}
	});
}

//校验登录过期
function assert() {
	var tokenInfo = wx.getStorageSync('wns_token_info');
	if(tokenInfo && tokenInfo.login_time && (tokenInfo.login_time + expire) < new Date().getTime()) {
		md.log('[wns assert]: wx.login expire, retry login');
		login();
	}
}

//获取用户数据
function getUserInfo() {
	return new global.Promise(function(resolve, reject) {
		var data, userInfo;
		login().then(function(res) {
			data = res;
			userInfo = data.stUserInfo;
			userInfo.uin = parseInt(data.uid);
			resolve(userInfo);
		}, function(result) {
			reject(result);
		});
	});
}

function report(mod, code, type) {
	/*
	 * wns_login code:
	 * 50001:    wx.login fail
	 * 50002:    wx.login success, no code
	 * 50003:    wx.getUserInfo fail
	 * 50004:    wx.request fail
	 * 50005:    wx.setStorageSync fail
	 *
	 * wns_request code:
	 * 60001:    no tokenInfo, wns login fail
	 * 60002:    wx.request fail
	 * 60003:    wx.request success, wns respond fail, no data.rsp_wns
	 * 60004:    wx.request success, wns login expired
	 * 60005:    wx.request success, wns login expired and retry login fail
	 * 60005:    wx.request success, wns login expired and retry login out of limit times
	 */
	md.report(mod, code, type);
}

module.exports = {
	init: init,
	login: login,
	request: request,
	getUserInfo: getUserInfo
};