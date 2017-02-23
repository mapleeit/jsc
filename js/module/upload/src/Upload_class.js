define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        disk_mod = require('disk'),

        console = lib.get('./console').namespace('upload'),
        Class = lib.get('./class'),
        routers = lib.get('./routers'),
        plugin_detect = common.get('./util.plugin_detect'),
        functional = common.get('./util.functional'),
        file_type_map = common.get('./file.file_type_map'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        file_object = common.get('./file.file_object'),
	    query_user = common.get('./query_user'),

        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),
        file_list_ui = disk_mod.get('./file_list.ui'),
        remove = disk_mod.get('./file_list.file_processor.remove.remove'),
        FileNode = disk_mod.get('./file.file_node'),
        all_file_map = disk_mod.get('./file.utils.all_file_map'),

        View = require('./view'),
        msg = require('./msg'),
        upload_route = require('./upload_route'),
        speed_task = require('./speed.speed_task'),
        aop_wrap_log = require('./aop_wrap_log'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        bar_info = require('./tool.bar_info'),//统计信息类
        photo_group = require('./select_folder.photo_group'),
	    reportStore = common.get('./report_store'),
        stat_log = common.get('./stat_log'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        dataChanged_event = common.get('./global.global_event').namespace('datasource.photo'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        main = require('main').get('./main');

    var get_plugin_version = function () { //获取控件的版本号
        if(constants.IS_APPBOX){
            if(window.external.GetVersion){
                return 'appbox-' + window.external.GetVersion();
            }else{
                return 'appbox';
            }
        }
        switch (upload_route.type) {
            case('active_plugin'):
                return plugin_detect.get_ie_plugin_version();
            case('webkit_plugin'):
                //1.0.0.4以前的版本通过plugin_detect获取不到
                var v = plugin_detect.get_webkit_plugin_version();
                if( v === '0'){
                    try{
                        return upload_route.upload_plugin.Version;
                    }
                    catch(e){
                        return 0;
                    }
                }
                return v;
            default :
                return '-';
        }
    };

    var Upload = (function () {
        var G1 = Math.pow(2, 30),
            G4 = G1 * 4,
            dir_cache = {},//目录cache
            done_file_id_cache = {},
            __Upload = Class.create();

        //建立 和 Cache联系的 methods
        var link_methods = {
            get_belong_cache: function () {
                return upload_cache.get(this.cache_key);
            },
            get_cache: function () {
                return this.get_belong_cache().get_cache();
            },
            get_curr_cache: function () {
                return this.get_belong_cache().get_curr_cache();
            },
            get_total_size: function (total_size) {
                if (total_size - 0 >= 0) { //set
                    this.get_belong_cache().get_total_size(total_size);
                } else {//get
                    return this.get_belong_cache().get_total_size();
                }
            },
            get_passed_size: function (passed_size) {
                if (passed_size - 0 >= 0) {//set
                    this.get_belong_cache().get_passed_size(passed_size);
                } else {//get
                    return this.get_belong_cache().get_passed_size();
                }
            },
            get_queue: function () {
                return this.get_belong_cache().get_queue();
            },
            get_curr_upload: function () {
                return this.get_belong_cache().get_curr_upload();
            },
            plus_info: function (key) {
                this.get_belong_cache().plus_info(key, this);
            },
            minus_info: function (key) {
                this.get_belong_cache().minus_info(key, this);
            },
            call_next_task: function () {
                this.get_belong_cache().do_next();
            }
        };
        for (var method_name in link_methods) {
            __Upload.interface(method_name, link_methods[method_name]);
        }



        /**
         * @param dir_id_paths 目录id路径
         * @param dir_paths 目录名称路径
         * @param cache_key 缓存key
         * @param view_key 试图key
         * @param op_type 操作类型
         */
        __Upload.interface('init', function (dir_id_paths, dir_paths, cache_key, view_key, op_type) {
            this.cache_key = cache_key || upload_cache.default_cache_key;
            var me = this;
            this.get_belong_cache().push_cache(me.local_id, me);

            this._state_log = {msg: []};
            me.upload_type = upload_route.type;
            me.file_type = upload_static.FILE_TYPE;//文件类型
            me.view = View.add(me, view_key);
            if (dir_id_paths && dir_id_paths.length) {//存储目录路径信息
                dir_cache[ dir_id_paths[ dir_id_paths.length - 1 ] ] = {'paths': dir_paths, 'ids': dir_id_paths  };
            }
            me.op_type = op_type || upload_static.OP_TYPES.UPLOAD;//任务类型
            me.err_msg = '';//错误提示信息
            me.update_state_info('init');
            me.when_change_state('init');
            me.view.invoke_state('init');
        });
        /**
         * 释放控件资源
         */
        __Upload.interface('release_plugin', function () {});
        /**
         * 是下载
         */
        __Upload.interface('is_download', function () {
            return this.op_type === upload_static.OP_TYPES.DOWN;
        });


        /**
         * 是上传
         */
        __Upload.interface('is_upload', function () {
            return this.op_type === upload_static.OP_TYPES.UPLOAD;
        });

        /**
         * 是否文件夹上传,用于屏蔽上传成功的上报
         */
        __Upload.interface('is_upload_folder', function () {
            return false;
        });

        /**
         * 选中网盘目录文件
         */
        __Upload.interface('chose_disk_files', function () {
            var ids_paths = this.get_dir_ids_paths(),
                file_ids = this.get_file_id_by_dir(),
                ids = [],
                paths = [];
            if (ids_paths && ids_paths.ids) {
                ids = ids_paths.ids.slice(1);
                paths = ids_paths.paths.slice(1);
            }

            if (ids.length > 0 && paths.length > 0) {
                var def = file_list.load_path(ids, paths, false);//快速打开视图
                if (file_ids && file_ids.length) {
                    def.done(function () {
                        file_list_ui.highlight_$item(file_ids);//高亮完成文件
                    });
                }
            } else if (this.pdir) {
                file_list.load(this.pdir, true);//网盘打开指定目录
                file_list_ui.highlight_$item(file_ids);//高亮完成文件
            }
        });

        /**
         * 打开至目的地
         */
        __Upload.interface('open_to_target', function () {
            var me = this;
            //跳到中转站
            //if(this.is_temporary()) {
            //    routers.go({ m: 'station' });
            //    return;
            //}
            if (me.pdir == constants.UPLOAD_DIR_PHOTO) {//相册
                main.switch_mod('photo');//菜单打开相册
                try{
                    $('iframe[name=photo_bridge_iframe]')[0].contentWindow.WEIYUN_WEB.View.showPhotostream(1,1);
                }catch(xe){
                    console.warn('open_to_target :',xe);
                }

            } else {//网盘
                main.switch_mod('disk', { reload: 0 });//菜单打开网盘
                if (!file_list.is_first_loaded()) {
                    file_list.load_root(false).done(function () {
                        setTimeout(function () {
                            me.chose_disk_files();
                        }, 50);
                    })
                } else {
                    me.chose_disk_files();
                }
            }
        });
        /**
         * 获取进度显示进度位数
         */
        __Upload.interface('get_the_precision', function () {
            return this._precision || (this._precision = ( (G1 <= this.file_size && this.upload_type !== 'upload_form') ? 2 : 0 ));
        });
        /**
         * 获取目录路径的ids，names
         */
        __Upload.interface('get_dir_ids_paths', function () {
            return dir_cache[ this.pdir ];
        });
        /**
         * 将完成的file_id放到对应的目录中
         * @param file_id
         */
        __Upload.interface('push_done_file_id', function (file_id) {
            if (!done_file_id_cache[this.pdir]) { //添加 完成的file_id
                done_file_id_cache[this.pdir] = [];
            }
            done_file_id_cache[this.pdir].push(file_id);
        });
        /**
         * 获取目录路径下已完成 file_id
         */
        __Upload.interface('get_file_id_by_dir', function () {
            return done_file_id_cache[this.pdir] ? done_file_id_cache[this.pdir] : [];
        });

        __Upload.interface('change_state', function () {

            var state = Array.prototype.shift.call(arguments),
                __statefn = this.states[state];
            if (__statefn) {
                if (state !== this.state) {
                    this.update_state_info(state, this.del_local_id);//更新全局信息
                    this.view.transform_state.call(this.view, state);     //转化状态的一瞬间

                    //改变状态的时候改变文件上传的状态
                    var set_curr_upload_fileid = 'start_upload upload_file_update_process',
                        del_curr_upload_fileid = 'done error clear pause';
                    if( -1 !== set_curr_upload_fileid.indexOf(state) ){
                        if(this.file_id && !this.is_download()) upload_event.trigger('set_curr_upload_file_id', this.file_id);
                    }
                    else if( -1 !== del_curr_upload_fileid.indexOf(state) ){
                        upload_event.trigger('set_curr_upload_file_id');
                    }
                }
                this.state = state;
                __statefn.apply(this, arguments);
                this.when_change_state(this.state);
                this.view.change_state();
                
            }


            this._state_log.msg = this._state_log.msg || [];

            if(this.state === 'file_sign_update_process' || this.state === 'upload_file_update_process' || this.state === 'processing') {
                if(!this._state_log[this.state]) {
                    this._state_log.msg.push(this.state);
                    this._state_log[this.state] = 'processing';
                }
            } else {
                this._state_log.msg.push(this.state);
            }

        });

        /**
         * 监听任务之间的状态切换
         */
        __Upload.interface('when_change_state', function (target_state) {
            if (bar_info.process_states[target_state]) {
                bar_info.check_error(this);
                bar_info.update(this.is_download() ? bar_info.OPS.DOWN_CHECK : bar_info.OPS.UP_CHECK);
            }
        });

        __Upload.interface('set_local_id', function (local_id) {
            this.get_belong_cache().pop_cache(this.local_id);
            if (!local_id && local_id !==0) {
                return;
            }
            this.get_queue().set_only_key(this.local_id, local_id);
            this.local_id = local_id;
            this.get_belong_cache().push_cache(this.local_id, this);
        });


        __Upload.interface('get_file_size', function () {
            var self = this;
            var file_size = functional.try_it(function () {
                return self.upload_plugin.GetFileSizeString(self.path) - 0;
            }) || this.upload_plugin.GetFileSize(self.path) || 0;

            file_size = file_size - 0;
            if (file_size < 0) {
                file_size += 4 * 1024 * 1024 * 1024;
            }

            return file_size;
        });
        __Upload.interface('get_file_name', function () {
            var me = this;
            if( me.file_name ){
                return me.file_name;
            }
            if ( me.path ) {
                return functional.try_it(function () { //文件名称
                    var ary = me.path.split(/\\|\//);
                    return ary[ary.length - 1] || '';
                }) || '';
            }
            return '';
        });
        //事件分发
        __Upload.interface('dispatch_event', function () {
            if( upload_route.is_ku20() && this.is_upload() && this.is_image()){//todo ku20
                var file = {
//                    group_id: this.group_id,
                    id: this.file_id,
                    name: this.new_name || this.file_name,
                    size: this.file_size,
                    cur_size: this.file_size,
                    create_time: this.file_ctime,
                    modify_time: this.file_ctime,
                    file_ver: this.file_ver,
                    file_md5: this.file_md5,
                    file_sha: this.file_sha,
                    ppid: this.ppdir,
                    pid: this.pdir
                };
                try{
                    //console.debug(file);
                    dataChanged_event.trigger('add',[file], {
                        src : this,
                        group_id : this.group_id
                    });
                } catch(xe){

                }
            }
        });

        __Upload.interface('is_image', function () {
            return file_object.is_image(this.get_file_name());
        });

        __Upload.interface('get_upload_param', function (md5, sha) {
            //var file_mtime = '2000-01-01 10:00:00',
            //bugfix: 48680617【微云web】接收到本地的QQ文件”上传到微云“，由于文件名多个”.“导致提示文件名不合法
            var re_file_name = this.file_name.replace(/(^\.*|\.*$)/g, ''),
                data;

            data = {
                ppdir_key: this.ppdir || '',
                pdir_key: this.pdir || '',
                upload_type: 0,
                file_sha: sha,
                file_size: this.file_size + '',
                filename: re_file_name,
                file_exist_option: 6 //2015.3.26 应sunny要求改为6
            };

	        if(md5) {
		        data.file_md5 = md5;
	        }

            return data;

        });

        __Upload.interface('get_file_type', function () {
            var self = this;
            var suffix = functional.try_it(function () {
                var ary = self.path.split('.'),
                    __suffix = ary[ary.length - 1];
                return __suffix;
            }) || '';
            return file_type_map.get_type_by_ext(suffix.toLowerCase());
        });

        __Upload.interface('get_translated_error', function (msg_type) {
            if(this.is_download()){
                return  upload_static.get_error_msg(this.log_code, msg_type,'download_error', this.err_msg);
            }
            return upload_static.get_error_msg(this.log_code, msg_type,null,this.error_step, this.err_msg);
        });

        //just_curr_cache 标识仅仅清除 运行缓存中的对象
        __Upload.interface('destroy', function (just_curr_cache) {
            if (!just_curr_cache) {
                this.get_belong_cache().pop_cache(this.local_id);
            }
            this.get_belong_cache().pop_curr_cache(this.del_local_id);

            //如果需要自动保存进度,这里就需要删除
            if(this.need_auto_save_process()){
                var resume_files = {'tasks': []};
                upload_event.trigger('set_resume_store', resume_files);
            }
            
        });


        __Upload.interface('dom_events', {
            click_cancel: function () {
                this.old_state = this.state;
                this.events.clear.call(this);
            },
            click_pause: function () {
                if (this.can_pause_self()) {
                    this.change_state('pause');    
                }
            },
            click_continuee: function () {
                View.upload_end_time(true);
                upload_static.batch_pause_to_run([this], 'continuee');
            },
            click_resume_continuee: function () {
                View.upload_end_time(true);
                upload_static.batch_pause_to_run([this], 'resume_continuee');
            },
            click_re_try: function () {
                upload_static.batch_re_start([this]);
            }
        });
        __Upload.interface('is_plugin_upload', function () {
            return false;
        });
        /**
         * 2.0图片申请上传CGI
         */
        __Upload.interface('photo_request_upload', function (data, callback) {
            var __self = this;
	        var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
            this.group_id = photo_group.get_photo_group_id();

            if(this.group_id > 1){
                data.ext_info = data.ext_info || {};
                data.ext_info.group_id = this.group_id - 0; //整型，相册分组ID
            }
            if(data.upload_type == null){
                data.upload_type = (__self.is_plugin_upload() ? 0 : 1)//整型,上传方式, 0代表传统控件上传,1非控件上传
            }
            /*if( data.file_attr && data.file_attr.file_name ){//2.0的file_name变更为外层
                data.file_name = data.file_attr.file_name;
            }*/

            if( data.file_size ){//2.0的file_size变更为int类型
                data.file_size -= 0;
            }
            if(!data.ppdir_key || !data.pdir_key) {
                __self.change_state('error', 1000013);//缺少参数
                return;
            }
            var url = this.is_temporary() ? 'http://web2.cgi.weiyun.com/temporary_file.fcg' : 'http://web2.cgi.weiyun.com/qdisk_upload.fcg',
                cmd = this.is_temporary() ? 'TemporaryFileDiskFileUpload' : 'DiskFileUpload';
            if(data.filename.length >= 100){  //文件名长度大于等于100的时候采用post，tgw对于长文件的get请求会阻断
                request.xhr_post({
                    url: url,
                    cmd: cmd,
                    body: data,
                    cavil: true,
                    pb_v2: true
                })
                    .fail(function (msg, ret, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        __self.err_msg = msg;
                        __self.change_state('error', ret);//相册请求上传，激活错误状态
                    })
                    .ok(function (msg, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
                        rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
                        rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
                        $.extend(__self, rsp_body);
                        __self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
                        callback(rsp_body, data);
                    });
            }
            else{
                request.xhr_get({
                    url: url,
                    cmd: cmd,
                    body: data,
                    cavil: true,
                    pb_v2: true
                })
                    .fail(function (msg, ret, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        __self.err_msg = msg;
                        __self.change_state('error', ret);//相册请求上传，激活错误状态
                    })
                    .ok(function (msg, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
                        rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
                        rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
                        $.extend(__self, rsp_body);
                        __self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
                        callback(rsp_body, data);
                    });
            }

        });
        __Upload.interface('request_upload', function (data, callback) {
            var __self = this;
	        var user = (query_user.get_cached_user && query_user.get_cached_user()) || {};
            if( upload_route.is_ku20() && file_object.is_image(__self.get_file_name() ) ){//
                __self.photo_request_upload(data,callback);
                return;
            }
            //code by bondli 增加支持相册上传参数，相册设置的upload_to为-1
           /* var url = 'http://pre.cgi.weiyun.com/uploadv2.fcg';
            var cmd = 'upload';
            if (this.pdir == constants.UPLOAD_DIR_PHOTO) {
                url = 'http://web.cgi.weiyun.com/upload.fcg';
                url += '?module=1';
                cmd = 'file_upload';
            }*/
            if(data.upload_type == null){
                data.upload_type = (__self.is_plugin_upload() ? 0 : 1)//整型,上传方式, 0代表传统控件上传,1非控件上传
            }

            /*if( data.file_attr && data.file_attr.file_name ){//2.0的file_name变更为外层
                data.file_name = data.file_attr.file_name;
            }*/
            if( data.file_size ){//2.0的file_size变更为int类型
                data.file_size -= 0;
            }
            //console.debug(data);
            if(!data.ppdir_key || !data.pdir_key) {
                __self.change_state('error', 1000013);//缺少参数
                return;
            }

            var url = this.is_temporary() ? 'http://web2.cgi.weiyun.com/temporary_file.fcg' : 'http://web2.cgi.weiyun.com/qdisk_upload.fcg',
                cmd = this.is_temporary() ? 'TemporaryFileDiskFileUpload' : 'DiskFileUpload';

            this._state_log.msg.push('start request_upload');
            if(data.filename.length >= 100){  //文件名长度大于等于100的时候采用post，tgw对于长文件的get请求会阻断
                request.xhr_post({
                    url: url,
                    cmd: cmd,
                    body: data,
                    cavil: true,
                    pb_v2: true
                })
                    .fail(function (msg, ret, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        __self.err_msg = msg;
                        __self.change_state('error', ret);//相册请求上传，激活错误状态
                    })
                    .ok(function (msg, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
                        rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
                        rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
                        $.extend(__self, rsp_body);
                        __self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
                        callback(rsp_body, data);
                    });
            }
            else{
                request.xhr_get({
                    url: url,
                    cmd: cmd,
                    body: data,
                    cavil: true,
                    pb_v2: true
                })
                    .fail(function (msg, ret, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        __self.err_msg = msg;
                        __self.change_state('error', ret);//相册请求上传，激活错误状态
                    })
                    .ok(function (msg, rsp_body, rsp_header) {
		                if(rsp_body && rsp_body.remain_flow_size && user.set_remain_flow_size) {
			                user.set_remain_flow_size(rsp_body.remain_flow_size);
		                }
                        console.log('pre_upload:', true, rsp_body.file_exist, data.filename);
                        rsp_body.server_name = https_tool.translate_host(rsp_body.server_name);
                        rsp_body.server_port = https_tool.translate_ftnup_port(rsp_body.server_port, upload_route.type);
                        $.extend(__self, rsp_body);
                        __self._state_log.msg.push('request_upload done ' + 'file_exit:' + rsp_body.file_exist);
                        callback(rsp_body, data);
                    });
            }
            

        });

        __Upload.interface('remove_file', function (delete_complete) {
            if (!this.file_id || this.pdir === -1) {
                return;
            }

            var node = all_file_map.get(this.file_id);
            if (node) {//从本地删除
                file_list.remove_nodes([node]);
            }

            remove.silent_remove(all_file_map.get(this.pdir), this.file_id, this.file_name, delete_complete || false);//从服务器删除
        });

        __Upload.interface('get_resume_param', function () {
            var ret = {
                server: this.server,
                port: this.port,
                check_key: this.check_key,
                file_key: this.file_key,
                file_sha: this.file_sha,
                path: this.path,
                filename: this.file_name,
                file_index: this.file_index,
                processed: this.processed,
                file_id: this.file_id,
                file_ctime: this.file_ctime,
                file_ver: this.file_ver,
                file_size: this.file_size  //新增filesize用于文件夹续传直接获取
            };
            $.extend(ret, {
                ppdir: this.ppdir,
                pdir: this.pdir,
                ppdir_name: this.ppdir_name,
                pdir_name: this.pdir_name
            });
            return ret;
        });

        /**
         * 自己能否暂停
         */
        __Upload.interface('can_pause_self', function () {
            return this.state === 'upload_file_update_process';
        });

        /**
         * 将节点插入到网盘中
         */
        __Upload.interface('prepend_to_disk', function () {
            if (!this.file_id || this.pdir === -1 || this.state === 'error') {//没有file_id 或者 pdir为相册 或者是出错就不插入了
                return;
            }
            this.push_done_file_id(this.file_id);
            var node = new FileNode({
                is_dir: false,
                id: this.file_id,
                name: this.new_name || this.filename || this.file_name,
                size: this.file_size,
                //先判断是否秒传，秒传就显示完成，再判断是否tpmini加速,APPBOX暂时屏蔽该功能
                cur_size: (constants.IS_APPBOX || this.file_exist) ? this.file_size : (this.tp_key ? 0 : this.file_size),
                create_time: this.file_ctime,
                modify_time: this.file_ctime,
                file_ver: this.file_ver,
                file_md5: this.file_md5,
                file_sha: this.file_sha,
                //增加tpmini加速信息,APPBOX暂时屏蔽该功能
                tp_key: constants.IS_APPBOX ? 0 : (this.tp_key || 0),
                tp_fail: false
            });
            node.pdir = this.pdir;
            upload_static.disk_route.prepend(node);
        });

        /**
         * 状态信息更新，相关信息同步更新(总进度信息)
         * @param t_type : 目标状态
         * @param del_local_id
         */
        __Upload.interface('update_state_info', function (t_type, del_local_id) {
            var me = this,
                has_size = me.file_size > 1,
                total_size = this.get_total_size(),
                passed_size = this.get_passed_size();

            //目标状态为上面状态，停止上传;
            if (-1 !== ' pause clear re_start '.indexOf(' ' + t_type + ' ')) {
                this.stop_upload();
            }
            //目标状态为上面状态，开始测速度
            if (this.upload_type !== 'upload_form' && -1 !== ' start_upload to_resume_continuee to_continuee re_start '.indexOf(' ' + t_type + ' ')) {
                speed_task.start();
            }

            //更新状态
            switch (t_type) {
                case('init'):
                {
                    if (has_size) {
                        total_size += me.file_size;
                    }
                    break;
                }
                case('re_start'):
                {
                    if (has_size) {
                        total_size += me.file_size;
                    }
                    break;
                }
                case('done'):
                {
                    if (has_size) {
                        passed_size += me.file_size;
                    }
                    break;
                }
                case('error'):
                {
                    if (has_size) {
                        total_size -= me.file_size;
                    }
                    break;
                }

                case('pause'):
                {
                    if (has_size) {
                        total_size -= me.file_size;
                    }
                    break;
                }
                case('to_continuee'):
                {
                    if (has_size) {
                        total_size += me.file_size;
                    }
                    break;
                }
            }
            //更新总量和passed量
            this.get_total_size(total_size);
            this.get_passed_size(passed_size);
        });

        /**
         * 停止上传 do nothing, 父类空实现，子类覆盖实现
         */
        __Upload.interface('stop_upload', function () {
        });

        /**
         * 出错后，能否重试
         */
        __Upload.interface('can_re_start', function () {
            //if (this.state === 'error' && ( this.error_type !== 'client' || msg.able_res_start(this.log_code) )) {
            if (this.state === 'error' ){
                if(msg.able_res_start(this.log_code) === false){
                    return false;
                }
                if( msg.able_res_start(this.log_code) || this.error_type !== 'client' ) {
                    return true;
                }
            }
            return false;
        });
        /**
         * 是否妙传
         */
        __Upload.interface('is_miaoc', function () {
            return false;
        });
        /**
         * 是否tpmini加速
         */
        __Upload.interface('is_tpmini', function () {
            return false;
        });

        /**
         * 是否是上传到中转站的文件
         */
        __Upload.interface('is_temporary', function () {
            //中转站下线，禁掉上传入口
            return false;
            //return !!this.temporary;
        });

        /**
         * 设置该上传任务是上传到中转站文件的
         */
        __Upload.interface('set_temporary', function (is_temporary) {
            this.temporary = is_temporary;
        });

        /**
         * 设置是否忽略上传到中转站
         */
        __Upload.interface('ignore_temporary_upload', function (ignore) {
            this.temporary_ignored = !!ignore;
        });
        /**
         * 是否忽略上传到中转站
         */
        __Upload.interface('is_temporary_ignored', function () {
            //下线中转站
            return true;
            //return !!this.temporary_ignored;
        });
        /**
         * 是否需要自动保存进度，防止断电等情况下
         */
        __Upload.interface('need_auto_save_process', function () {
            return false;
        });

        /**
         * 获取最大显示进度
         */
        __Upload.interface('fix_percent',function(percent,precision){
            //precision = precision || this.get_the_precision();
            //code by bondli fixed precision为0时的bug
            precision = precision !== undefined ? precision : this.get_the_precision();
            if(!this._max_size){
                this._max_size = 100 - (precision === 0 ? 1 : 1 / Math.pow(10,precision) );
            }
            //code by bondli 进度修改成0%开始
            percent = percent > this._max_size ? this._max_size : (percent > 0 ? percent.toFixed(precision) : 0);
            return percent;
        });

        /*********************************** 默认的状态 ********************************/
        upload_static.add_state.call(__Upload, 'wait', function () {

            this.get_queue().tail(this, function () {
                this.change_state('start');
            });

        });

        upload_static.add_state.call(__Upload, 'start', function () {
            this.get_belong_cache().push_curr_cache(this.del_local_id, this);
            var ret = this.validata && this.validata.run();
            if (ret) {
                //本地校验出错，不必重试.
                this.error_type = 'client';     //是本地出错.
                if($.isArray(ret)) {
                    this.change_state('error', ret[0], ret[1]);//本地出错，激活错误状态
                } else {
                    this.change_state('error', ret);//本地出错，激活错误状态
                }
                return false;
            }
        });

        upload_static.add_state.call(__Upload, 'start_upload', function () {
            //code by bondli 增加上传开始时间点记录
            this.start_time = +new Date();
        });

        upload_static.add_state.call(__Upload, 'error', function (error_code,error_step) {
            if( $.isFunction(error_code) ){
                error_code = error_code();
            }
            if( $.isArray(error_code) ){
                this.code = error_code[0];
                this.log_code = error_code[1];
            } else if(!!parseInt(error_code)) {
                this.code = this.log_code = error_code;
            } else {
	            this.code = error_step;
	            this.log_code = error_code;
            }
            this.error_step = error_step;//控件调试位置
            this._is_request_upload = false;
            this.stop_upload();
            this.destroy(true);
            this.plus_info('error');
            this.prepend_to_disk();
            this.events.nex_task.call(this); //错误的时候继续下一个任务.
            if (this.time) {
                this.time.clear();
            }
            //如果是视频上传错误，这里需要增加提示
            if(this.log_code === 1000009){
                if (!View.upbox_tips[0].has_show_tips) {
                    //任务栏最大化
                    View.max();
                    var tips = '为了保护知识产权，遵守相关法律法规，我们暂时停止了视频上传服务，具体开放时间敬请关注腾讯微云官方网站。';
                    View.upbox_tips.addClass('upbox-video-err').html(tips).show()[0].has_show_tips = true;
                }
            }

	        //日志上报
			var console_log = [];
	        console_log.push('error --------> code: ' + this.code + ', log_code: ' + this.log_code + (this.error_step ? (', step: ' + this.error_step) : ''));
	        if(this._state_log && this._state_log.msg && this._state_log.msg.length) {
		        console_log.push('error --------> state_log: ' + this._state_log.msg.join(', '));
	        }
	        if(this.err_msg && this.err_msg != 'undefined') {
		        console_log.push('error --------> err_msg: ' + this.err_msg);
	        }
	        console_log.push(
			    'error --------> upload_type: ' + this.upload_type,
		        'error --------> start_time: ' + this.start_time,
		        'error --------> file_name: ' + this.file_name,
		        'error --------> file_type: ' + this.file_type,
		        'error --------> path: ' + this.path
	        );
	        if(this.inside_upload_ip) {
		        console_log.push('error --------> upload_ip: ' + this.inside_upload_ip);
	        }
	        if(this.check_key) {
		        console_log.push('error --------> upload_key: ' + this.check_key);
	        }
	        if(this.ukeyid) {
		        console_log.push('error --------> ukeyid: ' + this.ukeyid);
	        }
	        //上报模调、错误码和错误信息到罗盘
	        if(this.upload_type === 'upload_html5_pro') {
		        logger.write(console_log, 'upload_html5_pro_error', this.log_code);
	        } else {
		        logger.write(console_log, 'upload_error', this.log_code);
	        }

	        /*reportStore({
		        t_action: 2,
		        t_err_code: this.code,
		        t_report_time: parseInt(new Date().getTime() / 1000),
		        t_file_name: this.file_name,
		        t_file_type: this.file_type
	        });*/
        });

        upload_static.add_state.call(__Upload, 'pause', function () {
            //上报统计用.
            this.pause_mode = 1;
            this.destroy(true);
            this.plus_info('pause');
            this.events.nex_task.call(this);//暂停的时候，执行下一个
        });

        upload_static.add_state.call(__Upload, 'to_continuee', function () {
            //记录任务的开始时间
            this.startTime=+new Date();
            this.start_time=+new Date();
            this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
            //做为下一个执行，准备执行
            this.get_queue().head(this, function () {
                this.get_belong_cache().push_curr_cache(this.del_local_id, this);
                this.resume_file_local();
            });
        });

        upload_static.add_state.call(__Upload, 'continuee', function () {});

        //页面加载的时候，停留在暂停状态
        upload_static.add_state.call(__Upload, 'resume_pause', function (obj) {
            if (obj) {
                $.extend(this, obj); //缓存在本地的属性，复制上去
                if (obj.local_id) {
                    this.set_local_id(obj.local_id);
                }
            }
            this.plus_info('pause');
        });

        upload_static.add_state.call(__Upload, 'to_resume_continuee', function () {
            //记录任务的开始时间
            this.startTime=+new Date();
            this.start_time=+new Date();
            this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
            //做为下一个执行，准备执行
            this.get_queue().head(this, function () {
                this.pause_mode = 1;
                //this.view.start();
                this.view.invoke_state('start');
                this.get_belong_cache().push_curr_cache(this.del_local_id, this);
                if (this.file_type === upload_static.FILE_TYPE) {
                    this.set_local_id(this.resume_file_remote());
                } else {
                    this.resume_file_remote();
                }
            });
        });

        upload_static.add_state.call(__Upload, 'resume_continuee', function () {});


        upload_static.add_state.call(__Upload, 'file_sign_update_process', functional.throttle(function (event_param) {
            if(this.is_pre_file_sining) {
                return;
            }


            
            //低位大小：控件返回的是有符号的32位数值，当大于2G时会变成负数，然后向0累加，所以当负数时加4G就是实现的2G向4G累加的过程
            var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量
            if (event_param.ProcessedH) { //如果是计算大文件
                //ProcessedH 高位，单位是4G，所以乘以G4
                processlow = event_param.ProcessedH * G4 + processlow;
            }

            this.file_sign_update_process = processlow;

        }), 1000);


        upload_static.add_state.call(__Upload, 'file_sign_done', function (e_param) {
            this._state_log.msg.push('file_sign_done');
            if (this.file_sign_done_flag === true) {    //如果已经回调过扫描完成
                return;
            }
            if (!this.get_cache()[ this.local_id ]) {//已经被删除
                return;
            }

            this.file_sign_done_flag = true;
            //增加CRC32的值
            var crc32 = '';
            try{
                crc32 = e_param.CRC32Value;
            }
            catch(e){};

            //存起来，重新上传时不需要再file_sign
            this.file_md5 = e_param.Md5;
            this.file_sha = e_param.SHA;

            var data = this.get_upload_param.call(this, e_param.Md5, e_param.SHA, crc32),
                __self = this;
            if(this._srv_rsp_body) {
                this.change_state('start_upload', this._srv_rsp_body, data);
                // yuyanghe 2014-1-13 加入数据上报
                stat_log.upload_stat_report_41(this,get_plugin_version(),'UPLOAD_ACTIONTYPE_ID','UPLOAD_PRE_SUBACTIONTYPE_ID','UPLOAD_PRE_THRACTIONTYPE_ID');

                return;
            }

            if(this._is_request_upload) {//正在预扫描
                this.is_pre_file_sining = false;
                return;
            }

            this._is_request_upload = true;
            this.request_upload(data, function (rsp_body, data) {

                __self._is_request_upload = false;
                if(__self.is_pre_file_sining) {
                    __self._srv_rsp_body = rsp_body;
                    __self.is_pre_file_sining = false;
                    return;
                }
                   __self.change_state('start_upload', rsp_body, data);
                // yuyanghe 2014-1-13 加入数据上报
                stat_log.upload_stat_report_41(__self,get_plugin_version(),'UPLOAD_ACTIONTYPE_ID','UPLOAD_PRE_SUBACTIONTYPE_ID','UPLOAD_PRE_THRACTIONTYPE_ID');

            });
        });


        upload_static.add_state.call(__Upload, 'upload_file_update_process', functional.throttle(function (event_param) {
            /*
            this.test_time = this.test_time - (+new Date());
            console.debug('call start_upload by active : ',this.test_time, this.del_local_id);
            */
            //大于4G的逻辑 todo. 跟扫描一样.
            var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量

            if (event_param.ProcessedH) { //如果是计算大文件
                //ProcessedH 高位，单位是4G，所以乘以G4
                processlow = event_param.ProcessedH * G4 + processlow;
            }
            this.processed = processlow;

            this.file_index = event_param.FileIndex;

            //如果需要自动保存进度,并且每5%的进度就保存一次
            var range = (this.processed / this.file_size * 100) % 5;
            if(this.need_auto_save_process() && (range>=0 && range<1)){
                var resume_files = {'tasks': [], 'folder_tasks': [], 'down_tasks': []},
                    unit = this.get_resume_param();
                if (unit) {
                    resume_files.tasks.push(unit);
                }
                upload_event.trigger('set_resume_store', resume_files);
            }
        }), 1000);


        upload_static.add_state.call(__Upload, 'done', function (event_param) {
            this.end_time = +new Date();//结束时间
            var node = all_file_map.get(this.pdir);

            if (node) {
                node.set_dirty(true);    //已有更新, 重新拉取文件夹下的内容。
            }

            if (this.time) {
                this.time.clear();
            }

            if (this.is_miaoc()) {//妙传文件
                var maioc_speed = this.file_size / Math.ceil((this.end_time - this.start_time) / 1000);
                speed_task.set_maioc(maioc_speed);
            }

            this.destroy(true);
            this.plus_info('done');
            //修复bug ： 取消控件失效;
            this.minus_info('error');
            this.minus_info('pause');
            this.release_plugin();
            this.prepend_to_disk();
            this.dispatch_event();
            this.after_done();
            upload_event.trigger('upload_done', this);
            this.events.nex_task.call(this);//一个任务完成，执行下一个任务，flag为true时表示文件已完成上传，此时更新队列.
        });

        //重新上传一次，网络超时，错误码10000出现的时候替换成再来一次上传
        upload_static.add_state.call(__Upload, 're_try', function () {
            this.release_plugin();
            //console.log('auto retry...');
            this.set_retry();
            this.remove_file(true); //删除已经生成的幽灵文件
            this.file_sign_done_flag = false; //设置扫描状态为未扫描
            this.file_size = this.get_file_size(); //重新计算文件大小
            this.change_state('start');
        });

        /**
         * 上传完成后做的一些特殊处理
         */
        __Upload.interface('after_done', function(){ });

        /**
         * 是否重新来一次上传
         */
        __Upload.interface('get_is_retry', function () { });

        /**
         * 设置重新来一次上传
         */
        __Upload.interface('set_retry', function () { });

        /**
         * 删除任务
         * @param flag: 删除远程文件
         * @param from_all_clear: 调用者是是全部清除操作
         */
        upload_static.add_events.call(__Upload, 'clear', function (flag, from_all_clear) {

            this.update_state_info('clear');

            this.get_queue().remove(this.del_local_id);

            if (!flag) {
                this.remove_file();
            }

            this.destroy();

            if (!from_all_clear) {   //如果状态不等于wait, 表示正在删除正在上传的文件. 此时继续下一个文件.
                if (this.old_state === 'pause' || this.old_state === 'resume_pause') {
                    this.minus_info('pause');
                } else if (this.old_state === 'error') {
                    this.minus_info('error');
                }
                this.when_change_state('clear');
                //this.view.clear();
                this.view.invoke_state('clear');
                this.events.nex_task.call(this);//删除任务后，执行一个任务
            }
        });
        /**
         * 重试任务
         * @param by_user true: 用户点击行为； false: 因为网络延迟，有程序自动重试;
         */
        upload_static.add_events.call(__Upload, 're_start', function (by_user) {
            if (by_user) {
                //已失败的任务，重试任务;需要，
                // 1：将其放入正在运行数组中
                // 2：重置local_id
                // 3：更新info信息；
                this.update_state_info('re_start');
                this.set_local_id(this.local_id);
                this.get_belong_cache().push_curr_cache(this.del_local_id, this);
                this.state = 'start';
            }
            this.re_start_action();

            if (this.state === 'start') {
                //this.view.re_start(by_user);
                this.view.invoke_state('re_start');
                this.when_change_state('re_start');
            }

        });
        /**
         * 继续下一个任务
         */
        upload_static.add_events.call(__Upload, 'nex_task', function () {
            this.call_next_task();
        });

        return aop_wrap_log(__Upload);

    })();


    return Upload;

});