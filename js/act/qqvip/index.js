//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/act/qqvip/index",["lib","$","common"],function(require,exports,module){

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
//qqvip/src/mgr.js
//qqvip/src/qqvip.js
//qqvip/src/store.js
//qqvip/src/ui.js

//js file list:
//qqvip/src/mgr.js
//qqvip/src/qqvip.js
//qqvip/src/store.js
//qqvip/src/ui.js
/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-04
 */
define.pack("./mgr",["lib","$","common"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        user = common.get('./user'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        https_tool = common.get('./util.https_tool'),
        widgets = common.get('./ui.widgets'),
        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),

        undefined;

    var mgr = new Mgr('mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
        },

        on_pay: function(type) {
            if(this.loading || !this.validate(type)) {
                return;
            }
            if(!cookie.get('skey') && cookie.get('wx_login_ticket')) {
                this.show_err_tips(null, '微信帐号无法享受优惠，请用QQ帐号登录');
                return;
            }
            this.loading = true;
            var url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/actpay.vip.qq.com/cgi-bin/VipPricing.fcgi',
                actid = 107569,
                pf = (browser.android || browser.IOS)? 'qq_m_qq-2001-html5-2011-weiyunvip' : 'lhweb',
                data,
                uin = parseInt(user.get_uin()),
                me = this;

            if(browser.android || browser.IOS) {
                data =  {
                    uin: uin,
                    actid: actid,
                    appid: 1450007194,
                    type: 2,
                    iteminfo: actid + '*' + 1,
                    pf: 'qq_m_qq-2001-html5-2011-weiyunvip',
                    ts: (new Date()).getTime().toString().substr(0, 10),
                    _t: Math.random(),
                    g_tk: this._get_gtk()
                };
            } else {
                data = {
                    uin: uin,
                    actid: actid,
                    appid: 1450007320,
                    type: 1,
                    iteminfo: actid + '*' + 1,
                    platform: 3,
                    pf: 'lhweb',
                    zoneid: 1,
                    ts: (new Date()).getTime().toString().substr(0, 10),
                    _t: Math.random(),
                    g_tk: this._get_gtk()
                };
            }

            $.ajax({
                type: 'get',
                url: url,
                data :data,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"success_callback",
                success: function(repData){
                    me.loading = false;
                    if(repData.ret !== 0) {
                        me.show_err_tips(repData.ret, repData.msg);
                    } else if(browser.IOS || browser.android) {
                        var succUrl = location.href,
                            aid = me.get_aid(type),
                            url = 'https://pay.qq.com/h5/index.shtml?_wv=1031&m=buy&c=goods&wechat=1&wxWapPay=1&openid=' + uin + '&pf=' + pf + '&aid=' + aid +
                                '&params=' + encodeURIComponent(repData.url_params) + '&ru=' + encodeURIComponent(succUrl) + '&pu=' +  encodeURIComponent(succUrl) + '&dc=mcard,hfpay,yb';
                        location.href = url;
                    } else {
                        me.mini_pay(repData);
                    }
                },
                error: function(ret, msg){
                    me.loading = false;
                    me.show_err_tips(ret, msg);
                }
            });
        },

        on_pay_qq_vip: function() {
            this.view.jump_qq_vip();
        },

        on_more_privilege: function() {
            this.view.jump_weiyun();
        },

        _get_gtk: function() {
            var hash = 5381,
                skey = cookie.get('skey');
            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },

        validate: function(type) {
            if(!this.store.is_qq_svip() && type === 'svip') {
                this.view.jump_qq_vip();
                return false;
            } else if(!this.store.is_qq_vip() && type === 'vip') {
                this.view.jump_qq_vip();
                return false;
            }
            return true;
        },

        show_err_tips: function(ret, msg) {
            if(ret === 2019) {
                msg ='开通微云会员的时长不得高于当前QQ会员/超级会员的有效期';
            } else if(ret === 2011) {
                msg ='对不起，您参与的次数已达到平台限制，谢谢您的支持';
            }
            if(browser.IOS || browser.android) {
                widgets.reminder.error(msg || '请求失败，请稍后重试！');
            } else {
                this.view.show_err_tips(msg || '请求失败，请稍后重试！');
            }
        },

        get_aid: function(type) {
            if(type === 'svip' && this.store.is_old_weiyun_vip()) {
                return 'chaohuishoukai';
            } else if(type === 'svip' && !this.store.is_old_weiyun_vip()) {
                return 'chaohuixufei';
            } else if(type === 'vip' && this.store.is_old_weiyun_vip()) {
                return 'huiyuanshoukai';
            } else if(type === 'vip' && !this.store.is_old_weiyun_vip()) {
                return 'huiyuanxufei';
            } else {
                return 'huiyuanxufei';
            }
        },

        mini_pay: function(data) {
            if(fusion2 && fusion2.dialog) {
                fusion2.dialog.buy
                ({
                    title : '微云会员',
                    param : data.url_params,
                    //disable_snspay: '',
                    //sandbox: true,
                    context: '微云会员',
                    onSuccess : function (opt) {

                    },
                    onCancel : function (opt) {

                    },
                    onClose : function (opt) {

                    }
                });
            }
        }
    });

    return mgr;
});define.pack("./qqvip",["$","lib","common","./store","./ui","./mgr"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        huatuo_speed = common.get('./huatuo_speed'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var qqvip = new Module('qqvip', {

        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }

            store.init(serv_rsp);
            ui.init();
            mgr.init({
                store: store,
                view: ui
            });
            this.set_share();
        },

        set_share: function() {
            var share_url = location.href.indexOf('#') > -1? location.href.slice(0, location.href.indexOf('#')) : location.href,
                share_desc = '超级会员、QQ会员专享微云优惠购特权，首次开通低至1元！',
                share_icon = 'https://qzonestyle.gtimg.cn/qz-proj/wy-h5/img/icon-share-vip-pic.jpg',
                share_data = {
                    title: '超低价开通微云会员',
                    desc: share_desc,
                    url: share_url,
                    image: share_icon
                },
                _data = {
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'previewImage'
                    ],
                    hideMenuItems: []
                };
            if(browser.QQ || browser.QZONE) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                });
            } else if(browser.WEIXIN) {
                //share域名下加载引入js sdk有冲突问题，必须得通过require引入
                require.async(constants.HTTP_PROTOCOL + '//res.wx.qq.com/open/js/jweixin-1.0.0.js', function (res) {
                    wx = res;
                    app_api.init(_data, function() {
                        app_api.setShare(share_data);
                    });
                });
            }
        }
    });

    return qqvip;
});/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        undefined;


    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            if(data) {
                this.user_info = data['userInfo'];
                this.QQVipInfo = data['QQVipInfo'];
            } else {
                this.user_info = {};
                this.QQVipInfo = {};
            }
            this._inited = true;
        },

        get_user_info: function() {
            return this.user_info;
        },

        get_qq_vip_info: function() {
            return this.QQVipInfo;
        },

        is_weiyun_vip: function() {
            return this.user_info && this.user_info['weiyun_vip_info'] && this.user_info['weiyun_vip_info']['weiyun_vip'];
        },

        is_old_weiyun_vip: function() {
            return  this.user_info && this.user_info['weiyun_vip_info'] && this.user_info['weiyun_vip_info']['old_weiyun_vip'];
        },

        is_qq_vip: function() {
            return !!(this.QQVipInfo['vip_open'] && parseInt(this.QQVipInfo['vip_open']));
        },

        is_qq_svip: function() {
            return !!(this.QQVipInfo['svip_open'] && parseInt(this.QQVipInfo['svip_open']));
        }
    };

    $.extend(store, events);

    return store;
});define.pack("./ui",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        undefined;

    var ui = new Module('ui', {

        init: function() {
            if(this.hasLoaded) {
                return;
            }
            this._$ct = $('#container');
            this.bind_events();
        },

        bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    type = $target.attr('data-id'),
                    action_name = $target.attr('data-action');
                me.trigger('action', action_name, type);
            });
            this.hasLoaded = true;
        },

        show_err_tips: function(text) {
            $('.error-dialog .text').text(text);
            $('.error-dialog').show();
            setTimeout(function(){
                $('.error-dialog').hide();
            },2000);
        },

        jump_qq_vip: function() {
            var url = 'http://pay.qq.com/ipay/index.shtml?c=cjclub,ltmclub&aid=vip.gn.client.weiyun_hd_vip&ch=qdqb,kj,weixin';
            if(browser.IOS) {
                url = 'https://mc.vip.qq.com/qqwallet/index?_wv=3&aid=mios.gn.android.weiyun_hd_vip&type=svip';
            } else if(browser.android) {
                url = 'https://mc.vip.qq.com/qqwallet/index?_wv=3&aid=mvip.gn.android.weiyun_hd_vip&type=svip';
            }
            location.href = url;
        },

        jump_weiyun: function() {
            var url = '';
            if(browser.android || browser.IOS) {
                url = 'https://h5.weiyun.com/vip';
            } else {
                url = '//www.weiyun.com/vip/vip.html';
            }
            location.href = url;
        }
    });

    return ui;
});