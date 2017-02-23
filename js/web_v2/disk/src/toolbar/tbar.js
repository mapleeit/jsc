/**
 * 工具条（编辑态）
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('disk/tbar'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
    // ButtonGroup = common.get('./ui.toolbar.button_group'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        toolbar,
        status_map = {},
        nil = '请选择文件',

        undef;


    return new Module('disk_tbar', {

        /**
         * 渲染工具栏
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                    }
                },

                btns = [
                    // ====== 普通网盘工具栏按钮 ===================================
                    // 下载
                    new Button({
                        id: 'pack_down',
                        label: '下载',
                        icon: 'ico-down',
                        filter: 'normal',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_DOWNLOAD');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            //} else if (status.get_count() > constants.PACKAGE_DOWNLOAD_LIMIT) {
                            //    return '打包下载一次最多支持' + constants.PACKAGE_DOWNLOAD_LIMIT + '个文件';
                            } else if (status.has_no_down()) {
                                if (status.has_broken()) {
                                    return '不能下载破损的文件';
                                } else {
                                    return '部分文件不可下载';
                                }
                            }
                        }
                    }),
                    // 分享
                    new Button({
                        id: 'share',
                        label: '分享',
                        icon: 'ico-share',
                        filter: 'normal',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_SHARE');
                        },
                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.get_count() > constants.LINK_SHARE_LIMIT) {
                                return '链接分享一次最多支持' + constants.LINK_SHARE_LIMIT + '个文件';
                            } else if (status.has_broken()) {
                                return '不能分享破损的文件';
                            } else if (status.has_empty_file()) {
                                return '不能分享空的文件';
                            }
                        }
                    }),
                    // 移动
                    new Button({
                        id: 'move',
                        label: '移动到',
                        icon: 'ico-move',
                        filter: 'normal',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_MOVE');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.has_no_move()) {
                                if (status.has_broken()) {
                                    return '不能移动破损文件';
                                } else if (status.has_qq_disk()) {
                                    return '不能移动QQ硬盘目录';
                                } else {
                                    return '部分文件不可移动';
                                }
                            }
                        }
                    }),
                    // 重命名
                    new Button({
                        id: 'rename',
                        label: '重命名',
                        icon: 'ico-rename',
                        filter: 'normal',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_RENAME');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.get_count() > 1) {
                                return '只能对单个文件重命名';
                            } else {
                                if (status.has_no_rename()) {
                                    if (status.has_broken()) {
                                        return '不能对破损文件进行重命名';
                                    } else {
                                        return '部分文件不可重命名';
                                    }
                                }
                            }
                        }
                    }),
                    // 删除
                    new Button({
                        id: 'del',
                        label: '删除',
                        icon: 'ico-del',
                        filter: 'normal',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_MANAGE_DELETE');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.has_no_del()) {
                                if (status.has_net_fav()) {
                                    return '不能删除网络收藏夹目录';
                                } else if (status.has_qq_disk()) {
                                    return '不能删除QQ硬盘目录';
                                } else {
                                    return '部分文件不可删除';
                                }
                            }
                        }
                    }),
                    // 新建文件夹
                    new Button({
                        id: 'mkdir',
                        label: '新建文件夹',
                        icon: 'ico-mkdir',
                        filter: 'normal',
                        short_key: 'ctrl+alt+n',
                        handler: default_handler,
                        before_handler: function() {
                            user_log('TOOLBAR_MANAGE_MKDIR');
                        }
                    }),
                    //刷新按钮
                    new Button({
                        id: 'refresh',
                        label: '',
                        icon: 'ico-ref',
                        filter: 'normal',
                        short_key: 'ctrl+alt+r',
                        handler: default_handler ,
                        before_handler: function () {
                            user_log('NAV_DISK_REFRESH');
                        }
                    }),

                    // ====== 离线文件 ============================================
                    // 删除
                    new Button({
                        id: 'offline_remove',
                        label: '删除',
                        icon: 'ico-del',
                        filter: 'offline',
                        focusing: false,
                        handler: default_handler,
                        validate: function () {
                            var status = me.get_status(this.get_filter());
                            if (status.get_count() === 0) {
                                return nil;
                            }
                        }
                    }),
                    // 另存为
                    new Button({
                        id: 'offline_save_as',
                        label: '另存为',
                        icon: 'ico-saveas',
                        filter: 'offline',
                        focusing: false,
                        handler: default_handler,
                        validate: function () {
                            var status = me.get_status(this.get_filter());
                            if (status.get_count() === 0) {
                                return nil;
                            }
                        }
                    }),
                    // 刷新
                    new Button({
                        id: 'offline_refresh',
                        label: '',
                        icon: 'ico-ref',
                        filter: 'offline',
                        short_key: 'ctrl+alt+r',
                        handler: default_handler
                    })
                ];


            $(tmpl.editbar()).appendTo($to.empty());
            this._$editbar = $to;

            toolbar = new Toolbar({
                cls: 'disk-toolbar',
                apply_to: '#_main_bar1',
                btns: btns,
                filter_visible: true
            });
            toolbar.render($to);
            toolbar.filter('normal');
        },

        /**
         * 更新工具栏状态
         * @param {String} filter
         * @param {Status} status
         */
        set_status: function (filter, status) {
            status_map[filter] = status;
        },

        get_status: function (filter) {
            return status_map[filter];
        },

        //标识编辑态bar是否可见
        set_visibility: function(visibility) {
            if(!this._visibility || this._visibility !== visibility) {
                this._visibility = visibility;
            }
        },

        get_visibility: function() {
            return !!this._visibility;
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
        },

        on_deactivate: function() {
            this.clear_$editbar();
            this.deactivate();
        },

        clear_$editbar: function() {
            this._$editbar && this._$editbar.empty();
        },

        get_$el: function () {
            return toolbar.get_$el();
        },

        toggle_toolbar: function(filter) {
            toolbar.filter(filter);
        }
    });
});