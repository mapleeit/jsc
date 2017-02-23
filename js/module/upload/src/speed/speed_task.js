/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define(function (require, exports, module) {
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
	                    setTimeout(up.watch_fn, 500);//先跑一次让速度外显出来
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
});