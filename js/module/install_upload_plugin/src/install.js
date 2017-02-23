/**
 * 上传控件安装
 * @author yuyanghe
 * @date 13-7-26
 */
define(function (require, exports, module) {
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
});