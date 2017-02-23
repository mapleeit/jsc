/**
 * 微云web版直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
	var logger      = plug('logger');
    var loader      = require('./loader'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        page302     = require('weiyun/page302'),
        inspect     = require('weiyun/util/inspect/inspect'),
        renderer    = require('./renderer'),
        config      = require('./config'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        browser     = require('weiyun/util/browser')(),
	    reportMD    = require('weiyun/util/reportMD'),

        alpha       = plug('util/alpha'),
        isAlpha     = alpha.isAlpha(request),
        path        = require('path');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();

    if(filename.indexOf('.js') > -1) {
        var inspector = inspect(request, response);
        //兼容老版使用http://www.weiyun.com/disk/js/config_web.js方式加载配置文件
        inspector.setView(__dirname + '/views');

        inspector.get('/disk/js/configs_web.js', function() {
            inspector.sendfile(__dirname + '/../../../conf/configs_web.js');
        });

        inspector.get('/disk/js/configs_appbox.js', function() {
            inspector.sendfile(__dirname + '/../../../conf/configs_appbox.js');
        });

        inspector.get('/disk/js/configs_mobile.js', function() {
            inspector.sendfile(__dirname + '/../../../conf/configs_mobile.js');
        });

        return;
    }
    //禁止手机用户登录后微云web首页，跳转至下载页面
    if(filename === 'index.html' && browser.mobile) {

        page302(request, response, 'http://www.weiyun.com/');
        return;
    }

    if(filename !== 'index.html' && filename !== 'app.php') {
        page302(request, response, 'http://www.weiyun.com/disk/index.html');
        return;
    }

    var uin = request.cookies.uin? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '';
    var indep = request.cookies.indep;//独立密码
    var queryString = request.REQUEST.query;
    var is_appbox = queryString.indexOf('appbox') > -1;
    var is_qzone = queryString.indexOf('qzone') > -1;
    var is_web = !is_appbox;
    var skey = request.cookies.skey;
    var wx_login_ticket = request.cookies.wx_login_ticket;
    var is_debug = queryString.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';
    var useAsync = queryString.indexOf('__noput__') > -1; //是否异步
	var ua = (request.headers['user-agent'] || '').toLocaleLowerCase();
    var m = /(msie\s*|rv:)(\d*)/gi.exec(ua);
    var ieVersion = m && m[2];
	var is_old = (is_appbox || is_qzone || (ieVersion && ieVersion <= 8)) ? true : false; //是否旧版ui
	var isErrorChrome = ua.search(/chrome\/(53|54)/) >= 0; //chrome 53、54版本会有证书过期bug，只能走http
    var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';

    window['g_weiyun_info'] = {
        is_appbox: !!is_appbox,
        is_web: !!is_web,
        is_qzone: !!is_qzone,
        is_debug: !!is_debug,
        server_start_time: +new Date
    };

	if(isErrorChrome) {
		reportMD(179000215, ua.search('chrome/53') >= 0 ? 53 : 54, 0);
	}

    request.once('fail',function(){
        asyncStart({
            is_old: is_old,
            ret: 17001
        });
    });

    if(!skey && !wx_login_ticket && !is_debug) {
        var s_url = is_appbox? 'http://xui.ptlogin2.weiyun.com/cgi-bin/xlogin?appid=527020901&s_url=http%3A%2F%2Fjump.weiyun.com%2F%3Ffrom%3D2001' +
                                '&style=21&target=self&link_target=blank&hide_close_icon=1' : 'http://www.weiyun.com/';
        page302(request, response, s_url);
    } else if(useAsync) {
        asyncStart({
            is_old: is_old
        });
    } else { //先判断是否要走https，IE8下因为域名sni配置问题，会下发错误证书，等运维解决这问题再支持
	    var protocol = 'https://';
	    if(ieVersion && ieVersion <= 8 || isErrorChrome || is_debug) {
		    protocol = 'http://';
	    }
	    var url = protocol + request.headers.host + request.REQUEST.href;
	    logger.debug('ieVersion: ' + ieVersion + ', is_debug: ' + is_debug + ', protocol: ' + protocol + ', isHttps: ' + isHttps + ', url: ' + url);
	    if(isHttps && protocol == 'http://' || !isHttps && protocol == 'https://') {
		    page302(request, response, url);
	    } else {
		    syncStart();
	    }
    }

    function syncStart() {

        loader.batchLoadData().done(function(userInfo, dirFileList, diskConfig) {
	        userInfo.is_old = is_old;
            if(userInfo['is_pwd_open']) {//需要登录，独立密码
                var _data = {
                    ret: 0,
                    rsp_body: userInfo
                };
                if((!indep || indep.length !== 32)) {
                    indepLogin(_data);
                } else {
                    loader.verifyIndep({pwd_md5: indep}).done(function() {
                        if(isAlpha) {
                            userInfo.is_alpha_user = true;
                        }
                        var html = renderer.render(userInfo, dirFileList, diskConfig);
                        responseHtml(html);
                    }).fail(function(msg, ret) {
                        indepLogin(_data);
                    });
                }
            } else {
                if(isAlpha) {
                    userInfo.is_alpha_user = true;
                }
                var html = renderer.render(userInfo, dirFileList, diskConfig);
                responseHtml(html);
            }
        }).fail(function(err) {
            //需要登录
            if(err && ret_msgs.is_sess_timeout(err.ret)) {
            // 是登录不是独立密码登录indepLogin是登录不是独立密码登录indepLogin是登录不是独立密码登录indepLogin，重要的事情说三遍
                login();
            } else {
                asyncStart({
                    is_old: is_old,
                    ret: err.ret
                });
            }
        });
    }
    //独立密码登录
    function indepLogin(data) {
        var html = renderer.renderLogin(data);
        responseHtml(html);
    }
    //登录，意味着后台的sessionid失效而前台的cookie还保留着。此时需要清除cookie, 然后302到官网
    function login() {
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
        var s_url = is_appbox? 'http://xui.ptlogin2.weiyun.com/cgi-bin/xlogin?appid=527020901&s_url=http%3A%2F%2Fjump.weiyun.com%2F%3Ffrom%3D2001' +
                                '&style=21&target=self&link_target=blank&hide_close_icon=1' : 'http://www.weiyun.com/';
        page302(request, response, s_url);
    }
    //异步
    function asyncStart(data) {
        var html = renderer.asyncRender(data);
        responseHtml(html);
    }
    var has_response_end = false;
    //返回数据
    function responseHtml(html) {
        var gzipResponse = gzipHttp.getGzipResponse({
            request: request,
            response: response,
            plug: plug,
            code: 200,
            contentType: 'text/html; charset=UTF-8'
        });
        if(!has_response_end) {
            gzipResponse.write(html);
            gzipResponse.end();
        }
        has_response_end = true;
    }

}