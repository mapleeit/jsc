module.exports = function(request,response) {
    var logger = plug('logger'),
        ajax = require('weiyun/util/ajax'),
        user = require('weiyun/util/user'),
        browser = require('weiyun/util/browser')(),
        config = require('./config'),
        page302 = require('weiyun/page302'),
        pageError = require('weiyun/pageError'),
        payAids = require('weiyun/util/payAids'),
        reportMD = require('weiyun/util/reportMD'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        gzipHttp = require('photo.v7/nodejs/util/gzipHttp'),
        commonTmpl = require('weiyun/h5/modules/commontmpl/tmpl'),
        bodyTmpl = require('weiyun/h5/modules/vip/tmpl');

    var skey = request.cookies.p_skey || request.cookies.skey,
        wx_login_ticket = request.cookies.wx_login_ticket,
        isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';

    var query = request.REQUEST.query,
        params = query.split('&'),
        from = params[0].split('=');

    /**
     * if URL: "h5.weiyun.com/vip?qzone"
     * return download guide page
     */
    if (query.indexOf('qzone') > -1) {
        responseHtml(commonTmpl.common({
            title: '微云会员',
            body: bodyTmpl.qzone_download_guide()
        }));
        return;
    }

    var aid = payAids.get_default_aid();

    if(browser.ANDROID_APP || browser.IOS_APP){
        var key = browser.ANDROID_APP? 'android' : 'ios';
        aid = payAids.get('app', key);
    } else if(from[0] === 'from' && from[1]) {
        aid = payAids.get('h5', from[1]);
    }

    window['g_weiyun_info'] = {
        AID: aid,
        is_client: browser.ANDROID_APP || browser.IOS_APP,
        is_debug: false
    };

    request.once('fail',function(){
        reporter(-2, 0);
        pageError(request, response, '服务器繁忙，请重试');
    });

    var formatDate = function(time) {
        var d = new Date(time);
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    };

    //客户端内嵌页面的登录态失效，上报模调统计，后续再进行监控和优化
    var reporter = function(ret, result) {
        if(browser.ANDROID_APP || browser.IOS_APP) {
            reportMD(179000171, ret, result);
        }
    }

    var login = function() {
        var url;
        // 判断是否在微信浏览器中，如果是跳转微信登陆授权页面
        if (browser.WEIXIN) {
            var redirect_url = 'http://web2.cgi.weiyun.com/weixin_oauth20.fcg?' +
                'g_tk=5381' +
                '&appid=wxd15b727733345a40' +
                '&action=wx_vip_info' +
                '&r_url=' + encodeURIComponent('http://h5.weiyun.com/vip') +
                '&use_r_url=1';
            url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
                'appid=wxd15b727733345a40' +
                '&redirect_uri=' + encodeURIComponent(redirect_url) +
                '&response_type=code' +
                '&scope=snsapi_userinfo' +
                '&state=wx_vip_info' +
                '#wechat_redirect';
        } else {
            url = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&pt_wxtest=1&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url="
                + encodeURIComponent(request.REQUEST.protocol + '://jump.weiyun.qq.com?from=3010')
                + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
        }
        page302(request, response, url);
    };

    // 如果没有登陆态跳转登陆页面
    if(!skey && !wx_login_ticket) {
        login();
        return;
    }

    var data = {
        is_get_weiyun_flag: true
    };

    ajax.proxy(request,response).request({
        method: 'GET',
        l5api: config['l5api'],
        dcapi: config['dcapi'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: data
    }).done(function(data){
        data  = data || {};
        var weiyunVipInfo = data.weiyun_vip_info || {},
            uin = data.uin;

        reporter(0, 0);

        /**
         * if URL: "h5.weiyun.com/vip?iap"
         * used only for APPLE STORE verify
         * return a page like "h5.weiyun.com/vip" except:
         * 1. no report
         * 2. no qboss ad
         * 3. price (12 months -> 118 ; 1 month -> 12)
         * 4. on-pay-button -> jump to a scheme
         */
        var growthScoreList = [0, 0, 600, 1800, 3600, 6000, 10000, 20000, 35000];
        var tmplName = query.indexOf('iap') > -1 ? 'iap' : (query.indexOf('grow') > -1 ? 'grow' : 'body');
        var bodyHtml = bodyTmpl[tmplName]({
            uin: uin,
            type: tmplName,
            isVip: weiyunVipInfo.weiyun_vip,
            nickname: data.nick_name || '',
            avatar: (request.headers['x-client-proto'] ? 'https:' : 'http') + user.qqAvatar(uin, 100),
            oldVip: weiyunVipInfo.old_weiyun_vip,
            growthScoreList: growthScoreList,
            vipLevelInfo: weiyunVipInfo.weiyun_vip_level_info,
            headURL: data.head_img_url,
            vipLogoURL: weiyunVipInfo.weiyun_vip_img_url,
            isWxUser: !!wx_login_ticket,
            expiresDate: weiyunVipInfo.weiyun_end_time? formatDate(weiyunVipInfo.weiyun_end_time) + '到期' : '按月支付中'
        });
        var pageHtml = commonTmpl.common({
            title: tmplName == 'grow'? '成长体系' : '微云会员',
            body: bodyHtml
        });
        responseHtml(pageHtml);
    }).fail(function(msg, ret) {
        reporter(ret, 0);
        if(ret_msgs.is_sess_timeout(ret)){
            login();
        } else {
            pageError(request, response, msg || '服务器繁忙，请重试');
        }
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