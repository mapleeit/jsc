(function (win, seajs) {
    var
        is_debug = location.search.indexOf('__debug__') > -1,
    //res_host = win.location.protocol + '//imgcache.qq.com'
        res_host = win.location.protocol + '//img.weiyun.com',
        js_base = res_host + '/club/weiyun/js-dist/good-photo',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base,
            module: js_base + '/module',
            box: res_host + '/vipstyle/nr/box'
        },


        file_list = {
            '@lib@': 'lib.r150827.js',
            '@common@': 'common.r160510.js',
            '@mv@': 'mv.r161107.js',
            '@outlink@': 'outlink.r160518.js'
        },

        css_list = {
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
            '@vip-power@'                   : 'vip-power.css',
            '@travel@'                      : 'photo-mv-travel-1.css'
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
            outlink: 'module/outlink/' + file_list['@outlink@'], // 分享外链
            mv: 'module/mv/' + file_list['@mv@'], // MV

            //css
            global_css: 'box/web/css-ver/' + css_list['@weiyun_global_css@'],
            component_base_css: 'box/web/css-ver/' + css_list['@weiyun-component-base@'],
            component_confirm_css: 'box/web/css-ver/' + css_list['@weiyun-component-confirm@'],
            component_tips_css: 'box/web/css-ver/' + css_list['@weiyun-component-tips@'],
            filetype_icons_css: 'box/web/css-ver/' + css_list['@weiyun-filetype-icons@'],
            share_css: 'box/web/css-ver/' + css_list['@weiyun_share_css@'],

            //mv模版样式文件
            travel: '' + css_list['@travel@']
        },

        re_cdn_request_uri = /\w+\.r\d+\.(?:js|css)/,// 匹配 xxx.r201309131924.js

        undefined;


    seajs.config(win.WY_SEAJS_CONFIG = {
        charset: 'utf-8',
        debug: 0,
        base: res_host,
        paths: paths,
        alias: alias,
        comboSyntax: ['/c/=', ','] // for seajs-combo
    });

    is_debug || (win.onerror = function (msg, file, line) {
        win.g_err = {
            msg: msg || '',
            file: file || '',
            line: line || ''
        };
        return true;
    });

})(window, seajs);