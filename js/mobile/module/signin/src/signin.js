/**
 * H5签到模块
 * @author xixinhuang
 * @date 16-03-28
 */
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
        tmpl = require('./tmpl'),
        store = require('./store'),
        ad_link = require('./ad_link'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var signin = new Module('signin', {

        render: function(data) {
            store.init(data);
            ui.render();
            ad_link.render();
            mgr.init({
                ui: ui,
                store: store
            });
        }
    });


    return signin;
});