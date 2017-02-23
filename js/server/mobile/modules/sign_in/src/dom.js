/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Module = lib.get('./Module');

    return new Module('dom', {
        // common
        get_$body: function() {
            var me = this;

            return me.$body || (me.$body = $('.base_main_div'));
        },

        get_$all_container: function() {
            var me = this;

            return $('.j-container');
        },

        // index
        get_$index_container: function() {
            var me = this;

            return me.$index_container || (me.$index_container = $('.j-index-container'));
        },

        get_$personal_center: function() {
            var me = this;

            return me.$personal_center || (me.$personal_center = $('.j-personal-center'));
        },

        get_$item_gift: function() {
            var me = this;

            return me.$item_gift || (me.$item_gift = $('.j-item-gift'));
        },

        get_$more_bar: function() {
            var me = this;

            return me.$more_bar || (me.$more_bar = $('.j-more-bar'));
        }
    });
});