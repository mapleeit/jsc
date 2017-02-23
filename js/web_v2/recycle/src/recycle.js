/**
 * 回收站主
 * @author jameszuo
 * @date 13-3-22
 * modified by maplemiao
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        // console = lib.get('./console'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        routers = common.get('./routers'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),

        slice = [].slice,

        recycle_list,
        header,

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

        on_restore: function () {
            recycle_list.restore_files();
        },

        on_shred: function () {
            recycle_list.shred_files();
        },

        on_empty_recycle: function () {
            widgets.confirm('清空回收站', '确定清空回收站吗？', '清空后将无法找回已删除的文件', function () {
                if (recycle_list) {
                    recycle_list.clear_files();
                }
            }, $.noop(), ['确定']);
        }

    });

    recycle.on('render', function () {
        var me = this,
            ui = this.ui;

        //测速
        //try{
        //    var flag = '21254-1-15';
        //    if(window.g_start_time) {
        //        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
        //        huatuo_speed.report();
        //    }
        //} catch(e) {
        //
        //}

        recycle_list = require('./recycle_list.recycle_list');
        header = require('./header.header');

        this.render_sub(recycle_list, ui.get_$recycle_list());

        this.render_sub(header);

        this.listenTo(header, 'action', function(action_name, data, e) {
            me.process_action(action_name, data, e);
        }, this);
    });

    return recycle;
});