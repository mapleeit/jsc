//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/photo/photo.r151223",["$","lib","common","main"],function(require,exports,module){

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
//photo/src/File_record.js
//photo/src/Loader.js
//photo/src/Mgr.js
//photo/src/Module.js
//photo/src/Remover.js
//photo/src/Thumb_loader.js
//photo/src/View.js
//photo/src/header/Toolbar.js
//photo/src/photo_time.js
//photo/src/time/Group.js
//photo/src/time/Select.js
//photo/src/time/Store.js
//photo/src/time/menu.js
//photo/src/View.tmpl.html
//photo/src/header/header.tmpl.html

//js file list:
//photo/src/File_record.js
//photo/src/Loader.js
//photo/src/Mgr.js
//photo/src/Module.js
//photo/src/Remover.js
//photo/src/Thumb_loader.js
//photo/src/View.js
//photo/src/header/Toolbar.js
//photo/src/photo_time.js
//photo/src/time/Group.js
//photo/src/time/Select.js
//photo/src/time/Store.js
//photo/src/time/menu.js
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
        date_time = lib.get('./date_time'),
        common = require('common'),
        https_tool = common.get('./util.https_tool'),

        File = common.get('./file.file_object');

    var Photo_file = inherit(File, {
        constructor : function(cfg){
            this.pid = cfg.pdir_key;
            this.ppid = cfg.ppdir_key;
            this.take_time = cfg.take_time;
            this.thumb_url = https_tool.translate_cgi(cfg.thumb_url);//缩略图，视频类有用到
            if(cfg.ext_info && cfg.ext_info.thumb_url) {
                this.thumb_url = https_tool.translate_cgi(cfg.ext_info.thumb_url);//缩略图，视频类有用到
                this.long_time = cfg.ext_info.long_time || 0;
            }
            this._checked = false;
            this.token_time = cfg.file_ttime || cfg.ext_info && cfg.ext_info.take_time;//拍摄时间
            if(typeof this.token_time === 'number') {
                this.token_time = date_time.timestamp2date(this.token_time);
            }
            this.tdate = date_time.parse_str(this.token_time);
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
            Photo_file.superclass.constructor.apply(this, [props]);
        },
        get_pid: function(){
            return this.pid;
        },

        get_ppid: function() {
            return this.ppid;
        },

        get_thumb_url: function() {
            return this.thumb_url;
        },

        // 获取拍摄时间
        get_take_time : function(){
            return this.take_time;
        },
        /**
         * 10 -> '10' ; 1 -> '01'
         * @param num
         * @returns {string}
         * @private
         */
        _ten: function (num) {
            return num < 10 ? '0' + num : num;
        },
        /**
         * 获取日期ID
         * @returns {String}
         */
        get_day_id: function () {
            if( this.day_id){
                return this.day_id;
            }
            return (this.day_id =  this.tdate.getFullYear() + '' + this._ten(this.tdate.getMonth() + 1) + '' + this._ten(this.tdate.getDate()));
        },
        /**
         * 获取拍摄时间
         * @returns {*}
         */
        get_token_time: function () {
            return this.token_time;
        },
        get_token_date: function(){
            return this.tdate;
        },

    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Photo_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Photo_file.prototype, fn_name, fn,
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
        date_time = lib.get('./date_time'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        Record = require('./File_record'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/user_library.fcg',
        DEFAULT_CMD = 'get_lib_list',
    //REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
    //DEFAULT_CMD = 'get_share_list',

        LIB_ID = {
            photo_time: 1,
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

        // 加载照片
        load_photos : function(offset, size){
            var def = $.Deferred(),
                is_refresh = offset === 0,//从0开始加载数据，则表示刷新
                me = this;
            var cmd = 'LibPageListGet';

            if(is_refresh) {//刷新前
                me.trigger('before_refresh');
            } else {//加载更多前
                me.trigger('before_load');
            }
            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: cmd,
                    re_try:3,
                    pb_v2: true,
                    body: {
                        lib_id : 2,
                        offset : offset,
                        count : size,
                        "sort_type": 3,//int型：排序方式：0上传时间；1修改时间；2字母序；3拍摄时间
                        group_id : 0,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    var photos = [];
                    var list_items = body.FileItem_items;
                    if(list_items){
                        $.each(list_items, function(index, photo){
                            photos.push(new Record(photo, photo.file_id));
                        });
                    }
                    def.resolve(photos, body.finish_flag);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    def.reject();
                    me.trigger('error', msg, ret);
                })
                .done(function() {
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
define.pack("./Mgr",["lib","common","$","./Remover","./time.Store"],function(require, exports, module){
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
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        Remover = require('./Remover'),
        time_store = require('./time.Store'),
        DEFAULT_PAGE_SIZE = 100,
        share_enter,
        downloader,
        file_qrcode,
        undefined;

    var TIP_TEXT = {
        photo_time: '时间',
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
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                    return false;// 不再触发recordclick
                }, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {
                    var records = this.view.get_selected();
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
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        // 删除
        on_delete : function(nodes, event){
            this.do_delete(nodes);
        },
        get_tip_text: function() {
            return TIP_TEXT[this.module_name];
        },
        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete : function(records, callback, scope){
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                time_store.batch_remove(success_nodes);
                //me.view.remove_refresh(success_nodes);
                me.view.cancel_sel();
                if(callback && typeof callback === 'function') {
                    callback.call(scope, true);
                }
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择' + this.get_tip_text());
                return;
            }
            this.do_delete(records);
        },

        // 直接点击记录
        on_open : function(records, e){
            var record = records[0];
            // 如果可预览，预览之
            if(e.target && e.target.tagName.toUpperCase() === 'INPUT') {//得命名时，点击文本框，不进行预览
                return;
            }

            e.preventDefault();
            this.preview_image(record);
        },

        /**
         * 图片预览（重写 FileListUIModule 的默认实现）
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        preview_image: function (file) {
            var me = this;

            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前目录下的图片
                var images = [];
                var read_images = function(){
                    me.store.each(function(record){
                        images.push(record);
                    });
                };
                read_images();
                image_preview.start({
                    complete : me.store.is_complete(),
                    total: images.length,
                    index: $.inArray(file, images),// 当前图片所在的索引位置
                    images: images,
                    load_more: function( callback ){
                        // 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
                        if(!me.store.is_complete()){ // 未加载，尝试加载之
                            me.load_files().done(function(){
                                images.splice(0, images.length);
                                read_images();

                                callback({
                                    'total': images.length,
                                    'complete': me.store.is_complete(),
                                    'images': images
                                });

                            }).fail(function(){
                                callback({ 'fail': true });
                            });
                        }
                        //加载完了
                        else{
                            callback({
                                'total': images.length,
                                'complete': me.store.is_complete(),
                                'images': images
                            });
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        downloader.down(file, e);
                    },
                    share: function(index){
                        require.async('share_enter', function(share_enter){
                            share_enter.get('./share_enter').start_share(images[index]);
                        });
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function(success){
                            if(success){
                                images.splice(index, 1);
                            }
                            callback();
                        });
                    }
                });
            });
        },
        /**
         * 排序操作
         * @param {String} sort_type 排序类型
         */
        on_sort: function(records, e) {
            var sort_type = extra.data;
            var size = this.store.size();
            if((size === 0 || size === 1) && this.loader.is_all_load_done()) {//无数据，就不排序了
                return;
            }
            this.load_files();
        },
        /**
         * 过滤文件类型操作
         * @param {String} filter_type 要过滤的文件类型
         */
        on_filter: function(records, e) {
        },
        /**
         * 重命名操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_rename: function(records, e) {

        },
        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_share: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(record);
                });
            } else {
                share_enter.start_share(record);
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(record, e);
                });
            } else {
                downloader.down(record, e);
            }
        },
        /**
         * 获取二维码操作
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_qrcode: function(records, e) {
            e.preventDefault();
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//file_qrcode
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(records);
                });
            } else {
                file_qrcode.show(records);
            }
        },
        /**
         * 右键跳转至具体路径
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         */
        on_jump: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(records.length == 1) {
                this.view.cancel_sel();
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
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
                    this.load_files();
                }
            }
        },
        /**
         * 分批加载数据
         */
        load_files: function(is_refresh) {
            var me = this,
                store = me.store,
                offset = is_refresh? 0 : store.size(),
                loader = me.loader;

            loader.load_photos(offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                if(offset === 0) {//开始下标从0开始表示重新加载
                    me.store.load(records, is_finish ? null : Number.MAX_VALUE);
                } else {
                    me.store.add(records);
                }
            }).fail(function(msg){
                //todo
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
 * @author xixinhuang
 * @date 2016-09-21
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
                header.render(this.$bar0_ct, this.$bar1_ct);
            }
            return header;
        },
        activate : function(){
            this.get_list_view().show();
            this.get_list_header().show();
            this.$bar1_ct.show();
            this.on_activate();
        },
        deactivate : function(){
            this.loader && this.loader.abort();
            this.get_list_view().hide();
            this.get_list_header().hide();
            this.$bar1_ct.empty();
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
                        me.$bar0_ct = main_ui.get_$bar0();   //工具条是bar0
                        me.$bar1_ct = main_ui.get_$bar1();   //编辑态是bar1
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
        ds_event = common.get('./global.global_event').namespace('photo_time'),
        ret_msgs = common.get('./ret_msgs'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),

        undefined;

    var Remover = inherit(Event, {

        /**
         * 先弹框提示，确认后再删除
         * @param {Array<FileNode>} files
         * @param {String} desc 描述
         * @returns {*}
         */
        remove_confirm: function(files, desc) {
            var me = this,
                def = $.Deferred();

            files = [].concat(files);
            desc = desc || (files.length>1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？');
            widgets.confirm(
                '删除图片',
                desc,
                '已删除的图片可以在回收站找到',
                function () {
                    progress.show("正在删除0/"+files.length);
                    me
                        .do_remove(files)
                        .progress(function(success_files){
                            progress.show("正在删除" + success_files.length+"/"+files.length);
                        }).done(function(success_files, failure_files){
                            if(!success_files.length && failure_files.length) {//全部不成功
                                mini_tip.warn('图片删除失败');
                            }if(failure_files.length){
                                mini_tip.warn('部分图片删除失败:' + this.get_part_fail_msg());
                            }else{
                                mini_tip.ok('删除图片成功');
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

        do_move_photos : function(photos, record){
            var me = this,
                old_group_id = me.store.get_group().get('id'),
                new_group_id = record.get('id');
            // 如果要分批操作，才显示progress
            var show_progress = photos.length > requestor.move_photo_threshold;
            if(show_progress){
                progress.show("正在移动0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return requestor.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show("正在移动" + success_photos.length+"/"+photos.length);
                }
            }).done(function(success_photos, failure_photos){
                me.store.batch_remove(success_photos);
                me.store.total_length -= success_photos.length;
                ds_event.trigger('move', success_photos, {
                    old_group_id : old_group_id,
                    new_group_id : new_group_id,
                    src : me.store
                });
                if(failure_photos.length){
                    mini_tip.warn('部分图片更改分组失败');
                }else{
                    mini_tip.ok('更改分组成功');
                }
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                if(show_progress){
                    progress.hide();
                }else{
                    widgets.loading.hide();
                }
            });
        },

        step_move_photos: function() {

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
 * 通用的缩略图加载，原网盘的加载与文件列表耦合太高。时间轴的加载是单例，存在风险。
 * @author cluezhang
 * @date 2013-11-10
 */
define.pack("./Thumb_loader",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('photo.Thumb_loader'),
        
        image_loader = lib.get('./image_loader'),
        
        common = require('common'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        
        $ = require('$');
    var STATE = {
        Initial : 'initial', // 刚创建
        Pending : 'pending', // 待命
        Loading : 'loading', // 请求ftn地址
        Loaded : 'loaded', // 请求ftn完毕，等待缓存
        Caching : 'caching', // 缓存中
        Fetched : 'fetched', // 完成
        FtnFail : 'ftnfail', // 申请ftn下载地址失败
        CacheFail : 'cachefail' // 从ftn加载失败
    };

    var BATCH_DOWNLOAD_LIMIT_COUNT; //批量下载文件数限制
    var Task = inherit(Object, {
        cgifail : 0,
        imgfail : 0,
        constructor : function(host, pid, id, name, url){
            this.host = host;
            this.pid = pid;
            this.id = id;
            this.name = name;
	        if(url) {
		        this.url = url;
	        }
            this.defs = []; // 监听的人
            this.state = STATE.Initial;
        },
        change_state : function(state){
            var old_state = this.state, defs, me;
            if(state === old_state){
                return;
            }
            this.state = state;
            this.notify_state_change(state, old_state);
        },
        // 开始任务
        start : function(){
//            if(this.state!==STATE.Initial){
//                return;
//            }
            this.change_state(STATE.Pending);
        },
        // 开始请求ftn地址
        start_requesting : function(){
//            if(this.state!==STATE.Pending){
//                return;
//            }
            this.change_state(STATE.Loading);
        },
        // 成功取得ftn地址
        finish_requesting : function(url){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.url = url;
            // 记录ftn生成地址的时间
            this.loaded_time = new Date();
            this.change_state(STATE.Loaded);
        },
        // 请求ftn地址失败
        fail_requesting : function(){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.cgifail++;
            if(this.cgifail>=1){
                return this.totally_fail_requesting();
            }
            this.change_state(STATE.Pending);
        },
        // 放弃请求ftn地址，判定为抢救无效
        totally_fail_requesting : function(){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.change_state(STATE.FtnFail);
            var defs = this.defs;
            this.defs = [];
            $.each(defs, function(index, def){
                def.reject();
            });
        },
        // 开始使用img加载图片
        start_caching : function(){
            if(this.state!==STATE.Loaded){
                return;
            }
            this.change_state(STATE.Caching);
        },
        // img成功加载图片
        finish_caching : function(img){
            if(this.state!==STATE.Caching){
                return;
            }
            this.img = img;
            this.change_state(STATE.Fetched);
            var defs = this.defs, me = this;
            this.defs = [];
            $.each(defs, function(index, def){
                def.resolve(me.url, me.img);
            });
        },
        // img加载图片失败
        fail_caching : function(){
            if(this.state!==STATE.Caching){
                return;
            }
            this.imgfail++;
            if(this.imgfail>=3){
                return this.totally_fail_caching();
            }
            this.change_state(STATE.Loaded);
        },
        // img加载图片失败，判定为抢救无效
        totally_fail_caching : function(){
            if(this.state!==STATE.Caching){
                return;
            }
            this.change_state(STATE.CacheFail);
            var defs = this.defs;
            this.defs = [];
            $.each(defs, function(index, def){
                def.reject();
            });
        },
        notify_state_change : function(state, old_state){
            this.host.on_task_state_change(this, state, old_state);
        },
        // 注册回调
        ready : function(def){
            var last_time = this.loaded_time;
            // 如果过了11.5小时，ftn提供的地址已经失败，需要重新拉。（ftn目前的失效时间是12小时）
            if(last_time && (new Date() - last_time) > 11.5*60*60*1000){
                this.start();
            }
            switch(this.state){
                case STATE.Fetched:
                    def.resolve(this.url, this.img);
                    break;
                case STATE.FtnFail:
                case STATE.CacheFail:
                    def.reject();
                    break;
                default:
                    this.defs.push(def);
                    break;
            }
        }
    });
    var Module = inherit(Event, {
        width : 256,
        height : 256,
        buffer : 1,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.cgi_requesting = 0; // 并发的cgi请求数
            this.img_requesting = 0; // 并发的ftn img请求数
            this.maps = {
                all : {}, // 所有任务
                pending : {}, // 还没有开始请求的
                loaded : {} // 还没有用imgLoader缓存的
            };

            this.prefer_ids = [];//优化加载的图片的文件ids
            BATCH_DOWNLOAD_LIMIT_COUNT = query_user.get_cached_user() && query_user.get_cached_user().get_files_download_count_limit() || 10;
        },
        get : function(pid, id, name, url){
            var def = $.Deferred();
            
            var task = this.get_task(pid, id, name, url);
            task.ready(def);
            
            this.buffer_load();
            
            return def;
        },
        get_task : function(pid, id, name, url){
            var map = this.maps.all;
            if(map.hasOwnProperty(id)){
                return map[id];
            }
            var task = new Task(this, pid, id, name, url);
            // 立即开始排队
            task.start();
            return task;
        },
        on_task_state_change : function(task, state, old_state){
            var map, dtask;
            switch(state){
                case STATE.Pending: // 准备请求，放到pending中，等待请求ftn地址
                    this.put_task_to_map(task, this.maps.pending);
                    break;
                case STATE.Loaded: // 加载完成，放到loaded中，等待缓存
                    this.put_task_to_map(task, this.maps.loaded);
                    break;
                case STATE.Fetched: // 加载完成，啥也不用干
                    break;
            }
            switch(old_state){
                case STATE.Initial: // 刚创建，放到all
                    this.put_task_to_map(task, this.maps.all);
                    break;
                 case STATE.Pending: // 结束加载等待，从pending中移除
                    this.remove_task_from_map(task, this.maps.pending);
                    break;
                case STATE.Loaded: // 结束缓存等待，从loaded中移除
                    this.remove_task_from_map(task, this.maps.loaded);
                    break;
            }
        },
        put_task_to_map : function(task, map){
            map[task.id] = task;
        },
        remove_task_from_map : function(task, map){
            delete map[task.id];
        },
        buffer_load : function(){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout($.proxy(this.do_load, this), this.buffer);
        },
        // 从ftn加载
        do_load : function(){
            var tasks, task;
            while(this.can_request()){
                // 从pending待请求列表中取一个目录的任务
                tasks = this.get_next_directory_task(this.maps.pending);
                if(!tasks.length){ // 没有任务了
                    break;
                }
                this.batch_request_ftn(tasks);
            }
            while(this.can_cache()){
                task = this.get_next_task(this.maps.loaded);
                if(!task){
                    break;
                }
                this.cache_img(task);
            }
        },
        get_next_directory_task : function(map){
            var id, tasks = [], me = this;
            $.each(this.prefer_ids, function(i, id) {
                if(map[id]) {
                    tasks.push(map[id]);
                    me.prefer_ids.splice(i, 1);
                }

                if(tasks.length >= BATCH_DOWNLOAD_LIMIT_COUNT) {
                    return false
                }
            });

            if(tasks.length >= BATCH_DOWNLOAD_LIMIT_COUNT) {
                return tasks;
            }

            for(id in map){
                if(map.hasOwnProperty(id)){
                    tasks.push(map[id]);
                    // img_view_bat一次只拉10个
                    if(tasks.length>=BATCH_DOWNLOAD_LIMIT_COUNT){
                        break;
                    }
                }
            }
            return tasks;
        },
        get_next_task : function(map){
            var id, me = this, task;
            $.each(this.prefer_ids, function(i, id) {
                if(map[id]) {
                    task = map[id];
                    me.prefer_ids.splice(i, 1);
                    return false;
                }
            });

            if(task) {
                return task;
            }

            for(id in map){
                if(map.hasOwnProperty(id)){
                    return map[id];
                }
            }
        },
        // private
        // 批量请求ftn下载地址，必须是同目录下的
        batch_request_ftn : function(tasks){
            var me = this;
	        var req;
            var user = query_user.get_cached_user();
            if(!user){
                me.user_no_ready = true;
                query_user.on_ready(function(){
                    me.user_no_ready = false;
                    me.buffer_load();
                });
                return;
            }
            this.cgi_requesting++;
            var map = {};
	        var reqTask = [];
            $.each(tasks, function(index, task){
	            if(task.url) {
		            task.finish_requesting(task.url + (task.url.indexOf('?') > -1 ? '&' : '?') + 'size=' + me.width + '*' + me.height);
	            } else {
		            map[task.id] = task;
		            task.start_requesting();
		            reqTask.push(task);
	            }
            });

	        if(reqTask.length) {
		        req = request.xhr_post({
			        url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
			        cmd: 'DiskFileBatchDownload',
			        cavil: true,
			        pb_v2: true,
			        body: {
				        need_thumb: true,
				        file_list: $.map(tasks, function(task, i) {
					        return {
						        file_id: task.id,
						        filename: task.name,
						        pdir_key: task.pid
					        };
				        })
			        }
		        });

		        req.ok(function(msg, body, header, data) {
			        $.each(body['file_list'], function(index, img_rsp) {
				        var id = img_rsp['file_id'];
				        var task = map[id];
				        if(!task) {
					        return;
				        }
				        delete map[id]; // 加载好了的就删掉
				        var ret = parseInt(img_rsp['retcode'], 10), url;
				        if(ret === 0) {
					        var host = img_rsp['server_name'],
						        port = img_rsp['server_port'],
						        path = img_rsp['encode_url'];
					        if(img_rsp.download_url) {
						        url = img_rsp.download_url + (img_rsp.download_url.indexOf('?') > -1 ? '&' : '?') + 'size=' + me.width + '*' + me.height;
					        } else {
						        url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=' + me.width + '*' + me.height; // 64*64  /  128*128
					        }
					        url = https_tool.translate_url(url);
					        task.finish_requesting(url);
				        } else {
					        task.fail_requesting();
				        }
			        });
			        // 如果cgi没有返回？
			        var id;
			        for(id in map) {
				        if(map.hasOwnProperty(id)) {
					        map[id].fail_requesting();
				        }
			        }
		        }).fail(function() {
			        $.each(tasks, function(index, task) {
				        task.fail_requesting();
			        });
		        }).done(function() {
			        // 请求结束后继续加载
			        me.cgi_requesting--;
			        me.buffer_load();
		        });
	        } else {
		        // 请求结束后继续加载
		        me.cgi_requesting--;
		        me.buffer_load();
	        }
        },
        // 限制并发
        can_request : function(){
            return !this.user_no_ready && this.cgi_requesting < 3;
        },
        cache_img : function(task){
            this.img_requesting++;
            
            var me = this;
            task.start_caching();
            image_loader.load(task.url).done(function(img){
                task.finish_caching(img);
            }).fail(function(){
                task.fail_caching();
            }).always(function(){
                me.img_requesting--;
                me.buffer_load();
            });
        },
        // 限制并发
        can_cache : function(){
            return this.img_requesting < 25;
        },
        /**
         * 设置优先加载图片的文件ids,用于优化加载指定图片
         * @param id_arr
         */
        set_prefer: function(id_arr) {
            this.prefer_ids = (id_arr || []).concat(this.prefer_ids); // 新加入的ids放前面优先处理
        }
    });
    return Module;
});/**
 * 库分类（文档、视频、音频）列表视图类
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./View",["lib","common","$","./tmpl","main","./Thumb_loader","./time.Store"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        image_loader = lib.get('./image_loader'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        blank_tip = common.get('./ui.blank_tip'),
        ThumbHelper = common.get('./ui.thumb_helper'),

        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        SelectBox = common.get('./ui.SelectBox'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        Thumb_loader = require('./Thumb_loader'),
        time_store = require('./time.Store'),

        thumb_loader = new Thumb_loader({
            width : 256,
            height : 256
        }),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        thumb_helper,
        undefined;

    var File_view = inherit(View, {

        module_name: '',
        list_selector : '',
        item_selector : 'li[data-record-id]',
        action_property_name : 'data-action',

        enable_box_select : true,
        enable_select : true,

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        scroller : main_ui.get_scroller(),
        //enable_empty_ui : true,
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;
        },

        list_tpl : function(){
            return tmpl[this.module_name+'_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_file_item']([file]);
        },

        get_html : function(records){
            if(this.module_name === 'photo_time') {
                records = time_store.init_data(records);
                if(records.length && records[0].offset) {
                    //防止超过100的，这里用-1来标识
                    var is_finish = (records[0].length >= 100 || records.length === 1)? false : true;
                    records[0].set_offset(is_finish? 0 : -1);
                    this.append_$items(records[0]);
                    records = records.slice(1);
                }
            }
            return tmpl[this.module_name+'_file_item']({
                records : records,
                item_width: this.get_item_width()
            });
        },

        item_menu_class : 'context-menu',
        shortcuts: {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            selected: function(checked, view) {
                //todo
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
            this.disable_selection();
            this.cancel_sel();
            time_store.destroy();
        },

        is_activated: function() {
            return this._activated;
        },

        //插入记录，扩展父类
        on_add: function(store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_update : function(){
            File_view.superclass.on_update.apply(this, arguments);
            this.update_thumb();
        },
        refresh : function(){
            File_view.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },

        after_render : function(){
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_record_click, this);

            thumb_helper = new ThumbHelper({
                container: '#_photo_time_body',
                height_selector: '.figure-list-item-pic',
                item_selector: 'li[data-record-id]'
            });
        },

        on_datachanged: function() {
            File_view.superclass.on_datachanged.apply(this, arguments);
            if(this.store.size() === 0) {//无数据时，显示空白运营页
                this.refresh_empty_view();
                this.get_$view_ct().hide();
            } else {
                this.init_sel_box();
                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$view_ct().show();
            }
        },

        /**
         * 插入同个日期的数据
         */
        append_$items: function(group) {
            var $ct = $('#time_' + group.get_day_id());
            $(tmpl.photo_time_file_cell({records: group.get_array()})).appendTo($ct.find('.figure-list'));
        },

        _handle_select_change: function() {
            var records = this.Select.get_selected_nodes();
            this.show_edit(records);
        },

        _handle_record_click: function (file, e) {
           var $target = $(e.target),
               $item = $target.closest('li[data-list]'),
               is_check = $target.closest('.icon-check-m').length > 0;
            if(is_check) {
                //勾选文件
                this.Select.select($item, file.get_id());
                file.set('selected', true);
                this.show_edit();
            } else {
                this.trigger('action', 'open', file, e);
            }
        },

        show_edit: function(records) {
            records = records || this.get_selected();
            if(!records || records.length === 0) {
                main_ui.toggle_edit(false);
            } else {
                main_ui.toggle_edit(true, records.length);
            }
        },

        cancel_sel: function() {
            var records = this.Select.get_selected_nodes();
            $.each(records, function(i, record) {
                record.set('selected', false);
            });
            this.Select.clear();
            main_ui.toggle_edit(false);
        },

        set_selected : function(records){
            records = $.isArray(records) ? records : [records];
            var file_id,
                me = this,
                $ct = this.get_$view_ct();
            $.each(records, function(i, record) {
                file_id = record.get_id();
                if (!me.Select.is_selected(file_id)) {
                    me.Select.select($ct.find('[data-record-id='+file_id+']'), file_id);
                }
            });
        },

        get_selected : function(){
            if(this.enable_select){
                return this.Select.get_selected_nodes();
            }
            return [];
        },

        _if_block_hover : function(){
            var $view_ct = this.get_$view_ct();
            $view_ct.toggleClass('block-hover', !!this.is_multi_selection || !!this.is_menu_on);
        },

        /**
         * 删除图片
         */
        delete_item: function(record) {
            var dom_id = this.Select.get_dom_id(record.get_id());
            var $dom = $('#' + dom_id);
            if($dom) {
                $dom.remove();
            }
            this.refresh_empty_view();
            ////更新空页面状态
            //File_view.superclass.refresh_empty_text.apply(this, arguments);
        },

        /**
         * 删除图片日期分组
         */
        delete_group: function(group) {
            var day_id = group.get_day_id();
            var $dom = $('#time_' + day_id);
            if($dom) {
                $dom.remove();
            }
            this.refresh_empty_view();
        },

        refresh_empty_view: function() {
            if(this.store.size() === 0) {
                if(!this.$view_empty) {
                    this.show_empty_ui();
                } else if(!this.get_$view_empty().length){
                    this.$view_empty.appendTo(this.get_$view_ct());
                } else{
                    this.get_$view_empty().show();
                }
            }
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$view_empty && this.$view_empty.hide();
        },
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$view_empty = blank_tip.show({
                id: 'j-photo-time-empty',
                to: this.get_$view_ct(),
                icon_class: 'icon-nopicture',
                title: '暂无图片',
                content: '请点击右上角的“添加”按钮添加'
            });
        },
        /**
         * 勾选文件
         * @param e
         */
        select_file: function (e) {
            e.stopPropagation();
            var me = View,
                file = me.get_file_by_el(this);
            this.Select[ file.toggle_check() ? 'select' : 'un_select'](me.get_$item(this), file.get_id());
        },
        /**
         * 禁用框选
         */
        disable_selection: function () {
            this.stopListening(this.Select, 'select_change', this._handle_select_change);
            this.sel_box && this.sel_box.disable();
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            this.sel_box && this.sel_box.enable();
        },

        init_sel_box: function() {
            if(this.sel_box) {
                //this.Select.bind_select_box(this.store, this.sel_box);
                this.listenTo(this.Select, 'select_change', this._handle_select_change);
                this.enable_selection();
                return;
            }
            var me = this;
            me.sel_box = new SelectBox({
                ns: 'photo_time',
                //$el: me.get_$view_list(),
                get_$els: me.get_$els,
                $scroller: this.scroller.get_$el(),
                selected_class: 'act',
                keep_on: function ($tar) {
                    return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return $tar.closest('.figure-list-item').length === 0;
                },
                container_width: function () {
                    return me.get_$view_ct().width() - 110;
                }
            });
            this.Select.bind_select_box(me.store, me.sel_box);
            this.listenTo(this.Select, 'select_change', this._handle_select_change);
            this.enable_selection();
        },
        /**
         * 刷新框选
         */
        refresh_SelectBox: function () {
            this.Select.clear();
            if (this.sel_box) {
                this.sel_box.refresh();
            }
        },
        /**
         * 更新所有缩略图
         */
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.get_$view_ct().find(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
                    me._fetch_photo_thumb(record, $item);
                }
            });
        },

        _fetch_photo_thumb: function(record, $item) {
            var me = this;
            thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                var $img = $(img), $replace_img;
                $replace_img = $('<img src="' + url +'"/><i class="icon icon-check-m j-icon-checkbox"></i>');
                $replace_img.attr('unselectable', 'on');
                me.update_record_dom_thumb(record, $item, $replace_img);
            });
        },

        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('[data-id=img]').empty().append($img);
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

            var records;

            if(record.get('selected')){
                records = this.Select.get_selected_nodes();
            }else{
                this.cancel_sel();
                record.set('selected', true);
                records = [record];
            }
            this.context_records = records;
            this.set_selected(records);
            this.show_edit(records);

            var menu = this.menu.get_photo_context_menu(records, e);


            var me = this;
            me.is_menu_on = true;
            me._if_block_hover();
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                //if(records.length === 1 && record.get('selected')) {
                    //record.set('selected', false);
                //}
                me.context_records = null;
                me.is_menu_on = false;
                me._if_block_hover();
                me.stopListening(me.menu, 'action');
            });
            this.listenTo(this.menu, 'action', function(config_id) {
                me.trigger('action', config_id, me.context_records, e);
            });
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
        },

        update_item_width: function() {
            if(thumb_helper) {
                var body_width = this.get_$view_ct().width();
                thumb_helper.update_item_width(body_width);
            }
        },

        get_$els: function() {
            return $('#_photo_time_body .figure-list');
        },

        get_item_width: function() {
            if(!thumb_helper) {
                return null;
            }
            var body_width = this.get_$view_ct().width();
            return thumb_helper.get_item_width(body_width);
        },

        get_$view_empty: function() {
            return this.get_$view_ct().find('#j-photo-time-empty');
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_normal'));
        },

        get_$view_list: function() {
            return this.$view_list || (this.$view_list = this.get_$view_ct().find('.figure-list'));
        },

        get_$view_items: function() {
            return this.$view_items || (this.$view_items = this.get_$view_list().children());
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_' + this.module_name + '_body'));
        },

        get_$load_more: function() {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(main_ui.get_$main_content()));
        },

        get_$rename_editor: function() {
            return this.$rename_editor || (this.$rename_editor = $(tmpl.rename_editor()));
        }
    });
    return File_view;
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

        render: function($toolBar, $editBar) {
            if(!this.rendered) {
                this.$toolBar = $(tmpl[this.module_name+'_toolbar']()).appendTo($toolBar);
                this.$editBar = $(tmpl[this.module_name+'_editbar']()).appendTo($editBar.empty());
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
            this.current_item_map['filter'] = this.$toolBar.find('[data-filter=all]').addClass('cur');
        },

        /**
         * 绑定action事件
         */
        bind_action: function() {
            var me = this;
            me.current_item_map = me.current_item_map || {};
            this.$toolBar.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$toolBar);
                var action_name = $target.attr(action_property_name);
                var action_data = $target.attr('data-' + action_name);
                var $last_click_item = me.current_item_map[action_name];

                if(action_name !== 'batch_delete' && $last_click_item) {
                    if($last_click_item[0] == $target[0]) {//重复点击，无效
                        return;
                    } else {
                        $last_click_item.removeClass('cur');
                    }
                }
                $target.addClass('cur');
                if(action_name !== 'refresh') {//刷新就一个按钮，无需判断是否切换
                    me.current_item_map[action_name] = $target;
                }
                me.trigger('action', action_name, action_data, e);
            });

            this.$editBar.on('click', function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$editBar);
                var action_name = $target.attr(action_property_name);
                var action_data = $target.attr('data-' + action_name);
                var $last_click_item = me.current_item_map[action_name];

                if(action_name !== 'batch_delete' && $last_click_item) {
                    if($last_click_item[0] == $target[0]) {//重复点击，无效
                        return;
                    } else {
                        $last_click_item.removeClass('cur');
                    }
                }
                $target.addClass('cur');
                if(action_name !== 'refresh') {//刷新就一个按钮，无需判断是否切换
                    me.current_item_map[action_name] = $target;
                }
                me.trigger('action', action_name, action_data, e);
            });

            var $base_btn = this.$toolBar.find('[data-id="sort"]'),
                $list = this.$toolBar.find('[data-dropdown]'),
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
            this.$toolBar.on('click.view_switch', '[data-view]:not(.selected)', function (e) {

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
            this.$toolBar.show();
            this.$editBar.parent().show();
        },

        hide: function() {
            this.rendered = false;
            this.$toolBar.hide();
            this.$editBar.parent().empty();
        }
    });

    return Toolbar;

});/**
 * 图片时间轴模块
 * @author xixinhuang
 * @date 2016-09-21
 */
define.pack("./photo_time",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.Toolbar","./time.menu","./time.Select"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        time_global_event = common.get('./global.global_event').namespace('photo_time'),
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

        module_name = 'photo_time',//库分类模块名
        menu = require('./time.menu'),
        Select = require('./time.Select'),

        scroller,
        doc = document, body = doc.body, $body = $(body),
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
        Select: Select,
        menu: menu,
        list_selector : '#_photo_time_body'
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
                mgr.load_files(true);
                scroller = main_ui.get_scroller();
                mgr.set_scroller(scroller);
                inited = true;
            } else {
                mgr.load_files(true);
            }
        },
        on_activate: function() {
            var me = this;
            $body.addClass('page-picture');
            me.init();
            this.listenTo(global_event, 'doc_refresh', this.on_refresh);
            this.listenTo(global_event, 'edit_cancel_all', this.on_cancel_sel);
            this.listenTo(time_global_event, 'delete_item', this.on_delete_item);
            this.listenTo(time_global_event, 'delete_group', this.on_delete_group);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            main_ui.sync_size();
        },

        on_deactivate: function() {
            $body.removeClass('page-picture');
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'doc_refresh', this.on_refresh, this);
            this.stopListening(global_event, 'edit_cancel_all', this.on_cancel_sel, this);
            this.stopListening(time_global_event, 'delete_item', this.on_delete_item, this);
            this.stopListening(time_global_event, 'delete_group', this.on_delete_group, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            mgr.load_files(true);
        },

        /**
         * 编辑态bar中，点击取消选择
         */
        on_cancel_sel: function() {
            this.list_view.cancel_sel();
        },
        /**
         * 删除图片
         */
        on_delete_item: function(record) {
            this.list_view.delete_item(record);
        },
        /**
         * 删除图片日期分组
         */
        on_delete_group: function(group) {
            this.list_view.delete_group(group);
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
                mgr.load_files();//从后加载
            }

            //窗口大小改变时，也需要调整item的width
            view.update_item_width();
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files();
            }
        }
    });

    return module.get_common_module();
});/**
 * User: trumpli
 * Date: 13-11-7
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.Group",["$","lib"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        date_time = lib.get('./date_time'),
        Time_Group = function (opt) {
            this.same_photo_map = {};
            this.array = [];
            this.length = 0;
            this.offset = 0;//已被读取的位置
            var date = date_time.parse_str(opt.token_time);
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.date = date.getDate();
            this._is_dirty = false;
            this.day_id = this.year + '' + this._ten(this.month) + '' + this._ten(this.date);
        };
    $.extend(Time_Group.prototype, {
        /**
         * 标记为需要没有完成输出
         * @param dirty
         */
        set_dirty: function(dirty){
            this._is_dirty = dirty;
        },
        /**
         * 返回是否全部输出
         * @returns {boolean}
         */
        is_dirty: function(){
            return this._is_dirty;
        },
        /**
         * 10 -> '10' ; 1 -> '01'
         * @param num
         * @returns {string}
         * @private
         */
        _ten: function (num) {
            return num < 10 ? '0' + num : num;
        },
        /**
         * 获取日期ID
         * @returns {String}
         */
        get_day_id: function () {
            return this.day_id;
        },
        get_year: function () {
            return this.year;
        },
        get_month: function () {
            return this.month;
        },
        get_date: function () {
            return this.date;
        },
        /**
         * 添加节点
         * @param {Photo_Node} node
         */
        add_node: function (node) {
            var file_sha = node.get_file_sha();
            if(!this.same_photo_map[file_sha]) {
                this.array.push(node);
                this.length += 1;
            }

            this.same_photo_map[file_sha] = this.same_photo_map[file_sha] || [];
            this.same_photo_map[file_sha].push(node);
        },
        /**
         * 删除节点
         * @param {HashMap<String,boolean>} id_map
         */
        remove_nodes: function (id_map) {
            var me = this,len = me.length;
            while(len){
                len-=1;
                var cur_node = me.array[len];
                if ( id_map.hasOwnProperty(cur_node.get_id()) ) {
                    var file_sha = cur_node.get_file_sha(),
                        same_nodes = me.same_photo_map[file_sha],
                        same_nodes_len = same_nodes.length;
                    //要判断相同的照片是否删除完
                    $.each(same_nodes, function(i, node) {
                        if(id_map.hasOwnProperty(node.get_id())) {
                            same_nodes_len--;
                        }
                    });
                    if(same_nodes_len <= 0) {
                        me.array.splice(len, 1);
                        me.length -= 1;
                        me.same_photo_map[file_sha] = [];
                    }
                }
            }
            /**

             for (var len = me.length - 1; len >= 0; len--) {
                if ( id_map.hasOwnProperty(me.array[len].get_id()) ) {
                    me.array.splice(len, 1);
                    me.length -= 1;
                }
            }
             */
            return me.length;
        },
        /**
         * offset代表该日期已经有图片，渲染的时候插入前面的记录即可
         */
        set_offset: function(offset) {
            this.offset = offset;
        },
        /**
         * 重置
         */
        reset: function () {
            this.offset = 0;
        },
        get_array: function () {
            return this.array;
        },
        each: function(fn){
            for(var i = 0 ,j = this.array.length;i<j;i++){
                fn.call(null,this.array[i]);
            }
        },

        get_same_nodes_by_sha: function(file_sha) {
            return this.same_photo_map[file_sha];
        },

        has_del_same_nodes: function(node) {
            var file_sha = node.get_file_sha();
            if(!this.get_same_nodes_by_sha(file_sha).length) {
                return true;
            }

            return false;
        }
    });
    return Time_Group;
});
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.Select",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        Module = common.get('./module'),
        $body = $('#_photo_time_body'),
        selected_item_class = 'act',
        selected_length = 0,
        selected_cache = {};

    var Select = new Module('photo_time_select', {
        store: null,
        cell_id_prefix : 'photo_time_',
        get_dom_id : function(file_id){
            return this.cell_id_prefix + file_id;
        },
        get_file_id : function(dom_id){
            if(dom_id && dom_id.indexOf(this.cell_id_prefix) === 0){
                return dom_id.slice(this.cell_id_prefix.length);
            }
        },
        bind_select_box : function(store, sel_box){
            this.store = store;
            var old_sel_box = this.sel_box;
            if(old_sel_box){
                old_sel_box.off('select_change', this.handle_selection_change, this);
            }
            this.sel_box = sel_box;
            // 绑定后进行一次同步
            var file_id, selecteds = [];
            for(file_id in selected_cache){
                if(selected_cache.hasOwnProperty(file_id)){
                    selecteds.push(this.get_dom_id(file_id));
                }
            }
            sel_box.clear_selected();
            sel_box.set_selected_status(selecteds, true);

            sel_box.on('select_change', this.handle_selection_change, this);
        },
        handle_selection_change : function(sel_id_map, unsel_id_map){
            var html_id;
            for (html_id in sel_id_map) {
                if (sel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = this.store.get(id);
                    if (node) {
                        node.set('selected', true, true);
                        if(!selected_cache.hasOwnProperty(id)){
                            selected_cache[id] = id;
                            selected_length +=1;
                        }
                    }
                }
            }
            for (html_id in unsel_id_map) {
                if (unsel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = this.store.get(id);
                    if (node) {
                        node.set('selected', false, true);
                        if(selected_cache.hasOwnProperty(id)){
                            delete selected_cache[id];
                            selected_length -=1;
                        }
                    }
                }
            }
            this.trigger('select_change');
        },
        /**
         * 选中元素
         * @param $el
         * @param file_id
         */
        select: function ($el,file_id) {
            if(selected_cache[file_id]){
                this.un_select($el, file_id);
                return false;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], true);
            }else{
                $el.addClass('photo-view-list-selected');
            }
            selected_cache[file_id] = file_id;
            selected_length += 1;
            return true;
        },
        /**
         * 反选元素
         * @param $el
         * @param file_id
         */
        un_select: function ($el,file_id) {
            if(!file_id){
                return false;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], false);
            }else{
                $el.removeClass(selected_item_class);
            }
            delete selected_cache[file_id];
            selected_length -= 1;
            return true;
        },
        clear : function(){
            var me = this,
                file_id,
                selected_items = this.get_selected_nodes();
            $.each(selected_items, function(i, item) {
                file_id = item.get_id();
                me.un_select($body.find('[data-record-id='+file_id+']'), file_id);
            });
            selected_cache = {};
            selected_length = 0;
        },
        /**
         * 是否被选中
         * @param file_id
         * @returns {boolean}
         */
        is_selected: function(file_id){
            return !!selected_cache[file_id];
        },
        /**
         * 反选其他，但选中自己
         * @param file_id
         */
        unselected_but: function(file_id){
            for(var key in selected_cache){
                if(selected_cache.hasOwnProperty(key)){
                    var node = this.store.get(key);
                    if( node && key !== file_id ){
                        node.toggle_check();//退出选中状态
                        this.un_select($body.find('[data-file-id='+key+']'),key);
                    }
                }
            }
            this.select($body.find('[data-file-id='+file_id+']'),file_id);
        },
        /**
         * 返回选中的个数
         * @returns {number}
         */
        get_selected_length: function(){
            return selected_length;
        },
        /**
         * 获取选中的节点
         * @return {Array<Poto_Node>}
         */
        get_selected_nodes: function(){
            var ret = [];
            if(selected_length){
                for(var key in selected_cache){
                    if(selected_cache.hasOwnProperty(key)){
                        var node = this.store.get(key);
                        if( node ){
                            ret.push(node);
                        }
                    }
                }
            }
            return ret;
        }
    });

    return Select;
});
/**
 * 图片日期分组数据
 * @author xixinhuang
 * @date 16-09-28
 */
define.pack("./time.Store",["lib","common","./time.Group"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Module = common.get('./module'),
        time_global_event = common.get('./global.global_event').namespace('photo_time'),
        Time_Group = require('./time.Group');

    var group_map = {};

    var Store = new Module('recycle_header', {

        init_data: function (data) {
            var me = this,
                day_id,
                group,
                groups = this.sort_group(data);

            $.each(groups, function(index, item){
                day_id = item.get_day_id();
                if(!group_map[day_id]) {
                    group_map[day_id] = item;
                } else {
                    group = group_map[day_id];
                    item.set_offset(group.offset<0? 100 : group.length);
                    group_map[day_id] = me.concat_group(group, item);
                }
            });
            return groups;
        },
        /**
         * 合并两个日期分组
         * @param old_group
         * @param group
         */
        concat_group: function(old_group, group) {
            var items = group.get_array();
            $.each(items, function(index, item){
                old_group.add_node(item);
            });
            return old_group;
        },

        batch_remove: function(records) {
            if(!records || records.length === 0) {
                return;
            }
            var day_id,
                me = this;

            $.each(records, function(index, record) {
                day_id = record.get_day_id();
                if(!!group_map[day_id]) {
                    me.remove(record);
                    time_global_event.trigger('delete_item', record);
                }
            });
        },
        remove: function(record) {
            var file_id = record.get_id(),
                day_id = record.get_day_id();
            var data = {};
            data[file_id] = 1;
            group_map[day_id].remove_nodes(data);

            if(!group_map[day_id].length) {
                time_global_event.trigger('delete_group', group_map[day_id]);
                delete group_map[day_id];
            }
        },
        get_group: function(day_id) {
            return group_map[day_id];
        },
        get_groups: function() {
            return group_map;
        },
        update_group: function(group) {

        },
        destroy: function () {
            group_map = {};
        },
        remove_group : function(day_id){
            delete group_map[day_id];
        },
        /**
         * 返回排序分组后的数据
         * @param data
         * @return [Array<Time_Group>]
         */
        sort_group: function (data) {
            if (!data || !data.length)
                return [];
            //按天分组
            var group = {};
            for (var i = 0, j = data.length; i < j; i++) {
                var node = data[i],
                    day_id = node.get_day_id();
                if (!group[day_id]) {
                    group[day_id] =
                        new Time_Group({
                            'token_time': node.get_token_time()
                        });
                }
                group[day_id].add_node(node);//嫁接
            }
            //按拍摄时间排序
            var sort_array = [];
            for (var key in group) {
                sort_array.push(group[key]);
            }
            sort_array.sort(function (g1, g2) {
                return g2.get_day_id() - g1.get_day_id();
            });
            return sort_array;
        }
    });

    return Store;
});/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author trump
 * @date 13-11-09
 */
define.pack("./time.menu",["lib","common","./time.Select"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),

        Select = require('./time.Select'),
        item_maps = {
            //时间轴
            time: {
                download: 1,
                'delete': 1,
                share: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;

    var menu = new Module('photo_time_menu', {

        render: function () {
            var me = this;
            me.photo_time_menu = me._create_photo_time_menu();
        },

        /**
         * 显示相册时间轴右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        get_photo_context_menu: function (records, e) {
            var visible_items = $.extend({}, item_maps.time);
            if(records.length > 1 ){
                delete visible_items['download'];
                delete visible_items['share'];
                delete visible_items['qrcode'];
                delete visible_items['jump'];
            }
            this.context_records = records;
            this.photo_time_menu = this.photo_time_menu || this._create_photo_time_menu();
            this.photo_time_menu.show(e.pageX, e.pageY, visible_items);

            return this.photo_time_menu;
        },
        /**
         * 隐藏相册时间轴右键菜单
         */
        hide_photo_time_menu: function(){
            this.photo_time_menu && this.photo_time_menu.hide();
        },

        _create_photo_time_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            var me = this;
            switch (id) {
                case 'share':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'delete':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'download':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'jump':
                    return {
                        id: id,
                        text: '查看所在目录',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'qrcode':
                    return {
                        id: id,
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'edit',
                        split: true,
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            menu.hide_photo_time_menu();
                        }
                    };
            }
        }
    });
    return menu;
});
//tmpl file list:
//photo/src/View.tmpl.html
//photo/src/header/header.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'photo_time_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_photo_time_body" class="mod-figure-list tl-view" data-label-for-aria="图片文件列表内容区域">\r\n\
    </div>');

return __p.join("");
},

'photo_time_file_cell': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    var records = data.records;
    var item_width = 200;
    var item_height = Math.round(item_width * 0.75);

    if(records && records.length > 0 ) {
        $.each(records, function(index, record){
    __p.push('\r\n\
    <li data-list="true" data-name="img" id="photo_time_');
_p(record.id);
__p.push('" data-record-id="');
_p(record.get_id());
__p.push('" class="figure-list-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
        <div data-id="img" class="figure-list-item-pic" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
            <i class="icon icon-check-m "></i>\r\n\
        </div>\r\n\
    </li>');

        });
    }
    __p.push('');

return __p.join("");
},

'photo_time_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    var groups = data.records;
    var item_width = data.item_width;
    var item_height = Math.round(item_width * 0.75);
    var me = this;

    if(groups && groups.length > 0 ) {
        $.each(groups, function(index, group){
            if(!group.offset) {
    __p.push('                <div id="time_');
_p(group.get_day_id());
__p.push('" class="figure-box clearfix">\r\n\
                    <div class="date-wrapper">\r\n\
                        <p class="strong">');
_p(group.get_date());
__p.push('</p>\r\n\
                        <p class="txt">');
_p((group.get_year()+'.'+group.get_month()));
__p.push('</p>\r\n\
                    </div>\r\n\
                    <ul class="figure-list clearfix">');
_p( me.photo_time_file_cell({records: group.get_array()}) );
__p.push('                    </ul>\r\n\
                </div>');

            }
        });
    }
    __p.push('');

return __p.join("");
},

'video_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_video_body" class="mod-list-group" data-label-for-aria="视频文件列表内容区域">\r\n\
        <div class="list-group-bd">\r\n\
            <div id="_video_view_list">\r\n\
                <!-- 文件列表 -->\r\n\
                <ul class="list-group files">\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'video_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');


    var lib = require('lib'),
    common = require('common'),

    $ = require('$'),
    text = lib.get('./text'),
    date_time = lib.get('./date_time'),
    constants = common.get('./constants'),
    file_type_map = common.get('./file.file_type_map'),
    FileObject = common.get('./file.file_object'),

    id_perfix = data.id_perfix || 'video-item-',
    files = data.files,

    // 日期
    time_str_len = 'yyyy-MM-dd hh:mm'.length;

    var me = this;

    $.each(files, function (i, file) {
    var is_image = file.is_image(),
    create_time = (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len),
    _id = id_perfix + file.id,
    text_name = text.text(file.get_name());
    __p.push('    <li id="');
_p(_id);
__p.push('" data-file-id data-list="file" data-record-id="');
_p(file.id);
__p.push('" class="list-group-item">\r\n\
        <div class="item-tit">\r\n\
            <div class="label checkbox" data-file-check><i class="icon j-icon-checkbox icon-check-s"></i></div>\r\n\
            <div class="thumb img">\r\n\
                <span class="duration"><span class="inner">');
_p(date_time.timestamp2HMS(file.get_long_time()));
__p.push('</span></span>\r\n\
            </div>\r\n\
            <div class="info">\r\n\
                <span class="tit" data-quick-drag data-name="file_name" title="');
_p(text_name);
__p.push('">');
_p(text_name);
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="item-info">');
_p( me.file_tool());
__p.push('            <span class="item-info-list item-info-size">\r\n\
                <span class="txt txt-size">');
_p( file.get_readability_size(true) );
__p.push('</span>\r\n\
            </span>\r\n\
            <span class="item-info-list">\r\n\
                <span class="txt txt-time">');
_p( create_time );
__p.push('</span>\r\n\
            </span>\r\n\
        </div>\r\n\
    </li>');

    });
    __p.push('');

return __p.join("");
},

'audio_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_audio_body" class="mod-list-group" data-label-for-aria="音乐文件列表内容区域">\r\n\
        <div class="list-group-bd">\r\n\
            <div id="_audio_view_list">\r\n\
                <!-- 文件列表 -->\r\n\
                <ul class="list-group files">\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'audio_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');


    var lib = require('lib'),
    common = require('common'),

    $ = require('$'),
    text = lib.get('./text'),
    constants = common.get('./constants'),
    file_type_map = common.get('./file.file_type_map'),
    FileObject = common.get('./file.file_object'),

    id_perfix = data.id_perfix || 'audio-item-',
    files = data.files,

    // 日期
    time_str_len = 'yyyy-MM-dd hh:mm'.length;

    var me = this;

    $.each(files, function (i, file) {
    var is_image = file.is_image(),
    create_time = (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len),
    can_ident = file_type_map.can_identify_v2(FileObject.get_ext(file.get_name())),
    icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'nor'),
    _id = id_perfix + file.id,
    text_name = text.text(file.get_name());
    __p.push('    <!-- update jin 20130731 : new -->\r\n\
    <!-- 高级浏览器使用:hover选择器，ie6请使用鼠标悬停添加list-hover样式 -->\r\n\
    <!-- 选中样式list-selected -->\r\n\
    <!-- 拖入接收容器样式list-dropping -->\r\n\
    <!-- 不可选样式list-unselected -->\r\n\
    <!-- 不带复选框模式list-nocheckbox-->\r\n\
    <!-- 当前列表，用于右键和单行菜单模式list-menu-on-->\r\n\
    <li id="');
_p(_id);
__p.push('" data-file-id data-list="file" data-record-id="');
_p(file.id);
__p.push('" class="list-group-item">\r\n\
        <div class="item-tit">\r\n\
            <div class="label checkbox" data-file-check><i class="icon j-icon-checkbox icon-check-s"></i></div>\r\n\
            <div class="thumb"><i class="icon icon-m ');
_p(icon_class);
__p.push('-m"></i></div>\r\n\
            <div class="info">\r\n\
                <span class="tit" data-quick-drag data-name="file_name" title="');
_p(text_name);
__p.push('">');
_p(text.text(can_ident ? file.get_name_no_ext() : file.get_name()));
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="item-info">');
_p( me.file_tool());
__p.push('            <span class="item-info-list item-info-size">\r\n\
                <span class="txt txt-size">');
_p( file.get_readability_size(true) );
__p.push('</span>\r\n\
            </span>\r\n\
            <span class="item-info-list">\r\n\
                <span class="txt txt-time">');
_p( create_time );
__p.push('</span>\r\n\
            </span>\r\n\
        </div>\r\n\
    </li>');

    });
    __p.push('');

return __p.join("");
},

'file_tool': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <span class="item-info-list">\r\n\
        <span class="mod-act-list tool">\r\n\
            <a data-action="share" data-function="share" hidefocus="on" tabindex="0" class="act-list" title="分享链接" href="#"><i class="icon icon-share"></i></a>\r\n\
            <a data-action="download" data-function="download" hidefocus="on" tabindex="0" class="act-list" title="下载" href="#"><i class="icon icon-down"></i></a>\r\n\
            <!--<a data-action="move" data-function="move" hidefocus="on" tabindex="0" class="act-list" title="移动" href="#"><i class="icon icon-move"></i></a>-->\r\n\
            <a data-action="delete" data-function="delete" hidefocus="on" tabindex="0" class="act-list" title="删除" href="#"><i class="icon icon-trash"></i></a>\r\n\
            <a data-action="rename" data-function="rename" hidefocus="on" tabindex="0" class="act-list" title="重命名" href="#"><i class="icon icon-rename"></i></a>\r\n\
            <a data-action="qrcode" data-function="qrcode" hidefocus="on" tabindex="0" class="act-list" title="二维码" href="#"><i class="icon icon-code"></i></a>\r\n\
        </span>\r\n\
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
            <div class="status-inner">\r\n\
                <i class="icon"></i>\r\n\
                <h2 data-id="title" class="title"></h2>\r\n\
                <p data-id="content" class="txt"></p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="page-loading-box" style="display:none;">\r\n\
        <!-- 页面 loading -->\r\n\
        <div class="load-more">\r\n\
            <i class="icon-page-loading">正在加载</i>\r\n\
        </div>\r\n\
    </div>');

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
 $.each(files, function (i, file) { __p.push('        <i class="icon icon');
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

'photo_time_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('');

return __p.join("");
},

'photo_time_editbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!--<li class="edit-item"><i class="icon icon-share"></i><span class="text">分享</span></li>-->\r\n\
    <!--<li class="edit-item"><i class="icon icon-download"></i><span class="text">下载</span></li>-->\r\n\
    <li data-no-selection="" data-action="batch_delete" class="edit-item"><i class="icon icon-trash"></i><span class="text">删除</span></li>\r\n\
    <!--<li class="edit-item"><i class="icon icon-move"></i><span class="text">移动</span></li>-->');

return __p.join("");
},

'video_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('');

}
return __p.join("");
},

'video_editbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!--<li class="edit-item"><i class="icon icon-share"></i><span class="text">分享</span></li>-->\r\n\
    <!--<li class="edit-item"><i class="icon icon-download"></i><span class="text">下载</span></li>-->\r\n\
    <li data-no-selection="" data-action="batch_delete" class="edit-item"><i class="icon icon-trash"></i><span class="text">删除</span></li>\r\n\
    <!--<li class="edit-item"><i class="icon icon-move"></i><span class="text">移动</span></li>-->');

return __p.join("");
},

'audio_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('');

}
return __p.join("");
},

'audio_editbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!--<li class="edit-item"><i class="icon icon-share"></i><span class="text">分享</span></li>-->\r\n\
    <!--<li class="edit-item"><i class="icon icon-download"></i><span class="text">下载</span></li>-->\r\n\
    <li data-no-selection="" data-action="batch_delete" class="edit-item"><i class="icon icon-trash"></i><span class="text">删除</span></li>\r\n\
    <!--<li class="edit-item"><i class="icon icon-move"></i><span class="text">移动</span></li>-->');

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

    __p.push('    <!--<div class="view-mode">\r\n\
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
}
};
return tmpl;
});
