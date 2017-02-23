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
    var queryString = request.REQUEST.query;
    var is_client = paths[1] === 'client';
    var is_debug = queryString.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';

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

	syncStart();

    function syncStart() {
        loader.batchLoadData().done(function(userInfo) {
            var html = renderer.render();
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
        var gzipResponse = gzipHttp.getGzipResponse({
            request: request,
            response: response,
            plug: plug,
            code: 200,
            contentType: 'text/html; charset=UTF-8'
        });
        if(!has_response_end) {
            gzipResponse.write(html);
            gzipResponse.end();
        }
        has_response_end = true;
    }
}