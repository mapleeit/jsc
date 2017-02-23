/**
 * 批量选择文件
 * @author jameszuo
 * @date 13-1-15 上午10:42
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        events = lib.get('./events'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        disk_event = common.get('./global.global_event').namespace('disk'),
//        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),
        user_log = common.get('./user_log'),

        disk_ui = require('./ui'),
        main_ui = require('main').get('./ui'),
        scroller = main_ui.get_scroller(),

        tmpl = require('./tmpl'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),

    // main_ui = require('main').get('./ui'),

        file_list,
        get_file_list = function () {
            return file_list || (file_list = require('./file_list.file_list'));
        },
        ui_normal,
        sel_box,

    // -----------------------------

        ITEM_FILTER = '[data-file-id]',
        FILTER_QUICK_DRAG = '[data-quick-drag]',

        NO_MOVE_FILTER = '[data-no-move]',

    // --- 华丽的分割线 --------------------------------------------

        dragdrop,

        doc = document,
        get_el_by_id = function (id) {
            return doc.getElementById(id)
        },
        foolie6 = $.browser.msie && $.browser.version < 7,

        undefined;

    var selection = new Module('disk_file_selection', {
        $list: null,

        render: function () {

            get_file_list();
            ui_normal = require('./file_list.ui_normal');

            var $lists = ui_normal.get_$lists();

            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                ns: 'disk/file_list/selection',
                has_checkbox: true,
                $el: $lists,
                $scroller: scroller.get_$el(),
                all_same_size: false,
                container_width: function () {
                    var $file_list = ui_normal.get_$file_list();
                    if ($file_list.is(':visible'))
                        return $file_list.width();
                    return scroller.get_$el().width();
                },
                enable_touch_size: function () {
                    // IE6 文件节点高度是固定的 - james asked by jinfu 2013-11-8
                    return !foolie6 && ui_normal.is_thumb_view();
                },
                touch_size: !foolie6 ? function (el_id) {
                    var $item = $('#' + el_id),
                        $inner;
                    if ($item[0] && ($inner = $item.children())) {
                        return { width: $inner.width(), height: $inner.height() };
                    }
                } : null,
                keep_on: function ($tar) {
                    return !!$tar.closest('#_main_top, [data-file-check], ' + FILTER_QUICK_DRAG).length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return !$tar.closest('[data-file-id]').length;
                },
                before_start_select: function ($tar) {
                    if ($tar.is(FILTER_QUICK_DRAG))
                        return false;

                    var $item = $tar.closest(ITEM_FILTER);
                    if ($item[0]) {
                        // 直接在文件名、图标上拖拽时，
                        var file = ui_normal.get_file_by_$el($item);
                        return !!file && !file.get_ui().is_selected();
                    }
                },
                is_selectable: function (el_id) {
                    var $item = $('#' + el_id);
                    if ($item[0]) {
                        var file = ui_normal.get_file_by_$el($item);
                        return !!file && file.get_ui().is_selectable();
                    }
                }
            });
            sel_box.enable();

            // TODO 框选增量变化
            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var cur_node = get_file_list().get_cur_node(), kid_nodes;
                if (cur_node && (kid_nodes = cur_node.get_kid_nodes())) {

                    for (var i = 0, l = kid_nodes.length; i < l; i++) {
                        var file = kid_nodes[i],
                            file_ui = file.get_ui(),
                            el_id = ui_normal.get_el_id(file.get_id()),
                            is_sel = el_id in sel_id_map,
                            is_unsel = el_id in unsel_id_map;

                        if (is_sel) {
                            file_ui.set_selected(true);
                        } else if (is_unsel) {
                            file_ui.set_selected(false);
                        }
                    }
                }

                this.trigger_changed();

                // 框选日志上报
                if (!$.isEmptyObject(sel_id_map)) {
                    user_log('BOX_SELECTION');
                }
            });

	        //任务管理器打开时禁用选框
	        var oldStateIsEnabled;
	        this.listenTo(global_event, 'manage_toggle', function(state) {
		        if(sel_box) {
			        if(state === 'show') {
				        oldStateIsEnabled = sel_box.is_enabled();
				        oldStateIsEnabled && sel_box.disable();
			        } else if(state === 'hide') {
				        oldStateIsEnabled && sel_box.enable();
			        }
		        }
	        });
        },

        /**
         * 选中这些文件（请尽量传入批量文件，因为执行完成后会遍历一次DOM）
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} flag 是否选中
         * @param {Boolean} [update_ui] 是否更新UI，默认true
         */
        toggle_select: function (args, flag, update_ui) {

            if (args.length) {

                var $items, files;

                // 传入的是DOM
                if (args[0] instanceof $ || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                    files = $.map($items, function ($item) {
                        return ui_normal.get_file_by_$el($item);
                    });
                }
                // 传入的是文件或ID数组
                else {
                    var file_ids;
                    // 传入的是File实例数组
                    if (FileNode.is_instance(args[0])) {
                        files = args;
                    }
                    // 传入的是ID数组
                    else if (typeof args[0] == 'string') {
                        file_ids = args;
                        files = all_file_map.get_all(file_ids);
                    }
                }

                if (files && files.length) {

                    $.each(files, function (i, file) {
                        file.get_ui().set_selected(flag);
                    });

                    // 同步至 SelectBox
                    var sel_el_ids = $.map(files, function (file) {
                        return ui_normal.get_el_id(file.get_id());
                    });
                    sel_box.set_selected_status(sel_el_ids, flag);

                    this.trigger_changed();
                }
            }
        },

        set_dom_selected: function (files) {
            if (sel_box) {
                sel_box.set_dom_selected($.map(files, function (file) {
                    return ui_normal.get_el_id(file.get_id());
                }), true);
            }
        },

        trigger_changed: function () {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            log_event.trigger('sel_files_len_change', sel_meta.files.length);
        },

        /**
         * 获取选中状态
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var node = get_file_list().get_cur_node(),
                all_files,
                meta = {
                    files: [],
                    is_all: false
                };

            if (node && (all_files = node.get_kid_nodes())) {

                // 可选中的文件个数
                var selable_count = 0;

                // 这段代码做了2个事情：1. 计算是否已全选；2. 找出已选中的文件
                $.each(all_files, function (i, file) {
                    var file_ui = file.get_ui(),
                        selable = file_ui.is_selectable(),
                        selted = file_ui.is_selected();
                    if (selable) {
                        selable_count++;
                    }
                    if (selted) {
                        meta.files.push(file);
                    }
                });

                // 已全选
                meta.is_all = all_files.length > 0 && meta.files.length > 0 && selable_count === meta.files.length;
            }
            return meta;
        },

        /**
         * 获取一个选中的文件
         */
        get_1_sel_file: function () {
            var node = get_file_list().get_cur_node();
            return node && node.get_kid_nodes() ? collections.first(node.get_kid_nodes(), function (file) {
                return file.get_ui().is_selected();
            }) : null;
        },

        /**
         * 刷新框选
         */
        refresh_selection: function () {
            if (sel_box)
                sel_box.refresh();
        },

        /**
         * 判断是否有选中
         * @return {Boolean}
         */
        has_selected: function () {
            return sel_box && sel_box.has_selected();
        },

        /**
         * 启用框选
         */
        enable_selection: function () {
            if (sel_box)
                sel_box.enable();
        },

        /**
         * 禁用框选
         */
        disable_selection: function () {
            if (sel_box) {
                this.clear();
                sel_box.disable();
            }
        },

        /**
         * 启用拖拽
         */
        enable_dragdrop: function () {
            dragdrop.enable();
        },

        /**
         * 禁用拖拽
         */
        disable_dragdrop: function () {
            dragdrop.disable();
        },

        /**
         * 刷新可拖拽的元素状态
         * @param {jQuery|HTMLElement} $items
         */
        refresh_drag: function ($items) {
            dragdrop.refresh_drag($items);
        },

        /**
         * 刷新可丢放的元素状态
         * @param {jQuery|HTMLElement} $items
         */
        refresh_drop: function ($items) {
            dragdrop.refresh_drop($items);
        },

        /**
         * 清除选中
         * @param {FileNode} [p_node] 目标目录
         */
        clear: function (p_node) {
            if (sel_box) {
                var node = p_node || get_file_list().get_cur_node(),
                    files;

                if (!node.is_vir_dir()) {
                    sel_box.clear_selected();

                    if (node && (files = node.get_kid_nodes())) {
                        for (var i = 0, l = files.length; i < l; i++) {
                            files[i].get_ui().set_selected(false);
                        }
                    }
                }
            }
        },

        /**
         * 取消拖拽动作
         */
        cancel_drag: function () {
            dragdrop.cancel_drag();
        },

        /**
         * 获取选中的文件DOM
         * @return {jQuery|HTMLElement}
         */
        get_selected_$items: function () {
            if (sel_box) {
                return $($.map(sel_box.get_selected_id_map(), function (_, el_id) {
                    return get_el_by_id(el_id);
                }));
            } else {
                return $();
            }
        },

        /**
         * 获取选中的文件对象
         * @return {FileNode[]}
         */
        get_selected_files: function () {
            return this.get_sel_meta().files;
        },

        /**
         * 判断指定的文件DOM是否已被选中
         * @param {jQuery|HTMLElement} $item
         */
        is_selected: function ($item) {
            if (sel_box) {
                return sel_box.is_selected($item);
            }
        },

        /**
         * 选中指定文件以外的文件
         * @param {jQuery|HTMLElement}
         */
        select_but: function ($item) {
            var cur_node = get_file_list().get_cur_node();
            if (sel_box && cur_node) {
                // 需要取消选中的元素
                var to_unsel_ids = [];
                // 需要被选中的元素
                var to_sel_id_map = {}, to_sel_ids = [];
                $.each($item, function (i, item) {
                    to_sel_id_map[item.id] = 1;
                    to_sel_ids.push(item.id);
                });

                // 如果要选中的ID出现在要取消选中的ID集合中，则需从要取消的集合中移除
                for (var el_id in sel_box.get_selected_id_map()) {
                    if (!(el_id in to_sel_id_map)) {
                        to_unsel_ids.push(el_id);
                    }
                }

                sel_box.batch(function () {
                    // 先取消选中
                    sel_box.set_selected_status(to_unsel_ids, false);
                    // 再选中
                    sel_box.set_selected_status(to_sel_ids, true);
                });
            }
        },

        _get_$items: function () {
            var $items = ui_normal.get_$lists().children()
            return $items;
        }
    });

    selection.once('render', function () {
        dragdrop = {

            _enabled: false,

            enable: function () {
                var me = this;

                if (me._enabled) {
                    return;
                }


                me.refresh(selection._get_$items());

                // 选中状态改变后，刷新 dragdrop
                me.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                    var items = [];
                    for (var el_id in sel_id_map) {
                        var item = get_el_by_id(el_id);
                        if (item)
                            items.push(item);
                    }
                    for (var el_id in unsel_id_map) {
                        var item = get_el_by_id(el_id);
                        if (item)
                            items.push(item);
                    }
                    me.refresh($(items));
                });

                me._enabled = true;
            },

            disable: function () {
                if (this._enabled) {
                    this._destroy(selection._get_$items());

                    this.stopListening(selection, 'select_change');

                    this._enabled = false;
                }
            },

            /**
             * 刷新拖拽状态
             * @param {jQuery} $items
             */
            refresh: function ($items) {
                var me = this;

                // 可拖拽的节点
                me.refresh_drag($items);

                // 可丢放的节点
                me.refresh_drop($items.filter(function (i, item) {
                    var file_id = item.getAttribute('data-file-id'),
                        file_node = all_file_map.get(file_id);
                    return file_node && file_node.is_droppable();
                }));
            },

            /**
             * 更新元素的可拖拽状态
             * @param $items
             */
            refresh_drag: function ($items) {
                if (!$items || !$items.length) {
                    return;
                }

                var me = this;

                require.async('jquery_ui', function () {
                    var $dbview_ct = $('#_disk_sidebar');
                    $items.each(function (i, item) {
                        var $item = $(item),
                            is_selected = selection.is_selected($item),
                            handle = is_selected ? ITEM_FILTER : FILTER_QUICK_DRAG;

                        if ($item.data('data-draggable-handle') != handle) {

                            // console.log($item[0], handle);
                            if ($item.data('draggable')) {
                                $item.draggable('option', 'handle', handle);
                            } else {
                                $item.draggable({
                                    scope: 'move_file',
                                    handle: handle,
                                    scroll: false, // 不自动滚动
                                    // 要监听以下非直属容器的滚动，以便刷新droppable坐标缓存
                                    scrollingHooks : $dbview_ct,
                                    // cursor:'move',
                                    cursorAt: { top: -15, left: -15 },
                                    distance: 20,
                                    appendTo: 'body',
                                    helper: function (e) {
                                        return $('<div id="_disk_ls_dd_helper" class="drag-helper mod-draggable"/>');
                                    },
                                    start: $.proxy(me._on_drag_start, me),
                                    stop: $.proxy(me._on_drag_stop, me)
                                });
                            }

                            $item.data('data-draggable-handle', handle);
                        }
                    });
                });
            },

            refresh_drop: function ($items) {
                if (!$items || !$items.length) {
                    return;
                }

                var me = this;
                var options = {
                    scope: 'move_file',
                    tolerance: 'pointer',
                    //                            accept: '.ui-item',
                    hoverClass: 'dragged-to',

                    drop: function (e, ui) {
                        // 如果当前处于主动中止drop流程中，不触发drop
                        if(me._canceling){
                            return false;
                        }
                        var $item = $(e.target);
                        // 如果当前节点不可见，不触发drop（比如滚动条向下拉，移到banner上jqueryui仍会触发不可见的目录的drop）
                        // 见jqueryui bug：http://bugs.jqueryui.com/ticket/8477
                        var $dom = $item,
                            width = $dom.width(),
                            height = $dom.height(),
                            $parent, position, x = 0, y = 0;
                        // 从offsetParent遍历，保证每个带overflow的容器都是的确有显示出该目录，即它是可见的。
                        while(($parent = $dom.offsetParent()) && !$parent.is($dom)){
                            position = $dom.position();
                            x += position.left;
                            y += position.top;
                            
                            // 如果完全不在视界内，拦截drop
                            if(x+width<0 || x>$parent.width()){
                                return false;
                            }
                            if(y+height<0 || y>$parent.height()){
                                return false;
                            }
                            
                            $dom = $parent;
                        }
                        
                        // 如果目标节点已被选中，则不允许丢放
                        if (!selection.is_selected($item)) {

                            var $target_item = ui_normal.get_$item($item),
                                target_dir_id = $target_item.attr('data-file-id');

                            disk_event.trigger('drag_and_drop_files_to', target_dir_id);
                            user_log('DISK_DRAG_DIR'); //拖拽item到其他目录
                            return true;
                        }

                        user_log('DISK_DRAG_RELEASE'); //拖拽item后放手
                        return false;
                    }
                };


                require.async('jquery_ui', function () {
                    $items.droppable(options);
                });
            },

            _on_drag_start: function (e, ui) {
                // TODO 检查是否需要这个判断 - james
//                var oe = e.originalEvent.originalEvent;
//                if ($(oe.target || oe.srcElement).is('[data-function]')) {
//                    return false;
//                }

                // selection.cancel_select();

                var $target_el = $(e.originalEvent.target),
                    $curr_item = ui_normal.get_$item($target_el);

                // 有的文件不允许拖拽
                if ($curr_item.is(NO_MOVE_FILTER)) {
                    return false;
                }

                // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
                var quick_drag = $target_el.closest(FILTER_QUICK_DRAG).length;
                if (quick_drag && !selection.is_selected($curr_item)) {
                    //清除非当前文件的选中
                    selection.select_but($curr_item);

                    // TODO 检查是否需要这个判断 - james
//                    // fix bug
//                    $(document).one('mouseup blur', function () {
//                        selectable.select_item($curr_item, true, true);
//                    });
                }

                // 修复拖拽下载时只能下载可见文件的bug - james
                var files = dragdrop._get_draggable_files();
                if (!files.length) {
                    return false;
                }

                // before_drag 事件返回false时终止拖拽
                var ret_val = selection.trigger('before_drag_files', files);
                if (ret_val === false) {
                    return false;
                }

                selection.trigger('drag_start', files);

                // helper
                ui.helper.html(tmpl.dragging_cursor({ files: files }));
            },

            _on_drag_stop: function () {
                selection.trigger('stop_drag');
            },

            /**
             * 获取可拖拽的文件 | 修复拖拽下载时只能下载可见文件的bug - james
             * @return {FileNode[]} draggable_files
             * @private
             */
            _get_draggable_files: function () {
                var node = get_file_list().get_cur_node();
                if (!node || !node.get_kid_nodes()) {
                    return $();
                }

                var draggable_files = [], no_drag_files = [];


                $.each(selection.get_sel_meta().files, function (i, file) {
                    var draggable = file.is_draggable();
                    if (draggable) {
                        draggable_files.push(file);
                    } else {
                        no_drag_files.push(file);
                    }
                });

                if (no_drag_files.length) {
                    selection.toggle_select(no_drag_files, false);
                }

                return draggable_files;
            },

            /**
             * 销毁 Drag & Drop
             */
            _destroy: function ($items) {
                $items.each(function (i, item) {
                    var $item = $(item),
                        data = $item.data();

                    if (data['draggable']) {
                        $item.draggable('destroy').removeData('data-draggable-handle');
                    }
                    if (data['droppable']) {
                        $item.droppable('destroy');
                    }
                });
            },

            _get_drag_helper: function () {
                return $('#_disk_ls_dd_helper');
            },

            cancel_drag: function () {

                var $helper = this._get_drag_helper();
                if ($helper[0]) {
                    $helper.remove();
                }

                // 主动中止dropping
                this._canceling = true;
                $(document, document.body).trigger('mouseup'); // 修复jQueryUI draggable 的bug
                this._canceling = false;

                //this.refresh(selection.get_selected_$items());
            }
        };
        $.extend(dragdrop, events);
    });

    return selection;
});
