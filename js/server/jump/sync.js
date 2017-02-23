/**
 * jump
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var jumpMap     = require('./jump-map.js'),
        weixinTicket = require('./weixinTicket.js'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        payAids = require('weiyun/util/payAids'),
        URL = require('url'),
        browser = require('weiyun/util/browser')(),
        defaultPage = require('weiyun/default-page.js'),
        page302     = require('weiyun/page302.js');

    var hostname = request.headers.host;
    var formid = request.GET['from'];
    var map = jumpMap[hostname];
    var secureUrl = 'http://www.urlshare.cn/umirror_url_check?url=';   //用url check过滤下非法链接

    var getURL = function(fromId) {
        var query,
            url;
        switch(fromId) {
            //用于会员页传递weiyun域名登录态到qq域名
            case '1000':
                if(hostname === 'weiyun.qzone.qq.com') {
                    url = secureUrl + encodeURIComponent(String(request.GET['s_url']));
                } else {
                    url = map[fromId];
                }
                break;

            //微云会员开通送半年活动，兼容qboss的坑
            case '1001':
                if(hostname === 'weiyun.qzone.qq.com') {
                    //H5跳1001，web跳2001
                    if(browser.mobile){
                        url = map[fromId];
                    } else {
                        url = map['2001'];
                    }
                } else {
                    url = map[fromId];
                }
                break;

            case '2000':
                if (hostname === 'jump.weiyun.qq.com') {
                    //var s_url = URL.parse(request.GET['s_url']);
                    //url = map[fromId] + encodeURIComponent(s_url.protocol + '//' + s_url.host + encodeURIComponent(s_url.path));
                    url = secureUrl + encodeURIComponent(String(request.GET['s_url']));
                } else {
                    url = map[fromId];
                }
                break;

            //PC客户端跳转web页面，清除web原有登录态
            case '3001':
                if(hostname === 'jump.weiyun.com') {
                    url = weixinTicket.getSourceUrl();
                } else {
                    url = map[fromId];
                }
                break;

            //用于H5会员页传递weiyun域名登录态到qq域名
            case '3011':
                if(hostname === 'jump.weiyun.qq.com') {
                    var source = String(request.GET['source']).toLocaleLowerCase();
                    url = map[fromId] + '?from=' + source;
                } else {
                    url = map[fromId];
                }
                break;

            //用于web会员页传递weiyun域名登录态到qq域名
            case '3012':
                if(hostname === 'jump.weiyun.qq.com') {
                    var source = String(request.GET['source']).toLocaleLowerCase();
                    url = map[fromId] + '?from=' + source;
                } else {
                    url = map[fromId];
                }
                break;

            //PC客户端跳转web页面，清除web原有登录态
            case '3034':
                if(hostname === 'jump.weiyun.com') {
                    weixinTicket.resetCookie();
                }
                url = map[fromId];
                break;

            //H5通讯录页面，需要把参数app_install带过去
            case '3040':
                if(hostname === 'jump.weiyun.com') {
                    url = map[fromId] + '?app_install=' + request.GET['app_install'];
                } else {
                    url = map[fromId];
                }
                break;

            //PC客户端跳转web页面，清除web原有登录态
            case '3043':
                if(hostname === 'jump.weiyun.com') {
                    weixinTicket.resetCookie();
                }
                url = map[fromId];
                break;

            // Hybrid 弹窗支付，aid透传
            case '3054':
                if (hostname === 'jump.weiyun.com') {
                    url = map[fromId] + encodeURIComponent('&aid=' + request.GET['aid']);
                } else if (hostname === 'jump.weiyun.qq.com') {
                    url = map[fromId] + '?aid=' + request.GET['aid'];
                } else {
                    url = map[fromId];
                }
                break;

            case '3055':
                if (hostname === 'jump.weiyun.com') {
                    url = map[fromId] + '?share_key=' + request.GET['share_key'];
                } else {
                    url = map[fromId];
                }
                break;

            // Hybrid 弹窗支付，随机活动页面种qq域登录态使用
            case '3060':
                if (hostname === 'jump.weiyun.com') {
                    url = 'https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent('https://jump.weiyun.qq.com/?from=3060&r_url=' + request.GET['r_url']);
                } else if (hostname === 'jump.weiyun.qq.com') {
                    url = decodeURIComponent(request.GET['r_url']);
                } else {
                    url = map[fromId];
                }
                break;

            default :
                url = map[fromId];
        }
        return url;
    };


    if(map && formid && map[formid]) {
        page302(request, response, getURL(formid));
    } else {
        defaultPage(request, response);
    }
}