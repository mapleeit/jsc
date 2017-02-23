/**
 * 模块基础类
 * @author hibincheng
 * @date 2014-12-20
 */
define(function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
        events = lib.get('./events'),
        undefined;

    function Module(name, opt) {
        this.name = name;
        if(typeof opt === 'object' && opt !== null) {
            $.extend(this, opt);
        }
    }

    $.extend(Module.prototype, events);
    //todo:实现类继承

    return Module;
});