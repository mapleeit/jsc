/**
 * 浏览器配型和版本
 * @author jameszuo
 * @date 13-8-5
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        name = (function (b) {
            if (b.msie || window.ActiveXObject !== undefined) {
                return 'ie';
            } else if (b.chrome) {
                return 'chrome';
            } else if (b.mozilla) {
                return 'mozilla';
            } else if (b.safari) {
                return 'safari';
            } else if (b.webkit) {
                return 'webkit';
            } else {
                return 'unknown';
            }
        })($.browser),

    undef;
    return {
        name: name
    };
});