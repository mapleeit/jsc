define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var coupon = new Module('coupon', {
        render: function (server_rsp) {
            store.init(server_rsp);
            ui.init();
            mgr.init({
                store: store,
                view: ui
            });
        }
    });

    return coupon;
});