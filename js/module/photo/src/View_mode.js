/**
 * 将每个视图抽象出来，规定好接口，供总的相册使用
 * 目前考虑到要有的接口有：
 * deactivate/activate  在切换走后，为了性能可以考虑全部重绘，当然保留dom也行，看内部实现
 * on_toolbar_act  当工具栏点击后，通知视图内部进行操作处理
 * get_toolbar_meta  获取工具栏配置，比如哪些按钮显示，其它的都隐藏
 * toolbar_meta_change  当工具栏配置变化时，发出事件，供外部进行调整
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @event toolbar_meta_changed 当工具栏配置变化时，发出事件，供外部进行调整
         * @param {Object} meta
         */
        /**
         * @cfg {jQueryElement} $ct 放置的容器
         */
        constructor : function(cfg){
            $.extend(this, cfg);
            this._singletons = {};
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
        release_singleton : function(name){
            var singletons = this._singletons, o;
            if(singletons.hasOwnProperty(name)){
                o = singletons[name];
                if(o && o.destroy){
                    o.destroy();
                }
                delete singletons[name];
            }
        },
        activate : function(){
            if(this.activated){
                return;
            }
            this.activated = true;
            this.on_activate();
            this.trigger('activate');
        },
        on_activate : $.noop,
        deactivate : function(){
            if(!this.activated){
                return;
            }
            this.activated = false;
            this.on_deactivate();
            this.trigger('deactivate');
        },
        on_deactivate : $.noop,
        refresh : function(){
            if(!this.activated){
                return;
            }
            this.on_refresh();
        },
        on_refresh : $.noop,
        on_reachbottom : $.noop,
        /**
         * 当外容器大小变动时调用，以便视图调整
         */
        set_size : function(size){
            this.size = size;
            this.on_resize();
        },
        on_resize : $.noop,
        /**
         * 当工具栏点击后，通知视图内部进行操作处理，由管理工具栏的父模块进行调用
         * @param {String} act
         */
        on_toolbar_act : $.noop,
        /**
         * 获取工具栏配置，比如哪些按钮显示，其它的都隐藏
         * @return {Object} meta
         */
        get_toolbar_meta : $.noop
    });
    return Module;
});