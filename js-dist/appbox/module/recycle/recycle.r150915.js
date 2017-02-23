//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/recycle/recycle.r150915",["common","lib","$","main"],function(require,exports,module){

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
//recycle/src/rec_list/restore.js
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
//recycle/src/rec_list/restore.js
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
		        thumb_url = thumb_url + '/0';
	        }
            thumb_url = https_tool.translate_url(thumb_url);
        }

	    if (https_url) {
		    if(!isVideo(name)) {
			    https_url = https_url + (https_url.indexOf('?') > -1 ? '&' : '?') + 'size=32*32';
		    } else {
			    https_url = https_url + '/0';
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
 * 回收站列表头
 * @author bondli
 * @date 13-10-31
 */
define.pack("./rec_header.rec_header",["lib","common","$","./tmpl","./rec_list.rec_list","main","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

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
            var main_ui = require('main').get('./ui');
            var selection = require('./rec_list.selection.selection');

            this
                .on('activate', function () {
                    // 监听取消全选
                    this.listenTo(selection, 'cancel_checkall', this.cancel_checkall);
                    // 监听设置全选
                    this.listenTo(selection, 'set_checkall', this.checkall);

                    //同步滚动条宽度到表头
                    this.listenTo(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.listenTo(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.listenTo(main_ui.get_scroller(), 'resize', this.sync_scrollbar_width_if);
                })
                .on('deactivate', function () {
                    // 停止监听取消全选
                    this.stopListening(selection, 'cancel_checkall', this.cancel_checkall);
                    // 停止监听设置全选
                    this.stopListening(selection, 'set_checkall', this.checkall);

                    this.stopListening(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.stopListening(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.stopListening(main_ui.get_scroller(), 'resize', this.sync_scrollbar_width_if);

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
            var files_total = rec_list.get_loaded_files().length,
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
define.pack("./rec_list.rec_list",["lib","common","$","./tmpl","./rec_file_object","./rec_list.restore","./rec_list.ui","./rec_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
//        store = lib.get('./store'),
        date_time = lib.get('./date_time'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        RecFile = require('./rec_file_object'),
        restore = require('./rec_list.restore'),

        selection,

        all_files = [],
        file_set = {},

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
                    this.listenTo(selection, 'check_checkall', this.check_checkall);
                })
                .on('deactivate', function () {
                    // 清空缓存
                    this.clear_cached_files();
                    this.stopListening(global_event, 'recycle_refresh', this.refresh);
                    // 停止监听是否勾选全选
                    this.stopListening(selection, 'check_checkall', this.check_checkall);
                })
                .listenTo(global_event, 'recycle_refresh', function () {
                    this.last_click_record= null;
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

            selection.trigger('cancel_checkall');
            me.set_checkalled(false);                   //取消全选

            query_user
                .get(false, true)
                .ok(function () {
                    me.load(0, first_page_size, reset_ui);
                });
        },

        //获取已加载的文件
        get_loaded_files: function () {
            return all_files;
        },

        //检查是否勾选上“全选”
        check_checkall: function (is_all) {
            this._checkalled = !!is_all;
            selection.trigger('set_checkall', this._checkalled);
        },

        /**
         * 全选时，补足2000个文件
         * @param {Boolean} checkalled 是否全选
         */
        set_checkalled: function (checkalled) {
            //获取当前已加载的文件列表
            var files = this.get_loaded_files();
            if (checkalled === true) {

                // 如果加载的文件个数不足X个，且有更多，那么点击全选时加载到X个
                var limit = constants.CGI2_RECYCLE_LIST_LIMIT,
                    loaded_count = files.length,
                    me = this;

                if (loaded_count < limit && this.has_more()) {
                    selection.toggle_select(files, true);

                    // 加载全部
                    this.load_all(function () {
                        selection.toggle_select(me.get_loaded_files(), true);
                    });
                }
                // 已加载超过x个了，就选中全部
                else {
                    selection.toggle_select(files, true);
                }
            }
            else {
                selection.toggle_select(files, false);
            }
            this._checkalled = checkalled;
        },

        get_checkalled: function () {
            return this._checkalled;
        },

//        set_total: function (total) {
//            this.total = total;
//        },
//
//        get_total: function () {
//            return this.total;
//        },

        has_more: function () {
            return has_more;
        },

        /**
         * 拉取当前目录的所有文件
         * @param node 当前目录
         * @param callback 回调方法
         * @returns {*}
         */
        load_all: function(callback) {

            callback._limit_count = typeof callback._limit_count === 'undefined' ? 30 : callback._limit_count;

            var loaded_files = this.get_loaded_files(),
                me = this;

            var def = this.load(loaded_files.length, 100);
            def.done(function() {
                callback._limit_count--;
                if(me.has_more()) {//还有文件
                    if(!callback._limit_count) { //最多加载7次就能加载完3000个文件的，避免死循环
                        callback(true);
                    } else {
                        me.load_all(callback);
                    }
                } else {
                    callback(true);
                }
            }).fail(function() {
                callback(false);
            });

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
                cmd: 'DiskRecycleList',
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
                    total_file_count = body['total_dir_count'];

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

            if (!is_single_file) { //点击了还原按钮
                file = selection.get_selected_files();
            }

            restore.restore_files(file).done(function(files) {
                me.remove_files(files);
            });

        },

        /**
         * 清空
         */
        clear_files: function () {
            var me = this;

            me.trigger('clear_start');

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_recycle.fcg',
                cmd: 'DiskRecycleClear',
                cavil: true,
                pb_v2: true
            })
                .ok(function (msg, body) {

                    all_files = [];
                    file_set = {};

                    me.trigger('clear', msg);
                    me.trigger_empty_if();

                    // 记录清空回收站的时间，以便在加载列表前筛选掉『已删除』的文件
                    // store.set(me.get_ck_clear_time(), body['timestamp']);
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
            return all_files;
        },

        /**
         * 判断回收站本地缓存是否有文件
         */
        has_files: function () {
            return all_files.length > 0;
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
         * @param {Array<Recycle_file>} files
         * @returns {Array<RecFile>} 已删除的文件
         */
        remove_files: function (to_remove_files) {
            var files = this.get_files(),
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
            all_files = [];
            this.trigger('clear_cached_files');
        },

        _last_empty_trigger: null,

        /**
         * 触发是否有文件的事件
         */
        trigger_empty_if: function () {
            var trigger;
            // 空的
            if (all_files.length === 0) {
                trigger = 'empty';
            } else {
                trigger = 'not_empty';
            }
            if (this._last_empty_trigger !== trigger) {
                this.trigger(trigger);
            }
        }
    });

    return rec_list;
});/**
 * (批量)还原文件
 * @author hibincheng
 * @date 14-07-15
 */
define.pack("./rec_list.restore",["lib","common","$","main"],function (require, exports, module) {
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
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),
        global_var = common.get('./global.global_variable'),

        restorer,
        undefined;

    var restore = new Module('disk_file_restore', {

        /**
         * 删除文件前的确认框
         * @param {FileNode|Array<FileNode>} files
         */
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

            restorer
                .do_restore()
                .progress(function(success_files){
                    progress.show("正在还原" + success_files.length+"/"+files.length);
                }).done(function(success_files, failure_files){

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
         * Shift 点击选择item
         * @param start   Item Dom元素
         * @param end     Item Dom元素
         */
        shift_select:function(start, end){
            var startItem, endItem,files=new Array(),all_files;
            var i= 0, j=0;
            all_files = rec_list.get_loaded_files();
            if(start){
                startItem = rec_list_ui.get_file_by_$el(start);
            }else{
                startItem = all_files[0];
            }
            endItem = rec_list_ui.get_file_by_$el(end);

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

                if(!rec_list.has_more() && all_files.length == meta.files.length) {
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
define.pack("./rec_list.ui",["lib","common","$","main","./tmpl","./ui","./rec_list.rec_list","./rec_header.rec_header","./rec_list.selection.selection"],function (require, exports, module) {
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
        mini_tip = common.get('./ui.mini_tip'),
	    huatuo_speed = common.get('./huatuo_speed'),

        scroller = require('main').get('./ui').get_scroller(),
        tmpl = require('./tmpl'),
        rec_ui = require('./ui'),

        selection,
        rec_list,
        rec_header,

        scroll_listening = false, // 正在添加中

        undefined;

    var ui = new Module('rec_list_ui', {

        render: function ($list_to) {
            var me = this;

            me._$el = $(tmpl.recycle_list())/*.hide()*/.appendTo($list_to);
            me._$file_list = $('#_recycle_file_list');

            rec_list = require('./rec_list.rec_list');
            rec_header = require('./rec_header.rec_header');

            me._render_selection();
//            me._render_column_header();

            me
                // 加载列表的事件
                .listenTo(rec_list, 'load', function (offset, size, files) {
                    if (offset === 0) {
                        // 插入节点
                        me.set_$items(files);
                    } else {
                        me.add_$items(files);
                    }
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
                // 清空的事件
                .listenTo(rec_list, 'clear', function (msg) {
                    mini_tip.ok('清空完成');
                    me.clear_$items();
                })
                .listenTo(rec_list, 'clear_fail', function (msg) {
                    mini_tip.error(msg);
                })

                // 节点缓存移除事件
                .listenTo(rec_list, 'remove_files', function (removed_files) {
                    me.remove_$items(removed_files);
                    // 加载下一页
                    me.add_if_need();
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
                var to_sel = !selection.is_selected($item);
                if (e.shiftKey) {

                   // 如果没有上次点击的记录，从起始开始
                    var start =rec_list.last_click_record ? rec_list.last_click_record : null;
                    var end = $item;
                    selection.shift_select(start,end);
                    rec_list.last_click_record = $item;
                } else {
                    selection.toggle_select($item, to_sel, true);
                    // 如果是取消选中，则取消全选
                    if (!to_sel) {
                        rec_header.checkall(false);
                    }else{
                        rec_list.last_click_record = $item;
                    }
                }

            });

            //ie6鼠标hover
            me._render_ie6_fix();
        },

        add_if_need: function () {
            if (scroller.is_reach_bottom() && rec_list.has_more()) {
                rec_list.load_next_page();
            }
        },

        /**
         * 添加文件DOM
         * @param {FileNode} files
         */
        add_$items: function (files) {
            var html = tmpl.recycle_list_item({ files: files });
            this._$file_list.append(html);

            this.trigger('add_$items', files);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 替换文件
         * @param {RecFile[]} files
         */
        set_$items: function (files) {
            files = files || [];

            this.clear_$items(true);
            this.add_$items(files);

	        //测速
	        try{
		        var flag = '21254-1-15';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        clear_$items: function (silent) {
            this._stop_listen_scroll();

            this._$file_list.empty();

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
            selection = require('./rec_list.selection.selection');

            selection.render();

            this.on('sorted', function () {
                selection.clear();
            });

            this.listenTo(selection, 'select_change', function (sel_meta) {
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
            if (selected_files_cnt > 1) {
                rec_ui.get_$body().addClass('block-hover');
            } else {
                rec_ui.get_$body().removeClass('block-hover');
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

    // 缩略图加载
    ui.on('activate', function () {
        var me = this;
        me.on('add_$items', function (files) {
            if (me.is_activated()) {
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
    });

    rec_ui.on('deactivate', function() {
        ui._stop_listen_scroll();
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
	    huatuo_speed = common.get('./huatuo_speed'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        rec_list,
        tbar,
        rec_header,

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

	    //测速
	    try{
		    var flag = '21254-1-15';
		    if(window.g_start_time) {
			    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			    huatuo_speed.report();
		    }
	    } catch(e) {

	    }

        rec_list = require('./rec_list.rec_list');
        tbar = require('./toolbar.toolbar');
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
define.pack("./toolbar.toolbar",["lib","common","$","./rec_list.rec_list","./rec_list.selection.selection"],function (require, exports, module) {
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
        query_user = common.get('./query_user'),


        rec_list = require('./rec_list.rec_list'),
        selection = require('./rec_list.selection.selection'),

        toolbar,
        nil = '请选择文件',
        status,

        undef;

    var tbar = new Module('recycle_toolbar', {

//        ui: require('./toolbar.ui'),

        render: function ($to) {
            var btns = [
                //还原
                new Button({
                    id: 'restore',
                    label: '还原',
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
                    label: '清空回收站',
                    icon: 'ico ico-emptyrecycle',
                    handler: function () {
                        widgets.confirm('清空回收站', '确定清空回收站吗？', '清空后将无法找回已删除的文件', function () {
                            if (rec_list) {
                                rec_list.clear_files();
                            }
                        }, $.noop, ['确定']);
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_CLEAR');
                    },
                    validate: function () {
                        if (!rec_list.has_files()) {
                            return ["您的回收站内没有文件", 'ok'];
                        }
                    }
                }),
                //刷新
                new Button({
                    id: 'refresh',
                    label: '',
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

            var user = query_user.get_cached_user();
            var is_vip = user && user.is_weiyun_vip();
            var expire = user && user.get_recycle_nonvip_tip();
            var vip_expire = user && user.get_recycle_vip_tip();
            var vip_info = user && user.get_weiyun_vip_info() || {};
            var vip_level = (is_vip && vip_info && vip_info.weiyun_vip_level_info && vip_info.weiyun_vip_level_info.level) ? vip_info.weiyun_vip_level_info.level : 0;
            var textString = is_vip
                ? '您是微云LV' + vip_level + '级用户，专享回收站文件保存' + vip_expire + '天'
                : '文件保存' + expire + '天，会员专享最长保存' + vip_expire + '天 ' + '<a href="' + constants.GET_WEIYUN_VIP_URL + 'from%3D1019' + '" target="_blank" style="color: #2688EA;">开通会员</a>';
            $('<div class="infor">' + textString + '</div>').appendTo($wrapper);
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
            var me = this;

            me.get_$body().appendTo(main_ui.get_$body_box());

            toolbar = require('./toolbar.toolbar');
            rec_list = require('./rec_list.rec_list');
            rec_list_ui = require('./rec_list.ui');
            rec_header = require('./rec_header.rec_header');

            me.listenTo(query_user, 'error', function (msg) {
                mini_tip.error(msg);
            });


            me
                .on('activate', function () {
                    query_user.on_ready(function () {
                        me.get_$header().show();
                        me.get_$body().show();

                        // 有文件时显示列表，无文件时显示提示
                        me
                            .listenTo(rec_list, 'empty', function () {
                                me._set_has_files(false);
                                me._toggle_$rec_header(false);
                                main_ui.sync_size();
                            })
                            .listenTo(rec_list, 'not_empty', function () {
                                me._set_has_files(true);
                                me._toggle_$rec_header(true);
                            });

                        main_ui.sync_size();
                    });
                })
                .on('deactivate', function () {
//                    if (constants.UI_VER === 'WEB') {
//                        global_event.trigger('page_header_height_changed');
//                    }
                    me.get_$body().hide();
                    me.get_$header().hide();

                    me.stopListening(rec_list, 'empty not_empty');
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
__p.push('    <div class="inner">\r\n\
        <div class="recycle-head">\r\n\
            <span class="list name"><span class="wrap"><span class="inner">\r\n\
                文件名\r\n\
                <label class="checkall" data-action="checkall" data-no-selection></label>\r\n\
            </span></span></span>\r\n\
            <span class="list size"><span class="wrap"><span class="inner">\r\n\
                文件大小\r\n\
            </span></span></span>\r\n\
            <span class="list time"><span class="wrap"><span class="inner">\r\n\
                删除时间\r\n\
            </span></span></span>\r\n\
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
        date_time = lib.get('./date_time'),
        constants = common.get('./constants'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        read_mode = scr_reader_mode.is_enable(),

        files = data.files,

        // fix 日期长度
        time_str_len = 'yyyy-MM-dd hh:mm'.length,

        appbox_ui = constants.UI_VER === 'APPBOX';


    $.each(files, function (i, file) {
        var text_name = text.text(file.get_name()),
            del_time = file.get_del_time();
        del_time = date_time.timestamp2date(del_time);
        __p.push('        <div id="_rec_file_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('" data-list="file" class="list clear">\r\n\
            <label class="checkbox" tabindex="0" aria-label="');
_p(text_name);
__p.push('"></label>\r\n\
            <span class="img">\r\n\
                <i class="filetype icon-');
_p(file.is_broken_file() ? 'filebroken' : (file.get_type() || 'file'));
__p.push('"></i>');
 if (file.get_thumb_url()) { __p.push('                    <img style="display:none;cursor:default;"/>');
 } __p.push('            </span>\r\n\
            <span class="name ellipsis">\r\n\
                <p class="text"><em>');
_p(text_name);
__p.push('</em></p>\r\n\
            </span>\r\n\
                <span class="tool">\r\n\
                    <a class="link-restore" data-action="restore" title="还原" href="#" data-tj-value="52116"><i class="ico-restore"></i></a>\r\n\
                </span>');
 if (read_mode) { __p.push('                <div class="size" tabindex="0">');
_p(file.get_readability_size());
__p.push('</div>\r\n\
                <div class="time" tabindex="0">');
_p(scr_reader_mode.readable_time(del_time.substr(0, time_str_len)));
__p.push('</div>');
 } else { __p.push('                <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                <span class="time">');
_p(del_time.substr(0, time_str_len));
__p.push('</span>');
 }__p.push('        </div>');

    });
    __p.push('');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var common = require('common');
        var query_user = common.get('./query_user');
        var constants = common.get('./constants');
        var user = query_user.get_cached_user() && query_user.get_cached_user();
        var is_vip = user && user.is_weiyun_vip();
        var expire = user && user.get_recycle_nonvip_tip();
        var vip_expire = user && user.get_recycle_vip_tip();
    __p.push('    <div id="_recycle_body" class="disk-view ui-view ui-listview" data-label-for-aria="回收站文件列表内容区域">\r\n\
        <div id="_recycle_empty_tip" class="g-empty sort-recycle-empty" style="display:none;">\r\n\
            <div class="empty-box" tabindex="0">\r\n\
                <div class="ico"></div>\r\n\
                <!--不是会员-->');
 if (!is_vip) {__p.push('                <p class="content">会员专享回收站文件保存');
_p(vip_expire);
__p.push('天</p>\r\n\
                <a href="');
_p(constants.GET_WEIYUN_VIP_URL + 'from%3D1020');
__p.push('" target="_blank" style="color:#2688EA;font-size:18px;text-align:center;display:block">开通会员</a>');
 } else {__p.push('                <h2 class="title">尊贵的会员</h2>\r\n\
                <p class="content">专享回收站文件保存');
_p(vip_expire);
__p.push('天 批量删除轻松找回</p>');
 } __p.push('\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
