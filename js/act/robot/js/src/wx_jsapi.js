/**
 * 微云H5分享外链
 * @author xixinhuang
 * @date 2016-02-24
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),

        undefined;

    var init_success = false;

    var wx_jsapi = new Module('wx_jsapi', {

        init: function(data) {
            var me = this;
            if(typeof wx === 'undefined') {
                me.loadJsBridge().done(function(weixin) {
                    wx = weixin;
                    me.loadWxSign(data);
                });
            } else {
                me.loadWxSign(data);
            }


            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
        },

        loadWxSign: function(data) {
            var me = this,
                url;
            if(location.href.indexOf('#') > -1) {
                url = location.href.slice(0, location.href.indexOf('#'));
            } else {
                url = location.href;
            }
            $.ajax({
                url: 'http://h5.weiyun.com/proxy/domain/web2.cgi.weiyun.com/wx_oa_signature.fcg?url=' + encodeURIComponent(url),
                dataType : 'jsonp'
            }).done(function(sign_info) {
                if (sign_info.retcode === 0) {
                    me._init(sign_info, data);
                } else {
                    me.init_fail(sign_info);
                }
            }).fail(function(sign_info) {
                me.init_fail(sign_info);
            });
        },

        loadJsBridge: function () {
            var defer = $.Deferred();
            //this.wxSigDefer = defer;
            require.async('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function (wx) {
                if (typeof wx === 'undefined') {
                    defer.reject();
                } else {
                    defer.resolve(wx);
                }
            });

            return defer;
        },

        _init: function(sign_info, data) {
            wx.config({
                debug: false,
                beta: true,
                appId: sign_info.appid,
                timestamp: sign_info.timestamp,
                nonceStr: sign_info.nonceStr,
                signature: sign_info.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'previewImage'
                ]
            });

            var me = this;
            //sign success
            wx.ready(function() {
                //alert('ready');
                me.trigger('init_success');
                me.custom_menu(data);
                init_success = true;
            });

            //sign fail
            wx.error(function(err) {
                //alert(JSON.stringify(err));
                me.sign_fail(sign_info, err);
            });
        },

        init_fail: function(err) {
            this.trigger('init_fail');
            logger.report('weixin_mp', {
                err: err
            });
        },

        sign_fail: function(sign_info, err) {
            this.trigger('init_fail');
            sign_info.err = err;
            logger.report('weixin_mp', sign_info);
        },

        custom_menu: function(data) {
            wx.hideMenuItems({
                menuList: [], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                success: function (res) {
                    //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                },
                fail: function (res) {
                    logger.report('weixin_mp', res);
                    //alert(JSON.stringify(res));
                }
            });
            this.bind_wx_share_event(data);
        },

        bind_wx_share_event: function(obj) {
            var share_title = '机器人云云识图',
                share_name = (obj && obj.desc)? obj.desc : '会看图说话的呆萌机器宝宝云云，快把他领回家！',
                icon_url = (obj && obj.icon_url)? obj.icon_url : 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
                share_url = (obj && obj.share_url)? obj.share_url : location.href,
                me = this;

            wx.onMenuShareAppMessage({
                title: share_title,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareTimeline({
                title: share_name,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareQQ({
                title: share_title,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareQZone({
                title: '机器人云云识图', // 分享标题
                desc: '会看图说话的呆萌机器宝宝云云，快把他领回家！', // 分享描述
                link: 'http://h5.weiyun.com/act/robot', // 分享链接
                imgUrl: 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png', // 分享图标
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });
        },

        on_ready: function() {

        },

        set_share_url: function(obj) {
            this.bind_wx_share_event(obj);
        },

        is_ok: function() {
            return !!init_success;
        }
    });

    return wx_jsapi;
});