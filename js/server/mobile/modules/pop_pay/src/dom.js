/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module');

    return new Module('dom', {
        get_$pay_btn: function() {
            var me = this;

            return me.$pay_btn || (me.$pay_btn = $('.j-pay-btn'));
        },

        get_$price_list: function() {
            var me = this;

            return me.$price_list || (me.$price_list = $('.j-price-list'));
        },

        get_$banner: function() {
            var me = this;

            return me.$banner || (me.$banner = $('.j-banner'));
        },

        get_$price_num: function() {
            var me = this;

            return me.$price_num || (me.$price_num = $('.j-price-num'));
        },

        get_$other_input: function() {
            var me = this;

            return me.$other_input || (me.$other_input = $('.j-other-input'));
        }
    })
});