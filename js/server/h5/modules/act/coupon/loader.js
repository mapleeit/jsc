var ajax = require('weiyun/util/ajax');
var Deferred = plug('pengyou/util/Deferred');
var config = require('./config');
var async = require('weiyun/util/async');

var loadCouponInfo = function (callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['CouponInfoGet'],
        url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
        cmd: 'WeiyunFlowCouponGet',
        data: {}
    }).done(function (data) {
        callback(null, data);
    }).fail(function (msg, ret) {
        callback({
            cmd: 'WeiyunFlowCouponGet',
            msg: msg,
            ret: ret
        }, null)
    });
};

 var loadUserInfo = function(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['CouponInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: {
            show_qqdisk_migrate: true,
            is_get_weiyun_flag: true
        }
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'couponDiskUserInfoGet',
            msg: msg,
            ret: ret
        },null);
    });
}

module.exports = {
    batchLoadData: function () {
        var def = Deferred.create();

        async.parallel([
            function (callback) {
                loadCouponInfo(callback);
            },
            function (callback) {
                loadUserInfo(callback);
            }
        ], function (err, results) {
            if (!err) {
                def.resolve(results[0], results[1]);
            } else {
                def.reject(err);
            }
        });

        return def;
    }
}