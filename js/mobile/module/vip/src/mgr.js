/**
 * vip mgr module
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        user = common.get('./user'),
        pay_params = common.get('./configs.pay_params'),
        browser = common.get('./util.browser'),

        undefined;

    var mgr = new Mgr('mgr', {
        init: function (cfg) {
            var me = this;

            $.extend(this, cfg);
            me.observe(me.ui);
        },

        on_pay: function (month) {
            /**
             * 这里非常复杂，涉及六个端：
             * android_weixin
             * android_qq
             * ios_weixin
             * ios_qq
             * h5_weixin
             * h5_qq
             *
             * update:
             * 现在ios的两个都走的iap支付，不是h5这边负责了
             */
            location.href = pay_params.get_pay_url({
                n: month
            });
        }
    });

    return mgr;
});