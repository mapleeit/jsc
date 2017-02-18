//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","i18n","$"],function(require,exports,module){

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
//qq_login/src/qq_login.js
//qq_login/src/ui.js
//qq_login/src/qq_login.tmpl.html

//js file list:
//qq_login/src/qq_login.js
//qq_login/src/ui.js
/**
 * QQ通行证登录
 * @author jameszuo
 * @date 13-3-26
 */
define.pack("./qq_login",["lib","common","i18n","$","./tmpl","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        constants = common.get('./constants'),
        urls = common.get('./urls'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        /**
         * 生成这个URL的地方 -> http://platform.server.com/ptlogin/param.html
         * 不过要注意的是CGI的主域名要改为 weiyun.com
         */
        ptlogin_url = urls.make_url('http://ui.ptlogin2.weiyun.com/cgi-bin/login', {
            appid: 527020901,
            s_url: urls.make_url('/web/callback/qq_login_ok.html'),
            style: 11,
            lang : _.lang_id,
            target: 'self',
            link_target: 'blank',
            hide_close_icon: 1
        }),

        undefined;


    var qq_login = new Module('qq_login', {

        ui: require('./ui'),

        _visible: false,

        render: function () {
        },

        ok: function () {
            this.trigger('qq_login_ok');
            this.hide();
        },

        show: function () {
            if(this._visible) {
                return;
            }

            // user_log(9122);

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

        get_ptlogin_url: function () {
            return ptlogin_url;
        }

    });

    return qq_login;
});/**
 * QQ通行证登录UI
 * @author jameszuo
 * @date 13-3-26
 */
define.pack("./ui",["lib","common","$","./tmpl","./qq_login"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        force_blur = lib.get('./ui.force_blur'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),

        qq_login,

        undefined;

    var ui = new Module('qq_login_ui', {

        render: function () {
            qq_login = require('./qq_login');

            this._$el = $(tmpl.qq_login_box()).appendTo(document.body).css({ display: 'none', zIndex: 3000, width: '490px', height: '328px', backgroundColor: '#fff' });
            this._$iframe = this._$el.find('iframe');
        },

        show: function () {
            this._$el.stop(false, true).fadeIn('fast');
            this._$iframe.attr('src', qq_login.get_ptlogin_url());
            center.listen(this._$el);

            this.trigger('show');
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });

                force_blur(); // 修复浏览器状态栏始终显示 javascript:void(0); 的问题 - james

                this.trigger('hide');
            }
        }
    });
    return ui;
});
//tmpl file list:
//qq_login/src/qq_login.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'qq_login_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-qqlogin">\r\n\
        <iframe id="_qq_login_frame" style="height:100%;width:100%;" scrolling="auto" frameborder="0" src=""></iframe>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
