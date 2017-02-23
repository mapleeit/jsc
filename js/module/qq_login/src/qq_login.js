/**
 * QQ通行证登录
 * @author jameszuo
 * @date 13-3-26
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        cookie = lib.get('./cookie'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        constants = common.get('./constants'),
        urls = common.get('./urls'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),
        ptlogin_url = constants.IS_HTTPS ? 'https://ssl.xui.ptlogin2.qq.com/cgi-bin/xlogin' : 'http://xui.ptlogin2.qq.com/cgi-bin/xlogin',
        wxlogin_url = constants.IS_HTTPS ? 'https://user.weiyun.com/newcgi/web_wx_login.fcg?cmd=web_login': 'http://web2.cgi.weiyun.com/web_wx_login.fcg?cmd=web_login',

        /**
         * 生成这个URL的地方 -> http://platform.server.com/ptlogin/param.html
         * 不过要注意的是CGI的主域名要改为 weiyun.com
         */
        ptlogin_url = urls.make_url(ptlogin_url, {
            appid: 527020901,
	        daid: 372,
            s_url: urls.make_url('/web/callback/qq_login_ok.html'),
            style: 20,
            border_radius:1,
            maskOpacity: 40,
            target: 'self',
            link_target: 'blank',
            hide_close_icon: 1
        }),

        undefined;

    require('new_qzonelogin_css');

    var qq_login = new Module('qq_login', {

        ui: require('./ui'),

        _visible: false,

        render: function () {
            this._rendered = true;
        },

        ok: function () {
            this.clear_wx_cookie();
            this.trigger('qq_login_ok');
            this.hide();
        },

        show: function () {
            if(this._visible) {
                return;
            }

            this.render();

            this.ui.show();

            this._visible = true;

            return this;
        },

        hide: function () {
            this._visible = false;

            this.ui.hide();
            return this;
        },

        //QQ登录成功后，需要把微信的cookie清除，并把uf设置为0，防止同时存在QQ和微信两种登录态
        clear_wx_cookie: function() {
            var cookie_options = {
                domain: constants.MAIN_DOMAIN,
                path: '/'
            };
            $.each(['wx_login_ticket', 'FTN5K', 'indep', 'openid', 'key_type', 'access_token', 'wy_uf', 'wy_appid'], function (i, key) {
                cookie.unset(key, cookie_options);
            });
        },

        get_ptlogin_url: function () {
            return ptlogin_url;
        },

        set_ptlogin_url:function(new_url){
            ptlogin_url = new_url;
        },

        get_wxlogin_url: function() {
            return wxlogin_url;
        },

        /**
         * 根据query_user返回的错误码，限制某些qq号登陆，让用户重新用其它qq号附录
         * @param err_code
         */
        limit_login: function(err_code) {
            if(!this._rendered) {
                this.show();
                return;
            }
            this.ui.show_limit_tip(err_code);
        }

    });

    return qq_login;
});