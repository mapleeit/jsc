/**
 * 拖拽上传文件夹模块
 * @author hibincheng
 * @date 2015-01-16
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
	    plugin_detect = common.get('./util.plugin_detect'),
        TreeNode = require('./upload_folder.TreeNode'),
        FolderValidata = require('./upload_file_validata.upload_folder_validata'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        query_user = common.get('./query_user'),
        Create_dirs_class = require('./upload_folder.Create_dirs_class'),
        upload_route = require('./upload_route'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
	    urls = common.get('./urls'),

        file_list = require('disk').get('./file_list.file_list'),

        loading = require('./upload_folder.loading'),
        select_folder = require('./select_folder.select_folder'),
        tmpl = require('./tmpl'),

        undefined;

	var query = urls.parse_params(),
		cur_uin = query_user.get_uin_num(),
		user = query_user.get_cached_user() || {},
		isvip = user.is_weiyun_vip && user.is_weiyun_vip();

    function walk_file_system(parent_node, directory, callback, error) {
        if (!callback.pending) {
            callback.pending = 0;
        }
        if (!callback.files) {
            callback.files = [];
            callback.root_node = parent_node;
        }
        if(!callback.dir_total_num) { //上传的目录数
            callback.dir_total_num = 0;
        }

        if(!callback.dir_level_num) { //单目录的文件数
            callback.dir_level_num = 0;
        }

        if(!callback.file_total_num) { //总文件数
            callback.file_total_num = 0;
        }

        if(!callback.file_total_size) { //总文件大小
            callback.file_total_size = 0;
        }

        callback.pending++;

        var reader = directory.createReader(),
            relativePath = directory.fullPath.replace(/^\//, "").replace(/(.+?)\/?$/, "$1/");

        callback.dir_indexs_total_num++;
        var entries = [];
        var readEntries = function() {
            reader.readEntries(function(results) {
                if(results.length) {
                    entries = entries.concat(results);
                    readEntries();
                    return;
                }
                callback.pending--;
                callback.dir_level_num = Math.max(callback.dir_level_num, entries.length);
                entries.sort();
                $.each(entries, function(i, entry) {
                    if (entry.isFile) {
                        callback.pending++;
                        entry.file(function(File) {
                            if(!File.name && !File.size || (File.name == '.' || File.name == '..')) {//360浏览器会获取. ..这样的文件
                                return;
                            }
                            File.relativePath = relativePath + File.name;
                            var cur_node = new TreeNode(File.name);
                            cur_node.h5file = File;
                            callback.file_total_size+=File.size;
                            callback.file_total_num++;
                            callback.files.push(cur_node);
                            parent_node.addFile(cur_node);
                            if (--callback.pending === 0) {
                                callback({
                                    root_node : callback.root_node,
                                    dir_total_num: callback.dir_total_num,
                                    dir_level_num: callback.dir_level_num,
                                    file_total_num: callback.file_total_num,
                                    file_total_size: callback.file_total_size
                                });
                                delete callback.root_node;
                                delete callback.dir_total_num;
                                delete callback.dir_level_num;
                                delete callback.file_total_num;
                                delete callback.file_total_size;
                                delete callback.files;
                            }
                        }, error);
                    } else {
                        var cur_node = new TreeNode(entry.name);
                        callback.dir_total_num++;
                        callback.files.push(cur_node);
                        parent_node.addDir(cur_node);
                        walk_file_system(cur_node, entry, callback, error);
                    }
                });

                if (callback.pending === 0) {
                    callback({
                        root_node : callback.root_node,
                        dir_total_num: callback.dir_total_num,
                        dir_level_num: callback.dir_level_num,
                        file_total_num: callback.file_total_num,
                        file_total_size: callback.file_total_size
                    });
                    delete callback.root_node;
                    delete callback.dir_total_num;
                    delete callback.dir_level_num;
                    delete callback.file_total_num;
                    delete callback.file_total_size;
                    delete callback.files;
                }
            }, error);
        };
        readEntries();
    }

    var upload_folder_h5_start = new Module('upload.upload_folder_h5_start', {
        /**
         * 选择上传文件夹
         */
        on_select: function() {
            var root_node = new TreeNode('root'),
                me = this;

	        //非webkit内核的浏览器，没安装控件时弹提示安装控件
	        if(!$.browser.chrome && !plugin_detect.is_newest_version()) {
		        upload_event.trigger('install_plugin', '请升级最新微云极速上传控件', 'UPLOAD_UPLOAD_DIR_NO_PLUGIN');
		        return;
	        }

	        $('<input type="file" webkitdirectory directory style="margin-left:-9999px">').appendTo(document.body).on('change', function(e) {
		        var files = e.target.files,
			        total_num = files.length,
			        dir_deep_num = 0,
			        total_size = 0;
		        $.each(files, function(i, file) {
			        if(!file.name && !file.size || (file.name == '.' || file.name == '..')) { //360浏览器会获取. ..这样的文件
				        return;
			        }
			        var paths = file.webkitRelativePath.split('/');
			        paths.pop();
			        var parent_node = root_node,
				        len = paths.length;

			        dir_deep_num = Math.max(dir_deep_num, len);//所选的文件夹目录深度
			        for(var i = 0; i < len; i++) {
				        var sub_dir = parent_node.getSubdirByName(paths.slice(i, i + 1));
				        if(!sub_dir) {
					        sub_dir = new TreeNode(paths[i]);
					        parent_node.addDir(sub_dir);
				        }
				        parent_node = sub_dir;
			        }
			        var file_node = new TreeNode(file.name);
			        file.relativePath = file.webkitRelativePath;
			        file_node.h5file = file;
			        total_size += file.size;
			        parent_node.addFile(file_node);
		        });

		        me.select_upload(root_node, total_num, total_size, dir_deep_num);
		        $(e.target).remove();
	        }).click();
        },

        select_upload: function(root_node, total_num, total_size, dir_deep_num) {
            var upload_plugin,
                file_tree_node = root_node.dirNodes[0];
            //判断是否所选的文件夹超过10层
	        var num = constants.UPLOAD_FOLDER_LEVEL;
	        var cached_user = query_user.get_cached_user();
	        if(cached_user && cached_user.get_dir_layer_max_number) {
		        num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	        }
            if(dir_deep_num > num){
                this.show_error_dialog('所选的'+file_tree_node.name+'文件夹目录超过'+num+'层，请整理后再传。');
                return false;
            }

	        if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
		        upload_plugin = require('./upload_html5_pro');
	        } else if(upload_route.is_support_flash()){//判断有flash则走h5+flash上传
                upload_plugin = require('./upload_h5_flash');
            }else if(window.FileReader && !$.browser.mozilla && !constants.IS_HTTPS) { //https暂不支持纯h5上传
                upload_plugin = require('./upload_html5');
            } else {
                mini_tip.error('HTTPS模式下请安装Flash以支持拖拽上传文件夹');
                return;
            }

            select_folder.show_by_upfolder({
                dir_name: file_tree_node.name,
                file_total_num: total_num,
                file_total_size: total_size,
                file_tree_node: file_tree_node,
                is_from_h5: true
            }, upload_plugin);
        },

        upload: function(dirEntries, has_file) {
            var me = this;
            if(has_file) { //如果有文件则先由文件上传再上传文件夹
                upload_event.once('drag_upload_files_ready', function() {
                    me.async_gain_dict_files(dirEntries);
                });
            }
            loading.show('正在分析文件夹');
            this.async_gain_dict_files(dirEntries);
        },

        async_gain_dict_files: function(dirEntries) {
            var root_node = new TreeNode('root');
            walk_file_system(root_node, dirEntries[0].filesystem.root, WY_async_gain_dict_files_succ_callback, WY_async_gain_dict_files_fail_callback);

        },

        start_upload: function(data) {
            var upload_plugin;
	        if(upload_route.is_support_html5_pro() && query.upload !== 'plugin') {
		        upload_plugin = require('./upload_html5_pro');
	        } else if(upload_route.is_support_flash()){//判断有flash则走h5+flash上传
                upload_plugin = require('./upload_h5_flash');
            }else if(window.FileReader && !$.browser.mozilla && !constants.IS_HTTPS) { //https暂不支持纯h5上传
                upload_plugin = require('./upload_html5');
            } else {
                mini_tip.error('HTTPS模式下请安装Flash以支持拖拽上传文件夹');
                return;
            }

            for(var i= 0, len = data.root_node.dirNodes.length; i < len; i++) {
                var dir = data.root_node.dirNodes[i];
                var dir_options = {
                    total_num: 0,
                    total_size: 0,
                    dir_deep_num: 0
                };
                this.recursive_dir(dir, dir_options);

                //判断是否所选的文件夹超过10层
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                if(dir_options.dir_deep_num > num){
                    upload_folder_h5_start.show_error_dialog('所选的'+dir.name+'文件夹目录超过'+num+'层，请整理后再传。');
                    return false;
                }
                (new Create_dirs_class()).init({
                    is_from_h5: true,
                    file_tree_node: dir,
                    dir_name: dir.name,
                    file_total_num: dir_options['total_num'],
                    file_total_size: dir_options['total_size']
                }, upload_plugin, this.get_disk_path_options());
            }
        },
        /**
         * 递归所选的目录，获取目录的文件数、文件总大小、目录层级数
         * @param dir_node
         * @param opt
         */
        recursive_dir: function(dir_node, opt) {

            if(dir_node.fileNodes.length) {
                opt.total_num += dir_node.fileNodes.length;
                for(var i= 0,len = dir_node.fileNodes.length; i < len; i++) {
                    opt.total_size+= dir_node.fileNodes[i].h5file.size;
                }
                var deep_num = 0,
                    deep_node = dir_node.fileNodes[0];
                while(deep_node.parentNode) {
                    deep_node = deep_node.parentNode;
                    deep_num++;
                }
                opt.dir_deep_num = Math.max(opt.dir_deep_num, deep_num);
            }
            if(dir_node.dirNodes.length) {
                for(var i= 0, len = dir_node.dirNodes.length; i< len; i++) {
                    this.recursive_dir(dir_node.dirNodes[i], opt);
                }
            }
        },

        get_disk_path_options: function() {
            var node = file_list.get_cur_node();
            //判断是否虚拟目录,是虚拟目录强制回到根目录
            if ( node && node.is_vir_dir() ) {
                node = file_list.get_root_node();
            }
            var node_name = node.get_name();
            return {
                pdir: node.get_id(),
                ppdir: node.get_parent().get_id(),
                pdir_name: node_name,
                ppdir_name: node.get_parent().get_name() || ''
            };
        },
        //显示错误的提示框
        show_error_dialog: function (msg) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + msg + '</span></p>');
            var dialog = new widgets.Dialog({
                title: '上传提醒',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog3,
                mask_ns: 'gt_4g_tips',
                buttons: [
                    {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true}
                ],
                handlers: {
                }
            });
            dialog.show();
        }
    });

    window.WY_async_gain_dict_files_succ_callback = function(data) {

        loading.hide();
        var folderValidata = FolderValidata.create();
        folderValidata.add_validata('max_dir_size', data.dir_total_num, query_user.get_cached_user().get_dir_count());  //目录数太多验证
        folderValidata.add_validata('max_level_size', data.dir_level_num, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
        folderValidata.add_validata('max_files_size', data.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
        var ret = folderValidata.run();
        if(ret){
            upload_folder_h5_start.show_error_dialog(ret[0]);
            return false;
        }

        if(data.file_total_num === 0) {
            upload_folder_h5_start.show_error_dialog('要上传的文件夹为空');
            return false;
        }
        upload_folder_h5_start.start_upload(data);//上传所选择的目录
    };

    window.WY_async_gain_dict_files_fail_callback = function() {
        loading.hide();
        mini_tip.error('分析文件夹失败，请重新选择文件夹');
    };

    return upload_folder_h5_start;
});