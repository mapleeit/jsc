/**
 * 显示一些用户信息（昵称等）
 * @author yuyanghe
 * @date 13-9-17
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        cookie = lib.get('./cookie'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        Pop_panel = common.get('./ui.pop_panel'),
        session_event = common('./global.global_event').namespace('session'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        login = require('./login'),
        tmpl = require('./tmpl'),

        win = window,
        outlink_appid=30111,
        undefined;


    var user_info = {

        render: function () {
            var me=this;

            me.show_user_info();
            $('#outlink_login').on('click', function(e) {
                session_event.trigger('session_timeout');
            });

            this.listenTo(login, 'login_done', this.show_user_info);

            this._render_logo();
        },

        show_user_info: function(){
            var me=this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskUserInfoGet',
                cavil: false,
                pb_v2: true,
                header: {appid: outlink_appid},
                body: {
                    show_migrate_favorites: true,
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true
                }
            }).done(function (msg, ret,body,header) {
                    if(ret==0){
                        query_user._set_user_from_cgi_rsp(header, body);
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
                        me._render_feedback();
                        me.trigger('load',body.used_space,body.total_space)
                    }else if(ret==1031){   //设置了独立密码的用户
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
                        me._render_feedback();
                        //获取用户空间信息
                        request.xhr_get({
                            cmd: 'get_timestamp',
                            header: {source:outlink_appid,appid: outlink_appid},
                            body: {
                            //    local_timestam:	"1", 	// 上次获取的系统时间戳，字符串（格式：64位整型）
                                local_mac:"0"				// 设备本地mac，当后面各项有上报时，此字段为必填，字符串
                            }
                        }).ok(function (msg, body) {
                                me.trigger("load",body.used_space,body.total_space);
                            })
                    }
            });
        },

        /**
         * 更新昵称
         * @param nickname
         */

        set_nickname: function (nickname) {
            var _nickname =   nickname;
            if ($.browser.msie && $.browser.version < 7) {
                _nickname = text.smart_sub(7);
            }
            $('#_main_nick_name').text(_nickname);

        },

        /**
         * 头像、头像的菜单
         * @param uin
         */

        _render_face: function (uin) {
            this.$user_info =this.$user_info || $(tmpl.user_info()).appendTo('#outlink_header');

            require('./header.space_info').render();

            var $face = $('#header-user'),
                $face_menu = $('#_main_face_menu'),
                $face_img = this.$user_info.find('img');

            new Pop_panel({
                host_$dom: this.$user_info,
                $dom: $face_menu,
                show: function () {
                    $face_menu.show();
                    $face.addClass('hover');

                },
                hide: function () {
                    $face_menu.hide();
                    $face.removeClass('hover');
                },
                delay_time: 300
            });

            //先显示默认头像
            $face.show();
            //隐藏登录按钮
            $('#outlink_login').hide();

            var cur_user = query_user.get_cached_user();
	        var avatar = cur_user.get_avatar();
	        if(avatar) {
		        $face_img.attr('src', cur_user.get_avatar().replace(/^http:|^https:/, ''));
	        } else {
		        // 获取头像
		        this._get_face_by_uin(uin).done(function (url) {
			        $face_img.attr('src', url.replace(/^http:|^https:/, ''));
		        });
	        }
        },

        _render_logout: function () {
            var me = this;

            // 退出按钮
            $('#outlink_login_out').on('click', function (e) {
                e.preventDefault();
                me._logout();
            });
        },

        _render_logo: function() {
            $('#outlink_header').on('click', '.logo', function() {
                if(query_user.check_cookie()) {
                    window.open(window.location.protocol + '//www.weiyun.com/disk/index.html');
                } else {
                    window.open(window.location.protocol + 'http://www.weiyun.com');
                }
            })
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
                }).attr('src', 'http://www.weiyun.com/feedback.html?web');

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
                if(data.action === 'close') {
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

        _logout: function () {
            if(typeof pt_logout !== 'undefined') {
                pt_logout.logoutQQCom(function() {
                    query_user.destroy();
                    location.reload();
                });
            } else {
                require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                    pt_logout.logoutQQCom(function() {
                        query_user.destroy();
                        location.reload();
                    });
                });
            }
            /*$('#outlink_login').show();
            this.$user_info.remove();
            this.$user_info = null;*/
        },

        _get_face_by_uin: function (uin) {
            var def = $.Deferred();
            /*初始化 头像信息*/
            $.ajax({
                url: urls.make_url(window.location.protocol + '//ptlogin2.weiyun.com/getface', {
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