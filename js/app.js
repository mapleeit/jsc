/*!
 * 微云初始化JS
 */
(function () {

    document.domain = 'weiyun.com';

    var is_appbox = !!window.IS_APPBOX, // 是否appbox，全局变量，在页面中声明
        is_debug = !!window.IS_DEBUG,   // 是否debug模式，全局变量，在页面中声明
        res_host = 'http://imgcache.qq.com',
        default_js_base = res_host + '/club/weiyun/js',     // 默认JS目录 imgcache.qq.com/club/weiyun/js
        default_css_base = res_host + '/vipstyle/nr/box',   // 默认css目录 imgcache.qq.com/vipstyle/nr/box

        web_js_base = default_js_base + '-dist/web',        // web JS 目录
        appbox_js_base = default_js_base + '-dist/appbox',  // appbox JS 目录 imgcache.qq.com/club/js-dist/appbox

        js_suffix = '.index.js',
        web_css_suffix = '-2.0.css',                        // web暂时使用默认*-2.0.css后缀名
        appbox_css_suffix = '.appbox.css',                  // appbox使用*.appbox.css

        ver_index = is_appbox ? 1 : 0,

        /**
         * 获取模块绝对路径
         * @param {String} path 模块相对路径
         * @param {Boolean} [from_dist] 是否使用dist中的文件，默认false
         * @param {String|String[]} [vers] 文件版本号，默认无
         */
            mod_url = function (path, from_dist, vers) {
            var
                js_base = from_dist ? (is_appbox ? appbox_js_base : web_js_base) : default_js_base,
                ver = vers ? (typeof vers === 'string' ? vers : vers[ver_index]) : null,
                args = ver ? '?' + ver : '',
                real_path = path + path.substr(path.lastIndexOf('/'));

            return [js_base, real_path, js_suffix, args].join('');
        },
        css_url = function (path, diff, vers) {
            var ver = vers ? (typeof vers === 'string' ? vers : vers[ver_index]) : null,
                args = ver ? '?' + ver : '';
            return [default_css_base, path, diff && is_appbox ? appbox_css_suffix : web_css_suffix, args].join('');
        },

    // 微云JS模块配置
        alias = window.WY_SEAJS_ALIAS = {
            // 第三方库
            $: default_js_base + (is_debug ? '/lib/_src/jquery-1.8.3.js' : '/lib/jquery-1.8.3.min.js?max_age=31104000'),
            jquery_ui: default_js_base + '/lib/jquery-plugins/jquery-ui-1.9.2.js?max_age=31104000',
            jquery_history: default_js_base + '/lib/jquery-plugins/jquery.history.js?max_age=31104000&v130527',
            jquery_jplayer: default_js_base + '/lib/jquery-plugins/jquery.jplayer.js?max_age=31104000',
            zclip: default_js_base + '/lib/jquery-plugins/jquery.zclip.1.1.1.js?max_age=31104000',
            zclip_new: default_js_base + '/lib/jquery-plugins/ZeroClipboard.1.1.7.js?max_age=31104000',


            // 微云基础库（业务无关）
            lib: mod_url('/lib', true, ['v130725', 'v130828']),
            // 微云基础库（业务相关）
            common: mod_url('/common', true, ['v130912', 'v130911']),

            // 微云业务模块(按需加载；由JSC打包生成)
            main: mod_url('/module/main', true, ['v130827', 'v130828']),
            disk: mod_url('/module/disk', true, ['v1300917', 'v130917']), // 网盘
            recycle: mod_url('/module/recycle', true, ['v130821', 'v130828']), // 回收站
            photo: mod_url('/module/photo_bridge', true, ['v130725', 'v130828']), // 相册
            recent: mod_url('/module/recent', true, ['v130809', 'v130828']), //最近更新文件
            share: mod_url('/module/share', true, ['v130903', 'v130903']), //外链管理
            search: mod_url('/module/search', true), //搜索
            indep_setting: mod_url('/module/indep_setting'),  // 独立密码设置框
            indep_login: mod_url('/module/indep_login', false, 'v130624'),  // 独立密码验证框
            qq_login: mod_url('/module/qq_login', true),  // QQ登录框
            qd_migration: mod_url('/module/qd_migration'),  // QQ网盘迁移用户提示
            net_fav_migration: mod_url('/module/net_fav_migration'), // 网络收藏夹迁移用户提示
            image_preview: mod_url('/module/image_preview', true, ['v130821', 'v130828']),  // 图片预览
            third_party_iframe: mod_url('/module/third_party_iframe', false, ['v130711', 'v130828']), // 第三方页面iframe
            compress_file_iframe: mod_url('/module/compress_file_iframe', true, ['v130711', 'v130828']),  // 压缩包预览
            compress_file_preview: mod_url('/module/compress_file_preview', true, ['v130827', 'v130828']),     // 压缩包预览（运行在iframe中）
            client_download: mod_url('/module/client_download', false, 'v20130607'), // 下载各种客户端（appbox）
            doc_preview: mod_url('/module/doc_preview', false, 'v130628'), // 文档预览
            full_screen_preview: mod_url('/module/full_screen_preview', false, 'v20130715'), //全屏预览
            upload: mod_url('/module/upload', true, ['v130917', 'v130917']),  //新增的上传模块
            add_wy_appbox: mod_url('/module/add_wy_appbox'), //appbox添加微云到主面板
            install_upload_plugin: mod_url('/module/install_upload_plugin', false, 'v20130819'),  //新增上传控件安装模块

            // 非JSC打包模块
            downloader: default_js_base + '/module/downloader.js?v130911', // 下载模块
            ftn_dns_detect: default_js_base + '/module/ftn_dns_detect.js?v20130624', // DNS劫持检测
            webkit_download_manager: default_js_base + '/module/webkit_download_manager.js',
            download_route: default_js_base + '/module/download.route.js?v130911',
            XS: default_js_base + '/common/XS.js',

            // CSS  css_url('/css/disk', true, ['v130807', 'v130828']),
            webbase_css: default_css_base + '/css/webbase-2.0.css?v130807',
            disk_css: default_css_base+'/css/disk-2.0.css?v130807',
            to_singin_css: default_css_base + '/css/to-signin-2.0.css?v130711',
            upbox_css: default_css_base + '/css/upbox.css',
            appbox_upbox_css: default_css_base + '/css/appbox-upbox.css?v130911',
            weixin_css: default_css_base + '/web/css/weixin-web.css',
            upload_install_css: default_css_base + '/css/plugin.css',
     //       p_web:default_css_base + '/css/p-web.css',
     //       p_appbox:default_css_base + '/css/p-appbox.css',
            p_web_appbox: default_css_base +(is_appbox? '/css/p-appbox.css':'/css/p-web.css') //jinfu 新增的css类 依赖 webbase-2.0和disk-2.0
        },
        g_start_time = window.g_start_time || new Date();


    seajs.config({
        charset: 'utf-8',
        debug: 0,
        // base: js_base,
        alias: alias
    });


    // 初始化微云
    seajs.use(['$', 'lib', 'common', 'main', 'webbase_css'], function ($, lib, common, main) {
        var
            console = lib.get('./console'),
            constants = common.get('./constants'),
            wy_init = common.get('./init.init'),
            m_speed = common.get('./m_speed'),
            js_css_time = new Date(),

            main_mod = main.get('./main'),
            cookie, query_user,
            cookie_configs,
            inited = false,
            orig_uin, orig_skey, orig_indep;



        function init() {
            if (inited) {
                return;
            }
            inited = true;
            // 测速配置
            m_speed.config({
                base: {
                    __flags: '7830-4-2',
                    js_css: 1,
                    page: 2,
                    image_preview: 5
                },
                disk: {
                    __flags: '7830-4-1',
                    root_list_show: 2,
                    thumb: 3,
                    js_css: 4
                },
                recycle: {
                    __flags: '7830-4-3',
                    list_show: 2,
                    js_css: 3
                },
                recent: {
                    __flags: '7830-4-4',
                    js_css: 1,
                    first_batch_data: 2
                },
                share: {
                    __flags: '7830-4-6',
                    js_css: 1,
                    first_page_show: 2
                }
            });


            // 初始化一些全局兼容性修正
            wy_init();


            // 延迟加载一些模块
            main_mod
                // 默认模块
                .set_default_module('disk')
                // 模块hash参数名
                .set_module_hash_key('m')
                // 设置模块路径（供异步载入模块使用）
                .set_async_modules_map({
                    disk: './disk',
                    recycle: './recycle',
                    recent: './recent',
                    photo: './photo_bridge',
                    share: './share'

                });


            //$(function () {
            // 初始化 main 模块
            main_mod.render();


            try {
                // 基础JS_CSS加载完成
                m_speed.set('base', 'js_css', g_start_time, js_css_time);
                // main 模块初始化完成后，记录页面加载完成的时间
                m_speed.set('base', 'page', g_start_time, new Date());
                // 发送基础页面的所有统计参数
                m_speed.send('base');
            } catch (e) {
            }
            //});
        }

        if (constants.IS_WRAPPED) { // 内嵌在qzone时，自己的登录态要清空
            cookie = lib.get('./cookie');
            query_user = common.get('./query_user');
            cookie_configs = {
                raw: true,
                domain: document.domain,
                path: '/'
            };
            // 记录原来的uin、skey、indep，如果外界同步的帐号一样，则直接复用
            orig_uin = cookie.get('uin', cookie_configs);
            orig_skey = cookie.get('skey', cookie_configs);
            orig_indep = cookie.get('indep', cookie_configs);
            query_user.destroy();
            seajs.use(['XS'], function (XS) {
                var global_function = common.get('./global.global_function'),
                    access_check = main.get('./access_check');

                // 嵌入qzone时，使用qzone的登录模块，同时传递当前的uin与skey，如果和外部的相同，表明已经失效。
                // 保存上次同步过来的cookie，如果当前cookie为空，表明可能是skey超时了，被微云清除了，这时要传递上次的cookie
                var last_uin = '', last_skey = '';
                var login_callback, login_scope;
                access_check.on('external_login', function (callback, scope) {
                    login_callback = callback;
                    login_scope = scope;
                    xs.send_message(['requirelogin', cookie.get('uin', cookie_configs) || last_uin, cookie.get('skey', cookie_configs) || last_skey]);
                });
                // 供外界传递新的登录态并知会
                global_function.register('xs_set_login_state', function (uin, skey) {
                    console.log('sync cookie ' + uin);
                    // 同步登录态
                    cookie.set('uin', uin, cookie_configs);
                    cookie.set('skey', skey, cookie_configs);

                    // 如果帐号一致，保留独立密码
                    if (orig_indep && uin === orig_uin && skey === orig_skey) {
                        cookie.set('indep', orig_indep, cookie_configs);
                    }

                    last_uin = uin;
                    last_skey = skey;

                    // IE下可能设置失败，如果失败，IE6尝试从缓存刷新可以解决（有p3p声明的情况下），其它情况无解，只能加载失败而中止
                    var now_uin = cookie.get('uin', cookie_configs),
                        now_skey = cookie.get('skey', cookie_configs);
                    if (now_uin !== uin || now_skey !== skey) {
                        console.error('sync cookie fail ' + now_uin);
                        if (!/\bp3pbug\b/.test(location.hash)) {
                            console.log('reload to retry');
                            location.hash += '&p3pbug';
                            location.reload(false);
                        }
                        return;
                    }
                    console.log('sync cookie done ' + now_uin);
                    // 触发回调
                    if(login_callback){
                        login_callback.call(login_scope);
                    }
                    init();
                });
                var xs = new XS({
                    origin: 'http://web.weiyun.qq.com',
                    url: 'http://web.weiyun.qq.com/web/xs_qzone.php'
                });
            });
        } else {
            init();
        }
    });
    // 提前加载disk
    seajs.use(['disk', 'disk_css','p_web_appbox']);


})();

/**
 * 定义 appbox 外部接口，将生成一个空方法，被调用后会保留之前的参数，等待相应模块就绪后自行处理
 * @param {String} name
 * @returns {Function}
 */
(function () {
    var win = window,
        call_history_map = window.__call_history_map = {},
        appbox_interface = function (name) {
            return win[name] = function () {
                var historys = call_history_map[name] || (call_history_map[name] = []);
                historys.push(arguments);
            };
        };

    // 上传到微云
    appbox_interface('WYCLIENT_UploadFiles');

    // 检查是否可拖拽上传（disk模块中会实现该方法）
    win.support_plugin_drag_upload = function () {
        return 0;
    };
})();


// 仅用于灰度时兼容旧版，全量发布后可移除
var WY_VERSION = 2;
