/**
 * 手Q会员-微云会员合作页面
 * author: xixinhuang
 * date: 16/05/27
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        ajax = require('weiyun/util/ajax'),
        user = require('weiyun/util/user'),
        config = require('./config'),
        loader = require('./loader'),
        page302 = require('weiyun/page302'),
        pageError = require('weiyun/pageError'),
        reportMD = require('weiyun/util/reportMD'),
        browser = require('weiyun/util/browser')(),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
        renderer = require('./renderer');

    var skey = request.cookies.skey,
        wx_login_ticket = request.cookies.wx_login_ticket;
    var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';

    window['g_weiyun_info'] = {
        is_mobile: browser.mobile,
        //is_web: !!is_web,
        is_weixin: browser.WEIXIN,
        is_qq: browser.QQ,
        server_start_time: +new Date
    };

    request.once('fail',function(){
        reporter(-2, 0);
        pageError(request, response, '服务器繁忙，请重试');
    });

    //客户端内嵌页面的登录态失效，上报模调统计，后续再进行监控和优化
    var reporter = function(ret, result) {
        if(browser.ANDROID_APP || browser.IOS_APP) {
            reportMD(179000171, ret, result);
        }
    }

    var login = function() {
        var url = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&pt_wxtest=1&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url="
            + encodeURIComponent(request.REQUEST.protocol + '://jump.weiyun.qq.com?from=3014')
            + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
        page302(request, response, url);
    }

    //QQ会员活动，web页面的fusion支付组件暂不支持https，先强制http
    var protocol = 'http://';
    if(isHttps && !browser.mobile) {
        page302(request, response, protocol + request.headers.host + request.REQUEST.href);
        return;
    }

    if(browser.WEIXIN || (browser.mobile && wx_login_ticket && !skey)) {
        pageError(request, response, '暂不支持微信，请用手Q打开');
        return;
    } else if(!skey && browser.mobile) {
        login();
        return;
    }

    loader.batchLoadData().done(function(userInfo, QQVipInfo) {
        reporter(0, 0);
        var html,
            data = {
            userInfo: userInfo,
            QQVipInfo: QQVipInfo
        };
        if(browser.mobile) {
            html = renderer.mobile_render(data);
        } else {
            html = renderer.web_render(data);
        }
        responseHtml(html);
    }).fail(function(err) {
        reporter(err.ret, 0);
        var html;
        if((err.ret === 190011 || err.ret === 190051)) {
            if(browser.mobile) {
                login();
                return;
            }
            html = renderer.login();
        } else {
            html = renderer.fail(err);
        }
        responseHtml(html);
    });

    var has_response_end =false;
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
};