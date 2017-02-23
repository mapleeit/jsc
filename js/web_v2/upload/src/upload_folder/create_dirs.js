/**
 * 创建目录
 * 1、创建根目录ok后，添加一个上传任务，开始上传
 * 2、创建一个子目录ok了，就把改目录下的文件添加到上传的任务中
 * 3、创建一个子目录失败，就放弃上传
 *
 * @author bondli
 * @date 13-12-09
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        common = require('common'),

        console = lib.get('./console'),
		security = lib.get('./security'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        logger = common.get('./util.logger'),
        upload_folder_h5 = require('./upload_folder.upload_folder_h5'),

        undefined;

    var create_dirs = {
    	folder_id : '',
    	folder_size : 0,
    	file_length : 0,
    	upload_plugin : '', 
    	chosed_dir_attr : '',
        chosed_dir_name : '',

    	init: function (files, upload_plugin, chosed_dir_attr) {
    		var me = this;
            me.upload_plugin = upload_plugin;
    		me.folder_size = files.file_total_size;
    		me.file_length = files.file_total_num;
    		me.chosed_dir_attr = chosed_dir_attr;
            me.chosed_dir_name = files.dir_name;
            me.is_from_h5 = !!files.is_from_h5;

            var treeNode = files.file_tree_node; //获取目录文件关系数据节点
            //启动循环
            function run(file_node){
                var dir_name = file_node.name,
                    dir_files = file_node.fileNodes;

                if(file_node === treeNode){
                    var ppdir = me.chosed_dir_attr.ppdir,
                        pdir = me.chosed_dir_attr.pdir;
                   // console.debug('root:',ppdir,pdir);
                    me.create_root_dir(dir_name, ppdir, pdir)
                        .done(function (rsp_body) {
                            var main_dir = rsp_body;
                         //   console.debug('create root dir_name:'+main_dir.dir_name);
                            var dir_key = main_dir.dir_key;
                            dir_name = main_dir.dir_name || dir_name;
                            //设置节点的ppdir和pdir和自身的key
                            file_node.set_ppdir(ppdir);
                            file_node.set_pdir(pdir);
                            file_node.set_dir(dir_key);

                            //添加到上传，这里如果本目录下为空也要添加上传
                            me.add_upload(dir_files, pdir, dir_key, dir_name, false);
                            //下一个子节点的继续
                            if(file_node.dirNodes) {
                                create_dir_pool = create_dir_pool.concat(file_node.dirNodes);
                            }
                            run_pool();
                            /*$.each(file_node.dirNodes, function(i, dirNode){
                                run(dirNode);
                            });*/
                        }).fail(function (msg, ret) {
                       //     console.debug('create root ret:'+ret);
                            logger.report('weiyun_create_dir', {
                                msg: msg,
                                ret:ret,
                                is_from_h5:me.is_from_h5
                            });
                            /*if(me.is_from_h5) {
                                //mini_tip.error(msg || '创建目录失败，请重试');
                                me._add_folder_failed(ret, dir_name);
                            } else {
                                me._add_folder_failed(ret, dir_name);
                            }*/
                            var kids = [];

                            get_all_kids(file_node, kids);

                            me.add_upload(kids, pdir, '_', dir_name, false, ret);
                            run_pool();
                        });
                }
                else{
                    var dir_keys = file_node.get_dir_keys(),
                        ppdir = dir_keys.ppdir,
                        pdir = dir_keys.pdir;
                  //  console.debug('sub:',ppdir,pdir);
                    var dir_path_arr = dir_name.split('\\');
                    dir_name = dir_path_arr[dir_path_arr.length-1];
                    me.create_sub_dir(dir_name, ppdir, pdir)
                        .done(function (rsp_body) {
                            var dir_key = rsp_body.dir_key;
                            //console.debug('create sub_dir ret:'+dir_key);
                            //设置节点的ppdir和pdir和自身的key
                            file_node.set_ppdir(ppdir);
                            file_node.set_pdir(pdir);
                            file_node.set_dir(dir_key);
                            //添加到上传
                            if(dir_files.length){
                                me.add_upload(dir_files, pdir, dir_key, dir_name, true);
                            }

                            //下一个子节点的继续
                            if(file_node.dirNodes) {
                                create_dir_pool = create_dir_pool.concat(file_node.dirNodes);
                            }

                            run_pool();
                           /* $.each(file_node.dirNodes, function(i, dirNode){
                                run(dirNode);
                            });*/
                        }).fail(function (msg, ret) {
                           // console.debug('create sub_dir ret:'+ret);
                            logger.report('weiyun_create_dir', {
                                msg: msg,
                                ret:ret,
                                is_from_h5:me.is_from_h5
                            });
                            /*if(me.is_from_h5) {
                                //mini_tip.error(msg || '创建子目录失败，请重试');
                                me._add_sub_folder_failed(ret, dir_path_arr.join('\\'));
                            } else {
                                me._add_sub_folder_failed(ret, dir_path_arr.join('\\'));
                            }*/

                            var kids = [];

                            get_all_kids(file_node, kids);

                            me.add_upload(kids, pdir, '_', dir_name, true, ret);
                            run_pool();
                        });
                }                
            };

            function get_all_kids(parent_node, list) {
                var sub_dirs = parent_node.dirNodes;
                var sub_files = parent_node.fileNodes;
                var fn = arguments.callee;
                if(sub_files) {
                    $.each(sub_files, function(i, file) {
                        list.push(file);
                    });
                }

                if(sub_dirs) {
                    $.each(sub_dirs, function(i, dir) {
                        fn(dir, list);
                    });
                }

            }

            var create_dir_pool = [];
            var has_run_max = false; //是否达到了最大并发请求
            function run_pool() {
                var dirNodes;
                if(!has_run_max) {
                    dirNodes = create_dir_pool.slice(0, 4);
                    create_dir_pool = create_dir_pool.slice(dirNodes.length);
                    if(dirNodes.length === 4) {
                        has_run_max = true;
                    }
                } else {
                    dirNodes = [create_dir_pool.shift()];
                }

                $.each(dirNodes, function(i, dirNode) {
                    dirNode && run(dirNode);
                });

            }

            run(treeNode);

    	},

    	//创建根目录，可能有同名目录，用这个cgi支持重名创建
    	create_root_dir: function (dir_name, ppdir_key, pdir_key) {
    		var me = this,
                def = $.Deferred();
			request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskDirCreate',
                pb_v2 : true,
                re_try: 0,
                body: {
                    ppdir_key: ppdir_key,
                    pdir_key: pdir_key,
                    "dir_name": dir_name,
                    file_exist_option: 1
                }
            })
                .ok(function (rsp_msg, rsp_body) {
                	/*
                    var dir_key = rsp_body.sub_dir[0].dir_key,
                		dir_name = rsp_body.sub_dir[0].new_dir_name || dir_name;
                    */
                    def.resolve(rsp_body);
                })
                .fail(function (msg, ret) {
                    //me.add_folder_failed(ret, dir_name);
                    def.reject(msg, ret);
                });

            return def;
    	},

    	//创建子目录
    	create_sub_dir: function (dir_name, ppdir_key, pdir_key){
			var def = $.Deferred();
			request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskDirCreate',
                pb_v2 : true,
                re_try: 0,
                body: {
                    ppdir_key: ppdir_key,
                    pdir_key: pdir_key,
                    dir_name: dir_name
                }
            })
                .ok(function (rsp_msg, rsp_body) {
                	//var dir_key = rsp_body.dir_key;
                    def.resolve(rsp_body);
                })
                .fail(function (msg, ret) {
                    //me.trigger('create_dir_fail', msg, ret);
                    def.reject(msg, ret);
                });

            return def;
    	},

        add_upload: function (dir_files, pdir_key, dir_key, dir_name, is_sub, pdir_create_ret) {
            var me = this,
                files = [];
                //console.log('up file:',dir_files);
            $.each(dir_files, function(i, file){
                files.push({
                    'file': file.h5file || file, //h5拖动上传的文件句柄采用h5file标识
                    'ppdir': pdir_key,
                    'pdir': dir_key,
                    'ppdir_name': 0,
                    'pdir_name': 0,
                    'dir_paths': 0,
                    'dir_id_paths': 0,
                    'pdir_create_ret': pdir_create_ret
                });
            });

            if(is_sub){
                me._add_sub_upload(files);
            }
            else {
                me.folder_id = me._add_folder_upload(files, dir_key, dir_name);
            }
        },

    	//第一次添加文件上传
    	_add_folder_upload: function (files, dir_key, dir_name) {
    		var me = this,
    			ext_param = me.file_length == 0 ? {"code":2,"text":""} : {"code":1,"text":""},
    			upload_attrs = {
		            'file_id': dir_key,
		            'dir_name': dir_name, 
		            'local_path': me.chosed_dir_attr.dir_path,
		            'ppdir': me.chosed_dir_attr.ppdir,
		            'pdir': me.chosed_dir_attr.pdir,
		            'ppdir_name': me.chosed_dir_attr.ppdir_name,
		            'pdir_name': me.chosed_dir_attr.pdir_name,
		            'dir_paths': me.chosed_dir_attr.dir_paths,
		            'dir_id_paths': me.chosed_dir_attr.dir_id_paths
		        };
            if(me.is_from_h5) {
                return upload_folder_h5.add_upload(me.upload_plugin,
                    files,
                    upload_attrs,
                    ext_param,
                    me.folder_size,
                    me.file_length
                );
            }
            //返回的是folder_id
			return upload_event.trigger('add_folder_upload', 
				me.upload_plugin, 
				files, 
				upload_attrs, 
				ext_param, 
				me.folder_size, 
				me.file_length
			);       
    	},

    	//添加子目录文件上传
    	_add_sub_upload: function (files) {
    		var me = this;

            if(me.folder_id == ''){
                setTimeout(function(){
                    if(me.is_from_h5) {
                        upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id, files);
                    } else {
                        upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, files);
                    }
                },300);
            }
            else{
                if(me.is_from_h5) {
                    upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id, files);
                } else {
                    upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, files);
                }
            }
    	},

        //创建根目录出错了
        _add_folder_failed: function (ret, dir_name) {

            var me = this,
            ext_param = {"code":3,"text":ret},
            upload_attrs = {
                'dir_name':dir_name,
                'local_path':me.chosed_dir_attr.dir_path,
                'ppdir':me.chosed_dir_attr.ppdir,
                'pdir':me.chosed_dir_attr.pdir,
                'ppdir_name':me.chosed_dir_attr.ppdir_name,
                'pdir_name':me.chosed_dir_attr.pdir_name,
                'dir_paths':me.chosed_dir_attr.dir_paths,
                'dir_id_paths':me.chosed_dir_attr.dir_id_paths
            };
            if(me.is_from_h5) {
                upload_folder_h5.add_upload(me.upload_plugin,[],upload_attrs,ext_param,me.folder_size,me.file_length);
            } else {
                //console.log(upload_attrs,ext_param);
                upload_event.trigger('add_folder_upload',
                    me.upload_plugin,
                    [],
                    upload_attrs,
                    ext_param,
                    me.folder_size,
                    me.file_length
                );
            }
        },

        //创建子目录出错了
        _add_sub_folder_failed: function (ret, dir_name) {
            var me = this,
                dir_full_path = me.chosed_dir_attr.dir_path + dir_name;
            if(me.is_from_h5) {
                upload_folder_h5.add_sub_task(me.upload_plugin, me.folder_id,null, 'create_dir_error');
            }else if(me.folder_id == ''){
                setTimeout(function(){
                    upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, dir_full_path, 'create_dir_error');
                },300);
            }
            else{
                upload_event.trigger('add_folder_files_upload', me.upload_plugin, me.folder_id, dir_full_path, 'create_dir_error');
            }
        }

    };

    return create_dirs;
});