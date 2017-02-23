(function (win, seajs) {
    var
        is_debug = win.IS_DEBUG = /\s*debug=on\b/.test(document.cookie) || location.search.indexOf('__debug__') > -1,
    //res_host = win.location.protocol + '//imgcache.qq.com'
        res_host = win.IS_TEST_ENV ? win.location.protocol + '//' + win.location.hostname : win.location.protocol + '//img.weiyun.com',
        js_base = res_host + '/club/weiyun/js-dist/client',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base,
            module: js_base + '/module',
            box: res_host + '/vipstyle/nr/box'
        },

        file_list = {
            '@lib@': 'lib.r150415.js',
            '@common@': 'common.r160822.js',
            '@station@': 'station.r160128.js',
	        '@note@': 'note.r160128.js',
            '@file_qrcode@':'file_qrcode.r150609.js',
	        '@share_enter@': 'share_enter.r151225.js'
        },

        css_list = {
            '@base_css@': 'base.r150609.css',
            '@base_delay_css@': 'base-delay.r161202.css',
            '@to_singin_css@': 'to-signin-2.0.r140603.css',
            '@upbox_css@': 'upbox.r160623.css',
            '@appbox_upbox_css@': 'appbox-upbox.r160715.css',
            '@weixin_css@': 'weixin-web.css',
            '@upload_install_css@': 'plugin.r140603.css',
            '@p_web_css@': 'p-web.r161017.css',
            '@p_web_delay_css@': 'p-web-delay.r150915.css',
            '@p_appbox_css@': 'p-appbox.r161017.css',
            '@p_appbox_delay_css@': 'p-appbox-delay.r150720.css',
            '@photo_guide_css@': 'photo-guide.css',
            '@offline_guide_css@': 'offline-guide.css',
            '@web_clipboard_css@': 'p-web-clipboard.r140708.css',
            '@app_download_css@': 'app-download.r150810.css',
            '@office_css@': 'office.r140520.css',
            '@dimensional_code_css@': 'dimensional-code.r140603.css',
            '@note_css@': 'note.r160114.css',
            '@link_css@': 'link.r140811.css',
            '@qzonelogin_css@': 'qzonelogin.css'
        },

    // 微云JS模块配置
        alias = win.WY_SEAJS_ALIAS = {

            // 第三方库
            $: is_debug ? 'publics/jquery/jquery-1.8.3' : 'publics/jquery/jquery-1.8.3.min',
            jquery_ui: 'publics/jquery-plugins/jquery-ui-1.9.2-112901',
            jquery_history: 'publics/jquery-plugins/jquery.history',
            jquery_jplayer: 'publics/jquery-plugins/jquery.jplayer',
            zclip: 'publics/jquery-plugins/jquery.zclip.1.1.1',
            wy_zclip: 'publics/plugins/ZeroClipboard/ZeroClipboard-1.1.7.js?v140423',

            // 微云基础库（业务无关）
            lib: 'js_base/lib/' + file_list['@lib@'],
            // 微云基础库（业务相关）
            common: 'js_base/common/' + file_list['@common@'],

            main: 'js_base/common/' + file_list['@common@'],

            //一些广告及客户端下载地址配置
            ad_config: is_debug ? 'club/qqdisk/web/data/ad_config.js' : 'qzone/qzactStatics/configSystem/data/65/config1.js',

            // 微云业务模块(按需加载；由JSC打包生成)
            station: 'module/station/' + file_list['@station@'],
	        note: 'module/note/' + file_list['@note@'],
	        share_enter: 'module/share_enter/' + file_list['@share_enter@'], //分享入口
            file_qrcode: 'module/file_qrcode/' + file_list['@file_qrcode@'], //二维码

            // CSS  css_url('/css/disk', true, ['v130807', 'v130828']),
            base_css: 'box/css-ver/' + css_list['@base_css@'],
            base_delay_css: 'box/css-ver/' + css_list['@base_delay_css@'],
            to_singin_css: 'box/css-ver/' + css_list['@to_singin_css@'],
            upbox_css: 'box/css-ver/' + css_list['@upbox_css@'],
            appbox_upbox_css: 'box/css-ver/' + css_list['@appbox_upbox_css@'],
            weixin_css: 'box/web/css/' + css_list['@weixin_css@'],
            upload_install_css: 'box/css-ver/' + css_list['@upload_install_css@'],
            p_web_appbox_css: 'box/css-ver/' + css_list['@p_web_css@'],
            p_client_delay_css: 'box/css-ver/' + css_list['@p_web_delay_css@'],
            photo_guide_css: 'box/css/' + css_list['@photo_guide_css@'],
            offline_guide_css: 'box/css/' + css_list['@offline_guide_css@'],
            clipboard_css: 'box/css-ver/' + css_list['@web_clipboard_css@'],
            app_download_css: 'box/css-ver/' + css_list['@app_download_css@'],
            office_css: 'box/css-ver/' + css_list['@office_css@'],
            dimensional_code_css: 'box/css-ver/' + css_list['@dimensional_code_css@'],
            note_css: 'box/css-ver/' + css_list['@note_css@'],
            link_css: 'box/css-ver/' + css_list['@link_css@'],
            qzonelogin_css: 'box/css-ver/' + css_list['@qzonelogin_css@']
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


    //干掉长缓存
    seajs.on('fetch', function (req) {
     var uri = req.requestUri || req.uri;
     if (uri) {
     if (uri.indexOf(publics) !== -1 || re_cdn_request_uri.test(uri)) {
     uri += (req.uri.indexOf('?') === -1 ? '?' : '&') + 'max_age=86400';
     }
     req.requestUri = uri;
     }
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