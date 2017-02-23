/**
 *
 * @author hibincheng
 * @date 15-05-31
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),

        ui = require('./file_path.ui'),
        all_checker = require('./file_path.all_checker'),
        store = require('./store'),
        selection = require('./selection'),

        cur_node,
        last_enable,

        last_win_width,

        undefined;

    var file_path = new Module('outlink.file_path', {

        render: function() {

            ui.render();
            // 全选
            all_checker.render();

            var me = this;
            this.listenTo(ui, 'click_path', function(dir_key, e) {
                me.trigger('action', 'click_path', dir_key, e);
                me.update(store.get(dir_key));
                all_checker.toggle_check(false);
            }).listenTo(all_checker, 'checkall', function(checked, e) {
                me.trigger('action', 'checkall', checked, e);
            });

            this.listenTo(global_event, 'window_resize', function(win_width) {
                last_win_width = win_width;
                this._resize_trigger_update();
            });



            this.listenTo(selection, 'selected', function(files, is_all) {
                this.toggle_checkall(is_all);
            }).listenTo(selection, 'unselected', function() {
                this.toggle_checkall(false);
            });

            var win_width = $(window).width();
            if(last_win_width && last_win_width !== win_width) { //第一次不会执行,没有保存win_width
                this._resize_trigger_update();
            }

            last_win_width = win_width;

            this.update(store.get_root_node(), true);
        },

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

                while (node.get_parent() && (node = node.get_parent())) {
                    nodes.push(node);
                }
                nodes.reverse();
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                ui.update_$nodes(last_lv_node, nodes, enable);
            }
        },

        toggle_checkall: function(checkabll) {
            all_checker.toggle_check(checkabll);
        }
    });

    return file_path;
});