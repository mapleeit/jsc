define(function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),
        console = require('lib').get('./console'),
        constants = common.get('./constants'),
        main = require('main').get('./main'),
        query_user = common.get('./query_user'),
	    upload_route = require('./upload_route'),

        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,
        undefined;
    var g = {};

    g.upload_error = {

        //come from erric
        //高频码 - 错误类
        404: {
            simple : '连接失败',
            normal : '网络中断，暂时连接不上服务器，请重试'
        },
        10060: {
            simple : '连接失败',
            tip : '未能连接服务器，请重试。',
            normal : '未能连接服务器，请重试。{反馈}'
        },
        100009: {
            simple : '获取文件失败',
            normal : '获取源文件信息失败，请尝试重新上传'
        },
        1000: {
            simple : '上传出错',
            tip : '上传出错，请重试。',
            normal : '上传出错，请重试。{反馈}'
        },

        10001: '网络中断，控件上传超时，请检查网络并重试上传',//控件超时
        10002: '网络中断，拖曳上传超时，请检查网络并重试上传',//拖拽h5上传超时
        10003: '网络中断，请检查网络并重试上传',//纯h5上传出错

        //扫描过程中删除了本地文件
        2: '文件已被删除',
        3: '文件已被删除',
        '-5950': '文件已被删除',

         //上传过程中删除了本地文件
        '-5999': '文件已被删除',
        6: '文件已被删除',
        32: '另一个程序正在使用此文件',
        21: '设备未就绪,上传失败',
        1392: '文件或目录损坏，无法读取',
        53: '网络链接失败，请检查网络',
        87: '网络文件不可读取，请检查网络',
        5: '文件没有访问权限',

	    190011: '您的登录态已失效，请<a href="//www.weiyun.com" target="_self">重新登录</a>',
        190040: '你已被禁止上传文件',   //UIN在黑名单中
        190049: '可能违反互联网法律法规或腾讯服务协议',   //文件在黑名单中
        190067: '文件名存在敏感文字',
        190072: '系统升级维护，暂不支持该操作',

        32221980: '上传过程中文件被修改，请重新上传',

        32252995: '上传过程中微云文件目录被删除',

        92260005: '文件上传过程中被修改，请重新上传',

        //高频码 - 逻辑限制类
        //web本地验证错误码
        1000001: {
            simple : '文件大小超出限制，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
	            ? '请开启浏览器flash插件' : $.browser.msie ? '请<a href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>'),
            normal : '上传失败，文件大小超出限制，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
	            ? '请开启浏览器flash插件' : $.browser.msie ? '请<a href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>')
        },
        1000002:'',
        1000003: {
            simple : '容量不足',
            normal : '容量不足，请删除一些旧文件后重试'
        },
        1000004: '文件大小为空',
        1000005: {//老控件时，超过大小提示，非控件或cgi返回 by hibincheng
            simple : '文件过大',
            normal : '上传失败，文件大小超出限制'
        },
        1000006:'文件名为空，不支持上传',
        1000007:'文件名不能包含以下字符之一 /\\:?*\"><|',
        1000008:'文件名过长，请重命名后重传',
        1000009:'视频文件暂无法上传',
        1000010: query_user.get_cached_user() && query_user.get_cached_user().is_weiyun_vip() ?
                    '单文件大小超限，会员用户请下载<a href="http://www.weiyun.com/download.html?source=windows" target="_blank">Windows客户端</a>体验更多特权' : '单文件大小超限',
        1000011: $.browser.safari ? 'safari暂不支持文件夹上传，您可以使用chrome体验此功能' : '暂不支持上传文件夹，请检查flash插件是否可用，<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>',
	    1000012: 'Flash上传出错，请检查插件或重试上传，<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>',
        1000013: '上传参数出错，请重新上传',
	    1000014: '读取文件出错，请检查文件后重试上传',
	    1000015: '文件超过当日剩余流量',

	    //200000以上错误码定义h5极速上传的逻辑错误
	    2000001: '读取文件出错，请检查文件后重试上传',
	    2000002: '扫描文件出错，请重试上传',
	    2000003: '文件扫描结果异常，请重试上传',
	    2000004: '申请分配上传空间出错，请重试上传',
	    2000005: '上传通道中断，{续传文件}[2000005]', //执行通道上传，但却没有正确的通道信息
	    2000006: '网络异常，文件上传中断，{续传文件}',
	    2000007: '分片上传失败，{续传文件}[2000007]', //通道上传server返回错误的retcode
	    2000008: '分片上传失败，{续传文件}[2000008]', //重复上传的通道id
	    2000009: '网速过低，文件上传超时，{续传文件}', //上传请求超时
	    2000010: '网速过低，文件上传超时，请重试上传', //createfile的时候就超时（这种一般出现在网速很慢，文件小于512K的情况下，createfile同时上传文件）
	    2000011: '上传时效过期，请重新上传', //暂停5分钟后重新上传，时效过期，需重新createfile（一般会静默重新发起createfile，如果在用户侧出现这个提示，需要检查代码逻辑）

        1053: {
            simple : '容量不足',
            normal : '容量不足，请删除一些旧文件后重试'
        },
        1083: {
            simple : '文件过多',
            normal : '该目录下文件过多，请选择其他目录'
        },

	    1024: '您的登录态已失效，请<a href="//www.weiyun.com" target="_self">重新登录</a>',

        1126: {
            simple : '文件过大',
            normal : '上传失败，文件大小超出限制'
        },

        //低频码 - 逻辑类
        1051: {
            simple : '文件同名',
            normal : '该目录下已存在同名文件'
        },
        1016: {
            simple : '相册还没初始化',
            normal : '请先访问相册再上传照片到相册'
        },
        1019: {
            simple : '目录已被删除',
            normal : '上传目录已被删除，请另选目录'
        },
        1028: {
            simple : '微云文件过多',
            normal : '微云中文件过多，请删除一些旧文件后重试'
        },
        1088: {
            simple : '文件名不合法',
            normal : '文件名包含特殊字符，请重命名后重传'
        },
        100027: '无效的字符',
        8: {
            simple : '文件名过长',
            normal : '文件名过长，请重命名后重传'
        },
        16: '文件大小为空',
        17: '文件已被删除',
        1029: {
            simple: '单文件大小超限',
	        tip : '您的浏览器暂不支持上传10M以上的文件，' + (window.navigator.userAgent.toLowerCase().search('edge') >= 0
			        ? '请开启浏览器flash插件' : $.browser.msie ? '请<a href="https://www.weiyun.com/plugin_install.html" target="_blank">安装上传控件</a>' : '请<a href="https://get.adobe.com/flashplayer/" target="_blank">安装或升级Flash</a>'),
            normal: '单文件大小超限，{开通会员}支持大文件上传'
        },
        101: '目录所在层级过深，请上传至其他目录',  //code by bondli 特殊设置了错误码
        102: '目录创建失败(目录达到上限)，无法上传',
        103: '子目录创建失败，无法上传',
        190013: '请求参数错误，请稍后尝试',
        190042: '服务器超时，请稍后尝试',
        190045: '网络失败，请稍后尝试',
        1013: '系统繁忙，请稍后尝试',
        1026: '父目录不存在，请另选目录',
        1127: {
            simple: '今日已达到文件上传上限',
            normal: '今日已达到文件上传上限，{开通会员}上传更多文件'
        },
	    1137: '您的登录态已失效，请<a href="//www.weiyun.com" target="_self">重新登录</a>'
    };
    g.download_error = {
        1:"下载失败，请重新下载。",
        2:"连接已丢失，请重新下载。",
        3:"所选本地目录不允许下载文件，请选择其他位置。",
        4:"您的本地硬盘已满，请选择其他位置重新下载。",
        5:"下载失败，请重新下载。",
        100:"网络繁忙，请重新下载。"
    };
    g.able_res_start ={
        2: false,
        3: false,
        6: false,
        '-5950': false,
        '-5999': false,
        32221980: false,
        32252995: false,
        92260005: false,
        1126: false,
        1019: false,
        1016: false,
        21: false,
        1392: false,
        190040: false,   //UIN在黑名单中
        190049: false,   //文件在黑名单中
        190067: false,
        10001: true,
        10002: true,
        10003: true,
        1000003:true,//空间不足
        1053:true,//空间不足
        500: true, //h5+flash失败后只会返回500，所以可以重试吧
        1000006: false,
        1000007: false,
        1000008: false,
        1000009: false,
        1000010: false,
        1000011: false,
        1000012: false,
        1000013: false,
	    1000015: false
    };

    //替换 急速上传链接
    (function(){
       if( gbIsWin && !$.browser.safari ){
           if(constants.IS_APPBOX){
               g.upload_error[1000002] = '文件超过300M，请<a target="_blank" href="http://im.qq.com/qq/">安装新版本QQ</a>后上传';
           } else{
               g.upload_error[1000002] = '文件大小超过300M，请启用' + '<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank" '
                   + common.get('./configs.click_tj').make_tj_str('UPLOAD_FILE_MANAGER_INSTALL') + '>极速上传</a>';
           }
       } else {
           g.upload_error[1000002] = '该文件超过300M，暂不支持上传';
       }
       if(constants.IS_APPBOX){//appbox 暂时只支持到4G以内，QQ1.98后放开 todo
           g.upload_error[1000005].normal = '该文件超过2G暂不支持上传。';
       }
    })();

    //替换{反馈}
    var replace_fankui =function(error_text){
        var text = '';
        if( main.get_cur_mod_alias() === 'photo' ) {
            text = '<a href="http://support.qq.com/discuss/715_1.shtml?WYTAG=weiyun.app.web.photo" target="_blank" data-tj-action="btn-adtag-tj" data-tj-value="50003">反馈</a>';
        } else {
            text = '<a href="'+main.get_feedback_url()+'" target="_blank">反馈</a>';
        }
        return error_text.replace('{反馈}',text);
    };

    //替换{开通会员}
    var replace_qzone_vip = function(code, error_text) {
        var user = query_user.get_cached_user();
        if(user.is_weiyun_vip()) {
            return g.upload_error[code]['simple'];
        } else {
            var msg = '<a href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>';
            return error_text.replace('{开通会员}', msg);
        }
    };

	//替换{续传文件}
	var continue_upload = function(code, error_text) {
		var msg = '<a href="javascript: void(0);" target="_self" data-upload="click_event" data-action="click_re_try">续传文件</a>';
		return error_text.replace('{续传文件}', msg);
	};

    var get = function (type, code, msg_type ,error_step, err_msg) {
        if ( typeof code === 'string' && !$.isNumeric(code)){
            return code;
        }

        var o = g[ type ][ code ], msg;
        switch(msg_type){
            case 'simple':
            case 'tip':
                break;
            default:
                msg_type = 'normal';
        }
        if(typeof o === 'object'){
            msg = o[msg_type];
            if(!msg){
                msg = o['normal'];
            }
        }else{
            msg = o;
        }
        if(!msg){
            if(!err_msg) {
                msg = msg_type === 'simple' ? '系统繁忙' : '系统繁忙('+ code +(error_step ? ('-' + error_step) : '')+'),请稍后重试';
            } else {
                msg = err_msg;
            }
        }

        if(type === 'upload_error'){
            if(code === 10060 || code === 1000){
                return replace_fankui(msg);
            } else if(code === 1029 || code === 1127) {
                return replace_qzone_vip(code, msg);
            } else if(code >= 2000005 && code <= 2000009) {
	            return continue_upload(code, msg);
            }
        } else { //下载错误，旧版本提示升级
            if(!external.GetVersion || external.GetVersion() < 5287) {
                msg = msg + '请<a href="http://im.qq.com/pcqq/" target="_blank">更新QQ版本</a>后，再重试。'
            } else {
                msg = msg + '或尝试使用<a href="http://www.weiyun.com/disk/index.html" target="_blank">网页版</a>重试';
            }
        }
        return msg;
    };

    module.exports = {
        get: get,
        able_res_start:function(code){
            if(typeof g.able_res_start[code] !== 'undefined') {
                return !!g.able_res_start[code];
            } else {
                return true;
            }
        }
    };

});