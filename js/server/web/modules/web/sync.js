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
        inspect = require('weiyun/util/inspect/inspect'),
        page302 = require('weiyun/page302');

    var inspector = inspect(request, response);
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();
    var matched = false;

    //兼容qzone应用中心跳转到微云web
    if(filename.indexOf('wrap_qzone.php') > -1) {
        page302(request, response, 'http://ptlogin2.qq.com/ho_cross_domain?&tourl=http%3A%2F%2Fwww.weiyun.com%2Fdisk%2Findex.html%3Fqzone');
        return;
    }

    inspector.setView(__dirname + '/views');

    inspector.get('', function() {
        matched = true;
        inspector.sendfile('index.html');
    });

    inspector.get(/.*(callback)\/.+\.html/, function() {
        matched = true;
        inspector.sendfile('callback/' + filename);
    });

    //inspector.end();
    if(!matched) {
        page302(request, response, 'http://www.weiyun.com');
    }

}