
//tmpl file list:
//disk/src/async.tmpl.html
//disk/src/async_old.tmpl.html
//disk/src/bottom.tmpl.html
//disk/src/bottom_old.tmpl.html
//disk/src/header.tmpl.html
//disk/src/header_old.tmpl.html
//disk/src/login.tmpl.html
//disk/src/main.tmpl.html
//disk/src/main_old.tmpl.html
define("club/weiyun/js/server/web/modules/disk/tmpl",["weiyun/conf/configs_css","weiyun/util/inline"],function(require, exports, module){
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
            var css_list = [];
            if(is_appbox) {
                css_list.push('base_css');
                css_list.push('p_appbox_css');
            } else {
                css_list.push('page_home_css');
            }

        __p.push('        ');
_p(require('weiyun/util/inline').css(css_list, true));
__p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            g_css_time = new Date();\r\n\
            //防止用户使用通过浏览器访问appbox\r\n\
            if(IS_APPBOX && (!window.external || !window.external.UploadFile) && !IS_DEBUG) {\r\n\
                location.href = \'http://www.weiyun.com/disk/index.html\';\r\n\
            }\r\n\
        </scr');
__p.push('ipt>');
 if(is_appbox) { __p.push('            <style type="text/css">\r\n\
                #loading-text, #loading-icon {position:fixed;_position:absolute;margin:auto 0;/*left:50%;top:50%;*/z-index:100;}\r\n\
                #loading-text {width:200px;height:36px;font: 36px/1.5 arial;color: #666;font-family: Tahoma, Helvetica, Arial, sans-serif;z-index:1000;display:block;text-align:center;line-height:36px;}\r\n\
                #loading-icon {width:16px;height:16px;background: url(//img.weiyun.com/vipstyle/nr/box/web/images/loading3.gif) no-repeat 0 0;}\r\n\
            </style>');
 } __p.push('    </head>\r\n\
    <body class="');
_p(body_class);
__p.push('">\r\n\
        <button id="_aria_start_trigger" style="position:absolute;top:-200px;" type="button" tabindex="0" onclick="window.open(\'http://support.qq.com/write.shtml?fid=811\');">欢迎使用微云网盘，如果您读屏遇到问题，点击这里进行反馈。</button>\r\n\
        <scr');
__p.push('ipt type="text/javascript">document.getElementById(\'_aria_start_trigger\').focus();</scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
__p.push('ipt>');
 if(g_info['is_debug']) {__p.push('        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } __p.push('        ');
_p(require('weiyun/util/inline').js([is_appbox ? 'configs_appbox' : 'configs_web_v2']));
__p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            /*\r\n\
             * 初始化微云网盘\r\n\
             */\r\n\
\r\n\
            /**\r\n\
             * 定义 appbox 外部接口，将生成一个空方法，被调用后会保留之前的参数，等待相应模块就绪后自行处理\r\n\
             * @param {String} name\r\n\
             * @returns {Function}\r\n\
             */\r\n\
            (function () {\r\n\
                var win = window,\r\n\
                        call_history_map = window.__call_history_map = {},\r\n\
                        appbox_interface = function (name) {\r\n\
                            return win[name] = function () {\r\n\
                                var historys = call_history_map[name] || (call_history_map[name] = []);\r\n\
                                historys.push(arguments);\r\n\
                            };\r\n\
                        };\r\n\
\r\n\
                // 上传到微云\r\n\
                appbox_interface(\'WYCLIENT_UploadFiles\');\r\n\
\r\n\
                // 检查是否可拖拽上传（disk模块中会实现该方法）\r\n\
                win.support_plugin_drag_upload = function () {\r\n\
                    return 0;\r\n\
                };\r\n\
            })();\r\n\
\r\n\
            /**\r\n\
             * 初始化\r\n\
             */\r\n\
            (function (win, seajs) {\r\n\
                document.domain = \'weiyun.com\';\r\n\
\r\n\
                var g_serv_taken = win.g_serv_taken,\r\n\
                        g_start_time = win.g_start_time || new Date(),\r\n\
                        g_page_time = win.g_page_time;\r\n\
\r\n\
                // 初始化微云\r\n\
                var init = win.disk_init = function (opt) {\r\n\
\r\n\
                    // 合并基础库\r\n\
                    seajs.use([\'$\', \'lib\']);\r\n\
                    // 合并 main + disk + 延迟加载的样式\r\n\
                    seajs.use([\'lib\', \'common\', \'main\', \'disk\', \'page_home_delay_css\'], function (lib, common, main_mod, disk_mod) {\r\n\
                        var g_js_time = new Date(),\r\n\
                            console = lib.get(\'./console\'),\r\n\
                            store = lib.get(\'./store\'),\r\n\
                            JSON = lib.get(\'./json\'),\r\n\
                            constants = common.get(\'./constants\'),\r\n\
                            wy_init = common.get(\'./init.init\'),\r\n\
	                        huatuo_speed = common.get(\'./huatuo_speed\'),\r\n\
                            query_user = common.get(\'./query_user\'),\r\n\
                            cgi_ret_report = common.get(\'./cgi_ret_report\'),\r\n\
                            global_event = common.get(\'./global.global_event\'),\r\n\
                            main = main_mod.get(\'./main\'),\r\n\
                            disk = disk_mod.get(\'./disk\');\r\n\
\r\n\
	                    // 初始化一些全局兼容性修正\r\n\
                        wy_init();\r\n\
\r\n\
                        // 延迟加载一些模块\r\n\
                        main\r\n\
                            // 默认模块\r\n\
                                .set_default_module(\'disk\')\r\n\
                            // 模块hash参数名\r\n\
                                .set_module_hash_key(\'m\')\r\n\
                            // 设置模块路径（供异步载入模块使用）\r\n\
                                .set_async_modules_map({\r\n\
                                    disk: \'./disk\',\r\n\
                                    recycle: \'./recycle\',\r\n\
                                    recent: \'./recent\',\r\n\
                                    album: \'./photo_group\',\r\n\
                                    photo: \'./photo_bridge\',\r\n\
                                    photo_time: \'./photo_time\',\r\n\
                                    share: \'./share\',\r\n\
                                    search: \'./search\',\r\n\
                                    doc: \'./doc\',\r\n\
                                    video: \'./video\',\r\n\
                                    audio: \'./audio\',\r\n\
                                    clipboard: \'./clipboard\',\r\n\
                                    note:\'./note\'\r\n\
                                })\r\n\
                            //虚拟映射模块\r\n\
                                .set_virtual_modules_map({\r\n\
                                    offline: {\r\n\
                                        point: \'disk\',\r\n\
                                        after: function () {//激活后，待执行的任务\r\n\
                                            global_event.trigger(\'disk_open_offline\');\r\n\
                                        }\r\n\
                                    }\r\n\
                                });\r\n\
\r\n\
\r\n\
                        // 处理直出数据\r\n\
                        var usr_rsp_head = win.g_login_user_rsp_head,\r\n\
                                usr_rsp_body = win.g_login_user_rsp_body,\r\n\
                                disk_files_rsp_body = win.g_disk_root_files_rsp_body;\r\n\
                        if (usr_rsp_head && usr_rsp_body) {\r\n\
                            var usr = query_user.set_init_data(usr_rsp_head, usr_rsp_body);\r\n\
                            if (usr && disk_files_rsp_body) {\r\n\
                                disk.set_init_data(usr, disk_files_rsp_body);\r\n\
                            }\r\n\
                        }\r\n\
                        // 初始化 main 模块\r\n\
                        main.render();\r\n\
\r\n\
	                    // 测速配置\r\n\
	                    var flag;\r\n\
	                    if(window.location.protocol == \'https:\') {\r\n\
		                    flag = \'21254-1-22\';\r\n\
	                    } else {\r\n\
		                    flag = \'21254-1-23\';\r\n\
	                    }\r\n\
                        // 页面加载完成的时间\r\n\
                        g_page_time = g_page_time || new Date();\r\n\
                        setTimeout(function () {\r\n\
                            if(opt && opt.output) {\r\n\
                                cgi_ret_report.report("http://www.weiyun.com/app.php", "out", opt.output.ret, opt.output.spend_time);\r\n\
                            }\r\n\
	                        //测速点上报\r\n\
	                        huatuo_speed.store_point(flag, 20, g_page_time - g_start_time);\r\n\
	                        if(g_css_time) {\r\n\
		                        huatuo_speed.store_point(flag, 21, g_css_time - g_start_time);\r\n\
	                        }\r\n\
	                        if(g_js_time) {\r\n\
		                        huatuo_speed.store_point(flag, 22, g_js_time - g_start_time);\r\n\
	                        }\r\n\
	                        huatuo_speed.report(flag, true);\r\n\
                        }, 0);\r\n\
\r\n\
\r\n\
                        // 客户端接口（上传到微云等）\r\n\
                        try {\r\n\
                            var arr = store.get(\'WY_AIO_to_upload\');\r\n\
                            if (arr) {\r\n\
                                arr = JSON.parse(arr);\r\n\
                                WYCLIENT_UploadFiles(arr.length, arr.join(\'*\'), \'AIO\');\r\n\
                            }\r\n\
                            store.remove(\'WY_AIO_to_upload\');\r\n\
                        } catch (e) {\r\n\
                            console.error(e.stack);\r\n\
                        }\r\n\
\r\n\
                    });\r\n\
                };\r\n\
\r\n\
            })(window, seajs);\r\n\
\r\n\
\r\n\
            // TODO 移除该行和 preview_error.html 中对应的引用\r\n\
            var WY_VERSION = 2;\r\n\
\r\n\
        </scr');
__p.push('ipt>\r\n\
\r\n\
\r\n\
\r\n\
        <scr');
__p.push('ipt type="text/javascript">\r\n\
            disk_init({\r\n\
                output: {\r\n\
                    ret: ');
_p(data && data.ret || 17002);
__p.push(',\r\n\
                    spend_time: 0\r\n\
                }\r\n\
            });\r\n\
        </scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt type="text/javascript">\r\n\
            var pvClickSend;\r\n\
            setTimeout(function () {\r\n\
                seajs.use(window.location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
                    pvClickSend = function (tag) {\r\n\
                        if (typeof(pgvSendClick) == "function") {\r\n\
                            pgvSendClick({\r\n\
                                hottag: tag,\r\n\
                                virtualDomain: \'www.weiyun.com\'\r\n\
                            });\r\n\
                        }\r\n\
                    };\r\n\
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

'async_old': function(data){

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

        __p.push('        ');
_p(require('weiyun/util/inline').css(css_list));
__p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            g_css_time = new Date();\r\n\
            //防止用户使用通过浏览器访问appbox\r\n\
            if(IS_APPBOX && (!window.external || !window.external.UploadFile) && !IS_DEBUG) {\r\n\
                location.href = \'http://www.weiyun.com/disk/index.html\';\r\n\
            }\r\n\
        </scr');
__p.push('ipt>');
 if(is_appbox) { __p.push('    <style type="text/css">\r\n\
        #loading-text, #loading-icon {position:fixed;_position:absolute;margin:auto 0;/*left:50%;top:50%;*/z-index:100;}\r\n\
        #loading-text {width:200px;height:36px;font: 36px/1.5 arial;color: #666;font-family: Tahoma, Helvetica, Arial, sans-serif;z-index:1000;display:block;text-align:center;line-height:36px;}\r\n\
        #loading-icon {width:16px;height:16px;background: url(//img.weiyun.com/vipstyle/nr/box/web/images/loading3.gif) no-repeat 0 0;}\r\n\
    </style>');
 } __p.push('    </head>\r\n\
    <body class="');
_p(body_class);
__p.push('">\r\n\
        <button id="_aria_start_trigger" style="position:absolute;top:-200px;" type="button" tabindex="0" onclick="window.open(\'http://support.qq.com/write.shtml?fid=811\');">欢迎使用微云网盘，如果您读屏遇到问题，点击这里进行反馈。</button>\r\n\
        <scr');
__p.push('ipt type="text/javascript">document.getElementById(\'_aria_start_trigger\').focus();</scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
__p.push('ipt>');
 if(g_info['is_debug']) {__p.push('        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('        <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } __p.push('        ');
_p(require('weiyun/util/inline').js([is_appbox ? 'configs_appbox' : 'configs_web']));
__p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
        /*\r\n\
         * 初始化微云网盘\r\n\
         */\r\n\
\r\n\
        /**\r\n\
         * 定义 appbox 外部接口，将生成一个空方法，被调用后会保留之前的参数，等待相应模块就绪后自行处理\r\n\
         * @param {String} name\r\n\
         * @returns {Function}\r\n\
         */\r\n\
        (function () {\r\n\
            var win = window,\r\n\
                    call_history_map = window.__call_history_map = {},\r\n\
                    appbox_interface = function (name) {\r\n\
                        return win[name] = function () {\r\n\
                            var historys = call_history_map[name] || (call_history_map[name] = []);\r\n\
                            historys.push(arguments);\r\n\
                        };\r\n\
                    };\r\n\
\r\n\
            // 上传到微云\r\n\
            appbox_interface(\'WYCLIENT_UploadFiles\');\r\n\
\r\n\
            // 检查是否可拖拽上传（disk模块中会实现该方法）\r\n\
            win.support_plugin_drag_upload = function () {\r\n\
                return 0;\r\n\
            };\r\n\
        })();\r\n\
\r\n\
        /**\r\n\
         * 初始化\r\n\
         */\r\n\
        (function (win, seajs) {\r\n\
            document.domain = \'weiyun.com\';\r\n\
\r\n\
            var g_serv_taken = win.g_serv_taken,\r\n\
                    g_start_time = win.g_start_time || new Date(),\r\n\
                    g_page_time = win.g_page_time;\r\n\
\r\n\
            // 初始化微云\r\n\
            var init = win.disk_init = function (opt) {\r\n\
\r\n\
                // 合并基础库\r\n\
                seajs.use([\'$\', \'lib\']);\r\n\
                // 合并 main + disk + 延迟加载的样式\r\n\
                seajs.use([\'lib\', \'common\', \'main\', \'disk\', \'base_delay_css\', \'p_web_appbox_delay_css\'], function (lib, common, main_mod, disk_mod) {\r\n\
                    var g_js_time = new Date(),\r\n\
                            console = lib.get(\'./console\'),\r\n\
                            store = lib.get(\'./store\'),\r\n\
                            JSON = lib.get(\'./json\'),\r\n\
                            constants = common.get(\'./constants\'),\r\n\
                            wy_init = common.get(\'./init.init\'),\r\n\
                            huatuo_speed = common.get(\'./huatuo_speed\'),\r\n\
                            query_user = common.get(\'./query_user\'),\r\n\
                            cgi_ret_report = common.get(\'./cgi_ret_report\'),\r\n\
                            global_event = common.get(\'./global.global_event\'),\r\n\
                            main = main_mod.get(\'./main\'),\r\n\
                            disk = disk_mod.get(\'./disk\');\r\n\
\r\n\
                    // 初始化一些全局兼容性修正\r\n\
                    wy_init();\r\n\
\r\n\
                    // 延迟加载一些模块\r\n\
                    main\r\n\
                        // 默认模块\r\n\
                            .set_default_module(\'disk\')\r\n\
                        // 模块hash参数名\r\n\
                            .set_module_hash_key(\'m\')\r\n\
                        // 设置模块路径（供异步载入模块使用）\r\n\
                            .set_async_modules_map({\r\n\
                                disk: \'./disk\',\r\n\
                                recycle: \'./recycle\',\r\n\
                                recent: \'./recent\',\r\n\
                                album: \'./photo\',\r\n\
                                photo: \'./photo_bridge\',\r\n\
                                share: \'./share\',\r\n\
                                search: \'./search\',\r\n\
                                doc: \'./doc\',\r\n\
                                video: \'./video\',\r\n\
                                audio: \'./audio\',\r\n\
                                clipboard: \'./clipboard\',\r\n\
                                note:\'./note\'\r\n\
                            })\r\n\
                        //虚拟映射模块\r\n\
                            .set_virtual_modules_map({\r\n\
                                offline: {\r\n\
                                    point: \'disk\',\r\n\
                                    after: function () {//激活后，待执行的任务\r\n\
                                        global_event.trigger(\'disk_open_offline\');\r\n\
                                    }\r\n\
                                }\r\n\
                            });\r\n\
\r\n\
\r\n\
                    // 处理直出数据\r\n\
                    var usr_rsp_head = win.g_login_user_rsp_head,\r\n\
                            usr_rsp_body = win.g_login_user_rsp_body,\r\n\
                            disk_files_rsp_body = win.g_disk_root_files_rsp_body;\r\n\
                    if (usr_rsp_head && usr_rsp_body) {\r\n\
                        var usr = query_user.set_init_data(usr_rsp_head, usr_rsp_body);\r\n\
                        if (usr && disk_files_rsp_body) {\r\n\
                            disk.set_init_data(usr, disk_files_rsp_body);\r\n\
                        }\r\n\
                    }\r\n\
                    // 初始化 main 模块\r\n\
                    main.render();\r\n\
\r\n\
                    // 测速配置\r\n\
                    var flag;\r\n\
                    if(window.location.protocol == \'https:\') {\r\n\
                        flag = \'21254-1-22\';\r\n\
                    } else {\r\n\
                        flag = \'21254-1-23\';\r\n\
                    }\r\n\
                    // 页面加载完成的时间\r\n\
                    g_page_time = g_page_time || new Date();\r\n\
                    setTimeout(function () {\r\n\
                        if(opt && opt.output) {\r\n\
                            cgi_ret_report.report("http://www.weiyun.com/app.php", "out", opt.output.ret, opt.output.spend_time);\r\n\
                        }\r\n\
                        //测速点上报\r\n\
                        huatuo_speed.store_point(flag, 20, g_page_time - g_start_time);\r\n\
                        if(g_css_time) {\r\n\
                            huatuo_speed.store_point(flag, 21, g_css_time - g_start_time);\r\n\
                        }\r\n\
                        if(g_js_time) {\r\n\
                            huatuo_speed.store_point(flag, 22, g_js_time - g_start_time);\r\n\
                        }\r\n\
                        huatuo_speed.report(flag, true);\r\n\
                    }, 0);\r\n\
\r\n\
\r\n\
                    // 客户端接口（上传到微云等）\r\n\
                    try {\r\n\
                        var arr = store.get(\'WY_AIO_to_upload\');\r\n\
                        if (arr) {\r\n\
                            arr = JSON.parse(arr);\r\n\
                            WYCLIENT_UploadFiles(arr.length, arr.join(\'*\'), \'AIO\');\r\n\
                        }\r\n\
                        store.remove(\'WY_AIO_to_upload\');\r\n\
                    } catch (e) {\r\n\
                        console.error(e.stack);\r\n\
                    }\r\n\
\r\n\
                });\r\n\
            };\r\n\
\r\n\
        })(window, seajs);\r\n\
\r\n\
\r\n\
        // TODO 移除该行和 preview_error.html 中对应的引用\r\n\
        var WY_VERSION = 2;\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
\r\n\
\r\n\
        <scr');
__p.push('ipt type="text/javascript">\r\n\
            disk_init({\r\n\
                output: {\r\n\
                    ret: ');
_p(data && data.ret || 17002);
__p.push(',\r\n\
                spend_time: 0\r\n\
            }\r\n\
            });\r\n\
        </scr');
__p.push('ipt>\r\n\
        <scr');
__p.push('ipt type="text/javascript">\r\n\
            var pvClickSend;\r\n\
            setTimeout(function () {\r\n\
                seajs.use(window.location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
                    pvClickSend = function (tag) {\r\n\
                        if (typeof(pgvSendClick) == "function") {\r\n\
                            pgvSendClick({\r\n\
                                hottag: tag,\r\n\
                                virtualDomain: \'www.weiyun.com\'\r\n\
                            });\r\n\
                        }\r\n\
                    };\r\n\
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
__p.push('    ');

        var g_info = window.g_weiyun_info;
        var serv_taken = new Date().getTime() - g_info.server_start_time;
    __p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var g_login_user_rsp_head = (function () { try { return {"cmd":2201,"retcode":0}; }catch(e){ } })(),\r\n\
            g_login_user_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.userInfo));
__p.push('; }catch(e){ } })(),\r\n\
            g_disk_root_files_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.dirFileList));
__p.push('; }catch(e){ }; })(),\r\n\
	        g_disk_config_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.diskConfig));
__p.push('; }catch(e){ }; })();\r\n\
        var g_dom_ready_time = +new Date;\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
__p.push('ipt>');
 if(g_info.is_debug) { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } __p.push('    ');
_p(require('weiyun/util/inline').js(['configs_web_v2']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        /*\r\n\
         * 初始化微云网盘\r\n\
         */\r\n\
\r\n\
        /**\r\n\
         * 定义 appbox 外部接口，将生成一个空方法，被调用后会保留之前的参数，等待相应模块就绪后自行处理\r\n\
         * @param {String} name\r\n\
         * @returns {Function}\r\n\
         */\r\n\
        (function () {\r\n\
            var win = window,\r\n\
                    call_history_map = window.__call_history_map = {},\r\n\
                    appbox_interface = function (name) {\r\n\
                        return win[name] = function () {\r\n\
                            var historys = call_history_map[name] || (call_history_map[name] = []);\r\n\
                            historys.push(arguments);\r\n\
                        };\r\n\
                    };\r\n\
\r\n\
            // 上传到微云\r\n\
            appbox_interface(\'WYCLIENT_UploadFiles\');\r\n\
\r\n\
            // 检查是否可拖拽上传（disk模块中会实现该方法）\r\n\
            win.support_plugin_drag_upload = function () {\r\n\
                return 0;\r\n\
            };\r\n\
        })();\r\n\
\r\n\
        /**\r\n\
         * 初始化\r\n\
         */\r\n\
        (function (win, seajs) {\r\n\
            document.domain = \'weiyun.com\';\r\n\
\r\n\
            // 初始化微云\r\n\
            var init = win.disk_init = function (opt) {\r\n\
                // 合并基础库\r\n\
                seajs.use([\'$\', \'lib\']);\r\n\
                // 合并 main + disk + 延迟加载的样式\r\n\
                seajs.use([\'lib\', \'common\', \'main\', \'disk\', \'page_home_delay_css\'], function (lib, common, main_mod, disk_mod) {\r\n\
                    var console = lib.get(\'./console\'),\r\n\
                        store = lib.get(\'./store\'),\r\n\
                        JSON = lib.get(\'./json\'),\r\n\
                        constants = common.get(\'./constants\'),\r\n\
                        wy_init = common.get(\'./init.init\'),\r\n\
                        huatuo_speed = common.get(\'./huatuo_speed\'),\r\n\
                        query_user = common.get(\'./query_user\'),\r\n\
                        cgi_ret_report = common.get(\'./cgi_ret_report\'),\r\n\
                        global_event = common.get(\'./global.global_event\'),\r\n\
                        main = main_mod.get(\'./main\'),\r\n\
                        disk = disk_mod.get(\'./disk\');\r\n\
\r\n\
                    // 初始化一些全局兼容性修正\r\n\
                    wy_init();\r\n\
\r\n\
                    // 延迟加载一些模块\r\n\
                    main\r\n\
                        // 默认模块\r\n\
                        .set_default_module(\'disk\')\r\n\
                        // 模块hash参数名\r\n\
                        .set_module_hash_key(\'m\')\r\n\
                        // 设置模块路径（供异步载入模块使用）\r\n\
                        .set_async_modules_map({\r\n\
                            disk: \'./disk\',\r\n\
                            recycle: \'./recycle\',\r\n\
                            recent: \'./recent\',\r\n\
                            album: \'./photo_group\',\r\n\
                            photo: \'./photo_bridge\',\r\n\
                            photo_time: \'./photo_time\',\r\n\
                            share: \'./share\',\r\n\
                            search: \'./search\',\r\n\
                            doc: \'./doc\',\r\n\
                            video: \'./video\',\r\n\
                            audio: \'./audio\',\r\n\
                            clipboard: \'./clipboard\',\r\n\
                            note:\'./note\'\r\n\
                        })\r\n\
                        //虚拟映射模块\r\n\
                        .set_virtual_modules_map({\r\n\
                            offline: {\r\n\
                                point: \'disk\',\r\n\
                                after: function () {//激活后，待执行的任务\r\n\
                                    global_event.trigger(\'disk_open_offline\');\r\n\
                                }\r\n\
                            }\r\n\
                        });\r\n\
\r\n\
                    // 处理直出数据\r\n\
                    var usr_rsp_head = win.g_login_user_rsp_head,\r\n\
                        usr_rsp_body = win.g_login_user_rsp_body,\r\n\
                        disk_files_rsp_body = win.g_disk_root_files_rsp_body,\r\n\
	                    disk_config = ((win.g_disk_config_rsp_body || {}).key_value_info || {}).items || [];\r\n\
	                for(var i=0; i<disk_config.length; i++) {\r\n\
		                usr_rsp_body[disk_config[i].key] = disk_config[i].value;\r\n\
	                }\r\n\
                    if (usr_rsp_head && usr_rsp_body) {\r\n\
                        var usr = query_user.set_init_data(usr_rsp_head, usr_rsp_body);\r\n\
                        if (usr && disk_files_rsp_body) {\r\n\
                            disk.set_init_data(usr, disk_files_rsp_body);\r\n\
                        }\r\n\
                    }\r\n\
\r\n\
                    // 初始化 main 模块\r\n\
                    main.render();\r\n\
\r\n\
                    if(opt && opt.output) {\r\n\
                        cgi_ret_report.report("http://www.weiyun.com/app.php", "out", opt.output.ret, opt.output.spend_time);\r\n\
                    }\r\n\
\r\n\
                    // 客户端接口（上传到微云等）\r\n\
                    try {\r\n\
                        var arr = store.get(\'WY_AIO_to_upload\');\r\n\
                        if (arr) {\r\n\
                            arr = JSON.parse(arr);\r\n\
                            WYCLIENT_UploadFiles(arr.length, arr.join(\'*\'), \'AIO\');\r\n\
                        }\r\n\
                        store.remove(\'WY_AIO_to_upload\');\r\n\
                    } catch (e) {\r\n\
                        console.error(e.stack);\r\n\
                    }\r\n\
\r\n\
                    // 测速上报\r\n\
                    $(document).ready(function () {\r\n\
                        // 测速配置\r\n\
                        var flag = window.location.protocol === \'https:\' ? \'21254-1-27\' : \'21254-1-26\';\r\n\
                        //测速点上报\r\n\
                        huatuo_speed.store_point(flag, 23, win.g_dom_ready_time - (huatuo_speed.base_time || win.g_start_time)); //dom ready\r\n\
                        huatuo_speed.store_point(flag, 24, +new Date - (huatuo_speed.base_time || win.g_start_time)); //active\r\n\
                        huatuo_speed.report(flag, true);\r\n\
                    })\r\n\
                });\r\n\
            };\r\n\
        })(window, seajs);\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        disk_init({\r\n\
            output: {\r\n\
                ret: 0,\r\n\
                spend_time: ');
_p(serv_taken);
__p.push('            }\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var pvClickSend;\r\n\
        setTimeout(function () {\r\n\
            seajs.use(location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
                pvClickSend = function (tag) {\r\n\
                    if (typeof(pgvSendClick) == "function") {\r\n\
                        pgvSendClick({\r\n\
                            hottag: tag,\r\n\
                            virtualDomain: \'www.weiyun.com\'\r\n\
                        });\r\n\
                    }\r\n\
                };\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: window.IS_APPBOX ? \'appbox/disk/index.html\': \'disk/index.html\',\r\n\
                        virtualDomain: "www.weiyun.com"\r\n\
                    });\r\n\
                }\r\n\
            });\r\n\
        }, 5000);\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
	<scr');
__p.push('ipt type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/common/security/aq.js" charset="UTF-8"></scr');
__p.push('ipt>\r\n\
    </body>\r\n\
    </html>');

return __p.join("");
},

'bottom_old': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var g_info = window.g_weiyun_info;
        var serv_taken = new Date().getTime() - g_info.server_start_time;
    __p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var g_serv_taken = ');
_p(serv_taken);
__p.push(';\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var g_login_user_rsp_head = (function () { try { return {"cmd":2201,"retcode":0}; }catch(e){ } })(),\r\n\
            g_login_user_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.userInfo));
__p.push('; }catch(e){ } })(),\r\n\
            g_disk_root_files_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.dirFileList));
__p.push('; }catch(e){ }; })(),\r\n\
	        g_disk_config_rsp_body = (function () { try { return ');
_p(JSON.stringify(data.diskConfig));
__p.push('; }catch(e){ }; })(),\r\n\
            g_page_time = new Date();\r\n\
        setTimeout(function () {\r\n\
            g_page_time = new Date();\r\n\
        }, 0);\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
__p.push('ipt>');
 if(g_info.is_debug) { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } __p.push('    ');
_p(require('weiyun/util/inline').js([g_info.is_appbox ? 'configs_appbox' : 'configs_web']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        /*\r\n\
         * 初始化微云网盘\r\n\
         */\r\n\
\r\n\
        /**\r\n\
         * 定义 appbox 外部接口，将生成一个空方法，被调用后会保留之前的参数，等待相应模块就绪后自行处理\r\n\
         * @param {String} name\r\n\
         * @returns {Function}\r\n\
         */\r\n\
        (function () {\r\n\
            var win = window,\r\n\
                    call_history_map = window.__call_history_map = {},\r\n\
                    appbox_interface = function (name) {\r\n\
                        return win[name] = function () {\r\n\
                            var historys = call_history_map[name] || (call_history_map[name] = []);\r\n\
                            historys.push(arguments);\r\n\
                        };\r\n\
                    };\r\n\
\r\n\
            // 上传到微云\r\n\
            appbox_interface(\'WYCLIENT_UploadFiles\');\r\n\
\r\n\
            // 检查是否可拖拽上传（disk模块中会实现该方法）\r\n\
            win.support_plugin_drag_upload = function () {\r\n\
                return 0;\r\n\
            };\r\n\
        })();\r\n\
\r\n\
        /**\r\n\
         * 初始化\r\n\
         */\r\n\
        (function (win, seajs) {\r\n\
            document.domain = \'weiyun.com\';\r\n\
\r\n\
            var g_serv_taken = win.g_serv_taken,\r\n\
                    g_start_time = win.g_start_time || new Date(),\r\n\
                    g_page_time = win.g_page_time;\r\n\
\r\n\
            // 初始化微云\r\n\
            var init = win.disk_init = function (opt) {\r\n\
                // 合并基础库\r\n\
                seajs.use([\'$\', \'lib\']);\r\n\
                // 合并 main + disk + 延迟加载的样式\r\n\
                seajs.use([\'lib\', \'common\', \'main\', \'disk\', \'base_delay_css\', \'p_web_appbox_delay_css\'], function (lib, common, main_mod, disk_mod) {\r\n\
                    var\r\n\
                            g_js_time = new Date(),\r\n\
                            console = lib.get(\'./console\'),\r\n\
                            store = lib.get(\'./store\'),\r\n\
                            JSON = lib.get(\'./json\'),\r\n\
                            constants = common.get(\'./constants\'),\r\n\
                            wy_init = common.get(\'./init.init\'),\r\n\
		                    huatuo_speed = common.get(\'./huatuo_speed\'),\r\n\
                            query_user = common.get(\'./query_user\'),\r\n\
                            cgi_ret_report = common.get(\'./cgi_ret_report\'),\r\n\
                            global_event = common.get(\'./global.global_event\'),\r\n\
                            main = main_mod.get(\'./main\'),\r\n\
                            disk = disk_mod.get(\'./disk\');\r\n\
\r\n\
                    // 初始化一些全局兼容性修正\r\n\
                    wy_init();\r\n\
\r\n\
                    // 延迟加载一些模块\r\n\
                    main\r\n\
                        // 默认模块\r\n\
                            .set_default_module(\'disk\')\r\n\
                        // 模块hash参数名\r\n\
                            .set_module_hash_key(\'m\')\r\n\
                        // 设置模块路径（供异步载入模块使用）\r\n\
                            .set_async_modules_map({\r\n\
                                disk: \'./disk\',\r\n\
                                recycle: \'./recycle\',\r\n\
                                recent: \'./recent\',\r\n\
                                album: \'./photo\',\r\n\
                                photo: \'./photo_bridge\',\r\n\
                                share: \'./share\',\r\n\
                                search: \'./search\',\r\n\
                                doc: \'./doc\',\r\n\
                                video: \'./video\',\r\n\
                                audio: \'./audio\',\r\n\
                                clipboard: \'./clipboard\',\r\n\
                                note:\'./note\'\r\n\
                            })\r\n\
                        //虚拟映射模块\r\n\
                            .set_virtual_modules_map({\r\n\
                                offline: {\r\n\
                                    point: \'disk\',\r\n\
                                    after: function () {//激活后，待执行的任务\r\n\
                                        global_event.trigger(\'disk_open_offline\');\r\n\
                                    }\r\n\
                                }\r\n\
                            });\r\n\
\r\n\
\r\n\
                    // 处理直出数据\r\n\
                    var usr_rsp_head = win.g_login_user_rsp_head,\r\n\
                            usr_rsp_body = win.g_login_user_rsp_body,\r\n\
                            disk_files_rsp_body = win.g_disk_root_files_rsp_body,\r\n\
                            disk_config = ((win.g_disk_config_rsp_body || {}).key_value_info || {}).items || [];\r\n\
	                for(var i=0; i<disk_config.length; i++) {\r\n\
		                usr_rsp_body[disk_config[i].key] = disk_config[i].value;\r\n\
	                }\r\n\
                    if (usr_rsp_head && usr_rsp_body) {\r\n\
                        var usr = query_user.set_init_data(usr_rsp_head, usr_rsp_body);\r\n\
                        if (usr && disk_files_rsp_body) {\r\n\
                            disk.set_init_data(usr, disk_files_rsp_body);\r\n\
                        }\r\n\
                    }\r\n\
                    // 初始化 main 模块\r\n\
                    main.render();\r\n\
\r\n\
	                // 测速配置\r\n\
	                var flag;\r\n\
	                if(window.location.protocol == \'https:\') {\r\n\
		                flag = \'21254-1-7\';\r\n\
	                } else {\r\n\
		                flag = \'21254-1-8\';\r\n\
	                }\r\n\
                    // 页面加载完成的时间\r\n\
                    g_page_time = g_page_time || new Date();\r\n\
                    setTimeout(function () {\r\n\
                        if(opt && opt.output) {\r\n\
                            cgi_ret_report.report("http://www.weiyun.com/app.php", "out", opt.output.ret, opt.output.spend_time);\r\n\
                        }\r\n\
	                    //测速点上报\r\n\
	                    var local_taken = g_page_time - g_start_time;\r\n\
	                    if (constants.IS_PHP_OUTPUT) {\r\n\
		                    huatuo_speed.store_point(flag, 1, g_serv_taken);\r\n\
		                    huatuo_speed.store_point(flag, 2, local_taken);\r\n\
		                    huatuo_speed.store_point(flag, 5, g_serv_taken + local_taken);\r\n\
		                    console.log(\'直出: \' + g_serv_taken + \'ms, 本地: \' + local_taken + \'ms, 共: \' + (g_serv_taken + local_taken) + \'ms\');\r\n\
	                    } else {\r\n\
		                    huatuo_speed.store_point(flag, 2, local_taken);\r\n\
		                    huatuo_speed.store_point(flag, 5, local_taken);\r\n\
	                    }\r\n\
	                    if(g_css_time) {\r\n\
		                    huatuo_speed.store_point(flag, 3, g_css_time - g_start_time);\r\n\
	                    }\r\n\
	                    huatuo_speed.store_point(flag, 4, g_js_time - g_start_time);\r\n\
	                    huatuo_speed.report(flag);\r\n\
	                    //performance上报\r\n\
	                    huatuo_speed.report();\r\n\
                    }, 0);\r\n\
\r\n\
\r\n\
                    // 客户端接口（上传到微云等）\r\n\
                    try {\r\n\
                        var arr = store.get(\'WY_AIO_to_upload\');\r\n\
                        if (arr) {\r\n\
                            arr = JSON.parse(arr);\r\n\
                            WYCLIENT_UploadFiles(arr.length, arr.join(\'*\'), \'AIO\');\r\n\
                        }\r\n\
                        store.remove(\'WY_AIO_to_upload\');\r\n\
                    } catch (e) {\r\n\
                        console.error(e.stack);\r\n\
                    }\r\n\
\r\n\
                });\r\n\
            };\r\n\
\r\n\
        })(window, seajs);\r\n\
\r\n\
\r\n\
        // TODO 移除该行和 preview_error.html 中对应的引用\r\n\
        var WY_VERSION = 2;\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        disk_init({\r\n\
            output: {\r\n\
                ret: 0,\r\n\
                spend_time: ');
_p(serv_taken);
__p.push('            }\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var pvClickSend;\r\n\
        setTimeout(function () {\r\n\
            seajs.use(location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
                pvClickSend = function (tag) {\r\n\
                    if (typeof(pgvSendClick) == "function") {\r\n\
                        pgvSendClick({\r\n\
                            hottag: tag,\r\n\
                            virtualDomain: \'www.weiyun.com\'\r\n\
                        });\r\n\
                    }\r\n\
                };\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: window.IS_APPBOX ? \'appbox/disk/index.html\': \'disk/index.html\',\r\n\
                        virtualDomain: "www.weiyun.com"\r\n\
                    });\r\n\
                }\r\n\
            });\r\n\
        }, 5000);\r\n\
\r\n\
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
__p.push('<!DOCTYPE html>\r\n\
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
    var body_class = g_info.is_appbox ? 'app-appbox' : 'web-app';
    var serverConfig = plug('config') || {};
    var is_test_env = !!serverConfig.isTest;
    __p.push('    <scr');
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
    var css_list = ['page_home_css'];
    __p.push('    ');
_p(require('weiyun/util/inline').css(css_list, true));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var g_css_time = new Date();\r\n\
    </scr');
__p.push('ipt>\r\n\
</head>\r\n\
<body class="');
_p(body_class);
__p.push('">\r\n\
<button id="_aria_start_trigger" style="position:absolute;top:-200px;" type="button" tabindex="0" onclick="window.open(\'http://support.qq.com/write.shtml?fid=811\');">欢迎使用微云网盘，如果您读屏遇到问题，点击这里进行反馈。</button>\r\n\
<scr');
__p.push('ipt type="text/javascript">document.getElementById(\'_aria_start_trigger\').focus();</scr');
__p.push('ipt>');

return __p.join("");
},

'header_old': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<!DOCTYPE html>\r\n\
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
    var body_class = g_info.is_appbox ? 'app-appbox' : 'web-app';
    var serverConfig = plug('config') || {};
    var is_test_env = serverConfig.isTest ? true : false;
    __p.push('    <scr');
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
    var is_appbox = g_info.is_appbox;
    var css_list = ['base_css'];
    if(is_appbox) {
        css_list.push('p_appbox_css');
    } else {
        css_list.push('p_web_css');
    }

    __p.push('    ');
_p(require('weiyun/util/inline').css(css_list));
__p.push('    ');
_p(require('weiyun/util/inline').css(['pop'], true));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        g_css_time = new Date();\r\n\
        //防止用户使用通过浏览器访问appbox\r\n\
        if(IS_APPBOX && (!window.external || !window.external.UploadFile) && !IS_DEBUG) {\r\n\
            location.href = \'http://www.weiyun.com/disk/index.html\';\r\n\
        }\r\n\
    </scr');
__p.push('ipt>');
if(g_info.is_appbox) { __p.push('    <style type="text/css">\r\n\
        #loading-text, #loading-icon {position:fixed;_position:absolute;margin:auto 0;/*left:50%;top:50%;*/z-index:100;}\r\n\
        #loading-text {width:200px;height:36px;font: 36px/1.5 arial;color: #666;font-family: Tahoma, Helvetica, Arial, sans-serif;z-index:1000;display:block;text-align:center;line-height:36px;}\r\n\
        #loading-icon {width:16px;height:16px;background: url(//img.weiyun.com/vipstyle/nr/box/web/images/loading3.gif) no-repeat 0 0;}\r\n\
    </style>');
 } __p.push('</head>\r\n\
<body class="');
_p(body_class);
__p.push('">\r\n\
<button id="_aria_start_trigger" style="position:absolute;top:-200px;" type="button" tabindex="0" onclick="window.open(\'http://support.qq.com/write.shtml?fid=811\');">欢迎使用微云网盘，如果您读屏遇到问题，点击这里进行反馈。</button>\r\n\
<scr');
__p.push('ipt type="text/javascript">document.getElementById(\'_aria_start_trigger\').focus();</scr');
__p.push('ipt>');

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

        __p.push('        ');
_p(require('weiyun/util/inline').css(css_list));
__p.push('        <scr');
__p.push('ipt type="text/javascript">\r\n\
            g_css_time = new Date();\r\n\
        </scr');
__p.push('ipt>');
 if(is_appbox) { __p.push('        <style type="text/css">\r\n\
            #loading-text, #loading-icon {position:fixed;_position:absolute;margin:auto 0;/*left:50%;top:50%;*/z-index:100;}\r\n\
            #loading-text {width:200px;height:36px;font: 36px/1.5 arial;color: #666;font-family: Tahoma, Helvetica, Arial, sans-serif;z-index:1000;display:block;text-align:center;line-height:36px;}\r\n\
            #loading-icon {width:16px;height:16px;background: url(//img.weiyun.com/vipstyle/nr/box/web/images/loading3.gif) no-repeat 0 0;}\r\n\
        </style>');
 } __p.push('    </head>\r\n\
    <body class="');
_p(body_class);
__p.push('">\r\n\
    <button id="_aria_start_trigger" style="position:absolute;top:-200px;" type="button" tabindex="0" onclick="window.open(\'http://support.qq.com/write.shtml?fid=811\');">欢迎使用微云网盘，如果您读屏遇到问题，点击这里进行反馈。</button>\r\n\
    <scr');
__p.push('ipt type="text/javascript">document.getElementById(\'_aria_start_trigger\').focus();</scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        var g_serv_login_rsp = (function () { return ');
_p(JSON.stringify(data));
__p.push(' })();\r\n\
    </scr');
__p.push('ipt>');
 if(g_info['is_debug']) {__p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>');
 } else { __p.push('    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
 } __p.push('    ');
_p(require('weiyun/util/inline').js(['configs_web_v2']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        /*!\r\n\
         * 登录页初始化JS\r\n\
         */\r\n\
        (function (win) {\r\n\
            document.domain = \'weiyun.com\';\r\n\
            // 基础库\r\n\
            seajs.use([\'$\', \'lib\']);\r\n\
            // 合并 main + disk (加上base_delay_css，直出登陆失败，限制企业号提示时需要这个样式)\r\n\
            seajs.use([\'lib\', \'common\', \'main\', \'page_home_delay_css\'], function (lib, common, main) {\r\n\
                var\r\n\
                        wy_init = common.get(\'./init.init\'),\r\n\
                        query_user = common.get(\'./query_user\'),\r\n\
                        main_mod = main.get(\'./main\');\r\n\
\r\n\
                // 初始化一些全局兼容性修正\r\n\
                wy_init();\r\n\
\r\n\
                // 初始化 main 模块（不初始化upload和disk模块）\r\n\
                main_mod.render({\r\n\
                    exclude_mods: {\r\n\
                        upload: 1,\r\n\
                        disk: 1\r\n\
                    }\r\n\
                });\r\n\
            });\r\n\
\r\n\
            var STORE_NAME = \'WY_AIO_to_upload\';\r\n\
\r\n\
            // 客户端接口 -- 调用文件上传\r\n\
            win.WYCLIENT_UploadFiles = (function () {\r\n\
                /**\r\n\
                 * 追加文件\r\n\
                 * @param file_num\r\n\
                 * @param file_path\r\n\
                 */\r\n\
                var add_file = function (file_num, file_path) {\r\n\
                    if (!file_path)\r\n\
                        return;\r\n\
\r\n\
                    get_file_list_from_temp(function (arr) {\r\n\
                        var added = false;\r\n\
\r\n\
                        var map = {};\r\n\
                        for (var i = 0, l = arr.length; i < l; i++) {\r\n\
                            map[arr[i]] = 1;\r\n\
                        }\r\n\
\r\n\
                        var paths = file_path.split(\'*\'); // 多个文件用星号分隔\r\n\
                        for (var i = 0, l = paths.length; i < l; i++) {\r\n\
                            var path = paths[i];\r\n\
                            // 添加到队列中\r\n\
                            if (!(path in map)) {\r\n\
                                map[path] = 1;\r\n\
                                arr.push(path);\r\n\
                                added = true;\r\n\
                            }\r\n\
                        }\r\n\
\r\n\
                        if (added) {\r\n\
                            save_file_list_to_temp(arr);\r\n\
                        }\r\n\
                    })\r\n\
                };\r\n\
\r\n\
                var get_file_list_from_temp = function (callback) {\r\n\
                    try {\r\n\
                        seajs.use(\'lib\', function (lib) {\r\n\
                            var\r\n\
                                    JSON = lib.get(\'./json\'),\r\n\
                                    store = lib.get(\'./store\'),\r\n\
                                    arr = store.get(STORE_NAME);\r\n\
                            arr = arr ? JSON.parse(arr) : [];\r\n\
\r\n\
                            callback(arr);\r\n\
                        });\r\n\
                    } catch (e) {\r\n\
                        callback([]);\r\n\
                    }\r\n\
                };\r\n\
\r\n\
                /**\r\n\
                 * 保存上传队列到store\r\n\
                 * @param arr\r\n\
                 */\r\n\
                var save_file_list_to_temp = function (arr) {\r\n\
                    seajs.use([\'lib\', \'common\'], function (lib, common) {\r\n\
                        var\r\n\
                                JSON = lib.get(\'./json\'),\r\n\
                                store = lib.get(\'./store\'),\r\n\
                                constants = common.get(\'./constants\'),\r\n\
\r\n\
                                list_str = JSON.stringify(arr);\r\n\
\r\n\
                        store.set(STORE_NAME, list_str);\r\n\
                        _console.debug(\'Upload file path saved:\\n\' + list_str);\r\n\
                    });\r\n\
                };\r\n\
\r\n\
                return add_file;\r\n\
            })();\r\n\
\r\n\
            win.WYCLIENT_EnterOfflineDir = function (fileId, fileName) {\r\n\
                // do nothing...\r\n\
            };\r\n\
\r\n\
            win.WYCLIENT_BeforeCloseWindow = function () {\r\n\
                var lib = seajs.require(\'lib\');\r\n\
                var store = lib.get(\'./store\');\r\n\
                store.remove(STORE_NAME);\r\n\
            };\r\n\
\r\n\
        })(window);\r\n\
\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        setTimeout(function () {\r\n\
            seajs.use(window.location.protocol + \'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\', function() {\r\n\
                if (typeof pgvMain == \'function\') {\r\n\
                    pgvMain("", {\r\n\
                        tagParamName: \'WYTAG\',\r\n\
                        virtualURL: \'disk/login.html\',\r\n\
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

'main': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_ui_root" class="layout-wrapper">\r\n\
	    <div id="_main_fixed_header" class="layout-header">\r\n\
		    <div class="layout-header-inner">\r\n\
			    <!-- 顶部导航 s -->\r\n\
			    <div id="_main_top" class="mod-nav clearfix">\r\n\
				    <div class="logo">\r\n\
					    <a href="http://www.weiyun.com/?WYTAG=appbox.disk.logo" target="_blank" title="腾讯微云" tabindex="-1">腾讯微云</a>\r\n\
				    </div>\r\n\
				    <div id="_main_normal">\r\n\
				    <!-- 传输面板 s -->\r\n\
					<div class="mod-act">\r\n\
						<span class="act-link" id="_main_header_manage" href="javascript: void(0);" data-action="manage" title="文件管理" style="cursor: pointer;">\r\n\
							<i class="icon icon-act j-manage-icon"></i>\r\n\
							<span class="sync-num j-manage-num" style="display: none;"></span>\r\n\
						</span>\r\n\
					</div>\r\n\
				    <!-- 传输面板 e -->\r\n\
				    <!--搜索 s -->\r\n\
				    <div class="mod-search j-header-search"><!--获得焦点状态添加类名focus -->\r\n\
					    <i class="icon icon-search"></i>\r\n\
						<label>输入文件名</label>\r\n\
					    <input class="mod-input" type="text" autocomplete="off" maxlength="40" aria-label="输入文件名并按下回车进行搜索" tabindex="0"/>\r\n\
						<a class="close" href="javascript: void(0);" aria-label="关闭搜索界面" hidefocus="on"><i class="icon icon-close"></i></a>\r\n\
				    </div>\r\n\
				    <!--搜索 e -->\r\n\
				    <!-- 视图模式 s -->\r\n\
					<div id="_main_bar0" class="mod-view">\r\n\
					</div>\r\n\
				    <!-- 视图模式 e -->\r\n\
				    <!-- 用到的css：mod-nav.css -->\r\n\
					<!-- 添加 s -->\r\n\
					<!-- [ATTENTION!!] 切换 .on -->\r\n\
					<div data-action="upload" class="mod-upload">\r\n\
						<input id="_upload_html5_input" name="file" type="file" multiple="multiple" aria-label="上传文件，按空格选择文件。" style="display: none;" />\r\n\
						<label for="_upload_html5_input"><span class="btn btn-l btn-upload"><i class="icon icon-add"></i><span class="btn-txt">添加</span></span></label>\r\n\
						<!-- 添加内容 s -->\r\n\
						<div class="mod-bubble-dropdown with-border top-right upload-bubble-dropdown j-upload-drop">\r\n\
							<ul class="upload-dropdown clearfix">\r\n\
								<li class="upload-item" data-action="upload_files" style="display: none;">\r\n\
									<div class="inner">\r\n\
										<b class="icon icon-upload icon-upload-file"></b>\r\n\
										<p class="txt" tabindex="-1">上传文件</p>\r\n\
									</div>\r\n\
								</li>\r\n\
								<li class="upload-item" data-action="upload_folder" style="display: none;">\r\n\
									<div class="inner">\r\n\
										<b class="icon icon-upload icon-upload-dir"></b>\r\n\
										<p class="txt" tabindex="-1">上传文件夹</p>\r\n\
									</div>\r\n\
								</li>\r\n\
								<li class="upload-item" data-action="offline_download" style="display: none;">\r\n\
									<div class="inner">\r\n\
										<b class="icon icon-upload icon-offline-download"></b>\r\n\
										<p class="txt" tabindex="-1">离线下载</p>\r\n\
									</div>\r\n\
								</li>\r\n\
								<li class="upload-item" data-action="create_folder" style="display: none;">\r\n\
									<div class="inner">\r\n\
										<b class="icon icon-upload icon-create-dir"></b>\r\n\
										<p class="txt" tabindex="-1">创建文件夹</p>\r\n\
									</div>\r\n\
								</li>\r\n\
								<li class="upload-item" data-action="add_note" style="display: none;">\r\n\
									<div class="inner">\r\n\
										<b class="icon icon-upload icon-add-note"></b>\r\n\
										<p class="txt" tabindex="-1">添加笔记</p>\r\n\
									</div>\r\n\
								</li>\r\n\
							</ul>\r\n\
							<b class="bubble-arrow-border"></b>\r\n\
							<b class="bubble-arrow"></b>\r\n\
						</div>\r\n\
						<!-- 添加内容 e -->\r\n\
					</div>\r\n\
					<!-- 添加 e-->\r\n\
				</div>\r\n\
				    <!-- 工具栏 s-->\r\n\
				    <div id="_main_edit" style="display: none;">\r\n\
					    <div class="select-btn-wrap">\r\n\
						    <a href="javascript: void(0);" class="select-btn" data-action="edit_cancel_all">取消选择</a>\r\n\
					    </div>\r\n\
					    <div class="edit-select j-edit-count"><p>选择了<span class="j-edit-count-text"></span>项</p></div>\r\n\
					    <!--导航栏编辑按钮 s -->\r\n\
					    <div class="mod-edit-bar">\r\n\
						    <ul class="edit-wrap clearfix" id="_main_bar1"></ul>\r\n\
					    </div>\r\n\
					    <!--导航栏编辑按钮 e -->\r\n\
				    </div>\r\n\
				    <!-- 工具栏 e-->\r\n\
			    </div>\r\n\
			    <!-- 顶部导航 e -->\r\n\
		    </div>\r\n\
	    </div>\r\n\
	    <div class="layout-body">\r\n\
		    <div class="layout-body-inner">\r\n\
			    <!-- 左侧栏 s -->\r\n\
			    <div id="_main_nav" class="layout-aside" data-no-selection style="height: 956px;">\r\n\
				    <!-- layout-aside-hd s -->\r\n\
				    <div class="layout-aside-hd">\r\n\
					    <!-- 用到的样式：mod-user.css -->\r\n\
					    <!-- 用户头像 s -->\r\n\
					    <div class="mod-user mod-user-vip"><!-- vip用户加类名 mod-user-vip,vip过期用户加类名 mod-user-vip-expire-->\r\n\
						    <div id="_main_face" class="user-avatar">\r\n\
							    <a class="user-avatar-pic" href="javascript: void(0);" data-id="qzone_vip">\r\n\
								    <img src="//img.weiyun.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
								    <i class="icon icon-vip j-vip-icon" title="VIP会员" style="display: none;"></i>\r\n\
							    </a>\r\n\
						    </div>\r\n\
						    <!-- 用户信息 s -->\r\n\
						    <div id="_main_face_menu" class="mod-bubble-dropdown acct-bubble-dropdown" style="display: none;">\r\n\
							    <div class="acct-dropdown">\r\n\
								    <div class="acct-info">\r\n\
									    <div class="name-container clearfix">\r\n\
										    <span id="_main_nick_name" class="name"></span>\r\n\
										    <a id="_main_logout" class="btn" href="javascript: void(0);" title="退出登录"><i class="icon icon-logout"></i></a>\r\n\
									    </div>\r\n\
									    <div id="_main_space_info" class="space-container">\r\n\
											<!-- space_info 这里走异步添加 -->\r\n\
									    </div>\r\n\
								    </div>\r\n\
								    <ul class="with-border">\r\n\
									    <!-- [ATTENTIN!!] 没有会员添加 .fail -->\r\n\
									    <li class="main acct-item j-vip-state" style="visibility: hidden;">\r\n\
										    <span class="txt j-vip-date">会员2017-06-12到期</span>\r\n\
										    <!-- [ATTENTION!!] 文案：开通/续费 -->\r\n\
										    <a href="javascript: void(0);" class="btn btn-m btn-vip j-vip-btn"><span class="j-vip-txt">续费</span>会员</a>\r\n\
									    </li>\r\n\
										<!--@capacity_purchase-->\r\n\
										<li id="_main_purchase_capacity" class="acct-item main">\r\n\
											<span class="txt">购买容量</span>\r\n\
											<!-- 新增！！ -->\r\n\
											<span class="tag tag-fornew"></span>\r\n\
										</li>\r\n\
									    <li id="_main_pwd_locker" class="acct-item"><span class="txt"><span class="j-pwd-state">开启</span>独立密码</span></li>\r\n\
									    <li id="_main_feedback" class="acct-item"><span class="txt">帮助与反馈</span></li>\r\n\
										<a href="//www.weiyun.com/complaint.html" target="_blank"><li id="_main_copyright_complaint" class="acct-item"><span class="txt">投诉指引</span></li></a>\r\n\
									</ul>\r\n\
							    </div>\r\n\
						    </div>\r\n\
						    <!-- 用户信息 e -->\r\n\
					    </div>\r\n\
					    <!-- 用户头像 s -->\r\n\
				    </div>\r\n\
				    <!-- layout-aside-hd e -->\r\n\
				    <!-- layout-aside-bd s -->\r\n\
				    <div id="_main_nav_aside_box" class="layout-aside-bd" style="height: 852px;">\r\n\
					    <!-- 菜单 s -->\r\n\
					    <div id="_main_nav_aside_wrap" class="mod-menu">\r\n\
						    <div class="add-in j-vip-state" style="visibility: hidden;">\r\n\
							    <!-- 开通会员 | 续费会员 -->\r\n\
							    <a href="javascript: void(0);" class="btn btn-m btn-vip"><span class="j-vip-txt">续费</span>会员</a>\r\n\
						    </div>\r\n\
						    <!-- 最近s -->\r\n\
						    <div class="menu-item">\r\n\
							    <div class="menu-item-bd">\r\n\
								    <ul class="menu-list">\r\n\
									    <li data-mod="recent" data-op="NAV_RECENT">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-ren"></i><span class="menu-tit">最近</span></a>\r\n\
									    </li>\r\n\
								    </ul>\r\n\
							    </div>\r\n\
						    </div>\r\n\
						    <!-- 最近e -->\r\n\
						    <!-- 文件s -->\r\n\
						    <div class="menu-item">\r\n\
							    <div class="menu-item-hd">\r\n\
								    <h3 class="tit">文件</h3>\r\n\
							    </div>\r\n\
							    <div class="menu-item-bd">\r\n\
								    <ul class="menu-list">\r\n\
									    <li class="cur" data-mod="disk" data-op="NAV_DISK">\r\n\
										    <a href="page-home.html"><i class="icon icon-all"></i><span class="menu-tit">全部</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="doc" data-op="NAV_DOC">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-doc"></i><span class="menu-tit">文档</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="album" data-op="NAV_ALBUM">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-pic"></i><span class="menu-tit">图片</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="video" data-op="NAV_VIDEO">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-video"></i><span class="menu-tit">视频</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="note" data-op="NAV_NOTE">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-note"></i><span class="menu-tit">笔记</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="audio" data-op="NAV_AUDIO">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-music"></i><span class="menu-tit">音乐</span></a>\r\n\
									    </li>\r\n\
								    </ul>\r\n\
							    </div>\r\n\
						    </div>\r\n\
						    <!-- 文件e -->\r\n\
						    <!-- 照片s -->\r\n\
						    <div class="menu-item">\r\n\
							    <div class="menu-item-hd">\r\n\
								    <h3 class="tit">照片</h3>\r\n\
							    </div>\r\n\
							    <div class="menu-item-bd">\r\n\
								    <ul class="menu-list">\r\n\
									    <li data-mod="photo_time" data-op="NAV_ALBUM">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-time"></i><span class="menu-tit">时间</span></a>\r\n\
									    </li>\r\n\
									    <li style="display: none;">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-location"></i><span class="menu-tit">地点</span></a>\r\n\
									    </li>\r\n\
									    <li style="display: none;">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-tag"></i><span class="menu-tit">标签</span></a>\r\n\
									    </li>\r\n\
								    </ul>\r\n\
							    </div>\r\n\
						    </div>\r\n\
						    <!-- 照片e -->\r\n\
						    <!-- 我的s -->\r\n\
						    <div class="menu-item">\r\n\
							    <div class="menu-item-hd">\r\n\
								    <h3 class="tit">我的</h3>\r\n\
							    </div>\r\n\
							    <div class="menu-item-bd">\r\n\
								    <ul class="menu-list">\r\n\
									    <li data-mod="clipboard" data-op="NAV_CLIPBOARD">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-clip"></i><span class="menu-tit">剪贴板</span></a>\r\n\
										    <span data-id="clip-num" class="clip-num" style="display:none;"></span>\r\n\
									    </li>\r\n\
									    <li data-mod="share" data-op="NAV_SHARE">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-share"></i><span class="menu-tit">分享链接</span></a>\r\n\
									    </li>\r\n\
									    <li data-mod="recycle" data-op="NAV_RECYCLE">\r\n\
										    <a href="javascript: void(0);"><i class="icon icon-trash"></i><span class="menu-tit">回收站</span></a>\r\n\
									    </li>\r\n\
								    </ul>\r\n\
							    </div>\r\n\
						    </div>\r\n\
						    <!-- 我的e -->\r\n\
						    <div id="_main_nav_split"></div>\r\n\
					    </div>\r\n\
					    <!-- 菜单 s -->\r\n\
				    </div>\r\n\
				    <!-- layout-aside-bd e -->\r\n\
				    <!-- layout-aside-ft s -->\r\n\
				    <div class="layout-aside-ft">\r\n\
					    <!-- 帮助 s -->\r\n\
					    <!--<div class="mod-txt-list">-->\r\n\
						    <!--<ul class="txt-list clearfix">-->\r\n\
							    <!--<li class="txt-item"><a href="javascript: void(0);">版权声明</a>-->\r\n\
								    <!--&lt;!&ndash; 版权声明内容 s &ndash;&gt;-->\r\n\
								    <!--<div class="mod-bubble-dropdown with-border bottom-left copyright-bubble-dropdown">-->\r\n\
									    <!--<div class="txt-dropdown">-->\r\n\
										    <!--<p>您应尊重相关作品著作权人合法权益，未经著作权人合法授权，不能违法上传、储存、分享他人作品。</p>-->\r\n\
									    <!--</div>-->\r\n\
									    <!--<b class="bubble-arrow-border"></b>-->\r\n\
									    <!--<b class="bubble-arrow"></b>-->\r\n\
								    <!--</div>-->\r\n\
								    <!--&lt;!&ndash; 版权声明内容 e &ndash;&gt;-->\r\n\
							    <!--</li>-->\r\n\
							    <!--<li class="txt-item"><a href="http://www.weiyun.com/complaint.html" target="_blank">投诉指引</a></li>-->\r\n\
						    <!--</ul>-->\r\n\
					    <!--</div>-->\r\n\
					    <!-- 帮助 e -->\r\n\
				    </div>\r\n\
				    <!-- layout-aside-hd e -->\r\n\
			    </div>\r\n\
			    <!-- 左侧栏 e -->\r\n\
			    <!-- 主要内容 s -->\r\n\
			    <div class="layout-main">\r\n\
				    <div id="_main_hd" class="layout-main-hd">\r\n\
					    <div id="_main_bar2" class="mod-act-panel" style="display: none;">\r\n\
						    <div id="_disk_file_path" class="act-panel-inner cleafix" style="display: none;">\r\n\
							    <div class="mod-check"><i id="_disk_all_checker" data-file-check class="icon icon-checkbox icon-check-s"></i></div>\r\n\
							    <!-- 面包屑导航 s -->\r\n\
							    <!-- 面包屑导航 -->\r\n\
							    <div class="mod-breadcrumb">\r\n\
								    <ul data-inner class="breadcrumb clearfix">\r\n\
									    <li class="cur"><a href="javascript: void(0);" hidefocus="on">全部</a></li>\r\n\
								    </ul>\r\n\
							    </div>\r\n\
							    <!-- 面包屑导航 e -->\r\n\
						    </div>\r\n\
					    </div>\r\n\
				    </div>\r\n\
				    <div id="_main_content" class="layout-main-bd">\r\n\
						<div id="_main_box"  class="inner" style="height: 100%">\r\n\
                            <div id="_disk_body" class="mod-list-group" >\r\n\
                                <div class="list-group-bd">\r\n\
                                    <!-- 空目录时的提示 -->\r\n\
                                    <div id="_disk_files_empty" class="empty-box" style="display: none;">\r\n\
										<div class="status-inner">\r\n\
											<i class="icon icon-nofile"></i>\r\n\
											<h2 class="title">暂无文件</h2>\r\n\
											<p class="txt">请点击右上角的“添加”按钮添加</p>\r\n\
										</div>\r\n\
                                    </div>\r\n\
\r\n\
                                    <ul id="list_disk_files" class="list-group">\r\n\
                                    </ul>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
				    </div>\r\n\
			    </div>\r\n\
			    <!-- 主要内容 e -->\r\n\
		    </div>\r\n\
	    </div>\r\n\
    </div>');

return __p.join("");
},

'main_old': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_ui_root" class="layout module-disk">\r\n\
        <div id="_main_fixed_header" class="lay-header clear">\r\n\
            <a class="logo" href="http://www.weiyun.com/?WYTAG=appbox.disk.logo" target="_blank" tabindex="-1"></a>\r\n\
            <div id="_head_ad_left" class="app clear diff-appdown" style="">\r\n\
            </div>\r\n\
            <div id="_head_ad_right" class="ad diff-adright"  style="">\r\n\
            </div>\r\n\
            <div id="_main_face" data-no-selection class="user">\r\n\
                <div class="normal">\r\n\
                    <div class="inner">\r\n\
                        <i data-id="qzone_vip" class="ico ico-vip" style="display:none;"></i>\r\n\
                        <img src="//img.weiyun.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
                        <i class="ico"></i>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
\r\n\
            <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
                <div class="ui-pop-head">\r\n\
                    <span id="_main_nick_name" class="user-nick">...</span>\r\n\
                    <div id="_main_space_info">\r\n\
                        <div class="ui-text quota-info">\r\n\
                            <label>已使用：</label>\r\n\
                            <span id="_main_space_info_used_space_text">0G</span>\r\n\
                        </div>\r\n\
                        <div class="ui-text quota-info">\r\n\
                            <label>总容量：</label>\r\n\
                            <span id="_main_space_info_total_space_text">0G</span>\r\n\
                        </div>\r\n\
                        <div class="ui-quota">\r\n\
                            <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 0%;"></div>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
\r\n\
                <ul class="ui-menu">\r\n\
                    <li><a id="_main_renew_qzonevip" href="javascript:void(0)" tabindex="-1">开通会员</a></li>\r\n\
                    <!--@capacity_purchase-->\r\n\
                    <li><a href="//www.weiyun.com/vip/capacity_purchase.html?from=web" tabindex="-1" target="_blank">购买容量</a></li>');
 if(!data.is_weixin_user) { __p.push('                    <li><a id="_main_pwd_locker" href="javascript:void(0)" tabindex="-1"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>');
 } __p.push('                    <li><a id="_main_https_config" href="javascript:void(0)" tabindex="-1" style="display: none;"><i></i>https模式<span class="menu-text">（未开启）</span></a></li>\r\n\
                    <!--<li><a id="_main_client_down" href="http://www.weiyun.com/download.html?WYTAG=weiyun.app.web.disk" target="_blank" tabindex="-1"><i class="icon-dwn"></i>下载客户端</a></li>-->\r\n\
                    <li><a id="_main_feedback" href="#" target="_blank" tabindex="-1">反馈</a></li>');
 if(!window.g_weiyun_info.is_appbox && !window.g_weiyun_info.is_qzone) { __p.push('                    <li><a id="_main_logout" href="#" tabindex="0"><i class="icon-exit"></i>退出</a></li>');
 } __p.push('                </ul>\r\n\
                <i class="ui-arr"></i>\r\n\
                <i class="ui-arr ui-tarr"></i>\r\n\
            </div>\r\n\
            <div class="header-search" style="display:none;">\r\n\
                <div class="beautiful-input">\r\n\
                    <i class="ico"></i>\r\n\
                    <label>搜索全部文件</label>\r\n\
                    <input type="text" autocomplete="off" maxlength="40" aria-label="输入文件名并按下回车进行搜索" tabindex="0"/>\r\n\
                    <a class="close" href="#" aria-label="关闭搜索界面" tabindex="0" hidefocus="on"></a>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
\r\n\
        <div id="_main_nav" class="lay-aside">\r\n\
	        <div data-action="upload" class="upload-btn">\r\n\
                <a id="upload-btn" class="g-btn g-btn-blue" href="#" hidefocus="on">\r\n\
                    <span class="btn-inner"><i>+</i><span class="text">上传</span></span>\r\n\
                </a>\r\n\
            </div>\r\n\
            <div class="aside-box" id="_main_nav_aside_box">\r\n\
                <div class="aside-wrap" id="_main_nav_aside_wrap">\r\n\
                    <ul class="nav-box">\r\n\
                        <li data-mod="disk" data-op="NAV_DISK" class="nav-list">\r\n\
                            <a class="link all" href="#" title="目录"><i></i>目录</a>\r\n\
                        </li>\r\n\
                        <li data-mod="recent" data-op="NAV_RECENT" class="nav-list">\r\n\
                            <a class="link recent" href="#" title="最近"><i></i>最近</a>\r\n\
                        </li>\r\n\
                        <li class="nav-gap"><span class="gap"></span></li>\r\n\
                        <li data-mod="doc" data-op="NAV_DOC" class="nav-list">\r\n\
                            <a class="link doc" href="#" title="文档"><i></i>文档</a>\r\n\
                        </li>\r\n\
                        <li data-mod="album" data-op="NAV_ALBUM" class="nav-list">\r\n\
                            <a class="link pic" href="#" title="图片"><i></i>图片</a>\r\n\
                        </li>\r\n\
                        <li data-mod="audio" data-op="NAV_AUDIO" class="nav-list">\r\n\
                            <a class="link voice" href="#" title="音乐"><i></i>音乐</a>\r\n\
                        </li>\r\n\
                        <li data-mod="video" data-op="NAV_VIDEO" class="nav-list">\r\n\
                            <a class="link video" href="#" title="视频"><i></i>视频</a>\r\n\
                        </li>');
 if(!data.is_weixin_user) { __p.push('                        <li data-mod="note" data-op="NAV_NOTE" class="nav-list">\r\n\
                            <a class="link note" href="#" title="笔记"><i></i>笔记</a>\r\n\
                        </li>');
 } __p.push('                        <li class="nav-gap"><span class="gap"></span></li>\r\n\
                        <li data-mod="clipboard" data-op="NAV_CLIPBOARD" class="nav-list">\r\n\
                            <a class="link clip" href="#" title="剪贴板"><i></i>剪贴板</a>\r\n\
                            <span data-id="clip-num" class="clip-num" style="display:none;"></span>\r\n\
                        </li>\r\n\
                        <li class="nav-gap"><span class="gap"></span></li>\r\n\
                        <li data-mod="share" data-op="NAV_SHARE" class="nav-list">\r\n\
                            <a class="link share" href="#" title="分享的链接"><i></i>分享的链接</a>\r\n\
                        </li>\r\n\
                        <li data-mod="recycle" data-op="NAV_RECYCLE" class="nav-list">\r\n\
                            <a class="link recycle" href="#" title="回收站"><i></i>回收站</a>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                    <div class="nav-split-bottom" id="_main_nav_split"></div>\r\n\
                </div>\r\n\
            </div>');
 if(!window.g_weiyun_info.is_appbox) { __p.push('            <div class="aside-ft">\r\n\
                <ul>\r\n\
                    <li class="item copyright">版权声明\r\n\
                        <!-- 气泡浮层 (如果需要更宽，请在bubble-box上赋宽度值) -->\r\n\
                        <div class="bubble-box trans-file-info-bubble">\r\n\
                            <div class="bubble-i">\r\n\
                                <p>您应尊重相关作品著作权人合法权益，未经著作权人 合法授权，不能违法上传、存储、分享他人作品。</p>\r\n\
                            </div>\r\n\
                            <b class="bubble-trig ui-trigbox ui-trigbox-bl">\r\n\
                                <b class="ui-trig"></b>\r\n\
                                <b class="ui-trig ui-trig-inner"></b>\r\n\
                            </b>\r\n\
                            <!-- <span class="bubble-close">×</span> -->\r\n\
                        </div>\r\n\
                        <!-- <div class="pop-box">\r\n\
                            <div class="cont">\r\n\
                                <p>您应尊重相关作品著作权人合法权益，未经著作权人 合法授权，不能违法上传、存储、分享他人作品。</p>\r\n\
                            </div>\r\n\
                            <b class="pop-bub bub-b">\r\n\
                                <b class="inner"></b>\r\n\
                            </b>\r\n\
                        </div> -->\r\n\
                    </li>\r\n\
                    <li class="item spliter"></li>\r\n\
                    <li class="item last"><a href="http://www.weiyun.com/complaint.html" target="_blank"> 投诉指引</a></li>\r\n\
                </ul>\r\n\
            </div>');
 } __p.push('            <b class="aside-beautiful"></b>\r\n\
        </div>\r\n\
\r\n\
\r\n\
        <div id="_main_top" class="lay-share-top" style="display:none">\r\n\
\r\n\
        </div>\r\n\
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
        <div id="_main_bar2" class="lay-main-head" >\r\n\
            <div id="_disk_file_path" class="inner">\r\n\
                <div class="wrap">\r\n\
                    <label id="_disk_all_checker" data-file-check class="checkall"></label>\r\n\
                    <div data-inner class="main-path"><a style="z-index:20;" class="path current" href="#" hidefocus="on">微云</a></div>\r\n\
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
        <div id="_main_content" class="lay-main-con" >\r\n\
            <div class="inner">\r\n\
                <div id="_main_box" class="wrap">\r\n\
                    <div id="_disk_body" class="disk-view ui-view ui-thumbview" style="display:none" data-label-for-aria="文件列表内容区域">\r\n\
                        <!-- 空目录时的提示 -->\r\n\
                        <div id="_disk_files_empty" class="g-empty sort-cloud-empty">\r\n\
                            <div class="empty-box">\r\n\
                                <div class="ico"></div>\r\n\
                                <p class="title">暂无文件</p>\r\n\
                                <p class="content">请点击左上角的“上传”按钮添加</p>\r\n\
                            </div>\r\n\
                        </div>\r\n\
\r\n\
                        <!-- 文件 -->\r\n\
                        <div class="files-view">\r\n\
                            <!-- 文件列表 -->\r\n\
                            <div id="_disk_files_file_list" class="files">\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
