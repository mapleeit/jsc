/**
 * https相关url进行转换
 * @author hibincheng
 * @date 2014-09-22
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        constants = require('./constants'),

        //目前只有分片上传支持https
        support_https_upload_type = [
            'webkit_plugin',
            'active_plugin',
            'upload_h5_flash'
        ],

        undefined;

    //采用架平的域名转发平台,联系人@clusterli
    var map = {
        "disk.cgi.weiyun.com": "user.weiyun.com/disk/",
        "pre.cgi.weiyun.com": "user.weiyun.com/pre/",
        "stat.cgi.weiyun.com": "user.weiyun.com/stat/",
        //"api.weiyun.com": "user.weiyun.com/newcgi/",
        "web2.cgi.weiyun.com": "user.weiyun.com/newcgi/",

        "download.cgi.weiyun.com": "user.weiyun.com/download/",
        "tj.cgi.weiyun.com": "user.weiyun.com/tj/",
        "web.cgi.weiyun.com": "user.weiyun.com/oldcgi/",
        "diffsync.cgi.weiyun.com": "user.weiyun.com/diffsync/",

        "docview.weiyun.com": "user.weiyun.com/docview/",
        "user.weiyun.com": "user.weiyun.com/",

        "c.isdspeed.qq.com": "user.weiyun.com/isdspeed/c/",
        "p.qpic.cn": "user.weiyun.com/",
        "shp.qpic.cn": "user.weiyun.com/notepic/",
        "wx.cgi.weiyun.com": "user.weiyun.com/wx/",
	    "www.weiyun.com": "www.weiyun.com/",
	    "share.weiyun.com": "share.weiyun.com/",
	    "h5.weiyun.com": "h5.weiyun.com/",
	    "mp.weixin.qq.com": "mp.weixin.qq.com/"
    };

    function translate_url(url) {
        var link = document.createElement('a');

        link.href = url;
        var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'

        return constants.HTTP_PROTOCOL + '//' + translate_host(link.hostname) + (link.port ? (':' + translate_port(link.port)) : '') + pathname + link.search + link.hash;
    }

    function translate_download_url(url) {
        var link;

        if(constants.IS_APPBOX) {
            link = document.createElement('a');
            link.href = url;
            var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'
            return link.protocol + '//' + translate_host(link.hostname) + (link.port ? (':' + link.port) : '') + pathname + link.search + link.hash;
        } else {
            return translate_url(url);
        }

    }

    function translate_host(host) {
        if(!host) {
            return host;
        }

        if(host.indexOf('.ftn.') > -1) { //host中带".ftn."的认为是ftn的上传下载url;
            return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
        }

        return host.replace(/\.qq\.com/, '.weiyun.com');
    }

    function translate_port(port) {
        if(constants.IS_HTTPS) {
            return constants.HTTPS_PORT;
        }
        return port;
    }

    function translate_ftnup_port(port, upload_type) {
        if(constants.IS_APPBOX) { // appbox 先不支持https
            return port;
        }
        if(constants.IS_HTTPS) {
            return $.inArray(upload_type, support_https_upload_type) > -1 ? constants.HTTPS_PORT : port;
        }

        return port;
    }

    function translate_cgi(cgi) {
        var m = /^https?:\/\/([\w\.]+)(?:\/(.+))?/.exec(cgi);
        if(!constants.IS_HTTPS && constants.IS_DEBUG) { //debug时，方便联调cgi
            return cgi;
        }
        if(m && m[1] && map[m[1]]) {
            cgi =  constants.HTTP_PROTOCOL + '//' + map[m[1]] + (m[2] || '');
        }

        return cgi;
    }

    /**
     * 对笔记内的图片用h5.weiyun.com来代理
     * 1/解决跨域;  2/复制粘贴图片时保证外站图片也能通过https访问
     * @param notepic_url
     * @returns {*}
     */
    function translate_notepic_url(notepic_url) {
        if(!notepic_url) {
          return '';
        } else if (notepic_url.indexOf('tx_tls_gate') === -1) {
            notepic_url = 'https://h5.weiyun.com/tx_tls_gate=' + notepic_url.replace(/^http:\/\/|^https:\/\//, '');
        }
        return notepic_url;
    }

    return {
        translate_url: translate_url,
        translate_download_url: translate_download_url,
        translate_notepic_url: translate_notepic_url,
        translate_host: translate_host,
        translate_port: translate_port,
        translate_cgi: translate_cgi,
        translate_ftnup_port: translate_ftnup_port
    };
});