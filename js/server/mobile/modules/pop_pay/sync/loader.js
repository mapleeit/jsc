/**
 * Created by maplemiao on 22/01/2017.
 */
"use strict";

var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var config = require('./config');
var logger = plug('logger');
var Deferred = plug('pengyou/util/Deferred');
var configSystem = require('hybrid/nodejs/util/configSystem');

function _loadUserInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DiskUserInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: {
            is_get_weiyun_flag: true
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

function _loadOnlineConfig(callback) {
    configSystem.getConfig(374, 1, {}).done(function (data) {
        callback(null, data);
    }).fail(function (msg, ret) {
        callback({
            cmd: 'OnlineConfig',
            msg: msg,
            ret: ret
        }, null);
    })
}


module.exports = {
    batchLoadData: function() {
        var def = Deferred.create();
        async.parallel([
                function(callback) {
                    _loadUserInfo(callback);
                },
                function (callback) {
                    _loadOnlineConfig(callback);
                }
            ],
            function(err, results) {
                if(!err) {
                    def.resolve({
                        userInfo : results[0],
                        onlineConfig: (results[1] || {}).result
                    });
                } else {
                    def.reject(err);
                }
            });
        return def;
    }
};