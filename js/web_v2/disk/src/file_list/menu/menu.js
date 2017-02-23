/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author jameszuo
 * @date 13-3-5
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        log_event = common.get('./global.global_event').namespace('log'),
	    offline_event = common.get('./global.global_event').namespace('offline_download'),
	    request = common.get('./request'),
	    urls = common.get('./urls'),
	    query_user = common.get('./query_user'),

        click_tj = common.get('./configs.click_tj'),
        mini_tip = common.get('./ui.mini_tip_v2'),

        selection,
        share,
	    offline_download,

        file_list,
        file_list_ui_normal,
        file_list_ui_offline,

        is_hover, // true 表示是‘更多菜单’，false 表示是右键菜单

        item_maps = {

            // 默认菜单
            contextmenu: {
                single_download: 1,
	            offline_download: 1,
	            xuanfeng_download: 1,
                package_download: 1,
                share: 1,
                //mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1,
                qrcode:1
            },

            // 更多菜单
            more: {
                share: 1,
                //mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1
            },

            // 分享子菜单
            share: {
                //mail_share: 1,
                link_share: 1
            },

            // 离线文件
            offline: {
                download_offline: 1,
                remove_offline: 1,
                save_as_offline: 1
            }
        },

        hover_on_file_id, // hover菜单对应的文件ID

        undefined;

    if(constants.UI_VER === 'APPBOX') {//appbox先保留
        item_maps.contextmenu.mail_share = 1;
        item_maps.more.mail_share = 1;
        item_maps.share.mail_share = 1;
    }

    var menu = new Module('disk_file_menu', {

        render: function () {

            var me = this;
            file_list = require('./file_list.file_list');
            file_list_ui_normal = require('./file_list.ui_normal');
            file_list_ui_offline = require('./file_list.ui_offline');
            menu = require('./file_list.menu.menu');

            selection = require('./file_list.selection.selection');

            me.context_menu = me._create_context_menu();
            me.share_menu = me._create_share_menu();

            $.each([me.context_menu, me.share_menu], function (i, menu) {
                menu
                    .on('before_render', function ($on) {
                        var file = file_list_ui_normal.get_file_by_$el($on);
                        hover_on_file_id = file ? file.get_id() : null;
                    })
                    .on('hide', function () {
                        hover_on_file_id = null;
                    });
            });

            me
                .listenTo(me.context_menu, 'show show_on', function () {
                    log_event.trigger('contextmenu_toggle', true);
                })
                .listenTo(me.context_menu, 'hide', function () {
                    log_event.trigger('contextmenu_toggle', false);
                });

            me.get_downloader();
        },

        _downloader: null,
        get_downloader: function () {
            var me = this;
            if (!me._downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    me._downloader = mod.get('./downloader');
                });
            }
            return me._downloader;
        },
	    get_offline_downloader: function(file) {
		    offline_event.trigger('menu_selected_offline_download', file);
	    },
        /**
         * 显示离线文件右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_offline_menu: function (x, y, $on) {
            is_hover = false;
            hover_on_file_id = null;

            // get_selected_files
            var files = file_list_ui_offline.get_selected_files(),
            // 菜单 id map
                item_id_map = this._get_item_id_map(files, item_maps.offline);

            // 显示菜单
            if (!$.isEmptyObject(item_id_map)) {
                this.offline_menu.show(x, y, item_id_map, $on);
            }
            else {
                this.offline_menu.hide();
            }
        },
        /**
         * 隐藏离线文件右键菜单
         */
        hide_offline_menu: function(){
            this.offline_menu.hide();
        },
        /**
         * 显示"文件的"更多"菜单
         * @param {jQuery|HTMLElement} el
         */
        show_more_menu: function (el) {

            is_hover = true;

            var file = file_list_ui_normal.get_file_by_$el($(el)),
            // 菜单 id map
                item_id_map = this._get_item_id_map([file], item_maps.more);

            if (!$.isEmptyObject(item_id_map)) {
                this.context_menu.show_on(el, file_list_ui_normal.get_$list_parent(), item_id_map, 70, -19, 18);
            }
            else {
                this.context_menu.hide();
            }
            // this.share_menu.hide();
        },

        /**
         * 显示分享菜单
         * @param {jQuery|HTMLElement} el
         */
        show_share_menu: function (el) {

            is_hover = true;

            var file = file_list_ui_normal.get_file_by_$el($(el)),
            // 菜单 id map
                item_id_map = this._get_item_id_map([file], item_maps.share);

            if (!$.isEmptyObject(item_id_map)) {
                this.share_menu.show_on(el, file_list_ui_normal.get_$list_parent(), item_id_map, 20, 0, 25, false);
            }
            else {
                this.share_menu.hide();
            }
            this.context_menu.hide();
        },

        /**
         * 隐藏分享菜单
         */
        hide_share_menu: function () {
            this.share_menu.hide();
        },

        get_context_menu: function () {
            return this.context_menu;
        },

        get_share_menu: function () {
            return this.share_menu;
        },

        get_offline_menu: function() {
            return this.offline_menu;
        },

        /**
         * 显示右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_context_menu: function (x, y, $on) {

            is_hover = false;
            var files = file_list.get_selected_files(),
            // 菜单 id map
                item_id_map = this._get_item_id_map(files, item_maps.contextmenu);

            // 显示菜单
            if (!$.isEmptyObject(item_id_map)) {
                this.context_menu.show(x, y, item_id_map, $on);
            }
            else {
                this.context_menu.hide();
            }
            this.share_menu.hide();
        },

        hide_all: function () {
            var share_menu = this.get_share_menu();
            if (share_menu) {
                share_menu.hide();
            }
            var context_menu = this.get_context_menu();
            if (context_menu) {
                context_menu.hide();
            }
        },

        _create_context_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('single_download'),
	                me.create_item('package_download'),
	                me.create_item('offline_download'),
	                me.create_item('xuanfeng_download'),
                    me.create_item('remove'),
                    me.create_item('move'),
                    me.create_item('rename'),
                    me.create_item('qrcode'),
                    me.create_item('share')

                ]
            });

            return menu;
        },

        _create_share_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('link_share'),
                    me.create_item('mail_share')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            var me = this;

            switch (id) {

                case 'share':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        group: 'share',
                        split: true,
                        click: function() {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                require.async('share_enter', function(mod) {
                                    var share_enter = mod.get('./share_enter');
                                    share_enter.start_share(files);
                                });
                            }
                            user_log('RIGHTKEY_MENU_SHARE');
                        }
                    };

                case 'mail_share':
                    return {
                        id: id,
                        text: '邮件分享',
                        group: 'share',
                        after_render: function ($item) {
                            var file = me._get_target_files(true)[0];
                            if (file) {
                                // 判断是否允许分享
                                var err = share.is_sharable(file);
                                if (!err) {
                                    var share_url = share.get_mail_url(file);
                                    $item.children('a').attr('href', share_url).attr('target', '_blank');
                                }
                            }
                        },
                        click: function () {
                            var file = me._get_target_files(true)[0];
                            if (file) {
                                var err = share.is_sharable(file);
                                if (err) {
                                    mini_tip.warn(err);
                                }
                            }
                            user_log(is_hover ? 'MORE_MENU_MAIL_SHARE' : 'RIGHTKEY_MENU_MAIL_SHARE');
                        }
                    };

                case 'link_share':
                    return {
                        id: id,
                        text: '链接分享',
                        group: 'share',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var err = share.is_link_sharable(files);
                                if (!err) {
                                    share.link_share(files);
                                } else {
                                    mini_tip.warn(err);
                                }
                            }
                            user_log(is_hover ? 'MORE_MENU_LINK_SHARE' : 'RIGHTKEY_MENU_LINK_SHARE');
                        }
                    };

                case 'rename':
                    return {
                        id: id,
                        text: '重命名',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function () {
                            var file = me._get_target_files(false)[0];
                            if (file) {
                                var rename = require('./file_list.rename.rename');
                                rename.start_edit(file);
                            }
                            user_log(is_hover ? 'MORE_MENU_RENAME' : 'RIGHTKEY_MENU_RENAME');
                        }
                    };

                case 'remove':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var remove = require('./file_list.file_processor.remove.remove');
                                remove.remove_confirm(files, '', true);
                                user_log('RIGHTKEY_MENU_DELETE');
                            }
                            user_log(is_hover ? 'MORE_MENU_DELETE' : 'RIGHTKEY_MENU_DELETE');
                        }
                    };

                case 'move':
                    return {
                        id: id,
                        text: '移动到',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var move = require('./file_list.file_processor.move.move');
                                if (move) {
                                    move.show_move_to(files);
                                }
                            }
                            !is_hover && user_log('RIGHTKEY_MENU_MOVE');
                        }
                    };

                case 'package_download':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'download',
                        click: function (e) {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                if (me.get_downloader()) {
                                    me.get_downloader().down(files, e);
                                }
                            }
                            !is_hover && user_log('RIGHTKEY_MENU_DOWNLOAD');
                        }
                    };

                case 'single_download':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'download',
                        click: function (e) {
	                        var files = me._get_target_files(false);
	                        if (files.length) {
		                        if (me.get_downloader()) {
			                        me.get_downloader().down(files, e);
		                        }
	                        }
	                        !is_hover && user_log('RIGHTKEY_MENU_DOWNLOAD');
                        }
                    };

	            case 'offline_download':
		            return {
			            id: id,
			            text: '打开',
			            icon_class: 'ico-null',
			            group: 'download',
			            click: function (e) {
				            var file = me._get_target_files(false);
				            if (file.length) {
					            if (me.get_offline_downloader) {
						            me.get_offline_downloader(file[0], e);
					            }
				            }
			            }
		            };

	            case 'xuanfeng_download':
		            return {
			            id: id,
			            text: '旋风下载',
			            icon_class: 'ico-null',
			            group: 'download',
			            click: function (e) {
				            var files = me._get_target_files(false);
				            if (files.length) {
					            if (me.get_downloader()) {
						            me.get_downloader().down(files, e, true);
					            }
				            }
			            }
		            };

                case 'qrcode':
                    return {
                        id: id,
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'qrcode',
                        split: true,
                        click: function () {
                            var files = me._get_target_files(false);
                            //hyytodo
                            if (files.length) {
                                require('file_qrcode').get('./file_qrcode').show(files);
                                user_log('FILE_QRCODE_DISK_RIGHT');
                            }
                        }
                    };
            }
        },

        /**
         * 获取可显示的菜单选项
         * @param {Array<FileNode>} files
         * @param {Object} usable_items
         * @return {Object} 可用的菜单 ID map
         */
        _get_item_id_map: function (files, usable_items) {
            if (!files || !files.length) {
                return null;
            }

            usable_items = $.extend({}, usable_items);
            var
            // 包含破损文件
                has_broken = false,
	        // 种子文件
	            has_torrent = false,
            // 有不允许删除的文件
                has_no_del = false,
            // 有不允许移动的文件
                has_no_move = false,
            // 包含不允许重命名的文件
                has_no_rename = false,
            // 包含不允许下载的文件
                has_no_down = false,
            // 多个文件、目录
                multi = files.length > 1,
            // 有目录
                has_dir = false,
            // 只有一个『文件』
                only_1_file = !multi && !files[0].is_dir();

            $.each(files, function (i, file) {
                if (file.is_broken_file()) {
                    has_broken = true;
                }
	            if (file.is_torrent_file()) {
		            has_torrent = true;
	            }
                if (!file.is_removable()) {
                    has_no_del = true;
                }
                if (!file.is_movable()) {
                    has_no_move = true;
                }
                if (!file.is_renamable()) {
                    has_no_rename = true;
                }
                if (!file.is_downable()) {
                    has_no_down = true;
                }
                if (file.is_dir()) {
                    has_dir = true;
                }
            });

            // 破损文件只能删除
            if (has_broken) {
                usable_items = {remove: 1};
            }

	        //灰度用的变量
	        var query = urls.parse_params(),
		        cur_uin = query_user.get_uin_num();

	        //旋风下载
	        if (!query.xuanfeng || !has_torrent) {
		        delete usable_items['xuanfeng_download'];
	        }

	        if (!has_torrent) {
		        delete usable_items['offline_download'];
	        }

            // 不能删除
            if (has_no_del) {
                delete usable_items['remove'];
            }

            // 不能移动
            if (has_no_move) {
                delete usable_items['move'];
            }

            // 不能重命名
            if (has_no_rename) {
                delete usable_items['rename'];
            }

            // 包含不可下载的文件
            if (has_no_down) {
                delete usable_items['single_download'];
                delete usable_items['package_download'];
            }

            // 包含目录
            if (has_dir) {
                delete usable_items['mail_share'];
                delete usable_items['qrcode'];
            }

            // 包含目录或选中了多个文件，就不显示『下载』、『邮件分享』、『外链分享』
            if (has_dir || multi) {
                delete usable_items['single_download'];
                delete usable_items['mail_share'];
                delete usable_items['qrcode'];
            }

            // 包含多个文件、目录，隐藏『重命名』
            if (multi) {
	            delete usable_items['offline_download'];//离线文件不支持批量下载
                delete usable_items['rename'];
                delete usable_items['qrcode'];
            }
            // 只有1个，且只有1个文件，不显示『打包下载』
            else if (only_1_file) {
                delete usable_items['package_download'];
            }

            // 链接分享文件个数限制
            if (files.length > constants.LINK_SHARE_LIMIT) {
                delete usable_items['link_share'];
            }

            // 下载文件个数限制
            //if (files.length > constants.PACKAGE_DOWNLOAD_LIMIT) {
            //    delete usable_items['package_download'];
            //}

            // 如果没有邮件分享和链接分享，则不显示分享菜单
            if (!usable_items['mail_share'] && !usable_items['link_share']) {
                delete usable_items['share'];
            }

            return usable_items;
        },

        /**
         * 获取hover的文件
         * @private
         */
        _get_hover_file: function () {
            if (hover_on_file_id) {
                var cur_node = file_list.get_cur_node();
                return cur_node.get_node(hover_on_file_id);
            }
        },

        /**
         * 获取当前操作对应的文件
         * @param {Boolean} single 只要一个文件就够了
         * @private
         */
        _get_target_files: function (single) {
            var file, files;
            if (is_hover) {
                file = this._get_hover_file();
                file && (files = [file]);
            } else {
                if (single) {
                    file = file_list.get_1_sel_file();
                    file && (files = [file]);
                } else {
                    files = file_list_ui_normal._get_sel_files();
                }
            }
            return files || [];
        }
    });


    return menu;
});