/**
 * Created by maplemiao on 05/12/2016.
 */
"use strict";

module.exports = function(request,response) {
    var logger = plug('logger'),
        ajax = require('weiyun/util/ajax'),
        user = require('weiyun/util/user'),
        inline = require('weiyun/util/inline'),
        reportMD = require('weiyun/util/reportMD'),
        browser = require('weiyun/util/browser')(),
        page302 = require('weiyun/page302'),
        pageError = require('weiyun/pageError'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
        commonTmpl = require('weiyun/mobile/tmpl/commontmpl/tmpl'),
        config = require('./config'),
        loader = require('./loader'),
        tmpl = require('../tmpl'),
        vm = require('../src/vm');

    var querystring = require('querystring');

    request.once('fail',function(){
        reportMD(178000319, -2, 1);
        pageError(request, response, '服务器繁忙，请重试');
    });

    /**
     * 登陆跳转
     */
    var login = function() {
        var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';
        var url = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&daid=372&s_url="
            + encodeURIComponent((isHttps ? 'https:' : 'http:') + '//h5.weiyun.com/sign_in')
            + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
        page302(request, response, url);
    };
    /**
     * 被后台打击，跳验证码页面
     */
    var captcha = function () {
        var htmlString = commonTmpl.common({
            title: '签到验证',
            body: tmpl.captcha({
                isHttps: request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https'
            }),
            cssString: ''
        });

        responseHtml(htmlString);
    };
    /**
     * 错误处理
     * @param data
     */
    var error = function(data) {
        if(!data) {
            pageError(request, response, '服务器繁忙，请稍后重试。');
            return;
        }
        var code = data.ret || data.code || -1,
            subcode = data.subcode || '',
            msg = data.msg ||data.message || '服务器繁忙，请稍后重试。';

        reportMD(178000319, code, 1);

        if(code == -3000 || ret_msgs.is_sess_timeout(code)) {
            login();
            return;
        } else if (code === 190054) { // 被后台打击，这种情况弹验证码页面
            captcha();
            return;
        } else if(!data.data || (!data.data.rule && !data.data.list)) {
            msg = msg + '(' + code + '/' + subcode + ')';
        }

        pageError(request, response, msg);
    };


    window['g_weiyun_info'] = {
        is_mobile: browser.mobile || browser.QQ || browser.WEIXIN,
        is_android_app: browser.ANDROID_APP,
        is_ios_app : browser.IOS_APP,
        serv_start_time: +new Date
    };

    var skey = request.cookies.skey || '',
        wx_login_ticket = request.cookies.wx_login_ticket || '',
        uin = request.cookies.uin ? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        openid = request.cookies.openid || '';
    /**
     * login_apptoken_type
     * 如果有skey，则为1
     * 如果有wx_login_ticket，则为3
     * 如果都没有，则为0
     * @type {number}
     */
    var login_apptoken_type = skey ? 1 : (wx_login_ticket ? 3 : 0),
        login_apptoken,
        login_apptoken_uid;
    switch (login_apptoken_type) {
        // 如果既没有微信登陆态，也没有QQ登录态，跳转QQ登陆页面
        case 0:
            login();
            break;
        // QQ登陆态
        case 1:
            login_apptoken = skey;
            login_apptoken_uid = uin;
            break;
        // 微信登录态
        case 3:
            login_apptoken = wx_login_ticket;
            login_apptoken_uid = openid;
            break;
    }

    response.setHeader("Set-Cookie", [
        'login_appid=10002; domain=weiyun.com; path=/;',
        'login_apptoken_type=' + login_apptoken_type + '; domain=weiyun.com; path=/;',
        'login_apptoken=' + decodeURIComponent(login_apptoken) + '; domain=weiyun.com; path=/;',
        'login_apptoken_uid=' + login_apptoken_uid + '; domain=weiyun.com; path=/;'
    ]);

    var captcha_ticket = querystring.parse(request.REQUEST.query)['captcha_ticket'] || '';

    // index here
    loader.batchLoadData(captcha_ticket).done(function (data) {
        reportMD(178000319, 0, 0);
        var cssStr = inline.css([
                'app-checkin-exchange',
                'app-checkin-personal',
                'app-checkin-history',
                'app-checkin-edit',
                'app-checkin-address',
                'app-checkin-order',
                'app-checkin-order-result',
                'app-checkin-detail',
                'g-component'
            ], true) + inline.css(['mobile-select-area','dialog']);

        var htmlString = commonTmpl.common({
            title: '签到活动',
            body: tmpl.index({
                rawData: data,
                vmData: vm(data).getIndexModel()
            }),
            cssString: cssStr
        });

        responseHtml(htmlString);
    }).fail(function (err) {
        error(err)
    });


    var has_response_end = false;
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