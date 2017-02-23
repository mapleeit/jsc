/**
 * 页面上的搜索框
 * @author cluezhang
 * @date 2013-9-11
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    /**
     * 因search模块是异步加载的，使用此searcher作为缓冲
     * 它作为adapter来隐藏search模块的异步加载
     * @private
     */
    var CacheSearcher = inherit(Event, {
        busy : false,
        /**
         * 开始搜索
         * @param {String} str
         */
        search : function(str){
            if(this.searcher){
                return this.searcher.search(str);
            }
            if(!str){
                this.cancel();
                return;
            }
            this.str = str;
            if(!this.busy){
                this.busy = true;
                this.trigger('busy');
            }
            this.try_load();
        },
        /**
         * 取消搜索
         */
        cancel : function(){
            if(this.searcher){
                return this.searcher.cancel();
            }
            this.str = '';
            if(this.busy){
                this.busy = false;
                this.trigger('idle');
            }
        },
        /**
         * 尝试加载搜索模块
         * @private
         */
        try_load : function(){
            var me = this;
            if(me.loading){
                return;
            }
            require.async('search', function(o){
                me.finish_load(o.get('./search').get_ext_module());
            });
            me.loading = true;
        },
        /**
         * 当异步加载搜索模块完成时，进行对接
         * @private
         */
        finish_load : function(module){
            var me = this;
            var searcher = module.get_searcher();
            me.searcher = searcher;
            if(me.str){
                searcher.search(me.str);
            }
            searcher.on('idle', function(){
                me.trigger('idle');
            });
            searcher.on('busy', function(){
                me.trigger('busy');
            });
            module.on('deactivate', this.quit_search, this);
        },
        /**
         * 当退出搜索模块时，发出reset事件，清空搜索框
         * @private
         */
        quit_search : function(){
            this.trigger('reset');
        }
    });
    
    
    var Search_box = inherit(Event, {
        /**
         * @cfg {jQueryElement} $el
         */
        /**
         * @cfg {String} input_selector
         */
        /**
         * @cfg {Searcher} searcher
         */
        /**
         * @cfg {Number} buffer (optional) 搜索缓冲时间
         */
        buffer : 500,
        focus_class : 'focus',
        hover_class : 'hover',
        searching_class : 'searching',
        notblank_class : 'istext',
        
        last_searching_value : '',
        constructor : function(cfg){
            var me = this;
            Search_box.superclass.constructor.apply(me, arguments);
            $.extend(me, cfg);
            var $el = me.$el;
            var $input = me.$input = $el.find(me.input_selector);
            this.searcher = new CacheSearcher();
            // focus
            // 当点击其它界面时，不知道为什么没能取消选中，需要hack
            var do_blur = function(e){
                if(!$.contains($el[0], e.target)){
                    $input.blur();
                }
            };
            $input.focus(function(){
                $el.addClass(me.focus_class);
                $(document.body).on('click', do_blur);
            }).blur(function(){
                $el.removeClass(me.focus_class);
                $el.toggleClass(me.notblank_class, !!$input.val());
                $(document.body).off('click', do_blur);
            });
            // hover
            $el.hover(function(){
                $el.addClass(me.hover_class);
            }, function(){
                $el.removeClass(me.hover_class);
            });
            // focus
            $el.on('click', function(e){
                // 如果点击的不是input输入框，主动focus
                if(!$.contains($input[0], e.target)){
                    $input.focus();
                }
            });
            
            // typing
            $input.on('keydown', $.proxy(me.handle_keydown, me));
            
            // searching
            me.searcher.on('busy', function(){
                $el.addClass(me.searching_class);
            });
            me.searcher.on('idle', function(){
                $el.removeClass(me.searching_class);
            });
            
            // 点击取消
            $el.on('click', '.close', function(e){
                e.preventDefault();
                me.$input.val('');
                me.update_state();
                me.trigger_search();
                user_log('SEARCH_CANCEL');
            });
            
            // 模块切换走时清空
            me.searcher.on('reset', function(){
                me.$input.val('');
                me.update_state();
                me.clear_cache();
            });
            // IE6下，开启自动完成按F5刷新后，非常SB的将上次的值给设置进来了，导致显示有问题。
            // autocomplete="off"设置无效
            // 保险起见，IE9以下版本都这样弄
            if($.browser.msie && $.browser.version<9){
                $(window).on('load', function(){
                    $input.val('');
                });
            }
        },
        // 不必在这里处理，直接在search模块的deactive中进行search清空
//        /**
//         * 返回搜索对象，供左导航切换后调用它进行清空。
//         * @return {Searcher} searcher
//         */
//        get_searcher : function(){
//            return this.searcher;
//        },
        /**
         * 更新文本框输入状态
         * @private
         */
        update_state : function(){
            var me = this;
            setTimeout(function(){
                me.$el.toggleClass(me.notblank_class, !!me.$input.val());
            });
        },
        /**
         * 在输入框中按键的行为：
         *      普通输入触发延迟搜索（如果和上次值不同）
         *      按Enter强制搜索
         *      按Esc触发cancel
         * @private
         */
        handle_keydown : function(e){
            var code = e.keyCode || e.which;
            switch(code){
                case 13: // Enter
                    this.trigger_search(true);
                    break;
                case 27: // Esc
                    //this.cancel();
                    this.$input.val('');
                    this.trigger_search();
                    break;
                default:
                    this.trigger_search();
                    break;
            }
            this.update_state();
        },
        /**
         * 清除已搜索缓存
         * @private
         */
        clear_cache : function(){
            this.last_searching_value = null;
        },
        /**
         * 触发搜索
         * @param {Boolean} force (optional) 是否强制搜索，默认为false，即如果值没有变化就不触发。
         * @private
         */
        trigger_search : function(force){
            var me = this;
            if(force){
                me.clear_cache();
            }
            if(me.timer){
                clearTimeout(me.timer);
                me.timer = null;
            }
            me.timer = setTimeout(function(){
                me.buffer_search();
            }, me.buffer);
        },
        /**
         * buffer缓冲过后执行搜索判断
         * @private
         */
        buffer_search : function(){
            // 去除前后空格
            var value = $.trim(this.$input.val());
            if(value !== this.last_searching_value){
                this.searcher.search(value);
                this.last_searching_value = value;
            }
            this.timer = null;
        }//,
//        /**
//         * 取消搜索
//         */
//        cancel : function(){
//            this.$input.val('');
//            this.last_searching_value = '';
//            this.searcher.cancel();
//        }
    });
    return Search_box;
});