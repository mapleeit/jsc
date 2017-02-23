/**
 * Created by maplemiao on 24/11/2016.
 */
"use strict";

var ajax = require('weiyun/util/ajax');
var Deferred = plug('pengyou/util/Deferred');

var config = require('./config');

/**
 * 获取用户会员信息
 * 2201
 * @private
 */
function loadUserInfo() {
    var def = Deferred.create();
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['UserInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: {
            is_get_weiyun_flag: true
        }
    }).done(function(data) {
        def.resolve(data);
    }).fail(function(msg, ret) {
        def.reject({
            cmd: 'DiskUserInfoGet',
            msg: msg,
            ret: ret
        });
    });

    return def;
}

module.exports = {
    loadUserInfo: loadUserInfo
};