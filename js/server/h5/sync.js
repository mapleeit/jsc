/**
 * 微云整站直出入口
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        defaultPage = require('weiyun/default-page.js'),
        pageError   = require('weiyun/pageError.js'),
        modMap = require('weiyun/conf/mod-map');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var modulePath;
    var moduleAct;

    if(pathname == '/error.html') {
        pageError(request, response);
        return;
    }

    if(paths[1]) {
        modulePath = modMap['h5'][paths[1]];
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