/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr');

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
        },

        on_buy_btn: function (options) {
            this.ar.buy(options);
        },

        on_goods_info_ajax_error: function (msg) {
            this.view.reminder.error('商品信息拉取失败，请稍后重试！');
        },

        on_order_ajax_error: function (msg) {
            this.view.reminder.error('商品下单失败，请稍后重试！');
        }
    });
});