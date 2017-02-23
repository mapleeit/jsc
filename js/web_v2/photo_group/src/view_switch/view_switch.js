/**
 * 视图切换
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
        cookie = lib.get('./cookie'),
        store = lib.get('./store'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        view_name_map_value = {
            whole:   1,   //全部
            group:  2     //分组

        },
        view_value_map_name = (function () {
            var n, map = {};
            for (n in view_name_map_value) {
                if (view_name_map_value.hasOwnProperty(n)) {
                    map[view_name_map_value[n]] = n;
                }
            }
            return map;
        })(),

        default_view = 'whole',

        store_name = 'group_switch_type',

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        // 最后一次使用的非“临时”视图
        last_not_temp_view = cur_view,

        undefined;


    var view_switch = new Module('photo_group_view_switch', {

        ui: require('./view_switch.ui'),

        _cur_visible : null,
        // 当成功进行切换时，返回true
        toggle_ui: function(visible){
            if(this._cur_visible === visible){
                return false;
            }
            this._cur_visible = visible;
            this.ui.toggle(visible);
            return true;
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
            this.ui.activate();
            this.ui.__rendered = false;
        },

        on_deactivate: function() {
            this.deactivate();
            this.ui.destroy();
            this.ui.deactivate();
        },

        render: function($to) {
            this.ui.render($to);
        },

        get_default_view: function() {
            return default_view;
        },

        exit_temp_view: function () {
            this.set_cur_view(last_not_temp_view, false);
        },

        /**
         * 切换视图
         * @param {String} view_name
         */
        set_cur_view: function (view_name, event) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {
                cur_view = view_name;

                last_not_temp_view = view_name;

                // 存储
                var value = view_name_map_value[view_name];
                store.set(store_name, value);
                this.trigger('switch.view', view_name, event);
            }
        },

        get_cur_view: function () {
            return cur_view;
        },

        is_group_view: function () {
            return this.get_cur_view() === 'group';
        },

        is_whole_view: function () {
            return this.get_cur_view() === 'whole';
        },

        get_view_value_map: function() {
            return view_name_map_value;
        }
    });

    return view_switch;

});