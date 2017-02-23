/**
 * 最近文件列表
 * @author hibincheng
 * @date 2015-08-25
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        browser = common.get('./util.browser'),
        huatuo_speed = common.get('./huatuo_speed'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        app_api = common.get('./app_api'),

        undefined;

    var recent = new Module('recent', {

        render: function(serv_rsp) {
            if(serv_rsp && serv_rsp.ret) {//出错了
                return;
            }

            store.init(serv_rsp);
            ui.render();
            mgr.init({
                ui: ui
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

            //this.report_speed();

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
        },

        report_speed: function() {
            //var render_time = +new Date();
            ////延时以便获取performance数据
            //setTimeout(function() {
            //    huatuo_speed.store_point('1598-1-1', 28, g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 29, g_css_time - g_start_time);
            //    huatuo_speed.store_point('1598-1-1', 30, (g_end_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 31, g_js_time - g_end_time);
            //    huatuo_speed.store_point('1598-1-1', 24, (render_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.report('1598-1-1', true);
            //}, 1000);
        }
    });

    return recent;
});