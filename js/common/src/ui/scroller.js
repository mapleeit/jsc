/**
 * 控制页面上下滚动
 * @author jameszuo
 * @date 13-4-18
 */
define(function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),
        constants = require('./constants'),
        widgets = require('./ui.widgets'),
        global_event = require('./global.global_event'),
        tmpl = require('./tmpl'),

        scroll_speed = 'slow',
        scrollbar_width,

        default_$el,
        reach_bottom_px = constants.IS_OLD? 300 : 500,// 距离页面底部300px时加载文件,新版把阀值调大些

        undef;


    var Scroller = function ($el) {
        $el = $($el);
        if (!$el[0]) {
            throw 'new Scroller($el) - 无效的参数 $el';
        }

        var me = this;
        me.$el = $el;

        me.scroll_handler = $.proxy(me.handle_scroll, me);
        $el.on('scroll', me.scroll_handler);
    };

    Scroller.prototype = {
        handle_scroll : function(){
            this.trigger('scroll');
        },

        up: function (callback) {
            this.to(0, callback);
        },

        /**
         * 滚！
         * @param {Number} y Y
         * @param {Number|String} [speed] 动画持续时间，默认 'slow'
         * @param {Function} [callback] 动画完成的回调
         */
        to: function (y, speed, callback) {
            Scroller.go(y, speed, callback, this.$el);
        },

        /**
         * 判断是否滚到了需要加载文件的位置
         * @returns {boolean}
         */
        is_reach_bottom: function () {
            var $el = this.$el,

                scroll_top = $el.scrollTop(),
                client_h = $el.height(),
                scroll_h = $el[0].scrollHeight;

            return scroll_top + client_h >= scroll_h - reach_bottom_px;
        },

        get_$el: function () {
            return this.$el;
        },
        /**
         * 返回容器高度
         * @returns {*|number}
         */
        get_height: function(){
            return this.get_$el().height();
        },
        trigger_resized: function () {
            this.trigger('resize');
        },
        destroy : function(){
            this.off();
            this.$el.off('scroll', this.scroll_handler);
        },

        //获取滚动条高度，使用一个50*50 overflow-y:scroll的div,再在里面放一个50*51的div，使之出现滚动条，这时外面div宽度减去里面div宽度就是滚动条宽度了
        get_scrollbar_width : function() {
            var $el;
            if(scrollbar_width) {
                return scrollbar_width;
            }
            $el = $('<div id="scrollbar-width" style="position:absolute;left:-1000px;top:-1000px;background:#000;"><div style="width:50px;height:50px;background:#00f;"><div style="height:50px;overflow-y:scroll;background:#0f0;"><div data-content="true" style="height:51px;background:#f00;"></div></div></div>').appendTo($('body'));
            scrollbar_width = 50 - parseInt($el.find("[data-content]").width());
            $el.remove();
            return scrollbar_width;
        }
    };

    $.extend(Scroller.prototype, events);

    /**
     * 滚！
     * @param {Number} y Y
     * @param {Number|String} [speed] 动画持续时间，默认 'slow'
     * @param {Function} [callback] 动画完成的回调
     * @param {jQuery|HTMLElement} [$el]
     */
    Scroller.go = function (y, speed, callback, $el) {
        $el = $($el);
        if (!$el[0]) {
            if (!default_$el) {
                // 默认滚动元素
                // webkit: document.body
                // ie/ff: document.documentElement
                default_$el = $($.browser.webkit ? document.body : document.documentElement)
            }
            $el = default_$el;
        }

        if (y === $el.scrollTop()) {
            return;
        }

        if (typeof arguments[1] === 'function') {
            callback = arguments[1];
            speed = undefined;
        }

        if (speed != 0) {
            $el.animate({
                scrollTop: y
            }, {
                duration: speed || scroll_speed,
                easing: easing.get('easeOutExpo'),
                complete: callback
            });
        } else {
            $el.scrollTop(0);
        }
    };

    Scroller.top = function (callback) {
        this.go(0, callback);
    };


    return Scroller;
});