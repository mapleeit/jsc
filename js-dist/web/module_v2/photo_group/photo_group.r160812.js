//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/photo_group/photo_group.r160812",["lib","common","$","main"],function(require,exports,module){

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
//photo_group/src/Loader.js
//photo_group/src/Mgr.js
//photo_group/src/Module.js
//photo_group/src/Record.js
//photo_group/src/Remover.js
//photo_group/src/Store.js
//photo_group/src/Thumb_loader.js
//photo_group/src/View.js
//photo_group/src/cover/Store.js
//photo_group/src/cover/View.js
//photo_group/src/ctx_menu.js
//photo_group/src/file_path/file_path.js
//photo_group/src/file_path/ui.js
//photo_group/src/group/Store.js
//photo_group/src/group/View.js
//photo_group/src/photo_group.js
//photo_group/src/selection.js
//photo_group/src/toolbar/tbar.js
//photo_group/src/view_switch/ui.js
//photo_group/src/view_switch/view_switch.js
//photo_group/src/cover/cover.tmpl.html
//photo_group/src/file_path/file_path.tmpl.html
//photo_group/src/group/group.tmpl.html
//photo_group/src/toolbar/toolbar.tmpl.html
//photo_group/src/view.tmpl.html
//photo_group/src/view_switch/view_switch.tmpl.html

//js file list:
//photo_group/src/Loader.js
//photo_group/src/Mgr.js
//photo_group/src/Module.js
//photo_group/src/Record.js
//photo_group/src/Remover.js
//photo_group/src/Store.js
//photo_group/src/Thumb_loader.js
//photo_group/src/View.js
//photo_group/src/cover/Store.js
//photo_group/src/cover/View.js
//photo_group/src/ctx_menu.js
//photo_group/src/file_path/file_path.js
//photo_group/src/file_path/ui.js
//photo_group/src/group/Store.js
//photo_group/src/group/View.js
//photo_group/src/photo_group.js
//photo_group/src/selection.js
//photo_group/src/toolbar/tbar.js
//photo_group/src/view_switch/ui.js
//photo_group/src/view_switch/view_switch.js
define.pack("./Loader",["lib","common","./Record"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),

        Record = lib('./data.Record'),
        Photo_record = require('./Record'),
        date_time = lib.get('./date_time'),
        query_user = common.get('./query_user'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/user_library.fcg',
        DEFAULT_CMD = 'LibGetPicGroup',
        Group_record = lib.get('./data.Record'),
    //排序类型
        SORT_TYPE = {
            TIME: 0,//时间序
            NAME: 1 //名称序
        },

        undefined;

    var Processor = inherit(Object, {
        constructor : function(options){
            $.extend(this, options);
        },
        empty : function(){
            return this.records.length<=0;
        }
    });

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

            if(cfg.sort_type) {
                cfg.sort_type = SORT_TYPE[cfg.sort_type.toUpperCase()];
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
                    body: cfg
                })
                .ok(function(msg, body) {
                    var groups = [],
                        pic_group;
                    pic_group = body.groups;
                    $.each(pic_group, function(index, group){
                        groups.push(new Group_record({
                            id : group.group_id,
                            name : group.group_name,
                            create_time : group.group_ctime,
                            modify_time : group.group_mtime,
                            size : lib_v3_enable ? group.total_count: group.total,
                            cover : lib_v3_enable ? [group.file_item] : group.cover,
                            readonly : group.group_id === 1
                        }, group.group_id));
                    });

                    def.resolve(groups, groups.length);
                    me.trigger('load', groups);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    if(ret==114300){
                        me._all_load_done = true;//已加载完
                        def.resolve([], 0);
                        me.trigger('load', []);
                    }else{
                        def.reject(msg, ret);
                        me.trigger('error', msg, ret);
                    }
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

        step_process : function(processor){
            var def = $.Deferred();

            var me = this,
                success_records = [],
                failure_records = [],
                last_failure_msg;

            var next = function(){
                var todos;
                // 如果处理完了，返回结果
                if(processor.empty()){
                    if(success_records.length){
                        def.resolve(success_records, failure_records);
                    }else{
                        def.reject(last_failure_msg, failure_records);
                    }
                    return;
                }
                // 取出这次要处理的记录
                todos = processor.get_next();

                processor.process(todos).done(function(succ, fail){
                    success_records = success_records.concat(succ);
                    failure_records = failure_records.concat(fail);
                }).fail(function(msg){
                    last_failure_msg = msg;
                    failure_records = failure_records.concat(todos);
                }).always(function(){
                    def.notify(success_records, failure_records);
                    next();
                });
            };

            next();

            return def;
        },
        // 分步移动照片，不限定移动数量
        move_photo_threshold : 100,
        Move_processor : inherit(Processor, {
            get_next : function(){
                var records = this.records;
                var todos = records.slice(0, this.max);
                this.records = records.slice(todos.length);
                return todos;
            },
            process : function(records){
                return this.requestor.move_photos(records, this.old_group_id, this.group_id);
            }
        }),
        step_move_photos : function(records, old_group_id, group_id){
            return this.step_process(new this.Move_processor({
                max : this.move_photo_threshold,
                requestor : this,
                records : records,
                old_group_id : old_group_id,
                group_id : group_id
            }));
        },

        load_groups: function(cfg) {
            var def = $.Deferred(),
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    pb_v2: true,
                    body: cfg
                })
                .ok(function(msg, body) {

                    def.resolve(body);
                    //me.trigger('load', body);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                })
                .done(function() {
                    // 首次加载列表
                    if (!me._first_loaded) {
                        me._first_loaded = true;
                        me.trigger('first_load_done');
                    }
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        save_group: function(name) {
            var def = $.Deferred(),
                me = this;
            var cmd = 'LibCreatePicGroup';

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
                        group_name : name
                    }
                })
                .ok(function(msg, body) {
                    var record = [new Group_record({
                        id : body.group_id,
                        name : body.group_name,
                        create_time : new Date(),
                        modify_time : new Date(),
                        size : 0
                    }, body.group_id)];

                    def.resolve(record);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    def.reject(msg);
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        // 加载照片，如果不传group_id则加载全部
        load_photos : function(group_id, offset, size){
            var def = $.Deferred(),
                me = this;
            var cmd = 'LibPageListGet';

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
                        sort_type : 1,
                        group_id : group_id || 0,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    var photos = [];
                    var list_items = body.FileItem_items;
                    if(list_items){
                        $.each(list_items, function(index, photo){
                            photos.push(new Photo_record({
                                id : photo.file_id,
                                create_time : photo.file_ctime,
                                file_md5 : photo.file_md5,
                                modify_time : photo.file_mtime,
                                name : photo.file_name || photo.filename,
                                file_sha : photo.file_sha,
                                size : photo.file_size,
                                cur_size : photo.file_size, // 默认没有破损
                                take_time : photo.file_ttime || photo.ext_info && photo.ext_info.take_time && date_time.timestamp2date(photo.ext_info.take_time),
                                pid : photo.pdir_key,
                                ppid : photo.ppdir_key,
                                file_ver : photo.file_version,
                                ext_info : photo.ext_info
                            }, photo.file_id));
                        });
                    }
                    def.resolve(photos, body.finish_flag);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    def.reject(msg);
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        rename_group: function(group_id, old_name, new_name) {
            var me = this,
                def = $.Deferred(),
                cmd ='LibModPicGroup';

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
                    body:  {
                        group_id : group_id,
                        src_group_name : old_name,
                        dst_group_name : new_name
                    }
                })
                .ok(function(msg, body) {
                    def.resolve();
                })
                .fail(function(msg, ret) {
                    def.reject(msg);
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        // 删除分组
        delete_group : function(record){
            var me = this,
                def = $.Deferred(),
                cmd ='LibDeletePicGroup';

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
                    body:  {
                        group_id : record.get('id'),
                        group_name : record.get('name')
                    }
                })
                .ok(function(msg, body) {
                    def.resolve();
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    def.reject();
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        set_group_album : function(group_id, cover_record){
            var me = this,
                def = $.Deferred(),
                cmd ='LibSetGroupCover';

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
                        group_id: group_id,
                        file_id: cover_record.get_id(),
                        pdir_key: cover_record.get_pid()
                    }
                })
                .ok(function(msg, body) {
                    def.resolve();
                })
                .fail(function(msg, ret) {
                    def.reject();
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        // 批量删除照片 private
        delete_photos : function(records){
            var items = [];
            var me = this,
                def = $.Deferred();
            $.each(records, function(index, record){
                items.push({
                    ppdir_key : record.get_ppid(),
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    file_name : encodeURIComponent(record.get_name()),
                    file_ver: record.get_file_ver()
                });
            });
            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: 'batch_file_delete',
                    re_try:3,
                    pb_v2: true,
                    body: {
                        del_files : items
                    }
                })
                .ok(function(msg, body) {
                    def.resolve();
                })
                .fail(function(msg, ret) {
                    def.reject();
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        // 移动照片分组
        move_photos : function(records, old_group_id, group_id){
            var items = [];
            var me = this,
                def = $.Deferred();
            $.each(records, function(index, record){
                items.push({
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    filename : record.get_name()
                });
            });
            var cmd = 'LibBatchMovePicToGroup';

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
                        src_group_id : old_group_id,
                        dst_group_id : group_id,
                        items : items
                    }
                })
                .ok(function(msg, body) {
                    var success = [], fails = [];
                    var results = body.items;
                    if(results){ // 当返回了各子项的结果时，区别对待
                        $.each(results, function(index, result){
                            // 判断返回码
                            var ret = parseInt(result.result || result.op_retcode, 10);
                            if(ret === 0){
                                success.push(records[index]);
                            }else{
                                fails.push(records[index]);
                            }
                        });
                    }else{ // 当没有返回各子项结果，当作全成功
                        success = records;
                    }
                    def.resolve(success, fails);
                })
                .fail(function(msg, ret) {
                    def.reject();
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
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
 * 库分类文件列表操作逻辑处理
 * @author hibincheng
 * @date 2013-10-31
 */
define.pack("./Mgr",["lib","common","$","./cover.Store","./cover.View","./group.Store","./group.View","./Remover"],function(require, exports, module){
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
        Group_record = lib.get('./data.Record'),
        global_event = common.get('./global.global_event'),

        coverStore = require('./cover.Store'),
        coverView = require('./cover.View'),
        groupStore = require('./group.Store'),
        groupView = require('./group.View'),
        Remover = require('./Remover'),
        share_enter,
        downloader,
        file_qrcode,

        DEFAULT_PAGE_SIZE = 100,
        undefined;

    var byte_len = function(str){
        return encodeURIComponent(str).replace(/%\w\w/g, 'a').length;
    };
    var group_name_validator = {
        verify : function(name){
            if(!name){
                return '不能为空';
            }
            if(byte_len(name)>512){
                return '过长';
            }
            if(/[\\:*?\/"<>|]/.test(name)){
                return '不能含有特殊字符';
            }
            return true;
        }
    };

    var Mgr = inherit(Event, {

        step_num: 20,

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                    return false;// 不再触发recordclick
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
            event && event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        // 删除
        on_delete : function(nodes, callback){
            this.do_delete(nodes, callback);
        },

        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },

        do_delete: function(records, callback, scope) {
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                me.view.cancel_sel();
                if(callback && typeof callback === 'function') {
                    callback.call(scope, true);
                }
            });
        },
        //删除分组
        on_remove: function(records, event) {
            var record = records[0],
                me = this;
            widgets.confirm(
                '删除分组',
                '确定要删除这个分组吗？',
                record.get('name'),
                function () {
                    me.loader.delete_group(record).done(function(){
                        mini_tip.ok('删除成功');
                        me.load_groups();
                    }).fail(function(msg){
                        mini_tip.error(msg);
                    });
                },
                $.noop,
                null,
                true
            );
        },

        on_switch_group: function() {
            this.view.back_to_group();
            this.load_groups();
        },

        on_switch_whole: function() {
            this.store.clear();
            this.store.total_length++;
            this.view.show_detail();
            this.load_all_files();
        },
        // 设置封面，弹出选择框
        on_set_cover : function(groups, event){
            var group_record = groups[0];
            var old_cover = group_record.get('cover');
            old_cover = old_cover ? old_cover[0] : null;
            var cover_store = new coverStore({
                loader: this.loader,
                group_record : group_record,
                page_size : DEFAULT_PAGE_SIZE
            });

            cover_store.reload();
            var view = new coverView({
                store : cover_store,
                initial_cover : old_cover
            });
            view.on('reachbottom', cover_store.load_more, cover_store);
            view.set_cover();
        },

        //设置为封面
        on_set_as_cover : function(records, event){
            var me = this,
                group_record = me.group_store.get_cur_group(),
                group_id = group_record.get('id'),
                record = records[0];
            this.loader.set_group_album(group_id, record).done(function(){
                group_record.set('cover', [{
                    pdir_key : record.get_pid(),
                    file_id : record.get_id()
                }]);
                mini_tip.ok('设置成功');
            }).fail(function(msg){
                mini_tip.error(msg);
            });
        },

        //更改分组，弹出选择框
        on_set_group: function(records, event) {
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
            var group_store = new groupStore({
                loader: this.loader,
                old_group: this.group_store.get_cur_group(),
                groups: this.group_store.get_groups(),
                photo_records : records
            });

            var view = new groupView({
                initial_record: this.group_store.get_cur_group(),
                store : group_store
            });
            this._dialog = view.move_photos_dialog();
        },

        //更改分组
        on_move_photos: function(data) {
            var me = this;
            var photos = data.photos,
                old_group_id = data.old_group_id,
                new_group_id = data.new_group_id;
            me.do_move_photos(photos, old_group_id, new_group_id).done(function(){
                me._dialog && me._dialog.hide();
                me.view.cancel_sel();
            });
        },

        do_move_photos: function(photos, old_group_id, new_group_id) {
            var me = this,
                show_progress = photos.length > 100;
            if(show_progress){
                progress.show("正在移动0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return this.loader.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show("正在移动" + success_photos.length+"/"+photos.length);
                }
            }).done(function(success_photos, failure_photos){
                me.store.batch_remove(success_photos);
                //me.view.cancel_sel();
                if(failure_photos.length){
                    mini_tip.warn('部分图片更改分组失败');
                }else{
                    mini_tip.ok('更改分组成功');
                }
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                if(show_progress){
                    progress.hide();
                }else{
                    widgets.loading.hide();
                }
            });
        },

        // 直接点击记录
        on_open : function(records, e){
            var record = records[0];
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

        on_rename: function(records, e) {
            if(this.rename_task){
                return;
            }
            this.rename_task = true;

            var me = this,
                store = me.group_store,
                record = records[0],
                old_value = record.get('name'),
                def = $.Deferred(),
                view = this.view;
            var editor = view.start_edit(record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    me.loader.rename_group(record.get('id'), old_value, value).done(function(){
                        mini_tip.ok('修改成功');
                        def.resolve(value);
                    }).fail(function(msg){
                        mini_tip.error(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(value){
                record.set('name', value);
                store.update_group(record);
                view.update_group(record);
            }).always(function(){
                editor.destroy();
                me.rename_task = false;
            });
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
        //on_create_group
        on_create_group: function() {
            if(this.loading){
                return;
            }
            this.loading = true;

            var me = this,
                def = $.Deferred(),
                view = me.view,
                store = me.group_store,
            // 占位分组，仅用于新建
                old_value = '',
                dummy_record = new Group_record({
                    name : old_value,
                    dummy : true
                });
            //store.add_group(dummy_record);
            var editor = view.start_edit(dummy_record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    me.loader.save_group(value).done(function(record){
                        mini_tip.ok('创建成功');
                        def.resolve(record);
                    }).fail(function(msg){
                        mini_tip.error(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(records){
                store.add_group(records);
                view.add_group(records);
            }).fail(function(){

            }).always(function(){
                store.remove();
                editor.destroy();
                me.loading = null;
            });

            return def;
        },

        on_enter_group: function(group) {
            var me = this;
            this.loader.load_photos( group[0].get('id'), 0, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                global_event.trigger('switch_mode', group[0]);
                me.view.show_detail();
                me.group_store.set_cur_group(group[0]);
                me.store.load(records, is_finish ? null : Number.MAX_VALUE);
            }).fail(function(msg){
                mini_tip.error(msg);
            });
        },

        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_share: function(records, e) {
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records);
                });
            } else {
                share_enter.start_share(records);
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e) {
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(records, e);
                });
            } else {
                downloader.down(records, e);
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
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_jump: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(records.length == 1) {
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
         * 图片全部模式下，加载数据
         * @param is_refresh 是否是刷新列表
         */
        load_all_files: function(is_refresh) {
            if(this.store.is_complete()) {
                if(this.store.size() === 0) {
                    this.view._init_view_empty();
                }
                return ;
            }
            var me = this,
                offset = this.store.size();

            this.loader.load_photos(null, offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
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
         * 分批加载数据,用于图片预览，加载更多
         * @param is_refresh 是否是刷新列表
         */
        load_files: function() {
            var me = this,
                def = $.Deferred(),
                offset = this.store.size(),
                cur_group =  this.group_store.get_cur_group(),
                record_id = cur_group? cur_group.get('id') : null;

            this.loader.load_photos(record_id, offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                if(offset === 0) {//开始下标从0开始表示重新加载
                    me.store.load(records, is_finish ? null : Number.MAX_VALUE);
                } else {
                    me.store.add(records);
                }
                def.resolve();
            }).fail(function(msg){
                def.reject();
            });
            return def;
        },

        /**
         * 图片分组模式下，加载数据
         */
        load_groups: function() {
            var me = this,
                store = me.group_store,
                view = me.view,
                loader = me.loader;
            loader.load_groups().done(function(rs) {
                store.init_group(rs);
                view.group_render();
            });
        }
    });
    return Mgr;
});
/**
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
        activate : function(){
            this.get_list_view().show();
            this.on_activate();
        },
        deactivate : function(){
            this.loader && this.loader.abort();
            this.get_list_view().hide();
            //this.get_list_header().hide();
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
 * 将file_object与Record结合起来，以便复用接口。
 * @author cluezhang
 * @date 2013-8-14
 */
define.pack("./Record",["$","lib","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        
        common = require('common'),
        File = common.get('./file.file_object');
    var Photo_file = inherit(File, {
        constructor : function(cfg){
            this.ppid = cfg.ppid;
            this.take_time = cfg.take_time;
            Photo_file.superclass.constructor.apply(this, arguments);
        },
        get_ppid : function(){
            return this.ppid;
        },
        // 获取拍摄时间
        get_take_time : function(){
            return this.in_album;
        }
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
            return is_setter ? function(){
                    var ret = fn.apply(this.data, arguments);
                    this.notify_update(null);
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
 * 图片分组数据
 * @author xixinhuang
 * @date 16-08-10
 */
define.pack("./Store",["lib","common"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Group_record = lib.get('./data.Record');

    var group_map = {};

    var Store = {

        init_data: function (data) {
            var groups = [],
                group,
                pic_group;
            pic_group = data.groups;
            $.each(pic_group, function(index, item){
                group = new Group_record({
                    id : item.group_id,
                    name : item.group_name,
                    create_time : item.group_ctime,
                    modify_time : item.group_mtime,
                    size : item.total_count,
                    cover : [item.file_item],
                    readonly : item.group_id === 1
                }, item.group_id);
                groups.push(group);
                group_map[item.group_id] = group;
            });
            this.data = groups;
        },
        init_group: function (data) {
            this.init_data(data);
        },
        add_group: function(groups) {
            var me = this;
            $.each(groups, function(index, group){
                if(group.id) {
                    me.data.push(group);
                    group_map[group.id] = group;
                }
            });
        },
        get_groups: function() {
            return this.data;
        },
        get_group: function(id) {
            return group_map[id];
        },
        update_group: function(group) {
            group_map[group.get('id')].set('name', group.get('name'));
            $.each(this.get_groups(), function(index, item){
                if(item.get('id') === group.get('id')) {
                    item.set('name', group.get('name'));
                }
            });
        },
        remove: function(record) {
            if(record) {
                if(group_map[record.group_id]) {
                    delete group_map[record.group_id];
                }
                this.remove_group(record);
            }
        },
        destroy: function () {
            this.data = null;
        },
        remove_group : function(record, index){
            var index = index || $.inArray(record, this.data);
            if(index>=0){
                this.data.splice(index, 1);
            }
        },
        set_cur_group : function(group){
            this.cur_group = group;
        },
        get_cur_group : function(){
            return this.cur_group;
        }
    };

    return Store;
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
define.pack("./View",["lib","common","$","./file_path.file_path","./tmpl","./Loader","main","./view_switch.view_switch","./Thumb_loader","./Store","./toolbar.tbar","./ctx_menu"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        image_loader = lib.get('./image_loader'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        file_path = require('./file_path.file_path'),
        tmpl = require('./tmpl'),
        ThumbHelper = common.get('./ui.thumb_helper'),
        Editor = common.get('./ui.Editor'),
        Loader = require('./Loader'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        view_switch = require('./view_switch.view_switch'),
        Thumb_loader = require('./Thumb_loader'),
        store = require('./Store'),
        tbar = require('./toolbar.tbar'),
        ctx_menu = require('./ctx_menu'),
        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        thumb_loader = new Thumb_loader({
            width : 256,
            height : 256
        }),
        thumb_helper,

        undefined;
    var loader = new Loader();

    var File_view = inherit(View, {

        module_name: 'photo',
        list_selector : 'ul.figure-list',
        item_selector : 'li[data-list]',
        action_property_name : 'data-action',

        //enable_box_select : false,
        enable_select : true,

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : '',
        scroller : main_ui.get_scroller(),
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;

            var selection = this.selection = new Box_selection_plugin();
            selection.init(this);
        },

        list_tpl : function(){
            return tmpl['group_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_items']([file]);
        },

        get_html : function(records){
            return tmpl[this.module_name+'_items']({
                records : records,
                item_width: this.get_item_width(),
                module_name : this.module_name
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
            // 多选时不要hover
            var me = this;

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e);
                return false;
            }, this);

            this.listenTo(view_switch, 'switch.view', function(mode, e) {
                file_path.update();
                me.trigger('action', 'switch_' + mode, null, e);
            });

            thumb_helper = new ThumbHelper({
                container: '#_group_body',
                height_selector: '.figure-list-item-pic',
                item_selector: 'li[data-record-id]'
            });


            this.selection.on('selectionchanged', function(records){
                me.is_multi_selection = records.length > 1;
                me.is_need_edit = records.length > 0;
                me.show_edit(records);
            });
        },

        render_path: function() {
            file_path.render(main_ui.get_$bar2());
            main_ui.get_$bar2().show();

            var me = this,
                $path = $('#_photo_file_path');
            $path.on('click', '[data-more]', function(e) {
                e.stopPropagation();
                var $target = $(e.target).closest('li');
                if(!$target.hasClass('cur')) {
                    me.back_to_group();
                    me.trigger('action', 'switch_group');
                    file_path.update();
                }
            });
        },

        render_editbar: function() {

            tbar.render(main_ui.get_$bar1());
            var me = this;

            // 编辑态工具栏事件
            this.listenTo(tbar, {
                // 打包下载
                pack_down: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'download', files, e);
                },
                // 分享入口
                share: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'share', files, e);
                },
                // 删除
                del: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'delete', files, e);
                },
                // 更改分组
                set_group: function (e) {
                    var files = this.selection.get_selected();
                    me.trigger('action', 'set_group', files, e);
                }
            });
        },

        cancel_sel: function() {
            this.selection.clear();
            main_ui.toggle_edit(false);
        },

        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
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
                this.get_$photo_list().hide();

            } else {
                this.get_$view_ct().removeClass('ui-view-empty');
                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$photo_list().show();
            }
        },

        /**
         * 初始化列表为空时的提示页面
         * @private
         */
        _init_view_empty: function() {
            if(this.$view_empty) {
                this.$view_empty.show();
            } else {
                this.$view_empty = $(tmpl.view_empty()).appendTo(this.get_$view_ct());
            }

            this.$view_empty.find('.title').text(view_switch.is_whole_view()? '暂无图片' : '该分组暂无图片');
        },

        _handle_action : function(action, record, e){
            switch(action){
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        is_editing : function(){
            var records = store.get_groups(), i, record;
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.get('editing')){
                    return true;
                }
            }
            return false;
        },

        show_edit: function(records) {
            records = records || this.get_selected();
            if(!records || records.length === 0) {
                main_ui.toggle_edit(false);
            } else {
                main_ui.toggle_edit(true, records.length);
            }
        },

        //用于判断此时是分组中还是全部中
        is_group_view: function() {
            return this.module_name === 'group';
        },

        show_detail: function() {
            this.module_name = 'photo';
            this.dom_record_map_attr = '';
            this.get_$photo_list().show();
            this.get_$group_list().hide();
        },

        back_to_group: function() {
            if(view_switch.is_group_view()) {
                this.module_name = 'group';
                this.dom_record_map_attr = 'data-record-id';
                this.get_$photo_list().empty().hide();
                this.get_$group_list().show();
            }
            if(this.$view_empty) {
                this.$view_empty.remove();
                this.$view_empty = null;
            }
        },

        group_render: function() {
            var me = this,
                groups = store.get_groups();

            this.module_name = 'group';
            $(tmpl.group_items({records: groups, item_width: this.get_item_width()})).appendTo(this.get_$group_list().empty());
            this.update_thumb();

            // 绑定右键
            this.get_$group_list().on('contextmenu',  function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    group = store.get_group($target.attr('data-record-id'));
                if(group) {
                    me.show_group_ctx_menu(group, e);
                }
            });

            this.get_$group_list().on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action'),
                    group = store.get_group($target.attr('data-record-id'));
                if(!me.is_editing()) {
                    me.trigger('action', action_name, group, e);
                }
            });
        },

        show_group_ctx_menu : function(record, e){
            e.preventDefault();
            var menu = ctx_menu.get_group_context_menu(record, e), me = this;
            this.context_record = record;

            record.set('menu_active', true);
            menu.once('hide', function(){
                me.context_record = null;
                record.set('menu_active', false);
                me.stopListening(ctx_menu, 'action');
            });
            this.listenTo(ctx_menu, 'action', function(config_id) {
               me.trigger('action', config_id, me.context_record, e);
            });
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

            var records,
                me = this;

            if(record.get('selected')){
                records = this.selection.get_selected();
            }else{
                //清除之前的选择状态
               this.cancel_sel();
                record.set('selected', true);
                records = [record];
            }
            this.show_edit(records);

            var menu = view_switch.is_whole_view()? ctx_menu.get_photo_context_menu(records, e) : ctx_menu.get_detail_context_menu(records, e);

            this.context_records = records;
            me.is_menu_on = true;
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.context_records = null;
                me.is_menu_on = false;
                me.stopListening(ctx_menu, 'action');
            });
            this.listenTo(ctx_menu, 'action', function(config_id) {
                me.trigger('action', config_id, me.context_records, e);
            });
        },

        /**
         * 开始重命名
         * @param {File_record} record 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(record, rename_callback) {
            var file_name = record.get_name();
            var $file_name = this.add_group().find('[data-name=file_name]');
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

        remove: function(group) {
            var $group = $('#group_items_' + group.id);
            $group && $group.remove();
        },

        /**
         * 开始编辑某个分组，返回一个editor对象，有save及cancel事件，表示用户触发保存、取消；完成编辑则调用destroy方法
         * @param {Record} record
         * @return {Editor} editor
         */
        start_edit : function(record){
            var $dom,
                $input;

            //区分重命名和新建分组
            if(record.get('dummy')) {
                $dom = $(tmpl.add_photo_group({item_width: this.get_item_width()}));
                if(this.get_$group_list().children().length) {
                    $(this.get_$group_list().children()[0]).after($dom);
                } else {
                    $dom.appendTo(this.get_$group_list());
                }
            } else {
                var $group = $('#group_items_' + record.get('id'));
                $dom = $('<div class="pic-group-item-edit"><input type="text" value="' + record.get('name') + '"></div>');
                $dom.appendTo($group);
                $group.find('.pic-group-item-txt').hide();
            }

            // 初始值设置
            var old_value = record.get('name');
            // 状态切换
            record.set('editing', true);
            // 防止record click触发
            $input = $dom.find('input');
            $input.val(old_value);
            // $input.on('click', this._prevent_record_click);

            // 开始编辑
            var editor = new Editor({
                initial_value : old_value,
                $input : $input
            });
            var me = this;
            this.on('destroy', editor.destroy, editor);
            // 编辑结束后回滚事件
            editor.on('destroy', function(){
                record.set('editing', false);
                if(record.get('dummy')) {
                    me.get_$group_list().find('#add_group').remove();
                } else {
                    $group.find('.pic-group-item-edit').remove();
                    $group.find('.pic-group-item-txt').show();
                }
                // $input.off('click', this._prevent_record_click);
                me.off('destroy', editor.destroy, editor);
            });

            // 定位
            $dom[0].scrollIntoView();

            return editor;
        },

        add_group: function(groups) {
            this.get_$group_list().find('#add_group').remove();
            var $new_group = $(tmpl.new_group({records: groups, item_width: this.get_item_width()}));
            if(this.get_$group_list().children().length) {
                $(this.get_$group_list().children()[0]).after($new_group);
            } else {
                $new_group.appendTo(this.get_$group_list());
            }
            this.update_thumb();
        },

        update_group: function(group) {
            var $group = $('#group_items_' + group.get('id'));
            $group.find('.pic-group-item-edit').remove();
            $group.find('.pic-group-item-txt .txt').text(group.get('name'));
            $group.find('.pic-group-item-txt').show();
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
            this.update_thumb();
        },

        //防止thumb_helper取到的是旧的group，这里重新设置$container
        update_item_width: function() {
            var body_width = this.get_$photo_list().width();
            thumb_helper.set_$container(this.get_$photo_list());
            thumb_helper.update_item_width(body_width);
        },

        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('[data-id=img]').empty().append($img);
        },
        /**
         * 更新所有缩略图
         */
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.get_$list().children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    if(me.module_name === 'group') {
                        record = store.get_group($item.attr('data-record-id'));
                        me._fetch_group_cover(record, $item);
                    } else if(me.module_name === 'photo') {
                        record = me.get_record($item);
                        me._fetch_photo_thumb(record, $item);
                    }
                }
            });
        },

        _fetch_group_cover: function(record, $item) {
            var coverUrl,
                cover,
                me = this,
                covers = record.get('cover');
            if(!covers || !covers.length){
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
                return;
            }
            cover = covers[0];
            if(!cover.file_id) {
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
                //没有file_id说明封面不存在，这里显示默认图
                return
            }
            if(cover.ext_info) {
                coverUrl = constants.IS_HTTPS ? cover.ext_info.https_url : cover.ext_info.thumb_url;
            }
            thumb_loader.get(cover.pdir_key, cover.file_id, '', coverUrl).done(function(url, img){
                var $img = $(img);
                if(!$img.data('used')){
                    $img.data('used', true);
//                            $img_holder.replaceWith($img);
                }else{
                    $img = $('<img />').attr('src', url);
//                            $img_holder.attr('src', url);
                }
                me.update_record_dom_thumb(record, $item, $img);
            }).fail(function() {
                me.update_record_dom_thumb(record, $item, $('<i class="icon icon-l icon-pic-l"></i>'));
            });
        },

        _fetch_photo_thumb: function(record, $item) {
            var me = this;
            thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                var $img = $(img), $replace_img;
                //if(!$img.data('used')){
                //    $img.data('used', true);
                //    $replace_img = $img;
                //}else{
                    $replace_img = $('<img src="' + url +'"/><i class="icon icon-check-m j-icon-checkbox"></i>');
                //}
                $replace_img.attr('unselectable', 'on');
                me.update_record_dom_thumb(record, $item, $replace_img);
            });
        },

        get_$view_empty: function() {
            return this.$view_empty;
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#main_bar1'));
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_group_body'));
        },

        get_$group_list: function() {
            return this.$view_list || (this.$view_list = $('#group_view_list'));
        },

        get_$photo_list: function() {
            return this.$photo_list || (this.$photo_list = $('#photo_view_list'));
        },

        get_$list: function() {
            if(this.module_name === 'group') {
                return this.get_$group_list();
            } else if(this.module_name === 'photo') {
                return this.get_$photo_list();
            }
        },

        get_item_width: function() {
            if(!thumb_helper) {
                return null;
            }
            var body_width = this.get_$photo_list().width();

            // 如果有滚动条，那么加上滚动条宽度，否则计算出来的和初始的不一致了
            if( main_ui.get_$main_content().scrollTop() > 0 ){
                body_width += this.scroller.get_scrollbar_width();
            }

            return thumb_helper.get_item_width(body_width);
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
 * 图片封面模块
 * @author xixinhuang
 * @date 2016-08-31
 */
define.pack("./cover.Store",["$","lib","common","./Loader"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),

        common = require('common'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        Loader = require('./Loader');

    var coverStore = inherit(Store, {
        page_size : 100,
        group_id : 0,
        constructor : function(){
            coverStore.superclass.constructor.apply(this, arguments);
            this.set_group(this.group_record);
        },
        set_group : function(group_record){
            this.group_record = group_record;
            this.group_id = group_record ? group_record.get('id') : 0;
            if(this.loaded){
                this.loaded = false;
                this.clear();
                this.reload();
            }
            this.trigger('groupchanged', group_record);
        },
        get_group : function(){
            return this.group_record;
        },
        reload : function(initial_size){
            var me = this;
            if(me.loading){
                return me.loading;
            }
            widgets.loading.show();
            // 首屏加载2.5倍屏幕
            me.loading = this.loader.load_photos(this.group_id, 0, initial_size || Math.round(this.page_size*2.5)).done(function(records, end){
                me.load(records, end ? null : Number.MAX_VALUE);
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        },

        set_group_cover: function(record) {
            var def = $.Deferred();
            this.loader.set_group_album(this.group_id, record).done(function(){
                def.resolve();
            }).fail(function(msg){
                def.reject(msg);
            });
            return def;
        },

        load_more : function(){
            if(this.loading || this.is_complete()){
                return this.loading;
            }
            var me = this;
            widgets.loading.show();
            me.loading = this.loader.load_photos(this.group_id, this.size(), this.page_size).done(function(records, end){
                me.add(records);
                if(end){
                    me.total_length = me.size();
                    me.trigger('metachanged');
                }
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        }
    });
    return coverStore;
});/**
 * 分组 -> 设置封面视图
 * @author cluezhang
 * @date 2013-11-15
 */
define.pack("./cover.View",["$","lib","common","./tmpl"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        Scroller = common.get('./ui.scroller'),
        ds_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        View = lib.get('./data.View'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        tmpl = require('./tmpl');

    var coverView = inherit(View, {
        enable_box_select : false,
        enable_context_menu : false,
        enable_select : true,
        list_selector : 'ul',
        item_selector : 'li[data-record-id]',
        dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        item_checked_class : 'checked',
        enable_empty_ui: true,
        initial_cover : null,
        shortcuts : {
            checked : function(checked, view){
                $(this).find('.link').toggleClass(view.item_checked_class, checked);
            }
        },
        list_tpl : function(){
            return tmpl.cover_list();
        },
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.cover_items({
                records : records,
                group: me.store.get_group()
            });
        },

        /**
         * @cfg {Object} old_cover 当前设置的封面
         */
        constructor : function(){
            coverView.superclass.constructor.apply(this, arguments);
            // 当找到初始封面时，设定为已选中
            if(this.initial_cover){
                this.listenTo(this.store, 'datachanged add', this.mark_initial_cover, this);
                this.mark_initial_cover(); // 如果store已经加载过，执行一次
            }
        },
        // 初始时标记选中状态
        mark_initial_cover : function(){
            var me = this,
                initial_cover = me.initial_cover;
            me.store.each(function(record){
                if(record.get_pid() === initial_cover.pdir_key && record.get_id() === initial_cover.file_id){
                    // 找到了
                    me.set_checked(record);
                    return false;
                }
            });
        },
        after_render : function(){
            coverView.superclass.after_render.apply(this, arguments);
            // 点击选择
            this.on('recordclick', this.handle_click, this);
            // 滚动加载更多
            var scroller = this.scroller = new Scroller(this.$list);
            scroller.on('scroll', this.if_reachbottom, this);
        },
        if_reachbottom : function(){
            if(this.scroller.is_reach_bottom()){
                this.trigger('reachbottom');
            }
        },
        list_height : 60,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.cover_empty()).insertAfter(this.$list);
            this.$list.hide();
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            this.set_checked(record);
        },
        set_checked : function(record){
            if(!record) {
                return;
            }
            if(this.initial_cover){
                this.initial_cover = null;
                this.store.off('add datachanged', this.mark_initial_cover, this);
            }
            var old_record = this.checked_record;
            if(old_record && old_record !== record){
                old_record.set('checked', false);
            }
            this.checked_record = record;
            record.set('checked', true);
        },
        get_checked : function(){
            return this.checked_record;
        },
        // 如何更新缩略图
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },

        set_cover: function() {
            var me = this,
                $fragment_ct = $('<div></div>');
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };

            this.render($fragment_ct);
            var dialog=  new widgets.Dialog({
                klass : 'full-pop-medium',
                title: '更改封面',
                destroy_on_hide: true,
                content: $fragment_ct,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : '选定',
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : '取消',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : true
                    }
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        var check_record = me.get_checked();
                        if(!check_record){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                            return;
                        }
                        me.store.set_group_cover(check_record).done(function() {
                            //trigger 出来，更新分组
                            ds_event.trigger('update', check_record, {
                                src : me.store,
                                changes : {
                                    cover : 1
                                }
                            });
                            dialog.hide();
                            mini_tip.ok('设置成功');
                        }).fail(function(msg) {
                            mini_tip.ok(msg || '服务器繁忙，请稍后重试！');
                        });
                    }
                }
            });
            dialog.once('render', function(){
                // 初始化消息提示
                $msg_ct = dialog.$el.find('.edit-cover-msg');
            });
            dialog.once('destroy', function(){
                dialog.hide();
            });
            dialog.show();
        },

        on_destroy : function(){
            coverView.superclass.on_destroy.apply(this, arguments);
            if(this.scroller){
                this.scroller.destroy();
            }
        }
    });
    return coverView;
});/**
 * 右键菜单UI逻辑
 * @author trump
 * @date 13-11-09
 */
define.pack("./ctx_menu",["lib","common"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),

        //多选状态下应该剔除的右键菜单项
        item_maps = {
            //分组
            group: {
                rename: 1,
                remove: 1,
                set_cover: 1
            },
            detail: {
                download: 1,
                'delete': 1,
                set_group: 1,
                set_as_cover: 1,
                share: 1,
                qrcode: 1,
                jump: 1
            },
            photo: {
                download: 1,
                'delete': 1,
                share: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;

    var menu = new Module('photo_ctx_menu', {

        render: function () {
            var me = this;
            me.photo_time_menu = me._create_photo_time_menu();
        },

        get_photo_context_menu: function(records, e) {
            var visible_items = $.extend({}, item_maps.photo);
            if(records.length>1) {
                visible_items = {
                    'delete' : 1
                }
            }

            this.context_records = records;
            this.photo_ctx_menu = this.photo_ctx_menu || this.create_photo_menu();
            this.photo_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.photo_ctx_menu;
        },

        create_photo_menu: function() {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ]
            });

            return menu;
        },

        get_group_context_menu: function(record, e) {
            var visible_items = $.extend({}, item_maps.group);
            if(record.get('readonly')){
                visible_items = {
                    set_cover : 1
                };
            }
            this.context_record = record;

            this.group_ctx_menu = this.group_ctx_menu || this.create_group_menu();
            this.group_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.group_ctx_menu;
        },

        create_group_menu: function() {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('rename'),
                    me.create_item('remove'),
                    me.create_item('set_cover')
                ]
            });

            return menu;
        },

        get_detail_context_menu: function(records, e) {
            var visible_items = $.extend({}, item_maps.detail);
            if(records.length>1) {
                visible_items = {
                    set_group: 1,
                    'delete' : 1
                }
            }

            this.context_records = records;

            this.detail_ctx_menu = this.detail_ctx_menu || this.create_detail_menu();
            this.detail_ctx_menu.show(e.pageX, e.pageY, visible_items);

            return this.detail_ctx_menu;
        },

        create_detail_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('download'),
                    me.create_item('delete'),
                    me.create_item('set_as_cover'),
                    me.create_item('set_group'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share')
                ]
            });

            return menu;
        },

        hide_menu: function() {
            this.group_ctx_menu && this.group_ctx_menu.hide();
            this.detail_ctx_menu && this.detail_ctx_menu.hide();
            this.photo_ctx_menu && this.photo_ctx_menu.hide();
        },

        create_item: function (id) {
            var me = this;
            switch (id) {
                case 'rename':
                    return {
                        id: id,
                        text: '重命名',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'remove':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'set_cover':
                    return {
                        id: id,
                        text: '更改封面',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'share':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
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
                            me.hide_menu();
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
                            me.hide_menu();
                        }
                    };
                case 'set_as_cover':
                    return {
                        id: id,
                        text: '设置为封面',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
                        }
                    };
                case 'set_group':
                    return {
                        id: id,
                        text: '更改分组',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            me.trigger('action', this.config.id);
                            me.hide_menu();
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
                            me.hide_menu();
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
                            me.hide_menu();
                        }
                    };
            }
        }
    });
    return menu;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_path.file_path",["lib","common","$","./file_path.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event').namespace('photogroup'),

        cur_node,
        last_enable,
        undefined;

    var file_path = new Module('photo_file_path', {

        ui: require('./file_path.ui'),

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 最后一级目录
         * @param {Boolean} enable 默认true
         */
        update: function (last_lv_node, enable) {
            enable = enable !== false;

            if (last_lv_node === cur_node && enable === last_enable) {
                return;
            }

            if (last_lv_node) {

                var nodes = [],
                    node = last_lv_node;
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                this.ui.update_$nodes(last_lv_node, nodes, enable);
            } else {
                this.ui.back();
                cur_node = null;
            }
        },

        toggle: function (visible) {
            this.ui.toggle(visible);
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
            this.ui.activate();
            this.ui.__rendered = false;
        },

        on_deactivate: function() {
            this.ui.remove_$path();
            this.ui.deactivate();
            this.deactivate();
            this.stopListening(global_event, 'window_resize');
        }
    });

    return file_path;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_path.ui",["lib","common","$","main","./tmpl","./file_path.file_path"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        main = require('main').get('./main'),
        tmpl = require('./tmpl'),

        file_path,

        cur_node,
        visible,

        init_updated = false,

        undefined;

    var ui = new Module('photo_file_path_ui', {

        path_selector: '_photo_file_path',

        render: function ($to) {
            file_path = require('./file_path.file_path');
            // 事件
            var $el = $('#' + this.path_selector);
            if (!$el[0]) {
                $el = $(tmpl.file_path()).appendTo($to);
            }
            this._$el = $el;
            this._$inner = $el.find('[data-inner]');

            // 全选
            var me = this;
            // 点击路径跳转
            $el.on('click', function (e) {
                e.preventDefault();
            });
            $el.on('click', '[data-more]', function(e) {
                e.stopPropagation();
            });
            $el.on('click', '[data-file-id]', function (e) {
                var $target = $(this),
                    dir_id = $target.attr('data-file-id');

                file_path.trigger('click_path', dir_id);
            });
            $el.show();
        },

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (last_lv_node, enable) {
            var me = this,
                $inner = me._$inner;
            var $paths = me.measure_path(last_lv_node, enable);
            $inner.empty().append($paths);
            // me._$inner = $paths;

            cur_node = last_lv_node;
            if (scr_reader_mode.is_enable()) {
                // 自动聚焦到路径上（首次打开目录不聚焦）
                if (init_updated) {
                    setTimeout(function () {
                        $inner.find('a[data-cur]').focus();
                    }, 50);
                }
                init_updated = true;
            }
        },

        /**
         * 测量路径，当路径过深时，前面部分收起做为下拉菜单展示
         * @param last_lv_node
         * @param nodes
         * @param enable
         * @returns {*|jQuery|HTMLElement}
         */
        measure_path: function(last_lv_node, enable) {
            return $(tmpl['file_path_items']({ target_node: last_lv_node, enable: !!enable }));
        },

        back: function() {
            if(this._$el && this._$el.find('.item') && this._$el.find('.item').length > 1) {
                this._$el.find('.cur').remove();
                this._$el.find('.item').addClass('cur');
            }
        },

        toggle: function (visible) {
            if(visible) {
                this._$el.show();
            } else {
                this._$el.hide();
            }
        },

        _release_dom: function () {
            var me = this;
            if (me._$inner) {
                me._$inner.empty();
            }
        },

        remove_$path: function() {
            this.__rendered = false;
            this._$el && this._$el.remove();
        },

        toggle_$path: function(visible) {
            this._$inner && this._$inner[visible ? 'show': 'hide']();
        },

        get_$path_warp: function() {
            return this._$el.children(':first');
        }

    });

    return ui;

});/**
 * 图片更改分组模块
 * @author xixinhuang
 * @date 2016-08-31
 */
define.pack("./group.Store",["$","lib","common","./Loader"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        Group_record = lib.get('./data.Record'),

        common = require('common'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        Loader = require('./Loader');

    var coverStore = inherit(Store, {
        old_group: null,
        new_group: null,
        photo_records : [],
        constructor : function(){
            coverStore.superclass.constructor.apply(this, arguments);
        },
        load_groups: function() {
            //if(this.groups) {
            //    this.load(this.groups, null);
            //} else {
                this.reload();
            //}
        },
        set_group: function(group) {
            this.new_group = group;
        },
        get_data: function() {
            return {
                photos: this.get_records(),
                old_group_id: this.old_group? this.old_group.get('id') : '',
                new_group_id: this.new_group? this.new_group.get('id') : ''
            }
        },
        get_records : function(){
            return this.photo_records;
        },
        init_data: function (data) {
            var groups = [],
                group;
            $.each(data.groups, function(index, item){
                group = new Group_record({
                    id : item.group_id,
                    name : item.group_name,
                    create_time : item.group_ctime,
                    modify_time : item.group_mtime,
                    size : item.total_count,
                    cover : [item.file_item],
                    readonly : item.group_id === 1
                }, item.group_id);
                groups.push(group);
            });
            return groups;
        },
        reload : function(){
            var me = this;
            if(me.loading){
                return me.loading;
            }
            widgets.loading.show();
            // 首屏加载2.5倍屏幕
            me.loading = this.loader.load_groups().done(function(data){
                me.load(me.init_data(data));
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        }
    });
    return coverStore;
});/**
 * 分组 -> 详情 -> 更改分组
 * @author xixinhuang
 * @date 2016-09-08
 */
define.pack("./group.View",["$","lib","common","./tmpl"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        View = lib.get('./data.View'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        tmpl = require('./tmpl');

    var groupView = inherit(View, {
        enable_box_select : false,
        enable_context_menu : false,
        enable_select : true,
        list_selector : 'ul',
        item_selector : 'li[data-record-id]',
        //dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        item_checked_class : 'checked',
        initial_record: null,
        //enable_empty_ui: true,
        //initial_cover : null,
        shortcuts : {
            checked : function(checked, view){
                $(this).find('.link').toggleClass(view.item_checked_class, checked);
            }
        },
        list_tpl : function(){
            return tmpl.dialog_group_list();
        },
        tpl : function(groups){
            return this.get_html([groups]);
        },
        get_html : function(groups){
            var me = this;
            return tmpl.dialog_group_items({
                records : me.store.get_records(),
                groups: groups
            });
        },
        constructor : function(){
            groupView.superclass.constructor.apply(this, arguments);
            // 当找到初始封面时，设定为已选中
            // 当store刷新后，重新设定选中项
            this.listenTo(this.store, 'datachanged', this.mark_initial_selected, this);
            this.mark_initial_selected(); // 如果store已经加载过，执行一次
        },
        // 初始化选中
        mark_initial_selected : function(){
            var me = this,
                initial_record = this.get_selected();
            if(!initial_record){
                return;
            }
            me.store.each(function(record){
                if(record.get('id') === initial_record.get('id')){
                    // 找到了
                    me.set_selected(record);
                    return false;
                }
            });
        },
        after_render : function(){
            groupView.superclass.after_render.apply(this, arguments);
            // 点击选择
            this.on('recordclick', this.handle_click, this);
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            if(record.get('dummy')){
                return; // 正在新建的记录不能选
            }
            this.set_selected(record);
        },
        set_selected : function(record){
            var old_record = this.selected_record;
            if(old_record){
                old_record.set('checked', false);
            }
            this.selected_record = record;
            this.store.set_group(record);
            record.set('checked', true);
        },
        get_selected : function(){
            return this.selected_record || this.initial_record;
        },
        // 如何更新缩略图
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },

        move_photos_dialog: function() {
            var me = this,
                $fragment_ct = $('<div></div>');
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };

            this.render($fragment_ct);
            //等view进行render完毕后再load数据
            this.store.load_groups();
            var dialog=  new widgets.Dialog({
                klass : 'full-pop-medium',
                title: '更改分组',
                destroy_on_hide: true,
                content: $fragment_ct,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : '选定',
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : '取消',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : true
                    }
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        var _data = me.store.get_data();
                        if(!_data.old_group_id || !_data.new_group_id){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                        } else if(_data.old_group_id === _data.new_group_id){
                            mini_tip.error('请选择不同的分组');
                        } else {
                            ds_event.trigger('move', _data, {
                                src : me.store,
                                move_photos: true
                            });
                        }
                    }
                }
            });
            dialog.once('render', function(){
                // 初始化消息提示
                $msg_ct = dialog.$el.find('.edit-cover-msg');
            });
            dialog.once('destroy', function(){
                dialog.hide();
            });
            dialog.show();
            return dialog;
        },

        on_destroy : function(){
            var record = this.selected_record;
            if(record){
                record.set('checked', false);
            }
            groupView.superclass.on_destroy.apply(this, arguments);
        }
    });
    return groupView;
});/**
 * 外链管理模块
 * @author hibincheng
 * @date 2013-8-15
 */
define.pack("./photo_group",["lib","common","main","./Module","./Loader","./Store","./Mgr","./View","./toolbar.tbar","./selection","./file_path.file_path","./view_switch.view_switch"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record'),
        console = lib.get('./console'),
        global_event = common.get('./global.global_event'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        group_store = require('./Store'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        tbar = require('./toolbar.tbar'),
        selection = require('./selection'),
        file_path = require('./file_path.file_path'),
        view_switch = require('./view_switch.view_switch'),
        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,
        last_refresh_time = new Date(),
        timer,
        timer_time = 0,
        doc = document, body = doc.body, $body = $(body),
        undefined;

    var store = new Store();
    var loader = new Loader();
    var view = new View({
        store : store
    });

    var mgr = new Mgr({
        view: view,
        loader: loader,
        store: store,
        group_store: group_store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : 'photo_group',
        list_view : view,
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
                if(view_switch.is_group_view()) {
                    mgr.load_groups();
                } else {
                    mgr.load_all_files();
                }

                scroller = main_ui.get_scroller();
                inited = true;
            } else {
                this.on_refresh();
            }

            this.listenTo(global_event, 'share_refresh', this.on_refresh);
            this.listenTo(global_event, 'window_resize', this.on_win_resize);
            this.listenTo(global_event, 'switch_mode', this.on_switch_mode);
            this.listenTo(global_event, 'edit_cancel_all', this.on_cancel_sel);
            this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            this.listenTo(ds_photo_event, 'add remove move update', this.handle_group_changed);
            this.listenTo(ds_photogroup_event, 'add update', this.handle_group_changed);
        },
        on_activate: function() {
            $body.addClass('page-picture');
            this.init();

            file_path.on_activate();
            //if(view_switch.is_group_view()) {
                view.render_path();
            //}

            tbar.on_activate();
            view.render_editbar();

            view_switch.on_activate();
            view_switch.render(main_ui.get_$bar0());
            selection.disable_selection();
            main_ui.sync_size();
        },

        on_deactivate: function() {
            $body.removeClass('page-picture');
            selection.disable_selection();
            file_path.on_deactivate();
            view_switch.on_deactivate();
            tbar.on_deactivate();

            //file_path.toggle(false);
            view.back_to_group();
            main_ui.get_$bar2().hide();

            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            this.stopListening(global_event, 'switch_mode', this.on_switch_mode);
            this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'share_refresh', this.on_refresh, this);
            this.stopListening(global_event, 'edit_cancel_all', this.on_cancel_sel, this);
            this.stopListening(ds_photo_event, 'add remove move update', this.handle_group_changed);
            this.stopListening(ds_photogroup_event, 'add update', this.handle_group_changed);
        },

        load_more: function() {
            if(view_switch.is_group_view() && view.is_group_view()) {
                mgr.load_groups();
            } else {
                mgr.load_all_files();
            }
        },

        on_switch_mode: function(group) {
            // 更新路径
            file_path.update(group);
            main_ui.get_$bar2().show();
        },

        // 如果是group_store自身触发的事件，bypass
        handle_group_changed: function(records, meta){
            if(meta.src === store){
                return;
            }
            if(meta.move_photos) {
                mgr.on_move_photos(records);
                return;
            }
            this.buffer_group_reload(1500);
        },

        buffer_group_reload: function(delay){
            // 如果上次刷新在3秒内，则到第3秒才刷新
            // 如果在3秒开外，则delay秒后刷新（此时间看后台的反应速度）
            delay = delay || 1500;
            var me = this;
            var wait_time = Math.max(delay, 3000 - (new Date() - last_refresh_time));
            var will_time = new Date() + wait_time;
            // 如果本次预计刷新的时间比原定时间还要提前，无视掉
            // 因为原定时间可能是考虑到后台更新延时
            if(will_time <timer_time){
                return;
            }
            clearTimeout(timer);

            timer = setTimeout(function() {
                me.on_refresh();
            }, wait_time);
            timer_time = will_time;
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            store.clear();
            this.load_more();
            loader.set_checkalled(false);
        },

        /**
         * 编辑态bar中，点击取消选择
         */
        on_cancel_sel: function() {
            this.list_view.cancel_sel();
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
                this.load_more();
            }

            //窗口大小改变时，也需要调整item的width
            view.update_item_width();
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                this.load_more();
            }
        }
    });

    return module.get_common_module();
});/**
 * 批量选择文件
 * @author xixinhuang
 * @date 16-08-15
 */
define.pack("./selection",["lib","common","$","main","./tmpl"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        log_event = common.get('./global.global_event').namespace('log'),
        File = common.get('./file.file_object'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        tmpl = require('./tmpl'),

        recycle_list,
        scroller,
        sel_box,

        undefined;

    var selection = new Module('recycle_file_selection', {

        render: function (view) {
            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                ns: 'photo_group',
                $el: view.get_$list(),
                $scroller: main_ui.get_scroller().get_$el(),
                all_same_size: false,
                keep_on: function ($tar) {
                    return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                },
                clear_on: function ($tar) {
                    return $tar.closest('[data-record-id]').length === 0;
                },
                container_width: function () {
                    return view.get_$list().width();
                }
            });
            sel_box.enable();
            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var sel_cnt = 0;
                for (var el_id in sel_id_map) {
                    var item = $('#' + el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = view.get_record(item))) {
                        record.set('selected', true, true);
                        sel_cnt++;
                    }
                }
                for (var el_id in unsel_id_map) {
                    var item =  $('#' + el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = view.get_record(item))) {
                        record.set('selected', false, true);
                    }
                }
                this.trigger_changed(true);
            });


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
            //if(trigger_check_checkall) {
            //    this.trigger('check_checkall', sel_meta.is_all); //检查是否标记全选;
            //}

            //if(sel_meta.files.length === 0/* || !sel_meta.is_all*/) {
            //    this.trigger('cancel_checkall'); //取消全选
            //}
            //log_event.trigger('sel_files_len_change', sel_meta.files.length);
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

                //var files = recycle_list.get_files();
                //if (files.length) {
                //    for (var i = 0, l = files.length; i < l; i++) {
                //        files[i].set_selected(false);
                //    }
                //}
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

        get_selected: function() {
            sel_box.get_selected();
        },

        /**
         * 获取处于选中状态文件信息
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            //var all_files = recycle_list.get_files(),
            //    meta = {
            //        files: [],
            //        is_all: false
            //    };
            //
            //if (all_files.length) {
            //
            //    $.each(all_files, function (i, file) {
            //        if (file.is_selected()) {
            //            meta.files.push(file);
            //        }
            //    });
            //
            //    if(!recycle_list.has_more() && all_files.length == meta.files.length) {
            //        // 已全选
            //        meta.is_all = true;
            //    }
            //}
            //return meta;
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
 * 工具条（编辑态）
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./toolbar.tbar",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('disk/tbar'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        toolbar,
        status_map = {},
        nil = '请选择文件',

        undef;


    return new Module('photo_group_tbar', {

        /**
         * 渲染工具栏
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                    }
                },

                btns = [
                    // 下载
                    new Button({
                        id: 'pack_down',
                        label: '下载',
                        icon: 'ico-down',
                        filter: 'single',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_DOWNLOAD');
                        },

                        validate: function () {

                        }
                    }),
                    // 删除
                    new Button({
                        id: 'del',
                        label: '删除',
                        icon: 'ico-del',
                        filter: 'single',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_MANAGE_DELETE');
                        },

                        validate: function () {

                        }
                    })
                ];


            $(tmpl.editbar()).appendTo($to.empty());
            this._$editbar = $to;

            toolbar = new Toolbar({
                cls: 'disk-toolbar',
                apply_to: '#_main_bar1',
                btns: btns,
                filter_visible: true
            });
            toolbar.render($to);
            toolbar.filter('single');
        },

        /**
         * 更新工具栏状态
         * @param {String} filter
         * @param {Status} status
         */
        set_status: function (filter, status) {
            status_map[filter] = status;
        },

        get_status: function (filter) {
            return status_map[filter];
        },

        //标识编辑态bar是否可见
        set_visibility: function(visibility) {
            if(!this._visibility || this._visibility !== visibility) {
                this._visibility = visibility;
            }
        },

        get_visibility: function() {
            return !!this._visibility;
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
        },

        on_deactivate: function() {
            this.clear_$editbar();
            this.deactivate();
        },

        clear_$editbar: function() {
            this._$editbar && this._$editbar.empty();
        },

        get_$el: function () {
            return toolbar.get_$el();
        },

        toggle_toolbar: function(filter) {
            toolbar.filter(filter);
        }
    });
});/**
 * for 普通网盘文件列表
 * @author jameszuo
 * @date 13-11-12
 */
define.pack("./view_switch.ui",["lib","common","$","./tmpl","./view_switch.view_switch"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        view_switch,
        default_view,
        cur_view,

        undefined;


    var ui = new Module('photo_group_view_switch_ui', {

        render: function ($to) {
            if (this._rendered) return;

            view_switch = require('./view_switch.view_switch');
            default_view = view_switch.get_default_view();
            cur_view = view_switch.get_cur_view();

            var $el = this._$el = $(tmpl['view_switch']({is_whole_mode: view_switch.is_whole_view()}));
            $el.appendTo($to);

            // 点击视图列表中的item
            $el.on('click', '[data-action]', function (e) {
                e.preventDefault();
                var $btn = $(this),
                    data_name = $btn.attr('data-action');
                if($btn.hasClass('cur')) {
                    return;
                }
                $btn.closest('[data-id]').find('.cur').removeClass('cur');
                $btn.addClass('cur');
                view_switch.set_cur_view(data_name, e);
            });

            this._rendered = true;
        },

        destroy: function() {
            this._rendered = false;
            this._$el && this._$el.remove();
        },

        toggle: function (visible) {
            if(visible) {
                this._$el.show();
            } else if(!visible) {
                this._$el.hide();
            }
        }
    });

    return ui;
});/**
 * 视图切换
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./view_switch.view_switch",["lib","common","$","./tmpl","./view_switch.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),
        store = lib.get('./store'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        view_name_map_value = {
            whole:   1,   //全部
            group:  2     //分组

        },
        view_value_map_name = (function () {
            var n, map = {};
            for (n in view_name_map_value) {
                if (view_name_map_value.hasOwnProperty(n)) {
                    map[view_name_map_value[n]] = n;
                }
            }
            return map;
        })(),

        default_view = 'whole',

        store_name = 'group_switch_type',

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        // 最后一次使用的非“临时”视图
        last_not_temp_view = cur_view,

        undefined;


    var view_switch = new Module('photo_group_view_switch', {

        ui: require('./view_switch.ui'),

        _cur_visible : null,
        // 当成功进行切换时，返回true
        toggle_ui: function(visible){
            if(this._cur_visible === visible){
                return false;
            }
            this._cur_visible = visible;
            this.ui.toggle(visible);
            return true;
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
            this.ui.activate();
            this.ui.__rendered = false;
        },

        on_deactivate: function() {
            this.deactivate();
            this.ui.destroy();
            this.ui.deactivate();
        },

        render: function($to) {
            this.ui.render($to);
        },

        get_default_view: function() {
            return default_view;
        },

        exit_temp_view: function () {
            this.set_cur_view(last_not_temp_view, false);
        },

        /**
         * 切换视图
         * @param {String} view_name
         */
        set_cur_view: function (view_name, event) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {
                cur_view = view_name;

                last_not_temp_view = view_name;

                // 存储
                var value = view_name_map_value[view_name];
                store.set(store_name, value);
                this.trigger('switch.view', view_name, event);
            }
        },

        get_cur_view: function () {
            return cur_view;
        },

        is_group_view: function () {
            return this.get_cur_view() === 'group';
        },

        is_whole_view: function () {
            return this.get_cur_view() === 'whole';
        },

        get_view_value_map: function() {
            return view_name_map_value;
        }
    });

    return view_switch;

});
//tmpl file list:
//photo_group/src/cover/cover.tmpl.html
//photo_group/src/file_path/file_path.tmpl.html
//photo_group/src/group/group.tmpl.html
//photo_group/src/toolbar/toolbar.tmpl.html
//photo_group/src/view.tmpl.html
//photo_group/src/view_switch/view_switch.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'cover_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul class="edit-cover clear">\r\n\
    </ul>');

return __p.join("");
},

'cover_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
        var empty_group_img,
        thumb_url,
        group = data.group,
        old_cover_id = group.get('cover')[0].file_id,
        records = data.records;

    if(records && records.length > 0 ) {
        $.each(records, function(index, record){
            empty_group_img = "//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png";
            thumb_url = record.get_thumb_url() + '?size=64*64';
            __p.push('            <li data-id="');
_p(index);
__p.push('" class="list" data-record-id="');
_p(record.get_id());
__p.push('">\r\n\
                <a class="link" href="#">\r\n\
                    <img src="');
_p(thumb_url);
__p.push('">\r\n\
                    <div class="mask"></div>\r\n\
                    <i class="check"></i>\r\n\
                </a>\r\n\
            </li>');

        });
    }
    __p.push('');

return __p.join("");
},

'cover_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div style="height: 30px;line-height: 30px;color: #adb2b9;font-size: 18px;text-align: center;">\r\n\
        此分组中无图片\r\n\
        <div>');

return __p.join("");
},

'file_path': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_photo_file_path" class="act-panel-inner cleafix" style="display: none;">\r\n\
        <!-- 面包屑导航 s -->\r\n\
        <div data-id="breadcrumb" class="mod-breadcrumb">\r\n\
            <ul data-inner class="breadcrumb clearfix">\r\n\
                <li class="item cur">\r\n\
                    <a href="javascript:void(0)">全部</a>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <!-- 面包屑导航 e -->\r\n\
    </div>');

return __p.join("");
},

'file_path_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
    $ = require('$'),
    text = lib.get('./text'),

    file_list = require('./file_list.file_list'),

    common = require('common'),
    constants = common.get('./constants'),
    click_tj = common.get('./configs.click_tj'),
    scr_reader_mode = common.get('./scr_reader_mode'),

    name_len = constants.UI_VER === 'WEB' ? 10 : 5,
    target_node = data.target_node, // 目标目录
    enable = data.enable !== false, // 是否可点击
    has_more = !!data.has_more,
    z_index_start = constants.DIR_DEEP_LIMIT + 1,
    path = [],

    read_mode = scr_reader_mode.is_enable();

    __p.push('    <li data-more class="item">\r\n\
        <a href="javascript:void(0)">全部</a>\r\n\
    </li>');

    if (target_node) {
        var is_cur = true,
        name = text.text(text.smart_sub(target_node.get('name'), name_len)),
        aria_label = read_mode?(is_cur ? '当前':'进入') + '路径：' + path.join('。'):'';
        path.push(name);
    __p.push('        <li ');
 if (!is_cur) { __p.push(' data-file-id="');
_p( target_node.get('id') );
__p.push('" ');
 } else {__p.push('data-cur');
} __p.push('        tabindex="0" hidefocus="on"\r\n\
        class="item ');
_p( is_cur ? 'cur':'' );
__p.push('"\r\n\
    >\r\n\
        <i class="icon icon-bread-next"></i>\r\n\
        <a href="javascript:void(0)">');
_p(read_mode?aria_label:'');
_p( name );
__p.push('</a></li>');

        }
    __p.push('');

return __p.join("");
},

'dialog_group_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul class="edit-group">\r\n\
    </ul>');

return __p.join("");
},

'dialog_group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    var empty_group_img,
        thumb_url,
        groups = data.groups,
        cover_id,
        ext_info,
        group_name,
        records = data.records,
        old_cover_id = records[0].get_id(),
        empty_group_img = "//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png";
    if(groups && groups.length > 0) {
        $.each(groups, function(index, group){
            cover_id = group.get('cover')[0].file_id;
            ext_info = group.get('cover')[0].ext_info;
            group_name = group.get('name');
            thumb_url = ext_info? ext_info.thumb_url + '?size=64*64' : empty_group_img;
    __p.push('        <li data-id="');
_p(index);
__p.push('" class="list" data-record-id="');
_p(group.get('id'));
__p.push('">\r\n\
            <a class="link ');
_p(old_cover_id === cover_id? 'checked' : '');
__p.push('" href="#">\r\n\
                <img src="');
_p(thumb_url);
__p.push('">\r\n\
                <span class="ellipsis">');
_p(group_name);
__p.push('</span>\r\n\
                <div class="mask"></div>\r\n\
                <i class="check"></i>\r\n\
            </a>\r\n\
        </li>');

        });
    }
    __p.push('');

return __p.join("");
},

'editbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li data-btn-id="pack_down" data-no-selection class="edit-item" tabindex="-1"><i class="icon icon-download"></i><span class="text">下载</span></li>\r\n\
    <!--<li data-btn-id="share" data-no-selection class="edit-item" tabindex="-1"><i class="icon icon-share"></i><span class="text">分享</span></li>-->\r\n\
    <!--<li data-btn-id="set_group" data-no-selection class="edit-item" tabindex="-1"><i class="icon icon-movegroup"></i><span class="text">更改分组</span></li>-->\r\n\
    <li data-btn-id="del" data-no-selection class="edit-item" tabindex="-1"><i class="icon icon-trash"></i><span class="text">删除</span></li>');

return __p.join("");
},

'group_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_group_body" class="mod-list-group">\r\n\
        <div class="mod-pic-group" data-label-for-aria="图片文件列表内容区域">\r\n\
            <ul id="group_view_list" class="pic-group-list clearfix">\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="mod-figure-list" data-label-for-aria="图片文件列表内容区域">\r\n\
            <ul id="photo_view_list" class="figure-list clearfix">\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var text = require('lib').get('./text');
        var records = data.records;
        var item_width = data.item_width;
        var item_height = Math.round(item_width * 0.75);
        var me = this;
        if(data.module_name === 'group') {
            return;
        }
    __p.push('    ');
_p(me.group_add(data));
__p.push('    ');

        if(records && records.length > 0 ) {
            $.each(records, function(index, record){
    __p.push('\r\n\
        <li data-list="true" data-name="img" data-action="enter_group" id="group_items_');
_p(record.id);
__p.push('" data-record-id="');
_p(record.id);
__p.push('" class="pic-group-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
            <div data-id="img" class="pic-group-item-pic" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
            </div>\r\n\
            <div class="pic-group-bg"></div>\r\n\
            <div class="pic-group-item-txt">\r\n\
                <p class="tit"><span class="txt">');
_p(text.text(record.get('name')));
__p.push('</span><span class="num">(');
_p(record.get('size'));
__p.push(')</span></p>\r\n\
            </div>\r\n\
        </li>');

            });
        }
    __p.push('');

return __p.join("");
},

'add_photo_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var item_width = data.item_width;
        var item_height = Math.round(item_width * 0.75);
    __p.push('    <li data-list="true" data-name="img" id="add_group" data-record-id="0" class="pic-group-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
        <div data-id="img" class="pic-group-item-pic" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
            <i class="icon icon-l icon-pic-l"></i>\r\n\
        </div>\r\n\
        <div class="pic-group-bg"></div>\r\n\
        <div class="pic-group-item-edit">\r\n\
            <input type="text" value="">\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'group_add': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <!-- 添加图片组 s -->');

        var item_width = data.item_width;
        var item_height = Math.round(item_width * 0.75);
    __p.push('    <li data-action="create_group" class="pic-group-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
        <div class="pic-group-item-add" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
            <i class="icon icon-act-add-l"></i>\r\n\
        </div>\r\n\
    </li>');

}
return __p.join("");
},

'new_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    var records = data.records;
    var item_width = data.item_width;
    var item_height = Math.round(item_width * 0.75);

    if(records && records.length > 0 ) {
        $.each(records, function(index, record){
    __p.push('    <li data-list="true" data-name="img" data-action="enter_group" id="group_items_');
_p(record.id);
__p.push('" data-record-id="');
_p(record.id);
__p.push('" class="pic-group-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
        <div data-id="img" class="pic-group-item-pic" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
        </div>\r\n\
        <div class="pic-group-bg"></div>\r\n\
        <div class="pic-group-item-txt">\r\n\
            <p class="tit"><span class="txt">');
_p(text.text(record.get('name')));
__p.push('</span><span class="num">(');
_p(record.get('size'));
__p.push(')</span></p>\r\n\
        </div>\r\n\
    </li>');

        });
    }
    __p.push('');

return __p.join("");
},

'photo_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    var records = data.records;
    var item_width = data.item_width;
    var item_height = Math.round(item_width * 0.75);

    __p.push('    ');

    if(records && records.length > 0 ) {
        $.each(records, function(index, record){
    __p.push('\r\n\
    <li data-list="true" data-name="img" id="photo_items_');
_p(record.id);
__p.push('" data-record-id="');
_p(record.get_id());
__p.push('" class="figure-list-item" style="width: ');
_p(item_width);
__p.push('px">\r\n\
        <div data-id="img" class="figure-list-item-pic" style="height: ');
_p(item_height);
__p.push('px;">\r\n\
            <i class="icon icon-check-m"></i>\r\n\
        </div>\r\n\
        <div class="figure-list-item-txt">\r\n\
            <p class="tit"><i class="icon icon-s icon-pic-s"></i><span class="txt" title="');
_p(record.get_name());
__p.push('">');
_p(text.text(record.get_name()));
__p.push('</span></p>\r\n\
        </div>\r\n\
    </li>');

        });
    }
    __p.push('');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_photo_group_view_empty" class="g-empty share-empty" aria-label="分享的链接没有内容" tabindex="0">\r\n\
        <div class="empty-box">\r\n\
            <div class="status-inner">\r\n\
                <i class="icon icon-nopicture"></i>\r\n\
                <h2 class="title">暂无图片</h2>\r\n\
                <p class="txt">请点击右上方的“添加”按钮添加</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'view_switch': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="view-item-list clearfix">');

            var whole_class = data.is_whole_mode? 'cur' : '';
            var group_class = data.is_whole_mode? '' : 'cur';
        __p.push('        <div data-id="group_switch" class="view-item clearfix item-picture">\r\n\
            <a class="item-list ');
_p(whole_class);
__p.push('" data-action="whole" href="javascript: void(0);" title="全部">全部</a>\r\n\
            <a class="item-list ');
_p(group_class);
__p.push('" data-action="group" href="javascript: void(0);" title="分组">分组</a>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
