/**
 * 选择文件（webkit）
 * @author bondli
 * @date 13-10-17
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        tmpl = require('./tmpl'),

        text = lib.get('./text'),

        console = lib.get('./console').namespace('upload2'),

        //functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        loading = require('./upload_folder.loading'),
        widgets = common.get('./ui.widgets'),

        upload_file_check = require('./upload_file_validata.upload_file_check'),

        G2 = Math.pow(2, 30) * 2,

        is_over_total_num = false,
        is_canceled = false,
        is_finished = false,

        undefined;

    /**
     * 控件告知该次文件读取开始
     * @param taskId  
     */
    window.OnEventSelectFilesBegin = function (taskId) {
        console.debug('WYCLIENT_OnAsyncSelectFilesBegin', taskId);
        is_over_total_num = false;
        is_canceled = false;
        //显示loading
        setTimeout(function(){
            if(is_finished === false && is_over_total_num === false){
                loading.show('正在获取文件', function(){
                    is_canceled = true;
                    loading.hide();
                    upload_files.release(taskId);
                    upload_files.re_set();
                });
            }
        },300);
    };

    /**
     * 控件更新所选的数据
     * @param taskId  
     * @param currentFileCount 已获取的文件数
     */
    window.OnEventSelectFilesUpdate = function (taskId, currentFileCount) {
        console.debug('WYCLIENT_OnFilesInfoUpdate', taskId, currentFileCount);
        if(is_canceled === true || is_over_total_num === true) return 1;
        //当文件数大于我们的限制（3000）的时候，直接抛错
        if(currentFileCount > 3000){
            is_over_total_num = true;
            loading.hide();
            upload_files.release(taskId);
            upload_files.show_error_dialog('一次性上传文件总数不能超过3000个');
            return 1;
        }
        //setTimeout(function(){  //延时都是容错
            upload_files.get_files(taskId, currentFileCount);
        //},20);
        return 1;
    };

    /**
     * 控件告知该次文件读取完毕
     * @param taskId
     * @param totalFileCount 总文件数
     * @param errCode 错误码
     */
    window.OnEventSelectFilesEnd = function (taskId, totalFileCount, errCode) {
        is_finished = true;
        console.debug('WYCLIENT_OnAsyncSelectFilesComplete', taskId, totalFileCount, errCode);
        if(is_canceled === true || is_over_total_num === true) return 1;

        if(errCode === 42260002){ //点击了取消
            //隐藏显示的loading
            loading.hide();
            //调用控件的接口，读取完成后释放内存
            upload_files.release(taskId);
        }
        else {
            upload_files.set_total(taskId, totalFileCount);
            if(upload_files.check_finish(taskId)){
                //隐藏显示的loading
                loading.hide();
                var files = upload_files.get_files_arr(taskId);
                if(files){
                    //调用控件的接口，读取完成后释放内存
                    upload_files.release(taskId);
                    upload_files.show_select_folder(files);
                }
            }
            else {
                var times = 1;
                var t = setInterval(function(){  //都是容错
                    times ++;
                    if(upload_files.check_finish(taskId)){
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        var files = upload_files.get_files_arr(taskId);
                        if(files){
                            //调用控件的接口，读取完成后释放内存
                            upload_files.release(taskId);
                            upload_files.show_select_folder(files);
                        }
                    }
                    if(times>=100){  //长时间没有正确提示错误
                        clearInterval(t);
                        //隐藏显示的loading
                        loading.hide();
                        upload_files.release(taskId);
                        upload_files.re_set();
                        upload_files.show_error_dialog('读取文件出错，请稍后再试。');
                        return false;
                    }
                },50);
            }
            
        }
        return 1;
    };
    

    var upload_files = {

        _file_obj : {},

        _taskId : '',

        upload_plugin: '',

        _offset : {},

        _total : 0,

        init: function (upload_plugin) {
            this.upload_plugin = upload_plugin;
            this.upload_plugin.OnEventSelectFilesBegin = window.OnEventSelectFilesBegin;
            this.upload_plugin.OnEventSelectFilesUpdate = window.OnEventSelectFilesUpdate;
            this.upload_plugin.OnEventSelectFilesEnd = window.OnEventSelectFilesEnd;
        },

        //设置这次的文件总数
        set_total : function (taskId, totalFileCount) {
            this._taskId = taskId;
            var total = this.upload_plugin.ObtainSelectFilesCount(taskId);
            this._total = total * 1;
            if(this._total === 0){
                this._total = totalFileCount * 1;  //都是容错
            }
            console.log('ObtainSelectFilesCount:'+this._total);
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
                    
                    //console.log('ObtainSelectFilesInfo:',taskId, me._offset[taskId], pre_count);
                    var tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], pre_count);
                    if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                        tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], pre_count);
                        console.log('ObtainSelectFilesInfo failed,retry...');
                    }
                    filestr += tmpstr;

                    //更新offset
                    me._offset[taskId] += pre_count;
                }
            }

            //生效不足一次的
            if(left) {

                //console.log('GetFolderFilesInfo:',taskId, me._offset[taskId], left);
                var tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], left);
                if(tmpstr === null || tmpstr === 'null' || tmpstr === ''){ //重试一次
                    tmpstr = me.upload_plugin.ObtainSelectFilesInfo(taskId, me._offset[taskId], left);
                    console.log('ObtainSelectFilesInfo failed,retry...');
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
            //console.log(this._total, this._file_obj[taskId].length);
            return (this._total == this._file_obj[taskId].length) ? true : false;
        },

        //获取文件数组
        get_files_arr: function (taskId) {
            if(this._file_obj[taskId] === undefined) {
                this.show_error_dialog('分析文件出错，请稍后再试。');
                return false;
            }
            //console.log('get_arr:'+ this._file_obj[taskId].length);
            var files = this._file_obj[taskId];
            //console.log(files);
            this.re_set();

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
            console.log('ReleaseSelectFilesInfo');
            return this.upload_plugin.ReleaseSelectFilesInfo(taskId);
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
            return upload_file_check.check_start_upload(files, this.upload_plugin, G2);
        }

    };

    return upload_files;

});