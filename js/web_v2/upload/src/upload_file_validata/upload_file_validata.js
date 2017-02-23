/**
 * 添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author svenzeng
 * @date 13-3-1
 */
define(function(require, exports, module) {

	var common = require('common'),
		query_user = common.get('./query_user'),
		File = common.get('./file.file_object'),
		$ = require('$'),
		msg = require('./msg'),
		error_names = {
			EMPTY_NAME: ['', 1000006],
			DENY_CHAR: ['', 1000007],
			OVER_LIMIT: ['', 1000008]
		},
		video_ext = ['asf', 'avi', 'rm', 'mpeg', '3gp', 'rmvb', 'mov', 'mpg', 'mkv', '3gpp', 'wmv', 'mp4', 'wmf', 'flv', 'f4a', 'webm', 'mod', 'mpe', 'asx', 'vob', 'f4v', 'dv', 'm2ts', 'mts', 'dat'];

	var map = {
		check_name: function(file_name) {
			var code = File.check_name_error_code(file_name);
			if(code) {
				return error_names[code];
			}
		},
		check_video: function(file_name) {
			return;//放开视频上传
			var file_ext = File.get_ext(file_name);
			if($.inArray(file_ext, video_ext) > -1) {
				return ['视频文件暂无法上传', 1000009];
			}
		},
		check_torrent: function(file_name) {
			var file_ext = File.get_ext(file_name);
			if(file_ext !== 'torrent') {
				return ['请选择后缀名为.torrent的种子文件', 1500001];
			}
		},
		//大于4G，提示升级控件（老控件使用）
		up4g_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['大小超过' + File.get_readability_size(max_size) + '请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。', 1000005];
			}
		},
		max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size), 1000001];
			}
		},

		h5_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size) + '请<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>，上传更大文件', 1000001];
			}
		},

		h5_pro_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size)
						+ ((typeof config_data !== 'undefined' && config_data.windows && config_data.windows.download_url)
							? '，请<a href="' + config_data.windows.download_url + '" target="_blank">安装微云客户端</a>，上传'
							: '，请安装微云客户端上传')
						, 1000001];
			}
		},

		max_single_file_size: function(curr_size) {
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			var isvip = user.is_weiyun_vip && user.is_weiyun_vip();
			var max_size = (user.get_max_single_file_size && user.get_max_single_file_size());
			if(!max_size) {
				//非会员1G，会员4G
				max_size = isvip ? Math.pow(2, 30) * 4 : Math.pow(2, 30);
			}
			if(curr_size > max_size) {
				return ['单文件超过' + File.get_readability_size(max_size)
					+ (isvip ? '' : '，<a href="http://ptlogin2.weiyun.com/ho_cross_domain?&amp;tourl=http://jump.weiyun.qq.com/?from%3D1012" target="_blank">开通会员</a>支持大文件上传')
					, 1000010];
			}
		},

		remain_flow_size: function(curr_size) {
			var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
			var isvip = user.is_weiyun_vip && user.is_weiyun_vip();
			var remain_size = (user.get_remain_flow_size && user.get_remain_flow_size());
			if(!remain_size) {
				//非会员1G，会员4G
				remain_size = isvip ? Math.pow(2, 30) * 4 : Math.pow(2, 30);
			}
			//remain_size = -1, 白名单用户，不限制
			if(remain_size > -1 && curr_size > remain_size) {
				return ['文件大小超过当日剩余流量' + File.get_readability_size(remain_size)
					+ (isvip ? '' : '，<a href="http://ptlogin2.weiyun.com/ho_cross_domain?&amp;tourl=http://jump.weiyun.qq.com/?from%3D1012" target="_blank">开通会员</a>上传更多文件')
					, 1000015];
			}
		},

		plugin_max_size: function(curr_size, max_size) {
			if(curr_size > max_size) {
				if(max_size)
					return ['文件超过' + File.get_readability_size(max_size), 1000010];
			}
		},
		flash_max_size: function(curr_size, max_size) {
			if(curr_size === -1) {
				return ['文件超过' + File.get_readability_size(max_size), 1000001];
			}
			if(curr_size > max_size) {
				if(max_size)
					return [msg.get('upload_error', 1000002), 1000002];
			}
		},
		max_space: function(curr_size, space, space_totle) {
			if(curr_size + space > space_totle) {
				return [msg.get('upload_error', 1000003), 1000003];
			}
		},
		empty_file: function(curr_size) {
			if(curr_size - 0 === 0) {
				return [msg.get('upload_error', 1000004), 1000004];
			}
		}
	};


	var Validata = function() {
		var __map = $.extend({}, map),
			stack = {},
			__self = this;

		var add_validata = function() {
			var key = Array.prototype.shift.call(arguments);
			stack[ key ] = Array.prototype.slice.call(arguments);
		};

		var add_rule = function(fn_name, fn) {
			__map[ fn_name ] = fn;
		};

		var run = function() {
			var flag = false;
			$.each(__map, function(key, fn) {
				var param = stack[ key ];
				if(!param) {
					return;
				}
				var ret = fn.apply(__self, param);
				if(ret) {
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function() {
		return Validata.call(this);
	};

	return {
		create: create
	};

});
