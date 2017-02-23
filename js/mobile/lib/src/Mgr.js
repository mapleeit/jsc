/**
 * 自定义事件管理基础类
 * @author hibincheng
 * @date 2014-12-20
 */
define(function(require, exports, module) {
    var $ = require('$'),
        events = require('./events'),
        Module = require('./Module'),

        undefined;

    function Mgr(name, opt) {
        Module.call(this, name, opt);

        this._observe_mods_map = {};
    }

    $.extend(Mgr.prototype, Module.prototype, {

        /**
         * 观察者模式实现，监听模块的自定义事件
         * @param {Module} mod 模块
         */
        observe: function(mod) {
            if(this.has_observe_mod(mod)) {
                return;
            }
            this._observe_mods_map[mod.name] = mod;
            this.bind_action(mod);
        },

        has_observe_mod: function(mod) {
            if(!mod.name) {
                console.error('observe module must have name');
                return false;
            }
            return !!this._observe_mods_map[mod.name];
        },

        /**
         * 绑定自定义事件
         * @param mod
         */
        bind_action: function(mod) {
            this.listenTo(mod, 'action', function(action_name, data, event) {
                this.dispatch_action(action_name, data, event);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event);
            }
            event && event.preventDefault();
        },

        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },

        abort_ajax: function() {
            this._send_req && this._send_req.destroy();
        },

        destroy: function() {
            var me = this;
            this.abort_ajax();
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }
    });

    return Mgr;
});