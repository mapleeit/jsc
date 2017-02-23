define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        huatuo_speed = common.get('./huatuo_speed'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var qqvip = new Module('qqvip', {

        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }

            store.init(serv_rsp);
            ui.init();
            mgr.init({
                store: store,
                view: ui
            });
            this.set_share();
        },

        set_share: function() {
            var share_url = location.href.indexOf('#') > -1? location.href.slice(0, location.href.indexOf('#')) : location.href,
                share_desc = '超级会员、QQ会员专享微云优惠购特权，首次开通低至1元！',
                share_icon = 'https://qzonestyle.gtimg.cn/qz-proj/wy-h5/img/icon-share-vip-pic.jpg',
                share_data = {
                    title: '超低价开通微云会员',
                    desc: share_desc,
                    url: share_url,
                    image: share_icon
                },
                _data = {
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'previewImage'
                    ],
                    hideMenuItems: []
                };
            if(browser.QQ || browser.QZONE) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                });
            } else if(browser.WEIXIN) {
                //share域名下加载引入js sdk有冲突问题，必须得通过require引入
                require.async(constants.HTTP_PROTOCOL + '//res.wx.qq.com/open/js/jweixin-1.0.0.js', function (res) {
                    wx = res;
                    app_api.init(_data, function() {
                        app_api.setShare(share_data);
                    });
                });
            }
        }
    });

    return qqvip;
});