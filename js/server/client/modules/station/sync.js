/**
 * 微云整站直出,
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var loader      = require('./loader'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        page302     = require('weiyun/page302'),
        inspect     = require('weiyun/util/inspect/inspect'),
        renderer    = require('./renderer'),
        config      = require('./config'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        path        = require('path');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var filename = (pathname || '').split('/').pop();

    if(filename.indexOf('.js') > -1) {
        var inspector = inspect(request, response);
        inspector.setView(__dirname + '/views');

        inspector.get('/disk/js/configs_client.js', function() {
            inspector.sendfile(__dirname + '/../../../conf/configs_client.js');
        });

        return;
    }

    if(filename !== 'index.html' || paths[1] !== 'client') {
        page302(request, response, 'http://www.weiyun.com/client/index.html' + request.REQUEST.query);
        return;
    }

    var queryString = request.REQUEST.query;
    var is_client = paths[1] === 'client';
    var skey = request.cookies.skey;
    var wx_login_ticket = request.cookies.wx_login_ticket;
    var is_debug = queryString.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';
    var m = /msie\s*(\d)/gi.exec(request.headers['user-agent']);
    var ieVersion = m && m[1];

    window['g_weiyun_info'] = {
        is_appbox: false,
        is_client: !!is_client,
        is_web: false,
        is_qzone: false,
        is_debug: !!is_debug,
        server_start_time: +new Date
    };

    request.once('fail',function(){
        asyncStart({
            ret: 17001
        });
    });

    //正常逻辑不应该没有登录态，此处应该抛出异常并上报错误log及告警
    //if(!skey) {
        //跳转登录框有报错，改用提示语
        //var url = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http%3A%2F%2Fwww.weiyun.com%2Fclient%2Findex.html%3Fm%3Dstation';
        //page302(request, response, url);
        //return;
    //    var html = renderer.renderLogin();
    //    responseHtml(html);
    //
    //}

    //return;
    //syncStart();

    function syncStart() {
        loader.batchLoadData().done(function(userInfo) {
            var html = renderer.render(userInfo);
            responseHtml(html);
        }).fail(function(err) {
            if(err && ret_msgs.is_sess_timeout(err.ret)) {//需要登录
                var html = renderer.renderLogin({
                    ret: err.ret,
                    rsp_body: {}
                });
                responseHtml(html);
            } else {
                asyncStart({
                    ret: err.ret
                });
            }
        });
    }

    //异步
    function asyncStart(data) {
        var html = renderer.asyncRender(data);
        responseHtml(html);
    }

    var has_response_end = false;
    //返回数据
    function responseHtml(html) {
        if(has_response_end) {
            return;
        }
        var gzipResponse = gzipHttp.getGzipResponse({
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

    asyncStart({
        ret: 17001
    });
}