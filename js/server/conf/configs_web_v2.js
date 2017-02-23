(function (win, seajs) {
    var
        is_debug = win.IS_DEBUG = /\s*debug=on\b/.test(document.cookie) || location.search.indexOf('__debug__') > -1,
        //res_host = win.location.protocol + '//img.weiyun.com',
        res_host = win.IS_TEST_ENV ? win.location.protocol + '//' + win.location.hostname : win.location.protocol + '//img.weiyun.com',
	    cdn_host = win.location.protocol + '//qzonestyle.gtimg.cn',
        js_base = res_host + '/club/weiyun/js-dist/web',
        publics = '/club/weiyun/js/publics',

        paths = {
            publics: res_host + publics,
            js_base: js_base,
            module: js_base + '/module',
	        module_v2: js_base + '/module_v2',
            box: res_host + '/vipstyle/nr/box',
	        new_css: cdn_host + '/qz-proj/wy-platform'
        },

	    file_list = {
		    '@lib@': 'lib.r150415.js',
		    '@common@': 'common.r160822.js',
		    '@main@': 'main.r160711.js',
		    '@disk@': 'disk.r160713.js',
		    '@recycle@': 'recycle.r0113.js',
		    '@recycle_v2@': 'recycle.r150915.js',
		    '@photo_bridge@': 'photo_bridge.r1118.js',
		    '@photo@': 'photo.r151223.js',
			'@photo_group@': 'photo_group.r160812.js',
		    '@recent@': 'recent.r151015.js',
		    '@categories@': 'categories.r151223.js',
		    '@share@': 'share.r150609.js',
		    '@share_enter@': 'share_enter.r151225.js',
		    '@search@': 'search.r151015.js',
		    '@indep_setting@': 'indep_setting.r140722.js',
		    '@indep_login@': 'indep_login.r161230.js',
		    '@qq_login@': 'qq_login.r160222.js',
		    '@image_preview@': 'image_preview.r160810.js',
			'@video_preview@': 'video_preview.r160908.js',
		    '@third_party_iframe@': 'third_party_iframe.r0903.js',
		    '@compress_file_iframe@': 'compress_file_iframe.r141016.js',
		    '@compress_file_preview@': 'compress_file_preview.r150407.js',
		    '@photo_tag@':'photo_tag.r150609.js',
		    '@client_download@': 'client_download.r0903.js',
		    '@doc_preview@': 'doc_preview.r140710.js',
		    '@previewer@': 'previewer.r141016.js',
		    '@full_screen_preview@': 'full_screen_preview.r150720.js',
		    '@upload@': 'upload.r170210.js',
		    '@add_wy_appbox@': 'add_wy_appbox.r140217.js',
		    '@install_upload_plugin@': 'install_upload_plugin.r160104.js',
		    '@downloader@': 'downloader.r160119.js',
		    '@download_route@': 'download_route.r150408.js',
		    '@outlink@': 'outlink.r150603.js',
		    '@outlink_v2@': 'outlink_v2.r160222.js',
		    '@photo_guide@': 'photo_guide.r140313.js',
		    '@file_qrcode@':'file_qrcode.r150609.js',
		    '@clipboard@': 'clipboard.r160718.js',
		    '@office_preview@': 'office_preview.r160107.js',
		    '@ftn_preview@': 'ftn_preview.r151020.js',
		    '@ftn_dns_detect@': 'ftn_dns_detect.r141016.js',
		    '@note@': 'note.r160106.js',
		    '@noteview@': 'noteview.r160106.js',
		    '@station@': 'station.r151223.js',
		    '@notification@': 'notification.r160121.js',
		    '@jump_path@': 'jump_path.r151106.js',
		    '@qboss@': 'qboss.r151229.js',
			'@vip@': 'vip.r161022.js'
	    },

        css_list = {
	        '@page_home_css@'                   : 'page-home.css',
	        '@page_home_delay_css@'             : 'page-home-delay.css',
	        '@app_download_css@'                : 'app-download.r150810.css',
	        '@dimensional_code_css@'            : 'dimensional-code.r140603.css',
			'@to_singin_css@'					: 'to-signin-2.0.r140603.css',
	        '@note_css@'                        : 'note.r160114.css',
	        '@upload_install_css@'              : 'plugin.r140603.css',
			'@new_qzonelogin_css@'				: 'qzonelogin.css'
        },

        // 微云JS模块配置
        alias = win.WY_SEAJS_ALIAS = {

	        // 第三方库
	        $: is_debug ? 'publics/jquery/jquery-1.8.3' : 'publics/jquery/jquery-1.8.3.min',
	        jquery_ui: 'publics/jquery-plugins/jquery-ui-1.9.2-112901',
	        jquery_history: 'publics/jquery-plugins/jquery.history',
	        jquery_jplayer: 'publics/jquery-plugins/jquery.jplayer',
            jquery_qrcode: 'publics/jquery-qrcode/qrcode.js',
            zclip: 'publics/jquery-plugins/jquery.zclip.1.1.1',
	        wy_zclip: 'publics/plugins/ZeroClipboard/ZeroClipboard-1.1.7.js?v140423',

	        // 微云基础库（业务无关）
	        lib: 'js_base/lib/' + file_list['@lib@'],
	        // 微云基础库（业务相关）
	        common: 'js_base/common/' + file_list['@common@'],

	        //一些广告及客户端下载地址配置
	        ad_config: is_debug ? 'club/qqdisk/web/data/ad_config.js' : 'qzone/qzactStatics/configSystem/data/65/config1.js',

	        // 微云业务模块(按需加载；由JSC打包生成)
	        main: 'module_v2/main/' + file_list['@main@'],
	        disk: 'module_v2/disk/' + file_list['@disk@'], // 网盘
	        recycle: 'module_v2/recycle/' + file_list['@recycle_v2@'], // 回收站v2
	        photo: 'module/photo_bridge/' + file_list['@photo_bridge@'], // 相册
	        photo_time: 'module_v2/photo/' + file_list['@photo@'], // 真·相册
			album: 'module_v2/photo_group/' + file_list['@photo_group@'], //分组图片入口
	        recent: 'module_v2/recent/' + file_list['@recent@'], //最近更新文件
	        doc: 'module_v2/categories/' + file_list['@categories@'], //文档
	        video: 'module_v2/categories/' + file_list['@categories@'], //视频
	        audio: 'module_v2/categories/' + file_list['@categories@'], //音频
	        share: 'module_v2/share/' + file_list['@share@'], //外链管理
	        share_enter: 'module_v2/share_enter/' + file_list['@share_enter@'], //分享入口
	        search: 'module_v2/search/' + file_list['@search@'], //搜索
	        clipboard: 'module_v2/clipboard/' + file_list['@clipboard@'], //剪贴板
	        indep_setting: 'module/indep_setting/' + file_list['@indep_setting@'],  // 独立密码设置框
	        indep_login: 'module_v2/indep_login/' + file_list['@indep_login@'], // 独立密码验证框
	        qq_login: 'module/qq_login/' + file_list['@qq_login@'],  // QQ登录框
	        qd_migration: 'module/qd_migration/' + file_list['@qd_migration@'],  // QQ网盘迁移用户提示
	        net_fav_migration: 'module/net_fav_migration/' + file_list['@net_fav_migration@'], // 网络收藏夹迁移用户提示
	        image_preview: 'module_v2/image_preview/' + file_list['@image_preview@'], // 图片预览
			video_preview: 'module_v2/video_preview/' + file_list['@video_preview@'], // 视频云播
	        third_party_iframe: 'module/third_party_iframe/' + file_list['@third_party_iframe@'], // 第三方页面iframe
	        compress_file_iframe: 'module/compress_file_iframe/' + file_list['@compress_file_iframe@'], // 压缩包预览
	        compress_file_preview: 'module/compress_file_preview/' + file_list['@compress_file_preview@'], // 压缩包预览（运行在iframe中）
	        photo_tag : 'module/photo_tag/' + file_list['@photo_tag@'],
	        client_download: 'module/client_download/' + file_list['@client_download@'], // 下载各种客户端（appbox）
	        doc_preview: 'module/doc_preview/' + file_list['@doc_preview@'], // 文档预览
	        previewer : 'module/previewer/' + file_list['@previewer@'], // 文档预览公共模块
	        office_preview: 'module/office_preview/' + file_list['@office_preview@'],//office预览
	        ftn_preview: 'module/ftn_preview/' + file_list['@ftn_preview@'],//ftn文件预览
	        full_screen_preview: 'module/full_screen_preview/' + file_list['@full_screen_preview@'], //全屏预览
	        upload: 'module_v2/upload/' + file_list['@upload@'], //新增的上传模块
	        add_wy_appbox: 'module/add_wy_appbox/' + file_list['@add_wy_appbox@'], //appbox添加微云到主面板
	        install_upload_plugin: 'module/install_upload_plugin/' + file_list['@install_upload_plugin@'], //新增上传控件安装模块
	        downloader: 'module/downloader/' + file_list['@downloader@'], // 下载模块
	        download_route: 'module/download_route/' + file_list['@download_route@'],
	        outlink: 'module/outlink/' + file_list['@outlink@'],
	        outlink_v2: 'module/outlink_v2/' + file_list['@outlink_v2@'],
	        photo_guide: 'module/photo_guide/' + file_list['@photo_guide@'], //旧相册引导
	        file_qrcode: 'module/file_qrcode/' + file_list['@file_qrcode@'], //二维码
	        note: 'module/note/' + file_list['@note@'], //笔记
	        noteview: 'module/noteview/' + file_list['@noteview@'], //笔记编辑器
	        station: 'module/station/' + file_list['@station@'], //文件中转站
	        special_log: res_host + '/club/weiyun/js/common/special_log.js',
	        XS: res_host + '/club/weiyun/js/common/XS.js',
	        ftn_dns_detect: 'module/ftn_dns_detect/' + file_list['@ftn_dns_detect@'], //ftn域名截持检测
	        notification: 'module/notification/' + file_list['@notification@'], //通知中心
	        jump_path: 'module/jump_path/' + file_list['@jump_path@'], //跳转到具体路径
	        qboss: 'module/qboss/' + file_list['@qboss@'],  //接入qboss广告
			vip: 'module_v2/vip/' + file_list['@vip@'],  //接入qboss广告

            // CSS  重构新样式,直接走qzonestyle，不走www.weiyun.com
	        page_home_css: cdn_host + '/qz-proj/wy-pc/css/' + css_list['@page_home_css@'],
	        page_home_delay_css: cdn_host+ '/qz-proj/wy-pc/css/' + css_list['@page_home_delay_css@'],
	        app_download_css: 'box/css-ver/' + css_list['@app_download_css@'],
	        dimensional_code_css: 'box/css-ver/' + css_list['@dimensional_code_css@'],
			to_singin_css: 'box/css-ver/' + css_list['@to_singin_css@'],
	        note_css: 'box/css-ver/' + css_list['@note_css@'],
	        upload_install_css: 'box/css-ver/' + css_list['@upload_install_css@'],
			new_qzonelogin_css: '/qz-proj/wy-platform/' + css_list['@new_qzonelogin_css@']

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