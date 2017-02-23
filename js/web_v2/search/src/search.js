/**
 * 搜索Module
 * @author cluezhang
 * @date 2013-9-12
 */
define(function(require, exports, module){
    var lib = require('lib'),
        $ = require('$'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        
        Store = lib.get('./data.Store'),
//        Record = lib.get('./data.Record'),
        routers = lib.get('./routers'),

        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        
        common = require('common'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        search_event = global_event.namespace('search'),
        scroller = common.get('./ui.scroller'),
        
        Searcher = require('./Searcher'),
        View = require('./View'),
        Loader = require('./Loader'),
        Header = require('./Header'),
        Mgr = require('./Mgr'),
        Module = require('./Module');
        
    // 正在进行的请求
    var requesting;
    var cancel_requesting = function(){
        if(requesting){
            requesting.abort();
            requesting = null;
        }
    };
    var store = new Store({
        /**
         * 将store清空，并置为未搜索状态（以免首屏显示无结果UI）
         */
        reset : function(){
            this.loaded = false;
            this.clear();
        },
        load_more : function(){
            var me = this;
            cancel_requesting();
            return requesting = loader.load(view.get_keyword(), store.size()).done(function(records, total_length){
                view.set_load_load(loader.is_load_done());
                store.add(records);
                // 如果总数变了，更新。正常情况这个数不应该变
                if(total_length !== store.get_total_length()){
                    store.total_length = total_length;
                    store.trigger('metachange');
                }
            }).fail(function(state){
                if(state !== 'canceled'){
                    // 什么也不干
                }
            }).always(function(state){
                requesting = null;
            });
        },
        /**
         * 是否加载完成
         * @return {Boolean} complete
         */
        is_complete : function(){
            return loader.is_load_done();
        }
    });
    var view_size, initial_view_size;
    var get_view_size = function(){
        return Math.ceil($(window).height() / 50);  // 目前一条记录有50px高
    };
    var get_init_size = function(view_size){
        return Math.round(view_size * 2.5);
    };
    view_size = get_view_size();
    initial_view_size = get_init_size(view_size);
    
    var view = new View({
        store : store,
        visible_count : initial_view_size,
        /**
         * 重置界面
         */
        reset : function(){
            this.set_visible_count(initial_view_size);
        },
        /**
         * 扩展显示的记录数
         */
        expand : function(){
            this.set_visible_count(this.visible_count + view_size);
        },
        /**
         * 当刷新时，重置滚动条，重置显示条
         */
        refresh : function(){
            this.reset();
            scroller.go(0, 0);
            View.prototype.refresh.apply(this, arguments);
        }
    });
    var loader = new Loader();
    loader.set_store(store);
    var mgr = new Mgr({
        store : store,
        view : view
    });
    return new Module({
        name : 'search',
        list_view : view,
        get_list_header : function(){
            if(!this.list_header){
                this.list_header = new Header({
                    searcher : this.get_searcher(),
                    store : store,
                    loader: loader
                });
            }
            return Module.prototype.get_list_header.apply(this, arguments);
        },
        on_activate : function(){
            Module.prototype.on_activate.apply(this, arguments);
            if(!this.last_mod){ // 表示不是由搜索触发的，可能是hash trigger，此时要复原
                routers.replace({
                    m : 'disk'
                });
            }

            this.listenTo(main_ui.get_scroller(), 'resize scroll', this.expand_view);
            // global_event.on('window_scroll window_resize', this.expand_view, this);
//            global_event.on('window_resize', view.adjust_height, view);
//            view.adjust_height();
        },
        on_deactivate : function(){
            this.stopListening(main_ui.get_scroller(), 'resize scroll');
//            global_event.off('window_scroll window_resize', this.expand_view, this);
//            global_event.off('window_resize', view.adjust_height, view);
            Module.prototype.on_deactivate.apply(this, arguments);
            this.get_searcher().cancel();
            store.reset();
            view.reset();
            loader.reset();
        },
        expand_view : function(){
            // 如果没有到底部，什么也不干
            if(!main_ui.get_scroller().is_reach_bottom()){
                return;
            }
            var me = this;
            // 如果是resize，要更新界面可显示条数
            view_size = get_view_size();
            initial_view_size = get_init_size(view_size);
            // 如果显示区域小于等于目前加载的记录数，扩展之
            var loaded_size = store.size();
            var cur_view_size = view.get_visible_count();
            if(cur_view_size <= loaded_size){
                view.expand();
                // 如果扩展后，发现store没有加载完，并处于空闲状态，加载之
                if(!requesting && !store.is_complete()){
                    store.load_more();
                }
            }
        },
        get_searcher : function(){
            var me = this;
            return me.searcher || (me.searcher = new Searcher({
                do_search : function(str){
                    // 搜索时，切换到搜索模块
	                search_event.trigger('before_search_begin');
                    if(!me.active){
                        me.last_mod = main.get_cur_mod_alias();
                        main.async_render_module('search');
                        routers.replace({
                            m : 'search'
                        }, true);
                        search_event.trigger('search_begin');
                    }
                    cancel_requesting();
                    requesting = loader.load(str).done(function(records, total_length){
                        // 加载完成后，更新视图，填充数据
                        view.set_load_load(loader.is_load_done());
                        view.set_keyword(str);
                        store.load(records, total_length);
                    }).fail(function(state){
                        // 人工取消时什么都不变
                        if(state !== 'canceled'){
                            // 其它错误当作空显示
                            store.load([]);
                        }
                    }).always(function(state){
                        requesting = null;
                    });
                    return requesting;
                },
                cancel : function(){
                    Searcher.prototype.cancel.apply(this, arguments);
                    var mod;
                    // 取消时，如果当前是搜索模块，返回前一个模块
                    if(me.active){
                        mod = me.last_mod || 'disk';
                        main.async_render_module(mod);
                        routers.replace({
                            m : mod
                        }, true);
                    }
                },
                do_cancel : function(){
                    // 中断正在进行的请求
                    cancel_requesting();
                }
            }));
        }
    }).get_common_module();
});