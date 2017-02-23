/**
 * 用户登录态检查（登录态、独立密码验证状态）
 *
 * 逻辑：
 *   request 模块的请求回调包含1024错误码时，会触发
 *
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {
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
                    //@ptlogin, start
                    me._logout();
                    //query_user.destroy();
		            //@ptlogin, end

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
	            //@ptlogin, start
                this._logout();
	            //query_user.destroy();
	            //@ptlogin, end

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
});