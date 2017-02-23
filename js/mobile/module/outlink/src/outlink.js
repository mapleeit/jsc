define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),

        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var outlink = new Module('outlink', {

        render: function(share_info) {
            store.init(share_info);
            ui.render();
            mgr.observe(ui);

            seajs.use(['filetype_icons_css', 'component_base_css', 'component_confirm_css', 'component_tips_css', 'zepto_fx']);
        }
    });

    return outlink;
});