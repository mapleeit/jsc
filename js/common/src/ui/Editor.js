/**
 * 
 * @author cluezhang
 * @date 2013-12-2
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown';
    // 编辑器
    var Editor = inherit(Event, {
        /**
         * @cfg {jQueryElement} $input input对象
         */
        /**
         * @cfg {String} initial_value 初始值
         */
        /**
         * 用户尝试保存时触发
         * @event save
         * @param {String} value
         */
        /**
         * 用户尝试取消时触发
         * @event cancel
         */
        constructor : function(cfg){
            var me = this;
            $.extend(me, cfg);
            
            // 如果在mousedown事件中进行focus，可能会有问题
            setTimeout(function(){
                me.hook();
            }, 0);
        },
        // private
        hook : function(){
            var me = this,
                $input = me.$input;
            me.focus();
            // 监听特殊事件 Enter Esc
            $input.on(key_event, (me.special_key_handler = $.proxy(me.handle_special_key, me)));
            // Blur
            $input.on('blur', (me.blur_handler = $.proxy(me.handle_blur, me)));
            // 主动blur，防止有框选影响
            $(document.body).on('mousedown', (me.initiative_blur_handler = $.proxy(me.handle_initiative_blur, me)));
        },
        unhook : function(){
            var me = this,
                $input = me.$input;
            // 特殊事件 Enter Esc
            $input.off(key_event, me.special_key_handler);
            // Blur
            $input.off('blur', me.blur_handler);
            $(document.body).off('mousedown', me.initiative_blur_handler);
        },
        handle_special_key : function(e){
            var value;
            // 按回车，尝试保存
            if (e.which === 13) {
                this.trigger_if_save();
            } else if (e.which === 27) {
                this.trigger('cancel');
                e.stopPropagation();
            }
        },
        handle_initiative_blur : function(e){
            if(!$(e.target).is(this.$input)){
                // 使用jQuery的blur，在IE下会触发多次blur事件....
                this.$input[0].blur();
            }
        },
        handle_blur : function(){
            this.trigger_if_save();
        },
        trigger_if_save : function(){
            var value = $.trim(this.$input.val());
            // 如果什么值都没有改，触发取消，如果为空，也触发取消
            if(!value || value === this.initial_value){
                this.trigger('cancel');
                return;
            }
            this.trigger('save', $.trim(this.$input.val()));
        },
        focus : function(){
            // 选中并聚焦，有时它会在mousedown中调用，不延时会有问题。
            var me = this;
            setTimeout(function(){
                me.$input.focus().select();
            }, 0);
        },
        destroy : function(){
            this.unhook();
            this.destroyed = true;
            this.trigger('destroy');
        }
    });
    return Editor;
});