//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/common/common.r140121",["lib","$","i18n"],function(require,exports,module){

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
//common/src/Simple_module.js
//common/src/cgi_ret_report.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/ops.js
//common/src/constants.js
//common/src/dataview/Box_selection_plugin.js
//common/src/dataview/Multi_selection_plugin.js
//common/src/file/file_object.js
//common/src/file/file_type_map.js
//common/src/file/parse_file.js
//common/src/filter/session_filter.js
//common/src/global/global_event.js
//common/src/global/global_function.js
//common/src/global/global_variable.js
//common/src/init/click_tj.js
//common/src/init/default_global_events.js
//common/src/init/enable_repaint.js
//common/src/init/fix_ie6.js
//common/src/init/init.js
//common/src/init/prevent_error.js
//common/src/init/prevent_events.js
//common/src/m_speed.js
//common/src/module.js
//common/src/query_user.js
//common/src/remote_config.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/ui/Editor.js
//common/src/ui/SelectBox.js
//common/src/ui/center.js
//common/src/ui/context_menu.js
//common/src/ui/ie_click_hacker.js
//common/src/ui/mini_tip.js
//common/src/ui/paging_helper.js
//common/src/ui/pop_panel.js
//common/src/ui/progress.js
//common/src/ui/scroller.js
//common/src/ui/toolbar/button.js
//common/src/ui/toolbar/button_group.js
//common/src/ui/toolbar/toolbar.js
//common/src/ui/widgets.js
//common/src/urls.js
//common/src/user_log.js
//common/src/util/Copy.js
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/get_total_space_size.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_tip.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html

//js file list:
//common/src/Simple_module.js
//common/src/cgi_ret_report.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/ops.js
//common/src/constants.js
//common/src/dataview/Box_selection_plugin.js
//common/src/dataview/Multi_selection_plugin.js
//common/src/file/file_object.js
//common/src/file/file_type_map.js
//common/src/file/parse_file.js
//common/src/filter/session_filter.js
//common/src/global/global_event.js
//common/src/global/global_function.js
//common/src/global/global_variable.js
//common/src/init/click_tj.js
//common/src/init/default_global_events.js
//common/src/init/enable_repaint.js
//common/src/init/fix_ie6.js
//common/src/init/init.js
//common/src/init/prevent_error.js
//common/src/init/prevent_events.js
//common/src/m_speed.js
//common/src/module.js
//common/src/query_user.js
//common/src/remote_config.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/ui/Editor.js
//common/src/ui/SelectBox.js
//common/src/ui/center.js
//common/src/ui/context_menu.js
//common/src/ui/ie_click_hacker.js
//common/src/ui/mini_tip.js
//common/src/ui/paging_helper.js
//common/src/ui/pop_panel.js
//common/src/ui/progress.js
//common/src/ui/scroller.js
//common/src/ui/toolbar/button.js
//common/src/ui/toolbar/button_group.js
//common/src/ui/toolbar/toolbar.js
//common/src/ui/widgets.js
//common/src/urls.js
//common/src/user_log.js
//common/src/util/Copy.js
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/get_total_space_size.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
/**
 * 简化接口的模块类，兼容原有的common/module。
 * @author cluezhang
 * @date 2013-11-04
 */
define.pack("./Simple_module",["lib","./query_user","./module","./global.global_event","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        query_user = require('./query_user'),
        
        OldModule = require('./module'),
        global_event = require('./global.global_event'),
        
        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };
    
    var Module = inherit(Event, {
        active : false,
        logined : false,
        constructor : function(cfg){
            $.extend(this, cfg);
            var store = new Store();
            this._singletons = {};
            // 用户未登录时，不触发active
            var me = this;
            query_user.on_ready(function(){
                me.logined = true;
                me.refresh_active_state();
            });
        },
        get_singleton : function(name){
            var singletons = this._singletons,
                o = null, fn_name;
            if(singletons.hasOwnProperty(name)){
                o = singletons[name];
            }else{
                fn_name = 'create_'+name;
                if(typeof this[fn_name] === 'function'){
                    o = singletons[name] = this['create_'+name]();
                }
            }
            return o;
        },
        refresh_active_state : function(){
            var active = this.module_active && this.logined;
            this[active ? 'activate' : 'deactivate']();
        },
        module_toggle : function(module_active){
            this.module_active = module_active;
            this.refresh_active_state();
        },
        activate : function(){
            if(!this.active){
                this.active = true;
                this.on_activate();
                this.trigger('activate');
            }
        },
        // 供子类扩展，模块激活时调用
        on_activate : $.noop,
        deactivate : function(){
            if(this.active){
                this.active = false;
                this.on_deactivate();
                this.trigger('deactivate');
            }
        },
        // 供子类扩展，模块激活时调用
        on_deactivate : $.noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_module_adapter : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function($header, $body){
                        // 自行管理
                    },
                    activate : function(){
                        me.module_toggle(true);
                    },
                    deactivate : function(){
                        me.module_toggle(false);
                    },
                    // 可以从old_module_adapter获取simple_module
                    get_simple_module : function(){
                        return me;
                    },
                    // 兼容旧接口
                    get_ext_module : function(){
                        return me;
                    }
                });
            }
            return module;
        }
    });
    // 兼容旧接口
    Module.prototype.get_common_module = Module.prototype.get_module_adapter;
    return Module;
});/**
 * 返回码上报
 * @author jameszuo
 * @date 13-4-25
 */
define.pack("./cgi_ret_report",["lib","./constants","$","./urls","./query_user"],function (require, exports, module) {
    var lib = require('lib'),
        constants = require('./constants'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        image_loader = lib.get('./image_loader'),

        urls = require('./urls'),

        type_ok = 1,  // 成功
        type_err = 2,// 失败
        type_logic_err = 3, // 逻辑失败
        ret_rate = 1,// 采样率

        report_cgi = 'http://c.isdspeed.qq.com/code.cgi',

    // 表示成功的返回码(type=1)
        ok_rets = {
            0: 1
        },

    // 表示逻辑错误的返回码(type=3) // james 20130527: 逻辑错误作为成功来处理(type=1)
        logic_error_rets = {
            1010: 1, //对应目录列表查询请求,说明客户端不需要刷新该目录下的本地缓存列表
            1016: 1, //存储平台不存在该用户
            1018: 1, //要拉取的目录列表已经是最新的
            1019: 1, //目录不存在
            1020: 1, //文件不存在
            1021: 1, //目录已经存在
            1022: 1, //文件已传完
            1024: 1, //验证clientkey失败
            1026: 1, //父目录不存在
            1027: 1, //不允许在根目录下上传文件
            1028: 1, //目录或者文件数超过总限制
            1029: 1, //单个文件大小超限
            1030: 1, //签名已经超时，客户端需要重新验证独立密码
            1031: 1, //验证独立密码失败
            1032: 1, //开通独立密码失败
            1033: 1, //删除独立密码失败
            1034: 1, //失败次数过多,独立密码被锁定
            1035: 1, //添加的独立密码和QQ密码相同
            1051: 1, //当前目录下已经存在同名的文件
            1052: 1, //下载未完成上传的文件
            1053: 1, //当前上传的文件超过可用空间大小
            1054: 1, //不允许删除系统目录
            1055: 1, //不允许移动系统目录
            1056: 1, //该文件不可移动
            1057: 1, //续传时源文件已经发生改变
            1058: 1, //删除文件版本冲突
            1059: 1, //覆盖文件版本冲突，本地文件版本过低，请先同步服务器版本
            1060: 1, //禁止查询根目录
            1061: 1, //禁止修改根目录属性
            1062: 1, //禁止删除根目录
            1063: 1, //禁止删除非空目录
            1064: 1, //禁止拷贝未上传完成文件
            1065: 1, //不允许修改系统目录
            1070: 1,
            1073: 1, //外链失效，下载次数已超过限制
            1074: 1, //黑名单校验失败,其它原因
            1075: 1, //黑名单校验失败，没有找到sha
            1076: 1, //非法文件，文件在黑名单中
            1083: 1, //目录或者文件数超单个目录限制
            1088: 1, //文件名目录名无效
            1091: 1, //转存的文件未完成上传
            1092: 1, //转存的文件名无效编码
            1095: 1, //转存文件已过期
            1105: 1, //独立密码已经存在
            1106: 1, //修改密码失败
            1107: 1, //新老密码一样
            1111: 1, //源、目的目录相同目录，不能移动文件
            1112: 1, //不允许文件或目录移动到根目录下
            1113: 1, //不允许文件复制到根目录下
            1116: 1, //不允许用户在根目录下创建目录
            1119: 1, //目的父目录不存在
            1120: 1, //目的父父目录不存在
            1117: 1, //批量下载中某个目录或文件不存在
            3002: 1,
            3008: 1,
            100028: 1,
            100029: 1,
            190041: 1, // 会话超时
            10603: 1 // 压缩包正在下载中
        },

    // 除了表示成功的返回码，和表示逻辑错误的返回码，其他的返回码均认为是失败(type=2)
    // err_rets = { /* ALL */ },

        set_timeout = setTimeout,

        undefined;

    var cgi_ret_report = {

        /**
         * 上报
         * @param {string} cgi_url cgi url
         * @param {string} cmd 命令字，为空即不传
         * @param {number} ret CGI返回码
         * @param {number} time 耗时(ms)
         */
        report: function (cgi_url, cmd, ret, time) {
            if (!cgi_url) {
                return;
            }

            set_timeout(function () {
                var url = url_parser.parse(cgi_url),
                    cgi_name = url.pathname.replace(/^\//, ''); //   /wy_web_jsonp.fcg -> wy_web_jsonp.fcg


                var result_type;
                if (ret in ok_rets) {
                    result_type = type_ok; // 1
                } else if (ret in logic_error_rets) {
//                    result_type = type_logic_err; // 3

                    // james 20130527: 逻辑错误作为成功来处理(type=1)
                    result_type = type_ok;
                } else {
                    result_type = type_err; // 2
                }


                image_loader.load(urls.make_url(report_cgi, {
                    uin : require('./query_user').get_uin_num() || undefined,
                    domain: url.host,
                    cgi: cgi_name + (cmd ? '?cmd=' + cmd : ''), // cgi=wy_web_jsonp.fcg?cmd=query_user， cgi=wy_web_jsonp.fcg
                    type: result_type,
                    code: ret,
                    time: time,
                    rate: ret_rate
                }));
            }, 500);
        }
    };

    return cgi_ret_report;
});/**
 * aid配置表
 * @author jackbinwu
 * @date 13-5-7
 */
define.pack("./configs.aid",[],function (require, exports, module) {
    return {
        WEIYUN_WEBAPP_DISK_HELP : 'weiyun.webapp.disk.help',
        WEBAPP_DISK_GUANWANG : 'webapp.disk.guanwang',
        WEIYUN_WEBAPP_DISK_FANKUI : 'weiyun.webapp.disk.fankui',
        WEBAPP_DISK_PHOTO : 'webapp.disk.photo',
        APPBOX_DISK_PHOTO : 'appbox.disk.photo',
        WEIYUN_APPBOX_DISK_FANKUI : 'weiyun.appbox.disk.fankui',
        WEIYUN_WEBAPP_DISK_LIJIANZHUANG : 'weiyun.webapp.disk.lijianzhuang',
        WEBAPP_DISK_LOGO : 'webapp.disk.logo',
        APPBOX_DISK_LOGO : 'appbox.disk.logo',
        WEIYUN_APP_WEB_LOGIN : 'weiyun.app.web.login',
        WEIYUN_APP_WEB_DISK : 'weiyun.app.web.disk',
        WEIYUN_APP_WEB_PHOTO : 'weiyun.app.web.photo',
        WEIYUN_APP_APPBOX : 'weiyun.app.appbox'
    };
});/**
 * 点击流统计配置表
 * @author jackbinwu
 * @date 13-5-7
 */
define.pack("./configs.click_tj",["lib","./configs.ops"],function (require, exports, module) {

    var
        lib = require('lib'),


        console = lib.get('./console').namespace('click_tj'),
        ops = require('./configs.ops');

    return {
        /**
         * 为需要点击统计的元素生成 HTML 属性名和属性值，包含这些属性的元素在点击时会自动统计
         * @param {String} op_name 参考 user_log 中的 click_ops
         * @returns {string}
         */
        make_tj_str: function (op_name) {
            var op_cfg = ops.get_op_config(op_name);
            if (op_cfg) {
                return 'data-tj-action="btn-adtag-tj" data-tj-value="' + op_cfg.op + '"';
            } else {
                return '';
            }
        },

        with_$el: function ($el, op_name) {
            var op_cfg = ops.get_op_config(op_name);
            if (op_cfg) {
                $el.attr('data-tj-action', 'btn-adtag-tj').attr('data-tj-value', op_cfg.op);
            }
        }
    };
});/**
 * 命令字与OZ操作码映射表
 * @author jameszuo
 * @date 13-3-29
 */
define.pack("./configs.ops",["lib"],function (require, exports, module) {

    var
        lib = require('lib'),

        console = lib.get('./console'),

    // request请求统计配置
        request_ops = {
            // ---- 基础功能 -----------------------------
            // 查用户
            query_user: { m_speed_flags: '7830-4-2-3' },
            // 验证独立密码
            pwd_vry: { oz_op: 9121, m_speed_flags: '7830-4-2-4' },


            // ---- 网盘 ---------------------------------
            // 拉取网盘文件列表
            get_dir_list: { m_speed_flags: '7830-4-1-1' },
            // 外链分享
            create_linker: { oz_op: 9032, m_speed_flags: '7830-4-1-5' },
            // 重命名
            dir_attr_mod: { oz_op: 9015, m_speed_flags: '7830-4-1-6' },
            file_attr_mod: { oz_op: 9015, m_speed_flags: '7830-4-1-6' },
            // 新建文件夹
            dir_create: { oz_op: 9014, m_speed_flags: '7830-4-1-7' },
            // 文件移动
            batch_folder_move: { m_speed_flags: '7830-4-1-8' },
            batch_file_move: { m_speed_flags: '7830-4-1-8' },
            // 文件删除
            batch_folder_delete: { m_speed_flags: '7830-4-1-9' },
            batch_file_delete: { m_speed_flags: '7830-4-1-9' },
            // 外链分享
            add_share: { m_speed_flags: '7830-4-1-11' },
            // 请求上传
            file_upload: { m_speed_flags: '7830-4-1-12' },

            // ---- 回收站 ---------------------------------
            // 拉取回收站文件列表
            recycle_query_list: { oz_op: 9118, m_speed_flags: '7830-4-3-1' },
            // 清空回收站
            recycle_clear: { oz_op: 9120, m_speed_flags: '7830-4-3-4' },
            // 回收站还原文件
            recycle_batch_undel_folder: { m_speed_flags: '7830-4-3-5' },
            recycle_batch_undel_file: { m_speed_flags: '7830-4-3-5' },

            // ---------------- 分享的链接 -------------------------
            //拉取分享的链接文件列表
            get_share_list: { m_speed_flags: '7830-4-6-3' },
            //取消链接分享
            cancel_share: { m_speed_flags: '7830-4-6-4' },
            //取消全部链接分享
            clear_share: { m_speed_flags: '7830-4-6-5' }
        },

    // 点击流统计
        click_ops = {

            /************ 导航区（50000-50999）*******************/
            INDEP_PWD: [50002, '导航-独立密码'],
            LOGIN_OUT: [50006, '导航-退出'],
            HEADER_HELP: [50001, '导航-帮助'],
            HEADER_FANKUI: [50003, '导航-反馈'],
            HEADER_GUANWANG: [50004, '导航-官网'],
            NAV_DISK: [50201, '导航-网盘'],
            NAV_RECYCLE: [50202, '导航-回收站'],
            NAV_PHOTO: [50205, '导航-相册'],
            NAV_RECENT: [50203, '导航-最近文件'],
            NAV_SHARE: [50206, '导航-外链管理'],
            NAV_DOC: [50208, '导航-文档'],
            NAV_VIDEO: [50209, '导航-视频'],
            NAV_AUDIO: [50210, '导航-音频'],
            NAV_OFFLINE: [50211, '导航-离线文件'],
            NAV_DISK_REFRESH: [50221, '网盘-工具条-刷新'],
            NAV_SHARE_REFRESH: [50222, '导航-外链管理-刷新'],
            NAV_RECENT_REFRESH: [50204, '最近文件-刷新'],
            NAV_DOC_REFRESH: [50224, '文档-刷新'],
            NAV_VIDEO_REFRESH: [50226, '视频-刷新'],
            NAV_AUDIO_REFRESH: [50226, '音频-刷新'],
            NAV_ALBUM: [50207, '导航-图片'],
            NAV_ALBUM_REFRESH: [50223, '图片-刷新'],

            /************ 头像 *******************/
            HEADER_USER_FACE_HOVER: [50100, '头像菜单-鼠标移动至头像'],
            HEADER_USER_FACE_DOWNLOAD_CLIENT: [50101, '头像菜单-下载客户端'],
            HEADER_USER_FACE_FEEDBACK: [50003, '头像菜单-反馈'],


            /************ 工具条（52100-52199）*******************/
            TOOLBAR_UPLOAD: [52101, '网盘-工具条-上传按钮'],
            TOOLBAR_DOWNLOAD: [52102, '网盘-工具条-下载'],
            TOOLBAR_DOWNLOAD_BACK: [52103, '网盘-工具条-下载-返回'],
            TOOLBAR_DOWNLOAD_OK: [52104, '网盘-工具条-下载-确定下载'],
            TOOLBAR_MANAGE: [52105, '网盘-工具条-管理'],
            TOOLBAR_MANAGE_MOVE: [52106, '网盘-工具条-管理-移动'],
            TOOLBAR_MANAGE_MOVE_BACK: [52107, '网盘-工具条-管理-移动-返回'],
            TOOLBAR_MANAGE_MOVE_OK: [52108, '网盘-工具条-管理-移动-点击移动'],
            TOOLBAR_MANAGE_MOVE_EXPAND_DIR: [52109, '网盘-工具条-管理-移动-展开目录'],
            TOOLBAR_MANAGE_DELETE: [52110, '网盘-工具条-管理-删除'],
            TOOLBAR_MANAGE_DELETE_BACK: [52111, '网盘-工具条-管理-删除-返回'],
            TOOLBAR_MANAGE_DELETE_OK: [52112, '网盘-工具条-管理-删除-确定删除'],
            TOOLBAR_MANAGE_MKDIR: [52113, '网盘-工具条-管理-新建文件夹'],
            TOOLBAR_RECYCLE: [52114, '网盘-工具条-回收站'],
            TOOLBAR_RECYCLE_BACK: [52115, '网盘-工具条-回收站-返回'],
            TOOLBAR_RECYCLE_RESTORE: [57251, '网盘-工具条-回收站-还原'],
            TOOLBAR_RECYCLE_CLEAR: [57252, '网盘-工具条-回收站-清空回收站'],


            /************ 面包屑区域（52200-52299）**************/
            DISK_BREAD_DIR: [52201, '网盘-面包屑-点击其他目录'],
            DISK_BREAD_WEIYUN: [52202, '网盘-面包屑-点击“微云”'],
            SWITCH_AZLIST_MODE: [52203, '网盘-查看模式-按a-z排序'],
            SWITCH_NEWESTLIST_MODE: [52204, '网盘-查看模式-按时间排序'],
            SWITCH_NEWTHUMB_MODE: [52205, '网盘-查看模式-按缩略图'],

            /************ item 区（52300-52399）**************/
            ITEM_SHARE: [52300, '网盘-item-分享'],
            ITEM_RENAME: [52303, '网盘-item-文件夹重命名'],
            ITEM_DELETE: [52304, '网盘-item-删除（按钮）'],
            ITEM_MOVE: [52320, '网盘-item-移动按钮'],
            ITEM_DOWNLOAD: [52307, '网盘-item-下载（按钮）'],
            FILE_MENU_MORE: [52308, '网盘-item-更多'],
            MORE_MENU_LINK_SHARE: [52309, '网盘-item-更多-链接分享'],
            MORE_MENU_DELETE: [52310, '网盘-item-更多-删除'],
            MORE_MENU_MAIL_SHARE: [52311, '网盘-item-更多-邮件分享'],
            MORE_MENU_RENAME: [52312, '网盘-item-更多-重命名'],
            DISK_DRAG_RELEASE: [52313, '拖拽item后放手'],
            DISK_DRAG_DIR: [52314, '拖拽item到其他目录'],
            DISK_DRAG_BREAD: [52315, '拖拽item到面包屑'],
            DISK_DRAG_TO_TREE: [52316, '拖拽item到树'],

            /************ 右键（52400-52499）**************/
            RIGHTKEY_MENU: [52401, '网盘-右键-呼出右键'],
            RIGHTKEY_MENU_DOWNLOAD: [52402, '网盘-右键-下载'],
            RIGHTKEY_MENU_MAIL_SHARE: [52403, '网盘-右键-邮件分享'],
            RIGHTKEY_MENU_LINK_SHARE: [52404, '网盘-右键-链接分享'],
            RIGHTKEY_MENU_MOVE: [52405, '网盘-右键-移动'],
            RIGHTKEY_MENU_RENAME: [52406, '网盘-右键-重命名'],
            RIGHTKEY_MENU_DELETE: [52407, '网盘-右键-删除'],
            RIGHTKEY_MENU_SHARE: [52408, '网盘-右键-分享'],


            /************ 上传下载框（52500-52599）**************/
            DISK_PLUGIN_INSTALL: [52501, '网盘-控件-“立即安装”'],
            DISK_PLUGIN_REINSTALL: [52502, '网盘-控件-重新安装'],
            DISK_PLUGIN_INSTALLED: [52503, '网盘-控件-点击“完成”'],
            DISK_UPLOAD_DONE: [52504, '网盘-上传-点击完成'],
            DISK_UPLOAD_SLIDE_UP: [52505, '网盘-上传-点击收起'],
            DISK_UPLOAD_PAUSE: [52506, '网盘-上传-点击暂停'],
            DISK_UPLOAD_CANCEL: [52507, '网盘-上传-点击取消(完全未上传)'],
            DISK_UPLOAD_CONTIUNE: [52508, '网盘-上传-点击续传'],
            DISK_UPLOAD_RESUME_CONTIUNE: [52514, '网盘-上传-断点续传'],
            DISK_UPLOAD_HAS_DATA_CANCEL: [52509, '网盘-上传-点击取消(有上传)'],
            UPLOAD_DOWN_BAR_CLOSE: [52510, '网盘-下载-关闭APPBOX下载条'],
            UPLOAD_DOWN_BAR_OPEN_DIR: [52511, '网盘-下载-点开APPBOX下载条的文件（打开文件所在目录）'],
            DISK_DRAG_UPLOAD: [52512, '拖拽上传'],
            DISK_DRAG_DOWNLOAD: [52513, '拖拽下载'],


            /************ 其他区（52600-52699）*******************/
            VRY_INDEP_PWD: [50401, '网盘 -输入并验证独立密码'],
            TO_TOP: [52602, '回到顶部'],
            BOX_SELECTION: [52603, '框选'],

            /************ 最近文件*********************************/
            RECENT_DOWNLOAD_BTN: [57001, '最近文件-下载按钮'],
            RECENT_CLICK_ITEM: [57002, '最近文件-item整条点击'],
            RECENT_LOAD_MORE: [57003, '最近文件-加载更多'],

            /************ 图片预览 ********************************/
            IMAGE_PREVIEW_DOWNLOAD: [52610, '图片预览 - 下载'],
            IMAGE_PREVIEW_REMOVE: [52611, '图片预览 - 删除'],
            IMAGE_PREVIEW_RAW: [52612, '图片预览-查看原图'],
            IMAGE_PREVIEW_NAV_PREV: [52613, '图片预览-左翻页'],
            IMAGE_PREVIEW_NAV_NEXT: [52614, '图片预览-右翻页'],
            IMAGE_PREVIEW_CLOSE: [52615, '图片预览-关闭'],

            /************ 压缩包预览*******************************/
            COMPRESS_DOWNLOAD: [52701, '下载压缩包内文件'],
            COMPRESS_PREV: [52702, '返回上一级'],
            COMPRESS_ENTER: [52703, '进入目录'],
            COMPRESS_CLOSE: [52704, '关闭'],

            /************ 点击item ********************************/
            ITEM_CLICK_DOWNLOAD: [52390, '网盘-item-点击item整条-下载'],
            ITEM_CLICK_DOC_PREVIEW: [52391, '网盘-item-点击item整条-预览文档'],
            ITEM_CLICK_IMAGE_PREVIEW: [52393, '网盘-item-点击item整条-预览图片'],
            ITEM_CLICK_ZIP_PREVIEW: [52392, '网盘-item-点击item整条-预览压缩包'],
            ITEM_CLICK_LIST_CHECKBOX: [52330, '网盘-item-checkbox-列表'],
            ITEM_CLICK_THUMB_CHECKBOX: [52331, '网盘-item-checkbox-缩略图'],

            ITEM_CLICK_ENTER_DIR: [52394, '网盘-item-点击item整条-打开文件夹'],


            /****************** 上传管理 *************************/
            UPLOAD_SELECT_FILE: [52530, '上传主按钮'],
            UPLOAD_SELECT_PATH_CLOSE: [52540, '新上传-关闭位置选择框'],
            UPLOAD_SELECT_PATH_MODIFY: [52541, '新上传-“修改”文字链接'],
            UPLOAD_SELECT_PATH_OK: [52542, '新上传-选择指定目录'],
            UPLOAD_SUBMIT_BTN_NORMAL: [52543, '新上传-“普通上传”按钮'],
            UPLOAD_INSTALL_BTN_PLUGIN: [52544, '新上传-“极速上传”按钮-触发安装'],
            UPLOAD_SUBMIT_BTN_PLUGIN: [52805, '极速上传点击-位置选择框'],
            UPLOAD_FILE_MANAGER_OPEN: [52545, '新上传-展开任务管理器'],
            UPLOAD_FILE_MANAGER_CLOSE: [52546, '新上传-收起任务管理器'],
            UPLOAD_FILE_MANAGER_DONE: [52547, '新上传-任务管理器-“完成”按钮'],
            UPLOAD_FILE_MANAGER_CANCEL: [52548, '新上传-任务管理器-“全部取消/取消”按钮'],
            UPLOAD_FILE_MANAGER_PAUSE: [52549, '新上传-任务管理器-“暂停”按钮'],
            UPLOAD_FILE_MANAGER_RESUME: [52550, '新上传-任务管理器-“续传”按钮'],
            UPLOAD_FILE_MANAGER_CONTINUE: [52551, '新上传-任务管理器-“重试”按钮'],
            UPLOAD_FILE_MANAGER_INSTALL: [52553, '新上传-任务管理器-出错提示安装控件'],
            UPLOAD_FILE_MANAGER_OVER_LIMIT: [52554, '新上传-单文件超过限制-”关闭“按钮'],
            UPLOAD_FILE_OVER_LIMIT_CLOSE: [52554, '新上传-单文件超过限制-”关闭“按钮'],
            UPLOAD_FILE_OVER_LIMIT_INSTALL: [52555, '新上传-单文件超过限制-”安装控件“按钮'],
            UPLOAD_FILE_MANAGER_ALL_RETRY: [52556, '新上传-上传失败-”全部重试“按钮'],
            UPLOAD_BY_DRAG: [52640, '拖拽上传'],
            UPLOAD_UPLOAD_4G_FILE: [52534, '上传-上传文件夹-超大文件'],
            UPLOAD_UPLOAD_4G_RESUME_UPLOAD: [52540, '上传-跨登录续传-继续上传'],
            UPLOAD_UPLOAD_4G_TIPS_CONTINUE_IN: [52550, '上传-4G以内框-“继续上传”'],
            UPLOAD_UPLOAD_4G_TIPS_RESELECT: [52551, '上传-4G以内框-“重新选择”'],
            UPLOAD_UPLOAD_4G_TIPS_CONTINUE_OUT: [52552, '上传-4G以外框-“继续上传”'],
            UPLOAD_UPLOAD_4G_PLUGIN_INSTALL: [52830, '控件引导-4G以上-升级控件'],

            DOWNLOAD_FILE_MANAGER_PAUSE : [52557, '下载-暂停'], 

            /****************** 网盘新工具条 *************************/
            DISK_TBAR_ALL_CHECK: [52130, '网盘-工具条-全选'],
            DISK_TBAR_DOWN: [52131, '网盘-工具条-下载'],
            DISK_TBAR_LINK_SHARE: [52132, '网盘-工具条-链接分享'],
            DISK_TBAR_MAIL_SHARE: [52133, '网盘-工具条-邮件分享'],
            DISK_TBAR_DEL: [52134, '网盘-工具条-删除'],
            DISK_TBAR_MOVE: [52135, '网盘-工具条-移动'],
            DISK_TBAR_RENAME: [52136, '网盘-工具条-重命名'],
            DISK_TBAR_SHARE:[52137, '网盘-工具条-分享'],
            /******************* 上传控件安装 **********************/
            PLUGIN_TIPS_INSTALL: [52800, 'tips引导安装控件按钮'],
            //PLUGIN_JISU_INSTALL                  : [52805, '极速上传点击'],
            PLUGIN_POP_PANEL_INSTALL: [52811, '功能性弹窗-“安装控件”'],
            PLUGIN_FLASH_LIMIT_INSTALL: [52814, '上传任务中-flash限制-“安装控件”'],
            PLUGIN_ONLINE_ENTER: [52815, '在线安装页面-进入'],
            PLUGIN_ONLINE_REINSTALL: [52816, '在线安装页面-重新下载/安装'],
            PLUGIN_DOWNLOAD_ENTER: [52818, '下载安装页面-进入'],
            PLUGIN_DOWNLOAD_REINSTALL: [52819, '下载安装页面-重新下载/安装'],

            PLUGIN_ONLINE_SUCCESS: [52802, '在线安装页面-成功'],
            PLUGIN_DOWNLOAD_SUCCESS: [52803, '下载安装页面-成功'],

            PLUGIN_POP_PANEL_SUCCESS: [52820, '触发安装后弹窗-已安装成功'],
            PLUGIN_POP_PANEL_REINSTALL: [52821, '触发安装后弹窗-重新安装'],
            PLUGIN_POP_PANEL_FAIL_REINSTALL: [52822, '触发安装后弹窗-控件未安装成功-重新安装'],

            UPLOAD_UPLOAD_FILE: [52531, '上传-上传文件'],
            UPLOAD_UPLOAD_DIR: [52532, '上传-上传文件夹'],
            UPLOAD_UPLOAD_DIR_NO_PLUGIN: [52533, '上传-上传文件夹-未安装控件'],

            UPLOAD_SELECT_FOLDER_NO_FOLDER: [52560, '新上传-选择文件夹-包含子目录'],
            UPLOAD_SELECT_FOLDER_HAS_FOLDER: [52561, '新上传-选择文件夹-不包含子目录'],
            UPLOAD_FOLDER_ERROR_HOVER: [52562, '新上传-选择文件夹-出错时hove详情'],

            /******************  Appbox添加微云到主面板引导页 *************************/
            ADD_WY_TO_APPBOX: [69002, '添加微云到主面板引导页'],      //   利用subop 1 现在添加 2已完成 3暂不添加 4重新添加 5 以后添加 6 确定  7 关闭按钮
            APPBOX_USER_ENV: [69020, '登录appbox的用户环境'],

            /******************  外链管理 *************************/
            SHARE_TBAR_CANCEL: [57400, '工具条-取消按钮'],
            SHARE_SELECT_ALL: [57410, '全选'],
            SHARE_HOVERBAR_VISIT: [57420, 'hoverBar-查看链接分享'],
            SHARE_HOVERBAR_COPY: [57421, 'hoverBar-复制链接'],
            SHARE_HOVERBAR_PWD_CHANGE: [57422, 'hoverBar-修改密码'],
            SHARE_HOVERBAR_PWD_CREATE: [57423, 'hoverBar-创建密码'],
            SHARE_HOVERBAR_CANCEL: [57424, 'hoverBar-取消分享'],
            SHARE_ITEM_CLICK: [57500, '外链Item-点击-点击链接查看链接分享'],
            SHARE_ITEM_COPY: [57501, '外链Item-点击展开-复制按钮'],

            SHARE_LINK_TAB: [58002, '外链分享界面-链接分享页面'],
            SHARE_MAIL_TAB: [58003, '外链分享界面-邮件分享页面'],
            CANCEL_SHARE_PWD: [57505, '分享弹窗-取消加密'],
            ADD_SHARE_PWD: [57506, '分享弹窗-给分享链接加密'],
            SHARE_MGR_DELETE_CHECKBOX: [57510, '外链密码管理界面-删除密码'],
            SHARE_MGR_CHANGE_CHECKBOX: [57511, '外链密码管理界面-修改密码'],
            SHARE_CREATE_COPY_BUTTON:[58012,'链接分享的复制按钮'],
            MAIL_SHARE_SEND_BUTTON:[58013,'邮件分享的发送按钮'],
            SHARE_CREATE_CHANGE_PWD:[57507,'文件分享界面的修改密码'],
            SHARE_MGR_PWD_OK_CREATE:[57512,'密码管理界面-确定创建密码'],
            
            /******************* 搜索 **********************/
            SEARCH_CANCEL : [50501, '页面头部搜索框-点击清空'],
            SEARCH_LIST_CLICK : [50510, '搜索item-点击'],
            SEARCH_LIST_DOWNLOAD : [50511, '搜索item-点击下载'],
            SEARCH_LIST_DELETE : [50512, '搜索item-点击删除'],
            SEARCH_LIST_SHARE : [50513, '搜索item-点击分享'],
            SEARCH_LIST_OPEN_FOLDER : [50514, '搜索item-点击打开所属目录'],
            SEARCH_LIST_CONTEXT_MENU : [50515, '搜索item-右键-弹出菜单'],

            // ==== 手动统计（如文档预览的加载时间等） ==========================================
            active_plugin: [9136, 'Acive控件上传'],
            webkit_plugin: [9136, 'Webkit控件上传'],
            upload_flash: [9137, 'flash上传'],
            upload_form: [9138, '表单上传'],
            upload_from_QQClient: [20003, 'qq传文件上传到微云'],
            view_from_QQClient: [20005, 'qq传完文件后，点击“到微云中查看”'],
            download_hijack_check: [405, '下载劫持侦测'],
            webkit_donwload: [515, 'Webkit下载'],
            /****************头部链接广告*********************/
            header_ad_link_web: [69000, 'web头部链接广告'],
            header_ad_link_appbox: [69001, 'appbox头部链接广告'],
            /***************cgi因自动重试而成功****************/
            re_try_flag: [59001, 'CGI重试成功'],

            /***************拖拽文件发送***********************/
            DRAG_FILE_SEND_TO_QQ: [59040, '拖拽到QQ好友'],
            DRAG_FILE_SEND_TO_QUN: [59041, '拖拽到群'],
            DRAG_FILE_SEND_TO_GROUP: [59042, '拖拽到讨论组'],
            DRAG_FILE_SEND_TO_TMP: [59043, '拖拽到临时会话'],

            /************************离线文件***********************************/
            OFFLINE_ITEM_CHECKALL: [57600,'离线文件-item-全选'],
            OFFLINE_ITEM_CHECKBOX: [57601,'离线文件-item-checkbox'],
            OFFLINE_ITEM_CLICK:[57602,'离线文件-item-点击整行'],
            OFFLINE_HOVERBAR_SAVEAS: [57603,'离线文件-hovebar-另存为'],
            OFFLINE_HOVERBAR_DELETE: [57604,'离线文件-hovebar-删除'],
            OFFLINE_HOVERBAR_DOWNLOAD: [57605,'离线文件-hovebar-下载'],
            OFFLINE_TOOLBAR_DOWNLOAD: [57611,'离线文件-工具栏-下载'],
            OFFLINE_TOOLBAR_DELETE: [57612,'离线文件-工具栏-删除'],
            OFFLINE_TOOLBAR_SAVEAS: [57613,'离线文件-工具栏-另存为'],
            OFFLINE_TOOLBAR_REFRESH: [57614,'离线文件-工具栏-刷新'],
            OFFLINE_HAS_FILES: [57620,'列表中有文件'],
            OFFLINE_EMPTY_FILES: [57621,'列表中无文件'],
            /**************************双屏************************/
            DBVIEWTREE_ITEM_CLICK: [52341,'目录树-点击item'],
            DBVIEWTREE_ITEM_DELTA_CLICK: [52342,'目录树-点击item前三角形'],
            DBVIEWTREE_OPEN: [52150,'网盘-工具条-展开双屏'],
            DBVIEWTREE_CLOSE: [52151,'网盘-工具条-收起双屏'],
            DBVIEWTREE_ITEM_DROP: [52641,'双屏下拖拽到目录树'],
        /**************************引导安装客户端************************/
            GUIDE_INSTALL_ANDROID:[69110,'引导安装android'],
            GUIDE_INSTALL_ANDROID_SEND_TO_PHONE:[69111,'引导安装android-发送到手机-发送按钮'],  
            GUIDE_INSTALL_ANDROID_SEND_BTN:[69112,'引导安装android-发短信'],
            GUIDE_INSTALL_ANDROID_CLICK_DOWN:[69113,'引导安装android-下载安装包'],
            GUIDE_INSTALL_IPHONE:[69120,'引导安装iPhone'],
            GUIDE_INSTALL_IPHONE_SEND_BTN:[69121,'引导安装iPhone-发短信'],
            GUIDE_INSTALL_IPHONE_CLICK_DOWN:[69122,'引导安装iPhone-前往appstore下载'],
            GUIDE_INSTALL_IPAD:[69130,'引导安装iPad'],
            GUIDE_INSTALL_IPAD_SEND_BTN:[69131,'引导安装iPad-发短信'],
            GUIDE_INSTALL_IPAD_CLICK_DOWN:[69132,'引导安装iPad-前往appstore下载'],
            
            /************************库分类（文档、视频、音频）************************/
            CATEGORY_DOC_FILTER_ALL: [57700, '文档库-工具栏-筛选-全部'],
            CATEGORY_DOC_FILTER_DOC: [57701, '文档库-工具栏-筛选-DOC'],
            CATEGORY_DOC_FILTER_XLS: [57702, '文档库-工具栏-筛选-XLS'],
            CATEGORY_DOC_FILTER_PPT: [57703, '文档库-工具栏-筛选-PPT'],
            CATEGORY_DOC_FILTER_PDF: [57704, '文档库-工具栏-筛选-PDF'],
            CATEGORY_DOC_SORT_MTIME:  [57710, '文档库-工具栏-排序-时间'],
            CATEGORY_DOC_SORT_AZ:  [57711, '文档库-工具栏-排序-AZ'],
            CATEGORY_DOC_HOVERBAR_DOWNLOAD: [57720, '文档库-hoverbar-下载'],
            CATEGORY_DOC_HOVERBAR_SHARE: [57721, '文档库-hoverbar-分享'],
            CATEGORY_DOC_HOVERBAR_RENAME: [57722, '文档库-hoverbar-重命名'],
            CATEGORY_DOC_HOVERBAR_DELETE: [57723, '文档库-hoverbar-删除'],
            CATEGORY_DOC_CONTEXTMENU_DOWNLOAD: [57730, '文档库-右键-下载'],
            CATEGORY_DOC_CONTEXTMENU_SHARE: [57731, '文档库-右键-分享'],
            CATEGORY_DOC_CONTEXTMENU_RENAME: [57732, '文档库-右键-重命名'],
            CATEGORY_DOC_CONTEXTMENU_DELETE: [57733, '文档库-右键-删除'],

            CATEGORY_VIDEO_SORT_MTIME:  [57810, '视频库-工具栏-排序-时间'],
            CATEGORY_VIDEO_SORT_AZ:  [57811, '视频库-工具栏-排序-AZ'],
            CATEGORY_VIDEO_HOVERBAR_DOWNLOAD: [57820, '视频库-hoverbar-下载'],
            CATEGORY_VIDEO_HOVERBAR_SHARE: [57821, '视频库-hoverbar-分享'],
            CATEGORY_VIDEO_HOVERBAR_RENAME: [57822, '视频库-hoverbar-重命名'],
            CATEGORY_VIDEO_HOVERBAR_DELETE: [57823, '视频库-hoverbar-删除'],
            CATEGORY_VIDEO_CONTEXTMENU_DOWNLOAD: [57830, '视频库-右键-下载'],
            CATEGORY_VIDEO_CONTEXTMENU_SHARE: [57831, '视频库-右键-分享'],
            CATEGORY_VIDEO_CONTEXTMENU_RENAME: [57832, '视频库-右键-重命名'],
            CATEGORY_VIDEO_CONTEXTMENU_DELETE: [57833, '视频库-右键-删除'],

            CATEGORY_AUDIO_SORT_MTIME:  [57910, '音乐库-工具栏-排序-时间'],
            CATEGORY_AUDIO_SORT_AZ:  [57911, '音乐库-工具栏-排序-AZ'],
            CATEGORY_AUDIO_HOVERBAR_DOWNLOAD: [57920, '音乐库-hoverbar-下载'],
            CATEGORY_AUDIO_HOVERBAR_SHARE: [57921, '音乐库-hoverbar-分享'],
            CATEGORY_AUDIO_HOVERBAR_RENAME: [57922, '音乐库-hoverbar-重命名'],
            CATEGORY_AUDIO_HOVERBAR_DELETE: [57923, '音乐库-hoverbar-删除'],
            CATEGORY_AUDIO_CONTEXTMENU_DOWNLOAD: [57930, '音乐库-右键-下载'],
            CATEGORY_AUDIO_CONTEXTMENU_SHARE: [57931, '音乐库-右键-分享'],
            CATEGORY_AUDIO_CONTEXTMENU_RENAME: [57932, '音乐库-右键-重命名'],
            CATEGORY_AUDIO_CONTEXTMENU_DELETE: [57933, '音乐库-右键-删除'],

            /*************************图片*********************************************/
            ALBUM_MODE_GROUP:[57729,'图片库-切换到分组'],
            //图片库-切换到分组	57729     ok
            ALBUM_MODE_TIME:[57730,'图片库-切换到时间轴'],
            //图片库-切换到时间轴	57730       ok
            //图片库-切换到地理位置	57731
            ALBUM_MODE_ALL:[57732,'图片库-切换到全部'],
            //图片库-切换到全部	57732         ok
            ALBUM_GROUP_ENTER:[57733,'照片库-分组-进入分组'],
            //照片库-分组-进入分组	57733           ok
            ALBUM_GROUP_DRAG_SORT:[57734,'照片库-分组-拖拽分组排序'],
            //照片库-分组-拖拽分组排序	57734
            ALBUM_GROUP_HOVEBAR_RENAME:[57735,'照片库-分组-hoveBar-重命名'],
            //照片库-分组-hoveBar-重命名	57735    ok
            ALBUM_GROUP_HOVEBAR_DEL:[57736,'照片库-分组-hoveBar-删除'],
            //照片库-分组-hoveBar-删除	57736      ok
            ALBUM_GROUP_HOVEBAR_SET_COVER:[57737,'照片库-分组-hoveBar-更换封面'],
            //照片库-分组-hoveBar-更换封面	 57737
            ALBUM_GROUP_RIGHT_RENAME:[57738,'照片库-分组-右键-重命名'],
            //照片库-分组-右键-重命名	57738    ok
            ALBUM_GROUP_RIGHT_DEL:[57739,'照片库-分组-右键-删除'],
            //照片库-分组-右键-删除	57739      ok
            ALBUM_GROUP_RIGHT_SET_COVER:[57740,'照片库-分组-右键-更换封面'],
            //照片库-分组-右键-更换封面	57740
            ALBUM_GROUP_SET_COVER_CHOSE_PIC:[57741,'照片库-分组-更改封面框-选择不同的照片'],
            //照片库-分组-更改封面框-选择不同的照片	57741
            ALBUM_GROUP_TOOL_NEW:[57742,'照片库-分组-工具栏-新建分组'],
            //照片库-分组-工具栏-新建分组	57742    ok
            ALBUM_GROUP_TOOL_REFRESH:[57743,'照片库-分组-工具栏-刷新'],
            //照片库-分组-工具栏-刷新	57743   todo
            ALBUM_GROUP_TOOL_CHANGE:[57744,'照片库-分组-工具栏-更改分组'],
            //照片库-分组-工具栏-更改分组	57744   ok
            ALBUM_GROUP_TOOL_DEL:[57745,'照片库-分组-工具栏-删除'],
            //照片库-分组-工具栏-删除	57745   ok
            ALBUM_GROUP_DETAIL_RETURN:[57746,'照片库-分组-返回'],
            //照片库-分组-返回	57746   ok
            ALBUM_GROUP_CLOSE_SHORTCUT:[57747,'照片库-分组-收起快捷分组栏'],
            //照片库-分组-收起快捷分组栏	57747
            ALBUM_GROUP_OPEN_SHORTCUT:[57748,'照片库-分组-展开快捷分组栏'],
            //照片库-分组-展开快捷分组栏	57748
            ALBUM_GROUP_CLICK_SHORTCUT:[57749,'照片库-分组-点击快捷分组中的分组'],
            //照片库-分组-点击快捷分组中的分组	57749
            ALBUM_GROUP_DRAG_TO_SHORTCUT:[57750,'照片库-分组-拖拽照片到快捷分组栏']
            //照片库-分组-拖拽照片到快捷分组栏	57750


        },

    // 点击流统计（以number为key，用于通过op数字查找key）
        ops_reverse_map = {
            /*
             * 9136: active_plugin,
             * 50006: LOGIN_OUT,
             * ...
             */
        };


    for (var key in click_ops) {
        var cfg = click_ops[key];
        ops_reverse_map[cfg[0]] = key;
    }
    for (var key in request_ops) {
        var cfg = request_ops[key];
        ops_reverse_map[cfg[0]] = key;
    }

    return {

        /**
         * 获取统计的 op 码和名称
         * @param {String|Number} op_name
         * @return {{op: Number, name: String}}
         */
        get_op_config: function (op_name) {
            var cfg, key;
            if (typeof op_name === 'number') {
                key = ops_reverse_map[op_name];
            } else {
                key = op_name;
            }

            if (key && (cfg = click_ops[key])) {
                return {
                    key: key,
                    op: cfg[0],
                    name: cfg[1]
                };
            }
        },

        /**
         * 通过命令字获取CGI对应的 op(for oz.isd.com)
         * @param {String} cmd
         * @returns {Number}
         */
        get_req_op: function (cmd) {
            var conf = cmd in request_ops ? request_ops[cmd] : null;
            if (conf) {
                if (typeof conf === 'number') {
                    return conf;
                } else if (typeof conf === 'object') {
                    return conf.oz_op;
                }
            }
            return null;
        },

        /**
         * 通过命令字获取 m_speed_flags(for m.isd.com)
         * @param cmd
         */
        get_m_speed_flags: function (cmd) {
            var conf = cmd in request_ops ? request_ops[cmd] : null;
            if (conf && typeof conf === 'object') {
                return conf.m_speed_flags;
            }
            return '';
        }
    };
});/**
 * 一些常量
 * @jameszuo 12-12-19 下午12:45
 */
/*global global,Buffer*/
define.pack("./constants",["lib","$","i18n","./util.os","./util.browser"],function (require, exports, module) {

    var
        lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),

        _ = require('i18n').get('./pack'),
        l_key = 'common.constants',
        win = window;

    var OS_TYPES = {
//      WEB : 4,
        WEB: 30013,
//      APPBOX : 7,
        //APPBOX: 30012,
        APPBOX:(function(){//国际版appid区分语言
            /*
             31001	PC--QQ微云应用（繁体）   "zh"
             31002	PC--QQ微云应用（德语）   "de"
             31003	PC--QQ微云应用（法语）   "fr"
             31004	PC--QQ微云应用（日语）   "ja"
             31005	PC--QQ微云应用（韩语）   "ko"
             31006	PC--QQ微云应用（西班牙语）"es"
             31007	PC--QQ微云应用（英语）   "en"
             */
            if(!win.WY_SEAJS_CONFIG || !win.WY_SEAJS_CONFIG.language){
                return 31007;//英文
            }
            switch (win.WY_SEAJS_CONFIG.language){
                case('zh'):
                    return 31001;
                case('de'):
                    return 31002;
                case('fr'):
                    return 31003;
                case('ja'):
                    return 31004;
                case('ko'):
                    return 31005;
                case('es'):
                    return 31006;
                case('en'):
                    return 31007;
                default ://默认英文
                    return 31007;
            }
        })(),
        QQ: 9,
        QZONE: 30225,
        QQNEWS: 30227    //QQ新闻安排id
    };
    var VIRTUAL_DIR_TYPES = {
        Text: 'text',
        Audio: 'audio',
        Image: 'picture',
        Video: 'video',
        Article: 'article'
    };


    var
    // 是否是 appbox 环境
    // 如果未手动指定 IS_APPBOX，则从 URL 中判断，下列 URL 将被判断为appbox环境
    // http://xx/appbox.html
    // http://xx/appbox-xx.html
    // http://xx/appbox/xx.html
    // http://xx/xx.html?appbox
    // http://xx/xx.html?xx=1&appbox
        //IS_APPBOX = /([\?&\/]appbox\b|is_appbox=(1|true))/i.test(win.location.href),
        IS_APPBOX = true,
    // 是否开发模式
        IS_DEBUG = !!win.IS_DEBUG,
    // 是否是PHP直出
        IS_PHP_OUTPUT = !!win.IS_PHP_OUTPUT,
    // 是否是QQ空间应用
        IS_QZONE = !!win.IS_QZONE,
    // 是否嵌入到其它网站中，例如qzone、q+之类，域名非weiyun
        IS_WRAPPED = IS_QZONE,
    // webkit内核的appbox
        IS_WEBKIT_APPBOX = IS_APPBOX && $.browser.webkit,

    // APPID
        APPID = IS_APPBOX ? OS_TYPES.APPBOX : (IS_QZONE ? OS_TYPES.QZONE : OS_TYPES.WEB),

    // UI 版本(与 constants.IS_APPBOX 语义不同，对于UI的判断，请尽量使用 constants.UI_VER)
        UI_VER = IS_APPBOX ? 'APPBOX' : 'WEB',


    // QQ硬盘目录ID
        QQDISK_DIR_ID = '77c92765438ca4ef1d170515',

    // 网络收藏夹目录ID
        NET_FAV_DIR_ID = '9b7db5fb4f26f2baea50ef60',

    // 操作系统
        os_name = require('./util.os').name,

    // 浏览器名称
        browser_name = require('./util.browser').name,

        MB_1 = 1024 * 1024,

    // 文档预览大小限制
        DOC_PREVIEW_SIZE_LIMIT = {
            // txt改为分片预览，不再限制
//            txt: 100 * MB_1
        },

        undefined;

    return {

        // 主域名
        MAIN_DOMAIN: 'weiyun.com',

        // 域名
        DOMAIN: 'http://www.weiyun.com',

        IS_APPBOX: IS_APPBOX,
        IS_DEBUG: IS_DEBUG,
        IS_WRAPPED: IS_WRAPPED,
        IS_WEBKIT_APPBOX: IS_WEBKIT_APPBOX,
        IS_PHP_OUTPUT: IS_PHP_OUTPUT,

        APPID: APPID,
        UI_VER: UI_VER,

        OS_TYPES: OS_TYPES,
        OS_NAME: os_name,
        IS_MAC: os_name === 'mac',
        IS_WINDOWS: os_name === 'windows',

        BROWSER_NAME: browser_name,
        RESOURCE_BASE: 'http://imgcache.qq.com/vipstyle/nr/box',

        MB_1: MB_1,

        //上传到相册的路径
        UPLOAD_DIR_PHOTO: -1,

        //上传文件夹最大层级
        UPLOAD_FOLDER_LEVEL: 1,
        //上传文件夹时最大的目录数
        UPLOAD_FOLDER_DIR_NUM: 200,
        //上传文件夹时最大的文件数
        UPLOAD_FOLDER_MAX_FILE_NUM: 5000,

        // 创建目录的层级上限 // jackbinwu fixed: 层级为20的话，会导致windows同步有问题，这里先修改为19层，跟其他端一致
        DIR_DEEP_LIMIT: 19,

        QQDISK_DIR_ID: QQDISK_DIR_ID,
        NET_FAV_DIR_ID: NET_FAV_DIR_ID,

        //模块ID
        SERVICE_ID: {
            DISK: 1,
            PHOTO: 2
        },

        VIRTUAL_DIR_TYPES: VIRTUAL_DIR_TYPES,
        VIRTUAL_DIRS: {
            weixin: {
                name: _(l_key,'微信'),
                id: '5d37aaaef344b3e67fe406f7',
                children: {
                    msg: {
                        name: _(l_key,'文字语音'),
                        id: '40281299baef0847a3086540',
                        types: [VIRTUAL_DIR_TYPES.Text, VIRTUAL_DIR_TYPES.Audio]
                    },
                    photo: {
                        name: _(l_key,'视频图片'),
                        id: '32af48ea56dc0d0eb4df0ef0',
                        types: [VIRTUAL_DIR_TYPES.Image, VIRTUAL_DIR_TYPES.Video]
                    },
                    article: {
                        name: _(l_key,'文章'),
                        id: '97afabcf7418883b2a70b95e',
                        types: [VIRTUAL_DIR_TYPES.Article]
                    }
                }
            },
            qqnews: {
                name: _(l_key,'腾讯新闻'),
                id: 'd0f6974443cf31d41cba4a9a',
                children: {
                    photo: {
                        name: _(l_key,'图片'),
                        id: 'ba4b1194e19cfa3e7c48ff4f',
                        types: [VIRTUAL_DIR_TYPES.Image]
                    }
                }
            },
            qqmail: {
                name: _(l_key,'QQ邮箱'),
                async_load: true,
                appid: 30208
            }
        },

        DISK_TOOLBAR:{
            VIRTUAL_SHOW:'virtual_show',//虚拟目录 要toolbar
            HIDE:'hide',//不要toolbar
            NORMAL:'normal'//正常目录
        },
        OFFLINE_DIR: 'd9d243a4d99210dff924fcd1',//离线文件第一层目录key
        OFFLINE_SRC_APPID:3,//离线文件src_appid

        // 文档预览大小限制
        DOC_PREVIEW_SIZE_LIMIT: DOC_PREVIEW_SIZE_LIMIT,

        // 打包下载文件个数上限
        PACKAGE_DOWNLOAD_LIMIT: 100,
        // 外链分享文件个数上限
        LINK_SHARE_LIMIT: 100,
        // 邮件分享文件个数上限
        MAIL_SHARE_LIMIT: 1,

        LAN: (function(){
            var lan = (!win.WY_SEAJS_CONFIG || !win.WY_SEAJS_CONFIG.language) ? 'en' : win.WY_SEAJS_CONFIG.language;
            return {
                IS_ZH :  lan === 'zh',
                IS_EN :  lan === 'en',
                IS_DE :  lan === 'de',
                IS_FR :  lan === 'fr',
                IS_JA :  lan === 'ja',
                IS_KO :  lan === 'ko',
                IS_ES :  lan === 'es'
            };
        })()

    };
});/**
 * 框选功能
 * 需注意的是，框选功能开启时，View必须要有record_dom_map_perfix、scroller配置
 * @author cluezhang
 * @date 2013-11-29
 */
define.pack("./dataview.Box_selection_plugin",["lib","./ui.SelectBox","./dataview.Multi_selection_plugin","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        SelectBox = require('./ui.SelectBox'),
        
        Multi_selection_plugin = require('./dataview.Multi_selection_plugin'),
        
        $ = require('$');
    var Module = inherit(Multi_selection_plugin, {
        /**
         * 当开始框选时触发，可以返回false取消
         * @event before_box_select
         * @param {jQueryElement} $target
         */
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 框选默认就有此功能，所以关掉父类的
            this.clear_on_click_void = false;
        },
        on_init : function(){
            Module.superclass.on_init.apply(this, arguments);
            var view = this.view;
            
            this.select_box_namespace = 'selectbox/'+view.id;
            this.listenTo(view, 'render show hide', this._refresh_box_select_state);
            this.listenTo(view, 'add remove refresh', this._update_box_selection);
        },
        register_selection_shortcuts : function(){
            var view = this.view, me = this;
            var addition_shortcuts = {};
            addition_shortcuts[this.selected_property_name] = function(value, view){
                var sel_box = me.get_select_box(true);
                if(sel_box){
                    sel_box.set_selected_status([this.attr('id')], value);
                }
            };
            $.extend(view.shortcuts, addition_shortcuts);
        },
         /**
         * 更新框选的dom映射，以便框选中加载的记录也能被选中
         * @private
         */
        _update_box_selection : function(){
            var sel_box = this.get_select_box(true);
            if(!sel_box){
                return;
            }
            sel_box.refresh();
        },
        // -----------------框选---------------------
        _refresh_box_select_state : function(){
            var view = this.view, enable, cur_enabled;
            enable = view.rendered && !view.hidden;
            cur_enabled = this.get_select_box().is_enabled();
            if(enable === cur_enabled){
                return;
            }
            if(enable){
                this._enable_box_selection();
            }else{
                this._disable_box_selection();
            }
        },
        _enable_box_selection: function () {
            var sel_box = this.get_select_box();

            sel_box.enable();

            sel_box.on('select_change', this._update_selection, this);
        },
        //禁用框选
        _disable_box_selection: function () {
            var sel_box = this.get_select_box(true);
            if(!sel_box){
                return;
            }
            sel_box.disable();

            sel_box.off('select_change', this._update_selection, this);
            this.stopListening(sel_box, 'select_change');
        },
        _update_selection : function(sel_id_map, unsel_id_map){
            var store = this.store, id, record;
            for (id in sel_id_map) {
                if(sel_id_map.hasOwnProperty(id)){
                    record = this.get_record_by_domid(id);
                    if(record){
                        record.set(this.selected_property_name, true, true);
                    }
                }
            }
            for (id in unsel_id_map) {
                if(unsel_id_map.hasOwnProperty(id)){
                    record = this.get_record_by_domid(id);
                    if(record){
                        record.set(this.selected_property_name, false, true);
                    }
                }
            }
            this.trigger('selectionchanged', this.get_selected());
        },
        // 根据id获取record
        get_record_by_domid : function(domid){
            return this.view.get_record(document.getElementById(domid), true);
        },
        // 框选
        get_select_box : function(dont_construct){
            var me = this,
                view = me.view,
                $list = view.$list,
                sel_box = me.sel_box,
                ids;
            if(!sel_box && !dont_construct){
                sel_box = me.sel_box = new SelectBox({
                    ns: me.select_box_namespace,
                    $el: view.$list,
                    $scroller: view.scroller ? view.scroller.get_$el() : undefined,
                    selected_class: me.item_selected_class,
                    before_start_select : function($tar){
                        return me.trigger('before_box_select', $tar);
                    },
                    keep_on_selector : me.no_void_selector,
                    clear_on: function ($tar) {
                        // 如果没有点到记录上，清除
                        return !view.get_record($tar);
                    },
                    container_width: function () {
                        return $list.width();
                    }
                });
                ids = [];
                view.store.each(function(record){
                    if(record.get(me.selected_property_name)){
                        ids.push(view.get_dom(record).attr('id'));
                    }
                });
                sel_box.set_selected_status(ids, true);
            }
            return sel_box;
        },
        // ------------- 框选结束 ---------------
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this._disable_box_selection();
            var sel_box = this.get_select_box(true);
            if(sel_box){
                sel_box.destroy();
            }
        }
    });
    return Module;
});/**
 * View多选插件，要实现以下功能：
 * 1. 在shortcuts中增加selected（可配置选中样式）
 * 2. 优先监听recordclick事件，
 * @author cluezhang
 * @date 2013-11-29
 */
define.pack("./dataview.Multi_selection_plugin",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {String} checkbox_selector
         */
        checkbox_selector : '.checkbox',
        /**
         * @cfg {String} item_selected_class 当记录选中时，增加什么样式
         */
        item_selected_class : 'ui-selected',
        /**
         * @cfg {String} selected_property_name 选中状态存于record的哪个属性中
         */
        selected_property_name : 'selected',
        /**
         * @cfg {Boolean} clear_on_click_void 当点击空白界面时，是否清除选择，默认为true
         */
        clear_on_click_void : true,
        /**
         * @cfg {String} no_void_selector 排除某些dom为非空白界面，即点击它们时不触发清除选择的行为
         */
        no_void_selector : '[data-no-selection], input, textarea, button, object, embed',
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        init : function(view){
            this.view = view;
            this.on_init();
        },
        on_init : function(){
            var view = this.view;
            this.register_selection_shortcuts();
            
            this.listenTo(view, 'destroy', this.destroy, this);
            this.listenTo(view, 'recordclick', this.handle_record_click, this);
            if(this.clear_on_click_void){
                this.if_click_void_handler = $.proxy(this.handle_if_click_void, this);
                $(document.body).on('click', this.if_click_void_handler);
            }
        },
        register_selection_shortcuts : function(){
            var view = this.view, me = this;
            var addition_shortcuts = {};
            addition_shortcuts[this.selected_property_name] = function(value, view){
                $(this).toggleClass(me.item_selected_class, value);
            };
            $.extend(view.shortcuts, addition_shortcuts);
        },
        /**
         * 点击空白界面时清除选择
         */
        handle_if_click_void : function(e){
            var $dom = $(e.target);
            if(!$dom.closest('[data-no-selection]').length && !this.view.get_record($dom)){
                this.clear();
            }
        },
        /**
         * @private
         */
        handle_record_click : function(record, e){
            e.preventDefault();
            var $target = $(e.target);
            var is_checkbox = $target.is(this.checkbox_selector);
            var is_data_action = !!$target.closest('[' + this.view.action_property_name + ']').length;
            var range_select = false,
                clear_selection = true,
                directly_click = true;
            if (is_data_action) {//如果是功能性操作直接返回，对应的mgr中已有相应处理
                return;
            }
            if (is_checkbox || e.ctrlKey || e.metaKey) { // 如果是checkbox或按了ctrl键，不清除已选项
                clear_selection = false;
                directly_click = false;
            }
            // 如果按了shift，表示区域选择，同时不更新上次点击的记录
            if (e.shiftKey) {
                range_select = true;
                directly_click = false;
            } else { // 否则，只选或反选这条，记录当前操作的记录
                this.last_click_record = record;
            }
            // 如果点了checkbox、按了ctrl、shift、meta键，当作选择处理
            // 如果都不是，则触发before_select_click事件，如果返回为非false才进行后续选择，以便视图实现直接点击打开、展开等逻辑
            if (!directly_click || this.trigger('before_select_click', record, e) !== false) {
                this.select(record, clear_selection, range_select);
            }
        },
        /**
         * 执行选择操作
         * @param {Record} record 当前选择的记录
         * @param {Boolean} clear_selection (optional) 是否清除之前的选中，如果是则清除本次选中外的选中。如果不是则为增量选择。默认为true
         *      需要注意的一点是，如果clear_selection为false时，当前记录如果已经选中过，则会取消选择
         * @param {Boolean} range_select (optional) 是否为范围选择，如果是表示从上次范围选择前的记录到当前记录，中间的都选中。默认为false。
         */
        select : function(record, clear_selection, range_select){
            var last_click_record = this.last_click_record,
                store = this.view.store,
                selected_property_name = this.selected_property_name,
                index = store.indexOf(record),
                start, end;
            if(range_select){
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
            }
            var selected_records = [];
            store.each(function (rec, idx) {
                var selected, old_selected = rec.get(selected_property_name);
                // 是否是操作目标
                var in_range = range_select ? (idx >= start && idx <= end || idx >= end && idx <= start) : idx === index;
                if (range_select) { // 多选时，范围内的必定选中，范围外的如果没有ctrl则不选，如果有则保持
                    if (in_range) {
                        selected = true;
                    } else {
                        selected = clear_selection ? false : old_selected;
                    }
                } else { // 单选时
                    if (clear_selection) { // 如果没按ctrl，目标记录一定选中，其它的则不选
                        selected = in_range;
                    } else { // 如果按了ctrl，其它记录不变，目标记录切换状态
                        selected = in_range ? !old_selected : old_selected;
                    }
                }
                if (selected !== old_selected) {
                    rec.set(selected_property_name, selected);
                }
                if(selected){
                    selected_records.push(selected);
                }
            });
            this.trigger('selectionchanged', selected_records);
        },
        clear : function(){
            var me = this,
                view = me.view;
            if(!view.destroyed && view.store){
                view.store.each(function(record){
                    record.set(me.selected_property_name, false);
                });
                this.trigger('selectionchanged', []);
            }
        },
        get_selected : function(){
            var records = this.view.store.slice(), i, record, selected = [];
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.data.selected){
                    selected.push(record);
                }
            }
            return selected;
        },
        destroy : function(){
            this.stopListening();
            if(this.clear_on_click_void){
                $(document.body).off('click', this.if_click_void_handler);
            }
            this.on_destroy();
        },
        on_destroy : $.noop
    });
    return Module;
});/**
 * 文件类
 *  @author jameszuo
 *  @date 13-1-16
 */

define.pack("./file.file_object",["$","lib","./constants","i18n","./file.file_type_map"],function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),


        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = require('./constants'),

    // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
    // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },
    // 可预览的文档类型
        EXT_PREVIEW_DOC_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, rtf: 1, wps: 1, ppt: 1, pptx: 1, pdf: 1, txt: 1, text: 1 },
    // 视频文档类型
        EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },

        EXT_COMPRESS_TYPES = { zip: 1, '7z': 1, rar: 1 },

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.file_object',
    //根据后缀名获取文件类型
        file_type_map = require('./file.file_type_map'),

        empty_str = '',

        math = Math,
        parse_int = parseInt,

        undefined;

    /**
     * 构造函数
     * @param props
     *    {String} id                 文件ID
     *    {String} pid                父目录ID
     *    {String} [is_dir]           是否目录，默认false
     *    {String} name               文件名
     *    {Number} [size]             字节数，默认0
     *    {Number} [cur_size]         已上传的字节数，默认0
     *    {String} [create_time]      创建时间，默认''
     *    {String} [modify_time]      修改时间，默认''
     *    {String} [file_ver]         版本号，默认''
     *    {String} [file_md5]         MD5，默认''
     *    {String} [file_sha]         SHA，默认''
     *    {Boolean} [is_dirty]        是否脏目录，默认false
     *    {Boolean} [is_downable]     是否可下载，默认true，破损文件为false
     *    {Boolean} [is_movable]      是否可移动，默认true，破损文件为false
     *    {Boolean} [is_removable]    是否可删除，默认true
     *    {Boolean} [is_renamable]    是否可重命名，默认true
     *    {Boolean} [is_sortable]     是否可排序，默认true
     *    {Boolean} [is_selectable]   是否可选中，默认true
     *    {Boolean} [is_droppable]    是否可丢放文件，默认true，文件为false
     *    {String} [icon]            图标class，默认''
     *    {Boolean} [whole_click]     是否整个文件DIV都可点击，默认false
     *    {Boolean} [is_tempcreate]   是否是新建文件夹，默认false，文件为false
     * @constructor
     */
    var File = function (props) {
        var me = this;

        if (!props.id) {
            console.warn('new File(props) 无效的参数 id');
            return;
        }

        me._id = props.id;
        me._is_dir = !!props.is_dir;

        me.set_name(props.name);
        me.set_size(props.size || 0);
        me.set_cur_size(props.cur_size || 0);
        me.set_create_time(props.create_time);
        me.set_modify_time(props.modify_time || props.create_time);
        me.set_file_ver(props.file_ver);
        me.set_file_md5(props.file_md5);
        me.set_file_sha(props.file_sha);

        me._pid = props.pid;//父级ID
        me._is_dirty = props.is_dirty === true;
        me._is_downable = props.is_downable !== false;
        me._is_sortable = props.is_sortable !== false;
        me._is_movable = props.is_movable !== false;
        me._is_removable = props.is_removable !== false;
        me._is_renamable = props.is_renamable !== false;
        me._is_selectable = props.is_selectable !== false;
        me._is_droppable = me.is_dir() && props.is_droppable !== false;
        me._is_draggable = props.is_draggable !== false;
        me._icon = props.icon || '';
        me._whole_click = props.whole_click === true;

        me._is_tempcreate = props.is_tempcreate && me.is_dir();

        // 破文件不可移动、不可下载
        if (me.is_broken_file()) {
            me._is_movable = false;
            me._is_downable = false;
        }
    };

    File.prototype = {
        _is_file_instance: true,
        // 只读属性:是否是图片
        is_image: function () {
            return this._is_image;
        },

        is_compress_file: function () {
            return this._is_compress_file;
        },

        // 只读属性：是否可预览
        is_preview_doc: function () {
            return this._is_preview_doc;
        },
        // 只读属性：是否是视频
        is_video: function () {
            return this._is_video;
        },
        // 只读属性:是否破损文件
        is_broken_file: function () {
            return this._is_broken;
        },
        // 只读属性:是否空文件
        is_empty_file: function () {
            return this._is_empty;
        },
        // 只读属性:是否目录
        is_dir: function () {
            return this._is_dir;
        },
        //只读属性:ID
        get_id: function () {
            return this._id;
        },
        // 只读属性:文件类型
        get_type: function () {
            return this._type;
        },
        // 只读属性:可读的文件大小（1M、10G）
        get_readability_size: function () {
            return this._readability_size;
        },

        get_name: function () {
            return this._name;
        },
        get_name_no_ext: function () {
            var n = this.get_name();
            if (this.is_dir()) {
                return n;
            } else {
                var m = n.match(NAME_NO_EXT_RE);
                m = m ? m[1] : n;
                return $.trim(m) || n;
            }
        },
        get_size: function () {
            return this._size;
        },
        get_cur_size: function () {
            return this._cur_size;
        },
        get_create_time: function () {
            return this._create_time || empty_str;
        },
        get_modify_time: function () {
            return this._modify_time || empty_str;
        },
        get_file_ver: function () {
            return this._file_ver;
        },
        get_file_md5: function () {
            return this._file_md5;
        },
        get_file_sha: function () {
            return this._file_sha;
        },
        set_name: function (name) {
            this._name = name;
            var type = this._type = File.get_type(this._name, this._is_dir);
            // 图片类型
            this._is_image = type in EXT_IMAGE_TYPES;
            // 是否可预览的文档
            this._is_preview_doc = type in EXT_PREVIEW_DOC_TYPES;
            // 是否视频
            this._is_video = type in EXT_VIDEO_TYPES;
            // 是否压缩包
            this._is_compress_file = type in EXT_COMPRESS_TYPES;
        },
        set_size: function (size) {
            this._size = parse_int(size);
        },
        set_cur_size: function (cur_size) {
            this._cur_size = parse_int(cur_size) || 0;
            this._is_empty = !this._is_dir && !this._cur_size;
            this._is_broken = !this._is_dir && this._cur_size < this._size;
            this._readability_size = File.get_readability_size(this._size, this._is_dir);
        },
        set_create_time: function (create_time) {
            this._create_time = create_time;
        },
        set_modify_time: function (modify_time) {
            this._modify_time = modify_time;
        },
        set_file_ver: function (file_ver) {
            this._file_ver = file_ver;
        },
        set_file_md5: function (file_md5) {
            this._file_md5 = file_md5;
        },
        set_file_sha: function (file_sha) {
            this._file_sha = file_sha;
        },
        set_tempcreate: function (is_temp) {
            this._is_tempcreate = is_temp;
        },

        // 判断目录是否脏
        is_dirty: function () {
            return this._is_dirty;
        },

        // 判断目录是否可以删除
        is_removable: function () {
            return !this._is_tempcreate && this._is_removable;
        },

        // 判断目录是否可以移动
        is_movable: function () {
            return !this._is_tempcreate && this._is_movable;
        },

        // 判断文件、目录是否可以下载
        is_downable: function () {
            return !this._is_tempcreate && this._is_downable;
        },

        // 判断文件、目录是否可以重命名
        is_renamable: function () {
            return !this._is_tempcreate && this._is_renamable;
        },

        // 判断文件、目录是否参与排序
        is_sortable: function () {
            return !this._is_tempcreate && this._is_sortable;
        },

        // 是否可以选中
        is_selectable: function () {
            return !this._is_tempcreate && this._is_selectable;
        },

        // 是否可以丢放文件
        is_droppable: function () {
            return !this._is_tempcreate && this._is_droppable;
        },

        // 是否可以拖拽文件
        is_draggable: function () {
            return !this._is_tempcreate && this._is_draggable;
        },

        // 是否整个文件节点都可以点击
        is_whole_click: function () {
            return this._whole_click;
        },

        // 是否为临时新建节点，即本地临时创建的节点，仅作为下一步确认新建文件名用。
        is_tempcreate: function () {
            return this._is_tempcreate;
        },
        get_icon: function () {
            return this._icon;
        },
        get_pid: function () {
            return this._pid;
        }
    };

    /**
     * 获取文件类型（ 不是后缀名，如 a.wps 的get_type() 会返回 doc ）
     * @param {String} name
     * @param {Boolean} is_dir
     * @return {String}
     */
    File.get_type = function (name, is_dir) {
        var ext;
        if (is_dir) {
            return file_type_map.get_folder_type();
        } else {
            ext = !is_dir ? File.get_ext(name) : null;
            if (ext) {
                return file_type_map.get_type_by_ext(ext);
            }
        }
        return '';
    };

    File.is_image = function (name) {
        var type = File.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    File.is_preview_doc = function (name) {
        var type = File.get_type(name, false);
        return type in EXT_PREVIEW_DOC_TYPES;
    };

    /**
     * 获取文件后缀名(小写)
     * @param {String} name
     * @return {String}
     */
    File.get_ext = function (name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;
    };

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Boolean} [is_dir] 是否目录（目录会返回空字符串）
     * @param {Number} [decimal_digits] 保留小数位，默认1位
     */
    File.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        bytes = parse_int(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

        if (!bytes)
            return '0B';

        var unit = parse_int(math.floor(math.log(bytes) / math.log(1024)));
        var size = bytes / math.pow(1024, unit);
        var decimal_mag = math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
        var int_size = parse_int(decimal_size);
        var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

        /*
         // 这是旧的需求实现：12.345G要显示为12.34G；12.00G要显示为12G - james
         var decimal_size = (math.floor(size * 100) / 100);  // 12.345 -> 12.34

         // 如果小数位有值，则保留2位；小数位为0，则不保留 @james
         if (decimal_size !== parse_int(decimal_size)) {
         result = decimal_size.toFixed(2);
         }
         // 整数
         else {
         result = parse_int(size);
         }*/

        return result + BYTE_UNITS[unit];
    };

    var re_name_deny = new RegExp('[\\:*?/\"<>|]'), // 禁止使用的字符
        max_len = 255, // 文件名最大字符数
        file_error_code = {
            EMPTY_NAME: 'EMPTY_NAME',
            DENY_CHAR: 'DENY_CHAR',
            OVER_LIMIT: 'OVER_LIMIT'
        },
        file_error_msgs = {
            EMPTY_NAME: '名不能为空，请重新命名',
            DENY_CHAR: '不能包含以下字符之一 /\\:?*\"><|',
            OVER_LIMIT: '名过长，请重新命名'
        };
    /**
     * 判断一个文件名是否有效
     * @param {String} name
     * @return {String} 返回错误类型
     */
    File.check_name_error_code = function (name) {
        // 检查字符个数
        if (!name) {
            console.log(name);
            return file_error_code.EMPTY_NAME;
        }
        else if (re_name_deny.test(name)) {
            return file_error_code.DENY_CHAR;
        }
        else if (/*text.byte_len(name)*/name.length > max_len) { // Fix bug 48823337，各操作系统的文件名是按字符计的，而非字节
            return file_error_code.OVER_LIMIT;
        }
    };
    /**
     * 判断一个文件名是否有效
     * @param {String} name
     * @param {Boolean} is_dir
     */
    File.check_name = function (name, is_dir) {
        var error_msg = file_error_msgs[File.check_name_error_code(name)];
        return error_msg ? _(l_key,(is_dir ? '文件夹' : '文件') + error_msg) : undefined;
    };

    /**
     * 判断对象是不是File的实例
     * @param obj
     */
    File.is_instance = function (obj) {
        return obj && obj._is_file_instance;
    };

    File.get_readability_size(1314, false, 2);
    for (var i = 0; i < 100; i++) {
        var v = parse_int(Math.random() * 100000);
        File.get_readability_size(v, false, 2);
    }

    return File;
});
define.pack("./file.file_type_map",[],function (require, exports, module) {

    var defaults = 'file',
        folder_type = 'folder',
        type_map = {
            doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptx', 'pptm'],
            bmp: ['bmp', 'tiff', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg', 'mpg', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'mpeg', 'mpg', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'mkv', 'ogm', 'webm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'midi', 'flac', 'ram', 'ra', 'mid', 'aac', 'm4a', 'ape', 'au', 'ogg'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg'],
            rmvb: ['rmvb'],
            rm: ['rm'],
            hlp: ['hlp', 'cnt'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec: ['exec', 'dll'],
            pdf: ['pdf'],
            txt: ['txt', 'text'],
            msg: ['msg'],
            rp: ['rp'],
            vsd: ['vsd'],
            ai: ['ai'],
            eps: ['eps'],
            log: ['log'],
            xmin: ['xmin'],
            psd: ['psd'],
            png: ['png'],
            gif: ['gif'],
            mod: ['mod'],
            mov: ['mov'],
            avi: ['avi'],
            swf: ['swf'],
            flv: ['flv'],
            wmv: ['wmv'],
            wma: ['wma'],
            mp3: ['mp3'],
            mp4: ['mp4'],
            ipa: ['ipa'],
            apk: ['apk'],
            ipe: ['ipe'],
            exe: ['exe'],
            msi: ['msi'],
            bat: ['bat'],
            fla: ['fla'],
            html: ['html'],
            htm: ['htm'],
            asp: ['asp'],
            xml: ['xml'],
            chm: ['chm'],
            rar: ['rar'],
            zip: ['zip'],
            tar: ['tar'],
            cab: ['cab'],
            uue: ['uue'],
            jar: ['jar'],
            iso: ['iso'],
            dmg: ['dmg'],
            bak: ['bak'],
            tmp: ['tmp'],
            ttf: ['ttf'],
            otf: ['opt'],
            old: ['old'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c',
            '7z', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf'
        ];


    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        can_ident[_can_ident[i]] = 1;
    }

    var getWords = function (str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return ( str.substr(0, i) + '..' );
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };

    return {
        get_type_by_ext: function (type) {
            return all_map[type] || defaults;
        },
        get_folder_type: function () {
            return folder_type;
        },
        can_identify: function (type) {
            return !!can_ident[type];
        },
        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function (file_name, type) {
            switch (type) {
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring(0, 7), '...', file_name.substring(file_name.length - 7) ].join('') : file_name;
            }

        }
    };

});/**
 * 读取文件属性并生成文件对象
 * @author jameszuo
 * @date 13-1-15
 */

define.pack("./file.parse_file",["lib","./file.file_object"],function (require, exports, module) {

    var lib = require('lib'),
        collections = lib.get('./collections'),

        File = require('./file.file_object'),

        empty = [],
        parse_int = parseInt,

        undefined;


    return {
        parse_file_attr: function (obj) {
            var
            // 公共属性
                is_dir = !!obj['dir_attr'],
                attr = obj[ is_dir ? 'dir_attr' : 'file_attr' ],
                id = obj[ is_dir ? 'dir_key' : 'file_id' ],
                name = attr[ is_dir ? 'dir_name' : 'file_name' ],
                create_time = obj[ is_dir ? 'dir_ctime' : 'file_ctime' ],
                modify_time = is_dir ? obj[ 'dir_mtime' ] : attr[ 'file_mtime' ],

            // 文件属性
                size = is_dir ? 0 : parse_int(obj[ 'file_size' ]) || 0,
                cur_size = is_dir ? 0 : parse_int(obj[ 'file_cur_size' ]) || 0,
                file_ver = is_dir ? '' : obj[ 'file_ver' ] || '',
                file_md5 = is_dir ? '' : obj[ 'file_md5' ] || '',
                file_sha = is_dir ? '' : obj[ 'file_sha' ] || '';

            return {
                is_dir: is_dir,
                id: id,
                name: name,
                create_time: create_time,
                modify_time: modify_time,

                size: size,
                cur_size: cur_size,
                file_ver: file_ver,
                file_md5: file_md5,
                file_sha: file_sha
            };
        },
        parse_file: function (obj) {
            return obj && new File(this.parse_file_attr(obj));
        },
        parse_files: function (objs) {
            var me = this;
            if (objs && objs.length) {
                return collections.map(objs, function (obj) {
                    return new File(me.parse_file_attr(obj));
                });
            } else {
                return empty;
            }
        }
    }
});
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 *
 * 切面过滤器，一些页面动作在调用之前，需要做权限控制
 */
define.pack("./filter.session_filter",["./query_user","./global.global_event"],function (require, exports, module) {
    var query_user=require('./query_user');

    return function(caller,args,callback){
        if( !query_user.check_cookie() ){
            //弹出登录框
            require('./global.global_event').namespace('session').trigger('session_timeout');
            return;
        }
        if( callback ){
            return callback.apply( caller || window, args );
        }
    };
});
/**
 * 全局事件路由
 * @author svenzeng
 * @date 13-3-1
 */


define.pack("./global.global_event",["lib","$"],function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events');


    var cache = {},
        event,

        namespace = function (key) {
            return cache[ key ] || ( cache[ key ] = $.extend({}, events) );
        };

    event = $.extend({}, events);

    event.namespace = namespace;


    module.exports = event;
});/**
 * 全局变量管理器
 * @author svenzeng
 * @date 13-3-6
 */

define.pack("./global.global_function",["lib"],function (require, exports, module) {

    var lib = require('lib'),
        console = lib.get('./console'),
        global = window,
        global_proxy = {},// 用来代理window注册事件，通过key取事件时是从该对象中取，而不是window，主要是为修复IE下无法取得 window.onbeforeload 的bug
        stack = {},
        call_counts = {},
        call_history_map = global.__call_history_map || {};

    var
        register = function (key, fn) {
            var is_reg = key in stack, // 是否是一个注册的事件
                history = !is_reg ? call_history_map[key] : null;

            // 处理历史调用
            if (history && history.length) {
                $.each(history, function (i, args) {
                    fn.apply(global, args);
                });
                delete call_history_map[key];
            }

            return _register(key, fn);
        },

    //往全局里注册函数
        _register = function (key, fn) {
            if (!stack[ key ]) {
                stack[ key ] = [];
            }

            stack[ key ].push(fn);   //添加进队列

            if (!global_proxy[key] || !global_proxy[key].__is_stack_caller) {

                global[key] = global_proxy[key] = function () {

                    var ret,
                        ary = stack[ key ];

                    for (var i = 0, c; c = ary[ i++ ];) {
                        ret = c.apply(global, arguments);
                        if (ret === false) {
                            return false;
                        }
                    }

                    call_counts[ key ]++;

                    return ret;
                };
                global_proxy[key].__is_stack_caller = true;

                call_counts[key] = 0;
            }
        },


        get = function (key) {
            return global_proxy[key];
        },

        get_called_count = function (key) {
            return call_counts[key] || 0;
        };


    return {
        register: register,
        get: get,
        get_called_count: get_called_count
    };

});
/**
 * 全局变量管理器
 * @author jameszuo
 * @date 13-4-2
 */
define.pack("./global.global_variable",[],function (require, exports, module) {
    var
        stack = {},
        set = function (key, val) {
            stack[key] = val;
        },
        get = function (key) {
            return stack[key];
        },
        del = function (key) {
            var val = stack[key];
            delete stack[key];
            return val;
        };

    return  {
        get: get,
        set: set,
        del: del
    };
});/**
 *
 * @author jackbinwu
 * @date 13-5-9
 */
define.pack("./init.click_tj",["lib","$","./user_log","./constants","./global.global_event"],function (require, exports, module) {

    try{

        var
            lib = require('lib'),


            $ = require('$'),
            cookie = lib.get('./cookie'),
            store = lib.get('./store'),
            console = lib.get('./console'),

            user_log = require('./user_log'),
            constants = require('./constants'),
            log_event = require('./global.global_event').namespace('log'),

            sel_files_len = 0,
            view_id = 1,

            undefined;

        // 文件个数变化事件
        log_event.on('sel_files_len_change', function (len) {
            if(typeof len !== 'number') {
                console.error('sel_files_len_change 无效的参数');
                len = 0;
            }
            sel_files_len = len;
            user_log.set_base_param('extInt1', sel_files_len); //当前选中的文件数量
        });

        // 视图切换事件
        log_event.on('view_type_change', function (vid) {
            view_id = vid;
            user_log.set_base_param('extInt2', view_id); // 视图模式（grid: 1,  azlist : 3, newestlist : 4）
        });


        $('body').off('mouseup.EvtTongji')
                 .on('mouseup.EvtTongji', function(evt){

            var which = evt.which;
            var $el = $(evt.target).closest('[data-tj-action]');

            //通过左键点击上报统计
            //利用setTimeout错开，避免abort统计请求
            if(which == 1 && $el.length != 0){
                setTimeout(function(){
                    user_log(parseInt($el.attr('data-tj-value')), 0);
                }, 200);
            }
        });
    }catch(e){
        console && console.error(e.message);
    }

});/**
 * 一些默认事件（如窗口resize、按下esc等）
 * @author jameszuo
 * @date 13-3-19
 */
define.pack("./init.default_global_events",["$","lib","./global.global_event","./util.functional","./util.os"],function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),

        events = lib.get('./events'),

        global_event = require('./global.global_event'),
        functional = require('./util.functional'),
        os = require('./util.os'),

        $win = $(window),
        $doc = $(document),

        BEFORE_WINDOW_RESIZE= 'before_window_resize',
        WINDOW_RESIZE = 'window_resize',
        WINDOW_RESIZE_REAL_TIME = 'window_resize_real_time',
        WINDOW_SCROLL = 'window_scroll',
        PRESS_KEY_ESC = 'press_key_esc',
        PAGE_UNLOAD = 'page_unload',

        resize_timer,
        rt_resize_timer,
        scroll_timer,
        win_width = $win.width(),
        win_height = $win.height(),

        is_windows = os.name.indexOf('windows') > -1,

        undefined;

    // 监听 window.resize 事件，并广播
    $win
        .on('resize.default_events', function () {
            var w = $win.width(),
                h = $win.height();

            if (w === 0 || h === 0) {  // hack appbox 最小化时会触发resize事件的bug
                return;
            }


            clearTimeout(resize_timer);

            resize_timer = setTimeout(function () {
                global_event.trigger(BEFORE_WINDOW_RESIZE);
                var new_width = $win.width(),
                    new_height = $win.height();

                if (win_width != new_width || win_height != new_height) {

                    win_width = new_width;
                    win_height = new_height;

                    global_event.trigger(WINDOW_RESIZE, win_width, win_height);
                }
            }, 200);

            clearTimeout(rt_resize_timer);
            rt_resize_timer = setTimeout(function () {
                global_event.trigger(WINDOW_RESIZE_REAL_TIME, $win.width(), $win.height());
            }, 60);
        })

        .on('scroll.default_events', is_windows ? function () {

            clearTimeout(scroll_timer);

            // windows 性能较差，延迟200毫秒后处理
            scroll_timer = setTimeout(function () {

                global_event.trigger(WINDOW_SCROLL);

            }, 200);
        } : function () {
            global_event.trigger(WINDOW_SCROLL);
        })

        .one('unload.default_events', function () {
            global_event.trigger(PAGE_UNLOAD);
        });

    // 监听 esc 事件，并广播
    $doc
        .on(($.browser.msie && $.browser.version < 7) ? 'keypress.default_events' : 'keydown.default_events', function (e) {
            if (e.which === 27) {
                global_event.trigger(PRESS_KEY_ESC);
            }
        });

});/**
 * 引用ExtJs中的repaint方法，以应对IE的各种奇葩渲染bug。
 * @author cluezhang
 * @date 2013/05/09
 */
define.pack("./init.enable_repaint",["$"],function(require, exports, module){
	var $ = require("$");
	$.fn.extend({
		repaint : function(){
			var el = $(this);
			el.addClass("x-repaint");
			// 原Ext用的是setTimeout，使用中发现可能会导致有快速闪现，就直接读取计算使浏览器强制重绘
			el.height();
			//setTimeout(function(){
				el.removeClass("x-repaint");
			//}, 1);
		}
	});
});/**
 *
 * @author jameszuo
 * @date 13-4-8
 */
define.pack("./init.fix_ie6",["$"],function (require, exports, module) {
    var $ = require('$');

    // 禁用IE6背景图片缓存
    if ($.browser.msie && $.browser.version < 7) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }
});/**
 * 初始化一些东西
 * @author jameszuo
 * @date 13-1-10 下午4:10
 */
define.pack("./init.init",["./init.prevent_events","./init.prevent_error","./init.default_global_events","./init.fix_ie6","./init.click_tj","./init.enable_repaint"],function (require, exports, module) {

    return function () {
        // 阻止一些浏览器默认事件
        require('./init.prevent_events');

        // 阻止异常消息冒泡
        require('./init.prevent_error');

        // 一些默认全局事件
        require('./init.default_global_events');

        // IE6
        require('./init.fix_ie6');

        //热点点击统计
        require('./init.click_tj');

        // 重绘方法引入
        require('./init.enable_repaint');
    };
});/**
 * 阻止浏览器默认的错误处理
 * @author jameszuo
 * @date 13-1-10 下午3:56
 */
define.pack("./init.prevent_error",["$","lib","./constants"],function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),

        console = lib.get('./console'),

        constants = require('./constants'),

        prevent_error = !constants.IS_DEBUG && ($.browser.msie || constants.IS_APPBOX), // 阻止IE和appbox下的脚本错误提示

        undefined;

    window.onerror = function (msg, file, line) {
        console.error( msg, file || '', line || '');
        return prevent_error;
    };

});/**
 * 在APPBOX中阻止一些浏览器默认行为
 * @author jameszuo
 * @date 13-1-10 下午3:57
 */
define.pack("./init.prevent_events",["lib","$","./constants"],function (require, exports, module) {

    var
        lib = require('lib'),


        $ = require('$'),
        console = lib.get('./console'),

        constants = require('./constants'),

        doc = document,
        $body = $(doc.body),

        INPUTS = 'input, textarea', // 在这些元素上显示默认菜单

        undefined;

    // appbox 阻止一些按键
    if (constants.IS_APPBOX) {
        var
            PREVENT_CTRL_KEYS = {
                65: 0, // ctrl+A 全选
                70: 0, // ctrl+F 查找
                78: 0, // ctrl+N 新建窗口
                80: 0 // ctrl+P 打印
            },
            PREVENT_KEYS = {
                116: 0 // F5 刷新
            },
            K_BACKSPACE = 8;

        $body.on({
            // 阻止按键
            keydown: function (e) {
                var k = e.which;
                var tag_name = e.target && e.target.tagName.toUpperCase();
                if (k in PREVENT_KEYS // 直接阻止的按键
                    || (e.ctrlKey && (k in PREVENT_CTRL_KEYS)) // ctrl组合键
                    || k === K_BACKSPACE && !(tag_name === 'INPUT' || tag_name === 'TEXTAREA')) { // 退格键
                    e.preventDefault();
                }
            }
        });
    }


    $body
        // 在不可拖拽元素下拖拽时阻止
        .on('dragstart', function (e) {
            if ($(e.target).closest('.ui-draggable').length === 0) {
                e.preventDefault();
            }
        });

    // 拦截浏览器右键
    $(doc).on('contextmenu.file_list_context_menu', function (e) {
        var $target = $(e.target);
        // 文本框中按下右键时不阻止
        if (!$target.is(INPUTS)) {
            e.preventDefault();
        }
    });

});/**
 * m.isd.com 测速4.0上报
 * @author jameszuo
 * @date 13-6-13
 */
define.pack("./m_speed",["lib","./query_user"],function (require, exports, module) {
    var
        lib = require('lib'),
        configs = {},
        action_times = {},
        log_images = {},
        log_image_id_seq = 0,

        console = lib.get('./console').namespace('m_speed');

    var speed = {
        __enable: Math.random() < 100 / 100, // 采样率
        config: function (cfg) {
            configs = cfg;
        },
        start: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (!action._done && !action._start) {
                action._start = new Date();
            }
        },
        done: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (action._start && !action._done) {
                action._done = new Date();
            }
        },
        time: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (action._done && action._start) {
                return action._done.getTime() - action._start.getTime();
            } else if (action._time) {
                return action._time;
            }
            return '';
        },
        set: function (mod_name, action_name, start_date, done_date) {
            var action = this._get_action(mod_name, action_name);
            action._start = start_date;
            action._done = done_date;
        },
        set_taken: function (mod_name, action_name, taken_mill) {
            var action = this._get_action(mod_name, action_name);
            action._time = taken_mill;
        },
        /**
         * 测速上报
         * @param {String} mod_name 模块名，如 base / disk / recycle
         * @param {String} [action_name] 操作名，如 image_preview，为空表示发送模块下所有记录
         * @param {Number} [time] 毫秒，为空表示从
         */
        send: function (mod_name, action_name, time) {

            if (!this.__enable) {
                return;
            }

            var mod = configs[mod_name];
            var times = {}, time_arr = [];
            var index;

            if (action_name) {
                index = mod[action_name];
                time = time || this.time(mod_name, action_name);
                times[index] = time;
                time_arr.push(index + '(' + action_name + ')' + '=' + time);

                if (mod_name in action_times) {
                    delete action_times[mod_name][action_name];
                }

            } else {
                for (var action in mod) {
                    if (action.indexOf('_') !== 0) {
                        index = mod[action];
                        time = this.time(mod_name, action);
                        times[index] = time;
                        time_arr.push(index + '(' + action + ')' + '=' + time);
                    }
                }
                delete action_times[mod_name];
            }

            if (console) {
                // console.debug('测速 > ' + mod_name + (action_name ? '.' + action_name : '') + ' > ' + mod.__flags.substr(0, mod.__flags.lastIndexOf('-')) + '-' + index + '  ' + time_arr.join(', '));
            }
            this._send(mod.__flags, times);
        },
        send_one: function (flags, index, time) {
            var times = {};
            times[index] = time;
            this._send(flags, times);
        },
        _send: function (flags, index_map_time) {
            if (!index_map_time) return;

            var times_arr = [];
            for (var index in index_map_time) {
                var time = index_map_time[index];
                if (time) {
                    times_arr.push(index + '=' + time);
                }
            }

            if (!times_arr.length) return;

            var flags_arr = flags.split('-'),
                args = ['flag1=' + flags_arr[0], 'flag2=' + flags_arr[1], 'flag3=' + flags_arr[2]].concat(times_arr);
            var uin = require('./query_user').get_uin_num();
            if(uin){
                args.push('uin='+uin);
            }

            var id = log_image_id_seq++,
                img = log_images[id] = new Image();

            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
                delete log_images[id];
            };
            img.src = 'http://isdspeed.qq.com/cgi-bin/r.cgi?' + args.join('&');
        },
        _get_action: function (mod_name, action_name) {
            var mod = action_times[mod_name] || (action_times[mod_name] = {});
            return mod[action_name] || (mod[action_name] = {});
        }
    };
    return speed;
});/**
 * 模块
 *
 * 模块的接口成员：
 *
 * 方法：
 *      render() 渲染当前模块
 *      add_sub_module() 添加一个子模块
 *      get__sub_modules() 获取所有子模块
 *      activate() 激活当前模块（递归激活子模块）
 *      deactivate() 隐藏当前模块（递归隐藏子模块）
 *
 *      TODO get_parent_module() 获取父模块
 *
 * 属性：
 *      ui 当前模块对应的UI模块
 *
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./module",["lib","$","./global.global_event","./constants"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('module'),
        events = lib.get('./events'),

        global_event = require('./global.global_event'),
        constants = require('./constants'),

        defaults = {
            ui: null, // UI Module
            render: $.noop
        },

        empty = [],
        instances = [],

        undefined;


    var Module = function (module_name, options) {
        if (typeof module_name !== 'string') {
            throw 'module.js:无效的module_name参数';
        }

        instances.push(this);

        options && $.extend(this, defaults, options);

        // 初始化参数处理映射
        var me = this,
            invoke_map = this.params_invoke_map,
            invoke_array = [],
            property_name;
        if (invoke_map) {
            for (property_name in invoke_map) {
                if (invoke_map.hasOwnProperty(property_name)) {
                    invoke_array.push({
                        name: property_name,
                        fn: me[invoke_map[property_name]],
                        scope: me
                    });
                }
            }
        }

        this.module_name = module_name;
        this.__rendered = this.__activated = this.__deactivated = false;

        // render 上加一层壳
        var org_render = this.render;
        this.render = function () {

            if (this.__rendered)
                return;

            var render_ui = true;

            // 渲染当前模块
            if (typeof org_render === 'function') {
                // 执行原render方法
                if (!constants.IS_DEBUG) {
                    try {
                        if (org_render.apply(this, arguments) === false) // render 方法返回false可以阻止UI渲染
                            render_ui = false;
                    } catch (e) {
                        var console = lib.get('./console').namespace(this.module_name + '.render');
                        console.error(e.message);
                    }
                }
                else {
                    if (org_render.apply(this, arguments) === false)  // render 方法返回false可以阻止UI渲染
                        render_ui = false;
                }
            }

            // 渲染UI
            if (render_ui && this.ui) {
                if (!Module.is_instance(this.ui)) {
                    throw module_name + '的UI模块必须是Module实例';
                }

                if (!constants.IS_DEBUG) {
                    try {
                        this.ui.render.apply(this.ui, arguments);
                    } catch (e) {
                        var console = lib.get('./console').namespace(this.module_name + '.render');
                        console.error(e.message);
                    }
                }
                else {
                    this.ui.render.apply(this.ui, arguments);
                }
            }

            this.__rendered = true;
            this.trigger('render');
            global_event.trigger(this.module_name + '_render', this);
        };

        // 调用 activated() 方法时，递归调用子模块的 activate() 方法
        // activate 上加一层壳
        var org_activate = this.activate;
        this.activate = function (params) {
            // 事先处理params中注册的属性，调用对应的更新器。
            if (params && invoke_array.length > 0) {
                $.each(invoke_array, function (index, invoke_properties) {
                    var name = invoke_properties.name;
                    if (params.hasOwnProperty(name)) {
                        invoke_properties.fn.call(invoke_properties.scope, params[name]);
                    }
                });
            }
            if (this.__activated || !this.__rendered)
                return;

            this.__deactivated = false;
            this.__activated = true;

            if (typeof org_activate === 'function') {
                org_activate.call(this, params);
            }
            if (this.ui && Module.is_instance(this.ui)) {
                this.ui.activate(params);
            }

            this.trigger('activate', params);

            var sub_modules = this.get__sub_modules();
            if (sub_modules.length) {
                $.each(sub_modules, function (i, mod) {
                    mod.activate(params);
                });
            }
        };

        // 调用 deactivated() 方法时，递归调用子模块的 deactivate() 方法
        // deactivate 上加一层壳
        var org_deactivate = this.deactivate;
        this.deactivate = function () {
            if (this.__deactivated || !this.__rendered)
                return;

            this.__activated = false;
            this.__deactivated = true;

            if (typeof org_deactivate === 'function') {
                org_deactivate.apply(this);
            }
            if (this.ui && Module.is_instance(this.ui)) {
                this.ui.deactivate();
            }

            this.trigger('deactivate');

            var sub_modules = this.get__sub_modules();
            if (sub_modules.length) {
                $.each(sub_modules, function (i, mod) {
                    mod.deactivate();
                });
            }
        };
    };

    $.extend(Module.prototype, events, {
        __is_module: true,

        // todo 默认设置父模块
        add_sub_module: function (mod) {
            if (!Module.is_instance(mod)) {
                throw 'Module#add_sub_module(mod) -> mod 必须是一个 Module 实例';
            }

            this.__sub_modules || (this.__sub_modules = []);

            this.__sub_modules.push(mod);
        },

        get__sub_modules: function () {
            return this.__sub_modules || empty;
        },

        is_rendered: function () {
            return this.__rendered;
        },

        is_activated: function () {
            return this.__activated;
        },

        is_deactivated: function () {
            return this.__deactivated;
        }
    });

    Module.is_instance = function (obj) {
        return obj && obj.__is_module;
    };

    // Module.__instances = instances;

    return Module;
});/**
 * 获取用户信息
 * @author jameszuo
 * @date 13-1-15
 */

define.pack("./query_user",["lib","$","./constants","./request"],function (require, exports, module) {

    var lib = require('lib'),


        $ = require('$'),
        console = lib.get('./console'),
        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        cur_url = lib.get('./url_parser').get_cur_url(),

        constants = require('./constants'),
        request = require('./request'),

        local_uin,  //第一次进入的uin, 用来比较登录态是否过期.
        last_login_uin, // 最近一次进入的uin，用来比较是用户故意切换不同用户还是在其它页面无意切换的

        cached_user,
        loading_request,

        switching_user, //是否是切换用户登陆

        is_serv_put_data = false, // 服务端已吐出用户信息
        serv_data_loaded = false, // 服务端直出的信息已加载

        ok_stack = [],
        fail_stack = [],

        Math = window.Math,

        undefined;


    var query_user = {

        /**
         * 处理直出数据
         * @param {Object} usr_rsp_head 从CGI返回的header
         * @param {Object} usr_rsp_body 从CGI返回的body
         */
        set_init_data: function (usr_rsp_head, usr_rsp_body) {
            is_serv_put_data = true;
            serv_data_loaded = false;
             return this._set_user_from_cgi_rsp(usr_rsp_head, usr_rsp_body);
        },

        /**
         * 从CGI响应结果中获取User
         * @param {Object} head
         * @param {Object} body
         * @param {Boolean} [change_local_uin] 强制更新uin，默认false
         * @private
         */
        _set_user_from_cgi_rsp: function (head, body, change_local_uin) {
            cached_user = new User(head.uin, body);

            if (change_local_uin || !local_uin) {
                local_uin = cached_user.get_uin();
            }

            return cached_user;
        },

        /**
         * 查询登录用户的信息
         * @param {Boolean} force 是否从服务器获取，默认 false
         * @param {Boolean} cavil 挑剔（会话超时时弹出登录框、独立密码失效时弹出独立密码框）
         * @param {boolean} reset_tip_status 是否重置各种‘首次访问’状态，默认false（如是否是QQ网盘迁移用户首次访问微云等）
         * @param {Function} silent_callback 回调方法，传入该参数后将不会触发 load/error 事件
         * @param {Boolean} change_local_uin 强制更新uin，默认false
         */
        get: function (force, cavil, reset_tip_status, silent_callback, change_local_uin) {
            var me = this,
                silent = $.isFunction(silent_callback);

            reset_tip_status = reset_tip_status === true;

            // 如果是从服务端直出的数据，且数据尚未加载，则触发load、done事件 --- 直出时即使直接创建了user，也需要触发事件 - james
            if (is_serv_put_data && !serv_data_loaded) {
                serv_data_loaded = true;
                setTimeout(function () {
                    me._ok_callback(cached_user);
                    query_user.trigger('load', cached_user);
                    query_user.trigger('done', '', 0);
                }, 20);
            }
            // 如果不强制刷新, 那么当已有user信息时不重复获取
            else if (!force && cached_user) {
                setTimeout(function () {
                    me._ok_callback(cached_user);
                }, 20);
            }
            else {
                if (loading_request && this.get_switching_user()) {//如果是切换用户登陆，要把上一次请求销毁，避免无法发出请求 fixed bug48758599 by hibincheng
                    loading_request.destroy();
                }
                else if (loading_request) {
                    return this;
                }

                loading_request = request.get({  // james 2013-6-5 请求有可能因UIN变化而未发出
                    cmd: 'query_user',
                    cavil: cavil,
                    change_local_uin: change_local_uin,
                    body: reset_tip_status ? {
                        show_migrate_fav: 1,
                        show_qqdisk_firstaccess_flag: 1
                    } : {}
                })
                    .ok(function (msg, body, header) {

                        me._set_user_from_cgi_rsp(header, body, change_local_uin);

                        if (silent) {
                            silent_callback.call(me, cached_user);
                        } else {
                            me._ok_callback.call(me, cached_user);
                            query_user.trigger('load', cached_user);
                        }
                    })
                    .fail(function (msg, ret) {
                        if (!silent) {
                            me._fail_callback.apply(me, arguments);
                            query_user.trigger('error', msg, ret);
                        }
                    })
                    .done(function (msg, ret) {
                        loading_request = false;
                        if (!silent) {
                            query_user.trigger('done', msg, ret);
                        }
                    })
            }
            return this;
        },


        /**
         * 检查用户会话状态是否有效
         */
        check: function () {
            var def = $.Deferred();
            request.get({ cmd: 'query_user', cavil: true })
                .ok(function () {
                    def.resolve();
                })
                .fail(function () {
                    def.reject();
                });
            return def;
        },


        ok: function (fn) {
            if ($.inArray(fn, ok_stack) === -1) {
                ok_stack.push(fn);
            }
            return this;
        },

        fail: function (fn) {
            if ($.inArray(fn, fail_stack) === -1) {
                fail_stack.push(fn);
            }
            return this;
        },

        _ok_callback: function () {
            var me = this;
            if (ok_stack.length) {
                $.each(ok_stack, function (i, fn) {
                    fn.call(me, cached_user);
                });
                ok_stack = [];
            }
        },
        _fail_callback: function () {
            var me = this,
                args = $.makeArray(arguments);
            if (fail_stack.length) {
                $.each(fail_stack, function (i, fn) {
                    fn.apply(me, args);
                });
                fail_stack = [];
            }
        },
        //重新登陆时，切换用户登陆标识
        set_switching_user: function (done) {
            switching_user = true;
        },

        get_switching_user: function () {
            return switching_user;
        }
    };

    $.extend(query_user, events);

    // 获取当前登录用户的uin
    query_user.get_uin = function () {
        return cookie.get('uin') || cookie.get('clientuin'); // todo ok.oa.com uin
    };

    // 获取当前登录用户的skey
    query_user.get_skey = function () {
        return cookie.get('skey');
    };

    // 获取当前登录用户的clientskey
    query_user.get_client_skey = function () {
        console.warn('query_user.get_client_skey() 尚未验证');
        return cur_url.get_param('clientuin'); // todo 验证
    };

    // 获取无前缀的用户uin
    query_user.get_uin_num = function () {
        return parseInt(this.get_uin().replace(/^[oO0]*/, '')) || '';
    };
    
    // 获取uin的hex代码
    query_user.get_uin_hex = function(){
        var uin = query_user.get_uin_num() || 0;
        var hex = uin.toString(16);
        // 补到8位
        hex = new Array(8-hex.length+1).join('0') + hex;
        // 用字节序
        return hex.match(/../g).reverse().join('');
    };

    // 清除用户的登录态
    query_user.destroy = function () {
        var cookie_options = {
            domain: constants.MAIN_DOMAIN,
            path: '/'
        };
        $.each(['skey', 'indep', 'uin', 'clientuin'], function (i, key) {
            cookie.unset(key, cookie_options);
        });

        return true;
    };

    query_user.check_cookie = function () {
        return !!(this.get_uin() && this.get_skey());
    };

    // 获取当前用户（缓存）
    query_user.get_cached_user = function () {
        return cached_user;
    };
    
    /**
     * 快捷用法，当用户信息首次加载完成时触发，如果调用前已经加载过，也会执行一次
     * 
     * @param {Function} callback
     * @param {Object} scope (optional)
     * @return {$.Deferred} def 可以通过它中止尚未完成的回调，或附加额外的回调
     */
    query_user.on_ready = function(callback, scope){
        var def = $.Deferred().done(function(user){
            callback.call(scope, user);
        });
        if(cached_user){
            def.resolve(cached_user);
        }else{
            query_user.once('load', def.resolve, def);
        }
        return def;
    };
    
    /**
     * 快捷用法，当用户信息每次加载完成时触发，如果调用前已经加载过，也会执行一次
     * 
     * @param {Function} callback
     * @param {Object} scope (optional)
     * @return {$.Deferred} def 可以通过它中止尚未完成的回调，也可以通过progress来附加新的回调
     */
    query_user.on_every_ready = function(callback, scope){
        var def = $.Deferred().progress(function(user){
            callback.call(scope, user);
        });
        var init_def = query_user.on_ready(def.notify, def).done(function(){
            query_user.on('load', def.notify, def);
            def.fail(function(){
                query_user.off('load', def.notify, def);
            });
        });
        return def;
    };

    query_user.get_local_uin = function () {
        return local_uin;
    };
    
    // 最近一次在此页面登录的uin（数字）
    query_user.get_last_login_uin = function(){
        return last_login_uin;
    };
    query_user.set_last_lgoin_uin = function(){
        last_login_uin = query_user.get_uin_num();
    };

    // james: 修复UIN不是一个有效的值时（如abc），服务端返回1014的问题
    if (typeof query_user.get_uin_num() !== 'number') {
        query_user.destroy();
    }

    var User = function (uin, data) {
        this._uin = uin;
        this._d = data;
    };


    User.prototype = {
        get_uin: function () {
            return this._uin;
        },
        /**
         * @deprecated 使用 query_user.get_skey()
         */
        get_skey: function () {
            return query_user.get_skey()
        },
        has_pwd: function () {
            return this._d['isset_passwd'] === 1;
        },
        set_has_pwd: function (has) {
            this._d['isset_passwd'] = has ? 1 : 0;
        },
//        get_MaxBatchCopyFileCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileCnt']) || 0;
//        },
//        get_MaxBatchCopyFileToOffineCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileToOffineCnt']) || 0;
//        },
//        get_MaxBatchCopyFileToOtherbidCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileToOtherbidCnt']) || 0;
//        },
        get_files_download_count_limit: function () {
            return this._get_int('MaxBatchDownloadFileCnt', 10);
        },
        get_files_remove_step_size: function () {
            return Math.min(this._get_int('MaxBatchDeleteFileCnt'), this._get_int('MaxBatchDeleteFolderCnt'), 10);
        },
        get_files_move_step_size: function () {
            return Math.min(this._get_int('MaxBatchMoveFileCnt'), this._get_int('MaxBatchMoveFolderCnt'), 10);
        },
        get_rec_restore_step_size: function () {
            return Math.min(this._get_int('MaxBatchRestoreFileCnt'), this._get_int('MaxBatchRestoreFolderCnt'), 10);
        },
        get_MaxFileAndFolderCnt: function () {
            return this._get_int('MaxFileAndFolderCnt', 65534);
        },
        get_dir_count: function () {
            return this._d['dir_count']
        },
        get_dir_level_max: function () {
            return this._d['dir_level_max']
        },
        get_file_count: function () {
            return this._d['file_count']
        },
        get_filename_max_len: function () {
            return this._get_int('filename_max_len');
        },
        get_filepath_max_len: function () {
            return this._get_int('filepath_max_len');
        },
        get_get_timestamp_interval: function () {
            return this._d['get_timestamp_interval']
        },
        get_getlist_timestamp_flag: function () {
            return this._d['getlist_timestamp_flag']
        },
        get_root_key: function () {
            return this._d['root_key']
        },
        get_main_key: function () {
            return this._d['main_key']
        },
        get_main_dir_key: function () {
            return this._d['main_dir_key']
        },
        get_main_dir_name: function () {
            return this._d['main_dir_name']
        },
        get_max_batch_dirs: function () {
            return this._d['max_batch_dirs']
        },
        get_max_cur_dir_file: function () {
            return this._d['max_cur_dir_file']
        },
        get_max_dir_file: function () {
            return this._d['max_dir_file']
        },
        get_max_dl_tasks: function () {
            return this._d['max_dl_tasks']
        },
        get_max_dts: function () {
            return this._d['max_dts']
        },
        get_max_fz: function () {
            return this._d['max_fz']
        },
        get_max_indexs_per_dir: function () {
            return this._d['max_indexs_per_dir']
        },
        get_max_interval_getlist: function () {
            return this._d['max_interval_getlist']
        },
        get_max_note_len: function () {
            return this._get_int('max_note_len');
        },
        get_max_retry: function () {
            return this._d['max_retry']
        },
        get_max_retry_interval: function () {
            return this._d['max_retry_interval']
        },
        get_max_single_file_size: function () {
            return this._d['max_single_file_size']
        },
        get_max_tasks: function () {
            return this._d['max_tasks']
        },
        get_max_thread_getlist: function () {
            return this._d['max_thread_getlist']
        },
        get_max_ul_tasks: function () {
            return this._d['max_ul_tasks']
        },
        get_pic_key: function () {
            return this._d['pic_key']
        },
        get_qdisk_psw: function () {
            return this._d['qdisk_psw']
        },
        get_stat_flag: function () {
            return this._d['stat_flag']
        },
        get_stat_interval: function () {
            return this._d['stat_interval']
        },
        get_total_space: function () {
            return parseInt(this._d['total_space']);
        },
        get_used_space: function () {
            // 已使用的空间可能会大于空间上限, 这里fix一下  @jameszuo
            // james, 你好, 这里又被产品打回了，要显示实际的大小. @svenzeng
            //return Math.min(this._get_int('used_space'), this.get_total_space());
            return this._get_int('used_space');
        },
        get_user_authed: function () {
            return this._d['user_authed']
        },
        get_user_ctime: function () {
            return this._d['user_ctime']
        },
        get_user_mtime: function () {
            return this._d['user_mtime']
        },
        get_user_type: function () {
            return this._d['user_type']
        },
        get_user_wright: function () {
            return this._d['user_wright']
        },
        get_vip_level: function () {
            return this._d['vip_level']
        },
        // 昵称
        get_nickname: function () {
            return this._d['nickname'];
        },

        // 判断是否QQ网盘迁移用户
        is_qqdisk_user: function () {
            return this._d['qqdisk_user_flag'] == 1;
        },

        // 判断QQ网盘迁移用户是否首次访问微云网盘
        is_qqdisk_user_first_access: function () {
            return this._d['qqdisk_firstaccess_flag'] == 1;
        },

        // 判断用户在QQ网盘中是否已设置独立密码
        has_qqdisk_pwd: function () {
            return this._d['isset_pwd_qqdisk'] == 1;
        },

        // 判断用户是否是网络收藏夹用户
        is_favorites_user: function () {
            return !!this._d['IsFavoritesUser'];
        },

        // 判断是否网络收藏夹用户首次访问微云
        is_fav_user_first_access: function () {
            return this._d['MigrateFavorites'] == 1;
        },

        // 是否已安装手机微云
        is_wy_mobile_user: function () {
            return this._d['weiyun_mobile'] == 1;
        },

        // 是否是微云收藏用户
        is_weixin_user: function () {
            return this._d['weixin_collect_flag'] == 1;
        },

        _get_int: function (key, defaults) {
            return parseInt(this._d[key]) || defaults || 0;
        },
        //是否相册已经迁移至2.0
        get_ps_move_flag: function() {
            return true;
        },
        /**
         * 下载时需要带上这个码 - james
         * @returns {String}
         */
        get_checksum: function () {
            return this._d['checksum'];
        }

    };

    return query_user;
});
/**
 * 公用的服务端存取key-value配置
 * @author hibincheng
 * @date 2013-11-18
 */
define.pack("./remote_config",["lib","$","./request"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        request = require('./request'),

        DEFAULT_CGI = 'http://web2.cgi.weiyun.com/config.fcg',
        GET_CMD = 'get',
        SET_CMD = 'set',

        undefined;

    /**
     * 获取配置
     * @param key
     * @param default_value
     * @returns {*}
     */
    function remote_get(key, default_value) {
        var keys = [],
            def = $.Deferred();

        if(arguments.length === 1 && $.isArray(key)) { //参数为[{key:xx,default:xx},{}]形式
            keys = key;
        } else {
            keys.push({
                'key': key,
                'default': default_value
            });
        }

        $.each(keys, function(i, item) {
            if(!item['default'] && item['default'] !== '') {
                item['default'] = '';//默认为空字符串
            }
        });

        var req = request.get({
            url: DEFAULT_CGI,
            cmd: GET_CMD,
            re_try:3,
            cavil: true,
            body: {
                keys: keys
            }
        }).
            ok(function(msg, body) {
                def.resolve(body.values);
            })
            .fail(function(msg, ret) {
                def.reject(msg, ret);
            });

        def.abort = function() { //供deffered进行请求中止
            req.destroy();
        };

        return def;
    }

    /**
     * 设置配置  （注意value只能是字符串）
     * @param key
     * @param value
     * @returns {*}
     */
    function remote_set(key, value) {
        var pairs = [],
            def = $.Deferred();

        if(arguments.length === 1 && $.isArray(key)) { // {..} json格式参数
            pairs = key;
        } else {
            pairs.push({
                key: key,
                value: value
            });
        }

        var req = request.post({
            url: DEFAULT_CGI,
            cmd: SET_CMD,
            re_try:3,
            cavil: true,
            body: {
                pairs: pairs
            }
        })
            .ok(function(msg, body) {
                def.resolve(body);
            }).
            fail(function(msg, ret) {
                def.reject(msg, ret);
            });

        def.abort = function() {//供deffered进行请求中止
            req.destroy();
        };

        return def;
    }

    //对外api
    return {
        get: remote_get,
        set: remote_set
    };
});/**
 * 异步请求
 * @author jameszuo
 * @date 13-3-8
 */
define.pack("./request",["lib","$","./constants","./ret_msgs","./urls","./global.global_event","./cgi_ret_report","./m_speed","./tmpl","./configs.ops","i18n","./user_log","./query_user"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        console = lib.get('./console').namespace('request'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        JSON = lib.get('./json'),
        random = lib.get('./random'),
        collections = lib.get('./collections'),
        url_parser = lib.get('./url_parser'),
        cookie = lib('./cookie'),

        constants = require('./constants'),
        ret_msgs = require('./ret_msgs'),
        urls = require('./urls'),
        session_event = require('./global.global_event').namespace('session'),
        cgi_ret_report = require('./cgi_ret_report'),
        m_speed = require('./m_speed'),

        tmpl = require('./tmpl'),
        ops = require('./configs.ops'),
        user_log,
        _ = require('i18n').get('./pack'),
        l_key = 'common.request',
        root = window,

    // ---------------------------------------------------------

    // 请求可能出现的错误类型
        error_status = {
            error: _(l_key,'网络错误, 请稍后再试'),
            timeout: _(l_key,'连接服务器超时, 请稍后再试'),
            parsererror: _(l_key,'服务器出现错误, 请稍后再试')
        },

    // 请求出现错误时, 返回的错误码
        unknown_code = ret_msgs.UNKNOWN_CODE,
        unknown_msg = ret_msgs.UNKNOWN_MSG,

    // ---------------------------------------------------------

        main_v = constants.IS_APPBOX ? 12 : 11,

        os_type = constants.APPID,

        default_body = {
        },

        default_header = {
            cmd: '',
            main_v: main_v,
            proto_ver: 10006,
            sub_v: 1,
            encrypt: 0,
            msg_seq: 1,
            source: os_type,
            appid: os_type,
            client_ip: '127.0.0.1',
            token: ''
        },

        default_headers_v2 = { cmd: '', appid: constants.APPID},

        default_options = {
            url: '',
            cmd: '',
            cgi_v2: false, // 使用 cgi 2.0（header简化）
            just_plain_url: false, // 是否只采用URL而不包含data参数（req_header, req_body）
            body: null,
            header: null,
            cavil: false,
            resend: false,
            re_try: 2,   //重试参数, @svenzeng
            re_try_flag: false     //是否经过了重试
        },

    // 超时时间
        callback_timeout = 10,

        set_timeout = setTimeout,
        D = Date,

        undefined;


    var request = {

        /**
         * 发送GET请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {JsonpRequest}
         */
        get: function (options) {
            return this._new_request(JsonpRequest, arguments);
        },

        /**
         * 发送POST请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 会话超时后，是否触发『会话超时』事件，默认false
         *   - {Boolean} [resend] 会话超时重新登录后，是否重新发送该请求，默认false
         * @returns {IframePostRequest}
         */
        post: function (options) {
            return this._new_request(IframePostRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_get: function (options) {
            options.method = 'GET';
            return this._new_request(CrossDomainRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_post: function (options) {
            options.method = 'POST';
            return this._new_request(CrossDomainRequest, arguments);
        },

        _new_request: function (RequestClass, args_) {
            var options;

            if (args_ && typeof args_[0] === 'object') {
                options = args_[0];
            }
            else {
                throw 'request.get / .post 无效的请求参数';
            }

            return new RequestClass(options);
        }
    };

    var AbstractRequest = function (options) {
        this._options = $.extend({}, default_options, options, {
            ok_fn: options.ok_fn || [],
            fail_fn: options.fail_fn || [],
            done_fn: options.done_fn || []
        });
    };

    AbstractRequest.prototype = {
        _default_url: null, // 请覆盖

        _def_error_data: {
            rsp_header: {
                ret: 404,//unknown_code,
                msg: _(l_key,'连接服务器超时, 请稍后再试')
            },
            rsp_body: {}
        },

        _unknown_error_data: {
            rsp_header: {
                ret: unknown_code,
                msg: error_status[status] || unknown_msg
            },
            rsp_body: {}
        },

        is_abort: false,

        _send: null,  // 请覆盖

        destroy: null,  // 请覆盖

        ok: function (fn) {
            if (this._destroied)
                return;
            this._options.ok_fn.push(fn);
            return this;
        },

        fail: function (fn) {
            if (this._destroied)
                return;
            this._options.fail_fn.push(fn);
            return this;
        },

        done: function (fn) {
            if (this._destroied)
                return;
            this._options.done_fn.push(fn);
            return this;
        },

        _get_data: function () {
            var o = this._options,
                header = $.isFunction(o.header) ? o.header() : o.header,
                body = $.isFunction(o.body) ? o.body() : o.body,
                data;

            if (o.cgi_v2) {
                header = $.extend({}, default_headers_v2, header, { cmd: o.cmd });
            } else {
                header = $.extend({}, default_header, header, {
                        cmd: o.cmd,
                        token: security.getAntiCSRFToken()
                });
            }
            body = $.extend({}, body);

            data = {
                req_header: header,
                req_body: body
                };
            return data;
        },

        _get_cgi_url: function (data, params) {
            var me = this,
                o = me._options,
                cmd = data.req_header.cmd,
                cgi_url;

            // 使用自定义的URL
            var special_url = url_parser.parse(o.url || me._default_url);
            // 在URL中插入
            cgi_url = urls.make_url(special_url.get_url(), $.extend({
                cmd: cmd,   // 默认会有一个cmd参数，可被自定义URL中的参数覆盖。如 http://qq.com/?a=1&cmd=XXX 会保持不变，而 http://qq.com/?a=1 会变为 http://qq.com/?a=1&cmd=SOMETHING
                g_tk: get_g_tk()//g_tk
            }, special_url.get_params(), params));

            return cgi_url;
        },

        _log_rey_succ: function () {
            if (this._options.re_try_flag === true) {
                user_log = user_log || require('./user_log');
                user_log('re_try_flag', 0, {
                    extString1: this._options.cmd
                });
            }
        },

        _callback: function (data, is_timeout) {
            if (this._destroied)
                return;

            var end_time = new Date().getTime();

            var me = this;

            this._clear_timeout();

            // fix
            if (!data.rsp_body)
                data.rsp_body = {};
            if (!data.rsp_header)
                data.rsp_header = {};

            var
                url = me._options.url || me._default_url,
                cmd = me._options.cmd,
                header = data.rsp_header,
                body = data.rsp_body,
                ret = (typeof header.ret === 'number' ? header.ret : data.ret) || 0, // 优先使用 data.rsp_header.ret，然后使用 data.ret
                msg = header.msg || ret_msgs.get(ret),
                cavil = me._options.cavil,
                resend = me._options.resend;

            if (ret === 0) {

                // ok
                $.each(me._options.ok_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        me._log_rey_succ();
                        fn.call(me, msg, body, header, data);
                    }
                });

            } else {

                var is_sess_timeout = ret_msgs.is_sess_timeout(ret),
                    is_indep_invalid = ret_msgs.is_indep_invalid(ret);

                // 如果是「挑剔」模式，就会弹出登录框，所以就不再输出错误消息
                if (cavil && is_sess_timeout || is_indep_invalid) {
                    msg = '';
                }

                $.each(me._options.fail_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, ret, body, header, data);
                    }
                });

                // 未登录
                if (cavil && is_sess_timeout) {
                    session_event.trigger('session_timeout', resend ? function () {
                        me._options.resend = false;
                        me._send();
                    } : null);
                }
                // 独立密码无效
                else {
                    if (cavil && is_indep_invalid) {
                        session_event.trigger('invalid_indep_pwd', resend ? function () {
                            me._options.resend = false;
                            me._send();
                        } : null, body);
                    }
                }
            }

            // done
            $.each(me._options.done_fn, function (i, fn) {
                if ($.isFunction(fn)) {
                    fn.call(me, msg, ret, body, header, data);
                }
            });

            me.destroy();

            set_timeout(function () {
                reporter.all(url, cmd, ret, end_time - me.__start_time, is_timeout);
            }, 0);
        },

        /**
         * 检查是否允许发送请求
         * @param {Boolean} [change_local_uin] 默认false
         * @returns {boolean}
         * @private
         */
        _before_start: function (change_local_uin) {

            // 如果允许修改 local_uin，则不检查 uin 是否已变化
            if (change_local_uin === true) {
                return true;
            }

            // 发送请求之前，发现 uin 已变化，则要求登录确认，登录完成后刷新页面
            var me = this,
                query_user = require('./query_user'),
                local_uin = query_user.get_local_uin(),
                now_uin = query_user.get_uin_num(),
                uin_changed = local_uin && local_uin !== now_uin;
            if (!uin_changed) {
                return;
            }
            var reload = function () {
                window.onbeforeunload = null;
                window.location.reload();
            };
            // 如果uin不同是因为用户主动切换帐号，直接刷新页面
            if (query_user.get_last_login_uin() === now_uin) {
                reload();
                return;
            }
            // 如果是被动的uin不同（例如在其它页面切换了登录帐号，再例如超时uin被清掉了）
            // 尝试让用户登录回原来的帐号
            if (me._options.switched !== true) { // 防止重复处理
                query_user.set_switching_user(true); //标识是切换用户登陆
                session_event.trigger('session_timeout', function () {
                    me._options.switched = true;
                    me._options.resend = false;
                    me._send();
                });
                return false;
            }
        },

        _is_need_retry: function () {
            return this._options.re_try-- > 0;
        },

        _retry: function () {
            this._options.re_try_flag = true;
            return this._send();
        },

        _timeout: function () {
            this.destroy(); // 超时后销毁请求，避免出现即提示错误又响应操作的问题
            if (this._is_need_retry()) {  //fail
                return this._retry();
            }
            var error_data = this.is_abort ? this._def_error_data : this._unknown_error_data;
            this._callback(error_data, true);
        },

        _start_timeout: function () {
            var me = this;
            me.__timer = set_timeout(function () {
                me._timeout();
            }, callback_timeout * 1000);
        },

        _clear_timeout: function () {
            clearTimeout(this.__timer);
        }
    };

    // ========================================================================================================

    var JsonpRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    $.extend(JsonpRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this,
                o = me._options;

            if (me._before_start && me._before_start(o.change_local_uin) === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                cgi_url = me._get_cgi_url(data),
                callback_name = me._callback_name = 'get_' + _rand();

            this.__start_time = new D().getTime();

            var jqXHR = me._req = $.ajax({
                url: cgi_url,
                dataType: 'jsonp',
                cache: false,
                jsonpCallback: callback_name,
                data: o.just_plain_url ? undefined : {
                    data: JSON.stringify(data)
                }
            });


            me._start_timeout();

            jqXHR
                .success(function (data) {
                    if (o.adaptDate) {//允许适配数据
                        data = o.adaptDate(data);
                    }
                    set_timeout(function () { // 脱离response中的try块
                        me._callback(data, false);
                    }, 0);
                })
                .error(function (jqXHR, status) {
                    console.error('request error:', status);
                    me.is_abort = (status == 'abort');
                    /*if (status !== 'abort') {
                     console.error('request error:', status);
                     me._callback({
                     rsp_header: {
                     ret: unknown_code,
                     msg: error_status[status] || unknown_msg
                     },
                     rsp_body: {}
                     }, false);
                     }*/
                });
            return jqXHR;
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._options.ok_fn = [];
            me._options.fail_fn = [];
            me._options.done_fn = [];
        }
    });


    // ========================================================================================================

    var IframePostRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    IframePostRequest._iframe_pool = [];
    IframePostRequest._iframe_pool_limit = 15;
    IframePostRequest._get_$container = function () {
        return this._$div || (this._$div = $('<div data-id="post_iframe_cont" style="display:none;"></div>').appendTo(document.body))
    };

    $.extend(IframePostRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this;

            if (me._before_start && me._before_start() === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                callback = me._callback_name = 'post_callback_' + _rand(),
                cgi_url = me._get_cgi_url(data, { callback: callback }),

                $form = this._get_form(data, callback);


            // 全局回调
            root[callback] = function (data) {
                set_timeout(function () { // 脱离response中的try块
                    me._callback(data, false);
                }, 0);
            };

            me._start_timeout();


            this._get_iframe(function ($iframe) {
                me._$iframe = $iframe;

                me.__start_time = new D().getTime();

                $iframe.attr('data-action', cgi_url);
                $form
                    .attr('action', cgi_url)
                    .attr('target', $iframe.attr('name'))
                    .submit();
            });

            return this;
        },

        _get_form: function (data, callback) {
            var $form = this._$form = $('<form style="display:none;" method="POST"></form>').appendTo(IframePostRequest._get_$container());

            if (!this._options.just_plain_url) {

                var str_data = JSON.stringify(data);

                $('<input type="hidden"/>').attr('name', 'data').val(str_data).appendTo($form);
                $('<input type="hidden"/>').attr('name', 'callback').val(callback).appendTo($form);
            }

            return $form;
        },


        _get_iframe: function (_callback) {
            var me = this,
                free_iframes = IframePostRequest._iframe_pool,
            // 先从池中取出空闲的iframe
                $iframe = free_iframes.shift(),

                callback = function ($iframe) {
                    _callback($iframe);
                };

            if ($iframe) { // 空闲iframe
                $iframe.data('released', false); // 标记iframe正在被使用
                callback($iframe);
            }
            else {

                $iframe = $("<iframe src=\"" + constants.DOMAIN + "/set_domain.html\" name=\"" + _rand() + "\" style=\"display:none;\"></iframe>");

                // 请求 set_domain.html 完成后执行回调，回调完成后，再放入池中
                $iframe.one('load', function () {

                    // iframe 业务使用完毕后放入池中
                    $iframe.on('load', function () {
                        me._release_iframe($iframe);
                    });

                    // 回调
                    callback($iframe);
                });

                $iframe.appendTo(IframePostRequest._get_$container());
            }
        },

        _release_iframe: function ($iframe) {
            set_timeout(function () {
                var free_iframes = IframePostRequest._iframe_pool;

                // 如果个数未满足池大小上限，则加入到池中
                if (free_iframes.length < IframePostRequest._iframe_pool_limit) {

                    // abort
                    if ($iframe.data('released') === false) {
                        try {
                            var iframe_win = $iframe[0].contentWindow;
                            if ($.browser.msie) {
                                iframe_win.document.execCommand('Stop');
                            } else {
                                iframe_win.stop();
                            }
                            var script = iframe_win.document.getElementsByTagName('script')[0];
                            if (script) {
                                script.parentNode.removeChild(script);
                            }
                        } catch (e) {
                        }
                        // released
                        $iframe.data('released', true);  // 标记iframe没有被使用
                    }

                    // 不在池中，才push
                    if ($.inArray($iframe, free_iframes) == -1) {
                        free_iframes.push($iframe);
                    }
                }
                // 否则销毁
                else {
                    $iframe.remove();
                }
            }, 0);
        },

        destroy: function () {
            this._clear_timeout();
            if (this._callback_name) {
                window[this._callback_name] = $.noop;
            }
            // iframe 由池控制，不在这里销毁，仅断开引用
            if (this._$iframe) {
                this._release_iframe(this._$iframe);
                this._$iframe = null;
            }
            if (this._$form) {
                this._$form.remove();
                this._$form = null;
            }
            if (this._$div) {
                this._$div.remove();
                this._$div = null;
            }
        }
    });

    // ========================================================================================================

    var CrossDomainRequest = function (options) {
        AbstractRequest.call(this, options);
        if (!options.url) {
            console.error('发送CrossDomainRequest请求请带上url参数');
            return;
        }
        this._send();
    };
    CrossDomainRequest._Requests = {};
    $.extend(CrossDomainRequest.prototype, AbstractRequest.prototype, {
        _default_url: 'you_forgot_the_url',
        _re_del_get_prefix: /^\s*try\s*\{\s*\w+\s*\(\s*/,
        _re_del_get_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*$/,
        _re_del_post_prefix: /^\s*<script>.*\btry\s*\{\s*parent\.\w+\s*\(\s*/,
        _re_del_post_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*<\/script>\s*$/g,

        _send: function () {
            var me = this, o = me._options;

            if (me._before_start && me._before_start() === false) return false;    //如果before返回false, 阻断后续请求

            o.method = o.method ? o.method.toUpperCase() : 'GET';
            var data = me._get_data(),
                url_obj = url_parser.parse(o.url),
                url = url_obj.protocol + '//' + url_obj.host + url_obj.pathname;

            if (o.just_plain_url) {
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    g_tk: get_g_tk(),
                    callback: 'X_' + o.method,
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'GET') {
                // 添加 cmd 和 g_tk 参数
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    cmd: o.cmd,
                    g_tk: get_g_tk(),
                    data: JSON.stringify(data),
                    callback: 'X_GET',
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'POST') {
                url = urls.make_url(url, {
                    cmd: o.cmd,
                    g_tk: get_g_tk(),
                    callback: 'X_POST',
                    _: _ts()
                });
                data = urls.make_params($.extend({}, url_obj.get_params(), {
                    data: JSON.stringify(data)
                }));
            }
            else {
                throw '暂不支持' + o.method;
            }

            this._send_to_iframe(url, url_obj, data);
        },

        _send_to_iframe: function (url, url_obj, data) {
            var me = this,
                o = me._options;

            this._get_request(url_obj, function (Request) {
                // me._destroied && console.debug('1 destroied!');

                var req = me._req = new Request({
                    url: url,
                    data: data,
                    method: o.method,
                    callback: function (http_ok, status, text) {
                        // error
                        if (typeof status === 'string')
                            return console.error(text);

                        // 如果已销毁，则不做任何处理
                        if (me._destroied)
                            return;

                        var rsp_data;
                        if (http_ok) {
                            if (o.method === 'GET') {
                                text = text.replace(me._re_del_get_prefix, '').replace(me._re_del_get_suffix, '');
                            } else if (o.method === 'POST') {
                                text = text.replace(me._re_del_post_prefix, '').replace(me._re_del_post_suffix, '');
                            }
                            try {
                                rsp_data = $.parseJSON(text);
                            } catch (e) {
                                console.error('XHR callback parsing json failed.', e.message);
                            }
                        }

                        // 数据适配数据
                        if (o.data_adapter) {
                            var headers_map = {};
                            $.each(this.getAllResponseHeaders().split('\r\n'), function (i, h) {
                                var kv = h.split(':');
                                headers_map[$.trim(kv[0])] = $.trim(kv[1]);
                            });
                            rsp_data = o.data_adapter(rsp_data || {}, headers_map);
                        }

                        if (!rsp_data || $.isEmptyObject(rsp_data)) {
                            rsp_data = {
                                rsp_header: {
                                    ret: status,
                                    msg: me._def_error_data.rsp_header.msg
                                },
                                rsp_body: {}
                            };
                        }

                        // 重试
                        var ret = rsp_data.hasOwnProperty('ret') ? rsp_data.ret : rsp_data.rsp_header.ret;
                        if (me._is_need_retry() && (!http_ok || ret_msgs.is_need_retry(ret))) {
                            return me._retry();
                        }

                        set_timeout(function () { // 脱离response中的try块
                            me._callback(rsp_data || {}, false);
                        }, 0);
                    }
                });
                me._start_timeout();
                req.send();
            });
        },

        _get_request: function (url_obj, callback) {
            var me = this,
                o = me._options;
            var Request = CrossDomainRequest._Requests[url_obj.host];

            if (Request) {
                callback(Request);
            } else {
                var src = url_obj.protocol + '//' + url_obj.host + '/cdr_proxy.html';
                $('<iframe data-id="cdr_proxy" src="' + src + '" style="display:none;"></iframe>')
                    .on('load', function () {
                        var iframe = this;
                        setTimeout(function () {
                            var Request;
                            try {
                                Request = CrossDomainRequest._Requests[url_obj.host] = iframe.contentWindow.Request;
                            } catch (e) {
                                console.warn('请求' + src + '未能成功，降级为' + (o.method === 'GET' ? 'JSONP' : 'form data')) + '重新发送';
                                me.destroy();
                                return me._comp_req = (o.method === 'GET' ? request.get(o) : request.post(o));
                            }
                            callback(Request);
                        }, 0);
                    })
                    .appendTo(document.body)
            }
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._destroied = true;

            // 销毁降级了的请求对象
            if (me._comp_req) {
                me._comp_req.destroy();
            }
        }
    });


    // ========================================================================================================

    // 统计信息上报
    var reporter = {

        /**
         * 上报所有CGI相关统计
         * @param url
         * @param cmd
         * @param ret 返回码
         * @param time 耗时
         * @param is_timeout 是否已超时
         */
        all: function (url, cmd, ret, time, is_timeout) {
            // 测速上报
            if (!is_timeout) {
                this.m_speed_report(cmd, time);
            }

            // OZ上报
            this.oz_op_report(cmd, ret);

            // 返回码上报
            this.ret_report(url, cmd, ret, time);
        },

        m_speed_report: function (cmd, time) {

            // 测速
            try {
                var m_speed_flags = ops.get_m_speed_flags(cmd);
                if (m_speed_flags) {

                    var m_speed_flags_arr = m_speed_flags.split('-');

                    // 耗时（毫秒）
                    var flags = m_speed_flags_arr.splice(0, 3).join('-');
                    var index = m_speed_flags_arr.pop();

                    m_speed.send_one(flags, index, time);
//                    console.debug('CGI 测速 > ' + cmd + '\t', m_speed_flags + '-' + index, time);
                }
            }
            catch (e) {
            }
        },

        oz_op_report: function (cmd, ret) {
            // OZ log
            var op = ops.get_req_op(cmd);
            if (op) {
                user_log || (user_log = require('./user_log'));
                user_log(op, ret);
            }
        },

        ret_report: function (url, cmd, ret, time) {
            cgi_ret_report.report(url, cmd, ret, time);
        }
    };

    /**
     * 获取 g_tk
     * @returns {string}
     */
    var get_g_tk = function () {
        var s_key = cookie.get('skey'),
            hash = 5381;
        if (!s_key) {
            return '';
        }
        for (var i = 0, len = s_key.length; i < len; ++i) {
            hash += (hash << 5) + s_key.charCodeAt(i);
        }
        return hash & 0x7fffffff;
    };

    var _rand = function () {
        return 'R' + random.random();
    };

    var _ts = function () {
        return new Date().getTime().toString(32);
    };

    return request;
});/**
 * 异步请求队列（壳用于批量删除、批量移动、还原回收站文件等类似功能）
 * @author jameszuo
 * @date 13-3-16
 */
define.pack("./request_task",["lib","$","./ret_msgs","./user_log","./request","./configs.ops","./m_speed"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        ret_msgs = require('./ret_msgs'),
        user_log = require('./user_log'),
        request = require('./request'),
        ops = require('./configs.ops'),
        m_speed = require('./m_speed'),

        D = Date,

        undefined;


    /**
     * 抽象构造函数
     * @param options
     *  -   {Array<File>|Array<FileNode>} files 要处理的文件
     *  -   {String} op in ops 操作名称
     *  -   {Array<Number>} ok_rets 认为成功的返回码，默认 [0]
     *  -   {Number} step_size 每次最多处理的个数
     *  -   {Function({Array<FileNode>} frag_files)} cmd_parser 计算命令字
     *  -   {Function({Array<FileNode>} frag_files)} data_parser 计算请求参数
     * @constructor
     */
    var RequestTask = function (options) {
        var me = this;

        this.options = options;

        me._todo_files = options.files.slice();
        me._step_size = options.step_size;
        me._org_len = options.files.length;
        me._ok_rets = options.ok_rets instanceof Array ? collections.array_to_set(options.ok_rets) : [0];
        me._results = {};

        me._step_index = 0;
    };

    RequestTask.prototype = {

        /**
         * 启动请求
         * @returns {RequestTask}
         */
        start: function () {

            var todo_files = this._todo_files;
            if (todo_files && todo_files.length) {
                this.trigger('start');
                this._step();
            }
            return this;
        },

        _step: function () {
            var
                me = this,
                step_size = me._step_size,
                todo_files = me._todo_files,
                todo_len = me._todo_files.length,
                org_len = me._org_len,

            // 取出要处理的部分（每次取N个类型(is_dir)相同的文件）
                frag_files = collections.sub(todo_files, function (it, i) {
                    // 取出batch_size个以内，且is_dir类型相同的文件
                    return 0 == i || (i < step_size && it.is_dir() == todo_files[i - 1].is_dir());
                });

            if (frag_files.length) {

                if (org_len == todo_files.length) {   // 防止出现异常情况导致死循环
                    console.error('RequestTask 出现异常：collections.sub() 未成功剔除元素');
                    me._process_done();
                    return;
                }

                me._step_index++;

                me.trigger('step', org_len - todo_len + 1, org_len, me._step_index);

                var cmd = me._get_cmd(frag_files),
                    data = me._get_data(frag_files),
                    post_data = {
                        cmd: cmd,
                        body: data,
                        cavil: true
                    };
                if (me.options.url) {
                    post_data.url = me.options.url;
                }
                request
                    .post(post_data)
                    .ok(function (msg, body) {
                        if(me.body_parse[cmd]){
                            me.body_parse[cmd].call(me,body,frag_files,cmd);
                        } else {
                            if (body.results) {
                                me.trigger('step_ok', body.results.length, me._step_index, cmd);

                                var results = body.results;
                                $.each(frag_files, function (i, it) {
                                    me._results[it.get_id()] = results ? parseInt(results[i].result) : ret_msgs.UNKNOWN_CODE;
                                });
                            }
                        }
                    })
                    .fail(function (msg, ret) {

                        $.each(frag_files, function (i, it) {
                            me._results[it.get_id()] = ret;
                        });
                    })
                    .done(function (msg, ret) {

                        me.trigger('step_done', ret);

                        // 如果处理完了，会返回
                        if (!todo_files.length) {
                            me._process_done();
                        } else {
                            me._step();
                        }
                    });

            }
        },
        body_parse:{
            delete_virtual_file: function(body,frag_files,cmd){//离线文件
                var me = this,
                    files = body.files;
                me.trigger('step_ok', files.length, me._step_index, cmd);
                $.each(frag_files, function (i, it) {
                    me._results[it.get_id()] = 0;
                });
            }
        },
        /**
         * 获取请求命令字
         * @param {Array<FileNode>} frag_files 要处理的文件
         * @return {String} 命令字
         * @private
         */
        _get_cmd: function (frag_files) {
            return this.options.cmd_parser(frag_files);
        },

        /**
         * 生成请求参数
         * @param {Array<FileNode>} frag_files 要处理的文件
         * @return {Object} 请求参数
         * @private
         */
        _get_data: function (frag_files) {
            return this.options.data_parser(frag_files);
        },

        /**
         * 处理结果
         * @private
         */
        _process_done: function () {
            var ok_rets = this._ok_rets,
                first_err_ret = 0,
                has_ok = false,
                ok_count = 0, // 成功处理的个数
                ok_ids = {},
                ok_id_arr = [],
                todo_files = this._todo_files;

            $.each(this._results, function (id, ret) {
                var this_is_ok = (ret in ok_rets);
                // 取第一个错误码
                if (!first_err_ret && !this_is_ok) {
                    first_err_ret = ret;
                }
                else if (this_is_ok) {
                    has_ok = true;
                    ok_ids[id] = null;
                    ok_id_arr.push(id);
                    ok_count++;
                }
            });

            // 移除已成功的
            if (has_ok) {
                collections.remove(todo_files, function (file) {
                    return file.get_id() in ok_ids;
                });
                todo_files.length ? console.log('剩余未成功', todo_files.length) : console.log('批量处理完成');
            }

            var all_ok = first_err_ret == 0,
                msg = ret_msgs.get(first_err_ret);

            // 记录log
            if (this.options.op) {
                log(this.options.op, first_err_ret);
            }


            if (all_ok) {
                this.trigger('all_ok', msg, ok_id_arr);
            }
            else if (has_ok && !all_ok) {
                this.trigger('part_ok', msg, ok_id_arr);
            }
            else if (!has_ok && !all_ok) {
                this.trigger('error', msg);
            }

            if (has_ok) {
                this.trigger('has_ok', ok_id_arr, first_err_ret, msg);
            }

            this.trigger('done', first_err_ret);

            this.destroy();
        },

        destroy: function () {
            this.off().stopListening();
        }
    };

    var log = function (op, ret) {
        if (op) {
            user_log(op, ret);
        } else {
            console.error('未指定有效的 op 参数');
        }
    };

    $.extend(RequestTask.prototype, events);

    return RequestTask;
});/**
 * 服务端定义的错误码和消息
 * @author jameszuo
 * @date 13-1-16
 */

define.pack("./ret_msgs",["i18n"],function (require, exports, module) {
    var _ = require('i18n').get('./pack'),
        l_key = 'common.ret_msgs';
    var
        MAP = {
            0: _(l_key,'操作成功'),
            404: _(l_key,'连接服务器超时, 请稍后再试'),
            1000: _(l_key,'出现未知错误'),
            1008: _(l_key,'无效的请求命令字'),
            1010: false, //'对应目录列表查询请求，代表该目录下的信息未修改，客户端不需要刷新该目录下的本地缓存列表。
            1012: _(l_key,'系统正在初始化，请稍后再试'),
            1013: _(l_key,'存储系统繁忙，请稍后再试'),
            1014: _(l_key,'服务器繁忙，请稍后再试'),
            1015: _(l_key,'创建用户失败'),
            1016: _(l_key,'不存在该用户'),
            1017: _(l_key,'无效的请求格式'), // 请求包格式解析错误
            1018: false, //'要拉取的目录列表已经是最新的
            1019: _(l_key,'目录不存在'),
            1020: _(l_key,'文件不存在'),
            1021: _(l_key,'目录已经存在'),
            1022: _(l_key,'文件已经存在'),
            1023: _(l_key,'上传地址获取失败'), //'上传文件时，索引创建成功，上传地址获取失败，客户端需要发起续传'
            1024: _(l_key,'登录状态超时，请重新登录'), // 验证clientkey失败
            1025: _(l_key,'存储系统繁忙，请稍后再试'),
            1026: _(l_key,'父目录不存在'),
            1027: _(l_key,'无效的目录信息'), //不允许在根目录下上传文件
            1028: _(l_key,'目录或文件数超过总限制'),
            1029: _(l_key,'单个文件大小超限'),
            1030: _(l_key,'签名已经超时，请重新验证独立密码'),
            1031: _(l_key,'验证独立密码失败'),
            1032: _(l_key,'设置独立密码失败'),
            1033: _(l_key,'删除独立密码失败'),
            1034: _(l_key,'失败次数过多，独立密码被锁，请稍后再试'),
            1035: _(l_key,'独立密码不能与QQ密码相同'),
            1051: _(l_key,'该目录下已经存在同名文件'),
            1052: _(l_key,'该文件未完整上传，无法下载'),
            1053: _(l_key,'剩余空间不足'),
            1070: _(l_key,'不能分享超过2G的文件'), // 使用批量分享后貌似没有大小限制了，要和@ajianzheng、@bondli 确认下。- james
            1076: _(l_key,'根据相关法律法规和政策，该文件禁止分享'),

            1083: _(l_key,'该目录下文件个数已达上限，请清理后再试'),
            1086: _(l_key,'网盘文件个数已达上限，请清理后再试'),
            1088: _(l_key,'无效的文件名'),
            1117: _(l_key,'部分文件或目录不存在，请刷新后再试'),

            3002: _(l_key,'不能对不完整的文件进行该操作'),
            3008: _(l_key,'不能对空文件进行该操作'),
            4000: _(l_key,'登录状态超时，请重新登录'),
            10000: _(l_key,'登录状态超时，请重新登录'),
            10408: _(l_key,'该文件已加密，无法下载'),

            100001: _(l_key,'参数无效'),
            100002: _(l_key,'无效的请求格式'), //Json格式无效
            100003: _(l_key,'请求中缺少协议头'),
            100004: _(l_key,'请求中缺少协议体'),
            100005: _(l_key,'请求中缺少字段'),
            100006: _(l_key,'无效的命令'),
            100007: _(l_key,'导入数据请求无效'),
            100008: _(l_key,'目录的ID长度无效'), //'目录的key长度无效'
            100009: _(l_key,'文件的SHA值长度无效'),
            100010: _(l_key,'文件的MD5值长度无效'),
            100011: _(l_key,'文件的ID长度无效'),
            100012: _(l_key,'返回数据过长导致内存不足'),
            100016: _(l_key,'指针无效'),
            100017: _(l_key,'时间格式无效'),
            100019: _(l_key,'输入字段类型无效'),
            100027: _(l_key,'无效的文件名'),
            100028: _(l_key,'文件已过期'),
            100029: _(l_key,'文件超过下载次数限制'),
            100030: _(l_key,'收听官方微博失败'),
            100031: _(l_key,'用户未开通微博'),
            100033: _(l_key,'分享到微博失败'),
            100034: _(l_key,'内容中出现脏字、敏感信息'),
            100035: _(l_key,'用户限制禁止访问'),
            100036: _(l_key,'内容超限'),
            100037: _(l_key,'帐号异常'),
            100038: _(l_key,'请休息一下吧'),
            100039: _(l_key,'请勿重复发表微博'),
            100040: _(l_key,'身份验证失败'),

            114200: _(l_key,'文件已被删除'), // 要分享的资源已被删除
            114201: _(l_key,'文件已损坏'),
            190051: _(l_key,'登录状态超时，请重新登录'),
            190054: _(l_key,'访问超过频率限制'),
            190055: _(l_key,'服务器暂时不可用，请稍后再试'),
            199012: _(l_key,'同时操作的目标数量过多'), // 例如限定一次删除100个，发送了包含120对象的请求

            //分享链接邮件发送相关错误码
            102033: _(l_key,'参数错误'),
            102034: _(l_key,'服务器内部错误'),
            102035: _(l_key,'网络错误'),
            102501: _(l_key,'非法请求'),
            102502: _(l_key,'输入参数错误'),
            102503: _(l_key,'非法的用户号码'),
            102504: _(l_key,'QQMail未激活'),
            102505: _(l_key,'skey验证不通过'),
            102506: _(l_key,'邮件被拦截'),
            102508: _(l_key,'发送频率过高'),
            102601: _(l_key,'收件人总数超过限制'),
            102602: _(l_key,'邮件大小超过限制'),
            102603: _(l_key,'邮件发送失败'),


            // 库 - 相册
            210009: _(l_key,'分组不存在'),
            210010: _(l_key,'不能删除默认分组'),
            210011: _(l_key,'分组名不能为空'),
            210012: _(l_key,'分组名重复'),

            // ------ 2.0 返回码 -------------------------
            190013: _(l_key,'无效的请求，请刷新页面后重试')
        },

        UNKNOWN_MSG = _(l_key,'网络错误，请稍后再试'),

        undefined;

    var ret_msgs = {

        get: function (code) {
            var msg = MAP[code];

            if (msg === false) {
                return '';
            } else {
                return msg || UNKNOWN_MSG;
            }
        },

        is_sess_timeout: function (code) {
            return code === 1024 || code === 10000 || code === 190051 || code === 4000;
        },

        is_indep_invalid: function (code) {
            return code === 1031;
        },

        UNKNOWN_MSG: UNKNOWN_MSG,

        TIMEOUT_CODE: 404, // 连接服务器超时

        UNKNOWN_CODE: 1000,
        INVALID_SESSION: 1024,  // 未登录
        INVALID_SESSION2: 10000,
        INVALID_INDEP_PWD: 1031, // 无效的独立密码

        INCOMPLETE_FILE: 3002, // 未完成的文件
        EMPTY_FILE: 3008, // 空文件
        SHARE_FILE_OVER_SIZE: 1070, // 分享的文件过大

        FILE_NOT_EXIST: 1020//文件不存在

    };

    return ret_msgs;
});
/**
 * 
 * @author cluezhang
 * @date 2013-12-2
 */
define.pack("./ui.Editor",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown';
    // 编辑器
    var Editor = inherit(Event, {
        /**
         * @cfg {jQueryElement} $input input对象
         */
        /**
         * @cfg {String} initial_value 初始值
         */
        /**
         * 用户尝试保存时触发
         * @event save
         * @param {String} value
         */
        /**
         * 用户尝试取消时触发
         * @event cancel
         */
        constructor : function(cfg){
            var me = this;
            $.extend(me, cfg);
            
            // 如果在mousedown事件中进行focus，可能会有问题
            setTimeout(function(){
                me.hook();
            }, 0);
        },
        // private
        hook : function(){
            var me = this,
                $input = me.$input;
            me.focus();
            // 监听特殊事件 Enter Esc
            $input.on(key_event, (me.special_key_handler = $.proxy(me.handle_special_key, me)));
            // Blur
            $input.on('blur', (me.blur_handler = $.proxy(me.handle_blur, me)));
            // 主动blur，防止有框选影响
            $(document.body).on('mousedown', (me.initiative_blur_handler = $.proxy(me.handle_initiative_blur, me)));
        },
        unhook : function(){
            var me = this,
                $input = me.$input;
            // 特殊事件 Enter Esc
            $input.off(key_event, me.special_key_handler);
            // Blur
            $input.off('blur', me.blur_handler);
            $(document.body).off('mousedown', me.initiative_blur_handler);
        },
        handle_special_key : function(e){
            var value;
            // 按回车，尝试保存
            if (e.which === 13) {
                this.trigger_if_save();
            } else if (e.which === 27) {
                this.trigger('cancel');
                e.stopPropagation();
            }
        },
        handle_initiative_blur : function(e){
            if(!$(e.target).is(this.$input)){
                this.$input.blur();
            }
        },
        handle_blur : function(){
            this.trigger_if_save();
        },
        trigger_if_save : function(){
            var value = $.trim(this.$input.val());
            // 如果什么值都没有改，触发取消，如果为空，也触发取消
            if(!value || value === this.initial_value){
                this.trigger('cancel');
                return;
            }
            this.trigger('save', $.trim(this.$input.val()));
        },
        focus : function(){
            // 选中并聚焦，有时它会在mousedown中调用，不延时会有问题。
            var me = this;
            setTimeout(function(){
                me.$input.focus().select();
            }, 0);
        },
        destroy : function(){
            this.unhook();
            this.destroyed = true;
            this.trigger('destroy');
        }
    });
    return Editor;
});/**
 * 框选
 *
 *************************************************************************
 *                                                                      **
 *              注意：每一个节点都必须包含一个全局唯一的 ID !!!              **
 *                                                                      **
 *************************************************************************
 *
 * @author jameszuo
 * @date 13-10-24
 */
define.pack("./ui.SelectBox",["$","lib","./util.functional"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        console = lib.get('./console').namespace('SelectBox'),
        events = lib.get('./events'),

        functional = require('./util.functional'),
        
        DEFAULT_KEEP_ON = 'a, [data-no-selection], input, textarea, button, object, embed',

        default_ops = {
            /**
             * 命名空间
             * @type {String}
             */
            ns: 'your_namespace',
            /**
             * 列表父容器
             * @type {jQuery|HTMLElement|String}
             */
            $el: null,
            /**
             * 获取列表容器
             * @type {Function}
             * @return {jQuery}
             */
            get_$els: $.noop,
            /**
             * 滚动容器
             * @type {jQuery|HTMLElement|String}
             */
            $scroller: 'body',
            /**
             * 所有单元格尺寸都一样
             * @type {Boolean}
             */
            all_same_size: true,
            /**
             * 获取容器宽度
             * @returns {Number}
             */
            container_width: function () {
                return this.o.$scroller.width();
            },
            /**
             * 子节点过滤器
             * @type {String}
             */
            child_filter: null,
            /**
             * 获取容器的碰触体积，默认返回null使用实际体积
             * @param {String} el_id
             * @returns {{ width: Number, height: Number }}
             */
            touch_size: $.noop,
            /**
             * 是否检查真实碰触体积
             * @returns {Boolean} 是否计算碰触体积。true-计算；false-不计算，使用实际体积
             */
            enable_touch_size: $.noop,
            /**
             * 拖拽辅助层
             * @type {String}
             */
            helper: '<div class="ui-selectable-helper"></div>',
            /**
             * 选中的样式
             * @type {String}
             */
            selected_class: 'ui-selected',
            /**
             * 选择前的拦截器，用于过滤掉不允许选中的节点
             * @type {Function}
             * @param {String} el_id
             */
            is_selectable: $.noop,
            /**
             * 自定义开始框选前的拦截，用于取消开始框选的动作
             * @type {Function}
             * @param {String} el_id
             */
            before_start_select: $.noop,
            keep_on_selector : DEFAULT_KEEP_ON,
            /**
             * mousedown 这些元素时，不会执行选中和取消动作（覆盖该参数不会覆盖这个动作，只是加多一个条件）
             * @type {Function}
             */
            keep_on: $.noop,
            /**
             * 点击这些元素时取消选中（默认点击元素外部时取消选中，覆盖该参数不会覆盖这个动作，只是加多一个条件）
             * @type {Function}
             */
            clear_on: $.noop,
            /**
             * 按下鼠标后，延迟若干毫秒后才启动拖拽动作
             * @type {Number}
             */
            // delay: 300,
            /**
             * 按下鼠标后，移动若干像素后才启动拖拽动作
             * @type {Number}
             */
            distance: 20
        },
        seq = 0,
        doc = document,
        get_by_id = function (id) {
            return doc.getElementById(id)
        },
        $doc = $(document),
        support_selectstart = 'onselectstart' in document.createElement('div'),

        SCROLLBAR_WIDTH = 20,

        namespaces = {},

        undef;

    /**
     * 框选对象构造函数
     * 事件列表:
     *    select_change (Object sel_id_map, Object org_sel_id_map)
     * @param {Object} o
     * @constructor
     */
    var SelectBox = function (o) {
        if (!o.ns)
            throw 'new SelectBox() 时未指定 ns 参数';
        if (o.ns in namespaces)
            throw ('new SelectBox() ns 参数不允许重复，"' + o.ns + '" 已存在');
        else
            namespaces[o.ns] = 1;

        var me = this,
            o = me.o = $.extend({}, default_ops, o);

        o.$scroller = $(o.$scroller);
        me._ns = '.SelectBox' + (seq++);
        me._id_map_pos = {};
        me._touch_size_map = {};
        me._sel_id_map = {};
        me._org_sel_id_map = null;
        me._inited = false;
        me._enabled = false;
        me._started = false;

        SelectBox.instances.push(me);
    };

    SelectBox.instances = [];

    SelectBox.prototype = {
        destroy : function(){
            if(this.destroyed){
                return;
            }
            this.cancel();
            if(this._enabled){
                this.disable();
            }
            delete namespaces[this.o.ns];
            var index = $.inArray(this, SelectBox.instances);
            SelectBox.instances.splice(index, 1);
            this.destroyed = true;
        },

        /*_init: function () {
         var me = this;
         if (me._inited) return;

         me._inited = true;
         },
         */
        is_enabled : function(){
            return this._enabled;
        },
        enable: function () {
            var me = this, ns = me._ns;

            me.disable();

            me._reg_start_event();
            me._reg_clear_event();
            me._toggle_text_select(false);
            me._enabled = true;
        },

        disable: function () {
            var me = this;
            me._unreg_start_event();
            me._unreg_clear_event();
            me._toggle_text_select(true);
            me._enabled = false;
        },

        refresh: function () {
            if (this._started && this._enabled) {
                this._calc_id_map_pos(this._get_$els());
            }
        },

        /**
         * 手动设置已选中的元素（不覆盖其他元素）
         * @param {String[]} el_ids
         * @param {Boolean} is_sel
         */
        set_selected_status: function (el_ids, is_sel) {
            var me = this,
                sel_id_map = me._sel_id_map;

            for (var i = 0, l = el_ids.length; i < l; i++) {
                var el_id = el_ids[i];

                // 选中或取消之前，先过滤下
                if (!me._is_selectable(el_id)) {
                    continue;
                }

                if (is_sel) {
                    sel_id_map[el_id] = 1;
                } else {
                    delete sel_id_map[el_id];
                }

                me.set_dom_selected(el_id, is_sel);
            }

//            console.log($.map(me._sel_id_map, function (_, el_id) {
//                return $('#' + el_id)[0]
//            }));
//            console.log(me._sel_id_map);
        },

        /**
         * 手动设置DOM的选中状态
         * @param {String|String[]} el_ids
         * @param {Boolean} is_sel
         */
        set_dom_selected: function (el_ids, is_sel) {
            el_ids = typeof el_ids === 'string' ? [el_ids] : el_ids;
            for (var i = 0, l = el_ids.length; i < l; i++) {
                var el_id = el_ids[i];
                if (this._is_selectable(el_id)) {
                    var item = get_by_id(el_id);
                    if (item) {
                        $(item).toggleClass(this.o.selected_class, is_sel);
                    }
                }
            }
        },

        get_selected_id_map: function () {
            return this._sel_id_map;
        },

        has_selected: function () {
            return !$.isEmptyObject(this.get_selected_id_map());
        },

        /**
         * 判断指定DOM是否已选中
         * @param {String|HTMLElement|jQuery} item
         * @returns {boolean}
         */
        is_selected: function (item) {
            var id = typeof item === 'string' ? item : $(item).attr('id');
            return id in this.get_selected_id_map();
        },

        is_selecting: function () {
            return this._is_selecting;
        },

        cancel: function () {
            var me = this, o = me.o;

            /*if (o.delay > 0) {
             me._cancel_on_delay();
             } else */
            if (o.distance > 0) {
                me._cancel_on_distance();
            } else {
                me._cancel();
            }
        },

        clear_selected: function () {
            var me = this,
                sel_id_map = me._sel_id_map;

            if (sel_id_map && !$.isEmptyObject(sel_id_map)) {
                for (var el_id in sel_id_map) {
                    this.set_dom_selected(el_id, false);
                }
            }

            if (!this._is_batch_mode) {
                this._trigger_change(this._sel_id_map, this._sel_id_map = {});
            }
        },

        batch: function (fn) {
            var org_sel_id_map = $.extend({}, this._sel_id_map);

            this._is_batch_mode = true;
            fn.call(this);
            this._is_batch_mode = false;

            this._trigger_change(org_sel_id_map, this._sel_id_map);
        },

        _reg_start_event: function () {
            var me = this, o = me.o, ns = me._ns;// + '_start_event';

            // 先解除所有事件，避免重复绑定
            me._unreg_all_events();

            $doc.on('mousedown' + ns, function (e) {
                // 只处理左键
                var is_left_btn = e.which === 1;
                if (!is_left_btn)
                    return;

                var $tar = $(e.target);

                // mousedown 某些元素不执行选中、取消动作（默认行为）
                if (me._is_keep_on_el($tar))
                    return;

                if (!me._before_start_select($tar))
                    return;

                // 避免在滚动条上点击
                if (e.clientX >= o.$scroller.offset().left + o.$scroller.width() - SCROLLBAR_WIDTH)
                    return;

                // 清除选中
                if (me.has_selected() && me._is_click_to_clear(e, $tar))
                    me.clear_selected();

                // 如果没有按下ctrl/meta，清除选中
//                var is_multi = is_multi_key(e);
//                if (!is_multi)
//                    me.clear_selected();

                // 避免文本选中
                e.preventDefault();


                // 清除文本选中
                clear_text_sel(e);

                // 开始框选
                me._mouse_down(e);
            });
        },

        _unreg_start_event: function () {
            var me = this, ns = me._ns;// + '_start_event';
            // 绑定按下鼠标后启动框选的事件
            $doc.off('mousedown' + ns + ' click' + ns);
        },

        _reg_clear_event: function () {
            var me = this, o = me.o, ns = me._ns;// + '_clear_event';

            me._unreg_clear_event();

            $doc.on('click' + ns, function (e) {
                var $tar = $(e.target);
                if (me.has_selected() && me._is_click_to_clear(e, $tar) && !me._is_keep_on_el($tar)) {
                    me.clear_selected();
                }
            });
        },

        _unreg_clear_event: function () {
            $doc.off('click' + this._ns);// + '_clear_event');
        },

        _unreg_all_events: function () {
            var $scroller = this.o.$scroller, ns = this._ns;
            this._unreg_start_event();
            // 先解除所有事件，避免重复绑定
            $doc.off('mousemove' + ns + ' mouseup' + ns);
            $scroller.off('scroll' + ns);
        },

        _mouse_down: function (e) {
            var me = this, o = me.o;

            // 移动一定距离后启动框选
            if (o.distance > 0) {
                me._start_on_distance(e);
            }
//            // 延迟一定时间后启动框选
//            else if (o.delay > 0) {
//                me._start_on_delay(e);
//            }
            // 立刻开始启动框选
            else {
                var is_multi = is_multi_key(e);
                me._start(e.clientX, e.clientY, is_multi);
            }
        },

        /**
         * 开始框选
         * @param {Number} x 开始的x坐标
         * @param {Number} y 开始的y坐标
         * @param {Boolean} is_multi 保持多选
         * @private
         */
        _start: function (x, y, is_multi) {

            if (this._is_conflicted())
                return;

            this._started = true;

            var me = this, o = me.o, ns = me._ns, $scroller = o.$scroller,
                start_xy = me._start_xy = me._calc_start_xy(x, y),
                sel_range, fixed_range;

            me._org_sel_id_map = $.extend({}, me._sel_id_map);

            // 计算所有单元格位置
            me._calc_id_map_pos(me._get_$els());

            // 初始化 helper 位置
            me._create_$helper(start_xy.x, start_xy.y);

            /**
             * 更新框选区域
             * @param {Number} x
             * @param {Number} y
             */
            var update_select = function (x, y) {
                sel_range = me._calc_range(start_xy, x, y);
                fixed_range = me._fix_range(sel_range);

                // 如果不保持选中，则重置 _sel_id_map
                // var sel_id_map = keep_selected ? me._sel_id_map : (me._sel_id_map = {});

                // 更新helper位置
                me._update_$helper(fixed_range);
                // 选中节点
                me._select_by_range(fixed_range, is_multi);
            };


            me._unreg_all_events();

            // 拖拽鼠标时，更新框选位置
            $doc.on('mousemove' + ns, function (e) {
                update_select(e.clientX, e.clientY);
            });

            // 弹起鼠标时，销毁事件，重新监听mousedown
            $doc.on('mouseup' + ns, function (e) {
                me._stop();
            });

            // 在容器中滚动时，更新框选位置
            $scroller.on('scroll' + ns, function (e) {
                if (sel_range) {
                    update_select(sel_range.x2, sel_range.y2);
                }
            });
        },

        _stop: function () {
            var me = this;

            this._trigger_change(me._org_sel_id_map, me._sel_id_map);

            me._reg_start_event();
            me._remove_$helper();

            me._started = false;
        },

        _cancel: function () {
            // this._unreg_all_events();
            this._reg_start_event();
        },

        /*_start_on_delay: function (e) {
         var me = this, o = me.o, ns = me._ns,
         keep_selected = is_multi_key(e);

         me._start_delay_tmr = setTimeout(function () {
         me._start(e.clientX, e.clientY, keep_selected);
         }, o.delay);

         // 如果延迟过程中鼠标弹起，则不执行
         $doc.one('mouseup' + ns, function () {
         clearTimeout(me._start_delay_tmr);
         });
         },

         _cancel_on_delay: function () {
         clearTimeout(this._start_delay_tmr);
         $doc.off('mouseup' + this._ns);
         },*/

        // distance 方式启动框选
        _start_on_distance: function (e) {
            var me = this, o = me.o, ns = me._ns,
                start_xy = { x: e.clientX, y: e.clientY },
                is_multi = is_multi_key(e);

            // 鼠标弹起的话，取消
            $doc.on('mouseup' + ns/* + '.distance'*/, function (e) {
                $doc.off('mousemove' + ns/* + '.distance'*/ + ' mouseup' + ns/* + '.distance'*/);
            });

            // 鼠标移动达到指定值后，启动框选
            $doc.on('mousemove' + ns/* + '.distance'*/, function (e) {

                if (Math.max(
                    Math.abs(start_xy.x - e.clientX),
                    Math.abs(start_xy.y - e.clientY)
                ) > o.distance) {

                    $doc.off('mousemove' + ns/* + '.distance'*/ + ' mouseup' + ns/* + '.distance'*/);

                    me._start(start_xy.x, start_xy.y, is_multi);
                }
            });
        },

        _cancel_on_distance: function () {
            var ns = this._ns;
            $doc.off('mouseup' + ns/* + '.distance'*/ + ' mousemove' + ns);
        },

        _is_keep_on_el: function ($tar) {
            var o = this.o;
            return !!$tar.closest(o.keep_on_selector).length || (o.keep_on !== default_ops.keep_on && o.keep_on.call(this, $tar));
        },

        _calc_start_xy: function (client_x, client_y) {
            var o = this.o,
                scr_x = o.$scroller.scrollLeft(),
                scr_y = o.$scroller.scrollTop();

            return {
                x: client_x,
                y: client_y,
                scr_x: scr_x,
                scr_y: scr_y
            };
        },

        _calc_range: function (start_xy, x, y) {
            var o = this.o,
                scr_x = o.$scroller.scrollLeft(),
                scr_y = o.$scroller.scrollTop(),
                x1 = start_xy.x - (scr_x - start_xy.scr_x),
                y1 = start_xy.y - (scr_y - start_xy.scr_y),
                x2 = x,
                y2 = y,
                r = {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    scr_x: scr_x,
                    scr_y: scr_y
                };
            return r;
        },

        _calc_id_map_pos: function ($els) {
            this.o.all_same_size ? this._calc_id_map_pos_by_first($els) : this._calc_id_map_pos_by_offs($els);
        },

        /**
         * 重新计算所有单元格的位置（通过第一个单元格推算）
         * @param {jQuery} $els
         * @private
         */
        _calc_id_map_pos_by_first: function ($els) {
            var me = this, o = me.o,
                id_map_pos = me._id_map_pos = {},
            // test code
//                test_data = [],
                first_cell = me._get_first_cell($els);

            if (!first_cell)
                return id_map_pos;
            if (!first_cell.id) {
                console.error('SelectBox 需要读取每一个文件DOM的id来优化计算速度，请给每一个DOM绑定一个唯一的ID');
                return id_map_pos;
            }

            var
                $first_cell = $(first_cell),
                cell_size = out_size($first_cell),
                cell_height = cell_size.height, // 行高度
                cell_width = cell_size.width, // 单元格宽度
                container_width = o.container_width.call(me),

                list_par, // 列表容器
                list_xy,  // 列表位置
                row_index = 0, cell_index = 0; // 当前正在计算的行索引

            // 便利子元素计算位置
            var iter_cell = function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    list_par = cell.parentNode;
                    row_index = 0; // 跨父容器后，重置行索引
                    cell_index = 0;

                    list_xy = me._real_xy(list_par);
                }

                // 如果超出宽度，折行。此时 row_index++, cell_index=0
                var x1;
                if (cell_width * (cell_index + 1) > container_width) {
                    row_index++;
                    cell_index = 0;
                    x1 = 0;
                } else {
                    x1 = cell_width * cell_index;
                }

                var x2 = cell_width * (cell_index + 1),
                    y1 = cell_height * row_index,
                    y2 = cell_height * (row_index + 1),
                    cell_pos = {
                        x1: x1 + list_xy.x,
                        x2: x2 + list_xy.x,
                        y1: y1 + list_xy.y,
                        y2: y2 + list_xy.y
                    };

                id_map_pos[cell.id] = cell_pos;

                // test code
//                test_data.push({
//                    el_id: cell.id,
//                    cell_index: cell_index,
//                    row_index: row_index,
//                    pos: cell_pos
//                });

                cell_index++;
            };

            if (o.child_filter) {
                $.each($els, function (i, $el) {
                    $.each($($el).children(o.child_filter), function (j, cell) {
                        iter_cell(cell);
                    });
                });
            } else {
                each_child_nodes($els, iter_cell);
            }

            // test code
//            $($.map(test_data,function (d) {
//                var el_id = d.el_id,
//                    row_index = d.row_index,
//                    cell_index = d.cell_index,
//                    pos = d.pos;
//                return ['<div style="position:absolute;top:', pos.y1, 'px;left:', pos.x1, 'px;width:', pos.x2 - pos.x1, 'px;height:', pos.y2 - pos.y1, 'px;background-color:orange;opacity:.2;filter:alpha(opacity=20);border:1px solid red;word-break:break-all;">', row_index, ':', cell_index, ' - id=', el_id, '</div>'].join('');
//            }).join('')).appendTo('body');

            return id_map_pos;
        },

        /**
         * 计算每一个单元格的位置
         * @param {jQuery} $els
         * @private
         */
        _calc_id_map_pos_by_offs: function ($els) {
            var me = this,
                id_map_pos = me._id_map_pos = {},
                scr_y = me.o.$scroller.scrollTop(),
                list_par,
                list_xy;

            each_child_nodes($els, function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    list_par = cell.parentNode;
                    list_xy = me._real_xy(list_par);
                }

                var id = cell.id,
                    $c = $(cell),
                    c_pos = $c.position(),
                    x1 = list_xy.x + c_pos.left,
                    x2 = x1 + $c.width(),
                    y1 = list_xy.y + c_pos.top + scr_y,
                    y2 = y1 + $c.height();
                id_map_pos[id] = {
                    x1: x1,
                    x2: x2,
                    y1: y1,
                    y2: y2
                };
            });

            return id_map_pos;
        },

        _get_first_cell: function ($els) {
            return first_visible_child($els.filter(':visible'), this.o.child_filter);
        },

        /**
         * 根据框选范围选中元素
         * @param {Object} fixed_range
         * @param {Boolean} is_multi
         * @private
         */
        _select_by_range: function (fixed_range, is_multi) {
            var me = this,
                pos_map = me._id_map_pos,
                sel_id_map = me._sel_id_map;

            if (!pos_map)
                return;


            /*
             pos:
             x1,y1   x2,y1
             ┌────┐
             │     │
             └────┘
             x1,y2   x2,y2
             */

            var
                diff_scr_x = fixed_range.scr_x, // 开始框选后，可能会滚动列表，这时需要和开始框选的位置进行对比才能取得正确的范围
                diff_scr_y = fixed_range.scr_y,
                related_range = {
                    x1: fixed_range.x1 + diff_scr_x,
                    x2: fixed_range.x2 + diff_scr_x,
                    y1: fixed_range.y1 + diff_scr_y,
                    y2: fixed_range.y2 + diff_scr_y
                },
                touched_ids = [], untouched_ids = [];


            for (var el_id in pos_map) {
                var el_pos = pos_map[el_id];

                // 判断是否碰触
                var is_touched = me._is_touched(el_id, el_pos, related_range);
                if (is_touched) {
                    if (!(el_id in sel_id_map)) {
                        sel_id_map[el_id] = 1;
                        touched_ids.push(el_id);
                    }
                } else if (!is_multi && el_id in sel_id_map) {
                    delete sel_id_map[el_id];
                    untouched_ids.push(el_id);
                }
            }

            // test code
//            touched_ids.length && $.each(touched_ids, function (i, elid) {
//                return $('#' + elid + ' [data-name="file_name"]').css('border', '1px solid red')
//            });
//            untouched_ids.length && $.each(untouched_ids, function (i, elid) {
//                return $('#' + elid + ' [data-name="file_name"]').css('border', '1px solid blue')
//            });

            me.set_dom_selected(touched_ids, true);
            me.set_dom_selected(untouched_ids, false);
        },

        /**
         * 判断框选区域是否已“碰到”目标区域
         * @param {String} el_id
         * @param {Object} el_pos
         * @param {Object} related_range
         * @private
         */
        _is_touched: function (el_id, el_pos, related_range) {
            var me = this, o = me.o, touch_map = me._touch_size_map;

            // 考虑便于阅读，始终使用小于号进行判断
            var is_touched = me._is_pos_match(el_pos, related_range);

            // 修正碰触体积
            if (is_touched && o.enable_touch_size() && o.touch_size !== o.noop) {
                var touch_size = el_id in touch_map ? touch_map[el_id] : (touch_map[el_id] = o.touch_size.call(me, el_id, el_pos)),
                    x1 = el_pos.x1, x2 = el_pos.x2, y1 = el_pos.y1, y2 = el_pos.y2;
                if (touch_size) {
                    if (touch_size.width) {
                        x2 = el_pos.x1 + touch_size.width;
                    }
                    if (touch_size.height) {
                        y2 = el_pos.y1 + touch_size.height;
                    }
                }
                is_touched = me._is_pos_match({ x1: x1, x2: x2, y1: y1, y2: y2 }, related_range);
            }
            return is_touched;
        },

        _is_pos_match: function (el_pos, related_range) {
            return !(el_pos.x2 < related_range.x1 || related_range.x2 < el_pos.x1 || related_range.y2 < el_pos.y1 || el_pos.y2 < related_range.y1)
        },

        _create_$helper: function (x, y) {
            var me = this,
                o = me.o,
                $scroller = o.$scroller,
                $helper = o.$helper = $(o.helper);

            $helper.css({
                display: 'block',
                position: 'absolute',
                left: x + 'px',
                top: y + 'px',
                width: 0 + 'px',
                height: 0 + 'px'
            }).appendTo(document.body);

            // 在 helper 上滚动鼠标时，主动控制滚动条高度，以修复无法滚动的问题
            $helper.on('mousewheel', function (e) {
                var scr_y = e.originalEvent.wheelDelta,
                    org_scr_y = $scroller.scrollTop();

                // 在 $helper 上滚动鼠标后，改变滚动条高度
                $scroller.scrollTop(org_scr_y - scr_y);
            });
        },

        _update_$helper: function (range) {
            if (this.o.$helper) {
                this.o.$helper.css({
                    left: range.x1 + 'px',
                    top: range.y1 + 'px',
                    width: range.x2 - range.x1 + 'px',
                    height: range.y2 - range.y1 + 'px'
                })
                // test code
                // .html('x1:' + range.x1 + ',y1:' + range.y1 + '<br>x2:' + range.x2 + ',y2:' + range.y2);
            }
        },

        _remove_$helper: function () {
            var o = this.o;
            if (o.$helper) {
                if ($.browser.msie) {
                    o.$helper.remove();
                } else {
                    o.$helper.fadeOut('fast', function () {
                        $(this).remove();
                    });
                }
                o.$helper = null;
            }
        },

        _fix_range: function (r) {
            var t, f = $.extend({}, r);
            // fix range
            if (f.x1 > f.x2) {
                t = f.x1;
                f.x1 = f.x2;
                f.x2 = t;
            }
            if (f.y1 > f.y2) {
                t = f.y1;
                f.y1 = f.y2;
                f.y2 = t;
            }
            return f;
        },

        _real_xy: function (list_par) {
            var me = this, o = me.o,
                $list_par = $(list_par),
                list_par_offs = $list_par.offset(),
                xy = {
                    x: (list_par_offs.left + o.$scroller.scrollLeft())/* + int_css($list_par, 'marginLeft')*/ + int_css($list_par, 'paddingLeft'),
                    y: (list_par_offs.top + o.$scroller.scrollTop())/* + int_css($list_par, 'marginTop')*/ + int_css($list_par, 'paddingTop')
                };

            return xy;
        },

        _toggle_text_select: function (enable) {
            var o = this.o;
            if (support_selectstart) {
                var ns = this._ns;

                if (enable === this._text_selectable)
                    return;

                var $body = $($doc[0].body),
                    selectstart = 'selectstart';

                if (enable) {
                    $body.off(selectstart + ns + '_select_text');
                } else {
                    $body.on(selectstart + ns + '_select_text', function (e) {
                        if ($(e.target).closest(o.keep_on_selector).length === 0) {
                            e.preventDefault();
                        }
                    });
                }

                this._text_selectable = enable;
            }
        },

        _before_start_select: function (e) {
            var me = this, o = me.o;
            if (o.before_start_select === default_ops.before_start_select || false !== o.before_start_select.call(me, e)) {
                return true;
            }
            return false;
        },

        _is_click_to_clear: function (e, $tar) {
            var me = this, o = me.o;

            // 按下ctrlKey/metaKey时，不清空
            if (is_multi_key(e))
                return false;

            // 点击在 $el 外部时，清除选中（默认行为）
            var in_el = !!$tar.closest(me._get_$els()).length;
            if (!in_el)
                return true;

            // 点击在 $el 外部时，清除选中（自定义判断条件）
            if (o.clear_on !== default_ops.clear_on && o.clear_on.call(me, $tar))
                return true;
        },

        _is_selectable: function (el_id) {
            return !(this.o.is_selectable !== default_ops.is_selectable && false === this.o.is_selectable.call(this, el_id));
        },

        _trigger_change: function (org_sel_id_map, sel_id_map) {
            var me = this,
                unsel_id_map = {};

            // 从 org_sel_id_map 中取得被取消选中的元素
            if (org_sel_id_map) {
                for (var el_id in org_sel_id_map) {
                    if (!(el_id in sel_id_map)) {
                        unsel_id_map[el_id] = 1;
                    }
                }
            }

            /*console.log('sel', $.map(sel_id_map, function (_, el_id) {
             return $('#' + el_id)[0]
             }));
             console.log('unsel', $.map(unsel_id_map, function (_, el_id) {
             return $('#' + el_id)[0]
             }));*/

            this.trigger('select_change', sel_id_map, unsel_id_map);
            this._org_sel_id_map = $.extend({}, sel_id_map);
        },

        _get_$els: function () {
            var o = this.o;
            return (o.get_$els !== $.noop && $.isFunction(o.get_$els)) ? o.get_$els.call(this) || $() : $(o.$el)
        },

        _is_conflicted: function () {
            var ins = SelectBox.instances,
                enab_ins = [];

            for (var i = 0, l = ins.length; i < l; i++) {
                if (ins[i]._enabled) {
                    enab_ins.push(ins[i]);
                }
            }
            if (enab_ins.length > 1) {
                console.warn('你是否忘记禁用前一个 SelectBox 实例了？ 已启用的 SelectBox 实例', $.map(enab_ins, function (inst) {
                    return inst.o.ns;
                }));
            }
            return false;
        }
    };

    /**
     * 取目标节点下第一个元素（为优化性能）
     * @param {jQuery} $els
     * @param {String} filter
     * @returns {Node}
     */
    var first_visible_child = function ($els, filter) {
        for (var i = 0, l = $els.length; i < l; i++) {
            var el = $els[i],
                n = el.firstChild;

            if (!n)
                continue;

            for (; n; n = n.nextSibling) {
                if (filter) {
                    if ($(n).is(filter))
                        return n;

                } else {
                    if (n.nodeType === 1)
                        return n;
                }
            }
        }
    };

    var each_child_nodes = function (els, fn) {
        var s = 0;
        $.each(els, function (i, el) {
            $.each(el.childNodes, function (j, n) {
                if (n.nodeType === 1) {
                    fn.call(n, n, s++);
                }
            });
        });
    };

    var int_css = function ($el, attr_name) {
        return parseInt($el.css(attr_name)) || 0;
    };

    var out_size = function ($el) {
        return {
            width: $el.outerWidth() + int_css($el, 'marginLeft') + int_css($el, 'marginRight'),
            height: $el.outerHeight() + int_css($el, 'marginTop') + int_css($el, 'marginBottom')
        };
    };


    // 清空选中的文本
    var clear_text_sel = function (e) {
        // input、textarea 不清除选中
        if (!(e.target.tagName in inputs || document.activeElement && document.activeElement.tagName in inputs)) {
            _clear_text_sel();
        }
    };

    var inputs = { TEXTAREA: 1, INPUT: 1 };

    // 清除选中文本
    var _clear_text_sel = 'getSelection' in window ? function () {
        try {
            window.getSelection().removeAllRanges();   //从选区中移除所有的DOM范围
        }
        catch (e) {
        }
    } : function () {
        try {
            doc.selection.empty();   //IE、同上
        }
        catch (e) {
        }
    };

    var is_multi_key = function (e) {
        return e.ctrlKey || e.metaKey || e.shiftKey;
    };

    $.extend(SelectBox.prototype, events);

    return SelectBox;
});/**
 * IE6 居中
 * @author jameszuo
 * @date 13-1-29
 */
define.pack("./ui.center",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),

        console = lib.get('./console'),

        $win = $(window),

        ie6 = $.browser.msie && $.browser.version < 7,

        listen,
        stop_listen,
        update,

        undefined;

    if (ie6) {


        update = function (el, fix_x, fix_y) {
            setTimeout(function () {  // 解决有时位置错误的bug
                var $el = $(el);
                if ($el.is(':visible')) {
                    var wh = get_width_height($el),
                        win_width = $win.width(),
                        win_height = $win.height(),
                        fix_x = fix_x || 0;
                        fix_y = fix_y || 0;

                    $el.css({
                        position: 'absolute',
                        left: (win_width - wh[0] + fix_x) / 2,
                        top: (win_height - wh[1] + fix_y) / 2 + $win.scrollTop(),
                        margin: 'auto'
                    });
                }
            }, 0);
        };

        listen = function (el, fix_x, fix_y) {

            stop_listen(el);

            var $el = $(el),
                center_id = $el.data('center_id');

            if (!center_id) {
                $el.data('center_id', center_id = random());
            }

            var event_names = ['resize.ui.center_' + center_id/*, 'scroll.ui.center_' + center_id*/].join(' ');

            $win.bind(event_names, function (e) {
                update($el, fix_x, fix_y);
            });
            update($el, fix_x, fix_y);
        };

        stop_listen = function (el) {
            var $el = $(el),
                center_id = $el.data('center_id');

            if (center_id) {
                $el.removeData('center_id');

                var event_names = ['resize.ui.center_' + center_id/*, 'scroll.ui.center_' + center_id*/].join(' ');
                $win.unbind(event_names);
            }
        };

    }


    // not ie6
    else {

        listen = update = function (el, fix_x, fix_y) {
            setTimeout(function () {  // 解决有时位置错误的bug
                var $el = $(el);
                if ($el.is(':visible')) {
                    var wh = get_width_height($el),
                        fix_x = fix_x || 0;
                        fix_y = fix_y || 0;

                    $el.css({
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        marginLeft: -(wh[0] / 2 + fix_x) + 'px',
                        marginTop: -(wh[1] / 2 + fix_y) + 'px'
                    });
                }
            }, 0);
        };
        stop_listen = $.noop;
    }

    var
        random = function () {
            return new Date().getTime() + Math.round(Math.random() * 1000000);
        },
        get_width_height = function ($el) {
            var w = $el.outerWidth(),// + (parseInt($el.css('padding-left')) || 0) + ( + parseInt($el.css('padding-right')) || 0),
                h = $el.outerHeight();// + (parseInt($el.css('padding-top')) || 0) + ( + parseInt($el.css('padding-bottom')) || 0);
            return [w, h];
        };

    return {

        listen: listen,
        stop_listen: stop_listen,
        update: update

    };

});/**
 * 右键菜单
 * @author jameszuo
 * @date 13-2-20
 */
define.pack("./ui.context_menu",["lib","$","./tmpl","./global.global_event"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        console = lib.get('./console'),
        template = lib.get('./template'),
        collections = lib.get('./collections'),
        Events = lib.get('./events'),

        tmpl = require('./tmpl'),
        global_event = require('./global.global_event'),

        $win = $(window),

        DEFAULT_CONTEXTMENU_CONFIG = {
            items: [/*Item*/],
            hide_on_click: true // 点击后隐藏
        },
        DEFAULT_ITEM_CONFIG = {
            id: '',
            icon_class: '',
            text: '',
            after_render: $.noop // 渲染完成事件
        },

        seq = 0,

        fix_header_height = 0, // 头部的高度

        ctxt_menu_instances = [],

        undefined;

    global_event.on('page_header_height_resize', function (new_height) {
        fix_header_height = new_height;
    });


    // --- 构造函数 ------------------------------------
    var ContextMenu = function (config) {
        var me = this;

        me.config = $.extend({}, DEFAULT_CONTEXTMENU_CONFIG, config);

        me._all_items = $.map(me.config.items, function (item) {
            if (!Item.is_instance(item)) {
                item = new Item(item);
            }
            item.set_menu(me);
            return item;
        });

        me._seq = ++seq;

        ctxt_menu_instances.push(me);
    };

    ContextMenu.prototype = {
        _seq: null,
        _all_items: null,
        _par_item: null,
        _visible: false,

        /**
         * 渲染菜单
         * @param {Object} item_id_map 如果未指定，则渲染所有菜单选项
         * @param {Boolean} arrow 是否显示箭头
         * @param {jQuery|HTML} $on 对应的DOM元素
         * @param {jQuery|HTMLElement} [$to] 菜单将会追加在这个元素中
         */
        render: function (item_id_map, arrow, $on, $to) {
            var me = this;

            me.hide();

            me.trigger('before_render', $on);

            // 要渲染的菜单选项
            var render_items;
            if (item_id_map) {
                render_items = $.grep(me._all_items, function (item) {
                    return item.config.id in item_id_map;
                });
            } else {
                render_items = me._all_items;
            }

            // 是否包含图片
            var has_icons = collections.any(render_items, function (item) {
                return !!item.config.icon_class;
            });

            // DOM
            $to = $($to);
            me.$el = $(tmpl.context_menu({ items: render_items, arrow: arrow, has_icons: has_icons, width: this.config.width })).hide().appendTo($to.length ? $to : document.body);

            $.each(render_items, function (i, item) {
                item.trigger('render', item_id_map, $to);
            });


            // 事件
            me.$el.on('click.comm_ctxt_menu', '[data-action=item]', function (e) {
                var link = $(this).find('a');
                if (link.is('a[href^=#],a[href^="javascript:"]')) { // 如果是 href=# 或 href=javascript:void(0); 则阻止默认事件
                    e.preventDefault();
                }

                var item = me._rendered_item_map[$(this).attr('data-item-id')];

                if (item && !item.get_sub_menu()) { // 有子菜单的不允许点击

                    item.trigger('click', e);

                    me.trigger('item_click', item, e);

                    // 隐藏
                    if (me.config.hide_on_click !== false) {
                        var par_item = me._par_item, par_menu;
                        while (par_item && (par_menu = par_item.get_menu())) {
                            par_item = par_menu._par_item;
                        }
                        if (par_menu) {
                            par_menu.hide();
                        } else {
                            me.hide();
                        }
                    }
                }
            });

            // hover
            (function () {
                me.$el
                    .on('mouseenter', function () {
                        if (me._par_item) {
                            me._par_item.set_hover_timer();
                        }
                        me.trigger('mouseenter');
                    })
                    .on('mouseleave', function () {
                        if (me._par_item) {
                            me._par_item.set_hover_timer(function () {
                                me._par_item.trigger('mouseleave');
                            }, 500);
                        }
                        me.trigger('mouseleave');
                    })
                    .on('mouseenter', '[data-action="item"]', function (e) {
                        var $item_el = $(this),
                            item = me._rendered_item_map[$item_el.attr('data-item-id')];

                        if (item.get_sub_menu()) {
                            var $trg_el = $item_el.find('a'),
                                ofs = $trg_el.offset();

                            item.set_hover_timer();

                            item.trigger('mouseenter', ofs.left + $trg_el.width() + 3, ofs.top, item_id_map);
                        }
                    })
                    .on('mouseleave', '[data-action="item"]', function (e) {
                        var $item_el = $(this),
                            item = me._rendered_item_map[$item_el.attr('data-item-id')];

                        if (item.get_sub_menu()) {
                            item.set_hover_timer(function () {
                                item.trigger('mouseleave');
                            }, 500);
                        }
                    });
            })();


            // after render
            $.each(render_items, function (i, item) {
                item.trigger('after_render', $('>ul>li[data-action=item]:eq(' + i + ')', me.$el));
            });


            me._rendered_items = render_items;
            me._rendered_item_map = collections.array_to_set(render_items, function (item) {
                return item.config.id;
            });

            return me.$el;
        },

        /**
         * 显示菜单
         * @param {Number} x
         * @param {Number} y
         * @param {Object} item_id_map 如果未指定，则渲染所有菜单选项
         * @param {jQuery|HTMLElement} $on
         */
        show: function (x, y, item_id_map, $on) {

            this.render(item_id_map, false, $on);

            var xy = this._fix_xy(x, y);

            this._show(xy, false);

            this.trigger('show_on', $on);

            if ($.isArray(this._rendered_items)) {
                $.each(this._rendered_items, function (i, item) {
                    item.trigger('show', xy.x, xy.y, item_id_map);
                });
            }
        },

        /**
         * 在指定元素上显示菜单
         * @param {jQuery|HTMLElement} $on
         * @param {jQuery|HTMLElement} $offs_par
         * @param {Array<String>} item_ids 如果未指定，则渲染所有菜单
         * @param {Number} fix_left left值加上该值
         * @param {Number} fix_top 菜单在元素上方时，top值加上该值
         * @param {Number} fix_bottom 菜单在元素下方时，bottom值加上该值
         * @param {Boolean} arrow 是否显示箭头，默认true
         */
        show_on: function ($on, $offs_par, item_ids, fix_left, fix_top, fix_bottom, arrow) {
            $on = this.$on = $($on);

            var
                on_offs = $on.offset(),
                par_offs = $offs_par.offset(),
                x = on_offs.left + $on.width() / 2,
                y = on_offs.top + $on.height() / 2;

            arrow = arrow !== false;

            this.render(item_ids, arrow, $on, $offs_par);

            var xy = this._fix_xy(x, y);
            if (xy.at_top) {
                xy.y += fix_top;
            } else if (xy.at_bottom) {
                xy.y += fix_bottom;
            }

            // 向左偏移
            xy.x -= fix_left;


            // 相对offsetParent定位
            xy.x -= par_offs.left;
            xy.y -= par_offs.top;


            this._show(xy, arrow);

            this.trigger('show_on', $on);
        },

        _show: function (xy, arrow) {
            var me = this,
                $el = me.$el;

            var css = {
                left: xy.x + 'px',
                top: xy.y + 'px',
                zIndex: 3,//$el.css('zIndex') + 1,
                display: ''
            };

            $el.css(css);

            if (arrow) {
                // 箭头
                $el.toggleClass('ui-popmenu-bottom', xy.at_top);
            }

            me.trigger('show');

            me._visible = true;

            listen_blur();
        },

        /**
         * 隐藏
         */
        hide: function () {
            var me = this;
            if (me.$el) {
                me.$el.remove();
            }
            me.$on = null;

            if (me._visible === false) {
                return;
            }

            var items = me._rendered_items;
            if (items && items.length) {
                $.each(items, function (i, item) {
                    item.trigger('hide');
                });
            }

            me._rendered_items = null;

            me.trigger('hide');

            me._visible = false;

            listen_blur();
        },

        /**
         * 确保菜单不会超出浏览器边界
         * @param x
         * @param y
         * @private
         * @return {Object} { x:Number, y:Number, at_LOCATION:Boolean }
         */
        _fix_xy: function (x, y) {
            var $el = this.$el,
                el_width = $el.outerWidth(),
                el_height = $el.outerHeight(),

            // 判断浏览器边界
                win_width = $win.width(),
                win_height = $win.height(),

                x_scroll = $win.scrollLeft(),
                y_scroll = $win.scrollTop(),

                fix_padding = 5,
                x_limit = win_width + x_scroll - fix_padding,
                y_limit = win_height + y_scroll - fix_padding,

                at_bottom = true,
                at_right = true;

            // 超出右边界
            if (x + el_width > x_limit) {
                //超出右边界多少就左移多少
                x -= (x + el_width - x_limit);
//                x -= el_width;
                at_right = false;
            }
            // 超出下边界
            if (y + el_height > y_limit) {
                y -= el_height;
                at_bottom = false;
            }
            return {
                x: x,
                y: y,
                at_top: !at_bottom,
                at_bottom: at_bottom,
                at_left: !at_right,
                at_right: at_right
            };
        }
    };

    $.extend(ContextMenu.prototype, Events);


    // --- 菜单选项 ------------------------------------
    var Item = function (_config) {
        var me = this,
            config = me.config = $.extend({}, DEFAULT_ITEM_CONFIG, _config);

        // 子菜单
        if ($.isArray(config.items)) {
            var sub_menu = new ContextMenu({
                items: config.items
            });
            me.set_sub_menu(sub_menu);

            me
                .once('after_render', function (item_id_map, $to) {
                    sub_menu.render(item_id_map, false, $to);
                })
                .on('hide', function () {
                    sub_menu.hide();
                })
                .on('mouseenter', function (x, y, item_id_map, $on) {
                    sub_menu.show(x, y, item_id_map, $on);
                })
                .on('mouseleave', function () {
                    sub_menu.hide();
                });
        }

        if ($.isFunction(config.click)) {
            me.on('click', function (e) {
                config.click.call(me, e);
            });
        }

        if ($.isFunction(config.after_render)) {
            me.on('after_render', function () {
                config.after_render.apply(me, $.makeArray(arguments));
            })
        }
    };

    Item.is_instance = function (obj) {
        return !!obj && obj.__is_context_item === true;
    };

    $.extend(Item.prototype, Events, {
        __is_context_item: true,
        _sub_menu: null,
        _hover_timer: null,

        /**
         * 子菜单
         * @param {ContextMenu} menu
         */
        set_sub_menu: function (menu) {
            this._sub_menu = menu;
            menu._par_item = this;
        },

        get_sub_menu: function () {
            return this._sub_menu;
        },

        set_menu: function (menu) {
            this._menu = menu;
        },

        get_menu: function () {
            return this._menu;
        },

        get_hover_timer: function () {
            return this._hover_timer;
        },

        set_hover_timer: function (fn, delay) {
            clearTimeout(this._hover_timer);

            if (fn) {
                this._hover_timer = setTimeout(fn, delay);
            }
        }
    });

    ContextMenu.Item = Item;


    var $body;
    // 点击菜单外部时，隐藏所有菜单实例
    var listen_blur = function () {
        $body = $body || ($body = $(document.body));

        var has_visible = collections.any(ctxt_menu_instances, function (inst) {
            return inst._visible;
        });

        $body.off('mousedown.comm_ctxt_menu');

        if (has_visible) {
            setTimeout(function () {
                $body.on('mousedown.comm_ctxt_menu', function (e) {
                    // 如果点击了菜单外部
                    var in_menu = $(e.target).closest('[data-comm-ctxtmenu]').length;
                    if (!in_menu) {
                        for (var i = 0, l = ctxt_menu_instances.length; i < l; i++) {
                            ctxt_menu_instances[i].hide();
                        }
                        $body.off('mousedown.comm_ctxt_menu');
                    }
                });
            }, 0);
        }
    };

    return ContextMenu;
});/**
 * 修复IE在一个元素下按下鼠标后，移动至另一元素上后，弹起鼠标会触发click事件的bug
 * @author jameszuo
 * @date 13-6-17
 */
define.pack("./ui.ie_click_hacker",["$"],function (require, exports, module) {
    var $ = require('$'),
        ie = $.browser.msie;

    if (ie) {
        var mouse_down_time,
            during = 400,
            D = Date,
            undef;

        $(function () {
            $(document.body).on('mousedown', function () {
                mouse_down_time = new D().getTime();
            });
        });

        return {
            is_click_event: function () {
                return new D().getTime() - mouse_down_time < during;
            }
        };
    }
    else {
        return {
            is_click_event: function () {
                return true;
            }
        };
    }
});/**
 * 右上角小提示
 * @author jameszuo
 * @date 13-3-14
 */
define.pack("./ui.mini_tip",["lib","$","./constants","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),

        constants = require('./constants'),
        tmpl = require('./tmpl'),

        uiv = constants.UI_VER,

        delay_min = 2, // 消息显示的时间下限
        delay_max = 5, // 消息显示的时间上限
        second_every_letter = .4, // 每多一个字符显示的秒数

        t,
        $el, $text,

        fade_speed = 200,

        undefined;

    var mini_tip = {

        init_if: function () {
            $el = $(tmpl['mini_tip']());
            $text = $el.find('[data-action="text"]');
            $el.appendTo(document.body);

            this.init_if = $.noop;
        },

        /**
         * 设置动画类型（建议在页面初始化后调用）
         * @param {String} type 'fade' or 'slide'
         * @deprecated 已废弃
         */
        set_animate_type: $.noop,
        _msg: function (type, msg, second) {
            if (!msg)
                return;

            var me = this;

            me.init_if();

            msg = msg.toString();

            clearTimeout(t);

            $el
                .removeClass('full-tip-ok full-tip-warn full-tip-err')
                .addClass('full-tip-' + type)
                .stop(true, true)
                .hide()
                .fadeIn(fade_speed);

            $text.html(msg);

            var delay = second > 0 ? second : calc_delay(msg);  // 延迟一定时间后隐藏
            t = setTimeout(function () {
                me.hide(fade_speed);
            }, delay * 1000);
        },

        hide: function () {
            $el.stop(true, true).fadeOut(fade_speed);
        }
    };

    $.each({ok: 'ok', warn: 'warn', error: 'err'}, function (key, type) {
        mini_tip[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._msg.apply(this, args);
        };
    });

    // 计算提示消息显示的持续时间
    var calc_delay = function (msg) {
        return Math.min(Math.max(msg.length * second_every_letter, delay_min), delay_max);
    };

    return mini_tip;
});/**
 * 文件列表分页助手
 * @author jameszuo
 * @date ${DATE}
 */
define.pack("./ui.paging_helper",["lib","$","./global.global_event"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),

        console = lib.get('./console').namespace('paging'),

        global_event = require('./global.global_event'),

        M = Math,

        min_line_count_list = 6,
        min_line_count_thumb = 2,

        default_options = {
            scroller: null, // common/ui/Scroller
            $container: null,
            item_width: 0,
            item_height: 0
        },

        undef;


    var PagingHelper = function (opts) {
        var o = this._options = $.extend({}, default_options, opts);
        if (o.scroller) {
            o.$container = o.scroller.get_$el();
        } else if (o.$container) {
            o.$container = $(o.$container);
        } else {
            throw '无效的参数，须指定scroller或$container';
        }
    };

    PagingHelper.prototype = {

        /**
         * 获取每行可显示的文件个数（列表模式请设置 item_width 为 0）
         * @returns {Number} 文件个数
         */
        get_line_size: function () {
            var o = this._options,
                line_size;

            // 每行应显示的文件个数（列表模式或item_width为0或'auto'时每行显示1个）
            if (o.is_list || !(o.item_width > 0)) {
                line_size = 1;
            } else {
                var ct_width = o.$container.width() - 20;
                line_size = M.max(M.floor(ct_width / o.item_width), 1);
            }
            // console.log('line_size', line_size);
            return line_size;
        },

        /**
         * 获取每页可显示的文件行数
         * @returns {Number} 行数
         * @param {Boolean} is_first_page
         */
        get_line_count: function (is_first_page) {
            var
                o = this._options,
                min_line_count = o.is_list ? min_line_count_list : min_line_count_thumb,
                line_count = is_first_page ? M.floor(o.$container.height() / o.item_height) + min_line_count : min_line_count;
            // console.log('line_count', line_count);
            // 行数
            return  line_count;
        },

        set_is_list: function (is_list) {
            this._options.is_list = is_list;
        },

        set_item_width: function (item_width) {
            this._options.item_width = item_width;
            if (item_width === 0 || item_width === 'auto') {  // item_width 为0时认为是列表模式
                this._options.is_list = true;
            }
        },

        set_item_height: function (item_height) {
            this._options.item_height = item_height;
        },

        set_$container: function ($container) {
            this._options.$container = $($container);
        }
    };


    return PagingHelper;
});/**
 * 消息提示panel
 * @author jameszuo
 * @date 2013-11-26
 */
define.pack("./ui.pop_panel",[],function (require, exports, module) {

    /**
     * @param {jQuery} options.host_$dom 触发元素
     * @param {jQuery} options.$dom 弹出的panel层的jQuery 对象
     * @param {Function} options.show 显示操作
     * @param {Function} options.hide 隐藏的动作
     * @param {Number} options.delay_time 延迟多久显示 默认500毫秒
     */
    var PopPanel = function (options) {
        var me = this,
            o = me.o = options;

        o.$dom.add(o.host_$dom)
            .on('mouseenter', function () {
                me.show();
            })
            .on('mouseleave', function () {
                me._delay_hide();
            });
    };

    PopPanel.prototype = {

        _timr: null,

        show: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (typeof o.show === 'function') {
                o.show.call(me);
            } else {
                o.$dom.show();
            }
        },

        hide: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (typeof o.hide === 'function') {
                o.hide.call(me);
            } else {
                o.$dom.hide();
            }
        },

        _delay_hide: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            me._timr = setTimeout(function () {
                me.hide();
            }, o.delay_time);
        }

    };

    return PopPanel;
});/**
 * 展示处理进度
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author jameszuo
 * @date 13-1-19
 */
define.pack("./ui.progress",["lib","$","./ui.widgets","./tmpl","./ui.center"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        template = lib.get('./template'),

        widgets = require('./ui.widgets'),

        tmpl = require('./tmpl'),
        ui_center = require('./ui.center'),

        timer,

        undefined;


    var progress = {
        $el: null,

        render_if: function () {
            if (!this.$el) {
                this.$el = $(tmpl.loading_mark()).hide().appendTo(document.body);
            }
        },
        /**
         * 显示进度
         * @param {String} msg 消息，支持HTML代码
         * @param {Number|Boolean} delay_to_hide 延迟N秒后隐藏 | 是否延迟隐藏
         * @param {Boolean} white_mask 是否使用白色遮罩，默认true
         * @param {String} id 临时ID，和hide_if(id)一起用（如果目前的进度是这个ID才隐藏）
         */
        show: function (msg, delay_to_hide, white_mask, id) {
            clearTimeout(timer);

            var me = this;

            me.render_if();

            var $el = me.$el;

            if (!$el.parent()[0]) {
                $el.appendTo(document.body).hide();
            }

            // 文字
            $el.find('._n').html(msg);

            if (!msg) { // 没有消息就隐藏
                me.hide();
            }

            // 显示
            else {

                // 显示进度框
                if ($el.is(':hidden')) {

                    $el.fadeIn('fast');

                    // IE6 居中
                    ui_center.listen($el);

                    // 显示遮罩
                    this.mask(true, white_mask);
                }

                if (delay_to_hide) {
                    var delay = 1;
                    if (typeof delay_to_hide == 'number') {
                        delay = delay_to_hide;
                    }
                    timer = setTimeout(function () {
                        me.hide();
                    }, delay * 1000);
                }

                this._cur_id = id || undefined;
            }
        },

        hide: function (mask) {
            if (this.$el) {
                this.$el.stop(true, true).fadeOut('fast', function () {
                    var $el = $(this);
                    ui_center.stop_listen($el);
                    $el.detach();
                });
            }
            // 隐藏遮罩
            if (mask !== false) {
                this.mask(false);
            }
        },

        /**
         * 如果目前的进度用的是这个ID才隐藏
         * @param {Boolean} mask
         * @param {String} id 临时ID，需要在调用.show(..., id)方法时传入
         */
        hide_if: function (mask, id) {
            if (this._cur_id && this._cur_id === id) {
                this.hide(mask);
            }
        },

        mask: function (visible, white_mask) {
            white_mask = white_mask !== false;

            widgets.mask.toggle(visible, 'ui.progress', this.$el, white_mask);
        }
    };

    return progress;
});/**
 * 控制页面上下滚动
 * @author jameszuo
 * @date 13-4-18
 */
define.pack("./ui.scroller",["lib","$","./ui.widgets","./global.global_event","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),

        widgets = require('./ui.widgets'),
        global_event = require('./global.global_event'),
        tmpl = require('./tmpl'),

        scroll_speed = 'slow',
        scrollbar_width,

        default_$el,
        reach_bottom_px = 200,   // 距离页面底部300px时加载文件

        undef;
    // webkit body (chrome/safari)
    // ie html
    // ff html,

    undefined;

    var Scroller = function ($el) {
        $el = $($el);
        if (!$el[0]) {
            throw 'new Scroller($el) - 无效的参数 $el';
        }

        var me = this;
        me.$el = $el;

        me.scroll_handler = $.proxy(me.handle_scroll, me);
        $el.on('scroll', me.scroll_handler);
    };

    Scroller.prototype = {
        handle_scroll : function(){
            this.trigger('scroll');
        },

        up: function (callback) {
            this.to(0, callback);
        },

        /**
         * 滚！
         * @param {Number} y Y
         * @param {Number|String} [speed] 动画持续时间，默认 'slow'
         * @param {Function} [callback] 动画完成的回调
         */
        to: function (y, speed, callback) {
            Scroller.go(y, speed, callback, this.$el);
        },

        /**
         * 判断是否滚到了需要加载文件的位置
         * @returns {boolean}
         */
        is_reach_bottom: function () {
            var $el = this.$el,

                scroll_top = $el.scrollTop(),
                client_h = $el.height(),
                scroll_h = $el[0].scrollHeight;

            return scroll_top + client_h >= scroll_h - reach_bottom_px;
        },

        get_$el: function () {
            return this.$el;
        },
        /**
         * 返回容器高度
         * @returns {*|number}
         */
        get_height: function(){
            return this.get_$el().height();
        },
        trigger_resized: function () {
            this.trigger('resize');
        },
        destroy : function(){
            this.off();
            this.$el.off('scroll', this.scroll_handler);
        }
    };

    $.extend(Scroller.prototype, events);

    /**
     * 滚！
     * @param {Number} y Y
     * @param {Number|String} [speed] 动画持续时间，默认 'slow'
     * @param {Function} [callback] 动画完成的回调
     * @param {jQuery|HTMLElement} [$el]
     */
    Scroller.go = function (y, speed, callback, $el) {
        $el = $($el);
        if (!$el[0]) {
            if (!default_$el) {
                default_$el = $($.browser.webkit ? document.body : document.documentElement)
            }
            $el = default_$el;
        }

        if (y === $el.scrollTop()) {
            return;
        }

        if (typeof arguments[1] === 'function') {
            callback = arguments[1];
            speed = undefined;
        }

        if (speed != 0) {
            $el.animate({
                scrollTop: y
            }, {
                duration: speed || scroll_speed,
                easing: easing.get('easeOutExpo'),
                complete: callback
            });
        } else {
            $el.scrollTop(0);
        }
    };

    Scroller.top = function (callback) {
        this.go(0, callback);
    };

    //获取滚动条高度，使用一个50*50 overflow-y:scroll的div,再在里面放一个50*51的div，使之出现滚动条，这时外面div宽度减去里面div宽度就是滚动条宽度了
    Scroller.get_scrollbar_width = function() {
        var $el;
        if(scrollbar_width) {
            return scrollbar_width;
        }
        $el = $('<div id="scrollbar-width" style="position:absolute;left:-1000px;top:-1000px;background:#000;"><div style="width:50px;height:50px;background:#00f;"><div style="height:50px;overflow-y:scroll;background:#0f0;"><div data-content="true" style="height:51px;background:#f00;"></div></div></div>').appendTo($('body'));
        scrollbar_width = 50 - parseInt($el.find("[data-content]").width());
        $el.remove();
        return scrollbar_width;
    }


    return Scroller;
});/**
 * 工具条按钮item
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./ui.toolbar.button",["lib","$","./ui.mini_tip","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        mini_tip = require('./ui.mini_tip'),
        tmpl = require('./tmpl'),

        noop = $.noop,
        default_options = {
            id: '',
            label: '',
            icon: '',
            cls: '',
            btn_cls: '',
            filter: '',
            render: noop,
            handler: noop,
            before_handler: noop,
            visible: noop, // 如果不设置或该方法返回非boolean值，则默认可见
            enable: noop,  // 如果不设置或该方法返回非boolean值，则默认可点击
            validate: noop,  // 如果不设置或该方法返回非string值，则不提示错误
            tmpl: tmpl.toolbar_button
        },
        undef;


    /**
     * 工具栏按钮
     * @param {Object} options
     *  {String} id
     *  {String} label
     *  {Function} handler fn($.Event) {}
     *  {String} [icon] 按钮icon class
     *  {String} [cls] 按钮class
     *  {Boolean} [update_enable] 在不可用时，禁用按钮并显示鼠标提示，默认false
     *  {Function} [visible] fn(Status) {} 返回true表示可见，返回false表示隐藏
     *  {Function} [enable] fn(Status) {} 返回true表示可用，返回false表示禁用
     */
    var Button = function (options) {
        this._o = $.extend({}, default_options, options);
        this._visible = true;
    };

    Button.prototype = {

        __is_tbar_btn: true,
        /**
         * 同步显示状态 直出的部分可能不一样
         */
        sync_visible: function(){
            if(this._$el){
                var display = this._$el.css('display');
                this._visible = display && display.toLowerCase() === 'block';
            }
        },
        apply_on: function ($el) {
            var me = this,
                o = me._o;

            me._$el = $el;//.toggle(me._visible);

            $el.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // before handler
                o.before_handler && o.before_handler.call(me, e);

                // 点击前的检查
                if ($.isFunction(o.validate) && o.validate !== noop) {
                    var err = o.validate.call(me, e);
                    if (err) {
                        if ($.isArray(err)) {
                            mini_tip.warn(err[0]);
                        } else {
                            mini_tip.warn(err);
                        }
                        return;
                    }
                }
                // 回调
                $.isFunction(o.handler) && o.handler.call(me, e);
            });

            this.sync_visible();

            if (o.render !== noop) {
                o.render.call(me);
            }
        },

        get_id: function () {
            return this._o.id;
        },

        /**
         * 更新按钮状态
         */
        update: function () {
            var o = this._o;

            // 是否可见
            var visible = o.visible && o.visible.apply(this, arguments);
            if (typeof visible !== 'boolean') {
                visible = true;
            }
            this._set_visible(visible);

            // 是否可点        \
            if (o.update_enable) {
                var err_tip = o.validate && o.validate.apply(this, arguments);
                this._set_err_tip($.isArray(err_tip) ? err_tip[0] : err_tip);
            }
        },

        set_handler: function (fn) {
            this._o.handler = fn;
        },

        get_$el: function () {
            return this._$el;
        },

        show: function () {
            this._set_visible(true);
        },

        hide: function () {
            this._set_visible(false);
        },

        is_visible: function () {
            return this._visible;
        },

        is_enable: function () {
            return !this._err_tip;
        },

        get_filter: function () {
            return this._o.filter;
        },

        _set_visible: function (yes) {
            if (this._visible !== yes && this._$el) {
                this._$el.toggle(yes);
                this._visible = yes;
            }
            /*
            if (this._visible !== yes) {
                this._$el && this._$el.toggle(yes);
                this._visible = yes;
            }
            */
        },

        _set_err_tip: function (err) {
            if (this._err_tip !== err) {
                this._$el.attr('title', err).toggleClass('disable', !!err);
                this._err_tip = err;
            }
        }/*,

        _set_status: function (status) {
            this._status = status;
        }*/
    };

    Button.is_instance = function (obj) {
        return !!obj && obj.__is_tbar_btn === true;
    };

    return Button;
});/**
 * 按钮分组
 * @author jameszuo
 * @date 13-8-2
 */
define.pack("./ui.toolbar.button_group",["lib","$","./ui.toolbar.button","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        Button = require('./ui.toolbar.button'),
        tmpl = require('./tmpl'),
        noop = $.noop,

        default_options = {
            id: '',
            label: '',
            icon: '',
            cls: '',
            filter: '',
            render: noop,
            visible: noop, // 如果不设置或该方法返回非boolean值，则默认可见
            enable: noop,  // 如果不设置或该方法返回非boolean值，则默认可点击
            tmpl: tmpl.toolbar_button_group,
            buttons: []
        },
        undef;


    var ButtonGroup = function (options) {
        Button.call(this, options);
        this._o = $.extend({}, default_options, options);
    };

    ButtonGroup.prototype = $.extend({}, Button.prototype, {

        __is_tbar_gbtn: true,

        apply_on: function ($el) {
            Button.prototype.apply_on.apply(this, arguments);

            $el.on('mouseenter', function () {
                $(this).addClass('on');
            });
            $el.on('mouseleave', function () {
                $(this).removeClass('on');
            });
        },

        render: function ($to) {
            var me = this,
                $el = this._$el = $(me._o.tmpl({ o: this._o })).appendTo($to),
                $ls = $el.find('ul'),
                o = me._o;

            // append button
            $.each(o.buttons, function (i, btn_cfg) {
                btn_cfg.tmpl = tmpl.toolbar_button_group_item;
                var btn = o.buttons[i] = new Button(btn_cfg);
                btn.render($ls);
            });

            $el.on({
                mouseenter: function () {
                    $el.addClass('on');
                },
                mouseleave: function () {
                    $el.removeClass('on');
                }
            });

            this.__rendered = true;

            if (o.render !== noop) {
                o.render.call(me);
            }
        },

        /**
         * @overwrite
         */
        update: function () {
            if (!this.__rendered)
                return;

            Button.prototype.update.call(this);

            for (var i = 0, l = this._o.buttons.length; i < l; i++) {
                var btn = this._o.buttons[i];
                btn.update();
            }
        },

        /**
         * @overwrite
         */
        set_handler: function () {
            throw 'ButtonGroup.set_handler() 不允许修改handler';
        }
    });

    ButtonGroup.is_instance = function (obj) {
        return !!obj && obj.__is_tbar_gbtn;
    };

    return ButtonGroup;
});/**
 * 工具栏组件
 * @author jameszuo
 * @date 13-8-23
 */
define.pack("./ui.toolbar.toolbar",["lib","$","./ui.toolbar.button_group","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

    // Button = require('./ui.toolbar.button'),
        ButtonGroup = require('./ui.toolbar.button_group'),

        tmpl = require('./tmpl'),

        undef;


    var Toolbar = function (args) {
        this._$el = null;
        this._set_btns(args.btns || []);
        this._cls = args.cls;
        this._apply_to = args.apply_to;
        this._filter_visible = typeof args.filter_visible === 'boolean' ? args.filter_visible : false;

        // 默认所有按钮都是隐藏的，只有调用 toggle 方法时才
        if (this._filter_visible)
            this.filter();
    };

    Toolbar.prototype = {

        /**
         * 渲染
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                $apply_to = me._apply_to ? $(me._apply_to) : null;

            if ($apply_to && $apply_to[0]) {
                me._$el = $apply_to;
            } else {
                me._$el = $(tmpl.toolbar({ btns: me._btns })).addClass(this._cls).appendTo($to);
            }

            me._$el.find('[data-btn-id]').each(function (i, btn_el) {
                var $btn_el = $(btn_el),
                    id = $btn_el.attr('data-btn-id'),
                    btn = me._btn_map[id];
                btn.apply_on($btn_el);
            });

            me.render = $.noop;
        },

        update: function () {
            var me = this,
                args = $.makeArray(arguments);

            // 设置按钮的状态
            $.each(me._btns, function (i, btn) {
                btn.update.apply(btn, args);
            });
        },

        get_btns: function () {
            return this._btns;
        },

        get_$el: function () {
            return this._$el;
        },

        toggle: function (visible) {
            this._$el && this._$el.css('display', visible ? '' : 'none');
        },

        /**
         * 切换按钮过滤器
         * @param {String} [filter] 使符合过滤方式的按钮可见
         */
        filter: function (filter) {
            if (!this._filter_visible)
                return;

            var has_visible_btn = false;

            if (filter) {
                $.each(this.get_btns(), function (i, btn) {
                    var match = btn._o.filter === filter;
                    if (match) {
                        btn.show();
                        has_visible_btn = true;
                    } else {
                        btn.hide();
                    }
                });
            } else {
                $.each(this.get_btns(), function (i, btn) {
                    btn.hide();
                });
            }

            var $el = this.get_$el();
            $el && $el[0] && $el.toggle(has_visible_btn);
        },

        /**
         * 设置按钮
         * @param {Button[]} btns
         */
        _set_btns: function (btns) {
            var me = this;

            me._btns = btns;
            me._btn_map = {};

            $.each(btns, function (i, btn) {
                me._btn_map[btn.get_id()] = btn;

                // 子菜单
                if (ButtonGroup.is_instance(btn)) {
                    $.each(btn._o.buttons, function (j, sb) {
                        me._btn_map[sb.get_id()] = sb;
                    })
                }
            });
        }
    };

    return Toolbar;
});/**
 * 一些小组件
 * @jameszuo 12-12-22 下午5:32
 */
define.pack("./ui.widgets",["lib","$","./tmpl","./constants","./global.global_event","./ui.center","i18n"],function (require, exports, module) {

    var lib = require('lib'),

        $ = require('$'),

        template = lib.get('./template'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        tmpl = require('./tmpl'),
        constants = require('./constants'),
        global_event = require('./global.global_event'),
        page_event = require('./global.global_event').namespace('page'),
        ui_center = require('./ui.center'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.widgets',

        $win = $(window),
        $doc = $(document),

        dam_ie6 = $.browser.msie && $.browser.version < 7,

        KEYPRESS_EVENT_NAME = dam_ie6 ? 'keypress' : 'keydown',

        undefined;

    /**
     * 确认框
     * @param title 标题
     * @param msg 消息
     * @param {String/Object} desc 消息（小字）
     * @param ok_callback 确定回调
     * @param cancel_callback 取消回调
     * @param button_texts 按钮文本
     * @param escape_html 转义msg、desc为html文本，默认true
     */
    exports.confirm = function (title, msg, desc, ok_callback, cancel_callback, button_texts,escape_html) {
        var $el = $('#_widgets_confirm');
        if ($el[0]) {
            $el.remove();
        }

        if (!$.isArray(button_texts)) {
            button_texts = [];
        }

        escape_html = typeof escape_html === 'boolean' ? escape_html : true;

        var tip = '';
        if(typeof desc === 'object'){
            tip = desc.tip;
            desc = desc.text;
        }
        $el = $(tmpl.confirm({ title: title, msg: msg, desc: desc, tip : tip, button_texts: button_texts, escape_html: escape_html })).appendTo(document.body);

        var
            ok = function () {
                toggle(false);

                if ($.isFunction(ok_callback))
                    ok_callback();
            },

            cancel = function () {
                toggle(false);

                if ($.isFunction(cancel_callback))
                    cancel_callback();
            },

            toggle = function (visible) {
                if (visible) {
                    $el.fadeIn('fast');
                    ui_center.listen($el);
                } else {
                    $el.fadeOut('fast', function () {
                        ui_center.stop_listen($el);
                        $el.remove();
                    });
                }

                mask.toggle(visible, 'ui.widgets.confirm');
            };

        toggle(true);

        // 默认焦点
        $el.find(':button._ok').focus();

        // 交互
        $el.on('click.widgets_confirm', ':button._ok', function (e) {
            e.preventDefault();
            ok();
        });
        $el.on('click.widgets_confirm', 'a._x,:button._x', function (e) {
            e.preventDefault();
            cancel();
        });
        $el.on(KEYPRESS_EVENT_NAME + '.widgets_confirm', function (e) {
            if (e.which == 27) {
                cancel();
            }
        });
        require.async('jquery_ui', function () {
            if (!$el.parent()[0]) {
                return;
            }
            $el.draggable({
                handle: '.ui-xbox-title, .ui-xbox-foot, [data-draggable-target]',
                cancel: 'a, button, input',
                containment: 'document',
                start: function () {
                    ui_center.stop_listen($el);
                }
            });
        });
    };

    /**
     * 提示框
     * @param {Object} options
     *  - {String} title
     *  - {String} msg
     *  - {String} desc
     *  - {String} button_text
     *  - {Function} ok
     */
    exports.alert = function (options) {
        new Dialog({
            title: options.title,

            content: $(tmpl.alert_dialog_content({ type: options.type, msg: options.msg, desc: options.desc })),
            destroy_on_hide: true,
            buttons: [
                { id: 'OK', text: options.button_text || _(l_key,'确定'), klass: 'ui-btn-ok', disabled: false, visible: true }
            ],
            handlers: {
                OK: function () {
                    this.hide();

                    if ($.isFunction(options.ok)) {
                        options.ok();
                    }
                }
            }
        }).show();
    };
    exports.alert.ok = function (options) {
        return exports.alert($.extend(options, {
            type: 'ok'
        }));
    };
    exports.alert.info = function (options) {
        return exports.alert($.extend(options, {
            type: 'info'
        }));
    };
    exports.alert.warn = function (options) {
        return exports.alert($.extend(options, {
            type: 'warn'
        }));
    };

    /**
     * 显示、隐藏遮罩
     */
    var mask = exports.mask = {

        _namespaces: {},
        _listened_window: false,

        /**
         * 显示遮罩
         * @param {string} namespace
         * @param {jQuery|HTMLElement} [under_$el] 将元素显示在遮罩层上方（修改 under_$el 的 z-index）
         * @param {boolean} white 使用白色遮罩
         */
        show: function (namespace, under_$el, white, extra) {
            this.toggle(true, namespace, under_$el, white, extra);
        },

        hide: function (namespace) {
            this.toggle(false, namespace);
        },

        /**
         * 显示、隐藏遮罩
         * @param {boolean} visible
         * @param {string} namespace
         * @param {jQuery|HTMLElement} [under_$el] 将元素显示在遮罩层上方（修改 under_$el 的 z-index）
         * @param {boolean} white 使用白色遮罩
         * @param {Object} extra 扩展参数
         */
        toggle: function (visible, namespace, under_$el, white, extra) {
            if (typeof visible !== 'boolean') {
                return;
            }

            white = white === true;
            extra = extra || {};
            var opacity = extra.opacity || 0.65;

            var namespaces = this._namespaces,
                cur_showing = namespace in namespaces;

            // 防止重复隐藏或显示
            if (visible === cur_showing) {
                return;
            }

            var
                me = this,
                $mask_el = me._$mask || (me._$mask = $(tmpl.mask()).hide().appendTo(document.body)),
                position = dam_ie6 ? 'absolute' : 'fixed';

            $mask_el
                .stop()
                .css({
                    top: 0,
                    left: 0,
                    position: position,
                    width: '100%',
                    height: position === 'fixed' ? '100%' : document.body.scrollHeight
                });

            // 显示
            if (visible) {
                $mask_el.toggleClass('ui-mask-white', !!white).css('background-color', white ? '#FFF' : '#000');

                if (!$mask_el.is(':visible')) {
                    $mask_el.css({ opacity: 0, display: 'block' });
                }

                $mask_el.animate({ opacity: opacity }, 'fast');

                // 动态调整遮罩大小
                if (dam_ie6 && !me._listened_window) {
                    me.listenTo(global_event, 'window_resize window_scroll', function () {
                        setTimeout(function () {
                            $mask_el.height(document.body.scrollHeight);
                        }, 0);
                    });
                    me._listened_window = true;
                }

                // 将元素显示在遮罩层上方
                if (under_$el) {
                    var z_index = parseInt($mask_el.css('z-index'));
                    if (z_index) {
                        $(under_$el).css('z-index', z_index + 1);
                    }
                }

                namespaces[namespace] = true;
            }

            // 隐藏
            else {
                delete namespaces[namespace];

                // 没有任何元素再需要遮罩，即可隐藏
                if ($.isEmptyObject(namespaces)) {
                    $mask_el.animate({ opacity: 0 }, 'fast', function () {
                        $(this).css({ opacity: '', display: 'none' });
                    });

                    if (dam_ie6) {
                        me.stopListening(global_event, 'window_resize window_scroll');
                        me._listened_window = false;
                    }
                }
            }
        }
    };
    $.extend(mask, events);

    // 没有遮罩在显示时，才可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        return $.isEmptyObject(mask._namespaces);
    });


    /**
     * 对话框
     */
    var Dialog = exports.Dialog = (function () {
        var
            DEFAULTS = {
                klass: '',
                title: '',
                content: '', // content 可以是string、jQueryElements、HTMLElement、function
                animate: true,
                module: true,
                empty_on_hide: false, // 隐藏时清空
                destroy_on_hide: false, // 隐藏时销毁
                no_doc_wheel: false, // 隐藏浏览器默认滚动条
                tmpl: tmpl.dialog,
                mask_bg: 'ui-mask',
                mask_ns: 'default', // 参考mask的namespace(随便写，唯一就行)
                buttons: [ 'OK', 'CANCEL' ], // or [ { id:'test', text:'测试', klass:'', disabled:false } ]
                movable: true, // 是否可移动窗口
                handlers: null, // { OK: func(), CANCEL: func() }
                out_look_2_0: false//2.0风格
            },

            DEFAULT_BUTTONS = {
                OK: { id: 'OK', text: _(l_key,'确定'), klass: 'ui-btn-ok', disabled: false, visible: true, submit: true },
                CANCEL: { id: 'CANCEL', text: _(l_key,'取消'), klass: 'ui-btn-cancel', disabled: false, visible: true },
                CLOSE: { id: 'CLOSE', text: _(l_key,'关闭'), klass: 'ui-btn-cancel', disabled: false, visible: true }
            },

        // 构造函数
            Dialog = function (config) {
                this.config = $.extend({}, DEFAULTS, config);
            };

        Dialog.prototype = {

            _rendered: false,
            _visible: false,

            render_if: function () {
                var me = this;
                if (!me._rendered) {
                    me._rendered = true;

                    var
                        config = me.config,
                        $el;

                    // 预处理按钮
                    var buttons = $.map(config.buttons, function (btn) {
                        if (typeof btn == 'string') {
                            return DEFAULT_BUTTONS[btn];
                        } else {
                            return btn.id ? btn : undefined;
                        }
                    });
                    //外观2.0风格
                    if( config.out_look_2_0 ){
                       config.tmpl = tmpl.dialog_2_0;
                    }
                    // 构造并插入内容
                    $el = me.$el = $(config.tmpl({ config: config, buttons: buttons })).hide().appendTo(document.body);
                    
                    var $foot = $el.find('div.__buttons');

                    me.$buttons = $foot.children(':button,:submit');
                    me.$msg = $foot.children('.__msg');

                    // 绑定一些事件 ===============================================

                    // 绑定按钮事件
                    if (config.handlers) {
                        $.each(buttons, function (i, btn) {
                            if (btn !== DEFAULT_BUTTONS.CANCEL && btn !== DEFAULT_BUTTONS.CLOSE) {
                                $el.on('click', ':button[data-btn-id="' + btn.id + '"]', $.proxy(config.handlers[btn.id] || $.noop, me));
                                $el.on('click', 'a[data-btn-id="' + btn.id + '"]', $.proxy(config.handlers[btn.id] || $.noop, me));
                            }
                                
                        });
                    }

                    // 按钮状态
                    $.each(buttons, function (i, button) {
                        me.set_button_visible(button.id, button.visible);
                        me.set_button_enable(button.id, !button.disabled);
                    });

                    // 取消/关闭按钮特殊处理
                    $el.on('click', '[data-btn-id=CANCEL], [data-btn-id=CLOSE]', function (e) {
                        e.preventDefault();
                        me.hide(false);
                    });

                    // 回车
                    $el.on('keyup', function (e) {
                        if (e.which === 13 && config.handlers['OK'] && !$(e.target).closest('button, a')[0]) {
                            config.handlers['OK'].call(me);
                        }
                    });


                    // 设置内容
                    if (config.content) {
                        me.set_content(config.content);
                    }

                    this.trigger('render');
                }
            },

            show: function () {

                if (this._visible) {
                    return;
                }

                var me = this;
                me.render_if();

                me.config.animate ? me.$el.fadeIn('fast', function () {
                    me.trigger('after_show', me.$el);
                }) : me.$el.show();

                if (me.config.no_doc_wheel)
                    me.no_doc_wheel(true);

                if (me.config.module) {
                    //可以设置dialog的遮罩背景色，默认是灰色
                    if( me.config.mask_bg == 'ui-mask-white' ) {
                        mask.show( 'ui.widgets.Dialog.' + me.config.mask_ns, '',true );
                    }
                    else {
                        mask.show('ui.widgets.Dialog.' + me.config.mask_ns);
                    }
                }

                me.enable_esc(true);

                ui_center.listen(me.$el);

                if (me.config.movable) {
                    require.async('jquery_ui', function () {
                        if (!me.$el || !me.$el.parent()[0]) {
                            return;
                        }
                        me.$el.draggable({
                            handle: '.box-head, .ui-xbox-title, .ui-xbox-foot, [data-draggable-target]',
                            cancel: 'a, button, input',
                            containment: 'document',
                            start: function () {
                                ui_center.stop_listen(me.$el);
                            }
                        });
                    });
                }

                this._visible = true;

                this.trigger('show');
            },

            /**
             * 隐藏
             */
            hide: function () {
                if (!this._visible) {
                    return;
                }

                var me = this,
                    config = me.config;

                /*// 隐藏前进行判断, CANCEL事件返回false时阻止关闭
                 if (config.handlers && config.handlers['CANCEL'] && config.handlers['CANCEL'].call(me) === false) {
                 return;
                 }*/

                var after_hide = function () {
                    me.hide_msg();

                    // 恢复滚动条
                    if (me.config.no_doc_wheel)
                        me.no_doc_wheel(false);

                    // 取消按下esc关闭窗口事件
                    me.enable_esc(false);

                    // 隐藏遮罩
                    if (config.module) {
                        mask.hide('ui.widgets.Dialog.' + me.config.mask_ns);
                    }

                    // 取消居中
                    ui_center.stop_listen(me.$el);

                    // 隐藏时清空
                    if (config.empty_on_hide) {
                        me.set_content('');
                    }

                    me._visible = false;

                    me.trigger('hide');

                    // 隐藏时销毁
                    if (config.destroy_on_hide) {
                        me.destroy();
                    }
                };

                me.$el.fadeOut(config.animate ? 'fast' : 0, function () {
                    after_hide();
                });
            },

            set_class: function (klass) {
                this.render_if();
                var cls = this.$el.attr('class');
                this.$el.attr('class', cls.substr(0, cls.indexOf('__') + '__'.length) + ' ' + klass);
            },

            set_title: function (title) {
                this.render_if();
                this.$el.find('.__title').text(title);
            },

            set_content: function (content) {
                var me = this;

                me.render_if();

                var
                    config = me.config,

                    $el = me.$el,
                    $content = me.get_$body().empty();

                // 向对话框中插入内容
                if (typeof content == 'string' || (content instanceof $) || (content.tagName && content.nodeType)) {
                    $content.append(content);
                } else if (typeof content == 'function') {
                    $content.append(content());
                }else {
                    console.error('widgets.Dialog.set_content(content)', '无效的content参数：', content);
                }

                this.trigger('update_content');
            },

            set_button_enable: function (button_id, enable) {
                enable = enable !== false;
                var $btn = this.$buttons.filter('[data-btn-id="' + button_id + '"]');
                $btn.toggleClass('disabled', !enable);
                if (enable) {
                    $btn.removeAttr('disabled');
                } else {
                    $btn.attr('disabled', 'disabled');
                }
            },

            set_button_visible: function (button_id, visible) {
                this.$buttons.filter('[data-btn-id="' + button_id + '"]').toggle(visible);
            },

            /**
             * 修改按钮文本 code by bondli
             */
            set_button_text: function(button_id, text) {
                var $btn = this.$el.find('[data-btn-id="' + button_id + '"]');
                $btn.html(text);
            },

            error_msg: function (msg) {
                var $msg = this.$msg;
                var time = 5000;
                $msg.removeClass('ui-tips-ok ui-tips-warn').addClass('ui-tips-err').text(msg).fadeIn('fast');
                clearTimeout(this.$msg.data('timer'));
                $msg.data('timer', setTimeout(function () {
                    $msg.stop(true, true).fadeOut('fast');
                }, time));
            },

            hide_msg: function () {
                clearTimeout(this.$msg.data('timer'));
                this.$msg.stop(true, true).fadeOut('fast');
            },

            destroy: function () {
                if (this.$el) {
                    this.$el.remove();
                    this.$el = null;
                    this.trigger('destroy');
                    this.off().stopListening();
                }
            },

            submit: function () {
                this.trigger('submit');
            },

            /**
             * 禁止滚动
             */
            no_doc_wheel: function (disable) {
                $('html, body').css('overflow-y', disable ? 'hidden' : '');
            },

            enable_esc: function (esc) {
                $doc.off(KEYPRESS_EVENT_NAME + '.widgets_Dialog');

                if (esc) {
                    var me = this;
                    $doc.on(KEYPRESS_EVENT_NAME + '.widgets_Dialog', function (e) {
                        if (e.which == 27) {
                            me.hide();
                        }
                    });
                }
            },

            set_height: function (h) {
                this.$el.height(h);
            },

            get_height: function () {
                return this.$el.outerHeight();
            },

            focus_button: function (btn_id) {
                this.$buttons.filter('[data-btn-id="' + btn_id + '"]').focus();
            },

            is_visible: function () {
                return !!this._visible;
            },

            get_$body: function () {
                return $('div.__content', this.$el);
            },

            get_$el : function () {
                return this.$el;
            }
        };

        $.extend(Dialog.prototype, events);

        return Dialog;
    })();

    /**
     * loading mark
     */
    exports.loading = {
        show: function () {
            var $el = this._get_$el(),
                fix_top = this._get_fix_top(),
                h = $el.height(),
                w = $el.width(),
                client_height = window.innerHeight || document.body.clientHeight;


            $el
                .removeClass('icon-loading')
                .addClass('icon-loading')
                .css({
                    position: dam_ie6 ? 'absolute' : 'fixed',
                    left: '50%',
                    top: fix_top + (client_height - fix_top) / 2 + 'px',
                    marginLeft: -(h / 2) + 'px',
                    marginTop: -(w / 2) + 'px',
                    display: ''
                });
        },

        hide: function () {
            this._get_$el().stop(false, true).hide();
        },

        _get_$el: function () {
            var $el = this._$el;
            if (!$el) {
                $el = this._$el = $('<div/>');
                $el
                    .css({
                        position: 'fixed',
                        display: 'none'
                    })
                    .appendTo(document.body);
            }
            return $el;
        },

        _get_fix_top: function () {
            var $wrapper = $('#_main_wrapper');
            if ($wrapper[0]) {
                return $wrapper.offset().top;
            } else {
                return 0;
            }
        }
    };
});/**
 * URL生成器 TODO 移动到lib下
 * @jameszuo 12-12-26 下午7:02
 */
define.pack("./urls",["lib","./constants"],function (require, exports, module) {

    var lib = require('lib'),
        JSON = lib.get('./json'),

        undefined;

    module.exports = {

        /**
         * 跳转： .redirect('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  location.href = 'http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22';
         * @param url
         * @param params
         */
        redirect: function (url, params) {
            location.href = this.make_url(url, params);
        },

        /**
         * 生成靠谱的URL而不会出现编码问题： .make_url('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         *
         * @param {String} url
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_url: function (url, params, encode_value) {

            url = this.absolute_url(url);

            var params_str = this.make_params(params, encode_value);

            var suffix = url.indexOf( '?' ) > -1 ? '&' : '?';

            return url + (params_str ? suffix + params_str : '');
        },

        /**
         * 生成靠谱的URL参数而不会出现编码问题   { appid: 1, profile: { id:'AAA', length: 2 } }  ->   appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_params: function (params, encode_value) {
            if (typeof params == 'object') {
                var p = [],
                    encode = encodeURIComponent;

                for (var key in params) {
                    var value = params[key];
                    if (value == undefined) {
                        value = '';
                    }

                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                        p.push(encode(key) + '=' + encode(value)); // JSON 必须 encode
                    }
                    else {
                        value = value.toString();
                        p.push(encode(key) + '=' + (encode_value !== false ? encode(value) : value));
                    }

                }
                return p.join('&');
            }
            return '';
        },

        /**
         * 转换绝对路径URL： .absolute_url('web/index.html')  ->  http://www.weiyun.com/web/index.html
         *
         * @param url
         * @return {*}
         */
        absolute_url: function (url) {
            // 如果不是以 http:// 开头，则表示是相对路径，转为绝对路径
            var constants = require('./constants');
            if (!reg_abs_url.test(url)) {
                url = constants.DOMAIN + (url.charAt(0) == '/' ? url : '/' + url);
            }
            return url;
        },

        /**
         * 获取当前URL
         */
        cur_url: function () {
            return location.href;
        }
    };

    var reg_abs_url = /^https?:\/\//;

});/**
 * 记录用户的操作日志
 * @jameszuo 12-12-24 下午12:45
 */
define.pack("./user_log",["lib","$","./constants","./query_user","./urls","./configs.ops"],function (require, exports, module) {
    var
        lib = require('lib'),

        $ = require('$'),

        JSON = lib.get('./json'),
        console = lib.get('./console').namespace('user_log'),
        image_loader = lib.get('./image_loader'),

        constants = require('./constants'),
        query_user = require('./query_user'),
        urls = require('./urls'),
        ops = require('./configs.ops'),

    // 版本号（统计用，参考oz配置）
        VERSION_NO = constants.IS_APPBOX ? 0 : 1,

    // 操作系统类型（统计用，参考oz配置）
        OS_TYPE = constants.APPID,

    //  设备类型
        DEVICE_TYPE = constants.IS_APPBOX ? 9002 : 9001,    // appbox 的设备类型是9002

    // 模块ID（统计用，参考oz配置）
        SERVICE_ID = 1,// { disk: 1, photo: 2 }[constants.APP_NAME],

        base_params = {
            extString1: constants.OS_NAME,
            extString2: constants.BROWSER_NAME + ($.browser.msie ? parseInt($.browser.version) : '')
        },

    // 用户点击数 && 暂时存储点击获取的数据
        count_to_sent = 1, // $.browser.msie && $.browser.version < 7 ? 6 : 10, // 应erric要求，去掉批量上报的特性
        stack_data = [],

        undefined;


    if (VERSION_NO == null) {
        console.warn('获取 VERSION_NO 失败');
    }
    if (OS_TYPE == null) {
        console.warn('获取 OS_TYPE 失败');
    }
    if (SERVICE_ID == null) {
        console.warn('获取 SERVICE_ID 失败');
    }

    var default_headers = {
        cmd: 'wy_log_flow_bat',
        dev_id: DEVICE_TYPE,
        os_type: OS_TYPE,
        dev_type: DEVICE_TYPE,
        client_ip: '',
        weiyun_ver: '',
        source: 'weiyunWeb',
        os_ver: '',
        msg_seq: 1,
        proto_ver: 2,
        rsp_compressed: 1,
        encrypt: 0,
        net_type: 0
    };

    var cgi_url = 'http://tj.cgi.weiyun.com/wy_log.fcg';


    /**
     * oz 用户行为分析数据上报（旧版）
     * @param {String|Number} op_or_name 操作数字ID或名称（如9130或'disk_file_list_reaload'）
     * @param {Number} [ret]
     * @param {Object} [params]
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     */
    var user_log = function (op_or_name, ret, params, extra_config) {

        var cfg = ops.get_op_config(op_or_name), op;
        if (cfg) {
            op = cfg.op;
            console.log('APPID:' + default_headers.os_type, op + '>' + cfg.name);
        }
        else {
            if (parseInt(op_or_name) == op_or_name) {
                op = op_or_name;
                console.log('APPID:' + default_headers.os_type, op);
            } else {
                console.warn('无效的参数op=' + op_or_name);
                return;
            }
        }


        var data = $.extend({
            op: op,
            rst: ret || 0,
            service_id: SERVICE_ID,
            subop: 0
        }, base_params, params);

        // 单个上报
        if (count_to_sent === 1 || extra_config) {
            user_log.single_log(extra_config, data);
        }
        // 批量上报
        else {
            stack_data.push(data);
            if (stack_data.length == count_to_sent) {
                user_log.pitch_log(stack_data);
                stack_data = [];
            }
        }

    };

    /**
     * 设置基础参数（所有的user_log请求都会戴上这些参数）
     */
    user_log.set_base_param = function (key, value) {
        base_params[key] = value;
    };

    /**
     * 批量上报日志
     * bondli
     */
    user_log.pitch_log = function (data) {
        var header = $.extend({
            uin: query_user.get_uin_num()
        }, default_headers);

        var body = {
            log_data: data
        };

        var data_str = JSON.stringify({
            req_header: header,
            req_body: body
        });


        image_loader.load(urls.make_url(cgi_url, { data: data_str}));
    };

    /**
     * 日志上报 带extra_config参数
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     * @param {Object} data 鼠标点击时获取的数据
     *
     */
    user_log.single_log = function (extra_config, data) {

        var data_str = JSON.stringify({
            req_header: $.extend({}, default_headers, {
                uin: query_user.get_uin_num()
            }, extra_config),
            req_body: {
                log_data: [ data ]
            }
        });

        image_loader.load(urls.make_url(cgi_url, { op: data.op, data: data_str}));

    };

    /**
     *
     * header
     * body
     *  log_data[{
     *     op:1
     *
     *  }]
     *
     */

    return user_log;
});/**
 * 复制操作工具类
 * IE内核的appbox和IE6优先使用clipboardData，其它使用flash的zclip插件,如果IE7以上的且无flash则使用clipboardData
 * 使用时应先使用类方法can_copy()进行判断显示可使用复制
 * @author hibincheng
 * @date 2013-09-09
 */
define.pack("./util.Copy",["lib","$","./constants","i18n"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        constants = require('./constants'),
        console = lib.get('./console'),

        ie = $.browser.msie,
        ie6 = ie && $.browser.version < 7,
        MOVIE_PATH = require.resolve('publics/plugins/ZeroClipboard/') + 'WyZeroClipboard.swf',
        _ = require('i18n').get('./pack'),
        doc_title =  _('common.copy', (constants.IS_APPBOX ?  '微云' : '微云网页版') ),
        __has_flash,
        flash_hover_class = 'flash-hover',
        singleton_clip,

        undefined;

    var Copy = inherit(Event, {
        /**
         *
         * @param {Object} cfg:
         *                {String} container_selector 复制功能的区域容器选择器
         *                {String} target_selector 复制按钮选择器
         * eg: new Copy({
         *    container_selector: '#copy_container',
         *    target_selector: '[data-clipboard-target]'
         * })
         */
        target_selector: '[data-clipboard-target]',//默认
        container_selector: null,
        constructor: function(cfg) {
            $.extend(this, cfg);
            // 非appbox 下的IE内核和非IE6且有flash的先初始化zclip
            if(!(constants.IS_APPBOX && ie) && !ie6 && has_flash()) {
                this._init_zclip();
            }
        },
        //IE使用clipboardData进行复制的方法
        ie_copy: function(text) {
            if ($.browser.msie && window.clipboardData) {
                var me = this;
                var ie_clipboard = window.clipboardData;

                setTimeout(function () {
                    if (ie_clipboard.getData('Text') == text) {
                        me.trigger('copy_done');
                    } else {
                        me.trigger('copy_error');
                    }
                }, 50);

                ie_clipboard.setData('Text', text || '');
                return true;
            }
            return false;
        },
        //初始化zclip插件
        _init_zclip: function() {
            var me = this;
            if(me._zclip_inited) {
                return;
            }

            // 加载剪切板
            require.async('wy_zclip', function () {
                var is_appbox = constants.IS_APPBOX;
                WyZeroClipboard.console = console;
                WyZeroClipboard.IS_APPBOX = is_appbox;
                WyZeroClipboard.setDefaults( {allowScriptAccess: "always",trustedDomains: 'www.weiyun.com' } );
                if(!singleton_clip) {
                    singleton_clip = new WyZeroClipboard(null, {
                        moviePath: MOVIE_PATH,
                        hoverClass: flash_hover_class//flash会影响到DOM的hover效果，所以要使用增加样式名来控制
                    });
                    document.title = doc_title;
                    singleton_clip.addEventListener('load', function(clip) {
                        document.title = doc_title;
                    });

                    singleton_clip.addEventListener('mousedown', function() {
                        var copy_text = singleton_clip.target_ctx.trigger('provide_text');
                        singleton_clip.setText(copy_text);
                    });
                    singleton_clip.addEventListener('complete', function() {
                        singleton_clip.target_ctx.trigger('copy_done');
                        // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug
                        document.title = doc_title;

                    });

                    singleton_clip.addEventListener('mouseout', function() {
                        singleton_clip.target_ctx.trigger('mouseout');
                    });
                }
               $(me.container_selector ? me.container_selector : 'body').on('mouseenter.copyfun', me.target_selector, function() {
                   me._$cur_target = $(this);
                   singleton_clip.setCurrent(me._$cur_target[0]);
                   singleton_clip.target_ctx = me;//保存当前copy对象的引用，后续事件触发的对象为该引用
                   me.trigger('mouseover');
               });

               me._zclip_inited = true;
            });


        },

        get_$cur_target: function() {
            return this._$cur_target;
        },

        destroy: function() {
            if(!this._zclip_inited) {//ie使用原生clipboard不需要下面操作
                return;
            }
            this._$cur_target = null;
            if(singleton_clip.target_ctx == this) {
                singleton_clip.target_ctx = null;
            }
            if(this.container_selector) {
                $(this.container_selector).off('mouseenter.copyfun', this.target_selector);
            } else {
                $('body').off('mouseenter.copyfun', this.target_selector);
            }
        }
    });

    /**
     * 是否可进行复制操作
     * @returns {boolean}
     */
    Copy.can_copy = function() {
        if(has_flash()) {
            return true;
        } else if(ie) {
            return true;
        } else {
            return false;
        }
    }

    //helper
    var has_flash = function () {
        if (__has_flash !== undefined) {
            return __has_flash;
        }

        var hasFlash = false;
        var plugin;
        try {
            if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                hasFlash = true;
            }
        }
        catch (error) {
            plugin = navigator.mimeTypes["application/x-shockwave-flash"];
            if (plugin && plugin.enabledPlugin) {
                hasFlash = true;
            }
        }

        // for appbox
        if (!hasFlash) {
            hasFlash = window.external && window.external.FlashEnable && window.external.FlashEnable();
        }

        return __has_flash = !!hasFlash;
    }

    return Copy;
});/**
 * 浏览器配型和版本
 * @author jameszuo
 * @date 13-8-5
 */
define.pack("./util.browser",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        name = (function (b) {
            if (b.msie) {
                return 'ie';
            } else if (b.chrome) {
                return 'chrome';
            } else if (b.mozilla) {
                return 'mozilla';
            } else if (b.safari) {
                return 'safari';
            } else if (b.webkit) {
                return 'webkit';
            } else {
                return 'unknown';
            }
        })($.browser),

    undef;

    return {
        name: name
    };
});/**
 * 函数的扩展功能
 * @author svenzeng
 * @date 2013-3-6
 */


define.pack("./util.functional",[],function (require, exports, module) {

    var proto = Function.prototype,
        slice = Array.prototype.slice,
        join = Array.prototype.join,
        functional = {};


    /**
     * uncurrying, 让对象拥有内置对象原型链上的方法
     *   push = functional.uncurrying( Array.prototype.uncurrying );
     *   var a = {};
     *   a.push( 1 );
     *   alert ( a.length );
     */

    functional.uncurrying = function (fn) {
        return function () {
            return proto.call.apply(fn, arguments);
        };
    };

    /**
     * 绑定上下文
     * var a = functional.bind( function(){alert(this.a)}, {a:1} )
     */

    functional.bind = function (fn, context) {
        var args = slice.call(arguments, 2);
        return function () {
            return fn.apply(context, args.concat(slice.call(arguments)));
        };
    };


    /**
     * 让一个函数在另一个函数之前执行.
     * var func = functional.before(function(){ alert( 1 ) },  function(){alert( 2 )} );
     */


    functional.before = function (before, fn) {
        return function () {
            if (fn.apply(this, arguments) === false) {
                return false;
            }
            return before.apply(this, arguments);
        };
    };


    /**
     * 让一个函数在另一个函数之后执行. 可以用于数据统计
     * var func = functional.after(function(){ alert( 1 ) },  function(){alert( 2 )} );
     */

    functional.after = function (fn, after) {
        return function () {
            var ret = fn.apply(this, arguments);
            if (ret === false) {
                return false;
            }
            after.apply(this, arguments);
            return ret;
        };
    };

    /**
     * 在一个函数前后分别执行
     * @param {Function} before
     * @param {Function} fn 被包裹的方法
     * @param {Function} after
     * @returns {Function}
     */
    functional.wrap = function (before, fn, after) {
        return function () {
            if (before.apply(this, arguments) === false) {
                return false;
            }
            var ret = fn.apply(this, arguments);
            if (ret === false) {
                return false;
            }
            after.apply(this, arguments);
            return ret;
        };
    };


    /**
     * currying, 保存参数最后一次执行.
     * var func = function(){ alert ( arguments.length ) }.curring();
     * func(1); func(2); func(3); func();
     */

    functional.currying = function (fn) {
        var __args = [];
        return function () {
            if (arguments.length === 0) {
                return fn.apply(this, __args);
            }
            [].push.apply(__args, arguments);
            return arguments.callee;
        };
    };


    /**
     * 使函数拥有惰性加载和单例特性
     * var getUploadPlugin = functional..getSingle( function(){ return New ActivexObject( 'xxxx' ) });
     * var plugin = getUploadPlugin();
     */


    functional.getSingle = function (fn) {
        var ret;
        return function () {
            return ret || ( ret = fn.apply(this, arguments) );
        };
    };


    /**
     * 函数节流, 用于调用频繁的函数, 如window.onresize
     * window.onresize = functional.throttle( function(){ alert ( 'windiw.onresize' ) } 300 ); // todo fix window resize
     * 300ms才触发一次
     */

    functional.throttle = function ( fn, interval ) {

        var __self = fn,
            timer,
            firstTime = true;

        return function () {

            var args = arguments,
                __me = this;

            if (firstTime) {
                __self.apply(__me, args);
                return firstTime = false;
            }

            if (timer) {
                return false;
            }

            timer = setTimeout(function () {

                clearTimeout(timer);
                timer = null;

                __self.apply(__me, args);

            }, interval);

        };

    };


    /**
     * 记忆函数, 根据参数的不同确定有无必要再次运算.
     * var a = functional.cache( function(b){ alert ( b ) } );
     * a(1) //alert (1);
     * a(1) //不执行
     */

    functional.cache = function (fn) {

        var __self = fn,
            paramCache = {},
            retCache = {};

        return function () {
            var paramStr = join.call(arguments);

            if (paramCache[ paramStr ]) {  //已经被运算过
                return retCache[ paramStr ];
            }

            paramCache[ paramStr ] = true;

            return retCache[ paramStr ] = __self.apply(this, arguments);

        };
    };


    /**
     * 延迟执行, 相当于setTimeout.
     * var a = functinal.delay( function(b){ alert ( b ) } 1000 );
     * a(1) //alert (1);
     * a(1) //不执行
     */

    functional.delay = function (fn, timer) {
        if(fn){
            setTimeout(function() {
                fn();
            }, timer);
        }
    };


    functional.try_it = function( fn ){

        try{
            return fn();
        }catch(e){
            return void(0);
        }

    };


    functional.burst = function( ary, fn, len ,inter_time ){
        var obj,
            start,
            t;

            var run = function(){
                for ( var i = 0; i < len; i++ ){
                    obj = ary.shift();
                        if ( !obj ){
                            return false;
                        }
                    fn.call( obj, obj );
                }
            };

            start = function(){
                if ( run() === false ){
                    return;
                }

                t = setInterval(function(){
                    if ( run() === false ){
                        return clearInterval( t );
                    }
                }, (inter_time || 200));

            };

        return {
            start: start
        };

    };


    return functional;

});
/**
 * 获取用户总容量的显示
 * @author bondli
 * @date 13-11-22
 */
define.pack("./util.get_total_space_size",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],

        math = Math,
        parse_int = parseInt,

        undefined;

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Number} [decimal_digits] 保留小数位，默认2位
     */
    get_total_space_size = function (bytes, decimal_digits) {
        bytes = parse_int(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 2;

        if (!bytes)
            return '0B';

        var unit = parse_int(math.floor(math.log(bytes) / math.log(1024)));

        if(unit>3){
            unit = 3; //只显示到G的级别
        }
        var size = bytes / math.pow(1024, unit);
        var decimal_mag = math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35


        return decimal_size + BYTE_UNITS[unit];
    };


    return get_total_space_size;
});/**
 * 操作系统信息
 * @author jameszuo
 * @date 13-8-5
 */
define.pack("./util.os",["lib"],function (require, exports, module) {
    var lib = require('lib'),

        collections = lib.get('./collections'),

        nav = navigator.userAgent.toLowerCase(),
        mappings = [ // 请勿随意调整顺序
            ['ipad', 'ipad'],
            ['iphone', 'iphone'],
            ['mac', 'mac os,macintosh'],
            ['windows phone', 'windows phone'],
            ['windows', 'windows'],
            ['android', 'android'],
            ['linux', 'linux'],
            ['unix', 'unix'],
            ['symbian', 'symbian'],
            ['blackberry', 'bb10,blackberry,playbook']
        ],
        os_name,
        undef;

    for (var i = 0, l = mappings.length; i < l; i++) {
        var map = mappings[i],
            name = map[0],
            uas = map[1].split(',');

        if (collections.any(uas, function (ua) {
            return nav.indexOf(ua) !== -1;
        })) {
            os_name = name;
            break;
        }
    }

    return {
        name: os_name || 'unknown os'
    };

});/**
 * 上传控件检测工具
 * 功能：1、获取上传控件的版本号，当未安装控件或老控件不存在版本号时为'0'
 *     2、判断当前使用的控件是否是最新的版本，当发布新的控件是要修改最新的版本号
 * @author hibincheng
 * @date 2013-08-22
 */
define.pack("./util.plugin_detect",["$","./constants","lib"],function(require, exports, module) {

    var $ = require('$'),
        constants = require('./constants'),
        lib = require('lib'),
        console = lib.get('./console'),

        IE_NEWEST_PLUGIN_VERSION = '1.0.3.12',//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION = '1.0.0.10',//webkit控件最新的版本号

        undefined;

    //IE
    function ie_plugin_version() {
        try {
            var plugin = new ActiveXObject("TXWYFTNActiveX.FTNUpload");
            return plugin.version || '0';
        } catch(e) {
            return '0';
        }
    }

    //chrome & firefox
    function webkit_plugin_version() {
        var nps = navigator.plugins,
            ret = '0';
        try {
            nps.refresh(false);//刷新控件表，不刷新页面
        } catch(e) {

        }
        $.each(nps || [], function(i, plugin) {//从控件列表中查找上传控件是否已经存在
            if(plugin.name.indexOf('Tencent FTN plug-in') > -1) {
                $.each(plugin, function(j, item) {
                    if(item.type === 'application/txftn-webkit') {
                        ret = plugin.description.split('#');
                        if(ret.length > 1) {
                            ret = $.trim(ret[1]);
                        } else {
                            ret = '0';
                        }
                        return false;//break
                    }
                });

                if(ret !== '0') {
                    return false;//break
                }
            }
        });

        return ret;
    }

    function is_newest_version() {
        var cur_version,
            newest_version;
        if(constants.IS_APPBOX){
            if(window.external.GetVersion){
                console.log(window.external.GetVersion());
                return true;
            }else{
                return false;
            }
        }
        if($.browser.msie) {
            cur_version = parseInt(ie_plugin_version().split('.').join(''), 10);
            newest_version = parseInt(IE_NEWEST_PLUGIN_VERSION.split('.').join(''), 10);
        } else {
            cur_version = parseInt(webkit_plugin_version().split('.').join(''), 10);
            newest_version = parseInt(WEBKIT_NEWEST_PLUGIN_VERSION.split('.').join(''), 10);
        }

        if(cur_version >= newest_version) {
            return true;
        }

        return false;
    }

    //获取控件的版本号，当老控件不存在版本时返回0
    return {
        IE_NEWEST_PLUGIN_VERSION: IE_NEWEST_PLUGIN_VERSION,//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION: WEBKIT_NEWEST_PLUGIN_VERSION,//webkit控件最新的版本号
        get_ie_plugin_version: ie_plugin_version,
        get_webkit_plugin_version: webkit_plugin_version,
        is_newest_version: is_newest_version
    };

});
//tmpl file list:
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_tip.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'context_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),

        constants = require('./constants'),
        click_tj = require('./configs.click_tj'),
        arrow = data.arrow,
        items = data.items || [],
        length = items.length;
    __p.push('    <div data-no-selection data-comm-ctxtmenu class="content-menu">\r\n\
        <ul class="');
_p( data.has_icons ? 'ico-mod' : 'txt-mod' );
__p.push('"  style="');
_p(data.width ? 'width:'+data.width+'px;' : '');
__p.push('">');

            $.each(items, function (i, item) { __p.push('                <li data-action="item" data-item-id="');
_p( item.config.id );
__p.push('" ');
_p(click_tj.make_tj_str(item.config.tj_id));
__p.push('                    ><a href="javascript:void(0);" hidefocus="on"\r\n\
                        ><i class="');
_p( item.config.icon_class );
__p.push('"></i\r\n\
                        ><span data-action="text">');
_p( item.config.text );
__p.push('</span\r\n\
                        >');
 if (item.get_sub_menu()) { __p.push('<em class="ico-point-right">');
 } __p.push('</em\r\n\
                    ></a\r\n\
                ></li>');
 if (i < length - 1) { __p.push('                    ');
 if(items[i+1].config.group !== item.config.group) { __p.push('                        <li class="split"></li>');
 } __p.push('                ');
 } __p.push('            ');
 }); __p.push('        </ul>');
 if (arrow) {__p.push('            <s class="ui-arr"></s>\r\n\
            <s class="ui-arr ui-tarr"></s>');
 } __p.push('    </div>');

return __p.join("");
},

'mini_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-tip-box">\r\n\
        <span class="full-tip"><span class="inner"><i class="ico"></i><span class="text" data-action="text"></span></span></span>\r\n\
    </div>');

return __p.join("");
},

'loading_mark': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-no-selection class="ui-waiting">\r\n\
        <i class="icon-loading"></i>\r\n\
        <span class="_n ui-text"></span>\r\n\
    </div>');

return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var Button = require('./ui.toolbar.button'),
        ButtonGroup = require('./ui.toolbar.button_group');
    __p.push('    <div class="toolbar-btn clear">');

        for (var i=0, l=data.btns.length; i<l; i++) {
            var btn = data.btns[i];
            if (ButtonGroup.is_instance(btn)) {
                _p( this.toolbar_button_group(btn) );

            } else if (Button.is_instance(btn)) {
                _p( this.toolbar_button(btn) );

            } else
            __p.push('<span data-no-selection class="btn-gap"></span>');

        }
        __p.push('    </div>');

return __p.join("");
},

'toolbar_button': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var btn = data; __p.push('    <a data-btn-id="');
_p( btn.get_id() );
__p.push('" data-no-selection class="btn ');
_p( btn._o.cls );
__p.push(' ');
_p( btn.update_enable && data.err_tip ? 'disable' : '' );
__p.push('" style="');
_p( data._visible ? '' : 'display:none;' );
__p.push('" href="#"><span class="btn-auxiliary ');
_p(btn._o.btn_cls);
__p.push('">');
 if (btn._o.icon) { __p.push('<i class="ico ');
_p( btn._o.icon );
__p.push('"></i>');
 } if(btn._o.label){__p.push('<span class="text">');
_p( btn._o.label );
__p.push('</span>');
}__p.push('</span></a>');

return __p.join("");
},

'toolbar_button_group': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var btn = data; __p.push('    <div data-btn-id="');
_p( btn.get_id() );
__p.push('" data-no-selection class="btn ');
_p( btn._o.cls );
__p.push('">\r\n\
        <span class="btn-auxiliary">');
 if (btn._o.icon) { __p.push('<i class="ico ');
_p( btn._o.icon );
__p.push('"></i>');
 } __p.push('            <span class="text">');
_p( btn._o.label );
__p.push('</span>');
 if (btn._o.buttons.length) { __p.push('<i class="ico ico-point"></i>');
 } __p.push('        </span>\r\n\
        <ul class="toolbar-dropdown">');

            var sub_btns = btn._o.buttons;
            for (var i = 0, l = sub_btns.length; i < l; i++) {
                var sb = sub_btns[i];
                _p( this.toolbar_button_group_item(sb) );

            }
        __p.push('        </ul>\r\n\
    </div>');

return __p.join("");
},

'toolbar_button_group_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var btn = data; __p.push('    <li data-btn-id="');
_p( btn.get_id() );
__p.push('" data-no-selection class="dw-gap ');
_p( btn._o.cls );
__p.push(' ');
_p( btn.update_enable && data.err_tip ? 'disable' : '' );
__p.push('" style="');
_p( data._visible ? '' : 'display:none;' );
__p.push('"><a href="#">');
_p( btn._o.label );
__p.push('</a></li>');

return __p.join("");
},

'confirm': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.widgets';
    __p.push('    <div id="_widgets_confirm" data-no-selection class="ui-xbox ui-confirm" style="display:none;">\r\n\
        <div class="ui-shadow"></div>\r\n\
        <div class="ui-xbox-inner">\r\n\
            <div class="ui-xbox-wrap">\r\n\
                <h3 class="_title ui-xbox-title">');
_p( text.text(data.title) );
__p.push('</h3>\r\n\
                <div class="ui-xbox-cnt">\r\n\
                    <div class="ui-confirm-cnt">\r\n\
                        <i class="icon-xbox icon-xbox-warn"></i>\r\n\
                        <h4 class="ui-title">');
_p( data.escape_html ? text.text(data.msg) : data.msg );
__p.push('</h4>\r\n\
                        <div class="ui-text" title="');
_p( text.text(data.tip) );
__p.push('">');
_p( data.escape_html ? text.text(data.desc) : data.desc );
__p.push('</div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="ui-xbox-foot">\r\n\
                    <input type="button" class="_ok ui-btn-ok" value="');
_p( data.button_texts[0] ? text.text(data.button_texts[0]) : _(l_key,'确定') );
__p.push('"/>\r\n\
                    <input type="button" class="_x ui-btn-cancel" value="');
_p( data.button_texts[1] ? text.text(data.button_texts[1]) : _(l_key,'取消') );
__p.push('"/>\r\n\
                </div>\r\n\
            </div>\r\n\
            <a class="_x icon-close ui-xbox-close" href="javascript:void(0)">×</a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'mask': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_widgets_mask" data-no-selection class="ui-mask" style="display:none;"></div>');

return __p.join("");
},

'dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div data-no-selection class="ui-xbox ui-confirm __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <div class="ui-shadow"></div>\r\n\
        <div class="ui-xbox-inner">\r\n\
            <div class="ui-xbox-wrap" style="height:100%">\r\n\
                <h3 class="__title ui-xbox-title">');
_p( text.text(data.config.title) );
__p.push('</h3>\r\n\
                <div class="__content ui-xbox-cnt">\r\n\
\r\n\
                </div>\r\n\
                <div class="__buttons ui-xbox-foot">\r\n\
                    <div class="__msg ui-tips ui-tips-err" style="display:none;"></div>');

                    $.each(data.buttons || [], function(i, btn) {
                        __p.push('                        <button data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="');
_p( text.text(btn.klass) );
__p.push('" type="button">');
_p( text.text(btn.text) );
__p.push('</button>');

                    });
                    __p.push('                </div>\r\n\
            </div>\r\n\
            <a data-btn-id="CANCEL" class="icon-close ui-xbox-close" href="javascript:void(0)">×</a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'dialog_2_0': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
    lib = require('lib'),
    text = lib.get('./text'),
    inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div class="ui-xbox dialog_2_0 __ ');
_p( text.text(data.config.klass) );
__p.push('" data-no-selection >\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head ui-xbox-title">\r\n\
                <h3 class="__title box-title">');
_p(text.text(data.config.title) );
__p.push('</h3>\r\n\
            </div>\r\n\
            <div class="box-body __content"></div>\r\n\
            <div class="__buttons foot">\r\n\
                <div class="__msg tips ui-tips-err" style="display:none;"></div>');

                $.each(data.buttons || [], function(i, btn) {
                __p.push('                <button data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="');
_p( text.text(btn.klass) );
__p.push('" type="button">');
_p( text.text(btn.text) );
__p.push('</button>');

                });
                __p.push('            </div>\r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" class="box-close" href="javascript:void(0)"><span class="hidden-text">×</span></a>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'alert_dialog_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var cls = 'info';
    switch(data.type) {
        case 'info':
            cls = 'icon-xbox-info';
            break;
        case 'ok':
            cls = 'icon-xbox-ok';
            break;
        case 'warn':
            cls = 'icon-xbox-warn';
            break;
    }
    __p.push('    <div class="ui-confirm-cnt">\r\n\
        <i class="icon-xbox ');
_p( cls );
__p.push('"></i>\r\n\
        <h4 class="ui-title">');
_p( data.msg || '' );
__p.push('</h4>\r\n\
        <div class="ui-text">');
_p( data.desc || '' );
__p.push('</div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
