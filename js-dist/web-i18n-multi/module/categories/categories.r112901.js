//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/categories/categories.r112901",["$","lib","common","i18n","main"],function(require,exports,module){

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
//categories/src/File_record.js
//categories/src/Loader.js
//categories/src/Mgr.js
//categories/src/Module.js
//categories/src/View.js
//categories/src/audio.js
//categories/src/doc.js
//categories/src/header/Toolbar.js
//categories/src/video.js
//categories/src/header/header.tmpl.html
//categories/src/view.tmpl.html

//js file list:
//categories/src/File_record.js
//categories/src/Loader.js
//categories/src/Mgr.js
//categories/src/Module.js
//categories/src/View.js
//categories/src/audio.js
//categories/src/doc.js
//categories/src/header/Toolbar.js
//categories/src/video.js
/**
 * 将file_object与Record结合起来，以便复用接口。
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./File_record",["$","lib","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        
        common = require('common'),
        File = common.get('./file.file_object');
    var Category_file = inherit(File, {
        constructor : function(cfg){
            this.pid = cfg.pdir_key;
            this.ppid = cfg.ppdir_key;
            this.thumb_url = cfg.thumb_url;//缩略图，视频类有用到
            //转换成file_object的参数
            var props = {};
            props.pid = cfg.pdir_key;
            props.ppid = cfg.ppdir_key;
            props.name = cfg.file_name;
            props.size = cfg.file_size;
            props.cur_size = cfg.file_size;//库列表拉出来的文件不会有破损文件
            props.id = cfg.file_id;
            props.create_time = cfg.file_ctime;
            props.modify_time = cfg.file_mtime;
            props.file_md5 = cfg.file_md5;
            props.file_sha = cfg.file_sha;
            props.file_ver = cfg.file_version;
            Category_file.superclass.constructor.apply(this, [props]);
        },
        get_pid: function(){
            return this.pid;
        },

        get_ppid: function() {
            return this.ppid;
        },

        get_thumb_url: function() {
            return this.thumb_url;
        }

    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Category_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Category_file.prototype, fn_name, fn,
        create_delegate = function(fn_name, fn){
            var is_setter = /^set_/.test(fn_name);
            var property_name = fn_name.slice(fn_name.indexOf('_'));
            return is_setter ? function(){
                    var olds = {};
                    var ret;
                    olds[property_name] = this['get_'+property_name];
                    ret = fn.apply(this.data, arguments);
                    this.notify_update(olds);
                    return ret;
                } : function(){
                    return fn.apply(this.data, arguments);
                };
        };
    for(fn_name in file_prototype){
        if(/*file_prototype.hasOwnProperty(fn_name) && */!file_record_prototype.hasOwnProperty(fn_name)){
            fn = file_prototype[fn_name];
            file_record_prototype[fn_name] = typeof fn === 'function' ? create_delegate(fn_name, fn) : fn;
        }
    }
    return File_record;
});define.pack("./Loader",["lib","common","./File_record"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        Record = require('./File_record'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/lib_list.fcg',
        DEFAULT_CMD = 'get_lib_list',
        //REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
        //DEFAULT_CMD = 'get_share_list',

        LIB_ID = {
            doc: 1,
            audio: 3,
            video: 4
        },

        //排序类型
        SORT_TYPE = {
            mtime: 1,//更新时间序
            az: 2 //az序
        },

        FILTER_TYPE2EXT_NAME = {
            word: ['doc', 'docx'],
            pdf: ['pdf'],
            excel: ['xls','xlsx'],
            ppt: ['ppt']
        },

        undefined;

    var Loader = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * 加载文件节点
         * @param {Object} cfg 详细配置如下：
         *      offset : {Number} 起始位置
         *      num : {Number} 加载条数
         *      sort_type : {String} 排序方式，目前需要支持a-z名称排序（name）与最后修改时间（time）
         *      sub_type : {String} (可选) 子分类，用于文档进行
         * @param {Function} callback 加载完成后的回调，需传入2个参数：
         *      success : {Boolean} 是否成功
         *      records_arr : {Array<Record>} 文件节点
         *      msg : {String} 如果失败，需要在这里给出具体错误文本
         * @param {Object} scope (optional) callback调用的this对象
         */
        load : function(cfg, callback, scope){

            //有before_load方法时 则进行拦截处理请求
            if(this.before_load && this.before_load.call(this, cfg) === false) {
                return;
            }

            this
                ._load(cfg)
                .done(function(records_arr, total) {
                    callback.call(scope || this, records_arr, total);
                });

        },
        /**
         * 加载文件节点的实际请求方法
         * @param cfg
         * @private
         */
        _load: function(cfg) {

            var def = $.Deferred(),
                is_refresh = cfg.offset === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            //排序类型
            if(cfg.sort_type) {
                cfg.sort_type = SORT_TYPE[cfg.sort_type];
                me.last_sort_type = cfg.sort_type;
            } else {
                cfg.sort_type = me.last_sort_type;
            }
            //文件类型
            if(cfg.filter_type !== 'all') {
                if(cfg.filter_type) {
                    cfg.ext_names = FILTER_TYPE2EXT_NAME[cfg.filter_type];
                    me.last_ext_names = cfg.ext_names;

                } else {
                    cfg.ext_names = me.last_ext_names;
                }
            } else {
                delete me.last_ext_names;//选择全部时，不需要ext_names参数
            }

            delete cfg.filter_type;


            cfg.lib_id = LIB_ID[me.module_name];

            if(is_refresh) {//刷新前
                me.trigger('before_refresh');
            } else {//加载更多前
                me.trigger('before_load');
            }

            me._loading = true;
            me._last_load_req = request
                .post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    header:{"uin":query_user.get_uin_num()},
                    body: cfg
                })
                .ok(function(msg, body) {
                    var records_arr = me.generate_files(body.list_item || []);

                    me._all_load_done = !!body.end;//是否已加载完

                    def.resolve(records_arr);
                    me.trigger('load', records_arr);
                })
                .fail(function(msg, ret) {
                    def.reject(msg, ret);
                    me.trigger('error', msg, ret);
                })
                .done(function() {
                    // 首次加载列表
                    if (!me._first_loaded) {
                        me._first_loaded = true;
                        me.trigger('first_load_done');
                    }
                    me._last_load_req = null;
                    me._loading = false;
                    if(is_refresh) {//刷新后
                        me.trigger('after_refresh');
                    } else {//加载更多后
                        me.trigger('after_load');
                    }
                });
            return def;
        },

        is_first_loaded: function() {
            return this._first_loaded;
        },

        is_loading: function() {
            return this._loading;
        },

        is_all_load_done: function() {
            return this._all_load_done;
        },

        generate_files: function(files) {
            if(!$.isArray(files)) {
                console.error('Loader.js->generate_files: cgi返回的数据格式不对');
                return;
            }

            var records_arr =[];

            $.each(files, function(i, item) {
                var record;
                record=new Record(item);
                records_arr.push(record);
            });

            return records_arr;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return Loader;
});/**
 * 库分类文件列表操作逻辑处理
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./Mgr",["lib","common","$","i18n"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),

        share_enter,
        downloader,
        _ = require('i18n').get('./pack'),
        l_key = 'categories',
        undefined;

    var Mgr = inherit(Event, {

        step_num: 20,

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },
        /**
         * @cfg {View} view
         */
        /**
         * @cfg {Store} store
         */
        /**
         * @cfg {Loader} loader
         */


        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e, extra){
                    this.process_action(action_name, record, e, extra);
                    return false;// 不再触发recordclick
                }, this);
//                this.listenTo(this.view, 'recordclick', this.handle_record_click, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {
                    var records = this.view.selection.get_selected();
                    this.process_action(action_name, records, e, {
                        src : 'toolbar',
                        data : data
                    });
                }, this);
            }
            //数据加载器相关事件
            if(this.loader) {
                this
                    .listenTo(this.loader,'error', function(msg) {
                        mini_tip.error(msg);
                    }, this)
                    .listenTo(this.loader, 'before_load', function() {
                        this.view.on_beforeload();
                    }, this)
                    .listenTo(this.loader, 'after_load', function() {
                        this.view.on_load();
                    })
                    .listenTo(this.loader, 'before_refresh', function() {
                        widgets.loading.show();
                        this.view.on_before_refresh();
                    })
                    .listenTo(this.loader, 'after_refresh', function() {
                        widgets.loading.hide();
                        this.view.on_refresh();
                    });
            }
        },

//        // 分派动作
//        process_action : function(action_name, data, event, from_menu){
//            var fn_name = 'on_' + action_name;
//            if(typeof this[fn_name] === 'function'){
//                if(arguments.length > 2) {
//                    this[fn_name](data, event, from_menu);
//                } else {
//                    this[fn_name](data);//data == event;
//                }
//            }
//        },
        // 分派动作
        process_action : function(action_name, data, event, extra){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event, extra);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        
         // 删除
        on_delete : function(nodes, event, extra){
            this.do_delete(nodes);
            //点击统计上报
            if(extra.src === 'contextmenu') {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_DELETE');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_DELETE');
            }
        },
        when_remover_ready : function(){
            var def = $.Deferred(),
                me = this,
                remover = me.remover;
            
            if(remover){
                def.resolve(remover);
            }else{
                require.async('disk', function(disk){
                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
                    remover.render();
                    def.resolve(remover);
                });
            }
            
            return def;
        },
        do_delete : function(nodes, callback, scope){
            var me = this;
            nodes = [].concat(nodes);
            
            this.when_remover_ready().done(function(remover){
                var remove_worker = me.remover.remove_confirm(nodes, null, false);
                remove_worker.on('has_ok', function (removed_file_ids) {
                    me.store.batch_remove(nodes);
                    me.supply_files_if();
                    if(callback){
                        callback.call(scope, true);
                    }
                });
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn(_(l_key,'请选择文件'));
                return;
            }
            this.do_delete(records);
        },

        // 直接点击记录
        on_open : function(records, e, extra){
            var record = records[0];
            // 如果可预览，预览之
            var me = this;
            if(e.target && e.target.tagName.toUpperCase() === 'INPUT') {//得命名时，点击文本框，不进行预览
                return;
            }
            // 文档预览
            // 如果是可预览的文档，则执行预览操作
            if (me.is_preview_doc(record)) {
                me.appbox_preview(record).fail(function () { // @see ui_virtual.js
                    me.preview_doc(record);                   // @see ui_virtual.js
                });
                user_log('ITEM_CLICK_DOC_PREVIEW');
                return;
            }

            // 如果不能，下载之
            this.on_download(records, e, extra);
            e.preventDefault();
        },
        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} node
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (node) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()));
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        full_screen_preview.preview(node);
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },
        /**
         * 判断文件是否可以预览
         * @param {FileNode} file
         */
        is_preview_doc: function (file) {
            var size_limit;
            return file.is_preview_doc() &&
                (!(size_limit = constants.DOC_PREVIEW_SIZE_LIMIT[file.get_type()]) || file.get_size() < size_limit);
        },

        /**
         * 文档预览
         * @param {FileObject} file
         * @private
         */
        preview_doc: function (file) {
            require.async('doc_preview', function (mod) {
                var doc_preview = mod.get('./doc_preview');
                doc_preview.preview(file);
            });
        },
        /**
         * 排序操作
         * @param {String} sort_type 排序类型
         */
        on_sort: function(records, e, extra) {
            var sort_type = extra.data;
            var size = this.store.size();
            if((size === 0 || size === 1) && this.loader.is_all_load_done()) {//无数据，就不排序了
                return;
            }
            this.load_files({
                offset: 0,
                sort_type: sort_type
            });
            //统计上报
            user_log('CATEGORY_'+ this.module_name.toUpperCase() + '_SORT'+ '_' + sort_type.toUpperCase());
        },
        /**
         * 过滤文件类型操作
         * @param {String} filter_type 要过滤的文件类型
         */
        on_filter: function(records, e, extra) {
            var filter_type = extra.data;
            this.load_files({
                offset: 0,
                filter_type: filter_type
            });
            //统计上报
            switch(filter_type) {
                case 'all':
                    user_log('CATEGORY_DOC_FILTER_ALL');
                    break;
                case 'word':
                    user_log('CATEGORY_DOC_FILTER_DOC');
                    break;
                case 'excel':
                    user_log('CATEGORY_DOC_FILTER_XLS');
                    break;
                case 'ppt':
                    user_log('CATEGORY_DOC_FILTER_PPT');
                    break;
                case 'pdf':
                    user_log('CATEGORY_DOC_FILTER_PDF');
                    break;
            }
        },
        /**
         * 重命名操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_rename: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            var ori_name = record.get_name();
            var me = this;
            me.view.start_rename(record, function(new_name) {
                if(ori_name !== new_name) {//有变化才修改
                    me.do_rename(record, new_name);
                } else {
                    me.view.remove_rename_editor();
                }
            });

            //点击统计上报  erric 还未提供
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_RENAME');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_RENAME');
            }
        },
        /**
         *真正重命名
         * @param {File_record} record 文件对象
         * @param {String} new_name 新的文件名
         */
        do_rename: function(record, new_name) {
            var view = this.view;
            request.post({
                cmd: 'file_attr_mod',
                cavil: true,
                body: {
                    ppdir_key: record.get_ppid(),
                    pdir_key: record.get_pid(),
                    file_id: record.get_id(),
                    file_attr: {
                        file_name: encodeURIComponent(new_name),
                        file_note: '',
                        file_mtime: date_time.now_str()
                    }
                }
            })
                .ok(function(msg, body) {
                    mini_tip.ok(_(l_key,'更名成功'));
                    record.set_name(new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.error(msg || _(l_key,'更名失败'));
                })
                .done(function() {
                    view.remove_rename_editor();
                });

        },
        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_share: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(record);
                });
            } else {
                share_enter.start_share(record);
            }

            //点击统计上报
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_SHARE');
            } else {
                user_log('CATEGORY_'+ this.module_name.toUpperCase() +'_HOVERBAR_SHARE');
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(record, e);
                });
            } else {
                downloader.down(record, e);
            }
            //点击统计上报
            if(from_menu) {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_DOWNLOAD');
            } else {
                user_log('CATEGORY_' + this.module_name.toUpperCase() + '_HOVERBAR_DOWNLOAD');
            }
        },
        /**
         * 刷新操作
         */
        on_refresh: function() {
            global_event.trigger(this.module_name + '_refresh');
        },

        /**
         * 计算出符合阅读的文件名
         * @param {String} file_name
         * @returns {String} name
         */
        get_realable_name: function(file_name) {
            var append_str = file_name.slice(file_name.length-6),
                cut_len = 16;

            file_name = text.smart_sub(file_name.slice(0, file_name.length-6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            return file_name;
        },
        /**
         * 判断是否要补充数据
         */
        supply_files_if: function() {
            if (!this.loader.is_loading() && this.scroller.is_reach_bottom()) {
                if(this.loader.is_all_load_done()){
                    if(this.store.size()===0){
                        this.store.load([]);
                    }
                }else{
                    this.load_files(this.store.size(), this.step_num);
                }
            }
        },
        /**
         * 分批加载数据
         * @param cfg 拉取请求配置
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(cfg, is_refresh) {
            var me = this,
                store = me.store,
                loader = me.loader;

            loader.load({
                offset: cfg.offset || 0,
                count: cfg.count || this.first_page_num,
                sort_type: cfg.sort_type,
                filter_type: cfg.filter_type
            }, function(rs) {
                if(cfg.offset === 0) {//开始下标从0开始表示重新加载
                    store.load(rs);
                } else {
                    store.add(rs, store.size());
                }

                /*if(is_refresh) {
                    mini_tip.ok('列表已更新');
                }*/
            });
        },
        /**
         * 配置分批加载数据的辅助判断工具
         * @param scroller
         */
        set_scroller: function(scroller) {
            this.scroller = scroller;
        },
        /**
         * 配置首屏显示文件个数
         * @param first_page_num
         */
        set_first_page_num: function(first_page_num) {
            this.first_page_num = first_page_num;
        }
    });
    return Mgr;
});/**
 * 库分类模块类，这里用于兼容原有的common/module与现有的代码
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./Module",["lib","common","$","main"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        common = require('common'),
        OldModule = common.get('./module'),
        query_user = common.get('./query_user'),
        main_ui,

        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };

    var noop = $.noop;

    var Module = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        get_list_view : function(){
            var view = this.list_view;
            if(!view.rendered){
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function() {
            var header = this.list_header;
            if(!header.rendered){
                header.render(this.$bar1_ct);
            }
            return header;
        },
        activate : function(){

            this.get_list_view().show();
            this.get_list_header().show();
            this.on_activate();
        },
        deactivate : function(){
            this.get_list_view().hide();
            this.get_list_header().hide();
            this.on_deactivate();
        },

        on_activate: noop,
        on_deactivate: noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function(){
                        main_ui = require('main').get('./ui');
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate : function(){
                        if(query_user.get_cached_user()) {
                            me.activate();
                        } else {
                            me.listenToOnce(query_user, 'load', function() {
                                me.activate();
                            });
                        }
                    },
                    deactivate : function(){
                        me.deactivate();
                    }
                });
            }
            return module;
        }
    });
    return Module;
});/**
 * 库分类（文档、视频、音频）列表视图类
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./View",["lib","common","$","./tmpl","main","i18n"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        image_loader = lib.get('./image_loader'),

        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        m_speed = common.get('./m_speed'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        
        tmpl = require('./tmpl'),
        global_event = common.get('./global.global_event'),
        SelectBox = common.get('./ui.SelectBox'),
        
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        _ = require('i18n').get('./pack'),
        l_key = 'categories',
        undefined;

    var File_view = inherit(View, {

        module_name: '',
        list_selector : '',
        item_selector : 'div[data-file-id]',
        action_property_name : 'data-action',
        
        enable_box_select : true,
        enable_select : true,
        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        scroller : main_ui.get_scroller(),
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;
            
            var selection = this.selection = new Box_selection_plugin();
            selection.init(this);
        },

        list_tpl : function(){
            return tmpl[this.module_name+'_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_file_item']([file]);
        },

        get_html : function(files){
            return tmpl[this.module_name+'_file_item']({
                files : files,
                id_perfix : this.record_dom_map_perfix
            });
        },

        item_menu_class : 'context-menu',
        shortcuts: {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            //实际上对应的是File_object的属性
            _name: function(name) {
                var can_ident = file_type_map.can_identify(File.get_ext(name)),
                    $dom = $(this),
                    is_video = $dom.attr('data-video');//视频要显示出后缀名

                $dom.find('[data-name=file_name]').attr('title', name).text(can_ident && !is_video ? name.slice(0,name.lastIndexOf('.')) : name);
            }
        },

        //插入记录，扩展父类
        on_add: function(store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            if(this.module_name === 'video') {
                this._fetch_video_thumb(records);
            }
        },

        after_render : function(){
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            this._render_ie6_fix();
            
            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e, this.get_action_extra());
                return false;
            }, this);
            
            // 多选时不要hover
            var me = this;
            this.selection.on('selectionchanged', function(records){
                me.is_multi_selection = records.length > 1;
                me._if_block_hover();
            });
        },
        _if_block_hover : function(){
            var $view_ct = this.get_$view_ct();
            $view_ct.toggleClass('block-hover', !!this.is_multi_selection || !!this.is_menu_on);
        },
        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list.on('mouseenter', me.item_selector, function () {
                    $(this).addClass(hover_class);
                }).on('mouseleave', me.item_selector, function () {
                        $(this).removeClass(hover_class);
                    });
            }
        },

        on_datachanged: function() {
            File_view.superclass.on_datachanged.apply(this, arguments);
            if(this.store.size() === 0) {//无数据时，显示空白运营页
                if(!this.$view_empty) {
                    this._init_view_empty();
                }
                this.get_$view_ct().addClass('ui-view-empty');
//                this.get_$view_empty().show();
                this.get_$view_list().hide();

            } else {
                this.get_$view_ct().removeClass('ui-view-empty');
//                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$view_list().show();

                if(this.module_name === 'video') {//视频分类时，要拉取视频缩略图
                    this._fetch_video_thumb(this.store.data);
                }
            }
        },

        /**
         * 初始化列表为空时的提示页面
         * @private
         */
        _init_view_empty: function() {
            var $view_empty = $(tmpl.view_empty()).appendTo(this.get_$view_ct()),
                $title = $view_empty.find('[data-id=title]'),
                $content = $view_empty.find('[data-id=content]'),
                configs;

            $view_empty.addClass('sort-' + this.module_name + '-empty');

            configs = {
                doc: {
                    title: _(l_key,'暂无文档'),
                    content: _(l_key,'请点击左上角的“上传”按钮添加')
                },
                video: {
                    title: _(l_key,'暂无视频'),
                    content: _(l_key,'请点击左上角的“上传”按钮添加')
                },
                audio: {
                    title: _(l_key,'暂无音乐'),
                    content: _(l_key,'请点击左上角的“上传”按钮添加')
                }
            }

            $title.text(configs[this.module_name]['title']);
            $content.text(configs[this.module_name]['content']);
            this.$view_empty = $view_empty;

        },


        /**
         * 拉取视频缩略图
         * @param {Array<File_record>} records 视频文件数组
         * @private
         */
        _fetch_video_thumb: function(records) {
            var me = this,
                thumb_size = 320,//宽度（目前提供尺寸：1024*1024，640*480，320*240，64*48）
                is_retry = true,//是否重试
                retry_cnt = 2;//重试次数

            $.each(records || [], function(i, record) {
                var thumb_url = record.get_thumb_url(),
                    $thumb = me.get_dom(record).find('.img');

                if(thumb_url) {
                    thumb_url += '/' + thumb_size;
                    image_loader
                        .load(thumb_url)
                        .done(function(img) {
                            $thumb.append(img);
                        })
                        .fail(function() {
                            if(!is_retry) {
                                return;
                            }
                            me._retry_fetch_video_thumb({
                                $thumb: $thumb,
                                thumb_url: thumb_url,
                                retry_cnt: retry_cnt
                            })
                        });
                }
            });
        },

        /**
         * 重试拉取失败的视频缩略图
         * @param {Object} fail_thumb 包含：要替换的$thumb，缩略图url，重试次数
         * @private
         */
        _retry_fetch_video_thumb: function(fail_thumb) {
            var $thumb = fail_thumb.$thumb,
                thumb_url = fail_thumb.thumb_url,
                retry_cnt = fail_thumb.retry_cnt;

            var own_fn = arguments.callee,
                me = this;

            if(retry_cnt === 0) {
                fail_thumb = null;//直接释放引用
                return;
            }

            image_loader
                .load(thumb_url)
                .done(function(img) {
                    $thumb.append(img);
                    fail_thumb = null;
                })
                .fail(function() {
                    fail_thumb.retry_cnt--;//重试次数减1
                    own_fn.call(me, fail_thumb);//再重试
                });
        },
        
        _handle_action : function(action, record, e){
            switch(action){
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },
        
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_ctx_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var menu = this.get_context_menu(),
                records;
            
            if(record.get('selected')){
                records = this.selection.get_selected();
            }else{
                this.selection.clear();
                record.set('selected', true);
                records = [record];
            }
            
            this.context_records = records;
            
            var visibles = records.length>1 ? {
                'delete' : 1
            } : undefined;
            
            menu.show(e.pageX, e.pageY, visibles);
            
            var me = this;
            me.is_menu_on = true;
            me._if_block_hover();
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.is_menu_on = false;
                me._if_block_hover();
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_records, e, me.get_action_extra({src:'contextmenu'}));
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            return [
                {
                    id: 'download',
                    text: _(l_key,'下载'),
                    icon_class: 'ico-download'
                },
                {
                    id: 'delete',
                    text: _(l_key,'删除'),
                    icon_class: 'ico-del'
                },
                {
                    id: 'rename',
                    text: _(l_key,'重命名'),
                    icon_class: 'ico-rename'
                },
                {
                    id: 'share',
                    text: _(l_key,'分享'),
                    icon_class: 'ico-share'
                }
            ];
        },
        /**
         * 开始重命名
         * @param {File_record} record 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(record, rename_callback) {
            var file_name = record.get_name();
            var $file_name = this.get_dom(record).find('[data-name=file_name]');
            var $editor = this.get_$rename_editor();
            var $input = $editor.find('input[type=text]');

            var me = this;
            $file_name
                .hide()
                .after($editor.show());

            var auto_blur_handler = function(e){
                if(!$(e.target).is($input)){
                    $input.blur();
                }
            }, $body = $(document.body);
            $body.on('mousedown', auto_blur_handler);
            $input.val(file_name).focus()
                .on(key_event + '.rename', function(e) {
                    if (e.which === 13) {//ENTER
                        var val = $.trim(this.value),
                            dotLastIndex = val.lastIndexOf('.');
                        if(!val || dotLastIndex === 0 && val.length > 1) {
                            return;
                        }

                        if(file_name === val) {//未修改
                            me.remove_rename_editor();
                            return;
                        }
                        var err = File.check_name(val);
                        if(err) {
                            mini_tip.error(err);
                            return;
                        }
                        rename_callback(val);

                    } else if (e.which == 27) { //ESC
                        me.remove_rename_editor();
                    }
                })
                .on('blur.rename', function(e) {
                    var val = $.trim(this.value),
                        err = File.check_name(val),
                        dotLastIndex = val.lastIndexOf('.');
                    if(err) {
                        mini_tip.error(err);
                        me.remove_rename_editor();
                    } else if(val && val !== file_name && !(dotLastIndex === 0 && val.length > 1)) {
                        rename_callback(val);
                    } else {
                        me.remove_rename_editor();
                    }
                    $body.off('mousedown', auto_blur_handler);
                });

            me._select_text_before($input, '.');//聚焦选中

        },

        /**
         * 选中文件名而不包括扩展名
         * @param {jQuery|HTMLElement} $input
         * @param {String} sep
         * @private
         */
        _select_text_before: function ($input, sep) {
            var input = $($input)[0],
                text = $input.val(),
                before = (text.lastIndexOf(sep) == -1) ? text.length : text.lastIndexOf(sep);

            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(0, before);
            }
            else if (input.createTextRange) {
                var text_range = input.createTextRange();
                text_range.collapse(true);
                text_range.moveEnd('character', before);
                text_range.moveStart('character', 0);
                text_range.select();
            }
            else {
                input.select();
            }
        },

        remove_rename_editor: function() {
            var $editor = this.get_$rename_editor();
            $editor.prev('[data-name=file_name]').show();
            $editor.remove();
        },

        // 显示loading
        on_beforeload : function(){
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load : function(){
            this.get_$load_more().hide();
        },

        on_before_refresh: function() {
            this.get_$view_ct().hide();
        },

        on_refresh: function() {
            this.get_$view_ct().show();
            //测速
            try{
                m_speed.done(this.module_name, 'first_page_show');
                m_speed.send(this.module_name);
            } catch(e) {

            }
        },

        get_$view_empty: function() {
            return this.$view_empty;
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },

        get_$view_list: function() {
            return this.$view_list || (this.$view_list = $('#_' + this.module_name + '_view_list'));
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_' + this.module_name + '_body'));
        },

        get_$load_more: function() {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        get_$rename_editor: function() {
            return this.$rename_editor || (this.$rename_editor = $(tmpl.rename_editor()));
        }
    });
    return File_view;
});/**
 * 音频模块
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./audio",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.Toolbar"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        m_speed = common.get('./m_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),
        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        Toolbar = require('./header.Toolbar'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        module_name = 'audio',//库分类模块名

        scroller,

        undefined;

    var store = new Store();
    var loader = new Loader({
        module_name: module_name
    });
    var toolbar = new Toolbar({
        module_name: module_name
    });
    var view = new View({
        module_name: module_name,
        store : store,
        list_selector : '#_audio_view_list>.files'
    });


    var mgr = new Mgr({
        module_name: module_name,
        header: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : module_name,
        list_view : view,
        list_header: toolbar,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
                    m_speed.start(module_name, 'first_page_show');
                } catch(e) {

                }
                mgr.set_first_page_num(first_page_num);
                mgr.load_files({
                    offset: 0,
                    count: first_page_num
                });

                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
        },
        on_activate: function() {
            var me = this;
            me.init();
            this.listenTo(global_event, 'audio_refresh', this.on_refresh);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            loader.abort();
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'audio_refresh', this.on_refresh, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }
            //测速
            try{
                m_speed.start(module_name, 'first_page_show');
            } catch(e) {

            }

            mgr.load_files({
                offset: 0,
                count: first_page_num
            }, is_from_nav === false ? false : true);
            if(is_from_nav !== false) {
                user_log('NAV_AUDIO_REFRESH');
            }
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.set_first_page_num(first_page_num);
                mgr.load_files({
                    offset: size,
                    count: num - size
                });//从后加载
            }
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files({
                    offset: store.size(),
                    count: STEP_NUM
                });
            }
        }
    });

    return module.get_common_module();
});/**
 * 文档模块
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./doc",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.Toolbar"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        m_speed = common.get('./m_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),
        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        Toolbar = require('./header.Toolbar'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        module_name = 'doc',//库分类模块名

        scroller,

        undefined;

    var store = new Store();
    var loader = new Loader({
        module_name: module_name
    });
    var toolbar = new Toolbar({
        module_name: module_name
    });
    var view = new View({
        module_name: module_name,
        store : store,
        list_selector : '#_doc_view_list>.files'
    });


    var mgr = new Mgr({
        module_name: module_name,
        header: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : module_name,
        list_view : view,
        list_header: toolbar,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
                    m_speed.start(module_name, 'first_page_show');
                } catch(e) {

                }

                mgr.load_files({
                    offset: 0,
                    count: first_page_num,
                    sort_type: 'mtime',
                    filter_type: 'all'
                });
                mgr.set_first_page_num(first_page_num);
                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
        },
        on_activate: function() {
            var me = this;
            me.init();
            this.listenTo(global_event, 'doc_refresh', this.on_refresh);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            loader.abort();
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'doc_refresh', this.on_refresh, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }
            //测速
            try{
                m_speed.start(module_name, 'first_page_show');
            } catch(e) {

            }

            mgr.load_files({
                offset: 0,
                count: first_page_num
            }, is_from_nav === false ? false : true);
            if(is_from_nav !== false) {
                user_log('NAV_DOC_REFRESH');
            }
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.set_first_page_num(first_page_num);
                mgr.load_files({
                    offset: size,
                    count: num - size
                });//从后加载
            }
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files({
                    offset: store.size(),
                    count: STEP_NUM
                });
            }
        }
    });

    return module.get_common_module();
});/**
 * 工具栏基础类
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./header.Toolbar",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        undefined;

    var Toolbar = inherit(Event, {

        module_name: '',

        constructor : function(cfg){
            $.extend(this, cfg);
        },

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl[this.module_name+'_toolbar']()).appendTo($ct);
                this.init_current_tool();
                this.bind_action();
                this.rendered = true;
            }
        },
        /**
         * 初始化工具栏中的默认选项
         */
        init_current_tool: function() {
            this.current_item_map = {};
            //过滤类型默认为：全部
            this.current_item_map['filter'] = this.$el.find('[data-filter=all]').addClass('on');
            //排序类型默认为：最后修改时间
            this.current_item_map['sort'] = this.$el.find('[data-sort=mtime]').addClass('on');
        },

        /**
         * 绑定action事件
         */
        bind_action: function() {
            var me = this;
            me.current_item_map = me.current_item_map || {};
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                var action_name = $target.attr(action_property_name);
                var action_data = $target.attr('data-' + action_name);
                var $last_click_item = me.current_item_map[action_name];

                if(action_name !== 'batch_delete' && $last_click_item) {
                    if($last_click_item[0] == $target[0]) {//重复点击，无效
                        return;
                    } else {
                        $last_click_item.removeClass('on');
                    }
                }
                $target.addClass('on');
                if(action_name !== 'refresh') {//刷新就一个按钮，无需判断是否切换
                    me.current_item_map[action_name] = $target;
                }
                me.trigger('action', action_name, action_data, e);
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return Toolbar;

});/**
 * 视频模块
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./video",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.Toolbar"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        m_speed = common.get('./m_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),
        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        Toolbar = require('./header.Toolbar'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 74,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        module_name = 'video',

        scroller,

        undefined;

    var store = new Store();
    var loader = new Loader({
        module_name: module_name
    });
    var toolbar = new Toolbar({
        module_name: module_name
    });
    var view = new View({
        module_name: module_name,
        store : store,
        list_selector : '#_video_view_list>.files'
    });


    var mgr = new Mgr({
        module_name: module_name,
        header: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : module_name,
        list_view : view,
        list_header: toolbar,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
                    m_speed.start(module_name, 'first_page_show');
                } catch(e) {

                }

                mgr.set_first_page_num(first_page_num);

                mgr.load_files({
                    offset: 0,
                    count: first_page_num,
                    sort_type: 'mtime'
                });

                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
        },
        on_activate: function() {
            var me = this;
            me.init();
            this.listenTo(global_event, 'video_refresh', this.on_refresh);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            loader.abort();
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'video_refresh', this.on_refresh, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }
            //测速
            try{
                m_speed.start(module_name, 'first_page_show');
            } catch(e) {

            }

            mgr.load_files({
                offset: 0,
                count: first_page_num
            }, is_from_nav === false ? false : true);
            if(is_from_nav !== false) {
                user_log('NAV_VIDEO_REFRESH');
            }
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.set_first_page_num(first_page_num);
                mgr.load_files({
                    offset: size,
                    count: num - size
                });//从后加载
            }
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files({
                    offset: store.size(),
                    count: STEP_NUM
                });
            }
        }
    });

    return module.get_common_module();
});
//tmpl file list:
//categories/src/header/header.tmpl.html
//categories/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'doc_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'categories';
    __p.push('    <div class="toolbar-btn clear sort-doc-toolbar"><div class="inner">\r\n\
        <a data-no-selection data-action="batch_delete" class="btn btn-del" href="#"><span class="btn-auxiliary"><i class="ico ico-del"></i><span class="text">');
_p(_(l_key,'删除'));
__p.push('</span></span></a>\r\n\
        <a data-no-selection data-action="refresh" class="btn btn-ref" href="#"><span class="btn-auxiliary btn-notext"><i class="ico ico-ref"></i></span></a>\r\n\
        <!-- 视图切换 -->');
_p( this.sort_tool());
__p.push('        <!-- 分类视图切换 -->\r\n\
        <div class="view-mode-sort" id="view-mode-sort">\r\n\
            <span data-action="filter" data-filter="all"><a title="');
_p(_(l_key,'查看所有文档'));
__p.push('" class="vm-l" href="javascript:void(0)"><em>');
_p(_(l_key,'全部'));
__p.push('</em></a></span>\r\n\
            <span data-action="filter" data-filter="word"><a title="');
_p(_(l_key,'查看所有doc文档'));
__p.push('" class="vm-m" href="javascript:void(0)"><em>DOC</em></a></span>\r\n\
            <span data-action="filter" data-filter="excel"><a title="');
_p(_(l_key,'查看所有excel表格'));
__p.push('" class="vm-m" href="javascript:void(0)"><em>XLS</em></a></span>\r\n\
            <span data-action="filter" data-filter="ppt"><a title="');
_p(_(l_key,'查看所有ppt'));
__p.push('" class="vm-m" href="javascript:void(0)"><em>PPT</em></a></span>\r\n\
            <span data-action="filter" data-filter="pdf"><a title="');
_p(_(l_key,'查看所有pdf电子文档'));
__p.push('" class="vm-r" href="javascript:void(0)"><em>PDF</em></a></span>\r\n\
        </div>\r\n\
    </div></div>');

return __p.join("");
},

'video_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'categories';
    __p.push('    <div class="toolbar-btn clear sort-video-toolbar"><div class="inner">\r\n\
        <a data-no-selection data-action="batch_delete" class="btn btn-del" href="#"><span class="btn-auxiliary"><i class="ico ico-del"></i><span class="text">');
_p(_(l_key,'删除'));
__p.push('</span></span></a>\r\n\
        <a data-no-selection data-action="refresh" class="btn btn-ref" href="#"><span class="btn-auxiliary btn-notext"><i class="ico ico-ref"></i></span></a>');
_p( this.sort_tool());
__p.push('    </div></div>');

}
return __p.join("");
},

'audio_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
        l_key = 'categories';
    __p.push('    <div class="toolbar-btn clear sort-audio-toolbar"><div class="inner">\r\n\
        <a data-no-selection data-action="batch_delete" class="btn btn-del" href="#"><span class="btn-auxiliary"><i class="ico ico-del"></i><span class="text">');
_p(_(l_key,'删除'));
__p.push('</span></span></a>\r\n\
        <a data-no-selection data-action="refresh" class="btn btn-ref" href="#"><span class="btn-auxiliary btn-notext"><i class="ico ico-ref"></i></span></a>');
_p( this.sort_tool());
__p.push('    </div></div>');

}
return __p.join("");
},

'sort_tool': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
        l_key = 'categories';
    __p.push('        <div class="view-mode">\r\n\
            <span data-no-selection data-action="sort" data-sort="mtime"><a title="');
_p(_(l_key,'按时间排序'));
__p.push('" class="vm-l vm-time" href="javascript:void(0)"><i></i></a></span>\r\n\
            <span data-no-selection data-action="sort" data-sort="az"><a title="');
_p(_(l_key,'按A-Z顺序排序'));
__p.push('" class="vm-r vm-a-z" href="javascript:void(0)"><i></i></a></span>\r\n\
        </div>');

}
return __p.join("");
},

'doc_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_doc_body" class="disk-view ui-view ui-listview">\r\n\
        <div id="_doc_view_list" >\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'doc_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};

        var $ = require('$');
        var lib = require('lib');
        var common = require('common');
        var text = lib.get('./text');
        var File = common.get('./file.file_object');
        var file_type_map = common.get('./file.file_type_map');
        var records = data.files;
        var id_perfix = data.id_perfix || 'doc-item-';
        var me = this;
    __p.push('    ');

        $.each(records || [], function(i, file) {
            var file_name = file.get_name();
            var can_ident = file_type_map.can_identify(File.get_ext(file_name));
            var icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'file');
    __p.push('            <div data-file-id data-list="file" class="list clear" data-record-id="');
_p(file.id);
__p.push('" class="list clear" id="');
_p(id_perfix + file.id);
__p.push('">\r\n\
                <label class="checkbox"></label>\r\n\
                <span class="img"><i class="filetype ');
_p(icon_class);
__p.push('"></i></span>\r\n\
                <span class="name"><p class="text"><em data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(can_ident ? file_name.slice(0,file_name.lastIndexOf('.')): file_name));
__p.push('</em></p></span>');
_p( me.file_tool());
__p.push('                <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                <span class="time">');
_p(file.get_modify_time());
__p.push('</span>\r\n\
            </div>');

        });
    __p.push('');

return __p.join("");
},

'video_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_video_body"  class="disk-view ui-view ui-listview">\r\n\
        <div id="_video_view_list">\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'video_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$');
        var lib = require('lib');
        var common = require('common');
        var text = lib.get('./text');
        var File = common.get('./file.file_object');
        var records = data.files;
        var id_perfix = data.id_perfix || 'video-item-';
        var me = this;

        $.each(records || [], function(i, file) {
            var file_name = file.get_name();
    __p.push('            <div data-video="true" data-file-id data-list="file" class="list clear" data-record-id="');
_p(file.id);
__p.push('" class="list clear" id="');
_p(id_perfix + file.id);
__p.push('">\r\n\
                <label class="checkbox"></label>\r\n\
                <span class="img"></span>\r\n\
                <span class="name"><p class="text">\r\n\
                    <em class="v-title" data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(file_name));
__p.push('</em>\r\n\
                    <em class="v-time">');
_p(file.get_modify_time());
__p.push(' , ');
_p(file.get_readability_size());
__p.push('</em>\r\n\
                </p></span>');
_p( me.file_tool());
__p.push('            </div>');

        });
    __p.push('');

return __p.join("");
},

'audio_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_audio_body"  class="disk-view ui-view ui-listview">\r\n\
        <div id="_audio_view_list">\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'audio_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$');
        var lib = require('lib');
        var common = require('common');
        var text = lib.get('./text');
        var File = common.get('./file.file_object');
        var file_type_map = common.get('./file.file_type_map');
        var records = data.files;
        var id_perfix = data.id_perfix || 'audio-item-';
        var me = this;
    __p.push('    <!-- update jin 20130731 : new -->\r\n\
    <!-- 高级浏览器使用:hover选择器，ie6请使用鼠标悬停添加list-hover样式 -->\r\n\
    <!-- 选中样式list-selected -->\r\n\
    <!-- 拖入接收容器样式list-dropping -->\r\n\
    <!-- 不可选样式list-unselected -->\r\n\
    <!-- 不带复选框模式list-nocheckbox-->\r\n\
    <!-- 当前列表，用于右键和单行菜单模式list-menu-on-->');

        $.each(records || [], function(i, file) {
            var file_name = file.get_name();
            var can_ident = file_type_map.can_identify(File.get_ext(file_name));
            var icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'file');
    __p.push('            <div data-file-id data-list="file" data-record-id="');
_p(file.id);
__p.push('" class="list clear" id="');
_p(id_perfix + file.id);
__p.push('">\r\n\
                <label class="checkbox"></label>\r\n\
                <span class="img"><i class="filetype ');
_p(icon_class);
__p.push('"></i></span>\r\n\
                <span class="name"><p class="text"><em data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(can_ident ? file_name.slice(0,file_name.lastIndexOf('.')): file_name));
__p.push('</em></p></span>');
_p( me.file_tool());
__p.push('                <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                <span class="time">');
_p(file.get_modify_time());
__p.push('</span>\r\n\
            </div>');

        });
    __p.push('');

return __p.join("");
},

'file_tool': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'categories';
    __p.push('    <span class="tool">\r\n\
        <a data-action="delete" class="link-del" title="');
_p(_(l_key,'删除'));
__p.push('" href="#"><i class="ico-del"></i></a>\r\n\
        <a data-action="rename" class="link-rename" title="');
_p(_(l_key,'重命名'));
__p.push('" href="#"><i class="ico-rename"></i></a>\r\n\
        <a data-action="share" class="link-share" title="');
_p(_(l_key,'分享'));
__p.push('" href="#"><i class="ico-share"></i></a>\r\n\
        <a data-action="download" class="link-download" title="');
_p(_(l_key,'下载'));
__p.push('" href="#"><i class="ico-download"></i></a>\r\n\
    </span>');

}
return __p.join("");
},

'rename_editor': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <span class="fileedit" style="">\r\n\
        <input class="ui-input" type="text" value="">\r\n\
    </span>');

}
return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="g-empty">\r\n\
        <div class="empty-box">\r\n\
            <div class="ico"></div>\r\n\
            <p data-id="title" class="title"></p>\r\n\
            <p data-id="content" class="content"></p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'categories';
    __p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>');
_p(_(l_key,'正在加载'));
__p.push('</a>');

return __p.join("");
}
};
return tmpl;
});
