/**
 * Created by maplemiao on 21/11/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls'),
        request = common.get('./request'),
        https_tool = common.get('./util.https_tool');

    // async request
    return new Module('ar', {
        /**
         * 登录态相关信息
         */
        sessionInfo : {
            session_type: cookie.get('login_apptoken_type') === '1' ? 'qq' : 'weixin',
            access_token: cookie.get('login_apptoken_type') === '1' ? '' : cookie.get('access_token'),
            login_apptoken_type: cookie.get('login_apptoken_type'),
            login_apptoken: cookie.get('login_apptoken'),
            login_apptoken_uid : cookie.get('login_apptoken_uid')
        },

        // private method

        /**
         * 计算gtk
         * @return {number}
         * @private
         */
        _get_gtk : function() {
            var hash = 5381, skey = cookie.get('skey');

            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },

        /**
         * 拉取用户信息
         * @return {*}
         * @private
         */
        _user_info_ajax: function () {
            var def = $.Deferred();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskUserInfoGet',
                body: {
                    is_get_weiyun_flag: true
                }
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                def.reject({
                    cmd: 'DiskUserInfoGet',
                    msg: msg,
                    ret: ret
                })
            });

            return def;
        }
    });
});