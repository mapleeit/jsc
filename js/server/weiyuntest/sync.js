/**
 * 微云测试环境入口
 * @param request
 * @param response
 */

var config = plug('config');
var logger = plug('logger');
var ajax = plug('qzone/ajax');
var httpUtil = plug('util/http.js');
var router = plug('router');
module.exports = function(request, response) {

	var pathname = request.REQUEST['pathname'];
	//因为request.url没有带域名信息，所以拼接好URL再传过去，否则会加载失败，返回509错误
	var url = 'http://img.weiyun.com' + request.REQUEST.href;

	//club:js文件目录;vipstyle:样式图片目录
	if(/(club|vipstyle).*\.(js|css|png|jpg|gif)$/.test(pathname)) {
		ajax.proxy(request, response).request({
			url: url,
			type: request.method,
			dataType: 'proxy',
			autoToken: false,			//关闭自动补token逻辑，安全第一
			headers: {
				"host": 'img.weiyun.com',
				"origin": "" //后台不支持https开头的origin，把origin置空
			},
			dcapi: {
				fromId: 211006089,
				toId: 211006088,
				interfaceId: 111338220
			},
			l5api: config.l5api['img.weiyun.com']
		}).done(function(d) {

		}).fail(function(d) {
			logger.debug('fail');

			if(httpUtil.isSent(response)) {
				return;
			}

			response.setHeader('Content-Type', 'text/html; charset=UTF-8');
			response.writeHead(500);
			response.end();
		});
	} else {
		var host = request.headers['host'];
		if(host === 'www.weiyun.com') {
			require('weiyun/web/sync.js')(request, response);
		} else if(host === 'share.weiyun.com') {
			require('weiyun/share/sync.js')(request, response);
		} else if(host === 'h5.weiyun.com') {
			require('weiyun/h5/sync.js')(request, response);
		}
	}
}