/**
 * Created by maplemiao on 25/11/2016.
 */
"use strict";

define(function (require, exports, module) {
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
});