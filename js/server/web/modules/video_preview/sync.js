/**
 * Created by maplemiao on 2016/9/8.
 */

"use strict";

var gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
    tmpl = require('./tmpl'),
    loader = require('./loader'),
    page302 = require('weiyun/page302'),
    browser = require('weiyun/util/browser')(),
    prettysize = require('weiyun/util/prettysize'),
    htmlEscape = require('weiyun/util/htmlEscape');

module.exports = function (request, response) {

    var queryArr = request.REQUEST.query.split('&');
    var params = {};
    var VIDEO_ID_STRING = 'videoID',
        DIR_KEY_STRING = 'dirKey',
        PARENT_DIR_KEY_STRING = 'pdirKey';

    //在H5禁止访问云播页面
    if(browser.mobile) {
        page302(request, response, 'http://www.weiyun.com/mobile/index.html');
        return;
    }

    queryArr.map(function (item, index) {
        params[item.split('=')[0]] = item.split('=')[1];
    });

    var gzipResponse = gzipHttp.getGzipResponse({
        request: request,
        response: response,
        plug: plug,
        code: 200,
        contentType: 'text/html; charset=UTF-8'
    });

    // 如果缺少videoID或者dirKey或pdirKey
    if (!params[VIDEO_ID_STRING] || !params[DIR_KEY_STRING] || !params[PARENT_DIR_KEY_STRING]) {
        gzipResponse.write(tmpl.body({
            err: {
                ret: 10001,
                msg: '参数错误，视频不存在。'
            }
        }));
        gzipResponse.end();
        return;
    }

    loader.batchLoadData(params[VIDEO_ID_STRING], params[DIR_KEY_STRING])
        .done(function (downloadInfo, episodeInfo, videoInfo) {
            gzipResponse.write(tmpl.body({
                downloadInfo: downloadInfo || {},
                episodeInfo: episodeInfo || {},
                videoInfo: videoInfo || {},
                videoID: params[VIDEO_ID_STRING] || '',
                dirKey: params[DIR_KEY_STRING] || '',
                pdirKey: params[PARENT_DIR_KEY_STRING] || '',
                util: {
                    prettysize: prettysize,
                    htmlEscape: htmlEscape
                }
            }));
            gzipResponse.end();
        })
        .fail(function (err) {
            // handle error
            switch (err.ret) {
                case 190011:
                case 190051:
                    err.msg = '登录状态已失效';
                    err.action = 'login';
                    err.actionText = '重新登录';
                    break;
                case 1137:
                    err.msg = '对方分享的链接无效';
                    err.action = 'none';
                    err.actionText = '';
                    break;
                default :
                    err.action = 'reload';
                    err.actionText = '请重试';
            }
            gzipResponse.write(tmpl.body({
                err: err
            }));
            gzipResponse.end();
        });
};