/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        app_api = common.get('./app_api'),
        account = require('./account'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var weixin = new Module('weixin', {

        render: function(serv_rsp) {
            if(serv_rsp && serv_rsp.ret) { //直出有错误
                return;
            }

            account.init(serv_rsp.userInfo);
            store.init(serv_rsp.data);

            ui.render();
            mgr.init({
                ui: ui,
                info: serv_rsp.signInfo
            });

            var share_data = {
                title: '向您推荐微云',
                desc: '腾讯微云，安全备份共享文件和照片',
                image: 'http://qzonestyle.gtimg.cn/qz-proj/wy-h5/img/icon-logo-96.png',
                url: 'http://h5.weiyun.com/?fromid=101'
            }
            this.set_share(share_data);

            setTimeout(function() {
                require('g-filetype-icons');
                seajs.use(['g-component', 'g-share-mask', 'zepto_fx']);
            },1);
        },

        set_share: function(share_data) {
            var cfg = {
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
                hideMenuItems: ['menuItem:refresh','menuItem:copyUrl','menuItem:setFont','menuItem:setFont', 'menuItem:readMode', 'menuItem:exposeArticle', 'menuItem:favorite'
                    ,'menuItem:openWithSafari', 'menuItem:openWithQQBrowser', 'menuItem:share:email', 'menuItem:share:brand','menuItem:share:QZone']
            }
            if(browser.QQ/* || browser.QZONE*/) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                });
            } else if(browser.WEIXIN) {
                app_api.init(cfg, function() {
                    app_api.setShare(share_data);
                });
            }
        }

    });

    return weixin;
});