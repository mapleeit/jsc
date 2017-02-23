/**
 * 文件列表全选
 * @author hibincheng
 * @date 15-05-31
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        undef;


    var all_checker = {

        $el: null,

        rendered: false,

        default_event: 'checkall',

        cur_checked: false,  // 当前勾选状态        default_event: 'toggle_check',

        render: function () {
            if (this.rendered) {
                return;
            }

            var me = this, $el;
            $el = me.$el = $('#outlink_checkall');

            $el.on('click', function (e) {
                e.preventDefault();

                var to_check = !me.cur_checked;

                me.toggle_check(to_check);

				me.trigger(me.default_event, to_check, e);
            });

            me.rendered = true;
            me.render = $.noop;
        },

        /**
         * 设置全选按钮状态
         * @param {Boolean} to_check
         */
        toggle_check: function (to_check) {
            var me = this;
            if (!me.rendered) {
                return;
            }
            // 如果状态不变，则退出
            if (to_check === me.cur_checked) {
                return;
            }

            me.$el.toggleClass('checkalled', to_check);
            me.cur_checked = to_check;
        },

        is_checked: function () {
            return this.cur_checked;
        },

        hide: function () {
            this._toggle(false);
        },

        show: function () {
            this._toggle(true);
        },

        _toggle: function (visible) {
            if (this.rendered) {
                this.$el.parent().toggleClass('step-uncheck', !visible);
            }
        }
    };

    $.extend(all_checker, events);

    return all_checker;
});