/**
 * 搜索对外接口对象
 * @author cluezhang
 * @date 2013-9-11
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        $ = require('$');
    
    var Searcher = inherit(Event, {
        busy : false,
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * @event busy 当前是否正在进行搜索
         */
        /**
         * @event idle 当前是否空闲
         */
        /**
         * 改变状态，同时发出事件
         * @private
         */
        alter_state : function(busy, str){
            busy = !!busy;
            // 当关键字发生变化时，同样发出事件
            if(busy !== this.busy || str !== this.str){
                this.busy = busy;
                this.str = str;
                this.trigger(busy ? 'busy' : 'idle', str);
            }
        },
        /**
         * 执行搜索，如果重复调用，自动取消上一次的未完成搜索
         * @param {String} str 要搜索的字符串，如果字符串为空表示取消搜索
         */
        search : function(str){
            if(!str){
                this.cancel();
                return;
            }
            if(this.busy){
                this.do_cancel();
            }
            this.alter_state(true, str);
            var def = this.do_search(str), me = this;
            def.always(function(state){
                if(def.state()!=='rejected' || state !== 'canceled'){
                    me.alter_state(false, str);
                }
            });
        },
        /**
         * 取消搜索，进入完成状态
         */
        cancel : function(){
            if(this.busy){
                this.do_cancel();
                this.alter_state(false);
            }
        },
        /**
         * 执行搜索，to be override
         * @private
         */
        do_search : $.noop,
        /**
         * 取消当前的搜索
         * @private
         */
        do_cancel : $.noop
    });
    return Searcher;
});