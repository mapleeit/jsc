/**
 * 全局事件路由
 * @author svenzeng
 * @date 13-3-1
 */


define(function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events');


    var cache = {},
        event,

        namespace = function (key) {
            return cache[ key ] || ( cache[ key ] = $.extend({}, events) );
        };

    event = $.extend({}, events);

    event.namespace = namespace;


    module.exports = event;
});