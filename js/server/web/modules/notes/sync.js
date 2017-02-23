/**
 * 微云整站直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        router = plug('router'),
        inspect = require('weiyun/util/inspect/inspect');

    var inspector = inspect(request, response);
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();

    inspector.setView(__dirname + '/views');

    inspector.get('', function() {
        inspector.sendfile('index.html');
    });

    inspector.get(/.*\.[html|png]/, function() {
        inspector.sendfile(filename);
    });

    inspector.end();

}