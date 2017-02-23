/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

var page302 = require('weiyun/page302'),
    pageError = require('weiyun/pageError'),
    config = require('./config'),
    ajax = require('weiyun/util/ajax'),
    reportMD = require('weiyun/util/reportMD'),
    gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
    ret_msgs    = require('weiyun/util/ret_msgs');

var get_pathname_module = function (request) {
    var pathname = request.REQUEST.pathname,
        /**
         * host/main_module_string/sub_module_string
         * -> ['main_module_string', 'sub_module_string']
         *
         * @type {string[]}
         */
        pathArr = pathname.split('/').splice(1, 2);

    return pathArr[1];
};


module.exports = function (request, response) {
    var browser = require('weiyun/util/browser')();

    request.once('fail',function(){
        reportMD(179000171, -2, 0);
        pageError(request, response, '服务器繁忙，请重试');
    });

    // 必须在微云客户端中才可以打开
    if (!browser.ANDROID_APP && !browser.IOS_APP) {
        pageError(request, response, '请在微云客户端中打开本页面');
    }

    // filter
    var moduleMap = ['share_list', 'trace_detail'];
    var module = moduleMap.indexOf(get_pathname_module(request)) > -1 ? get_pathname_module(request) : moduleMap[0];
    var modulePath = './' + module + '/sync.js';
    require(modulePath)(request, response);
};