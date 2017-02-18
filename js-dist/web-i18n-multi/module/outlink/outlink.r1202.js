//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/outlink/outlink.r1202",["special_log","lib","common","$","qq_login"],function(require,exports,module){

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
//outlink/src/log.js
//outlink/src/msg.js
//outlink/src/outlink.js
//outlink/src/space_info/space_info.js
//outlink/src/ui.js
//outlink/src/user_info.js
//outlink/src/util.js
//outlink/src/outlink.fail.tmpl.html
//outlink/src/outlink.login.tmpl.html
//outlink/src/outlink.multifile.tmpl.html
//outlink/src/outlink.note.tmpl.html
//outlink/src/outlink.picture.tmpl.html
//outlink/src/outlink.risk.tmpl.html
//outlink/src/outlink.singlefile.tmpl.html
//outlink/src/outlink.tmpl.html

//js file list:
//outlink/src/log.js
//outlink/src/msg.js
//outlink/src/outlink.js
//outlink/src/space_info/space_info.js
//outlink/src/ui.js
//outlink/src/user_info.js
//outlink/src/util.js
/**
 * 外链独立页71表上报
 * @author yuyanghe
 * @date 2013-9-29
 */
define.pack("./log",["special_log"],function(require, exports, module){
    var special_log = require('special_log');
    var act_id = 106;
    return special_log.build_logger({
        //外链页面浏览
        visit : {
            act_id : act_id,
            op_id : 0
        },
        //外链文件下载
        download : {
            act_id : act_id,
            op_id : 1
        },
        //外链转存
        store : {
            act_id : act_id,
            op_id : 2
        },
        //外链密码验证
        pwd_login : {
            act_id : act_id,
            op_id : 3
        }
    });
});/**
 * 错误码信息
 * User: bondli
 * Date: 13-11-13
 * Time: 下午7:12
 * To change this template use File | Settings | File Templates.
 */
define.pack("./msg",[],function (require, exports, module) {

	return {
		msg_obj : {
			114302: "链接已失效，请联系文件所有者重新分享。",
			1020:	"链接已失效，请联系文件所有者重新分享。",
			1026:	"分享资源已经删除，请联系文件所有者重新分享。",
			114201: "分享的数据已经被破坏，请联系文件所有者重新分享。",
			114200: "分享资源已经删除，请联系文件所有者重新分享。",
			190056: "分享已被取消，请联系文件所有者重新分享。",
			1052:	"获取分享信息超时，请稍后重试。",
			404:    "获取分享信息超时，请稍后重试。",
			1014:	"获取分享信息超时，请稍后重试。",
			113502: "链接无效请检查您输入的链接是否完整。",
			114203: "链接无效请检查您输入的链接是否完整。",
			1014:	"系统繁忙，请稍后重试。",
			1000:	"系统繁忙，请稍后重试。",
			114300: "系统繁忙，请稍后重试。",
			114301: "系统繁忙，请稍后重试。",
			113001: "系统繁忙，请稍后重试。",
			113000: "系统繁忙，请稍后重试。"
		},
		get : function (code) {
	    	return this.msg_obj[code] || '链接已失效，请联系文件所有者重新分享。';
	    }
	};

});/**
 * 外链页面
 * User: yuyanghe
 * Date: 13-9-17
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */
define.pack("./outlink",["lib","common","$","./util","./log","./ui","qq_login"],function (require, exports, module) {

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
        m_speed = common.get('./m_speed'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        cookie = lib.get('./cookie'),
        text = lib.get('./text'),
        mini_tip = common.get('./ui.mini_tip'),
        util = require('./util'),
        log = require('./log'),
        share_info = null,
        outlink_appid=30111,

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

            var tp = setTimeout(function(){
                progress.show('正在加载数据...');
            },1000);

            request.get({
                url: 'http://web2.cgi.weiyun.com/wy_share_v2.fcg',
                cmd: 'view_share',
                header: {source:outlink_appid,appid: outlink_appid},
                body: {
                    share_key: me.share_key
                }
            }).ok(function (msg, body) {
                    clearTimeout(tp);
                    progress.hide();
                    share_info = body;
                    share_info.data = me.share_key;
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
                    share_key: me.share_key,
                    share_pwd: pwd
                };

            if(verify_code) {//有验证码需要加上
                req_body.code = verify_code;
            }

            me._last_request = request.get({
                url: 'http://web2.cgi.weiyun.com/wy_share_v2.fcg',
                cmd: 'view_share',
                header: {source:outlink_appid,appid: outlink_appid},
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
                        if(me.ui.is_need_verify_code()) {  //需要验证码时，错误后需要刷新下验证码至最新
                            me.ui.change_verify_code();
                        }
                        me.ui.set_pwd_err_text('密码错误');
                    } else if(ret == 114304 && !callback) { // 输入错误次数频率过高，需要输入验证码
                        me.ui.show_verify_code();
                        me.ui.set_pwd_err_text('密码错误次数过多，请输入验证码');
                    } else if(ret == 114305 && !callback) { //验证码错误
                        me.ui.change_verify_code();
                        me.ui.set_pwd_err_text('验证码错误');
                    } else {
                        if(me.ui.is_need_verify_code()) {
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
                _is_singlefile=true,
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
            if(share_info.file_list.length>1 || share_info.dir_list.length>0){
                _is_singlefile=false;
            }

            var share_name = share_info.sharename;
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

        get_$down_iframe: function () {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },

        get_$down_form: function () {
            return this._$down_form || (this._$down_form = $('<form method="POST" enctype="application/x-www-form-urlencoded"></form>').appendTo(document.body));
        },

        //多文件下载要用post方式
        download_multifile: function () {
            var me = this;
            var tpl_url = "http://web.cgi.weiyun.com/share_dl.fcg";
            var _files = '',
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

            var share_name = share_info.sharename;

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
                zn: encodeURIComponent(share_name),
                os_info: common.get('./util.os').name,
                browser: common.get('./util.browser').name,
                ver: me._getDownloadTjVersion()
            };

            $iframe = me.get_$down_iframe();
            $form = me.get_$down_form();
            $form.empty()
            .attr('action', tpl_url)
            .attr('target', 'batch_download')


            $.each(params, function (name, value) {
                $('<input type="hidden" name=' + name + ' value=' + value + '></input>').appendTo($form);
            });

            $form[0].submit();
        },

        /**
         * 获取预览图
         */
        getPreviewImg: function () {
            var me = this;
            var _url = "http://" + share_info.dl_svr_host + ":" + share_info.dl_svr_port + "/ftn_handler/" + share_info.dl_encrypt_url + "?fname=" + unescape(share_info.sharename)
                + "&pictype=scaled&size=500*500";
            me.ui.showPreviewImg(_url);
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
                "src_ppdir_key": share_info.ppdir_key,        //源父父目录key 字符串
                "src_pdir_key": share_info.pdir_key,         //源父目录key 字符串
                "dst_ppdir_key": "",        //目的父父目录key 字符串(选填，默认为根目录)
                "dst_pdir_key": "",         //目的父目录key 字符串(同上)
                "src_uin": share_info.uin,
                "files": share_info.file_list,
                "dirs": share_info.dir_list,
                "os_info": common.get('./util.os').name,
                "browser": common.get('./util.browser').name
            };
            request.post({
                url: "http://web2.cgi.weiyun.com/wy_share_v2.fcg",
                cmd: 'dump_share',
                //url: "http://web.cgi.weiyun.com/wy_share.fcg",
                //cmd: 'store_share',
                header: {"uin": query_user.get_uin_num(), main_v: 12,appid:outlink_appid,source:outlink_appid},
                body: share_store_data
            })
                .ok(function (msg, body) {
                    me.ui.store_success(share_info.sharename);
                })
                .fail(function (msg, ret) {
                    if(ret == 1024 || ret == 102010 || ret == 190051){
                        me.is_store = 1; //下次登录时自动促发转存事件
                        me.to_login();
                    }else{
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
        _update_downcnt: function () {
            var me = this;
            share_info.downcnt++;
            me.ui.set_downloaod_times(share_info);
        },
        /**
         * 用户登录模块初始化
         * @private
         */
        _init_login_mod: function () {
            var me = this;
            qq_login_mod=require('qq_login');
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
            window.ptlogin2_onClose = function(){
                seajs.use(['$','qq_login','outlink'],function($, qq_login_mod, outlink_mod){
                    outlink_mod.get('./outlink').is_store = 0;
                    qq_login_mod.get('./qq_login').hide();
                    $('#page-mask').hide();
                });
            };
        }
    });


    return outlink;
});
/**
 * 空间信息
 * @author yuyanghe
 * @date 13-9-21
 */
define.pack("./space_info.space_info",["lib","common","$","./user_info"],function (require, exports, module) {
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
        File = common.get('./file.file_object'),
        user_info=require('./user_info'),

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var space_info = new Module('outlink_space_info', {
        _used_space:0,
        _total_space:0,
        _$text:null,
        _$bar: null,

        render: function () {
            // 文字
            var me=this;
            this._$used_space_text = $('#_used_space_info_text');
            this._$total_space_text = $('#_total_space_info_text');
            // 进度条
            this._$bar = $('#_main_space_info_bar');
            this.listenTo(user_info, 'load', function (used_space,total_space) {
                me._used_space=used_space;
                me._total_space= total_space;
                me._update_text();
                me._update_bar();
            });

        },
        // 文字
        _update_text: function () {
            this._$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this._$total_space_text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.floor((this._used_space / this._total_space *100));
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

    return space_info;
});/**
 * 外链UI
 * User: yuyanghe
 * Date: 13-9-17
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */

define.pack("./ui",["lib","common","$","./tmpl","./util","./outlink","./user_info"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        collections = lib.get('./collections'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        File = common.get('./file.file_object'),
        m_speed = common.get('./m_speed'),
        tmpl = require('./tmpl'),
        util =require('./util'),
        outlink,
        should_pwd,
        speed_flags_pic = '7830-4-7-1',
        speed_flags_nopic = '7830-4-7-2',
        share_type,
        undefined;

    var ui = new Module('outlink_ui', {

        render: function () {
            outlink = require('./outlink');
            this._init_ui();
        },

        _init_ui: function () {
            var $ui_root = this._$ui_root = $(tmpl['root']());
            $(document.body).append($ui_root);
        },

        get_$outlink_body: function () {
            return $('#_outlink_body');
        },

        get_$outlink_login: function () {
            return $('#_main_header_banner');
        },
        // 显示用户信息
        _render_user_info: function () {
            require('./user_info').render();
        },


        /**
         * 显示外链页面内容    outlink中调用
         * @param share_info
         */
        render_outlink_content: function (share_info) {
            var me = this;

            if (share_info) {
                //判断是否是私密外链
                if (share_info.need_pwd && share_info.need_pwd==1) {
                    should_pwd = true;
                    me._render_outlink_login();
                } else {
                    me._render_outlink_content_ok(share_info);
                }
            }
        },

        /**
         * 真正显示外链页面内容的函数
         * @param share_info
         * @private
         */
        _render_outlink_content_ok: function (share_info) {
            var me = this;
            var is_render_pic;
            $('#outlink_login').show();

            //console.log(share_info);

            var dir_list = share_info.dir_list,
                file_list = share_info.file_list,
                share_flag = share_info.share_flag;

            if(share_flag == 2 || share_flag == 4){  //笔记外链
                me._render_outlink_note(share_info);
                share_type = 4;
            }
            else {
                if(dir_list.length || file_list.length > 1){  //多文件
                    me._render_outlink_multifile(share_info);
                    share_type = 3;
                }
                else {
                    if( file_list.length == 1 && util.is_image(share_info.sharename) ){  //单文件图片
                        me._render_outlink_pic(share_info);
                        is_render_pic = true;
                        share_type = 2;
                    }
                    else{
                        me._render_outlink_singlefile(share_info);    //单文件
                        share_type = 1;
                    }
                }
            }

            me._init_qr_code(share_info);
            me._initDownloadEvent();
            me._render_user_info();

            //设置下载的cookie
            var dlskey = share_info.dlskey;
            if(dlskey){
                outlink.set_download_cookie(dlskey);
            }
            

            if(!is_render_pic && !should_pwd) {//只对不需要密码的测速，直接展示外链内容，这样测速才准的，非图片在这样测，图片在图片加载完后测
                this.speed_time_report();
            }
        },

        _render_outlink_content_fail: function (msg, ret) {
            var $body = this.get_$outlink_body();
            $(tmpl['outlink_fail']({"msg":msg, "ret":ret})).appendTo($body);
            this.set_fail_msg(msg, ret);
        },

        /**
         * 密码正确后显示外链内容
         * @param share_info
         */
        render_outlink_pwd_ok: function (share_info) {
            var me=this;
            $('#outlink_login').show();
            $('#outlink_login_pass_access').hide();
            me._render_outlink_content_ok(share_info);
            me._render_user_info();
        },

        /**
         * 显示风险详细信息
         * @param share_info
         */
        render_outlink_risk: function (share_info) {
            var me = this;
            me.render();
            var $body = this.get_$outlink_body();
            $(tmpl['outlink_risk']()).appendTo($body);
            me._set_file_name(share_info.sharename);
            var html='';
            switch(share_info.safetype){
                case 1:
                    html+='安全';
                    break;
                case 2:
                    html+='高风险';
                    break;
                case 3:
                    html+='中风险';
                    break;
                case 4:
                    html+='低风险';
                    break;
            }
            $('#risk_level').text(html);
            $('#virus').text(share_info.virusname);
            $('#virus_detail').text(share_info.virusdesc);
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.sharename));
            $('#outlink_login').show();
            me._initDownloadEvent();
            me._render_user_info();
        },

        /**
         * 私密外链登录框显示
         */
        _render_outlink_login: function () {
            var me = this,
                $body = me.get_$outlink_body();

            $(tmpl['outlink_login']()).appendTo($body);

            me._initLoginEvent();
        },
        /**
         * 私密外链登录框显示
         */
        _initLoginEvent: function () {
            var me =  this;
            //点击确认
            $('#outlink_pwd_ok').click(function (e) {
                me._login();
                return false;
            });
            //监听回车
            $('#outlink_pwd, #outlink_code').keydown(function(event){
                if(event.keyCode==13){
                    me._login();
                }
            });

            $('#_verify_code_img, #_change_verify_code').on('click', function(e) {
                e.preventDefault();
                me.change_verify_code();
            })
            //默认聚焦到文本框
            $('#outlink_pwd').focus();
        },

        change_verify_code: function() {
            var $img = $('#_verify_code_img');
            $img[0].src = 'http://captcha.weiyun.com/getimage?aid=543009514&' + Math.random();
        },

        show_verify_code: function() {
            $('#outlink_login_pass_access').addClass('code-module');
            this.set_need_verify_code(true);
            this.change_verify_code();
        },
        /**
         * 外链密码验证
         * @private
         */
        _login:function(){
            var me=this,
                pwd = '',
                verify_code;
            pwd = $('#outlink_pwd').val();
            if (pwd.length == 0) {
                me.set_pwd_err_text('请输入密码');
            } else {
                if(me.is_need_verify_code()) {
                    verify_code = $.trim($('#outlink_code').val());
                    if(!me.check_verify_code(verify_code)) {
                        me.set_pwd_err_text('请输入正确的验证码');
                        return;
                    }
                }
                me.set_pwd_err_text('');
                outlink.pwd_login(pwd, verify_code);
            }
            return false;
        },

        check_verify_code: function(verify_code) {
            if(verify_code.length < 4) {//小于4位时提示
                return false;
            }
            return true;

        },

        is_need_verify_code: function() {
            return this._need_verify_code;
        },

        set_need_verify_code: function(need) {
            this._need_verify_code = !!need;
        },

        /**
         * 单文件外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_singlefile:function(share_info){
            var me = this,
                $body = me.get_$outlink_body();
            $(tmpl['outlink_singlefile']()).appendTo($body);

            me._set_file_name(share_info.sharename);
            if (share_info.file_list[0].file_size) {
                $("#show_file_size").text('文件大小:' + File.get_readability_size(share_info.file_list[0].file_size,
                    false, 2));
            }
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.sharename));
            if(share_info.safetype>0){
                me._render_outlink_risk(share_info)
            }
            me.set_downloaod_times(share_info);
        },
        /**
         * 多文件外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_multifile:function(share_info){
            var me = this,
                $body = me.get_$outlink_body();
            $(tmpl['outlink_multifile']()).appendTo($body);

            var _share_name=share_info.sharename;
            if((share_info.dir_list.length + share_info.file_list.length) > 1){
                _share_name=share_info.sharename + ' 等';
            }
            me._set_file_name(_share_name);
            var text = '';
            if (share_info.dir_list.length > 0 && share_info.file_list.length > 0) {
                text += share_info.dir_list.length + '个文件夹和' + share_info.file_list.length + '个文件';
            } else if (share_info.dir_list.length > 0) {
                text += share_info.dir_list.length + '个文件夹';
            } else if (share_info.file_list.length > 0) {
                text += share_info.file_list.length + '个文件';
            }
            $("#show_file_count").text(text);
            $('#file-icon').addClass('icon-multifile');
            me.set_downloaod_times(share_info);
        },

        /**
         * 笔记外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_note: function (share_info) {
            var me = this,
                $body = me.get_$outlink_body(),
                $share_body = $(tmpl['outlink_note']());

            $share_body.appendTo($body);

            var note_info = share_info.note_info;
            $share_body.find('[data-id=outlink_share_name]').text(share_info.sharename);
            $share_body.find('[data-id=outlink_share_time]').text(note_info.mtime);

            $share_body_cnt = $share_body.find('[data-id=outlink_share_cnt]');
            
            //包含网址的笔记
            if(note_info.type == 1){
                $share_body_cnt.html(note_info.note_content);

                $share_site_body = $(tmpl['outlink_note_site']());
                $share_site_body.appendTo($share_body_cnt);
                $share_site_body.find('[data-id=outlink_share_site_title]').text(note_info.title);
                $share_site_body.find('[data-id=outlink_share_site_url]').attr('href',note_info.raw_url).text(note_info.raw_url);
                $share_site_body.find('[data-id=outlink_share_site_cnt]').html('<iframe src="'+note_info.article_url+'" frameborder="0" scrolling="no"/>');
            }
            else{
                $share_body_cnt.html(note_info.html_data);
            }

            //保存和二维码
            $(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));
            $('#ui-btn-down').hide();
        },

        /**
         * 图片外链正文内容初始化
         * @param share_info
         * @private
         */
        _render_outlink_pic: function (share_info) {
            var me = this,
                $body = me.get_$outlink_body();
            $body.removeClass('wrapper');
            
            $(tmpl['outlink_pic']()).appendTo($body);

            $(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));

            me._set_share_name(share_info.sharename);
            outlink.getPreviewImg();
        },

        /**
         * 危险信息显示
         * @param share_info
         * @private
         */
        _render_outlink_risk: function (share_info) {
            var html='安全性:';
            switch(share_info.safetype){
                case 1:
                    html+='安全';
                    break;
                case 2:
                    html+='高风险';
                    break;
                case 3:
                    html+='中风险';
                    break;
                case 4:
                    html+='低风险';
                    break;
            }
            html+='<a href=\"web/detail_risk_web.html?'+share_info.data+'&'+outlink.share_pwd+'\" target=\"_blank\">了解详情</a>';
            $('#show_safe_type').append(html);
        },


        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_share_name: function (sharename) {
            $('#outlink_title').text(util.format_file_name(sharename));
        },
        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_file_name: function (sharename) {

            $('#outlink_share_name').text(util.format_file_name(sharename));
        },

        /**
         * 设置外链页面的名字
         * @param text
         */
        set_pwd_err_text: function (text) {
            $('#outlink_login_err').text(text);
        },

        set_fail_msg:function(msg,ret){
            $('#outlink_fail_msg').text("msg:"+msg+"ret:"+ret);
        },

        /**
         * 设置下载次数
         * @param share_info
         */
        set_downloaod_times: function (share_info) {
            if (share_info.downcnt > 0) {
                $("#show_download_times").text("下载次数:" + share_info.downcnt);
            }
        },
        /**
         * 事件绑定
         * @private
         */
        _initDownloadEvent: function () {

            var me = this;

            //点击登录
            $('#outlink_login').click(function (e) {
                outlink.to_login();
                return false;
            });

            //下载
            if(share_type == 1 || share_type ==2){  //单文件
                var _urls = outlink.getDownloadURL();
                $('#ui-btn-down').attr('href',_urls);
            }
            else if(share_type == 3){  //多文件
                $('#ui-btn-down').click(function (e) {
                    outlink.download_multifile();
                });
            }

            //二维码按钮
            $('#ui-btn-qr').click(function (e) {
                var $ui_pop_qr = $('#ui-pop-qr');
                if ($ui_pop_qr.is(':hidden')) {
                    $ui_pop_qr.show();
                } else {
                    $ui_pop_qr.hide();
                }
                return false;
            });

            $('#_outlink_body').click(function(e){
                var $ui_pop_qr = $('#ui-pop-qr');
                if ($ui_pop_qr){
                    $ui_pop_qr.hide();
                }
            });
            //保存到微云绑定
            $ui_btn_save=$('#ui-btn-save');
            $ui_btn_save.click(function () {
                outlink.pitchStore();
                $ui_btn_save.addClass('ui-btn-disable');
                setTimeout(function(){
                    $ui_btn_save.removeClass('ui-btn-disable');
                },2000);
                return false;
            });
            //转存成功关闭按钮
            $('#outlink_store_success_close').click(function () {
                me._store_success_close();
                return false;
            });

        },

        /**
         * 初始化QRCODE
         * @param share_info
         */
        _init_qr_code:function(share_info){
            //初始化二维码
            var qrcode_src='http://www.weiyun.com/php/phpqrcode/qrcode.php?data=http%3A%2F%2Fshare.weiyun.com/' +
                share_info.data + '&level=4&size=2';
            $('#out_link_qr_code_prew').attr('src',qrcode_src);
        },

        /**
         * 预览图
         */
        showPreviewImg: function (url) {
            var _url = url,
                me = this,
                $prew_img = $("#prew_img");
            if(_url){
                $prew_img[0].onload = function() {
                    if(!should_pwd) {
                        me.speed_time_report(true);
                    }
                }
                $prew_img.attr("src", _url);
            }
            $prew_img.show();
        },

        /**
         * 转存成功窗口
         */
        store_success: function (sharename) {
            var html='保存成功！<a href="http://www.weiyun.com/disk/index.html?WYTAG=weiyun.share.pc" target="_blank">查看</a>';
            $('#infoBoxContent').text(util.format_file_name(sharename));
            $('#saveas').find('.icon-xbox').removeClass('icon-xbox-warn').addClass('icon-xbox-ok');
            $('#infoBoxTips').text('').append(html);
            $('#page-mask').show();
            $('#saveas').show();
        },

        /**
         * 转存失败窗口
         */
        store_fail: function (msg,ret) {
            var _msg=util.get_err_msg(ret)||msg;
            $('#infoBoxTips').text('保存失败');
            $('#saveas').find('.icon-xbox').removeClass('icon-xbox-ok').addClass('icon-xbox-warn');
            $('#infoBoxContent').text(_msg);
            $('#page-mask').show();
            $('#saveas').show();
        },
        /**
         * 关闭转存成功窗口
         * @private
         */
        _store_success_close: function () {
            $('#page-mask').hide();
            $('#saveas').hide();
        },
        /**
         * 遮罩隐藏
         */
        mask_hide:function (){
            $("#page-mask").hide();
        },
        /**
         * 遮罩显示
         */
        mask_show:function (){
            $("#page-mask").show();
        },

        /**
         * 测速上报
         */
        speed_time_report: function(is_pic) {
            var speed_flags = is_pic ? speed_flags_pic: speed_flags_nopic;
            try {
                var m_speed_flags_arr = speed_flags.split('-');
                // 耗时（毫秒）
                var flags = m_speed_flags_arr.splice(0, 3).join('-');
                var index = m_speed_flags_arr.pop();
                m_speed.send_one(flags, index, new Date() - window.g_start_time);
            } catch(e) {

            }
        }
    });

    return ui;
});
/**
 * 显示一些用户信息（昵称等）
 * @author yuyanghe
 * @date 13-9-17
 */
define.pack("./user_info",["lib","common","$","./outlink","./space_info.space_info"],function (require, exports, module) {
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
            request.get({
                cmd: 'query_user',
                cavil: false,
                header: {source:outlink_appid,appid: outlink_appid},
                body: {
                    show_migrate_fav: 1,
                    show_qqdisk_firstaccess_flag: 1
                }
            }).done(function (msg, ret,body,header) {
                    if(ret==0){
                        me._render_face(header.uin);
                        me.set_nickname(body.nickname);
                        me._render_logout();
                        me.trigger('load',body.used_space,body.total_space)
                    }else if(ret==1031){   //设置了独立密码的用户
                        me._render_face(header.uin);
                        me.set_nickname(body.nickname);
                        me._render_logout();
                        //获取用户空间信息
                        request.get({
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
});/**
 * 外链工具类
 * User: yuyanghe
 * Date: 13-9-21
 * Time: 下午7:12
 * To change this template use File | Settings | File Templates.
 */


define.pack("./util",["lib","common","$"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        collections = lib.get('./collections'),
        Module = common.get('./module'),
        undefined;

    var util = new Module('outlink_util', {
        /**
         * 检测文件是否是图片
         * @param _name
         * @returns {*}
         */
        is_image: function (_name) {
            try {
                var me = this;
                var type = me._get_suffix(_name);
                type = me._switch_type(type);
                var images = ["jpg", "jpeg", "gif", "png", "bmp"];
                if (!type) {   //无后缀名时直接返回 false
                    return false;
                }
                return collections.contains(images, type);
            } catch (e) {
                return false;
            }
        },
        /**
         *获取文件后缀名样式
         */

        get_file_icon_class: function (_name) {
            try {
                var me = this;
                var type = me._get_suffix(_name);
                    type=me._switch_type(type);
                var icons = ["3gp", "7z", "ace", "ai", "apk", "asf", "asp", "avi",
                    "bak", "bat", "bmp", "c", "cab", "chm", "dmg", "doc", "eps",
                    "exe", "fla", "flv", "gif", "hlp", "htm", "html", "ipa", "iso",
                    "jar", "jpg", "log", "mod", "mov", "mp3", "mp4", "mpe", "msg",
                    "msi", "old", "otf", "pdf", "png", "ppt", "psd", "rar", "rmvb",
                    "rp", "swf", "tar", "tmp", "ttf", "txt", "uue", "vsd", "wav",
                    "wma", "wmv", "xls", "xmin", "xml", "zip"];

                if (!type) {   //无后缀名时直接返回 unknow
                    return 'unknow';
                }
                if (collections.contains(icons, type)) {
                    return type;
                } else {
                    type = type.replace(/fla|htm|c|cpp|h|cs|plist|xml|asp|css|js/g, "code");
                    type = type.replace(/ipa|msi|bat/g, "exec");
                    type = type.replace(/psd|png|bmp|tiff|exif|raw/g, "image");
                    type = type.replace(/rar|zip|tar|cab|uue|jar|z|7-zip|7z|iso|dmg|ace|lzh|arj|gzip|bz2/g, "compress");
                    if (collections.contains(["code","exec","image","compress"], type)) {
                        return type;
                    }else{
                        return 'unknow';
                    }
                }
            } catch (e) {
                return 'unknow';
            }
        },
        /**
         * 获取后缀名
         * @param _name
         */
        _get_suffix: function (_name) {
            var EXT_REX = /\.([^\.]+)$/;
            var m = (_name || '').match(EXT_REX);
            return m ? m[1].toLowerCase() : null;
        },

        //检查分享单个文件时的后缀名是否是常见文件
        xsschecktype: function (_name) {
            var me=this;
            try {
                var type = this._get_suffix(_name);
                if (!type) {   //无后缀名时直接返回 false
                    return false;
                }
                type = me._switch_type(type);
                var _fileTypeArr = ["html", "htm", "shtml", "mhtml", "hta"];
                return collections.contains(_fileTypeArr, type);
            } catch (e) {
                return false;
            }
        },

        _switch_type: function (type){
            type = type.toLowerCase();
            type = type.replace(/docx|docm|dot[xm]?/g, "doc");
            type = type.replace(/pptx|ptm/g, "ppt");
            type = type.replace(/xls[xm]?|xl[tx|tm|am|sb]+/g, "xls");
            type = type.replace(/jpeg/g, "jpg");
            return type;
        },

        /**
         * 格式化长文件名
         * @param file_name
         * @returns {*}
         */
        format_file_name : function (file_name) {
            var max_pre_length = 16,
                max_suffix_length = 10,
                file_name_pre,
                file_name_suffix;

            if (file_name.length > max_pre_length + max_suffix_length) {
                file_name_pre = file_name.substr(0, max_pre_length);
                file_name_suffix = file_name.substr(file_name.length - max_suffix_length);
                var format_name = file_name_pre + '...' + file_name_suffix;
                return format_name;
            }
            return file_name;
        },

        /**
         * 获取share_key
         */
        get_share_key:function (){
            return window.location.href.substr(window.location.href.indexOf("?") + 1).split('&')[0];
        },
        /**
         * 获取share_pwd
         */
        get_share_pwd:function (){
            return window.location.href.substr(window.location.href.indexOf("?") + 1).split('&')[1];
        },
        /**
         * 获取失败信息
         */
        get_err_msg:function(ret){
            var msg=null;
            switch (ret){
                case 1013:
                case 1024:
                    msg = '网络问题，请稍候重试。';
                    break;
                case 1020:
                    msg = '保存失败，文件已被删除或移动。';
                    break;
                case 1028:
                    msg = '保存失败，文件数超过单目录最大限制。';
                    break;
                case 1053:
                    msg = '您的网盘空间不足，未能保存这些文件。';
                    break;
                case 1119:
                    msg = '您的网盘空间已满，未能保存这些文件。';
                    break;

                case 102030: 
                    msg = '操作过于频繁，请稍后重试。';
                    break;

                case 102031: 
                    msg = '保存失败，您一次转存的文件太多。';
                    break;
                default:
                    msg = '系统错误，请稍候重试。';
                    break;
            }
            return msg;
        }

    });

    return util;
});


//tmpl file list:
//outlink/src/outlink.fail.tmpl.html
//outlink/src/outlink.login.tmpl.html
//outlink/src/outlink.multifile.tmpl.html
//outlink/src/outlink.note.tmpl.html
//outlink/src/outlink.picture.tmpl.html
//outlink/src/outlink.risk.tmpl.html
//outlink/src/outlink.singlefile.tmpl.html
//outlink/src/outlink.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'outlink_fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var msg = data.msg,
            ret = data.ret;
        var msgobj = require('./msg');
	__p.push('    <div class="viewer-box others clear" id="error_content">\r\n\
        <p class="ui-tips ui-tips-expired">\r\n\
            <i class="icon-expired"></i>');
_p(msgobj.get(ret));
__p.push('        </p>\r\n\
    </div>\r\n\
    <div id=\'outlink_fail_msg\' style="display:none">\r\n\
    </div>');

return __p.join("");
},

'outlink_login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id=\'outlink_login_pass_access\' class="popshare-pass-access" style="left:50%;top:50%;margin-left:-250px;margin-top:-130px">\r\n\
        <h3 class="head"></h3>\r\n\
        <div class="face"></div>\r\n\
\r\n\
        <div class="main">\r\n\
            <p class="infor">请输入访问密码：</p>\r\n\
            <div class="popshare-btn passbox">\r\n\
                <input id=\'outlink_pwd\' type="password" />\r\n\
                <a id=\'outlink_pwd_ok\' class="btn-blue" href="#"><span>确定</span></a>\r\n\
            </div>\r\n\
            <div class="code">\r\n\
                <p class="infor">验证码：</p>\r\n\
                <div class="codebox">\r\n\
                    <input id="outlink_code" maxlength="4" type="text" />\r\n\
                    <a href="#"><img id="_verify_code_img" /></a>\r\n\
                    <a href="#" id="_change_verify_code">换一张</a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <p class="err" id="outlink_login_err"></p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_multifile': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 不可预览文件 -->\r\n\
    <div id="cant_prew_file" class="viewer-box others clear">\r\n\
        <div class="main">\r\n\
            <div class="inner clear">\r\n\
                <div class="file-desc">\r\n\
                    <!-- 文件类型图标 -->\r\n\
                    <span id="file-icon" class="icon-file"></span>\r\n\
\r\n\
                    <h2 class="ui-title" title=\'\' id=\'outlink_share_name\'></h2>\r\n\
                    <h4 class="file-count" id="show_file_count"></h4>\r\n\
                    <ul>\r\n\
                        <li class="ui-text" id="show_file_size"></li>\r\n\
                        <li class="ui-text" id="show_download_times"></li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
\r\n\
                <div class="ui-btns">\r\n\
                    <a href="javascript:void(0)" id=\'ui-btn-down\' class="ui-btn" tj-action="btn-adtag-tj" tj-value="51003"><span\r\n\
                            class="ui-btn-text">下载</span></a>\r\n\
                    <a href="javascript:void(0)" id=\'ui-btn-save\' class="ui-btn" tj-action="btn-adtag-tj" tj-value="51001"><span\r\n\
                            class="ui-btn-text">保存到微云</span></a>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="side">\r\n\
            <div class="inner">\r\n\
                <img id="out_link_qr_code_prew" width="130" height="130"/>\r\n\
\r\n\
                <p class="ui-tips">扫描二维码，将文件下载到手机</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_note': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="lay-bj">\r\n\
    <div class="bj-inner">\r\n\
        <h1 class="head" data-id="outlink_share_name"></h1>\r\n\
        <div class="time" data-id="outlink_share_time"></div>\r\n\
        <div class="content" data-id="outlink_share_cnt">\r\n\
\r\n\
        </div>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'outlink_note_site': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="bookmark">\r\n\
    <i class="ico"></i>\r\n\
    <h1 class="tit" data-id="outlink_share_site_title"></h1>\r\n\
    <a href="http://www.51buy.com" class="link" data-id="outlink_share_site_url" target="_blank">www.51buy.com</a>\r\n\
    <div class="bod" data-id="outlink_share_site_cnt">\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'outlink_pic': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="link-pic">\r\n\
        <table><tr><td>\r\n\
            <img style="display:none" id="prew_img" />\r\n\
        </td></tr></table>\r\n\
    </div>');

return __p.join("");
},

'outlink_risk': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push(' <!-- 不可预览文件 -->\r\n\
    <div id="cant_prew_file" class="viewer-box others clear">\r\n\
\r\n\
                <div class="file-desc">\r\n\
                    <!-- 文件类型图标 -->\r\n\
                    <span id="file-icon" class="icon-file"></span>\r\n\
                    <table>\r\n\
                        <tr>\r\n\
                            <td valign="center" height="96">\r\n\
                                <h2 class="ui-title" id="outlink_share_name" title=""></h2>\r\n\
                                <ul>\r\n\
                                    <li class="ui-text safe-not">文件感染病毒</li>\r\n\
                                </ul>\r\n\
                            </td>\r\n\
                        </tr>\r\n\
                    </table>\r\n\
                </div>\r\n\
                <div class="warn-text">\r\n\
                    风险等级：<span id="risk_level"></span><br>\r\n\
                    感染病毒：<span id="virus"></span>\r\n\
                </div>\r\n\
                <div class="warn-text">\r\n\
                    详情：<br>\r\n\
                    <span id="virus_detail"></span>\r\n\
                </div>\r\n\
                <div class="down-gj">\r\n\
                    增强手机安全防护，推荐使用腾讯手机管家<br>\r\n\
                    <a href="http://m.qq.com?g_f=23457" target="_blank">立即下载</a>\r\n\
                </div>\r\n\
\r\n\
    </div>');

return __p.join("");
},

'outlink_singlefile': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 不可预览文件 -->\r\n\
    <div id="cant_prew_file" class="viewer-box others clear">\r\n\
        <div class="main">\r\n\
            <div class="inner clear">\r\n\
                <div class="file-desc">\r\n\
                    <!-- 文件类型图标 -->\r\n\
                    <span id="file-icon" class="icon-file"></span>\r\n\
                    <table>\r\n\
                        <tr>\r\n\
                            <td valign="center" height="96">\r\n\
                                <h2 class="ui-title" title=\'\' id=\'outlink_share_name\'></h2>\r\n\
                                <!--h4 class="file-count" id="show_file_count"></h4-->\r\n\
                                <ul>\r\n\
                                    <li class="ui-text" id="show_file_size"></li>\r\n\
                                    <li class="ui-text" id="show_download_times"></li>\r\n\
                                    <li class="ui-text" id="show_safe_type"></li>\r\n\
                                </ul>\r\n\
                            </td>\r\n\
                        </tr>\r\n\
                    </table>\r\n\
                </div>\r\n\
                <div class="ui-btns">\r\n\
                    <a href="javascript:void(0)" id=\'ui-btn-down\' class="ui-btn" tj-action="btn-adtag-tj" tj-value="51003"><span\r\n\
                            class="ui-btn-text">下载</span></a>\r\n\
                    <a href="javascript:void(0)" id=\'ui-btn-save\' class="ui-btn" tj-action="btn-adtag-tj" tj-value="51001"><span\r\n\
                            class="ui-btn-text">保存到微云</span></a>\r\n\
                </div>\r\n\
\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="side">\r\n\
            <div class="inner">\r\n\
                <img id="out_link_qr_code_prew" width="130" height="130"/>\r\n\
\r\n\
                <p class="ui-tips">扫描二维码，将文件下载到手机</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'root': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p( this['outlink_header']() );
__p.push('    ');
_p( this['outlink_body']() );
__p.push('');

return __p.join("");
},

'outlink_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- header S -->\r\n\
    <div class="lay-header clear" id=\'_outlink_header\'>\r\n\
        <a class="logo" href="http://www.weiyun.com/" target=\'_blank\'></a>\r\n\
        <p id=\'outlink_title\' class="title"></p>\r\n\
        <a id="outlink_login"class="login" href="javascript:void(0)" style="display:none">登录</a>\r\n\
        <div class="user">\r\n\
            <div id="header-user" class="normal" style="display:none;">\r\n\
                <div class="inner">\r\n\
                    <img />\r\n\
                    <i class="ico"></i>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>');
_p( this['face_menu']() );
__p.push('    </div>\r\n\
    <!-- header E -->');

return __p.join("");
},

'head_tool_bar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="popshare-btn">\r\n\
        <a id=\'ui-btn-down\'class="btn-blue" href="#"><span>下载</span></a>\r\n\
        <a id=\'ui-btn-save\'class="btn-blue wy" href="#"><span>保存到微云</span></a>\r\n\
        <a id=\'ui-btn-qr\'class="btn-gray" href="#"><span>二维码</span></a>\r\n\
    </div>\r\n\
    <!-- user-menu S -->\r\n\
    <div class="ui-pop ui-pop-qr" id=\'ui-pop-qr\' style="display:none;">\r\n\
        <img id="out_link_qr_code_prew" width="222" height="222">\r\n\
\r\n\
        <p class="ui-tips">扫描二维码，将文件下载到手机</p>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'face_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 用户信息于旧版保持一致 -->\r\n\
    <div id="_main_face_menu" data-no-selection="" class="ui-pop ui-pop-user hide">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick"></span>\r\n\
\r\n\
            <div id="_main_space_info">\r\n\
                <p class="ui-text" >\r\n\
                    <label for="">已使用：</label>\r\n\
                    <span id="_used_space_info_text">0G</span>\r\n\
                </p>\r\n\
                <p class="ui-text" >\r\n\
                    <label for="">总容量：</label>\r\n\
                    <span id="_total_space_info_text">0G</span>\r\n\
                </p>\r\n\
            </div>\r\n\
            <div class="ui-quota" title="1%">\r\n\
                <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 1%;"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
\r\n\
            <li><a id="_main_client_down" href="http://www.weiyun.com/download.html?WYTAG=weiyun.share.pc"\r\n\
                   target="_blank"><i class="icon-dwn"></i>下载客户端</a></li>\r\n\
            <li><a id="_main_feedback" href="http://support.qq.com/discuss/715_1.shtml?WYTAG=weiyun.share.pc"\r\n\
                   target="_blank">\r\n\
                <i class="icon-fedbk"></i>反馈\r\n\
            </a></li>\r\n\
            <li><a href="javascript:void(0)" id="outlink_login_out" tj-action="btn-adtag-tj" tj-value="50006"><i\r\n\
                    class="icon-exit"></i>退出</a></li>\r\n\
\r\n\
        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'outlink_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id=\'_outlink_body\' class="wrapper">\r\n\
\r\n\
    </div>\r\n\
    <!-- .wrapper -->\r\n\
    <a class="ui-fixed-rb complain" href="javascript:void(0);" onclick="javascript:alert(\'举报成功！\');">举报</a>\r\n\
    <!-- 遮罩 -->\r\n\
\r\n\
    <div class="ui-mask" id="page-mask" style="display:none"></div>\r\n\
\r\n\
    <div class="ui-xbox ui-confirm hide" id="saveas">\r\n\
        <div class="ui-shadow"></div>\r\n\
        <div class="ui-xbox-inner">\r\n\
            <div class="ui-xbox-wrap">\r\n\
                <h3 class="ui-xbox-title" >提示</h3>\r\n\
                <div class="ui-xbox-cnt">\r\n\
                    <div class="ui-confirm-cnt">\r\n\
                        <i class="icon-xbox icon-xbox-ok"></i>\r\n\
                        <h4 class="ui-title" id="infoBoxTips">保存成功！<a href="http://www.weiyun.com/disk/index.html?WYTAG=weiyun.share.pc"\r\n\
                                                                        target="_blank">查看</a></h4>\r\n\
                        <div class="ui-text" id="infoBoxContent"></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="ui-xbox-foot">\r\n\
                    <input class="ui-btn-cancel" type="button" id=\'outlink_store_success_close\'value="关闭">\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
