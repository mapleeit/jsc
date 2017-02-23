/**
 * 回收站主
 * @author jameszuo
 * @date 13-3-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        routers = common.get('./routers'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
	    huatuo_speed = common.get('./huatuo_speed'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        rec_list,
        tbar,
        rec_header,

        undefined;


    var recycle = new Module('recycle', {

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
                console.error('recycle.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;
        },

        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },

        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {
            rec_list.set_checkalled(checkalled);
        }
        
    });

    recycle.on('render', function () {
        var me = this,
            ui = this.ui;

	    //测速
	    try{
		    var flag = '21254-1-15';
		    if(window.g_start_time) {
			    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			    huatuo_speed.report();
		    }
	    } catch(e) {

	    }

        rec_list = require('./rec_list.rec_list');
        tbar = require('./toolbar.toolbar');
        rec_header = require('./rec_header.rec_header');

        this.render_sub(rec_list, ui.get_$body());

        this.render_sub(tbar, main_ui.get_$bar1());

        this.render_sub(rec_header);

        //监听全选按钮发出事件
        this.listenTo(rec_header, 'action', function(action_name, data, e) {
            me.process_action(action_name, data, e);
        }, this);
    });

    return recycle;
});