/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        undefined;

    var account = new Module('weixin.account', {

        init: function(user_info) {
            this._d = user_info;
        },

        get_root_key: function() {
            return this._d['root_dir_key'] || '';
        },

        get_main_key: function() {
            return this._d['main_dir_key'] || '';
        }
    });

    return account;
});