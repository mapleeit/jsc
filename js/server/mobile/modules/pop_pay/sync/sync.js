/**
 * Created by maplemiao on 22/01/2017.
 */
"use strict";

module.exports = function (request, response) {
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
        commonTmpl = require('weiyun/mobile/tmpl/commontmpl/tmpl');

    var loader = require('./loader'),
        tmpl = require('../tmpl'),
        vm = require('../src/vm');

    request.once('fail',function(){
        reportMD(179000213, -2, 1);
        pageError(request, response, '服务器繁忙，请重试');
    });

    var skey = request.cookies.skey || '',
        wx_login_ticket = request.cookies.wx_login_ticket || '',
        uin = request.cookies.uin ? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        openid = request.cookies.openid || '',
        wy_uf = request.cookies.wy_uf || 0; // 0 -> qq, 1 -> wx


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

    // index here
    loader.batchLoadData().done(function (data) {
        reportMD(179000213, 0, 0);
        var cssStr = inline.css(['app-pop-pay'], true);

        var htmlString = commonTmpl.common({
            title: '支付浮层',
            body: tmpl.body(vm(data, wy_uf).getModel()),
            cssString: cssStr
        });

        responseHtml(htmlString);
    }).fail(function (err) {
        error(err)
    });


    function login() {
        pageError(request, response, '登录态出错，请检查cookie');
    }

    /**
     * 直出拉取数据出错
     * @param err
     */
    function error(err) {
        reportMD(179000213, -3, 1);
        pageError(request, response, '拉取数据失败，请重试');
    }

    /**
     * function: responseHtml
     */
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