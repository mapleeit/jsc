//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/download_route/download_route.r150408",["lib","common","main","upload"],function(require,exports,module){

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
//download_route/src/download_route.js

//js file list:
//download_route/src/download_route.js
/**
 * 下载路由
 * @author trump li
 * @date 13-3-27
 */
define.pack("./download_route",["lib","common","main","upload"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        functional = common.get('./util.functional'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),

        main = require('main').get('./main'),//页面主模块

        console = lib.get('./console'),
        url_parser = lib.get('./url_parser'),
        global_var = common.get('./global.global_variable'),
        logger = common.get('./util.logger'),

        Cache,//管理器cache模块
        Class,//管理器基类

        local_cache = {},//本地任务对象
        get_task = function (task_id) {//获取任务对象
            return local_cache[task_id];
        },
        remove_task = function (task_id) {//删除任务对象
            delete local_cache[task_id];
        },
        percent_cache = {},//进度cache
        deal_percent_cache = functional.throttle(function () {//每300毫秒更新一次进度cache
            for (var key in percent_cache) {
                var task = get_task(key);
                if (task) {
                    //只有是开始，续传，更新进度的才能更改状态是processing
                    if(task.state === 'start' || task.state === 'continuee' || task.state === 'to_continuee' || task.state === 'processing') {
                        task.change_state('processing', percent_cache[key]);
                    }
                } else {
                    delete percent_cache[key];
                }
            }
        }, 300),

        //下载操作oz上报sub_op字段值
        SUB_OP = {
            DONE: 0,//成功
            FAIL: 1,//失败
            CANCEL: 2//取消
        };
    /*******************************控件回调接口 开始*******************************************/
    /**
     * 添加下载任务
     * @param task_id
     * @param file_name
     * @param file_size
     * @param target_path
     * @param file_thum_url
     * @param cover_file
     * @param OperationType 0：拖拽下载， 1：点击下载
     * @param down_url 下载的地址，可以用来取fileid
     * @constructor
     */
    window.WYCLIENT_AddDownloadTask = function (task_id, file_name, file_size, target_path, file_thum_url, cover_file, OperationType, down_url) {
        if (!Class) {
            var mod = require('upload');
            Cache = mod.get('./tool.upload_cache');
            Class = mod.get('./download.appbox');
        }

        var file_id = '',
            is_package = false;

        if(down_url){
            var url_obj = url_parser.parse(down_url),
                params = url_obj.get_params();
            is_package = (url_obj.host.indexOf('batch')>=0) && file_name.slice(-4) === '.zip';  //打包域名中包含batch字符
            file_id = params['fid'];
            if(!file_id) { //cgi2.0改造已不能从url把fid传入
                if(down_url[down_url.length-1] === '#') {
                    down_url = down_url.slice(0, down_url.length-1);
                }
                var down_key = down_url.split('/')[4];
                file_id = global_var.get(down_key);
                global_var.del(down_key);//用完销毁
            }
        }
       // console.debug('target_path:', target_path, 'file_thum_url:', file_thum_url, 'cover_file:', cover_file, 'operationType:', OperationType, 'down_url:', down_url)

        console.debug('WYCLIENT_AddDownloadTask', task_id, file_name, file_size, OperationType, file_id);
        Class.create({
            'task_id': task_id,
            'file_name': file_name,
            'file_size': file_size,
            'target_path': target_path,
            'file_thum_url': file_thum_url,
            'cover_file': cover_file,
            'file_id': file_id,
            'is_package': is_package,
            'download_url': down_url || ''
        });
        local_cache[task_id] = Cache.get_dw_main_cache().get_cache()[task_id];
        if(OperationType === "0") {
            user_log('DISK_DRAG_DOWNLOAD');
        }
    };
    /**
     * 准备下载链接    空实现
     * @param task_id
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskPreparing = function (task_id) {
    }
    /**
     * 开始下载        空实现
     * @param task_id
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskBegin = function (task_id) {
    };
    /**
     * 下载进度更新
     * @param task_id
     * @param percent
     * @param speed
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskProcessing = function (task_id, percent, speed) {
        var task = get_task(task_id);
        if (task) {
            if (task.state === 'done' || task.state === 'error') {
                delete percent_cache[task_id];
            } else {
                percent_cache[task_id] = percent;
                deal_percent_cache();
            }
        } else {
            abort_download(task_id);//主动停止上传, WYCLIENT_AddDownloadTask 调用有丢失的情况
            console.error(task_id, 'can not find when process');
        }
    };

    /**
     * 下载结束
     * @param task_id
     * @param target_path
     * @param error_code
     * @param file_name
     * @param file_size
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskCompleted = function (task_id, target_path, error_code, file_name, file_size) {
        var disk_actived = main.get_cur_mod_alias() === 'disk',//当前模块是否为网盘
            during_time = 0,
            task = get_task(task_id);
        if (task) {//下载任务开始后的错误
            during_time = +new Date() - task.startTime;
        }
        delete percent_cache[task_id];
        console.debug('OnDownloadTaskCompleted', task_id, error_code, (error_code == 0 || error_code == 1), task.file_name || file_name, task);
        if (error_code == 0 || error_code == 1) {//下载正常完成
            if (task) {
                task.change_state('done');
                user_log('webkit_donwload', 0, {
                    service_id: disk_actived ? constants.SERVICE_ID.DISK : constants.SERVICE_ID.PHOTO,
                    subop: SUB_OP.DONE,
                    file_size: task.file_size == -1 ? 0 : task.file_size, //-1表示压缩包的上报时也改为0
                    extString1: task.file_name || file_name,
                    extInt1: during_time
                });
            } else {
                console.error(task_id, 'can not find when done');
                logger.report('weiyun_download', {
                    ret_code: error_code,
                    file_id: task.file_id,
                    file_name: task.file_name,
                    download_url: task.download_url,
                    extra: 'can not find taskid'
                });
            }
        } else {//下载出错
            if (task) {
                task.change_state('error', error_code);
                error_code -= 0;
                user_log('webkit_donwload', error_code, {
                    service_id: disk_actived ? constants.SERVICE_ID.DISK : constants.SERVICE_ID.PHOTO,
                    subop: SUB_OP.FAIL,
                    file_size: task.file_size == -1 ? 0 : task.file_size,
                    extString1: task.file_name || file_name,
                    extInt1: during_time
                });
                logger.report('weiyun_download', {
                    ret_code: error_code,
                    file_id: task.file_id,
                    file_name: task.file_name,
                    download_url: task.download_url
                });
            } else {
                console.error(task_id, 'can not find when error');
                logger.report('weiyun_download', {
                    ret_code: error_code,
                    file_id: task.file_id,
                    file_name: task.file_name,
                    download_url: task.download_url,
                    extra: 'can not find taskid'
                });
            }
        }
    };

    /**
     * 从暂停的下载任务中恢复
     * @param taskId
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskResume = function(taskId){
        //console.log(taskId+'任务恢复回调函数回调成功');
        get_task(taskId).change_state('continuee');
    };

    /**
     * 暂停下载任务
     * @param taskId
     * @constructor
     */
    window.WYCLIENT_OnDownloadTaskPause = function(taskId){
        //console.log(taskId+'任务停止回调函数回调成功');
        get_task(taskId).change_state('pause');
    };


    /*******************************控件回调接口 结束*******************************************/
    /**
     * 取消下载
     * @param task_id
     */
    var abort_download = function (task_id) {
        window.external.AbortDownload(task_id);
        var task = get_task(task_id);
        if (!task) {
            return;
        }
        user_log('webkit_donwload', 0, {
            service_id: (main.get_cur_mod_alias() === 'disk') ? constants.SERVICE_ID.DISK : constants.SERVICE_ID.PHOTO,
            subop: SUB_OP.CANCEL,
            str_file_size: task.file_size+'',
            extString1: task.file_name,
            extInt1: +new Date() - task.startTime
        });
        remove_task(task_id);//从local_cache中删除任务
    };
    /**
     * 打开指定目录
     * @param task_id
     * @param target_path
     * @param file_name
     */
    var open_file_directory = function (task_id, target_path, file_name) {
        window.external.OpenFileDirectory(task_id, target_path, file_name);
        user_log('UPLOAD_DOWN_BAR_OPEN_DIR');//统计打开下载的文件夹
    };
    return {
        abort_download: abort_download,
        open_file_directory: open_file_directory
    }

});