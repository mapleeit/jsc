/**
 * 相册视频切换
 * @author cluezhang
 * @date 2013-11-5
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var tmpl = require('./tmpl');
    var Module = inherit(Event, {
        mode_attr : 'data-vm',
        active_class : 'on',
        /**
         * @cfg {String} mode 初始时所处的模式
         */
        /**
         * @event switch 当模式切换时触发
         * @param {String} mode 可以为time、group、all三种模式
         */
        constructor : function(cfg){
            $.extend(this, cfg);
            // 初始视图
            var mode = this.mode;
            if(mode){
                this.mode = '';
                this.set_mode(mode, true);
            }
        },
        render : function(){
            var $el, me;
            if(!this.rendered){
                me = this;
                $el = this.$el = $(tmpl.view_switch({
                    mode : me.mode
                })).appendTo(this.$ct);
                this.rendered = true;
                
                $el.on('click', '['+this.mode_attr+']', function(e){
                    e.preventDefault(); // 增强健壮性，防止set_mode出错后进行了hash跳转，从而跳到网盘了
                    var $dom = $(this);
                    me.set_mode($dom.attr(me.mode_attr));
                });
            }
        },
        /**
         * 更改当前的模式
         * @param {String} mode
         * @param {Boolean} silent (optional) 是否静默操作，即不触发事件
         */
        set_mode : function(mode, silent){
            var old_mode = this.mode;
            if(mode !== old_mode){
                this.mode = mode;
                if(this.rendered){
                    this.$el.find('['+this.mode_attr+'="'+mode+'"]').addClass(this.active_class).siblings().removeClass(this.active_class);
                }
                this.trigger('switch', mode);
            }
        },
        /**
         * 获取当前处于的模式
         * @return {String} mode
         */
        get_mode : function(){
            return this.mode;
        }
    });
    return Module;
});