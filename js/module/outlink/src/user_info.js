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
        outlink=require('./outlink'),
        request = common.get('./request'),
        win = window,
        outlink_appid=30111,
        undefined;


    var user_info = {

        render: function () {
            var me=this;
            me.listenTo(outlink,'show_user_tips',function(){
                    me.show_User_tips();
            });
            require('./space_info.space_info').render();
            if(query_user.check_cookie()){
                me.show_User_tips();
            }
        },

        show_User_tips:function(){
            var me=this;
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskUserInfoGet',
                cavil: false,
                pb_v2: true,
                header: {appid: outlink_appid},
                body: {
                    show_migrate_favorites: true,
                    show_qqdisk_migrate: true
                }
            }).done(function (msg, ret,body,header) {
                    if(ret==0){
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
                        me.trigger('load',body.used_space,body.total_space)
                    }else if(ret==1031){   //设置了独立密码的用户
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
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
            var $face = $('#header-user'),
                $face_menu = $('#_main_face_menu'),
                $face_img = $face.find('img');
            new Pop_panel({
                host_$dom: $face,
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
            // 获取头像
            this._get_face_by_uin(uin).done(function (url) {
                $face_img.attr('src', url);
            });
        },

        _render_logout: function () {
            var me = this;

            // 退出按钮
            $('#outlink_login_out').on('click', function (e) {
                e.preventDefault();
                me._logout();
            });
        },

        _logout: function () {
            query_user.destroy();
            $('#outlink_login').show();
            $('#header-user').hide();
            $('#_main_face_menu').hide();

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