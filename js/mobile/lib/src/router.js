/**
 * 目录层级路由模块
 * @author hibincheng
 * @date 2015-03-25
 */
define(function(require, exports, module) {
    var $ = require('$'),

        Module = require('./Module'),

        undefined;

    var cur_path;

    var router = new Module('weixin.router', {

        init: function(root_path) {
            var me = this;
            if(root_path) {
                location.hash = '#' + root_path;
                cur_path = root_path;
            }

            $(window).on('hashchange', function(e) {
                if(location.hash) {
                    var pre_path = cur_path;
                    cur_path = location.hash.slice(1);
                    me.trigger('change', cur_path, pre_path);
                }
            });
        },

        go: function(path) {
            location.hash = '#' + path;
        }
    });

    return router;
});