/**
 * 微云整站直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        router = plug('router'),
        inspect = require('weiyun/util/inspect/inspect'),
	    reportMD = require('weiyun/util/reportMD'),
        page302 = require('weiyun/page302');

    var inspector = inspect(request, response);
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();
    var matched = false;

    if(Math.random() > 0.8) { //上报一半
        logger.report();
    }

    //官网先切https，其他页面有空验证后再放开
    if(pathname === '/') {
        var queryString = request.REQUEST.query;
        var is_debug = queryString.indexOf('__debug__') > -1 || request.cookies.debug && request.cookies.debug == 'on';
        var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';
	    var ua = (request.headers['user-agent'] || '').toLocaleLowerCase();
        var m = /msie\s*(\d*)/gi.exec(ua);
        var ieVersion = m && m[1];
	    var isErrorChrome = ua.search(/chrome\/(53|54)/) >= 0; //chrome 53、54版本会有证书过期bug，只能走http
        var protocol = 'https://';
        if(ieVersion && ieVersion <= 8 || isErrorChrome || is_debug) {
            protocol = 'http://';
        }
	    if(isErrorChrome) {
		    reportMD(179000215, ua.search('chrome/53') >= 0 ? 53 : 54, 0);
	    }
        var url = protocol + request.headers.host + request.REQUEST.href;
        if(isHttps && protocol == 'http://' || !isHttps && protocol == 'https://') {
            page302(request, response, url);
            return;
        }
    }

    inspector.setView(__dirname + '/views');

    inspector.get('/', function() { //匹配根目录
        matched = true;
        inspector.sendfile('index.html');
    });

    inspector.get(/^\/[^\/|.]+\.html/, function() { //匹配静态页面
        matched = true;
        inspector.sendfile(filename);
    });

    inspector.get('/favicon.ico', function() {
        matched = true;
        inspector.sendfile('favicon.ico');
    });

    if(!matched) {
        page302(request, response, 'http://www.weiyun.com');
    }
    //inspector.end(); //调用该方式，保证在没有匹配上时返回一个默认的页面

}