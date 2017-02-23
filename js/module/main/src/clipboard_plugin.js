/**
 * 剪贴板轮询拉取数据插件
 * @author hibincheng
 * @date 2014-01-21
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        easing = lib.get('./ui.easing'),
        store = lib.get('./store'),
        json = lib.get('./json'),
        console = lib.get('./console').namespace('clipboard'),
        text = lib.get('./text'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        constants = common.get('./constants'),

        max_clipboard_record_count = 5, //剪贴板最多消息记录数

        REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
        server_version = 0, //拉取版本
        has_enter_clipboard = false, //是否进入了剪贴板列表
        loading = false,
        load_timer = false,
        loop_time = 10000,      // 15秒轮询，ps：原来是5s，由于服务器性能问题，先改成15s，
                                // 先保证服务可用，后续等后台完成扩容以后再改回来

        is_first_load = true,  //是否第一次加载数据
        has_start = false,
        load_req,
        load_timer,
        tip_timer,
        tip_speed = 500, //tip显示动画时长
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致

        ori_doc_title = document.title, //document 的 title
        tip_pre_text = '剪贴板收到新的内容：',
        tip_pre_text_len = tip_pre_text.length,

        speed_flags = '21254-1-13', //拉取cgi测试flag
        speed_start_time, //测速开始时间
        device_id = constants.DEVICE_ID, //使用时间戳来标识不同web端，以便web 和 appbox能相互接收
        undefined;

    //本地缓存消息记录
    var clipboard_store = {

        init: function() {
            this.local_records = [];    //最近非自己发的消息
            this.local_owner_ctimes = []; //自己发的消息时间戳
        },

        get_records: function() {
            return this.local_records;
        },

        get_unread_records_num: function() {
            var unread_records = $.grep(this.local_records, function(rd) {
                return !!rd.unread;
            });
            return Math.min(unread_records.length, 5);
        },

        get_owner_ctimes: function() {
            return this.local_owner_ctimes;
        },

        /**
         * 设置本地消息记录为已读
         */
        set_records_read: function() {
            $.map(this.local_records, function(rd) {
                rd.unread = false;
            });
        },

        add_records: function(records) {
            if(!this.local_records.length) {
                this.local_records = records;
            } else {
                this.local_records = records.concat(this.local_records);
            }

            this.local_records = this.local_records.slice(0, max_clipboard_record_count);
        },

        /**
         * 新增自己发送的消息的创建时间戳
         * @param ctime
         */
        add_owner_ctime: function(ctime) {
            this.local_owner_ctimes.unshift(ctime);
            this.local_owner_ctimes = this.local_owner_ctimes.slice(0, max_clipboard_record_count);
        },

        /**
         * 根据指定ctime，删除对应的消息
         * @param {Number} ctime 消息的创建时间戳
         */
        remove_record: function(ctime) {
            var records = $.grep(this.get_records(), function(rd) {
                return rd.ctime != ctime;
            });

            this.local_records = records;
        },

        /**
         * 收集新的消息记录并保存起来
         * @param {Array} new_records 后台返回的数据
         */
        collect_new_records: function(new_records) {
            var local_owner_ctimes = this.local_owner_ctimes,
                tmp_records = [];

            //有自己发送的
            if(local_owner_ctimes && local_owner_ctimes.length) {
                //过滤掉自己发送的
                $.each(new_records, function(i, item) {
                    if($.inArray(item.ctime, local_owner_ctimes) == -1) {
                        tmp_records.push(item);
                    }
                });

                new_records = tmp_records;
                tmp_records = [];
            }

            if(new_records.length) {
                this.add_records(new_records);
            }

            return new_records;
        }
    };

    var plugin = new Module('clipboard_plugin', {

        _init: function($clip_num) {
            this._$clip_num = $clip_num; //保存引用，用于未读数提示
            clipboard_store.init();//剪贴板本地存储初始化

            this.listenTo(routers, 'add.m', function(mod_name) {
                if(mod_name === 'clipboard') {
                    this._start_load();
                }
            })
            .listenTo(routers, 'change.m', function(mod_name) {
                if(mod_name === 'clipboard') { //只有进入到剪贴板后，才去轮询拉取数据
                    this._start_load();
                } else {
                    this._stop_load();
                }    
            });
            //this._start_load();
            this.
                listenTo(global_event, 'enter_clipboard_list', function() { //进入剪贴板查看后，未读个数要清零
                    has_enter_clipboard = true;
                    this.set_all_read();
                })
                .listenTo(global_event, 'exit_clipboard_list', function() {
                    has_enter_clipboard = false;
                });

            //有发送剪贴板消息，要更新本地发送标识数据
            this.listenTo(global_event, 'send_clipboard_success', function(ctime) {
                if(ctime) {
                    clipboard_store.add_owner_ctime(ctime, true);
                }
            });

            this.listenTo(global_event, 'remove_clipboard_success', function(ctime) {
                if(ctime) {
                    clipboard_store.remove_record(ctime);
                }
            });

            var me = this;
           setTimeout(function() {
               me._init_tip();
           }, 2000);

        },

        _speed_time_report: function() {
	        //测速
	        try{
		        huatuo_speed.store_point(speed_flags, 1, new Date() - speed_start_time);
		        huatuo_speed.report();
	        } catch(e) {

	        }
        },

        /**
         * 开始拉取剪贴板内容 定时轮询 (暂时去掉轮询，后台压力大)
         * @private
         */
        _start_load: function() {
            var me = this;
            clearTimeout(load_timer);
            me._load_data();
            /*
            if(has_start) {
                load_timer = setTimeout(function() {
                    me._load_data();
                }, loop_time);
            } else {
                load_timer = setTimeout(function() {
                    me._load_data();
                }, 2000);
                has_start = true;
            } */

        },
        /**
         * 停掉轮询拉取数据
         * @private
         */
        _stop_load: function() {
            clearTimeout(load_timer);
            load_req && load_req.destroy();
        },

        /**
         * 加载剪贴板数据
         * @private
         */
        _load_data: function() {
            if(loading) {
                return;
            }

            loading = true;
            if(is_first_load) {
                speed_start_time = new Date();
            }
            var me = this;
            load_req = request.xhr_get({
                url: REQUEST_CGI,
                cmd: 'ClipBoardDownload',
                cavil: true,
                re_try: is_first_load ? 2 : 0, //增量拉取时不需要重试了
                pb_v2: true,
                body: {
                    local_version: server_version,
                    device_id: device_id
                }
            })
                .ok(function(msg, body) {
                    me._on_load_done(body.msg_infos || []);
                    server_version = body.server_version || server_version;
                    if(is_first_load) {
                        me._speed_time_report();//测第一次拉取，增量拉不测
                        is_first_load = false;
                    }
                })
                //失败就不理了，启动定时器再去拉
                .done(function(msg, body) {
                    loading = false;
                    //me._start_load();
                });
        },

        /**
         * 加载完成数据后处理
         * @param list
         * @private
         */
        _on_load_done: function(list) {
            if(!list.length) { // 无数据
                if(is_first_load) {
                    this.trigger('clipboard_load_done', clipboard_store.get_records());
                }
                return;
            }
            $.map(list, function(item) {
                item.unread = has_enter_clipboard ? false : is_first_load ? false : true;
            });

            var new_records = clipboard_store.collect_new_records(list);
            if(is_first_load) {
                this.trigger('clipboard_load_done', clipboard_store.get_records());
            } else if(new_records.length) {
                this._update_clipboard(new_records);
            }
        },

        /**
         * 增量更新剪贴板
         * @param {Array} new_records 新的未读消息
         * @private
         */
        _update_clipboard: function(new_records) {
            var new_num = new_records.length;

            this._show_tip(new_records[new_num-1]['items'][0]['content']);

            if(!has_enter_clipboard) {
                this._update_clip_num(clipboard_store.get_unread_records_num());//红点提示未读数
            }

            this.trigger('clipboard_update', new_records);
        },

        /**
         * 更新未读剪贴板内容条数
         * @param {Number} num 新未读个数
         * @private
         */
        _update_clip_num: function(num) {
            num = parseInt(num, 10);
            this._$clip_num.text(num);
            this._$clip_num.toggle(!!num);

            if(num) {
                document.title = ori_doc_title + ' ('+num+')'
            } else {
                document.title = ori_doc_title;
            }
        },

        set_all_read: function(trigger_event) {
            this._update_clip_num(0);
            clipboard_store.set_records_read();
            trigger_event && this.trigger('clipboard_all_read');
        },

        /**
         * 初始化复制操作
         * @private
         */
        _init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }

            this.copy = new Copy({
                container_selector: '.tip-clip',
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var content = me._$label.text().slice(tip_pre_text_len);
                    return content;
                })
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功');
                    me.set_all_read(true);
                    user_log('CLIPBOARD_TOAST_COPY_BTN');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                });
        },

        /**
         * 初始化顶部未读剪贴板内容提示
         * @private
         */
        _init_tip: function() {
            var str = [
                '<div class="tip-clip" style="display:none;">',
                    '<i class="ico-war"></i>',
                    '<span></span>'
                ];

            if(Copy.can_copy()) {
                str.push('<a data-clipboard-target data-action="copy" data-clipboard href="javascript:void(0);">复制</a>');
            }
            str.push('</div>');
            str = str.join('');

            var $tip = $(str).appendTo(document.body);
            $tip.hover(function(e) {
                clearTimeout(tip_timer);
            }, function(e) {
                me._start_hide_timer();
            });

            var me = this;
            $tip.on('click', '[data-action=copy]', function(e) {
                e.preventDefault();
                me.copy.ie_copy(me._$label.text().slice(10));
                user_log('CLIPBOARD_TOAST_COPY_BTN');
            });

            this._$tip = $tip;
            this._$label = $tip.find('span');

            this._init_copy();
        },

        _show_tip: function(txt) {
            if(!this._$tip) {
                this._init_tip();
            }
            txt = tip_pre_text + txt;
            this._$label.text(txt); //最多1024字节，这里就不需要截断了

            // 显示
            this._$tip.stop(true, true)
                .css({ top: hidden_px, display: 'block' })
                .animate({ top: 0 }, tip_speed, easing.get('easeOutExpo'));

            this._start_hide_timer();
        },

        _start_hide_timer: function() {
            clearTimeout(tip_timer);
            // 延迟一定时间后隐藏
            var delay = 10,
                me = this;
            tip_timer = setTimeout(function () {
               // tip_timer = setTimeout(function () {
                    me._hide_tip();
              //  }, tip_speed);
            }, delay * tip_speed);
        },

        _hide_tip: function () {
            clearTimeout(tip_timer);
            var me = this, $el = me._$tip;
            if ($el) {
                $el.stop(true, true).animate({ top: hidden_px }, tip_speed, easing.get('easeOutExpo'), function () {
                    $el.hide();
                });
            }
        },

        //================================= 对外接口 ====================================================================//

        /**
         * 初始化
         * @param {jQuery} $clip_num 红点提示未读数dom
         */
        init: function($clip_num) {
            this._init($clip_num);
        },



        /**
         * 获取未读消息数
         */
        get_unread_records_num: function() {
            return clipboard_store.get_unread_records_num();
        },

        /**
         * 获取本地消息记录
         * @returns {*}
         */
        get_records: function() {
            return clipboard_store.get_records();
        },

        /**
         * 第一次是否已加载完
         * @returns {boolean}
         */
        is_first_load_done: function() {
            return !is_first_load;
        }
    });

    return plugin;

});