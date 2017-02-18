//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/client/common/common.r160822",["lib","$"],function(require,exports,module){

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
//common/src/cloud_config.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/logic_error_code.js
//common/src/configs/new_ops.js
//common/src/configs/ops.js
//common/src/configs/speed_config.js
//common/src/constants.js
//common/src/dataview/Box_selection_plugin.js
//common/src/dataview/Multi_selection_plugin.js
//common/src/disk_config.js
//common/src/file/file_object.js
//common/src/file/file_type_map.js
//common/src/file/parse_file.js
//common/src/filter/session_filter.js
//common/src/global/global_event.js
//common/src/global/global_function.js
//common/src/global/global_variable.js
//common/src/huatuo_speed.js
//common/src/imgReady.js
//common/src/init/click_tj.js
//common/src/init/default_global_events.js
//common/src/init/enable_repaint.js
//common/src/init/fix_ie11.js
//common/src/init/fix_ie6.js
//common/src/init/init.js
//common/src/init/prevent_error.js
//common/src/init/prevent_events.js
//common/src/m_speed.js
//common/src/module.js
//common/src/pb_cmds.js
//common/src/query_user.js
//common/src/remote_config.js
//common/src/report_invoice.js
//common/src/report_md.js
//common/src/report_store.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/scr_reader_mode.js
//common/src/stat_log.js
//common/src/ui/Editor.js
//common/src/ui/SelectBox.js
//common/src/ui/blank_tip.js
//common/src/ui/center.js
//common/src/ui/context_menu.js
//common/src/ui/dragRun.js
//common/src/ui/ie_click_hacker.js
//common/src/ui/mini_holding_tip.js
//common/src/ui/mini_tip.js
//common/src/ui/mini_tip_v2.js
//common/src/ui/paging_helper.js
//common/src/ui/pop_panel.js
//common/src/ui/progress.js
//common/src/ui/scroll_bar.js
//common/src/ui/scroller.js
//common/src/ui/thumb_helper.js
//common/src/ui/toast.js
//common/src/ui/toolbar/button.js
//common/src/ui/toolbar/button_group.js
//common/src/ui/toolbar/toolbar.js
//common/src/ui/widgets.js
//common/src/update_cookie.js
//common/src/urls.js
//common/src/user_log.js
//common/src/util/Copy.js
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/get_total_space_size.js
//common/src/util/https_tool.js
//common/src/util/logger.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
//common/src/util/preview_dispatcher.js
//common/src/webapp.js
//common/src/ui/blank_tip.tmpl.html
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_holding_tip.tmpl.html
//common/src/ui/mini_tip.tmpl.html
//common/src/ui/mini_tip_v2.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/scroll_bar.tmpl.html
//common/src/ui/toast.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html

//js file list:
//common/src/Simple_module.js
//common/src/cgi_ret_report.js
//common/src/cloud_config.js
//common/src/configs/aid.js
//common/src/configs/click_tj.js
//common/src/configs/logic_error_code.js
//common/src/configs/new_ops.js
//common/src/configs/ops.js
//common/src/configs/speed_config.js
//common/src/constants.js
//common/src/dataview/Box_selection_plugin.js
//common/src/dataview/Multi_selection_plugin.js
//common/src/disk_config.js
//common/src/file/file_object.js
//common/src/file/file_type_map.js
//common/src/file/parse_file.js
//common/src/filter/session_filter.js
//common/src/global/global_event.js
//common/src/global/global_function.js
//common/src/global/global_variable.js
//common/src/huatuo_speed.js
//common/src/imgReady.js
//common/src/init/click_tj.js
//common/src/init/default_global_events.js
//common/src/init/enable_repaint.js
//common/src/init/fix_ie11.js
//common/src/init/fix_ie6.js
//common/src/init/init.js
//common/src/init/prevent_error.js
//common/src/init/prevent_events.js
//common/src/m_speed.js
//common/src/module.js
//common/src/pb_cmds.js
//common/src/query_user.js
//common/src/remote_config.js
//common/src/report_invoice.js
//common/src/report_md.js
//common/src/report_store.js
//common/src/request.js
//common/src/request_task.js
//common/src/ret_msgs.js
//common/src/scr_reader_mode.js
//common/src/stat_log.js
//common/src/ui/Editor.js
//common/src/ui/SelectBox.js
//common/src/ui/blank_tip.js
//common/src/ui/center.js
//common/src/ui/context_menu.js
//common/src/ui/dragRun.js
//common/src/ui/ie_click_hacker.js
//common/src/ui/mini_holding_tip.js
//common/src/ui/mini_tip.js
//common/src/ui/mini_tip_v2.js
//common/src/ui/paging_helper.js
//common/src/ui/pop_panel.js
//common/src/ui/progress.js
//common/src/ui/scroll_bar.js
//common/src/ui/scroller.js
//common/src/ui/thumb_helper.js
//common/src/ui/toast.js
//common/src/ui/toolbar/button.js
//common/src/ui/toolbar/button_group.js
//common/src/ui/toolbar/toolbar.js
//common/src/ui/widgets.js
//common/src/update_cookie.js
//common/src/urls.js
//common/src/user_log.js
//common/src/util/Copy.js
//common/src/util/browser.js
//common/src/util/functional.js
//common/src/util/get_total_space_size.js
//common/src/util/https_tool.js
//common/src/util/logger.js
//common/src/util/os.js
//common/src/util/plugin_detect.js
//common/src/util/preview_dispatcher.js
//common/src/webapp.js
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

        //report_cgi = 'http://c.isdspeed.qq.com/code.cgi',
        report_cgi =  constants.HTTP_PROTOCOL + '//user.weiyun.com/isdspeed/c/code.cgi',

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
 * pb2.0公用的服务端存取key-value配置
 * @author hibincheng
 * @date 2014-09-19
 */
define.pack("./cloud_config",["lib","$","./request"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        request = require('./request'),

        DEFAULT_CGI = 'http://web2.cgi.weiyun.com/weiyun_config.fcg',
        GET_CMD = 'CloudConfigGet',
        SET_CMD = 'CloudConfigSet',

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
                'value': default_value
            });
        }

        $.each(keys, function(i, item) {
            if(!item['value'] && item['value'] !== '') {
                item['value'] = '';//默认为空字符串
            }
        });

        var req = request.xhr_get({
            url: DEFAULT_CGI,
            cmd: GET_CMD,
            pb_v2: true,
            cavil: true,
            body: {
                item: keys
            }
        }).
            ok(function(msg, body) {
                var values = collections.array_to_set(body.item || [], 'key');
                def.resolve(values);
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
                value: value || ''
            });
        }

        var req = request.xhr_post({
            url: DEFAULT_CGI,
            cmd: SET_CMD,
            pb_v2: true,
            cavil: true,
            body: {
                item: pairs
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
 * 模调上报逻辑失败错误码，注意分模块
 * @author xixinhuang
 * @date 2016-11-09
 *
 */
define.pack("./configs.logic_error_code",[],function(require, exports, module) {

    var conf = {
        'download': {
            '1020': 1,   //下载文件不存在，例如被删除或移动
            '1052': 1,   //下载未完成上传的文件
            '1086': 1,   //批量操作条目超上限
            '1179': 1,   //流量超限
            '20002': 1,  //外链过期
            '20003': 1,  //外链使用次数已用完，请联系分享者重新分享
            '22073': 1,  //不支持打包下载,选择了过多目录
            '22077': 1,  //不支持打包下载,存在子目录
            '22078': 1,  //不支持打包下载,子文件过多
            '114200': 1, //分享资源已经删除
            '190049': 1, //违规文件
            '190011': 1, //登录态失效
            '190051': 1, //登录态失效
            '190061': 1, //登录态失效
            '190065': 1, //登录态失效
            '190072': 1  //地域限制，例如边疆地区的音视频上传下载
        }
    }

    return {
        /**
         * 获取某个模调上报ID对应的逻辑失败错误码
         * 支持多层配置，type用.隔开
         * @param type
         * @returns {*}
         */
        get: function(type) {
            //支持多层级配置
            var ns = type.split('.');
            if(ns.length > 1 && (typeof conf[ns[0]] === 'object') && conf[ns[0]][ns[1]]) {
                return conf[ns[0]][ns[1]];
            }
            return conf[type] || {};
        },

        /**
         * 判断某个错误码是否属于逻辑失败
         * @param type
         * @param code
         * @returns {boolean}
         */
        is_logic_error_code: function(type, code) {
            var code_map = this.get(type);
            if(code_map && code_map[code]) {
                return true;
            }
            return false;
        }
    }
});/**
 * 命令字与OZ操作码映射表
 * @author jameszuo
 * @date 13-3-29
 */
define.pack("./configs.new_ops",["lib","./constants"],function (require, exports, module) {

    var lib = require('lib'),

		console = lib.get('./console'),

		constants = require('./constants'),

    // 点击流统计, 增加一列表示appbox的值，第一列表示web，第二列表示appbox
		click_ops = {

			/************ 导航区（50000-50999）*******************/
			INDEP_PWD:                            [50002, 60002, '导航-独立密码'],
            RECHARGE_QZONE_VIP:                   [50102, 60102, '导航-开通黄钻'],
			LOGIN_OUT:                            [50006, 60006, '导航-退出'],
			HEADER_HELP:                          [50001, 60001, '导航-帮助'],
			HEADER_FANKUI:                        [50003, 60003, '导航-反馈'], //todo没有引用
			HEADER_GUANWANG:                      [50004, 60004, '导航-官网'],
			NAV_DISK:                             [50201, 60201, '左侧导航-网盘'],
			NAV_RECYCLE:                          [50202, 60202, '左侧导航-回收站'],
			NAV_PHOTO:                            [50205, 60205, '左侧导航-相册'],
			NAV_RECENT:                           [50203, 60203, '左侧导航-最近文件'],
			NAV_SHARE:                            [50206, 60206, '左侧导航-外链管理'],
            NAV_STATION:                          [50211, 60211, '左侧导航-中转站'],
			NAV_DOC:                              [50208, 60208, '左侧导航-文档'],
			NAV_VIDEO:                            [50209, 60209, '左侧导航-视频'],
			NAV_AUDIO:                            [50210, 60210, '左侧导航-音频'],
			NAV_OFFLINE:                          [50211, 60211, '左侧导航-离线文件'],
			NAV_DISK_REFRESH:                     [50221, 60221, '网盘-工具条-刷新'],
			NAV_SHARE_REFRESH:                    [50222, 60222, '导航-外链管理-刷新'],
			NAV_RECENT_REFRESH:                   [50204, 60204, '最近文件-刷新'],
			NAV_DOC_REFRESH:                      [50224, 60224, '文档-刷新'],
			NAV_VIDEO_REFRESH:                    [50226, 60226, '视频-刷新'],
			NAV_AUDIO_REFRESH:                    [50226, 60226, '音频-刷新'],
			NAV_ALBUM:                            [50207, 60207, '导航-图片'],
			NAV_ALBUM_REFRESH:                    [50223, 60223, '图片-刷新'],
            NAV_NOTE:                             [50228, 60228, '导航-笔记'],
			NAV_CLIPBOARD:                        [37304, 37304, '导航-剪贴板'], //todo还没有对应的appboxID

			/************ 头像 *******************/
			HEADER_USER_FACE_HOVER:               [50100, 60010, '头像菜单-鼠标移动至头像'],
			HEADER_USER_FACE_DOWNLOAD_CLIENT:     [50101, 60101, '头像菜单-下载客户端'],
			HEADER_USER_FACE_FEEDBACK:            [50003, 60003, '头像菜单-反馈'],


			/************ 工具条（52100-52199）*******************/
			TOOLBAR_UPLOAD:                       [52101, 62101, '网盘-工具条-上传按钮'],
			TOOLBAR_DOWNLOAD:                     [52102, 62102, '网盘-工具条-下载'],
			TOOLBAR_DOWNLOAD_BACK:                [52103, 62103, '网盘-工具条-下载-返回'],
			TOOLBAR_DOWNLOAD_OK:                  [52104, 62104, '网盘-工具条-下载-确定下载'],
			TOOLBAR_MANAGE:                       [52105, 62105, '网盘-工具条-管理'],
			TOOLBAR_MANAGE_MOVE:                  [52106, 62106, '网盘-工具条-管理-移动'],
			TOOLBAR_MANAGE_MOVE_BACK:             [52107, 62107, '网盘-工具条-管理-移动-返回'],
			TOOLBAR_MANAGE_MOVE_OK:               [52108, 62108, '网盘-工具条-管理-移动-点击移动'],
			TOOLBAR_MANAGE_MOVE_EXPAND_DIR:       [52109, 62109, '网盘-工具条-管理-移动-展开目录'],
			TOOLBAR_MANAGE_DELETE:                [52110, 62110, '网盘-工具条-管理-删除'],
			TOOLBAR_MANAGE_DELETE_BACK:           [52111, 62111, '网盘-工具条-管理-删除-返回'],
			TOOLBAR_MANAGE_DELETE_OK:             [52112, 62112, '网盘-工具条-管理-删除-确定删除'],
			TOOLBAR_MANAGE_MKDIR:                 [52113, 62113, '网盘-工具条-管理-新建文件夹'],
			TOOLBAR_RECYCLE:                      [52114, 62114, '网盘-工具条-回收站'],
			TOOLBAR_RECYCLE_BACK:                 [52115, 62115, '网盘-工具条-回收站-返回'],
			TOOLBAR_RECYCLE_RESTORE:              [57251, 67251, '网盘-工具条-回收站-还原'],
			TOOLBAR_RECYCLE_CLEAR:                [57252, 67252, '网盘-工具条-回收站-清空回收站'],


			/************ 面包屑区域（52200-52299）**************/
			DISK_BREAD_DIR:                       [52201, 62201, '网盘-面包屑-点击其他目录'],
			DISK_BREAD_WEIYUN:                    [52202, 62202, '网盘-面包屑-点击“微云”'],
			SWITCH_AZLIST_MODE:                   [52203, 62203, '网盘-查看模式-按a-z排序'],
			SWITCH_NEWESTLIST_MODE:               [52204, 62204, '网盘-查看模式-按时间排序'],
			SWITCH_NEWTHUMB_MODE:                 [52205, 62205, '网盘-查看模式-按缩略图'],

			/************ item 区（52300-52399）**************/
			ITEM_SHARE:                           [52300, 62300, '网盘-item-分享'],
			ITEM_RENAME:                          [52303, 62303, '网盘-item-文件夹重命名'],
			ITEM_DELETE:                          [52304, 62304, '网盘-item-删除（按钮）'],
			ITEM_MOVE:                            [52320, 62320, '网盘-item-移动按钮'],
			ITEM_DOWNLOAD:                        [52307, 62307, '网盘-item-下载（按钮）'],
			FILE_MENU_MORE:                       [52308, 62308, '网盘-item-更多'],
			MORE_MENU_LINK_SHARE:                 [52309, 62309, '网盘-item-更多-链接分享'],
			MORE_MENU_DELETE:                     [52310, 62310, '网盘-item-更多-删除'],
			MORE_MENU_MAIL_SHARE:                 [52311, 62311, '网盘-item-更多-邮件分享'],
			MORE_MENU_RENAME:                     [52312, 62312, '网盘-item-更多-重命名'],
			DISK_DRAG_RELEASE:                    [52313, 62313, '拖拽item后放手'],
			DISK_DRAG_DIR:                        [52314, 62314, '拖拽item到其他目录'],
			DISK_DRAG_BREAD:                      [52315, 62315, '拖拽item到面包屑'],
			DISK_DRAG_TO_TREE:                    [52316, 62316, '拖拽item到树'],

			/************ 右键（52400-52499）**************/
			RIGHTKEY_MENU:                        [52401, 62401, '网盘-右键-呼出右键'],
			RIGHTKEY_MENU_DOWNLOAD:               [52402, 62402, '网盘-右键-下载'],
			RIGHTKEY_MENU_MAIL_SHARE:             [52403, 62403, '网盘-右键-邮件分享'],
			RIGHTKEY_MENU_LINK_SHARE:             [52404, 62404, '网盘-右键-链接分享'],
			RIGHTKEY_MENU_MOVE:                   [52405, 62405, '网盘-右键-移动'],
			RIGHTKEY_MENU_RENAME:                 [52406, 62406, '网盘-右键-重命名'],
			RIGHTKEY_MENU_DELETE:                 [52407, 62407, '网盘-右键-删除'],
			RIGHTKEY_MENU_SHARE:                  [52408, 62408, '网盘-右键-分享'],


			/************ 上传下载框（52500-52599）**************/
			DISK_PLUGIN_INSTALL:                  [52501, 62501, '网盘-控件-“立即安装”'],
			DISK_PLUGIN_REINSTALL:                [52502, 62502, '网盘-控件-重新安装'],
			DISK_PLUGIN_INSTALLED:                [52503, 62503, '网盘-控件-点击“完成”'],
			DISK_UPLOAD_DONE:                     [52504, 62504, '网盘-上传-点击完成'],
			DISK_UPLOAD_SLIDE_UP:                 [52505, 62505, '网盘-上传-点击收起'],
			DISK_UPLOAD_PAUSE:                    [52506, 62506, '网盘-上传-点击暂停'],
			DISK_UPLOAD_CANCEL:                   [52507, 62507, '网盘-上传-点击取消(完全未上传)'],
			DISK_UPLOAD_CONTIUNE:                 [52508, 62508, '网盘-上传-点击续传'],
			DISK_UPLOAD_RESUME_CONTIUNE:          [52514, 62514, '网盘-上传-断点续传'],
			DISK_UPLOAD_HAS_DATA_CANCEL:          [52509, 62509, '网盘-上传-点击取消(有上传)'],
			UPLOAD_DOWN_BAR_CLOSE:                [52510, 62510, '网盘-下载-关闭APPBOX下载条'],
			UPLOAD_DOWN_BAR_OPEN_DIR:             [52511, 62511, '网盘-下载-点开APPBOX下载条的文件（打开文件所在目录）'],
			DISK_DRAG_UPLOAD:                     [52512, 62512, '拖拽上传'],
			DISK_DRAG_DOWNLOAD:                   [52513, 62513, '拖拽下载'],


			/************ 其他区（52600-52699）*******************/
			VRY_INDEP_PWD:                        [50401, 60401, '网盘 -输入并验证独立密码'],
			TO_TOP:                               [52602, 62602, '回到顶部'],
			BOX_SELECTION:                        [52603, 62603, '框选'],
			CLICK_WYSC_LINK:                      [59044, 69044, '微信目录跳转链接'],

			/************ 最近文件*********************************/
			RECENT_DOWNLOAD_BTN:                  [57001, 67001, '最近文件-下载按钮'],
			RECENT_CLICK_ITEM:                    [57002, 67002, '最近文件-item整条点击'],
			RECENT_LOAD_MORE:                     [57003, 67003, '最近文件-加载更多'],

			RECENT_CLEAR:                         [57004, 67004, '最近文件-清空记录'],
			RECENT_REFRESH:                       [57005, 67005, '最近文件-刷新'],
			/************ 图片预览 ********************************/
			IMAGE_PREVIEW_DOWNLOAD:               [52610, 62610, '图片预览 - 下载'],
			IMAGE_PREVIEW_REMOVE:                 [52611, 62611, '图片预览 - 删除'],
			IMAGE_PREVIEW_RAW:                    [52612, 62612, '图片预览-查看原图'],
			IMAGE_PREVIEW_NAV_PREV:               [52613, 62613, '图片预览-左翻页'],
			IMAGE_PREVIEW_NAV_NEXT:               [52614, 62614, '图片预览-右翻页'],
			IMAGE_PREVIEW_CLOSE:                  [52615, 62615, '图片预览-关闭'],

			IMAGE_PREVIEW_SHARE:                  [52617, 62617, '图片预览-分享'],
			IMAGE_PREVIEW_CODE:                   [52618, 62618, '图片预览-获取二维码'],
			IMAGE_PREVIEW_EXPANSION_UP:           [52619, 62619, '图片预览-缩略图列表-展开'],
			IMAGE_PREVIEW_EXPANSION_DOWN:         [52620, 62620, '图片预览-缩略图列表-收起'],
			IMAGE_PREVIEW_THUMB_NEXT:             [52621, 62621, '图片预览-缩略图列表-左翻页'],
			IMAGE_PREVIEW_THUMB_PREV:             [52622, 62622, '图片预览-缩略图列表-右翻页'],
			IMAGE_PREVIEW_THUMB_PICK:             [52623, 62623, '图片预览-缩略图列表-选中图片'],

			/************ 压缩包预览************************************/
			COMPRESS_DOWNLOAD:                    [52701, 62701, '下载压缩包内文件'],
			COMPRESS_PREV:                        [52702, 62702, '返回上一级'],
			COMPRESS_ENTER:                       [52703, 62703, '进入目录'],
			COMPRESS_CLOSE:                       [52704, 62704, '关闭'],

			/************ 点击item ********************************/
			ITEM_CLICK_DOWNLOAD:                  [52390, 62390, '网盘-item-点击item整条-下载'],
			ITEM_CLICK_DOC_PREVIEW:               [52391, 62391, '网盘-item-点击item整条-预览文档'],
			ITEM_CLICK_IMAGE_PREVIEW:             [52393, 62393, '网盘-item-点击item整条-预览图片'],
			ITEM_CLICK_ZIP_PREVIEW:               [52392, 62392, '网盘-item-点击item整条-预览压缩包'],
			ITEM_CLICK_LIST_CHECKBOX:             [52330, 62330, '网盘-item-checkbox-列表'],
			ITEM_CLICK_THUMB_CHECKBOX:            [52331, 62331, '网盘-item-checkbox-缩略图'],
			ITEM_CLICK_ENTER_DIR:                 [52394, 62394, '网盘-item-点击item整条-打开文件夹'],


			/****************** 上传管理 *************************/
			UPLOAD_SELECT_FILE:                   [52530, 62530, '上传主按钮'],
			UPLOAD_SELECT_PATH_CLOSE:             [52540, 62540, '新上传-关闭位置选择框'],
			UPLOAD_SELECT_PATH_MODIFY:            [52541, 62541, '新上传-“修改”文字链接'],
			UPLOAD_SELECT_PATH_OK:                [52542, 62542, '新上传-选择指定目录'],
			UPLOAD_SUBMIT_BTN_NORMAL:             [52543, 62543, '新上传-“普通上传”按钮'],
			UPLOAD_INSTALL_BTN_PLUGIN:            [52544, 62544, '新上传-“极速上传”按钮-触发安装'],
			UPLOAD_SUBMIT_BTN_PLUGIN:             [52805, 62805, '极速上传点击-位置选择框'],
			UPLOAD_FILE_MANAGER_OPEN:             [52545, 62545, '新上传-展开任务管理器'],
			UPLOAD_FILE_MANAGER_CLOSE:            [52546, 62546, '新上传-收起任务管理器'],
			UPLOAD_FILE_MANAGER_DONE:             [52547, 62547, '新上传-任务管理器-“完成”按钮'],
			UPLOAD_FILE_MANAGER_CANCEL:           [52548, 62548, '新上传-任务管理器-“全部取消/取消”按钮'],
			UPLOAD_FILE_MANAGER_PAUSE:            [52549, 62549, '新上传-任务管理器-“暂停”按钮'],
			UPLOAD_FILE_MANAGER_RESUME:           [52550, 62550, '新上传-任务管理器-“续传”按钮'],
			UPLOAD_FILE_MANAGER_CONTINUE:         [52551, 62551, '新上传-任务管理器-“重试”按钮'],
			UPLOAD_FILE_MANAGER_INSTALL:          [52553, 62553, '新上传-任务管理器-出错提示安装控件'],
			UPLOAD_FILE_MANAGER_OVER_LIMIT:       [52554, 62554, '新上传-单文件超过限制-”关闭“按钮'],
			UPLOAD_FILE_OVER_LIMIT_CLOSE:         [52554, 62554, '新上传-单文件超过限制-”关闭“按钮'],
			UPLOAD_FILE_OVER_LIMIT_INSTALL:       [52555, 62555, '新上传-单文件超过限制-”安装控件“按钮'],
			UPLOAD_FILE_MANAGER_ALL_RETRY:        [52556, 62556, '新上传-上传失败-”全部重试“按钮'],
			UPLOAD_BY_DRAG:                       [52640, 62640, '拖拽上传'],
			UPLOAD_UPLOAD_4G_FILE:                [52534, 62534, '上传-上传文件夹-超大文件'],
			UPLOAD_UPLOAD_4G_RESUME_UPLOAD:       [52540, 62540, '上传-跨登录续传-继续上传'],
			UPLOAD_UPLOAD_4G_TIPS_CONTINUE_IN:    [52550, 62550, '上传-4G以内框-“继续上传”'],
			UPLOAD_UPLOAD_4G_TIPS_RESELECT:       [52551, 62551, '上传-4G以内框-“重新选择”'],
			UPLOAD_UPLOAD_4G_TIPS_CONTINUE_OUT:   [52552, 62552, '上传-4G以外框-“继续上传”'],
			UPLOAD_UPLOAD_4G_PLUGIN_INSTALL:      [52830, 62830, '控件引导-4G以上-升级控件'],

			DOWNLOAD_FILE_MANAGER_PAUSE :         [52557, '下载-暂停'],

			/****************** 网盘新工具条 *************************/
			DISK_TBAR_ALL_CHECK:                  [52210, 62210, '网盘-面包屑-全选'],
			DISK_TBAR_DOWN:                       [52131, 62131, '网盘-工具条-下载'],
			DISK_TBAR_LINK_SHARE:                 [52132, 62132, '网盘-工具条-链接分享'],
			DISK_TBAR_MAIL_SHARE:                 [52133, 62133, '网盘-工具条-邮件分享'],
			DISK_TBAR_DEL:                        [52134, 62134, '网盘-工具条-删除'],
			DISK_TBAR_MOVE:                       [52135, 62135, '网盘-工具条-移动'],
			DISK_TBAR_RENAME:                     [52136, 62136, '网盘-工具条-重命名'],
			DISK_TBAR_SHARE:                      [52137, 62137, '网盘-工具条-分享'],

			/******************* 上传控件安装 **********************/
			PLUGIN_TIPS_INSTALL:                  [52800, 62800, 'tips引导安装控件按钮'],
			PLUGIN_POP_PANEL_INSTALL:             [52811, 62811, '功能性弹窗-“安装控件”'],
			PLUGIN_FLASH_LIMIT_INSTALL:           [52814, 62814, '上传任务中-flash限制-“安装控件”'],
			PLUGIN_ONLINE_ENTER:                  [52815, 62815, '在线安装页面-进入'],
			PLUGIN_ONLINE_REINSTALL:              [52816, 62816, '在线安装页面-重新下载/安装'],
			PLUGIN_DOWNLOAD_ENTER:                [52818, 62818, '下载安装页面-进入'],
			PLUGIN_DOWNLOAD_REINSTALL:            [52819, 62819, '下载安装页面-重新下载/安装'],

			PLUGIN_ONLINE_SUCCESS:                [52802, 62802, '在线安装页面-成功'],
			PLUGIN_DOWNLOAD_SUCCESS:              [52803, 62803, '下载安装页面-成功'],

			PLUGIN_POP_PANEL_SUCCESS:             [52820, 62820, '触发安装后弹窗-已安装成功'],
			PLUGIN_POP_PANEL_REINSTALL:           [52821, 62821, '触发安装后弹窗-重新安装'],
			PLUGIN_POP_PANEL_FAIL_REINSTALL:      [52822, 62822, '触发安装后弹窗-控件未安装成功-重新安装'],

			UPLOAD_UPLOAD_FILE:                   [52531, 62531, '上传-上传文件'],
			UPLOAD_UPLOAD_DIR:                    [52532, 62532, '上传-上传文件夹'],
            UPLOAD_NOTE:                          [52536, 62536, '添加-笔记'],
			UPLOAD_UPLOAD_DIR_NO_PLUGIN:          [52533, 62533, '上传-上传文件夹-未安装控件'],

			UPLOAD_SELECT_FOLDER_NO_FOLDER:       [52560, 62560, '新上传-选择文件夹-包含子目录'],
			UPLOAD_SELECT_FOLDER_HAS_FOLDER:      [52561, 62561, '新上传-选择文件夹-不包含子目录'],
			UPLOAD_FOLDER_ERROR_HOVER:            [52562, 62562, '新上传-选择文件夹-出错时hove详情'],

			/******************  Appbox添加微云到主面板引导页 *************************/
			ADD_WY_TO_APPBOX:                     [59002, 69002, '添加微云到主面板引导页'],//利用subop 1 现在添加 2已完成 3暂不添加 4重新添加 5 以后添加 6 确定  7 关闭按钮
			APPBOX_USER_ENV:                      [59020, 69020, '登录appbox的用户环境'],
			WEB_USER_ENV:                         [59023, 69023, '登录WEB的用户环境'],

			/******************  外链管理 *************** 6***************/
			SHARE_TBAR_CANCEL:                    [57400, 67400, '工具条-取消按钮'],
			SHARE_SELECT_ALL:                     [57410, 67410, '全选'],
			SHARE_HOVERBAR_VISIT:                 [57420, 67420, 'hoverBar-查看链接分享'],
			SHARE_HOVERBAR_COPY:                  [57421, 67421, 'hoverBar-复制链接'],
			SHARE_HOVERBAR_PWD_CHANGE:            [57422, 67422, 'hoverBar-修改密码'],
			SHARE_HOVERBAR_PWD_CREATE:            [57423, 67423, 'hoverBar-创建密码'],
			SHARE_HOVERBAR_CANCEL:                [57424, 67424, 'hoverBar-取消分享'],
			SHARE_ITEM_CLICK:                     [57500, 67500, '外链Item-点击-点击链接查看链接分享'],
			SHARE_ITEM_COPY:                      [57501, 67501, '外链Item-点击展开-复制按钮'],

			SHARE_LINK_TAB:                       [58002, 68002, '外链分享界面-链接分享页面'],
			SHARE_MAIL_TAB:                       [58003, 68003, '外链分享界面-邮件分享页面'],
			CANCEL_SHARE_PWD:                     [57505, 67505, '分享弹窗-取消加密'],
			ADD_SHARE_PWD:                        [57506, 67506, '分享弹窗-给分享链接加密'],
			SHARE_MGR_DELETE_CHECKBOX:            [57510, 67510, '外链密码管理界面-删除密码'],
			SHARE_MGR_CHANGE_CHECKBOX:            [57511, 67511, '外链密码管理界面-修改密码'],
			SHARE_CREATE_COPY_BUTTON:             [58012, 68012,'链接分享的复制按钮'],
			MAIL_SHARE_SEND_BUTTON:               [58013, 68013,'邮件分享的发送按钮'],
			SHARE_CREATE_CHANGE_PWD:              [57507, 67507,'文件分享界面的修改密码'],
			SHARE_MGR_PWD_OK_CREATE:              [57512, 67512,'密码管理界面-确定创建密码'],

			/******************* 搜索 **********************/
			SEARCH_CANCEL :                       [50501, 60501, '页面头部搜索框-点击清空'],
			SEARCH_LIST_CLICK :                   [50510, 60510, '搜索item-点击'],
			SEARCH_LIST_DOWNLOAD :                [50511, 60511, '搜索item-点击下载'],
			SEARCH_LIST_DELETE :                  [50512, 60512, '搜索item-点击删除'],
			SEARCH_LIST_SHARE :                   [50513, 60513, '搜索item-点击分享'],
			SEARCH_LIST_OPEN_FOLDER :             [50514, 60514, '搜索item-点击打开所属目录'],
			SEARCH_LIST_CONTEXT_MENU :            [50515, 60515, '搜索item-右键-弹出菜单'],

			// ==== 手动统计（如文档预览的加载时间等） ==========================================
			active_plugin:                        [9136, 9136, 'Acive控件上传'],
			webkit_plugin:                        [9136, 9136, 'Webkit控件上传'],
			upload_flash:                         [9137, 9137, 'flash上传'],
			upload_form:                          [9138, 9138, '表单上传'],
            upload_h5_flash:                      [9139, 9139, 'h5+flash上传'],
            upload_html5:                         [9140, 9140, 'html5上传'],
			upload_html5_pro:                     [9141, 9141, 'html5极速上传'],
			upload_from_QQClient:                 [20003, 20003, 'qq传文件上传到微云'],
			view_from_QQClient:                   [20005, 20005, 'qq传完文件后，点击“到微云中查看”'],
			download_hijack_check:                [405, 405, '下载劫持侦测'],
			webkit_donwload:                      [515, 515, 'Webkit下载'],

			/****************头部链接广告*********************/
			header_ad_link_web:                   [59000, 69000, 'web头部链接广告'],
			header_ad_link_appbox:                [59001, 69001, 'appbox头部链接广告'],
            HEADER_OUTER_AD_LIND:                 [59002, 69002, '外网头部广告链接'],
            HEADER_OUTER_AD_DOWNLOAD:             [59003, 69003, '外网头部下载入口'],

			/***************cgi因自动重试而成功****************/
			re_try_flag:                          [59001, 59001, 'CGI重试成功'], //todo未被使用

			/***************拖拽文件发送***********************/
			DRAG_FILE_SEND_TO_QQ:                 [59040, 69040, '拖拽到QQ好友'],
			DRAG_FILE_SEND_TO_QUN:                [59041, 69041, '拖拽到群'],
			DRAG_FILE_SEND_TO_GROUP:              [59042, 69042, '拖拽到讨论组'],
			DRAG_FILE_SEND_TO_TMP:                [59043, 69043, '拖拽到临时会话'],

			/************************离线文件*****************************************/
			OFFLINE_ITEM_CHECKALL:                [57600, 67600, '离线文件-item-全选'],
			OFFLINE_ITEM_CHECKBOX:                [57601, 67601, '离线文件-item-checkbox'],
			OFFLINE_ITEM_CLICK:                   [57602, 67602, '离线文件-item-点击整行'],
			OFFLINE_HOVERBAR_SAVEAS:              [57603, 67603, '离线文件-hovebar-另存为'],
			OFFLINE_HOVERBAR_DELETE:              [57604, 67604, '离线文件-hovebar-删除'],
			OFFLINE_HOVERBAR_DOWNLOAD:            [57605, 67605, '离线文件-hovebar-下载'],
			OFFLINE_TOOLBAR_DOWNLOAD:             [57611, 67611, '离线文件-工具栏-下载'],
			OFFLINE_TOOLBAR_DELETE:               [57612, 67612, '离线文件-工具栏-删除'],
			OFFLINE_TOOLBAR_SAVEAS:               [57613, 67613, '离线文件-工具栏-另存为'],
			OFFLINE_TOOLBAR_REFRESH:              [57614, 67614, '离线文件-工具栏-刷新'],
			OFFLINE_HAS_FILES:                    [57620, 67620, '列表中有文件'],
			OFFLINE_EMPTY_FILES:                  [57621, 67621, '列表中无文件'],

			/**************************双屏*****************************/
			DBVIEWTREE_ITEM_CLICK:                [52341, 62341, '目录树-点击item'],
			DBVIEWTREE_ITEM_DELTA_CLICK:          [52342, 62342, '目录树-点击item前三角形'],
			DBVIEWTREE_OPEN:                      [52150, 62150, '网盘-工具条-展开双屏'],
			DBVIEWTREE_CLOSE:                     [52151, 62151, '网盘-工具条-收起双屏'],
			DBVIEWTREE_ITEM_DROP:                 [52641, 62641, '双屏下拖拽到目录树'],

			/**************************引导安装客户端************************/
			GUIDE_INSTALL_ANDROID:                [59110, 69110, '引导安装android'],
			GUIDE_INSTALL_ANDROID_SEND_TO_PHONE:  [59111, 69111, '引导安装android-发送到手机-发送按钮'],
			GUIDE_INSTALL_ANDROID_SEND_BTN:       [59112, 69112, '引导安装android-发短信'],
			GUIDE_INSTALL_ANDROID_CLICK_DOWN:     [59113, 69113, '引导安装android-下载安装包'],
			GUIDE_INSTALL_IPHONE:                 [59120, 69120, '引导安装iPhone'],
			GUIDE_INSTALL_IPHONE_SEND_BTN:        [59121, 69121, '引导安装iPhone-发短信'],
			GUIDE_INSTALL_IPHONE_CLICK_DOWN:      [59122, 69122, '引导安装iPhone-前往appstore下载'],
			GUIDE_INSTALL_IPAD:                   [59130, 69130, '引导安装iPad'],
			GUIDE_INSTALL_IPAD_SEND_BTN:          [59131, 69131, '引导安装iPad-发短信'],
			GUIDE_INSTALL_IPAD_CLICK_DOWN:        [59132, 69132, '引导安装iPad-前往appstore下载'],

			/************************库分类（文档、视频、音频）************************/
			CATEGORY_DOC_FILTER_ALL:              [57700, 67700, '文档库-工具栏-筛选-全部'],
			CATEGORY_DOC_FILTER_DOC:              [57701, 67701, '文档库-工具栏-筛选-DOC'],
			CATEGORY_DOC_FILTER_XLS:              [57702, 67702, '文档库-工具栏-筛选-XLS'],
			CATEGORY_DOC_FILTER_PPT:              [57703, 67703, '文档库-工具栏-筛选-PPT'],
			CATEGORY_DOC_FILTER_PDF:              [57704, 67704, '文档库-工具栏-筛选-PDF'],
			CATEGORY_DOC_SORT_MTIME:              [57710, 67710, '文档库-工具栏-排序-时间'],
			CATEGORY_DOC_SORT_AZ:                 [57711, 67711, '文档库-工具栏-排序-AZ'],
			CATEGORY_DOC_HOVERBAR_DOWNLOAD:       [57720, 67720, '文档库-hoverbar-下载'],
			CATEGORY_DOC_HOVERBAR_SHARE:          [57721, 67721, '文档库-hoverbar-分享'],
			CATEGORY_DOC_HOVERBAR_RENAME:         [57722, 67722, '文档库-hoverbar-重命名'],
			CATEGORY_DOC_HOVERBAR_DELETE:         [57723, 67723, '文档库-hoverbar-删除'],
			CATEGORY_DOC_CONTEXTMENU_DOWNLOAD:    [57730, 67730, '文档库-右键-下载'],
			CATEGORY_DOC_CONTEXTMENU_SHARE:       [57731, 67731, '文档库-右键-分享'],
			CATEGORY_DOC_CONTEXTMENU_RENAME:      [57732, 67732, '文档库-右键-重命名'],
			CATEGORY_DOC_CONTEXTMENU_DELETE:      [57733, 67733, '文档库-右键-删除'],

			CATEGORY_VIDEO_SORT_MTIME:            [57810, 67810, '视频库-工具栏-排序-时间'],
			CATEGORY_VIDEO_SORT_AZ:               [57811, 67811, '视频库-工具栏-排序-AZ'],
			CATEGORY_VIDEO_HOVERBAR_DOWNLOAD:     [57820, 67820, '视频库-hoverbar-下载'],
			CATEGORY_VIDEO_HOVERBAR_SHARE:        [57821, 67821, '视频库-hoverbar-分享'],
			CATEGORY_VIDEO_HOVERBAR_RENAME:       [57822, 67822, '视频库-hoverbar-重命名'],
			CATEGORY_VIDEO_HOVERBAR_DELETE:       [57823, 67823, '视频库-hoverbar-删除'],
			CATEGORY_VIDEO_CONTEXTMENU_DOWNLOAD:  [57830, 67830, '视频库-右键-下载'],
			CATEGORY_VIDEO_CONTEXTMENU_SHARE:     [57831, 67831, '视频库-右键-分享'],
			CATEGORY_VIDEO_CONTEXTMENU_RENAME:    [57832, 67832, '视频库-右键-重命名'],
			CATEGORY_VIDEO_CONTEXTMENU_DELETE:    [57833, 67833, '视频库-右键-删除'],

			CATEGORY_AUDIO_SORT_MTIME:            [57910, 67910, '音乐库-工具栏-排序-时间'],
			CATEGORY_AUDIO_SORT_AZ:               [57911, 67911, '音乐库-工具栏-排序-AZ'],
			CATEGORY_AUDIO_HOVERBAR_DOWNLOAD:     [57920, 67920, '音乐库-hoverbar-下载'],
			CATEGORY_AUDIO_HOVERBAR_SHARE:        [57921, 67921, '音乐库-hoverbar-分享'],
			CATEGORY_AUDIO_HOVERBAR_RENAME:       [57922, 67922, '音乐库-hoverbar-重命名'],
			CATEGORY_AUDIO_HOVERBAR_DELETE:       [57923, 67923, '音乐库-hoverbar-删除'],
			CATEGORY_AUDIO_CONTEXTMENU_DOWNLOAD:  [57930, 67930, '音乐库-右键-下载'],
			CATEGORY_AUDIO_CONTEXTMENU_SHARE:     [57931, 67931, '音乐库-右键-分享'],
			CATEGORY_AUDIO_CONTEXTMENU_RENAME:    [57932, 67932, '音乐库-右键-重命名'],
			CATEGORY_AUDIO_CONTEXTMENU_DELETE:    [57933, 67933, '音乐库-右键-删除'],

			/************************PC客户端下载引导 *****************************/
			PC_GUIDE_DOWNLOAD_AD:                 [59141, 69141, '引导安装pc非同步盘-广告图'],
			PC_GUIDE_DOWNLOAD_CLOSE:              [59142, 69142, '引导安装pc非同步盘-关闭'],

			/*************************图片****************************************************/
			ALBUM_MODE_GROUP:                     [57729, 67729, '图片库-切换到分组'],
			ALBUM_MODE_TIME:                      [57730, 67730, '图片库-切换到时间轴'],
			ALBUM_MODE_ALL:                       [57732, 67732, '图片库-切换到全部'],
			ALBUM_GROUP_ENTER:                    [57733, 67733, '照片库-分组-进入分组'],
			ALBUM_GROUP_DRAG_SORT:                [57734, 67734, '照片库-分组-拖拽分组排序'],
			ALBUM_GROUP_HOVEBAR_RENAME:           [57735, 67735, '照片库-分组-hoveBar-重命名'],
			ALBUM_GROUP_HOVEBAR_DEL:              [57736, 67736, '照片库-分组-hoveBar-删除'],
			ALBUM_GROUP_HOVEBAR_SET_COVER:        [57737, 67737, '照片库-分组-hoveBar-更换封面'],
			ALBUM_GROUP_RIGHT_RENAME:             [57738, 67738, '照片库-分组-右键-重命名'],
			ALBUM_GROUP_RIGHT_DEL:                [57739, 67739, '照片库-分组-右键-删除'],
			ALBUM_GROUP_RIGHT_SET_COVER:          [57740, 67740, '照片库-分组-右键-更换封面'],
			ALBUM_GROUP_SET_COVER_CHOSE_PIC:      [57741, 67741, '照片库-分组-更改封面框-选择不同的照片'],
			ALBUM_GROUP_TOOL_NEW:                 [57742, 67742, '照片库-分组-工具栏-新建分组'],
			ALBUM_GROUP_TOOL_REFRESH:             [57743, 67743, '照片库-分组-工具栏-刷新'],
			ALBUM_GROUP_TOOL_CHANGE:              [57744, 67744, '照片库-分组-工具栏-更改分组'],
			ALBUM_GROUP_TOOL_DEL:                 [57745, 67745, '照片库-分组-工具栏-删除'],
			ALBUM_GROUP_DETAIL_RETURN:            [57746, 67746, '照片库-分组-返回'],
			ALBUM_GROUP_CLOSE_SHORTCUT:           [57747, 67747, '照片库-分组-收起快捷分组栏'],
			ALBUM_GROUP_OPEN_SHORTCUT:            [57748, 67748, '照片库-分组-展开快捷分组栏'],
			ALBUM_GROUP_CLICK_SHORTCUT:           [57749, 67749, '照片库-分组-点击快捷分组中的分组'],
			ALBUM_GROUP_DRAG_TO_SHORTCUT:         [57750, 67750, '照片库-分组-拖拽照片到快捷分组栏'],

			// 使用读屏软件
			USE_SCREEN_READER_APPBOX:             [59024, 69024, '通过读屏软件使用微云appbox'],
			USE_SCREEN_READER_WEB:                [59024, 69024, '通过读屏软件使用微云web'],
			/*************************文件二维码****************************************************/
			FILE_QRCODE_RECENT_ITEM:              [57006, 67006, '最近文件-获取二维码'],
			FILE_QRCODE_DISK_ITEM:                [52316, 62316, '网盘-item-获取二维码'],
			FILE_QRCODE_DISK_RIGHT:               [52409, 62409, '网盘-右键-获取二维码'],
			FILE_QRCODE_PHOTO_RIGHT:              [57751, 67751, '图片库-右键-获取二维码'],
			FILE_QRCODE_DOC_RIGHT:                [57734, 67734, '文档库-工具栏-右键-二维码'],
			FILE_QRCODE_DOC_ITEM:                 [57724, 67724, '文档库-item-二维码'],
			FILE_QRCODE_VIDEO_RIGHT:              [57834, 67834, '视频库-工具栏-右键-获取二维码'],
			FILE_QRCODE_VIDEO_ITEM:               [57824, 67824, '视频库-item-获取二维码'],
			FILE_QRCODE_AUDIO_RIGHT:              [57934, 67934, '音乐库-工具栏-右键-获取二维码'],
			FILE_QRCODE_AUDIO_ITEM:               [57924, 67924, '音乐库-item-获取二维码'],
			FILE_QRCODE_SEARCH_RIGHT:             [50516, 60516, '搜索-item-右键-获取二维码'],
			FILE_QRCODE_SEARCH_ITEM:              [50517, 60517, '搜索-item-获取二维码'],

			/***********************上传下载 数据统计常量设置************************************/
			UPLOAD_ACTIONTYPE_ID:                 [6, 6, '文件上传'],  //文件上传
			UPLOAD_PRE_SUBACTIONTYPE_ID:          [601, 601, '上传信令请求'],
			UPLOAD_PRE_THRACTIONTYPE_ID:          [6011, 6011, '文件预上传'],
			UPLOAD_TRANS_SUBACTIONTYPE_ID:        [651, 651, '上传数据'],
			UPLOAD_TRANS_NORMAL_THRACTIONTYPE_ID: [6512, 6512, '文件普通上传'],

			DOWNLOAD_ACTIONTYPE_ID:               [7, 7, '文件下载'],  //下载数据下载
			DOWNLOAD_PRE_SUBACTIONTYPE_ID:        [701, 701, '文件下载请求'],
			DOWNLOAD_PRE_THRACTIONTYPE_ID:        [7011, 7011, '文件下载请求'],
			DOWNLOAD_TRANS_SUBACTIONTYPE_ID:      [751, 751, '文件普通下载'],
			DOWNLOAD_TRANS_THRACTIONTYPE_ID:      [7511, 751, '文件普通下载'],

			/***********************剪贴板************************************/
			CLIPBOARD_SEND_TAB:                   [57301, 57301, '剪贴板-发送消息tab'],
			CLIPBOARD_SEND_SEND_BTN:              [57302, 57302, '剪贴板-发送消息-发送按钮'],
			CLIPBOARD_SEND_CLEAR_BTN:             [57303, 57303, '剪贴板-发送消息-清空按钮'],
			CLIPBOARD_TOAST_COPY_BTN:             [57305, 57305, '剪贴板-toast-复制按钮'],
			CLIPBOARD_RECEIVE_TAB:                [57307, 57307, '剪贴板-接收消息tab'],
			CLIPBOARD_RECEIVE_SHOW_DETAIL:        [57308, 57308, '剪贴板-接收消息列表-查看详情'],
			CLIPBOARD_RECEIVE_CONTEXTMENU_COPY:   [57309, 57309, '剪贴板-接收消息列表-右键-复制'],
			CLIPBOARD_RECEIVE_CONTEXTMENU_DELETE: [57310, 57310, '剪贴板-接收消息列表-右键-删除'],
			CLIPBOARD_RECEIVE_DETAIL_DELETE_BTN:  [57311, 57311, '剪贴板-消息详情-删除按钮'],
			CLIPBOARD_RECEIVE_DETAIL_COPY_BTN:    [57312, 57312, '剪贴板-消息详情-复制按钮'],
			CLIPBOARD_RECEIVE_DETAIL_BACK_BTN:    [57313, 57313, '剪贴板-消息详情-返回按钮'],
            /***********************笔记************************************/
            NOTE_CREATE:                          [58101,68101, '笔记-工具条-新建笔记'],
            NOTE_SHARE:                           [58102,68102, '笔记-工具条-分享'],
            NOTE_DELETE:                          [58103,68103, '笔记 -工具条-删除 '],
            NOTE_REFRESH:                         [58104,68104, '笔记-工具条-刷新'],
            NOTE_CREATE_RIGHT:                    [58119,68119, '笔记-右键-新建笔记'],
            NOTE_SHARE_RIGHT:                     [58120,68120, '笔记-右键-分享'],
            NOTE_DELETE_RIGHT:                    [58121,68121, '笔记-右键-删除'],
            
            /***********************HTTPS使用情况************************************/
            HTTPS_USE:                            [59507, 69507, '用户使用https访问微云']
		},

	// 点击流统计（以number为key，用于通过op数字查找key）
        ops_web_map = {
            /*
             * 9136: active_plugin,
             * 50006: LOGIN_OUT,
             * ...
             */
        },

        ops_appbox_map = {};


    for (var key in click_ops) {
        var cfg = click_ops[key];
        ops_web_map[cfg[0]] = key;
        ops_appbox_map[cfg[1]] = key;
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
                key = (!constants.IS_APPBOX) ? ops_web_map[op_name] : ops_appbox_map[op_name];
                //如果还有key为空，说明是appbox中写死了id，这个时候重新获取下
                if(!key){
                	key = ops_web_map[op_name];
                }
            } else {
                key = op_name;
            }

            if (key && (cfg = click_ops[key])) {
            	if(!constants.IS_APPBOX){
            		return {
	            		key: key,
	                    op: cfg[0],
	                    name: cfg[2]
	            	};
	            }
            	else{
					return {
                    	key: key,
                    	op: cfg[1],
                    	name: cfg[2]
                    };
            	}
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
            DiskUserInfoGet: { m_speed_flags: '7830-4-2-3' },
            // 验证独立密码
            pwd_vry: { oz_op: 9121, m_speed_flags: '7830-4-2-4' },


            // ---- 网盘 ---------------------------------
            // 拉取网盘文件列表
            DiskDirBatchList: { m_speed_flags: '7830-4-1-1' },
            // 外链分享
            create_linker: { oz_op: 9032, m_speed_flags: '7830-4-1-5' },
            // 重命名
            DiskDirAttrModify: { oz_op: 9015, m_speed_flags: '7830-4-1-6' },
            DiskFileBatchRename: { oz_op: 9015, m_speed_flags: '7830-4-1-6' },
            // 新建文件夹
            DiskDirCreate: { oz_op: 9014, m_speed_flags: '7830-4-1-7' },
            // 文件移动
            DiskDirFileBatchMove: { m_speed_flags: '7830-4-1-8' },
            // 文件删除
            DiskDirFileBatchDeleteEx: { m_speed_flags: '7830-4-1-9' },
            //虚拟目录文件批量删除
            VirtualDirBatchItemDelete: { m_speed_flags: '7830-4-1-16' },
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
            clear_share: { m_speed_flags: '7830-4-6-5' },

            //微云直出页面Performance测速
            out_performance: { m_speed_flags: '7830-7-1' }
        },

    // 点击流统计
        click_ops = {

            /************ 导航区（50000-50999）*******************/
            INDEP_PWD: [50002, '导航-独立密码'],
            RECHARGE_QZONE_VIP: [50102, '导航-开通黄钻'],
            LOGIN_OUT: [50006, '导航-退出'],
            HEADER_HELP: [50001, '导航-帮助'],
            HEADER_FANKUI: [50003, '导航-反馈'],
            HEADER_GUANWANG: [50004, '导航-官网'],
            NAV_DISK: [50201, '导航-网盘'],
            NAV_RECYCLE: [50202, '导航-回收站'],
            NAV_PHOTO: [50205, '导航-相册'],
            NAV_RECENT: [50203, '导航-最近文件'],
            NAV_SHARE: [50206, '导航-外链管理'],
            NAV_STATION: [50211, '导航-中转站'],
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
            NAV_NOTE: [50228, '导航-笔记'],
            NAV_ALBUM_REFRESH: [50223, '图片-刷新'],
            NAV_CLIPBOARD: [37304, '导航-剪贴板'],

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
            CLICK_WYSC_LINK: [59044, '微信目录跳转链接'],

            /************ 最近文件*********************************/
            RECENT_DOWNLOAD_BTN: [57001, '最近文件-下载按钮'],
            RECENT_CLICK_ITEM: [57002, '最近文件-item整条点击'],
            RECENT_LOAD_MORE: [57003, '最近文件-加载更多'],

            RECENT_CLEAR: [57004, '最近文件-清空记录	'],
            RECENT_REFRESH: [57005, '最近文件-刷新'],
            /************ 图片预览 ********************************/
            IMAGE_PREVIEW_DOWNLOAD: [52610, '图片预览 - 下载'],
            IMAGE_PREVIEW_REMOVE: [52611, '图片预览 - 删除'],
            IMAGE_PREVIEW_RAW: [52612, '图片预览-查看原图'],
            IMAGE_PREVIEW_NAV_PREV: [52613, '图片预览-左翻页'],
            IMAGE_PREVIEW_NAV_NEXT: [52614, '图片预览-右翻页'],
            IMAGE_PREVIEW_CLOSE: [52615, '图片预览-关闭'],

            IMAGE_PREVIEW_SHARE: [52617,'图片预览-分享'],
            IMAGE_PREVIEW_CODE: [52618,'图片预览-获取二维码'],
            IMAGE_PREVIEW_EXPANSION_UP: [52619,'图片预览-缩略图列表-展开'],
            IMAGE_PREVIEW_EXPANSION_DOWN: [52620,'图片预览-缩略图列表-收起'],
            IMAGE_PREVIEW_THUMB_NEXT: [52621,'图片预览-缩略图列表-左翻页'],
            IMAGE_PREVIEW_THUMB_PREV: [52622,'图片预览-缩略图列表-右翻页'],
            IMAGE_PREVIEW_THUMB_PICK: [52623,'图片预览-缩略图列表-选中图片'],
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
            UPLOAD_NOTE: [52536, '添加-笔记'],
            UPLOAD_UPLOAD_DIR_NO_PLUGIN: [52533, '上传-上传文件夹-未安装控件'],

            UPLOAD_SELECT_FOLDER_NO_FOLDER: [52560, '新上传-选择文件夹-包含子目录'],
            UPLOAD_SELECT_FOLDER_HAS_FOLDER: [52561, '新上传-选择文件夹-不包含子目录'],
            UPLOAD_FOLDER_ERROR_HOVER: [52562, '新上传-选择文件夹-出错时hove详情'],

            /******************  Appbox添加微云到主面板引导页 *************************/
            ADD_WY_TO_APPBOX: [69002, '添加微云到主面板引导页'],      //   利用subop 1 现在添加 2已完成 3暂不添加 4重新添加 5 以后添加 6 确定  7 关闭按钮
            APPBOX_USER_ENV: [69020, '登录appbox的用户环境'],
            WEB_USER_ENV: [69023, '登录WEB的用户环境'],

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
            upload_h5_flash: [9139, 'h5+flash上传'],
            upload_form: [9138, '表单上传'],
            upload_html5: [9140, 'h5表单上传'],
	        upload_html5_pro: [9141, 9141, 'html5极速上传'],
            upload_from_QQClient: [20003, 'qq传文件上传到微云'],
            view_from_QQClient: [20005, 'qq传完文件后，点击“到微云中查看”'],
            download_hijack_check: [405, '下载劫持侦测'],
            webkit_donwload: [515, 'Webkit下载'],
            /****************头部链接广告*********************/
            header_ad_link_web: [69000, 'web头部链接广告'],
            header_ad_link_appbox: [69001, 'appbox头部链接广告'],
            HEADER_OUTER_AD_DOWNLOAD: [59003, '外网头部下载入口'],
            HEADER_OUTER_AD_LIND: [59002, '外网头部广告链接'],
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

            /************************PC客户端下载引导 ************************/
            PC_GUIDE_DOWNLOAD_AD: [59141, '引导安装pc非同步盘-广告图'],
            PC_GUIDE_DOWNLOAD_CLOSE: [59142, '引导安装pc非同步盘-关闭'],

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
            ALBUM_GROUP_DRAG_TO_SHORTCUT:[57750,'照片库-分组-拖拽照片到快捷分组栏'],
            //照片库-分组-拖拽照片到快捷分组栏	57750

            // 使用读屏软件
            USE_SCREEN_READER_APPBOX: [69024, '通过读屏软件使用微云appbox'],
            USE_SCREEN_READER_WEB: [59024, '通过读屏软件使用微云web'],
            /*************************文件二维码*********************************************/
            FILE_QRCODE_RECENT_ITEM:[57006,'最近文件-获取二维码'],
            FILE_QRCODE_DISK_ITEM:[52316,'网盘-item-获取二维码'],
            FILE_QRCODE_DISK_RIGHT:[52406,'网盘-右键-获取二维码'],
            FILE_QRCODE_PHOTO_RIGHT:[57751,'图片库-右键-获取二维码'],
            FILE_QRCODE_DOC_RIGHT:[57734,'文档库-工具栏-右键-二维码'],
            FILE_QRCODE_DOC_ITEM:[57724,'文档库-item-二维码'],
            FILE_QRCODE_VIDEO_RIGHT:[57834,'视频库-工具栏-右键-获取二维码'],
            FILE_QRCODE_VIDEO_ITEM:[57824,'视频库-item-获取二维码'],
            FILE_QRCODE_AUDIO_RIGHT:[57934,'音乐库-工具栏-右键-获取二维码'],
            FILE_QRCODE_AUDIO_ITEM:[57924,'音乐库-item-获取二维码'],
            FILE_QRCODE_SEARCH_RIGHT:[50516,'搜索-item-右键-获取二维码'],
            FILE_QRCODE_SEARCH_ITEM:[50517,'搜索-item-获取二维码'],

            /***********************上传下载 数据统计常量设置************************************/
            UPLOAD_ACTIONTYPE_ID: ['6','文件上传'],  //文件上传
            UPLOAD_PRE_SUBACTIONTYPE_ID:['601','上传信令请求'],
            UPLOAD_PRE_THRACTIONTYPE_ID:['6011','文件预上传'],
            UPLOAD_TRANS_SUBACTIONTYPE_ID:['651','上传数据'],
            UPLOAD_TRANS_NORMAL_THRACTIONTYPE_ID:['6512','文件普通上传'],

            DOWNLOAD_ACTIONTYPE_ID: ['7','文件下载'],  //下载数据下载
            DOWNLOAD_PRE_SUBACTIONTYPE_ID:['701','文件下载请求'],
            DOWNLOAD_PRE_THRACTIONTYPE_ID:['7011','文件下载请求'],
            DOWNLOAD_TRANS_SUBACTIONTYPE_ID:['751','文件普通下载'],
            DOWNLOAD_TRANS_THRACTIONTYPE_ID:['7511','文件普通下载'],

            /***********************剪贴板************************************/
            CLIPBOARD_SEND_TAB: [57301, '剪贴板-发送消息tab'],
            CLIPBOARD_SEND_SEND_BTN: [57302, '剪贴板-发送消息-发送按钮'],
            CLIPBOARD_SEND_CLEAR_BTN: [57303, '剪贴板-发送消息-清空按钮'],
            CLIPBOARD_TOAST_COPY_BTN: [57305, '剪贴板-toast-复制按钮'],
            CLIPBOARD_RECEIVE_TAB: [57307, '剪贴板-接收消息tab'],
            CLIPBOARD_RECEIVE_SHOW_DETAIL: [57308, '剪贴板-接收消息列表-查看详情'],
            CLIPBOARD_RECEIVE_CONTEXTMENU_COPY: [57309, '剪贴板-接收消息列表-右键-复制'],
            CLIPBOARD_RECEIVE_CONTEXTMENU_DELETE: [57310, '剪贴板-接收消息列表-右键-删除'],
            CLIPBOARD_RECEIVE_DETAIL_DELETE_BTN: [57311, '剪贴板-消息详情-删除按钮'],
            CLIPBOARD_RECEIVE_DETAIL_COPY_BTN: [57312, '剪贴板-消息详情-复制按钮'],
            CLIPBOARD_RECEIVE_DETAIL_BACK_BTN: [57313, '剪贴板-消息详情-返回按钮'],
            /***********************笔记************************************/
            NOTE_CREATE: [58101, '笔记-工具条-新建笔记'],
            NOTE_SHARE: [58102, '笔记-工具条-分享'],
            NOTE_DELETE: [58103, '笔记 -工具条-删除 '],
            NOTE_REFRESH: [58104, '笔记-工具条-刷新'],
            NOTE_CREATE_RIGHT: [58119, '笔记-右键-新建笔记'],
            NOTE_SHARE_RIGHT: [58120, '笔记-右键-分享'],
            NOTE_DELETE_RIGHT: [58121, '笔记-右键-删除'] ,

            /***********************HTTPS使用情况************************************/
            HTTPS_USE: [59507, '用户使用https访问微云']
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
 * 测速相关配置
 * @author hibincheng
 * @date 2014-12-29
 *
 */
define.pack("./configs.speed_config",[],function(require, exports, module) {

    var conf = {
        'SHARE_PAGE': {
            __flags: '7830-9-2',
            __performance: '7830-9-1',
            NODE: 1,
            CSS: 2,
            VIEW: 3,
            JS: 4,
            COMPLATE: 5

        },
        'TEST' : '7830-4-5-3'
    }

    return {
        get: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__flags'];
        },
        get_perf_flag: function(name) {
            var ns = name.split('.');
            if(ns.length > 1) {
                return conf[ns[0]][ns[1]];
            }
            return typeof conf[name] === 'string' ? conf[name] : conf[name]['__performance'];
        }
    }
});/**
 * 一些常量
 * @jameszuo 12-12-19 下午12:45
 */
/*global global,Buffer*/
define.pack("./constants",["lib","$","./util.os","./util.browser"],function (require, exports, module) {

    var
        lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),

        win = window;

    var OS_TYPES = {
//      WEB : 4,
        WEB: 30013,
//      APPBOX : 7,
        APPBOX: 30012,
        QQ: 9,
        QZONE: 30225,
        QZONE_IC: 30321,
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
        IS_APPBOX = /([\?&\/]appbox\b|is_appbox=(1|true))/i.test(win.location.href),
    // 是否开发模式
        IS_DEBUG = !!win.IS_DEBUG || location.search.indexOf('__debug__') > -1,
    // 是否是PHP直出
        IS_PHP_OUTPUT = !!win.IS_PHP_OUTPUT,
    // 是否是QQ空间应用
        IS_QZONE = !!win.IS_QZONE,
        IS_QZONE_IC = IS_QZONE && /([\?&\/]s=ic)/i.test(win.location.search),
    // 是否嵌入到其它网站中，例如qzone、q+之类，域名非weiyun
        IS_WRAPPED = IS_QZONE,
    // webkit内核的appbox
        IS_WEBKIT_APPBOX = IS_APPBOX && $.browser.webkit,
    // http协议类型
        HTTP_PROTOCOL = win.location.protocol,
    // 是否使用https协议
        IS_HTTPS = HTTP_PROTOCOL === 'https:',
	// 是否微云域
	    IS_WEIYUN_DOMAIN = location.hostname.indexOf('www.weiyun.com') > -1,
    //是否是旧版本，这里先设置为true, 测试和灰度的时候再改回来
	    IS_OLD = IS_APPBOX || (win.g_login_user_rsp_body && win.g_login_user_rsp_body.is_old) || IS_QZONE ||  !IS_WEIYUN_DOMAIN,

    // APPID
        APPID = IS_APPBOX ? OS_TYPES.APPBOX : (IS_QZONE ? (IS_QZONE_IC ? OS_TYPES.QZONE_IC : OS_TYPES.QZONE) : OS_TYPES.WEB),

    //AID，支付用
        AID = win.AID || 'web_vip_center',

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
            DEFAULT: 500*MB_1,
            XLS: 500*MB_1
        },

        BASE_VERIFY_CODE_URL = HTTP_PROTOCOL + '//captcha.weiyun.com/getimage?aid=543009514&',//验证码系统url,使用时请加个随机数（Math.random()）来确保每次都是新的

        undefined;

    return {

        // 主域名
        MAIN_DOMAIN: 'weiyun.com',

        // 域名
        DOMAIN: HTTP_PROTOCOL + '//www.weiyun.com',

        IS_APPBOX: IS_APPBOX,
        IS_QZONE: IS_QZONE,
        IS_DEBUG: IS_DEBUG,
        IS_WRAPPED: IS_WRAPPED,
        IS_WEBKIT_APPBOX: IS_WEBKIT_APPBOX,
        IS_PHP_OUTPUT: IS_PHP_OUTPUT,
        IS_HTTPS: IS_HTTPS,
        IS_OLD: IS_OLD,

        APPID: APPID,
        AID: AID,
        UI_VER: UI_VER,
        DEVICE_ID: '' + (+new Date), //每次进入微云后，以当前时间戳作为device_id
        HTTP_PROTOCOL: HTTP_PROTOCOL,
        HTTPS_PORT: 443,

        OS_TYPES: OS_TYPES,
        OS_NAME: os_name,
        IS_MAC: os_name === 'mac',
        IS_WINDOWS: os_name === 'windows',

        BROWSER_NAME: browser_name,
        RESOURCE_BASE: HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box',

        MB_1: MB_1,

        //上传到相册的路径
        UPLOAD_DIR_PHOTO: -1,

        //上传文件夹最大层级
        UPLOAD_FOLDER_LEVEL: 25,
        //上传文件夹时最大的目录数
        UPLOAD_FOLDER_DIR_NUM: 200,
        //上传文件夹时最大的文件数
        UPLOAD_FOLDER_MAX_FILE_NUM: 10000,

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
                name: '微信',
                id: '5d37aaaef344b3e67fe406f7',
                children: {
                    msg: {
                        name: '文字语音',
                        id: '40281299baef0847a3086540',
                        types: [VIRTUAL_DIR_TYPES.Text, VIRTUAL_DIR_TYPES.Audio]
                    },
                    photo: {
                        name: '视频图片',
                        id: '32af48ea56dc0d0eb4df0ef0',
                        types: [VIRTUAL_DIR_TYPES.Image, VIRTUAL_DIR_TYPES.Video]
                    },
                    article: {
                        name: '文章',
                        id: '97afabcf7418883b2a70b95e',
                        types: [VIRTUAL_DIR_TYPES.Article]
                    }
                }
            },
            qqnews: {
                name: '腾讯新闻',
                id: 'd0f6974443cf31d41cba4a9a',
                children: {
                    photo: {
                        name: '图片',
                        id: 'ba4b1194e19cfa3e7c48ff4f',
                        types: [VIRTUAL_DIR_TYPES.Image]
                    }
                }
            },
            qqmail: {
                name: 'QQ邮箱',
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
        //web最大下载的文件大小，超出则呼起pc来下载
        FILE_DOWNLOAD_LIMIT: 1024 * 1024 * 1024,
        // 邮件分享文件个数上限
        MAIL_SHARE_LIMIT: 1,
        // CGI2.0批量删除上限
        CGI2_DISK_BATCH_LIMIT: 30000,
        // CGI2.0批量拉网盘目录最大个数
        CGI2_DISK_LIST_PER_LIMIT: 500,
        // 回收站CGI2.0拉取列表首屏个数、批量删除上限
        CGI2_RECYCLE_LIST_LIMIT: 500,

        BASE_VERIFY_CODE_URL: BASE_VERIFY_CODE_URL,

        GET_QZONE_VIP_URL: 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml?n%3D12%26c%3Dxxjzghh%2Cxxjzgw%26aid%3Dweiyun%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month',

        GET_WEIYUN_VIP_URL: 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com/?'

};
});/**
 * 框选功能
 * 需注意的是，框选功能开启时，View必须要有record_dom_map_perfix、scroller配置
 * @author cluezhang
 * @date 2013-11-29
 */
define.pack("./dataview.Box_selection_plugin",["lib","./ui.SelectBox","./global.global_event","./dataview.Multi_selection_plugin","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        SelectBox = require('./ui.SelectBox'),
	    global_event = require('./global.global_event'),
        
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
	        this.listenTo(global_event, 'manage_toggle', this._toggle_box_select_state);
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
            // fix bug，原本是直接覆盖shortcuts，但shortcuts为对象，所以可能会影响到多个实例（库分类就是这样）
            // 正确的做法是新建一个对象
//            $.extend(view.shortcuts, addition_shortcuts);
            view.shortcuts = $.extend({}, view.shortcuts, addition_shortcuts);
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
	    _toggle_box_select_state: function(state) {
		    if(state === 'show') {
			    this._disable_box_selection();
		    } else if(state === 'hide') {
			    this._refresh_box_select_state();
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
                    keep_on: function($tar) {
                        return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                    },
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
define.pack("./dataview.Multi_selection_plugin",["lib","./constants","$"],function(require, exports, module){
    var lib = require('lib'),
        constants = require('./constants'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {String} checkbox_selector
         */
        checkbox_selector : (constants.IS_OLD || constants.IS_APPBOX)? '.checkbox' : '.j-icon-checkbox',
        /**
         * @cfg {String} item_selected_class 当记录选中时，增加什么样式
         */
        item_selected_class : (constants.IS_OLD || constants.IS_APPBOX)? 'ui-selected' : 'act',
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
            // 如果按了shift，表示区域选择
            if (e.shiftKey) {
                range_select = true;
                directly_click = false;
            } else { // 选中操作记录当前操作的记录
                if(!record.get("selected")){
                    this.last_click_record = record;
                }

            }
            // 如果点了checkbox、按了ctrl、shift、meta键，当作选择处理
            // 如果都不是，则触发before_select_click事件，如果返回为非false才进行后续选择，以便视图实现直接点击打开、展开等逻辑
            if (!directly_click || this.trigger('before_select_click', record, e) !== false) {
                this.select(record, clear_selection, range_select);
            }
            //  如果按了shift  选中操作结束以后再记录当前的操作记录
            if(e.shiftKey){
                this.last_click_record = record;
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
 * 网络系统配置，对应的配置字段请看PB协议中的“cloud_config/cloud_config_client.proto”文件
 * @author hibincheng
 * @date 2014-08-14
 */
define.pack("./disk_config",["lib","$","./request","./query_user"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        request = require('./request'),
        query_user = require('./query_user'),

        DEFAULT_CGI = 'http://web2.cgi.weiyun.com/cloud_config.fcg',
        disk_config = {},
        is_loaded = false,
        undefined;

    function load() {
        query_user.on_ready(function(user) {
            request.xhr_get({
                url: DEFAULT_CGI,
                cmd: 'DiskConfigGet',
                pb_v2: true
            }).ok(function(msg, body) {
                disk_config = $.extend(body);
            }).done(function() {
                is_loaded = true;
            });
        });
    }

    /**
     * 支持'.'号获取多级配置项，如'user_info.is_stained'
     * @param key
     * @returns {{}}
     */
    function get(key) {
        var keys = key.split('.'),
            config = disk_config;

        for(var i= 0, l=keys.length; i < l; i++) {
            config = config[keys[i]];
            if(!config) {
                return;
            }
        }

        return config;
    }

    //对外api
    return {
        load: load,
        get: get
    };
});/**
 * 文件类
 *  @author jameszuo
 *  @date 13-1-16
 */

define.pack("./file.file_object",["$","lib","./constants","./file.file_type_map"],function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),


        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('file_object'),
        text = lib.get('./text'),
        covert = lib.get('./covert'),
        date_time = lib.get('./date_time'),

        constants = require('./constants'),

    // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
    // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1, pic: 1 },
    // 可预览的文档类型
        EXT_PREVIEW_DOC_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, rtf: 1, wps: 1/*, ppt: 1, pptx: 1*/, pdf: 1, txt: 1, text: 1 },
    // 视频文档类型
        EXT_VIDEO_TYPES = { video: 1, swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },

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
	    if(props.ext_info && (props.ext_info.thumb_url || props.ext_info.https_url)) {
		    me.set_thumb_url(props.ext_info.thumb_url, props.ext_info.https_url);
            me.set_long_time(props.ext_info.long_time);
	    }

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
	    // 只读属性:是否种子文件
	    is_torrent_file: function () {
		    return this._is_torrent;
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
	    get_thumb_url: function (size, order) {
		    if(order == 'http') {
			    return this._thumb_url;
		    } else if(order == 'https') {
			    return this._https_url;
		    } else {
			    return constants.IS_HTTPS ? this._https_url : this._thumb_url;
		    }
	    },
        //获取视频url，这里字段跟图片一样，但没有区分https
        get_video_thumb_url: function(size) {
            if(!this.is_video() || !this.get_thumb_url(size, 'http')) {
                return '';
            } else {
                //兼容https
                var thumb_url = this.get_thumb_url(size, 'http');
                if(constants.IS_HTTPS && thumb_url.indexOf('https') === -1) {
                    thumb_url = thumb_url.replace('http', 'https');
                }
                return thumb_url + '/' + size;
            }
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
	        var ext = File.get_ext(this._name);
            // 图片类型
            this._is_image = type in EXT_IMAGE_TYPES;
            // 是否可预览的文档
            this._is_preview_doc = type in EXT_PREVIEW_DOC_TYPES;
            // 是否视频
            this._is_video = type in EXT_VIDEO_TYPES;
	        // 是否种子
	        this._is_torrent = ext === 'torrent';
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
            if(typeof create_time === 'number') {
                create_time = date_time.timestamp2date(create_time);
            }
            this._create_time = create_time;
        },
        set_modify_time: function (modify_time) {
            if(typeof modify_time === 'number') {
                modify_time = date_time.timestamp2date(modify_time);
            }
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
	    set_thumb_url: function(thumb_url, https_url) {
		    this._thumb_url = thumb_url;
		    this._https_url = https_url;
	    },
        set_long_time: function(long_time) {
            this._long_time = long_time || '';
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
            return (constants.IS_OLD || constants.IS_APPBOX)? file_type_map.get_folder_type() : file_type_map.get_folder_type_v2();
        } else {
            ext = !is_dir ? File.get_ext(name) : null;
            if (ext) {
                return (constants.IS_OLD || constants.IS_APPBOX)? file_type_map.get_type_by_ext(ext) : file_type_map.get_type_by_ext_v2(ext);
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

        if(bytes === -1){
            return '超过4G';
        }

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
        return error_msg ? (is_dir ? '文件夹' : '文件') + error_msg : undefined;
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
            doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptm'],
            bmp: ['bmp', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'ram', 'ra', 'au'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
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
            docx: ['docx'],
            wps: ['wps'],
            xlsx: ['xlsx'],
            pptx: ['pptx'],
            dps: ['dps'],
            et:  ['et'],
            key: ['key'],
            numbers: ['numbers'],
            pages: ['pages'],
            keynote: ['keynote'],
            mkv: ['mkv'],
            mpg: ['mpg'],
            mpeg: ['mpeg'],
            dat: ['dat'],
            f4a: ['f4a'],
            webm: ['webm'],
            ogg: ['ogg'],
            acc: ['acc'],
            m4a: ['m4a'],
            wave: ['wave'],
            midi: ['midi'],
            ape: ['ape'],
            aac: ['aac'],
            aiff: ['aiff'],
            mid: ['mid'],
            xmf: ['xmf'],
            rtttl: ['rtttl'],
            flac: ['flac'],
            amr: ['amr'],
            ttc: ['ttc'],
            fon: ['fon'],
            dmg: ['dmg'],
            sketch: ['sketch'],
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
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon', 'dmg'
        ];

    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        var sub_types = type_map[_can_ident[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident[sub_types[j]] = 1;
        }
    }



    var defaults_v2 = 'nor',
        folder_type_v2 = 'file',
        type_map_v2 = {
            doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb', 'et'],
            ppt: ['ppt', 'pptx', 'dps', 'pptm'],
            pic: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp', 'bmp', 'exif', 'raw', 'image'],
            video: ['mp4',  'mov', 'mkv', 'mpg', 'mpeg', 'dat', 'f4a', 'webm', 'mod', 'avi', 'mpe', 'mpeg4', 'wmv', 'wmf',
                    'asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'ssa',
                    'rmvb', 'rm', '3gp', '3g2', '3gp2', '3gpp'],
            audio: ['mp3', 'wav', 'wave', 'acc', 'aac', 'aiff', 'amr', 'ape', 'flac', 'm4a', 'mid', 'midi', 'ogg',
                    'rtttl', 'wma', 'ram', 'ra', 'au', 'xmf'],
            flv: ['fla', 'flv', 'swf'],
            zip: ['zip', 'rar', 'tar', 'jar', '7z', 'z', '7-zip', 'ace', 'lzh', 'arj', 'gzip', 'bz2', 'cab', 'compress',
                    'uue', 'iso', 'dmg'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php', 'c', 'cpp', 'h', 'cs', 'plist', 'html', 'htm', 'xml', 'ipe'],
            note: ['note'],
            keynote: ['keynote'],
            ipa: ['ipa'],
            pdf: ['pdf'],
            txt: ['txt', 'text', 'rp', 'document'],
            msg: ['msg', 'oft'],
            apk: ['apk'],
            vsd: ['vsd', 'vsdx'],
            sketch: ['sketch'],
            ps: ['psd', 'psb'],
            ai: ['ai', 'eps', 'svg'],
            numbers: ['numbers'],
            settings: ['asp', 'bak', 'bat', 'exe', 'exec', 'dll', 'xmin', 'log', 'msi', 'old', 'tmp', 'key'],
            help: ['chm' , 'hlp', 'cnt'],
            font: ['ttf', 'opt', 'fon', 'ttc'],
            pages: ['pages'],
            nor: ['unknow', 'srt'],
            file: ['filebroken']
        },
        all_map_v2 = {},
        can_ident_v2 = {},
        _can_ident_v2 = [ // revert to map later
            'doc', 'xls', 'ppt', 'note', 'vsd', 'pages', 'keynote', 'numbers',
            'msg', 'zip', 'pic', 'video', 'flv', 'audio', 'apk', 'pdf', 'txt', 'ipa',
            'settings', 'help', 'ps', 'ai', 'font', 'code'
        ];

    for (var type in type_map_v2) {

        var sub_types = type_map_v2[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map_v2[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident_v2.length; i < l; i++) {
        var sub_types = type_map_v2[_can_ident_v2[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident_v2[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident_v2[sub_types[j]] = 1;
        }
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

        /*
        * 新版UI的文件类型，与旧版不太兼容，这里用v2来区分
        * */
        get_type_by_ext_v2: function (type) {
            return all_map_v2[type] || defaults_v2;
        },
        get_folder_type_v2: function () {
            return folder_type_v2;
        },
        can_identify_v2: function (type) {
            return !!can_ident_v2[type];
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
 * 测速上报华佗系统(huatuo.qq.com)
 * @author iscowei
 * @date 2016-03-17
 *
 * @modified by maplemiao
 * @date 2016-12-22
 */
define.pack("./huatuo_speed",["lib","./constants"],function(require, exports, module) {
    var lib = require('lib');
    var constants = require('./constants');
    var image_loader = lib.get('./image_loader');

    // 测速上报cgi
    // http://tapd.oa.com/mhb/markdown_wikis/#1010084921005723541
    var ht_speed_url = location.protocol + '//report.huatuo.qq.com/report.cgi';
    var cache = {},
        report_appid = 10011,
        sample_rate = 1,    // 采样率100%
        delay_time = 1000;  // 延迟上报1s，获取performance数据

    return new function() {
        // 基准时间
        // 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前
        this.base_time = window.performance && window.performance.timing ? window.performance.timing.fetchStart : 0;

        this.store_point = function(point_key, index, spend_time) {
            var points = cache[point_key] || (cache[point_key] = []);
            points[index] = spend_time;
        };

        this.report = function(point_key, use_performance) {
            var me = this;

            if (!point_key) {
                return ;
            }

            // 延迟以获取performance数据
            setTimeout(function () {
                var points, flags, speed_params;

                points = cache[point_key] || [];
                flags = point_key.split('-');
                speed_params = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2], 'flag5=' + sample_rate];

                // 如果没有自己上报的测速点，那就用performance测速点代替
                // 这里建议都使用performance上报前19个点的数据，自定义测速点从20开始报
                if(window.performance && window.performance.timing && (use_performance || !points.length)) {
                    var perf_data = window.performance.timing;

                    points[ 1 ] = perf_data.unloadEventStart - perf_data.navigationStart;
                    points[ 2 ] = perf_data.unloadEventEnd - perf_data.navigationStart;
                    points[ 3 ] = perf_data.redirectStart;
                    points[ 4 ] = perf_data.redirectEnd;
                    points[ 5 ] = perf_data.fetchStart - me.base_time;
                    points[ 6 ] = perf_data.domainLookupStart - me.base_time;
                    points[ 7 ] = perf_data.domainLookupEnd - me.base_time;
                    points[ 8 ] = perf_data.connectStart - me.base_time;
                    points[ 9 ] = perf_data.connectEnd - me.base_time;
                    points[ 10 ] = perf_data.requestStart - me.base_time;
                    points[ 11 ] = perf_data.responseStart - me.base_time;
                    points[ 12 ] = perf_data.responseEnd - me.base_time;
                    points[ 13 ] = perf_data.domLoading - me.base_time;
                    points[ 14 ] = perf_data.domInteractive - me.base_time;
                    points[ 15 ] = perf_data.domContentLoadedEventStart - me.base_time;
                    points[ 16 ] = perf_data.domContentLoadedEventEnd - me.base_time;
                    points[ 17 ] = perf_data.domComplete - me.base_time;
                    points[ 18 ] = perf_data.loadEventStart - me.base_time;
                    points[ 19 ] = perf_data.loadEventEnd - me.base_time;
                }
                //测速点id开始，如果要测页面的performance则id:1-19为performance测速
                if(points.length) {
                    for(var i = 1, len = points.length; i < len; i++) {
                        speed_params.push(i + '=' + points[i]);
                    }

                    var params = ['appid=' + report_appid, 'speedparams=' + encodeURIComponent(speed_params.join('&'))];

                    // platform
                    switch (constants.OS_NAME) {
                        case 'ipad':
                        case 'iphone':
                            params.push('platform=ios');
                            break;
                        case 'android':
                        case 'windows phone':
                            params.push('platform=android');
                            break;
                        case 'mac':
                        case 'windows':
                        case 'linux':
                        case 'unix':
                            params.push('platform=pc');
                    }

                    image_loader.load(ht_speed_url + '?' + params.join('&'));
                    cache[point_key] = null;
                }
            }, delay_time);
        };
    };
});define.pack("./imgReady",["./util.functional","lib","$"],function (require) {
    var functional = require('./util.functional'),
        console = require('lib').get('./console'),
        $ = require('$');
    var run = {
        list: [],
        intervalId: null,
        tick: function () {
            var list = run.list, i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            }
            if (!list.length) {
                run.stop();
            }
        },
        start: function () {
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (!this.intervalId) {
                this.intervalId = setInterval(this.tick, 40);
            }
        },
        stop: function () {
            this.list = [];
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    };
    /**
     * @param url 路径
     * @param file_id
     * @param {function} ready
     * @param {function} [load]
     * @param {function} error
     */
    var loader = function (url, file_id, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
        img.file_id = file_id;
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        }

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
                ) {
                ready.call(img);
                onready.end = true;
            }
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            load && load.call(img);

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            run.list.push(onready);
            run.start();
        }
    };

    var imgReady = function (o) {
        this.ns = o.ns;
        this.reset();
    };
    $.extend(imgReady.prototype, {
        /**
         * 重置
         */
        reset: function () {
            this.opt = {
                er_handler: function () {
                },
                ok_handler: function () {
                },
                IMG_THUMB_MAP: {//将要显示缩略图
                    length: 0,//总长度
                    CONNECT_NUM: 5,//每次可同时获取img的个数
                    DOING_NUM: 0,//正在获取链接的个数
                    PIPE_CACHE: [],//冗余数据
                    start_pos: 0
                },
                ID_URL_MAP: {}
            };
        },
        /**
         * 初始化
         * @param ok_fn
         * @param er_fn
         */
        render: function (ok_fn, er_fn) {
            this.destroy();
            this.opt.ok_handler = ok_fn;
            this.opt.er_handler = er_fn;
        },
        /**
         * 销毁初始化的信息 和 添加的请求信息
         */
        destroy: function () {
            this.reset();
            run.stop();
        },
        /**
         * 触发加载请求
         */
        start_load: function () {
            this._run_thumb();
        },
        /**
         * 添加将要显示的图片信息
         * @param {String} src 图片地址
         * @param {String} file_id 节点ID
         */
        add_thumb: function (src, file_id) {
            var opt = this.opt;
            opt.IMG_THUMB_MAP.PIPE_CACHE.push(file_id);
            opt.IMG_THUMB_MAP.length += 1;
            opt.ID_URL_MAP[file_id] = src;
        },
        /**
         * 优先加载
         * @param start_id 优先加载的位置起点id
         */
        priority_sort: function (start_id) {
            var opt = this.opt;
            var imap = opt.IMG_THUMB_MAP,
                len = imap.length;
            while (len) {
                len -= 1;
                if ( imap.PIPE_CACHE[len] === start_id ) {
                    imap.start_pos = len;
                    return;
                }
            }
        },
        /**
         * 处理加载结果
         * @param img 克隆img
         * @param file_id 文件id
         * @param is_ok 是否成功
         * @param width 宽度
         * @param height 高度
         * @private
         */
        _process_result: function (img, file_id, is_ok, width, height) {
            var opt = this.opt;
            if (img && img.src) {
                if (is_ok) {
                    opt.ok_handler.call(null, img, file_id, width, height);
                } else {
                    opt.er_handler.call(null, img, file_id);
                }
                opt.IMG_THUMB_MAP.DOING_NUM -= 1;
            }
            this._run_thumb();
        },
        /**
         * to load
         * @private
         */
        _run_thumb: function () {
            var me = this,
                opt = me.opt,
                diff = opt.IMG_THUMB_MAP.CONNECT_NUM - opt.IMG_THUMB_MAP.DOING_NUM;

            if (diff > 0 && opt.IMG_THUMB_MAP.length > 0) {
                var thumb, thumbs = me._batch_load(diff);
                while (thumb = thumbs.shift()) {
                    opt.IMG_THUMB_MAP.DOING_NUM += 1;
                    loader(thumb.url, thumb.id, function () {//ready
                        me._process_result($.clone(this), this.file_id, true, this.width, this.height);
                    }, null, function () {//error
                        me._process_result($.clone(this), this.file_id, false);
                    });
                }
            }
        },
        /**
         * batch load
         * @param _num
         * @returns {Array}
         * @private
         */
        _batch_load: function (_num) {
            var opt = this.opt;
            var map = opt.IMG_THUMB_MAP,
                num = _num,
                thumbs = [];
            if (map.length < num) {
                num = _num = map.length;
            }
            for (; num--; num > 0) {
                if (!map.PIPE_CACHE[map.start_pos]) {
                    map.start_pos = 0;
                }
                var id = map.PIPE_CACHE.splice(map.start_pos, 1)[0],
                    url = opt.ID_URL_MAP[id];
                thumbs.push({
                    'url': url,
                    'id': id
                });
                delete opt.ID_URL_MAP[id];
            }
            map.length -= _num;
            return thumbs;
        }
    });
    return {
        get_instance: function (opt) {
            return new imgReady(opt);
        }
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
 * @author hibincheng
 * @date 13-12-09
 */
define.pack("./init.fix_ie11",["$"],function (require, exports, module) {
    var $ = require('$');

    //IE11 userAgent的MSIE弃用了，改用mozilla，虽然官方认为IE11可以当成标准浏览器看待了，但项目中有使用控件区分IE和其它浏览器、浏览器使用情况数据上报，所以还是要把IE11标识为MSIE
    //version不需要修复，IE11的userAgent表示版本的是rv:正好与mozilla标识相同，也正是IE11当成了Mozilla
    if($.browser.mozilla && window.ActiveXObject !== undefined) {
        $.browser.msie = true;
        delete $.browser.mozilla;
    }
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
define.pack("./init.init",["./init.fix_ie11","./init.prevent_events","./init.prevent_error","./init.default_global_events","./init.fix_ie6","./init.click_tj","./init.enable_repaint","./scr_reader_mode"],function (require, exports, module) {

    return function () {
        //IE11
        require('./init.fix_ie11');

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

        // 启用、关闭读屏支持
        require('./scr_reader_mode').init();
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

    constants.IS_DEBUG || (window.onerror = function (msg, file, line) {
        console.error( msg, file || '', line || '');
        return prevent_error;
    });

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
define.pack("./m_speed",["lib","./constants","./query_user"],function (require, exports, module) {
    var
        lib = require('lib'),
        configs = {},
        action_times = {},
        log_images = {},
        log_image_id_seq = 0,

        console = lib.get('./console').namespace('m_speed'),
        constants = require('./constants'),
        speed_url = constants.IS_HTTPS ? 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi' : 'http://isdspeed.qq.com/cgi-bin/r.cgi';

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
            img.src = speed_url + '?' + args.join('&');
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
        DiskDirBatchListByType          : 2216,     // 根据文件类型获取目录文件列表


	    DiskUserConfigGet               : 2225,     //查询体验券数量
    
    
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
        DiskFileDocDownloadAbs              : 2414,     //获取文件预览
    
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
        DiskFileBatchRename             : 2606,     //批量文件属性修改
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
        DiskRecycleDirFileClear         : 2710,     //批量彻底删除文件
    
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
        LibPageListGet          : 26111,     //按照指令排序方式分页拉取：拍摄时间/字母序/修改时间/上传时间等
        LibGetPicGroup          : 26121,     //获取相册分类中的分组数
        LibCreatePicGroup       : 26122,     //增加相册分组
        LibModPicGroup          : 26123,     //修改相册分组
        LibDeletePicGroup       : 26124,     //删除相册分组(该命令只删除分组，不删除分组下的照片。如果需要删除分组下的照片，用2802命令)
    
        LibGetOneGroupInfo      : 6125,     //获取某一个照片分组下的相关信息：照片数量
        LibGetDelList           : 6126,     //获取所有刪除列表---bice調用
        LibSetGroupCover		: 26127,		//设置组的封面
        LibSetGroupOrder		: 26128,		//设置组的顺序
        LibGetAllFolderInfo     : 6129,      // 获取用户所有目录,给youngky使用
        LibDirList				: 6130,		//拉目录列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleList			: 6131,		//回收站拉列表，用于oz统计:旁路系统使用，终端无需关注
        LibRecycleClear			: 6132,		//清空回收站，用于oz统计:旁路系统使用，终端无需关注
        LibQueryBackupPhoto     : 6133,     //查询某个照片是否备份过：给bice的照片备份server使用:旁路系统使用，终端无需关注
        LibPicBatchQuery        : 6140,     //批量查询一批照片是否已经备份过
    
        //需要转发请求给库Dispatch
        LibBatchMovePicToGroup  : 26201,     //添加相片进分组
        LibBatchFileAddStar     : 6202,     //批量文件加星
        LibBatchFileRemoveStar  : 6203,     //批量取消加星

        //----------------------------库3.0---------------------------------------//
        Lib3DelRecentFileList   : 26300,    ////清空最近文件列表
        Lib3LibSearch           : 224101,   //搜索
        LibDirPathGet           : 26150,    //获取目录全路径
        LibImageTagGet          : 26350,     //拉取所有标签
        LibTagFileListPageGet   : 26352,//分页拉取标签下的文件。

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
        OidbGetQQVipInfo                : 10030,    //获取QQ会员超级会员信息
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
        WeiyunSharePartDownload : 12023,
	    WeiyunShareBatchDownload: 12024,
        WeiyunSharePartSaveData : 12025,
        WeiyunShareDocAbs       : 12030,    //外链文件预览请求
        WeiyunShareTraceInfo    : 12033,    //分享链接下载查看名单查询

        WeiyunSharePwdView      : 12010,
        WeiyunSharePwdVerify    : 12011,
        WeiyunSharePwdCreate    : 12012,
        WeiyunSharePwdModify    : 12013,
        WeiyunSharePwdDelete    : 12014,
        WeiyunShareDirList      : 12031,
        WeiyunShareNoteView     : 12032,
    
        //剪贴板模块：范围13001--14000
        ClipBoardUpload         : 13001,    //上传一条剪贴板消息到云端
        ClipBoardDownload       : 13002,    //从云端下载剪贴板消息
        ClipBoardDelete         : 13003,    //从云端删除一条剪贴板消息
        ClipBoardTrans          : 13010,    //web端呼起pc端传递的待下载的文件列表和目录列表
        ClipBoardView           : 13020,    //pc端获取web端传递的文件列表和目录列表
    
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
        NotePageListGet         : 14031,    //web侧拉取笔记，采用mtime排序
    
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
    
        WxQueryProductInfo      : 220501,   //查询商品信息

        SmsSend                 : 243500,   //发短信

        //=============================以下为文件中转站====================================
        TemporaryFileDiskUserInfoGet                : 242201,     //
        TemporaryFileDiskFileBatchQuery             : 242206,     // 批量文件查询
        TemporaryFileDiskDirList					: 242208,     // 拉取文件列表
        TemporaryFileDiskFileUpload                 : 242301,     // 文件上传请求
        TemporaryFileDiskFileBatchDownload          : 242402,     // 批量文件下载(缩略图短链)
        TemporaryFileDiskFilePackageDownload        : 242403,     // 打包下载
        TemporaryFileDiskDirFileBatchDeleteEx		: 242509,     // 批量目录文件删除(同一个目录下)
        TemporaryFileDiskFileBatchRename            : 242606,     // 批量文件属性修改
        TemporaryFileExpiredInfoGet                 : 242901,     // 查询中转站过期信息

	    //=============================离线下载====================================
	    OdAddBtFileInWeiyun                         : 28208,     // 添加微云里面的种子文件
	    OdAddBtTorrentFile                          : 28209,     // 添加bt种子文件
	    OdAddBtTask					                : 28210,     // 添加bt任务
	    OdAddUrlTask                                : 28211,     // 添加url任务
	    OdGetTaskList                               : 28220,     // 拉取任务列表
	    OdDelTaskItem                               : 28221,     // 删除任务
	    OdClearTaskList		                        : 28222,     // 清空任务列表
	    OdContinueTask                              : 28230      // 继续任务
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

define.pack("./query_user",["lib","$","./constants","./request","./global.global_event"],function (require, exports, module) {

    var lib = require('lib'),


        $ = require('$'),
        console = lib.get('./console'),
        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        cur_url = lib.get('./url_parser').get_cur_url(),
        covert = lib.get('./covert'),


        constants = require('./constants'),
        request = require('./request'),
        session_event = require('./global.global_event').namespace('session'),

	    local_skey,  //第一次进入的skey, 用来请求CGI时附加在header上供后台校验多个帐号通过appbox跳web时的登录态.
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
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/qdisk_get.fcg',

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
	            local_skey = cached_user.get_skey();
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

                var req_body = reset_tip_status ? {
                    show_migrate_favorites: true,
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true,
                    is_get_upload_flow_flag: true
                } : {
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true,
                    is_get_upload_flow_flag: true
                };
                loading_request = request.xhr_get({  // james 2013-6-5 请求有可能因UIN变化而未发出
                    url: REQUEST_CGI,
                    cmd: 'DiskUserInfoGet',
                    cavil: cavil,
                    pb_v2: true,
                    change_local_uin: change_local_uin,
                    body: req_body
                })
                    .ok(function (msg, body, header) {
                        if(body['is_pwd_open'] && !me.check_indep_cookie()) { //开启了独立密码，但没有进行独立密码验证
                            session_event.trigger('invalid_indep_pwd', null, body);
                           // !silent && query_user.trigger('error', msg, 1031); //pb2.0前使用的是1031错误码
                            return;
                        }

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
            request.xhr_get({
                url: REQUEST_CGI,
                cmd: 'DiskUserInfoGet',
                cavil: true,
                pb_v2: true
            })
                .ok(function () {
                    def.resolve();
                })
                .fail(function () {
                    def.reject();
                });
            return def;
        },

        check_indep_cookie: function() {
            var indep = cookie.get('indep');
            return indep ? true : false;
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

    //微信登录态
    query_user.get_wx_ticket = function () {
        return cookie.get('wx_login_ticket');
    };

    // 获取当前登录用户的clientskey
    query_user.get_client_skey = function () {
        console.warn('query_user.get_client_skey() 尚未验证');
        return cur_url.get_param('clientuin'); // todo 验证
    };

    // 获取无前缀的用户uin
    query_user.get_uin_num = function () {
        if(cached_user) {
            return cached_user.get_uin();
        }
        return parseInt(this.get_uin().replace(/^[oO0]*/, '')) || '';
    };

    //判断用户是否是alpha用户
    query_user.is_alpha_user = function() {
        if(cached_user) {
            return cached_user.is_alpha_user();
        }
        return false;
    };
    
    // 获取uin的hex代码
    query_user.get_uin_hex = function(){
        var uin = query_user.get_uin_num() || 0;
        var hex = uin.toString(16);
        // 补到8位
        if(hex.length < 8) {
            hex = new Array(8-hex.length+1).join('0') + hex;
        }
        // 用字节序
        return hex.match(/../g).reverse().join('');
    };

    // 清除用户的登录态
    query_user.destroy = function () {
        var cookie_options = {
            domain: constants.MAIN_DOMAIN,
            path: '/'
        };
        $.each(['skey', 'uin', 'clientuin', 'wx_login_ticket', 'p_skey', 'indep','lskey', 'wy_uf', 'openid', 'key_type', 'access_token', 'p_uin', 'wy_appid'], function (i, key) {
            cookie.unset(key, cookie_options);
        });

        return true;
    };

    query_user.check_cookie = function () {
        return !!(this.get_uin() && this.get_skey() || this.get_wx_ticket());
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

    query_user.get_local_skey = function () {
        return local_skey;
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

    // 灰度代码 - 判断是否使用 cgi2.0
    query_user.is_use_cgiv2 = function () {
        return true;
    };

    // james: 修复UIN不是一个有效的值时（如abc），服务端返回1014的问题
    /*if (typeof query_user.get_uin_num() !== 'number') {
        query_user.destroy();
    }*/

    var User = function (uin, data) {
        this._uin = uin || query_user.get_uin_num() || data.uin; //因安全问题，uin不在包体返回了
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
        // 是否启用用户独立密码
        has_pwd: function () {
            return this._d['is_pwd_open'] === true;
        },
        set_has_pwd: function (has) {
            this._d['is_pwd_open'] = has ? true : false;
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
        //文件批量下载最大数量
        get_files_download_count_limit: function () {
            return this._get_int('max_batch_file_download_number', 10);
        },
        get_files_remove_step_size: function () {
            return Math.min(this._get_int('max_batch_file_delete_number'), this._get_int('max_batch_dir_delete_number'));
        },
        get_files_move_step_size: function () {
            return Math.min(this._get_int('max_batch_file_move_number'), this._get_int('max_batch_dir_move_number'));
        },
        get_rec_restore_step_size: function () {
            return Math.min(this._get_int('max_batch_file_restore_number'), this._get_int('max_batch_dir_restore_number'));
        },
        //文件批量从回收站清除最大数量
        get_rec_shred_step_size: function () {
            return Math.min(this._get_int('max_batch_file_clear_number'), this._get_int('max_batch_dir_clear_number'));
        },
        get_files_packpage_download_size: function() {
            return Math.min(this._get_int('max_batch_dir_package_download_number'), this._get_int('max_batch_file_package_download_number'));
        },
        //最大索引(包括文件和目录)条数
        get_MaxFileAndFolderCnt: function () {
            return this._get_int('max_index_number', 65534);
        },
        //用户目录总数
        get_dir_count: function () {
            return this._d['dir_total']
        },
        //单层目录下最大索引(包括文件和目录)数
        get_dir_level_max: function () {
            return this._d['max_index_number_per_level']
        },
        //用户文件总数
        get_file_count: function () {
            return this._d['file_total']
        },
        //文件名称最大长度，字为单位
        get_filename_max_len: function () {
            return this._get_int('max_filename_length');
        },
        //目录名称最大长度，字为单位
        get_filepath_max_len: function () {
            return this._get_int('max_dir_name_length');
        },
	    //上传文件夹最大层级
	    get_dir_layer_max_number: function () {
		    return this._get_int('max_dir_layer_number');
	    },
        //没使用
        get_get_timestamp_interval: function () {
            return this._d['get_timestamp_interval']
        },
        //没使用
        get_getlist_timestamp_flag: function () {
            return this._d['getlist_timestamp_flag']
        },
        //用户根目录key
        get_root_key: function () {
            return this._d['root_dir_key'] || ''
        },
        //用户主目录key
        get_main_key: function () {
            return this._d['main_dir_key'] || ''
        },
        //用户主目录key
        get_main_dir_key: function () {
            return this._d['main_dir_key'] || ''
        },
        get_main_dir_name: function () {
            return this._d['main_dir_name'] || '微云'
        },
        //没用到
        get_max_batch_dirs: function () {
            return this._d['max_batch_dirs']
        },
        //没用到
        get_max_cur_dir_file: function () {
            return this._d['max_cur_dir_file']
        },
        //没用到
        get_max_dir_file: function () {
            return this._d['max_dir_file']
        },
        //没用到
        get_max_dl_tasks: function () {
            return this._d['max_dl_tasks']
        },
        //没用到
        get_max_dts: function () {
            return this._d['max_dts']
        },
        //没用到
        get_max_fz: function () {
            return this._d['max_fz']
        },
        //单层目录下最大索引(包括文件和目录)数
        get_max_indexs_per_dir: function () {
            return this._d['max_index_number_per_level']
        },
        //没用到
        get_max_interval_getlist: function () {
            return this._d['max_interval_getlist']
        },
        //没用到
        get_max_note_len: function () {
            return this._get_int('max_note_len');
        },
        //没用到
        get_max_retry: function () {
            return this._d['max_retry']
        },
        //没用到
        get_max_retry_interval: function () {
            return this._d['max_retry_interval']
        },
        //单个文件大小限制,单位为字节
        get_max_single_file_size: function () {
            return this._d['max_single_file_size']
        },
	    //当日剩余上传流量
	    get_remain_flow_size: function () {
		    return typeof this._d['remain_flow_size'] === 'undefined' ? this._d['max_single_file_size'] : this._d['remain_flow_size'];
	    },
	    set_remain_flow_size: function (size) {
		    this._d['remain_flow_size'] = size;
	    },
        //没用到
        get_max_tasks: function () {
            return this._d['max_tasks']
        },
        //没用到
        get_max_thread_getlist: function () {
            return this._d['max_thread_getlist']
        },
        //没用到
        get_max_ul_tasks: function () {
            return this._d['max_ul_tasks']
        },
        //没用到
        get_pic_key: function () {
            return this._d['photo_key']
        },
        //没用到
        get_qdisk_psw: function () {
            return this._d['qdisk_psw']
        },
        //没用到
        get_stat_flag: function () {
            return this._d['stat_flag']
        },
        //没用到
        get_stat_interval: function () {
            return this._d['stat_interval']
        },
        //用户总空间 单位为字节
        get_total_space: function () {
            return parseInt(this._d['total_space']);
        },
        //用户已用空间，单位为字节
        get_used_space: function () {
            // 已使用的空间可能会大于空间上限, 这里fix一下  @jameszuo
            // james, 你好, 这里又被产品打回了，要显示实际的大小. @svenzeng
            //return Math.min(this._get_int('used_space'), this.get_total_space());
            return this._get_int('used_space');
        },

        //------------使用云配置拉取的数据 s-------------
	    //每日离线下载使用次数
	    get_od_count_per_day: function() {
		    return this._d['Od_count_per_day'];
	    },
        // 非会员用户，回收站有效期天数，固定
        get_recycle_nonvip_tip: function () {
            return this._d['Recycle_nonvip_tip'];
        },
        // 会员用户，回收站有效期天数，非固定
        // 逻辑为：1.用户非会员，那么后台返回最高等级会员的保存天数；2.用户是会员，返回当前用户会员等级对应的保存天数
        get_recycle_vip_tip: function () {
            return this._d['Recycle_vip_tip'];
        },
        //------------使用云配置拉取的数据 e-------------

        get_terminal_info: function() {
            return this._d['terminal_info'];
        },
        get_vip_terminal_info: function() {
            return this._d['vip_terminal_info'];
        },
        //没用到
        get_user_authed: function () {
            return this._d['user_authed']
        },
        //用户创建时间
        get_user_ctime: function () {
            return this._d['user_ctime']
        },
        //用户修改时间
        get_user_mtime: function () {
            return this._d['user_mtime']
        },
        //没用到
        get_user_type: function () {
            return this._d['user_type']
        },
        //没用到
        get_user_wright: function () {
            return this._d['user_wright']
        },
        //没用到
        get_vip_level: function () {
            return this._d['vip_level']
        },
        // 昵称
        get_nickname: function () {
            return this._d['nick_name'];
        },
        // 头像
        get_avatar: function() {
            return this._d['head_img_url'];
        },

        // 判断是否QQ网盘迁移用户
        is_qqdisk_user: function () {
            return !!this._d['is_weiyun_qqdisk_user'];
        },

        // 判断QQ网盘迁移用户是否首次访问微云网盘
        is_qqdisk_user_first_access: function () {
            return !!this._d['is_show_qqdisk_migrate_user'];
        },

        // 判断用户在QQ网盘中是否已设置独立密码
        has_qqdisk_pwd: function () {
            return !!this._d['is_qqdisk_pwd_open'];
        },

        // 判断用户是否是网络收藏夹用户
        is_favorites_user: function () {
            return !!this._d['is_favorites_user'];
        },

        // 判断是否网络收藏夹用户首次访问微云
        is_fav_user_first_access: function () {
            return !!this._d['is_show_migrate_favorites'];
        },

        // 是否已安装手机微云
        is_wy_mobile_user: function () {
            return !!this._d['is_weiyun_mobile_user'];
        },

        // 是否是微云登录用户
        is_weixin_user: function () {
	        var wy_uf = parseInt(cookie.get('wy_uf')) || 0;
            return !!wy_uf;
        },

        //是否alpha用户
        is_alpha_user: function() {
            return !!this._d['is_alpha_user'];
        },

        //是否是微云会员用户
        is_weiyun_vip: function() {
            return this._d['weiyun_vip_info'] && this._d['weiyun_vip_info']['weiyun_vip'];
        },

        //是否是黄钻用户
        is_qzone_vip: function() {
            return this._d['qzone_info'] && this._d['qzone_info']['qzone_vip'];
        },

        is_lib3_user: function() {
            return !!this._d['lib3_trans_flag'];
        },

        _get_int: function (key, defaults) {
            return parseInt(this._d[key]) || defaults || 0;
        },
        /**
         * 下载时需要带上这个码 - james
         * @returns {String}
         */
        get_checksum: function () {
            return this._d['checksum'];
        },
        /**
         * owa支持文档预览的后缀
         * @returns {*}
         */
        get_owa_supported_ext: function() {
            return this._d['owa_supported_ext'];
        },
        /**
         * owa支持文档预览的大小
         * @returns {*}
         */
        get_owa_max_file_size: function() {
            return this._d['owa_max_file_size'];
        },

        get_qzone_info: function() {
            return this._d['qzone_info'] || {};
        },

        get_weiyun_vip_info: function() {
            return this._d['weiyun_vip_info'] || {};
        },

        //流量相关信息
        get_flow_info: function() {
            return this._d['qdisk_flow_info'] || {};
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

        var req = request.xhr_get({
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

        var req = request.xhr_post({
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
 * 微云office预览上报
 * @iscowei 16-01-05 下午16:10
 */
define.pack("./report_invoice",["./query_user","./constants","./util.https_tool"],function (require, exports, module) {
	var query_user = require('./query_user');
	var constants = require('./constants');
    var https_tool = require('./util.https_tool');

	var cgi_url = constants.HTTP_PROTOCOL + '//www.weiyun.com/p/appcenter/write_invoice';
    cgi_url = https_tool.translate_cgi(cgi_url);

    /**
     * 接口负责人：vitoxu
     * 查询方法：http://pengyou.cm.com/ugc_log/，菜单里选“微云office”
     */
    var reportInvoice = function(msg) {
	    var url = cgi_url + '?appid=30&uin=' + query_user.get_uin().replace(/^o0*/, '') + '&msg=' + encodeURIComponent(msg);
        var img = new Image();
        img.src = url;
    };

    return reportInvoice;
});/**
 * 微云前端模调上报
 * @iscowei 15-12-16 下午22:45
 */
define.pack("./report_md",["./constants","./util.https_tool"],function (require, exports, module) {
	var constants = require('./constants');
    var https_tool = require('./util.https_tool');

    var cgi_url = constants.HTTP_PROTOCOL + '//www.weiyun.com/report/md';
    cgi_url = https_tool.translate_cgi(cgi_url);

    /**
     * oz 模调被调上报，注意查询被调而不是主调。
     * 查询方法：m.isd.com的模调页，选被调查询，微云-微云业务-Web接入业务，填被调id和接口id
     * @param {String|Number} to 被调id，在模调系统里建的
     * @param {String|Number} id 接口id，在模调系统里建的
     * @param {String|Number} code 调用结果
     * @param {String|Number} result 0：成功，1:失败，2:逻辑失败
     */
    var reportMD = function(to, id, code, result) {
	    var ext = '';
        if(to && id) {
	        if(code != undefined) {
		        ext += "&code=" + code;
	        }
	        if(result != undefined) {
		        ext += "&type=" + result;
	        }
            var url = cgi_url + "?fromId=204971707&toId=" + to + "&interfaceId=" + id + ext + "&r=" + Math.random();
            var img = new Image();
            img.src = url;
        }
    };

    return reportMD;
});/**
 * 上传下载store.oa.ocm上报
 * @iscowei 16-01-08 下午14:43

	reportStore = common.get('./report_stort'),
	reportStore({
		t_action: 2,
		t_err_code: 0
	});

 */
define.pack("./report_store",["./query_user","./constants","./util.https_tool"],function(require, exports, module) {
	var query_user = require('./query_user');
	var constants = require('./constants');
	var https_tool = require('./util.https_tool');

	var cgi_url = constants.HTTP_PROTOCOL + '//p.store.qq.com/weiyun?op=all';
	cgi_url = https_tool.translate_cgi(cgi_url);

	/*
	 t_terminal	string	iOS,Android	终端类型
	 t_network	int	1：wifi 2：2G 3：3G 4：4G 5：其他	网络类型
	 t_action	int	1：download 2：upload	操作类型
	 t_err_code	int		错误码
	 t_uin	int64		UID
	 t_report_time	int	时间戳，秒	上报时间
	 t_isp	int	0：未知，1：移动，2：联通，3：电信，4：wifi	运营商类型
	 t_province	string		省份
	 t_dns_ip	string		dns解析的IP地址
	 t_client_ip	string		客户端IP地址
	 t_server_ip	string		服务端IP地址
	 t_server_port	int		服务器端口
	 t_ip_srctype	string		ip来源的类型
	 t_platform_name	string		平台系统名称
	 t_platform_ver	string		平台系统版本号
	 t_device_id	string		设备ID号
	 _app_ver	string	3.1.0.800	APP版本号
	 t_idc	string		访问IDC
	 t_referer	string		访问的来源
	 t_flow_id	string		任务ID
	 t_retry_times	int		重试次数
	 t_batch_num	int		批量文件个数
	 t_batch_id	string		批次ID
	 t_total_size	int64	字节	文件大小
	 t_url	string		url地址
	 t_file_name	string		文件名称
	 t_file_id	string		文件ID
	 t_file_size	int64	字节	文件大小
	 t_file_type	int	1：文档 2：照片 3：音频 4：视频 5：其他 	文件格式
	 t_file_md5	string		文件MD5
	 t_file_sha	string		文件SHA
	 t_file_speed	int	KB/s （（sum（t_file_size）- sum（offset））/ sum（t_extend3））	上传下载速度
	 t_file_path	string		文件路径
	 t_wait_time	int	ms	排队时间
	 t_prepare_time	int	ms	直出IP域名解析时间
	 t_conn_time	int	ms	连接耗时
	 t_send_req	int	ms	发送请求的耗时
	 t_recv_rsp	int	ms	收取到首包的耗时
	 t_recv_data	int	ms	接收数据的耗时
	 t_process_time	int	ms	数据处理的耗时
	 t_conn_num	int		链接并发数
	 t_total_delay	int	ms	总的延迟
	 t_flag	int		标志位
	 t_err_msg	string		错误信息
	 t_flash_upload	int	1：秒传 0：非秒传	是否秒传
	 t_flash_upnum	int		命中秒传的个数
	 t_is_compressed	int	1：压缩 0：非压缩	是否压缩
	 t_compressed_size	int	字节	压缩之后的大小
	 t_compressed_delay	int		压缩的延迟
	 t_ctl_packet_delay	int		控制包耗时
	 t_data_packet_dalay	int		数据包耗时
	 t_ack_packet_delay	int		发送数据到第一个进度回包的耗时
	 t_nssel_ipset	string
	 t_nsconn_step	int
	 t_extend1	string	128x128  640x640	缩略图尺寸
	 t_extend2	string	byte	续传offset
	 t_extend3	string	ms	续传耗时
	 */
	var reportStore = function(obj) {
		if(typeof(obj.t_action) == 'undefined' || typeof(obj.t_err_code) == 'undefined') {
			return;
		}

		var data = $.extend({
			't_uin': query_user.get_uin_num(),
			't_report_time': new Date(),
			't_platform_ver': window.navigator.userAgent,
			t_url: window.location.href
		}, obj);

		var conf = {
			url: cgi_url,
			type: 'post',
			data: data,
			contentType: 'text/plain',
			xhrFields: {
				withCredentials : true
			}
		};

		$.ajax(conf).done(function() {
		}).fail(function() {
		});
	};

	return reportStore;
});/**
 * 异步请求
 * @author jameszuo
 * @date 13-3-8
 */
define.pack("./request",["lib","$","./constants","./ret_msgs","./urls","./global.global_event","./cgi_ret_report","./huatuo_speed","./util.https_tool","./tmpl","./configs.ops","./pb_cmds","./query_user","./user_log"],function (require, exports, module) {
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
	    huatuo_speed = require('./huatuo_speed'),
        https_tool = require('./util.https_tool'),

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

	//CGI调用以下cmd时，req_header加上鉴权信息，解决appbox跳web多帐号问题
	    cros_login_cmd_map = {
		    '2301': 1,
		    '2302': 1,
		    '2303': 1,
		    '2305': 1,
		    'DiskFileUpload': 1,
		    'DiskFileContinueUpload': 1,
		    'DiskFileOverWriteUpload': 1,
		    'DiskFileBatchUpload': 1
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
        options.ori_url = options.url;
        options.url = https_tool.translate_cgi(options.url);
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
	        var query_user = require('./query_user');
            var o = this._options,
	            cached_user = query_user.get_cached_user(),
                header = $.isFunction(o.header) ? o.header() : o.header,
                body = $.isFunction(o.body) ? o.body() : (o.body || {}),
                req_body = {},
	            login_info = {},
                data;

	        //鉴权信息
	        if(cros_login_cmd_map[o.cmd]) {
		        if(cached_user.is_weixin_user()) {
			        //微信登录：login_key=wx_login_ticket，login_keytype=1002
			        login_info = {
				        login_key: binToHex(cookie.get('wx_login_ticket') || ''),
				        login_keytype: 1002
			        };
		        } else {
			        //QQ登录：uin=QQ号，login_key=skey，login_keytype=1
			        login_info = {
				        uin: query_user.get_local_uin(),
				        login_key: binToHex(query_user.get_local_skey()),
				        login_keytype: 1
			        };
		        }
	        }

            if(o.pb_v2) {
                header = $.extend({}, default_headers_v2, header, login_info, { cmd: pb_cmds.get(o.cmd) });
                req_body['weiyun.'+o.cmd+'MsgReq_body'] = body;
                body = {
                    ReqMsg_body: req_body
                };
            } else if (o.cgi_v2) {
                header = $.extend({}, default_headers_v2, header, login_info, { cmd: o.cmd });
            } else {
                header = $.extend({}, default_header, header, login_info, {
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
                g_tk: get_g_tk(), //g_tk
                wx_tk: get_wx_tk() //wx_tk
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
                if (cavil && is_sess_timeout) {
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
                reporter.all(me._options.ori_url, cmd, ret, end_time - me.__start_time, is_timeout);
            }, 0);
        },

        /**
         * 检查是否允许发送请求
         * @param {Boolean} [change_local_uin] 默认false
         * @returns {boolean}
         * @private
         */
        _before_start: function (change_local_uin) {
	        var query_user = require('./query_user');

            // 如果允许修改 local_uin，则不检查 uin 是否已变化
            if (change_local_uin === true) {
                return true;
            }

            // 发送请求之前，发现 uin 已变化，则要求登录确认，登录完成后刷新页面
            var me = this,
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
            //var error_data = this.is_abort ? this._def_error_data : this._unknown_error_data;
	        var error_data = this._def_error_data;  //直接提示网络问题，_unknown_error_data的提示太含糊，只会引起投诉
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
                    wx_tk: get_wx_tk(), //wx_tk
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
                    wx_tk: get_wx_tk(), //wx_tk
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
                    wx_tk: get_wx_tk(), //wx_tk
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
                        var retry_cnt = o.re_try;
                        if (me._is_need_retry() && (!http_ok || ret_msgs.is_need_retry(ret))) {
                            setTimeout(function() {
                                me._retry();
                            }, (8/retry_cnt)*1000); //超时重试，时间递增

                            return;
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
                this.speed_report(cmd, time);
            }

            // OZ上报
            this.oz_op_report(cmd, ret);

            // 返回码上报
            this.ret_report(url, cmd, ret, time);
        },

        speed_report: function (cmd, time) {
            // 测速
	        try{
		        var flag = '21254-1-21';
		        huatuo_speed.store_point(flag, 1, time);
		        huatuo_speed.report();
	        } catch(e) {

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

    var _token = function(token) {
        token = token || '';
        var hash = 5381;
        for (var i = 0, len = token.length; i < len; ++i) {
            hash += (hash << 5) + token.charCodeAt(i);
        }
        return hash & 0x7fffffff;
    }

    /**
     * 获取 g_tk
     * @returns {string}
     */
    var get_g_tk = function () {
        var s_key = cookie.get('skey') || '';
        return  _token(s_key);
    };

    /**
     * 获取 wx_tk (采用g_tk相同算法， 后续有必要再对算法修改)
     * @returns {string}
     */
    var get_wx_tk = function () {
        var wx_ticket = cookie.get('wx_login_ticket') || '';
        return  _token(wx_ticket);
    };

    var _rand = function () {
        return 'R' + random.random();
    };

    var _ts = function () {
        return new Date().getTime().toString(32);
    };

	//字符串转16进制
	function binToHex(str) {
		var ar = [];
		for(var i = 0, len = str.length; i < len; i++) {
			ar.push(str.charCodeAt(i).toString(16));
		}
		return ar.join('');
	}

    return request;
});/**
 * 异步请求队列（壳用于批量删除、批量移动、还原回收站文件等类似功能）
 * @author jameszuo
 * @date 13-3-16
 */
define.pack("./request_task",["lib","$","./ret_msgs","./user_log","./request","./configs.ops"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        ret_msgs = require('./ret_msgs'),
        user_log = require('./user_log'),
        request = require('./request'),
        ops = require('./configs.ops'),

        D = Date,

        undefined;


    /**
     * 抽象构造函数
     * @param {String} options.url CGI url
     * @param {Array<File>|Array<FileNode>} options.files 要处理的文件
     * @param {String} options.op in ops 操作名称
     * @param {Array<Number>} options.ok_rets 认为成功的返回码，默认 [0]
     * @param {Number} options.step_size 每次最多处理的个数
     * @param {Function} options.cmd_parser 计算命令字，回调参数(FileNode[] frag_files)
     * @param {Function} options.data_parser 计算请求参数，回调参数(FileNode[] frag_files)
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
        
        // 提取要处理的部分文件
        _pickup_files : function(){
            var me = this,
                options = me.options,
                same_parent = options.same_parent,
                records = me._todo_files,
                todos = [],
                todo_indexes = [],
                is_dir = records[0].is_dir(),
                pdir_key = records[0].get_pid();
            $.each(records, function(index, record){
                if(record.is_dir() === is_dir && (!same_parent ||  record.get_pid() === pdir_key)){
                    todos.push(record);
                    todo_indexes.push(index);
                }
                if(todos.length >= options.step_size){
                    return false;
                }
            });
            // 删除
            todo_indexes = todo_indexes.sort(function(a, b){ return b - a; });
            $.each(todo_indexes, function(i, index){
                records.splice(index, 1);
            });
            
            return todos;
        },

        _step: function () {
            var
                me = this,
                options = me.options,
                step_size = me._step_size,
                todo_files = me._todo_files,
                todo_len = me._todo_files.length,
                org_len = me._org_len,

            // 取出要处理的部分（每次取N个类型(is_dir)相同的文件）
                frag_files = this._pickup_files();

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
                        url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
                        cmd: cmd,
                        body: data,
                        cavil: true
                    };
                if (me.options.url) {
                    post_data.url = me.options.url;
                }
                request.xhr_post(post_data)
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
                this.trigger('part_ok', msg, ok_id_arr, first_err_ret);
            }
            else if (!has_ok && !all_ok) {
                this.trigger('error', msg, first_err_ret);
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

define.pack("./ret_msgs",[],function (require, exports, module) {

    var
        MAP = {
            0: '操作成功',
            404: '连接服务器超时，请稍后再试',
            1000: '出现未知错误',
            1008: '无效的请求命令字',
            1010: false, //'对应目录列表查询请求，代表该目录下的信息未修改，客户端不需要刷新该目录下的本地缓存列表。',
            1012: '系统正在初始化，请稍后再试',
            1013: '存储系统繁忙，请稍后再试',
            1014: '服务器繁忙，请稍后再试',
            1015: '创建用户失败',
            1016: '不存在该用户',
            1017: '无效的请求格式', // 请求包格式解析错误
            1018: false, //'要拉取的目录列表已经是最新的',
            1019: '目录不存在',
            1020: '文件不存在',
            1021: '目录已经存在',
            1022: '文件已经存在',
            1023: '上传地址获取失败', //'上传文件时，索引创建成功，上传地址获取失败，客户端需要发起续传',
            1024: '登录状态超时，请重新登录', // 验证clientkey失败
            1025: '存储系统繁忙，请稍后再试',
            1026: '父目录不存在',
            1027: '无效的目录信息', //不允许在根目录下上传文件
            1028: '目录或文件数超过总限制',
            1029: '单个文件大小超限',
            1030: '签名已经超时，请重新验证独立密码',
            1031: '验证独立密码失败',
            1032: '设置独立密码失败',
            1033: '删除独立密码失败',
            1034: '失败次数过多，独立密码被锁，请稍后再试',
            1035: '独立密码不能与QQ密码相同',
            1051: '该目录下已经存在同名文件',
            1052: '该文件未完整上传，无法下载',
            1053: '剩余空间不足',
            1070: '不能分享超过2G的文件', // 使用批量分享后貌似没有大小限制了，要和@ajianzheng、@bondli 确认下。- james
            1076: '根据相关法律法规和政策，该文件禁止分享',

            1083: '该目录下文件个数已达上限，请清理后再试',
            1086: '网盘文件个数已达上限，请清理后再试',
            1088: '无效的文件名',
            1117: '部分文件或目录不存在，请刷新后再试',
	        1137: '您的登录态已失效，请重新登录',

            3002: '不能对不完整的文件进行该操作',
            3008: '不能对空文件进行该操作',
            4000: '登录状态超时，请重新登录',
            10000: '登录状态超时，请重新登录',
            10408: '该文件已加密，无法下载',

            100001: '参数无效',
            100002: '无效的请求格式', //Json格式无效
            100003: '请求中缺少协议头',
            100004: '请求中缺少协议体',
            100005: '请求中缺少字段',
            100006: '无效的命令',
            100007: '导入数据请求无效',
            100008: '目录的ID长度无效', //'目录的key长度无效',
            100009: '文件的SHA值长度无效',
            100010: '文件的MD5值长度无效',
            100011: '文件的ID长度无效',
            100012: '返回数据过长导致内存不足',
            100016: '指针无效',
            100017: '时间格式无效',
            100019: '输入字段类型无效',
            100027: '无效的文件名',
            100028: '文件已过期',
            100029: '文件超过下载次数限制',
            100030: '收听官方微博失败',
            100031: '用户未开通微博',
            100033: '分享到微博失败',
            100034: '内容中出现脏字、敏感信息',
            100035: '用户限制禁止访问',
            100036: '内容超限',
            100037: '帐号异常',
            100038: '请休息一下吧',
            100039: '请勿重复发表微博',
            100040: '身份验证失败',

            114200: '文件已被删除', // 要分享的资源已被删除
            114201: '文件已损坏',
            114503: '该文件可能存在风险，暂时无法分享',
            190051: '登录状态超时，请重新登录',
            190054: '访问超过频率限制',
            190055: '服务器暂时不可用，请稍后再试',
            199012: '同时操作的目标数量过多', // 例如限定一次删除100个，发送了包含120对象的请求
            190041: '服务器内部错误，请稍后再试',

            //分享链接邮件发送相关错误码
            102033: '参数错误',
            102034: '服务器内部错误',
            102035: '网络错误',
            102501: '非法请求',
            102502: '输入参数错误',
            102503: '非法的用户号码',
            102504: 'QQMail未激活',
            102505: 'skey验证不通过',
            102506: '邮件被拦截',
            102508: '发送频率过高',
            102601: '收件人总数超过限制',
            102602: '邮件大小超过限制',
            102603: '邮件发送失败',
            102037: '超出频率限制，请输入验证码',
            102038: '验证码错误',


            // 库 - 相册
            210009: '分组不存在',
            210010: '不能删除默认分组',
            210011: '分组名不能为空',
            210012: '分组名重复',

            // ------ 2.0 返回码 -------------------------
            190013: '无效的请求，请刷新页面后重试',
            199013: '拒绝访问',
            13004: '操作频率过快，请稍后再试'
        },
        //PB2.0 在此定义公共的错误码( 范围(190000-19900) )
        MAP_NEW = {
            190011     : '无效的QQ号码',
            190012     : '无效的命令字',
            190013     : '请求参数错误',
            190014     : '客户端主动取消,如关闭连接',
            190020     : '组cmem包错误',
            190021     : '解包cmem包错误',
            190030     : '组ptlogin包失败',
            190031     : '组pb协议包失败',
            190032     : '解析pb协议包失败',
            190033     : '解析http协议失败',
            190034     : '解析json协议失败',
            190035     : '解析xml协议失败',
            190036     : 'http状态码非200',
            190039     : '无效的appid',
            190040     : 'UIN在黑名单中',
            190041     : 'Server内部错误',
            190042     : '后端服务器超时',
            190043     : '后端服务器进程不存在',
            190044     : '解析后端回包失败',
            190045     : '获取L5路由失败',
            190046     : '服务器组包失败',
            190047     : '严重错误，必须要引起重视',
            190048     : '无效的APPID',
            190049     : '可能违反互联网法律法规或腾讯服务协议',
            190050     : '会话被强制下线',
            190051     : '验证登录态失败',
            190052     : '用户不在白名单中',
            190053     : '用户在黑名单中',
            190054     : '访问超过频率限制',
            190055     : '服务器临时不可用',
            190056     : 'cmem key不存在',
            190057     : 'cmem key过期',
            190058     : 'cmem 没有数据',
            190059     : 'cmem 设置时cas不匹配',
            190060     : 'cmem 数据有误',
            190061     : '无效的签名类型:请求身份验证凭证类型',
            190062     : '解签名失败',
            190063     : '解密数据失败',
            190064     : '批量操作条目超上限',
            190065     : 'st签名过期，需要终端去换取新的Key',
            190066     : '终端在同步的过程中，需要从头进行一次全量列表拉取',
            190067     : '敏感文字',
            190071     : '链接被对端关闭',
            190072     : '策略限制',


            190201     : '没有JSON头',
            190202     : '没有JSON体',
            190203     : '缺少必要参数',
            190204     : '参数值类型不正确',

            //CGI公共错误码(199001-199999)
            199001     : '回调callback参数异常',
            199002     : 'op_source参数有误',
            199003     : 'dir_key长度无效',
            199004     : '文件sha长度无效',
            199005     : '文件md5长度无效',
            199006     : '',
            199007     : '日志时间格式无效',
            199008     : '域名不对',
            199009     : 'referer有问题',
            199010     : 'token有误',
            199011     : 'fileid长度无效',
            199012     : '某参数超过配置限制',
            199013     : '下载校验失败',
            199014     : '用户请求信息非法',

            //Server的错误码
            1000:   "服务器出错",
            1013:   "存储平台系统繁忙",
            1015:   "在存储平台创建用户失败",
            1016:   "存储平台不存在该用户",
            1018:   "要拉取的目录列表已经是最新的",
            1019:   "目录不存在",
            1020:   "文件不存在",
            1021:   "目录ID已经使用",
            1022:   "文件已传完",
            1026:   "父目录不存",
            1027:   "不允许在根目录下上传文件",
            1028:   "目录或者文件数超过总限制",
            1029:   "单个文件大小超限",
            1051:   "重名错误",
            1052:   "下载未完成上传的文件",
            1053:   "当前上传的文件超过可用空间大小",
            1054:   "不允许删除系统目录",
            1055:   "不允许移动系统目录",
            1056:   "该文件不可移动",
            1057:   "续传时源文件已经发生改变",
            1058:   "删除文件版本冲突",
            1059:   "覆盖文件版本冲突",
            1060:   "禁止查询根目录",
            1061:   "禁止修改根目录属性",
            1062:   "禁止删除根目录",
            1063:   "不能删除非空目录",
            1064:   "禁止拷贝未上传完成文件",
            1065:   "不允许修改系统目录",
            1066:   "原始外链url参数太长，超过了1022字节",
            1067:   "短URL服务错误",
            1068:   "短URL服务来源字段错误",
            1069:   "短URL服务会数据包大小校验失败",
            1070:   "生成外链文件大小不符合规则",
            1073:   "外链失效，下载次数已超过限制",
            1074:   "黑名单校验失败, 其它原因",
            1075:   "黑名单校验失败，没有找到sha",
            1076:   "非法文件，文件在黑名单中",
            1080:   "名字太长",
            1081:   "GET_APP_INFO时带的错误的source值",
            1082:   "修改目录时间戳出错",
            1083:   "目录或者文件数超单个目录限制",
            1084:   "生成vaskey失败",
            1085:   "批量操作不能为空",
            1086:   "批量操作条目超上限",
            1088:   "文件名目录名无效",
            1090:   "无效的MD5",
            1091:   "转存的文件未完成上传",
            1092:   "转存的文件名无效编码",
            1093:   "无效的业务ID",
            1094:   "读取转存文件失败",
            1095:   "转存文件已过期",
            1096:   "设置flag失败",
            1097:   "ftn preuploadblob解码失败",
            1098:   "请求体中的业务号与业务blob中的业务号不一致",
            1099:   "非法的目标业务号",
            1100:   "微云preuploadblob解码失败",
            1101:   "非法的文件前10M MD5",
            1102:   "asn编码失败",
            1103:   "存储存在此用户",
            1110:   "转存到微云的文件名中含有非法字符",
            1111:   "源、目的目录相同目录，不能移动文件",
            1112:   "不允许文件或目录移动到根目录下",
            1113:   "不允许文件复制到根目录下",
            1114:   "移动索引不一致，存储需要修复",
            1115:   "删除文件并发冲突,可以重试解决",
            1116:   "不允许用户在根目录下创建目录",
            1117:   "批量下载中某个目录或文件不存在",
            1118:   "认证签名无效",
            1119:   "目的父目录不存在",
            1120:   "目的父父目录不存在",
            1121:   "源父目录不存在",
            1122:   "目录文件修改名称时，源目的相同",
            1123:   "不允许在根目录下创建目录",
            1124:   "访问旁路系统出错",
            1125:   "黑名单",
            1126:   "非秒传文件太大禁止上传",


            1301:   "微云网盘用户不存在",
            1302:   "QQ网盘用户不存在",

            1901:   "独立密码签名已经超时，需要用户重新输入密码进行验证",
            1902:   "独立密码验证失败",
            1903:   "开通独立密码失败",
            1904:   "删除独立密码失败",
            1905:   "输入过于频繁",
            1906:   "添加的独立密码和QQ密码相同",
            1908:   "独立密码已经存在",
            1909:   "修改密码失败",
            1910:   "新老密码一样",
            1911:   "不存在老密码，请用添加流程",
            1912:   "策略限制",
            1913:   "独立密码验证失败(密码错误)",
            1914:   "失败次数过多,独立密码被锁定",
            1915:   "认证签名无效"

        },

    // Server内部错误，需要重试的码
        NEED_RETRY = {190041: 1, 190042: 1, 190043: 1, 10603: 1},

        NEED_LOGIN = {1024: 1, 10000: 1, 190051: 1, 4000: 1, 190011: 1, 190061: 1 , 190062: 1, 190063: 1, 190065: 1, 190072: 1 },

        UNKNOWN_MSG = '网络错误，请稍后再试',

        undefined;

    var ret_msgs = {

        get: function (code) {
            var msg = MAP[code] || MAP_NEW[code];

            if (msg === false) {
                return '';
            } else {
                return msg || UNKNOWN_MSG;
            }
        },

        is_sess_timeout: function (code) {
            return code in NEED_LOGIN;
        },

        is_indep_invalid: function (code) {
            return code === 1031;
        },

        /**
         * 判断是否是需要重试的错误码
         * @param {Number} code
         * @returns {boolean}
         */
        is_need_retry: function (code) {
            return code in NEED_RETRY;
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

        FILE_NOT_EXIST: 1020, //文件不存在
        ACCESS_FREQUENCY_LIMIT: 13004 // 频率限制
    };

    return ret_msgs;
});
/**
 * 启用更好的读屏软件支持
 * @author jameszuo
 * @date 13-12-10
 */
define.pack("./scr_reader_mode",["lib","$","./user_log","./constants"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),
        store = lib.get('./store'),

        user_log = require('./user_log'),
        constants = require('./constants'),

        re_time = new RegExp('^(\\d{4})\\-(\\d{1,2})\\-(\\d{1,2}) ((\\d{1,2})(:(\\d{1,2})(:\\d{1,2})?)?)?'),
        undef;


    return {
        _enabled: false,
        _store_key: 'screen_reader_mode',
        _inited: false,
        init: function () {
            if (this._inited) return;

            var me = this,
                $start = $('#_aria_start_trigger');

            if (!$start[0]) return;

            me._enabled = !!store.get(me._store_key);

            me._enabled && $(document.documentElement).addClass('screen-reader-mode');

            var $enable_trigger = $('<button type="button" tabindex="0" style="position: fixed;_position:absolute;top:-200px;">如果您使用的' + (me._enabled ? '不是' : '是') + '读屏软件，请点击这里' + (me._enabled ? '关闭' : '启用') + '微云的读屏软件支持.</button>');

            // 如果已启用，则将文字显示出来，防止普通用户不小心启用了该功能。
            me._enabled && ($enable_trigger.text($enable_trigger.attr('title'))[0].style.cssText = 'width:100%;background-color:yellow;border:1px dotted;');

            $start.after($enable_trigger);

            $enable_trigger.on('click', function (e) {
                e.preventDefault();
                me._toggle_enable();
            });

            // 上报
            me._enabled && setTimeout(function () {
                user_log(constants.IS_APPBOX ? 'USE_SCREEN_READER_APPBOX' : 'USE_SCREEN_READER_WEB');
            }, 4000);

            this._inited = 1;
        },

        /**
         * 判断是否已启用更好的读屏软件支持
         * @returns {boolean}
         */
        is_enable: function () {
            return this._enabled;
        },

        /**
         * 中文日期格式，易读
         * @param {String} time
         * @returns {string}
         */
        readable_time: function (time) {
            return  time.replace(re_time, function (m, year, month, day, $2, hour, $3, min) {
                return [year, '年', month, '月', day, '日', hour, '时', min, '分'].join('');
            });
        },

        _toggle_enable: function () {
            var me = this,
                change_to = me._enabled;

            if (me._enabled) {
                if (confirm('确定要关闭微云的读屏软件支持吗？如果您正在通过读屏软件使用微云，那么关闭后部分功能可能无法正常工作。')) {
                    store.remove(me._store_key);
                    change_to = false;
                }
            } else {
                if (confirm('确定要启用微云的读屏软件支持吗？')) {
                    store.set(me._store_key, 1);
                    if (store.get(me._store_key)) {
                        change_to = true;
                    } else {
                        alert('启用读屏软件支持失败，您的浏览器未能支持该特性');
                    }
                }
            }

            // 上报并刷新页面
            if (me._enabled !== change_to) {
                location.reload();
            }
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-26
 * Time: 下午4:24
 * To change this template use File | Settings | File Templates.
 * 41表 数据上报专用方法
 */

define.pack("./stat_log",["lib","$","./constants","./query_user","./urls","./configs.ops","./configs.new_ops","./util.https_tool","./util.logger"],function (require, exports, module) {
    var
        lib = require('lib'),
        $ = require('$'),
        JSON = lib.get('./json'),
        console = lib.get('./console').namespace('stat_log'),
        image_loader = lib.get('./image_loader'),
        constants = require('./constants'),
        query_user = require('./query_user'),
        urls = require('./urls'),
        ops = require('./configs.ops'),
        new_ops = require('./configs.new_ops'),
        https_tool = require('./util.https_tool'),
        logger = require('./util.logger'),
        undefined;


    var default_headers = {
        cmd: 'stat',
        appid:constants.APPID
    };

    var cgi_url = https_tool.translate_cgi('http://stat.cgi.weiyun.com/stat.fcg');


    /**
     * 用户行为分析数据上报
     * @param {Object} [data]
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     */
    var stat_log = function (data, extra_config) {
        var body = $.extend({
            uin: ''+query_user.get_uin_num()
        }, data);
        stat_log.single_log(extra_config, body);
    };

    /**
     * 日志上报 带extra_config参数
     * @param {Object} [extra_config] 请求头额外的参数，比如指定os_type
     * @param {Object} body req_body内容
     */
    stat_log.single_log = function (extra_config, body) {
        var data_str = JSON.stringify({
            req_header: $.extend({}, default_headers, {
                uin: query_user.get_uin_num()
            }, extra_config),
            req_body:  body
        });
        image_loader.load(urls.make_url(cgi_url, {data: data_str}));
    };

    /**
     * 点击流上报
     */
    stat_log.click_log = function (op_or_name, ret, params, extra_config) {
        var cfg = new_ops.get_op_config(op_or_name), op;
        if (cfg) {
            op = cfg.op;
            console.log('APPID:' + default_headers.appid, op + '>' + cfg.name);
        }
        else {
            if (parseInt(op_or_name) == op_or_name) {
                op = op_or_name;
                console.log('APPID:' + default_headers.appid, op);
            } else {
                console.warn('无效的参数op=' + op_or_name);
                return;
            }
        }

        var req_body = {
            table40: [{
                "actiontype_id": op+"" //这里必须是字符串
            }]
        };
        stat_log( req_body, $.extend({}, extra_config) );
    };

    /**
     * 日志上报 　　预上传　和　上传下载任务结束后的专用方法
     * @param weiyun_version
     * @param Upload      Upload_Class对象
     * @param action_id
     * @param subaction_id
     * @param thraction_id
     */
    stat_log.upload_stat_report_41 = function (Upload, weiyun_version,action_id, subaction_id, thraction_id) {
        //上传下载数据上报
        var actiontype_id, subactiontype_id, thractiontype_id,start_time,end_time,start_file_prcessed= 0,processed=0;
        try {
            //判断是下载任务还是上传任务
            if (!Upload.is_upload()) {
                actiontype_id = 'DOWNLOAD_ACTIONTYPE_ID';
                subactiontype_id = 'DOWNLOAD_TRANS_SUBACTIONTYPE_ID';
                thractiontype_id = 'DOWNLOAD_TRANS_THRACTIONTYPE_ID';
                start_time=Upload.startTime;
            } else {
                actiontype_id = action_id ? action_id : 'UPLOAD_ACTIONTYPE_ID';
                subactiontype_id = subaction_id ? subaction_id : 'UPLOAD_TRANS_SUBACTIONTYPE_ID';
                thractiontype_id = thraction_id ? thraction_id : 'UPLOAD_TRANS_NORMAL_THRACTIONTYPE_ID';
                start_time=Upload.start_time;
            }
            //记录本次传输是从哪个字节开始的。
            if(Upload.start_file_processed && Upload.start_file_processed>0){
                start_file_prcessed = Upload.start_file_processed;
            }
            //计算本次传输的大小。
            if(start_file_prcessed >0 && Upload.processed && Upload.processed>0){
                processed= Upload.processed - start_file_prcessed;
            }else if(Upload.processed && Upload.processed>0){
                processed= Upload.processed
            }
            end_time =+new Date();
            var req_body = {
                table41: [{
                    "weiyun_version": weiyun_version,
                    "actiontype_id": ops.get_op_config(actiontype_id).op,
                    "subactiontype_id": ops.get_op_config(subactiontype_id).op,
                    "thractiontype_id": ops.get_op_config(thractiontype_id).op,
                    "module_id":'1',
                    "result_flag": Upload.log_code ? ''+Upload.log_code:'0',
                    "secondupload_flag": Upload.is_miaoc() ? '1' : '0',
                    "file_name": Upload.file_name,
                    "file_extension": Upload.get_file_type(),
                    "file_id": Upload.file_id,
                    "package_id":Upload.is_package_size?(end_time+''+query_user.get_uin_num()):'',
                    "file_size": ''+Upload.file_size,
                    "file_speed": ''+(1000*processed/(end_time-start_time)),
                    "intext_1": Upload.tp_key? '1':'0',
                    "intext_2": end_time+'',//产生记录的时间戳
                    "intext_3": Upload.processed?Upload.processed+'':'',  //已成功传输的文件大小
                    "intext_13": ''+start_time,
                    "intext_14": end_time+'',
                    "intext_15": Upload.transresult ? (Upload.transresult+''):'0', //transresult属性０成功１暂停3失败,具体可以看维表，该字段在aop_wrap_log里面赋值的．
                    "intext_16": (processed && processed>0) ? processed +'':'',       //本次传输的文件大小
                    "stringext_7":Upload.upload_type+'',
                    "stringext_8":constants.BROWSER_NAME,
                    //"stringext_9": Upload.download_url ? Upload.download_url : '',
                    "op_time": (end_time-start_time)+''
                }]
            };
            stat_log(req_body, {});
            if(Upload.log_code) {
                logger.report({
                    time: (new Date()).toString(),
                    type: Upload.is_upload() ? 'upload' : 'download',
                    upload_type: Upload.upload_type,
                    weiyun_version: weiyun_version,
                    secondupload_flag:  Upload.is_miaoc() ? '1' : '0',
                    file_name: Upload.file_name,
                    file_id: Upload.file_id,
                    file_sha: Upload.file_sha,
                    file_size: ''+Upload.file_size,
                    server_name: Upload.server_name,
                    server_port: Upload.server_port,
                    spend_time: end_time-start_time,
                    ret_code: Upload.log_code,
                    download_url: Upload.download_url ? Upload.download_url : '',
                    msg: Upload._state_log && Upload._state_log.msg
                });
            }
        } catch (e) {

        }
    };
    /**
     * 日志上报 　　预下载专用方法
     * @param download_info
     */
    stat_log.pre_download_stat_report_41= function (download_info) {

        var me = this;
        var actiontype_id, subactiontype_id, thractiontype_id, file_name, file_size = 0, file_ext = '',file_id='';
        try {
            actiontype_id = ops.get_op_config('DOWNLOAD_ACTIONTYPE_ID').op;
            subactiontype_id = ops.get_op_config('DOWNLOAD_PRE_SUBACTIONTYPE_ID').op;
            thractiontype_id = ops.get_op_config('DOWNLOAD_PRE_THRACTIONTYPE_ID').op;


            var req_body = {
                table41: [
                    {
                        "actiontype_id": actiontype_id,
                        "subactiontype_id": subactiontype_id,
                        "thractiontype_id": thractiontype_id,
                        "module_id": '1', //默认 网盘
                        "file_id":download_info.is_package?'':''+download_info.file_id,
                        "file_name": download_info.file_name,
                        "file_extension": download_info.file_ext,
                        "file_size": '' + download_info.file_size,
                        "package_id": download_info.is_package ? (+new Date() + '' + query_user.get_uin_num()):'',
                        "intext_2": +new Date() + '',  //产生记录的时间戳
                        "intext_13": +new Date() + ''  //任务开始时间
                    }
                ]
            };
            stat_log(req_body, {});
            if(download_info.ret_code) {
                logger.report({
                    time: (new Date()).toString(),
                    type: 'pre_download',
                    file_id: download_info.is_package?'':''+download_info.file_id,
                    file_name: download_info.file_name,
                    file_size: '' + download_info.file_size,
                    ret_code: download_info.ret_code
                });
            }
        } catch (e) {

        }
    };

    return stat_log;
});/**
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
                // 使用jQuery的blur，在IE下会触发多次blur事件....
                this.$input[0].blur();
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
define.pack("./ui.SelectBox",["$","lib","./util.functional","./constants"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        console = lib.get('./console').namespace('SelectBox'),
        events = lib.get('./events'),

        functional = require('./util.functional'),
        constants = require('./constants'),

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
             * 是否有复选框
             * @type {Boolean}
             */
            has_checkbox: false,
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
            helper: (constants.IS_OLD || constants.IS_APPBOX)? '<div class="ui-selectable-helper"></div>' : '<div class="mod-selectable-helper"></div>',
            /**
             * 选中的样式
             * @type {String}
             */
            selected_class: (constants.IS_OLD || constants.IS_APPBOX)? 'ui-selected' : 'act',
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
            keep_on_selector: DEFAULT_KEEP_ON,
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
        destroy: function () {
            if (this.destroyed) {
                return;
            }
            this.cancel();
            if (this._enabled) {
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
            var o = this.o, $ck;
            el_ids = typeof el_ids === 'string' ? [el_ids] : el_ids;
            for (var i = 0, l = el_ids.length; i < l; i++) {
                var el_id = el_ids[i];
                if (this._is_selectable(el_id)) {
                    var item = get_by_id(el_id);
                    if (item) {
                        var $item = $(item);
                        $item.toggleClass(this.o.selected_class, is_sel);

                        // 复选框
                        if (o.has_checkbox && ($ck = $item.find(':checkbox')) && $ck[0]) {
                            is_sel ? $ck.attr('checked', 'checked') : $ck.removeAttr('checked');
                        }
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
                //因为disk缩略图模式下，文件夹和文件分布属于不同的父元素，但计算文件的时候，会把文件夹的高度重复算了一次，这里需要把文件夹的高度去掉
                pre_par_height = 0,
                list_par,
                list_xy;

            each_child_nodes($els, function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    if(list_par) {
                        pre_par_height = $(list_par.parentNode).outerHeight() + pre_par_height;
                    }
                    list_par = cell.parentNode;
                    list_xy = me._real_xy(list_par);
                }

                var id = cell.id,
                    $c = $(cell),
                    c_pos = $c.position(),
                    x1 = list_xy.x + c_pos.left,
                    x2 = x1 + $c.width(),
                    y1 = list_xy.y + c_pos.top + scr_y - pre_par_height,
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
 * 新版空页面模块
 * @author xixinhuang
 * @date 16-09-12
 * */
define.pack("./ui.blank_tip",["lib","$","./tmpl","./ui.widgets"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),

        map = {},

        undefined;


    var blank_tip = {
        default_cfg: {
            icon_class: 'icon-nofile',
            title: '暂无文件',
            content: '请点击左上角的“上传”按钮添加'
        },

        _render: function (data) {
            var id = data.id,
                $to = data.to;

            if(map[id]) {
                return map[id];
            }

            var $el = $(tmpl['blank_tip'](data));
            $el.appendTo($to);
            map[id] = $el;
        },

        /**
         * 显示空页面提示
         * @param {object} data
         * @returns {*}
         * @private
         */
        show: function (data) {
            if(!data.id || !data.to) {
                return;
            }
            data = $.extend(this.default_cfg, data);
            this._render(data);
            return map[data.id];
        },

        hide: function (id) {
            if(map[id]) {
                var $el = map[id];
                $el.hide();
            }
        },

        remove: function(id) {
            if(map[id]) {
                var $el = map[id];
                $el.remove();
            }
        }
    };

    return blank_tip;
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
define.pack("./ui.context_menu",["lib","$","./tmpl","./global.global_event","./constants"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        console = lib.get('./console'),
        template = lib.get('./template'),
        collections = lib.get('./collections'),
        Events = lib.get('./events'),

        tmpl = require('./tmpl'),
        global_event = require('./global.global_event'),
        constants = require('./constants'),
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
            if(item === '-') {
                item = new Item({
                    type: 'split'
                });
            } else if(!Item.is_instance(item)) {
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
            var $context_menu;
            if((constants.IS_OLD || constants.IS_APPBOX)) {
                $context_menu = $(tmpl.context_menu({ items: render_items, arrow: arrow, has_icons: has_icons, width: this.config.width }));
            } else {
                $context_menu = $(tmpl.context_menu_v2({ items: render_items, arrow: arrow, has_icons: has_icons, width: this.config.width }));
            }
            me.$el = $context_menu.hide().appendTo($to.length ? $to : document.body);

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
                zIndex: 10,//$el.css('zIndex') + 1,
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
 * @author trump
 * @date 2013-11-13
 */
define.pack("./ui.dragRun",["$","lib"],function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),
        $win = $(window),
        $doc = $(document),
        $body = $('body'),
        _elem = document.documentElement,
        INPUT_TAG = ['input', 'textarea'],
        isIE6 = !-[1, ] && !('minWidth' in _elem.style),
        assistant = {
            isLoseCapture: 'onlosecapture' in _elem,
            isSetCapture: 'setCapture' in _elem,
            clearSelect: (function () {//清除选中
                if ('getSelection' in window) {
                    return function () {
                        window.getSelection().removeAllRanges();
                    }
                }
                return function () {
                    try {
                        document.selection.empty();
                    } catch (e) {
                    }
                }
            })(),
            intCss: function ($el, attr_name) {
                return parseInt($el.css(attr_name).replace('px')) || 0;
            },
            setHelper: function (e) {
                var ctx = dragRun.ctx,
                    $self = ctx.$self,
                    css = $self.position(),
                    $papa = $self.offsetParent(),
                    ost = $papa.position();

                //加上内边距
                css.top += this.intCss($self, 'padding-top');
                css.left += this.intCss($self, 'padding-left');

                //加上外层容器偏移量
                while ($papa.get(0)) {
                    if ($papa.get(0) === ctx.$parent.get(0)) {
                        ost = $papa.offset();//ctx.$parent must be have the static relative position
                        css.top = css.top - this.intCss($papa, 'padding-top') + $papa.scrollTop();
                        css.left = css.left - this.intCss($papa, 'padding-left') + $papa.scrollLeft();
                        break;
                    }
                    css.top  = css.top + $papa.scrollTop() + ost.top + this.intCss($papa, 'padding-top');
                    css.left = css.left + $papa.scrollLeft() + ost.left + this.intCss($papa, 'padding-left');
                    $papa = $papa.offsetParent();
                    ost = $papa.position();
                }

                //拖动元素相对定位
                ctx.$helpPosition = {
                    left: css.left,
                    top: css.top,
                    width: ctx.$help.width(),
                    height: ctx.$help.height()
                };

                //鼠标相对拖动元素的位置
                var m_left = e.clientX - ost.left + $papa.scrollLeft() - css.left,
                    m_top  = e.clientY - ost.top + $papa.scrollTop() - css.top;
                ctx.mouseStartPosition = {
                    left: m_left,
                    top: m_top,
                    bottom: ctx.$helpPosition.width - m_top,
                    right: ctx.$helpPosition.height - m_left
                };

                //定位拖动help的位置
                ctx.$help.css({
                    top: css.top,
                    left: css.left,
                    position: 'absolute',
                    zIndex: ctx.zIndex || 1
                });

            },
            addCursor: function (e) {
                var ctx = dragRun.ctx;

                ctx.$help.css('cursor', ctx.cursor);
                ctx.$help.find('*').css('cursor', ctx.cursor);

                //for ie
                var refer = $(e.srcElement);
                if (refer.get(0)) {
                    ctx._referItem = refer;
                    if (refer.css('cursor')) {
                        ctx._referCursor = refer.css('cursor');
                    }
                    ctx._referItem.css('cursor', ctx.cursor);
                }
            },
            delCursor: function () {
                var ctx = dragRun.ctx;
                if (ctx._referItem) {
                    ctx._referItem.css('cursor', ctx._referCursor);
                    delete ctx._referItem;
                }
            },
            getOffset: function () {
                var ctx = dragRun.ctx;
                return {
                    top: ctx.$helpPosition.top + ctx.ost.top,
                    left: ctx.$helpPosition.left + ctx.ost.left
                };
            },
            drag: {
                //X轴拖动
                toLeft: function (left, right) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        mouse = ctx.mouseStartPosition,
                        range = ctx.range;
                    if (left < mouse.left) {//贴左
                        pos.left = range.minX;
                    } else if (right < mouse.right) {//贴右
                        pos.left = range.maxX;
                    } else {
                        pos.left = Math.max(range.minX, Math.min(range.maxX, left - mouse.left));
                    }
                },
                //Y轴非滚动位移
                toTop: function (y, top, bottom) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        mouse = ctx.mouseStartPosition,
                        limit = ctx.innerArea ,
                        range = ctx.range;
                    if (top < mouse.top) {//贴上
                        pos.top = range.minY + limit.mScroll;
                    } else if (bottom < mouse.bottom) {//贴下
                        pos.top = limit.height - pos.height + limit.mScroll;
                    } else {
                        pos.top = Math.max(range.minY, Math.min(limit.height - pos.height + limit.mScroll, top - mouse.top + limit.mScroll));
                    }
                },
                scrollTop: function (y) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition,
                        range = ctx.range,
                        limit = ctx.innerArea;
                    var step = y > 0 ? limit.step : -limit.step;
                    if (pos.top + step > range.maxY) {
                        step = range.maxY - pos.top;
                    } else if (pos.top + step < range.minY) {
                        step = range.minY - pos.top;
                    }
                    ctx.$parent.scrollTop(ctx.$parent.scrollTop() + step);
                    pos.top += step;
                },
                //Y轴滚动位移
                toScrollTop: function (y, top, bottom) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        range = ctx.range,
                        mScroll = ctx.$parent.scrollTop();
                    if (( y > 0 && pos.top + pos.height > mScroll + ctx.innerArea.height )//向下滚动触动可视区域底端
                        ||
                        (y < 0 && mScroll > pos.top)    //向上滚动触动可视区域顶端
                        ) {
                        this.scrollTop(y);
                        return pos.top < range.maxY && pos.top > range.minY;//是否支持触底继续滚动
                    } else {
                        pos.top = Math.max(range.minY, Math.min(range.maxY, (top - ctx.mouseStartPosition.top + mScroll)));
                    }
                },
                auto: {
                    start: function (y) {
                        var me = this;
                        me.stop();
                        me.y = y;
                        me._autoScroll = setInterval(me.run, 15);
                    },
                    stop: function () {
                        var me = this;
                        if (me._autoScroll) {
                            clearInterval(me._autoScroll);
                            delete me._autoScroll;
                            delete me.y;
                        }
                    },
                    run: function () {
                        var ctx = dragRun.ctx ,
                            pos = ctx.$helpPosition,
                            range = ctx.range,
                            limit = ctx.innerArea ,
                            me = assistant.drag.auto;
                        if (!pos || !range || !limit) {
                            me.stop();
                            return;
                        }
                        assistant.drag.scrollTop(me.y);
                        ctx.$help.css(ctx.$helpPosition);
                        ctx.drag.call(ctx.$self.get(0), assistant.getOffset());
                        if (pos.top <= range.minY || pos.top >= range.maxY) {
                            me.stop();
                        }
                    }
                }
            }
        };

    var dragRun = {
            start: function (e) {
                var me = dragRun;
                assistant.clearSelect();
                $doc.on('mousemove', me.drag)
                    .on('mouseup', me.end)
                    .on('dblclick', me.end);
                me._sClientX = e.clientX;
                me._sClientY = e.clientY;
                if (!isIE6) {
                    assistant.isLoseCapture ? me.ctx.$help.on('losecapture', this.end) : $win.on('blur', this.end);
                }
                assistant.isSetCapture && me.ctx.$help.get(0).setCapture();
                me.doStart(e);
                return false;
            },
            doStart: function (e) {
                var ctx = this.ctx;
                ctx.start.call(ctx.$self.get(0), e, assistant.getOffset());
            },
            drag: function (e) {
                assistant.clearSelect();
                var me = dragRun,
                    limit = me.ctx.innerArea,
                    x = 0,//X轴上移动距离
                    y = 0;//Y轴上移动距离
                //检测X轴是否超出目标范围
                if (e.clientX <= limit.maxX && e.clientX >= limit.minX) {
                    x = e.clientX - me._sClientX;//X轴上移动距离
                }
                //检测Y轴是否超出目标范围
                if (e.clientY <= limit.maxY && e.clientY >= limit.minY) {
                    y = e.clientY - me._sClientY;//Y轴上移动距离
                }
                me._sClientX = e.clientX;
                me._sClientY = e.clientY;
                //存在有效移动时，call 拖动事件
                if (x || y) {
                    me.doDrag(e, x, y);
                }
                e.preventDefault();
            },
            doDrag: function (e, x, y) {
                var ctx = dragRun.ctx ,
                    limit = ctx.innerArea ,
                    left = e.clientX - limit.minX,
                    right = limit.maxX - e.clientX,
                    top = e.clientY - limit.minY,
                    bottom = limit.maxY - e.clientY,
                    touchWallAbleScroll;
                x !== 0 && assistant.drag.toLeft(left, right);
                if (y !== 0) {
                    touchWallAbleScroll = !ctx.scroll ? assistant.drag.toTop(y, top, bottom) : assistant.drag.toScrollTop(y, top, bottom);
                }
                //位置变化更新到页面
                ctx.$help.css(ctx.$helpPosition);
                //执行回调
                ctx.drag.call(ctx.$self.get(0), assistant.getOffset());
                if (touchWallAbleScroll) {//
                    assistant.drag.auto.start(y);
                } else {
                    assistant.drag.auto.stop();
                }
            },
            end: function (e) {
                var me = dragRun;
                $doc.off('mousemove', me.drag)
                    .off('mouseup', me.end)
                    .off('dblclick', me.end);
                if (!isIE6) {
                    assistant.isLoseCapture ? me.ctx.$help.off('losecapture', this.end) : $win.off('blur', this.end);
                }
                assistant.isSetCapture && me.ctx.$help.get(0).releaseCapture();
                me.doEnd(e);
                return false;
            },
            doEnd: function (e) {
                this.ctx.stop.call(this.ctx.$self.get(0), e, assistant.getOffset());
                this.destroy();
            },
            /**
             * 会话环境
             */
            ctx: {
            },
            /**
             * 初始化会话环境
             */
            setCtx: function ($self, watch, opt) {
                var ctx = this.ctx = $.extend({}, opt);
                ctx.$parent = ctx.$parent || $body;//拖动对象追加的位置
                ctx.zIndex = ctx.zIndex || 100;//拖动层的z-index
                ctx.cursor = ctx.cursor || 'move';//拖动时的鼠标样式
                ctx.ost = ctx.$parent.offset();//拖动元素父元素的位置属性
                if (ctx.helper) {
                    ctx.$help = ctx.helper.call($self.get(0)).appendTo(ctx.$parent);//拖动对象
                } else {
                    ctx.$help = $self;
                }
                ctx.$self = $self;//目标元素
                ctx.watch = watch;

                ctx.innerArea = {//父元素可视区域
                    minY: ctx.ost.top,
                    maxY: ctx.ost.top + ctx.$parent.height(),
                    minX: ctx.ost.left,
                    maxX: ctx.ost.left + ctx.$parent.width(),
                    width: ctx.$parent.width(),//可视区域宽度
                    height: ctx.$parent.height(),//可视区域高度
                    mScroll: ctx.$parent.scrollTop(),//可视区域滚动高度
                    step: 5//每次滚动距离
                };

                //拖动范围
                ctx.range = (typeof ctx.moveRange === 'function') ?
                    ctx.moveRange.call($self.get(0))
                    : {
                    minX: 0,
                    maxX: ctx.innerArea.width - ctx.$help.width(),
                    minY: 0,
                    maxY: ctx.innerArea.height - ctx.$help.height()
                };
            },
            /**
             * @param e {$.Event}
             * @param $self {jQuery}
             * @param opt {Object}
             * @param watch {watchEvent}
             * ---> opt(调用者输入项) ===
             * {
                 cursor: {in_String} || 'move',//拖动时的鼠标样式
                 zIndex: {in_Number} || 100,//拖动层的z-index
                 moveRange: {in_Function}, || $parent的可见区域
                 $parent: {in_jQuery} || $(document),//拖动对象追加的位置
                 childFilter: {in_String},//子元素匹配器用于指定是那些可以支持拖拽 (必选)
                 helper: {in_Function},//返回拖动对象的回调方法，其this指向当前选中的dom对象 (必选)
                 start: {in_Function},//拖动开始的回调方法 (必选)
                 drag: {in_Function},//拖动进行中的回调方法 (必选)
                 end: {in_Function}//拖动结束的回调方法 (必选)
         * }
             */
            run: function (e, $self, opt, watch) {
                if (!this.started) {
                    this.started = true;
                    this.setCtx($self, watch, opt);//设置会话环境
                    assistant.addCursor(e);//设置光标
                    assistant.setHelper(e);//初始化拖动对象
                    this.start(e);//开启拖动
                }
            },
            destroy: function () {
                assistant.delCursor();//重置光标
                if (this.ctx.helper) {
                    this.ctx.$help.remove();//销毁拖动元素
                }
                this.ctx.watch.destroy();
                this.ctx = {};
                this.started = false;
            }
        }
        ;

    var watchEvent = function (opt) {
        var me = this;
        (opt.$on || opt.$parent || $doc)
            .on('mousedown', opt.childFilter, function (e) {
                if($.inArray(e.target.tagName.toLowerCase(), INPUT_TAG) > -1) {//有输入框是进行输入操作就不需要移动了
                    return;
                }
                if (e.which === 1) {
                    me._down_start = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    me._can_run = true;
                    return false;
                }
            })
            .on('mousemove', opt.childFilter, function (e) {
                if (me._can_run) {
                    //范围内5像素移动，激活拖拽
                    if(me._down_start){
                        if( Math.abs(e.clientX - me._down_start.x) > 5 ||  Math.abs(e.clientY - me._down_start.y) > 5 ){
                            e.preventDefault();
                            dragRun.run(e, $(this), opt, me);
                        }
                    }
                }
            })
            .on('mouseup', opt.childFilter, function () {
                me._down_start = null;
                me._can_run = false;
            });
    };

    $.extend(watchEvent.prototype, {
        destroy: function () {
            this._can_run = false;
        }
    });
    return watchEvent;
})
;/**
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
 * 页面上方提示条，常驻，点击关闭才关闭
 * 目前支持常驻提示队列
 * @author maplemiao
 * @date 16-09-07
 */

"use strict";

define.pack("./ui.mini_holding_tip",["lib","$","./tmpl","./scr_reader_mode","./ui.progress"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        tmpl = require('./tmpl'),
        progress,
        scr_reader_mode = require('./scr_reader_mode');

    var mini_holding_tip = {
        _tip_queue: [],
        _first_click_close_flag: true,
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_holding_tip']());
            me.$msg = me.$el.find('.msg-inner');
            me.$closeBtn = me.$el.find('.j-close-btn');
            me.$msgText = me.$el.find('.j-msg-text');
            me.$linkBtn = me.$el.find('.j-link-btn');

            me.$el.appendTo(document.body);
            me._bind_events();

            progress = require('./ui.progress');

            me._render_if = $.noop;
        },

        _bind_events: function () {
            var me = this;

            me.$el.on('click', '.j-close-btn', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me._show_next();
                me._first_click_close_flag = false;
            });
        },

        /**
         * 展示常驻提示入口
         * 注意：不会立即展示，而是按照优先级添加到队列中
         * @param {Object} options
         * @param {String} options.msgText
         * @param {String} options.linkBtnHref
         * @param {String} options.linkBtnTarget
         * @param {String} options.linkBtnText
         * @param {Number} options.priority 数字越小优先级越高
         * 目前用到：
         * [priority:10] upload提示下载插件
         * @returns {*}
         */
        show: function (options) {
            var me = this;

            me._render_if();
            me.$msg.removeClass('hide')
                    .addClass('show');

            // 根据优先级给队列中添加元素
            if (!me._tip_queue.length) {
                me._tip_queue.push(options);
            } else {
                var insert_flag = false;
                for (var i = 0; i < me._tip_queue.length; i++) {
                    if (options.priority <= me._tip_queue[i].priority) {
                        me._tip_queue.splice(i, 0, options);
                        insert_flag = true;
                        return;
                    }
                }
                if (!insert_flag) { // 如果在中间没有插入，则在最后添加
                    me._tip_queue.push(options);
                }
            }

            me._change_html(me._tip_queue[0]);
        },

        _show_next: function () {
            var me = this;

            if (me._tip_queue.length - 1) {
                if (me._first_click_close_flag) {
                    me._tip_queue.shift()
                }
                me._change_html(me._tip_queue.shift());
            } else {
                me.hide();
            }
        },

        _change_html: function (options) {
            var me = this;

            me.$linkBtn.attr('href', options.linkBtnHref);
            me.$linkBtn.attr('target', options.linkBtnTarget || '');
            me.$linkBtn.html(options.linkBtnText);
            me.$msgText.html(options.msgText);
        },

        hide: function () {
            var me = this,
                $msg = me.$msg;
            if ($msg) {
                $msg.removeClass('show')
                    .addClass('hide');
            }
        }
    };

    return mini_holding_tip;
});/**
 * 右上角小提示
 * @author jameszuo
 * @date 13-3-14
 */
define.pack("./ui.mini_tip",["lib","$","./constants","./tmpl","./ui.widgets","./scr_reader_mode","./ui.progress"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),

        constants = require('./constants'),
        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),
        progress,
        scr_reader_mode = require('./scr_reader_mode'),

        delay_min = 2, // 消息显示的时间下限
        delay_max = 5, // 消息显示的时间上限
        second_every_letter = .4, // 每多一个字符显示的秒数

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,

        undefined;


    var mini_tip = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_tip']());
            me.$label = me.$el.find('[data-id="label"]');
            me.$el.appendTo(document.body);

            progress = require('./ui.progress');

            me._render_if = $.noop;
        },

        /**
         * 显示提示
         * @param {String} type
         * @param {String} msg
         * @param {Number} [second]
         * @returns {*}
         * @private
         */
        _show: function (type, msg, second) {
            if (!msg)
                return;

            if (scr_reader_mode.is_enable())
                return alert(msg);

            var me = this;

            me._render_if();

            var $el = me.$el;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏progress
            progress.hide();

            clearTimeout(timer);

            // 显示
            $el.stop(true, true)
                .removeClass('full-tip-ok full-tip-warn full-tip-err')
                .addClass('full-tip-' + type)
                .css({ top: hidden_px, display: 'block' })
                .animate({ top: 0 }, speed, easing.get('easeOutExpo'));

            // 延迟一定时间后隐藏
            var delay = second > 0 ? second : calc_delay(msg);
            timer = setTimeout(function () {
                timer = setTimeout(function () {
                    me.hide();
                }, delay * 1000);
            }, speed);
        },

        hide: function () {
            clearTimeout(timer);

            var me = this, $el = me.$el;
            if ($el) {
                $el.stop(true, true).animate({ top: hidden_px }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide().removeClass('full-tip-ok full-tip-warn full-tip-err');
                });
            }
        }
    };

    $.each({ok: 'ok', warn: 'warn', error: 'err'}, function (key, type) {
        mini_tip[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._show.apply(this, args);
        };
    });

    // 计算提示消息显示的持续时间
    var calc_delay = function (msg) {
        return Math.min(Math.max(msg.length * second_every_letter, delay_min), delay_max);
    };

    return mini_tip;
});/**
 * 页面上方提示条，临时，过几秒自动消失
 * @author jameszuo
 * @modified by maplemiao 16-09-07
 * @date 16-09-07
 */
define.pack("./ui.mini_tip_v2",["lib","$","./tmpl","./ui.widgets","./scr_reader_mode","./ui.progress"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),
        progress,
        scr_reader_mode = require('./scr_reader_mode'),

        delay_min = 2, // 消息显示的时间下限
        delay_max = 5, // 消息显示的时间上限
        second_every_letter = .4, // 每多一个字符显示的秒数

        timer,

        undefined;


    var mini_tip = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['mini_tip_v2']());
            me.$msg = me.$el.find('.msg-inner');
            me.$label = me.$el.find('[data-id="label"]');
            me.$el.appendTo(document.body);

            progress = require('./ui.progress');

            me._render_if = $.noop;
        },

        /**
         * 显示提示
         * @param {String} type
         * @param {String} msg
         * @param {Number} [second]
         * @returns {*}
         * @private
         */
        _show: function (type, msg, second) {
            if (!msg)
                return;

            if (scr_reader_mode.is_enable())
                return alert(msg);

            var me = this;

            me._render_if();

            var $msg = me.$msg;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏progress
            progress.hide();

            clearTimeout(timer);

            // 显示
            $msg.parent().show();
            $msg.removeClass('active warning hide')
                .addClass(type + ' show');

            // 延迟一定时间后隐藏
            var delay = second > 0 ? second : calc_delay(msg);
            timer = setTimeout(function () {
	            me.hide();
            }, delay * 1000);
        },

        hide: function () {
            clearTimeout(timer);

            var me = this, $msg = me.$msg;
            if ($msg) {
                $msg.removeClass('show')
                    .addClass('hide');
                $msg.parent().hide();
            }
        }
    };

    $.each({ok: 'active', warn: 'warning', error: 'warning'}, function (key, type) {
        mini_tip[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._show.apply(this, args);
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
define.pack("./ui.pop_panel",["lib","$","./scr_reader_mode"],function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events'),
        scr_reader_mode = require('./scr_reader_mode');

    /**
     * @param {jQuery} options.host_$dom 触发元素
     * @param {jQuery} options.$dom 弹出的panel层的jQuery 对象
     * @param {Function} options.show 显示操作
     * @param {Function} options.hide 隐藏的动作
     * @param {Number} options.delay_time 延迟多久显示 默认500毫秒
     * @param {Boolean} options.trigger_by_focus 可被focus事件触发
     */
    var PopPanel = function (options) {
        var me = this,
            o = me.o = options;

        // 针对读屏软件，始终显示弹出层 - james
        if (scr_reader_mode.is_enable()) {
            me.show();
//            return;
        }
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
            me.trigger('show', o.$dom);
        },

        hide: function () {
            if (scr_reader_mode.is_enable())
                return;

            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (typeof o.hide === 'function') {
                o.hide.call(me);
            } else {
                o.$dom.hide();
            }
            me.trigger('hide', o.$dom);
        },

        _delay_hide: function () {
            var me = this, o = me.o;

            clearTimeout(me._timr);

            if (me._disable) {
                return;
            }

            me._timr = setTimeout(function () {
                me.hide();
            }, o.delay_time);
        },

        disable: function () {
            this._disable = true;
        },

        enable: function () {
            this._disable = false;
        },

        is_able: function(){
            return !this._disable;
        }

    };

    $.extend(PopPanel.prototype, events);

    return PopPanel;
});/**
 * 展示处理进度
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author jameszuo
 * @date 13-1-19
 */
define.pack("./ui.progress",["lib","$","./ui.widgets","./tmpl","./ui.mini_tip"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        easing = lib.get('./ui.easing'),

        widgets = require('./ui.widgets'),
        mini_tip,
        tmpl = require('./tmpl'),

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,

        undefined;


    var progress = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['progress']());
            me.$label = me.$el.find('[data-id="label"]');
            me.$el.appendTo(document.body);

            mini_tip = require('./ui.mini_tip');

            me._render_if = $.noop;
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

            me._render_if();

            var $el = me.$el;

            // 文字
            me.$label.html(msg);

            if (!msg) // 没有消息就隐藏
                return me.hide();

            // 隐藏mini_tip
            mini_tip.hide();

            $el.stop(true, true);

            if ($el.is(':hidden')) {
                // 显示
                $el.css({
                    'display': 'block',
                    'opacity': 0
                }).animate({ opacity: 1 }, speed, easing.get('easeOutExpo'));
                // 显示遮罩
                me.mask(true, white_mask);
            }

            // 延迟后隐藏
            if (delay_to_hide) {
                timer = setTimeout(function () {
                    var delay = 1.5;
                    if (typeof delay_to_hide == 'number') {
                        delay = delay_to_hide;
                    }
                    timer = setTimeout(function () {
                        me.hide();
                    }, delay * 1000);
                }, speed);
            }

            this._cur_id = id || undefined;
        },

        /**
         * @param {Boolean} [mask]
         */
        hide: function (mask) {
            clearTimeout(timer);

            var $el = this.$el;
            if ($el) {
                $el.stop(true, true).animate({ opacity: 0 }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide();
                });
            }
            // 隐藏遮罩
            if (mask !== false)
                this.mask(false);
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
 * 滚动条
 * User: trumpli
 * Date: 13-12-26
 * Time: 上午11:51
 */
define.pack("./ui.scroll_bar",["$","lib","./ui.pop_panel","./ui.dragRun","./tmpl"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        pop_panel = require('./ui.pop_panel'),
        dragRun = require('./ui.dragRun'),
        tmpl = require('./tmpl'),
        hover_class = 'bar-hover',//滚动条聚焦样式
        isIE6 = !-[1, ] && !('minWidth' in document.documentElement.style),
        wheel_event = $.browser.msie || $.browser.webkit ? 'mousewheel' : 'DOMMouseScroll';
    /**
     * @param o {$parent: xxx, style: xxx || 'ios' （默认ios）}
     */
    var scroll_bar = function (o) {
        this.o = {
            style: !o.style ? 'ios' : o.style,//显示风格 默认ios风格
            $parent: $(o.$parent),//依附元素
            step: 15,//滑轮滚动单次移动距离（单位:dpi）
            $scroll: $(tmpl.g_scrollbar()).appendTo(o.$parent)//滚动条
        };
        this.render_wheel().render_mouse().render_hover().sync();
    };
    //get
    $.extend(scroll_bar.prototype, {
        /**
         * 返回滚动条对象
         * @returns {jQuery}
         */
        get_$scroll: function () {
            return this.o.$scroll;
        },
        /**
         * 拖动对象
         * @returns {jQuery}
         */
        get_$drager: function () {
            return this.o._$drager || (this.o._$drager = this.get_$scroll().find('[data-action="dragger"]'));
        },
        /**
         * 拖动对象条
         * @returns {jQuery}
         */
        get_$drager_bar: function () {
            return this.o._$drager_bar || (this.o._$drager_bar = this.get_$scroll().find('[data-action="bar"]'));
        },
        /**
         * 依附元素
         * @returns {jQuery}
         */
        get_$attach: function () {
            return this.o.$parent;
        },
        /**
         * 依附元素页面范围
         * @returns {Object}
         */
        get_$attach_range: function () {
            var me = this,
                ost = me.get_$attach().offset();
            return {
                x1: ost.left,
                x2: ost.left + me.get_$attach().width(),
                y1: ost.top,
                y2: ost.top + me.get_$attach().height()
            };
        },
        /**
         * @returns {jQuery}
         */
        get_$attach_body: function () {
            if (!this.o.$attach_body) {
                this.o.$attach_body = $(this.get_$attach().children()[0]).css('position', 'absolute');
                this.get_$attach().css('overflow', 'hidden');
            }
            return this.o.$attach_body;
        },
        /**
         * 依附元素的 实际高度
         * @returns {Number}
         */
        get_all_height: function () {
            return this.get_$attach_body().height();
        },
        /**
         * 依附元素的 可见高度
         * @returns {Number}
         */
        get_see_height: function () {
            return this.get_$attach().height();
        },
        /**
         * 滚动条和依附元素的高度比率
         * @returns {float}
         */
        get_rate: function () {
            return this.o.rate;
        },
        /**
         * 滚动条最小滚动top
         * @returns {Number}
         */
        get_scroll_max_top: function () {
            return this.o.scroll_max_top;
        },
        /**
         * 支持仅在悬浮、拖动滚动条时，才显示滚动条
         * @returns {Boolean}
         */
        support_hover: function () {
            return this.o.style === 'ios';
        }
    });
    //渲染、滚动
    $.extend(scroll_bar.prototype, {
        //隐藏滚动条
        real_hide: function () {
            this.state = 'hide';
            this.get_$scroll().hide();
        },
        //显示滚动条
        real_show: function () {
            this.state = 'show';
            this.get_$scroll().show();
        },
        //滚动条聚焦
        scroll_focus: function () {
            this.get_$drager_bar().addClass(hover_class);//添加悬浮滚动条样式
        },
        //滚动条失焦
        scroll_blue: function () {
            this.get_$drager_bar().removeClass(hover_class);//移除悬浮滚动条样式
        },
        /**
         * 鼠标拖动事件
         */
        render_mouse: function () {
            var me = this , start;
            new dragRun({
                $on: me.get_$drager(),
                $parent: me.get_$scroll(),
                cursor: 'pointer',
                start: function () {
                    me.drag_ing = true;//正在拖动滚动条
                    me.scroll_focus();
                    if (me.support_hover()) {
                        me.scroll_hover.disable();
                    }
                    start = me.get_$scroll().offset().top;
                },
                drag: function (ost) {
                    me.absolute_go(ost.top - start);
                },
                stop: function (e, ost) {
                    me.absolute_go(ost.top - start);
                    me.scroll_blue();
                    me.drag_ing = false;//木有正在拖动滚动条
                    if (me.support_hover()) {
                        me.scroll_hover.enable(e);
                        //鼠标不在依附范围内，隐藏滚动条
                        var range = me.get_$attach_range();
                        if (e.clientX < range.x1 || e.clientX > range.x2 || e.clientY < range.y1 || e.clientY > range.y2) {
                            me.real_hide();
                        }
                    }
                }
            });
            return me;
        },
        /**
         * 鼠标滑动事件
         */
        render_wheel: function () {
            var me = this;
            me.get_$attach().on(wheel_event, function (e) {
                if (me.o.able_scroll) {
                    me.relative_go(me.o.step * ((e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ? -1 : 1));
                    return false;
                }
            });
            return me;
        },
        /**
         * 鼠标进入依附区域
         */
        render_hover: function () {
            var me = this;
            if (me.support_hover()) {
                me.scroll_hover = new pop_panel({
                    host_$dom: me.get_$attach_body(),
                    $dom: me.get_$scroll(),
                    show: function () {
                        if (me.o.able_scroll) {
                            me.real_show();
                        }
                    },
                    hide: function () {
                        me.real_hide();
                    },
                    delay_time: 300
                });
            }
            if(!isIE6){
                me.get_$drager()
                    .on('mouseenter',function () {
                        me.scroll_focus();
                    }).on('mouseleave', function () {
                        if (!me.drag_ing) {//弹层可用时,退出聚焦状态
                            me.scroll_blue();
                        }
                    });
            }
            return me;
        },
        /**
         * @param top 滚动条距顶部高度
         */
        go: function (top) {
            var me = this, b_top = -top / me.get_rate();
            //变更位置
            me.get_$drager().css('top', top);
            me.get_$attach_body().css('top', b_top);
            //触发事件
            this.trigger('scroll', { top: -b_top });//滚动事件
            if (top >= this.get_scroll_max_top()) {
                this.trigger('reach_bottom');//滚动到达底部
            }
        },
        /**
         * 增量滚动
         * @param inc 增量变化
         */
        relative_go: function (inc) {
            this.go(Math.max(0, Math.min(parseInt(this.get_$drager().css('top')) + inc, this.get_scroll_max_top())));
        },
        /**
         * 直接滚动到指定位置
         * @param y
         */
        absolute_go: function (y) {
            this.go(Math.max(0, Math.min(y, this.get_scroll_max_top())));
        }
    });
    //对外暴露方法
    $.extend(scroll_bar.prototype, {
        _sync: function () {
            var me = this,
                all_h = me.get_all_height(),//可见高度
                see_h = me.get_see_height(),//实际高度
                diff = see_h - all_h;
            if (me.o.able_scroll = ( diff < 0 )) {//需要滚动条
                me.o.rate = see_h / all_h;//依附的可见区间和总区间比率
                var scroll_h = me.o.rate * see_h,//滚动条高度
                    top = Math.max(parseInt(me.get_$attach_body().css('top')) || me.get_$attach_body().position().top, diff);//$attach body 偏移量
                me.o.scroll_max_top = Math.floor(see_h - scroll_h);//滚动条最大向下滚动距离 (类型: int，单位: dpi)
                me.get_$drager().height(scroll_h);
                if(isIE6){
                    me.get_$drager().repaint();
                }
                me.absolute_go(-me.o.rate * top);
                !me.support_hover() && me.real_show();
            } else {
                me.get_$attach_body().css('top', me.get_$attach_body().position().top);
                me.real_hide();
            }
        },
        /**
         * 滚动元素的高度/形状发生改变时，call同步方法，同步到滚动条上
         */
        sync: function () {
            var me = this;
            if (me.sync_tid) {
                clearTimeout(me.sync_tid);
                me.sync_tid = null;
            }
            me.sync_tid = setTimeout(function () {
                me._sync();
            }, 100);
            return me;
        },
        /**
         * 滚回顶部
         */
        top: function () {
            this.go(0);
        },
        /**
         * 滚回底部
         */
        bottom: function () {
            this.go(this.get_scroll_max_top());
        }
    }, events);

    return scroll_bar;
});
/**
 * 控制页面上下滚动
 * @author jameszuo
 * @date 13-4-18
 */
define.pack("./ui.scroller",["lib","$","./constants","./ui.widgets","./global.global_event","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        easing = lib.get('./ui.easing'),
        constants = require('./constants'),
        widgets = require('./ui.widgets'),
        global_event = require('./global.global_event'),
        tmpl = require('./tmpl'),

        scroll_speed = 'slow',
        scrollbar_width,

        default_$el,
        reach_bottom_px = constants.IS_OLD? 300 : 500,// 距离页面底部300px时加载文件,新版把阀值调大些

        undef;


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
        },

        //获取滚动条高度，使用一个50*50 overflow-y:scroll的div,再在里面放一个50*51的div，使之出现滚动条，这时外面div宽度减去里面div宽度就是滚动条宽度了
        get_scrollbar_width : function() {
            var $el;
            if(scrollbar_width) {
                return scrollbar_width;
            }
            $el = $('<div id="scrollbar-width" style="position:absolute;left:-1000px;top:-1000px;background:#000;"><div style="width:50px;height:50px;background:#00f;"><div style="height:50px;overflow-y:scroll;background:#0f0;"><div data-content="true" style="height:51px;background:#f00;"></div></div></div>').appendTo($('body'));
            scrollbar_width = 50 - parseInt($el.find("[data-content]").width());
            $el.remove();
            return scrollbar_width;
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
                // 默认滚动元素
                // webkit: document.body
                // ie/ff: document.documentElement
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


    return Scroller;
});/**
 * 缩略图样式调整，根据屏幕宽度重新算width
 * @author jameszuo
 * @date ${DATE}
 */
define.pack("./ui.thumb_helper",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),

        default_options = {
            container: null,
            item_selector: null,
            height_selector: null,
            box_width: 0
        },

        undefined;


    var ThumbHelper = function (opts) {
        if (opts.container) {
            opts.container = $(opts.container);
        } else {
            throw '无效的参数，须指定$container';
        }
        this._options = $.extend({}, default_options, opts);
    };

    ThumbHelper.prototype = {

        /**
         * 获取文件DOM节点列表
         * @returns {DOM} 文件列表
         */
        get_$list: function () {
            this.$list = this._options.container.find(this._options.item_selector);
            return this.$list;
        },

        is_empty: function() {
            return this._options.container && this.get_$list().length === 0;
        },

        /**
         * 判断是box是否有变化
         * @returns {Boolean} is_change
         * @param {Number} box_width
         * @param {Boolean} is_refresh
         */
        is_change: function(box_width, is_refresh) {
            if(!is_refresh && this._options.box_width === box_width) {
                return false;
            }
            this._options.box_width = box_width;
            return true;
        },

        /**
         * 活动每个item项的width值，每个item的宽度范围为180~200px，margin为15px
         * @returns {Number} 宽度
         * @param {Number} box_width
         */
        get_item_width: function(box_width) {
            box_width = box_width - 20; //预留20px空白
            if(box_width < 0) {
                return 200;
            }
            var max = Math.floor(box_width / 195),
                min = Math.floor(box_width / 215),
                count = Math.abs(max - min) > 0? max : min,
                item_width = Math.round(box_width / count);
            return item_width > 215? 200 : item_width-15;
        },

        /**
         * 屏幕窗口大小变化，重新计算
         * @param {Number} box_width
         * @param {boolean} is_refresh 强制刷新
         */
        update_item_width: function(box_width, is_refresh) {
            if(!this.is_empty() && this.is_change(box_width, is_refresh)) {
                var me = this,
                    list = this.get_$list(),
                    item_width = this.get_item_width(box_width),
                    item_height = Math.round(item_width * 0.75);

                $.each(list, function(index, item) {
                    $(item).css('width', item_width + 'px');
                    if(me._options.height_selector && $(item).find(me._options.height_selector).length > 0) {
                        $(item).find(me._options.height_selector).css('height', item_height + 'px');
                    }
                });
            }
        },

        set_$container: function (container) {
            this._options.container = $(container);
            this.$list = null;
        },

        destroy: function() {

        }
    };


    return ThumbHelper;
});/**
 * 弹出提示
 * @author iscowei
 * @date 16-10-12
 */
define.pack("./ui.toast",["$","lib","./tmpl","./ui.widgets","./scr_reader_mode"],function (require, exports, module) {
    var $ = require('$'),
	    lib = require('lib'),
        easing = lib.get('./ui.easing'),

        tmpl = require('./tmpl'),
	    widgets = require('./ui.widgets'),
        scr_reader_mode = require('./scr_reader_mode'),

        speed = 500, // 毫秒，需要与webbase-2.0.css 中的 .full-tip-box 一致
        hidden_px = '-32px', // 隐藏时的位置，需要与webbase-2.0.css 中的 .full-tip-box 一致
        timer,
	    interval,

        undefined;


    var toast = {
        $el: null,

        _render_if: function () {
            var me = this;
            me.$el = $(tmpl['toast']());
            me.$label = me.$el.find('[data-id="toast-label"]');
	        me.$loading = me.$el.find('[data-id="toast-loading"]');
	        me.$remain = me.$el.find('[data-id="remain-time"]');
            me.$el.appendTo(document.body);

            me._render_if = $.noop;
        },

        /**
         * 显示提示
         * @param {String} type
         * @param {String} msg
         * @param {Number} [second]
         * @returns {*}
         * @private
         */
        _show: function (type, msg, second, callback) {
            if (!msg)
                return;

            if (scr_reader_mode.is_enable())
                return alert(msg);

            var me = this;
            me._render_if();
            var $el = me.$el;

            // 文字
            me.$label.html(msg);

	        if(type === 'loading') {
		        me.$loading.show();
	        } else {
		        me.$loading.hide();
	        }

            if (!msg) // 没有消息就隐藏
                return me.hide();

            clearTimeout(timer);
	        clearInterval(interval);

            // 显示
	        widgets.mask.toggle(true, 'ui.toast', $el, true);
            $el.stop(true, true)
                .css({ top: hidden_px, display: 'block' })
                .animate({ top: parseInt(($(window).height() - $el.height()) / 2) }, speed, easing.get('easeOutExpo'));

            // 延迟一定时间后隐藏
	        if(second > 0) {
		        me.$remain.text('(' + second + '秒后自动关闭)');
		        timer = setTimeout(function() {
			        me.hide();
			        widgets.mask.toggle(false, 'ui.toast', $el, true);
			        clearInterval(interval);
			        callback && callback();
		        }, second * 1000);
		        interval = setInterval(function() {
			        me.$remain.text('(' + (second===0 ? second : --second) + '秒后自动关闭)');
		        }, 1000);
	        } else {
		        me.$remain.text('');
	        }
        },

        hide: function () {
            clearTimeout(timer);
	        clearInterval(interval);

            var me = this, $el = me.$el;
            if ($el) {
                $el.stop(true, true).animate({ top: hidden_px }, speed, easing.get('easeOutExpo'), function () {
                    $el.hide();
	                widgets.mask.toggle(false, 'ui.toast', $el, true);
                });
            }
        }
    };

    $.each({loading: 'loading', tips: 'tips'}, function (key, type) {
        toast[key] = function () {
            var args = $.makeArray(arguments);
            args.splice(0, 0, type);
            this._show.apply(this, args);
        };
    });

    return toast;
});/**
 * 工具条按钮item
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./ui.toolbar.button",["lib","$","./ui.mini_tip","./tmpl","./global.global_event"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        mini_tip = require('./ui.mini_tip'),
        tmpl = require('./tmpl'),
        global_event = require('./global.global_event'),

        noop = $.noop,
        default_options = {
            id: '',
            label: '',
            icon: '',
            cls: '',
            filter: '',
            // 快捷键
            short_key: '', //  ctrl+k, shift+r, ctrl+shift+b ...
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
        var o = this._o = $.extend({}, default_options, options);
        this._visible = true;
        if (o.short_key && o.short_key.indexOf(' ') > -1) {
            o.short_key = '';
        }
    };

    Button.prototype = {

        __is_tbar_btn: true,
        /**
         * 同步显示状态 直出的部分可能不一样
         */
        sync_visible: function () {
            if (this._$el) {
                var display = this._$el.css('display');
                this._visible = display && display.toLowerCase() !== 'none' || !display;
            }
        },
        apply_on: function ($el) {
            var me = this,
                o = me._o;

            me._$el = $el;//.toggle(me._visible);

            $el.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                me.handler(e);
            });

            this.sync_visible();

            if (o.render !== noop) {
                o.render.call(me);
            }
        },

        handler: function (e) {
            var me = this, o = me._o;

            // before handler
            o.before_handler && o.before_handler.call(me);

            // 点击前的检查
            if ($.isFunction(o.validate) && o.validate !== noop) {
                var err = o.validate.call(me);
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
            var me = this, o = me._o;

            if (me._visible !== yes && me._$el) {
                me._$el.toggle(yes);
                me._visible = yes;
            }
            /*
             if (me._visible !== yes) {
             me._$el && me._$el.toggle(yes);
             me._visible = yes;
             }
             */

            // 快捷键
            if (o.short_key) {
                if (yes) {
                    !me._listening_key && me.listenTo(global_event, 'press_key_' + o.short_key, function (e) {
                        me.handler(e);
                    });
                    me._listening_key = true;
                } else {
                    me.stopListening(global_event, 'press_key_' + o.short_key);
                    me._listening_key = false;
                }
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

    $.extend(Button.prototype, events);

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
define.pack("./ui.widgets",["lib","$","./tmpl","./constants","./global.global_event","./ui.center","./scr_reader_mode"],function (require, exports, module) {

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
        scr_reader_mode = require('./scr_reader_mode'),


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
    exports.confirm = function (title, msg, desc, ok_callback, cancel_callback, button_texts, escape_html) {
        var tip = '';
        if (typeof desc === 'object') {
            tip = desc.tip;
            desc = desc.text;
        }

        // for ARIA 读屏软件使用浏览器内置的 confirm 对话框
        if (scr_reader_mode.is_enable()) {
            if (window.confirm(msg + '\n' + (tip || desc))) {
                $.isFunction(ok_callback) && ok_callback();
            } else {
                $.isFunction(cancel_callback) && cancel_callback();
            }
            return;
        }

        var $el = $('#_widgets_confirm');
        if ($el[0]) {
            $el.remove();
        }

        if (!$.isArray(button_texts)) {
            button_texts = [];
        }

        escape_html = typeof escape_html === 'boolean' ? escape_html : true;

        $el = $(tmpl.confirm({ title: title, msg: msg, desc: desc, tip: tip, button_texts: button_texts, escape_html: escape_html })).appendTo(document.body);

        var
            ok = function (e) {
                toggle(false);

                if ($.isFunction(ok_callback))
                    ok_callback(e);
            },

            cancel = function (e) {
                toggle(false);

                if ($.isFunction(cancel_callback))
                    cancel_callback(e);
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

                mask.toggle(visible, 'ui.widgets.confirm', '', true);

                if (scr_reader_mode.is_enable()) {
                    visible ? TabTie.tie($el) : TabTie.untie();
                }
            };

        toggle(true);

        // 默认焦点
        if (scr_reader_mode.is_enable()) {
            $el.find('[tabindex="0"]:first').focus();
        } else {
            $el.find('a._ok,:button._ok').focus();
        }

        // 交互
        $el.on('click.widgets_confirm', 'a._ok,:button._ok', function (e) {
            e.preventDefault();
            ok(e);
        });
        $el.on('click.widgets_confirm', 'a._x,:button._x', function (e) {
            e.preventDefault();
            cancel(e);
        });
        $el.on('keydown.widgets_confirm', function (e) {
            if (e.which === 27) {  // esc
                cancel(e);
            } else if (e.which === 13) { // enter
                ok(e);
            }
        });
        require.async('jquery_ui', function () {
            if (!$el.parent()[0]) {
                return;
            }
            $el.draggable({
                handle: '.ui-xbox-title, .ui-xbox-foot, [data-draggable-target],.full-pop-header,.full-pop-btn',
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
        // for ARIA 读屏软件使用浏览器内置的 confirm 对话框
        if (scr_reader_mode.is_enable()) {
            window.alert(options.msg + '\n' + (options.desc || ''));
            if ($.isFunction(options.ok)) {
                options.ok();
            }
            return;
        }

        new Dialog({
            title: options.title,

            content: $(tmpl.alert_dialog_content({ type: options.type, msg: options.msg, desc: options.desc })),
            destroy_on_hide: true,
            buttons: [
                { id: 'OK', text: options.button_text || '确定', klass: 'ui-btn-ok', disabled: false, visible: true }
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
         * @param {String} [mask_type] 遮罩类型
         */
        show: function (namespace, under_$el, mask_type, extra) {
            this.toggle(true, namespace, under_$el, mask_type, extra);
        },

        hide: function (namespace) {
            this.toggle(false, namespace);
        },
        /**
         *
         * @param styles
         */
        always_styles: function(styles){
            this._prior_styles = styles;
        },
        remove_styles: function(){
            this._prior_styles = {};
        },
        /**
         * 显示、隐藏遮罩
         * @param {boolean} visible
         * @param {string} namespace
         * @param {jQuery|HTMLElement} [under_$el] 将元素显示在遮罩层上方（修改 under_$el 的 z-index）
         * @param {String} [mask_type] 遮罩类型
         * @param {Object} extra 扩展参数
         */
        toggle: function (visible, namespace, under_$el, mask_type, extra) {
            if (typeof visible !== 'boolean') {
                return;
            }
            //优先级最高的样式属性
            if(!this._prior_styles){
                this._prior_styles = {};
            }
            var transparent = mask_type === 'transparent';
            mask_type = mask_type === true;

            extra = extra || {};
            var opacity = this._prior_styles.opacity || extra.opacity || 0.65;

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
                if (transparent) {
                    $mask_el.removeClass('ui-mask-white').css({ 'background-color': this._prior_styles.bg_color || '#FFF', 'opacity': 0 });
                } else if (typeof mask_type === 'boolean') {
                    $mask_el.toggleClass('ui-mask-white', !!mask_type).css('background-color', this._prior_styles.bg_color || (mask_type ? '#FFF' : '#000'));
                }

                if (!$mask_el.is(':visible'))
                    $mask_el.css({ opacity: 0, display: 'block' });

                !transparent && $mask_el.animate({ opacity: opacity }, 'fast');

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
                mask_bg: 'ui-mask-white',
                mask_ns: 'default', // 参考mask的namespace(随便写，唯一就行)
                buttons: [ 'OK', 'CANCEL' ], // or [ { id:'test', text:'测试', klass:'', disabled:false } ]
                movable: true, // 是否可移动窗口
                handlers: null, // { OK: func(), CANCEL: func() }
                out_look_2_0: false//2.0风格
            },

            DEFAULT_BUTTONS = {
                OK: { id: 'OK', text: '确定', klass: 'g-btn-blue', disabled: false, visible: true, submit: true },
                CANCEL: { id: 'CANCEL', text: '取消', klass: 'g-btn-gray', disabled: false, visible: true },
                CLOSE: { id: 'CLOSE', text: '关闭', klass: 'g-btn-gray', disabled: false, visible: true }
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
                    if (config.out_look_2_0) {
                        config.tmpl = tmpl.dialog_2_0;
                    }
                    // 构造并插入内容
                    $el = me.$el = $(config.tmpl({ config: config, buttons: buttons })).hide().attr('role', 'alertdialog').appendTo(document.body);

                    var $foot = $el.find('div.__buttons');

                    me.$buttons = $foot.children(':button,:submit,[data-id=button]');
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
                            // 如果有OK按钮，且OK按钮不可见，则不回调OK事件 - james (修复OK按钮隐藏后，按下回车仍然触发OK事件的bug)
                            var $ok = me.$buttons.filter('[data-btn-id="OK"]');
                            if ($ok[0] && !$ok.is(':visible')) {
                                return;
                            }
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
                    if (me.config.mask_bg == 'ui-mask-white') {
                        mask.show('ui.widgets.Dialog.' + me.config.mask_ns, '', true);
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
                            handle: '.box-head, .ui-xbox-title, .ui-xbox-foot, [data-draggable-target],.full-pop-header,.full-pop-btn',
                            cancel: 'a, button, input',
                            containment: 'document',
                            start: function () {
                                ui_center.stop_listen(me.$el);
                            }
                        });
                    });
                }

                if (scr_reader_mode.is_enable()) {
                    TabTie.tie(me.$el);
                }

                this._visible = true;

                this.trigger('show');
            },

            /**
             * 隐藏
             */
            hide: function (isCancel) {
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

                    me.trigger('hide', isCancel);

                    // 隐藏时销毁
                    if (config.destroy_on_hide) {
                        me.destroy();
                    }
                };

                me.$el.fadeOut(config.animate ? 'fast' : 0, function () {
                    after_hide();
                });

                if (scr_reader_mode.is_enable()) {
                    TabTie.untie();
                }
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

                var $content = me.get_$body().empty();

                // 向对话框中插入内容
                if (typeof content == 'string' || (content instanceof $) || (content.tagName && content.nodeType)) {
                    $content.append(content);
                } else if (typeof content == 'function') {
                    $content.append(content());
                } else {
                    console.error('widgets.Dialog.set_content(content)', '无效的content参数：', content);
                }

                if (this._visible && scr_reader_mode.is_enable()) {
                    TabTie.focus(me.$el);
                }

                this.trigger('update_content');
            },

            set_button_enable: function (button_id, enable) {
                enable = enable !== false;
                var $btn = this.$buttons.filter('[data-btn-id="' + button_id + '"]'),
                    disabled_cls = 'disabled';
                $btn.find('.btn-inner').toggleClass(disabled_cls, !enable);
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
            set_button_text: function (button_id, text) {
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

            focus: function () {
                if (scr_reader_mode.is_enable()) {
                    TabTie.focus(this.get_$body());
                }
            },

            is_visible: function () {
                return !!this._visible;
            },

            get_$body: function () {
                return $('div.__content', this.$el);
            },

            get_$el: function () {
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
        _map: {},
        show: function (modal, ns) {
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

            modal && mask.show(ns, $el, 'transparent');
            this._map[ns] = 1;
        },

        hide: function (ns) {
            mask.hide(ns);

            if (ns) {
                delete this._map[ns];
                if ($.isEmptyObject(this._map)) {
                    this._get_$el().stop(false, true).hide();
                }
            } else {
                this._get_$el().stop(false, true).hide();
            }
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


    /**
     * 劫持tab键必须限制在某个元素内
     * @param {jQuery} [$el]
     */
    var TabTie = exports.TabTie = {

        $el: null,
        $focus_interc: null,
        // $before_tie_active: document.activeElement,

        /**
         * 限制focus在元素内部
         * @param {jQuery} $el
         */
        tie: function ($el) {
            var me = this;
            me.$el = $el;
            // me.$before_tie_active = document.activeElement;

            me.untie();

            $(document.body).on('keydown.TabTie', function (e) {
//                if (e.which === 9) {
                setTimeout(function () {
                    me._fix_focus();
                }, 0);
//                }
            });
            // 放置一个tabindex很大的元素，用于拦截tab focus
            me.$focus_interc || (me.$focus_interc = $('<a data-for-aria tabindex="0" style="position:fixed;_position:absolute;left:0;top:-100px;" href="#">test test test</a>').appendTo(document.body));

            me._fix_focus();
        },

        /**
         * 取消限制
         */
        untie: function () {
            $(document.body).off('keydown.TabTie').focus();
            if (this.$focus_interc) {
                this.$focus_interc.remove();
                this.$focus_interc = null;
            }
        },

        /**
         * 手动聚焦一次
         * @param {jQuery} $el
         */
        focus: function ($el) {
            var $focus_to = $el.find('[tabindex=0]:visible:first');
            if (!$focus_to[0]) {
                $focus_to = $el;
                if (!$focus_to.attr('tabindex')) {
                    $focus_to.attr('tabindex', 0);
                }
            }
            $focus_to.focus();
        },

        /**
         * 按下tab键时，如果焦点不在指定元素内部，则强制tab回复到指定元素内部
         * @returns {boolean} 是否已强制更改焦点元素
         * @private
         */
        _fix_focus: function () {
            var me = this;
            var active_$el = $(document.activeElement);
            if (!active_$el[0] || active_$el[0] === document.body || active_$el.closest(me.$el).length === 0) {
                this.focus(me.$el);
                return true;
            }
            return false;
        }

    };
});/**
 * PC内嵌页维持登录态
 * 分两种方案：1、常规方案：定时发出CGI请求维持本页面的登录态
 *             2、获取客户端的ckey，构造iframe获取skey，并更新其他页面
 * 为了保证方案2不要刷新太频繁
 * @author xixinhuang
 * @date 2016-03-15
 */

define.pack("./update_cookie",["$","lib","./global.global_function","./global.global_event","./query_user","./ui.mini_tip","./constants","./report_md","./ret_msgs","./request","./module"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        global_function = require('./global.global_function'),
        global_event = require('./global.global_event'),
        query_user = require('./query_user'),
        mini_tip = require('./ui.mini_tip'),
        constants = require('./constants'),
        reportMD = require('./report_md'),
        ret_msgs = require('./ret_msgs'),
        request = require('./request'),
        Module = require('./module'),
        cookie = lib.get('./cookie'),

        heartbeat, // 心跳 timeout ID
        heartbeat_interval = 20 * 60 * 1000, // 心跳间隔时间
        last_update_time,  //记录获取ckey时间，防止死循环
        iframe,
        callback,
        undefined;

    var update_cookie = new Module('update_cookie', {
        // 维持心跳
        try_keep_login: function() {
            var me = this;
            clearTimeout(heartbeat);
            heartbeat = setTimeout(function() {
                me.keep_request().done(function(data) {
                    //mini_tip.warn('try_keep_login' + JSON.stringify(data));
                    //常规更新skey，上报模调统计
                    reportMD(277000034, 177000191);
                }).fail(function(msg, ret) {
                    //维持心跳期间出现登录态失效，也需要更新cookie
                    if(ret_msgs.is_sess_timeout(ret)) {
                        update_cookie.update(function() {
                            //mini_tip.warn(ret + ':' + msg + 'update cookie complete!');
                        });
                    }
                });
                me.try_keep_login();
            }, heartbeat_interval)
        },

        start: function () {
            if (this._ready)
                return;

            this.try_keep_login();

            this._ready = true;
        },

        keep_request: function() {
            var def = $.Deferred(),
                me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskUserConfigGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                //mini_tip.warn('拉取用户中转站信息失败');
                def.reject(msg, ret);
            });
            return def;
        },

        init: function() {
            this.start();
            this.bind_events();
        },

        reload: function() {
            var ckey = this.get_ckey(),
                uin = query_user.get_uin_num(),
                url = 'http://ptlogin2.weiyun.com/wyclient_jump?pt_clientver=5425&pt_src=1&keyindex=18&ptlang=2052&from=3031&clientuin=' + uin + '&clientkey=' + ckey;
            if(ckey && uin) {
                location.href = url;
            }
        },

        update: function(_callback) {
            callback = _callback;

            if(parseInt(cookie.get('wy_uf')) === 1) {
                this.refresh_wx_cookie(true);
                return;
            }

            var me = this,
                ckey = this.get_ckey(),
                tourl = 'http://www.weiyun.com/pc_inner.html',
                uin = query_user.get_uin_num();

            if(!ckey || !uin) {
                return;
            }

            document.domain = 'weiyun.com';
            var url = 'http://ptlogin2.weiyun.com/jump?keyindex=18&clientuin='+ uin + '&clientkey=' + ckey + '&u1=' + encodeURIComponent(tourl);

            iframe = document.createElement('iframe');
            iframe.src = url;
            $(iframe).appendTo(document.body);
            iframe.onload = function(){
                me._ready = true;
                me.start();
            };

            iframe.onerror = iframe.onabort = function(){
                //alert('onerror')
            };
        },

        get_ckey: function() {
            var now = +new Date();
            if(last_update_time && (now - last_update_time<1000)) {
                //防止skey获取不到的时候进入死循环
                return;
            }
            last_update_time = +new Date();

            if(window.external && window.external.GetCkey) {
                return window.external.GetCkey();
            }
            return '';
        },

        /**
         * 更新微信登录态
         * @param is_refresh 是否通知其他页面刷新登录态
         */
        refresh_wx_cookie: function(is_refresh) {
            var wxticket = this.get_wxticket();
            if(wxticket) {
                this.reset_cookies(JSON.parse(wxticket));
            }
            if(callback) {
                callback();
                callback = null;
            }

            if(is_refresh && window.external && window.external.RefreshSkey) {
                window.external.RefreshSkey(wxticket);
            }
        },

        get_wxticket: function() {
            var now = +new Date();
            if(last_update_time && (now - last_update_time<1000)) {
                //防止skey获取不到的时候进入死循环
                return;
            }
            last_update_time = +new Date();

            if(window.external && window.external.GetWXToken) {
                return window.external.GetWXToken();
            }
            return '';
        },

        bind_events: function() {
            var me = this;
            var onmessage = function(e) {
                var obj = me.get_cookies(e.data);
                me.reset_cookies(obj);
                if(callback) {
                    callback();
                    callback = null;
                }
                if(iframe) {
                    document.body.removeChild(iframe);
                    iframe = null;
                }
                if(window.external && window.external.RefreshSkey) {
                    window.external.RefreshSkey(e.data);
                }

                //获取ckey更新登录态，上报模调统计
                reportMD(277000034, 177000192);
            }
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('message', onmessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onmessage', onmessage);
            }

            var refresh_skey_by_client = function(cookie_from_client){
                if(parseInt(cookie.get('wy_uf')) === 1) {
                    me.refresh_wx_cookie(false);
                } else {
                    me.refresh_cookie(cookie_from_client);
                }
            };
            global_function.register('refresh_skey_by_client', refresh_skey_by_client);
        },

        refresh_cookie: function(cookie_from_client) {
            var obj = this.get_cookies(cookie_from_client);
            this.reset_cookies(obj);
        },

        reset_cookies: function(obj) {
            var opition = {
                raw: true,
                domain: constants.MAIN_DOMAIN,
                path: '/'
            };
            for(var key in obj) {
                cookie.set(key, obj[key], opition);
            }
        },

        get_cookies: function(cookie_str) {
            var key,
                res = {},
                cookies = cookie_str.split('; ');
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                key = parts.shift();
                res[key] = parts.join('');
            }

            return res;
        }
    });

    return update_cookie;
});
/**
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
	     * 解析url参数
	     * @param {String} url
	     */
	    parse_params: function(url) {
		    url = url || window.location.href;
		    var query = {}, params = [], value = [];
		    if (url.indexOf('?') != -1) {
			    params = url.substr(url.indexOf('?') + 1).split('&');
			    for(var i=0, len=params.length; i<len; i++) {
				    value = params[i].split('=');
				    if(value[0]) {
					    query[value[0]] = decodeURIComponent(value[1]) || null;
				    }
			    }
		    }
		    return query;
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
define.pack("./user_log",["lib","$","./constants","./query_user","./urls","./configs.ops","./stat_log","./util.https_tool"],function (require, exports, module) {
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

        stat_log = require('./stat_log'),
        https_tool = require('./util.https_tool'),

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

    cgi_url = https_tool.translate_cgi(cgi_url);
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

            //这里增加一个新的上报，等数据稳定后就可以废弃旧的上报
            //同时上传和下载的上报不需要新的上报了
            if(op != 9136 && op != 9137 && op != 9138 && op != 515){
                stat_log.click_log(op_or_name, ret, params, extra_config);
            }
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
define.pack("./util.Copy",["lib","$","./constants"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        constants = require('./constants'),
        console = lib.get('./console'),

        ie = $.browser.msie,
        ie6 = ie && $.browser.version < 7,
        MOVIE_PATH = require.resolve('publics/plugins/ZeroClipboard/') + 'WyZeroClipboard.swf',

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
                //bugfix 在视频云播页面不更新title
                var is_need_refresh = document.title.indexOf('微云视频') > -1? false : true;

                WyZeroClipboard.console = console;
                WyZeroClipboard.IS_APPBOX = is_appbox;
                WyZeroClipboard.setDefaults( {allowScriptAccess: "always",trustedDomains: 'www.weiyun.com' } );
                if(!singleton_clip) {
                    singleton_clip = new WyZeroClipboard(null, {
                        moviePath: MOVIE_PATH,
                        hoverClass: flash_hover_class//flash会影响到DOM的hover效果，所以要使用增加样式名来控制
                    });
                    if(is_need_refresh) {
                        document.title = is_appbox ? '微云' : '微云网页版';
                    }
                    singleton_clip.addEventListener('load', function(clip) {
                        if(is_need_refresh) {
                            document.title = is_appbox ? '微云' : '微云网页版';
                        }
                    });

                    singleton_clip.addEventListener('mousedown', function() {
                        var copy_text = singleton_clip.target_ctx.trigger('provide_text');
                        singleton_clip.setText(copy_text);
                    });
                    singleton_clip.addEventListener('complete', function() {
                        singleton_clip.target_ctx.trigger('copy_done');
                        // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug
                        if(is_need_refresh) {
                            document.title = is_appbox ? '微云' : '微云网页版';
                        }

                    });

                    singleton_clip.addEventListener('mouseout', function() {
                        singleton_clip.target_ctx.trigger('mouseout');
                    });
                }
               $(me.container_selector ? me.container_selector : 'body').on('mouseenter.copyfun', me.target_selector, function(e) {
                   me._$cur_target = $(this);
                   singleton_clip.setCurrent(me._$cur_target[0]);
                   singleton_clip.target_ctx = me;//保存当前copy对象的引用，后续事件触发的对象为该引用
                   me.trigger('mouseover');
                   e.stopPropagation();  //阻止事件冒泡，防止多次设置target_ctx
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
            if (b.msie || window.ActiveXObject !== undefined) {
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
 * https相关url进行转换
 * @author hibincheng
 * @date 2014-09-22
 */
define.pack("./util.https_tool",["lib","$","./constants"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        constants = require('./constants'),

        //目前只有分片上传支持https
        support_https_upload_type = [
            'webkit_plugin',
            'active_plugin',
            'upload_h5_flash'
        ],

        undefined;

    //采用架平的域名转发平台,联系人@clusterli
    var map = {
        "disk.cgi.weiyun.com": "user.weiyun.com/disk/",
        "pre.cgi.weiyun.com": "user.weiyun.com/pre/",
        "stat.cgi.weiyun.com": "user.weiyun.com/stat/",
        //"api.weiyun.com": "user.weiyun.com/newcgi/",
        "web2.cgi.weiyun.com": "user.weiyun.com/newcgi/",

        "download.cgi.weiyun.com": "user.weiyun.com/download/",
        "tj.cgi.weiyun.com": "user.weiyun.com/tj/",
        "web.cgi.weiyun.com": "user.weiyun.com/oldcgi/",
        "diffsync.cgi.weiyun.com": "user.weiyun.com/diffsync/",

        "docview.weiyun.com": "user.weiyun.com/docview/",
        "user.weiyun.com": "user.weiyun.com/",

        "c.isdspeed.qq.com": "user.weiyun.com/isdspeed/c/",
        "p.qpic.cn": "user.weiyun.com/",
        "shp.qpic.cn": "user.weiyun.com/notepic/",
        "wx.cgi.weiyun.com": "user.weiyun.com/wx/",
	    "www.weiyun.com": "www.weiyun.com/",
	    "share.weiyun.com": "share.weiyun.com/",
	    "h5.weiyun.com": "h5.weiyun.com/",
	    "mp.weixin.qq.com": "mp.weixin.qq.com/"
    };

    function translate_url(url) {
        var link = document.createElement('a');

        link.href = url;
        var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'

        return constants.HTTP_PROTOCOL + '//' + translate_host(link.hostname) + (link.port ? (':' + translate_port(link.port)) : '') + pathname + link.search + link.hash;
    }

    function translate_download_url(url) {
        var link;

        if(constants.IS_APPBOX) {
            link = document.createElement('a');
            link.href = url;
            var pathname = link.pathname.indexOf('/') === 0 ? link.pathname : '/' + link.pathname; //ie6、7、8不标准获取的pathname前面不带'/'
            return link.protocol + '//' + translate_host(link.hostname) + (link.port ? (':' + link.port) : '') + pathname + link.search + link.hash;
        } else {
            return translate_url(url);
        }

    }

    function translate_host(host) {
        if(!host) {
            return host;
        }

        if(host.indexOf('.ftn.') > -1) { //host中带".ftn."的认为是ftn的上传下载url;
            return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
        }

        return host.replace(/\.qq\.com/, '.weiyun.com');
    }

    function translate_port(port) {
        if(constants.IS_HTTPS) {
            return constants.HTTPS_PORT;
        }
        return port;
    }

    function translate_ftnup_port(port, upload_type) {
        if(constants.IS_APPBOX) { // appbox 先不支持https
            return port;
        }
        if(constants.IS_HTTPS) {
            return $.inArray(upload_type, support_https_upload_type) > -1 ? constants.HTTPS_PORT : port;
        }

        return port;
    }

    function translate_cgi(cgi) {
        var m = /^https?:\/\/([\w\.]+)(?:\/(.+))?/.exec(cgi);
        if(!constants.IS_HTTPS && constants.IS_DEBUG) { //debug时，方便联调cgi
            return cgi;
        }
        if(m && m[1] && map[m[1]]) {
            cgi =  constants.HTTP_PROTOCOL + '//' + map[m[1]] + (m[2] || '');
        }

        return cgi;
    }

    /**
     * 对笔记内的图片用h5.weiyun.com来代理
     * 1/解决跨域;  2/复制粘贴图片时保证外站图片也能通过https访问
     * @param notepic_url
     * @returns {*}
     */
    function translate_notepic_url(notepic_url) {
        if(!notepic_url) {
          return '';
        } else if (notepic_url.indexOf('tx_tls_gate') === -1) {
            notepic_url = 'https://h5.weiyun.com/tx_tls_gate=' + notepic_url.replace(/^http:\/\/|^https:\/\//, '');
        }
        return notepic_url;
    }

    return {
        translate_url: translate_url,
        translate_download_url: translate_download_url,
        translate_notepic_url: translate_notepic_url,
        translate_host: translate_host,
        translate_port: translate_port,
        translate_cgi: translate_cgi,
        translate_ftnup_port: translate_ftnup_port
    };
});/**
 * 上报日志到闹歌系统
 * @date 2015-02-28
 * @author hibincheng
 */
define.pack("./util.logger",["lib","$","./query_user","./constants","./report_md"],function(require, exports, module) {
	var lib = require('lib'),
		$ = require('$'),

		query_user = require('./query_user'),
		constants = require('./constants'),
		reportMD = require('./report_md'),
		console = lib.get('./console'),
		date_time = lib.get('./date_time'),
		undefined;

	var uin = query_user.get_uin_num(),
		view_key = 'weiyun_' + uin,
		last_time,
		cache_log = [],
		timer = {},
		ie67 = $.browser.msie && $.browser.version < 8;

	/**
	 * 上报罗盘log，获取用户的错误记录，以便处理用户反馈
	 * @param key
	 * @param str
	 */
	function report(key, str) {
		if(ie67) {
			return;
		}

		if(!str) {
			str = key;
			key = view_key;
		}

		try {
			var request,
				now = new Date().getTime(),
				take_time = last_time ? (now - last_time) / 1000 : 4,
				url = constants.IS_HTTPS ? 'https://www.weiyun.com/log/post/' + key : 'http://www.weiyun.com/log/post/' + key;

			var user_log = [], user_date, line, rep_log = [];
			if(typeof str === 'object') {
				str.time = new Date().toString();
				str.uin = uin;
				if(str.url) {
					url = str.url;
				}
				if(str.report_console_log) {
					str.log = console.get_log();
				}
				//构造日志内容
				user_log.push('【用户日志】');
				if(str.time) {
					user_log.push('记录时间 ' + date_time.timestamp2date_ymdhm(new Date(str.time).getTime()));
				}
				if(str.uin) {
					user_log.push('uin ' + str.uin);
				}
				for(var key in str.log) {
					if(str.log[key] && str.log[key].length) {
						//只取前10条log，避免上报数据太大
						rep_log = str.log[key].slice(-10);
						user_log.push('\n【' + key + '】：');
						for(var i = 0, len = rep_log.length; i < len; i++) {
							line = rep_log[i];
							user_log.push('[' + line[0] + '] ' + (line[2] ? ('[' + line[2] + '] ') : '') + line[1]);
						}
					}
				}
				str = user_log.join('\n') + '\n';
			} else {
				str = 'time:' + new Date().toString() + 'uin:' + uin + ' ' + str;
			}
			//三秒上报一次, 这里last_time标识上次上报的时间点。
			if(take_time > 3) {
				timer && clearTimeout(timer);
				cache_log.push(str);
				timer = (function(reportUrl) {
					setTimeout(function() {
						$.ajax({
							url: reportUrl,
							type: 'post',
							data: cache_log.join('\n'),
							contentType: 'text/plain',
							xhrFields: {
								withCredentials: true
							}
						});
						cache_log = [];
					}, 3 * 1000);
				})(url);
				last_time = now;
			} else {
				cache_log.push(str);
			}
		} catch(e) {
		}
	}

	/**
	 * 写控制台信息并上报罗盘、返回码
	 * 都会上报成功
	 * @param log
	 * @param mode
	 * @param ret
	 */
	function write(log, mode, ret) {
		var now = new Date().getTime(),
			take_time = last_time ? (now - last_time) / 1000 : 4,
			url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
			interfaceMap = {
				'upload_error': 177000185,
				'upload_plugin_error': 177000186,
				'upload_html5_pro_error': 178000358,
				'offline_download_error': 179000151,
				'save_note_error': 179000177,
				'download_error': 177000187,
				'disk_error': 178000314,
				'flash_error': 177000197,
				'hash_error': 178000306
			};

		if(log instanceof Array) {
			for(var i=0, len=log.length; i<len; i++) {
				console.log(log[i]);
			}
		} else if(log instanceof String) {
			console.log(log);
		}

		report({
			report_console_log: true,
			url: url
		});

		if(mode && (typeof ret != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
		}
	}

	/**
	 * 若是成功，则上报模调
	 * 若是失败，则分别上报罗盘和模调
	 * @param log
	 * @param mode
	 * @param ret
	 * @param result 0：成功，1:失败，2:逻辑失败
	 */
	function dcmdWrite(log, mode, ret, result) {
		result = result || 0;
		var now = new Date().getTime(),
			take_time = last_time ? (now - last_time) / 1000 : 4,
			url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
			interfaceMap = {
				'video_preview_monitor': 179000145,
				'offline_download_monitor': 179000152,
				'web_capacity_purchase_monitor': 17900205
			};

		if(log instanceof Array) {
			for(var i=0, len=log.length; i<len; i++) {
				console.log(log[i]);
			}
		} else if(log instanceof String) {
			console.log(log);
		}

		// 成功不上报罗盘
		result && report({
			report_console_log: true,
			url: url
		});

		if(mode && (typeof ret != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
		}
	}

	//前台JS错误监控，目前针对：下载文件，参数错误(错误码1000500)上报
	function monitor(mode, ret, result) {
		var interfaceMap = {
				'js_download_error': 178000367
			};

		if(mode && (typeof ret != undefined) && (typeof result != undefined)) {
			reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
		}
	}

	return {
		report: report,
		write: write,
		monitor: monitor,
		dcmdWrite: dcmdWrite
	}
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

        IE_NEWEST_PLUGIN_VERSION = '1.0.3.20',//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION = '1.0.1.16',//webkit控件最新的版本号

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
        if($.browser.msie || window.ActiveXObject !== undefined) {
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

    //获得当前的上传控件版本
    function get_cur_upload_plugin_version() {
        if(constants.IS_APPBOX){
            if(window.external.GetVersion){
                return window.external.GetVersion();
            }else{
                return 0;
            }
        }
        if($.browser.msie || window.ActiveXObject !== undefined) {
            return parseInt(ie_plugin_version().split('.').join(''), 10);
        } else {
            return parseInt(webkit_plugin_version().split('.').join(''), 10);
        }
    }

    //获取控件的版本号，当老控件不存在版本时返回0
    return {
        IE_NEWEST_PLUGIN_VERSION: IE_NEWEST_PLUGIN_VERSION,//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION: WEBKIT_NEWEST_PLUGIN_VERSION,//webkit控件最新的版本号
        get_ie_plugin_version: ie_plugin_version,
        get_webkit_plugin_version: webkit_plugin_version,
        is_newest_version: is_newest_version,
        get_cur_upload_plugin_version: get_cur_upload_plugin_version
    };

});/**
 * 基于文档预览有office预览和永中预览两套方案，而office预览能支持的文件和浏览器有限，所以当office预览不支持时降级采用永中预览
 * 后续图片和压缩包预览都可以整进来作为统一的入口，然后再分派对应的预览模块进行预览
 * @author hibincheng
 * @date 2014-05-12
 */
define.pack("./util.preview_dispatcher",["lib","$","./module","./constants","./file.file_object","./ui.widgets","./query_user","./huatuo_speed"],function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        routers = lib.get('./routers'),

        Module =require('./module'),
        constants = require('./constants'),
        File = require('./file.file_object'),
        widgets = require('./ui.widgets'),
        query_user = require('./query_user'),
	    huatuo_speed = require('./huatuo_speed'),

        OFFICE_PREVIEW_TYPES = { xls: 1, xlsx: 1,  doc: 1, docx: 1,  ppt: 1, pptx: 1},//微软预览支持的文件类型
        FTN_PREVIEW_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, rtf: 1, ppt: 1, pptx: 1, pdf: 1,txt: 1 },
        ie67 = $.browser.msie && $.browser.version < 8,//ie67不支持office预览
        ie8 = $.browser.msie && ($.browser.version == 8),
        MB_1 = 1024 * 1024,

        doc_preview,   //永中预览模块
        office_preview, //office预览模块
        ftn_preview,    //ftn预览模块

        downloader, //下载模块

        undefined;

    var user_uin = query_user.get_uin_num() + '';
    var alpha_user = query_user.is_alpha_user();

    var can_use_ftn = function() {
        //return $.inArray(user_uin.split('').pop(), uin_suffix) > -1 || $.inArray(user_uin, white_list) > -1;  //灰度帐号
        return true;
    };

    var preview_dispatcher = new Module('preview_dispatcher', {

        is_preview_doc: function(file) {
           var file_name = file.get_name(),
                type_support = this.is_preview_by_name(file_name);
           //离线文件暂时不让预览
           if(file.is_offline_node && file.is_offline_node()) {
               return false;
           }
           return type_support;
        },

        /**
         * 根据扩展名判断该文件是否是可预览类型
         * @param file_name
         */
        is_preview_by_name: function(file_name) {
            //直接获取后缀名来判断，因为使用get_type() xlsm会被认为xls，但xlsm还不能预览
            var type = (File.get_ext(file_name, false) || '').toLowerCase();
            if(ie67) { //ie67不支持
                return false;
            }
            return (type in OFFICE_PREVIEW_TYPES) || (type in FTN_PREVIEW_TYPES);
        },

        //判断是否支持微软预览，此次避免影响现有的预览类型
        can_ms_preview: function(file) {
            var type = (File.get_ext(file.get_name(), false) || '').toLowerCase();
            if(ie67) { //ie67不支持
                return false;
            }
            //离线文件暂时不让预览
            if(file.is_offline_node && file.is_offline_node()) {
                return false;
            }
            return (type in OFFICE_PREVIEW_TYPES);
        },

        preview: function(file) {
            var me = this,
                type = (file.get_type() || '').toUpperCase(),
                limit_size = (type === 'XLS' || type == 'XLSX')? constants.DOC_PREVIEW_SIZE_LIMIT['XLS'] : constants.DOC_PREVIEW_SIZE_LIMIT['DEFAULT'],
                limit_mb = limit_size/MB_1,
                is_pass_limit = file.get_size() > limit_size;

            /*if(is_pass_limit) { // office预览，超过大小限制，则采用提示下载
                this.guide_to_download(file, limit_mb);
                return;
            }*/
            //压缩包内文档暂不支持预览
            /*if(file.is_compress_inner_node && file.is_compress_inner_node()) {//压缩包内文件预览，则不尝试appbox全屏预览
                me.preview_doc(file);
            }*/
            me.appbox_preview(file).fail(function() {
                me.preview_doc(file);
            });
        },
        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} file
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (file) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(file.get_name()));
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        full_screen_preview.preview(file);
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + file.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },

        /**
         * 文档预览
         * @param {FileObject} file
         * @private
         */
        preview_doc: function (file) {
            if(can_use_ftn() || (file.get_type() || '').toLowerCase() == 'txt') {
                if(ftn_preview) {
                    ftn_preview.preview(file);
                } else {
                    //测速
                    var js_css_start = new Date();
                    require.async('ftn_preview', function(mod) {//测速
	                    try{
		                    var flag = '21254-1-16';
		                    huatuo_speed.store_point(flag, 2, new Date() - js_css_start);
		                    huatuo_speed.report();
	                    } catch(e) {

	                    }
                        ftn_preview = mod.get('./ftn_preview');
                        ftn_preview.preview(file);
                    });
                }
            } else {
                if(office_preview) {
                    office_preview.preview(file);
                } else {
                    require.async('office_preview', function (mod) {
                        office_preview = mod.get('./office_preview');
                        office_preview.preview(file);
                    });
                }
            }
        },

        /**
         * 大于限制预览大小即提示下载
         * @param {FileNode} file
         * @param {Number} limit_mb 预览文件限制大小
         */
        guide_to_download: function(file, limit_mb) {
            widgets.confirm('温馨提示', '您访问的文件大于' + limit_mb + 'MB，暂时无法在线预览，请下载后在电脑中打开。', '', function(e) {
                if(file.is_compress_inner_node && file.is_compress_inner_node() && file.down_file) {//压缩包内文件，使用自身的下载方法
                    file.down_file();
                    return;
                }
                if(!downloader) {
                    require.async('downloader', function(mod) {
                        downloader = mod.get('./downloader');
                        downloader.down(file, e);
                    });
                } else {
                    downloader.down(file, e);
                }
            }, $.noop, ['下载', '取消']);
        }
    });

    return preview_dispatcher;
});/**
 * node webapp 请求
 * @author iscowei
 * @date 16-02-29
 */
define.pack("./webapp",["$","lib","./constants","./pb_cmds"],function (require, exports, module) {
	var $ = require('$');
	var lib = require('lib');
	var constants = require('./constants');
	var pb_cmds = require('./pb_cmds');
	var cookie = lib('./cookie');

	/**
	 * 计算token
	 * @returns {string}
	 */
	var _token = function(token) {
		token = token || '';
		var hash = 5381;
		for (var i = 0, len = token.length; i < len; ++i) {
			hash += (hash << 5) + token.charCodeAt(i);
		}
		return hash & 0x7fffffff;
	};

	/**
	 * 获取 g_tk
	 * @returns {string}
	 */
	var get_g_tk = function () {
		return  _token(cookie.get('p_skey') || cookie.get('skey') || cookie.get('rv2') || cookie.get('wx_login_ticket') || '');
	};

	/**
	 * 把多层级的object展开，层级间用.分隔。{a: {b: c, d: e}} -> {a.b: c, a.d: e}
	 * @returns {object}
	 */
	var flatObj = function(data) {
		var _result = {};
		var _flat = function(preKey, d) {
			var type = Object.prototype.toString.call(d),
				key, k;
			if(type !== '[object Object]' && type !== '[object Array]') {
				if(!preKey) {
					_result = d;
				} else {
					_result[preKey] = d;
				}

				return;
			}
			for(key in d) {
				k = (!!preKey ? preKey + '.' : '') + (type === '[object Array]' ? '_Array' : '') + key;
				_flat(k, d[key]);
			}
		};
		_flat('', data);
		return _result;
	};

	return new function() {
		this.request = function(opt) {
			opt = $.extend({
				protocol: 'weiyun',
				cmd: '',
				type: 'GET',
				data: {}
			}, opt);

			var defer   = $.Deferred();
			var path = '/webapp/json/' + opt.protocol + '/' + opt.cmd;
			var browser_name = constants.browser_name ? '_' + constants.browser_name : '';
			var os_name = constants.os_name ? '_' + constants.os_name : '';
			var common = {
				refer: constants.UI_VER + browser_name + os_name,
				g_tk: get_g_tk(),
				r: Math.random()
			};

			//rcn
			opt.data.cmd = pb_cmds.get(opt.cmd);

			$.ajax({
				type: opt.type || 'GET',
				url: path + '?' + $.param(common),
				data: {
					data: JSON.stringify(opt.data)
				},
				dataType: 'json',
				timeout: 20000,
				success: function(data, status, xhr) {
					if(xhr.status == 200) {
						if(data.ret == 0) {
							defer.resolve(data);
						} else {
							defer.reject(data);
						}
					} else {
						defer.reject({
							ret: xhr.status,
							msg: status || ''
						});
					}
				},
				error: function(xhr, errorType, error) {
					defer.reject({
						ret: xhr.code || -400,
						msg: '网络连接失败'
					});
				}
			});

			return defer;
		};
	};
});
//tmpl file list:
//common/src/ui/blank_tip.tmpl.html
//common/src/ui/context_menu.tmpl.html
//common/src/ui/mini_holding_tip.tmpl.html
//common/src/ui/mini_tip.tmpl.html
//common/src/ui/mini_tip_v2.tmpl.html
//common/src/ui/progress.tmpl.html
//common/src/ui/scroll_bar.tmpl.html
//common/src/ui/toast.tmpl.html
//common/src/ui/toolbar/toolbar.tmpl.html
//common/src/ui/widgets.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'blank_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var icon_class = data.icon_class;
        var title = data.title;
        var content = data.content;
    __p.push('    <div class="empty-box">\r\n\
        <!-- 最近为空 -->\r\n\
        <div class="status-inner" style="">\r\n\
            <i class="icon ');
_p(icon_class);
__p.push('"></i>\r\n\
            <h2 class="title">');
_p(title);
__p.push('</h2>\r\n\
            <p class="txt">');
_p(content);
__p.push('~</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

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
        <ul class="large ');
_p( data.use_small ? 'small' : '' );
__p.push('"  style="');
_p(data.width ? 'width:'+data.width+'px;' : '');
__p.push('">');

            $.each(items, function (i, item) { __p.push('            ');
 if(item.config.type === 'split') { __p.push('            <li class="split"><div class="line"><div></div></div></li>');
 } else { __p.push('            ');
 if(item.config.split === true ) { __p.push('            <li class="split"><div class="line"><div></div></div></li>');
 } __p.push('            <li data-action="item" data-item-id="');
_p( item.config.id );
__p.push('" ');
_p(click_tj.make_tj_str(item.config.tj_id));
__p.push('            ><a href="javascript:void(0);" hidefocus="on"\r\n\
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
 } __p.push('            ');
 }); __p.push('        </ul>');
 if (arrow) {__p.push('        <s class="ui-arr"></s>\r\n\
        <s class="ui-arr ui-tarr"></s>');
 } __p.push('    </div>');

return __p.join("");
},

'context_menu_v2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
    $ = require('$'),

    constants = require('./constants'),
    click_tj = require('./configs.click_tj'),
    arrow = data.arrow,
    items = data.items || [],
    length = items.length;
    __p.push('    <div data-no-selection data-comm-ctxtmenu class="mod-bubble-menu with-border on" id="js-menu-two" style="left: 800px;">\r\n\
        <ul>');

            $.each(items, function (i, item) { __p.push('            <li data-action="item" class="menu-item" data-item-id="');
_p( item.config.id );
__p.push('" ');
_p(click_tj.make_tj_str(item.config.tj_id));
__p.push('>\r\n\
            <span data-action="text" class="txt">');
_p( item.config.text);
__p.push('</span>\r\n\
            </li>');
 }); __p.push('        </ul>\r\n\
    </div>');

return __p.join("");
},

'mini_holding_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="mod-msg mod-holder">\r\n\
        <div class="msg-inner clearfix">\r\n\
            <p class="txt">\r\n\
                <i class="icon icon-msg" aria-hidden="true"></i>\r\n\
                <span class="j-msg-text"></span>\r\n\
                <a href="" class="txt-link j-link-btn"></a>\r\n\
            </p>\r\n\
            <a href="javascript:void(0)" class="act-wrapper">\r\n\
                <i class="icon icon-msg-close j-close-btn">关闭</i>\r\n\
            </a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'mini_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-tip-box" style="display:none">\r\n\
        <span class="full-tip"><span class="inner"><i class="ico"></i><span class="text" data-id="label"></span></span></span>\r\n\
    </div>');

return __p.join("");
},

'mini_tip_v2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="mod-msg">\r\n\
        <div class="msg-inner clearfix">\r\n\
            <p>\r\n\
                <i class="icon icon-msg" aria-hidden="true"></i>\r\n\
                <span data-id="label"></span>\r\n\
            </p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'progress': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var img_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/loading-tip.gif';
    __p.push('    <div class="full-msg" style="display:none;">\r\n\
        <span class="msg-inner">\r\n\
            <img src="');
_p(img_url);
__p.push('">\r\n\
            <span data-id="label"></span>\r\n\
        </span>\r\n\
    </div>');

return __p.join("");
},

'g_scrollbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="g-scrollbar" style="display:none">\r\n\
        <div class="wraper" data-action="wraper">\r\n\
            <div class="dragger" data-action="dragger">\r\n\
                <div class="bar" data-action="bar"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'toast': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="full-msg" data-no-selection="true" style="display:none">\r\n\
		<span class="msg-inner">\r\n\
			<img data-id="toast-loading" src="http://imgcache.qq.com/vipstyle/nr/box/img/loading-tip.gif" style="display: none;">\r\n\
			<span data-id="toast-label"></span>\r\n\
			<span data-id="remain-time" style="color: #868686;"></span>\r\n\
		</span>\r\n\
	</div>');

return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var Button = require('./ui.toolbar.button'),
        ButtonGroup = require('./ui.toolbar.button_group');
    __p.push('    <div class="toolbar-btn clear">\r\n\
        <div class="btn-message">');

            for (var i=0, l=data.btns.length; i<l; i++) {
                var btn = data.btns[i];
                if (ButtonGroup.is_instance(btn)) {
                    _p( this.toolbar_button_group(btn) );

                } else if (Button.is_instance(btn)) {
                    _p( this.toolbar_button(btn) );

                } else
                __p.push('<span data-no-selection class="btn-gap"></span>');

            }
            __p.push('        </div>\r\n\
    </div>');

return __p.join("");
},

'toolbar_button': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var btn = data; __p.push('    <a data-btn-id="');
_p( btn.get_id() );
__p.push('" data-no-selection class="g-btn g-btn-gray ');
_p( btn._o.cls );
__p.push(' ');
_p( btn.update_enable && data.err_tip ? 'disable' : '' );
__p.push('" style="');
_p( data._visible ? '' : 'display:none;' );
__p.push('" href="#" tabindex="-1"><span class="btn-inner ');
_p( !btn._o.label ? 'minpad' : '');
__p.push('">');
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
            text = lib.get('./text');
    __p.push('    <div data-no-selection class="full-pop full-pop-small" style="display:none;">\r\n\
        <h3 class="full-pop-header"><div class="inner _title">');
_p( text.text(data.title) );
__p.push('</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-alert"><div class="alert-inner">\r\n\
                <i class="ico"></i>\r\n\
                <h4 class="title">');
_p( data.escape_html ? text.text(data.msg) : data.msg );
__p.push('</h4>\r\n\
                <p class="info" title="');
_p( text.text(data.tip) );
__p.push('">');
_p( data.escape_html ? text.text(data.desc) : data.desc );
__p.push('</p>\r\n\
            </div></div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn">\r\n\
            <a class="_ok g-btn g-btn-blue" href="javascript:void(0)"><span class="btn-inner">');
_p( data.button_texts[0] ? text.text(data.button_texts[0]) : '确定' );
__p.push('</span></a>\r\n\
            <a class="_x g-btn g-btn-gray" href="javascript:void(0)"><span class="btn-inner">');
_p( data.button_texts[1] ? text.text(data.button_texts[1]) : '取消' );
__p.push('</span></a>\r\n\
        </div>\r\n\
        <a href="javascript:void(0)" class="_x full-pop-close" title="关闭">×</a>\r\n\
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
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            lib = require('lib'),
            text = lib.get('./text'),
            inner_tag = data.config.form_dialog ? 'form':'div';
    __p.push('    <div data-no-selection class="full-pop ');
_p( text.text(data.config.klass) );
__p.push('" style="">\r\n\
        <h3 class="full-pop-header"><div class="inner __title">');
_p( text.text(data.config.title) );
__p.push('</div></h3>\r\n\
        <div class="full-pop-content __content">\r\n\
        </div>\r\n\
        <div class="full-pop-btn __buttons">\r\n\
            <span class="__msg infor err"></span>');

                $.each(data.buttons || [], function(i, btn) {
                    var cls = text.text(btn.klass);
            __p.push('                <a data-id="button" data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( cls );
__p.push('" href="javascript:void(0);">\r\n\
                    <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                </a>');

                });
            __p.push('        </div>\r\n\
        <a data-btn-id="CANCEL" href="javascript:void(0)" class="full-pop-close" title="关闭">×</a>\r\n\
    </div>');

}
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
