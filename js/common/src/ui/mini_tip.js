/**
 * 右上角小提示
 * @author jameszuo
 * @date 13-3-14
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
        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),
        progress,
        scr_reader_mode = require('./scr_reader_mode'),

        delay_min = 2, // 消息显示的时间下限
        delay_max = 5, // 消息显示的时间上限
        second_every_letter = .4, // 每多一个字符显示的秒数

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,

        undefined;


    var mini_tip = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_tip']());
            me.$label = me.$el.find('[data-id="label"]');
            me.$el.appendTo(document.body);

            progress = require('./ui.progress');

            me._render_if = $.noop;
        },

        /**
         * 显示提示
         * @param {String} type
         * @param {String} msg
         * @param {Number} [second]
         * @returns {*}
         * @private
         */
        _show: function (type, msg, second) {
            if (!msg)
                return;

            if (scr_reader_mode.is_enable())
                return alert(msg);

            var me = this;

            me._render_if();

            var $el = me.$el;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏progress
            progress.hide();

            clearTimeout(timer);

            // 显示
            $el.stop(true, true)
                .removeClass('full-tip-ok full-tip-warn full-tip-err')
                .addClass('full-tip-' + type)
                .css({ top: hidden_px, display: 'block' })
                .animate({ top: 0 }, speed, easing.get('easeOutExpo'));

            // 延迟一定时间后隐藏
            var delay = second > 0 ? second : calc_delay(msg);
            timer = setTimeout(function () {
                timer = setTimeout(function () {
                    me.hide();
                }, delay * 1000);
            }, speed);
        },

        hide: function () {
            clearTimeout(timer);

            var me = this, $el = me.$el;
            if ($el) {
                $el.stop(true, true).animate({ top: hidden_px }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide().removeClass('full-tip-ok full-tip-warn full-tip-err');
                });
            }
        }
    };

    $.each({ok: 'ok', warn: 'warn', error: 'err'}, function (key, type) {
        mini_tip[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._show.apply(this, args);
        };
    });

    // 计算提示消息显示的持续时间
    var calc_delay = function (msg) {
        return Math.min(Math.max(msg.length * second_every_letter, delay_min), delay_max);
    };

    return mini_tip;
});