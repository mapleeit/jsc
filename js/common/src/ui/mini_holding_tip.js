/**
 * 页面上方提示条，常驻，点击关闭才关闭
 * 目前支持常驻提示队列
 * @author maplemiao
 * @date 16-09-07
 */

"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        tmpl = require('./tmpl'),
        progress,
        scr_reader_mode = require('./scr_reader_mode');

    var mini_holding_tip = {
        _tip_queue: [],
        _first_click_close_flag: true,
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_holding_tip']());
            me.$msg = me.$el.find('.msg-inner');
            me.$closeBtn = me.$el.find('.j-close-btn');
            me.$msgText = me.$el.find('.j-msg-text');
            me.$linkBtn = me.$el.find('.j-link-btn');

            me.$el.appendTo(document.body);
            me._bind_events();

            progress = require('./ui.progress');

            me._render_if = $.noop;
        },

        _bind_events: function () {
            var me = this;

            me.$el.on('click', '.j-close-btn', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me._show_next();
                me._first_click_close_flag = false;
            });
        },

        /**
         * 展示常驻提示入口
         * 注意：不会立即展示，而是按照优先级添加到队列中
         * @param {Object} options
         * @param {String} options.msgText
         * @param {String} options.linkBtnHref
         * @param {String} options.linkBtnTarget
         * @param {String} options.linkBtnText
         * @param {Number} options.priority 数字越小优先级越高
         * 目前用到：
         * [priority:10] upload提示下载插件
         * @returns {*}
         */
        show: function (options) {
            var me = this;

            me._render_if();
            me.$msg.removeClass('hide')
                    .addClass('show');

            // 根据优先级给队列中添加元素
            if (!me._tip_queue.length) {
                me._tip_queue.push(options);
            } else {
                var insert_flag = false;
                for (var i = 0; i < me._tip_queue.length; i++) {
                    if (options.priority <= me._tip_queue[i].priority) {
                        me._tip_queue.splice(i, 0, options);
                        insert_flag = true;
                        return;
                    }
                }
                if (!insert_flag) { // 如果在中间没有插入，则在最后添加
                    me._tip_queue.push(options);
                }
            }

            me._change_html(me._tip_queue[0]);
        },

        _show_next: function () {
            var me = this;

            if (me._tip_queue.length - 1) {
                if (me._first_click_close_flag) {
                    me._tip_queue.shift()
                }
                me._change_html(me._tip_queue.shift());
            } else {
                me.hide();
            }
        },

        _change_html: function (options) {
            var me = this;

            me.$linkBtn.attr('href', options.linkBtnHref);
            me.$linkBtn.attr('target', options.linkBtnTarget || '');
            me.$linkBtn.html(options.linkBtnText);
            me.$msgText.html(options.msgText);
        },

        hide: function () {
            var me = this,
                $msg = me.$msg;
            if ($msg) {
                $msg.removeClass('show')
                    .addClass('hide');
            }
        }
    };

    return mini_holding_tip;
});