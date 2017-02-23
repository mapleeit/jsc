
//tmpl file list:
//recent/src/base.tmpl.html
//recent/src/empty.tmpl.html
//recent/src/list.tmpl.html
//recent/src/login.tmpl.html
define("club/weiyun/js/server/h5/modules/recent/tmpl",["weiyun/util/appid","weiyun/util/browser","weiyun/util/inline","weiyun/util/htmlEscape","weiyun/util/prettysize","weiyun/util/fileType"],function(require, exports, module){
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
        <title>最近文件</title>\r\n\
        <meta name="description" content="">\r\n\
        <meta name="HandheldFriendly" content="True">\r\n\
        <meta name="MobileOptimized" content="320">\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="apple-mobile-web-app-capable" content="yes">\r\n\
        <meta name="apple-mobile-web-app-status-bar-style" content="black">\r\n\
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
 if(browser.QQ) { __p.push('        <scr');
__p.push('ipt src="//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></scr');
__p.push('ipt>');
 } else if(browser.WEIXIN) { __p.push('        <scr');
__p.push('ipt type="text/javascript" src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></scr');
__p.push('ipt>');
 } __p.push('    ');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">');
 if(data) { __p.push(' //已经失败就不进行初始化了\r\n\
            window.node_sync = true;\r\n\
            seajs.use([\'$\', \'lib\',\'common\', \'recent\'], function($, lib, common, recent) {\r\n\
                window.g_js_time = +new Date();\r\n\
                var recent = recent.get(\'./recent\');\r\n\
                recent.render(');
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
                    virtualURL: \'/recent\',\r\n\
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

'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wy-blank-wrap">\r\n\
        <div class="wy-blank">\r\n\
            <i class="wy-gray-logo"></i>\r\n\
            <p>没有新文件</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'fileList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <section id="_container" class="wy-share-filelist-wrapper">\r\n\
        <!-- 点击保存到微云后，ul addClass(\'active\') removeClass(\'unactive\'),\r\n\
             点击取消后，ul removeClass(\'active\') addClass(\'unactive\') -->\r\n\
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
            __p.push('            <!-- 文件是不可选择的时候 添加unchoseable class -->\r\n\
            <li data-id="item" id="item_');
_p(id);
__p.push('" data-file-id="');
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
__p.push('</h3>\r\n\
                  <span class="file-info">\r\n\
                    <span class="file-size">');
_p(file_size);
__p.push('</span>\r\n\
                  </span>\r\n\
                </div>\r\n\
            </li>');
 }); __p.push('        </ul>\r\n\
\r\n\
        <!-- 一次加载20个文件，要再加载的时候显示 \'加载中\' -->\r\n\
        <div id="_load_more" class="wy-file-loading" style="display: none;">\r\n\
            <i class="icons icon-load"></i>\r\n\
            <span>加载中...</span>\r\n\
        </div>\r\n\
    </section>\r\n\
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

'indepLogin': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var serverConfig = plug('config') || {};
    var wxAppid = serverConfig.isTest ? 'wxe310dc0d754093ee' : 'wxd15b727733345a40'; //测试时使用测试号的appid
__p.push('<!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>\r\n\
    <meta charset="UTF-8">\r\n\
        <title>登录</title>\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="x5-orientation" content="portrait">');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'g-password'], true));
__p.push('        </head>\r\n\
        <body>\r\n\
\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('        <scr');
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
                virtualURL: \'/public/mp/login\',\r\n\
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
