/**
 * 空间信息
 * @author jameszuo
 * @date 13-3-6
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        request = common.get('./request'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var space_info = new Module('main_space_info', {

        ui: require('./space_info.ui'),

        render: function () {
            var me = this;
            this.once('render', function () {
                query_user.on_every_ready(function (user) {
                    me._refresh_by_user(user);
                });
            });
        },

        refresh: function () {
            var me = this;
            var usr = query_user.get_cached_user();
            if (usr) {
                request.xhr_get({
                    url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
                    cmd: 'get_timestamp',
                    body: { local_mac: '0' }
                })
                    .ok(function (msg, body) {
                        me._refresh(Math.max(0, body['used_space'])||0, Math.max(0, body['total_space'])||0);
                    });
            } else {
                query_user.get(true, false, false, function (user) {
                    me._refresh_by_user(user);
                });
            }
        },

        _refresh_by_user: function (user) {
            this.trigger('load', user.get_used_space(), user.get_total_space());
        },

        _refresh: function (used, total) {
            this.trigger('load', used, total);
        },

        add_used_space_size: function (size) {
            this.ui.add_used_space_size(size);
        }
    });

    return space_info;
});