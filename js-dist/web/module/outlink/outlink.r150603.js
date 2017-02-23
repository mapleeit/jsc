//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/outlink/outlink.r150603",["special_log","lib","common","$","qq_login","main"],function(require,exports,module){

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
//outlink/src/outlink.allpic.tmpl.html
//outlink/src/outlink.dialog.tmpl.html
//outlink/src/outlink.fail.tmpl.html
//outlink/src/outlink.login.tmpl.html
//outlink/src/outlink.multifile.tmpl.html
//outlink/src/outlink.note.tmpl.html
//outlink/src/outlink.picture.tmpl.html
//outlink/src/outlink.risk.tmpl.html
//outlink/src/outlink.singlefile.tmpl.html
//outlink/src/outlink.singlepic.tmpl.html
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
            114503: "该外链侵犯了他人利益，已失效。",
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
			215005: "分享内容不存在，请联系分享者重新分享",
			215012: "分享内容暂时无法查看，请稍后重试。",
			1014:	"系统繁忙，请稍后重试。",
			1000:	"系统繁忙，请稍后重试。",
			114300: "系统繁忙，请稍后重试。",
			114301: "系统繁忙，请稍后重试。",
			113001: "系统繁忙，请稍后重试。",
			113000: "系统繁忙，请稍后重试。",
            20000: {
                msg: "因系统升级，分享页面暂时无法访问",
                desc: "给您造成的不便，敬请谅解。"
            },
            20002: "链接已过期，请联系分享者重新分享。",
            20003: "外链使用次数已用完，请联系分享者重新分享。"
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
define.pack("./outlink",["lib","common","$","./util","./log","./msg","./ui","qq_login"],function (require, exports, module) {

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
 * http://tapd.oa.com/QQdisk/prong/stories/view/1010030581056463249
 */

define.pack("./ui",["lib","common","$","./tmpl","./util","main","./outlink","./user_info"],function(require, exports, module) {

    var lib = require('lib'),
        cookie = lib.get('./cookie'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        collections = lib.get('./collections'),
        text = lib.get('./text'),
        date_time = lib.get('./date_time'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        File = common.get('./file.file_object'),
	    huatuo_speed = common.get('./huatuo_speed'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        ui_center = common.get('./ui.center'),
        mini_tip = common.get('./ui.mini_tip'),
        tmpl = require('./tmpl'),
        util = require('./util'),
        main_ui = require('main').get('./ui'),
        widgets = common.get('./ui.widgets'),
        outlink,
        sel_box,
        should_pwd,
        speed_flags_pic = '7830-4-7-1',
        speed_flags_nopic = '7830-4-7-2',
        shareImageList = [], //分享的目录下的图片集合，预览图片时需要
        shareFileInfo = {}, //分享的文件
        allFileInfo = {},
        isAllPic = false, //分享的是否全部是图片
        isSingleFile = false,//单文件时下载栏直接就是enabled状态
        notShowDownload = false, //不展示下载，笔记无法下载
        notSaveToWy = false,//不展示保存到微云
        noBoxSelection = false,
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        File = common.get('./file.file_object'),
        undefined;

    var ui = new Module('outlink_ui', {

        render: function() {
            outlink = require('./outlink');
            this._init_ui();
        },

        _init_ui: function() {},

        get_$outlink_body: function() {
            return $('.module-share-new');
        },

        get_$outlink_login: function() {
            return $('#_main_header_banner');
        },
        // 显示用户信息
        _render_user_info: function() {
            require('./user_info').render();
        },
        //显示面包屑
        _render_breadcrumb: function(share_info) {
            var me = this;
            me.get_$outlink_body().append(tmpl['outlink_breadcrumb'](share_info));
        },

        /**
         * 显示外链页面内容    outlink中调用
         * @param share_info
         */
        render_outlink_content: function(share_info) {
            var me = this;
            share_info = share_info;
            me.get_$outlink_body().append(tmpl['outlink_header']());
            if (share_info) {
                //判断是否是私密外链
                if (share_info.need_pwd && share_info.need_pwd == 1) {
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
        _render_outlink_content_ok: function(share_info) {
            var me = this;
            var is_render_pic,
                fileObj,
                fileInfo,
                count,
                word,
                flag = 'allPic',
                $container = me.get_$outlink_body();
            $('#outlink_login').show();

            var dir_list = share_info.dir_list || [],
                file_list = share_info.file_list || [],
                share_flag = share_info.share_flag;
                count = file_list.length + dir_list.length;
            if(dir_list.length > 0 && file_list.length > 0) {
                word = '文件(夹)';
            } else if (dir_list.length > 0 && 0 == file_list.length) {
                word = '文件夹';
            } else {
                for(var k = 0, len = file_list.length; k < len; k++) {
                    if(!util.is_image(file_list[k].file_name)) {
                        word = '文件';
                        flag = 'notAllPic';
                        break;
                    }
                }
                if('allPic' == flag) {
                    word = '图片';
                }
            }
            if (share_flag == 2 || share_flag == 4) { //笔记外链
                isSingleFile = true;
                notShowDownload = true;
                word = '笔记';
                noBoxSelection = true;
                me._render_outlink_note(share_info);
            } else if (share_flag == 5 || share_flag == 6 || share_flag == 7 || share_flag == 8) { //文章外链
                isSingleFile = true;
                notShowDownload = true;
                notSaveToWy = true;
                word = '文章';
                noBoxSelection = true;
                me._render_outlink_article(share_info);
            } else {
                if (1 == dir_list.length && 0 == file_list.length && ((dir_list[0].total_dir_count + dir_list[0].total_file_count) <= 100) && ((dir_list[0].total_dir_count + dir_list[0].total_file_count) > 0)) { //产品逻辑：当分享的只有一个文件夹且文件内文件总数<=100时，展示文件夹内文件，否则展示该文件夹
                    share_info.file_list = dir_list[0]['file_list'] || [];
                    share_info.dir_name = dir_list[0]['dir_name'];
                    share_info.dir_list = dir_list[0]['dir_list'] || [];
                    share_info.pdir_key = dir_list[0]['dir_key'];
                    file_list = dir_list[0]['file_list'] || [];
                    dir_list = dir_list[0]['dir_list'] || [];
                }
                if(0 == dir_list.length && 1 == file_list.length && util.is_image(share_info.share_name)) {
                    isSingleFile = true;
                }
                for (var i = 0, len = (share_info.file_list || []).length; i < len; i++) {
                    fileInfo = share_info.file_list[i];
                    if(util.is_image(fileInfo.file_name)) {
                        fileObj = new File({
                            id: fileInfo.file_id, //String   文件ID
                            pid: fileInfo.pdir_key, //String   父目录ID
                            name: fileInfo.file_name, //String   文件名
                            size: fileInfo.file_size, //Number   字节数，默认0
                            cur_size: fileInfo.file_size
                        });
                        shareImageList.push(fileObj);
                    }
                }
                if (dir_list.length > 0) { //有文件夹的
                    me._render_breadcrumb(share_info);
                    me._render_outlink_multifile(share_info);
                } else {
                    if (1 == file_list.length && util.is_image(share_info.share_name)) { //单图片
                        isSingleFile = true;
                        me._render_outlink_singlepic(share_info);
                    } else {
                        me._render_breadcrumb(share_info);
                        isAllPic = util.isAllPic(file_list);
                        if (isAllPic) { //全图片
                            me._render_outlink_allpic(share_info);
                        } else {
                            me._render_outlink_multifile(share_info);
                        }
                    }
                }
            }
            $container.find('#_outlink_header').after(tmpl['outlink_download']({
                share_type: share_info.share_type,
                headIconUrl: share_info.share_head_image_url,
                nickname: share_info.share_nick_name,
                isSingleFile: isSingleFile,
                count: count,
                notShowDownload: notShowDownload,
                notSaveToWy: notSaveToWy,
                word: word
            }));
            if(!noBoxSelection) {
                me._enable_box_selection();
            }
            me._formatShareInfo(share_info);
            me._init_qr_code(share_info);
            me._initDownloadEvent(share_info);
            me._initSelectEvent();
            me._initPreviewEvent(share_info);
            me._render_user_info();

            //设置下载的cookie
            var dlskey = share_info.dlskey;
            if (dlskey) {
                outlink.set_download_cookie(dlskey);
            }

            this.speed_time_report();
        },
        _formatShareInfo: function(share_info) {
            var obj;
            if (share_info && share_info.file_list) {
                for (var i = 0, len = share_info.file_list.length; i < len; i++) {
                    obj = share_info.file_list[i];
                    allFileInfo[obj['file_id']] = {
                        flag: 'file',
                        file_id: obj['file_id'],
                        name: obj['file_name'],
                        size: obj['file_size'],
                        pdir_key: obj['pdir_key'],
                        thumb_url: obj['thumb_url']
                    }
                }
            }
            if (share_info && share_info.dir_list) {
                for (var j = 0, len = share_info.dir_list.length; j < len; j++) {
                    obj = share_info.dir_list[j];
                    allFileInfo[obj['dir_key']] = {
                        flag: 'dir',
                        dir_key: obj['dir_key'],
                        name: obj['dir_name']
                    }
                }
            }
        },
        _initPreviewEvent: function(share_info) {
            var $container = $('div.share-file-list'),
                me = this;
            $container.on('click', '.share-file', function() {
                var $self = $(this),
                    record = {},
                    id = $self.attr('data-record-id'),
                    fileInfo = allFileInfo[id];
                var data = {
                    share_key: share_info.share_key,
                    pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    pack_name: fileInfo.name,
                    file_list: [],
                    dir_list: []
                };
                if ('file' == fileInfo.flag) {
                    record = new File({
                        id: fileInfo.file_id, //String   文件ID
                        pid: fileInfo.pdir_key, //String   父目录ID
                        name: fileInfo.name, //String   文件名
                        size: fileInfo.size, //Number   字节数，默认0
                        cur_size: fileInfo.size
                    });
                    for (var i = 0, len = shareImageList.length; i < len; i++) {
                        if (fileInfo.file_id == shareImageList[i].get_id()) {
                            record = shareImageList[i];
                            break;
                        }
                    }
                    // 文档预览
                    // 如果是可预览的文档，则执行预览操作
                    if (preview_dispatcher.is_preview_doc(record)) { //文件，txt，doc，pdf等
                        if(record.get_size() > 50 * 1024 * 1024) {
                            widgets.confirm('温馨提示', '您访问的文件大于50MB，暂时无法在线预览，请下载后在电脑中打开。', '', function(e) {
                                if(query_user.check_cookie()) {
                                    data.file_list.push({
                                        file_id: fileInfo['file_id'],
                                        pdir_key: fileInfo['pdir_key']
                                    });
                                    request.xhr_post({
                                        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                        cmd: 'WeiyunSharePartDownload',
                                        use_proxy: true,
                                        pb_v2: true,
                                        body: data
                                    }).ok(function(msg, body) {
                                        me.get_$down_iframe().attr('src', body.download_url);
                                    }).fail(function(msg) {
                                        mini_tip.error(msg || '下载失败');
                                    });
                                } else {
                                    $('#outlink_login').click();
                                }
                            }, $.noop, ['下载', '取消']);
                        } else {
                            record._share_key = share_info.share_key; //分享的文件预览时需求带上_share_key参数
                            record._share_pwd = share_info.pwd;
                            data.file_list.push({
                                file_id: fileInfo['file_id'],
                                pdir_key: fileInfo['pdir_key']
                            });
                            record.down_file = function() {//点击 预览中的下载 的回调函数
                                if(query_user.check_cookie() ) {
                                    request.xhr_post({
                                        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                        cmd: 'WeiyunSharePartDownload',
                                        use_proxy: true,
                                        pb_v2: true,
                                        body: data
                                    }).ok(function(msg, body) {
                                        me.get_$down_iframe().attr('src', body.download_url);
                                    }).fail(function(msg) {
                                        mini_tip.error(msg || '下载失败');
                                    });
                                } else {
                                    $('#outlink_login').click();
                                }
                            };
                            preview_dispatcher.preview(record);
                        }
                    } else if (util.is_image(fileInfo.name)) { //图片
                        me.preview_image(record);
                    } else { //不是可预览文件，像音乐，视频等
                        if(query_user.check_cookie()) {
                            data.file_list.push({
                                file_id: fileInfo['file_id'],
                                pdir_key: fileInfo['pdir_key']
                            });
                            request.xhr_post({
                                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                cmd: 'WeiyunSharePartDownload',
                                use_proxy: true,
                                pb_v2: true,
                                body: data
                            }).ok(function(msg, body) {
                                me.get_$down_iframe().attr('src', body.download_url);
                            }).fail(function(msg) {
                                mini_tip.error(msg || '下载失败');
                            });
                        } else {
                            $('#outlink_login').click();
                        }
                    }
                } else { //文件夹
                    return; //文件夹先不给下载
                    if(query_user.check_cookie()) {
                        data.dir_list.push({
                            dir_key: fileInfo['dir_key']
                        });
                        request.xhr_post({
                            url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                            cmd: 'WeiyunSharePartDownload',
                            use_proxy: true,
                            pb_v2: true,
                            body: data
                        }).ok(function(msg, body) {
                            me.get_$down_iframe().attr('src', body.download_url);
                        }).fail(function(msg) {
                            mini_tip.error(msg || '保存失败');
                        });
                    } else {
                        $('#outlink_login').click();
                    }
                }
            });
            return false;
        },
        _initSelectEvent: function() {
            var $container = $('div.share-file-list'),
                $shareFiles = $container.find('div.share-file');
            var me = this,
                recordIdArr = [];
            $('#checkall').on('click', function() { //全选
                recordIdArr = [];
                var $self = $(this);
                if ($self.hasClass('checkalled')) {
                    $self.removeClass('checkalled');
                    $shareFiles.removeClass('ui-selected'); //普通文件
                    $('.download').addClass('g-btn-disabled');
                    $('.save-to-weiyun').addClass('g-btn-disabled');
                    me._get_sel_box().set_selected_status([], true);
                } else {
                    $self.addClass('checkalled');
                    $shareFiles.removeClass('ui-selected').addClass('ui-selected');
                    $.each($shareFiles, function(index, div) {
                        recordIdArr.push($(div).attr('data-record-id'));
                    }); 
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                    me._get_sel_box().set_selected_status(recordIdArr, true);
                }
                return false;
            });
            $container.on('click', '.checkbox', function() {
                recordIdArr = [];
                var $self = $(this),
                    $fileDiv = $self.closest('.share-file');
                if ($fileDiv.hasClass('ui-selected')) {
                    $fileDiv.removeClass('ui-selected');
                } else {
                    $fileDiv.addClass('ui-selected');
                }
                $container.find('div.ui-selected').each(function(index, div) {
                    recordIdArr.push($(div).attr('data-record-id'));
                });
                me._get_sel_box().set_selected_status(recordIdArr, true);
                if (0 == $container.find('div.ui-selected').length) {
                    $('.download').addClass('g-btn-disabled');
                    $('.save-to-weiyun').addClass('g-btn-disabled');
                } else {
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                }
                if ($container.find('.ui-selected').length == $container.attr('data-count')) {
                    $('#checkall').removeClass('checkalled').addClass('checkalled');
                } else {
                    $('#checkall').removeClass('checkalled');
                }
                return false;
            });
        },
        _get_share_enter: function(callback) {
            require.async('share_enter', function(mod) {
                var share_enter = mod.get('./share_enter');
                callback.call(this, share_enter);
            });
        },
        //图片预览
        preview_image: function(file) {
            var me = this;

            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前图片所在的索引位置
                var index = $.inArray(file, shareImageList);
                image_preview.start({
                    total: shareImageList.length,
                    index: index,
                    //images: shareImageList,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return allFileInfo[shareImageList[index].get_id()]['thumb_url'] + '&size=64*64';
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return allFileInfo[shareImageList[index].get_id()]['thumb_url'] + '&size=1024*1024';
                    },
                    download: function(index, e) {
                        if(query_user.check_cookie() ) {
                            var file = shareImageList[index];
                            downloader.down(file, e);
                        } else {
                            $('#outlink_login').click();
                        }
                    }
                });
            });
        },
        //框选
        _get_sel_box: function() {
            if (!sel_box) {
                var SelectBox = common.get('./ui.SelectBox');
                var $list = $('#lay-main-con .dirs');
                sel_box = new SelectBox({
                    ns: 'share',
                    $el: $list,
                    $scroller: $('#lay-main-con'),
                    all_same_size: true,
                    keep_on: function($tar) {
                        return $tar.is('label');
                    },
                    clear_on: function($tar) {
                        return $tar.closest('[data-record-id]').length === 0;
                    },
                    container_width: function() {
                        return $list.width();
                    }
                });
            }
            return sel_box;
        },
        //启用框选
        _enable_box_selection: function() {
            var me = this,
                sel_box = me._get_sel_box();
            sel_box.enable();
            this.listenTo(sel_box, 'select_change', function(sel_id_map, unsel_id_map) {
                var selectedSomeone = false;
                for (var i in (sel_id_map || {})) {
                    selectedSomeone = true; //能进来说明sel_id_map不为{}
                    break;
                }
                if (selectedSomeone) {
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                } else {
                    $('.download').removeClass('g-btn-disabled').addClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled').addClass('g-btn-disabled');
                }
                if ($('div.ui-selected').length == $('div.share-file-list').attr('data-count')) {
                    $('#checkall').removeClass('checkalled').addClass('checkalled');
                } else {
                    $('#checkall').removeClass('checkalled');
                }
            });
        },
        _render_outlink_content_fail: function(msg, ret) {
            var $body = this.get_$outlink_body();
            $('body').addClass('link-out');
            $(tmpl['outlink_fail']({
                "msg": msg,
                "ret": ret
            })).appendTo($body);
            this.set_fail_msg(msg, ret);
        },

        /**
         * 密码正确后显示外链内容
         * @param share_info
         */
        render_outlink_pwd_ok: function(share_info) {
            var me = this;
            $('#outlink_login').show();
            $('#outlink_login_pass_access').hide();
            me._render_outlink_content_ok(share_info);
            me._render_user_info();
        },

        /**
         * 显示风险详细信息
         * @param share_info
         */
        render_outlink_risk: function(share_info) {
            var me = this;
            me.render();
            var $body = this.get_$outlink_body();
            $(tmpl['outlink_risk']()).appendTo($body);
            me._set_file_name(share_info.share_name);
            var html = '';
            switch (share_info.safe_type) {
                case 1:
                    html += '安全';
                    break;
                case 2:
                    html += '高风险';
                    break;
                case 3:
                    html += '中风险';
                    break;
                case 4:
                    html += '低风险';
                    break;
            }
            $('#risk_level').text(html);
            $('#virus').text(share_info.virus_name);
            $('#virus_detail').text(share_info.virus_desc);
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.share_name));
            $('#outlink_login').show();
            me._initDownloadEvent();
            me._render_user_info();
        },

        /**
         * 私密外链登录框显示
         */
        _render_outlink_login: function() {
            var me = this,
                $body = me.get_$outlink_body();

            $(tmpl['outlink_login']()).appendTo($body);
            $('#outlink_pwd').focus();

            me._initLoginEvent();
        },
        /**
         * 私密外链登录框显示
         */
        _initLoginEvent: function() {
            var me = this;
            //点击确认
            $('#outlink_pwd_ok').click(function(e) {
                me._login();
                return false;
            });
            //监听回车
            $('#outlink_pwd, #outlink_code').keydown(function(event) {
                if (event.keyCode == 13) {
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
            $img[0].src = constants.BASE_VERIFY_CODE_URL + Math.random();
        },

        show_verify_code: function() {
            $('#outlink_login_pass_access').addClass('code-module').css('marginTop', '-140px');
            this.set_need_verify_code(true);
            this.change_verify_code();
        },
        /**
         * 外链密码验证
         * @private
         */
        _login: function() {
            var me = this,
                pwd = '',
                verify_code;
            pwd = $('#outlink_pwd').val();
            if (pwd.length == 0) {
                me.set_pwd_err_text('请输入密码');
            } else {
                if (me.is_need_verify_code()) {
                    verify_code = $.trim($('#outlink_code').val());
                    if (!me.check_verify_code(verify_code)) {
                        me.set_verify_err_text('请输入正确的验证码');
                        return;
                    }
                }
                me.set_pwd_err_text('');
                me.set_verify_err_text('');
                outlink.pwd_login(pwd, verify_code);
            }
            return false;
        },

        check_verify_code: function(verify_code) {
            if (verify_code.length < 4) { //小于4位时提示
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
        _render_outlink_singlefile: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();
            $(tmpl['outlink_singlefile']()).appendTo($body);

            me._set_file_name(share_info.share_name);
            if (share_info.file_list[0] && share_info.file_list[0].file_size) {
                $("#show_file_size").text('文件大小:' + File.get_readability_size(share_info.file_list[0].file_size,
                    false, 1));
            }
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.share_name));
            if (share_info.safe_type > 0) {
                me._render_outlink_risk(share_info)
            }
        },
        getShareList: function(dirList, fileList) {
            var fileLen,
                dirLen,
                shareList = [];
            fileList = fileList || [],
            fileLen = fileList.length,
            dirList = dirList || [],
            dirLen = dirList.length;
            for (var j = 0; j < dirLen; j++) {
                obj = dirList[j];
                shareList.push({
                    id: obj['dir_key'],
                    name: obj['dir_name'],
                    text: obj.hasOwnProperty('total_file_count') || obj.hasOwnProperty('total_dir_count') ? (obj['total_file_count'] || 0) + (obj['total_dir_count'] || 0) + '个文件' : '',
                    icon: 'folder'
                });
            }
            for (var i = 0; i < fileLen; i++) {
                obj = fileList[i];
                shareList.push({
                    id: obj['file_id'],
                    name: obj['file_name'],
                    text: util.switchSize(obj['file_size']),
                    icon: util.get_file_icon_class(obj['file_name']),
                    isImg: util.is_image(obj['file_name']),
                    thumb_url: obj['thumb_url']
                });
                shareFileInfo[obj['file_id']] = {
                    id: obj['file_id'],
                    name: obj['file_name'],
                    size: obj['file_size'],
                    pid: obj['pdir_key']
                };
            }
            return shareList;
        },
        _render_outlink_singlepic: function(share_info) {
            var me = this,
                $container = me.get_$outlink_body(),
                picObj = share_info && share_info.file_list && share_info.file_list[0];
            $container.append(tmpl['outlink_singlepic'](picObj));
        },
        _render_outlink_allpic: function(share_info) {
            var me = this,
                fileObj,
                $container = me.get_$outlink_body(),
                fileList = (share_info && share_info.file_list) || [];
            for (var i = 0, len = fileList.length; i < len; i++) {
                fileObj = fileList[i];
                shareFileInfo[fileObj['file_id']] = {
                    id: fileObj['file_id'],
                    name: fileObj['file_name'],
                    size: fileObj['file_size'],
                    pid: fileObj['pdir_key']
                };
            }
            $container.append(tmpl['outlink_allpic'](fileList));
        },
        /**
         * 多文件外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_multifile: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body(),
                icon_cls,
                obj = null,
                shareList = [],
                fileList = (share_info && share_info.file_list) || [],
                fileLen = fileList.length,
                dirList = (share_info && share_info.dir_list) || [],
                dirLen = dirList.length;
            shareList = me.getShareList(dirList, fileList);
            $(tmpl['outlink_multifile']({
                shareList: shareList
            })).appendTo($body);
        },

        /**
         * 笔记外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_note: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();

            var note_info = share_info.item && share_info.item.item_htmltext,
                note_base_info = share_info.item && share_info.item.note_basic_info;
            var $share_body = $(tmpl['outlink_note']({
                    noteId: (note_base_info && note_base_info.note_id) || ''
                }));
            $share_body.appendTo($body);
            $share_body.find('h1.headline').text(text.smart_cut(share_info.share_name, 40));
            $share_body_cnt = $share_body.find('div.content');
            //包含网址的笔记
            if (note_base_info.note_type == 1) {
                var artitle_info = share_info.item && share_info.item.item_article,
                    html_content = artitle_info.note_comment && artitle_info.note_comment.note_html_content || '';
                $share_site_body = $(tmpl['outlink_note_site']());
                $share_site_body.appendTo($share_body_cnt);
                if (!html_content) {
                    $share_body.find('[data-id=outlink_share_bookmark]').hide();
                } else {
                    $share_site_body.find('[data-id=outlink_share_site_note]').text(html_content);
                }
                //$share_site_body.find('[data-id=outlink_share_site_title]').text(note_info.title);
                $share_body.find('[data-id=outlink_share_site_url]').attr('href', artitle_info.note_raw_url).text(artitle_info.note_raw_url).show();

                $share_body.find('[data-id=outlink_share_site_cnt]').html('<iframe src="' + artitle_info.note_artcile_url + '" frameborder="0" scrolling="auto" width="100%" height="500px"/>');
            } else {
                $share_body_cnt.html(note_info.note_html_content);
                //需要对里面的图片宽度和高度做处理,内容定宽960，所以超过的需重置为960
                var $imgs = $share_body_cnt.find('img');
                if ($imgs.length > 0) {
                    $.each($imgs, function(i, img) {
                        img.onload = function() {
                            if(this.width > 960) {
                                img.width = 960;
                            }
                        };
                    });
                }
            }
        },

        /**
         * 文章外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_article: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body(),
                $share_body = $(tmpl['outlink_note']({
                    noteId: share_info && share_info.file_list && share_info.file_list.length > 0 && share_info.file_list[0].file_id
                }));

            $share_body.appendTo($body);

            var article_info = share_info.collection;

            $share_body.find('h1.headline').text(text.smart_cut(share_info.share_name, 40));
            var time_src_author = article_info.modify_time;

            //time_src_author += ' 作者:'+article_info.author.num_id;

            if (article_info.bid) {
                var src_arr = {
                    "1": "QQ",
                    "2": "Qzone"
                };
                time_src_author += ' 来源:' + src_arr[article_info.bid];
            }
            $share_body.find('[data-id=outlink_share_time]').text(time_src_author);

            $share_body_cnt = $share_body.find('div.content');

            $share_body_cnt.html(share_info.html_content);

            //保存和二维码
            //$(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));
            $('#ui-btn-down').hide();

            //需要对里面的图片宽度和高度做处理
            var $img = $share_body_cnt.find('img');
            if ($img[0]) {
                $.each($img, function(i, v) {
                    $(v)[0].onload = function() {
                        var new_size = util.fix_size($(v), {
                            "width": 580,
                            "height": 20000,
                            "padding": 10
                        });
                        $(v).attr('width', new_size['width']);
                        $(v).attr('height', new_size['height']);
                    };
                });
            }
        },

        /**
         * 图片外链正文内容初始化
         * @param share_info
         * @private
         */
        _render_outlink_pic: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();
            $body.removeClass('wrapper');

            $(tmpl['outlink_pic']()).appendTo($body);

            $(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));

            me._set_share_name(share_info.share_name);
            outlink.getPreviewImg();
        },

        /**
         * 危险信息显示
         * @param share_info
         * @private
         */
        _render_outlink_risk: function(share_info) {
            var html = '安全性:';
            switch (share_info.safe_type) {
                case 1:
                    html += '安全';
                    break;
                case 2:
                    html += '高风险';
                    break;
                case 3:
                    html += '中风险';
                    break;
                case 4:
                    html += '低风险';
                    break;
            }
            html += '<a href=\"web/detail_risk_web.html?' + share_info.data + '&' + outlink.share_pwd + '\" target=\"_blank\">了解详情</a>';
            $('#show_safe_type').append(html);
        },


        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_share_name: function(sharename) {
            $('#outlink_title').text(util.format_file_name(sharename));
        },
        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_file_name: function(sharename) {

            $('#outlink_share_name').text(util.format_file_name(sharename));
        },

        /**
         * 设置外链页面的名字
         * @param text
         */
        set_pwd_err_text: function(text) {
            if (!text) {
                $('#_password_cnt').removeClass('err').find('[data-id=tip]').text(text);
            } else {
                $('#_password_cnt').addClass('err').find('[data-id=tip]').text(text);
            }

        },
        /**
         * 标识验证码错误
         * @param text
         */
        set_verify_err_text: function(text) {
            if (!text) {
                $('#_verify_code_cnt').removeClass('err').find('[data-id=tip]').text(text);
            } else {
                $('#_verify_code_cnt').addClass('err').find('[data-id=tip]').text(text);
            }
        },

        set_fail_msg: function(msg, ret) {
            $('#outlink_fail_msg').text("msg:" + msg + "ret:" + ret);
        },

        /**
         * 设置下载次数
         * @param share_info
         */
        set_downloaod_times: function(share_info) {
            if (share_info.down_cnt > 0 || share_info.store_cnt > 0) {
                $("#show_download_times").text("使用次数:" + (share_info.down_cnt + share_info.store_cnt));
            }
        },
        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },
        /**
         * 事件绑定
         * @private
         */
        _initDownloadEvent: function(share_info) {

            var me = this,
                $parent,
                id,
                downloadName,
                fileInfo;
            var data = {
                share_key: share_info.share_key,
                file_list: [],
                dir_list: []
            };
            var $container = $('div.share-file-list'),
                $selected;
            $('.user-icon').mouseover(function() {
                $(this).css('cursor', 'pointer');
                return false;
            });
            $('.logo, .user-icon').click(function() {
                if(query_user.check_cookie() ) {
                    location.href = 'http://www.weiyun.com/disk/index.html';
                } else {
                    location.href = 'http://www.weiyun.com';
                }
                return false;
            });
            //点击登录
            $('#outlink_login').click(function(e) {
                outlink.to_login();
                return false;
            });
            //二维码按钮
            $('#ui-btn-qr').click(function(e) {
                $('div.full-mask').show();
                $('div.qr-code-dialog').show();
                return false;
            });
            $('.close-qr-code-dialog').click(function() {
                $('div.full-mask').hide();
                $('.qr-code-dialog').hide();
                return false;
            });
            $('.close-save-success-dialog').click(function() {
                $('div.full-mask').hide();
                $('.save-success-dialog').hide();
                return false;
            });
            //下载
            $('#ui-btn-down').on('click', function() {
                if(!query_user.check_cookie() ) {
                    $('#outlink_login').click();
                    return false;
                }
                data = {
                    share_key: share_info.share_key,
                    pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    file_list: [],
                    dir_list: []
                };
                $selected = $container.find('.ui-selected');
                if (0 == $selected.length) {
                    return;
                }
                for (var i = 0, len = $selected.length; i < len; i++) {
                    id = $($selected[i]).attr('data-record-id');
                    fileInfo = allFileInfo[id];
                    if (0 === i) {
                        downloadName = fileInfo['name'];
                        if (len > 1) {
                            downloadName += ('等' + len + '个文件');
                        }
                        data.pack_name = downloadName;
                    }
                    if ('file' == fileInfo.flag) {
                        data['file_list'].push({
                            file_id: fileInfo['file_id'],
                            pdir_key: fileInfo['pdir_key']
                        });
                    } else if ('dir' == fileInfo.flag) {
                        data['dir_list'].push({
                            dir_key: fileInfo['dir_key']
                        });
                    }
                }
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartDownload',
                    use_proxy: true,
                    pb_v2: true,
                    body: data
                }).ok(function(msg, body) {
                    me.get_$down_iframe().attr('src', body.download_url);
                }).fail(function(msg) {
                    mini_tip.error(msg || '下载失败');
                });
            });

            //保存到微云
            $('#ui-btn-save').click(function() {
                if (!query_user.check_cookie()) {
                    $('#outlink_login').click();
                    return;
                }
                data = {
                    share_key: share_info.share_key,
                    src_pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    file_list: [],
                    dir_list: []
                };
                $selected = $container.find('.ui-selected');
                if (0 == $selected.length) {
                    return;
                }
                for (var i = 0, len = $selected.length; i < len; i++) {
                    id = $($selected[i]).attr('data-record-id');
                    fileInfo = allFileInfo[id];
                    if ('file' == fileInfo.flag) {
                        data['file_list'].push({
                            file_id: fileInfo['file_id'],
                            pdir_key: fileInfo['pdir_key']
                        });
                    } else if ('dir' == fileInfo.flag) {
                        data['dir_list'].push({
                            dir_key: fileInfo['dir_key']
                        });
                    }
                }
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartSaveData',
                    use_proxy: true,
                    pb_v2: true,
                    body: data
                }).ok(function(msg, body) {
                    $('div.full-mask').show();
                    $('div.save-success-dialog').show();
                }).fail(function(msg) {
                    mini_tip.error(msg || '保存失败');
                });
                return false;
            });

        },
        /**
         * 初始化QRCODE
         * @param share_info
         */
        _init_qr_code: function(share_info) {
            //初始化二维码
            var qrcode_src = 'http://www.weiyun.com/php/phpqrcode/qrcode.php?data=http%3A%2F%2Fshare.weiyun.com/' +
                share_info.data + '&level=4&size=2';
            $('#out_link_qr_code_prew').attr('src', qrcode_src);
        },
        /**
         * 遮罩隐藏
         */
        mask_hide: function() {
            $(".full-mask").hide();
        },
        /**
         * 遮罩显示
         */
        mask_show: function() {
            $(".full-mask").show();
        },

        /**
         * 测速上报
         */
        speed_time_report: function(is_pic) {
	        //测速点上报
	        try {
		        var flag = '21254-1-18';
		        huatuo_speed.store_point(flag, 20, g_serv_taken);
		        huatuo_speed.store_point(flag, 21, g_css_time - g_start_time);
		        huatuo_speed.store_point(flag, 22, g_js_time -  g_start_time);
		        huatuo_speed.store_point(flag, 23, new Date() - g_start_time);
		        huatuo_speed.report(flag, true);
	        } catch (e) {

	        }
        },

        //显示下载的验证码框
        show_down_verifycode: function() {
            var me = this;
            //展示界面和验证码
            me.mask_show();
            me.get_$down_verifycode().show();
        },

        //关闭下载验证码框
        close_down_verifycode: function() {
            var me = this;
            me.mask_hide();
            me.get_$down_verifycode().hide();
        },

        update_down_verifycode: function() {
            this.$imgcode.attr('src', 'http://captcha.weiyun.com/getimage?aid=543009514&' + Math.random());
            this.outlink_down_verifycode.find('input').val('');
        },

        //获取下载验证码框
        get_$down_verifycode: function() {
            var me = this;
            if (me.outlink_down_verifycode) {
                me.update_down_verifycode();
                return me.outlink_down_verifycode;
            } else {
                me.outlink_down_verifycode = $(tmpl.outlink_down_verifycode()).appendTo($('body'));

                //绑定点击关闭事件
                me.outlink_down_verifycode.find('.pop-close').on('click', function(e) {
                    e.preventDefault();
                    me.close_down_verifycode();
                });

                //刷新验证码按钮事件
                var $imgcode = me.outlink_down_verifycode.find('.img-code');
                me.$imgcode = $imgcode;
                me.update_down_verifycode();
                me.outlink_down_verifycode.find('.refresh-code').on('click', function() {
                    me.update_down_verifycode();
                });

                //提交按钮&&输入框
                var $submit = me.outlink_down_verifycode.find('.submit'),
                    $input = me.outlink_down_verifycode.find('input'),
                    $errmsg = me.outlink_down_verifycode.find('.err');

                me.$down_errmsg = $errmsg;

                //绑定输入框事件
                $input.on('focus', function() {
                    $errmsg.hide();
                });
                $input.on('keyup', function() {
                    if ($.trim($input.val()).length == 4) {
                        $submit.removeClass('disabled');
                    } else {
                        $submit.addClass('disabled');
                    }
                });

                //绑定提交按钮事件
                $submit.on('click', function() {
                    var code = $.trim($input.val());
                    if (code.length == 4) {
                        outlink.down_file_by_verifycode(code);
                        me.close_down_verifycode();
                    } else {
                        $errmsg.text('请输入正确的验证码').show();
                    }
                });

                return me.outlink_down_verifycode;
            }
        },

        //提示下载的验证am出错
        show_down_verifycode_error: function() {
            var me = this;
            me.show_down_verifycode();
            me.$down_errmsg.text('验证码输入不正确，请重新输入。').show();
            me.update_down_verifycode();
        },
        //小概率事件，基本不发生
        show_down_sys_error: function() {
            alert('系统错误，请稍后再试。');
        }
    });

    return ui;
});/**
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
        File = common.get('./file.file_object'),

        math = Math,

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
            return File.get_type(_name, false);
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
                case 20003:
                    msg = '外链使用次数已用完，请联系分享者重新分享。';
                    break;
                case 114503:
                    msg = '该文件可能存在风险。';
                    break;
                default:
                    msg = '系统错误，请稍候重试。';
                    break;
            }
            return msg;
        },

        //调整图片大小
        fix_size: function ($preload_img, contains_size) {

            var img = $preload_img[0],
                img_width = img.width,
                img_height = img.height,
                img_url = img.src;

            var win_width = contains_size.width,
                win_height = contains_size.height,
                padding = contains_size.padding,
                new_img_width = math.min(img_width, win_width - padding),
                new_img_height = math.min(img_height, win_height - padding),
                limit_side, // height / width
                limit_size = '',
                size = {};

            if(img_width < win_width && img_height < new_img_height){
                return {"width": img_width, "height":img_height};
            }


            if (new_img_width === img_width && new_img_height === img_height) {
                size['width'] = img_width;
                size['height'] = img_height;
            } else {
                // 如果同时限制了高度和宽度，则只使用跟浏览器长宽比例变化大的哪一个边
                if (new_img_width < img_width && new_img_height < img_height) {
                    limit_side = 'height';
                    limit_size = new_img_height;

                    if ((img_width / new_img_width) > (img_height / new_img_height)) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }

                } else {
                    if (new_img_width < img_width) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }
                    else if (new_img_height < img_height) {
                        limit_side = 'height';
                        limit_size = new_img_height;
                    }
                }

                size[limit_side] = limit_size;
                if (limit_side === 'width') {
                    size['height'] = math.round(img_height / img_width * limit_size);
                } else {
                    size['width'] = math.round(img_width / img_height * limit_size);
                }
            }

            return size;
        },
        //文件大小由B转换为KB或MB
        switchSize: function(size) {
            var result = '',
                s;
            if(size < 1024) {
                result = size + 'B';
            } else if((s = size / 1024) && s < 1024) {
                result = Math.floor(s) + 'KB';
            } else {
                result = Math.floor(s / 1024) + 'MB';
            }
            return result;
        },
        isAllPic: function(fileList) {
            if(!$.isArray(fileList)) {
                fileList = [];
            }
            var isAllPic = true;
            for(var i = 0, len = fileList.length; i < len; i++) {
                if(!util.is_image(fileList[i].file_name) || !fileList[i].thumb_url) {//只要有一个文件不是图片即可,没有图片url也不能算全图片
                    isAllPic = false;
                    break;
                }
            }
            return isAllPic;
        }

    });

    return util;
});


//tmpl file list:
//outlink/src/outlink.allpic.tmpl.html
//outlink/src/outlink.dialog.tmpl.html
//outlink/src/outlink.fail.tmpl.html
//outlink/src/outlink.login.tmpl.html
//outlink/src/outlink.multifile.tmpl.html
//outlink/src/outlink.note.tmpl.html
//outlink/src/outlink.picture.tmpl.html
//outlink/src/outlink.risk.tmpl.html
//outlink/src/outlink.singlefile.tmpl.html
//outlink/src/outlink.singlepic.tmpl.html
//outlink/src/outlink.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'outlink_allpic': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var fileList = data || [],
            picUrl,
            img,
            name = '';
    __p.push('    <div id="lay-main-con" class="lay-main-con">\r\n\
        <div class="inner">\r\n\
            <div class="wrap">\r\n\
                <div id="photo-view" data-count="');
_p(fileList.length);
__p.push('" class="dirs photo-view share-file-list">');
for(var i = 0, len = fileList.length; i < len; i++) {
                        picUrl = fileList[i].thumb_url;
                        name = fileList[i].file_name;
                        picUrl = picUrl + (name.slice(-3) === 'gif' ? '' : '&size=640*640');
                        img = new Image();
                        img.src = 
                        __p.push('                        <div data-list="true" id="');
_p(fileList[i]['file_id']);
__p.push('" data-record-id="');
_p(fileList[i]['file_id']);
__p.push('" class="share-file photo-view-list">\r\n\
                            <a href="javascript:void(0)" class="photo-view-list-link">\r\n\
                                <img src="');
_p(picUrl);
__p.push('" onload="var width = this.width,height = this.height;if(width >= 266 && height >= 266) {if(height > width) {this.style.width = \'266px\';this.style.height = height * 266 / width + \'px\';height = height * 266 / width;width = 266;} else {this.style.height = \'266px\';this.style.width = width * 266 / height + \'px\';width = width * 266 / height;height = 266;}}this.style.margin = (266 - height) / 2 + \'px \' + (266 - width) / 2 + \'px\';"/>\r\n\
                                <span class="photo-view-list-checkbox checkbox"></span>\r\n\
                                <span class="photo-view-list-mask"></span>\r\n\
                            </a>\r\n\
                        </div>');
}__p.push('                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id=\'outlink_login_pass_access\' class="popshare-pass-access" style="margin-left: -170px; margin-top: -81px;">\r\n\
        <ul>\r\n\
            <li id="_password_cnt" class="pass">\r\n\
                <label class="infor" for="outlink_pwd">访问密码：</label>\r\n\
                <input id=\'outlink_pwd\' name="outlink_pwd" type="password">\r\n\
                <div data-id="tip" class="msg" id="outlink_login_err"></div>\r\n\
            </li>\r\n\
            <li id="_verify_code_cnt" class="code">\r\n\
                <label class="infor">验证码：</label>\r\n\
                <input id="outlink_code" type="text">\r\n\
                <div class="img">\r\n\
                    <a href="#"><img id="_verify_code_img"></a>\r\n\
                    <a href="#" id="_change_verify_code">换一张</a>\r\n\
                    <div data-id="tip" class="msg"></div>\r\n\
                </div>\r\n\
            </li>\r\n\
            <li class="btn">\r\n\
                <a class="g-btn g-btn-blue" href="#" id=\'outlink_pwd_ok\'><span class="btn-inner">确定</span></a>\r\n\
            </li>\r\n\
        </ul></div>');

return __p.join("");
},

'outlink_save_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-pop full-pop-small" style="margin-top: 0; margin-left: 0; left:1020px;top:300px;">\r\n\
        <h3 class="full-pop-header"><div class="inner">提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="popshare-box popshare-pass-manage">\r\n\
                <div class="success">\r\n\
                    <div class="msg"><i class="ico"></i>保存成功！</div>\r\n\
                    <p class="pass">保存目录：微云/QQ/收到的QQ文件</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn">\r\n\
            <a class="g-btn g-btn-gray" href="#"><span class="btn-inner">关闭</span></a>\r\n\
        </div>\r\n\
        <a href="#" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

return __p.join("");
},

'outlink_fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var msg = data.msg,
            ret = data.ret;
        var msgobj = require('./msg');

        var cls = ret == 20002 ? 'time' : ret == 20003 ? 'count' : 'err';
        var message = msgobj.get(ret);
        var mesg = typeof message === 'string' ? message : message.msg;
        var desc = typeof message === 'string' ? '' : message.desc;
	__p.push('    <div id="error_content" class="wrapper">\r\n\
\r\n\
        <div class="link-out-msg">\r\n\
            <div class="');
_p(cls);
__p.push('">\r\n\
                <i class="ico"></i>\r\n\
                <h3>');
_p(msg || mesg);
__p.push('</h3>\r\n\
                <h4>');
_p(desc);
__p.push('</h4>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
    <div id=\'outlink_fail_msg\' style="display:none">\r\n\
    </div>');

return __p.join("");
},

'outlink_login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id=\'outlink_login_pass_access\' class="popshare-pass-access" style="margin-left: -170px; margin-top: -81px;">\r\n\
        <ul>\r\n\
            <li id="_password_cnt" class="pass">\r\n\
                <label class="infor" for="outlink_pwd">访问密码：</label>\r\n\
                <input id=\'outlink_pwd\' name="outlink_pwd" type="password">\r\n\
                <div data-id="tip" class="msg" id="outlink_login_err"></div>\r\n\
            </li>\r\n\
            <li id="_verify_code_cnt" class="code">\r\n\
                <label class="infor">验证码：</label>\r\n\
                <input id="outlink_code" type="text">\r\n\
                <div class="img">\r\n\
                    <a href="#"><img id="_verify_code_img"></a>\r\n\
                    <a href="#" id="_change_verify_code">换一张</a>\r\n\
                    <div data-id="tip" class="msg"></div>\r\n\
                </div>\r\n\
            </li>\r\n\
            <li class="btn">\r\n\
                <a class="g-btn g-btn-blue" href="#" id=\'outlink_pwd_ok\'><span class="btn-inner">确定</span></a>\r\n\
            </li>\r\n\
        </ul></div>');

return __p.join("");
},

'outlink_multifile': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var shareList = data.shareList || [],
            obj = null;
    __p.push('    <div id="lay-main-con" class="lay-main-con">\r\n\
        <div class="inner">\r\n\
            <div class="wrap">\r\n\
                <!-- 列表模式样式ui-listview -->\r\n\
                <!-- 缩略图模式样式ui-thumbview -->\r\n\
                <!-- update jin 20131014 : new style height -->\r\n\
                <div id="_disk_view" class="disk-view ui-view ui-thumbview" style="overflow: auto; position: relative;">\r\n\
                    <!-- 文件列表 -->\r\n\
                    <!-- 目录 -->\r\n\
                    <div class="dirs-view" style="">\r\n\
\r\n\
                        <!-- 目录列表 -->\r\n\
                        <div id="_disk_files_dir_list" data-count="');
_p(shareList.length);
__p.push('" class="dirs share-file-list">\r\n\
                            <!-- 高级浏览器使用:hover选择器，ie6请使用鼠标悬停添加list-hover样式 -->\r\n\
                            <!-- 选中样式list-selected -->\r\n\
                            <!-- 拖入接收容器样式list-dropping -->\r\n\
                            <!-- 不可选样式list-unselected -->\r\n\
                            <!-- 不带复选框模式list-nocheckbox-->\r\n\
                            <!-- 当前列表，用于右键和单行菜单模式list-menu-on-->');
for(var i = 0, len = shareList.length; i < len; i++) {
                                obj = shareList[i];
                                __p.push('                                <div id="');
_p(obj.id);
__p.push('" data-list="true" data-record-id="');
_p(obj.id);
__p.push('" class="list-wrap share-file">\r\n\
                                    <div class="list clear">\r\n\
                                        <label class="checkbox"></label>\r\n\
                                        <span class="img">');
if(obj.isImg && obj.thumb_url){__p.push('                                            <img src="');
_p(obj.thumb_url + '&size=64*64' );
__p.push('" class="filetype icon-image default" unselectable="on" />');
}else{__p.push('                                            <i class="filetype icon-');
_p(obj['icon']);
__p.push('"></i>');
}__p.push('                                        </span>\r\n\
                                        <span class="name"><p class="text"><em>');
_p(obj['name']);
__p.push('</em></p></span>\r\n\
                                        <span class="info">');
_p(obj['text']);
__p.push('</span>\r\n\
                                    </div>\r\n\
                                </div>');
}__p.push('                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_note': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="share-file-list files-view files-view-rich">\r\n\
        <div class="header">\r\n\
            <h1 class="headline"></h1>\r\n\
            <div class="time" data-id="outlink_share_time"></div>\r\n\
        </div>\r\n\
        <div class="content ui-selected" data-record-id="');
_p(data && data.noteId);
__p.push('">\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_note_site': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="bookmark" data-id="outlink_share_bookmark">\r\n\
    <i class="ico"></i>\r\n\
    <h1 class="tit">备注:</h1>\r\n\
    <div data-id="outlink_share_site_note"></div>\r\n\
</div>\r\n\
<div class="time" style="padding-top:10px; padding: 0 5px;overflow:hidden; text-overflow:ellipsis;">源网页:<a href="http://www.51buy.com" class="link" data-id="outlink_share_site_url" target="_blank" style="display:none">查看原文</a>\r\n\
</div>\r\n\
<div class="bod" data-id="outlink_share_site_cnt" style="padding-top:40px">\r\n\
</div>');

return __p.join("");
},

'outlink_note_files': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        constants = common.get('./constants'),
        file_type_map = common.get('./file.file_type_map'),
        FileObject = common.get('./file.file_object'),

        files = data.files;

        $.each(files, function (i, file) {
            var name = file.name,
                size = file.size,
                ico = FileObject.get_ext(name);

            if(ico === null){
                ico = 'image';
            }
__p.push('                <li>\r\n\
                    <div class="fujian-li">\r\n\
                        <i class="ico-pin"></i>\r\n\
                        <div class="img"><i class="filetype icon-');
_p(ico);
__p.push('"></i></div>\r\n\
                        <div class="fujian-info">\r\n\
                            <p class="fujian-name">');
_p(name);
__p.push('</p>\r\n\
                            <p class="fujian-size">');
_p(size);
__p.push('</p>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                </li>');

        });
__p.push('');

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
                    <span id="file-icon" class="icon-normal"></span>\r\n\
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
                    <a href="javascript:void(0)" id=\'ui-btn-down\' class="g-btn g-btn-blue" tj-action="btn-adtag-tj" tj-value="51003"><span\r\n\
                            class="btn-inner">下载</span></a>\r\n\
                    <a href="javascript:void(0)" id=\'ui-btn-save\' class="g-btn g-btn-blue" tj-action="btn-adtag-tj" tj-value="51001"><span\r\n\
                            class="btn-inner">保存到微云</span></a>\r\n\
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

'outlink_singlepic': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var picUrl = data && data.thumb_url || '',
        	name = data && data.file_name;
        picUrl = picUrl + (name.slice(-3) === 'gif' ? '' : '&size=640*640');
    __p.push('    <div id="_outlink_body" class="share-file-list">\r\n\
    	<div class="link-pic">\r\n\
        	<table>\r\n\
        		<tbody>\r\n\
        			<tr>\r\n\
        				<td>\r\n\
            				<img class="ui-selected" data-record-id="');
_p(data && data.file_id);
__p.push('" id="prew_img" src="');
_p(picUrl);
__p.push('" />\r\n\
        				</td>\r\n\
    				</tr>\r\n\
				</tbody>\r\n\
			</table>\r\n\
    	</div>\r\n\
    </div>');

return __p.join("");
},

'outlink_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="lay-header clear" id=\'_outlink_header\'>\r\n\
        <a class="logo" href="javascript:void(0)" target=\'_blank\'></a>\r\n\
        <p id=\'outlink_title\' class="title"></p>\r\n\
        <a id="outlink_login"class="login" href="javascript:void(0)" style="display:none">登录</a>\r\n\
        <div class="user">\r\n\
            <div id="header-user" class="normal" style="display:none;">\r\n\
                <div class="inner">\r\n\
                    <img class="user-icon" />\r\n\
                    <i class="ico"></i>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>');
_p( this['face_menu']() );
__p.push('    </div>');

return __p.join("");
},

'outlink_download': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var data = data || {},
            headIconUrl = data.headIconUrl,
            nickname = data.nickname,
            count = data.count,
            word = data.word,
            notShowDownload = data.notShowDownload,
            notSaveToWy = data.notSaveToWy,
            isSingleFile = data.isSingleFile; 
    __p.push('    <div class="lay-main-toolbar">\r\n\
        <!-- 分享个人信息 -->\r\n\
        <div class="user-share-info">\r\n\
            <span class="avatar share-vip">\r\n\
                <img src="');
_p(headIconUrl.replace(/http:/i, '').replace(/https:/i, ''));
__p.push('">\r\n\
            </span>\r\n\
            <div class="info">');
_p(nickname);
__p.push('分享的');
_p(count);
__p.push('个');
_p(word);
__p.push('</div>\r\n\
        </div>\r\n\
        <div class="toolbar-btn clear photo-toolbar">\r\n\
            <div class="btn-message">');
if(!notShowDownload) {__p.push('                    <a class="g-btn g-btn-gray download ');
if(!isSingleFile) {__p.push('g-btn-disabled');
}__p.push('" id="ui-btn-down" href="javascript:void(0);">\r\n\
                        <span class="btn-inner ">\r\n\
                            <i class="ico ico-down"></i>\r\n\
                            <span class="text">下载</span>\r\n\
                        </span>\r\n\
                    </a>');
}__p.push('                ');
if(!notSaveToWy) {__p.push('                    <a class="g-btn g-btn-gray save-to-weiyun ');
if(!isSingleFile) {__p.push('g-btn-disabled');
}__p.push('" id="ui-btn-save" href="javascript:void(0);">\r\n\
                        <span class="btn-inner">\r\n\
                            <i class="ico ico-down-wy"></i>\r\n\
                            <span class="text">保存到微云</span>\r\n\
                        </span>\r\n\
                    </a>');
}__p.push('                <a class="g-btn g-btn-gray" id="ui-btn-qr" href="javascript:void(0);">\r\n\
                    <span class="btn-inner download-by-qr">\r\n\
                        <i class="ico ico-qr"></i>\r\n\
                        <span class="text">二维码</span>\r\n\
                    </span>\r\n\
                </a>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'outlink_breadcrumb': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="lay-main-head">\r\n\
        <div class="inner">\r\n\
            <div class="wrap">\r\n\
                <label id="checkall" class="checkall"></label>\r\n\
                <div class="main-path">\r\n\
                    <!-- 麻烦前端对面包屑的z-index进行倒序填充 -->\r\n\
                    <!-- <a style="z-index:7;" class="path more" href="#"><span>«</span></a> -->\r\n\
                    <a style="z-index:2;" class="path" href="javascript:void(0);">\r\n\
                        <span>微云分享</span>\r\n\
                    </a>');
if(data && data.dir_name) {__p.push('                        <a style="z-index:1;" class="path current" href="javascript:void(0);">\r\n\
                            <span>');
_p(data.dir_name);
__p.push('</span>\r\n\
                        </a>');
}__p.push('                    <!--a style="z-index:1;" class="path current" href="#"><span>2012web</span></a-->\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'face_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 用户信息于旧版保持一致 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user hide">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info">\r\n\
                <div class="ui-text quota-info">\r\n\
                    <label>已使用：</label>\r\n\
                    <span id="_used_space_info_text">0G</span>\r\n\
                </div>\r\n\
                <div class="ui-text quota-info">\r\n\
                    <label>总容量：</label>\r\n\
                    <span id="_total_space_info_text">0G</span>\r\n\
                </div>\r\n\
                <div class="ui-quota" title="1%">\r\n\
                    <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 1%;"></div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <li><a id="_main_client_down" href="http://www.weiyun.com/download.html?WYTAG=weiyun.share.pc" target="_blank" tabindex="-1">下载客户端</a></li>\r\n\
            <li><a id="_main_feedback" href="http://support.qq.com/discuss/715_1.shtml?WYTAG=weiyun.share.pc" target="_blank" tabindex="-1">反馈</a></li>\r\n\
            <li><a id="outlink_login_out" href="javascript:void(0)" tabindex="0">退出</a></li>\r\n\
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
    <div class="ui-mask full-mask" id="page-mask" style="display:none"></div>\r\n\
\r\n\
    <div id="saveas" data-no-selection="" class="full-pop full-pop-small hide" style="margin-top:-100px">\r\n\
        <h3 class="full-pop-header"><div class="inner _title">提示</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-alert"><div class="alert-inner">\r\n\
                <i class="ico"></i>\r\n\
                <h4 id="infoBoxTips" class="" style="color: #020202;font-size: 14px;font-weight: normal;">保存成功！<a href="http://www.weiyun.com/disk/index.html?WYTAG=weiyun.share.pc"\r\n\
                                           target="_blank">查看</a></h4>\r\n\
                <p id="infoBoxContent" class="info" title=""></p>\r\n\
            </div></div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn">\r\n\
            <a data-id="outlink_store_success_close" class="g-btn g-btn-gray" href="javascript:void(0)"><span class="btn-inner">关闭</span></a>\r\n\
        </div>\r\n\
        <a data-id="outlink_store_success_close" href="javascript:void(0)" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>\r\n\
\r\n\
    <div class="pop-tishi hide" style="left:220px;" id="saveas-note">\r\n\
        <div class="tishi-header">\r\n\
            <h1>提示</h1>\r\n\
            <a href="" class="tishi-close"></a>\r\n\
        </div>\r\n\
        <div class="tishi-cont">\r\n\
            <div class="tishi-left">\r\n\
                <h3>\r\n\
                    <span class="ico-right"></span>\r\n\
                    保存成功\r\n\
                </h3>\r\n\
                <p>请在<a href="http://www.weiyun.com/d" target="_blank">微云手机端</a>-“笔记”中查看</p>\r\n\
            </div>\r\n\
            <div class="tishi-right">\r\n\
                <img src="http://imgcache.qq.com/vipstyle/nr/box/img/qrcode-big.png" alt="扫描安装微云手机端" width="64" height="64">\r\n\
                <p>扫描安装微云手机端</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'outlink_down_verifycode': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="pop-box poplink-code full-pop full-pop-small" close-box="true" style="display:none;">\r\n\
    <h3 class="full-pop-header"><div class="inner _title">请输入验证码</div></h3>\r\n\
    <div class="full-pop-content pop-main">\r\n\
        <div class="tit">验证码：</div>\r\n\
        <ul class="con">\r\n\
            <li class="in">\r\n\
                <input type="text" value="" /><!-- ie6 .focus -->\r\n\
            </li>\r\n\
            <li class="err" style="display:none;">验证码输入错误，请重新输入</li>\r\n\
            <li class="code">\r\n\
                <img class="img-code" />\r\n\
                <a href="#" class="refresh-code">换一张</a>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>\r\n\
    <div class="full-pop-btn">\r\n\
        <a class="submit g-btn g-btn-blue" href="#"><span class="btn-inner">确定</span></a>\r\n\
    </div>\r\n\
    <a href="javascript:void(0);" class="full-pop-close pop-close" close-btn="true" title="关闭">x</a>\r\n\
</div>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
