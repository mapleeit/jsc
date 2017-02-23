/**
 * 微云前端模调上报
 * @iscowei 15-12-16 下午22:45
 */
define(function (require, exports, module) {
	var constants = require('./constants');
    var https_tool = require('./util.https_tool');

    var cgi_url = constants.HTTP_PROTOCOL + '//www.weiyun.com/report/md';
    cgi_url = https_tool.translate_cgi(cgi_url);

    /**
     * oz 模调被调上报，注意查询被调而不是主调。
     * 查询方法：m.isd.com的模调页，选被调查询，微云-微云业务-Web接入业务，填被调id和接口id
     * @param {String|Number} to 被调id，在模调系统里建的
     * @param {String|Number} id 接口id，在模调系统里建的
     * @param {String|Number} code 调用结果
     * @param {String|Number} result 0：成功，1:失败，2:逻辑失败
     */
    var reportMD = function(to, id, code, result) {
	    var ext = '';
        if(to && id) {
	        if(code != undefined) {
		        ext += "&code=" + code;
	        }
	        if(result != undefined) {
		        ext += "&type=" + result;
	        }
            var url = cgi_url + "?fromId=204971707&toId=" + to + "&interfaceId=" + id + ext + "&r=" + Math.random();
            var img = new Image();
            img.src = url;
        }
    };

    return reportMD;
});