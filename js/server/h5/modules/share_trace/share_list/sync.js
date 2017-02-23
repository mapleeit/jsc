/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

var page302 = require('weiyun/page302'),
    pageError = require('weiyun/pageError'),
    commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
    bodyTmpl = require('weiyun/h5/modules/share_trace/share_list/tmpl'),
    config = require('../config'),
    ajax = require('weiyun/util/ajax'),
    reportMD = require('weiyun/util/reportMD'),
    dateformat = require('weiyun/util/dateformat'),
    htmlEscape = require('weiyun/util/htmlEscape'),
    fileType = require('weiyun/util/fileType'),
    gzipHttp = require('photo.v7/nodejs/util/gzipHttp');


module.exports = function (request, response) {
    /**
     * 第一页拉取的分享链接数
     * @constant {number}
     */
    var FIRST_PAGE_COUNT = 20;

    ajax.proxy(request,response).request({
        method: 'GET',
        l5api: config['l5api'],
        dcapi: config['dcapi']['WeiyunShareListGet'],
        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
        cmd: 'WeiyunShareList',
        data: {
            offset: 0,
            size: FIRST_PAGE_COUNT,
            order: 0 // time order : 0 && name order : 1
        }
    }).done(function(data){
        reportMD(179000171, 0, 0);

        data = data || {};
        data.util = {
            dateformat: dateformat,
            htmlEscape: htmlEscape,
            fileType: fileType
        };

        var bodyHtml;
        if (!data.total) {
            bodyHtml = bodyTmpl.empty();
        } else {
            bodyHtml = bodyTmpl.body(data);
        }

        var pageHtml = commonTmpl.common({
            title: '分享链接',
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