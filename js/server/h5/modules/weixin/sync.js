/**
 * 公众号直出模块（后续有需求可作为微云的h5版）
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var tmpl = require('./tmpl'),
        renderer = require('./renderer'),
        loader = require('./loader'),
        config = require('./config'),
        ajax    = require('weiyun/util/ajax'),
        Token   = require('weiyun/util/Token'),
        pbCmds = require('weiyun/util/pbCmds'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        weixinSign = require('weiyun/util/weixinSign'),
        path      = require('path'),
        pageError = require('weiyun/pageError');

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
        return 0;
    });

    /**
     * 非debug模式下需要限制访问
     * 1、没有登录态
     * 2、不在微信或手Q打开
     */
    function limit_access() {
        //微信公众号没有登录态需要限制访问
        if(browser.WEIXIN && !wx_login_ticket && page !== 'login') {
            return true;
        //非微信也不是手Q打开
        } else if(!browser.WEIXIN && !browser.QQ) {
            return !is_debug;
        }
        //手Q公众号里帐号是固定的，没有绑定页和登录页
        if(browser.QQ && (page === 'bind' || page === 'login')) {
            return true;
        }
        return false;
    }

    if(limit_access()) {
        pageError(request, response, '请在微云公众号上访问');
        return;
    }

    //绑定页
    if(page === 'bind') {
        loader.batchLoadInfo().done(function(userInfo, wxUsetInfo) {
            var  html = renderer.renderBind(wxUsetInfo);
            responseHtml(html);

        }).fail(function(err) {
            pageError(request, response, err.msg);
        })
    } else if(page === 'login') {
        var html = renderer.renderLogin();
        responseHtml(html);
    } else {

        //并发加载数据（用户信息，目录文件列表）
        loader.batchLoadData().done(function(userInfo, dirFileList) {
            if(userInfo['is_pwd_open']) {
                if((!indep || indep.length !== 32)) {
                    var html = renderer.renderIndepLogin(userInfo);
                    responseHtml(html);
                } else {
                    loader.verifyIndep({pwd_md5: indep}).done(function() {
                        var html = renderer.render(userInfo, dirFileList, {});
                        responseHtml(html);
                    }).fail(function(msg, ret) {
                        var html = renderer.renderIndepLogin(userInfo);
                        responseHtml(html);
                    });
                }
            } else {
                var html = renderer.render(userInfo, dirFileList, {});
                responseHtml(html);
            }
        }).fail(function(err) {
            pageError(request, response, err.msg);
        });
    }

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