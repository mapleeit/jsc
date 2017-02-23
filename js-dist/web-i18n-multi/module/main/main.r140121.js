//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/main/main.r140121",["lib","common","$","i18n"],function(require,exports,module){

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
//main/src/Search_box.js
//main/src/access_check.js
//main/src/ad_link.js
//main/src/install_app/install_app.js
//main/src/install_app/ui.js
//main/src/main.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
//main/src/install_app/install_app.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html

//js file list:
//main/src/Search_box.js
//main/src/access_check.js
//main/src/ad_link.js
//main/src/install_app/install_app.js
//main/src/install_app/ui.js
//main/src/main.js
//main/src/space_info/space_info.js
//main/src/space_info/ui.js
//main/src/ui.js
//main/src/user_info.js
/**
 * 页面上的搜索框
 * @author cluezhang
 * @date 2013-9-11
 */
define.pack("./Search_box",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    /**
     * 因search模块是异步加载的，使用此searcher作为缓冲
     * 它作为adapter来隐藏search模块的异步加载
     * @private
     */
    var CacheSearcher = inherit(Event, {
        busy : false,
        /**
         * 开始搜索
         * @param {String} str
         */
        search : function(str){
            if(this.searcher){
                return this.searcher.search(str);
            }
            if(!str){
                this.cancel();
                return;
            }
            this.str = str;
            if(!this.busy){
                this.busy = true;
                this.trigger('busy');
            }
            this.try_load();
        },
        /**
         * 取消搜索
         */
        cancel : function(){
            if(this.searcher){
                return this.searcher.cancel();
            }
            this.str = '';
            if(this.busy){
                this.busy = false;
                this.trigger('idle');
            }
        },
        /**
         * 尝试加载搜索模块
         * @private
         */
        try_load : function(){
            var me = this;
            if(me.loading){
                return;
            }
            require.async('search', function(o){
                me.finish_load(o.get('./search').get_ext_module());
            });
            me.loading = true;
        },
        /**
         * 当异步加载搜索模块完成时，进行对接
         * @private
         */
        finish_load : function(module){
            var me = this;
            var searcher = module.get_searcher();
            me.searcher = searcher;
            if(me.str){
                searcher.search(me.str);
            }
            searcher.on('idle', function(){
                me.trigger('idle');
            });
            searcher.on('busy', function(){
                me.trigger('busy');
            });
            module.on('deactivate', this.quit_search, this);
        },
        /**
         * 当退出搜索模块时，发出reset事件，清空搜索框
         * @private
         */
        quit_search : function(){
            this.trigger('reset');
        }
    });
    
    
    var Search_box = inherit(Event, {
        /**
         * @cfg {jQueryElement} $el
         */
        /**
         * @cfg {String} input_selector
         */
        /**
         * @cfg {Searcher} searcher
         */
        /**
         * @cfg {Number} buffer (optional) 搜索缓冲时间
         */
        buffer : 500,
        focus_class : 'focus',
        hover_class : 'hover',
        searching_class : 'searching',
        notblank_class : 'istext',
        
        last_searching_value : '',
        constructor : function(cfg){
            var me = this;
            Search_box.superclass.constructor.apply(me, arguments);
            $.extend(me, cfg);
            var $el = me.$el;
            var $input = me.$input = $el.find(me.input_selector);
            this.searcher = new CacheSearcher();
            // focus
            // 当点击其它界面时，不知道为什么没能取消选中，需要hack
            var do_blur = function(e){
                if(!$.contains($el[0], e.target)){
                    $input.blur();
                }
            };
            $input.focus(function(){
                $el.addClass(me.focus_class);
                $(document.body).on('click', do_blur);
            }).blur(function(){
                $el.removeClass(me.focus_class);
                $el.toggleClass(me.notblank_class, !!$input.val());
                $(document.body).off('click', do_blur);
            });
            // hover
            $el.hover(function(){
                $el.addClass(me.hover_class);
            }, function(){
                $el.removeClass(me.hover_class);
            });
            // focus
            $el.on('click', function(e){
                // 如果点击的不是input输入框，主动focus
                if(!$.contains($input[0], e.target)){
                    $input.focus();
                }
            });
            
            // typing
            $input.on('keydown', $.proxy(me.handle_keydown, me));
            
            // searching
            me.searcher.on('busy', function(){
                $el.addClass(me.searching_class);
            });
            me.searcher.on('idle', function(){
                $el.removeClass(me.searching_class);
            });
            
            // 点击取消
            $el.on('click', '.close', function(e){
                e.preventDefault();
                me.$input.val('');
                me.update_state();
                me.trigger_search();
                user_log('SEARCH_CANCEL');
            });
            
            // 模块切换走时清空
            me.searcher.on('reset', function(){
                me.$input.val('');
                me.update_state();
                me.clear_cache();
            });
            // IE6下，开启自动完成按F5刷新后，非常SB的将上次的值给设置进来了，导致显示有问题。
            // autocomplete="off"设置无效
            // 保险起见，IE9以下版本都这样弄
            if($.browser.msie && $.browser.version<9){
                $(window).on('load', function(){
                    $input.val('');
                });
            }
        },
        // 不必在这里处理，直接在search模块的deactive中进行search清空
//        /**
//         * 返回搜索对象，供左导航切换后调用它进行清空。
//         * @return {Searcher} searcher
//         */
//        get_searcher : function(){
//            return this.searcher;
//        },
        /**
         * 更新文本框输入状态
         * @private
         */
        update_state : function(){
            var me = this;
            setTimeout(function(){
                me.$el.toggleClass(me.notblank_class, !!me.$input.val());
            });
        },
        /**
         * 在输入框中按键的行为：
         *      普通输入触发延迟搜索（如果和上次值不同）
         *      按Enter强制搜索
         *      按Esc触发cancel
         * @private
         */
        handle_keydown : function(e){
            var code = e.keyCode || e.which;
            switch(code){
                case 13: // Enter
                    this.trigger_search(true);
                    break;
                case 27: // Esc
                    //this.cancel();
                    this.$input.val('');
                    this.trigger_search();
                    break;
                default:
                    this.trigger_search();
                    break;
            }
            this.update_state();
        },
        /**
         * 清除已搜索缓存
         * @private
         */
        clear_cache : function(){
            this.last_searching_value = null;
        },
        /**
         * 触发搜索
         * @param {Boolean} force (optional) 是否强制搜索，默认为false，即如果值没有变化就不触发。
         * @private
         */
        trigger_search : function(force){
            var me = this;
            if(force){
                me.clear_cache();
            }
            if(me.timer){
                clearTimeout(me.timer);
                me.timer = null;
            }
            me.timer = setTimeout(function(){
                me.buffer_search();
            }, me.buffer);
        },
        /**
         * buffer缓冲过后执行搜索判断
         * @private
         */
        buffer_search : function(){
            // 去除前后空格
            var value = $.trim(this.$input.val());
            if(value !== this.last_searching_value){
                this.searcher.search(value);
                this.last_searching_value = value;
            }
            this.timer = null;
        }//,
//        /**
//         * 取消搜索
//         */
//        cancel : function(){
//            this.$input.val('');
//            this.last_searching_value = '';
//            this.searcher.cancel();
//        }
    });
    return Search_box;
});/**
 * 用户登录态检查（登录态、独立密码验证状态）
 *
 * 逻辑：
 *   request 模块的请求回调包含1024错误码时，会触发
 *
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./access_check",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        constants = common.get('./constants'),

        $ = require('$'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),

        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        session_event = common.get('./global.global_event').namespace('session'),

    // 登录成功的回调
        login_callback_stack = [],

        login_to,

        heartbeat, // 心跳 timeout ID
        heartbeat_interval = 45 * 60 * 1000, // 心跳间隔时间

        global = window,

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
            query_user.on_every_ready(function () {
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

            var login_err = global.g_serv_login_rsp;
            // 直出服务已代替客户端请求过query_user，已得到返回码，可以直接弹出登录框而不需要发起请求 - james
            if (login_err) {
                if (ret_msgs.is_sess_timeout(login_err.ret)) {
                    return this._req_ptlogin_n_quser();
                } else if (ret_msgs.is_indep_invalid(login_err.ret)) {
                    return this._req_indep_login(login_err.rsp_body.nickname);
                }
            }

            // 本地发起请求
            // 先验证客户端cookie
            if (!query_user.check_cookie()) {
                // 如果客户端没有 uin/skey，则要求登录，且登录完成后要再连接 server query_user 检查一次
                this._req_ptlogin_n_quser();
            }
            // 如果客户端有 uin/skey，则连接server验证
            else {
                me._server_check(constants.IS_PHP_OUTPUT);
            }
        },

        /**
         * 要求ptlogin验证
         * @private
         */
        _req_ptlogin_n_quser: function () {
            var me = this;
            if (constants.IS_WRAPPED) { // 如果是嵌入其它网站，使用别人的登录态，就不使用自己的ptlogin了
                me.trigger('external_login', this._login_done, this);
            } else {
                require.async('qq_login', function (mod) {
                    var qq_login = mod.get('./qq_login'),
                        qq_login_ui = qq_login.ui;

                    me
                        .stopListening(qq_login)
                        .stopListening(qq_login_ui)
                        .listenTo(qq_login, 'qq_login_ok', function () {
                            this._login_done();
                        })
                        .listenToOnce(qq_login_ui, 'show', function () {
                            this.trigger('qq_login_ui_show');
                        })
                        .listenToOnce(qq_login_ui, 'hide', function () {
                            this.trigger('qq_login_ui_hide');

                            this.stopListening(qq_login_ui);
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
         * 登录成功后的回调，用于确认登录状态、记录主动登录的uin
         * @private
         */
        _login_done: function () {
            // 标记用户主动登录成功的uin
            query_user.set_last_lgoin_uin();
            this._server_check();
        },


        /**
         * 通过 query_user 验证
         *   - 验证通过后，如果用户设置了独立密码，则验证独立密码; 否则就认为成功
         * @param {boolean} [is_serv_output] 是否直出，默认false
         * @private
         */
        _server_check: function (is_serv_output) {
            if (login_to) {
                query_user.off('load').on('load', function () { // 阻止其他回调
                    return false;
                });
                query_user.check().done(this._server_check_callback);
            } else {
                // 直出版本不连接server验证
                var force_query = !is_serv_output;
                query_user.get(force_query, true, true, true).ok(this._server_check_callback);
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

        }
    };

    $.extend(access_check, events);

    return access_check;
});/**
 * 头部链接广告
 * @hibincheng 2013-06-24
 */
define.pack("./ad_link",["lib","common","$","./install_app.install_app","./main"],function(require, exports, module) {

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

        install_app = require('./install_app.install_app'),

        /**
         * 广告链接配置，后面提供一个cms来配置(已提供:ad_config.json)
         */
        link_options,
        block_uins = ['10001','711029','10321','6508431','10015','10332','542245351']; //头部广告显示 加上黑名单屏蔽 @hibincheng

    var ad_link = {

        render : function() {
            var me = this;
            if($.inArray(uin+'', block_uins) > -1 || !constants.LAN.IS_ZH) {//用户在黑名单中或者非繁体版则不显示广告
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

                    //WEB和appbox都增加入口
                    me._render_install_app({
                        'android_url': data['android_appbox_url'],
                        'iphone_url': data['iphone_url'],
                        'ipad_url': data['ipad_url']
                    });

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

            query_user.on_ready(function() {//登陆后需要替换ADTAG
                if(!constants.IS_APPBOX && web_href) {
                    $('#_header_ad_link a')
                        .attr('href', urls.make_url(web_href, {WYTAG: aid.WEIYUN_APP_WEB_DISK}));
                }
            });
        },

        _render_web : function() {
            var me = this;
            if(!closed_ad_appbox) {
                $('#_header_ad_link_'+default_link_type)
                    .show()
                    .click(function(evt) {
                        me._after_link_click(evt);//用户点击的后续操作
                    })
                    .find('a')
                    .text(link_options['web_text'])
                    .attr('href', link_options['web_href']);
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

        _render_install_app: function (data) {
            install_app.render(data);
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
            install_app.show('other');
        }

        /*
        _toggle_phone_download_dialog : function(mod_alias) {
            if(mod_alias === 'photo') {//切换到相册时,dialog要隐藏
                $('#phone_download_dialog').hide();
            }
        },
        */

        /**
         * 初始化手机广告弹框一些事件
         * @private
         *
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
        },*/

        /**
         * 手机广告弹框（appbox中才有）
         * @returns {string} html markup
         * @private
         *
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
        }*/
    };

    $.extend(ad_link, events);

    return ad_link;
});
/**
 * 安装客户端
 * @author bondli
 * @date 13-11-05
 */
define.pack("./install_app.install_app",["lib","common","$","./install_app.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        Module = common.get('./module'),

        undefined;


    var install_app = new Module('install_app', {

        ui: require('./install_app.ui'),

        render: function (data) {
            //console.log(data);
        },

        show: function(name) {
            this.ui._show_download_dialog(name);
        }

    });

    return install_app;
});/**
 * 安装客户端UI逻辑
 * @author bondli
 * @date 13-11-05
 */
define.pack("./install_app.ui",["lib","common","$","./tmpl","./ui","i18n"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        user_log = common.get('./user_log'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),

        main_ui = require('./ui'),

        _ = require('i18n').get('./pack'),
        l_key = 'main',

        undefined;

    var ui = new Module('install_app_ui', {

        tmpl_data: {},

        render: function (data) {
            this.tmpl_data = data; //将链接数据传入
            this.get_$el().appendTo(main_ui._get_$nav());
            this._init_click();
        },

        //初始化图标点击事件
        _init_click: function () {
            var me = this;
            this.get_$el().on('click', 'a[data-action]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $el = $(this),
                    app_alias = $el.attr('data-action');

                if (app_alias) {
                    me._show_download_dialog(app_alias);
                }
            });
        },

        // --- 获取一些DOM元素 ---------

        get_$el: function () {
            return this._$el || ( this._$el = $(tmpl.install_app()) );
        },

        _event_inited: false,

        is_event_init: function () {
            return this._event_inited;
        },

        //显示下载弹出层
        _show_download_dialog: function (app_os_name) {
            widgets.mask.show();
            this.get_$download_dialog().appendTo( $('body') ).show();
            ui_center.listen(this._$download_dialog);
            //初始化UI
            this._init_ui(app_os_name);
            //防止多次绑定事件
            if(!this.is_event_init()){
                //添加内部元素点击事件
                this._init_dialog_events();
                this._event_inited = true;
            }
        },

        /*_toggle_download_dialog: function (mod_alias) {
            if(mod_alias === 'photo') {//切换到相册时,dialog要隐藏
                widgets.mask.hide();
                ui_center.stop_listen(this._$download_dialog);
                this.get_$download_dialog().hide();
            }
        },*/

        _init_ui: function (app_os_name) {
            var me = this,
                down_title,
                show_msg_down = false;

            //先将所有的动态可变的dom都隐藏
            me.register_area_hide();
            me.get_$send_msg_err().hide();

            switch(app_os_name){
                case 'android':
                    down_title = _(l_key,'微云Android版');
                    show_msg_down = true;
                    break;
                case 'ipad':
                    down_title = _(l_key,'微云iPad版');
                    show_msg_down = false;
                    break;
                case 'iphone':
                    down_title = _(l_key,'微云iPhone版');
                    show_msg_down = true;
                    break;
                default:
                    down_title = _(l_key,'微云手机版');
                    show_msg_down = true;
                    break;
            }
            me.get_$down_title().html(down_title);
            if(show_msg_down) {
                me.get_$send_msg_form().show();
            }

            me.set_code_down_title(app_os_name==='ipad');

            me.get_down_file(app_os_name).show();

        },

        _init_dialog_events: function () {
            var me = this;
            this.get_$download_dialog()
                .on('click', 'del, .register_success a.button', function(){ //关闭
                    widgets.mask.hide();
                    ui_center.stop_listen(me._$download_dialog);
                    me.get_$download_dialog().hide();
                })
                .on('click', '.register_form a.button', function() { //发送短信操作
                    var _num = me.get_$send_msg_input().val(),
                        _el_error = me.get_$send_msg_err();

                    if(!(/^1[358]\d{9}$/.test(_num))){
                        _el_error.html(_(l_key,'手机号码输入有误，请重新输入。')).show();
                    }else{
                        _el_error.hide();

                        $.get('http://www.weiyun.com/php/msgsend.php', {number:_num, flag:1}, function (data){
                            if(data.ret == '0') {
                                me.get_$send_msg_form().hide();
                                me.get_$send_msg_succ().show();
                            }else if( data.ret == '6' || data.ret == '7') {
                                _el_error.html(_(l_key,'发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。')).show();
                            }else {
                                _el_error.html(_(l_key,'网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。')).show();
                            }
                        }, 'json');
                    }
                    //增加统计上报
                    if(me.get_$down_title().html() === _(l_key,'微云Android版')){
                        user_log('GUIDE_INSTALL_ANDROID_SEND_BTN');
                    }
                    else if(me.get_$down_title().html() === _(l_key,'微云iPhone版')) {
                        user_log('GUIDE_INSTALL_IPHONE_SEND_BTN');
                    }
                })
                .on('click', '.register_success a.tryagain', function() { //点击再次发送短信
                    me.get_$send_msg_form().show();
                    me.get_$send_msg_succ().hide();
                    me.get_$send_msg_err().hide();
                });

            me.get_$send_msg_input().on('keyup', function(){
                me.get_$send_msg_err().hide();
            });

            //var main = require('./main');
            //me.listenTo(main, 'activate_sub_module', me._toggle_download_dialog);
        },

        //获取下载弹出层对象
        get_$download_dialog: function () {
            return this._$download_dialog || ( this._$download_dialog = $(tmpl.install_app_box(this.tmpl_data)) );
        },

        register_area_hide: function () {
            return this.get_$download_dialog().find('.register_area div').hide();
        },

        //下载title
        get_$down_title: function () {
            return this.get_$download_dialog().find('[data-str=down_title]');
        },

        set_code_down_title: function (isIpad) {
            var s,
                text;
            if(isIpad){
                s = '二';
                text = _(l_key,'使用iPad扫描以下二维码即可安装。');
            }
            else{
                s = '三';
                text = _(l_key,'使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。');
            }
            this.get_$download_dialog().find('.get_code_area h3').text(_(l_key,'方法'+s+'：二维码获取'));
            this.get_$download_dialog().find('.get_code_area .des').text(text);
        },

        //发送短信下载表单
        get_$send_msg_form: function () {
            return this.get_$download_dialog().find('.register_form');
        },

        //发送短信成功界面
        get_$send_msg_succ: function () {
            return this.get_$download_dialog().find('.register_success');
        },

        get_$send_msg_input: function () {
            return this.get_$download_dialog().find('.register_form input.text')
        },

        //发送短信错误信息
        get_$send_msg_err: function () {
            return this.get_$download_dialog().find('.register_form p.error_des');
        },

        get_down_file: function (app_os_name) {
            return this.get_$download_dialog().find('[data-str='+app_os_name+']');
        }

    });


    return ui;
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

        user_log = common.get('./user_log'),

    // url hash 中的模块参数名
        module_hash_key,
        default_module_name,
        default_module_params,
        sub_modules_map,
        virtual_modules_map,//虚拟模块
        async_sub_modules = {},

        cur_mod_alias,  // 当前模块名
        cur_nav_mod_alias,//导航显示的模块名

        exclude_mods, // 要排除掉，不初始化的模块

        undefined;

    var main = new Module('main', {

        ui: require('./ui'),

        render: function (params) {
            params = params || {};
            // 排除的模块
            exclude_mods = params.exclude_mods || {};
        },

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
         * 配置虚拟模块
         * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        set_virtual_modules_map: function (map) {
            virtual_modules_map = map;
        },
        /**
         * 配置虚拟模块
         * @return {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        get_virtual_modules_map: function () {
            return virtual_modules_map;
        },
        /**
         * 异步载入模块
         * @param {String} _mod_alias 模块URL|模块别名
         * @param {*} [params]  传递给目标模块的参数
         */
        async_render_module: function (_mod_alias, params) {
            var mod_alias;
            this.set_cur_nav_mod_alias(_mod_alias);
            if (_mod_alias in sub_modules_map) {//直接子模块
                mod_alias = _mod_alias;
            } else if (_mod_alias in virtual_modules_map) {//映射子模块
                mod_alias = virtual_modules_map[_mod_alias].point;
            } else {//默认模块
                this.set_cur_nav_mod_alias(mod_alias = default_module_name);
            }

            cur_mod_alias = mod_alias;

            var me = this;

            // 如果已存在，则激活
            if (async_sub_modules.hasOwnProperty(mod_alias)) {

                var mod = async_sub_modules[mod_alias];
                me.activate_sub_module(mod, params);
                me.trigger('activate_sub_module', mod_alias , _mod_alias);
                if (_mod_alias in virtual_modules_map) {//来自虚拟子模块
                    virtual_modules_map[_mod_alias].after.call();
                }
            }

            // 不存在，异步加载，然后激活
            else {

                // 测速
                try {
                    m_speed.start(mod_alias, 'js_css');
                }
                catch (e) {
                }

                require.async(mod_alias, function (module_dir) {
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
                    me.trigger('activate_sub_module', mod_alias , _mod_alias);
                    if (_mod_alias in virtual_modules_map) {//来自虚拟子模块
                        virtual_modules_map[_mod_alias].after.call();
                    }
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
                    this.stopListening(async_sub_mod, 'resize', this.buffer_sync_size);
                }
            }

            this.ui.update_module_ui(cur_mod);

            cur_mod.render();
            cur_mod.activate(params);
            this.listenTo(cur_mod, 'resize', this.buffer_sync_size);
        },
        
        sync_size_timer : null,
        buffer_sync_size : function(){
            var me = this, timer = me.sync_size_timer;
            if(timer){
                clearTimeout(timer);
            }
            me.sync_size_timer = setTimeout(function(){
                me.ui.sync_size();
            }, 0);
        },

        /**
         * 获取当前激活的模块别名
         * @return {String}
         */
        get_cur_mod_alias: function () {
            return cur_mod_alias;
        },
        /**
         * 获取导航显示的模块名称
         * @returns {String}
         */
        get_cur_nav_mod_alias: function () {
            return cur_nav_mod_alias;
        },
        /**
         * 设置导航显示的模块名称
         * @param {String} mod_alias
         */
        set_cur_nav_mod_alias: function (mod_alias) {
            cur_nav_mod_alias = mod_alias;
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
         * @param {boolean} [force] 强制切换模块
         */
        switch_mod: function (mod_alias, params ,force) {
            if (mod_alias !== cur_mod_alias || force)
                routers.go($.extend({m: mod_alias}, params));
        },

        /**
         * 获取反馈的url
         * @returns {String}
         */
        get_feedback_url: function () {
            var ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
            return urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
        },

        // 加载upload
        async_render_upload: function () {
            var def = $.Deferred();
            require.async('upload', function (upload_mod) {
                var upload_route = upload_mod.get('./upload_route');
                upload_route.render();
                def.resolve(upload_route.type);
            });

            // web安装控件提示（不支持mac、safari）
            if (!constants.IS_APPBOX && constants.IS_WINDOWS) {
                setTimeout(function () {
                    query_user.on_ready(function () {
                        require.async('install_upload_plugin', function (mod) {
                            var install;
                            // 初始化控件安装模块
                            mod && (install = mod.get('./install')) && install.tips();
                        });
                    });
                }, 1000);
            }

            return def;
        },

        //appbox上报用户环境
        report_user_env: function (upload_type) {
            var me = this;
            //操作系统、QQ版本、内核类型（浏览器类型）、上传组件类型（表单、flash、控件）
            if (constants.IS_APPBOX) {
                var rpt_data = {
                    "extInt1": 0, //QQ版本 navigator.userAgent
                    "extInt2": constants.IS_WEBKIT_APPBOX ? 1 : 0, //内核类型,1:webkit,0:ie
                    "extString1": constants.OS_NAME,//操作系统
                    "extString2": upload_type //上传组件类型
                };
                if (window.external.GetVersion) { //QQ1.98及以后直接可以获取协议号，协议号查版本号：http://qqver.server.com/
                    var qq_ver = window.external.GetVersion();
                    rpt_data.extInt1 = parseInt(qq_ver, 10);
                    user_log('APPBOX_USER_ENV', 0, rpt_data);
                }
                else {
                    var state = 'no_goto_weiyun',
                        iframe = document.createElement('iframe'),
                        loadfn = function () {
                            if (state === 'had_goto_weiyun') {
                                var qq_ver = iframe.contentWindow.name;    // 读取数据
                                rpt_data.extInt1 = parseInt(qq_ver, 10);
                                user_log('APPBOX_USER_ENV', 0, rpt_data);
                                me._remove_iframe(iframe);
                            } else if (state === 'no_goto_weiyun') {
                                state = 'had_goto_weiyun';
                                iframe.contentWindow.location = "http://www.weiyun.com/set_domain.html";    // 设置的代理文件
                            }
                        };
                    iframe.src = 'http://web.weiyun.qq.com/appbox/get_version.html';
                    iframe.width = iframe.height = 0;
                    if (iframe.attachEvent) {
                        iframe.attachEvent('onload', loadfn);
                    } else {
                        iframe.onload = loadfn;
                    }
                    document.body.appendChild(iframe);
                }

            }
        },

        _remove_iframe: function (iframe) {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.close();
            document.body.removeChild(iframe);
        }

    });

    main.once('render', function () {
        if (sub_modules_map && !$.isEmptyObject(sub_modules_map)) {
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
        }

        // 启动访问控制模块
        access_check.start();

        if (!('upload' in exclude_mods)) {
            //独立加载上传模块
            var up_def = this.async_render_upload();

            var me = this;
            //上报用户环境
            setTimeout(function () {
                up_def.done(function (upload_type) {
                    me.report_user_env(upload_type);
                });
            }, 3000);
        }

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

        request = common.get('./request'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var space_info = new Module('main_space_info', {

        ui: require('./space_info.ui'),

        render: function () {
            var me = this;
            this.once('render', function () {
                query_user.on_every_ready(function (user) {
                    me._refresh_by_user(user);
                });
            });
        },

        refresh: function () {
            var me = this;
            var usr = query_user.get_cached_user();
            if (usr) {
                request.get({ cmd: 'get_timestamp', body: { local_mac: '0' } })
                    .ok(function (msg, body) {
                        me._refresh(Math.max(0, body['used_space'])||0, Math.max(0, body['total_space'])||0);
                    });
            } else {
                query_user.get(true, false, false, function (user) {
                    me._refresh_by_user(user);
                });
            }
        },

        _refresh_by_user: function (user) {
            this.trigger('load', user.get_used_space(), user.get_total_space());
        },

        _refresh: function (used, total) {
            this.trigger('load', used, total);
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

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var ui = new Module('main_space_info_ui', {

        _used_space: 0,
        _total_space: 0,

        render: function () {
            space_info = require('./space_info.space_info');

            if (constants.IS_PHP_OUTPUT) {
                this._$el = $('#_main_space_info');
            } else {
                this._$el = $(tmpl.space_info());
                $('#_main_space_info').replaceWith(this._$el);
            }

            // 文字
            this.$used_space_text = $('#_main_space_info_used_space_text');
            // 文字
            this.$total_space_$text = $('#_main_space_info_total_space_text');
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
            this.$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this.$total_space_$text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
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
define.pack("./ui",["lib","common","$","./tmpl","./Search_box","./main","./access_check","./user_info","./space_info.space_info","./ad_link"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console').namespace('main/ui'),
        routers = lib.get('./routers'),
//        cur_url = lib.get('./url_parser').get_cur_url(),

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
        Search_box = require('./Search_box'),

        $win = $(window),

        sync_size_queue = [],
        scroller,

        uiv = constants.UI_VER,
        is_visible = false,
        main, access_check,

        inited,

        undefined;

    var ui = new Module('main_ui', {

        render: function () {

            main = require('./main');
            access_check = require('./access_check');

            this._init_ui();

            this._render_user_info();

            this._init_log();

            this._render_ad_link();
        },

        _init_ui: function () {
            var me = this,
                body_class = constants.IS_APPBOX ? 'app-appbox' : 'web-app',
                $ui_root;

            if (constants.IS_PHP_OUTPUT && ($ui_root = $('#_main_ui_root')) && $ui_root[0]) {
                me._$ui_root = $ui_root;
                me._init_ui_on_user_done();
            }
            else {
                $ui_root = me._$ui_root = $(tmpl.root());
                $(document.body).addClass(body_class).append($ui_root);

                // 暂时隐藏头部，appbox 要等登录后才显示头部tab
                me._toggle_base_header(false);
                me._toggle_base_body(false);
                me.sync_size();

                // query_user 完成后才显示UI
                if (query_user.get_cached_user()) {
                    me._init_ui_on_user_done();
                } else {
                    me.listenTo(query_user, 'done', function (msg, ret) {
                        // 加载成功或返回非1024、1030的错误时，才显示UI
                        if (!ret_msgs.is_sess_timeout(ret) && !ret_msgs.is_indep_invalid(ret)) {
                            me._init_ui_on_user_done();
                        }
                    });
                    me.listenTo(query_user, 'load', function () {
                        this.stopListening(query_user, 'load done');
                        this._init_ui_on_user_done();
                    });
                }
            }

            // 同步节点高度
            me._render_resizing();

            me.listenTo(main, 'activate_sub_module', function () {
                me._hide_loading();
                me.sync_size();
            });

            me
                .listenTo(access_check, 'qq_login_ui_show', function () {
                    if (me.is_visible()) {
                        widgets.mask.show('qq_login', null, true);
                    }
                })
                .listenTo(access_check, 'qq_login_ui_hide', function () {
                    widgets.mask.hide('qq_login');
                });
        },

        _init_ui_on_user_done: function () {
            if (inited)
                return;

            is_visible = true;

            // 初始化导航
            this._render_nav();

            this._toggle_base_header(true);
            this._toggle_base_body(true);

            // 渲染搜索框
            this._render_search_box();

            // 渲染旧相册引导
            //this._render_photo_guide();

            // 更新body大小
            this.sync_size();
            inited = true;
        },

        _render_photo_guide: function () {
            var user = query_user.get_cached_user();
            if (user) {
                require.async('photo_guide', function (mod) {
                    mod.get('./photo_guide').render();
                });
            }
        },

        // 显示用户信息
        _render_user_info: function () {
            require('./user_info').render();

            this._render_space_info();
        },

        // 显示空间信息
        _render_space_info: function () {
            // 初始化web空间信息
            require('./space_info.space_info').render();
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
            this.get_$header_banner().css('display', flag ? '' : 'none');
            this.get_$bars().css('display', flag ? '' : 'none');
        },

        _toggle_base_body: function (flag) {
            //this.get_$body_box().toggle(!!flag);
            this.get_$main_content().css('display', flag ? '' : 'none');
        },

        get_$header_banner: function () {
            return $('#_main_header_banner');
        },

        get_$search_box: function () {
            return this._get_$fixed_header().find('.header-search');
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

        get_$top: function () {
            return $('#_main_top');
        },

        get_$share_head: function () {
            return $('#_main_share_header');
        },

        get_$body_box: function () {
            return $('#_main_box');
        },

        get_$main_content: function () {
            return $('#_main_content');
        },

        get_$ui_root: function () {
            return this._$ui_root;
        },

        is_visible: function () {
            return is_visible;
        },

        get_fixed_header_height: function () {
            return this._get_$fixed_header().height();
        },

        /**
         * 获取内容区域的尺寸
         */
        get_main_area_size: function () {
            var win_w = $win.width(),
                win_h = $win.height(),
                w = win_w - this._get_$nav().width(),
                h = win_h - this.get_fixed_header_height() - 2;
            return [w, h];
        },

        update_module_ui: function (cur_mod) {
            var mod_cls_name = 'module-' + cur_mod.module_name,
                root = this.get_$ui_root()[0];
            root.className = root.className.replace(/\s*module\-\w+\s*/g, ' ').replace(/\s+/, ' ') + ' ' + mod_cls_name;
        },

        _get_$fixed_header: function () {
            return this._$fixed_header || (this._$fixed_header = $('#_main_fixed_header'));
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
                        var virtual_mod = main.get_virtual_modules_map()[mod_alias];
                        if (virtual_mod) {//来自映射的模块，需要指定真正对应的的刷新操作
                            mod_alias = virtual_mod.point;
                        }
                        global_event.trigger(mod_alias + '_refresh');
                    }
                })
                .on('click', 'li[data-op]', function (e) {
                    var $el = $(this),
                        op = $el.attr('data-op');
                    user_log(op);
                });

            // 更新导航栏item的选中样式
            var current_nav = function (mod_alias) {
                //   var cur_cls = uiv === 'APPBOX' ? 'nav-current' : 'current';
                var cur_cls = 'nav-current';
                $nav.find('[data-mod]').removeClass(cur_cls).filter('[data-mod="' + mod_alias + '"]').addClass(cur_cls);
            };

            // 激活子模块时，同步更新导航栏item的选中样式
            me.listenTo(main, 'activate_sub_module', function (mod_alias, virtual_mod_alias) {
                current_nav(virtual_mod_alias || mod_alias);
            });

            // 更新导航栏item的选中样式
            var cur_mod_alias = main.get_cur_nav_mod_alias();
            if (cur_mod_alias) {
                current_nav(cur_mod_alias);
            }
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

        _render_search_box: function () {
            var $el = this.get_$search_box();
            $el.show();
            if (!this.search_box) {
                this.search_box = new Search_box({
                    $el: $el.find('.beautiful-input'),
                    input_selector: 'input'
                });
            }
        },

        /**
         * 自动同步节点高度
         * @private
         * @author james
         */
        _render_resizing: function () {
            var me = this,
                $nav = me._get_$nav();

            // 主体内容区
            var $content = me.get_$main_content();
            sync_size_queue.push({
                $el: $content,
                fn: function (win_width, win_height) {
                    var pos_top = $content.position().top,
                        margin_top = parseInt($content.css('marginTop')) || 0,
                        padding_top = parseInt($content.css('paddingTop')) || 0,
                        new_height = win_height - pos_top - margin_top - padding_top - 13;

                    $content.height(new_height);
                }
            });

            // 左侧导航栏
            if (uiv !== 'APPBOX') {  // appbox 窗口高度是固定的，不需要动态调整高度
                sync_size_queue.push({
                    $el: $nav,
                    fn: function (win_width, win_height) {
                        $nav.height(win_height - $nav.position().top - 2);
                    }
                });
            }

            // IE6最小宽度
            if ($.browser.msie && $.browser.version < 7) {
                var root_min_width = 930,
                    $root = this.get_$ui_root();
                sync_size_queue.push({
                    $el: $root,
                    fn: function (win_width) {
                        if (win_width < root_min_width) {
                            $root.width(root_min_width);
                        } else {
                            $root.css('width', '');
                        }
                    }
                });
            }

            me.sync_size();
            me.listenTo(global_event, 'window_resize_real_time', function (win_width, win_height) {
                me.sync_size(win_width, win_height);

                scroller.trigger_resized();
            });
        },

        /**
         * 同步size
         * @param {Number} [win_width]
         * @param {Number} [win_height]
         * @private
         */
        sync_size: function (win_width, win_height) {
            if (typeof win_width !== 'number') {
                win_width = $win.width();
            }
            if (typeof win_height !== 'number') {
                win_height = $win.height();
            }

            var me = this;
            for (var i = 0, l = sync_size_queue.length; i < l; i++) {
                sync_size_queue[i].fn.call(me, win_width, win_height);
            }

            var area_size = this.get_main_area_size();
            this.trigger('area_resize', area_size[0], area_size[1]);
            this.get_scroller().trigger_resized();
        },

        get_scroller: function () {
            if (!scroller) {
                var Scroller = common.get('./ui.scroller');
                scroller = new Scroller(this.get_$body_box());
            }
            return scroller;
        }
    });

    if (constants.IS_WEBKIT_APPBOX) {
        ui.once('render', function () {
            setTimeout(function () {
                require.async('download_route', function (mod) {
                    mod.get('./download_route');
                });
            }, 200);
        });
    }
    return ui;
});/**
 * 显示一些用户信息（昵称、独立密码设置状态等等）
 * @author jameszuo
 * @date 13-3-21
 */
define.pack("./user_info",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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

        undefined;


    var user_info = {

        render: function () {

            this._render_pwd_locker();

            constants.UI_VER !== 'APPBOX' && this._render_logout();

            query_user.on_ready(this._init_user, this);
        },

        _init_user: function (user) {
            // modify by cluezhang, 新的登录模块在帐号主动切换时直接刷新页面了，所以移除掉旧有的界面复用逻辑
            this._render_face(user);
            this.set_nickname(user.get_nickname());

            if (last_has_pwd !== user.has_pwd()) {
                this.set_pwd_locker(user.has_pwd());
            }
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
            var $face = $('#_main_face'),
                $face_menu = $('#_main_face_menu'),
                $face_img = $face.find('img');

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
            // 先显示默认头像
            $face.show();

            // 获取头像
            this._get_face_by_uin(user.get_uin()).done(function (url) {
                $face_img.attr('src', url);
            });
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

                user_log('INDEP_PWD');
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
                    widgets.confirm('确认', msg, '', function () {
                        page_event.trigger('confirm_unload');
                        me._logout();
                    });
                } else {
                    me._logout();
                }

                user_log('LOGIN_OUT');
            });
        },

        _logout: function () {
            query_user.destroy();
            window.location.href = 'http://www.weiyun.com/disk/index.html';  //默认都跳转到 该地址
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
//main/src/install_app/install_app.tmpl.html
//main/src/main.tmpl.html
//main/src/space_info/space_info.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'install_app': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
    var _ = require('i18n').get('./pack'),
        l_key = 'main';
    __p.push('    <div class="install-download">\r\n\
        <a class="android" href="#" title="');
_p(_(l_key,'安装android版'));
__p.push('" data-action="android" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_ANDROID'));
__p.push('><span>android</span></a>\r\n\
        <a class="iphone" href="#" title="');
_p(_(l_key,'安装iphone版'));
__p.push('" data-action="iphone" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPHONE'));
__p.push('><span>iphone</span></a>\r\n\
        <a class="ipad" href="#" title="');
_p(_(l_key,'安装ipad版'));
__p.push('" data-action="ipad" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPAD'));
__p.push('><span>ipad</span></a>\r\n\
    </div>');

}
return __p.join("");
},

'install_app_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants');

    var url_suffix = (constants.IS_APPBOX) ? 'appbox' : 'web';

    var _ = require('i18n').get('./pack'),
        l_key = 'main';
    __p.push('\r\n\
    <div class="get_app_layer" id="phone_download_dialog" data-no-selection style="display:none;">\r\n\
        <del></del>\r\n\
        <h2 data-str="down_title">');
_p(_(l_key,'微云手机版'));
__p.push('</h2>\r\n\
        <div class="get_url_area">\r\n\
            <div class="register_area">\r\n\
                <!-- iphone，android短信下载 -->\r\n\
                <div class="register_form" style="display: none;">\r\n\
                    <h3>');
_p(_(l_key,'方法一：短信获取下载地址'));
__p.push('</h3>\r\n\
                    <p class="des">');
_p(_(l_key,'请填写手机号，下载地址将发送到您的手机上。'));
__p.push('</p>\r\n\
                    <input class="text" type="tel" placeholder="');
_p(_(l_key,'请输入手机号码'));
__p.push('">\r\n\
                    <a class="button" href="javascript:void(0)">');
_p(_(l_key,'发送短信'));
__p.push('</a>\r\n\
                    <p class="error_des" style="display: none;">');
_p(_(l_key,'您输入的电话号码有误，请重新输入。'));
__p.push('</p>\r\n\
                </div>\r\n\
                <!-- iphone，android短信下载 -->\r\n\
                <div class="register_success" style="display: none;">\r\n\
                    <h3>');
_p(_(l_key,'方法一：短信获取下载地址'));
__p.push('</h3>\r\n\
                    <p class="des">');
_p(_(l_key,'您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。'));
__p.push('</p>\r\n\
                    <a class="button" href="javascript:void(0)">');
_p(_(l_key,'完成'));
__p.push('</a>\r\n\
                    &nbsp;&nbsp;&nbsp;&nbsp;<a class="tryagain" href="javascript:void(0)">');
_p(_(l_key,'再次发送短信'));
__p.push('</a><p></p>\r\n\
                </div>\r\n\
                <!-- android安装包 -->\r\n\
                <div data-str="android" class="get_apk" style="display:none">\r\n\
                    <h3>');
_p(_(l_key,'方法二：下载安装包'));
__p.push('</h3>\r\n\
                    <p class="des">\r\n\
                        <a data-str="down_name" target="_blank" href="');
_p(data.android_url);
__p.push('" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_ANDROID_CLICK_DOWN'));
__p.push('>');
_p(_(l_key,'点击开始下载'));
__p.push('</a>\r\n\
                    </p>\r\n\
                </div>\r\n\
                <!-- iphone安装包 -->\r\n\
                <div data-str="iphone" class="get_apk" style="display:none">\r\n\
                    <h3>');
_p(_(l_key,'方法二：前往App Store下载'));
__p.push('</h3>\r\n\
                    <p class="des">\r\n\
                        <a data-str="down_name" target="_blank" href="');
_p(data.iphone_url);
__p.push('" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPHONE_CLICK_DOWN'));
__p.push('>');
_p(_(l_key,'点击开始下载'));
__p.push('</a>\r\n\
                    </p>\r\n\
                </div>\r\n\
                <!-- ipad安装包 -->\r\n\
                <div data-str="ipad" class="get_apk" style="display:none">\r\n\
                    <h3>');
_p(_(l_key,'方法一：前往App Store下载'));
__p.push('</h3>\r\n\
                    <p class="des">\r\n\
                        <a data-str="down_name" target="_blank" href="');
_p(data.ipad_url);
__p.push('" ');
_p(click_tj.make_tj_str('GUIDE_INSTALL_IPAD_CLICK_DOWN'));
__p.push('>');
_p(_(l_key,'点击开始下载'));
__p.push('</a>\r\n\
                    </p>\r\n\
                </div>\r\n\
                <!-- 安装包 -->\r\n\
                <div data-str="other" class="get_apk" style="display:none">\r\n\
                    <h3>');
_p(_(l_key,'方法二：下载安装包'));
__p.push('</h3>\r\n\
                    <p class="des other">\r\n\
                        <a target="_blank" href="');
_p(data.android_url);
__p.push('">');
_p(_(l_key,'android版'));
__p.push('</a>\r\n\
                        <a target="_blank" href="');
_p(data.iphone_url);
__p.push('">');
_p(_(l_key,'iPhone版'));
__p.push('</a>\r\n\
                    </p>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <!-- 二维码下载 -->\r\n\
        <div class="get_code_area">\r\n\
            <h3>');
_p(_(l_key,'方法三：二维码获取'));
__p.push('</h3>\r\n\
            <p class="des">');
_p(_(l_key,'使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。'));
__p.push('</p>\r\n\
            <img src="http://imgcache.qq.com/vipstyle/nr/box/portal/demoImg/weiyunQR_app_');
_p(url_suffix);
__p.push('.png">\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'root': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
    constants = common.get('./constants'),
    aid = common.get('./configs.aid'),
    urls = common.get('./urls');
    __p.push('    <div class="layout">\r\n\
        <div id="_main_fixed_header" class="lay-header clear">\r\n\
            <a class="logo" href="');
_p( urls.make_url('http://www.weiyun.com', { WYTAG: aid.APPBOX_DISK_LOGO }) );
__p.push('" target="_blank"></a>');
_p( this['ad']() );
__p.push('            ');
_p( this['user']() );
__p.push('            ');
_p( this['face_menu']() );
__p.push('            ');
_p( this['search']() );
__p.push('        </div>');
_p( this['nav']() );
__p.push('        ');
_p( this['top']() );
__p.push('        ');
_p( this['bar1']() );
__p.push('        ');
_p( this['bar2']() );
__p.push('        ');
_p( this['share_header']() );
__p.push('        ');
_p( this['recycle_header']() );
__p.push('        <div id="_main_special_header"></div>\r\n\
        <div id="_main_content" class="lay-main-con">\r\n\
            <div class="inner">\r\n\
                <div id="_main_box" class="wrap">');
/*各模块的主体放这里*/__p.push('                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'top': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_top" class="lay-share-top" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'share_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_share_header" class="lay-share-head" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'recycle_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_rec_file_header" class="lay-recycle-head" style="display:none">');
/*各模块的顶部放这里*/__p.push('    </div>');

return __p.join("");
},

'bar1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_bar1" class="lay-main-toolbar" style="display:none;">');
/*各模块的工具栏放这里*/__p.push('    </div>');

return __p.join("");
},

'bar2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_bar2" class="lay-main-head" style="display:none;">');
/*各模块的路径（之类）放这里*/__p.push('    </div>');

return __p.join("");
},

'face_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
    constants = common.get('./constants'),
    aid = common.get('./configs.aid'),
    click_tj = common.get('./configs.click_tj'),
    urls = common.get('./urls'),
    main = require('./main'),
    _ = require('i18n').get('./pack'),
    l_key = 'main';
    __p.push('\r\n\
    <!-- 头像下方的菜单 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user" style="display:none;">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info"></div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <li><a id="_main_pwd_locker" href="javascript:void(0)"><i class="icon-pwd"></i>');
_p(_(l_key,'独立密码'));
__p.push('<span class="menu-text">');
_p(_(l_key,'（未开启）'));
__p.push('</span></a></li>\r\n\
            <li><a id="_main_client_down" href="');
_p(urls.make_url('http://www.weiyun.com/download.html',{WYTAG:aid.WEIYUN_APP_WEB_DISK}));
__p.push('" target="_blank">\r\n\
                <i class="icon-dwn"></i>');
_p(_(l_key,'下载客户端'));
__p.push('</a></li>\r\n\
            <li><a id="_main_feedback" href="');
_p(main.get_feedback_url());
__p.push('" target="_blank"><i class="icon-fedbk"></i>');
_p(_(l_key,'反馈'));
__p.push('</a></li>');

              if(!constants.IS_APPBOX){
            __p.push('                 <li><a id="_main_logout" href="#"><i class="icon-exit"></i>');
_p(_(l_key,'退出'));
__p.push('</a></li>');

              }
            __p.push('        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'search': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'main';
    __p.push('    <div class="header-search" style="display:none;">\r\n\
        <div class="beautiful-input">\r\n\
            <i class="ico"></i>\r\n\
            <label>');
_p(_(l_key,'搜索全部文件'));
__p.push('</label>\r\n\
            <input type="text" autocomplete="off" maxlength="40">\r\n\
            <a class="close" href="#"></a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'nav': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
    click_tj = common.get('./configs.click_tj'),
    constants = common.get('./constants');
    __p.push('\r\n\
    <div id="_main_nav" style="display:none;" class="lay-aside">');
_p( this['upload_btn']() );
__p.push('\r\n\
        <ul class="nav-box">');

            var m = [
                { mod: 'disk', name: '目录', cls: 'all', tj_key: 'NAV_DISK', refresh: false },
                { mod: 'recent', name: '最近', cls: 'recent', tj_key: 'NAV_RECENT', refresh: true },
                '-',
                { mod: 'doc', name: '文档', cls: 'doc', tj_key: 'NAV_DOC', refresh: false },
                { mod: 'album', name: '图片', cls: 'pic', tj_key: 'NAV_ALBUM', refresh: false },
                { mod: 'audio', name: '音乐', cls: 'voice', tj_key: 'NAV_AUDIO', refresh: false },
                { mod: 'video', name: '视频', cls: 'video', tj_key: 'NAV_VIDEO', refresh: false },
                '-',
                { mod: 'offline', name: 'QQ离线文件', cls: 'offline', tj_key: 'NAV_OFFLINE', refresh: false },
                '-',
                {mod: 'share',name: '分享的链接', cls: 'share', tj_key: 'NAV_SHARE',refresh: false},
                { mod: 'recycle', name: '回收站', cls: 'recycle', tj_key: 'NAV_RECYCLE', refresh: false }
            ]
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
 } __p.push('            </li>');

            }
            }
            __p.push('        </ul>\r\n\
        <b class="aside-beautiful"></b>\r\n\
    </div>');

return __p.join("");
},

'old_nav_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var common = require('common'),
    click_tj = common.get('./configs.click_tj'),
    constants = common.get('./constants'),
    query_user = common.get('./query_user');
    __p.push('    <ul class="nav-box">');

        var m = [
            { mod: 'disk', name: '网盘', cls: 'old-disk', tj_key: 'NAV_DISK', refresh: false },
            { mod: 'photo', name: '相册', cls: 'old-pic', tj_key: 'NAV_PHOTO', refresh: false },
            { mod: 'recent', name: '最近', cls: 'recent', tj_key: 'NAV_RECENT', refresh: true },
            '-',
            {mod: 'share',name: '分享的链接', cls: 'share', tj_key: 'NAV_SHARE',refresh: false},
            { mod: 'recycle', name: '回收站', cls: 'recycle', tj_key: 'NAV_RECYCLE', refresh: false }
        ]

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
 } __p.push('        </li>');

        }
        }
        __p.push('    </ul>');

}
return __p.join("");
},

'user': function(data){

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

'upload_btn': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-action="upload" class="upload-btn">\r\n\
    </div>');

}
return __p.join("");
},

'ad': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var common = require('common'),
    constants = common.get('./constants');

    __p.push('    <div id="_header_ad_link_img" style="display:none;"><a  class="header-ad" href="#"  target="_blank"><img/></a></div>\r\n\
    <div id="_header_ad_link_text" class="ad" style="display:none;">\r\n\
        <i class="ico"></i>\r\n\
        <a class="txt" href="#" target="_blank" hidefocus="on">');
/*手机版每日签到，免费容量最高可达100G，点击下载&gt;&gt;*/__p.push('</a>\r\n\
    </div>');

}
return __p.join("");
},

'ad_link': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_header_ad_link" class="header-ad-text" style="display:none;"><i class="ico-notice"></i><a href="#" target="_blank"></a></div>');

}
return __p.join("");
},

'space_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'main';
    __p.push('    <div class="ui-text quota-info">\r\n\
        <label>');
_p(_(l_key,'已使用'));
__p.push('：</label>\r\n\
        <span id="_main_space_info_used_space_text">0G</span>\r\n\
    </div>\r\n\
    <div class="ui-text quota-info">\r\n\
        <label>');
_p(_(l_key,'总容量'));
__p.push('：</label>\r\n\
        <span id="_main_space_info_total_space_text">0G</span>\r\n\
    </div>\r\n\
    <div class="ui-quota">\r\n\
        <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 0%;"></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
