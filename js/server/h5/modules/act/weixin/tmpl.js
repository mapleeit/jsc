
//tmpl file list:
//weixin/src/fail.tmpl.html
//weixin/src/login.tmpl.html
//weixin/src/success.tmpl.html
define("club/weiyun/js/server/h5/modules/act/weixin/tmpl",[],function(require, exports, module){
var tmpl = { 
'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<!DOCTYPE html>\r\n\
<!DOCTYPE html>\r\n\
<html><head>\r\n\
    <meta charset="UTF-8">\r\n\
    <title>领取容量</title>\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-get-capacity.css?v=1">\r\n\
</head>\r\n\
<body>\r\n\
<section class="wy-act-wrapper">\r\n\
    <header class="wy-logo-wrapper">\r\n\
        <i class="icon icon-wy-logo">微云</i>\r\n\
    </header>\r\n\
\r\n\
    <!-- 领取容量失败时使用 -->\r\n\
     <section class="wy-act-fail-wrapper">\r\n\
      <div class="text-wrapper">\r\n\
        <h1 class="main-title">非常抱歉</h1>\r\n\
        <p class="sub-title">');
_p(data);
__p.push('</p>\r\n\
      </div>\r\n\
    </section>\r\n\
</section>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'http://pingjs.qq.com/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/act/weixin/fail.html\',\r\n\
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

'login': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var serverConfig = plug('config') || {};
    var wxAppid = serverConfig.isTest ? 'wxe310dc0d754093ee' : 'wxd15b727733345a40'; //测试时使用测试号的appid
__p.push('<!DOCTYPE html>\r\n\
<html>\r\n\
<head>\r\n\
    <meta charset="UTF-8">\r\n\
    <title>登录</title>\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
    <meta name="x5-orientation" content="portrait">\r\n\
    <!-- 如页面上需要使用文件类型icon，引入weiyun-filetype-icons.css -->\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-pub-ac.css">\r\n\
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
__p.push('ipt type="text/javascript" src="http://imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
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
__p.push('%26action%3Dsub_act_qq_login&response_type=code&scope=snsapi_userinfo&state=sub_act_qq_login#wechat_redirect";\r\n\
    });\r\n\
\r\n\
    $(\'#wxlogin\').on(\'touchstart\', function(e) {\r\n\
        $(e.target).addClass(\'btn-active\');\r\n\
    }).on(\'touchend\', function(e) {\r\n\
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=');
_p(wxAppid);
__p.push('&redirect_uri=http%3A%2F%2Fweb2.cgi.weiyun.com%2Fweixin_oauth20.fcg%3Fg_tk%3D5381%26appid%3D');
_p(wxAppid);
__p.push('%26action%3Dsub_act_wx_login&response_type=code&scope=snsapi_userinfo&state=sub_act_wx_login#wechat_redirect";\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'http://pingjs.qq.com/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/act/weixin/login.html\',\r\n\
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

'success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<!DOCTYPE html>\r\n\
<html><head>\r\n\
    <meta charset="UTF-8">\r\n\
    <title>领取容量</title>\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
    <link rel="stylesheet" href="http://imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-get-capacity.css?v=1">\r\n\
</head>\r\n\
<body>\r\n\
<section class="wy-act-wrapper">\r\n\
    <header class="wy-logo-wrapper">\r\n\
        <i class="icon icon-wy-logo">微云</i>\r\n\
    </header>\r\n\
    <!-- 容量领取成功时使用 -->\r\n\
    <section class="wy-act-suc-wrapper">\r\n\
        <div class="text-wrapper">\r\n\
            <p class="sub-title">恭喜您成功领取了</p>\r\n\
            <h1 class="main-title">3T 免费大容量！</h1>\r\n\
        </div>\r\n\
        <div class="anim-wrapper">\r\n\
            <b class="anim-hand"></b>\r\n\
            <span class="basket-capacity">3T</span>\r\n\
            <b class="anim-folder"></b>\r\n\
            <b class="anim-tablet1"></b>\r\n\
            <b class="anim-tablet2"></b>\r\n\
        </div>\r\n\
        <a href="http://www.weiyun.com/mobile/jump_app.html" class="capacity-btn">马上去查看</a>\r\n\
    </section>\r\n\
\r\n\
    <!-- 领取容量失败时使用 -->\r\n\
    <!-- <section class="wy-act-fail-wrapper">\r\n\
      <div class="text-wrapper">\r\n\
        <h1 class="main-title">非常抱歉</h1>\r\n\
        <p class="sub-title">因系统原因暂时未能</p>\r\n\
        <p class="sub-title">成功领取！</p>\r\n\
      </div>\r\n\
    </section> -->\r\n\
</section>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'http://pingjs.qq.com/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/act/weixin/success.html\',\r\n\
                virtualDomain: "h5.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
</body></html>');

return __p.join("");
}
};
return tmpl;
});
