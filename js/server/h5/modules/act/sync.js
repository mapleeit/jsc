/**
 * 活动入口
 * @param plug
 * @param request
 * @param response
 */
module.exports = function(request, response) {
    var logger = plug('logger'),
        path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        defaultPage = require('weiyun/default-page.js'),
        modMap = require('weiyun/conf/mod-map');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var modulePath;
    var moduleAct;

    if(paths[2]) {

        modulePath = modMap['act'][paths[2]];
        moduleAct = 'weiyun_' + 'act' + paths[2];
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