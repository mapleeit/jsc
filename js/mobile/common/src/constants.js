/**
 * mobile web页 使用的一些常量
 */
/*global global,Buffer*/
define(function (require, exports, module) {


    var nav = navigator.userAgent.toLowerCase();

    var MB_1 = 1024 * 1024;

    // http协议类型
    var HTTP_PROTOCOL = window.location.protocol;
    // 是否使用https协议
    var IS_HTTPS = HTTP_PROTOCOL === 'https:';

    var browser_name = (function () {
            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf('ie') > -1 && window.ActiveXObject !== undefined) {
                return 'ie';
            } else if (nav.indexOf('chrome')) {
                return 'chrome';
            } else if (nav.indexOf('mozilla')) {
                return 'mozilla';
            } else if (nav.indexOf('safari')) {
                return 'safari';
            } else if (nav.indexOf('webkit')) {
                return 'webkit';
            } else {
                return 'unknown';
            }
        })();

    var mappings = [ // 请勿随意调整顺序
            ['ipad', 'ipad'],
            ['iphone', 'iphone'],
            ['windows phone', 'windows phone'],
            ['android', 'android'],
            ['symbian', 'symbian'],
            ['blackberry', 'bb10,blackberry,playbook']
        ],
        os_name;

    for (var i = 0, l = mappings.length; i < l; i++) {
        var map = mappings[i],
            name = map[0],
            uas = map[1].split(',');

        for(var j=0; j < uas.length; j++) {
            if(nav.indexOf(uas[j]) !== -1) {
                os_name = name;
                break;
            }
        }

        if(os_name) {
            break;
        }
    }

    var APPIDS = {
        SHARE: 30111,
        WEIXIN: 30320,
        DEFAULT: 30327   //mobile中默认的都是H5页面
    };

    var APPID = window.APPID || APPIDS['DEFAULT'];

    var AID = window.AID || 'h5_head_pay';

    // 文档预览大小限制
    var DOC_PREVIEW_SIZE_LIMIT = {
        DEFAULT:50*MB_1,
        XLS: 50*MB_1
    };

    var BASE_VERIFY_CODE_URL = HTTP_PROTOCOL + '//captcha.weiyun.com/getimage?aid=543009514&'; //验证码系统url,使用时请加个随机数（Math.random()）来确保每次都是新的

    var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/,
        REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/,
        REGEXP_QZONE = /\bV1_AND_QZ?_([\d\.]+)(.*? QZONEJSSDK\/(([\d\.]+))?)/,
        ua = window.request && window.request.headers['user-agent'],
        IS_FROM_QZONE = REGEXP_IOS_QQ.test(ua) || REGEXP_ANDROID_QQ.test(ua) || REGEXP_QZONE.test(ua);

    return {
        BROWSER_NAME: browser_name,
        OS_NAME: os_name || 'unknown os',
        IS_FROM_QZONE: IS_FROM_QZONE,
        APPID: APPID,
        AID: AID,
        DOC_PREVIEW_SIZE_LIMIT: DOC_PREVIEW_SIZE_LIMIT,
        BASE_VERIFY_CODE_URL: BASE_VERIFY_CODE_URL,
        DOMAIN_NAME: 'weiyun.com',
        HTTP_PROTOCOL: HTTP_PROTOCOL,
	    HTTPS_PORT: 443,
        IS_HTTPS: IS_HTTPS,
        IS_DEBUG: location.search.indexOf('__debug__') > -1
    }
});