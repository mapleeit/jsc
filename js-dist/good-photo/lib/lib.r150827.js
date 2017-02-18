//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/good-photo/lib/lib.r150827",["$"],function(require,exports,module){

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
//lib/src/Mgr.js
//lib/src/Module.js
//lib/src/cookie.js
//lib/src/dateformat.js
//lib/src/events.js
//lib/src/image_loader.js
//lib/src/prettysize.js
//lib/src/router.js
//lib/src/security.js
//lib/src/text.js
//lib/src/url_parser.js

//js file list:
//lib/src/Mgr.js
//lib/src/Module.js
//lib/src/cookie.js
//lib/src/dateformat.js
//lib/src/events.js
//lib/src/image_loader.js
//lib/src/prettysize.js
//lib/src/router.js
//lib/src/security.js
//lib/src/text.js
//lib/src/url_parser.js
/**
 * 自定义事件管理基础类
 * @author hibincheng
 * @date 2014-12-20
 */
define.pack("./Mgr",["$","./events","./Module"],function(require, exports, module) {
    var $ = require('$'),
        events = require('./events'),
        Module = require('./Module'),

        undefined;

    function Mgr(name, opt) {
        Module.call(this, name, opt);

        this._observe_mods_map = {};
    }

    $.extend(Mgr.prototype, Module.prototype, {

        /**
         * 观察者模式实现，监听模块的自定义事件
         * @param {Module} mod 模块
         */
        observe: function(mod) {
            if(this.has_observe_mod(mod)) {
                return;
            }
            this._observe_mods_map[mod.name] = mod;
            this.bind_action(mod);
        },

        has_observe_mod: function(mod) {
            if(!mod.name) {
                console.error('observe module must have name');
                return false;
            }
            return !!this._observe_mods_map[mod.name];
        },

        /**
         * 绑定自定义事件
         * @param mod
         */
        bind_action: function(mod) {
            this.listenTo(mod, 'action', function(action_name, data, event) {
                this.dispatch_action(action_name, data, event);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event);
            }
            event && event.preventDefault();
        },

        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },

        abort_ajax: function() {
            this._send_req && this._send_req.destroy();
        },

        destroy: function() {
            var me = this;
            this.abort_ajax();
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }
    });

    return Mgr;
});/**
 * 模块基础类
 * @author hibincheng
 * @date 2014-12-20
 */
define.pack("./Module",["$","./events"],function(require, exports, module) {
    var $ = require('$'),
        events = require('./events'),

        undefined;

    function Module(name, opt) {
        this.name = name;
        if(typeof opt === 'object' && opt !== null) {
            $.extend(this, opt);
        }
    }

    $.extend(Module.prototype, events);
    //todo:实现类继承

    return Module;
});/**
 * cookie
 * @james 2012/12/16
 *
 * 示例:
 * 写cookie:
 * cookie.set(name, value, options)
 *    options.domain    可访问该cookie的domain
 *    options.path      可访问该cookie的路径
 *    options.expires   有效期（单位：分钟）
 *    options.raw       是否保留格式而不编码，默认false
 *    options.secure    是否https cookie
 */

define.pack("./cookie",[],function (require, exports, module) {

    var loc = location,
        doc = document,
        defaults = {
            domain: loc.hostname,
            path: loc.pathname,
            expires: 0,
            secure: false,
            raw: false,
            json: false
        },
        pluses = /\+/g,
        raw = function (s) {
            return s;
        },
        decoded = function (s) {
            return decodeURIComponent(s.replace(pluses, ' '));
        },
        getOptions = function (options) {
            options = options || {};
            for (var key in defaults) {
                options[key] = options[key] || defaults[key];
            }
            return options;
        },

        /**
         * 写cookie
         * @param {String} key
         * @param {String} value
         * @param {Object} options
         * @return {String} new_cookie
         */
        set = function (key, value, options) {
            if (!key) return '';

            options = getOptions(options);

            if (value === null) {
                options.expires = -1;
            } else {
                if(!options.raw){
                    value = encodeURIComponent(options.json ? JSON.stringify(value) : String(value));
                }
            }

            // 过期时间
            var expires_date;
            if (options.expires !== 0) {
                expires_date = new Date();
                expires_date.setMinutes(new Date().getMinutes() + options.expires);
            }

            return (doc.cookie = [
                encodeURIComponent(key), '=', value,
                expires_date ? '; expires=' + (expires_date.toUTCString()) : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        },
        get = function (key, options) {
            if (!key) return '';

            options = getOptions(options);

            var decode = options.raw ? raw : decoded;
            var cookies = doc.cookie.split('; ');
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                if (decode(parts.shift()) === key) {
                    var cookie = decode(parts.join('='));
                    return options.json ? JSON.parse(cookie) : cookie;
                }
            }
            return '';
        },
        unset = function (key, options) {
            if (get(key) !== null) {
                set(key, null, options);
                return true;
            }
            return false;
        },

        minutes = function (n) {
            return n;
        },
        hours = function (n) {
            return minutes(n) * 60;
        },
        days = function (n) {
            return hours(n) * 24;
        },
        months = function (n) {
            return days(n) * 30;
        },
        years = function (n) {
            return months(n) * 12;
        };

    return {
        set: set,
        get: get,
        unset: unset,
        minutes: minutes,
        hours: hours,
        days: days,
        months: months,
        years: years
    };
});
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
define.pack("./dateformat",[],function(require, exports, modules) {


        var dateFormat = (function() {
            var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
            var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
            var timezoneClip = /[^-+\dA-Z]/g;

            // Regexes and supporting functions are cached through closure
            return function (date, mask, utc, gmt) {

                // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
                if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }

                date = date || new Date;

                if(!(date instanceof Date)) {
                    // modified by maplemiao, make it compatible for 10 digits unix timestamp
                    if (typeof date === 'number' && date.toString().length == 10) {
                        date = date * 1000;
                    }
                    // modified done
                    date = new Date(date);
                }

                if (isNaN(date)) {
                    throw TypeError('Invalid date');
                }

                mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);

                // Allow setting the utc/gmt argument via the mask
                var maskSlice = mask.slice(0, 4);
                if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
                    mask = mask.slice(4);
                    utc = true;
                    if (maskSlice === 'GMT:') {
                        gmt = true;
                    }
                }

                var _ = utc ? 'getUTC' : 'get';
                var d = date[_ + 'Date']();
                var D = date[_ + 'Day']();
                var m = date[_ + 'Month']();
                var y = date[_ + 'FullYear']();
                var H = date[_ + 'Hours']();
                var M = date[_ + 'Minutes']();
                var s = date[_ + 'Seconds']();
                var L = date[_ + 'Milliseconds']();
                var o = utc ? 0 : date.getTimezoneOffset();
                var W = getWeek(date);
                var N = getDayOfWeek(date);
                var flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dateFormat.i18n.dayNames[D],
                    dddd: dateFormat.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dateFormat.i18n.monthNames[m],
                    mmmm: dateFormat.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(Math.round(L / 10)),
                    t:    H < 12 ? 'a'  : 'p',
                    tt:   H < 12 ? 'am' : 'pm',
                    T:    H < 12 ? 'A'  : 'P',
                    TT:   H < 12 ? 'AM' : 'PM',
                    Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
                    W:    W,
                    N:    N
                };

                return mask.replace(token, function (match) {
                    if (match in flags) {
                        return flags[match];
                    }
                    return match.slice(1, match.length - 1);
                });
            };
        })();

        dateFormat.masks = {
            'default':               'ddd mmm dd yyyy HH:MM:ss',
            'shortDate':             'm/d/yy',
            'mediumDate':            'mmm d, yyyy',
            'longDate':              'mmmm d, yyyy',
            'fullDate':              'dddd, mmmm d, yyyy',
            'shortTime':             'h:MM TT',
            'mediumTime':            'h:MM:ss TT',
            'longTime':              'h:MM:ss TT Z',
            'isoDate':               'yyyy-mm-dd',
            'isoTime':               'HH:MM:ss',
            'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
            'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
            'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
        };

        // Internationalization strings
        dateFormat.i18n = {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ]
        };

        function pad(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) {
                val = '0' + val;
            }
            return val;
        }

        /**
         * Get the ISO 8601 week number
         * Based on comments from
         * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
         *
         * @param  {Object} `date`
         * @return {Number}
         */
        function getWeek(date) {
            // Remove time components of date
            var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Change date to Thursday same week
            targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

            // Take January 4th as it is always in week 1 (see ISO 8601)
            var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

            // Change date to Thursday same week
            firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

            // Check if daylight-saving-time-switch occured and correct for it
            var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
            targetThursday.setHours(targetThursday.getHours() - ds);

            // Number of weeks between target Thursday and first Thursday
            var weekDiff = (targetThursday - firstThursday) / (86400000*7);
            return 1 + Math.floor(weekDiff);
        }

        /**
         * Get ISO-8601 numeric representation of the day of the week
         * 1 (for Monday) through 7 (for Sunday)
         *
         * @param  {Object} `date`
         * @return {Number}
         */
        function getDayOfWeek(date) {
            var dow = date.getDay();
            if(dow === 0) {
                dow = 7;
            }
            return dow;
        }

        /**
         * kind-of shortcut
         * @param  {*} val
         * @return {String}
         */
        function kindOf(val) {
            if (val === null) {
                return 'null';
            }

            if (val === undefined) {
                return 'undefined';
            }

            if (typeof val !== 'object') {
                return typeof val;
            }

            if (Array.isArray(val)) {
                return 'array';
            }

            return {}.toString.call(val)
                .slice(8, -1).toLowerCase();
        };

    return dateFormat;
});
/**
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
 * 通过 new Image().src 方式发送请求
 * 这个模块存在的意义是为了解决 IE 下 new Image() 的bug：当这个 image 没有挂载到某个常驻内存的对象中时，有小概率会被直接GC而不会发出请求
 * @author jameszuo
 * @date 13-5-29
 */
define.pack("./image_loader",["$"],function (require) {
    var $ = require('$'),

    // 挂载 image 到该对象上，防止被IE无情GC
        loading_images = {},

        id_seq = 0,

        undefined;

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
});/*
 Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://yuilibrary.com/license/
 */
define.pack("./prettysize",[],function(require, exports, module) {
    var sizes = [
        'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'
    ];

    /**
     Pretty print a size from bytes
     @method pretty
     @param {Number} size The number to pretty print
     @param {Boolean} [nospace=false] Don't print a space
     @param {Boolean} [one=false] Only print one character
     */

    var prettysize = function(size, nospace, one) {
        var mysize, f;

        sizes.forEach(function(f, id) {
            if (one) {
                f = f.slice(0, 1);
            }
            var s = Math.pow(1024, id),
                fixed;
            if (size >= s) {
                fixed = String((size / s).toFixed(2));//微云使用精度为2个小数点
                if (fixed.indexOf('.0') === fixed.length - 2) {
                    fixed = fixed.slice(0, -2);
                }
                mysize = fixed + (nospace ? '' : ' ') + f;
            }
        });

        // zero handling
        // always prints in Bytes
        if (!mysize) {
            f = (one ? sizes[0].slice(0, 1) : sizes[0]);
            mysize = '0' + (nospace ? '' : ' ') + f;
        }

        return mysize;
    };

    return prettysize;
});
/**
 * 目录层级路由模块
 * @author hibincheng
 * @date 2015-03-25
 */
define.pack("./router",["$","./Module"],function(require, exports, module) {
    var $ = require('$'),

        Module = require('./Module'),

        undefined;

    var cur_path;

    var router = new Module('weixin.router', {

        init: function(root_path) {
            var me = this;
            if(root_path) {
                location.hash = '#' + root_path;
                cur_path = root_path;
            }

            $(window).on('hashchange', function(e) {
                if(location.hash) {
                    var pre_path = cur_path;
                    cur_path = location.hash.slice(1);
                    me.trigger('change', cur_path, pre_path);
                }
            });
        },

        go: function(path) {
            location.hash = '#' + path;
        }
    });

    return router;
});/**
 * 摘自 QZFL 的 security 模块
 * @james 2012/12/17
 */

define.pack("./security",["./cookie"],function (require, exports, module) {

    var cookie = require('./cookie');

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

    /**
     *
     * @param objConfig {salt, skey, md5key}
     * @return {*}
     * @private
     */
    function _getAntiCSRFToken(objConfig) {
        objConfig = objConfig || {};
        var salt = objConfig.salt || CONST_SALT;
        var skey = objConfig.skey || cookie.get("skey");
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
    }

    return{
        getAntiCSRFToken:_getAntiCSRFToken,
        md5:_md5
    };
});

/**
 * html escape
 * @param text
 * @returns {number}
 */
define.pack("./text",[],function(require, exports, module) {

    function text(html) {
        return html.replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/"/g, '&quot;').
            replace(/'/g, '&#039;');
    }

    return {
        text: text
    }
});/**
 * URL 解析
 * example:
 * var url = new URL('http://www.weiyun.com/web/login.html?code=123&from=http%3A%2F%2Furl.cn%2FAujoa6#action=TEST&type=1');
 * url.get_param('from'); // -> http://url.cn/Aujoa6
 * url.get_hash_param('action'); // -> TEST
 * url.protocol  // -> http:
 * url.host      // -> www.weiyun.com
 * url.port      // -> ""
 * url.pathname  // -> /web/login.html
 * url.search    // -> ?code=123&from=http%3A%2F%2Furl.cn%2FAujoa6
 * url.hash      // -> action=TEST&type=1
 * @author jameszuo
 * @date 12-12-28 下午12:00
 */
define.pack("./url_parser",["$"],function (require, exports, module) {

    var $ = require('$'),
        url_caches = {},
        PROPS = ['protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'],
        URL,
        parse,
        parse_params,
        get_cur_url,

        $div;

    /**
     * URL 对象
     * @param url
     * @constructor
     */
    URL = function (url) {
        var link = document.createElement('a');
        link.href = url;

        for (var i = 0, l = PROPS.length; i < l; i++) {
            this[PROPS[i]] = link[PROPS[i]];
        }

        this.port = parseInt(this.port || 80);
        this.hash = this.hash.replace(/^#/, '');

        // dam IE
        if (this.pathname.charAt(0) != '/')
            this.pathname = '/' + this.pathname;

        // search params
        this._params = parse_params(this.search.replace(/^\?*/, ''));

        // hash params
        this._hash_params = parse_params(this.hash.replace(/^#*/, ''));

        // for ie bug
        get_$div().append(link);
        $(link).remove();
    };

    $.extend(URL.prototype, {

        get_main_domain: function () {
            return this.host.split('.').slice(-2);
        },

        get_url: function () {
            return this.protocol + '//' + this.host + this.pathname;
        },

        /**
         * 获取全部参数
         * @returns {Object}
         */
        get_params: function () {
            return this._params;
        },

        /**
         * 获取 GET 参数
         * @param {String} key
         * @return {String}
         */
        get_param: function (key) {
            return this._params[key] || '';
        },

        /**
         * 判断参数列表中是否包含指定参数
         * @param {String} key
         * @return {Boolean}
         */
        has_param: function (key) {
            return key in this._params;
        },

        /**
         * 获取 Hash 参数
         * @param {String} key
         * @return {String}
         */
        get_hash_param: function (key) {
            return this._hash_params[key] || '';
        },

        /**
         * 判断 Hash 参数列表中是否包含指定参数
         * @param {String} key
         * @return {Boolean}
         */
        has_hash_param: function (key) {
            return key in this._hash_params;
        }
    });

    /**
     * 解析一个URL str
     * @param {String} url 要解析的url
     * @return {URL} url URL对象
     */
    parse = function (url) {
        var cache_parser = url_caches[url];
        if (!cache_parser) {
            cache_parser = url_caches[url] = new URL(url);
        }
        return cache_parser;
    };

    /**
     * 获取当前地址栏解析的URL对象
     */
    get_cur_url = function () {
        return parse(window.location.href);
    };

    /**
     * 解析参数
     * @param query_str
     * @return {{}}
     */
    parse_params = function (query_str) {
        var match,
        // search = /([^&=]+)=?([^&]*)/g,
            search = /([^&\?=]+)=?([^&\?]*)/g, // 兼容 a=1&b=2?c=3 这样二的参数
            decode = decodeURIComponent,
            params = {};

        while (match = search.exec(query_str)) {
            var key = decode(match[1]),
                val = decode(match[2]);
            if (!(key in params)) { // 只取第一个参数
                params[key] = val;
            }
        }

        return params;
    };

    var get_$div = function () {
        return $div || ($div = $('<div data-id="url_parser" style="display:none;"/>').appendTo(document.body));
    };

    return {
        parse: parse,
        get_cur_url: get_cur_url,
        parse_params: parse_params
    };
});