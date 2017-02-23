/**
 * node webapp 请求
 * @author iscowei
 * @date 16-02-29
 */
define(function (require, exports, module) {
	var $ = require('$');
	var lib = require('lib');
	var constants = require('./constants');
	var pb_cmds = require('./pb_cmds');
	var cookie = lib('./cookie');

	/**
	 * 计算token
	 * @returns {string}
	 */
	var _token = function(token) {
		token = token || '';
		var hash = 5381;
		for (var i = 0, len = token.length; i < len; ++i) {
			hash += (hash << 5) + token.charCodeAt(i);
		}
		return hash & 0x7fffffff;
	};

	/**
	 * 获取 g_tk
	 * @returns {string}
	 */
	var get_g_tk = function () {
		return  _token(cookie.get('p_skey') || cookie.get('skey') || cookie.get('rv2') || cookie.get('wx_login_ticket') || '');
	};

	/**
	 * 把多层级的object展开，层级间用.分隔。{a: {b: c, d: e}} -> {a.b: c, a.d: e}
	 * @returns {object}
	 */
	var flatObj = function(data) {
		var _result = {};
		var _flat = function(preKey, d) {
			var type = Object.prototype.toString.call(d),
				key, k;
			if(type !== '[object Object]' && type !== '[object Array]') {
				if(!preKey) {
					_result = d;
				} else {
					_result[preKey] = d;
				}

				return;
			}
			for(key in d) {
				k = (!!preKey ? preKey + '.' : '') + (type === '[object Array]' ? '_Array' : '') + key;
				_flat(k, d[key]);
			}
		};
		_flat('', data);
		return _result;
	};

	return new function() {
		this.request = function(opt) {
			opt = $.extend({
				protocol: 'weiyun',
				cmd: '',
				type: 'GET',
				data: {}
			}, opt);

			var defer   = $.Deferred();
			var path = '/webapp/json/' + opt.protocol + '/' + opt.cmd;
			var browser_name = constants.browser_name ? '_' + constants.browser_name : '';
			var os_name = constants.os_name ? '_' + constants.os_name : '';
			var common = {
				refer: constants.UI_VER + browser_name + os_name,
				g_tk: get_g_tk(),
				r: Math.random()
			};

			//rcn
			opt.data.cmd = pb_cmds.get(opt.cmd);

			$.ajax({
				type: opt.type || 'GET',
				url: path + '?' + $.param(common),
				data: {
					data: JSON.stringify(opt.data)
				},
				dataType: 'json',
				timeout: 20000,
				success: function(data, status, xhr) {
					if(xhr.status == 200) {
						if(data.ret == 0) {
							defer.resolve(data);
						} else {
							defer.reject(data);
						}
					} else {
						defer.reject({
							ret: xhr.status,
							msg: status || ''
						});
					}
				},
				error: function(xhr, errorType, error) {
					defer.reject({
						ret: xhr.code || -400,
						msg: '网络连接失败'
					});
				}
			});

			return defer;
		};
	};
});