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
        mini_tip = common.get('./ui.mini_tip'),
	    huatuo_speed = common.get('./huatuo_speed'),

        scroller = require('main').get('./ui').get_scroller(),
        tmpl = require('./tmpl'),
        rec_ui = require('./ui'),

        selection,
        rec_list,
        rec_header,

        scroll_listening = false, // 正在添加中

        undefined;

    var ui = new Module('rec_list_ui', {

        render: function ($list_to) {
            var me = this;

            me._$el = $(tmpl.recycle_list())/*.hide()*/.appendTo($list_to);
            me._$file_list = $('#_recycle_file_list');

            rec_list = require('./rec_list.rec_list');
            rec_header = require('./rec_header.rec_header');

            me._render_selection();
//            me._render_column_header();

            me
                // 加载列表的事件
                .listenTo(rec_list, 'load', function (offset, size, files) {
                    if (offset === 0) {
                        // 插入节点
                        me.set_$items(files);
                    } else {
                        me.add_$items(files);
                    }
                })
                .listenTo(rec_list, 'first_load_done', function () {
                })
                .listenTo(rec_list, 'before_load', function (reset_ui) {
                    if (reset_ui) {
                        me.clear_$items(true);
                    }
                    widgets.loading.show();
                })
                .listenTo(rec_list, 'after_load', function () {
                    widgets.loading.hide();
                })
                .listenTo(rec_list, 'load_error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(rec_list, 'after_refresh', function (msg) {
                    mini_tip.ok(msg);
                })
                // 清空的事件
                .listenTo(rec_list, 'clear', function (msg) {
                    mini_tip.ok('清空完成');
                    me.clear_$items();
                })
                .listenTo(rec_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(rec_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
                    // 加载下一页
                    me.add_if_need();
                })

                // 清空后，更新还原按钮上显示的数值
                .on('clear_$items', function () {
                    if (me.is_activated()) {
                        selection.clear();
                    }
                })
                // 插入节点后，刷新框选
                .on('add_$items', function () {
                    if (me.is_activated()) {
                        selection.refresh_selection();
                    }
                });

            //文件列表的还原按钮事件监听
            me.get_$list().on('click.restore_btn', '[data-action="restore"]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = rec_list.get_file_by_id(file_id);
                rec_list.restore_files(file);
            });

            // 点击选中
            me.get_$list().on('click.rec_list', '[data-file-id]', function (e) {
                e.preventDefault();
                var $item = $(this);
                var to_sel = !selection.is_selected($item);
                if (e.shiftKey) {

                   // 如果没有上次点击的记录，从起始开始
                    var start =rec_list.last_click_record ? rec_list.last_click_record : null;
                    var end = $item;
                    selection.shift_select(start,end);
                    rec_list.last_click_record = $item;
                } else {
                    selection.toggle_select($item, to_sel, true);
                    // 如果是取消选中，则取消全选
                    if (!to_sel) {
                        rec_header.checkall(false);
                    }else{
                        rec_list.last_click_record = $item;
                    }
                }

            });

            //ie6鼠标hover
            me._render_ie6_fix();
        },

        add_if_need: function () {
            if (scroller.is_reach_bottom() && rec_list.has_more()) {
                rec_list.load_next_page();
            }
        },

        /**
         * 添加文件DOM
         * @param {FileNode} files
         */
        add_$items: function (files) {
            var html = tmpl.recycle_list_item({ files: files });
            this._$file_list.append(html);

            this.trigger('add_$items', files);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 替换文件
         * @param {RecFile[]} files
         */
        set_$items: function (files) {
            files = files || [];

            this.clear_$items(true);
            this.add_$items(files);

	        //测速
	        try{
		        var flag = '21254-1-15';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        clear_$items: function (silent) {
            this._stop_listen_scroll();

            this._$file_list.empty();

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
            return this._$file_list;
        },

        get_el_id: function (file_id) {
            return '_rec_file_' + file_id;
        },

        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return rec_list.get_file_by_id(file_id);
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
            selection = require('./rec_list.selection.selection');

            selection.render();

            this.on('sorted', function () {
                selection.clear();
            });

            this.listenTo(selection, 'select_change', function (sel_meta) {
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
            if (selected_files_cnt > 1) {
                rec_ui.get_$body().addClass('block-hover');
            } else {
                rec_ui.get_$body().removeClass('block-hover');
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

    // 缩略图加载
    ui.on('activate', function () {
        var me = this;
        me.on('add_$items', function (files) {
            if (me.is_activated()) {
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
    });

    rec_ui.on('deactivate', function() {
        ui._stop_listen_scroll();
    });

    return ui;
});