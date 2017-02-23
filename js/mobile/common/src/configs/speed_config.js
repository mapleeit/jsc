/**
 * 测速相关配置
 * @author hibincheng
 * @date 2014-12-29
 *
 */
define(function(require, exports, module) {

    var conf = {
        'SHARE_PAGE': {
            __flags: '7830-9-2',
            __performance: '7830-9-1',
            NODE: 1,
            CSS: 2,
            VIEW: 3,
            JS: 4,
            COMPLATE: 5

        },
        'TEST' : '7830-4-5-3'
    }

    return {
        get: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__flags'];
        },
        get_perf_flag: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__performance'];
        }
    }
});