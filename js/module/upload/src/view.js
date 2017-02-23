/**
 * 上传控件UI
 * 改造思路 拆分：
 *      1：区分方法类型 静态，原型（状态类，工具类）,$dom方法 (已完成)
 *      2：缩短调用原型链接(todo)
 * @author svenzeng
 * @date 13-3-1
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('upload_view'),
        text = lib.get('./text'),

        functional = common.get('./util.functional'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        file_type_map = common.get('./file.file_type_map'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        File = common.get('./file.file_object'),

        space_info = require('main').get('./space_info.space_info'),

        upload_route = require('./upload_route'),
        tmpl = require('./tmpl'),
        upload_tips = require('./upload_tips'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        event = require('./event'),
        bar_info,

        $body = $(document.body),
        ie6 = $.browser.msie && $.browser.version < 7,
        lt_ie9 = $.browser.msie && $.browser.version < 9, //ie6,7,8
        position = ( ie6 ? 'absolute' : 'fixed'),

        dom_cache = {length: 0},//view instance ，映射 upload_obj对象的集合; 加上这一层用于 分开 dom对象 和 内存对象

        make_wrap = function(){
            return {//性能优化 面板中的wrap对象
                _wrap_id_prefix: 'upload_row_wrap_', //管理器中，列的包装对象ID前缀
                _visable_index: 1,//当前可见索引ID
                set_visable_index:function(index){//设置可见索引ID
                    this._visable_index = index;
                },
                get_visable_index:function(){//获取可见索引ID
                    return this._visable_index;
                },
                batch: 30,//每个显示区域显示的总数
                current: 0//当前最大显示区域索引ID
            };
        },
        instance_wrap = make_wrap(),

        row_id_prefix = 'upload_row_',//管理器中，列ID前缀
        G4 = Math.pow(2, 30) * 4,

        default_height = 41,//默认行高
        error_height = 53,//出错时的行高

	    experienceDuration = 30;//极速上传体验时间
    require.async(constants.IS_APPBOX ? 'appbox_upbox_css' : 'upbox_css');//加载样式
    if( !constants.IS_APPBOX ){//web才有控件安装样式
        require.async('upload_install_css');//加载控件安装样式  该样式依赖upbox_css 因此必须再它之后加载
    }

    // 文本长度略缩计算相关
    var measurer, separator_width, ellipsis_width;

    var view = new Module('upload2_view', {
        /**
         * IE6使用position absolute定位 ，需要重置窗口位置
         */
        on_window_scroll: function () {
            if (this._is_show && ie6) {
                var height = this.$dom.height(),
                    real_top = ( this._win_visable_height + $(window).scrollTop() - height ) - 3;
                this.$dom.css('top', (real_top + 'px'));
                // 当有影响定位的情况发生时，关掉浮动TIP
                this.hide_float_tips();
            }
        },
        // 现在的方法定义有些问题，下面定义的hide_float_tips在第一次render时还没添加上
        hide_float_tips: $.noop,
        /**
         * 窗口重置时，修改可见高度，并触发视图的窗口滚动处理
         */
        on_window_resize: function () {
            this._win_visable_height = window.innerHeight && !$.browser.msie ? window.innerHeight : document.documentElement.clientHeight;//可视高度
            this.on_window_scroll();
            this.hide_float_tips();
        },
        /**
         * 上传管理器最大化
         */
        max: function () {
            this._is_max = true;
            this.switch_upbox_btn.attr('data-action', 'click_to_min');
            this.$dom.removeClass('upbox-mini').repaint(); //修复：大批量文件上传在IE10下，最大化显示，会出现1S左右的（时间长短和$dom内样式发生变化的时间一致）样式错乱
            this.on_window_scroll();
            this.on_done_reset_scroll(0,true);
            if(!bar_info.is_done()){
                this.on_box_change_scroll(true);
            }
        },
        /**
         * 上传管理器最小化
         */
        min: function () {
            if(this._is_max===false){//避免重复调用
                return;
            }
            this._is_max = false;
            this.switch_upbox_btn.attr('data-action', 'click_to_max');
            this.$dom.addClass('upbox-mini');
            this.on_window_scroll();
        },
        clear: function(){
            instance_wrap = make_wrap();
            view.upload_files.empty();
            view.upbox_tips.removeClass('upbox-video-err').hide()[0].has_show_tips = false;
        },
        render: function () {
            var me = this;
            me.$dom = $(tmpl.body()).appendTo($body);//上传主面板
            me.min_box = me.$dom.find('.box-head');// mini对象
            me.switch_upbox_btn = me.$dom.find('.upbox-btn-min');//折叠按钮
            me.upload_files = me.$dom.find('ul[data-content]');//上传文件的容器
            me.upload_box = me.upload_files.parent();
            me.upload_process = me.$dom.find('[data-upload="up_process"]');//上传进度
            me.dw_process = me.$dom.find('[data-upload="dw_process"]');//上传进度
            me.$all_time = me.$dom.find('[data-upload="all_time"]');
            me.$form_bar = me.$dom.find('div.form-mini-progress').hide();//form上传的进度条
	        //极速上传相关ui
	        me.speedup = me.$dom.find('.upbox-speedup').show();//极速上传信息
	        me.speedup_novip = me.$dom.find('.novip-inner');//非会员显示的信息
	        me.speedup_active = me.$dom.find('.vip-inner');//“加速中”外显
	        me.speedup_vip = me.$dom.find('[data-upload="speedup_vip"]');//开通会员
	        me.speedup_try = me.$dom.find('[data-upload="speedup_try"]');//试用极速上传
	        me.speedup_remain = me.speedup_active.find('.speedup-try-num');//体验倒计时

	        //支持极速上传的浏览器，非会员显示引导信息
	        var user = query_user.get_cached_user() || {};
	        if (upload_route.type === 'upload_html5_pro' && user.is_weiyun_vip && !user.is_weiyun_vip()) {
		        upload_static.get_coupon_info().done(function (result) {
			        //有体验券就显示试用入口
			        console.log('upload_html5_pro coupon count: ' + result.coupon_count + (result.experience_duration ? (', experience_duration: ' + result.experience_duration) : ''));
			        if(result.experience_duration) {
				        experienceDuration = result.experience_duration;
			        }
			        //初始化时不显示入口，所以默认隐藏
			        me.can_experience = false;
			        //非appbox长驻开通会员入口
			        if(!constants.IS_APPBOX) {
				        me.showSpeedup();
			        }
			        //有体验券时，变更me.can_experience的状态
			        if(result.coupon_count > 0) {
				        me.can_experience = true;
				        setTimeout(function() {
					        window.pvClickSend && window.pvClickSend('weiyun.speedup.try.display');
				        }, 1000);
			        }
			        setTimeout(function() {
				        window.pvClickSend && window.pvClickSend('weiyun.speedup.vip.display');
			        }, 1000);
		        }).fail(function() {});
	        } else {
		        console.log('upload_html5_pro hide entrance, upload_route.type: ' + upload_route.type + ', is_weiyun_vip: ' + (user.is_weiyun_vip ? !!user.is_weiyun_vip() : 'no function'));
	        }

	        (bar_info = require('./tool.bar_info')).init(
                {//上传信息条构造参数
                    '$process': me.upload_process,
                    '$process_wrap': me.upload_process.parent()
                },
                {//总时间，总速度
                    '$left_time': me.$dom.find('[data-upload="left_time"]'),//剩余时间
                    '$all_time': me.$all_time,//耗时
                    '$speed': me.$dom.find('[data-upload="speed"]'),//速度
                    '$form_bar': me.$form_bar
                }
            );
            me.clear_all_btn = me.$dom.find('.g-btn');//全部清除按钮
            me.upbox_tips = me.$dom.find('.upbox-tips');//错误提示信息条

            event.init.call(me);
            me.$dom.css('position', position);
            me.min();//初始化为最小状态
            if (constants.IS_APPBOX) {
                me.clear_all_btn.attr('href', 'javascript:void(0)');
            }
            // 计算
            measurer = text.create_measurer(me.upbox_tips);
            separator_width = measurer.measure('\\').width;
            ellipsis_width = measurer.measure('...').width;
        }
    });

    view.render();

    /**
     * 静态方法
     */
    $.extend(view, {
        /**
         * 上传管理器，当前列表的长度   called by public_tip
         */
        length: function () {
            return upload_cache.get_up_main_cache().get_all_length() + upload_cache.get_dw_main_cache().get_all_length();
        },
        /**
         * @param time  0: 上传时间归零； 存在的时间：上传时间设置为这个时间； 不存在的数据，并且不为0：返回上传时间
         */
        upload_start_time: function (time) {
            if (time === 0) {
                this._upload_start_time = 0; //归零
            } else if (time) {
                this._upload_start_time = time;//设置上传开始时间
            } else {
                return this._upload_start_time;//返回上传开始时间
            }
        },
        /**
         * @param clear
         */
        upload_end_time: function (clear) {
            if (clear) {
                this._upload_end_time = 0; //归零
            } else {
                return this._upload_end_time || (this._upload_end_time = +new Date());//返回结束开始时间
            }
        },
        /**
         * 显示上传列表
         */
        show: function () {   //强制显示
            var me = this;
            if (me._is_show)
                return;

            me.upload_start_time(+new Date());//设置上传开始时间
            me._is_show = true;

            me.on_window_resize();//重置上传管理器位置
            me.listenTo(global_event, 'window_resize', me.on_window_resize)//窗口resize时，设置上传管理器的定位位置
                .listenTo(global_event, 'window_scroll', me.on_window_scroll);//滚动时，设置上传管理器的定位位置

            if (upload_route.type === 'upload_form') {//form上传，UI不同
                me.$dom.addClass("upbox-form");
            }

            //code by bondli IE9以下的为收拢展开地方的A标签增加href属性
            if (constants.IS_APPBOX) {
                me.switch_upbox_btn.attr('href', 'javascript:void(0)');
            } else if (lt_ie9) {
                me.switch_upbox_btn.attr('href', '#');
            }

            me.$dom.show();
        },
        /**
         * 上传管理器完全关闭，包括mini窗口，主窗口
         */
        hide: function () {
            var me = this;
            me._is_show = false;
            dom_cache = {length: 0};//删除视图中对dom的引用
            me.upload_files.empty();//清空dom
            me.upbox_tips.removeClass('upbox-video-err').hide()[0].has_show_tips = false;
            me.upload_start_time(0);//上传开始时间置为0；
            me.off(global_event, 'window_resize').off(global_event, 'window_scroll');
            me.refresh_space_info();//刷新网盘空间大小
            me.min();//关闭上传管理器之前，将其最小化
            me.$dom.hide();
        },
	    /**
	     * 显示极速体验入口
	     */
	    showExperience: function () {
		    if(this.can_experience) {
			    this.speedup_try.css('visibility', 'visible');
		    }
	    },
	    /**
	     * 隐藏极速体验入口
	     */
	    hideExperience: function (can_experience) {
		    if(typeof can_experience !== 'undefined') {
			    this.can_experience = can_experience;
		    }
		    this.speedup_try.css('visibility', 'hidden');
	    },
	    /**
	     * 显示极速上传icon tips
	     * onlyChange: 只改变内部的ui显示状态，不变更容器的显示，容器由bar_info控制
	     */
	    showSpeedup: function(onlyChange) {
		    var me = this;
		    var user = query_user.get_cached_user() || {};
		    var curr_upload = upload_cache.get_curr_real_upload && upload_cache.get_curr_real_upload();
		    var is_webkit_plugin = curr_upload ? curr_upload.upload_plugin ? curr_upload.upload_plugin.__type === 'webkit_plugin' : false : false;
		    //必须是极速上传，并且不是appbox的拖曳上传才显示icon
		    //appbox虽然加载的是极速上传控件，但拖曳上传用的还是webkit_plugin
		    if(upload_route.type === 'upload_html5_pro' && !is_webkit_plugin) {
			    if(user.is_weiyun_vip && user.is_weiyun_vip()) {
				    me.speedup_active.removeClass('try').addClass('vip');
				    me.speedup_novip.hide();
				    me.speedup_active.show();
			    } else if(me.experience) {
				    me.speedup_active.removeClass('vip').addClass('try');
				    me.speedup_novip.hide();
				    me.speedup_active.show();
			    } else {
				    me.speedup_active.hide();
				    me.speedup_novip.show();
			    }
			    if(!onlyChange) {
				    if(me.can_experience) {
					    me.speedup_try.css('visibility', 'visible');
				    } else {
					    me.speedup_try.css('visibility', 'hidden');
				    }
				    me.speedup.show();
			    }
		    }
	    },
	    /**
	     * 隐藏极速上传icon tips
	     */
	    hideSpeedup: function () {
		    var me = this;
		    me.speedup_active.hide();
		    me.speedup_novip.hide();
		    me.speedup.hide();
	    },
	    /**
	     * 极速上传体验倒计时
	     */
	    remainSpeedup: function () {
		    var defer = $.Deferred();
		    var me = this;
			var remain = experienceDuration;
		    me.speedup_remain.html(remain);
		    me.experience = true;
		    me.showSpeedup(true);
		    me.experienceInterval = setInterval(function() {
				if(remain > 0) {
					remain--;
					me.speedup_remain.html(remain);
				} else {
					me.experience = false;
					me.showSpeedup(true);//显示非加速时的引导信息
					clearInterval(me.experienceInterval);
					defer.resolve();
				}
		    }, 1000);

		    return defer;
	    },
	    /**
	     * 清除倒计时
	     */
	    remainClear: function () {
		    var me = this;
		    clearInterval(me.experienceInterval);
		    me.experience = false;
		    me.showSpeedup(true);//显示非加速时的引导信息
	    },
        /**
         * 设置 完成按钮 样式
         * @param is_done
         * @param text
         */
        set_end_btn_style: function (is_done, text) {
            if (!is_done) {
                view.$all_time.hide();
            }

            view.clear_all_btn.html(text).removeClass('g-btn-blue').removeClass('g-btn-gray').addClass(text === '<span class="btn-inner">完成</span>' ? 'g-btn-blue' :
                'g-btn-gray');
        },
        /**
         * 获取上传对象
         * @param v_id
         * @returns {*}
         */
        get_upload_obj: function (v_id) {
            return dom_cache[ v_id ] && dom_cache[ v_id ].upload_obj;
        },
        /**
         * 获取上传对象
         * @param v_id
         * @returns {*}
         */
        get_task: function (v_id) {
            return dom_cache[ v_id ] && dom_cache[ v_id ].task;
        },
        /**
         * 截取文件名显示
         * @param file_name
         * @returns {*}
         */
        //全中文16 英文36 - 218px
        revise_file_name: function (file_name) {//todo
            // file_name
            return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
        },
        // 精确版的文本裁剪，但不适用于数据量过大的情况，因为用到Dom来计算大小。
//        compact_file_name : function(file_name){
//            var tail_length = 13, pixel_width = 260;
//            var tail = file_name.slice(-tail_length),
//                file = file_name.slice(0, -tail_length);
//            return measurer.ellipsis(file, (pixel_width - measurer.measure(tail).width)) + tail;
//        },
        // 
        compact_file_path: function (path) {
            // 示例路径： F:\tmp\测试一个名字很长很长的目录\看看它在地址栏如何处理的，特别是当完全无法显示全的时候\testwwwwwwwwwwwwwwwwwwwww.txt
            // 保留盘符，保留后缀（最后7字符？）
            var separator = '\\';
            var paths = path.split(separator);
            var disk = paths[0], file = paths[paths.length - 1];
            var tail = file.slice(-8);
            file = file.slice(0, -8);
            return disk + separator +
                text.compact_paths(paths.slice(1, paths.length - 1).concat(file), {
                    totalWidth: 270 - measurer.measure(disk + separator + separator + tail).width,
                    keepFirstDirectoryNum: 1,
                    keepLastDirectoryNum: 2,
                    ellipsisPathWidth: 70,
                    separatorWidth: separator_width,
                    hidePathWidth: ellipsis_width
                }, measurer).join(separator) +
                tail;
        },
        cur_start_vid: 1,//当前正在执行的任务vid
        /**
         * 上传完一个文件后，重置滚动条位置
         * @param {int} [v_id]
         * @param {boolean} [force] 强制定位
         */
        on_done_reset_scroll: function (v_id,force) {
            var me = this,
                v_id = v_id || me.cur_start_vid;
            if(bar_info.is_done()){
                return;
            }
            if ( force || ( !event.is_on_the_panel() && this._is_max && v_id ) ) {//有滚动条
                var row_$dom = $('#'+row_id_prefix+v_id);
                if(!row_$dom[0]){
                    return;
                }
                var t_top = row_$dom.position().top;
                if (upload_cache.length() > 100) {//任务管理器中的总长度超过100时，位置滚动，去掉动画效果
                    me.upload_box.scrollTop(t_top);
                } else {
                    var s_top = me.upload_box.scrollTop(),//获取当前view在列表中所出的位置
                        distance = ( Math.abs(s_top - t_top) / 41 ) | 0,
                        time = distance < 20 ? 100 : distance < 100 ? 300 : 100;
                    me.upload_box.animate({'scrollTop': t_top }, time, 'swing');
                }
            }
        },
        /**
         * 滚动时，监视区域显示的逻辑
         * @param {boolean} [force]
         */
        on_box_change_scroll: function (force) {
            var top = view.upload_box.scrollTop(),//得出位置，显示对应的区块
                k = 1,
                c_height = 0;
            while (instance_wrap[k]) {
                c_height += instance_wrap[k].height;
                if( c_height > top ){//结束遍历
                    //console.debug(c_height,top,k,force,(k !== instance_wrap.get_visable_index()));
                    if( force || k !== instance_wrap.get_visable_index() ){//这块区域已经不是当前的中心区域时，才处理显示逻辑
                        instance_wrap.set_visable_index( k );
                        var refer1 = k + 1 ,refer2 = k - 1 ,m = 1;
                        while( instance_wrap[m] ){
                            if(m === k || m === refer1 || m === refer2){
                                $('#' + instance_wrap[m].id).css('visibility', 'visible');//将与自己邻居的区域和自己都显示出来
                            } else {
                                $('#' + instance_wrap[m].id).css('visibility', 'hidden');//将自己显示处理
                            }
                            m+=1;
                        }
                    }
                    return;
                }
                k += 1;
            }
        },
        /**
         * 刷新容量信息  全部清空 和 完成的时候，刷新容量
         */
        refresh_space_info: function () {
            setTimeout(function () {
                space_info.refresh();//刷新空间存储信息
            }, 2000);
        },
        before_hander_click: function (action) {
        },
        /**
         * 手动删除上传任务后，更新上传管理器公用信息
         * @param action 动作
         */
        after_hander_click: function (action) {
            switch (action) {
                case('click_cancel'):
                    //上传-下载管理器中没有 元素后，促发全部清理操作
                    if (0 === upload_cache.get_up_main_cache().cache.length + upload_cache.get_dw_main_cache().cache.length) {//上传管理器中没有 元素后，促发全部清理操作
                        upload_static.dom_events.click_clear_all();
                    }
                    break;
            }
        },
        unregister_float_tip: function (hide_handler) {
            var handlers = this._float_tip_handlers || [];
            handlers.splice($.inArray(hide_handler, handlers), 1);
        },
        register_float_tip: function (hide_handler) {
            var me = this;
            (me._float_tip_handlers = me._float_tip_handlers || []).push(hide_handler);
            if (!me._scroll_tip_reset_hook) {
                me._scroll_tip_reset_hook = true;
                me.upload_box.on('scroll', function () {
                    me.hide_float_tips();
                });
            }
        },
        // 隐藏所有浮动的TIP
        hide_float_tips: function () {
            var handlers = this._float_tip_handlers;
            if (handlers && handlers.length) {
                $.each(handlers, function (index, hide_handler) {
                    hide_handler();
                });
                this._float_tip_handlers = [];
            }
        },
        _get_errors_tip: function () {
            var $dom = this.$errors_tip;
            if (!$dom) {
                $dom = this.$errors_tip = $(tmpl.err_pop()).appendTo(this.$dom).hide();
            }
            return $dom;
        },
        show_errors: function ($dom, errors, direction) {
            return this.show_errors_tip($dom, tmpl.folder_errors(errors), direction);
        },
        /**
         * 在何处显示Tip
         * @param {jQuery Element} $dom
         * @param {String} html
         * @param {String} direction (optional) TIP相对于$dom的显示位置，可以为above或under，默认为above。
         */
        show_errors_tip: function ($dom, html, direction) {
            var me = this,
                $pop = me._get_errors_tip(),
                $above_arr = $pop.find('.ui-pop-uarr'),
                $under_arr = $pop.find('.ui-pop-darr'),
                $content = $pop.find('.ui-pop-inner'),
                $arr;
            // 当方向不同时，TIP的坐标也要调整以使得箭头对准$dom
            // 先隐藏，计算好位置后再定位
            $pop.css({
                top: '-9999px',
                left: '-9999px'
            });
            // 先去掉滚动条，以便自适应
            $content.css('height', 'auto');
            $content.html(html);
            $pop.show();
            // 高度自适应
            var content_height = $content.height();
            if (content_height > 312) {
                $content.css('height', '312px');
            } else if (content_height < 158) {
                $content.css('height', '158px');
            }
            // 根据箭头方案不同，TIP与目标对齐位置也不同
            var arr_place, target_place;
            switch (direction) {
                case 'under':
                    // TIP位于下方，显示上箭头，中上位置对准目标中下
                    arr_place = 'cc'; // 目前的css实现中，箭头是处于中心的
                    target_place = 'cb';
                    $arr = $above_arr;
                    break;
                //case 'above':
                default:
                    // TIP位于上方，显示下箭头，中下位置对准目标中上
                    arr_place = 'cc';
                    target_place = 'ct';
                    $arr = $under_arr;
                    break;
            }
            // 显示箭头
            $arr.toggleClass('hide', false);
            $arr.siblings('span').toggleClass('hide', true);
            // --------计算最终TIP的位置[pop offset]------------
            // 对齐等式为：
            // [pop offset] + arr relate position of pop = target offset
            // 计算方式为：
            // [pop offset] = target offset - arr relate offset of pop
            // 目标 [target offset]
            var target_offset = position_util.add(
                $dom.offset(),
                position_util.of($dom, target_place)
            );
            // 箭头点相对TIP的位置
            // arr relate position of pop = arr offset + arr target - pop offset
            var $actual_arr = $arr.find('i:first');
            var arr_relate_offset = position_util.sub(
                $actual_arr.offset(),
                $pop.offset()
            );
            arr_relate_offset = position_util.add(arr_relate_offset, position_util.of($actual_arr, arr_place));
            // 最终计算
            $pop.offset(position_util.sub(target_offset, arr_relate_offset));

            // 绑定事件，使得鼠标移开时隐藏TIP，同时滚动条滚动时也隐藏。
            var hide_handler = $pop.data('hide_handler');
            if (hide_handler) {
                hide_handler(true);
            }
            var cancel_countdown, leave, timer;
            cancel_countdown = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            };
            leave = function () {
                timer = setTimeout(hide_handler, 200);
            };
            var $trigger_doms = $($dom).add($pop);
            hide_handler = function (cancel_only) {
                cancel_countdown();
                $trigger_doms.off('mouseenter', cancel_countdown).off('mouseleave', leave);
                me.unregister_float_tip(hide_handler);
                if (!cancel_only) {
                    $pop.hide();
                }
            };
            $trigger_doms.on('mouseenter', cancel_countdown).on('mouseleave', leave);
            $pop.data('hide_handler', hide_handler);
            me.register_float_tip(hide_handler);
        }
    });

    view.refresh_space_info = functional.throttle(view.refresh_space_info, 1000);

    // 坐标计算相关接口
    var position_util = {
//        fix_margin : function($dom, offset){
//            return this.add(offset, { // 修正jQuery position未计算目标margin的问题
//                left : parseInt($dom.css('margin-left'), 10) || 0,
//                top : parseInt($dom.css('margin-top'), 10) || 0
//            });
//        },
        // 取得目标DOM的某个部位的相对坐标
        // 例如下中心的坐标就是 [width/2, height]
        // 共有9组合： [l,c,r] * [t,c,b]
        of: function ($dom, place) {
            var x_place = place.charAt(0),
                y_place = place.charAt(1),
                width = $dom.outerWidth(),
                height = $dom.outerHeight(),
                x, y;
            switch (x_place) {
                case 'l':
                    x = 0;
                    break;
                case 'c':
                    x = width / 2;
                    break;
                case 'r':
                    x = width;
                    break;
            }
            switch (y_place) {
                case 't':
                    y = 0;
                    break;
                case 'c':
                    y = height / 2;
                    break;
                case 'b':
                    y = height;
                    break;
            }
            return {
                left: x,
                top: y
            };
        },
        add: function (offset1, offset2) {
            return {
                left: offset1.left + offset2.left,
                top: offset1.top + offset2.top
            };
        },
        sub: function (offset1, offset2) {
            return {
                left: offset1.left - offset2.left,
                top: offset1.top - offset2.top
            };
        }
    };

    var View_instance = function () {
        this.state = null;
        this.file_sign_update_process = functional.throttle(this.file_sign_update_process, 500);//文件扫描
        this.upload_file_update_process = functional.throttle(this.upload_file_update_process, 1000);//上传进度更新
        this.processing && (this.processing = functional.throttle(this.processing, 1000));//下载进度更新
    };

    /**
     * 原型方法： view对象与$dom对象的桥梁
     */
    $.extend(View_instance.prototype, {
        clear_soft_link: function(){
            this._$dom = null;
            this._msg = null;
            this._file_size = null;
            this._delete = null;
            this._click = null;
            this._percent_face = null;
            this._miaoc = null;
            this._error_msg = null;
            this._up4g = null;
        },
        get_upload_obj: function () {//上传对象
            var cache = dom_cache[ this.v_id ];
            return cache && cache.upload_obj || {};
        },
        get_task: function () {//上传对象
            var cache = dom_cache[ this.v_id ];
            return cache && cache.task || {};
        },
        get_dom: function (id) {//jQuery(dom对象)
            return this._$dom || (this._$dom = $('#'+row_id_prefix+(id || this.v_id)));
        },
        get_msg: function () {//上传状态提示消息
            return this._msg || (this._msg = this.get_dom().find('.upbox-state-text'));
        },
        get_file_size: function () {//文件大小
            return this._file_size || (this._file_size = this.get_dom().find('.data-size'));
        },
        get_delete: function () {//删除
            return this._delete || (this._delete = this.get_dom().find('.icon-del'));
        },
        get_click: function () {//暂停/续传对象
            return this._click || (this._click = this.get_dom().find('[icon_oper]'));
        },
        get_percent_face: function () {//样式进度
            return this._percent_face || (this._percent_face = this.get_dom().find('.upbox-mask'));
        },
        get_miaoc: function () {
            return this._miaoc || (this._miaoc = this.get_dom().find('.upbox-success-text'));
        },
        get_error_msg: function () {//单任务的提示信息
            return this._error_msg || (this._error_msg = this.get_dom().find('.filetips'));
        },
        get_up4g: function () {
            return this._up4g || (this._up4g = this.get_dom().find('.up4g'));
        },
        get_dest: function() { //目的地
            return this._dest || (this._dest = this.get_dom().find('.data-dir a'));
        }
    });
    /**
     * 原型方法 ：通用方法
     */
    $.extend(View_instance.prototype, {
        is_exist: function () {
            return this.v_id !== 0 && !!dom_cache[this.v_id] && !!this.get_upload_obj();
        },
        /**
         * 变更对应wrap的高度;
         * @param {String} state
         */
        change_$wrap_height: function(state){
            var wrap_height = instance_wrap[ this._wrap_info.pos ].height;
            if(this.height){
                wrap_height -= this.height;
            }
            if(state !== 'clear'){
                wrap_height += (this.height = (state ==='error' ? error_height : default_height) );//修改总高度,行高
            }
            instance_wrap[ this._wrap_info.pos ].height = wrap_height;
        },
        get_$wrap: function () {
            var collect = instance_wrap[instance_wrap.current];
            if (!collect || collect.is_full) {
                instance_wrap.current += 1;
                collect = instance_wrap[instance_wrap.current] = {
                    index: 0,
                    id: instance_wrap._wrap_id_prefix + instance_wrap.current,
                    height:0
                };
                view.upload_files.append( $( tmpl.instance_wrap({id: collect.id}) ) );
            }

            collect.index += 1;

            collect.is_full = collect.index > instance_wrap.batch;
            this._wrap_info = {
                id : collect.id,//包装元素的ID
                pos: instance_wrap.current//包装元素所在位置
            };
            //visibility hidden
            if (instance_wrap.current > 2) {
                return $('#' + collect.id).css('visibility', 'hidden');
            }
            return $('#' + collect.id);
        },
        init_dom: function (task) {
            this.v_id = (dom_cache.length += 1);
            $( tmpl.instance( this.get_html(task,this.v_id) ) ).appendTo( this.get_$wrap() );
            dom_cache[this.v_id] = {
                'v_id': this.v_id,
                'upload_obj': task,
                'task': task
            };
            this.get_msg().html('等待上传').show();//上传状态提示信息
            this.get_click().hide();//暂停 or 继续
            upload_tips.public_tip(view.upbox_tips);//公共消息提示
            this.show_up4g_tip();
        },
        set_cur_doing_vid: function () {
            view.cur_start_vid = this.v_id;
        },
        get_html: function (upload_obj,view_id) {
            //var dir_name = ('微云' == upload_obj.pdir_name ? '网盘' : upload_obj.pdir_name),
            var dir_name = upload_obj.pdir_name,
                upload_type = upload_obj.upload_type,
                file_type = upload_obj.get_file_type();
            if(!upload_route.is_ku20()){//todo ku2.0
                dir_name = '微云' == upload_obj.pdir_name ? '网盘' : upload_obj.pdir_name;
            }
            if (!file_type_map.can_identify(file_type)) {
                file_type = 'unknow';
            }
            return {
                "view_id":view_id,
                "mask_width": ( upload_type === 'upload_form' ? '100' : '0'),
                "li_class": "waiting",
                "file_type": file_type,
                'icon_err': this.is_upload_limit(upload_obj.file_size),
                'full_name': upload_obj.file_name,
                'file_name': view.revise_file_name(upload_obj.file_name),
                'file_size': File.get_readability_size(upload_obj.file_size),
                'file_dir': dir_name,
                'local_path': (upload_type.indexOf('plugin') ? upload_obj.path : '')
            };
        },
        /**
         * 显示任务栏上的icon-err
         *  @param file_size
         */
        is_upload_limit: function(file_size) {
            var cur_user = query_user.get_cached_user(),
                max_upload_size = 1024 * 1000 * 1000,
                is_weiyun_vip = cur_user.is_weiyun_vip(),
                is_limit = is_weiyun_vip? file_size > 20 * max_upload_size : file_size > max_upload_size;
            return is_limit? '上传受限' : '上传失败';
        },
        /**
         * 更新样式外观状态
         * @param cls
         */
        set_upload_face_status: function (cls) {
            this.get_dom().removeClass('completed uploading paused waiting error').addClass(cls);
        },
        /**
         * 重试
         */
        re_start: function () {
            this.hide_error();
            if (this.get_upload_obj().can_pause) {
                this.show_click('icon-pause', '暂停', 'click_pause');
            } else {
                this.get_click().hide();
            }
            this.start();//修改上传外观
            this.show_up4g_tip();
        },
        /**
         * 显示错误信息
         * @param html 错误码
         */
        show_error: function (html) {
            this.get_error_msg().html(html).css('display', 'inline');
        },
        /**
         * 隐藏错误信息
         */
        hide_error: function () {
            this.get_error_msg().hide();
        },
        /**
         * 显示暂停/开始按钮 ，支持显示不同属性
         * @param cls    样式className
         * @param title  属性title
         * @param action 点击执行的动作key值
         * @private
         */
        show_click: function (cls, title, action) {
            this.get_click()
                .attr({'data-action': action, 'title': title})
                .css('display', 'inline-block')
                [0].className = cls;
        },
        /**
         * 状态：删除
         */
        clear: function () {
            if (this.v_id === 0)
                return;
            this.get_dom().remove();//dom删除
            delete dom_cache[this.v_id];//删除关联引用
            this.v_id = 0;
            upload_tips.public_tip(view.upbox_tips);//公共消息提示
        },
        /**
         * 超过4G文件时，显示“超大文件”tip
         */
        show_up4g_tip: function () {
            var upload_obj = this.get_upload_obj();
            /*/重试时，如果是超大文件，还是在显示出“超大文件”tip的，文件上传才显示 
            if (upload_obj.file_type === upload_static.FILE_TYPE && upload_obj.file_size >= G4) {//如果是超大文件，则显示“超大文件”tip
                this.get_dom().addClass('upbig');
                this.get_up4g().show();
            }*/
        }
    });

    /**
     * 原型方法 : 状态
     */
    $.extend(View_instance.prototype, {
        /**
         * 直接切换到某种状态 (临时方法，稍后的重构将这些特殊调用地方统一到change_state方法中 todo )
         * @param {String} [state] 目标状态
         */
        invoke_state: function(state){
            if ( !this.is_exist() || !this[ state ] ) {
                return;
            }
            if(this.old_state !== state){
                this.change_$wrap_height(state);
            }
            this.old_state = this.state;
            this.state = state;
            this[ state ].call(this,state);
        },
        /**
         * 状态控制点
         */
        change_state: function () {
            if (!this.is_exist()) {//取消上传的文件，没成功；手工返回
                return;
            }
            var __state = this.get_upload_obj().state,
                state = this[ __state ];
            if (!state) {
                return;
            }
            if(this.old_state !== __state){
                this.change_$wrap_height(__state);
            }
            this.state = __state;

            state.call(this, __state);
            this.old_state = this.state;
        },

        /**
         * 转换的一瞬间
         */
        transform_state: (function () {

            var g = {};
            g.file_sign_update_process = function () {
                this.get_click().hide();  //停止扫描的接口暂时未提供. 所以扫描的时候先影藏删除按钮.
            };
            g.upload_file_update_process = function () {
                var me = this;
                me.set_upload_face_status('uploading');
                me.get_msg().html('正在上传').show();
                //修复bug： 出错后，停止上传失效，控件继续回调
                if ('error' === this.last_trans_state) {
                    me.hide_error();
                    me.last_trans_state = 'upload_file_update_process';
                }
                if (me.get_task().can_pause) {    //如果能暂停的情况， 更新进度的时候影藏删除按钮
                    me.get_click()
                        .attr({'data-action': 'click_pause', 'title': '暂停'})
                        .css('display', 'inline-block')
                        [0].className = 'icon-pause';
                }
            };

            return function (state) {
                if (this.v_id === 0) {//取消上传的文件，没成功；手工返回
                    return;
                }
                if (!g[ state ]) {
                    this.last_trans_state = state;
                    return;
                }
                g[ state ].call(this, state);
            };

        })(),
        /**
         * 状态：初始化
         */
        init: function () {
            view.upload_end_time(true);
        },
        /**
         * 状态：等待
         */
        wait: function () {
            this.set_upload_face_status('waiting');//设置外观样式为 等待上传中 状态
            this.get_file_size().html(File.get_readability_size(this.get_upload_obj().file_size));
            this.get_msg().html('等待上传').show();
            this.get_click().hide();
            this.get_delete().css('display', 'inline-block');
            var task = this.get_task();
            //code by bondli 表单上传时因为mask宽度是100%了，有了默认背景，需要清理
            if (task.upload_type === 'upload_form') {
                this.get_percent_face().css({ "backgroundColor": "#fff" });
            }
            if(task.is_temporary()) {
                this.get_dest().text('中转站');
            }
            this.hide_error();
            this.clear_soft_link();


        },
        /**
         * 状态：开始
         */
        start: function () {
            var w = ( this.get_upload_obj().upload_type === 'upload_form' ? '100%' : '1%');
            this.set_upload_face_status('uploading');//设置外观样式为 上传中 状态
            this.get_delete().css('display', 'inline-block');
            this.get_msg().html('正在上传').show();
            this.get_percent_face().width(w); //显示进度百分比-样式
            this.set_cur_doing_vid();
        },
        /**
         * 状态：扫描状态
         */
        file_sign_update_process: function () {
            var upload_obj = this.get_upload_obj();
            //can_show_sign_state: 解决出错了还会进来扫描
            var can_show_sign_state = this.old_state === 'start' || this.old_state === 'file_sign_update_process';
            if (this.state !== 'file_sign_update_process' || upload_obj.no_show_sign || can_show_sign_state === false) {
                return;
            }
            var percent = upload_obj.file_sign_update_process / upload_obj.file_size * 100;

            //点击了取消，怎么都还会进来一次，导致get_msg为null的js错误
            if(upload_obj.file_sign_update_process === undefined){
                return;
            }

	        if(percent >= 100 && upload_obj.is_pre_file_sining) {
		        this.get_msg().html('排队中').show();
	        } else {
		        this.get_msg().html('准备中:' + upload_obj.fix_percent(percent) + '%').show();
	        }
        },
        /**
         * 状态：扫描完成
         */
        file_sign_done: function () {
            var upload_obj = this.get_upload_obj();
            if(!upload_obj.is_pre_file_sining) {
                this.get_msg().html('正在上传').show();
            }
        },
        /**
         * 状态：更新进度
         * @param hide_process_size
         */
        upload_file_update_process: function (hide_process_size) {
            var upload_obj = this.get_upload_obj();
            if (this.v_id === 0 || !upload_obj.processed || this.state !== 'upload_file_update_process') {
                return;
            }

            var width = upload_obj.processed / upload_obj.file_size * 100;
            width = upload_obj.fix_percent(width);

            this.get_percent_face().width( (width<1?1:width) + '%' );//显示进度百分比-样式
            this.get_msg().html(width + '%').show();//显示进度百分比-文本

            if (!hide_process_size) {
                var curr_file_size;
                curr_file_size = upload_obj.file_size * width / 100;
                curr_file_size = Math.min(curr_file_size, upload_obj.file_size);
                this.get_file_size().html(File.get_readability_size(curr_file_size) + '/' + File.get_readability_size(upload_obj.file_size));
            }
        },
        /**
         * 状态：错误
         * */
        error: function () {
            var me = this,
                task = me.get_upload_obj();
            me.set_upload_face_status('error');//设置外观样式为 上传失败 状态
            me.get_delete().css('display', 'inline-block');//可以删除
            me.get_click().hide();//默认不能再上传、暂停
            me.show_error(task.get_translated_error(upload_route.type === 'upload_form' ? 'tip' : null));//显示错误信息
            me.get_msg().html('').show();//隐藏进度信息
            if (task.can_re_start()) {     //非本地校验出错 可以重试
                me.show_click('icon-continue', '重试', 'click_re_try');
            }
            this.get_up4g().hide();//有错误就不显示“超大文件”提示了，不够位置
            this.get_dom().removeClass('upbig');
            me.get_percent_face().width('100%'); //显示进度百分比-样式
            view.on_done_reset_scroll(me.v_id);
            this.clear_soft_link();
        },
        /**
         * 状态：完成
         */
        done: function () {
            var new_name = file_type_map.revise_file_name(this.get_upload_obj().new_name || '', 1),//换新名字
                upload_obj = this.get_upload_obj(),
                real_size = upload_obj.file_size,
                file_size = File.get_readability_size(real_size);

            this.set_upload_face_status('completed');//设置外观样式为 完成 状态
            if (new_name) {
                this.get_dom().find('.filename').html(new_name);
            }
            this.get_file_size().html(file_size);//显示 实际尺寸
            //this.get_percent_face().width('100%'); //显示进度百分比-样式
            //this.get_msg().hide();//隐藏 上传信息提示
            this.get_msg().remove();//隐藏 上传信息提示
            this.get_delete().remove();//隐藏 删除
            this.get_click().remove();//隐藏
            if (upload_obj.is_miaoc()) {
                this.get_miaoc().text('极速秒传').show();
            }
            else if(upload_obj.is_tpmini()) {
                this.get_miaoc().text('已上传至TP mini').show();
            }
            this.hide_error();
            view.on_done_reset_scroll(this.v_id);
            this.clear_soft_link();
        },
        /**
         * 状态：暂停
         */
        pause: function () {
            this.set_upload_face_status('paused');//设置外观样式为 暂停 状态
            this.show_click('icon-continue', '续传', 'click_continuee');
            this.get_delete().css('display', 'inline-block');
            this.get_msg().html('暂停').show();//显示上传
            this.clear_soft_link();
        },
        /**
         * 状态：继续
         */
        continuee: function () {
            this.set_upload_face_status('uploading');//设置外观样式为 正在上传 状态
            this.show_click('icon-pause', '暂停', 'click_pause');
            this.get_msg().html('正在上传').show();//显示上传
            this.hide_error();
            this.show_up4g_tip();
        },
        /**
         * 状态：续传暂停
         */
        resume_pause: function () {
            this.upload_file_update_process('resume_pause');
            this.show_click('icon-continue', '续传', 'click_resume_continuee');
            this.get_delete().css('display', 'inline-block');
            this.clear_soft_link();
        },
        /**
         * 状态：续传继续
         */
        resume_continuee: function () {
            this.set_upload_face_status('uploading');//设置外观样式为 正在上传 状态
            this.show_click('icon-continue', '暂停', 'click_pause');
            this.show_up4g_tip();
        }
    });


    view.add = function (upload_obj, view_key) {
        view.set_end_btn_style(bar_info.is_done(), upload_cache.get_close_btn_text());//设置关闭按钮，样式和text
        var instance = new View_instance();
        if (view_key) {
            var view_type;

            // 这么写是因为 require 必须使用明文字符串常量作为参数 - james
            switch (view_key) {
                case 'empty':
                    view_type = require('./view_type.empty');
                    break;
                case 'folder':
                    view_type = require('./view_type.folder');
                    break;
                case 'webkit_down':
                    view_type = require('./view_type.webkit_down');
                    break;
            }
            $.extend(instance, view_type);
        }
        instance.init_dom(upload_obj);
        return instance;
    };

    module.exports = view;

});


//优化点, 状态过度的时候开关.
//优化点, cache放到一个更小的集合中.
