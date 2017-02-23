/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";


define(function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        user = common.get('./user'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        store = require('./store'),
        ar = require('./ar'),
        view = require('./view'),
        mgr = require('./mgr'),
        router = require('./router'),

        undefined;

    var signin = new Module('signin', {

        init: function(data) {
            // hash init
            var paths = location.pathname.split('/'),
                cur_path = paths && paths[paths.length-1],
                hash = location.hash? location.hash.slice(1) : '';
            router.init(cur_path);
            if (hash) {
                router.go(hash);
            }

            store.init(data);
            view.render();
            mgr.init({
                view: view,
                ar: ar,
                store: store,
                router: router
            });
        }
    });


    return signin;
});