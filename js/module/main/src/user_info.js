/**
 * 显示一些用户信息（昵称、独立密码设置状态等等）
 * @author jameszuo
 * @date 13-3-21
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        page_event = common.get('./global.global_event').namespace('page'),
        urls = common.get('./urls'),
        aid = common.get('./configs.aid'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        Pop_panel = common.get('./ui.pop_panel'),
        https_tool = common.get('./util.https_tool'),

        win = window,

        last_has_pwd,

        undefined;


    var user_info = {

        render: function () {

            this._render_pwd_locker();

            if(!constants.IS_APPBOX && !constants.IS_QZONE){
                this._render_logout();
            }

            query_user.on_ready(this._init_user, this);
        },

        _init_user: function (user) {
            // modify by cluezhang, 新的登录模块在帐号主动切换时直接刷新页面了，所以移除掉旧有的界面复用逻辑
            this._render_face(user);
            this._render_https_config();
            this.set_nickname(user.get_nickname());
            this._render_qzone_vip(user);

            if(!user.is_weixin_user()) {
                if (last_has_pwd !== user.has_pwd()) {
                    this.set_pwd_locker(user.has_pwd());
                }
            } else {
                $('#_main_pwd_locker').hide();
            }
            this._render_feedback();
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

            $face_img.attr('src', https_tool.translate_url(user.get_avatar()));
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

        _render_https_config: function() {
            require('./https_config').render();
        },

        _render_qzone_vip: function(user) {
            var weiyun_vip_info = user.get_weiyun_vip_info(),
                weiyun_vip_img_url = weiyun_vip_info.weiyun_vip_img_url?  weiyun_vip_info.weiyun_vip_img_url.slice(5) : '//img.weiyun.com/vipstyle/nr/box/img/logo_vip_s.png';

            var $vip_icon = $('#_main_face [data-id=qzone_vip]'),
                $renew_btn = $('#_main_renew_qzonevip'),
                url = https_tool.translate_url(weiyun_vip_img_url);
            if(user.is_weiyun_vip()) {
                $vip_icon.css('backgroundImage', 'url('+url+')').show();
                $renew_btn.text('续费会员');
            } else {
                $renew_btn.text('开通会员');
            }
            $renew_btn.on('click', function(e) {
                user_log('RECHARGE_QZONE_VIP');
                var is_weixin_user = user.is_weixin_user && user.is_weixin_user(),
                    from = is_weixin_user? 1025 : 1015;
                window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
            });
        },

        _render_feedback: function() {
            var me = this,
                ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
            //var url = urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
            $('#_main_feedback').on('click', function(e) {
                e.preventDefault();
                document.domain = 'weiyun.com';
                var $iframe = $('<iframe frameborder="0" src="about:blank" data-name="iframe"></iframe>');
                $iframe.css({
                    'zIndex': '1000',
                    'width' : '100%',
                    'height': '488px'
                }).attr('src', constants.HTTP_PROTOCOL + '//www.weiyun.com/feedback.html?web');

                me.$ct = $('<div data-no-selection class="full-pop" style="z-index: 1000; position: fixed; left: 50%; top: 50%"></div>');
                me.$ct.css({
                    "width": "478px",
                    "height": "490px",
                    "margin-left": "-239px",
                    "margin-top":  "-245px"
                });
                me.$ct.appendTo(document.body);
                $iframe.appendTo(me.$ct);

                me.add_full_mask();
                me._bind_feedback_events();
                me.$ct.show();
            });
        },

        add_full_mask: function() {
            this.$mask = $('<div class="full-mask"></div>').appendTo(document.body);
        },

        _bind_feedback_events: function() {
            var me = this;
            var onmessage = function(e) {
                var data = e.data;
                //IE8、9只接收字符串，需要转换下
                if(($.browser.msie && $.browser.version <= 9)) {
                    data = JSON.parse(data);
                }
                //IE7以下有问题，直接关闭弹窗
                if(data.action === 'close' || ($.browser.msie && $.browser.version <= 7)) {
                    me.$ct && me.$ct.remove();
                    me.$ct = null;

                    me.$mask && me.$mask.remove();
                    me.$mask = null;
                } else if(data.action === 'send_succeed') {
                    me.$ct.find('iframe').css('height', '198px');
                    me.$ct.css({
                        "width": "399px",
                        "height": "202px",
                        "margin-left": "-200px",
                        "margin-top":  "-101px"
                    });
                }
            }
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('message', onmessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onmessage', onmessage);
            }
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
            //@ptlogin, start
            //query_user.destroy();
            //window.location.href = 'http://www.weiyun.com';
            if(typeof pt_logout !== 'undefined') {
                 pt_logout.logoutQQCom(function() {
                     query_user.destroy();
                     window.location.href = 'http://www.weiyun.com';  //默认都跳转到 该地址
                 });
            } else {
                 require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                     pt_logout.logoutQQCom(function() {
                         query_user.destroy();
                         window.location.href = 'http://www.weiyun.com';  //默认都跳转到 该地址
                     });
                 });
            }
	        //@ptlogin, end
        },
        _get_$locker: function () {
            return $('#_main_pwd_locker');
        },

        _get_face_by_uin: function (uin) {
            var def = $.Deferred();

            /*初始化 头像信息*/
            $.ajax({
                url: urls.make_url('https://ssl.ptlogin2.weiyun.com/getface', {
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