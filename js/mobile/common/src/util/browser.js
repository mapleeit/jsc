/**
 * 浏览器判断
 */
define(function(require, exports ,module) {

    var REGX_WEIXIN = /MicroMessenger/i,
        REGX_QZONE = /QZONE/i,
        REGX_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/,
        REGX_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/,
        REGX_WINDOWS_WEIXIN = /WindowsWechat/i,
        REGX_ANDROID = /Android/i,
        REGX_IOS = /iPhone|iPod|iPad/i,
        REGX_IPAD = /ipad/i,
        REGX_WEIYUN = /weiyun/i;

    var browser = {};
    ~function(){
        var ua = window.navigator.userAgent;
        if(REGX_ANDROID_QQ.test(ua) || REGX_IOS_QQ.test(ua)) {
            browser.QQ = true;
        } else if(REGX_QZONE.test(ua)) {
            browser.QZONE = true;
        } else if(REGX_WEIXIN.test(ua)) {
            browser.WEIXIN = true;
        }

        if(REGX_WINDOWS_WEIXIN.test(ua)) {
            browser.WINDOWS_WEIXIN = true;
        }
        if(REGX_IOS.test(ua)) {
            browser.IOS = true;
            if (REGX_WEIYUN.test(ua)) {
                browser.IOS_WEIYUN = true;
            }
        }
        if(REGX_ANDROID.test(ua)) {
            browser.android = true;
            if (REGX_WEIYUN.test(ua)) {
                browser.android_WEIYUN = true;
            }
        }
        if(browser.IOS && ua.match(/OS (9|10)_\d[_\d]* like Mac OS X/i)) {
            browser.IS_IOS_9 = true;
        }
        if(browser.IOS && REGX_IPAD.test(ua)) {
            browser.IPAD = true;
        }
    }();

    return browser;
});