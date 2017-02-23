/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-1
 * Time: 下午3:53
 */
define(function (require, exports, module) {
    var console = require('lib').get('./console'),
        common = require('common'),
        $ = require('$'),

        upload_event = common.get('./global.global_event').namespace('upload2'),
        widgets = common.get('./ui.widgets'),
        functional = common.get('./util.functional'),
	    request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),

        Cache = require('./tool.upload_cache'),
        speed_task = require('./speed.speed_task'),
        msg = require('./msg'),
        disk_mod = require('disk'),
        disk = disk_mod.get('./disk'),
        file_list = disk_mod.get('./file_list.file_list'),

        view,//视图模块
        get_view = function () {
            return view || (view = require('./view'));
        },
        bar_info,//
        get_bar_info = function () {
            return bar_info || (bar_info = require('./tool.bar_info'));
        };

    var Static = {
        FILE_TYPE: 1,//文件标识
        FOLDER_TYPE: 2,//文件夹标识
        OP_TYPES: {
            DOWN: 1,//下载
            UPLOAD: 2//上传
        },
        /**
         * 能暂定上传的状态
         */
        _can_stop_states: { 'start': 1, 'upload_file_update_process': 1, 'file_sign_update_process': 1, 'file_sign_done': 1, 'continuee': 1 },
        /**
         * 能继续传的状态
         */
        _can_resume_states: {'upload_file_update_process': 1, 'pause': 1, 'resume_pause': 1, 'processing': 1},
        /**
         * 获取错误提示消息
         * @param code
         * @param msg_type
         * @param error_type
         * @param error_step 控件错误的调试位置
         * @returns {*}
         */
        get_error_msg: function (code, msg_type, error_type, error_step, err_msg) {
            return msg.get(error_type || 'upload_error', code, msg_type, error_step, err_msg);
        },
        /**
         * 停止上传
         * @param cache_key cache的对应的key
         */
        stop_upload_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_cache_key).get_cache();
            for (var key in cache) {
                if (this._can_stop_states[cache[key].state]) {
                    cache[key].stop_upload(true);
                }
            }
        },
        /**
         * 停止下载
         * @param cache_key cache的对应的key
         */
        stop_down_all: function (cache_key) {
            var cache = Cache.get(cache_key || Cache.default_down_cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length') {
                    cache[key].remove_file();
                }
            }
        },
        /**
         * 清理删除文件
         */
        remove_all: function (cache_key) {
            var cache = Cache.get(cache_key).get_cache();
            for (var key in cache) {
                if (key !== 'length') {
                    if (cache[key].state !== 'done') {
                        cache[key].remove_file();
                    }
                    cache[key].view.invoke_state('clear');
                    //cache[key].view.clear();
                }
            }
        },
        /**
         * 清除指定cache_key的上传任务
         * @param cache_key
         */
        clear_upload_all: function (cache_key) {
            Static.stop_upload_all(cache_key);//停止上传
            Static.remove_all(cache_key);//删除文件
            Cache.clear(cache_key);//清理cache
        },
        /**
         * 清除指定cache_key的下载任务
         * @param cache_key
         */
        clear_down_all: function (cache_key) {
            Static.stop_down_all(cache_key);//停止上传
            Cache.clear(cache_key);//清理cache
        },
        /**
         * 获取关闭提示
         * @returns {{num: number, text: string}}
         * @private
         */
        _get_close_info: function () {
            var num = 0,
                text = '',
                up_counts = Cache.get_up_main_cache().get_count_nums(),
                dw_counts = Cache.get_dw_main_cache().get_count_nums();
            if (up_counts.length > up_counts.done + up_counts.error) {
                num += 1;
            }
            if (dw_counts.length > dw_counts.done + dw_counts.error) {
                num += 2;
            }
            if (num > 0) {
                text = num === 1 ? '未上传完成' : (num === 2 ? '未下载完成' : '未上传和下载完成');
            }
            return {'num': num, 'text': text};
        },
        dom_events: {
            click_to_max: function () {
                get_view().max();
            },
            click_to_min: function () {
                get_view().min();
            },
            /**
             * 点击“清除全部”
             * @param {Boolean} by_user 是否是由用户触发
             */
            click_clear_all: function (by_user) {
                var tip_info = Static._get_close_info(),
                    sure_fn = function () {
                        Static.clear_upload_all(Cache.default_cache_key);
                        Static.clear_down_all(Cache.default_down_cache_key);
                        get_view().hide();//关闭视图
                        get_view().clear();
                        speed_task.stop();//停止测速度
                        get_bar_info().destroy();
                        Static.disk_route.prepend_left();
                    },
                    fail_fn = function () {//权宜之计，点取消，任务管理器不进行最小化
                        get_view().max();
                    };
                if (tip_info.num !== 0) {
                    widgets.confirm('全部取消', "列表中有" + tip_info.text + "的文件，确定要取消吗？", '', sure_fn, fail_fn, ['是', '否']);
                } else {
                    sure_fn();
                }
                if (!by_user) {//非用户手动点击，返回false，用于阻断日志上报
                    return false;
                }
            }
        },
        /**
         * 暂停状态转换为续传状态
         * @param ary
         * @param state
         */
        batch_pause_to_run: function (ary, state) {
            if (!ary.length)
                return;
            //第一个任务，需要判断是否可以执行
            var waiter = ary[0],
                runner = waiter.get_curr_upload();
            waiter.minus_info('pause'); //减掉自身添加的暂停数
            if (waiter.get_curr_cache().length === 0) {//进入执行队列
                waiter.change_state('to_' + state);
                //waiter.view.change_state(state);//更新UI
                waiter.events.nex_task.call(waiter);
            } else {
                waiter.change_state('to_' + state);
                //waiter.view.wait();//更新UI
                waiter.view.invoke_state('wait');
                if (!!runner && runner.can_pause_self()) {//当前任务可暂停，则立刻暂停
                    runner.change_state('pause');
                }
            }

            if (ary.length > 1) {//有多个任务同时进行时，分别进入预运行状态
                setTimeout(function () {//加定时器，是因为 nex_task是通过setTimeout(xx,0)调用的
                    //除第一个外，其余放到等待队列
                    for (var i = ary.length - 1; i > 0; i--) {
                        ary[i].minus_info('pause');//减掉自身添加的暂停数
                        ary[i].change_state('to_' + state);//任务进入预执行状态
                        //ary[i].view.wait();//等待UI
                        waiter.view.invoke_state('wait');
                    }
                }, 10);
            }
        },
        /**
         * @param state_name
         * @param state_fn
         */
        add_state: function (state_name, state_fn) {
            this.interface('states.' + state_name, state_fn);
        },
        /**
         *
         * @param event_name
         * @param event_fn
         */
        add_events: function (event_name, event_fn) {
            this.interface('events.' + event_name, event_fn);
        },
        /**
         * 批量重试任务
         * @param ary
         * @param cache_key
         */
        batch_re_start: function (ary, cache_key) {
            if (ary.length) {
                var queue = Cache.get(cache_key).get_queue();
                //for (var i = 0, j = ary.length; i < j; i++) {
                //重试的顺序改成从前往后
                for (var i = ary.length-1, j = 0; i >= j; i--) {
                    //延后执行
                    queue.head(ary[i], function () {
                        this.events.re_start.call(this, true);//用户点击重试
                    });
                    ary[i].minus_info('error');//错误减1
                    ary[i].view.invoke_state('wait');//将队列中所有对象的 view改为等待状态；
                    //ary[i].view.wait();//将队列中所有对象的 view改为等待状态；
                }
                var waiter = ary[0],
                    running = waiter.get_curr_upload(),
                    space = waiter.get_curr_cache().length;
                if (space === 0) {
                    return waiter.events.nex_task.call(waiter);
                } else {
                    if (running) {
                        if (running.can_pause_self()) {
                            //暂停运行者
                            return running.change_state('pause');
                        }
                    }
                    //继续等待
                }
            }
        },
        /**
         * 能否执行续传
         * @param state
         * @returns {boolean}
         */
        can_resume: function (state) {
            return this._can_resume_states[state];
        },
        /**
         * 关闭页面时，当前上传对象时否可被保存进度（只有控件可以保存，其它丢失了文件句柄，无法续传，控件是可以根据文件路径来读取文件的所以可以）
         */
        can_resume_upload_obj: function(upload_obj) {
            if(upload_obj.upload_type === 'active_plugin' || upload_obj.upload_type === 'webkit_plugin') {
                return true;
            }
            return false;
        },
        /**
         * 当页面关闭，本地保存上传/下载进度，用于续传
         */
        store_upload_down_progress: function () {
            var resume_files = {'tasks': [], 'folder_tasks': [], 'down_tasks': []},
                me = this;
            //上传
            Cache.get_up_main_cache().each(function () {
                if (me.can_resume(this.state) && me.can_resume_upload_obj(this)) {
                    var unit = this.get_resume_param();
                    if (unit) {
                        if (this.file_type === me.FOLDER_TYPE) {//文件夹
                            resume_files.folder_tasks.push(unit);
                        } else {
                            resume_files.tasks.push(unit);
                        }
                    }
                }
            });
            upload_event.trigger('set_resume_store', resume_files);
        },
        /**
         * 获取关闭页面时的提示
         * @param cache_key
         */
        get_page_unload_confirm: function (cache_key) {
            var tip_info = Static._get_close_info();
            return tip_info.num!==0 ? '您有'+tip_info.text+'的文件, 确定要关闭微云吗？' : undefined;
        },
        /**
         * 点击 全部重试（错误的任务，可重试时）
         */
        click_re_try_all: function () {
            var view = get_view();
            view.max();
            view.upload_box.scrollTop(view.upload_files.height());
            var er_list = [];
            view.upload_files
                .find('li.error')
                .appendTo(view.upload_files)
                .each(function () {
                    var task = view.get_task($(this).attr('v_id'));
                    if (task.can_re_start()) {
                        er_list.push(task);
                    }
                });
            this.batch_re_start(er_list);
        },
        /**
         * 点击 全部续传（被暂停的任务）
         */
        click_resume: function () {
            var pause = [],
                resume_pause = [];
            Cache.get_up_main_cache().each(function () {
                if (this.state === 'pause')
                    pause.push(this);
                else if (this.state === 'resume_pause')
                    resume_pause.push(this);
            });
            this.batch_pause_to_run(pause, 'continuee');
            this.batch_pause_to_run(resume_pause, 'resume_continuee');
        },
        /**
         * 网盘路由
         */
        disk_route: {
            _stack: [],
            _max_stack_dept: 3,//最大缓存深度
            _max_depart_time: 4000,//最大插入时间间隔
            _real_prepend: function(){
                var me = Static.disk_route,
                    stack = me._stack,
                    len = me._stack.length,
                    cache = {};
                me._last_prepend_time = +new Date();
                for (var i = 0 ; i < len; i++) {
                    var node = stack.shift();
                    if (!cache[node.pdir]) {
                        cache[node.pdir] = [];
                    }
                    cache[node.pdir].push(node);
                }
                for (var pdir in cache) {
                    cache[pdir].reverse();
                    try {
                        file_list.prepend_nodes(cache[pdir], true, pdir);//按父目录批量插入
                    } catch (xe) {
                        console.warn('disk_route prepend: file_list.prepend_nodes : ', xe);
                    }
                }
                me._last_cost = +new Date() - me._last_prepend_time;
                Static.cpu.set_immediate_time(me._last_cost , true);
                Static.cpu.disable_proxy();
            },
             /**
             * 批量插入
             * @private
             */
            _prepend: function () {
                 var me = this;
                 Static.cpu.set_immediate_time( me._last_cost ? me._last_cost : 32 );
                 Static.cpu.able_proxy();
                 setTimeout( me._real_prepend  ,0);
            },
            /**
             * 是否满足可以插入的条件
             * @returns {boolean}
             * @private
             */
            _can_prepend: function(){
                var me = this,
                    len = me._stack.length;
                if(!len){
                    return false;
                }
                if(!me._last_prepend_time//第一次
                    ||
                  ((+new Date() - me._last_prepend_time) > me._max_depart_time)//超过最大插入时间间隔
                    ||
                    len > me._max_stack_dept//已经达到最大缓存深度
                    ||
                  Cache.get_up_main_cache().is_done()//上传已经完成
                ){
                    return true;
                }
                return false;
            },
            /**
             * 上传成功后节点批量插入网盘 (原因：大批量文件单个插入，有性能问题)
             * @param node
             */
            prepend: function (node) {
                this._stack.push(node);
                if(this._can_prepend()){
                    this._prepend();
                } else {
                    Static.cpu.disable_proxy();
                }
            },
            /**
             * 插入剩下的node节点
             */
            prepend_left: function(){
                if(this._stack.length>0){
                    this._prepend();
                }
                this._last_prepend_time = null;
            }
        },
        /**
         * cpu信息
         */
        cpu: {
            _min: 4,//最小中断时间
            _max: 3200,//最大中断时间
            _inter_time: 16,//中断时间
            /**
             * 设置 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @param {int} time
             * @param {boolean} [done_hard_task] 完成了困难的任务
             */
            set_immediate_time: function (time , done_hard_task) {
                if(time >= this._max){//扩大_max的时间
                    this._max = this.time > 5000 ? 5000 : this.time;
                    console.debug('expend:',this._max);
                }

                if ( time <= this._min ) {//输出最大中断时间
                    this._inter_time = this._min;
                } else {
                    this._inter_time = (time > this._max) ? this._max : time ;
                }

                if(done_hard_task){//完成了困难任务后，执行剩下的任务
                    if(!this._proxy_fn)
                        return;
                    var me = this;
                    setTimeout(function(){
                        me._proxy_fn.call();
                        me._proxy_fn = null;
                    },16);
                }
            },
            /**
             * 获取 "脱离了当前函数调用堆栈，尽快让指定的任务执行" 的等待时间
             * @returns {number}
             */
            get_immediate_time: function () {
                return this._inter_time;
            },
            able_proxy: function(){
                this._proxy_albe = true;
            },
            disable_proxy: function(){
                this._proxy_albe = false;
            },
            is_proxy_able: function(fn){
                if( this._proxy_albe && this._inter_time > 100 ){
                    this._proxy_fn = fn;
                    return true;
                }
            }
        },
	    /**
	     * 非会员查询极速上传体验券
	     * @returns {String}
	     */
	    get_coupon_info: function() {
		    var defer = $.Deferred();

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
			    cmd: 'DiskUserConfigGet',
			    cavil: false,
			    pb_v2: true,
			    header: { appid: 30013 },
			    body: {
				    get_coupon: true
			    }
		    }).done(function(msg, ret, body, header) {
			    if(ret == 0 && body && body.coupon_info) {
				    defer.resolve(body.coupon_info);
			    } else {
				    defer.reject(null);
			    }
		    }).fail(function() {
			    defer.reject(null);
		    });

		    return defer;
	    }
    };

    return Static;
});