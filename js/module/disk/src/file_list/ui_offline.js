/**
 * 虚拟目录UI逻辑
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        security = lib.get('./security'),
        cookie = lib.get('./cookie'),

        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        PagingHelper = common.get('./ui.paging_helper'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        functional = common.get('./util.functional'),
        global_event = common.get('./global.global_event'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip'),
        chose_directory_event = common.get('./global.global_event').namespace('chose_directory_event'),
        SelectBox = common.get('./ui.SelectBox'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        https_tool = common.get('./util.https_tool'),
        scroll_listening,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        tmpl = require('./tmpl'),

        view_switch = require('./view_switch.view_switch'),
        FileListUIAbstract = require('./file_list.ui_abstract'),
//        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),
        file_list = require('./file_list.file_list'),
        tbar = require('./toolbar.tbar'),
        chose_directory = require('./file_list.file_processor.move.chose_directory'),
        Store = require('./file_list.offline.Store'),
        disk = require('./disk'),
        disk_ui = require('./ui'),

        Select = require('./file_list.offline.Select'),
        all_checker = require('./file_path.all_checker'),
        checker_event = 'toggle_check_virtual',

        cur_node,
        thumb,
        remove,
        downloader,
        page_helper,
        scroller = main_ui.get_scroller(),

        jquery_ui,
        drag_files,

        menu,// 菜单

        $cur_view, // 当前所使用的界面（特殊界面 or 经典界面）
        $empty_tip,//离线文件空文件提示
        $all_list,
        id_prefix = '_disk_vdir_item_',
        ie6 = !-[1, ] && !('minWidth' in document.documentElement.style),
        is_visable = false, //是否显示

        cst_url_cgi = "http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg",
        last_click_item,
        undefined;

    var ui_offline = new FileListUIAbstract('disk_file_list_ui_offline', {
        /**
         * 返回对html安全的node_id
         * @param node_id
         * @returns {String}
         */
        get_html_node_id: function (node_id) {
            var id = node_id;
            id = id.replace(id_prefix,'');
            if (-1 !== id.indexOf('/')) {
                return id.replace(new RegExp('\/', 'g'), '-s-')
            }
            return id;
        },
        /**
         * 逆转html的node_id
         * @param html_node_id
         * @returns {String}
         */
        reverse_html_node_id: function (html_node_id) {
            var id = html_node_id;
            id = id.replace(id_prefix,'');
            if (-1 !== id.indexOf('-s-')) {
                return id.replace(new RegExp('-s-', 'g'), '/')
            }
            return id;
        },
        /**
         * 获取元素的对应的file_id
         * @param $el
         * @returns {String}
         */
        get_node_id: function ($el) {
            return this.reverse_html_node_id($el[0].id);
        },
        /**
         * 从dom中获取FileNode的ID
         * @param $el
         * @returns {jQuery}
         * @private
         */
        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(this.reverse_html_node_id(file_id));
        },
        /**
         * 通过FileNode ID 查询 dom节点
         * @param file_id
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        get_$item: function (file_id) {
            var me = ui_offline , ret;
            if (typeof file_id === 'string') {
                ret = $('#'+ id_prefix + me.get_html_node_id(file_id));
            }
            return ret;
        },
        /**
         * 获取选中文件
         * @return {Array<File_Node>}
         */
        get_selected_files: function(){
            return Select.get_selected_files();
        }
    });

    $.extend(ui_offline,{
        // 变更指向的目录
        enter_dir: function (node) {
            var me = this;

            cur_node = node;
            //取消全选
            all_checker.toggle_check(false);
            //切换工具栏
            disk_ui.toggle_toolbar(constants.DISK_TOOLBAR.VIRTUAL_SHOW);
            //启用框选
            me.enable_selection();
            //初始化Select
            Select.init( me.get_$item );
            //修改checker事件宿主
            all_checker.set_change_event(checker_event);
            //监听 选择目录
            me.listenTo(chose_directory_event, 'offline_done', me._save_as.batch_save_as);
            //设置模式切换的命名空间
            view_switch.set_namespace('offline');
            //监听 切换视图模式
            me.listenTo(view_switch, 'switch.offline', function () {//监控视图模式带来的 高度变化/排序变化
                if (Store.sort()) {
                    this.set_$items(Store.get_show_nodes(this._get_page_size(), false));
                }
            });
            //标识可见
            is_visable = true;
        },
        //退出时操作
        _quit_job: function () {
            if(is_visable === false)
                return;
            // 隐藏离线文件空提示
            $empty_tip.hide();
            //取消全选
            all_checker.toggle_check(false);
            // 禁用框选
            this.disable_selection();
            //修改checker事件宿主
            all_checker.set_change_event(null);
            //停止监听 选择目录
            this.stopListening(chose_directory_event);
            //停止监听 切换视图模式
            this.stopListening(view_switch, 'switch.offline');
            //停止监听 退出网盘事件
            this.stopListening(disk, 'deactivate');
            //离线Store静默销毁
            Store.silent_destroy();
            //标识不可见
            is_visable = false;

            this.trigger('offline_destroy');
        },
        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (cur_node !== new_node) {
                this._clear_$items(true);
                this._quit_job();
            }
        },
        /**
         * 离线文件数据全部拉取，本地分批显示
         * @param node
         */
        set_node_data: function (node) {
            cur_node = node;
            //取消全选
            Select.remove_all();
            all_checker.toggle_check(false);
            var files = Store.get_show_nodes(this._get_page_size());
            this._start_listen_scroll();
            this._clear_$items(true);
            /*if (Store.from_refresh) {
                mini_tip.ok('列表已更新');
            }*/
            if (0 === files) {//没有数据
                this._show_empty();
            } else {
                this.append_$items(files);
            }
            this._update_list_view_status();
            this.on_seleted_change();//初始化选择变化

        },

        show: function () {
            $cur_view.show().siblings('[data-view]').hide();//隐藏兄弟视图，将当前视图展示出来
            all_checker.show();// 显示全选按钮
        },

        hide: function () {
            $cur_view.hide();
            this._stop_listen_scroll();
        },
        /**
         * 渲染
         * @param _$list_to
         */
        render: function (_$list_to) {
            var me = this;

            me.listenTo(disk, 'deactivate', function () {//监控网盘退出
                this._quit_job();
            });

            if(me._render_once){
                return;
            }

            me._render_once = true;

            _$list_to.append(tmpl.offline_dir_file_list());// 文件列表主体

            $cur_view = _$list_to.children('[data-view=offline]');
            $all_list = $cur_view.children('[data-type=file]');
            $empty_tip = $cur_view.find('[data-action=empty-offline-empty]');

            $.each(me.once_render, function () {
                this.call(me);
            });

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {

                // 如果启用拖拽，则在记录上按下时，不能框选
                me.sel_box.on('before_box_select', function($tar){
                    return !me.draggable || !me.get_record($tar);
                });

                me.set_draggable(true);

                me._render_drag_files();

            }
        },

        //拖拽的支持
        draggable : false,
        draggable_key : 'offline',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        item_selector : 'div[data-whole-click]',

        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },

        get_record: function($tar) {
            var me = this;
            var $item = $tar.closest('[data-file-id]');
            if ($item[0]) {
                var file = me.get_file_by_$el($item);
                return file;
            }
        },

        update_draggable : function(){
            if(!this._render_once || !this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = $all_list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        handle_start_drag : function(e, ui){

            if(!this.draggable){
                return false;
            }

            var $target_el = $(e.originalEvent.target),
                $curr_item = $target_el.closest('[data-file-id]'),
                curr_item_id = this.get_node_id($curr_item);

            // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
            if (!Select.is_selected(curr_item_id)) {
                Select.unselected_but(curr_item_id);
            }

            var items = this.get_selected_files();

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if(items.length>1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
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
                                drag_files.set_offline_drag_files(files, e);
                                
                            } else {
                                //老版本appbox拖拽下载
                                //老版的就不给拖拽下载了
                                //me.download(files, e);
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        },
        /**
         * 初始化渲染仅仅渲染一次
         */
        once_render: {
            // ie6 鼠标hover效果
            _render_ie6_fix: function () {
                if (ie6) {
                    $all_list
                        .on('mouseenter', '>div', function () {
                            $(this).addClass('list-hover');
                        })
                        .on('mouseleave', '>div', function () {
                            $(this).removeClass('list-hover');
                        });
                }
            },
            /**
             * 下载模块
             */
            downloader: function () {
                require.async('downloader', function (mod) {
                    downloader = mod.get('./downloader');
                });
            },
            /**
             * IE6 fix
             */
            ie6: function () {
                $all_list
                    .on('mouseenter', '[data-file-id]', function (e) {
                        $(this).addClass('hover');
                    })
                    .on('mouseleave', '[data-file-id]', function (e) {
                        $(this).removeClass('hover');
                    });
            },
            /**
             * 渲染缩略图
             */
            thumb: function () {
                var Thumb = require('./file_list.thumb.thumb_old');
                thumb = new Thumb({
                    cgi_url: cst_url_cgi,
                    cgi_cmd: 'batch_download_virtual_file',
                    cgi_data: function (files) {
                        return {
                            pdir_key: cur_node.get_id(),
                            files: $.map(files, function (file) {
                                return {
                                    owner_type: file.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
                                    file_id: file.get_id(),
                                    file_name: file.get_name()
                                };
                            })
                        };
                    },
                    cgi_response: function (files, body) {
                        var imgs = body['files'];
                        if (imgs) {
                            if(imgs[0] && imgs[0]['dl_cookie_name']) {
                                cookie.set(imgs[0]['dl_cookie_name'], imgs[0]['dl_cookie_value'], {
                                    domain: constants.MAIN_DOMAIN,
                                    path: '/'
                                });
                            }
                            return $.map(imgs, function (img_rsp) {
                                var ret = parseInt(img_rsp['retcode']), url, file_id;
                                if (ret == 0) {
                                    if (img_rsp['download_url']) {//目前离线文件仅支持这种方式的缩略图
                                        url = img_rsp['download_url'] + '&size=128*128';
                                        url = https_tool.translate_url(url);
                                    }
                                    file_id = img_rsp['file_id'];
                                }
                                return new Thumb.ImageMeta(ret, file_id, url);
                            })
                        }
                    }
                });

                var me = this;
                me
                    // 文件列表增加文件DOM后刷新缩略图
                    .on('add_$items set_$items', function (files) {
                        thumb.push(files);
                    })

                    // 加载成功后显示图片
                    .listenTo(thumb, 'get_image_ok', function (file, img) {
                        set_image(file, img);
                    });

                var copy_attr_list = { unselectable: 1 },
                    set_image = function (file, img) {
                        if (!is_visable) {
                            return;
                        }
                        var $icon = me.get_$item(file.get_id()).find('i[data-ico]');

                        if ($icon[0] && img) {
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
            /**
             * 渲染 框选/勾选 模块
             */
            selection: function () {
                var me = this;

                me.sel_box = new SelectBox({//初始化框选
                    ns: 'offline',
                    $el: $all_list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    clear_on: function ($tar) {
                        return !$tar.closest('[data-file-id]').length;
                    },
                    container_width: function () {
                        return $all_list.width();
                    },
                    before_start_select : function($tar){
                        return this.trigger('before_box_select', $tar);
                    }
                });

                me.sel_box.on('select_change', function (sel_id_map, unsel_id_map) {//监听框选变化
                    var safe_id , db_id;
                    for (safe_id in sel_id_map) {
                        db_id = this.reverse_html_node_id(safe_id);
                        Select.select( db_id );
                    }
                    for (safe_id in unsel_id_map) {
                        db_id = this.reverse_html_node_id(safe_id);
                        Select.un_select( db_id );
                    }
                    this.on_seleted_change();
                }, me);

                me.listenTo(all_checker,checker_event, function(checked){//监听全局勾选变化
                    var me = this,files,len;
                    if(!checked){//全不选中
                        files = me.get_selected_files();
                        len = files.length;
                        while( len ){
                            len-=1;
                            Select.un_select(files[len].get_id());
                        }
                    } else {//全部选中
                        files = Store.get_all_file();
                        len = files.length;
                        while( len ){
                            len-=1;
                            Select.select(files[len].get_id());
                        }
                        user_log('OFFLINE_ITEM_CHECKALL');
                    }
                    me.on_seleted_change();
                });
            },
            /**
             * 渲染 工具栏 模块
             */
            toolbar: function () {
                this.listenTo(tbar, {
                    offline_remove: function(){//批量删除
                        this._toolbar_handler.batch_remove();
                        user_log('OFFLINE_TOOLBAR_DELETE');
                    },
                    offline_save_as: function(){//批量另存为
                        this._toolbar_handler.batch_save_as();
                        user_log('OFFLINE_TOOLBAR_SAVEAS');
                    },
                    offline_refresh: function(){//刷新
                        this._toolbar_handler.refresh();
                        user_log('OFFLINE_TOOLBAR_REFRESH');
                    }
                },this);
            },
            /**
             * 渲染 文件删除 模块
             */
            remove: function () {
                remove = require('./file_list.file_processor.remove.remove');
                remove.render();
            },
            /**
             * 渲染 选择目录 模块
             */
            directory_dialog: function () {
                chose_directory.render('offline');
            },
            /**
             * 渲染 右键菜单 功能
             */
            menu: function () {
                var me = this,
                    has_listen_menu_event;
                menu = require('./file_list.menu.menu');
                $all_list
                    .on('mousedown.file_list_context_menu', '[data-file-id]', function (e) {
                        if (e.which !== 3 && e.which !== 0) {
                            return;
                        }
                        e.stopImmediatePropagation();
                        if (e.handleObj.type === 'contextmenu') {
                            e.preventDefault();
                        }

                        var $item = $(this),
                            db_id = me.get_node_id($item);

                        if (!Select.is_selected(db_id)) {
                            Select.unselected_but(db_id);//清除其他选中，并选中自己
                        }

                        if(!has_listen_menu_event) {
                            var offline_menu = menu.get_offline_menu();
                            me
                                // 菜单显示时给item标记
                                .listenTo(offline_menu, 'show_on', function (el) {
                                    if (!view_switch.is_grid_view()) {
                                        disk_ui.get_$body().addClass('block-hover');
                                    }
                                })
                                // 菜单 隐藏时去掉标记
                                .listenTo(offline_menu, 'hide', function () {
                                    var selected_files = me.get_selected_files();
                                    if (!view_switch.is_grid_view() && (!selected_files || selected_files.length < 2)) {
                                        disk_ui.get_$body().removeClass('block-hover');
                                    }
                                });
                            has_listen_menu_event = true;
                        }

                        me.on_seleted_change();
                        menu.show_offline_menu(e.pageX, e.pageY, $item);
                    });

            },
            /**
             * 绑定 在文件行上的各种点击，执行的对应操作
             */
            enter: function () {
                var me = this,
                    is_enter_event = function (e) {
                        return !(e.ctrlKey || e.shiftKey || e.metaKey || !!$(e.target).closest('input, a, button, [data-function]')[0]); // 按下ctrl/shift点击时不打开目录、文件
                    },
                    enter_file = function (node, e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        // 如果是可预览的文档，则执行预览操作
                        if (preview_dispatcher.is_preview_doc(node)) {
                            node.down_file = function (e) {//单独的下载
                                var node = this;
                                downloader.down(node, e);
                            };
                            preview_dispatcher.preview(node);
                            user_log('ITEM_CLICK_DOC_PREVIEW');
                            return;
                        }
                        // 如果是图片，则执行预览操作
                        if (node.is_image()) {
                            me.appbox_preview(node,function () {
                                return me._get_image_preview_url(node, 1024);
                            }).fail(function () {
                                    me.preview_image(node);
                                });
                            user_log('ITEM_CLICK_IMAGE_PREVIEW');
                            return;
                        }
                        // 其他文件，下载
                        download_file(node, e);
                        user_log('OFFLINE_ITEM_DOWN');
                    },
                    download_file = function (node, e) {
                        me.download([node], e);
                    },
                //勾选
                    select_file_event = function (e) {
                        e.stopPropagation();  // 阻止默认点选行为
                        var file = me.get_file_by_$el(this);
                        if(e.shiftKey){
                            var cur_node = file_list.get_cur_node();
                            var all_files=Store.get_all_file();
                            var files=new Array();
                            if(!last_click_item){
                                last_click_item=all_files[0];
                            }else{
                                //判断上一次点击的item目录  是否是当前目录的子节点。
                                for(var i= 0;i <all_files.length;i++){
                                    if(last_click_item == all_files[i]){
                                        break;
                                    }
                                    if( i== all_files.length-1){
                                        last_click_item =all_files[0];
                                    }
                                }
                            }
                            // shift 选择；
                            var i= 0,j=0;
                            while(i<2 && j<all_files.length){
                                if(all_files[j] == last_click_item){
                                    i++;
                                }
                                if(all_files[j] == file){
                                    i++;
                                }
                                if(i>0){
                                    Select['select'](all_files[j].get_id())
                                //    all_files[j].get_ui().set_selected(true);
                                }
                                j++;
                            }
                            last_click_item =file;
                        }else{
                            if(!file.get_ui().is_selected()){
                                last_click_item = file;
                            }
                            var file_ui = file.get_ui();
                            Select[ file_ui.is_selected() ? 'un_select' : 'select' ](file.get_id());
                            user_log('OFFLINE_ITEM_CHECKBOX');
                        }
                        me.on_seleted_change();
                    },
                //另存为
                    save_as = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        me.save_as([me.get_file_by_$el(this)]);
                        user_log('OFFLINE_HOVERBAR_SAVEAS');
                    },
                //删除
                    remove = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        me._toolbar_handler.batch_remove([me.get_file_by_$el(this)]);
                        user_log('OFFLINE_HOVERBAR_DELETE');
                    },
                //点击文件、文件
                    click_file_event = function (e) {
                        e.preventDefault();

                        if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e)) {
                            return;
                        }

                        var node = me.get_file_by_$el(this);
                        enter_file(node, e);

                        user_log('OFFLINE_ITEM_CLICK');//item点击上报
                    },
                //点击下载
                    down_file_event = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        var node = me.get_file_by_$el(this);
                        download_file(node, e);

                        // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                        $(e.target).toggle().toggle();
                        user_log('OFFLINE_HOVERBAR_DOWNLOAD');
                    };


                $all_list
                    // 各种打开
                    .on('click.file_list', '[data-action="enter"]', click_file_event)
                    // 下载
                    .on('click.file_list', '[data-action=download]', down_file_event)
                    // 另存为
                    .on('click.file_list', '[data-action=saveas]', save_as)
                    // 删除
                    .on('click.file_list', '[data-action=remove]', remove)
                    // 勾选
                    .on('click.file_list_ck', '[data-file-check]', select_file_event);
            }
        }
    });

    $.extend(ui_offline,{
        /**
         * 禁用框选
         */
        disable_selection: function () {
            if(this.sel_box){
                this.sel_box.disable();
            }
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            if(this.sel_box){
                this.sel_box.enable();
            }
        },
        /**
         * 勾选状态改变时，更新工具条特征
         */
        on_seleted_change: function () {
            if (Store.get_total_length() > 0 && Select.get_selected_length() === Store.get_total_length()) {
                all_checker.toggle_check(true); // 全选w
            } else {
                all_checker.toggle_check(false); // 取消全选
            }
            this.update_offline_tbar(this.get_selected_files());

            this._block_hoverbar_if(this.get_selected_files().length);
        },
        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} files
         */
        append_$items: function (files) {
            if (files.length) {
                $all_list.append(tmpl.file_item_offline({  files: files, icon_map: this.get_icon_map() }));
                this.trigger('add_$items', files);

                this.update_draggable();
            }
        },
        /**
         * 重新添加数据
         * @param files
         */
        set_$items: function (files) {
            this._clear_$items();
            this.append_$items(files);
        },

        /**
         * 下载 （目前仅支持单个文件下载）
         * @param nodes
         */
        download: function (nodes, e) {
            if (!downloader || !nodes.length) {
                return;
            }
            if(!downloader.supported_cookie()) { //老版appbox还是用以前的吧
                var down_url = this._get_down_url(nodes[0], false);
                downloader.down_url(down_url, nodes[0].get_name(), nodes[0].get_size());
            } else {
                downloader.down(nodes, e);
            }
        },
        /**
         * 批量另存为
         * @param files
         */
        save_as: function (files) {
            chose_directory_event.trigger('show_dialog', files);
        },
        /**
         * 删除文件
         * @param {FileNode} files
         * @private
         */
        remove_file: function (files) {
            return remove.remove_confirm(files, 'offline');
        },
        /**
         * 删除文件DOM
         * @param {FileNode} file_nodes
         * @param {Boolean} animate 动画(只支持单文件)
         */
        remove_$items: function (file_nodes, animate) {
            if (!file_nodes || !file_nodes.length)
                return;
            var me = this,
                remove_id_map = {};
            if (file_nodes.length === 1) {
                remove_id_map[file_nodes[0].get_id()] = 1;
                var $dom = me.get_$item(file_nodes[0].get_id());

                $dom.animate(view_switch.is_list_view() ? {height: 1} : {width: 1}, {complete: function () {
                    $dom.remove();//dom删除
                }});
            } else {
                $.each(file_nodes, function (i, item) {
                    remove_id_map[item.get_id()] = 1;
                    var $dom = me.get_$item(item.get_id());
                    $dom.remove();//dom删除
                });
            }
            Store.remove_files(remove_id_map);
            Select.remove(remove_id_map);
            var files = Store.get_show_nodes(file_nodes.length);//追加节点
            if (files && files.length) {
                this.append_$items(files);
            }

            all_checker.toggle_check(false); // 取消全选

            this.trigger('remove_$items');
            this._update_list_view_status();

        },
        /**
         * 获取图片预览地址
         * @param node
         * @param size 图片大小
         */
        _get_image_preview_url: function (node, size) {
            var $img = this.get_$item(node.get_id()).find('img'),
                ret;
            if ($img && $img[0]) {
                ret = $img[0].src.replace(/&size=\d*\*\d*/, '') + '&size=' + (size ? (size + '*' + size) : '1024*1024');
            }
            return ret;
        },
        /**
         * 获取文件的下载地址
         * @param {FileNode} node
         * @param {Boolean} [is_preview]
         * @param {int} [down_type]
         * @returns {*}
         * @private
         */
        _get_down_url: function (node, is_preview, down_type) {
            var down_name = downloader.get_down_name(node.get_name()),
                uin = query_user.get_uin(),
                skey = query_user.get_skey();

            var header = {
                    cmd: 'download_virtual_file',
                    appid: constants.APPID,
                    proto_ver: 20130708,
                    token: security.getAntiCSRFToken(),
                    uin: uin
                },
                body = {
                    file_owner: uin,
                    owner_type: node.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
                    pdir_key: cur_node.get_id(),
                    file_id: node.get_id(),
                    file_name: encodeURIComponent(down_name),
                    abstract: (down_type || 0)//下载类型0:普通下载，1:缩略图下载，2:文档预览下载
                },
                params = {
                    data: {
                        req_header: header,
                        req_body: body
                    }
                };

            //这里简单判断是否是appbox，因为appbox有历史遗留问题，download接口支持不了cookie，uin和skey得带在url里面，by jkb
            if(constants.IS_APPBOX){
                params.uin = uin;
                params.skey = skey;
            }

            //打击盜链，by jkb
            var user = query_user.get_cached_user();
            params.checksum = user ? user.get_checksum() : '';

            // 预览时
            if (is_preview) {
                body.size = '640*640';
            }
            else {
                params.err_callback = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html';
            }
            return urls.make_url(cst_url_cgi, params);
        },
        /**
         * 预览图片
         * @param node
         */
        preview_image: function (node) {
            require.async(['image_preview'], function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    images = $.grep(node.get_parent().get_kid_files(), function (file) {// 当前目录下的图片
                        return file.is_image();
                    }),
                    index = $.inArray(node, images);// 当前图片所在的索引位置
                var get_url = function(index,options,size){
                    var file,
                        has_image = false;
                    for (var i = index + 1; i < options.total; i++) {
                        file = images[i];
                        if (file && file.is_image()) {
                            has_image = true;
                        }
                    }
                    file = images[index];
                    if (file && file.is_image() && file.is_on_tree()) {
                        return ui_offline._get_image_preview_url(file,size);
                    }
                };
                image_preview.start({
                    total: images.length,
                    index: index,
                    get_url: function (index, options) {
                        return get_url(index, options, 1024);
                    },
                    get_thumb_url: function(index,options,size){
                        return get_url(index, options, size);
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
                            var remover = ui_offline.remove_file([file]);
                            remover.on('has_ok', function (removed_files) {
                                images.splice(index, 1);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    }
                });
            });
        },
        // ====== 私有成员 =====================================================================
        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         * @private
         */
        _clear_$items: function (silent) {

            if ($all_list)
                $all_list.empty();

            if (!silent) {
                this.trigger('clear_$items');
                this._update_list_view_status();
            }
        },
        /**
         * 用户点击工具栏的处理函数
         * @private
         */
        _toolbar_handler: {
            /**
             * 批量删除
             * @param {Array} [files]
             */
            batch_remove: function (files) {
                var me = ui_offline;
                me.remove_file(files || me.get_selected_files());
            },

            /**
             * 批量另存为
             */
            batch_save_as: function () {
                var me = ui_offline;
                me.save_as(me.get_selected_files());
            },
            /**
             * 刷新
             */
            refresh: function(){
                ui_offline._clear_$items();
                $empty_tip && $empty_tip.hide();
                Select.remove_all();
                Store.render( cur_node , true );
            }
        },
        /**
         * 获取数据分页大小
         * @returns {number}
         * @private
         */
        _get_page_size: function () {
            if (!page_helper) {
                page_helper = new PagingHelper({
                    scroller: scroller
                });
            }

            var is_thumb = view_switch.is_grid_view();
            page_helper.set_item_width(is_thumb ? 120 : 0);    // 缩略图模式文件宽度为136，其他模式宽度为0(自动)
            page_helper.set_item_height(is_thumb ? 120 : 47); // 缩略图模式文件高度为136，其他模式高度为100+
            page_helper.set_is_list(!is_thumb);

            var size = Math.max(page_helper.get_line_size() * page_helper.get_line_count(true), 10); // 最少10个
            return size;
        },
        /**
         * 没有数据时，修复为空提示的高度
         * @returns {*}
         * @private
         */
        _fix_empty_height: function () {
            return scroller.get_height();
        },
        /**
         * 窗口外观改变的监听函数集合
         */
        _window_change: {
            after: {//窗口属性改变后
                empty_tip: functional.throttle(function () {
                    setTimeout(function () {
                        var t_height = ui_offline._fix_empty_height();
                        if (Store.is_empty()) {
                            $empty_tip.animate({height: t_height});
                        } else {
                            $empty_tip.css({height: t_height});
                        }
                    }, 50);
                }, 50),
                table_list: function () {
                    // 判断滚动高度
                    if (!Store.is_all_show() && scroller.is_reach_bottom()) {
                        var files = Store.get_show_nodes(ui_offline._get_page_size());
                        if (files && files.length) {
                            if (all_checker.is_checked()) {
                                $.each(files, function () {
                                    this.get_ui().set_selected(true);
                                    Select.select(this.get_id());
                                });
                            }
                            ui_offline.append_$items(files);
                        }
                    }
                }
            }
        },
        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(scroller, 'resize', function (e) {
                    var fns = this._window_change.after;
                    for (var key in fns) {
                        fns[key].call();
                    }
                });
                this.listenTo(scroller, 'scroll', function (e) {
                    this._window_change.after.table_list();
                });
                scroll_listening = true;
            }
        },
        /**
         * 终止监听滚动
         * @private
         */
        _stop_listen_scroll: function () {
            if (scroll_listening) {
                this.stopListening(scroller, 'resize scroll');
                scroll_listening = false;
            }
        },
        /**
         * 另存为对象
         * @private
         */
        _save_as: {
            /**
             * 单个另存为
             * @param node
             * @param chose_pid
             * @param chose_id
             * @param index
             * @private
             */
            _handler: function (node, chose_pid, chose_id, index) {
                progress.show(text.format(this._msg, [index]));
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                    'cmd': 'VirtualDirFileCopyFromOtherBid',
                    pb_v2: true,
                    'body': {
                        'pdir_key': node.get_pid(),
                        'src_uin': node.get_down_type() === 1 ? query_user.get_uin_num() : node.get_uin(), //down_type === 1表示发送列表，所以src_uin应该自己
                        'src_fullpath': node.get_id(),
                        'src_appid': constants.OFFLINE_SRC_APPID,
                        'dst_ppdir_key': chose_pid,
                        'dst_pdir_key': chose_id,
                        'dst_filename': node.get_name()
                    }

                }).
                    ok(function () {
                        ui_offline._save_as._ok_length += 1;
                        var target_node = all_file_map.get(chose_id);
                        // 标记目标节点为脏的
                        if (target_node) {
                            target_node.set_dirty(true);
                        }
                    }).fail(function (msg, ret) {
                        var me = ui_offline._save_as;
                        me._er_length += 1;
                        if (!me._err_info) {//只存第一条错误信息
                            me._err_info = {
                                msg: msg,
                                ret: ret
                            };
                        }
                    }).done(function () {
                        var me = ui_offline._save_as,
                            cache = me._cache;
                        if (cache.length > 0) {
                            setTimeout(function () {
                                me._handler(cache.pop(), chose_pid, chose_id, (index + 1));
                            }, 10);
                        } else {
                            progress.hide();
                            if (me._ok_length) {
                                if (me._er_length) {
                                    mini_tip.warn(me._ok_length + '个文件成功另存到微云，' + me._er_length + '个文件另存失败');
                                } else {
                                    mini_tip.ok(me._ok_length + '个文件成功另存到微云');
                                }
                            } else {
                                file_list.trigger('error', me._err_info.msg, me._err_info.ret);
                            }
                        }
                    });
            },
            /**
             * 批量另存为
             * @param files 待处理的离线文件
             * @param chose_pid 另存为的目录pid
             * @param chose_id 另存为的目录id
             * @private
             */
            batch_save_as: function (files, chose_pid, chose_id) {
                var me = this;
                me._save_as._cache = files;
                me._save_as._er_length = me._save_as._ok_length = 0;
                me._err_info = {};
                me._save_as._msg = '正在另存为{0}/' + files.length + '第个文件';
                me._save_as._handler(me._save_as._cache.pop(), chose_pid, chose_id, 1);
            }
        },
        /**
         * 显示空提示
         * @private
         */
        _show_empty: function () {
            $empty_tip.height(ui_offline._fix_empty_height()).show();
        },
        /**
         * 更新列表显示状态（是否显示空提示）
         * @private
         */
        _update_list_view_status: function () {
            if (!cur_node || !cur_node.get_kid_files() || cur_node.get_kid_files().length === 0) {
                this._show_empty();
                $all_list && $all_list.hide();
                user_log('OFFLINE_EMPTY_FILES');
            } else {
                $all_list && $all_list.show();
                $empty_tip.hide();
                user_log('OFFLINE_HAS_FILES');
            }
        },
        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                disk_ui.get_$body().addClass('block-hover');
            } else {
                disk_ui.get_$body().removeClass('block-hover');
            }
        }

    });

    return ui_offline;
});