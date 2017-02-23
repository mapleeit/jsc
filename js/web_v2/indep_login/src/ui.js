/**
 * 独立密码登录框UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {

    require('to_singin_css');

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        user_log = common.get('./user_log'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        session_event = common.get('./global.global_event').namespace('session'),
        tmpl = require('./tmpl'),

        main_ui = require('main').get('./ui'),

        indep_login,


        str_serv_err = '验证独立密码过程中出现错误<br/>如果您从未设置过独立密码，请尝试 <a href="javascript:void(0)" onclick="window.onbeforeunload=null;location.reload(true)">刷新页面</a>',
        errors = {
            1024: '您的会话已经超时，请重新登录微云',
            1030: '独立密码签名已经超时，请重新验证',
            1031: '您输入的独立密码有误，请重新输入',
            1034: '失败次数过多，独立密码已被锁定，请稍后访问',
            1014: str_serv_err,
            1000: str_serv_err
        },

        undefined;

    var ui = new Module('indep_login_ui', {

        render: function () {
            indep_login || (indep_login = require('./indep_login'));
        },

        init: function (nickname) {
            var me = this;

            me.render();

            var $el = me._$el = $(tmpl.indep_login_box()).hide().appendTo(document.body),

                $pwd = me._$pwd = $el.find(':password'),
                $btn = me._$btn = $el.find('[data-action=ok]'),

                $pwd_box = $pwd.parent(),
                $els = $el.find('[data-id]');

            //me._$tip = $els.filter('[data-id=tip_msg]');
            me._$err = $els.filter('[data-id=err_msg]');


            // 昵称
            if (nickname) {
                $('[data-id="nickname"]', $el).text(text.smart_sub(nickname, 10));
            }


            // === 事件 =========================

            // 点击面板任何地方都设置文本框为焦点
            $el.on('click', function (e) {
                if (!$(e.target).is('button, a')) {
                    $pwd.focus();
                }
            });

            $pwd
                .on('focus', function () {
                    $pwd_box.addClass('focus');
                })
                .on('keyup', function (e) {
                    if (e.which === 13) {
                        me._try_send();
                    } else {
                        $pwd_box.toggleClass('has-value', !!$pwd.val());
                    }
                })
                .on('blur', function () {
                    $pwd_box.toggleClass('has-value', !!$pwd.val());
                });

            $btn.on('click', function (e) {
                e.preventDefault();
                me._try_send();
            });

            //me._tip_msg('您的微云在独立密码的保护下，请输入您设置的独立密码');

            me
                .listenTo(indep_login, 'indep_login_ok', function () {
                    me.hide();
                })
                .listenTo(indep_login, 'indep_login_error', function (msg, ret) {
                    me._err_msg(errors[ret] || msg);

                    $pwd.focus()[0].select();
                });

            // 切换帐号
            $el.on('click', '[data-action="change-account"]', function (e) {
                e.preventDefault();

                me._logout();
            });
        },

        _logout: function() {
            if(typeof pt_logout !== 'undefined') {
                pt_logout.logoutQQCom(function() {
                    query_user.destroy();
                    session_event.trigger('session_timeout');
                });
            } else {
                require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                    pt_logout.logoutQQCom(function() {
                        query_user.destroy();
                        session_event.trigger('session_timeout');
                    });
                });
            }
        },

        destroy: function () {
            var me = this;

            me._$el.remove();

            me._$pwd = me._$tip = me._$err = null;

            me.off().stopListening(indep_login);
        },

        show: function (nickname) {
            var me = this;

            if (me._is_show)
                return;

            me.init(nickname);

            me._$el.show();
            center.listen(me._$el);

            if (main_ui.is_visible()) {
                widgets.mask.show('indep_login', '', true);
            }

            if (scr_reader_mode.is_enable()) {
                $('<div tabindex="0" aria-label="独立密码验证窗口"/>').prependTo(me._$el).focus();
            }
            else {
                setTimeout(function () {
                    if(constants.IS_APPBOX){        //appbox独立密码窗口聚焦后无法输入,因此暂时不聚焦
                        me._$pwd.blur();
                    }else{
                        me._$pwd.blur().focus();
                    }
                }, 100);
            }
            me._is_show = true;
        },

        hide: function () {
            var me = this;
            if (me._$el) {
                widgets.mask.hide('indep_login');

                center.stop_listen(me._$el);

                me._$el.fadeOut('fast', function () {
                    me.destroy();
                });
            }
            me._is_show = false;
        },

        _try_send: function () {
            var pwd_val = this._$pwd.val();
            // 未输入密码
            if (!pwd_val) {
                this._$pwd.focus();
                this._err_msg('请输入密码');
                return;
            }

            user_log('VRY_INDEP_PWD');

            indep_login.send(pwd_val);
        },
        /*
         _tip_msg: function (tip) {
         this._$tip.html(tip).show();
         this._$err.hide();
         },
         */
        _err_msg: function (err) {
            this._$err.html(err).show();
            //this._$tip.hide();
        }
    });

    return ui;
});