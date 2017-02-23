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
        console = lib.get('./console'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
	    global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        File = common.get('./file.file_object'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        tmpl = require('./tmpl'),

        recycle_list,
        recycle_list_ui,
        scroller,
        sel_box,

        undefined;

    var selection = new Module('recycle_file_selection', {

        render: function () {
            recycle_list = require('./recycle_list.recycle_list');
            recycle_list_ui = require('./recycle_list.ui');
            scroller = main_ui.get_scroller();


            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                selected_class: 'act',
                ns: 'recycle',
                $el: recycle_list_ui.get_$list(),
                $scroller: scroller.get_$el(),
                keep_on: function ($tar) {
                    return !!$tar.closest('[data-file-check]').length || !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return !$tar.closest('[data-file-id]').length;
                },
                container_width: function () {
                    return recycle_list_ui.get_$list().width();
                }
            });
            sel_box.enable();

            // 节点移除，重新检测select条目是否改变
            this.listenTo(recycle_list, 'remove_files', function (to_remove_files) {
                this.trigger_changed(false);
            });

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var all_files = recycle_list.get_files(),
                    selected_len = 0;
                if (all_files.length) {
                    for (var i = 0, l = all_files.length; i < l; i++) {
                        var file = all_files[i],
                            el_id = recycle_list_ui.get_el_id(file.get_id()),
                            is_sel = el_id in sel_id_map,
                            is_unsel = el_id in unsel_id_map;

                        if (is_sel) {
                            file.set_selected(true);
                            selected_len++;
                        } else if (is_unsel) {
                            file.set_selected(false);
                        }
                    }
                }
                this.trigger_changed(true);

                // 框选日志上报
                if (!$.isEmptyObject(sel_id_map)) {
                    user_log('BOX_SELECTION');
                }
            });


            this
                .on('activate', function () {
                    this.enable_selection();
                })
                .on('deactivate', function () {
                    this.disable_selection();
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
         * Shift 点击选择item
         * @param start   Item Dom元素
         * @param end     Item Dom元素
         */
        shift_select:function(start, end){
            var startItem, endItem,files=new Array(),all_files;
            var i= 0, j=0;
            all_files = recycle_list.get_files();
            if(start){
                startItem = recycle_list_ui.get_file_by_$el(start);
            }else{
                startItem = all_files[0];
            }
            endItem = recycle_list_ui.get_file_by_$el(end);

            while(i<2 && j<all_files.length){
                if(all_files[j] == startItem){
                    i++;
                }
                if(all_files[j] == endItem){
                    i++;
                }
                if(i>0){
                    files.push(all_files[j]);
                }
                j++;
            }

            this.toggle_select(files,true,false);
        },


        /**
         * 选中这些文件（请尽量传入批量文件，因为执行完成后会遍历一次DOM）
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} flag 是否选中
         * @param {Boolean} [from_item_click] 是否是点击item产生
         */
        toggle_select: function (args, flag, from_item_click) {

            if (args.length) {

                var $items, files;

                // 传入的是DOM
                if (args[0] instanceof $ || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                    files = $.map($items, function ($item) {
                        return recycle_list_ui.get_file_by_$el($item);
                    });
                }
                // 传入的是文件或ID数组
                else {
                    var file_ids;
                    // 传入的是File实例数组
                    if (File.is_instance(args[0])) {
                        files = args;
                    }
                    // 传入的是ID数组
                    else if (typeof args[0] == 'string') {
                        file_ids = args;
                        files = $.map(file_ids, function (file_id) {
                            return recycle_list.get_file_by_id(file_id);
                        });
                    }
                }

                if (files && files.length) {

                    $.each(files, function (i, file) {
                        file.set_selected(flag);
                    });

                    // 同步至 SelectBox
                    var sel_el_ids = $.map(files, function (file) {
                        return recycle_list_ui.get_el_id(file.get_id());
                    });
                    sel_box.set_selected_status(sel_el_ids, flag);

                    this.trigger_changed(from_item_click);
                }
            }
        },

        set_dom_selected: function (files) {
            if (sel_box) {
                sel_box.set_dom_selected($.map(files, function (file) {
                    return recycle_list_ui.get_el_id(file.get_id());
                }), true);
            }
        },

        trigger_changed: function (trigger_check_checkall) {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            if(trigger_check_checkall) {
                this.trigger('check_checkall', sel_meta.is_all); //检查是否标记全选;
            }

            if(sel_meta.files.length === 0/* || !sel_meta.is_all*/) {
                this.trigger('cancel_checkall'); //取消全选
            }
            log_event.trigger('sel_files_len_change', sel_meta.files.length);
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
         * 清除选中
         * @param {FileNode} [p_node] 目标目录
         */
        clear: function () {
            if (sel_box) {
                sel_box.clear_selected();

                var files = recycle_list.get_files();
                if (files.length) {
                    for (var i = 0, l = files.length; i < l; i++) {
                        files[i].set_selected(false);
                    }
                }
            }
        },

        /**
         * 获取选中的文件DOM
         * @return {jQuery|HTMLElement}
         */
        get_selected_$items: function () {
            if (sel_box) {
                return $($.map(sel_box.get_selected_id_map(), function (_, el_id) {
                    return $('#' + el_id);
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
         * 获取处于选中状态文件信息
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var all_files = recycle_list.get_files(),
                meta = {
                    files: [],
                    is_all: false
                };

            if (all_files.length) {

                $.each(all_files, function (i, file) {
                    if (file.is_selected()) {
                        meta.files.push(file);
                    }
                });

                if(!recycle_list.has_more() && all_files.length == meta.files.length) {
                    // 已全选
                    meta.is_all = true;
                }
            }
            return meta;
        },


        /**
         * 判断指定的文件DOM是否已被选中
         * @param {jQuery|HTMLElement} $item
         */
        is_selected: function ($item) {
            if (sel_box) {
                return sel_box.is_selected($item);
            }
        }


    });

    return selection;
});
