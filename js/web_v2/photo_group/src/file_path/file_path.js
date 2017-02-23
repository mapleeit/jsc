/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event').namespace('photogroup'),

        cur_node,
        last_enable,
        undefined;

    var file_path = new Module('photo_file_path', {

        ui: require('./file_path.ui'),

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 最后一级目录
         * @param {Boolean} enable 默认true
         */
        update: function (last_lv_node, enable) {
            enable = enable !== false;

            if (last_lv_node === cur_node && enable === last_enable) {
                return;
            }

            if (last_lv_node) {

                var nodes = [],
                    node = last_lv_node;
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                this.ui.update_$nodes(last_lv_node, nodes, enable);
            } else {
                this.ui.back();
                cur_node = null;
            }
        },

        toggle: function (visible) {
            this.ui.toggle(visible);
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
            this.ui.activate();
            this.ui.__rendered = false;
        },

        on_deactivate: function() {
            this.ui.remove_$path();
            this.ui.deactivate();
            this.deactivate();
            this.stopListening(global_event, 'window_resize');
        }
    });

    return file_path;
});