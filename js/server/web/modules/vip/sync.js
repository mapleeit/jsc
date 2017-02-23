module.exports = function(request,response) {
    var path = require('path'),
        ajax = require('weiyun/util/ajax'),
        browser = require('weiyun/util/browser')(),
        config = require('./config'),
        payAids = require('weiyun/util/payAids'),
        gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
        renderer = require('./renderer'),
        tmpl = require('./tmpl'),
        loader = require('./loader'),
        vm = require('./vm');

    var access_token = request.cookies.access_token,
        wx_login_ticket = request.cookies.wx_login_ticket || '',
        wy_uf = request.cookies.wx_login_ticket,
        is_weixin_user = !!(wx_login_ticket && wy_uf),
        skey = request.cookies.skey || '',
        uin = request.cookies.uin ? parseInt(request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        openid = request.cookies.openid || '';

    window['g_weiyun_info'] = {
        is_mobile: browser.mobile || browser.QQ || browser.WEIXIN,
        is_android_app: browser.ANDROID_APP,
        is_ios_app : browser.IOS_APP,
        serv_start_time: new Date(),
        is_weixin_user: is_weixin_user
    };
    /**
     * login_apptoken_type
     * 如果有skey，则为1
     * 如果有wx_login_ticket，则为3
     * 如果都没有，则为0
     * @type {number}
     */
    var login_apptoken_type = skey ? 1 : (wx_login_ticket ? 3 : 0),
        login_apptoken,
        login_apptoken_uid;
    switch (login_apptoken_type) {
        // 既没有微信登陆态，也没有QQ登录态
        case 0:
            break;
        // QQ登陆态
        case 1:
            login_apptoken = skey;
            login_apptoken_uid = uin;
            break;
        // 微信登录态
        case 3:
            login_apptoken = wx_login_ticket;
            login_apptoken_uid = openid;
            break;
    }

    response.setHeader("Set-Cookie", [
        'login_appid=10002; domain=weiyun.com; path=/;',
        'login_apptoken_type=' + login_apptoken_type + '; domain=weiyun.com; path=/;',
        'login_apptoken=' + decodeURIComponent(login_apptoken) + '; domain=weiyun.com; path=/;',
        'login_apptoken_uid=' + login_apptoken_uid + '; domain=weiyun.com; path=/;'
    ]);

    var query = request.REQUEST.query,
        params = query.split('&'),
        from = params[0].split('=');

    var source = 'web',
        aid = payAids.get_default_aid();

    if(from[0] === 'from' && from[1]) {
        aid = payAids.get('web', from[1]);
        source = aid !== payAids.get_default_aid()? from[1] : source;
    }

    // 既没有微信登陆态，也没有QQ登录态
    if(login_apptoken_type === 0) {
        var html= renderer.render(request, Object.assign(vm(), {
            source: source
        }));
        responseHtml(html);
        return;
    }

    loader.batchLoadData().done(function(userInfo, spaceInfo){
        var html;

        html = renderer.render(request, Object.assign(vm({
            userInfo : userInfo,
            spaceInfo : spaceInfo
        }), {
            source: source,
            isWxUser: is_weixin_user,
            aid: aid,
            is_login: true
        }));

        responseHtml(html);

    }).fail(function(err) {
        var msg = err.msg,
            ret = err.ret;
        var errorHtml;
        if(ret == 190011 || ret == 190051 || ret === 190065){
            errorHtml= renderer.render(request, Object.assign(vm(), {
                source: source
            }));
        } else {
            errorHtml = renderer.error({
                msg: msg
            });
        }

        responseHtml(errorHtml);
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