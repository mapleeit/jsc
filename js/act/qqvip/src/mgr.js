/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-04
 */
define(function(require, exports, module) {
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
});