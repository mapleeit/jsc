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

        view_name_map_value = {
            grid: 1, // 缩略图
//            list: 2,
            azlist: 3, // 按名称排序的列表视图
            newestlist: 4 // 按最后修改时间排序的列表视图
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

        default_view = 'grid',

        store_name = 'view_switch_type',
        sidebar_store_name = 'view_switch_sidebar'/* + uin */,

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        is_sidebar_view,

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

        render: function () {
            var me = this;
            query_user.on_ready(function (user) {
                is_sidebar_view = !!store.get(sidebar_store_name + user.get_uin());
                me.ui.set_sidebar_activated(is_sidebar_view);
            });

            if (scr_reader_mode.is_enable() && cur_view === 'grid') {
                this.set_cur_view('azlist');
            }

            this._log();
        },

        temp_to_list: function () {
            this.set_cur_view('azlist', true);
        },

        temp_to_thumb: function () {
            this.set_cur_view('grid', true);
        },

        exit_temp_view: function () {
            this.set_cur_view(last_not_temp_view, false);
        },

        temp_to_photo_view: function() {

            this.ui.toggle_mode('newestlist', true);
        },

        to_narmal: function() {
            //this.exit_temp_view();
            this.ui.toggle_mode('newestlist', false);
        },

        /**
         * 切换视图
         * @param {String} view_name
         * @param {Boolean} [is_temp]
         */
        set_cur_view: function (view_name, is_temp) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {

                cur_view = view_name;

                var is_grid = this.is_grid_view(),
                    is_list = this.is_list_view();

                if (!is_temp) {
                    last_not_temp_view = view_name;

                    // 存储
                    var value = view_name_map_value[view_name];
                    store.set(store_name, value);

                    this._log();
                }

                // 现在不触发全局switch事件了，通过namespace控制事件名，请监听 switch.ui_normal、switch.ui_virtual、switch.ui_offline 事件
                this.trigger('switch', is_grid, is_list, view_name);

                if (this.ns)
                    this.trigger('switch.' + this.ns, is_grid, is_list, view_name, is_temp);
            }
        },

        /**
         * 是否打开了侧边栏
         * @returns {boolean} 是否打开了侧边栏
         */
        is_sidebar_view: function () {
            if (typeof is_sidebar_view === 'boolean') {
                return is_sidebar_view;
            } else {
                var user = query_user.get_cached_user();
                return user ? !!store.get(sidebar_store_name + user.get_uin()) : false;
            }
        },

        /**
         * 切换侧边栏
         * @param {Boolean} active
         * @param {Boolean} [silent] 静默，默认false
         */
        set_sidebar_view: function (active, silent) {
            active = !!active;
            var old = is_sidebar_view;
            is_sidebar_view = active;
            if (!silent && old !== active) {
                this.ui.set_sidebar_activated(active);
                this.trigger('sidebar_view_change', active);

                var user = query_user.get_cached_user();
                if (user) {
                    var store_key = sidebar_store_name + user.get_uin();
                    active ? store.set(store_key, 1) : store.remove(store_key);
                }

                if(active) {
                    user_log('DBVIEWTREE_OPEN');
                } else {
                    user_log('DBVIEWTREE_CLOSE');
                }
            }
        },

        set_namespace: function (ns) {
            this.ns = ns;
        },

        get_cur_view: function () {
            return cur_view;
        },

        is_list_view: function () {
            var mode = this.get_cur_view();
            return mode === 'list' || mode === 'newestlist' || mode === 'azlist';
        },

        is_grid_view: function () {
            return this.get_cur_view() == 'grid';
        },

        _log: function () {
            log_event.trigger('view_type_change', view_name_map_value[cur_view]);
        }

    });

    return view_switch;

});