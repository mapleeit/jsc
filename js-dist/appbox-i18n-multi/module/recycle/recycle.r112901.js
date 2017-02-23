//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/recycle/recycle.r112901",["common","lib","$","main","i18n"],function(require,exports,module){

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
//recycle/src/rec_header/rec_header.js
//recycle/src/rec_list/rec_list.js
//recycle/src/rec_list/selection/selection.js
//recycle/src/rec_list/ui.js
//recycle/src/recycle.js
//recycle/src/toolbar/toolbar.js
//recycle/src/ui.js
//recycle/src/rec_header/rec_header.tmpl.html
//recycle/src/rec_list/rec_list.tmpl.html
//recycle/src/recycle.tmpl.html

//js file list:
//recycle/src/rec_file_object.js
//recycle/src/rec_header/rec_header.js
//recycle/src/rec_list/rec_list.js
//recycle/src/rec_list/selection/selection.js
//recycle/src/rec_list/ui.js
//recycle/src/recycle.js
//recycle/src/toolbar/toolbar.js
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
        this._is_selected = false;
    };

    $.extend(RecFile.prototype, File.prototype, {

        get_del_time: function () {
            return this._del_time;
        },

        is_selected: function () {
            return this._is_selected;
        },

        set_selected: function (is_sel) {
            this._is_selected = !!is_sel;
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
 * 回收站列表头
 * @author bondli
 * @date 13-10-31
 */
define.pack("./rec_header.rec_header",["lib","common","$","./tmpl","./rec_list.rec_list","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        global_event = common.get('./global.global_event'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Scroller = common.get('./ui.scroller'),
        tmpl = require('./tmpl'),
        rec_list = require('./rec_list.rec_list'),

        main_ui = require('main').get('./ui'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        file_item_height = 47,//文件列表中每一项的高度
        current_has_scrollbar = false,


        undef;

    var rec_header = new Module('rec_header', {

        render: function () {
            this
                .on('activate', function () {
                    // 监听取消全选
                    this.listenTo(global_event, 'cancel_checkall', this.cancel_checkall);
                    // 监听设置全选
                    this.listenTo(global_event, 'set_checkall', this.checkall);

                    //同步滚动条宽度到表头
                    this.listenTo(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.listenTo(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.listenTo(global_event, 'window_resize', this.sync_scrollbar_width_if);
                })
                .on('deactivate', function () {
                    // 停止监听取消全选
                    this.stopListening(global_event, 'cancel_checkall', this.cancel_checkall);
                    // 停止监听设置全选
                    this.stopListening(global_event, 'set_checkall', this.checkall);

                    this.stopListening(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.stopListening(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.stopListening(global_event, 'window_resize', this.sync_scrollbar_width_if);
                    this.cancel_checkall();
                    checkalled = false;
                });

            if(!this.rendered) {
                this.$el = $(tmpl.rec_file_header()).appendTo(this.get_$el());
                this.rendered = true;

                var me = this;

                //监听全选按钮点击事件
                this.$el.on('click', '[data-action=checkall]', function(e){
                    $(this).toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    me.trigger('action', 'checkall', checkalled, e);
                });
            }
        },

        /**
         * 根据列数数据多少判断是否出现滚动条，决定是否要同步滚动条宽度到表头
         */
        sync_scrollbar_width_if: function() {
            var files_total = rec_list.get_total(),
                body_box_height = main_ui.get_$body_box().height();


            if(files_total * file_item_height > body_box_height) {//出现滚动条
                this._sync_scrollbar_width(true);
            } else {
                this._sync_scrollbar_width(false);
            }
        },

        /**
         * 当内容区出现滚动条时，要修正表头宽度，不然会出现不对齐现象
         * @param {Boolean} has_scrollbar 是否出现了滚动条
         */
        _sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this.get_$el().find('.recycle-head').css('paddingRight', padding_right + 'px');//需要同步滚动条宽度不会很常操作，一般就一次，直接用选择器了
            current_has_scrollbar = has_scrollbar;

        },

        get_$el: function () {
            return $('#_rec_file_header');
        },

        //全选按钮
        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        },

        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
            }
        },
        //取消全选
        cancel_checkall: function() {
            if(this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, false);
                checkalled = false;
            }
        },
        //是否已全选
        is_checkalled: function() {
            return checkalled;
        }
    });

    return rec_header;
});/**
 * 回收站文件列表
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_list.rec_list",["lib","common","$","./tmpl","./rec_file_object","main","i18n","./rec_list.ui","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        RecFile = require('./rec_file_object'),

        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),

        global_event = common.get('./global.global_event'),


        selection,

        files = [],
        file_set = {},

        loading = false,
        first_loaded = false,
        refresh_loaded = false,

//        ck_clear_time = 'rec_c_tm' + query_user.get_uin_num(),
        re_ck_clear_time = /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/, // cookie值有效性判断

        _ = require('i18n').get('./pack'),
        l_key = 'recycle',

        undefined;

    var rec_list = new Module('recycle_list', {

        ui: require('./rec_list.ui'),

        render: function () {

            selection = require('./rec_list.selection.selection');

            this
                .on('activate', function () {
                    // 激活时刷新列表
                    this.reload();
                    this.listenTo(global_event, 'recycle_refresh', this.refresh);
                    // 监听是否勾选全选
                    this.listenTo(global_event, 'check_checkall', this.check_checkall);
                })
                .on('deactivate', function () {
                    // 清空缓存
                    this.clear_cached_files();
                    this.stopListening(global_event, 'recycle_refresh', this.refresh);
                    // 停止监听是否勾选全选
                    this.stopListening(global_event, 'check_checkall', this.check_checkall);
                })
                .listenTo(global_event, 'recycle_refresh', function () {
                    this.reload(true);
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

        refresh: function () {
            refresh_loaded = true;
            this.reload();
        },

        /**
         * 重新加载回收站文件列表
         * @param {Boolean} reset_ui
         */
        reload: function (reset_ui) {
            var me = this;

            me.loaded_files = []; //刷新的时候重置下
            global_event.trigger('cancel_checkall');
            me.set_checkalled(false);                   //取消全选

            query_user
                .get(false, true)
                .ok(function () {
                    me.load(reset_ui);
                });
        },

        loaded_files : [],

        //已加载的文件列表，目前有当已全选时，要选中后续加载的每条记录
        set_loaded_files : function (files) {
            if(files) {
                this.loaded_files = this.loaded_files.concat(files);
                //当前全选了，或者曾经点击了全选，加载更多的都是选择上的
                if(this.get_checkalled() || this.get_once_checkalled()) {
                    selection.toggle_select(files, true);
                }
            }
        },

        //获取已加载的文件
        get_loaded_files : function () {
            return $.map(this.loaded_files, function (file) {
                return file.get_id();
            });
        },

        //删除已加载的文件
        remove_loaded_files : function (file_ids) {
            var me = this,
                tmp = []
            //同时从已加载的里面删除
            $.each(me.loaded_files, function(i, n){
                if( $.inArray(n.get_id(), file_ids) === -1 ){
                    tmp.push(n);
                }
            });
            me.loaded_files = tmp;
        },

        //检查是否勾选上“全选”
        check_checkall : function (is_all) {
            var loaded_files_len = this.get_loaded_files().length;
            //console.log(loaded_files_len , selected_len);
            this._checkalled = !!is_all;
            global_event.trigger('set_checkall', this._checkalled);
            if(this._checkalled){
                this._once_checkalled = true;
            }
        },

        /**
         * 当已全选时，要选中后续加载的每条记录
         * @param {Boolean} checkalled 是否全选
         */
        set_checkalled: function(checkalled) {
            //获取当前已加载的文件列表
            var files = this.get_loaded_files();
            if(checkalled === true){
                selection.toggle_select(files, true);
                this._once_checkalled = true;
            }
            else {
                selection.toggle_select(files, false);
                this._once_checkalled = false;
            }
            this._checkalled = checkalled;
        },

        get_checkalled: function() {
            return this._checkalled;
        },

        //获得过去是否点击过全选
        get_once_checkalled: function() {
            return this._once_checkalled;
        },

        set_total: function(total) {
            this.total = total;
        },

        get_total: function () {
            return this.total;
        },

        /**
         * 加载回收站文件列表
         * @param {Boolean} reset_ui
         */
        load: function (reset_ui) {
            var me = this;
            if (loading) // 防止重复加载
                return;

            loading = true;

            this.trigger('before_load', reset_ui);

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

                    //设置总数，用于判断是否全部被勾选上
                    me.set_total( _files.length );

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

                    // 如果是刷新
                    if (refresh_loaded) {
                        refresh_loaded = false;
                        //me.trigger('after_refresh', '列表已更新');
                    }
                });
        },

        /**
         * 还原文件
         */
        restore_files: function (file) {   //参数file存在是：点击单个文件还原
            var me = this,
                select_files = [];

            if( !file ) { //点击了还原按钮
        
                //如果全选了，获取获取的是全部的文件
                if(me.get_checkalled()){
                    select_files = me.get_files();
                    console.log('checkalled...');
                }
                else{ //没有全选的时候需要判断是否点击过全选
                    select_files = selection.get_selected_files();

                    if(me.get_once_checkalled()){
                        console.log('once checkalled...');

                        //获取已渲染在页面的files
                        var files_in_dom = me.get_loaded_files(),
                            all_files = me.get_files(), //所有的文件
                            file_not_in_dom = [];

                        $.each(all_files, function(i, file){
                            var file_id = file.get_id();
                            if( $.inArray(file_id, files_in_dom) === -1 ){
                                file_not_in_dom.push(file);
                            }
                        });

                        select_files = $.merge(select_files, file_not_in_dom); //需要还原的文件 = 所选的+未加载到dom的
                    }
                    console.log('select_files:'+select_files.length);
                }
            }

            if (select_files.length || file) {
                if (!select_files.length && file) {
                    select_files[0] = file;
                }

                var restore_task = new RestoreTask(select_files);

                me
                    .listenTo(restore_task, 'step', function (cursor, length) {
                        me.trigger('restore_step', cursor, length);
                    })
                    .listenTo(restore_task, 'has_ok', function (ok_ids) {
                        me.set_total(me.get_total() - ok_ids.length);
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

            me.remove_loaded_files(ids); //还原了的文件从已加载中删除

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
                mini_tip.warn(_(l_key,'还原文件大小超过剩余容量'));
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
define.pack("./rec_list.selection.selection",["lib","common","$","main","./tmpl","./rec_list.rec_list","./rec_list.ui"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        File = common.get('./file.file_object'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        tmpl = require('./tmpl'),

        rec_list,
        rec_list_ui,
        scroller,
        sel_box,

        undefined;

    var selection = new Module('recycle_file_selection', {

        render: function () {

            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');
            scroller = main_ui.get_scroller();


            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                ns: 'recycle',
                $el: rec_list_ui.get_$list(),
                $scroller: scroller.get_$el(),
                keep_on: function ($tar) {
                    return !!$tar.closest('[data-file-check]').length;
                },
                clear_on: function ($tar) {
                    return !$tar.closest('[data-file-id]').length;
                },
                container_width: function () {
                    return rec_list_ui.get_$list().width();
                }
            });
            sel_box.enable();

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var all_files = rec_list.get_files(),
                    selected_len = 0;
                if (all_files.length) {
                    for (var i = 0, l = all_files.length; i < l; i++) {
                        var file = all_files[i],
                            el_id = rec_list_ui.get_el_id(file.get_id()),
                            is_sel = el_id in sel_id_map,
                            is_unsel = el_id in unsel_id_map;

                        if (is_sel) {
                            file.set_selected(true);
                            selected_len++;
                        } else if (is_unsel) {
                            file.set_selected(false);
                        }
                    }
                }
                this.trigger_changed(true);

                // 框选日志上报
                if (!$.isEmptyObject(sel_id_map)) {
                    user_log('BOX_SELECTION');
                }
            })


            this
                .on('activate', function () {
                    this.enable_selection();
                })
                .on('deactivate', function () {
                    this.disable_selection();
                });
        },

        /**
         * 选中这些文件（请尽量传入批量文件，因为执行完成后会遍历一次DOM）
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} flag 是否选中
         * @param {Boolean} [from_item_click] 是否是点击item产生
         */
        toggle_select: function (args, flag, from_item_click) {

            if (args.length) {

                var $items, files;

                // 传入的是DOM
                if (args[0] instanceof $ || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                    files = $.map($items, function ($item) {
                        return rec_list_ui.get_file_by_$el($item);
                    });
                }
                // 传入的是文件或ID数组
                else {
                    var file_ids;
                    // 传入的是File实例数组
                    if (File.is_instance(args[0])) {
                        files = args;
                    }
                    // 传入的是ID数组
                    else if (typeof args[0] == 'string') {
                        file_ids = args;
                        files = $.map(file_ids, function (file_id) {
                            return rec_list.get_file_by_id(file_id);
                        });
                    }
                }

                if (files && files.length) {

                    $.each(files, function (i, file) {
                        file.set_selected(flag);
                    });

                    // 同步至 SelectBox
                    var sel_el_ids = $.map(files, function (file) {
                        return rec_list_ui.get_el_id(file.get_id());
                    });
                    sel_box.set_selected_status(sel_el_ids, flag);

                    this.trigger_changed(from_item_click);
                }
            }
        },

        set_dom_selected: function (files) {
            if (sel_box) {
                sel_box.set_dom_selected($.map(files, function (file) {
                    return rec_list_ui.get_el_id(file.get_id());
                }), true);
            }
        },

        trigger_changed: function (trigger_check_checkall) {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            if(trigger_check_checkall) {
                global_event.trigger('check_checkall', sel_meta.is_all); //检查是否标记全选;
            }

            if(sel_meta.files.length === 0) {
                global_event.trigger('cancel_checkall'); //取消全选
            }
            log_event.trigger('sel_files_len_change', sel_meta.files.length);
        },

        /**
         * 刷新框选
         */
        refresh_selection: function () {
            if (sel_box)
                sel_box.refresh();
        },

        /**
         * 判断是否有选中
         * @return {Boolean}
         */
        has_selected: function () {
            return sel_box && sel_box.has_selected();
        },

        /**
         * 启用框选
         */
        enable_selection: function () {
            if (sel_box)
                sel_box.enable();
        },

        /**
         * 禁用框选
         */
        disable_selection: function () {
            if (sel_box) {
                this.clear();
                sel_box.disable();
            }
        },

        /**
         * 清除选中
         * @param {FileNode} [p_node] 目标目录
         */
        clear: function () {
            if (sel_box) {
                sel_box.clear_selected();

                var files = rec_list.get_files();
                if (files.length) {
                    for (var i = 0, l = files.length; i < l; i++) {
                        files[i].set_selected(false);
                    }
                }
            }
        },

        /**
         * 获取选中的文件DOM
         * @return {jQuery|HTMLElement}
         */
        get_selected_$items: function () {
            if (sel_box) {
                return $($.map(sel_box.get_selected_id_map(), function (_, el_id) {
                    return $('#' + el_id);
                }));
            } else {
                return $();
            }
        },

        /**
         * 获取选中的文件对象
         * @return {FileNode[]}
         */
        get_selected_files: function () {
            return this.get_sel_meta().files;
        },

        /**
         * 获取选中状态
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var all_files = rec_list.get_files(),
                meta = {
                    files: [],
                    is_all: false
                };

            if (all_files.length) {

                $.each(all_files, function (i, file) {
                    if (file.is_selected()) {
                        meta.files.push(file);
                    }
                });

                // 已全选
                meta.is_all = all_files.length > 0 && meta.files.length > 0 && all_files.length === meta.files.length;
            }
            return meta;
        },


        /**
         * 判断指定的文件DOM是否已被选中
         * @param {jQuery|HTMLElement} $item
         */
        is_selected: function ($item) {
            if (sel_box) {
                return sel_box.is_selected($item);
            }
        }


    });

    return selection;
});
/**
 * 回收站文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_list.ui",["lib","common","$","main","./tmpl","./ui","i18n","./rec_list.rec_list","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        mini_tip = common.get('./ui.mini_tip'),
        m_speed = common.get('./m_speed'),
        PagingHelper = common.get('./ui.paging_helper'),

        scroller = require('main').get('./ui').get_scroller(),
        tmpl = require('./tmpl'),
        rec_ui = require('./ui'),

        selection,
        rec_list,

    // 要添加的文件队列
        add_files_queue = [],
        paging_helper,

        scroll_listening = false, // 正在添加中

        _ = require('i18n').get('./pack'),
        l_key = 'recycle',

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

                // 还原的事件
                .listenTo(rec_list, 'restore_step', function (cursor, length) {
                    progress.show(text.format(_(l_key,'正在还原第{0}/{1}个文件'), [cursor, length]));
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
                    mini_tip.ok(_(l_key,'清空完成'));
                    me.clear_$items();
                })
                .listenTo(rec_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(rec_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
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
                selection.toggle_select($item, !selection.is_selected($item), true);
            });

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
            if (is_first_page || scroller.is_reach_bottom()) {
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

            if (!paging_helper) {
                paging_helper = new PagingHelper({
                    scroller: scroller,
                    is_list: true,
                    item_height: 47
                });
            }

            var me = this,
                step_files,
                files_html,
                line_size = 2 * paging_helper.get_line_size(),
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

            rec_list.set_loaded_files(step_files); //追加到已加载的文件

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
                this.listenTo(scroller, 'scroll resize', function (e) {

                    // 判断滚动高度
                    if (scroller.is_reach_bottom()) {
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
                this.stopListening(scroller, 'scroll resize');
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
         * 渲染选择器
         * @private
         */
        _render_selection: function () {
            selection = require('./rec_list.selection.selection');

            selection.render();

            this.on('sorted', function () {
                selection.clear();
            });

            this.listenTo(selection, 'select_change', function(sel_meta) {
                this._block_hoverbar_if(sel_meta.files.length);
            });

            this.add_sub_module(selection);
        },

        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                rec_ui.get_$body().addClass('block-hover');
            } else {
                rec_ui.get_$body().removeClass('block-hover');
            }
        },

        _get_to_disk_msg: function (is_all_ok, msg, files) {
            if (is_all_ok) {
                // for wording
                var dir_len = 0, file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
       //       msg = '成功还原' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
                if(dir_len && file_len){
                    msg=text.format(_(l_key,'成功还原{0}个文件夹和{1}个文件'),[dir_len,file_len]);
                }else if(dir_len){
                    msg=text.format(_(l_key,'成功还原{0}个文件夹'),[dir_len]);
                }else if(file_len){
                    msg=text.format(_(l_key,'成功还原{0}个文件'),[file_len]);
                }
            }
            else if (msg) {
                msg = _(l_key,'部分文件还原失败：') + msg;
            }
            return msg;
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
define.pack("./recycle",["lib","common","$","main","./ui","./rec_list.rec_list","./toolbar.toolbar","./rec_header.rec_header"],function (require, exports, module) {
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

        rec_list,
        tbar,
        rec_header;

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
        },

        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },

        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {  
            rec_list.set_checkalled(checkalled);
        }
        
    });

    recycle.on('render', function () {
        var me = this,
            ui = this.ui;

        rec_list = require('./rec_list.rec_list'),
        tbar = require('./toolbar.toolbar'),
        rec_header = require('./rec_header.rec_header');

        this.render_sub(rec_list, ui.get_$body());

        this.render_sub(tbar, main_ui.get_$bar1());

        this.render_sub(rec_header);

        //监听全选按钮发出事件
        this.listenTo(rec_header, 'action', function(action_name, data, e) {
            me.process_action(action_name, data, e);
        }, this);
    });

    return recycle;
});/**
 * 回收站工具条
 * @author unitwang
 * @date 13-8-26
 */
define.pack("./toolbar.toolbar",["lib","common","$","./rec_list.rec_list","./rec_list.selection.selection","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        global_event = common.get('./global.global_event'),

        rec_list = require('./rec_list.rec_list'),
        selection = require('./rec_list.selection.selection'),

        toolbar,
        _ = require('i18n').get('./pack'),
        l_key = 'recycle',

        nil = _(l_key,'请选择文件'),
        status,

        undef;

    var tbar = new Module('recycle_toolbar', {

//        ui: require('./toolbar.ui'),

        render: function ($to) {
            var btns = [
                //还原
                new Button({
                    id: 'restore',
                    label: _(l_key,'还原'),
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
                    label: _(l_key,'清空回收站'),
                    cls: 'btn btn-emptyrecycle',
                    icon: 'ico ico-emptyrecycle',
                    handler: function () {
                        widgets.confirm(_(l_key,'清空回收站'), _(l_key,'确定清空回收站吗？'), _(l_key,'清空后将无法找回已删除的文件'), function () {
                            if (rec_list) {
                                rec_list.clear_files();
                            }
                        }, $.noop, [_(l_key,'确定')]);
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_CLEAR');
                    },
                    validate: function () {
                        if (!rec_list.has_files()) {
                            return [_(l_key,"您的回收站内没有文件"), 'ok'];
                        }
                    }
                }),
                //刷新
                new Button({
                    id: 'refresh',
                    //label: _(l_key,'刷新'),
                    btn_cls: 'btn-notext',
                    cls: 'btn btn-ref',
                    icon: 'ico ico-ref',
                    handler: function () {
                        global_event.trigger('recycle_refresh');
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
            $('<div class="infor">'+_(l_key,'回收站不占用网盘空间，保留30天后将自动清除！')+'</div>').appendTo($wrapper);
        },

        get_$el: function () {
            return toolbar.get_$el();
        }
    });

    return tbar;
});/**
 * 回收站UI逻辑
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./ui",["lib","common","$","./tmpl","main","./toolbar.toolbar","./rec_list.rec_list","./rec_list.ui","./rec_header.rec_header"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

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

    // 工具栏
        toolbar,
    // 列表
        rec_list,
        rec_list_ui,
    // 列表头
        rec_header,

        $win = $(window),

        bottom_fix = constants.UI_VER === 'APPBOX' ? 10 : 0,
        bottom_padding,
        last_has_files,

        undefined;

    var ui = new Module('recycle_ui', {

        render: function () {

            this.get_$body().appendTo(main_ui.get_$body_box());

            toolbar = require('./toolbar.toolbar');
            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');
            rec_header = require('./rec_header.rec_header');

            this.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });


            this
                .on('activate', function () {
                    this.get_$header().show();
                    this.get_$body().show();

                    // 有文件时显示列表，无文件时显示提示
                    this
                        .listenTo(rec_list, 'empty', function () {
                            this._set_has_files(false);
                            this._toggle_$rec_header(false);
                            main_ui.sync_size();
                        })
                        .listenTo(rec_list, 'not_empty', function () {
                            this._set_has_files(true);
                            this._toggle_$rec_header(true);
                        });
                    main_ui.sync_size();
                    //document.title = '回收站 - 微云';
                })
                .on('deactivate', function () {
//                    if (constants.UI_VER === 'WEB') {
//                        global_event.trigger('page_header_height_changed');
//                    }
                    this.get_$body().hide();
                    this.get_$header().hide();

                    this.stopListening(rec_list, 'empty not_empty');
                });
        },

        // --- 获取一些DOM元素 ---------

        get_$body: function () {
            return this._$body || (this._$body = $(tmpl.body()));
        },

        get_$toolbar: function () {
            return $('#_recycle_toolbar_container');
        },

        get_$empty_tip: function () {
            return $('#_recycle_empty_tip');
        },

        get_$header: function () {
            return rec_header.get_$el();
        },

        _toggle_$rec_header: function (has_files) {
            var me = this;
            if (true === has_files) {
                me.get_$header().show();
            }
            else{
                me.get_$header().hide();
            }
            //me._fix_body_top(has_files);
        },

        /**
         * 设置列表、列表头是否可见，不可见时显示空提示
         * @param {Boolean} has_files
         * @private
         */
        _set_has_files: function (has_files) {
            if (last_has_files !== has_files) {
                // 隐藏列表
                //this.get_$body().toggleClass('recycle-empty', !has_files);
                this.get_$empty_tip().toggle(!has_files);
                this.get_$header().toggle(has_files);
                last_has_files = has_files;
            }
        }
    });


    return ui;
});
//tmpl file list:
//recycle/src/rec_header/rec_header.tmpl.html
//recycle/src/rec_list/rec_list.tmpl.html
//recycle/src/recycle.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'rec_file_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'recycle';
    __p.push('    <div class="inner">\r\n\
        <div class="recycle-head">\r\n\
            <span class="list name"><span class="wrap"><span class="inner">');
_p(_(l_key,'文件名'));
__p.push('                <label class="checkall" data-action="checkall" data-no-selection></label>\r\n\
            </span></span></span>\r\n\
            <span class="list size"><span class="wrap"><span class="inner">');
_p(_(l_key,'文件大小'));
__p.push('            </span></span></span>\r\n\
            <span class="list time"><span class="wrap"><span class="inner">');
_p(_(l_key,'删除时间'));
__p.push('            </span></span></span>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

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

        $ = require('$'),
        text = lib.get('./text'),
        constants = common.get('./constants'),

        files = data.files,

        // fix 日期长度
        time_str_len = 'yyyy-MM-dd hh:mm'.length,

        appbox_ui = constants.UI_VER === 'APPBOX',

        _ = require('i18n').get('./pack'),
        l_key = 'recycle';


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
            </span>\r\n\
                <span class="tool">\r\n\
                    <a class="link-restore" data-action="restore" title="');
_p(_(l_key,'还原'));
__p.push('" href="#" data-tj-value="52116"><i class="ico-restore"></i></a>\r\n\
                </span>\r\n\
            <span class="size">');
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

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'recycle';
    __p.push('    <div id="_recycle_body" class="disk-view ui-view ui-listview">\r\n\
        <div id="_recycle_empty_tip" class="g-empty sort-recycle-empty" style="display:none;">\r\n\
            <div class="empty-box">\r\n\
                <div class="ico"></div>\r\n\
                <p class="title">');
_p(_(l_key,'回收站为空'));
__p.push('</p>\r\n\
                <p class="content">');
_p(_(l_key,'您可以在这里找回最近30天删除的文件'));
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
