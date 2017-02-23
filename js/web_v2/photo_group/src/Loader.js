define(function(require, exports, module) {

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
});