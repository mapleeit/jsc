/**
 * 独立密码登录框UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        tmpl = require('./tmpl'),

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

        init: function () {
            var me = this;

            me.render();

            var $el = me._$el = $(tmpl.indep_login_box()).hide().appendTo(document.body),

                $pwd = me._$pwd = $el.find('#_indep_login_pwd'),
                $btn = me._$btn = $el.find('[data-action=ok]'),

                $pwd_box = $pwd.parent(),
                _$err = $el.find('[data-id=err_msg]');

            me._$err = _$err;

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
                    _$err.text('');
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
                    //me.hide();
                    location.reload();
                })
                .listenTo(indep_login, 'indep_login_error', function (msg, ret) {
                    me._err_msg(errors[ret] || msg);

                    $pwd.focus()[0].select();
                });

            // 切换帐号
            $el.on('click', '[data-action="change-account"]', function (e) {
                e.preventDefault();

                //query_user.destroy();
                session_event.trigger('session_timeout');
            });

            $el.show();
        },

        destroy: function () {
            var me = this;

            me._$el.remove();

            me._$pwd = me._$tip = me._$err = null;

            me.off().stopListening(indep_login);
        },

        hide: function () {
            var me = this;
            if (me._$el) {
                widgets.mask.hide('indep_login');
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

            indep_login.send(pwd_val);
        },

        _err_msg: function (err) {
            this._$err.html(err).show();
            //this._$tip.hide();
        }
    });

    return ui;
});