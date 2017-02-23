/**
 * 微云-H5-活动-流量券活动
 * @author : maplemiao
 * @time : 2016/8/18
 **/

"use strict";

var page302 = require('weiyun/page302'),
    gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
    pageError = require('weiyun/pageError'),
    ret_msgs    = require('weiyun/util/ret_msgs'),
    reportMD = require('weiyun/util/reportMD'),
    commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
    tmpl = require('./tmpl'),

    undefined;

var config = require('./config'),
    loader = require('./loader');

module.exports = function (request, response) {
    var browser = require('weiyun/util/browser')(); // 这种依赖request的放里面，不然会串台

    var is_mobile = browser.mobile || browser.QQ || browser.WEIXIN,
        wx_login_ticket = request.cookies.wx_login_ticket,

        undefined;

    window['g_weiyun_info'] = {
        is_mobile: is_mobile,
        is_android_app: browser.ANDROID_APP,
        is_ios_app : browser.IOS_APP,
        server_start_time: +new Date
    };

    request.once('fail', function () {
        reportMD(179000171, -2, 0);
        pageError(request, response, '服务器繁忙，请重试');
        return 0;
    });

    // 微信号不参加活动
    if (wx_login_ticket) {
        pageError(request, response, '微信账号不参加本次活动');
        return;
    }

    // 必须在微云客户端中才可以打开
    // if (!browser.ANDROID_APP && !browser.IOS_APP) {
    //     pageError(request, response, '请在微云客户端中打开本页面');
    //     return;
    // }

    var skey = request.cookies.skey,
        p_skey = request.cookies.p_skey,
        type = 1,// 现在p_skey是属于qzone.qq.com的，微云的只校验skey，所以这里没有2只有1
        uin = request.cookies.uin ? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '';

    response.setHeader("Set-Cookie", [
        'login_appid=10002; domain=weiyun.com; path=/;',
        'login_apptoken_type=' + type + '; domain=weiyun.com; path=/;',
        'login_apptoken=' + decodeURIComponent(skey) + '; domain=weiyun.com; path=/;',
        'login_apptoken_uid=' + uin + '; domain=weiyun.com; path=/;'
    ]);

    var login = function() {
        // 客户端内只呼起QQ登陆就可以了，而且这种场景非常少，因为很少有人会在活动页驻留那么久
        var url = "https://ui.ptlogin2.qq.com/cgi-bin/login?" +
            "appid=527020901" +
            "&no_verifyimg=1" +
            "&f_url=loginerroralert" +
            "&pt_wxtest=1" +
            "&hide_close_icon=1" +
            "&s_url=" + encodeURIComponent(request.REQUEST.protocol + '://jump.weiyun.com?from=3036') +
            "&style=9" +
            "&daid=372" +
	        "&low_login=0" +
	        "&qlogin_auto_login=1" +
            "&hln_css=" + encodeURIComponent('https://imgcache.qq.com/vipstyle/nr/box/web/images/wy-logo-qq@2x.png');
        page302(request, response, url);
    };

    if (!skey) {
        login();
        return;
    }

    var gzipResponse;
    var responseHtml = function(html) {
        gzipResponse = gzipResponse || gzipHttp.getGzipResponse({
                request: request,
                response: response,
                plug: plug,
                code: 200,
                contentType: 'text/html; charset=UTF-8'
            });
        gzipResponse.write(html);
        gzipResponse.end();
    };

    loader.batchLoadData()
        .done(function (couponInfo, userInfo) {
            reportMD(179000171, 0, 0);

            var rawCouponList = (couponInfo && couponInfo.coupon_list) || [];
            var validCouponList = [],
                invalidCouponList = [];

            for (var i = 0; i < rawCouponList.length; i++) {
                var item = rawCouponList[i];
                // 0过期，1未使用，2已使用，3已失效（过了使用的当天）
                if (item.flow_coupon_status == 1 || item.flow_coupon_status == 2) {
                    validCouponList.push(item);
                } else if (item.flow_coupon_status == 0 || item.flow_coupon_status == 3) {
                    invalidCouponList.push(item);
                }
            }

            // if(is_mobile) {
                responseHtml(commonTmpl.common({
                    title: '微云活动-流量券',
                    body: tmpl.body({
                        couponTotalCount: couponInfo.coupon_count || 0,
                        validCouponList: validCouponList,
                        invalidCouponList: invalidCouponList
                    })
                }));
            // } else {
            //     responseHtml(tmpl.web_body({
            //             couponTotalCount: couponInfo.coupon_count || 0,
            //             validCouponList: validCouponList,
            //             invalidCouponList: invalidCouponList,
            //             userInfo: userInfo
            //         })
            //     );
            // }

        })
        .fail(function (err) {
            reportMD(179000171, err.ret, 0);

            // 登录态失效，重新跳转登陆
            if(ret_msgs.is_sess_timeout(err.ret)) {
                //H5跳登录，web展示页面
                // if(is_mobile) {
                    login();
                // } else {
                //     responseHtml(tmpl.web_body({
                //             couponTotalCount: 0,
                //             validCouponList: [],
                //             invalidCouponList: []
                //         })
                //     );
                // }
            } else {
                pageError(request, response, err.msg + err.ret);
            }
        })
};