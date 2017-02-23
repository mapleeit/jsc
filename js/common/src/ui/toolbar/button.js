/**
 * 工具条按钮item
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        mini_tip = require('./ui.mini_tip'),
        tmpl = require('./tmpl'),
        global_event = require('./global.global_event'),

        noop = $.noop,
        default_options = {
            id: '',
            label: '',
            icon: '',
            cls: '',
            filter: '',
            // 快捷键
            short_key: '', //  ctrl+k, shift+r, ctrl+shift+b ...
            render: noop,
            handler: noop,
            before_handler: noop,
            visible: noop, // 如果不设置或该方法返回非boolean值，则默认可见
            enable: noop,  // 如果不设置或该方法返回非boolean值，则默认可点击
            validate: noop,  // 如果不设置或该方法返回非string值，则不提示错误
            tmpl: tmpl.toolbar_button
        },
        undef;


    /**
     * 工具栏按钮
     * @param {Object} options
     *  {String} id
     *  {String} label
     *  {Function} handler fn($.Event) {}
     *  {String} [icon] 按钮icon class
     *  {String} [cls] 按钮class
     *  {Boolean} [update_enable] 在不可用时，禁用按钮并显示鼠标提示，默认false
     *  {Function} [visible] fn(Status) {} 返回true表示可见，返回false表示隐藏
     *  {Function} [enable] fn(Status) {} 返回true表示可用，返回false表示禁用
     */
    var Button = function (options) {
        var o = this._o = $.extend({}, default_options, options);
        this._visible = true;
        if (o.short_key && o.short_key.indexOf(' ') > -1) {
            o.short_key = '';
        }
    };

    Button.prototype = {

        __is_tbar_btn: true,
        /**
         * 同步显示状态 直出的部分可能不一样
         */
        sync_visible: function () {
            if (this._$el) {
                var display = this._$el.css('display');
                this._visible = display && display.toLowerCase() !== 'none' || !display;
            }
        },
        apply_on: function ($el) {
            var me = this,
                o = me._o;

            me._$el = $el;//.toggle(me._visible);

            $el.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                me.handler(e);
            });

            this.sync_visible();

            if (o.render !== noop) {
                o.render.call(me);
            }
        },

        handler: function (e) {
            var me = this, o = me._o;

            // before handler
            o.before_handler && o.before_handler.call(me);

            // 点击前的检查
            if ($.isFunction(o.validate) && o.validate !== noop) {
                var err = o.validate.call(me);
                if (err) {
                    if ($.isArray(err)) {
                        mini_tip.warn(err[0]);
                    } else {
                        mini_tip.warn(err);
                    }
                    return;
                }
            }
            // 回调
            $.isFunction(o.handler) && o.handler.call(me, e);
        },

        get_id: function () {
            return this._o.id;
        },

        /**
         * 更新按钮状态
         */
        update: function () {
            var o = this._o;

            // 是否可见
            var visible = o.visible && o.visible.apply(this, arguments);
            if (typeof visible !== 'boolean') {
                visible = true;
            }
            this._set_visible(visible);

            // 是否可点        \
            if (o.update_enable) {
                var err_tip = o.validate && o.validate.apply(this, arguments);
                this._set_err_tip($.isArray(err_tip) ? err_tip[0] : err_tip);
            }
        },

        set_handler: function (fn) {
            this._o.handler = fn;
        },

        get_$el: function () {
            return this._$el;
        },

        show: function () {
            this._set_visible(true);
        },

        hide: function () {
            this._set_visible(false);
        },

        is_visible: function () {
            return this._visible;
        },

        is_enable: function () {
            return !this._err_tip;
        },

        get_filter: function () {
            return this._o.filter;
        },

        _set_visible: function (yes) {
            var me = this, o = me._o;

            if (me._visible !== yes && me._$el) {
                me._$el.toggle(yes);
                me._visible = yes;
            }
            /*
             if (me._visible !== yes) {
             me._$el && me._$el.toggle(yes);
             me._visible = yes;
             }
             */

            // 快捷键
            if (o.short_key) {
                if (yes) {
                    !me._listening_key && me.listenTo(global_event, 'press_key_' + o.short_key, function (e) {
                        me.handler(e);
                    });
                    me._listening_key = true;
                } else {
                    me.stopListening(global_event, 'press_key_' + o.short_key);
                    me._listening_key = false;
                }
            }
        },

        _set_err_tip: function (err) {
            if (this._err_tip !== err) {
                this._$el.attr('title', err).toggleClass('disable', !!err);
                this._err_tip = err;
            }
        }/*,

         _set_status: function (status) {
         this._status = status;
         }*/
    };

    Button.is_instance = function (obj) {
        return !!obj && obj.__is_tbar_btn === true;
    };

    $.extend(Button.prototype, events);

    return Button;
});