//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/categories/categories.r151223",["$","lib","common","main"],function(require,exports,module){

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
//categories/src/Remover.js
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
//categories/src/Remover.js
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
        https_tool = common.get('./util.https_tool'),

        File = common.get('./file.file_object');
    var Category_file = inherit(File, {
        constructor : function(cfg){
            this.pid = cfg.pdir_key;
            this.ppid = cfg.ppdir_key;
            this.thumb_url = https_tool.translate_cgi(cfg.thumb_url);//缩略图，视频类有用到
            if(cfg.ext_info && cfg.ext_info.thumb_url) {
                this.thumb_url = https_tool.translate_cgi(cfg.ext_info.thumb_url);//缩略图，视频类有用到
            }
            //转换成file_object的参数
            var props = {};
            props.pid = cfg.pdir_key;
            props.ppid = cfg.ppdir_key;
            props.name = cfg.file_name || cfg.filename;
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
        FILTER_TYPE2GROUP_ID = {
            all: 0,
            word: 1,
            excel: 2,
            ppt: 3,
            pdf: 4
        },

        undefined;
    var lib_v3_enable =false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
            REQUEST_CGI = 'http://web2.cgi.weiyun.com/user_library.fcg';
            DEFAULT_CMD = 'LibPageListGet';
        }
    })
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
                    me.last_filter_type = cfg.filter_type;

                } else {
                    cfg.ext_names = me.last_ext_names;
                    cfg.filter_type = me.last_filter_type;
                }
            } else {
                delete me.last_ext_names;//选择全部时，不需要ext_names参数
                delete me.last_filter_type;
            }

            if(lib_v3_enable) {
                cfg.group_id = FILTER_TYPE2GROUP_ID[cfg.filter_type] || 0;
                delete cfg.ext_names;
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
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    pb_v2: lib_v3_enable,
                    body: cfg
                })
                .ok(function(msg, body) {
                    var items = lib_v3_enable ? body.FileItem_items : body.list_item;
                    var records_arr = me.generate_files(items || []);

                    me._all_load_done = lib_v3_enable ? !!body.finish_flag : !!body.end;//是否已加载完

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
define.pack("./Mgr",["lib","common","$","./Remover"],function(require, exports, module){
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
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        
        Remover = require('./Remover'),

        share_enter,
        downloader,
        file_qrcode,
        undefined;

    var TIP_TEXT = {
        doc: '文档',
        audio: '音乐',
        video: '视频'
    };

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
        get_tip_text: function() {
            return TIP_TEXT[this.module_name];
        },
        do_delete : function(nodes, callback, scope){
            var me = this;
            nodes = [].concat(nodes);
            this.remover = this.remover || new Remover();
            this.remover.remove_confirm(nodes).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.supply_files_if();
                if(callback){
                    callback.call(scope, true);
                }
            })
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择' + this.get_tip_text());
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
            if (preview_dispatcher.is_preview_doc(record)) {
                preview_dispatcher.preview(record);
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
            var view = this.view,
                data = {
                    ppdir_key: '',
                    pdir_key: record.get_pid(),
                    file_list: [{
                        file_id: record.get_id(),
                        filename: new_name,
                        src_filename: record.get_name()
                    }]
                };
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskFileBatchRename',
                cavil: true,
                pb_v2: true,
                body: data
            })
                .ok(function(msg, body) {
                    var result = body['file_list'] && body['file_list'][0] || {};
                    if(result.retcode) {
                        mini_tip.warn(result.retmsg || '更名失败');
                        return;
                    }
                    mini_tip.ok('更名成功');
                    record.set_name(new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.warn(msg || '更名失败');
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
         * 获取二维码操作
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_qrcode: function(records, e, extra) {
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();

            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//file_qrcode
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(records);
                });
            } else {
                file_qrcode.show(records);
            }
            if(from_menu){
                user_log('FILE_QRCODE_' + this.module_name.toUpperCase() + '_RIGHT');
            }else{
                user_log('FILE_QRCODE_' + this.module_name.toUpperCase() + '_ITEM');
            }
        },
        /**
         * 右键跳转至具体路径
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_jump: function(records, e, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            e.preventDefault();
            if(records.length == 1) {
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }

            //if(from_menu) {
            //    user_log('CATEGORY_' + this.module_name.toUpperCase() + '_CONTEXTMENU_JUMP');
            //}
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
                sort_type: cfg.sort_type || 'mtime',
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
            this.loader && this.loader.abort();
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
 * 通用删除操作类
 */
define.pack("./Remover",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        ret_msgs = common.get('./ret_msgs'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),

        undefined;

    var Remover = inherit(Event, {

        /**
         * 先弹框提示，确认后再删除
         * @param {Array<FileNode>} files
         * @returns {*}
         */
        remove_confirm: function(files) {
            var me = this,
                def = $.Deferred();

            files = [].concat(files);
            widgets.confirm(
                '删除文件',
                    files.length>1 ? '确定要删除这些文件吗？' : files[0].is_dir() ? '确定要删除这个文件夹吗？' : '确定要删除这个文件吗？',
                '已删除的文件可以在回收站找到',
                function () {
                    progress.show("正在删除0/"+files.length);
                    me
                        .do_remove(files)
                        .progress(function(success_files){
                            progress.show("正在删除" + success_files.length+"/"+files.length);
                        }).done(function(success_files, failure_files){
                            if(!success_files.length && failure_files.length) {//全部不成功
                                mini_tip.warn('文件删除失败');
                            }if(failure_files.length){
                                mini_tip.warn('部分文件删除失败:' + this.get_part_fail_msg());
                            }else{
                                mini_tip.ok('删除文件成功');
                            }
                            def.resolve(success_files, failure_files);
                        }).fail(function(msg){
                            if(msg !== me.canceled){
                                mini_tip.error(msg);
                            }
                        }).always(function(){
                            progress.hide();
                        });
                },
                $.noop,
                null,
                true
            );

            return def;
        },

        /**
         * 正式开始删除
         * @param files
         * @returns {*}
         */
        do_remove: function(files) {
            this.init_remove(files);
            var def = $.Deferred();
            this.step_remove(def);
            return def;
        },

        /**
         * 删除前的初始化工作
         * @param files
         */
        init_remove: function(files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_files_remove_step_size() || 10;
            this.ok_rets = [0, 1019, 1020, 1026];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.serialize_files(files);
        },

        serialize_files: function(total_files) {
            var files_map = {};

            $.each(total_files, function(i, file) {
                var pid = file.get_pid();
                files_map[pid] = files_map[pid] || [];
                files_map[pid].push(file);
            });

            this.files_map = files_map;
        },
        /**
         * 每次批量删除时的参数
         * @returns {{dir_list: *, file_list: *}}
         */
        get_step_data: function() {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list,
                pdir_key,
                ppdir_key;

            var step = this.step;
            for(var o in this.files_map) {
                var file_group = this.files_map[o],
                    tmp_file;
                pdir_key = file_group[0].get_pid();
                ppdir_key = file_group[0].get_parent && file_group[0].get_parent() && file_group[0].get_parent().get_pid() || '';
                while(step--) {
                    tmp_file = file_group.pop();
                    if(tmp_file.is_dir()) {
                        step_dirs.push(tmp_file);
                    } else {
                        step_files.push(tmp_file);
                    }
                    if(!file_group.length) {
                        delete this.files_map[o];
                        break;
                    }
                }
                break;
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
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

        /**
         * 批量删除操作
         * @param def
         */
        step_remove: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_delete.fcg',
                cmd: 'DiskDirFileBatchDeleteEx',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_remove_ok(dir)) {
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
                        if(me.is_remove_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_remove(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_remove_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.destroy();
                } else {
                    me.step_remove(def);
                }
            });
        },

        is_remove_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_remove_all: function() {
            return $.isEmptyObject(this.files_map);
        },

        save_has_remove: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        set_one_fail_result: function(result) {
            if(this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },
        /**
         * 删除时有部分失败时的错误提示
         * @returns {string|*|string}
         */
        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '未知错误';
        },

        destroy: function() {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
            delete this.files_map;
        }

    });

    return Remover;
});/**
 * 库分类（文档、视频、音频）列表视图类
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./View",["lib","common","$","./tmpl","main"],function(require, exports, module){
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
	    huatuo_speed = common.get('./huatuo_speed'),
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

        jquery_ui,
        drag_files,

        undefined;

    var File_view = inherit(View, {

        module_name: '',
        list_selector : '',
        item_selector : 'div[data-file-id]',
        action_property_name : 'data-action',
        
        enable_box_select : true,
        enable_select : true,

        //拖拽的支持
        draggable : false,
        draggable_key : 'lib_categories',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

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

        on_show: function() {
            this._activated = true;
        },

        on_hide: function() {
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        //插入记录，扩展父类
        on_add: function(store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            if(this.module_name === 'video') {
                this._fetch_video_thumb(records);
            }
            this.update_draggable();
        },
        on_update : function(){
            File_view.superclass.on_update.apply(this, arguments);
            this.update_draggable();
        },
        refresh : function(){
            File_view.superclass.refresh.apply(this, arguments);
            this.update_draggable();
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
                if(e.target.className == 'ico-dimensional'){
                    this.trigger('action', 'qrcode', record, e, this.get_action_extra());
                }else{
                    this.trigger('action', 'open', record, e, this.get_action_extra());
                }
                return false;
            }, this);
            
            // 多选时不要hover
            var me = this;
            this.selection.on('selectionchanged', function(records){
                me.is_multi_selection = records.length > 1;
                me._if_block_hover();
            });

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {
                
                // 如果启用拖拽，则在记录上按下时，不能框选
                this.selection.on('before_box_select', function($tar){
                    return !me.draggable || !me.get_record($tar);
                });

                this.set_draggable(true);

                me._render_drag_files();

            }
        },

        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },

        update_draggable : function(){
            if(!this.rendered || !this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: 65, right: 65 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
            }
        },

        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var items = [];
            // 如果拖动的文件已经选中，则表示拖动所有选中的文件
            if(record.get('selected')){
                items = this.get_selected();
            }else{ // 反之，只拖动当前一个，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                items = [record];
            }

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if(items.length>1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
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
                    title: '暂无文档',
                    content: '请点击左上角的“上传”按钮添加'
                },
                video: {
                    title: '暂无视频',
                    content: '请点击左上角的“上传”按钮添加'
                },
                audio: {
                    title: '暂无音乐',
                    content: '请点击左上角的“上传”按钮添加'
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
                    text: '下载',
                    icon_class: 'ico-null'
                },
                {
                    id: 'delete',
                    text: '删除',
                    icon_class: 'ico-null'
                },
                {
                    id: 'rename',
                    text: '重命名',
                    icon_class: 'ico-null'
                },
                {
                    id: 'jump',
                    text: '查看所在目录',
                    icon_class: 'ico-null'
                },
                {
                    id: 'qrcode',
                    text: '获取二维码',
                    split: true,
                    icon_class: 'ico-dimensional-menu'
                },
                {
                    id: 'share',
                    text: '分享',
                    split: true,
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
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function() {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
	        //测速
	        try{
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
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
	    huatuo_speed = common.get('./huatuo_speed'),
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
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

	            //测速
	            try{
		            var flag = '21254-1-11';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
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
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
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
	    huatuo_speed = common.get('./huatuo_speed'),
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
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

	            //测速
	            try{
		            var flag = '21254-1-11';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
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
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
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
        collections = lib.get('./collections'),
        constants = common.get('./constants'),
        PopPanel = common.get('./ui.pop_panel'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',
        classes = {
            mtime: 'vm-time',
            az: 'vm-az'
        },

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

            var $base_btn = this.$el.find('[data-id="sort"]'),
                $list = this.$el.find('[data-dropdown]'),
                $combine = $base_btn.add($list);

            // hover时显示列表，移出时隐藏
            var pop_panel = new PopPanel({
                host_$dom: $combine,
                $dom: $list,
                delay_time: 200
            });

            this
                .listenTo(pop_panel, 'show', function() {
                    $base_btn.addClass('vm-on');
                }).
                listenTo(pop_panel, 'hide', function() {
                    $base_btn.removeClass('vm-on');
                })

            var class_list = collections.values(classes).join(' ');

            // 点击视图列表中的item
            this.$el.on('click.view_switch', '[data-view]:not(.selected)', function (e) {

                var $btn = $(this),
                    view_name = $btn.attr('data-view');

                $btn.addClass('focus').siblings().removeClass('focus');
                $base_btn.removeClass(class_list).addClass(classes[view_name]);

                if (!scr_reader_mode.is_enable()) { // 针对读屏软件，不隐藏菜单 - james
                    $list.hide();
                }
                me.trigger('action', 'sort', view_name, e);
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
	    huatuo_speed = common.get('./huatuo_speed'),
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
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

	            //测速
	            try{
		            var flag = '21254-1-11';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
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
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
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
__p.push('    <div class="toolbar-btn clear sort-doc-toolbar">\r\n\
        <div class="btn-message">\r\n\
            <a data-no-selection data-action="batch_delete" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-no-selection data-action="refresh" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner minpad"><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
        </div>\r\n\
        <!-- 视图切换 -->');
_p( this.sort_tool());
__p.push('        <!-- 分类视图切换 -->\r\n\
        <div class="view-mode-sort" id="view-mode-sort">\r\n\
            <span data-action="filter" data-filter="all"><a title="查看所有文档" class="vm-l" href="javascript:void(0)"><em>全部</em></a></span>\r\n\
            <span data-action="filter" data-filter="word"><a title="查看所有doc文档" class="vm-m" href="javascript:void(0)"><em>DOC</em></a></span>\r\n\
            <span data-action="filter" data-filter="excel"><a title="查看所有excel表格" class="vm-m" href="javascript:void(0)"><em>XLS</em></a></span>\r\n\
            <span data-action="filter" data-filter="ppt"><a title="查看所有ppt" class="vm-m" href="javascript:void(0)"><em>PPT</em></a></span>\r\n\
            <span data-action="filter" data-filter="pdf"><a title="查看所有pdf电子文档" class="vm-r" href="javascript:void(0)"><em>PDF</em></a></span>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'video_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="toolbar-btn clear sort-video-toolbar">\r\n\
        <div class="btn-message">\r\n\
            <a data-no-selection data-action="batch_delete" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-no-selection data-action="refresh" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner minpad"><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
        </div>');
_p( this.sort_tool());
__p.push('    </div>');

}
return __p.join("");
},

'audio_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="toolbar-btn clear sort-audio-toolbar">\r\n\
        <div class="btn-message">\r\n\
            <a data-no-selection data-action="batch_delete" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-no-selection data-action="refresh" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner minpad"><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
        </div>');
_p( this.sort_tool());
__p.push('    </div>');

}
return __p.join("");
},

'sort_tool': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var lib = require('lib'),
            common = require('common'),
            click_tj = common.get('./configs.click_tj'),
            query_user = common.get('./query_user'),
            cur_view = 'newestlist',
            cur_cls = 'vm-time';
        //库3.0用户去掉排序工具
        if(query_user.get_cached_user().is_lib3_user()) {
            return '';
        }

    __p.push('        <!--<div class="view-mode">\r\n\
            <span data-no-selection data-action="sort" data-sort="mtime"><a title="按时间排序" class="vm-l vm-time" href="javascript:void(0)"><i></i></a></span>\r\n\
            <span data-no-selection data-action="sort" data-sort="az"><a title="按A到Z顺序排序" class="vm-r vm-a-z" href="javascript:void(0)"><i></i></a></span>\r\n\
        </div>-->\r\n\
        <div data-no-selection class="view-mode-dropdown">\r\n\
            <a data-id="sort" data-link="true" class="vm-btn vm-time" href="javascript:void(0)" title="排序方式" tabindex="-1"><i class="ico"></i></a>\r\n\
            <ul data-dropdown="true" class="view-mode-dropdown-box" style="display:none;">\r\n\
                <li data-view="mtime" class="focus"><a class="vm-time" href="#"><i class="ico"></i>按时间排序</a></li>\r\n\
                <li data-view="az" class=""><a class="vm-az" href="#"><i class="ico"></i>按字母顺序</a></li>\r\n\
            </ul>\r\n\
        </div>');

}
return __p.join("");
},

'doc_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_doc_body" class="disk-view ui-view ui-listview" data-label-for-aria="文档列表内容区域">\r\n\
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
        var scr_reader_mode = common.get('./scr_reader_mode');
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
                <label class="checkbox" tabindex="0" aria-label="');
_p(file_name);
__p.push('"></label>\r\n\
                <span class="img"><i class="filetype ');
_p(icon_class);
__p.push('"></i></span>\r\n\
                <span class="name"><p class="text"><em data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(can_ident ? file_name.slice(0,file_name.lastIndexOf('.')): file_name));
__p.push('</em></p></span>');
_p( me.file_tool());
__p.push('                ');
 if (scr_reader_mode.is_enable()) { __p.push('                    <div class="size" tabindex="0">');
_p(file.get_readability_size());
__p.push('</div>\r\n\
                    <div class="time" tabindex="0">');
_p(scr_reader_mode.readable_time(file.get_modify_time()));
__p.push('</div>');
 } else {__p.push('                    <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                    <span class="time">');
_p(file.get_modify_time());
__p.push('</span>');
 } __p.push('                <span class="dimensional">\r\n\
                            <a class="link-dimensional" title="二维码" href="#"><i class="ico-dimensional"></i></a>\r\n\
                </span>\r\n\
            </div>');

        });
    __p.push('');

return __p.join("");
},

'video_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_video_body"  class="disk-view ui-view ui-listview" data-label-for-aria="视频文件列表内容区域">\r\n\
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
        var scr_reader_mode = common.get('./scr_reader_mode');
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
                <label class="checkbox" tabindex="0" aria-label="');
_p(file_name);
__p.push('"></label>\r\n\
                <span class="img"></span>\r\n\
                <span class="name"><p class="text">\r\n\
                    <em class="v-title" data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(file_name));
__p.push('</em>');
 if (scr_reader_mode.is_enable()) { __p.push('                        <div class="v-time" tabindex="0">');
_p(scr_reader_mode.readable_time(file.get_modify_time()));
__p.push(' , ');
_p(file.get_readability_size());
__p.push('</div>');
 } else {__p.push('                        <em class="v-time">');
_p(file.get_modify_time());
__p.push(' , ');
_p(file.get_readability_size());
__p.push('</em>');
 } __p.push('                    <a class="link-dimensional" title="二维码" href="#"><i class="ico-dimensional"></i></a>\r\n\
                </p></span>');
_p( me.file_tool());
__p.push('\r\n\
            </div>');

        });
    __p.push('');

return __p.join("");
},

'audio_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_audio_body"  class="disk-view ui-view ui-listview" data-label-for-aria="音乐文件列表内容区域">\r\n\
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
        var scr_reader_mode = common.get('./scr_reader_mode');
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
                <label class="checkbox" tabindex="0" aria-label="');
_p(file_name);
__p.push('"></label>\r\n\
                <span class="img"><i class="filetype ');
_p(icon_class);
__p.push('"></i></span>\r\n\
                <span class="name"><p class="text"><em data-name="file_name" title="');
_p(file_name);
__p.push('">');
_p(text.text(can_ident ? file_name.slice(0,file_name.lastIndexOf('.')): file_name));
__p.push('</em></p></span>');
_p( me.file_tool());
__p.push('                ');
 if (scr_reader_mode.is_enable()) { __p.push('                    <div class="size" tabindex="0">');
_p(file.get_readability_size());
__p.push('</div>\r\n\
                    <div class="time" tabindex="0">');
_p(scr_reader_mode.readable_time(file.get_modify_time()));
__p.push('%></div>');
 } else {__p.push('                    <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                    <span class="time">');
_p(file.get_modify_time());
__p.push('</span>');
 } __p.push('                <span class="dimensional">\r\n\
                            <a class="link-dimensional" title="二维码" href="#"><i class="ico-dimensional"></i></a>\r\n\
                        </span>\r\n\
            </div>');

        });
    __p.push('');

return __p.join("");
},

'file_tool': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <span class="tool">\r\n\
        <a data-action="delete" class="link-del" title="删除" href="#" tabindex="0" hidefocus="on"><i class="ico-del"></i></a>\r\n\
        <a data-action="rename" class="link-rename" title="重命名" href="#" tabindex="0" hidefocus="on"><i class="ico-rename"></i></a>\r\n\
        <a data-action="share" class="link-share" title="分享" href="#" tabindex="0" hidefocus="on"><i class="ico-share"></i></a>\r\n\
        <a data-action="download" class="link-download" title="下载" href="#" tabindex="0" hidefocus="on"><i class="ico-download"></i></a>\r\n\
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
        <div class="empty-box" tabindex="0">\r\n\
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
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
},

'drag_cursor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),

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
}
};
return tmpl;
});
