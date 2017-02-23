define(function(require, exports, module) {

    var lib = require('lib'),

        cookie = lib.get('./cookie');

    var uin = cookie.get('p_uin') || cookie.get('uin') || '';
    if(uin) {
        uin = parseInt(uin.replace(/^[oO0]*/, ''));
    }

    return {
        get_uin: function() {
            return uin;
        },

        is_weixin_user: function() {
            var wy_uf = parseInt(cookie.get('wy_uf')) || 0;
            return !!wy_uf;
        }
    }
});