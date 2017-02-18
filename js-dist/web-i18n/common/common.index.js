//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n/common/common.index",["lib","common","$","i18n"],function(require,exports,module){

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
//common/src/cgi_ret_report.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/ops.js
//common/src/constants.js
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
//common/src/pb_cmds.js
//common/src/query_user.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/ui/center.js
//common/src/ui/column_model/column.js
//common/src/ui/column_model/column_model.js
//common/src/ui/column_model/ui.js
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
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
//common/src/ui/column_model/column_model.tmpl.html
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_tip.APPBOX.tmpl.html
//common/src/ui/mini_tip.WEB.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html

//js file list:
//common/src/cgi_ret_report.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/ops.js
//common/src/constants.js
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
//common/src/pb_cmds.js
//common/src/query_user.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/ui/center.js
//common/src/ui/column_model/column.js
//common/src/ui/column_model/column_model.js
//common/src/ui/column_model/ui.js
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
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
/**
 * 返回码上报
 * @author jameszuo
 * @date 13-4-25
 */
define.pack("./cgi_ret_report",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        image_loader = lib.get('./image_loader'),

        urls = common.get('./urls'),

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
                    uin : common.get('./query_user').get_uin_num() || undefined,
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
define.pack("./configs.click_tj",["lib","common"],function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),

        console = lib.get('./console'),
        ops = common.get('./configs.ops');

    return {
        /**
         * 为需要点击统计的元素生成 HTML 属性名和属性值，包含这些属性的元素在点击时会自动统计
         * @param {String} op_name 参考 user_log 中的 click_ops
         * @returns {string}
         */
        make_tj_str: function (op_name) {
            var tj_id = ops.get_click_op_by_name(op_name);
            if (tj_id) {
                return 'data-tj-action="btn-adtag-tj" data-tj-value="' + tj_id + '"';
            } else {
                return '';
            }
        },

        with_$el: function ($el, op_name) {
            var tj_id = ops.get_click_op_by_name(op_name);
            if (tj_id) {
                $el.attr('data-tj-action', 'btn-adtag-tj').attr('data-tj-value', tj_id);
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

            // ---- 回收站 ---------------------------------
            // 拉取回收站文件列表
            recycle_query_list: { oz_op: 9118, m_speed_flags: '7830-4-3-1' },
            // 清空回收站
            recycle_clear: { oz_op: 9120, m_speed_flags: '7830-4-3-4' },
            // 回收站还原文件
            recycle_restore_files: { m_speed_flags: '7830-4-3-5' }
        },

    // 点击流统计
        click_ops = {

            /************ 导航区（50000-50999）*******************/
            INDEP_PWD: 50002,                      //导航-独立密码
            LOGIN_OUT: 50006,                      //导航-退出
            HEADER_HELP: 50001,                     //导航-帮助
            HEADER_FANKUI: 50003,                   //导航-反馈
            HEADER_GUANWANG: 50004,                 //导航-官网

            NAV_DISK: 50201,                       // 导航-网盘
            NAV_RECYCLE: 50202,                     // 导航-回收站
            NAV_PHOTO: 50205,                      // 导航-相册
            NAV_RECENT: 50203,                     // 导航-最近文件
            NAV_DISK_REFRESH: 50221,                //网盘-工具条-刷新
            NAV_RECENT_REFRESH: 50204,            //最近文件-刷新

            /************ 头像 *******************/
            HEADER_USER_FACE_HOVER: 50100,         // 头像菜单-鼠标移动至头像
            HEADER_USER_FACE_DOWNLOAD_CLIENT: 50101, // 头像菜单-下载客户端
            HEADER_USER_FACE_FEEDBACK: 50003,       // 头像菜单-反馈


            /************ 工具条（52100-52199）*******************/
            TOOLBAR_UPLOAD: 52101,                 //网盘-工具条-上传按钮
            TOOLBAR_DOWNLOAD: 52102,               //网盘-工具条-下载
            TOOLBAR_DOWNLOAD_BACK: 52103,          //网盘-工具条-下载-返回
            TOOLBAR_DOWNLOAD_OK: 52104,            //网盘-工具条-下载-确定下载
            TOOLBAR_MANAGE: 52105,                 //网盘-工具条-管理
            TOOLBAR_MANAGE_MOVE: 52106,            //网盘-工具条-管理-移动
            TOOLBAR_MANAGE_MOVE_BACK: 52107,       //网盘-工具条-管理-移动-返回
            TOOLBAR_MANAGE_MOVE_OK: 52108,         //网盘-工具条-管理-移动-点击移动
            TOOLBAR_MANAGE_MOVE_EXPAND_DIR: 52109, //网盘-工具条-管理-移动-展开目录
            TOOLBAR_MANAGE_DELETE: 52110,          //网盘-工具条-管理-删除
            TOOLBAR_MANAGE_DELETE_BACK: 52111,     //网盘-工具条-管理-删除-返回
            TOOLBAR_MANAGE_DELETE_OK: 52112,       //网盘-工具条-管理-删除-确定删除
            TOOLBAR_MANAGE_MKDIR: 52113,           //网盘-工具条-管理-新建文件夹
            TOOLBAR_RECYCLE: 52114,                //网盘-工具条-回收站
            TOOLBAR_RECYCLE_BACK: 52115,           //网盘-工具条-回收站-返回
            TOOLBAR_RECYCLE_RESTORE: 57251,        //网盘-工具条-回收站-还原
            TOOLBAR_RECYCLE_CLEAR: 57252,          //网盘-工具条-回收站-清空回收站


            /************ 面包屑区域（52200-52299）**************/
            DISK_BREAD_DIR: 52201,                  //网盘-面包屑-点击其他目录
            DISK_BREAD_WEIYUN: 52202,               //网盘-面包屑-点击“微云”
            SWITCH_AZLIST_MODE: 52203,              //网盘-查看模式-按a-z排序
            SWITCH_NEWESTLIST_MODE: 52204,          //网盘-查看模式-按时间排序
            SWITCH_NEWTHUMB_MODE: 52205,            //网盘-查看模式-按缩略图

            /************ item 区（52300-52399）**************/
            ITEM_RENAME: 52303,                    //网盘-item-文件夹重命名
            ITEM_DELETE: 52304,                    //网盘-item-删除（按钮）
            ITEM_MOVE: 52320,                      //网盘-item-移动按钮
            ITEM_DOWNLOAD: 52307,                  //网盘-item-下载（按钮）
            FILE_MENU_MORE: 52308,                  //网盘-item-更多
            MORE_MENU_LINK_SHARE: 52309,           //网盘-item-更多-链接分享
            MORE_MENU_DELETE: 52310,           //网盘-item-更多-删除
            MORE_MENU_MAIL_SHARE: 52311,           //网盘-item-更多-邮件分享
            MORE_MENU_RENAME: 52312,               //网盘-item-更多-重命名
            DISK_DRAG_RELEASE: 52313,              //拖拽item后放手
            DISK_DRAG_DIR: 52314,                  //拖拽item到其他目录
            DISK_DRAG_BREAD: 52315,                //拖拽item到面包屑

            /************ 右键（52400-52499）**************/
            RIGHTKEY_MENU: 52401,                   //网盘-右键-呼出右键
            RIGHTKEY_MENU_DOWNLOAD: 52402,         //网盘-右键-下载
            RIGHTKEY_MENU_MAIL_SHARE: 52403,       //网盘-右键-邮件分享
            RIGHTKEY_MENU_LINK_SHARE: 52404,       //网盘-右键-链接分享
            RIGHTKEY_MENU_MOVE: 52405,             //网盘-右键-移动
            RIGHTKEY_MENU_RENAME: 52406,           //网盘-右键-重命名
            RIGHTKEY_MENU_DELETE: 52407,           //网盘-右键-删除


            /************ 上传下载框（52500-52599）**************/
            DISK_PLUGIN_INSTALL: 52501,            // 网盘-控件-“立即安装”
            DISK_PLUGIN_REINSTALL: 52502,          // 网盘-控件-重新安装
            DISK_PLUGIN_INSTALLED: 52503,          // 网盘-控件-点击“完成”
            DISK_UPLOAD_DONE: 52504,               // 网盘-上传-点击完成
            DISK_UPLOAD_SLIDE_UP: 52505,           // 网盘-上传-点击收起
            DISK_UPLOAD_PAUSE: 52506,              // 网盘-上传-点击暂停
            DISK_UPLOAD_CANCEL: 52507,             // 网盘-上传-点击取消(完全未上传)
            DISK_UPLOAD_CONTIUNE: 52508,             // 网盘-上传-点击续传
            DISK_UPLOAD_RESUME_CONTIUNE: 52514,      //网盘-上传-断点续传
            DISK_UPLOAD_HAS_DATA_CANCEL: 52509,    // 网盘-上传-点击取消(有上传)
            UPLOAD_DOWN_BAR_CLOSE: 52510,          // 网盘-下载-关闭APPBOX下载条
            UPLOAD_DOWN_BAR_OPEN_DIR: 52511,       // 网盘-下载-点开APPBOX下载条的文件（打开文件所在目录）
            DISK_DRAG_UPLOAD: 52512,                //拖拽上传
            DISK_DRAG_DOWNLOAD: 52513,              //拖拽下载


            /************ 其他区（52600-52699）*******************/
            VRY_INDEP_PWD: 50401,                  //网盘 -输入并验证独立密码
            TO_TOP: 52602,                         //回到顶部
            BOX_SELECTION: 52603,                   // 框选

            /************ 最近文件*********************************/
            RECENT_DOWNLOAD_BTN: 57001,           //最近文件-下载按钮
            RECENT_CLICK_ITEM: 57002,           //最近文件-item整条点击
            RECENT_LOAD_MORE: 57003,           //最近文件-加载更多

            /************ 图片预览 ********************************/
            IMAGE_PREVIEW_DOWNLOAD: 52610, // 图片预览 - 下载
            IMAGE_PREVIEW_REMOVE: 52611, // 图片预览 - 删除
            IMAGE_PREVIEW_RAW: 52612, // 图片预览-查看原图
            IMAGE_PREVIEW_NAV_PREV: 52613, // 图片预览-左翻页
            IMAGE_PREVIEW_NAV_NEXT: 52614, // 图片预览-右翻页
            IMAGE_PREVIEW_CLOSE: 52615, // 图片预览-关闭

            /************ 压缩包预览*******************************/
            COMPRESS_DOWNLOAD: 52701, // 下载压缩包内文件
            COMPRESS_PREV: 52702,     // 返回上一级
            COMPRESS_ENTER: 52703,    // 进入目录
            COMPRESS_CLOSE: 52704,    // 关闭

            /************ 点击item ********************************/
            ITEM_CLICK_DOWNLOAD: 52390,      // 网盘-item-点击item整条-下载
            ITEM_CLICK_DOC_PREVIEW: 52391,   // 网盘-item-点击item整条-预览文档
            ITEM_CLICK_IMAGE_PREVIEW: 52393, // 网盘-item-点击item整条-预览图片
            ITEM_CLICK_ZIP_PREVIEW: 52392, // 网盘-item-点击item整条-预览压缩包
            ITEM_CLICK_LIST_CHECKBOX: 52330, // 网盘-item-checkbox-列表
            ITEM_CLICK_THUMB_CHECKBOX: 52331, // 网盘-item-checkbox-缩略图


            /****************** 上传管理 *************************/
            UPLOAD_SELECT_FILE           : 52530,  //上传主按钮
            UPLOAD_SELECT_PATH_CLOSE     : 52540,  //新上传-关闭位置选择框
            UPLOAD_SELECT_PATH_MODIFY    : 52541,  //新上传-“修改”文字链接
            UPLOAD_SELECT_PATH_OK        : 52542,  //新上传-选择指定目录
            UPLOAD_SUBMIT_BTN_NORMAL     : 52543,  //新上传-“普通上传”按钮
            UPLOAD_INSTALL_BTN_PLUGIN    : 52544,  //新上传-“极速上传”按钮-触发安装
            UPLOAD_SUBMIT_BTN_PLUGIN     : 52805,  //极速上传点击-位置选择框

            UPLOAD_FILE_MANAGER_OPEN     : 52545,  //新上传-展开任务管理器
            UPLOAD_FILE_MANAGER_CLOSE    : 52546,  //新上传-收起任务管理器
            UPLOAD_FILE_MANAGER_DONE     : 52547,  //新上传-任务管理器-“完成”按钮
            UPLOAD_FILE_MANAGER_CANCEL   : 52548,  //新上传-任务管理器-“全部取消/取消”按钮
            UPLOAD_FILE_MANAGER_PAUSE    : 52549,  //新上传-任务管理器-“暂停”按钮
            UPLOAD_FILE_MANAGER_RESUME   : 52550,  //新上传-任务管理器-“续传”按钮
            UPLOAD_FILE_MANAGER_CONTINUE : 52551,  //新上传-任务管理器-“重试”按钮

            UPLOAD_FILE_MANAGER_INSTALL  : 52553,  //新上传-任务管理器-出错提示安装控件
            UPLOAD_FILE_MANAGER_OVER_LIMIT : 52554,  //新上传-单文件超过限制-”关闭“按钮

            UPLOAD_FILE_OVER_LIMIT_CLOSE   : 52554,  //新上传-单文件超过限制-”关闭“按钮
            UPLOAD_FILE_OVER_LIMIT_INSTALL : 52555,  //新上传-单文件超过限制-”安装控件“按钮
            
            UPLOAD_FILE_MANAGER_ALL_RETRY  : 52556,   //新上传-上传失败-”全部重试“按钮
            UPLOAD_BY_DRAG:               52640,      // 拖拽上传

            UPLOAD_UPLOAD_4G_FILE              : 52534,  //上传-上传文件夹-超大文件
            UPLOAD_UPLOAD_4G_RESUME_UPLOAD     : 52540,  //上传-跨登录续传-继续上传
            UPLOAD_UPLOAD_4G_TIPS_CONTINUE_IN  : 52550,  //上传-4G以内框-“继续上传” 
            UPLOAD_UPLOAD_4G_TIPS_RESELECT     : 52551,  //上传-4G以内框-“重新选择”
            UPLOAD_UPLOAD_4G_TIPS_CONTINUE_OUT : 52552,  //上传-4G以外框-“继续上传”
            UPLOAD_UPLOAD_4G_PLUGIN_INSTALL    : 52830,  //控件引导-4G以上-升级控件

            /****************** 网盘新工具条 *************************/
            DISK_TBAR_ALL_CHECK: 52130,   // 网盘-工具条-全选
            DISK_TBAR_DOWN: 52131,        // 网盘-工具条-下载
            DISK_TBAR_LINK_SHARE: 52132,  // 网盘-工具条-链接分享
            DISK_TBAR_MAIL_SHARE: 52133,  // 网盘-工具条-邮件分享
            DISK_TBAR_DEL: 52134,      // 网盘-工具条-删除
            DISK_TBAR_MOVE: 52135,        // 网盘-工具条-移动
            DISK_TBAR_RENAME: 52136,       // 网盘-工具条-重命名
            /******************* 上传控件安装 **********************/
            PLUGIN_TIPS_INSTALL                  : 52800, //tips引导安装控件按钮
            //PLUGIN_JISU_INSTALL                  : 52805, //极速上传点击
            PLUGIN_POP_PANEL_INSTALL             : 52811, //功能性弹窗-“安装控件”
            PLUGIN_FLASH_LIMIT_INSTALL           : 52814, //上传任务中-flash限制-“安装控件”
            PLUGIN_ONLINE_ENTER                  : 52815, //在线安装页面-进入
            PLUGIN_ONLINE_REINSTALL              : 52816, //在线安装页面-重新下载/安装
            PLUGIN_DOWNLOAD_ENTER                : 52818, //下载安装页面-进入
            PLUGIN_DOWNLOAD_REINSTALL            : 52819, //下载安装页面-重新下载/安装

            PLUGIN_ONLINE_SUCCESS                : 52802, //在线安装页面-成功
            PLUGIN_DOWNLOAD_SUCCESS              : 52803, //下载安装页面-成功

            PLUGIN_POP_PANEL_SUCCESS             : 52820, //触发安装后弹窗-已安装成功
            PLUGIN_POP_PANEL_REINSTALL           : 52821, //触发安装后弹窗-重新安装
            PLUGIN_POP_PANEL_FAIL_REINSTALL      : 52822, //触发安装后弹窗-控件未安装成功-重新安装

            UPLOAD_UPLOAD_FILE                   : 52531, //上传-上传文件
            UPLOAD_UPLOAD_DIR                    : 52532, //上传-上传文件夹
            UPLOAD_UPLOAD_DIR_NO_PLUGIN          : 52533, //上传-上传文件夹-未安装控件

            UPLOAD_SELECT_FOLDER_NO_FOLDER       : 52560, //新上传-选择文件夹-包含子目录
            UPLOAD_SELECT_FOLDER_HAS_FOLDER      : 52561, //新上传-选择文件夹-不包含子目录
            UPLOAD_FOLDER_ERROR_HOVER            : 52562,  //新上传-选择文件夹-出错时hove详情

            /******************  Appbox添加微云到主面板引导页 *************************/
            ADD_WY_TO_APPBOX : 69002      //   利用subop 1 现在添加 2已完成 3暂不添加 4重新添加 5 以后添加 6 确定  7 关闭按钮

        },

    // 手动统计（如文档预览的加载时间等）
        manual_ops = {

            //控件上传
            active_plugin: 9136,

            webkit_plugin: 9136,

            //flash上传
            upload_flash: 9137,

            //表单上传：9138
            upload_form: 9138,

            //续传：20001
//            upload_resume: 20001, // 20001代表的是 请求发送微云文件，这个应该与WEB端无关。

            //qq传文件上传到微云
            upload_from_QQClient: 20003,

            //qq传完文件后，点击“到微云中查看”
            view_from_QQClient: 20005,

            //下载劫持侦测
            download_hijack_check: 405,


            /************* webkit下载 *******************************/
            webkit_donwload: 515,

            /****************头部链接广告*********************/
            header_ad_link_web: 69000,
            header_ad_link_appbox: 69001,


            /***************cgi因自动重试而成功****************/
            re_try_flag: 59001
        };


    return {

        /**
         * 通过命令字获取 op(for oz.isd.com)
         * @param {String} cmd
         * @returns {Number}
         */
        get_oz_op: function (cmd) {
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
         * 通过操作名称获取OP
         * @param {String} op_name 操作名称
         * @return {String} op
         */
        get_oz_op_by_name: function (op_name) {
            if (op_name in manual_ops) {
                return manual_ops[op_name];
            }
            return '';
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
        },

        /**
         * 通过点击流操作名称获取op
         * @param {String} click_op_name
         * @return {String} op
         */
        get_click_op_by_name: function (click_op_name) {
            if (click_op_name in click_ops) {
                return click_ops[click_op_name];
            }
            return '';
        }
    };
});/**
 * 一些常量
 * @jameszuo 12-12-19 下午12:45
 */

define.pack("./constants",["lib","i18n","$","./util.os","./util.browser"],function (require, exports, module) {

    var
        lib = require('lib'),
        _ = require('i18n'),
        $ = require('$'),

        url = lib.get('./url_parser').get_cur_url(),

        collections = lib.get('./collections'),

        IS_APPBOX = url.has_param('appbox'),
        IS_QZONE = !IS_APPBOX && url.has_param('qzone'),

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


    var OS_TYPES = {
//            WEB : 4,
        WEB : 30234,
//            APPBOX : 7,
        APPBOX : 30012,
        QQ : 9,
        QZONE : 30225,
        QQNEWS : 30227    //QQ新闻安排id
    };
    var VIRTUAL_DIR_TYPES = {
        Text : 'text',
        Audio : 'audio',
        Image : 'picture',
        Video : 'video',
        Article : 'article'
    };

    return {

        // 主域名
        MAIN_DOMAIN: 'weiyun.com',

        // 域名
        DOMAIN: 'http://www.weiyun.com',

        WEB_ROOT: 'http://www.weiyun.com/v2',

        // 是否开发模式
        IS_DEBUG: url.has_param('debug'),

        // 是否是APPBOX
        IS_APPBOX: IS_APPBOX,

        IS_WEBKIT_APPBOX: IS_APPBOX && $.browser.webkit,

        // 是否嵌入到qzone中
        IS_QZONE : IS_QZONE,
        // 是否嵌入到其它网站中，例如qzone、q+之类，域名非weiyun
        IS_WRAPPED : IS_QZONE,
        
        APPID : IS_APPBOX ? OS_TYPES.APPBOX : (IS_QZONE ? OS_TYPES.QZONE : OS_TYPES.WEB),

        OS_NAME: os_name,
        OS_TYPES : OS_TYPES,
        BROWSER_NAME: browser_name,

        // UI 版本（如appbox使用旧版UI，web 使用新版UI。有了这个常量，更新UI版本时就不需要漫山遍野查找 constants.IS_APPBOX 了
        UI_VER: IS_APPBOX ? 'APPBOX' : 'WEB',

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
        
        VIRTUAL_DIR_TYPES : VIRTUAL_DIR_TYPES,
        VIRTUAL_DIRS : {
            weixin : {
                name : _('微信'),
                id : '5d37aaaef344b3e67fe406f7',
                children : {
                    msg : {
                        name : _('文字语音'),
                        id : '40281299baef0847a3086540',
                        types : [VIRTUAL_DIR_TYPES.Text, VIRTUAL_DIR_TYPES.Audio]
                    },
                    photo : {
                        name : _('视频图片'),
                        id : '32af48ea56dc0d0eb4df0ef0',
                        types : [VIRTUAL_DIR_TYPES.Image, VIRTUAL_DIR_TYPES.Video]
                    },
                    article : {
                        name : _('文章'),
                        id : '97afabcf7418883b2a70b95e',
                        types : [VIRTUAL_DIR_TYPES.Article]
                    }
                }
            },
            qqnews : {
                name : _('腾讯新闻'),
                id : 'd0f6974443cf31d41cba4a9a',
                children : {
                    photo : {
                        name : _('图片'),
                        id : 'ba4b1194e19cfa3e7c48ff4f',
                        types : [VIRTUAL_DIR_TYPES.Image]
                    }
                }
            },
            qqmail : {
                name: _('QQ邮箱'),
                async_load: true,
                appid: 30208
            }
        },

        DOC_PREVIEW_SIZE_LIMIT: DOC_PREVIEW_SIZE_LIMIT,

        // 打包下载文件个数上限
        PACKAGE_DOWNLOAD_LIMIT: 100,
        // 外链分享文件个数上限
        LINK_SHARE_LIMIT: 100,
        // 邮件分享文件个数上限
        MAIL_SHARE_LIMIT: 1

    };
});/**
 * 文件类
 *  @author jameszuo
 *  @date 13-1-16
 */

define.pack("./file.file_object",["$","lib","common","i18n","./file.file_type_map"],function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),

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
        max_len = 255; // 文件名最大字符数

    /**
     * 判断一个文件名是否有效
     * @param {String} name
     * @param {Boolean} is_dir
     */
    File.check_name = function (name, is_dir) {
        var err;
        // 检查字符个数
        if (!name) {
            err = _('名不能为空，请重新命名');
        }
        else if (re_name_deny.test(name)) {
            return _('不能包含以下字符之一 /\\:?*\"><|');
        }
        else if (/*text.byte_len(name)*/name.length > max_len) { // Fix bug 48823337，各操作系统的文件名是按字符计的，而非字节
            err = _('名过长，请重新命名');
        }
        return err ? (is_dir ? _('文件夹') : _('文件')) + err : undefined;
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
            doc:['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls:['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt:['ppt', 'pptx', 'pptm'],
            bmp:['bmp', 'tiff', 'exif', 'raw'],
            '3gp':['3gp', '3g2', '3gp2', '3gpp'],
            mpe:['mpe', 'mpeg', 'mpg', 'mpeg4'],
            asf:['asf', 'ram', 'm1v', 'm2v', 'mpe', 'mpeg', 'mpg', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'mkv', 'ogm', 'webm', 'ass', 'srt', 'ssa'],
            wav:['wav', 'midi', 'flac', 'ram', 'ra', 'mid', 'aac', 'm4a', 'ape', 'au', 'ogg'],
            c:['c', 'cpp', 'h', 'cs', 'plist'],
            '7z':['7z', 'z', '7-zip'],
            ace:['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg:['jpg', 'jpeg'],
            rmvb:['rmvb', 'rm'],
            hlp:['hlp', 'cnt'],
            code:['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec:['exec', 'dll'],
            pdf:['pdf'],
            txt:['txt', 'text'],
            msg:['msg'],
            rp:['rp'],
            vsd:['vsd'],
            ai:['ai'],
            eps:['eps'],
            log:['log'],
            xmin:['xmin'],
            psd:['psd'],
            png:['png'],
            gif:['gif'],
            mod:['mod'],
            mov:['mov'],
            avi:['avi'],
            swf:['swf'],
            flv:['flv'],
            wmv:['wmv'],
            wma:['wma'],
            mp3:['mp3'],
            mp4:['mp4'],
            ipa:['ipa'],
            apk:['apk'],
            ipe:['ipe'],
            exe:['exe'],
            msi:['msi'],
            bat:['bat'],
            fla:['fla'],
            html:['html'],
            htm:['htm'],
            asp:['asp'],
            xml:['xml'],
            chm:['chm'],
            rar:['rar'],
            zip:['zip'],
            tar:['tar'],
            cab:['cab'],
            uue:['uue'],
            jar:['jar'],
            iso:['iso'],
            dmg:['dmg'],
            bak:['bak'],
            tmp:['tmp'],
            old:['old'],
            document:['document'],
            image:['image'],
            video:['video'],
            audio:['audio'],
            compress:['compress'],
            unknow:['unknow'],
            filebroken:['filebroken']
        },
        all_map = {};


    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    var getWords = function( str, num ){
        try{
           var index = 0;
           for (var i = 0, l = str.length; i < l; i++ ){
               if ( (/[^\x00-\xFF]/).test( str.charAt(i) ) ){
                  index += 2;
               }else{
               index++;
            }
            if (index > num){
               return ( str.substr(0, i) + '..' );
            }
        }
           return str;
        }catch(e){
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
        can_identify:function( type ){
            return !!all_map[type];
        },
        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function( file_name, type ){
            switch(type){
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring( 0, 8 ),'...',file_name.substring( file_name.length-13 ) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring( 0, 7 ),'...',file_name.substring( file_name.length-7 ) ].join('') : file_name;
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
define.pack("./init.click_tj",["lib","common","$"],function (require, exports, module) {

    try{

        var
            lib = require('lib'),
            common = require('common'),

            $ = require('$'),
            cookie = lib.get('./cookie'),
            store = lib.get('./store'),
            console = lib.get('./console'),

            user_log = common.get('./user_log'),
            constants = common.get('./constants'),
            log_event = common.get('./global.global_event').namespace('log'),

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

        WINDOW_RESIZE = 'window_resize',
        WINDOW_RESIZE_REAL_TIME = 'window_resize_real_time',
        WINDOW_SCROLL = 'window_scroll',
        PRESS_KEY_ESC = 'press_key_esc',
        PAGE_UNLOAD = 'page_unload',

        resize_timer,
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

                var new_width = $win.width(),
                    new_height = $win.height();

                if (win_width != new_width || win_height != new_height) {

                    win_width = new_width;
                    win_height = new_height;

                    global_event.trigger(WINDOW_RESIZE, win_width, win_height);
                }
            }, 200);

            global_event.trigger(WINDOW_RESIZE_REAL_TIME, $win.width(), $win.height());
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
define.pack("./init.prevent_events",["lib","common","$"],function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),

        constants = common.get('./constants'),

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
                if (k in PREVENT_KEYS // 直接阻止的按键
                    || (e.ctrlKey && (k in PREVENT_CTRL_KEYS)) // ctrl组合键
                    || k === K_BACKSPACE && !(e.target && e.target.tagName.toUpperCase() === 'INPUT')) { // 退格键
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
define.pack("./m_speed",["lib","common"],function (require, exports, module) {
    var
        lib = require('lib'),
        common = require('common'),
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
            }
            return '';
        },
        set: function (mod_name, action_name, start_date, done_date) {
            var action = this._get_action(mod_name, action_name);
            action._start = start_date;
            action._done = done_date;
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
//                console.debug('自定义测速点 > ' + mod_name + (action_name ? '.' + action_name : '') + '\n' + mod.__flags.substr(0, mod.__flags.lastIndexOf('-')) + '-' + index + '  ' + time_arr.join(', '));
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
            var uin = common.get('./query_user').get_uin_num();
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
define.pack("./module",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('module'),
        events = lib.get('./events'),

        global_event = common.get('./global.global_event'),

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
        if(invoke_map){
            for(property_name in invoke_map){
                if(invoke_map.hasOwnProperty(property_name)){
                    invoke_array.push({
                        name : property_name,
                        fn : me[invoke_map[property_name]],
                        scope : me
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
                var render_ret = org_render.apply(this, arguments);

                if (render_ret === false) { // render 方法返回false可以阻止UI渲染
                    render_ui = false;
                }
            }

            // 渲染UI
            if (render_ui && this.ui) {
                if (!Module.is_instance(this.ui)) {
                    throw module_name + '的UI模块必须是Module实例';
                }
                this.ui.render.apply(this.ui, arguments);
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
            if(params && invoke_array.length>0){
                $.each(invoke_array, function(index, invoke_properties){
                    var name = invoke_properties.name;
                    if(params.hasOwnProperty(name)){
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
 * WEBCGI2.0 PB协议命令字对接
 * @author hibincheng
 * @date 2014-06-11
 */
define.pack("./pb_cmds",[],function(require, exports, module) {

    var cmds = {
        Invalid : 0,

        //-------------------------------------------------------------------//
        //文件预览模块用到的相关命令
        ListFile                : 51,          //拉取压缩文件中的列表--手机Srv转发给spp
        TransListFile           : 52,     //转发拉取命令--spp发现没有该文件信息，转给其它的spp处理
        ExtractFile             : 53,       //抽取压缩文件中的某个文件请求
        TransExtractFile        : 54,  //转发抽取压缩文件中的某个文件请求
    
        //-------------------------------------------------------------------//
        //office文档预览cgi与spp通讯
        ConvertOfficeToHtml     : 100,  //转换文档为html
        ConvertOfficeToPic      : 101,  //转换文档为图片
        DownloadAndConvertOffice: 102,  //下载并转换文档
        //docview
        DocviewPreviewFile      : 103, //请求预览文档
        DocviewGetPreview       : 104, //拉取预览结果
        DocviewConvertFile      : 105, //转换文档
        DownloadFile            : 106, //下载源文件
    
        //-------------------------------------------------------------------//
        //KeyValue系统用到的相关命令
        KeyValueSet         : 200,
        KeyValueGet         : 201,
        KeyValueDel         : 202,
        KeyValueAppend      : 203,
        KeyValueDeppend     : 204,
        KeyValueOverwrite   : 205,
        KeyValueInsert      : 206,
        KeyValueGetConfig   : 220,
        KeyValueGetIndex    : 221,
        KeyValueGetList     : 222,
        KeyValueClearUser   : 223,
    
        //-------------------------------------------------------------------//
        //qza_proxy QZONE代理服务器
        QzaShareAddShare    : 300,
        QzaShareAddShareV2  : 301,
    
        //-------------------------------------------------------------------//
        //微云助手--微信平台上的微云公共帐号
        //CollectionTextMsg  : 400,  //微信推送过来的文本消息
        //CollectionUrlMsg   : 401,  //微信推送过来的链接信息
        //CollectionVoiceMsg : 402,
        //CollectionImageMsg : 403,
        //CollectionVideoMsg : 404,
        //CollectionPullTextMsg  : 405,
        //CollectionPullUrlMsg   : 406,
        //CollectionPullVoiceMsg : 407,
        //CollectionDelTextMsg   : 408,
        //CollectionDelUrlMsg    : 409,
        //CollectionDelVoiceMsg  : 410,
    
        //-------------------------------------------------------------------//
        //文件代理模块中接入层与Cache层之间的协议
        FileTransPieceMsg   : 500,  //转存分片
        FileQueryOffsetMsg  : 501,  //查询已经上传的偏移量
    
        //文件增量上传
        FileDiffUploadMsg               :   580,
        FileDiffUploadConfParamMsg      : 581,
    
        //-------------------------------------------------------------------//
        //外链分享
        WyShareAdd          : 600,      // 生成微云分享
        WyShareGetDownInfo  : 601,      // 获取下载信息
    
        //-------------------------------------------------------------------//
        //联合活动文件上传和复制server
        UnionActivityFileUpload         : 620,      //联合活动文件上传
        UnionActivityFileCopy           : 621,      //联合活动文件复制
    
        //这个是之前的老协议，必须占用一下700~709的命令码
        WyUserLogin	:700,
        WyUserUploadFile	:701,
        //-------------------------------------------------------------------//
        //测试命令预留1000以下，这个范围内ajian不要再分配出去
        TestMsg             : 710,
    
    
        //各个模块需要分配的命令号：从1000开始分:每个模块预留1000个命令
        //-------------------------------------------------------------------//
        //对客户端的tcp文件上传相关协议
        ClientFileTransQueryMsg     : 1001, //该控制头来查询文件是否需要上传以及从什么位置开始上传：tcp文件上传代理非分片使用
        ClientFileTransPieceMsg     : 1011, //tcp分片上传数据
    
        //-------------------------------------------------------------------//
        //虚拟目录用到的命令：范围2001~2100
        VirtualDirConfigSet    			: 2001,         //保存用户的配置到云端
        VirtualDirConfigGet     		: 2002,         //从云端获取用户的配置
        VirtualDirConfigDelete  		: 2003,         //删除用户的配置
        VirtualDirDirList       		: 2004,         //返回用户已开通的所有的应用列表
        VirtualDirFileUpload    		: 2005,         //上传文件
        VirtualDirFileDownload  		: 2006,         //文件下载
        //VirtualDirBatchFileDelete   	: 2007,     //批量删除文件
        VirtualDirBatchItemDelete       : 2007,     //批量删除文件
        VirtualDirBatchFileMove 		: 2008,         //批量移动文件
        VirtualDirBatchFileCopy 		: 2009,         //批量复制文件
        VirtualDirBatchFileDownload 	: 2010,     //批量文件下载
        VirtualDirUserQuery     		: 2011,         //用户信息查询
        VirtualDirFileCopyFromOtherBid			: 2012,	//其他业务转存到微云
        VirtualDirFileCopyFromOtherBidBackend	: 2013,	//其他业务转存到微云(给后台使用)
        VirtualDirBatchItemDeleteBackend		: 2014,	//批量删除文件(给后台使用)

    
        //-------------------------------------------------------------------//
        //虚拟目录第三方接入server用到的命令：范围2101~2200
        AccessVirtualDirDirList         : 2101,     //返回用户已开通的所有的应用列表
        AccessVirtualDirFileUpload      : 2102,     //通用目录第三方上传文件
        AccessVirtualDirFileDownload    : 2103,     //虚拟目录的文件下载
        AccessVirtualDirBatchFileDelete : 2104,     //批量删除文件
        AccessVirtualDirFileBatchDownload   : 2105,     //文件批量下载
    
        //-------------------------------------------------------------------//
        //网盘用到的命令：范围2201~3000
    
        //查询模块
        DiskUserInfoGet                 : 2201,     //拉取信息(系统&用户信息&创建用户)
        DiskUserInfoModify              : 2202,     //修改用户信息
        DiskUserTimeStampGet            : 2204,     //拉取时间戳
        //DiskFileQuery                 : 2205,     //    文件查询
        DiskFileBatchQuery              : 2206,     //批量文件查询
        DiskFileHistoryQuery            : 2207,     //文件历史版本信息查询
    
        //DiskDirList                     : 2208,     //    目录列表查询
        DiskDirBatchList                : 2209,     //批量目录列表查询
        DiskDirQuery                    : 2210,     //目录查询
        DiskDirRecurTimeStamp           : 2211,     //递归查询目录时间戳
        DiskDirBatchQuery               : 2212,     //批量目录查询, 企业网盘使用
        DiskSystemKeyQuery              : 2213,     // 查询系统目录的key，企业网盘使用
    
    
        //上传模块
        DiskFileUpload                  : 2301,     //文件上传请求
        DiskFileContinueUpload          : 2302,     //文件续传请求
        DiskFileOverWriteUpload         : 2303,     //文件覆盖
        //DiskFileLenUpdate             : 2304,     //更新已上传文件大小,已无用
        DiskFileBatchUpload             : 2305,     //文件批量上传
        DiskFileDataUpload              : 2311,     //数据上传伪命令，占位用
    
        //下载模块
        //DiskFileDownload                  : 2401,     //    文件下载(缩略图短链)
        DiskFileBatchDownload               : 2402,     //批量文件下载(缩略图短链)
        DiskFilePackageDownload             : 2403,     //打包下载
        DiskFileWeiyunSharePackageDownload  : 2404,     //外链打包下载
        DiskFileDataDownload                : 2411,     //用户文件数据下载伪命令，占位用
        DiskPicThumbDownload                : 2412,     //图片缩略图下载伪命令，占位用
        DiskVideoThumbDownload              : 2413,     //视频缩略图下载伪命令，占位用
    
        //删除模块
        //DiskFileDelete                : 2501,     //    文件删除
        //DiskFileBatchDelete           : 2502,     //批量文件删除
        //DiskDirDelete                 : 2503,     //    目录删除
        //DiskDirBatchDelete            : 2504,     //批量目录删除
        // DiskDirFileBatchDelete       : 2505,     //批量目录文件删除(同一个目录下) 废弃
        DiskUserClear                   : 2506,     //关闭网盘功能
        DiskItemBatchDelete             : 2507,     //批量目录文件删除(不同目录下):安卓用的是这个命令
        DiskTempFileBatchDelete			: 2508,		//批量temp文件删除并且还原到上一个版本(不同目录下)
        DiskDirFileBatchDeleteEx        : 2509,     //批量目录文件删除
    
        //修改模块
        //DiskFileMove                  : 2601,     //    文件移动
        //DiskFileBatchMove             : 2602,     //批量文件移动
        DiskFileCopy                    : 2603,     //    文件复制
        DiskFileBatchCopy               : 2604,     //批量文件复制
        //DiskFileAttrModify            : 2605,     //  文件属性修改
        DiskFileBatchAttrModify         : 2606,     //批量文件属性修改
        DiskFileRestoreVer              : 2607,     //文件历史版本恢复
        DiskFileDeleteVer               : 2608,     //文件历史版本删除
    
        DiskFileCopyFromOtherBid        : 2609,     //  从其他业务复制
        DiskFileBatchCopyFromOtherBid   : 2610,     //批量从其他业务复制
        DiskFileCopyToOtherBid          : 2611,     //    复制到其他业务
        DiskFileBatchCopyToOtherBid     : 2612,     //批量复制到其他业务
        DiskFileBatchCopyToOffline      : 2613,     //批量复制到离线
    
        DiskDirCreate                   : 2614,     //目录创建
        DiskDirAttrModify               : 2615,     //目录属性修改
        //DiskDirMove                   : 2616,     //    目录移动
        //DiskDirBatchMove              : 2617,     //批量目录移动
        DiskDirFileBatchMove            : 2618,     //批量目录文件移动:客户端目前使用
        DiskDirCreateByParents			: 2619,		//创建多层目录
        DiskDirAttrBatchModify          : 2620,     //目录属性批量修改
    
        //回收站操作
        //DiskRecycleUserQuery          : 2701,     //回收站用户查询
        DiskRecycleList                 : 2702,     //回收站列表查询
        DiskRecycleClear                : 2703,     //清空回收站
        //DiskRecycleDirRestore         : 2704,     //    恢复目录（内部）
        //DiskRecycleDirBatchRestore    : 2705,     //批量恢复目录
        //DiskRecycleFileRestore        : 2706,     //    恢复文件（内部）
        //DiskRecycleFileBatcheRestore  : 2707,     //批量恢复文件
        DiskRecycleDirFileBatchRestore  : 2708,     //批量恢复目录文件
    
        //照片库视图特殊逻辑模块
        DiskPicUpload           : 2801, //在库视图分类中上传一个照片：该命令暂时没有应用的场景
        DiskPicGroupDelete      : 2802, //库视图中删除一个分组(同时删除分组下的照片)
        DiskPicBackup           : 2803, //备份相册中图片
    
        //-------------------------------------------------------------------//
        //手机后台逻辑层用到的命令：范围3001~4000
        TestCellPhoneMsg        : 3001, //这个命令号用于手机端1.6版本过渡时期，PbHead+JsonBody
        CellPhoneGetConfig      : 3011, //拉配置
    
        //-------------------------------------------------------------------//
        //微云收藏模块中抽取链接中的图片, 然后保存到存储图片系统中
        ExtractPicAndSave       : 4001,
    
        //-------------------------------------------------------------------//
        //通用目录第三方server命令：范围5001-6000
        ThirdGetListByAPP       : 5001,         //
        ThirdFilePut            : 5002,         //
    
        //-------------------------------------------------------------------//
        //微云文件库2.0, 范围6001-7000
        /////////////////以下关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////
        LibUserCreate           : 6001,     //创建用户
        LibDirCreate            : 6002,     //目录创建
        LibFileUpload           : 6003,     //文件上传
        LibFileDel              : 6004,     //文件删除,网盘未旁路（网盘旁路批量命令）
        LibFileMove             : 6005,     //文件移动,网盘未旁路（网盘旁路批量命令）
        LibFileNameMod          : 6006,     //文件改名,网盘未旁路（网盘旁路批量命令）
        LibFileOverwrite        : 6007,     //文件覆盖上传
        LibDirDel               : 6008,     //目录删除,网盘未旁路（网盘旁路批量命令）
        LibDirMove              : 6009,     //目录移动,网盘未旁路（网盘旁路批量命令）
        LibDirNameMod           : 6010,     //目录改名
        LibDirUndel             : 6011,     //目录恢复,网盘未旁路（网盘旁路批量命令）
        LibFileFinishedPush     : 6012,     //文件完成上传通知
        LibFileUndel            : 6013,     //文件恢复,网盘未旁路（网盘旁路批量命令）
        LibUserClear            : 6014,     //关闭用户
        LibFileNameBatchMod     : 6015, 	//文件批量改名
        LibFileBatchMove        : 6016,     //文件批量移动,网盘未旁路（网盘旁路批量命令）
        LibDirBatchCreate		: 6017,		//目录批量创建
    
        LibDirNameBatchMod      : 6020,     //目录批量改名
    
        LibFileBatchDel         : 6021,     //文件批量删除,网盘未旁路（网盘旁路批量命令）
        LibDirFileBatchMove     : 6022,     //目录文件批量移动
        LibFileBatchUndel       : 6023,     //文件批量恢复,网盘未旁路（网盘旁路批量命令）
        LibDirBatchDel          : 6024,     //目录批量删除,网盘未旁路（网盘旁路批量命令）
        LibDirBatchMove         : 6025,     //目录批量移动,网盘未旁路（网盘旁路批量命令）
        LibDirBatchUndel        : 6026,     //目录批量恢复,网盘未旁路（网盘旁路批量命令）
        LibFileCopy             : 6027,     //文件复制
        LibFileBatchCopy        : 6028,     //文件批量复制,网盘未旁路（利用单条命令实现）
        LibDirFileBatchRestore  : 6029,     //目录文件批量恢复
        LibDirFileBatchDel      : 6030,     //目录文件批量删除
    
        LibFileContinueUpload   : 6031,     //文件续传请求
        LibFileDownload         : 6032,     //文件下载(缩略图短链)
        LibFileBatchDownload    : 6033,     //批量文件下载
        LibFilePackageDownload  : 6034,     //打包下载
        LibFileWeiyunSharePackageDownload : 6035,     //外链打包下载
        LibFileCopyFromOtherBid         : 6036,     //文件从其他业务复制
        LibFileBatchCopyFromOtherBid    : 6037,     //文件批量其他业务复制,网盘未旁路（未实现）
        LibFileCopyToOtherBid           : 6038,     //文件从复制到其他业务,网盘未旁路（未实现）
        LibFileBatchCopyToOtherBid      : 6039,     //文件批量复制到其他业务
        LibTempFileBatchDel				: 6040,     //批量删除幽灵文件恢复到上个版本
    
        LibCombineBatchFileUpload           : 6041,     //文件批量上传(库内部使用)
        LibCombineBatchFileDel              : 6042,     //文件批量删除(库内部使用)
    
    
        LibPwdQuery             : 6051,     //查询独立密码
        LibPwdAdd               : 6052,     //添加独立密码
        LibPwdDelete            : 6053,     //删除独立密码
        LibPwdModify            : 6054,     //修改独立密码
        LibPwdVerify            : 6055,     //校验独立密码 
    
        //server内部使用
        LibBatchGetPicExif      : 6061,      //批量获取图片exif信息
        LibMovePicToGroup       : 6062,      //添加相片进分组
        LibFileAddStar          : 6063,      //文件加星
        LibFileRemoveStar       : 6064,      //取消加星
        LibTransPicGroup        : 6065,      // 遷移相冊分組
        LibNotifyExifInfo       : 6066,     //bice提取万照片的exif信息，旁路给lyn
        LibRebuildLib           : 6071,      // 迁移网盘
    
    
    
        /////////////////以上关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////
    
        //以下库命令终端使用
        LibListNumGet           : 6101,     //获取各种类型的数量
        LibAllListGet           : 6102,     //拉取库全量列表
        LibDiskAllListGet       : 6103,     //拉取网盘结构的全量列表
        LibLibSearch            : 6104,     //搜索
        LibPdirKeyGet           : 6105,     //获取父目录key
        LibDiffListGet          : 6106,     //拉取库增量列表
        LibDiskDiffListGet      : 6107,     //拉取网盘结构的增量列表
        LibDiskDiffDirGet       : 6108,     //拉取一个用户变化的目录
        LibGetDiffStarFile      : 6109,     //增量拉取用户加星列表:废弃，用6106代替,libid为101
        LibPicDiffListGet       : 6110,     //拉库照片分组增量列表:废弃，用6106代替,拉取下来之后自己过滤,或者拉指定groupid
        LibPageListGet          : 6111,     //按照指令排序方式分页拉取：拍摄时间/字母序/修改时间/上传时间等
        LibGetPicGroup          : 6121,     //获取相册分类中的分组数
        LibCreatePicGroup       : 6122,     //增加相册分组
        LibModPicGroup          : 6123,     //修改相册分组
        LibDeletePicGroup       : 6124,     //删除相册分组(该命令只删除分组，不删除分组下的照片。如果需要删除分组下的照片，用2802命令)
    
        LibGetOneGroupInfo      : 6125,     //获取某一个照片分组下的相关信息：照片数量
        LibGetDelList           : 6126,     //获取所有刪除列表---bice調用
        LibSetGroupCover		: 6127,		//设置组的封面
        LibSetGroupOrder		: 6128,		//设置组的顺序
        LibGetAllFolderInfo     : 6129,      // 获取用户所有目录,给youngky使用
        LibDirList				: 6130,		//拉目录列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleList			: 6131,		//回收站拉列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleClear			: 6132,		//清空回收站，用于oz统计:旁路系统使用，终端无需关注
        LibQueryBackupPhoto     : 6133,     //查询某个照片是否备份过：给bice的照片备份server使用:旁路系统使用，终端无需关注
        LibPicBatchQuery        : 6140,     //批量查询一批照片是否已经备份过
    
        //需要转发请求给库Dispatch
        LibBatchMovePicToGroup  : 6201,     //添加相片进分组
        LibBatchFileAddStar     : 6202,     //批量文件加星
        LibBatchFileRemoveStar  : 6203,     //批量取消加星
    
        //-------------------------------------------------------------------//
        // 幽灵文件svr: 范围7001-8000
        UnfinFileGetList        : 7001,        // 获取未完成文件列表
        UnfinFileAddFile        : 7002,        // 添加文件，对应文件上传:marsin旁路给1.0的
        UnfinFileFileFinish     : 7003,     // 文件完成:存储的通知
        UnfinFileOverwrite      : 7004,      // 覆盖上传:marsin旁路给1.0的
    
        //-------------------------------------------------------------------//
        //网盘用户cache server: 范围8001-9000
        QdiskUserCacheAdd       :   8001,       //创建用户cache
        QdiskUserCacheGet       :   8002,       //获取用户cache
        QdiskUserCacheDelete    :   8003,       //删除用户cache
        QdiskUserSpaceAdd       :   8004,       //增加用户空间
        QdiskUserQQDiskDirKeyMapGet : 8005, 	//获取QQ网盘迁移到微云的根目录映射
        QdiskUserSpaceSet		: 	8006,		//设置用户空间
    
        //Push2.0：范围9001-10000
        PushUserLogin           :   9001,       //用户登录
        PushUserLogout          :   9002,       //用户退出
        PushHeartBeat           :   9003,       //用户心跳
        PushRecvMsg             :   9004,       //服务器推送消息
    
        PushInterUserLogin      :   9101,       //内部接入和cache之间通信
        PushInterUserLogout     :   9102,
        PushInterHeartBeat      :   9103,
        PushInterRecvMsg        :   9104,
        PushInterStatusInfo     :   9105,       //UserServer把状态信息（如用户数等）通知给与其连接的WyinServer
    
        PushInterSendMsg        :   9201,       //供其它需要推送消息给用户的server使用，推送消息给PushNotify服务
    
        //oidb_proxy模块：范围10001--11000  提供访问oidb的pb协议
        OidbGetUserCustomHead           : 10001,    //获取用户自己的自定义头像
        OidbGetFriendsListAndGroupInfo  : 10002,    //请求拉取好友列表与分组信息
        OidbGetFriendsInfoAndRecordName : 10003,    //请求批量拉取好友简单资料以及备注名
        OidbGetFriendsOnlineStatus      : 10004,    //请求获取好友在线状态
        OidbPushOutlinkTips             : 10005,    //发送外链tips
        OidbPushQQNetDiskTransTips      : 10006,    //QQ网盘迁移tips
        OidbGetQuickLaunchApps          : 10007,    //读取快速启动栏应用列表
        OidbGetUserInfo                 : 10008,    //获取用户资料:昵称,头像
    
        //pwd模块：范围11001--12000 
        PwdQuery                : 11001,    //查询独立密码
        PwdAdd                  : 11002,    //添加独立密码
        PwdDelete               : 11003,    //删除独立密码
        PwdModify               : 11004,    //修改独立密码
        PwdVerify               : 11005,    //校验独立密码
    
        //外链模块：范围12001--13000
        WeiyunShareAdd          : 12001,    //生成外链
        WeiyunShareView         : 12002,    //打开外链
        WeiyunShareDownload     : 12003,    //下载分享资源
        WeiyunShareTransStore   : 12004,    //转存分享资源：该命令暂时没有使用，可以对外链里面的文件目录选择部分带给后台
        WeiyunShareSaveData     : 12005,    //保存外链所有数据：把一个外链保存到自己的微云里面
        WeiyunShareSetMark		: 12006,	//给外链打标记：可以给外链打失效标记等信息，有些举报的外链可以这样操作
        WeiyunShareDelete		: 12007,
        WeiyunShareList         : 12008,
        WeiyunShareClear        : 12009,

        WeiyunSharePwdView      : 12010,
        WeiyunSharePwdVerify    : 12011,
        WeiyunSharePwdCreate    : 12012,
        WeiyunSharePwdModify    : 12013,
        WeiyunSharePwdDelete    : 12014,
    
        //剪贴板模块：范围13001--14000
        ClipBoardUpload         : 13001,    //上传一条剪贴板消息到云端
        ClipBoardDownload       : 13002,    //从云端下载剪贴板消息
        ClipBoardDelete         : 13003,    //从云端删除一条剪贴板消息
    
        //微云收藏类碎片信息：范围14001--15000
        NoteAdd                 : 14001,    //添加
        NoteDelete              : 14002,    //删除
        NoteModify              : 14003,    //修改
        NoteList                : 14004,    //获取列表
        NoteDetail              : 14005,    //获取某个具体的Item详细信息
        NoteDump                : 14006,    //笔记外链转存：后台使用，终端不关注
        NotePreUpload           : 14007,    //图片申请上传
        NoteGetSummary          : 14008,    //获取摘要信息，终端不需关注
        NoteStar                : 14009,    //加星、取消加星
        DumpColToNote           : 14010,
    
        //OZ上报代理(logger_svr_v2): 范围15001--16000 ajianzheng
        //L5:114177:131072
        //15001
        OzProxyTable25          : 15002,    //上报老的后台上报--流水信息统计/已废弃
        OzProxyTable71          : 15003,    //上报老的前台上报--运营报表/已废弃
        OzProxyTable171         : 15004,    //clog客户端日志上报表
        OzProxyTable26          : 15005,    //Oz统计客户端上报/已废弃
        OzProxyTable27          : 15006,    //Oz统计后台上报/已废弃
    
        //
        OzProxyClog             : 15010,    //clog日志上报/完全等同15004
        OzProxyBackend          : 15011,    //微云后台上报      ————上报到dc00056表
        OzProxyClient           : 15012,    //微云客户端上报    ————上报到dc00039/dc00040/dc00041表
    
        OzProxyTable39          : 15020,    //微云客户端上报(dc00039)  ————微云登录接口表
        OzProxyTable40          : 15021,    //微云客户端上报(dc00040)  ————微云客户端点击流和状态设置表
        OzProxyTable41          : 15022,    //微云客户端上报(dc00041)  ————微云客户端通用行为信息、启动时长信息、安装卸载信息表
    
        // qq离线文件模块 ：  范围  16001--16100
        ReqRecvList             : 16001,        //>>请求接收文件列表
        ReqSendList             : 16002,        //>>请求发送文件列表
        ReqDeleteFile           : 16003,      //>>删除文件
        ReqDownloadFile         : 16004,        //>>下载文件
        ReqDownloadFileAbs      : 16005,       // 预览
        ReqFileQuery            : 16006,       //>> 查询 
    
        //活动server: 范围 17001 -- 17999
        //17000
        WeiyunActGetActivity    : 17001,	// 拉取活动(活动&小黄条)
        WeiyunActUserLogin      : 17002,	// 用户登录:后台使用的命令
        WeiyunActFeedBack	    : 17003,	//用户反馈
        WeiyunAdd10T      : 17006,
        WeiyunCheck10T    : 17007,
        // 目录拷贝：   范围 18001--19000
        DirSetCopy              : 18001,    // 目录拷贝命令
    
        // 系统reserved：   范围 19001--19999
    
        // 我的收藏：   范围 20000--20999
        GetCollectionList       : 20000,    // 拉取收藏列表
        GetCollectionContent    : 20001,    // 拉取收藏详情
        DelCollection           : 20002,    // 删除收藏
        AddTextCollection       : 20003,    // 添加文本收藏
        AddLinkCollection       : 20004,    // 添加链接收藏
        AddGalleryCollection    : 20005,    // 添加图片收藏
        AddAudioCollection      : 20006,    // 添加语音片段收藏
        AddFileCollection       : 20007,    // 添加文件收藏
        AddLocationCollection   : 20008,    // 添加地理位置收藏
        AddRichMediaCollection  : 20009,    // 添加混排收藏
        FastUploadResource      : 20010,    // 秒传图片和文件资源
        GetCollectionCountByCatetory: 20011,    // 获取指定类型收藏的总数
        ModCollection           : 20012,    // 修改收藏
        GetCollectionFullInfo   : 20013,    // 获取收藏完整数据Collection+CollectionContent
        ApplyDownloadFile       : 20014,    // 申请文件下载信息
        GetCollectionSummary    : 20015,    // 获取收藏摘要信息
        GetCompatibleCollectionInfo : 20016, // 获取收藏信息多终端兼容格式版本,以html5排版布局
        // 微云文章使用
        GetArticleList : 20056, //拉取文章列表
        StarCollection : 20057, //加星
        UnstarCollection : 20058, //取消加星
    
        //小文件打包上传 zhiwenli
        MiniBatchPreUpload        : 20301,   //批量预上传
        MiniBatchDataUpload       : 20302,   //小文件批量上传数据
    
        // 图片平台代理: 201000--201999 
        QpicFastUpload          : 201000, //秒传(包括转存)
        QpicUploadData          : 201001, //上传图片数据
        QpicDeletePic           : 201002,  //删除图片
    
        // qzone代理 202000--202999
        QzoneProxyGetLocation   : 202001,   // 获取地理信息
    
        //自动升级模块 203000--203999
        AutoUpdateGetNewVersion : 203001,
    
        //微博代理模块 204001--204999 
        WeiboProxyShare         : 204001,   //分享到微博
    
        //下载外链限制cookie生成模块	205001--205999
        GetDlskey				: 205001,	//获取cookie字段
        ParseDlskey				: 205002,	//解析cookie字段
    
        //tp_mini    206001~206999
        FailFileAttr       		: 206001,  	//上报上传失败文件
        FailFileList       		: 206002,  	//拉取失败文件列表
        WeiyunServerList   		: 206003,  	//获取微云拦截ip列表
        TpminiQueryFileStatus 	: 206004,	//查询文件是否在失败列表中
    
    
        ///name:spp_cloud_config,port:9653,desc:配置模块
        ///207000~207999
        DiskConfigGet       : 207000,   ///获取网盘相关配置:计划把微云网盘等相关配置放在这里
        CloudConfigGet		: 207001,	///读用户配置
        CloudConfigSet		: 207002,	///写用户配置
    
        //tp_mifi 208001~208999
        MiFiQueryUserBind    : 208001, // 查询用户绑定信息
        MiFiUserBind         : 208002, // 用户绑定
        MiFiUserLogOut       : 208003, // 用户注销 
        MiFiFileUploadSwitch : 208004, // 文件上传开关请求 
        MiFiQueryNetTypeSupport : 208005, // MiFi支持的网络类型查询
        MiFiSwitchNet           : 208006, // MiFi的网络开关操作
        MiFiJoinInWiFi          : 208007, // MiFi加入某一个WiFi网络
        MiFiForgetWiFi          : 208008, // MiFi忘记已经加入的某个MiFi网络
    
        //name spp_security_svr 
        SecurityCheck					: 209001,	//接入串联，判断是否黑名单等
        SecurityCaptchaCheck			: 209002,	//验证码验证
        SecurityUinBlackListAdd			: 209003,	//添加uin黑名单
        SecurityUinBlackListDelete		: 209004,	//删除uin黑名单
        SecurityUinBlackListGet			: 209005,	//查询uin黑名单
        SecurityFileBlackListAdd		: 209006,	//添加全局file黑名单
        SecurityFileBlackListDelete		: 209007,	//删除全局file黑名单
        SecurityFileBlackListGet		: 209008,	//查询全局file黑名单
        SecurityUinFileBlackListOwnerDownloadAdd	: 209009,	//添加uin的file自己下载黑名单
        SecurityUinFileBlackListOwnerDownloadDelete	: 209010,	//删除uin的file自己下载黑名单
        SecurityUinFileBlackListOtherDownloadAdd	: 209011,	//添加uin的file其他人下载黑名单
        SecurityUinFileBlackListOtherDownloadDelete	: 209012,	//删除uin的file其他人下载黑名单
        SecurityUinFileBlackListOuterLinkerAdd		: 209013,	//添加uin的file外链黑名单
        SecurityUinFileBlackListOuterLinkerDelete	: 209014,	//删除uin的file外链黑名单
        SecurityUinFileBlackListAdd					: 209015,	//删除uin的file黑名单
        SecurityUinFileBlackListDelete				: 209016,	//删除uin的file黑名单
        SecurityUinFileBlackListGet					: 209017,	//查询uin的file黑名单
        SecurityUinFileBlackListClear				: 209018,	//清除uin的file黑名单
        SecurityFileDelete							: 209019,	//删除文件（彻底删除）
        SecurityShareKeyDelete						: 209020,	//删除sharekey（彻底删除）
        SecurityFileQuery							: 209021,	//查询文件信息
        SecurityShareKeyQuery						: 209022,	//查询外链信息
    
        // MailToNote 210001 - 210999
        MailWhiteList : 210001, // 邮件列表操作，添加、删除、查询
        MailPostfixChecks : 210002, // 后台使用，终端不用关注. postfix 邮件头部、实体TCP表查询
    
        //html parser 211000-211999
        HtmlParserCollectionToHtml : 211000, //收藏转成兼容格式html
        HtmlParserHtmlToRichMedia : 211001, //html转成收藏的RichMedia格式
    
        //外链安全
        ShareLinkCheck          : 213000,
    
        //qqaccess 协议透传   214000-214999
        QqAccessTransfer           : 214000,
    
        //企业网盘扩展协议    215000-215999
        CopyFromOffline      : 215000,    // 离线文件转存到企业网盘
        CopyToOffline        : 215001,   	// 企业网盘转存到离线文件
    
        AsycBatchCopy     : 215002,    // 
        AsycBatchMove     : 215003,   	// 
    
        //guarder门卫模块: 频率限制,黑名单管理等
        //216000 ~ 216999
        GuarderCheckIn          : 216000, //来访登记
    
        //docview_dispatcher模块: wopi文档预览分发模块
        //217000 ~ 217999
        DocviewDispatcherGetUrl : 217000, //获取预览url
    
        //wopi_server: wopi服务器模块
        WopiServerCheckFileInfo : 218000, //获取文件信息
        WopiServerGetFile : 218001, //获取文件内容

        //qmail proxy223001~223999
        QmailGetAddrList			: 223001,	//拉取邮件地址列表
        QmailSendMail   			: 223002, //发送邮件

        //small iterface set 224001~224999
        GetTreeView           : 224001,//双屏列表
        GetHomeList           : 224002,//根据第三方appid 获取该第三方主目录列表
        GetHomeDirInfo        : 224003,//批量获取第三方home目录信息
    
        //微信支付模块使用:220001~221000
        WxCreatePayId           : 220001,   //生成付费订单
        WxQueryPayId            : 220002,   //查询订单
        WxQueryAllPay           : 220003,   //查询所有支付订单
        WxDeliver               : 220004,   //发货
    
        WxQueryProductInfo      : 220501   //查询商品信息
    };

    return {
        get: function(cmd) {
            return cmds[cmd] || cmd;
        }
    };
});/**
 * 获取用户信息
 * @author jameszuo
 * @date 13-1-15
 */

define.pack("./query_user",["lib","common","$"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        cur_url = lib.get('./url_parser').get_cur_url(),

        constants = common.get('./constants'),
        request = common.get('./request'),

        local_uin,  //第一次进入的uin, 用来比较登录态是否过期.

        cached_user,
        loading_request,

        switching_user, //是否是切换用户登陆

        ok_stack = [],
        fail_stack = [],

        Math = window.Math,

        undefined;


    var query_user = {

        /**
         * 查询登录用户的信息
         * @param {Boolean} force 是否从服务器获取，默认 false
         * @param {Boolean} cavil 挑剔（会话超时时弹出登录框、独立密码失效时弹出独立密码框）
         * @param {boolean} reset_tip_status 是否重置各种‘首次访问’状态，默认false（如是否是QQ网盘迁移用户首次访问微云等）
         * @param {Function} silent_callback 回调方法，传入该参数后将不会触发 load/error 事件
         */
        get: function (force, cavil, reset_tip_status, silent_callback) {
            var me = this,
                silent = $.isFunction(silent_callback);

            reset_tip_status = reset_tip_status === true;

            // 如果不强制刷新, 那么当已有user信息时不重复获取
            if (!force && cached_user) {
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
                    body: reset_tip_status ? {
                        show_migrate_fav: 1,
                        show_qqdisk_firstaccess_flag: 1
                    } : undefined
                })
                    .ok(function (msg, body, header) {

                        cached_user = new User(header.uin, body);

                        if (!local_uin) {
                            local_uin = cached_user.get_uin();
                        }

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

    query_user.get_local_uin = function () {
        return local_uin;
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
        /**
         * 下载时需要带上这个码 - james
         * @returns {String}
         */
        get_checksum: function () {
            return this._d['checksum'];
        },

        _get_int: function (key, defaults) {
            return parseInt(this._d[key]) || defaults || 0;
        }

    };

    return query_user;
});
/**
 * 异步请求
 * @author jameszuo
 * @date 13-3-8
 */
define.pack("./request",["lib","$","./constants","./ret_msgs","./urls","./global.global_event","./cgi_ret_report","./m_speed","./tmpl","./configs.ops","./pb_cmds","./user_log","./query_user"],function (require, exports, module) {
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
        pb_cmds = require('./pb_cmds'),
        user_log,

        root = window,

    // ---------------------------------------------------------

    // 请求可能出现的错误类型
        error_status = {
            error: '网络错误, 请稍后再试',
            timeout: '连接服务器超时, 请稍后再试',
            parsererror: '服务器出现错误, 请稍后再试'
        },

    // 请求出现错误时, 返回的错误码
        unknown_code = ret_msgs.UNKNOWN_CODE,
        unknown_msg = ret_msgs.UNKNOWN_MSG,

    // ---------------------------------------------------------

        main_v = constants.IS_APPBOX ? 12 : 11,

        os_type = constants.APPID,

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

        default_headers_v2 = { cmd: '', appid: constants.APPID, version: 2,major_version: 2},

        default_options = {
            url: '',
            cmd: '',
            cgi_v2: false, // 使用 cgi 2.0（header简化）
            pb_v2: false, //使用pb2.0协议 （先默认为false，等全部升级完再去掉）
            just_plain_url: false, // 是否只采用URL而不包含data参数（req_header, req_body）
            body: null,
            header: null,
            cavil: false,
            resend: false,
            re_try: 2,   //重试参数, @svenzeng
            re_try_flag: false,     //是否经过了重试
            safe_req: false // 启用安全模式（即不在setTimeout里执行回调，仅 xhr_get|xhr_post 支持）
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
                throw 'request 无效的请求参数';
            }

            return new RequestClass(options);
        }
    };

    var AbstractRequest = function (options) {
        options.url = options.url;
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
                msg: '连接服务器超时，请稍后再试'
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
                body = $.isFunction(o.body) ? o.body() : (o.body || {}),
                req_body = {},
                data;

            if(o.pb_v2) {
                header = $.extend({}, default_headers_v2, header, { cmd: pb_cmds.get(o.cmd) });
                req_body['weiyun.'+o.cmd+'MsgReq_body'] = body;
                body = {
                    ReqMsg_body: req_body
                };
            } else if (o.cgi_v2) {
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
                cmd: pb_cmds.get(cmd),   // 默认会有一个cmd参数，可被自定义URL中的参数覆盖。如 http://qq.com/?a=1&cmd=XXX 会保持不变，而 http://qq.com/?a=1 会变为 http://qq.com/?a=1&cmd=SOMETHING
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
                ret = (typeof header.ret === 'number' ? header.ret : (typeof header.retcode === 'number' ? (header.retcode === 0 && data.retcode ? data.retcode : header.retcode) : data.ret)) || 0, // 优先使用 data.rsp_header.ret，然后使用 data.ret
                msg = header.msg || header.retmsg || ret_msgs.get(ret),
                cavil = me._options.cavil,
                resend = me._options.resend;

            if(me._options.pb_v2) {
                body = body && body.RspMsg_body && body.RspMsg_body['weiyun.'+me._options.cmd+'MsgRsp_body'] || {};
            }
            if (ret === 0) {

                // ok
                $.each(me._options.ok_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        me._log_rey_succ();
                        fn.call(me, msg, body, header, data);
                    }
                });

            } else {

                var is_sess_timeout = ret_msgs.is_sess_timeout(ret);
                    //is_indep_invalid = ret_msgs.is_indep_invalid(ret);

                // 如果是「挑剔」模式，就会弹出登录框，所以就不再输出错误消息
                if (cavil && is_sess_timeout) {
                    msg = '';
                }

                $.each(me._options.fail_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, ret, body, header, data);
                    }
                });

                // 未登录
                if (cavil && is_sess_timeout && url.indexOf('clip_board.fcg') < 0 ) {
                    session_event.trigger('session_timeout', resend ? function () {
                        me._options.resend = false;
                        me._send();
                    } : null);
                }
                // 独立密码无效
               /* else {
                    if (cavil && is_indep_invalid) {
                        session_event.trigger('invalid_indep_pwd', resend ? function () {
                            me._options.resend = false;
                            me._send();
                        } : null, body);
                    }
                }*/
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
            if (this._is_need_retry()) {  //fail
                return this._retry();
            }
            var error_data = this.is_abort ? this._def_error_data : this._unknown_error_data;
            this._callback(error_data, true);
            this.destroy(); // 超时后销毁请求，避免出现即提示错误又响应操作的问题
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
        _re_del_post_prefix: /^.*<script>.*\btry\s*\{\s*parent\.\w+\s*\(\s*/,
        _re_del_post_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*<\/script>.*$/g,

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
                    cmd: pb_cmds.get(o.cmd),
                    g_tk: get_g_tk(),
                    data: JSON.stringify(data),
                    callback: 'X_GET',
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'POST') {
                url = urls.make_url(url, {
                    cmd: pb_cmds.get(o.cmd),
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

            this.__start_time = new D().getTime();

            this._send_to_iframe(url, url_obj, data);
        },

        _send_to_iframe: function (url, url_obj, data) {
            var me = this,
                o = me._options;

            this._get_request(url_obj, function (Request) {

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
                        var ret = rsp_data.rsp_header.retcode ? rsp_data.rsp_header.retcode : (rsp_data.hasOwnProperty('ret') ? rsp_data.ret : rsp_data.rsp_header.ret);
                        if (me._is_need_retry() && (!http_ok || ret_msgs.is_need_retry(ret))) {
                            return me._retry();
                        }

                        if (o.safe_req) {
                            me._callback(rsp_data || {}, false);
                        } else {
                            set_timeout(function () { // 脱离response中的try块
                                me._callback(rsp_data || {}, false);
                            }, 0);
                        }
                    }
                });
                me._start_timeout();

                me.__start_time = new D().getTime();
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
                var src = url_obj.protocol + '//' + url_obj.host  + '/cdr_proxy.html';
                $('<iframe data-id="cdr_proxy" src="' + src + '" style="display:none;"></iframe>')
                    .on('load', function () {
                        var iframe = this;
                        setTimeout(function () {
                            var Request;
                            try {
                                Request = CrossDomainRequest._Requests[url_obj.host] = iframe.contentWindow.Request;
                                callback(Request);
                            } catch (e) {
                                console.warn('请求' + src + '未能成功，降级为' + (o.method === 'GET' ? 'JSONP' : 'form data')) + '重新发送';
                                me.destroy();
                                return me._comp_req = (o.method === 'GET' ? request.get(o) : request.post(o));
                            }
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
            var op = ops.get_oz_op(cmd);
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
        var s_key = cookie.get('skey') || '',
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
                    data = me._get_data(frag_files);

                request
                    .post({
                        cmd: cmd,
                        body: data,
                        cavil: true
                    })
                    .ok(function (msg, body) {
                        if (body.results) {
                            me.trigger('step_ok', body.results.length, me._step_index, cmd);

                            var results = body.results;
                            $.each(frag_files, function (i, it) {
                                me._results[it.get_id()] = results ? parseInt(results[i].result) : ret_msgs.UNKNOWN_CODE;
                            });
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
            if (typeof op === 'string') {
                op = ops.get_oz_op_by_name(op);
            } else if (op === 'number') {
                // nothing
            } else {
                op = null;
            }
            if (op) {
                user_log(op, ret);
            }
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
    var _ = require('i18n');
    var
        MAP = {
            0: _('操作成功'),
            404: _('连接服务器超时，请稍后再试'),
            1000: _('出现未知错误'),
            1008: _('无效的请求命令字'),
            1010: false, //'对应目录列表查询请求，代表该目录下的信息未修改，客户端不需要刷新该目录下的本地缓存列表。',
            1012: _('系统正在初始化，请稍后再试'),
            1013: _('存储系统繁忙，请稍后再试'),
            1014: _('服务器繁忙，请稍后再试'),
            1015: _('创建用户失败'),
            1016: _('不存在该用户'),
            1017: _('无效的请求格式'), // 请求包格式解析错误
            1018: false, //'要拉取的目录列表已经是最新的',
            1019: _('目录不存在'),
            1020: _('文件不存在'),
            1021: _('目录已经存在'),
            1022: _('文件已经存在'),
            1023: _('上传地址获取失败'), //'上传文件时，索引创建成功，上传地址获取失败，客户端需要发起续传',
            1024: _('登录状态超时，请重新登录'), // 验证clientkey失败
            1025: _('存储系统繁忙，请稍后再试'),
            1026: _('父目录不存在'),
            1027: _('无效的目录信息'), //不允许在根目录下上传文件
            1028: _('目录或文件数超过总限制'),
            1029: _('单个文件大小超限'),
            1030: _('签名已经超时，请重新验证独立密码'),
            1031: _('验证独立密码失败'),
            1032: _('设置独立密码失败'),
            1033: _('删除独立密码失败'),
            1034: _('失败次数过多，独立密码被锁，请稍后再试'),
            1035: _('独立密码不能与QQ密码相同'),
            1051: _('该目录下已经存在同名文件'),
            1052: _('该文件未完整上传，无法下载'),
            1053: _('剩余空间不足'),
            1070: _('不能分享超过2G的文件'), // 使用批量分享后貌似没有大小限制了，要和@ajianzheng、@bondli 确认下。- james
            1076: _('根据相关法律法规和政策，该文件禁止分享'),

            1083: _('该目录下文件个数已达上限，请清理后再试'),
            1086: _('网盘文件个数已达上限，请清理后再试'),
            1088: _('无效的文件名'),
            1117: _('部分文件或目录不存在，请刷新后再试'),

            3002: _('不能对不完整的文件进行该操作'),
            3008: _('不能对空文件进行该操作'),
            4000: _('登录状态超时，请重新登录'),
            10000: _('登录状态超时，请重新登录'),
            10408: _('该文件已加密，无法下载'),

            100001: _('参数无效'),
            100002: _('无效的请求格式'), //Json格式无效
            100003: _('请求中缺少协议头'),
            100004: _('请求中缺少协议体'),
            100005: _('请求中缺少字段'),
            100006: _('无效的命令'),
            100007: _('导入数据请求无效'),
            100008: _('目录的ID长度无效'), //'目录的key长度无效',
            100009: _('文件的SHA值长度无效'),
            100010: _('文件的MD5值长度无效'),
            100011: _('文件的ID长度无效'),
            100012: _('返回数据过长导致内存不足'),
            100016: _('指针无效'),
            100017: _('时间格式无效'),
            100019: _('输入字段类型无效'),
            100027: _('无效的文件名'),
            100028: _('文件已过期'),
            100029: _('文件超过下载次数限制'),
            100030: _('收听官方微博失败'),
            100031: _('用户未开通微博'),
            100033: _('分享到微博失败'),
            100034: _('内容中出现脏字、敏感信息'),
            100035: _('用户限制禁止访问'),
            100036: _('内容超限'),
            100037: _('帐号异常'),
            100038: _('请休息一下吧'),
            100039: _('请勿重复发表微博'),
            100040: _('身份验证失败'),

            114200: _('文件已被删除'), // 要分享的资源已被删除
            114201: _('文件已损坏'),
            190051: _('登录状态超时，请重新登录'),
            190054: _('访问超过频率限制'),
            190055: _('服务器暂时不可用，请稍后再试')
        },

        UNKNOWN_MSG = _('网络错误，请稍后再试'),

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
 * IE6 居中
 * @author jameszuo
 * @date 13-1-29
 */
define.pack("./ui.center",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
 *
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui.column_model.column",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),

        default_column_options = {
            field:'',
            klass:'',
            title:'',
            val_get:null
        },

        undefined;


    var Column = function (options) {

        this.options = $.extend({}, default_column_options, options);

    };

    return Column;
});/**
 * 文件列表标题
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui.column_model.column_model",["lib","common","$","./ui.column_model.column","./ui.column_model.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Column = require('./ui.column_model.column'),
        ColumnModelUI = require('./ui.column_model.ui'),

        default_column_model_options = {
            el: null,
            cols: [/*Column*/],
            default_field: null,
            default_order: 'desc',
            get_datas: $.noop, // 要排序的数据集
            klass: '',
            visible: true
        },

        undefined;
    // 引入现成的JS版NatSort算法
    // 仿windows的排序方法
    var strCmpLogical = (function(){
        var match = {}, digits = ['+', '-', 0,1,2,3,4,5,6,7,8,9], digitMap = {}, digitRe = /^([+-]|[0-9]+)/;
        $.each(digits, function(index, value){
            digitMap[value] = match;
        });
        return function(str1, str2){
            var i1=0, i2=0, c1, c2, int1, int2, len1, len2;
            if(str1 && str2){
                while(i1<str1.length){
                    c1 = str1.charAt(i1);
                    if(i2>=str2.length){ // 字串长的更大
                        return 1;
                    }
                    c2 = str2.charAt(i2);
                    if(digitMap[c1] === match){
                        if(digitMap[c2] !== match){ // 数字小于字符
                            return -1;
                        }
                        // 取出数字段
                        int1 = str1.substr(i1).match(digitRe)[1];
                        int2 = str2.substr(i2).match(digitRe)[1];
                        // 记录数字段的长度
                        len1 = int1.length;
                        len2 = int2.length;
                        int1 = parseInt(int1, 10);
                        int2 = parseInt(int2, 10);
                        if(c1 === '+'){
                            int1 = -2;
                        }else if(c1 === '-'){
                            int1 = -1;
                        }
                        if(c2 === '+'){
                            int2 = -2;
                        }else if(c2 === '-'){
                            int2 = -1;
                        }
                        
                        if(int1 > int2){
                            return 1;
                        }else if(int1 < int2){
                            return -1;
                        }else{
                            // 当数字转为10进制相等时，判断长度。例如 "000" 就要比 "00" 要前，即要小 （windows规则）
                            if(len1 > len2){
                                return -1;
                            }else if(len1 < len2){
                                return 1;
                            }
                        }
                        // 如果相等，到下一段
                        i1 += len1;
                        i2 += len2;
                    }else if(digitMap[c2] === match){ // 数字小于字符
                        return 1;
                    }else{ // 如果都不是数字，则按字符比较
                        c1 = c1.toLowerCase();
                        c2 = c2.toLowerCase();
                        if(c1 > c2){
                            return 1; 
                        }else if(c1 < c2){
                            return -1;
                        }
                
                        i1++;
                        i2++;
                    }
                }
            }
            return 0;
        };
    })();

    var ColumnModel = function (options) {

        this.options = $.extend({}, default_column_model_options, options);

        var opts = this.options;

        this._cur_field = opts.default_field;
        this._cur_order = opts.default_order;

        // cols : Object -> Column
        $.each(opts.cols, function (i, col) {
            if (!(col instanceof Column)) {
                opts.cols[i] = new Column(col);
            }
        });

//        this.ui = new ColumnModelUI({
//            el: opts.el,
//            cols: opts.cols,
//            default_field: opts.default_field,
//            default_order: opts.default_order,
//            klass: opts.klass,
//            visible: options.visible
//        });

        if (!opts.default_field) {
            console.error('ColumnModel缺少有效的default_field参数');
        }
        if (!opts.default_order) {
            console.error('ColumnModel缺少有效的default_order参数');
        }
        if (!$.isFunction(opts.get_datas)) {
            console.error('ColumnModel缺少有效的get_datas参数');
        }
    };

    ColumnModel.prototype = {
        
        /**
         * @cfg {Function} before_comparator (optional) 前置比较方法，参数为o1、o2。
         * 当返回0时表示相等，ColumnModel会继续执行自己的比较方法；
         * 当返回-1时表示o1在o2之前；
         * 当返回1时表示o2在o1之前；
         * 当返回false时表示相等，并且中止后续ColumnModel的内置比较方法及{@link #after_comparator}后续比较方法
         * 
         * 应用场景：例如sortable为false的file_node优先于普通节点
         */
        /**
         * @cfg {Function} after_comparator (optional) 参数同{@link #before_comparator}。
         * 它后于ColumnModel的内置比较方法，但只会在前面比较都相等又没有中止时才会比较。
         * 返回值可参考{@link #before_comparator}
         */

        render: function () {
            var me = this;

//            me.ui.render();
//
//            me.listenTo(me.ui, 'sort', function (field, order) {
//
//                if (field != me._cur_field || order != me._cur_order) {
//                    me.sort(field, order);
//                }
//
//            });
        },

        /**
         * 排序
         * @param {Array<Array>} datas 要排序的数组的数组
         * @param {String} field
         * @param {String} order 'asc' or 'desc'
         */
        sort_datas: function (datas, field, order) {
            var me = this;

            field = field || me._cur_field;
            order = order || me._cur_order;

            datas = me._sort(datas, field, order);

            // 排序后的数据修复
            if ($.isFunction(me.options.after_sort)) {
                datas = me.options.after_sort(datas, field, order);
            }

            return datas;
        },

        /**
         * 排序
         * @param {String} field 根据这个字段排序
         * @param {String} [order] 方向(asc|desc), 默认为空, 为空表示切换asc/desc
         */
        sort: function (field, order) {
            var me = this;

            // 如果排序字段有变化
            if (field != me._cur_field) {
                // order 为空时用默认排序
                order = order || me.options.default_order;
            }

            // 排序字段无变化
            else {
                // 为空表示切换asc/desc
                if (!order) {
                    order = me._cur_order == 'desc' ? 'asc' : 'desc';
                }
            }

            // 如果和当前排序规则一致, 则不处理
            if (field === me._cur_field && order === me._cur_order) {
                return;
            }

            var datas = me._sort(me.options.get_datas(), field, order);

            me._cur_field = field;
            me._cur_order = order;

            // 排序后的数据修复
            if ($.isFunction(me.options.after_sort)) {
                datas = me.options.after_sort(datas, field, order);
            }

            me.trigger('sorted', datas, field);
        },
        
        _sort: function (datas, field, order) {
            var asc = order === 'asc';

            if (datas && datas.length) {

                var col = collections.first(this.options.cols, function (c) {
                    return c.options.field === field;
                });
                if (!col) {
                    return;
                }

                var val_get = col.options.val_get,
                    great = 1,
                    less = -1,
                    equal = 0,
                    skip = false,
                    ahead = asc ? less : great,
                    behind = asc ? great : less,
                    before_comparator = this.options.before_comparator,
                    after_comparator = this.options.after_comparator,
                    // 这个对比和旧有的功能相比，没有对index作处理，所以如果出现同优先级的情况，反序可能顺序仍不变。
                    // 不过目前只有固定的a-z与从新到旧两种顺序，特别是a-z时不会有同优先级(名称唯一)，所以不会有问题。
                    comparator = function(node1, node2){
                        var result;
                        if(before_comparator){ // 当有前置比较方法时，优先判断，只有相等时才继续下一步。
                            result = before_comparator(node1, node2);
                            if(result === skip){ // 有时前置比较方法得到的结果是相等，同时又不需要进一步比较，可以返回false中止，直接相等
                                return equal;
                            }
                            if(result !== equal){ // 前置不相等，直接返回
                                return result;
                            }
                        }
                        var value1 = val_get.call(col, node1),
                            value2 = val_get.call(col, node2);
                        result = value1 === value2 ? equal : (value1 < value2 ? ahead : behind);
//                        result = strCmpLogical(value1, value2);
//                        if(result !== equal){
//                            result = result < 0 ? ahead : behind;
//                        }
                        
                        if(result === equal && after_comparator){
                            return after_comparator(node1, node2);
                        }
                        return result;
                    };

                for (var i = 0, l = datas.length; i < l; i++) {
                    if (datas[i]) {
                        // slice一下，避免直接修改原数组。
                        datas[i] = datas[i].slice(0).sort(comparator); // = collections.sort_by(datas[i], val_get, asc, col);
                    }
                }
            }
            return datas;
        },

        get_field: function () {
            return this._cur_field;
        },

        get_order: function () {
            return this._cur_order;
        },

        toggle: function (visible) {
//            this.ui.toggle(visible);
        }
    };

    $.extend(ColumnModel.prototype, events);

    return ColumnModel;
});/**
 * 文件列表标题UI
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui.column_model.ui",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        tmpl = require('./tmpl'),

        asc = 'asc',
        desc = 'desc',

        default_options = {
            el: null,
            cols: [/*Column*/],
            default_field: '',
            default_order: '',
            klass: '',
            visible: true
        },

        undefined;

    var ColumnModelUI = function (options) {
        this.options = $.extend(true, {}, default_options, options);
    };

    ColumnModelUI.prototype = {

        render: function () {

            var me = this;

            this._$el = me._init_$doms();

            $(me.options.el).empty().append(this._$el);

            this._$el.on('click.column_model', '[data-field]', function (e) {

                e.preventDefault();

                var $handler = $(this),
                    $a = $handler.children('a'),
                    field = $handler.attr('data-field'),
                    order = $a.hasClass(asc) ? desc : ($a.hasClass(desc) ? asc: me.options.default_order);

                me.trigger('sort', field, order);

                // 更新class
                $a.toggleClass(asc, order === asc).toggleClass(desc, order === desc);
                $handler.siblings().children('a').removeClass('desc asc');
            });

        },

        toggle: function (visible) {
            this._$el.toggle(visible);
        },

        _init_$doms: function () {

            var opts = this.options;
            var ttt = new Date().getTime();
            var $el = $(tmpl.ui_column_model({
                field: opts.default_field,
                order: opts.default_order,
                cols: opts.cols,
                klass: opts.klass
            }));
            // console.debug('tmpl.ui_column_model', new Date().getTime() - ttt);

            return $el;
        }
    };

    $.extend(ColumnModelUI.prototype, events);

    return ColumnModelUI;
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
            me.$el = $(tmpl.context_menu({ items: render_items, arrow: arrow, has_icons: has_icons })).hide().appendTo($to.length ? $to : document.body);

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
            $el = $(tmpl['mini_tip_' + constants.UI_VER]());
            $text = uiv === 'APPBOX' ? $el.find('[data-action="text"]') : $el;

            if (uiv === 'APPBOX') {
                $el.appendTo(document.body);
            } else {
                var $fix_header = $('#_main_fixed_header');
                $el.appendTo($fix_header[0] || document.body);
            }

            this.init_if = $.noop;
        },

        /**
         * 设置动画类型（建议在页面初始化后调用）
         * @param {String} type 'fade' or 'slide'
         * @deprecated 已废弃
         */
        set_animate_type: $.noop,

        _msg: uiv === 'APPBOX' ? function (type, msg, second) {
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
        } : function (type, msg, second, top) {
            if (!msg)
                return;

            var me = this;

            me.init_if();

            msg = msg.toString();

            clearTimeout(t);

            $el
                .removeClass('ui-tips-ok ui-tips-warn ui-tips-err')
                .addClass('ui-tips-' + type)
                .html(msg)
                .css({
                    visibility: 'hidden',
                    display: ''
                })
                .css({
                    left: '50%',
                    marginLeft: -$el.width() / 2 + 'px',
                    marginTop: top || '122px',
                    visibility: '',
                    display: 'none'
                })
                .stop(true, true)
                .fadeIn(fade_speed);

            var delay = second > 0 ? second : calc_delay(msg);  // 延迟一定时间后隐藏
            t = setTimeout(function () {
                me.hide();
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
define.pack("./ui.paging_helper",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('paging'),

        global_event = common.get('./global.global_event'),

        $win = $(window),
        M = Math,


        win_width = $win.width(),   // 屏幕分辨率宽度
        win_height = $win.height(), // 屏幕分辨率高度

        reach_bottom_px = 300,   // 距离页面底部300px时加载文件

        min_line_count_list = 6,
        min_line_count_thumb = 2,

        default_options = {
            $container: null,
            item_width: 0,
            item_height: 0,
            fixed_height: 0
        },

        undef;


    var Paging_Helper = function (opts) {
        var o = this._options = $.extend({}, default_options, opts);
        o.$container = $(o.$container);
    };

    Paging_Helper.prototype = {

        /**
         * 获取每行可显示的文件个数（列表模式请设置 item_width 为 0）
         * @returns {Number} 文件个数
         */
        get_line_size: function () {
            var o = this._options,
            // 每行应显示的文件个数（列表模式或item_width为0或'auto'时每行显示1个）
                line_size = o.is_list || !(o.item_width > 0) ? 1 : M.max(M.floor(o.$container.width() / o.item_width), 1);
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
                line_count = is_first_page ? M.floor((win_height - o.fixed_height) / o.item_height) + min_line_count : min_line_count;
            // console.log('line_count', line_count);
            // 行数
            return  line_count;
        },

        /**
         * 判断是否滚到了需要加载文件的位置（摘自 qqdisk_web_wy.js）
         * @returns {boolean}
         */
        is_reach_bottom: function () {

            var scroll_top = $win.scrollTop(),
                doc = document,
                win_height = $win.height(),
                doc_height = doc.documentElement.scrollHeight;

            return scroll_top + win_height >= doc_height - reach_bottom_px;
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

        set_fixed_height: function (fixed_height) {
            this._options.fixed_height = fixed_height;
        },

        set_$container: function ($container) {
            this._options.$container = $($container);
        }
    };


    global_event.on('window_resize', function () {
        win_width = $win.width();
        win_height = $win.height();
    });

    return Paging_Helper;
});/**
 * 消息提示panel
 * @author trumpli
 * @date 2013-07-14
 */
define.pack("./ui.pop_panel",["$"],function (require, exports, module) {

    var $ = require('$'),
        clear_time_out = clearTimeout;

    /**
     * host_$dom 弹层的依覆对象
     * $dom 弹出的panel层的jQuery 对象
     * show 显示操作
     * hide 隐藏的动作
     * delay_time 延迟多久显示 默认500毫秒
     */
    var pop_panel = function( param ) {
        var me = this;
        me._panel_dom = param.$dom[0];
        param.$dom.hover(function(){
            this.is_in = true;
        },function(){
            me.hide();
        });
        if( param.host_$dom ){
            param.host_$dom
                .on('click', function(){
                    me.show()
                }).hover(function(){
                    me.show()
                }, function(){
                    me.hide()
                });
        }
        me.real_show = param.show;
        me.real_hide = param.hide;
        me.delay_time = param.delay_time || 500;

    };

    $.extend(pop_panel.prototype,{
        _out_id: 0,
        show: function(){
            var me = this;
            me._panel_dom.is_in = true;
            if( me.out_id ){
                clear_time_out( this._out_id );
            }
            me.real_show.apply(this,arguments);
        },
        hide: function(){
            var me = this;
            me._panel_dom.is_in = false;
            if(me._out_id)
                clear_time_out( me._out_id );
            me._out_id = setTimeout(function(){
                if( me._panel_dom.is_in === false){
                    me.real_hide.apply(this,arguments);
                }
            },me.delay_time);
        }
    });
    return pop_panel;
});/**
 * 展示处理进度
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author jameszuo
 * @date 13-1-19
 */
define.pack("./ui.progress",["lib","common","$","./ui.widgets","./tmpl","./ui.center"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
define.pack("./ui.scroller",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),

        tmpl = require('./tmpl'),

        default_speed = 'slow',

        $el = $($.browser.webkit ? document.body : document.documentElement),
        // webkit body (chrome/safari)
        // ie html
        // ff html

        undefined;


    var scroller = new Module('scroller', {

        top: function (callback) {
            this.go(0, callback);
        },

        /**
         * 滚！
         * @param {Number} y Y
         * @param {Number|String} [speed] 动画持续时间，默认 'slow'
         * @param {Function} [callback] 动画完成的回调
         */
        go: function (y, speed, callback) {
            if (y === $el.scrollTop()) {
                return;
            }

            if(typeof arguments[1] === 'function') {
                callback = arguments[1];
                speed = undefined;
            }

            if(speed != 0) {
                $el.animate({
                    scrollTop: y
                }, {
                    during: speed || default_speed,
                    easing: easing.get('easeOutExpo'),
                    complete: callback
                });
            } else {
                $el.scrollTop(0);
            }
        }

    });

    return scroller;
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
                            var type = err[1];
                            (mini_tip[type] || mini_tip.warn).call(mini_tip, err[0]);
                        } else {
                            mini_tip.warn(err);
                        }
                        return;
                    }
                }
                // 回调
                $.isFunction(o.handler) && o.handler.call(me, e);
            });

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

        _set_visible: function (yes) {
            if (this._visible !== yes) {
                this._$el.toggle(yes);
                this._visible = yes;
            }
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
    };

    Toolbar.prototype = {

        /**
         * 渲染
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this;

            me._$el = $(tmpl.toolbar({ btns: me._btns })).addClass(this._cls).appendTo($to);

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

        get_btn: function (id) {
            return this._btn_map[id];
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

        get_$el: function () {
            return this._$el;
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
define.pack("./ui.widgets",["lib","common","$","i18n","./tmpl","./constants","./global.global_event","./ui.center"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        _ = require('i18n'),

        template = lib.get('./template'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        tmpl = require('./tmpl'),
        constants = require('./constants'),
        global_event = require('./global.global_event'),
        page_event = require('./global.global_event').namespace('page'),
        ui_center = require('./ui.center'),


        $win = $(window),
        $doc = $(document),

        dam_ie6 = $.browser.msie && $.browser.version < 7,

        KEYPRESS_EVENT_NAME = dam_ie6 ? 'keypress' : 'keydown',

        undefined;

    /**
     * 确认框
     * @param title 标题
     * @param msg 消息
     * @param desc 消息（小字）
     * @param ok_callback 确定回调
     * @param cancel_callback 取消回调
     * @param button_texts 按钮文本
     */
    exports.confirm = function (title, msg, desc, ok_callback, cancel_callback, button_texts) {
        var $el = $('#_widgets_confirm');
        if ($el[0]) {
            $el.remove();
        }

        if (!$.isArray(button_texts)) {
            button_texts = [];
        }
        $el = $(tmpl.confirm({ title: title, msg: msg, desc: desc, button_texts: button_texts })).appendTo(document.body);

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
                handle: '.ui-xbox-title, .ui-xbox-foot',
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
                { id: 'OK', text: options.button_text || _('确定'), klass: 'ui-btn-ok', disabled: false, visible: true }
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
        show: function (namespace, under_$el, white) {
            this.toggle(true, namespace, under_$el, white);
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
         */
        toggle: function (visible, namespace, under_$el, white) {
            if (typeof visible !== 'boolean') {
                return;
            }

            white = white === true;

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

                $mask_el.animate({ opacity: .65 }, 'fast');

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
                handlers: null // { OK: func(), CANCEL: func() }
            },

            DEFAULT_BUTTONS = {
                OK: { id: 'OK', text: _('确定'), klass: 'ui-btn-ok', disabled: false, visible: true, submit: true },
                CANCEL: { id: 'CANCEL', text: _('取消'), klass: 'ui-btn-cancel', disabled: false, visible: true },
                CLOSE: { id: 'CLOSE', text: _('关闭'), klass: 'ui-btn-cancel', disabled: false, visible: true }
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
                            handle: '.ui-xbox-title, .ui-xbox-foot',
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
                } else {
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
define.pack("./user_log",["lib","common","$","./constants","./query_user","./urls","./configs.ops"],function (require, exports, module) {
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        JSON = lib.get('./json'),
        console = lib.get('./console'),
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
    var oz_op_log = function (op_or_name, ret, params, extra_config) {
        var op = typeof op_or_name === 'number' ? op_or_name : (ops.get_oz_op_by_name(op_or_name) || ops.get_click_op_by_name(op_or_name));
        if (!op) {
            console.error('user_log() 无效的参数 op=' + op_or_name);
            return;
        }

        var data = $.extend({
            op: op,
            rst: ret || 0,
            service_id: SERVICE_ID,
            subop: 0
        }, base_params, params);

        // 单个上报
        if (count_to_sent === 1 || extra_config) {
            oz_op_log.single_log(extra_config, data);
        }
        // 批量上报
        else {
            stack_data.push(data);
            if (stack_data.length == count_to_sent) {
                oz_op_log.pitch_log(stack_data);
                stack_data = [];
            }
        }

    };

    /**
     * 设置基础参数（所有的user_log请求都会戴上这些参数）
     */
    oz_op_log.set_base_param = function (key, value) {
        base_params[key] = value;
    };

    /**
     * 批量上报日志
     * bondli
     */
    oz_op_log.pitch_log = function (data) {
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
    oz_op_log.single_log = function (extra_config, data) {

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

    return oz_op_log;
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


    functional.burst = function( ary, fn, len ){
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
                }, 200);

            };

        return {
            start: start
        };

    };


    return functional;

});
/**
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
define.pack("./util.plugin_detect",["$"],function(require, exports, module) {

    var $ = require('$'),

        IE_NEWEST_PLUGIN_VERSION = '1.0.3.7',//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION = '1.0.0.7',//webkit控件最新的版本号

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
//common/src/ui/column_model/column_model.tmpl.html
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_tip.APPBOX.tmpl.html
//common/src/ui/mini_tip.WEB.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ui_column_model': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),

        field = data.field,
        order = data.order,

        klass = data.klass,

        cols = data.cols;
    __p.push('\r\n\
    <div data-no-selection class="sortable file-sorting ');
_p( klass );
__p.push('" ');
_p(data.visible ? '':'display:none;');
__p.push('>\r\n\
        <ul>');

            $.each(cols, function (i, col) {
                var opts = col.options,
                    enable = !!opts.val_get;
            __p.push('                <li data-field="');
_p( opts.field );
__p.push('" class="');
_p( opts.klass );
__p.push('">');
 if (i > 0) { __p.push('<s class="border"></s>');
 } __p.push('                    <a class="by ');
_p( field == opts.field ? order:'' );
__p.push('" href="#" hidefocus="on">');
_p( text.text(opts.title) );
 if (enable) { __p.push('<i></i>');
}__p.push('</a>\r\n\
                </li>');

            });
            __p.push('        </ul>\r\n\
    </div>');

return __p.join("");
},

'context_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),
        arrow = data.arrow,
        items = data.items || [],
        length = items.length;
    __p.push('    <div data-no-selection data-comm-ctxtmenu class="content-menu-0731">\r\n\
        <ul class="');
_p( data.has_icons ? 'ico-mod' : 'txt-mod' );
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

'mini_tip_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-tip-box">\r\n\
        <span class="full-tip"><span class="inner"><i class="ico"></i><span class="text" data-action="text"></span></span></span>\r\n\
    </div>');

return __p.join("");
},

'mini_tip_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-tips" style="display:none;"></div>');

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
__p.push('" href="#"><span class="btn-auxiliary">');
 if (btn._o.icon) { __p.push('<i class="ico ');
_p( btn._o.icon );
__p.push('"></i>');
 } __p.push('<span class="text">');
_p( btn._o.label );
__p.push('</span></span></a>');

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
        _ = require('i18n'),
        text = lib.get('./text');
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
_p( text.text(data.msg) );
__p.push('</h4>\r\n\
                        <div class="ui-text">');
_p( text.text(data.desc) );
__p.push('</div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="ui-xbox-foot">\r\n\
                    <input type="button" class="_ok ui-btn-ok" value="');
_p( data.button_texts[0] ? text.text(data.button_texts[0]) : _('确定') );
__p.push('"/>\r\n\
                    <input type="button" class="_x ui-btn-cancel" value="');
_p( data.button_texts[1] ? text.text(data.button_texts[1]) : _('取消') );
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
