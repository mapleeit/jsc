/**
 * 文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-4
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/file_list/ui_normal'),
        events = lib.get('./events'),
        store = lib.get('./store'),
        routers = lib.get('./routers'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
	    huatuo_speed = common.get('./huatuo_speed'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        file_type_map = common.get('./file.file_type_map'),
        FileObject = common.get('./file.file_object'),
        PagingHelper = common.get('./ui.paging_helper'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),

        tmpl = require('./tmpl'),

        FileNode = require('./file.file_node'),
        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),
        last_click_item,//最后一次点击的目标.
        downloader,
        file_qrcode,
        drag_files,

    // 视图切换
        view_switch = require('./view_switch.view_switch'),

        rename = require('./file_list.rename.rename'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        ad_link = main_mod.get('./ad_link'),
        disk_ui = require('./ui'),
    // 工具栏
        tbar = require('./toolbar.tbar'),

        FileListUIAbstract = require('./file_list.ui_abstract'),

        tpmini = require('./file_list.tpmini.tpmini'),

    // 全选按钮
        all_checker,

    // 文件列表
        file_list,
        file_list_ui,
    // 文件删除
        remove,

    // 文件移动
        move,
    // 菜单
        menu,
    // 框选/点选
        selection,
    // 缩略图实例
        thumb,
    // 树
        tree, $tree,
        tree_view,

    // 动态计算文件列表每次写入DOM的文件个数
        calc_list_size = true,
    // 固定写入DOM的文件个数
        fixed_list_size = 200,

        set_timeout = setTimeout,

    // 要添加的目录队列
        add_dirs_queue = [],
    // 要添加的文件队列
        add_files_queue = [],
    // 当前目录
        cur_node,

        scroller,
        paging_helper,

        scroll_listening = false, // 正在监听中
        speed_reported = false, // 网盘测速结果已上报
        ui_visible = false, // 当前UI是否已显示

        highlight_ids = {}, // 要高亮的文件ID set
    // selected_ids = {}, // 要选中的文件ID set

    // is_output_first_list = constants.IS_PHP_OUTPUT, // 直出的首屏不能清空（hack）- james

        item_width_thumb = 125,  // 文件元素宽度（缩略图）
        item_height_thumb = 123, // 文件元素高度（缩略图）
        item_width_list = 'auto',// 文件元素宽度（列表）
        item_height_list = 47,   // 文件元素高度（列表）

        doc = document, body = doc.body, $body = $(body),

    //is_renaming = 0,//文件重命名中
        undefined;

    var ui_normal = new FileListUIAbstract('disk_file_list_ui_normal', {
        _$list_to: null,
        _$file_list: null,
        _$lists: null,
//        _column_model: null,

        /**
         * 渲染文件列表UI
         * @param $list_to
         */
        render: function ($list_to) {
            var me = this;

            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');
            menu = require('./file_list.menu.menu');
            selection = require('./file_list.selection.selection');
            move = require('./file_list.file_processor.move.move');

            require.async('downloader', function (mod) {
                downloader = mod.get('./downloader');
            });


            // 文件列表主体
            if (!constants.IS_PHP_OUTPUT) {
                $list_to.append(tmpl.file_list());
            }
            me._$list_to = $list_to;
            me._$views = $list_to.children('.files-view');
            me._$files_view = me._$views.filter('.files-view');

            scroller = main_ui.get_scroller();

            var
            // 文件列表
                $file_list = me._$file_list = $('#_disk_files_file_list'),
            // 两个列表(目录和文件已合并)
                $lists = me._$lists = $file_list,

            // 列表子标题
            //    $list_sub_titles = me._$list_sub_titles = $('#_disk_files_file_title'),

            // 空的提示
                $no_files_tip = me._$no_files_tip = $('#_disk_files_empty');


            // 树
            me._try_each([
                // 树
                '_watch_render_tree',
                // 工具栏
                '_render_toolbar',
                // 缩略图
                '_render_thumb',
                // 分页
                '_render_paging',
                // 打开目录、文件
                '_render_enter'
            ]);

            // 延迟200毫秒
            me._try_each([
                // 框选、拖拽移动
                '_render_selection',
                // 删除
                '_render_remove',
                // 移动
                '_render_move',
                // 重命名
                '_render_rename'
            ], 300);

            me._try_each([
                // 下载
                '_render_down',
                // 拖拽文件
                '_render_drag_files', //QQ2.0中拖拽下载和拖拽发送文件是一个模块
                // 右键菜单、更多菜单
                '_render_menu',
                // IE6
                '_render_ie6_fix',
                // 高亮
                '_render_hightlight',
                // 分享
                '_render_share',
                //获取文件二维码
                '_render_qrcode'
            ], 700);


            me.on('close_create_dir', function () {
                if (this.is_activated() && ui_visible) {
                    this._update_list_view_status(null, null, true);
                }
            })
        },

        show: function ($parent) {
            if (ui_visible !== true) {
                this.render($parent);

                this.get_$views().show();

                if (all_checker) {
                    // 显示全选
                    all_checker.show();
                }

                view_switch.set_namespace('ui_normal');

                this.trigger('show');

                ui_visible = true;
            }
        },

        hide: function () {
            if (ui_visible !== false) {
                this.get_$views().hide();
                this.trigger('hide');

                ui_visible = false;
            }
        },

        // 变更指向的目录
        enter_dir: function (node) {
            cur_node = node;

            disk_ui.toggle_toolbar(constants.DISK_TOOLBAR.NORMAL);

            //进入子目录后去掉qboss广告
            if(node.is_root()){
                ad_link.show_ad();
            } else {
                ad_link.remove_ad();
            }


            // 更新视图
            // this._update_list_view_status(false, false, false);

            // 隐藏右键菜单，解决jQueryUI draggable 阻止了mousedown事件的兼容性问题 james TODO 验证是否必要
            menu.hide_all();

            // 特殊逻辑
            this._on_enter_dir(node);

            view_switch.set_namespace('ui_normal');

            // 重新计算 paging_helper 所需的元素大小、是否列表模式。cgi 2.0 每页采用固定文件个数，不需要判断
            !query_user.is_use_cgiv2() && this._update_paging_data();//todo 缩略图模式下，进入虚拟目录会触发 进入单行模式；再回到网盘时，会错乱网盘加载判断
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node, reset_ui) {
            reset_ui = typeof reset_ui === 'boolean' ? reset_ui : false;

            if (thumb)
                thumb.clear_queue();

            if (reset_ui) {
                // 清除已选中的文件
                if (selection) {
                    selection.clear(last_node);
                    selection.trigger_changed();
                }
                this._clear_$items(false);
                this._update_list_view_status(false, false, false);
            }
        },

        set_node_data: function (node, dirs, files, page, reset_ui) {

            cur_node = node;

            // 如果勾选了全选，则此时需要将新插入的节点都选中
//            if (all_checker.is_checked()) {
//                var one_node;
//                if ((one_node = dirs[0] || files[0]) && !one_node.get_ui().is_selected()) {
//                    var arr = [dirs, files], nodes, kid;
//                    for (var i = 0, l = arr.length; i < l; i++) {
//                        nodes = arr[i];
//                        for (var j = 0, k = nodes.length; j < k; j++) {
//                            kid = nodes[j];
//                            kid.get_ui().set_selected(true);
//                        }
//                    }
//                }
//            }

            if (page === 0) {
                this._set_$items(dirs, files);
            } else {
                (dirs.length || files.length) && this.add_$items(dirs, files);
            }

            // 更新视图
            this._update_list_view_status(node.get_kid_dirs() && node.get_kid_dirs().length > 0, node.get_kid_files() && node.get_kid_files().length > 0, true);

            // 如果未能填充满列表可视区域，则继续添加
            this._add_if_need();
        },

        append_$items: function (dirs, files, is_first_page) {
            this.add_$items(dirs, files, is_first_page);
        },

        prepend_$items: function (add_dirs, add_files) {
            /*
             var count = (dirs ? dirs.length : 0 ) + (files ? files.length : 0);
             if (count > 1) {
             console.warn('file_list_ui_normal.prepend_$items(...) 方法目前只支持追加一个文件，追加多个时排序会有问题');
             }
             */
            var $items,
                $first_file = this.get_$first_file();

            add_dirs || (add_dirs = []);
            add_files || (add_files = []);

            var p_dir = file_list.get_cur_node();

            if (add_dirs.length) {
                $items = tmpl.file_item({ p_dir: p_dir, files: add_dirs, icon_map: this.get_icon_map() });
                this.get_$file_list().prepend($items);
            }
            if (add_files.length) {
                $items = tmpl.file_item({ p_dir: p_dir, files: add_files, icon_map: this.get_icon_map() });
                if ($first_file) {//有文件已渲染
                    $first_file.before($items);
                } else {
                    this.get_$file_list().append($items);//
                }
            }

            this.trigger('add_$items', [].concat(add_dirs, add_files), add_dirs, add_files);

            this._update_list_view_status(null, null, false);
        },

        insert_$items: function (dirs, files, index) {
            /*
             * 按通用的文件夹文件显示方案，目录与文件是分开的，这里默认一次insert只能添加一种类型，要么是文件夹，要么是文件
             * 即dirs和files同时只能有一个有数据
             * index也是针对一种类型
             */
            /*
             * --- 插入完成后的渲染设置---
             * 当要插入的位置的参考节点位于UI中时，也直接渲染到UI
             * 当位于缓存中时（缓存不能为空，为空则当作在UI中），直接插入到缓存中，后续不归这里管了
             */
            /*
             * 其实这里还是有逻辑冲突，这里插入的位置也只是UI上的位置，下次刷新界面时，可能就因为有排序从而位置改变
             * 目前无解决方法，除非修改排序机制
             */
            var nodes, target_el, target_cache,
                rendered_dirs = [],
                rendered_files = [],
                target_rendered,
                is_dirs_add = false;

            target_el = this.get_$file_list();
            if (dirs && dirs.length) {
                nodes = dirs;
                target_cache = add_dirs_queue;
                target_rendered = rendered_dirs;
                is_dirs_add = true;
            } else if (files && files.length) {
                nodes = files;
                target_cache = add_files_queue;
                target_rendered = rendered_files;
            } else {
                return; // 错误，没有dirs或files
            }
            // 计算已渲染的节点数
            var ui_elements = target_el.children(),
                $first_file = this.get_$first_file(),
                ui_size;
            //dirs 和 files通过分割符分割，通过找到分割符就能知道前面的目录有多少，后面的文件有多少
            if ($first_file) {
                ui_elements.each(function (i, elem) {
                    if (elem == $first_file[0]) {
                        if (is_dirs_add) {
                            ui_elements = Array.prototype.slice.call(ui_elements, 0, i);
                        } else {
                            ui_elements = Array.prototype.slice.call(ui_elements, i);
                        }
                    }
                });
            }

            ui_size = ui_elements.length;

            // TODO 插入节点需要处理位移
            if (index < ui_size) { // 插入的位置处于已渲染UI中
                $(ui_elements[index]).before(tmpl.file_item({ files: nodes, icon_map: this.get_icon_map() }));
                Array.prototype.splice.apply(target_rendered, [0, 0].concat(nodes));
            } else { // 插入的位置处于缓存中
                if (target_cache.length) { // 如果有缓存，不用管，直接插入，反正是有人去渲染的
                    Array.prototype.splice.apply(target_cache, [index - ui_size, 0].concat(nodes));
                } else { // 如果没有缓存，渲染到UI最后面
                    if (is_dirs_add && $first_file) {//目录渲染到文件的前面
                        $first_file.before(tmpl.file_item({ files: nodes, icon_map: this.get_icon_map() }));
                    } else {
                        target_el.append(tmpl.file_item({ files: nodes, icon_map: this.get_icon_map() }));
                    }
                    Array.prototype.splice.apply(target_rendered, [0, 0].concat(nodes));
                }
            }
            this.trigger('add_$items', target_rendered, rendered_dirs, rendered_files);

            this._update_list_view_status(null, null, false);
        },

        /**
         * 添加文件DOM（队列方式，延迟添加）
         * @param {FileNode} dirs
         * @param {FileNode} files
         * @param {Boolean} [is_first_page] 是否是首屏（首屏加载 add_items_first_page 个文件）
         */
        add_$items: function (dirs, files, is_first_page) {
//            console.debug('添加文件队列 ' + dirs.length + '目录, ' + files.length + '文件,' + (is_first_page ? '首屏' : '非首屏'));

            if (dirs && dirs.length) {
                add_dirs_queue = add_dirs_queue.concat(dirs);
            }
            if (files && files.length) {
                add_files_queue = add_files_queue.concat(files);
            }

            // 首屏要立刻插入 or 判断高度来决定是否要立刻插入
            this.fill_$items(is_first_page);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 通过判断滚动高度来决定是否要立刻插入文件DOM
         * @param {Boolean} [is_first_page] 是否首屏
         */
        fill_$items: function (is_first_page) {
            if (query_user.is_use_cgiv2()) {
                return this._add_if_need();
            }
            else if (is_first_page || scroller.is_reach_bottom()) {
                this._add_$items_from_queue(is_first_page);
            }
        },

        /**
         * 从队列中取文件并插入DOM
         * @param {Boolean} [is_first_page] 是否首屏
         * @param {Number} [add_count] 添加的个数
         */
        _add_$items_from_queue: function (is_first_page, add_count) {
            if (!query_user.is_use_cgiv2()) {
                if (!add_dirs_queue.length && !add_files_queue.length) {
                    this._stop_listen_scroll();
                    this.trigger('add_$items', []);
                    return;
                }
            }

            if (query_user.is_use_cgiv2()) {
                add_count = file_list.get_page_size();
                calc_list_size = false;
            }


            var me = this,
                step_dirs,
                step_files,
                add_dir_lines = 0, add_file_lines = 0,
                dir_count = 0, file_count = 0,
                line_size = calc_list_size ? paging_helper.get_line_size() : 0,
                line_count = calc_list_size ? paging_helper.get_line_count(is_first_page) : 0,

                p_dir = file_list.get_cur_node(),
                $first_file = this.get_$first_file(),
                html;

            if (!(add_count > 0)) {
                add_count = calc_list_size ? line_size * line_count : fixed_list_size; // 每一批添加的文件个数
            }


            // 目录在前
            if (add_dirs_queue.length) {
                var step_size = add_count;

                if (step_size > 0) {
                    step_dirs = add_dirs_queue.splice(0, step_size);

                    html = tmpl.file_item({ p_dir: p_dir, files: step_dirs, icon_map: this.get_icon_map(), line_size: line_size });
                    if ($first_file) {
                        $first_file.before(html); //目录渲染到文件的前面
                    } else {//文件还没渲染就直接渲染到后面就行了
                        this.get_$file_list().append(html);
                    }
                    dir_count = step_dirs.length;
                    add_dir_lines = Math.ceil(dir_count / line_size);
                }
            }

            // 文件在后
            if (add_files_queue.length) {
                var is_list = view_switch.is_list_view(),
                    file_step_size = 0;

                if (query_user.is_use_cgiv2()) {
                    file_step_size = add_count - dir_count;
                }
                else if (is_list || !calc_list_size) {
                    file_step_size = add_count - dir_count;
                    // console.debug('列表模式，已添加目录' + dir_count + '个；文件' + file_step_size + '个');
                }
                else {
                    // 如果插入的目录行数不满足需求，则需要继续插入文件
                    var line_limit = line_count - add_dir_lines;
                    if (line_limit > 0) {
                        file_step_size = line_limit * line_size;
                    }
                }

                if (file_step_size > 0) {
                    step_files = add_files_queue.splice(0, file_step_size);
                    html = tmpl.file_item({ p_dir: p_dir, files: step_files, icon_map: this.get_icon_map(), line_size: line_size });
                    this.get_$file_list().append(html);
                    file_count = step_files.length;
                    add_file_lines = Math.ceil(file_count / line_size);
                }
            }
//            console.debug('缩略图模式，' + (add_dir_lines > 0 ? '已添加目录' + add_dir_lines + '行共' + dir_count + '个；' : '') + (add_file_lines > 0 ? '文件' + add_file_lines + '行共' + file_count + '个' : ''));

            if (!step_dirs) {
                step_dirs = [];
            }
            if (!step_files) {
                step_files = [];
            }

//            console.debug('添加文件队列 本次处理了' + step_dirs.length + '目录，' + step_files.length + '文件；剩余' + add_dirs_queue.length + '目录，' + add_files_queue.length + '文件');

            this.trigger('add_$items', [].concat(step_dirs, step_files), step_dirs, step_files);

            if (!query_user.is_use_cgiv2()) {
                // 如果队列中没有了，则停止监听滚动
                if (!add_dirs_queue.length && !add_files_queue.length) {
                    me._stop_listen_scroll();
                }
            }
        },
        /**
         * 获取已渲染的第一个文件节点 (可能不存在)
         * @returns {Number|*}
         */
        get_$first_file: function () {
            var cur_node = file_list.get_cur_node(),
                kids = cur_node.get_kid_nodes(),
                first_file,
                $first_file;

            $.each(kids || [], function (i, kid) {
                if (!kid.is_dir()) {
                    first_file = kid;
                    return false;//break;
                }
            });
            if (first_file) {
                $first_file = this.get_$item(first_file.get_id());
                return $first_file.length && $first_file;
            }
        },

        /**
         * 从队列中移除指定的文件
         * @param {Object} id_set
         * @private
         */
        _remove_from_queue: function (id_set) {
            if (!(add_dirs_queue.length || add_files_queue.length)) {
                return;
            }

            var queues = [add_dirs_queue, add_files_queue];
            for (var i = 0; i < queues.length; i++) {
                var queue = $.grep(queues[i], function (file) {
                    return !id_set.hasOwnProperty(file.get_id());
                });
                queues[i] = queue;
            }

//            console.log('移除了' + (add_dirs_queue.length - queues[0].length) + '个目录');
//            console.log('移除了' + (add_files_queue.length - queues[1].length) + '个文件');

            add_dirs_queue = queues[0];
            add_files_queue = queues[1];
        },

        /**
         * 定位到某节点，使它保持在显示状态？只对已渲染的节点有效。。。
         * 以后实现更改后，此功能也需要重写。
         */
        _ensure_visible: function (node) {
            if (!node) {
                return;
            }
            var $item = this.get_$item(node && node.get_id());
            if (!$item) {
                return; // 可能没有渲染出来
            }
            if (scroller) {
                scroller.up();
            }
        },

        /**
         * 加载列表，根据滚动高度判断是否需要
         * @private
         */
        _add_if_need: function () {
            var me = this;
            if (!scroller.is_reach_bottom()) return;

            // ---- cgi 1.0 从本地cache中取文件并插入DOM --------------------------
            if (!query_user.is_use_cgiv2())
                return me._add_$items_from_queue(false);


            // ---- cgi 2.0 先从本地cache中取文件，插入DOM如果cache中的文件全部都插入DOM了依然不足页，则请求CGI拉取 --------------------------
            if (file_list.is_loading()) return;

            // 优先从队列中取文件并渲染，渲染完成后
            var has_dirs = !!cur_node.get_kid_dirs().length,
                has_files = !!cur_node.get_kid_files().length,
                limit = 5; // 只是避免死循环
            while (--limit > 0 && (add_dirs_queue.length || add_files_queue.length) && scroller.is_reach_bottom()) {
                me._add_$items_from_queue();
                me._update_list_view_status(has_dirs, has_files, false);
            }
            if (limit === 0)
                console.warn('add from queue looped 5 times!');

            var queue_empty = add_dirs_queue.length + add_files_queue.length === 0;
            // 如果cache中的文件全部渲染完成后仍然不足页，则从服务端加载下一页
            if (cur_node.has_more()
                && queue_empty
                && scroller.is_reach_bottom()) {

                file_list.load_next_page().done(function () {
                    var has_dirs = !!cur_node.get_kid_dirs().length,
                        has_files = !!cur_node.get_kid_files().length;
                    me._add_if_need();
                    me._update_list_view_status(has_dirs, has_files, false);
                });
            }
        },

        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(scroller, 'scroll', function () {
                    this._add_if_need()
                });
                this.listenTo(scroller, 'resize', function () {
                    this._add_if_need()
                });
                scroll_listening = true;
            }
        },

        /**
         * 终止追加元素的进程
         * @private
         */
        _stop_listen_scroll: function () {
            if (scroll_listening) {
                // clear_timeout(add_items_timer);
                this.stopListening(scroller, 'scroll resize');
                scroll_listening = false;
                add_dirs_queue = [];
                add_files_queue = [];
//                console.debug('添加文件队列 进程已终止');
            }
        },

        /**
         * 删除文件DOM
         * @param {FileNode} file_nodes
         * @param {Boolean} animate 动画(只支持单文件) 1
         */
        remove_$items: function (file_nodes, animate) {
            if (!file_nodes || !file_nodes.length)
                return;

            var me = this;

            // 取消要删除的文件的选中状态
            selection.toggle_select(file_nodes, false);

            // 从添加文件的队列中移除
            if (file_nodes.length) {
                var ids = collections.array_to_set(file_nodes, function (f) {
                    return f.get_id();
                });
                me._remove_from_queue(ids);
            }

            var remove_fn = function () {
                $(this).remove();
                me.trigger('remove_$items');

                // 剔除临时目录
                file_nodes = $.grep(file_nodes, function (file) {
                    return !file.is_tempcreate();
                });

                // 填充
                if (query_user.is_use_cgiv2()) {
                    me._add_if_need();
                } else {
                    if (file_nodes.length) {
                        me._add_$items_from_queue(false, file_nodes.length);
                    }
                    me._update_list_view_status(null, null, true);
                }
            };

            if (file_nodes.length == 1) {
                var first = file_nodes[0],
                    id = first.get_id(),
                    $item = me.get_$item(id);

                if (animate) {
                    $item.fadeOut('fast', remove_fn);
                } else {
                    remove_fn.apply($item);
                }
            } else {

                var ids;
                if (FileNode.is_instance(file_nodes[0])) {
                    ids = collections.map(file_nodes, function (file) {
                        return file.get_id();
                    });
                } else {
                    ids = file_nodes;
                }

                var items = [];
                $.each(ids, function (i, id) {
                    var item = me.get_$item(id)[0];
                    if (item) {
                        items.push(item);
                    }
                });
                remove_fn.apply(items);
            }
        },

        /**
         * 替换文件
         */
        _set_$items: function (dirs, files) {
            this._clear_$items(true);
            this.append_$items(dirs, files, true);

            // 修复IE下可能出现滚动条高度未变化的问题 - james
            /* 滚动条内移后不会有这个问题 - james
             if ($.browser.msie) {
             scroller.go(0, 0);
             }*/

            // 测速  TODO 首屏列表渲染上报方式可能要调整 - james
	        try{
		        var flag = '21254-1-6';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 6, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }

        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        _clear_$items: function (silent) {
            if (!this.is_rendered()) return;

            // TODO 检查分页加载的话是否需要进行这个操作 - james
            this._stop_listen_scroll();
            var $file_list = this.get_$file_list();
            if ($file_list)
                $file_list.empty();

            // 强制更新文件列表UI
            // this._update_list_view_status(silent ? false : null, silent ? false : null, silent ? false : null);
//            this._update_list_view_status();

            if (!silent) {
                this.trigger('clear_$items');
            }
        },

        /**
         * 重置列表 DOM 和 UI （显示为空白）
         */
        reset: function () {
            this._clear_$items(false);
        },

        /**
         * 获取某个文件的DOM
         * @param {String|jQuery|HTMLElement} arg
         */
        get_$item: function (arg) {
            var $item;
            if (typeof arg === 'string') {
                $item = $('#' + this.get_el_id(arg));
            } else if (arg instanceof $ || arg.tagName) {
                $item = $(arg).closest('[data-file-id]');
            }
            return $item;
        },

        /**
         * 通过文件ID获取DOM ID
         * @param {String} file_id
         * @returns {String}
         */
        get_el_id: function (file_id) {
            return '_disk_file_item_' + file_id;
        },

        /**
         * 获取某些文件的DOM
         * @param {Array<String>} ids
         */
        get_$items: function (ids) {
            var me = this;
            return $.isArray(ids) ? $($.map(ids, function (id) {
                return me.get_$item(id).get(0);
            })) : me.get_$lists().children(); // lists > .list-wrap > .list
        },

        /**
         * 重建某个文件的DOM
         * @param {FileNode|File} node
         * @param {String} old_id (optional) 如果文件节点的ID有改变，则传递此项。默认为空。
         */
        update_$item: function (node, old_id) {
            var $cur_item = this.get_$item(old_id || node.get_id());

            if (old_id) {
                $cur_item.after(tmpl.file_item({
                    files: [node],
                    icon_map: this.get_icon_map()
                }));
                $cur_item.remove();
            } else {
                // 替换内容
                $cur_item.children('.list').empty().html(tmpl.file_item({
                    files: [node],
                    icon_map: this.get_icon_map(),
                    only_content: true  // only_content -> 只生成文件DOM的内容部分，而不包括.list-wrap节点本身，这样可以保留一些状态（如选中状态：ui-selected）
                }));
            }
            this.trigger('update_$item', node);
        },

        /**
         * 更新tpmini加速上传文件的DOM (因更新DOM和普通文件不一样，所以另起一个名)
         * @param node
         */
        update_$tpmini_item: function (node) {
            var $cur_item = this.get_$item(node.get_id());
            //与普通文件不同，tpmini加速上传文件更新后需要更新状态，所以only_content为false
            $cur_item.replaceWith(tmpl.file_item({
                files: [node],
                icon_map: this.get_icon_map(),
                only_content: false  // only_content -> 只生成文件DOM的内容部分，而不包括.list-wrap节点本身，这样可以保留一些状态（如选中状态：ui-selected）
            }));
            this.trigger('update_$item', node); //事件还是以update_$item,使监听后续一致
        },

        /**
         * 更新文件DOM显示名称
         * @param {FileNode|File} node
         * @param {String} name
         */
        show_$item_name: function (node, name) {
            var $item = this.get_$item(node.get_id()),
                $file_name = $item.find('[data-name=file_name]'),
                ext = FileObject.get_ext(name) || '',
                name_no_ext = ('.' + ext) === name ? name : name.substr(0, name.length - (ext.length + 1)),
                can_ident = !node.is_dir() && file_type_map.can_identify(ext);

            $file_name.text(can_ident ? name_no_ext : name).css('display', ''); // $file_name.show()，这里改为删除display样式是因为.filename元素在列表模式下display=inline-block，在缩略图模式下display=block，如果直接.show()，会导致布局出错
        },

        /**
         * 获取文件\目录列表DOM
         */
        get_$lists: function () {
            return this._$lists;
        },

        get_$file_list: function () {
            return this._$file_list;
        },

        get_$views: function () {
            return this._$views;
        },

        get_$list_parent: function () {
            return this._$list_to;
        },

        /*get_$list_sub_titles: function () {
         return this._$list_sub_titles;
         },*/

        /**
         * 标记某个文件DOM展开了菜单
         * @param el
         */
        mark_menu_on: function (el) {
            this.clear_menu_mark();

            var $item = this.get_$item(el);
            $item.children().addClass('list-menu-on');

            this._last_menu_on_item = $item;
        },

        // 上一个展开了菜单的元素
        _last_menu_on_item: null,

        /**
         * 清除展开菜单的标记
         */
        clear_menu_mark: function () {
            var $item = this._last_menu_on_item;
            if ($item) {
                $item.removeClass('selected').find('[data-function="more"]').removeClass('actived');
                $item.children().removeClass('list-menu-on');
            }
        },

        /**
         * 设置需要高亮的文件
         * @param {Array<String>} ids
         */
        set_highlight_ids: function (ids) {
            ids = ids || [];
            $.extend(highlight_ids, collections.array_to_set(ids));
        },
        /**
         * 显示新建文件夹
         */
        show_create_dir: function () {
            var temp_node;
            // 还要判断当前重命名模块已就绪
            if (cur_node && rename.is_idle()) {
//                create_dir.render();
//                create_dir.show();

                // 先创建一个临时节点
                temp_node = file_factory.create('FileNode', {
                    is_dir: true,
                    id: '_TEMP_ONLY_FOR_CREATE_',
                    name: '', // 或可考虑改为“新建文件夹”，就和Microsoft Windows一样
                    is_tempcreate: true
                });

                // 插入节点
                file_list.prepend_node(temp_node);

                // this._update_list_view_status(null, null, false);

                // 定位并启用重命名
                this._ensure_visible(temp_node);
                rename.start_edit(temp_node, function (success, new_name, properties) {
                    var old_id;
                    if (success) { // 成功时，更新节点及UI
                        old_id = temp_node.mark_create_success(properties);
                        temp_node.set_tempcreate(false);
                        this.update_$item(temp_node, old_id);

                        this.trigger('after_dir_created', temp_node);

                    } else { // 当重命名失败，即新建失败时，移除临时节点
                        // 有时立即删除的话，可能后面有其它逻辑会尝试找此节点从而出错。延迟使得删除在下个时间片执行
                        file_list.remove_nodes([temp_node]);
                    }

                    this._update_list_view_status(null, null, true);
                }, this);
            }
        },

        /**
         * 获取已选中的文件DOM列表
         */
        get_selected_$items: function () {
            return selection.get_selected_$items();
        },

        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(file_id);
        },

        /**
         * 高亮指定文件ID元素
         * @param {Array<String>|String} file_ids
         */
        highlight_item: function (file_ids) {
            if (typeof file_ids === 'string') {
                file_ids = [file_ids];
            }

            var $items = this.get_$items(file_ids).children();
            if ($items.length) {
                $items.addClass('hilight');
                set_timeout(function () {
                    $items.removeClass('hilight');
                }, 6000);
            } else {
                highlight_ids = $.extend(highlight_ids, collections.array_to_set(file_ids));
            }
        },

        /**
         * 高亮元素
         * @param {Object<String, String>} id_set
         * @param {Array<FileNode>} files
         */
        highlight_items: function (id_set, files) {
            var me = this,
                items = [],
                highlighted = [];

            for (var i = 0, l = files.length; i < l; i++) {
                var file_id = files[i].get_id();
                if (file_id in id_set) {
                    var $item = me.get_$item(file_id);
                    if ($item) {
                        items.push($item[0]);
                        highlighted.push(file_id);
                    }
                }
            }

            var $items = $(items).children().addClass('hilight');
            set_timeout(function () {
                $items.removeClass('hilight');
            }, 6000);

            return highlighted;
        },

        /**
         * 显示、隐藏文件列表
         * @param {Boolean} visible
         */
        toggle: function (visible) {
            this._$views.toggle(visible);
        },

        /**
         * 判断列表是不是缩略图模式
         * @returns {Boolean}
         */
        is_grid_view: function () {
            return view_switch && view_switch.is_grid_view();
        },

        _get_sel_files: function () {
            return file_list.get_selected_files();
        },

        // 分页逻辑
        _render_paging: function () {
            var me = this;

            // 在不使用分页逻辑的情况下，每页渲染多少个需要进行计算
            if (!query_user.is_use_cgiv2()) {
                paging_helper = new PagingHelper({
                    scroller: scroller
                });
                me._update_paging_data();

                // 切换视图时，判断是否需要补充列表 - james
                this.listenTo(view_switch, 'switch.ui_normal', function (is_grid, is_list, view_name, is_temp) {
                    me._update_paging_data();
                });
            }

            // 分页逻辑
            else {
                // 切换视图时，重新加载 - james
                this.listenTo(view_switch, 'switch.ui_normal', function () {
                    me._update_paging_data();
                    me._clear_$items(true);
                    file_list.reload(false, true);
                });
                this.on('activate', function () {
                    me._start_listen_scroll();
                });
                this.on('deactivate', function () {
                    me._stop_listen_scroll();
                });
            }
        },

        // 进入目录、预览文件、下载文件
        _render_enter: function () {

            var me = this,
                is_enter_event = function (e) {
                    return !$(e.target).closest('input, a, button, [data-function]')[0];
                },
                is_multi_key = function (e) {
                    return e.ctrlKey || e.shiftKey || e.metaKey;
                },

                enter_file = function (node, trigger_by, e) {
                    last_click_item = null;
                    if (node.is_upload_by_tpmini() && !node.has_uploaded_by_tpmini()) {//tpmini加速上传的文件，点击进行刷新状态
                        tpmini
                            .update_status(node)
                            .done(function () {
                                me.update_$tpmini_item(node);//更新到ui
                            })
                            .fail(function () {
                                //mini_tip.error('更新tpmini加速上传文件状态失败');
                            });

                        return;
                    }

                    if (node.is_broken_file() || node.is_tempcreate()) {
                        return;
                    }

                    // 目录
                    if (node.is_dir()) {
                        file_list.load(node, true, 0, true);
                    }
                    // 文件
                    else {
                        if (trigger_by === 'click') {
                            // 如果是可预览的文档，则执行预览操作
                            if (preview_dispatcher.is_preview_doc(node)) {
                                preview_dispatcher.preview(node);
                                user_log('ITEM_CLICK_DOC_PREVIEW');
                                return;
                            }

                            // 如果是图片，则执行预览操作
                            if (node.is_image()) {
                                me.appbox_preview(node).fail(function () {
                                    me.preview_image(node);
                                });

                                user_log('ITEM_CLICK_IMAGE_PREVIEW');
                                return;
                            }

                            // 压缩包预览 & IE7及以下不给预览，直接下载
                                if (node.is_compress_file() && !($.browser.msie && $.browser.version < 8)) {
                                me.preview_zip_file(node);                   // @see ui_virtual.js
                                user_log('ITEM_CLICK_ZIP_PREVIEW');
                                return;
                            }
                        }

                        // 其他文件，下载
                        download_file(node, e);
                        user_log('ITEM_CLICK_DOWNLOAD');
                    }
                },

                download_file = function (node, e) {
                    // 未完成的文件才可下载
                    if (node.is_broken_file()) {
                        // do nothing
                    }
                    else {
                        if (downloader) {
                            downloader.down(node, e);
                        } else {
                            console.log('downloader未初始化 -- down_file事件不能促发下载');
                        }
                    }
                },

            // 点击文件、文件
                click_file_event = function (e) {
                    e.preventDefault();

                    if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e))
                        return;

                    if (is_multi_key(e)) {
                        select_file_event(e);
                        return;
                    }

                    // 阻止选中文件
                    e.stopPropagation();

                    var node = me.get_file_by_$el(this);
                    enter_file(node, 'click', e);
                },

            // 勾选
                select_file_event = function (e) {
                    var file = me.get_file_by_$el(e.target);
                    if(e.shiftKey){
                        //shift选择多个item。
                        var cur_node = file_list.get_cur_node();
                        var all_files=cur_node.get_kid_nodes();
                        var files=new Array();
                        if(!last_click_item){
                            last_click_item=all_files[0];
                        }else{
                            //判断上一次点击的item目录  是否是当前目录的子节点。 如果不是则清除
                            for(var i= 0;i <all_files.length;i++){
                                if(last_click_item == all_files[i]){
                                       break;
                                }
                                if( i== all_files.length-1){
                                    last_click_item =all_files[0];
                                }
                            }
                        }
                        var i= 0,j=0;
                        while(i<2 && j<all_files.length){
                            if(all_files[j] == last_click_item){
                                i++;
                            }
                            if(all_files[j] == file){
                                i++;
                            }
                            if(i>0){
                                if(!all_files.is_vir_dir){
                                    files.push(all_files[j]);
                                }
                            }
                            j++;
                        }
                        selection.toggle_select(files,true);
                        last_click_item = file;
                    }else{
                        if (file.get_ui().is_selectable()) {
                            var to_sel = !file.get_ui().is_selected();
                            if(to_sel){
                                last_click_item = file;
                            }
                            selection.toggle_select([file], to_sel);
    //                        selection.trigger_changed();
                            if (menu) {
                                menu.get_context_menu().hide();
                            }

                            // log
                            user_log(view_switch.is_list_view() ? 'ITEM_CLICK_LIST_CHECKBOX' : 'ITEM_CLICK_THUMB_CHECKBOX');
                            return to_sel;
                        }
                    }
                    return false;
                };

            var $lists = this.get_$lists(),
            //$dirs = this.get_$dir_list(),
                $files = this.get_$file_list();

            $lists
                .off('click.file_list', '[data-action="enter"]')
                .on('click.file_list', '[data-action="enter"]', click_file_event)

                // 点击checkbox勾选，而不是进入
                .off('click.file_list_ck', '[data-file-check]')
                .on('click.file_list_ck', '[data-file-check]', function (e) {
                    e.stopPropagation();  // 阻止默认点选行为
                    select_file_event.call(this, e);
                })
                //yuyanghe 加入获取二维码
                .off('click.file_list', '[data-function=qr_code]')
                .on('click.file_list', '[data-function=qr_code]', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var node = me.get_file_by_$el(this);
                    file_qrcode.show([node]);
                    user_log('FILE_QRCODE_DISK_ITEM');
                })
                .off('click.file_list', '[data-function=download]')
                .on('click.file_list', '[data-function=download]', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var node = me.get_file_by_$el(this);
                    download_file(node, e);

                    // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                    $(e.target).toggle().toggle();
                });

            // ------------------------------------------
            // -----            for ARIA            -----
            // ------------------------------------------

            if (scr_reader_mode.is_enable()) {
                // 进入目录
                $files
                    .off('click', '[data-file-check]')
                    .off('click.file_list.aria', '[data-file-check]')
                    .on('click.file_list.aria', '[data-file-check]', function (e) {
                        var node = me.get_file_by_$el(this);
                        if (node.is_dir()) {
                            e.preventDefault();
                            enter_file(node, 'key', e);
                        }
                    });

                // 下载链接
                $files
                    .off('click.file_list.aria', 'a.aria-el')
                    .on('click.file_list.aria', 'a.aria-el', function (e) {
                        if (downloader) {
                            var $link = $(this);
                            var node = me.get_file_by_$el($link);
                            if (!node.is_dir()) {
                                downloader.down(node, e); // TODO 检查是否能够通过浏览器安全检查（小黄条）- james
                            }
                            //                        if (!$link.data('down-url-ready')) {
                            //                            $link.attr('href', downloader.get_down_url(node));
                            //                            $link.data('down-url-ready', 1);
                            //                        }
                        }
                    });

                // 删除
                $lists
                    .off('keydown.file_list.aria', '.aria-el')
                    .on('keydown.file_list.aria', '.aria-el', function (e) {
                        if (e.which === 46) { // delete
                            var node = me.get_file_by_$el(this);
                            remove && remove.remove_confirm([node]);
                        }
                    })
            }
        },

        // 文件删除模块
        _render_remove: function () {

            var me = this;

            // 删除文件模块
            remove = require('./file_list.file_processor.remove.remove');
            remove.render();

            // 删除事件
            me.get_$lists().on('click.file_list', '[data-function="remove"]', function (e) {
                e.preventDefault();

                var node = me.get_file_by_$el(this);
                remove.remove_confirm([node]);
            });
        },

        // 文件移动模块
        _render_move: function () {

            var me = this;

            // move = require('./file_list.file_processor.move.move');
            move.render();

            // 点击移动按钮
            this.get_$lists().on('click.file_list', '[data-function="move"]', function (e) {
                e.preventDefault();

                var node = me.get_file_by_$el(this);
                move.show_move_to([node]);
                user_log('ITEM_MOVE');
            });

            // 拖拽并丢放文件
            this.listenTo(disk_event, 'drag_and_drop_files_to', function (target_dir_id) {
                var files = me._get_sel_files(),
                    target_node = all_file_map.get(target_dir_id);

                // 文件个数限制
                if (!constants.IS_DEBUG
                    && query_user.is_use_cgiv2()
                    && files.length > constants.CGI2_DISK_BATCH_LIMIT) {
                    mini_tip.warn('一次移动文件不能超过' + constants.CGI2_DISK_BATCH_LIMIT + '个');
                    return;
                }

                // 判断是否允许丢放
                if (target_node.is_droppable()) {
                    move.start_move(files, target_node.get_parent().get_id(), target_node.get_id());
                }
            })
        },

        // 文件选择、移动模块
        _render_selection: function () {
            var me = this;

            all_checker = require('./file_path.all_checker');
            selection.render();
            selection.enable_selection();
            selection.enable_dragdrop();


            // 全选事件
            me
                .listenTo(all_checker, 'toggle_check', function (to_check) {
                    var node = file_list.get_cur_node();
                    if (!node || file_list.is_loading()) return;

                    var on_check = function (node, to_check) {
                        var files = node.get_kid_nodes();
                        selection.toggle_select(files, to_check);
                    };

                    on_check(node, to_check);

                    if (query_user.is_use_cgiv2()
                        // 全选时，如果文件数不足 M 个，且目录还有更多文件未加载，则加载至 M 个（考虑总数不足 M 的情况）
                        && node.has_more()
                        && node.get_kid_nodes().length < constants.CGI2_DISK_BATCH_LIMIT) {

                        // 遮罩，避免误操作
                        widgets.loading.show(true, 'file_list_load');
                        // 加载
                        file_list.load_all(node, function(success) { //勾选全选时，因已经有首屏了，所以不用从0开始拉
                            if(success) {
                                on_check(node, to_check);
                            }
                            widgets.loading.hide('file_list_load');
                        });
                    }

                    // log
                    user_log('DISK_TBAR_ALL_CHECK');
                })

                // 手动选中文件
                .listenTo(selection, 'select_change', function (sel_meta) {
                    // 更新全选按钮状态
                    all_checker.toggle_check(sel_meta.is_all);

                    // 更新工具栏按钮的显示状态
                    this.update_tbar(false, sel_meta.files);
                    this._block_hoverbar_if(sel_meta.files.length);
                })

                // 目前看来不需要这段同步代码，文件列表模板中对于已选中的文件节点，自动应用了 .ui-selected 样式 - james 2013.11.18
                // 插入DOM时，全选状态下自动选中
//                .on('add_$items', function (files) {
//                    var file = files[0];
//                    if (file && file.get_ui().is_selected() && !file.is_tempcreate()) {
//                        selection.set_dom_selected(files, true);
//                    }
//                })

                // 删除文件后，如果当前目录下已无文件，则取消全选
                .listenTo(file_list, 'after_nodes_removed', function (files) {
                    // 更新全选按钮状态
                    if (files.length && all_checker.is_checked() && !cur_node.has_nodes()) {
                        all_checker.toggle_check(false);
                    }

                    if(!cur_node.get_kid_nodes().length) {
                        me._update_list_view_status(null, null, true);
                    }
                });


            // 激活 ui_normal 时，增加 selection-view 类以显示列表为checkbox勾选操作模式
            this.on('show', function () {
                disk_ui.get_$body().addClass('selection-view');
            });
            if (ui_visible === true) {
                disk_ui.get_$body().addClass('selection-view');
            }

            this
                // 添加文件DOM后，更新其dragdrop状态
                .on('add_$items update_$item', function (files) {
                    files = [].concat(files);

                    var drag_els = [], // 文件 + 目录
                        drop_els = []; // 目录
                    $.each(files, function (i, f) {
                        var item_el = me.get_$item(f.get_id())[0];
                        if (item_el) {
                            drag_els.push(item_el);
                            if (f.is_droppable()) {
                                drop_els.push(item_el);
                            }
                        }
                    });

                    var $drag_els = $(drag_els),
                        $drop_els = $(drop_els);

                    selection.refresh_drag($drag_els);
                    selection.refresh_drop($drop_els);
                    selection.refresh_selection();
                })

                .on('show', function () {
                    selection.enable_selection();
                    selection.enable_dragdrop();
                })
                .on('hide', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            this
                .listenTo(file_list_ui, 'activate', function () {
                    // file_list/ui 被隐藏时，禁用框选和拖拽
                    if (/*this.is_activated() && */ui_visible) {  // 这个this.is_activated()判断应该用不上 james
                        selection.enable_selection();
                        selection.enable_dragdrop();
                    }
                })
                .listenTo(file_list_ui, 'deactivate', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            this.listenTo(file_list, 'activate deactivate', function () {
                // 显示、隐藏树
                this._update_tree_visible(true);
            });

            // 按下ctrl键时，给body增加 ctrl-key-pressed 类，鼠标移动至文件列表上时cursor会显示为默认，而不是可点击状态
            $(document)
                .on('keydown', function (e) {
                    if (e.ctrlKey || e.shiftKey) {
                        $body.addClass('ctrl-shift-pressed');
                    }
                })
                .on('keyup', function (e) {
                    if (e.which === 17 || e.which === 16) {
                        $body.removeClass('ctrl-shift-pressed');
                    }
                })
                .on('mouseenter', function (e) {
                    if (!e.ctrlKey && !e.shiftKey) {
                        $body.removeClass('ctrl-shift-pressed');
                    }
                });
        },

        // 下载
        _render_down: function () {
            require.async('downloader', function (mod) { //异步加载downloader
                downloader = mod.get('./downloader');
            });
        },

        // 获取文件二维码
        _render_qrcode: function () {
            require.async('file_qrcode', function (mod) { //异步加载downloader
                file_qrcode = mod.get('./file_qrcode');
            });
        },

        // 拖拽下载
        _render_drag_down: function () {
            // APPBOX 拖拽下载
            if (constants.IS_APPBOX) {
                var mouseleave = 'mouseleave.file_list_ddd_files';

                this
                    // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                    .listenTo(selection, 'before_drag_files', function (files) {

                        $body
                            .off(mouseleave)
                            .one(mouseleave, function (e) {

                                // 取消拖拽动作（取消移动文件动作）
                                selection.cancel_drag();

                                // 下载
                                if (downloader) {
                                    // 启动拖拽下载
                                    downloader.drag_down(files);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                } else {
                                    console.log('downloader未初始化 -- 拖拽下载 不能触发');
                                }
                            });
                    })
                    // 拖拽停止时取消上面的事件
                    .listenTo(selection, 'stop_drag', function () {
                        $body.off(mouseleave);
                    });
            }

            this.listenTo(file_list, 'rebuild_file_list', function () {
                // 取消拖拽动作
                selection.cancel_drag();
            });
        },

        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            // APPBOX 拖拽下载
            if (constants.IS_APPBOX) {
                var mouseleave = 'mouseleave.file_list_ddd_files',
                    can_drag_files = false;

                try {
                    if (window.external.DragFiles) {
                        require.async('drag_files', function (mod) { //异步加载drag_files
                            drag_files = mod.get('./drag_files');
                        });
                        can_drag_files = true;
                    }
                } catch (e) {
                    console.error(e.message);
                }


                this
                    // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                    .listenTo(selection, 'before_drag_files', function (files) {

                        $body
                            .off(mouseleave)
                            .one(mouseleave, function (e) {

                                // 取消拖拽动作（取消移动文件动作）
                                selection.cancel_drag();

                                // 下载
                                if (can_drag_files && drag_files) {
                                    // 启动拖拽下载
                                    drag_files.set_drag_files(files, e);
                                } else {
                                    if (downloader) {
                                        // 启动拖拽下载
                                        downloader.drag_down(files, e);
                                        user_log('DISK_DRAG_DOWNLOAD');
                                    } else {
                                        console.log('downloader未初始化 -- 拖拽下载 不能触发');
                                    }
                                }

                            });
                    })
                    // 拖拽停止时取消上面的事件
                    .listenTo(selection, 'stop_drag', function () {
                        $body.off(mouseleave);
                    });
            }

            this.listenTo(file_list, 'rebuild_file_list', function () {
                // 取消拖拽动作
                selection.cancel_drag();
            });
        },

        // 菜单模块
        _render_menu: function () {

            // 菜单模块
            menu.render();

            var me = this;


            var ctxt_menu = menu.get_context_menu();
            me
                // 菜单显示时给item标记
                .listenTo(ctxt_menu, 'show_on', function (el) {
                    this.mark_menu_on(el);
                    if (!view_switch.is_grid_view()) {
                        disk_ui.get_$body().addClass('block-hover');
                    }
                })
                // 菜单 隐藏时去掉标记
                .listenTo(ctxt_menu, 'hide', function () {
                    this.clear_menu_mark();
                    var selected_files = selection.get_selected_files();
                    if (!view_switch.is_grid_view() && (!selected_files || selected_files.length < 2)) {
                        disk_ui.get_$body().removeClass('block-hover');
                    }
                });

            // 文件的"更多"菜单
            me.get_$file_list()
                .on('click.file_list', '[data-function="more"]', function (e) {
                    e.preventDefault();

                    var $on_el = $(this);
                    // var $item = $on_el.closest('[data-file-id]');

                    // 清除非当前文件的选中
                    // if (selection.select_but($item)) {
                    menu.show_more_menu($on_el);
                    // } // 现在不再更改文件的选中状态 james
                });


            // 右键菜单 ----------------------------------
            me.get_$lists()
                .off('mousedown.file_list_context_menu')// contextmenu.file_list_context_menu')
                .on('mousedown.file_list_context_menu'/* contextmenu.file_list_context_menu'*/, '[data-file-id]', function (e) {
                    //code by bondli 增加e.which===0的时候也是右键，这个是因为IE6/7/8下装了soso工具栏导致的bug
                    if (e.which === 3 || e.which === 0) { // 右键

                        // 点击的不是功能按钮才处理
                        if ($(e.target).closest('input, textarea, [data-function]').length == 0) {
                            var can_show = true,
                                $on_item = $(this),
                                node = me.get_file_by_$el($on_item);

                            //tpmini加速上传的文件在失败状态下允许右键菜单进行删除
                            /* if (node && node.is_upload_by_tpmini() && node.is_upload_by_tpmini_fail()) {
                             selection.clear(cur_node);//清除已选择中其它文件，才进行
                             tpmini.show_context_menu(node, $on_item, e);
                             }*/

                            // - 在已选中的文件上点击时, 不作任何改变
                            if (selection.is_selected($on_item)) {
                                can_show = true;
                            }

                            // - 在未选中的文件上点击时, 选中该文件, 并清除其他选中
                            else {
                                // 如果选中成功, 则允许显示
                                selection.select_but($on_item);
                                can_show = selection.has_selected();
                            }

                            if (can_show) {
                                e.stopImmediatePropagation();
                                menu.show_context_menu(e.pageX, e.pageY, $on_item);
                                user_log('RIGHTKEY_MENU');
                            }

                            // 如果是 contextmenu 事件，则阻止浏览器默认菜单
                            if (e.handleObj.type === 'contextmenu') {
                                e.preventDefault();
                            }
                        }

                    }
                });

            // 切换视图后排序  // 已改为直接对数据排序 - james
//            me.listenTo(view_switch, 'switch', function () {
//                if (me.is_activated() && ui_visible) {
//                    me.clear_$items();
//                    me._update_list_view_status();
//                    me._refill_$items();
//                }
//            });
        },

        // 文件列表头部模块
//        _render_column_header: function (/*$column_model_to*/) {
//
//            // 排序后也会返回两个集合
//            this.listenTo(cm, 'sorted', function (datas, field) {
//                this.trigger('sorted');
//
//                var dirs = datas[0],
//                    files = datas[1],
//                    node = file_list.get_cur_node();
//
//                if (node) {
//                    // 虚拟目录、目录不参与「大小」的排序
//                    if (field === 'size') {
//                        dirs = node.get_kid_dirs();
//                    }
//
//                    // 更新缓存
//                    node.set_nodes(dirs, files);
//                }
//            });
//        },

        // 文件重命名模块
        _render_rename: function () {

            var me = this;

            me
                // 在服务器返回响应之前，临时显示一下
                .listenTo(rename, 'temp_save', function (node, new_name) {
                    if (node.get_name() !== new_name) {
                        this.show_$item_name(node, new_name);
                    }
                })
                // 修改完成，或取消修改后的回调
                .listenTo(rename, 'done', function (node, new_name) {
                    if (node.is_tempcreate()) { // 对于创建操作，直接在回调中处理后续流程，与重命名的更新分开。因为会涉及到id更新
                        return;
                    }
                    // 如果名称发生了变化，则重建文件DOM
                    if (node.get_name() !== new_name) {
                        node.set_name(new_name);
                        this.update_$item(node);

                        this.trigger('after_file_renamed', node);
                    }
                    // 如果名称未变化，则显示文件名即可
                    else {
                        this.show_$item_name(node, node.get_name());
                    }
                })
                // 无效的修改操作，显示原文件名
                .listenTo(rename, 'deny', function (node) {
                    this.show_$item_name(node, node.get_name());
                });

            // 目录重命名
            this.get_$lists()
                .on('click.file_list', '[data-function="rename"]', function (e) {
                    e.preventDefault();

                    var node = me.get_file_by_$el(this);
                    rename.start_edit(node);
                });
        },

        // 缩略图
        _render_thumb: function () {
            var me = this;

            thumb = require('./file_list.thumb.thumb');

            me
                // 文件列表增加文件DOM后刷新缩略图
                .on('add_$items set_$items update_$item', function (files) {
                    thumb.render();
                    thumb.push(files);
                })

                // 加载成功后显示图片
                .listenTo(thumb, 'get_image_ok', function (file, img) {
                    set_image(file, img);
                });


            var copy_attr_list = { unselectable: 1 },
                set_image = function (file, img) {
                    var $item = me.get_$item(file.get_id());
                    var $icon = $item.find('i[data-ico]');
                    if ($icon[0]) {
                        var $img_copy = $(img).clone();

                        $.each($icon[0].attributes, function (i, attr) {
                            if (attr.nodeName.indexOf('data-') === 0) {
                                $img_copy.attr(attr.nodeName, $icon.attr(attr.nodeName));
                            }
                        });
                        $.each(copy_attr_list, function (attr_name) {
                            $img_copy.attr(attr_name, $icon.attr(attr_name));
                        });

                        $img_copy[0].className = $icon[0].className;
                        $img_copy[0].style.cssText = $icon[0].style.cssText;
                        $img_copy.addClass('default');
                        $img_copy.attr('unselectable', 'on');

                        $icon.replaceWith($img_copy);
                    }
                };
        },

        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.get_$lists()
                    .on('mouseenter', '>div', function () {
                        $(this).children(':first').addClass(hover_class);
                    })
                    .on('mouseleave', '>div', function () {
                        $(this).children(':first').removeClass(hover_class);
                    });
            }
        },

        _render_hightlight: function () {
            this
                // 追加元素后，高亮相应文件
                .on('add_$items', function (files) {
                    if (files.length && !$.isEmptyObject(highlight_ids)) {
                        var highlighted = this.highlight_items(highlight_ids, files);

                        // 剔除已高亮的文件
                        for (var i = 0, l = highlighted.length; i < l; i++) {
                            delete highlight_ids[highlighted[i]];
                        }
                    }
                });
        },

        _render_toolbar: function () {
            var ui = this;
            this.update_tbar(false);
            this
                // 动态工具栏事件
                .listenTo(tbar, {
                    refresh: function (e) {
                        global_event.trigger('disk_refresh');
                    },
                    // 新建文件夹
                    mkdir: function (e) {
                        ui.show_create_dir();
                    },
                    // 打包下载
                    pack_down: function (e) {
                        var files = ui._get_sel_files();
                        if (downloader && files.length) {
                            downloader.down(files, e);
                        }
                    },
                    //分享入口
                    share: function (e) {
                        var files = ui._get_sel_files();
                        ui._get_share_enter(function (share_enter) {
                            share_enter.start_share(files);
                        });
                    },
                    // 删除
                    del: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            remove.remove_confirm(files);
                        }
                    },
                    // 移动
                    move: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            if (move) {
                                move.show_move_to(files, 'TOOLBAR_MANAGE_MOVE');
                            }
                        }
                    },
                    // 重命名
                    rename: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            rename.start_edit(files[0]);
                            // TODO 统计码
                        }
                    }
                });
        },

        // 列表中的分享菜单
        _render_share: function () {
            var me = this,
                hover_timer;

            me.get_$lists()
                // 分享菜单
                .on('mouseenter', '[data-function="share"]', function (e) {
                    clearTimeout(hover_timer);

                    menu.show_share_menu(this);
                })
                .on('mouseleave', '[data-function="share"]', function (e) {
                    hover_timer = setTimeout(function () {
                        menu.hide_share_menu();
                    }, 200);
                })
                .on('click', '[data-function="share"]', function (e) {
                    e.preventDefault();
                    menu.show_share_menu(this);
                })
                .on('click', '[data-function="share_enter"]', function (e) {
                    e.preventDefault();
                    var node = me.get_file_by_$el(this);

                    me._get_share_enter(function (share_enter) {
                        share_enter.start_share(node);
                    });
                });


            var share_menu = menu.get_share_menu();
            me.listenTo(share_menu, {
                mouseenter: function () {
                    clearTimeout(hover_timer);
                },
                mouseleave: function () {
                    hover_timer = setTimeout(function () {
                        menu.hide_share_menu();
                    }, 200);
                },
                // 菜单显示时给item标记
                show_on: function (el) {
                    this.mark_menu_on(el);
                },
                // 菜单 隐藏时去掉标记
                hide: function () {
                    this.clear_menu_mark();
                }
            });
        },

        _watch_render_tree: function () {
            if (tree_view) return;

            var me = this,
                root_dir = file_list.get_root_node();

            var init = function () {
                // 如果侧边栏在初始化时就已经打开，则立即初始化树
                if (view_switch.is_sidebar_view()) {
                    me._render_tree(root_dir);
                    me._update_tree_visible();
                }

                // 监听view_switch
                me.listenTo(view_switch, 'sidebar_view_change', function (active) {
                    if (active && !tree_view)
                        me._render_tree(root_dir);
                    me._update_tree_visible();
                });
            }

            if (root_dir) {
                init();
            } else {
                this.listenTo(file_list, 'init_root', function (sup_node, root_node) {
                    root_dir = root_node;
                    init();
                });
            }
        },

        /**
         * 更新树显示状态
         * @param {Boolean} [from_root] 是否从根目录加载，默认 false
         * @private
         */
        _update_tree_visible: function (from_root) {
            var me = this;
            from_root = typeof from_root === 'boolean' ? from_root : false;

            var visible = file_list.is_activated() && view_switch.is_sidebar_view();

            if (!tree_view) return;
            visible ? tree_view.show() : tree_view.hide();
            disk_ui.toggle_sidebar(visible);

            // 显示树时重新加载
            if (visible) {
                // 目录路径
                var root_node = file_list.get_root_node(),
                    path_ids = [];

                // 尝试获取当前目录的路囧
                if (root_node && !from_root) {
                    var super_id = root_node.get_pid();
                    var cur_node = file_list.get_cur_node();
                    if (cur_node) {
                        // 计算网盘文件列表路径（排除 super 节点）
                        path_ids = $.map(cur_node.get_path_nodes(), function (node) {
                            return node.get_id() != super_id ? node.get_id() : null;
                        });
                    }
                }

                if (!path_ids.length) {
                    tree.root.load();
                    return;
                }
                tree.update(path_ids).done(function () {
                    me._focus_dir_node(cur_node);
                });
            }
        },

        _focus_dir_node: function (node) {
            var tree_node = tree.get_node_by_id(node.get_id());
            if (tree_node && tree_view.is_visible()) {
                tree_view.select_silent(tree_node);
                tree_view.ensure_visible(tree_node);
            }
        },

        _render_tree: function (root_dir) {

            if (tree_view) return;
            if (!root_dir) return;

            var Tree = require('./file_list.tree.Tree'),
                TreeNode = require('./file_list.tree.TreeNode'),
                TreeView = require('./file_list.tree.TreeView');


            var root_dir = file_list.get_root_node();
            var root_node = new TreeNode({
                id: root_dir.get_id(),
                name: root_dir.get_name(),
                expanded: true
            });
            tree = new Tree({
                root: root_node
            });
            tree_view = new TreeView({
                tree: tree,
                $el: this._get_$tree()
            });

            // ===== 事件绑定 ==========================

            // 点击树节点后，显示对应的目录文件列表
            this.listenTo(tree_view, 'node_selected', function (node) {
                var path_nodes = $.map(node.get_path_nodes(), function (node) {
                    return {
                        id: node.get_id(),
                        name: node.get_name(),
                        is_vir_dir: node.is_vir_dir(),
                        is_dir: true
                    };
                });

                file_list.load_by_path(path_nodes, true);
            });

            // 启动网盘的框选后，刷新树的丢放状态
            selection && this.listenTo(selection, 'drag_start', function (files) {
                tree_view.is_visible() && tree_view.refresh_drop(files);
            });

            // 丢放后，移动文件
            this.listenTo(tree_view, {
                'drop_files': function (node, files) {
                    var is_on_root = node === root_node,
                        pid = is_on_root ? file_list.get_root_node().get_pid() : node.parent_node.get_id();

                    move.start_move(files, pid, node.get_id());
                    user_log('DISK_DRAG_TO_TREE');
                },
                'drop_files_error': function (msg) {
                    mini_tip.warn(msg);
                }
            });

            // ===== 事件结束 ==========================

            // ===== 一些同步 ==========================

            // 新建文件夹后，同步到树
            this.on('after_dir_created', function (file) {
                var pdir_id = file.get_pid(),

                    exists_p_node = tree.get_node_by_id(pdir_id);

                // 如果目标父节点已经 load，则需要在目标父节点下新建一个子节点
                if (exists_p_node) {
                    exists_p_node.insert_child(new TreeNode({
                        id: file.get_id(),
                        name: file.get_name(),
                        leaf: true
                    }));
                    exists_p_node.expand();
                }
            });

            // 重命名文件夹后，同步到树
            this.on('after_file_renamed', function (file) {
                if (!file.is_dir()) return;

                var node = tree.get_node_by_id(file.get_id());
                if (node) {
                    node.set_name(file.get_name());
                }
            });

            // 删除文件夹后，同步到树
            this.listenTo(file_list, 'after_nodes_removed', function (files) {
                $.each(files, function (i, file) {
                    var node = tree.get_node_by_id(file.get_id());
                    if (node) {
                        node.remove();
                    }
                });
            });

            // 移动文件夹后，同步
            this.listenTo(file_list, 'after_nodes_moved', function (files, dir_id) {
                var target_node = tree.get_node_by_id(dir_id);
                if (target_node) {
                    $.each(files, function (i, file) {
                        var node = tree.get_node_by_id(file.get_id());
                        if (node) {
                            target_node.insert_child(node);
                        }
                    });
                }
            });

            // 点击目录时，同步选中目录树上对应的节点（静默选中，不触发同步行为）
            this.listenTo(file_list, 'before_load', function (node/*, last_node, reset_ui*/) {
                this._focus_dir_node(node);
            });
            // ===== 同步结束 ==========================


            // TODO 定位到当前所在目录 file_list.get_cur_node()
//            window.tree_view1 = tree_view;
//            window.tree1 = tree;
        },

        _get_$tree: function () {
            return disk_ui.get_$sidebar();
        },

        /**
         * 图片预览（重写 FileListUIModule 的默认实现）
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        preview_image: function (file) {
            var me = this;

            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader'),
                // 当前目录下的图片
                    images = $.grep(file.get_parent().get_kid_files(), function (file) {
                        return file.is_image() && !file.is_broken_file();
                    });

                // 当前图片所在的索引位置
                var index = $.inArray(file, images);

                image_preview.start({
                    total: images.length,
                    index: index,
                    images: images,
                    code: function(index){
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            if(file_qrcode){
                                file_qrcode.show([file]);
                            }
                        }
                    },
                    share: function(index){
                        me._get_share_enter(function (share_enter) {
                            share_enter.start_share(images[index]);
                        });
                    },
                    download: function (index, e) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            downloader.down(file, e);
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            var remover = remove.remove_confirm([file], null, false);
                            remover && remover.on('has_ok', function (removed_files) {
                                // 从images中排除
                                var file = removed_files[0];
                                for (var i = 0, l = images.length; i < l; i++) {
                                    if (file.get_id() === images[i].get_id()) {
                                        images.splice(i, 1);
                                        break;
                                    }
                                }

                                callback();
                            });
                        } else {
                            callback();
                        }
                    }/*,
                     raw: function (index) {
                     var file = images[index];
                     return downloader.get_down_url(file, {
                     abs: 2000
                     });
                     }*/
                });

            });
        },

        // 注意：这里获取列表文件个数需要依赖 main UI 的 scroller 容器是可见的
        _update_paging_data: function () {
            if (paging_helper) {
                paging_helper.set_item_width(view_switch.is_grid_view() ? item_width_thumb : item_width_list);
                paging_helper.set_item_height(view_switch.is_grid_view() ? item_height_thumb : item_height_list);
                paging_helper.set_is_list(view_switch.is_list_view());
            }
        },

//        _refill_$items: function () {
//            this._update_paging_data();
//            if (cur_node && this.is_activated() && ui_visible) {
//                this.set_node_data(cur_node, false);
//            }
//        },

        _last_has_dirs: undefined,
        _last_has_files: undefined,
        _last_is_grid_view: undefined,

        _last_show_empty_tip: undefined,

        /**
         * 更新列表显示状态（是否显示列表子标题、是否显示文件列表、是否显示目录列表、是否显示空提示）
         * @param {Boolean|Null} [_has_dirs] 是否主观认为有目录，默认false
         * @param {Boolean|Null} [_has_files] 是否主观认为有文件，默认false
         * @param {Boolean|Null} [show_empty_tip] 是否显示空提示，默认true
         */
        _update_list_view_status: function (_has_dirs, _has_files, show_empty_tip) {
            if (!this.is_rendered()) return;

            var
                is_grid_view = view_switch.is_grid_view(),

            // 真的有目录，而不是主观认为有目录（新建文件夹时，如果没有真的文件夹，则需要假装一个有目录的情况）
                real_has_dirs = cur_node && cur_node.get_kid_dirs() && cur_node.get_kid_dirs().length > 0,
                real_has_files = cur_node && cur_node.get_kid_files() && cur_node.get_kid_files().length > 0,

                has_dirs = !!(typeof _has_dirs === 'boolean' ? _has_dirs : real_has_dirs),
                has_files = !!(typeof _has_files === 'boolean' ? _has_files : real_has_files);

            // show_empty_tip = show_empty_tip !== false;

            if (this._last_has_dirs !== has_dirs || this._last_has_files !== has_files || this._last_is_grid_view !== is_grid_view || this._last_show_empty_tip !== show_empty_tip) {

                // 如果无文件或无目录,则隐藏两者的子标题
                //this.get_$list_sub_titles().toggle(is_grid_view && has_files && has_dirs);

                // 如果无文件，则隐藏文件列表；无目录，则隐藏目录列表
                this.get_$file_list().toggle(has_dirs || has_files);

                // 如果无文件和目录,则显示空提示
                if (typeof show_empty_tip === 'boolean') {
                    var empty = !has_files && !has_dirs;
                    if (show_empty_tip !== false) {
                        disk_ui.set_is_empty(empty);
                        if(!file_list.get_cur_node().is_root()){
                            this._$no_files_tip.removeClass('sort-cloud-empty').addClass('sort-folder-empty');
                        }  else {
                            this._$no_files_tip.removeClass('sort-folder-empty').addClass('sort-cloud-empty');
                        }
                        // this.get_$no_files_tip().toggle(!has_files && !has_dirs);
                    } else {
                        disk_ui.set_is_empty(false);
                        // this.get_$no_files_tip().hide();
                    }
                }

                this._last_has_dirs = has_dirs;
                this._last_has_files = has_files;
                this._last_is_grid_view = is_grid_view;
                this._last_show_empty_tip = show_empty_tip;
            }
        },

        /**
         * 进入一些特殊目录做一些特殊的事情
         * @param {FileNode} node
         * @private
         */
        _on_enter_dir: function (node) {
            if (node.get_name() === '微云相册' && this.get_should_switch_grid()) { //第一次进来才切换
                view_switch.set_cur_view('grid', true);
                this.set_should_switch_grid(false);
            }
        },

        set_should_switch_grid: function (flag) {
            this._should_switch_grid = flag;
        },

        get_should_switch_grid: function () {
            return this._should_switch_grid;
        },

        _try_each: function (fn_names, delay) {
            var me = this,
                each = function () {
                    $.each(fn_names, function (i, fn_name) {
                        if (!constants.IS_DEBUG) {
                            try {
                                me[fn_name]();
                            } catch (e) {
                                console.error('执行 ' + fn_name + ' 失败', e.message);
                            }
                        } else {
                            me[fn_name]();
                        }
                    });
                };

            if (delay) {
                setTimeout(each, delay);
            } else {
                each();
            }
        },

        _get_share_enter: function (callback) {
            require.async('share_enter', function (mod) {
                var share_enter = mod.get('./share_enter');
                callback.call(this, share_enter);
            });
        },

        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function (selected_files_cnt) {
            selected_files_cnt = selected_files_cnt || this._get_sel_files().length;
            if (view_switch.is_grid_view() && selected_files_cnt > 1) {
                disk_ui.get_$body().removeClass('block-hover');
                return;
            }
            if (selected_files_cnt > 1) {
                disk_ui.get_$body().addClass('block-hover');
            } else {
                disk_ui.get_$body().removeClass('block-hover');
            }
        }
    });


    // 非批量模式下，才可拖拽上传
    // 虚拟目录下，不可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        var cur_node = file_list.get_cur_node();
        return cur_node.is_dir() && !cur_node.is_vir_dir();
    });

    return ui_normal;
});