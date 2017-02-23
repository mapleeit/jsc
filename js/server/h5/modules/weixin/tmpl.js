
//tmpl file list:
//weixin/src/base.tmpl.html
//weixin/src/bind.tmpl.html
//weixin/src/list.tmpl.html
//weixin/src/login.tmpl.html
define("club/weiyun/js/server/h5/modules/weixin/tmpl",["weiyun/util/appid","weiyun/util/browser","weiyun/util/inline","weiyun/util/htmlEscape","weiyun/util/prettysize","weiyun/util/fileType"],function(require, exports, module){
var tmpl = { 
'baseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

    var serv_taken = new Date() - window.serv_start_time;
    var APPID = require('weiyun/util/appid')();
    var browser = require('weiyun/util/browser')();
    var serverConfig = plug('config') || {};
    var is_test_env = !!serverConfig.isTest;
    __p.push('    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>微云文件</title>\r\n\
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="format-detection" content="telephone=no" />\r\n\
	    <meta itemprop="name" content="腾讯微云" />\r\n\
	    <meta itemprop="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。" />\r\n\
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />\r\n\
        <style>\r\n\
            .icons-filetype {\r\n\
                display: inline-block;\r\n\
                width: 32px;\r\n\
                height: 32px;\r\n\
            }\r\n\
        </style>\r\n\
        <scr');
__p.push('ipt>var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';window.APPID = ');
_p(APPID);
__p.push(';window.g_serv_taken = ');
_p(serv_taken);
__p.push(';window.g_start_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border'], true));
__p.push('        ');
_p(require('weiyun/util/inline').css(['g-retina-table', 'g-filelist', 'g-bottom-bar', 'g-err']));
__p.push('        <scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
        <link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
\r\n\
    </head>\r\n\
    <body class="">\r\n\
');

return __p.join("");
},

'baseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var browser = require('weiyun/util/browser')();
    __p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        setTimeout(function() {\r\n\
            window.g_end_time = +new Date();\r\n\
        }, 0);\r\n\
    </scr');
__p.push('ipt>');
 if(browser.QQ) { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></scr');
__p.push('ipt>');
 } else if(browser.WEIXIN) { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></scr');
__p.push('ipt>');
 } __p.push('    ');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">');
 if(data) { __p.push(' //已经失败就不进行初始化了\r\n\
            window.node_sync = true;\r\n\
            seajs.use([\'$\', \'lib\',\'common\', \'weixin\'], function($, lib, common, weixin) {\r\n\
                window.g_js_time = +new Date();\r\n\
                var weixin = weixin.get(\'./weixin\');\r\n\
                weixin.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
            });');
 } __p.push('    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/weixin\',\r\n\
                    virtualDomain: "h5.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'bind': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>账号</title>\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="x5-orientation" content="portrait">\r\n\
        <!-- 如页面上需要使用文件类型icon，引入weiyun-filetype-icons.css -->\r\n\
        <link rel="stylesheet" href="//imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
        <link rel="stylesheet" href="//imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-weixin-bind.css">\r\n\
    </head>\r\n\
    <body data-seajs="">\r\n\
    <!-- 微云在微信里的文件夹空白页 -->\r\n\
    <div class="wy-wx-bind-wrap">\r\n\
        <div class="wy-wx-bind-author">\r\n\
            <div class="img-box">\r\n\
                <img src="');
_p(data.avatar || '//img.weiyun.com/ptlogin/v4/style/0/images/1.gif' );
__p.push('">\r\n\
            </div>\r\n\
            <div class="wy-wx-name">\r\n\
                <span class="wy-wx-bind-name">');
_p(data.nick_name);
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="wy-wx-bind-btn-wrap">\r\n\
            <a href="//h5.weiyun.com/weixin/" class="wy-wx-bind-check-file" title="查看我的微云文件">查看我的微云文件</a>\r\n\
            <a id="unbind" href="//web2.cgi.weiyun.com/wx_oa_web.fcg?cmd=unbind_qq" class="wy-wx-unbind-btn" title="解绑账号">解绑账号</a>\r\n\
        </div>\r\n\
    </div>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt>\r\n\
        seajs.use([\'$\', \'lib\',\'common\'], function($, lib, common) {\r\n\
            var cookie = lib.get(\'./cookie\');\r\n\
            var constants = common.get(\'./constants\');\r\n\
            $(\'#unbind\').on(\'click\', function(e) {\r\n\
                var cookie_options = {\r\n\
                    domain: constants.DOMAIN_NAME,\r\n\
                    path: \'/\'\r\n\
                };\r\n\
                $.each([\'indep\', \'uin\'], function (i, key) {\r\n\
                    cookie.unset(key, cookie_options);\r\n\
                });\r\n\
            });\r\n\
        });\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/mp/bind\',\r\n\
                    virtualDomain: "h5.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'fileList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <section id="_container" class="wy-share-filelist-wrapper">\r\n\
        <ul id="_list" class="unactive">');

            var htmlEscape = require('weiyun/util/htmlEscape');
            var prettysize = require('weiyun/util/prettysize');
            var fileType = require('weiyun/util/fileType');
            var list = data.list || [];
            __p.push('            ');

            list.forEach(function(file){
                var is_dir = !!file['dir_key'];
                var id = is_dir ? file['dir_key'] : file['file_id'];
                var file_name = is_dir ? htmlEscape(file['dir_name']) : htmlEscape(file['filename']);
                var file_size = is_dir ? 0 : prettysize(file['file_size']);
                var file_type = is_dir ? 'folder' : fileType(file_name);
                var thumb_url = file.ext_info && file.ext_info.thumb_url;//缩略图
                var https_url = file.ext_info && file.ext_info.https_url;//缩略图https
            __p.push('                <li id="item_');
_p(id);
__p.push('" data-id="item" data-file-id="');
_p(id);
__p.push('" data-action="enter" class="wy-file-item">\r\n\
                    <i ');
 if(thumb_url) { __p.push(' data-src="');
_p(thumb_url);
__p.push('" data-https-src="');
_p(https_url);
__p.push('" ');
 } __p.push(' class="icons-filetype icon-');
_p(file_type);
__p.push('"></i>\r\n\
                    <div class="file-describe bBor">\r\n\
                        <h3 class="file-name">');
_p(file_name);
__p.push('</h3>');
 if(!is_dir) { __p.push('                        <span class="file-info">\r\n\
                          <span class="file-size">');
_p(file_size);
__p.push('</span>\r\n\
                        </span>');
 } __p.push('                    </div>');
 if(is_dir) { __p.push('                    <i class="icon-grey-rarr"></i>');
 } __p.push('                </li>');
 }); __p.push('        </ul>\r\n\
    </section>\r\n\
    <div id="_load_more" class="wy-file-loading" style="display:none"><div><i class="icon icon-load"></i><span>加载中...</span></div></div>\r\n\
    <div id="_toolbar"  style="display: none;">\r\n\
        <div data-id="normal" class="wy-file-controller g-bottom-bar">\r\n\
            <button class="btn" data-action="share" role="button">选择文件并分享</button>\r\n\
        </div>\r\n\
        <div data-id="confirm" class="wy-file-controller g-bottom-bar" style="display:none;">\r\n\
            <button class="btn btn-certain" data-action="confirm" role="button">确定</button>\r\n\
            <button class="btn btn-cancel" data-action="cancel" role="button">取消</button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

    var serverConfig = plug('config') || {};
    var wxAppid = serverConfig.isTest ? 'wxe310dc0d754093ee' : 'wxd15b727733345a40'; //测试时使用测试号的appid
    __p.push('    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>登录</title>\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="x5-orientation" content="portrait">\r\n\
        <!-- 如页面上需要使用文件类型icon，引入weiyun-filetype-icons.css -->\r\n\
        <link rel="stylesheet" href="//imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
        <link rel="stylesheet" href="//imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-pub-ac.css">\r\n\
    </head>\r\n\
    <body data-seajs="">\r\n\
    <section class="wy-bg-wrapper">\r\n\
        <div class="wy-login-wrapper">\r\n\
            <p class="wy-logo"></p>\r\n\
            <div class="btn-group">\r\n\
                <!-- .btn-main 按下时 添加 btn-main-active class -->\r\n\
                <button id="qqlogin" class="btn btn-main" type="submit" role="button">QQ登录</button>\r\n\
                <!-- .btn 按下时 添加 btn-active class-->\r\n\
                <button id="wxlogin" class="btn trblBor" type="submit" role="button">微信登录</button>\r\n\
            </div>\r\n\
        </div>\r\n\
    </section>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        $(\'#qqlogin\').on(\'touchstart\', function(e) {\r\n\
            $(e.target).addClass(\'btn-main-active\');\r\n\
        }).on(\'touchend\', function(e) {\r\n\
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=');
_p(wxAppid);
__p.push('&redirect_uri=http%3A%2F%2Fweb2.cgi.weiyun.com%2Fweixin_oauth20.fcg%3Fg_tk%3D5381%26appid%3D');
_p(wxAppid);
__p.push('%26action%3Dqq_login&response_type=code&scope=snsapi_userinfo&state=qq_login#wechat_redirect";\r\n\
        });\r\n\
\r\n\
        $(\'#wxlogin\').on(\'touchstart\', function(e) {\r\n\
            $(e.target).addClass(\'btn-active\');\r\n\
        }).on(\'touchend\', function(e) {\r\n\
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=');
_p(wxAppid);
__p.push('&redirect_uri=http%3A%2F%2Fweb2.cgi.weiyun.com%2Fweixin_oauth20.fcg%3Fg_tk%3D5381%26appid%3D');
_p(wxAppid);
__p.push('%26action%3Dwx_login&response_type=code&scope=snsapi_userinfo&state=wx_login#wechat_redirect";\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'weiyun/mp/login\',\r\n\
                    virtualDomain: "h5.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'indepLogin': function(data){

var __p=[],_p=function(s){__p.push(s)};

        var serverConfig = plug('config') || {};
        var wxAppid = serverConfig.isTest ? 'wxe310dc0d754093ee' : 'wxd15b727733345a40'; //测试时使用测试号的appid
    __p.push('<!DOCTYPE html>\r\n\
<html>\r\n\
<head>\r\n\
<meta charset="UTF-8">\r\n\
        <title>登录</title>\r\n\
        <meta name="format-detection" content="telephone=no">\r\n\
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta itemprop="name" content="微云">\r\n\
        <meta itemprop="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。">');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'g-password'], true));
__p.push('        </head>\r\n\
        <body>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',\'common\', \'indep_login\'], function($, lib, common, indep_login) {\r\n\
            var indep_login = indep_login.get(\'./indep_login\');\r\n\
            indep_login.show();\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/mp/login\',\r\n\
                virtualDomain: "h5.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
}
};
return tmpl;
});
