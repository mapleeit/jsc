/**
 * 简化接口的模块类，兼容原有的common/module。
 * @author cluezhang
 * @date 2013-11-04
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        query_user = require('./query_user'),
        
        OldModule = require('./module'),
        global_event = require('./global.global_event'),
        
        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };
    
    var Module = inherit(Event, {
        active : false,
        logined : false,
        constructor : function(cfg){
            $.extend(this, cfg);
            var store = new Store();
            this._singletons = {};
            // 用户未登录时，不触发active
            var me = this;
            query_user.on_ready(function(){
                me.logined = true;
                me.refresh_active_state();
            });
        },
        get_singleton : function(name){
            var singletons = this._singletons,
                o = null, fn_name;
            if(singletons.hasOwnProperty(name)){
                o = singletons[name];
            }else{
                fn_name = 'create_'+name;
                if(typeof this[fn_name] === 'function'){
                    o = singletons[name] = this['create_'+name]();
                }
            }
            return o;
        },
        refresh_active_state : function(){
            var active = this.module_active && this.logined;
            this[active ? 'activate' : 'deactivate']();
        },
        module_toggle : function(module_active){
            this.module_active = module_active;
            this.refresh_active_state();
        },
        activate : function(){
            if(!this.active){
                this.active = true;
                this.on_activate();
                this.trigger('activate');
            }
        },
        // 供子类扩展，模块激活时调用
        on_activate : $.noop,
        deactivate : function(){
            if(this.active){
                this.active = false;
                this.on_deactivate();
                this.trigger('deactivate');
            }
        },
        // 供子类扩展，模块激活时调用
        on_deactivate : $.noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_module_adapter : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function($header, $body){
                        // 自行管理
                    },
                    activate : function(){
                        me.module_toggle(true);
                    },
                    deactivate : function(){
                        me.module_toggle(false);
                    },
                    // 可以从old_module_adapter获取simple_module
                    get_simple_module : function(){
                        return me;
                    },
                    // 兼容旧接口
                    get_ext_module : function(){
                        return me;
                    }
                });
            }
            return module;
        }
    });
    // 兼容旧接口
    Module.prototype.get_common_module = Module.prototype.get_module_adapter;
    return Module;
});