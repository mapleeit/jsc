/**
 * Created by maplemiao on 14/11/2016.
 */
"use strict";

module.exports = function(request,response) {
    var logger = plug('logger'),
        ajax = require('weiyun/util/ajax'),
        user = require('weiyun/util/user'),
        browser = require('weiyun/util/browser')(),
        config = require('./config'),
        loader = require('./loader'),
        page302 = require('weiyun/page302'),
        pageError = require('weiyun/pageError'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
        commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
        bodyTmpl = require('../tmpl'),
        vm = require('../src/vm');

    request.once('fail',function(){
        pageError(request, response, '服务器繁忙，请重试');
    });


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
        // 如果既没有微信登陆态，也没有QQ登录态，跳转QQ登陆页面，目前无H5微信登陆页
        case 0:
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

    var is_iap = (request.REQUEST.query).indexOf('iap') > -1;

    loader.batchLoadData()
        .done(function (userInfo, spaceInfo) {
            var bodyHtml;
            if (is_iap) {
                bodyHtml = bodyTmpl.iap(vm({
                    userInfo: userInfo,
                    spaceInfo: spaceInfo
                }));
            } else {
                bodyHtml = bodyTmpl.body(vm({
                    userInfo: userInfo,
                    spaceInfo: spaceInfo
                }));
            }

            var pageHtml = commonTmpl.common({
                title: '容量购买',
                body: bodyHtml
            });
            responseHtml(pageHtml);
        }).fail(function (err) {
            pageError(request, response, err.msg);
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