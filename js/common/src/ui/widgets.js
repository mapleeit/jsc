/**
 * 一些小组件
 * @jameszuo 12-12-22 下午5:32
 */
define(function (require, exports, module) {

    var lib = require('lib'),

        $ = require('$'),

        template = lib.get('./template'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        tmpl = require('./tmpl'),
        constants = require('./constants'),
        global_event = require('./global.global_event'),
        page_event = require('./global.global_event').namespace('page'),
        ui_center = require('./ui.center'),
        scr_reader_mode = require('./scr_reader_mode'),


        $win = $(window),
        $doc = $(document),

        dam_ie6 = $.browser.msie && $.browser.version < 7,

        KEYPRESS_EVENT_NAME = dam_ie6 ? 'keypress' : 'keydown',

        undefined;

    /**
     * 确认框
     * @param title 标题
     * @param msg 消息
     * @param {String/Object} desc 消息（小字）
     * @param ok_callback 确定回调
     * @param cancel_callback 取消回调
     * @param button_texts 按钮文本
     * @param escape_html 转义msg、desc为html文本，默认true
     */
    exports.confirm = function (title, msg, desc, ok_callback, cancel_callback, button_texts, escape_html) {
        var tip = '';
        if (typeof desc === 'object') {
            tip = desc.tip;
            desc = desc.text;
        }

        // for ARIA 读屏软件使用浏览器内置的 confirm 对话框
        if (scr_reader_mode.is_enable()) {
            if (window.confirm(msg + '\n' + (tip || desc))) {
                $.isFunction(ok_callback) && ok_callback();
            } else {
                $.isFunction(cancel_callback) && cancel_callback();
            }
            return;
        }

        var $el = $('#_widgets_confirm');
        if ($el[0]) {
            $el.remove();
        }

        if (!$.isArray(button_texts)) {
            button_texts = [];
        }

        escape_html = typeof escape_html === 'boolean' ? escape_html : true;

        $el = $(tmpl.confirm({ title: title, msg: msg, desc: desc, tip: tip, button_texts: button_texts, escape_html: escape_html })).appendTo(document.body);

        var
            ok = function (e) {
                toggle(false);

                if ($.isFunction(ok_callback))
                    ok_callback(e);
            },

            cancel = function (e) {
                toggle(false);

                if ($.isFunction(cancel_callback))
                    cancel_callback(e);
            },

            toggle = function (visible) {
                if (visible) {
                    $el.fadeIn('fast');
                    ui_center.listen($el);
                } else {
                    $el.fadeOut('fast', function () {
                        ui_center.stop_listen($el);
                        $el.remove();
                    });
                }

                mask.toggle(visible, 'ui.widgets.confirm', '', true);

                if (scr_reader_mode.is_enable()) {
                    visible ? TabTie.tie($el) : TabTie.untie();
                }
            };

        toggle(true);

        // 默认焦点
        if (scr_reader_mode.is_enable()) {
            $el.find('[tabindex="0"]:first').focus();
        } else {
            $el.find('a._ok,:button._ok').focus();
        }

        // 交互
        $el.on('click.widgets_confirm', 'a._ok,:button._ok', function (e) {
            e.preventDefault();
            ok(e);
        });
        $el.on('click.widgets_confirm', 'a._x,:button._x', function (e) {
            e.preventDefault();
            cancel(e);
        });
        $el.on('keydown.widgets_confirm', function (e) {
            if (e.which === 27) {  // esc
                cancel(e);
            } else if (e.which === 13) { // enter
                ok(e);
            }
        });
        require.async('jquery_ui', function () {
            if (!$el.parent()[0]) {
                return;
            }
            $el.draggable({
                handle: '.ui-xbox-title, .ui-xbox-foot, [data-draggable-target],.full-pop-header,.full-pop-btn',
                cancel: 'a, button, input',
                containment: 'document',
                start: function () {
                    ui_center.stop_listen($el);
                }
            });
        });
    };

    /**
     * 提示框
     * @param {Object} options
     *  - {String} title
     *  - {String} msg
     *  - {String} desc
     *  - {String} button_text
     *  - {Function} ok
     */
    exports.alert = function (options) {
        // for ARIA 读屏软件使用浏览器内置的 confirm 对话框
        if (scr_reader_mode.is_enable()) {
            window.alert(options.msg + '\n' + (options.desc || ''));
            if ($.isFunction(options.ok)) {
                options.ok();
            }
            return;
        }

        new Dialog({
            title: options.title,

            content: $(tmpl.alert_dialog_content({ type: options.type, msg: options.msg, desc: options.desc })),
            destroy_on_hide: true,
            buttons: [
                { id: 'OK', text: options.button_text || '确定', klass: 'ui-btn-ok', disabled: false, visible: true }
            ],
            handlers: {
                OK: function () {
                    this.hide();

                    if ($.isFunction(options.ok)) {
                        options.ok();
                    }
                }
            }
        }).show();
    };
    exports.alert.ok = function (options) {
        return exports.alert($.extend(options, {
            type: 'ok'
        }));
    };
    exports.alert.info = function (options) {
        return exports.alert($.extend(options, {
            type: 'info'
        }));
    };
    exports.alert.warn = function (options) {
        return exports.alert($.extend(options, {
            type: 'warn'
        }));
    };

    /**
     * 显示、隐藏遮罩
     */
    var mask = exports.mask = {

        _namespaces: {},
        _listened_window: false,

        /**
         * 显示遮罩
         * @param {string} namespace
         * @param {jQuery|HTMLElement} [under_$el] 将元素显示在遮罩层上方（修改 under_$el 的 z-index）
         * @param {String} [mask_type] 遮罩类型
         */
        show: function (namespace, under_$el, mask_type, extra) {
            this.toggle(true, namespace, under_$el, mask_type, extra);
        },

        hide: function (namespace) {
            this.toggle(false, namespace);
        },
        /**
         *
         * @param styles
         */
        always_styles: function(styles){
            this._prior_styles = styles;
        },
        remove_styles: function(){
            this._prior_styles = {};
        },
        /**
         * 显示、隐藏遮罩
         * @param {boolean} visible
         * @param {string} namespace
         * @param {jQuery|HTMLElement} [under_$el] 将元素显示在遮罩层上方（修改 under_$el 的 z-index）
         * @param {String} [mask_type] 遮罩类型
         * @param {Object} extra 扩展参数
         */
        toggle: function (visible, namespace, under_$el, mask_type, extra) {
            if (typeof visible !== 'boolean') {
                return;
            }
            //优先级最高的样式属性
            if(!this._prior_styles){
                this._prior_styles = {};
            }
            var transparent = mask_type === 'transparent';
            mask_type = mask_type === true;

            extra = extra || {};
            var opacity = this._prior_styles.opacity || extra.opacity || 0.65;

            var namespaces = this._namespaces,
                cur_showing = namespace in namespaces;

            // 防止重复隐藏或显示
            if (visible === cur_showing) {
                return;
            }

            var
                me = this,
                $mask_el = me._$mask || (me._$mask = $(tmpl.mask()).hide().appendTo(document.body)),
                position = dam_ie6 ? 'absolute' : 'fixed';

            $mask_el
                .stop()
                .css({
                    top: 0,
                    left: 0,
                    position: position,
                    width: '100%',
                    height: position === 'fixed' ? '100%' : document.body.scrollHeight
                });

            // 显示
            if (visible) {
                if (transparent) {
                    $mask_el.removeClass('ui-mask-white').css({ 'background-color': this._prior_styles.bg_color || '#FFF', 'opacity': 0 });
                } else if (typeof mask_type === 'boolean') {
                    $mask_el.toggleClass('ui-mask-white', !!mask_type).css('background-color', this._prior_styles.bg_color || (mask_type ? '#FFF' : '#000'));
                }

                if (!$mask_el.is(':visible'))
                    $mask_el.css({ opacity: 0, display: 'block' });

                !transparent && $mask_el.animate({ opacity: opacity }, 'fast');

                // 动态调整遮罩大小
                if (dam_ie6 && !me._listened_window) {
                    me.listenTo(global_event, 'window_resize window_scroll', function () {
                        setTimeout(function () {
                            $mask_el.height(document.body.scrollHeight);
                        }, 0);
                    });
                    me._listened_window = true;
                }

                // 将元素显示在遮罩层上方
                if (under_$el) {
                    var z_index = parseInt($mask_el.css('z-index'));
                    if (z_index) {
                        $(under_$el).css('z-index', z_index + 1);
                    }
                }

                namespaces[namespace] = true;
            }

            // 隐藏
            else {
                delete namespaces[namespace];

                // 没有任何元素再需要遮罩，即可隐藏
                if ($.isEmptyObject(namespaces)) {
                    $mask_el.animate({ opacity: 0 }, 'fast', function () {
                        $(this).css({ opacity: '', display: 'none' });
                    });

                    if (dam_ie6) {
                        me.stopListening(global_event, 'window_resize window_scroll');
                        me._listened_window = false;
                    }
                }
            }
        }
    };
    $.extend(mask, events);

    // 没有遮罩在显示时，才可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        return $.isEmptyObject(mask._namespaces);
    });


    /**
     * 对话框
     */
    var Dialog = exports.Dialog = (function () {
        var
            DEFAULTS = {
                klass: '',
                title: '',
                content: '', // content 可以是string、jQueryElements、HTMLElement、function
                animate: true,
                module: true,
                empty_on_hide: false, // 隐藏时清空
                destroy_on_hide: false, // 隐藏时销毁
                no_doc_wheel: false, // 隐藏浏览器默认滚动条
                tmpl: tmpl.dialog,
                mask_bg: 'ui-mask-white',
                mask_ns: 'default', // 参考mask的namespace(随便写，唯一就行)
                buttons: [ 'OK', 'CANCEL' ], // or [ { id:'test', text:'测试', klass:'', disabled:false } ]
                movable: true, // 是否可移动窗口
                handlers: null, // { OK: func(), CANCEL: func() }
                out_look_2_0: false//2.0风格
            },

            DEFAULT_BUTTONS = {
                OK: { id: 'OK', text: '确定', klass: 'g-btn-blue', disabled: false, visible: true, submit: true },
                CANCEL: { id: 'CANCEL', text: '取消', klass: 'g-btn-gray', disabled: false, visible: true },
                CLOSE: { id: 'CLOSE', text: '关闭', klass: 'g-btn-gray', disabled: false, visible: true }
            },

        // 构造函数
            Dialog = function (config) {
                this.config = $.extend({}, DEFAULTS, config);
            };

        Dialog.prototype = {

            _rendered: false,
            _visible: false,

            render_if: function () {
                var me = this;
                if (!me._rendered) {
                    me._rendered = true;

                    var
                        config = me.config,
                        $el;

                    // 预处理按钮
                    var buttons = $.map(config.buttons, function (btn) {
                        if (typeof btn == 'string') {
                            return DEFAULT_BUTTONS[btn];
                        } else {
                            return btn.id ? btn : undefined;
                        }
                    });
                    //外观2.0风格
                    if (config.out_look_2_0) {
                        config.tmpl = tmpl.dialog_2_0;
                    }
                    // 构造并插入内容
                    $el = me.$el = $(config.tmpl({ config: config, buttons: buttons })).hide().attr('role', 'alertdialog').appendTo(document.body);

                    var $foot = $el.find('div.__buttons');

                    me.$buttons = $foot.children(':button,:submit,[data-id=button]');
                    me.$msg = $foot.children('.__msg');

                    // 绑定一些事件 ===============================================

                    // 绑定按钮事件
                    if (config.handlers) {
                        $.each(buttons, function (i, btn) {
                            if (btn !== DEFAULT_BUTTONS.CANCEL && btn !== DEFAULT_BUTTONS.CLOSE) {
                                $el.on('click', ':button[data-btn-id="' + btn.id + '"]', $.proxy(config.handlers[btn.id] || $.noop, me));
                                $el.on('click', 'a[data-btn-id="' + btn.id + '"]', $.proxy(config.handlers[btn.id] || $.noop, me));
                            }

                        });
                    }

                    // 按钮状态
                    $.each(buttons, function (i, button) {
                        me.set_button_visible(button.id, button.visible);
                        me.set_button_enable(button.id, !button.disabled);
                    });

                    // 取消/关闭按钮特殊处理
                    $el.on('click', '[data-btn-id=CANCEL], [data-btn-id=CLOSE]', function (e) {
                        e.preventDefault();
                        me.hide(false);
                    });

                    // 回车
                    $el.on('keyup', function (e) {
                        if (e.which === 13 && config.handlers['OK'] && !$(e.target).closest('button, a')[0]) {
                            // 如果有OK按钮，且OK按钮不可见，则不回调OK事件 - james (修复OK按钮隐藏后，按下回车仍然触发OK事件的bug)
                            var $ok = me.$buttons.filter('[data-btn-id="OK"]');
                            if ($ok[0] && !$ok.is(':visible')) {
                                return;
                            }
                            config.handlers['OK'].call(me);
                        }
                    });


                    // 设置内容
                    if (config.content) {
                        me.set_content(config.content);
                    }

                    this.trigger('render');
                }
            },

            show: function () {

                if (this._visible) {
                    return;
                }

                var me = this;
                me.render_if();

                me.config.animate ? me.$el.fadeIn('fast', function () {
                    me.trigger('after_show', me.$el);
                }) : me.$el.show();

                if (me.config.no_doc_wheel)
                    me.no_doc_wheel(true);

                if (me.config.module) {
                    //可以设置dialog的遮罩背景色，默认是灰色
                    if (me.config.mask_bg == 'ui-mask-white') {
                        mask.show('ui.widgets.Dialog.' + me.config.mask_ns, '', true);
                    }
                    else {
                        mask.show('ui.widgets.Dialog.' + me.config.mask_ns);
                    }
                }

                me.enable_esc(true);

                ui_center.listen(me.$el);

                if (me.config.movable) {
                    require.async('jquery_ui', function () {
                        if (!me.$el || !me.$el.parent()[0]) {
                            return;
                        }
                        me.$el.draggable({
                            handle: '.box-head, .ui-xbox-title, .ui-xbox-foot, [data-draggable-target],.full-pop-header,.full-pop-btn',
                            cancel: 'a, button, input',
                            containment: 'document',
                            start: function () {
                                ui_center.stop_listen(me.$el);
                            }
                        });
                    });
                }

                if (scr_reader_mode.is_enable()) {
                    TabTie.tie(me.$el);
                }

                this._visible = true;

                this.trigger('show');
            },

            /**
             * 隐藏
             */
            hide: function (isCancel) {
                if (!this._visible) {
                    return;
                }

                var me = this,
                    config = me.config;

                /*// 隐藏前进行判断, CANCEL事件返回false时阻止关闭
                 if (config.handlers && config.handlers['CANCEL'] && config.handlers['CANCEL'].call(me) === false) {
                 return;
                 }*/

                var after_hide = function () {
                    me.hide_msg();

                    // 恢复滚动条
                    if (me.config.no_doc_wheel)
                        me.no_doc_wheel(false);

                    // 取消按下esc关闭窗口事件
                    me.enable_esc(false);

                    // 隐藏遮罩
                    if (config.module) {
                        mask.hide('ui.widgets.Dialog.' + me.config.mask_ns);
                    }

                    // 取消居中
                    ui_center.stop_listen(me.$el);

                    // 隐藏时清空
                    if (config.empty_on_hide) {
                        me.set_content('');
                    }

                    me._visible = false;

                    me.trigger('hide', isCancel);

                    // 隐藏时销毁
                    if (config.destroy_on_hide) {
                        me.destroy();
                    }
                };

                me.$el.fadeOut(config.animate ? 'fast' : 0, function () {
                    after_hide();
                });

                if (scr_reader_mode.is_enable()) {
                    TabTie.untie();
                }
            },

            set_class: function (klass) {
                this.render_if();
                var cls = this.$el.attr('class');
                this.$el.attr('class', cls.substr(0, cls.indexOf('__') + '__'.length) + ' ' + klass);
            },

            set_title: function (title) {
                this.render_if();
                this.$el.find('.__title').text(title);
            },

            set_content: function (content) {
                var me = this;

                me.render_if();

                var $content = me.get_$body().empty();

                // 向对话框中插入内容
                if (typeof content == 'string' || (content instanceof $) || (content.tagName && content.nodeType)) {
                    $content.append(content);
                } else if (typeof content == 'function') {
                    $content.append(content());
                } else {
                    console.error('widgets.Dialog.set_content(content)', '无效的content参数：', content);
                }

                if (this._visible && scr_reader_mode.is_enable()) {
                    TabTie.focus(me.$el);
                }

                this.trigger('update_content');
            },

            set_button_enable: function (button_id, enable) {
                enable = enable !== false;
                var $btn = this.$buttons.filter('[data-btn-id="' + button_id + '"]'),
                    disabled_cls = 'disabled';
                $btn.find('.btn-inner').toggleClass(disabled_cls, !enable);
                if (enable) {
                    $btn.removeAttr('disabled');
                } else {
                    $btn.attr('disabled', 'disabled');
                }
            },

            set_button_visible: function (button_id, visible) {
                this.$buttons.filter('[data-btn-id="' + button_id + '"]').toggle(visible);
            },

            /**
             * 修改按钮文本 code by bondli
             */
            set_button_text: function (button_id, text) {
                var $btn = this.$el.find('[data-btn-id="' + button_id + '"]');
                $btn.html(text);
            },

            error_msg: function (msg) {
                var $msg = this.$msg;
                var time = 5000;
                $msg.removeClass('ui-tips-ok ui-tips-warn').addClass('ui-tips-err').text(msg).fadeIn('fast');
                clearTimeout(this.$msg.data('timer'));
                $msg.data('timer', setTimeout(function () {
                    $msg.stop(true, true).fadeOut('fast');
                }, time));
            },

            hide_msg: function () {
                clearTimeout(this.$msg.data('timer'));
                this.$msg.stop(true, true).fadeOut('fast');
            },

            destroy: function () {
                if (this.$el) {
                    this.$el.remove();
                    this.$el = null;
                    this.trigger('destroy');
                    this.off().stopListening();
                }
            },

            submit: function () {
                this.trigger('submit');
            },

            /**
             * 禁止滚动
             */
            no_doc_wheel: function (disable) {
                $('html, body').css('overflow-y', disable ? 'hidden' : '');
            },

            enable_esc: function (esc) {
                $doc.off(KEYPRESS_EVENT_NAME + '.widgets_Dialog');

                if (esc) {
                    var me = this;
                    $doc.on(KEYPRESS_EVENT_NAME + '.widgets_Dialog', function (e) {
                        if (e.which == 27) {
                            me.hide();
                        }
                    });
                }
            },

            set_height: function (h) {
                this.$el.height(h);
            },

            get_height: function () {
                return this.$el.outerHeight();
            },

            focus_button: function (btn_id) {
                this.$buttons.filter('[data-btn-id="' + btn_id + '"]').focus();
            },

            focus: function () {
                if (scr_reader_mode.is_enable()) {
                    TabTie.focus(this.get_$body());
                }
            },

            is_visible: function () {
                return !!this._visible;
            },

            get_$body: function () {
                return $('div.__content', this.$el);
            },

            get_$el: function () {
                return this.$el;
            }
        };

        $.extend(Dialog.prototype, events);

        return Dialog;
    })();

    /**
     * loading mark
     */
    exports.loading = {
        _map: {},
        show: function (modal, ns) {
            var $el = this._get_$el(),
                fix_top = this._get_fix_top(),
                h = $el.height(),
                w = $el.width(),
                client_height = window.innerHeight || document.body.clientHeight;

            $el
                .removeClass('icon-loading')
                .addClass('icon-loading')
                .css({
                    position: dam_ie6 ? 'absolute' : 'fixed',
                    left: '50%',
                    top: fix_top + (client_height - fix_top) / 2 + 'px',
                    marginLeft: -(h / 2) + 'px',
                    marginTop: -(w / 2) + 'px',
                    display: ''
                });

            modal && mask.show(ns, $el, 'transparent');
            this._map[ns] = 1;
        },

        hide: function (ns) {
            mask.hide(ns);

            if (ns) {
                delete this._map[ns];
                if ($.isEmptyObject(this._map)) {
                    this._get_$el().stop(false, true).hide();
                }
            } else {
                this._get_$el().stop(false, true).hide();
            }
        },

        _get_$el: function () {
            var $el = this._$el;
            if (!$el) {
                $el = this._$el = $('<div/>');
                $el
                    .css({
                        position: 'fixed',
                        display: 'none'
                    })
                    .appendTo(document.body);
            }
            return $el;
        },

        _get_fix_top: function () {
            var $wrapper = $('#_main_wrapper');
            if ($wrapper[0]) {
                return $wrapper.offset().top;
            } else {
                return 0;
            }
        }
    };


    /**
     * 劫持tab键必须限制在某个元素内
     * @param {jQuery} [$el]
     */
    var TabTie = exports.TabTie = {

        $el: null,
        $focus_interc: null,
        // $before_tie_active: document.activeElement,

        /**
         * 限制focus在元素内部
         * @param {jQuery} $el
         */
        tie: function ($el) {
            var me = this;
            me.$el = $el;
            // me.$before_tie_active = document.activeElement;

            me.untie();

            $(document.body).on('keydown.TabTie', function (e) {
//                if (e.which === 9) {
                setTimeout(function () {
                    me._fix_focus();
                }, 0);
//                }
            });
            // 放置一个tabindex很大的元素，用于拦截tab focus
            me.$focus_interc || (me.$focus_interc = $('<a data-for-aria tabindex="0" style="position:fixed;_position:absolute;left:0;top:-100px;" href="#">test test test</a>').appendTo(document.body));

            me._fix_focus();
        },

        /**
         * 取消限制
         */
        untie: function () {
            $(document.body).off('keydown.TabTie').focus();
            if (this.$focus_interc) {
                this.$focus_interc.remove();
                this.$focus_interc = null;
            }
        },

        /**
         * 手动聚焦一次
         * @param {jQuery} $el
         */
        focus: function ($el) {
            var $focus_to = $el.find('[tabindex=0]:visible:first');
            if (!$focus_to[0]) {
                $focus_to = $el;
                if (!$focus_to.attr('tabindex')) {
                    $focus_to.attr('tabindex', 0);
                }
            }
            $focus_to.focus();
        },

        /**
         * 按下tab键时，如果焦点不在指定元素内部，则强制tab回复到指定元素内部
         * @returns {boolean} 是否已强制更改焦点元素
         * @private
         */
        _fix_focus: function () {
            var me = this;
            var active_$el = $(document.activeElement);
            if (!active_$el[0] || active_$el[0] === document.body || active_$el.closest(me.$el).length === 0) {
                this.focus(me.$el);
                return true;
            }
            return false;
        }

    };
});