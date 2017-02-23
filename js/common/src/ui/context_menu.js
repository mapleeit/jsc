/**
 * 右键菜单
 * @author jameszuo
 * @date 13-2-20
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        console = lib.get('./console'),
        template = lib.get('./template'),
        collections = lib.get('./collections'),
        Events = lib.get('./events'),

        tmpl = require('./tmpl'),
        global_event = require('./global.global_event'),
        constants = require('./constants'),
        $win = $(window),

        DEFAULT_CONTEXTMENU_CONFIG = {
            items: [/*Item*/],
            hide_on_click: true // 点击后隐藏
        },
        DEFAULT_ITEM_CONFIG = {
            id: '',
            icon_class: '',
            text: '',
            after_render: $.noop // 渲染完成事件
        },

        seq = 0,

        fix_header_height = 0, // 头部的高度

        ctxt_menu_instances = [],

        undefined;

    global_event.on('page_header_height_resize', function (new_height) {
        fix_header_height = new_height;
    });


    // --- 构造函数 ------------------------------------
    var ContextMenu = function (config) {
        var me = this;

        me.config = $.extend({}, DEFAULT_CONTEXTMENU_CONFIG, config);

        me._all_items = $.map(me.config.items, function (item) {
            if(item === '-') {
                item = new Item({
                    type: 'split'
                });
            } else if(!Item.is_instance(item)) {
                item = new Item(item);
            }
            item.set_menu(me);
            return item;
        });

        me._seq = ++seq;

        ctxt_menu_instances.push(me);
    };

    ContextMenu.prototype = {
        _seq: null,
        _all_items: null,
        _par_item: null,
        _visible: false,

        /**
         * 渲染菜单
         * @param {Object} item_id_map 如果未指定，则渲染所有菜单选项
         * @param {Boolean} arrow 是否显示箭头
         * @param {jQuery|HTML} $on 对应的DOM元素
         * @param {jQuery|HTMLElement} [$to] 菜单将会追加在这个元素中
         */
        render: function (item_id_map, arrow, $on, $to) {
            var me = this;

            me.hide();

            me.trigger('before_render', $on);

            // 要渲染的菜单选项
            var render_items;
            if (item_id_map) {
                render_items = $.grep(me._all_items, function (item) {
                    return item.config.id in item_id_map;
                });
            } else {
                render_items = me._all_items;
            }

            // 是否包含图片
            var has_icons = collections.any(render_items, function (item) {
                return !!item.config.icon_class;
            });

            // DOM
            $to = $($to);
            var $context_menu;
            if((constants.IS_OLD || constants.IS_APPBOX)) {
                $context_menu = $(tmpl.context_menu({ items: render_items, arrow: arrow, has_icons: has_icons, width: this.config.width }));
            } else {
                $context_menu = $(tmpl.context_menu_v2({ items: render_items, arrow: arrow, has_icons: has_icons, width: this.config.width }));
            }
            me.$el = $context_menu.hide().appendTo($to.length ? $to : document.body);

            $.each(render_items, function (i, item) {
                item.trigger('render', item_id_map, $to);
            });


            // 事件
            me.$el.on('click.comm_ctxt_menu', '[data-action=item]', function (e) {
                var link = $(this).find('a');
                if (link.is('a[href^=#],a[href^="javascript:"]')) { // 如果是 href=# 或 href=javascript:void(0); 则阻止默认事件
                    e.preventDefault();
                }

                var item = me._rendered_item_map[$(this).attr('data-item-id')];

                if (item && !item.get_sub_menu()) { // 有子菜单的不允许点击

                    item.trigger('click', e);

                    me.trigger('item_click', item, e);

                    // 隐藏
                    if (me.config.hide_on_click !== false) {
                        var par_item = me._par_item, par_menu;
                        while (par_item && (par_menu = par_item.get_menu())) {
                            par_item = par_menu._par_item;
                        }
                        if (par_menu) {
                            par_menu.hide();
                        } else {
                            me.hide();
                        }
                    }
                }
            });

            // hover
            (function () {
                me.$el
                    .on('mouseenter', function () {
                        if (me._par_item) {
                            me._par_item.set_hover_timer();
                        }
                        me.trigger('mouseenter');
                    })
                    .on('mouseleave', function () {
                        if (me._par_item) {
                            me._par_item.set_hover_timer(function () {
                                me._par_item.trigger('mouseleave');
                            }, 500);
                        }
                        me.trigger('mouseleave');
                    })
                    .on('mouseenter', '[data-action="item"]', function (e) {
                        var $item_el = $(this),
                            item = me._rendered_item_map[$item_el.attr('data-item-id')];

                        if (item.get_sub_menu()) {
                            var $trg_el = $item_el.find('a'),
                                ofs = $trg_el.offset();

                            item.set_hover_timer();

                            item.trigger('mouseenter', ofs.left + $trg_el.width() + 3, ofs.top, item_id_map);
                        }
                    })
                    .on('mouseleave', '[data-action="item"]', function (e) {
                        var $item_el = $(this),
                            item = me._rendered_item_map[$item_el.attr('data-item-id')];

                        if (item.get_sub_menu()) {
                            item.set_hover_timer(function () {
                                item.trigger('mouseleave');
                            }, 500);
                        }
                    });
            })();


            // after render
            $.each(render_items, function (i, item) {
                item.trigger('after_render', $('>ul>li[data-action=item]:eq(' + i + ')', me.$el));
            });


            me._rendered_items = render_items;
            me._rendered_item_map = collections.array_to_set(render_items, function (item) {
                return item.config.id;
            });

            return me.$el;
        },

        /**
         * 显示菜单
         * @param {Number} x
         * @param {Number} y
         * @param {Object} item_id_map 如果未指定，则渲染所有菜单选项
         * @param {jQuery|HTMLElement} $on
         */
        show: function (x, y, item_id_map, $on) {

            this.render(item_id_map, false, $on);

            var xy = this._fix_xy(x, y);

            this._show(xy, false);

            this.trigger('show_on', $on);

            if ($.isArray(this._rendered_items)) {
                $.each(this._rendered_items, function (i, item) {
                    item.trigger('show', xy.x, xy.y, item_id_map);
                });
            }
        },

        /**
         * 在指定元素上显示菜单
         * @param {jQuery|HTMLElement} $on
         * @param {jQuery|HTMLElement} $offs_par
         * @param {Array<String>} item_ids 如果未指定，则渲染所有菜单
         * @param {Number} fix_left left值加上该值
         * @param {Number} fix_top 菜单在元素上方时，top值加上该值
         * @param {Number} fix_bottom 菜单在元素下方时，bottom值加上该值
         * @param {Boolean} arrow 是否显示箭头，默认true
         */
        show_on: function ($on, $offs_par, item_ids, fix_left, fix_top, fix_bottom, arrow) {
            $on = this.$on = $($on);

            var
                on_offs = $on.offset(),
                par_offs = $offs_par.offset(),
                x = on_offs.left + $on.width() / 2,
                y = on_offs.top + $on.height() / 2;

            arrow = arrow !== false;

            this.render(item_ids, arrow, $on, $offs_par);

            var xy = this._fix_xy(x, y);
            if (xy.at_top) {
                xy.y += fix_top;
            } else if (xy.at_bottom) {
                xy.y += fix_bottom;
            }

            // 向左偏移
            xy.x -= fix_left;


            // 相对offsetParent定位
            xy.x -= par_offs.left;
            xy.y -= par_offs.top;


            this._show(xy, arrow);

            this.trigger('show_on', $on);
        },

        _show: function (xy, arrow) {
            var me = this,
                $el = me.$el;

            var css = {
                left: xy.x + 'px',
                top: xy.y + 'px',
                zIndex: 10,//$el.css('zIndex') + 1,
                display: ''
            };

            $el.css(css);

            if (arrow) {
                // 箭头
                $el.toggleClass('ui-popmenu-bottom', xy.at_top);
            }

            me.trigger('show');

            me._visible = true;

            listen_blur();
        },

        /**
         * 隐藏
         */
        hide: function () {
            var me = this;
            if (me.$el) {
                me.$el.remove();
            }
            me.$on = null;

            if (me._visible === false) {
                return;
            }

            var items = me._rendered_items;
            if (items && items.length) {
                $.each(items, function (i, item) {
                    item.trigger('hide');
                });
            }

            me._rendered_items = null;

            me.trigger('hide');

            me._visible = false;

            listen_blur();
        },

        /**
         * 确保菜单不会超出浏览器边界
         * @param x
         * @param y
         * @private
         * @return {Object} { x:Number, y:Number, at_LOCATION:Boolean }
         */
        _fix_xy: function (x, y) {
            var $el = this.$el,
                el_width = $el.outerWidth(),
                el_height = $el.outerHeight(),

            // 判断浏览器边界
                win_width = $win.width(),
                win_height = $win.height(),

                x_scroll = $win.scrollLeft(),
                y_scroll = $win.scrollTop(),

                fix_padding = 5,
                x_limit = win_width + x_scroll - fix_padding,
                y_limit = win_height + y_scroll - fix_padding,

                at_bottom = true,
                at_right = true;

            // 超出右边界
            if (x + el_width > x_limit) {
                //超出右边界多少就左移多少
                x -= (x + el_width - x_limit);
//                x -= el_width;
                at_right = false;
            }
            // 超出下边界
            if (y + el_height > y_limit) {
                y -= el_height;
                at_bottom = false;
            }
            return {
                x: x,
                y: y,
                at_top: !at_bottom,
                at_bottom: at_bottom,
                at_left: !at_right,
                at_right: at_right
            };
        }
    };

    $.extend(ContextMenu.prototype, Events);


    // --- 菜单选项 ------------------------------------
    var Item = function (_config) {
        var me = this,
            config = me.config = $.extend({}, DEFAULT_ITEM_CONFIG, _config);

        // 子菜单
        if ($.isArray(config.items)) {
            var sub_menu = new ContextMenu({
                items: config.items
            });
            me.set_sub_menu(sub_menu);

            me
                .once('after_render', function (item_id_map, $to) {
                    sub_menu.render(item_id_map, false, $to);
                })
                .on('hide', function () {
                    sub_menu.hide();
                })
                .on('mouseenter', function (x, y, item_id_map, $on) {
                    sub_menu.show(x, y, item_id_map, $on);
                })
                .on('mouseleave', function () {
                    sub_menu.hide();
                });
        }

        if ($.isFunction(config.click)) {
            me.on('click', function (e) {
                config.click.call(me, e);
            });
        }

        if ($.isFunction(config.after_render)) {
            me.on('after_render', function () {
                config.after_render.apply(me, $.makeArray(arguments));
            })
        }
    };

    Item.is_instance = function (obj) {
        return !!obj && obj.__is_context_item === true;
    };

    $.extend(Item.prototype, Events, {
        __is_context_item: true,
        _sub_menu: null,
        _hover_timer: null,

        /**
         * 子菜单
         * @param {ContextMenu} menu
         */
        set_sub_menu: function (menu) {
            this._sub_menu = menu;
            menu._par_item = this;
        },

        get_sub_menu: function () {
            return this._sub_menu;
        },

        set_menu: function (menu) {
            this._menu = menu;
        },

        get_menu: function () {
            return this._menu;
        },

        get_hover_timer: function () {
            return this._hover_timer;
        },

        set_hover_timer: function (fn, delay) {
            clearTimeout(this._hover_timer);

            if (fn) {
                this._hover_timer = setTimeout(fn, delay);
            }
        }
    });

    ContextMenu.Item = Item;


    var $body;
    // 点击菜单外部时，隐藏所有菜单实例
    var listen_blur = function () {
        $body = $body || ($body = $(document.body));

        var has_visible = collections.any(ctxt_menu_instances, function (inst) {
            return inst._visible;
        });

        $body.off('mousedown.comm_ctxt_menu');

        if (has_visible) {
            setTimeout(function () {
                $body.on('mousedown.comm_ctxt_menu', function (e) {
                    // 如果点击了菜单外部
                    var in_menu = $(e.target).closest('[data-comm-ctxtmenu]').length;
                    if (!in_menu) {
                        for (var i = 0, l = ctxt_menu_instances.length; i < l; i++) {
                            ctxt_menu_instances[i].hide();
                        }
                        $body.off('mousedown.comm_ctxt_menu');
                    }
                });
            }, 0);
        }
    };

    return ContextMenu;
});