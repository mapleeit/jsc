/**
 * 树节点对应的UI相关操作
 * @author cluezhang
 * @date 2013-10-25
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),

        tmpl = require('./tmpl');
    var TreeNodeUI = inherit(Event, {
        rendered: false,
        children_rendered: false,
        // 相对于父节点容器来说的本节点选择器
        node_selector: 'div.item',
        // 相对于本节点来说的子节点容器选择器
        ct_selector: 'div.item-box',
        /**
         * @cfg {Tree_node} node
         */
        constructor: function (node, view) {
            this.node = node;
            // 隶属的Tree_view
            this.view = view;
        },
        // 获取自身在父节点中的位置
        get_index: function () {
            var node = this.node,
                parent_node = node.parent_node;
            if (node.is_root()) {
                return 0;
            }
            return $.inArray(node, parent_node.child_nodes);
        },
        /**
         * 获取节点主体对应的dom
         * @param {Number} index (optional) 当事先知道节点在同级中的索引时，可以传递
         * @return {jQueryElement} $el
         * TODO 绑定 DOM id 优化性能，遍历性能较差 - james
         */
        get_$el: function (index) {
            var $el = this.$el;
            if (!$el) {
                var node = this.node,
                    view = this.get_tree_view(), parent_node, parent_ui;
                if (node.is_root()) {
                    $el = this.$el = $(view.get_$body().find('>:first'));
                } else {
                    parent_node = node.parent_node;
                    parent_ui = view.get_node_ui(parent_node);
                    if (typeof index !== 'number') {
                        index = this.get_index();
                    }
                    $el = this.$el = $(parent_ui.get_$children().get(index));
                }
            }
            return $el;
        },
        // 获取子节点应该放置的容器dom
        get_$children_ct: function () {
            return this.get_$el().find('+' + this.ct_selector);
        },
        // 获取节点对应的所有dom节点
        get_$els: function () {
            return this.get_$el().add(this.get_$children_ct());
        },
        // 获取子节点的dom集合，如果子节点有变动，需要调用clear_children_cache清空
        get_$children: function () {
            return this.$children || (this.$children = this.get_$children_ct().find('>' + this.node_selector));
        },
        /**
         * @private
         */
        clear_children_cache: function () {
            this.$children = null;
        },
        // 释放所占用dom节点，类似于unrender
        release: function (prevent_parent_reset) {
            var view, node = this.node;
            if (this.rendered) {
                view = this.get_tree_view();
                this.get_$els().remove();
                node.cascade(function (node) {
                    var ui = view.get_node_ui(node);
                    if (!ui.rendered) {
                        return false;
                    }
                    ui.rendered = false;
                    ui.children_rendered = false;
                    ui.clear_children_cache();
                    ui.$el = null;
                });
                if (!prevent_parent_reset && !node.is_root()) {
                    view.get_node_ui(this.node.parent_node).clear_children_cache();
                }
            }
        },
        // 重新创建相关dom，只对根节点有效
        render: function () {
            if (!this.node.is_root()) {
                return;
            }
            var node = this.node;
            this.get_tree_view().get_$body().html(this.get_html());
        },
        get_tree_view: function () {
            return this.view;
        },
        /**
         * 获取节点的html，并标记有生成html的节点为rendered
         * @param {Number} level (optional) 当前节点所处的层级，模板中要用到。可以不传，会自动计算
         * @param {Boolean} mark_rendered (optional) 是否自动标记输出了html的节点为rendered及children_rendered，默认为true
         */
        get_html: function (level, mark_rendered) {
            var node = this.node, p;
            if (typeof level !== 'number') {
                level = this.get_level();
            }
            mark_rendered = mark_rendered !== false;
            if (mark_rendered) {
                this.rendered = true;
            }
            // 如果处于展开，要递归调用子节点的get_html
            var children = node.expanded ? this.get_children_htmls(level, mark_rendered) : [];
            return tmpl.tree_node({
                node: node,
                level: level,
                children: children
            });
        },
        get_level: function () {
            var node = this.node, p, level = 0;
            p = node;
            while (p.parent_node) {
                level++;
                p = p.parent_node;
            }
            return level;
        },
        /**
         * 获取子节点的html数组
         * @param {Number} level (optional) 当前节点所处的层级，模板中要用到。可以不传，会自动计算
         * @param {Boolean} mark_rendered (optional) 是否自动标记输出了html的节点为rendered及children_rendered，默认为true
         * @private
         */
        get_children_htmls: function (level, mark_rendered) {
            if (typeof level !== 'number') {
                level = this.get_level();
            }
            mark_rendered = mark_rendered !== false;
            if (mark_rendered) {
                this.children_rendered = true;
            }
            var view = this.get_tree_view();
            return $.map(this.node.child_nodes, function (child) {
                var ui = view.get_node_ui(child);
                if (mark_rendered) {
                    ui.rendered = true;
                }
                return ui.get_html(level + 1, mark_rendered);
            });
        },
        /**
         * @cfg {Object} shortcuts (optional) 属性快捷更新映射，例如selected属性映射到一个快速切换selected样式的函数上
         */
        shortcuts: {
            expanded: function () {
                var expanded = this.node.expanded;
                if (expanded) {
                    this.render_children();
                }
                this.get_$el().toggleClass('item-open', expanded);
                this.get_$children_ct().toggleClass('itembox-open', expanded);
            },
            loading: function () {
                this.get_$el().toggleClass('item-loading', this.node.loading);
            },
            // 是否空目录
            leaf: function () {
                var leaf = this.node.leaf,
                    $el = this.get_$el();
                if (!leaf) {
                    var $span = $el.find('span');
                    if (!$span.next('i')[0]) {
                        $span.after('<i data-ico="true" class="ico"></i>');
                    }
                } else {
                    $el.find('i').remove();
                }
            },
            // 选中
            selected: function () {
                this.get_$el().toggleClass('list-selected', this.node.selected);
                // this.get_$el().find('span').text((this.node.selected ? '*' : '') + this.node.name);
            },
            // 选中样式
            name: function () {
                this.get_$el().find('span').text((this.node.selected ? '*' : '') + this.node.name);
            },
            // 正在拖拽到
            dropping: function () {
                this.get_$el().find('span').text((this.node.dropping ? '>' : '') + this.node.name);
            }
        },
        // private
        insert_html: function (index, html) {
            var $children_ct = this.get_$children_ct();
            var $childs = this.get_$children();
            var size = $childs.length;
            if (index <= 0) {
                $children_ct.prepend(html);
            } else if (index >= size) {
                $children_ct.append(html);
            } else {
                $childs.eq(index).before(html);
            }
            this.clear_children_cache();
        },
        // 子节点添加，按索引插入到指定位置
        on_add: function (child, index) {
            var node = this.node;
            if (!this.rendered || !this.children_rendered) {
                return;
            }
            var view = this.get_tree_view();
            var child_ui = view.get_node_ui(child);
            this.insert_html(index, child_ui.get_html());
        },
        // 有子节点移除，删除dom
        on_remove: function (child, index) {
            if (!this.rendered || !this.children_rendered) {
                return;
            }
            var view = this.get_tree_view();
            var child_ui = view.get_node_ui(child);
            child_ui.get_$el(index); // 让子节点找到自己对应的dom，并缓存
            child_ui.release();
        },
        // 局部更新dom信息，包含expanded、loading、leaf、selected、name
        on_update: function (changes) {
            if (!this.rendered) {
                return;
            }
            var property_name, shortcuts = this.shortcuts;
            for (property_name in changes) {
                if (changes.hasOwnProperty(property_name) && shortcuts.hasOwnProperty(property_name)) {
                    shortcuts[property_name].call(this);
                }
            }
        },
        // 完整更新子节点们
        on_datachanged: function (old_child_nodes) {
            if (!this.rendered) {
                return;
            }
            var view = this.get_tree_view();
            // clear
            this.get_$children_ct.html(this.get_children_htmls());
            $.each(old_child_nodes, function (index, node) {
                view.get_node_ui(node).release(true);
            });
            this.clear_children_cache();
        },
        render_children: function () {
            if (!this.rendered) {
                return;
            }
            if (this.children_rendered) {
                return;
            }
            return this.get_$children_ct().html(this.get_children_htmls());
        }
    });
    var ss = 1;
    return TreeNodeUI;
});