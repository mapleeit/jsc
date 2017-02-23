/**
 * 展示处理进度
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author jameszuo
 * @date 13-1-19
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        easing = lib.get('./ui.easing'),

        widgets = require('./ui.widgets'),
        mini_tip,
        tmpl = require('./tmpl'),

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,

        undefined;


    var progress = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['progress']());
            me.$label = me.$el.find('[data-id="label"]');
            me.$el.appendTo(document.body);

            mini_tip = require('./ui.mini_tip');

            me._render_if = $.noop;
        },

        /**
         * 显示进度
         * @param {String} msg 消息，支持HTML代码
         * @param {Number|Boolean} delay_to_hide 延迟N秒后隐藏 | 是否延迟隐藏
         * @param {Boolean} white_mask 是否使用白色遮罩，默认true
         * @param {String} id 临时ID，和hide_if(id)一起用（如果目前的进度是这个ID才隐藏）
         */
        show: function (msg, delay_to_hide, white_mask, id) {
            clearTimeout(timer);

            var me = this;

            me._render_if();

            var $el = me.$el;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏mini_tip
            mini_tip.hide();

            $el.stop(true, true);

            if ($el.is(':hidden')) {
                // 显示
                $el.css({
                    'display': 'block',
                    'opacity': 0
                }).animate({ opacity: 1 }, speed, easing.get('easeOutExpo'));
                // 显示遮罩
                me.mask(true, white_mask);
            }

            // 延迟后隐藏
            if (delay_to_hide) {
                timer = setTimeout(function () {
                    var delay = 1.5;
                    if (typeof delay_to_hide == 'number') {
                        delay = delay_to_hide;
                    }
                    timer = setTimeout(function () {
                        me.hide();
                    }, delay * 1000);
                }, speed);
            }

            this._cur_id = id || undefined;
        },

        /**
         * @param {Boolean} [mask]
         */
        hide: function (mask) {
            clearTimeout(timer);

            var $el = this.$el;
            if ($el) {
                $el.stop(true, true).animate({ opacity: 0 }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide();
                });
            }
            // 隐藏遮罩
            if (mask !== false)
                this.mask(false);
        },

        /**
         * 如果目前的进度用的是这个ID才隐藏
         * @param {Boolean} mask
         * @param {String} id 临时ID，需要在调用.show(..., id)方法时传入
         */
        hide_if: function (mask, id) {
            if (this._cur_id && this._cur_id === id) {
                this.hide(mask);
            }
        },

        mask: function (visible, white_mask) {
            white_mask = white_mask !== false;

            widgets.mask.toggle(visible, 'ui.progress', this.$el, white_mask);
        }
    };

    return progress;
});