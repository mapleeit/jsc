/**
 * 微云整站直出
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var path = require('path'),
        browser = require('weiyun/util/browser')(),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        reportMD = require('weiyun/util/reportMD'),
        inspect = require('weiyun/util/inspect/inspect');

    var inspector = inspect(request, response);
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var filename = (pathname || '').split('/').pop();

    inspector.setView(__dirname + '/views');

    inspector.get('/', function() {
        reportMD(179000186, 150001, 0);

        inspector.sendfile('index.html');
    });

    /**
     * 一些老的url，已经在客户端写死了。
     * http://www.weiyun.com/mobile/2.0/forget-password.html
     */
    inspector.get(/2.0\/[^\/|.]+\.html/, function() {
        var map = {
            'forget-password.html' : 150001
        };
        var ret = map[filename];
        reportMD(179000186, ret, 0);

        inspector.sendfile(filename);
    });

    inspector.get(/office\/[^\/|.]+\.html/, function() {
        var map = {
            'agreement.html' : 150101,
            'authorize.html' : 150102,
            'office_login.html' : 150103
        };
        var ret = map[filename];
        reportMD(179000186, ret, 0);

        inspector.sendfile('office/' + filename, 0);
    });

    inspector.get(/^\/mobile\/[^\/|.]+\.html/, function() {
        var removedPages = [
            'faq.html',
            'mobile_outlink_jump.html',
            'wap_outlink.html',
            'webapi.html',
            'websocket.html',
            'wx_help.html',
            'wx_help_ios.html',
            'wyfire-faq-cn.html',
            'wyfire-faq-en.html'
        ];
        var map = {
            'complaint.html' : 150201,
            'contact-backup.html' : 150202,
            'faq.html' : 150203,  // has been removed
            'index.html' : 150204,
            'jump_app.html' : 150205,
            'mobile_outlink_jump.html' : 150206,  // has been removed
            'reduce-space-announcement.html' : 150207,
            'vip-more-privilege.html' : 150208,
            'wap_outlink.html': 150209,  // has been removed
            'webapi.html' : 150210,  // has been removed
            'websocket.html' : 150211,  // has been removed
            'wx_help.html' : 150212,  // has been removed
            'wx_help_ios.html' : 150213,  // has been removed
            'wy_restore_help.html' : 150214,
            'wyfire-faq-cn.html' : 150215,  // has been removed
            'wyfire-faq-en.html' : 150216,  // has been removed
            'xy.html' : 150217
        };
        var ret = map[filename];
        reportMD(179000186, ret, 0);


        removedPages.indexOf(filename) === -1 && inspector.sendfile(filename);
    });

    inspector.end();

};