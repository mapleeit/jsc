/**
 * 判断是否安装了微云app
 * @author xixinhuang
 * @date 2015-11-09
 */
define(function(require, exports, module){
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
});