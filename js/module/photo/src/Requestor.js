/**
 * 用于相册的cgi接口封装
 * @author cluezhang
 * @date 2013-11-8
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        
        Group_record = lib.get('./data.Record'),
        date_time = lib.get('./date_time'),
        Photo_record = require('./photo.Record'),
        
        $ = require('$');
    var Processor = inherit(Object, {
        constructor : function(options){
            $.extend(this, options);
        },
        empty : function(){
            return this.records.length<=0;
        }
    });

    var lib_v3_enable = false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
        }
    });

    var Requestor = inherit(Event, {
        canceled : {},
        group_cgi : 'http://web2.cgi.weiyun.com/pic_group.fcg',
        lib_cgi : 'http://web2.cgi.weiyun.com/lib_list.fcg',
        default_cgi : 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        _get : function(url, cmd, header, body, post_process){
            return this._request(url, cmd, header, body, post_process, false);
        },
        _post : function(url, cmd, header, body, post_process){
            return this._request(url, cmd, header, body, post_process, true);
        },
        /*jshint maxparams:6*/
        _request : function(url, cmd, header, body, post_process, use_post){
            var def = $.Deferred(), me = this;
            var pb_v2 = cmd.indexOf('_') < 0 ? true : false;
            var req = request[use_post ? 'xhr_post' : 'xhr_get']({
                url : url,
                cmd : cmd,
                pb_v2: pb_v2,
                header : header,
                body : body,
                cavil : true
            });
            
            def.abort = function(){
                if(def.state() === 'pending'){
                    // 提前reject，后面request fail里的reject会自动无视
                    def.reject(me.canceled);
//                    request.abort();
                    req.destroy();
                }
            };
            req.ok(function(msg, body, header, data){
                var args;
                if(post_process){
                    args = post_process.apply(this, arguments);
                }else{
                    args = $.makeArray(arguments);
                }
                def.resolve.apply(def, args);
            }).fail(function(msg, ret, body, header, data){
                def.reject(msg, ret, body, header, data);
            });
            
            return def;
        },
        // 创建分组
        create_group : function(name){
            var cmd = lib_v3_enable ? 'LibCreatePicGroup' : 'create_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_name : name
                },
                function(msg, body, header, data){
                    return [new Group_record({
                        id : body.group_id,
                        name : body.group_name,
                        create_time : new Date(),
                        modify_time : new Date(),
                        size : 0
                    }, body.group_id)];
                }
            );
        },
        // 删除分组
        delete_group : function(record){
            var cmd = lib_v3_enable ? 'LibDeletePicGroup' : 'delete_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_id : record.get('id'),
                    group_name : record.get('name')
                }
            );
        },
        rename_group : function(group_id, old_name, new_name){
            var cmd = lib_v3_enable ? 'LibModPicGroup' : 'modify_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_id : group_id,
                    src_group_name : old_name,
                    dst_group_name : new_name
                }
            );
        },
        //
        set_group_album : function(group_id, cover_record){
            var cmd = lib_v3_enable ? 'LibSetGroupCover' : 'set_cover';

            var body = {
                group_id : group_id,
                covers : [
                    {
                        file_id : cover_record.get_id()
                    }
                ]
            }
            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg';
                body = {
                    group_id: group_id,
                    file_id: cover_record.get_id(),
                    pdir_key: cover_record.get_pid()
                };
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                body
            );
        },
        // 设置分组顺序
        set_group_orders : function(groups){
            var orders = [];
            $.each(groups, function(index, group){
                orders.push(group.get('id'));
            });
            var cmd = lib_v3_enable ? 'LibSetGroupOrder' : 'set_order';

            var body = {
                order : orders
            };
            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg';
                body = {
                    group_id_list: orders
                }
            }

            return this._post(
                this.group_cgi,
                cmd,
                {},
                body
            );
        },
        // 加载分组
        load_groups : function(){
            var cmd = lib_v3_enable ? 'LibGetPicGroup' : 'get_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {},
                function(msg, body, header, data){
                    var groups = [],
                        pic_group;
                    pic_group = lib_v3_enable ? body.groups : body.pic_group;
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
                    return [groups];
                }
            );
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
        // 移动照片分组
        move_photos : function(records, old_group_id, group_id){
            var items = [];
            $.each(records, function(index, record){
                if(lib_v3_enable) {
                    items.push({
                        pdir_key : record.get_pid(),
                        file_id : record.get_id(),
                        filename : record.get_name()
                    });
                } else {
                    items.push({
                        pdir_key : record.get_pid(),
                        file_id : record.get_id(),
                        file_name : record.get_name()
                    });
                }
            });
            var cmd = lib_v3_enable ? 'LibBatchMovePicToGroup' : 'move_pic';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._post(
                this.group_cgi,
                cmd,
                {},
                {
                    src_group_id : old_group_id,
                    dst_group_id : group_id,
                    items : items
                },
                // 可能有部分成功
                function(msg, body, header, data){
                    var success = [], fails = [];
                    var results = lib_v3_enable ? body.items : body.results;
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
                    return [success, fails];
                }
            );
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
        Delete_processor : inherit(Processor, {
            max : 10,
            get_next : function(){
                var me = this,
                    records = me.records,
                    todos = [],
                    lefts = [],
                    pdir_key = records[0].get_pid();
                $.each(records, function(index, record){
                    if(record.get_pid() === pdir_key){
                        todos.push(record);
                    }else{
                        lefts.push(record);
                    }
                    if(todos.length >= me.max){
                        lefts = lefts.concat(records.slice(index+1));
                        return false;
                    }
                });
                me.records = lefts;
                
                return todos;
            },
            process : function(records){
                return this.requestor.delete_photos(records);
            }
        }),
        step_delete_photos : function(records){
            return this.step_process(new this.Delete_processor({
                requestor : this,
                records : records
            }));
        },
        // 批量删除照片 private 
        delete_photos : function(records){
            var items = [];
            $.each(records, function(index, record){
                items.push({
                    ppdir_key : record.get_ppid(),
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    file_name : encodeURIComponent(record.get_name()),
                    file_ver: record.get_file_ver()
                });
            });
            return this._post(
                this.default_cgi,
                'batch_file_delete',
                {},
                {
                    del_files : items
                },
                // 可能有部分成功
                function(msg, body, header, data){
                    var success = [], fails = [];
                    if(body.results){ // 当返回了各子项的结果时，区别对待
                        $.each(body.results, function(index, result){
                            // 判断返回码，1020文件不存在也作为成功
                            var ret = parseInt(result.result, 10);
                            if(ret === 0 || ret === 1020){
                                success.push(records[index]);
                            }else{
                                fails.push(records[index]);
                            }
                        });
                    }else{ // 当没有返回各子项结果，当作全成功
                        success = records;
                    }
                    return [success, fails];
                }
            );
        },
        // 加载照片，如果不传group_id则加载全部
        load_photos : function(group_id, offset, size){
            var cmd = lib_v3_enable ? 'LibPageListGet' : 'get_lib_list';

            if(lib_v3_enable) {
                this.lib_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.lib_cgi,
                cmd,
                {},
                {
                    lib_id : 2,
                    offset : offset,
                    count : size,
                    sort_type : 1,
                    group_id : group_id || 0,
	                get_abstract_url: true  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
                },
                function(msg, body, header, data){
                    var photos = [];
                    /*
                     *  "file_ctime": 1347262430000,
    "file_id": "a7490880-006f-43ec-b908-5cf2f281b262",
    "file_md5": "ebd13e0f23436b9c9db7bb9b66cddf0d",
    "file_mtime": 1347262431000,
    "file_name": "20120522155129806.JPG",
    "file_sha": "67fe8dc8e31997c0a4be7694ae9c6f9baa7fc41a",
    "file_size": 1898066,
    "file_ttime": 1337560283000,
    "pdir_key": "e01985017023fa68fb65097660cf0cf0"
    
    id: obj['file_id'],
                    name: attr['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: attr['file_mtime'],
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                     */
                    var list_items = lib_v3_enable ? body.FileItem_items: body.list_item;
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
                                cur_size : photo.file_size, // 默认没有破损 TODO 需后台确认
                                take_time : photo.file_ttime || photo.ext_info && photo.ext_info.take_time && date_time.timestamp2date(photo.ext_info.take_time),
                                pid : photo.pdir_key,
                                ppid : photo.ppdir_key,
                                file_ver : photo.file_version,
	                            ext_info : photo.ext_info
                            }));
                        });
                    }
                    var end = lib_v3_enable ? body.finish_flag : body.end;
                    // TODO 要返回总数，目前返回的是end标记
                    return [photos, end];
                }
            );
        }
    });
    return Requestor;
});