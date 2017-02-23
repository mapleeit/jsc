/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

var page302 = require('weiyun/page302'),
    pageError = require('weiyun/pageError'),
    commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
    bodyTmpl = require('weiyun/h5/modules/share_trace/trace_detail/tmpl'),
    config = require('../config'),
    ajax = require('weiyun/util/ajax'),
    reportMD = require('weiyun/util/reportMD'),
    dateformat = require('weiyun/util/dateformat'),
    htmlEscape = require('weiyun/util/htmlEscape'),
    fileType = require('weiyun/util/fileType'),
    gzipHttp = require('photo.v7/nodejs/util/gzipHttp');

var get_query_params = function (request) {
    var query = request.REQUEST.query,
        params = query.split('&');
    var result = {};
    for (var i = 0, len = params.length; i < len; i++) {
        var pair = params[i].split('=');
        result[pair[0]] = pair[1];
    }
    return result;
};

module.exports = function (request, response) {
    ajax.proxy(request,response).request({
        method: 'GET',
        l5api: config['l5api'],
        dcapi: config['dcapi']['WeiyunShareTraceInfoGet'],
        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
        cmd: 'WeiyunShareTraceInfo',
        data: {
            share_key: get_query_params(request)['share_key'],
            list_type: 1, // 1浏览列表 | 2下载列表
            offset: 0,
            get_share_item: true
        }
    }).done(function(data){
        reportMD(179000171, 0, 0);
        data = data || {};
        data.util = {
            dateformat: dateformat,
            htmlEscape: htmlEscape,
            fileType: fileType
        };
        data.params = get_query_params(request);

        var bodyHtml = bodyTmpl.body(data);
        var pageHtml = commonTmpl.common({
            title: '分享详情',
            body: bodyHtml
        });
        responseHtml(pageHtml);
    }).fail(function(msg, ret) {
        reportMD(179000171, ret, 0);
        pageError(request, response, msg || '服务器繁忙，请重试');
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