/**
 * H5会员页面
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        user = common.get('./user'),
        store = require('./store'),
        ui = require('./ui'),
        ad = require('./ad.ad'),
        mgr = require('./mgr'),
    
        undefined;
        
    var vip = new Module('vip', {
        init: function (data) {
            store.init(data);
            ui.render();
            mgr.init({
                ui: ui,
                store: store
            });

            // 兼容微信账号登陆：微信账号登陆无uin，拉取不到qboss的广告数据，不加载广告模块
            if (!cookie.get('skey') && cookie.get('wx_login_ticket')) {
                return;
            } else {
                // 广告独立模块
                ad.init();
            }
        },

        iap_init: function () {
            var pay = (function() {
                var cfg = {
                    1: 'weiyun://arouse/1month',
                    3: 'weiyun://arouse/3month',
                    6: 'weiyun://arouse/6month',
                    12: 'weiyun://arouse/12month'
                };
                var schema_url = 'weiyun://arouse/1month';
                var _init = function() {
                    bind_events();
                };
                var bind_events = function() {
                    $('.j-iap-pay-btn').on('click', function() {
                        var month = $(this).attr('data-id');
                        schema_url = cfg[month] || 'weiyun://arouse/1month';
                        location.href = schema_url;
                    });
                    $('.j-grow-btn').on('click', function() {
                        location.href = location.protocol + '//h5.weiyun.com/vip?grow&ios';
                    });
                };
                return {
                    init: _init
                };
            })();
            pay.init();

            // 兼容微信账号登陆：微信账号登陆无uin，拉取不到qboss的广告数据，不加载广告模块
            if (!cookie.get('skey') && cookie.get('wx_login_ticket')) {

            } else {
                // 广告独立模块
                ad.init();
            }
        }
    });

    return vip;
});