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

    fileList: function(fileList) {
        return tmpl.fileList({
            list: fileList
        });
    },

    renderIndepLogin: function() {
        return tmpl.indepLogin();
    },

    render: function(fileList) {
        var headerHtml = this.baseHeader();
        var fileHtml = '';

        if(!fileList || !fileList.length) {
            fileHtml = tmpl.empty();
        } else {
            fileHtml = this.fileList(fileList);
        }

        var baseBottomHtml = this.baseBottom({
            file_list: fileList
        });

        return headerHtml + fileHtml + baseBottomHtml;
    }
}

module.exports = renderer;