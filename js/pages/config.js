(function (win, seajs) {
    var
        protocol = win.location.protocol || 'http:',
        res_host = protocol + '//imgcache.qq.com',
        js_base = res_host + '/club/weiyun/js-dist/web',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base,
            module: js_base + '/module',
            box: res_host + '/vipstyle/nr/box'
        },

        file_list = {
            '@lib@': 'lib.r112901.js',
            '@common@': 'common.r14011401.js',
            '@qq_login@': 'qq_login.r112901.js'
        },

        // 微云JS模块配置
        alias = win.WY_SEAJS_ALIAS = {

            // 第三方库
            $: 'publics/jquery/jquery-1.8.3.min',

            // 微云基础库（业务无关）
            lib: 'js_base/lib/' + file_list['@lib@'],
            // 微云基础库（业务相关）
            common: 'js_base/common/' + file_list['@common@'],

            login : res_host + '/club/weiyun/js/pages/Login.js',
            download : res_host + '/club/weiyun/js/pages/download.js',

            special_log: res_host + '/club/weiyun/js/common/special_log.js'
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