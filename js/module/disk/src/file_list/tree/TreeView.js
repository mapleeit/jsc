/**
 * 类似于Grid - GridView？存放常用的视图操作接口
 * @author cluezhang
 * @date 2013-10-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        collections = lib.get('./collections'),
        easing = lib.get('./ui.easing'),
        user_log = common.get('./user_log'),
        $ = require('$'),

        TreeNodeUI = require('./file_list.tree.TreeNodeUI'),

        MSG_ALREADY_IN = '文件已经在该文件夹下了',
        MSG_NO_DEEP = '不能将文件移动到自身或其子文件夹下',

        undefined;

    var View = inherit(Event, {
        expander_selector: 'i',
        constructor: function (cfg) {
            $.extend(this, cfg);
            var init_tree = this.tree;
            if (init_tree) {
                this.tree = null;
                this.bind_tree(init_tree);
                this.visible = true;
            }
            this.init_events();
        },
        init_events: function () {
            var me = this,
                $el = me.get_$body();
            $el.on('click', function (e) {
                e.preventDefault();
                me.process_event('click', e);
            });
            $el.on('contextmenu', function (e) {
                e.preventDefault();
                me.process_event('contextmenu', e);
            });
            this.on('nodeclick', this.handle_click, this);
        },
        get_$body: function () {
            return this.$el;
        },
        bind_tree: function (new_tree) {
            var me = this,
                old_tree = me.tree,
                tree_events = {
                    add: me.on_add,
                    update: me.on_update,
                    remove: me.on_remove,
                    // expand: me.on_expand,
                    // collapse: me.on_collapse,
                    datachanged: me.on_datachanged//,
//                    resync_path: me.on_resync_path
                };
            $.each(tree_events, function (ev_name, fn) {
                old_tree && me.stopListening(old_tree, ev_name, fn);
                me.listenTo(new_tree, ev_name, fn);
            });
            me.tree = new_tree;
        },
        process_event: function (name, e) {
            this.trigger(name, e);
            var node = this.get_node(e.target);
            if (!node) {
                return;
            }
            this.trigger('node' + name, node, e);
        },
        handle_click: function (node, e) {
            e.preventDefault();
            if ($(e.target).is(this.expander_selector)) {
                node.toggle();
                user_log('DBVIEWTREE_ITEM_DELTA_CLICK');
                // 点击expander之后不触发click事件
                return false;
            }
            this.select(node);
            user_log('DBVIEWTREE_ITEM_CLICK');
        },
        /**
         * 确保在视野内
         * @param {TreeNode} node
         */
        ensure_visible: function (node) {
            var me = this;

            var $dom = me.get_node_ui(node).get_$el(),
                $list, scroll_top, offset_top, scroll_height, height, element_height;
            if ($dom[0]) {
                offset_top = $dom[0].offsetTop; // 要定位的记录所处的高度
                $list = me.get_$body();
                scroll_height = $list[0].scrollHeight; // 列表内容总高度
                scroll_top = $list[0].scrollTop; // 当前列表的滚动条高度
                height = $list.innerHeight(); // 列表高度
                element_height = $dom.height(); // 每条记录的高度
                // 如果不在最佳可视范围内，移动到使它显示在第3个位置
                if(offset_top > scroll_top + height - 1*element_height || offset_top < scroll_top + 2*element_height){
                    $list.scrollTop(offset_top - 3*element_height);
                }
            }
        },
        select: function (node, silent) {
            var old_node = this.selected_node;
            if (old_node) {
                old_node.set_selected(false);
            }
            if (node) {
                node.set_selected(true);
                if (!silent) {
                    this.trigger('node_selected', node);
                }
            }
            this.selected_node = node;
        },
        // 选中但是不触发事件（不加载网盘列表）
        select_silent: function (node) {
            this.select(node, true);
        },
        get_node: function (dom) {
            var $node_dom = $(dom).closest(TreeNodeUI.prototype.node_selector, this.get_$body());
            if (!$node_dom.length) {
                return null;
            }
            var id = $node_dom.attr('data-node-id');
            return this.tree.get_node_by_id(id);
        },
        get_node_ui: function (node) {
            var ui = node.ui;
            if (!ui) {
                ui = node.ui = new TreeNodeUI(node, this);
            }
            return ui;
        },
        hide: function () {
            var me = this;
            me.get_node_ui(this.tree.root).release();
            me.tree.root.clear_children();
            me.visible = false;
        },
        show: function () {
            var me = this;
            me.get_node_ui(me.tree.root).render();
            me.visible = true;
        },
        is_visible: function () {
            return !!this.visible;
        },
        on_add: function (parent, child, index) {
            // 添加节点
            this.get_node_ui(parent).on_add(child, index);
        },
        on_remove: function (parent, child, index) {
            // 删除节点
            this.get_node_ui(parent).on_remove(child, index);
        },
        on_update: function (node, changes) {
            // 更新节点信息
            this.get_node_ui(node).on_update(changes);
        },
        on_datachanged: function (node, old_child_nodes) {
            // 重置并渲染所有子节点
            this.get_node_ui(node).on_datachanged(old_child_nodes);
        },
//        on_resync_path: function (last_level_node) {
//            if (last_level_node) {
//                this.ensure_visible(last_level_node);
//            }
//        },
        /**
         * 启用丢放
         */
        refresh_drop: function (files) {
            var tree_view = this,
                file_list = require('./file_list.file_list');

            require.async('jquery_ui', function () {

                // 逐层刷新
                tree_view.tree.root.cascade(function (node) {
                    var node_ui = tree_view.get_node_ui(node),
                        $el = node_ui.get_$el();

                    if ($el.data('droppable'))
                        $el.droppable('destroy');

                    $el.droppable({
                        scope: 'move_file',
                        tolerance: 'pointer',
//                        accept: function () {
//                            console.log(new Date().getTime(), arguments);
//                            return false;
//                        },
                        hoverClass: 'list-dropping',
                        over: function (e, ui) {
                            var $el = $(this),
                                node_id = $el.attr('data-node-id'),
                                node = tree_view.tree.get_node_by_id(node_id),
                                check = check_droppable(node, files);

                            if (!node || check) {
                                $(this).removeClass('list-dropping');
                            }
                        },
                        drop: function (e, ui) {
                            var $el = $(this),
                                node_id = $el.attr('data-node-id'),
                                node = tree_view.tree.get_node_by_id(node_id);

                            if (!node)
                                return false;

                            // path_nodes = 要丢放到的目标目录的路径
                            // files = 正在拖拽的目录
                            // 如果 path_nodes 和 files 的已知子节点有任何交集，则不允许丢放
                            var err;
                            if (err = check_droppable(node, files)) {
                                tree_view.trigger('drop_files_error', err);
                                return false;
                            }

                            // 移动文件
                            tree_view.trigger('drop_files', node, files);
                            user_log('DBVIEWTREE_ITEM_DROP');
                        }
                    });
                });

            });

            var check_droppable = function (node, files) {
                var cur_node = file_list.get_cur_node();

                // 如果目标目录是虚拟目录，则不允许
                if (node.is_vir_dir())
                    return '不能移动到' + node.get_name() + '中';

                // 如果目标目录是文件所在目录，则提示
                if (cur_node.get_id() === node.get_id())
                    return MSG_ALREADY_IN;

                // 如果文件列表中选中的文件和要移动到的目录ID路径有交集，即表示将移动文件到自身或自身子目录下面，这是不允许的操作
                var file_id_map = collections.array_to_set(files, function (file) {
                        return file.get_id();
                    }),
                    deep = collections.any(node.get_path_nodes(), function (node) {
                        return node.get_id() in file_id_map;
                    });
                if (deep) {
                    return MSG_NO_DEEP;
                }
            };
        }
    });
    return View;
});