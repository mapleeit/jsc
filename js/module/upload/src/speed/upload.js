/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        console = lib.get('./console'),
	    common = require('common'),
	    huatuo_speed = common.get('./huatuo_speed'),

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
	    cnSpeed = 0,    //ChannelSpeed，单通道上传速度
	    exSpeed = 0,    //增量速度

	//上报测速相关变量
	    report_point = '21254-1-1',
	    report_point2 = '21254-1-25',
	    report_queue = [],
	    report_interval = 0,

        able_state = {'upload_file_update_process': 1},//能获取速度的运行状态
    //计算平均速度，单位为KB/s
	    get_avg_speed = function() {
		    var count = 0;
		    for(var i=0, len=report_queue.length; i<len; i++) {
			    count += report_queue[i];
		    }
		    report_queue = [];
		    return parseInt(count / len / 1024);
	    },
	    report_speed = function() {
		    var running = Cache.get_curr_real_upload();
		    if (running) {//可获取速度的状态
			    if(report_queue.length) {
				    var avg_speed = get_avg_speed(),
					    avg_speed_single;
				    if(running.upload_type === 'upload_html5_pro') {
					    report_point = '21254-1-24';
					    if(running.channel_count) {
						    avg_speed_single = parseInt(avg_speed / running.channel_count);
						    huatuo_speed.store_point(report_point2, 1, avg_speed_single);
						    huatuo_speed.report(report_point2, false);
					    }
				    } else {
					    report_point = '21254-1-1';
				    }
				    huatuo_speed.store_point(report_point, 1, avg_speed);
				    huatuo_speed.report(report_point, false);
			    }

			    //停止上报上传测速并清空变量
			    if(running.state == 'done') {
				    clearInterval(report_interval);
				    report_queue = [];
			    }
		    }
	    },
        make_speed = function () {// 获取当前速度  {number :　0: 网络超时， 1：有可用速度 ,-1:不能获取速度的状态 }
            var running = Cache.get_curr_real_upload();
            if (running && running.state != 'done') {//可获取速度的状态
                speed = BOX.get_speed.call(running);//获取上传速度
	            //极速上传获通道速度和增量速度用于外显
	            if(running.upload_type === 'upload_html5_pro') {
		            cnSpeed = BOX.get_cn_speed.call(running, running, speed);
		            exSpeed = BOX.get_ex_speed.call(running, speed, cnSpeed);
	            }
                if (speed === 0 && BOX.network_is_delay()) {
                    return 0;
                } else {
	                //上传大于2M的文件才上报测速
	                if(running.file_size >= 2 * 1024 * 1024) {
		                if(speed) {
			                report_queue.push(speed);
		                }
		                if(!report_interval) {
			                //每十秒取平均值上报一次
			                report_interval = setInterval(function() {
				                report_speed();
			                }, 5000);
		                }
	                }
                    return 1;
                }
            } else {//不能获取速度状态
                speed = -1;
	            //停止上报上传测速并清空变量
	            report_speed();
	            clearInterval(report_interval);
	            report_queue = [];
                return 1;
            }
        },
        watch_fn = function () {
            if (Cache.get_up_main_cache().is_done()) {//上传任务已经完成，返回
                return;
            }
            var sign = make_speed();
	        var task = BOX.get_task(),//获取 计算速度的 上传对象
		        state = task.state,
		        type = task.upload_type;

            if (state != 'file_sign_update_process' && state != 'error' && sign === 0) {//超时
                if (task && type !== 'upload_form') {//表单上传不参与 超时重试，form有自己的超时机制
                    var time = task.re_try_time ? task.re_try_time : (task.re_try_time = 0);
                    if (time >= limit_time[type]) {
                        console.debug('re_try times over max ,trigger error');
                        //if(task.get_is_retry() === false){ //判断是否重试，不是重试就重来一次
                        //    task.change_state('re_try');
                        //}
                        //else{
                            task.change_state('error', 10001);//自动重试后，报出超时错误
                        //}

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
	            if(task.upload_type === 'upload_html5_pro') {
		            get_bar().update(get_bar().OPS.UP_SPEED, speed, cnSpeed, exSpeed);
	            } else {
		            get_bar().update(get_bar().OPS.UP_SPEED, speed);
	            }
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
});