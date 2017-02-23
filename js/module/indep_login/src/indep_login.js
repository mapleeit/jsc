/**
 * 独立密码登录
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        security = lib.get('./security'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        session_event = common.get('./global.global_event').namespace('session'),
        tmpl = require('./tmpl'),

        cookie_name_indep = 'indep',

        undefined;

    var indep_login = new Module('indep_login', {

        state: 'hide',

        ui: require('./ui'),

        send: function (pwd) {
            var me = this,
                pwd_md5 = security.md5(pwd);

            return request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'PwdVerify',
                pb_v2: true,
                cavil: true,
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
                domain: constants.MAIN_DOMAIN,
                path: '/'
            });
        },

        show: function ( nickname ) {
            this.render();
            this.ui.show( nickname );
            this.state = 'show';
            // 停留在独立密码页面够久后，会话超时以后会自动弹出登录框，这时应该隐藏独立密码登录框
            this.listenTo(session_event, 'session_timeout', function () {
                this.hide();
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