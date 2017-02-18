//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/vip/vip.r161022",["lib","common","$"],function(require,exports,module){

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
//vip/src/Mgr.js
//vip/src/ad_link.js
//vip/src/ar.js
//vip/src/busiConfig.js
//vip/src/store.js
//vip/src/ui.js
//vip/src/vip.js
//vip/src/vip.tmpl.html

//js file list:
//vip/src/Mgr.js
//vip/src/ad_link.js
//vip/src/ar.js
//vip/src/busiConfig.js
//vip/src/store.js
//vip/src/ui.js
//vip/src/vip.js
/**
 * vip mgr module
 * @author : maplemiao
 * @time : 2016/11/25
 **/
define.pack("./Mgr",["lib","common","$","./ar","./busiConfig"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        cookie = lib.get('./cookie'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        undefined;

    var ar = require('./ar'),
        busiConfig = require('./busiConfig');

    return inherit(Event, {
        constructor: function (cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },


        bind_events: function() {
            var me = this;
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                }, this);
            }
            // 监听异步请求发出的事件
            if (this.ar) {
                this.listenTo(this.ar, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                }, this);
            }
        },

        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },

        /**
         * 购买容量
         * @param type
         * @param event
         */
        on_capacity_purchase: function (type, event) {
            var me = this;

            // 特殊逻辑：微信账号在支付那里走h5的流程
            if (IS_WEIXIN_USER) {
                var url = https_tool.translate_url("//h5.weiyun.com/capacity_purchase");
                url = https_tool.translate_cgi('http://web2.cgi.weiyun.com/web_wx_login.fcg?cmd=wx_buy_space_coupon&no_referer=1&rurl=' + encodeURIComponent(url));
                // 有可能文本过长，导致报错
                try {
                    me._showQR(url);
                    logger.dcmdWrite([], 'web_capacity_purchase_monitor', 0, 0);
                } catch (err){
                    var console_log = [];
                    console_log.push('【微信账号购买容量生成二维码失败】：', JSON.stringify(err));
                    // -2001 : 微信账号购买容量生成二维码失败
                    logger.dcmdWrite(console_log, 'web_capacity_purchase_monitor', -2001, 1);
                }
                this.view.get_$dialog_title().text('购买微云容量');
                this.view.get_$dialog().show();
            } else {
                ar.buy({
                    ruleid: busiConfig.SPACE_RULEID_MAP[type],
                    buy_num: 1
                });
            }
        },

        /**
         * 购买容量
         * 拉取下单成功
         * @param url_params
         */
        on_order_ajax_success: function (url_params) {
            var me = this;

            logger.dcmdWrite([], 'web_capacity_purchase_monitor', 0, 0);

            //noinspection JSJQueryEfficiency
            if ($('.fusion_dialog_wrap')) {
                $('.fusion_dialog_wrap').remove();
            }

            fusion2 && fusion2.dialog && fusion2.dialog.buy({
                title : '微云容量购买',
                param : url_params,
                //disable_snspay: '',
                // sandbox: true,
                context: 'capacity_purchase',
                onSuccess : function (opt) { // 注意：尽量不要使用这个回调，部分支付渠道如快捷支付不会触发这个回调，无法解决
                    me.view.mini_tip.ok('购买成功！')
                },
                onCancel : function (opt) {

                },
                onClose : function (opt) {
                    location.reload();
                }
            });

        },

        /**
         * 购买容量
         * 拉取下单失败
         * @param msg
         */
        on_order_ajax_error: function (msg) {
            this.view.mini_tip.warn('下单失败，请重试');

            var console_log = [];
            console_log.push('【on_order_ajax_error】：', JSON.stringify(msg));
            logger.dcmdWrite(console_log, 'web_capacity_purchase_monitor', msg.code, 1);
        },

        /**
         * 购买容量
         * 拉取商品信息失败
         */
        on_goods_info_ajax_error: function(msg) {
            this.view.mini_tip.warn('商品信息获取失败，请重试');

            var console_log = [];
            console_log.push('【on_goods_info_ajax_error】：', JSON.stringify(msg));
            logger.dcmdWrite(console_log, 'web_capacity_purchase_monitor', msg.code, 1);
        },

        /**
         * 会员开通或续费
         * @param month
         * @param event
         */
        on_pay: function(month, event) {
            var me = this,
                skey = cookie.get('skey'),
                wx_login_ticket = cookie.get('wx_login_ticket'),
                aid = constants.AID;

            // 如果是在容量购买页直接开通会员
            if (/^(http:|https)\/\/www\.weiyun\.com\/vip\/capacity_purchase.html/.test(location.href)) {
                aid = 'web_capacity_purchase';
            }

            if(IS_WEIXIN_USER) {
                var url = https_tool.translate_url('http://h5.weiyun.com/wx_pc_pay?type=vip');
                url = https_tool.translate_cgi('http://web2.cgi.weiyun.com/web_wx_login.fcg?cmd=wx_open_vip&no_referer=1&rurl=' + encodeURIComponent(url));
                // 有可能文本过长，导致报错
                try {
                    me._showQR(url);
                } catch (err){
                    console.error(err);
                }
                this.view.get_$dialog_title().text('开通微云会员');
                this.view.get_$dialog().show();
            } else {
                cashier && cashier.dialog && cashier.dialog.buy({
                    codes : 'wyclub',
                    scene : 'minipay',
                    type : 'service',
                    aid : aid,
                    amount : month,
                    amountType : 'month',
                    channels: 'qdqb,kj,weixin',
                    target : 'self',
                    zIndex : 5000,
                    preventDragging: false,
                    onLoad : function() {},
                    onFrameLoad : function() {},
                    onSuccess : function (opt) {
                        me.view.get_$tips().addClass('success');
                        me.view.get_$tips().show();
                        setTimeout(function() {
                            me.view.get_$tips().hide();
                        }, 2000);

                        // logger url
                        logger.report('Qaid', 'origin url: ' + location.href + ';;;;pay url:' + $('.cash_dialog_frame').attr('src'));
                    },
                    onError : function (opt) { },
                    onClose : function (opt) {
                        setTimeout(function() {
                            me.view.get_$tips().hide();
                            if(me.view.get_$tips().hasClass('success')) {
                                location.reload();
                            }
                        }, 2000);
                    },
                    onNotify : function(opt) {}
                })
            }
        },

        on_logout: function() {
            //@ptlogin, start
            if (window.pt_logout) {
                 pt_logout.logoutQQCom(function() {
                     query_user.destroy();
                     location.reload();
                 });
            } else {
                 require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                     pt_logout.logoutQQCom(function() {
                         query_user.destroy();
                         location.reload();
                     });
                 });
            }
            //query_user.destroy();
            //location.reload();
	        //@ptlogin, end
        },

        /**
         * 生成二维码
         * @param url
         */
        _showQR : function (url) {
            var isCanvas = !!document.createElement('canvas').getContext,
                qrcode = $('.j-qrcode'),
                table;
            if (!$.fn.qrcode) {
                require.async('jquery_qrcode', function () {
                    renderQRCode();
                })
            } else {
                renderQRCode();
            }

            function renderQRCode() {
                qrcode.html('');
                qrcode.qrcode({
                    render: isCanvas ? 'canvas' : 'table',
                    width: isCanvas ? 180 : 180,
                    height: isCanvas ? 180 : 180,
                    correctLevel: 3,
                    text: url
                });
                qrcode.attr('data-url', url);
                if (!isCanvas) {
                    table = $(qrcode.children());
                    table.css('margin', ((qrcode.width() - table.width()) / 2) + 'px');
                }
            }
        }
    });
});define.pack("./ad_link",["lib","common","$","./tmpl"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        cookie = lib.get('./cookie'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        tmpl = require('./tmpl'),
        request = common.get('./request'),
        undefined;

    var BOARD_ID = 2559, // qboss
        NEED_CNT = 3;

    var ad_link = {

        render : function() {
            this._render_qboss_ad();
        },

        _render_qboss_ad: function() {
            var uin = query_user.get_uin_num();

            //微信帐号不需要拉取qboss广告或未登录的不展示qboss广告位
            if(cookie.get('wy_uf') == '1' || !uin) {
                return;
            }

            var opt = {
                board_id: BOARD_ID,
                need_cnt : NEED_CNT,
                uin: uin
            };
            var me = this;

            this.load_ad(opt)
                .done(function(rspData) {
                    var ad;
                    if(rspData.data && rspData.data.count > 0 && rspData.data[BOARD_ID] && (ad = rspData.data[BOARD_ID].items) && ad.length > 0) {
                        me.init_ad_data(ad);
                        me.render_ad();
                        me._bind_events();
                    }
                });
        },

        render_ad: function() {
            this.sort_data();
            this._$ad = $(tmpl.ad_qboss({
                list: this.list
            }));
            $('#ad_container').append(this._$ad);
            $('.banner-wrap').show();
        },

        //根据投放顺序进行排序
        sort_data: function() {
            this.list.sort(this.compare)
        },

        compare: function(item, next_item) {
            var bosstrace = item.bosstrace,
                next_bosstrace = next_item.bosstrace;
            if(bosstrace && next_bosstrace) {
                return bosstrace.localeCompare(next_bosstrace);
            }
            return true;
        },

        //保存广告数据
        init_ad_data: function(data) {
            var item,
                list = [],
                opt = {},
                uin = query_user.get_uin_num();

            for(var i=0; i<data.length; i++) {
                item = data[i];
                opt.bosstrace = item.bosstrace;
                opt.extdata = JSON.parse(item.extdata);
                opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
                opt.from = 1;  //from：  1 pc， 2 wap， 3 手机
                opt.uin = uin;
                this.reporter(opt);
                list.push(opt);
                opt = {};
            }
            if(this.list && $.isArray(this.list)) {
                this.list = this.list.concat(list);
            } else {
                this.list = list;
            }
        },

        _bind_events: function() {
            var me = this;
            this._$ad.on('click', '[data-id]', function() {
                var id = $(this).attr('data-id');
                if(me.list[id]) {
                    me.list[id]['qboper'] = 2;
                    me.reporter(me.list[id]);
                    var s_url = encodeURIComponent(me.list[id].extdata['url'] || me.list[id].extdata['link']),
                        url = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent('http://weiyun.qzone.qq.com?from=1000&s_url=' + s_url);
                    window.open(url);
                }
            });
        },

        show_ad: function(){
            this._$ad && this._$ad.show();
        },

        hide_ad: function() {
            this._$ad && this._$ad.hide();
        },

        remove_ad: function() {
            this._$ad && this._$ad.remove();
        },

        reporter: function(data) {
            var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                from: data.from,
                uin: data.uin,
                bosstrace: data.bosstrace,
                qboper: data.qboper
            });
            //上报
            var img = new Image();
            img.id = 'item_' + data.bosstrace;
            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
            };
            img.src = report_url;
        },

        load_ad: function(opt) {
            var defer = $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy',
                data : opt,
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback" + (+new Date()),
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });
            return defer;
        }
    };

    $.extend(ad_link, events);

    return ad_link;
});
/**
 * Created by maplemiao on 25/11/2016.
 */
"use strict";

define.pack("./ar",["lib","common","$","./busiConfig"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = common.get('./module'),
        urls = common.get('./urls');

    var busiConfig = require('./busiConfig');

    // async request
    return new Module('ar', {
        /**
         * 购买方法
         * @param {Object} options
         * @param options.ruleid
         * @param options.buy_num
         * @public
         */
        buy : function(options) {
            var me = this;

            me._goods_info_ajax(options);
        },
        /**
         * 登录态相关信息
         */
        sessionInfo : {
            session_type: cookie.get('login_apptoken_type') === '1' ? 'qq' : 'weixin',
            access_token: cookie.get('login_apptoken_type') === '1' ? '' : cookie.get('access_token'),
            login_apptoken_type: cookie.get('login_apptoken_type'),
            login_apptoken: cookie.get('login_apptoken'),
            login_apptoken_uid : cookie.get('login_apptoken_uid')
        },
        /**
         * 营收活动平台配置相关信息，空间营收平台使用参数
         */
        actInfo : {
            // appid是计平那边支付需要的
            // appid是qzone营收平台那边给的传手机 1450008585，PC 1450008595
            // 特殊逻辑：微信在支付那里走H5的流程，因此也使用手机的appid
            appid: (IS_MOBILE || IS_WEIXIN_USER) ? busiConfig.QZONE_ACT_PLATFORM_APPID_MOBILE : busiConfig.QZONE_ACT_PLATFORM_APPID_PC,
            // actid和ruleid是在活动平台由后台配置的，http://actboss.cm.com/
            actid: busiConfig.QZONE_ACT_PLATFORM_ACTID,
            ruleid: 0, // override
            login_type: 3 // login_type为3才根据10002来微云后台那边鉴权
        },

        // private method

        /**
         * 计算gtk
         * @return {number}
         * @private
         */
        _get_gtk : function() {
            var hash = 5381, skey = cookie.get('skey');

            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },
        /**
         * 拉取商品信息
         * @param {Object} options
         * @param {number} options.ruleid
         * @param {number} options.buy_num
         * @private
         */
        _goods_info_ajax : function (options) {
            var me = this;
            var ruleid = options && options.ruleid,
                buy_num = options && options.buy_num;
            me.actInfo.ruleid = ruleid;
            var goods_params = {
                appid: me.actInfo.appid,
                actid: me.actInfo.actid,
                ruleid: ruleid,
                login_type: me.actInfo.login_type,
                buy_num: buy_num, // 购买数量
                g_tk: me._get_gtk()
            };

            $.ajax({
                type: 'get',
                url: '//h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_info_openid',
                data : goods_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"goods_success_callback",
                success: function(resData){
                    if (resData.code === 0) {
                        var params = {
                            total_price: (resData.data || {}).total_price || 0
                        };
                        $.extend(params, goods_params);
                        me._order_ajax(params);
                    } else {
                        me.trigger('action', 'goods_info_ajax_error', resData);
                    }
                },
                error: function(ret, msg) {
                    me.trigger('action', 'goods_info_ajax_error', msg);
                }
            });
        },

        /**
         * 商品下单CGI
         * @param params
         * @private
         */
        _order_ajax : function (params) {
            var me = this;
            // 这个文案显示在购买页面上，显示商品介绍
            var order_params = {
                appid: me.actInfo.appid,
                g_tk: me._get_gtk(),
                actid: params.actid,
                ruleid: params.ruleid,
                buy_num: params.buy_num,
                req_price: params.total_price,
                login_type: params.login_type,
                pfkey: 'pfkey',
                aid: 'aid', // 这个是营收后台的aid，目前没有用到，属于预埋接口，我们自己定义就好。目前查询是根据ruleid去查的
                item_pic: '//qzonestyle.gtimg.cn/qz-proj/wy-pc/img/icon-pic-storage-pay.png',   // 商品信息，自己根据需求添加
                item_name: (busiConfig.COUPON_RULEID_INFO_MAP[params.ruleid] || {}).name, // 商品信息，自己根据需求添加
                item_desc: (busiConfig.COUPON_RULEID_INFO_MAP[params.ruleid] || {}).desc, // 商品信息，自己根据需求添加
                openid: me.sessionInfo.login_apptoken_uid,
                openkey: me.sessionInfo.session_type === 'qq' ? me.sessionInfo.login_apptoken : me.sessionInfo.access_token,
                session_type: me.sessionInfo.session_type === 'qq' ? 'skey' : 'weixin'
            };

            $.ajax({
                type: 'get',
                url: '//h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_order_openid',
                data: order_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"order_success_callback",
                success: function (resData) {
                    if (resData.code === 0) {
                        resData = resData && resData.data || {};
                        me.trigger('action', 'order_ajax_success', resData.url_params);
                    } else {
                        me.trigger('action', 'order_ajax_error', resData);
                    }
                },
                error: function (ret, msg) {
                    me.trigger('action', 'order_ajax_error', msg);
                }
            });
        }
    });
});define.pack("./busiConfig",[],function(require, exports, module) {
    return {
        // 空间活动平台提供的appid，手机端和PC端做区分
        "QZONE_ACT_PLATFORM_APPID_MOBILE":1450008585,
        "QZONE_ACT_PLATFORM_APPID_PC":1450008595,
        // 空间活动平台配置的活动id
        "QZONE_ACT_PLATFORM_ACTID": 630,
        // 容量和ruleid的映射
        "SPACE_RULEID_MAP": {
            "20G": 3200,
            "50G": 3201,
            "200G": 3202,
            "1T": 3203
        },
        // ruleid和容量券购买页面标题、介绍的映射
        "COUPON_RULEID_INFO_MAP": {
            "3200": {
                "name": "微云20G容量",
                "desc": "购买微云20G容量，可在现有容量基础上叠加使用"
            },
            "3201": {
                "name": "微云50G容量",
                "desc": "购买微云50G容量，可在现有容量基础上叠加使用"
            },
            "3202": {
                "name": "微云200G容量",
                "desc": "购买微云200G容量，可在现有容量基础上叠加使用"
            },
            "3203": {
                "name": "微云1T容量",
                "desc": "购买微云1T容量，可在现有容量基础上叠加使用"
            }
        }
    }
});/**
 * vip store
 * @author : xixinhuang
 * @date: 2016/10/22
 **/
define.pack("./store",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = common.get('./module'),
        undefined;

    var store = new Module('store', {
        init: function (data) {
            var me = this;

            me.data = data;
        },

        is_weiyun_vip: function() {
            return this.data['isVip'];
        },

        is_weiyun_old_vip: function() {
            return this.data['oldVip'];
        },

        is_weixin_user: function() {
            return this.data['isWxUser'];
        },

        get_head_url: function() {
            return this.data['avatar'] || this.data['headUrl'] || '';
        },

        get_expires_date: function() {
            return this.data['expiresDate'] || '';
        }
    });

    return store;
});define.pack("./ui",["lib","common","$"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        cookie = lib.get('./cookie'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip_v2'),

        undefined;

    return new Module('vip_ui', {

        render: function () {
            this.mini_tip = mini_tip;

            this.listenTo(session_event, 'session_timeout', this.to_login);
            this.set_nav_act();
            this.set_full_year();
            this._bind_events();
        },


        /**
         * 根据当前页面URL
         * 设置导航栏选中状态
         */
        set_nav_act: function () {
            var added = false;
            var page = location.pathname.split('/').pop().split('.')[0];
            $.map(this.get_$nav_list().find('li'), function (item, index) {
                if ($(item).data('page') === page) {
                    $(item).addClass('act');
                    added = true;
                }
            });

            if (page === 'announcement') { // 如果是公告页，那么久都不是选中态
                added = true;
            }
            // 其他各种奇怪的url都是默认weiyun_vip这个页面
            !added && this.get_$nav_list().find('li[data-page="weiyun_vip"]').addClass('act');
        },

        to_login: function() {
            var me = this;
            require.async('qq_login', function (mod) {
                var qq_login = mod.get('./qq_login'),
                    qq_login_ui = qq_login.ui;

                me
                    .stopListening(qq_login)
                    .stopListening(qq_login_ui)
                    .listenTo(qq_login, 'qq_login_ok', function () {
                        //me.trigger('login_done');
                        //location.reload();
                        var s_url = location.href;
                        location.href = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl='
                            + encodeURIComponent('http://jump.weiyun.qq.com?from=2000&s_url=' + encodeURIComponent(s_url));
                    })
                    .listenToOnce(qq_login_ui, 'show', function () {

                    })
                    .listenToOnce(qq_login_ui, 'hide', function () {
                        me.stopListening(qq_login_ui);
                    });
                qq_login.show();
            });
        },

        _bind_events: function() {
            var me = this;
            this.get_$ct().on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                switch (action_name) {
                    case 'close_qrcode':
                        me.get_$dialog().hide();
                        break;
                    case 'login':
                        me.to_login();
                        break;
                    case 'pay' :
                        var month = $target.attr('data-id');
                        me.trigger('action', action_name, month, e);
                        break;
                    case 'capacity_purchase':
                        var type = $target.closest('li').data('type');
                        me.trigger('action', action_name, type, e);
                        break;
                    default :
                        me.trigger('action', action_name, e);
                }
            });
        },

        set_full_year: function() {
            var year = 2015,
                $this_year = $('#this_year');
            if(new Date().getFullYear() > year) {
                year = new Date().getFullYear();
                $this_year.text(year);
            }
        },

        show_error_tips: function (err) {
            //this._$err.html(err).show();
            //this._$tip.hide();
        },

        get_$ct: function() {
            return this._$ct || (this._$ct = $('#container'));
        },

        get_$dialog: function() {
            return this._$dialog || (this._$dialog = $('.j-qr-dialog'));
        },

        get_$dialog_title: function() {
            return this._$dialog_title || (this._$dialog_title = $('.j-qr-dialog-title'));
        },

        get_$tips: function() {
            return this._$tips || (this._$tips = $('.j-tips'));
        },

        get_$nav_list: function() {
            return this._$nav_list || (this._$nav_list = $('.j-nav-list'));
        }
    });
});define.pack("./vip",["lib","common","$","./ad_link","./store","./ui","./Mgr","./ar"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = common.get('./module'),
        huatuo_speed = common.get('./huatuo_speed');

    var ad_link = require('./ad_link'),
        store = require('./store'),
        ui = require('./ui'),
        Mgr = require('./Mgr'),
        ar = require('./ar'),

        undefined;

    var mgr = new Mgr({
        store: store,
        view: ui,
        ar: ar
    });

    var vip = new Module('vip', {

        /**
         * 页面初始化
         * @param {Object} serv_rsp 直出的数据
         */
        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            store.init(serv_rsp);
            ad_link.render();
            ui.render();


            var point_key;
            switch (window.g_which_page) {
                case 'vip' :
                    point_key = '21378-1-1';
                    break;
                case 'growth':
                    point_key = '21378-1-2';
                    break;
                case 'privilege':
                    point_key = '21378-1-4';
                    break;
                default:
                    point_key = '21378-1-1';
            }

            $(document).ready(function () {
                huatuo_speed.store_point(point_key, 23, window.g_dom_ready_time - (huatuo_speed.base_time || window.g_start_time)); // dom ready
                huatuo_speed.store_point(point_key, 24, +new Date() - (huatuo_speed.base_time || window.g_start_time)); // active
                huatuo_speed.report(point_key, true);
            })
        }
    });


    return vip;
});
//tmpl file list:
//vip/src/vip.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ad_qboss': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var lib = require('lib');
        var text = lib.get('./text');
        var data = data || {};
        var list = data.list;
        var list_count = list.length;
    __p.push('    <!-- banner s -->\r\n\
        <ul class="banner-list clearfix" style="width:');
_p(list_count);
__p.push('00%;">');

            for (var i = 0; i < list_count; i++) {
                var item = list[i];
                var ext_data = item && item.extdata;
            __p.push('                <li class="item" data-id="');
_p(i);
__p.push('" >\r\n\
                    <img src="');
_p(text.text(ext_data && ((ext_data.picture2 || ext_data.img)) || '').replace(/^(http:|https:)/, ''));
__p.push('">\r\n\
                </li>');

            }
            __p.push('        </ul>\r\n\
    <!-- banner e -->');

}
return __p.join("");
}
};
return tmpl;
});
