/**
 * Created by maplemiao on 29/11/2016.
 */
"use strict";

var commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
    gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
    retMsgs = require('weiyun/util/ret_msgs'),
    pageError = require('weiyun/pageError'),
    loader = require('./loader'),
    tmpl = require('../tmpl');

var querystring = require('querystring');

module.exports = function (request, response) {

    var access_token = request.cookies.access_token,
        wx_login_ticket = request.cookies.wx_login_ticket || '',
        openid = request.cookies.openid || '';

    var query = querystring.parse(request.REQUEST.query);

    loader.loadUserInfo()
        .done(function (data) {
            responseHtml(commonTmpl.common({
                title: '微信支付H5页面',
                body: tmpl.body(Object.assign(data, {
                    pay_type: query.type || 'vip',
                    pay_params: query.params || ''
                }))
            }))
        }).fail(function (err) {
            var msg = err.msg,
                ret = err.ret;

            if (retMsgs.is_sess_timeout(ret)) {
                pageError(request, response, '登录态失效，请重新登录');
            } else {
                pageError(request, response, msg);
            }
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