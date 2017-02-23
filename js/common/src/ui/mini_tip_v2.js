/**
 * 页面上方提示条，临时，过几秒自动消失
 * @author jameszuo
 * @modified by maplemiao 16-09-07
 * @date 16-09-07
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),
        progress,
        scr_reader_mode = require('./scr_reader_mode'),

        delay_min = 2, // 消息显示的时间下限
        delay_max = 5, // 消息显示的时间上限
        second_every_letter = .4, // 每多一个字符显示的秒数

        timer,

        undefined;


    var mini_tip = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_tip_v2']());
            me.$msg = me.$el.find('.msg-inner');
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

            var $msg = me.$msg;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏progress
            progress.hide();

            clearTimeout(timer);

            // 显示
            $msg.parent().show();
            $msg.removeClass('active warning hide')
                .addClass(type + ' show');

            // 延迟一定时间后隐藏
            var delay = second > 0 ? second : calc_delay(msg);
            timer = setTimeout(function () {
	            me.hide();
            }, delay * 1000);
        },

        hide: function () {
            clearTimeout(timer);

            var me = this, $msg = me.$msg;
            if ($msg) {
                $msg.removeClass('show')
                    .addClass('hide');
                $msg.parent().hide();
            }
        }
    };

    $.each({ok: 'active', warn: 'warning', error: 'warning'}, function (key, type) {
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