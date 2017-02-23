/**
 * _main_bar1（编辑态右方按钮） & _main_bar2（列表上方提示信息部分）
 * @author hibincheng
 * @modified maplemiao
 * @date 2016-08-20
 *
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var header = new Module('header', {
        render: function () {
            var me = this;

            if (!this.rendered) {
                this.rendered = true;
            }
        },

        activate: function () {
            var me = this;

            me._render_main_bar1();
            me._render_main_bar2();
        },

        deactivate: function () {
            var me = this;

            me._destroy_main_bar1();
            me._destroy_main_bar2();
        },

        _render_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.append(tmpl._main_bar1()).show();
            $_main_bar1
                .on('click.bat_cancel_share', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    me.trigger('action', 'bat_cancel_share', e);
                })
        },
        _destroy_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.off('click');
            $_main_bar1.empty();
        },

        _render_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.append(tmpl._main_bar2());
            $_main_bar2.show();
        },

        _destroy_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.empty();
            $_main_bar2.hide();
        },

        bind_store: function (store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this.on_data_datachanged, this);
                old_store.off('clear', this.on_data_clear, this);
                old_store.off('update', this.on_data_update, this);
                old_store.off('remove', this.on_data_remove, this);
            }

            store.on('datachanged', this.on_data_datachanged, this);
            store.on('clear', this.on_data_clear, this);
            store.on('update', this.on_data_update, this);
            store.on('remove', this.on_data_remove, this);
            //
            this.store = store;
        },
        on_data_clear: function () {
        //    on data clear
        },
        on_data_update: function (e) {
        //    on data update
        },
        on_data_remove: function () {
            var me = this;
            
            main_ui.toggle_edit(false);
        },
        on_data_datachanged: function() {
        //    on data datachanged
        }
    });
    return header;

});