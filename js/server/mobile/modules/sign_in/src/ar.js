/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls'),
        request = common.get('./request'),
        https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants');

    var busiConfig = require('./busiConfig');

    // async request
    return new Module('ar', {

        /**
         * 限时兑换
         * @param rule_id
         */
        exchange: function(rule_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_exchange_weiyun?login_type=3&actid=360&ruleid=' + rule_id + '&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if (result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneExchangeAJAX'
                        })
                    }
                }
            });

            return def;
        },

        /**
         * 抽奖
         * @param rule_id
         * @return {*}
         */
        lottery: function (rule_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_lottery_weiyun?login_type=3&actid=360&ruleid=' + rule_id + '&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if (result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneLotteryAJAX'
                        })
                    }
                }
            });

            return def;
        },

        save_address: function(data) {
            $.extend(data, {
                login_type: 3,  // login_type为3的前提下，根据cookie里的那个appid为10002的情况下才去你们微云那边鉴权。
                format: 'json', // 确定回包为json，不加的话会返回jsonp
                actid: 360      // 活动id
            });
            if(this.isloading){
                return;
            }
            this.isloading = true;
            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_set_addr?g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                type: 'POST',
                url : _url,
                data: data,
                timeout: 10000,
                success: function(result){
                    result = JSON.parse(result);
                    me.isloading = false;
                    if(result.code === 0) {
                        def.resolve(data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneSetAddressAJAX'
                        });
                    }
                }
            });

            return def;
        },

        get_history: function () {
            if(this.isloading){
                return;
            }
            this.isloading = true;
            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_record?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                type: 'GET',
                url : _url,
                data: {
                    format: 'json'
                },
                timeout: 10000,
                success: function(result){
                    result = JSON.parse(result);
                    me.isloading = false;
                    if(result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneGetHistoryAJAX'
                        });
                    }
                }
            });

            return def;
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

        _get_wxtk: function() {
            var hash = 5381,
                skey = cookie.get('wx_login_ticket');
            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        }


    });
});