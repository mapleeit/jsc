/**
 *  最近文件列表
 *  @author hibincheng
 *  @date 2015-08-24e
 */
var path        = require('path');
var loader      = require('./loader');
var renderer    = require('./renderer');
var pageError   = require('weiyun/pageError');
var browser     = require('weiyun/util/browser');
var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');

module.exports = function(request,response) {

    var _browser = browser();
    var indep = request.cookies.indep;//独立密码
    var wx_login_ticket = request.cookies.wx_login_ticket;
    var skey = request.cookies.skey;
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var page = paths && paths[2];
    var is_debug = request.REQUEST.query.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';
    window.serv_start_time = new Date();//标识请求开始处理的时间

    request.once('fail',function(){
        pageError(request, response, '服务器繁忙，请重试');
    });

    /**
     * 非debug模式下需要限制访问
     * 1、没有登录态
     * 2、不在微信或手Q打开
     */
    function limit_access() {
        //微信公众号没有登录态需要限制访问
        if(_browser.WEIXIN && !wx_login_ticket) {
            return true;
            //非微信也不是手Q打开
        } else if(!_browser.WEIXIN && !_browser.QQ) {
            return !is_debug;
        }
        return false;
    }

    if(limit_access()) {
        pageError(request, response, '请在微云公众号上访问');
        return;
    }

    loader.batchLoadData().done(function(userInfo, noteList) {
        var html;
        if( userInfo['is_pwd_open']) {
            if((!indep || indep.length !== 32)) {
                html = renderer.renderIndepLogin();
                responseHtml(html);
            } else {
                loader.verifyIndep({pwd_md5: indep}).done(function() {
                    html = renderer.render(noteList);
                    responseHtml(html);
                }).fail(function(msg, ret) {
                    html = renderer.renderIndepLogin();
                    responseHtml(html);
                });
            }
        } else {
            html = renderer.render(noteList);
            responseHtml(html);
        }
    }).fail(function(err) {
        pageError(request, response, err.msg);
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
}