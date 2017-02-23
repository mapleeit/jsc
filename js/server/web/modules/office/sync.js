/**
 * 微云office文件预览
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        inspect     = require('weiyun/util/inspect/inspect'),
        defaultPage = require('weiyun/default-page.js'),
        page302     = require('weiyun/page302'),
        ajax        = require('weiyun/util/ajax'),
        config      = require('./config.js'),
        path        = require('path'),
        tmpl        = require('./tmpl.js');

    request.once('fail',function(){
        var html = tmpl.fail({
            text: '系统繁忙，请重试。'
        });
        responseHtml(html);
    });

    var inspector = inspect(request, response);

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();

    inspector.setView(__dirname + '/views');

    inspector.get(/.*\.html/, function() {
        inspector.sendfile(filename);
    });

    inspector.end();

    var has_response_end = false;
    function responseHtml(html) {
        var gzipResponse = gzipHttp.getGzipResponse({
            request: request,
            response: response,
            plug: plug,
            code: 200,
            contentType: 'text/html; charset=UTF-8'
        });

        if(!has_response_end) {
            gzipResponse.write(html);
            gzipResponse.end();
        }
        has_response_end = true;
    }
}