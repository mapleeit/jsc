
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        cookie = lib.get('./cookie'),
        user = require('./user'),
        urls = require('./urls'),
        browser = require('./util.browser'),
        constants = require('./constants'),

        undefined;

    var pay_url = constants.HTTP_PROTOCOL + '//pay.qq.com/h5/index.shtml';
    var appid = 'wx786ab81fe758bec2';
    var pf = {
        'android': 'qq.wyhy.khd',
        'ios': 2015,
        'weixin': appid || cookie.get('wy_appid')
    }
    var config = {
        android: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            pf: pf['android'],
            u2: user.get_uin(),
            ru: encodeURIComponent(location.href)
        },
        ios: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            pf: pf['ios'],
            u2: user.get_uin(),
            ru: encodeURIComponent(location.href)
        },
        h5: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            ru: encodeURIComponent(location.href)
        },
        weixin: {
            m: 'buy',
            c: 'subscribe',
            service: 'wyhyh5',
            appid: '1450005554',
            aid: constants.AID,
            wxAppid2: cookie.get('wy_appid') || appid,
            pf: pf['weixin'],
            openid: cookie.get('openid'),
            sessionid: 'hy_gameid',
            sessiontype: 'wc_actoken',
            openkey: cookie.get('access_token')
        }
    }

    var _validate = function(params) {
        var result = params;
        for (var key in params) {
            if (params[key] == undefined) {
                delete result[key];
            }
        }
        return result;
    }

    return {
        /**
         * 获取支付跳转链接
         * 通过config配置的参数，构造一个完整的url，如果需要自定义参数值，可以覆盖并传参进来
         * 如果不需要默认config的参数项，传null进来即可
         * @example
         * pay_params.get_pay_url( {
         *      aid: 'aid',
         *      n: 12,
         *      pf: null,
         *      ru: 'http://www.weiyun.com/',
         * });
         *
         * @param cfg
         * @returns {URL}
         */
        get_pay_url: function(cfg) {
            var conf = (browser.WEIXIN || user.is_weixin_user())? config['weixin'] :
                         browser.android_WEIYUN?config['android'] :
                         browser.IOS_WEIYUN?config['ios'] : config['h5'];
            $.extend(conf, cfg);
            return urls.make_url(pay_url, _validate(conf), true);
        },

        get_pay_params: function(cfg) {
            var conf = browser.WEIXIN? config['weixin'] :
                browser.android_WEIYUN?config['android'] :
                browser.IOS_WEIYUN?config['ios'] : config['h5'];
            $.extend(conf, cfg);
            return conf;
        }
    }
});