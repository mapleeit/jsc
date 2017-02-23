/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        security = lib.get('./security'),
        
        Record = require('./File_record'),
        
        common = require('common'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        progress = common.get('./ui.progress'),

        store,
        
        $ = require('$');
    var load_finish = false;
    var requesting  = false;
    var dir_len = 32;
    
    // 原common/request模块格式固定了，不适用于这里简单的请求
    // 同时也比较难改造
    // 为了简化，这里不再做返回码判断，错误直接返回为空。

    var crontab = {

        start: function(keyword, offset, size, loaded_count) {
            if(this.loading) {
                return;
            }
            //progress.show('更多结果还在搜索中，请稍候！');
            this.keyword = keyword;
            this.offset = offset + loaded_count;
            this.size = size - loaded_count;

            this.load(this.keyword, this.offset, this.size);

            this.loading = true;
        },

        load: function(keyword, offset, size) {
            var me = this;
            requesting = true;
            var req = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/user_library.fcg',
                cmd: 'Lib3LibSearch',
                pb_v2: true,
                cavil : true,
                body: {
                    key_word: keyword,
                    offset: offset,
                    count: size
                }
            });

            this.req = req;

            req.ok(function(msg, body, header, data){
                me.loading = false;
                var records = [], total_length = 0;
                load_finish = body.finish_flag;

                records = formatData(body);
                if(size > records.length && !load_finish) {
                    crontab.start(keyword, offset, size, records.length);
                } else {
                    requesting = false;
                    //process.hide();
                }
                // cgi目前有bug，如果有破损文件，会导致总数计算错误
                // 这里进行修正，如果未返回预期的大小就判断为已加载完
                if(records.length !== size){
                    total_length = offset + records.length;
                }else{
                    total_length = body.total_number;
                }
                if(store.get_total_length() == 0) {
                    store.load(records, total_length);
                } else {
                    store.add(records);
                }
                // 如果总数变了，更新。正常情况这个数不应该变
                if(total_length !== store.get_total_length()){
                    store.total_length = total_length;
                    store.trigger('metachange');
                } else if(load_finish) {//加载完成
                    store.trigger('metachange');
                }
            }).fail(function(){
                requesting = false;
                me.loading = false;
            });
        },

        stop: function() {
            this.loading = false;
            this.req && this.req.destroy();
        }
    };

    var formatData = function(data) {
        var records = [];
        //先列出文件夹，后列出文件
        if(data.DirItem_items) {
            $.each(data.DirItem_items, function (i, dir) {
                records.push(new Record({
                    id : dir.dir_key,
                    pid : dir.pdir_key,
                    name : dir.dir_name,
                    create_time : dir.dir_mtime,
                    modify_time: dir.dir_mtime,
                    is_dir : true
                }));
            });
        }

        if(data.FileItem_items) {
            $.each(data.FileItem_items, function (i, file) {
                records.push(new Record({
                    id: file.file_id,
                    pid: file.pdir_key,
                    name: file.filename,
                    create_time: file.file_ctime,
                    modify_time: file.file_mtime,
                    size: file.file_size,
                    in_album: file.source > 0,
                    cur_size: file.file_size, // 搜索是不会列出破损文件的
	                ext_info : file.ext_info
                }));
            });
        }

        return records;
    }
    
    var Loader = inherit(Event, {

        set_store: function(st) {
            store = st;
        },

        reset: function() {
            crontab.stop();
            requesting = false;
        },

        load : function(keyword, offset, size){
            var me = this;
            offset = offset || 0;
            size = size || 100;

            crontab.stop();//关闭定时任务
            requesting = true;
            // 后台最大支持100条
            var req = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/user_library.fcg',
                cmd: 'Lib3LibSearch',
                pb_v2: true,
                cavil : true,
                body: {
                    key_word: keyword,
                    offset: offset,
                    count: size
                }
            });
            
            var def = $.Deferred();
            
            def.abort = function(){
                if(def.state() === 'pending'){
                    // 提前reject，后面request fail里的reject会自动无视
                    def.reject('canceled');
//                    request.abort();
                    req.destroy();
                }
                crontab.stop();//关闭定时任务
            };
            req.ok(function(msg, body, header, data){
                requesting = false;
                var records = [], total_length = 0;
                load_finish = body.finish_flag;

                records = formatData(body);
                if(size > records.length && !load_finish) {
                    crontab.start(keyword, offset, size, records.length);
                }
                // cgi目前有bug，如果有破损文件，会导致总数计算错误
                // 这里进行修正，如果未返回预期的大小就判断为已加载完
                if(records.length !== size){
                    total_length = offset + records.length;
                }else{
                    total_length = body.total_number;
                }
                def.resolve(records, total_length);
            }).fail(function(){
                requesting = false;
                def.reject();
            });
            return def;
        },

        is_load_done: function() {
            return !!load_finish;
        },

        is_requesting: function() {
            return !!requesting;
        }
    });
    return Loader;
});