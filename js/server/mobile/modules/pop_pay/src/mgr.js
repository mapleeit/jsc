/**
 * Created by maplemiao on 22/01/2017.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        urls = common.get('./urls');

    var browser = require('weiyun/mobile/lib/browser');

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
        },

        on_pay_btn: function (options) {
            var month = options.month || '1',
                monthProductidMap = {
                    '1' : '1', // 1个月的productid为1
                    '3' : '2', // 3个月的为2
                    '6' : '3', // 6个月的为3
                    '12' : '4' // 12个月的为4
                };
            var is_weixin_account = (cookie.get('wy_uf') === '1') || cookie.get('wx_login_ticket');

            if (browser().IOS_WEIYUN) { // ios iap
                location.href = 'weiyun://arouse/' + month + 'month';
            } else if (is_weixin_account) { // android weixin
                urls.redirect(window.location.protocol + '//pay.qq.com/h5/index.shtml', {
                    m: 'buy',
                    c: 'subscribe',
                    service: 'wyhyh5',
                    appid: '1450005554',
                    aid: window.WEIYUN_AID,
                    wxAppid2: 'wx786ab81fe758bec2',
                    pf: 'desktop_m_guest-2001-android-2011-h5_weixin_month_card',
                    openid: cookie.get('openid'),
                    sessionid: 'hy_gameid',
                    sessiontype: 'wc_actoken',
                    openkey: cookie.get('access_token'),
                    as: '1',
                    _newservice: '1',
                    productid: monthProductidMap[month] || 1
                });
            } else { // android qq
                urls.redirect(window.location.protocol + '//pay.qq.com/h5/index.shtml', {
                    m: 'buy',
                    c: 'wyclub',
                    aid: window.WEIYUN_AID,
                    n: month,
                    as: '1'
                });
            }
        }
    });
});