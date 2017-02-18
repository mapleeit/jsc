//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/indep_login/indep_login.r0903",["lib","common","$","to_singin_css","main","i18n"],function(require,exports,module){

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
//indep_login/src/indep_login.tmpl.html

//js file list:
//indep_login/src/indep_login.js
//indep_login/src/ui.js
/**
 * 独立密码登录
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./indep_login",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {

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

            return request.post({
                cmd: 'pwd_vry',
                body: { password: pwd_md5 },
                cavil: true
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
});/**
 * 独立密码登录框UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./ui",["to_singin_css","lib","common","$","./tmpl","main","i18n","./indep_login"],function (require, exports, module) {

    require('to_singin_css');

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        user_log = common.get('./user_log'),
        session_event = common.get('./global.global_event').namespace('session'),
        tmpl = require('./tmpl'),

        main_ui = require('main').get('./ui'),

        indep_login,
        _ = require('i18n').get('./pack'),
        l_key = 'indep_login',

        str_serv_err = _(l_key,'验证独立密码过程中出现错误')+'<br/>'+_(l_key,'如果您从未设置过独立密码，请尝试')+' <a href="javascript:void(0)" onclick="window.onbeforeunload=null;' +
            'location.reload(true)">'+_(l_key,'刷新页面')+'</a>',
        errors = {
            1024: _(l_key,'您的会话已经超时，请重新登录微云'),
            1030: _(l_key,'独立密码签名已经超时，请重新验证'),
            1031: _(l_key,'您输入的独立密码有误，请重新输入'),
            1034: _(l_key,'失败次数过多，独立密码已被锁定，请稍后访问'),
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
                //$btn = me._$btn = $el.find('button:first'),
                $btn = me._$btn = $el.find('.g-btn'),


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

            $btn.on('click', function () {
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

                query_user.destroy();
                session_event.trigger('session_timeout');
            });
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

            me._$el.fadeIn('fast');
            center.listen(me._$el);

            if (main_ui.is_visible()) {
                widgets.mask.show('indep_login');
            }

            me._$pwd.focus();

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
                this._err_msg(_(l_key,'请输入密码'));
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
//tmpl file list:
//indep_login/src/indep_login.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'indep_login_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),

        uin = query_user.get_uin_num(),

        indep_login,
        _ = require('i18n').get('./pack'),
        l_key='indep_login',
        forget_pwd_url = 'http://aq.qq.com/cn2/ipwd/my_ipwd';
    __p.push('    <div data-no-selection class="to-signin-box">\r\n\
        <div class="to-signin-body to-signin">\r\n\
                <div class="ui-form">\r\n\
                    <div class="ui-form-item">\r\n\
                        <div class="to-signin-user">\r\n\
                            <label class="ui-label" data-id="nickname"></label><!--nickname-->');
 if (uin) { __p.push('                                <span class="ui-text">(');
_p( uin );
__p.push(')</span>');
 } __p.push('                        </div>\r\n\
                        <p data-id="err_msg" class="ui-tips ui-tips-err" style="display:none;"><!--您输入的独立密码有误，请重新输入--></p>\r\n\
                        <div class="ui-passwords">\r\n\
                            <label class="ui-text-defult" for="_indep_login_pwd">');
_p(_(l_key,'请输入您的独立密码'));
__p.push('</label>\r\n\
                            <input id="_indep_login_pwd" type="password" class="ui-password" maxlength="16">\r\n\
                        </div>\r\n\
                    </div>\r\n\
                    <div class="ui-form-item">\r\n\
                        <a class="g-btn g-btn-blue" href="#"><span class="btn-inner">');
_p(_(l_key,'确定'));
__p.push('</span></a>\r\n\
                        <a href="');
_p(forget_pwd_url);
__p.push('" target="_blank">');
_p(_(l_key,'忘记密码'));
__p.push('?</a>');
 if (!constants.IS_APPBOX && !constants.IS_WRAPPED) { __p.push('                        <a data-action="change-account" href="#">');
_p(_(l_key,'更换帐号'));
__p.push('</a>');
 } __p.push('                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
    </div>');

return __p.join("");
},

'indep_login_box_error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var  _ = require('i18n').get('./pack'),
         l_key='indep_login';
    __p.push('    <div data-no-selection class="to-signin-box error">\r\n\
        <div class="to-signin-head"><h3><span class="warn"></span>');
_p(_(l_key,'验证独立密码失败'));
__p.push('</h3></div>\r\n\
        <div class="to-signin-body to-signin" style="min-height: 100px;">\r\n\
            <div class="ui-form">\r\n\
                <div class="ui-form-item">\r\n\
                    <p data-id="-err-msg" class="ui-tips ui-tips-err">');
_p(_(l_key,'验证独立密码过程中出现错误'));
__p.push('<br> ');
_p(_(l_key,'如果您从未设置过独立密码，请尝试'));
__p.push('                        <a href="javascript:void(0)" onclick="location.reload()">');
_p(_(l_key,'刷新页面'));
__p.push('</a>\r\n\
                    </p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
