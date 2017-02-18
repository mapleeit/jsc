//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/qq_login/qq_login.r160222",["lib","common","$","new_qzonelogin_css"],function(require,exports,module){

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
define.pack("./qq_login",["lib","common","$","./tmpl","new_qzonelogin_css","./ui"],function (require, exports, module) {
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
    // 管理ptlogin的全局回调
    var ptlogin_callback_mgr = {
        ptlogin_events : [
            'Close',
            'LoginEx', // 它返回非true时表示出错。。。登录中止（if(!LoginEx(xxx)){ return; }）
            'Logout',
            'Reset',
            'Resize'
        ],
        callbacks_map : {},
        hooked_events : {},
        asure_event_hooked : function(event){
            var hooked_events = this.hooked_events;
            if(hooked_events.hasOwnProperty(event)){
                return;
            }
            var me = this,
                global = window;
            var fn_name = 'ptlogin2_on' + event,
                old_fn = global[fn_name];
            global[fn_name] = function(){
                var ret = me._trigger(event, $.makeArray(arguments));
                ret = ret !== false;
                if(ret && $.isFunction(old_fn)){
                    ret = old_fn();
                    ret = !!ret;
                }
                return ret;
            };
            hooked_events[event] = true;
        },
        register : function(event, callback, scope){
            this.asure_event_hooked(event);
            this._get_callbacks(event).push({
                fn : callback,
                scope : scope
            });
        },
        unregister : function(event, callback, scope){
            var callbacks = this._get_callbacks(event),
                processed = [];
            $.each(callbacks, function(index, o){
                if(o.fn !== callback || o.scope !== scope){
                    processed.push(o);
                }
            });
            this.callbacks_map[event] = processed;
        },
        _get_callbacks : function(event){
            var map = this.callbacks_map,
                callbacks = map[event];
            if(!callbacks){
                callbacks = map[event] = [];
            }
            return callbacks;
        },
        _trigger : function(event, argus){
            var callbacks = this._get_callbacks(event).slice(0);
            $.each(callbacks, function(index, o){
                o.fn.apply(o.scope, argus);
            });
        }
    };
    //限制登录的提示信息
    var err_msg_map = {
        '190011': '企业QQ号码无法使用微云，请使用普通QQ号码登录'
    };

    var ui = new Module('qq_login_ui', {

        render: function () {
            qq_login = require('./qq_login');
            this._render();
        },

        _render: function() {
            this._$el = $(tmpl.qq_login_box()).appendTo(document.body).css({ display: 'none', zIndex: 3000, width: '420px', height: '316px', backgroundColor: '#fff' });
            this._$el.find('.login').css({width: '422px', height: '316px', top: '50px', right: '0px', zIndex: '-1' });
            this._$qq_iframe = this._$el.find('#_qq_login_frame');
            this._$wx_iframe = this._$el.find('#_wx_login_frame');
            this._$agree_btn = $('.j-agree-switch');
            this._$agree_mask = $('.j-agree-mask');
            ptlogin_callback_mgr.register('Resize', this.on_ptlogin_resize, this);

            this.bind_events();
        },

        bind_events: function() {
            var me = this;
	        var curMod = 'qq';
            me._$el.on('click', '[data-mod]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-mod]');
                var mod = $target.attr('data-mod');
	            curMod = mod;
		        if(mod == 'close') {
			        qq_login.hide();
		        } else if(mod == 'qq') {
                    $target.addClass('checked');
                    me._$el.find('.choose-wx-wrap').removeClass('checked');
                    $('#_qq_login_frame').show();
                    $('#_wx_login_frame').hide();
                    me._$agree_mask.hide();
                    me._$agree_btn.find("[data-id=qq] .mod-check").addClass('act');
                    me._$agree_btn.find("[data-id=qq]").show();
                    me._$agree_btn.find("[data-id=weixin]").hide();
                } else if(mod == 'weixin') {
                    $target.addClass('checked');
                    me._$el.find('.choose-qq-wrap').removeClass('checked');
                    $('#_qq_login_frame').hide();
                    $('#_wx_login_frame').show();
                    me._$agree_mask.hide();
                    me._$agree_btn.find("[data-id=weixin] .mod-check").addClass('act')
                    me._$agree_btn.find("[data-id=qq]").hide();
                    me._$agree_btn.find("[data-id=weixin]").show();
                }
            });

            me._$el.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]');
                var action = $target.attr('data-action');
                if(action === 'agreement') {
                    var is_agree = $target.hasClass('act'),
                        $mask = $('.j-agree-mask');
                    if(is_agree) {
                        $mask.show();
                    } else {
                        $mask.hide();
                    }
                    $target.toggleClass('act');
                }
            });

	        me._$el.on('mouseover', '[data-mod]', function(e) {
		        e.preventDefault();
		        var $target = $(e.target).closest('[data-mod]');
		        var mod = $target.attr('data-mod');
		        if(mod == 'qq') {
			        $target.addClass('checked');
			        $('.choose-wx-wrap').removeClass('checked');
		        } else if(mod == 'weixin') {
			        $target.addClass('checked');
			        $('.choose-qq-wrap').removeClass('checked');
		        }
	        });

	        me._$el.on('mouseout', '[data-mod]', function(e) {
		        e.preventDefault();
		        if(curMod == 'qq') {
			        $('.choose-qq-wrap').addClass('checked');
			        $('.choose-wx-wrap').removeClass('checked');
		        } else {
			        $('.choose-wx-wrap').addClass('checked');
			        $('.choose-qq-wrap').removeClass('checked');
		        }
	        });
        },
        
        on_ptlogin_resize : function(width, height){
            var $el = this._$el;
            $el.css({
                width : width+'px',
                height : height+'px'
            });
            if(this.visible){
                center.update($el);
            }
        },

        show: function () {
            this.visible = true;
            this._$el.stop(false, true).fadeIn('fast');
            this._$qq_iframe.attr('src', qq_login.get_ptlogin_url());
            this._$wx_iframe.attr('src', qq_login.get_wxlogin_url());
            center.listen(this._$el);

            this.trigger('show');
        },

        hide: function () {
            this.visible = false;
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });

                force_blur(); // 修复浏览器状态栏始终显示 javascript:void(0); 的问题 - james

                this.trigger('hide');
            }
        },

        show_limit_tip: function(err_code) {
            this.destroy();
            this._render();
            this.show();

            var $tip = this._$limit_tip || $(tmpl.limit_login_tip({tip_msg: err_msg_map[err_code+'']})).appendTo(this._$el);
            $tip.fadeIn(500);
            setTimeout(function() {
                $tip.fadeOut(500);
            }, 5000);
            this._$limit_tip = $tip;
        },

        destroy: function() {
            if(this._$el) {
                this._$el.remove();
                this._$el = null;
                this._$iframe.remove();
                this._$iframe = null;
                this._$limit_tip && this._$limit_tip.remove();
                this._$limit_tip = null;
                ptlogin_callback_mgr.unregister('Resize');
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
__p.push('    <div class="wy-login-wrapper wy-share-login">\r\n\
	    <ul class="tab-wrapper">\r\n\
		    <!-- [ATTENTION!!] 分享登录，添加.wy-share-login -->\r\n\
		    <!-- [ATTENTION!!] 选定的时候，添加.checked -->\r\n\
		    <!-- [ATTENTION!!] hover 的时候，siblings()[0].removeClass(\'checked\') -->\r\n\
		    <li data-mod="qq" class="tab choose-qq-wrap checked">QQ账号登录<i class="icon-line"></i></li>\r\n\
		    <li data-mod="weixin" class="tab choose-wx-wrap">微信帐号登录<i class="icon-line"></i></li>\r\n\
	    </ul>\r\n\
	    <div class="close-btn" data-mod="close">\r\n\
		    <i class="icon icon-dialog-close"></i>\r\n\
	    </div>\r\n\
	    <div class="login">\r\n\
		    <iframe id="_qq_login_frame" style="height:100%;width:100%;" scrolling="auto" frameborder="0" src=""></iframe>\r\n\
		    <iframe id="_wx_login_frame" style="display:none;" height="100%" scrolling="no" width="100%" frameborder="0" src=""></iframe>\r\n\
	    </div>\r\n\
		<div class="mask j-agree-mask" style="display: none;"><p>需要同意微云服务协议才能登录</p></div>\r\n\
		<!-- 服务协议 S -->\r\n\
		<div class="pact-wrapper j-agree-switch">\r\n\
			<ul>\r\n\
				<li class="item" data-id="qq">\r\n\
					<!-- [ATTENTION!!] 选定的时候，添加.act -->\r\n\
					<div class="mod-check act" data-action="agreement"><i class="icon icon-check-s icon-checkbox"></i></div>\r\n\
					<a href="//www.weiyun.com/xy.html" target="_blank">同意《微云服务协议》</a>\r\n\
				</li>\r\n\
				<li class="item" data-id="weixin" style="display:none;">\r\n\
					<!-- [ATTENTION!!] 选定的时候，添加.act -->\r\n\
					<div class="mod-check act" data-action="agreement"><i class="icon icon-check-s icon-checkbox"></i></div>\r\n\
					<a href="//www.weiyun.com/xy.html" target="_blank">同意《微云服务协议》</a>\r\n\
				</li>\r\n\
			</ul>\r\n\
		</div>\r\n\
		<!-- 服务协议 E -->\r\n\
    </div>');

return __p.join("");
},

'limit_login_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="full-tip-box full-tip-warn" style="position: absolute;top: 1px;">\r\n\
        <span class="full-tip "><span class="inner"><i class="ico"></i><span class="text" data-id="label">');
_p(data.tip_msg);
__p.push('</span></span></span>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
