/**
 * mgr
 * @author : maplemiao
 * @time : 2016/8/22
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        //query_user = common.get('./query_user'),

        IS_MOBILE = window.IS_MOBILE,
        undefined;

    var mgr = new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
        },

        on_buy_coupon : function (options) {
            var me = this;
            var skey = cookie.get('skey'),
                p_skey = cookie.get('p_skey'),
                wx_login_ticket = cookie.get('wx_login_ticket');

            var coupon_type = options && options.coupon_type;

            if (me.loading) {
                return;
            }

            me.loading = true; // loading状态

            var goods_params = {
                // appid是计平那边支付需要的
                // appid是qzone营收平台那边给的手机端传1450006532，PC端传1450006533
                appid: IS_MOBILE ? 1450006532 : 1450006533,
                // actid和ruleid是在活动平台由后台配置的，http://actboss.cm.com/
                actid: 545,
                ruleid: coupon_type,
                buy_num: 1, // 购买数量
                skey: cookie.get('skey'), // qzone营收平台需要这个去米大师那边下单使用
                g_tk: me._get_gtk(),
                login_type: 3 // login_type为3才根据10002去你们那边鉴权。
            };

            // pull goods information
            $.ajax({
                type: 'get',
                url: constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_info_weiyun?',
                data : goods_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"goods_success_callback",
                success: function(resData){
                    if(resData.code) {
                        logger.write(['ajax error ---> fcg_open_qzact_pic_info_weiyun '], 'h5_session_timeout', resData.code);
                        me.view.reminder.error(resData.message || '下单失败' + resData.code);
                        return;
                    }

                    me.loading = false;
                    if(resData.code) {
                        me.view.reminder.error(resData.message || '请求失败，请稍后重试！');
                    } else {
                        // on success: go to order
                        me.order_ajax(resData);
                    }
                    logger.write(['ajax success ---> fcg_open_qzact_pic_info_weiyun '], 'h5_session_timeout', 0);
                }
            });
        },

        // 点击“立即使用”时进入
        on_use_coupon : function (options) {
            var me = this;

            var tip = me.store.is_using_coupon()
                ? '您正在使用一张券，是否继续使用？'
                : '确定要立即使用流量券吗？';
            me.view.confirm({
                tip: tip,
                sub_tip: '使用后仅24小时内有效，超过后会清零',
                ok_fn: function () {
                    me.on_confirm_use(options.coupon_id);
                },
                cancel_fn: function(){},
                btns_text: ['立即使用','取消']
            });
        },

        // 二次确认“立即使用”
        on_confirm_use: function (coupon_id) {
            var me = this;

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/weiyun_activity.fcg'),
                cmd: 'WeiyunFlowCouponUse',
                cavil: true,
                body: {
                    flow_coupon_id: coupon_id
                }
            }).ok(function (rsp) {
                me.view.reminder.ok('兑换成功', function () {
                    if (me.schemeTimeoutId) {
                        me.schemeTimeoutId = null;
                    }
                    location.href = 'weiyun://uploadmanager/restartall';
                    me.schemeTimeoutId = setTimeout(function () {
                        location.href = 'weiyun://activity/finish';
                    }, 500);
                });
                logger.write(['xhr_post success ---> WeiyunFlowCouponUse '], 'h5_session_timeout', 0);
            }).fail(function (msg, ret) {
                //登录态失效上报
                logger.write(['xhr_post error ---> WeiyunFlowCouponUse '], 'h5_session_timeout', ret);
                me.view.reminder.error('兑换失败');
            });
        },

        order_ajax: function (resData) {
            var me = this;

            var data = resData.data,
                totalPrice = data.total_price,
                count = ((data || {}).prize || []).length,
                firstItem = ((data || {}).prize || [])[0] || {},
                // 这个文案显示在购买页面上，显示商品介绍
                COUPON_RULEID_INFO_MAP = {
                    2705: {
                        name: '微云-100G上传流量券',
                        desc: '24小时内有效。在单日上传流量的基础上叠加使用。'
                    },
                    2704: {
                        name: '微云-无限上传流量券',
                        desc: '24小时内可无限量上传。（可上传流量小于等于您的微云空间总剩余容量）'
                    }
                };
            var uin = cookie.get('uin') ? parseInt(cookie.get('uin').replace(/^[oO0]*/, '')) : '';
            var order_params = {
                appid: IS_MOBILE ? 1450006532 : 1450006533,
                g_tk: me._get_gtk(),
                actid: firstItem.actid,
                ruleid: firstItem.ruleid,
                buy_num: count,
                req_price: totalPrice, // 下单的支付总价格
                pfkey: 'pfkey',
                aid: me._get_aid(totalPrice), // 渠道统计使用的字符串
                item_pic: 'REQUEST, but not used in h5, only be used on pc',      // 商品信息，自己根据需求添加
                item_name: (COUPON_RULEID_INFO_MAP[firstItem.ruleid] || {}).name, // 商品信息，自己根据需求添加
                item_desc: (COUPON_RULEID_INFO_MAP[firstItem.ruleid] || {}).desc, // 商品信息，自己根据需求添加
                skey: cookie.get('skey'),
                login_type: 3
            };

            $.ajax({
                type: 'get',
                url: constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_order_weiyun?',
                data: order_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"order_success_callback",
                success: function (resData) {
                    if(resData.code) {
                        logger.write(['ajax error ---> fcg_open_qzact_pic_order_weiyun '], 'h5_session_timeout', resData.code);
                        me.view.reminder.error(resData.message || '下单失败' + resData.code);
                        return;
                    }

                    logger.write(['ajax success ---> fcg_open_qzact_pic_order_weiyun '], 'h5_session_timeout', 0);

                    var successUrl = location.href;
                    var resData = resData && resData.data || {};
                    if(!IS_MOBILE) {
                        me.mini_pay(resData);
                        return;
                    }
                    location.href = 'https://pay.qq.com/h5/index.shtml?' +
                        '_wv=1031' +
                        '&m=buy' +
                        '&c=goods' +
                        '&pf=' + 'qzone_m-cloudlet-html5-androidpay' +
                        '&params=' + encodeURIComponent(resData.url_params) +
                        '&wechat=1' + // 这个在这里好像没有用到，是用来微信登陆使用的
                        '&wxWapPay=1' + // 保留用来调微信支付渠道的
                        '&openid=' + uin +
                        '&aid=' + me._get_aid(totalPrice) +
                        '&ru=' + encodeURIComponent(successUrl) +
                        '&pu=' +  encodeURIComponent(successUrl) +
                        '&dc=mcard,hfpay,yb';
                }
            });
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
        },

        on_logout: function() {
            //query_user.destroy();
            location.reload();
        },

        // 计算g_tk
        _get_gtk: function() {
            var hash = 5381,
                skey = cookie.get('skey');
            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },

        _get_aid: function (price) {
            var aid_map = {
                'price100': 'act_coupon_pay_ten',
                'price300': 'act_coupon_pay_thirty'
            }
            return aid_map['price' + price];
        }
    });

    return mgr;
});