/**
 * 微云用户登录相关
 * @returns {Promise}
 * 登录错误码：
 *      20314: 换取微云app的openid失败
 *      40029: code无效
 *      50001: 自定义错误 - 微信签名失败
 *      50002: 自定义错误 - 获取code失败
 */

var global = (getApp() || {}).global || {};

function login() {
	var request = require('request.js'),
		md = require('md.js');

	var url = 'https://user.weiyun.com/newcgi/weixin_webp_oauth20.fcg';

	return new global.Promise(function(resolve, reject) {
		if(global.cookie && global.cookie.wx_login_ticket) {
			return;
		}

		console.log('user wx login');
		wx.login({
			success: function(res) {
				console.log('user wx login success');

				if(res.code) {
					//发起网络请求
					console.log('weixin_webp_oauth20 request');
					request.get({
						url: url,
						data: {
							code: res.code,
							g_tk: '5381',
							appid: 'wxd574de764a7b7c7f',
							action: 'webp_login'
						}
					}).then(function(res_oauth) {
						console.log('user.js weixin_webp_oauth20 success');
						var result = (res_oauth || {}).data || {},
							retcode = result.retcode,
							cookie = result.cookie;
						if(retcode === 0) {
							global.cookie = {
								wx_login_ticket: cookie.wx_login_ticket,
								key_type: cookie.key_type,
								wy_uf: 1
							};
							resolve();
						} else {    //鉴权失败
							reject(res_oauth);
						}
					}, function(res_oauth) {
						console.log('weixin_webp_oauth20 fail');
						reject(res_oauth);
					});
				} else {
					md.report('wx_login', 50002, 1);
					reject(res);
				}
			},
			fail: function(res) {
				console.log('user wx login fail');
				md.report('wx_login', 50001, 1);
				reject(res);
			}
		});
	});
}

function wnsLogin() {
	var request = require('request.js'),
		md = require('md.js');

	return new global.Promise(function(resolve, reject) {
		var code, userData;
		var handler = function() {
			if(code && userData) {
				resolve();
			}
		};

		console.log('user wx login');
		wx.login({
			success: function(res) {
				console.log('user wx login success');

				if(res.code) {
					code = res.code;
					handler();
				} else {
					md.report('wx_login', 50002, 1);
					reject(res);
				}
			},
			fail: function(res) {
				console.log('user wx login fail');
				md.report('wx_login', 50001, 1);
				reject(res);
			}
		});

		console.log('user wx getUserInfo');
		wx.getUserInfo({
			success: function(res) {
				console.log('user wx getUserInfo success');

				if(res) {
					userData = res;
					handler();
				} else {
					//md.report('wx_getUserInfo', 60002, 1);
					reject(res);
				}
			},
			fail: function(res) {
				console.log('user wx getUserInfo fail');
				//md.report('wx_getUserInfo', 60001, 1);
				reject(res);
			}
		});
	});
}

function token(wx_login_ticket) {
	var hash = 5381;
	wx_login_ticket = wx_login_ticket || '';
	for(var i = 0, len = wx_login_ticket.length; i < len; ++i) {
		hash += (hash << 5) + wx_login_ticket.charCodeAt(i);
	}
	return hash & 0x7fffffff;
}

function get(key) {
	return global.userInfo[key] || '';
}

module.exports = {
	get: get,
	login: login,
	wnsLogin: wnsLogin,
	token: token
};