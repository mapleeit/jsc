/**
 * 上传文件夹时获取所选的文件信息
 * @author bondli
 * @date 13-7-29
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        constants = common.get('./constants'),
	    query_user = common.get('./query_user'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

        TreeNode = require('./upload_folder.TreeNode'),
        JSON = lib.get('./json'),

        G4 = Math.pow(2,30) * 4,

        undefined;

    function findParent(parentNode, curr, root){
        if(curr === root){
            return root;
        }
        if(curr.name == null){
            return null;
        }
        if(curr.name !== parentNode){
            return findParent(parentNode, curr.parentNode, root);
        }else{
            return curr;
        }
    };


    var get_up_folder_files = function ( files_arr ) {
        var dir_name = '',          //所选目录名称
            dir_path = '',          //所选目录路径（包含目录名称）
            file_total_size = 0,          //所选文件总大小
            file_total_num = 0,
            prefix_dir_num = 0,     //所选的目录的前缀目录层数 
            dir_level_num = 0,      //单层目录下最大值   
            dir_total_num = 0,      //总目录数
            select_dir_level = 1,   //所选目录的层级
            is_exist_4g = false;    //是否存在4G大文件

        var _file_arr_length = files_arr.length,
            _path_min_arr = null
            _level_num_arr = [];

        var _is_exist_folder_be_ignore = false; //是否存在最后一级目录被忽略

        var root = null,
            currNode = null;

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
            if(file.charAt(file.length - 1) === '\\'){
                file = file.substr(0,file.length-1);
            }
            filepath = file.split('\\');

            if(i == 0) { //第一个记录
                _path_min_arr = filepath;
                prefix_dir_num = _path_min_arr.length - 1;
                dir_name = _path_min_arr[prefix_dir_num];
                dir_path = file;

                //创建根节点
                root = new TreeNode(dir_name);
                currNode = root;
            }

            //统计每层的文件+目录总数
            if(_level_num_arr[filepath.length]){
                _level_num_arr[filepath.length] ++;
            }
            else {
                _level_num_arr[filepath.length] = 1;
            }

            //文件
            if(isdir == false) {
                if (filesize >= G4) {
                    is_exist_4g = true;
                }

                file_total_num ++;

                var temp = file.split('\\');
                temp.pop();
                var t = prefix_dir_num;
                do {
                    temp.shift();
                    t--;
                }
                while(t>0);

                var parentNode = temp.join('\\');

                if(currNode.name != parentNode){
                    currNode = findParent(parentNode, currNode, root);
                }
                currNode.addFile(file);
            }
            //目录
            else {
                if(filepath.length > select_dir_level) {
                    select_dir_level = filepath.length;
                }
                //剔除最后一层的目录，这个时候只取到目录，目录下文件没有取到
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                if( filepath.length-1 == prefix_dir_num + num ){
                    _is_exist_folder_be_ignore = true;
                }
                else{
                    dir_total_num ++; //统计目录总数

                    if(i > 0) { //第一个前面已经执行了

                        var temp = file.split('\\'),
                            nodeName = file.split('\\');
                        temp.pop();
                        var t = prefix_dir_num;
                        do {
                            temp.shift();
                            nodeName.shift();
                            t--;
                        }
                        while(t>0);
                        var parentNode = temp.join('\\'),
                            node_Name = nodeName.join('\\'),
                            dirNode = new TreeNode(node_Name);

                        if(currNode.name != parentNode){
                            currNode = findParent(parentNode, currNode, root);
                        }
                        currNode.addDir(dirNode);
                        currNode = dirNode;

                    }

                }
                
            }
            file_total_size += filesize; //统计文件大小

        });

        //取每层的最大值
        _level_num_arr = $.map(_level_num_arr, function(i){
            if(i != null) return i;
        });
        dir_level_num = Math.max.apply(null, _level_num_arr);

        //获取出现最大值的目录名称
        //var _index = $.inArray(dir_level_num, _level_num_arr),
           // _max_file_num_dir_name = _path_min_arr[ prefix_dir_num + _index ];

        return {
            file_total_size : file_total_size,
            dir_name : dir_name,
            file_tree_node : root,
            file_total_num : file_total_num,
            dir_total_num : dir_total_num,
            dir_level_num : dir_level_num,
            prefix_dir_num : prefix_dir_num,
            //max_file_num_dir_name : _max_file_num_dir_name,
            dir_path : dir_path,
            is_exist_folder_be_ignore : _is_exist_folder_be_ignore,
            select_dir_level : select_dir_level - prefix_dir_num,
            is_exist_4g : is_exist_4g
        };
    };

    return get_up_folder_files;

});