//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/station/station.r151223",["$","lib","common","main"],function(require,exports,module){

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
//station/src/File_record.js
//station/src/Loader.js
//station/src/Mgr.js
//station/src/Module.js
//station/src/Remover.js
//station/src/Rename.js
//station/src/View.js
//station/src/header/column_model.js
//station/src/header/header.js
//station/src/header/station_info.js
//station/src/header/toolbar.js
//station/src/image_lazy_loader.js
//station/src/station.js
//station/src/header/header.tmpl.html
//station/src/view.tmpl.html

//js file list:
//station/src/File_record.js
//station/src/Loader.js
//station/src/Mgr.js
//station/src/Module.js
//station/src/Remover.js
//station/src/Rename.js
//station/src/View.js
//station/src/header/column_model.js
//station/src/header/header.js
//station/src/header/station_info.js
//station/src/header/toolbar.js
//station/src/image_lazy_loader.js
//station/src/station.js
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
            this.remain_time = cfg.remain_time;
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
            this.selected = cfg.selected;
            Category_file.superclass.constructor.apply(this, [props]);
        },
        get_pid: function(){
            return this.pid || '';
        },

        get_ppid: function() {
            return this.ppid || '';
        },

        get_thumb_url: function() {
            return this.thumb_url;
        },

        get_remain_time: function() {
            return this.remain_time;
        },
        is_temporary: function() {
            return true;
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
});/**
 * 列表数据加载器
 * @author hibincheng
 * date 2015-05-08
 */
define.pack("./Loader",["lib","common","./File_record"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),

        Record = require('./File_record'),
        query_user = common.get('./query_user'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/temporary_file.fcg',
        DEFAULT_CMD = 'TemporaryFileDiskDirList',

    //排序类型
        SORT_TYPE = {
            TIME: 0,//时间序
            NAME: 1 //名称序
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
                is_refresh = cfg.start === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }

            if(is_refresh) {//刷新前
                this.trigger('before_refresh');
            } else {//加载更多前
                this.trigger('before_load');
            }

            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    pb_v2: true,
                    body: {
                        start: cfg.start || 0,
                        count: cfg.count || 50,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    var records_arr = me.generate_files(body.file_list || []),
                        total;

                    me._all_load_done = !!body.finish_flag;//是否已加载完

                    if(body.total_file_count == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(records_arr, body.total_file_count);
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
        /**
         * 对cgi返回的数据进行再处理，目前有当已全选时，要选中后续加载的每条记录
         * @param {Object} file
         */
        format_file: function(file) {
            if(this.get_checkalled()) {
                file.selected = true;
            }
        },

        generate_files: function(files) {
            if(!$.isArray(files)) {
                console.error('Loader.js->generate_files: cgi返回的数据格式不对');
                return;
            }

            var records_arr =[],
                me = this;

            $.each(files, function(i, item) {
                var record;
                me.format_file(item);
                record=new Record(item);
                records_arr.push(record);
            });

            return records_arr;
        },
        /**
         * 当已全选时，要选中后续加载的每条记录
         * @param {Boolean} checkalled 是否全选
         */
        set_checkalled: function(checkalled) {
            this._checkalled = checkalled;
            console.log('checkall:',checkalled)
        },

        get_checkalled: function() {
            return this._checkalled;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return Loader;
});/**
 * 管理器
 * @author hibincheng
 * date 2015-05-08
 */
define.pack("./Mgr",["lib","common","$","./Remover","./Rename"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        request = common.get('./request'),
        Record = lib.get('./data.Record'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),

        Remover = require('./Remover'),
        Rename = require('./Rename'),
        downloader,
        share_enter,
        file_qrcode,
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
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    e.preventDefault();
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件（工具栏（取消分享）、表头（全选，排序操作））
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {

                    if(action_name === 'checkall' || action_name === 'change_checkall') {
                        this.process_action(action_name, data, e);
                        return;
                    }
                    var records = this.view.get_selected_files();
                    if(action_name !== 'refresh' && !records.length) {
                        mini_tip.warn('请选择文件');
                        return;
                    }
                    e = data;
                    this.process_action(action_name, records, e);
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
         * 框选处理，更改表头全选状态
         */
        on_box_select: function() {
            this.header.on_data_update(this.store);
        },
        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {
            this.store.each(function(item) {
                item.set('selected', checkalled);
            });

            this.loader.set_checkalled(checkalled);
            user_log('SHARE_SELECT_ALL');

        },

        /**
         * 更改全选状态
         * @param checkalled
         */
        on_change_checkall: function(checkalled) {
            this.loader.set_checkalled(checkalled);
        },


        /**
         * 判断是否要补充数据
         */
        supply_files_if: function() {
            if (!this.loader.is_loading() && this.scroller.is_reach_bottom()) {
                if(this.loader.is_all_load_done()){
                    if(this.store.size()==0){
                        this.store.load([]);
                    }
                }else{
                    this.load_files(this.store.size(), this.step_num);
                }
            }
        },

        /**
         * 刷新操作
         * @param e
         */
        on_refresh: function(e) {
            global_event.trigger('station_refresh');//保持原有逻辑，直接触发
        },

        on_open: function(records, e) {
            if(this.rename && this.rename.renaming) { //正在修改名称中
                return
            }
            var cur_record = $.isArray(records) ? records[0] : records;
            //目录点击文件点支持图片预览
            if(!cur_record.is_image()) {
                this.on_download(records, e);
                return;
            }

            var me = this;
            this.appbox_preview(cur_record).fail(function () {
                me.preview_image(cur_record);
            });

        },

        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} record
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (record) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(record.get_name())) ||
                    (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(record.get_name()))
                    );

            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        if(record.is_image()) {
                            full_screen_preview.preview_img(record.get_thumb_url() + '&size=1024*1024', record.get_name());
                        } else {
                            full_screen_preview.preview(record);
                        }
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + record.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },

        preview_image: function(record) {

            var all_images = [];
            this.store.each(function(item) {
                if(item.is_image()) {
                    all_images.push(item);
                }
            });

            var me = this;
            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前图片所在的索引位置
                var index = $.inArray(record, all_images);
                image_preview.start({
                    total: all_images.length,
                    index: index,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return all_images[index].get_thumb_url() + '&size=64*64';
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return all_images[index].get_thumb_url()+ '&size=1024*1024';
                    },
                    download: function(index, e) {
                        me.on_download(all_images[index], e);
                    }
                });
            });

        },

        on_delete: function(records, e) {
            records = $.isArray(records) ? records : [records];
            var me = this;
            records = [].concat(records);
            this.remover = this.remover || new Remover();
            this.remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.supply_files_if();
                me.header.update_info();
            })
        },

        on_share: function(records, e) {
            records = $.isArray(records) ? records : [records];
            if(!share_enter) {
                require.async('share_enter', function (mod) {//异步加载downloader
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records);
                });
            } else {
                share_enter.start_share(records);
            }
        },

        on_download: function(records, e) {
            records = $.isArray(records) ? records : [records];
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(records, e);
                });
            } else {
                downloader.down(records, e);
            }
        },

        on_qrcode: function(record, e) {
            record = $.isArray(record) ? record : [record];
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//异步加载downloader
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(record);
                });
            } else {
                file_qrcode.show(record);
            }
        },

        on_rename: function(record, e) {
            if($.isArray(record) && record.length > 1) {
                mini_tip.warn('只能对单个文件进行重命名');
                return;
            }
            record = $.isArray(record) ? record[0] : record;
            var $file_name = this.view.get_dom(record).find('[data-name=file_name]');
            this.rename = this.rename || new Rename();
            this.rename.start(record, $file_name, e);
        },
        /**
         * 分批加载数据
         * @param offset 开始的下标
         * @param num 加数的数据量
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(offset, num, is_refresh) {
            this.store.load([]);
            //var me = this,
            //    store = me.store,
            //    loader = me.loader;
            //
            //loader.load({
            //    start: offset,
            //    count: num
            //}, function(rs, total) {
            //    if(offset === 0) {//开始下标从0开始表示重新加载
            //        store.load(rs);
            //    } else {
            //        store.add(rs, store.size());
            //    }
            //});
        },
        /**
         * 配置分批加载数据的辅助判断工具
         * @param {Scroller} scroller
         */
        set_scroller: function(scroller) {
            this.scroller = scroller;
        }
    });
    return Mgr;
});/**
 * 中转站模块类，这里用于兼容原有的common/module与现有的代码
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./Module",["lib","common","$","main"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Record = lib.get('./data.Record'),
        Store = lib.get('./data.Store'),

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
                //header.render(this.$top_ct, this.$bar1_ct, this.$column_ct);
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
            // $(document.body).off('mouseup', this._clear_selection_on_blur);
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
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$top_ct = main_ui.get_$top();
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$column_ct = main_ui.get_$station_head();
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
                        //yuyanghe   判断列表是否为空 为空时 移除share-empty-module 样式
                        if(me.get_list_view().store.size() == 0){
                            // yuyanghe 修复运营页面头部无线条BUG  用.show()命令最近文件会出现bug
                            main_ui.get_$bar1().css('display','');
                        }
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
                '中转站文件删除后无法从回收站找回',
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
                                mini_tip.warn('部分文件删除失败:' + me.get_part_fail_msg());
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
         * 每次批量删除时的参数，每次删除只能对同目录下的文件进行操作
         * @returns {{ppdir_key: *, pdir_key: *, dir_list: *, file_list: *}}
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
                ppdir_key = file_group[0].get_ppid();
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
                        pdir_key: pdir_key,
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
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
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskDirFileBatchDeleteEx',
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
 * 通用重命名操作类
 */
define.pack("./Rename",["lib","common","$"],function(require, exports, module) {
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
        File = common.get('./file.file_object'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        undefined;

    var Rename = inherit(Event, {

        start: function(file, $file_name, e) {
            var ori_name = file.get_name();
            var me = this;
            this.$file_name = $file_name;
            me.start_rename(file, function(new_name) {
                if(ori_name !== new_name) {//有变化才修改
                    me.do_rename(file, new_name);
                } else {
                    me.remove_rename_editor();
                }
            });

            this.renaming = true;
        },
        /**
         * 开始重命名
         * @param {File_record} file 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(file, rename_callback) {
            var file_name = file.get_name();
            var $input;
            var $editor = this.$editor = this.get_$rename_editor();
            $input = this.$editor.find('input[type=text]');

            var me = this;
            this.$file_name
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

        /**
         *真正重命名
         * @param {File_record} file 文件对象
         * @param {String} new_name 新的文件名
         */
        do_rename: function(file, new_name) {
            var me = this,
                data = {
                    ppdir_key: '',
                    pdir_key: file.get_pid(),
                    file_list: [{
                        file_id: file.get_id(),
                        filename: new_name,
                        src_filename: file.get_name()
                    }]
                };
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskFileBatchRename',
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
                    file.set('filename', new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.warn(msg || '更名失败');
                })
                .done(function() {
                    me.remove_rename_editor();
                });

        },

        remove_rename_editor: function() {
            this.$file_name.show();
            this.$editor.remove();
            this.renaming = false;
        },

        get_$rename_editor: function() {
            return $('<span class="fileedit" style=""><input class="ui-input" type="text" value=""></span>');
        }
    });

    return Rename;
});/**
 *
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./View",["lib","common","$","./tmpl","main","./image_lazy_loader"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        tmpl = require('./tmpl'),
        main_ui = require('main').get('./ui'),
        global_event = common.get('./global.global_event'),

        image_lazy_loader = require('./image_lazy_loader'),
        list_hover_class = 'list-hover',

        sel_box,

        get_el = function (id) { return document.getElementById(id); },

        undefined;

    var File_view = inherit(View, {

        list_selector: '#_station_view_list>.files',
        item_selector: 'div[data-file-id]',
        action_property_name: 'data-action',
        record_dom_map_perfix: 'station-item-',


        _select_items_cnt: 0,//已勾选的文件个数

        list_tpl: function () {
            return tmpl.station_list();
        },

        tpl: function (file) {
            return tmpl.file_item([file]);
        },

        get_html: function (files) {
            return tmpl.file_item(files);
        },
        shortcuts: {
            selected: function (value) {
                //$(this).toggleClass('ui-selected', value);
                if (sel_box)
                    sel_box.set_selected_status([this.attr('id')], value);
            },
            filename: function(value, $item, record) {
                if(record.is_image()) {
                    var $icon = this.find('.filetype');
                    $icon.attr('src', $icon.attr('data-src'));
                }

                $(this).find('[data-name=file_name]').text(value);
            }
        },

        get_record_by_id: function (id) {
            return this.store.get(id);
        },

        //插入记录，扩展父类
        on_add: function (store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            var prefix = this.record_dom_map_perfix;
            $.each(records, function(i, item) {
                if(item.get('selected')) {
                    sel_box.set_selected_status([prefix + item.id], true);
                }
            });

        },

        after_render: function () {
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_item_click, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

        },

        on_show: function () {
            this._enable_box_selection();
            this._activated = true;
        },

        on_hide: function () {
            //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
            this.copy && this.copy.destroy();
            this.copy = null;
            this._disable_box_selection();
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        //启用框选
        _enable_box_selection: function () {
            var me = this,
                sel_box = this._get_sel_box();

            sel_box.enable();

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var sel_cnt = 0;
                for (var el_id in sel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', true, true);
                        sel_cnt++;
                    }
                }
                for (var el_id in unsel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', false, true);
                    }
                }

                me._block_hoverbar_if(sel_cnt);
                me.trigger('box_select');
            });
        },

        //禁用框选
        _disable_box_selection: function () {
            var sel_box = this._get_sel_box();
            sel_box.disable();

            this.stopListening(sel_box, 'select_change');
        },

        on_datachanged: function () {
            var me = this;
            File_view.superclass.on_datachanged.apply(this, arguments);
            if (this.store.size() === 0) {//无数据时，显示空白运营页

                this.get_$view_ct().addClass('ui-view-empty');
            } else {
                this.get_$view_ct().removeClass('ui-view-empty');
            }
        },

        _handle_action: function (action, record, e) {
            switch (action) {
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        _handle_item_click: function (record, e) {
            var $target = $(e.target);
            var $record = $target.closest(this.item_selector);
            var is_checkbox = $target.closest('.checkbox', $record).length;
            var is_data_action = !!$target.closest('[' + this.action_property_name + ']').length;
            var last_click_record = this.last_click_record,
                store = this.store,
                index = store.indexOf(record),
                start, end,
                multi_select = false,
                clear_selected = true;
            if (is_data_action) {//如果是功能性操作直接返回，对应的mgr中已有相应处理
                return;
            } else if(!is_checkbox) {//不是勾选则是直接打开文件
                this.trigger('action', 'open', record, e);
                return;
            }
            if (is_checkbox || e.ctrlKey || e.metaKey) { // 如果是checkbox或按了ctrl键，不清除已选项
                clear_selected = false;
            }
            // 如果按了shift，表示区域选择
            if (e.shiftKey) {
                multi_select = true;
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
                this.last_click_record = record;
            } else { // 否则，只选或反选这条，记录当前操作的记录
                if(!record.get("selected")){
                    this.last_click_record = record;
                }
            }

            store.each(function (rec, idx) {
                var selected, old_selected = rec.get('selected');
                // 是否是操作目标
                var in_range = multi_select ? (idx >= start && idx <= end || idx >= end && idx <= start) : idx === index;
                if (multi_select) { // 多选时，范围内的必定选中，范围外的如果没有ctrl则不选，如果有则保持
                    if (in_range) {
                        selected = true;
                    } else {
                        selected = clear_selected ? false : old_selected;
                    }
                } else { // 单选时
                    if (clear_selected) { // 如果没按ctrl，目标记录一定选中，其它的则不选
                        selected = in_range;
                    } else { // 如果按了ctrl，其它记录不变，目标记录切换状态
                        selected = in_range ? !old_selected : old_selected;
                    }
                }
                if (selected !== old_selected) {
                    rec.set('selected', selected);
                }
            });
            this._block_hoverbar_if(this.get_selected_files().length);
        },
        /**
         * 获取已选择的列表项
         * @returns {Array}
         */
        get_selected_files: function() {
            var store = this.store,
                selected_files = [];
            $.each(store.data, function(i, item) {
                if(item.get('selected')) {
                    selected_files.push(item);
                }
            });

            return selected_files;
        },

        show_ctx_menu: function (record, e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                $target_item = $(e.target).closest(me.item_selector),
                $view_ct = this.get_$view_ct(),
                records;

            if(record.get('selected')){
                records = this.get_selected_files();
            }else{
                this.store.each(function (rec, idx) {
                    rec.set('selected', false);
                });
                record.set('selected', true);
                records = [record];
            }

            var x = e.pageX,
                y = e.pageY;

            if(records.length > 1) {
                items = [
                    {
                        id: 'download',
                        text: '下载',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'share',
                        text: '分享',
                        icon_class: 'ico-share',
                        group: 'share',
                        split: true,
                        click: default_handle_item_click
                    }
                ];
            } else {
                items = [
                    {
                        id: 'download',
                        text: '下载',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: 'delete',
                        text: '删除',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },/*
                    {
                        id: 'rename',
                        text: '重命名',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },*/
                    {
                        id: 'qrcode',
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'qrcode',
                        split: true,
                        click: default_handle_item_click
                    },
                    {
                        id: 'share',
                        text: '分享',
                        icon_class: 'ico-share',
                        group: 'share',
                        split: true,
                        click: default_handle_item_click
                    }
                ];
            }

            menu = new ContextMenu({
                items: items
            });


            menu.on('hide', function () {
                $view_ct.removeClass('block-hover');
                $target_item.removeClass('context-menu');
            });

            $view_ct.addClass('block-hover');
            $target_item.addClass('context-menu');

            menu.show(x, y);

            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, records, e);
            }
        },


        set_$last_hover_item: function ($item) {
            this._$last_hover_item = $item;
        },
        get_$last_hover_item: function () {
            return this._$last_hover_item;
        },

        // 显示loading
        on_beforeload: function () {
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load: function () {
            this.get_$load_more().hide();
        },

        on_before_refresh: function () {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function () {
            this.last_expanded_record = null;
            this.last_click_record = null;
            this.set_$last_hover_item(null);
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
            image_lazy_loader.init(this.get_$view_list());
            //测速
            try {
	            var flag = '21254-1-17';
	            if(window.g_start_time) {
		            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		            huatuo_speed.report();
	            }
            } catch (e) {

            }
        },
        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                this.get_$view_ct().addClass('block-hover');
            } else {
                this.get_$view_ct().removeClass('block-hover');
            }
        },

        get_$view_empty: function () {
            // return this.$view_empty || (this.$view_empty = $('#_share_view_empty'));
        },

        get_$main_bar1: function () {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },

        get_$view_list: function () {
            return this.$view_list || (this.$view_list = $('#_station_view_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_station_body'));
        },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        _get_sel_box: function () {
            if (!sel_box) {
                var SelectBox = common.get('./ui.SelectBox');
                var $list = $(this.list_selector);
                sel_box = new SelectBox({
                    ns: 'station',
                    $el: $list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    all_same_size: false,
                    keep_on: function ($tar) {
                        return $tar.is('label');
                    },
                    clear_on: function ($tar) {
                        return $tar.closest('[data-record-id]').length === 0;
                    },
                    container_width: function () {
                        return $list.width();
                    }
                });
            }
            return sel_box;
        }
    });
    return File_view;
});/**
 * 中转站表头模块
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./header.column_model",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        Scroller = common.get('./ui.scroller'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        current_has_scrollbar = false,

        undefined;

    var column = new Module('station_column', {

        render: function($ct) {

            if(!this.rendered) {
                this.$el = $(tmpl.columns()).appendTo($ct);
                this._$ct = $ct;
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', this.$el);
                if($target.is('[data-action=checkall]')) {
                    $target.toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    me.trigger('action', 'checkall', checkalled, e);
                } else {
                    me.trigger('action', $target.attr(action_property_name), e);
                }
            });
        },
        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
                this.trigger('action', 'change_checkall', new_checkalled);
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
        },
        /**
         * 当内容区出现滚动条时，要修正表头宽度，不然会出现不对齐现象
         * @param {Boolean} has_scrollbar 是否出现了滚动条
         */
        sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this.$el.find('.files-head').css('paddingRight', padding_right + 'px');//需要同步滚动条宽度不会很常操作，一般就一次，直接用选择器了
            current_has_scrollbar = has_scrollbar;

        },

        show: function() {
            this.$el.show();
            if(constants.UI_VER === 'WEB') {
                this._$ct.show();
            }
        },

        hide: function() {
            this.$el.hide();
            if(constants.UI_VER === 'WEB') {
                this._$ct.hide();
            }
        },

        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        }
    });

    return column;

});/**
 * 中转站头部模块
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./header.header",["lib","common","$","./tmpl","main","./header.station_info"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('share.header'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        Scroller = common.get('./ui.scroller'),
        tmpl = require('./tmpl'),

        main_ui = require('main').get('./ui'),
        station_info = require('./header.station_info'),

        toolbar,
        cm,

        file_item_height = 47,//文件列表中每一项的高度

        undefined;

    var header = new Module('station_header', {

        bind_store: function(store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this._detect_data_empty, this);
                old_store.off('clear', this._detect_hide_column_model, this);
                old_store.off('update', this.on_data_update, this);
                old_store.off('remove', this.sync_scrollbar_width_if, this);
            }

            store.on('datachanged', this._detect_data_empty, this);
            store.on('clear', this._detect_hide_column_model, this);
            store.on('update', this.on_data_update, this);
            store.on('remove', this.sync_scrollbar_width_if, this);
            this.store = store;
        },

        _detect_hide_column_model: function() {
            this.get_column_model().hide();
        },

        //检查数据是否为空了
        _detect_data_empty: function() {
            var store_size = this.store.size(),
                cm = this.get_column_model(),
                tbar = this.get_toolbar();
            if(!this.is_activated()) {
                return;
            }
            if(store_size === 0) {//无数据时，不显示工具栏和表头
                //tbar.hide();
                cm.hide();
            } else {
               // tbar.show();
                cm.show();
                this.sync_scrollbar_width_if();
            }
            main_ui.sync_size();
        },

        /**
         * 根据数据多少来判断是否会出现滚动条，并同步到表头
         */
        sync_scrollbar_width_if: function() {
            //var store_size = this.store.size(),
            //    body_box_height = main_ui.get_$body_box().height(),
            //    cm = this.get_column_model();
            //
            //if(store_size * file_item_height > body_box_height) {//出现滚动条
            //    cm.sync_scrollbar_width(true);
            //} else {
            //    cm.sync_scrollbar_width(false);
            //}
        },

        on_data_update: function(store) {
            //var checkalled = true,
            //    column_model = this.get_column_model();
            //
            //store.each(function(item) {
            //    if(!item.get('selected')) {//找到一个不是选中，则不是全选 // TODO 建议使用 collections.any()
            //        checkalled = false;
            //        return false; //break
            //    }
            //});
            //
            //column_model.checkall(checkalled);
        },

        update_info: function() {
            //station_info.load_info();
        },

        render: function($top_ct, $bar1_ct, $column_ct) {

            //this.$toolbar_ct = $bar1_ct;
            //this.$column_model_ct = $column_ct;
            //
            //this._render_toolbar($bar1_ct);
            //
            //this._render_column_model($column_ct);
            //
            //this._bind_action();
        },

        _render_toolbar: function($bar1_ct) {
            //toolbar = require('./header.toolbar');
            //toolbar.render($bar1_ct);
        },

        _render_column_model: function($bar2_ct) {
            //cm = require('./header.column_model');
            //cm.render($bar2_ct);
        },

        _bind_action: function() {
            var me = this,
                array_concat = Array.prototype.concat;
            //把toolbar,cm的action事件统一向外抛
            this.listenTo(cm, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
            });
            this.listenTo(toolbar, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
            });
        },

        get_column_model: function() {
            return cm;
        },

        get_toolbar: function() {
            return toolbar;
        },
        show: function(){
           //this.get_$column_model_ct().show();
           // this._activated = true;
        },
        hide: function() {
            //this.get_$column_model_ct().hide();
            //this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        get_$toolbar_ct: function() {
            return this.$toolbar_ct;
        },

        get_$toolbar: function() {
            return this.$toolbar || (this.$toolbar = $('#_station_toolbar'));
        },

        get_$column_model_ct: function() {
            return this.$column_model_ct;
        },

        destroy: function() {
            this.bind_store(null);
        }
    });

    return header;
});/**
 * 中转站信息模块
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./header.station_info",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        File = common.get('./file.file_object'),

        tmpl = require('./tmpl'),

        undefined;

    var station_info = new Module('station_info', {

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this.$info_ct = $(tmpl.station_info()).appendTo($ct);

            this.load_info();

            this._rendered = true;

        },

        load_info: function() {
            var me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                me.show_info(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
            });
        },

        show_info: function(data) {

            $(tmpl.bubbble({
                max_date: Math.ceil(data.temporary_file_max_valid_time / (60*60*24)),
                max_single_file_size: File.get_readability_size(data.max_single_file_size),
                file_total: data.file_total
            })).appendTo(this.get_$info_ct());

            var $bubbble = this.$info_ct.find('[data-id=station_bubbble]');
            this.$info_ct.find('[data-id=bubbble_hint]').hover(function(e) {
                $bubbble.show();
            }, function(e) {
                $bubbble.hide();
            });
        },

        get_$info_ct: function() {
            return this.$info_ct;
        }
    });
    return station_info;

});/**
 * 中转站工具栏模块
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./header.toolbar",["lib","common","$","./tmpl","./header.station_info"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        station_info = require('./header.station_info'),

        undefined;

    var toolbar = new Module('station_toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl.toolbar()).appendTo($ct);
                station_info.render(this.$el);
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                me.trigger('action', $target.attr(action_property_name), e);
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return toolbar;

});/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./image_lazy_loader",["$","lib","common","main"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),
        main_ui = require('main').get('./ui'),
        https_tool = common.get('./util.https_tool'),
        undefined;

    var lazy_loader = {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            var scroller = main_ui.get_scroller();
            this.listenTo(scroller, 'scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var src = https_tool.translate_url($img.attr('data-src'));
                        src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'size=64*64';
                        image_loader.load(src).done(function(img) {
                            $img.css({
                                'backgroundImage': "url('"+img.src+"')",
                                'backgroundPosition': 0
                            });
                            $img.attr('data-loaded', 'true');
                        })
                    }
                }
            });
        }
    };

    $.extend(lazy_loader, events);

    return lazy_loader;
});/**
 * 文件中转站模块
 * @author hibincheng
 * @date 2015-05-08
 */
define.pack("./station",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.header"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record'),
        console = lib.get('./console'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),
        upload_event = common.get('./global.global_event').namespace('upload2'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        header = require('./header.header'),

        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        undefined;

    var store = new Store();
    var loader = new Loader();
    var view = new View({
        store : store
    });

    header.bind_store(store);//绑定数据源

    var mgr = new Mgr({
        header: header,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : 'transfer',
        list_view : view,
        list_header: header,
        loader: loader,
        init: function() {

            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
	                var flag = '21254-1-17';
	                if(window.g_start_time) {
		                huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		                huatuo_speed.report();
	                }
                } catch(e) {

                }

                mgr.load_files(0, first_page_num);

                scroller = main_ui.get_scroller();

                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
            this.listenTo(global_event, 'station_refresh', this.on_refresh);
            this.listenTo(global_event, 'window_resize', this.on_win_resize);
//            this.listenTo(global_event, 'window_scroll', this.on_win_scroll);
            //this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(upload_event, 'upload_done', this.on_upload_done);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
        },
        on_activate: function() {
            var me = this;
            me.init();
            //document.title = '分享的链接 - 微云';

            main_ui.sync_size();
        },

        on_deactivate: function() {
            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            //this.stopListening(global_event, 'window_scroll' , this.on_win_scroll);
            //this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'station_refresh', this.on_refresh, this);
            this.stopListening(upload_event, 'upload_done', this.on_upload_done);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            //if(is_from_nav !== false) {
            //    store.clear();
            //}

            //header.update_info();
            //mgr.load_files(0, first_page_num, is_from_nav === false ? false : true);
            //header.get_column_model().cancel_checkall();
            //loader.set_checkalled(false);
            //if(is_from_nav !== false) {
            //    user_log('NAV_SHARE_REFRESH');
            //}
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            console.log('share on_win_resize');
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.load_files(size, num - size);//从后加载
            }

            header.sync_scrollbar_width_if();//同步滚动条宽度到表头
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            console.log('share on_win_scroll');
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files(store.size(), STEP_NUM);
            }
        },

        on_upload_done: function(upload_task) {
            this.on_refresh();
        }
    });

    return module.get_common_module();
});
//tmpl file list:
//station/src/header/header.tmpl.html
//station/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'station_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="info-box trans-file-info" style="">\r\n\
        <div data-id="bubbble_hint" class="content"><i class="ui-icon icon-hint"></i>中转文件信息</div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'bubbble': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 气泡浮层 (如果需要更宽，请在bubble-box上赋宽度值) -->\r\n\
    <div data-id="station_bubbble" class="bubble-box trans-file-info-bubble" style="display:none;">\r\n\
        <div class="bubble-i">\r\n\
            <p>文件数：<span class="data">');
_p(data.file_total);
__p.push('个</span></p>\r\n\
            <p>单文件大小限制：<span class="data">');
_p(data.max_single_file_size);
__p.push('</span></p>\r\n\
            <p>最大保存天数：<span class="data">');
_p(data.max_date);
__p.push('天</span></p>\r\n\
        </div>\r\n\
        <b class="bubble-trig ui-trigbox ui-trigbox-tr">\r\n\
            <b class="ui-trig"></b>\r\n\
            <b class="ui-trig ui-trig-inner"></b>\r\n\
        </b>\r\n\
        <!-- <span class="bubble-close">×</span> -->\r\n\
    </div>');

return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_station_toolbar" class="toolbar-btn clear transfer-files-toolbar">\r\n\
        <!-- .inner项hover状态使用.hover样式 -->\r\n\
        <!-- .inner项不可用状态使用.disable样式 -->\r\n\
        <div class="btn-message">\r\n\
            <a data-action="download" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-down"></i><span class="text">下载</span></span></a>\r\n\
            <a data-action="share" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-share"></i><span class="text">分享</span></span></a>\r\n\
            <!--<a data-action="rename" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-rename"></i><span class="text">重命名</span></span></a>-->\r\n\
            <a data-action="delete" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-action="refresh" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled minpad"><i class="ico ico-ref"></i></span></a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'columns': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="inner" style="">\r\n\
        <div class="files-head">\r\n\
            <!-- list-hover 为ie6下hover样式 -->\r\n\
                <span class="list name"><span class="wrap"><span class="inner">\r\n\
                    文件名<label class="checkall" data-action="checkall" data-no-selection=""></label>\r\n\
                </span></span></span>\r\n\
                <span class="list private-countdown"><span class="wrap"><span class="inner">\r\n\
                    剩余时间\r\n\
                </span></span></span>\r\n\
                <span class="list private-size"><span class="wrap"><span class="inner">\r\n\
                    文件大小\r\n\
                </span></span></span>\r\n\
                <span class="list private-date"><span class="wrap"><span class="inner">\r\n\
                    中转时间\r\n\
                </span></span></span>\r\n\
            <span class="list private-qrcode"><span class="wrap"><span class="inner"></span></span></span>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'station_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_station_body"  class="disk-view ui-view ui-listview" data-label-for-aria="中转站内容区域">\r\n\
        <div id="_station_view_list">\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
        </div>');
_p( this.view_empty() );
__p.push('    </div>\r\n\
');

return __p.join("");
},

'file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$');
        var lib = require('lib');
        var common = require('common');
        var text = lib.get('./text');
        var scr_reader_mode = common.get('./scr_reader_mode');
        var File = common.get('./file.file_object');
        var file_type_map = common.get('./file.file_type_map');
        var records = data;
        var id_perfix = 'station-item-';
        var me = this;

        $.each(records, function(i, file) {
            var file_name = file.get_name();
            var can_ident = file_type_map.can_identify(File.get_ext(file_name));
            var icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'file');
            var remain_day = file.get_remain_time();
            var is_image = file.is_image();
            var warn_class = remain_day < 2 ? 'state-warn' : '';
    __p.push('        <div data-file-id data-record-id="');
_p(file.id);
__p.push('" data-list="file" class="list list-more clear ');
_p( file.get('selected') ? 'ui-selected':'' );
__p.push('" id="');
_p(id_perfix + file.id);
__p.push('">\r\n\
            <label class="checkbox" tabindex="0" aria-label="');
_p(file_name);
__p.push('"></label>\r\n\
            <span class="img">');
 if(is_image) { __p.push('                <i data-src="');
_p(file.get_thumb_url());
__p.push('" class="filetype ');
_p(icon_class);
__p.push('"></i>');
 } else { __p.push('                <i class="filetype ');
_p(icon_class);
__p.push('"></i>');
 } __p.push('            </span>\r\n\
            <span class="name">\r\n\
                <p class="text"><em title="');
_p(file_name);
__p.push('" data-name="file_name">');
_p(text.text(can_ident ? file_name.slice(0,file_name.lastIndexOf('.')): file_name));
__p.push('</em></p></span>\r\n\
                <span class="tool"><span class="inner">\r\n\
                    <a data-action="delete" class="link-del" title="删除" href="#"><i class="ico-del"></i></a>\r\n\
                    <!--<a data-action="rename" class="link-rename" title="重命名" href="#"><i class="ico-rename"></i></a>-->\r\n\
                    <a data-action="share" class="link-share" title="分享" href="#"><i class="ico-share"></i></a>\r\n\
                    <a data-action="download" class="link-download" title="下载" href="#"><i class="ico-download"></i></a>\r\n\
                </span></span>\r\n\
            <span class="private-item private-countdown ');
_p(warn_class);
__p.push('"><span class="inner">剩余');
_p(remain_day);
__p.push('天</span></span>\r\n\
            <span class="private-item private-size"><span class="inner">');
_p(file.get_readability_size());
__p.push('</span></span>\r\n\
            <span class="private-item private-date"><span class="inner">');
_p(file.get_create_time());
__p.push('</span></span>\r\n\
            <span class="private-item private-qrcode"><a data-action="qrcode" class="link-dimensional" title="二维码" href="#"><i class="ico-dimensional"></i></a></span>\r\n\
        </div>');
 }); __p.push('');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var common = require('common'),
            query_user = common.get('./query_user');

        var is_qz_vip = query_user.get_cached_user().is_weiyun_vip(),
            qz_info = query_user.get_cached_user().get_qzone_info();
    __p.push('    <div id="_station_view_empty" class="g-empty transfer-files-empty" aria-label="文件中转站没有内容" tabindex="0">\r\n\
        <div class="empty-box">\r\n\
            <p class="content">腾讯微云于2016年5月27日升级【文件中转站】，现已不再提供文件临时存储功能。欢迎继续使用微云更加稳定，安全，快速的永久云存储服务。</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
}
};
return tmpl;
});
