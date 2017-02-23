/**
 * 回收站主
 * @author trumpli
 * @date 13-6-
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        console = lib.get('./console'),
        Module = common.get('./module'),
	    huatuo_speed = common.get('./huatuo_speed'),
        file_list = require('./file_list.file_list'),
        slice = [].slice,

        undefined;


    var recent = new Module('recent', {

        ui: require('./ui'),

        /**
         * 渲染子模块
         * @param {Module} sub_module
         * @param {*} arg1
         * @param {*} arg2
         */
        render_sub: function (sub_module, arg1, arg2 /*...*/) {
            try {
                var args = slice.call(arguments, 1);
                sub_module.render.apply(sub_module, args);

                this.add_sub_module(sub_module);
            } catch (e) {
                console.error('recent.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;

        }
    });

    recent.on('render', function () {
	    try{
		    var flag = '21254-1-9';
		    if(window.g_start_time) {
			    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		    }
	    } catch(e) {

	    }
        this.render_sub(file_list);
    });

    return recent;
});