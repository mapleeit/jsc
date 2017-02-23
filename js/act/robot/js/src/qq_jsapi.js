/**
 * 微信 or QQ公众号API接口
 * @author xixinhuang
 * @date 2015-08-18
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        Module = lib.get('./Module'),

        jsBridgeDefer,
        undefined;

    var init_success = false;
    var default_share_msg = {
        'icon_url': 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
        'title': '机器人云云识图',
        'share_name': '会看图说话的呆萌机器宝宝云云，快把他领回家！',
        'link':  'http://h5.weiyun.com/act/robot',
        'type': 1
    }

    var qq_jsapi = new Module('qq_jsapi', {

        init: function(data) {
            var me = this;
            if(typeof mqq === 'undefined') {
                this.loadJsBridge().done(function(){
                    mqq.invoke("ui","setWebViewBehavior",{
                        "historyBack":"true",//true按返回时后退页面，false按返回时退出
                        "bottomBar":"false"//隐藏
                    });
                    me.show_qq_webview(data);
                });
            } else {
                this.show_qq_webview(data);
            }
        },

        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.mqq){
                jsBridgeDefer.resolve();
            }else{
                require.async('http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',function(){
                    if(window.mqq){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },

        show_qq_webview: function(obj){
            var obj = {
                    title: '机器人云云识图',
                    icon_url: (obj && obj.icon_url) ? obj.icon_url : default_share_msg.icon_url,
                    share_name: (obj && obj.desc)? obj.desc : default_share_msg.share_name,
                    link: (obj && obj.share_url) ? obj.share_url : location.href
                },
                me = this;
            init_success = true;
            this.trigger('init_success');
            mqq.ui.setOnShareHandler(function(type){
                obj.type = type;
                me.qq_share_handler(obj);
            });
        },

        qq_share_handler: function(obj){
            if(obj.type == 1) {
                obj = default_share_msg;
            }
            var title = obj.title || '',
                icon_url = obj.icon_url || '',
                share_name = obj.share_name || '',
                link = obj.link || '',
                type = obj.type || 0,
                is_back = obj.is_back || false,
                share_element = obj.share_element || 'news',
                flash_url = obj.flash_url || '',
                puin = obj.puin || '',
                appid = obj.appid || '',
                source_name = obj.source_name || '',
                to_uin = obj.to_uin || '',
                uin_type = obj.uin_type || '',
                me = this;

            if(type === '3') {
                title = share_name;
            }

            mqq.ui.shareMessage({
                    title: title,
                    desc: share_name,
                    share_type: type,  // 分享的目标类型，0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈。默认为 0
                    share_url: link, // 必填，点击消 息后的跳转url，最长120字节。原 targetUrl 参数，可以继续使用 targetUrl
                    image_url: icon_url,  // 必填，消息左侧缩略图url。图片推荐使用正方形，宽高不够时等比例撑满，不会变形。原 imageUrl 参数，可以继续使用 imageUrl。注意：图片最小需要200 * 200，否则分享到Qzone时会被Qzone过滤掉。
                    back: is_back, //发送消息之后是否返回到web页面，默认false，直接到AIO，注：该参数只对share_type=0时起作用
                    shareElement: share_element,//分享的类型，目前支持图文和音乐分享。news：图文分享类型，audio：音乐分享类型，video：视频分享类型。默认为news
                    flash_url: flash_url, //如果分享类型是音乐或者视频类型，则填写流媒体url
                    puin: puin, // 公众帐号uin，用于自定义结构化消息尾巴，只在公众账号分享的时候填写，若不是请不要填，当puin没有索引到本地记录，则显示sourceName字段的文本，若没有sourceName字段，则直接显示puin数字
                    appid: appid, //来源 appid，在QQ互联申请的的 appid，如果有，可以填上
                    sourceName: source_name, //消息来源名称，默认为空，优先读取 appid 对应的名字，如果没有则读取 puin 对应的公众账号名称
                    toUin: to_uin, //分享给指定的好友或群，如果存在这个参数，则不拉起好友选择界面 (针对分享给好友)
                    uinType: uin_type//分享给指定的好友或群的uin类型: 0：好友；1：群 (针对分享给好友)
                },
                function(result){
                    if(result['retCode'] === 0){
                        me.show_qq_tips("分享成功");
                    } else if(result['retCode'] === 1 || result['retCode'] === -2){
                        me.show_qq_tips("分享失败");
                    }
                });
        },

        show_qq_tips: function(content) {
            mqq.ui.showTips({
                text:content
            });
        }
    });

    return qq_jsapi;
});