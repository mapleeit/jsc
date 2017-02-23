/**
 * 微云PC客户端内嵌页直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        path = require('path'),
        browser = require('weiyun/util/browser')(),
        modMap = require('weiyun/conf/mod-map'),
        inspect = require('weiyun/util/inspect/inspect'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        defaultPage = require('weiyun/default-page.js');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var module = request.GET.m;
    var filename = (pathname || '').split('/').pop();
    var moduleAct,
        modulePath;
    request.params.mod_act = 'weiyun_' + path[0];

    var inspector = inspect(request, response);
    inspector.setView(__dirname + '/views');

    if(filename !== 'index.html') {
        inspector.get(/^\/[^\/|.]+/, function() { //匹配静态页面
            inspector.sendfile(filename);
        });
        inspector.end(); //调用该方式，保证在没有匹配上时返回一个默认的页面
        return;
    }

    if(module) {
        modulePath = modMap['client'][module];
        moduleAct = 'weiyun_' + module;
    } else {
        modulePath = modMap['client'][module];
        moduleAct = 'weiyun_' + module;
    }

    if(typeof modulePath === 'string') {
        modulePath = require(modulePath);
    }
    if(modulePath) {
        context.setModAct(moduleAct);
        modulePath(request, response);
    } else {
        defaultPage(request, response);
    }
}