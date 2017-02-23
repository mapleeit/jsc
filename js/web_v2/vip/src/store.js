/**
 * vip store
 * @author : xixinhuang
 * @date: 2016/10/22
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = common.get('./module'),
        undefined;

    var store = new Module('store', {
        init: function (data) {
            var me = this;

            me.data = data;
        },

        is_weiyun_vip: function() {
            return this.data['isVip'];
        },

        is_weiyun_old_vip: function() {
            return this.data['oldVip'];
        },

        is_weixin_user: function() {
            return this.data['isWxUser'];
        },

        get_head_url: function() {
            return this.data['avatar'] || this.data['headUrl'] || '';
        },

        get_expires_date: function() {
            return this.data['expiresDate'] || '';
        }
    });

    return store;
});