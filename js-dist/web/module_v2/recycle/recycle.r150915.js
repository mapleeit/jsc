//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/recycle/recycle.r150915",["lib","common","$","main"],function(require,exports,module){

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
//recycle/src/header/header.js
//recycle/src/rec_file_object.js
//recycle/src/recycle.js
//recycle/src/recycle_list/recycle_list.js
//recycle/src/recycle_list/selection/selection.js
//recycle/src/recycle_list/ui.js
//recycle/src/restore.js
//recycle/src/shred.js
//recycle/src/ui.js
//recycle/src/header/header.tmpl.html
//recycle/src/recycle.tmpl.html
//recycle/src/recycle_list/recycle_list.tmpl.html

//js file list:
//recycle/src/header/header.js
//recycle/src/rec_file_object.js
//recycle/src/recycle.js
//recycle/src/recycle_list/recycle_list.js
//recycle/src/recycle_list/selection/selection.js
//recycle/src/recycle_list/ui.js
//recycle/src/restore.js
//recycle/src/shred.js
//recycle/src/ui.js
/**
 * render _main_bar1（编辑态） & _main_bar2（列表上方的提示和按钮）& cancel_all_selected
 * @author maplemiao
 * @date 16-7-27
 */
define.pack("./header.header",["lib","common","$","./tmpl","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var header = new Module('recycle_header', {
        render: function () {
            var me = this;

            me
                .on('activate', function () {
                    me._render_main_bar1();
                    me._render_main_bar2();
                    me._add_listening();
                })
                .on('deactivate', function () {
                    me._destroy_main_bar1();
                    me._destroy_main_bar2();
                    me._remove_listening();
                });
        },

        _add_listening: function () {
            var me = this;

            // 编辑态中“取消选择”按钮，把事件抛出到src/ui.js中处理
            me.listenTo(global_event, "edit_cancel_all", function(e) {
                me.trigger('edit_cancel_all', e);
            });
        },

        _remove_listening: function () {
            var me = this;

            me.stopListening(global_event, 'edit_cancel_all');
        },

        _destroy_main_bar1: function () {
            var $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.off('click.batch_restore');
            $_main_bar1.off('click.batch_shred');
            $_main_bar1.empty();
        },

        _destroy_main_bar2: function () {
            var $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.off('click.empty_recycle');
            $_main_bar2.empty();

            $_main_bar2.hide();
        },

        _render_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.append(tmpl._main_bar1()).show();
            $_main_bar1
                .on('click.batch_restore', '[data-action="restore"]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.trigger('action', 'restore', e);
                })
                .on('click.batch_shred', '[data-action="shred"]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.trigger('action', 'shred', e);
                });
        },

        _render_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.show().append(tmpl._main_bar2());

            // “全部清空”按钮事件监听
            $_main_bar2
                .on('click.empty_recycle', '[data-action="empty_recycle"]', function (e) {
                    me.trigger('action', 'empty_recycle', e);
                });
        }
    });
    
    return header;
});/**
 * 回收站File对象
 * @author jameszuo
 * @date 13-3-22
 */
define.pack("./rec_file_object",["common"],function (require, exports, module) {

    var common = require('common'),
        File = common.get('./file.file_object'),
        https_tool = common.get('./util.https_tool'),
	    constants = common.get('./constants'),

        undefined;

	var getExt = function(_name) {
		var EXT_REX = /\.([^\.]+)$/;
		var m = (_name || '').match(EXT_REX);
		return m ? m[1].toLowerCase() : null;
	};

	var isVideo = function(fileName) {
		var EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1},
			fileType = getExt(fileName),
			is_video = fileType in EXT_VIDEO_TYPES;

		return is_video;
	};

    var RecFile = function (options) {
        File.apply(this, arguments);

        this._del_time = options.del_time;
        this._thumb_url = options.thumb_url;
	    this._https_url = options.https_url;
        this._ftn_cookie_k = options.ftn_cookie_k;
        this._ftn_cookie_v = options.ftn_cookie_v;
        this._is_selected = false;
    };

    $.extend(RecFile.prototype, File.prototype, {

        get_del_time: function () {
            return this._del_time;
        },

	    get_thumb_url: function (size, order) {
		    if(order == 'http') {
			    return this._thumb_url;
		    } else if(order == 'https') {
			    return this._https_url;
		    } else {
			    return constants.IS_HTTPS ? this._https_url : this._thumb_url;
		    }
	    },

        get_ftn_cookie_k: function () {
            return this._ftn_cookie_k;
        },

        get_ftn_cookie_v: function () {
            return this._ftn_cookie_v;
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
            is_dir = !!obj['dir_key'],
        // 公共属性
            id = obj[ is_dir ? 'dir_key' : 'file_id' ],
            name = obj[ is_dir ? 'dir_name' : 'filename' ],
            del_time = obj[ is_dir ? 'dir_dtime' : 'file_dtime' ],
            thumb_url = obj[ 'abstract_url' ],
	        https_url = obj[ 'https_url' ],

            ftn_cookie_k = thumb_url ? obj[ 'cookie_name' ] : undefined,
            ftn_cookie_v = thumb_url ? obj[ 'cookie_value' ] : undefined,

        // 文件属性
            size = is_dir ? parseInt(obj['space']) : parseInt(obj[ 'file_size' ]) || 0;

        if (thumb_url) {
	        if(!isVideo(name)) {
		        thumb_url = thumb_url + (thumb_url.indexOf('?') > -1 ? '&' : '?') + 'size=32*32';
	        } else {
		        thumb_url = thumb_url + '/64';
	        }
        }

	    if (https_url) {
		    if(!isVideo(name)) {
			    https_url = https_url + (https_url.indexOf('?') > -1 ? '&' : '?') + 'size=32*32';
		    } else {
			    https_url = https_url + '/64';
		    }
	    }


        return new RecFile({
            is_dir: is_dir,
            id: id,
            name: name,
            del_time: del_time,
            thumb_url: thumb_url,
	        https_url: https_url,
            ftn_cookie_k: ftn_cookie_k,
            ftn_cookie_v: ftn_cookie_v,
            size: size,
            cur_size: size
        });
    };

    return RecFile;
});/**
 * 回收站主
 * @author jameszuo
 * @date 13-3-22
 * modified by maplemiao
 */
define.pack("./recycle",["lib","common","$","./ui","./recycle_list.recycle_list","./header.header"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        // console = lib.get('./console'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        routers = common.get('./routers'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),

        slice = [].slice,

        recycle_list,
        header,

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
                console.error('recycle.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
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

        on_restore: function () {
            recycle_list.restore_files();
        },

        on_shred: function () {
            recycle_list.shred_files();
        },

        on_empty_recycle: function () {
            widgets.confirm('清空回收站', '确定清空回收站吗？', '清空后将无法找回已删除的文件', function () {
                if (recycle_list) {
                    recycle_list.clear_files();
                }
            }, $.noop(), ['确定']);
        }

    });

    recycle.on('render', function () {
        var me = this,
            ui = this.ui;

        //测速
        //try{
        //    var flag = '21254-1-15';
        //    if(window.g_start_time) {
        //        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
        //        huatuo_speed.report();
        //    }
        //} catch(e) {
        //
        //}

        recycle_list = require('./recycle_list.recycle_list');
        header = require('./header.header');

        this.render_sub(recycle_list, ui.get_$recycle_list());

        this.render_sub(header);

        this.listenTo(header, 'action', function(action_name, data, e) {
            me.process_action(action_name, data, e);
        }, this);
    });

    return recycle;
});/**
 * 回收站文件列表
 * @author : maplemiao
 * @time : 2016/7/28
 **/

define.pack("./recycle_list.recycle_list",["lib","common","$","./tmpl","./ui","./rec_file_object","./restore","./shred","./recycle_list.ui","./recycle_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),
        ui = require('./ui'),
        RecFile = require('./rec_file_object'), // 回收站文件对象
        restore = require('./restore'), // （批量）还原文件
        shred = require('./shred'), // （批量）清除（彻底删除）文件
        selection,

        undefined;

    // cgi cmd
    var CLEAR_FILES_CMD = 'DiskRecycleClear',
        LOAD_FILES_CMD = 'DiskRecycleList',

        undefined;

    var all_files = [], // 缓存
        file_set = {}, // 缓存，所谓缓存就是在前端js保存的一套文件列表内容

        loading = false,
        first_loaded = false,
        refresh_loaded = false,

        has_more = true,

        start_load_size = 0,   //滚动加载时的开始位置
        first_page_size = 100, // 首屏加载个数
        page_size = 30,        // 滚动分页加载个数
        no_thumb_limit = 100, // 拉取列表时，100个以内可以返回缩略图，100个以上不支持返回缩略图

        total_dir_count, //所有删除的目录数量
        total_file_count,  //所有删除的文件数量

        undefined;


    var recycle_list = new Module('recycle_list', {
        ui: require('./recycle_list.ui'),

        render : function () {
            selection = require('./recycle_list.selection.selection');

            this
                .on('activate', function () {
                    // 激活时刷新列表
                    this.reload(false);
                })
                .on('deactivate', function () {
                    this.clear_cached_files(); // 清空缓存
                });

            if (this.is_activated()) {
                this.reload(false);
            }
        },

        /**
         * 重新加载回收站文件列表
         * @param {Boolean} reset_ui
         */
        reload: function (reset_ui) {
            var me = this;

            selection.trigger('cancel_checkall');

            query_user
                .get(false, true)
                .ok(function () {
                    me.load(0, first_page_size, reset_ui);
                })
        },

        /**
         * 加载回收站文件列表
         * @param {Number} offset
         * @param {Number} size
         * @param {Boolean} reset_ui
         */
        load: function (offset, size, reset_ui) {
            var me = this,
                def = $.Deferred();

            if (loading) // 防止重复加载
                return def.reject();

            loading = true;
            this.trigger('before_load', reset_ui);

            console.debug('加载 ' + offset + ' 到 ' + (offset + size) + ' 的文件');
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: LOAD_FILES_CMD,
                cavil: true,
                resend: true,
                pb_v2: true,
                body: {
                    start: offset,
                    count: size,
                    sort_field: 2,
                    reverse_order: false,
                    // 一页拉取个数超过100个时，存储不支持返回缩略图
                    get_abstract_url: true
                }
            })
                .ok(function (msg, body) {
                    var _datas = [].concat(body['dir_list'] || [], body['file_list'] || []),
                        _files = $.map(_datas, function (obj) {
                            return RecFile.from_cgi(obj);
                        });

                    total_dir_count = body['total_dir_count'];
                    total_file_count = body['total_file_count'];

                    // 使用后台返回的finish_flag标志是否已拉取完
                    has_more = !body.finish_flag;
                    start_load_size += size;
                    // 如果是从0开始加载，则重置缓存；否则追加到缓存中
                    if (offset === 0) {
                        all_files = [];
                        file_set = {};
                    }

                    all_files = all_files.concat(_files);
                    for (var i = 0, l = all_files.length; i < l; i++) {
                        var f = all_files[i];
                        file_set[f.get_id()] = f;
                    }

                    me.trigger('load', offset, size, _files);

                    me.trigger_empty_if();
                    loading = false;
                    def.resolve(_files);
                })
                .fail(function (msg, ret) {
                    loading = false;
                    def.reject(msg, ret);
                    me.trigger('load_error', msg, ret);
                })
                .done(function () {
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

            return def;
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
         * 获取回收站文件列表
         * @returns {Array<RecFile>}
         */
        get_files: function () {
            return all_files;
        },


        /**
         * 是否还有更多数据未从后台拉取
         * @returns {boolean}
         */
        has_more: function () {
            return has_more;
        },

        /**
         * 加载下一页内容，在删除节点和滚动栏监听处需要
         */
        load_next_page: function () {
            return this.load(start_load_size, start_load_size === 0 ? first_page_size : page_size, false);
        },

        /**
         * 还原文件
         * @param file
         */
        restore_files: function(file) {
            var is_single_file = !!file, // 是否点击单个文件还原
                me = this;

            if (!is_single_file) { //点击编辑态上的还原按钮
                file = selection.get_selected_files();
            }

            restore.restore_files(file).done(function(files) {
                me.remove_files(files);
            });
        },

        /**
         * 彻底删除文件
         * @param file
         */
        shred_files: function (file) {
            var is_single_file = !!file,
                me = this;

            if (!is_single_file) { // 点击编辑态上的删除按钮
                file = selection.get_selected_files();
            }

            shred.shred_files(file).done(function (files) {
                me.remove_files(files);
            });
        },

        get_all_files: function () {
            return all_files;
        },
        /**
         * 清除缓存中选中部分的文件
         * @param to_remove_files
         * @returns {*}
         */
        remove_files: function (to_remove_files) {
            var files = this.get_all_files(),
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
         * 清空回收站
         */
        clear_files: function () {
            var me = this;

            me.trigger('clear_start');

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: CLEAR_FILES_CMD,
                cavil: true,
                pb_v2: true
            })
                .ok(function (msg, body) {
                    all_files = [];
                    file_set = {};

                    me.trigger('clear', msg);
                    me.trigger_empty_if();
                })
                .fail(function (msg) {
                    me.trigger('clear_fail', msg);
                })
                .done(function () {
                    me.trigger('clear_done');
                });
        },

        /**
         * 清空缓存中的所有文件
         */
        clear_cached_files: function () {
            all_files = [];
            this.trigger('clear_cached_files');
        },

        _last_empty_trigger: null,

        /**
         * 判断现在文件列表状态（空/非空），并触发相应的事件
         */
        trigger_empty_if: function () {
            var trigger;
            // 空的
            if (all_files.length === 0) {
                trigger = 'empty';
            } else {
                trigger = 'not_empty';
            }
            if (this._last_empty_trigger !== trigger) { // 若状态发生改变
                this.trigger(trigger);
            }
        }
    });

    return recycle_list;

});/**
 * 批量选择文件
 * @author jameszuo
 * @date 13-1-15 上午10:42
 */
define.pack("./recycle_list.selection.selection",["lib","common","$","main","./tmpl","./recycle_list.recycle_list","./recycle_list.ui"],function (require, exports, module) {

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

        recycle_list,
        recycle_list_ui,
        scroller,
        sel_box,

        undefined;

    var selection = new Module('recycle_file_selection', {

        render: function () {
            recycle_list = require('./recycle_list.recycle_list');
            recycle_list_ui = require('./recycle_list.ui');
            scroller = main_ui.get_scroller();


            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                selected_class: 'act',
                ns: 'recycle',
                $el: recycle_list_ui.get_$list(),
                $scroller: scroller.get_$el(),
                keep_on: function ($tar) {
                    return !!$tar.closest('[data-file-check]').length || !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return !$tar.closest('[data-file-id]').length;
                },
                container_width: function () {
                    return recycle_list_ui.get_$list().width();
                }
            });
            sel_box.enable();

            // 节点移除，重新检测select条目是否改变
            this.listenTo(recycle_list, 'remove_files', function (to_remove_files) {
                this.trigger_changed(false);
            });

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var all_files = recycle_list.get_files(),
                    selected_len = 0;
                if (all_files.length) {
                    for (var i = 0, l = all_files.length; i < l; i++) {
                        var file = all_files[i],
                            el_id = recycle_list_ui.get_el_id(file.get_id()),
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
            });


            this
                .on('activate', function () {
                    this.enable_selection();
                })
                .on('deactivate', function () {
                    this.disable_selection();
                });

	        //任务管理器打开时禁用选框
	        var oldStateIsEnabled;
	        this.listenTo(global_event, 'manage_toggle', function(state) {
		        if(sel_box) {
			        if(state === 'show') {
				        oldStateIsEnabled = sel_box.is_enabled();
				        oldStateIsEnabled && sel_box.disable();
			        } else if(state === 'hide') {
				        oldStateIsEnabled && sel_box.enable();
			        }
		        }
	        });
        },

        /**
         * Shift 点击选择item
         * @param start   Item Dom元素
         * @param end     Item Dom元素
         */
        shift_select:function(start, end){
            var startItem, endItem,files=new Array(),all_files;
            var i= 0, j=0;
            all_files = recycle_list.get_files();
            if(start){
                startItem = recycle_list_ui.get_file_by_$el(start);
            }else{
                startItem = all_files[0];
            }
            endItem = recycle_list_ui.get_file_by_$el(end);

            while(i<2 && j<all_files.length){
                if(all_files[j] == startItem){
                    i++;
                }
                if(all_files[j] == endItem){
                    i++;
                }
                if(i>0){
                    files.push(all_files[j]);
                }
                j++;
            }

            this.toggle_select(files,true,false);
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
                        return recycle_list_ui.get_file_by_$el($item);
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
                            return recycle_list.get_file_by_id(file_id);
                        });
                    }
                }

                if (files && files.length) {

                    $.each(files, function (i, file) {
                        file.set_selected(flag);
                    });

                    // 同步至 SelectBox
                    var sel_el_ids = $.map(files, function (file) {
                        return recycle_list_ui.get_el_id(file.get_id());
                    });
                    sel_box.set_selected_status(sel_el_ids, flag);

                    this.trigger_changed(from_item_click);
                }
            }
        },

        set_dom_selected: function (files) {
            if (sel_box) {
                sel_box.set_dom_selected($.map(files, function (file) {
                    return recycle_list_ui.get_el_id(file.get_id());
                }), true);
            }
        },

        trigger_changed: function (trigger_check_checkall) {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            if(trigger_check_checkall) {
                this.trigger('check_checkall', sel_meta.is_all); //检查是否标记全选;
            }

            if(sel_meta.files.length === 0/* || !sel_meta.is_all*/) {
                this.trigger('cancel_checkall'); //取消全选
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

                var files = recycle_list.get_files();
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
         * 获取处于选中状态文件信息
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var all_files = recycle_list.get_files(),
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

                if(!recycle_list.has_more() && all_files.length == meta.files.length) {
                    // 已全选
                    meta.is_all = true;
                }
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
define.pack("./recycle_list.ui",["lib","common","$","./tmpl","main","./recycle_list.recycle_list","./recycle_list.selection.selection"],function (require, exports, module) {
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
        mini_tip = common.get('./ui.mini_tip_v2'),
        huatuo_speed = common.get('./huatuo_speed'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        scroller = main_ui.get_scroller(),

        selection,
        recycle_list,

        scroll_listening = false, // 正在添加中

        undefined;

    var ui = new Module('recycle_list_ui', {
        
        render: function ($list_to) {
            var me = this;
            recycle_list = require('./recycle_list.recycle_list'); // 这里如果放上面会有循环引用的问题

            me._$el = $(tmpl.recycle_list())/*.hide()*/.appendTo($list_to);

            me._render_selection();
            me._bind_events();
            //ie6鼠标hover
            me._render_ie6_fix();

            me
                .on('activate', function () {
                    // activate here
                })
                .on('deactivate', function () {
                    // deactivate here
                });
        },

        /**
         * 添加各种事件监听器
         * @private
         */
        _bind_events: function () {
            var me = this;

            me
            // 加载列表的事件
                .listenTo(recycle_list, 'load', function (offset, size, files) {
                    if (offset === 0) {
                        // 插入节点
                        me.set_$items(files);
                    } else {
                        me.add_$items(files);
                    }
                })
                .listenTo(recycle_list, 'first_load_done', function () {
                })
                .listenTo(recycle_list, 'before_load', function (reset_ui) {
                    if (reset_ui) {
                        me.clear_$items(true);
                    }
                    widgets.loading.show();
                })
                .listenTo(recycle_list, 'after_load', function () {
                    widgets.loading.hide();
                })
                .listenTo(recycle_list, 'load_error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(recycle_list, 'clear', function (msg) {
                    mini_tip.ok('清空完成');
                    me.clear_$items();
                })
                .listenTo(recycle_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(recycle_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
                    // 加载下一页
                    me.add_if_need();
                })


                // 清空后，清除选中状态
                .on('clear_$items', function () {
                    if (me.is_activated()) {
                        selection.clear();
                    }
                })
                // 插入节点后，刷新框选，添加缩略图
                .on('add_$items', function (files) {
                    if (me.is_activated()) {
                        selection.refresh_selection();

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

            //文件列表的还原按钮事件监听
            me.get_$list().on('click.restore_btn', '[data-action="restore"]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = recycle_list.get_file_by_id(file_id);
                recycle_list.restore_files(file);
            });

            //文件列表的永久删除按钮事件监听
            me.get_$list().on('click.shred_btn', '[data-action="shred"]', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var file_id = $(this).closest('[data-file-id]').attr('data-file-id');
                var file = recycle_list.get_file_by_id(file_id);
                recycle_list.shred_files(file);
            });

            // 点击选中
            me.get_$list().on('click.recycle_list', '[data-file-id]', function (e) {
                e.preventDefault();
                var $item = $(this);
                var to_sel = !selection.is_selected($item);
                if (e.shiftKey) {
                    // 如果没有上次点击的记录，从起始开始
                    var start =recycle_list.last_click_record ? recycle_list.last_click_record : null;
                    var end = $item;
                    selection.shift_select(start,end);
                    recycle_list.last_click_record = $item;
                } else {
                    selection.toggle_select($item, to_sel, true);
                    recycle_list.last_click_record = $item;
                }

            });
        },

        /**
         * 滑动条到底且服务器有数据未加载完则尝试加载更多数据
         */
        add_if_need: function () {
            if (scroller.is_reach_bottom() && recycle_list.has_more()) {
                recycle_list.load_next_page();
            }
        },

        /**
         * 取消所有选择过的条目
         */
        cancel_all_selected: function () {
            selection.clear();
        },

        /**
         * 添加文件DOM
         * @param {FileNode} files
         */
        add_$items: function (files) {
            var html = tmpl.recycle_list_item({ files: files });
            this.get_$list().append(html);

            this.trigger('add_$items', files);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 清空之前的文件，重新从头开始添加节点DOM
         * @param {RecFile[]} files
         */
        set_$items: function (files) {
            files = files || [];

            this.clear_$items(true);
            this.add_$items(files);

            //测速
            //try{
                //var flag = '21254-1-15';
                //if(window.g_start_time) {
                //    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
                //    huatuo_speed.report();
                //}
            //} catch(e) {
            //
            //}
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        clear_$items: function (silent) {
            this._stop_listen_scroll();

            this.get_$list().empty();

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
            return this._$file_list || (this._$file_list = $('#_recycle_file_list'));
        },

        get_el_id: function (file_id) {
            return '_recycle_file_' + file_id;
        },

        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return recycle_list.get_file_by_id(file_id);
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
            var me = this;

            selection = require('./recycle_list.selection.selection');

            selection.render();

            this.on('sorted', function () {
                selection.clear();
            });

            this.listenTo(selection, 'select_change', function (sel_meta) {
                me.trigger('select_change', sel_meta);
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
            var me = this;

            if (selected_files_cnt > 1) {
                me.trigger('add_block_hover');
            } else {
                me.trigger('remove_block_hover');
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


    return ui;
});/**
 * (批量)还原文件
 * @author hibincheng
 * @date 14-07-15
 */
define.pack("./restore",["lib","common","$","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        covert = lib.get('./covert'),

        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),
        global_var = common.get('./global.global_variable'),

        restorer,
        undefined;

    var restore = new Module('disk_file_restore', {
        _is_restoring : false,
        restore_files: function (files) {
            if(!$.isArray(files)) {
                files = [files];
            }

            //检测还原文件大小是否超出网盘剩余容量
            if (space_info) {
                var total_restore = 0;
                for (var i = 0; i < files.length; i++) {
                    total_restore += files[i].get_size();
                }
                if (total_restore > space_info.ui.get_total_space() - space_info.ui.get_used_space()) {
                    mini_tip.warn('还原文件大小超过剩余容量');
                    return;
                }
            }

            restorer = new Restorer(files);

            var me = this,
                def = $.Deferred();
            if (me._is_restoring) {
                mini_tip.warn('当前有文件正在恢复，请稍后重试');
                return;
            } else {
                me._is_restoring = true;
            }
            restorer
                .do_restore()
                .progress(function(success_files){
                    progress.show("正在还原" + success_files.length+"/"+files.length);
                }).done(function(success_files, failure_files){
                    me._is_restoring = false;

                    me.on_restore(success_files, failure_files);
                    def.resolve(success_files);
                }).fail(function(msg){
                    if(msg !== me.canceled){
                        mini_tip.error(msg);
                    }
                }).always(function(){
                    progress.hide();
                });

            return def;
        },

        on_restore: function(success_files, failure_files) {
            var is_all_ok = !failure_files.length;
            var msg = this._get_to_disk_msg(is_all_ok, success_files)
            if(!success_files.length && failure_files.length) {//全部不成功
                mini_tip.warn(msg);
            }if(failure_files.length){
                mini_tip.warn(msg);
            }else{
                mini_tip.ok(msg);
            }

            var ok_ids = $.map(success_files, function(file) {
                return file.get_id();
            });

            //还原文件后刷新用户空间
            space_info.refresh();

            // 回到网盘后会高亮的ID
            global_var.set('recycle_restored_ids', (global_var.get('recycle_restored_ids') || []).concat(ok_ids));
        },

        _get_to_disk_msg: function (is_all_ok, files) {
            var msg;
            if (is_all_ok) {
                // for wording
                var dir_len = 0, file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                msg = '成功还原' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
            }
            else if (files.length) {
                msg = '部分文件还原失败：' + restorer.get_part_fail_msg();
            } else {
                msg = '文件还原失败';
            }
            return msg;
        }
    });

    var Restorer = inherit(Event, {

        step: 10,

        constructor: function(files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_rec_restore_step_size() || 10;
            this.ok_rets = [0];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.serialize_files(files);
        },

        serialize_files: function(total_files) {
            var dirs = [];
            var files = [];

            $.each(total_files, function(i, file) {
                if(file.is_dir()) {
                    dirs.push(file);
                } else {
                    files.push(file);
                }
            });

            this.dirs = dirs;
            this.files = files;
        },

        is_restore_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_restore_all: function() {
            return !this.dirs.length && !this.files.length;
        },

        save_has_restore: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        set_one_fail_result: function(result) {
            if(this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },

        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '还原失败';
        },

        do_restore: function() {
            var def = $.Deferred();
            this.step_restore(def);
            return def;
        },

        get_step_data: function() {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list;

            var step = this.step;
            while(step--) {
                if(this.dirs.length) {
                    step_dirs.push(this.dirs.shift());
                } else if(this.files.length) {
                    step_files.push(this.files.shift());
                };
                if(!this.dirs.length && !this.files.length) {
                    break;
                }
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        recycle_dir_key: file.get_id(),
                        recycle_dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        recycle_file_id: file.get_id(),
                        recycle_filename: file.get_name()
                    };
                });
            }

            this.step_dirs = step_dirs;
            this.step_files = step_files;

            return {
                dir_list: step_dir_list,
                file_list: step_file_list
            };
        },

        step_restore: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleDirFileBatchRestore',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_restore_ok(dir)) {
                            succ_list.push(true_dir);
                        } else {
                            me.set_one_fail_result(dir);
                            fail_list.push(true_dir);
                        }
                    });
                }
                if(body.file_list && body.file_list.length) {
                    $.each(body.file_list, function(i, file) {
                        var true_file = me.step_files[i];
                        if(me.is_restore_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_restore(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_restore_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.trigger('has_ok', me.succ_list);
                    me.destroy();
                } else {
                    me.step_restore(def);
                }
            });
        },

        destroy: function() {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
        }
    });

    return restore;
});/**
 * （批量）彻底删除文件（即回收站清除文件）
 * @author : maplemiao
 * @time : 2016/8/3
 **/

define.pack("./shred",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        events = lib.get('./events'),
        Event = lib.get('./Event'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        ret_msgs = common.get('./ret_msgs'),

        shredder,

        undefined;

    var shred = new Module('recycle_file_shred' , {
        shred_files: function (files) {
            if(!$.isArray(files)) {
                files = [files];
            }

            shredder = new Shredder(files);

            var me = this,
                def = $.Deferred();

            shredder
                .do_shred()
                .progress(function(success_files){
                    progress.show("正在清除" + success_files.length+"/"+files.length);
                })
                .done(function(success_files, failure_files){
                    me.on_shred(success_files, failure_files);
                    def.resolve(success_files);
                })
                .fail(function(msg){
                    mini_tip.error(msg);
                })
                .always(function(){
                    progress.hide();
                });

            return def;
        },

        on_shred: function (succ_files, fail_files) {
            var is_all_ok = !fail_files.length,
                msg;

            if (is_all_ok) {
                var dir_len = 0, file_len = 0;
                $.each(succ_files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                msg = '成功清除' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
            } else if (succ_files.length) {
                msg = '部分文件还原失败：' + shredder.get_part_fail_msg();
            } else {
                msg = '文件还原失败';
            }

            if(fail_files.length){
                mini_tip.warn(msg);
            }else{
                mini_tip.ok(msg);
            }
        }

    });

    var Shredder = inherit(Event, {
        /**
         * 后台接口对一次彻底删除的条目数量有限制，因此如果多于此数量，应分多条请求进行
         */
        step : 100,

        constructor: function (files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_rec_shred_step_size() || 100;
            this.ok_rets = [0];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.serialize_files(files);
        },

        /**
         * 把文件分成dir和file两类，并分别存储在this.dirs & this.files
         * @param total_files
         */
        serialize_files: function(total_files) {
            var dirs = [];
            var files = [];

            $.each(total_files, function(i, file) {
                if(file.is_dir()) {
                    dirs.push(file);
                } else {
                    files.push(file);
                }
            });

            this.dirs = dirs;
            this.files = files;
        },

        /**
         * 入口
         * @returns {*}
         */
        do_shred: function () {
            var def = $.Deferred();
            this.step_shred(def);
            return def;
        },

        // 单步彻底删除，数量上限为this.step
        step_shred: function (def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleDirFileClear',
                pb_v2: true,
                cavil: true,
                body: data
            })
                .ok(function (msg, body) {
                    var succ_list = [],
                        fail_list = [];
                    if(body.dir_list && body.dir_list.length) {
                        $.each(body.dir_list, function(i, dir) {
                            var true_dir = me.step_dirs[i];
                            if(me.is_shred_ok(dir)) {
                                succ_list.push(true_dir);
                            } else {
                                me.set_one_fail_result(dir);
                                fail_list.push(true_dir);
                            }
                        });
                    }
                    if(body.file_list && body.file_list.length) {
                        $.each(body.file_list, function(i, file) {
                            var true_file = me.step_files[i];
                            if(me.is_shred_ok(file)) {
                                succ_list.push(true_file);
                            } else {
                                me.set_one_fail_result(file);
                                fail_list.push(true_file);
                            }
                        });
                    }
                    me.save_has_shred(succ_list, fail_list);
                    def.notify(me.succ_list, me.fail_list);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                })
                .done(function () {
                    if(me.is_shred_all()) {
                        def.resolve(me.succ_list, me.fail_list);
                        me.trigger('shred_has_ok', me.succ_list); // 抛出事件，其他模块可能会使用到
                        me.destroy();
                    } else {
                        me.step_shred(def);
                    }
                })
        },

        get_step_data: function () {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list;

            var step = this.step;
            while(step--) {
                if(this.dirs.length) {
                    step_dirs.push(this.dirs.shift());
                } else if(this.files.length) {
                    step_files.push(this.files.shift());
                }
                if(!this.dirs.length && !this.files.length) {
                    break;
                }
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        file_id: file.get_id(),
                        filename: file.get_name()
                    };
                });
            }

            this.step_dirs = step_dirs;
            this.step_files = step_files;

            return {
                dir_list: step_dir_list,
                file_list: step_file_list
            };
        },

        is_shred_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        /**
         * 在分步完成彻底删除时，有一个出错则置错
         * @param result
         */
        set_one_fail_result: function (result) {
            if (this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },

        save_has_shred: function (succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        is_shred_all: function () {
            return !this.dirs.length && !this.files.length;
        },

        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '还原失败';
        },

        destroy: function () {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
        }

    });

    return shred;
});/**
 * 回收站UI逻辑
 * @author jameszuo
 * @date 13-3-22
 * modified by maplemiao 2016.7
 */
define.pack("./ui",["lib","common","$","./tmpl","main","./header.header","./recycle_list.recycle_list","./recycle_list.ui"],function (require, exports, module) {

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
        mini_tip = common.get('./ui.mini_tip_v2'),

        tmpl = require('./tmpl'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        header,
        // 列表
        recycle_list,
        recycle_list_ui,

        last_has_files,

        undefined;

    var ui = new Module('recycle_ui', {

        render: function () {
            var me = this;
            header = require('./header.header');
            recycle_list = require('./recycle_list.recycle_list');
            recycle_list_ui = require('./recycle_list.ui');

            me.get_$body().appendTo(main_ui.get_$body_box());

            me.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });

            me
                .on('activate', function () {
                    query_user.on_ready(function () {
                        me.get_$body().show();

                        me
                            .listenTo(recycle_list, 'empty', function () { // 无文件时显示提示
                                me._set_has_files(false);
                                main_ui.sync_size();
                            })
                            .listenTo(recycle_list, 'not_empty', function () { // 有文件时显示列表
                                me._set_has_files(true);
                            })
                            .listenTo(recycle_list_ui, 'add_block_hover', function () {
                                me.get_$body().addClass('block-hover');
                            })
                            .listenTo(recycle_list_ui, 'remove_block_hover', function () {
                                me.get_$body().removeClass('block-hover');
                            })
                            .listenTo(recycle_list_ui, 'select_change', function (sel_meta) {
                                if (sel_meta && sel_meta.files && sel_meta.files.length){
                                    main_ui.toggle_edit(true, sel_meta.files.length);
                                } else {
                                    main_ui.toggle_edit(false);
                                }
                            })
                            .listenTo(header, 'edit_cancel_all', function (e) {
                                recycle_list_ui.cancel_all_selected();
                            });

                        main_ui.sync_size();
                    });


                })
                .on('deactivate', function () {
                    me.get_$body().hide();

                    recycle_list_ui._stop_listen_scroll();
                    me.stopListening(recycle_list, 'empty not_empty');
                });
        },

        // --- 获取一些DOM元素 ---------

        get_$recycle_list: function () {
            return this._$recycle_list || (this._$recycle_list = $('#_recycle_body .list-group-bd'));
        },

        get_$body: function () {
            return this._$body || (this._$body = $(tmpl.body()));
        },

        get_$empty_tip: function () {
            return $('#_recycle_empty_tip');
        },

        /**
         * 不可见时显示空提示
         * @param {Boolean} has_files
         * @private
         */
        _set_has_files: function (has_files) {
            if (last_has_files !== has_files) {
                this.get_$empty_tip().toggle(!has_files);
                last_has_files = has_files;
            }
        }
    });


    return ui;
});
//tmpl file list:
//recycle/src/header/header.tmpl.html
//recycle/src/recycle.tmpl.html
//recycle/src/recycle_list/recycle_list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'_main_bar1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="edit-item" data-action="restore"><i class="icon icon-undo"></i><span class="text">还原</span></li>\r\n\
    <li class="edit-item" data-action="shred"><i class="icon icon-clear"></i><span class="text">清除</span></li>');

return __p.join("");
},

'_main_bar2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common');
    var query_user = common.get('./query_user');
    var constants = common.get('./constants');
    var user = query_user.get_cached_user();
    var is_vip = user && user.is_weiyun_vip();
    var expire = user && user.get_recycle_nonvip_tip();
    var vip_expire = user && user.get_recycle_vip_tip();
    var vip_info = query_user.get_cached_user().get_weiyun_vip_info() || {};
    var vip_level = (is_vip && vip_info && vip_info.weiyun_vip_level_info && vip_info.weiyun_vip_level_info.level) ? vip_info.weiyun_vip_level_info.level : 0;
    __p.push('    <div class="act-panel-inner cleafix">');
 if (is_vip) { __p.push('        <p class="tit">您是微云LV');
_p(vip_level);
__p.push('级用户，专享回收站文件保存');
_p(vip_expire);
__p.push('天</p>');
 } else { __p.push('        <p class="tit">文件保存');
_p(expire);
__p.push('天，会员专享最长保存');
_p(vip_expire);
__p.push('天 <a href="');
_p(constants.GET_WEIYUN_VIP_URL + 'from%3D1017');
__p.push('" target="_blank" style="color: #2688EA;">开通会员</a></p>');
 } __p.push('\r\n\
        <button data-id="empty_recycle" data-action="empty_recycle" class="btn btn-m">全部清空</button>\r\n\
    </div>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common');
    var query_user = common.get('./query_user');
    var constants = common.get('./constants');
    var user = query_user.get_cached_user();
    var is_vip = user && user.is_weiyun_vip();
    var expire = user && user.get_recycle_nonvip_tip();
    var vip_expire = user && user.get_recycle_vip_tip();
    __p.push('    <div id="_recycle_body" class="mod-list-group mod-list-group-trank" data-label-for-aria="回收站文件列表内容区域">\r\n\
\r\n\
        <div class="list-group-bd">\r\n\
            <!--文件列表模板，在./recycle_list/recycle_list.tmpl.html中-->\r\n\
        </div>\r\n\
        <div id="_recycle_empty_tip" class="g-empty sort-recycle-empty" style="display:none;">\r\n\
            <div class="empty-box">\r\n\
                <!-- 回收站为空 -->\r\n\
                <div class="status-inner">\r\n\
                    <i class="icon icon-notrash"></i>\r\n\
\r\n\
                    <!--不是会员-->');
 if (!is_vip) {__p.push('                    <p class="txt">会员专享回收站文件保存');
_p(vip_expire);
__p.push('天</p>\r\n\
                    <a href="');
_p(constants.GET_WEIYUN_VIP_URL + 'from%3D1018');
__p.push('" target="_blank" style="color:#2688EA;font-size:18px">开通会员</a>');
 } else {__p.push('                    <h2 class="title">尊贵的会员</h2>\r\n\
                    <p class="txt">专享回收站文件保存');
_p(vip_expire);
__p.push('天 批量删除轻松找回</p>');
 } __p.push('                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'recycle_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul id="_recycle_file_list" class="list-group"></ul>');

return __p.join("");
},

'recycle_list_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        text = lib.get('./text'),
        date_time = lib.get('./date_time'),

        query_user = common.get('./query_user'),

        files = data.files,

        // fix 日期长度 do not know what to fix@maplemiao
        time_str_len = 'yyyy-MM-dd hh:mm'.length,

        expire = query_user.get_cached_user() && query_user.get_cached_user().is_weiyun_vip() ? 30 : 15,

        undefined;

        var getRemainTimeFormat = (function() {
        var one_hour = 60*60 * 1000;
        var one_day = 24*one_hour;
        var cur_time = (new Date()).getTime();

        return function(time) {
            var exist_time = cur_time - time;
            var remain_time = expire * one_day - exist_time;
            var remain_hour = Math.ceil(remain_time/one_hour);
            var remain_day = Math.ceil(remain_time/one_day);
            if(remain_hour > 0 && remain_hour < 24) {
                return '<span style="color:#ec202c">剩余'+remain_hour+'小时</span>';
                } else if(remain_day > 1) {
                    return '剩余'+remain_day+'天';
                } else {
                    return '已失效';
                }
            }
        })();
    __p.push('    ');

    $.each(files, function(i, file) {
    var text_name = text.text(file.get_name()),
    del_time = date_time.timestamp2date(file.get_del_time());
    __p.push('    <li id="_recycle_file_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('" data-list="file" class="list-group-item">\r\n\
        <div class="item-tit">\r\n\
            <div class="label"><i class="icon icon-check-s j-icon-checkbox"></i></div>\r\n\
            <div class="thumb">\r\n\
                <i class="icon icon-m icon-');
_p(file.get_type());
__p.push('-m"></i>');
 if (file.get_thumb_url()) { __p.push('                    <img style="display:none; cursor:pointer;"/>');
 } __p.push('            </div>\r\n\
\r\n\
            <div class="info">\r\n\
                <span class="tit">');
_p(text_name);
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="item-info">\r\n\
            <!-- 操作列表 -->\r\n\
            <span class="item-info-list">\r\n\
                    <span class="mod-act-list">\r\n\
                        <a data-action="restore" class="act-list" title="还原" aria-label="还原" href="#"><i class="icon icon-undo"></i></a>\r\n\
                        <a data-action="shred" class="act-list" title="永久删除" aria-label="永久删除" href="#"><i class="icon icon-del-pmnt"></i></a>\r\n\
                    </span>\r\n\
                </span>\r\n\
            <span class="item-info-list item-info-size">\r\n\
                    <span class="txt txt-size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                </span>\r\n\
            <span class="item-info-list">\r\n\
                    <span class="txt txt-time">');
_p(del_time.substr(0, time_str_len));
__p.push('</span>\r\n\
                </span>\r\n\
            <span class="item-info-list">\r\n\
                    <span class="txt txt-time">');
_p(getRemainTimeFormat(file.get_del_time()));
__p.push('</span>\r\n\
                </span>\r\n\
        </div>\r\n\
    </li>');

    });
    __p.push('');

return __p.join("");
}
};
return tmpl;
});
