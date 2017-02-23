/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

var renderer = {

    mobile_render: function(data) {
        var headerHtml = tmpl.baseHeader();
        var bodyHtml = tmpl.body(data);
        var baseBottomHtml = tmpl.baseBottom(data);

        return headerHtml + bodyHtml + baseBottomHtml;

    },

    web_render: function(data) {
        var headerHtml = tmpl.webBaseHeader();
        var bodyHtml = tmpl.webBody(data);
        var baseBottomHtml = tmpl.webBaseBottom(data);

        return headerHtml + bodyHtml + baseBottomHtml;
    },

    login: function() {
        var headerHtml = tmpl.webBaseHeader();
        var bodyHtml = tmpl.login();

        return headerHtml + bodyHtml;
    },

    fail: function(data) {
        var headerHtml = tmpl.baseHeader();
        var bodyHtml = tmpl.error(data);
        var baseBottomHtml = tmpl.baseBottom(data);

        return headerHtml + bodyHtml + baseBottomHtml;
    }
}

module.exports = renderer;