/**
 * 全局事件路由
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