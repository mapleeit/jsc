//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/main/main.r160711",["lib","common","$","app_download_css"],function(require,exports,module){

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
//main/src/Search_box.js
//main/src/access_check.js
//main/src/ad_board/ad_board.js
//main/src/clipboard_plugin.js
//main/src/first_guide.js
//main/src/install_app/install_app.js
//main/src/install_app/ui.js
//main/src/main.js
//main/src/qboss_info.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
//main/src/weiyun_vip.js
//main/src/ad_board/ad_board.tmpl.html
//main/src/install_app/install_app.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html

//js file list:
//main/src/Search_box.js
//main/src/access_check.js
//main/src/ad_board/ad_board.js
//main/src/clipboard_plugin.js
//main/src/first_guide.js
//main/src/install_app/install_app.js
//main/src/install_app/ui.js
//main/src/main.js
//main/src/qboss_info.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
//main/src/weiyun_vip.js
/**
 * 页面上的搜索框
 * @author cluezhang
 * @date 2013-9-11
 */
define.pack("./Search_box",["lib","common","$"],function(require, exports, module) {
	var lib = require('lib'),
		inherit = lib.get('./inherit'),
		Event = lib.get('./Event'),
		common = require('common'),
		user_log = common.get('./user_log'),

		$ = require('$');
	/**
	 * 因search模块是异步加载的，使用此searcher作为缓冲
	 * 它作为adapter来隐藏search模块的异步加载
	 * @private
	 */
	var CacheSearcher = inherit(Event, {
		busy: false,
		/**
		 * 开始搜索
		 * @param {String} str
		 */
		search: function(str) {
			if(this.searcher) {
				return this.searcher.search(str);
			}
			if(!str) {
				this.cancel();
				return;
			}
			this.str = str;
			if(!this.busy) {
				this.busy = true;
				this.trigger('busy');
			}
			this.try_load();
		},
		/**
		 * 取消搜索
		 */
		cancel: function() {
			if(this.searcher) {
				return this.searcher.cancel();
			}
			this.str = '';
			if(this.busy) {
				this.busy = false;
				this.trigger('idle');
			}
		},
		/**
		 * 尝试加载搜索模块
		 * @private
		 */
		try_load: function() {
			var me = this;
			if(me.loading) {
				return;
			}
			require.async('search', function(o) {
				me.finish_load(o.get('./search').get_ext_module());
			});
			me.loading = true;
		},
		/**
		 * 当异步加载搜索模块完成时，进行对接
		 * @private
		 */
		finish_load: function(module) {
			var me = this;
			var searcher = module.get_searcher();
			me.searcher = searcher;
			if(me.str) {
				searcher.search(me.str);
			}
			searcher.on('idle', function() {
				me.trigger('idle');
			});
			searcher.on('busy', function() {
				me.trigger('busy');
			});
			module.on('deactivate', this.quit_search, this);
		},
		/**
		 * 当退出搜索模块时，发出reset事件，清空搜索框
		 * @private
		 */
		quit_search: function() {
			this.trigger('reset');
		}
	});


	var Search_box = inherit(Event, {
		/**
		 * @cfg {jQueryElement} $el
		 */
		/**
		 * @cfg {String} input_selector
		 */
		/**
		 * @cfg {Searcher} searcher
		 */
		/**
		 * @cfg {Number} buffer (optional) 搜索缓冲时间
		 */
		buffer: 500,
		focus_class: 'focus',
		hover_class: 'hover',
		searching_class: 'searching',
		notblank_class: 'istext',
		last_searching_value: '',
		constructor: function(cfg) {
			var me = this;
			Search_box.superclass.constructor.apply(me, arguments);
			$.extend(me, cfg);
			var $el = me.$el;
			var $input = me.$input = $el.find(me.input_selector);
			//因为focus的动画导致close按钮经常点不到。这里用JS来控制close按钮的展示和隐藏
			var $close_btn = $el.find('.close');
			this.searcher = new CacheSearcher();
			// focus
			// 当点击其它界面时，不知道为什么没能取消选中，需要hack
			var do_blur = function(e) {
				if(!$.contains($el[0], e.target)) {
					$input.blur();
				}
			};
			$input.focus(function() {
				$el.addClass(me.focus_class);
				$close_btn.show();
				$(document.body).on('click', do_blur);
			}).blur(function(e) {
				if(event.currentTarget === e.target) {
					return;
				}
				$close_btn.hide();
				$el.removeClass(me.focus_class);
				$el.toggleClass(me.notblank_class, !!$input.val());
				$(document.body).off('click', do_blur);
			});
			// hover
			$el.hover(function() {
				$el.addClass(me.hover_class);
			}, function() {
				$el.removeClass(me.hover_class);
			});
			// focus
			$el.on('click', function(e) {
				// 如果点击的不是input输入框，主动focus
				if(!$.contains($input[0], e.target)) {
					$input.focus();
				}
			});

			// typing
			$input.on('keydown', $.proxy(me.handle_keydown, me));

			// searching
			me.searcher.on('busy', function() {
				$el.addClass(me.searching_class);
			});
			me.searcher.on('idle', function() {
				$el.removeClass(me.searching_class);
			});

			// 点击取消
			$el.on('click', '.close', function(e) {
				e.preventDefault();
				me.$input.val('');
				$close_btn.hide();
				me.update_state();
				me.trigger_search();
				user_log('SEARCH_CANCEL');
			});

			// 模块切换走时清空
			me.searcher.on('reset', function() {
				me.$input.val('');
				me.update_state();
				me.clear_cache();
			});
			// IE6下，开启自动完成按F5刷新后，非常SB的将上次的值给设置进来了，导致显示有问题。
			// autocomplete="off"设置无效
			// 保险起见，IE9以下版本都这样弄
			if($.browser.msie && $.browser.version < 9) {
				$(window).on('load', function() {
					$input.val('');
				});
			}
		},
		/**
		 * 更新文本框输入状态
		 * @private
		 */
		update_state: function() {
			var me = this;
			setTimeout(function() {
				me.$el.toggleClass(me.notblank_class, !!me.$input.val());
			});
		},
		/**
		 * 在输入框中按键的行为：
		 *      普通输入触发延迟搜索（如果和上次值不同）
		 *      按Enter强制搜索
		 *      按Esc触发cancel
		 * @private
		 */
		handle_keydown: function(e) {
			var code = e.keyCode || e.which;
			switch(code) {
				case 13: // Enter
					this.trigger_search(true);
					break;
				case 27: // Esc
					//this.cancel();
					this.$input.val('');
					this.trigger_search();
					break;
				default:
					this.trigger_search();
					break;
			}
			this.update_state();
		},
		/**
		 * 清除已搜索缓存
		 * @private
		 */
		clear_cache: function() {
			this.last_searching_value = null;
		},
		/**
		 * 触发搜索
		 * @param {Boolean} force (optional) 是否强制搜索，默认为false，即如果值没有变化就不触发。
		 * @private
		 */
		trigger_search: function(force) {
			var me = this;
			if(force) {
				me.clear_cache();
			}
			if(me.timer) {
				clearTimeout(me.timer);
				me.timer = null;
			}
			me.timer = setTimeout(function() {
				me.buffer_search();
			}, me.buffer);
		},
		/**
		 * buffer缓冲过后执行搜索判断
		 * @private
		 */
		buffer_search: function() {
			// 去除前后空格
			var value = $.trim(this.$input.val());
			if(value !== this.last_searching_value) {
				this.searcher.search(value);
				this.last_searching_value = value;
			}
			this.timer = null;
		}//,
//        /**
//         * 取消搜索
//         */
//        cancel : function(){
//            this.$input.val('');
//            this.last_searching_value = '';
//            this.searcher.cancel();
//        }
	});
	return Search_box;
});/**
 * 用户登录态检查（登录态、独立密码验证状态）
 *
 * 逻辑：
 *   request 模块的请求回调包含1024错误码时，会触发
 *
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./access_check",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        constants = common.get('./constants'),

        $ = require('$'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),
	    cookie = lib.get('./cookie'),

        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        session_event = common.get('./global.global_event').namespace('session'),
        widgets = common.get('./ui.widgets'),

    // 登录成功的回调
        login_callback_stack = [],

        login_to,

        heartbeat, // 心跳 timeout ID
        heartbeat_interval = 45 * 60 * 1000, // 心跳间隔时间

        global = window,

        LIMIT_LOGIN_ERR_CODE = [190011, 190072], 

        undefined;

    var access_check = {

        init: function () {
            var me = this;

            if (me._ready)
                return;

            me
                // 会话超时，要求登录
                // login_callback --> 登录后的回调
                .listenTo(session_event, 'session_timeout', function (login_callback) {
                    $.isFunction(login_callback) && login_callback_stack.push(login_callback);

                    // 会话超时后，销毁 user
		            //todo: ptlogin.qq.com切换
                    //query_user.destroy();
                    me._logout();

                    // 要求登录并query_user验证
                    me._req_ptlogin_n_quser();
                })
                // 独立密码无效，要求输入
                .listenTo(session_event, 'invalid_indep_pwd', function (login_callback, rsp_body) {
                    $.isFunction(login_callback) && login_callback_stack.push(login_callback);
                    // 要求输入独立密码验证
                    me._req_indep_login(rsp_body['nick_name']);
                });


            // 维持心跳
            query_user.on_every_ready(function () {
                clearTimeout(heartbeat);
                heartbeat = setTimeout(function () {
                    query_user.get(true, true, false);
                }, heartbeat_interval);
            });

            me._ready = true;
        },

        _try_to_limit_login: function(err_code) {
            if($.inArray(err_code, LIMIT_LOGIN_ERR_CODE) > -1) {
	            //todo: ptlogin.qq.com切换
                //query_user.destroy();
                this._logout();
                this._limit_login_warn(err_code);
            }
        },

        _logout: function() {
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
        },

        _limit_login_warn: function(err_code) {
            if(err_code == 190072) {
                var dialog = new widgets.Dialog({
                    title: '提示',
                    klass: 'full-pop-small',
                    content: '<div class="mod-alert"><div class="alert-inner"><i class="ico"></i><h4 class="title">您的账号由于上传了违规的文件，现被禁止登录微云，如有疑问请联系腾讯客服。</h4><p class="info" title=""></p></div></div>',
                    buttons: [
                        { id: 'OK', text: '联系客服', klass: 'g-btn-blue',disabled: false, visible: true }
                    ],
                    handlers: {
                        OK: function () {
                             window.open('http://kf.qq.com/');
                        }
                    }
                });
                dialog.show();
            } else {
                require.async('qq_login', function(qq_login) {
                    qq_login.get('./qq_login').limit_login(err_code);
                });    
            }
        },

        /**
         * 绑定登陆事件，当成功后进行页面reload，有失败则失败是否是限制号进行提示
         * @private
         */
        _bind_login_event: function() {
            var me = this;
            if(!me._has_bind_login_event) {
                // 登陆后跳转（强制禁用其他对query_user的监听事件，登录完成后只跳转，不做其他事情）
                query_user.off()
                    .once('load', function () {
                        location.reload();
                    })
                    .on('error', function(msg, ret) {
                        me._try_to_limit_login(ret);
                    });

                me._has_bind_login_event = true;
            }
        },

        start: function () {
            var me = this;

            me.init();

            var login_err = global.g_serv_login_rsp;

            if(!query_user.check_cookie()) {
                me._bind_login_event();
            } else { //登陆后再进来时也要绑定一下错误事件，其它情况超时弹出登录框，切换成企业号也要进行限制
                query_user.on('error', function(msg, ret) {
                    me._try_to_limit_login(ret);
                });
            }
            // 直出服务已代替客户端请求过query_user，已得到返回码，可以直接弹出登录框而不需要发起请求 - james
            if (login_err) {
                if (ret_msgs.is_sess_timeout(login_err.ret)) {
                    me._bind_login_event();
                    return this._req_ptlogin();
                } else if (login_err.rsp_body.is_pwd_open) { //开启了独立密码，需要进行独立密码
                    me._bind_login_event();
                    return this._req_indep_login(login_err.rsp_body.nick_name);
                } else if($.inArray(login_err.ret, LIMIT_LOGIN_ERR_CODE) > -1) {
                    me._limit_login_warn(login_err.ret);
                    return;
                }
            }

            // 本地发起请求
            // 先验证客户端cookie
            if (!query_user.check_cookie()) {
                // 如果客户端没有 uin/skey，则要求登录，且登录完成后要再连接 server query_user 检查一次
	            window.location.href = '//www.weiyun.com/';
            }
            // 如果客户端有 uin/skey，则连接server验证
            else {
                me._server_check(constants.IS_PHP_OUTPUT);
            }
        },

	    /**
	     * 要求跳转首页进行ptlogin验证
	     * @private
	     */
	    _req_ptlogin: function () {
		    // 先清cookie，后跳首页
		    cookie.unset('uin', {
			    domain: constants.MAIN_DOMAIN,
			    path: '/'
		    });
		    cookie.unset('skey', {
			    domain: constants.MAIN_DOMAIN,
			    path: '/'
		    });
		    cookie.unset('p_uin', {
			    domain: constants.MAIN_DOMAIN,
			    path: '/'
		    });
		    cookie.unset('p_skey', {
			    domain: constants.MAIN_DOMAIN,
			    path: '/'
		    });
		    window.location.href = '//www.weiyun.com/';
	    },

        /**
         * 要求ptlogin验证
         * @private
         */
        _req_ptlogin_n_quser: function () {
            var me = this;
            ///if (constants.IS_WRAPPED) { // 如果是嵌入其它网站，使用别人的登录态，就不使用自己的ptlogin了
            //    me.trigger('external_login', this._login_done, this);
            //} else {
                require.async('qq_login', function (mod) {
                    var qq_login = mod.get('./qq_login'),
                        qq_login_ui = qq_login.ui;

                    me
                        .stopListening(qq_login)
                        .stopListening(qq_login_ui)
                        .listenTo(qq_login, 'qq_login_ok', function () {
                            this._login_done();
                        })
                        .listenToOnce(qq_login_ui, 'show', function () {
                            this.trigger('qq_login_ui_show');
                        })
                        .listenToOnce(qq_login_ui, 'hide', function () {
                            this.trigger('qq_login_ui_hide');

                            this.stopListening(qq_login_ui);
                        });

                    qq_login.show();
                });
           // }
        },

        /**
         * 要求独立密码验证
         * @param {String} nickname CGI返回10用户信息返回的 rep_body
         * @private
         */
        _req_indep_login: function (nickname) {
            var me = this;
            require.async('indep_login', function (indep_login_mod) {
                var indep_login = indep_login_mod.get('./indep_login');

                indep_login.show(nickname || '');

                me
                    .stopListening(indep_login)
                    .listenTo(indep_login, 'indep_login_ok', function () {
                        me._server_check();
                    });
            });
        },

        /**
         * 登录成功后的回调，用于确认登录状态、记录主动登录的uin
         * @private
         */
        _login_done: function () {
            // 标记用户主动登录成功的uin
            query_user.set_last_lgoin_uin();
            this._server_check();
        },


        /**
         * 通过 query_user 验证
         *   - 验证通过后，如果用户设置了独立密码，则验证独立密码; 否则就认为成功
         * @param {boolean} [is_serv_output] 是否直出，默认false
         * @private
         */
        _server_check: function (is_serv_output) {
            // 直出版本不连接server验证
            var force_query = !is_serv_output;
            query_user.get(force_query, true, true, true).ok(this._server_check_callback);
        },

        _server_check_callback: function () {
            // 相册将网盘页作为登录页使用（TODO 相册合入后删除这个跳转）james 2013-6-7
            if (login_to) {
                location.href = login_to;
            }
            // 回调
            else {
                var stack = login_callback_stack;
                while (stack && stack.length) {
                    var fn = stack.shift();
                    typeof fn === 'function' && fn();
                }
            }

        }
    };

    $.extend(access_check, events);

    return access_check;
});/**
 * Created by maplemiao on 28/12/2016.
 */
"use strict";

define.pack("./ad_board.ad_board",["lib","common","$","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Module = common.get('./module'),
        query_user = common.get('./query_user'),
        reportMD = common.get('./report_md'),
        cookie = lib.get('./cookie');

    var tmpl = require('./tmpl');

    var uin = query_user.get_uin_num(),
        BOARD_ID = 2557;  //http://qboss.cm.com/front/v2/html/home.html  @xiaomoliu

    return new Module('ad_board', {
        render: function () {
            var me = this;

            /**
             * require qboss module
             */
            require.async('qboss', function (mod) {
                me.qboss_info = mod.get('./qboss');

                me.qboss_info.get({
                    board_id: BOARD_ID,
                    uin: uin
                }).done(function(data){
                    if (data.code !== 0) {
                        //fail
                        reportMD(277000034, 179000184, data.code, 1);
                    } else if (data && data.data && data.data.count === 0) {
                        // 1111返回码代表用户没有被投放到广告
                        reportMD(277000034, 179000184, 1111, 2);
                    } else {
                        var tempData = data.data || {};
                        tempData = tempData[BOARD_ID] || {};
                        tempData = tempData.items || [];
                        tempData = tempData[0] || {};
                        var extdata = tempData.extdata ? JSON.parse(tempData.extdata) : {};

                        me.bosstrace = tempData.bosstrace || '';

                        me._$el = $(tmpl.ad_board({
                            validated: extdata.link && extdata.img,
                            link: extdata.link ? extdata.link.replace(/^http:/, '') : '',
                            img_url: extdata.img ? extdata.img.replace(/^http:/, '') : ''
                        }));
                        me._$el.appendTo($('.layout-aside-ft'));

                        me._bind_events();
                    }
                }).fail(function(err){
                    // logger
                    reportMD(277000034, 179000184, err.ret, 1);
                });
            });
        },

        _bind_events: function () {
            var me = this;

            me._$el.on('click', '.j-ad-board-close-btn', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me._destroy();

                me.qboss_info.report({
                    from :0,
                    uin: uin,
                    qboper: 3,
                    bosstrace: me.bosstrace
                });
            });

            me._$el.on('click', '.j-ad-board-bd', function (e) {
                me.qboss_info.report({
                    from :0,
                    uin: uin,
                    qboper: 2,
                    bosstrace: me.bosstrace
                });
            });
        },

        _unbind_events: function () {
            var me = this;

            me._$el.off('click');
        },

        _destroy: function () {
            var me = this;

            me._unbind_events();

            me._$el.remove();
            me._$el = null;
        }
    })
});/**
 * 剪贴板轮询拉取数据插件
 * @author hibincheng
 * @date 2014-01-21
 */
define.pack("./clipboard_plugin",["lib","common","$"],function(require, exports, module) {
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
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        constants = common.get('./constants'),
	    main,

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

	        var mod_params = routers._get_params();
	        if(mod_params && mod_params.m === 'clipboard') {
		        this._start_load();
	        }

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

            if(num) {
                document.title = ori_doc_title + ' ('+num+')';
	            this._$clip_num.addClass('new');
            } else {
                document.title = ori_doc_title;
	            this._$clip_num.removeClass('new');
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

});/**
 * 新手引导
 * @author xixinhuang
 * @date 2015-10-22
 */
define.pack("./first_guide",["common","$","./tmpl"],function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        cloud_config = common.get('./cloud_config'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),
        undefined;

    var guide_key = 'WY_WEB_TEMPORARY_FILE_USER_GUIDE_FLOAT';
    var guide_key_len = 3;
    var guide_page = 3;

    return new Module('first_guide', {

        render: function () {
            if(constants.IS_APPBOX){
                return;
            }
            var me = this;
            /**
             * 拉取云配置请求，这里复用以前的字段，但不覆盖，在前面加一位来标记
             * @example，以前的value占用个位，分别是0和1。则这次用0x和1x来标记
             */
            cloud_config.get(guide_key).done(function (values) {
                var value = values[guide_key].value;

                if (value.length < guide_key_len || value[0] != '1') {
                    guide_page = (value.length === guide_key_len-1 && value[0] === '1')? 1 : 3;
                    me._$el = $(tmpl['first_guide']({
                        guide_page: guide_page
                    })).appendTo($('body'));
                    me.bind_events();
                    var new_value = '11' + value[value.length-1];
                    cloud_config.set(guide_key, new_value);
                }
            });
        },

        close: function() {
            this._$el.remove();
            this._$el = null;
        },

        bind_events: function() {
            var close_btn = $('#close_guide'),
                continue_btn = $('.pop-btn'),
                slide_list = $('#slide_list'),
                slide_items = $('.icon-bullet'),
                me = this;

            close_btn.on('click', function() {
                me.close();
            });
            continue_btn.each( function(i, item) {
                item.addEventListener('click', function() {
                    if(i === guide_key_len-1){
                        //最后一个就直接关闭新手提示
                        me.close();
                        return;
                    }
                    me.slide_down(i+1);
                });
            });
            slide_items.each(function(i, slide_item) {
                slide_item.addEventListener('click', function() {
                    me.slide_down(i);
                });
            });
        },

        slide_down: function(next) {
            var slider = $('#slider'),
                mask = $('#mask'),
                slide_list = $('#slide_list'),
                current_item = $('.on');

            var next_item = $('.icon-bullet').eq(next);
            if(next_item.hasClass('on')){
                return;
            }

            current_item.removeClass('on');
            next_item.addClass('on');

            var className = 'loc' + (++next);
            var ver = next>guide_page? 'ver' : 'hor';
            mask.removeClass();
            mask.addClass('mask-wrapper').addClass(className).addClass(ver);

            var left = (next-1) * 100;
            slider.animate({
                left: "-" + left + "%"
            }, 1000);
            slider.find('.item').eq(next).show();
        }
    });
});/**
 * 安装客户端
 * @author bondli
 * @date 13-11-05
 */
define.pack("./install_app.install_app",["lib","common","$","app_download_css","./install_app.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),

        Module = common.get('./module'),

        undefined;

    require('app_download_css');
    var install_app = new Module('install_app', {

        ui: require('./install_app.ui'),

        render: function (config) {

        },

        show: function(name) {
            this.ui.show_download(name);
        },

        show_install_guide: function() {
            this.ui.show_install_guide();
        }

    });

    return install_app;
});/**
 * 安装客户端UI逻辑
 * @author bondli
 * @date 13-11-05
 */
define.pack("./install_app.ui",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        user_log = common.get('./user_log'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        https_tool = common.get('./util.https_tool'),
        request = common.get('./request'),

        tmpl = require('./tmpl'),

        widgets = common.get('./ui.widgets'),

        main_ui = require('./ui'),

        os_names = {
            'android': '微云Android版',
            'iphone': '微云iPhone版',
            'ipad': '微云iPad版'
        },
        config_data,
        curr_os_name, //当前要下载系统类型

        undefined;

    var ui = new Module('install_app_ui', {

        render: function (data) {
            config_data = data;
            this.get_$el().appendTo(main_ui.get_$aside_wrap()).hide();
            this._init_click();
        },

        //初始化图标点击事件
        _init_click: function () {
            var me = this;
            this.get_$el().on('click', 'a[data-action]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $el = $(this),
                    app_alias = $el.attr('data-action');

                if (app_alias) {
                    me.show_download(app_alias);
                }
            });
        },

        // --- 获取一些DOM元素 ---------

        get_$el: function () {
            return this._$el || ( this._$el = $(tmpl.install_app()) );
        },

        _to_download: function(os_name) {
            switch(os_name) {
                case 'android':
                    window.open(config_data.android && config_data.android.download_url);
                    user_log('GUIDE_INSTALL_ANDROID_CLICK_DOWN');
                    break;
                case 'iphone':
                    window.open(config_data.iphone && config_data.iphone.download_url);
                    user_log('GUIDE_INSTALL_IPHONE_CLICK_DOWN');
                    break;
                case 'ipad':
                    window.open(config_data.ipad && config_data.ipad.download_url);
                    user_log('GUIDE_INSTALL_IPAD_CLICK_DOWN');
                    break;
                case 'windows':
                    window.open(config_data.windows && config_data.windows.download_url);
                    break;
                case 'mac':
                    window.open(config_data.mac_sync && config_data.mac_sync.download_url);
                    break;
            }
        },

        _send_sms: function(phone_num) {
            var def = $.Deferred();
            /*var msg_url = 'http://www.weiyun.com/php/msgsend.php';
            msg_url = https_tool.translate_url(msg_url);
            $.get(msg_url, {number:phone_num, flag:1}, function (data){
                if(data.ret == '0') {
                    def.resolve();
                }else {
                    def.reject(data && data.ret);
                }
            }, 'json');*/
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'SmsSend',
                pb_v2: true,
                body: {
                    phone_number: phone_num,
                    sms_type: 0
                }
            }).done(function() {
                def.resolve();
            }).fail(function() {
                def.reject(6);
            });

            return def;
        },

        _create_dialog: function() {
            var me = this;
            var dialog = new widgets.Dialog({
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.download_dialog,
                mask_bg: 'ui-mask-white',
                handlers: {}
            });
            dialog.render_if();
            var $el = dialog.get_$el();
            $el
                .on('click', '[data-action=appdown]', function(e) {
                    e.preventDefault();
                    var os_name = $(this).attr('data-id');
                    me._to_download(os_name);
                })
                .on('click', '[data-action=send]', function(e) {
                    e.preventDefault();
                    var num = $el.find('input[data-id=phone_num]').val();
                    var $sms_err = $el.find('[data-id=sms_error]');
                    if(!(/^1[358]\d{9}$/.test(num))){
                        $sms_err.text('手机号码输入有误，请重新输入。').show();
                        return;
                    } else {
                        $sms_err.hide();
                    }
                    me._send_sms(num)
                        .done(function() {
                            $el.find('[data-id=sms_normal]').hide();
                            $el.find('[data-id=sms_info]').show();
                        })
                        .fail(function(err_code) {
                            if(err_code == '6' || err_code == '7') {
                                $sms_err.text('发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。').show();
                            } else {
                                $sms_err.text('网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。').show();
                            }
                        });
                    if(curr_os_name === 'android') {
                        user_log('GUIDE_INSTALL_ANDROID_SEND_BTN');
                    } else if(curr_os_name === 'iphone') {
                        user_log('GUIDE_INSTALL_IPHONE_SEND_BTN');
                    }
                })
                .on('click', '[data-action=resend]', function(e) {
                    e.preventDefault();
                    $el.find('[data-id=sms_info]').hide();
                    $el.find('[data-id=sms_normal]').show();
                });

            return dialog;
        },

        _get_dialog: function(os_name) {
            var dialog = this._dialog,
                me = this;

            if(!dialog) {
                dialog = this._dialog = me._create_dialog();
            }
            dialog.set_title(os_names[os_name]);
            dialog.set_content(tmpl[os_name+'_content']);
            return dialog;
        },


        show_download: function(os_name) {
            if(!os_name || !os_names[os_name]) {
                return;
            }
            curr_os_name = os_name;
            var dialog = this._get_dialog(os_name);
            dialog.show();
        },

        show_install_guide: function() {

            var dialog = new widgets.Dialog({
                empty_on_hide: false,
                destroy_on_hide: true,
                tmpl: tmpl.install_guide,
                mask_bg: 'ui-mask-white',
                handlers: {}
            });
            dialog.render_if();
            dialog.show();
            var $el = dialog.get_$el();
            var me = this;
            $el.on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]');
                var name = $target.attr('data-id');
                var action = $target.attr('data-action');
                if(action == 'close') {
                    dialog.hide();
                } else {
                    name && me._to_download(name);
                }
            });
        }

    });


    return ui;
});/**
 *
 * @author jameszuo
 * @date 13-3-1
 */
define.pack("./main",["$","lib","common","./tmpl","./access_check","./ui"],function(require, exports, module) {

	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		events = lib.get('./events'),
		routers = lib.get('./routers'),
		console = lib.get('./console'),
		collections = lib.get('./collections'),

		aid = common.get('./configs.aid'),
		urls = common.get('./urls'),
		Module = common.get('./module'),
		user_log = common.get('./user_log'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),

		tmpl = require('./tmpl'),
		access_check = require('./access_check'),

		module_hash_key,// url hash 中的模块参数名
		default_module_name,
		default_module_params,
		sub_modules_map,
		virtual_modules_map,//虚拟模块
		async_sub_modules = {},
		cur_mod_alias,  // 当前模块名
		cur_nav_mod_alias,//导航显示的模块名
		exclude_mods, // 要排除掉，不初始化的模块
		undefined;

	var main = new Module('main', {

		ui: require('./ui'),

		render: function(params) {
			params = params || {};
			// 排除的模块
			exclude_mods = params.exclude_mods || {};
		},

		set_default_module: function(mod_name, mod_params) {
			default_module_name = mod_name;
			default_module_params = mod_params;
			return this;
		},

		/**
		 * 将hash解析为模块路径，并分发
		 * @return {String[]} path
		 * @private
		 */
		_parse_hash: function(hash) {
			var path = hash && hash.split ? hash.split('.') : [];
			var mod_name = path.shift();
			this.async_render_module(mod_name, {
				path: path
			});
		},

		set_module_hash_key: function(key) {
			module_hash_key = key;
			return this;
		},

		/**
		 * 配置异步加载的模块
		 * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
		 */
		set_async_modules_map: function(map) {
			sub_modules_map = map;
			return this;
		},
		/**
		 * 配置虚拟模块
		 * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
		 */
		set_virtual_modules_map: function(map) {
			virtual_modules_map = map;
		},
		/**
		 * 配置虚拟模块
		 * @return {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
		 */
		get_virtual_modules_map: function() {
			return virtual_modules_map;
		},
		_get_history: function() {
			return this._history || (this._history = []);
		},
		/**
		 * 添加历史访问信息
		 * @param mode_name
		 */
		add_history: function(mode_name) {
			this._get_history().push(mode_name);
		},
		/**
		 *  获取历史访问信息
		 * @returns {[{String}]}
		 */
		get_history: function() {
			return this._get_history();
		},
		/**
		 * 异步载入模块
		 * @param {String} _mod_alias 模块URL|模块别名
		 * @param {*} [params]  传递给目标模块的参数
		 */
		async_render_module: function(_mod_alias, params) {
			var me = this;
			var mod_alias;
			this.set_cur_nav_mod_alias(_mod_alias);
			if(_mod_alias in sub_modules_map) {//直接子模块
				mod_alias = _mod_alias;
			} else if(_mod_alias in virtual_modules_map) {//映射子模块
				mod_alias = virtual_modules_map[_mod_alias].point;
			} else {//默认模块
				this.set_cur_nav_mod_alias(mod_alias = default_module_name);
			}
			cur_mod_alias = mod_alias;

			// 如果已存在，则激活
			if(async_sub_modules.hasOwnProperty(mod_alias)) {
				var mod = async_sub_modules[mod_alias];
				me.activate_sub_module(mod, params);
				me.trigger('activate_sub_module', mod_alias, _mod_alias);
				if(_mod_alias in virtual_modules_map) {//来自虚拟子模块
					virtual_modules_map[_mod_alias].after.call();
				}
				me.add_history(_mod_alias);
			}
			// 不存在，异步加载，然后激活
			else {
				require.async(mod_alias, function(module_dir) {
					cur_mod_alias = mod_alias;
					var main_mod = sub_modules_map[mod_alias];

					if(!module_dir || !module_dir.get) {  // 模块加载失败（加载失败时 module_dir 可能指向其他模块，这是seajs的一个bug）
						console.error('模块加载失败：', mod_alias, main_mod);
						return;
					}

					var mod = module_dir.get(main_mod);
					async_sub_modules[mod_alias] = mod;

					me.activate_sub_module(mod, params, mod_alias);
					me.trigger('activate_sub_module', mod_alias, _mod_alias);
					if(_mod_alias in virtual_modules_map) {//来自虚拟子模块
						virtual_modules_map[_mod_alias].after.call();
					}
					me.add_history(_mod_alias);
				});
			}
		},

		/**
		 * 激活指定子模块，并隐藏其他子模块
		 * @param {Module} cur_mod 要激活的子模块
		 * @param {*} params 传递给目标模块的参数
		 */
		activate_sub_module: function(cur_mod, params) {
			for(var mod_alias in async_sub_modules) {
				var async_sub_mod = async_sub_modules[mod_alias];
				if(async_sub_mod !== cur_mod) {
					async_sub_mod.deactivate();
					this.stopListening(async_sub_mod, 'resize', this.buffer_sync_size);
				}
			}

			this.ui.update_module_ui(cur_mod);

			cur_mod.render();
			cur_mod.activate(params);
			this.listenTo(cur_mod, 'resize', this.buffer_sync_size);
		},

		sync_size_timer: null,
		buffer_sync_size: function() {
			var me = this, timer = me.sync_size_timer;
			if(timer) {
				clearTimeout(timer);
			}
			me.sync_size_timer = setTimeout(function() {
				me.ui.sync_size();
			}, 0);
		},

		/**
		 * 获取当前激活的模块别名
		 * @return {String}
		 */
		get_cur_mod_alias: function() {
			return cur_mod_alias;
		},
		/**
		 * 获取导航显示的模块名称
		 * @returns {String}
		 */
		get_cur_nav_mod_alias: function() {
			return cur_nav_mod_alias;
		},
		/**
		 * 设置导航显示的模块名称
		 * @param {String} mod_alias
		 */
		set_cur_nav_mod_alias: function(mod_alias) {
			cur_nav_mod_alias = mod_alias;
		},
		/**
		 * 判断模块是否已加载并且已激活
		 * @param {String} mod_alias 模块别名
		 */
		is_mod_loaded: function(mod_alias) {
			var mod = async_sub_modules[mod_alias]
			return !!mod && mod.is_activated();
		},

		/**
		 * 切换模块
		 * @param {String} mod_alias
		 * @param {Object} [params]
		 * @param {boolean} [force] 强制切换模块
		 */
		switch_mod: function(mod_alias, params, force) {
			if(mod_alias !== cur_mod_alias || force)
				routers.go($.extend({m: mod_alias}, params));
		},

		/**
		 * 获取反馈的url
		 * @returns {String}
		 */
		get_feedback_url: function() {
			var ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
			return urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
		},

		// 加载upload
		async_render_upload: function() {
			var def = $.Deferred();
			require.async('upload', function(upload_mod) {
				var upload_route = upload_mod.get('./upload_route');
				upload_route.render();
				def.resolve(upload_route.type);
			});

			// web安装控件提示（不支持mac、safari）
			if(!constants.IS_APPBOX && constants.IS_WINDOWS && window.navigator.platform === 'Win32' && !$.browser.mozilla && !(window.FileReader && window.Worker)) {
				setTimeout(function() {
					query_user.on_ready(function() {
						require.async('install_upload_plugin', function(mod) {
							var install;
							// 初始化控件安装模块
							mod && (install = mod.get('./install')) && install.tips();
							var tips = $('div[data-id="plugin_install_widget"]');
							tips.css({ 'left': 'auto', 'right': '378px', 'top': '60px' });
							tips.find('.g-arrow-top').css('left', '250px');
						});
					});
				}, 1000);
			}

			return def;
		},

		//appbox上报用户环境
		report_user_env: function(upload_type) {
			var me = this;
			//操作系统、QQ版本、内核类型（浏览器类型）、上传组件类型（表单、flash、控件）
			if(constants.IS_APPBOX) {
				var rpt_data = {
					"extInt1": 0, //QQ版本 navigator.userAgent
					"extInt2": constants.IS_WEBKIT_APPBOX ? 1 : 0, //内核类型,1:webkit,0:ie
					"extString1": constants.OS_NAME,//操作系统
					"extString2": upload_type //上传组件类型
				};
				if(window.external.GetVersion) { //QQ1.98及以后直接可以获取协议号，协议号查版本号：http://qqver.server.com/
					var qq_ver = window.external.GetVersion();
					rpt_data.extInt1 = parseInt(qq_ver, 10);
					user_log('APPBOX_USER_ENV', 0, rpt_data);
				}
				else {
					var state = 'no_goto_weiyun',
						iframe = document.createElement('iframe'),
						loadfn = function() {
							if(state === 'had_goto_weiyun') {
								var qq_ver = iframe.contentWindow.name;    // 读取数据
								rpt_data.extInt1 = parseInt(qq_ver, 10);
								user_log('APPBOX_USER_ENV', 0, rpt_data);
								me._remove_iframe(iframe);
							} else if(state === 'no_goto_weiyun') {
								state = 'had_goto_weiyun';
								iframe.contentWindow.location = constants.HTTP_PROTOCOL + "//www.weiyun.com/set_domain.html";    // 设置的代理文件
							}
						};
					iframe.src = constants.HTTP_PROTOCOL + '//www.weiyun.com/appbox/get_version.html';
					iframe.width = iframe.height = 0;
					if(iframe.attachEvent) {
						iframe.attachEvent('onload', loadfn);
					} else {
						iframe.onload = loadfn;
					}
					document.body.appendChild(iframe);
				}

			}
		},

		_remove_iframe: function(iframe) {
			iframe.contentWindow.document.write('');
			iframe.contentWindow.close();
			document.body.removeChild(iframe);
		}

	});

	main.once('render', function(params) {

		if(!query_user.check_cookie()) { //没有登陆态则只启动访问控制模块，登陆后后进行页面reload，那时才执行后面的
			access_check.start();
			return;
		}
		if(sub_modules_map && !$.isEmptyObject(sub_modules_map)) {
			// 初始化 url hash 映射
			this.
				listenTo(routers, 'init', function() {
					var default_mod = routers.get_param(module_hash_key) || default_module_name;
					this._parse_hash(default_mod);
				})
				.listenTo(routers, 'add.' + module_hash_key, function(mod_name) {
					this._parse_hash(mod_name);
				})
				.listenTo(routers, 'change.' + module_hash_key, function(mod_name) {
					this._parse_hash(mod_name);
				})
				.listenTo(routers, 'remove.' + module_hash_key, function() {
					this.async_render_module(default_module_name, default_module_params);
				});

			// 初始化路由
			routers.init();
		}

		// 启动访问控制模块
		access_check.start();

		if(!('upload' in exclude_mods)) {
			//独立加载上传模块
			var me = this;
			if(constants.IS_APPBOX || constants.IS_PHP_OUTPUT) {
				var up_def = me.async_render_upload();
				//上报用户环境
				setTimeout(function() {
					up_def.done(function(upload_type) {
						me.report_user_env(upload_type);
					});
				}, 3000);
			} else {          //直出失败时 上传模块延迟加载2000ms  修复 ie8+flash player14 无法触发上传的情况.
				setTimeout(function() {
					var up_def = me.async_render_upload();
					//上报用户环境
					setTimeout(function() {
						up_def.done(function(upload_type) {
							me.report_user_env(upload_type);
						});
					}, 3000);
				}, 2000);
			}
		}

		//WEB用户环境上报，用于对账 by jackbinwu
		if(!constants.IS_APPBOX && !constants.IS_QZONE) {
			query_user.on_ready(function() {
				user_log('WEB_USER_ENV');
			});
		}
	});

	return main;
});/**
 * qboss
 */
define.pack("./qboss_info",["lib","common","$"],function(require, exports, module){
	
	var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        //request = common.get('./request'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),
        uin = query_user.get_uin_num(),

        win = window,

		undefined;
	
	return new function(){

        /**
         * 拉取单条广告
         * @param opt
         *      {
					board_id	: 广告位id
					uin			: 用户uin
				}
         * @returns {*}
         */
		this.get = function(opt){
            var defer		= $.Deferred();
            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_strategy',
                data :{
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback",
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });

			return defer.promise();
		};

        /**
         * 拉取多条广告
         * @param opt
         *      {
					board_id	: 广告位id
					uin			: 用户uin
					need_cnt    : 拉取条数
				}
         * @returns {*}
         */
        this.getMulti = function(opt){

            var defer		= $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy',
                data: {
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                noNeedAutoXss : true,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                need_cnt : opt.need_cnt,
                jsonpCallback:"success_callback",
                success: function(data){
                    (data && data.code === 0) ? defer.resolve(data) : defer.reject(data);
                },
                error: function(data){
                    defer.reject(data || {code: -1,message: '服务器繁忙'});
                }
            });

            return defer.promise();
        }

        /**
         * QBOSS广告上报数据（曝光、点击、关闭量）
         * (曝光量在拉取广告信息cgi时已经统计，不需要额外统计)
         * 拉取cgi：http://boss.qzone.qq.com/fcg-bin/fcg_rep_strategy
         * @param opt
         * {
                 from	    : 0, 请求来源 0 PC端，1 WAP端，2 手机端
                 uin		: PSY.user.getLoginUin(),  登录用户的qq号
                 qboper     : 2, 操作类型，2点击 3关闭
                 bosstrace  : ''  广告标识串，在拉取广告信息cgi里吐出
             }
         * @returns {*}
         */
        this.report = function(opt){
            setTimeout(function() {
                var report_url = urls.make_url('//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                    from: opt.from,
                    uin: opt.uin,
                    qboper: opt.qboper
                });
                //上报
                var img = new Image();

                img.onload = img.onerror = img.onabort = function () {
                    this.onload = this.onerror = this.onabort = null;
                };
                img.src = report_url;
            },5000)
        }
	};
});
/**
 * 空间信息
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./space_info.space_info",["lib","common","$","./tmpl","./space_info.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        request = common.get('./request'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var space_info = new Module('main_space_info', {

        ui: require('./space_info.ui'),

        render: function () {
            var me = this;
            this.once('render', function () {
                query_user.on_every_ready(function (user) {
                    me._refresh_by_user(user);
                });
            });
        },

        refresh: function () {
            var me = this;
            var usr = query_user.get_cached_user();
            if (usr) {
                request.xhr_get({
                    url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
                    cmd: 'get_timestamp',
                    body: { local_mac: '0' }
                })
                    .ok(function (msg, body) {
                        me._refresh(Math.max(0, body['used_space'])||0, Math.max(0, body['total_space'])||0);
                    });
            } else {
                query_user.get(true, false, false, function (user) {
                    me._refresh_by_user(user);
                });
            }
        },

        _refresh_by_user: function (user) {
            this.trigger('load', user.get_used_space(), user.get_total_space());
        },

        _refresh: function (used, total) {
            this.trigger('load', used, total);
        },

        add_used_space_size: function (size) {
            this.ui.add_used_space_size(size);
        }
    });

    return space_info;
});/**
 * 空间信息UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./space_info.ui",["lib","common","$","./tmpl","./space_info.space_info"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        tmpl = require('./tmpl'),
        space_info,

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var ui = new Module('main_space_info_ui', {

        _used_space: 0,
        _total_space: 0,

        render: function () {
            space_info = require('./space_info.space_info');

            this._$el = $('#_main_space_info');
            this._$el.html(tmpl.space_info());

            // 文字
            this.$used_space_text = $('#_main_space_info_used_space_text');
            // 文字
            this.$total_space_$text = $('#_main_space_info_total_space_text');
            // 进度条
            this._$bar = $('#_main_space_info_bar');

            this
                // 每次加载完成后更新DOM
                .listenTo(space_info, 'load', function (used_space, total_space) {
                    this._used_space = used_space;
                    this._total_space = total_space;
                    this.trigger('space_size_changed');
                })

                .on('space_size_changed', function () {
                    this._update_text();
                    this._update_bar();
                });
        },

        /**
         * 增加已使用的空间（仅本地缓存）
         * @param {Number} size
         */
        add_used_space_size: function (size) {
            this._used_space += size;
            this.trigger('space_size_changed');
        },

        // 文字
        _update_text: function () {
            this.$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this.$total_space_$text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.ceil(this._used_space / this._total_space * 100);
            this._$bar
                .css('width', Math.min(percent, 100) + '%')

                .parent()
                .toggleClass('full', percent >= 90)
                .attr('title', percent + '%');

            percent >= 100 && $('#_main_space_info').addClass('exceed');
        },

        get_used_space: function(){
            return this._used_space;
        },
        get_total_space: function(){
            return this._total_space;
        }
    });

    return ui;
});/**
 * Main UI
 * @author jameszuo
 * @date 13-3-21
 *
 * @modified maplemiao
 * @date 17-1-10
 */
define.pack("./ui",["$","lib","common","./tmpl","./Search_box","./weiyun_vip","./first_guide","./ad_board.ad_board","./main","./access_check","./clipboard_plugin","./user_info","./space_info.space_info"],function(require, exports, module) {

	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		routers = lib.get('./routers'),
		console = lib.get('./console').namespace('main/ui'),

		aid = common.get('./configs.aid'),
		urls = common.get('./urls'),
		Module = common.get('./module'),
		ret_msgs = common.get('./ret_msgs'),
		user_log = common.get('./user_log'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		global_event = common.get('./global.global_event'),
		widgets = common.get('./ui.widgets'),
		scr_reader_mode = common.get('./scr_reader_mode'),
		scroll_bar = common.get('./ui.scroll_bar'),

		tmpl = require('./tmpl'),
		Search_box = require('./Search_box'),
		weiyun_vip = require('./weiyun_vip'),
		first_guide = require('./first_guide'),
		ad_board = require('./ad_board.ad_board'),

		main,
		inited,
		scroller,
		access_check,
		is_need_indep = false,
		$win = $(window),
		is_visible = false,
		sync_size_queue = [],
		undefined;

	var ui = new Module('main_ui', {

		render: function() {
			main = require('./main');
			access_check = require('./access_check');

			var login_rsp = window.g_serv_login_rsp;
			is_need_indep = (login_rsp && login_rsp.rsp_body)? login_rsp.rsp_body.is_pwd_open : false;

			this._init_ui();
			this._render_user_info();
			this._init_log();
			this._adjust_copyright(); //调整版权声明位置
			this.listenTo(global_event, 'window_resize', this._adjust_copyright);
		},

		_init_ui: function() {
			var me = this,
				body_class = 'page-home',
				$ui_root;

			if(constants.IS_PHP_OUTPUT && ($ui_root = $('#_main_ui_root')) && $ui_root[0]) {
				me._$ui_root = $ui_root;
				me._init_ui_on_user_done();
			} else {
				$ui_root = me._$ui_root = is_need_indep? $(tmpl.indep()) : $(tmpl.root());
				$(document.body).addClass(body_class).append($ui_root);

				me.sync_size();

				// query_user 完成后才显示UI
				if(query_user.get_cached_user()) {
					me._init_ui_on_user_done();
				} else {
					me.listenTo(query_user, 'done', function(msg, ret) {
						// 加载成功或返回非1024、1030的错误时，才显示UI
						if(!ret_msgs.is_sess_timeout(ret) && !ret_msgs.is_indep_invalid(ret)) {
							me._init_ui_on_user_done();
						}
					});
					me.listenTo(query_user, 'load', function() {
						this.stopListening(query_user, 'load done');
						this._init_ui_on_user_done();
					});
				}
			}

			// for 读屏软件 - james
			if(scr_reader_mode.is_enable()) {
				this._init_aria_content_tip();
			}

			// 同步节点高度
			me._render_resizing();

			me.listenTo(main, 'activate_sub_module', function() {
				me._hide_loading();
				me.sync_size();
			});

			me.listenTo(access_check, 'qq_login_ui_show', function() {
				if(me.is_visible()) {
					widgets.mask.show('qq_login', null, true);
				}
			})
			.listenTo(access_check, 'qq_login_ui_hide', function() {
				widgets.mask.hide('qq_login');
			});
		},

		_init_ui_on_user_done: function() {
			if(inited) return;

			is_visible = true;

			// 初始化导航
			this._render_nav();
			// 初始化顶部操作条
			this._render_top();
			// 渲染搜索框
			this._render_search_box();

			// 渲染下载引导提示
			// 新手引导
			first_guide.render();

			// 首页左下角广告位
            ad_board.render();

			weiyun_vip.render();

			// 初始分剪贴板内容拉取
			this._render_clipboard_plugin();
			if(!query_user.get_cached_user().is_weixin_user()) {
				//启动通知提醒
				this._render_notification();
			}

			// 更新body大小
			this.sync_size();
			inited = true;
		},

		_render_photo_guide: function() {
			var user = query_user.get_cached_user();
			if(user) {
				require.async('photo_guide', function(mod) {
					mod.get('./photo_guide').render();
				});
			}
		},

		_render_clipboard_plugin: function() {
			var clipboard_plugin = require('./clipboard_plugin'),
				$clip_num = this._get_$nav().find('[data-id=clip-num]').closest('li');
			clipboard_plugin.init($clip_num);
		},

		// 显示用户信息
		_render_user_info: function() {
			require('./user_info').render();

			this._render_space_info();
		},

		// 显示空间信息
		_render_space_info: function() {
			// 初始化web空间信息
			require('./space_info.space_info').render();
		},

		//通知提醒
		_render_notification: function() {
			require.async('notification', function(mod) {
				mod.get('./notification')();
			});
		},

		_adjust_copyright: function() {
			var nav_distance = $('#_main_nav_split').height(),
				copyright = $('.layout-aside-ft');
			if(nav_distance < 30) {
				copyright.css('display', 'none');
			} else {
				copyright.css('display', 'block');
			}
			this.get_$aside_box().css('overflow-y', nav_distance <= 0 ? 'auto' : 'hidden');
		},

		// OZ上报
		_init_log: function() {
			$('#_main_feedback').on('click', function() {
				user_log('HEADER_USER_FACE_FEEDBACK');
			});
		},

		_toggle_base_header: function(flag) {
			this.get_$header_banner().css('display', flag ? '' : 'none');
			this.get_$bars().css('display', flag ? '' : 'none');
		},

		_toggle_base_body: function(flag) {
			//this.get_$body_box().toggle(!!flag);
			this.get_$main_content().css('display', flag ? '' : 'none');
		},

		get_$header_banner: function() {
			return $('#_main_header_banner');
		},

		get_$manage: function() {
			return $('#_main_header_manage');
		},

		get_$manage_num_position: function() {
			var manage_num = this.get_$manage().find('.j-manage-num');
			if(!this.manage_num_position) {
				this.manage_num_position = {
					'top': parseInt(manage_num.css('top')),
					'left': parseInt(manage_num.css('left'))
				};
			}
			return this.manage_num_position;
		},

		show_manage_num: function(callback) {
			var manage_num = this.get_$manage().find('.j-manage-num'),
				position = this.get_$manage_num_position();
			//小红点动画
			manage_num.css({
				'top': (position.top + 550) + 'px',
				'left': (position.left + 500) + 'px'
			}).show().addClass('sync-num-animation');
			setTimeout(function() {
				manage_num.css({
					'top': position.top + 'px',
					'left': position.left + 'px'
				}).removeClass('sync-num-animation');
				callback && callback();
			}, 1000);
		},

		get_$search_box: function() {
			return this._get_$fixed_header().find('.j-header-search');
		},

		get_$normal: function() {
			return $('#_main_normal');
		},

		get_$edit: function() {
			return $('#_main_edit');
		},

		get_$edit_count: function() {
			return this.get_$edit().find('.j-edit-count');
		},

		get_$edit_count_text: function() {
			return this.get_$edit().find('.j-edit-count-text');
		},

		get_$bar0: function() {
			return $('#_main_bar0');
		},

		get_$bar1: function() {
			return $('#_main_bar1');
		},

		get_$bar2: function() {
			return $('#_main_bar2');
		},

		get_$bars: function() {
			return this.get_$bar1().add(this.get_$bar2())
		},

		get_$top: function() {
			return $('#_main_top');
		},

		get_$share_head: function() {
			return $('#_main_share_header');
		},

		get_$station_head: function() {
			return $('#_main_station_header');
		},

		get_$body_hd: function() {
			return $('#_main_hd');
		},

		get_$body_box: function() {
			return $('#_main_box');
		},

		get_$main_content: function() {
			return $('#_main_content');
		},

		get_$ui_root: function() {
			return this._$ui_root;
		},

		is_visible: function() {
			return is_visible;
		},

		get_fixed_header_height: function() {
			return this._get_$fixed_header().height();
		},

		/**
		 * 获取内容区域的尺寸
		 */
		get_main_area_size: function() {
			var win_w = $win.width(),
				win_h = $win.height(),
				w = win_w - this._get_$nav().width(),
				h = win_h - this.get_fixed_header_height() - 2;

			return [w, h];
		},

		update_module_ui: function(cur_mod) {
			var mod_cls_name = 'module-' + cur_mod.module_name,
				root = this.get_$ui_root()[0];
			root.className = root.className.replace(/\s*module\-\w+\s*/g, ' ').replace(/\s+/, ' ') + ' ' + mod_cls_name;
		},

		_get_$fixed_header: function() {
			return this._$fixed_header || (this._$fixed_header = $('#_main_fixed_header'));
		},

		_get_$nav: function() {
			return this._$nav || (this._$nav = $('#_main_nav'));
		},

		get_$aside_box: function() {
			return this._$aside_box || (this._$aside_box = $('#_main_nav_aside_box'));
		},
		get_$aside_wrap: function() {
			return this._$aside_wrap || (this._$aside_wrap = $('#_main_nav_aside_wrap'));
		},
		get_$nav_split: function() {
			return this._$nav_split || (this._$nav_split = $('#_main_nav_split'));
		},
		get_$aside_scroll: function() {
			return this._scroll_bar || ( this._scroll_bar = new scroll_bar({
				$parent: this.get_$aside_box()
			}));
		},

		//获取上传按钮对象
		get_$uploader: function() {
			return this._get_$fixed_header().find('[data-action="upload"]');
		},
		//获取上传下拉面板
		get_$upload_drop: function() {
			return this._get_$fixed_header().find('.j-upload-drop');
		},
		// 初始化顶部操作栏
		_render_top: function() {
			var me = this;
			var $top = me.get_$edit();

			$top.on('click', '[data-action=edit_cancel_all]', function(e) {
				e.preventDefault();

				global_event.trigger('edit_cancel_all');
			});
		},
		// 初始化导航栏
		_render_nav: function() {
			var $nav = this._get_$nav();
			var me = this;

			$nav.show().on('click', 'li[data-mod]', function(e) {
				e.preventDefault();

				var $el = $(this),
					mod_alias = $el.attr('data-mod');

				//切换之前触发事件，关闭任务管理器（必须保证这个时序，缓存的模块显示状态才能恢复）
				me.trigger('before_activate_sub_module');

				routers.go({ m: mod_alias });
				// 如果模块已激活，点击模块入口时触发
				if(main.is_mod_loaded(mod_alias)) {
					global_event.trigger(mod_alias + '_reenter');
				}
			})
			.on('click', 'a[data-refresh]', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var $el = $(this),
					mod_alias = $el.attr('data-refresh');
				if(mod_alias) {//触发刷新事件 譬如 recent_refresh
					var virtual_mod = main.get_virtual_modules_map()[mod_alias];
					if(virtual_mod) {//来自映射的模块，需要指定真正对应的的刷新操作
						mod_alias = virtual_mod.point;
					}
					global_event.trigger(mod_alias + '_refresh');
				}
			})
			.on('click', 'li[data-op]', function(e) {
				var $el = $(this),
					op = $el.attr('data-op');
				user_log(op);
			});

			// 更新导航栏item的选中样式
			var current_nav = function(mod_alias) {
				var cur_cls = 'cur';
				$nav.find('[data-mod]').removeClass(cur_cls).filter('[data-mod="' + mod_alias + '"]').addClass(cur_cls);
			};

			// 激活子模块时，同步更新导航栏item的选中样式
			me.listenTo(main, 'activate_sub_module', function(mod_alias, virtual_mod_alias) {
				current_nav(virtual_mod_alias || mod_alias);
			});

			// 更新导航栏item的选中样式
			var cur_mod_alias = main.get_cur_nav_mod_alias();
			if(cur_mod_alias) {
				current_nav(cur_mod_alias);
			}
		},

		// 显示、隐藏 loading
		_hide_loading: function() {
			$('#loading-text').remove();
			$('#loading-icon').remove();
			$('html').css('backgroundColor', '');
		},

		_render_search_box: function() {
			var $el = this.get_$search_box();
			$el.show();
			if(!this.search_box) {
				this.search_box = new Search_box({
					$el: $el,
					input_selector: 'input'
				});
			}
		},

		/**
		 * 自动同步节点高度
		 * @private
		 * @author james
		 */
		_render_resizing: function() {
			var me = this,
				$nav = me._get_$nav(),
				$content = me.get_$main_content();

			// 主体内容区
			sync_size_queue.push({
				$el: $content,
				fn: function(win_width, win_height) {
					var pos_top = $content.offset().top,
						margin_top = parseInt($content.css('marginTop')) || 0,
						padding_top = parseInt($content.css('paddingTop')) || 0,
						new_height = win_height - pos_top - margin_top - padding_top;
					$content.height(new_height);
				}
			});

			// 左侧导航栏
			sync_size_queue.push({
				$el: $nav,
				fn: function(win_width, win_height) {
					me.get_$aside_wrap().width('100%');
					var $nav_height = win_height - $nav.offset().top - 2;
					$nav.height($nav_height);

					var $box_height = $nav_height - (me.get_$aside_box().offset().top - $nav.offset().top);
					me.get_$aside_box().height($box_height);
					me.get_$nav_split().height(0);
					var wrap_height = me.get_$aside_wrap().height();
					if(wrap_height < $box_height) {
						me.get_$nav_split().height($box_height - wrap_height);
					}
				}
			});

			// IE6最小宽度
			if(!constants.IS_APPBOX && $.browser.msie && $.browser.version < 7) {
				var root_min_width = 960,
					$root = this.get_$ui_root();
				sync_size_queue.push({
					$el: $root,
					fn: function(win_width) {
						if(win_width < root_min_width) {
							$root.width(root_min_width);
						} else {
							$root.css('width', '');
						}
						$root.repaint();
					}
				});
			}

			me.sync_size();
			me.listenTo(global_event, 'window_resize_real_time', function(win_width, win_height) {
				me.sync_size(win_width, win_height);

				scroller.trigger_resized();
			});
		},

		/**
		 * 同步size
		 * @param {Number} [win_width]
		 * @param {Number} [win_height]
		 * @private
		 */
		sync_size: function(win_width, win_height) {
			if(typeof win_width !== 'number') {
				win_width = $win.width();
			}
			if(typeof win_height !== 'number') {
				win_height = $win.height();
			}

			var me = this;
			for(var i = 0, l = sync_size_queue.length; i < l; i++) {
				sync_size_queue[i].fn.call(me, win_width, win_height);
			}

			var area_size = this.get_main_area_size();
			this.trigger('area_resize', area_size[0], area_size[1]);
			this.get_scroller().trigger_resized();
		},

		get_scroller: function() {
			if(!scroller) {
				var Scroller = common.get('./ui.scroller');
				scroller = new Scroller(this.get_$main_content());
			}
			return scroller;
		},

		toggle_edit: function(is_edit, count) {
			if(is_edit) {
				if(count) {
					this.get_$edit_count_text().text(count);
					this.get_$edit_count().show();
				} else {
					this.get_$edit_count().hide();
				}
				this.get_$normal().hide();
				this.get_$top().addClass('mod-edit-nav');
				this.get_$edit().show();
			} else {
				this.get_$edit_count().hide();
				this.get_$edit().hide();
				this.get_$top().removeClass('mod-edit-nav');
				this.get_$normal().show();
			}
		},

		_init_aria_content_tip: function() {
			var me = this;
			var $tip_for_keys = $('<div tabindex="0" style="position:fixed;_position:absolute;top:0;">快捷键说明：按下Alt加X键聚焦到内容区域开始位置。</div>');
			var $tip_for_aria = $('<div tabindex="0" style="position:fixed;_position:absolute;top:0;">内容区域</div>').on('focusin', function() {
				$(this).text(me.get_$body_box().children(':visible[data-label-for-aria]').attr('data-label-for-aria') || '内容区域');
			});

			// 按下快捷键聚焦到该提示上 - james
			$(document).on('keydown.tip_for_aria', function(e) {
				if(e.altKey && e.which === 88) { // 88 = X
					$tip_for_aria.blur().focus();
				}
			});

			me._get_$nav().before($tip_for_keys).after($tip_for_aria);
		}
	});
	return ui;
});/**
 * 显示一些用户信息（昵称、独立密码设置状态等等）
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./user_info",["$","lib","common"],function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		text = lib.get('./text'),
		events = lib.get('./events'),

		query_user = common.get('./query_user'),
		constants = common.get('./constants'),
		page_event = common.get('./global.global_event').namespace('page'),
		urls = common.get('./urls'),
		aid = common.get('./configs.aid'),
		widgets = common.get('./ui.widgets'),
		user_log = common.get('./user_log'),
		Pop_panel = common.get('./ui.pop_panel'),
		https_tool = common.get('./util.https_tool'),

		win = window,
		last_has_pwd,
		undefined;

	var user_info = {
		render: function() {
			this._render_pwd_locker();
			this._render_purchase_capacity();
			if(!constants.IS_APPBOX && !constants.IS_QZONE){
				this._render_logout();
			}
			query_user.on_ready(this._init_user, this);
		},

		_init_user: function(user) {
			// modify by cluezhang, 新的登录模块在帐号主动切换时直接刷新页面了，所以移除掉旧有的界面复用逻辑
			this._render_face(user);
			this.set_nickname(user.get_nickname());

			if(!user.is_weixin_user()) {
				if(last_has_pwd !== user.has_pwd()) {
					this.set_pwd_locker(user.has_pwd());
				}
			} else {
				$('#_main_pwd_locker').hide();
			}
			this._render_feedback();
		},

        /**
		 * 购买容量按钮
         * @private
         */
        _render_purchase_capacity: function () {
			$('#_main_purchase_capacity').on('click', function (e) {
				e.stopPropagation();
				e.preventDefault();

				window.open(constants.HTTP_PROTOCOL + '//www.weiyun.com/vip/capacity_purchase.html?from=web');
            })
        },

		/**
		 * 设置独立密码的锁图标
		 * @param {Boolean} locked
		 */
		set_pwd_locker: function(locked) {
			var $locker = this._get_$locker();
			$locker.find('.j-pwd-state').text(locked ? '关闭' : '开启');
		},

		/**
		 * 更新昵称
		 * @param {String} nickname
		 */
		set_nickname: function(nickname) {
			$('#_main_nick_name').text(nickname);
		},

		/**
		 * 头像、头像的菜单
		 * @param {query_user.User} user
		 */

		_render_face: function(user) {
			var $face = $('#_main_face'),
				$face_menu = $('#_main_face_menu'),
				$face_img = $face.find('img');

			new Pop_panel({
				host_$dom: $face,
				$dom: $face_menu,
				show: function() {
					$face_menu.show();
					// OZ上报
					user_log('HEADER_USER_FACE_HOVER');
				},
				hide: function() {
					$face_menu.hide();
				},
				delay_time: 300
			});

			$face_img.attr('src', https_tool.translate_url(user.get_avatar()));
		},

		/**
		 * 独立密码锁逻辑
		 * @private
		 */
		_render_pwd_locker: function() {
			var me = this;

			page_event
				.on('set_indep_pwd', function() {
					me.set_pwd_locker(true);
				})
				.on('unset_indep_pwd', function() {
					me.set_pwd_locker(false);
				});

			// 点击独立密码图标时加载独立密码设置模块
			me._get_$locker().on('click', function(e) {
				e.preventDefault();

				if(query_user.get_cached_user()) {
					require.async('indep_setting', function(indep_setting) {
						var indep_setting_mod = indep_setting.get('./indep_setting');
						indep_setting_mod.show();
					});
				}

				user_log('INDEP_PWD');
			});
		},

		_render_feedback: function() {
			var me = this;
			$('#_main_feedback').on('click', function(e) {
				e.preventDefault();
				document.domain = 'weiyun.com';
				var $iframe = $('<iframe frameborder="0" src="about:blank" data-name="iframe"></iframe>');
				$iframe.css({
					'zIndex': '1000',
					'width': '100%',
					'height': '488px'
				}).attr('src', constants.HTTP_PROTOCOL + '//www.weiyun.com/feedback.html?web');

				me.$ct = $('<div data-no-selection class="full-pop" style="z-index: 1000; position: fixed; left: 50%; top: 50%"></div>');
				me.$ct.css({
					"width": "478px",
					"height": "490px",
					"margin-left": "-239px",
					"margin-top": "-245px"
				});
				me.$ct.appendTo(document.body);
				$iframe.appendTo(me.$ct);

				me.add_full_mask();
				me._bind_feedback_events();
				me.$ct.show();
			});
		},

		add_full_mask: function() {
			this.$mask = $('<div class="full-mask"></div>').appendTo(document.body);
		},

		_bind_feedback_events: function() {
			var me = this;
			var onmessage = function(e) {
				var data = e.data;
				//IE8、9只接收字符串，需要转换下
				if(($.browser.msie && $.browser.version <= 9)) {
					data = JSON.parse(data);
				}
				//IE7以下有问题，直接关闭弹窗
				if(data.action === 'close' || ($.browser.msie && $.browser.version <= 7)) {
					me.$ct && me.$ct.remove();
					me.$ct = null;

					me.$mask && me.$mask.remove();
					me.$mask = null;
				} else if(data.action === 'send_succeed') {
					me.$ct.find('iframe').css('height', '198px');
					me.$ct.css({
						"width": "399px",
						"height": "202px",
						"margin-left": "-200px",
						"margin-top": "-101px"
					});
				}
			};
			if(typeof window.addEventListener != 'undefined') {
				window.addEventListener('message', onmessage, false);
			} else if(typeof window.attachEvent != 'undefined') {
				window.attachEvent('onmessage', onmessage);
			}
		},

		_render_logout: function() {
			var me = this;

			// 退出按钮
			$('#_main_logout').on('click', function(e) {
				e.preventDefault();

				// 判断是否正在上传文件
				var msg = page_event.trigger('before_unload');
				if(msg) {
					widgets.confirm('确认', msg, '', function() {
						page_event.trigger('confirm_unload');
						me._logout();
					});
				} else {
					me._logout();
				}

				user_log('LOGIN_OUT');
			});
		},

		_logout: function() {
			//todo: ptlogin.qq.com切换
			//query_user.destroy();
			//window.location.href = 'http://www.weiyun.com';  //默认都跳转到 该地址
			if(typeof pt_logout !== 'undefined') {
				pt_logout.logoutQQCom(function() {
					query_user.destroy();
					window.location.href = 'http://www.weiyun.com';  //默认都跳转到 该地址
				});
			} else {
				require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
					pt_logout.logoutQQCom(function() {
						query_user.destroy();
						window.location.href = 'http://www.weiyun.com';  //默认都跳转到 该地址
					});
				});
			}
		},
		_get_$locker: function() {
			return $('#_main_pwd_locker');
		},

		_get_face_by_uin: function(uin) {
			var def = $.Deferred();

			/*初始化 头像信息*/
			$.ajax({
				url: urls.make_url('https://ssl.ptlogin2.weiyun.com/getface', {
					appid: 527020901,
					imgtype: 3,
					encrytype: 0,
					devtype: 0,
					keytpye: 0,
					uin: uin,
					r: Math.random()
				}),
				dataType: 'jsonp',
				jsonp: false
			});

			win.pt = {
				setHeader: function(json) {
					for(var key in json) {
						if(json[key]) {
							def.resolve(json[key]);
							break;
						}
					}
					if('resolved' !== def.state()) {
						def.reject();
					}
					win.pt = null;
					try {
						delete window.pt;
					} catch(e) {
					}
				}
			};

			return def;
		}
	};

	$.extend(user_info, events);

	return user_info;
});/**
 * 会员中心
 * @author xixinhuang
 * @date 2015-10-22
 */
define.pack("./weiyun_vip",["$","common","./tmpl"],function(require, exports, module) {
	var $ = require('$'),
		common = require('common'),

		remote_config = common.get('./remote_config'),
		Module = common.get('./module'),
		constants = common.get('./constants'),
		user_log = common.get('./user_log'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),

		tmpl = require('./tmpl'),
		vip_state,
		vip_icon,
		vip_date,
		vip_btn,
		vip_txt,
		undefined;

	return new Module('qzone_vip', {

		render: function() {
			vip_state = $('.j-vip-state');
			vip_icon = $('.j-vip-icon');
			vip_date = vip_state.find('.j-vip-date');
			vip_btn = vip_state.find('.j-vip-btn');
			vip_txt = vip_state.find('.j-vip-txt');
			query_user.on_ready(this.render_weiyun_vip, this);
		},

		render_weiyun_vip: function(user) {
			var weiyun_vip_info = user.get_weiyun_vip_info();
			if(weiyun_vip_info.weiyun_vip) {
				vip_icon.show();
				if(weiyun_vip_info.weiyun_end_time) {
					vip_date.html('会员&nbsp;' + this.get_expire_date(weiyun_vip_info.weiyun_end_time) + '&nbsp;到期');
				} else {
					vip_date.text('会员到期时间：按月支付中');
				}
				vip_txt.text('续费');
			} else {
				vip_icon.hide();
				vip_date.text('开通会员，尊享特权');
				vip_txt.text('开通');
				vip_state.addClass('fail');
			}
			vip_state.css('visibility', 'visible');

			vip_state.on('click', function(e) {
				e.stopPropagation();
				user_log('RECHARGE_QZONE_VIP');
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D1011');
			});

			vip_btn.on('click', function(e) {
				e.stopPropagation();
				user_log('RECHARGE_QZONE_VIP');
				var is_weixin_user = user.is_weixin_user && user.is_weixin_user(),
					from = is_weixin_user? 1025 : 1015;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
			});
		},

		get_expire_date: function(end_time) {
			var d = new Date(end_time);
			return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);
		}
	});
});
//tmpl file list:
//main/src/ad_board/ad_board.tmpl.html
//main/src/install_app/install_app.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ad_board': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
    __p.push('    ');
 if (data.validated) { __p.push('    <div class="mod-pro j-ad-board">\r\n\
        <div class="pro-hd j-ad-board-hd">\r\n\
            <a class="btn-close j-ad-board-close-btn" href="javascript:void(0)" title="关闭"></a>\r\n\
        </div>\r\n\
        <div class="pro-bd j-ad-board-bd">\r\n\
            <a class="j-ad-board-bd-a" href="');
_p(data.link);
__p.push('" target="_blank"><img class="pro-img j-ad-board-bd-img" src="');
_p(data.img_url);
__p.push('" alt="开通微云会员 赠送半年"></a>\r\n\
        </div>\r\n\
    </div>');
 } __p.push('');

return __p.join("");
},

'install_app': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    __p.push('    <div class="install-download">\r\n\
        <a class="android" href="#" title="安装android版" data-action="android" tabindex="-1" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_ANDROID'));
__p.push('><span>android</span></a>\r\n\
        <a class="iphone" href="#" title="安装iphone版" data-action="iphone" tabindex="-1" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPHONE'));
__p.push('><span>iphone</span></a>\r\n\
        <a class="ipad" href="#" title="安装ipad版" data-action="ipad" tabindex="-1" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPAD'));
__p.push('><span>ipad</span></a>\r\n\
    </div>');

}
return __p.join("");
},

'download_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-no-selection class="full-pop full-pop-download" style="margin-top: -184px;">\r\n\
        <h3 class="full-pop-header"><div class="inner __title"></div></h3>\r\n\
        <div class="__content">\r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" href="javascript:void(0);" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

}
return __p.join("");
},

'way_qrcode': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants');

    var url_suffix = (constants.IS_APPBOX) ? 'appbox' : 'web';
    var qrcode_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/home/img/qrcode.png';
    __p.push('    <div class="qrcode" data-download-name="qrcode" style="height:247px;">\r\n\
        <img alt="二维码" src="');
_p(qrcode_url);
__p.push('">\r\n\
    </div>');

}
return __p.join("");
},

'way_download': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="way way-1"><h4>方法1：下载安装包</h4>\r\n\
        <button data-id="android" data-action="appdown" class="btn-goto">点击开始下载</button>\r\n\
    </div>');

}
return __p.join("");
},

'way_appstore': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="way way-1"><h4>');
if(data.type != 'ipad') { __p.push('方法1：');
 } __p.push('前往App Store下载</h4>\r\n\
        <button class="btn-goto" data-action="appdown" data-id="');
_p(data.type);
__p.push('">前往App Store</button>\r\n\
    </div>');

}
return __p.join("");
},

'way_sendmsg': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="way way-2">\r\n\
        <h4>方法2：短信获取下载地址</h4>\r\n\
        <div data-id="sms_normal">\r\n\
            <p class="desc">请填写手机号，下载地址将发送到您的手机</p>\r\n\
            <div class="phonenum clearfix">\r\n\
                <input data-id="phone_num" type="text" class="ipt-phonenum">\r\n\
                <button class="btn-send" data-action="send">发送短信</button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div data-id="sms_info" class="sms-info clearfix" style="display: none;">您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。\r\n\
            <a href="#" data-action="resend">重新发送</a>\r\n\
        </div>\r\n\
        <div data-id="sms_error" class="sms-error clearfix" style="display: none;"></div>\r\n\
    </div>');

}
return __p.join("");
},

'android_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var tmpl = require('./tmpl');
    __p.push('    <div class="pop-download">');
_p( tmpl.way_qrcode());
__p.push('        <div class="info" data-download-name="methods">');
_p( tmpl.way_download());
__p.push('            ');
_p( tmpl.way_sendmsg());
__p.push('        </div>\r\n\
    </div>');

}
return __p.join("");
},

'iphone_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var tmpl = require('./tmpl');
    __p.push('    <div class="pop-download">');
_p( tmpl.way_qrcode());
__p.push('        <div class="info" data-download-name="methods">');
_p( tmpl.way_appstore({type: 'iphone'}));
__p.push('            ');
_p( tmpl.way_sendmsg());
__p.push('        </div>\r\n\
    </div>');

}
return __p.join("");
},

'ipad_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var tmpl = require('./tmpl');
    __p.push('    <div class="pop-download">');
_p( tmpl.way_qrcode());
__p.push('        <div class="info" data-download-name="methods">');
_p( tmpl.way_appstore({type: 'ipad'}));
__p.push('        </div>\r\n\
    </div>');

}
return __p.join("");
},

'install_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-no-selection class="full-pop download-pop" style="margin-top: -184px; z-index: 10000">\r\n\
        <h3 class="full-pop-header"><div class="inner">下载客户端</div></h3>\r\n\
        <div class="download-pop-con">\r\n\
            <ul>\r\n\
                <li class="download-platform-item">\r\n\
                    <div class="phone-wrap">\r\n\
                        <img src="//img.weiyun.com/vipstyle/nr/box/home/img/newqrcode.png">\r\n\
                        <span>下载微云手机版</span>\r\n\
                    </div>\r\n\
                </li>\r\n\
                <li class="download-platform-item">\r\n\
                    <i data-action="download" data-id="windows" class="icon icon-win"></i>\r\n\
                    <p data-action="download" data-id="windows">Windows版</p>\r\n\
                </li>\r\n\
                <li class="download-platform-item ios-item">\r\n\
                    <i data-action="download" data-id="mac" class="icon icon-ios"></i>\r\n\
                    <p data-action="download" data-id="mac">Mac版</p>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <a data-action="close" href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

}
return __p.join("");
},

'root': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
    constants = common.get('./constants'),
    aid = common.get('./configs.aid'),
    urls = common.get('./urls');
    __p.push('    <div id="_main_ui_root" class="layout-wrapper">\r\n\
        <div id="_main_fixed_header" class="layout-header">\r\n\
            <div class="layout-header-inner">');
_p(this.top());
__p.push('            </div>\r\n\
        </div>\r\n\
        <div class="layout-body">\r\n\
            <div class="layout-body-inner">');
_p( this['nav']() );
__p.push('                ');
_p(this.content());
__p.push('            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'content': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 主要内容 s -->\r\n\
    <div class="layout-main">\r\n\
        <div id="_main_hd" class="layout-main-hd">\r\n\
            <div id="_main_bar2" class="mod-act-panel" style="display: none;">\r\n\
                <div id="_disk_file_path" class="act-panel-inner cleafix" style="display: none;">\r\n\
                    <div class="mod-check"><i id="_disk_all_checker" data-file-check class="icon icon-checkbox icon-check-s"></i></div>\r\n\
                    <!-- 面包屑导航 s -->\r\n\
                    <!-- 面包屑导航 -->\r\n\
                    <div class="mod-breadcrumb">\r\n\
                        <ul data-inner class="breadcrumb clearfix">\r\n\
                            <li class="cur"><a href="javascript: void(0);" hidefocus="on">全部</a></li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                    <!-- 面包屑导航 e -->\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div id="_main_content" class="layout-main-bd">\r\n\
            <div id="_main_box"  class="inner" style="height: 100%">\r\n\
                <div id="_disk_body" class="mod-list-group" >\r\n\
                    <div class="list-group-bd">\r\n\
                        <!-- 空目录时的提示 -->\r\n\
                        <div id="_disk_files_empty" class="empty-box" style="display: none;">\r\n\
                            <div class="status-inner">\r\n\
                                <i class="icon icon-nofile"></i>\r\n\
                                <h2 class="title">暂无文件</h2>\r\n\
                                <p class="txt">请点击右上角的“添加”按钮添加</p>\r\n\
                            </div>\r\n\
                        </div>\r\n\
\r\n\
                        <ul id="list_disk_files" class="list-group">\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 主要内容 e -->');

return __p.join("");
},

'top': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var common = require('common'),
            constants = common.get('./constants'),
            aid = common.get('./configs.aid'),
            urls = common.get('./urls');
    __p.push('    <!-- 顶部导航 s -->\r\n\
    <div id="_main_top" class="mod-nav clearfix">\r\n\
        <div class="logo">\r\n\
            <a class="logo" href="');
_p( urls.make_url('http://www.weiyun.com', { WYTAG: aid.APPBOX_DISK_LOGO }) );
__p.push('" target="_blank" tabindex="-1"></a>\r\n\
        </div>');
/*各模块的顶部放这里*/__p.push('        <div id="_main_normal">\r\n\
            <!-- 传输面板 s -->\r\n\
            <div class="mod-act">\r\n\
						<span class="act-link" id="_main_header_manage" href="javascript: void(0);" data-action="manage" title="文件管理" style="cursor: pointer;">\r\n\
							<i class="icon icon-act j-manage-icon"></i>\r\n\
							<span class="sync-num j-manage-num" style="display: none;"></span>\r\n\
						</span>\r\n\
            </div>\r\n\
            <!-- 传输面板 e -->\r\n\
            <!--搜索 s -->\r\n\
            <div class="mod-search j-header-search"><!--获得焦点状态添加类名focus -->\r\n\
                <i class="icon icon-search"></i>\r\n\
                <label>输入文件名</label>\r\n\
                <input class="mod-input" type="text" autocomplete="off" maxlength="40" aria-label="输入文件名并按下回车进行搜索" tabindex="0"/>\r\n\
                <a class="close" href="javascript: void(0);" aria-label="关闭搜索界面" hidefocus="on"><i class="icon icon-close"></i></a>\r\n\
            </div>\r\n\
            <!--搜索 e -->\r\n\
            <!-- 视图模式 s -->\r\n\
            <div id="_main_bar0" class="mod-view">\r\n\
            </div>\r\n\
            <!-- 视图模式 e -->\r\n\
            <!-- 用到的css：mod-nav.css -->\r\n\
            <!-- 添加 s -->\r\n\
            <!-- [ATTENTION!!] 切换 .on -->\r\n\
            <div data-action="upload" class="mod-upload">\r\n\
                <input id="_upload_html5_input" name="file" type="file" multiple="multiple" aria-label="上传文件，按空格选择文件。" style="display: none;" />\r\n\
                <label for="_upload_html5_input"><span class="btn btn-l btn-upload"><i class="icon icon-add"></i><span class="btn-txt">添加</span></span></label>\r\n\
                <!-- 添加内容 s -->\r\n\
                <div class="mod-bubble-dropdown with-border top-right upload-bubble-dropdown j-upload-drop">\r\n\
                    <ul class="upload-dropdown clearfix">\r\n\
                        <li class="upload-item" data-action="upload_files" style="display: none;">\r\n\
                            <div class="inner">\r\n\
                                <b class="icon icon-upload icon-upload-file"></b>\r\n\
                                <p class="txt" data-action="upload_files" tabindex="-1">上传文件</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="upload-item" data-action="upload_folder" style="display: none;">\r\n\
                            <div class="inner">\r\n\
                                <b class="icon icon-upload icon-upload-dir"></b>\r\n\
                                <p class="txt" data-action="upload_folder_h5" tabindex="-1">上传文件夹</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="upload-item" data-action="create_folder" style="display: none;">\r\n\
                            <div class="inner">\r\n\
                                <b class="icon icon-upload icon-create-dir"></b>\r\n\
                                <p class="txt" data-action="upload_folder_h5" tabindex="-1">创建文件夹</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="upload-item" data-action="add_note" style="display: none;">\r\n\
                            <div class="inner">\r\n\
                                <b class="icon icon-upload icon-add-note"></b>\r\n\
                                <p class="txt" data-action="add_note" tabindex="-1">添加笔记</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                    <b class="bubble-arrow-border"></b>\r\n\
                    <b class="bubble-arrow"></b>\r\n\
                </div>\r\n\
                <!-- 添加内容 e -->\r\n\
            </div>\r\n\
            <!-- 添加 e-->\r\n\
        </div>\r\n\
        <!-- 工具栏 s-->\r\n\
        <div id="_main_edit" style="display: none;">\r\n\
            <div class="select-btn-wrap">\r\n\
                <a href="javascript: void(0);" class="select-btn" data-action="edit_cancel_all">取消选择</a>\r\n\
            </div>\r\n\
            <div class="edit-select j-edit-count"><p>选择了<span class="j-edit-count-text"></span>项</p></div>\r\n\
            <!--导航栏编辑按钮 s -->\r\n\
            <div class="mod-edit-bar">\r\n\
                <ul class="edit-wrap clearfix" id="_main_bar1"></ul>\r\n\
            </div>\r\n\
            <!--导航栏编辑按钮 e -->\r\n\
        </div>\r\n\
        <!-- 工具栏 e-->\r\n\
    </div>\r\n\
    <!-- 顶部导航 e -->');

return __p.join("");
},

'share_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_share_header" class="lay-share-head" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'recycle_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_rec_file_header" class="lay-recycle-head" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'station_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_station_header" class="lay-files-head" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'nav': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 左侧栏 s -->\r\n\
    <div id="_main_nav" class="layout-aside" data-no-selection style="height: 956px;">\r\n\
        <!-- layout-aside-hd s -->\r\n\
        <div class="layout-aside-hd">\r\n\
            <!-- 用到的样式：mod-user.css -->\r\n\
            <!-- 用户头像 s -->\r\n\
            <div class="mod-user mod-user-vip"><!-- vip用户加类名 mod-user-vip,vip过期用户加类名 mod-user-vip-expire-->\r\n\
                <div id="_main_face" class="user-avatar">\r\n\
                    <a class="user-avatar-pic" href="javascript: void(0);" data-id="qzone_vip">\r\n\
                        <img src="//img.weiyun.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
                        <i class="icon icon-vip j-vip-icon" title="VIP会员" style="display: none;"></i>\r\n\
                    </a>\r\n\
                </div>\r\n\
                <!-- 用户信息 s -->\r\n\
                <div id="_main_face_menu" class="mod-bubble-dropdown acct-bubble-dropdown" style="display: none;">\r\n\
                    <div class="acct-dropdown">\r\n\
                        <div class="acct-info">\r\n\
                            <div class="name-container clearfix">\r\n\
                                <span id="_main_nick_name" class="name"></span>\r\n\
                                <a id="_main_logout" class="btn" href="javascript: void(0);" title="退出登录"><i class="icon icon-logout"></i></a>\r\n\
                            </div>\r\n\
                            <div id="_main_space_info" class="space-container">\r\n\
                                <!-- space_info/space_info.tmpl.html -->\r\n\
                            </div>\r\n\
                        </div>\r\n\
                        <ul class="with-border">\r\n\
                            <!-- [ATTENTIN!!] 没有会员添加 .fail -->\r\n\
                            <li class="main acct-item j-vip-state" style="visibility: hidden;">\r\n\
                                <span class="txt j-vip-date">会员2017-06-12到期</span>\r\n\
                                <!-- [ATTENTION!!] 文案：开通/续费 -->\r\n\
                                <a href="javascript: void(0);" class="btn btn-m btn-vip j-vip-btn"><i class="icon icon-vip-btn"></i><span class="j-vip-txt">续费</span></a>\r\n\
                            </li>\r\n\
                            <!--@capacity_purchase-->\r\n\
                            <li id="_main_purchase_capacity" class="acct-item main">\r\n\
                                <span class="txt">购买容量</span>\r\n\
                                <!-- 新增！！ -->\r\n\
                                <span class="tag tag-fornew"></span>\r\n\
                            </li>\r\n\
                            <li id="_main_pwd_locker" class="acct-item"><span class="txt"><span class="j-pwd-state">开启</span>独立密码</span></li>\r\n\
                            <li id="_main_feedback" class="acct-item"><span class="txt">帮助与反馈</span></li>\r\n\
                            <a href="//www.weiyun.com/complaint.html" target="_blank"><li id="_main_copyright_complaint" class="acct-item"><span class="txt">投诉指引</span></li></a>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <!-- 用户信息 e -->\r\n\
            </div>\r\n\
            <!-- 用户头像 s -->\r\n\
        </div>\r\n\
        <!-- layout-aside-hd e -->\r\n\
        <!-- layout-aside-bd s -->\r\n\
        <div id="_main_nav_aside_box" class="layout-aside-bd" style="height: 852px;">\r\n\
            <!-- 菜单 s -->\r\n\
            <div id="_main_nav_aside_wrap" class="mod-menu">\r\n\
                <!-- 最近s -->\r\n\
                <div class="menu-item">\r\n\
                    <div class="menu-item-bd">\r\n\
                        <ul class="menu-list">\r\n\
                            <li data-mod="recent" data-op="NAV_RECENT">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-ren"></i><span class="menu-tit">最近</span></a>\r\n\
                            </li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <!-- 最近e -->\r\n\
                <!-- 文件s -->\r\n\
                <div class="menu-item">\r\n\
                    <div class="menu-item-hd">\r\n\
                        <h3 class="tit">文件</h3>\r\n\
                    </div>\r\n\
                    <div class="menu-item-bd">\r\n\
                        <ul class="menu-list">\r\n\
                            <li class="cur" data-mod="disk" data-op="NAV_DISK">\r\n\
                                <a href="page-home.html"><i class="icon icon-all"></i><span class="menu-tit">全部</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="doc" data-op="NAV_DOC">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-doc"></i><span class="menu-tit">文档</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="album" data-op="NAV_ALBUM">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-pic"></i><span class="menu-tit">图片</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="video" data-op="NAV_VIDEO">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-video"></i><span class="menu-tit">视频</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="note" data-op="NAV_NOTE">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-note"></i><span class="menu-tit">笔记</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="audio" data-op="NAV_AUDIO">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-music"></i><span class="menu-tit">音乐</span></a>\r\n\
                            </li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <!-- 文件e -->\r\n\
                <!-- 照片s -->\r\n\
                <div class="menu-item">\r\n\
                    <div class="menu-item-hd">\r\n\
                        <h3 class="tit">照片</h3>\r\n\
                    </div>\r\n\
                    <div class="menu-item-bd">\r\n\
                        <ul class="menu-list">\r\n\
                            <li data-mod="photo_time" data-op="NAV_ALBUM">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-time"></i><span class="menu-tit">时间</span></a>\r\n\
                            </li>\r\n\
                            <li style="display: none;">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-location"></i><span class="menu-tit">地点</span></a>\r\n\
                            </li>\r\n\
                            <li style="display: none;">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-tag"></i><span class="menu-tit">标签</span></a>\r\n\
                            </li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <!-- 照片e -->\r\n\
                <!-- 我的s -->\r\n\
                <div class="menu-item">\r\n\
                    <div class="menu-item-hd">\r\n\
                        <h3 class="tit">我的</h3>\r\n\
                    </div>\r\n\
                    <div class="menu-item-bd">\r\n\
                        <ul class="menu-list">\r\n\
                            <li data-mod="clipboard" data-op="NAV_CLIPBOARD">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-clip"></i><span class="menu-tit">剪贴板</span></a>\r\n\
                                <span data-id="clip-num" class="clip-num" style="display:none;"></span>\r\n\
                            </li>\r\n\
                            <li data-mod="share" data-op="NAV_SHARE">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-share"></i><span class="menu-tit">分享链接</span></a>\r\n\
                            </li>\r\n\
                            <li data-mod="recycle" data-op="NAV_RECYCLE">\r\n\
                                <a href="javascript: void(0);"><i class="icon icon-trash"></i><span class="menu-tit">回收站</span></a>\r\n\
                            </li>\r\n\
                        </ul>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <!-- 我的e -->\r\n\
                <div id="_main_nav_split"></div>\r\n\
            </div>\r\n\
            <!-- 菜单 s -->\r\n\
        </div>\r\n\
        <!-- layout-aside-bd e -->\r\n\
        <!-- layout-aside-ft s -->\r\n\
        <div class="layout-aside-ft">\r\n\
            <!-- 帮助 s -->\r\n\
            <!--<div class="mod-txt-list">-->\r\n\
                <!--<ul class="txt-list clearfix">-->\r\n\
                    <!--<li class="txt-item"><a href="javascript: void(0);">版权声明</a>-->\r\n\
                        <!--&lt;!&ndash; 版权声明内容 s &ndash;&gt;-->\r\n\
                        <!--<div class="mod-bubble-dropdown with-border bottom-left copyright-bubble-dropdown">-->\r\n\
                            <!--<div class="txt-dropdown">-->\r\n\
                                <!--<p>您应尊重相关作品著作权人合法权益，未经著作权人合法授权，不能违法上传、储存、分享他人作品。</p>-->\r\n\
                            <!--</div>-->\r\n\
                            <!--<b class="bubble-arrow-border"></b>-->\r\n\
                            <!--<b class="bubble-arrow"></b>-->\r\n\
                        <!--</div>-->\r\n\
                        <!--&lt;!&ndash; 版权声明内容 e &ndash;&gt;-->\r\n\
                    <!--</li>-->\r\n\
                    <!--<li class="txt-item"><a href="http://www.weiyun.com/complaint.html" target="_blank">投诉指引</a></li>-->\r\n\
                <!--</ul>-->\r\n\
            <!--</div>-->\r\n\
            <!-- 帮助 e -->\r\n\
        </div>\r\n\
        <!-- layout-aside-hd e -->\r\n\
    </div>\r\n\
    <!-- 左侧栏 e -->');

return __p.join("");
},

'ad_left': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="ad-wx-public">\r\n\
        免费领取3T大容量\r\n\
        <div class="qrcode">\r\n\
            <a data-id="qrcode" href="javascript:void(0);" class="qrcode-icon"></a>\r\n\
            <div class="g-bubble" style="display: none;">\r\n\
                <div class="qrcode-detail">\r\n\
                    <div class="img"><img src="//img.weiyun.com/vipstyle/nr/box/img/qrcode-wx-public.png" alt=""></div>\r\n\
                    <div class="txt">\r\n\
                        <p>扫一扫关注微云公众号</p>\r\n\
                        <p>免费领取3T大容量</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <span class="g-arrow g-arrow-top" style=""><span class="sub"></span></span>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'ad_left_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="ad-wx-public">\r\n\
        <a href="');
_p(data.bar_url);
__p.push('" target="_blank">');
_p(data.title);
__p.push('</a>\r\n\
    </div>');

}
return __p.join("");
},

'ad_left_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="ad-wx-public">\r\n\
        连续签到10天送10G容量\r\n\
        <div class="qrcode">\r\n\
            <a data-id="qrcode" href="javascript:void(0);" class="qrcode-icon"></a>\r\n\
            <div class="g-bubble" style="display: none;">\r\n\
                <div class="qrcode-detail">\r\n\
                    <div class="img"><img style="width: 100px" src="//img.weiyun.com/vipstyle/nr/box/img/qrcode-wy_app.png" alt=""></div>\r\n\
                    <div class="txt">\r\n\
                        <p>下载微云手机版</p>\r\n\
                        <p>持续签到10天领10G容量</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <span class="g-arrow g-arrow-top" style=""><span class="sub"></span></span>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'ad_right': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <a class="download-btn" href="#"><i class="icon"></i>下载客户端</a>');

}
return __p.join("");
},

'download_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="add-downwin-wrap" style="width:100%;background:#f49a1a;">\r\n\
        <div style="width:800px;margin:0 auto;">\r\n\
            <div class="add-downwin">\r\n\
                <a href="#" class="add-downwin-btn">马上下载</a>\r\n\
            </div>\r\n\
        </div>\r\n\
        <a href="#" data-id="close" class="add-downwin-close">关闭</a>\r\n\
    </div>');

}
return __p.join("");
},

'first_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="pop-guide-body" data-no-selection>\r\n\
        <div class="pop-guide-wrapper">\r\n\
            <i class="fake-ele"></i>\r\n\
            <div class="controller">\r\n\
                <i id="close_guide" class="icon icon-close"></i>\r\n\
                <div id="slide_list" class="bullet-list">\r\n\
                    <!--  选中的位置，加上 .on -->');
 if(data.guide_page === 3) { __p.push('                    <i class="icon icon-bullet on"></i>\r\n\
                    <i class="icon icon-bullet"></i>\r\n\
                    <i class="icon icon-bullet"></i>');
 } __p.push('                </div>\r\n\
            </div>');

                var loc = data.guide_page === 3? 'loc1' : 'loc3';
                var item_style = data.guide_page === 3? '': 'none';
                var last_item_style = data.guide_page === 3? 'none': '';
                var item_width = Math.round(100 / data.guide_page) + '%';
                var total_width = data.guide_page * 100 + '%';
            __p.push('            <!-- 4种情况 loc1, loc2, loc3, loc4 -->\r\n\
            <div id="mask" class="mask-wrapper ');
_p(loc);
__p.push('">\r\n\
                <div class="pop-unblank-small"></div>\r\n\
                <!-- .pop-left-up-mask 的 height = .pop-mid-mask 的 top -->\r\n\
                <div class="pop-blank-left"></div>\r\n\
                <!-- JS 确定 .pop-mid-mask 的位置，得到.pop-mid-mask的 top 值 -->\r\n\
                <div class="pop-mid-mask"></div>\r\n\
                <div class="pop-blank-right"></div>\r\n\
                <!-- .pop-right-mask 的 left = .pop-mid-mask 的 width -->\r\n\
                <div class="pop-unblank-large"></div>\r\n\
            </div>\r\n\
            <!-- $(\'#slider\').animate({ left: "-100%"}) -->\r\n\
            <ul  id="slider" class="slider clearfix" style="width: ');
_p(total_width);
__p.push('">\r\n\
                <li class="item loc1" style="display: ');
_p(item_style);
__p.push('; width: ');
_p(item_width);
__p.push(';">\r\n\
                    <div class="pop-mask-text">\r\n\
                        <h3 class="pop-text-title">添加搬到页面右上角咯</h3>\r\n\
                        <i class="icon icon-guide-box"></i>\r\n\
                        <input class="pop-btn" type="submit" value="继续了解">\r\n\
                    </div>\r\n\
                </li>\r\n\
                <li class="item loc2" style="display: ');
_p(item_style);
__p.push('; width: ');
_p(item_width);
__p.push(';">\r\n\
                     <div class="pop-mask-text">\r\n\
                         <h3 class="pop-text-title">视频支持云播啦！</h3>\r\n\
                         <i class="icon icon-guide-box"></i>\r\n\
                         <input class="pop-btn" type="submit" value="继续了解">\r\n\
                      </div>\r\n\
                </li>\r\n\
                <li class="item loc3" style="display: ');
_p(last_item_style);
__p.push('; width: ');
_p(item_width);
__p.push(';">\r\n\
                    <div class="pop-mask-text">\r\n\
                        <h3 class="pop-text-title">新增离线下载</h3>\r\n\
                        <i class="icon icon-guide-box"></i>\r\n\
                        <input class="pop-btn" type="submit" value="我知道了">\r\n\
                    </div>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'indep': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls');
    __p.push('    <div class="layout">\r\n\
        <div class="lay-header clear">\r\n\
            <a class="logo" href="http://www.weiyun.com?WYTAG=appbox.disk.logo" target="_blank" tabindex="-1"></a>\r\n\
            <div id="_head_ad_left" class="app clear diff-appdown" style="">\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="layout-header-inner">');
_p(this.content());
__p.push('        </div>\r\n\
        <div class="layout-body">\r\n\
            <div class="layout-body-inner">');
_p( this['nav']() );
__p.push('            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'ad_web': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="ad-wx-public"><a data-id="ad_title" href="javascript:void(0);" class="" target="_blank"></a></div>');

}
return __p.join("");
},

'space_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<p class="txt">\r\n\
		已使用:<span id="_main_space_info_used_space_text"></span>&nbsp;\r\n\
		总容量:<span id="_main_space_info_total_space_text"></span>\r\n\
	</p>\r\n\
	<div class="quota-graph-container">\r\n\
		<div class="quota-graph"></div>\r\n\
		<div id="_main_space_info_bar" class="quota-graph-bar" style="width: 0px;"></div>\r\n\
	</div>');

return __p.join("");
}
};
return tmpl;
});
