(function(global){
    // 解析参数  未来如果批量存储，可考虑php将post转换为JS，直接读取变量？
    var decode = decodeURIComponent;
    function get_params(){
        var hash = location.search.substring(1), params = {}, parts, i, part, key;
        if(hash){
            parts = hash.split('&');
            for(i=0; i<parts.length; i++){
                part = parts[i].split('=');
                key = decode(part[0]);
                params[key] = decode(part.slice(1).join('='));
            }
        }
        return params;
    }
    var params = global.params || get_params();
    global.WEIYUN_APPID = parseInt(params.appid, 10) || 0; // 用于日志统计。。。
    /*
    seajs.config({
        charset: 'utf-8',
        debug: 0,
        base: 'http://imgcache.qq.com/club/weiyun/js/',
        alias: {
            $ : 'lib/jquery-1.8.3.min.js?max_age=31104000',
            special_log : 'common/special_log.js?v130722'
        }
    });
    seajs.use(['$', 'special_log'],
        function($, special_log){   */
        $(function(){
            /**
             * 尽量用原生的JS实现一系列功能？有无此必要？
             * 或考虑用jquery吧，这个页面是在qq域下的，不是放到人家网站上，所以~~
             */
            // 如果是iframe嵌套并且被qq.com域引用，则可以不经过确认直接保存
            // 其它情况，如果是单独打开，也不能认为是安全的，可能是第三方网站弹出的
            var safe_zone = false;
            try{
                if(parent.location.href !== location.href && top.document.domain === document.domain){
                    safe_zone = true;
                }
            }catch(e){
                // XS Exception
            }
            
            
            var log = special_log.build_user_logger({
                save : {
                    op : 59501
                },
                close : {
                    op : 59502
                },
                view : {
                    op : 59503
                }
            });
            
            // 外部接口
            // 如果同域，直接parent调用
            // 如果其它qq服务，parent.postMessage或iframe hash+parent.parent？ TODO
            // 如果是第三方服务，没有人配合的话无法实现 TODO
            var Interfaces = {
                Login : 'login',
                Visible : 'visible',
                Close : 'close'
            };
            var interface_suffix = '_callback';
            var visible = true;
            function has_interface(name){
                var interface_name = params[name+interface_suffix];
                return interface_name && typeof parent[interface_name] === 'function';
            }
            function call_interface(name){
                if(safe_zone){
                    try{
                        return parent[params[name+interface_suffix]].apply(parent, Array.prototype.slice.call(arguments, 1));
                    }catch(e){}
                }
            }
            if(safe_zone){
                // 安全区域，外部会传递显示、隐藏接口，并初始隐藏，不需要确认直接保存
                visible = !has_interface(Interfaces.Visible);
            }else{
                // 非安全区域，外部Login接口必定不可用，因为不同域不可能会帮助我们登录
                params[Interfaces.Login+interface_suffix] = null;
            }
            function ensureVisible(){
                if(!visible){
                    call_interface(Interfaces.Visible, true);
                    visible = true;
                }
            }
            
            // 根据参数来判断显示的确认界面，如果为safe_zone并没有要求要确认，就直接跳过
            function show_confirm(){
                // TODO 可暂时不开发，还没有用于qq.com外的域名，不需要确认
                ensureVisible();
                $('#confirm').show().siblings().hide();
            }
            
            function get_cookie(name) { // from quicksmode.org
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)===' '){
                        c = c.substring(1,c.length);
                    }
                    if (c.indexOf(nameEQ) === 0){
                        return c.substring(nameEQ.length,c.length);
                    }
                }
                return null;
            }
            
            var get_token = (function(){
                /*jshint maxparams:false,nonew:false,newcap:false,eqeqeq:false,curly:false  */
                var CONST_SALT = 5381;
                var CONST_MD5_KEY = 'tencentQQVIP123443safde&!%^%1282';
                var hexcase = 0;
                var b64pad = '';
                var chrsz = 8;
                var mode = 32;
            
                function hex_md5(s) {
                    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
                }
            
                function core_md5(x, len) {
                    x[len >> 5] |= 0x80 << ((len) % 32);
                    x[(((len + 64) >>> 9) << 4) + 14] = len;
                    var a = 1732584193;
                    var b = -271733879;
                    var c = -1732584194;
                    var d = 271733878;
                    for (var i = 0; i < x.length; i += 16) {
                        var olda = a;
                        var oldb = b;
                        var oldc = c;
                        var oldd = d;
                        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                        a = safe_add(a, olda);
                        b = safe_add(b, oldb);
                        c = safe_add(c, oldc);
                        d = safe_add(d, oldd);
                    }
                    if (mode == 16) {
                        return Array(b, c);
                    } else {
                        return Array(a, b, c, d);
                    }
                }
            
                function md5_cmn(q, a, b, x, s, t) {
                    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
                }
            
                function md5_ff(a, b, c, d, x, s, t) {
                    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
                }
            
                function md5_gg(a, b, c, d, x, s, t) {
                    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
                }
            
                function md5_hh(a, b, c, d, x, s, t) {
                    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
                }
            
                function md5_ii(a, b, c, d, x, s, t) {
                    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
                }
            
                function safe_add(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return(msw << 16) | (lsw & 0xFFFF);
                }
            
                function bit_rol(num, cnt) {
                    return(num << cnt) | (num >>> (32 - cnt));
                }
            
                function str2binl(str) {
                    var bin = Array();
                    var mask = (1 << chrsz) - 1;
                    for (var i = 0; i < str.length * chrsz; i += chrsz)
                        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
                    return bin;
                }
            
                function binl2hex(binarray) {
                    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                    var str = "";
                    for (var i = 0; i < binarray.length * 4; i++) {
                        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                            hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
                    }
                    return str;
                }
            
                function _md5(s) {
                    return hex_md5(s);
                }
                
                /*jshint maxparams:5,nonew:true,newcap:true,eqeqeq:true,curly:true  */
                /**
                 *
                 * @param objConfig {salt, skey, md5key}
                 * @return {*}
                 * @private
                 */
                return function (objConfig) {
                    objConfig = objConfig || {};
                    var salt = objConfig.salt || CONST_SALT;
                    var skey = objConfig.skey || get_cookie("skey") || '';
                    var md5key = objConfig.md5key || CONST_MD5_KEY;
                    var hash = [], ASCIICode;
                    hash.push((salt << 5));
                    for (var i = 0, len = skey.length; i < len; ++i) {
                        ASCIICode = skey.charAt(i).charCodeAt();
                        hash.push((salt << 5) + ASCIICode);
                        salt = ASCIICode;
                    }
                    var md5str = _md5(hash.join('') + md5key);
                    return md5str;
                };
            })();
            // 保存操作
            var server_error = '服务器出现错误, 请稍后再试',
                network_error = '网络错误, 请稍后再试',
                timeout_error = '连接服务器超时, 请稍后再试',
                common_error = '保存失败, 请稍后再试';
            /*
        ERR_OFFLINE_DOWNLOAD_BUF_OVERFLOW    = 13001,
        ERR_OFFLINE_DOWNLOAD_INPUT_PACKET   = 13002,
        ERR_OFFLINE_DOWNLOAD_INVALID_UIN    = 13003,
        ERR_OFFLINE_DOWNLOAD_FILE_TOO_LARGE = 13004,
        ERR_OFFLINE_DOWNLOAD_HTTP_HEADER_NOT_COMPLETE_PACKET    = 13005,
        ERR_OFFLINE_DOWNLOAD_HTTP_BODY_NOT_COMPLETE_PACKET      = 13006,    
        ERR_OFFLINE_DOWNLOAD_INVALID_HTTP_PACKET    = 13007,
        ERR_OFFLINE_DOWNLOAD_INVALID_DOMAIN_NAME    = 13008,
        ERR_OFFLINE_DOWNLOAD_DOWNLOAD_FILE_FAIL     = 13009,
        ERR_OFFLINE_DOWNLOAD_INVALID_CMD            = 13010,
        ERR_OFFLINE_DOWNLOAD_INVALID_APPID          = 13011,    //无效的第三方ID
        ERR_OFFLINE_DOWNLOAD_BACKEND_INVALID_RSP    = 13012,    //后台server返回的包内容错误
        ERR_OFFLINE_DOWNLOAD_ACCESS_INTERNAL= 13013,        //接入服务内部错误
        ERR_OFFLINE_DOWNLOAD_BACKEND_INVALID_RSP_LEN    = 13014,    //后台server返回的包长度错误
        ERR_OFFLINE_DOWNLOAD_FREE_SPACE_NOT_ENOUGH= 13015,  //剩余空间不足
        ERR_OFFLINE_DOWNLOAD_INVALID_DOWNLOAD_URL       = 13017,
        ERR_OFFLINE_DOWNLOAD_TOKEN_EXPIRED              = 13019,    // token过期
        ERR_OFFLINE_DOWNLOAD_UPLOAD_DATA_FAIL           = 13020,        //上传失败
        */
            function save(){
                log('save');
                show_loading();
                $.ajax({
                    url : 'http://wx.cgi.qq.com/tnews_picupload.fcg',
                    data : {
                        cmd : 'save_pic',
                        token : get_token(),
                        title : params.title,
                        url : params.url,
                        filename : params.url.match(/([^\/\?#]+\.[^\/\?#]+)?($|\?|#)/)[1],
                        appid : params.appid, // TODO 新闻有专用的appid
                        newsurl : params.newsurl      // 新闻路径
                    },
                    dataType : 'jsonp',
                    success : function(data){
                        if(!data){
                            show_common_failure(server_error);
                            return;
                        }
                        var ret = data.ret, msg = common_error;
                        if(ret !== 0){ // 逻辑错误，根据错误码不同执行不同响应
                            // TODO 要有更详细的错误
                            switch(ret){
                                case 1024:
                                case 13003:
                                case 13019:
                                    login(function(login_ok){
                                        if(login_ok === false){
                                            // 用户取消
                                            closeWin();
                                        }else{
                                            save();
                                        }
                                    });
                                    return;
                                case 1053:
                                case 13015:
                                    show_space_failure();
                                    return;
                                default:
                                    break;
                            }
                            show_common_failure(msg);
                            return;
                        }
                        // 保存成功
                        show_success();
                    },
                    error : function(xhr, textStatus){
                        var msg = common_error;
                        switch(textStatus){
                            case 'timeout':
                                // 网络错误
                                msg = timeout_error;
                                break;
                            case 'parsererror':
                                // cgi输出异常
                                msg = server_error;
                                break;
                            case 'error':
                                // 其它错误，比如404、500？
                                msg = network_error;
                                break;
                        }
                        show_common_failure(msg);
                    }
                });
            }
            
            // 未登录时触发
            function login(callback){
                // 现在暂时使用qq新闻的接口
                if(has_interface(Interfaces.Login)){
                    call_interface(Interfaces.Login, callback);
                }else{
                    // TODO 以后放置于qq.com之外的域时，要实现自己的登录框
                }
            }
            
            function show_loading(){
                ensureVisible();
                var el = $('#loading');
                el.find('.thumb').attr('src', params.thumb_url);
                el.show().siblings().hide();
            }
            
            // 保存成功
            function show_success(){
                ensureVisible();
                var el = $('#success');
                el.find('.thumb').attr('src', params.thumb_url);
                el.show().siblings().hide();
            }
            
            // 保存失败
            function show_common_failure(msg){
                ensureVisible();
                var el = $('#failure');
                el.find('.text').text(msg);
                el.show().siblings().hide();
            }
            function show_space_failure(){
                ensureVisible();
                $('#failure_space').show().siblings().hide();
            }
            
            // 保存完毕，关闭窗口
            function closeWin(){
                log('close');
                log.flush(); // 即将关闭，立即发出请求
                if(has_interface(Interfaces.Close)){
                    call_interface(Interfaces.Close);
                }else{
                    // 参照qzone的closeWin代码
                    if (window.ActiveXObject) {
                        var newwin = window.open('', '_self', '');
                        newwin.close();
                    } else if (document.getBoxObjectFor || typeof (window.mozInnerScreenX) !== 'undefined') {
                        var wnd = window.open('about:blank', '_self');
                        wnd.close();
                    } else {
                        window.open('', '_self');
                        window.close();
                    }
                }
            }
            
            // 带登录态跳转到微云
            function jump(url){
                var jump_url = "http://ptlogin2.qq.com/ho_cross_domain?tourl="+encodeURIComponent(url);
                window.open(jump_url);
            }
            
            // -----------逻辑区入口------------
            // 初始触发
            if(!safe_zone || params.need_confirm){
                show_confirm();
            }else{
                // 现在自动调用保存
                save();
            }
            // 点击关闭
            $(document.body).on('click', '[data-action]', function(e){
                e.preventDefault();
                var el = $(this),
                    action = el.attr('data-action'), type;
                switch(action){
                    case 'close':
                        closeWin();
                        break;
                    case 'confirm':
                        save();
                        break;
                    case 'jump':
                        type = el.attr('data-type');
                        switch(type){
                            case 'view':
                                log('view');
                                break;
                            case 'morespace':
    //                            log('morespace'); // 暂无此统计需求
                                break;
                        }
                        jump(el.attr('href'));
                        break;
                }
            });
        });
    //});
})(window);
