/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define(function (require, exports, module) {
    var console = require('lib').get('./console'),
        BOX = function () {
            var me = this;
            me.max = 4;//最大缓冲区长度
            me.cur = 0;//当前缓冲区位置
            me.speed = 0;//输出的速度
            me.total = 0;//缓冲区内总大小
            me.zero_times = 0;//连续出现速度为0的次数
            me.last= {
                time: 0,
                processed: 0,
                task: null
            };
        };
    BOX.prototype = {
        set: function (speed) {//设置平均速度
            var me = this;
            /*me.cur += 1;
            if (me.max === me.cur) {
                me.cur -= 1;
            }
            me.total += speed;
            //console.log('total:',me.total,'cur:',me.cur);
            me.total = me.speed = ( me.total / me.cur ) | 0;*/
            me.speed = speed;
            me.zero_times = me.speed > 0 ? 0 : (me.zero_times + 1);
        },
        get: function () {//获取平均速度
            return this.speed;
        },
        reset: function () {
            var me = this;
            me.cur = me.speed = me.total = me.zero_times = 0;
            me.init_task(null, 0);
        },
        init_task: function (task, time) {
            var me = this;
            me.last = {
                time: time,
                processed: task && task.processed || 0,
                task: task
            }
            //console.log('time:',me.last.time,'processed:',me.last.processed);
            //console.log('new speed:',speed);
        }
    };
    var upload = new BOX(), //上传
        downloads = {};//下载
    var count_box = {
        /**
         * 获取当前的网络速度
         * @param [running]
         * @returns {*}
         */
        get_speed: function (running) {
            var time = +new Date(),
                running = running || upload,
                last_task_speed = 0;
            if (running.last.time) {
                if (running.last.task === this) {
                    running.set(Math.max((this.processed - running.last.processed) / (time - running.last.time) * 1000 | 0, 0));
                } else {
                    //一个计算周期内上一个任务已经完成了，则用完成的大小加上当前完成的大小来计算速度
                    if(!running.last.task.is_miaoc()) {
                        last_task_speed = Math.max((running.last.task.processed - running.last.processed + this.processed) / (time - running.last.time) * 1000 | 0, 0);
                    }
                    running.reset();
                }
            }
            running.init_task(this, time);

            return last_task_speed || running.get();
        },
	    /**
	     * 获取单通道上传速度
	     * 单通道速度 = 分片大小*速度*通道数/(分片大小*通道数 +（通道数-1）*速度*架平耗时)
	     * 架平耗时暂时锁定200ms
	     * @param [speed]
	     * @returns {*}
	     */
	    get_cn_speed: function (running, speed) {
		    if(running && running.channel_count && running.channel_count > 1) {
			    return parseInt(running.fragment * speed * running.channel_count / (running.fragment * running.channel_count + (running.channel_count - 1) * speed * 0.2));
		    } else {
			    //只有一个通道就不用算了，通道速度就是总速度
			    return speed;
		    }
	    },
	    /**
	     * 获取增量上传速度
	     * 增量速度 = (速度 - 单通道速度)*(95 + rand()%10)/100
	     * 随机在95% - 105%之间
	     * @param [speed]
	     * @returns {*}
	     */
	    get_ex_speed: function (speed, cn_speed) {
		    return parseInt((speed - cn_speed) * (95 + parseInt(Math.random() * 10)) / 100);
	    },
        /**
         * 重置速度计算器
         * @param [running]
         */
        reset_speed: function (running) {
            (running || upload).reset();
        },
        delay_times:{
            'upload_flash':120,
            'active_plugin':120,
            'webkit_plugin':120,
            'h5_flash_plugin': 120
        },
        /**
         * 是否网络延迟：一段时间内，同一个文件传输的量没有变化，就被认为网络超时
         * @returns {boolean}
         */
        network_is_delay: function () {
            return upload.zero_times > count_box.delay_times[upload.last.task.upload_type];
        },
        /**
         * 获取当前正在计速的文件
         * @param [running]
         * @returns {null}
         */
        get_task: function (running) {
            return (running || upload).last.task;
        },

        down: {
            get_speed: function (key) {
                return count_box.get_speed.call(this, downloads[key]);
            },
            reset_speed: function () {
                for (var key in downloads) {
                    count_box.reset_speed(downloads[key]);
                }
            },
            remove: function (key) {
                delete downloads[key];
            },
            add: function (key) {
                if(!downloads[key]){
                    downloads[key] = new BOX();
                }
            }
        }
    };
    return count_box;
});