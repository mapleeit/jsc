/**
 * H5域名下的分享，302跳转到其他地址，这里不做其他业务逻辑如CGI等处理
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger      = plug('logger'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        page302     = require('weiyun/page302'),
        defaultPage = require('weiyun/default-page.js'),
        pageError   = require('weiyun/pageError.js'),
        path        = require('path');

    var isHttps = request.headers['x-client-proto'] && request.headers['x-client-proto'] == 'https';
    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var fromid = request.GET['fromid'];

    request.once('fail',function(){
        pageError(request, response, '服务器繁忙');
        return 0;
    });

    var jumpMap = {
        //分享外链
        //example: http://h5.weiyun.com/jump_share?fromid=100&share_key=xxxxxxxxxxxxxxxx
        '100': {
            url: 'share.weiyun.com',
            is_debug: true,
            is_redirect: false
        },
        //手机官网页面
        //example: http://h5.weiyun.com/jump_share?fromid=101
        '101': {
            url: 'www.weiyun.com/mobile/index.html',                            //静态页面，当is_redirect为true会优先取这个值来跳转
            is_debug: false,                                                     //是否有debug模式，即兼容http和https
            is_redirect: true                                                   //是否直接跳转，true则直接302到url字段里
        }
    }

    var getURL = function(config, fromId) {
        var url;
        switch(fromId) {
            case '100':
                //判断shareKey是否合法，不合法返回404
                var shareKey = request.GET['share_key'];
                url = (!shareKey || shareKey.length !== 32)? '' : config.url + '/' + shareKey;
                break;

            default :
                url = config.url;
        }

        return url;
    };

    //限制路径，防止坏人构造URL
    if(paths.length>2 || !fromid || !jumpMap[fromid]) {
        defaultPage(request, response);
        return;
    }

    var url,
        config = jumpMap[fromid];

    if(config.is_redirect && config.url) {
        url = config.url;
    } else if(!config.is_redirect) {
        url = getURL(config, fromid);
    }

    if(!url) {
        defaultPage(request, response);
        return;
    }

    //如果开启debug模式，需要切为http请求
    var protocol = (!config.is_debug && isHttps)? 'https:' : 'http:';
    url = protocol + '//' + url;
    page302(request, response, url);


}