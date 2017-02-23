/**
 * 原有的events是实例型的，这里扩展一个事件类。
 * @author cluezhang
 * @date 2013-8-12
 */
define(function(require, exports, module){
    var 
        inherit = require('./inherit'),
        events = require('./events');
    var Event = inherit(Object, events);
    return Event;
});