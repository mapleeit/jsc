/**
 * 回收站UI逻辑
 * @author jameszuo
 * @date 13-3-22
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
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

    // 工具栏
        toolbar,
    // 列表
        rec_list,
        rec_list_ui,
    // 列表头
        rec_header,

        $win = $(window),

        bottom_fix = constants.UI_VER === 'APPBOX' ? 10 : 0,
        bottom_padding,
        last_has_files,

        undefined;

    var ui = new Module('recycle_ui', {

        render: function () {
            var me = this;

            me.get_$body().appendTo(main_ui.get_$body_box());

            toolbar = require('./toolbar.toolbar');
            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');
            rec_header = require('./rec_header.rec_header');

            me.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });


            me
                .on('activate', function () {
                    query_user.on_ready(function () {
                        me.get_$header().show();
                        me.get_$body().show();

                        // 有文件时显示列表，无文件时显示提示
                        me
                            .listenTo(rec_list, 'empty', function () {
                                me._set_has_files(false);
                                me._toggle_$rec_header(false);
                                main_ui.sync_size();
                            })
                            .listenTo(rec_list, 'not_empty', function () {
                                me._set_has_files(true);
                                me._toggle_$rec_header(true);
                            });

                        main_ui.sync_size();
                    });
                })
                .on('deactivate', function () {
//                    if (constants.UI_VER === 'WEB') {
//                        global_event.trigger('page_header_height_changed');
//                    }
                    me.get_$body().hide();
                    me.get_$header().hide();

                    me.stopListening(rec_list, 'empty not_empty');
                });
        },

        // --- 获取一些DOM元素 ---------

        get_$body: function () {
            return this._$body || (this._$body = $(tmpl.body()));
        },

        get_$toolbar: function () {
            return $('#_recycle_toolbar_container');
        },

        get_$empty_tip: function () {
            return $('#_recycle_empty_tip');
        },

        get_$header: function () {
            return rec_header.get_$el();
        },

        _toggle_$rec_header: function (has_files) {
            var me = this;
            if (true === has_files) {
                me.get_$header().show();
            }
            else{
                me.get_$header().hide();
            }
            //me._fix_body_top(has_files);
        },

        /**
         * 设置列表、列表头是否可见，不可见时显示空提示
         * @param {Boolean} has_files
         * @private
         */
        _set_has_files: function (has_files) {
            if (last_has_files !== has_files) {
                // 隐藏列表
                //this.get_$body().toggleClass('recycle-empty', !has_files);
                this.get_$empty_tip().toggle(!has_files);
                this.get_$header().toggle(has_files);
                last_has_files = has_files;
            }
        }
    });


    return ui;
});