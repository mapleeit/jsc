/**
 * 微信公众号领取容量活动
 * @param plug
 * @param request
 * @param response
 */
module.exports = function(request, response) {
    var path        = require('path');
    var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');
    var qzoneAjax   = plug('qzone/ajax');
    var tmpl        = require('./tmpl');
    var page302 = require('weiyun/page302');

    var wx_login_ticket = request.cookies.wx_login_ticket;
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');

    var loginCode = [190061,190062,190063,190065];

    request.once('fail',function(){
        responseHtml(tmpl.fail({
            type: 'err',
            msg: '服务器繁忙，请重试'
        }));
    });

    //禁掉微信公众号送容量活动，导到手机官网
    page302(request, response, 'http://www.weiyun.com');
    return;

    var errMap = {
        214101: '活动已过期！',
        214102: '您已参加过该活动！',
        1000: '因系统原因暂时未能成功领取！'
    }
    //console.log('wx:' ,wx_login_ticket)
    if(!wx_login_ticket) {
        var html = tmpl.login();
        responseHtml(html);
    } else {
        qzoneAjax.proxy(window.request, window.response).request({
            type: 'get',
            url: 'http://web2.cgi.weiyun.com/wx_oa_web.fcg',
            l5api: plug('config').l5api['web2.cgi.weiyun.com'],
            dcapi: {
                fromId			: 211100053,
                toId			: 211100054,
                interfaceId		: 176000323
            },
            data: {
                cmd: 'add_space',
                callback: 'jsonCallback'
            },
            formatCode: function(result) {
                if(result) {
                    return result.retcode;
                }
                return -9999;
            },
            dataType: 'json',
            jsonpCallback:'jsonCallback'
        }).done(function(data) {
            var retcode = data.result && data.result.retcode;
            if(data.result && retcode == 0) {
                var html = tmpl.success();
                responseHtml(html);
            } else if(data.result && loginCode.indexOf(retcode) > -1){
                var html = tmpl.login();
                responseHtml(html);
            } else {
                var html = tmpl.fail(errMap[retcode] ||errMap[1000]);
                responseHtml(html);
            }
        }).fail(function() {
            var html = tmpl.fail(errMap[1000]);
            responseHtml(html);
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