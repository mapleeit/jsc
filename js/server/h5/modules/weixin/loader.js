/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var qzoneAjax = plug('qzone/ajax');
var config = require('./config');
var Token   = require('weiyun/util/Token');
var pbCmds = require('weiyun/util/pbCmds');
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

function loadDirFileList(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DiskDirBatchList'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskDirBatchList',
        data: {
            dir_list: [{
                get_type: 0,            // int,拉取列表类型：0:所有,1:目录2:文件,其他所有
                start: 0,               // int,偏移量
                count: 100,             // int,分页大小, 最大1000个（但如果要返回摘要文件url, 则最大只能100个）
                sort_field: 2,          // int,排序类型
                reverse_order: false,    // bool,true=逆序)
                get_abstract_url: true
            }]
        }
    }).done(function(data) {
        callback(null, data.dir_list || []);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'DiskDirBatchList',
            msg: msg,
            ret: ret
        }, null);
    })
}

function loadWXUserInfo(callback) {
    qzoneAjax.proxy(window.request, window.response).request({
        type: 'get',
        url: 'http://web2.cgi.weiyun.com/wx_oa_web.fcg',
        l5api: config['l5api'],
        dcapi: config['dcapi']['get_user_info'],
        data: {
            cmd: 'get_user_info',
            callback: 'jsonCallback'
        },
        formatCode: function(result) {
            if(result) {
                return result.retcode;
            }
            return -9999;
        },
        dataType: 'json',
        jsonpCallback:'jsonCallback'
    }).done(function(data) {
        if(data && data.result) {
            callback(null, data.result);
        } else {
            callback({
                cmd: 'loadWXUserInfo',
                msg: '获取帐号出错',
                ret: 0
            }, null);
        }
    }).fail(function() {
        callback({
            cmd: 'loadWXUserInfo',
            msg: '获取帐号出错',
            ret: 0
        }, null);
    });
}

var loader = {
    batchLoadData: function() {
        var def = Deferred.create();
        async.parallel([
            function(callback) {
                loadUserInfo(callback);
            },
            function(callback) {
                loadDirFileList(callback);
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
    },
    verifyIndep: function (data) {
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
    },
    batchLoadInfo: function() {
        var def = Deferred.create();
        async.parallel([
                function(callback) {
                    loadUserInfo(callback);
                },
                function(callback) {
                    loadWXUserInfo(callback);
                }],
            function(err, results) {
                if(!err) {
                    def.resolve(results[0], results[1]) //按parallel顺序返回
                } else {
                    def.reject(err);
                }
            });
        return def;
    }
}

module.exports = loader;