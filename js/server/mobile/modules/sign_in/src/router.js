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

    var router = new Module('router', {

        init: function(root_path) {
            var me = this;
            if(root_path) {
                location.hash = '#' + root_path;
            }

            $(window).on('hashchange', function(e) {
                if(location.hash) {
                    me.trigger('action', 'hash_change', location.hash.slice(1));
                }
            });
        },

        go: function(path) {
            location.hash = '#' + path;
        },

        back: function () {
            window.history.back();
        }
    });

    return router;
});