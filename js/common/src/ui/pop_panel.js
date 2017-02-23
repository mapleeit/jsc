/**
 * 消息提示panel
 * @author jameszuo
 * @date 2013-11-26
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events'),
        scr_reader_mode = require('./scr_reader_mode');

    /**
     * @param {jQuery} options.host_$dom 触发元素
     * @param {jQuery} options.$dom 弹出的panel层的jQuery 对象
     * @param {Function} options.show 显示操作
     * @param {Function} options.hide 隐藏的动作
     * @param {Number} options.delay_time 延迟多久显示 默认500毫秒
     * @param {Boolean} options.trigger_by_focus 可被focus事件触发
     */
    var PopPanel = function (options) {
        var me = this,
            o = me.o = options;

        // 针对读屏软件，始终显示弹出层 - james
        if (scr_reader_mode.is_enable()) {
            me.show();
//            return;
        }
        o.$dom.add(o.host_$dom)
            .on('mouseenter', function () {
                me.show();
            })
            .on('mouseleave', function () {
                me._delay_hide();
            });
    };

    PopPanel.prototype = {

        _timr: null,

        show: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (typeof o.show === 'function') {
                o.show.call(me);
            } else {
                o.$dom.show();
            }
            me.trigger('show', o.$dom);
        },

        hide: function () {
            if (scr_reader_mode.is_enable())
                return;

            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (typeof o.hide === 'function') {
                o.hide.call(me);
            } else {
                o.$dom.hide();
            }
            me.trigger('hide', o.$dom);
        },

        _delay_hide: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (me._disable) {
                return;
            }

            me._timr = setTimeout(function () {
                me.hide();
            }, o.delay_time);
        },

        disable: function () {
            this._disable = true;
        },

        enable: function () {
            this._disable = false;
        },

        is_able: function(){
            return !this._disable;
        }

    };

    $.extend(PopPanel.prototype, events);

    return PopPanel;
});