//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/previewer/previewer.r141016",["$","common"],function(require,exports,module){

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
//previewer/src/Event.js
//previewer/src/events.js
//previewer/src/iframe_load_helper.js
//previewer/src/inherit.js
//previewer/src/loader/Async_requestor.js
//previewer/src/loader/Base.js
//previewer/src/loader/Continuous.js
//previewer/src/loader/Iframe_continuous.js
//previewer/src/loader/Pdf.js
//previewer/src/loader/Ppt_list.js
//previewer/src/loader/Txt.js
//previewer/src/previewer/Base.js
//previewer/src/previewer/Doc.js
//previewer/src/previewer/Dynamic.js
//previewer/src/previewer/Pdf.js
//previewer/src/previewer/Ppt.js
//previewer/src/previewer/Ppt_list.js
//previewer/src/previewer/Txt.js
//previewer/src/previewer/Xls.js
//previewer/src/previewer/factory.js
//previewer/src/previewer/Dynamic.tmpl.html

//js file list:
//previewer/src/Event.js
//previewer/src/events.js
//previewer/src/iframe_load_helper.js
//previewer/src/inherit.js
//previewer/src/loader/Async_requestor.js
//previewer/src/loader/Base.js
//previewer/src/loader/Continuous.js
//previewer/src/loader/Iframe_continuous.js
//previewer/src/loader/Pdf.js
//previewer/src/loader/Ppt_list.js
//previewer/src/loader/Txt.js
//previewer/src/previewer/Base.js
//previewer/src/previewer/Doc.js
//previewer/src/previewer/Dynamic.js
//previewer/src/previewer/Pdf.js
//previewer/src/previewer/Ppt.js
//previewer/src/previewer/Ppt_list.js
//previewer/src/previewer/Txt.js
//previewer/src/previewer/Xls.js
//previewer/src/previewer/factory.js
/**
 * 原有的events是实例型的，这里扩展一个事件类。
 * @author cluezhang
 * @date 2013-8-12
 */
define.pack("./Event",["./inherit","./events"],function(require, exports, module){
    var 
        inherit = require('./inherit'),
        events = require('./events');
    var Event = inherit(Object, events);
    return Event;
});/**
 * 自定义事件（摘自 Backbone.Events）
 * evt = event_support();
 * evt.listen(my_object, function(){  });
 *
 * @author jameszuo
 * @date 13-1-23
 */
define.pack("./events",["$"],function (require, exports, module) {
    var $ = require('$'),
        array = [],
        slice = array.slice,

        _ = {}, // underscore

        undefined;


    // Backbone.Events
    // ---------------

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
        } else if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
        } else {
            return true;
        }
    };

    // Optimized internal dispatch function for triggering events. Tries to
    // keep the usual cases speedy (most Backbone events have 3 arguments).

    // @jameszuo 对这里做了一些改动，使其可以返回 false 供判断
    // 如果有任何一个回调返回了false，即返回false，否则返回最后一个值
    var triggerEvents = function (events, args) {
        var ev, ret, i = -1, l = events.length/*, hasFalse = false*/;
        while (++i < l) {
            ret = (ev = events[i]).callback.apply(ev.ctx, args);
            if (false === ret) {
                return false;
            }
        }
        return ret;
    };

    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    // Retrieve the names of an object's properties.
    _.keys = function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (obj.hasOwnProperty(key))
                keys[keys.length] = key;
        return keys;
    };

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = {

        // Bind one or more space separated events, or an events map,
        // to a `callback` function. Passing `"all"` will bind the callback to
        // all events fired.
        on:function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback:callback, context:context, ctx:context || this});
            return this;
        },

        // Bind events to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once:function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off:function (name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = {};
                return this;
            }

            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) {
                        for (j = 0, k = events.length; j < k; j++) {
                            ev = events[j];
                            if ((callback && callback !== ev.callback &&
                                callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length) delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger:function (name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            // var allEvents = this._events.all; //@james

            var retVal;
            if (events)
                retVal = triggerEvents(events, args);
            // if (allEvents) triggerEvents(allEvents, arguments); //@james
            // return this; //@james

            return retVal;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening:function (obj, name, callback) {
            var listeners = this._listeners;
            if (!listeners) return this;
            if (obj) {
                obj.off(name, typeof name === 'object' ? this : callback, this);
                if (!name && !callback) delete listeners[obj._listenerId];
            } else {
                if (typeof name === 'object') callback = this;
                for (var id in listeners) {
                    listeners[id].off(name, callback, this);
                }
                this._listeners = {};
            }
            return this;
        }
    };

    var listenMethods = {listenTo:'on', listenToOnce:'once'};

    // An inversion-of-control versions of `on` and `once`. Tell *this* object to listen to
    // an event in another object ... keeping track of what it's listening to.
    $.each(listenMethods, function (method, implementation) {
        Events[method] = function (obj, name, callback) {
            var me = this,
                listeners = me._listeners || (me._listeners = {}),
                id = obj._listenerId || (obj._listenerId = uniqueId());

            listeners[id] = obj;

            if (typeof name === 'string' && typeof callback === 'function') {
                obj[implementation](name, typeof name === 'object' ? me : callback, me);
            } else if (typeof name === 'object') {
                var map = name;
                $.each(map, function (name, callback) {
                    obj[implementation](name, callback, me);
                });
            }
            return me;
        };
    });

    var once = function (func) {
        var ran = false, memo;
        return function () {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    var idCounter = 0;
    var uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    return Events;

});/**
 * 
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./iframe_load_helper",["$"],function(require, exports, module){
    var $ = require('$');
    /*
     * 先监听onload事件，完成后：
     * 1 如果无法访问document，跨域，立即显示成功
     * 2 如果可以访问
     * 2.1 如果wy_previewer_loading为true或无内容，等待N秒超时成功，或等wy_previewer_loading变为false或者有内容
     * 2.2 否则立即显示成功
     * 
     * --- 2013/09/10补充 ---
     * --- 2013/10/10修改 ---
     * 在html文档比较大的情况下，可能会出现onload事件不触发的情况。
     * 经测试appbox是处于渲染状态，渲染完后才会触发onload事件。
     * 为了规避，设定超时后如果能访问document并有内容，判断为渲染状态，适当延长超时时间，直至onload触发。
     * ------------------------
     */
    function getState(iframe){
        var dom = $(iframe)[0], win;
        var accessible = true;
        var selfLoading = false;
        var empty = true;
        try{
            win = dom.contentWindow;
            selfLoading = win.wy_previewer_loading === true;
            empty = win.document.body.childNodes.length <= 0;
        }catch(e){
            accessible = false;
        }
        return {
            accessible : accessible,
            selfLoading : selfLoading,
            empty : empty
        };
    }
    return {
        hook : function(iframe, timeout){
            var def = $.Deferred();
            var domLoaded = false;
            
            var detectTimer, expireTimer, backhandTimer, contentDetected = false;
            // 判断是否加载成功
            var ifDone = function(){
                var state = getState(iframe);
                if(domLoaded && (!state.accessible || !state.selfLoading && !state.empty)){
                    finalize(true);
                }else if(!contentDetected && state.accessible && !state.selfLoading && !state.empty){ // 如果有内容了，通知，避免因渲染卡住而判断为加载超时
                    contentDetected = true;
                    def.notify('contentDetected');
                }
            };
            // iframe加载时触发
            var hookLoaded = function(){
                domLoaded = true;
                ifDone();
            };
            // 结束出口
            var finalize = function(success){
                clearInterval(detectTimer);
                clearTimeout(expireTimer);
                //clearTimeout(backhandTimer);
                $(iframe).off('load', hookLoaded);
                if(success){
                    def.resolve();
                }else{
                    def.reject();
                }
                // 只能调用一次
                finalize = $.noop;
            };
            
            $(iframe).on('load', hookLoaded);
            detectTimer = setInterval(ifDone, 100);
            // 已经有其它地方的超时处理了，这里关掉
            expireTimer = setTimeout(function(){ // 超时时，如果没有加载完成则表示为失败，如果加载完只是内容及loading判断不成功，判断为成功
                var state = getState(iframe);
                finalize(domLoaded || state.accessible);
            }, (timeout || 30) * 1000);
            return def;
        }
    };
});/**
 * 类继承
 * @author cluezhang
 * @example
 * var SubClass = inherit({
 *     constructor: function () {},
 *     foo: function () {},
 *     ...
 * }, SuperClass);
 */
define.pack("./inherit",["$"],function (require, exports, module) {
    var $ = require('$');
    var object_proto = Object.prototype;
    var isObject = function (v) {
        return !!v && object_proto.toString.call(v) === '[object Object]';
    };
    var override = function (cls, overrides) {
        var proto = cls.prototype;
        $.extend(proto, overrides);
        if ($.browser.msie && overrides.hasOwnProperty('toString')) {
            proto.toString = overrides.toString;
        }
    };
    var object_constructor = object_proto.constructor;
    return function (sub_class, super_class, overrides) {
        if (isObject(super_class)) {
            overrides = super_class;
            super_class = sub_class;
            sub_class = overrides.constructor !== object_constructor ? overrides.constructor
                : function () {
                super_class.apply(this, arguments);
            };
        }
        var F = function () {
        }, sub_proto, super_proto = super_class.prototype;

        F.prototype = super_proto;
        sub_proto = sub_class.prototype = new F();
        sub_proto.constructor = sub_class;
        sub_class.superclass = super_proto;
        if (super_proto.constructor === object_constructor) {
            super_proto.constructor = super_class;
        }
        sub_class.override = function (o) {
            override(sub_class, o);
        };
        override(sub_class, overrides);
        return sub_class;
    };

});/**
 * 预览异步轮询请求
 * 后台会返回3种结果：
 * 1. 服务器重定向
 * 2. 正在进行
 * 3. 返回正常结果
 * 这里封装后，就只有成功或失败2种结果了
 * @author cluezhang
 * @date 2013-12-10
 */
define.pack("./loader.Async_requestor",["./inherit","$","common"],function(require, exports, module){
    var 
        inherit = require('./inherit'),
        $ = require('$'),
        https_tool = require('common').get('./util.https_tool');

    var Requestor = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * @cfg {Number} single_timeout 单次轮询超时，默认10（秒）
         */
        single_timeout : 10,
        /**
         * @cfg {Number} timeout 总共的超时时间，默认60（秒）
         */
        timeout : 60,
        /**
         * @cfg {Number} 轮询间隔
         */
        interval : 2,
        max_retry : 3,
        /**
         * @property {Object} 请求失败的类型
         */
        failure_types : {
            Network : 'network',
            Server : 'server',
            Timeout : 'timeout',
            Abort : 'abort'
        },
        /**
         * @private
         * 预览服务器返回码定义
         */
        server_errors : {
            // 预览类型不支持
            '206005' : {
                tip : '暂不支持预览该类型文件',
                retry : false, // 是否能重试
                download : true // 是否能下载
            },
            // 文件类型不支持
            '206006' : {
                tip : '暂不支持预览该类型文件',
                retry : false,
                download : true
            },
            // 转换失败
            '206011' : {
                tip : '文件预览失败',
                retry : false,
                download : true
            },
            // 文件不存在
            '206013' : {
                tip : '文件预览失败，该文件不存在',
                retry : false,
                download : false
            },
            // 文件加密
            '206014' : {
                tip : '原文件已加密',
                retry : false,
                download : true
            },
            // 文件损坏
            '206015' : {
                tip : '文件预览失败',
                retry : false,
                download : true
            },
            // 未知错误
            '206999' : {
                tip : '文件预览失败',
                retry : true,
                download : true
            }
        },
        /**
         * @property {Object} 返回的state，各种状态码的定义
         * @private
         */
        state_types : {
            Dispatch : 2, // 服务器重分派
            Processing : 1, // 正在处理（正在下载或正在转换）
            Complete : 0 // 处理完毕，返回结果
        },
        /**
         * 分段预览
         * @param {Object} options 有以下属性
         *      host（原始请求服务器，例如：docview.weiyun.com。如果服务器返回dispatch，会自动切换）
         *      path（cgi路径，不含host，例如：/document_view.fcg?xxx）
         *      params（get参数对象）属性
         * @param {Object} no_encoding_params 指定哪些属性不进行转义（服务器方skey不能将@转义，坑。。）
         * @return {$.Deferred} def 成功后，done回调第一个参数为response；
         *      失败时，第一个参数为{@link #failure_types}中定义的错误类型，如果为Server类型，则第2参数为错误码
         */
        get : function(options, no_encoding_params){
            var def = $.Deferred(), me = this;
            def.options = options;
            def.retry = 0;
            def.no_encoding_params = no_encoding_params;
            
            def.abort = function(){
                def.reject(me.failure_types.Abort);
            };
            
            this.do_request(def);
            
            setTimeout(function(){
                def.reject(me.failure_types.Timeout);
            }, this.timeout * 1000);
            
            return def;
        },
        /**
         * @private
         */
        buffer_do_request : function(def, buffer){
            var me = this;
            setTimeout(function(){
                me.do_request(def);
            }, (buffer || me.interval) * 1000);
        },
        /**
         * 某些字段不进行转义，比如skey
         * @private
         */
        encode_params : function(data, no_encoding_params){
            var key, value, queries = [], encode;
            for(key in data){
                if(data.hasOwnProperty(key)){
                    value = data[key];
                    if(no_encoding_params.hasOwnProperty(key)){
                        queries.push(key + '=' + value);
                    }else{
                        queries.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                }
            }
            return queries.join("&");
        },
        /**
         * 发起单个请求
         * @private
         */
        do_request : function(def){
            if(def.state() !== 'pending'){
                return;
            }
            var me = this, options,
                opt = def.options,
                host = def.host || opt.host;
            options = $.extend({
                    timeout: me.single_timeout * 1000,
                    dataType : 'jsonp'
                }, {
                    url : host + opt.path,
                    data : opt.params
                });
            if (options.url.indexOf('http') !== 0) {
                options.url = 'http://' + options.url;
            }
            if(def.no_encoding_params){
                options.data = this.encode_params(options.data, def.no_encoding_params);
            }
            options.url = https_tool.translate_cgi(options.url);
            $.ajax(options).done(function(data){
                me.process_response(def, data);
            }).fail(function(){
                def.retry++;
                // 如果轮询失败次数超限，则失败
                if(def.retry >= me.max_retry){
                    def.reject(me.failure_types.Network);
                }else{
                    // 否则还抢救一下
                    me.buffer_do_request(def);
                }
            });
        },
        /**
         * 处理请求返回
         * @private
         */
        process_response : function(def, response){
            var ret = response.result, msg, state, error_meta,
                me = this,
                state_types = me.state_types;
            if(ret === 0){
                // 成功
                state = response.state;
                switch(state){
                    case state_types.Dispatch:
                        def.host = response.host;
                        me.buffer_do_request(def, response.interval);
                        break;
                    case state_types.Processing:
                        me.buffer_do_request(def, response.interval);
                        break;
//                    case state_types.Complete:
                    default:
                        def.resolve(response);
                        break;
                }
            }else{
                error_meta = this.server_errors[ret] || {
                    tip : '文件预览失败',
                    retry : true,
                    download : true
                };
                def.reject(me.failure_types.Server, ret, error_meta);
            }
        }
    });
    return Requestor;
});/**
 * 通用预览结果请求加载
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./loader.Base",["./inherit","./Event","./loader.Async_requestor","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Async_requestor = require('./loader.Async_requestor'),
        $ = require('$');
    var Module = inherit(Object, {
        requestor : new Async_requestor(),
        /**
         * @cfg {Object} properties 预览文件的必要信息，含以下字段：
         *      uin
         *      skey
         *      appid
         *      
         *      file_id
         *      file_md5
         *      file_name
         *      file_size
         *      parent_dir_key
         *      
         *      file_src  0为普通文件，1为压缩包中的，2为离线文件
         *      compress_path  当file_src为1时有效，标识它在压缩包中的路径
         *      offline_type  当file_src为2时有效，1为发送列表，2为接收列表
         */
        // 属性映射关系表，原cgi字的字段太抽象了，表示看不懂
        property_translates : {
            uin : 'mf',
            skey : 'vi',
            appid : 'sai',
            
            file_id : 'fi',
            file_md5 : 'fm',
            file_name : 'fn',
            file_size : 'fsize',
            parent_dir_key : 'pdk',
            
            file_src : 'fsrc',
            compress_path : 'fpath',
            offline_type : 'fcat'
        },
        constructor : function(cfg){
            $.extend(this, cfg);
            this.loading = false;
        },
        is_loading : function(){
            return !!this.loading;
        },
        /**
         * @override
         * @return {Object} options
         */
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/docview_np.fcg',
                params : $.extend({
                    cmd: 'office_view'
                }, this.get_params())
            };
        },
        get_params : function(){
            var params = {
                bv: '20130120',
                vt: 1,
                fin: 1,
                ratio: 1
            };
            
            var properties = this.properties, n, map_key, translates = this.property_translates;
            for(n in properties){
                if(properties.hasOwnProperty(n)){
                    map_key = translates.hasOwnProperty(n) ? translates[n] : n;
                    params[map_key] = properties[n];
                }
            }
            
            return params;
        },
        get_no_encoding_params : function(){
            var filter = {},
                translates = this.property_translates;
            
            // skey不进行转义，防止@转义后cgi不认
            filter[translates['skey']] = true;
            filter[translates['compress_path']] = true;
            
            return filter;
        },
        get : function(){
            if(this.loading){
                return;
            }
            var me = this,
                def = this.requestor.get(me.get_options(), me.get_no_encoding_params());
            
            me.loading = def;
            def.always(function(){
                me.loading = false;
            });
            
            return def;
        },
        /**
         * @private
         */
        abort : function(){
            if(this.loading){
                this.loading.abort();
            }
        }
    });
    return Module;
});/**
 * 分段加载的Loader
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./loader.Continuous",["./inherit","./Event","./loader.Base","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Base'),
        $ = require('$');
    var Module = inherit(Loader, {
        complete : false,
        get : function(){
            var def = Module.superclass.get.apply(this, arguments),
                me = this;
            if(!def){
                return;
            }
            def.done(function(response){
                me.on_load(response);
            });
            return def;
        },
        /**
         * 当一段数据加载完成后
         */
        on_load : function(response){
        },
        is_complete : function(){
            return this.complete;
        }
    });
    return Module;
});/**
 * 分Iframe加载的Loader
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./loader.Iframe_continuous",["./inherit","./Event","./loader.Continuous","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Continuous'),
        $ = require('$');
    var Module = inherit(Loader, {
        page : 0,
        page_size : 3,
        /**
         * @override
         * @return {Object} options
         */
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/docview_np.fcg',
                params : $.extend({
                    cmd: 'office_view',
                    sp : this.page+1,
                    pc : this.page_size
                }, this.get_params())
            };
        },
        /**
         * 当一段数据加载完成后
         */
        on_load : function(response){
            this.total_page = response.total_page;
            this.page += response.files.length;
            
            if(this.page >= this.total_page){
                this.complete = true;
            }
        }
    });
    return Module;
});/**
 * PDF预览，分段加载器，每次返回3页html
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./loader.Pdf",["./inherit","./loader.Iframe_continuous","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Iframe_continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        get_options : function(){
            return {
                host : 'http://pdf.cgi.weiyun.com',
                path : '/pdfview_np.fcg',
                params : $.extend({
                    cmd: 'pdf_view',
                    sp : this.page+1,
                    pc : this.page_size
                }, this.get_params())
            };
        }
    });
    return Module;
});/**
 * PPT预览，原appbox的预览方式，一页页加载
 * @author cluezhang
 * @date 2013-12-17
 */
define.pack("./loader.Ppt_list",["./inherit","./loader.Iframe_continuous","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Iframe_continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        get_options : function(){
            var options = Module.superclass.get_options.apply(this, arguments);
            options.params.gps = 1; // lucifahuang: 参数名是gps，传1表示获取子页面，不传或传其他值表示获取主页面。
            return options;
        }
    });
    return Module;
});/**
 * 文本预览，分段加载器
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./loader.Txt",["./inherit","./loader.Continuous","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        loaded_size : 0,
        page_size : 20*1024,
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/txtview_np.fcg',
                params : $.extend({
                    cmd: 'txtview',
                    fo : this.loaded_size,
                    ps : this.page_size
                }, this.get_params())
            };
        },
        on_load : function(response){
            var next_pos = response.next_pos;
            if(next_pos < 0){
                this.complete = true;
            }else{
                this.loaded_size = next_pos;
            }
        }
    });
    return Module;
});/**
 * 最基本的预览，直接显示一个全屏的iframe。
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./previewer.Base",["./inherit","./Event","./loader.Base","./iframe_load_helper","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Base'),
        iframe_load_helper = require('./iframe_load_helper'),
        $ = require('$');
    var Module = inherit(Event, {
        background : '#808080',
        loaded : false,
        /**
         * @cfg {String} iframe_layout 如何设定iframe大小，共有3种值：
         * none : 什么都不做，没有iframe时适用（例如Txt预览）
         * fit : 将它设定为 100%大小，容器不带滚动条，只有1个iframe并自带布局时适用（例如ppt？）
         * auto : 尝试读取内容大小，并自动通知外界当前内容大小。
         */
        iframe_layout : 'auto',
        /**
         * @cfg {jQueryElement} $container
         */
        /**
         * @cfg {Loader} loader
         */
        Loader : Loader,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.loader = new this.Loader({
                properties : this.properties
            });
            this.init_dom();
            this.init_container();
            switch(this.iframe_layout){
                case 'fit':
                    this.on('iframeloaded', this.fit_iframe, this);
                    break;
                case 'auto':
                    this.accumulate_size = {
                        width : 0,
                        height : 0
                    };
                    this.on('iframebeforeload', this.set_iframe_noscrolling, this);
                    this.on('iframeloaded', this.adjust_iframe, this);
                    break;
                // case 'none':
                default:
                    break;
            }
        },
        init_container : function(){
            // fit不带滚动条，其它的都带
            var has_scrollbar = this.has_scrollbar = this.iframe_layout !== 'fit';
            this.$container.css({
                overflow : has_scrollbar ? 'auto' : 'visible',
                backgroundColor : this.background
            });
        },
        /**
         * @private
         */
        fit_iframe : function($iframe){
            $iframe.css({
                height : '100%',
                width : '100%'
            });
        },
        /**
         * @private
         */
        set_iframe_noscrolling : function($iframe){
            $iframe.attr('scrolling', 'no').css('overflow', 'hidden');
        },
        /**
         * @private
         */
        adjust_iframe : function($iframe){
            var size = this.get_iframe_size($iframe),
                accumulate_size = this.accumulate_size;
            $iframe.width(size.width).height(size.height);
            var old_total_width = accumulate_size.width,
                old_total_height = accumulate_size.height,
                total_width, total_height;
            total_width = accumulate_size.width = Math.max(old_total_width, size.width);
            total_height = accumulate_size.height = old_total_height + size.height;
            
            // 当为auto布局时，要外界配合进行大小调整，以避免显示过多空白区域
            if(this.iframe_layout === 'auto'){
                this.trigger('contentresize', total_width, total_height, this.has_scrollbar);
            }
        },
        get_iframe_size : function($iframe){
            var $content, width, height;
            try{
                $content = $iframe.contents();
                width = $content.width();
                height = $content.height();
            }catch(e){
                // 当跨域后，返回一个万金油大小
                return {
                    width : 700,
                    height : 500
                };
            }
            return {
                width : width,
                height : height
            };
        },
        init_dom : function(){
            this.$content = this.$container;
        },
        init : function(){
            var me = this;
            var def = this.do_load();
//            if(def){
                def.fail(function(type, errorno){
                    me.show_failure(type, errorno);
                });
//            }
            return def;
        },
        // private
        do_load : function(){
            var me = this;
            var def = me.loader.get();
//            if(def){
                def.done(function(response){
                    me.do_render(response);
                });
//            }
            return def;
        },
        do_render : function(response){
            var me = this,
                files = response.files,
                host = 'http://' + response.host,
                url_prefix = response.url_prefix,
                iframe_srcs = [];
            if(!/^\//.test(url_prefix)){
                url_prefix = '/' + url_prefix;
            }
            $.each(files, function(index, file){
                me.add_iframe(host + url_prefix + file);
            });
        },
        add_iframe : function(src){
            var me = this,
                $iframe = $('<iframe frameborder="0"></iframe>').css({
                    'visibility': 'hidden',
                    'width': 'auto',
                    'height': 'auto'
                }).attr('src', src).appendTo(me.$content);
            
//            if(!me.loaded){
                me.trigger('iframebeforeload', $iframe);
                iframe_load_helper.hook($iframe).done(function(){
                    $iframe.css('visibility', '');
                    if(!me.loaded){
                        me.loaded = true;
                        me.trigger('load');
                    }
                    me.trigger('iframeloaded', $iframe);
                }).progress(function(state){
                    if(state === 'contentDetected'){
                        me.trigger('iframecontentdetected', $iframe);
                    }
                });
//            }
            
            return $iframe;
        },
        show_failure : function(){
            this.trigger('failure');
        },
        destroy : function(){
            this.stopListening();
            this.on_destroy();
        },
        on_destroy : function(){
            this.$content.empty();
            this.loader.abort();
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define.pack("./previewer.Doc",["./inherit","./Event","./previewer.Base","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Base'),
        $ = require('$');
    var Module = inherit(Previewor, {
        get_iframe_size : function($iframe){
            var size = Module.superclass.get_iframe_size.apply(this, arguments);
            // hack，DOC文档要预留8px的两侧空白，比较恶心
            size.width += 8*2;
            return size;
        }
    });
    return Module;
});/**
 * 多页、内容分批加载的文档预览
 * @author cluezhang
 * @date 2013-12-10
 */
define.pack("./previewer.Dynamic",["./inherit","./Event","./previewer.Base","./tmpl","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Base = require('./previewer.Base'),
        tmpl = require('./tmpl'),
        $ = require('$');
    var Module = inherit(Base, {
        automatic_load : 0,
        iframe_layout : 'auto', // 自动加载的话，一般都是iframe自行撑开
        max_automatic_load : 3, // 后手，如果自动加载更多达到此限制后，就中止，防止异常逻辑。
        constructor : function(cfg){
            Module.superclass.constructor.apply(this, arguments);
            // 绑定if loading逻辑
            var me = this;
            me.scroll_handler = function(){
                me.if_loadmore();
            };
            me.$container.on('scroll', me.scroll_handler);
            
            // 第一次加载成功后，显示加载更多的界面
            this.on('load', this.update_loadmore_visible, this);
        },
        init_dom : function(){
            var $ct = this.$container;
            $ct.html(tmpl.dynamic_preview());
            
            var find_previewer_el = function(name){
                return $ct.find('[data-name=preview-'+name+']');
            };
            
            this.$loadmore = find_previewer_el('loadmore');
            this.$loadmore_ct = find_previewer_el('loadmore-container');
            this.$content = find_previewer_el('content');
        },
        update_loadmore_visible : function(){
            this.$loadmore.toggle(!this.loader.is_complete());
        },
        /**
         * 当容器大小改变时触发，此时显示区域大小变动，可能可以加载更多的内容。
         * @param {Number} width
         * @param {Number} height
         */
        on_resize : function(width, height){
            this.if_loadmore();
        },
        /**
         * 加载更多内容
         * @private
         * @param {Boolean} automatic 标识是否为自动触发的加载，见{@link #if_loadmore}的参数
         */
        loadmore : function(automatic){
            var me = this,
                loader = me.loader;
            if(loader.is_loading() || loader.is_complete()){
                return;
            }
            var def = me.do_load();
            
//            if(def){
                def.done(function(){
                    me.update_loadmore_visible();
                    if(automatic){
                        me.automatic_load ++;
                        if(me.automatic_load > me.max_automatic_load){
                            return;
                        }
                    }
                    setTimeout(function(){
                        me.if_loadmore(true);
                    }, 1000);
                });
//            }
            
            return def;
        },
        /**
         * 是否滚动条拖到最下了，要加载更多？
         * @private
         * @param {Boolean} automatic 是否为自动触发的加载，如果是自动触发的则会限定最大递归加载次数。如果是人为的，则无限制。
         */
        if_loadmore : function(automatic){
            var me = this,
                $ct = me.$container,
                $loadmore = me.$loadmore,
                loader = me.loader;
            if(loader.is_complete()){
                return;
            }
            if($loadmore.offset().top <= $ct.offset().top + $ct.height() + 100){
                this.loadmore(automatic);
            }
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this.$container.off('scroll', this.scroll_handler);
        }
    });
    
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-11
 */
define.pack("./previewer.Pdf",["./inherit","./Event","./previewer.Dynamic","./loader.Pdf","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Pdf_loader = require('./loader.Pdf'),
        $ = require('$');
    var Module = inherit(Previewor, {
        Loader : Pdf_loader
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define.pack("./previewer.Ppt",["./inherit","./Event","./previewer.Base","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Base'),
        $ = require('$');
    var Module = inherit(Previewor, {
        background : '#ffffff',
        iframe_layout : 'fit'
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define.pack("./previewer.Ppt_list",["./inherit","./Event","./previewer.Dynamic","./loader.Ppt_list","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Loader = require('./loader.Ppt_list'),
        $ = require('$');
    var Module = inherit(Previewor, {
        Loader : Loader,
        adjust_iframe : function($iframe){
            Module.superclass.adjust_iframe.apply(this, arguments);
            try{
                $iframe.contents().find('body').css({
                    padding : '8px 0 0 0',
                    margin : '0',
                    backgroundColor : '#808080'
                });
            }catch(e){
                // 跨域
            }
        },
        get_iframe_size : function(){
            return {
                width : 740,
                height : 558
            };
        }
    });
    return Module;
});/**
 * Txt预览
 * @author cluezhang
 * @date 2013-12-12
 */
define.pack("./previewer.Txt",["./inherit","./Event","./previewer.Dynamic","./loader.Txt","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Txt_loader = require('./loader.Txt'),
        $ = require('$');
    // wtf IE标准模式把\r\n显示为双重换行问题
    // http://stackoverflow.com/questions/10887011/javascript-preformatted-text-with-cross-browser-line-breaks
    var eol = (function(){
        var textarea = document.createElement("textarea");
        textarea.value = "\n";
        return textarea.value.replace(/\r\n/, "\r");
    })();
    var Module = inherit(Previewor, {
        background : '#fff',
        Loader : Txt_loader,
        iframe_layout : 'none', // 没有iframe
        init_dom : function(){
            Module.superclass.init_dom.apply(this, arguments);
            this.$txt_content = $('<pre></pre>').css({
                'font-size' : '13px',
                'text-align' : 'left',
                'color' : 'black',
                'padding' : '0 5px',
                'line-height' : '18px',
                'margin' : '0px',
                'border' : '0px',
                'white-space' : 'pre-wrap',
                'word-wrap' : 'break-word'
            }).appendTo(this.$content);
        },
        do_render : function(response){
            var text = response.data || '';
            // 统一化换行符
            text = text.replace(/\r\n?|\n/g, eol);
            //$('<span/>').text(text).appendTo($content);
            this.$txt_content.append(document.createTextNode(text));
            
            this.trigger('txtloaded', text);
            
            if(!this.loaded){
                this.$loadmore.show();
                this.loaded = true;
                this.trigger('load');
            }
            // IE下会有一点奇怪的错位
            if($.browser.msie){
                this.$loadmore_ct.repaint();
            }
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this.$txt_content.remove();
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define.pack("./previewer.Xls",["./inherit","./Event","./previewer.Base","$"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Base'),
        $ = require('$');
    var Module = inherit(Previewor, {
        iframe_layout : 'fit'
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-12-13
 */
define.pack("./previewer.factory",["./inherit","./Event","$","./previewer.Txt","./previewer.Pdf","./previewer.Ppt","./previewer.Xls","./previewer.Doc","./previewer.Ppt_list","./previewer.Base"],function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        $ = require('$');
    var types = {
        txt : require('./previewer.Txt'),
        pdf : require('./previewer.Pdf'),
        ppt : require('./previewer.Ppt'),
        pptx : require('./previewer.Ppt'),
        xls : require('./previewer.Xls'),
        xlsx : require('./previewer.Xls'),
        doc : require('./previewer.Doc'),
        docx : require('./previewer.Doc'),
        wps : require('./previewer.Doc'),
        rtf : require('./previewer.Doc')
    };
    var appbox_types = {
        // appbox下PPT文档维持原样
        ppt : require('./previewer.Ppt_list'),
        pptx : require('./previewer.Ppt_list')
    };
    var default_type = require('./previewer.Base');
    var Module = {
        get_previewer : function(document_type, types){
            var Previewer;
            document_type = (document_type || '').toLowerCase();
            if(types.hasOwnProperty(document_type)){
                Previewer = types[document_type];
            }
            return Previewer;
        },
        create : function(document_type, configs){
            var Previewer = this.get_previewer(document_type, types) || default_type;
            return new Previewer(configs);
        },
        appbox_create : function(document_type, configs){
            var Previewer = this.get_previewer(document_type, appbox_types) || this.get_previewer(document_type, types) || default_type;
            return new Previewer(configs);
        }
    };
    return Module;
});
//tmpl file list:
//previewer/src/previewer/Dynamic.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'dynamic_preview': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var loading_src = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/loading.gif';
    __p.push('    <div data-name="preview-content" class="previewer-dynamic-content"></div>\r\n\
    <div data-name="preview-loadmore-container" class="previewer-dynamic-loadmore-container" style="height: 1px;">\r\n\
        <div data-name="preview-loadmore" class="previewer-dynamic-loadmore" style="background-color: #eee;height: 36px;line-height: 36px;text-align: center;width: 100%;vertical-align: middle;display:none;">\r\n\
            <img style="vertical-align: middle;background:none;border:0;padding:0;margin:0;" src="');
_p(loading_src);
__p.push('" /> 加载中...\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
