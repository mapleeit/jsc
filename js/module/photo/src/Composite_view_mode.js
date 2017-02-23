/**
 * 显示模式（View_mode）的组合模式（Composite），它本身是一个显示模式，但同时也含几个子模式
 * @author cluezhang
 * @date 2013-11-27
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        View_mode = require('./View_mode'),
        $ = require('$');
    var toolbar_event_name = 'toolbar_meta_changed';
    var Module = inherit(View_mode, {
        /**
         * @cfg {String} mode 当前的模式
         */
        mode : null,
        /**
         * 获取子模式的实例
         * @param {String} mode_name
         * @return {View_mode} mode
         */
        get_mode_instance : function(mode_name){
            return this.get_singleton('mode_'+mode_name);
        },
        /**
         * @return {View_mode} mode
         */
        get_current_mode_instance : function(){
            if(this.mode){
                return this.get_mode_instance(this.mode);
            }
            return null;
        },
        /**
         * 切换子模块
         * @param {String} mode_name
         */
        switch_mode : function(mode_name){
            var old_mode_name = this.mode,
                old_mode, mode;
            if(old_mode_name && (old_mode = this.get_mode_instance(old_mode_name))){
                if(this.activated){
                    this.on_mode_deactivate(old_mode_name, old_mode);
                }
                this.mode = null;
            }
            mode = this.get_mode_instance(mode_name);
            if(mode){
                if(this.activated){
                    this.on_mode_activate(mode_name, mode);
                }
                this.mode = mode_name;
            }
        },
        /**
         * 当有子模块切换走时调用
         * @private
         */
        on_mode_deactivate : function(mode_name, mode){
            mode.off(toolbar_event_name, this.delegate_toolbar_change, this);
            this.trigger('modedeactivate', mode_name, mode);
            mode.deactivate();
        },
        /**
         * 当有子模块切换来时调用
         * @private
         */
        on_mode_activate : function(mode_name, mode){
            mode.set_size(this.size);
            mode.activate();
            this.trigger('modeactivate', mode_name, mode);
            mode.on(toolbar_event_name, this.delegate_toolbar_change, this);
            this.delegate_toolbar_change(mode.get_toolbar_meta());
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                this.on_mode_activate(this.mode, mode);
            }
        },
        on_deactivate : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                this.on_mode_deactivate(this.mode, mode);
            }
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        delegate_toolbar_change : function(meta){
            this.trigger(toolbar_event_name, meta);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_refresh.apply(mode, arguments);
            }
        },
        on_resize : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.set_size(this.size);
            }
            Module.superclass.on_resize.apply(this, arguments);
        },
        on_reachbottom : function(){
            Module.superclass.on_reachbottom.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_reachbottom();
            }
        },
        on_toolbar_act : function(){
            Module.superclass.on_toolbar_act.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_toolbar_act.apply(mode, arguments);
            }
        },
        get_toolbar_meta : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                return mode.get_toolbar_meta.apply(mode, arguments);
            }
        }
    });
    return Module;
});