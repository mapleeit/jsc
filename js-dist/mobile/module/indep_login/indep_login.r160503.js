//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/indep_login/indep_login.r160503",["$","lib","common"],function(require,exports,module){

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
//indep_login/src/indep_login.js
//indep_login/src/ui.js
//indep_login/src/view.tmpl.html

//js file list:
//indep_login/src/indep_login.js
//indep_login/src/ui.js
/**
 * 独立密码登录
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./indep_login",["$","lib","common","./tmpl","./ui"],function (require, exports, module) {

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
});/**
 * 独立密码登录框UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./ui",["lib","common","$","./tmpl","./indep_login"],function (require, exports, module) {
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
//tmpl file list:
//indep_login/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'indep_login_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="password-wrap">\r\n\
        <div class="password-info">\r\n\
            <input class="password-input" id="_indep_login_pwd" type="password" placeholder="请输入您的独立密码" maxlength="16">\r\n\
            <p data-id="err_msg" class="tips"></p>\r\n\
            <input class="password-btn" id="confirm" data-action="ok" type="button" value="确定">\r\n\
        </div>\r\n\
        <div class="forget"><a class="info" href="http://www.weiyun.com/mobile/2.0/forget-password.html">忘记密码</a></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
