/**
 * 弹出提示
 * @author iscowei
 * @date 16-10-12
 */
define(function (require, exports, module) {
    var $ = require('$'),
	    lib = require('lib'),
        easing = lib.get('./ui.easing'),

        tmpl = require('./tmpl'),
	    widgets = require('./ui.widgets'),
        scr_reader_mode = require('./scr_reader_mode'),

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,
	    interval,

        undefined;


    var toast = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['toast']());
            me.$label = me.$el.find('[data-id="toast-label"]');
	        me.$loading = me.$el.find('[data-id="toast-loading"]');
	        me.$remain = me.$el.find('[data-id="remain-time"]');
            me.$el.appendTo(document.body);

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
        _show: function (type, msg, second, callback) {
            if (!msg)
                return;

            if (scr_reader_mode.is_enable())
                return alert(msg);

            var me = this;
            me._render_if();
            var $el = me.$el;

            // 文字
            me.$label.html(msg);

	        if(type === 'loading') {
		        me.$loading.show();
	        } else {
		        me.$loading.hide();
	        }

            if (!msg) // 没有消息就隐藏
                return me.hide();

            clearTimeout(timer);
	        clearInterval(interval);

            // 显示
	        widgets.mask.toggle(true, 'ui.toast', $el, true);
            $el.stop(true, true)
                .css({ top: hidden_px, display: 'block' })
                .animate({ top: parseInt(($(window).height() - $el.height()) / 2) }, speed, easing.get('easeOutExpo'));

            // 延迟一定时间后隐藏
	        if(second > 0) {
		        me.$remain.text('(' + second + '秒后自动关闭)');
		        timer = setTimeout(function() {
			        me.hide();
			        widgets.mask.toggle(false, 'ui.toast', $el, true);
			        clearInterval(interval);
			        callback && callback();
		        }, second * 1000);
		        interval = setInterval(function() {
			        me.$remain.text('(' + (second===0 ? second : --second) + '秒后自动关闭)');
		        }, 1000);
	        } else {
		        me.$remain.text('');
	        }
        },

        hide: function () {
            clearTimeout(timer);
	        clearInterval(interval);

            var me = this, $el = me.$el;
            if ($el) {
                $el.stop(true, true).animate({ top: hidden_px }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide();
	                widgets.mask.toggle(false, 'ui.toast', $el, true);
                });
            }
        }
    };

    $.each({loading: 'loading', tips: 'tips'}, function (key, type) {
        toast[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._show.apply(this, args);
        };
    });

    return toast;
});