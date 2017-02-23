
//tmpl file list:
//share/src/404.tmpl.html
//share/src/404_2.tmpl.html
//share/src/mobile/artile.tmpl.html
//share/src/mobile/base.tmpl.html
//share/src/mobile/collector.tmpl.html
//share/src/mobile/detail.tmpl.html
//share/src/mobile/fail.tmpl.html
//share/src/mobile/group.tmpl.html
//share/src/mobile/list.tmpl.html
//share/src/mobile/note.tmpl.html
//share/src/mobile/photo.tmpl.html
//share/src/mobile/secret.tmpl.html
//share/src/web/artile.tmpl.html
//share/src/web/base.tmpl.html
//share/src/web/collector.tmpl.html
//share/src/web/detail.tmpl.html
//share/src/web/fail.tmpl.html
//share/src/web/list.tmpl.html
//share/src/web/note.tmpl.html
//share/src/web/photo.tmpl.html
//share/src/web/secret.tmpl.html
define("club/weiyun/js/server/share/tmpl",["weiyun/util/htmlEscape","weiyun/util/dateformat","weiyun/util/text","weiyun/util/appid","weiyun/util/inline","weiyun/util/prettysize","weiyun/util/fileType","weiyun/util/browser","weiyun/conf/configs_css"],function(require, exports, module){
var tmpl = { 
'noFound': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE HTML>\r\n\
        <html>\r\n\
        <head>\r\n\
            <meta charset="UTF-8" />\r\n\
            <meta name="description" content="你访问的页面找不回来了，但是我们可以一起寻找失踪宝贝" />\r\n\
            <meta name="description" content="公益404页面是由腾讯公司员工志愿者自主发起的互联网公益活动。" />\r\n\
            <meta name="description" content="腾讯志愿者是腾讯公司内部员工为响应公司做“最受人尊敬的互联网企业”的号召，自发组织成立的腾讯志愿者协会。2012年成立腾讯志愿者技术分会，开展404公益计划，无障碍产品推动等，结合腾讯产品、技术平台，开展公益帮扶。" />\r\n\
            <title>404</title>\r\n\
        </head>\r\n\
        <body>\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//www.qq.com/404/search_children.js"></scr');
__p.push('ipt>\r\n\
\r\n\
        <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt>\r\n\
            (function() {\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: \'file-nofound.html\',\r\n\
                        virtualDomain: "share.weiyun.com"\r\n\
                    });\r\n\
                }\r\n\
            })();\r\n\
        </scr');
__p.push('ipt>\r\n\
\r\n\
        </body>\r\n\
    </html>');

return __p.join("");
},

'noFound2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE HTML>\r\n\
        <html>\r\n\
        <head>\r\n\
            <meta charset="UTF-8" />\r\n\
	        <meta name="Description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。">\r\n\
	        <meta name="Keywords" content="微云, 微云下载, 腾讯微云, 照片备份, 手机照片备份, 通讯录备份, 文件管理, 相册管理, 云相册, 微云官网网站, 微云官网, 微云网页版, weiyun, weiyun web">\r\n\
	        <title>404</title>\r\n\
	        <link rel="stylesheet" href="//img.weiyun.com/qz-proj/wy-web/err.css">\r\n\
        </head>\r\n\
        <body>\r\n\
        <div class="wy-wrapper">\r\n\
	        <i class="fake"></i>\r\n\
	        <div class="err-wrapper not-found">\r\n\
		        <div class="ico"></div>\r\n\
		        <p class="title" style="text-align: center;">找不到您访问的分享页面<br><br><a href="//www.weiyun.com/" target="_self" style="font-size: 22px; color: #02a3ff;">到微云里上传文件</a></p>\r\n\
	        </div>\r\n\
        </div>\r\n\
\r\n\
        <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt>\r\n\
            (function() {\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: \'file-nofound2.html\',\r\n\
                        virtualDomain: "share.weiyun.com"\r\n\
                    });\r\n\
                }\r\n\
            })();\r\n\
        </scr');
__p.push('ipt>\r\n\
\r\n\
        </body>\r\n\
    </html>');

return __p.join("");
},

'article': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-MM-dd HH:mm:ss'),
            content = data.content;

        title = text.cut(title, 40);
    __p.push('    <div id="container">\r\n\
        <section class="wy-notes-wrapper">\r\n\
            <header class="note-title-wrapper">\r\n\
                <h2 class="note-title">');
_p(title);
__p.push('</h2>\r\n\
                <time class="note-time">');
_p(time);
__p.push('</time>\r\n\
            </header>\r\n\
            <article data-id="content" class="note-body">\r\n\
                <div class="note-content">');
_p(content);
__p.push('</div>\r\n\
            </article>\r\n\
        </section>\r\n\
        <div class="wy-file-controller g-bottom-bar">\r\n\
            <button data-action="save_all" class="btn" role="button">保存到微云</button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'chunkOne': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>');

            var serverConfig = plug('config') || {};
            var is_test_env = !!serverConfig.isTest;
        __p.push('        <meta charset="UTF-8">\r\n\
        <title>微云分享</title>\r\n\
        <meta name="format-detection" content="telephone=no" />\r\n\
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta itemprop="name" content="微云分享" />\r\n\
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
_p(require('weiyun/util/appid')());
__p.push(';window.g_start_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'wy-share', 'g-filetype-icons'], true));
__p.push('        ');
_p(require('weiyun/util/inline').css(['g-retina-table','g-filelist','g-bottom-bar','g-err', 'g-component']));
__p.push('        <scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
        <link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
\r\n\
    </head>');

return __p.join("");
},

'baseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <body class="');
_p(data.klass ? data.klass : '');
__p.push('">');

return __p.join("");
},

'baseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        window.g_serv_taken = ');
_p(new Date() - window.serv_start_time);
__p.push(';\r\n\
        setTimeout(function() {\r\n\
            window.g_dom_ready_time = +new Date();\r\n\
        }, 0);\r\n\
    </scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">');
 if(!data.ret) { __p.push(' //已经失败就不进行初始化了\r\n\
            seajs.use([\'$\', \'lib\',\'common\', \'outlink_v2\'], function($, lib, common,  outlink) {\r\n\
                window.g_js_time = +new Date();\r\n\
                var outlink = outlink.get(\'./outlink\');\r\n\
                outlink.render(');
_p(data.syncData);
__p.push(');\r\n\
            });');
} __p.push('    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//qzonestyle.gtimg.cn/qzone/hybrid/common/security/aq.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        var pvClickSend = function (tag) {\r\n\
            if (typeof(pgvSendClick) == "function") {\r\n\
                pgvSendClick({\r\n\
                    hottag: tag,\r\n\
                    virtualDomain: \'share.weiyun.com\'\r\n\
                });\r\n\
            }\r\n\
        };\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/mobile/share.html\',\r\n\
                    virtualDomain: "share.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'banner': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape');
        var txt = '文件';

        if(data.is_all_note) {
            txt = '笔记';
        } else if(data.is_all_video) {
            txt = '视频';
        } else if(data.is_all_image) {
            txt = '图片';
        }
        var msg = '分享了' + data.share_cnt + '个' + txt;
        var one_img = data.is_one_image;
        if(one_img){
            return '';
        }
    __p.push('    <aside id="banner" class="wy-sharer">\r\n\
    <!-- 设置.sharer-avator div的background-image来更改用户头像 -->\r\n\
    <a id="_avator" class="sharer-avator share-vip" href="//h5.weiyun.com/vip?from=share" data-src="');
_p(data.share_head_image_url.replace(/^http:|^https:/, ''));
__p.push('" style="background-image:none; display: block">');
 if(data.weiyun_vip) { __p.push('        <i class="icon icon-share-vip"></i>');
 } __p.push('    </a>\r\n\
    <div class="sharer-info">\r\n\
            <h2 class="sharer-name">');
_p(htmlEscape(data.share_nick_name));
__p.push('</h2>\r\n\
    <div class="sharer-content">\r\n\
            <span class="sharer-count">');
_p(msg);
__p.push('</span>\r\n\
    </div>\r\n\
    </div>\r\n\
\r\n\
    <a href="//www.weiyun.com" class="link-to-wy"></a>\r\n\
    </aside>');

return __p.join("");
},

'collector': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-mm-dd HH:MM:ss'),
            content = data.content;

        title = text.cut(title, 40);
    __p.push('        <div id="noteContainer">\r\n\
            <section class="wy-notes-wrapper">\r\n\
                <header class="note-title-wrapper">\r\n\
                    <h2 class="note-title">');
_p(title);
__p.push('</h2>\r\n\
                    <time class="note-time">');
_p(time);
__p.push('</time>\r\n\
                </header>\r\n\
                <article class="note-body">\r\n\
                    <div class="note-content">');
_p(content);
__p.push('</div>\r\n\
                </article>\r\n\
            </section>\r\n\
        </div>\r\n\
    <scr');
__p.push('ipt>\r\n\
        document.title = \'QQ收藏\';\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'noFound1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE HTML>\r\n\
        <html>\r\n\
        <head>\r\n\
            <meta charset="UTF-8" />\r\n\
            <meta name="description" content="你访问的页面找不回来了，但是我们可以一起寻找失踪宝贝" />\r\n\
            <meta name="description" content="公益404页面是由腾讯公司员工志愿者自主发起的互联网公益活动。" />\r\n\
            <meta name="description" content="腾讯志愿者是腾讯公司内部员工为响应公司做“最受人尊敬的互联网企业”的号召，自发组织成立的腾讯志愿者协会。2012年成立腾讯志愿者技术分会，开展404公益计划，无障碍产品推动等，结合腾讯产品、技术平台，开展公益帮扶。" />\r\n\
            <title>404</title>\r\n\
        </head>\r\n\
        <body>\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//www.qq.com/404/search_children.js"></scr');
__p.push('ipt>\r\n\
\r\n\
        <scr');
__p.push('ipt type=\'text/javascript\' src=\'//pingjs.qq.com/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt>\r\n\
            (function() {\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: \'file-nofound.html\',\r\n\
                        virtualDomain: "share.weiyun.com"\r\n\
                    });\r\n\
                }\r\n\
            })();\r\n\
        </scr');
__p.push('ipt>\r\n\
\r\n\
        </body>\r\n\
    </html>');

return __p.join("");
},

'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var msg = data.msg,
            type = data.type;
    __p.push('    <section class="wy-link-out-wrapper">\r\n\
        <!-- out of count\r\n\
        <i class="icons icon-link-count"></i> -->\r\n\
        <!-- 链接错误\r\n\
        <i class="icons icon-link-err"></i> -->\r\n\
        <i class="icons icon-link-');
_p(type);
__p.push('"></i>\r\n\
        <h2 class="text">');
_p(msg);
__p.push('</h2>\r\n\
    </section>');

return __p.join("");
},

'group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-share-join-v2'], true));
__p.push('    <body>\r\n\
    <div id="container" class="app-share-join">');

            var htmlEscape = require('weiyun/util/htmlEscape');
            var prettysize = require('weiyun/util/prettysize');
            var fileType = require('weiyun/util/fileType');
            var dir_list = (data.dir_list && data.dir_list.length>0)? data.dir_list[0] : [];
            var nick_name_list = dir_list['share_album_nick_name_list']? dir_list['share_album_nick_name_list'].join(',') : '';
            var count = dir_list['share_album_nick_name_list']? dir_list['share_album_nick_name_list'].length : 0;
            var file_list = dir_list.file_list || [];
            var vip_class = data.weiyun_vip_flag? 'icon-share-vip' : '';
        __p.push('        <!-- 头部 S -->\r\n\
        <div id="banner">\r\n\
            <!-- 运营广告需要靠#banner来定位位置 -->\r\n\
        </div>\r\n\
        <!-- 头部 E -->\r\n\
\r\n\
        <div class="share-bd">\r\n\
            <!-- banner S -->\r\n\
            <div class="photo-banner">\r\n\
                <div class="banner">\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- banner E -->\r\n\
            <div class="content">\r\n\
                <div id="_avator" class="img" data-src="');
_p(data.share_head_image_url);
__p.push('" style="background-image: url(');
_p(data.share_head_image_url);
__p.push(')">\r\n\
                    <i class="icon ');
_p(vip_class);
__p.push('"></i>\r\n\
                </div>\r\n\
                <div class="title"><span class="user-name">');
_p(data.share_nick_name);
__p.push('</span>邀请您加入</div>\r\n\
                <div class="text"><span class="doc-name"><span class="quo">“</span><span class="name">');
_p(dir_list.dir_name);
__p.push('</span><span class="quo">”</span></span>的共享组</div>\r\n\
            </div>\r\n\
            <!-- 已经下载.join，未下载.download -->\r\n\
            <div class="add-btn join" data-action="join"><i class="icon"></i><span>加入</span></div>\r\n\
        </div>\r\n\
        <div class="share-ft">\r\n\
            <div class="logo"></div>\r\n\
        </div>\r\n\
        <!-- 弹窗 S -->\r\n\
        <div data-id="tips" class="dialog" style="display:none;">\r\n\
            <div class="box">\r\n\
                <div class="hd">\r\n\
                    <p class=\'txt\'>您已加入此共享组</p>\r\n\
                    <p class="tip">安装微云客户端立即查看共享内容</p>\r\n\
                </div>\r\n\
                <div class="bd">\r\n\
                    <div class="btn" data-action="cancel"><span>取消</span></div>\r\n\
                    <div class="btn" data-action="confirm"><span>安装</span></div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <!-- 弹窗 E -->\r\n\
    </div>');

return __p.join("");
},

'fileList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="container">');
 if(data.has_folder) { __p.push('        <nav id="file_path" class="wy-share-crumbs bBor">\r\n\
            <ul class="wy-dir-crumbs">\r\n\
                <!-- 点击时添加 wy-hl-dir class -->\r\n\
                <li class="wy-dir wy-hl-dir">微云分享</li>\r\n\
                    <!-- 需要出现隐藏的目录，加上 wy-hiden-dir class -->\r\n\
                <!--</li><li class="wy-dir wy-hiden-dir">文件夹2</li>\r\n\
                <li class="wy-dir">文件夹3</li>\r\n\
                <li class="wy-dir wy-dir-current">文件夹4</li>-->\r\n\
            </ul>\r\n\
        </nav>');
 } __p.push('        <section class="wy-share-filelist-wrapper">\r\n\
            <ul id="file_list">');

                    var htmlEscape = require('weiyun/util/htmlEscape');
                    var prettysize = require('weiyun/util/prettysize');
                    var fileType = require('weiyun/util/fileType');
                    var list = data.list || [];
                    var noteList = data.noteList || [];
                    var only_one = list.length + noteList.length == 1
                    list.forEach(function(file){
                        var is_dir = !!file['dir_key'];
                        var id = is_dir ? file['dir_key'] : file['file_id'];
                        var file_name = is_dir ? htmlEscape(file['dir_name']) : htmlEscape(file['file_name']);
                        var file_size = is_dir ? 0 : prettysize(file['file_size']);
                        var file_type = is_dir ? 'folder' : fileType(file_name);
                        var thumb_url = file['thumb_url'] || ''
                __p.push('                        <li data-action="open" data-id="item" data-file-id="');
_p(id);
__p.push('" id="item_');
_p(id);
__p.push('" class="wy-file-item">\r\n\
                            <!-- icons icons-filetype是公共class，\r\n\
                                 icon-doc 文档\r\n\
                                 icon-ppt 演示文件\r\n\
                                 icon-folder 文件夹 -->');
 if(thumb_url) { __p.push('                            <i class="icons-filetype icon-');
_p(file_type);
__p.push('" data-src="');
_p(thumb_url);
__p.push('"></i>');
 } else { __p.push('                            <i class="icons-filetype icon-');
_p(file_type);
__p.push('"></i>');
 } __p.push('                            <div class="file-describe bBor">\r\n\
                                <h3 class="file-name">');
_p(file_name);
__p.push('</h3>\r\n\
                                    <span class="file-info">');

                                            if(!is_dir) {
                                        __p.push('                                                <span data-action="open" class="file-size">');
_p(file_size);
__p.push('</span>');

                                            }
                                        __p.push('                                    </span>\r\n\
                            </div>');
 if(is_dir) { __p.push('                            <i class="icon-grey-rarr"></i>');
 } __p.push('                        </li>');

                    });
                    noteList.forEach(function(note) {
                        var id = note.note_id;
                        var note_title = htmlEscape(note.note_title);
                __p.push('                    <li data-action="open" data-id="item" data-file-id="');
_p(id);
__p.push('" id="item_');
_p(id);
__p.push('" class="wy-file-item">\r\n\
                        <!-- icons icons-filetype是公共class，\r\n\
                             icon-doc 文档\r\n\
                             icon-ppt 演示文件\r\n\
                             icon-folder 文件夹 -->\r\n\
                        <i class="icons icons-filetype icon-note"></i>\r\n\
                        <div class="file-describe bBor">\r\n\
                            <h3 class="file-name">');
_p(note_title);
__p.push('</h3>\r\n\
                        </div>\r\n\
                        <i class="icon icon-grey-rarr"></i>\r\n\
                    </li>');

                    });
                __p.push('\r\n\
            </ul>\r\n\
        </section>\r\n\
        <section id="wx_note_confirm" class="confirm-box" style="display:none;">\r\n\
	        <div class="wy-download-dialog">\r\n\
		        <div class="box">\r\n\
			        <div class="hd">\r\n\
				        <div class="hd-bg"></div>\r\n\
				        <span data-action="cancel" class="btn-close"></span>\r\n\
			        </div>\r\n\
			        <div class="bd">\r\n\
				        <div class="text">\r\n\
					        <p class="title wx_note_title">用微云管理文件</p>\r\n\
					        <p class="description wx_note_description">文档在线预览、笔记随记随存</p>\r\n\
				        </div>\r\n\
				        <div data-action="install" class="btn"><span>立即去下载</span></div>\r\n\
			        </div>\r\n\
		        </div>\r\n\
	        </div>\r\n\
        </section>\r\n\
        <div id="_load_more" class="wy-file-loading" style="display: none;">\r\n\
            <i class="icon icon-load"></i>\r\n\
            <span>加载中...</span>\r\n\
        </div>\r\n\
        <div id="_toolbar">\r\n\
            <div data-id="normal" class="wy-file-controller g-bottom-bar">');
 if(!data.temporary) { __p.push('	            ');
 if(0 && data.isQQ) { __p.push('	            <button data-action="');
_p(only_one === 1 ? 'save_all' : 'save');
__p.push('" class="btn" role="button" style="margin-right: 10px;">保存到微云</button>\r\n\
	            <button data-action="download" class="btn" role="button">下载到手机</button>');
 } else { __p.push('	            <button data-action="');
_p(only_one === 1 ? 'save_all' : 'save');
__p.push('" class="btn" role="button">保存到微云</button>');
 } __p.push('                ');
 } __p.push('            </div>\r\n\
            <div data-id="confirm" class="wy-file-controller g-bottom-bar" style="display:none;">\r\n\
                <button data-action="confirm" data-target="save" class="btn btn-certain" role="button">确定</button>\r\n\
                <button data-action="cancel" class="btn btn-cancel" role="button">取消</button>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'note': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-mm-dd HH:MM:ss'),
            content = data.content;

        title = text.cut(title, 40);
    __p.push('    <div id="container">\r\n\
        <section class="wy-notes-wrapper">\r\n\
            <header class="note-title-wrapper">\r\n\
                <h2 class="note-title">');
_p(title );
__p.push('</h2>\r\n\
                <time class="note-time">');
_p(time );
__p.push('</time>\r\n\
            </header>\r\n\
            <article data-id="content" class="note-body">\r\n\
                <div class="note-content">');
_p(content );
__p.push('</div>\r\n\
            </article>\r\n\
        </section>\r\n\
        <div class="wy-file-controller g-bottom-bar">\r\n\
            <button data-action="save_all" class="btn" role="button">保存到微云</button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'imgList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="container">\r\n\
        <section id="photo_list" class="wy-image-wall-wrapper">');

            var imgList = data['file_list'] || [];
            var classList = ['image-item-bg1','image-item-bg2','image-item-bg3','image-item-bg4','image-item-bg4','image-item-bg3','image-item-bg2','image-item-bg1'];
            imgList.forEach(function(file, i){
                var imgSrc = file['thumb_url'];
                var cls = classList[i % 8];
            __p.push('            <p id="');
_p(file['file_id']);
__p.push('" data-id="img" class="image-item ');
_p(cls);
__p.push('" data-src="');
_p(imgSrc);
__p.push('" style=""></p>');

            })
            __p.push('        </section>\r\n\
        <div data-id="bbar_normal" class="wy-file-controller g-bottom-bar">');
 if(!data.temporary) { __p.push('            <button data-action="save" class="btn" role="button">保存到微云</button>');
 } __p.push('        </div>\r\n\
        <div data-id="bbar_confirm" class="wy-file-controller g-bottom-bar" style="display:none;">\r\n\
            <button data-id="confirm" class="btn btn-certain" role="button">确定</button>\r\n\
            <button data-action="cancel" class="btn btn-cancel" role="button">取消</button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'bigImgList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="container">\r\n\
        <aside id="choose_bar" class="wy-choose-controller">\r\n\
            <!-- 加上/除去.cancel，控制"全选"或者"取消全选"-->\r\n\
            <p data-id="choose" class="select" role="button"></p>\r\n\
        </aside>\r\n\
        <ul id="photo_list" class="wy-img-list-wrapper">\r\n\
            <!-- 图片被选中时，添加.choosen -->\r\n\
            <!-- 图片路径放在 li 的 background-image -->');

            var imgList = data['file_list'] || [];
            imgList.forEach(function(file, i){
                var imgSrc = file['thumb_url'] || file['video_thumb'] + '/1024';
                if(file['thumb_url']) {
            __p.push('            <li id="');
_p(file['file_id']);
__p.push('" data-id="img" data-action="preview" class="img-item">\r\n\
                <img data-src="');
_p(imgSrc);
__p.push('" class="img">\r\n\
                <i class="icon-grey-check"></i>');
 } else { __p.push('            <li id="');
_p(file['file_id']);
__p.push('" data-id="img" class="img-item video" style="background-image: url(');
_p(imgSrc.replace(/^http:|^https:/, ''));
__p.push(')">\r\n\
                <!--<img data-src="');
_p(imgSrc);
__p.push('" class="img">-->\r\n\
                <i class="icon-grey-check"></i>\r\n\
                <i class="icon-media-ctrl" data-id="img" data-action="open" data-file-id="');
_p(file['file_id']);
__p.push('"></i>');
 } __p.push('            </li>');

            })
            __p.push('        </ul>\r\n\
        <section id="wx_note_confirm" class="confirm-box" style="display:none;">\r\n\
	        <div class="wy-download-dialog">\r\n\
		        <div class="box">\r\n\
			        <div class="hd">\r\n\
				        <div class="hd-bg"></div>\r\n\
				        <span data-action="cancel" class="btn-close"></span>\r\n\
			        </div>\r\n\
			        <div class="bd">\r\n\
				        <div class="text">\r\n\
					        <p class="title wx_note_title">用微云管理文件</p>\r\n\
					        <p class="description wx_note_description">文档在线预览、笔记随记随存</p>\r\n\
				        </div>\r\n\
				        <div data-action="install" class="btn"><span>立即去下载</span></div>\r\n\
			        </div>\r\n\
		        </div>\r\n\
	        </div>\r\n\
        </section>\r\n\
        <div data-id="bbar_normal" class="wy-file-controller g-bottom-bar">');
 if(!data.temporary) { __p.push('	        ');
 if(0 && data.isQQ) { __p.push('	        <button data-action="save" class="btn" role="button" style="margin-right: 10px;">保存到微云</button>\r\n\
            <button data-action="download" class="btn" role="button">下载到手机</button>');
 } else { __p.push('	        <button data-action="save" class="btn" role="button">保存到微云</button>');
 } __p.push('            ');
 } __p.push('        </div>\r\n\
        <div data-id="bbar_confirm" class="wy-file-controller g-bottom-bar" style="display:none;">\r\n\
            <button data-id="confirm" class="btn btn-certain" role="button">确定</button>\r\n\
            <button data-action="cancel" class="btn btn-cancel" role="button">取消</button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'oneImg': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var browser = require('weiyun/util/browser')();
        var prettysize = require('weiyun/util/prettysize');
    __p.push('    <div id="container">\r\n\
        <div class="wy-img-previewer-wrapper" style="">\r\n\
            <div class="wy-hor-img-bg">\r\n\
                <ul data-id="img_list" class="wy-img-preview-list">\r\n\
                    <li id="');
_p(data.file_id);
__p.push('" data-id="img" class="wy-img-item">\r\n\
                        <i id="loading" class="icons icons-reminder icon-reminder-loading" style="display: none"></i>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
            <footer class="wy-preview-controller verticle-wy-preview-controller">');

                var action_name = browser.QQ ? 'mobile_save' : 'view_raw',
                action_text = browser.QQ ? '保存到手机' : '查看原图';
                __p.push('                <button data-action="');
_p(action_name);
__p.push('" class="btn-item" role="button">');
_p(action_text);
__p.push('<span data-id="file_size" class="file-size">(');
_p(prettysize(data.file_size));
__p.push(')</span></button>');
 if(!data.temporary) { __p.push('                <button data-action="save_all" class="btn-item" role="button">保存到微云</button>');
 } __p.push('            </footer>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'secret': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="container">\r\n\
        <section class="wy-private-link">\r\n\
            <h2 class="link-title">请输入访问密码</h2>\r\n\
            <ul data-id="pwdContainer" class="pw-wrapper trblBor">\r\n\
                <li class="pw-single"><input type="password" name="password" id="" class="pw-input" maxlength="6" value=""></li>\r\n\
            </ul>');

                var verify_img = '//captcha.weiyun.com/getimage?aid=543009514&' + Math.random();
            __p.push('            <div id="_verify_code_cnt" class="pw-codes" style="display: none;">\r\n\
                <p data-id="password-tip" class="password-tip">密码输错多次，请输入验证码</p>\r\n\
                <p class="link-title">请输入验证码</p>\r\n\
                <input data-id="verify_code_text" type="text" class="pw-codes-input" maxlength="4">\r\n\
                <p data-id="tip" class="codes-tip">验证码错误</p>\r\n\
                <div class="codes-wrap">\r\n\
                    <span data-id="code_img" class="codes-img" style="background-image:url(');
_p(verify_img);
__p.push(')"></span>\r\n\
                    <span data-action="change_verify_code" class="codes-chage">换一张</span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <button data-action="secret_view" class="btn-item btn-positive" role="button">确定</button>\r\n\
            <!-- <input type="password" name="" id="" class="pw-single-input"> -->\r\n\
        </section>\r\n\
    </div>');

return __p.join("");
},

'webArticle': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-MM-dd HH:mm:ss'),
            content = data.content;

        title = text.cut(title, 100);
    __p.push('    <div class="share-file-list files-view files-view-rich">\r\n\
        <div class="header">\r\n\
            <h1 class="headline">');
_p(title);
__p.push('</h1>\r\n\
            <div class="time" data-id="outlink_share_time">');
_p(time);
__p.push('</div>\r\n\
        </div>\r\n\
        <div class="content ui-selected">');
_p(content);
__p.push('</div>\r\n\
    </div>');

return __p.join("");
},

'webBaseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

    var configs_css = require('weiyun/conf/configs_css');
    var css_refs = ['@base_css@', '@p_web_css@', '@base_delay_css@', '@p_web_delay_css@', '@share_css@'];
    var css_list = [],
    combo_css = '';

    css_refs.forEach(function(ref){
        css_list.push(configs_css[ref]);
    });

    combo_css = css_list.join(',');
    var serv_taken = new Date() - window.serv_start_time;
    var APPID = require('weiyun/util/appid')();
    var serverConfig = plug('config') || {};
    var is_test_env = !!serverConfig.isTest;
    var host = is_test_env ? 'share.weiyun.com' : 'img.weiyun.com';
    var new_css_host = 'qzonestyle.gtimg.cn';
    var new_combo_css = [configs_css['@link_css@']];
    __p.push('    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>');
_p(data.title);
__p.push('</title>\r\n\
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <meta itemprop="name" content="微云分享" />\r\n\
        <meta itemprop="description" content="');
_p(data.nickname);
_p(data.msg);
__p.push('" />\r\n\
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />\r\n\
        <scr');
__p.push('ipt>var IS_TEST_ENV = ');
_p(is_test_env);
__p.push('; window.APPID = ');
_p(APPID);
__p.push(';window.g_serv_taken = ');
_p(serv_taken);
__p.push(';window.g_start_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
        <link id="wy_base_css" data-name="text" rel="stylesheet" href="//');
_p(host);
__p.push('/c/=');
_p(combo_css);
__p.push('?max_age=31104000"/>\r\n\
		<link id="wy_new_css" data-name="text" rel="stylesheet" href="//');
_p(new_css_host);
__p.push('/c/=');
_p(new_combo_css);
__p.push('?max_age=31104000"/>\r\n\
        <scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
        <link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
    </head>\r\n\
    <body class="web-app">\r\n\
    <div class="layout module-disk module-share-new">\r\n\
        <div id="top">');
 if(!data.fail) { __p.push('            ');
_p(this.webHeader(data));
__p.push('            ');
if(!data.secret) { __p.push('                ');
_p(this.webToolbar(data));
__p.push('                ');
if(data.enablePath) { __p.push('                    ');
_p(this.webPath(data));
__p.push('                ');
 } __p.push('            ');
 } __p.push('        ');
 } __p.push('        </div>');

return __p.join("");
},

'webBaseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    </div>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        setTimeout(function() {\r\n\
            window.g_dom_ready_time = +new Date();\r\n\
        }, 0);\r\n\
    </scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs','configs_web']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([ \'$\', \'lib\', \'common\', \'outlink_v2\'], function ($, lib, common, outlink) {\r\n\
            window.g_js_time = +new Date();\r\n\
            var outlink_mod = outlink.get(\'./outlink\');\r\n\
            outlink_mod.render(');
_p(data);
__p.push(');\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/common/security/aq.js" charset="UTF-8"></scr');
__p.push('ipt>\r\n\
\r\n\
        <scr');
__p.push('ipt>\r\n\
        var pvClickSend = function (tag) {\r\n\
            if (typeof(pgvSendClick) == "function") {\r\n\
                pgvSendClick({\r\n\
                    hottag: tag,\r\n\
                    virtualDomain: \'share.weiyun.com\'\r\n\
                });\r\n\
            }\r\n\
        };\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/web/share.html\',\r\n\
                    virtualDomain: "share.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'webHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="lay-header clear" id="outlink_header">\r\n\
        <a class="logo" href="javascript:void(0)" target=\'_blank\'></a>\r\n\
        <p id=\'outlink_title\' class="title"></p>\r\n\
        <a id="outlink_login"class="login" href="javascript:void(0)" style="">登录</a>\r\n\
    </div>');

return __p.join("");
},

'webToolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="lay-main-toolbar" id="outlink_toolbar">\r\n\
        <!-- 分享个人信息 -->\r\n\
        <div class="user-share-info">\r\n\
	        <a href="//www.weiyun.com/vip/weiyun_vip.html?from=share" target="_blank">\r\n\
	            <span class="avatar share-vip" data-vip="');
_p(data.weiyun_vip?1:0);
__p.push('">\r\n\
	                <img src="');
_p(data.avatar.replace(/http:/i, '').replace(/https:/i, ''));
__p.push('">');
 if(data.weiyun_vip) { __p.push('					<i class="ico ico-share-vip"></i>');
 } __p.push('	            </span>\r\n\
		    </a>\r\n\
            <div class="info">');
_p(data.nickname);
_p(data.msg);
__p.push('</div>\r\n\
        </div>\r\n\
        <div class="toolbar-btn clear photo-toolbar">\r\n\
            <div class="btn-message">');
if(data.enableDownload) {__p.push('                <a data-action="download" class="g-btn g-btn-gray download" id="ui-btn-down" href="javascript:void(0);">\r\n\
                        <span class="btn-inner ">\r\n\
                            <i class="ico ico-down"></i>\r\n\
                            <span class="text">下载</span>\r\n\
                        </span>\r\n\
                </a>');
}__p.push('                ');
if(data.enableStore && !data.isTemporary) {__p.push('                <a data-action="store" class="g-btn g-btn-gray save-to-weiyun" id="ui-btn-save" href="javascript:void(0);">\r\n\
                        <span class="btn-inner">\r\n\
                            <i class="ico ico-down-wy"></i>\r\n\
                            <span class="text">保存到微云</span>\r\n\
                        </span>\r\n\
                </a>');
}__p.push('                <a data-action="qrcode" class="g-btn g-btn-gray" id="ui-btn-qr" href="javascript:void(0);">\r\n\
                    <span class="btn-inner download-by-qr">\r\n\
                        <i class="ico ico-qr"></i>\r\n\
                        <span class="text">二维码</span>\r\n\
                    </span>\r\n\
                </a>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'webPath': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="lay-main-head" id="outlink_path">\r\n\
        <div class="inner">\r\n\
            <div class="wrap">\r\n\
                <label id="outlink_checkall" class="checkall"></label>\r\n\
                <div data-inner class="main-path">\r\n\
                    <!-- 麻烦前端对面包屑的z-index进行倒序填充 -->\r\n\
                    <!-- <a style="z-index:7;" class="path more" href="#"><span>«</span></a> -->\r\n\
                    <a style="z-index:2;" class="path" href="javascript:void(0);">\r\n\
                        <span>微云分享</span>\r\n\
                    </a>\r\n\
                    <!--a style="z-index:1;" class="path current" href="#"><span>2012web</span></a-->\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'webCollector': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-mm-dd HH:MM:ss'),
            content = data.content;

        title = text.cut(title, 100);
    __p.push('    <div class="share-file-list files-view files-view-rich">\r\n\
        <div class="header">\r\n\
            <h1 class="headline">');
_p(title);
__p.push('</h1>\r\n\
            <div class="time" data-id="outlink_share_time">');
_p(time);
__p.push('</div>\r\n\
        </div>\r\n\
        <div class="content ui-selected">');
_p(content);
__p.push('</div>\r\n\
    </div>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'webFail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var msg = data.msg,
            type = data.type;
    __p.push('    <div id="error_content" class="wrapper">\r\n\
\r\n\
        <div class="link-out-msg">\r\n\
            <div class="');
_p(type);
__p.push('">\r\n\
                <i class="ico"></i>\r\n\
                <h3>');
_p(msg);
__p.push('</h3>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
    <div id=\'outlink_fail_msg\' style="display:none">\r\n\
    </div>');

return __p.join("");
},

'webFileList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\r\n\
    <div id="lay-main-con" class="lay-main-con">\r\n\
        <div class="inner">\r\n\
            <div id="_main_box" class="wrap">\r\n\
                <!-- 列表模式样式ui-listview -->\r\n\
                <!-- 缩略图模式样式ui-thumbview -->\r\n\
                <!-- update jin 20131014 : new style height -->\r\n\
                <div id="_disk_view" class="disk-view ui-view ui-thumbview">\r\n\
                    <!-- 文件列表 -->\r\n\
                    <!-- 目录 -->\r\n\
                    <div class="dirs-view" style="">\r\n\
\r\n\
                        <!-- 目录列表 -->\r\n\
                        <div id="_file_list" class="dirs share-file-list">\r\n\
                            <!-- 高级浏览器使用:hover选择器，ie6请使用鼠标悬停添加list-hover样式 -->\r\n\
                            <!-- 选中样式list-selected -->\r\n\
                            <!-- 拖入接收容器样式list-dropping -->\r\n\
                            <!-- 不可选样式list-unselected -->\r\n\
                            <!-- 不带复选框模式list-nocheckbox-->\r\n\
                            <!-- 当前列表，用于右键和单行菜单模式list-menu-on-->');

                            var htmlEscape = require('weiyun/util/htmlEscape');
                            var prettysize = require('weiyun/util/prettysize');
                            var fileType = require('weiyun/util/fileType');
                            var list = data.list;
                            var noteList = data.noteList;
                            list.forEach(function(file){
                                var is_dir = !!file['dir_key'];
                                var id = is_dir ? file['dir_key'] : file['file_id'];
                                var file_name = is_dir ? htmlEscape(file['dir_name']) : htmlEscape(file['file_name']);
                                var file_size = is_dir ? 0 : prettysize(file['file_size']);
                                var file_type = is_dir ? 'folder' : fileType(file_name);
                                var thumb_url = is_dir ? '' : file['thumb_url'];

                                //web分享页暂时没有sketch，后续有了再去掉
                                if(file_type==='sketch') {
                                    file_type = 'file';
                                }
                            __p.push('                            <div data-action="enter" id="');
_p(id);
__p.push('" data-list="true" data-file-id="');
_p(id);
__p.push('" class="list-wrap share-file">\r\n\
                                <div class="list clear">\r\n\
                                    <label class="checkbox"></label>\r\n\
                                        <span class="img">\r\n\
                                            <i data-src="');
_p(thumb_url);
__p.push('" class="filetype icon-');
_p(file_type);
__p.push('"></i>\r\n\
                                        </span>\r\n\
                                    <span class="name"><p class="text"><em>');
_p(file_name);
__p.push('</em></p></span>\r\n\
                                </div>\r\n\
                            </div>');

                            });

                            noteList.forEach(function(note){
                            var id = note['note_id'];
                            var note_title = htmlEscape(note['note_title']);
                            __p.push('                            <div data-action="enter" id="');
_p(id);
__p.push('" data-list="true" data-file-id="');
_p(id);
__p.push('" class="list-wrap share-file">\r\n\
                                <div class="list clear">\r\n\
                                    <label class="checkbox"></label>\r\n\
                                        <span class="img">\r\n\
                                            <i class="filetype icon-note"></i>\r\n\
                                        </span>\r\n\
                                    <span class="name"><p class="text"><em>');
_p(note_title);
__p.push('</em></p></span>\r\n\
                                </div>\r\n\
                            </div>');

                            });

                            __p.push('                        </div>\r\n\
                    </div>\r\n\
                    <div id="_disk_files_empty" class="g-empty sort-folder-empty">\r\n\
                        <div class="empty-box">\r\n\
                            <div class="ico"></div>\r\n\
                            <p class="" style="height: 30px;line-height: 30px;font-size: 22px;color: #AFB5BF;text-align: center;">该文件夹为空</p>\r\n\
                            <p class="content"></p>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'webNote': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var htmlEscape = require('weiyun/util/htmlEscape'),
            dateformat = require('weiyun/util/dateformat'),
            text = require('weiyun/util/text'),
            title = htmlEscape(data.title || ''),
            time = dateformat(new Date(data.time), 'yyyy-mm-dd HH:MM:ss'),
            content = data.content;

        title = text.cut(title, 100);
    __p.push('    <div class="share-file-list files-view files-view-rich">\r\n\
        <div class="header">\r\n\
            <h1 class="headline">');
_p(title);
__p.push('</h1>\r\n\
            <div class="time" data-id="outlink_share_time">');
_p(time);
__p.push('</div>\r\n\
        </div>\r\n\
        <div class="content ui-selected">');
_p(content);
__p.push('</div>\r\n\
    </div>');

return __p.join("");
},

'webImgList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="lay-main-con" class="lay-main-con">\r\n\
        <div class="inner">\r\n\
            <div class="wrap">\r\n\
                <div id="_file_list" data-count="');
_p(data['file_list'].length);
__p.push('" class="dirs photo-view share-file-list">');

                    var imgList = data['file_list'] || [];
                    imgList.forEach(function(file){
                    var thumb_url = file['thumb_url'] + '&size=640*640';
                    var id = file['file_id'];
                    __p.push('                    <div data-list="true" id="');
_p(id);
__p.push('" data-file-id="');
_p(id);
__p.push('" class="share-file photo-view-list">\r\n\
                        <a href="javascript:void(0)" class="photo-view-list-link">\r\n\
                            <img src="');
_p(thumb_url);
__p.push('" onload="var width = this.width,height = this.height;if(width >= 266 && height >= 266) {if(height > width) {this.style.width = \'266px\';this.style.height = height * 266 / width + \'px\';height = height * 266 / width;width = 266;} else {this.style.height = \'266px\';this.style.width = width * 266 / height + \'px\';width = width * 266 / height;height = 266;}}this.style.margin = (266 - height) / 2 + \'px \' + (266 - width) / 2 + \'px\';"/>\r\n\
                            <span class="photo-view-list-checkbox checkbox"></span>\r\n\
                            <span class="photo-view-list-mask"></span>\r\n\
                        </a>\r\n\
                    </div>');

                    })
                    __p.push('                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'webOneImg': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_outlink_body" class="share-file-list files-view files-view-img">\r\n\
        <img class="ui-selected" data-file-id="');
_p(data && data.file_id);
__p.push('" id="prew_img" src="');
_p(data.url);
__p.push('" />\r\n\
    </div>');

return __p.join("");
},

'webSecret': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id=\'outlink_login_pass_access\' class="popshare-pass-access" style="margin-left: -170px; margin-top: -81px;">\r\n\
        <ul>\r\n\
            <li id="_password_cnt" class="pass">\r\n\
                <label class="infor" for="outlink_pwd">访问密码：</label>\r\n\
                <input id=\'outlink_pwd\' name="outlink_pwd" type="password">\r\n\
                <div data-id="tip" class="msg" id="outlink_login_err"></div>\r\n\
            </li>');

                var verify_img = '//captcha.weiyun.com/getimage?aid=543009514&' + Math.random();
            __p.push('            <li id="_verify_code_cnt" class="code" style="display: none;">\r\n\
                <label class="infor">验证码：</label>\r\n\
                <input data-id="verify_code_text" name="verify_code" type="text">\r\n\
                <div class="img">\r\n\
                    <a href="#"><img id="_verify_code_img" src="');
_p(verify_img);
__p.push('"></a>\r\n\
                    <a href="#" data-action="change_verify_code">换一张</a>\r\n\
                    <div data-id="tip" class="msg"></div>\r\n\
                </div>\r\n\
            </li>\r\n\
            <li class="btn">\r\n\
                <a class="g-btn g-btn-blue" href="#" id=\'outlink_pwd_ok\' data-action="secret"><span class="btn-inner">确定</span></a>\r\n\
            </li>\r\n\
        </ul></div>');

return __p.join("");
}
};
return tmpl;
});
