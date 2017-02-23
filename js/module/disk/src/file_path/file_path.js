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
        global_event = common.get('./global.global_event'),

        all_file_map = require('./file.utils.all_file_map'),

        cur_node,
        last_enable,

        last_win_width,

        undefined;

    var file_path = new Module('disk_file_path', {

        ui: require('./file_path.ui'),

        _resize_trigger_update: function() {
            var last_lv_node = cur_node;

            if(!cur_node) {
                return;
            }
            cur_node = null;
            this.update(last_lv_node);
        },

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

                while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                    nodes.push(node);
                }
                nodes.reverse();
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                this.ui.update_$nodes(last_lv_node, nodes, enable);
            }
        },

        toggle: function (visible) {
            this.ui.toggle(visible);
        },

        //activate deactivate 由disk.ui调用
        activate: function() {
            this.listenTo(global_event, 'window_resize', function(win_width) {
                last_win_width = win_width;
                this._resize_trigger_update();
            });

            var win_width = $(window).width();
            if(last_win_width && last_win_width !== win_width) { //第一次不会执行,没有保存win_width
                this._resize_trigger_update();
            }

            last_win_width = win_width;
        },

        deactivate: function() {
            this.stopListening(global_event, 'window_resize');
        }
    });

    return file_path;
});