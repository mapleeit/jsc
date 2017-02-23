/**
 * 从appbox拖拽发送qq文件
 * @author bondli
 * @date 13-10-17
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),
        JSON = lib.get('./json'),

        console = lib.get('./console').namespace('upload2'),

        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./upload_folder.loading'),
        get_up_folder_files = require('./upload_folder.get_up_folder_files'),
        FolderValidata = require('./upload_file_validata.upload_folder_validata'),
        select_folder = require('./select_folder.select_folder'),
        widgets = common.get('./ui.widgets'),

        is_over_total_num = false,

        is_canceled = false,

        undefined;

    var plugin_callback = {
        /**
         * 控件告知该次文件读取开始
         * @param taskId  
         */
        OnAsyncSelectFolderBegin : function(taskId) {
            console.debug('WYCLIENT_OnAsyncSelectFolderBegin', taskId);
            is_over_total_num = false;
            is_canceled = false;
            //显示loading
            loading.show('正在获取文件夹信息', function(){
                is_canceled = true;
                loading.hide();
                upload_folder.release(taskId);
                upload_folder.re_set();
            });
        },

        /**
         * 控件更新所选的数据
         * @param taskId  
         * @param currentFileCount 已获取的文件数
         */
        OnFolderFilesInfoUpdate : function (taskId, currentFileCount) {
            console.debug('WYCLIENT_OnFolderFilesInfoUpdate', taskId, currentFileCount);
            if(is_canceled === true || is_over_total_num === true) return 1;
            //当文件数大于我们的限制的时候，直接抛错
            if(currentFileCount > 2*constants.UPLOAD_FOLDER_MAX_FILE_NUM){
                is_over_total_num = true;
                loading.hide();
                upload_folder.release(taskId);
                upload_folder.show_error_dialog('所选文件夹下文件总数超过'+ constants.UPLOAD_FOLDER_MAX_FILE_NUM +'个，请管理后上传。');
                return 1;
            }
            upload_folder.get_files(taskId, currentFileCount);
            return 1;
        },

        /**
         * 控件告知该次文件读取完毕
         * @param taskId
         * @param totalFileCount 总文件数
         * @param errCode 错误码
         */
        OnAsyncSelectFolderComplete : function (taskId, totalFileCount, errCode) {
            console.debug('WYCLIENT_OnAsyncSelectFolderComplete', taskId, totalFileCount, errCode);
            if(is_canceled == true) return;

            if(errCode === 42260001){ //选择了整个磁盘
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
                upload_folder.show_error_dialog('暂不支持上传整个盘符，请重新选择。');
            }
            else if(errCode === 42260002){ //点击了取消
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
            }
            else if(errCode === 42260003) { //选择的文件夹中超过10层了
                //隐藏显示的loading
                loading.hide();
                //调用控件的接口，读取完成后释放内存
                upload_folder.release(taskId);
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                upload_folder.show_error_dialog('所选的文件夹目录超过'+num+'层，请整理后再传。');
            }
            else {
                upload_folder.set_total(taskId, totalFileCount);
                if(upload_folder.check_finish(taskId)){
                    //隐藏显示的loading
                    loading.hide();
                    var files = upload_folder.get_files_arr(taskId);
                    if(files){
                        //调用控件的接口，读取完成后释放内存
                        upload_folder.release(taskId);
                        upload_folder.show_select_folder(files);
                    }
                }
                else {
                    var times = 1;
                    var t = setInterval(function(){  //都是容错
                        times ++;
                        if(upload_folder.check_finish(taskId)){
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            var files = upload_folder.get_files_arr(taskId);
                            if(files){
                                //调用控件的接口，读取完成后释放内存
                                upload_folder.release(taskId);
                                upload_folder.show_select_folder(files);
                            }
                        }
                        if(times>=50){  //长时间没有正确提示错误
                            clearInterval(t);
                            //隐藏显示的loading
                            loading.hide();
                            upload_folder.release(taskId);
                            upload_folder.re_set();
                            upload_folder.show_error_dialog('分析文件夹超时，请不要上传过大文件夹。');
                            return false;
                        }
                    },50);
                }
                
            }
            return 1;
        }
    }
    

    var upload_folder = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : {},

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
            upload_plugin.OnAsyncBatchSelectFolderEvent = function(event_param){
                var taskId = event_param.LocalID,
                    fileCount = event_param.FileCount, 
                    errCode = event_param.ErrorCode,
                    eventType = event_param.EventType;
                //console.log(taskId,fileCount,errCode,eventType);
                switch(eventType){
                    case 11:    //begin
                        plugin_callback.OnAsyncSelectFolderBegin(taskId);
                        break;
                    case 12:    //end
                        plugin_callback.OnAsyncSelectFolderComplete(taskId, fileCount, errCode);
                        break;
                    case 13:    //update
                        plugin_callback.OnFolderFilesInfoUpdate(taskId, fileCount);
                        break;
                }
            };
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.GetAsynBatchSelectFileCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('GetFolderFilesCount:'+this._total);
        },

        //开始取数据
        get_files: function (taskId, select_count) {
            if(this._offset[taskId] === undefined){
                this._offset[taskId] = 0;
            }

            var me = this,
                filestr = '',
                pre_count = 100,
                need_get_count = select_count - me._offset[taskId],
                times = Math.floor(need_get_count/pre_count),
                left = need_get_count % pre_count;
            

            //次数大于等于1
            if(times >= 1){
                for(var i=1; i<=times; i++){
                    
                    //console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], pre_count);
                    var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], pre_count);
                        console.log('GetFolderFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;

                    //更新offset
                    me._offset[taskId] += pre_count;
                }
            }

            //生效不足一次的
            if(left) {

                //console.log('GetFolderFilesInfo1:',taskId, me._offset[taskId], left);
                var tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.GetAsynBatchSelectFileInfo(taskId, me._offset[taskId], left);
                    console.log('GetFolderFilesInfo failed,retry...');
                }
                filestr += tmpstr;

                //更新offset
                me._offset[taskId] += left;
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
                this.show_error_dialog('分析文件夹出错，找不到指定的文件。');
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = get_up_folder_files(this._file_obj[taskId]);
            //console.log(files);
            this.re_set();

            //判断是是否所选的文件夹超过10层
            if(files.is_exist_folder_be_ignore == true){
	            var num = constants.UPLOAD_FOLDER_LEVEL;
	            var cached_user = query_user.get_cached_user();
	            if(cached_user && cached_user.get_dir_layer_max_number) {
		            num = cached_user.get_dir_layer_max_number() || constants.UPLOAD_FOLDER_LEVEL;
	            }
                this.show_error_dialog('所选的文件夹目录超过'+num+'层，请整理后再传。');
                return false;
            }

            var folderValidata = FolderValidata.create();
            folderValidata.add_validata('max_dir_size', files.dir_total_num, query_user.get_cached_user().get_dir_count());  //目录数太多验证
            //var max_file_num_dir_name = text.smart_cut(files.max_file_num_dir_name, 20);
            //console.log(files.dir_level_num, max_file_num_dir_name);
            folderValidata.add_validata('max_level_size', files.dir_level_num, query_user.get_cached_user().get_max_indexs_per_dir());  //单层目录下太多验证
            folderValidata.add_validata('max_files_size', files.file_total_num, constants.UPLOAD_FOLDER_MAX_FILE_NUM);  //总文件数太多验证
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
        },

        //释放资源
        release: function (taskId) {
            console.log('ReleaseFolderFilesData');
            return this.upload_plugin.ReleaseLocal(taskId);
        },

        //重新设置初始值
        re_set: function () {
            this._taskId = '';
            this._file_arr = [];
            this._offset = {};
            this._total = 0;
        },

        //弹出上传位置选择框
        show_select_folder: function (files) {
            return select_folder.show_by_upfolder(files, this.upload_plugin);
        }

    };

    return upload_folder;

});