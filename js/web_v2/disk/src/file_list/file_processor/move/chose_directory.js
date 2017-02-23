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

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip_v2'),
	    logger = common.get('./util.logger'),
        event = common.get('./global.global_event').namespace('chose_directory_event'),

        file_list,

        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),
        tmpl = require('./tmpl'),
        long_long_ago = '1970-01-01 00:00:00',


        MSG_ALREADY_IN = '文件已经在该文件夹下了',
        MSG_NO_DEEP = '不能将文件放到自身或其子文件夹下',
        done_key,
        undefined;
    //
    var dir_dialog_ui = new Module('disk_dir_dialog_ui', {

        render: function (key) {
            done_key = key;
            if (this.has_render) {
                return;
            }
            file_list = require('./file_list.file_list');
            this.has_render = true;
            this
                .listenTo(event, 'error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(event, 'show_dialog', function (files) {
                    (new FileMoveBox(files)).show();
                });

        }
    });

    /**
     * 文件移动对话框
     * @param {Array<FileNode>} files
     * @constructor
     */
    var FileMoveBox = function (files) {

        var me = this;

        me._files = files;
        me._chosen_id = me._chosen_par_id = null;

        var root_dir = file_list.get_root_node(),
            root_id = root_dir.get_id(),
            root_par_id = root_dir.get_parent().get_id();

        me._$el = $(tmpl.file_move_box({
            files: files,
            root_dir: root_dir,
            oper_name:'另存为'
        }));

        me._dialog = new widgets.Dialog({
            klass: 'full-pop-medium',
            title: '选择存储位置',
            destroy_on_hide: true,
            content: me._$el,
            buttons: [ 'OK', 'CANCEL' ],
            handlers: {
                OK: function () {

                    if (me._chosen_id) {
                        me.close();
                        event.trigger(done_key+'_done', me._files, me._chosen_par_id, me._chosen_id);
                    }
                },
                CANCEL: function(){
                    me.close();
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
                    .listenTo(event, 'load_sub_dirs', function (dir_nodes, par_id) {
                        this.render_$dirs_dom(dir_nodes, par_id);
                    })
                    .listenTo(event, 'load_sub_dirs_error', function (msg) {
                        this._dialog.error_msg(msg);
                    })
                    .listenTo(event, 'before_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, true);
                    })
                    .listenTo(event, 'after_load_sub_dirs', function (dir_id) {
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
            } else {
                me._dialog.hide_msg();
            }
            // 设置确定按钮是否可用
            me._dialog.set_button_enable('OK', !err);
        });
    };

    FileMoveBox.prototype = $.extend({
        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         */
        load_sub_dirs: function (node_par_id, node_id) {
            event.trigger('before_load_sub_dirs', node_id);
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskDirBatchList',
                cavil: true,
                resent: true,
                pb_v2: true,
                body: {
                    pdir_key: node_par_id,
                    dir_list: [{
                        dir_key: node_id,
                        //dir_mtime: long_long_ago,
                        get_type: 1
                    }]
                }
            })
                .ok(function (msg, body) {
                    var result = body['dir_list'][0],
                        retcode = result['retcode'],
                        dirs;
                    if(!retcode) {
                        dirs = result['dir_list'];
                        dirs = file_node_from_cgi.dirs_from_cgi2(dirs);
                        event.trigger('load_sub_dirs', dirs, node_id);
                    } else {
                        var msg = result.retmsg || ret_msgs.get(retcode);
                        event.trigger('load_sub_dirs_error', msg, result.retcode);
                    }
                })
                .fail(function (msg, ret) {
                    event.trigger('load_sub_dirs_error', msg, ret);
		            logger.write([
			            'disk error --------> chose_directory',
			            'disk error --------> msg: ' + msg,
			            'disk error --------> err: ' + ret,
			            'disk error --------> pdir_key: ' + node_par_id,
			            'disk error --------> dir_list dir_key: ' + node_id,
				        'disk error --------> time: ' + new Date()
		            ], 'disk_error', ret);
                })
                .done(function () {
                    event.trigger('after_load_sub_dirs', node_id);
                });
        },
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
            var $dir = this.get_$node(dir_par_id),
                cur_level = parseInt($dir.attr('data-level'), 10);
            if ($dir[0]) {

                // 箭头。
                var $arrow = $dir.children('a');
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
            this.load_sub_dirs(par_id, dir_id);
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

    return dir_dialog_ui;
});