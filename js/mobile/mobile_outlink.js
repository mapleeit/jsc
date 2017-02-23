function _getCookie(name){
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = ($.trim? $.trim(cookies[i]):jQuery.trim(cookies[i]));
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function _get_g_tk() {
    var s_key = _getCookie("skey");
    var hash = 5381;
    if(!s_key){
        return '';
    }
    for( var i= 0,len = s_key.length;i<len;++i){
        hash +=(hash << 5) + s_key.charCodeAt(i);
    }
    return hash & 0x7fffffff
};

//保存到微云
var save_to_weiyun = function(share_pwd,openid){
    WEIYUN_MOBILE_OUTLINK.initShareToWeiyun(shareInfo,share_pwd,openid);
};

//多文件分享下载,单文件下载也走这个函数
var download_multi_file = function(code){
    WEIYUN_MOBILE_OUTLINK.initDownload(shareInfo, code);
};

var get_param = function(name) {
    //var src_str = window.location.href;
    var LocString = document.URL.substring(document.URL.indexOf('?')+1);
    var rs = new RegExp("(^|)"+name+"=([^\&]*)(\&|$)","gi").exec(LocString), tmp;

    if(tmp=rs){
        return tmp[2];
    }
    return "";
}

WEIYUN_MOBILE_OUTLINK = (function(){

    var _timerLoading = null;

    var _pitch_share_info = {};

    var _obj2str = function(o) {
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o) {
                    r.push("\"" + i + "\":" + _obj2str(o[i]));
                }
                if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++) {
                    r.push(_obj2str(o[i]));
                }
                r = "[" + r.join(',') + "]";
            }
            return r;
        }
        return o.toString();
    };

    var _any = function (arr, filter) {
        if (arr) {
            for (var i = 0, l = arr.length; i < l; i++) {
                var it = arr[i];
                if (true === filter.call(it, it, i)) {
                    return true;
                }
            }
        }
        return false;
    };

    //获取操作系统名称
    var _getOSname = function(){
        var nav = navigator.userAgent.toLowerCase(),
            mappings = [ // 请勿随意调整顺序
                ['ipad', 'ipad'],
                ['iphone', 'iphone'],
                ['mac', 'mac os,macintosh'],
                ['windows_phone', 'windows phone'],
                ['windows', 'windows'],
                ['android', 'android'],
                ['linux', 'linux'],
                ['unix', 'unix'],
                ['symbian', 'symbian'],
                ['blackberry', 'bb10,blackberry,playbook']
            ];
        for (var i = 0, l = mappings.length; i < l; i++) {
            var map = mappings[i],
                os_name = map[0],
                uas = map[1].split(',');

            if (_any(uas, function (ua) {
                return nav.indexOf(ua) !== -1;
            })) {
                return os_name;
            }
        }
        return 'unknown';
    };

    //获取浏览器名称
    var _getBSname = function(){
        var b = $.browser;
        if(b.msie) {
            return 'ie' + parseInt($.browser.version);
        } else if(b.chrome) {
            return 'chrome';
        } else if(b.mozilla) {
            return 'mozilla';
        } else if(b.safari) {
            //对android操作系统特殊处理下
            if(_getOSname() == 'android') return 'webkit';
            return 'safari';
        } else if(b.webkit) {
            return 'webkit';
        } else {
            return 'unknown';
        }
    };

    var _request = function(config, callback) {

        var _domain = "weiyun.com";
        try {
            document.domain = _domain;
        } catch(e) {};
        var _g_tk = _get_g_tk();
        var req_body={"ReqMsg_body":{}};
        req_body["ReqMsg_body"][config['MsgReq_body']]=config.data;
        var _param = {
            "req_header": {
                "cmd":config.cmd,
                "appid": 30111,
                "version":2,
                "major_version":2
            },
            "req_body": req_body
        };
        _param = _obj2str(_param);
        $.ajax({
            url : config.url + (config.url.indexOf('?')>-1 ? '&cmd=' : '?cmd=') + config.cmd+"&g_tk="+_g_tk,
            data: {data: _param},
            dataType: 'jsonp',
            timeout: 3000,
            success: function(res){
                callback(res);
            }
        });

    };


    var _outlinkLogCommit = function (_param) {
        try {
            document.domain = "weiyun.com";
        } catch (e) {
        }
        ;
        var _url = 'http://tj.cgi.weiyun.com/wy_log.fcg';
        _param = _obj2str(_param);
        /*$.ajax({
         url : _url,
         data: {data: _param},
         dataType: "json"
         });*/
        var t = new Image();
        t.onload = t.onerror = t.onabort = function () {
            this.onload = this.onerror = this.onabort = null;
            delete t;
        };
        t.src = _url+'?data='+encodeURIComponent(_param);
    };

    var _outlinklog = function(op_id)
    {
        var _data = {"req_header": {"uin":0,"cmd":"wy_log_71","source":"weiyunWeb"},
            "req_body":{"os_type":30013,"items":[{"act_id":106,"op_id":op_id}]}
        }
        _outlinkLogCommit(_data);
    };

    /**
     * 文件下载
     */
    var _initDownload = function(decodeInfo,verify_code)
    {
        var url = "http://web2.cgi.weiyun.com/outlink.fcg";
        var share_pwd= decodeInfo.pwd || '';
        var data={"share_key":decodeInfo.share_key,"pack_name":decodeInfo.share_name,"os_info":_getOSname(),"browser":_getBSname(), "pwd":share_pwd};
        var _config={
            cmd:12003,
            MsgReq_body:"weiyun.WeiyunShareDownloadMsgReq_body",
            data:data,
            url:url
        };
        var _xhr = _request(_config, function(_obj){
            if(_obj.rsp_header["retcode"] == 0){
               // _get_download_iframe().attr('src',_obj.rsp_body['RspMsg_body']['weiyun.WeiyunShareDownloadMsgRsp_body']['download_url']);
                window.location.href = _obj.rsp_body['RspMsg_body']['weiyun.WeiyunShareDownloadMsgRsp_body']['download_url'];
            }else if(_obj.rsp_header["retcode"] == 190051 || _obj.rsp_header["retcode"] == 190011){
                var go_url = window.location.href;
                if(go_url.indexOf('?')>-1){
                    go_url += '&as=2';
                }
                else{
                    go_url += '?as=2';
                }
                if(share_pwd!=null && share_pwd !=''){
                    go_url+='&pwd='+share_pwd;
                }
                //跳转到登录页面
                window.location.href = "http://ui.ptlogin2.weiyun.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&s_url="+encodeURIComponent(go_url)+"&style=9&hln_css=http://w5.qq.com/img/logo.png";

            }else{
                window.location.href = window.location.href;
            }
        });
        _outlinklog(1);
    };
    //获取cookie
    var _getCookie = function(name){
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    //保存到微云
    var _pitchStore = function(share_pwd,openid) {
        var  url = 'http://web2.cgi.weiyun.com/outlink.fcg';

        if(openid){
            url += ( (url.indexOf('?')!=-1) ? '&' : '?' ) + 'openid='+openid;
        }
        else{
            openid = _getQStr("openid");
            if(openid){
                url += ( (url.indexOf('?')!=-1) ? '&' : '?' ) + 'openid='+openid;
            }
        }
        var _pitch_share_info={"share_key":shareInfo.share_key};
        var _config={
            cmd:12005,
            MsgReq_body:"weiyun.WeiyunShareSaveDataMsgReq_body",
            data:_pitch_share_info,
            url:url
        };
        var _xhr = _request(_config, function(_obj){
            //var _str = json["text"];
            //var _obj = eval('(' + _str + ')');
            if (_obj.rsp_header) {
                if( _obj.rsp_header["retcode"]== 102010 || _obj.rsp_header["retcode"]== 1024 || _obj.rsp_header["retcode"]== 190051 || _obj.rsp_header["retcode"]== 190011 || _obj.rsp_header["retcode"]== 190041){ //没有登录
                    var sharekey = _pitch_share_info.share_key;
                    //var go_url = 'http://share.weiyun.com/' + sharekey + '?as=1' ;
                    var go_url = window.location.href;
                    if(go_url.indexOf('?')>-1){
                        go_url += '&as=1';
                    }
                    else{
                        go_url += '?as=1';
                    }
                    if(share_pwd!=null && share_pwd !=''){
                        go_url+='&pwd='+share_pwd;
                    }
                    if(openid && openid != ''){
                        go_url += '&openid='+openid;
                    }
                    //跳转到登录页面
                    window.location.href = "http://ui.ptlogin2.weiyun.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&s_url="+encodeURIComponent(go_url)+"&style=9&hln_css=http://w5.qq.com/img/logo.png";

                }
                else{
                    _showSaving();
                    //loading时长2s
                    setTimeout(function(){
                        _showsuc(_obj.rsp_header, _obj.rsp_body ? _obj.rsp_body: {});
                    },2000);
                }
            } else {
                _showsuc( - 1, {});
                _outlinklog(_obj.rsp_header.retcode);
            }
        });
    };

    //外链危险级详细页面发送cgi请求文件信息
    var _get_info_sharekey = function (share_para) {
        var share_key = share_para.split('&&')[0];
        var share_fun = share_para.split('&&')[1];
        var mobile_type = share_para.split('&&')[2];
        var pwd = share_para.split('&&')[3]||'';
        var data = {"share_key": share_key,"share_pwd": pwd};
        var _config={
            cmd:12002,
            MsgReq_body:"weiyun.WeiyunShareViewMsgReq_body",
            data:data,
            url: 'http://web2.cgi.weiyun.com/outlink.fcg'
        };
        _request(_config, function (_obj) {
            var ret = _obj.rsp_header.retcode;
            var filename = _obj.rsp_body.ReqMsg_body["weiyun.WeiyunShareViewMsgReq_body"].file_list[0].file_name;
            shareInfo = {"retcode": ret, "sharekey": share_key, "filename": filename};
            $.extend(shareInfo,_obj.rsp_body.ReqMsg_body["weiyun.WeiyunShareViewMsgReq_body"]);
            risk_ui_init(shareInfo,share_fun,mobile_type);
            _init(shareInfo);
        });
    }

    //外链危险级详细页面ui初始化
    var risk_ui_init = function (shareInfo,jumpurl,mobile_type){
        //$('#dynamic_script').attr('src','http://web.weiyun.qq.com/php/downloadCheck.php?downloadn='+shareInfo.dl_cookie_name+'$downloadv='+shareInfo.dl_cookie_value+'&callback=null');
        var file_suffix = shareInfo.filename.substr(shareInfo.filename.lastIndexOf('.') + 1);
        var risk_level = '';
        switch (shareInfo.safe_type){
            case 1:
                risk_level = '安全';
                break;
            case 2:
                risk_level = '高';
                break;
            case 3:
                risk_level = '中';
                break;
            case 4:
                risk_level = '低';
                break;
            default:
                risk_level = '';
        }
        $('#risk_level').text(risk_level);
        $('#virus').text(shareInfo.virus_name);
        $('#file_type').attr('src','http://imgcache.qq.com/vipstyle/nr/box/icon/'+file_suffix+'.png');
        $('#virus_detail').text(shareInfo.virus_desc);
        $('#file_name').text(format_file_name(shareInfo.file_name));
        $('#file_name').attr('title', format_file_name(shareInfo.file_name))
        $('#save_to_wy').attr('href',jumpurl);

        if(mobile_type === '1'){
            $('#down_mobile_master').attr('href','http://m.qq.com?g_f=23459');
        }else{
            $('#down_mobile_master').attr('href','http://m.qq.com?g_f=23458');
        }

    }

    //危险文件名过长处理
    var format_file_name = function (file_name) {
        var max_pre_length = 4,
            max_suffix_length = 6,
            file_name_pre,
            file_name_suffix;

        if (file_name.length > max_pre_length + max_suffix_length) {
            file_name_pre = file_name.substr(0, max_pre_length);
            file_name_suffix = file_name.substr(file_name.length - max_suffix_length);
            var format_name = file_name_pre + '...' + file_name_suffix;
            return format_name;
        }
        return file_name;
    }

    /**
     * 保存到微云后的处理函数
     */
    var _showsuc = function(rsp_head, rsp_body){
        clearInterval(_timerLoading);
        if(rsp_head["retcode"] == 0 || rsp_head["retcode"] == 1051)
        {
            _showSavedSuc();
        } else if(rsp_head["retcode"] == 20002 || rsp_head["retcode"] == 20003){
            window.location.href = window.location.href;
        }
        else
        {
            var arr = {
                "1013" : '网络问题，请稍后重试。',
                "1024" : '网络问题，请稍后重试。',
                "1020" : '保存失败，文件已被删除或移动。',
                "1028" : '保存失败，文件数超过单目录最大限制。',
                "1053" : '您的网盘空间不足，未能保存这些文件。',
                "1119" : '您的网盘空间已满，未能保存这些文件。',
                "1024" : '网络问题，请稍后重试。',
                "102030" : '操作过于频繁，请稍后重试。',  //code by bondli 增加频率限制错误提示
                "102031" : '保存失败，您一次转存的文件太多。',  //code by bondli 增加不支持目录转存错误提示
                "20003"  : '外链使用次数已用完，请联系分享者重新分享。',
                "20002"  : '外链已过期，请联系分享者重新分享。'
            };

            var msg = arr[ rsp_head["retcode"] ] || '保存出错';
            var type = arr[ rsp_head["retcode"] ] ? 'warn' : 'err';
            _showSavedErr(msg, type);
        }
    }

    /**
     * 保存到微云
     */
    var _initShareToWeiyun = function (decodeInfo,share_pwd,openid) {
        var ret = decodeInfo.ret;
        if (ret == 0) {
            _pitchStore(share_pwd,openid);
        }
        else{
            _showSavedErr('保存出错','err');
        }
        // 71表数据上报   2 代表转存到微云
        _outlinklog(2);
    };

    //显示正在保存中
    var _showSaving = function(){
        $('.ui-mask').removeClass('hide');
        $('.file-pop').removeClass('hide');

        $('.file-saved').addClass('hide');
        $('.file-save-fail').addClass('hide');
        $('.ui-pop-close').addClass('hide');
        //正在保存
        $('.file-saving').removeClass('hide');
        //加载loading效果
        $('.file-saving').html('<img id="link_loding" width="25" height="25" style="vertical-align:middle;" /><span class="ui-tips-text">正在保存</span>');
        var _percent = 1;
        _timerLoading = setInterval(function(){
            var number = (_percent % 11 == 0) ? 11 : _percent % 11;
            _percent ++;
            $('#link_loding').attr('src','http://imgcache.qq.com/vipstyle/nr/box/web/images/link_loading/'+number+'.png');
        }, 100);
    };

    //显示保存成功
    var _showSavedSuc = function(){
        $('.ui-mask').removeClass('hide');
        $('.file-pop').removeClass('hide');

        $('.file-saving').addClass('hide');
        $('.file-save-fail').addClass('hide');

        //保存成功
        $('.file-saved').removeClass('hide');
        $('.ui-pop-close').removeClass('hide');

        //为关闭按钮添加点击事件
        $('.ui-pop-close').click(function(){
            $('.ui-mask').addClass('hide');
            $('.file-pop').addClass('hide');
            $('.file-saving').addClass('hide');
            $('.file-saved').addClass('hide');
            $('.file-save-fail').addClass('hide');
            $('.ui-pop-close').addClass('hide');
            return false;
        });

        $('.ui-mask').click(function(){
            $('.ui-mask').addClass('hide');
            $('.file-pop').addClass('hide');
            $('.file-saving').addClass('hide');
            $('.file-saved').addClass('hide');
            $('.file-save-fail').addClass('hide');
            $('.ui-pop-close').addClass('hide');
        });
    };

    //显示保存失败
    var _showSavedErr = function(msg,type){
        $('.ui-mask').removeClass('hide');
        $('.file-pop').removeClass('hide');
        $('.file-saving').addClass('hide');
        $('.file-saved').addClass('hide');

        $('.file-save-fail').removeClass('hide');
        $('.ui-pop-close').removeClass('hide');

        var f = type == 'err' ? 'warn' : 'err';
        $('#save-error-d').removeClass('file-save-'+f).addClass('file-save-'+type).html('<i class="ui-icon icon-save-err"></i>'+msg);
        $('#save-error-p').html('<i class="ui-icon icon-save-'+type+'"></i>'+msg);

        //为关闭按钮添加点击事件
        $('.ui-pop-close').click(function(){
            $('.ui-mask').addClass('hide');
            $('.file-pop').addClass('hide');
            $('.file-saving').addClass('hide');
            $('.file-saved').addClass('hide');
            $('.file-save-err').addClass('hide');
            $('.ui-pop-close').addClass('hide');
            return false;
        });
    };

    //获取URL参数
    var _getQStr = function(str){
        var LocString=String(window.document.location.href);
        try{
            LocString = decodeURIComponent(LocString);
        }
        catch(e){
            LocString = unescape(LocString);
        }
        var rs = new RegExp("(^|)"+str+"=([^\&]*)(\&|$)","gi").exec(LocString), tmp;
        if( tmp = rs ) return tmp[2];
        return "";
    };

    var _verifyPwd = function(share_key, pwd){
        var data = {"os_info":_getOSname(),"browser":_getBSname(),"share_key": share_key, "share_pwd": pwd},
            _xhr;
        var _config={
            cmd:12002,
            MsgReq_body:"weiyun.WeiyunShareViewMsgReq_body",
            data:data,
            url: 'http://web2.cgi.weiyun.com/outlink.fcg'
        };
        _xhr = _request(_config, function(_obj){
            if (_obj.rsp_header) {
                if( _obj.rsp_header["retcode"] == 114500 || _obj.rsp_header["retcode"] == 114303 ){ //密码错误
                    $('#errInfo').html('密码错误，请重新输入');
                    //清空错误密码
                    //中间输入时也需要调整提交按钮的可点击
                    for(var i=1;i<=4;i++){
                        $('#'+i).val('');
                    }
                    $('.ui-btn-blue').addClass('ui-btn-blue-disabled');
                    $('#1').focus();

                } else if(_obj.rsp_header["retcode"] == 114304 ) {//超过错误次数，使用验证码
                    $('#errInfo').html('密码错误次数过多，请输入验证码');
                }  else if(_obj.rsp_header["retcode"] == 114305) {//验证码错误
                    $('#errInfo').html('验证码错误，请重新输入');
                } else if(_obj.rsp_header["retcode"] == 0){ //密码正确
                    var hasParam = (window.location.href.indexOf('?')> -1);
                    //密码正确以后清空验证码输入框和密码输入框中的值,防止浏览器后退以后input框中的值错位
                    window.location.href = window.location.href+ (hasParam ? '&': '?') + 'pwd='+pwd;
                }
                else{
                    $('#errInfo').html('服务器繁忙，请稍后再试');
                }
            } else {
                $('#errInfo').html('服务器繁忙，请稍后再试');
                _outlinklog(_obj.rsp_header.ret);

            }
        });
        //71表数据上报   3 密码验证
        _outlinklog(3);
    }

    //清空密码登录界面输入框中的值
    var _clear_verify_code_pwd=function(){
        $('#1').val('');
        $('#2').val('');
        $('#3').val('');
        $('#4').val('');
    }


    //调整图片大小
    var fix_size = function ($preload_img, contains_size) {

        var img = $preload_img[0],
            img_width = img.width,
            img_height = img.height,
            img_url = img.src;

        var win_width = contains_size.width,
            win_height = contains_size.height,
            padding = contains_size.padding,
            new_img_width = Math.min(img_width, win_width - padding),
        //new_img_height = Math.min(img_height, win_height - padding),
            limit_side, // height / width
            limit_size = '',
            size = {};

        if(img_width <= win_width){
            return {"width": img_width, "height":img_height};
        }
        else {
            // 如果同时限制了高度和宽度，则只使用跟浏览器长宽比例变化大的哪一个边
            size['width'] = new_img_width;
            size['height'] = Math.round(img_height / img_width * new_img_width);
            return size;
        }

    };

    /**
     * 初始化入口
     * @private
     */
    var _init = function(shareInfo) {
        //是否自动保存
        var auto_save = _getQStr("as");
        if( auto_save == "1" ){
            _initShareToWeiyun(shareInfo);
        }else if(auto_save == "2" ){  //自动下载
            _initDownload(shareInfo);
        }
        //71表数据上报    0 浏览外链页面
        _outlinklog(0);
    };

    return {
        init:_init,
        initDownload:_initDownload,
        initShareToWeiyun:_initShareToWeiyun,
        get_info_sharekey:_get_info_sharekey,
        verifyPwd:_verifyPwd,
        fix_size: fix_size
    };
})();