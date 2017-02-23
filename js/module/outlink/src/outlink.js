/**
 * 外链页面
 * User: yuyanghe
 * Date: 13-9-17
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        qq_login_mod = null,
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        cookie = lib.get('./cookie'),
        text = lib.get('./text'),
        mini_tip = common.get('./ui.mini_tip'),
        util = require('./util'),
        log = require('./log'),
        local_msg = require('./msg'),
        share_info = null,
        outlink_appid = 30111,

        progress = common.get('./ui.progress'),

        undefined;


    var outlink = new Module('outlink', {

        ui: require('./ui'),
        qq_login: null,
        qq_login_ui: null,
        is_store: 0,
        share_key: '',
        share_pwd: '',
        /**
         * PC端入口
         * @param share_key
         */
        render: function (share_key) {
            var me = this;
            me.share_key = share_key;
            this.get_share_info();
            me._init_login_mod();

        },
        /**
         * PC端风险界面入口
         */
        render_risk: function () {
            var me = this;
            me._init_login_mod();
            me.share_key = util.get_share_key();
            me.share_pwd = util.get_share_pwd();
            this.get_share_info_pwd(me.share_pwd, null, function (_share_info) {
                me.ui.render_outlink_risk(_share_info);
            });

        },
        /**
         * 获取分享信息
         */
        get_share_info: function () {
            var me = this;

            var tp = setTimeout(function () {
                progress.show('正在加载数据...');
            }, 1000);

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareView',
                pb_v2: true,
                header: {appid: outlink_appid},
                body: {
                    os_info: constants.OS_NAME,
                    browser: constants.BROWSER_NAME,
                    share_key: me.share_key
                }
            }).ok(function (msg, body) {
                    clearTimeout(tp);
                    progress.hide();
                    share_info = body;
                    share_info.data = me.share_key;
                    share_info.file_list = share_info.file_list || [];
                    share_info.dir_list = share_info.dir_list || [];
                    me.ui.render_outlink_content(share_info);
                }).fail(function (msg, ret) {
                    clearTimeout(tp);
                    progress.hide();
                    //me.ui.render_outlink_content(share_info);
                    me.ui._render_outlink_content_fail(msg, ret);
                    //me.ui.set_fail_msg(msg,ret);
                });
            //71表数据上报
            log('visit');
        },
        /**
         * 获取加密后的分享信息
         * @param pwd     密码
         * @param verify_code     验证码
         * @param callback 回调函数
         */
        get_share_info_pwd: function (pwd, verify_code, callback) {
            var me = this,
                req_body = {
                    os_info: constants.OS_NAME,
                    browser: constants.BROWSER_NAME,
                    share_key: me.share_key,
                    share_pwd: pwd
                };

            if (verify_code) {//有验证码需要加上
                req_body.verify_code = verify_code;
            }

            me._last_request = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareView',
                pb_v2: true,
                header: {appid: outlink_appid},
                body: req_body
            }).ok(function (msg, body) {
                    //记录正确的密码
                    me.share_pwd = pwd;
                    share_info = body;
                    share_info.data = body.share_key;
                    if (callback) {
                        callback.call(me, share_info);
                    } else {
                        me.ui.render_outlink_pwd_ok(share_info);
                    }

                }).fail(function (msg, ret) {
                    if (ret == 114303 && !callback) {      //114303  代表密码错误
                        if (me.ui.is_need_verify_code()) {  //需要验证码时，错误后需要刷新下验证码至最新
                            me.ui.change_verify_code();
                        }
                        me.ui.set_pwd_err_text('密码错误');
                    } else if (ret == 114304 && !callback) { // 输入错误次数频率过高，需要输入验证码
                        me.ui.show_verify_code();
                        me.ui.set_pwd_err_text('密码错误次数过多，请输入验证码');
                    } else if (ret == 114305 && !callback) { //验证码错误
                        me.ui.change_verify_code();
                        me.ui.set_verify_err_text('验证码错误');
                    } else {
                        if (me.ui.is_need_verify_code()) {
                            me.ui.change_verify_code();
                        }
                        me.ui.set_pwd_err_text(msg);
                    }
                });
        },

        /**
         * 设置放盗链的cookie
         */
        set_download_cookie: function (value) {
            cookie.set('dlskey', value, {
                domain: 'weiyun.com',
                path: '/',
                expires: 1440 //一天
            });
        },

        /**
         * 获得文件的下载地址
         * @returns {*|String|XML|void}
         */
        getDownloadURL: function () {
            var me = this;
            var tpl_url = "http://web.cgi.weiyun.com/share_dl.fcg";
            var _files = '',
                _is_singlefile = true,
                _dirs = '';
            if (share_info.file_list.length > 0) {
                _files = share_info.file_list[0].file_id || '';
                for (var i = 1; i < share_info.file_list.length; i++) {
                    _files += ',' + share_info.file_list[i].file_id
                }
            }
            if (share_info.dir_list.length > 0) {
                _dirs = share_info.dir_list[0].dir_key || '';
                for (var i = 1; i < share_info.dir_list.length; i++) {
                    _dirs += ',' + share_info.dir_list[i].dir_key;
                }
            }
            //判断是否是多个文件
            if (share_info.file_list.length > 1 || share_info.dir_list.length > 0) {
                _is_singlefile = false;
            }

            var share_name = share_info.share_name;
            if ($.browser.msie && $.browser.version < 9 && _is_singlefile) {   //IE9以下版本　防止xss攻击　给非常见文件,默认加上.TXT后缀!
                if (util.xsschecktype(share_name)) {
                    share_name += '.txt';
                }
            }
            //更新下载次数
            me._update_downcnt();
            //71表数据上报
            log('download');

            var params = {
                sharekey: me.share_key,
                uin: share_info.uin,
                skey: me._getSkey(),
                fid: _files,
                dir: _dirs,
                pdir: share_info.pdir_key,
                zn: share_name,
                os_info: common.get('./util.os').name,
                browser: common.get('./util.browser').name,
                ver: me._getDownloadTjVersion()
            };
            return urls.make_url(tpl_url, params);
        },

        /**
         * 获得文件的下载参数
         * @returns {*|String|XML|void}
         */
        getDownloadParam: function () {
            var me = this,
                _files = '',
                _dirs = '';

            if (share_info.file_list.length > 0) {
                _files = share_info.file_list[0].file_id || '';
                for (var i = 1; i < share_info.file_list.length; i++) {
                    _files += ',' + share_info.file_list[i].file_id
                }
            }
            if (share_info.dir_list.length > 0) {
                _dirs = share_info.dir_list[0].dir_key || '';
                for (var i = 1; i < share_info.dir_list.length; i++) {
                    _dirs += ',' + share_info.dir_list[i].dir_key;
                }
            }

            var params = {
                sharekey: me.share_key,
                uin: share_info.uin,
                skey: me._getSkey(),
                fid: _files,
                dir: _dirs,
                pdir: share_info.pdir_key,
                zn: share_info.share_name,
                os_info: common.get('./util.os').name,
                browser: common.get('./util.browser').name,
                ver: me._getDownloadTjVersion()
            };

            return params;
        },

        get_$down_iframe: function () {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },

        get_$down_form: function () {
            return this._$down_form || (this._$down_form = $('<form method="POST" enctype="application/x-www-form-urlencoded"></form>').appendTo(document.body));
        },

        //单文件下载也用post方式
        download_file: function () {
            var me = this;
            //更新下载次数
            me._update_downcnt();
            //71表数据上报
            log('download');

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareDownload',
                pb_v2: true,
                header: {appid: outlink_appid},
                body: {
                    share_key: share_info.share_key,
                    pack_name: share_info.share_name,
                    pwd: share_info.pwd || '',
                    os_info: common.OS_NAME,
                    browser: common.BROWSER_NAME
                }
            }).ok(function(msg, body) {
                me.get_$down_iframe().attr('src', body.download_url);
            }).fail(function(msg, ret) {
                //目录验证码逻辑是无效的，已由频率控制
                /*if (ret == 130010) {
                    //弹出验证码
                    me.ui.show_down_verifycode();
                }
                else if (ret == 13009) {
                    //验证码出错
                    me.ui.show_down_verifycode_error();
                } else*/
                if(ret ==190051 || ret == 190011){
                    me.is_download=1;
                    me.to_login();
                } else if(ret == 20002 || ret == 20003) { //外链已过期，直接刷新页面
                    window.location.href = window.location.href;
                } else { // if(ret == 13007 || ret == 13008){
                    //系统错误
                    me.ui.download_fail(msg, ret);
                }
            });
        },

        //下载失败的处理
        down_fail_callback: function (ret, msg) {
            var me = this;
            //alert('根据错误码，弹出验证码框：'+ret);
            if (ret == 130010) {
                //弹出验证码
                me.ui.show_down_verifycode();
            }
            else if (ret == 13009) {
                //验证码出错
                me.ui.show_down_verifycode_error();
            } else if(ret == 20002 || ret == 20003) { //外链已过期，直接刷新页面
                window.location.href = window.location.href;
            } else { // if(ret == 13007 || ret == 13008){
                //系统错误
                me.ui.download_fail(msg, ret);
            }
        },

        down_file_by_verifycode: function (code) {
            var me = this;
            //把验证码追加到下载的url上，然后提交给下载cgi
            //根据cgi的返回执行下载或者提示验证码错误
            me.download_file(code);
        },

        /**
         * 获取预览图
         */
        getPreviewImg: function () {
            var me = this;
            var url = share_info.thumb_url + (share_info.share_name.slice(-3) === 'gif' ? '' : '&size=640*640');
            me.ui.showPreviewImg(url); //先给个默认的
        },


        /**
         * 批量转存
         * @returns {*|String|XML|void}
         */
        pitchStore: function () {
            var me = this;
            if (query_user.check_cookie()) {
                me._pitchStore();
            } else {
                me.is_store = 1; //下次登录时自动促发转存事件
                me.to_login();
            }
            //71表数据上报
            log('store');
        },
        _pitchStore: function () {
            //批量转存
            var me = this;
            var share_store_data = {
                "share_key": me.share_key,
                "pwd": me.share_pwd
            };
            request.xhr_post({
                url: "http://web2.cgi.weiyun.com/outlink.fcg",
                cmd: 'WeiyunShareSaveData',
                pb_v2: true,
                header: {appid: outlink_appid},
                body: share_store_data
            })
                .ok(function (msg, body) {
                    me.ui.store_success(share_info.share_name, share_info.share_flag);
                    me._update_downcnt();
                })
                .fail(function (msg, ret) {
                    if (ret == 1024 || ret == 102010 || ret == 190051 || ret == 190011) {
                        me.is_store = 1; //下次登录时自动促发转存事件
                        me.to_login();
                    } else if(ret == 20002 || ret == 20003) { //外链已过期，直接刷新页面
                        window.location.href = window.location.href;
                    } else {
                        me.ui.store_fail(msg, ret);
                    }
                });
        },

        pwd_login: function (pwd, verify_code) {
            var me = this;
            me.get_share_info_pwd(pwd, verify_code);
            //71表数据上报
            log('pwd_login');
        },
        //登录页面
        to_login: function () {
            this.qq_login.show();
            this.ui.mask_show();
        },
        _getSkey: function () {
            return cookie.get("skey", "weiyun.com");
        },

        _getDownloadTjVersion: function () {
            return 12;
        },
        /**
         * 更新下载次数
         * @private
         */
        _update_downcnt: function (is_download) {
            var me = this;
            if(is_download) {
                share_info.down_cnt++;
            } else {
                share_info.store_cnt++;
            }
            me.ui.set_downloaod_times(share_info);
        },
        /**
         * 用户登录模块初始化
         * @private
         */
        _init_login_mod: function () {
            var me = this;
            qq_login_mod = require('qq_login');
            me.qq_login = qq_login_mod.get('./qq_login');
            me.qq_login_ui = me.qq_login.ui;
            me
                .stopListening(me.qq_login)
                .stopListening(me.qq_login_ui)
                .listenTo(me.qq_login, 'qq_login_ok', function () {
                    me.ui.mask_hide();
                    //hyytodo
                    me.trigger('show_user_tips');
                    //判断用户是否是点击保存到微云触发的登录操作,　如果是执行转存命令.
                    if (me.is_store > 0) {
                        me._pitchStore();
                        me.is_store = 0;
                    }else if(me.is_download>0){
                        me.download_file();
                        me.is_download = 0;
                    }
                })
                .listenToOnce(me.qq_login_ui, 'show', function () {
                    me.trigger('qq_login_ui_show');
                })
                .listenToOnce(me.qq_login_ui, 'hide', function () {
                    me.trigger('qq_login_ui_hide');
                    me.stopListening(me.qq_login_ui);
                });

            //设置带有关闭按钮的qq登录窗口
            var new_url = urls.make_url('http://ui.ptlogin2.weiyun.com/cgi-bin/login', {
                appid: 527020901,
                s_url: urls.make_url('/web/callback/qq_login_ok.html'),
                style: 11,
                target: 'self',
                link_target: 'blank',
                hide_close_icon: 0
            });
            me.qq_login.set_ptlogin_url(new_url);

            /**
             * 关闭登录框
             */
            window.ptlogin2_onClose = function () {
                seajs.use(['$', 'qq_login', 'outlink'], function ($, qq_login_mod, outlink_mod) {
                    outlink_mod.get('./outlink').is_store = 0;
                    qq_login_mod.get('./qq_login').hide();
                    $('.full-mask').hide();
                });
            };
        }
    });


    return outlink;
});
