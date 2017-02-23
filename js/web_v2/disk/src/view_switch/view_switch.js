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
        log_event = common.get('./global.global_event').namespace('log'),
        user_log = common.get('./user_log'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        rank_name_map_value = {
            time:   3,  //按最后修改时间排序
            letter: 4   //按照字母排序视图
        },

        view_name_map_value = {
            list:   1,  //列表
            thumb:  2   //缩略图

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
        rank_value_map_name = (function () {
            var n, map = {};
            for (n in rank_name_map_value) {
                if (rank_name_map_value.hasOwnProperty(n)) {
                    map[rank_name_map_value[n]] = n;
                }
            }
            return map;
        })(),

        default_view = 'thumb',
        default_rank = 'time',

        store_name = 'view_switch_type',
        rank_store_name = 'rank_switch_type',

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        cur_rank = (function () {
            var view_value = store.get(rank_store_name) || cookie.get(rank_store_name);
            if (view_value && rank_value_map_name.hasOwnProperty(view_value)) {
                return rank_value_map_name[view_value];
            } else {
                return default_rank;
            }
        })(),

    // 最后一次使用的非“临时”视图
        last_not_temp_view = cur_view,

        undefined;


    var view_switch = new Module('disk_view_switch', {

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

        render: function ($to) {
            this.ui.render($to);
            this._log();
        },

        temp_to_list: function () {
            this.set_cur_view('list', true);
        },

        temp_to_thumb: function () {
            this.set_cur_view('thumb', true);
        },

        get_default_view: function() {
            return default_view;
        },

        exit_temp_view: function () {
            this.set_cur_view(last_not_temp_view, false);
        },

        //切换回默认视图  todo xixihuang
        to_narmal: function() {
            //this.exit_temp_view();
            this.ui.toggle_mode('thumb', false);
            this.ui.toggle_mode('letter', false);
        },

        /**
         * 切换视图
         * @param {String} view_name
         * @param {Boolean} [is_temp]
         */
        set_cur_view: function (view_name, is_temp) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {
                //切换视图通知ui_normal模块切换，并隐藏先前模块
                this.trigger('switch.view', cur_view);

                cur_view = view_name;

                var rank = this.get_cur_rank();

                if (!is_temp) {
                    last_not_temp_view = view_name;

                    // 存储
                    var value = view_name_map_value[view_name];
                    store.set(store_name, value);

                    this._log();
                }

                //// 现在不触发全局switch事件了，通过namespace控制事件名，请监听 switch.ui_normal、switch.ui_virtual、switch.ui_offline 事件
                //this.trigger('switch', view_name);

                if (this.ns)
                    this.trigger('switch.' + this.ns, rank, view_name, is_temp);
            }
        },

        /**
         * 重新排序
         * @param {String} rank_name
         * @param {Boolean} [is_temp]
         */
        set_cur_rank: function (rank_name) {
            if (rank_name !== cur_rank && rank_name_map_value.hasOwnProperty(rank_name)) {
                cur_rank = rank_name;

                // 存储
                var value = rank_name_map_value[rank_name];
                store.set(store_name, value);

                this._log();

                // 现在不触发全局switch事件了，通过namespace控制事件名，请监听 switch.ui_normal、switch.ui_virtual、switch.ui_offline 事件
                //重新排序不需要重新拉取数据
                this.trigger('switch.rank', rank_name);
            }
        },

        get_default_rank: function() {
            return default_rank;
        },

        set_namespace: function (ns) {
            this.ns = ns;
        },

        get_cur_view: function () {
            return cur_view;
        },

        is_list_view: function () {
            return this.get_cur_view() === 'list';
        },

        is_thumb_view: function () {
            return this.get_cur_view() === 'thumb';
        },

        get_view_value_map: function() {
            return view_name_map_value;
        },

        get_rank_value_map: function() {
            return rank_name_map_value;
        },

        get_cur_rank: function () {
            return cur_rank;
        },

        is_letter_rank: function () {
            return this.get_cur_rank() === 'letter';
        },

        is_time_rank: function () {
            return this.get_cur_view() === 'time';
        },

        _log: function () {
            log_event.trigger('view_type_change', view_name_map_value[cur_view]);
        }

    });

    return view_switch;

});