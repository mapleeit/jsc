/**
 * 一些常量
 * @jameszuo 12-12-19 下午12:45
 */
/*global global,Buffer*/
define(function (require, exports, module) {

    var
        lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),

        win = window;

    var OS_TYPES = {
//      WEB : 4,
        WEB: 30013,
//      APPBOX : 7,
        APPBOX: 30012,
        QQ: 9,
        QZONE: 30225,
        QZONE_IC: 30321,
        QQNEWS: 30227    //QQ新闻安排id
    };
    var VIRTUAL_DIR_TYPES = {
        Text: 'text',
        Audio: 'audio',
        Image: 'picture',
        Video: 'video',
        Article: 'article'
    };


    var
    // 是否是 appbox 环境
    // 如果未手动指定 IS_APPBOX，则从 URL 中判断，下列 URL 将被判断为appbox环境
    // http://xx/appbox.html
    // http://xx/appbox-xx.html
    // http://xx/appbox/xx.html
    // http://xx/xx.html?appbox
    // http://xx/xx.html?xx=1&appbox
        IS_APPBOX = /([\?&\/]appbox\b|is_appbox=(1|true))/i.test(win.location.href),
    // 是否开发模式
        IS_DEBUG = !!win.IS_DEBUG || location.search.indexOf('__debug__') > -1,
    // 是否是PHP直出
        IS_PHP_OUTPUT = !!win.IS_PHP_OUTPUT,
    // 是否是QQ空间应用
        IS_QZONE = !!win.IS_QZONE,
        IS_QZONE_IC = IS_QZONE && /([\?&\/]s=ic)/i.test(win.location.search),
    // 是否嵌入到其它网站中，例如qzone、q+之类，域名非weiyun
        IS_WRAPPED = IS_QZONE,
    // webkit内核的appbox
        IS_WEBKIT_APPBOX = IS_APPBOX && $.browser.webkit,
    // http协议类型
        HTTP_PROTOCOL = win.location.protocol,
    // 是否使用https协议
        IS_HTTPS = HTTP_PROTOCOL === 'https:',
	// 是否微云域
	    IS_WEIYUN_DOMAIN = location.hostname.indexOf('www.weiyun.com') > -1,
    //是否是旧版本，这里先设置为true, 测试和灰度的时候再改回来
	    IS_OLD = IS_APPBOX || (win.g_login_user_rsp_body && win.g_login_user_rsp_body.is_old) || IS_QZONE ||  !IS_WEIYUN_DOMAIN,

    // APPID
        APPID = IS_APPBOX ? OS_TYPES.APPBOX : (IS_QZONE ? (IS_QZONE_IC ? OS_TYPES.QZONE_IC : OS_TYPES.QZONE) : OS_TYPES.WEB),

    //AID，支付用
        AID = win.AID || 'web_vip_center',

    // UI 版本(与 constants.IS_APPBOX 语义不同，对于UI的判断，请尽量使用 constants.UI_VER)
        UI_VER = IS_APPBOX ? 'APPBOX' : 'WEB',

    // QQ硬盘目录ID
        QQDISK_DIR_ID = '77c92765438ca4ef1d170515',

    // 网络收藏夹目录ID
        NET_FAV_DIR_ID = '9b7db5fb4f26f2baea50ef60',

    // 操作系统
        os_name = require('./util.os').name,

    // 浏览器名称
        browser_name = require('./util.browser').name,

        MB_1 = 1024 * 1024,

    // 文档预览大小限制
        DOC_PREVIEW_SIZE_LIMIT = {
            DEFAULT: 500*MB_1,
            XLS: 500*MB_1
        },

        BASE_VERIFY_CODE_URL = HTTP_PROTOCOL + '//captcha.weiyun.com/getimage?aid=543009514&',//验证码系统url,使用时请加个随机数（Math.random()）来确保每次都是新的

        undefined;

    return {

        // 主域名
        MAIN_DOMAIN: 'weiyun.com',

        // 域名
        DOMAIN: HTTP_PROTOCOL + '//www.weiyun.com',

        IS_APPBOX: IS_APPBOX,
        IS_QZONE: IS_QZONE,
        IS_DEBUG: IS_DEBUG,
        IS_WRAPPED: IS_WRAPPED,
        IS_WEBKIT_APPBOX: IS_WEBKIT_APPBOX,
        IS_PHP_OUTPUT: IS_PHP_OUTPUT,
        IS_HTTPS: IS_HTTPS,
        IS_OLD: IS_OLD,

        APPID: APPID,
        AID: AID,
        UI_VER: UI_VER,
        DEVICE_ID: '' + (+new Date), //每次进入微云后，以当前时间戳作为device_id
        HTTP_PROTOCOL: HTTP_PROTOCOL,
        HTTPS_PORT: 443,

        OS_TYPES: OS_TYPES,
        OS_NAME: os_name,
        IS_MAC: os_name === 'mac',
        IS_WINDOWS: os_name === 'windows',

        BROWSER_NAME: browser_name,
        RESOURCE_BASE: HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box',

        MB_1: MB_1,

        //上传到相册的路径
        UPLOAD_DIR_PHOTO: -1,

        //上传文件夹最大层级
        UPLOAD_FOLDER_LEVEL: 25,
        //上传文件夹时最大的目录数
        UPLOAD_FOLDER_DIR_NUM: 200,
        //上传文件夹时最大的文件数
        UPLOAD_FOLDER_MAX_FILE_NUM: 10000,

        // 创建目录的层级上限 // jackbinwu fixed: 层级为20的话，会导致windows同步有问题，这里先修改为19层，跟其他端一致
        DIR_DEEP_LIMIT: 19,

        QQDISK_DIR_ID: QQDISK_DIR_ID,
        NET_FAV_DIR_ID: NET_FAV_DIR_ID,

        //模块ID
        SERVICE_ID: {
            DISK: 1,
            PHOTO: 2
        },

        VIRTUAL_DIR_TYPES: VIRTUAL_DIR_TYPES,
        VIRTUAL_DIRS: {
            weixin: {
                name: '微信',
                id: '5d37aaaef344b3e67fe406f7',
                children: {
                    msg: {
                        name: '文字语音',
                        id: '40281299baef0847a3086540',
                        types: [VIRTUAL_DIR_TYPES.Text, VIRTUAL_DIR_TYPES.Audio]
                    },
                    photo: {
                        name: '视频图片',
                        id: '32af48ea56dc0d0eb4df0ef0',
                        types: [VIRTUAL_DIR_TYPES.Image, VIRTUAL_DIR_TYPES.Video]
                    },
                    article: {
                        name: '文章',
                        id: '97afabcf7418883b2a70b95e',
                        types: [VIRTUAL_DIR_TYPES.Article]
                    }
                }
            },
            qqnews: {
                name: '腾讯新闻',
                id: 'd0f6974443cf31d41cba4a9a',
                children: {
                    photo: {
                        name: '图片',
                        id: 'ba4b1194e19cfa3e7c48ff4f',
                        types: [VIRTUAL_DIR_TYPES.Image]
                    }
                }
            },
            qqmail: {
                name: 'QQ邮箱',
                async_load: true,
                appid: 30208
            }
        },

        DISK_TOOLBAR:{
            VIRTUAL_SHOW:'virtual_show',//虚拟目录 要toolbar
            HIDE:'hide',//不要toolbar
            NORMAL:'normal'//正常目录
        },
        OFFLINE_DIR: 'd9d243a4d99210dff924fcd1',//离线文件第一层目录key
        OFFLINE_SRC_APPID:3,//离线文件src_appid

        // 文档预览大小限制
        DOC_PREVIEW_SIZE_LIMIT: DOC_PREVIEW_SIZE_LIMIT,

        // 打包下载文件个数上限
        PACKAGE_DOWNLOAD_LIMIT: 100,
        // 外链分享文件个数上限
        LINK_SHARE_LIMIT: 100,
        //web最大下载的文件大小，超出则呼起pc来下载
        FILE_DOWNLOAD_LIMIT: 1024 * 1024 * 1024,
        // 邮件分享文件个数上限
        MAIL_SHARE_LIMIT: 1,
        // CGI2.0批量删除上限
        CGI2_DISK_BATCH_LIMIT: 30000,
        // CGI2.0批量拉网盘目录最大个数
        CGI2_DISK_LIST_PER_LIMIT: 500,
        // 回收站CGI2.0拉取列表首屏个数、批量删除上限
        CGI2_RECYCLE_LIST_LIMIT: 500,

        BASE_VERIFY_CODE_URL: BASE_VERIFY_CODE_URL,

        GET_QZONE_VIP_URL: 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml?n%3D12%26c%3Dxxjzghh%2Cxxjzgw%26aid%3Dweiyun%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month',

        GET_WEIYUN_VIP_URL: 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com/?'

};
});