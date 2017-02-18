//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["common","lib","i18n","$","main","disk_css"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//recycle/src/rec_file_object.js
//recycle/src/rec_list/rec_list.js
//recycle/src/rec_list/selection/selection.js
//recycle/src/rec_list/ui.js
//recycle/src/recycle.js
//recycle/src/toolbar/toolbar.js
//recycle/src/ui.WEB.js
//recycle/src/ui.js
//recycle/src/rec_list/rec_list.tmpl.html
//recycle/src/rec_list/selection/selection.tmpl.html
//recycle/src/recycle.WEB.tmpl.html
//recycle/src/recycle.tmpl.html

//js file list:
//recycle/src/rec_file_object.js
//recycle/src/rec_list/rec_list.js
//recycle/src/rec_list/selection/selection.js
//recycle/src/rec_list/ui.js
//recycle/src/recycle.js
//recycle/src/toolbar/toolbar.js
//recycle/src/ui.WEB.js
//recycle/src/ui.js
/**
 * 回收站File对象
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_file_object",["common"],function (require, exports, module) {

    var common = require('common'),
        File = common.get('./file.file_object'),

        undefined;

    var RecFile = function (options) {
        File.apply(this, arguments);

        this._del_time = options.del_time;
    };

    $.extend(RecFile.prototype, File.prototype, {
        get_del_time: function () {
            return this._del_time;
        }
    });

    /**
     * 解析CGI返回的文件数据
     * @param {Object} obj
     */
    RecFile.from_cgi = function (obj) {
        var
        // 公共属性
            is_dir = !!obj['folder_attr'],
            attr = obj[ is_dir ? 'folder_attr' : 'file_attr' ],
            id = obj[ is_dir ? 'folder_key' : 'file_id' ],
            name = attr[ is_dir ? 'folder_name' : 'file_name' ],
            del_time = obj[ is_dir ? 'folder_del_time' : 'file_del_time' ],
//            ttl_time = obj[ is_dir ? 'folder_ttl' : 'file_ttl' ], // 过期时间

        // 文件属性
            size = is_dir ? 0 : parseInt(obj[ 'file_size' ]) || 0;

        return new RecFile({
            is_dir: is_dir,
            id: id,
            name: name,
            del_time: del_time,
            size: size,
            cur_size: size
        });
    };

    return RecFile;
});/**
 * 回收站文件列表
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_list.rec_list",["lib","common","i18n","$","./tmpl","./rec_file_object","main","./rec_list.ui","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        store = lib.get('./store'),
        date_time = lib.get('./date_time'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        RequestTask = common.get('./request_task'),
        m_speed = common.get('./m_speed'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),
        RecFile = require('./rec_file_object'),

        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),


        selection,

        files = [],
        file_set = {},

        loading = false,
        first_loaded = false,

//        ck_clear_time = 'rec_c_tm' + query_user.get_uin_num(),
        re_ck_clear_time = /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/, // cookie值有效性判断

        undefined;

    var rec_list = new Module('recycle_list', {

        ui: require('./rec_list.ui'),

        render: function () {

            selection = require('./rec_list.selection.selection');

            this
                .on('activate', function () {
                    // 激活时刷新列表
                    this.reload();
                })
                .on('deactivate', function () {
                    // 清空缓存
                    this.clear_cached_files();
                });


            if (this.is_activated()) {
                this.reload();
            }
        },

        // fix bug 48746919 by cluezhang, at 2013/06/06
        // 原本它是定义为常量，但如果加载此模块时用户还没有登录，就会导致key异常
        // 如果一开始登录就进去的是回收站(#m=recycle)，就是没有uin
        // 如果一开始登录的是网盘，再切换到回收站就是带uin
        get_ck_clear_time: function () {
            return 'rec_c_tm' + query_user.get_uin_num();
        },

        reload: function () {
            var me = this;

            query_user
                .get(false, true)
                .ok(function () {
                    me.load();
                });
        },

        /**
         * 读取回收站文件列表
         */
        load: function () {
            var me = this;
            if (loading) // 防止重复加载
                return;

            loading = true;

            this.trigger('before_load');

            try {
                m_speed.start('recycle', 'list_show');
            }
            catch (e) {
            }

            request.get({
                cmd: 'recycle_query_list',
                cavil: true
            })
                .ok(function (msg, body) {

                    var _datas = (body['files'] || []).concat(body['folders'] || []),
                        _files = $.map(_datas, function (obj) {
                            return RecFile.from_cgi(obj);
                        });

                    // 根据清空回收站的时间过滤掉不应该出现的文件
                    var clear_time = store.get(me.get_ck_clear_time());
                    if (clear_time && re_ck_clear_time.test(clear_time)) {
                        _files = collections.grep(_files, function (f) {
                            return f.get_del_time() > clear_time;
                        });
                    }

                    files = _files;
                    file_set = collections.array_to_set(files, function (f) {
                        return f.get_id();
                    });

                    me.trigger('load', files);

                    me.trigger_empty_if();
                })
                .fail(function (msg, ret) {
                    me.trigger('load_error', msg, ret);
                })
                .done(function () {
                    loading = false;
                    me.trigger('after_load');

                    // 首次加载列表
                    if (!first_loaded) {
                        first_loaded = true;
                        me.trigger('first_load_done');
                    }
                });
        },

        /**
         * 还原文件
         */
        restore_files: function (file) {
            var me = this,
                files = selection.get_selected_files();
            if (files.length || file) {
                if (file) {
                    files[0] = file;
                }
                var restore_task = new RestoreTask(files);

                me
                    .listenTo(restore_task, 'step', function (cursor, length) {
                        me.trigger('restore_step', cursor, length);
                    })
                    .listenTo(restore_task, 'has_ok', function (ok_ids) {
                        me.trigger('restore_has_ok', ok_ids);
                        //还原文件后刷新用户空间
                        space_info.refresh();
                    })
                    .listenTo(restore_task, 'all_ok', function (msg, ok_ids) { // all_ok与part_ok互斥
                        var files = me.remove_files(ok_ids);
                        me.trigger('restore_all_ok', msg, ok_ids, files);
                    })
                    .listenTo(restore_task, 'part_ok', function (msg, ok_ids) {
                        var files = me.remove_files(ok_ids);
                        me.trigger('restore_part_ok', msg, ok_ids, files);
                    })
                    .listenTo(restore_task, 'error', function (msg) {
                        me.trigger('restore_error', msg);
                    })
                    .listenTo(restore_task, 'done', function () {
                        me.trigger('restore_done');
                    });

                restore_task.start();
            }
        },

        /**
         * 清空
         */
        clear_files: function () {
            var me = this;

            me.trigger('clear_start');

            request.post({
                cmd: 'recycle_clear',
                cavil: true
            })
                .ok(function (msg, body) {

                    files = [];
                    file_set = {};

                    me.trigger('clear', msg);
                    me.trigger_empty_if();

                    console.warn('timestamp', body['timestamp']);

                    // 记录清空回收站的时间，以便在加载列表前筛选掉『已删除』的文件
                    store.set(me.get_ck_clear_time(), body['timestamp']);
                })
                .fail(function (msg) {
                    me.trigger('clear_fail', msg);
                })
                .done(function () {
                    me.trigger('clear_done');
                })
        },

        /**
         * 获取回收站文件列表
         * @returns {Array<RecFile>}
         */
        get_files: function () {
            return files;
        },

        /**
         * 判断回收站本地缓存是否有文件
         */
        has_files: function () {
            return files.length > 0;
        },

        /**
         * 根据文件ID获取RecFile
         * @param {String} id
         * @returns {RecFile}
         */
        get_file_by_id: function (id) {
            return file_set[id];
        },

        /**
         * 清空缓存中的文件
         * @param {Array<String>} ids
         * @returns {Array<RecFile>} 已删除的文件
         */
        remove_files: function (ids) {
            var me = this,
                files = this.get_files(),
                to_remove_files = $.map(ids, function (id) {
                    return me.get_file_by_id(id);
                }),
                to_removed_file_set = collections.array_to_set(to_remove_files, function (f) {
                    return f.get_id();
                });

            for (var i = files.length - 1; i >= 0; i--) {
                var f = files[i];
                var id = f.get_id();
                if (id in to_removed_file_set) {
                    files.splice(i, 1);
                    delete file_set[id];
                }
            }

            this.trigger('remove_files', to_remove_files);
            this.trigger_empty_if();

            return to_remove_files;
        },

        /**
         * 清空缓存中的所有文件
         */
        clear_cached_files: function () {
            files = [];
            this.trigger('clear_cached_files');
        },

        _last_empty_trigger: null,

        /**
         * 触发是否有文件的事件
         */
        trigger_empty_if: function () {
            var trigger;
            // 空的
            if (files.length === 0) {
                trigger = 'empty';
            } else {
                trigger = 'not_empty';
            }
            if (this._last_empty_trigger !== trigger) {
                this.trigger(trigger);
            }
        }
    });

    /**
     * 批量还原
     * @param {Array<RecFile>} files
     * @param {String} [op]
     * @constructor
     */
    var RestoreTask = function (files, op) {

        //检测还原文件大小是否超出网盘剩余容量
        if (space_info) {
            var total_restore = 0;
            for (var i = 0; i < files.length; i++) {
                total_restore += files[i].get_size();
            }
            if (total_restore > space_info.ui.get_total_space() - space_info.ui.get_used_space()) {
                mini_tip.warn(_('还原文件大小超过剩余容量'));
                return;
            }
        }

        RequestTask.call(this, {
            files: files,
            step_size: query_user.get_cached_user().get_rec_restore_step_size(),
            op: op,
            cmd_parser: function (frag_files) {
                return frag_files[0].is_dir() ? 'recycle_batch_undel_folder' : 'recycle_batch_undel_file';
            },
            data_parser: function (frag_files) {
                var data = {},
                    first = frag_files[0];

                if (first.is_dir()) {
                    data['folders'] = $.map(frag_files, function (file) {
                        return {
                            dir_key: file.get_id()
                        };
                    });
                } else {
                    data['files'] = $.map(frag_files, function (file) {
                        return {
                            file_id: file.get_id()
                        };
                    });
                }
                return data;
            }
        });
    };

    $.extend(RestoreTask.prototype, RequestTask.prototype);

    return rec_list;
});/**
 * 批量选择文件
 * @author jameszuo
 * @date 13-1-15 上午10:42
 */
define.pack("./rec_list.selection.selection",["lib","common","$","./tmpl","./rec_list.rec_list","./rec_list.ui"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        Selectable = lib.get('./ui.selectable'), // lib.ui.Selectable

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        File = common.get('./file.file_node'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        rec_list,
        rec_list_ui,

    // -----------------------------

        SELECTED_CLASS = 'ui-selected',
        ITEM_CLASS = 'list',

    // 在这些元素上点击鼠标不会取消已选择
        KEEP_SELECT_ON = '[data-no-selection], object, embed, .' + SELECTED_CLASS,

    // 点击这些元素时，不执行选中或取消选中
        SELECT_CANCEL = 'input, textarea, button, a, ' + KEEP_SELECT_ON,

    // --- 华丽的分割线 --------------------------------------------

        selectable,

        $lists, // 列表DOM

        undefined;

    var selection = new Module('recycle_file_selection', {

        render: function () {

            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');

            // selectable
            selectable = new Selectable({
                target: rec_list_ui.get_$list(),
                child_filter: '.' + ITEM_CLASS,
                keep_select_on: KEEP_SELECT_ON,
                select_cancel: SELECT_CANCEL,
                ctrl_multi: false
            });

            // 框选日志上报
            selectable.on('box_selection_stop', function () {
                if (selectable.has_selected()) {
                    user_log('BOX_SELECTION');
                }
            });

            this
                // 传递选中事件
                .listenTo(selectable, 'select_change', function (change_status) {
                    var len = change_status.new_sel_id_arr.length;
                    this.trigger('select_change', len);
                    log_event.trigger('sel_files_len_change', len);
                })
                // 清空事件
                .listenTo(selectable, 'clear', function () {
                    this.trigger('select_change', 0);
                    log_event.trigger('sel_files_len_change', 0);
                })
                // 文件被删除时，移除已选中文件中相符的文件
                .listenTo(rec_list_ui, 'removed_$items', function ($item_ids) {
                    selectable.select_item($item_ids, false, true);
                })
            ;

            this
                .on('activate', function () {
                    var me = this;
                    me.enable();
                })
                .on('deactivate', function () {
                    var me = this;
                    me.clear();
                    me.disable();
                });
        },

        /**
         * 启用框选
         */
        enable: function () {
            this.disable();

            selectable.enable();

            this.listenTo(rec_list, 'load', function (items, list) {
                selectable.refresh();
            });
        },

        disable: function () {

            selectable.disable();

            this.stopListening(rec_list, 'load');
        },

        /**
         * 设置过滤器
         * @param {String|jQuery|HTMLElement} lists 可框选的列表
         */
        set_filter: function (lists) {
            // 启用框选
            selectable.set_filter(lists, '.' + ITEM_CLASS);

            this.enable();

            $lists = $(lists);
            return true;
        },

        /**
         * 选中这些文件
         * @param {Boolean} flag 是否选中
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} trigger_event 是否触发 stop 事件
         */
        _toggle_select: function (flag, args, trigger_event) {
            if (args.length) {

                trigger_event = trigger_event == undefined ? true : trigger_event;

                var $items;

                // 传入的是DOM
                if (args[0] instanceof jQuery || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                } else {

                    var file_ids;

                    // 传入的是File实例数组，获取ID
                    if (File.is_instance(args[0])) {
                        file_ids = $.map(args, function (file) {
                            return file.get_id();
                        });
                    }
                    // 传入的是ID数组
                    else if (typeof args[0] == 'string') {
                        file_ids = args;
                    }

                    // DOM
                    $items = $.map(file_ids, function (file_id) {
                        return rec_list_ui.get_$item(file_id);
                    });
                }

                selectable.select_item($items, flag, trigger_event);
            }
        },

        /**
         * 选中这些文件
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} trigger_event 是否触发 stop 事件
         */
        select: function (args, trigger_event) {
            this._toggle_select(true, args, trigger_event);
        },

        /**
         * 取消选中这些文件
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} trigger_event 是否触发 stop 事件
         */
        unselect: function (args, trigger_event) {
            this._toggle_select(false, args, trigger_event);
        },

        /**
         * 清除选中
         */
        clear: function () {
            selectable.clear_selected();
        },

        /**
         * 获取选中的文件DOM
         * @return {jQuery|HTMLElement}
         */
        get_selected_$items: function () {
            return selectable.get_selected_$items();
        },

        /**
         * 判断是否有选中的文件
         */
        has_selected: function () {
            return selectable.has_selected();
        },

        /**
         * 获取选中的文件ID
         * @param {jQuery|HTMLElement} [$items] 获取这些文件DOM的ID，可选
         * @return {Array} 文件ID数组
         */
        get_selected_file_ids: function ($items) {
            return $.map($items || this.get_selected_$items(), function (item) {
                return $(item).attr('data-file-id');
            });
        },

        get_selected_files: function () {
            var ids = this.get_selected_file_ids(),
                files = $.map(ids, function (id) {
                    return rec_list.get_file_by_id(id);
                });
            return files;
        }
    });

    return selection;
});
/**
 * 回收站文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_list.ui",["lib","common","i18n","$","./tmpl","./rec_list.rec_list","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        routers = lib.get('./routers'),
        collections = lib.get('./collections'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        global_event = common.get('./global.global_event'),
        global_var = common.get('./global.global_variable'),
        Paging_Helper = common.get('./ui.paging_helper'),
        mini_tip = common.get('./ui.mini_tip'),
        m_speed = common.get('./m_speed'),

        tmpl = require('./tmpl'),

    // 列表头
        cm,

        selection,
        rec_list,


    // 要添加的文件队列
        add_files_queue = [],
        paging_helper,

        scroll_listening = false, // 正在添加中

        undefined;

    var ui = new Module('rec_list_ui', {

        render: function ($list_to) {
            var me = this;

            me._$el = $(tmpl.recycle_list()).hide().appendTo($list_to);
            me._$file_list = $('#_recycle_file_list');

            rec_list = require('./rec_list.rec_list');

            me._render_selection();
//            me._render_column_header();

            me
                // 加载列表的事件
                .listenTo(rec_list, 'load', function (files) {
                    // 插入节点
                    me.set_$items(files);
                })
                .listenTo(rec_list, 'first_load_done', function () {
                })
                .listenTo(rec_list, 'before_load', function () {
                    widgets.loading.show(); // TODO progress group 分组
                })
                .listenTo(rec_list, 'after_load', function () {
                    widgets.loading.hide();
                })
                .listenTo(rec_list, 'load_error', function (msg) {
                    mini_tip.error(msg);
                })

                // 还原的事件
                .listenTo(rec_list, 'restore_step', function (cursor, length) {
                    progress.show(_('正在还原第{0}/{1}个文件', cursor, length));
                })
                .listenTo(rec_list, 'restore_all_ok', function (msg, ok_ids, files) {
                    msg = me._get_to_disk_msg(true, msg, files);

                    // 回到网盘后会高亮的ID
                    global_var.set('recycle_restored_ids', (global_var.get('recycle_restored_ids') || []).concat(ok_ids));

                    mini_tip.ok(msg);
                })
                .listenTo(rec_list, 'restore_part_ok', function (msg, ok_ids, files) {
                    msg = me._get_to_disk_msg(false, msg, files);
                    mini_tip.warn(msg);

                    global_var.set('recycle_restored_ids', ok_ids);
                })

                .listenTo(rec_list, 'restore_error', function (msg) {
                    mini_tip.error(msg);
                })

                .listenTo(rec_list, 'restore_done', function () {
                    progress.hide();
                })

                // 清空的事件
                .listenTo(rec_list, 'clear', function (msg) {
                    mini_tip.ok(_('清空完成'));
                    me.clear_$items();
                })
                .listenTo(rec_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(rec_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
                });


            me
                // 激活时，渲染列表DOM
                .on('activate', function () {
                    me.trigger('list_height_changed');
                });


            // 监听这些会导致列表状态变化的事件
            me.on('add_$items remove_$items clear_$items', function () {
                if (me.is_activated()) {
                    me.trigger('list_height_changed');
                }
            });

            // 清空后，更新还原按钮上显示的数值
            me.on('clear_$items', function () {
                if (me.is_activated()) {
                    selection.clear();
                }
            });

            //文件列表的还原按钮事件监听
            me.get_$list().on('click.restore_btn', '[data-action="restore"]', function (e) {
                e.preventDefault();
                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = rec_list.get_file_by_id(file_id);
                rec_list.restore_files(file);
            });

            // 初始化分页信息
            me._render_paging();

            //ie6鼠标hover
            me._render_ie6_fix();
        },

        append_$items: function (files, is_first_page) {
            this._$el.show();
            this.add_$items(files, is_first_page);
        },

        /**
         * 添加文件DOM（队列方式，延迟添加）
         * @param {FileNode} files
         * @param {Boolean} is_first_page 是否是首屏（首屏加载 add_items_first_page 个文件）
         */
        add_$items: function (files, is_first_page) {
//            console.debug('添加文件队列 ' + dirs.length + '目录, ' + files.length + '文件,' + (is_first_page ? '首屏' : '非首屏'));

            if (files && files.length) {
                add_files_queue = add_files_queue.concat(files);
            }

            // 首屏要立刻插入 or 判断高度来决定是否要立刻插入
            this.fill_$items(is_first_page);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 填充DOM
         * 首屏要立刻插入
         * 通过判断滚动高度来决定是否要立刻插入文件DOM
         * @param {Boolean} is_first_page
         */
        fill_$items: function (is_first_page) {
            if (is_first_page || paging_helper.is_reach_bottom()) {
                this._add_$items_from_quque(is_first_page);
            }
        },

        /**
         * 从队列中取文件并插入DOM
         * @param {Boolean} is_first_page
         */
        _add_$items_from_quque: function (is_first_page) {
            if (!add_files_queue.length) {
                this._stop_listen_scroll();
                this.trigger('add_$items', []);
                return;
            }

            var me = this,
                step_files,
                files_html,
                line_size = paging_helper.get_line_size(),
                line_count = paging_helper.get_line_count(is_first_page),
                add_count = line_size * line_count;

            // 文件队列
            if (add_files_queue.length && add_count > 0) {
                step_files = add_files_queue.splice(0, add_count);
                files_html = tmpl.recycle_list_item({ files: step_files });
                this._$file_list.append(files_html);
            }
            else {
                step_files = [];
            }

//            console.debug('添加文件队列 本次处理了' + step_dirs.length + '目录，' + step_files.length + '文件；剩余' + add_dirs_queue.length + '目录，' + add_files_queue.length + '文件');

            this.trigger('add_$items', step_files);


            // 如果队列中没有了，则停止监听滚动
            if (!add_files_queue.length) {
                me._stop_listen_scroll();
            }
        },


        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(global_event, 'window_scroll', function (e) {

                    // 判断滚动高度
                    if (paging_helper.is_reach_bottom()) {
                        this._add_$items_from_quque();
                    }

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
                // clear_timeout(add_items_timer);
                this.stopListening(global_event, 'window_scroll');
                scroll_listening = false;
                add_files_queue = [];
//                console.debug('添加文件队列 进程已终止');
            }
        },

        /**
         * 替换文件
         * @param {Array<RecFile>} files
         */
        set_$items: function (files) {
            files = files || [];

            if (files.length) {
                files = collections.sort_by(files, function (file) {
                    return file.get_del_time()
                });
                files.reverse();
            }

            this.clear_$items(true);
            this.append_$items(files, true);


            // 测速
            try {
                m_speed.done('recycle', 'list_show');
                m_speed.send('recycle');
            }
            catch (e) {
            }
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        clear_$items: function (silent) {
            this._stop_listen_scroll();

            this._$file_list.empty();

            if (!silent) {

                this.trigger('clear_$items');
            }
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

            selection.unselect($items);
            $items.remove();

            this.trigger('removed_$items', $item_ids);
        },

        /**
         * 获取某个文件的DOM
         * @param {String} file_id
         */
        get_$item: function (file_id) {
            return $('#_rec_file_' + file_id);
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

            this.add_sub_module(selection);
        },

        _get_to_disk_msg: function (is_all_ok, msg, files) {
            if (is_all_ok) {
                // for wording
                var dir_len = 0, file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                if(dir_len>0){
                    wording = file_len>0 ? _('成功还原{0}个文件夹和{1}个文件') : _('成功还原{0}个文件夹');
                }else{
                    wording = _('成功还原{1}个文件');
                }
                msg = _(wording, dir_len, file_len);
            }
            else if (msg) {
                msg = _('部分文件还原失败：{0}', msg);
            }
            return msg;
        },


        // 分页逻辑
        _render_paging: function () {

            paging_helper = new Paging_Helper({
                $container: this.get_$list().parent(),
                item_width: 0,
                item_height: 52,    // .ui-item 的高度
                fixed_height: 131,
                is_list: true
            });
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
});/**
 * 回收站主
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./recycle",["lib","common","$","main","./ui","./rec_list.rec_list","./toolbar.toolbar"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        routers = common.get('./routers'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;


    var recycle = new Module('recycle', {

        ui: require('./ui'),

        /**
         * 渲染子模块
         * @param {Module} sub_module
         * @param {*} arg1
         * @param {*} arg2
         */
        render_sub: function (sub_module, arg1, arg2 /*...*/) {
            try {
                var args = slice.call(arguments, 1);
                sub_module.render.apply(sub_module, args);

                this.add_sub_module(sub_module);
            } catch (e) {
                console.error('disk.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;
        }
    });

    recycle.on('render', function () {
        var ui = this.ui,
            rec_list = require('./rec_list.rec_list'),
            tbar = require('./toolbar.toolbar');

        this.render_sub(rec_list, ui.get_$view());

        if (constants.UI_VER === 'WEB') {
            this.render_sub(tbar, ui.get_$toolbar());
        } else {
            this.render_sub(tbar, main_ui.get_$bar1());
        }
    });

    return recycle;
});/**
 * 回收站工具条
 * @author unitwang
 * @date 13-8-26
 */
define.pack("./toolbar.toolbar",["lib","common","i18n","$","./rec_list.rec_list","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),
        widgets = common.get('./ui.widgets'),

        rec_list = require('./rec_list.rec_list'),
        selection = require('./rec_list.selection.selection'),

        toolbar,
        nil = _('请选择文件'),
        status,

        undef;

    var tbar = new Module('recycle_toolbar', {

//        ui: require('./toolbar.ui'),

        render: function ($to) {
            var btns = [
                //还原
                new Button({
                    id: 'restore',
                    label: _('还原'),
                    cls: 'btn btn-restore',
                    icon: 'ico ico-restore',
                    handler: function () {
                        rec_list.restore_files();
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_RESTORE');
                    },
                    validate: function () {
                        if (selection.get_selected_files().length === 0) {
                            return [nil, 'ok'];
                        }
                    }
                }),
                //清空回收站
                new Button({
                    id: 'emptyrecycle',
                    label: _('清空回收站'),
                    cls: 'btn btn-emptyrecycle',
                    icon: 'ico ico-emptyrecycle',
                    handler: function () {
                        widgets.confirm(_('清空回收站'), _('确定清空回收站吗？'), _('清空后将无法找回已删除的文件'), function () {
                            if (rec_list) {
                                rec_list.clear_files();
                            }
                        }, $.noop, [_('清空')]);
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_CLEAR');
                    },
                    validate: function () {
                        if (!rec_list.has_files()) {
                            return [_("您的回收站内没有文件"), 'ok'];
                        }
                    }
                })
            ];

            toolbar = new Toolbar({
                cls: 'recycle-toolbar',
                btns: btns
            });

            toolbar.render($to);

            var $btns = toolbar.get_$el().children().detach();

            var $wrapper = $('<div class="inner"/>').appendTo(toolbar.get_$el());
            $btns.appendTo($wrapper);
        },

        get_$el: function () {
            return toolbar.get_$el();
        }
    });

    return tbar;
});/**
 *
 * @author jameszuo
 * @date 13-8-29
 */
define.pack("./ui.WEB",["$","common","./ui","./tmpl"],function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),

        constants = common.get('./constants'),

        ui = require('./ui'),
        tmpl = require('./tmpl');

    return {
        get_$header: function () {
            var $el = this._$header, active_el;
            if (!$el) {
                $el = this._$header = $(tmpl['header_' + constants.UI_VER]());
                // IE6 hover伪类hack
                if ($.browser.msie && $.browser.version < 7) {
                    $el.on('mouseenter', 'td', function () {
                        $(this).addClass('hover');
                    })
                        .on('mouseleave', 'td', function () {
                            $(this).removeClass('hover');
                        });
                }
                // IE、Opera active伪类hack
                if ($.browser.msie || $.browser.opera) {
                    $el.on('mousedown', 'td', function () {
                        active_el = $(this);
                        active_el.addClass('active');
                        $(document.body).one('mouseup', function () {
                            if (active_el) {
                                active_el.removeClass('active');
                                active_el = null;
                            }
                        });
                    });
                }
            }
            return this._$header || (this._$header = $(tmpl.header()));
        }
    };
});/**
 * 回收站UI逻辑
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./ui",["disk_css","lib","common","i18n","$","./tmpl","main","./toolbar.toolbar","./rec_list.rec_list","./rec_list.ui","./ui.WEB"],function (require, exports, module) {

    require('disk_css');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        web_ui = constants.UI_VER === 'WEB',

    // 工具栏
        toolbar,
    // 列表
        rec_list,
        rec_list_ui,

        $win = $(window),

        bottom_fix = constants.UI_VER === 'APPBOX' ? 10 : 0,
        bottom_padding,
        last_has_files,

        undefined;

    var ui = new Module('recycle_ui', {

        render: function () {
            if (web_ui) {
                this.get_$header().appendTo(main_ui.get_$header_box());
            }

            this.get_$body().appendTo(main_ui.get_$body_box());

            toolbar = require('./toolbar.toolbar');
            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');

            this.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });

            this
                .on('activate', function () {
                    if (web_ui) {
                        this.get_$header().show();
                    }

                    // fix bug 48696923 by cluezhang, at 2013/05/09.
                    // IE7下可能出现Tip消息背景渲染错误，需要强制进行重绘。
//                    if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
//                        this.get_$header().repaint();
//                    }
                    this.get_$body().show();

                    // 有文件时显示列表，无文件时显示提示
                    this
                        .listenTo(rec_list, 'empty', function () {
                            this._toggle_$rec_list(false);
                            this._fix_view_height();
                        })
                        .listenTo(rec_list, 'not_empty', function () {
                            this._toggle_$rec_list(true);
                            this._fix_view_height();
                        })

                        // 列表删除文件、重绘时，更新最小高度
                        .listenTo(rec_list_ui, 'list_height_changed', function () {
                            this._fix_view_height();
                        })

                        .listenTo(global_event, 'window_resize', function () {
                            this._fix_view_height();
                        });

                    if (web_ui) {
                        global_event.trigger('page_header_height_changed');
                    }

                    document.title = _('回收站') + ' - '+ _('微云');
                })
                .on('deactivate', function () {
                    if (constants.UI_VER === 'WEB') {
                        this.get_$header().hide();
                        global_event.trigger('page_header_height_changed');
                    }
                    this.get_$body().hide();

                    this
                        .stopListening(rec_list, 'empty not_empty')
                        .stopListening(global_event, 'window_resize');
                });
        },

        // --- 获取一些DOM元素 ---------

        get_$body: function () {
            return this._$body || (this._$body = $(tmpl.body()));
        },

        get_$view: function () {
            return $('#_recycle_view');
        },

        get_$toolbar: function () {
            return $('#_recycle_toolbar_container');
        },

        get_$empty_tip: function () {
            return $('#_recycle_empty_tip');
        },

        /**
         * 设置列表、列表头是否可见，不可见时显示空提示
         * @param {Boolean} has_files
         * @private
         */
        _toggle_$rec_list: function (has_files) {

            if (last_has_files !== has_files) {

                // 列表
                this.get_$view().toggle(has_files);
                // 空提示
                this.get_$empty_tip().toggle(!has_files);

                last_has_files = has_files;

                if (constants.UI_VER === 'WEB') {
                    global_event.trigger('page_header_height_changed');
                }
            }
        },

        // 调整视图高度
        _fix_view_height: function () {
            var $empty = this.get_$empty_tip(),
                $view = this.get_$view().add($empty).filter(':visible');

            if (!$view.length) {
                return;
            }

            var $body = this.get_$body();

            $view.css('height', '');

            var offset_top = $view.offset().top,
                view_out_height = $view.outerHeight(true),
                view_height = $view.height(),
                win_height = $win.height(),
                new_height = '';

            if (typeof bottom_padding !== 'number') {
                bottom_padding = bottom_fix + (parseInt($body.css('padding-bottom')) || 0) + (parseInt($body.css('margin-bottom')) || 0);
            }

            var view_bottom = offset_top + view_out_height;

            if (view_bottom < win_height - bottom_padding) {
                new_height = view_height + (win_height - view_bottom - bottom_padding);
            }
            $view.css('height', new_height);
        }
    });

    var ex;
    if (constants.UI_VER === 'WEB') {
        ex = require('./ui.WEB');
    }
    if (ex) {
        $.extend(ui, ex);
    }

    return ui;
});
//tmpl file list:
//recycle/src/rec_list/rec_list.tmpl.html
//recycle/src/rec_list/selection/selection.tmpl.html
//recycle/src/recycle.WEB.tmpl.html
//recycle/src/recycle.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'recycle_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="files-view">\r\n\
        <div id="_recycle_file_list" class="files">\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'recycle_list_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        text = lib.get('./text'),
        constants = common.get('./constants'),
        appbox_ui = constants.UI_VER === 'APPBOX',

        files = data.files,

        // fix 日期长度
        time_str_len = 'yyyy-MM-dd hh:mm'.length;


    $.each(files, function (i, file) {  __p.push('        <div id="_rec_file_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('" data-list="file" class="list clear">\r\n\
            <label class="checkbox"></label>\r\n\
            <span class="img">\r\n\
                <i class="filetype icon-');
_p(file.is_broken_file() ? 'filebroken' : (file.get_type() || 'file'));
__p.push('"></i>\r\n\
            </span>\r\n\
            <span class="name ellipsis">\r\n\
                <p class="text"><em>');
_p(text.text(file.get_name()));
__p.push('</em></p>\r\n\
            </span>');
 if (appbox_ui) { __p.push('                <span class="tool">\r\n\
                    <a class="link-restore" data-action="restore" title="');
_p(_('还原'));
__p.push('" href="#" data-tj-value="52116"><i class="ico-restore"></i></a>\r\n\
                </span>');
 } __p.push('            <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
            <span class="time">');
_p(file.get_del_time().substr(0, time_str_len));
__p.push('</span>\r\n\
        </div>');

    });
    __p.push('');

return __p.join("");
},

'dragging_cursor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        length = data.files.length,
        files = data.files.slice(0, 4);
    __p.push('    <div class="icons">');
 $.each(files, function (i, file) { __p.push('            <i class="icon icon');
_p( i );
__p.push(' filetype icon-');
_p( file.get_type() );
__p.push('"></i>');
 }); __p.push('    </div>\r\n\
    <span class="sum">');
_p( length );
__p.push('</span>\r\n\
');

return __p.join("");
},

'header_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="header-att recycle-header-att">\r\n\
        <div class="box_mod_maintools">\r\n\
            <!-- 工具条s -->\r\n\
            <div id="_recycle_toolbar_container"></div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 列头 -->\r\n\
        <div id="_recycle_list_column_model" style="display:none;"></div>\r\n\
    </div>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var _ = require('i18n'); __p.push('    <div id="_recycle_body" class="box_mod_datalist">\r\n\
\r\n\
        <div id="_recycle_empty_tip" class="recycle-empty" style="display:none;">\r\n\
            <div class="recycle-empty-inner">\r\n\
                <i class="icon-empty"></i>\r\n\
                <h3 class="ui-title"></h3>\r\n\
                <p class="ui-text">');
_p(_('您可以在这里找回最近被删除的文件'));
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div id="_recycle_view" class="disk-view ui-view ui-listview">\r\n\
            <!-- 插入模板 rec_list -->\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
