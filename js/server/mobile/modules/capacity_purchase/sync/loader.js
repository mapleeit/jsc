/**
 * Created by maplemiao on 21/11/2016.
 */
"use strict";

var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var Deferred = plug('pengyou/util/Deferred');

var config = require('./config');

/**
 * 获取用户会员信息
 * 2201
 * @param callback
 */
function loadUserInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['UserInfoGet'],
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

/**
 * 获取用户容量信息
 * 2225
 * @param callback
 */
function loadSpaceInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['SpaceInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserConfigGet',
        data: {
            get_space_info: true
        }
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'DiskUserConfigGet',
            msg: msg,
            ret: ret
        }, null);
    });
}

function batchLoadData() {
    var def = Deferred.create();
    async.parallel([
            function(callback) {
                loadUserInfo(callback);
            },
            function(callback) {
                loadSpaceInfo(callback);
            }
        ],
        function(err, results) {
            if(!err) {
                def.resolve(results[0], results[1]); //按parallel顺序返回
            } else {
                def.reject(err);
            }
        });
    return def;
}

module.exports = {
    batchLoadData: batchLoadData
};