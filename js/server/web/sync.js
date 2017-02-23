/**
 * 微云整站直出入口
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        path = require('path'),
        browser = require('weiyun/util/browser')(),
        modMap = require('weiyun/conf/mod-map'),
        page302 = require('weiyun/page302'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        defaultPage = require('weiyun/default-page.js');

    var hostname = request.headers.host;

	/**
	 * 校验地址不合法时，直接302到主域名www.weiyun.com
	 */
	if(typeof request.REQUEST.pathname !== 'string') {
		page302(request, response, 'https://www.weiyun.com/');
		return;
	}

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var modulePath;
    var moduleAct;
    request.params.mod_act = 'weiyun_' + path[0];

    /**
     * 处理weiyun.com域名，直接302到主域名www.weiyun.com
     */
    if(hostname === 'weiyun.com') {
        page302(request, response, 'https://www.weiyun.com/');
        return;
    }

    if(paths[0] == '' && paths.length == 2 && !modMap['web'][paths[1]]) { //官网
        if(browser.mobile || browser.IPAD || browser.WINDOWS_WEIXIN) {
            modulePath = modMap['web']['mobile'];

            moduleAct = 'weiyun_mobile';
        } else {
            modulePath = modMap['web']['platform'];

            moduleAct = 'weiyun_platform';
        }

    } else if(paths[1]) {

        modulePath = modMap['web'][paths[1]];

        moduleAct = 'weiyun_' + paths[1];
    }

    if(typeof modulePath === 'string') {
        logger.debug('weiyun_mod: ${mod}',{
            mod: modulePath
        });

        modulePath = require(modulePath);
    }

    if(modulePath) {
        context.setModAct(moduleAct);
        modulePath(request, response);
    } else {
        defaultPage(request, response);
    }

}