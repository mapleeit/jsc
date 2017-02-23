/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-7-31
 * Time: 下午4:51
 * HTML5上传
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        routers = lib.get('./routers'),
        query_user = common.get('./query_user'),
        global_variable = common.get('./global.global_variable'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        upload_route = require('./upload_route'),
        select_folder = require('./select_folder.select_folder'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        upload_cache = require('./tool.upload_cache'),
        upload_dom = main_ui.get_$uploader();
    var Upload = {
        upload_type:"upload_html5",
        $upload_html5_input:null,
        change: function () {
            //获取用户选择的文件名
            var me=this;
            var __files = [];
            var _filearray=me.get_files();
            for(var i=0; i<_filearray.length;i++){
                var file_name = _filearray[i].name,
                    ary = file_name.split(/\\|\//),
                    file_size =  _filearray[i].size;
                file_name = ary[ary.length - 1] || '';
                __files.push({"name":file_name,"size":file_size,"file":_filearray[i]});
            }

            var cur_user = query_user.get_cached_user(),
                main_key = cur_user.get_main_dir_key(),
                root_key = cur_user.get_root_key();
            //上传到中转站文件直接上传，不用进入选择目的地
            if(global_variable.get('upload_file_type') == 'temporary') {
                upload_event.trigger('add_upload', upload_route.upload_plugin, __files, {
                    'temporary': true,
                    'ppdir': root_key,
                    'pdir': main_key,
                    'ppdir_name': '微云',
                    'pdir_name': '中转站',
                    'dir_paths': ['中转站'],
                    'dir_id_paths': [main_key]
                });
                routers.go({ m: 'station' });
            } else {
                //弹出上传路径选择框，第三个参数标识是上传类型
                select_folder.show(__files, upload_route.upload_plugin, 'html5');
            }
            me.destory();
        },
        get_input:function(){
            return this.$upload_html5_input|| (this.$upload_html5_input=$( '#_upload_html5_input'));
        },

        get_files:function(){
            return this.get_input()['0'].files;
        },

        destory:function(){
            if(this.$upload_html5_input){
                this.$upload_html5_input.remove();
                var $form=upload_dom.find('.upload-form');
                $('<input id="_upload_html5_input" name="file" type="file" multiple="multiple" class="ui-file" aria-label="上传文件，按空格选择文件。"/>').appendTo($form);
                this.$upload_html5_input=null;
            }
        },

        uploadFile:function(data,Upload){
            var xhr = new XMLHttpRequest();
            Upload.xhr = xhr;
            //因非分片上传还不支持https，所以直接写死端口，后续支持后采用data.port
	        var _url = https_tool.translate_url('http://' + data.server_name + ':8080/ftn_handler/?ver=12345&ukey=' + data.check_key + '&filekey=' + data.file_key + '&');
	        var fd = new FormData();
	        fd.append('file', Upload.file);
	        //xhr.withCredentials =true;
	        xhr.open("post", _url);
	        xhr.upload.addEventListener('progress', function(e) {
		        if(e.lengthComputable) {
			        var task = upload_cache.get_task(data.local_id);
			        if(task) {
				        task.change_state('upload_file_update_process', e.loaded);
			        }
		        }
	        }, false);
            var file_type = Upload.file.type;
            //error 事件都需要监听
            xhr.upload.addEventListener('error',function(e){
                var task =upload_cache.get_task(data.local_id);
                if(task){
                    if(!file_type) { //可能是文件夹
                        task.change_state('error',1000011);
                    } else {
                        task.change_state('error',10003);
                    }
                }
            });
            xhr.addEventListener('error',function(e){
                var task =upload_cache.get_task(data.local_id);
                if(task){
	                if(e.target.readyState != 4 || e.target.status != 200) {
		                //网络问题
		                task.change_state('error', 10003);
	                } else if(!file_type) { //可能是文件夹
		                task.change_state('error', 1000011);
	                } else {
		                //其它的也都归为网络问题
		                task.change_state('error', 10003);
	                }
                }
            });

            xhr.onreadystatechange=function(e){
                if(xhr.readyState === 4){
                    var task =upload_cache.get_task(data.local_id);
                    if(xhr.status === 200 && task){
                        task.change_state('done');
                    }
                }
            }
            xhr.send(fd);

        }
    }


    var html5_upload_render = function () {
        if(upload_route.upload_plugin == null){
            upload_dom.empty();
            var form = $('<div class="uploads upload-form"><input id="_upload_html5_input" name="file" type="file" multiple="multiple" class="ui-file" aria-label="上传文件，按空格选择文件。"/></div>').appendTo(upload_dom);
            form.change(function(){
                upload_route.upload_plugin.change();
            });
        }

    };


    html5_upload_render();

    module.exports = Upload;


});