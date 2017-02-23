/**
 * 独立密码登录
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        security = lib.get('./security'),
        cookie = lib.get('./cookie'),

        Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        tmpl = require('./tmpl'),

        cookie_name_indep = 'indep',

        undefined;

    var indep_login = new Module('indep_login', {

        state: 'hide',

        ui: require('./ui'),

        send: function (pwd) {
            var me = this,
                pwd_md5 = security.md5(pwd);
            document.domain = 'weiyun.com';

            return request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'PwdVerify',
                body: { pwd_md5: pwd_md5 }
            })
                .ok(function () {
                    me._save_cookie(pwd_md5);

                    me.trigger('indep_login_ok');
                })
                .fail(function (msg, ret) {
                    me.trigger('indep_login_error', msg, ret);
                });
        },

        _save_cookie: function (pwd_md5) {
            cookie.set(cookie_name_indep, pwd_md5, {
                domain: constants.DOMAIN_NAME,
                expires: 120,
                path: '/'
            });
        },

        show: function () {
            this.ui.init();
            this.state = 'show';
            var me = this;
            // 停留在独立密码页面够久后，会话超时以后会自动弹出登录框，这时应该隐藏独立密码登录框
            this.listenTo(session_event, 'session_timeout', function () {
                me.hide();
            });
            return this;
        },

        hide: function () {
            this.ui.hide();
            this.state = 'hide';
            this.stopListening(session_event, 'session_timeout');
        },

        is_visible: function(){
            return this.state === 'show';
        }

    });


    return indep_login;
});