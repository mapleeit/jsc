/**
 * 文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console').namespace('disk/file_list/ui'),
        collections = lib.get('./collections'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
	    ret_msgs = common.get('./ret_msgs'),
        mini_tip = common.get('./ui.mini_tip'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),

        file_path = require('./file_path.file_path'),
        view_switch = require('./view_switch.view_switch'),

        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),
        main_ui = main_mod.get('./ui'),

        file_list,
        tbar = require('./toolbar.tbar'),

        ui_map = {}, // 所有的已加载的UI模块
        cur_ui, // cur_ui 始终是 ui_virtual 或 ui_normal 其中一个

        doc = document,

        undefined;

    var ui = new Module('disk_file_list_ui', {
        hook_task:{//挂载的任务列表
            //open_offline: function(){
            //    file_list.load_offline_dir();
            //}
        },
        /**
         * 执行挂载任务
         * @param task_name
         */
        do_hook_task: function(task_name){
            if(task_name){
                if(this.hook_task[task_name]){
                    this.hook_task[task_name].call();
                    delete this.hook_task[task_name];//删除执行过的挂载任务
                }
            } else {
                for(var key in this.hook_task){
                    this.hook_task[key].call();
                }
                this.hook_task = [];//删除全部挂载任务
            }
        },
        /**
         * 控制是否显示双屏
         * @param node
         */
        toggle_dbView: function(node){
            if(node.is_offline_dir()){//离线文件会再触发一次 load 这里做个hack
                return;
            }
            var show = false;//显示刷屏
            if( this.hook_task['open_offline'] ){
                //tbar.set_disable(false);//放开其他操作变更工具条
                show = true;//隐藏双屏
            }
            main_ui.get_$ui_root().toggleClass('hide-dbview',show);
        },
        /**
         * 渲染文件列表UI
         */
        render: function ($list_to) {
            file_list = require('./file_list.file_list');

            this._$list_to = $list_to;

            this
                // 已在网盘下的非根目录时，点击左侧“网盘导航”时返回到根目录
                .listenTo(global_event, 'disk_reenter', function () {
                    var cur_node = file_list.get_cur_node();
                    if (!cur_node.is_root()) {
                        file_list.load_root(true);
                    }
                })
                .listenTo(global_event,'disk_open_offline',function(){

                    main_ui.get_$ui_root().toggleClass('hide-dbview',true);//隐藏双屏
                    tbar.toggle_toolbar('offline');//工具条提前置为 离线工具条
                    //tbar.set_disable(true);//禁止其他操作变更工具条

                    require('./file_list.offline.offline_opener').init();
                    var me = this;
                    this.hook_task.open_offline = function(){
                        // 如果已经切换走了，不要去初始化。
                        if(me.is_deactivated()){
                            return;
                        }
                        file_list.load_offline_dir();
                    };
                })
                // 开始加载后显示UI
                .listenTo(file_list, 'before_load', function (node, last_node, page, reset_ui) {
                    // 是否虚拟目录并且不是可编辑的虚拟目录
                    $(doc.body).toggleClass('module-disk-vir-dir', (node.is_vir_dir() && !node.is_offline_dir()));
                    // 是否虚拟目录并且是可编辑的虚拟目录
                    var is_offline = node.is_vir_dir() && node.is_offline_dir();
                    main_ui.get_$ui_root().toggleClass('module-offline',is_offline);
                    main_ui.get_$ui_root().toggleClass('module-disk',!is_offline);

                    this.enter_dir(node, last_node, page, reset_ui);
                })

                // 读到文件列表后插入DOM
                .listenTo(file_list, 'load', function ( /* 普通目录参数：node, new_dirs, new_files, page； 虚拟目录参数：node, offset, size, total, ... */) {
                    var node = arguments[0];
                    if (file_list.is_cur_node(node)) {   // 健壮性判断
                        var me = this, args = $.makeArray(arguments);

                        // 插入节点
                        me.set_node_data.apply(me, args);

                        // 标题
//                        if (file_list.get_root_node() === node) {
//                            doc.title = node.get_name();
//                        } else {
//                            doc.title = node.get_name() + ' - 微云';
//                        }
                        this.toggle_dbView(node);
                        me.do_hook_task('open_offline');
                    }
                })

                // before_load -> 显示loading
                .listenTo(file_list, 'before_async_load', function () {
                    widgets.loading.show();
                })

                // after_load -> 隐藏loading
                .listenTo(file_list, 'load', function () {
                    widgets.loading.hide();
                })

                // 错误提示
                .listenTo(file_list, 'error', function (msg, ret) {
		            var result_msg = ret_msgs.get(ret) || msg;
                    mini_tip.error(result_msg);
                })

                // 插入、追加节点后同步插入到DOM中
                .listenTo(file_list, 'prepend_node', function (dirs, files) {
                    if (cur_ui) {
                        cur_ui.prepend_$items(dirs, files);
                    }
                })

                .listenTo(file_list, 'append_node', function (dirs, files) {
                    if (cur_ui) {
                        cur_ui.append_$items(dirs, files, false);
                    }
                })

                .listenTo(file_list, 'add_node', function (dirs, files, index) {
                    if (cur_ui) {
                        cur_ui.insert_$items(dirs, files, index);
                    }
                })

                // 删除文件数据后更新DOM
                .listenTo(file_list, 'after_nodes_removed', function (nodes, refresh_space_info, animate) {
                    if (cur_ui) {
                        cur_ui.remove_$items(nodes, animate);
                    }
                    if (refresh_space_info) {
                        space_info.refresh();
                    }
                })

                // 移动文件数据后更新DOM
                .listenTo(file_list, 'after_nodes_moved', function (nodes) {
                    if (cur_ui) {
                        cur_ui.remove_$items(nodes, true);
                    }
                })

                // 外部插入的文件高亮（如回收站还原文件）
                .listenTo(file_list, 'external_insert_files', function (ids, msg, is_ok) {
                    // 目前只有普通UI模块(ui_normal)有高亮逻辑，先这么写着 - james 2013-7-1
                    if (ids && ids.length && ui_map['ui_normal']) {
                        ui_map['ui_normal'].set_highlight_ids(ids);
                    }

                    // 提示
                    if (msg) {
                        if (is_ok) {
                            mini_tip.ok(msg);
                        } else {
                            mini_tip.warn(msg);
                        }
                    }
                })

                // 点击路径跳转
                .listenTo(file_path, 'click_path', function (dir_id) {
                    file_list.load(dir_id, true, 0, true);
                });

            var reload = function () {
                file_list.reload(false, true, false);
            };

            // 刷新
            this.listenTo(global_event, 'disk_refresh', reload);
        },

        enter_dir: function (node, last_node, page, reset_ui) {
            page = page || 0;

            var last_ui = cur_ui;

            cur_ui = this._get_ui(node);

            // 退出之前的目录 // TODO 重置空提示
            if (last_ui && page === 0) {
                last_ui.exit_dir(node, last_node, reset_ui);
            }

            // 切换UI
            if (last_ui && last_ui !== cur_ui) {
                // last_ui.hide();
                this.toggle_ui(last_ui, false);
                last_ui.reset();
            }

            // 渲染目录（如果已渲染过，不会重复执行）
            cur_ui.render(this._get_$list_parent());

            cur_ui.activate();

            // 进入目录
            if (page === 0)
                cur_ui.enter_dir(node, last_node);

            // 显示、渲染指定的UI
            this.toggle_ui(cur_ui, true);

            // 更新路径
            file_path.update(node);

            // 显示、隐藏视图切换
            if(view_switch.toggle_ui(cur_ui.is_view_switchable())){
                // 视图切换显示出来后，高度和普通工具栏有些差别，只能恶心些地hack
                this.frame_height_changed();
            }

            // 调整头部高度
//            if (constants.UI_VER === 'WEB') {
//                global_event.trigger('page_header_height_changed');
//            }
        },

        set_node_data: function (/* ... */) {
            // 更新数据
            if (cur_ui) {
                cur_ui.set_node_data.apply(cur_ui, arguments);
            }

//            // 调整头部高度
//            if (constants.UI_VER === 'WEB') {
//                global_event.trigger('page_header_height_changed');
//            }
        },

        /**
         * 显示、隐藏文件列表
         * @param {FileListUIModule} ui
         * @param {Boolean} visible
         */
        toggle_ui: function (ui, visible) {
            visible ? ui.show() : ui.hide();
        },

        /**
         * 选中指定ID的文件元素（仅默认UI）
         * @param {Array<String>|String} file_ids
         */
        highlight_$item: function (file_ids) {
            var ui_normal = ui_map['ui_normal'];
            if (this.is_activated() && ui_normal && ui_normal === cur_ui) {
                return cur_ui.highlight_item(file_ids);
            }
            return false;
        },

        /**
         * 标记列表高度已变化
         */
        frame_height_changed: function () {
            this.trigger('frame_height_changed');
        },

        _get_ui: function (node) {
            if (!node) {
                return null;
            }

            var ui, ui_name;
            if (node.is_vir_dir()) {
                if(node.is_offline_dir()){
                    ui_name = 'ui_offline';
                    ui = require('./file_list.ui_offline');
                } else {
                    ui_name = 'ui_virtual';
                    ui = require('./file_list.ui_virtual');
                }

            } else {
                ui_name = 'ui_normal';
                ui = require('./file_list.ui_normal');
            }

            if (!ui_map[ui_name]) {
                ui_map[ui_name] = ui;
                this.add_sub_module(ui);

                // 文件添加到DOM后，更新缓存
                this.listenTo(ui, 'add_$items', function (files) {
                    files.length && $.each(files, function (i, file) {
                        file.get_ui().set_rendered(true);
                    });
                });
                // 清空后
                this.listenTo(ui, 'clear_$items', function () {
                    var node = file_list.get_cur_node(),
                        files;
                    if (node && (files = node.get_kid_nodes())) {
                        $.each(files, function (i, file) {
                            var ui = file.get_ui();
                            ui.set_rendered(false);
                        });
                    }
                })
            }

            return ui;
        },

        _get_$list_parent: function () {
            return this._$list_to;
        }
    });


    // 非批量模式下，才可拖拽上传
    // 虚拟目录下，不可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        var cur_node = file_list.get_cur_node();
        return !!cur_node && !cur_node.is_vir_dir();
    });

    return ui;
});