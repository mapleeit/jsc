/**
 * 模块
 *
 * 模块的接口成员：
 *
 * 方法：
 *      render() 渲染当前模块
 *      add_sub_module() 添加一个子模块
 *      get__sub_modules() 获取所有子模块
 *      activate() 激活当前模块（递归激活子模块）
 *      deactivate() 隐藏当前模块（递归隐藏子模块）
 *
 *      TODO get_parent_module() 获取父模块
 *
 * 属性：
 *      ui 当前模块对应的UI模块
 *
 * @author jameszuo
 * @date 13-3-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('module'),
        events = lib.get('./events'),

        global_event = require('./global.global_event'),
        constants = require('./constants'),

        defaults = {
            ui: null, // UI Module
            render: $.noop
        },

        empty = [],
        instances = [],

        undefined;


    var Module = function (module_name, options) {
        if (typeof module_name !== 'string') {
            throw 'module.js:无效的module_name参数';
        }

        instances.push(this);

        options && $.extend(this, defaults, options);

        // 初始化参数处理映射
        var me = this,
            invoke_map = this.params_invoke_map,
            invoke_array = [],
            property_name;
        if (invoke_map) {
            for (property_name in invoke_map) {
                if (invoke_map.hasOwnProperty(property_name)) {
                    invoke_array.push({
                        name: property_name,
                        fn: me[invoke_map[property_name]],
                        scope: me
                    });
                }
            }
        }

        this.module_name = module_name;
        this.__rendered = this.__activated = this.__deactivated = false;

        // render 上加一层壳
        var org_render = this.render;
        this.render = function () {

            if (this.__rendered)
                return;

            var render_ui = true;

            // 渲染当前模块
            if (typeof org_render === 'function') {
                // 执行原render方法
                if (!constants.IS_DEBUG) {
                    try {
                        if (org_render.apply(this, arguments) === false) // render 方法返回false可以阻止UI渲染
                            render_ui = false;
                    } catch (e) {
                        var console = lib.get('./console').namespace(this.module_name + '.render');
                        console.error(e.message);
                    }
                }
                else {
                    if (org_render.apply(this, arguments) === false)  // render 方法返回false可以阻止UI渲染
                        render_ui = false;
                }
            }

            // 渲染UI
            if (render_ui && this.ui) {
                if (!Module.is_instance(this.ui)) {
                    throw module_name + '的UI模块必须是Module实例';
                }

                if (!constants.IS_DEBUG) {
                    try {
                        this.ui.render.apply(this.ui, arguments);
                    } catch (e) {
                        var console = lib.get('./console').namespace(this.module_name + '.render');
                        console.error(e.message);
                    }
                }
                else {
                    this.ui.render.apply(this.ui, arguments);
                }
            }

            this.__rendered = true;
            this.trigger('render');
            global_event.trigger(this.module_name + '_render', this);
        };

        // 调用 activated() 方法时，递归调用子模块的 activate() 方法
        // activate 上加一层壳
        var org_activate = this.activate;
        this.activate = function (params) {
            // 事先处理params中注册的属性，调用对应的更新器。
            if (params && invoke_array.length > 0) {
                $.each(invoke_array, function (index, invoke_properties) {
                    var name = invoke_properties.name;
                    if (params.hasOwnProperty(name)) {
                        invoke_properties.fn.call(invoke_properties.scope, params[name]);
                    }
                });
            }
            if (this.__activated || !this.__rendered)
                return;

            this.__deactivated = false;
            this.__activated = true;

            if (typeof org_activate === 'function') {
                org_activate.call(this, params);
            }
            if (this.ui && Module.is_instance(this.ui)) {
                this.ui.activate(params);
            }
            this.trigger('activate', params);

            var sub_modules = this.get__sub_modules();
            if (sub_modules.length) {
                $.each(sub_modules, function (i, mod) {
                    mod.activate(params);
                });
            }
        };

        // 调用 deactivated() 方法时，递归调用子模块的 deactivate() 方法
        // deactivate 上加一层壳
        var org_deactivate = this.deactivate;
        this.deactivate = function () {
            if (this.__deactivated || !this.__rendered)
                return;

            this.__activated = false;
            this.__deactivated = true;

            if (typeof org_deactivate === 'function') {
                org_deactivate.apply(this);
            }
            if (this.ui && Module.is_instance(this.ui)) {
                this.ui.deactivate();
            }

            this.trigger('deactivate');

            var sub_modules = this.get__sub_modules();
            if (sub_modules.length) {
                $.each(sub_modules, function (i, mod) {
                    mod.deactivate();
                });
            }
        };
    };

    $.extend(Module.prototype, events, {
        __is_module: true,

        // todo 默认设置父模块
        add_sub_module: function (mod) {
            if (!Module.is_instance(mod)) {
                throw 'Module#add_sub_module(mod) -> mod 必须是一个 Module 实例';
            }

            this.__sub_modules || (this.__sub_modules = []);

            this.__sub_modules.push(mod);
        },

        get__sub_modules: function () {
            return this.__sub_modules || empty;
        },

        is_rendered: function () {
            return this.__rendered;
        },

        is_activated: function () {
            return this.__activated;
        },

        is_deactivated: function () {
            return this.__deactivated;
        }
    });

    Module.is_instance = function (obj) {
        return obj && obj.__is_module;
    };

    // Module.__instances = instances;

    return Module;
});