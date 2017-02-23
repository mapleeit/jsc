/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        photo_time_event = common.get('./global.global_event').namespace('photo_time_event'),
        progress = common.get('./ui.progress'),
        SelectBox = common.get('./ui.SelectBox'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),

        scroller = require('main').get('./ui').get_scroller(),

        downloader = $.noop,

        tmpl = require('./tmpl'),
        Select = require('./time.Select'),
        menu = require('./time.menu'),
        store,
        PADDING_LEFT = 146,
        LINE_HEIGHT = 0 ,
        IMG_THUMB_SIZE = '128*128',
        IMG_PREVIEW_SIZE = '1024*1024',
        item_class = 'photo-view-list',
        item_selected_class = 'photo-view-list-selected',
        cell_id_prefix = 'time_',
        row_id_prefix = 'day_id_',

        jquery_ui,
        drag_files,
        Remover = require('./Remover'),

        undefined;

    require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
    });
    
    Select.cell_id_prefix = cell_id_prefix;

    var View = new Module('photo_time_view', {});

    //私有方法
    $.extend(View, {
        /**
         * 获取文件对象
         * @param {String} file_id
         * @returns {*}
         */
        get_node: function (file_id) {
            return this.get_store().get_node_by_id(file_id);
        },
        /**
         * 是否可以继续加载数据
         * @returns {boolean}
         */
        is_able_load: function () {
            if (this.get_store().is_all_show() || this.get_store().is_loading()) {
                return false;
            }
            return true;
        },
        /**
         * 获取jQuery元素 按文件id
         * @param file_id
         * @returns {*|jQuery|HTMLElement}
         */
        get_$item_by_id: function (file_id) {
            return $('#' + cell_id_prefix + file_id);
        },
        /**
         * 获取元素对象的Node
         * @param el
         * @returns {*}
         */
        get_file_by_el: function (el) {
            return this.get_store().get_node_by_id(this.get_$item_id(el));
        },
        /**
         * 获取元素对应的$Dom对象
         * @param el
         * @returns {*|jQuery}
         */
        get_$item: function (el) {
            return $(el).closest('[data-file-id]');
        },
        /**
         * 获取元素的对应的file_id
         * @param el
         * @returns {String}
         */
        get_$item_id: function (el) {
            return this.get_$item(el).attr('data-file-id');
        },
        /**
         * @returns {store}
         */
        get_store: function () {
            return store || (store = require('./time.store'));
        },
        /**
         * 计算出符合阅读的文件名
         * @param {String} file_name
         * @returns {String} name
         */
        get_realable_name: function (file_name) {
            var append_str = file_name.slice(file_name.length - 6),
                cut_len = 16;
            file_name = text.smart_sub(file_name.slice(0, file_name.length - 6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            return file_name;
        },
        /**
         * 事件触发
         */
        trigger_event: function () {
            var event = Array.prototype.shift.call(arguments);
            this.trigger('change', event, arguments);
        },
        /**
         * 返回时间戳的页面主体框架； 开启事件监控
         * @returns {jQuery} $body
         */
        get_$body: function () {
            var me = this;
            if (me._$body) {
                return me._$body;
            }
            me.get_$main().append(tmpl.time_body());
            me._$body = $('#photo-time-view');
            Select.render(me._$body);
            me._start_listen();
            return me._$body;
        },
        get_$els: function () {
            return View.get_$body().children();
        },
        /**
         * 返回相册主题框架
         * @returns {jQuery}
         */
        get_$main: function () {
            return this.$main_box || {};
        },
        /**
         * 节点坐标地图
         */
        get_axis_map: function () {
            var me = this;
            if (!me.axis_map) {
                me.axis_map = require('./axisMap').get_instance({
                    ns: 'photo_times',
                    get_$els: me.get_$els,
                    $scroller: scroller.get_$el(),
                    child_filter: '.' + item_class,
                    //$static_position: me.get_$body(),
                    container_width: function () {
                        return me.get_$els().eq(0).width();
                    }
                });
            }
            return me.axis_map;
        },
        /**
         * 加载html
         */
        load_html: function () {
            var me = this;
            var group_nodes = me.get_store().get_more(
                (me.get_$main().width() - PADDING_LEFT),
                (LINE_HEIGHT = me.get_$main().height()), 140, 15);
            //构造html
            $.each(group_nodes, function (i, group) {
                if (group.is_dirty()) {
                    $('#day_id_' + group.get_day_id()).remove();
                    group.set_dirty(false);
                }
                me.get_$body().append(tmpl.time_row(group));
                me.update_thumb(group);
            });

            if (group_nodes.length > 0) {
                me.refresh_SelectBox();
            }
            me.get_axis_map().re_paint();

            //测速
	        try{
		        var flag = '21254-1-10';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        update_thumb: function(group) {
            var me = this;

            $.each(group.get_array(), function(i, node) {
                var thumb_state_attr = 'data-thumb-hooked';

                var $item = $('#' + cell_id_prefix + node.get_id());

                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    me.thumb_loader.get(node.get_pid(), node.get_id(), node.get_name(), node.get_thumb_url()).done(function(url, img){
                        var $img = $(img), $replace_img;
                        if(!$img.data('used')){
                            $img.data('used', true);
                            $replace_img = $img;
                        }else{
                            $replace_img = $('<img />').attr('src', url);
                        }
                        $replace_img.attr({
                            'unselectable': 'on'
                        });

                        $item.find('a')
                             .removeClass('photo-view-loading')
                             .prepend($replace_img);
                    });
                    }
            });
        },
        /**
         * 刷新框选
         */
        refresh_SelectBox: function () {
            Select.clear();
            if (this.sel_box) {
                this.sel_box.refresh();
            }
        },
        get_time_height: function () {
            return $('#photo-time-view').height();
        }
    });

    //处理用户手动触发事件
    $.extend(View, {
        /**
         * appbox全屏预览
         * @param node
         * @param url_hander
         * @returns {*}
         */
        appbox_preview: function (node, url_hander) {
            var ex = window.external,
                def = $.Deferred(),
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
                        (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
                    );
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        mod.get('./full_screen_preview').preview(node);
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },
        /**
         * web 预览
         * @param node
         * @param url_handler
         */
        web_preview: function (node, url_handler) {
            var me = this;
            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    images = me.get_store().get_all_unique_nodes(),
                    index = $.inArray(node, images);// 当前图片所在的索引位置

                image_preview.start({
                    complete: me.get_store().is_all_show(),
                    load_more: function (callback) {
                        me.get_store().thumb_load_more(function (ret) {
                            if (!ret.fail) {
                                images = me.get_store().get_all_unique_nodes();
                                callback.call(null, ret);
                            } else {
                                callback.call(null, ret);
                            }
                        });
                    },
                    total: images.length,
                    index: index,
                    images: images,
                    code: function (index) {
                        var file = images[index];
                        if (file) {
                            me.qrcode_file(file);
                        }
                    },
                    share: function (index) {
                        var file = images[index];
                        if (file) {
                            me.link_share(file);
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        if (file) {
                            me.download_files(file, e);
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function (success) {
                            if (success) {
                                images.splice(index, 1);
                            }
                            callback();
                        }, me);
                    }
                });
            });
        },
        /**
         * 文件预览
         * @param e
         */
        preview_image: function (e) {
            e.preventDefault();
            if (!ie_click_hacker.is_click_event(e)) {
                return;
            }
            var me = View,
                node = me.get_file_by_el(this);
            me.appbox_preview(node,function () {
                return this.get_down_url();
            }).fail(function () {
                    me.web_preview(node, function (size) {
                        return this.get_preview_url(size || IMG_PREVIEW_SIZE);
                    });
                });

        },
        /**
         * 勾选文件
         * @param e
         */
        select_file: function (e) {
            e.stopPropagation();
            var me = View,
                file = me.get_file_by_el(this);
            Select[ file.toggle_check() ? 'select' : 'un_select'](me.get_$item(this), file.get_id());
        },
        /**
         * 文件下载
         */
        download_files: function (file, e) {
            var item = file;
            if (!item) {
                if (Select.get_selected_nodes().length) {
                    item = Select.get_selected_nodes()[0];
                }
            }
            if (item) {
                downloader.down(item, e);
            }
        },
        /**
         * 文件二维码
         */
        qrcode_file: function (file) {
            if (!file) {
                if (Select.get_selected_nodes().length) {
                    require('file_qrcode').get('./file_qrcode').show(Select.get_selected_nodes())
                }
            } else {
                require('file_qrcode').get('./file_qrcode').show([file]);
            }
        },
        /**
         * 跳转到具体路径
         */
        jump: function(file) {
            if (!file) {
                if (Select.get_selected_nodes().length == 1) {
                    var files = Select.get_selected_nodes();
                    require('jump_path').get('./jump_path').jump(files[0]);
                }
            } else{
                require('jump_path').get('./jump_path').jump(file);
            }
        },

        when_remover_ready: function () {
            var def = $.Deferred(),
                me = this,
                remover = me.remover;

            if (remover) {
                def.resolve(remover);
            } else {
                require.async('disk', function (disk) {
                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
                    remover.render();
                    def.resolve(remover);
                });
            }
            return def;
        },
        get_delete_params: function (first_file_name, count) {
            return {
                title: '删除图片',
                up_msg: count > 1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？'
            };
        },
        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete: function(nodes, callback, scope) {
            var remover = this.get_remover(),
                me = this;

            nodes = [].concat(nodes);
            var all_nodes = [],
                store = this.get_store(),
                del_nodes_map = {},
                tip_same_num = 0,
                many_node_has_same = 0;
            $.each(nodes, function(i, node) {
                var group = store.get_group_by_node(node),
                    node_file_sha = node.get_file_sha(),
                    same_nodes = group.get_same_nodes_by_sha(node_file_sha);
                all_nodes = all_nodes.concat(same_nodes);
                del_nodes_map[node_file_sha] = same_nodes.length;
                many_node_has_same++;
                if(same_nodes.length > 1) {
                    tip_same_num = same_nodes.length;
                }

            });
            var desc = all_nodes.length > 1 ? many_node_has_same > 1 ? '确定要删除这些图片吗？' : '共有' +tip_same_num+'张相同图片，确定全部删除吗？' : '确定要删除这张图片吗？';
            remover.remove_confirm(all_nodes, desc).done(function(success_nodes, failure_nodes) {
                me.get_store().remove_data(success_nodes);
                if (callback) {
                    callback.call(scope, true);
                }

                var should_reflash = false;
                if(failure_nodes.length) {
                    $.each(failure_nodes, function(i, node) {
                        if(del_nodes_map[node.get_file_sha()] > 1) { //如果有部分节点删除失败，且失败的节点有相同的照片，则进行页面刷新处理，重新拉数据渲染
                            should_reflash = true;
                            return false;
                        }
                    });
                    should_reflash && store.render(true);//刷新操作
                }
            });
        },
        /*do_delete: function (nodes, callback, scope) {
            var me = this;
            nodes = [].concat(nodes);
            var delete_nodes_len,
                all_nodes = [],
                store = this.get_store(),
                del_nodes_map = {},
                tip_same_num = 0,
                many_node_has_same = 0;
            $.each(nodes, function(i, node) {
                var group = store.get_group_by_node(node),
                    node_file_sha = node.get_file_sha(),
                    same_nodes = group.get_same_nodes_by_sha(node_file_sha);
                all_nodes = all_nodes.concat(same_nodes);
                del_nodes_map[node_file_sha] = same_nodes.length;
                many_node_has_same++;
                if(same_nodes.length > 1) {
                    tip_same_num = same_nodes.length;
                }

            });
            delete_nodes_len = all_nodes.length;
            widgets.confirm(
                '删除图片',

                '已删除的图片可以在回收站找到',
                function () {
                    progress.show("正在删除0/" + delete_nodes_len);
                    requestor.step_delete_photos(all_nodes).progress(function (success_nodes, failure_nodes) {
                        progress.show("正在删除" + success_nodes.length + "/" + delete_nodes_len);
                    }).done(function (success_nodes, failure_nodes) {
                            me.get_store().remove_data(success_nodes);
//                        ds_event.trigger('remove', success_nodes, {
//                            src : me.store
//                        });
                            if (failure_nodes.length) {
                                mini_tip.warn('部分图片删除失败');
                            } else {
                                mini_tip.ok('删除图片成功');
                            }
                            if (callback) {
                                callback.call(scope, true);
                            }

                            var should_reflash = false;
                            if(failure_nodes.length) {
                                $.each(failure_nodes, function(i, node) {
                                   if(del_nodes_map[node.get_file_sha()] > 1) { //如果有部分节点删除失败，且失败的节点有相同的照片，则进行页面刷新处理，重新拉数据渲染
                                       should_reflash = true;
                                       return false;
                                   }
                                });
                                should_reflash && store.render(true);//刷新操作
                            }
                        }).fail(function (msg) {
                            if (msg !== requestor.canceled) {
                                mini_tip.error(msg);
                            }
                        }).always(function () {
                            progress.hide();
                        });
                },
                $.noop,
                null,
                true
            );
//            this.when_remover_ready().done(function(remover){
//                var remove_worker = me.remover.remove_confirm(nodes, null, false, undefined, undefined, me.get_delete_params);
//                remove_worker.on('has_ok', function (removed_file_ids) {
//                    me.get_store().remove_data(nodes);
//                    if(callback){
//                        callback.call(scope, true);
//                    }
//                });
//            });
        },*/
        /**
         * 删除文件
         */
        remove_files: function () {
            var me = View,
                files = Select.get_selected_nodes(),
                len = files.length;
            if (len > 0) {
                me.do_delete(files);
            } else {
                mini_tip.warn('请选择图片');
            }
        },
        /**
         * 链接分享
         */
        link_share: function (file) {
            if (file) {
                require.async('share_enter', function (share_enter) {
                    share_enter.get('./share_enter').start_share(file);
                });
            } else {
                var files = Select.get_selected_nodes();
                if (files.length) {
                    require.async('share_enter', function (share_enter) {
                        share_enter.get('./share_enter').start_share(files[0]);
                    });
                }
            }
        },
        /**
         * 右键监听
         * @param e
         */
        right_mouse: function (e) {
            if (e.which !== 3 && e.which !== 0) {
                return;
            }
            e.stopImmediatePropagation();
            if (e.handleObj.type === 'contextmenu') {
                e.preventDefault();
            }
            var me = View,
                $on_item = me.get_$item(this),
                file_id = me.get_$item_id(this);
            if (!Select.is_selected(file_id)) {
                Select.unselected_but(file_id);//清除其他选中，并选中自己
            }
            menu.show_photo_time_menu(e.pageX, e.pageY, $on_item);//显示右键菜单
        },
        /**
         * 调整加载顺序
         * @param [repaint] {boolean}
         */
        adjust_load_order: function (repaint) {
            var me = this;
            if (me._adjust_inter) {
                clearTimeout(me._adjust_inter);
            }
            me._adjust_inter = setTimeout(function () {
                if (repaint) {
                    me.get_axis_map().re_paint();
                }
                var min_y = me.get_$main().offset().top + scroller.get_$el().scrollTop();
                var id_array = me.get_axis_map().match_range(10000000, -10000000, min_y + scroller.get_height(), min_y);
                /*$.each(id_array, function (i, id) {
                    if (!$('#' + id).data('image_ok')) {
                        img_ready.priority_sort(id.replace('time_', ''));
                        return false;
                    }
                })*/
                id_array = $.map(id_array, function(id) {
                    return id.slice(5); //去掉前面的'time_'
                });
                me.thumb_loader.set_prefer(id_array);
            }, 50);

        },
        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         */
        resize: function () {
            if (this.is_able_load() && this.get_time_height() <= this.get_$main().height()) {
                this.load_html();
            }
            this.adjust_load_order(true);
        },
        /**
         * 滚动页面时加载更多数据
         */
        scroll: function () {
            if (this.is_able_load() && scroller.is_reach_bottom()) {
                this.load_html();
                this.adjust_load_order(true);
            } else {
                this.adjust_load_order();
            }
        },
        /**
         * 工具条动作 批量删除
         */
        batch_delete: function () {
            this.remove_files();
        },
        
        /**
         * 禁用框选
         */
        disable_selection: function () {
            this.sel_box && this.sel_box.enable();
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            this.sel_box && this.sel_box.disable();
        }
    });

    //暴露的外部方法
    $.extend(View, {
        /**
         * 设置缩略图加载器
         * @param thumb_loader
         */
        set_thumb_loader: function(thumb_loader) {
            this.thumb_loader = thumb_loader;
        },
        /**
         * 开始监听
         * @private
         */
        _start_listen: function () {
            var me = this;

            me.get_$body()
                .on('click', '.photo-view-list-checkbox', this.select_file)//勾选
                .on('click.photo-view-list', '[data-file-id]', this.preview_image)//预览
                .on('mousedown.file_list_context_menu', '.photo-view-list', this.right_mouse);//右键
            me.listenTo(scroller, {
                'scroll': me.scroll,
                'resize': me.resize
            });

            this.disable_selection();
        },
        /**
         * 停止监听
         * @private
         */
        _stop_listen: function () {
            var me = this;
            me.off();
            me.stopListening(scroller);
            me.enable_selection();
        },
        /**
         * 初始化一次
         * @private
         */
        _once_render: function () {
            var me = this;
            if (me._view_rendered) {
                return;
            }
            me._view_rendered = true;
            menu.render();
            me.listenTo(photo_time_event, {
                'share_time': function () {
                    me.link_share();
                }, 'remove_time': function () {
                    me.remove_files();
                }, 'download_time': function (e) {
                    me.download_files(null, e);
                }, 'qrcode_file': function () {
                    me.qrcode_file();
                }, 'jump': function() {
                    me.jump();
                }
            });


            me.sel_box = new SelectBox({
                ns: 'photo_times',
                get_$els: me.get_$els,
                $scroller: scroller.get_$el(),
                child_filter: '.' + item_class,
                selected_class: item_selected_class,
                clear_on: function ($tar) {
                    return $tar.closest('.' + item_class).length === 0;
                },
                container_width: function () {
                    return me.get_$els().eq(0).width();
                }
            });
            Select.bind_select_box(me.sel_box);
        },
        /**
         * @param {jQuery} $to
         */
        render: function ($to) {
            var me = this;
            me.$main_box = $to;
            me._once_render();
            me.destroy();

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {

                // 如果启用拖拽，则在记录上按下时，不能框选
                //me.sel_box.on('before_box_select', function($tar){
                //    return !me.draggable || !me.get_record($tar);
                //});

                me.set_draggable(true);

                me._render_drag_files();

            }
        },

        //拖拽的支持
        draggable: false,
        draggable_key: 'photo',
        set_draggable: function (draggable) {
            this.draggable = draggable;
        },

        // ----------------------拖动-----------------
        when_draggable_ready: function () {
            var def = $.Deferred();

            if (jquery_ui) {
                def.resolve();
            } else {
                require.async('jquery_ui', function () {
                    def.resolve();
                });
            }

            return def;
        },

        update_draggable: function ($item) {
            if (!this.draggable)
                return;
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function () {

                var $items = $item ? [$item] : $('.photo-view-box').children('.photo-view-list');
                $.each($items, function () {
                    var $self = $(this);
                    if (!$self.data('has_drag')) {
                        $self.data('has_drag', true);
                        $self.draggable({
                            scope: me.draggable_key,
                            cursorAt: { bottom: -15, right: -15 },
                            distance: 20,
                            appendTo: 'body',
                            scroll: false,
                            helper: function (e) {
                                return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                            },
                            start: $.proxy(me.handle_start_drag, me),
                            stop: $.proxy(me.handle_stop_drag, me)
                        });
                    }
                });
            });
        },

        handle_start_drag: function (e, ui) {
            if (!this.draggable) {
                return false;
            }

            var $target_el = $(e.originalEvent.target),
                $curr_item = $target_el.closest('[data-file-id]'),
                curr_item_id = this.get_$item_id($curr_item);

            // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
            if (!Select.is_selected(curr_item_id)) {
                Select.unselected_but(curr_item_id);
            }

            var items = Select.get_selected_nodes();

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if (items.length > 1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files: items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag: function () {
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
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
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        },

        /**
         * 销毁时的方法
         */
        destroy: function () {
            this._adjust_inter && clearTimeout(this._adjust_inter);
            this._stop_listen();
            if (this._$body) {//移除时间轴实体层
                this._$body.parent().remove();
                this._$body = null;
            }
            this.remove_$empty();
        },
        add_$empty: function () {
            if (!this._$empty) {
                this.get_$main().append(this._$empty = $(tmpl.time_empty()));
            }
        },
        remove_$empty: function () {
            if (this._$empty) {
                this._$empty.remove();
                this._$empty = null;
            }
        }
    });

    //监听外部方法(Store)
    $.extend(View, {
        /**
         * 显示加载进度条
         */
        on_loader_loading: function () {
            widgets.loading.show();
        },
        /**
         * 数据加载成功
         * @param {boolean} is_empty 没有数据
         * @param {boolean} first_time
         * @param {boolean} refresh
         */
        on_loader_done: function (is_empty, first_time, refresh) {
            widgets.loading.hide();
            if (first_time || is_empty) {
                this.get_$body().empty();
                this.remove_$empty();
            }
            this.get_$body().parent().show();
            if (is_empty) {//没有数据
                this.get_$body().parent().hide();
                this.add_$empty();
                return;
            }
            if (refresh) {
                //mini_tip.ok('列表已更新');
            }
            this.load_html();
        },
        /**
         * 加载出错
         * @param msg
         * @param ret
         */
        on_loader_error: function (msg, ret) {
            widgets.loading.hide();
            mini_tip.error(msg);
        },
        /**
         * 删除成功
         */
        on_delete_ok: function (delete_id_map) {
            var me = this,
                store = this.get_store();
            progress.hide();
            for (var id in delete_id_map) {
                var node = store.get_node_by_id(id);
                var group = store.get_group_by_node(node);
                var $el;
                if(group && group.has_del_same_nodes(node)) { //同时间组下相同的照片已经删除完才进行DOM节点移除
                    $el = me.get_$item_by_id(id);
                    if($el.length) { // 有可能是相同的照片未显示在DOM上的
                        Select.un_select($el, id);
                        $el.remove();
                    }
                }
            }
            mini_tip.ok('删除成功');
        },
        /**
         * 删除失败
         */
        on_delete_fail: function (msg, ret) {
            progress.hide();
            mini_tip.error(msg || '删除失败');
        },
        /**
         * 删除日期组
         * @param day_ids
         */
        on_delete_time_group: function (day_ids) {
            console.debug(day_ids)
            for (var i = 0 , j = day_ids.length; i < j; i++) {
                $('#' + row_id_prefix + day_ids[i]).remove();
            }

            //全部删除，则在显示空白页
            if(!this.get_store().cache.sort_group.length) {
                this.get_$body().parent().hide();
                this.remove_$empty();
                this.add_$empty();
            }
        }
    });

    return View;
});
