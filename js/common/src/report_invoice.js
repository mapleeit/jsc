/**
 * 微云office预览上报
 * @iscowei 16-01-05 下午16:10
 */
define(function (require, exports, module) {
	var query_user = require('./query_user');
	var constants = require('./constants');
    var https_tool = require('./util.https_tool');

	var cgi_url = constants.HTTP_PROTOCOL + '//www.weiyun.com/p/appcenter/write_invoice';
    cgi_url = https_tool.translate_cgi(cgi_url);

    /**
     * 接口负责人：vitoxu
     * 查询方法：http://pengyou.cm.com/ugc_log/，菜单里选“微云office”
     */
    var reportInvoice = function(msg) {
	    var url = cgi_url + '?appid=30&uin=' + query_user.get_uin().replace(/^o0*/, '') + '&msg=' + encodeURIComponent(msg);
        var img = new Image();
        img.src = url;
    };

    return reportInvoice;
});