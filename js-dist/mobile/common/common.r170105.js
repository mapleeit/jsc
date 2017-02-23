//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/common/common.r170105",["$","lib"],function(require,exports,module){

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
//common/src/app_api.js
//common/src/cgi_ret_report.js
//common/src/configs/logic_error_code.js
//common/src/configs/ops.js
//common/src/configs/pay_params.js
//common/src/configs/speed_config.js
//common/src/constants.js
//common/src/global/global_event.js
//common/src/huatuo_speed.js
//common/src/m_speed.js
//common/src/pb_cmds.js
//common/src/polyfill/rAF.js
//common/src/report_md.js
//common/src/request.js
//common/src/ret_msgs.js
//common/src/ui/widgets.js
//common/src/urls.js
//common/src/user.js
//common/src/user_log.js
//common/src/util/browser.js
//common/src/util/https_tool.js
//common/src/util/logger.js
//common/src/ui/widgets.tmpl.html

//js file list:
//common/src/app_api.js
//common/src/cgi_ret_report.js
//common/src/configs/logic_error_code.js
//common/src/configs/ops.js
//common/src/configs/pay_params.js
//common/src/configs/speed_config.js
//common/src/constants.js
//common/src/global/global_event.js
//common/src/huatuo_speed.js
//common/src/m_speed.js
//common/src/pb_cmds.js
//common/src/polyfill/rAF.js
//common/src/report_md.js
//common/src/request.js
//common/src/ret_msgs.js
//common/src/ui/widgets.js
//common/src/urls.js
//common/src/user.js
//common/src/user_log.js
//common/src/util/browser.js
//common/src/util/https_tool.js
//common/src/util/logger.js
/**
 * 判断是否安装了微云app
 * @author xixinhuang
 * @date 2015-11-09
 */
define.pack("./app_api",["$","lib","./util.browser","./constants","./util.logger"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        browser = require('./util.browser'),
        constants = require('./constants'),
        logger = require('./util.logger'),
        Module = lib.get('./Module'),
        jsBridgeDefer;

    var jsApiDefault = {
        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            jsBridgeDefer.reject();

            return jsBridgeDefer;
        },
        /*
         设置分享数据，注意图片不能太大，否则可能打不开微信，建议120*120
         shareData : {title desc url image image_width image_height}
         */
        setShare: function(shareData){
            //alert('jsApiDefault');
        },
        /*
         打开分享浮层，注意图片不能太大，否则可能打不开微信，建议120*120
         openShareBar : {title desc url image image_width image_height}
         */
        openShareBar: function(shareData){

        },

        isAppInstalled: function(cfg, callback){
            this.launchApp(cfg, callback);
        },
        launchApp: function(cfg, callback){
            if(!cfg){
                callback(false);
                return;
            }

            var packageUrl = cfg[this.opts.os] && cfg[this.opts.os].packageUrl;
            if(!packageUrl){
                callback(false);
                return;
            }

            // 创建iframe，呼起app schema
            var startTime = +new Date(); //标记呼起时间点
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = '<iframe id="schema" src="' + packageUrl + '" scrolling="no" width="0" height="0"></iframe>';
            document.body.appendChild(div);
            //div.getElementsByTagName('iframe')[0].onload = function() {
            //    alert('onload');
            //}
            //div.getElementsByTagName('iframe')[0].onerror = function() {
            //    alert('onerror');
            //}
            //alert('packageUrl' + packageUrl);
            // 如果成功呼起，setTimeout不会立即执行
            setTimeout(function () {
                document.body.removeChild(div);
                //如果是IOS系统，直接callback(false);
                //if(browser.IOS){
                //    callback(false)
                //}

                // 如果没有呼起，或者呼起后，用户主动返回，还是有可能走进这个逻辑
                var delta = +new Date() - startTime;  // 然后判断回来的时间戳
                if (delta < 1000) {  // 如果不是我们规定的800ms，差太多，就认为是用户手动返回的,但这里就不返回了
                    //callback(false);
                } else {
                    callback(true);
                }
            }, 800);
        }
    };

    var jsApiQzone = {
        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.QZAppExternal){
                jsBridgeDefer.resolve();
            }else{
                require.async(constants.HTTP_PROTOCOL + '//qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js?_bid=339',function(){
                    if(window.QZAppExternal){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },
        init: function(callback) {
            var me = this;
            this.loadJsBridge().done(function() {
                if(window.QZAppExternal) {
                    me.trigger('init_success');
                    callback && callback();
                } else {
                    me.trigger('init_fail');
                }
            });
        },
        setShare: function(shareData) {
            this.loadJsBridge().done(function(){
                try{
                    if(shareData){
                        var title = shareData.desc2title ? shareData.desc : shareData.title;
                        // alert('QZAppExternal.setShare '+JSON.stringify(shareData));
                        window.QZAppExternal.setShare(function(d){
                            // alert('QZAppExternal.setShare return '+JSON.stringify(d));
                        },{
                            'type' : "share",
                            'image':[shareData.image,shareData.image,shareData.image,shareData.image,shareData.image],//分别为默认文案、QQ空间、手机QQ、微信、微信朋友圈
                            'title':[shareData.title,shareData.title,shareData.title,shareData.title,title],
                            'summary':[shareData.desc,shareData.desc,shareData.desc,shareData.desc,shareData.desc],
                            'shareURL':[shareData.url,shareData.url,shareData.url,shareData.url,shareData.url]
                        });
                    }
                }catch(err){
                    // alert('setShare err '+err);
                }
            });
        },
        isAppInstalled: function(cfg, callback){
            if(!cfg){
                callback(false);
                return;
            }
            var value = null;
            if (this.opts.os == 'ios') {
                value = cfg.ios && cfg.ios.packageUrl;
            } else if (this.opts.os == 'android') {
                value = cfg.android && cfg.android.packageName;
            }
            if(!value){
                callback(false);
                return;
            }
            this.loadJsBridge().done(function(){
                try{
                    // alert('QZAppExternal.isAppInstall '+value);
                    window.QZAppExternal.isAppInstall(value, function(d){
                        // alert('QZAppExternal.isAppInstall return '+JSON.stringify(d));
                        if(d.code==0){
                            callback(d.data.ret===true||d.data.ret==="true");
                        }else{
                            callback(false);
                        }
                    });
                }catch(err){
                    // alert('QZAppExternal.isAppInstall err '+err);
                    callback(false);
                }
            });
        },
        getAppVersion: function(cfg, callback) {
            if(!cfg || this.opts.os == 'ios'){
                callback(false);
                return;
            }
            var value = cfg.android && cfg.android.packageName;
            if(!value){
                callback(false);
                return;
            }
            this.loadJsBridge().done(function(){
                //try{
                    //mqq.app.checkAppInstalled(value, function(d){
                    //    alert('mqq.app.checkAppInstalled return '+JSON.stringify(d));
                    //    callback(d);
                    //});
                //}catch(err){
                    //alert('mqq.app.checkAppInstalled err '+err);
                    //callback(false);
                //}
                //mqq目前不可用，暂时先屏蔽，直接返回false
                callback(false);
            });
        }
    };

    var jsApiQQ = {
        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.mqq){
                jsBridgeDefer.resolve();
            }else{
                require.async(constants.HTTP_PROTOCOL + '//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',function(){
                    if(window.mqq){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },
        init: function(callback) {
            var me = this;
            this.loadJsBridge().done(function() {
                if(!mqq) {
                    me.trigger('init_fail');
                    return;
                }
                mqq.invoke("ui","setWebViewBehavior",{
                    "historyBack":"true",//true按返回时后退页面，false按返回时退出
                    "bottomBar":"false"//隐藏
                });
                mqq.ui.pageVisibility(function(r){
                    //alert("visible ?", r);
                });
                me.trigger('init_success');
                callback && callback();
            });
        },
        setShare: function(cfg) {
            this.loadJsBridge().done(function(){
                try{
                    var data = {
                        "share_url": cfg.url,
                        "title": cfg.title,
                        "desc": cfg.desc,
                        "image_url": cfg.image
                    };
                    //alert(JSON.stringify(data));
                    mqq.data.setShareInfo(data);
                }catch(err){
                    //console.log('setShare err '+err);
                }
            });
        },
        showShareMenu: function() {
            this.loadJsBridge().done(function(){
                try{
                    mqq.ui.showShareMenu();
                }catch(err){
                    //console.log('setShare err '+err);
                }
            });
        },
        previewImage: function(cfg) {
            var cur_url = cfg.cur_idx || 0,
                src_id = cfg.src_id || 0,
                is_not_show_index = cfg.is_show_index || false;

            mqq.media.showPicture({
                imageIDs : cfg.urls,
                index : cur_url,
                srcID : src_id,
                isNotShowIndex : is_not_show_index
            });
        },
        isAppInstalled: function(cfg, callback){
            if(!cfg){
                callback(false);
                return;
            }
            var value = null;
            if (this.opts.os == 'ios') {
                //这个可以了
                value = cfg.ios && cfg.ios.scheme;
            } else if (this.opts.os == 'android') {
                value = cfg.android && cfg.android.packageName;
            }
            if(!value){
                callback(false);
                return;
            }

            this.loadJsBridge().done(function(){
                try{
                    //alert('mqq.app.isAppInstalled '+value);
                    mqq.app.isAppInstalled(value, function(d){
                        //alert('mqq.app.isAppInstalled return '+JSON.stringify(d));
                        callback(d);
                    });
                }catch(err){
                    //alert('mqq.app.isAppInstalled err '+err);
                    callback(false);
                }
            });
        },
        launchWyApp: function (cfg, callback) {
            if (!cfg) {
                callback(false);
                return;
            }

            var value = null;
            if (this.opts.os == 'ios') {
                //这个可以了
                value = cfg.ios && cfg.ios.packageUrl;
            } else if (this.opts.os == 'android') {
                value = cfg.android && cfg.android.packageName;
            }
            if(!value){
                callback(false);
                return;
            }

            //packageUrl = "mqzonev2://arouse/activefeed?source=qq&version=1";

            // 创建iframe，呼起app schema
            var startTime = +new Date(); //标记呼起时间点
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = '<iframe id="schema" src="' + value + '" scrolling="no" width="0" height="0"></iframe>';
            document.body.appendChild(div);
            // 如果成功呼起，setTimeout不会立即执行
            setTimeout(function () {
                document.body.removeChild(div);
                // 如果没有呼起，或者呼起后，用户主动返回，还是有可能走进这个逻辑
                var delta = +new Date() - startTime;  // 然后判断回来的时间戳

                if (delta < 1000) {  // 如果不是我们规定的800ms，差太多，就认为是用户手动返回的
                    callback(false);
                } else {
                    callback(true);
                }
            }, 800);
        },

        getAppVersion: function(cfg, callback) {
            if(!cfg || this.opts.os == 'ios'){
                callback(false);
                return;
            }
            var value = cfg.android && cfg.android.packageName;
            if(!value){
                callback(false);
                return;
            }
            this.loadJsBridge().done(function(){
                try{
                    //alert('mqq.app.isAppInstalled '+value);
                    mqq.app.checkAppInstalled(value, function(d){
                        //alert('mqq.app.isAppInstalled return '+JSON.stringify(d));
                        callback(d);
                    });
                }catch(err){
                    //alert('mqq.app.isAppInstalled err '+err);
                    callback(false);
                }
            });
        },

	    createDownload: function(cfg, callback) {
		    if (!cfg || (typeof mqq === 'undefined')) {
			    return false;
		    } else {
			    if(typeof window.createDownloadCallback === 'undefined') {
				    window.createDownloadCallback = function(result) {
					    if(result && result.data && result.data.ret === 0 && result.data.jobid) {
						    callback(result.data.jobid);
					    } else {
						    callback(false);
					    }
				    };
			    }
			    mqq.invoke('Weiyun', 'createDownload', cfg);
			    return true;
		    }
	    },

	    checkDownload: function(jobid, callback) {
		    if(typeof window.checkDownloadCallback === 'undefined') {
			    window.checkDownloadCallback = function(result) {
				    alert('checkDownloadCallback success, arguments: ' + JSON.stringify(result.data));
				    if(result.data.status === 2) {
					    callback(result.data.path);
				    } else {
					    callback(false);
				    }
			    };
		    }
		    mqq.invoke('Weiyun', 'checkDownload', { jobid: jobid });
	    }
    };

    var jsApiWX = {
        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            var _succ = function(){
                jsBridgeDefer.resolve();
            };
            if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
                jsBridgeDefer.resolve();
            } else {
                if (document.addEventListener) {
                    document.addEventListener("WeixinJSBridgeReady", _succ, false);
                } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", _succ);
                    document.attachEvent("onWeixinJSBridgeReady", _succ);
                }
            }

            return jsBridgeDefer;
        },
        loadWXSig: function(){
            var defer = $.Deferred();
            if(typeof wx == undefined){
                defer.reject();
                return;
            }
            var req_url,
                url;
            if(location.href.indexOf('#') > -1) {
                url = location.href.slice(0, location.href.indexOf('#'));
            } else {
                url = location.href;
            }
            req_url = constants.HTTP_PROTOCOL + '//' + location.hostname + '/proxy/domain/web2.cgi.weiyun.com/wx_oa_signature.fcg?url=' + encodeURIComponent(url);
            if(location.hostname == 'hzp.qq.com') {
                req_url = 'http://web2.cgi.weiyun.com/wx_oa_signature.fcg?url=' + encodeURIComponent(url);
            }
            $.ajax({
                url: req_url,
                dataType : 'jsonp'
            }).done(function(res) {
                if (res.retcode === 0) {
                    defer.resolve(res);
                } else {
                    defer.reject();
                }
            }).fail(function() {
                defer.reject();
            });

            return defer;
        },
        init: function(cfg, callback) {
            var me = this;
            this.loadWXSig().done(function(res) {
                wx.config({
                    debug: false,
                    beta: true,
                    appId: res.appid,
                    timestamp: res.timestamp,
                    nonceStr: res.nonceStr,
                    signature: res.signature,
                    jsApiList: cfg.jsApiList
                });
                var me = this;
                wx.ready(function() {
                    wx.hideMenuItems({
                        menuList: cfg.hideMenuItems, // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        success: function (res) {
                            //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                        },
                        fail: function (res) {
                            //logger.report('weixin_mp', res);
                            //alert(JSON.stringify(res));
                        }
                    });
                    callback && callback();
                });
                wx.error(function(err) {
                    //alert(JSON.stringify(err));
                });
                me.trigger('init_success');
            }).fail(function() {
                me.trigger('init_fail');
            });
        },
        setShare: function(cfg) {
            var me = this;
            this.loadJsBridge().done(function(){
                try{
                    wx.onMenuShareAppMessage({
                        title: cfg.title || '我用微云分享',
                        desc:  cfg.desc,
                        link: cfg.url,
                        imgUrl: cfg.image,
                        trigger: function (res) {
                        },
                        success: function (res) {
                            me.trigger('share_success');
                            //alert('已分享');
                        },
                        cancel: function (res) {
                            me.trigger('share_cancel');
                            //alert('已取消');
                        },
                        fail: function (res) {
                            me.trigger('share_fail');
                            //alert('分享失败');
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: cfg.desc,
                        desc: '',
                        link: cfg.url,
                        imgUrl: cfg.image,
                        trigger: function (res) {
                        },
                        success: function (res) {
                            me.trigger('share_success');
                            //alert('已分享');
                        },
                        cancel: function (res) {
                            me.trigger('share_cancel');
                            //alert('已取消');
                        },
                        fail: function (res) {
                            me.trigger('share_fail');
                            //alert('分享失败');
                        }
                    });
                    wx.onMenuShareQQ({
                        title: cfg.title || '我用微云分享',
                        desc: cfg.desc,
                        link: cfg.url,
                        imgUrl: cfg.image,
                        trigger: function (res) {
                        },
                        success: function (res) {
                            me.trigger('share_success');
                            //alert('已分享');
                        },
                        cancel: function (res) {
                            me.trigger('share_cancel');
                            //alert('已取消');
                        },
                        fail: function (res) {
                            me.trigger('share_fail');
                            //alert('分享失败');
                        }
                    });
                    wx.onMenuShareQZone({
                        title: cfg.title || '我用微云分享',
                        desc: cfg.desc,
                        link:  cfg.url,
                        imgUrl: cfg.image,
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        },
                        fail: function (res) {
                            me.trigger('share_fail');
                        }
                        });
                }catch(err){
                    //alert('wx share' + err);
                }
            });

        },
        isAppInstalled: function(cfg, callback){
            if(!cfg){
                callback(false);
                return;
            }
            var valid = false;
            if (this.opts.os == 'ios') {
                valid = cfg.ios && cfg.ios.packageUrl;
            } else if (this.opts.os == 'android') {
                valid = cfg.android && cfg.android.packageName;
            }

            if(!valid){
                callback(false);
                return;
            }
            this.loadJsBridge().done(function(){
                try{
                    //alert('WeixinJSBridge.invoke getInstallState '+(cfg.ios && cfg.ios.packageUrl)+' '+(cfg.android && cfg.android.packageName));
                    WeixinJSBridge.invoke("getInstallState", {
                        'packageUrl': cfg.ios && cfg.ios.packageUrl,            //IOS协议，xxxx:// 开头的一个scheme
                        'packageName': cfg.android && cfg.android.packageName   //Android软件包名
                    }, function (e) {
                        //alert('WeixinJSBridge.invoke getInstallState return '+JSON.stringify(e));
                        if (e && e.err_msg && e.err_msg.indexOf("get_install_state:yes") >= 0) {
                            callback(e.err_msg);
                        } else {
                            callback(false);
                        }
                    });
                }catch(err){
                    //alert('WeixinJSBridge.invoke getInstallState err '+err);
                    callback(false);
                }
            });
        },
        launchWyApp: function (cfg, callback) {
            if (!cfg || (typeof wx === 'undefined')) {
                callback(false);
                return;
            }

            wx.invoke('launch3rdApp', {
                'appID': cfg.appid, // 公众号appID
                'messageExt': cfg.ios['packageUrl']
            }, function (res) {
                callback(res);
            });
        },
        previewImage: function(obj) {
            if(!obj.urls || obj.urls.length === 0 || !wx){
                return;
            }
            wx.previewImage({
                current: obj.cur_url, // 当前显示的图片链接
                urls: obj.urls // 需要预览的图片链接列表
            });
        }
    };

    var jsApiQQBrowser = {
        loadJsBridge: function() {
            jsBridgeDefer = $.Deferred();
            require.async(constants.HTTP_PROTOCOL + '//jsapi.qq.com/get?api=app.isInstallApk,app.runApk', function() {
                if(window.browser && window.browser.app) {
                    jsBridgeDefer.resolve();
                } else {
                    jsBridgeDefer.reject();
                }
            });
            return jsBridgeDefer;
        },
        isAppInstalled: function(cfg, callback) {
            var obj = {};
            if (this.opts.os == 'ios') {
                obj = {
                    apkKey: cfg.ios && cfg.ios.scheme
                };
            } else if (this.opts.os == 'android') {
                obj = {
                    packagename: cfg.android && cfg.android.packageName
                };
            }
            if(window.browser && window.browser.app && window.browser.app.isInstallApk) {
                window.browser.app.isInstallApk(function(ret) {
                    callback(ret);
                }, obj);
            } else {
                this.loadJsBridge().done(function() {
                    window.browser.app.isInstallApk(function(ret) {
                        callback(ret);
                    }, obj);
                }).fail(function() {
                    callback(false);
                });
            }
        }
    };

    var MOD = new Module('app_api', {
        init : function(){
            //opts = opts || {};
            //if(opts.env == 'browser' && ua && ua.isQQBrowser()) {//qq浏览器支持判断是否安装app，故这里也支持下
            //    opts.env = 'qqBrowser';
            //}
            //if(opts.env){
            //    opts.env = opts.env.toLowerCase();
            //}
            //if(opts.os){
            //    opts.os = opts.os.toLowerCase();
            //}
            var opts = {};
            if(browser.IOS) {
                opts.os = 'ios';
            } else if(browser.android) {
                opts.os = 'android';
            }

            if(browser.WEIXIN) {
                opts.env = 'weixin';
            } else if(browser.QQ) {
                opts.env = 'qq';
            } else if(browser.QZONE) {
                opts.env = 'qzone';
            } else {
                opts.env = 'qqbrowser';
            }
            if(this.opts){
                //已经init过
                if(opts.env==this.opts.env && opts.os==this.opts.os){
                    //参数相同，不用重新设置
                    return;
                }
            }
            var map = {
                "qzone"     : jsApiQzone,
                "qq"        : jsApiQQ,
                "weixin"    : jsApiWX,
                //'qqbrowser' : jsApiDefault
                'qqbrowser' : jsApiQQBrowser
            };

            this.opts = opts;
            jsBridgeDefer = null;

            $.extend(this, jsApiDefault, map[opts.env]);
        }
    });

    MOD.init();

    return MOD;
});/**
 * 返回码上报
 * @author jameszuo
 * @date 13-4-25
 */
define.pack("./cgi_ret_report",["lib","$","./constants","./urls","./user"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        image_loader = lib.get('./image_loader'),
        cookie = lib.get('./cookie'),

        constants = require('./constants'),
        urls = require('./urls'),
        user = require('./user'),

        type_ok = 1,  // 成功
        type_err = 2,// 失败
        type_logic_err = 3, // 逻辑失败
        ret_rate = 1,// 采样率

        //report_cgi = 'http://c.isdspeed.qq.com/code.cgi',
        report_cgi =  constants.HTTP_PROTOCOL + '//user.weiyun.com/isdspeed/c/code.cgi',

    // 表示成功的返回码(type=1)
        ok_rets = {
            0: 1
        },

    // 表示逻辑错误的返回码(type=3) // james 20130527: 逻辑错误作为成功来处理(type=1)
        logic_error_rets = {
            1010: 1, //对应目录列表查询请求,说明客户端不需要刷新该目录下的本地缓存列表
            1016: 1, //存储平台不存在该用户
            1018: 1, //要拉取的目录列表已经是最新的
            1019: 1, //目录不存在
            1020: 1, //文件不存在
            1021: 1, //目录已经存在
            1022: 1, //文件已传完
            1024: 1, //验证clientkey失败
            1026: 1, //父目录不存在
            1027: 1, //不允许在根目录下上传文件
            1028: 1, //目录或者文件数超过总限制
            1029: 1, //单个文件大小超限
            1030: 1, //签名已经超时，客户端需要重新验证独立密码
            1031: 1, //验证独立密码失败
            1032: 1, //开通独立密码失败
            1033: 1, //删除独立密码失败
            1034: 1, //失败次数过多,独立密码被锁定
            1035: 1, //添加的独立密码和QQ密码相同
            1051: 1, //当前目录下已经存在同名的文件
            1052: 1, //下载未完成上传的文件
            1053: 1, //当前上传的文件超过可用空间大小
            1054: 1, //不允许删除系统目录
            1055: 1, //不允许移动系统目录
            1056: 1, //该文件不可移动
            1057: 1, //续传时源文件已经发生改变
            1058: 1, //删除文件版本冲突
            1059: 1, //覆盖文件版本冲突，本地文件版本过低，请先同步服务器版本
            1060: 1, //禁止查询根目录
            1061: 1, //禁止修改根目录属性
            1062: 1, //禁止删除根目录
            1063: 1, //禁止删除非空目录
            1064: 1, //禁止拷贝未上传完成文件
            1065: 1, //不允许修改系统目录
            1070: 1,
            1073: 1, //外链失效，下载次数已超过限制
            1074: 1, //黑名单校验失败,其它原因
            1075: 1, //黑名单校验失败，没有找到sha
            1076: 1, //非法文件，文件在黑名单中
            1083: 1, //目录或者文件数超单个目录限制
            1088: 1, //文件名目录名无效
            1091: 1, //转存的文件未完成上传
            1092: 1, //转存的文件名无效编码
            1095: 1, //转存文件已过期
            1105: 1, //独立密码已经存在
            1106: 1, //修改密码失败
            1107: 1, //新老密码一样
            1111: 1, //源、目的目录相同目录，不能移动文件
            1112: 1, //不允许文件或目录移动到根目录下
            1113: 1, //不允许文件复制到根目录下
            1116: 1, //不允许用户在根目录下创建目录
            1119: 1, //目的父目录不存在
            1120: 1, //目的父父目录不存在
            1117: 1, //批量下载中某个目录或文件不存在
            3002: 1,
            3008: 1,
            100028: 1,
            100029: 1,
            190041: 1, // 会话超时
            10603: 1 // 压缩包正在下载中
        },

    // 除了表示成功的返回码，和表示逻辑错误的返回码，其他的返回码均认为是失败(type=2)
    // err_rets = { /* ALL */ },

        set_timeout = setTimeout,

        undefined;

    var cgi_ret_report = {

        /**
         * 上报
         * @param {string} cgi_url cgi url
         * @param {string} cmd 命令字，为空即不传
         * @param {number} ret CGI返回码
         * @param {number} time 耗时(ms)
         */
        report: function (cgi_url, cmd, ret, time) {
            if (!cgi_url) {
                return;
            }

            set_timeout(function () {
                var url = url_parser.parse(cgi_url),
                    cgi_name = url.pathname.replace(/^\//, ''); //   /wy_web_jsonp.fcg -> wy_web_jsonp.fcg


                var result_type;
                if (ret in ok_rets) {
                    result_type = type_ok; // 1
                } else if (ret in logic_error_rets) {
//                    result_type = type_logic_err; // 3

                    // james 20130527: 逻辑错误作为成功来处理(type=1)
                    result_type = type_ok;
                } else {
                    result_type = type_err; // 2
                }
                image_loader.load(urls.make_url(report_cgi, {
                    uin : user.get_uin()  || undefined,
                    domain: url.host,
                    cgi: cgi_name + (cmd ? '?cmd=' + cmd : ''), // cgi=wy_web_jsonp.fcg?cmd=query_user， cgi=wy_web_jsonp.fcg
                    type: result_type,
                    code: ret,
                    time: time,
                    rate: ret_rate
                }));
            }, 500);
        }
    };

    return cgi_ret_report;
});/**
 * 模调上报逻辑失败错误码，注意分模块
 * @author xixinhuang
 * @date 2016-11-09
 *
 */
define.pack("./configs.logic_error_code",[],function(require, exports, module) {

    var conf = {
        'download': {
            '1020': 1,   //下载文件不存在，例如被删除或移动
            '1052': 1,   //下载未完成上传的文件
            '1086': 1,   //批量操作条目超上限
            '1179': 1,   //流量超限
            '20002': 1,  //外链过期
            '20003': 1,  //外链使用次数已用完，请联系分享者重新分享
            '22073': 1,  //不支持打包下载,选择了过多目录
            '22077': 1,  //不支持打包下载,存在子目录
            '22078': 1,  //不支持打包下载,子文件过多
            '114200': 1, //分享资源已经删除
            '190049': 1, //违规文件
            '190011': 1, //登录态失效
            '190051': 1, //登录态失效
            '190061': 1, //登录态失效
            '190065': 1, //登录态失效
            '190072': 1  //地域限制，例如边疆地区的音视频上传下载
        }
    }

    return {
        /**
         * 获取某个模调上报ID对应的逻辑失败错误码
         * 支持多层配置，type用.隔开
         * @param type
         * @returns {*}
         */
        get: function(type) {
            //支持多层级配置
            var ns = type.split('.');
            if(ns.length > 1 && (typeof conf[ns[0]] === 'object') && conf[ns[0]][ns[1]]) {
                return conf[ns[0]][ns[1]];
            }
            return conf[type] || {};
        },

        /**
         * 判断某个错误码是否属于逻辑失败
         * @param type
         * @param code
         * @returns {boolean}
         */
        is_logic_error_code: function(type, code) {
            var code_map = this.get(type);
            if(code_map && code_map[code]) {
                return true;
            }
            return false;
        }
    }
});/**
 * 上报用户行为的配置
 */
define.pack("./configs.ops",[],function(require, exports, module) {

    var ops = {
        'TEST': 1000
    };

    return {
        get: function(name) {
            return ops[name] || '';
        }
    }
});
define.pack("./configs.pay_params",["$","lib","./user","./urls","./util.browser","./constants"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        cookie = lib.get('./cookie'),
        user = require('./user'),
        urls = require('./urls'),
        browser = require('./util.browser'),
        constants = require('./constants'),

        undefined;

    var pay_url = constants.HTTP_PROTOCOL + '//pay.qq.com/h5/index.shtml';
    var appid = 'wx786ab81fe758bec2';
    var pf = {
        'android': 'qq.wyhy.khd',
        'ios': 2015,
        'weixin': appid || cookie.get('wy_appid')
    }
    var config = {
        android: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            pf: pf['android'],
            u2: user.get_uin(),
            ru: encodeURIComponent(location.href)
        },
        ios: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            pf: pf['ios'],
            u2: user.get_uin(),
            ru: encodeURIComponent(location.href)
        },
        h5: {
            m: 'buy',
            c: 'wyclub',
            aid: constants.AID,
            n: 1,
            ru: encodeURIComponent(location.href)
        },
        weixin: {
            m: 'buy',
            c: 'subscribe',
            service: 'wyhyh5',
            appid: '1450005554',
            aid: constants.AID,
            wxAppid2: cookie.get('wy_appid') || appid,
            pf: pf['weixin'],
            openid: cookie.get('openid'),
            sessionid: 'hy_gameid',
            sessiontype: 'wc_actoken',
            openkey: cookie.get('access_token')
        }
    }

    var _validate = function(params) {
        var result = params;
        for (var key in params) {
            if (params[key] == undefined) {
                delete result[key];
            }
        }
        return result;
    }

    return {
        /**
         * 获取支付跳转链接
         * 通过config配置的参数，构造一个完整的url，如果需要自定义参数值，可以覆盖并传参进来
         * 如果不需要默认config的参数项，传null进来即可
         * @example
         * pay_params.get_pay_url( {
         *      aid: 'aid',
         *      n: 12,
         *      pf: null,
         *      ru: 'http://www.weiyun.com/',
         * });
         *
         * @param cfg
         * @returns {URL}
         */
        get_pay_url: function(cfg) {
            var conf = (browser.WEIXIN || user.is_weixin_user())? config['weixin'] :
                         browser.android_WEIYUN?config['android'] :
                         browser.IOS_WEIYUN?config['ios'] : config['h5'];
            $.extend(conf, cfg);
            return urls.make_url(pay_url, _validate(conf), true);
        },

        get_pay_params: function(cfg) {
            var conf = browser.WEIXIN? config['weixin'] :
                browser.android_WEIYUN?config['android'] :
                browser.IOS_WEIYUN?config['ios'] : config['h5'];
            $.extend(conf, cfg);
            return conf;
        }
    }
});/**
 * 测速相关配置
 * @author hibincheng
 * @date 2014-12-29
 *
 */
define.pack("./configs.speed_config",[],function(require, exports, module) {

    var conf = {
        'SHARE_PAGE': {
            __flags: '7830-9-2',
            __performance: '7830-9-1',
            NODE: 1,
            CSS: 2,
            VIEW: 3,
            JS: 4,
            COMPLATE: 5

        },
        'TEST' : '7830-4-5-3'
    }

    return {
        get: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__flags'];
        },
        get_perf_flag: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__performance'];
        }
    }
});/**
 * mobile web页 使用的一些常量
 */
/*global global,Buffer*/
define.pack("./constants",[],function (require, exports, module) {


    var nav = navigator.userAgent.toLowerCase();

    var MB_1 = 1024 * 1024;

    // http协议类型
    var HTTP_PROTOCOL = window.location.protocol;
    // 是否使用https协议
    var IS_HTTPS = HTTP_PROTOCOL === 'https:';

    var browser_name = (function () {
            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf('ie') > -1 && window.ActiveXObject !== undefined) {
                return 'ie';
            } else if (nav.indexOf('chrome')) {
                return 'chrome';
            } else if (nav.indexOf('mozilla')) {
                return 'mozilla';
            } else if (nav.indexOf('safari')) {
                return 'safari';
            } else if (nav.indexOf('webkit')) {
                return 'webkit';
            } else {
                return 'unknown';
            }
        })();

    var mappings = [ // 请勿随意调整顺序
            ['ipad', 'ipad'],
            ['iphone', 'iphone'],
            ['windows phone', 'windows phone'],
            ['android', 'android'],
            ['symbian', 'symbian'],
            ['blackberry', 'bb10,blackberry,playbook']
        ],
        os_name;

    for (var i = 0, l = mappings.length; i < l; i++) {
        var map = mappings[i],
            name = map[0],
            uas = map[1].split(',');

        for(var j=0; j < uas.length; j++) {
            if(nav.indexOf(uas[j]) !== -1) {
                os_name = name;
                break;
            }
        }

        if(os_name) {
            break;
        }
    }

    var APPIDS = {
        SHARE: 30111,
        WEIXIN: 30320,
        DEFAULT: 30327   //mobile中默认的都是H5页面
    };

    var APPID = window.APPID || APPIDS['DEFAULT'];

    var AID = window.AID || 'h5_head_pay';

    // 文档预览大小限制
    var DOC_PREVIEW_SIZE_LIMIT = {
        DEFAULT:50*MB_1,
        XLS: 50*MB_1
    };

    var BASE_VERIFY_CODE_URL = HTTP_PROTOCOL + '//captcha.weiyun.com/getimage?aid=543009514&'; //验证码系统url,使用时请加个随机数（Math.random()）来确保每次都是新的

    var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/,
        REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/,
        REGEXP_QZONE = /\bV1_AND_QZ?_([\d\.]+)(.*? QZONEJSSDK\/(([\d\.]+))?)/,
        ua = window.request && window.request.headers['user-agent'],
        IS_FROM_QZONE = REGEXP_IOS_QQ.test(ua) || REGEXP_ANDROID_QQ.test(ua) || REGEXP_QZONE.test(ua);

    return {
        BROWSER_NAME: browser_name,
        OS_NAME: os_name || 'unknown os',
        IS_FROM_QZONE: IS_FROM_QZONE,
        APPID: APPID,
        AID: AID,
        DOC_PREVIEW_SIZE_LIMIT: DOC_PREVIEW_SIZE_LIMIT,
        BASE_VERIFY_CODE_URL: BASE_VERIFY_CODE_URL,
        DOMAIN_NAME: 'weiyun.com',
        HTTP_PROTOCOL: HTTP_PROTOCOL,
	    HTTPS_PORT: 443,
        IS_HTTPS: IS_HTTPS,
        IS_DEBUG: location.search.indexOf('__debug__') > -1
    }
});/**
 * 全局事件路由
 */


define.pack("./global.global_event",["lib","$"],function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events');


    var cache = {},
        event,

        namespace = function (key) {
            return cache[ key ] || ( cache[ key ] = $.extend({}, events) );
        };

    event = $.extend({}, events);

    event.namespace = namespace;


    module.exports = event;
});/**
 * 测速上报华佗系统(huatuo.qq.com)
 * @author iscowei
 * @date 2016-03-17
 *
 * @modified by maplemiao
 * @date 2016-12-22
 */
define.pack("./huatuo_speed",["lib","./constants"],function(require, exports, module) {
    var lib = require('lib');
    var constants = require('./constants');
    var image_loader = lib.get('./image_loader');

    // 测速上报cgi
    // http://tapd.oa.com/mhb/markdown_wikis/#1010084921005723541
    var ht_speed_url = location.protocol + '//report.huatuo.qq.com/report.cgi';
    var cache = {},
        report_appid = 10011,
        sample_rate = 1,    // 采样率100%
        delay_time = 1000;  // 延迟上报1s，获取performance数据

    return new function() {
        // 基准时间
        // 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前
        this.base_time = window.performance && window.performance.timing ? window.performance.timing.fetchStart : 0;

        this.store_point = function(point_key, index, spend_time) {
            var points = cache[point_key] || (cache[point_key] = []);
            points[index] = spend_time;
        };

        this.report = function(point_key, use_performance) {
            var me = this;

            if (!point_key) {
                return ;
            }

            // 延迟以获取performance数据
            setTimeout(function () {
                var points, flags, speed_params;

                points = cache[point_key] || [];
                flags = point_key.split('-');
                speed_params = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2], 'flag5=' + sample_rate];

                // 如果没有自己上报的测速点，那就用performance测速点代替
                // 这里建议都使用performance上报前19个点的数据，自定义测速点从20开始报
                if(window.performance && window.performance.timing && (use_performance || !points.length)) {
                    var perf_data = window.performance.timing;

                    points[ 1 ] = perf_data.unloadEventStart - perf_data.navigationStart;
                    points[ 2 ] = perf_data.unloadEventEnd - perf_data.navigationStart;
                    points[ 3 ] = perf_data.redirectStart;
                    points[ 4 ] = perf_data.redirectEnd;
                    points[ 5 ] = perf_data.fetchStart - me.base_time;
                    points[ 6 ] = perf_data.domainLookupStart - me.base_time;
                    points[ 7 ] = perf_data.domainLookupEnd - me.base_time;
                    points[ 8 ] = perf_data.connectStart - me.base_time;
                    points[ 9 ] = perf_data.connectEnd - me.base_time;
                    points[ 10 ] = perf_data.requestStart - me.base_time;
                    points[ 11 ] = perf_data.responseStart - me.base_time;
                    points[ 12 ] = perf_data.responseEnd - me.base_time;
                    points[ 13 ] = perf_data.domLoading - me.base_time;
                    points[ 14 ] = perf_data.domInteractive - me.base_time;
                    points[ 15 ] = perf_data.domContentLoadedEventStart - me.base_time;
                    points[ 16 ] = perf_data.domContentLoadedEventEnd - me.base_time;
                    points[ 17 ] = perf_data.domComplete - me.base_time;
                    points[ 18 ] = perf_data.loadEventStart - me.base_time;
                    points[ 19 ] = perf_data.loadEventEnd - me.base_time;
                }
                //测速点id开始，如果要测页面的performance则id:1-19为performance测速
                if(points.length) {
                    for(var i = 1, len = points.length; i < len; i++) {
                        speed_params.push(i + '=' + points[i]);
                    }

                    var params = ['appid=' + report_appid, 'speedparams=' + encodeURIComponent(speed_params.join('&'))];

                    // platform
                    switch (constants.OS_NAME) {
                        case 'ipad':
                        case 'iphone':
                            params.push('platform=ios');
                            break;
                        case 'android':
                        case 'windows phone':
                            params.push('platform=android');
                            break;
                        case 'mac':
                        case 'windows':
                        case 'linux':
                        case 'unix':
                            params.push('platform=pc');
                    }

                    image_loader.load(ht_speed_url + '?' + params.join('&'));
                    cache[point_key] = null;
                }
            }, delay_time);
        };
    };
});/**
 * 测速上报(m.isd.com)
 * @author hibincheng
 * @date 2014-12-29
 */
define.pack("./m_speed",["lib","./configs.speed_config","./user"],function(require, exports, module) {

    var lib = require('lib'),

        image_loader = lib.get('./image_loader'),
        Module = lib.get('./Module'),
        speed_config = require('./configs.speed_config'),
        user = require('./user'),

        speed_url = 'http://isdspeed.qq.com/cgi-bin/r.cgi',

        undefined;

    var cache = {};

    var m_speed = new Module('m_speed', {

        start: function(action_name, time) {
            var ns = action_name.split('.');
            var cur;
            cache[ns[0]] = cache[ns[0]] || {};
            if(ns.length > 1) {
                cur = (cache[ns[0]][speed_config.get(action_name)] = []);
                cur[0] = time;
            } else {
                cache[ns[0]] = [];
                cache[ns[0]][0] = time;
            }

        },

        end: function(action_name, time) {
            var ns = action_name.split('.');
            if(ns.length > 1) {
                cache[ns[0]][speed_config.get(action_name)][1] = time;
            } else {
                cache[ns[0]][1] = time;
            }
        },

        set_taken: function(action_name, spend_time) {
            var ns = action_name.split('.');
            var cur;
            cache[ns[0]] = cache[ns[0]] || {};
            if(ns.length > 1) {
                cur = (cache[ns[0]][speed_config.get(action_name)] = []);
                cur[2] = spend_time;
            } else {
                cache[ns[0]] = [];
                cache[ns[0]][2] = spend_time;
            }
        },

        done: function(action_name) {
            var time_cache = cache[action_name];
            if($.isArray(time_cache)) { //单个上报
                this.time(action_name, time_cache);
            } else {
                this._batch(action_name, time_cache);
            }
            delete cache[action_name];
        },

        time: function(action_name, times) {
            var flags = speed_config.get(action_name),
                spend_time = times[2] ? times[2] : times[1] - times[0];
            if(!flags) {
                return;
            }
            flags = flags.split('-');
            var args = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2], flags[3] + '=' + spend_time],
                uin = user.get_uin();
            if(uin) {
                args.push('uin=' + uin);
            }

            image_loader.load(speed_url + '?' + args.join('&'));
        },

        performance: function(action_name) {
            var flags = speed_config.get_perf_flag(action_name),
                perf_data = window.performance.timing,
                start_time = perf_data.navigationStart,
                points = [];
            if(!flags) {
                return;
            }
            flags = flags.split('-');

            points[ 1 ] = perf_data.unloadEventStart - start_time;
            points[ 2 ] = perf_data.unloadEventEnd - start_time;
            points[ 3 ] = perf_data.redirectStart - start_time;
            points[ 4 ] = perf_data.redirectEnd - start_time;
            points[ 5 ] = perf_data.fetchStart - start_time;
            points[ 6 ] = perf_data.domainLookupStart - start_time;
            points[ 7 ] = perf_data.domainLookupEnd - start_time;
            points[ 8 ] = perf_data.connectStart - start_time;
            points[ 9 ] = perf_data.connectEnd - start_time;
            points[ 10 ] = perf_data.requestStart - start_time;
            points[ 11 ] = perf_data.responseStart - start_time;
            points[ 12 ] = perf_data.responseEnd - start_time;
            points[ 13 ] = perf_data.domLoading - start_time;
            points[ 14 ] = perf_data.domInteractive - start_time;
            points[ 15 ] = perf_data.domContentLoadedEventStart - start_time;
            points[ 16 ] = perf_data.domContentLoadedEventEnd - start_time;
            points[ 17 ] = perf_data.domComplete - start_time;
            points[ 18 ] = perf_data.loadEventStart - start_time;
            points[ 19 ] = perf_data.loadEventEnd - start_time;

            var speedparams = ['flag1='+flags[0], 'flag2='+flags[1], 'flag3='+flags[2]];
            for(var i = 1, len = points.length; i < len; i++) {
                speedparams.push(i + '=' + points[i]);
            }
            image_loader.load(speed_url + '?' + speedparams.join('&'));
        },
        /**
         * @param action_name
         * @param {Object<Array>}times
         * @private
         */
        _batch: function(action_name, times) {
            var flags = speed_config.get(action_name);
            if(!flags) {
                return;
            }
            flags = flags.split('-');
            var args = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2]],
                uin = user.get_uin();

            for(var o in times) {
                //如果数组中有第3个数值则第3个为spend_time,第一个数值为开始时间，第2个数据为结束时间
                var spend_time = times[o][2] ? times[o][2] : times[o][1] - times[0];
                args.push(o + '=' + spend_time);
            }
            if(uin) {
                args.push('uin=' + uin);
            }

            image_loader.load(speed_url + '?' + args.join('&'));
        }
    });

    return m_speed;

});/**
 * WEBCGI2.0 PB协议命令字对接
 * @author hibincheng
 * @date 2014-06-11
 */
define.pack("./pb_cmds",[],function(require, exports, module) {

    var cmds = {
        Invalid : 0,

        //-------------------------------------------------------------------//
        //文件预览模块用到的相关命令
        ListFile                : 51,          //拉取压缩文件中的列表--手机Srv转发给spp
        TransListFile           : 52,     //转发拉取命令--spp发现没有该文件信息，转给其它的spp处理
        ExtractFile             : 53,       //抽取压缩文件中的某个文件请求
        TransExtractFile        : 54,  //转发抽取压缩文件中的某个文件请求
    
        //-------------------------------------------------------------------//
        //office文档预览cgi与spp通讯
        ConvertOfficeToHtml     : 100,  //转换文档为html
        ConvertOfficeToPic      : 101,  //转换文档为图片
        DownloadAndConvertOffice: 102,  //下载并转换文档
        //docview
        DocviewPreviewFile      : 103, //请求预览文档
        DocviewGetPreview       : 104, //拉取预览结果
        DocviewConvertFile      : 105, //转换文档
        DownloadFile            : 106, //下载源文件
        WeiyunShareDocAbs       : 12030, //预览文档
        DiskFileDocDownloadAbs  : 2414,  //文档预览
    
        //-------------------------------------------------------------------//
        //KeyValue系统用到的相关命令
        KeyValueSet         : 200,
        KeyValueGet         : 201,
        KeyValueDel         : 202,
        KeyValueAppend      : 203,
        KeyValueDeppend     : 204,
        KeyValueOverwrite   : 205,
        KeyValueInsert      : 206,
        KeyValueGetConfig   : 220,
        KeyValueGetIndex    : 221,
        KeyValueGetList     : 222,
        KeyValueClearUser   : 223,
    
        //-------------------------------------------------------------------//
        //qza_proxy QZONE代理服务器
        QzaShareAddShare    : 300,
        QzaShareAddShareV2  : 301,
    
        //-------------------------------------------------------------------//
        //微云助手--微信平台上的微云公共帐号
        //CollectionTextMsg  : 400,  //微信推送过来的文本消息
        //CollectionUrlMsg   : 401,  //微信推送过来的链接信息
        //CollectionVoiceMsg : 402,
        //CollectionImageMsg : 403,
        //CollectionVideoMsg : 404,
        //CollectionPullTextMsg  : 405,
        //CollectionPullUrlMsg   : 406,
        //CollectionPullVoiceMsg : 407,
        //CollectionDelTextMsg   : 408,
        //CollectionDelUrlMsg    : 409,
        //CollectionDelVoiceMsg  : 410,
    
        //-------------------------------------------------------------------//
        //文件代理模块中接入层与Cache层之间的协议
        FileTransPieceMsg   : 500,  //转存分片
        FileQueryOffsetMsg  : 501,  //查询已经上传的偏移量
    
        //文件增量上传
        FileDiffUploadMsg               :   580,
        FileDiffUploadConfParamMsg      : 581,
    
        //-------------------------------------------------------------------//
        //外链分享
        WyShareAdd          : 600,      // 生成微云分享
        WyShareGetDownInfo  : 601,      // 获取下载信息
    
        //-------------------------------------------------------------------//
        //联合活动文件上传和复制server
        UnionActivityFileUpload         : 620,      //联合活动文件上传
        UnionActivityFileCopy           : 621,      //联合活动文件复制
    
        //这个是之前的老协议，必须占用一下700~709的命令码
        WyUserLogin	:700,
        WyUserUploadFile	:701,
        //-------------------------------------------------------------------//
        //测试命令预留1000以下，这个范围内ajian不要再分配出去
        TestMsg             : 710,
    
    
        //各个模块需要分配的命令号：从1000开始分:每个模块预留1000个命令
        //-------------------------------------------------------------------//
        //对客户端的tcp文件上传相关协议
        ClientFileTransQueryMsg     : 1001, //该控制头来查询文件是否需要上传以及从什么位置开始上传：tcp文件上传代理非分片使用
        ClientFileTransPieceMsg     : 1011, //tcp分片上传数据
    
        //-------------------------------------------------------------------//
        //虚拟目录用到的命令：范围2001~2100
        VirtualDirConfigSet    			: 2001,         //保存用户的配置到云端
        VirtualDirConfigGet     		: 2002,         //从云端获取用户的配置
        VirtualDirConfigDelete  		: 2003,         //删除用户的配置
        VirtualDirDirList       		: 2004,         //返回用户已开通的所有的应用列表
        VirtualDirFileUpload    		: 2005,         //上传文件
        VirtualDirFileDownload  		: 2006,         //文件下载
        //VirtualDirBatchFileDelete   	: 2007,     //批量删除文件
        VirtualDirBatchItemDelete       : 2007,     //批量删除文件
        VirtualDirBatchFileMove 		: 2008,         //批量移动文件
        VirtualDirBatchFileCopy 		: 2009,         //批量复制文件
        VirtualDirBatchFileDownload 	: 2010,     //批量文件下载
        VirtualDirUserQuery     		: 2011,         //用户信息查询
        VirtualDirFileCopyFromOtherBid			: 2012,	//其他业务转存到微云
        VirtualDirFileCopyFromOtherBidBackend	: 2013,	//其他业务转存到微云(给后台使用)
        VirtualDirBatchItemDeleteBackend		: 2014,	//批量删除文件(给后台使用)

    
        //-------------------------------------------------------------------//
        //虚拟目录第三方接入server用到的命令：范围2101~2200
        AccessVirtualDirDirList         : 2101,     //返回用户已开通的所有的应用列表
        AccessVirtualDirFileUpload      : 2102,     //通用目录第三方上传文件
        AccessVirtualDirFileDownload    : 2103,     //虚拟目录的文件下载
        AccessVirtualDirBatchFileDelete : 2104,     //批量删除文件
        AccessVirtualDirFileBatchDownload   : 2105,     //文件批量下载
    
        //-------------------------------------------------------------------//
        //网盘用到的命令：范围2201~3000
    
        //查询模块
        DiskUserInfoGet                 : 2201,     //拉取信息(系统&用户信息&创建用户)
        DiskUserInfoModify              : 2202,     //修改用户信息
        DiskUserTimeStampGet            : 2204,     //拉取时间戳
        //DiskFileQuery                 : 2205,     //    文件查询
        DiskFileBatchQuery              : 2206,     //批量文件查询
        DiskFileHistoryQuery            : 2207,     //文件历史版本信息查询
    
        //DiskDirList                     : 2208,     //    目录列表查询
        DiskDirBatchList                : 2209,     //批量目录列表查询
        DiskDirQuery                    : 2210,     //目录查询
        DiskDirRecurTimeStamp           : 2211,     //递归查询目录时间戳
        DiskDirBatchQuery               : 2212,     //批量目录查询, 企业网盘使用
        DiskSystemKeyQuery              : 2213,     // 查询系统目录的key，企业网盘使用

        DiskUserConfigGet               : 2225,
    
        //上传模块
        DiskFileUpload                  : 2301,     //文件上传请求
        DiskFileContinueUpload          : 2302,     //文件续传请求
        DiskFileOverWriteUpload         : 2303,     //文件覆盖
        //DiskFileLenUpdate             : 2304,     //更新已上传文件大小,已无用
        DiskFileBatchUpload             : 2305,     //文件批量上传
        DiskFileDataUpload              : 2311,     //数据上传伪命令，占位用
    
        //下载模块
        //DiskFileDownload                  : 2401,     //    文件下载(缩略图短链)
        DiskFileBatchDownload               : 2402,     //批量文件下载(缩略图短链)
        DiskFilePackageDownload             : 2403,     //打包下载
        DiskFileWeiyunSharePackageDownload  : 2404,     //外链打包下载
        DiskFileDataDownload                : 2411,     //用户文件数据下载伪命令，占位用
        DiskPicThumbDownload                : 2412,     //图片缩略图下载伪命令，占位用
        DiskVideoThumbDownload              : 2413,     //视频缩略图下载伪命令，占位用
        DiskFileDocDownloadAbs              : 2414,     //获取文件预览
    
        //删除模块
        //DiskFileDelete                : 2501,     //    文件删除
        //DiskFileBatchDelete           : 2502,     //批量文件删除
        //DiskDirDelete                 : 2503,     //    目录删除
        //DiskDirBatchDelete            : 2504,     //批量目录删除
        //DiskDirFileBatchDelete        : 2505,     //批量目录文件删除(同一个目录下) 废弃，替换为2509
        DiskUserClear                   : 2506,     //关闭网盘功能
        DiskItemBatchDelete             : 2507,     //批量目录文件删除(不同目录下):安卓用的是这个命令
        DiskTempFileBatchDelete			: 2508,		//批量temp文件删除并且还原到上一个版本(不同目录下)
        DiskDirFileBatchDeleteEx        : 2509,     //批量目录文件删除
    
        //修改模块
        //DiskFileMove                  : 2601,     //    文件移动
        //DiskFileBatchMove             : 2602,     //批量文件移动
        DiskFileCopy                    : 2603,     //    文件复制
        DiskFileBatchCopy               : 2604,     //批量文件复制
        //DiskFileAttrModify            : 2605,     //  文件属性修改
        DiskFileBatchRename             : 2606,     //批量文件属性修改
        DiskFileRestoreVer              : 2607,     //文件历史版本恢复
        DiskFileDeleteVer               : 2608,     //文件历史版本删除
    
        DiskFileCopyFromOtherBid        : 2609,     //  从其他业务复制
        DiskFileBatchCopyFromOtherBid   : 2610,     //批量从其他业务复制
        DiskFileCopyToOtherBid          : 2611,     //    复制到其他业务
        DiskFileBatchCopyToOtherBid     : 2612,     //批量复制到其他业务
        DiskFileBatchCopyToOffline      : 2613,     //批量复制到离线
    
        DiskDirCreate                   : 2614,     //目录创建
        DiskDirAttrModify               : 2615,     //目录属性修改
        //DiskDirMove                   : 2616,     //    目录移动
        //DiskDirBatchMove              : 2617,     //批量目录移动
        DiskDirFileBatchMove            : 2618,     //批量目录文件移动:客户端目前使用
        DiskDirCreateByParents			: 2619,		//创建多层目录
        DiskDirAttrBatchModify          : 2620,     //目录属性批量修改
    
        //回收站操作
        //DiskRecycleUserQuery          : 2701,     //回收站用户查询
        DiskRecycleList                 : 2702,     //回收站列表查询
        DiskRecycleClear                : 2703,     //清空回收站
        //DiskRecycleDirRestore         : 2704,     //    恢复目录（内部）
        //DiskRecycleDirBatchRestore    : 2705,     //批量恢复目录
        //DiskRecycleFileRestore        : 2706,     //    恢复文件（内部）
        //DiskRecycleFileBatcheRestore  : 2707,     //批量恢复文件
        DiskRecycleDirFileBatchRestore  : 2708,     //批量恢复目录文件
    
        //照片库视图特殊逻辑模块
        DiskPicUpload           : 2801, //在库视图分类中上传一个照片：该命令暂时没有应用的场景
        DiskPicGroupDelete      : 2802, //库视图中删除一个分组(同时删除分组下的照片)
        DiskPicBackup           : 2803, //备份相册中图片
    
        //-------------------------------------------------------------------//
        //手机后台逻辑层用到的命令：范围3001~4000
        TestCellPhoneMsg        : 3001, //这个命令号用于手机端1.6版本过渡时期，PbHead+JsonBody
        CellPhoneGetConfig      : 3011, //拉配置
    
        //-------------------------------------------------------------------//
        //微云收藏模块中抽取链接中的图片, 然后保存到存储图片系统中
        ExtractPicAndSave       : 4001,
    
        //-------------------------------------------------------------------//
        //通用目录第三方server命令：范围5001-6000
        ThirdGetListByAPP       : 5001,         //
        ThirdFilePut            : 5002,         //
    
        //-------------------------------------------------------------------//
        //微云文件库2.0, 范围6001-7000
        /////////////////以下关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////
        LibUserCreate           : 6001,     //创建用户
        LibDirCreate            : 6002,     //目录创建
        LibFileUpload           : 6003,     //文件上传
        LibFileDel              : 6004,     //文件删除,网盘未旁路（网盘旁路批量命令）
        LibFileMove             : 6005,     //文件移动,网盘未旁路（网盘旁路批量命令）
        LibFileNameMod          : 6006,     //文件改名,网盘未旁路（网盘旁路批量命令）
        LibFileOverwrite        : 6007,     //文件覆盖上传
        LibDirDel               : 6008,     //目录删除,网盘未旁路（网盘旁路批量命令）
        LibDirMove              : 6009,     //目录移动,网盘未旁路（网盘旁路批量命令）
        LibDirNameMod           : 6010,     //目录改名
        LibDirUndel             : 6011,     //目录恢复,网盘未旁路（网盘旁路批量命令）
        LibFileFinishedPush     : 6012,     //文件完成上传通知
        LibFileUndel            : 6013,     //文件恢复,网盘未旁路（网盘旁路批量命令）
        LibUserClear            : 6014,     //关闭用户
        LibFileNameBatchMod     : 6015, 	//文件批量改名
        LibFileBatchMove        : 6016,     //文件批量移动,网盘未旁路（网盘旁路批量命令）
        LibDirBatchCreate		: 6017,		//目录批量创建
    
        LibDirNameBatchMod      : 6020,     //目录批量改名
    
        LibFileBatchDel         : 6021,     //文件批量删除,网盘未旁路（网盘旁路批量命令）
        LibDirFileBatchMove     : 6022,     //目录文件批量移动
        LibFileBatchUndel       : 6023,     //文件批量恢复,网盘未旁路（网盘旁路批量命令）
        LibDirBatchDel          : 6024,     //目录批量删除,网盘未旁路（网盘旁路批量命令）
        LibDirBatchMove         : 6025,     //目录批量移动,网盘未旁路（网盘旁路批量命令）
        LibDirBatchUndel        : 6026,     //目录批量恢复,网盘未旁路（网盘旁路批量命令）
        LibFileCopy             : 6027,     //文件复制
        LibFileBatchCopy        : 6028,     //文件批量复制,网盘未旁路（利用单条命令实现）
        LibDirFileBatchRestore  : 6029,     //目录文件批量恢复
        LibDirFileBatchDel      : 6030,     //目录文件批量删除
    
        LibFileContinueUpload   : 6031,     //文件续传请求
        LibFileDownload         : 6032,     //文件下载(缩略图短链)
        LibFileBatchDownload    : 6033,     //批量文件下载
        LibFilePackageDownload  : 6034,     //打包下载
        LibFileWeiyunSharePackageDownload : 6035,     //外链打包下载
        LibFileCopyFromOtherBid         : 6036,     //文件从其他业务复制
        LibFileBatchCopyFromOtherBid    : 6037,     //文件批量其他业务复制,网盘未旁路（未实现）
        LibFileCopyToOtherBid           : 6038,     //文件从复制到其他业务,网盘未旁路（未实现）
        LibFileBatchCopyToOtherBid      : 6039,     //文件批量复制到其他业务
        LibTempFileBatchDel				: 6040,     //批量删除幽灵文件恢复到上个版本
    
        LibCombineBatchFileUpload           : 6041,     //文件批量上传(库内部使用)
        LibCombineBatchFileDel              : 6042,     //文件批量删除(库内部使用)
    
    
        LibPwdQuery             : 6051,     //查询独立密码
        LibPwdAdd               : 6052,     //添加独立密码
        LibPwdDelete            : 6053,     //删除独立密码
        LibPwdModify            : 6054,     //修改独立密码
        LibPwdVerify            : 6055,     //校验独立密码 
    
        //server内部使用
        LibBatchGetPicExif      : 6061,      //批量获取图片exif信息
        LibMovePicToGroup       : 6062,      //添加相片进分组
        LibFileAddStar          : 6063,      //文件加星
        LibFileRemoveStar       : 6064,      //取消加星
        LibTransPicGroup        : 6065,      // 遷移相冊分組
        LibNotifyExifInfo       : 6066,     //bice提取万照片的exif信息，旁路给lyn
        LibRebuildLib           : 6071,      // 迁移网盘
    
    
    
        /////////////////以上关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////
    
        //以下库命令终端使用
        LibListNumGet           : 6101,     //获取各种类型的数量
        LibAllListGet           : 6102,     //拉取库全量列表
        LibDiskAllListGet       : 6103,     //拉取网盘结构的全量列表
        LibLibSearch            : 6104,     //搜索
        LibPdirKeyGet           : 6105,     //获取父目录key
        LibDiffListGet          : 6106,     //拉取库增量列表
        LibDiskDiffListGet      : 6107,     //拉取网盘结构的增量列表
        LibDiskDiffDirGet       : 6108,     //拉取一个用户变化的目录
        LibGetDiffStarFile      : 6109,     //增量拉取用户加星列表:废弃，用6106代替,libid为101
        LibPicDiffListGet       : 6110,     //拉库照片分组增量列表:废弃，用6106代替,拉取下来之后自己过滤,或者拉指定groupid
        LibPageListGet          : 26111,     //按照指令排序方式分页拉取：拍摄时间/字母序/修改时间/上传时间等
        LibGetPicGroup          : 6121,     //获取相册分类中的分组数
        LibCreatePicGroup       : 6122,     //增加相册分组
        LibModPicGroup          : 6123,     //修改相册分组
        LibDeletePicGroup       : 6124,     //删除相册分组(该命令只删除分组，不删除分组下的照片。如果需要删除分组下的照片，用2802命令)
    
        LibGetOneGroupInfo      : 6125,     //获取某一个照片分组下的相关信息：照片数量
        LibGetDelList           : 6126,     //获取所有刪除列表---bice調用
        LibSetGroupCover		: 6127,		//设置组的封面
        LibSetGroupOrder		: 6128,		//设置组的顺序
        LibGetAllFolderInfo     : 6129,      // 获取用户所有目录,给youngky使用
        LibDirList				: 6130,		//拉目录列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleList			: 6131,		//回收站拉列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleClear			: 6132,		//清空回收站，用于oz统计:旁路系统使用，终端无需关注
        LibQueryBackupPhoto     : 6133,     //查询某个照片是否备份过：给bice的照片备份server使用:旁路系统使用，终端无需关注
        LibPicBatchQuery        : 6140,     //批量查询一批照片是否已经备份过
    
        //需要转发请求给库Dispatch
        LibBatchMovePicToGroup  : 6201,     //添加相片进分组
        LibBatchFileAddStar     : 6202,     //批量文件加星
        LibBatchFileRemoveStar  : 6203,     //批量取消加星
    
        //-------------------------------------------------------------------//
        // 幽灵文件svr: 范围7001-8000
        UnfinFileGetList        : 7001,        // 获取未完成文件列表
        UnfinFileAddFile        : 7002,        // 添加文件，对应文件上传:marsin旁路给1.0的
        UnfinFileFileFinish     : 7003,     // 文件完成:存储的通知
        UnfinFileOverwrite      : 7004,      // 覆盖上传:marsin旁路给1.0的
    
        //-------------------------------------------------------------------//
        //网盘用户cache server: 范围8001-9000
        QdiskUserCacheAdd       :   8001,       //创建用户cache
        QdiskUserCacheGet       :   8002,       //获取用户cache
        QdiskUserCacheDelete    :   8003,       //删除用户cache
        QdiskUserSpaceAdd       :   8004,       //增加用户空间
        QdiskUserQQDiskDirKeyMapGet : 8005, 	//获取QQ网盘迁移到微云的根目录映射
        QdiskUserSpaceSet		: 	8006,		//设置用户空间
    
        //Push2.0：范围9001-10000
        PushUserLogin           :   9001,       //用户登录
        PushUserLogout          :   9002,       //用户退出
        PushHeartBeat           :   9003,       //用户心跳
        PushRecvMsg             :   9004,       //服务器推送消息
    
        PushInterUserLogin      :   9101,       //内部接入和cache之间通信
        PushInterUserLogout     :   9102,
        PushInterHeartBeat      :   9103,
        PushInterRecvMsg        :   9104,
        PushInterStatusInfo     :   9105,       //UserServer把状态信息（如用户数等）通知给与其连接的WyinServer
    
        PushInterSendMsg        :   9201,       //供其它需要推送消息给用户的server使用，推送消息给PushNotify服务
    
        //oidb_proxy模块：范围10001--11000  提供访问oidb的pb协议
        OidbGetUserCustomHead           : 10001,    //获取用户自己的自定义头像
        OidbGetFriendsListAndGroupInfo  : 10002,    //请求拉取好友列表与分组信息
        OidbGetFriendsInfoAndRecordName : 10003,    //请求批量拉取好友简单资料以及备注名
        OidbGetFriendsOnlineStatus      : 10004,    //请求获取好友在线状态
        OidbPushOutlinkTips             : 10005,    //发送外链tips
        OidbPushQQNetDiskTransTips      : 10006,    //QQ网盘迁移tips
        OidbGetQuickLaunchApps          : 10007,    //读取快速启动栏应用列表
        OidbGetUserInfo                 : 10008,    //获取用户资料:昵称,头像
    
        //pwd模块：范围11001--12000 
        PwdQuery                : 11001,    //查询独立密码
        PwdAdd                  : 11002,    //添加独立密码
        PwdDelete               : 11003,    //删除独立密码
        PwdModify               : 11004,    //修改独立密码
        PwdVerify               : 11005,    //校验独立密码
    
        //外链模块：范围12001--13000
        WeiyunShareAdd          : 12001,    //生成外链
        WeiyunShareView         : 12002,    //打开外链
        WeiyunShareDownload     : 12003,    //下载分享资源
        WeiyunShareTransStore   : 12004,    //转存分享资源：该命令暂时没有使用，可以对外链里面的文件目录选择部分带给后台
        WeiyunShareSaveData     : 12005,    //保存外链所有数据：把一个外链保存到自己的微云里面
        WeiyunShareSetMark		: 12006,	//给外链打标记：可以给外链打失效标记等信息，有些举报的外链可以这样操作
        WeiyunShareDelete		: 12007,
        WeiyunShareList         : 12008,
        WeiyunShareClear        : 12009,
        WeiyunSharePartDownload : 12023,
	    WeiyunShareBatchDownload: 12024,
        WeiyunSharePartSaveData : 12025,

        WeiyunSharePwdView      : 12010,
        WeiyunSharePwdVerify    : 12011,
        WeiyunSharePwdCreate    : 12012,
        WeiyunSharePwdModify    : 12013,
        WeiyunSharePwdDelete    : 12014,
        WeiyunShareDirList      : 12031,
        WeiyunShareNoteView     : 12032,
        WeiyunShareTraceInfo    : 12033,    //分享链接下载查看名单查询
        WeiyunShareAddTemp      : 12101,    //分享转存时，临时生成的外链，用于中转文件信息

        //剪贴板模块：范围13001--14000
        ClipBoardUpload         : 13001,    //上传一条剪贴板消息到云端
        ClipBoardDownload       : 13002,    //从云端下载剪贴板消息
        ClipBoardDelete         : 13003,    //从云端删除一条剪贴板消息
    
        //微云收藏类碎片信息：范围14001--15000
        NoteAdd                 : 14001,    //添加
        NoteDelete              : 14002,    //删除
        NoteModify              : 14003,    //修改
        NoteList                : 14004,    //获取列表
        NoteDetail              : 14005,    //获取某个具体的Item详细信息
        NoteDump                : 14006,    //笔记外链转存：后台使用，终端不关注
        NotePreUpload           : 14007,    //图片申请上传
        NoteGetSummary          : 14008,    //获取摘要信息，终端不需关注
        NoteStar                : 14009,    //加星、取消加星
        DumpColToNote           : 14010,
        NotePageListGet         : 14031,    //web侧拉取笔记，采用mtime排序
    
        //OZ上报代理(logger_svr_v2): 范围15001--16000 ajianzheng
        //L5:114177:131072
        //15001
        OzProxyTable25          : 15002,    //上报老的后台上报--流水信息统计/已废弃
        OzProxyTable71          : 15003,    //上报老的前台上报--运营报表/已废弃
        OzProxyTable171         : 15004,    //clog客户端日志上报表
        OzProxyTable26          : 15005,    //Oz统计客户端上报/已废弃
        OzProxyTable27          : 15006,    //Oz统计后台上报/已废弃
    
        //
        OzProxyClog             : 15010,    //clog日志上报/完全等同15004
        OzProxyBackend          : 15011,    //微云后台上报      ————上报到dc00056表
        OzProxyClient           : 15012,    //微云客户端上报    ————上报到dc00039/dc00040/dc00041表
    
        OzProxyTable39          : 15020,    //微云客户端上报(dc00039)  ————微云登录接口表
        OzProxyTable40          : 15021,    //微云客户端上报(dc00040)  ————微云客户端点击流和状态设置表
        OzProxyTable41          : 15022,    //微云客户端上报(dc00041)  ————微云客户端通用行为信息、启动时长信息、安装卸载信息表
    
        // qq离线文件模块 ：  范围  16001--16100
        ReqRecvList             : 16001,        //>>请求接收文件列表
        ReqSendList             : 16002,        //>>请求发送文件列表
        ReqDeleteFile           : 16003,      //>>删除文件
        ReqDownloadFile         : 16004,        //>>下载文件
        ReqDownloadFileAbs      : 16005,       // 预览
        ReqFileQuery            : 16006,       //>> 查询 
    
        //活动server: 范围 17001 -- 17999
        //17000
        WeiyunActGetActivity    : 17001,	// 拉取活动(活动&小黄条)
        WeiyunActUserLogin      : 17002,	// 用户登录:后台使用的命令
        WeiyunActFeedBack	    : 17003,	//用户反馈
        WeiyunDailySignIn       : 17004,    //签到
        WeiyunCheckSignIn       : 17005,    //检查签到
        WeiyunAdd10T            : 17006,
        WeiyunCheck10T          : 17007,
        WeiyunActGetGoodsList   : 17020,    //拉取兑换奖品列表
        WeiyunActRedeemGoods    : 17021,    //使用签到积分兑换物品
        WeiyunActGetRedeemRecord: 17022,    //获取签到积分兑换记录

        WeiyunActUserInfoCheckout : 17061, //微云用户数据盘点活动
        QzoneGameCheckSpace     : 17902,
        QzoneGameAddSpace       : 17903,
        // 目录拷贝：   范围 18001--19000
        DirSetCopy              : 18001,    // 目录拷贝命令
    
        // 系统reserved：   范围 19001--19999
    
        // 我的收藏：   范围 20000--20999
        GetCollectionList       : 20000,    // 拉取收藏列表
        GetCollectionContent    : 20001,    // 拉取收藏详情
        DelCollection           : 20002,    // 删除收藏
        AddTextCollection       : 20003,    // 添加文本收藏
        AddLinkCollection       : 20004,    // 添加链接收藏
        AddGalleryCollection    : 20005,    // 添加图片收藏
        AddAudioCollection      : 20006,    // 添加语音片段收藏
        AddFileCollection       : 20007,    // 添加文件收藏
        AddLocationCollection   : 20008,    // 添加地理位置收藏
        AddRichMediaCollection  : 20009,    // 添加混排收藏
        FastUploadResource      : 20010,    // 秒传图片和文件资源
        GetCollectionCountByCatetory: 20011,    // 获取指定类型收藏的总数
        ModCollection           : 20012,    // 修改收藏
        GetCollectionFullInfo   : 20013,    // 获取收藏完整数据Collection+CollectionContent
        ApplyDownloadFile       : 20014,    // 申请文件下载信息
        GetCollectionSummary    : 20015,    // 获取收藏摘要信息
        GetCompatibleCollectionInfo : 20016, // 获取收藏信息多终端兼容格式版本,以html5排版布局
        // 微云文章使用
        GetArticleList : 20056, //拉取文章列表
        StarCollection : 20057, //加星
        UnstarCollection : 20058, //取消加星
    
        //小文件打包上传 zhiwenli
        MiniBatchPreUpload        : 20301,   //批量预上传
        MiniBatchDataUpload       : 20302,   //小文件批量上传数据
    
        // 图片平台代理: 201000--201999 
        QpicFastUpload          : 201000, //秒传(包括转存)
        QpicUploadData          : 201001, //上传图片数据
        QpicDeletePic           : 201002,  //删除图片
    
        // qzone代理 202000--202999
        QzoneProxyGetLocation   : 202001,   // 获取地理信息
    
        //自动升级模块 203000--203999
        AutoUpdateGetNewVersion : 203001,
    
        //微博代理模块 204001--204999 
        WeiboProxyShare         : 204001,   //分享到微博
    
        //下载外链限制cookie生成模块	205001--205999
        GetDlskey				: 205001,	//获取cookie字段
        ParseDlskey				: 205002,	//解析cookie字段
    
        //tp_mini    206001~206999
        FailFileAttr       		: 206001,  	//上报上传失败文件
        FailFileList       		: 206002,  	//拉取失败文件列表
        WeiyunServerList   		: 206003,  	//获取微云拦截ip列表
        TpminiQueryFileStatus 	: 206004,	//查询文件是否在失败列表中
    
    
        ///name:spp_cloud_config,port:9653,desc:配置模块
        ///207000~207999
        DiskConfigGet       : 207000,   ///获取网盘相关配置:计划把微云网盘等相关配置放在这里
        CloudConfigGet		: 207001,	///读用户配置
        CloudConfigSet		: 207002,	///写用户配置
    
        //tp_mifi 208001~208999
        MiFiQueryUserBind    : 208001, // 查询用户绑定信息
        MiFiUserBind         : 208002, // 用户绑定
        MiFiUserLogOut       : 208003, // 用户注销 
        MiFiFileUploadSwitch : 208004, // 文件上传开关请求 
        MiFiQueryNetTypeSupport : 208005, // MiFi支持的网络类型查询
        MiFiSwitchNet           : 208006, // MiFi的网络开关操作
        MiFiJoinInWiFi          : 208007, // MiFi加入某一个WiFi网络
        MiFiForgetWiFi          : 208008, // MiFi忘记已经加入的某个MiFi网络
    
        //name spp_security_svr 
        SecurityCheck					: 209001,	//接入串联，判断是否黑名单等
        SecurityCaptchaCheck			: 209002,	//验证码验证
        SecurityUinBlackListAdd			: 209003,	//添加uin黑名单
        SecurityUinBlackListDelete		: 209004,	//删除uin黑名单
        SecurityUinBlackListGet			: 209005,	//查询uin黑名单
        SecurityFileBlackListAdd		: 209006,	//添加全局file黑名单
        SecurityFileBlackListDelete		: 209007,	//删除全局file黑名单
        SecurityFileBlackListGet		: 209008,	//查询全局file黑名单
        SecurityUinFileBlackListOwnerDownloadAdd	: 209009,	//添加uin的file自己下载黑名单
        SecurityUinFileBlackListOwnerDownloadDelete	: 209010,	//删除uin的file自己下载黑名单
        SecurityUinFileBlackListOtherDownloadAdd	: 209011,	//添加uin的file其他人下载黑名单
        SecurityUinFileBlackListOtherDownloadDelete	: 209012,	//删除uin的file其他人下载黑名单
        SecurityUinFileBlackListOuterLinkerAdd		: 209013,	//添加uin的file外链黑名单
        SecurityUinFileBlackListOuterLinkerDelete	: 209014,	//删除uin的file外链黑名单
        SecurityUinFileBlackListAdd					: 209015,	//删除uin的file黑名单
        SecurityUinFileBlackListDelete				: 209016,	//删除uin的file黑名单
        SecurityUinFileBlackListGet					: 209017,	//查询uin的file黑名单
        SecurityUinFileBlackListClear				: 209018,	//清除uin的file黑名单
        SecurityFileDelete							: 209019,	//删除文件（彻底删除）
        SecurityShareKeyDelete						: 209020,	//删除sharekey（彻底删除）
        SecurityFileQuery							: 209021,	//查询文件信息
        SecurityShareKeyQuery						: 209022,	//查询外链信息
    
        // MailToNote 210001 - 210999
        MailWhiteList : 210001, // 邮件列表操作，添加、删除、查询
        MailPostfixChecks : 210002, // 后台使用，终端不用关注. postfix 邮件头部、实体TCP表查询
    
        //html parser 211000-211999
        HtmlParserCollectionToHtml : 211000, //收藏转成兼容格式html
        HtmlParserHtmlToRichMedia : 211001, //html转成收藏的RichMedia格式
    
        //外链安全
        ShareLinkCheck          : 213000,
    
        //qqaccess 协议透传   214000-214999
        QqAccessTransfer           : 214000,
    
        //企业网盘扩展协议    215000-215999
        CopyFromOffline      : 215000,    // 离线文件转存到企业网盘
        CopyToOffline        : 215001,   	// 企业网盘转存到离线文件
    
        AsycBatchCopy     : 215002,    // 
        AsycBatchMove     : 215003,   	// 
    
        //guarder门卫模块: 频率限制,黑名单管理等
        //216000 ~ 216999
        GuarderCheckIn          : 216000, //来访登记
    
        //docview_dispatcher模块: wopi文档预览分发模块
        //217000 ~ 217999
        DocviewDispatcherGetUrl : 217000, //获取预览url
    
        //wopi_server: wopi服务器模块
        WopiServerCheckFileInfo : 218000, //获取文件信息
        WopiServerGetFile : 218001, //获取文件内容

        //qmail proxy223001~223999
        QmailGetAddrList			: 223001,	//拉取邮件地址列表
        QmailSendMail   			: 223002, //发送邮件

        //small iterface set 224001~224999
        GetTreeView           : 224001,//双屏列表
        GetHomeList           : 224002,//根据第三方appid 获取该第三方主目录列表
        GetHomeDirInfo        : 224003,//批量获取第三方home目录信息

        TagPicUpload          : 224110, //H5活动页上传图片
        PicGetUrl             : 224112,   //机器人识图，拉取图片URL

        //微信支付模块使用:220001~221000
        WxCreatePayId           : 220001,   //生成付费订单
        WxQueryPayId            : 220002,   //查询订单
        WxQueryAllPay           : 220003,   //查询所有支付订单
        WxDeliver               : 220004,   //发货
    
        WxQueryProductInfo      : 220501,  //查询商品信息

        LibImageTagGet          : 26350,  //拉取所有标签
        LibTagFileListPageGet   :26352,  //分页拉取标签下的文件

        AlbumUserDataFix        : 230020,   //修复空间备份图片

        ShareDirDirJoin         : 245203,   //加入共享相册


        /********************************* 好照片专用  **************************************/
        GetPoiInfoByLongLat                                     : 243600,   //通过经纬度获取poi信息

        ShareAlbumDirCreate                                     : 244800,   //创建共享相册
        ShareAlbumDirModify                                     : 244801,   //修改共享相册
        ShareAlbumDirDelete          	          		        : 244802,   //删除共享相册
        ShareAlbumDirJoin            	            		    : 244803,   //加入共享相册
        ShareAlbumDirLeave           	           		        : 244804,   //离开共享相册
        ShareAlbumDirList            	            		    : 244805,   //拉取共享相册列表
        ShareAlbumDir                	                        : 244806,   //拉取单个共享相册
        //通用协议
        ShareAlbumAddComment    				                : 244810,   //新增动态评论
        ShareAlbumDeleteComment  			                    : 244811,   //删除动态评论
        ShareAlbumLike           				                : 244812,   //赞/取消赞动态
        ShareAlbumItemDetail         		                    : 244813,   //获取单个item详情
        ShareAlbumFaceInfoList                                  : 244814,   //获取人脸信息列表
        //文件
        ShareAlbumFileUpload         		                    : 244820,   //上传文件到共享相册
        ShareAlbumFileDelete         		                    : 244821,   //删除文件从共享相册
        ShareAlbumFileList           		                    : 244822,   //拉取文件列表
        ShareAlbumFile               		                    : 244823,   //拉取单个文件
        ShareAlbumFileAddComment   		 	                    : 244824,   //新增文件评论
        ShareAlbumFileDeleteComment  		                    : 244825,   //删除文件评论
        ShareAlbumFileLike           		                    : 244826,   //赞/取消文件赞
        ShareAlbumFileBatchDownload  		                    : 244827,   //文件批量下载

        //动态
        ShareAlbumFeedList           		           		    : 244830,   //拉取动态列表
        ShareAlbumFeed               		               		: 244831,   //拉取单条动态
        ShareAlbumFeedAddComment     		     		        : 244832,   //新增动态评论
        ShareAlbumFeedDeleteComment  		  		            : 244833,   //删除动态评论
        ShareAlbumFeedLike           		           		    : 244834,   //赞/取消赞动态
        //消息
        ShareAlbumMessageList        		        		    : 244840,   //拉取被动列表
        //用户
        ShareAlbumUserConfigGet        		        		    : 244850,   //拉取用户配置、

        //数据上报
        ShareAlbumUploadReport       		        		    : 244860,   //上传数据上报
        ShareAlbumDownloadReport     		      		        : 244861,   //下载数据上报
        //动感影集
        ShareAlbumInnervationAdd     		      		        : 244870,   //客户端添加动感影集
        ShareAlbumInnervationModify  		   		            : 244871,   //h5修改动感影集
        ShareAlbumInnervationView    		     		        : 244872,   //h5查看动感影集
        ShareAlbumInnervationDelete  		   		            : 244873,   //删除动感影集
        ShareAlbumInnervationAddComment     	                : 244874,   //新增动感影集评论
        ShareAlbumInnervationDeleteComment  	                : 244875,   //删除影集评论
        ShareAlbumInnervationLike           	                : 244876,   //赞/取消影集赞

        //心情
        ShareAlbumFeelingAdd         		          		    : 244880,   //添加心情
        ShareAlbumFeelingDelete      		       		        : 244881,   //修改心情
        ShareAlbumFeelingAddComment     		      	        : 244882,   //新增心情评论
        ShareAlbumFeelingDeleteComment  		   	            : 244883,   //删除心情评论
        ShareAlbumFeelingLike           		            	: 244884,   //赞/取消心情赞

        AuthProxyVerifyLoginTicket                              : 245900,   //校验登录态
        AuthProxyGetUserInfo                                    : 245901,   //获取用户信息

        // 微云流量券
        WeiyunFlowCouponUse                         : 245540,
        WeiyunFlowCouponGet                         : 245550

    };

    return {
        get: function(cmd) {
            return cmds[cmd] || cmd;
        }
    };
});define.pack("./polyfill.rAF",[],function(require, exports, module) {

    (function (rAF, cAF) {
        var lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'], x;

        for (x = 0; x < vendors.length && !window[rAF]; ++x) {
            window[rAF] = window[vendors[x] + 'RequestAnimationFrame'];
            window[cAF] = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window[rAF]) {
            window[rAF] = function (callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
            };
        }

        if (!window[cAF]) {
            window[cAF] = function (id) {
                window.clearTimeout(id);
            };
        }
    }('requestAnimationFrame', 'cancelAnimationFrame'));

});/**
 * 微云前端模调上报
 * @iscowei 15-12-16 下午22:45
 */
define.pack("./report_md",["./constants","./util.https_tool"],function (require, exports, module) {
    var constants = require('./constants');
    var https_tool = require('./util.https_tool');

    var cgi_url = constants.HTTP_PROTOCOL + '//www.weiyun.com/report/md';
    cgi_url = https_tool.translate_cgi(cgi_url);

    /**
     * oz 模调被调上报，注意查询被调而不是主调。
     * 查询方法：m.isd.com的模调页，选被调查询，微云-微云业务-Web接入业务，填被调id和接口id
     * @param {String|Number} to 被调id，在模调系统里建的
     * @param {String|Number} id 接口id，在模调系统里建的
     * @param {String|Number} code 调用结果
     * @param {String|Number} type 0：成功，1:失败，2:逻辑失败
     */
    var reportMD = function(to, id, code, result) {
        var ext = '';
        if(to && id) {
            if(code != undefined) {
                ext += "&code=" + code;
            }
            if(result != undefined) {
                ext += "&type=" + result;
            }
            var url = cgi_url + "?fromId=204971707&toId=" + to + "&interfaceId=" + id + ext + "&r=" + Math.random();
            var img = new Image();
            img.src = url;
        }
    };

    return reportMD;
});/**
 * 异步请求
 * @author jameszuo
 * @date 13-3-8
 */
define.pack("./request",["lib","$","./ret_msgs","./urls","./cgi_ret_report","./global.global_event","./util.https_tool","./constants","./pb_cmds"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        url_parser = lib.get('./url_parser'),
        cookie = lib('./cookie'),

        ret_msgs = require('./ret_msgs'),
        urls = require('./urls'),
        cgi_ret_report = require('./cgi_ret_report'),
        session_event = require('./global.global_event').namespace('session_event'),
        https_tool = require('./util.https_tool'),
        constants = require('./constants'),

        pb_cmds = require('./pb_cmds'),
        user_log,

        root = window,

    // ---------------------------------------------------------

    // 请求可能出现的错误类型
        error_status = {
            error: '网络错误, 请稍后再试',
            timeout: '连接服务器超时, 请稍后再试',
            parsererror: '服务器出现错误, 请稍后再试'
        },

    // 请求出现错误时, 返回的错误码
        unknown_code = ret_msgs.UNKNOWN_CODE,
        unknown_msg = ret_msgs.UNKNOWN_MSG,

    // ---------------------------------------------------------


        default_headers_v2 = { cmd: '', appid: constants.APPID, version: 2,major_version: 2},

        default_options = {
            url: '',
            cmd: '',
            just_plain_url: false, // 是否只采用URL而不包含data参数（req_header, req_body）
            body: null,
            header: null,
            cavil: false,
            resend: false,
            re_try: 2,   //重试参数, @svenzeng
            re_try_flag: false,     //是否经过了重试
            safe_req: false // 启用安全模式（即不在setTimeout里执行回调，仅 xhr_get|xhr_post 支持）
        },

    // 超时时间
        callback_timeout = 10,

        set_timeout = setTimeout,
        D = Date,

        undefined;

    function proxy_domain(url) {
        return window.location.protocol + '//'+(location.host || location.hostname)+'/proxy/domain/' + url.slice(7);
    }

    var request = {

        /**
         * 发送GET请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {JsonpRequest}
         */
        get: function (options) {
            return this._new_request(JsonpRequest, arguments);
        },

        /**
         * 发送POST请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 会话超时后，是否触发『会话超时』事件，默认false
         *   - {Boolean} [resend] 会话超时重新登录后，是否重新发送该请求，默认false
         * @returns {IframePostRequest}
         */
        post: function (options) {
            return this._new_request(IframePostRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_get: function (options) {
            options.method = 'GET';
            return this._new_request(CrossDomainRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_post: function (options) {
            options.method = 'POST';
            return this._new_request(CrossDomainRequest, arguments);
        },

        _new_request: function (RequestClass, args_) {
            var options;

            if (args_ && typeof args_[0] === 'object') {
                options = args_[0];
            }
            else {
                throw 'request 无效的请求参数';
            }

            return new RequestClass(options);
        }
    };

    var AbstractRequest = function (options) {
        options.ori_url = options.url;
        options.url = https_tool.translate_cgi(options.url);
        if(constants.IS_DEBUG) {
            options.use_proxy = false;
        }
        if(options.use_proxy) {
            options.url = proxy_domain(options.url);
        }
        this._options = $.extend({}, default_options, options, {
            ok_fn: options.ok_fn || [],
            fail_fn: options.fail_fn || [],
            done_fn: options.done_fn || []
        });
    };

    AbstractRequest.prototype = {
        _default_url: null, // 请覆盖

        _def_error_data: {
            rsp_header: {
                retcode: 404,//unknown_code,
                retmsg: '连接服务器超时，请稍后再试'
            },
            rsp_body: {}
        },

        _unknown_error_data: {
            rsp_header: {
                retcode: unknown_code,
                retmsg: error_status[status] || unknown_msg
            },
            rsp_body: {}
        },

        is_abort: false,

        _send: null,  // 请覆盖

        destroy: null,  // 请覆盖

        ok: function (fn) {
            if (this._destroied)
                return;
            this._options.ok_fn.push(fn);
            return this;
        },

        fail: function (fn) {
            if (this._destroied)
                return;
            this._options.fail_fn.push(fn);
            return this;
        },

        done: function (fn) {
            if (this._destroied)
                return;
            this._options.done_fn.push(fn);
            return this;
        },

        _get_data: function () {
            var o = this._options,
                header = $.isFunction(o.header) ? o.header() : o.header,
                body = $.isFunction(o.body) ? o.body() : (o.body || {}),
                req_body = {},
                data;

            header = $.extend({}, default_headers_v2, header, { cmd: pb_cmds.get(o.cmd) });
            req_body['weiyun.'+o.cmd+'MsgReq_body'] = body;
            body = {
                ReqMsg_body: req_body
            };
            body = $.extend({}, body);

            data = {
                req_header: header,
                req_body: body
            };
            return data;
        },

        _get_cgi_url: function (data, params) {
            var me = this,
                o = me._options,
                cmd = data.req_header.cmd,
                cgi_url;

            // 使用自定义的URL
            var special_url = o.url || me._default_url;
            // 在URL中插入
            cgi_url = urls.make_url(special_url, $.extend({
                cmd: pb_cmds.get(cmd),   // 默认会有一个cmd参数，可被自定义URL中的参数覆盖。如 http://qq.com/?a=1&cmd=XXX 会保持不变，而 http://qq.com/?a=1 会变为 http://qq.com/?a=1&cmd=SOMETHING
                wx_tk: get_wx_tk(),
                g_tk: get_g_tk()//g_tk
            }, params));

            return cgi_url;
        },

        _callback: function (data, is_timeout) {
            if (this._destroied)
                return;

            var end_time = new Date().getTime();

            var me = this;

            this._clear_timeout();

            // fix
            if (!data.rsp_body)
                data.rsp_body = {};
            if (!data.rsp_header)
                data.rsp_header = {};

            var
                cmd = me._options.cmd,
                header = data.rsp_header,
                body = data.rsp_body,
                ret = typeof header.retcode === 'number' ? header.retcode : 0,
                msg = header.msg || header.retmsg || ret_msgs.get(ret);

            body = body && body.RspMsg_body && body.RspMsg_body['weiyun.'+me._options.cmd+'MsgRsp_body'] || {};
            if (ret === 0) {

                // ok
                $.each(me._options.ok_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, body, header, data);
                    }
                });

            } else {

                $.each(me._options.fail_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, ret, body, header, data);
                    }
                });

                // 未登录
                if (ret_msgs.is_sess_timeout(ret)) {
                    session_event.trigger('session_timeout');
                }
            }

            // done
            $.each(me._options.done_fn, function (i, fn) {
                if ($.isFunction(fn)) {
                    fn.call(me, msg, ret, body, header, data);
                }
            });

            me.destroy();

            set_timeout(function () {
                reporter.all(me._options.ori_url, cmd, ret, end_time - me.__start_time, is_timeout);
            }, 0);
        },

        /**
         * 检查是否允许发送请求
         * @returns {boolean}
         * @private
         */
        _before_start: function () {
            return true;
        },

        _is_need_retry: function () {
            return this._options.re_try-- > 0;
        },

        _retry: function () {
            this._options.re_try_flag = true;
            return this._send();
        },

        _timeout: function () {
            if (this._is_need_retry()) {  //fail
                return this._retry();
            }
            var error_data = this.is_abort ? this._def_error_data : this._unknown_error_data;
            this._callback(error_data, true);
            this.destroy(); // 超时后销毁请求，避免出现即提示错误又响应操作的问题
        },

        _start_timeout: function () {
            var me = this;
            me.__timer = set_timeout(function () {

                me._timeout();
            }, callback_timeout * 1000);
        },

        _clear_timeout: function () {
            clearTimeout(this.__timer);
        }
    };

    // ========================================================================================================

    var JsonpRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    $.extend(JsonpRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this,
                o = me._options;

            if (me._before_start && me._before_start() === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                cgi_url = me._get_cgi_url(data),
                callback_name = me._callback_name = 'get_' + _rand();

            this.__start_time = new D().getTime();

            var jqXHR = me._req = $.ajax({
                url: cgi_url,
                dataType: 'jsonp',
                cache: false,
                jsonpCallback: callback_name,
                data: o.just_plain_url ? undefined : {
                    data: JSON.stringify(data)
                }
            });


            me._start_timeout();

            jqXHR
                .done(function (data) {
                    if (o.adaptDate) {//允许适配数据
                        data = o.adaptDate(data);
                    }
                    set_timeout(function () { // 脱离response中的try块
                        me._callback(data, false);
                    }, 0);
                })
                .fail(function (jqXHR, status) {
                    console.error('request error:', status);
                    me.is_abort = (status == 'abort');
                });
            return jqXHR;
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._options.ok_fn = [];
            me._options.fail_fn = [];
            me._options.done_fn = [];
        }
    });


    // ========================================================================================================

    var IframePostRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    IframePostRequest._iframe_pool = [];
    IframePostRequest._iframe_pool_limit = 15;
    IframePostRequest._get_$container = function () {
        return this._$div || (this._$div = $('<div data-id="post_iframe_cont" style="display:none;"></div>').appendTo(document.body))
    };

    $.extend(IframePostRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this;

            if (me._before_start && me._before_start() === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                callback = me._callback_name = 'post_callback_' + _rand(),
                cgi_url = me._get_cgi_url(data, { callback: callback }),

                $form = this._get_form(data, callback);


            // 全局回调
            root[callback] = function (data) {
                set_timeout(function () { // 脱离response中的try块
                    me._callback(data, false);
                }, 0);
            };

            me._start_timeout();


            this._get_iframe(function ($iframe) {
                me._$iframe = $iframe;

                me.__start_time = new D().getTime();

                $iframe.attr('data-action', cgi_url);
                $form
                    .attr('action', cgi_url)
                    .attr('target', $iframe.attr('name'))
                    .submit();
            });

            return this;
        },

        _get_form: function (data, callback) {
            var $form = this._$form = $('<form style="display:none;" method="POST"></form>').appendTo(IframePostRequest._get_$container());

            if (!this._options.just_plain_url) {

                var str_data = JSON.stringify(data);

                $('<input type="hidden"/>').attr('name', 'data').val(str_data).appendTo($form);
                $('<input type="hidden"/>').attr('name', 'callback').val(callback).appendTo($form);
            }

            return $form;
        },


        _get_iframe: function (_callback) {
            var me = this,
                free_iframes = IframePostRequest._iframe_pool,
            // 先从池中取出空闲的iframe
                $iframe = free_iframes.shift(),

                callback = function ($iframe) {
                    _callback($iframe);
                };

            if ($iframe) { // 空闲iframe
                $iframe.data('released', false); // 标记iframe正在被使用
                callback($iframe);
            }
            else {

                $iframe = $("<iframe src=\"" + constants.HTTP_PROTOCOL + "//www.weiyun.com/set_domain.html\" name=\"" + _rand() + "\" style=\"display:none;\"></iframe>");

                // 请求 set_domain.html 完成后执行回调，回调完成后，再放入池中
                $iframe.one('load', function () {

                    // iframe 业务使用完毕后放入池中
                    $iframe.on('load', function () {
                        me._release_iframe($iframe);
                    });

                    // 回调
                    callback($iframe);
                });

                $iframe.appendTo(IframePostRequest._get_$container());
            }
        },

        _release_iframe: function ($iframe) {
            set_timeout(function () {
                var free_iframes = IframePostRequest._iframe_pool;

                // 如果个数未满足池大小上限，则加入到池中
                if (free_iframes.length < IframePostRequest._iframe_pool_limit) {

                    // abort
                    if ($iframe.data('released') === false) {
                        try {
                            var iframe_win = $iframe[0].contentWindow;
                            if ($.browser.msie) {
                                iframe_win.document.execCommand('Stop');
                            } else {
                                iframe_win.stop();
                            }
                            var script = iframe_win.document.getElementsByTagName('script')[0];
                            if (script) {
                                script.parentNode.removeChild(script);
                            }
                        } catch (e) {
                        }
                        // released
                        $iframe.data('released', true);  // 标记iframe没有被使用
                    }

                    // 不在池中，才push
                    if ($.inArray($iframe, free_iframes) == -1) {
                        free_iframes.push($iframe);
                    }
                }
                // 否则销毁
                else {
                    $iframe.remove();
                }
            }, 0);
        },

        destroy: function () {
            this._clear_timeout();
            if (this._callback_name) {
                window[this._callback_name] = $.noop;
            }
            // iframe 由池控制，不在这里销毁，仅断开引用
            if (this._$iframe) {
                this._release_iframe(this._$iframe);
                this._$iframe = null;
            }
            if (this._$form) {
                this._$form.remove();
                this._$form = null;
            }
            if (this._$div) {
                this._$div.remove();
                this._$div = null;
            }
        }
    });

    // ========================================================================================================

    var CrossDomainRequest = function (options) {
        AbstractRequest.call(this, options);
        if (!options.url) {
            console.error('发送CrossDomainRequest请求请带上url参数');
            return;
        }
        if(options.timeout) {
            callback_timeout = options.timeout;
        }
        this._send();
    };
    CrossDomainRequest._Requests = {};
    $.extend(CrossDomainRequest.prototype, AbstractRequest.prototype, {
        _default_url: 'you_forgot_the_url',
        _re_del_get_prefix: /^\s*try\s*\{\s*\w+\s*\(\s*/,
        _re_del_get_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*$/,
        _re_del_post_prefix: /^.*<script>.*\btry\s*\{\s*parent\.\w+\s*\(\s*/,
        _re_del_post_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*<\/script>.*$/g,

        _send: function () {
            var me = this, o = me._options;

            if (me._before_start && me._before_start() === false) return false;    //如果before返回false, 阻断后续请求

            o.method = o.method ? o.method.toUpperCase() : 'GET';
            var data = me._get_data(),
                url_obj = url_parser.parse(o.url),
                url = url_obj.protocol + '//' + url_obj.host + url_obj.pathname;

            if (o.just_plain_url) {
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    callback: 'X_' + o.method,
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'GET') {
                // 添加 cmd 和 g_tk 参数
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    cmd: pb_cmds.get(o.cmd),
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    data: JSON.stringify(data),
                    callback: 'X_GET',
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'POST') {
                var params = {
                    cmd: pb_cmds.get(o.cmd),
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    callback: 'X_POST',
                    _: _ts()
                },
                    sid = url_obj.get_params()['sid'];
                if(sid) {
                    params['sid'] = sid;
                }
                url = urls.make_url(url, params);
                data = urls.make_params($.extend({}, url_obj.get_params(), {
                    data: JSON.stringify(data)
                }));
            }
            else {
                throw '暂不支持' + o.method;
            }

            this.__start_time = new D().getTime();

            if(o.use_proxy) {
                this._send_to_proxy(url, url_obj, data);
            } else {
                this._send_to_iframe(url, url_obj, data);
            }
        },

        _send_to_proxy: function(url, url_obj, data) {
            var me = this;
            me._req = $.ajax({
                type: this._options.method,
                url: url,
                timeout: 10*1000,
                data: data,
                success: function(data, status) {
                    me._ajax_callback(true, 200, data);
                },
                error: function(xhr, errorType, error) {
                    me._ajax_callback(false, xhr.status, '');
                }
            });
        },

        _ajax_callback: function(http_ok, status, text) {
            var me = this,
                o = me._options;
            var rsp_data;
            if (http_ok) {
                if (o.method === 'GET') {
                    text = text.replace(me._re_del_get_prefix, '').replace(me._re_del_get_suffix, '');
                } else if (o.method === 'POST') {
                    text = text.replace(me._re_del_post_prefix, '').replace(me._re_del_post_suffix, '');
                }
                try {
                    rsp_data = $.parseJSON(text);
                } catch (e) {
                    console.error('XHR callback parsing json failed.', e.message);
                }
            }

            // 数据适配数据
            if (o.data_adapter) {
                var headers_map = {};
                $.each(this.getAllResponseHeaders().split('\r\n'), function (i, h) {
                    var kv = h.split(':');
                    headers_map[$.trim(kv[0])] = $.trim(kv[1]);
                });
                rsp_data = o.data_adapter(rsp_data || {}, headers_map);
            }


            if (!rsp_data || $.isEmptyObject(rsp_data)) {
                rsp_data = {
                    rsp_header: {
                        retcode: status ? status : 404,
                        retmsg: me._def_error_data.rsp_header.msg
                    },
                    rsp_body: {}
                };
            }
            // 重试
            var ret = rsp_data.rsp_header.retcode ? rsp_data.rsp_header.retcode : status;
            if (me._is_need_retry() && (!http_ok || ret_msgs.is_need_retry(ret))) {
                return me._retry();
            }

            if (o.safe_req) {
                me._callback(rsp_data || {}, false);
            } else {
                set_timeout(function () { // 脱离response中的try块
                    me._callback(rsp_data || {}, false);
                }, 0);
            }
        },

        _send_to_iframe: function (url, url_obj, data) {
            var me = this,
                o = me._options;

            this._get_request(url_obj, function (Request) {

                var req = me._req = new Request({
                    url: url,
                    data: data,
                    method: o.method,
                    callback: function (http_ok, status, text) {
                        // error
                        if (typeof status === 'string')
                            return console.error(text);

                        // 如果已销毁，则不做任何处理
                        if (me._destroied)
                            return;

                        me._ajax_callback(http_ok, status, text);
                    }
                });
                me._start_timeout();

                me.__start_time = new D().getTime();
                req.send();
            });
        },

        _get_request: function (url_obj, callback) {
            var me = this,
                o = me._options;
            var Request = CrossDomainRequest._Requests[url_obj.host];

            if (Request) {
                callback(Request);
            } else {
                var src = url_obj.protocol + '//' + url_obj.host  + '/cdr_proxy.html';
                $('<iframe data-id="cdr_proxy" src="' + src + '" style="display:none;"></iframe>')
                    .on('load', function () {
                        var iframe = this;
                        setTimeout(function () {
                            var Request;
                            try {
                                Request = CrossDomainRequest._Requests[url_obj.host] = iframe.contentWindow.Request;
                                callback(Request);
                            } catch (e) {
                                console.warn('请求' + src + '未能成功，降级为' + (o.method === 'GET' ? 'JSONP' : 'form data')) + '重新发送';
                                me.destroy();
                                return me._comp_req = (o.method === 'GET' ? request.get(o) : request.post(o));
                            }
                        }, 0);
                    })
                    .appendTo(document.body)
            }
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._destroied = true;

            // 销毁降级了的请求对象
            if (me._comp_req) {
                me._comp_req.destroy();
            }
        }
    });


    // ========================================================================================================

    // 统计信息上报
    var reporter = {

        /**
         * 上报所有CGI相关统计
         * @param url
         * @param cmd
         * @param ret 返回码
         * @param time 耗时
         * @param is_timeout 是否已超时
         */
        all: function (url, cmd, ret, time, is_timeout) {
            // 返回码上报
            this.ret_report(url, cmd, ret, time);
        },

        ret_report: function (url, cmd, ret, time) {
            cgi_ret_report.report(url, cmd, ret, time);
        }
    };

    var _token = function(token) {
        token = token || '';
        var hash = 5381;
        for (var i = 0, len = token.length; i < len; ++i) {
            hash += (hash << 5) + token.charCodeAt(i);
        }
        return hash & 0x7fffffff;
    }

    /**
     * 获取 g_tk
     * @returns {string}
     */
    var get_g_tk = function () {
        var s_key = cookie.get('skey') || '';
        return  _token(s_key);
    };

    /**
     * 获取 wx_tk (采用g_tk相同算法， 后续有必要再对算法修改)
     * @returns {string}
     */
    var get_wx_tk = function () {
        var wx_ticket = cookie.get('wx_login_ticket') || '';
        return  _token(wx_ticket);
    };

    var _rand = function () {
        return 'R' + (+new Date);
    };

    var _ts = function () {
        return new Date().getTime().toString(32);
    };

    return request;
});/**
 * 服务端定义的错误码和消息
 * @author jameszuo
 * @date 13-1-16
 */

define.pack("./ret_msgs",[],function (require, exports, module) {

    var
        MAP = {
            0: '操作成功',
            404: '连接服务器超时，请稍后再试',
            1000: '出现未知错误',
            1008: '无效的请求命令字',
            1010: false, //'对应目录列表查询请求，代表该目录下的信息未修改，客户端不需要刷新该目录下的本地缓存列表。',
            1012: '系统正在初始化，请稍后再试',
            1013: '存储系统繁忙，请稍后再试',
            1014: '服务器繁忙，请稍后再试',
            1015: '创建用户失败',
            1016: '不存在该用户',
            1017: '无效的请求格式', // 请求包格式解析错误
            1018: false, //'要拉取的目录列表已经是最新的',
            1019: '目录不存在',
            1020: '文件不存在',
            1021: '目录已经存在',
            1022: '文件已经存在',
            1023: '上传地址获取失败', //'上传文件时，索引创建成功，上传地址获取失败，客户端需要发起续传',
            1024: '登录状态超时，请重新登录', // 验证clientkey失败
            1025: '存储系统繁忙，请稍后再试',
            1026: '父目录不存在',
            1027: '无效的目录信息', //不允许在根目录下上传文件
            1028: '目录或文件数超过总限制',
            1029: '单个文件大小超限',
            1030: '签名已经超时，请重新验证独立密码',
            1031: '验证独立密码失败',
            1032: '设置独立密码失败',
            1033: '删除独立密码失败',
            1034: '失败次数过多，独立密码被锁，请稍后再试',
            1035: '独立密码不能与QQ密码相同',
            1051: '该目录下已经存在同名文件',
            1052: '该文件未完整上传，无法下载',
            1053: '剩余空间不足',
            1070: '不能分享超过2G的文件', // 使用批量分享后貌似没有大小限制了，要和@ajianzheng、@bondli 确认下。- james
            1076: '根据相关法律法规和政策，该文件禁止分享',

            1083: '该目录下文件个数已达上限，请清理后再试',
            1086: '网盘文件个数已达上限，请清理后再试',
            1088: '无效的文件名',
            1117: '部分文件或目录不存在，请刷新后再试',

            3002: '不能对不完整的文件进行该操作',
            3008: '不能对空文件进行该操作',
            4000: '登录状态超时，请重新登录',
            10000: '登录状态超时，请重新登录',
            10408: '该文件已加密，无法下载',

            100001: '参数无效',
            100002: '无效的请求格式', //Json格式无效
            100003: '请求中缺少协议头',
            100004: '请求中缺少协议体',
            100005: '请求中缺少字段',
            100006: '无效的命令',
            100007: '导入数据请求无效',
            100008: '目录的ID长度无效', //'目录的key长度无效',
            100009: '文件的SHA值长度无效',
            100010: '文件的MD5值长度无效',
            100011: '文件的ID长度无效',
            100012: '返回数据过长导致内存不足',
            100016: '指针无效',
            100017: '时间格式无效',
            100019: '输入字段类型无效',
            100027: '无效的文件名',
            100028: '文件已过期',
            100029: '文件超过下载次数限制',
            100030: '收听官方微博失败',
            100031: '用户未开通微博',
            100033: '分享到微博失败',
            100034: '内容中出现脏字、敏感信息',
            100035: '用户限制禁止访问',
            100036: '内容超限',
            100037: '帐号异常',
            100038: '请休息一下吧',
            100039: '请勿重复发表微博',
            100040: '身份验证失败',

            114200: '文件已被删除', // 要分享的资源已被删除
            114201: '文件已损坏',
            114503: '该文件可能存在风险，暂时无法分享',
            190051: '登录状态超时，请重新登录',
            190054: '访问超过频率限制',
            190055: '服务器暂时不可用，请稍后再试',
            199012: '同时操作的目标数量过多', // 例如限定一次删除100个，发送了包含120对象的请求
            190041: '服务器内部错误，请稍后再试',

            //分享链接邮件发送相关错误码
            102033: '参数错误',
            102034: '服务器内部错误',
            102035: '网络错误',
            102501: '非法请求',
            102502: '输入参数错误',
            102503: '非法的用户号码',
            102504: 'QQMail未激活',
            102505: 'skey验证不通过',
            102506: '邮件被拦截',
            102508: '发送频率过高',
            102601: '收件人总数超过限制',
            102602: '邮件大小超过限制',
            102603: '邮件发送失败',
            102037: '超出频率限制，请输入验证码',
            102038: '验证码错误',


            // 库 - 相册
            210009: '分组不存在',
            210010: '不能删除默认分组',
            210011: '分组名不能为空',
            210012: '分组名重复',

            // ------ 2.0 返回码 -------------------------
            190013: '无效的请求，请刷新页面后重试',
            199013: '拒绝访问',
            13004: '操作频率过快，请稍后再试'
        },
        //PB2.0 在此定义公共的错误码( 范围(190000-19900) )
        MAP_NEW = {
            190011     : '无效的QQ号码',
            190012     : '无效的命令字',
            190013     : '请求参数错误',
            190014     : '客户端主动取消,如关闭连接',
            190020     : '组cmem包错误',
            190021     : '解包cmem包错误',
            190030     : '组ptlogin包失败',
            190031     : '组pb协议包失败',
            190032     : '解析pb协议包失败',
            190033     : '解析http协议失败',
            190034     : '解析json协议失败',
            190035     : '解析xml协议失败',
            190036     : 'http状态码非200',
            190039     : '无效的appid',
            190040     : 'UIN在黑名单中',
            190041     : 'Server内部错误',
            190042     : '后端服务器超时',
            190043     : '后端服务器进程不存在',
            190044     : '解析后端回包失败',
            190045     : '获取L5路由失败',
            190046     : '服务器组包失败',
            190047     : '严重错误，必须要引起重视',
            190048     : '无效的APPID',
            190049     : '可能违反互联网法律法规或腾讯服务协议',
            190050     : '会话被强制下线',
            190051     : '验证登录态失败',
            190052     : '用户不在白名单中',
            190053     : '用户在黑名单中',
            190054     : '访问超过频率限制',
            190055     : '服务器临时不可用',
            190056     : 'cmem key不存在',
            190057     : 'cmem key过期',
            190058     : 'cmem 没有数据',
            190059     : 'cmem 设置时cas不匹配',
            190060     : 'cmem 数据有误',
            190061     : '无效的签名类型:请求身份验证凭证类型',
            190062     : '解签名失败',
            190063     : '解密数据失败',
            190064     : '批量操作条目超上限',
            190065     : 'st签名过期，需要终端去换取新的Key',
            190066     : '终端在同步的过程中，需要从头进行一次全量列表拉取',
            190067     : '敏感文字',
            190071     : '链接被对端关闭',
            190072     : '策略限制',


            190201     : '没有JSON头',
            190202     : '没有JSON体',
            190203     : '缺少必要参数',
            190204     : '参数值类型不正确',

            //CGI公共错误码(199001-199999)
            199001     : '回调callback参数异常',
            199002     : 'op_source参数有误',
            199003     : 'dir_key长度无效',
            199004     : '文件sha长度无效',
            199005     : '文件md5长度无效',
            199006     : '',
            199007     : '日志时间格式无效',
            199008     : '域名不对',
            199009     : 'referer有问题',
            199010     : 'token有误',
            199011     : 'fileid长度无效',
            199012     : '某参数超过配置限制',
            199013     : '下载校验失败',
            199014     : '用户请求信息非法',

            //Server的错误码
            1000:   "服务器出错",
            1013:   "存储平台系统繁忙",
            1015:   "在存储平台创建用户失败",
            1016:   "存储平台不存在该用户",
            1018:   "要拉取的目录列表已经是最新的",
            1019:   "目录不存在",
            1020:   "文件不存在",
            1021:   "目录ID已经使用",
            1022:   "文件已传完",
            1026:   "父目录不存",
            1027:   "不允许在根目录下上传文件",
            1028:   "目录或者文件数超过总限制",
            1029:   "单个文件大小超限",
            1051:   "重名错误",
            1052:   "下载未完成上传的文件",
            1053:   "当前上传的文件超过可用空间大小",
            1054:   "不允许删除系统目录",
            1055:   "不允许移动系统目录",
            1056:   "该文件不可移动",
            1057:   "续传时源文件已经发生改变",
            1058:   "删除文件版本冲突",
            1059:   "覆盖文件版本冲突",
            1060:   "禁止查询根目录",
            1061:   "禁止修改根目录属性",
            1062:   "禁止删除根目录",
            1063:   "不能删除非空目录",
            1064:   "禁止拷贝未上传完成文件",
            1065:   "不允许修改系统目录",
            1066:   "原始外链url参数太长，超过了1022字节",
            1067:   "短URL服务错误",
            1068:   "短URL服务来源字段错误",
            1069:   "短URL服务会数据包大小校验失败",
            1070:   "生成外链文件大小不符合规则",
            1073:   "外链失效，下载次数已超过限制",
            1074:   "黑名单校验失败, 其它原因",
            1075:   "黑名单校验失败，没有找到sha",
            1076:   "非法文件，文件在黑名单中",
            1080:   "名字太长",
            1081:   "GET_APP_INFO时带的错误的source值",
            1082:   "修改目录时间戳出错",
            1083:   "目录或者文件数超单个目录限制",
            1084:   "生成vaskey失败",
            1085:   "批量操作不能为空",
            1086:   "批量操作条目超上限",
            1088:   "文件名目录名无效",
            1090:   "无效的MD5",
            1091:   "转存的文件未完成上传",
            1092:   "转存的文件名无效编码",
            1093:   "无效的业务ID",
            1094:   "读取转存文件失败",
            1095:   "转存文件已过期",
            1096:   "设置flag失败",
            1097:   "ftn preuploadblob解码失败",
            1098:   "请求体中的业务号与业务blob中的业务号不一致",
            1099:   "非法的目标业务号",
            1100:   "微云preuploadblob解码失败",
            1101:   "非法的文件前10M MD5",
            1102:   "asn编码失败",
            1103:   "存储存在此用户",
            1110:   "转存到微云的文件名中含有非法字符",
            1111:   "源、目的目录相同目录，不能移动文件",
            1112:   "不允许文件或目录移动到根目录下",
            1113:   "不允许文件复制到根目录下",
            1114:   "移动索引不一致，存储需要修复",
            1115:   "删除文件并发冲突,可以重试解决",
            1116:   "不允许用户在根目录下创建目录",
            1117:   "批量下载中某个目录或文件不存在",
            1118:   "认证签名无效",
            1119:   "目的父目录不存在",
            1120:   "目的父父目录不存在",
            1121:   "源父目录不存在",
            1122:   "目录文件修改名称时，源目的相同",
            1123:   "不允许在根目录下创建目录",
            1124:   "访问旁路系统出错",
            1125:   "黑名单",
            1126:   "非秒传文件太大禁止上传",


            1301:   "微云网盘用户不存在",
            1302:   "QQ网盘用户不存在",

            1901:   "独立密码签名已经超时，需要用户重新输入密码进行验证",
            1902:   "独立密码验证失败",
            1903:   "开通独立密码失败",
            1904:   "删除独立密码失败",
            1905:   "输入过于频繁",
            1906:   "添加的独立密码和QQ密码相同",
            1908:   "独立密码已经存在",
            1909:   "修改密码失败",
            1910:   "新老密码一样",
            1911:   "不存在老密码，请用添加流程",
            1912:   "策略限制",
            1913:   "独立密码验证失败(密码错误)",
            1914:   "失败次数过多,独立密码被锁定",
            1915:   "认证签名无效",

            20418: '无效app_secret或access_token',
            20410: '微信access_token过期'

        },

    // Server内部错误，需要重试的码
        NEED_RETRY = {190041: 1, 190042: 1, 190043: 1},

        UNKNOWN_MSG = '网络错误，请稍后再试',

        undefined;

    var ret_msgs = {

        get: function (code) {
            var msg = MAP[code] || MAP_NEW[code];

            if (msg === false) {
                return '';
            } else {
                return msg || UNKNOWN_MSG;
            }
        },

        is_sess_timeout: function (code) {
            return code === 1024 || code === 10000 || code === 190051 || code === 4000 || code === 190011 || code === 199034 || code === 20410 || code === 20418;
        },

        is_indep_invalid: function (code) {
            return code === 1031;
        },

        /**
         * 判断是否是需要重试的错误码
         * @param {Number} code
         * @returns {boolean}
         */
        is_need_retry: function (code) {
            return code in NEED_RETRY;
        },

        UNKNOWN_MSG: UNKNOWN_MSG,

        TIMEOUT_CODE: 404, // 连接服务器超时

        UNKNOWN_CODE: 1000,
        INVALID_SESSION: 1024,  // 未登录
        INVALID_SESSION2: 10000,
        INVALID_INDEP_PWD: 1031, // 无效的独立密码

        INCOMPLETE_FILE: 3002, // 未完成的文件
        EMPTY_FILE: 3008, // 空文件
        SHARE_FILE_OVER_SIZE: 1070, // 分享的文件过大

        FILE_NOT_EXIST: 1020, //文件不存在
        ACCESS_FREQUENCY_LIMIT: 13004 // 频率限制
    };

    return ret_msgs;
});
/**
 * 一些常用小挂件
 * @author hibincheng
 * @date 2014-12-20
 */

"use strict";

define.pack("./ui.widgets",["lib","$","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        Module = lib.get('./Module'),
        tmpl = require('./tmpl'),

        undefined;

    var exports = {};
    var $mask;
    var mask = function(is_trans) {
        $mask = $mask || $('<div class="ui-mask"></div>').appendTo(document.body);
        $mask.toggleClass('ui-mask-trans', is_trans);
        $mask.show('false');
    };

    var unmask = function() {
        $mask && $mask.hide('hide');
    };

    exports.reminder = new Module('widgets.reminder', {

        render: function(data) {
            if(this.$el) {
                this.$el.remove();
            }
            mask(true);
            var $el = $(tmpl.reminder(data)).appendTo(document.body);
            clearTimeout(this.timer);
            if(data.auto_remove) {
                this.timer = setTimeout(function() {
                    unmask();
                    $el.remove();
                    if (data.callback) {
                        data.callback();
                    }
                }, 1000);
            }

            this.$el = $el;
        },
        // modified by maplemiao, add callback
        // 在setTimeout中执行callback
        ok: function(text, callback) {
            text = text || '操作成功';
            this.render({
                type: 'ok',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },
        error: function(text, callback) {
            text = text || '出错啦';

            this.render({
                type: 'error',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },
        help: function(text, callback) {
            this.render({
                type: 'help',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },

        loading: function(text, callback) {
            text = text || '加载中';
            this.render({
                type: 'loading',
                text: text,
                auto_remove: false,
                callback: callback
            });
        },
        // modified done

        hide: function() {
            if(this.$el) {
                this.$el.remove();
            }
            this.timer && clearTimeout(this.timer);
            unmask();
        }
    });

    /**
     * confirm component for mobile
     * @param {Object} options - the config options which control the behavior of this component
     * @param {string} options.tip - main tip
     * @param {string} options.sub_tip - sub tip
     * @param {function} options.ok_fn - callback when user click the 'ok' button
     * @param {function} options.cancel_fn - callback when user click the 'cancel' button
     * @param {Array} options.btns_text - the text rendered to the confirm component. e.g. ['ok', 'cancel']
     */
    exports.confirm = function(options) {
        options = options || {};
        var tip = options.tip,
            sub_tip = options.sub_tip,
            ok_fn = options.ok_fn,
            cancel_fn = options.cancel_fn,
            btns_text = options.btns_text;

        exports.reminder.hide();//如果有reminder，先隐藏

        var $el = $(tmpl.confirm({
            tip: tip,
            sub_tip: sub_tip || '',
            ok_text: btns_text && btns_text[0] || '确定',
            cancel_text: btns_text && btns_text[1] || '取消'
        })).appendTo(document.body);

        $el.on('click', '[data-id=ok]', function(e) {
            e.preventDefault();
            ok_fn && ok_fn(e);
            $el.remove();
            unmask();
        }).on('touchend.wigdets_confirm', '[data-id=cancel]', function(e) {
            e.preventDefault();
            cancel_fn && cancel_fn(e);
            $el.remove();
            unmask();
        });

        mask(true);
        $el.show();
    };

    return exports;
});/**
 * URL生成器 TODO 移动到lib下
 * @jameszuo 12-12-26 下午7:02
 */
define.pack("./urls",["lib","./constants"],function (require, exports, module) {

    var lib = require('lib'),

        undefined;

    module.exports = {

        /**
         * 跳转： .redirect('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  location.href = 'http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22';
         * @param url
         * @param params
         */
        redirect: function (url, params) {
            location.href = this.make_url(url, params);
        },

        /**
         * 生成靠谱的URL而不会出现编码问题： .make_url('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         *
         * @param {String} url
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_url: function (url, params, encode_value) {

            url = this.absolute_url(url);

            var params_str = this.make_params(params, encode_value);

            var suffix = url.indexOf( '?' ) > -1 ? '&' : '?';

            return url + (params_str ? suffix + params_str : '');
        },

        /**
         * 生成靠谱的URL参数而不会出现编码问题   { appid: 1, profile: { id:'AAA', length: 2 } }  ->   appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_params: function (params, encode_value) {
            if (typeof params == 'object') {
                var p = [],
                    encode = encodeURIComponent;

                for (var key in params) {
                    var value = params[key];
                    if (value == undefined) {
                        value = '';
                    }

                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                        p.push(encode(key) + '=' + encode(value)); // JSON 必须 encode
                    }
                    else {
                        value = value.toString();
                        p.push(encode(key) + '=' + (encode_value !== false ? encode(value) : value));
                    }

                }
                return p.join('&');
            }
            return '';
        },

        /**
         * 转换绝对路径URL： .absolute_url('web/index.html')  ->  http://www.weiyun.com/web/index.html
         *
         * @param url
         * @return {*}
         */
        absolute_url: function (url) {
            // 如果不是以 http:// 开头，则表示是相对路径，转为绝对路径
            var constants = require('./constants');
            if (!reg_abs_url.test(url)) {
                url = constants.DOMAIN + (url.charAt(0) == '/' ? url : '/' + url);
            }
            return url;
        },

        /**
         * 获取当前URL
         */
        cur_url: function () {
            return location.href;
        }
    };

    var reg_abs_url = /^https?:\/\//;

});define.pack("./user",["lib"],function(require, exports, module) {

    var lib = require('lib'),

        cookie = lib.get('./cookie');

    var uin = cookie.get('p_uin') || cookie.get('uin') || '';
    if(uin) {
        uin = parseInt(uin.replace(/^[oO0]*/, ''));
    }

    return {
        get_uin: function() {
            return uin;
        },

        is_weixin_user: function() {
            var wy_uf = parseInt(cookie.get('wy_uf')) || 0;
            return !!wy_uf;
        }
    }
});/**
 * 记录用户的操作日志
 * @hibincheng
 */
define.pack("./user_log",["lib","$","./constants","./urls","./user","./configs.ops"],function (require, exports, module) {
    var
        lib = require('lib'),
        $ = require('$'),

        image_loader = lib.get('./image_loader'),

        constants = require('./constants'),
        urls = require('./urls'),
        user = require('./user'),
        ops = require('./configs.ops'),

    // 版本号（统计用，参考oz配置）
        VERSION_NO = 1,

    // 操作系统类型（统计用，参考oz配置）
        OS_TYPE = constants.OS_NAME,

    //  设备类型
        DEVICE_TYPE = 9001,    // appbox 的设备类型是9002

    // 模块ID（统计用，参考oz配置）
        SERVICE_ID = 1,// { disk: 1, photo: 2 }[constants.APP_NAME],

        base_params = {
            extString1: constants.OS_NAME,
            extString2: constants.BROWSER_NAME || ''
        },

    // 用户点击数 && 暂时存储点击获取的数据
        count_to_sent = 1, // $.browser.msie && $.browser.version < 7 ? 6 : 10, // 应erric要求，去掉批量上报的特性
        stack_data = [],

        undefined;

    var default_headers = {
        cmd: 'wy_log_flow_bat',
        dev_id: DEVICE_TYPE,
        os_type: OS_TYPE,
        dev_type: DEVICE_TYPE,
        client_ip: '',
        weiyun_ver: '',
        source: 'weiyunMobileWeb',
        os_ver: '',
        msg_seq: 1,
        proto_ver: 2,
        rsp_compressed: 1,
        encrypt: 0,
        net_type: 0
    };

    var cgi_url = 'http://tj.cgi.weiyun.com/wy_log.fcg';

    /**
     * oz 用户行为分析数据上报（旧版）
     * @param {String|Number} op_or_name 操作数字ID或名称（如9130或'disk_file_list_reaload'）
     * @param {Number} [ret]
     * @param {Object} [params]
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     */
    var user_log = function (op_or_name, ret) {

        var cfg = ops.get(op_or_name), op;
        if (cfg) {
            op = cfg;
        }
        else {
            console.warn('无效的参数op=' + op_or_name);
            return;
        }


        var data = $.extend({
            op: op,
            rst: ret || 0,
            service_id: SERVICE_ID,
            subop: 0
        }, base_params);

        // 单个上报
        if (count_to_sent === 1) {
            user_log.single_log(data);
        }
        // 批量上报
        else {
            stack_data.push(data);
            if (stack_data.length == count_to_sent) {
                user_log.pitch_log(stack_data);
                stack_data = [];
            }
        }

    };

    /**
     * 设置基础参数（所有的user_log请求都会戴上这些参数）
     */
    user_log.set_base_param = function (key, value) {
        base_params[key] = value;
    };

    /**
     * 批量上报日志
     * bondli
     */
    user_log.pitch_log = function (data) {
        var header = $.extend({
            uin: user.get_uin()
        }, default_headers);

        var body = {
            log_data: data
        };

        var data_str = JSON.stringify({
            req_header: header,
            req_body: body
        });


        image_loader.load(urls.make_url(cgi_url, { data: data_str}));
    };

    /**
     * 日志上报 带extra_config参数
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     * @param {Object} data 鼠标点击时获取的数据
     *
     */
    user_log.single_log = function ( data) {

        var data_str = JSON.stringify({
            req_header: $.extend({}, default_headers, {
                uin: user.get_uin()
            }),
            req_body: {
                log_data: [ data ]
            }
        });
        image_loader.load(urls.make_url(cgi_url, { op: data.op, data: data_str}));

    };

    return user_log;
});/**
 * 浏览器判断
 */
define.pack("./util.browser",[],function(require, exports ,module) {

    var REGX_WEIXIN = /MicroMessenger/i,
        REGX_QZONE = /QZONE/i,
        REGX_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/,
        REGX_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/,
        REGX_WINDOWS_WEIXIN = /WindowsWechat/i,
        REGX_ANDROID = /Android/i,
        REGX_IOS = /iPhone|iPod|iPad/i,
        REGX_IPAD = /ipad/i,
        REGX_WEIYUN = /weiyun/i;

    var browser = {};
    ~function(){
        var ua = window.navigator.userAgent;
        if(REGX_ANDROID_QQ.test(ua) || REGX_IOS_QQ.test(ua)) {
            browser.QQ = true;
        } else if(REGX_QZONE.test(ua)) {
            browser.QZONE = true;
        } else if(REGX_WEIXIN.test(ua)) {
            browser.WEIXIN = true;
        }

        if(REGX_WINDOWS_WEIXIN.test(ua)) {
            browser.WINDOWS_WEIXIN = true;
        }
        if(REGX_IOS.test(ua)) {
            browser.IOS = true;
            if (REGX_WEIYUN.test(ua)) {
                browser.IOS_WEIYUN = true;
            }
        }
        if(REGX_ANDROID.test(ua)) {
            browser.android = true;
            if (REGX_WEIYUN.test(ua)) {
                browser.android_WEIYUN = true;
            }
        }
        if(browser.IOS && ua.match(/OS (9|10)_\d[_\d]* like Mac OS X/i)) {
            browser.IS_IOS_9 = true;
        }
        if(browser.IOS && REGX_IPAD.test(ua)) {
            browser.IPAD = true;
        }
    }();

    return browser;
});/**
 * https相关url进行转换
 * @author hibincheng
 * @date 2014-09-22
 */
define.pack("./util.https_tool",["lib","$","./constants"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        constants = require('./constants'),

        //目前只有分片上传支持https
        support_https_upload_type = [
            'webkit_plugin',
            'active_plugin',
            'upload_h5_flash'
        ],

        undefined;

    //采用架平的域名转发平台,联系人@clusterli
    var map = {
        "disk.cgi.weiyun.com": "user.weiyun.com/disk/",
        "pre.cgi.weiyun.com": "user.weiyun.com/pre/",
        "stat.cgi.weiyun.com": "user.weiyun.com/stat/",
        //"api.weiyun.com": "user.weiyun.com/newcgi/",
        "web2.cgi.weiyun.com": "user.weiyun.com/newcgi/",

        "download.cgi.weiyun.com": "user.weiyun.com/download/",
        "tj.cgi.weiyun.com": "user.weiyun.com/tj/",
        "web.cgi.weiyun.com": "user.weiyun.com/oldcgi/",
        "diffsync.cgi.weiyun.com": "user.weiyun.com/diffsync/",

        "docview.weiyun.com": "user.weiyun.com/docview/",
        "user.weiyun.com": "user.weiyun.com/",

        "c.isdspeed.qq.com": "user.weiyun.com/isdspeed/c/",
        "p.qpic.cn": "user.weiyun.com/",
        "shp.qpic.cn": "user.weiyun.com/notepic/",
        "wx.cgi.weiyun.com": "user.weiyun.com/wx/",
	    "www.weiyun.com": "www.weiyun.com/",
	    "share.weiyun.com": "share.weiyun.com/",
	    "h5.weiyun.com": "h5.weiyun.com/"
    };

    function translate_url(url) {
        var link = document.createElement('a');

        link.href = url;
        var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'

        return constants.HTTP_PROTOCOL + '//' + translate_host(link.hostname) + (link.port ? (':' + translate_port(link.port)) : '') + pathname + link.search + link.hash;
    }

    function translate_download_url(url) {
        var link;

        if(constants.IS_APPBOX) {
            link = document.createElement('a');
            link.href = url;
            var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'
            return link.protocol + '//' + translate_host(link.hostname) + (link.port ? (':' + link.port) : '') + pathname + link.search + link.hash;
        } else {
            return translate_url(url);
        }

    }

    function translate_host(host) {
        if(!host) {
            return host;
        }

        if(host.indexOf('.ftn.') > -1) { //host中带".ftn."的认为是ftn的上传下载url;
            return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
        }

        return host.replace(/\.qq\.com/, '.weiyun.com');
    }

    function translate_port(port) {
        if(constants.IS_HTTPS) {
            return constants.HTTPS_PORT;
        }
        return port;
    }

    function translate_ftnup_port(port, upload_type) {
        if(constants.IS_APPBOX) { // appbox 先不支持https
            return port;
        }
        if(constants.IS_HTTPS) {
            return $.inArray(upload_type, support_https_upload_type) > -1 ? constants.HTTPS_PORT : port;
        }

        return port;
    }

    function translate_cgi(cgi) {
        var m = /^https?:\/\/([\w\.]+)(?:\/(.+))?/.exec(cgi);
        if(!constants.IS_HTTPS && constants.IS_DEBUG) { //debug时，方便联调cgi
            return cgi;
        }
        if(m && m[1] && map[m[1]]) {
            cgi =  constants.HTTP_PROTOCOL + '//' + map[m[1]] + (m[2] || '');
        }

        return cgi;
    }

    /**
     * 对笔记内的图片用h5.weiyun.com来代理
     * 1/解决跨域;  2/复制粘贴图片时保证外站图片也能通过https访问
     * @param notepic_url
     * @returns {*}
     */
    function translate_notepic_url(notepic_url) {
        if(!notepic_url) {
            return '';
        } else if (notepic_url.indexOf('tx_tls_gate') === -1) {
            notepic_url = 'https://h5.weiyun.com/tx_tls_gate=' + notepic_url.replace(/^http:\/\/|^https:\/\//, '');
        }
        return notepic_url;
    }

    return {
        translate_url: translate_url,
        translate_download_url: translate_download_url,
        translate_notepic_url: translate_notepic_url,
        translate_host: translate_host,
        translate_port: translate_port,
        translate_cgi: translate_cgi,
        translate_ftnup_port: translate_ftnup_port
    };
});/**
 * 上报日志到闹歌系统
 * @date 2015-02-28
 * @author hibincheng
 */
define.pack("./util.logger",["lib","$","./user","./report_md","./constants"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        user = require('./user'),
        reportMD = require('./report_md'),
        constants = require('./constants'),

        undefined;

    var last_time,
        cache_log = [],
        cache_error = [],
        timer = {},
        uin = user.get_uin();
    var view_key = 'weiyun_' + uin;

    function report(store_key, str) {
        if(!str) {
            str = store_key;
            store_key = view_key;
        }

        try {

            var request,
                now = new Date().getTime(),
                take_time = last_time? (now - last_time) / 1000 : 4,
                url = constants.IS_HTTPS ? 'https://www.weiyun.com/log/post/' + store_key : 'http://www.weiyun.com/log/post/' + store_key;

            if(typeof str === 'object') {
                str.time = new Date().toString();
                str.uin = uin;
                str = JSON.stringify(str);
            } else {
                str = 'time:' + new Date().toString() + 'uin:' + uin + ' ' + str;
            }

            //三秒上报一次, 这里last_time标识上次上报的时间点。
            if(take_time > 3) {
                timer && clearTimeout(timer);
                cache_log.push(str);
                timer = setTimeout(function() {
                    if(window.XDomainRequest) {
                        request = new window.XDomainRequest();
                        request.open('POST',url, true);
                    } else {
                        request = new window.XMLHttpRequest();
                        request.open('POST',url, true);
                        request.setRequestHeader('Content-Type','text/plain');
                        request.withCredentials = true;
                    }
                    request.send(cache_log.join('\n'));
                    cache_log = [];
                }, 3 * 1000);
                last_time = now;
            } else {
                cache_log.push(str);
            }
        } catch(e) {

        }
    }

    //写控制台信息并上报罗盘、返回码
    function write(log, mode, ret) {
        var now = new Date().getTime(),
            take_time = last_time ? (now - last_time) / 1000 : 4,
            url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
            interfaceMap = {
                'wy_h5_vip_qboss': 178000393, // 微云H5会员页qboss广告数据拉取接口
                'outlink_v2_error': 179000129, // 微云H5分享页操作异常log上报
                'hzp_error': 178000359,        //好照片操作异常log上报
                'h5_session_timeout': 179000171,    //移动端内嵌页登录态失效
                'upload_error': 177000185,
                'upload_plugin_error': 177000186,
                'download_error': 177000187,
                'disk_error': 178000314,
                'flash_error': 177000197,
                'hash_error': 178000306
            };

        //三秒上报一次, 这里last_time标识上次上报的时间点。
        if(take_time > 3) {
            timer && clearTimeout(timer);
            cache_error.push(log.join('\n'));
            timer = setTimeout(function() {
                $.ajax({
                    url: url,
                    type: 'post',
                    data: cache_error.join('\n'),
                    contentType: 'text/plain',
                    xhrFields: {
                        withCredentials: true
                    }
                });
                cache_error = [];
            }, 3 * 1000);
            last_time = now;
        } else {
            cache_error.push(log.join('\n'));
        }

        if(mode && ret) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
        }
    }

    /**
     * 若是成功，则上报模调
     * 若是失败，则分别上报罗盘和模调
     * @param log
     * @param mode
     * @param ret
     * @param result 0：成功，1:失败，2:逻辑失败
     */
    function dcmdWrite(log, mode, ret, result) {
        result = result || 0;
        var now = new Date().getTime(),
            take_time = last_time ? (now - last_time) / 1000 : 4,
            url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
            interfaceMap = {
                'sign_in_monitor' : 179000182
            };

        if(log instanceof Array) {
            for(var i=0, len=log.length; i<len; i++) {
                console.log(log[i]);
            }
        } else if(log instanceof String) {
            console.log(log);
        }

        // 成功不上报罗盘
        result && report({
            report_console_log: true,
            url: url
        });

        if(mode && (typeof ret != undefined)) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
        }
    }

    //前台JS错误监控，目前针对：下载文件，参数错误(错误码1000500)上报
    function monitor(mode, ret, result) {
        var interfaceMap = {
            'js_download_error': 178000367
        };

        if(mode && (ret != undefined) && (result != undefined)) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
        }
    }


    return {
        report: report,
        write: write,
        monitor: monitor,
        dcmdWrite: dcmdWrite
    }
});
//tmpl file list:
//common/src/ui/widgets.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'alert': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var title = data.title,
            subtitle = data.subtitle || '',
            btn = data.btn || '确定';
    __p.push('    <div class="ui-modal">\r\n\
        <div class="inner">\r\n\
            <div class="ui-modal-hd">\r\n\
                <h1 class="title"><i class="icon-tick"></i>');
_p(title);
__p.push('</h1>\r\n\
            </div>\r\n\
            <div class="ui-modal-bd">\r\n\
                <p class="tips">');
_p(subtitle);
__p.push('</p>\r\n\
            </div>\r\n\
            <div class="ui-modal-ft">\r\n\
                <button data-id="ok" class="btn btn-ok">');
_p(btn);
__p.push('</button>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'reminder': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var type = data.type,
            text = data.text,
            TYPE_KCLASS_MAP = {
                'error': 'icon-reminder-cross',
                'warn': 'icon-reminder-exclamation',
                'help': 'icon-reminder-ask',
                'ok': 'icon-reminder-tick',
                'loading':'icon-reminder-loading'
            };
        var klass = TYPE_KCLASS_MAP[type];
    __p.push('    <div class="wy-reminder ui-modal">\r\n\
        <div class="inner">\r\n\
            <i class="icons icons-reminder ');
_p(klass);
__p.push('"></i>\r\n\
            <p class="text">');
_p(text);
__p.push('</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'confirm': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="ui-confirm-modal" style="display:none;">\r\n\
        <div class="inner">\r\n\
            <div class="ui-modal-bd">\r\n\
                <p class="tip">');
_p(data.tip);
__p.push('</p>');
if (data.sub_tip){__p.push('                <p class="sub-tip">');
_p(data.sub_tip);
__p.push('</p>');
}__p.push('            </div>\r\n\
            <div class="ui-modal-ft">\r\n\
                <div data-id="ok" class="btn btn-ok"><span>');
_p(data.ok_text);
__p.push('</span></div>\r\n\
                <div data-id="cancel" class="btn btn-cancel"><span>');
_p(data.cancel_text);
__p.push('</span></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
