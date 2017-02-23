/**
 * 回收站UI逻辑
 * @author jameszuo
 * @date 13-3-22
 * modified by maplemiao 2016.7
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip_v2'),

        tmpl = require('./tmpl'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        header,
        // 列表
        recycle_list,
        recycle_list_ui,

        last_has_files,

        undefined;

    var ui = new Module('recycle_ui', {

        render: function () {
            var me = this;
            header = require('./header.header');
            recycle_list = require('./recycle_list.recycle_list');
            recycle_list_ui = require('./recycle_list.ui');

            me.get_$body().appendTo(main_ui.get_$body_box());

            me.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });

            me
                .on('activate', function () {
                    query_user.on_ready(function () {
                        me.get_$body().show();

                        me
                            .listenTo(recycle_list, 'empty', function () { // 无文件时显示提示
                                me._set_has_files(false);
                                main_ui.sync_size();
                            })
                            .listenTo(recycle_list, 'not_empty', function () { // 有文件时显示列表
                                me._set_has_files(true);
                            })
                            .listenTo(recycle_list_ui, 'add_block_hover', function () {
                                me.get_$body().addClass('block-hover');
                            })
                            .listenTo(recycle_list_ui, 'remove_block_hover', function () {
                                me.get_$body().removeClass('block-hover');
                            })
                            .listenTo(recycle_list_ui, 'select_change', function (sel_meta) {
                                if (sel_meta && sel_meta.files && sel_meta.files.length){
                                    main_ui.toggle_edit(true, sel_meta.files.length);
                                } else {
                                    main_ui.toggle_edit(false);
                                }
                            })
                            .listenTo(header, 'edit_cancel_all', function (e) {
                                recycle_list_ui.cancel_all_selected();
                            });

                        main_ui.sync_size();
                    });


                })
                .on('deactivate', function () {
                    me.get_$body().hide();

                    recycle_list_ui._stop_listen_scroll();
                    me.stopListening(recycle_list, 'empty not_empty');
                });
        },

        // --- 获取一些DOM元素 ---------

        get_$recycle_list: function () {
            return this._$recycle_list || (this._$recycle_list = $('#_recycle_body .list-group-bd'));
        },

        get_$body: function () {
            return this._$body || (this._$body = $(tmpl.body()));
        },

        get_$empty_tip: function () {
            return $('#_recycle_empty_tip');
        },

        /**
         * 不可见时显示空提示
         * @param {Boolean} has_files
         * @private
         */
        _set_has_files: function (has_files) {
            if (last_has_files !== has_files) {
                this.get_$empty_tip().toggle(!has_files);
                last_has_files = has_files;
            }
        }
    });


    return ui;
});