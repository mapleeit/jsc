/**
 * Created by maplemiao on 30/11/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Module = common.get('./module'),
        cookie = lib.get('./cookie');

    var tmpl = require('./tmpl');

    var userKey = cookie.get('uin') ? cookie.get('uin') : cookie.get('openid');

    return new Module('capacity_reduce', {
        render: function () {
            var me = this;

            if (me._is_first_show_from_cookie()) {
                me._$el = $(tmpl.capacity_reduce());
                me._$el.appendTo($('body'));

                me._bind_events();

                cookie.set('announced', cookie.get('announced') + ';' + userKey, {
                    expires: 86400,
                    path: '/'
                });
            }
        },

        _is_first_show_from_cookie: function () {
            var me = this;

            if (cookie.get('announced')) {
                var announcedArray = cookie.get('announced').split(';');

                if (announcedArray.indexOf(userKey) !== -1) {
                    return false;
                }
            }

            return true;
         },

        _bind_events: function () {
            var me = this;

            me._$el.on('click', '.j-pop-close-btn', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me._destroy();
            })
        },

        _unbind_events: function () {
            var me = this;

            me._$el.off('click');
        },

        _destroy: function () {
            var me = this;

            me._unbind_events();

            me._$el.remove();
            me._$el = null;
        }
    })
});