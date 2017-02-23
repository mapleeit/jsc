/**
 * 强制移除焦点
 * @date 13-5-15
 */
define(function (require, exports, module) {
    var $ = require('$'),
        support_fix = $.browser.msie && $.browser.version < 7,
        doc_el = document.documentElement,
        $el;

    return function () {
        $el || ($el = $('<button style="height:1px;width:1px;background:none;border:0 none;position:fixed;_position:absolute;left:0;top:0;' + (support_fix ? '' : doc_el.scrollTop + 'px') + '">').appendTo(document.body));
        $el.focus().remove();
    }
});