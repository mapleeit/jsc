module.exports = function(request, response) {
	var logger = plug('logger'),
		path = require('path'),
		url = require('url'),
		tmpl = require('./tmpl'),
		config = require('./config'),
		ajax = require('weiyun/util/ajax'),
		Token = require('weiyun/util/Token'),
		pbCmds = require('weiyun/util/pbCmds'),
		browser = require('weiyun/util/browser')(),
		gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
		inspect = require('weiyun/util/inspect/inspect'),
		defaultPage = require('weiyun/default-page.js'),
		htmlEscape = require('weiyun/util/htmlEscape'),
		ret_msgs    = require('weiyun/util/ret_msgs'),
		reportMD = require('weiyun/util/reportMD'),
		ticket2sid = plug('qzone/util/ticket2sid'),
		serverInfo = plug('serverInfo'),
		httpUtil    = plug('util/http'),
		dcapi = plug('api/libdcapi/dcapi.js'),
		page302 = require('weiyun/page302'),


	//share切https时，接入alpha用户名单
		alpha = plug('util/alpha'),
		isAlpha = alpha.isAlpha(request),
		inspector,
		renderer;

	var userIp = httpUtil.getUserIp();
	var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
	var filename = (pathname || '').split('/').pop();
	var skey = request.cookies.skey;
	var p_skey = request.cookies.p_skey;
	var sid = request.GET['sid'];
	var ticket = request.query && request.query.ticket;
	var pt = request.GET['pt'];
	var paths = request.REQUEST.pathname.split('/');
	var shareKey = paths[paths.length - 1];
	var useSid = !skey && sid; //使用sid进行检验
	var sharepwd = request.cookies.sharepwd; //私密外链的密码
	var isDebug = request.REQUEST.query.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';
	var m = /msie\s*(\d*)/gi.exec(request.headers['user-agent']);
	var ieVersion = m && m[1];
	var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';
	window.serv_start_time = new Date();//标识请求开始处理的时间

	var getDeviceInfo = function() {
		var ua = request.headers['user-agent'],
			browser_name = 'unknown';
		if(browser.WEIXIN) {
			browser_name = 'weixin';
		} else if(browser.QQ) {
			browser_name = 'qq';
		} else if(ieVersion) {
			browser_name = 'ie';
		} else if(/chrome\s*(\d*)/gi.exec(ua)) {
			browser_name = 'chrome';
		} else if(/safari\s*(\d*)/gi.exec(ua)) {
			browser_name = 'safari';
		}
		return JSON.stringify({"browser": browser_name});
	};

	var login = function() {
		var url;
		var share_url = request.REQUEST.protocol + '://' + request.headers.host + request.REQUEST.href;
		// 判断是否在微信浏览器中，如果是跳转微信登陆授权页面
		if (browser.WEIXIN) {
			var redirect_url = 'http://web2.cgi.weiyun.com/weixin_oauth20.fcg?' +
				'g_tk=5381' +
				'&appid=wxd15b727733345a40' +
				'&action=save_share' +
				'&r_url=' + encodeURIComponent(share_url) +
				'&use_r_url=1';
			url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
				'appid=wxd15b727733345a40' +
				'&redirect_uri=' + encodeURIComponent(redirect_url) +
				'&response_type=code' +
				'&scope=snsapi_userinfo' +
				'&state=save_share' +
				'#wechat_redirect';
		} else {
			url = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&pt_wxtest=1&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url="
				+ encodeURIComponent(share_url)
				+ "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
		}

		//清除cookie
		var expires_date = new Date();
		expires_date.setMinutes(expires_date.getMinutes() - 1);
		response.setHeader("Set-Cookie", [
			'skey=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'uin=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'p_uin=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'p_skey=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'FTN5K=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'indep=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'openid=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'wy_uf=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'wx_login_ticket=; domain=weiyun.com; path=/;expires=' + expires_date.toUTCString(),
			'access_token=; domain=weiyun.com;path=/;expires=' + expires_date.toUTCString()
		]);

		page302(request, response, url);
	};

	var isFromSearch = function() {
		var result = false,
			referer = request.headers.referer,
			blackList = ['www.baidu.com', 'www.google.com', 'www.sogou.com', 'www.so.com', 'bing.com'];
		if(!referer) {
			return false;
		}
		for(var i=0; i<blackList.length; i++) {
			if(referer.indexOf(blackList[i]) !== -1) {
				result = true;
			}
		}
		return result;
	};

	//robots.txt  178000304
	if(filename === 'robots.txt') {
		reportMD(178000321, -1, 1);
		inspector = inspect(request, response);
		inspector.setView(__dirname + '/src');
		inspector.get(/[^\.|.]+\.txt/, function() { //匹配静态页面
			inspector.sendfile('robots.txt');
		});

		inspector.end();
		return;
	}

	//爬虫不予访问
	if(browser.SPIDER) {
		reportMD(178000321, -2, 1);
		defaultPage(request, response);
		return;
	}

	// 如果没有登陆态跳转登陆页面。目前统一由后台处理，前台不处理空cookie情况
	//if((browser.QQ || browser.WEIXIN) && !skey && !p_skey && !request.cookies.wx_login_ticket) {
	//	login();
	//	return;
	//}

	//302跳转至https，IE8下因为域名sni配置问题，会下发错误证书，等运维解决这问题再支持
	var protocol = 'https://';
	if(ieVersion && ieVersion <= 8 || isDebug) {
		protocol = 'http://';
	}
	logger.debug('ieVersion: ' + ieVersion + ', isDebug: ' + isDebug + ', isAlpha: ' + isAlpha + ', x-client-proto: ' + request.headers['x-client-proto'] + ', url: ' + 'https://' + request.headers.host + request.REQUEST.href);
	if(isHttps && protocol == 'http://' || !isHttps && protocol == 'https://') {
		page302(request, response, protocol + request.headers.host + request.REQUEST.href);
		return;
	}

	if(browser.WEIXIN && !request.cookies.node_redirect) {
		response.setHeader('Set-Cookie', "node_redirect=1;domain=share.weiyun.com;path=/");
		page302(request, response, '//' + request.headers.host + request.REQUEST.href + '#wechat_qqauth&wechat_redirect');
		return;
	} else if(browser.WEIXIN) {
		var expires_date = new Date();
		expires_date.setMinutes(expires_date.getMinutes() - 1);
		response.setHeader('Set-Cookie', "node_redirect=;domain=share.weiyun.com;path=/;expires=" + expires_date.toUTCString());
	}

	//限制路径，防止坏人构造URL
	if(paths.length>2 || !shareKey || shareKey.length !== 32) {
		if(request.headers['x-client-proto'] == 'https') {
			responseHtml(tmpl.noFound2());
		} else {
			responseHtml(tmpl.noFound2());
		}
		return;
	}

	if(browser.mobile || browser.QQ || browser.WEIXIN) { //区别Pc 和 h5，这里兼容ipadQQ，把QQ和微信也引入进来判断
		renderer = require('./mobile_renderer');
	} else {
		renderer = require('./web_renderer');
	}

	var has_response_end = false;
	request.once('fail', function() {
		if(!has_response_end) {
			reportMD(178000321, -4, 0);
			responseHtml(tmpl.fail({
				type: 'err',
				msg: '服务器繁忙'
			}));
		}
	});

	//从搜索引擎过来的请求不予显示
	if(isFromSearch()){
		reportMD(178000321, -3, 1);
		var html = renderer.fail({
			msg: '无法获取内容',
			ret: -1
		})
		responseHtml(html);
		return;
	}

	var getShareData = function() {
		var data = {
			os_info: "windows",
			browser: "chrome",
			share_key: shareKey
		};

		if(sharepwd) {
			data.share_pwd = sharepwd;
		}

		ajax.proxy(request, response).request({
			method: 'GET',
			l5api: config['l5api']['share'],
			dcapi: config['dcapi'],
			url: 'http://web2.cgi.weiyun.com/outlink.fcg' + (useSid ? '?sid=' + encodeURIComponent(sid) : ''),
			cmd: 'WeiyunShareView',
			ext_header: {
				device_info: getDeviceInfo()
			},
			data: data
		}).done(function(data) {
			reportMD(178000321, 0, 0);
			data.sid = sid; //把sid带到页面中供前端发请求使用
			var html = render(data);
			responseHtml(html);
		}).fail(function(msg, ret) {
			var html = '';
			if(ret_msgs.is_sess_timeout(ret)) {
				login();
				return;
			} else if(ret == 114303) {
				html = renderer.secret({
					need_pwd: true,
					retry: true,
					msg: msg
				});
			} else if(ret == 114304) {
				html = renderer.secret({
					need_pwd: true,
					need_verify: true,
					retry: true,
					msg: msg
				});
			} else {
				html = renderer.fail({
					msg: msg,
					ret: ret
				})
			}
			reportMD(178000321, ret, 0);
			responseHtml(html);
		});
	};

	var translate_host = function(link) {
		if(!link) {
			return link;
		}

		var href = url.parse(link);

		if(href && href.host && href.host.indexOf('.ftn.') > -1) { //host中带".ftn."的认为是ftn的上传下载url;
			return 'https://' + href.host.split('.').slice(0, 3).join('-') + '.weiyun.com:8443' + href.path;
		}

		return link.replace(/\.qq\.com/, '.weiyun.com');
	};

	var translate_url = function(list) {
		for(var i=0, len=list.length; i<len; i++) {
			if(list[i].https_thumb_url) {
				list[i].thumb_url = list[i].https_thumb_url;
			} else {
				list[i].thumb_url = translate_host(list[i].thumb_url);
			}
		}
	};

	//https://www.urlshare.cn/umirror_url_check?url=外链url
	//把a标签的外链内容转urlshare
	var UMirrorCheck = function(content) {
		var plateform;
        if(browser.mobile || browser.QQ || browser.WEIXIN) { //区别Pc 和 h5，这里兼容ipadQQ，把QQ和微信也引入进来判断
            plateform = 'mqq.weiyun';
        } else {
            plateform = 'pcqq.weiyun';
        }

		return content.replace(/<a.?href="(.+?)">/mig, function($0, $1) {
			if($1.search(/^(http:|https:)?\/\/www\.urlshare\.cn\/umirror_url_check/) >= 0) {
				return $0;
			} else {
				return $0.replace($1, 'http://www.urlshare.cn/umirror_url_check?plateform=' + plateform + '&url=' + encodeURIComponent($1));
			}
		});
	};

	var render = function(data) {
		var shareType = parseInt(data['share_flag'], 10);
		var html = '';

		//私密外链
		if(data['need_pwd']) {
			html = renderer.secret(data);
			return html;
		}

		//https要切换缩略图url的域名
		if(request.headers['x-client-proto'] == 'https' && data.file_list && data.file_list.length) {
			translate_url(data.file_list);
		}

		data.temporary = shareType == 12;
		data.group = shareType == 13;
		data.isQQ = browser.QQ;
		if(data.html_content && typeof data.html_content === 'string') {
			data.html_content = UMirrorCheck(data.html_content);
		}

		switch(shareType) {
			case 5:
				html = renderer.article(data);
				break;
			case 6:
				html = renderer.article(data);
				break;
			case 7:
				html = renderer.article(data);
				break;
			case 8:
				html = renderer.article(data);
				break;
			case 2:
				html = renderer.note(data);
				break;
			case 4:
				html = renderer.note(data);
				break;
			case 13:
				html = renderer.group(data);
				break;
			default:
				html = renderer.normal(data);
		}

		return html;
	};

	//需要根据请求返回码来做302跳转，所以H5也不分chunk返回了，后续有需要再回切
	//h5页面使用分chunk返回
	//if(browser.mobile || browser.QQ || browser.WEIXIN) {
	//	var chunkOne = renderer.getResponseChunk({
	//		index: 0
	//	});
	//	gzipResponse.write(chunkOne);
	//	gzipResponse.flush();
	//}

	if(p_skey || skey || sid) { //已经有登陆态了
		getShareData();
	} else if(ticket) {
		ticket2sid(request, response).done(function(id) {
			useSid = true;
			sid = id;
			getShareData();
		}).fail(function() {
			getShareData();
		});
	} else {
		getShareData();
	}

	//全量上报log，如果cookie没有uin说明是微信帐号或未登录，设置uin为client IP
	if(!request.cookies.p_uin && !request.cookies.uin) {
		logger.setKey(userIp);
	}
	logger.report();

	var gzipResponse;
	function responseHtml(html) {
		if(has_response_end) {
			return;
		}
		gzipResponse = gzipResponse || gzipHttp.getGzipResponse({
				request: request,
				response: response,
				plug: plug,
				code: 200,
				contentType: 'text/html; charset=UTF-8'
			});
		gzipResponse.write(html);
		gzipResponse.end();
		has_response_end = true;
	}

}