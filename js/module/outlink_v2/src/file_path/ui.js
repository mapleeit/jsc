/**
 *
 * @author hibincheng
 * @date 15-05-31
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        global_event = common.get('./global.global_event'),
        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        file_path,
        store,

        cur_node,
        visible,

        init_updated = false,

        undefined;

    var ui = new Module('disk_file_path_ui', {

        render: function ($to) {
            file_path = require('./file_path.file_path');
            store = require('./store');

            // 事件
            var $el = $('#outlink_path');
            this._$el = $el;
            this._$inner = $el.find('[data-inner]');

            var me = this;
            // 点击路径跳转
            $el.on('click', function (e) {
                e.preventDefault();
            });
            $el.on('click', '[data-more]', function(e) {
                me._toggle_path_menu();
                e.stopPropagation();
            });
            $el.on('click', '[data-file-id]', function (e) {
                e.preventDefault();
                var $target = $(this),
                    dir_id = $target.attr('data-file-id');

                me.trigger('click_path', dir_id, e);

            });

        },

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (last_lv_node, nodes, enable) {
            var me = this,
                $inner = me._$inner;
            var $paths = me.measure_path(last_lv_node, nodes, enable);
            $inner.empty().append($paths);
            cur_node = last_lv_node;

            me._fix_some();
        },

        /**
         * 测量路径，当路径过深时，前面部分收起做为下拉菜单展示
         * @param last_lv_node
         * @param nodes
         * @param enable
         * @returns {*|jQuery|HTMLElement}
         */
        measure_path: function(last_lv_node, nodes, enable) {
            var $inner = this._$inner,
                $paths = $(tmpl['file_path_items']({ target_node: last_lv_node, nodes: nodes, enable: !!enable })),
                limit_width;
            if(scr_reader_mode.is_enable() || !cur_node) { //读屏模式全部路径显示 或第一次渲染（只能一层目录，cur_node没有保存则认为是第一次渲染）
               return $paths;
            }
            $inner.empty().append($paths);
            limit_width = this.get_$path_warp().width();
            var children = Array.prototype.slice.call($inner.children('a'));
            var cul_width = 0;
            while(children.length) {
                var node = children.pop();
                cul_width += $(node).outerWidth() - 15; //每个节点margin-left:-15px，所以相邻间重叠15px
                if(cul_width + 22 + 35 + 10 > limit_width) { //下拉菜单图标宽22px checkbox35px宽，留个10px空白
                    children.push(node);
                    break;
                }
            }

            var menu_nodes = nodes.slice(0, children.length);
            var nodes = nodes.slice(children.length);

            $paths = $(tmpl['file_path_items']({ target_node: last_lv_node, nodes: nodes, enable: !!enable, has_more: !!menu_nodes.length}));

            if(menu_nodes.length) {
                this._render_path_menu(menu_nodes, enable);
            } else {
                this._remove_path_menu();
            }
            return $paths;

        },

        _render_path_menu: function(menu_nodes, enable) {
            this._remove_path_menu();

            this._$path_menu = $(tmpl['path_menu']({nodes:menu_nodes, enable: enable}));
            this._$path_menu.appendTo(this.get_$path_warp());

            var me = this;
            $(document.body).on('click.file_path_menu', function(e) {
                var $target = $(e.target);
                if(!$target.closest(me._$path_menu).length) {
                    me._toggle_path_menu(false);
                }
            });
        },

        _remove_path_menu: function() {
            if(this._$path_menu) {
                this._$path_menu.remove();
                this._$path_menu = null;
                $(document.body).off('click.file_path_menu');
            }
        },

        _toggle_path_menu: function(visible) {
            if(arguments.length) {
                this._$path_menu.toggle(!!visible);
            } else {
                this._$path_menu.toggle();
            }
        },

        toggle: function (v) {
            visible = v;
            if (!visible)
                this._release_dom();
        },

        _release_dom: function () {
            var me = this;
            if (me._$inner) {
                me._$inner.empty();
            }
        },

        _fix_some: function () {
            if (this._fixed_some) return;

            var $el = this._$el,
                b = $.browser;

            // IE6 hover伪类hack
            if (b.msie && b.version < 7) {
                $el
                    .on('mouseenter', 'td', function () {
                        $(this).addClass('hover');
                    })
                    .on('mouseleave', 'td', function () {
                        $(this).removeClass('hover');
                    });
            }
            // IE、Opera active伪类hack
            var active_el;
            if (b.msie || b.opera) {
                var $body = $(document.body);
                $el.on('mousedown', 'td', function () {
                    active_el = $(this);
                    active_el.addClass('active');
                    $body.one('mouseup', function () {
                        if (active_el) {
                            active_el.removeClass('active');
                            active_el = null;
                        }
                    });
                });
            }

            this._fixed_some = 1;
        },

        toggle_$path: function(visible) {
            this._$inner && this._$inner[visible ? 'show': 'hide']();
        },

        get_$path_warp: function() {
            return this._$el.children(':first');
        }

    });

    return ui;

});