/**
 * vip mgr module
 * @author : maplemiao
 * @time : 2016/11/25
 **/
define(function(require, exports, module){
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
});