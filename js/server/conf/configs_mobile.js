(function (win, seajs) {
    var
        is_debug = location.search.indexOf('__debug__') > -1,
        //res_host = win.location.protocol + '//imgcache.qq.com'
        res_host = win.IS_TEST_ENV ? win.location.protocol + '//' + win.location.hostname : win.location.protocol + '//img.weiyun.com',
        js_base = res_host + '/club/weiyun/js-dist/mobile',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base,
            module: js_base + '/module',
            box: res_host + '/vipstyle/nr/box',

            // 直出异步同构基础库使用
            weiyun: 'club/weiyun/js/server'
        },


        file_list = {
            '@lib@': 'lib.r150827.js',
            '@common@': 'common.r170105.js',
            '@ftn_preview@': 'ftn_preview.r160122.js',
            '@note@': 'note.r160510.js',
            '@outlink@': 'outlink.r150616.js',
            '@outlink_v2@': 'outlink_v2.r160928.js',
            '@indep_login@': 'indep_login.r160503.js',
            '@signin@': 'signin.r160510.js',
            '@weixin@': 'weixin.r160510.js',
            '@video@': 'video.r150706.js',
            '@recent@': 'recent.r160510.js',
            '@vip@': 'vip.r160810.js',
            '@share_trace@' : 'share_trace.r160926.js',
        },

        css_list = {
            '@weiyun_global_css@' : 'weiyun-global.r150624.css',
            '@weiyun-component-base@' : 'weiyun-component-base.r150210.css',
            '@weiyun-component-confirm@' : 'weiyun-component-confirm.r150210.css',
            '@weiyun-component-tips@' : 'weiyun-component-tips.r150210.css',
            '@weiyun-filetype-icons@' : 'weiyun-filetype-icons.r150210.css',
            '@weiyun_share_css@' : 'weiyun-share.r150727.css',


            //h5新版样式
            '@g-reset@'                     : 'g-reset.css',
            '@g-retina-table@'              : 'g-retina-table.css',
            '@g-retina-border@'             : 'g-retina-border.css',
            '@g-filetype-icons@'            : 'g-filetype-icons.css',
            '@g-filelist@'                  : 'g-filelist.css',
            '@g-bottom-bar@'                : 'g-bottom-bar.css',
            '@g-share-mask@'                : 'g-share-mask.css',
            '@g-component@'                 : 'g-component.css',
            '@g-err@'                       : 'g-err.css',
            '@g-vip-icons@'                 : 'g-vip-icons.css',
            '@wy-share@'                    : 'wy-share.css',
            '@weiyun-weixin-share@'         : 'weiyun-weixin-share.css',
            '@vip-power@'                   : 'vip-power.css'
        },

        // 微云JS模块配置
        alias = win.WY_SEAJS_ALIAS = {

            // 第三方库
            $: is_debug ? 'publics/zepto/zepto-1.1.6' : 'publics/zepto/zepto-1.1.6.min',
            zepto_fx: 'publics/zepto/zepto.fx',
            Swipe: 'club/weiyun/js/publics/plugins/Swipe.js?v123456',
            lib: 'js_base/lib/' + file_list['@lib@'],
            common: 'js_base/common/' + file_list['@common@'],
            console: 'club/weiyun/js/publics/plugins/m-console',
            //module
            ftn_preview: 'module/ftn_preview/' + file_list['@ftn_preview@'],
            note: 'module/note/' + file_list['@note@'],
            outlink: 'module/outlink/' + file_list['@outlink@'], // 分享外链
            outlink_v2: 'module/outlink_v2/' + file_list['@outlink_v2@'], // 分享外链
            weixin: 'module/weixin/' + file_list['@weixin@'], // 微信公众号
            video: 'module/video/' + file_list['@video@'], // H5视频播放
            recent: 'module/recent/' + file_list['@recent@'], // H5视频播放
            indep_login: 'module/indep_login/' + file_list['@indep_login@'],  //独立密码
            signin: 'module/signin/' + file_list['@signin@'],  //H5签到页面
            vip : 'module/vip/' + file_list['@vip@'], // H5会员页面
            share_trace: 'module/share_trace/' + file_list['@share_trace@'], // H5分享链接追溯查看页面

            // 直出异步同构项目
            capacity_purchase: res_host + '/club/weiyun/js/server/mobile/modules/capacity_purchase/index.js',    // H5购买容量
            sign_in: res_host + '/club/weiyun/js/server/mobile/modules/sign_in/index.js',                        // H5签到模块
            pop_pay: res_host + '/club/weiyun/js/server/mobile/modules/pop_pay/index.js',                        // H5客户端弹窗支付开通会员

            //css
            global_css: 'box/web/css-ver/' + css_list['@weiyun_global_css@'],
            component_base_css: 'box/web/css-ver/' + css_list['@weiyun-component-base@'],
            component_confirm_css: 'box/web/css-ver/' + css_list['@weiyun-component-confirm@'],
            component_tips_css: 'box/web/css-ver/' + css_list['@weiyun-component-tips@'],
            filetype_icons_css: 'box/web/css-ver/' + css_list['@weiyun-filetype-icons@'],
            share_css: 'box/web/css-ver/' + css_list['@weiyun_share_css@'],

            //h5新版样式/qz-proj/wy-h5/
            'g-reset'               : 'qz-proj/wy-h5/' + css_list['@g-reset@'],
            'g-retina-table'        : 'qz-proj/wy-h5/' + css_list['@g-retina-table@'],
            'g-retina-border'       : 'qz-proj/wy-h5/' + css_list['@g-retina-border@'],
            'g-filetype-icons'      : 'qz-proj/wy-h5/' + css_list['@g-filetype-icons@'],
            'g-filelist'            : 'qz-proj/wy-h5/' + css_list['@g-filelist@'],
            'g-bottom-bar'          : 'qz-proj/wy-h5/' + css_list['@g-bottom-bar@'],
            'g-share-mask'          : 'box/h5/css/' + css_list['@g-share-mask@'],
            'g-component'           : 'qz-proj/wy-h5/' + css_list['@g-component@'],
            'g-err'                 : 'qz-proj/wy-h5/' + css_list['@g-err@'],
            'g-vip-icons'           : 'box/h5/css/' + css_list['@g-vip-icons@'],
            'wy-share'              : 'qz-proj/wy-h5/' + css_list['@wy-share@'],
            'weiyun-weixin-share'   : 'box/h5/css/' + css_list['@weiyun-weixin-share@'],
            'vip-power'             : 'box/h5/css/' + css_list['@vip-power@']


        },

        re_cdn_request_uri = /\w+\.r\d+\.(?:js|css)/,// 匹配 xxx.r201309131924.js

        undefined;


    seajs.config(win.WY_SEAJS_CONFIG = {
        charset: 'utf-8',
        debug: 0,
        base: res_host,
        paths: paths,
        alias: alias,
        comboExcludes: /.*/,
        comboSyntax: ['/c/=', ','] // for seajs-combo
    });


    //干掉长缓存
    /*seajs.on('fetch', function (req) {
        var uri = req.requestUri || req.uri;
        if (uri) {
            if (uri.indexOf(publics) !== -1 || re_cdn_request_uri.test(uri)) {
                uri += (req.uri.indexOf('?') === -1 ? '?' : '&') + 'max_age=31104000';
            }
            req.requestUri = uri;
        }
    });*/

    is_debug || (win.onerror = function (msg, file, line) {
        win.g_err = {
            msg: msg || '',
            file: file || '',
            line: line || ''
        };
        return true;
    });

})(window, seajs);