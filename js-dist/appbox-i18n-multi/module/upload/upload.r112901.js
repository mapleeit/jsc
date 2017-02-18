//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/upload/upload.r112901",["lib","common","$","disk","main","i18n","album"],function(require,exports,module){

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
//upload/src/Upload_class.js
//upload/src/aop_wrap_log.js
//upload/src/download/appbox.js
//upload/src/drag_upload_active.js
//upload/src/drag_upload_html5.js
//upload/src/event.js
//upload/src/msg.js
//upload/src/select_folder/dropdown_menu.js
//upload/src/select_folder/file_dir_list.js
//upload/src/select_folder/file_path_parser.js
//upload/src/select_folder/get_up_folder_files.js
//upload/src/select_folder/get_up_folder_keys.js
//upload/src/select_folder/loading.js
//upload/src/select_folder/photo_group.js
//upload/src/select_folder/select_folder.js
//upload/src/select_folder/select_folder_msg.js
//upload/src/select_folder/select_folder_view.js
//upload/src/select_folder/upload_4g_validata.js
//upload/src/select_folder/upload_folder_validata.js
//upload/src/speed/count_box.js
//upload/src/speed/download.js
//upload/src/speed/speed_task.js
//upload/src/speed/upload.js
//upload/src/tool/bar_info.js
//upload/src/tool/upload_cache.js
//upload/src/tool/upload_queue.js
//upload/src/tool/upload_static.js
//upload/src/upload_flash_start.js
//upload/src/upload_folder_appbox.js
//upload/src/upload_form_start.js
//upload/src/upload_global_function.js
//upload/src/upload_plugin/upload_plugin.js
//upload/src/upload_plugin/upload_plugin_folder.js
//upload/src/upload_plugin_start.js
//upload/src/upload_route.js
//upload/src/upload_tips.js
//upload/src/upload_validata.js
//upload/src/view.js
//upload/src/view_type/empty.js
//upload/src/view_type/folder.js
//upload/src/view_type/webkit_down.js
//upload/src/select_folder/loading.tmpl.html
//upload/src/select_folder/photo_group.tmpl.html
//upload/src/select_folder/select_folder.tmpl.html
//upload/src/upload.tmpl.html
//upload/src/upload_button.tmpl.html

//js file list:
//upload/src/Upload_class.js
//upload/src/aop_wrap_log.js
//upload/src/download/appbox.js
//upload/src/drag_upload_active.js
//upload/src/drag_upload_html5.js
//upload/src/event.js
//upload/src/msg.js
//upload/src/select_folder/dropdown_menu.js
//upload/src/select_folder/file_dir_list.js
//upload/src/select_folder/file_path_parser.js
//upload/src/select_folder/get_up_folder_files.js
//upload/src/select_folder/get_up_folder_keys.js
//upload/src/select_folder/loading.js
//upload/src/select_folder/photo_group.js
//upload/src/select_folder/select_folder.js
//upload/src/select_folder/select_folder_msg.js
//upload/src/select_folder/select_folder_view.js
//upload/src/select_folder/upload_4g_validata.js
//upload/src/select_folder/upload_folder_validata.js
//upload/src/speed/count_box.js
//upload/src/speed/download.js
//upload/src/speed/speed_task.js
//upload/src/speed/upload.js
//upload/src/tool/bar_info.js
//upload/src/tool/upload_cache.js
//upload/src/tool/upload_queue.js
//upload/src/tool/upload_static.js
//upload/src/upload_flash_start.js
//upload/src/upload_folder_appbox.js
//upload/src/upload_form_start.js
//upload/src/upload_global_function.js
//upload/src/upload_plugin/upload_plugin.js
//upload/src/upload_plugin/upload_plugin_folder.js
//upload/src/upload_plugin_start.js
//upload/src/upload_route.js
//upload/src/upload_tips.js
//upload/src/upload_validata.js
//upload/src/view.js
//upload/src/view_type/empty.js
//upload/src/view_type/folder.js
//upload/src/view_type/webkit_down.js
define.pack("./Upload_class",["lib","common","$","disk","./view","./msg","./upload_route","./speed.speed_task","./aop_wrap_log","./tool.upload_static","./tool.upload_cache","./tool.bar_info","./select_folder.photo_group","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        disk_mod = require('disk'),

        c = lib.get('./console').namespace('upload'),
        Class = lib.get('./class'),

        functional = common.get('./util.functional'),
        file_type_map = common.get('./file.file_type_map'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        file_object = common.get('./file.file_object'),

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

        upload_event = common.get('./global.global_event').namespace('upload2'),
        dataChanged_event = common.get('./global.global_event').namespace('datasource.photo'),
        main = require('main').get('./main');


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
            
            me.upload_type = upload_route.type;
            me.file_type = upload_static.FILE_TYPE;//文件类型
            me.view = View.add(me, view_key);
            if (dir_id_paths && dir_id_paths.length) {//存储目录路径信息
                dir_cache[ dir_id_paths[ dir_id_paths.length - 1 ] ] = {'paths': dir_paths, 'ids': dir_id_paths  };
            }
            me.op_type = op_type || upload_static.OP_TYPES.UPLOAD;//任务类型
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
            if (me.pdir == constants.UPLOAD_DIR_PHOTO) {//相册
                main.switch_mod('photo');//菜单打开相册
                try{
                    $('iframe[name=photo_bridge_iframe]')[0].contentWindow.WEIYUN_WEB.View.showPhotostream(1,1);
                }catch(xe){
                    c.warn('open_to_target :',xe);
                }

            } else {//网盘
                main.switch_mod('disk', { reload: 0 });//菜单打开网盘
                if (!file_list.is_first_loaded()) {
                    file_list.load_root(false, false).done(function () {
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
                        if(this.file_id) upload_event.trigger('set_curr_upload_file_id', this.file_id);
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
                    //c.debug(file);
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
            // bugfix: 48680617【微云web】接收到本地的QQ文件”上传到微云“，由于文件名多个”.“导致提示文件名不合法
            var re_file_name = this.file_name.replace(/(^\.*|\.*$)/g, '');

            //code by bondli 增加支持相册上传参数，相册设置的upload_to为-1
            if (this.pdir == constants.UPLOAD_DIR_PHOTO) {
                return {
                    //module: 1,
                    upload_type: 0,
                    file_md5: md5,
                    file_sha: sha,
                    file_size: this.file_size + '',
                    file_attr: {
                        file_name: (re_file_name)
                        /*,
                        file_note: '',
                        file_mtime: file_mtime
                        */
                    }
                    /*,
                    op_attr: {
                        up_dev_mac: ''
                    }
                    */
                };
            }
            else {
                return {
                    ppdir_key: this.ppdir,
                    pdir_key: this.pdir,
                    upload_type: 0,
                    file_md5: md5,
                    file_sha: sha,
                    file_size: this.file_size + '',
                    file_attr: {
                        file_name: encodeURIComponent(re_file_name)
                        /*,
                        file_note: '',
                        file_mtime: file_mtime
                        */
                    }
                };
            }


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
                return  upload_static.get_error_msg(this.log_code, msg_type,'download_error');
            }
            return upload_static.get_error_msg(this.log_code, msg_type,null,this.error_step);
        });

        //just_curr_cache 标识仅仅清除 运行缓存中的对象
        __Upload.interface('destroy', function (just_curr_cache) {
            if (!just_curr_cache) {
                this.get_belong_cache().pop_cache(this.local_id);
            }
            this.get_belong_cache().pop_curr_cache(this.del_local_id);
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
            this.group_id = photo_group.get_photo_group_id();

            if(this.group_id > 1){
                data.group_id = this.group_id - 0; //整型，相册分组ID
            }
            data.upload_type = (__self.is_plugin_upload() ? 0 : 1)//整型,上传方式, 0代表传统控件上传,1非控件上传
            if( data.file_attr && data.file_attr.file_name ){//2.0的file_name变更为外层
                data.file_name = data.file_attr.file_name;
            }
            if( data.file_size ){//2.0的file_size变更为int类型
                data.file_size -= 0;
            }
            request.get({
                url: 'http://web2.cgi.weiyun.com/uploadv2.fcg',
                cmd: 'upload',
                body: data,
                cavil: true
            })
                .fail(function (msg, ret, rsp_body, rsp_header) {
                    __self.change_state('error', ret);//相册请求上传，激活错误状态
                })
                .ok(function (msg, rsp_body, rsp_header) {
                    $.extend(__self, rsp_body);
                    callback(rsp_body, data);
                });

        });
        __Upload.interface('request_upload', function (data, callback) {

            var __self = this;
            if( upload_route.is_ku20() && file_object.is_image(__self.get_file_name() ) ){//
                __self.photo_request_upload(data,callback);
                return;
            }
            //code by bondli 增加支持相册上传参数，相册设置的upload_to为-1
            var url = 'http://web.cgi.weiyun.com/upload.fcg';
            if (this.pdir == constants.UPLOAD_DIR_PHOTO) {
                url += '?module=1';
            }
            request.get({
                url: url,
                cmd: 'file_upload',
                body: data,
                cavil: true
            })
                .fail(function (msg, ret, rsp_body, rsp_header) {
                    __self.change_state('error', ret);//相册请求上传，激活错误状态
                })
                .ok(function (msg, rsp_body, rsp_header) {
                    $.extend(__self, rsp_body);
                    callback(rsp_body, data);
                });

        });

        __Upload.interface('remove_file', function () {
            if (!this.file_id || this.pdir === -1) {
                return;
            }

            var node = all_file_map.get(this.file_id);
            if (node) {//从本地删除
                file_list.remove_nodes([node]);
            }

            remove.silent_remove(all_file_map.get(this.pdir), this.file_id, this.file_name);//从服务器删除
        });

        __Upload.interface('get_resume_param', function () {
            var ret = {
                server: this.server,
                port: this.port,
                check_key: this.check_key,
                file_key: this.file_key,
                file_sha: this.file_sha,
                path: this.path,
                file_name: this.file_name,
                file_index: this.file_index,
                processed: this.processed,
                file_id: this.file_id,
                file_ctime: this.file_ctime,
                file_ver: this.file_ver
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
            if (!this.file_id || this.pdir === -1) {//没有file_id 或者 pdir为相册
                return;
            }
            this.push_done_file_id(this.file_id);
            var node = new FileNode({
                is_dir: false,
                id: this.file_id,
                name: this.new_name || this.file_name,
                size: this.file_size,
                cur_size: this.file_size,
                create_time: this.file_ctime,
                modify_time: this.file_ctime,
                file_ver: this.file_ver,
                file_md5: this.file_md5,
                file_sha: this.file_sha
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
            if (-1 !== ' pause clear re_start '.indexOf(t_type)) {
                this.stop_upload();
            }
            //目标状态为上面状态，开始测速度
            if (this.upload_type !== 'upload_form' && -1 !== ' start to_resume_continuee to_continuee re_start '.indexOf(t_type)) {
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
                this.change_state('error', ret);//本地出错，激活错误状态
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
            } else {
                this.code = this.log_code = error_code;
            }
            this.error_step = error_step;//控件调试位置
            this.stop_upload();
            this.destroy(true);
            this.plus_info('error');
            this.prepend_to_disk();
            this.events.nex_task.call(this); //错误的时候继续下一个任务.
            if (this.time) {
                this.time.clear();
            }
        });

        upload_static.add_state.call(__Upload, 'pause', function () {
            //上报统计用.
            this.pause_mode = 1;
            this.destroy(true);
            this.plus_info('pause');
            this.events.nex_task.call(this);//暂停的时候，执行下一个
        });

        upload_static.add_state.call(__Upload, 'to_continuee', function () {
            //做为下一个执行，准备执行
            this.get_queue().head(this, function () {
                this.get_belong_cache().push_curr_cache(this.del_local_id, this);
                this.resume_file_local();
            });
        });

        upload_static.add_state.call(__Upload, 'continuee', function () {

        });

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

        upload_static.add_state.call(__Upload, 'resume_continuee', function () { });


        upload_static.add_state.call(__Upload, 'file_sign_update_process', functional.throttle(function (event_param) {
            
            //低位大小：控件返回的是有符号的32位数值，当大于2G时会变成负数，然后向0累加，所以当负数时加4G就是实现的2G向4G累加的过程
            var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量
            if (event_param.ProcessedH) { //如果是计算大文件
                //ProcessedH 高位，单位是4G，所以乘以G4
                processlow = event_param.ProcessedH * G4 + processlow;
            }

            this.file_sign_update_process = processlow;

        }), 1000);


        upload_static.add_state.call(__Upload, 'file_sign_done', function (e_param) {
            if (this.file_sign_done_flag === true) {    //如果已经回调过扫描完成
                return;
            }
            if (!this.get_cache()[ this.local_id ]) {//已经被删除
                return;
            }

            this.file_sign_done_flag = true;
            var data = this.get_upload_param.call(this, e_param.Md5, e_param.SHA),
                __self = this;
            this.request_upload(data, function (rsp_body, data) {
                __self.change_state('start_upload', rsp_body, data);
            });
        });


        upload_static.add_state.call(__Upload, 'upload_file_update_process', functional.throttle(function (event_param) {
            /*
            this.test_time = this.test_time - (+new Date());
            c.debug('call start_upload by active : ',this.test_time, this.del_local_id);
            */
            //大于4G的逻辑 todo. 跟扫描一样.
            var processlow = event_param.Processed < 0 ? G4 + event_param.Processed : event_param.Processed; // todo 4G 常量

            if (event_param.ProcessedH) { //如果是计算大文件
                //ProcessedH 高位，单位是4G，所以乘以G4
                processlow = event_param.ProcessedH * G4 + processlow;
            }
            this.processed = processlow;

            this.file_index = event_param.FileIndex;
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
            this.events.nex_task.call(this);//一个任务完成，执行下一个任务，flag为true时表示文件已完成上传，此时更新队列.
        });

        //重新上传一次，网络超时，错误码10000出现的时候替换成再来一次上传
        upload_static.add_state.call(__Upload, 're_try', function () {
            this.release_plugin();
            //c.log('auto retry...');
            this.set_retry();
            this.remove_file(); //删除已经生成的幽灵文件
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

});define.pack("./aop_wrap_log",["$","lib","common","i18n","./tool.upload_static","./tool.upload_cache","./upload_route"],function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        c = lib.get('./console').namespace('upload2'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        functional = common.get('./util.functional'),
        plugin_detect = common.get('./util.plugin_detect'),
        user_log = common.get('./user_log'),

        constants = common.get('./constants'),

        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        upload_route = require('./upload_route'),

        normal_code = [ //正常逻辑错误,当成功上报
            1000001, 1000002, 1000003, 1000004,1000005,1000006,1000007,1000008,
            1024, 1053, 1083, 1051, 1028, 1088, 100027, 8, 16, 17, 1029, 101, 102,
            -5950, 2, 3,  //文件被选入了上传队列中，但是用户在文件还没有被扫描的时候就删除了
            -5999, 6,  //文件正在上传过程中被删除了
            32252995,   //上传过程中删除了文件所在目录
            1019,   //扫描过程中删除了上传目录，导致CGI返回了错误
            92260005,  //文件上传过程中被修改
            1016,    //新用户一进页面就上传图片到相册
            32,     //另一个程序正在使用此文件，进程无法访问
            21,      //用户传U盘中的文件，U盘不稳定，导致控件读取文件失败
            1392,     //用户文件或目录损坏，无法读取
            53, 87,   //找不到网络,网络文件不可读
            5        //文件没有读取权限，估计是被其他程序占用
        ],
        get_plugin_version = function () { //获取控件的版本号
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
        },

        wrap_log = function (Upload) {

            Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function () {
                if (!this.is_upload()) {
                    return;
                }
                var cache = this.get_cache(),
                    process = cache[this.local_id];

                if (!process) {    //删除上传错误的, 不上报
                    return; //这里要改;
                }
                if (process.state === 'wait') {    //还未开始上传的.
                    return user_log('DISK_UPLOAD_CANCEL'); //;
                }

                return user_log('DISK_UPLOAD_HAS_DATA_CANCEL');  //已经开始上传的.

            });

            //暂停
            Upload.getPrototype().dom_events.click_pause = functional.before(Upload.getPrototype().dom_events.click_pause, function () {
                //user_log('UPLOAD_FILE_MANAGER_PAUSE');
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_PAUSE');
                }
                else{
                    user_log('DOWNLOAD_FILE_MANAGER_PAUSE');
                }
            });

            //重试
            Upload.getPrototype().dom_events.click_continuee = functional.after(Upload.getPrototype().dom_events.click_continuee, function () {
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_CONTINUE');
                }
            });

            //续传
            Upload.getPrototype().dom_events.click_resume_continuee = functional.after(Upload.getPrototype().dom_events.click_resume_continuee, function () {
                user_log('UPLOAD_FILE_MANAGER_RESUME');
            });

            //展开上传管理器
            Static.dom_events.click_to_max = functional.after(Static.dom_events.click_to_max, function () {
                user_log('UPLOAD_FILE_MANAGER_OPEN', 0);
            });

            //收拢上传管理器
            Static.dom_events.click_to_min = functional.after(Static.dom_events.click_to_min, function () {
                user_log('UPLOAD_FILE_MANAGER_CLOSE', 0);
            });

            Static.dom_events.click_clear_all = functional.after(Static.dom_events.click_clear_all, function () {
                var text = Cache.get_close_btn_text();
                if (text === _(l_key,'全部取消') || text === _(l_key,'取消')) {//全部取消-取消
                    user_log('UPLOAD_FILE_MANAGER_CANCEL', 0);
                } else {//完成
                    user_log('UPLOAD_FILE_MANAGER_DONE');
                }
            });
            //全部重试统计
            Static.click_re_try_all = functional.after(Static.click_re_try_all, function () {
                user_log('UPLOAD_FILE_MANAGER_ALL_RETRY', 0);
            });

            Upload.getPrototype().states.error = functional.after(Upload.getPrototype().states.error, function (error_code) {
                if (!this.is_upload()) {
                    return;
                }
                var rpt_data = {
                    "extInt1": this.start_time ? (+new Date()) - this.start_time : 0,
                    "extInt2": this.log_code,
                    "extInt3": this.file_type,//1:文件 2:文件夹
                    "str_file_size": this.file_size + '',
                    //"app_version": get_plugin_version(), //code by 20131014 增加控件版本上报
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',//get_plugin_version(),
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name //这个字段被转化成int，所以展示不处理，需要更换
                };
                user_log(
                    this.upload_type,
                    $.inArray(this.log_code, normal_code) > -1 ? 0 : this.log_code,
                    rpt_data,
                    {"weiyun_ver": get_plugin_version()} //code by 20131014 增加控件版本上报
                );
            });

            Upload.getPrototype().states.done = functional.after(Upload.getPrototype().states.done, function (error_code) {
                if (!this.is_upload()) {
                    return;
                }
                //上传文件夹，不上报
                if (this.is_upload_folder()){
                    return;
                }
                var ret,
                    is_file_exit;

                if (this.is_miaoc()) {
                    is_file_exit = true;
                }

                if (is_file_exit) {
                    ret = 30000002;
                } else if (this.pause_mode === 1) {
                    ret = 30000003;
                } else {
                    ret = 30000001;
                }

                user_log(this.upload_type, 0, {  //需要上报参数：文件后缀，耗时，文件大小，采用的上传类型，返回状态
                    "extInt1": is_file_exit ? 0 : (+new Date() - this.start_time),//秒传时间为0
                    "extInt2": ret,
                    "str_file_size": this.file_size + '',
                    
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name, //这个字段被转化成int，所以展示不处理，需要更换
                    "subop": this.upload_type
                },{
                    "weiyun_ver": get_plugin_version() //code by 20131014 增加控件版本上报
                });


            });
            return Upload;
        };


    return function (Upload) {
        return wrap_log(Upload);
    };

});/**
 * appbox下载控件组件
 * @author trump
 * @date 13-3-1
 */
define.pack("./download.appbox",["$","lib","common","i18n","./Upload_class","./tool.upload_static","./tool.upload_cache","./view"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        console = lib.get('./console'),
        common = require('common'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        file_type_map = common.get('./file.file_type_map'),
        functional = common.get('./util.functional'),
        download_route,

        Class = require('./Upload_class'),
        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        view = require('./view');

    require.async('download_route', function (mod) {
        download_route = mod.get('./download_route');
    });

    var Down = Class.sub(function (e) {
        var me = this;
        me.local_id = me.del_local_id = e.task_id;//任务ID
        me.file_name = e.file_name;//文件名
        me.file_size = functional.try_it(function(){//文件大小
            return e.file_size - 0;
        })  || 0;
        me.is_package_size = (me.file_size <= 1);//标识打包下载
        me.real_target_path = e.target_path;//下载的本地目录

        (function(path) {
            var paths = path.split('\\'),
                dir_name = paths[paths.length-2];
            if(dir_name === 'Desktop'){
                paths[paths.length-2] = dir_name = _(l_key,'桌面');
            }
            me.dir_name = dir_name;//本地的目录名
            me.target_path = paths.join('\\');//本地的目录路径
        })(e.target_path);

        me.file_thum_url = e.file_thum_url;// 待确认
        me.cover_file = e.cover_file;//是否已经下载过，做覆盖下载
        me.validata = null;
        me.percent = '0%';  //默认进度
        me.init('', '', Cache.default_down_cache_key, 'webkit_down', Static.OP_TYPES.DOWN);
        me.startTime = (+new Date());
    });
    var prototype_method = {
        /**
         * 覆盖基类方法 下载不需要插入网盘
         * @returns {boolean}
         */
        prepend_to_disk: function(){
            return false;
        },
        /**
         * 覆盖基类方法 下载暂时不能重试
         * @returns {boolean}
         */
        can_re_start: function(){
            return false;
        },
        /**
         * 是否打包下载
         */
        is_package: function () {
            return this.is_package_size;
        },
        /**
         * 删除下载
         */
        remove_file: function () {
            download_route && download_route.abort_download(this.local_id);
        },
        /**
         * 获取文件类型
         */
        get_file_type: function () {
            return file_type_map.get_type_by_ext(this.file_thum_url.split('-')[1]);
        },
        /**
         * 获取下载文件大小
         */
        get_file_size: function () {
            return this.file_size;
        },
        /**
         * 任务调度方法 在下载中什么也不做
         */
        call_next_task: $.noop,
        /**
         * 打开至目的地
         */
        open_to_target: function () {
            download_route && download_route.open_file_directory(this.local_id, this.real_target_path, this.file_name);
        }
    };
    for(var key in prototype_method){
        Down.interface(key, prototype_method[key]);
    }

    /**
     * 暂停下载
     */
    Class.getPrototype().dom_events.click_pause = 
        functional.before(Class.getPrototype().dom_events.click_pause,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('pause:'+taskid);
                window.external.PauseDownload(taskid);
                //return false;
            };
        });

    /**
     * 继续下载
     */
    Class.getPrototype().dom_events.click_continuee = 
        functional.before(Class.getPrototype().dom_events.click_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('continuee:'+taskid);
                window.external.ResumeDownload(taskid);
                //return false;
            };
        });

    /**
     * 从缓存中续传
     *
    Class.getPrototype().dom_events.click_resume_continuee = 
        functional.before(Class.getPrototype().dom_events.click_resume_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('resume continuee:'+taskid);
                window.external.ResumeDownload(taskid);
                return false;
            };
        });
    */


    Down.interface('states', $.extend({}, Class.getPrototype().states));
    /**
     * 预备下载
     */
    Down.interface('states.start', $.noop);
    /**
     * 下载中
     */
    Down.interface('states.processing', function (percent, speed) {
        if(!this.is_package()){//打包下载暂时不更新进度
            this.percent = parseInt(percent);
            this.processed = ( (this.file_size * this.percent) / 100 );
        }
    });

    /**
     * 获取下载参数，续传需要
     */
    Down.interface('get_resume_param', function () {
        var ret = {
            task_id: this.local_id,
            file_name: this.file_name,
            file_size: this.file_size,
            target_path: this.real_target_path,
            file_thum_url: this.file_thum_url,
            cover_file: this.cover_file
        };
        return ret;
    });

    /*
    var add_resume = function (files) { //断点续传
        //console.log('add_resume:'+files);
        if(files.length){
            view.show();
        }
        $.each(files, function () {
            var obj = this;    //转化store中读取的记录
            var e = {
                'task_id': obj.task_id,
                'file_name': obj.file_name,
                'file_size': obj.file_size,
                'target_path': obj.target_path,
                'file_thum_url': obj.file_thum_url,
                'cover_file': obj.cover_file
            };
            var down_obj = Down.getInstance(e); //生成下载对象
            functional.try_it(function () {
                down_obj.change_state('resume_pause', obj);   //状态转为续传
            });
        });

    };
    */


    return {
        /**
         * 创建下载对象
         * 下载对象默认为 状态默认为开始
         * @param e
         */
        create: function (e) {
            view.show();
            Down.getInstance(e).change_state('start');
        }
        //,add_resume: add_resume
    };
});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */

define.pack("./drag_upload_active",["lib","common","$","i18n"],function (require, exports, module) {

        var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        functional = common.get( './util.functional' ),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        console = lib.get('./console').namespace('drag_upload_active'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        constants = common.get('./constants');


        var parent;
        var active_event = {
            mouse_down: false
        };
        var plugin = functional.try_it(function(){
            var plugin = new ActiveXObject("TXGYMailActiveX.ScreenCapture");
            var plugin_name = plugin.GetDLLFileName();
            var $obj;

            if ( plugin_name.indexOf("_2.dll") > -1 ){
                $obj = $( '<object classid="CLSID:B0F77C07-8507-4AB9-B130-CC882FDDC046" width=100% height=100%>' );
            }else{
                $obj = $( '<object classid="CLSID:F4BA5508-8AB7-45C1-8D0A-A1237AD82399" width=100% height=100%>' );
            }

            parent = $('<div class="ui-dnd" style="z-index:10003">&nbsp;<a class="ui-pos-right ui-dnd-close" href="javascript:void(0)">'+_(l_key,'关闭')+'</a></div>').appendTo( $('body')).hide();

            parent.find( 'a').on( 'click', function(){
                parent.hide();
            });
            var body = document.body;
            body.onmousedown = function(){
                active_event.mouse_down = true;
            };
            body.onmouseup = function(){
                active_event.mouse_down = false;
            };
            body.ondragover = function(){
                if( active_event.mouse_down === false ){
                    parent.show();
                }
            };
            return $obj.appendTo( parent )[0];
        });


        var module = new Module( 'drag_upload_active', {

            render: function(){

                if ( !plugin ){
                    return;
                }

                plugin.text = _(l_key,'将文件拖拽至此区域');

                plugin.OnFilesDroped = function( type ){

                    if ( type === 'ENTER' ){
                        return plugin.text = _(l_key,'释放鼠标');
                    }

                    if ( type === 'LEAVE' ){
                        return plugin.text = _(l_key,'将文件拖拽至此区域');
                    }

                    if ( type === 'OVER' ){
                        return;
                    }

                    parent.hide();

                    var _oFiles = type.split("\r\n");
                    var _oFileList = [];
                    for (var i = 0; i < _oFiles.length; i++){
                        var _oFilePart = _oFiles[i].split(" ");
                        if (_oFilePart.length >= 2){
                            var _sFid = _oFilePart.shift(),
                            _sFileName = _oFilePart.join(" ");
                             _oFileList.push(_sFileName);
                         }
                    }
                    if(_oFileList.length){
                        upload_event.trigger( 'start_upload_from_client', _oFileList );
                        return;
                    }




                };

            }

        });


        setTimeout(function(){
            module.render();

            
        }, 1000 );


});/**
 *
 * @author unitwang
 * @date
 */
define.pack("./drag_upload_html5",["lib","common","$","i18n","disk","./upload_validata","./upload_route","./view","./Upload_class","./tool.upload_cache"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        c = lib.get('./console'),
        random = lib.get('./random'),
        collections = lib.get('./collections'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        functional = common.get('./util.functional'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        //upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        session_event = common.get('./global.global_event').namespace('session'),
        global_function = common.get('./global.global_function'),

        //upload = require('upload'),
        disk_mod = require('disk'),
        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),

        Validata = require('./upload_validata'),
        upload_route = require('./upload_route'),
        View = require('./view'),
        Upload_class = require('./Upload_class'),
        upload_cache = require('./tool.upload_cache'),

        M = Math.pow(2, 20), //1M
        COUNT_TO_REFRESH,    //记录一次拖拽的文件数，上传结束后刷新file_list
        COUNT_DONE = 0;


    var html_xml_http = {
        _xhr: null,
        _get: function () {
            var me = this;
            if (!me._xhr) {
                me._xhr = new XMLHttpRequest();
            }
            return me._xhr;
        },
        get: function (id) {
            var me = this;
            me.abort();
            me._get().open('post', 'http://diffsync.cgi.weiyun.com/', true);
            //me._get().open('post', 'http://wfup.cgi.weiyun.com/', true);
            me._get().local_id = id;
            return me._xhr;
        },
        abort: function () {
            this._get().abort();
        }
    };

    // 任务结束且有已成功上传的文件。刷新file_list
    var refresh_check = function(){
        if (COUNT_DONE > 0 && COUNT_TO_REFRESH === 0){
            file_list.reload(false, false);
            COUNT_DONE = 0;
        }
    }
    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (file, upload_plugin, path, size, ppdir, pdir, skey, ppdir_name, pdir_name) {
        this.file = file;
        this.upload_plugin = upload_plugin;
        this.local_id = random.random();
        this.del_local_id = this.local_id;
        this.path = path;
        this.file_size = size;
        this.ppdir = ppdir; //上传到指定的目录父级目录ID
        this.pdir = pdir;   //上传到指定的目录ID

        this.ppdir_name = ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = pdir_name; //上传到指定的目录的名称

        this.skey = skey;
        this.file_name = this.get_file_name();  //文件名;
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        (this.validata = Validata.create()).add_validata('empty_file', this.file_size);  //空文件验证
        this.time = this.get_timeout(480000); //超时
        this.init();

    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('get_timeout', function (__time) {
        var t,
            __self = this,
            timeout = function () {
                t = setTimeout(function () {
                    __self.change_state('error', 10000);//表单超时，激活错误状态
                }, __time);
            },
            clear = function () {
                clearTimeout(t);
            };
        return {
            timeout: timeout,
            clear: clear
        };
    });
    /** 1029
     * 不能重试
     */
    Upload.interface('can_re_start', function () {
        return false;
    });
    Upload.interface('states.done', function () {
        COUNT_DONE++;
        html_xml_http.abort();
        this.superClass.states.done.apply(this, arguments);
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated() && COUNT_TO_REFRESH === 0) {
            file_list.reload(false, false);
            COUNT_DONE = 0;
        }
    });

    Upload.getPrototype().dom_events.click_cancel = functional.after(Upload.getPrototype().dom_events.click_cancel, function(){
        if(this.state === 'wait'){
            COUNT_TO_REFRESH--;
        }
        html_xml_http.abort();
        refresh_check();
    });


    Upload.interface('states.error', function () {
        html_xml_http.abort();
        this.superClass.states.error.apply(this, arguments);
        refresh_check();
    });


    Upload.interface('states.start', function () {
        COUNT_TO_REFRESH--;
        this.start_time = +new Date();
        if( false === this.superClass.states.start.apply(this, arguments) ){
            return;
        }

        var file = this.file;
        if (file.size > 45 * M) {
            upload_cache.get_task(this.local_id).change_state('error', 1029);
            return;
        }

        this.time.timeout(this.time);
        var xhr = html_xml_http.get(this.local_id),
            formData = new FormData();
        formData.append('file', file);
        formData.append('name', 'web');
        formData.append('ppdir', this.ppdir);
        formData.append('pdir', this.pdir);
        formData.append('skey', this.skey);
        formData.append('random',(+new Date()));
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            var me = this;//xhr对象
            if (me.readyState == 4) {
                var reg_exp = /\d+/,
                    ret = me.responseText.match(reg_exp),
                    task = upload_cache.get_task(me.local_id);
                if(!ret){
                    return;
                }
                ret = ret[0];
                if (ret === '0') {
                    task.change_state('done');

                } else {
                    task.change_state('error', ret);
                    if (ret === ret_msgs.INVALID_SESSION) {//会话过期，登陆框弹出显示。(其它上传在Upload_class.js request_upload方法中rqeuest请求配置cavil参数即可) by hibinchen
                        session_event.trigger('session_timeout');
                    }
                }
            }
        };
    });

    var stop_prop_default = function (e) {//阻止默认行为和冒泡
        e.preventDefault();
        e.stopImmediatePropagation();
    };
    var h5_event ={
        mouse_down: false
    };
    (function () {

        //修改dropbox提示内容及相关判断
        var dropbox_title_change = function (child_node, title) {
            var text_node = collections.first(child_node, function (el) {
                return el.nodeType === 3;
            });
            if (text_node.data !== '') {
                text_node.data = title;
            }
        }

        var $dropbox = $('<div class="ui-dnd" style="position:fixed;top:100px;z-index:9999;text-align:center;padding-top:100px;"><a id="dropbox_close" class="ui-pos-right ui-dnd-close" href="javascript:void(0)">'+_(l_key,'关闭')+'</a>test</div>').appendTo($('body')).hide();
        var dropbox = $dropbox[0];
        document.addEventListener('mousedown', function () {
            h5_event.mouse_down = true;
        });
        document.addEventListener('mouseup', function () {
            h5_event.mouse_down = false;
        });
        document.addEventListener("dragenter", function (e) {
            if( h5_event.mouse_down ){
                return;
            }
            stop_prop_default(e);
            dropbox_title_change($dropbox[0].childNodes, _(l_key,'请将文件拖拽到此处'));
            $dropbox.show();
        }, false);

        $('#dropbox_close').on('click', function (e) {
            stop_prop_default(e);
            $dropbox.hide();
        });

        dropbox.addEventListener("dragenter", function (e) {
            stop_prop_default(e);
            dropbox_title_change($dropbox[0].childNodes, _(l_key,'释放鼠标'));
        });

        dropbox.addEventListener("dragover", function (e) {
            stop_prop_default(e);
        });

        dropbox.addEventListener("dragleave", function (e) {
            stop_prop_default(e);
            $dropbox.hide();
            dropbox_title_change($dropbox[0].childNodes, _(l_key,'请将文件拖拽到此处'));
        });

        dropbox.addEventListener("drop", function (e) {
            stop_prop_default(e);

            var files = $.makeArray(e.dataTransfer.files),
                items = $.makeArray(e.dataTransfer.items);
            if(!files.length){
                $dropbox.hide();
                return;
            }
            // 判断拖拽文件中是否包含文件夹（不支持文件夹上传）
            for (var i = 0; i < files.length; i++) {
                var _file = items[i].webkitGetAsEntry();
                if(_file && _file.isDirectory){
                    $dropbox.hide();
                    common.get('./ui.widgets').confirm(_(l_key,'提示'), _(l_key,"暂不支持文件夹拖拽上传！"), '', $.noop, null, [_(l_key,'确定')]);
                    return;
                }
            }
            var node = file_list.get_cur_node();
            if (node && node.is_vir_dir()) {
                node = file_list.get_root_node();
            }
            var pdir = node.get_id();
            var ppdir = node.get_parent().get_id();
            var pdir_name = node.get_name();
            var ppdir_name = node.get_parent().get_name();
            View.show();
            //队列，顺序执行传入的数组
            var len = COUNT_TO_REFRESH = files.length;
            functional.burst(files,function (file) {
                len--;
                var upload_obj = Upload.getInstance(file, upload_route.upload_plugin, file.name, file.size, ppdir, pdir, query_user.get_skey(), ppdir_name, pdir_name);
                upload_obj.upload_type = 'upload_form';
                upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
                if (len === 0) {
                    upload_obj.events.nex_task.call(upload_obj);
                }
            }, 8).start();

            $dropbox.hide();
        });

    })();

    module.exports = Upload;


});
define.pack("./event",["$","lib","common","./tool.upload_static"],function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),
        common = require('common'),
        constants = common.get('./constants'),
        functional = common.get('./util.functional'),
        view,
        Static = require('./tool.upload_static'),
        stop_prop_default = function (e) {//阻止默认行为和冒泡
            e.preventDefault();
            e.stopImmediatePropagation();
        };

    var dom_event ={
        init: function () {//上传管理器 事件初始化
            view = this;
            view.switch_upbox_btn.on('click', function (e) {//切换上传“mini窗口”和“主窗口”
                stop_prop_default(e);
                Static.dom_events[ view.switch_upbox_btn.attr('data-action') ](true);
            });

            view.clear_all_btn.on('click', function (e) {//全部清除
                stop_prop_default(e);
                Static.dom_events.click_clear_all(true);
            });

            view.upload_files.on('click', '[data-upload=click_event]',function (e) {//删除、暂停、继续上传
                stop_prop_default(e);
                var $ele = $(e.target),
                    upload_obj = view.get_task($ele.closest('li').attr('v_id')),
                    action = $ele.attr('data-action');
                view.before_hander_click(action);
                upload_obj.dom_events[ action ].call(upload_obj);
                view.after_hander_click(action);

            }).on('click', '.data-dir a',function (e) {//打开指定目录
                    stop_prop_default(e);
                    view.get_task($(e.target).closest('li').attr('v_id'))
                        .open_to_target();
                    view.min();//最小化上传管理器
                }).on('mouseover', '[data-action=folder-errors]', function (e) {
                    var $target = $(e.target),
                        errors = view.get_task($target.closest('[v_id]').attr('v_id'))
                                        .get_translated_errors();
                    // 当用时已经超过1秒时，不再使用性能低下的精确缩略不
                    var start_time = new Date(), limit = 1000, reach_limit = false;
                    $.each(errors, function (index, error) {
                        var fullname = error.fullname = error.name;
//                        error.name = View.compact_file_name(fullname.match(/(?:\\|\/)?([^\\\/]*)$/)[1]);
                        if (!reach_limit) {
                            error.name = view.compact_file_path(fullname);
                            reach_limit = new Date() - start_time > limit;
                        } else {
                            error.name = view.revise_file_name(fullname);
                        }
                    });
                    view.show_errors($target, errors);
                });
            /**
             * 点击页面内容其他部分，最小化上传管理器
             */
            view.$dom.hover(function () {
                dom_event._is_over_$dom = true;
                $('body').off('mouseup.out_upload');
            }, function () {
                dom_event._is_over_$dom = false;
                $('body').on('mouseup.out_upload', function () {
                    view.min();
                });
            });
            /**
             * 监听面板容器的滚动事件
             */
            /*
             view.upload_box.on('scroll',functional.throttle(function(){
             console.debug('scroll has trigger');
             view.on_box_change_scroll();
             },100));
             */
            view.upload_box.on('scroll',function(){
                view.on_box_change_scroll();
            });
            /**
             * 最大化
             */
            view.min_box.click(function () {
                view.max();
            });
            /**
             * 失败列表 添加到管理器底部，重新上传
             */
            view.upload_process.on('click','a',function(e){
                stop_prop_default(e);
                Static[$(e.target).attr('action')]();
            });
        },
        /**
         * 判断鼠标是否在任务管理器之上
         * @returns {boolean}
         */
        is_on_the_panel: function(){
            return this._is_over_$dom;
        }
    };
    return dom_event;
});define.pack("./msg",["$","common","lib","main","i18n"],function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),
        console = require('lib').get('./console'),
        constants = common.get('./constants'),
        main = require('main').get('./main'),
        query_user = common.get('./query_user'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        undefined;
    var g = {};

    g.upload_error = {

        //come from erric
        //高频码 - 错误类
        404: {
            simple : _(l_key,'连接失败'),
            normal : _(l_key,'暂时连接不上服务器，请重试')
        },
        10060: {
            simple : _(l_key,'连接失败'),
            tip : _(l_key,'未能连接服务器，请重试。'),
            normal : _(l_key,'未能连接服务器，请重试。')
        },
        100009: {
            simple : _(l_key,'获取文件失败'),
            normal : _(l_key,'获取源文件信息失败，请尝试重新上传')
        },
        1000: {
            simple : _(l_key,'上传出错'),
            tip : _(l_key,'上传出错，请重试。'),
            normal : _(l_key,'上传出错，请重试。')
        },

        //扫描过程中删除了本地文件
        2: _(l_key,'文件已被删除'),
        3: _(l_key,'文件已被删除'),
        '-5950': _(l_key,'文件已被删除'),

         //上传过程中删除了本地文件
        '-5999': _(l_key,'文件已被删除'),
        6: _(l_key,'文件已被删除'),
        32: _(l_key,'另一个程序正在使用此文件'),
        21: _(l_key,'设备未就绪,上传失败'),
        1392: _(l_key,'文件或目录损坏，无法读取'),
        53: _(l_key,'网络链接失败，请检查网络'),
        87: _(l_key,'网络文件不可读取，请检查网络'),
        5: _(l_key,'文件没有访问权限'),

        32221980: _(l_key,'上传过程中文件被修改，请重新上传'),

        32252995: _(l_key,'上传过程中微云文件目录被删除'),

        92260005: _(l_key,'文件上传过程中被修改，请重新上传'),

        //高频码 - 逻辑限制类
        //web本地验证错误码
        1000001: {
            simple : _(l_key,'文件过大'),
            normal : _(l_key,'文件大小超过32G限制')
        },
        1000002:'',
        1000003: {
            simple : _(l_key,'容量不足'),
            normal : _(l_key,'容量不足，请删除一些旧文件后重试')
        },
        1000004: _(l_key,'文件大小为空'),
        1000005: {//老控件时，超过大小提示，非控件或cgi返回 by hibincheng
            simple : _(l_key,'文件过大'),
            normal :(function(){
                return _(l_key,'大小超过{2}G,请{升级控件}以完成上传:')
                        .replace('{2}',($.browser.msie ? '4G': '2G'))
                        .replace(/(\{)(.+)(\})/,function(){
                            if(arguments[2]){
                                return '<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">'+arguments[2]+'</a>';
                            }
                            return arguments[0];
                        });
            })()
            //normal : '大小超过'+(($.browser.msie) ? '4G': '2G')+'，请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。'
        },
        1000006:_(l_key,'文件名为空，不支持上传'),
        1000007:_(l_key,'文件名不能包含以下字符之一 /\\:?*\"><|'),
        1000008:_(l_key,'文件名过长，请重命名后重传'),

        1053: {
            simple : _(l_key,'容量不足'),
            normal : _(l_key,'容量不足，请删除一些旧文件后重试')
        },
        1083: {
            simple : _(l_key,'文件过多'),
            normal : _(l_key,'该目录下文件过多，请选择其他目录')
        },

        1024: _(l_key,'登录超时'),

        //低频码 - 逻辑类
        1051: {
            simple : _(l_key,'文件同名'),
            normal : _(l_key,'该目录下已存在同名文件')
        },
        1016: {
            simple : _(l_key,'相册还没初始化'),
            normal : _(l_key,'请先访问相册再上传照片到相册')
        },
        1019: {
            simple : _(l_key,'目录已被删除'),
            normal : _(l_key,'上传目录已被删除')
        },
        1028: {
            simple : _(l_key,'微云文件过多'),
            normal : _(l_key,'微云中文件过多，请删除一些旧文件后重试')
        },
        1088: {
            simple : _(l_key,'文件名不合法'),
            normal : _(l_key,'文件名包含特殊字符，请重命名后重传')
        },
        100027: _(l_key,'无效的字符'),
        8: {
            simple : _(l_key,'文件名过长'),
            normal : _(l_key,'文件名过长，请重命名后重传')
        },
        16: _(l_key,'文件大小为空'),
        17: _(l_key,'文件已被删除'),
        1029: _(l_key,'文件过大'),
        101: _(l_key,'目录所在层级过深，请上传至其他目录'),  //code by bondli 特殊设置了错误码
        102: _(l_key,'目录创建失败(目录达到上限)，无法上传')
    };
    g.download_error = {
        1:_(l_key,"下载失败，请重新下载。"),
        2:_(l_key,"连接已丢失，请重新下载。"),
        3:_(l_key,"所选本地目录不允许下载文件，请选择其他位置。"),
        4:_(l_key,"您的本地硬盘已满，请选择其他位置重新下载。"),
        5:_(l_key,"下载失败，请重新下载。")
    };
    g.able_res_start ={
        2: false,
        3: false,
        6: false,
        '-5950': false,
        '-5999': false,
        32221980: false,
        32252995: false,
        92260005: false,
        1019: false,
        1016: false,
        21: false,
        1392: false,
        1000003:true,//空间不足
        1053:true//空间不足
    };

    //替换 急速上传链接
    (function(){
       if( gbIsWin && !$.browser.safari ){//300M限制暂不翻译； 国际版appbox支持300M
           if(constants.IS_APPBOX){
               g.upload_error[1000002] = '文件超过300M，请<a target="_blank" href="http://im.qq.com/qq/">安装新版本QQ</a>后上传';
           } else{
               g.upload_error[1000002] = '文件大小超过300M，请启用' + '<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank" '
                   + common.get('./configs.click_tj').make_tj_str('UPLOAD_FILE_MANAGER_INSTALL') + '>极速上传</a>';
           }
       } else {
           g.upload_error[1000002] = '该文件超过300M，暂不支持上传';
       }
       if(constants.IS_APPBOX){//appbox 暂时只支持到4G以内，QQ1.98后放开 todo
           g.upload_error[1000005].normal = _(l_key,'该文件超过4G暂不支持上传,请使用<a target="_blank" href="http://d.weiyun.com/">IE</a>上传');
       }
    })();

    //替换{反馈}
    var replace_fankui =function(error_text){
        var text = '';
        if( main.get_cur_mod_alias() === 'photo' ) {
            text = '<a href="http://support.qq.com/discuss/715_1.shtml?WYTAG=weiyun.app.web.photo" target="_blank" data-tj-action="btn-adtag-tj" data-tj-value="50003">'+_(l_key,'反馈')+'</a>';
        } else {
            text = '<a href="'+main.get_feedback_url()+'" target="_blank">'+_(l_key,'反馈')+'</a>';
        }
        return error_text.replace(_(l_key,'{反馈}'),text);
    };
    var get = function (type, code, msg_type ,error_step) {
        if ( typeof code === 'string' && !$.isNumeric(code)){
            return code;
        }

        var o = g[ type ][ code ], msg;
        switch(msg_type){
            case 'simple':
            case 'tip':
                break;
            default:
                msg_type = 'normal';
        }
        if(typeof o === 'object'){
            msg = o[msg_type];
            if(!msg){
                msg = o['normal'];
            }
        }else{
            msg = o;
        }
        if(!msg){

            msg = msg_type === 'simple' ? _(l_key,'系统繁忙') : _(l_key,'系统繁忙(0),请稍后重试').replace('(0)',code +(error_step ? ('-' + error_step) : ''));
            //msg = msg_type === 'simple' ? '系统繁忙' : '系统繁忙('+ code +(error_step ? ('-' + error_step) : '')+'),请稍后重试';
        } /*
        if(type === 'upload_error'){
            if(code === 10060 || code === 1000){
                return replace_fankui(msg);
            }
        }   */
        return msg;
    };

    module.exports = {
        get: get,
        able_res_start:function(code){
            return g.able_res_start[code];
        }
    };

});/**
 * 上传按钮下拉框选择
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./select_folder.dropdown_menu",["$","common"],function (require, exports, module) {
    var $ = require('$'),
        Pop_panel = require('common').get('./ui.pop_panel'),
        panel;

    return {
        render: function () {
            var $dropdown_menu = $('#upload_dropdown_menu');
            panel = new Pop_panel({
                $dom: $dropdown_menu,//弹层对象
                host_$dom: $('#upload_dropdown_inner'),//弹层的依覆对象
                show: function () {
                    $dropdown_menu.show();
                },
                hide: function () {
                    $dropdown_menu.hide();
                },
                delay_time: 50//延时50毫秒消失
            });
        },
        hide: function () {
            panel.hide();
        }
    };
});/**
 * 拉取微云目录结构树
 * @author bondli
 * @date 13-7-4
 */
define.pack("./select_folder.file_dir_list",["lib","common","$","disk","./upload_route","./tmpl","./select_folder.select_folder"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),

        disk_mod = require('disk'),
        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),
        file_node_from_cgi = disk_mod.get('./file.utils.file_node_from_cgi'),
        
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),

        upload_route = require('./upload_route'),
        tmpl = require('./tmpl'),
        parse_file = common.get('./file.parse_file'),
        request = common.get('./request'),
        upload_event = common.get('./global.global_event').namespace('upload2'),

        
        select_folder,
        FileNode,

        long_long_ago = '1970-01-01 00:00:00',

        file_box,

        undefined;

    var file_dir_list = new Module('file_dir_list', {

        render: function () {
            select_folder = require('./select_folder.select_folder');
        },

        /**
         * 显示目录列表
         * @param {jQuery|HTMLElement} 
         */
        show: function ($container, selected_id) {
            this.render();

            //强行把原来选中的都去掉选中
            $container.find('a').removeClass('selected');

            if (!file_box) {
                file_box = new FileBox($container);
            }
            file_box.show(selected_id);
        },

        /**
         * 隐藏目录列表
         */
        hide: function () {
            if (file_box) {
                file_box.hide();
            }
        },

        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         * @param {Number} level
         */
        load_sub_dirs: function (node_par_id, node_id, level) {
            var me = this;

            me.trigger('before_load_sub_dirs', node_id);

            request.get({
                cmd: 'get_dir_list',
                cavil : true,
                body: {
                    pdir_key: node_par_id,
                    dir_key: node_id,
                    dir_mtime: long_long_ago,
                    only_dir: 1
                }
            })
                .ok(function (msg, body) {

                    var dirs = file_node_from_cgi.dirs_from_cgi(body['dirs']);

                    me.trigger('load_sub_dirs', dirs, node_id, level);
                })
                .fail(function (msg, ret) {
                    me.trigger('load_sub_dirs_error', msg, ret);
                })
                .done(function () {
                    me.trigger('after_load_sub_dirs', node_id);
                });
        }
    });

    /**
     * 目录对话框
     * @constructor
     */
    var FileBox = function ($container) {

        var me = this;

        me._chosen_id = me._chosen_par_id = null;

        var root_dir,
            par_id;
        //var root_dir = file_list.get_root_node();
        
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated()) {
            root_dir = file_list.get_root_node();
            par_id = root_dir.get_parent().get_id();
        } 
        else 
        {
            var node_id = query_user.get_cached_user().get_main_key();
            var file_obj = {
                "dir_attr": {"dir_name":upload_route.get_root_name()},
                "dir_attr_bit": "1",
                "dir_ctime": "2012-07-15 15:23:51 754",
                "dir_is_shared": 0,
                "dir_key": node_id,
                "dir_mtime":"2012-07-15 16:07:42 863"
            };
            root_dir = me.parse_file_node(file_obj);
            par_id = query_user.get_cached_user().get_root_key();
        }
        //根目录ID
        this.root_id = root_dir.get_id();

        me._$el = $(tmpl.file_box({
            root_dir: root_dir,
            par_id: par_id,
            is_root: true//标识是根目录
        })).appendTo($container);

        // 点击目录名选中并展开
        me._$el.on('click', 'li[data-file-id]', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $dir = $(e.target).closest('[data-file-id]'),
                par_id = $dir.attr('data-file-pid'),
                dir_id = $dir.attr('data-file-id'),
                level = parseInt($dir.attr('data-level'));
            if( dir_id === me.root_id && upload_route.is_ku20()){//根目录不折起来 todo ku2.0
                return;
            }
            if(dir_id !== "-1"){//相册返回
                me.toggle_expand($dir, level);
            }
            me.set_chosen(par_id, dir_id);
        });

        // 显示对话框时，监听拉取子目录列表事件
        me
            .listenTo(file_dir_list, 'load_sub_dirs', function (dir_nodes, par_id, level) {
                this.render_$dirs_dom(dir_nodes, par_id, level);
            })
            .listenTo(file_dir_list, 'before_load_sub_dirs', function (dir_id) {
                this.mark_loading(dir_id, true);
            })
            .listenTo(file_dir_list, 'after_load_sub_dirs', function (dir_id) {
                // 标记当前的选择
                if (me._chosen_id) {
                    me.get_$node(me._chosen_id).children('a').addClass('selected');
                }
                // 计算宽度，判断是否超出，如果超出增加左右滚动条
                var $node = me.get_$node(me._chosen_id);
                if(!$node[0]){//选中ID没有被加载过(网盘默认目录上传)
                    this.mark_loading(dir_id, false);
                    return;
                }
                var bar_width = ($.browser.chrome) ? 10 : 18;
                var container_width = $('.dirbox-tree').width() - bar_width,
                    $cur_a = $node.children('a'),
                    cur_span_width = $cur_a.children('span')[0].offsetWidth,
                    total_width = parseInt( $cur_a.css('paddingLeft'), 10 ) + cur_span_width;

                //展开了，需要读取下级目录
                if($cur_a.hasClass('expand')) {
                    var $lis = $cur_a.siblings('ul').children('li');
                    var lis_widths = [];
                    $.each($lis, function(i, n){
                        var tmp = parseInt( $(n).children('a').css('paddingLeft'), 10 ) + $(n).children('a').children('span')[0].offsetWidth;
                        lis_widths.push(tmp);
                    });
                    var total_width = Math.max.apply(null,lis_widths);
                }

                var $tree = $('._tree')[0];
                if( total_width > container_width ) {
                    $tree.style.width = total_width + 'px';
                }
                else {
                    $tree.style.width = container_width + 'px';
                }
                this.mark_loading(dir_id, false);
            });


        // 选择目录前的判断
        me.on('chosen', function (par_id, dir_id) {
            var cur_node = file_list.get_cur_node(),
                cur_dir_id = cur_node ? cur_node.get_id() : undefined;

            // 选中的节点DOM
            var $node = this.get_$node(dir_id),
                dir_paths = $.map($node.add($node.parents('[data-dir-name]')), function (node) {
                    return $(node).attr('data-dir-name');
                }),
                //增加路径ID数组
                dir_id_paths = $.map($node.add($node.parents('[data-file-id]')), function (node) {
                    return $(node).attr('data-file-id');
                });

            //派发事件
            select_folder.trigger('selected', par_id, dir_id, dir_paths, dir_id_paths);
        });
    };

    FileBox.prototype = $.extend({

        parse_file_node: function (obj) {
            if (!FileNode) {
                FileNode = require('disk').get('./file.file_node');
            }
            return obj && new FileNode(parse_file.parse_file_attr(obj));
        },

        show: function (selected_id) {
            this._chosen_id = selected_id;

            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                var root_dir = file_list.get_root_node(),
                    root_id = root_dir.get_id(),
                    root_par_id = root_dir.get_parent().get_id();
            } 
            else 
            {
                var root_id = query_user.get_cached_user().get_main_key();
                var file_obj = {
                    "dir_attr": {"dir_name":upload_route.get_root_name()},
                    "dir_attr_bit": "1",
                    "dir_ctime": "2012-07-15 15:23:51 754",
                    "dir_is_shared": 0,
                    "dir_key": root_id,
                    "dir_mtime":"2012-07-15 16:07:42 863"
                };
                var root_dir = this.parse_file_node(file_obj);
                var root_par_id = query_user.get_cached_user().get_root_key();
            }
            this.expand_load(root_par_id, root_id, 0);
            
        },

        hide: function () {
            
            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                var root_dir = file_list.get_root_node(),
                    root_id = root_dir.get_id();
            } 
            else 
            {
                var root_id = query_user.get_cached_user().get_main_key();
            }

            this.get_$node(root_id).children('ul').remove();
        },

        /**
         * 渲染子目录DOM
         * @param {Array<File>} dirs
         * @param {String} dir_par_id
         * @param {Number} level
         */
        render_$dirs_dom: function (dirs, dir_par_id, level) {
            var me = this,
                $dir = this.get_$node(dir_par_id);
            if ($dir[0]) {

                $dir.children('ul').remove();

                // 箭头。
                var $arrow = $dir.children('a');
                if (dirs.length > 0) {

                    // 标记节点为已读取过
                    $dir.attr('data-loaded', 'true');

                    // 插入DOM
                    var $dirs_dom = $(tmpl.file_box_node_list({
                        files: dirs,
                        par_id: dir_par_id,
                        level: level
                    }));

                    //默认是相册的时候不需要展开
                    if( me._chosen_id != constants.UPLOAD_DIR_PHOTO ) {
                        // 箭头
                        $arrow.addClass('expand');
                        // 展开
                        $dirs_dom.hide().appendTo($dir).slideDown('fast');
                    }
                    else {
                        // 箭头
                        $arrow.removeClass('expand');
                        // 不展开
                        $dirs_dom.hide().appendTo($dir);
                    }
                }
                // 没有子节点就
                else {
                    // 隐藏箭头（如果移除箭头会导致滚动条抖一下）
                    $arrow.children('.ui-text').children('._expander').css('visibility', 'hidden');
                }
            }
        },

        /**
         * 展开节点
         * @param {String} par_id
         * @param {String} dir_id
         * @param {Number} level
         */
        expand_load: function (par_id, dir_id, level) {
            file_dir_list.load_sub_dirs(par_id, dir_id, level);
        },

        /**
         * 展开、收起文件夹
         * @param {jQuery|HTMLElement} $dir
         * @param {Number} level
         */
        toggle_expand: function ($dir, level) {
            $dir = $($dir);

            var par_id = $dir.attr('data-file-pid'),
                dir_id = $dir.attr('data-file-id'),

                $ul = $dir.children('ul'),
                loaded = 'true' === $dir.attr('data-loaded');

            // 已加载过
            if (loaded) {
                var $arrow = $dir.children('a'),
                    expanded = $arrow.is('.expand');

                if (expanded) {
                    $ul.stop(false, true).slideUp('fast', function () {
                        $arrow.removeClass('expand');
                    });
                } else {
                    $ul.stop(false, true).slideDown('fast');
                    $arrow.addClass('expand');
                }
            }
            else {
                // 有 UL 节点表示已加载
                this.expand_load(par_id, dir_id, level);
            }
        },

        /**
         * 设置指定节点ID为已选中的节点
         * @param {String} par_id
         * @param {String} dir_id
         */
        set_chosen: function (par_id, dir_id) {
            if (this._chosen_id === dir_id && this._chosen_par_id === par_id) {
                return;
            }

            // 清除现有的选择
            if (this._chosen_id) {
                this.get_$node(this._chosen_id).children('a').removeClass('selected');
            }

            this._chosen_id = dir_id;
            this._chosen_par_id = par_id;
            this.get_$node(dir_id).children('a').addClass('selected');

            this.trigger('chosen', par_id, dir_id);
        },

        get_$node: function (dir_id) {
            return $('#_file_box_node_' + dir_id);
        },

        mark_loading: function (dir_id, loading) {
            if( dir_id == constants.UPLOAD_DIR_PHOTO ) {
                return;
            }
            this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
        }

    }, upload_event);

    return file_dir_list;
});/**
 * 文件路径转换为樹结构
 * @author jameszuo
 * @date 13-7-30
 */
define.pack("./select_folder.file_path_parser",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        undef;

    var file_path_parser = {


        /**
         * 文件路径转换为樹结构
         * @param {String[][]} path_arr
         * @return {Object}
         */
        parse: function (path_arr) {
            var tree = {};

            for (var i = 0, l = path_arr.length; i < l; i++) {
                var path = path_arr[i];

                if (path.length === 0)
                    continue;

                var first = path[0]; // F:

                var sub_tree = tree[first] || (tree[first] = {  });

                for (var j = 1, k = path.length; j < k; j++) {
                    if (sub_tree.hasOwnProperty(path[j])) {
                        sub_tree = sub_tree[path[j]];
                    } else {
                        sub_tree = sub_tree[path[j]] = {};
                    }
                }
            }

            return this._to_json(tree);
        },


        /**
         * 文件路径转换为樹结构
         * @param {Object} sub_tree
         * @return {Object}
         */
        _to_json: function (sub_tree) {
            var nodes = [];
            for (var k in sub_tree) {
                var node = {
                    dir_name: k
                };
                if (!$.isEmptyObject(sub_tree[k])) {
                    node.sub_dir = this._to_json(sub_tree[k]);
                }
                else {
                    node.sub_dir = [];
                }
                nodes.push(node);
            }
            return nodes;
        }
    };

    return file_path_parser;

});/**
 * 上传文件夹时获取所选的文件信息
 * @author bondli
 * @date 13-7-29
 */
define.pack("./select_folder.get_up_folder_files",["lib","common","$","./select_folder.file_path_parser"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        constants = common.get('./constants'),

        upload_event = common.get('./global.global_event').namespace('upload2'),


        file_path_parser = require('./select_folder.file_path_parser'),
        G4 = Math.pow(2,30) * 4,

        undefined;

    var get_up_folder_files = function ( files_arr ) {
        var dir_name = '',          //所选目录名称
            dir_path = '',          //所选目录路径（包含目录名称）
            file_size = 0,          //所选文件总大小
            file_arr = [],
            dir_arr = [],           //所选的目录对象 
            prefix_dir_num = 0,     //所选的目录的前缀目录层数 
            dir_level_num = 0,      //单层目录下最大值   
            dir_total_num = 0,      //总目录数
            select_dir_level = 1,   //所选目录的层级
            is_exist_4g = false;    //是否存在4G大文件

        var _file_arr_length = files_arr.length,
            _path_min = 0,
            _path_min_arr = null
            _is_chosed_all = false,
            _level_num_arr = [];

        var _is_exist_folder_be_ignore = false; //是否存在最后一级目录被忽略

        $.each(files_arr, function(i, fileinfo){
            var item = fileinfo.split(' '); //这里纯粹的用空格分割会带来问题，文件名中可以也有空格
            var isdir = item[0] == 'D' ? true : false,
                filepath = '',
                file = '',
                filesize = parseFloat(item[item.length-1]);
            item.pop();
            item.shift(); //移除首尾元素就是文件路径了
            file = item.join(' ');
            //兼容新版本的appbox，移除目录最后面的斜杠
            if(i != 0 && file[file.length-1] === '\\'){
                file = file.substr(0,file.length-1);
            }
            filepath = file.split('\\');

            //判断是否选择了整个“盘”
            if(filepath[1] == '') {
                _is_chosed_all = true;
                return false;
            }

            if(i == 0) { //第一个记录
                _path_min = filepath.length;
                _path_min_arr = filepath;
                prefix_dir_num = _path_min_arr.length - 2;
                dir_name = _path_min_arr[prefix_dir_num];
                dir_path = file;
            }

            if(_level_num_arr[filepath.length]){
                _level_num_arr[filepath.length] ++;
            }
            else {
                _level_num_arr[filepath.length] = 1;
            }

            if(isdir == false) {
                file_arr.push(file);
                if (filesize >= G4) {
                    is_exist_4g = true;
                    filesize = 0;
                }
            }
            else {
                if(filepath.length > select_dir_level) {
                    select_dir_level = filepath.length;
                }
                //剔除最后一层的目录，这个时候只取到目录，目录下文件没有取到
                if( filepath.length == _path_min_arr.length - 1 + constants.UPLOAD_FOLDER_LEVEL && i != 0 ){
                    _is_exist_folder_be_ignore = true;
                }
                else{
                    dir_total_num ++; //统计目录总数
                    var _tmp = [];
                    for(var i = _path_min_arr.length - 2, l = filepath.length; i < l; i++) {
                        if(filepath[i] !== '') _tmp.push(filepath[i]);
                    }
                    dir_arr.push(_tmp);
                }
                
            }
            file_size += filesize; //统计文件大小
        });

        if(_is_chosed_all) return false;

        //取每层的最大值
        _level_num_arr = $.map(_level_num_arr, function(i){
            if(i != null) return i;
        });
        dir_level_num = Math.max.apply(null,_level_num_arr);
        
        //获取出现最大值的目录名称
        var _index = $.inArray(dir_level_num, _level_num_arr),
            _max_file_num_dir_name = _path_min_arr[ prefix_dir_num + _index ];

        dir_level_num--;//减去目录本身

        if(dir_arr.length == 0) { //没有目录的时候加上选择的那个目录自身
            dir_arr.push([dir_name]);
        }

        var dir_obj = file_path_parser.parse(dir_arr);

        //console.log(JSON.stringify(dir_obj));

        return {
            file_size : file_size,
            dir_name : dir_name,
            dir_obj : dir_obj,
            file_arr : file_arr,
            dir_total_num : dir_total_num,
            dir_level_num : dir_level_num,
            prefix_dir_num : prefix_dir_num,
            max_file_num_dir_name : _max_file_num_dir_name,
            dir_path : dir_path.substring(0,dir_path.length-1),
            is_exist_folder_be_ignore : _is_exist_folder_be_ignore,
            select_dir_level : select_dir_level - prefix_dir_num,
            is_exist_4g : is_exist_4g
        };
    };

    return get_up_folder_files;

});/**
 * 根据文件路径获取文件的pdir_key,ppdir_keys
 * @author bondli
 * @date 13-8-01
 */
define.pack("./select_folder.get_up_folder_keys",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        undef;

    var HashMap = function () { 
            var entry = new Object(); 
            /**Map的存put方法**/ 
            this.put = function(key, value) {
                entry[key] = value; 
            }; 
            /**Map取get方法**/ 
            this.get = function(key) { 
                return entry[key];
            };
        };

    var get_up_folder_keys = {

        _map : {},

        _default_ppdir : '',

        init: function (sub_dir, ppdir) {
            this._map = new HashMap();
            this._default_ppdir = ppdir;
            this._parse_json( sub_dir, "" );
        },
        /**
         * 文件路径获取文件的pdir,ppdir
         * @param {String[][]} path_arr
         * @return {Object}
         */
        get: function (path_arr) {
            var _pdir_key = this._map.get( path_arr.slice(0,-1).join("\\") + "\\" );
            var _ppdir_key = this._map.get( path_arr.slice(0,-2).join("\\") + "\\" );
            return {
                "pdir" : _pdir_key,
                "ppdir" : _ppdir_key ? _ppdir_key : this._default_ppdir
            };
        },

        //深度优先遍例JSON 
        _parse_json: function ( sub_dir, dir_name ) {
            var me = this;
            for(var i=0; i<sub_dir.length; i++) {
                if(sub_dir[i].dir_name) {
                    var cur_name = dir_name + sub_dir[i].dir_name + "\\";
                    me._map.put( cur_name, sub_dir[i].dir_key );
                }
                if(sub_dir[i].sub_dir) {
                    me._parse_json( sub_dir[i].sub_dir, cur_name );
                }
            }
        }

    };

    return get_up_folder_keys;

});/**
 * 展示loading
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author bondli
 * @date 13-10-08
 */
define.pack("./select_folder.loading",["lib","$","common","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        template = lib.get('./template'),
        common = require('common'),

        widgets = common.get('./ui.widgets'),

        tmpl = require('./tmpl'),
        ui_center = common.get('./ui.center'),

        undefined;


    var loading = {
        $el: null,

        render_if: function () {
            if (!this.$el) {
                this.$el = $(tmpl.loading_mark()).hide().appendTo(document.body);
            }
        },
        /**
         * 显示进度
         * @param {String} msg 消息，支持HTML代码
         * @param {Function} cancel_fn 取消时调用的方法
         */
        show: function (msg, cancel_fn) {

            var me = this;

            me.render_if();

            var $el = me.$el;

            if (!$el.parent()[0]) {
                $el.appendTo(document.body).hide();
            }

            // 文字
            $el.find('._n').html(msg);

            //取消事件
            $el.find('._cancel').on('click', function(){
                cancel_fn();
            });

            // 显示进度框
            if ($el.is(':hidden')) {

                $el.fadeIn('fast');

                // IE6 居中
                ui_center.listen($el);

                // 显示遮罩
                this.mask(true, true);
            }

        },

        hide: function (mask) {
            if (this.$el) {
                this.$el.stop(true, true).fadeOut('fast', function () {
                    var $el = $(this);
                    ui_center.stop_listen($el);
                    $el.detach();
                });
            }
            // 隐藏遮罩
            if (mask !== false) {
                this.mask(false);
            }
        },

        mask: function (visible, white_mask) {
            white_mask = white_mask !== false;

            widgets.mask.toggle(visible, 'ui.progress', this.$el, white_mask);
        }
    };

    return loading;
});/**
 * 选择上传分组
 * @author trump
 * @date 13-11-05
 */
define.pack("./select_folder.photo_group",["lib","common","$","./tmpl","disk","i18n","main","./upload_route","album"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        File = common.get('./file.file_object'),
        request = common.get('./request'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        Module = common.get('./module'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),

        main =  require('main').get('./main'),

        upload_route = require('./upload_route'),
        DISABLE_NEW_GROUP_CLASS = 'g-btn-blue-h30-disabled',
        undefined;
    var Group_record = function (cfg) {
        this.id = cfg.id;
        this.name = cfg.name;
    };

    var upload_photo_group = new Module('upload_photo_group',{
        on_photogroup_change: function(){
            group_route.load_groups(true);
        },
        render: function(){
            this.listenTo(ds_photogroup_event,'add remove update',function(records,meta){
                if( meta.src === group_route ){
                    return;
                }
                this.on_photogroup_change();
            });
        }
    });

    upload_photo_group.render();
    //分组信息
    var group_route = {
        /**
         * 获取当前页面的组记录id
         * @returns {*}
         */
        getCurPageGroupId: function(){
            if( main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return require('album').get('./photo').get_simple_module().get_group_id();
        },
        /**
         * 获取当前页面的组记录name
         * @returns {*}
         */
        getCurPageGroupName: function(){
            if( main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return require('album').get('./photo').get_simple_module().get_group_name();
        },
        _canceled: {},
        _group_cgi: 'http://web2.cgi.weiyun.com/pic_group.fcg',
        _request: function (url, cmd, header, body, post_process) {
            var def = $.Deferred(), me = this;
            var req = request.get({
                url: url,
                cmd: cmd,
                header: header,
                body: body,
                cavil: true
            });
            req.ok(function (msg, body, header, data) {
                var args;
                if (post_process) {
                    args = post_process.apply(this, arguments);
                } else {
                    args = $.makeArray(arguments);
                }
                def.resolve.apply(def, args);
            }).fail(function (msg, ret, body, header, data) {
                    def.reject(msg, ret, body, header, data);
                });
            return def;
        },
        //创建分组
        create_group: function (name) {
            var me = this;
            return me._request(
                me._group_cgi,
                'create_group',
                {},
                {
                    group_name: name
                },
                function (msg, body, header, data) {
                    return [{
                        id: body.group_id,
                        name: body.group_name
                    }, body.group_id];
                }
            ).done(function (record, total) {
                photo_group.on_create_group_ok(record.id,record.name);
                ds_photogroup_event.trigger('add',[record],{src: me});
                me.load_groups();
            }).fail(function (msg){
                mini_tip.error(msg);
            });
        },
        //加载分组
        load_groups: function (just_ask_data) {
            if(!upload_route.is_ku20()){//todo ku2.0
                return;
            }
            this._request(
                this._group_cgi,
                'get_group',
                {},
                {},
                function (msg, body, header, data) {
                    var groups = [];
                    $.each(body.pic_group, function (index, group) {
                        groups.push(new Group_record({
                            id: group.group_id,
                            name: group.group_name
                        }, group.group_id));
                    });
                    return [groups];
                }
            ).done(function (records, total) {
                group_route.groups = records;
                if(!just_ask_data){
                    photo_group.paint_group();
                }
            }).fail(function (msg) {
                if(!just_ask_data){
                    mini_tip.error(msg);
                }
            });
        },
        /**
         * 输入的名字是否可以创建新的分组
         * @param name
         * @returns {boolean}
         */
        is_suit_for_new: function (name) {
            if (!name || !name.length) {
                return false;
            }
            return true;
        },
        /**
         * 返回所有分组信息
         * @returns {Array<Group_record>}
         */
        find_all: function () {
            if (this.groups) {
                return this.groups;
            }
            return [];
        }
    };
    var photo_group = {
        /**
         * 分组新建成功后的处理逻辑
         * @param id
         * @param name
         */
        on_create_group_ok: function(id,name){
            this.on_chose_done(id,name);
        },
        /**
         * 显示/隐藏图片分组
         * @param {jQuery} [$render_to]
         * @param {Array} files
         * @param {boolean} [force_hide]
         */
        toggle_photo_group: function ($render_to, files, force_hide) {
            var me = this;
            if (!me.is_render) {
                me._render($render_to);
            }
            me.when_click('group_hide');
            if( !!force_hide || !me.is_all_image(files) || !upload_route.is_ku20()){//todo 2.0
                me.get_$check_parent().hide();//隐藏分组
            } else {
                me.set_photo_group_id(0);
                me.get_$check_parent().show();//显示分组
                me.reset_photo_group();//重置默认分组
                me.paint_group();
                var groupId = group_route.getCurPageGroupId(),
                    groupName = group_route.getCurPageGroupName();
                //如若处在一个有分组模块，那么就将这些分组信息设置为默认信息上传信息
                if( groupId && groupName){//设置默认分组
                    me.$check_prent.trigger('click');
                    me.set_photo_group_id( groupId );
                    me.get_$select_btn().find('span').html( groupName +'<i></i>');
                }
            }
        },
        /**
         * 重置分组html结构
         */
        reset_photo_group: function(){
            //设置默认分组
            this.set_photo_group_id(1);
            this.get_$select_btn().find('span').html(_(l_key,'未分组')+'<i></i>');
        },
        /**
         * 渲染组列表
         */
        paint_group: function () {
            var place = this.$panel,array = group_route.find_all();
            if(!place){
                place = this.get_$panel();
            }
            return place.empty().append(tmpl.photo_group_items({array:array}))
                .height(array.length > 5 ? 115 : 'auto')
        },
        /**
         * 初始化渲染
         * @param $render_to
         * @private
         */
        _render: function ($render_to) {
            var me = this;
            if (me.is_render) {
                return;
            }
            group_route.load_groups();
            me.is_render = true;
            me.get_$new_input();
            me.get_$new_btn();
            me.get_$select_btn();
            (me.$check_prent =
                ( me.$check = $render_to.find('[data-id=upload_group_check]') )
                    .parent()
                )
                .on('click', function (e) {
                    e.stopPropagation();
                    var is_checked = me.get_$check().hasClass('checked');
                    if (is_checked) {
                        me.when_click('group_hide');
                    } else {
                        me.reset_photo_group();//重置默认分组
                        me.when_click('group_show');
                    }
                });
        },
        /**
         * 获取图片组ID
         * @returns {int}
         */
        get_photo_group_id: function () {
            if(this._chose_group_id){
                return this._chose_group_id - 0;
            }
            return 0;
        },
        /**
         * 设置图片组ID
         * @param id
         */
        set_photo_group_id: function (id) {
            this._chose_group_id = id;
        },
        /**
         * 是否控件上传
         * @returns {boolean}
         * @private
         */
        _is_plugin: function () {
            return upload_route.type == 'active_plugin' || upload_route.type == 'webkit_plugin';
        },
        /**
         * 获取文件名
         */
        _get_name: $.noop(),
        /**
         * 输入的文件全部为图片文件
         * @param files
         */
        is_all_image: function(files){
            if (!files || !files.length) {
                return false;
            }

            if (!this._get_file_name) {//初始化获取名称的函数
                this._get_file_name = this._is_plugin() ? function (path) {
                    var ary = path.split(/\\|\//);
                    return ary[ary.length - 1] || '';
                } : function (path) {
                    return path.name;
                };
            }
            var i = 0, file;
            //中断条件：出现不为图片的文件
            while(file = files[i]){
                if(!File.is_image(this._get_file_name(file))){
                    return false;
                }
                i+=1;
            }
            return true;
        }
    };
    $.extend(photo_group,{
        /**
         * 分组信息的包装层
         * @returns {jQuery}
         */
        get_$group: function () {
            var me = this;
            if (me.$group) {
                return me.$group;
            }
            return me.$group = $('#upload_dropdown_group')
                .hover(function () {
                    $('body').off('mouseup.out_upload_group');
                }, function () {
                    $('body').on('mouseup.out_upload_group', function () {
                        //处于新建分组的输入状态时，回到选择分组的状态 ； 否则隐藏选择分组
                        if( me.get_$wrap().css('display').toLowerCase() !== 'none' ){
                            me.get_$select_btn().trigger('click');
                        } else {
                            me.when_click('out_upload_group');
                        }
                    });
                });
        },
        /**
         * 选择指定分组的下拉框按钮
         * @returns {jQuery}
         */
        get_$select_btn: function () {
            var me = this;
            if (me.$select_btn) {
                return me.$select_btn;
            }
            return (me.$select_btn = $('#upload_select_group')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_select_group');
            });
        },
        /**
         * 下拉面板容纳所有的组信息
         * @returns {jQuery}
         */
        get_$panel: function () {
            var me = this;
            if (me.$panel) {
                return me.$panel;
            }
            me.$panel = $('#upload_group_panel');

            me.$panel.on('click', 'li', function (e) {
                e.preventDefault();
                var _self = $(this).find('a'),
                    id = _self.attr('data-group-id');
                if (!id || id == 0) {
                    return;
                }
                me.on_chose_done(id,_self.text());
            });
            return me.paint_group();
        },
        /**
         * 当被选中一个分组时的处理逻辑
         * @param group_id 组id
         * @param group_name 组名
         */
        on_chose_done: function(group_id,group_name){
            var me = this;
            me.get_$select_btn().find('span').html(group_name+'<i></i>');//修改选中的分组TEXT
            me.set_photo_group_id(group_id);
            me.when_click('li');
        },
        /**
         * 新建分组的输入框和创建按钮的 容器
         * @returns {jQuery}
         */
        get_$wrap: function () {
            return this.$add_wrap || ( this.$add_wrap = $('#upload_new_group_wrap'));
        },
        /**
         * 新建分组的创建按钮
         * @returns {jQuery}
         */
        get_$new_btn: function () {
            if (this.$new_btn) {
                return this.$new_btn;
            }
            var me = this;
            return (me.$new_btn = $('#upload_new_btn'))
                .on('click', function (e) {
                    e.stopPropagation();
                    group_route.create_group(me.get_$new_input().val())
                });
        },
        /**
         * 新建分组的输入框
         * @returns {jQuery}
         */
        get_$new_input: function () {
            if (this.$new_input) {
                return this.$new_input;
            }
            var me = this;
            return (me.$new_input = $('#upload_new_group_input'))
                .on('focus', function (e) {
                    e.stopPropagation();
                    if (this.value === _(l_key,'新建分组')) {
                        this.value = '';
                    }
                    me.get_$wrap().find('a')[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                })
                .on('keyup', function (e) {
                    e.stopPropagation();
                    me.get_$wrap().find('a')[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                });
        },
        /**
        * 新建分组的入口按钮
        * @returns {jQuery}
        * */
        get_$add_btn: function () {
            var me = this;
            if (me.$add_btn) {
                return me.$add_btn;
            }
            return (me.$add_btn = $('#upload_new_group_btn')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_new_group_btn');
                me.get_$new_input().focus().val('');
            });
        },
        /**
         * checkbox 选择一个指定的分组的CheckBox对象
         * @returns {jQuery}
         */
        get_$check: function () {
            return this.$check;
        },
        /**
         * checkbox的包装层
         * @returns {jQuery}
         */
        get_$check_parent: function () {
            return this.$check_prent;
        },
        /**
         * 各种操作的UI展示效果
         * @param target
         */
        when_click: function (target) {
            switch (target) {
                case('li'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('upload_select_group'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().show();
                    this.get_$wrap().hide();
                    this.get_$panel().show();
                    return;
                case('upload_new_group_btn'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().hide();
                    this.get_$wrap().show();
                    this.get_$panel().show();
                    return;
                case('out_upload_group'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('group_hide'):
                    this.get_$group().hide();//隐藏分组信息
                    this.get_$check().removeClass('checked');
                    return;
                case('group_show'):
                    this.get_$group().show();//隐藏分组信息
                    this.get_$check().addClass('checked');
                    return;
            }
        }
    });

    return photo_group;
});/**
 * 上传选择文件框
 * @author bondli
 * @date 13-7-3
 */
define.pack("./select_folder.select_folder",["lib","common","$","./tmpl","disk","main","./select_folder.file_dir_list","./select_folder.get_up_folder_keys","./select_folder.select_folder_msg","./select_folder.select_folder_view","./select_folder.photo_group","./upload_route","i18n"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        JSON = lib.get('./json'),

        security = lib.get('./security'),

        constants = common.get('./constants'),
        Module = common.get('./module'),


        upload_event = common.get('./global.global_event').namespace('upload2'),
        global_event = common.get('./global.global_event'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        query_user = common.get('./query_user'),

        main = require('main').get('./main'),

        widgets = common.get('./ui.widgets'),
        text = lib.get('./text'),
        File = common.get('./file.file_object'),
        FileNode = require('disk').get('./file.file_node'),

        file_dir_list = require('./select_folder.file_dir_list'),
        ui_center = common.get('./ui.center'),

        user_log = common.get('./user_log'),
        request = common.get('./request'),

        get_up_folder_keys = require('./select_folder.get_up_folder_keys'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        select_folder_view = require('./select_folder.select_folder_view'),
        photo_group = require('./select_folder.photo_group'),
        upload_route = require('./upload_route'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        $body = $(document.body),

        //mac系统, safari 下不显示下载按钮
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        dialog,

        $icon, $name,

        undefined;

    var select_folder = new Module('upload_select_folder', {

        ppdir : '',  //上传到的父级目录

        pdir : '',   //上传到的目录

        ppdir_name : '',  //上传到的父级目录名称

        pdir_name : '',  //上传到的目录名称

        files : [],  //选定要上传的文件

        upload_plugin : {},  //上传对象

        upload_type : 'plugin',  //上传类型，plugin,form,flash

        $tree_ct : '',   //目录树容器

        dir_paths : [],  //选择的目录路径名称

        dir_id_paths : [], //选择的目录路径ID

        upload_mode : 1,  //上传模式，1：上传文件，2：上传文件夹

        cache : [],

        dir_level : 1, //所选目录的层级

        //初始化
        render: function () {
            var me = this;
            
            select_folder_view.render();

            //根据当前的上传类型，确定按钮
            var upload_button = [];
            if ( me.upload_type == 'plugin' ) {
                upload_button.push({
                    id: 'OK', text: _(l_key,'开始上传'), tips: 'jisu', klass: 'g-btn g-btn-blue', visible: true
                });
            }
            else {
                if(gbIsWin){
                    upload_button.push({
                        id: 'OTHER', text: _(l_key,'极速上传'), tips: 'jisu', klass: 'g-btn upbox-btn-speed', visible: true
                    });
                }
                upload_button.push({
                    id: 'OK', text: _(l_key,'普通上传'), klass: 'g-btn g-btn-gray', visible: true
                });
            }

            if (!dialog) {
                dialog = new widgets.Dialog({
                    title: _(l_key,'上传文件'),
                    empty_on_hide: false,
                    destroy_on_hide: false,
                    content: select_folder_view.$dom,
                    tmpl: tmpl.dialog,
                    mask_bg: 'ui-mask-white',
                    buttons: upload_button,
                    handlers: {
                        OK: function () {
                            submit();
                        },
                        OTHER: function(){
                            other();
                        }
                    }
                });
                //当关闭或者隐藏的时候
                me.listenTo(dialog, 'hide', function () {
                    me.hide();
                    file_dir_list.hide();
                    /*/统计代码
                    setTimeout(function(){
                        user_log('UPLOAD_SELECT_PATH_CLOSE', 0);
                    }, 200);*/
                });
            }

            // 提交
            var submit = function () {

                if( me.upload_mode == 2 ) {
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO) {
                        select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                        return;
                    }
                }
                else{
                    //表单模式不允许上传相册
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.upload_type == 'form' ) {
                        select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                        return;
                    }

                    //上传到相册需要过滤文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.getPhotoFiles() == false ) {
                        return;
                    }

                    //获取上传到相册的文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO ) {
                        me.files = me.getPhotoFiles();
                    }
                }

                //动画效果
                var $dialog = dialog.get_$el();

                widgets.mask.hide('ui.widgets.Dialog');

                var width = $dialog.width(),
                    height = $dialog.height(),
                    marginLeft = $dialog.css('marginLeft');
                $dialog.animate({
                    "top": "+=570px", //向下移动
                    //"opacity": 0.4,   //透明
                    "width": "740px",    //宽度变大
                    "height": "40px",
                    "marginLeft": "-370px"
                },'slow',function(){
                    //最终隐藏起来
                    dialog.hide();
                    $dialog.css({
                        "width": width,
                        "height": 'auto',
                        "marginLeft": marginLeft
                        //"opacity": 1
                    });
                });

                //console.log(me.ppdir, me.pdir, me.ppdir_name, me.pdir_name, me.dir_paths, me.dir_id_paths);
                if( me.upload_mode == 2 ) {
                    //执行创建目录前先判断目录层级是否太深
                    if( me.get_dir_level() + me.files.select_dir_level >= 20 ){
                        me.trigger('create_dir_fail', _(l_key,'目录所在层级过深，请上传至其他目录'), 101);
                        return;
                    }
                    //先创建目录，然后构建新的文件列表，触发新的事件
                    request.post({
                        url : 'http://web.cgi.weiyun.com/create_dir.fcg?token=' + security.getAntiCSRFToken(),
                        cmd: 'create_dir',
                        cavil : true,
                        re_try: 0,
                        body: {
                            ppdir_key: me.ppdir,
                            pdir_key: me.pdir,
                            sub_dir: me.files.dir_obj
                        }
                    })
                        .ok(function (rsp_msg, rsp_body) {
                            //判断内部是否有错误，开放目录层级限制后需要判断子目录是否失败，失败需要删除创建的目录
                            var main_dir = rsp_body.sub_dir[0];
                            if(main_dir.ret != 0){
                                me.trigger('create_dir_fail', text.format(_(l_key,'文件夹创建失败(0)，无法上传'),[main_dir.ret]), 102);
                                //me.trigger('create_dir_fail', '文件夹创建失败('+main_dir.ret+')，无法上传', 102);
                                return;
                            }
                            me.trigger('create_dir_ok', rsp_body);
                        })
                        .fail(function (msg, ret) {
                            me.trigger('create_dir_fail', msg, ret);
                        });

                    var op_name = (me.files.is_exist_folder_be_ignore === true) ? 'UPLOAD_SELECT_FOLDER_NO_FOLDER' : 'UPLOAD_SELECT_FOLDER_HAS_FOLDER'; 
                    setTimeout(function(){
                        user_log(op_name, 0); //选择文件夹-是否包含子目录上报
                    }, 200);
                }
                else{
                    upload_event.trigger('add_upload', me.upload_plugin, me.files, {
                        'ppdir': me.ppdir,
                        'pdir': me.pdir,
                        'ppdir_name': me.ppdir_name,
                        'pdir_name': me.pdir_name,
                        'dir_paths': me.dir_paths,
                        'dir_id_paths': me.dir_id_paths
                    });
                }
            };

            // 点击安装控件或者装新版QQ
            var other = function() {
                if(constants.IS_APPBOX){
                    window.open('http://im.qq.com/qq/');
                }
                else{
                    dialog.hide();
                    upload_event.once('upload_dialog_show',function(){
                        dialog.show();
                        //显示“修改按钮”
                        select_folder_view.show_chdir_btn();
                        //调整按钮提示信息框位置
                        select_folder_view.reset_box_pop_postion();
                    });
                    upload_event.trigger('install_plugin', _(l_key,'请安装极速上传控件，以启用“极速上传”。'), _(l_key,'UPLOAD_SUBMIT_BTN_PLUGIN') );  //0, 上报用
                }
                return false;
            }
        },

        //设置node所在的dir层数
        set_dir_level: function (node) {
            var i = 0;
            while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                i++;
            }
            this.dir_level = i;
        },

        get_dir_level: function () {
          return this.dir_level;
        },

        //判断是否选择了非图片文件
        hasNotPhotoFiles: false,

        //从选择的文件中获取照片文件
        getPhotoFiles: function () {
            var me = this,
                __files = [],
                photo_type = ['jpg','jpeg','gif','png','bmp'];

            $.each(me.files, function(i, n){
                if( me.upload_type == 'plugin' ) {
                    var ary = n.split(/\\|\//);
                    var file_name = ary[ary.length - 1] || '';
                }
                else if( me.upload_type == 'flash' ) {
                    var file_name = n.name;
                }

                var file_type = File.get_type(file_name);

                if( $.inArray(file_type, photo_type) != -1 ) {
                    __files.push( n );
                }
                else{
                    me.hasNotPhotoFiles = true;
                }
            });

            if( __files.length == 0 ){
                return false;
            }
            else {
                return __files;
            }

        },

        //超过大小的提示
        show_max_size_dialog : function ( wording, btn ) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">'+wording+'</span></p>');
            var dialog = new widgets.Dialog({
                title: '上传提醒',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog2,
                buttons: [ btn ],
                handlers: {
                    OTHER: function(){
                        var url = (constants.IS_APPBOX) ? 'http://im.qq.com/qq/' :
                        'http://www.weiyun.com/plugin_install.html?from=ad';
                        window.open(url);
                   }
                }
            });
            dialog.show();
        },

        //超过4G的提示
        flash_max_size_4G_tips : function () {
            var wording = select_folder_msg.get('NO_SUPPORT_G4_FILE');
            var btn = {id: 'CANCEL', text: _(l_key,'取消'), klass: 'g-btn-gray', visible: true};
            this.show_max_size_dialog(wording, btn);
        },

        //超过2G的提示
        flash_max_size_2G_tips : function () {
            if( !$.browser.msie ){
                var wording = select_folder_msg.get('CHANGE_IE_TO_SUPPORT_G4_FILE');
                var btn = {id: 'CANCEL', text: _(l_key,'取消'), klass: 'g-btn-gray', visible: true};
            }
            else{
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: _(l_key,'极速上传'), tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            /*
            var top = '243px',right = '-20px';
            if(constants.IS_APPBOX){
                top = '193px';
                right = '-65px';
            }
            */
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //单文件超过300M的提示
        flash_max_size_tips : function () {
            //判断是否支持装控件
            if ( $.browser.safari || !gbIsWin ) {
                var wording = select_folder_msg.get('BROWSER_NO_SUPPORT_M300_FILE');
                var btn = {id: 'CANCEL', text: _(l_key,'取消'), klass: 'g-btn-gray', visible: true};
            }
            else {
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: _(l_key,'极速上传'), tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //获取当前选择目录的名称
        get_cur_node_name: function() {
            //获取当前的文件位置，如果是“最近文件”，“回收站”设置为“网盘”
            var node,
                node_name,
                ret_name = upload_route.get_root_name() + '\\';
            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                //var node = file_list.get_cur_node() || file_list.get_root_node();
                node = file_list.get_cur_node(); 
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_name = node.get_name();

                this.pdir = node.get_id();
                this.ppdir = node.get_parent().get_id();
                this.pdir_name = node_name;
                this.ppdir_name = node.get_parent().get_name() || '';

                //设置所选目录的层级
                this.set_dir_level(node);
            } 
            else 
            {
                var node_id = query_user.get_cached_user().get_main_key();
                node_name = query_user.get_cached_user().get_main_dir_name();

                this.pdir = node_id;
                this.ppdir = query_user.get_cached_user().get_root_key();
                this.pdir_name = node_name;
                this.ppdir_name = '';

                //设置所选目录的层级
                this.dir_level = 1;
            }
            if( node_name == _(l_key,'微云') || node_name == _(l_key,'网盘') ){
                return ret_name;
            }
            return ret_name + node_name;
        },

        //显示默认的路径
        set_default_path_name : function(node_name, is_upfolder) {
            if(upload_route.is_ku20()){//todo ku2.0
                $('#disk_upload_upload_to').html(text.smart_cut(node_name, 20));
                return;
            }

            //当前停留在相册的时候
            if(main.get_cur_mod_alias() == 'photo'){
                var node_id = constants.UPLOAD_DIR_PHOTO;
                node_name = _(l_key,'相册');
                this.pdir = node_id;
                this.ppdir = constants.UPLOAD_DIR_PHOTO;
                this.ppdir_name = '';
                this.pdir_name = node_name;
                //如果是上传文件夹
                if(is_upfolder) {
                    node_name = _(l_key,'相册')+'<label>（'+select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO')+'）</label>';
                    this.set_submit_disable();
                }
                else {
                    if( this.upload_type == 'form' ) {
                        //判断能否安装插件
                        node_name = _(l_key,'相册')+'<label>（'+select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO')+'）</label>';
                        this.set_submit_disable();
                    }
                    else {
                        if( this.getPhotoFiles() == false ) {
                            node_name = _(l_key,'相册')+'<label>（'+select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO')+'）</label>';
                            this.set_submit_disable();
                        }
                    }
                }
                
                $('#disk_upload_upload_to').html(node_name);
            }
            else{
                $('#disk_upload_upload_to').html(text.smart_cut(node_name, 20));
            }
        },
        //显示上传位置选择框
        show: function (files, upload_plugin, upload_type) {

            //先隐藏上传管理器
            //global_event.trigger('upload_to_min');

            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = upload_type;

            this.upload_mode = 1;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();


            //根据选择的文件个数，获取文件名称，文件后缀
            var full_name = '',
                file_name = '',
                file_ext = '';
            if( this.upload_type == 'plugin' ) {
                var ary = this.files[0].split(/\\|\//);
                full_name = ary[ary.length - 1] || '';
            }
            else if( this.upload_type == 'flash' ) {
                full_name = this.files[0].name;
            }
            else {
                full_name = this.files[0].name;
            }

            //flash上传，并且是单文件需要判断是否超过大小
            if ( this.upload_type == 'flash' && this.files.length == 1 ) {
                var cur_file_size = this.files[0].size;
                //判断是否大于4G
                if( cur_file_size > 1024 * 1024 * 1024 * 4 ){
                    this.flash_max_size_4G_tips();
                    return;
                }
                //判断是否大于2G
                else if( cur_file_size > 1024 * 1024 * 1024 * 2 ){
                    this.flash_max_size_2G_tips();
                    return;
                }
                //限制:300M
                else if( cur_file_size > 1024 * 1024 * 300 ){
                    this.flash_max_size_tips();
                    return;
                }
            };

            //处理文件名和文件icon
            if( this.files.length == 1 ){
                file_ext = File.get_type(full_name);
                if(file_ext == '') {
                    file_ext = 'file';
                }
                //截取
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );
            }
            else{ //多个文件
                var m_word = photo_group.is_all_image( files ) ? '张图片' : '个文件';
                var and_so_on = text.format(_(l_key,'等{0}'+m_word),[this.files.length]);
                file_ext = 'multifile';
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 16 : 20 ) + ' <label>'+and_so_on+'</label>';
                full_name = full_name + and_so_on;
            }
            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var node_name = this.get_cur_node_name();

            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();

            select_folder_view.set_box_pop();

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(node_name);

            photo_group.toggle_photo_group(select_folder_view.$dom,files);

            //上报用户选了多少个文件,临时上报就不写入ops的配置了
            user_log(59010,0,{"file_num": this.files.length});

        },

        /**
         * 上传文件夹特殊处理下
         */
        show_by_upfolder: function (files, upload_plugin) {
            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = 'plugin';

            this.upload_mode = 2;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();

            //根据选择的文件个数，获取文件名称，文件后缀
            var file_ext = 'dir',
                full_name = files.dir_name,
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );

            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var node_name = this.get_cur_node_name();


            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();
            dialog.set_title(_(l_key,'上传文件'));

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(node_name, 1);

            photo_group.toggle_photo_group(select_folder_view.$dom,files);

        },

        //设置目录列表隐藏
        hide : function() {
            select_folder_view.$tree_ct[0].style.display = 'none';
            this.trigger('hide');
            photo_group.toggle_photo_group(null,null,true);
        },

        /**
         * 设置提交按钮为禁用
         */
        set_submit_disable : function () {
            var btn = $('.dirbox').find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.addClass('g-btn-blue-disabled');
            }
            else {
                btn.addClass('g-btn-gray-disabled');
            }
        },

        /**
         * 启用提交按钮
         */
        set_submit_enable : function () {
            var btn = $('.dirbox').find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.removeClass('g-btn-blue-disabled');
            }
            else {
                btn.removeClass('g-btn-gray-disabled');
            }
        },
    
        //更新上传到的路径显示
        update : function( ppdir, pdir, dir_paths, dir_id_paths ){
            this.ppdir = ppdir;
            this.pdir = pdir;

            //$('#disk_upload_upload_to').html( dir_paths[dir_paths.length-1] );
            $('#disk_upload_upload_to').text(dir_paths.join('\\'));
            $('#disk_upload_upload_to').attr('title', dir_paths.join('\\'));

            //设置所选目录的层级
            this.dir_level = dir_paths.length;

            if( this.pdir == constants.UPLOAD_DIR_PHOTO ) {
                //表单模式不允许上传相册
                if( this.upload_type == 'form' ){
                    select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //文件夹模式不允许上传到相册
                if( this.upload_mode == 2 ) {
                    select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //上传到相册需要过滤文件
                if( this.getPhotoFiles() == false ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                    //按钮也灰掉
                    this.set_submit_disable();
                    return;
                }

                //选的文件中有部分是图片，有部分是非图片的时候也需要提示
                if( this.hasNotPhotoFiles == true ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                }
            }
            else{
                select_folder_view.set_album_text();
                this.set_submit_enable();
            }

            //判断长度是否超出
            var cur_width = $('#disk_upload_upload_to').width();
            if( cur_width > 292 ) {
                var len = dir_paths.length;
                //$('#disk_upload_upload_to').html( text.smart_sub(dir_paths[len-1], 20) );
                var output = [];
                if( len>4 ) {
                    var output = text.smart_sub(dir_paths[len-2], 8) + '\\' + text.smart_sub(dir_paths[len-1], 8);
                    $('#disk_upload_upload_to').text( upload_route.get_root_name()+'\\...\\' + output );
                }
                else {
                    $.each(dir_paths,function(i,n) {
                        output.push( text.smart_sub(n,5) );
                    });
                    $('#disk_upload_upload_to').text(output.join('\\'));
                }
            }

            //增加选择的目录的路径和路径ID
            if(upload_route.is_ku20()){ //todo ku2.0
                this.dir_paths = dir_paths;
            } else {
                this.dir_paths = $.map(dir_paths, function (path) {
                    return (path == _(l_key,'网盘')) ? _(l_key,'微云') : path;
                });
            }

            this.dir_id_paths = dir_id_paths;

            this.ppdir_name = '';
            this.pdir_name = dir_paths[dir_paths.length - 1];
            if( dir_paths.length > 1 ) {
                this.ppdir_name = dir_paths[dir_paths.length - 2];
            }
        }

    });

    //定义一个选择的目录的事件
    select_folder.on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ){
        select_folder.update( ppdir, pdir, dir_paths, dir_id_paths );
    });

    //定义一个处理创建文件夹成功的事件
    select_folder.on('create_dir_ok', function(rsp_body) {

        var me = this,
            ext_param = {"code":1,"text":""},
            files = [];
        var chosed_dir = rsp_body.sub_dir;

        var prefix_dir_num = me.files.prefix_dir_num,
            file_arr = me.files.file_arr;
        

        //console.log(JSON.stringify(chosed_dir));
        //console.log(JSON.stringify(file_arr));
        me.dir_name = chosed_dir[0].new_dir_name || me.files.dir_name; //可能会被重命名

        //如果file_arr 为空直接提示成功
        if( file_arr.length === 0 ) {
            //todo::触发上传管理器
            ext_param = {"code":2,"text":""};
            //return;
        }

        get_up_folder_keys.init( chosed_dir, me.pdir );
        
        $.each(file_arr, function(i, file){
            var filepath = file.split('\\');
            var tmp = [];
            for( var i = prefix_dir_num, l = filepath.length; i<l; i++ ) {
                tmp.push(filepath[i]);
            }
            var keys = get_up_folder_keys.get( tmp );
            //console.log(keys);
            files.push({'file':file,
                'ppdir':keys.ppdir,
                'pdir':keys.pdir,
                'ppdir_name':0,
                'pdir_name':0,
                'dir_paths':0,
                'dir_id_paths':0
            });
        });

        var upload_attrs = {
            'file_id':chosed_dir[0].dir_key,
            'dir_name':me.dir_name, 
            'local_path':me.files.dir_path,
            'ppdir':me.ppdir,
            'pdir':me.pdir,
            'ppdir_name':me.ppdir_name,
            'pdir_name':me.pdir_name,
            'dir_paths':me.dir_paths,
            'dir_id_paths':me.dir_id_paths
        };
        //console.log(upload_attrs);

        upload_event.trigger('add_folder_upload', me.upload_plugin, files, upload_attrs, ext_param);
    });

    //创建目录失败
    select_folder.on('create_dir_fail', function(msg, ret) {
        //todo::触发上传管理器
        var me = this,
            files = [],
            ext_param = {"code":3,"text":ret};

        if( ret == 190041 || ret == 1013 || ret == 1014 ){ //可重试
            var cache_key = 'select_folder_' + Math.random(),
                cache_str = JSON.stringify({
                    'dir_name' : me.dir_name, 
                    'ppdir' : me.ppdir, 
                    'pdir' : me.pdir,
                    'sub_dir' : me.files.dir_obj
                });
            select_folder.cache[cache_key] = cache_str;
            ext_param = {"code":4,"text":cache_key};
        }

        var prefix_dir_num = me.files.prefix_dir_num,
            file_arr = me.files.file_arr;


        $.each(file_arr, function(i, file){
            var filepath = file.split('\\');
            var tmp = [];
            for( var i = prefix_dir_num, l = filepath.length; i<l; i++ ) {
                tmp.push(filepath[i]);
            }
            files.push({'file':file,
                'ppdir':0,
                'pdir':0,  //创建目录失败了获取不到
                'ppdir_name':0,
                'pdir_name':0,
                'dir_paths':0,
                'dir_id_paths':0
            });
        });

        var upload_attrs = {
            'dir_name':me.files.dir_name,
            'local_path':me.files.dir_path,
            'ppdir':me.ppdir,
            'pdir':me.pdir,
            'ppdir_name':me.ppdir_name,
            'pdir_name':me.pdir_name,
            'dir_paths':me.dir_paths,
            'dir_id_paths':me.dir_id_paths
        };
        //console.log(upload_attrs,ext_param);
        upload_event.trigger('add_folder_upload', me.upload_plugin, files, upload_attrs, ext_param);
        
    });

    //创建目录失败后的重试
    select_folder.folder_error_retry = function(cache_key){
        var me = this,
            def = $.Deferred(),
            cache = JSON.parse( select_folder.cache[cache_key] );
        if(!cache) {
            return;
        }

        request.post({
            url : 'http://web.cgi.weiyun.com/create_dir.fcg?token=' + security.getAntiCSRFToken(),
            cmd: 'create_dir',
            cavil : true,
            body: {
                ppdir_key: cache.ppdir,
                pdir_key: cache.pdir,
                sub_dir: cache.sub_dir
            }
        })
            .ok(function (rsp_msg, rsp_body) {
                //alert(JSON.stringify(body));
                def.resolve();
            })
            .fail(function (msg, ret) {
                def.reject(msg, ret);
            });
            
        return def;
    };

    module.exports = select_folder;
});/**
 * 上传:选择上传位置提示信息wording
 * @author bondli
 * @date 13-8-29
 */
define.pack("./select_folder.select_folder_msg",["$","lib","common","i18n"],function (require, exports, module) {

    var $ = require('$'),
        text = require('lib').get('./text'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1;


    var _wording = ($.browser.safari || !gbIsWin) ? 'Flash' : _(l_key,'极速上传'),
    	_install_qq_url = 'http://im.qq.com/',
    	_use_plugin_tips = ($.browser.msie) ? '<br>– '+_(l_key,'文件夹上传') : '',

    select_folder_msg = {
    	'NO_SUPPORT_UPLOAD_TO_PHOTO'     : _(l_key,'不支持上传文件夹到相册'),
    	//'PLEASE_INSTALL_PLUGIN_TO_PHOTO' : '请安装'+_wording+'控件以支持上传到相册',
        'PLEASE_INSTALL_PLUGIN_TO_PHOTO' : text.format(_(l_key,'请安装{0}控件以支持上传到相册'),[_wording]),
    	'DIR_LEVEL_REACH_MAX_LIMIT'      : _(l_key,'目录所在层级过深，请上传至其他目录'),
    	'NO_SUPPORT_G4_FILE'             : _(l_key,'暂不支持上传4G以上的文件。'),
    	'CHANGE_IE_TO_SUPPORT_G4_FILE'   : _(l_key,'当前浏览器单文件仅支持2G，您可以换用IE浏览器上传4G超大文件'),
    	'FLASH_UPLOAD_FILE_THAN_M300'    : _(l_key,'您要上传的文件超过300M，请启用极速上传。'),
    	'BROWSER_NO_SUPPORT_M300_FILE'   : _(l_key,'您的浏览器暂不支持上传300M以上的文件。'),
    	'ONLY_SUPPORT_UPLOAD_PHOTO'      : _(l_key,'仅可上传图片文件'),
    	'USE_PLUGIN_UPLOAD'              : _(l_key,'启用极速上传，立即享受：')+_use_plugin_tips+' <br>– '+_(l_key,'单文件最大32G')+' <br>– '+_(l_key,'秒传极速、断点续传')
    };

    //APPBOX中重置部分变量
    if( constants.IS_APPBOX ){
    	select_folder_msg['FLASH_UPLOAD_FILE_THAN_M300'] = _(l_key,'您要上传的文件超过300M，请安装最新版QQ。');
    	select_folder_msg['USE_PLUGIN_UPLOAD'] = _(l_key,'点击安装新版QQ启用极速上传，立即享受：<br>– 单文件最大32G <br>– 秒传极速、断点续传');
    	select_folder_msg['NO_SUPPORT_G4_FILE'] = _(l_key,'文件超过4G，请改用浏览器上传。');
    	select_folder_msg['CHANGE_IE_TO_SUPPORT_G4_FILE'] = _(l_key,'文件超过2G，请安装最新版本QQ。');
    }
    
    module.exports = {
        get : function( name ){
            return select_folder_msg[ name ];
        }
    };


});/**
 * 上传:选择上传位置UI
 * @author bondli
 * @date 13-8-29
 */
define.pack("./select_folder.select_folder_view",["lib","common","$","./tmpl","disk","i18n","main","./select_folder.file_dir_list","./select_folder.select_folder_msg"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),
        query_user = common.get('./query_user'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        main = require('main').get('./main'),

        file_dir_list = require('./select_folder.file_dir_list'),
        select_folder_msg = require('./select_folder.select_folder_msg'),

        undefined;

    var select_folder_view = new Module('select_folder_view', {

    	render : function () {
            var me = this;
            me.$dom = $(tmpl.select_folder());        //位置选择框对象
            me.$icon = me.$dom.find('[data-id=icon]');    //文件图标
            me.$name = me.$dom.find('[data-id=name]');    //文件名
            me.$chdir = me.$dom.find('[data-btn-id=CHDIR]');    //修改按钮
            me.$tree_ct = me.$dom.find('[data-id=tree-container]');  //目录树对象

            me.$chdir.on('click',function(e){
            	e.preventDefault();
                $(this).hide();
                me.click_chdir();
            });

        },

        /**
         * 显示修改路径的按钮
         */
        show_chdir_btn : function() {
        	this.$chdir.show();
        },

        /**
         * 显示icon和文件名
         */
        show_icon_and_name : function(icon, fullname, name) {
        	this.$icon.attr('class', 'filetype icon-' + icon);
        	this.$name.attr('title', fullname).html(name);
        },

        /**
		 * 点击修改默认路径
         */
        click_chdir : function(){
        	var me = this;
        	me.$tree_ct.fadeIn();

        	var node,
        		node_id;

            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                node = file_list.get_cur_node();
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_id = node.get_id();
            } 
            else 
            {
                node_id = query_user.get_cached_user().get_main_key();
            }
            //当前停留在相册的时候
            if(main.get_cur_mod_alias() == 'photo'){
                node_id = constants.UPLOAD_DIR_PHOTO;
            }

            //加载目录列表
            file_dir_list.show( me.$tree_ct, node_id );

            //调整选择框的位置
            ui_center.update( $('.dirbox') );

            //更新相册的文字显示和去掉上次选中的样式
            me.set_album_text();
            me.clear_album_selected();
        },
        /**
         * 设置按钮提示信息框位置
         */
        reset_box_pop_postion: function() {
            var me = this;
            if( constants.IS_APPBOX ){
                me.set_box_pop();
                me.$box_pop.find('.ui-pop-darr').show();
                me.$box_pop.find('.ui-pop-uarr').hide();
            }
            else{
                me.set_box_pop();
            }
        },
        /**
         * 设置按钮提示信息框
         */
        set_box_pop : function(right) {
            var me = this;
            me.$box_pop = $('.upload-box-pop');
            me.$box_pop.find('.ui-pop-uarr').show();
            me.$box_pop.find('.ui-pop-darr').hide();

            if(constants.IS_APPBOX){
                me.$box_pop.css({top:'auto',right: right || '30px',bottom:'-70px'});
            } else {
                me.$box_pop.css({top:'auto',right: right || '80px',bottom:($.browser.msie ? '-80px' : '-62px')});
            }
            new Pop_panel({
                $dom: me.$box_pop,
                host_$dom: $('a[data-btn-id=OTHER]'),
                show: function () {
                    me.$box_pop.show();
                },
                hide: function () {
                    me.$box_pop.hide();
                },
                delay_time: 50
            });
        },
        /**
         * 设置相册目录旁边的文字
         */
        set_album_text : function (text) {
            var default_text = '<i style="visibility:hidden;"></i>'+_(l_key,'相册');
            text = (text) ? '<label>（'+ text +'）</label>' : '';
            $('#album').html(default_text + text);
        },

        /**
         * 清除相册上的选中样式
         */
        clear_album_selected : function() {
        	$('#_file_box_node_-1').children('a').removeClass('selected');
        }

    });

    //select_folder_view.render();

    module.exports = select_folder_view;

});/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define.pack("./select_folder.upload_4g_validata",["common","$","i18n"],function(require, exports, module) {

	var common = require('common'),
		$ = require('$'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload';
	var map = {
		max_file_size: function( file_size, max_size ){
			if ( file_size >= max_size ){
				return [_(l_key,'您所选的文件超过32G，无法上传。'), 1];
			}
		},
		/*low_file_size: function( file_size, size ){
			if ( file_size < size ){
				return ['你选择的文件小于4G。', 2];
			}
		},
		arrive_max_space: function( space_all, max_space ){
			if ( space_all >= max_space ){
				return ['你的容量达到上限1T，不会再赠送容量了。', 4];
			}
		},*/
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return [_(l_key,'容量不足，请参与送容量活动'), 3];
			}
		}

	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define.pack("./select_folder.upload_folder_validata",["common","$","lib","i18n"],function(require, exports, module) {

	var common = require('common'),
		$ = require('$'),
        text = require('lib').get('./text'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload';

	var map = {
		empty_files: function(files){
			if ( files == false ){
				return [_(l_key,'暂不支持上传整个盘符，请重新选择。'), 1];
			}
		},
		max_dir_size: function( dir_total_num, max_dir_mun ){
			if ( dir_total_num > max_dir_mun ){
                return [text.format(_(l_key,'文件夹中文件夹总数超过{0}个，请分批上传。'),[max_dir_mun]),2];
				//return ['文件夹中文件夹总数超过'+ max_dir_mun +'个，请分批上传。', 2];
			}
		},
		max_level_size: function( dir_level_num, dir_name, max_level_num ){
			if ( dir_level_num  > max_level_num ){
                return [text.format(_(l_key,'文件夹{0}下文件总数超过{1}个，请管理后上传。'),[dir_name,max_level_num]),3];
				//return ['文件夹"'+dir_name+'"下文件总数超过'+ max_level_num +'个，请管理后上传。', 3];
			}
		},
		max_files_size: function( files_size, max_files_num ){
			if ( files_size > max_files_num ){
                return [text.format(_(l_key,'文件夹中文件总数超过{0}个，请分批上传。'),[max_files_num]),4];
				//return ['文件夹中文件总数超过'+ max_files_num +'个，请分批上传。', 4];
			}
		},
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return [_(l_key,'容量不足，请删除一些旧文件或升级空间'), 5];
			}
		}

	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.count_box",["lib"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        BOX = function () {
            var me = this;
            me.max = 4;//最大缓冲区长度
            me.cur = 0;//当前缓冲区位置
            me.speed = 0;//输出的速度
            me.total = 0;//缓冲区内总大小
            me.zero_times = 0;//连续出现速度为0的次数
            me.last= {
                time: 0,
                processed: 0,
                task: null
            };
        };
    BOX.prototype = {
        set: function (speed) {//设置平均速度
            var me = this;
            me.cur += 1;
            if (me.max === me.cur) {
                me.cur -= 1;
            }
            me.total += speed;
            me.total = me.speed = ( me.total / me.cur ) | 0;
            me.zero_times = me.speed > 0 ? 0 : (me.zero_times + 1);
        },
        get: function () {//获取平均速度
            return this.speed;
        },
        reset: function () {
            var me = this;
            me.cur = me.speed = me.total = me.zero_times = 0;
            me.init_task(null, 0);
        },
        init_task: function (task, time) {
            var me = this;
            me.last = {
                time: time,
                processed: task && task.processed || 0,
                task: task
            }
        }
    };
    var upload = new BOX(), //上传
        downloads = {};//下载
    var count_box = {
        /**
         * 获取当前的网络速度
         * @param [running]
         * @returns {*}
         */
        get_speed: function (running) {
            var time = +new Date(),
                running = running || upload;
            if (running.last.time) {
                if (running.last.task === this) {
                    running.set(Math.max((this.processed - running.last.processed) / (time - running.last.time) * 1000 | 0, 0));
                } else {
                    running.reset();
                }
            }
            running.init_task(this, time);
            return running.get();
        },
        /**
         * 重置速度计算器
         * @param [running]
         */
        reset_speed: function (running) {
            (running || upload).reset();
        },
        delay_times:{
            'upload_flash':60,
            'active_plugin':30,
            'webkit_plugin':30
        },
        /**
         * 是否网络延迟：一段时间内，同一个文件传输的量没有变化，就被认为网络超时
         * @returns {boolean}
         */
        network_is_delay: function () {
            return upload.zero_times > count_box.delay_times[upload.last.task.upload_type];
        },
        /**
         * 获取当前正在计速的文件
         * @param [running]
         * @returns {null}
         */
        get_task: function (running) {
            return (running || upload).last.task;
        },

        down: {
            get_speed: function (key) {
                return count_box.get_speed.call(this, downloads[key]);
            },
            reset_speed: function () {
                for (var key in downloads) {
                    count_box.reset_speed(downloads[key]);
                }
            },
            remove: function (key) {
                delete downloads[key];
            },
            add: function (key) {
                if(!downloads[key]){
                    downloads[key] = new BOX();
                }
            }
        }
    };
    return count_box;
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.download",["lib","./tool.upload_cache","./speed.count_box","./tool.bar_info"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        Cache= require('./tool.upload_cache'),
        bar_info,//统计信息UI模块
        BOX= require('./speed.count_box'),//正真的速度计算模块

        done_states = ' done error ',//已完成的状态
        get_bar = function(){
            return bar_info || (bar_info = require('./tool.bar_info'));
        },
        watch_fn = function () {
            if (Cache.get_dw_main_cache().is_done()) {//任务已经完成，返回
                return;
            }
            var cache = Cache.get_dw_main_cache().get_cache(),
                speed = 0;
            for (var key in cache) {
                if(key !== 'length'){
                    var unit = cache[key];
                    if( -1 !== done_states.indexOf(' '+ unit.state + ' ') ){
                        BOX.down.remove(key);
                    } else{
                        BOX.down.add(key);
                        var tmp = BOX.down.get_speed.call(unit,key);
                        speed += tmp;
                    }
                }
            }
            get_bar().update(get_bar().OPS.DOWN_SPEED, speed );
        };

    return {
        /**
         * 速度计算轮询函数
         */
        watch_fn: watch_fn,
        /**
         * 重置计速
         */
        reset: function(){
            BOX && BOX.reset_speed();
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.speed_task",["./tool.upload_cache","./speed.upload","./speed.download","lib","./tool.bar_info"],function (require, exports, module) {
    var Cache = require('./tool.upload_cache'),
        up = require('./speed.upload'),//上传测算速度模块
        dw = require('./speed.download'),//下载测算速度模块
        console = require('lib').get('./console'),
        inter_code,
        bar_info,
        get_bar = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        };
    return {
        /**
         * 妙传文件，重设速度
         * @param speed
         */
        set_maioc: function (speed) {
            up.set_miaoc_speed(speed);
        },
        /**
         * 开启 速度检查定时器
         */
        start: function () {
            if (!inter_code) {
                var up_num = Cache.get_up_main_cache().has_task_running(),//有上传任务处于运行状态
                    dw_num = Cache.get_dw_main_cache().has_task_running();//有下载任务处于运行状态
                if (up_num + dw_num === 1) {//只有一种任务在跑，并且没有被当前任务watch，才进行新的watch
                    if (up_num === 1) {
                        inter_code = setInterval(up.watch_fn, 2000);//上传频率2秒
                    } else {
                        inter_code = setInterval(dw.watch_fn, 1500);//下载频率1.5秒
                    }
                }
            }
            get_bar().toggle_speed_msg();
        },
        /**
         * 停止 速度检查定时器
         */
        stop: function () {
            if (inter_code) {
                clearInterval(inter_code);
                inter_code = false;
                dw.reset();
                up.reset();
            }
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define.pack("./speed.upload",["lib","./tool.upload_cache","./speed.count_box","./tool.bar_info"],function (require, exports, module) {
    var lib = require('lib'),
        console = lib.get('./console'),

        Cache = require('./tool.upload_cache'),
        BOX = require('./speed.count_box'),//正真的速度计算模块
        bar_info,//统计信息类
        get_bar = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        },

        two_m = Math.pow(2, 21),//2M
        limit_time = {//检查最大次数
            'upload_flash': 0,
            'webkit_plugin': 0,
            'active_plugin': 0
        },

        speed = 0,
        able_state = {'upload_file_update_process': 1},//能获取速度的运行状态
        make_speed = function () {// 获取当前速度  {number :　0: 网络超时， 1：有可用速度 ,-1:不能获取速度的状态 }
            var running = Cache.get_curr_real_upload();
            if (running && able_state[running.state]) {//可获取速度的状态
                speed = BOX.get_speed.call(running);//获取上传速度
                if (speed === 0 && BOX.network_is_delay()) {
                    return 0;
                } else {
                    return 1;
                }
            } else {//不能获取速度状态
                speed = -1;
                return 1;
            }
        },
        watch_fn = function () {
            if (Cache.get_up_main_cache().is_done()) {//上传任务已经完成，返回
                return;
            }
            var sign = make_speed();
            if (sign === 0) {//超时
                var task = BOX.get_task(),//获取 计算速度的 上传对象
                    type = task.upload_type;
                if (task && type !== 'upload_form') {//表单上传不参与 超时重试，form有自己的超时机制
                    var time = task.re_try_time ? task.re_try_time : (task.re_try_time = 0);
                    if (time >= limit_time[type]) {
                        console.debug('re_try times over max ,trigger error');
                        if(task.get_is_retry() === false){ //判断是否重试，不是重试就重来一次
                            task.change_state('re_try');
                        }
                        else{
                            task.change_state('error', 10000);//自动重试后，报出超时错误
                        }
                        
                        task.re_try_time = 0;
                    } else {
                        task.re_try_time = !task.re_try_time ? 1 : ( task.re_try_time + 1 );//更新重试次数
                        console.debug('re_try by network time:', task.re_try_time);
                        BOX.reset_speed();//计速重置
                        task.events.re_start.call(task);
                    }
                }
                return;
            } else {
                get_bar().update(get_bar().OPS.UP_SPEED, speed);
            }
        };

    return {
        /**
         * 设置妙传速度
         * @param miaoc_speed
         */
        set_miaoc_speed: function (miaoc_speed) {
            speed = miaoc_speed > two_m ? two_m : miaoc_speed;
        },
        /**
         * 速度计算轮询函数
         */
        watch_fn: watch_fn,
        /**
         * 重置计速
         */
        reset: function () {
            BOX && BOX.reset_speed();
        }
    };
});define.pack("./tool.bar_info",["lib","i18n","common","$","./tool.upload_cache","./speed.speed_task","./upload_route","./view"],function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        common = require('common'),
        File = common.get('./file.file_object'),
        constants = common.get('./constants'),
        $ = require('$'),

        Cache = require('./tool.upload_cache'),
        speed_task = require('./speed.speed_task'),
        upload_route = require('./upload_route'),

        //lt_ie9 = $.browser.msie && $.browser.version < 9,
        //text_resume = '{num}个上传任务已暂停，<a action="click_resume" style="cursor:pointer;">继续上传</a>',

        view,//视图模块
        get_view = function () {//获取视图对象
            return view || (view = require('./view'));
        },
        $left_time,//剩余时间
        $all_time,//耗时
        $speed,//速度
        hide_whole_info = false,//是否隐藏 耗时/速度/剩余时间

        bar_states = {
            error: 'state-error',//错误class
            process: 'fn-col state-text state-uploading',//处理中class
            done: 'state-completed'//完成class
        };
    //上传的信息条
    var upload_bar = function (e) {
        this.$process = e.$process;
        this.$process_wrap = e.$process_wrap;
        //this.task_name = _(l_key,'传输');
        this.task_name = '传输';
    };
    $.extend(upload_bar.prototype, {
        /**
         * 结果、进度信息展示的地方
         * @returns {jQuery Element}
         */
        get_$process: function () {
            return this.$process;
        },
        /**
         * $process 包装的元素
         * @returns {jQuery Element}
         */
        get_$process_wrap: function () {
            return this.$process_wrap;
        },
        /**
         * 最大剩余时间
         * @returns {number}
         */
        get_max_time: function () {
            return this._max_secs || ( this._max_secs = 24 * 60 * 60);//24小时
        },
        /**
         * 格式化时间格式
         * @param secs
         * @returns {string}
         * @private
         */
        format_time: function (secs) {
            var h = '', m = '' , s = '';
            var h_unit = _(l_key,'小时'),m_unit = _(l_key,'分'),s_unit = _(l_key,'秒');
            if (secs < 60) {
                s = secs > 0 ? (secs + s_unit) : '';
            } else if (secs > 3600) {
                h = Math.floor(secs / 3600),
                    m = Math.floor((secs - h * 3600) / 60);
                h = h > 0 ? ( h + h_unit ) : '';
                m = m > 0 ? ( (m < 10 ? ('0' + m) : m) + m_unit ) : '';
            } else {
                m = Math.floor(secs / 60);
                s = secs % 60;
                m = m > 0 ? (m + m_unit) : '';
                s = s > 0 ? ( (s < 10 ? ('0' + s) : s) + s_unit) : '';
            }
            return h + m + s;
        },
        /**
         * 获取测速对应的cache
         * @returns {*}
         */
        get_cache: function () {
            return Cache.get_up_main_cache();
        },
        get_down_cache: function () {
            return Cache.get_dw_main_cache();
        },
        /**
         * 总大小
         * @returns {number}
         */
        get_total: function () {
            return this.get_cache().get_total_size()+this.get_down_cache().get_total_size();
        },
        /**
         * 已传输大小
         * @returns {number}
         */
        get_passed: function () {
            var cache = this.get_cache(),
                passed = cache.get_passed_size(),
                running = cache.get_curr_upload();
            if (running && running.processed) {
                passed += running.processed;
            }
            return passed;
        },

        get_down_passed: function () {
            try{
                var cache = this.get_down_cache(),
                    passed = cache.get_passed_size(),
                    tasks = cache.get_down_cache();
                if (tasks.length > 0) {
                    for (var key in tasks.length) {
                        if (key !== 'length' && -1 === ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
                            passed += tasks[key].processed;
                        }
                    }
                }
            }catch(e){
                return 0
            }
            return passed;
        },
        /**
         * 是否已经完成
         * @returns {boolean}
         */
        is_done: function () {
            return this.get_cache().is_done() && this.get_down_cache().is_done();
        },
        /**
         * 设置任务剩余时间
         * @param speed
         */
        set_left_time: function (speed) {
            if (speed === -1 || speed === 0) {
                $left_time.hide();
                return;
            }
            var secs = ( (this.get_total() - this.get_passed()-this.get_down_passed()) / speed ) | 0;
            if (secs <= 0 || this.get_max_time() < secs) {
                secs = this.get_max_time();
            }
            $left_time
                .html(_(l_key,'剩余') + this.format_time(secs))
                .css('display', 'inline-block');
        },
        /**
         * 设置任务速度
         * @param speed
         */
        set_speed: function (speed) {
            if (speed > 0) {//运行任务已具备获取速度的必备条件
                $speed
                    .html(File.get_readability_size(speed) + '/s')
                    .css('display', 'inline-block');
            } else {
                $speed.hide();
            }
        },
        /**
         * 设置进度信息
         */
        set_process: function () {
            var up_cache = this.get_cache(),
                down_cache =this.get_down_cache();
            if (up_cache.is_done() && down_cache.is_done()) {
                speed_task.stop();//停止计速
                bar_info.when_tasks_end(this.task_name);
                return this.toggle();//隐藏当前条目
            }
            var up_info = up_cache.get_count_nums(),
                down_info =down_cache.get_count_nums(),
                html = _(l_key,'正在传输：') + (up_info.error + up_info.done + 1+down_info.error+down_info.done) + '/'
                    + (up_info.length +down_info.length - up_info.pause - down_info.pause);
            this.get_$process_wrap().parent().removeClass(bar_states.error).removeClass(bar_states.done);
            this.toggle(true, html);
            form_bar.show();
        },
        /**
         * 设置任务完成(没有正在和server交互的任务执行)
         */
        set_done: function () {
            var up_cache = this.get_cache(),
                down_cache =this.get_down_cache(),
                down_info = down_cache.get_count_nums(),
                up_info = up_cache.get_count_nums();
            if (up_info.length +down_info.length === 0) {
                this.toggle();//隐藏当前条目
                return;
            }
            if (up_info.length+down_info.length === up_info.pause +down_info.pause) {//没有任务，直接隐藏
                return this.toggle();
            }
            var tail = up_cache.is_contain_folder() ? '个文件（夹）' : '个文件',
                ok = up_info.done+down_info.done,
                er = up_info.error +down_info.error,
                html = ok > 0 ? ('{ok}' + tail + this.task_name + '成功') : '';
            if (up_info.error+down_info.error > 0) {
                if(html == ''){
                    html =  '{er}' +tail+'传输失败'
                }else{
                    html += "，"+ '{er}' +'个失败'
                }
            }
            /*
            [
             '{ok}个文件（夹）传输成功',
             '{ok}个文件传输成功',
             '{ok}个文件（夹）传输成功,{er}个失败',
             '{ok}个文件输成功,{er}个失败',
             '{er}个文件（夹）传输失败',
             '{er}个文件传输失败'
            ]
             */
            html = text.format(_(l_key,html),{'ok':ok,'er':er});
            var is_error = (up_info.error +down_info.error) > 0;
            //控制图标
            this.get_$process_wrap().parent()
                .toggleClass(bar_states.done,!is_error)
                .toggleClass(bar_states.error,is_error);

            this.toggle(true,html);
        },
        /**
         * 条目的显示与隐藏/填充进度信息/样式操作
         * @param {Boolean} [show] 是否显示
         * @param {String} [html] 条目的文本信息
         */
        toggle: function (show, html) {
            if (!show) {
                this._state = 'hide';
                this.get_$process_wrap().css('display', 'none');
            } else {
                this._state = 'show';
                if (html) {
                    this.get_$process().html(html);//显示任务结果信息
                }
                this.get_$process_wrap()
                    .css('display', 'inline-block');
            }
        },
        /**
         * 当前显示状态是否隐藏
         */
        is_hide: function () {
            return this._state === 'hide';
        },

        /**
         *判断正在运行的任务全部都是打包下载
         */
        is_all_package: function () {
            var me = this;
            if (me.is_done()) {
                return false;
            }
            var tasks = this.get_down_cache().get_cache();
            for (var key in tasks) {
                if (key !== 'length' && ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
                    if (!tasks[key].is_package()) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 清除上一次的html和icon
         */
        destroy: function () {
            $left_time.html('');
            $speed.html('');
            this.get_$process().html('');
        }
    });

    //form进度条显示与开启
    var form_bar = {
        _$form_bar: null,
        _has_bar: function () {
            return upload_route.type === 'upload_form' && this._$form_bar;
        },
        show: function () {
            if(this._has_bar()) {
                bar_info.upload.get_$process_wrap().parent().addClass('form-mini-progress');
            }
        },
        hide: function () {
            if(this._has_bar()) {
                bar_info.upload.get_$process_wrap().parent().removeClass('form-mini-progress');
            };
        }
    };
    var bar_info = {
        destroy: function () {
            this.upload && this.upload.destroy();
            this.can_re_start_error = {length: 0};
        },
        /**
         * 初始化
         */
        init: function (upload_param, com) {
            this.upload = new upload_bar(upload_param);
            $left_time = com.$left_time;//剩余时间
            //$all_time = com.$all_time;//总耗时  <优化>移除总耗时信息
            $speed = com.$speed;//速度
            form_bar._$form_bar = com.$form_bar;
        },
        /**
         * 满足有另外一个类任务运行时，开始测速
         * @param task_name
         */
        when_tasks_end: function (task_name) {
            var who = this.upload;
            if (!who.is_done() && who.get_cache().get_all_length() > 0) {
                speed_task.start();//重新开始测速
            }
        },
        /**
         * 根据 上传、下载任务种类个数  控制上传、下载条目的显示
         */
        toggle_speed_msg: function () {
            var up_num = Cache.get_up_main_cache().has_task_running(),//有上传任务处于运行状态
                dw_num = Cache.get_dw_main_cache().has_task_running();//有下载任务处于运行状态
            if (up_num + dw_num === 2) {
                if (!hide_whole_info) {//
                    hide_whole_info = true;
                    $left_time.hide();
                    //$all_time.hide();
                    $speed.hide();
                }
            } else {
                hide_whole_info = false;
                (up_num + dw_num) === 0 && !this.upload.is_hide() && this.upload.toggle();//隐藏
                if (up_num === 0 && dw_num === 1 && this.upload.is_all_package()) {
                    hide_whole_info = true;
                    $left_time.hide();
                    //$all_time.hide();
                    $speed.hide();
                }
            }
        },
        OPS: {
            DOWN_SPEED: 1,//更新下载速度
            UP_SPEED: 2,//更新上载速度
            DOWN_CHECK: 3,//检查下载进度
            UP_CHECK: 4//检查上载进度
        },
        process_states: {//可进行 更新进度信息的状态
            'init': 1,
            'start_upload': 1,
            'to_continuee': 1,
            'continuee': 1,
            'to_resume_continuee': 1,
            'start': 1,
            'error': 1,
            're_start': 1,
            'clear': 1,
            'done': 1,
            'pause': 1,
            'resume_pause': 1,
            'resume_continuee': 1
        },
        can_re_start_error: {length: 0}, //用于任务完成后，判断是否显示 "全部重试"
        check_error: function (task) {
            var list = this.can_re_start_error,
                id = task.del_local_id,
                state = task.state;
            if (state === 'error') {
                if (!list[id]) {
                    if (task.can_re_start()) {
                        list[id] = id;
                        list.length += 1;
                    }
                }
            } else if (-1 !== ' re_start clear '.indexOf(' ' + state + ' ')) {
                if (list[id]) {
                    delete list[id];
                    list.length -= 1;
                    if (list.length === 0) {
                        var a_tag = this.upload.$process.find('a');
                        if (a_tag.length > 0) {
                            a_tag.hide();
                        }
                    }
                }
            }
        },
        /**
         * 所有任务是否已经完成（没有正在上传、下载任务在执行）
         * @returns {*}
         */
        is_done: function () {
            return this._is_done;
        },
        /**
         * 全部完成
         */
        finished: function () {
            var me = this,
                view = get_view();
            view.set_end_btn_style(true, Cache.get_close_btn_text());//设置按钮的样式和文本

            $left_time.hide();//隐藏剩余时间
            $speed.hide();//隐藏速度
            speed_task.stop();//停止计速
            me.upload.set_done();//更新传输条目显示的完成信息
            form_bar.hide();//隐藏form上传条
            me._is_done = true;//标识完成

            var counts = me.upload.get_cache().get_count_nums();//上传统计cache
            var d_counts = me.upload.get_down_cache().get_count_nums();//下载统计cache

            if ( (counts.length > 0 && counts.pause > 0) || (d_counts.length > 0 && d_counts.pause > 0) ) {

                me.upload.toggle( true );

                if( d_counts.pause && counts.pause==0 ){ //只有下载暂停

                    me.upload.get_$process().html(
                        text.format(_(l_key,'{n}个下载任务已暂停'),{n:d_counts.pause})
                    );

                }
                else if(counts.pause && d_counts.pause==0){ //只有上传暂停

                    me.upload.get_$process().html(
                        text.format(_(l_key,'{n}个上传任务已暂停'),{n:counts.pause})
                            +
                        ' , <a action="click_resume" style="cursor:pointer;">'+_(l_key,'继续上传')+'</a>'
                    );

                }
                else if(counts.pause && d_counts.pause){ //上传，下载都有暂停

                    me.upload.get_$process().html(
                        text.format(_(l_key,'{n}个下载任务已暂停'),{n:d_counts.pause})
                            +
                        ','+text.format(_(l_key,'{n}个上传任务已暂停'),{n:counts.pause})
                            +
                        ' , <a action="click_resume" style="cursor:pointer;">'+_(l_key,'继续上传')+'</a>'
                    );
                }

                //去掉错误图标
                me.upload
                    .get_$process_wrap()
                    .parent()
                    .toggleClass(bar_states.error, false);
            } else {
                me.upload.get_$process().html(me.upload.get_$process().html() + "！");
            }
        },
        /**
         * 任务管理器中的任务已完成(上传、下载，其中的暂停/出错不计算在内)
         */
        is_finished: function () {
            return this.upload.is_done();
        },
        /**
         * 更新bar的相关信息
         * @param type
         * @param speed
         */
        update: function (type, speed) {
            var me = this,
                ops = me.OPS;
            if (me._is_done) {//之前完成过一次，隐藏耗时
                //$all_time.html('').hide();//总耗时
                get_view().set_end_btn_style(true, Cache.get_close_btn_text());
            }
            me._is_done = false;//任务完成标志
            switch (type) {
                case(ops.UP_SPEED)://更新上传速度
                    if (!hide_whole_info) {
                        me.upload.set_speed(speed);
                        me.upload.set_left_time(speed);
                    }
                    break;
                case(ops.DOWN_SPEED)://更新下载速度
                    if (!hide_whole_info) {
                        me.upload.set_speed(speed);
                        me.upload.set_left_time(speed);
                    }
                    break;
                case(ops.DOWN_CHECK)://下载状态变换更新
                    me.upload.set_process();
                    if (me.is_finished()) {
                        me.finished();
                    } else {
                        me.toggle_speed_msg();
                    }
                    break;
                case(ops.UP_CHECK)://上传状态变换更新
                    me.upload.set_process();
                    if (me.upload.is_done()) {
                        get_view().refresh_space_info();//上传任务完成时，刷新容量
                    }
                    if (me.is_finished()) {
                        me.finished();
                    }
                    break;
            }
        }
    };
    return bar_info;
});/**
 * User: trumpli
 * Date: 13-7-30
 * Time: 下午8:29
 */
define.pack("./tool.upload_cache",["lib","$","./tool.upload_queue","i18n","./tool.upload_static"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        $ = require('$'),
        Queue = require('./tool.upload_queue'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        Static,
        get_static= function(){
            return Static || (Static = require('./tool.upload_static'));
        };

    var Cache = function (cache_key) {
        this.cache_key = cache_key;
        this.cache = {length:0};
        this.curr_cache = {length: 0};//当前正在上传的任务
        this.total_size = 0;//上传总量
        this.passed_size = 0;//已上传量
        this.count_nums = {'pause':0,'error':0,'done':0,'length':0};
        this.folder_type = -1;
    };

    $.extend(
        Cache.prototype,
        {
            _clear: function () {//清空
                this.passed_size = this.total_size = 0;
                this.cache = {length:0};
                this.count_nums = {'pause':0,'error':0,'done':0};
                this.curr_cache = {length:0};
                Queue.clear(this.cache_key);
                delete this._queue;
            },

            plus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(!task[has_key]){
                    this.count_nums[key] += 1;
                    task[has_key] = true;
                }
            },
            minus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(task[has_key]){
                    this.count_nums[key] -= 1;
                    task[has_key] = false;
                }
            },
            get_all_length: function () {
                return this.cache.length;
            },
            get_total_size: function (total_size) {
                if (total_size) {
                    this.total_size = total_size;
                }
                return this.total_size;
            },
            get_passed_size: function (passed_size) {
                if (passed_size) {
                    this.passed_size = passed_size;
                }
                return this.passed_size;
            },
            get_count_nums: function(){
                this.count_nums.length = this.cache.length;
                return this.count_nums;
            },
            is_done: function () {
                var counts = this.get_count_nums();
                return counts.length <= counts.error + counts.pause + counts.done;
            },

            get_curr_upload: function () {
                return this.cache[this.get_queue().get_only_key()];
            },
            get_curr_cache: function () {
                return this.curr_cache;
            },

            pop_curr_cache: function(del_id){
                if(this.curr_cache[del_id]){
                    delete this.curr_cache[del_id];
                    this.curr_cache.length-=1;
                }
            },
            push_curr_cache: function(id,ctx){
                if(!this.curr_cache[ id ]){
                    this.curr_cache[ id ] = ctx;
                    this.curr_cache.length += 1;
                }
            },

            get_cache: function () {
                return this.cache;
            },
            push_cache: function(id,ctx){
                if( !this.cache[id] ){

                    this.cache[id] = ctx;
                    this.cache.length+=1;

                }
            },
            pop_cache: function(id){
                if( !!this.cache[id] ){
                    delete this.cache[id];
                    this.cache.length-=1;
                }
            },
            each: function (fn) {
                var cache = this.get_cache();
                for(var key in cache){
                    if(key!=='length'){
                        if( false === fn.call(cache[key])){
                            return;
                        }
                    }
                }
            },
            get_queue: function () {
                return this._queue || ( this._queue = Queue.get(this.cache_key) );
            },
            /**
             * 任务中是否含有文件夹
             * @param force强制从缓存中读取
             */
            is_contain_folder: function( force ){
                var me = this;
                if(me.folder_type === -1 || force){
                    me.folder_type = false;
                    me.each(function(){
                        if( get_static().FOLDER_TYPE  === this.file_type ){
                            me.folder_type = true;
                            return false;
                        }
                    });
                }
                return me.folder_type;
            },
            /**
             * 执行下一个任务
             */
            do_next: function(){
                var me = this;
                if(me.curr_cache.length == 0){
                    if( ! get_static().cpu.is_proxy_able(
                        function(){
                            me.get_queue().dequeue();
                        }
                    )){
                        setTimeout(function(){
                            me.get_queue().dequeue();
                        },get_static().cpu.get_immediate_time());
                    }
                }
            },
            /**
             * 集合中是否有正在运行的任务
             * @returns {number} 1:有任务正在运行，0:已经没有任务在运行了
             */
            has_task_running: function(){
                if(this.get_all_length() > 0 && !this.is_done())
                    return 1;
                return 0;
            }
        }
    );

    var caches = {length: 0};

    return {
        default_cache_key: 'default_cache_key',//上传默认Cache
        default_down_cache_key: 'down_cache_key',//下载默认Cache
        /**
         * 上传管理器中的总长度
         */
        length: function(){
            return this.get_up_main_cache().get_count_nums().length + this.get_dw_main_cache().get_count_nums().length;
        },
        /**
         * 获取完成按钮 名称
         * @returns {string}
         */
        get_close_btn_text: function(){
            var up = this.get_up_main_cache().get_count_nums(),
                dw   = this.get_dw_main_cache().get_count_nums();
            if( up.length === up.error + up.pause + up.done
                &&
                dw.length === dw.done
                )
                return '<span class="btn-inner">'+_(l_key,'完成')+'</span>';
            if( up.length + dw.length > 1)
                return '<span class="btn-inner">'+_(l_key,'全部取消')+'</span>';
            return '<span class="btn-inner">'+_(l_key,'全部取消')+'</span>';
        },
        /**
         * 是否初始化
         * @returns {boolean}
         */
        is_init: function () {
            return caches.length > 0;
        },
        /**
         * 获取cache
         * @param cache_key
         * @returns {*}
         */
        get: function (cache_key) {
            var _key = cache_key || this.default_cache_key;
            if (!caches[_key]) {
                caches[_key] = new Cache(_key);
                caches.length += 1;
            }
            return caches[_key];
        },
        /**
         * 清空
         * @param key 可选
         */
        clear: function (key) {
            var key = key || this.default_cache_key;
            if(caches[key]){
                caches[key]._clear();
                caches[key] = null;
                delete caches[key];
                caches.length -= 1;
            }
        },
        /**
         * 获取指定local_id的任务对象
         * @param local_id
         * @returns {*}
         */
        get_task: function(local_id){
            for (var key in caches) {
                if (key === 'length')
                    continue;
                var task = caches[key].get_cache()[local_id];
                if (task) {
                    return task;
                }
            }
        },
        /**
         * 获取上传主任务cache
         * @returns {*}
         */
        get_up_main_cache: function () {
            return this.get(this.default_cache_key);
        },
        /**
         * 获取下载主任务cache
         * @returns {*}
         */
        get_dw_main_cache: function () {
            return this.get(this.default_down_cache_key);
        },
        /**
         * 通过 local_id 获取主任务中的对象，注意：这种获取方式，只适用于文件夹
         * @param local_id
         * @returns {*}
         */
        get_folder_by_id: function (local_id) {
            return this.get_up_main_cache().cache[local_id];
        },
        /**
         * 获取当前正真上传的任务
         * @returns {*}
         */
        get_curr_real_upload: function () {
            var task = this.get_up_main_cache().get_curr_upload();
            if (task && get_static().FOLDER_TYPE  === task.file_type) {
                return task.get_sub_cache().get_curr_upload();
            }
            return task;
        }
    }
});
define.pack("./tool.upload_queue",["$","lib"],function (require, exports, module) {

    var $ = require('$'),
        console = require('lib').get('./console'),
        Queue = function () {
            this.fn_stack = [];
            this.ctx_stack = [];
            this.only_key = 0;
        },
        queues = {length: 0};

    $.extend(Queue.prototype,
        {
            length: function(){
                return this.fn_stack.length;
            },
            head: function (ctx, fn) {
                this.remove(this.del_local_id);
                this.fn_stack.unshift(fn);
                this.ctx_stack.unshift(ctx);
            },
            tail: function (ctx, fn) {
                fn.del_local_id = ctx.del_local_id;
                this.fn_stack.push(fn);
                this.ctx_stack.push(ctx);
            },
            dequeue: function (len) {
                if (this.fn_stack.length === 0) {
                    return;
                }

                len = Math.min(this.fn_stack.length, len || 1);

                var fn, ctx;
                for (var i = 0; i < len; i++) {
                    fn = this.fn_stack.shift();
                    ctx = this.ctx_stack.shift();
                    this.only_key = ctx.local_id;
                    fn && fn.call(ctx);
                }
            },
            clear: function () {
                this.fn_stack.length = 0;
                this.ctx_stack.length = 0;
            },

            remove: function (del_local_id) {
                if(!del_local_id)
                    return;
                for (var len = this.fn_stack.length - 1; len >= 0; len--) {
                    var c = this.fn_stack[len];
                    if (c.del_local_id === del_local_id) {
                        this.fn_stack.splice(len, 1);
                        this.ctx_stack.splice(len, 1);
                        return true;
                    }
                }
            },
            get_only_key: function () {
                return this.only_key;
            },
            set_only_key: function (s_id, t_id) {//扫描后更新了local_id需要做出调整
                if (!s_id || this.only_key === s_id) {
                    this.only_key = t_id;
                }
            }
        });


    module.exports = {
        get: function (key) {
            var _key = key || 'default_key';
            if (!queues[_key]) {
                queues[_key] = new Queue();
                queues.length += 1;
            }
            return queues[_key];
        },
        clear: function (key) {
            var _key = key || 'default_key';
            if(queues[_key]){
                queues[_key].clear();
                queues[_key] = null;
                queues.length -= 1;
                delete queues[_key];
            }
        }
    }
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-1
 * Time: 下午3:53
 */
define.pack("./tool.upload_static",["lib","common","$","i18n","./tool.upload_cache","./speed.speed_task","./msg","disk","./view","./tool.bar_info"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        upload_event = common.get('./global.global_event').namespace('upload2'),
        widgets = common.get('./ui.widgets'),
        functional = common.get('./util.functional'),

        Cache = require('./tool.upload_cache'),
        speed_task = require('./speed.speed_task'),
        msg = require('./msg'),
        disk_mod = require('disk'),
        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),

        view,//视图模块
        get_view = function () {
            return view || (view = require('./view'));
        },
        bar_info,//
        get_bar_info = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        };

    var Static = {
        FILE_TYPE: 1,//文件标识
        FOLDER_TYPE: 2,//文件夹标识
        OP_TYPES: {
            DOWN: 1,//下载
            UPLOAD: 2//上传
        },
        /**
         * 能暂定上传的状态
         */
        _can_stop_states: { 'start': 1, 'upload_file_update_process': 1, 'file_sign_update_process': 1, 'file_sign_done': 1, 'continuee': 1 },
        /**
         * 能继续传的状态
         */
        _can_resume_states: {'upload_file_update_process': 1, 'pause': 1, 'resume_pause': 1, 'processing': 1},
        /**
         * 获取错误提示消息
         * @param code
         * @param msg_type
         * @param error_type
         * @param error_step 控件错误的调试位置
         * @returns {*}
         */
        get_error_msg: function (code, msg_type, error_type, error_step) {
            return msg.get(error_type || 'upload_error', code, msg_type, error_step);
        },
        /**
         * 停止上传
         * @param cache_key cache的对应的key
         */
        stop_upload_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_cache_key).get_cache();
            for (var key in cache) {
                if (this._can_stop_states[cache[key].state]) {
                    cache[key].stop_upload();
                }
            }
        },
        /**
         * 停止下载
         * @param cache_key cache的对应的key
         */
        stop_down_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_down_cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length') {
                    cache[key].remove_file();
                }
            }
        },
        /**
         * 清理删除文件
         */
        remove_all: function (cache_key) {
            var cache = Cache.get(cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length') {
                    if (cache[key].state !== 'done') {
                        cache[key].remove_file();
                    }
                    cache[key].view.invoke_state('clear');
                    //cache[key].view.clear();
                }
            }
        },
        /**
         * 清除指定cache_key的上传任务
         * @param cache_key
         */
        clear_upload_all: function (cache_key) {
            Static.stop_upload_all(cache_key);//停止上传
            Static.remove_all(cache_key);//删除文件
            Cache.clear(cache_key);//清理cache
        },
        /**
         * 清除指定cache_key的下载任务
         * @param cache_key
         */
        clear_down_all: function (cache_key) {
            Static.stop_down_all(cache_key);//停止上传
            Cache.clear(cache_key);//清理cache
        },
        /**
         * 获取关闭提示
         * @returns {{num: number, text: string}}
         * @private
         */
        _get_close_info: function () {
            var num = 0,
                text = '',
                up_counts = Cache.get_up_main_cache().get_count_nums(),
                dw_counts = Cache.get_dw_main_cache().get_count_nums();
            if (up_counts.length > up_counts.done + up_counts.error) {
                num += 1;
            }
            if (dw_counts.length > dw_counts.done + dw_counts.error) {
                num += 2;
            }
            if (num > 0) {
                text = num === 1 ? _(l_key,'未上传完成') : (num === 2 ? _(l_key,'未下载完成') : _(l_key,'未上传和下载完成'));
            }
            return {'num': num, 'text': text};
        },
        dom_events: {
            click_to_max: function () {
                get_view().max();
            },
            click_to_min: function () {
                get_view().min();
            },
            /**
             * 点击“清除全部”
             * @param {Boolean} by_user 是否是由用户触发
             */
            click_clear_all: function (by_user) {
                var tip_info = Static._get_close_info(),
                    sure_fn = function () {
                        Static.clear_upload_all(Cache.default_cache_key);
                        Static.clear_down_all(Cache.default_down_cache_key);
                        get_view().hide();//关闭视图
                        get_view().clear();
                        speed_task.stop();//停止测速度
                        get_bar_info().destroy();
                        Static.disk_route.prepend_left();
                    },
                    fail_fn = function () {//权宜之计，点取消，任务管理器不进行最小化
                        get_view().max();
                    };
                if (tip_info.num !== 0) {
                    widgets.confirm(_(l_key,'全部取消'), text.format(_(l_key,'列表中有{0}的文件，确定要取消吗？'),[tip_info.text]), '', sure_fn, fail_fn, [_(l_key,'是'), _(l_key,'否')]);
                    //widgets.confirm(_(l_key,'全部取消'), "列表中有" + tip_info.text + "的文件，确定要取消吗？", '', sure_fn, fail_fn, [_(l_key,'是'), _(l_key,'否')]);
                } else {
                    sure_fn();
                }
                if (!by_user) {//非用户手动点击，返回false，用于阻断日志上报
                    return false;
                }
            }
        },
        /**
         * 暂停状态转换为续传状态
         * @param ary
         * @param state
         */
        batch_pause_to_run: function (ary, state) {
            if (!ary.length)
                return;
            //第一个任务，需要判断是否可以执行
            var waiter = ary[0],
                runner = waiter.get_curr_upload();
            waiter.minus_info('pause'); //减掉自身添加的暂停数
            if (waiter.get_curr_cache().length === 0) {//进入执行队列
                waiter.change_state('to_' + state);
                //waiter.view.change_state(state);//更新UI
                waiter.events.nex_task.call(waiter);
            } else {
                waiter.change_state('to_' + state);
                //waiter.view.wait();//更新UI
                waiter.view.invoke_state('wait');
                if (!!runner && runner.can_pause_self()) {//当前任务可暂停，则立刻暂停
                    runner.change_state('pause');
                }
            }

            if (ary.length > 1) {//有多个任务同时进行时，分别进入预运行状态
                setTimeout(function () {//加定时器，是因为 nex_task是通过setTimeout(xx,0)调用的
                    //除第一个外，其余放到等待队列
                    for (var i = ary.length - 1; i > 0; i--) {
                        ary[i].minus_info('pause');//减掉自身添加的暂停数
                        ary[i].change_state('to_' + state);//任务进入预执行状态
                        //ary[i].view.wait();//等待UI
                        waiter.view.invoke_state('wait');
                    }
                }, 10);
            }
        },
        /**
         * @param state_name
         * @param state_fn
         */
        add_state: function (state_name, state_fn) {
            this.interface('states.' + state_name, state_fn);
        },
        /**
         *
         * @param event_name
         * @param event_fn
         */
        add_events: function (event_name, event_fn) {
            this.interface('events.' + event_name, event_fn);
        },
        /**
         * 批量重试任务
         * @param ary
         * @param cache_key
         */
        batch_re_start: function (ary, cache_key) {
            if (ary.length) {
                var queue = Cache.get(cache_key).get_queue();
                //for (var i = 0, j = ary.length; i < j; i++) {
                //重试的顺序改成从前往后
                for (var i = ary.length-1, j = 0; i >= j; i--) {
                    //延后执行
                    queue.head(ary[i], function () {
                        this.events.re_start.call(this, true);//用户点击重试
                    });
                    ary[i].minus_info('error');//错误减1
                    ary[i].view.invoke_state('wait');//将队列中所有对象的 view改为等待状态；
                    //ary[i].view.wait();//将队列中所有对象的 view改为等待状态；
                }
                var waiter = ary[0],
                    running = waiter.get_curr_upload(),
                    space = waiter.get_curr_cache().length;
                if (space === 0) {
                    return waiter.events.nex_task.call(waiter);
                } else {
                    if (running) {
                        if (running.can_pause_self()) {
                            //暂停运行者
                            return running.change_state('pause');
                        }
                    }
                    //继续等待
                }
            }
        },
        /**
         * 能否执行续传
         * @param state
         * @returns {boolean}
         */
        can_resume: function (state) {
            return this._can_resume_states[state];
        },
        /**
         * 本地保存上传/下载进度，用于续传
         */
        store_upload_down_progress: function () {
            var resume_files = {'tasks': [], 'folder_tasks': [], 'down_tasks': []},
                me = this;
            //上传
            Cache.get_up_main_cache().each(function () {
                if (me.can_resume(this.state)) {
                    var unit = this.get_resume_param();
                    if (unit) {
                        if (this.file_type === me.FOLDER_TYPE) {//文件夹
                            resume_files.folder_tasks.push(unit);
                        } else {
                            resume_files.tasks.push(unit);
                        }
                    }
                }
            });
            upload_event.trigger('set_resume_store', resume_files);
        },
        /**
         * 获取关闭页面时的提示
         * @param cache_key
         */
        get_page_unload_confirm: function (cache_key) {
            var tip_info = Static._get_close_info();
            return tip_info.num!==0 ? text.format(_(l_key,'您有{0}的文件, 确定要关闭微云吗？'),[tip_info.text]) : undefined;
            //return tip_info.num!==0 ? '您有'+tip_info.text+'的文件, 确定要关闭微云吗？' : undefined;
        },
        /**
         * 点击 全部重试（错误的任务，可重试时）
         */
        click_re_try_all: function () {
            var view = get_view();
            view.max();
            view.upload_box.scrollTop(view.upload_files.height());
            var er_list = [];
            view.upload_files
                .find('li.error')
                .appendTo(view.upload_files)
                .each(function () {
                    var task = view.get_task($(this).attr('v_id'));
                    if (task.can_re_start()) {
                        er_list.push(task);
                    }
                });
            this.batch_re_start(er_list);
        },
        /**
         * 点击 全部续传（被暂停的任务）
         */
        click_resume: function () {
            var pause = [],
                resume_pause = [];
            Cache.get_up_main_cache().each(function () {
                if (this.state === 'pause')
                    pause.push(this);
                else if (this.state === 'resume_pause')
                    resume_pause.push(this);
            });
            this.batch_pause_to_run(pause, 'continuee');
            this.batch_pause_to_run(resume_pause, 'resume_continuee');
        },
        /**
         * 网盘路由
         */
        disk_route: {
            _stack: [],
            _max_stack_dept: 3,//最大缓存深度
            _max_depart_time: 4000,//最大插入时间间隔
            _real_prepend: function(){
                var me = Static.disk_route,
                    stack = me._stack,
                    len = me._stack.length,
                    cache = {};
                me._last_prepend_time = +new Date();
                for (var i = 0 ; i < len; i++) {
                    var node = stack.shift();
                    if (!cache[node.pdir]) {
                        cache[node.pdir] = [];
                    }
                    cache[node.pdir].push(node);
                }
                for (var pdir in cache) {
                    cache[pdir].reverse();
                    try {
                        file_list.prepend_nodes(cache[pdir], true, pdir);//按父目录批量插入
                    } catch (xe) {
                        console.warn('disk_route prepend: file_list.prepend_nodes : ', xe);
                    }
                }
                me._last_cost = +new Date() - me._last_prepend_time;
                Static.cpu.set_immediate_time(me._last_cost , true);
                Static.cpu.disable_proxy();
            },
             /**
             * 批量插入
             * @private
             */
            _prepend: function () {
                 var me = this;
                 Static.cpu.set_immediate_time( me._last_cost ? me._last_cost : 32 );
                 Static.cpu.able_proxy();
                 setTimeout( me._real_prepend  ,0);
            },
            /**
             * 是否满足可以插入的条件
             * @returns {boolean}
             * @private
             */
            _can_prepend: function(){
                var me = this,
                    len = me._stack.length;
                if(!len){
                    return false;
                }
                if(!me._last_prepend_time//第一次
                    ||
                  ((+new Date() - me._last_prepend_time) > me._max_depart_time)//超过最大插入时间间隔
                    ||
                    len > me._max_stack_dept//已经达到最大缓存深度
                    ||
                  Cache.get_up_main_cache().is_done()//上传已经完成
                ){
                    return true;
                }
                return false;
            },
            /**
             * 上传成功后节点批量插入网盘 (原因：大批量文件单个插入，有性能问题)
             * @param node
             */
            prepend: function (node) {
                this._stack.push(node);
                if(this._can_prepend()){
                    this._prepend();
                } else {
                    Static.cpu.disable_proxy();
                }
            },
            /**
             * 插入剩下的node节点
             */
            prepend_left: function(){
                if(this._stack.length>0){
                    this._prepend();
                }
                this._last_prepend_time = null;
            }
        },
        /**
         * cpu信息
         */
        cpu: {
            _min: 4,//最小中断时间
            _max: 3200,//最大中断时间
            _inter_time: 16,//中断时间
            /**
             * 设置 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @param {int} time
             * @param {boolean} [done_hard_task] 完成了困难的任务
             */
            set_immediate_time: function (time , done_hard_task) {
                if(time >= this._max){//扩大_max的时间
                    this._max = this.time > 5000 ? 5000 : this.time;
                    console.debug('expend:',this._max);
                }

                if ( time <= this._min ) {//输出最大中断时间
                    this._inter_time = this._min;
                } else {
                    this._inter_time = (time > this._max) ? this._max : time ;
                }

                if(done_hard_task){//完成了困难任务后，执行剩下的任务
                    if(!this._proxy_fn)
                        return;
                    var me = this;
                    setTimeout(function(){
                        me._proxy_fn.call();
                        me._proxy_fn = null;
                    },16);
                }
            },
            /**
             * 获取 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @returns {number}
             */
            get_immediate_time: function () {
                return this._inter_time;
            },
            able_proxy: function(){
                this._proxy_albe = true;
            },
            disable_proxy: function(){
                this._proxy_albe = false;
            },
            is_proxy_able: function(fn){
                if( this._proxy_albe && this._inter_time > 100 ){
                    this._proxy_fn = fn;
                    return true;
                }
            }
        }
    };

    return Static;
});define.pack("./upload_flash_start",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./upload_validata","./view","disk","i18n","main"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        upload_route =require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        Validata = require('./upload_validata'),
        View = require('./view'),

        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),

        c = lib.get('./console'),
        force_blur = lib.get('./ui.force_blur'),
        random = lib.get('./random'),

        file_type_map = common.get('./file.file_type_map'),
        query_user = common.get('./query_user'),
        global_function = common.get('./global.global_function'),
        functional = common.get('./util.functional'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        burst_num = constants.IS_APPBOX ? 8 : 50;//添加上传频率

    /**
     *
     * @param result
     * @returns {0: 成功, 其他：则为错误码}
     */
    var check_flash_result = function (result) {
        var result = /(parent.ftn_post_end)(\()((\d+)|(-\d+))(\))/.exec(result);
        if (null != result && result[3] != 0) {
            return result[3];
        }
        return 0;
    };
    var Upload = Upload_class.sub(function (id, path, size, upload_plugin, attrs) {
        this.local_id = id;
        this.path = path;
        this.file_name = this.get_file_name();
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID

        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.file_size = size;
        this.processed = 0;
        this.upload_plugin = upload_plugin;
        this.del_local_id = random.random(); //用来删除缓存队列里的id
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        this.view = null;
        this.validata = Validata.create();
        this.validata.add_validata('check_name',this.file_name);//名称校验
        this.validata.add_validata('flash_max_size', this.file_size, 104857600 * 3);//flash 300M限制
        this.validata.add_validata('empty_file', this.file_size);  //添加本地验证规则
        this.validata.add_validata('max_space', this.file_size, query_user.get_cached_user().get_used_space(), query_user.get_cached_user().get_total_space());
        this.init(attrs.dir_id_paths, attrs.dir_paths);
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('events', $.extend({}, Upload_class.getPrototype().events));

    /**
     * 停止上传
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            plugin = me.upload_plugin,
            local_id = me.local_id;
        if (!plugin || !( local_id > 0 || local_id === 0 )) {
            return undefined;
        }
        plugin.cancelFile(local_id);
    });

    Upload.interface('states.start', functional.after(Upload_class.getPrototype().states.start, function () {
        var __self = this,
            data = this.get_upload_param.call(this, '', ''); //flash的md5和sha为空值.
        data.upload_type = 1; //flash

        this.request_upload(data, function (rsp_body, data) {
            __self.change_state('start_upload', rsp_body, data);
        });

    }));

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
        var me = this;
        me.request_upload($.extend(
            me.get_upload_param.call(me, '', ''),//flash的md5和sha为空值.
            {'upload_type': 1}//flash标识
        ), function (rsp_body, data) {
            me.change_state('start_upload', rsp_body, data);
        });
    });

    Upload.interface('states.start_upload', function () {
        this.start_time = +new Date();
        this.upload_plugin.uploadFile(this.local_id, this.upload_svr_host, this.upload_svr_port - 0, this.file_key, this.upload_csum, {
            'mode': 'flashupload'
        });

    });


    var __reload = functional.throttle(function () {
        file_list.reload(false, false);
    }, 2000);

    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        //判断是否加载disk 解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated()) {
            if (this.pdir == ( file_list.get_cur_node() || file_list.get_root_node() )) {//正在当前目录下，才刷新列表
                __reload();
            }
        }
    });


    Upload.interface('states.upload_file_update_process', function (processed) {
        this.processed = processed;
    });


    var add_upload = function (upload_plugin, files, attrs) {
        View.show();
        setTimeout(function(){
            var len  = files.length;
            functional.burst(files, function (opt) {
                var upload_obj = Upload.getInstance(opt.id, 'C\\' + opt.name, opt.size, upload_plugin, attrs); //生成上传对象
                upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
                if( (len-=1) === 0 ){
                    upload_obj.events.nex_task.call(upload_obj);
                }
            }, burst_num).start();
            force_blur();
        },10);

    };

    upload_event.on('add_upload', add_upload);


    var op = [null, 'add', null, 'upload_file_update_process', 'done', 'upload_file_update_process'];

    global_function.register('FileUploaderCallback', function (code, opt) {
        var fn = op[code - 0];

        if (fn === null) {
            return;
        }

        fn = fn || 'upload_file_update_process';

        if (fn === 'add') {
            //ie下点击了flash，title会变，这个时候特殊处理改回来
            if ($.browser.msie) {
                var main = require('main').get('./main');
                //    cur_mod = main.get_cur_mod_alias(),
                //    mod_obj = {"disk": "网盘", "photo": "相册", "recent": "最近", "recycle": "回收站","share":"分享的链接"};
                document.title = _(l_key,"微云网页版");
            }
            //弹出上传路径选择框，第三个参数标识是上传类型
            select_folder.show(opt, upload_route.upload_plugin, 'flash');
            return;
        }

        var task = upload_cache.get_task(opt.id);
        if (task) {
            //flash 可能返回 "<script>document.domain="qq.com";try{parent.ftn_post_end(0)}catch(e){}</script>" ，其中的数字标识了操作结果状态
            if (fn === 'done' && opt && opt.res) {
                var error_code = check_flash_result(opt.res);
                if (error_code) {
                    c.debug('fileupload done errorCode= ' + error_code);
                    task.change_state('error', error_code);
                    return;
                }
            }
            task.change_state(fn, opt.processed);
        }
    });

    module.exports = Upload;

});/**
 * 从appbox拖拽发送qq文件
 * @author bondli
 * @date 13-10-17
 */
define.pack("./upload_folder_appbox",["$","lib","common","./tmpl","i18n","./select_folder.loading","./select_folder.get_up_folder_files","./select_folder.upload_folder_validata","./select_folder.select_folder"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),

        console = lib.get('./console').namespace('upload2'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./select_folder.loading'),
        get_up_folder_files = require('./select_folder.get_up_folder_files'),
        FolderValidata = require('./select_folder.upload_folder_validata'),
        select_folder = require('./select_folder.select_folder'),
        widgets = common.get('./ui.widgets'),


        undefined;

    /**
     * 控件告知该次文件读取开始
     * @param taskId  
     */
    window.WYCLIENT_OnAsyncSelectFolderBegin = function (taskId) {
        console.debug('WYCLIENT_OnAsyncSelectFolderBegin');
        //显示loading
        loading.show(_(l_key,'正在获取文件夹信息'), function(){
            is_canceled = true;
            loading.hide();
            upload_folder_appbox.release(taskId);
            upload_folder_appbox.re_set();
        });
    };

    /**
     * 控件更新所选的数据
     * @param taskId  
     * @param currentFileCount 已获取的文件数
     */
    window.WYCLIENT_OnFolderFilesInfoUpdate = function (taskId, currentFileCount) {
        console.debug('WYCLIENT_OnFolderFilesInfoUpdate', taskId, currentFileCount);
        //setTimeout(function(){  //延时都是容错
            upload_folder_appbox.get_files(taskId, currentFileCount);
        //},20);
        return 1;
    };

    /**
     * 控件告知该次文件读取完毕
     * @param taskId
     * @param totalFileCount 总文件数
     * @param errCode 错误码
     */
    window.WYCLIENT_OnAsyncSelectFolderComplete = function (taskId, totalFileCount, errCode) {
        console.debug('WYCLIENT_OnAsyncSelectFolderComplete', taskId, totalFileCount, errCode);

        if(errCode === '42260001'){ //选择了整个磁盘
            //隐藏显示的loading
            loading.hide();
            //调用控件的接口，读取完成后释放内存
            upload_folder_appbox.release(taskId);
            upload_folder_appbox.show_error_dialog(_(l_key,'暂不支持上传整个盘符，请重新选择。'));
        }
        else if(errCode === '42260002'){ //点击了取消
            //隐藏显示的loading
            loading.hide();
            //调用控件的接口，读取完成后释放内存
            upload_folder_appbox.release(taskId);
        }
        else {
            upload_folder_appbox.set_total(taskId, totalFileCount);
            if(upload_folder_appbox.check_finish(taskId)){
                //隐藏显示的loading
                loading.hide();
                var files = upload_folder_appbox.get_files_arr(taskId);
                if(files){
                    //调用控件的接口，读取完成后释放内存
                    upload_folder_appbox.release(taskId);
                    upload_folder_appbox.show_select_folder(files);
                }
            }
            else {
                var times = 1;
                var t = setInterval(function(){  //都是容错
                    times ++;
                    if(upload_folder_appbox.check_finish(taskId)){
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        var files = upload_folder_appbox.get_files_arr(taskId);
                        if(files){
                            //调用控件的接口，读取完成后释放内存
                            upload_folder_appbox.release(taskId);
                            upload_folder_appbox.show_select_folder(files);
                        }
                    }
                    if(times>=100){  //长时间没有正确提示错误
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        upload_folder_appbox.release(taskId);
                        upload_folder_appbox.re_set();
                        upload_folder_appbox.show_error_dialog(_(l_key,'分析文件夹出错，请稍后再试。'));
                        return false;
                    }
                },50);
            }
            
        }
        return 1;
    };
    

    var upload_folder_appbox = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : 0,

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.GetFolderFilesCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('GetFolderFilesCount:'+this._total);
        },

        //开始取数据
        get_files: function (taskId, select_count) {
            var me = this,
                filestr = '',
                pre_count = 100,
                times = Math.floor(select_count/pre_count),
                left = select_count % pre_count;

            //次数大于等于1
            if(times >= 1){
                for(var i=1; i<=times; i++){
                    //更新offset
                    me._offset = (i-1)*pre_count;
                    //console.log('GetFolderFilesInfo:',taskId, me._offset, pre_count);
                    var tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset, pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset, pre_count);
                        console.log('GetFolderFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;
                }
            }

            //生效不足一次的
            if(left) {
                if(times == 0){ //从来都没有执行过
                    me._offset = 0;
                }
                else{
                    me._offset += pre_count;
                }
                //console.log('GetFolderFilesInfo:',taskId, me._offset, left);
                var tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset, left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.GetFolderFilesInfo(taskId, me._offset, left);
                    console.log('GetFolderFilesInfo failed,retry...');
                }
                filestr += tmpstr;
            }

            //console.log('filestr:',filestr.length);

            var __files = filestr.split('\r\n');
            __files.pop();

            if (!__files || !__files.length) { //没有选中文件退出
                return false;
            }
            
            //构造本次任务的数组
            if(me._file_obj[taskId]){
                me._file_obj[taskId] = $.merge(me._file_obj[taskId], __files);
            }
            else{
                me._file_obj[taskId] = __files;
            }
            
        },

        //检查是否获取完成，都是容错
        check_finish: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                return false;
            }
            console.log(this._total, this._file_obj[taskId].length);
            return (this._total == this._file_obj[taskId].length) ? true : false;
        },

        //获取文件数组
        get_files_arr: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                this.show_error_dialog(_(l_key,'分析文件夹出错，请稍后再试。'));
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = get_up_folder_files(this._file_obj[taskId]);
            //console.log(files);
            this.re_set();

            var folderValidata = FolderValidata.create();
            folderValidata.add_validata('max_dir_size', files.dir_total_num, constants.UPLOAD_FOLDER_DIR_NUM);  //目录数太多验证
            var max_file_num_dir_name = text.smart_cut(files.max_file_num_dir_name, 20);
            //console.log(files.dir_level_num, max_file_num_dir_name);
            folderValidata.add_validata('max_level_size', files.dir_level_num, max_file_num_dir_name, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
            folderValidata.add_validata('max_files_size', files.file_arr && files.file_arr.length, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
            var ret = folderValidata.run();
            if(ret){
                this.show_error_dialog(ret[0]);
                return false;
            }
            return files;
        },

        //显示错误的提示框
        show_error_dialog: function (msg) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
            var dialog = new widgets.Dialog({
                title: _(l_key,'上传提醒'),
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog3,
                mask_ns: 'gt_4g_tips',
                buttons: [
                    {id: 'CANCEL', text: _(l_key,'确定'), klass: 'ui-btn-other', visible: true}
                ],
                handlers: {
                }
            });
            dialog.show();
        },

        //释放资源
        release: function (taskId) {
            console.log('ReleaseFolderFilesData');
            return this.upload_plugin.ReleaseFolderFilesData(taskId);
        },

        //重新设置初始值
        re_set: function () {
            this._taskId = '';
            this._file_arr = [];
            this._offset = this._total = 0;
        },

        //弹出上传位置选择框
        show_select_folder: function (files) {
            return select_folder.show_by_upfolder(files, this.upload_plugin);
        }

    };

    return upload_folder_appbox;

});define.pack("./upload_form_start",["lib","common","$","./upload_route","./Upload_class","./select_folder.select_folder","./tool.upload_static","./tool.upload_cache","./view","./upload_validata","disk","./select_folder.photo_group"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        Validata = require('./upload_validata'),

        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),

        c = lib.get('./console'),
        random = lib.get('./random'),

        functional = common.get('./util.functional'),
        Module = common.get('./module'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        session_event = common.get('./global.global_event').namespace('session'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),

        photo_group = require('./select_folder.photo_group');

    var upload_lock = false;


    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (upload_plugin, id, path, attrs) {

        this.upload_plugin = upload_plugin;
        this.local_id = id;
        this.del_local_id = id;
        this.path = path;
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID

        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.skey = attrs.skey;
        this.file_name = this.get_file_name();
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        this.view = null;
        this.time = this.get_timeout(180000); //超时
        //this.validata = Validata.create();
        //this.validata.add_validata('check_name',this.file_name);//名称校验
        this.init(attrs.dir_id_paths, attrs.dir_paths);

    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('get_timeout', function (__time) {

        var t,
            __self = this;

        var timeout = function () {
            t = setTimeout(function () {
                __self.change_state('error', 10000);//表单超时，激活错误状态
            }, __time);
        };

        var clear = function () {
            clearTimeout(t);
        };

        return {
            timeout: timeout,
            clear: clear
        };

    });
    /**
     * 不能重试
     */
    Upload.interface('can_re_start', function () {
        return false;
    });
    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        this.upload_plugin.destory();
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated()) {
            file_list.reload(false, false);
        }
    });


    Upload.interface('states.error', function () {
        this.superClass.states.error.apply(this, arguments);
        this.upload_plugin.destory();
    });


    Upload.interface('states.start', function () {
        this.start_time = +new Date();
        this.superClass.states.start.apply(this, arguments);
        var send_param = {
            name: 'web',
            ppdir: this.ppdir,
            pdir: this.pdir,
            skey: this.skey
        };
        var group_id = photo_group.get_photo_group_id();
        if(group_id > 0){
            this.group_id = send_param.group_id = group_id;
            send_param.upload_type = 1;//非控件上传
        }
        this.upload_plugin.send(send_param);
        this.time.timeout();
    });

    var add_upload = function (upload_plugin, files, attrs) {
        attrs.skey = query_user.get_skey();
        View.show();

        functional.burst([upload_route.upload_plugin.get_path()], function (path) {

            var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), path, attrs);

            upload_obj.change_state('wait');    //状态转为wait，放入队列等待.

            upload_obj.events.nex_task.call(upload_obj);

        }, 3).start();
    };

    upload_event.on('add_upload', add_upload);

    var form_upload = new Module('form_upload', {

        render: function () {

            var me = this;

            this.listenTo(upload_route, 'render', function () {

                upload_route.upload_plugin.change(function () {

                    //获取用户选择的文件名
                    var file_name = $('.ui-file').val(),
                        ary = file_name.split(/\\|\//);
                    me.file_name = ary[ary.length - 1] || '';

                    var __files = [
                        {"name": me.file_name, "size": 0}
                    ];

                    //弹出上传路径选择框，第三个参数标识是上传类型
                    select_folder.show(__files, upload_route.upload_plugin, 'form');

                });

            });
        }
    });


    global_function.register('weiyun_post_end', function (json) {
        //code by bondli 防止用户重复选择同一文件上传导致不会触发表单的change事件
        try{$('.ui-file').val('');}catch(e){};
        setTimeout(function () { // fix response try
            if (json.ret === 0) {
                upload_cache.get_curr_real_upload().change_state('done');
                return upload_lock = false; //清空single_upload，方便下一次上传.
            } else {
                upload_cache.get_curr_real_upload().change_state('error', json.ret);
                if (json.ret === ret_msgs.INVALID_SESSION) {//fixed bug 48758599 by hibincheng Form表单上传，会话过期，登陆框弹出显示。(其它上传在Upload_class.js request_upload方法中rqeuest请求配置cavil参数即可)
                    session_event.trigger('session_timeout');
                }
                return upload_lock = false;
            }
        }, 0);
    });


    form_upload.render();

    module.exports = Upload;


});define.pack("./upload_global_function",["lib","common","$","i18n","./tool.upload_static","./tool.upload_cache"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        c = lib.get('./console'),
        JSON = lib.get('./json'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        page_event = common.get('./global.global_event').namespace('page'),
        constants = common.get('./constants'),

        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        op_map = [ null, 'file_sign_done', 'file_sign_update_process', 'done', 'upload_file_update_process', 'create_file_done', 'get_resume_info_done' ],

        undefined;

    global_function.register('OnEvent', window.OnEvent = function (param) {

        if(!Cache.is_init()){
            return 1;
        }

        param = functional.try_it(function () {
            return JSON.parse(param);
        }) || param || {};

        var task = Cache.get_task(param.LocalID);

        if (!task) {
            return 1;
        }

        //调试模式，总是打印控件回调,用于判断是否控件卡死
        if (constants.IS_DEBUG) {
            //c.log('upload_plugin_callback:'+param.LocalID);
            c.log(param.LocalID,param.EventType,param.ErrorCode,param.Step);
        }

        var op = op_map[ param.EventType ], //回调操作
            error_code = param.ErrorCode;   //回调操作结果码
        if (error_code !== undefined && error_code !== 'undefined' && error_code !== 0) {
            var error_step = param.Step;    //控件错误调试step
            c.warn('fileupload '+op+' errorCode= ' + error_code);
            c.warn('fileupload '+op+' step= ' + error_step);
            //c.warn(error_code,error_step,(error_code === 'undefined'));
            task.change_state('error', [_(l_key,'存储服务繁忙(0)').replace('0',error_code) , error_code] , error_step);
            //task.change_state('error', ['存储服务繁忙(' + error_code + ')' , error_code] , error_step);
            return 1;
        }
        task.change_state(op, param);   //具体的回调函数

        return 1;
    });

    // global_function.register('WYCLIENT_UploadFiles', );  已移至 /imgcache.qq.com/club/weiyun/js/module/disk/src/ui.js 中 @james


    // appbox 关闭拦截，return true 表示关闭，return false 表示不关闭
    global_function.register('WYCLIENT_BeforeCloseWindow', function (is_close_QQ) {
        var close = true, no_close = false;

        if (is_close_QQ === "TRUE") { // 直接关闭QQ时不提示，直接关闭
            return close;
        }
        else {
            var msg = page_event.trigger('before_unload');
            if (msg) {
                if(window.external.MsgBox_Confirm(_(l_key,'提示'), msg, 1)){
                    page_event.trigger('confirm_unload');
                    return close;
                } else {
                    return no_close;
                }
            }
        }
        return close;
    });


    window.support_plugin_drag_upload = function () {
        if (page_event.trigger('check_file_upload_draggable') === false) {
            return 0;
        }
        return 1;
    };

    // code by james：上传过程中关闭窗口不弹框确认的bug fix

    // 关闭、刷新页面前的检查和获取提示
    page_event.on('before_unload', function () {
        return Static.get_page_unload_confirm();
    });

    // 用户已确认允许关闭（加这个标识是为了避免重复弹框的问题）
    var unload_confirmed = false;

    // 确认将要关闭、刷新页面的事件
    page_event.on('confirm_unload', function () {
        if (!unload_confirmed) {
            // 标识用户已确认关闭
            unload_confirmed = true;
            // 记录上传/下载进度以便续传
            Static.store_upload_down_progress();
            // 停止上传动作
            Static.stop_upload_all();
            // 记录下载进度以便续传
            //Static.store_down_progress();
            // 停止下载
            Static.stop_down_all();

            upload_event.trigger('set_curr_upload_file_id');
        }
    });

    // 浏览器关闭、刷新前弹出确认框
    global_function.register('onbeforeunload', function () {
        // 如果用户未确认过关闭（未触发过confirm_unload），则需要弹框确认
        if (!unload_confirmed) {
            return page_event.trigger('before_unload');
        }
    });

    // 浏览器关闭、刷新时，停止上传
    $(window).on('unload', function () {
        page_event.trigger('confirm_unload');
    });


    return global_function.get('OnEvent');
});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */


define.pack("./upload_plugin.upload_plugin",["lib","common","$","./view","./Upload_class","./msg","./upload_route","./upload_validata","./tool.upload_static","./tool.upload_cache","disk"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        View = require('./view'),
        Upload_class = require('./Upload_class'),
        msg = require('./msg'),
        upload_route = require('./upload_route'),
        Validata = require('./upload_validata'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),

        functional = common.get('./util.functional'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),

        disk_mod = require('disk'),
        file_list_ui = disk_mod.get('./file_list.ui'),

        c = lib.get('./console'),
        random = lib.get('./random'),

        G4 = Math.pow(2, 30) * 4,
        G2 = Math.pow(2, 30) * 2,
        G32 = Math.pow(2, 30) * 32,

        burst_num = constants.IS_APPBOX ? 8 : 50,//添加上传频率
        is_newest_version = function () {//频繁验证，在大批量上传时，有性能有问题；这里用一个缓存读取
            return common.get('./util.plugin_detect').is_newest_version();
        }();
    var Upload = Upload_class.sub(function (file_path, upload_plugin, attrs, folder_id) {
        this.path = file_path; //文件路径
        this.file_name = this.get_file_name();  //文件名
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID

        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称


        this.upload_plugin = upload_plugin; //上传插件
        this.local_id = random.random(); //文件上传的local_id
        this.del_local_id = random.random(); //用来删除缓存队列里的id
        this.state = null;  //上传状态
        this.file_size = this.get_file_size(); //文件总大小
        this.file_sign_update_process = 0; //当前签名进度
        this.code = 0; //当前错误吗
        this.log_code = 0;  //上报的错误吗
        this.processed = 0; //已上传进度
        this.event_param = null;
        this.can_pause = true; //能暂停
        this.view = null; //视图
        this.file_sign_done_flag = false;    //计算回调次数, 修改客户端偶尔扫描完成之后不回调的bug(客户端现在是多次回调).
        this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.

        this.is_retry = false; //是否重新来一次上传

        this.is_qq_receive = attrs.is_qq_receive || false; //添加一个是否从qq客户端接收到的文件上传

        this.validata = Validata.create();

        this.validata.add_validata('check_name', this.file_name);//名称校验

        if (constants.IS_APPBOX) {
            if (!is_newest_version) { //旧版本appbox支持4G以下
                this.validata.add_validata('up4g_size', this.file_size, G4 - 1);
            }
            else {
                this.validata.add_validata('max_size', this.file_size, G32 - 1);  //新版appbox最大32G（QQ1.98）
            }
        } else {
            if (!is_newest_version) {//非新控件，校验大于IE下为4G的文件,chrome下为2G
                this.validata.add_validata('up4g_size', this.file_size, upload_route.type === 'webkit_plugin' ? G2 - 1 : G4 - 1);
            }
            this.validata.add_validata('max_size', this.file_size, G32 - 1);  //最大32G
        }
        this.validata.add_validata('empty_file', this.file_size);  //空文件验证

        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));
    /**
     * 是否控件上传
     */
    Upload.interface('is_plugin_upload', function () {
        return true;
    });
    /**
     * 是否妙传
     */
    Upload.interface('is_miaoc', function () {
        return this.file_exist;
    });
    /**
     * 停止上传
     * return {boolean} true停止上传成功， false停止上传失败
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            ret;
        if (me.upload_plugin && (me.local_id === 0 || me.local_id > 0)) {
            //判断如果是扫描状态下cancel的，需要停止扫描
            if (me.state === 'file_sign_update_process') {
                try {
                    me.upload_plugin.StopFileSign(me.local_id);
                    ret = 0;
                } catch (e) {
                    c.error('停止扫描错误:', (typeof me.local_id), me.local_id);
                }
            } else if (me.state === 'upload_file_update_process' || me.state === 'error') {
                ret = me.upload_plugin.StopUpload(me.local_id);//WEB浏览器
                if (0 !== ret) {
                    try {
                        me.upload_plugin.StopUpload(me.local_id + ''); //APPBOX
                        ret = 0;
                    } catch (xe) {
                        c.error('停止上传错误:', (typeof me.local_id), me.local_id, ret);
                    }
                }
            }
        }
        return ret === 0;
    });

    /**
     * 自己能否暂停
     */
    Upload.interface('can_pause_self', function () {
        if (this.state === 'upload_file_update_process' && this.stop_upload()) {
            return true;
        }
        return false;
    });

    /**
     * 正真重试动作
     */
    Upload.interface('resume_file_local', function () {
        var ret = this.upload_plugin.ResumeFileLocal(this.local_id); //继续上传的时候不重新分配local_id
        if (ret !== 0) {//续传失败
            try {
                this.upload_plugin.ResumeFileLocal(this.local_id + '');
            } catch (xe) {
                c.error('续传出错:', (typeof this.local_id), this.local_id, ret);
                this.change_state('pause');
            }
        }
    });
    /**
     * 页面断开，重新续传 ，返回 local_id;
     */
    Upload.interface('resume_file_remote', function () {
        //local_id
        //新增设置每个分片大小
        if (upload_route.type === 'webkit_plugin') {
            me.upload_plugin.BreakSize = 128 * 1024;
            c.log('resume uplaod BreakSize:128k');
        }
        //webkit下大于2G的需要新的续传接口,APPBOX下也没有这个方法
        if (upload_route.type === 'webkit_plugin' && this.file_size > G2 && !constants.IS_APPBOX) {
            return this.upload_plugin.ResumeFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 0, 'weiyun');
        }
        else {
            return this.upload_plugin.ResumeFile(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 'weiyun');
        }
    });

    Upload.interface('states.start', functional.after(Upload_class.getPrototype().states.start, function () {
        if (this.is_qq_receive) { //上传时就让上传任务管理器最大化
            View.max();
        }
        if (this.file_size < Math.pow(2, 20) * 20) {//小于20M的文件不显示扫描.
            this.no_show_sign = true;
        }
        if (this.is_retry) {  //重新开始上传也不显示扫描
            this.no_show_sign = true;
        }
        var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
            __self = this,
            callee = arguments.callee;
        if (!local_id || local_id == -1) {   //客户端的bug, 扫描可能未发起.
            return setTimeout(function () {
                return callee.call(__self);
            }, 1000);
        }

        this.set_local_id(local_id);
    }));

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
        this.stop_upload();
        this.file_sign_done_flag = false;//标识未扫描完成
        if (this.file_md5 && this.file_sha) {
            this.resume_file_local();
        } else {
            var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
                __self = this,
                callee = arguments.callee;
            if (!local_id) {   //客户端的bug, 扫描可能未发起.
                return setTimeout(function () {
                    return callee.call(__self);
                }, 1000);
            }
            this.set_local_id(local_id);
        }
    });
    /**
     * 释放控件资源
     */
    Upload.interface('release_plugin', function () {
        try {
            this.upload_plugin.ReleaseLocal(constants.IS_APPBOX ? (this.local_id + '') : this.local_id);
        } catch (xe) {
            c.error('释放控件资源错误:', (typeof this.local_id), this.local_id, xe);
        }
    });

    /**
     * 高亮文件
     */
    Upload.interface('highlight_files', function () {
        var me = this;
        var file_ids = me.file_id;//me.get_file_id_by_dir();
        if (file_ids && file_ids.length) {
            file_list_ui.highlight_$item(file_ids);//高亮完成文件
        }
    });

    /**
     * 上传完成后做的一些特殊处理
     */
    Upload.interface('after_done', function () {
        var me = this;
        if (this.is_qq_receive) {
            me.highlight_files();
        }
    });

    /**
     * 是否重新来一次上传
     */
    Upload.interface('get_is_retry', function () {
        return this.is_retry;
    });

    /**
     * 设置重新来一次上传
     */
    Upload.interface('set_retry', function () {
        this.is_retry = true;
    });

    Upload.interface('states.start_upload', function (rsp_body, data) {   //这次是真的开始上传
        //code by bondli 增加上传开始时间点记录
        var me = this;
        me.start_time = +new Date();
        if (rsp_body && data) {
            me.server = rsp_body.upload_svr_host;
            me.port = rsp_body.upload_svr_port;
            me.check_key = rsp_body.upload_csum;
            me.file_key = rsp_body.file_key;
            me.file_md5 = data.file_md5;
            me.file_sha = data.file_sha;
            me.file_exist = rsp_body.file_exist;
            this.release_plugin();//获取到上传的存储连接后，释放控件上传线程
        }
        if (!me.server) {//未请求过server，调用者可能来自（远程服务爆出的容量不足错误，这个情况下是请求CGI是没有 返回这些数据的）
            return setTimeout(function () {
                me.change_state('error', me.code);
            }, 200);
        }
        if (!me.file_exist) {//非妙传用户，打印server
            c.log('start_upload url:', me.server);
        }
        //新增设置每个分片大小
        if (upload_route.type === 'webkit_plugin') {
            me.upload_plugin.BreakSize = 128 * 1024;
            c.log('upload BreakSize:128k');
        }
        var local_id, callee = arguments.callee;
        //大于2G的走新接口
        if (this.file_size > G2 && !constants.IS_APPBOX) {
            local_id = me.upload_plugin.UploadFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun', 0, 0);
        } else {
            local_id = me.upload_plugin.UploadFile(  this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun');
        }

        if (!local_id) {   //客户端的bug, 上传可能未发起.
            c.log('client exception call UploadFile no return : ',this.del_local_id);
            return setTimeout(function () {
                return callee.call(me, rsp_body, data);
            }, 1000);
        }

        this.set_local_id(local_id); //local_id已变化,  重新分配.
    });


    var add_upload = function (upload_plugin, files, attrs) {   //添加上传对象
        View.show();
        setTimeout(function () {//延时执行，给浏览器以喘气的机会
            var len = files.length;
            functional.burst(files,function (path) {
                var upload_obj = Upload.getInstance(path, upload_plugin, attrs);
                upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
                if ((len -= 1) === 0) {
                    upload_obj.events.nex_task.call(upload_obj);
                }
            }, burst_num, 63).start();
        }, 16);
    };


    var add_resume = function (files, upload_plugin) { //断点续传
        //var cache = upload_cache.get()
        //info = cache.get_info();
        //cache.set_info('undone', info.undone + files.length);
        //cache.set_info('length', info.length + files.length);
        if (files.length) {
            View.show();
        }
        $.each(files, function () {
            //var obj = JSON.parse(this);    //转化store中读取的记录
            var obj = this;    //转化store中读取的记录
            var attrs = {
                'ppdir': obj.ppdir,
                'pdir': obj.pdir,
                'ppdir_name': obj.ppdir_name,
                'pdir_name': obj.pdir_name
            };
            var upload_obj = Upload.getInstance(obj.path, upload_plugin, attrs); //生成上传对象
            functional.try_it(function () {
                upload_obj.change_state('resume_pause', obj);   //状态转为续传
            });
        });

    };

    return {
        get_class: function () {
            return Upload;
        },
        add_resume: add_resume,
        add_upload: add_upload
    }
});/**
 * 上传文件夹 by trump
 */
define.pack("./upload_plugin.upload_plugin_folder",["lib","common","$","./view","./Upload_class","./msg","./upload_route","./tool.upload_static","./tool.upload_cache","./tool.bar_info","./select_folder.select_folder","i18n","disk","./upload_plugin.upload_plugin"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        functional = common.get('./util.functional'),

        View = require('./view'),
        Class = require('./Upload_class'),
        msg = require('./msg'),
        upload_route = require('./upload_route'),

        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        bar_info = require('./tool.bar_info'),
        select_folder = require('./select_folder.select_folder'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        query_user = common.get('./query_user'),
        c = lib.get('./console'),
        text = lib.get('./text'),

        disk_mod = require('disk'),
        file_list,
        FileNode,

        random = lib.get('./random'),

        sub_class,
        get_sub_class = function () {
            return sub_class || (sub_class = require('./upload_plugin.upload_plugin').get_class());
        },
        burst_num = common.get('./constants').IS_APPBOX ? 8 : 50,//添加上传频率

        fake_size = Math.pow(2, 30) * 10,//假定的文件夹大小

        sub_task_run_states = {fake_done:1,done:1,error:1};

    var Upload = Class.sub(function (upload_plugin, attrs) {
        this.file_name = attrs.dir_name;  //文件名
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.path = attrs.local_path || attrs.path;
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.upload_plugin = upload_plugin; //上传插件
        this.local_id = this.del_local_id = random.random(); //文件上传的local_id
        this.state = null;  //上传状态
        this.file_count = attrs.file_count;
        this.code = 0; //当前错误吗
        this.log_code = 0;  //上报的错误吗
        this.processed = 0; //已上传进度
        this.can_pause = true; //能暂停
        this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.
        this.sub_cache_key = attrs.sub_cache_key;
        this.init(attrs.dir_id_paths, attrs.dir_paths, '', 'folder');
        this.file_type = Static.FOLDER_TYPE;
        this.file_id = attrs.file_id;
        if (!FileNode) {
            FileNode = disk_mod.get('./file.file_node');
            file_list = disk_mod.get('./file_list.file_list');
        }
        this.prepend_to_disk();
    });
    Upload.interface('states', $.extend({}, Class.getPrototype().states));

    var cover_method = {
        //将文件夹插入到网盘中
        prepend_to_disk: function () {

            if (!this.file_id || this.has_append_to_disk) {
                return;
            }

            this.push_done_file_id(this.file_id);
            try {
                file_list.prepend_node(
                    new FileNode({
                        is_dir: true,
                        id: this.file_id,
                        name: this.file_name
                    }),
                    true,
                    this.pdir);

                this.has_append_to_disk = true;//标识已插入到网盘中
            } catch (xe) {
                c.error('folder prepend_to_disk error');
            }
        },
        //删除文件夹
        get_sub_cache: function () {
            return Cache.get(this.sub_cache_key);
        },
        //删除文件夹
        remove_file: function () {
            this.get_sub_cache()
                .each(function () {
                    if (this.state !== 'done') {
                        this.remove_file();
                    }
                });
        },
        //停止上传
        stop_upload: function (stop_all) {
            if (stop_all === true) {
                Static.stop_upload_all(this.sub_cache_key);
            } else {
                var sub_cache = this.get_sub_cache();
                if ( sub_cache ) {
                    var running = sub_cache.get_curr_upload();
                    running && running.can_pause_self() && running.stop_upload();
                }
            }
            return true;
        },
        //暂停后，重新续传
        resume_file_local: function () {
            this.when_change_state('continuee');

            this.view.upload_file_update_process();
            this.view.set_cur_doing_vid();

            var running = this.get_sub_cache().get_curr_upload();
            if(sub_task_run_states[running.state]){
                running.get_queue().dequeue();
                //running.events.nex_task.call(this);
            }
        },
        //页面断开，重新续传 ，返回 local_id;
        resume_file_remote: function () {
            this.when_change_state('continuee');
            var sub_cache = this.get_sub_cache(),
                resume_task;
            sub_cache.each(function () {
                if (this.state === 'resume_pause') {//重新上传第一个被暂停的任务；
                    resume_task = this;
                    return false;
                }
            });
            this.view.upload_file_update_process();
            this.view.set_cur_doing_vid();
            View.set_end_btn_style(bar_info.is_done(), Cache.get_close_btn_text());//设置关闭按钮，样式和text
            bar_info.update(bar_info.OPS.UP_CHECK);
            if (resume_task) {
                Static.batch_pause_to_run([resume_task], 'resume_continuee');
            } else {
                sub_cache.do_next();
            }
        },
        //暂停后，重新上传
        get_resume_param: function () {
            var arys = [];
            if (!Static.can_resume(this.state)) {
                return;
            }
            this.get_sub_cache().each(function () {
                if ('done' !== this.state) {//没有传完的文件可继续上传
                    arys.push(this.get_resume_param());
                }
            });
            if (arys.length > 0) {
                var obj = this.get_dir_ids_paths() || {};
                return {
                    'attrs': {
                        path: this.path,
                        dir_name: this.file_name,
                        ppdir: this.ppdir,
                        pdir: this.pdir,
                        ppdir_name: this.ppdir_name,
                        pdir_name: this.pdir_name,
                        dir_paths: obj.paths,
                        dir_id_paths: obj.ids,
                        file_id: this.file_id
                    },
                    'files': arys
                };
            }
        },
        //能否重试
        can_re_start: function () {
            if (this.can_not_re_start) {
                return false;
            }
            var result = false;
            this.get_sub_cache().each(function () {
                if (this.can_re_start() === true) {
                    result = true;
                    return false;
                }
            });
            return result;
        },
        //重新开始
        re_start_action: function () {
            var me = this,
                key = me.sub_cache_key;
            if (me.re_try_text) {//重试动作
                select_folder
                    .folder_error_retry(me.re_try_text)
                    .done(function () {
                        delete me.re_try_text;
                        delete me.folder_can_not_start;
                        me.re_start_action();
                    }).fail(function () {
                        me.change_state('error', me.log_code);
                    });
            } else {
                var re_start_lists = [];
                Cache.get(key).each(function () {
                    if (this.state === 'error' && this.can_re_start()) {
                        re_start_lists.push(this);
                    }
                });
                this._is_finished = false;
                Static.batch_re_start(re_start_lists, this.sub_cache_key);
            }
        },

        get_translated_error: function () {
            var error = this.get_sub_cache().get_count_nums().error;
            if (0 === error && this.log_code) {//取文件夹错误信息
                return Static.get_error_msg(this.log_code);
            }
            return error > 0 ? text.format(
                //'{0}个文件上传失败，<span class="sim-link" data-action="folder-errors">详情</span>',
                _(l_key,'{0}个文件上传失败')+'，<span class="sim-link" data-action="folder-errors">'+_(l_key,'详情')+'</span>',
                [error/*error_count*/]
            ) : '';
        },

        get_translated_errors: function () {
            var errors = [];
            this.get_sub_cache().each(function () {
                if (this.state === 'error') {
                    errors.push({
                        name: this.path,
                        size: this.file_size,
                        error: this.get_translated_error('simple'),
                        error_tip: this.get_translated_error('tip')
                    });
                }
            });
            return errors;
        },
        //子任务准备好了
        on_sub_task_ready: function () {
            this.view.set_folder_size_ready();
        },
        /**
         * 是否文件夹上传
         */
        is_upload_folder: function () {
            return true;
        }
    };
    for (var key in cover_method) {
        Upload.interface(key, cover_method[key]);
    }
    //文件夹
    var folder_status = {
        start: function () {
            var me = this;
            if (me.folder_can_not_start || me.can_not_re_start) {
                return;
            }
            me.start_time = +new Date();//开始上传时间
            me.change_state('upload_file_update_process', {'Processed': me.processed});
            me.get_sub_cache().do_next();
        },
        done: function () {
            this.view.after_done();
        },
        error: function () {
            this.view.after_error();
        }
    };

    //子任务
    var sub_task_state = {
        start: function (folder) {
            folder.change_state('upload_file_update_process',
                {'Processed': this.get_passed_size()}
            );
        },

        done: function (folder) {
            sub_task_state._when_one_end.call(this, folder);//更新folder进度
        },
        error: function (folder) {
            /*if (folder.sub_cache_key === this.cache_key) {
                c.log(Cache.get(this.cache_key).get_count_nums())
                folder.view.upload_file_update_process();
            }*/
            sub_task_state._when_one_end.call(this, folder);//更新folder进度
        },
        //更新文件夹 总体进度
        upload_file_update_process: function (folder) {
            if (folder.sub_cache_key === this.cache_key) {
                folder.processed = this.processed + this.get_passed_size();
                folder.view.upload_file_update_process();
            }
        },
        file_sign_update_process: function (folder) {
            if (!this.no_show_sign && !folder.has_sign_once) {
                folder.folder_scan_percent = this.file_sign_update_process / this.file_size * 100;
                folder.view.file_sign_update_process();
            }
        },
        file_sign_done: function (folder) {
            if (!this.no_show_sign && !folder.has_sign_once) {
                folder.has_sign_once = true;
                folder.view.file_sign_done();
            }
        },

        _when_one_end: function (folder) {
            if (folder._is_finished) {
                return;
            }

            var cache = this.get_belong_cache();

            folder.has_sign_once = true;

            if (cache.is_done()) {//已完成，查看是否含有上传错误的子任务,并响应更新folder结果信息
                folder._is_finished = true;
                if (folder.state === 'pause') {//文件夹暂停后，其中最后一个子任务，不能被暂停，并且报错，则直接减去一个pause状态
                    folder.minus_info('pause');
                }
                if (cache.get_count_nums().error > 0) {
                    var can_re_start = false;
                    cache.each(function () {
                        if (this.state === 'error' && this.can_re_start()) {//如果能重试上传，则将folder任务设置为可上传,错误码取第一条可重试任务的错误码
                            can_re_start = true;
                            return false;
                        }
                    });
                    if (!can_re_start) {//子任务不能重试,将folder置为不可重试的任务
                        folder.can_not_re_start = true;
                    }
                    folder.change_state('error', folder.log_code);
                } else {
                    folder.change_state('done');
                }

            } else {//更新folder进度信息

                if (folder.state !== 'pause') {
                    folder.change_state('upload_file_update_process', {'Processed': this.get_passed_size()});
                }
            }
        }
    };
    var manager = {
        aop_task: function () {
            if (this.is_init)
                return;
            this.is_init = true;
            //用于阻塞整个队列继续执行  sub task before nex_task
            get_sub_class().getPrototype().events.nex_task = functional.before(get_sub_class().getPrototype().events.nex_task, function () {
                var f_id = this.folder_id,
                    folder;
                if( f_id && (folder = Cache.get_folder_by_id(f_id) ) ){
                    if(!folder.get_curr_cache()[f_id]){
                        return false;
                    }
                }
            });
            //监控子类状态变化
            get_sub_class().interface('change_state',
                functional.after(get_sub_class().getPrototype().change_state, function () {
                    var me = this,
                        f_id = me.folder_id;
                    if (f_id) {
                        var folder = Cache.get_folder_by_id(f_id);
                        if (folder) {
                            if (folder.state === 'pause') {
                                if (me.can_pause_self()) {
                                    c.log('sub-task change_state add into resume_file_local');
                                    me.stop_upload();
                                    me.state = 'fake_done';//文件夹续传的时候，支持继续上传标志
                                    me.get_queue().head(me, function () {
                                        this.resume_file_local();
                                    });
                                } else {
                                    c.warn('can not pause this task : ', me.state, me.file_name);
                                }
                                return;
                            }
                            sub_task_state[me.state] && sub_task_state[me.state].call(me, folder);
                        }
                    }
                })
            );
            //监控父类状态变化
            Upload.interface('change_state',
                functional.after(Upload.getPrototype().change_state, function () {
                    if (this.file_type === Static.FOLDER_TYPE) {
                        if (folder_status[this.state]) {
                            folder_status[this.state].call(this);
                        }
                    }
                })
            );

            //清理子任务   folder before clear
            Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function () {
                if (this.file_type === Static.FOLDER_TYPE) {
                    Static.clear_upload_all(this.sub_cache_key);//清除子任务；
                }
            });
            //清理子任务   folder after clear
            Upload.getPrototype().dom_events.click_cancel = functional.after(Upload.getPrototype().dom_events.click_cancel, function () {
                if (this.file_type === Static.FOLDER_TYPE) {
                    Cache.get_up_main_cache().is_contain_folder(true);//更新是否含有文件夹
                }
            });
        },
        /**
         * 添加子任务 默认状态为wait，支持刷新续传
         * @param files 子任务构造参数对象数组
         * @param upload_plugin
         * @param cache_key
         * @param folder_id 所属文件夹的local_id 文件夹的local_id为不变值
         * @returns {number}
         */
        add_sub_upload: function (files, upload_plugin, cache_key, folder_id) {
            var len = files.length,//总长度
                size = 0;//总大小
            functional.burst(files,function (unit) {
                var task = get_sub_class().getInstance(
                    unit.file || unit.path,//file.file来自上传文件夹，file.path来自续传
                    upload_plugin,
                    {
                        'ppdir': unit.ppdir, 
                        'pdir': unit.pdir,
                        'ppdir_name': unit.ppdir_name, 
                        'pdir_name': unit.pdir_name,
                        'dir_paths': unit.dir_paths, 
                        'dir_id_paths': unit.dir_id_paths,
                        'cache_key': cache_key, 
                        'view_key': 'empty'
                    }, 
                    folder_id
                );

                if (unit.server) {//来自续传
                    task.change_state('resume_pause', unit);//状态转为续传
                    task.get_passed_size(task.get_passed_size() + task.processed);//设置已传输大小
                } else {
                    task.change_state('wait');//状态转为wait，放入队列等待.
                }

                size += task.file_size;//文件夹大小累加
                if ((len -= 1) === 0) {
                    var folder = Cache.get_task(folder_id);
                    folder.get_total_size(folder.get_total_size() - fake_size + (folder.file_size = size));//更新文件夹所在cache大小
                    folder.on_sub_task_ready();
                    if (folder.state === 'wait') {
                        folder.events.nex_task.call(folder);//执行下一个任务
                    }
                }

            }, burst_num,63).start();
        },
        /**
         * 添加文件夹上传任务
         * @param upload_plugin
         * @param files 子任务构造参数对象数组
         * @param attrs 文件夹构造参数对象
         * @returns {*}
         */
        add_upload: function (upload_plugin, files, attrs) {//添加上传对象
            manager.aop_task();
            var folder = Upload.getInstance(upload_plugin, attrs); //生成上传对象
            folder.get_total_size(folder.get_total_size() + (folder.file_size = fake_size));
            return folder;
        }
    };

    var action = {
        /**
         * @param upload_plugin
         * @param files
         * @param attrs{dir_name, ppdir, pdir, ppdir_name, pdir_name, dir_paths, dir_id_paths}
         * @param response
         */
        add_upload: function (upload_plugin, files, attrs, response) {//添加上传对象
            setTimeout(function () {
                action._add_upload(upload_plugin, files, attrs, response);
            }, 200);
        },
        _add_upload: function (upload_plugin, files, attrs, response) {//添加上传对象
            View.show();
            attrs = $.extend(attrs, {'sub_cache_key': 'cache_key_' + random.random(), 'file_count': files.length});
            var folder = manager.add_upload(upload_plugin, files, attrs);
            Cache.get_up_main_cache().is_contain_folder(true);
            response = response || {'code': 1};//待bondli 完成后，删除
            switch (response.code) {
                case(1)://正常任务
                {
                    folder.change_state('wait');//状态转为wait，放入队列等待.
                    break;
                }
                case(2)://空目录
                {
                    folder.change_state('start');
                    folder.change_state('done');
                    break;
                }
                case(3)://创建目录失败，不可重试的
                {
                    folder.can_not_re_start = true;
                    folder.error_type = 'client';
                    folder.change_state('error', response.text);
                    return;
                }
                case(4)://低概率的创建目录失败，可重试创建目录
                {
                    folder.folder_can_not_start = true;
                    folder.re_try_text = response.text;
                    folder.change_state('error');
                    break;
                }
                case(100)://来自续传
                {
                    folder.change_state('resume_pause', 0);//状态转为续传
                    break;
                }
            }
            manager.add_sub_upload(files, upload_plugin, attrs.sub_cache_key, folder.local_id);
        },
        add_resume: function (files, upload_plugin) { //断点续传
            $.each(files, function () {
                if (this.files && this.attrs) {
                    action.add_upload(upload_plugin, this.files, this.attrs, {'code': 100}); //生成上传对象
                }
            });
        }
    };
    return action;
});/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */


define.pack("./upload_plugin_start",["lib","common","$","i18n","./upload_route","./select_folder.get_up_folder_files","./select_folder.upload_folder_validata","./upload_plugin.upload_plugin","./upload_plugin.upload_plugin_folder","./select_folder.upload_4g_validata","./select_folder.select_folder","./tmpl","disk","./select_folder.loading","./upload_folder_appbox"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        upload_route = require('./upload_route'),
        get_up_folder_files = require('./select_folder.get_up_folder_files'),
        FolderValidata = require('./select_folder.upload_folder_validata'),
        upload_plugin_files = require('./upload_plugin.upload_plugin'),
        upload_plugin_folder = require('./upload_plugin.upload_plugin_folder'),
        G4Validata = require('./select_folder.upload_4g_validata'),
        select_folder = require('./select_folder.select_folder'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),

        functional = common.get('./util.functional'),
        Module = common.get('./module'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        store = lib.get('./store'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        plugin_detect = common.get('./util.plugin_detect'),
        user_log = common.get('./user_log'),

        c = lib.get('./console'),
        JSON = lib.get('./json'),

        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),

        loading = require('./select_folder.loading'),

        

        G1 = Math.pow(2, 30),
        G2 = G1 * 2,
        G4 = G1 * 4,
        G32 = G1 * 32;

    upload_event.on('add_upload', upload_plugin_files.add_upload);
    upload_event.on('add_folder_upload', upload_plugin_folder.add_upload);

    if(constants.IS_APPBOX){
        //QQ2.0 appbox的文件夹读取
        var upload_folder_appbox = require('./upload_folder_appbox');
    }


    //显示升级控件的提示
    var _show_upgrade_tips = function () {
        var msg = '',
            btns = [
                {
                    id: 'OK', text: _(l_key,'升级控件'), klass: 'ui-btn-other', visible: true
                }
            ];
        if (constants.IS_APPBOX) {
            msg = _(l_key,'该文件超过4G暂不支持上传,请使用<a target="_blank" href="http://d.weiyun.com/">IE</a>上传');
            btns = [
                {id: 'CANCEL', text: _(l_key,'确定'), klass: 'ui-btn-other', visible: true}
            ];
        } else {
            if ($.browser.msie) {
                msg = _(l_key,'文件大小超过4G，请升级控件完成上传。控件升级后，单文件大小上限将提升至32G。');
            } else {
                msg = _(l_key,'文件大小超过2G，请升级控件完成上传。控件升级后，单文件大小上限将提升至32G。');
            }
        }
        var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text" style="text-align:left;padding-left:15px;">' + msg + '</span></p>');
        var dialog = new widgets.Dialog({
            title: _(l_key,'上传提醒'),
            empty_on_hide: true,
            destroy_on_hide: true,
            content: $el,
            tmpl: tmpl.dialog3,
            mask_bg: 'ui-mask-white',
            mask_ns: 'gt_4g_tips',
            buttons: btns,
            handlers: {
                OK: function () {
                    dialog.hide();
                    window.open('http://www.weiyun.com/plugin_install.html?from=ad');
                },
                CANCEL: function () {
                    dialog.hide();
                }
            }
        });
        dialog.show();
    };
    //检查文件大小的合法性
    var _check_max_files_size = function (files, upload_plugin) {
        if (files.length > 1) {//选择的文件个数大于1个时，直接进入到任务管理器中，这里不进行32G限制检测
            select_folder.show(files, upload_plugin, 'plugin');
            return;
        }
        var file_size = _get_file_size(upload_plugin, files[0]),
            g4Validata = G4Validata.create(),
            ret;

        g4Validata.add_validata('max_file_size', file_size, G32);
        ret = g4Validata.run();

        if (ret[1] == 1 || ret[1] == 3) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + ret[0] + '</span></p>');
            var btn = {id: 'CANCEL', text: _(l_key,'确定'), klass: 'ui-btn-other', visible: true};
            var dialog = new widgets.Dialog({
                title: _(l_key,'上传提醒'),
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog3,
                mask_ns: 'gt_4g_tips',
                buttons: [ btn ],
                handlers: {
                }
            });
            dialog.show();
            return;
        }
        else {
            select_folder.show(files, upload_plugin, 'plugin');
            return;
        }
    };

    //获取文件大小
    var _get_file_size = function (upload_plugin, path) {
        var file_size = functional.try_it(function () {
            return upload_plugin.GetFileSizeString(path) - 0;
        }) || upload_plugin.GetFileSize(path) || 0;

        file_size = file_size - 0;
        if (file_size < 0) {
            file_size += 4 * 1024 * 1024 * 1024;
        }

        return file_size;
    };
    //过滤大于max_size的文件(选择文件时候)
    var _filter_files_by_size = function (files, upload_plugin, max_size) {
        var fileArr = [],
            flag = false;
        for (var i = 0, l = files.length; i < l; i++) {
            var path = files[i];
            if (_get_file_size(upload_plugin, path) >= max_size) {
                flag = true;
            }
            else {
                fileArr.push(path);
            }
        }
        return {"files": fileArr, "flag": flag};
    };
    var check_start_upload=function(__files,upload_plugin,max){
        if(constants.IS_APPBOX){
            var fileObj = _filter_files_by_size(__files, upload_plugin, G4);
            if (fileObj.flag == true && !plugin_detect.is_newest_version() && fileObj.files.length === 0) {//老控件 && 大于等于4G文件 && 批次文件中没有小于2G的文件
                _show_upgrade_tips();
            } else {
                _check_max_files_size(__files, upload_plugin);
            }
        } else {
            var fileObj = _filter_files_by_size(__files, upload_plugin, max);
            if (fileObj.flag == true && !plugin_detect.is_newest_version() && fileObj.files.length === 0) {//老控件 && 大于等于4G文件 && 批次文件中没有小于2G的文件
                _show_upgrade_tips();
            } else {
                _check_max_files_size(__files, upload_plugin);
            }
        }

    };
    //文件上传 选择框
    var start_upload = function (upload_plugin) {    //用户通过选择框上传
        //chrome
        if (upload_plugin.SelectFilesAsync && !$.browser.safari) {      //firefox和chrome下都有异步选取文件的方法. 且如果用同步, firefox会卡死. safari不能用异步选取文件.
            return upload_plugin.SelectFilesAsync(window, function (files) {
                if (!files) {
                    return;
                }
                var __files = files.split('\r\n');
                __files.pop();

                if (!__files || !__files.length) { //没有选中文件退出
                    return;
                }
                check_start_upload(__files, upload_plugin,G2);
                return;

            });
        }

        //IE
        var files = functional.try_it(function () {
            //上传文件
            var ary = upload_plugin.SelectFiles(window).split('\r\n');
            ary.pop(); //选取的文件

            return ary;
        });

        if (!files || !files.length) { //没有选中文件退出
            return;
        }
        check_start_upload(files, upload_plugin,G4);
    };

    //上传文件夹 选择框
    var start_folder_upload = function (upload_plugin) {
        var is_canceled = false;
        //先判断下控件是否支持上传文件夹
        try {
            //以下是异步方式
            var taskId = upload_plugin.AsyncSelectFolder(window, constants.UPLOAD_FOLDER_LEVEL, '');
            //预先定义一个回调函数给控件调用，在这里拿返回值
            //web:upload_plugin.OnAsyncSelectFolderEvent
            //appbox:window.OnAsyncSelectFolderEvent
            upload_plugin.OnAsyncSelectFolderEvent = window.OnAsyncSelectFolderEvent = function (event_param) {
                //appbox是字符串，需要处理下
                if( (typeof event_param).toLowerCase() === 'string' ){
                    event_param = JSON.parse( event_param );
                }
                var filestr = event_param.testx,
                    error_code = event_param.ErrorCode;

                //c.log('file_string:'+filestr);
                //c.log('error_code:'+error_code);

                if(is_canceled == true) return 1; //用户点击了取消，后面的都不执行了

                if (error_code == 42260001) { //选择了整个磁盘
                    loading.hide();
                    var ret = [_(l_key,'暂不支持上传整个盘符，请重新选择。'), 1];
                }
                else if (error_code == 42260002) { //点击了取消
                    loading.hide();
                    return 1;
                }
                else {
                    if( (typeof filestr) === 'undefined') { //第一次进来，扫描开始
                        loading.show(_(l_key,'正在获取文件夹信息'), function(){
                            is_canceled = true;
                            loading.hide();
                        });
                        return 1;
                    }

                    loading.hide();

                    var __files = filestr.split('\r\n');
                    __files.pop();

                    //c.log(__files);

                    if (!__files || !__files.length) { //没有选中文件退出
                        return 1;
                    }

                    var files = get_up_folder_files(__files);
                    //c.log(JSON.stringify(files));

                    var folderValidata = FolderValidata.create();
                    folderValidata.add_validata('max_dir_size', files.dir_total_num, constants.UPLOAD_FOLDER_DIR_NUM);  //目录数太多验证
                    var max_file_num_dir_name = text.smart_cut(files.max_file_num_dir_name, 20);
                    folderValidata.add_validata('max_level_size', files.dir_level_num, max_file_num_dir_name, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
                    folderValidata.add_validata('max_files_size', files.file_arr && files.file_arr.length, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
                    //folderValidata.add_validata('user_space', files.file_size, query_user.get_cached_user().get_used_space(), query_user.get_cached_user().get_total_space());  //用户剩余空间验证
                    var ret = folderValidata.run();
                }

                if (ret) {
                    var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + ret[0] + '</span></p>');
                    var dialog = new widgets.Dialog({
                        title: _(l_key,'上传提醒'),
                        empty_on_hide: true,
                        destroy_on_hide: true,
                        content: $el,
                        tmpl: tmpl.dialog3,
                        mask_ns: 'gt_4g_tips',
                        buttons: [
                            {id: 'CANCEL', text: _(l_key,'确定'), klass: 'ui-btn-other', visible: true}
                        ],
                        handlers: {
                        }
                    });
                    dialog.show();
                    return 1;
                }
                else {
                    select_folder.show_by_upfolder(files, upload_plugin);
                    return 1;
                }

                return 1;
            };

            if(constants.IS_APPBOX){
                //QQ2.0 appbox的文件夹读取
                upload_folder_appbox.init(upload_plugin);
            }

        }
        catch (e) {
            //触发升级控件提示
            upload_event.trigger('install_plugin', _(l_key,'请升级控件以支持文件夹上传。'), 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
            return;
        }

    };

    //选择4G大文件 选择框
    var start_4g_upload = function (upload_plugin, is_support_4g) {
        //先判断是否支持大文件上传，不支持就提示升级控件
        if (is_support_4g === false) {
            upload_event.trigger('install_plugin', _(l_key,'请升级控件以支持超大文件上传。'), 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
            return;
        }
        else {
            //firefox必须使用回调.
            if (upload_plugin.SelectFileAsync && !$.browser.safari) {
                return upload_plugin.SelectFileAsync(window, function (_files) {
                    if (!_files) {
                        return;
                    }

                    var files = _files.split('\r\n');
                    //__files.pop();

                    if (!files || !files.length) { //没有选中文件退出
                        return;
                    }

                    _check_max_files_size(files, upload_plugin);
                    return;

                });
            }
            else {
                //IE 只支持选一个文件
                var files = functional.try_it(function () {
                    //上传文件
                    var ary = upload_plugin.SelectFile(window).split('\r\n');

                    //ary.pop(); //选取的文件
                    return ary;
                });

                if (!files || !files.length || files[0] == '') { //没有选中文件退出
                    return;  //当点击取消也会调用这里
                }

                _check_max_files_size(files, upload_plugin);
                return;
            }

        }

    };

    var plugin_start = new Module('plugin_start', {  //初始化

        render: function () {
            upload_event.on('start_upload', start_upload);

            upload_event.on('start_folder_upload', start_folder_upload);

            upload_event.on('start_4g_upload', function (upload_plugin, is_support_4g) {
                start_4g_upload(upload_plugin, is_support_4g);
            });

            this.listenTo(upload_route, 'render', function () {

                //拖拽或者通过QQ上传到微云按钮上传

                upload_event.on('start_upload_from_client', function (files, is_qq_receive) {
                    var ppdir, pdir, ppdir_name, pdir_name, node, node_name;
                    if (disk.is_rendered() && disk.is_activated()) {
                        //var node = file_list.get_cur_node() || file_list.get_root_node();
                        node = file_list.get_cur_node();
                        //判断是否虚拟目录,是虚拟目录强制回到根目录
                        if (node && node.is_vir_dir()) {
                            node = file_list.get_root_node();
                        }
                        node_name = node.get_name();

                        pdir = node.get_id();
                        ppdir = node.get_parent().get_id();
                        pdir_name = node_name;
                        ppdir_name = node.get_parent().get_name() || '';

                    }
                    else {
                        var node_id = query_user.get_cached_user().get_main_key();
                        node_name = query_user.get_cached_user().get_main_dir_name();

                        pdir = node_id;
                        ppdir = query_user.get_cached_user().get_root_key();
                        pdir_name = node_name;
                        ppdir_name = '';
                    }

                    //c.log(ppdir,pdir,ppdir_name,pdir_name);
                    return upload_event.trigger('add_upload', upload_route.upload_plugin, files, {
                        'ppdir': ppdir,
                        'pdir': pdir,
                        'ppdir_name': ppdir_name,
                        'pdir_name': pdir_name,
                        'dir_paths': [],
                        'dir_id_paths': [],
                        'is_qq_receive': is_qq_receive
                    });
                });

                //断点续传 code by bondli 直出导致upload_route没有render，代码提前
                var start = function () {
                    var json_str = store.get(query_user.get_uin() + 'resume_store');
                    //c.log('resume files:'+json_str);
                    if (json_str) {
                        functional.try_it(function () {
                            var resume_lists = JSON.parse(json_str);
                            if (resume_lists.tasks && resume_lists.tasks.length) {
                                upload_plugin_files.add_resume(resume_lists.tasks, upload_route.upload_plugin);
                            }
                            if (resume_lists.folder_tasks && resume_lists.folder_tasks.length) {
                                upload_plugin_folder.add_resume(resume_lists.folder_tasks, upload_route.upload_plugin);
                            }
                            /*if( resume_lists.down_tasks && resume_lists.down_tasks.length){
                                if(constants.IS_APPBOX){
                                    //c.log('resume_lists.down_tasks.length:'+resume_lists.down_tasks.length);
                                    var donwload = require('./download.appbox');
                                    donwload.add_resume(resume_lists.down_tasks);
                                }
                            }*/
                        });
                    }
                };

                var user = query_user.get_cached_user();
                if (user) {
                    start();
                } else {
                    this.listenToOnce(query_user, 'load', function () {
                        start();
                    });
                }

            });
            
        }

    });

    plugin_start.render();


    upload_event.on('set_resume_store', function (files) {   //离开页面前设置需要续传的文件.
        var key = query_user.get_uin() + 'resume_store';
        store.set(key, JSON.stringify(files));
    });

    //获取正在上传的文件ID
    upload_event.on('get_curr_upload_file_id', function () {
        var key = query_user.get_uin() + 'upload_file_id',
            id = store.get(key);
        return id ? id : null;
    });

    //设置正在上传的文件ID
    upload_event.on('set_curr_upload_file_id', function (id) {
        var key = query_user.get_uin() + 'upload_file_id';
        if(id){
            store.set(key, id);
        }
        else{
            store.remove(key);
        }
    });


    module.exports = plugin_start;

    return module;


});
/**
 * 上传控件入口, 选择使用哪种上传方式
 * @author svenzeng
 * @date 13-3-1
 */

define.pack("./upload_route",["lib","common","$","i18n","./upload_global_function","main","./tmpl","./Upload_class","./upload_plugin_start","./drag_upload_active","./upload_flash_start","./upload_form_start","./drag_upload_html5","./select_folder.dropdown_menu"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        constants = common.get('./constants'),
        functional = common.get( './util.functional' ),
        Module = common.get('./module'),
        upload_event = common.get('./global.global_event').namespace( 'upload2' ),

        OP_CFG_UPLOAD_SELECT_FILE =common.get('./configs.ops').get_op_config('UPLOAD_SELECT_FILE'),//上传主按钮统计ID

        global_function = require('./upload_global_function'),

        random = lib.get('./random'),
        console = lib.get('./console'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        tmpl = require('./tmpl'),
        upload_dom = main_ui.get_$uploader(),
        plugin_detect = common.get('./util.plugin_detect'),
        query_user = common.get('./query_user'),
        is_safari = $.browser.safari,
        ua = navigator.userAgent.toLowerCase(),
        is_windows = ua.indexOf("windows") > -1 || ua.indexOf("win32") > -1,

        IS_PLUGIN_DRAG = false;

    var get_upload_plugin = function(){

        var plugins = {};

        var get_active_plugin = function(){

            if ( is_safari || !is_windows ) {  // 控件不支持非windows，不支持safari（包括windows safari）
                throw new Error('unsupported system or browser');
            }
            
            var obj;

            //先加载新控件，新控件不存在再加载老控件，老控件也没有就没有了
            try{
                obj = new ActiveXObject("TXWYFTNActiveX.FTNUpload");
                require('./Upload_class');    //上传类        惰性加载
                require('./upload_plugin_start');    //开始上传之前的就绪工作
                require('./drag_upload_active');    //准备IE下拖拽上传

                
                 // TODO 设一个标志位，来标志该拖拽上传方式是否可用
                 
                IS_PLUGIN_DRAG = true;

                obj.OnEvent = global_function;
                //增加控件版本信息
                try{
                    var version = ', version:'+ obj.Version;
                    this.is_support_4g = plugin_detect.is_newest_version() ? true : false;//最新版本支持4G以上
                }
                catch(e){
                    var version = '';
                    this.is_support_4g = false;
                }
                console.debug( 'ActiveXObject plugin' + version);
                this.type = 'active_plugin';
                return obj;
            }
            catch(e){
                try{
                    obj = new ActiveXObject("TXFTNActiveX.FTNUpload");
                    require('./Upload_class');    //上传类        惰性加载
                    require('./upload_plugin_start');    //开始上传之前的就绪工作
                    require('./drag_upload_active');    //准备IE下拖拽上传

                    
                    // 设一个标志位，来标志该拖拽上传方式是否可用
                     
                    IS_PLUGIN_DRAG = true;

                    obj.OnEvent = global_function;
                    console.debug( 'ActiveXObject plugin' );
                    this.is_support_4g = false;
                    this.type = 'active_plugin';
                    return obj;
                }
                catch(e){
                    throw new Error( 'ActiveXObject plugin init error' );
                }
            }
        };

        var get_webkit_plugin = function(){

            if ( is_safari || !is_windows ) {  // 控件不支持非windows，不支持safari（包括windows safari）
                throw new Error('unsupported system or browser');
            }

            if ( window.external && window.external.UploadFile ){
                require('./Upload_class');    //上传类        惰性加载
                require('./upload_plugin_start');    //开始上传之前的就绪工作
                window.external.OnEvent = global_function;   //设置上传的client相关回调
                window.external.__type = 'webkit_plugin';
                console.debug( 'webkit_plugin plugin' );
                this.type = 'webkit_plugin';
                return window.external;
            }

            var embed = $( '<embed id="npftnPlugin" type="application/txftn-webkit" width="0" height="0" style="position:absolute"></embed>' ).appendTo( $('body') )[ 0 ];

            //var embed = $('<embed id="QQMailFFPluginIns" type="application/x-tencent-qmail-webkit" hidden="true">').appendTo( $('body') )[ 0 ];

            if ( embed.UploadFile ){

                require('./Upload_class');    //上传类        惰性加载
                require('./upload_plugin_start');    //开始上传之前的就绪工作

                //require('./upload.drag_upload_active')('webkit_plugin');    //准备webkit下拖拽上传
                embed.OnEvent = global_function;   //设置上传的client相关回调
                window.upload_obj = embed;
                embed.__type = 'webkit_plugin';
                //增加控件版本信息
                try{
                    var version = ', version:'+ embed.Version;
                    this.is_support_4g = plugin_detect.is_newest_version() ? true : false;//最新版本支持4G以上
                    //this.is_support_4g = ( embed.UploadFileV2 ) ? true : false;
                }
                catch(e){
                    var version = '';
                    this.is_support_4g = false;
                }
                console.debug( 'webkit_plugin' + version );
                
                this.type = 'webkit_plugin';
                return embed;
            }

            throw new Error( 'webkit plugin init error' );

		};

        var get_flash = function () {
            var flash_version = 10; //给一个默认值

            var hasFlash = function () {
                // appbox
                var ext = window.external;
                if (ext && ext.FlashEnable && ext.FlashEnable()) {
                    return true;
                }
                else if ($.browser.msie) {

                    // 上面的flash版本判断没有使用到，暂时注释掉，改为下面的方式，因为 #1 代码块会导致IE的浏览器标题栏变为“微云#disk”，原因不明 - james 2013-5-11
                    try {
                        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
                        if (swf) {
                            var VSwf = swf.GetVariable("$version");
                            flash_version = parseInt(VSwf.split(" ")[1].split(",")[0], 10); 
                            return true;
                        }
                    }
                    catch (e) {
                    }
                } 
                else {
                    var plugs = navigator.plugins;
                    if (plugs && plugs.length > 0 && plugs['Shockwave Flash']) {
                        flash_version = plugs['Shockwave Flash'].description.split('Shockwave Flash ')[1];
                        flash_version = parseInt(flash_version, 10);
                        return true;
                    }
                }

                return false;
            }();


            if (!hasFlash) {
                throw new Error('flash plugin init error');
            }

            //判断flash的版本是否小于10，小于10就降级为form上传
            if(flash_version < 10){
                console.log('flash version:'+flash_version+' no support upload file');
                throw new Error('flash version no support upload file');
            }

            var flash_url = 'http://imgcache.qq.com/club/qqdisk/web/FileUploader.swf?r=' + random.random(),
                img_url = 'http://imgcache.qq.com/vipstyle/nr/box/img/upload_02.png',
                isIe = $.browser.msie;

                var mode = 1;

            upload_dom.empty();

            //code by bondli 去掉背景图，才能保证设置的宽度和高度都是手型，flash会根据背景图的大小设置该大小的宽度和高度
            var $upload_obj = $(['<b class="icon_upload"></b><span id="uploadswf">', '<object id="swfFileUploader"' + (isIe ? '' : ' data="' + flash_url + '"') + ' style="width:' + 130 + 'px;height:' + 40 + 'px;left:0px;top:0px;position:absolute"' + (isIe ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + '>', isIe ? '<param name="movie" value="' + flash_url + '"/>' : '', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="wmode" value="transparent" />', '<param name="flashVars" value="callback=window.FileUploaderCallback&selectionMode=' + (mode === 1 ? 1 : 0) + '&buttonSkinURL=' + img_url + '"/>', '<param name="menu" value="false" />', '</object></span>'].join(''))
                .appendTo( upload_dom );

            var upload_obj = $upload_obj.find('object')[0];

            if (isIe) {
                setTimeout(function() {
                    upload_obj.LoadMovie(0, flash_url);
                }, 0);
            } else {
                upload_obj.setAttribute("data", flash_url);
            }

            require('./Upload_class');
            require('./upload_flash_start');

            console.debug('flash_plugin, version:'+flash_version);
            this.type = 'upload_flash';


            return upload_obj;

        };

        var get_form = function(){

            console.debug( 'form_plugin' );
            this.type = 'upload_form';

            require('./Upload_class');
            require('./upload_form_start');

            var __random = random.random(),
                body = $( 'body' );

            upload_dom.empty();
            var iframe = $( '<iframe name='+ __random +' id='+ __random +' style="display:none;width:0px;height:0px;"></iframe>' ).appendTo( body );
            var form = $( '<form method="post" action="http://diffsync.cgi.weiyun.com/" target='+ __random +' enctype="multipart/form-data"><div class="uploads upload-form"><input name="file" type="file" class="ui-file"/></div></form>' ).appendTo( upload_dom );

            var parentNode = form.find( 'div' );

            var send = function( param ){
                for ( var key in param ){
                    $( '<input type="hidden"></input>' ).attr( 'name', key ).val( param[ key ] ).appendTo( parentNode );
                }
                form.submit();
            };

            var destory = function(){
               parentNode.find( 'input:hidden' ).remove();
            };

            var get_path = function(){
                return $( '.ui-file' ).val();
            };

            var change_fn,
                change = function( fn ){
                    change_fn = fn;
                };

            form.change(function(){
                if ( !change_fn ){
                    return;
                }
                change_fn();
            });

            return {
                send: send,
                destory: destory,
                form: form,
                change: change,
                get_path: get_path
            };

        };

        plugins = {
            get_active_plugin: get_active_plugin,
            get_webkit_plugin: get_webkit_plugin,
            get_flash: get_flash,
            get_form: get_form
        };

        return functional.getSingle(function(){

            for ( var key in plugins ){
                try{
                    return plugins[ key ].call( this );
                }catch(e){
                    continue;
                }
            }

        });

    }();


	var upload = new Module( 'upload', {

		upload_plugin_type: 'form',
        /**
         * 是否库2.0
         * @returns {boolean}
         */
        is_ku20: function(){
           if(typeof this._ku20 !== 'boolean'){
               this._ku20 = query_user.get_cached_user().get_ps_move_flag();
           }
           return this._ku20;
        },
        /**
         * 获取根目录名称  库2.0为微云，老微云为 网盘
         * @returns {String}
         */
        get_root_name: function(){
            if(!this.root_name){
                this.root_name = _(l_key,(this.is_ku20() ? '微云' : '网盘'));
            }
            return this.root_name;
        },

        /*
         * 开始上传
         *
         */

		render: function(){

			var self = this;

            this.upload_plugin = get_upload_plugin.call( self ); //上传控件对象

            //判断是否安装了支持拖拽上传的控件
            if (IS_PLUGIN_DRAG === false){
                if(window.FileReader){
                    require('./drag_upload_html5');
                }

            }
            /*
             * 监听选择框上传按钮事件
             *
             */
            //装了控件才加载“上传文件夹”,“上传超大文件”的按钮
            if( this.type == 'active_plugin' || this.type == 'webkit_plugin' ) {
                //appbox支持文件夹，超大文件
                if(constants.IS_APPBOX){
                    upload_dom.empty();

                    //新版appbox才出现下拉菜单
                    if( plugin_detect.is_newest_version() ){
                        $( tmpl.appbox_btn() ).appendTo( upload_dom.addClass('upload-dropdown') );
                    }
                    else{
                        $( tmpl.file_btn() ).appendTo( upload_dom );
                        upload_dom.addClass('nav-upload-plugin-free');
                        upload_dom.on('click',  function (e) {
                            if($(e.target).closest('a')[0]) { //这里不能直接阻止，form上传是弹不出文件选择框的
                                e.preventDefault();
                            }
                            //开始上传, 上传对象，上传ui
                            upload_event.trigger( 'start_upload', self.upload_plugin);
                        });
                    }
                }
                else{
                    $( this.type == 'active_plugin' ? tmpl.folder_btn() : tmpl.g4files_btn() ).appendTo( upload_dom.html('').addClass('upload-dropdown') );
                }

                //加载下拉收拢上传文件夹按钮
                var dropdown_menu = require('./select_folder.dropdown_menu');
                dropdown_menu.render();

                //上传文件
                upload_dom.find('[data-action="upload_files"]').on('click', function (e) {
                    e.preventDefault();
                    dropdown_menu.hide();
                    setTimeout(function(){
                        upload_event.trigger( 'start_upload', self.upload_plugin);
                    }, 100);
                    
                });
                //上传文件夹
                upload_dom.find('[data-action="upload_folder"]').on('click', function (e) {
                    e.preventDefault();
                    dropdown_menu.hide();
                    setTimeout(function(){
                        upload_event.trigger( 'start_folder_upload', self.upload_plugin);
                    }, 100);
                });
                //上传超大文件
                upload_dom.find('[data-action="upload_4g_file"]').on('click', function (e) {
                    e.preventDefault();
                    dropdown_menu.hide();
                    setTimeout(function(){
                        upload_event.trigger( 'start_4g_upload', self.upload_plugin, self.is_support_4g);
                    }, 100);
                    
                });

            }
            else {
                $( tmpl.file_btn() ).appendTo( upload_dom );
                upload_dom.addClass('nav-upload-plugin-free');
                upload_dom.on('click',  function (e) {
                    if($(e.target).closest('a')[0]) { //这里不能直接阻止，form上传是弹不出文件选择框的
                        e.preventDefault();
                    }
                    //开始上传, 上传对象，上传ui
                    upload_event.trigger( 'start_upload', self.upload_plugin);
                });

                //flash，form下上传按钮统计
                if( this.type == 'upload_flash' || this.type == 'upload_form' && OP_CFG_UPLOAD_SELECT_FILE) {
                    upload_dom.attr('data-tj-action','btn-adtag-tj').attr('data-tj-value', OP_CFG_UPLOAD_SELECT_FILE.op);
                }
                
            }

		}

	});

	module.exports = upload;

});



/**
 * 上传控件上面的小黄条tips
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./upload_tips",["common","$","./upload_route","./tool.upload_cache"],function (require, exports, module) {

    var common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Cache = require('./tool.upload_cache'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),

        ie = $.browser.msie,
        safari = $.browser.safari,
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        install_tip = (function () {
            if(constants.IS_APPBOX){
                return '当前的上传方式成功率较低，建议安装最新版的QQ，上传更稳定并支持查看进度。<a target="_blank" href="http://im.qq.com/qq/">立即安装</a>';
            }
            var href, wording;
            if (safari || !gbIsWin) {//非safari，window 显示插件安装
                href = 'http://www.adobe.com/go/getflashplayer';
                wording = 'Flash';
            } else {
                href = ie ? 'http://mail.qq.com/cgi-bin/readtemplate?t=browser_addon&check=false&s=install&aid=' + aid.WEIYUN_WEBAPP_DISK_LIJIANZHUANG
                    :
                    'http://mail.qq.com/zh_CN/crx/QQMailWebKitPlugin_1_0_1_53.exe?aid=' + aid.WEIYUN_WEBAPP_DISK_LIJIANZHUANG;
                wording = '极速上传';
            }
            return '当前的上传方式成功率较低，建议安装' + wording + '控件，更稳定并支持查看进度。<a href="' + href + '" target="_blank">立即安装</a>';
        })();

    var stack = [
        /**
         *1:表单上传时，判断是否显示小黄条
         *2:条件 form，总数小于7条;
         */
        function ($parent) {
            if (upload_route.type === 'upload_form' && Cache.length() < 7) {//显示提示信息
                if (!$parent[0].has_show_install) {
                    $parent.html(install_tip).show()[0].has_show_install = true;
                }
            } else {//隐藏提示信息
                if ($parent[0].has_show_install) {
                    $parent.hide()[0].has_show_install = false;
                }
            }
        }
    ];
    return {
        public_tip: function ($parent) {
            $.each(stack, function () {
                this($parent);
            });
        }
    }
});/**
 * 添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./upload_validata",["common","$","./msg","i18n"],function(require, exports, module) {

	var common = require('common'),
		File = common.get('./file.file_object'),
		$ = require('$'),
        msg = require('./msg'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        error_names = {
            EMPTY_NAME: ['',1000006],
            DENY_CHAR: ['',1000007],
            OVER_LIMIT: ['',1000008]
        };

	var map = {
        check_name:function(file_name){
            var code = File.check_name_error_code(file_name);
            if(code){
               return error_names[code];
            }
        },
        //大于4G，提示升级控件（老控件使用）
        up4g_size: function(curr_size, max_size) {
            if ( curr_size > max_size ){
                if ( max_size )
                    return [_(l_key,'大小超过{size}请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。')
                        .replace('{size}',File.get_readability_size( max_size )),1000005];
                    //return ['大小超过' + File.get_readability_size( max_size ) + '请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。',1000005];
            }
        },
		max_size: function( curr_size, max_size ){
			if ( curr_size > max_size ){
				if ( max_size )
				    return ['文件超过' + File.get_readability_size( max_size ),1000001];
			}
		},
		flash_max_size: function( curr_size, max_size ){
			if ( curr_size > max_size ){
				if ( max_size )
                    return [msg.get('upload_error', 1000002),1000002];
			}
		},
		max_space: function( curr_size, space, space_totle ){
			if ( curr_size + space  > space_totle ){
                return [msg.get('upload_error', 1000003),1000003];
			}
		},
		empty_file: function(curr_size){
			if ( curr_size - 0 === 0 ){
                return [msg.get('upload_error', 1000004),1000004];
			}
		}
	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
                    flag = ret;
                    return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});
/**
 * 上传控件UI
 * 改造思路 拆分：
 *      1：区分方法类型 静态，原型（状态类，工具类）,$dom方法 (已完成)
 *      2：缩短调用原型链接(todo)
 * @author svenzeng
 * @date 13-3-1
 */
define.pack("./view",["lib","common","$","i18n","main","./upload_route","./tmpl","./upload_tips","./tool.upload_static","./tool.upload_cache","./event","./tool.bar_info","./view_type.empty","./view_type.folder","./view_type.webkit_down"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        functional = common.get('./util.functional'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        file_type_map = common.get('./file.file_type_map'),
        global_event = common.get('./global.global_event'),
        File = common.get('./file.file_object'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        space_info = require('main').get('./space_info.space_info'),

        upload_route = require('./upload_route'),
        tmpl = require('./tmpl'),
        upload_tips = require('./upload_tips'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        event = require('./event'),
        bar_info,

        $body = $(document.body),
        ie6 = $.browser.msie && $.browser.version < 7,
        lt_ie9 = $.browser.msie && $.browser.version < 9, //ie6,7,8
        position = ( ie6 ? 'absolute' : 'fixed'),

        dom_cache = {length: 0},//view instance ，映射 upload_obj对象的集合; 加上这一层用于 分开 dom对象 和 内存对象

        make_wrap = function(){
            return {//性能优化 面板中的wrap对象
                _wrap_id_prefix: 'upload_row_wrap_', //管理器中，列的包装对象ID前缀
                _visable_index: 1,//当前可见索引ID
                set_visable_index:function(index){//设置可见索引ID
                    this._visable_index = index;
                },
                get_visable_index:function(){//获取可见索引ID
                    return this._visable_index;
                },
                batch: 30,//每个显示区域显示的总数
                current: 0//当前最大显示区域索引ID
            };
        },
        instance_wrap = make_wrap(),

        row_id_prefix = 'upload_row_',//管理器中，列ID前缀
        G4 = Math.pow(2, 30) * 4,

        default_height = 41,//默认行高
        error_height = 53;//出错时的行高
    require.async(constants.IS_APPBOX ? 'appbox_upbox_css' : 'upbox_css');//加载样式
    if( !constants.IS_APPBOX ){//web才有控件安装样式
        require.async('upload_install_css');//加载控件安装样式  该样式依赖upbox_css 因此必须再它之后加载
    }

    // 文本长度略缩计算相关
    var measurer, separator_width, ellipsis_width;

    var view = new Module('upload2_view', {
        /**
         * IE6使用position absolute定位 ，需要重置窗口位置
         */
        on_window_scroll: function () {
            if (this._is_show && ie6) {
                var height = this.$dom.height(),
                    real_top = ( this._win_visable_height + $(window).scrollTop() - height ) - 3;
                this.$dom.css('top', (real_top + 'px'));
                // 当有影响定位的情况发生时，关掉浮动TIP
                this.hide_float_tips();
            }
        },
        // 现在的方法定义有些问题，下面定义的hide_float_tips在第一次render时还没添加上
        hide_float_tips: $.noop,
        /**
         * 窗口重置时，修改可见高度，并触发视图的窗口滚动处理
         */
        on_window_resize: function () {
            this._win_visable_height = window.innerHeight && !$.browser.msie ? window.innerHeight : document.documentElement.clientHeight;//可视高度
            this.on_window_scroll();
            this.hide_float_tips();
        },
        /**
         * 上传管理器最大化
         */
        max: function () {
            this._is_max = true;
            this.switch_upbox_btn.attr('data-action', 'click_to_min');
            this.$dom.removeClass('upbox-mini');
            this.on_window_scroll();
            this.on_done_reset_scroll(0,true);
            this.on_box_change_scroll(true);
            /*
            if(!bar_info.is_done()){
                this.on_box_change_scroll(true);
            }
            */
        },
        /**
         * 上传管理器最小化
         */
        min: function () {
            if(this._is_max===false){//避免重复调用
                return;
            }
            this._is_max = false;
            this.switch_upbox_btn.attr('data-action', 'click_to_max');
            this.$dom.addClass('upbox-mini');
            this.on_window_scroll();
        },
        clear: function(){
            instance_wrap = make_wrap();
            view.upload_files.empty();
        },
        render: function () {
            var me = this;
            me.$dom = $(tmpl.body()).appendTo($body);//上传主面板
            me.min_box = me.$dom.find('.box-head');// mini对象
            me.switch_upbox_btn = me.$dom.find('.upbox-btn-min');//折叠按钮
            me.upload_files = me.$dom.find('ul[data-content]');//上传文件的容器

            me.upload_box = me.upload_files.parent();

            me.upload_process = me.$dom.find('[data-upload="up_process"]');//上传进度
            me.dw_process = me.$dom.find('[data-upload="dw_process"]');//上传进度
            me.$all_time = me.$dom.find('[data-upload="all_time"]');
            me.$form_bar = me.$dom.find('div.form-mini-progress').hide();//form上传的进度条
            (bar_info = require('./tool.bar_info')).init(
                {//上传信息条构造参数
                    '$process': me.upload_process,
                    '$process_wrap': me.upload_process.parent()
                },
                {//总时间，总速度
                    '$left_time': me.$dom.find('[data-upload="left_time"]'),//剩余时间
                    '$all_time': me.$all_time,//耗时
                    '$speed': me.$dom.find('[data-upload="speed"]'),//速度
                    '$form_bar': me.$form_bar
                }
            );
            me.clear_all_btn = me.$dom.find('.g-btn');//全部清除按钮
            me.upbox_tips = me.$dom.find('.upbox-tips');//错误提示信息条

            event.init.call(me);
            me.$dom.css('position', position);
            me.min();//初始化为最小状态
            if (constants.IS_APPBOX) {
                me.clear_all_btn.attr('href', 'javascript:void(0)');
            }
            // 计算
            measurer = text.create_measurer(me.upbox_tips);
            separator_width = measurer.measure('\\').width;
            ellipsis_width = measurer.measure('...').width;
        }

    });

    view.render();

    /**
     * 静态方法
     */
    $.extend(view, {
        /**
         * 上传管理器，当前列表的长度   called by public_tip
         */
        length: function () {
            return upload_cache.get_up_main_cache().get_all_length() + upload_cache.get_dw_main_cache().get_all_length();
        },
        /**
         * @param time  0: 上传时间归零； 存在的时间：上传时间设置为这个时间； 不存在的数据，并且不为0：返回上传时间
         */
        upload_start_time: function (time) {
            if (time === 0) {
                this._upload_start_time = 0; //归零
            } else if (time) {
                this._upload_start_time = time;//设置上传开始时间
            } else {
                return this._upload_start_time;//返回上传开始时间
            }
        },
        /**
         * @param clear
         */
        upload_end_time: function (clear) {
            if (clear) {
                this._upload_end_time = 0; //归零
            } else {
                return this._upload_end_time || (this._upload_end_time = +new Date());//返回结束开始时间
            }
        },
        /**
         * 显示上传列表
         */
        show: function () {   //强制显示
            var me = this;
            if (me._is_show)
                return;

            me.upload_start_time(+new Date());//设置上传开始时间
            me._is_show = true;

            me.on_window_resize();//重置上传管理器位置
            me.listenTo(global_event, 'window_resize', me.on_window_resize)//窗口resize时，设置上传管理器的定位位置
                .listenTo(global_event, 'window_scroll', me.on_window_scroll);//滚动时，设置上传管理器的定位位置

            if (upload_route.type === 'upload_form') {//form上传，UI不同
                me.$dom.addClass("upbox-form");
            }

            //code by bondli IE9以下的为收拢展开地方的A标签增加href属性
            if (constants.IS_APPBOX) {
                me.switch_upbox_btn.attr('href', 'javascript:void(0)');
            } else if (lt_ie9) {
                me.switch_upbox_btn.attr('href', '#');
            }

            me.$dom.show();
        },
        /**
         * 上传管理器完全关闭，包括mini窗口，主窗口
         */
        hide: function () {
            var me = this;
            me._is_show = false;
            dom_cache = {length: 0};//删除视图中对dom的引用
            me.upload_files.empty();//清空dom
            me.upload_start_time(0);//上传开始时间置为0；
            me.off(global_event, 'window_resize').off(global_event, 'window_scroll');
            me.refresh_space_info();//刷新网盘空间大小
            me.min();//关闭上传管理器之前，将其最小化
            me.$dom.hide();
        },
        /**
         * 设置 完成按钮 样式
         * @param is_done
         * @param text
         */
        set_end_btn_style: function (is_done, text) {
            if (!is_done) {
                view.$all_time.hide();
            }

            view.clear_all_btn.html(text).removeClass('upbox-btn-footer-h32-blue').removeClass('upbox-btn-footer-h32-gray').addClass(text === '<span class="btn-inner">完成</span>' ? 'upbox-btn-footer-h32-blue' :
                'upbox-btn-footer-h32-gray');
        },
        /**
         * 获取上传对象
         * @param v_id
         * @returns {*}
         */
        get_upload_obj: function (v_id) {
            return dom_cache[ v_id ] && dom_cache[ v_id ].upload_obj;
        },
        /**
         * 获取上传对象
         * @param v_id
         * @returns {*}
         */
        get_task: function (v_id) {
            return dom_cache[ v_id ] && dom_cache[ v_id ].task;
        },
        /**
         * 截取文件名显示
         * @param file_name
         * @returns {*}
         */
        //全中文16 英文36 - 218px
        revise_file_name: function (file_name) {//todo
            // file_name
            return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
        },
        // 精确版的文本裁剪，但不适用于数据量过大的情况，因为用到Dom来计算大小。
//        compact_file_name : function(file_name){
//            var tail_length = 13, pixel_width = 260;
//            var tail = file_name.slice(-tail_length),
//                file = file_name.slice(0, -tail_length);
//            return measurer.ellipsis(file, (pixel_width - measurer.measure(tail).width)) + tail;
//        },
        // 
        compact_file_path: function (path) {
            // 示例路径： F:\tmp\测试一个名字很长很长的目录\看看它在地址栏如何处理的，特别是当完全无法显示全的时候\testwwwwwwwwwwwwwwwwwwwww.txt
            // 保留盘符，保留后缀（最后7字符？）
            var separator = '\\';
            var paths = path.split(separator);
            var disk = paths[0], file = paths[paths.length - 1];
            var tail = file.slice(-8);
            file = file.slice(0, -8);
            return disk + separator +
                text.compact_paths(paths.slice(1, paths.length - 1).concat(file), {
                    totalWidth: 270 - measurer.measure(disk + separator + separator + tail).width,
                    keepFirstDirectoryNum: 1,
                    keepLastDirectoryNum: 2,
                    ellipsisPathWidth: 70,
                    separatorWidth: separator_width,
                    hidePathWidth: ellipsis_width
                }, measurer).join(separator) +
                tail;
        },
        cur_start_vid: 1,//当前正在执行的任务vid
        /**
         * 上传完一个文件后，重置滚动条位置
         * @param {int} [v_id]
         * @param {boolean} [force] 强制定位
         */
        on_done_reset_scroll: function (v_id,force) {
            var me = this,
                v_id = v_id || me.cur_start_vid;
            if(bar_info.is_done()){
                return;
            }
            if ( force || ( !event.is_on_the_panel() && this._is_max && v_id ) ) {//有滚动条
                var row_$dom = $('#'+row_id_prefix+v_id);
                if(!row_$dom[0]){
                    return;
                }
                var t_top = row_$dom.position().top;
                if (upload_cache.length() > 100) {//任务管理器中的总长度超过100时，位置滚动，去掉动画效果
                    me.upload_box.scrollTop(t_top);
                } else {
                    var s_top = me.upload_box.scrollTop(),//获取当前view在列表中所出的位置
                        distance = ( Math.abs(s_top - t_top) / 41 ) | 0,
                        time = distance < 20 ? 100 : distance < 100 ? 300 : 100;
                    me.upload_box.animate({'scrollTop': t_top }, time, 'swing');
                }
            }
        },
        /**
         * 滚动时，监视区域显示的逻辑
         * @param {boolean} [force]
         */
        on_box_change_scroll: function (force) {
            var top = view.upload_box.scrollTop(),//得出位置，显示对应的区块
                k = 1,
                c_height = 0;
            while (instance_wrap[k]) {
                c_height += instance_wrap[k].height;
                if( c_height > top ){//结束遍历
                    //console.debug(c_height,top,k,force,(k !== instance_wrap.get_visable_index()));
                    if( force || k !== instance_wrap.get_visable_index() ){//这块区域已经不是当前的中心区域时，才处理显示逻辑
                        instance_wrap.set_visable_index( k );
                        var refer1 = k + 1 ,refer2 = k - 1 ,m = 1;
                        while( instance_wrap[m] ){
                            if(m === k || m === refer1 || m === refer2){
                                $('#' + instance_wrap[m].id).css('visibility', 'visible');//将与自己邻居的区域和自己都显示出来
                            } else {
                                $('#' + instance_wrap[m].id).css('visibility', 'hidden');//将自己显示处理
                            }
                            m+=1;
                        }
                    }
                    return;
                }
                k += 1;
            }
        },
        /**
         * 刷新容量信息  全部清空 和 完成的时候，刷新容量
         */
        refresh_space_info: function () {
            setTimeout(function () {
                space_info.refresh();//刷新空间存储信息
            }, 2000);
        },
        before_hander_click: function (action) {
        },
        /**
         * 手动删除上传任务后，更新上传管理器公用信息
         * @param action 动作
         */
        after_hander_click: function (action) {
            switch (action) {
                case('click_cancel'):
                    //上传-下载管理器中没有 元素后，促发全部清理操作
                    if (0 === upload_cache.get_up_main_cache().cache.length + upload_cache.get_dw_main_cache().cache.length) {//上传管理器中没有 元素后，促发全部清理操作
                        upload_static.dom_events.click_clear_all();
                    }
                    break;
            }
        },
        unregister_float_tip: function (hide_handler) {
            var handlers = this._float_tip_handlers || [];
            handlers.splice($.inArray(hide_handler, handlers), 1);
        },
        register_float_tip: function (hide_handler) {
            var me = this;
            (me._float_tip_handlers = me._float_tip_handlers || []).push(hide_handler);
            if (!me._scroll_tip_reset_hook) {
                me._scroll_tip_reset_hook = true;
                me.upload_box.on('scroll', function () {
                    me.hide_float_tips();
                });
            }
        },
        // 隐藏所有浮动的TIP
        hide_float_tips: function () {
            var handlers = this._float_tip_handlers;
            if (handlers && handlers.length) {
                $.each(handlers, function (index, hide_handler) {
                    hide_handler();
                });
                this._float_tip_handlers = [];
            }
        },
        _get_errors_tip: function () {
            var $dom = this.$errors_tip;
            if (!$dom) {
                $dom = this.$errors_tip = $(tmpl.err_pop()).appendTo(this.$dom).hide();
            }
            return $dom;
        },
        show_errors: function ($dom, errors, direction) {
            return this.show_errors_tip($dom, tmpl.folder_errors(errors), direction);
        },
        /**
         * 在何处显示Tip
         * @param {jQuery Element} $dom
         * @param {String} html
         * @param {String} direction (optional) TIP相对于$dom的显示位置，可以为above或under，默认为above。
         */
        show_errors_tip: function ($dom, html, direction) {
            var me = this,
                $pop = me._get_errors_tip(),
                $above_arr = $pop.find('.ui-pop-uarr'),
                $under_arr = $pop.find('.ui-pop-darr'),
                $content = $pop.find('.ui-pop-inner'),
                $arr;
            // 当方向不同时，TIP的坐标也要调整以使得箭头对准$dom
            // 先隐藏，计算好位置后再定位
            $pop.css({
                top: '-9999px',
                left: '-9999px'
            });
            // 先去掉滚动条，以便自适应
            $content.css('height', 'auto');
            $content.html(html);
            $pop.show();
            // 高度自适应
            var content_height = $content.height();
            if (content_height > 352) {
                $content.css('height', '352px');
            } else if (content_height < 158) {
                $content.css('height', '158px');
            }
            // 根据箭头方案不同，TIP与目标对齐位置也不同
            var arr_place, target_place;
            switch (direction) {
                case 'under':
                    // TIP位于下方，显示上箭头，中上位置对准目标中下
                    arr_place = 'cc'; // 目前的css实现中，箭头是处于中心的
                    target_place = 'cb';
                    $arr = $above_arr;
                    break;
                //case 'above':
                default:
                    // TIP位于上方，显示下箭头，中下位置对准目标中上
                    arr_place = 'cc';
                    target_place = 'ct';
                    $arr = $under_arr;
                    break;
            }
            // 显示箭头
            $arr.toggleClass('hide', false);
            $arr.siblings('span').toggleClass('hide', true);
            // --------计算最终TIP的位置[pop offset]------------
            // 对齐等式为：
            // [pop offset] + arr relate position of pop = target offset
            // 计算方式为：
            // [pop offset] = target offset - arr relate offset of pop
            // 目标 [target offset]
            var target_offset = position_util.add(
                $dom.offset(),
                position_util.of($dom, target_place)
            );
            // 箭头点相对TIP的位置
            // arr relate position of pop = arr offset + arr target - pop offset
            var $actual_arr = $arr.find('i:first');
            var arr_relate_offset = position_util.sub(
                $actual_arr.offset(),
                $pop.offset()
            );
            arr_relate_offset = position_util.add(arr_relate_offset, position_util.of($actual_arr, arr_place));
            // 最终计算
            $pop.offset(position_util.sub(target_offset, arr_relate_offset));

            // 绑定事件，使得鼠标移开时隐藏TIP，同时滚动条滚动时也隐藏。
            var hide_handler = $pop.data('hide_handler');
            if (hide_handler) {
                hide_handler(true);
            }
            var cancel_countdown, leave, timer;
            cancel_countdown = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            };
            leave = function () {
                timer = setTimeout(hide_handler, 200);
            };
            var $trigger_doms = $($dom).add($pop);
            hide_handler = function (cancel_only) {
                cancel_countdown();
                $trigger_doms.off('mouseenter', cancel_countdown).off('mouseleave', leave);
                me.unregister_float_tip(hide_handler);
                if (!cancel_only) {
                    $pop.hide();
                }
            };
            $trigger_doms.on('mouseenter', cancel_countdown).on('mouseleave', leave);
            $pop.data('hide_handler', hide_handler);
            me.register_float_tip(hide_handler);
        }
    });

    view.refresh_space_info = functional.throttle(view.refresh_space_info, 1000);

    // 坐标计算相关接口
    var position_util = {
//        fix_margin : function($dom, offset){
//            return this.add(offset, { // 修正jQuery position未计算目标margin的问题
//                left : parseInt($dom.css('margin-left'), 10) || 0,
//                top : parseInt($dom.css('margin-top'), 10) || 0
//            });
//        },
        // 取得目标DOM的某个部位的相对坐标
        // 例如下中心的坐标就是 [width/2, height]
        // 共有9组合： [l,c,r] * [t,c,b]
        of: function ($dom, place) {
            var x_place = place.charAt(0),
                y_place = place.charAt(1),
                width = $dom.outerWidth(),
                height = $dom.outerHeight(),
                x, y;
            switch (x_place) {
                case 'l':
                    x = 0;
                    break;
                case 'c':
                    x = width / 2;
                    break;
                case 'r':
                    x = width;
                    break;
            }
            switch (y_place) {
                case 't':
                    y = 0;
                    break;
                case 'c':
                    y = height / 2;
                    break;
                case 'b':
                    y = height;
                    break;
            }
            return {
                left: x,
                top: y
            };
        },
        add: function (offset1, offset2) {
            return {
                left: offset1.left + offset2.left,
                top: offset1.top + offset2.top
            };
        },
        sub: function (offset1, offset2) {
            return {
                left: offset1.left - offset2.left,
                top: offset1.top - offset2.top
            };
        }
    };

    var View_instance = function () {
        this.state = null;
        this.file_sign_update_process = functional.throttle(this.file_sign_update_process, 500);//文件扫描
        this.upload_file_update_process = functional.throttle(this.upload_file_update_process, 1000);//上传进度更新
        this.processing && (this.processing = functional.throttle(this.processing, 1000));//下载进度更新
    };

    /**
     * 原型方法： view对象与$dom对象的桥梁
     */
    $.extend(View_instance.prototype, {
        clear_soft_link: function(){
            this._$dom = null;
            this._msg = null;
            this._file_size = null;
            this._delete = null;
            this._click = null;
            this._percent_face = null;
            this._miaoc = null;
            this._error_msg = null;
            this._up4g = null;
        },
        get_upload_obj: function () {//上传对象
            var cache = dom_cache[ this.v_id ];
            return cache && cache.upload_obj || {};
        },
        get_task: function () {//上传对象
            var cache = dom_cache[ this.v_id ];
            return cache && cache.task || {};
        },
        get_dom: function (id) {//jQuery(dom对象)
            return this._$dom || (this._$dom = $('#'+row_id_prefix+(id || this.v_id)));
        },
        get_msg: function () {//上传状态提示消息
            return this._msg || (this._msg = this.get_dom().find('.upbox-state-text'));
        },
        get_file_size: function () {//文件大小
            return this._file_size || (this._file_size = this.get_dom().find('.data-size'));
        },
        get_delete: function () {//删除
            return this._delete || (this._delete = this.get_dom().find('.icon-del'));
        },
        get_click: function () {//暂停/续传对象
            return this._click || (this._click = this.get_dom().find('[icon_oper]'));
        },
        get_percent_face: function () {//样式进度
            return this._percent_face || (this._percent_face = this.get_dom().find('.upbox-mask'));
        },
        get_miaoc: function () {
            return this._miaoc || (this._miaoc = this.get_dom().find('.upbox-success-text'));
        },
        get_error_msg: function () {//单任务的提示信息
            return this._error_msg || (this._error_msg = this.get_dom().find('.filetips'));
        },
        get_up4g: function () {
            return this._up4g || (this._up4g = this.get_dom().find('.up4g'));
        }
    });
    /**
     * 原型方法 ：通用方法
     */
    $.extend(View_instance.prototype, {
        is_exist: function () {
            return this.v_id !== 0 && !!dom_cache[this.v_id] && !!this.get_upload_obj();
        },
        /**
         * 变更对应wrap的高度;
         * @param {String} state
         */
        change_$wrap_height: function(state){
            var wrap_height = instance_wrap[ this._wrap_info.pos ].height;
            if(this.height){
                wrap_height -= this.height;
            }
            if(state !== 'clear'){
                wrap_height += (this.height = (state ==='error' ? error_height : default_height) );//修改总高度,行高
            }
            instance_wrap[ this._wrap_info.pos ].height = wrap_height;
        },
        get_$wrap: function () {
            var collect = instance_wrap[instance_wrap.current];
            if (!collect || collect.is_full) {
                instance_wrap.current += 1;
                collect = instance_wrap[instance_wrap.current] = {
                    index: 0,
                    id: instance_wrap._wrap_id_prefix + instance_wrap.current,
                    height:0
                };
                view.upload_files.append( $( tmpl.instance_wrap({id: collect.id}) ) );
            }

            collect.index += 1;

            collect.is_full = collect.index > instance_wrap.batch;
            this._wrap_info = {
                id : collect.id,//包装元素的ID
                pos: instance_wrap.current//包装元素所在位置
            }
            //visibility hidden
            if (instance_wrap.current > 2) {
                return $('#' + collect.id).css('visibility', 'hidden');
            }
            return $('#' + collect.id);
        },
        init_dom: function (task) {
            this.v_id = (dom_cache.length += 1);
            $( tmpl.instance( this.get_html(task,this.v_id) ) ).appendTo( this.get_$wrap() );
            dom_cache[this.v_id] = {
                'v_id': this.v_id,
                'upload_obj': task,
                'task': task
            };
            this.get_msg().html(_(l_key,'等待上传')).show(),//上传状态提示信息
            this.get_click().hide(),//暂停 or 继续
            upload_tips.public_tip(view.upbox_tips);//公共消息提示
            this.show_up4g_tip();
        },
        set_cur_doing_vid: function () {
            view.cur_start_vid = this.v_id;
        },
        get_html: function (upload_obj,view_id) {
            //var dir_name = ('微云' == upload_obj.pdir_name ? '网盘' : upload_obj.pdir_name),
            var dir_name = upload_obj.pdir_name,
                upload_type = upload_obj.upload_type,
                file_type = upload_obj.get_file_type();
            if(!upload_route.is_ku20()){//todo ku2.0
                dir_name = _(l_key,'微云') == upload_obj.pdir_name ? _(l_key,'网盘') : upload_obj.pdir_name;
            }
            if (!file_type_map.can_identify(file_type)) {
                file_type = 'unknow';
            }
            return {
                "view_id":view_id,
                "mask_width": ( upload_type === 'upload_form' ? '100' : '0'),
                "li_class": "waiting",
                "file_type": file_type,
                'full_name': upload_obj.file_name,
                'file_name': view.revise_file_name(upload_obj.file_name),
                'file_size': File.get_readability_size(upload_obj.file_size),
                'file_dir': dir_name,
                'local_path': (upload_type.indexOf('plugin') ? upload_obj.path : '')
            };
        },
        /**
         * 更新样式外观状态
         * @param cls
         */
        set_upload_face_status: function (cls) {
            this.get_dom().removeClass('completed uploading paused waiting error').addClass(cls);
        },
        /**
         * 重试
         */
        re_start: function () {
            this.hide_error();
            if (this.get_upload_obj().can_pause) {
                this.show_click('icon-pause', _(l_key,'暂停'), 'click_pause');
            } else {
                this.get_click().hide();
            }
            this.start();//修改上传外观
            this.show_up4g_tip();
        },
        /**
         * 显示错误信息
         * @param html 错误码
         */
        show_error: function (html) {
            this.get_error_msg().html(html).css('display', 'inline');
        },
        /**
         * 隐藏错误信息
         */
        hide_error: function () {
            this.get_error_msg().hide();
        },
        /**
         * 显示暂停/开始按钮 ，支持显示不同属性
         * @param cls    样式className
         * @param title  属性title
         * @param action 点击执行的动作key值
         * @private
         */
        show_click: function (cls, title, action) {
            this.get_click()
                .attr({'data-action': action, 'title': title})
                .css('display', 'inline-block')
                [0].className = cls;
        },
        /**
         * 状态：删除
         */
        clear: function () {
            if (this.v_id === 0)
                return;
            this.get_dom().remove();//dom删除
            delete dom_cache[this.v_id];//删除关联引用
            this.v_id = 0;
            upload_tips.public_tip(view.upbox_tips);//公共消息提示
        },
        /**
         * 超过4G文件时，显示“超大文件”tip
         */
        show_up4g_tip: function () {
            var upload_obj = this.get_upload_obj();
            //重试时，如果是超大文件，还是在显示出“超大文件”tip的，文件上传才显示 
            if (upload_obj.file_type === upload_static.FILE_TYPE && upload_obj.file_size >= G4) {//如果是超大文件，则显示“超大文件”tip
                this.get_dom().addClass('upbig');
                this.get_up4g().show();
            }
        }
    });

    /**
     * 原型方法 : 状态
     */
    $.extend(View_instance.prototype, {
        /**
         * 直接切换到某种状态 (临时方法，稍后的重构将这些特殊调用地方统一到change_state方法中 todo )
         * @param {String} [state] 目标状态
         */
        invoke_state: function(state){
            if ( !this.is_exist() || !this[ state ] ) {
                return;
            }
            if(this.old_state !== state){
                this.change_$wrap_height(state);
            }
            this.old_state = this.state;
            this.state = state;
            this[ state ].call(this,state);
        },
        /**
         * 状态控制点
         */
        change_state: function () {
            if (!this.is_exist()) {//取消上传的文件，没成功；手工返回
                return;
            }
            var __state = this.get_upload_obj().state,
                state = this[ __state ];
            if (!state) {
                return;
            }
            if(this.old_state !== __state){
                this.change_$wrap_height(__state);
            }
            this.state = __state;

            state.call(this, __state);
            this.old_state = this.state;
        },

        /**
         * 转换的一瞬间
         */
        transform_state: (function () {

            var g = {};
            g.file_sign_update_process = function () {
                this.get_click().hide();  //停止扫描的接口暂时未提供. 所以扫描的时候先影藏删除按钮.
            };
            g.upload_file_update_process = function () {
                var me = this;
                me.set_upload_face_status('uploading');
                me.get_msg().html(_(l_key,'正在上传')).show();
                //修复bug： 出错后，停止上传失效，控件继续回调
                if ('error' === this.last_trans_state) {
                    me.hide_error();
                    me.last_trans_state = 'upload_file_update_process';
                }
                if (me.get_task().can_pause) {    //如果能暂停的情况， 更新进度的时候影藏删除按钮
                    me.get_click()
                        .attr({'data-action': 'click_pause', 'title': _(l_key,'暂停')})
                        .css('display', 'inline-block')
                        [0].className = 'icon-pause';
                }
            };

            return function (state) {
                if (this.v_id === 0) {//取消上传的文件，没成功；手工返回
                    return;
                }
                if (!g[ state ]) {
                    this.last_trans_state = state;
                    return;
                }
                g[ state ].call(this, state);
            };

        })(),
        /**
         * 状态：初始化
         */
        init: function () {
            view.upload_end_time(true);
        },
        /**
         * 状态：等待
         */
        wait: function () {
            this.set_upload_face_status('waiting');//设置外观样式为 等待上传中 状态
            this.get_file_size().html(File.get_readability_size(this.get_upload_obj().file_size));
            this.get_msg().html(_(l_key,'等待上传')).show();
            this.get_click().hide();
            this.get_delete().css('display', 'inline-block');
            //code by bondli 表单上传时因为mask宽度是100%了，有了默认背景，需要清理
            if (this.get_upload_obj().upload_type === 'upload_form') {
                this.get_percent_face().css({ "backgroundColor": "#fff" });
            }
            this.hide_error();
            this.clear_soft_link();
        },
        /**
         * 状态：开始
         */
        start: function () {
            var w = ( this.get_upload_obj().upload_type === 'upload_form' ? '100%' : '1%');
            this.set_upload_face_status('uploading');//设置外观样式为 上传中 状态
            this.get_delete().css('display', 'inline-block');
            this.get_msg().html(_(l_key,'正在上传')).show();
            this.get_percent_face().width(w); //显示进度百分比-样式
            this.set_cur_doing_vid();
        },
        /**
         * 状态：扫描状态
         */
        file_sign_update_process: function () {
            var upload_obj = this.get_upload_obj();
            //can_show_sign_state: 解决出错了还会进来扫描
            var can_show_sign_state = this.old_state === 'start' || this.old_state === 'file_sign_update_process';
            if (this.state !== 'file_sign_update_process' || upload_obj.no_show_sign || can_show_sign_state === false) {
                return;
            }
            if (!this.has_sign_once) {
                this.has_sign_once = true;
            }
            var percent = upload_obj.file_sign_update_process / upload_obj.file_size * 100;

            //点击了取消，怎么都还会进来一次，导致get_msg为null的js错误
            if(upload_obj.file_sign_update_process === undefined){
                return;
            }
            this.get_msg().html(_(l_key,'正在扫描:') + upload_obj.fix_percent(percent) + '%').show();
        },
        /**
         * 状态：扫描完成
         */
        file_sign_done: function () {
            this.get_msg().html(_(l_key,'正在上传')).show();
            this.has_sign_once = false;
        },
        /**
         * 状态：更新进度
         * @param hide_process_size
         */
        upload_file_update_process: function (hide_process_size) {
            var upload_obj = this.get_upload_obj();
            if (this.v_id === 0 || !upload_obj.processed || this.state !== 'upload_file_update_process') {
                return;
            }

            var width = upload_obj.processed / upload_obj.file_size * 100;
            width = upload_obj.fix_percent(width);

            this.get_percent_face().width( (width<1?1:width) + '%' );//显示进度百分比-样式
            this.get_msg().html(width + '%').show();//显示进度百分比-文本

            if (!hide_process_size) {
                var curr_file_size;
                curr_file_size = upload_obj.file_size * width / 100;
                curr_file_size = Math.min(curr_file_size, upload_obj.file_size);
                this.get_file_size().html(File.get_readability_size(curr_file_size) + '/' + File.get_readability_size(upload_obj.file_size));
            }

        },
        /**
         * 状态：错误
         * */
        error: function () {
            var me = this,
                task = me.get_upload_obj();
            me.set_upload_face_status('error');//设置外观样式为 上传失败 状态
            me.get_delete().css('display', 'inline-block');//可以删除
            me.get_click().hide();//默认不能再上传、暂停
            me.show_error(task.get_translated_error());//显示错误信息
            me.get_msg().html('').show();//隐藏进度信息
            if (task.can_re_start()) {     //非本地校验出错 可以重试
                me.show_click('icon-continue', _(l_key,'重试'), 'click_re_try');
            }
            this.get_up4g().hide();//有错误就不显示“超大文件”提示了，不够位置
            this.get_dom().removeClass('upbig');
            me.get_percent_face().width('100%'); //显示进度百分比-样式
            view.on_done_reset_scroll(me.v_id);
            this.clear_soft_link();
        },
        /**
         * 状态：完成
         */
        done: function () {
            var new_name = file_type_map.revise_file_name(this.get_upload_obj().new_name || '', 1),//换新名字
                upload_obj = this.get_upload_obj(),
                real_size = upload_obj.file_size,
                file_size = File.get_readability_size(real_size);

            this.set_upload_face_status('completed');//设置外观样式为 完成 状态
            if (new_name) {
                this.get_dom().find('.filename').html(new_name);
            }
            this.get_file_size().html(file_size);//显示 实际尺寸
            //this.get_percent_face().width('100%'); //显示进度百分比-样式
            //this.get_msg().hide();//隐藏 上传信息提示
            this.get_msg().remove();//隐藏 上传信息提示
            this.get_delete().remove();//隐藏 删除
            this.get_click().remove();//隐藏
            if (upload_obj.is_miaoc()) {
                this.get_miaoc().show();
            }
            this.hide_error();
            view.on_done_reset_scroll(this.v_id);
            this.clear_soft_link();
        },
        /**
         * 状态：暂停
         */
        pause: function () {
            this.set_upload_face_status('paused');//设置外观样式为 暂停 状态
            this.show_click('icon-continue', _(l_key,'续传'), 'click_continuee');
            this.get_delete().css('display', 'inline-block');
            this.get_msg().html(_(l_key,'暂停')).show();//显示上传
            this.clear_soft_link();
        },
        /**
         * 状态：继续
         */
        continuee: function () {
            this.set_upload_face_status('uploading');//设置外观样式为 正在上传 状态
            this.show_click('icon-pause', _(l_key,'暂停'), 'click_pause');
            this.get_msg().html('正在上传').show();//显示上传
            this.hide_error();
            this.show_up4g_tip();
        },
        /**
         * 状态：续传暂停
         */
        resume_pause: function () {
            this.upload_file_update_process('resume_pause');
            this.show_click('icon-continue', _(l_key,'续传'), 'click_resume_continuee');
            this.get_delete().css('display', 'inline-block');
            this.clear_soft_link();
        },
        /**
         * 状态：续传继续
         */
        resume_continuee: function () {
            this.set_upload_face_status('uploading');//设置外观样式为 正在上传 状态
            this.show_click('icon-continue', _(l_key,'暂停'), 'click_pause');
            this.show_up4g_tip();
        }
    });


    view.add = function (upload_obj, view_key) {
        view.set_end_btn_style(bar_info.is_done(), upload_cache.get_close_btn_text());//设置关闭按钮，样式和text
        var instance = new View_instance();
        if (view_key) {
            var view_type;

            // 这么写是因为 require 必须使用明文字符串常量作为参数 - james
            switch (view_key) {
                case 'empty':
                    view_type = require('./view_type.empty');
                    break;
                case 'folder':
                    view_type = require('./view_type.folder');
                    break;
                case 'webkit_down':
                    view_type = require('./view_type.webkit_down');
                    break;
            }
            $.extend(instance, view_type);
        }
        instance.init_dom(upload_obj);
        return instance;
    };

    module.exports = view;

});


//优化点, 状态过度的时候开关.
//优化点, cache放到一个更小的集合中.
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.empty",["$"],function (require, exports, module) {
    var $ = require('$'),
        methods = {};
    $.each('init_dom invoke_state change_state transform_state init wait start re_start file_sign_update_process file_sign_done upload_file_update_process error done pause continuee resume_pause resume_continuee clear'.split(' '),function(i,n){
        methods[n] = $.noop;
    });
    return methods;
});


/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.folder",["common","./tool.upload_cache","./view","i18n","./upload_route"],function (require, exports, module) {
    var functional = require('common').get('./util.functional'),
        Cache = require('./tool.upload_cache'),
        view = require('./view'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        lang_server_file = _(l_key,'{n}个文件'),
        upload_route = require('./upload_route'),
        get_info = function( cache_key ){
            return Cache.get(cache_key).get_count_nums();
        };
    var folder_view={
        get_html: function (upload_obj,view_id) {
            var dir_name = upload_obj.pdir_name;//目录名称
            if(!upload_route.is_ku20()){//todo ku2.0
                dir_name = _(l_key,'微云') == upload_obj.pdir_name ? _(l_key,'网盘') : upload_obj.pdir_name;
            }
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "file_type": 'folder',
                'full_name': upload_obj.file_name,
                'file_name': view.revise_file_name(upload_obj.file_name),
                'file_size': _(l_key,'{n}个文件').replace('{n}',upload_obj.file_count),
                //'file_size': upload_obj.file_count+'个文件',
                'file_dir': dir_name,
                'local_path': upload_obj.path
            };
        },
        after_done: function(){
            this.set_folder_size('done');
        },
        after_error: function () {
            this.set_folder_size('done');
        },
        set_folder_size: function(state){
            var task = this.get_upload_obj(),
                info = get_info(task.sub_cache_key),
                html = _(l_key,'空文件夹');
            if(task.file_count !== 0){
                if(state === 'update'){
                    html = lang_server_file.replace('{n}',(info.done + 1 + '/' + ( info.length - info.pause )));
                    //html = info.error  + info.done + 1 + '/' + ( info.length - info.pause )+'个文件';
                } else if(state ==='wait'){
                    //防止点击了暂停后再次进入等待状态，仍然显示正在计算
                    if(this.folder_has_ready){
                        //html = info.length + '个文件';
                        html = lang_server_file.replace('{n}',info.length);
                    }else{
                        html = _(l_key,'正在计算...');
                    }
                } else if(state ==='done'){
                    html = lang_server_file.replace('{n}',info.length);
                    //html = info.length + '个文件';
                } else if(state === 'start'){
                    html = '1/'+(info.length - info.pause);
                } else if(state === 'resume_pause'){
                    //html = info.length + '个文件';
                    html = lang_server_file.replace('{n}',info.length);
                }
            }
            this.get_file_size().html(html);
        },
        set_folder_size_ready: function(){
            var info = get_info(this.get_upload_obj().sub_cache_key);
            //this.get_file_size().html(info.length + '个文件');
            this.get_file_size().html(lang_server_file.replace('{n}',info.length));
            //文件计算是否完毕
            this.folder_has_ready = true;
        },
        start: function(){
            var me = this;
            me.set_folder_size('start');
            me.set_upload_face_status('uploading');//设置外观样式为 上传中 状态
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html(_(l_key,'正在上传')).show();
            me.get_percent_face().width('1%'); //显示进度百分比-样式
            me.set_cur_doing_vid();
        },
        wait: function () {
            var me = this ;
            me.set_upload_face_status('waiting');//设置外观样式为 等待上传中 状态
            me.set_folder_size('wait');
            me.get_msg().html(_(l_key,'等待上传')).show();
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.hide_error();
        },
        upload_file_update_process: function () {
            var me = this,
                upload_obj = me.get_upload_obj();
            if (!upload_obj) {
                return;
            }
            upload_obj.state = 'upload_file_update_process';
            me.set_upload_face_status('uploading');//设置外观样式为 上传中 状态
            me.show_click('icon-pause', _(l_key,'暂停'), 'click_pause');
            var width = upload_obj.processed / upload_obj.file_size * 100;
            width = upload_obj.fix_percent(width);
            me.get_percent_face().width((width<1?1:width)+'%');//显示进度百分比-样式
            me.get_msg().html(width+'%').show();//显示进度百分比-文本

            me.set_folder_size('update');
        },
        /**
         * 状态：续传暂停
         */
        resume_pause: function () {
            var me = this;
            me.set_upload_face_status('waiting');//设置外观样式为 等待上传中 状态
            me.show_click('icon-continue', _(l_key,'续传'), 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.set_folder_size('resume_pause');
            //view.check_all_done('resume_pause');
        },
        /**
         * 状态：扫描状态
         */
        file_sign_update_process: function () {
            var upload_obj = this.get_upload_obj();
            var percent = upload_obj.folder_scan_percent;
            percent = upload_obj.fix_percent(percent);
            this.get_msg().html( _(l_key,'正在扫描:') + percent + '%' ).show();
            this.get_click().hide();
            this.get_percent_face().width('0%');
        },
        /**
         * 状态：扫描完成
         */
        file_sign_done: function () {
            this.get_msg().html(_(l_key,'正在上传')).show();
        }
    };
    folder_view.file_sign_update_process = functional.throttle(folder_view.file_sign_update_process, 500);//文件扫描
    //folder_view.upload_file_update_process = functional.throttle(folder_view.upload_file_update_process, 500);//上传进度更新
    return folder_view;
});/**
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define.pack("./view_type.webkit_down",["common","lib","i18n","./view"],function (require, exports, module) {
    var common = require('common'),
        lib = require('lib'),
        console = lib.get('./console'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),

        is_newest_version = function () {//频繁验证，有性能有问题；这里用一个缓存读取
            return common.get('./util.plugin_detect').is_newest_version();
        }(),

        view = require('./view');
    return {
        get_html: function (task,view_id) {
            var file_type = task.get_file_type(),
                file_size = File.get_readability_size(task.file_size);
            if (!file_type_map.can_identify(file_type)) {
                file_type = 'unknow';
            }
            if(task.is_package()){//打包下载  使用下面的提示
                file_size = '-';
            }
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "icon": "icon-down",
                "icon_err": _(l_key,"下载失败"),
                "file_type": file_type,
                'full_name': task.file_name,
                'file_name': view.revise_file_name(task.file_name),
                'file_size': file_size,
                'file_dir': task.dir_name,
                'target_path': (task.target_path + task.file_name)
            };
        },
        start: function () {
            var me = this;
            me.set_upload_face_status('uploading');//设置外观样式为 等待 状态
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html(_(l_key,'正在下载')).css('display','inline');
            if(me.get_task().is_package()){
                me.get_percent_face().addClass('package-download').width('100%');
            }else{
                me.get_percent_face().width('0%');
            }
            me.set_cur_doing_vid();
            me.old_state = me.state;
        },
        /**
         * 状态：暂停
         */
        pause: function () {
            var me = this;
            this.set_upload_face_status('paused');//设置外观样式为 暂停 状态
            this.show_click('icon-continue', _(l_key,'续传'), 'click_continuee');
            this.get_delete().css('display', 'inline-block');
            //修改成暂停前保存上次的文本
            me.old_text = this.get_msg().html();
            this.get_msg().html(_(l_key,'暂停')).show();

            //解决点击了暂停，还是被进入了processing，导致按钮样式不对
            me.old_state = me.state;

            //解决点击了暂停，还是被进入了processing，导致状态文字不对
            //setTimeout(function(){
            //    me.get_msg().html('暂停');
            //},300);
            
        },
        /**
         * 状态：继续
         */
        continuee: function () {
            var me = this;
            this.set_upload_face_status('uploading');//设置外观样式为 正在下载 状态
            this.show_click('icon-pause', _(l_key,'暂停'), 'click_pause');
            //this.get_msg().html('正在下载').show();
            this.get_msg().html(me.old_text===_(l_key,'暂停') ? _(l_key,'正在下载') : me.old_text).show();
            this.hide_error();
        },
        /**
         * 状态：续传暂停
         *
        resume_pause: function () {
            var me = this;
            me.set_upload_face_status('paused');//设置外观样式为 等待下载中 状态
            me.show_click('icon-continue', '续传', 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('等待下载').css('display','inline');
        },*/
        processing: function () {
            var me = this,
                task = me.get_task(),
                percent = task.fix_percent(Math.max(task.percent, 1), 0) + '%';

            //添加暂停功能 最新版QQ才出现暂停功能，打包下载不提供暂停功能
            if( !me.get_task().is_package() && me.old_state==='start' && is_newest_version ){
                me.show_click('icon-pause', _(l_key,'暂停'), 'click_pause');
            }
            //打包下载不显示进度
            if(!task.is_package()){
                me.get_msg().html(percent).show();//显示进度百分比-文本
                me.get_percent_face().width(percent);//显示样式进度
            }
            
        },
        done: function () {
            var me = this;
            me.set_upload_face_status('completed');//设置外观样式为 完成 状态
            me.get_click().remove();
            me.get_msg().remove();
            view.on_done_reset_scroll(me.v_id);
        }
    };
});
//tmpl file list:
//upload/src/select_folder/loading.tmpl.html
//upload/src/select_folder/photo_group.tmpl.html
//upload/src/select_folder/select_folder.tmpl.html
//upload/src/upload.tmpl.html
//upload/src/upload_button.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'loading_mark': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'upload';
    __p.push('    <div data-no-selection class="ui-waiting">\r\n\
        <i class="icon-loading"></i>\r\n\
        <span class="_n ui-text"></span>\r\n\
        <a class="_cancel ui-text" href="javascript:;">');
_p(_(l_key,'取消'));
__p.push('</a>\r\n\
    </div>');

return __p.join("");
},

'photo_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'upload',
            default_text = _(l_key,'新建分组');
    __p.push('    <div class="check-group" style="display:none;cursor: pointer;"><i data-id="upload_group_check" class="checkbox"></i>');
_p(_(l_key,'指定分组'));
__p.push('</div>\r\n\
\r\n\
    <div id="upload_dropdown_group" class="dropdown-group" style="display:none;width:220px;">\r\n\
        <a class="g-btn g-btn-gray" href="javascript:void(0);" id="upload_select_group"><span class="btn-inner">');
_p(_(l_key,'未分组'));
__p.push('<i></i></span></a>\r\n\
        <a id="upload_new_group_btn" href="javascript:void(0);" style="display:none;" class="create-group">+ ');
_p(_(l_key,'创建新分组'));
__p.push('</a>\r\n\
        <div id="upload_new_group_wrap" class="input-new-group" style="display:none;">\r\n\
            <input id="upload_new_group_input" type="text" value="');
_p(default_text);
__p.push('">\r\n\
            <a class="g-btn g-btn-blue-h30 g-btn-blue-h30-disabled" href="javascript:void(0)">\r\n\
                <span class="btn-inner" id="upload_new_btn">');
_p(_(l_key,'创建'));
__p.push('</span>\r\n\
            </a>\r\n\
        </div>\r\n\
        <div class="dropdown-box" id="upload_group_panel" style="display:none;"></div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'photo_group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var array = data.array,
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        ret = ['<ul>'];
    if(array && array.length){
        for(var i = 0,j = array.length; i< j ;i++){
            ret.push('<li><a href="javascript:;" data-group-id="'+array[i].id+'">'+_(l_key,array[i].name)+'</a></li>');
        }
    } else {
        ret.push('<li><a href="javascript:;" data-group-id="1">'+_(l_key,'没有分组数据')+'</a></li>');
    }
    ret.push('</ul>');
    __p.push('    ');
_p(ret.join(''));
__p.push('');

return __p.join("");
},

'select_folder': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('\r\n\
    <div class="dirbox-file">\r\n\
        <span class="fileimg">\r\n\
            <i data-id="icon" class="filetype"></i>\r\n\
        </span>\r\n\
        <span data-id="name" class="filename"></span>\r\n\
    </div>\r\n\
\r\n\
    <div class="dirbox-dirs">\r\n\
                \r\n\
        <div class="dirbox-dir dirbox-curdir">\r\n\
            <label>');
_p(_(l_key,'上传到：'));
__p.push('</label>\r\n\
            <span id="disk_upload_upload_to"></span>\r\n\
            <a data-btn-id="CHDIR" href="javascript:;" class="dirbox-chdir" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_PATH_MODIFY'));
__p.push('>');
_p(_(l_key,'修改'));
__p.push('</a>\r\n\
        </div>\r\n\
\r\n\
        <div data-id="tree-container" class="dirbox-tree" style="display:none"></div>\r\n\
\r\n\
    </div>');
_p(require('./tmpl').photo_group());
__p.push('');

return __p.join("");
},

'file_box_node_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        files = data.files,
        par_id = data.par_id,
        level = data.level;
    __p.push('    <ul class="dirbox-sub-tree">');
 $.each(files, function (i, file) {
            _p( tmpl.file_box_node({
                file: file,
                par_id: par_id,
                level: level + 1
            }) );

        }); __p.push('    </ul>');

return __p.join("");
},

'file_box_node': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),
        upload_route = require('./upload_route'),
        _ = require('i18n').get('./pack'),
        l_key = 'upload',
        common = require('common'),

        file = data.file,
        par_id = data.par_id,
        level = data.level;
    var dir_name = text.text(file.get_name()),
        no_cursor = data.is_root ? 'cursor:default;' : '';
    if(!upload_route.is_ku20()){//todo ku20
        dir_name = dir_name == _(l_key,'微云') ? _(l_key,'网盘') : dir_name;
        no_cursor = '';
    }
    __p.push('    <li id="_file_box_node_');
_p( file.get_id() );
__p.push('" data-file-id="');
_p( file.get_id() );
__p.push('" data-file-pid="');
_p( par_id || '' );
__p.push('" data-level="');
_p( level );
__p.push('" data-dir-name="');
_p( dir_name );
__p.push('">\r\n\
        <a href="#" hidefocus="on" style="');
_p(no_cursor);
__p.push('padding-left:');
_p( level * 20 );
__p.push('px;">\r\n\
            <span class="ui-text"><i class="_expander"></i>');
_p( dir_name );
__p.push('</span>\r\n\
        </a>\r\n\
    </li>');

    if(level == 0 && !upload_route.is_ku20()){//todo ku2.0
    __p.push('    <li id="_file_box_node_-1" data-file-id="-1" data-file-pid="-1" data-level="0" data-dir-name="');
_p(_(l_key,'相册'));
__p.push('">\r\n\
        <a href="#" hidefocus="on" style="padding-left:0px;">\r\n\
            <span class="ui-text" id="album"><i></i>');
_p(_(l_key,'相册'));
__p.push('</span>\r\n\
        </a>\r\n\
    </li>');

    }
    __p.push('');

return __p.join("");
},

'file_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        root_dir = data.root_dir;
        par_id = data.par_id,
        is_root = data.is_root;//是否是根节点
    __p.push('\r\n\
        <ul class="_tree">');
_p( tmpl.file_box_node({
                file: root_dir,
                par_id: par_id, //root_dir.get_parent().get_id(),
                level: 0,
                is_root: is_root
            }) );
__p.push('        </ul>\r\n\
');

return __p.join("");
},

'dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        show_install_flash = false,
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div data-no-selection class="box dirbox __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <div class="box-inner">\r\n\
    \r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title __title">');
_p( text.text(data.config.title) );
__p.push('</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
        \r\n\
            <div class="__content box-body">\r\n\
            \r\n\
            \r\n\
            </div>\r\n\
        \r\n\
            <div class="box-foot clear">\r\n\
                <p class="__msg box-tips ui-tips-err" style="display:none;"></p>\r\n\
                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                        if(btn.tips == 'jisu' && btn.klass == 'ui-btn-other'){
                            //表单和flash上传特殊处理下
                            var upload_type = require('./upload_route').type;
                            if( upload_type === 'upload_form' && ($.browser.safari || !gbIsWin) ){
                                //显示安装flash的文字
                                show_install_flash = true;
                            }
                            else if( upload_type === 'upload_flash' && ($.browser.safari || !gbIsWin) ){
                                //flash上传下什么都不显示
                            }
                            else{
                                //提示安装控件
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" href="javascript:void(0)" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" ');
_p(click_tj.make_tj_str('UPLOAD_INSTALL_BTN_PLUGIN'));
__p.push('>\r\n\
                             <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');
        
                            }
                        }
                        else if(btn.tips == 'jisu' && btn.klass == 'ui-btn-ok'){
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button" ');
_p(click_tj.make_tj_str('UPLOAD_SUBMIT_BTN_PLUGIN'));
__p.push('>\r\n\
                           <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');

                        }
                        else {
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button" ');
_p(click_tj.make_tj_str('UPLOAD_SUBMIT_BTN_NORMAL'));
__p.push('>\r\n\
                            <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');

                        }
                    });
                    __p.push('                </div>');

                if( show_install_flash ) {
                __p.push('                    <p class="box-tips">\r\n\
                        建议您安装flash以帮助大幅提高上传的成功率。<br/>\r\n\
                        <a href="http://www.adobe.com/go/getflashplayer" target="_blank">安装Flash</a>\r\n\
                    </p>');

                }
                __p.push('                \r\n\
            </div>\r\n\
        \r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" class="ui-xbox-close box-close" href="javascript:void(0)" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_PATH_CLOSE'));
__p.push('><span class="hidden-text">×</span></a>');
_p( tmpl.upload_box_pop({ text: select_folder_msg.get('USE_PLUGIN_UPLOAD') }) );
__p.push('\r\n\
    </div>\r\n\
');

return __p.join("");
},

'upload_box_pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text');
    __p.push('    <div class="ui-pop box-pop upload-box-pop" style="top:225px;right:95px;display:none;">\r\n\
        <p class="ui-pop-text">');
_p( data.text );
__p.push('        </p>\r\n\
        <span class="ui-pop-darr hide">\r\n\
            <i class="ui-darr"></i>\r\n\
            <i class="ui-darr ui-darr-mask"></i>\r\n\
        </span>\r\n\
        <span class="ui-pop-uarr">\r\n\
            <i class="ui-uarr"></i>\r\n\
            <i class="ui-uarr ui-uarr-mask"></i>\r\n\
        </span>\r\n\
    </div>');

return __p.join("");
},

'dialog2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div data-no-selection class="box dirbox __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <div class="box-inner">\r\n\
    \r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">');
_p( text.text(data.config.title) );
__p.push('</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
        \r\n\
            <div class="__content box-body">\r\n\
            \r\n\
            \r\n\
            </div>\r\n\
        \r\n\
            <div class="box-foot clear">\r\n\
                <p class="__msg box-tips ui-tips-err" style="display:none;"></p>\r\n\
                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                        if(btn.tips == 'jisu' && btn.klass == 'ui-btn-other'){
                            if( !$.browser.safari && gbIsWin ){
                        __p.push('\r\n\
                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" href="javascript:void(0)" class="g-btn upbox-btn-speed" ');
_p(click_tj.make_tj_str('UPLOAD_FILE_OVER_LIMIT_INSTALL'));
__p.push('>\r\n\
                          <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');

                            }
                        }
                        else {
                        __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button">\r\n\
                            <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');

                        }
                    });
                    __p.push('                </div>\r\n\
            </div>\r\n\
        \r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" class="ui-xbox-close box-close" href="javascript:void(0)" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_FILE_OVER_LIMIT_CLOSE'));
__p.push('><span class="hidden-text">×</span></a>');
_p( tmpl.upload_box_pop({ text: select_folder_msg.get('USE_PLUGIN_UPLOAD') }) );
__p.push('\r\n\
    </div>\r\n\
');

return __p.join("");
},

'dialog3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common');
    __p.push('    <div data-no-selection class="box dirbox __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <div class="box-inner">\r\n\
    \r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title">');
_p( text.text(data.config.title) );
__p.push('</h3>\r\n\
            </div>\r\n\
            <b class="box-head-shd"></b>\r\n\
        \r\n\
            <div class="__content box-body">\r\n\
            \r\n\
            \r\n\
            </div>\r\n\
        \r\n\
            <div class="box-foot clear">\r\n\
                <p class="__msg box-tips ui-tips-err" style="display:none;"></p>\r\n\
                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                    __p.push('                        <a data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="box-btn ');
_p( text.text(btn.klass) );
__p.push('" type="button">\r\n\
                            <span class="box-btn-text">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                        </a>');

                    });
                    __p.push('                </div>\r\n\
                \r\n\
            </div>\r\n\
        \r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" class="ui-xbox-close box-close" href="javascript:void(0)" hidefocus="on"><span class="hidden-text">×</span></a>\r\n\
\r\n\
    </div>\r\n\
');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var _ = require('i18n').get('./pack'),
        l_key = 'upload';
    __p.push('    <div class="box upbox upbox-speed upbox-mini" data-no-selection style="display:none;">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <i class="icon-state"></i>\r\n\
                <div class="up-state-infor">\r\n\
                    <span data-upload="up_process"> </span>\r\n\
                    <span data-upload="speed"> </span>\r\n\
                    <span data-upload="left_time"> </span>\r\n\
                    <span data-upload="all_time"> </span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="head-title">\r\n\
                <ul>\r\n\
                    <li class="data-info"><span>');
_p(_(l_key,'名称'));
__p.push('</span></li>\r\n\
                    <li class="data-size">');
_p(_(l_key,'大小'));
__p.push('</li>\r\n\
                    <li class="data-dir">');
_p(_(l_key,'目的地'));
__p.push('</li>\r\n\
                    <li class="data-status">');
_p(_(l_key,'状态'));
__p.push('</li>\r\n\
                    <li class="data-action">');
_p(_(l_key,'操作'));
__p.push('</li>\r\n\
                </ul>\r\n\
\r\n\
            </div>\r\n\
            <div class="box-body">\r\n\
                <div class="upbox-view" style="position:relative;">\r\n\
                    <div class="upbox-files file24"><ul data-content style="position:relative;"></ul></div>\r\n\
                    <div class="box-tips upbox-tips" style="display:none;"></div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="box-foot clear">\r\n\
                <div class="box-btns"><a class="g-btn upbox-btn-footer-h32-gray"><span class="btn-inner">');
_p(_(l_key,'全部取消'));
__p.push('</span></a></div>\r\n\
            </div>\r\n\
            <a class="upbox-btn-min" data-action="click_to_max"><s></s><span class="hidden-text">');
_p(_(l_key,'折叠'));
__p.push('</span></a>\r\n\
            <div class="form-mini-progress"></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'instance_wrap': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <div id="');
_p(data.id);
__p.push('"></div>');

return __p.join("");
},

'instance': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var text = require('lib').get('./text'),
            _ = require('i18n').get('./pack'),
            l_key = 'upload';
    __p.push('    <li class="ui-item ');
_p(data.li_class);
__p.push('" id="upload_row_');
_p(data.view_id);
__p.push('" v_id="');
_p(data.view_id);
__p.push('">\r\n\
        <div class="upbox-mask" style="width:');
_p(data.mask_width);
__p.push('%;"></div>\r\n\
        <div class="data-info">\r\n\
            <i class="');
_p((data.icon ? data.icon : 'icon-up'));
__p.push('"></i>\r\n\
            <span class="fileie6" ');
_p((data.local_path ? 'title="'+text.text(data.local_path)+'"' : ''));
__p.push('>\r\n\
                <span class="fileimg"><i class="filetype icon-');
_p(data.file_type);
__p.push('"></i></span>\r\n\
                <span class="fn-inline">\r\n\
                    <span class="filename">');
_p(text.text(data.file_name));
__p.push('</span>\r\n\
                    <span class="filetips" style="display:none;"><!--错误描述--></span>\r\n\
                </span>\r\n\
            </span>\r\n\
            <span class="up4g" style="display:none;">');
_p(_(l_key,'超大文件'));
__p.push('</span>\r\n\
        </div>\r\n\
        <div class="data-size">');
_p(data.file_size);
__p.push('</div>\r\n\
        <div class="data-dir" title="');
_p((data.target_path ? data.target_path : data.file_dir));
__p.push('"><a href="javascript:void(0)">');
_p(data.file_dir);
__p.push('</a></div>\r\n\
        <div class="data-status">\r\n\
            <i class="icon-ok" title="');
_p(_(l_key,'完成'));
__p.push('"></i>\r\n\
            <i class="icon-err" title="');
_p((data.icon_err?data.icon_err:_(l_key,'上传失败')));
__p.push('"></i>\r\n\
            <span class="upbox-success-text" style="display:none;">');
_p(_(l_key,'极速秒传'));
__p.push('</span>\r\n\
            <span class="upbox-state-text"></span>\r\n\
        </div>\r\n\
        <div class="data-action">\r\n\
            <!--暂停图标：icon-pause，上传图标：icon-continue-->\r\n\
            <a icon_oper class="icon-pause" data-upload="click_event" href="javascript:void(0)"><span class="hidden-text">');
_p(_(l_key,'暂停'));
__p.push('</span></a>\r\n\
            <a class="icon-del" data-upload="click_event" href="javascript:void(0)" data-action="click_cancel" title="');
_p(_(l_key,'取消'));
__p.push('"><span class="hidden-text">');
_p(_(l_key,'删除'));
__p.push('</span></a>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-pop box-pop" style="right:auto;">\r\n\
        <p class="ui-pop-text"></p>\r\n\
        <span class="ui-pop-darr hide"> <i class="ui-darr"></i> <i class="ui-darr ui-darr-mask"></i> </span>\r\n\
        <span class="ui-pop-uarr hide"> <i class="ui-uarr"></i> <i class="ui-uarr ui-uarr-mask"></i> </span>\r\n\
    </div>');

return __p.join("");
},

'err_pop': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-pop box-pop upbox-err-pop" style="right:auto;">\r\n\
        <div class="ui-pop-inner"></div>\r\n\
        <span class="ui-pop-darr hide" style="left:30%;"> <i class="ui-darr"></i> <i class="ui-darr ui-darr-mask"></i> </span>\r\n\
        <span class="ui-pop-uarr hide"> <i class="ui-uarr"></i> <i class="ui-uarr ui-uarr-mask"></i> </span>\r\n\
    </div>');

return __p.join("");
},

'folder_errors': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var i, file;
        var common = require('common'),
            File = common.get('./file.file_object'),
            lib = require('lib'),
            text = lib.get('./text'),
            _ = require('i18n').get('./pack'),
            l_key = 'upload',
            title = text.format(_(l_key,'有{0}个文件上传失败'),['<strong>'+data.length+'</strong>']);
    __p.push('    <h3 class="ui-title">');
_p(title);
__p.push('</h3>\r\n\
    <div class="upbox-errs">\r\n\
        <table><tbody>');
 for(i=0; i<data.length; i++){ file = data[i]; error_tip = (file.error_tip|| '').replace(/<\/?[^>]*>/g,'');__p.push('        <tr>\r\n\
            <td><span title="');
_p(text.text(file.fullname));
__p.push('">');
_p(text.text(file.name));
__p.push('</span></td><td>');
_p(File.get_readability_size(file.size));
__p.push('</td><td><span title="');
_p(error_tip);
__p.push('">');
_p(file.error);
__p.push('</span></td>\r\n\
        </tr>');
 } __p.push('        </tbody></table>\r\n\
    </div>');

return __p.join("");
},

'file_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('   <!--\r\n\
    <a href="#" class="nav-uploads-inner" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
		<span class="ui-text">上传文件</span>\r\n\
		<i class="ui-bg nav-upload"></i>\r\n\
	</a>\r\n\
	-->\r\n\
    <a class="btn" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
        <span class="ui-text"></span>\r\n\
    </a>\r\n\
');

return __p.join("");
},

'appbox_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('\r\n\
        <a id="upload_dropdown_inner" class="btn" href="#" hidefocus="on" data-action="upload_files" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
        </a>\r\n\
                \r\n\
        <ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
            <li><a href="#" hidefocus="on" data-action="upload_files" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
            <li><a href="#" hidefocus="on" data-action="upload_folder" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_DIR'));
__p.push('>文件夹</a></li>\r\n\
            <li><a href="#" hidefocus="on" data-action="upload_4g_file" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_4G_FILE'));
__p.push('>超大文件<br/><em>4G以上</em><i></i></a></li>\r\n\
        </ul>\r\n\
');

return __p.join("");
},

'folder_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('        <a href="#" id="upload_dropdown_inner" data-action="upload_files" class="btn" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
            <span class="ui-text"></span>\r\n\
        </a>\r\n\
		<ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
			<li><a href="#" hidefocus="on" data-action="upload_files" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
			<li><a href="#" hidefocus="on" data-action="upload_folder" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_DIR'));
__p.push('>文件夹</a></li>\r\n\
			<li><a href="#" hidefocus="on" data-action="upload_4g_file" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_4G_FILE'));
__p.push('>超大文件<br><em>4G以上</em><i></i></a></li>\r\n\
		</ul>\r\n\
');

return __p.join("");
},

'g4files_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('        <a href="#" id="upload_dropdown_inner" data-action="upload_files" class="btn" hidefocus="on" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
            <span class="ui-text"></span>\r\n\
        </a>\r\n\
				\r\n\
		<ul id="upload_dropdown_menu" class="dropdown-menu" style="display:none;">\r\n\
			<li><a href="#" hidefocus="on" data-action="upload_files" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_FILE'));
__p.push('>文件</a></li>\r\n\
			<li><a href="#" hidefocus="on" data-action="upload_4g_file" ');
_p(click_tj.make_tj_str('UPLOAD_UPLOAD_4G_FILE'));
__p.push('>超大文件<br><em>4G以上</em><i style="top:42px;"></i></a></li>\r\n\
		</ul>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
