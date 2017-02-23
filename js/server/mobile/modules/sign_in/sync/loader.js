/**
 * Created by maplemiao on 05/12/2016.
 */
"use strict";

/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var qzoneAjax = plug('qzone/ajax');
var config = require('./config');
var logger = plug('logger');
var Deferred = plug('pengyou/util/Deferred');

var _get_gtk = function() {
    var hash = 5381,
        skey = window.request.cookies.skey || '';
    for(var i=0,len=skey.length;i<len;++i)
    {
        hash += (hash<<5) + skey.charCodeAt(i);
    }
    return hash & 0x7fffffff;
};

var _wx_gtk = function() {
    var hash = 5381,
        skey = window.request.cookies.wx_login_ticket || '';
    for(var i=0,len=skey.length;i<len;++i)
    {
        hash += (hash<<5) + skey.charCodeAt(i);
    }
    return hash & 0x7fffffff;
};

function _loadUserInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['Weiyun'],
        dcapi: config['dcapi']['DiskUserInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: {
            show_qqdisk_migrate: true,
            is_get_weiyun_flag: true,
            is_get_qzone_flag: true
        }
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'DiskUserInfoGet',
            msg: msg,
            ret: ret
        },null);
    })
}
/**
 * 签到请求
 * @param callback
 * @param captcha_ticket 如果被打击，过验证码，这个为验证码返回的票据
 * @private
 * http://km.oa.com/group/11796/articles/show/259210?kmref=search&from_page=1&no=1
 */
function _dailySignin(callback, captcha_ticket) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['Weiyun'],
        dcapi: config['dcapi']['WeiyunDailySignIn'],
        url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
        cmd: 'WeiyunDailySignIn',
        data: {
            captcha_ticket: captcha_ticket || ''
        }
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'WeiyunDailySignIn',
            msg: msg,
            ret: ret
        },null);
    })
}

/**
 * 微云的兑换记录
 * 微云会员
 * 现在已经不提供微云会员的兑换了，但是记录仍然显示
 * @param callback
 */
function _loadWyRecords(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['Weiyun'],
        dcapi: config['dcapi']['WeiyunDailySignIn'],
        url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
        cmd: 'WeiyunActGetRedeemRecord'
    }).done(function(data) {
        callback(null, data || []);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'WeiyunActGetRedeemRecord',
            msg: msg,
            ret: ret
        }, null);
    })
}

/**
 * 拉取礼物列表
 * @param callback
 */
function _loadGoodsList(callback) {
    var gtk = _get_gtk(),
        wx_gtk = _wx_gtk(),
        type = window.request.cookies.skey? 1: window.request.cookies.wx_login_ticket? 3 : 0,
        uin = window.request.cookies.uin? parseInt(window.request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        apptoken = window.request.cookies.skey || window.request.cookies.wx_login_ticket,
        cookie_str = 'login_appid=10002; login_apptoken_type=' + type + '; login_apptoken_uid=' + uin + '; login_apptoken=' + apptoken + ';';
    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        l5api: config['l5api']['Qzone'],
        dcapi: config['dcapi']['QzoneActGoodsGet'],
        url: 'http://activity.qzone.qq.com/fcg-bin/fcg_open_qzact_act?login_type=3&actid=360&get_left=1&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
        headers: {
            'cookie' : cookie_str
        },
        data: {
            'format':'jsonp'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'jsonp',
        jsonpCallback: '_Callback'
    }).done(function(d) {
        callback(null, d.result || []);
    }).fail(function(d) {
        callback({
            ret: d.result.code,
            msg: d.result.message,
            cmd: 'QzoneActGoodsGet'
        }, null);
    })
}


/**
 * 空间的兑换记录
 * 兑换实物和虚拟物品
 * @param callback
 */
function _loadQzRecords(callback) {
    var gtk = _get_gtk(),
        wx_gtk = _wx_gtk(),
        type = window.request.cookies.skey? 1: window.request.cookies.wx_login_ticket? 3 : 0,
        uin = window.request.cookies.uin? parseInt(window.request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        apptoken = window.request.cookies.skey || window.request.cookies.wx_login_ticket,
        cookie_str = 'login_appid=10002; login_apptoken_type=' + type + '; login_apptoken_uid=' + uin + '; login_apptoken=' + apptoken + ';';

    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        l5api: config['l5api']['Qzone'],
        dcapi: config['dcapi']['QzoneActRecordsGet'],
        url: 'http://activity.qzone.qq.com/fcg-bin/fcg_open_qzact_record?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
        headers: {
            'cookie' : cookie_str
        },
        data: {
            'format':'jsonp'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'jsonp',
        jsonpCallback: '_Callback'
    }).done(function(d) {
        callback(null, d.result || []);
    }).fail(function(d) {
        callback({
            ret: d.result.code,
            msg: d.result.message,
            cmd: 'QzoneActRecordsGet'
        }, null);
    });
}


/**
 * 空间拉取地址信息
 * @param callback
 * @private
 */
function _loadAddress(callback) {
    var gtk = _get_gtk(),
        wx_gtk = _wx_gtk(),
        type = window.request.cookies.skey? 1: window.request.cookies.wx_login_ticket? 3 : 0,
        uin = window.request.cookies.uin? parseInt(window.request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        apptoken = window.request.cookies.skey || window.request.cookies.wx_login_ticket,
        cookie_str = 'login_appid=10002; login_apptoken_type=' + type + '; login_apptoken_uid=' + uin + '; login_apptoken=' + apptoken + ';';

    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        l5api: config['l5api']['Qzone'],
        dcapi: config['dcapi']['QzoneActAddressGet'],
        url: 'http://activity.qzone.qq.com/fcg-bin/fcg_open_qzact_get_addr?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
        headers: {
            'cookie' : cookie_str
        },
        data: {
            'format':'jsonp'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'jsonp',
        jsonpCallback: '_Callback'
    }).done(function(d) {
        callback(null, d.result || []);
    }).fail(function(d) {
        callback({
            ret: d.result.code,
            msg: d.result.message,
            cmd: 'QzoneActAddressGet'
        }, null);
    });
}

/**
 * 获取动态配置，图片URL等等
 * http://meteor.cm.com/config/index.html?file_id=55FDFDA6-31CB-4D00-8E8A-9D8B25200729#addFile
 * @param callback
 * @private
 */
function _loadOnlineConfig(callback) {
    var gtk = _get_gtk(),
        wx_gtk = _wx_gtk(),
        type = window.request.cookies.skey? 1: window.request.cookies.wx_login_ticket? 3 : 0,
        uin = window.request.cookies.uin? parseInt(window.request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        apptoken = window.request.cookies.skey || window.request.cookies.wx_login_ticket,
        cookie_str = 'login_appid=10002; login_apptoken_type=' + type + '; login_apptoken_uid=' + uin + '; login_apptoken=' + apptoken + ';';

    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        // l5api: config['l5api']['Qzone'],
        dcapi: config['dcapi']['OnlineConfig'],
        url: 'http://activity.qzone.qq.com/fcg-bin/fcg_qzact_get_statics_config?g_tk=' + gtk + '&wx_tk='+ wx_gtk + '&cfg_id=366_1',
        headers: {
            'cookie' : cookie_str
        },
        data: {
            'format':'jsonp'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'jsonp',
        jsonpCallback: '_Callback'
    }).done(function(d) {
        callback(null, d.result || []);
    }).fail(function(d) {
        callback({
            ret: d.result.code,
            msg: d.result.message,
            cmd: 'OnlineConfig'
        }, null);
    });
}

/**
 * 获取定时兑换时间
 * http://meteor.cm.com/config/index.html?file_id=6DE6ECCB-7E2C-4DBD-8338-016C67536D82
 * @param callback
 * @private
 */
function _loadExchangeTime(callback) {
    var gtk = _get_gtk(),
        wx_gtk = _wx_gtk(),
        type = window.request.cookies.skey? 1: window.request.cookies.wx_login_ticket? 3 : 0,
        uin = window.request.cookies.uin? parseInt(window.request.cookies.uin.replace(/^[oO0]*/, '')) : '',
        apptoken = window.request.cookies.skey || window.request.cookies.wx_login_ticket,
        cookie_str = 'login_appid=10002; login_apptoken_type=' + type + '; login_apptoken_uid=' + uin + '; login_apptoken=' + apptoken + ';';

    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        // l5api: config['l5api']['Qzone'],
        dcapi: config['dcapi']['OnlineConfig'],
        url: 'http://activity.qzone.qq.com/fcg-bin/fcg_qzact_get_statics_config?g_tk=' + gtk + '&wx_tk='+ wx_gtk + '&cfg_id=344_1',
        headers: {
            'cookie' : cookie_str
        },
        data: {
            'format':'jsonp'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'jsonp',
        jsonpCallback: '_Callback'
    }).done(function(d) {
        callback(null, d.result || []);
    }).fail(function(d) {
        callback({
            ret: d.result.code,
            msg: d.result.message,
            cmd: 'ExchangeTime'
        }, null);
    });
}


module.exports = {
    batchLoadData: function(captcha_ticket) {
        var def = Deferred.create();

        // 验证码票据
        captcha_ticket = captcha_ticket || '';

        async.parallel([
                function(callback) {
                    _dailySignin(callback, captcha_ticket);
                },
                function(callback) {
                    _loadUserInfo(callback);
                },
                function(callback) {
                    _loadWyRecords(callback);
                },
                function(callback) {
                    _loadQzRecords(callback);
                },
                function(callback) {
                    _loadGoodsList(callback);
                },
                function (callback) {
                    _loadAddress(callback);
                },
                function (callback) {
                    _loadOnlineConfig(callback);
                },
                function (callback) {
                    _loadExchangeTime(callback);
                }
            ],
            function(err, results) {
                if(!err) {
                    def.resolve({
                        signInInfo : results[0],
                        userInfo : results[1],
                        wyRecords: results[2],
                        qzRecords: results[3].data,
                        goodsList: results[4].data,
                        address: results[5].data,
                        onlineConfig: results[6].data,
                        exchangeTime : results[7].data
                    });
                } else {
                    def.reject(err);
                }
            });
        return def;
    }
};