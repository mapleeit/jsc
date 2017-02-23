/**
 * special_log，用于统计一些活动的日志，例如非微云用户的点亮统计等将会上报到71表
 * @author cluezhang
 * @date 2013/05/30
 */
(function() {
    // ----- 为了使此模块能独立使用，将依赖的外部接口都放在adapter中 ------
//    var adapter = (function(){
//        var makeCallback = function(fn, scope){
//            return function(){
//                return fn.apply(scope, arguments);
//            };
//        };
//        var lib = re-quire('lib'),
//            jQuery = re-quire('$'),
//            JSON = lib.get('./json'),
//            console = lib.get('./console'),
//    
//            constants = re-quire('./constants'),
//            query_user = re-quire('./query_user');
//        return {
//            stringify : makeCallback(JSON.stringify, JSON),
//            // 操作系统类型（统计用，参考oz配置）
//            OS_TYPE : constants.IS_APPBOX ? constants.OS_TYPES.APPBOX : constants.OS_TYPES.WEB,
//            debug : makeCallback(console.error, console),
//            get_uin_num : makeCallback(query_user.get_uin_num, query_user),
//            jQuery : jQuery
//        };
//    })();
    // --------------- 独立版的adapter -----------------------
    var adapter = (function(){
        var makeCallback = function(fn, scope){
            return function(){
                return fn.apply(scope, arguments);
            };
        };
        var JSON = window.JSON,
            jQuery = window.require ? window.require('$') : window.jQuery,
            loc = location,
            cookie = function(name) { // from quicksmode.org
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            };
        if (typeof JSON !== 'object') {
            JSON = {};
        }
    
        (function () {
            'use strict';
    
            function f(n) {
                // Format integers to have at least two digits.
                return n < 10 ? '0' + n : n;
            }
    
            if (typeof Date.prototype.toJSON !== 'function') {
    
                Date.prototype.toJSON = function (key) {
    
                    return isFinite(this.valueOf())
                        ? this.getUTCFullYear()     + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate())      + 'T' +
                        f(this.getUTCHours())     + ':' +
                        f(this.getUTCMinutes())   + ':' +
                        f(this.getUTCSeconds())   + 'Z'
                        : null;
                };
    
                String.prototype.toJSON      =
                    Number.prototype.toJSON  =
                        Boolean.prototype.toJSON = function (key) {
                            return this.valueOf();
                        };
            }
    
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {    // table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"' : '\\"',
                    '\\': '\\\\'
                },
                rep;
    
    
            function quote(string) {
    
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string'
                        ? c
                        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
            }
    
    
            function str(key, holder) {
    
    // Produce a string from holder[key].
    
                var i,          // The loop counter.
                    k,          // The member key.
                    v,          // The member value.
                    length,
                    mind = gap,
                    partial,
                    value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    
                if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                    value = value.toJSON(key);
                }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    
                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value);
                }
    
    // What happens next depends on the value's type.
    
                switch (typeof value) {
                    case 'string':
                        return quote(value);
    
                    case 'number':
    
    // JSON numbers must be finite. Encode non-finite numbers as null.
    
                        return isFinite(value) ? String(value) : 'null';
    
                    case 'boolean':
                    case 'null':
    
    // If the value is a boolean or null, convert it to a string. Note:
    // typeof null does not produce 'null'. The case is included here in
    // the remote chance that this gets fixed someday.
    
                        return String(value);
    
    // If the type is 'object', we might be dealing with an object or an array or
    // null.
    
                    case 'object':
    
    // Due to a specification blunder in ECMAScript, typeof null is 'object',
    // so watch out for that case.
    
                        if (!value) {
                            return 'null';
                        }
    
    // Make an array to hold the partial results of stringifying this object value.
    
                        gap += indent;
                        partial = [];
    
    // Is the value an array?
    
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
    
    // The value is an array. Stringify every element. Use null as a placeholder
    // for non-JSON values.
    
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }
    
    // Join all of the elements together, separated with commas, and wrap them in
    // brackets.
    
                            v = partial.length === 0
                                ? '[]'
                                : gap
                                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                                : '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }
    
    // If the replacer is an array, use it to select the members to be stringified.
    
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {
    
    // Otherwise, iterate through all of the keys in the object.
    
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }
    
    // Join all of the member texts together, separated with commas,
    // and wrap them in braces.
    
                        v = partial.length === 0
                            ? '{}'
                            : gap
                            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                            : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                }
            }
    
    // If the JSON object does not yet have a stringify method, give it one.
    
            if (typeof JSON.stringify !== 'function') {
                JSON.stringify = function (value, replacer, space) {
    
    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.
    
                    var i;
                    gap = '';
                    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
    
    // If the space parameter is a string, it will be used as the indent string.
    
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
    
    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    
                    return str('', {'': value});
                };
            }
    
    
    // If the JSON object does not yet have a parse method, give it one.
    
            if (typeof JSON.parse !== 'function') {
                JSON.parse = function (text, reviver) {
    
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.
    
                    var j;
    
                    function walk(holder, key) {
    
    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.
    
                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }
    
    
    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.
    
                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }
    
    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.
    
    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    
                    if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    
    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.
    
                        j = eval('(' + text + ')');
    
    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.
    
                        return typeof reviver === 'function'
                            ? walk({'': j}, '')
                            : j;
                    }
    
    // If the text is not JSON parseable, then a SyntaxError is thrown.
    
                    throw new SyntaxError('JSON.parse');
                };
            }
        }());
        var url_getter = (function(){
            var 
            // 挂载 image 到该对象上，防止被IE无情GC
                loading_images = {},
        
                id_seq = 0;
        
            var image_loader = {
        
                load: function (url) {
                    var me = this,
                        def = $.Deferred(),
                        id = id_seq++,
                        img = new Image();
        
                    img.onload = function () {
                        me._destroy(id);
                        def.resolve(this);
                    };
                    img.onerror = img.onabort = function () {
                        me._destroy(id);
                        def.reject(this);
                    };
        
                    img.src = url;
        
                    // 防止被GC
                    loading_images[id] = img;
        
                    return def;
                },
        
                _destroy: function (id) {
                    var img = loading_images[id];
                    if (img) {
                        img.onload = img.onerror = img.onabort = null;
                        delete loading_images[id];
                    }
                }
            };
        
            return image_loader;
        })();
        return {
            stringify : makeCallback(JSON.stringify, JSON),
            // 操作系统类型（统计用，参考oz配置）
            OS_TYPE : window.WEIYUN_APPID || ((loc.href.indexOf(loc.protocol + '//' + loc.host + '/appbox/') === 0 || /[\?&]appbox(=[^&#]*)?(&|$)/.test(loc.search)) ? 30012 :
                (/[\?&]qzone(=[^&#]*)?(&|$)/.test(loc.search) ? 30225 : 30013)),
            debug : jQuery.noop,
            get_uin_num : function(){
                return parseInt((cookie('uin') || cookie('clientuin') || '').replace(/^[oO0]*/, ''), 10) || 0;
            },
            jQuery : jQuery,
            url_getter : url_getter,
            OS_NAME : (function () {
                var nav = navigator.userAgent.toLowerCase(),
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
                    ];
                var i, map, uas, j;
                for (i = 0; i < mappings.length; i++) {
                    map = mappings[i];
                    uas = map[1].split(',');
                    for(j=0; j<uas.length; j++){
                        if(nav.indexOf(uas[j]) !== -1){
                            return map[0];
                        }
                    }
                }
                return 'unknown os';
            })(),
            BROWSER_NAME : (function (b) {
                if(b.msie || window.ActiveXObject !== undefined) { //fix ie11
                    return 'ie';
                } else if(b.chrome) {
                    return 'chrome';
                } else if(b.mozilla) {
                    return 'mozilla';
                } else if(b.safari) {
                    return 'safari';
                } else if(b.webkit) {
                    return 'webkit';
                } else {
                    return 'unknown';
                }
            })(jQuery.browser)
        };
    })();
    // ----------------------------------------------------------------------------
    var translate_cgi = function(cgi) {
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
            "h5.weiyun.com": "h5.weiyun.com/"
        };
        var m = /^https?:\/\/([\w\.]+)(?:\/(.+))?/.exec(cgi);
        if(window.location.protocol === 'http:') {
            return cgi;
        }
        if(m && m[1] && map[m[1]]) {
            cgi =  window.location.protocol + '//' + map[m[1]] + (m[2] || '');
        }

        return cgi;
    }

    var special_log_map = {
            // 访问点亮微云图标说明的网页统计，用于计算此途径吸引的新用户。
            view_light_up : {
                act_id : 104,
                op_id : 0
            }
        };
    var 
        $ = adapter.jQuery,
        // 上报地址
        url = translate_cgi('http://tj.cgi.weiyun.com/wy_log.fcg'),
        // 为防止get url长度超出，限定日志数据部分长度不超过1500，剩下的500左右足够url、通用参数占用
        // url最终会为 http://tj.cgi.weiyun.com/wy_log.fcg?data=%7B%22req_header.....%7D%7D&_=1369906599203
        max_data_length = 1500;
    /* 示例
    var test = {
        "req_header" : {
            "uin" : 183350891, // must
            "cmd" : "wy_log_71",
            "source" : "test"
        },
        "req_body" : {
            "viplevel" : 5,
            "os_type" : 30006,  // must
            "items" : [{
                        "service_id" : 0,
                        "act_id" : 0,  // must
                        "op_id" : 0,  // must
                        "file_cnt" : 7,
                        "file_size" : 6,
                        "dir_cnt" : 5,
                        "int_ext1" : 4,
                        "str_ext2" : "a",
                        "int_ext3" : 3,
                        "int_ext4" : 2,
                        "int_ext5" : 1,
                        "str_ext6" : "b",
                        "str_ext7" : "c",
                        "str_ext8" : "d"
                    }]
        }
    };*/
    // 缓冲工具类，移自ExtJs
    var DelayedTask = function(fn, scope, args) {
        var me = this,
            id,
            call = function() {
                clearInterval(id);
                id = null;
                fn.apply(scope, args || []);
            };
        this.delay = function(delay, newFn, newScope, newArgs) {
            me.cancel();
            fn = newFn || fn;
            scope = newScope || scope;
            args = newArgs || args;
            id = setInterval(call, delay);
        };
        this.cancel = function(){
            if (id) {
                clearInterval(id);
                id = null;
            }
        };
    };
    // 请求类，不再使用jQuery的jsonp，因为如果开了调试会提示脚本错误
    var url_getter = adapter.url_getter;

    // ------------- 71表上报配置 -------------------
    var log_wrapper_71 = function(logs){
        return {
            req_header : {
                uin : adapter.get_uin_num(), // must
                cmd : "wy_log_71",
                source : "weiyunWeb"
            },
            req_body : {
//                    "viplevel" : cached_user ? cached_user.get_vip_level() : null,
                "os_type" : adapter.OS_TYPE,  // must
                "items" : logs
            }
        };
    };
    // 默认的单条日志处理函数，什么操作都不做
    var default_log_converter = function(log){
        return log;
    };
    
    // ------------网盘的上报-----------------------
    var log_wrapper_ordinary = function(logs){
        var DEVICE_TYPE = 0; //IS_APPBOX ? 9002 : 9001;
        return {
            req_header : {
                uin : adapter.get_uin_num(),
                cmd: 'wy_log_flow_bat',
                dev_id: DEVICE_TYPE,
                os_type: adapter.OS_TYPE,
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
            },
            req_body : {
                log_data : logs
            }
        };
    };
    var log_converter_ordinary = function(log){
        var SERVICE_ID = 1;
        return $.extend({
            rst : 0
        }, log, {
            service_id: SERVICE_ID,
            subop: 0,
            extString1: adapter.OS_NAME,
            extString2: adapter.BROWSER_NAME + ($.browser.msie || window.ActiveXObject !== undefined ? parseInt($.browser.version, 10) : '')
        });
    };
    
    // --------------------40表------------------
    var log_wrapper_40 = function(logs){
        return {
            req_header : {
                cmd : 'stat',
                appid : adapter.OS_TYPE
            },
            req_body : {
//                uin : ''+adapter.get_uin_num(),
                table40 : logs
            }
        };
    };
    var log_converter_40 = function(log){
//        return $.extend({
//            
//        }, log);
        return log;
    };
    
    var build_logger = function(map, logs_wrapper, log_converter, meta){
        var queue = [], flush_task, flush_fn;
//        logs2data = logs2data || logs2data_71;
        logs_wrapper = logs_wrapper || log_wrapper_71;
        log_converter = log_converter || default_log_converter;
        meta = $.extend({
            url : translate_cgi('http://tj.cgi.weiyun.com/wy_log.fcg'),
            param : 'data',
            buffer : 1000
        }, meta);
        /**
         * 本接口支持批量操作，另外还有缓冲功能，即连续多次请求，会延迟一定时间后统一发出。
         * @param {Number/String/Object/Array}
         *            data 要上报的日志消息
         * @param {Boolean} flush (optional) 是否立即上报，用于点击链接跳转前上报的情况。
         */
        var log = function(data, flush) {
            if (!data) {
                return;
            }
            if ($.isArray(data)) {
                $.each(data, function(index, item) {
                    log(item);
                });
                return;
            }
            var cfg;
            switch (typeof data) {
                case 'number' :
                    cfg = {
                        act_id : data,
                        op_id : 0
                    };
                    break;
                case 'string' :
                    cfg = map[data];
                    break;
                case 'object' :
                    cfg = data;
                    if(cfg.name){
                        cfg = $.extend({}, map[cfg.name], cfg);
                        delete cfg.name;
                    }
                    break;
            }
            if(!cfg){
                return;
            }
            queue.push(log_converter(cfg));
            if(flush){
                flush_task.cancel();
                flush_fn();
            }else{
                flush_task.delay(meta.buffer); //定1秒的缓冲，1秒后如果没有新日志的话才提交，否则顺延。
            }
        };
        
        var 
            item_json_spliter = ',',
            item_spliter_length = encodeURIComponent(item_json_spliter).length,
            get_pending_logs = function(){
                if(queue.length<=0){
                    return;
                }
                var item, item_str, item_str_length, total_length = 0, items = [];
                while( ( item = queue.shift() ) ){
                    item_str = adapter.stringify(item);
                    item_str_length = encodeURIComponent(item_str).length + item_spliter_length;
                    // 当某单日志长度超出时，放弃此日志上报
                    if(item_str_length > max_data_length){
                        adapter.debug('上传日志大小异常，超出url长度限制');
                        continue;
                    }else if(total_length + item_str_length > max_data_length){ // 当总量超出，留到下次上报
                        // 回滚
                        queue.unshift(item);
                        break;
                    }
                    total_length += item_str_length;
                    items.push(item);
                }
                return items;
            };
        flush_fn = function(){
            if(queue.length<=0){
                return;
            }
            
    //        var cached_user = query_user.get_cached_user();
            var data_str = adapter.stringify(logs_wrapper(get_pending_logs()));
            
            try {
                url_getter.load(meta.url+'?'+meta.param+'='+encodeURIComponent(data_str)+'&_='+new Date().getTime());
            }catch (e) {
                adapter.debug('special_log 发送日志请求失败', e.message, e.line || '', e.file || '');
            }
            if(queue.length>0){
                flush_task.delay(meta.buffer);
            }
        };
        flush_task = new DelayedTask(flush_fn);
        log.flush = flush_fn;
        return log;
    };

    var default_log = build_logger(special_log_map);
    default_log.build_logger = build_logger;
    default_log.adapter = adapter;
    default_log.build_user_logger = function(map){
        return build_logger(map, log_wrapper_ordinary, log_converter_ordinary);
    };
    default_log.build_40_logger = function(map){
        return build_logger(map, log_wrapper_40, log_converter_40, {
            url : translate_cgi('http://stat.cgi.weiyun.com/stat.fcg')
        });
    };

    if(window.define && typeof window.define === 'function'){
        define("club/weiyun/js/common/special_log",[],function(){
            return default_log;
        });
    }else{
        window['special_log'] = default_log;
    }
})();