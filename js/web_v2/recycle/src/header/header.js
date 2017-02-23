/**
 * render _main_bar1（编辑态） & _main_bar2（列表上方的提示和按钮）& cancel_all_selected
 * @author maplemiao
 * @date 16-7-27
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var header = new Module('recycle_header', {
        render: function () {
            var me = this;

            me
                .on('activate', function () {
                    me._render_main_bar1();
                    me._render_main_bar2();
                    me._add_listening();
                })
                .on('deactivate', function () {
                    me._destroy_main_bar1();
                    me._destroy_main_bar2();
                    me._remove_listening();
                });
        },

        _add_listening: function () {
            var me = this;

            // 编辑态中“取消选择”按钮，把事件抛出到src/ui.js中处理
            me.listenTo(global_event, "edit_cancel_all", function(e) {
                me.trigger('edit_cancel_all', e);
            });
        },

        _remove_listening: function () {
            var me = this;

            me.stopListening(global_event, 'edit_cancel_all');
        },

        _destroy_main_bar1: function () {
            var $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.off('click.batch_restore');
            $_main_bar1.off('click.batch_shred');
            $_main_bar1.empty();
        },

        _destroy_main_bar2: function () {
            var $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.off('click.empty_recycle');
            $_main_bar2.empty();

            $_main_bar2.hide();
        },

        _render_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.append(tmpl._main_bar1()).show();
            $_main_bar1
                .on('click.batch_restore', '[data-action="restore"]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.trigger('action', 'restore', e);
                })
                .on('click.batch_shred', '[data-action="shred"]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.trigger('action', 'shred', e);
                });
        },

        _render_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.show().append(tmpl._main_bar2());

            // “全部清空”按钮事件监听
            $_main_bar2
                .on('click.empty_recycle', '[data-action="empty_recycle"]', function (e) {
                    me.trigger('action', 'empty_recycle', e);
                });
        }
    });
    
    return header;
});