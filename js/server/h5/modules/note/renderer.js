/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

var renderer = {

    baseHeader: function() {
        return tmpl.baseHeader();
    },

    baseBottom: function(data) {
        return tmpl.baseBottom(data);
    },

    fileList: function(notelist) {
        return tmpl.note_list({
            list: notelist
        });
    },

    renderIndepLogin: function() {
        return tmpl.indepLogin();
    },

    render: function(notelist) {
        var headerHtml = this.baseHeader();
        var fileHtml = '';

        if(!notelist || !notelist.length) {
            fileHtml = tmpl.empty();
        } else {
            fileHtml = this.fileList(notelist);
        }

        var baseBottomHtml = this.baseBottom({
            notelist: notelist
        });
        return headerHtml + fileHtml + baseBottomHtml;

    }
}

module.exports = renderer;