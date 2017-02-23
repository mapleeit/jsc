/**
 * 微云整站直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        inspect = require('weiyun/util/inspect/inspect');

    var inspector = inspect(request, response);
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();

    if(filename === 'qrcode' || filename === 'qrcode.php') {
        require('./qrcode')(request, response);
    } else if(filename === 'sendsms' || filename === 'sendsms.php') {
        require('./sendsms')(request, response);
    } else {
        try {
            var modulePath = require('weiyun/web/modules/common/' + filename);
            if(modulePath) {
                modulePath(request, response);
            } else {
                inspector.end();
            }
        } catch(e) {
            inspector.end();
        }

    }


}