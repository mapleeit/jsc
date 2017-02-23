/**
 * 工具栏组件
 * @author jameszuo
 * @date 13-8-23
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

    // Button = require('./ui.toolbar.button'),
        ButtonGroup = require('./ui.toolbar.button_group'),

        tmpl = require('./tmpl'),

        undef;


    var Toolbar = function (args) {
        this._$el = null;
        this._set_btns(args.btns || []);
        this._cls = args.cls;
        this._apply_to = args.apply_to;
        this._filter_visible = typeof args.filter_visible === 'boolean' ? args.filter_visible : false;

        // 默认所有按钮都是隐藏的，只有调用 toggle 方法时才
        if (this._filter_visible)
            this.filter();
    };

    Toolbar.prototype = {

        /**
         * 渲染
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                $apply_to = me._apply_to ? $(me._apply_to) : null;

            if ($apply_to && $apply_to[0]) {
                me._$el = $apply_to;
            } else {
                me._$el = $(tmpl.toolbar({ btns: me._btns })).addClass(this._cls).appendTo($to);
            }

            me._$el.find('[data-btn-id]').each(function (i, btn_el) {
                var $btn_el = $(btn_el),
                    id = $btn_el.attr('data-btn-id'),
                    btn = me._btn_map[id];
                btn.apply_on($btn_el);
            });

            me.render = $.noop;
        },

        update: function () {
            var me = this,
                args = $.makeArray(arguments);

            // 设置按钮的状态
            $.each(me._btns, function (i, btn) {
                btn.update.apply(btn, args);
            });
        },

        get_btns: function () {
            return this._btns;
        },

        get_$el: function () {
            return this._$el;
        },

        toggle: function (visible) {
            this._$el && this._$el.css('display', visible ? '' : 'none');
        },

        /**
         * 切换按钮过滤器
         * @param {String} [filter] 使符合过滤方式的按钮可见
         */
        filter: function (filter) {
            if (!this._filter_visible)
                return;

            var has_visible_btn = false;

            if (filter) {
                $.each(this.get_btns(), function (i, btn) {
                    var match = btn._o.filter === filter;
                    if (match) {
                        btn.show();
                        has_visible_btn = true;
                    } else {
                        btn.hide();
                    }
                });
            } else {
                $.each(this.get_btns(), function (i, btn) {
                    btn.hide();
                });
            }

            var $el = this.get_$el();
            $el && $el[0] && $el.toggle(has_visible_btn);
        },

        /**
         * 设置按钮
         * @param {Button[]} btns
         */
        _set_btns: function (btns) {
            var me = this;

            me._btns = btns;
            me._btn_map = {};

            $.each(btns, function (i, btn) {
                me._btn_map[btn.get_id()] = btn;

                // 子菜单
                if (ButtonGroup.is_instance(btn)) {
                    $.each(btn._o.buttons, function (j, sb) {
                        me._btn_map[sb.get_id()] = sb;
                    })
                }
            });
        }
    };

    return Toolbar;
});