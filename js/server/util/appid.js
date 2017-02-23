var logger = plug('logger');
/**
 * appid
 * @typedef {Object} weiyun~appid
 *
 */
var APPIDS = {
    SHARE: 30111,
    IN_WEIXIN_SHARE: 30113,   //微信中打开分享外链
    WEIXIN: 30320,   //公众号
    APPBOX: 30012,
    QZONE: 30225, // 空间顶部tap，游戏 -> 微云
    IN_QZONE_IC:30321, // 【基本废弃】空间左侧列表中与"好友动态"、"特别关心"并列的"微云备份"入口，已经于2016年10月底下掉，再上的可能性不大
    H5: 30327,
    DEFAULT: 30013
};

var browser = require('weiyun/util/browser');

/**
 * 根据url的域名地址以及所带参数返回appid，传给后台，用于区分来源
 *
 * @module server/util/appid
 * @example
 * var appid = require('weiyun/util/appid');
 * module.exports = {
 *     console.log(appid()); // appid
 * }
 */
module.exports = function() {
    var _browser = browser();
    var request = window.request;
    var IS_SHARE = request.headers['host'] === 'share.weiyun.com';
    var IN_WEIXIN_SHARE = request.headers['host'] === 'share.weiyun.com' && _browser.WEIXIN;
    var IS_WEIXIN = request.headers['host'] === 'h5.weiyun.com' && (request.REQUEST['pathname'].indexOf('weixin') > -1 || request.REQUEST['pathname'].indexOf('recent') > -1 || request.REQUEST['pathname'].indexOf('note') > -1);
    var IS_H5 = !IS_WEIXIN && request.headers['host'] === 'h5.weiyun.com';
    var IN_APPBOX = request.headers['host'] === 'www.weiyun.com' && request.REQUEST.query.indexOf('appbox') > -1;
    var IN_QZONE = request.headers['host'] === 'www.weiyun.com' && request.REQUEST.query.indexOf('qzone') > -1;
    var IN_QZONE_IC = request.headers['host'] === 'www.weiyun.com' && request.REQUEST.query.indexOf('qzone') > -1 && request.REQUEST.query.indexOf('s=ic') > -1;

    if(IN_WEIXIN_SHARE) {
        return APPIDS['IN_WEIXIN_SHARE'];
    } else if(IS_SHARE) {
        return APPIDS['SHARE'];
    } else if(IS_WEIXIN) {
        return APPIDS['WEIXIN'];
    } else if(IS_H5) {
        return APPIDS['H5'];
    } else if(IN_APPBOX) {
        return APPIDS['APPBOX']
    } else if(IN_QZONE_IC) {
        return APPIDS['IN_QZONE_IC']
    }else if(IN_QZONE) {
        return APPIDS['QZONE']

    } else {
        return APPIDS['DEFAULT'];
    }
}