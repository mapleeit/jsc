
//tmpl file list:
//note/src/async.tmpl.html
//note/src/bottom.tmpl.html
//note/src/header.tmpl.html
//note/src/login.tmpl.html
//note/src/main.tmpl.html
define("club/weiyun/js/server/client/modules/note/tmpl",["weiyun/conf/configs_css","weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'async': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
    <!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
    <!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
    <!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
    <head>\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
        <meta charset="utf-8"/>\r\n\
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\r\n\
        <title>微云网页版</title>\r\n\
        <meta name="Keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web"/>\r\n\
        <meta name="Description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。"/>');

        var g_info = window['g_weiyun_info'];
        var serverConfig = plug('config') || {};
        var is_test_env = serverConfig.isTest ? true : false;
        __p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            document.domain = \'weiyun.com\';\r\n\
            var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';\r\n\
            var g_start_time = new Date(), IS_APPBOX = ');
_p(g_info.is_appbox);
__p.push(', IS_QZONE = ');
_p(g_info.is_qzone);
__p.push(', IS_PHP_OUTPUT = false, IS_DEBUG = ');
_p(g_info.is_debug);
__p.push(', g_err;\r\n\
            var g_use_cgiv2 = true;\r\n\
            IS_DEBUG || (window.onerror = function (msg, file, line) { g_err={ msg:msg||\'\',file:file||\'\',line:line||\'\' };return true;});\r\n\
        </scr');
__p.push('ipt>');

        var configs_css = require('weiyun/conf/configs_css');
        var is_appbox = g_info.is_appbox;
        var serv_taken = new Date() - g_info.server_start_time;
        var body_class = is_appbox ? 'app-appbox' : 'web-app';
        var css_list = ['base_css'];
        if(is_appbox) {
            css_list.push('p_appbox_css');
        } else {
            css_list.push('p_web_css');
        }
    __p.push('    ');
_p(require('weiyun/util/inline').css(css_list));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    g_css_time = new Date();\r\n\
    //防止用户使用通过浏览器访问appbox\r\n\
    if(IS_APPBOX && (!window.external || !window.external.UploadFile) && !IS_DEBUG) {\r\n\
        location.href = \'http://www.weiyun.com/disk/index.html\';\r\n\
    }\r\n\
</scr');
__p.push('ipt>');
 if(is_appbox) { __p.push('<style type="text/css">\r\n\
    #loading-text, #loading-icon {position:fixed;_position:absolute;margin:auto 0;/*left:50%;top:50%;*/z-index:100;}\r\n\
    #loading-text {width:200px;height:36px;font: 36px/1.5 arial;color: #666;font-family: Tahoma, Helvetica, Arial, sans-serif;z-index:1000;display:block;text-align:center;line-height:36px;}\r\n\
    #loading-icon {width:16px;height:16px;background: url(//img.weiyun.com/vipstyle/nr/box/web/images/loading3.gif) no-repeat 0 0;}\r\n\
</style>');
 } __p.push('</head>\r\n\
<body class="');
_p(body_class);
__p.push('">\r\n\
<div id="_main_ui_root" class="layout module-transfer" style="min-width: 790px;">\r\n\
    <div id="_main_bar1" class="lay-main-toolbar">\r\n\
        <div id="_disk_default_toolbar" class="toolbar-btn clear disk-toolbar">\r\n\
            <div class="btn-message">\r\n\
                <a data-btn-id="pack_down" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-down"></i><span class="text">下载</span></span></a>\r\n\
                <a data-btn-id="share" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-share"></i><span class="text">分享</span></span></a>\r\n\
                <a data-btn-id="move" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-move"></i><span class="text">移动到</span></span></a>\r\n\
                <a data-btn-id="rename" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-rename"></i><span class="text">重命名</span></span></a>\r\n\
                <a data-btn-id="del" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
                <a data-btn-id="mkdir" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-mkdir"></i><span class="text">新建文件夹</span></span></a>\r\n\
                <a data-btn-id="refresh" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner  minpad "><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
                <a data-btn-id="offline_remove" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner "><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
                <a data-btn-id="offline_save_as" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner "><i class="ico ico-saveas"></i><span class="text">另存为</span></span></a>\r\n\
                <a data-btn-id="offline_refresh" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner  minpad "><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
    <div id="_main_station_header" class="lay-files-head" style="display:none">\r\n\
    </div>\r\n\
    <div id="_main_share_header" class="lay-share-head" style="display:none">\r\n\
\r\n\
    </div>\r\n\
    <div id="_rec_file_header" class="lay-recycle-head" style="display:none">\r\n\
\r\n\
    </div>\r\n\
\r\n\
    <div id="_main_special_header"></div>\r\n\
\r\n\
    <div id="_main_content" class="lay-main-con" >\r\n\
        <div class="inner">\r\n\
            <div id="_main_box" class="wrap">\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>');
 if(g_info['is_debug']) {__p.push('<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } _p(require('weiyun/util/inline').js('configs_client'));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    var g_login_user_rsp_head = (function () { try { return {"cmd":2201,"retcode":0}; }catch(e){ } })(),\r\n\
            g_disk_root_files_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.file_list));
__p.push('; }catch(e){ }; })(),\r\n\
            g_page_time = new Date();\r\n\
    seajs.use([ \'$\', \'lib\', \'common\', \'note\'], function ($, lib, common, mod) {\r\n\
        window.g_js_time = +new Date();\r\n\
        var note = mod.get(\'./note\');\r\n\
        note.init();\r\n\
    });\r\n\
\r\n\
    (function(win, seajs) {\r\n\
        seajs.use([\'p_client_delay_css\', \'base_delay_css\']);\r\n\
    })(window, seajs);\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    setTimeout(function () {\r\n\
        seajs.use(window.location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: window.IS_APPBOX ? \'appbox/disk/index.html\': \'disk/index.html\',\r\n\
                    virtualDomain: "www.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        });\r\n\
    }, 5000);\r\n\
</scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
},

'bottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

	var g_info = window.g_weiyun_info;
	var serv_taken = new Date().getTime() - g_info.server_start_time;
	__p.push('	<scr');
__p.push('ipt type="text/javascript">\r\n\
		var g_serv_taken = ');
_p(serv_taken);
__p.push(';\r\n\
		setTimeout(function() {\r\n\
			window.g_end_time = +new Date();\r\n\
		}, 0);\r\n\
</scr');
__p.push('ipt>');
 if(g_info.is_debug) { __p.push('<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } _p(require('weiyun/util/inline').js(['configs_client']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
	var g_login_user_rsp_head = (function () { try { return {"cmd":2201,"retcode":0}; }catch(e){ } })(),\r\n\
			g_disk_root_files_rsp_body = (function () { try { return \'\'; }catch(e){ }; })(),\r\n\
			g_page_time = new Date();\r\n\
	seajs.use([ \'$\', \'lib\', \'common\', \'note\'], function ($, lib, common, mod) {\r\n\
		window.g_js_time = +new Date();\r\n\
		var note = mod.get(\'./note\');\r\n\
		note.init();\r\n\
	});\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
	(function(win, seajs) {\r\n\
		seajs.use([\'p_client_delay_css\', \'base_delay_css\']);\r\n\
	})(window, seajs);\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/common/security/aq.js" charset="UTF-8"></scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
},

'header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
    <!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
    <!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
    <!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
    <head>\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
        <meta charset="utf-8"/>\r\n\
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\r\n\
        <title>微云网页版</title>\r\n\
        <meta name="Keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web"/>\r\n\
        <meta name="Description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。"/>');

        var g_info = window['g_weiyun_info'];
        var body_class = 'web-app';
        var serverConfig = plug('config') || {};
        var is_test_env = serverConfig.isTest ? true : false;
        __p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            document.domain = \'weiyun.com\';\r\n\
            var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';\r\n\
            var g_start_time = new Date(), IS_APPBOX = ');
_p(g_info.is_appbox);
__p.push(', IS_QZONE = ');
_p(g_info.is_qzone);
__p.push(', IS_PHP_OUTPUT = true, IS_DEBUG = ');
_p(g_info.is_debug);
__p.push(', g_err;\r\n\
            IS_DEBUG || (window.onerror = function (msg, file, line) { g_err={ msg:msg||\'\',file:file||\'\',line:line||\'\' };return true;});\r\n\
            var g_use_cgiv2 = true;\r\n\
</scr');
__p.push('ipt>');

var configs_css = require('weiyun/conf/configs_css');
var css_list = ['base_css'];
css_list.push('p_web_css');
<!--css_list.push('p_web_delay_css');-->
_p(require('weiyun/util/inline').css(css_list));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    g_css_time = new Date();\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
</head>\r\n\
<body class="');
_p(body_class);
__p.push('">');

return __p.join("");
},

'login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
    <!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
    <!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
    <!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
    <head>\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n\
        <meta charset="utf-8"/>\r\n\
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\r\n\
        <title>微云网页版</title>\r\n\
        <meta name="Keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web"/>\r\n\
        <meta name="Description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。"/>');

        var g_info = window['g_weiyun_info'];
        var serverConfig = plug('config') || {};
        var is_test_env = serverConfig.isTest ? true : false;
        __p.push('    </head>\r\n\
    <body>');
 if(g_info.is_debug) { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } _p(require('weiyun/util/inline').js(['configs_client']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([ \'$\', \'lib\', \'common\', \'note\'], function ($, lib, common, mod) {\r\n\
        var update_cookie = mod.get(\'./update_cookie\');\r\n\
        update_cookie.reload();\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
},

'main': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div id="_main_ui_root" class="layout module-transfer" style="min-width: 790px;">\r\n\
		<div id="_main_bar1" class="lay-main-toolbar">\r\n\
			<div id="_disk_default_toolbar" class="toolbar-btn clear disk-toolbar">\r\n\
				<div class="btn-message">\r\n\
					<a data-btn-id="pack_down" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-down"></i><span class="text">下载</span></span></a>\r\n\
					<a data-btn-id="share" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-share"></i><span class="text">分享</span></span></a>\r\n\
					<a data-btn-id="move" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-move"></i><span class="text">移动到</span></span></a>\r\n\
					<a data-btn-id="rename" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-rename"></i><span class="text">重命名</span></span></a>\r\n\
					<a data-btn-id="del" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
					<a data-btn-id="mkdir" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner "><i class="ico ico-mkdir"></i><span class="text">新建文件夹</span></span></a>\r\n\
					<a data-btn-id="refresh" data-no-selection class="g-btn g-btn-gray" href="#" style="" tabindex="-1"><span class="btn-inner  minpad "><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
					<a data-btn-id="offline_remove" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner "><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
					<a data-btn-id="offline_save_as" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner "><i class="ico ico-saveas"></i><span class="text">另存为</span></span></a>\r\n\
					<a data-btn-id="offline_refresh" data-no-selection class="g-btn g-btn-gray" href="#" style="display:none;" tabindex="-1"><span class="btn-inner  minpad "><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
				</div>\r\n\
			</div>\r\n\
\r\n\
		</div>\r\n\
		<div id="_main_station_header" class="lay-files-head" style="display:none">\r\n\
		</div>\r\n\
		<div id="_main_share_header" class="lay-share-head" style="display:none">\r\n\
\r\n\
		</div>\r\n\
		<div id="_rec_file_header" class="lay-recycle-head" style="display:none">\r\n\
\r\n\
		</div>\r\n\
\r\n\
		<div id="_main_special_header"></div>\r\n\
\r\n\
		<div id="_main_content" class="lay-main-con" >\r\n\
			<div class="inner">\r\n\
				<div id="_main_box" class="wrap">\r\n\
				</div>\r\n\
			</div>\r\n\
		</div>\r\n\
	</div>');

return __p.join("");
}
};
return tmpl;
});
