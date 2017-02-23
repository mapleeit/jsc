/**
 * 中转站模块类，这里用于兼容原有的common/module与现有的代码
 * @author hibincheng
 * @date 2015-05-08
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Record = lib.get('./data.Record'),
        Store = lib.get('./data.Store'),

        common = require('common'),
        OldModule = common.get('./module'),
        query_user = common.get('./query_user'),
        main_ui,

        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };

    var noop = $.noop;

    var Module = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
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
                //header.render(this.$top_ct, this.$bar1_ct, this.$column_ct);
            }
            return header;
        },
        activate : function(){

            this.get_list_view().show();
            this.get_list_header().show();
            this.on_activate();
        },
        deactivate : function(){
            this.loader && this.loader.abort();
            this.get_list_view().hide();
            this.get_list_header().hide();
            this.on_deactivate();
            // $(document.body).off('mouseup', this._clear_selection_on_blur);
        },

        on_activate: noop,
        on_deactivate: noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function(){
                        main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$top_ct = main_ui.get_$top();
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$column_ct = main_ui.get_$station_head();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate : function(){
                        if(query_user.get_cached_user()) {
                            me.activate();
                        } else {
                            me.listenToOnce(query_user, 'load', function() {
                                me.activate();
                            });
                        }
                    },
                    deactivate : function(){
                        //yuyanghe   判断列表是否为空 为空时 移除share-empty-module 样式
                        if(me.get_list_view().store.size() == 0){
                            // yuyanghe 修复运营页面头部无线条BUG  用.show()命令最近文件会出现bug
                            main_ui.get_$bar1().css('display','');
                        }
                        me.deactivate();
                    }
                });
            }
            return module;
        }
    });
    return Module;
});