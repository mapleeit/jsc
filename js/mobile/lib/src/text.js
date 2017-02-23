/**
 * html escape
 * @param text
 * @returns {number}
 */
define(function(require, exports, module) {

    function text(html) {
        return html.replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/"/g, '&quot;').
            replace(/'/g, '&#039;');
    }

    return {
        text: text
    }
});