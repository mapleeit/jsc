define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        c = lib.get('./console'),
        JSON = lib.get('./json'),

        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        page_event = common.get('./global.global_event').namespace('page'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),

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

        //c.log(param.LocalID,param.EventType,param.ErrorCode,param.Step);

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
	    var error_map = {
		    '2': '系统找不到指定的文件，请确认文件可用并重试上传'
	    };
	    if (error_code !== undefined && error_code !== 'undefined' && error_code !== 0) {
		    var error_step = param.Step;    //控件错误调试step
		    c.warn('fileupload '+op+' errorCode= ' + error_code);
		    c.warn('fileupload '+op+' step= ' + error_step);
		    task.change_state('error', [(error_map[error_code.toString()] || '存储服务繁忙') + '(' + error_code + ')' , error_code] , error_step);
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
            //解决弹出后停留5秒后点击取消会自己关闭的bug
            var is_new_qq = false;
            if(window.external.GetVersion){
                var ver = window.external.GetVersion();
                if(ver >= 5311){
                    is_new_qq = true;
                }
            }
            var msg = page_event.trigger('before_unload');
            if (msg) {
                if(is_new_qq){
                    return '{"MsgTitle":"提示", "MsgContent":"'+msg+'", "IconType":1}';
                }
                else{
                    if(window.external.MsgBox_Confirm('提示', msg, 1)){
                        page_event.trigger('confirm_unload');
                        return close;
                    } else {
                        return no_close;
                    }
                }
            }
        }

        if(typeof pt_logout !== 'undefined') {
            pt_logout.logoutQQCom(function() {
                query_user.destroy();
            });
        } else {
            require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                pt_logout.logoutQQCom(function() {
                    query_user.destroy();
                });
            });
        }
        //query_user.destroy();//关闭窗口要求重新登录
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
});