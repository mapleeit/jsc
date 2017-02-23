
//tmpl file list:
//office/src/fail.tmpl.html
//office/src/previewer.tmpl.html
define("club/weiyun/js/server/web/modules/office/tmpl",[],function(require, exports, module){
var tmpl = { 
'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
    <!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
    <!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
    <!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
    <head>\r\n\
        <meta charset="utf-8">\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">\r\n\
        <title>微云-文件预览</title>\r\n\
        <meta name="Keywords" content="关键字">\r\n\
        <meta name="Description" content="说明">\r\n\
        <link charset="utf-8" rel="stylesheet" href="//img.weiyun.com/vipstyle/nr/box/css/file-preview.css?max_age=31104000">\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/jquery/jquery-1.8.3.min.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
    </head>\r\n\
\r\n\
    <body class="web-app">\r\n\
    <div class="file-preview file-preview-xls">\r\n\
        <div id="header" class="file-preview-hd clearfix">\r\n\
            <div class="microsoft-info">\r\n\
                <span class="logo"></span>\r\n\
                <p class="links">\r\n\
                    <a href="#">帮助</a><i class="split"></i><a href="">意见反馈</a>\r\n\
                </p>\r\n\
                <p class="state">此服务使用微软Office服务预览技术</p>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="file-preview-bd">\r\n\
\r\n\
        </div>\r\n\
    </div>\r\n\
  </body>\r\n\
</html>');

return __p.join("");
},

'previewer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
    <!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
    <!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
    <!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
    <head>\r\n\
        <meta charset="utf-8">\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">\r\n\
        <title>微云-文件预览</title>\r\n\
        <meta name="Keywords" content="关键字">\r\n\
        <meta name="Description" content="说明">\r\n\
        <link charset="utf-8" rel="stylesheet" href="//img.weiyun.com/vipstyle/nr/box/css/file-preview.css?max_age=31104000">\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/jquery/jquery-1.8.3.min.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
    </head>\r\n\
\r\n\
    <body class="web-app">\r\n\
    <div class="file-preview file-preview-xls">\r\n\
        <div id="header" class="file-preview-hd clearfix">\r\n\
            <div class="file-info">\r\n\
                <i class="ui-icon icon-file icon-file-xls"></i>\r\n\
                <div class="name">');
_p(data.name);
__p.push('<span class="size">(');
_p(data.size);
__p.push(')</span></div>\r\n\
                <div class="path">文件位置 : <a href="#" class=""></a></div>\r\n\
            </div>\r\n\
            <div class="actions-wrap">\r\n\
                <a class="btn" href="#"><span class="btn-inner"><i class="ui-icon icon-down"></i><span class="text">下载</span></span></a>\r\n\
                <a class="btn" href="#"><span class="btn-inner enabled"><i class="ui-icon icon-write"></i><span class="text">编辑文章</span></span></a>\r\n\
            </div>\r\n\
            <div class="microsoft-info">\r\n\
                <span class="logo"></span>\r\n\
                <p class="links">\r\n\
                    <a href="#">帮助</a><i class="split"></i><a href="">意见反馈</a>\r\n\
                </p>\r\n\
                <p class="state">此服务使用微软Office服务预览技术</p>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div id="iframe-ct" class="file-preview-bd">\r\n\
        </div>\r\n\
    </div>\r\n\
    <scr');
__p.push('ipt>\r\n\
        var iframe = document.createElement(\'iframe\');\r\n\
\r\n\
        $(\'#iframe-ct\').append(iframe);\r\n\
\r\n\
        iframe.contentWindow.document.open(\'text/htmlreplace\');\r\n\
        iframe.contentWindow.document.write(');
_p(this.iframe_content(data));
__p.push(');\r\n\
        iframe.contentWindow.document.close();\r\n\
\r\n\
\r\n\
        $(document).ready(function() {\r\n\
            var win_h = $(window).height();\r\n\
            var header_h = $(\'#header\').outerHeight();\r\n\
            $(iframe).height(win_h - header_h - 3).width(\'100%\');\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
  </body>\r\n\
</html>');

return __p.join("");
},

'iframe_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\'<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>文档预览</title><scr');
__p.push('ipt type="text/javascript">window.onload = function() {var form = document.getElementById("form");form.submit();}<\\/scr');
__p.push('ipt></head><body><form id="form" method="post" action="');
_p(data.preview_url);
__p.push('"><input id="token" type="text" name="access_token" value="');
_p(data.access_token);
__p.push('" style="display: none;"/></form></body></html>\'');

return __p.join("");
}
};
return tmpl;
});
