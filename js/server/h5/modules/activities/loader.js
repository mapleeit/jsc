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

function loadUserInfo(callback) {
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
function checkSignin(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['Weiyun'],
        dcapi: config['dcapi']['WeiyunCheckSignIn'],
        url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
        cmd: 'WeiyunCheckSignIn'
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'WeiyunCheckSignIn',
            msg: msg,
            ret: ret
        },null);
    })
}

//拉取微云奖品列表，主要是兑换会员的。已下线
function loadWyGoodsList(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['Weiyun'],
        dcapi: config['dcapi']['WeiyunDailySignIn'],
        url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
        cmd: 'WeiyunActGetGoodsList'
    }).done(function(data) {
        callback(null, data || []);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'WeiyunActGetGoodsList',
            msg: msg,
            ret: ret
        }, null);
    })
}

function loadGoodsList(callback) {
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
        callback(d.result, null);
    })
}

function loadQzRecords(callback) {
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
        callback(d.result, null);
    });
}

function loadWyRecords(callback) {
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

var batchLoadData = function() {
    var def = Deferred.create();
    async.parallel([
            function(callback) {
                checkSignin(callback);
            },
            function(callback) {
                loadUserInfo(callback);
            },
            //function(callback) {
            //    loadWyGoodsList(callback);
            //},
            function(callback) {
                loadGoodsList(callback);
            },
            function(callback) {
                loadQzRecords(callback);
            }
        ],
        function(err, results) {
            if(!err) {
                def.resolve(results[0], results[1], results[2], results[3]) //按parallel顺序返回
            } else {
                def.reject(err);
            }
        });
    return def;
}

var batchLoadRecords = function() {
    var def = Deferred.create();
    async.parallel([
            function(callback) {
                loadGoodsList(callback);
            },
            function(callback) {
                loadQzRecords(callback);
            },
            function(callback) {
                loadWyRecords(callback);
            }
        ],
        function(err, results) {
            if(!err) {
                def.resolve(results[0], results[1], results[2]);
            } else {
                def.reject(err);
            }
        });
    return def;
}

var batchLoadAddress = function() {
    var def = Deferred.create();
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
        def.resolve(d.result || []);
    }).fail(function(d) {
        def.reject(d.result, null);
    })
    return def;
}

module.exports = {
    batchLoadData: batchLoadData,
    batchLoadRecords: batchLoadRecords,
    batchLoadAddress: batchLoadAddress
};