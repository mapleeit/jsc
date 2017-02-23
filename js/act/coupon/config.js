(function (win, seajs) {
    var protocol = win.location.protocol || 'http:',
        IS_MOBILE = !!win.IS_MOBILE,
        res_host = protocol + '//img.weiyun.com',
        js_base = res_host + '/club/weiyun',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base + '/js-dist/mobile',
            module: js_base + '/js/act/coupon'
        },

        file_list = {
            '@lib@': 'lib.r150827.js',
            '@common@': 'common.r160510.js',
            '@index@': 'index.js'
        },

        // 微云JS模块配置
        alias = win.WY_SEAJS_ALIAS = {

            // 第三方库
            $: IS_MOBILE? 'publics/zepto/zepto-1.1.6.min' : 'publics/jquery/jquery-1.8.3.min',

            // 微云基础库（业务无关）
            lib: 'js_base/lib/' + file_list['@lib@'],
            // 微云基础库（业务相关）
            common: 'js_base/common/' + file_list['@common@'],

            index: 'module/' + file_list['@index@']
        },

        undefined;

    seajs.config(win.WY_SEAJS_CONFIG = {
        charset: 'utf-8',
        debug: 0,
        base: res_host,
        paths: paths,
        alias: alias,
        comboSyntax: ['/c/=', ','] // for seajs-combo
    });

})(window, seajs);