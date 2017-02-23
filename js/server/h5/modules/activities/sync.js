/**
 * 公众号直出模块（后续有需求可作为微云的h5版）
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var tmpl = require('./tmpl'),
        config = require('./config'),
        user = require('weiyun/util/user'),
        ajax    = require('weiyun/util/ajax'),
        pbCmds = require('weiyun/util/pbCmds'),
        reportMD = require('weiyun/util/reportMD'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        pageError = require('weiyun/pageError'),
        page302 = require('weiyun/page302'),
        loader = require('./loader'),
        renderer = require('./renderer'),
        path = require('path'),
        logger = plug('logger'),
        Deferred = plug('pengyou/util/Deferred');

    window.serv_start_time = new Date();//标识请求开始处理的时间
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();
	var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';

    var uin = request.cookies.uin? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '';
    var skey = request.cookies.skey || request.cookies.wx_login_ticket;
    var type = request.cookies.skey? 1 : 3;
    var apptoken = request.cookies.login_apptoken;

    request.once('fail',function(){
        reportMD(178000319, -2, 1);
        pageError(request, response, '服务器繁忙，请重试');
    });

    var isIOSApp = function() {
        var REGEXP_IOS_APP = /(iPad|iPhone|iPod).*? Weiyun\/(3\.7\.[2-9])/;
        var ua = window.request && window.request.headers['user-agent'];
        return REGEXP_IOS_APP.test(ua);
    };

    var login = function() {
        var url = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url="
                + encodeURIComponent((isHttps ? 'https:' : 'http:') + '//h5.weiyun.com/activities')
                + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
        page302(request, response, url);
    };
    //出错页面，这里需要上报error数据
    var error = function(data) {
        if(!data) {
            pageError(request, response, '服务器繁忙，请稍后重试。');
            return;
        }
        var code = data.ret || data.code || -1,
            subcode = data.subcode || '',
            msg = data.msg ||data.message || '服务器繁忙，请稍后重试。';

        reportMD(178000319, code, 1);

        if(code == -3000 || ret_msgs.is_sess_timeout(code)) {
            login();
            return;
        } else if(!data.data || (!data.data.rule && !data.data.list)) {
            msg = msg + '(' + code + '/' + subcode + ')';
        }

        pageError(request, response, msg);
    };

    if(!skey) {
        login();
        return;
    } else if(!!apptoken || (skey && skey !== apptoken)) {
        // @author xixinhuang @date 2016/08/31
        // 这里判断页面里的apptoken是否存在或者skey与apptoken是否相同。否则则把skey再种一次到weiyun.com
        // tips: 这里不直接种在qq.com是因为安卓5.0以上的系统，发qzone.qq.com的CGI时不会带上qq.com的cookie。所以先种weiyun.com，然后用proxy/domain的方法转发。
        response.setHeader("Set-Cookie", [
            'login_appid=10002; domain=weiyun.com; path=/;',
            'login_apptoken_type=' + type + '; domain=weiyun.com; path=/;',
            'login_apptoken_uid=' + uin + '; domain=weiyun.com; path=/;',
            'login_apptoken=' + decodeURIComponent(skey) + '; domain=weiyun.com; path=/;'
        ]);
    }

    if(filename === 'personal') {
        responseHtml(renderer.personalRender());
        return;
    } else if(filename === 'records') {

        loader.batchLoadRecords().done(function(goods, qzRecords, wyRecords) {
            if(qzRecords && qzRecords.code === 0) {
                reportMD(178000319, 0, 0);
                responseHtml(renderer.historyRender(goods, qzRecords, wyRecords));
            } else {
                error(qzRecords);
            }
        }).fail(function(body) {
            error(body);
        });
        return;
    } else if(filename === 'address') {

        loader.batchLoadAddress().done(function(data) {
           if(data && data.code === 0) {
               reportMD(178000319, 0, 0);
               responseHtml(renderer.addressRender(data));
           } else {
               error(data);
           }
        }).fail(function(body) {
            error(body);
        });
        return;
    }

    loader.batchLoadData().done(function(data, data2, data3, data4) {
        var text = data.has_signed_in? '今日已获得' + data.add_point + '积分' : '今天您还未签到';
        var total = data.total_point;
        var html;

        if(!data3 || (data3 && data3.code !== 0)) {
            error(data3);
            return;
        } else if(!data4 || (data4 && data4.code !== 0)) {
            error(data4);
            return;
        }
        html = renderer.render({
            data: data,
            nickname: data2.nick_name || '',
            isWxUser: type === 3,
            text: text,
            totalSize : total,
            goodsList: data3,
            qzRecords: data4,
            userImg : data2 ? data2.head_img_url : ''
        });
        reportMD(178000319, 0, 0);
        responseHtml(html);

    }).fail(function(body) {
        error(body);
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