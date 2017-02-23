/**
 * 回收站文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        routers = lib.get('./routers'),
        collections = lib.get('./collections'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        huatuo_speed = common.get('./huatuo_speed'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        scroller = main_ui.get_scroller(),

        selection,
        recycle_list,

        scroll_listening = false, // 正在添加中

        undefined;

    var ui = new Module('recycle_list_ui', {
        
        render: function ($list_to) {
            var me = this;
            recycle_list = require('./recycle_list.recycle_list'); // 这里如果放上面会有循环引用的问题

            me._$el = $(tmpl.recycle_list())/*.hide()*/.appendTo($list_to);

            me._render_selection();
            me._bind_events();
            //ie6鼠标hover
            me._render_ie6_fix();

            me
                .on('activate', function () {
                    // activate here
                })
                .on('deactivate', function () {
                    // deactivate here
                });
        },

        /**
         * 添加各种事件监听器
         * @private
         */
        _bind_events: function () {
            var me = this;

            me
            // 加载列表的事件
                .listenTo(recycle_list, 'load', function (offset, size, files) {
                    if (offset === 0) {
                        // 插入节点
                        me.set_$items(files);
                    } else {
                        me.add_$items(files);
                    }
                })
                .listenTo(recycle_list, 'first_load_done', function () {
                })
                .listenTo(recycle_list, 'before_load', function (reset_ui) {
                    if (reset_ui) {
                        me.clear_$items(true);
                    }
                    widgets.loading.show();
                })
                .listenTo(recycle_list, 'after_load', function () {
                    widgets.loading.hide();
                })
                .listenTo(recycle_list, 'load_error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(recycle_list, 'clear', function (msg) {
                    mini_tip.ok('清空完成');
                    me.clear_$items();
                })
                .listenTo(recycle_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(recycle_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
                    // 加载下一页
                    me.add_if_need();
                })


                // 清空后，清除选中状态
                .on('clear_$items', function () {
                    if (me.is_activated()) {
                        selection.clear();
                    }
                })
                // 插入节点后，刷新框选，添加缩略图
                .on('add_$items', function (files) {
                    if (me.is_activated()) {
                        selection.refresh_selection();

                        var $el;
                        $.each(files, function (i, f) {
                            var url = f.get_thumb_url();
                            if (url) {

                                // cookie
                                cookie.set(f.get_ftn_cookie_k(), f.get_ftn_cookie_v(), {
                                    domain: constants.MAIN_DOMAIN,
                                    path: '/',
                                    expires: cookie.minutes(1)
                                });

                                $el = me.get_$item(f.get_id());
                                $el.find('img').attr('src', url).one('load', function () {
                                    $(this).prev('i').hide().end().show();
                                });
                            }
                        });
                    }
                });

            //文件列表的还原按钮事件监听
            me.get_$list().on('click.restore_btn', '[data-action="restore"]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = recycle_list.get_file_by_id(file_id);
                recycle_list.restore_files(file);
            });

            //文件列表的永久删除按钮事件监听
            me.get_$list().on('click.shred_btn', '[data-action="shred"]', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = recycle_list.get_file_by_id(file_id);
                recycle_list.shred_files(file);
            });

            // 点击选中
            me.get_$list().on('click.recycle_list', '[data-file-id]', function (e) {
                e.preventDefault();
                var $item = $(this);
                var to_sel = !selection.is_selected($item);
                if (e.shiftKey) {
                    // 如果没有上次点击的记录，从起始开始
                    var start =recycle_list.last_click_record ? recycle_list.last_click_record : null;
                    var end = $item;
                    selection.shift_select(start,end);
                    recycle_list.last_click_record = $item;
                } else {
                    selection.toggle_select($item, to_sel, true);
                    recycle_list.last_click_record = $item;
                }

            });
        },

        /**
         * 滑动条到底且服务器有数据未加载完则尝试加载更多数据
         */
        add_if_need: function () {
            if (scroller.is_reach_bottom() && recycle_list.has_more()) {
                recycle_list.load_next_page();
            }
        },

        /**
         * 取消所有选择过的条目
         */
        cancel_all_selected: function () {
            selection.clear();
        },

        /**
         * 添加文件DOM
         * @param {FileNode} files
         */
        add_$items: function (files) {
            var html = tmpl.recycle_list_item({ files: files });
            this.get_$list().append(html);

            this.trigger('add_$items', files);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 清空之前的文件，重新从头开始添加节点DOM
         * @param {RecFile[]} files
         */
        set_$items: function (files) {
            files = files || [];

            this.clear_$items(true);
            this.add_$items(files);

            //测速
            //try{
                //var flag = '21254-1-15';
                //if(window.g_start_time) {
                //    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
                //    huatuo_speed.report();
                //}
            //} catch(e) {
            //
            //}
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        clear_$items: function (silent) {
            this._stop_listen_scroll();

            this.get_$list().empty();

            this.trigger('clear_$items');
        },

        /**
         * 删除文件DOM
         * @param {Array<RecFile>} files
         */
        remove_$items: function (files) {
            var
                ids = $.map(files, function (file) {
                    return file.get_id();
                }),

                $items = this.get_$items(ids),
                $item_ids = $.map($items, function (it) {
                    return it.getAttribute('id');
                });

            selection.toggle_select($items, false);
            $items.remove();

            this.trigger('removed_$items', $item_ids);
        },

        /**
         * 获取某个文件的DOM
         * @param {String} file_id
         */
        get_$item: function (file_id) {
            return $('#' + this.get_el_id(file_id));
        },

        /**
         * 获取一些文件的DOM
         * @param {Array<String>} file_ids
         */
        get_$items: function (file_ids) {
            var me = this,
                items = [];
            $.each(file_ids, function (i, id) {
                var $item = me.get_$item(id);
                $item[0] && items.push($item.get(0));
            });
            return $(items);
        },

        get_$list: function () {
            return this._$file_list || (this._$file_list = $('#_recycle_file_list'));
        },

        get_el_id: function (file_id) {
            return '_recycle_file_' + file_id;
        },

        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return recycle_list.get_file_by_id(file_id);
        },

        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(scroller, 'scroll resize', function (e) {
                    // 判断滚动高度
                    this.add_if_need();
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
                this.stopListening(scroller, 'scroll resize');
                scroll_listening = false;
            }
        },

        /**
         * 渲染选择器
         * @private
         */
        _render_selection: function () {
            var me = this;

            selection = require('./recycle_list.selection.selection');

            selection.render();

            this.on('sorted', function () {
                selection.clear();
            });

            this.listenTo(selection, 'select_change', function (sel_meta) {
                me.trigger('select_change', sel_meta);
                this._block_hoverbar_if(sel_meta.files.length);
            });

            this.add_sub_module(selection);
        },


        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function (selected_files_cnt) {
            var me = this;

            if (selected_files_cnt > 1) {
                me.trigger('add_block_hover');
            } else {
                me.trigger('remove_block_hover');
            }
        },


        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            if ($.browser.msie && $.browser.version < 7) {
                var me = this;
                me.get_$list()
                    .on('mouseenter', '>div', function () {
                        $(this).addClass('list-hover');
                    })
                    .on('mouseleave', '>div', function () {
                        $(this).removeClass('list-hover');
                    });
            }
        }

    });


    return ui;
});