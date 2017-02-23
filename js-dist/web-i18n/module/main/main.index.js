//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","$","install_upload_plugin","webbase_css","i18n"],function(require,exports,module){

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
//main/src/access_check.js
//main/src/ad_link.js
//main/src/first_tips.js
//main/src/g5_ad.js
//main/src/go_top.js
//main/src/main.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
//main/src/main.APPBOX.tmpl.html
//main/src/main.WEB.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html

//js file list:
//main/src/access_check.js
//main/src/ad_link.js
//main/src/first_tips.js
//main/src/g5_ad.js
//main/src/go_top.js
//main/src/main.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
/**
 * 用户登录态检查（登录态、独立密码验证状态）
 *
 * 逻辑：
 *   request 模块的请求回调包含1024错误码时，会触发
 *
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./access_check",["lib","common","$","install_upload_plugin"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        constants = common.get('./constants'),

        $ = require('$'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),

        query_user = common.get('./query_user'),
        session_event = common.get('./global.global_event').namespace('session'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        upload_install = require('install_upload_plugin'),
        install = upload_install.get('./install'),
    // 登录成功的回调
        login_callback_stack = [],

        login_to,

        heartbeat, // 心跳 timeout ID
        heartbeat_interval = 45 * 60 * 1000, // 心跳间隔时间

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
                    query_user.destroy();

                    // 要求登录并query_user验证
                    me._req_ptlogin_n_quser();
                })
                // 独立密码无效，要求输入
                .listenTo(session_event, 'invalid_indep_pwd', function (login_callback, rsp_body) {
                    $.isFunction(login_callback) && login_callback_stack.push(login_callback);

                    // 要求输入独立密码验证
                    me._req_indep_login(rsp_body['nickname']);
                });


            // 维持心跳
            me.listenTo(query_user, 'load', function () {
                clearTimeout(heartbeat);
                heartbeat = setTimeout(function () {
                    query_user.get(true, true, false);
                }, heartbeat_interval);
            });

            // 相册将网盘页作为登录页使用（TODO 相册合入后删除这个跳转）james 2013-6-7
            var _login_to = url_parser.get_cur_url().get_hash_param('login_to');
            if (_login_to && _login_to.indexOf('http://www.weiyun.com/') === 0) {
                login_to = _login_to;
            }

            me._ready = true;
        },

        start: function () {
            var me = this;

            me.init();

            // 先验证客户端cookie
            if (!query_user.check_cookie()) {
                // 如果客户端没有 uin/skey，则要求登录，且登录完成后要再连接 server query_user 检查一次
                this._req_ptlogin_n_quser();
            }
            // 如果客户端有 uin/skey，则连接server验证
            else {
                me._server_check();
            }
        },

        /**
         * 要求ptlogin验证
         * @private
         */
        _req_ptlogin_n_quser: function () {
            var me = this;
            if (constants.IS_WRAPPED) { // 如果是嵌入其它网站，使用别人的登录态，就不使用自己的ptlogin了
                me.trigger('external_login');
            } else {
                require.async('qq_login', function (mod) {
                    var qq_login = mod.get('./qq_login'),
                        qq_login_ui = qq_login.ui;

                    me
                        .stopListening(qq_login)
                        .stopListening(qq_login_ui)
                        .listenTo(qq_login, 'qq_login_ok', function () {
                            me._server_check();
                        })
                        .listenToOnce(qq_login_ui, 'show', function () {
                            this.trigger('qq_login_ui_show');
                        })
                        .listenToOnce(qq_login_ui, 'hide', function () {
                            this.trigger('qq_login_ui_hide');

                            this.stopListening(qq_login_ui)
                        });

                    qq_login.show();
                });
            }
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
         * 通过 query_user 验证
         *   - 验证通过后，如果用户设置了独立密码，则验证独立密码; 否则就认为成功
         * @private
         */
        _server_check: function () {
            if (login_to) {
                query_user.off('load').on('load', function () { // 阻止其他回调
                    return false;
                });
                query_user.check().done(this._server_check_callback);
            } else {
                query_user.get(true, true, true).ok(this._server_check_callback);
            }
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

            if (!constants.IS_APPBOX) {
                upload_event.trigger("install_tips");
            }


        }
    };

    $.extend(access_check, events);

    return access_check;
});/**
 * 头部链接广告
 * @hibincheng 2013-06-24
 */
define.pack("./ad_link",["lib","common","$","./main"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        center = common.get('./ui.center'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls'),

        closed_ad_web = false,
        closed_ad_appbox = false,
        show_phone_download = false,//是否显示手机版广告链接，需要配合link_options设置
        default_link_type = 'text', //appbox使用的链接形式，更换形式请在这里修改  两种形式：[img, text]

        uin = query_user.get_uin_num(),

        /**
         * 广告链接配置，后面提供一个cms来配置(已提供:ad_config.json)
         */
        link_options,
        block_uins = ['10001','711029','10321','6508431','10015','10332','542245351']; //头部广告显示 加上黑名单屏蔽 @hibincheng

    var ad_link = {

        render : function() {
            var me = this;
            if($.inArray(uin+'', block_uins) > -1) {//用户在黑名单中则不显示广告
                return;
            }
            $.ajax('/data/ad_config.json',{
                cache : false,
                dataType: "json",
                success : function(data) {
                    link_options = data;
                    default_link_type = data['appbox_link_type'];
                    closed_ad_web = !data['enable_ad_web'];
                    closed_ad_appbox = !data['enable_ad_appbox'];
                    me._add_adtag(data);
                    if(data['appbox_link_type'] === 'phone') {//手机客户端弹框，也是文本链接，只不过是弹框而不是跳转
                        show_phone_download = true;
                        default_link_type = 'text';
                        data['appbox_text_text'] = data['appbox_phone_text'];
                    } else if(data['appbox_link_type'] === 'img' && data['appbox_img_phone_ad']) {//图片广告，且点击弹出手机版下载框
                        show_phone_download = true;
                    }
                    if(constants.IS_APPBOX) {//appbox
                        me._render_appbox();
                    } else {
                        me._render_web();
                    }
                }
            });
        },
        /**
         * 给广告链接加上ADTAG
         * @param {Object} data 链接配置数据
         * @private
         */
        _add_adtag : function(data) {
            //广告位关闭了就不需要处理了
            if(constants.IS_APPBOX && closed_ad_appbox) {
                return;
            } else if(!constants.IS_APPBOX && closed_ad_web) {
                return;
            }
            //先把原始链接数据保存起来，登陆后需要再次用到加ADTAG
            var web_href = data['web_href'] ;

            if(data['web_href']) {
                data['web_href'] = urls.make_url(data['web_href'], {WYTAG: aid.WEIYUN_APP_WEB_LOGIN});
            }
            if(data['appbox_text_href']) {
                data['appbox_text_href'] = urls.make_url(data['appbox_text_href'], {WYTAG: aid.WEIYUN_APP_APPBOX});
            }
            if(data['appbox_img_href']) {
                data['appbox_img_href'] = urls.make_url(data['appbox_img_href'], {WYTAG: aid.WEIYUN_APP_APPBOX});
            }

            this.listenTo(query_user, 'load', function() {//登陆后需要替换ADTAG
                if(!constants.IS_APPBOX && web_href) {
                    $('#_header_ad_link a')
                        .attr('href', urls.make_url(web_href, {WYTAG: aid.WEIYUN_APP_WEB_DISK}));
                }
            });
        },

        _render_web : function() {
            var me = this;
            if(!closed_ad_web) {
                $('#_header_ad_link')
                    .show()
                    .click(function(evt) {
                        me._after_link_click(evt);//用户点击的后续操作
                    })
                    .find('a')
                    .attr('href', link_options['web_href'])
                    .text(link_options['web_text']);
            }

        },

        _render_appbox: function() {
            var me = this;
            if(!closed_ad_appbox) {
                $('#_header_ad_link_'+default_link_type)
                    .show()
                    .click(function(evt) {
                        me._after_link_click(evt);//用户点击的后续操作
                    })
                    .find('a')
                    .text(link_options['appbox_'+default_link_type+'_text'])
                    .attr('href', link_options['appbox_'+default_link_type+'_href']);

                if(default_link_type === 'img') {//图片广告
                    $('#_header_ad_link_'+default_link_type+' img')
                        .attr('src' , link_options['appbox_'+default_link_type+'_src'])
                        .attr('alt' , link_options['appbox_'+default_link_type+'_alt']);
                }
            }

        },

        /**
         * 用户点击广告链接的后续操作
         * @param evt click 事件对象
         * @private
         */
        _after_link_click : function(evt) {
             if(constants.IS_APPBOX) {
                 user_log('header_ad_link_appbox');
                 if((default_link_type === 'text' || default_link_type === 'img') && show_phone_download ) {//appbox 广告位，弹出手机客户端下载框
                     evt.preventDefault();
                     this._show_phone_download_dialog();
                 }
             } else {//web 文字链接
                user_log('header_ad_link_web');
             }
        },

        /**
         * 在appbox中显示 手机版广告
         * @private
         */
        _show_phone_download_dialog : function() {
            var _el_dialog = $('#phone_download_dialog');
            if(_el_dialog.length === 0) {//DOM中不存在，则先创建
                _el_dialog = $(this._generate_phone_ad_markup())
                    .appendTo($('body'))
                    .show();
                center.listen(_el_dialog);
                this._init_dialog_events();
            } else {
                //初始化
                $('#phone_download_dialog .register_form input.text').val('');
                $('#phone_download_dialog .register_form').show();
                $('#phone_download_dialog .register_success').hide();
                $('#phone_download_dialog .register_form p.error_des').hide();
                _el_dialog.show();
            }
        },

         _toggle_phone_download_dialog : function(mod_alias) {
            if(mod_alias === 'photo') {//切换到相册时,dialog要隐藏
                $('#phone_download_dialog').hide();
            }
        },
        /**
         * 初始化手机广告弹框一些事件
         * @private
         */
        _init_dialog_events : function() {
            var main = require('./main');
            this.listenTo(main, 'activate_sub_module', this._toggle_phone_download_dialog);

            $('#phone_download_dialog').on('click', 'del, .register_success a.button', function() {//弹框隐藏
                $('#phone_download_dialog').hide();
            }).on('click', '.register_form a.button', function() {//发送短信操作
                var _num = $('#phone_download_dialog .register_form input.text').val(),
                    _el_error = $('#phone_download_dialog .register_form p.error_des');
                if(!(/^1[358]\d{9}$/.test(_num))){
                    _el_error.show();
                }else{
                    _el_error.hide();

                    $.get('http://www.weiyun.com/php/msgsend.php', {number:_num, flag:1}, function (data){
                        if(data.ret == '0') {
                            $('#phone_download_dialog .register_form').hide();
                            $('#phone_download_dialog .register_success').show();
                        }else if( data.ret == '6' || data.ret == '7') {
                            _el_error.html('发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。').show();
                        }else {
                            _el_error.html('网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。').show();
                        }
                    }, 'json');
                }
            }).on('click', '.register_success a.tryagain', function() {//点击再次发送短信
                $('#phone_download_dialog .register_form').show();
                $('#phone_download_dialog .register_success').hide();
                $('#phone_download_dialog .register_form p.error_des').hide();
            });
        },

        /**
         * 手机广告弹框（appbox中才有）
         * @returns {string} html markup
         * @private
         */
        _generate_phone_ad_markup : function() {
            return [
                '<div class="get_app_layer" id="phone_download_dialog" style="display:none;">',
                    '<del></del>',
                    '<h2>微云手机版</h2>',
                    '<div class="get_url_area">',
                        '<div class="register_area">',
                            '<div class="register_form" style="display: ;">',
                                '<h3>方法一：短信获取下载地址</h3>',
                                '<p class="des">请填写手机号，下载地址将发送到您的手机上。</p>',
                                '<input class="text" type="tel" placeholder="请输入手机号码">',
                                '<a class="button" href="javascript:void(0)">发送短信</a>',
                                '<p class="error_des" style="display: none;">您输入的电话号码有误，请重新输入。</p>',
                            '</div>',
                            '<div class="register_success" style="display: none;">',
                                '<h3>方法一：手机短信获取</h3>',
                                '<p class="des">您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。</p>',
                                '<a class="button" href="javascript:void(0)">完成</a>',
                                '&nbsp;&nbsp;&nbsp;&nbsp;<a class="tryagain" href="javascript:void(0)">再次发送短信</a><p></p>',
                            '</div>',
                            '<div class="get_apk">',
                                '<h3>方法二：下载安装包</h3>',
                                '<p class="des other">',
                                    '<a href="'+link_options['android_appbox_url']+'">android版</a>',
                                    '<a target="_blank" href="'+link_options['iphone_url']+'">iPhone版</a>',
                                '</p>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="get_code_area">',
                        '<h3>方法三：二维码获取</h3>',
                        '<p class="des">使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。</p>',
                        '<img src="http://imgcache.qq.com/vipstyle/nr/box/portal/demoImg/weiyunQR.png">',
                    '</div>',
                '</div>'].join('');
        }
    };

    $.extend(ad_link, events);

    return ad_link;
});
/**
 *
 * @author jameszuo
 * @date
 */
define.pack("./first_tips",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),

        undefined;

    var first_tips = new Module('first_tips', {

        render: function () {
            this.listenToOnce(query_user, 'load', function (user) {
                // QQ网盘迁移用户首次访问提示
                if (user.is_qqdisk_user() && user.is_qqdisk_user_first_access()) {
                    this.show_qqdisk_tips();
                }
                // 网络收藏夹迁移用户首次访问提示
                else if (user.is_favorites_user() && user.is_fav_user_first_access()) {
                    this.show_fav_tips();
                }
            });
        },

        // QQ网盘迁移用户首次访问提示
        show_qqdisk_tips: function () {
            require.async('qd_migration', function (mod) {
                var qd_migration = mod.get('./qd_migration');
                qd_migration.show();
            });
        },

        // 网络收藏夹迁移用户首次访问提示
        show_fav_tips: function () {
            require.async('net_fav_migration', function (mod) {
                var net_fav_migration = mod.get('./net_fav_migration');
                net_fav_migration.show();
            });
        }
    });

    return first_tips;
});/**
 * 送5G广告
 * @author jameszuo
 * @date 13-4-2
 */
define.pack("./g5_ad",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        store = lib.get('./store'),

        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        size_limit = 7 * Math.pow(1024, 3), // Math.pow(1024, 3) === 1G
        ad_closed_store_key = '_g5_ad_closed',

        undefined;

    var g5_ad = {

        render: function () {

            this.listenToOnce(query_user, 'load', function (user) {

                var closed_ad = !!store.get(query_user.get_uin_num() + ad_closed_store_key);

                // 总空间小于7G，且未关闭该广告，则显示
                if(user.get_total_space() < size_limit && !closed_ad) {

                    var $el = $('#_header_5g_ad').show();

                    // 关闭广告
                    $el.on('click', '[data-action=X]', function (e) {
                        e.preventDefault();

                        $el.remove();
                        store.set(query_user.get_uin_num() + ad_closed_store_key, 1);
                    });

                }
            });
        }
    };

    $.extend(g5_ad, events);

    return g5_ad;

});/**
 *
 * @author jameszuo
 * @date 13-4-23
 */
define.pack("./go_top",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        scroller = common.get('./ui.scroller'),
        global_event = common.get('./global.global_event'),
        click_tj = common.get('./configs.click_tj'),

        tmpl = require('./tmpl'),

        main_ui,

        _$win = $(window),
        _$el,
        _$box,
        _visible = false,

        undefined;


    var go_top = new Module('go_top', {

        render: function () {
            main_ui = require('./ui');
            _$box = main_ui.get_$body_box();


            this.listenTo(global_event, 'window_scroll', function () {
                if (this._need_show()) {
                    this._show();
                } else {
                    this._hide();
                }
            });
            this.listenTo(global_event, 'window_resize', function () {
                if (this._need_show()) {
                    this._update_right();
                }
            });
        },

        _render_if: function () {
            if (!_$el) {
                _$el = $([
                        '<a href="#" class="box_mod_totop" style="display:none;" hidefocus="on" ',
                        click_tj.make_tj_str('TO_TOP'),
                        '></a>'
                    ].join('')).appendTo(document.body);

                // 点击时，上去！
                _$el.on('click', function (e) {
                    e.preventDefault();

                    scroller.top();
                });

                this._update_right();
            }
        },

        _show: function () {
            this._render_if();

            if(!_visible) {
                _$el.stop(true, true).fadeIn();
                _visible = true;
            }
        },

        _hide: function () {
            if (_$el && _visible) {
                _$el.stop(true, true).fadeOut();
            }
            _visible = false;
        },

        _update_right: function () {
            this._render_if();

            _$el.css('right', ((_$win.width() - _$box.width()) / 2 - _$el.outerWidth() - 1/*border*/) + 'px');
        },

        _need_show: function () {

            return _$win.scrollTop() > _$win.height() / 3;
        }

    });

    return go_top;
});/**
 *
 * @author jameszuo
 * @date 13-3-1
 */
define.pack("./main",["lib","common","$","./tmpl","./access_check","./ui"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),
        m_speed = common.get('./m_speed'),
        aid = common.get('./configs.aid'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        access_check = require('./access_check'),

    // url hash 中的模块参数名
        module_hash_key,
        default_module_name,
        default_module_params,
        sub_modules_map,
        async_sub_modules = {},

        cur_mod_alias,  // 当前模块名

        undefined;

    var main = new Module('main', {

        ui: require('./ui'),

        set_default_module: function (mod_name, mod_params) {
            default_module_name = mod_name;
            default_module_params = mod_params;
            return this;
        },

        /**
         * 将hash解析为模块路径，并分发
         * @return {String[]} path
         * @private
         */
        _parse_hash: function (hash) {
            var path = hash && hash.split ? hash.split('.') : [];
            var mod_name = path.shift();
            this.async_render_module(mod_name, {
                path: path
            });
        },

        set_module_hash_key: function (key) {
            module_hash_key = key;
            return this;
        },

        /**
         * 配置异步加载的模块
         * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        set_async_modules_map: function (map) {
            sub_modules_map = map;
            return this;
        },

        /**
         * 异步载入模块
         * @param {String} mod_alias 模块URL|模块别名
         * @param {*} [params]  传递给目标模块的参数
         */
        async_render_module: function (mod_alias, params) {
            if (!(mod_alias in sub_modules_map)) {
                mod_alias = default_module_name;
            }


            cur_mod_alias = mod_alias;

            var me = this;

            // 如果已存在，则激活
            if (async_sub_modules.hasOwnProperty(mod_alias)) {

                var mod = async_sub_modules[mod_alias];
                me.activate_sub_module(mod, params);
                me.trigger('activate_sub_module', mod_alias);
            }

            // 不存在，异步加载，然后激活
            else {

                // 测速
                try {
                    m_speed.start(mod_alias, 'js_css');
                }
                catch (e) {
                }

                console.debug(mod_alias + ' async start time == ' + (+new Date()));
                require.async(mod_alias, function (module_dir) {
                    console.debug(mod_alias + ' async end   time == ' + (+new Date()));
                    cur_mod_alias = mod_alias;

                    // 测速
                    try {
                        m_speed.done(mod_alias, 'js_css');
                    }
                    catch (e) {
                    }

                    var main_mod = sub_modules_map[mod_alias];

                    if (!module_dir || !module_dir.get) {  // 模块加载失败（加载失败时 module_dir 可能指向其他模块，这是seajs的一个bug）
                        console.error('模块加载失败：', mod_alias, main_mod);
                        return;
                    }

                    var mod = module_dir.get(main_mod);

                    async_sub_modules[mod_alias] = mod;

                    me.activate_sub_module(mod, params, mod_alias);
                    me.trigger('activate_sub_module', mod_alias);
                });
            }
        },

        /**
         * 激活指定子模块，并隐藏其他子模块
         * @param {Module} cur_mod 要激活的子模块
         * @param {*} params 传递给目标模块的参数
         * @param {String} mod_alias
         */
        activate_sub_module: function (cur_mod, params, mod_alias) {

            for (var mod_alias in async_sub_modules) {
                var async_sub_mod = async_sub_modules[mod_alias];
                if (async_sub_mod !== cur_mod) {
                    async_sub_mod.deactivate();
                }
            }

            this.ui.update_module_ui(cur_mod);

            cur_mod.render();
            cur_mod.activate(params);
        },

        /**
         * 获取当前激活的模块别名
         * @return {String}
         */
        get_cur_mod_alias: function () {
            return cur_mod_alias;
        },

        /**
         * 判断模块是否已加载并且已激活
         * @param {String} mod_alias 模块别名
         */
        is_mod_loaded: function (mod_alias) {
            var mod = async_sub_modules[mod_alias]
            return !!mod && mod.is_activated();
        },

        /**
         * 切换模块
         * @param {String} mod_alias
         * @param {Object} [params]
         */
        switch_mod: function (mod_alias, params) {
            if (mod_alias !== cur_mod_alias)
                routers.go($.extend({m: mod_alias}, params));
        },

        /**
         * 获取反馈的url
         * @returns {String}
         */
        get_feedback_url: function(){
            return urls.make_url('http://support.qq.com/write.shtml',{fid: 943, SSTAG: 'web_disk', WYTAG : aid.WEIYUN_APP_WEB_DISK});
        }
    });

    main.once('render', function () {
        // 初始化 url hash 映射
        this.
            listenTo(routers, 'init', function () {
                var default_mod = routers.get_param(module_hash_key) || default_module_name;
                this._parse_hash(default_mod);
            })
            .listenTo(routers, 'add.' + module_hash_key, function (mod_name) {
                this._parse_hash(mod_name);
            })
            .listenTo(routers, 'change.' + module_hash_key, function (mod_name) {
                this._parse_hash(mod_name);
            })
            .listenTo(routers, 'remove.' + module_hash_key, function () {
                this.async_render_module(default_module_name, default_module_params);
            });

        // 初始化路由
        routers.init();

        // 启动访问控制模块
        access_check.start();
    });

    return main;
});/**
 * 空间信息
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./space_info.space_info",["lib","common","$","./tmpl","./space_info.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var space_info = new Module('main_space_info', {

        ui: require('./space_info.ui'),

        render: function () {
            this.listenTo(query_user, 'load', function (user) {
                this._refresh_by_user(user);
            });

            // 如果 query_user 在 space_info 就绪前就已经查询到了，那么就需要从已有的缓存中读取
            var user = query_user.get_cached_user();
            if (user) {
                this.once('render', function () {
                    this._refresh_by_user(user);
                });
            }
        },

        refresh: function () {
            var me = this;
            query_user.get(true, false, false, function (user) {
                me._refresh_by_user(user);
            });
        },

        _refresh_by_user: function (user) {
            this.trigger('load', user.get_used_space(), user.get_total_space());
        },

        add_used_space_size: function (size) {
            this.ui.add_used_space_size(size);
        }
    });

    return space_info;
});/**
 * 空间信息UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./space_info.ui",["lib","common","$","./tmpl","./space_info.space_info"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        tmpl = require('./tmpl'),
        space_info,

        undefined;

    var ui = new Module('main_space_info_ui', {

        _used_space: 0,
        _total_space: 0,

        render: function ($to) {
            space_info = require('./space_info.space_info');

            this._$el = $(tmpl.space_info());

            $($to).replaceWith(this._$el);

            // 文字
            this._$text = $('#_main_space_info_text');
            // 进度条
            this._$bar = $('#_main_space_info_bar');

            this
                // 每次加载完成后更新DOM
                .listenTo(space_info, 'load', function (used_space, total_space) {
                    this._used_space = used_space;
                    this._total_space = total_space;
                    this.trigger('space_size_changed');
                })

                .on('space_size_changed', function () {
                    this._update_text();
                    this._update_bar();
                });
        },

        /**
         * 增加已使用的空间（仅本地缓存）
         * @param {Number} size
         */
        add_used_space_size: function (size) {
            this._used_space += size;
            this.trigger('space_size_changed');
        },

        // 文字
        _update_text: function () {
            this._$text.text(text.format('{used_space}/{total_space}', {
                used_space: File.get_readability_size(this._used_space, false, 2),
                total_space: File.get_readability_size(this._total_space, false, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.floor(this._used_space / this._total_space * 100);
            this._$bar
                .css('width', Math.min(percent, 100) + '%')

                .parent()
                .toggleClass('full', percent >= 90)
                .attr('title', percent + '%');
        },

        get_used_space: function(){
            return this._used_space;
        },
        get_total_space: function(){
            return this._total_space;
        }
    });

    return ui;
});/**
 * Main UI
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./ui",["webbase_css","lib","common","$","./tmpl","./main","./access_check","./user_info","./space_info.space_info","./first_tips","./ad_link"],function (require, exports, module) {

    require('webbase_css'); // 取消这一行的注释，修复DOM先渲染，然后css才加载完成的bug - james

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        routers = lib.get('./routers'),

        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),

        tmpl = require('./tmpl'),

        uiv = constants.UI_VER,
        is_visible = false,

        main, access_check,

        last_header_height,

        undefined;

    var ui = new Module('main_ui', {

        render: function () {

            main = require('./main');
            access_check = require('./access_check');

            this._init_ui();

            this._init_header_fix();

            this._render_user_info();

            this._render_first_tips();

            this._init_log();

            //this._render_ad_link();
        },

        _init_ui: function () {
            var $ui_root = this._$ui_root = $(tmpl['root_' + uiv]()),
                body_class = constants.IS_APPBOX ? 'app-appbox' : 'web-app';

            $(document.body).addClass(body_class).append($ui_root);

            this._toggle_base_body(false);

            // appbox 要等登录后才显示头部tab
            if (constants.IS_APPBOX) {
                this._toggle_base_header(false);
            }

            // query_user 完成后才显示UI
            this.listenTo(query_user, 'done', function (msg, ret) {

                // 加载成功或返回非1024、1030的错误时，才显示UI
                if (ret !== ret_msgs.INVALID_SESSION && ret !== ret_msgs.INVALID_INDEP_PWD) {
                    is_visible = true;

                    // 初始化导航
                    this._render_nav();

                    this._toggle_base_header(true);
                    this._toggle_base_body(true);
                }
            });

            this.listenTo(main, 'activate_sub_module', function () {
                this._hide_loading();
            });

            this
                .listenTo(access_check, 'qq_login_ui_show', function () {
                    if (this.is_visible()) {
                        widgets.mask.show('qq_login');
                    }
                })
                .listenTo(access_check, 'qq_login_ui_hide', function () {
                    widgets.mask.hide('qq_login');
                });

            // 独立上传模块
            this._render_upload();

            if (!constants.IS_APPBOX) {
                // 限制IE6最小宽度
                this._fix_ie6_min_width();
            }
        },

        _init_header_fix: constants.UI_VER === 'WEB' ? function () {
            this.listenTo(global_event, 'page_header_height_changed', this._fix_header_height);
        } : $.noop,

        _fix_header_height: constants.UI_VER === 'WEB' ? function () {
            if (constants.UI_VER === 'WEB') {
                var $fix_header = this._get_$fixed_header();
                if ($fix_header[0]) {
                    var new_height = this.get_fixed_header_height();
                    if (last_header_height !== new_height) {
                        this._get_$header_placeholder().height(new_height);
                        global_event.trigger('page_header_height_resize', new_height);
                        last_header_height = new_height;
                    }
                }
            }
        } : $.noop,

        // 显示用户信息
        _render_user_info: function () {
            require('./user_info').render();

            this._render_space_info($('#_main_space_info'));
        },

        // 加载upload
        _render_upload: function () {
            console.debug('upload async start time == ' + (+new Date()));
            require.async('upload', function (upload_mod) {
                console.debug('upload async end   time == ' + (+new Date()));
                upload_mod.get('./upload_route').render();
            });
        },

        // 显示空间信息
        _render_space_info: function ($to) {
            // 初始化web空间信息
            require('./space_info.space_info').render($to);
        },

        // OZ上报
        _init_log: function () {
            $('#_main_client_down').on('click', function () {
                user_log('HEADER_USER_FACE_DOWNLOAD_CLIENT');
            });
            $('#_main_feedback').on('click', function () {
                user_log('HEADER_USER_FACE_FEEDBACK');
            });
        },

        _toggle_base_header: function (flag) {
            if (uiv === 'APPBOX') {
                this._get_$fixed_header().toggle(!!flag);
                this.get_$bars().toggle(!!flag);
            } else {
                this.get_$header_banner().toggle(!!flag);   // TODO 晚一点看看是否还需要通过JS控制 james
            }
        },

        _toggle_base_body: function (flag) {
            if (uiv === 'APPBOX') {
                this.get_$bars().each(function (i, bar) {
                    bar.style.display = '';
                });
            } else {
                this.get_$header_box().toggle(!!flag);
            }
            this.get_$body_box().toggle(!!flag);
            this._fix_header_height();
        },

        get_$header_cnt: function () {
            return $('#_main_header_cnt');
        },

        get_$header_banner: function () {
            return $('#_main_header_banner');
        },

        get_$header_box: function () {
            return $('#_main_header_box');
        },

        get_$bar1: function () {
            return $('#_main_bar1');
        },

        get_$bar2: function () {
            return $('#_main_bar2');
        },

        get_$bars: function () {
            return this.get_$bar1().add(this.get_$bar2())
        },

        get_$tbar_box: function () {
            return $('#_main_tbar_cont');
        },

        get_$body_box: function () {
            return $('#_main_box');
        },

        get_$ui_root: function () {
            return this._$ui_root;
        },

        get_$wrapper: function () {
            return this._$wrapper || (this._$wrapper = $('#_main_wrapper'));
        },

        is_visible: function () {
            return is_visible;
        },

        get_fixed_header_height: function () {
            return this._get_$fixed_header().height();
        },

        update_module_ui: function (cur_mod) {
            var mod_cls_name = 'module-' + cur_mod.module_name,
                root = this.get_$ui_root()[0];
            root.className = root.className.replace(/\s*module\-\w+\s*/g, ' ').replace(/\s+/, ' ') + ' ' + mod_cls_name;
        },

        _get_$fixed_header: function () {
            return this._$fixed_header || (this._$fixed_header = $('#_main_fixed_header'));
        },

        _get_$header_placeholder: function () {
            return this._$header_placeholder || (this._$header_placeholder = $('#_main_header_placeholder'));
        },

        _get_$nav: function () {
            return this._$nav || (this._$nav = $('#_main_nav'));
        },

        //获取上传按钮对象
        get_$uploader: function () {
            return this._get_$nav().find('[data-action="upload"]');
        },
        // 初始化导航栏
        _render_nav: function () {
            var $nav = this._get_$nav().show();

            var me = this;

            $nav
                .on('click', 'li[data-mod]', function (e) {
                    e.preventDefault();

                    var $el = $(this),
                        mod_alias = $el.attr('data-mod');

                    routers.go({ m: mod_alias });

                    // 如果模块已激活，点击模块入口时触发
                    if (main.is_mod_loaded(mod_alias)) {
                        global_event.trigger(mod_alias + '_reenter');
                    }
                })
                .on('click', 'a[data-refresh]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $el = $(this),
                        mod_alias = $el.attr('data-refresh');
                    if (mod_alias) {//触发刷新事件 譬如 recent_refresh
                        global_event.trigger(mod_alias + '_refresh');
                    }
                });

            // 更新导航栏item的选中样式
            var current_nav = function (mod_alias) {
                var cur_cls = uiv === 'APPBOX' ? 'nav-current' : 'current';
                $nav.find('[data-mod]').removeClass(cur_cls).filter('[data-mod="' + mod_alias + '"]').addClass(cur_cls);
            };

            // 激活子模块时，同步更新导航栏item的选中样式
            me.listenTo(main, 'activate_sub_module', function (mod_alias) {
                current_nav(mod_alias);
            });

            // 更新导航栏item的选中样式
            var cur_mod_alias = main.get_cur_mod_alias();
            if (cur_mod_alias) {
                current_nav(cur_mod_alias);
            }

            if (!(uiv === 'APPBOX')) {
                if (!constants.IS_APPBOX) {  // TODO 晚一点看看是否还需要通过JS修正左侧导航栏高度 james
                    // 修正左侧导航栏的高度
                    var $win = $(window),
                        fix_header_height = this.get_$header_banner().outerHeight(),
                        fix_size = function (_, win_height) {
                            var nav_height = win_height - fix_header_height - 2;
                            $nav.height(nav_height);
                        };

                    this.listenTo(global_event, 'window_resize', fix_size);
                    fix_size(0, $win.height());
                }
            }
        },

        // 首次访问的提示
        _render_first_tips: function () {
            require('./first_tips').render();
        },

        // 显示、隐藏 loading
        _hide_loading: function () {
            $('#loading-text').remove();
            $('#loading-icon').remove();
            $('html').css('backgroundColor', '');
        },

        //头部广告链接
        _render_ad_link: function () {
            require('./ad_link').render();
        },

        _fix_ie6_min_width: function () {
            var $win = $(window);

            if ($.browser.msie && $.browser.version < 7) {
                // IE6的min-width限制
                var root_min_width = 930,
                    $root = this.get_$ui_root(),
                    fix_size = function (win_width) {
                        if (win_width < root_min_width) {
                            $root.width(root_min_width);
                        } else {
                            $root.css('width', '');
                        }
                    };

                this.listenTo(global_event, 'window_resize', fix_size);
                fix_size($win.width());
            }
        }
    });

    if (constants.IS_WEBKIT_APPBOX) {
        ui.once('render', function () {
            setTimeout(function () {
                require.async('download_route');
            }, 200);
        });
    }
    return ui;
});/**
 * 显示一些用户信息（昵称、独立密码设置状态等等）
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./user_info",["lib","common","i18n","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        page_event = common.get('./global.global_event').namespace('page'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        Pop_panel = common.get('./ui.pop_panel'),

        win = window,

        last_has_pwd,

        last_user_uin,              //上一个用户的uin

        face_rendered = false,      // 头像是否已初始化
        face_menu_visible = false,  // 头像菜单是否可见

        undefined;


    var user_info = {

        render: function () {

            this._render_pwd_locker();

            constants.UI_VER !== 'APPBOX' && this._render_logout();

            var cur_user = query_user.get_cached_user();
            if (cur_user) {
                this._render_face(cur_user);
                this.set_nickname(cur_user.get_nickname());
            }

            // 监听用户信息变化（独立密码设置状态、昵称、头像等）
            this
                .listenTo(query_user, 'load', function (user) {
                    //第一次登陆把用户的uin保存起来  再次登陆，如果是用其它帐户登陆，要更新用户信息 fixed bug48758599 by hibincheng
                    if (!last_user_uin && !face_rendered) {
                        last_user_uin = user.get_uin();
                    } else if (last_user_uin !== user.get_uin()) {
                        face_rendered = false;
                    }
                    this._render_face(user);
                    this.set_nickname(user.get_nickname());

                    if (last_has_pwd !== user.has_pwd()) {
                        this.set_pwd_locker(user.has_pwd());
                    }
                });
        },

        /**
         * 设置独立密码的锁图标
         * @param {Boolean} locked
         */
        set_pwd_locker: function (locked) {
            var $locker = this._get_$locker();
            $locker.find('span').toggle(!locked);
        },

        /**
         * 更新昵称
         * @param {String} nickname
         */
        set_nickname: function (nickname) {
            if ($.browser.msie & $.browser.version < 7) {
                nickname = text.smart_sub(nickname, constants.IS_APPBOX ? 6 : 7);
            }
            $('#_main_nick_name').text(nickname);
        },

        /**
         * 头像、头像的菜单
         * @param {query_user.User} user
         */

        _render_face: function (user) {
            if (!constants.IS_APPBOX && face_rendered) // appbox 不使用头像
                return;

            var $face = $('#_main_face'),
                $face_menu = $('#_main_face_menu'),
                $face_img = $face.find('img');

            if (constants.UI_VER === 'APPBOX') {
                var $face_cont = $face.children();

                new Pop_panel({
                    host_$dom: $face,
                    $dom: $face_menu,
                    show: function () {
                        $face_menu.show();
                        $face_cont.addClass('hover');
                        // OZ上报
                        user_log('HEADER_USER_FACE_HOVER');
                    },
                    hide: function () {
                        $face_menu.hide();
                        $face_cont.removeClass('hover');
                    },
                    delay_time: 300
                });
            } else {
                var $avatar = $face.find('span.user-avatar');
                new Pop_panel({
                    host_$dom: $face,
                    $dom: $face_menu,//弹层对象
                    show: function(){//the show handler
                        $face_menu.show();
                        if(constants.IS_APPBOX){
                            $face.addClass('user-info-hover');
                        }else{
                            $avatar.addClass('user-avatar-hover');
                        }
                        // OZ上报
                        user_log('HEADER_USER_FACE_HOVER');
                    },
                    hide: function(){//the hide handler
                        $face_menu.hide();
                        if(constants.IS_APPBOX){
                            $face.removeClass('user-info-hover');
                        }else{
                            $avatar.removeClass('user-avatar-hover');
                        }
                    },
                    delay_time: 300//延时300毫秒消失
                });
            }

            // 先显示默认头像
            $face.show();

            // 获取头像
            this._get_face_by_uin(user.get_uin()).done(function (url) {
                $face_img.attr('src', url);
            });


            face_rendered = true;
        },

        /**
         * 独立密码锁逻辑
         * @private
         */
        _render_pwd_locker: function () {
            var me = this;

            page_event
                .on('set_indep_pwd', function () {
                    me.set_pwd_locker(true);
                })
                .on('unset_indep_pwd', function () {
                    me.set_pwd_locker(false);
                });

            // 点击独立密码图标时加载独立密码设置模块
            me._get_$locker().on('click', function (e) {
                e.preventDefault();

                if (query_user.get_cached_user()) {
                    require.async('indep_setting', function (indep_setting) {
                        var indep_setting_mod = indep_setting.get('./indep_setting');
                        indep_setting_mod.show();
                    });
                }
            });

            //this._toggle_$locker(false);
        },

        _render_logout: function () {
            var me = this;

            // 退出按钮
            $('#_main_logout').on('click', function (e) {
                e.preventDefault();

                // 判断是否正在上传文件
                var msg = page_event.trigger('before_unload');
                if (msg) {
                    widgets.confirm(_('确认'), msg, '', function () {
                        page_event.trigger('confirm_unload');
                        me._logout();
                    });
                } else {
                    me._logout();
                }
            });
        },

        _logout: function () {
            query_user.destroy();
            window.location.href = 'http://www.weiyun.com/disk/index-en.html';  //默认都跳转到 该地址
        },
        _get_$locker: function () {
            return $('#_main_pwd_locker');
        },

        _get_face_by_uin: function (uin) {
            var def = $.Deferred();

            /*初始化 头像信息*/
            $.ajax({
                url: urls.make_url('http://ptlogin2.weiyun.com/getface', {
                    appid: 527020901,
                    imgtype: 3,
                    encrytype: 0,
                    devtype: 0,
                    keytpye: 0,
                    uin: uin,
                    r: Math.random()
                }),
                dataType: 'jsonp',
                jsonp: false
            });

            win.pt = {
                setHeader: function (json) {
                    for (var key in json) {
                        if (json[key]) {
                            def.resolve(json[key]);
                            break;
                        }
                    }
                    if ('resolved' !== def.state()) {
                        def.reject();
                    }
                    win.pt = null;
                    try {
                        delete window.pt;
                    } catch (e) {
                    }
                }
            };

            return def;
        }
    };

    $.extend(user_info, events);

    return user_info;
});
//tmpl file list:
//main/src/main.APPBOX.tmpl.html
//main/src/main.WEB.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'root_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls'),
        uiv = constants.UI_VER;
    __p.push('    <div class="layout">\r\n\
        <div id="_main_fixed_header" class="lay-header clear">\r\n\
            <a class="logo" href="');
_p( urls.make_url('http://www.weiyun.com', { WYTAG: aid.APPBOX_DISK_LOGO }) );
__p.push('" target="_blank"></a>');
_p( this['ad_' + uiv]() );
__p.push('            ');
_p( this['user_' + uiv]() );
__p.push('            ');
_p( this['face_menu_' + uiv]() );
__p.push('        </div>');
_p( this['nav_' + uiv]() );
__p.push('        ');
_p( this['bar1_' + uiv]() );
__p.push('        ');
_p( this['bar2_' + uiv]() );
__p.push('\r\n\
        <div class="lay-main-con">\r\n\
            <div class="inner">\r\n\
                <div id="_main_box" class="wrap">');
/*各模块的主体放这里*/__p.push('                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'bar1_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_bar1" class="lay-main-toolbar">');
/*各模块的工具栏放这里*/__p.push('    </div>');

return __p.join("");
},

'bar2_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_bar2" class="lay-main-head">');
/*各模块的路径（之类）放这里*/__p.push('    </div>');

return __p.join("");
},

'face_menu_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls'),
        main = require('./main');
    __p.push('\r\n\
    <!-- 头像下方的菜单 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info"></div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <li><a id="_main_pwd_locker" ');
_p(click_tj.make_tj_str('INDEP_PWD'));
__p.push(' href="javascript:void(0)"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>\r\n\
            <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_WEB_DISK}));
__p.push('" target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
            <li><a id="_main_feedback" href="');
_p(main.get_feedback_url());
__p.push('" target="_blank"><i class="icon-fedbk"></i>反馈</a></li>\r\n\
        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'nav_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants'),
        uiv = constants.UI_VER;
    __p.push('    \r\n\
    <div id="_main_nav" style="display:none;" class="lay-aside">');
_p( this['upload_btn_' + uiv]() );
__p.push('\r\n\
        <ul class="nav-box">');

            var m = [
                { mod: 'disk', name: '{#path#}网盘', cls: 'all', tj_key: 'NAV_DISK', refresh: true },
                { mod: 'photo', name: '相册', cls: 'pic', tj_key: 'NAV_PHOTO', refresh: false },
                { mod: 'recent', name: '最近', cls: 'recent', tj_key: 'NAV_RECENT', refresh: true },
                '-',
                { mod: 'recycle', name: '回收站', cls: 'recycle', tj_key: 'NAV_RECYCLE', refresh: false }
            ];
            for (var i=0, l=m.length; i<l; i++) {
                var n = m[i];
                if (n === '-') {
                    __p.push('<li class="nav-gap"><span class="gap"></span></li>');

                } else {
                    __p.push('<li data-mod="');
_p(n.mod);
__p.push('" class="nav-list" ');
_p(click_tj.make_tj_str(n.tj_key));
__p.push('>\r\n\
                        <a class="link ');
_p(n.cls);
__p.push('" href="#"></a>');
 if (n.refresh) { __p.push('<a data-refresh="');
_p( n.mod );
__p.push('" class="ref" href="#"></a>');
 } __p.push('                    </li>');

                }
            }
            __p.push('        </ul>\r\n\
        <b class="aside-beautiful"></b>\r\n\
    </div>');

return __p.join("");
},

'user_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_main_face" data-no-selection style="display:none;" class="user">\r\n\
        <div class="normal">\r\n\
            <div class="inner">\r\n\
                <img src="http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
                <i class="ico"></i>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'upload_btn_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-action="upload" class="upload-btn">\r\n\
    </div>');

}
return __p.join("");
},

'ad_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants');
    __p.push('    <div id="_header_ad_link_img" style="display:none;"><a  class="header-ad" href="#"  target="_blank"><img src=""/></a></div>\r\n\
    <div id="_header_ad_link_text" class="ad" style="display:none;">\r\n\
        <i class="ico"></i>\r\n\
        <a class="txt" href="#" target="_blank" hidefocus="on">');
/*手机版每日签到，免费容量最高可达100G，点击下载&gt;&gt;*/__p.push('</a>\r\n\
    </div>');

}
return __p.join("");
},

'header_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants'),
        _ = require('i18n'),

        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls');
    __p.push('    <div id="_main_header_cnt" class="header-cnt">\r\n\
        <h1><a class="logo" href="');
_p(urls.make_url('/index.html', {WYTAG : aid.WEBAPP_DISK_LOGO}) );
__p.push('" ');
_p(constants.IS_WRAPPED ? 'target="_blank"' : '');
__p.push('><span>');
_p(_('微云'));
__p.push('</span></a></h1>');
_p( this.face_and_menu_WEB() );
__p.push('    </div>');

return __p.join("");
},

'root_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants');
    __p.push('    <div class="ui-root">\r\n\
        <div id="_main_fixed_header" class="header-fixed">\r\n\
\r\n\
            <!-- 头部 -->\r\n\
            <div id="_main_header_banner" class="header">');
_p( this.header_WEB() );
__p.push('            </div>\r\n\
\r\n\
            <div id="_main_header_box"></div>\r\n\
\r\n\
            <!--web的导航在左侧-->');
_p( this.nav_WEB() );
__p.push('        </div>\r\n\
\r\n\
        <!-- 为实现头部静止而存在 -->\r\n\
        <div id="_main_header_placeholder" class="header-placeholder"></div>\r\n\
\r\n\
        <div id="_main_wrapper" class="wrapper">\r\n\
            <div id="_main_box">\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'face_and_menu_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        _ = require('i18n'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls'),
        main = require('./main');
    __p.push('    <!-- 头像 -->\r\n\
    <div id="_main_face" data-no-selection class="header-right" style="display:none;">\r\n\
        <span class="user-info">\r\n\
            <span class="user-avatar">\r\n\
                <img src="http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
                <i class="ui-arr"></i>\r\n\
            </span>\r\n\
        </span>\r\n\
    </div>');
_p( this.ad_link_WEB() );
__p.push('    <!-- 头像下方的菜单 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info"></div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <!--<li><a id="_main_pwd_locker" ');
_p(click_tj.make_tj_str('INDEP_PWD'));
__p.push(' href="javascript:void(0)"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>\r\n\
            <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_WEB_DISK}));
__p.push('" target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
            <li><a id="_main_feedback" href="');
_p(main.get_feedback_url());
__p.push('" target="_blank">\r\n\
                <i class="icon-fedbk"></i>反馈\r\n\
            </a></li>-->');
 if(!constants.IS_WRAPPED){ __p.push('            <li><a id="_main_logout" ');
_p(click_tj.make_tj_str('LOGIN_OUT'));
__p.push(' href="#"><i class="icon-exit"></i>');
_p(_('退出'));
__p.push('</a></li>');
 } __p.push('        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'face_and_menu_appbox_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common      = require('common'),
    aid         = common.get('./configs.aid'),
    click_tj    = common.get('./configs.click_tj'),
    urls        = common.get('./urls'),
    constants   = common.get('./constants');
    __p.push('    <!-- 头像 -->\r\n\
    <div id="_main_face" data-no-selection class="header-right" style="display:none;">\r\n\
        <span class="user-info">\r\n\
            <span class="user-avatar">\r\n\
                <span id="_main_nick_name" class="user-nickname">...</span>\r\n\
                <i class="ui-arr"></i>\r\n\
            </span>\r\n\
        </span>\r\n\
        <!-- 头像下方的菜单 -->\r\n\
        <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
            <div class="ui-pop-head">\r\n\
                <div id="_main_space_info"></div>\r\n\
            </div>\r\n\
            <ul class="ui-menu">\r\n\
                <li><a id="_main_pwd_locker" ');
_p(click_tj.make_tj_str('INDEP_PWD'));
__p.push(' href="javascript:void(0)"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>\r\n\
                <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_APPBOX}));
__p.push('" target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
                <li><a href="');
_p(urls.make_url('http://support.qq.com/write.shtml',{fid: 943, SSTAG: 'appbox_disk', WYTAG : aid.WEIYUN_APP_APPBOX}));
__p.push('" target="_blank">\r\n\
                    <i class="icon-fedbk"></i>反馈\r\n\
                </a></li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'nav_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
    _ = require('i18n'),
    click_tj = common.get('./configs.click_tj'),
    constants = common.get('./constants');
    __p.push('    <div id="_main_nav" class="ui-vnav" style="display:none;">\r\n\
        <div class="nav-uploads nav-upload-plugin-free" data-action="upload" ');
_p(click_tj.make_tj_str('UPLOAD_SELECT_FILE'));
__p.push('>\r\n\
            <span class="ui-text">');
_p(_('上传文件'));
__p.push('</span><i class="ui-bg nav-upload"></i>\r\n\
        </div>\r\n\
        <ul class="ui-nav-inner">\r\n\
            <!--\r\n\
            <li class="ui-bar">\r\n\
                <b class="ui-bd"></b>\r\n\
            </li>\r\n\
            -->\r\n\
            <li data-mod="disk" class="ui-item">\r\n\
                <a href="#" ');
_p(click_tj.make_tj_str('NAV_DISK'));
__p.push('>\r\n\
                <span class="ui-text">');
_p(_('{#path#}网盘'));
__p.push('</span>\r\n\
                <i class="ui-bg nav-all"></i>\r\n\
                </a>\r\n\
                <a data-refresh="disk" class="nav-refresh" href="#" title="');
_p(_('刷新'));
__p.push('" ');
_p(click_tj.make_tj_str('TOOLBAR_REFRESH'));
__p.push('><span>');
_p(_('刷新'));
__p.push('</span></a>\r\n\
            </li>\r\n\
\r\n\
            <li data-mod="photo" class="ui-item">\r\n\
                <a href="#" ');
_p(click_tj.make_tj_str('NAV_PHOTO'));
__p.push('>\r\n\
                <span class="ui-text">');
_p(_('相册'));
__p.push('</span>\r\n\
                <i class="ui-bg nav-pic"></i>\r\n\
                </a>\r\n\
            </li>\r\n\
\r\n\
            <li data-mod="recent" class="ui-item">\r\n\
                <a href="#" ');
_p(click_tj.make_tj_str('NAV_RECENT'));
__p.push('>\r\n\
                <span class="ui-text"></span>\r\n\
                <i class="ui-bg nav-recent"></i>\r\n\
                </a>\r\n\
                <a data-refresh="recent" class="nav-refresh" href="javascript:void(0)" title="');
_p(_('刷新'));
__p.push('" ');
_p(click_tj.make_tj_str('RECENT_REFRESH_BTN'));
__p.push('><span>');
_p(_('刷新'));
__p.push('</span></a>\r\n\
            </li>\r\n\
\r\n\
            <!--分割线-->\r\n\
            <li class="ui-bar"><b class="ui-bd"></b></li>\r\n\
\r\n\
            <li data-mod="recycle" class="ui-item">\r\n\
                <a href="#" ');
_p(click_tj.make_tj_str('NAV_RECYCLE'));
__p.push('>\r\n\
                <span class="ui-text">');
_p(_('回收站'));
__p.push('</span>\r\n\
                <i class="ui-bg nav-recycle"></i>\r\n\
                </a>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <!-- 阴影 -->\r\n\
        <b class="ui-shd"></b>\r\n\
    </div>');

return __p.join("");
},

'ad_link_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_header_ad_link" class="header-ad-text" style="display:none;"><i class="ico-notice"></i><a href="#" target="_blank"></a></div>');

}
return __p.join("");
},

'appbox_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls');
    __p.push('    <div id="_main_header_cnt" class="nav-mini">\r\n\
        <div class="nav-pos">');
_p( this.ad_link_appbox() );
__p.push('            <!--appbox的导航在顶部-->');
_p( this.nav() );
__p.push('            ');
_p( this.face_and_menu_appbox() );
__p.push('        </div>\r\n\
    </div>');

return __p.join("");
},

'web_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants'),
        _ = require('i18n'),

        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls');
    __p.push('    <div id="_main_header_cnt" class="header-cnt">\r\n\
        <h1><a class="logo" href="');
_p(urls.make_url('/index.html', {WYTAG : aid.WEIYUN_APP_WEB_LOGIN}) );
__p.push('" ');
_p(constants.IS_WRAPPED ? 'target="_blank"' : '');
__p.push('><span>');
_p(_('微云'));
__p.push('</span></a></h1>');
_p( this.face_and_menu_web() );
__p.push('    </div>');

return __p.join("");
},

'root': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        constants = common.get('./constants');
    __p.push('    <div class="ui-root">\r\n\
        <div id="_main_fixed_header" class="header-fixed">\r\n\
\r\n\
            <!-- 头部 -->\r\n\
            <div id="_main_header_banner" class="header">');
_p( constants.IS_APPBOX ? this.appbox_header() : this.web_header() );
__p.push('            </div>\r\n\
\r\n\
            <div id="_main_header_box"></div>\r\n\
\r\n\
            <!--web的导航在左侧-->');
 if (!constants.IS_APPBOX) { __p.push('                ');
_p( this.nav() );
__p.push('            ');
 } __p.push('        </div>\r\n\
\r\n\
        <!-- 为实现头部静止而存在 -->\r\n\
        <div id="_main_header_placeholder" class="header-placeholder"></div>\r\n\
\r\n\
        <div id="_main_wrapper" class="wrapper">\r\n\
            <div id="_main_box">\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'face_and_menu_web': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        _ = require('i18n'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        click_tj = common.get('./configs.click_tj'),
        urls = common.get('./urls'),
        main = require('./main');
    __p.push('    <!-- 头像 -->\r\n\
    <div id="_main_face" data-no-selection class="header-right" style="display:none;">\r\n\
        <span class="user-info">\r\n\
            <span class="user-avatar">\r\n\
                <img src="http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"/>\r\n\
                <i class="ui-arr"></i>\r\n\
            </span>\r\n\
        </span>\r\n\
    </div>');
_p( tmpl.ad_link_web() );
__p.push('    <!-- 头像下方的菜单 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info"></div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <!--<li><a id="_main_pwd_locker" ');
_p(click_tj.make_tj_str('INDEP_PWD'));
__p.push(' href="javascript:void(0)"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>\r\n\
            <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_WEB_DISK}));
__p.push('" target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
            <li><a id="_main_feedback" href="');
_p(main.get_feedback_url());
__p.push('" target="_blank">\r\n\
                <i class="icon-fedbk"></i>反馈\r\n\
            </a></li>-->');
 if(!constants.IS_WRAPPED){ __p.push('                <li><a id="_main_logout" ');
_p(click_tj.make_tj_str('LOGIN_OUT'));
__p.push(' href="#"><i class="icon-exit"></i>');
_p(_('退出'));
__p.push('</a></li>');
 } __p.push('        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'face_and_menu_appbox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common      = require('common'),
    aid         = common.get('./configs.aid'),
    click_tj    = common.get('./configs.click_tj'),
    urls        = common.get('./urls'),
    constants   = common.get('./constants');
    __p.push('    <!-- 头像 -->\r\n\
    <div id="_main_face" data-no-selection class="header-right" style="display:none;">\r\n\
        <span class="user-info">\r\n\
            <span class="user-avatar">\r\n\
                <span id="_main_nick_name" class="user-nickname">...</span>\r\n\
                <i class="ui-arr"></i>\r\n\
            </span>\r\n\
        </span>\r\n\
        <!-- 头像下方的菜单 -->\r\n\
        <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
            <div class="ui-pop-head">\r\n\
                <div id="_main_space_info"></div>\r\n\
            </div>\r\n\
            <ul class="ui-menu">\r\n\
                <li><a id="_main_pwd_locker" ');
_p(click_tj.make_tj_str('INDEP_PWD'));
__p.push(' href="javascript:void(0)"><i class="icon-pwd"></i>独立密码<span class="menu-text">（未开启）</span></a></li>\r\n\
                <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_APPBOX}));
__p.push('" target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
                <li><a href="');
_p(urls.make_url('http://support.qq.com/write.shtml',{fid: 943, SSTAG: 'appbox_disk', WYTAG : aid.WEIYUN_APP_APPBOX}));
__p.push('" target="_blank">\r\n\
                    <i class="icon-fedbk"></i>反馈\r\n\
                </a></li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'nav': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        _ = require('i18n'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants');
    __p.push('    ');
 if (constants.IS_APPBOX) { __p.push('        <ul id="_main_nav" style="display:none;" class="nav-tab clear">\r\n\
            <li data-mod="disk" class="nav-tab-item"><a href="#" ');
_p(click_tj.make_tj_str('NAV_DISK'));
__p.push('>');
_p(_('微云网盘'));
__p.push('</a></li>\r\n\
            <li data-mod="photo" class="nav-tab-item"><a href="#" ');
_p(click_tj.make_tj_str('NAV_PHOTO'));
__p.push('>');
_p(_('微云相册'));
__p.push('</a></li>\r\n\
        </ul>');
 } else { __p.push('        <div id="_main_nav" class="ui-vnav" style="display:none;">\r\n\
            <div class="nav-uploads" data-action="upload">\r\n\
                <!--span class="ui-text">');
_p(_('上传文件'));
__p.push('</span><i class="ui-bg nav-upload"></i-->\r\n\
            </div>\r\n\
\r\n\
            <ul class="ui-nav-inner">\r\n\
                <!--<li class="ui-bar">\r\n\
                    <b class="ui-bd"></b>\r\n\
                </li>-->\r\n\
                <li data-mod="disk" class="ui-item">\r\n\
                    <a href="#" ');
_p(click_tj.make_tj_str('NAV_DISK'));
__p.push('>\r\n\
                        <span class="ui-text">');
_p(_('{#path#}网盘'));
__p.push('</span>\r\n\
                        <i class="ui-bg nav-all"></i>\r\n\
                    </a>\r\n\
                    <a data-refresh="disk" class="nav-refresh" href="#" title="');
_p(_('刷新'));
__p.push('" ');
_p(click_tj.make_tj_str('TOOLBAR_REFRESH'));
__p.push('><span>');
_p(_('刷新'));
__p.push('</span></a>\r\n\
                </li>\r\n\
\r\n\
                <li data-mod="photo" class="ui-item">\r\n\
                    <a href="#" ');
_p(click_tj.make_tj_str('NAV_PHOTO'));
__p.push('>\r\n\
                        <span class="ui-text">');
_p(_('相册'));
__p.push('</span>\r\n\
                        <i class="ui-bg nav-pic"></i>\r\n\
                    </a>\r\n\
                </li>\r\n\
\r\n\
                <li data-mod="recent" class="ui-item">\r\n\
                    <a href="#" ');
_p(click_tj.make_tj_str('NAV_RECENT'));
__p.push('>\r\n\
                        <span class="ui-text">');
_p(_('最近'));
__p.push('</span>\r\n\
                        <i class="ui-bg nav-recent"></i>\r\n\
                    </a>\r\n\
                    <a data-refresh="recent" class="nav-refresh" href="javascript:void(0)" title="');
_p(_('刷新'));
__p.push('" ');
_p(click_tj.make_tj_str('RECENT_REFRESH_BTN'));
__p.push('><span>');
_p(_('刷新'));
__p.push('</span></a>\r\n\
                </li>\r\n\
\r\n\
                <!--分割线-->\r\n\
                <li class="ui-bar"><b class="ui-bd"></b></li>\r\n\
\r\n\
                <li data-mod="recycle" class="ui-item">\r\n\
                    <a href="#" ');
_p(click_tj.make_tj_str('NAV_RECYCLE'));
__p.push('>\r\n\
                        <span class="ui-text">');
_p(_('回收站'));
__p.push('</span>\r\n\
                        <i class="ui-bg nav-recycle"></i>\r\n\
                    </a>\r\n\
                </li>\r\n\
            </ul>\r\n\
            <!-- 阴影 -->\r\n\
            <b class="ui-shd"></b>\r\n\
        </div>');
 } __p.push('');

return __p.join("");
},

'ad_link_web': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_header_ad_link" class="header-ad-text" style="display:none;"><i class="ico-notice"></i><a href="#" target="_blank"></a></div>');

}
return __p.join("");
},

'ad_link_appbox': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_header_ad_link_img" style="display:none;"><a  class="header-ad" href="#"  target="_blank"><img src=""/></a></div>\r\n\
    <div id="_header_ad_link_text" class="header-ad-text" style="display:none;"><i class="ico-notice"></i><a href="#" target="_blank"></a></div>');

}
return __p.join("");
},

'space_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var _ = require('i18n'); __p.push('    <div class="ui-text quota-info">\r\n\
        <label>');
_p(_('已使用：'));
__p.push('</label>\r\n\
        <span id="_main_space_info_text">0G/0G</span>\r\n\
    </div>\r\n\
    <div class="ui-quota">\r\n\
        <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 0%;"></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
