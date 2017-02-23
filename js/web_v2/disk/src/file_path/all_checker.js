/**
 * 文件列表全选
 * @author jameszuo
 * @date 13-7-31
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
        set_none_checked: function(){},
        $el: null,
        rendered: false,
        default_event: 'toggle_check',
        cur_checked: false,  // 当前勾选状态        default_event: 'toggle_check',
        change_event: '',
        /**
         * 设置当前响应事件
         * @param event
         */
        set_change_event: function(event){
            this.change_event = event;
        },
        _render: function ($to) {
            if (this.rendered) {
                return;
            }

            var me = this, $el;
            // 点击全选、取消全选
            $el = $('#_disk_all_checker');
            if (!$el[0]) {
                $el = $(tmpl.all_checker());
                $el.prependTo($to.children(':first'));
            }
            me.$el = $el;

            $el.on('click', function (e) {
                e.preventDefault();

                var to_check = !me.cur_checked;

                me.toggle_check(to_check);

				me.trigger(me.change_event || me.default_event, to_check); // 这句不要移入 toggle_check() 方法中，那样会导致循环触发事件 james
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

            me.$el.parent().toggleClass('act', to_check);
            me.cur_checked = to_check;
        },

        cancel_check: function() {
            this.$el.parent().removeClass('act');
            this.cur_checked = false;
            this.trigger(this.change_event || this.default_event, false);
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