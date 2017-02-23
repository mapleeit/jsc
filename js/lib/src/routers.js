/**
 * 利用location.hash实现的路由功能
 * @author jameszuo
 * @date 13-2-28
 */
define(function (require, exports, module) {
    var $ = require('$'),
        collections = require('./collections'),
        console = require('./console'),
        Events = require('./events'),
        url_parser = require('./url_parser'),

        win = window,

        ADD = 'add',
        CHANG = 'change',
        REMOVE = 'remove',

        encode = encodeURIComponent,

        undefined;


    var routers = {

        _ready: false,

        /**
         * 初始化路由
         */
        init: function () {

            var me = this;
            if (!me._ready) {

                me._last_params = this._get_params();

                require.async('jquery_history', function () {
                    $.history.init(function () {
                        me._trigger_changes();
                    });
                });

                me.trigger('init');
            }
            me._ready = true;
        },

        /**
         * 转向目标路由
         * @param {Object} key_value_map
         * @param {Boolean} silent (optional) 是否静默修改，即不触发事件
         */
        go: function (key_value_map, silent) {
            var hash = $.map(key_value_map,function (v, k) {
                return encode(k) + '=' + encode(v);
            }).join('&');

            // 静默跳转，直接修改
            if (silent) {
                this._sync_params(key_value_map);
            }

            if ('#' + hash !== win.location.hash) {
                win.location.hash = hash;
            }
        },

        /**
         * 替换指定的路由参数
         * @param {Object} key_value_map
         * @param {Boolean} silent (optional) 是否静默修改，即不触发事件
         */
        replace: function (key_value_map, silent) {
            key_value_map = $.extend({}, this._get_params(), key_value_map);
            this.go(key_value_map, silent);
        },

        /**
         * 删除指定的hash
         * @param {string} key
         */
        unset: function (key) {
            if (key in this._last_params) {
                var new_params = $.extend({}, this._last_params);
                delete new_params[key];
                this.go(new_params);
            }
        },

        /**
         * 获取参数
         * @param {String} key
         * @return {String} val
         */
        get_param: function (key) {
            return this._last_params[key];
        },

        /**
         * 触发事件
         * @private
         */
        _trigger_changes: function () {
            var
                me = this,
                new_params = me._get_params(),
                last_params = this._last_params,
                changes = me._get_changes(new_params, last_params);
            this._sync_params(new_params);

            // 有改变
            if (changes) {
                if (changes[ADD]) {
                    $.each(changes[ADD], function (key, val) {
                        me.trigger(ADD + '.' + key, val);
                    });
                }
                if (changes[CHANG]) {
                    $.each(changes[CHANG], function (key, val) {
                        var new_val = val[0],
                            old_val = val[1];
                        me.trigger(CHANG + '.' + key, new_val, old_val);
                    });
                }
                if (changes[REMOVE]) {
                    $.each(changes[REMOVE], function (key, val) {
                        me.trigger(REMOVE + '.' + key, val);
                    });
                }
            }
        },

        _sync_params: function (params) {
            this._last_params = params;
        },

        /**
         * 获取hash参数
         * @return {Object} { added: {}, changed: {}, removed: {} }
         * @private
         */
        _get_params: function () {
            var hash = win.location.hash.replace(/^#*/, '');
            return url_parser.parse_params(hash);
        },

        // 修改前的hash
        _last_params: {},

        /**
         * 对比新旧参数，找出不相同的值
         * @param new_hash
         * @param last_hash
         * @return {Object} changed { added: {}, changed: {}, removed: {} }
         * @private
         */
        _get_changes: function (new_hash, last_hash) {
            var
            // new_hash key + last_hash key
                union_keys = $.map($.extend({}, new_hash, last_hash), function (v, k) {
                    return k;
                });

            // 对比，寻找改变
            var
                added_map = {},
                changed_map = {},
                removed_map = {};

            // 遍历所有key，找出变化的
            $.each(union_keys, function (i, key) {
                var
                    in_old = last_hash.hasOwnProperty(key),
                    in_new = new_hash.hasOwnProperty(key),
                    in_both = in_old && in_new,

                    old_val = in_old ? last_hash[key] : null,
                    new_val = in_new ? new_hash[key] : null,

                    changed = old_val !== new_val;

                if (in_both) {
                    if (changed) {
                        changed_map[key] = [new_val, old_val];
                    }
                } else if (in_new) {
                    added_map[key] = new_val;
                } else if (in_old) {
                    removed_map[key] = old_val;
                }
            });

            var is_changed = !$.isEmptyObject(added_map) || !$.isEmptyObject(changed_map) || !$.isEmptyObject(removed_map);

            if (is_changed) {
                var changes = {};
                changes[ADD] = added_map;
                changes[CHANG] = changed_map;
                changes[REMOVE] = removed_map;
                return changes;
            }
        }

    };

    $.extend(routers, Events);

    return routers;

});