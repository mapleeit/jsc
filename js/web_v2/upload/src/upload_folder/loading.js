/**
 * 展示loading
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author bondli
 * @date 13-10-08
 */
define(function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        template = lib.get('./template'),
        common = require('common'),

        widgets = common.get('./ui.widgets'),

        tmpl = require('./tmpl'),
        ui_center = common.get('./ui.center'),

        undefined;


    var loading = {
        $el: null,

        render_if: function () {
            if (!this.$el) {
                this.$el = $(tmpl.loading_mark()).hide().appendTo(document.body);
            }
        },
        /**
         * 显示进度
         * @param {String} msg 消息，支持HTML代码
         * @param {Function} cancel_fn 取消时调用的方法
         */
        show: function (msg, cancel_fn) {

            var me = this;

            me.render_if();

            var $el = me.$el;

            if (!$el.parent()[0]) {
                $el.appendTo(document.body).hide();
            }

            // 文字
            $el.find('._n').html(msg);

            //取消事件
            $el.find('._cancel').on('click', function(){
                cancel_fn();
            }).toggle(cancel_fn ? true : false);

            // 显示进度框
            if ($el.is(':hidden')) {

                $el.fadeIn('fast');

                // IE6 居中
                ui_center.listen($el);

                // 显示遮罩
                this.mask(true, true);
            }

        },

        hide: function (mask) {
            if (this.$el) {
                this.$el.stop(true, true).fadeOut('fast', function () {
                    var $el = $(this);
                    ui_center.stop_listen($el);
                    $el.detach();
                });
            }
            // 隐藏遮罩
            if (mask !== false) {
                this.mask(false);
            }
        },

        mask: function (visible, white_mask) {
            white_mask = white_mask !== false;

            widgets.mask.toggle(visible, 'ui.progress', this.$el, white_mask);
        }
    };

    return loading;
});