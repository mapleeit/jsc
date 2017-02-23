
//tmpl file list:
//note/src/base.tmpl.html
//note/src/empty.tmpl.html
//note/src/list.tmpl.html
//note/src/login.tmpl.html
define("club/weiyun/js/server/h5/modules/note/tmpl",["weiyun/util/inline","weiyun/util/browser","common","lib"],function(require, exports, module){
var tmpl = { 
'baseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>微云笔记</title>\r\n\
        <meta name="description" content="">\r\n\
        <meta name="HandheldFriendly" content="True">\r\n\
        <meta name="MobileOptimized" content="320">\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
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
        </style>');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border'], true));
_p(require('weiyun/util/inline').css(['g-retina-table', 'g-bottom-bar', 'g-component', 'weiyun-weixin-note', 'g-err']));
__p.push('<scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
<link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
\r\n\
</head>\r\n\
<body class="">');

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
__p.push('ipt src="//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></scr');
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
            seajs.use([\'$\', \'lib\',\'common\', \'note\'], function($, lib, common, note) {\r\n\
                window.g_js_time = +new Date();\r\n\
                var note = note.get(\'./note\');\r\n\
                note.render(');
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
                    virtualURL: \'/note\',\r\n\
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
__p.push('    <!-- 笔记是空的 -->\r\n\
    <section class="wx-no-note">\r\n\
        <p class="tips">笔记是空的</p>\r\n\
    </section>');

return __p.join("");
},

'note_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_note_body" data-label-for-aria="笔记区域" class="note-body ui-view-empty" style="height:100%">\r\n\
        <div id="_note_view_list" class="note-list" style="display:none;height:100%">\r\n\
            <!-- 文件列表 -->\r\n\
            <div id="_note_files" class="wx-note-wrapper">\r\n\
            </div>\r\n\
            <div id="_toolbar" class="wy-file-controller g-bottom-bar tBor" style="display: none;">\r\n\
                <button class="btn" data-action="share" data-id="normal" role="button">选择笔记并分享</button>\r\n\
                <button data-id="confirm" class="btn btn-cancel" data-action="cancel" role="button" style="display:none;">取消</button>\r\n\
                <button data-id="confirm" class="btn btn-certain" data-action="confirm" role="button" style="display:none;">确定<span data-id="choose_num" class="num"></span></button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="note-editor" id="_note_editor">\r\n\
            <!--编辑器区域-->\r\n\
        </div>\r\n\
        <!-- 一次加载20个文件，要再加载的时候显示 \'加载中\' -->\r\n\
        <div id="_load_more" class="wy-file-loading">\r\n\
            <i class="icons icon-load"></i>\r\n\
            <span>加载中...</span>\r\n\
        </div>\r\n\
        </section>\r\n\
    </div>');

return __p.join("");
},

'note_edit_frame': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var constants = require('common').get('./constants');

    __p.push('    <iframe frameborder="0" id="_note_edit_frame" name="_note_edit_frame" src="');
_p(constants.HTTP_PROTOCOL);
__p.push('//www.weiyun.com/note_web/main.html" width="100%"/>');

return __p.join("");
},

'note_article_frame': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <iframe frameborder="0" id="_note_article_frame" name="_note_article_frame" src="" width="100%" height="98%" style="display:none"/>');

return __p.join("");
},

'note_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib=require('lib'),
    date_time=lib.get('./date_time'),
    text = lib.get('./text'),
    records = data,
    me = this,
    today = date_time.today().getTime(),
    yesterday = date_time.yesterday().getTime(),
    last7day = date_time.add_days(-7).getTime(),
    last_bar=5;
    __p.push('    ');

    $.each(records || [], function(i, file) {
    var note_name = file.get_name();
    var thumb_url= file.get_thumb_url();
    var has_img = thumb_url && thumb_url != "";
    var save_status = file.get_save_status();
    var is_selected = file.get("selected");
    var is_new_note = file.get_id() ==="";
    __p.push('    ');

    if( (i == 0 || last_bar < file.get_day_bar() )&& save_status == ""){
    last_bar = file.get_day_bar();
    __p.push('    ');
_p( me.bar(last_bar) );
__p.push('    ');

    }
    __p.push('    <dd data-record-id="');
_p(file.id);
__p.push('" data-file-id data-list="file" class="');
_p(is_selected ? 'ui-selected':'');
__p.push('">');

        if(save_status =="note_saved"){
        __p.push('        <div class="icon-update-done"></div>');

        }else if(save_status =="note_ing"){
        __p.push('        <div class="icon-update-ing"></div>');

        }
        __p.push('        <div class="note-list-item ');
_p( has_img ? 'note-list-item-has-img':'');
__p.push(' ');
_p( is_new_note ? 'note-list-item-new':'');
__p.push('"\r\n\
             tabindex="0"\r\n\
             style="height:50px">');

            var note_name_len=28;
            if(has_img){
            note_name_len=20
            __p.push('            <img src="');
_p(thumb_url.replace(/^http:|^https:/, ''));
__p.push('"/>');

            }
            __p.push('            <em>');
_p(text.text(text.smart_sub(note_name,note_name_len,"...")));
__p.push('</em>\r\n\
\r\n\
            <p>');
_p(date_time.timestamp2date_ymdhm(file.get_version()));
__p.push('</p>\r\n\
        </div>\r\n\
    </dd>');

    });
    __p.push('');

return __p.join("");
},

'indepLogin': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var serverConfig = plug('config') || {};
    var wxAppid = serverConfig.isTest ? 'wxe310dc0d754093ee' : 'wxd15b727733345a40'; //测试时使用测试号的appid
    __p.push('    <!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>登录</title>\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta name="x5-orientation" content="portrait">');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'g-password'], true));
__p.push('    </head>\r\n\
    <body>\r\n\
\r\n\
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
