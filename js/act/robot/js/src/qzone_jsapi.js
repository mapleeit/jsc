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
        'image': 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
        'title': '机器人云云识图',
        'desc': '会看图说话的呆萌机器宝宝云云，快把他领回家！',
        'url':  'http://h5.weiyun.com/act/robot'
    }

    var qzone_jsapi = new Module('qzone_jsapi', {

        init: function(data) {
            var me = this;
            var _data = {
                'image': (data && data.icon_url)? data.icon_url : default_share_msg.image,
                'title': '机器人云云识图',
                'desc': (data && data.desc)? data.desc : default_share_msg.desc,
                'url': (data && data.share_url)? data.share_url :  default_share_msg.url
            }
            if(typeof window.QZAppExternal === 'undefined') {
                this.loadJsBridge().done(function(){
                    me.bind_share_events(_data);
                });
            } else {
                this.bind_share_events(_data);
            }
        },

        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.QZAppExternal){
                jsBridgeDefer.resolve();
            }else{
                require.async('http://qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js?_bid=339',function(){
                    if(window.QZAppExternal){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },

        bind_share_events: function(shareData) {
            window.QZAppExternal.setShare(function(d){
                 //alert('QZAppExternal.setShare return '+JSON.stringify(d));
            },{
                'type' : "share",
                'image':[shareData.image,default_share_msg.image,shareData.image,shareData.image,shareData.image],//分别为默认文案、QQ空间、手机QQ、微信、微信朋友圈
                'title':[shareData.title,default_share_msg.title,shareData.title,shareData.title,shareData.desc],
                'summary':[shareData.desc,default_share_msg.desc,shareData.desc,shareData.desc,shareData.desc],
                'shareURL':[shareData.url,default_share_msg.url,shareData.url,shareData.url,shareData.url]
            });
        }
    });

    return qzone_jsapi;
});