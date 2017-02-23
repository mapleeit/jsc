/**
 * 安装客户端
 * @author bondli
 * @date 13-11-05
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),

        Module = common.get('./module'),

        undefined;

    require('app_download_css');
    var install_app = new Module('install_app', {

        ui: require('./install_app.ui'),

        render: function (config) {

        },

        show: function(name) {
            this.ui.show_download(name);
        },

        show_install_guide: function() {
            this.ui.show_install_guide();
        }

    });

    return install_app;
});