/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
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

function loadRecentList(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['LibPageListGet'],
        url: 'http://web2.cgi.weiyun.com/user_library.fcg',
        cmd: 'LibPageListGet',
        data: {
            lib_id: 100,
            offset: 0,
            count: 200, //全量拉的
            sort_type: 0,
            get_abstract_url: true
        }
    }).done(function(data) {
        callback(null, data.FileItem_items || []);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'LibPageListGet',
            msg: msg,
            ret: ret
        }, null);
    });
}

var batchLoadData = function() {
    var def = Deferred.create();
    async.parallel([
            function(callback) {
                loadUserInfo(callback);
            },
            function(callback) {
                loadRecentList(callback);
            }/*,   和手机端保持一致，不展示虚拟目录
             function(callback) {
             loadVdirFileList(callback);
             }*/],
        function(err, results) {
            if(!err) {
                def.resolve(results[0], results[1]) //按parallel顺序返回
            } else {
                def.reject(err);
            }
        });
    return def;
}

var verifyIndep = function (data) {
    var def = Deferred.create();
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['VerifyIndep'],
        url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
        cmd: 'PwdVerify',
        data: data
    }).done(function(data) {
        if(data && data.cs_sig) {
            def.resolve();
        } else {
            def.reject()
        }
    }).fail(function(msg, ret) {
        def.reject(msg, ret);
    });
    return def;
}

module.exports = {
    batchLoadData: batchLoadData,
    verifyIndep: verifyIndep
};