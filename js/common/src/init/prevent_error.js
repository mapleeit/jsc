/**
 * 阻止浏览器默认的错误处理
 * @author jameszuo
 * @date 13-1-10 下午3:56
 */
define(function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),

        console = lib.get('./console'),

        constants = require('./constants'),

        prevent_error = !constants.IS_DEBUG && ($.browser.msie || constants.IS_APPBOX), // 阻止IE和appbox下的脚本错误提示

        undefined;

    constants.IS_DEBUG || (window.onerror = function (msg, file, line) {
        console.error( msg, file || '', line || '');
        return prevent_error;
    });

});