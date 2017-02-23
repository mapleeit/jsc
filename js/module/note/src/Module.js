/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:00
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        common = require('common'),
        OldModule = common.get('./module'),
        query_user = common.get('./query_user'),
        main = require('main'),
        main_ui = main.get('./ui'),
        $ = require('$');

    var noop = $.noop;
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module: true,
        render: $.noop,
        activate: $.noop,
        deactivate: $.noop
    };
    var Module;
    Module = inherit(Event, {
        constructor: function (cfg) {
            $.extend(this, cfg);
        },
        get_list_view: function () {
            var view = this.list_view;
            if (!view.rendered) {
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function () {
            var header = this.list_header;
            if (!header.rendered) {
                header.render(this.$bar1_ct);
            }
            return header;
        },
        activate: function (params) {
            this.get_list_header().show();
            this.get_list_view().show();
            this.on_activate(params);
        },
        deactivate: function () {
            this.get_list_header().hide();
            this.get_list_view().hide();
            this.on_deactivate();
        },
        on_activate: noop,
        on_deactivate: noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module: function () {
            var module = this.old_module_adapter, me = this;
            if (!module) {
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui: dummy_module_ui,
                    render: function () {
                        main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$top_ct = main_ui.get_$top();
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$column_ct = main_ui.get_$share_head();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate: function (params) {

                        if (query_user.get_cached_user()) {
                            me.activate(params);
                        } else {
                            me.listenToOnce(query_user, 'load', function () {
                                me.activate();
                            });
                        }
                    },
                    deactivate: function () {
                        //yuyanghe   判断列表是否为空 为空时 移除share-empty-module 样式
                       // if (me.get_list_view().store.size() == 0) {
                            // yuyanghe 修复运营页面头部无线条BUG  用.show()命令最近文件会出现bug

                       // }
                        me.deactivate();
                        main_ui.get_$bar1().css('display', '');
                    }
                });
            }
            return module;
        }
    });
    return Module;
});
