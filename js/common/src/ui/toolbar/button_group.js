/**
 * 按钮分组
 * @author jameszuo
 * @date 13-8-2
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        Button = require('./ui.toolbar.button'),
        tmpl = require('./tmpl'),
        noop = $.noop,

        default_options = {
            id: '',
            label: '',
            icon: '',
            cls: '',
            filter: '',
            render: noop,
            visible: noop, // 如果不设置或该方法返回非boolean值，则默认可见
            enable: noop,  // 如果不设置或该方法返回非boolean值，则默认可点击
            tmpl: tmpl.toolbar_button_group,
            buttons: []
        },
        undef;


    var ButtonGroup = function (options) {
        Button.call(this, options);
        this._o = $.extend({}, default_options, options);
    };

    ButtonGroup.prototype = $.extend({}, Button.prototype, {

        __is_tbar_gbtn: true,

        apply_on: function ($el) {
            Button.prototype.apply_on.apply(this, arguments);

            $el.on('mouseenter', function () {
                $(this).addClass('on');
            });
            $el.on('mouseleave', function () {
                $(this).removeClass('on');
            });
        },

        render: function ($to) {
            var me = this,
                $el = this._$el = $(me._o.tmpl({ o: this._o })).appendTo($to),
                $ls = $el.find('ul'),
                o = me._o;

            // append button
            $.each(o.buttons, function (i, btn_cfg) {
                btn_cfg.tmpl = tmpl.toolbar_button_group_item;
                var btn = o.buttons[i] = new Button(btn_cfg);
                btn.render($ls);
            });

            $el.on({
                mouseenter: function () {
                    $el.addClass('on');
                },
                mouseleave: function () {
                    $el.removeClass('on');
                }
            });

            this.__rendered = true;

            if (o.render !== noop) {
                o.render.call(me);
            }
        },

        /**
         * @overwrite
         */
        update: function () {
            if (!this.__rendered)
                return;

            Button.prototype.update.call(this);

            for (var i = 0, l = this._o.buttons.length; i < l; i++) {
                var btn = this._o.buttons[i];
                btn.update();
            }
        },

        /**
         * @overwrite
         */
        set_handler: function () {
            throw 'ButtonGroup.set_handler() 不允许修改handler';
        }
    });

    ButtonGroup.is_instance = function (obj) {
        return !!obj && obj.__is_tbar_gbtn;
    };

    return ButtonGroup;
});