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
        get_$purchase_btn: function() {
            var me = this;

            return me.$purchase_btn || (me.$purchase_btn = $('.j-purchase-btn'));
        },

        get_$body_container: function() {
            var me = this;

            return me.$body_container || (me.$body_container = $('#body_container'));
        },

        get_$question: function() {
            var me = this;

            return me.question || (me.question = $('.j-question'));
        },

        get_$question_dropdown: function() {
            var me = this;

            return me.question_dropdown || (me.question_dropdown = $('.j-question-dropdown'));
        }
    })
});