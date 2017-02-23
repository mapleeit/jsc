/**
 * 全局变量管理器
 * @author svenzeng
 * @date 13-3-6
 */

define(function (require, exports, module) {

    var lib = require('lib'),
        console = lib.get('./console'),
        global = window,
        global_proxy = {},// 用来代理window注册事件，通过key取事件时是从该对象中取，而不是window，主要是为修复IE下无法取得 window.onbeforeload 的bug
        stack = {},
        call_counts = {},
        call_history_map = global.__call_history_map || {};

    var
        register = function (key, fn) {
            var is_reg = key in stack, // 是否是一个注册的事件
                history = !is_reg ? call_history_map[key] : null;

            // 处理历史调用
            if (history && history.length) {
                $.each(history, function (i, args) {
                    fn.apply(global, args);
                });
                delete call_history_map[key];
            }

            return _register(key, fn);
        },

    //往全局里注册函数
        _register = function (key, fn) {
            if (!stack[ key ]) {
                stack[ key ] = [];
            }

            stack[ key ].push(fn);   //添加进队列

            if (!global_proxy[key] || !global_proxy[key].__is_stack_caller) {

                global[key] = global_proxy[key] = function () {

                    var ret,
                        ary = stack[ key ];

                    for (var i = 0, c; c = ary[ i++ ];) {
                        ret = c.apply(global, arguments);
                        if (ret === false) {
                            return false;
                        }
                    }

                    call_counts[ key ]++;

                    return ret;
                };
                global_proxy[key].__is_stack_caller = true;

                call_counts[key] = 0;
            }
        },


        get = function (key) {
            return global_proxy[key];
        },

        get_called_count = function (key) {
            return call_counts[key] || 0;
        };


    return {
        register: register,
        get: get,
        get_called_count: get_called_count
    };

});
