/**
 *
 * @author jameszuo
 * @date 13-4-8
 */
define(function (require, exports, module) {
    var $ = require('$');

    // 禁用IE6背景图片缓存
    if ($.browser.msie && $.browser.version < 7) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }
});