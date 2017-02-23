/**
 *
 * @author jameszuo
 * @date 13-3-16
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        store = lib.get('./store'),
        // JSON = lib.get('./json'),

        Module = common.get('./module'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        ret_msgs = common.get('./ret_msgs'),

        file_list,

        tmpl = require('./tmpl'),

    // move 模块
        move,

        MSG_ALREADY_IN = '文件已经在该文件夹下了',
        MSG_NO_DEEP = '不能将文件移动到自身或其子文件夹下',

        STORE_KEY = 'disk_move_stepping',

        undefined;

    var ui = new Module('disk_file_move_ui', {

        render: function () {

            move = require('./file_list.file_processor.move.move');

            file_list = require('./file_list.file_list');

            this
                .listenTo(move, 'step', function (cursor, length) {
                    progress.show(text.format('正在移动第{0}/{1}个文件', [cursor, length]));
                })
                .listenTo(move, 'start', function () {
                    // 标记操作已开始
                    store.set(STORE_KEY);
                })
                .listenTo(move, 'done', function () {
                    progress.hide();
                    // 标记操作已结束
                    store.remove(STORE_KEY);
                })
                .listenTo(move, 'all_moved', function () {
                    mini_tip.ok('文件移动成功');
                })
                .listenTo(move, 'error', function (msg, ret) {
                    // hack 特殊处理1020错误码 - james
                    if (ret === ret_msgs.FILE_NOT_EXIST) {
                        msg += '，请刷新后再试';
                    }
                    mini_tip.error(msg);
                })
                .listenTo(move, 'part_moved', function (success_files, fail_files, retcode, retmsg) {
                    var msg = retmsg || ret_msgs.get(retcode);
                    // hack 特殊处理1020错误码 - james
                    if (retcode === ret_msgs.FILE_NOT_EXIST) {
                        msg += '，请刷新后再试';
                    }
                    mini_tip.warn(msg ? '部分文件移动失败：' + msg : '部分文件移动失败');
                })
                .listenTo(move, 'show_move_to', function (files, op) {
                    var box = new FileMoveBox(files, op);
                    box.show();

                    // 开始移动后隐藏对话框
                    box.listenTo(move, 'start', function () {
                        box.close();
                    });
                })

                .listenTo(move, 'show_view', function () {
                    this.show();
                });

            // 如果在 move 模块初始化时，本地存储中有 STORE_KEY 标志，则表示移动进程未正确结束
            try {
                var stored_step = store.get(STORE_KEY);
                if (stored_step) {
                    mini_tip.warn('文件移动过程已中断');
                    store.remove(STORE_KEY);
                }
            } catch (e) {
            }
        }
    });

    /**
     * 文件移动对话框
     * @param {Array<FileNode>} files
     * @param {String} op in ops
     * @constructor
     */
    var FileMoveBox = function (files, op) {

        var me = this;

        me._files = files;
        me._chosen_id = me._chosen_par_id = null;

        var root_dir = file_list.get_root_node(),
            root_id = root_dir.get_id(),
            root_par_id = root_dir.get_parent().get_id();

        me._$el = $(tmpl.file_move_box({
            files: files,
            root_dir: root_dir
        }));

        me._dialog = new widgets.Dialog({
            klass: 'full-pop-medium',
            title: '选择存储位置',
            destroy_on_hide: true,
            content: me._$el,
            buttons: [ 'OK', 'CANCEL' ],
            handlers: {
                OK: function () {
                    if (me._chosen_id && !me._has_err) {
                        move.start_move(me._files, me._chosen_par_id, me._chosen_id, op);
                    }
                }
            }
        });

        me._dialog
            .on('render', function () {

                this.get_$body()

                    // 点击目录名选中并展开
                    .on('click', 'li[data-file-id]', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var $dir = $(e.target).closest('[data-file-id]'),
                            par_id = $dir.attr('data-file-pid'),
                            dir_id = $dir.attr('data-file-id');

                        me.toggle_expand($dir);
                        me.set_chosen(par_id, dir_id);
                    });

                // 显示对话框时，监听拉取子目录列表事件
                me
                    .listenTo(move, 'load_sub_dirs', function (dir_nodes, par_id) {
                        this.render_$dirs_dom(dir_nodes, par_id);
                    })
                    .listenTo(move, 'load_sub_dirs_error', function (msg) {
                        this._dialog.error_msg(msg);
                    })
                    .listenTo(move, 'before_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, true);
                    })
                    .listenTo(move, 'after_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, false);
                    });
            })
            .on('show', function () {
                // 读取一级目录
                me.expand_load(root_par_id, root_id);
            })

            // 隐藏对话框时销毁一些东西
            .on('hide', function () {

                me._$el.remove();
                me._files = this._chosen_id = this._chosen_par_id = this._$el = null;

                // 关闭对话框时，监听拉取子目录列表事件
                me.off().stopListening();
            });

        // 选择目录前的判断
        me.on('chosen', function (par_id, dir_id) {
            var cur_node = file_list.get_cur_node(),
                cur_dir_id = cur_node ? cur_node.get_id() : undefined,
                err;

            var
            // 选中的节点DOM
                $node = this.get_$node(dir_id),
            // 目录路径
                dir_paths = $.map($node.add($node.parents('[data-dir-name]')), function (node) {
                    return $(node).attr('data-dir-name');
                });


            me.update_dir_paths(dir_paths);

            // 如果点的目录是文件所在目录，则提示
            if (dir_id == cur_dir_id) {
                err = MSG_ALREADY_IN;
            }
            // 如果点的目录是文件所在目录或其子目录，则提示
            else {
                var
                // 要移动到的目录ID路径
                    chosen_pids = collections.array_to_set($node.parentsUntil(me._$el, '[data-file-id]').andSelf(), function (it) {
                        return it.getAttribute('data-file-id');
                    }),
                // 如果文件列表中选中的文件和要移动到的目录ID路径有交集，即表示将移动文件到自身或自身子目录下面，这是不允许的操作
                    joined = collections.any(me._files, function (file) {
                        return file.get_id() in chosen_pids;
                    });
                if (joined) {
                    err = MSG_NO_DEEP;
                }
            }
            if (err) {
                me._dialog.error_msg(err);
                me._has_err = true;
            } else {
                me._dialog.hide_msg();
                me._has_err = false;
            }
            // 设置确定按钮是否可用
            me._dialog.set_button_enable('OK', !err);
        });
    };

    FileMoveBox.prototype = $.extend({

        show: function () {
            this._dialog.show();
            this._dialog.set_button_enable('OK', false);
            this.trigger('show');
        },

        close: function () {
            if (this._dialog) {
                this._dialog.hide();
            }
            this.off().stopListening();
        },

        /**
         * 渲染子目录DOM
         * @param {Array<File>} dirs
         * @param {String} dir_par_id
         */
        render_$dirs_dom: function (dirs, dir_par_id) {
            var $dir = this.get_$node(dir_par_id);
            if ($dir[0]) {

                // 箭头。
                var $arrow = $dir.children('a'),
                    cur_level = parseInt($dir.attr('data-level'), 10);
                if (dirs.length > 0) {

                    // 标记节点为已读取过
                    $dir.attr('data-loaded', 'true');

                    // 插入DOM
                    var $dirs_dom = $(tmpl.file_move_box_node_list({
                        files: dirs,
                        par_id: dir_par_id,
                        level: cur_level
                    }));

                    // 箭头
                    $arrow.addClass('expand');
                    // 展开
                    $dirs_dom.hide().appendTo($dir).slideDown('fast');
                }
                // 没有子节点就
                else {
                    // 隐藏箭头（如果移除箭头会导致滚动条抖一下）
                    $arrow.find('._expander').css('visibility', 'hidden');
                }
            }
        },

        /**
         * 展开节点
         * @param {String} par_id
         * @param {String} dir_id
         */
        expand_load: function (par_id, dir_id) {
            move.load_sub_dirs(par_id, dir_id);
        },

        /**
         * 展开、收起文件夹
         * @param {jQuery|HTMLElement} $dir
         */
        toggle_expand: function ($dir) {
            $dir = $($dir);

            var par_id = $dir.attr('data-file-pid'),
                dir_id = $dir.attr('data-file-id'),

                $ul = $dir.children('ul'),
                loaded = 'true' === $dir.attr('data-loaded');

            // 已加载过
            if (loaded) {
                var $arrow = $dir.children('a'),
                    expanded = $arrow.is('.expand');

                if (expanded) {
                    $ul.stop(false, true).slideUp('fast', function () {
                        $arrow.removeClass('expand');
                    });
                } else {
                    $ul.stop(false, true).slideDown('fast');
                    $arrow.addClass('expand');
                }
            }
            else {
                // 有 UL 节点表示已加载
                this.expand_load(par_id, dir_id);
            }
        },

        /**
         * 设置指定节点ID为已选中的节点
         * @param {String} par_id
         * @param {String} dir_id
         */
        set_chosen: function (par_id, dir_id) {
            if (this._chosen_id === dir_id && this._chosen_par_id === par_id) {
                return;
            }

            // 清除现有的选择
            if (this._chosen_id) {
                this.get_$node(this._chosen_id).children('a').removeClass('selected');
            }

            this._chosen_id = dir_id;
            this._chosen_par_id = par_id;
            this.get_$node(dir_id).children('a').addClass('selected');

            this.trigger('chosen', par_id, dir_id);
        },

        get_$node: function (dir_id) {
            return $('#_file_move_box_node_' + dir_id);
        },

        mark_loading: function (dir_id, loading) {
            this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
        },

        update_dir_paths: function(dir_paths) {
            var $paths = this.get_$dir_paths(),
                paths = dir_paths.join('\\');
            $paths.text(paths)
                .attr('title', paths);

            //判断长度是否超出
            var size = text.measure($paths, paths);
            if( size.width > 320 ) {
                var len = dir_paths.length;
                //$('#disk_upload_upload_to').html( text.smart_sub(dir_paths[len-1], 20) );
                var output = [];
                if( len>4 ) {
                    var output = text.smart_sub(dir_paths[len-2], 8) + '\\' + text.smart_sub(dir_paths[len-1], 8);
                    $paths.text( '微云\\...\\' + output );
                }
                else {
                    $.each(dir_paths,function(i,n) {
                        output.push( text.smart_sub(n,5) );
                    });
                    $paths.text(output.join('\\'));
                }
            }
        },

        get_$dir_paths: function() {
            return this._$dir_paths || (this._$dir_paths = $('#_file_move_paths_to'));
        }

    }, events);

    return ui;
});