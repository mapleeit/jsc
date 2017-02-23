//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/install_upload_plugin/install_upload_plugin.r160104",["lib","common","$","main"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//install_upload_plugin/src/install.js
//install_upload_plugin/src/ui.js
//install_upload_plugin/src/install.tmpl.html

//js file list:
//install_upload_plugin/src/install.js
//install_upload_plugin/src/ui.js
/**
 * 上传控件安装
 * @author yuyanghe
 * @date 13-7-26
 */
define.pack("./install",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        page_event = common.get('./global.global_event').namespace('page'),
	    constants = common.get('./constants'),
	    query_user = common.get('./query_user'),
        tmpl = require('./tmpl'),
        store = lib.get('./store'),
        plugin_detect = common.get('./util.plugin_detect.js'),
    //mac系统, safari 下不显示下载按钮
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        undefined;



    var install = new Module('install', {
        _ui: require('./ui'),
        _$start: null,
        _$success: null,
        _$fail: null,
        _$process: null,
        _$succ_check: null,
        _intervalId: 0,
        _tips: null,
        render: function () {
            var me = this;
	        //发现外网旧chrome控件会有上传文件len=0，导致用户侧丢失上传成功文件的问题，所以把控件禁掉
	        if(!constants.IS_APPBOX && $.browser.chrome) {
                return;
            }
            upload_event.on('install_plugin', function (title, from) {
                me._ui_init();

                if (plugin_detect.is_newest_version()) {
                    me.show(me._$succ_check);
                    return;
                }
                try {
                    $("#intall_start_title").text(title);
                    //oz上报 上报用户点击的哪个安装入口
                    if (title.indexOf('升级') > 0) {
                        $('#install_ui_start_title').text('控件升级提示');
                        $('#install_start_content').text('新控件包含以下功能：');
                        $('#install_ui_start_button').text('升级控件');
                    }
                    user_log(from);
                } catch (e) {

                }
                me.install();
            });

            //关闭按钮
            me.listenTo(this._ui, 'hide', function () {
                me.hide();
            });
            //安装流程
            me.listenTo(this._ui, 'install_process', function () {
                me.show(me._$process);
            });
            me.listenTo(this._ui, 'install_start', function () {
                me.show(me._$start);
            });
            me.listenTo(this._ui, 'install_check_success', function () {
                me.show(me._$check_success);
            });
            me.listenTo(this._ui, 'check_result', function () {
                //检测控件是否安装成功
                if (plugin_detect.is_newest_version()) {
                    me.show(me._$succ);
                } else {
                    me.show(me._$fail);
                }
            });
            me.listenTo(this._ui, 'reload', function () {
                if (!page_event.trigger('before_unload')) {
                    window.location.reload();
                }

            });

        },

        //控件安装浮层入口
        install: function () {
            this.show(this._$start);
        },

        show: function ($Item) {
            var me = this;
            this.hide();
            this._ui.show($Item);
            //如果进入自动检测页面开启轮询检测功能。
            if ($Item === this._$process) {
                this._intervalId = setInterval(function () {
                    me._check();
                }, 2000);
            }
            //控件进入安装成功页面后自动关闭 tips窗口。
            if ($Item === me._$succ) {
                if (me._tips) {
                    me._tips.hide();
                }
            }
        },

        hide: function () {
            //取消定时检测控件安装操作
            if (this._intervalId > 0) {
                try {
                    clearInterval(this._intervalId);
                    this._intervalId = 0;
                } catch (e) {

                }
            }
            this._ui.hide();
        },
        //检测是否安装成功
        _check: function () {
            var me = this;
            if (plugin_detect.is_newest_version()) {
                me.show(me._$succ);
            }
        },

        //控件安装tips界面
        tips: function () {
            var me = this;

	        //发现外网旧chrome控件会有上传文件len=0，导致用户侧丢失上传成功文件的问题，所以把控件禁掉
	        if(!constants.IS_APPBOX && $.browser.chrome) {
		        return;
	        }

            //非safari，window 显示插件安装
            if ( $.browser.safari || !gbIsWin ){
                return;
            }

            //用户已安装最新版本控件
            if (plugin_detect.is_newest_version()) {
                return;
            }

            //判断当前控件的安装情况
            var upload_plugin_version = me._check_upload_plugin_version();

            //用户重未安装过控件，则显示_tips界面
            if (upload_plugin_version < 1) {

                // 已关闭过tips窗口，退出
                if (store.get('tips_close'))
                    return;

                // 初始化tips
                me._tips = $(tmpl.install_tips()).appendTo(document.body);
                if($.browser.msie){
                    me._tips.addClass('plugin-pop-ie');
                }
                //绑定开始安装界面按钮  点击关闭后 利用cookie记录关闭操作，再次访问时不再提示tip按钮
                $('#tips_close').on('click', function () {
                    me._tips.hide();
                    store.set('tips_close', 1);
                    return false;
                });
                $('#tips_install').on('click', function () {
                    user_log('PLUGIN_TIPS_INSTALL');
                });
            }
        },

        //窗口初始化
        _ui_init: function () {

            if(this._inited) {
                return;
            }
            var $ct = $('<div id="_upload_plugin_install_ct"></div>').appendTo(document.body);
            this._$start = $(tmpl.install_start()).appendTo($ct).hide();
            //判断是否支持上传文件夹功能 IE支持  其他不支持
            if ($.browser.msie) {
                $('#install_ui_start_ul [data-id=folder-feature]').show();
            }
            this._$fail = $(tmpl.install_fail()).hide().appendTo($ct);
            this._$process = $(tmpl.install_process()).hide().appendTo($ct);
            this._$check_success = $(tmpl.install_check_success()).hide().appendTo($ct);
            this._$succ =  $(tmpl.install_succ()).hide().appendTo($ct);
            this._$succ_check = $(tmpl.install_succ_check()).hide().appendTo($ct);
            this._ui.render();

            this._inited = true;
        },


        //WEBKIT浏览器，判断是否安装过了上传控件
        _detect_has_install: function () {
            var nps = navigator.plugins,
                ret;
            try {
                nps.refresh(false);//刷新控件表，不刷新页面
            } catch (e) {

            }
            $.each(nps || [], function (i, plugin) {//从控件列表中查找上传控件是否已经存在
                if (plugin.name.indexOf('Tencent FTN plug-in') > -1) {
                    $.each(plugin, function (j, item) {
                        if (item.type === 'application/txftn-webkit') {
                            ret = true;
                            return false;//break
                        }
                    });
                    if (ret === true) {
                        return false;
                    }
                }
            });
            return ret;
        },
        // 返回值 0  代表没有安装控件  大于1代表安装过控件
        _check_upload_plugin_version: function () {
            var me = this;
            if ($.browser.msie) {
                try {
                    var aa = new ActiveXObject("TXWYFTNActiveX.FTNUpload");
                    return 2;
                } catch (e) {
                    try {
                        var bb = new ActiveXObject("TXFTNActiveX.FTNUpload");
                        return 1;
                    } catch (e) {
                        return 0;
                    }
                }
            } else {
                if (me._detect_has_install()) {
                    return 2;
                }else{
                    return 0;
                }
            }
        }

    });
    install.render();

    return install;
});/**
 * 上传控件安装UI
 * @author yuyanghe
 * @date 13-7-26
 */
define.pack("./ui",["lib","common","$","./tmpl","./install","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
	    constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),

        main_ui,

        install=require('./install'),

        undefined;

    var ui = new Module('install_ui', {

        render: function () {
            var me=this;
            if(!constants.IS_APPBOX && $.browser.chrome) {
                return;
            }
            //绑定浮层的关闭按钮
            $('#_upload_plugin_install_ct [data-id=close]').on('click',function(){
                me.trigger('hide');
                upload_event.trigger('upload_dialog_show');
                return false;
            });
            //安装成功界面确定按钮
            $('#install_success_ok').on('click',function(){
                me.trigger('hide');
                upload_event.trigger('upload_dialog_show');
                return false;
            });
            //安装成功界面 关闭按钮事件绑定

//            $('#install_succ_close').off('click');
//            $('#install_succ_close').on('click',function(){
//                    me.trigger('hide');
//                    upload_event.trigger('upload_dialog_show');
//                    //刷新页面
//                    me.trigger('reload');
//                    return false;
//            });

            $('#install_succ_ok').on('click',function(){
                me.trigger('hide');
                return false;
            });

            //绑定开始安装界面按钮
            $('#install_ui_start').on('click',function(){
                //OZ上报
                user_log('PLUGIN_POP_PANEL_INSTALL');
                me.trigger('install_process');
            })

            //绑定安装过程界面事件绑定按钮
            //点击此处重新安装
            var $_process_ok=$('#install_ui_process_ok');
            //再次安装按钮
//            $('#install_ui_process_restart').on('click',function(){
//                user_log('PLUGIN_POP_PANEL_REINSTALL');
//                me.trigger('install_start');
//                return false;
//            });

            //我已安装成功按钮
            $_process_ok.on('click',function(){
                user_log('PLUGIN_POP_PANEL_SUCCESS');
                me.trigger('install_check_success');
                setTimeout(function(){
                    me.trigger('check_result')
                }, 1500);
                return false;
            });
            //下载失败界面操作
            //确认按钮
            $('#install_fail_download').on('click',function(){
                user_log('PLUGIN_POP_PANEL_FAIL_REINSTALL');
                me.trigger('install_process');
            });

        },
        /*  安装浮窗显示
         *  @params 浮动窗口的对象
         */
        show: function ($Item) {
            this._$el=$Item;
            this._$el.stop(false, true).fadeIn('fast');
            center.listen(this._$el);
            main_ui = require('main').get('./ui');

            if (main_ui && main_ui.is_visible && main_ui.is_visible()) {
                widgets.mask.show('upload_install', this._$el, true);
            }
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });
                widgets.mask.hide('upload_install', this._$el, true);
                this._$el=null;
            }
            return false;
        }

    });

    return ui;
});





//tmpl file list:
//install_upload_plugin/src/install.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'install_start': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-no-selection data-id="plugin_install_widget" class="full-pop full-pop-medium" style="z-index:10003">\r\n\
        <h3 class="full-pop-header"><div class="inner">安装控件提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug">\r\n\
\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title" id="intall_start_title">您还未安装微云极速上传控件</h3>\r\n\
                </div>\r\n\
                <div class="content">\r\n\
                    <h4>安装后您可以使用以下功能：</h4>\r\n\
                    <ul>\r\n\
                        <li>断点续传</li>\r\n\
                        <li>大文件秒传</li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
                <div class="img"></div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn clearfix">\r\n\
            <a class="g-btn g-btn-blue" href="http://www.weiyun.com/plugin_install.html" id="install_ui_start" target="_blank"><span class="btn-inner">安装控件</span></a>\r\n\
        </div>\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'install_process': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" class="full-pop full-pop-medium  plugin-box-uncheck"  style="z-index:10003" data-no-selection="">\r\n\
        <h3 class="full-pop-header"><div class="inner">安装控件提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug mod-plug-start">\r\n\
\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">请在新页面完成控件安装。</h3>\r\n\
                </div>\r\n\
                <div class="content">\r\n\
                    <p></p>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn clearfix">\r\n\
            <a href="#" class="g-btn g-btn-gray" id="install_ui_process_ok"><span class="btn-inner">已安装成功</span></a>\r\n\
            <a href="http://www.weiyun.com/plugin_install.html" target="_blank" class="g-btn g-btn-blue"  id="install_ui_process_restart">\r\n\
                <span class="btn-inner">重新安装</span></a>\r\n\
        </div>\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'install_check_success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" class="full-pop full-pop-medium plugin-box-checking"  style="z-index:10003" data-no-selection="">\r\n\
        <h3 class="full-pop-header"><div class="inner">安装控件提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug mod-plug-start mod-plug-loading">\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">正在检测控件是否安装成功．．．</h3>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn">\r\n\
            <a class="g-btn g-btn-gray g-btn-visibilityhide" href="#"><span class="btn-inner">确定</span></a>\r\n\
        </div>\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'install_fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div  data-id="plugin_install_widget" class="full-pop full-pop-medium plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <h3 class="full-pop-header"><div class="inner">安装控件提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug mod-plug-start mod-plug-err">\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">系统检测到您的控件尚未安装成功</h3>\r\n\
                </div>\r\n\
                <div class="content">\r\n\
                    <p>请重新安装控件，或重启浏览器。</p>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn clearfix">\r\n\
            <a href="#" class="g-btn g-btn-blue" id="install_fail_download"><span class="btn-inner">重新安装</span></a>\r\n\
        </div>\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'install_succ': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" class="full-pop full-pop-medium plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <h3 class="full-pop-header"><div class="inner">安装控件提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug mod-plug-start mod-plug-success">\r\n\
\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">微云极速上传控件安装成功</h3>\r\n\
                </div>\r\n\
                <div class="content">\r\n\
                    <p>请刷新或重启浏览器，以享受极速上传。</p>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn clearfix">\r\n\
            <a href="#" class="g-btn g-btn-blue" id="install_success_ok"><span class="btn-inner">确定</span></a>\r\n\
        </div>\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'install_tips': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" style="left: 70px;top: 110px;z-index: 1003;position: absolute;">\r\n\
        <div class="g-bubble">\r\n\
            <div class="plug-tip">\r\n\
                <h3>安装微云极速上传控件！</h3>\r\n\
                <p>支持文件秒传以及断点续传</p>\r\n\
                <div class="btn">\r\n\
                    <a class="g-btn g-btn-blue" href="http://www.weiyun.com/plugin_install.html?from=ad" id="tips_install" target="_blank"><span class="btn-inner">安装控件</span></a>\r\n\
                </div>\r\n\
                <i class="img"></i>\r\n\
                <a id="tips_close" class="close" href="#">×</a>\r\n\
            </div>\r\n\
        </div>\r\n\
        <span class="g-arrow g-arrow-top" style="margin-left:0;left:63px;"><span class="sub"></span></span>\r\n\
    </div>');

return __p.join("");
},

'install_succ_check': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" class="full-pop full-pop-medium plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <h3 class="full-pop-header"><div class="inner">提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-plug mod-plug-start">\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">最新版本的控件已成功安装</h3>\r\n\
                </div>\r\n\
                <div class="content">\r\n\
                    <p>请刷新本页面以启用增强的上传功能。</p>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn clearfix">\r\n\
            <a href="#" class="g-btn g-btn-blue" id="install_succ_ok"><span class="btn-inner">确定</span></a>\r\n\
        </div>\r\n\
\r\n\
        <a data-id="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
