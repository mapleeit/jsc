/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');
var user = require('weiyun/util/user');

/**
 * 分拣目录列表、文件列表
 * @param {Array<Obect>} dirFileList
 */
var parseData = function(dirFileList) {
    var dirList = dirFileList[0] && (dirFileList[0]['dir_list'] || []) || [],
        fileList = dirFileList[0] && (dirFileList[0]['file_list'] || []) || [];

    return {
        dir_list: dirList,
        file_list: fileList
    };
}

var renderer = {

    baseHeader: function() {
        return tmpl.baseHeader();
    },

    baseBottom: function(data) {
        return tmpl.baseBottom(data);
    },

    fileList: function(list) {
        return tmpl.fileList({
            list: list
        });
    },

    render: function(userInfo, dirFileList, signInfo) {
        var headerHtml = this.baseHeader(),
            data = parseData(dirFileList);

        var list = data.dir_list.concat(data.file_list);
        var fileHtml = this.fileList(list),
            baseBottomHtml = this.baseBottom({
                userInfo: userInfo,
                signInfo: signInfo,
                data: data
            });

        return headerHtml + fileHtml + baseBottomHtml;

    },

    renderBind: function(userInfo) {
        return tmpl.bind({
            avatar: userInfo.head_img_url,
            nick_name: userInfo.nickname
        });
    },

    renderIndepLogin: function(data) {
        return tmpl.indepLogin(data);
    },

    renderLogin: function() {
        return tmpl.login();
    }
}

module.exports = renderer;