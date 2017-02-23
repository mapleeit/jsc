/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";


define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        events = lib.get('./events'),

        undefined;

    var vm = require('./vm');

    var cache;

    var store = new Module('store', {

        init: function(data) {
            cache = data;
        },

        get_data: function () {
            return cache;
        },

        set: function (key, value) {
            cache[key] = value;
        },

        get: function (key) {
            return cache[key];
        },

        update: function (key, value) {
            if (!cache[key]) {
                this.set(key, value);
            } else {
                if (typeof value === 'object') {
                    this.set(key, $.extend(this.get(key), value))
                } else {
                    this.set(key, value);
                }
            }
        }

    });

    return store;
});