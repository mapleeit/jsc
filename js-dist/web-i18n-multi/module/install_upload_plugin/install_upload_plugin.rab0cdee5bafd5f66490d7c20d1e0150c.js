//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/install_upload_plugin/install_upload_plugin.rab0cdee5bafd5f66490d7c20d1e0150c",["lib","common","$","main"],function(require,exports,module){

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
            this._$start = $(tmpl.install_start()).appendTo(document.body).hide();
            //判断是否支持上传文件夹功能 IE支持  其他不支持
            if ($.browser.msie) {
                $('#install_ui_start_ul [data-id=folder-feature]').show();
            }
            this._$fail = $(tmpl.install_fail()).hide().appendTo(document.body);
            this._$process = $(tmpl.install_process()).hide().appendTo(document.body);
            this._$check_success = $(tmpl.install_check_success()).hide().appendTo(document.body);
            this._$succ =  $(tmpl.install_succ()).hide().appendTo(document.body);
            this._$succ_check = $(tmpl.install_succ_check()).hide().appendTo(document.body);
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
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),

        main_ui,

        install=require('./install'),

        undefined;

    var ui = new Module('install_ui', {

        render: function () {
            var me=this;
            //绑定浮层的关闭按钮
            $('[data-id=plugin_install_widget] .box-close').on('click',function(){
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
                widgets.mask.show('upload_install');
            }
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });
                widgets.mask.hide('upload_install');
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
__p.push('    <div  data-id="plugin_install_widget" class="box plugin-box" style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title" id="install_ui_start_title">安装控件提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
\r\n\
                <div class="plugin-cnt plugin-tips plugin-ad">\r\n\
\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-warn"></i><span class="ui-text" id="intall_start_title"\r\n\
                            >请安装极速上传控件，以启用“极速上传”。</span></h3>\r\n\
                    <!-- todo 代码调整 -->\r\n\
                    <div class="ui-list-desc">\r\n\
\r\n\
                        <p class="ui-text ui-main-text" id="install_start_content">“极速上传”拥有以下增强型功能：</p>\r\n\
\r\n\
                        <ul id=\'install_ui_start_ul\'>\r\n\
                            <li><i class="icon-dot"></i>大文件秒传</li>\r\n\
                            <li><i class="icon-dot"></i>断点续传</li>\r\n\
                            <li data-id="folder-feature" style="display:none;"><i class="icon-dot"></i>上传文件夹</li>\r\n\
                            <li><i class="icon-dot"></i>32G超大文件上传</li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns">\r\n\
                    <a href="http://www.weiyun.com/plugin_install.html" id=\'install_ui_start\' target="_blank" class="box-pill">\r\n\
                        <span class="box-btn-text"  id="install_ui_start_button">安装控件</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- .box-foot -->\r\n\
        </div>\r\n\
        <a class="box-close" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_process': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-id="plugin_install_widget" class="box plugin-box  plugin-box-uncheck"  style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">安装控件提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
\r\n\
                <div class="plugin-cnt plugin-tips plugin-error">\r\n\
\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-warn"></i><span\r\n\
                            class="ui-text">请在新页面完成控件安装。</span></h3>\r\n\
\r\n\
\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns">\r\n\
                    <a href="#" class="box-pill box-pill-normal" id="install_ui_process_ok"><span class="box-btn-text">已安装成功</span></a>\r\n\
                    <a href="http://www.weiyun.com/plugin_install.html" target="_blank" class="box-pill box-pill-normal"  id="install_ui_process_restart">\r\n\
                        <span class="box-btn-text">重新安装</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- .box-foot -->\r\n\
\r\n\
        </div>\r\n\
        <a class="box-close" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_check_success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="box plugin-box plugin-box-checking"  style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">安装控件提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
\r\n\
                <div class="plugin-cnt plugin-tips plugin-checking">\r\n\
\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-loading"></i><span class="ui-text">正在检测控件是否安装成功．．．</span>\r\n\
                    </h3>\r\n\
\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
\r\n\
        </div>\r\n\
        <a class="box-close" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="box plugin-box plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">安装控件提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
\r\n\
                <div class="plugin-cnt plugin-tips plugin-error">\r\n\
\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-warn"></i><span\r\n\
                            class="ui-text">系统检测到您的控件尚未安装成功。</span></h3>\r\n\
\r\n\
                    <p class="ui-text ui-main-text">请重新安装控件，或重启浏览器。</p>\r\n\
\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns">\r\n\
                    <a href="http://www.weiyun.com/plugin_install.html" target="_blank" class="box-pill box-pill-normal" id="install_fail_download">\r\n\
                        <span class="box-btn-text">重新安装</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- .box-foot -->\r\n\
\r\n\
        </div>\r\n\
        <a class="box-close" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_succ': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="box plugin-box plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">安装控件提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
                <div class="plugin-cnt plugin-tips plugin-ok">\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-ok"></i><span class="ui-text">微云极速上传控件安装成功</span></h3>\r\n\
                    <p class="ui-text ui-main-text">请刷新或重启浏览器，以享受极速上传。</p>\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns">\r\n\
                    <a href="#" class="box-pill box-pill-normal" id="install_success_ok">\r\n\
                        <span class="box-btn-text">确定</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <a class="box-close" href="#" id="install_succ_close"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_tips': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="box plugin-pop" style="z-index:997;top:120px;left:100px" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <i class="ui-bg"></i>\r\n\
            <!-- .box-inner -->\r\n\
            <div class="box-btns">\r\n\
                <a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank" class="box-pill" id="tips_install">\r\n\
                    <span class="box-btn-text">安装控件</span></a>\r\n\
            </div>\r\n\
            <!-- .box-foot -->\r\n\
            <i class="ui-arr"></i>\r\n\
        </div>\r\n\
        <!-- .box-body -->\r\n\
                <a class="box-close" id="tips_close" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
},

'install_succ_check': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="box plugin-box plugin-box-checked"  style="z-index:10003" data-no-selection="">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">提示</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
            <!-- .box-head -->\r\n\
\r\n\
            <div class="box-body">\r\n\
                <div class="plugin-cnt plugin-tips plugin-ok">\r\n\
                    <h3 class="ui-title"><i class="plugin-icon plugin-icon-ok"></i><span class="ui-text">最新版本的控件已成功安装。</span></h3>\r\n\
                    <p class="ui-text ui-main-text">\r\n\
                        请刷新本页面以启用增强的上传功能</p>\r\n\
                </div>\r\n\
                <!-- .plugin-cnt -->\r\n\
            </div>\r\n\
            <!-- .box-body -->\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns">\r\n\
                    <a href="#" class="box-pill box-pill-normal" id="install_succ_ok">\r\n\
                        <span class="box-btn-text">确定</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
        </div>\r\n\
        <a class="box-close" href="#"><span class="hidden-text">×</span></a>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
