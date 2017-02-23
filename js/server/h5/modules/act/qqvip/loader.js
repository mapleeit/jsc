/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var qzoneAjax   = plug('qzone/ajax');
var config = require('./config');
var Deferred = plug('pengyou/util/Deferred');

function loadUserInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DiskUserInfoGet'],
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
            cmd: 'qqvipDiskUserInfoGet',
            msg: msg,
            ret: ret
        },null);
    });
}
function loadQQVipInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['OidbGetQQVipInfo'],
        url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
        cmd: 'OidbGetQQVipInfo',
        data: {}
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'OidbGetQQVipInfo',
            msg: msg,
            ret: ret
        },null);
    });
}

module.exports = {
    batchLoadData: function() {
        var def = Deferred.create();
        async.parallel([
                function(callback) {
                    loadUserInfo(callback);
                },
                function(callback) {
                    loadQQVipInfo(callback);
                }],
            function(err, results) {
                if(!err) {
                    def.resolve(results[0], results[1]) //按parallel顺序返回
                } else {
                    def.reject(err);
                }
            })
        return def;
    }
};