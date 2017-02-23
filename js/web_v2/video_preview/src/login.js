/**
 * Created by maplemiao on 25/10/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var events = lib.get('./events');
    var widgets = common.get('./ui.widgets');

    module.exports = function () {
        var me = this;

        $.extend(me, events);

        require.async('qq_login', function (mod) {
            var qq_login = mod.get('./qq_login');
            var qq_login_ui = qq_login.ui;

            me
                .stopListening(qq_login)
                .stopListening(qq_login_ui)
                .listenTo(qq_login, 'qq_login_ok', function() {
                    location.reload();
                })
                .listenToOnce(qq_login_ui, 'show', function() {
                    widgets.mask.show('qq_login', null, true);
                })
                .listenToOnce(qq_login_ui, 'hide', function() {
                    widgets.mask.hide('qq_login');

                    me.stopListening(qq_login_ui);
                });

            qq_login.show();
        });
    };
});