/**
 * 树节点
 * @author cluezhang
 * @date 2013-10-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('disk/TreeNode'),
        $ = require('$');

    var slice = Array.prototype.slice;
    var id_seed = 1000;


    var Tree_node = inherit(Object, {
        // attributes
        id: null,
        name: null,
        is_vir: false,
        loaded: false,
        loading: false,
        selected: false,
        expanded: false,

        // ...
        parent_node: null,
        load_def: null,

        /**
         * 构造函数
         * @param {String} cfg.id
         * @param {String} cfg.name
         * @param {Boolean} cfg.expand
         * @param {Boolean} cfg.leaf
         */
        constructor: function (cfg) {
            var me = this;

            me.child_nodes = [];
            $.extend(me, cfg);
            if (!me.id) {
                me.id = 'node-' + (++id_seed);
            }
            // 初始添加
            var children = me.children;
            if (children) {
                delete me.children;
                $.each(children, function (i, child) {
                    me.insert_child(child);
                });
            }
        },
        get_id: function () {
            return this.id;
        },
        get_name: function () {
            return this.name;
        },
        is_vir_dir: function () {
            return this.is_vir;
        },
        get_file: function () {
            return this.file;
        },
        is_root: function () {
            return this.tree && this.tree.root === this;
        },
        /**
         * 依赖于树的事件模型
         */
        trigger: function () {
            // 有可能当前节点还没有在tree上注册，所以最保险的就是找根节点，从而找到所属树
            var p = this;
            while (p.parent_node) {
                p = p.parent_node;
            }
            var args = [this],
                tree = p.tree;
            if (tree) {
                tree.node_trigger.apply(tree, args.concat(slice.call(arguments, 0)));
            }
        },
        create_node: function (data) {
            return new this.constructor(data);
        },
        add_child: function (nodes, index, prevent_event) {
            var me = this, child_nodes = me.child_nodes;
            if (typeof index !== 'number') {
                index = child_nodes.length; // 需要按照文件名排序，所以注释掉 - james
            }
            nodes = [].concat(nodes);
            $.each(nodes, function (n, node) {
                // 保证都是Tree_node对象
                if (!(node instanceof Tree_node)) {
                    node = me.create_node(node);
                }
                // 如果有旧的父节点，先移除之
                var old_parent = node.parent_node;
                if (old_parent) {
                    old_parent.remove_child(node);
                }
                // 如果已经在树上了，则替换之
                var exists_node = me.tree.get_node_by_id(node.id);
                if (exists_node) {
                    index = exists_node.index();
                    exists_node.remove();
                }

                // 添加
                node.parent_node = me;
                if (index >= child_nodes.length) { // 不知道当为最后一个元素时，splice会不会有优化。保险起见还是用push
                    child_nodes.push(node);
                } else {
                    child_nodes.splice(index, 0, node);
                }
                if (!prevent_event) {
                    me.trigger('add', node, index);
                }
                // 顺序添加，下一个节点的索引+1
                index++;
            });

            // 如果有节点，表示已经加载
            if (!this.loaded) {
                this.loaded = true;
                if (!prevent_event) {
                    this.trigger('update', {loaded: true});
                }
            }

            this.leaf = false;
            this.trigger('update', {leaf: true});
        },

        // 插入一个节点，自动排序
        insert_child: function (node) {
            var me = this,
                nodes = me.child_nodes,
                name = node.get_name(),
                index;

            // 通过文件名进行计算插入位置
            for (var i = 0, l = nodes.length; i < l - 1; i++) {
                var name_1 = nodes[i].get_name(),
                    name_2 = nodes[i + 1].get_name().toString(),
                    between = name_1.toString() < name.toString() && name.toString() < name_2.toString();
                if (between) {
                    index = i + 1;
                    break;
                }
            }
            return this.add_child(node, index);
        },
        remove_child: function (node, prevent_event) {
            var me = this, child_nodes = me.child_nodes;
            var index = $.inArray(node, child_nodes);
            if (index < 0) {
                return;
            }
            child_nodes.splice(index, 1);
            if (!prevent_event) {
                this.trigger('remove', node, index);
            }
            node.parent_node = null;
        },

        /**
         * 清除所有子节点
         */
        clear_children: function () {
            var old_child_nodes = this.child_nodes;
            this.child_nodes = [];
            this.trigger('datachanged', old_child_nodes);
        },

        /**
         * 获取路径
         * @returns {Array}
         */
        get_path_nodes: function () {
            var path_nodes = [];
            if (this === this.tree.root)
                return path_nodes;

            this.recursion(false, function (node) {
                path_nodes.push(node);
            });

            path_nodes.reverse();
//            console.log('recursion', $.map(path_nodes, function (r) {
//                return r.name;
//            }));

            return path_nodes;
        },

        /**
         * 递归获取节点
         * @param {Boolean} with_root 是否排除根节点，默认false
         * @param {Function} procc
         * @param {Object} scope scope of procc
         * @returns {Array}
         */
        recursion: function (with_root, procc, scope) {
            with_root = typeof with_root === 'boolean' ? with_root : false;
            scope = scope || this;

            var p = this;

            procc.call(scope, p);

            while (p = p.parent_node) {
                // 排除root
                if (!with_root && p === this.tree.root) {
                    break;
                }

                procc.call(scope, p);
            }
        },

        cascade: function (fn, scope, args) {
            var childs, i, len;
            if (fn.apply(scope || this, args || [this]) !== false) {
                childs = this.child_nodes;
                for (i = 0, len = childs.length; i < len; i++) {
                    childs[i].cascade(fn, scope, args);
                }
            }
        },
        is_expanded: function () {
            return this.expanded;
        },
        expand: function () {
            var me = this;
            if (me.expanded || me.leaf) {
                return;
            }

            me.expanded = true;

            if (!me.dirty && me.loaded) {
                me.trigger('update', {expanded: true});
            } else {
                me.load()
                    .done(function () {
                        me.trigger('update', {expanded: true});
                    })
                    .fail(function () {
                        me.expanded = false;
                        me.trigger('update', {expanded: true});
                    });
            }
        },
        collapse: function () {
            this.expanded = false;
            this.trigger('update', {expanded: true});
        },
        toggle: function () {
            this.expanded ? this.collapse() : this.expand();
        },
        set_name: function (name) {
            this.name = name;
            this.trigger('update', {name: true});
        },
        set_selected: function (selected) {
            this.selected = selected;
            this.trigger('update', {selected: true});

            if (selected) {
                this.expand();
            }
        },
        set_dirty: function (dirty) {
            this.dirty = dirty;
            this.trigger('update', {dirty: true});
        },
        remove: function () {
            if (this.parent_node) {
                this.parent_node.remove_child(this);
            }
        },
        load: function () {
            var me = this;
            me.loading = true;
            me.trigger('update', {loading: true});
            me.load_def = me.tree.loader.load(me)
                .done(function (child_nodes) {
                    me.add_child(child_nodes);
                })
                .always(function () {
                    me.loading = false;
                    me.trigger('update', {loading: true});
                });
            return me.load_def;
        },
        if_load: function () {
            return this.load_def || $.Deferred().reject();
        },
        index: function () {
            return this.parent_node ? $.inArray(this, this.parent_node.child_nodes) : -1;
        }
    });
    return Tree_node;
});