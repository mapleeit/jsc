define(function (require, exports, module) {
    var $ = require('$'),
	    lib = require('lib'),
	    common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        File = common.get('./file.file_object'),
	    logger = common.get('./util.logger'),
        constants = common.get('./constants'),
	    query_user = common.get('./query_user'),
        scr_reader_mode = common.get('./scr_reader_mode'),


	    Cache = require('./tool.upload_cache'),
	    Static = require('./tool.upload_static'),
        speed_task = require('./speed.speed_task'),
        upload_route = require('./upload_route'),
        temporary_upload = require('./tool.temporary_upload'),

        lt_ie9 = $.browser.msie && $.browser.version < 9,
        text_retry_all = ('<a action="click_re_try_all" ' + (lt_ie9 ? ' href="#"' : '') + '>全部重试</a>'),
        text_resume = '{num}个上传任务已暂停，<a action="click_resume" style="cursor:pointer;">继续上传</a>',

        view,//视图模块
        get_view = function () {//获取视图对象
            return view || (view = require('./view'));
        },
        $left_time,//剩余时间
        $all_time,//耗时
        $speed,//速度
        hide_whole_info = false,//是否隐藏 耗时/速度/剩余时间

        bar_states = {
            error: 'state-error',//错误class
            process: 'fn-col state-text state-uploading',//处理中class
            done: 'state-completed'//完成class
        };

	var user = query_user.get_cached_user() || {};
	var isvip = user.is_weiyun_vip && user.is_weiyun_vip();

    //上传的信息条
    var upload_bar = function (e) {
        this.$process = e.$process;
        this.$process_wrap = e.$process_wrap;
        this.task_name = '传输';
    };
    $.extend(upload_bar.prototype, {
        /**
         * 结果、进度信息展示的地方
         * @returns {jQuery Element}
         */
        get_$process: function () {
            return this.$process;
        },
        /**
         * $process 包装的元素
         * @returns {jQuery Element}
         */
        get_$process_wrap: function () {
            return this.$process_wrap;
        },
        /**
         * 最大剩余时间
         * @returns {number}
         */
        get_max_time: function () {
            return this._max_secs || ( this._max_secs = 24 * 60 * 60);//24小时
        },
        /**
         * 格式化时间格式
         * @param secs
         * @returns {string}
         * @private
         */
        format_time: function (secs) {
            var h = '', m = '' , s = '';
            if (secs < 60) {
                s = secs > 0 ? (secs + "秒") : '';
            } else if (secs > 3600) {
                h = Math.floor(secs / 3600),
                    m = Math.floor((secs - h * 3600) / 60);
                h = h > 0 ? ( h + "小时" ) : '';
                m = m > 0 ? ( (m < 10 ? ('0' + m) : m) + "分" ) : '';
            } else {
                m = Math.floor(secs / 60);
                s = secs % 60;
                m = m > 0 ? (m + "分") : '';
                s = s > 0 ? ( (s < 10 ? ('0' + s) : s) + "秒") : '';
            }
            return h + m + s;
        },
        /**
         * 获取测速对应的cache
         * @returns {*}
         */
        get_cache: function () {
            return Cache.get_up_main_cache();
        },
        get_down_cache: function () {
            return Cache.get_dw_main_cache();
        },
        /**
         * 总大小
         * @returns {number}
         */
        get_total: function () {
            return this.get_cache().get_total_size()+this.get_down_cache().get_total_size();
        },
        /**
         * 已传输大小
         * @returns {number}
         */
        get_passed: function () {
            var cache = this.get_cache(),
                passed = cache.get_passed_size(),
                running = cache.get_curr_upload();
            if (running && running.processed) {
                passed += running.processed;
            }
            return passed;
        },

        get_down_passed: function () {
            try{
                var cache = this.get_down_cache(),
                    passed = cache.get_passed_size(),
                    tasks = cache.get_down_cache();
                if (tasks.length > 0) {
                    for (var key in tasks.length) {
                        if (key !== 'length' && -1 === ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
                            passed += tasks[key].processed;
                        }
                    }
                }
            }catch(e){
                return 0
            }
            return passed;
        },
        /**
         * 是否已经完成
         * @returns {boolean}
         */
        is_done: function () {
            return this.get_cache().is_done() && this.get_down_cache().is_done();
        },
        /**
         * 设置任务剩余时间
         * @param speed
         */
        set_left_time: function (speed) {
            if (speed === -1 || speed === 0) {
                $left_time.hide();
                return;
            }
            var secs = ( (this.get_total() - this.get_passed()-this.get_down_passed()) / speed ) | 0;
            if (secs <= 0 || this.get_max_time() < secs) {
                secs = this.get_max_time();
            }
            $left_time
                .html('剩余' + this.format_time(secs))
                .css('display', 'inline-block');
        },
        /**
         * 设置任务速度
         * @param speed
         */
        set_speed: function (speed, cnSpeed, exSpeed) {
	        var html;
            if (speed > 0) {//运行任务已具备获取速度的必备条件
	            if(cnSpeed && exSpeed) {
		            html = File.get_readability_size(cnSpeed + exSpeed) + '/s<span class="speedup-num">(+' + File.get_readability_size(exSpeed) + '/s)</span>';
	            } else {
	                html = File.get_readability_size(speed) + '/s';
	            }
                $speed.html(html).css('display', 'inline-block');
            } else {
                $speed.hide();
            }
        },
        /**
         * 设置进度信息
         */
        set_process: function () {
            var up_cache = this.get_cache(),
                down_cache =this.get_down_cache();
            if (up_cache.is_done() && down_cache.is_done()) {
                speed_task.stop();//停止计速
                bar_info.when_tasks_end(this.task_name);
                return this.toggle();//隐藏当前条目
            }
            var up_info = up_cache.get_count_nums(),
                down_info =down_cache.get_count_nums(),
                html = '正在传输：' + (up_info.error + up_info.done + 1+down_info.error+down_info.done) + '/'
                    + (up_info.length +down_info.length - up_info.pause - down_info.pause);
            this.get_$process_wrap().parent().removeClass(bar_states.error).removeClass(bar_states.done);
            this.toggle(true, html);
            form_bar.show();
        },
        /**
         * 设置任务完成(没有正在和server交互的任务执行)
         */
        set_done: function () {
            var up_cache = this.get_cache(),
                down_cache =this.get_down_cache(),
                down_info = down_cache.get_count_nums(),
                up_info = up_cache.get_count_nums();
            if (up_info.length +down_info.length === 0) {
                this.toggle();//隐藏当前条目
                return;
            }
            if (up_info.length+down_info.length === up_info.pause +down_info.pause) {//没有任务，直接隐藏
                return this.toggle();
            }
            var tail = up_cache.is_contain_folder() ? '个文件' : '个文件',
                html = (up_info.done+down_info.done) > 0 ? ((up_info.done+down_info.done) + tail + this.task_name + '成功') : '';
            if (up_info.error+down_info.error > 0) {
                var error_text = (html ? '   ' : '') + this.task_name + '失败：' +(up_info.error +down_info.error) + tail + ' '; //失败信息
                if(html == ''){
                    error_text=  (up_info.error +down_info.error) +tail+'传输失败'
                }else{
                    error_text= "，"+ (up_info.error +down_info.error) +'个失败'
                }
                html += error_text;
//                下载时不显示重试     合并后是否不应该在出现重试按钮 ？
//                if (bar_info.can_re_start_error.length > 0 && this.task_name === '上传') {//没有需要重试的直接隐藏
//                    html += text_retry_all;
//                }
            }
            var is_error = (up_info.error +down_info.error) > 0;
            //控制图标
            this.get_$process_wrap().parent()
                .toggleClass(bar_states.done,!is_error)
                .toggleClass(bar_states.error,is_error);

            this.toggle(true,html);

	        //上报log
	        var logData = {
		        report_console_log: true
	        };
	        if(error_text) {
		        logData.error_text = error_text;
	        }
	        logger.report(logData);
        },
        /**
         * 条目的显示与隐藏/填充进度信息/样式操作
         * @param {Boolean} [show] 是否显示
         * @param {String} [html] 条目的文本信息
         */
        toggle: function (show, html) {
            if (!show) {
                this._state = 'hide';
                this.get_$process_wrap().css('display', 'none');
            } else {
                this._state = 'show';
                if (html) {
                    this.get_$process().html(html);//显示任务结果信息
                }
                this.get_$process_wrap()
                    .css('display', 'inline-block');
            }
        },
        /**
         * 当前显示状态是否隐藏
         */
        is_hide: function () {
            return this._state === 'hide';
        },

        /**
         *判断正在运行的任务全部都是打包下载
         */
        is_all_package: function () {
            var me = this;
            if (me.is_done()) {
                return false;
            }
            var tasks = this.get_down_cache().get_cache();
            for (var key in tasks) {
                if (key !== 'length' && ' done error '.indexOf(' ' + tasks[key].state + ' ')) {
                    if (!tasks[key].is_package()) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 清除上一次的html和icon
         */
        destroy: function () {
            $left_time.html('');
            $speed.html('');
            this.get_$process().html('');
        //    this.get_$process_wrap().find('i').hide();
        }
    });

    //form进度条显示与开启
    var form_bar = {
        _$form_bar: null,
        _has_bar: function () {
            return upload_route.type === 'upload_form' && this._$form_bar;
        },
        show: function () {
            if(this._has_bar()) {
                bar_info.upload.get_$process_wrap().parent().addClass('form-mini-progress');
            }
        },
        hide: function () {
            if(this._has_bar()) {
                bar_info.upload.get_$process_wrap().parent().removeClass('form-mini-progress');
            };
        }
    };
    var bar_info = {
        destroy: function () {
            this.upload && this.upload.destroy();
            this.can_re_start_error = {length: 0};
        },
        /**
         * 初始化
         */
        init: function (upload_param, com) {
            this.upload = new upload_bar(upload_param);
            $left_time = com.$left_time;//剩余时间
            //$all_time = com.$all_time;//总耗时  <优化>移除总耗时信息
            $speed = com.$speed;//速度
            form_bar._$form_bar = com.$form_bar;
        },
        /**
         * 满足有另外一个类任务运行时，开始测速
         * @param task_name
         */
        when_tasks_end: function (task_name) {
            var who = this.upload;
            if (!who.is_done() && who.get_cache().get_all_length() > 0) {
                speed_task.start();//重新开始测速
            }
        },
        /**
         * 根据 上传、下载任务种类个数  控制上传、下载条目的显示
         */
        toggle_speed_msg: function () {
            var up_num = Cache.get_up_main_cache().has_task_running(),//有上传任务处于运行状态
                dw_num = Cache.get_dw_main_cache().has_task_running();//有下载任务处于运行状态
            if (up_num + dw_num === 2) {
                if (!hide_whole_info) {//
                    hide_whole_info = true;
                    $left_time.hide();
                    //$all_time.hide();
                    $speed.hide();
                }
            } else {
                hide_whole_info = false;
                (up_num + dw_num) === 0 && !this.upload.is_hide() && this.upload.toggle();//隐藏
                if (up_num === 0 && dw_num === 1 && this.upload.is_all_package()) {
                    hide_whole_info = true;
                    $left_time.hide();
                    //$all_time.hide();
                    $speed.hide();
                }
            }
	        //上传提速的icon tips
	        var view = get_view();
	        if(up_num > 0) {
		        view.showSpeedup();
	        } else {
		        //非appbox长驻开通会员入口，如果是会员就不用显示了
		        if(constants.IS_APPBOX || isvip) {
			        view.hideSpeedup();
		        } else {
			        view.showExperience();//上传时显示体验入口
		        }
	        }
        },
        OPS: {
            DOWN_SPEED: 1,//更新下载速度
            UP_SPEED: 2,//更新上载速度
            DOWN_CHECK: 3,//检查下载进度
            UP_CHECK: 4//检查上载进度
        },
        process_states: {//可进行 更新进度信息的状态
            'init': 1,
            'start_upload': 1,
            'to_continuee': 1,
            'continuee': 1,
            'to_resume_continuee': 1,
            'start': 1,
            'error': 1,
            're_start': 1,
            'clear': 1,
            'done': 1,
            'pause': 1,
            'resume_pause': 1,
            'resume_continuee': 1
        },
        can_re_start_error: {length: 0}, //用于任务完成后，判断是否显示 "全部重试"
        check_error: function (task) {
            var list = this.can_re_start_error,
                id = task.del_local_id,
                state = task.state;
            if (state === 'error') {
                if (!list[id]) {
                    if (task.can_re_start()) {
                        list[id] = id;
                        list.length += 1;
                    }
                }
            } else if (-1 !== ' re_start clear '.indexOf(' ' + state + ' ')) {
                if (list[id]) {
                    delete list[id];
                    list.length -= 1;
                    if (list.length === 0) {
                        var a_tag = this.upload.$process.find('a');
                        if (a_tag.length > 0) {
                            a_tag.hide();
                        }
                    }
                }
            }
        },
        /**
         * 所有任务是否已经完成（没有正在上传、下载任务在执行）
         * @returns {*}
         */
        is_done: function () {
            return this._is_done;
        },
        /**
         * 全部完成
         */
        finished: function () {
            var me = this,
                view = get_view();
            view.set_end_btn_style(true, Cache.get_close_btn_text());//设置按钮的样式和文本

            /*$all_time
                .html("总耗时" + me.upload.format_time(Math.ceil(( view.upload_end_time() - view.upload_start_time() ) / 1000)))
                .css('display', 'inline-block');//总耗时*/
            $left_time.hide();//隐藏剩余时间
            $speed.hide();//隐藏速度
	        //非appbox长驻开通会员入口，如果是会员就不用显示了
	        if(constants.IS_APPBOX || isvip) {
		        view.hideSpeedup();//隐藏上传提速icon tips
	        } else {
		        view.hideExperience();//隐藏体验入口，只在上传时显示
	        }
            speed_task.stop();//停止计速
            me.upload.set_done();//更新传输条目显示的完成信息
            form_bar.hide();//隐藏form上传条
            me._is_done = true;//标识完成
            //yuyanghe todo   修改了传输效果的提示信息
            //显示暂停提示重新开始续传的消息
            var counts = me.upload.get_cache().get_count_nums();
            var d_counts = me.upload.get_down_cache().get_count_nums();

            if ((counts.length > 0 && counts.pause > 0)|| (d_counts.length > 0 && d_counts.pause > 0) ) {
                var _num = counts.pause+d_counts.pause;
                me.upload.toggle(true);
                if (_num) { //只要有暂停的就进来
                    if(d_counts.pause && counts.pause==0){ //只有下载暂停
                        me.upload.get_$process().html(d_counts.pause+'个下载任务已暂停');
                    }
                    else if(counts.pause && d_counts.pause==0){ //只有上传暂停
                        me.upload.get_$process().html(text_resume.replace('{num}', counts.pause));
                    }
                    else if(counts.pause && d_counts.pause){ //上传，下载都有暂停
                        me.upload.get_$process().html(d_counts.pause+'个下载任务已暂停，'+text_resume.replace('{num}', counts.pause));
                    }
                    //去掉错误图标
                    me.upload.get_$process_wrap().parent()
                        .toggleClass(bar_states.error, false);
                } else {
                    me.upload.get_$process().html(me.upload.get_$process().html() + "，" + text_resume.replace('{num}', _num));
                }
            } else {
                me.upload.get_$process().html(me.upload.get_$process().html() + "！");
            }

            // for 读屏软件，使用alert - james
            me.tip_for_scr_reader();

            //temporary_upload.upload_if();//如果有文件上传失败（流量或单文件大小限制）则尝试上传到中转站
        },
        /**
         * 任务管理器中的任务已完成(上传、下载，其中的暂停/出错不计算在内)
         */
        is_finished: function () {
            return this.upload.is_done();
        },
        /**
         * 更新bar的相关信息
         * @param type
         * @param speed
         */
        update: function (type, speed, cnSpeed, exSpeed) {
            var me = this,
                ops = me.OPS;
            if (me._is_done) {//之前完成过一次，隐藏耗时
                //$all_time.html('').hide();//总耗时
                get_view().set_end_btn_style(true, Cache.get_close_btn_text());
            }
            me._is_done = false;//任务完成标志
            switch (type) {
                case(ops.UP_SPEED)://更新上传速度
                    if (!hide_whole_info) {
                        me.upload.set_speed(speed, cnSpeed, exSpeed);
                        me.upload.set_left_time(speed);
                    }
                    break;
                case(ops.DOWN_SPEED)://更新下载速度
                    if (!hide_whole_info) {
                        me.upload.set_speed(speed);
                        me.upload.set_left_time(speed);
                    }
                    break;
                case(ops.DOWN_CHECK)://下载状态变换更新
                    me.upload.set_process();
                    if (me.is_finished()) {
                        me.finished();
                    } else {
                        me.toggle_speed_msg();
                    }
                    break;
                case(ops.UP_CHECK)://上传状态变换更新
                    me.upload.set_process();
                    if (me.upload.is_done()) {
                        get_view().refresh_space_info();//上传任务完成时，刷新容量
                    }
                    if (me.is_finished()) {
                        me.finished();
                    }
                    break;
            }
        },

        /**
         * for 读屏软件，使用alert - james
         */
        tip_for_scr_reader: function () {
            if (scr_reader_mode.is_enable()) {
                var has_ok, has_err,
                    ok_list = [],
                    err_list = [];
                // console.log('this.upload.get_cache()', this.upload.get_cache());
                this.upload.get_cache().each(function () {
                    if (!this.__aria_alerted) {
                        if (this.state === 'error') {
                            err_list.push((err_list.length + 1) + '、' + this.file_name + '，原因：' + Static.get_error_msg(this.code));
                            this.__aria_alerted = 1;
                        } else if (this.state === 'done') {
                            ok_list.push((err_list.length + 1) + '、' + this.file_name);
                            this.__aria_alerted = 1;
                        }
                    }
                });
                var tip;
                if (has_ok = !!ok_list.length) {
                    tip = ok_list.length + '个文件上传成功；';
                }
                if (has_err = !!err_list.length) {
                    tip = err_list.length + '个文件上传失败。';
                }
                if (tip) {
                    tip = [
                        '上传进度结束。',
                        tip,
                        has_ok ? '成功的文件如下：\n' + ok_list.join('\n') : '',
                        has_err ? '失败的文件如下：\n' + err_list.join('\n') : ''
                    ].join('\n');
                    alert(tip);
                }
            }
        }
    };
    return bar_info;
});