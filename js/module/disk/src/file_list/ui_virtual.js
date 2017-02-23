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
        date_time = lib.get('./date_time'),
        easing = lib.get('./ui.easing'),
        security = lib.get('./security'),

        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        PagingHelper = common.get('./ui.paging_helper'),

        tmpl = require('./tmpl'),

        view_switch = require('./view_switch.view_switch'),
        FileListUIAbstract = require('./file_list.ui_abstract'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),
        file_list = require('./file_list.file_list'),
        file_list_ui = require('./file_list.ui'),
        disk_ui = require('./ui'),

        tbar = require('./toolbar.tbar'),
        all_checker = require('./file_path.all_checker'),

        main_ui = require('main').get('./ui'),

        cur_node,
        thumb,
        vir_remove,
        downloader,
        page_helper,

        $list_to, // 列表父容器
        $cur_view, // 当前所使用的界面（特殊界面 or 经典界面）
        $sub_view, //
        $cur_dir_list, // 目录
        $cur_file_list, // 文件
        $cur_empty_tip, // 空提示
        $all_list,
        $cur_pager,

        $voice_player, // 语音播放元素

        playing_voice, // 正在播放的文件
        cur_is_classic = false, // 当前是否是经典界面
        appended_ids = {}, // 已添加到DOM中的文件ID
        cur_total = 0, // 当前目录文件的总个数

        ui_visible,

        doc = document, $body,
        parse_int = parseInt,

    // URL匹配正则
        re_url = new RegExp("((http|https|ftp)\\:\\/\\/|\\bw{3}\\.)[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z\\u00C0-\\u017F0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*", 'gi'),
    // URL协议头
        re_protocol = /^(?:(?:http|https|ftp):\/\/)/i,
    // 全角字符
        re_double_words = /[^\x00-\xFF]/,

        undefined;

    var ui_virtual = new FileListUIAbstract('disk_file_list_ui_virtual', {

        render: function (_$list_to) {

            // 文件列表主体
            _$list_to.append(tmpl.vir_dir_file_list({ empty_text: '没有了' }));

            $list_to = _$list_to;

            $body = $(doc.body);

            require.async('downloader', function (mod) {
                downloader = mod.get('./downloader');
            });

            // 缩略图
            this._render_thumb();
            // 分页
            this._render_pager();
            // 勾选
            this._render_selection();
        },

        // 变更指向的目录
        enter_dir: function (node) {
            cur_node = node;
            
            this._init_$doms();

            view_switch.set_namespace('ui_virtual');

            // 目前只有包含图片或视频的目录需要使用缩略图模式
            var is_thumb = node.has_image() || node.has_video();
            is_thumb ? view_switch.temp_to_thumb() : view_switch.temp_to_list();
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (cur_node !== new_node) {
                this._clear_$items(true);

                if (thumb)
                    thumb.clear_queue();

                // 加载更多按钮
                this._update_pager();

                // 隐藏空提示
                $cur_empty_tip.hide();

                // 退出临时UI
                view_switch.exit_temp_view();

                this.close_weiyun_sc();
            }
        },

        set_node_data: function (node, last_node, dirs, files, is_reload, total) {
            cur_node = node;
            cur_total = total;

            // 更新“加载更多”按钮
            this._update_pager(total);

            if (is_reload) {
                this._set_$items(dirs, files);
            } else {
                // 追加到列表中
                this.append_$items(dirs, files);
                this._loading(false);
            }

            // 更新视图
            this._update_list_view_status(true);

            if(file_list.is_weixin_dir(cur_node)){
                this.open_weiyun_sc();
            }
        },

        /**
         * 打开微云收藏入口
         * @returns {*|jQuery}
         */
        open_weiyun_sc: function(){
            if(!this._$wysc_enter){
                this._$wysc_enter = $(tmpl._wysc_enter()).appendTo(disk_ui.get_$body());
                this._$wysc_enter.find('[data-btn-id="go_weiyun_sc"]').on('click',function(e){
                    user_log('CLICK_WYSC_LINK');
                    e.stopImmediatePropagation();
                    if(constants.IS_APPBOX){
                        window.open( urls.make_url('http://jump.weiyun.qq.com/set_cookie.php', {
                            uin: query_user.get_uin(),
                            skey: query_user.get_skey(),
                            url: 'http://sc.qq.com/login'
                        }, false) );
                    } else {
                        window.open('http://ptlogin2.weiyun.com/ho_cross_domain?tourl=http://sc.qq.com/');
                    }
                    return false;
                });
            }
            this._$wysc_enter.show();
        },
        /**
         * 关闭微云收藏入口
         */
        close_weiyun_sc: function(){
            if(this._$wysc_enter){
                this._$wysc_enter.hide();
            }
        },

        show: function () {

            // 一些class
            $body.toggleClass('app-chat', cur_node.has_text() || cur_node.has_voice()).toggleClass('app-blog', cur_node.has_article());

            // 渲染打开行为
            this._render_enter();
            // 删除
            this._render_remove();
            // IE6 fix
            this._render_ie6();

            $cur_view && $cur_view.show();
            $sub_view && $sub_view.show();

            if (all_checker) {
                // 隐藏全选
                all_checker.hide();
            }

            // 更新列表高度
            file_list_ui.frame_height_changed();

            this.trigger('show');

            ui_visible = true;
        },

        hide: function () {
            if ($sub_view) {
                $sub_view.hide();
            }

            $cur_view && $cur_view.hide();
            $sub_view && $sub_view.hide();
            $cur_view = $sub_view = $cur_dir_list = $cur_file_list = $cur_empty_tip = $all_list = $cur_pager = null;

            this.trigger('hide');

            ui_visible = false;
        },

        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} dirs
         * @param {Array<FileNode>} files
         */
        append_$items: function (dirs, files) {
            var me = this,
            // 替换已存在于DOM中的文件
                filter = function (file) {
                    if (appended_ids[file.get_id()]) {
                        me._update_$item(file);
                    } else {
                        return true;
                    }
                };

            dirs = $.grep(dirs, filter);
            files = $.grep(files, filter);

            if (dirs.length) {
                var dirs_html = tmpl.vir_dir_file_item({ files: dirs, icon_map: this.get_icon_map() }); // get_icon_map in "ui_abstract.js"
                $cur_dir_list.append(dirs_html);

                $.each(dirs, function (i, file) {
                    appended_ids[file.get_id()] = 1;
                });
            }

            if (files.length) {
                var files_html = tmpl.vir_dir_file_item({ files: files, icon_map: this.get_icon_map() });
                $cur_file_list.append(files_html);

                $.each(files, function (i, file) {
                    appended_ids[file.get_id()] = 1;
                });
            }

            this.trigger('add_$items', files);
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
                remove_fn = function (ids) {
                    $.each(ids, function (i, id) {
                        delete appended_ids[id];
                    });
                    $(this).remove();
                    me.trigger('remove_$items');
                    me._update_list_view_status(true);
                };

            if (file_nodes.length == 1) {
                var first = file_nodes[0],
                    id = first.get_id(),
                    $item = me.get_$item(id);

                if (animate) {
                    $item.fadeOut('fast', remove_fn);
                } else {
                    remove_fn.call($item, [id]);
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
                remove_fn.call(items, ids);
            }
        },

        /**
         * 是否可以切换视图模式
         */
        is_view_switchable: function () {
            return false;
        },

        /**
         * 当前是否是缩略图模式
         */
        is_thumb_view: function (node) {
            return !!node && node.has_image() || node.has_video();
        },

        // ====== 私有成员 =====================================================================
        
        _init_$doms: function () {
            // 除文字、语音或文章的目录以外，使用经典界面
            var is_classic = cur_is_classic = !(cur_node.has_text() || cur_node.has_voice() || cur_node.has_article() || cur_node.has_image() || cur_node.has_video());

            $cur_view = $list_to.children('[data-view=' + (is_classic ? 'classic' : 'special') + ']'); // 经典界面（如微信目录、图片视频目录） // 特殊界面（如文章、语音文字等）

            if (is_classic) {
                $cur_dir_list = $cur_view.find('[data-type=dir]'); // 经典界面的目录
                $cur_file_list = $cur_view.find('[data-type=file]'); // 经典界面的文件
                $sub_view = null;
            } else {
                $sub_view = $cur_view.children('[data-sub-view="' + (this.is_thumb_view(cur_node) ? 'thumb' : 'list') + '"]');
                $cur_dir_list = $sub_view.children('[data-type=dir]');
                $cur_file_list = $sub_view.children('[data-type=file]');
            }
            $cur_empty_tip = $cur_view.find('[data-action=empty-tip]');
            $all_list = $cur_dir_list.add($cur_file_list);
            $cur_pager = $cur_view.find('[data-action="more"]');

            $cur_view.siblings('[data-view]').hide();
            if ($sub_view) {
                $sub_view.siblings('[data-sub-view]').hide();
            }
        },

        _update_$item: function (node) {
            var $item = this._get_$item(node);
            if ($item) {
                $item.replaceWith(tmpl.vir_dir_file_item({ files: [node], icon_map: this.get_icon_map() }));
                console.log('update_$item ok -> ' + node.get_id());

                this.trigger('update_$item', node);
            }
        },

        _set_$items: function (dirs, files) {
            this._clear_$items(true);
            this.append_$items(dirs, files);
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        _clear_$items: function (silent) {
            if (!this.is_rendered()) return;

            if ($all_list)
                $all_list.empty();

            appended_ids = {};

            if (!silent) {
                this.trigger('clear_$items');
                this._update_list_view_status(true);
            }
        },

        /**
         * 加载若干个文件
         * @param {Number} [size] 默认动态计算
         * @private
         * @return {jQuery.Deferred}
         */
        _load_more: function (size) {
            var offset = cur_node.get_kid_nodes() ? cur_node.get_kid_nodes().length : 0;
            if (offset < cur_total) {
                size = size || this._get_page_size(cur_node);
                return file_list.load_vir_dir(cur_node, offset, size);
            }
        },

        // 打开目录、播放语音、预览文章、预览图片、播放视频等
        _render_enter: function () {
            var me = this,
                is_enter_event = function (e) {
                    return !(e.ctrlKey || e.shiftKey || e.metaKey || !!$(e.target).closest('input, a, button, [data-function]')[0]); // 按下ctrl/shift点击时不打开目录、文件
                },
                enter_file = function (node, e) {
                    // 目录
                    if (node.is_dir()) {
                        file_list.load_vir_dir(node, 0, me._get_page_size(node));
                    }
                    // 文件
                    else {
                        // 未完成的文件才可打开
                        if (node.is_broken_file()) {
                            // do nothing
                        }
                        else {

                            // 如果是可预览的文档，则执行预览操作  (现在虚拟目录只有腾讯新闻会进入到这里，且腾讯新闻都是图片，所以不存在预览文档)
                           /* if (me.is_preview_doc(node)) {
                                me.appbox_preview(node,me._get_down_url).fail(function () { // @see ui_virtual.js
                                    me.preview_doc(node);                   // @see ui_virtual.js
                                });
                                user_log('ITEM_CLICK_DOC_PREVIEW');
                                return;
                            }*/

                            // 如果是图片，则执行预览操作
                            if (node.is_image()) {
                                me.appbox_preview(node,me._get_down_url).fail(function () {
                                    me.preview_image(node);
                                });
                                user_log('ITEM_CLICK_IMAGE_PREVIEW');
                                return;
                            }

                            // 压缩包预览
                            if (node.is_compress_file()  && !($.browser.msie && $.browser.version < 8)) {
                                me.preview_zip_file(node);                   // @see ui_virtual.js
                                user_log('ITEM_CLICK_ZIP_PREVIEW');
                                return;
                            }

                            // 其他文件，下载
                            download_file(node, e);
                            user_log('ITEM_CLICK_DOWNLOAD');
                        }
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

                    if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e)) {
                        return;
                    }

                    var node = me._get_file_by_$el(this);
                    enter_file(node, e);
                },

            // 点击下载
                down_file_event = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var node = me._get_file_by_$el(this);
                    download_file(node, e);

                    // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                    $(e.target).toggle().toggle();
                },
             //点击来源
                to_newsurl_event = function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var node = me._get_file_by_$el(this);
                    var url="http://wx.cgi.weiyun.com/tnews_picupload.fcg?" +
                        "cmd=get_news_url&fileid="+node.get_id();
                    window.open(url);
                };

            // 各种打开
            $all_list
                .off('click.file_list', '[data-action="enter"]')
                .on('click.file_list', '[data-action="enter"]', click_file_event);

            $cur_file_list
                // 下载
                .off('click.file_list', '[data-action=download]')
                .on('click.file_list', '[data-action=download]', down_file_event)
                // 来源
                .off('click.file_list', '[data-action=newsurl]')
                .on('click.file_list', '[data-action=newsurl]', to_newsurl_event)
                // 文字展开、收起
                .off('click.file_list', '[data-action="text-expand"],[data-action="text-collapse"]')
                .on('click.file_list', '[data-action="text-expand"],[data-action="text-collapse"]', function (e) {
                    e.preventDefault();
                    var expand = $(this).attr('data-action') === 'text-expand';

                    me._toggle_text_expand($(this).closest('[data-file-id]').attr('data-file-id'), expand);

                    $(this).text(expand ? '点击收起' : '点击展开').attr('data-action', expand ? 'text-collapse' : 'text-expand');
                });
        },

        // 文件删除模块
        _render_remove: function () {

            var me = this;

            // 删除文件模块
            vir_remove = require('./file_list.file_processor.vir_remove.vir_remove');
            vir_remove.render();

            // 删除事件
            $all_list
                .off('click.file_list', '[data-action="remove"]')
                .on('click.file_list', '[data-action="remove"]', function (e) {
                    e.preventDefault();

                    var node = me._get_file_by_$el(this);
                    me._remove_file(node);
                });
        },

        // 分页
        _render_pager: function () {
            var me = this;

            $list_to.children('[data-view]')
                .off('click.file_list', '[data-action="more"]')
                .on('click.file_list', '[data-action="more"]', function (e) {
                    e.preventDefault();

                    me._loading(true);

                    me._load_more();
                });
        },

        // 缩略图
        _render_thumb: function () {
            thumb = require('./file_list.thumb.thumb');

            /*thumb = new Thumb({
                cgi_url: 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
                cgi_cmd: 'batch_download_virtual_file',
                cgi_data: function (files) {
                    return {
                        pdir_key: cur_node.get_id(),
                        files: $.map(files, function (file) {
                            return {
                                file_id: file.get_id(),
                                file_name: file.get_name()
                            };
                        })
                    };
                },
                cgi_response: function (files, body) {
                    var imgs = body['files'];
                    if (imgs) {
                        return $.map(imgs, function (img_rsp) {
                            var ret = parse_int(img_rsp['retcode']), url, file_id;
                            if (ret == 0) {
                                var host = img_rsp['dl_svr_host'],
                                    port = img_rsp['dl_svr_port'],
                                    path = img_rsp['dl_encrypt_url'];
                                url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=128*128';
                                file_id = img_rsp['file_id'];
                            }
                            return new Thumb.ImageMeta(ret, file_id, url);
                        })
                    }
                }
            });
*/
            var me = this;
            me
                // 文件列表增加文件DOM后刷新缩略图
                .on('add_$items set_$items update_$item', function (files) {
                    files.length && thumb.push(files);
                })

                // 加载成功后显示图片
                .listenTo(thumb, 'get_image_ok', function (file, img) {
                    set_image(file, img);
                })
                // 图片加载失败后设置一个默认图片
                .listenTo(thumb, 'get_image_error', function (file) {
                    set_image(file);
                });


            var default_image = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/img-70.png',
                set_image = function (file, img) {
                    var $item = me._get_$item(file.get_id()),
                        $item_img;
                    if ($item && ($item_img = $item.find('img'))[0]) {
                        if (img) {
                            $item_img.attr('src', $(img).attr('src'));
                        } else {
                            $item_img.attr('src', default_image);
                        }
                        $item_img.css('visibility', '');
                    }
                };
        },

        // 工具栏
//        _render_toolbar: function () {
//            this.update_dyn_bar(true);   // 现在不需要动态控制按钮的显示了 james
//        },

        // 勾选状态
        _render_selection: function () {
            // 激活 ui_normal 时，增加 selection-view 类以显示列表为checkbox勾选操作模式
            this.on('show', function () {
                disk_ui.get_$body().removeClass('selection-view');
            });
            if (ui_visible === true) {
                disk_ui.get_$body().removeClass('selection-view');
            }
        },

        // IE6 fix
        _render_ie6: function () {
            /*$all_list
                .off('mouseenter mouseleave', '[data-file-id]')
                .on('mouseenter', '[data-file-id]', function (e) {
                    $(this).addClass('hover');
                })
                .on('mouseleave', '[data-file-id]', function (e) {
                    $(this).removeClass('hover');
                });*/
        },

        //预览图片
        preview_image: function (node) {
            var me = this;

            require.async(['image_preview'], function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    files = node.get_parent().get_kid_files(),
                // 当前图片所在的索引位置
                    index = $.inArray(node, files);

                image_preview.start({
                    total: cur_total,
                    index: index,
                    images: files,
                    has_next: function (options) {
                        for (var i = options.index; i < options.total; i++) {
                            var file = files[i + 1];
                            if (file && file.is_image() && file.is_on_tree()) {
                                return true;
                            }
                        }
                        return false;
                    },
                    download: function (index, e) {
                        var file = files[index];
                        if (file && file.is_on_tree()) {
                            downloader.down(file, e);
                        }
                    },
                    //判断是否存了来源url
                    has_newsurl: function(index){
                        var file = files[index];
                        return file.has_newsurl();
                    },
                    //跳转到来源url
                    goto: function (index) {
                        var file = files[index];
                        if (file && file.is_on_tree()){
                            var url="http://wx.cgi.weiyun.com/tnews_picupload.fcg?" +
                                "cmd=get_news_url&fileid="+file.get_id();
                            window.open(url);
                        }
                    },
                    remove: function (index, callback) {
                        var file = files[index];
                        if (file && file.is_on_tree()) {
                            me._remove_file(file).done(function () {
                                callback()
                            });
                        } else {
                            callback();
                        }
                    }
                });
            });
        },

        _get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(file_id);
        },

        _get_$item: function (node_or_id) {
            var id;
            if (typeof node_or_id === 'string') {
                id = node_or_id;
            } else if (FileNode.is_instance(node_or_id)) {
                id = node_or_id.get_id();
            }
            var $item = id ? $('#_disk_vdir_item_' + id) : null;
            return $item && $item[0] ? $item : null;
        },

        /**
         * 折叠、展开文字
         * @param {String} text_id
         * @param {Boolean} expand
         * @private
         */
        _toggle_text_expand: function (text_id, expand) {
            var me = this,
                $el = this._get_$item(text_id),
                $texts = $el.find('[data-name="short-text"], [data-name="long-text"]'),
                $short = $texts.eq(0),
                $long = $texts.eq(1);

            $short.toggle(!expand);
            $long.toggle(expand);
            $el.toggleClass('text-expanded', expand);

            me.trigger('list_resized');
        },


        // 获取数据分页大小
        _get_page_size: function (node) {
            if (!page_helper) {
                page_helper = new PagingHelper({
                    scroller: main_ui.get_scroller()
                });
            }

            var is_thumb = this.is_thumb_view(node);

            page_helper.set_item_width(is_thumb ? 136 : 0);    // 缩略图模式文件宽度为136，其他模式宽度为0(自动)
            page_helper.set_item_height(is_thumb ? 136 : 106); // 缩略图模式文件高度为136，其他模式高度为100+
            page_helper.set_is_list(!is_thumb);

            var size = Math.max(page_helper.get_line_size() * page_helper.get_line_count(true), 10); // 最少10个
            //console.log('get_page_size=', size);
            return size;
        },

        // 显示分页条（special） or 更新页码（classic & list）
        _update_pager: function (total) {
            var kid_len = cur_node.get_kid_nodes() ? cur_node.get_kid_nodes().length : 0;
            $cur_pager.css('visibility', (!!total && kid_len < total) ? '' : 'hidden');
        },

        _loading: function (loading) {
            $cur_pager.html(loading ? '加载中...' : '加载更多');
        },

        /**
         * 获取文件的下载地址
         * @param node
         * @param is_preview
         * @param [extra]
         * @returns {*}
         * @private
         */
        _get_down_url: function (node, is_preview ,extra) {
            var down_name = downloader.get_down_name(node.get_name()),
                uin = query_user.get_uin(),
                skey = query_user.get_skey(),

                header = {
                    cmd: 'download_virtual_file',
                    appid: constants.APPID,
                    proto_ver: 20130708,
                    token: security.getAntiCSRFToken(),
                    uin: uin,
                    skey: skey
                },
                body = {
                    file_owner: uin,
                    pdir_key: cur_node.get_id(),
                    file_id: node.get_id(),
                    file_name: down_name
                },
                params = {
                    data: {
                        req_header: header,
                        req_body: body
                    }
                };

            if (constants.IS_APPBOX) {
                params.uin = uin;
                params.skey = skey;
            }

            // 预览时
            if (is_preview) {
                body.size = '640*640';
            }
            else {
                params.err_callback = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html';
            }
            if(extra){
                extra.size ? (body.size = extra.size +'*'+extra.size) : '';
            }
            return urls.make_url('http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg', params);
        },

        /**
         * 删除文件
         * @param {FileNode} node
         * @private
         */
        _remove_file: function (node) {
            var me = this;
            var thing = (node.is_dir() ? '文件夹' : '文件'),
                ok_callback = function () {
                    mini_tip.ok('删除成功');
                    me._get_$item(node).fadeOut('fast', function () {
                        $(this).remove();

                        me._load_more(1);
                    });
                };

            var def = vir_remove.remove_confirm(node, thing, node.get_name())
                .done(function () {
                    ok_callback();
                })

                .fail(function (msg, ret) {
                    if (ret === 10005) {
                        ok_callback();
                    }
                    else if (msg) {
                        mini_tip.error(msg);
                    }
                });

            return def;
        },

        // ============ 列表高度调整 ===========================
        _last_has_dirs: undefined,
        _last_has_files: undefined,
        _last_show_empty_tip: undefined,

        /**
         * 更新列表显示状态（是否显示列表子标题、是否显示文件列表、是否显示目录列表、是否显示空提示）
         * @param {Boolean} [show_empty_tip] 是否显示空提示，默认true
         */
        _update_list_view_status: function (show_empty_tip) {
            if (!this.is_rendered()) return;

            var
                has_dirs = cur_node && cur_node.get_kid_dirs() && cur_node.get_kid_dirs().length > 0,
                has_files = cur_node && cur_node.get_kid_files() && cur_node.get_kid_files().length > 0;

            show_empty_tip = show_empty_tip !== false;

            if (this._last_has_dirs !== has_dirs || this._last_has_files !== has_files || this._last_show_empty_tip !== show_empty_tip) {

                // 如果无文件，则隐藏文件列表；无目录，则隐藏目录列表
                $cur_dir_list.css('display', has_dirs ? '':'none');
                $cur_file_list.css('display', has_files ? '':'none');

                // 如果无文件和目录,则显示空提示
                if (show_empty_tip && !file_list.is_weixin_dir(cur_node)) {
                    var has_data = has_files || has_dirs;
                    $cur_empty_tip.toggle(!has_data).text('您还没有保存任何' + cur_node.get_name() + '内容');
                    if ($sub_view) {
                        $sub_view.toggle(has_data);
                    }
                } else {
                    $cur_empty_tip.hide();
                }

                $cur_pager.toggle(has_files || has_dirs);

                this._last_has_dirs = has_dirs;
                this._last_has_files = has_files;
                this._last_show_empty_tip = show_empty_tip;
            }
        },

        /**
         * 修复用户产生的文本消息（HTML转义 + URL添加链接）
         * @param {String} str 需要处理的用户文本
         * @param {Number} [len] 截取长度（参考.smart_sub()方法），可选
         *
         * !! 在 ui_virtual.tmpl.html 中有调用
         */
        fix_user_text: function (str, len) {
            if (!str || !(typeof str === 'string')) return '';

            var me = this;

            // 首先要将文本和URL分离开，然后对文本进行HTML转义，对URL进行修复
            // 如“你好www.g.cn世界”，需要拆分为 "你好", "www.g.cn", "世界"
            var texts = [],
                is_urls = {}, // { 1: String, 3: String } 保存所有的URL以及URL在文本数组中出现的索引位置
                last_end = 0,
                i = 0;

            var match;
            while (match = re_url.exec(str)) {
                var url = match[0],
                    start = match.index,
                    end = start + url.length,
                    left_text = str.substring(last_end, start);

                texts.push(left_text);  // 取URL左侧的文字
                texts.push(url);
                is_urls[texts.length - 1] = url;

                last_end = end;
                i++;
            }
            // 取URL右侧的文字
            if (last_end < str.length - 1) {
                texts.push(str.substr(last_end));
            }

            // 先截断
            if (len > 0) {
                texts = me._smart_sub_arr(texts, len);
            }


            texts = $.map(texts, function (str, i) {
                var url;
                // 生成链接（如果URL被截断了，则不处理链接）
                if (i in is_urls && str === (url = is_urls[i])) {
                    if (!re_protocol.test(url)) {
                        url = 'http://' + url;
                    }
                    return '<a href="' + url + '" target="_blank">' + str + '</a>'; // 这里用text作为文本，是因为它有可能由"www.weiyun.com"被截断为"www.wei.."
                }
                else {
                    // 字符串HTML转义
                    return text.text(str);
                }
            });

            return texts.join('');
        },

        /**
         * 按照字符数截断字符串数组(1个全角字符=2个半角字符, 可能会有误差)
         * @param {Array<String>} str
         * @param {Number} len
         * @return {Array<String>} str
         */
        _smart_sub_arr: function (str, len) {
            var arr = str,
                results = [],
                stop_arr_index = -1,
                stop_chr_index = -1,
                chr_index = -1,
                index = 0;

            len *= 2;

            for (var m = 0, n = arr.length; m < n; m++) {
                var s = arr[m];
                for (var i = 0, l = s.length; i < l; i++) {
                    chr_index++;
                    if (re_double_words.test(s.charAt(i))) {
                        index += 2;
                    } else {
                        index++;
                    }
                    if (index > len) {
                        stop_chr_index = i;
                        break;
                    }
                }
                if (stop_chr_index !== -1) {
                    stop_arr_index = m;
                    break;
                }
            }

            if (stop_arr_index !== -1 && stop_chr_index !== -1) {
                results = arr.slice(0, stop_arr_index);
                results.push(arr[stop_arr_index].substr(0, stop_chr_index) + '..');
            } else {
                results = arr;
            }

            return results;
        }

    });

    return ui_virtual;
});