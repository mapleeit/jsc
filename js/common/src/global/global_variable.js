/**
 * 全局变量管理器
 * @author jameszuo
 * @date 13-4-2
 */
define(function (require, exports, module) {
    var
        stack = {},
        set = function (key, val) {
            stack[key] = val;
        },
        get = function (key) {
            return stack[key];
        },
        del = function (key) {
            var val = stack[key];
            delete stack[key];
            return val;
        };

    return  {
        get: get,
        set: set,
        del: del
    };
});