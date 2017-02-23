/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        undefined;


    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            if(data) {
                this.user_info = data['userInfo'];
                this.QQVipInfo = data['QQVipInfo'];
            } else {
                this.user_info = {};
                this.QQVipInfo = {};
            }
            this._inited = true;
        },

        get_user_info: function() {
            return this.user_info;
        },

        get_qq_vip_info: function() {
            return this.QQVipInfo;
        },

        is_weiyun_vip: function() {
            return this.user_info && this.user_info['weiyun_vip_info'] && this.user_info['weiyun_vip_info']['weiyun_vip'];
        },

        is_old_weiyun_vip: function() {
            return  this.user_info && this.user_info['weiyun_vip_info'] && this.user_info['weiyun_vip_info']['old_weiyun_vip'];
        },

        is_qq_vip: function() {
            return !!(this.QQVipInfo['vip_open'] && parseInt(this.QQVipInfo['vip_open']));
        },

        is_qq_svip: function() {
            return !!(this.QQVipInfo['svip_open'] && parseInt(this.QQVipInfo['svip_open']));
        }
    };

    $.extend(store, events);

    return store;
});