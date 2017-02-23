/**
 * 上报用户行为的配置
 */
define(function(require, exports, module) {

    var ops = {
        'TEST': 1000
    };

    return {
        get: function(name) {
            return ops[name] || '';
        }
    }
});