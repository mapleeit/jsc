/**
 * jump配置，提供给客户端来种微信登录态
 * @author xixinhuang
 * @date 2016-08-23
 */
var jumpMap = require('./jump-map.js');

/**
 * 因为微信帐号无法跳去计平支付页，只能去微云会员页，所以sourceId和fromId不一定相同哈
 */
var getJumpMap = function(sourceId) {
    var map = {
        '1014': {
            fromId: '1022',
            domain: 'jump.weiyun.qq.com',
            isNeedCookie: true
        },
        '3004': {
            fromId: '3004',
            domain: 'jump.weiyun.qq.com',
            isNeedCookie: true
        },
        '3005': {
            fromId: '3003',
            domain: 'jump.weiyun.qq.com',
            isNeedCookie: true
        },
        '3016': {
            fromId: '3016',
            domain: 'jump.weiyun.qq.com',
            isNeedCookie: true
        },
        '3017': {
            fromId: '1023',
            domain: 'jump.weiyun.qq.com',
            isNeedCookie: true
        },
        '3031': {
            fromId: '3031',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        },
        '3034': {
            fromId: '3034',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        },
        '3035': {
            fromId: '3035',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        },
        '3043': {
            fromId: '3043',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        },
        '3051': {
            fromId: '3051',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        },
        '3052': {
            fromId: '3052',
            domain: 'jump.weiyun.com',
            isNeedCookie: true
        }
    };
    return map[sourceId];
};

var setWeixinTicket = function() {
    var wy_uf = 1,
        key_type = window.request.GET['key_type'],
        wy_appid = window.request.GET['wy_appid'],
        openid = window.request.GET['openid'],
        access_token = window.request.GET['access_token'],
        wx_login_ticket = window.request.GET['wx_login_ticket'];

    var expires_date = new Date();
    expires_date.setMinutes(expires_date.getMinutes() - 1);

    //除了要种微信帐号的cookie，同时也要清除QQ帐号的cookie
    window.response.setHeader("Set-Cookie", [
        'uin=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'skey=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'clientuin=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'p_uin=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'p_skey=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'indep=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),

        'wy_uf=1; domain=weiyun.com; path=/;',
        'key_type=' + key_type + '; domain=weiyun.com; path=/;',
        'wy_appid='+ wy_appid + '; domain=weiyun.com; path=/;',
        'openid=' + openid + '; domain=weiyun.com; path=/;',
        'access_token=' + access_token + '; domain=weiyun.com; path=/;',
        'wx_login_ticket=' + wx_login_ticket + '; domain=weiyun.com;'
    ]);
};

/**
 * PC客户端微信帐号进入跳转到web页面，由js来种登录态并再次302到目标页面
 */
var getSourceUrl = function() {
    var sourceId = window.request.GET['source'],
        map = getJumpMap(sourceId);
    if(map && map.isNeedCookie) {
        setWeixinTicket();
    }
    // 如果不存在，跳转默认页面
    if (!map) {
        return '//www.weiyun.com';
    }

    return jumpMap[map.domain][map.fromId] || '//www.weiyun.com';
};

/**
 * PC客户端QQ帐号进入回收站和分享连接页面，清除之前web页面的微信登录态
 */
var resetCookie = function() {
    var expires_date = new Date();
    expires_date.setMinutes(expires_date.getMinutes() - 1);

    //除了要种微信帐号的cookie，同时也要清除QQ帐号的cookie
    window.response.setHeader("Set-Cookie", [
        'key_type=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'wy_appid=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'openid=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'access_token=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'wx_login_ticket=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),
        'indep=;domain=weiyun.com;path=/;expires=' + expires_date.toUTCString(),

        'wy_uf=0; domain=weiyun.com; path=/;'
    ]);
}

module.exports = {
    resetCookie: resetCookie,
    setWeixinTicket: setWeixinTicket,
    getSourceUrl: getSourceUrl
};