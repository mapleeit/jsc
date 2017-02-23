/**
 * 双屏目录树实现
 * @author cluezhang
 * @date 2013-10-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('disk/Tree'),

        TreeNode = require('./file_list.tree.TreeNode'),
        TreeLoader = require('./file_list.tree.TreeLoader'),

        file_list = require('./file_list.file_list'),

        slice = Array.prototype.slice,


        undefined;

    var Tree = inherit(Event, {
        /**
         * 要处理的事情：
         * 1. 拖动、拖放
         * 2. 点击访问、展开、收缩、右键
         * 3. 新建目录时同步
         * 4. 删除时同步
         * 4.2 移动时同步
         * 5. load_path定位时同步
         * 6. 隐藏时，不应有任何dom开销（数据层面上的同步可以继续，但dom上的开销交由Tree统一处理吧）
         * 7. 选中状态，与当前目录同步。
         */
        constructor: function (cfg) {
            $.extend(this, cfg);
            this.map = {};
            this.root && this.register(this.root);
            this.loader = new TreeLoader();
            this.init_events();
        },

        init_events: function () {
            this.on('add', this.on_add, this);
            this.on('remove', this.on_remove, this);
            this.on('datachanged', this.on_datachanged, this);
        },
        on_add: function (parent, child, index) {
            this.register(child);
        },

        on_remove: function (parent, child, index) {
            this.unregister(child);
        },

        on_datachanged: function (node, old_child_nodes) {
            var me = this;
            $.each(old_child_nodes, function (index, node) {
                me.unregister(node);
            });
            $.each(node.child_nodes, function (index, node) {
                me.register(node);
            });
        },

        get_node_by_id: function (id) {
            return this.map[id];
        },

        node_trigger: function (node, event_name) {
            var args = slice.call(arguments, 0);
            this.trigger.apply(this, [event_name, node].concat(args.slice(2)));
        },
        register: function (node) {
            var tree = this,
                old_tree = node.tree;
            if (old_tree && old_tree.unregister) {
                old_tree.unregister(node);
            }
            node.cascade(function (node) {
                node.tree = tree;
                tree.map[node.id] = node;
            });
        },
        unregister: function (node) {
            var tree = this;
            node.cascade(function (node) {
                delete tree.map[node.id];
                node.tree = null;
            });
        },

        /**
         * 加载指定路径的目录
         * @param {String[]} [path_ids] 为空表示加载根目录，长度为1表示加载单目录
         * @returns {$.Deferred} 回调会带上参数 last_level_node
         */
        _resync_path: function (path_ids) {
            var me = this;

            // 读取多级目录
            return me.loader.load_path(path_ids)
                .done(function (nodes_map) {

                    var p_node = me.root,
                        last_level_node = p_node; // 最深一级的目录

                    // 因为路径总是从根节点开始，这里绕过根节点，从下标 1 开始处理
                    for (var path_i = 0, l = path_ids.length; path_i < l; path_i++) {
                        var dir_id = path_ids[path_i],
                            nodes = nodes_map[dir_id] || [],
                        // 下一级需要同步到的节点ID;
                            path_kid_id = path_ids[path_i + 1];

                        // 插入子节点
                        $.each(nodes, function (j, kid) {
//                            console.log('插入子节点' + kid.name + '到' + p_node.name + '中');
                            var id = kid['id'],
                                leaf = kid['leaf'],
                                name = kid['name'];

//                            console.debug(' - ' + name + '.leaf=' + leaf);
                            p_node.add_child({
                                id: id,
                                name: name,
                                leaf: leaf,
                                expanded: !leaf && path_kid_id && id === path_kid_id
                            });
                        });

                        // 插入子节点后，设置父节点为脏
//                        console.log('设置' + p_node.name + '为脏');
                        p_node.set_dirty(true);

                        // 下一级
                        p_node = me.get_node_by_id(path_kid_id);
                        if (p_node) {
                            last_level_node = p_node;
//                            console.log('父节点变更为' + p_node.name);
                        } else {
                            // CGI返回的数据不完整，无法继续处理
                            break;
                        }
                    }

                    me.trigger('resync_path', last_level_node);
                });
        },

        /**
         * 从服务端读取
         * @param {String[]} path_ids
         */
        update: function (path_ids) {

            // 读取根目录
            if (!path_ids || !path_ids.length) {
//                console.log('2 load root');
                return this.root.load();
            }

            // 读取单目录
            if (path_ids.length === 1) {
                var node = this.get_node_by_id(path_ids[0]);
//                console.log('3 load node');
                return node && node.load();
            }

            // 同步多级目录
//            console.log('4 resync path');
            return this._resync_path(path_ids);
        }
    });
    return Tree;
});