/**
 * 库分类模块类，这里用于兼容原有的common/module与现有的代码
 * @author cluezhang
 * @date 2013-8-12
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        common = require('common'),
        OldModule = common.get('./module'),
        global_event = common.get('./global.global_event'),
        
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
        constructor : function(cfg){
            $.extend(this, cfg);
            var store = new Store();
        },
        get_list_view : function(){
            var view = this.list_view;
            if(!view.rendered){
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function() {
            var header = this.list_header;
            if(!header.rendered){
                header.render(this.$bar1);
            }
            return header;
        },
        activate : function(){
            if(!this.active){
                this.active = true;
                this.on_activate();
                this.trigger('activate');
            }
        },
        on_activate : function(){
            this.get_list_header().show(); // 使用css控制 - james
            this.get_list_view().show();
        },
        deactivate : function(){
            if(this.active){
                this.active = false;
                this.on_deactivate();
                this.trigger('deactivate');
            }
        },
        on_deactivate : function(){
            this.get_list_view().hide();
            this.get_list_header().hide();// 使用css控制 - james
        },
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function($header, $body){
//                        me.$header_ct = $header;
//                        me.$body_ct = $body;
                        var main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$bar1 = main_ui.get_$bar2();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate : function(){
                        me.activate();
                    },
                    deactivate : function(){
                        me.deactivate();
                    },
                    get_ext_module : function(){
                        return me;
                    }
                });
            }
            return module;
        }
    });
    return Module;
});