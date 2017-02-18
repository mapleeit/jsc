//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","$","common"],function(require,exports,module){

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
//lib/src/class.js
//lib/src/collections.js
//lib/src/console.js
//lib/src/cookie.js
//lib/src/date_time.js
//lib/src/events.js
//lib/src/global/global_event.js
//lib/src/image_loader.js
//lib/src/inherit.js
//lib/src/interval.js
//lib/src/json.js
//lib/src/module.js
//lib/src/random.js
//lib/src/routers.js
//lib/src/security.js
//lib/src/store.js
//lib/src/text.js
//lib/src/ui/easing.js
//lib/src/ui/force_blur.js
//lib/src/ui/selectable.js
//lib/src/url_parser.js

//js file list:
//lib/src/class.js
//lib/src/collections.js
//lib/src/console.js
//lib/src/cookie.js
//lib/src/date_time.js
//lib/src/events.js
//lib/src/global/global_event.js
//lib/src/image_loader.js
//lib/src/inherit.js
//lib/src/interval.js
//lib/src/json.js
//lib/src/module.js
//lib/src/random.js
//lib/src/routers.js
//lib/src/security.js
//lib/src/store.js
//lib/src/text.js
//lib/src/ui/easing.js
//lib/src/ui/force_blur.js
//lib/src/ui/selectable.js
//lib/src/url_parser.js
/**
 * class.create
 * @svenzeng 13-04-03
 */



/*
 * 修正继承中constructor丢失，
 * 子类可以调用父类的super,
 * Class.create的返回值并非构造函数, 而是一个自定义object, 从而可以随时提供更多的门面方法.
 * 创建类:

 	 var Animal = Class.create( function( name ){
			this.name = name;			
   });
	
	 Animal.interface( 'get_name', function(){
		return this.name;
	 })


   var rabbit = Animal.getInstance( '小白兔' );

   alert ( rabbit.name );
  
   var Mammals = Animal.sub(function( name ){
		  this.name = name;
   })
	
	 var tiger = Mammals.getInstance( '大老虎' );

	 alert ( tiger.name );

	 alert ( tiger.super.get_name.call( tiger ) );
 *
 *
 *
*/

define.pack("./class",[],function(require, exports, module) {


	var Class = function() {

		var create = function(fn, methods, parent) {

			fn = fn || function() {};

			var _initialize, _instances = [],
				instance, _unique = 0,
				ret, temp_class = function() {};

			_initialize = function(args) {
				fn.apply(this, args);
			};

			if (parent) {
				temp_class.prototype = parent.prototype;
				_initialize.prototype = new temp_class();
				_initialize.prototype.constructor = _initialize;
				_initialize.prototype.superClass = temp_class.prototype;
			}

			for (var i in methods) {
				_initialize.prototype[i] = methods[i];
			}

			_initialize.prototype.implement = function() {
				var fns = arguments[0].split('.'),
					args = Array.prototype.slice.call(arguments, 1),
					fn = this;
				for (var i = 0, c; c = fns[i++];){
					fn = fn[c];
					if (!fn) {
						throw new Error('接口未实现');
					}
				}
				return fn.apply(this, args);
			};

			var getInstance = function() {
				var args = Array.prototype.slice.call(arguments, 0),
					__instance = new _initialize(args);

				__instance.constructor = ret;

				_instances[_unique++] = __instance;

				return _instances[_unique - 1];
			};

			var empty = function() {

				for (var i = 0, c; c = _instances[i++];) {
					c = null;
				}
				_instances = [];
				_instances.length = 0;
				_unique = 0;
			};

			var getCount = function() {
				return _unique;
			};

			var getPrototype = function() {
				return _initialize.prototype;
			};

			var sub = function(fn, methods) {
				var a = Class.create(fn, methods, _initialize);
				return a;
			};

			var interface = function(key, fn, a) {

				if (!_initialize) {
					return;
				}

				var keys = key.split('.'),
					__proto = _initialize.prototype,
					last_key = keys.pop(),
					__namespace;

				if (keys.length) {
					__namespace = keys[0];

					if (!_initialize.prototype.hasOwnProperty(__namespace)) {
						_initialize.prototype[__namespace] = {};
					}

					_initialize.prototype[__namespace][last_key] = fn;

				} else {
					_initialize.prototype[last_key] = fn;
				}

			};

			ret = {
				interface: interface,
				getInstance: getInstance,
				getInstances: function() {
					return _instances;
				},
				empty: empty,
				getCount: getCount,
				getPrototype: getPrototype,
				sub: sub,
				initialize: _initialize
			};

			return ret;

		};

		return {
			create: create
		};
	}();

	module.exports = Class;

});/**
 * 集合类方法
 * @jameszuo 12-12-25 下午3:49
 */
define.pack("./collections",["lib","$"],function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        undefined;

    var collections = {
        /**
         * 转换 Array 为 Set （键唯一），一般用于快速查找
         * @param {Array<String>|Array<Object>} arr
         * @param {String|Function} [the_id] ID字段名或一个用来获取ID的闭包
         */
        array_to_set: function (arr, the_id) {
            var set = {};
            for (var i = 0, l = arr.length; i < l; i++) {
                var it = arr[i];
                if (the_id) {
                    if (typeof the_id === 'function') {
                        set[the_id.call(it, it)] = it;
                    } else {
                        set[it[the_id]] = it;
                    }
                } else {
                    set[it] = it;
                }
            }
            return set;
        },

        /**
         * 元素在数组中的位置
         * @param arr
         * @param value
         */
        indexOf: (function () {
            var indexOf = [].indexOf || function (value) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i] === value) {
                        return i;
                    }
                }
                return -1;
            };
            return function (arr, value) {
                return indexOf.call(arr, value);
            }
        })(),

        /**
         * 判断数组是否包含某个元素
         * @param arr
         * @param value
         * @return {Boolean}
         */
        contains: function (arr, value) {
            return this.indexOf(arr, value) > -1;
        },

        /**
         * 获取第一个符合要求的元素(非索引)
         * @param arr
         * @param filter
         */
        first: function (arr, filter) {
            if (arr) {
                if (arr instanceof Array) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var it = arr[i];
                        if (filter.call(it, it, i)) {
                            return it;
                        }
                    }
                } else if (arr instanceof Object) {
                    for (var prop in arr) {
                        var it = arr[prop];
                        if (filter.call(it, it, prop)) {
                            return it;
                        }
                    }
                }
            }
            return undefined;
        },

        /**
         * 遍历集合、映射，收集过滤器的返回值，组成新的集合
         * @param {Array|Object} arr
         * @param {Function} filter (item, i) 返回值将被收集
         */
        map: $.proxy($.map, $),

        /**
         * 遍历集合，过滤掉不符合条件的元素
         * @param {Array} arr
         * @param {Function} filter (item, i) 返回true表示保留该元素
         */
        grep: $.proxy($.grep, $),

        /**
         * 判断是否有任何一个元素符合要求(return true)
         * @param arr
         * @param filter
         */
        any: function (arr, filter) {
            if (arr) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    var it = arr[i];
                    if (true === filter.call(it, it, i)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 判断是否所有元素都符合要求(return true)
         * @param arr
         * @param filter
         */
        all: function (arr, filter) {
            if (arr) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    var it = arr[i];
                    if (true !== filter.call(it, it, i)) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 通过function切分数组，切分后原数组长度将减少
         * @param arr
         * @param {Function} fn 返回false来终止切分 .sub([1, 3, 5, true, false, false], function(it, i){
         *    return it <= 5;
         * }) // -> [1, 3, 5]
         */
        sub: function (arr, fn) {
            var result = [];
            if (arr) {
                var i = 0, l = arr.length, splice_to = 0;
                for (; i < l; i++) {
                    var it = arr[i],
                        ret = fn.call(it, it, i);
                    if (ret !== false) {
                        splice_to = i;
                        result.push(it);
                    } else {
                        break;
                    }
                }
                arr.splice(0, splice_to + 1);
            }
            return result;
        },

        /**
         * 移除符合条件的元素
         * @param arr
         * @param filter
         */
        remove: function (arr, filter) {
            if (arr && arr.length) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    var it = arr[i],
                        ret = filter.call(it, it, i);
                    if (ret === true) {
                        arr.splice(i, 1);
                    }
                }
            }
        },

        /**
         * 将数组分为多个子数组
         */
        split: function (arr, fn) {
            var results = [];
            if (arr && arr.length) {
                var i = 0,
                    l = arr.length,
                    sub = [];

                if (typeof fn == 'function') {
                    for (; i < l; i++) {
                        var it = arr[i],
                            ret = fn.call(it, it, i);

                        sub.push(it);
                        if (ret === true || i === l) {
                            results.push(sub);
                            sub = [];
                        }
                    }
                } else if (typeof fn == 'number') {
                    for (; i < l; i++) {
                        sub.push(arr[i]);
                        if ((i + 1) % fn === 0 || i === l - 1) {
                            results.push(sub);
                            sub = [];
                        }
                    }
                }
            }
            return results;
        },

        /**
         * 排序（修复了chrome v8下排序时同值对比排序后顺序错乱的bug）
         * @param {Array} array
         * @param {Function} iterator (value, index, array)
         * @param {Boolean} asc 是否从大到小，默认true
         * @param {*} [context]
         * @returns {*}
         */
        sort_by: function (array, iterator, asc, context) {
            asc = asc !== false;

            var iterator_ = iterator,
                forward = asc ? -1 : 1,
                backward = asc ? 1 : -1;

            var map = this.map(array, function (value, i, array) {
                return {
                    value: value,
                    index: i,
                    criteria: iterator_.call(context, value, i, array)
                };
            });

            var list = map.sort(function (left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0) return backward;
                    if (a < b || b === void 0) return forward;
                }
                return left.index < right.index ? forward : backward;
            });

            return this.map(list, function (item) {
                return item.value;
            });
        }

    };

    module.exports = collections;

//    // test sub
//    (function () {
//        var arr = [ 1, true, false ];
//        console.log('sub -> ', module.exports.sub(arr, function (it, i) {
//            return 0 == i || (i < 10 && typeof it == typeof arr[i - 1]);
//        }), 'arr -> ', arr);
//
//        var arr = [ 1 ];
//        console.log('sub -> ', module.exports.sub(arr, function (it, i) {
//            return true;
//        }), 'arr -> ', arr);
//    })();

//    // test first
//    (function () {
//        var obj = { a:1, b:2, c:true };
//        console.log(obj, '.first -> ', module.exports.first(obj, function (it, prop) {
//            return it === true;
//        }));
//    })();

//    (function(){
//        var arr = [1, 2, 3, 4, 5],
//            arr_str = arr.toString();
//        module.exports.remove(arr, function(it){
//            return it % 2 == 0;
//        });
//        console.log('collections.remove[(', arr_str, ']) -> ', arr);
//    })();

//    (function (n) {
//        var tests = [
//            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//            [1, 2, 3],
//            [1],
//            []
//        ];
//        for (var i = 0, l = tests.length; i < l; i++) {
//            var results = collections.split(tests[i], n);
//            console.log('collections.split(', tests[i], ',', n, ') -> ', JSON.stringify(results));
//        }
//    })(3);
});
/**
 *自定义控制台
 *@svenzeng
 */
define.pack("./console",["$","./text"],function (require, exports, module) {

    var $ = require('$'),
        text = require('./text');

    /**
     *consoleMode: 1为使用, 0为禁用
     *displayDefault: 是否自动显示, 'show', 'hide'
     *exports: 全局
     *checkSpecialExecType: 是否用户主动输入的console.log
     */


    var consoleMode = 1,
        displayDefault = 'hide',
        width = 360,
        height = 380,
        CustomEvent,
        Ui,
        Event,
        triggerClear,
        Move,
        global = this,
        cache,
        specialExecType,
        getConsoleContainer,
        convertArgs,
        convertType,
        tree,
        set_funcs,
        isPlainObject,
        isEmptyObj,
        each,
        grep,
        _console = {},
        clear,
        recovery,
        zoom,
        histories = [],
        getSingle,
        event,
        isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;


    if (consoleMode === 0) {
        _console.log = _console.error = _console.warn = _console.debug = _console.dir = function() {};
        return _console;
    }

    each = function( ary, callback ){
        for ( var i = 0, l = ary.length; i < l; i++ ){
            var c = ary[i];
            if ( callback.call( c, i , c ) === false ){
                return false;
            }
        }
    };

    grep = function( ary, callback ){
        var newAry = [];
        each( ary, function(i, n){
            newAry.push( callback.call( n, i, n ) );
        });
        return newAry;
    };

    specialExecType = function() {
        var ary = ['_console.log', '_console.error', '_console.warn', '_console.debug'];
        return function(key) {
            for (var i = 0, c; c = ary[i++];) {
                if (key.indexOf(c) >= 0) {
                    return true;
                }
            }
            return false;
        };
    }();


    cache = function(){
        var stack = {},
            set,
            _each;

        set = function( key, value ){
            if ( !stack[ key ] ){
                stack[ key ] = [];
            }
            stack[key].push( value );
        };

        _each = function( key, fn ){
            var data = stack[ key ];

            if ( !data || data.length === 0 ){
                return;
            }
            each( data, fn );
        };

        eachAll = function(fn){
            for ( var i in stack ){
                if ( i === 'log' || i === 'error' || i === 'warn' || i === 'debug' || i === 'dir' ){
                    var c = stack[i];
                    _each( i, fn );
                }
            }
        };

        return{
            set: set,
            each: _each,
            eachAll: eachAll
        };

    }();


    /*
     **  自定义事件
     */


    CustomEvent = function() {

        var obj = {}, __this = this;

        var listen = function(key, eventfn) {
            if (!obj[key]) {
                obj[key] = [];
            }
            obj[key].push(eventfn);
        };

        var trigger = function() {
            var key = Array.prototype.shift.call(arguments),
                args = arguments,
                queue = obj[key],
                ret;

            if (!queue || !queue.length) return;

            each( queue, function(){
                ret = this.apply(this, args);
                if ( ret === false ){
                    return false;
                }
            });

            return ret;
        };

        return {
            listen: listen,
            trigger: trigger
        };

    };

    /*
     *  是否字面量对象
     */

    isPlainObject = function( obj ){
        if ( !obj || typeof obj !== "object" || obj.nodeType ) {
            return false;
        }

        try {
            if ( obj.constructor &&
                !Object.prototype.hasOwnProperty.call(obj, "constructor") &&
                !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }

        var key;
        for ( key in obj ) {}

        return key === undefined || Object.prototype.hasOwnProperty.call( obj, key );

    };


    /*
     *  是否空对象
     */

    isEmptyObj = function( obj ){

        if ( !isPlainObject(obj) ){
            return false;
        }
        for ( var i in obj ){
            return false;
        }
        return true;
    };


    /**
     *获取单例
     */

    getSingle = function(fn) {
        var ret;
        return function() {
            return ret || (ret = fn.apply(this, arguments));
        };
    };


    /**
     *Ui渲染
     */

    Ui = function() {

        var event = CustomEvent(),
            logConfigMap,
            append,
            bind,
            container,
            header,
            title,
            main,
            ul,
            input,
            Ready,
            _cssText;

        _cssText = '\
                            .consoleBox{\
                                display:none;\
                                position:fixed;\
                                _position: absolute;\
                                right: 50px;\
                                bottom: 30px;\
                                z-index: 10000000;\
                                border: 2px solid #bbb;\
                                padding: 5px;\
                                width: '+width+'px;\
                                height:'+height+'px;\
                                background: #000;\
                                box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.75);\
                                filter: Alpha(opacity:95);\
                                font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                                font-size: 12px;\
                                color: #fff;\
                                border-radius: 5px;\
                            }\
                            \
                            html.webkit .consoleBox{\
                                background: rgba(0,0,0,0.75);\
                            }\
                            \
                            .consoleBoxHead{\
                                height:20px;\
                                background: rgba(255,255,255,0.15);\
                                overflow:hidden;\
                                cursor:default;\
                                padding: 2px;\
                            }\
                            \
                            .consoleBoxHead .title{\
                                margin:0;\
                                padding: 0 0 0 3px;\
                                height:20px;\
                                line-height:20px;\
                                font-family: Verdana;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton, .consoleBoxHead .consoleClearButton, .consoleBoxHead .consoleRecoveryButton, .consoleBoxHead .consoleReloadButton, .consoleBoxHead .consoleHelpButton{\
                                float:right;\
                                border:0px solid #000;\
                                width:20px;\
                                height:18px;\
                                line-height:16px;\
                                background: white;\
                                margin:1px 1px;\
                                padding:0px;\
                                color:#666;\
                                font-family: Verdana;\
                                font-weight:bold;\
                                cursor:pointer;\
                                border-radius:3px;\
                                -moz-border-radius:3px;\
                                -webkit-border-radius:3px;\
                                text-align:center;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleClearButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            .consoleBoxHead .consoleHelpButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            .consoleBoxHead .consoleReloadButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleRecoveryButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            #consoleRecoveryButton:hover{\
                                background: red;\
                            }\
                            \
                            .consoleMain{\
                                position:relative;\
                                top:2px;\
                                bottom:0px;\
                                width:100%;\
                                height:86%;\
                                overflow:auto;\
                            }\
                            html.mobileSafari .consoleMain{\
                                overflow:hidden;\
                            }\
                            \
                            ul.consoleOutput{\
                                display:block;\
                                margin:0;\
                                padding:0;\
                                width:100%;\
                                list-style:none;\
                            }\
                            \
                            ul.consoleOutput li{\
                                list-style:none;\
                                padding:3px;\
                                border-bottom:1px solid #333333;\
                                word-break: break-all;\
                                word-wrap: break-word;\
                                overflow: hidden;\
                                zoom: 1;\
                            }\
                            \
                            .consoleOutput .log_icon{\
                                width:13px;\
                                height:13px;\
                                background:#fff;\
                                overflow:hidden;\
                                float:left;\
                                margin-top:consoleCloseButton2px;\
                                font-weight:bold;\
                                text-align:center;\
                                font-size:12px;\
                                color:#8B8B8B;\
                                line-height:135%;\
                                cursor:default;\
                                border-radius:3px;\
                                -moz-border-radius:3px;\
                                -webkit-border-radius:3px;\
                            }\
                            \
                            .consoleOutput .log_text{\
                                margin: 0px 0px 0px 20px;\
                                line-height:150%;\
                                zoom: 1;\
                            }\
                            \
                            .log_error_type{}\
                            \
                            .log_error_type .log_icon{\
                                background:#FF0000;\
                                color:#660000;\
                            }\
                            \
                            .log_error_type .log_text{\
                                color:#FF0000;\
                            }\
                            \
                            .log_warning_type{}\
                            \
                            .log_warning_type .log_icon{\
                                background:#FFFF00;\
                                color:#8C7E00;\
                            }\
                            \
                            .log_warning_type .log_text{\
                                color:#FFFF00;\
                            }\
                            \
                            .log_debug_type{}\
                            \
                            .log_debug_type .log_icon{\
                                background:#33CC00;\
                                color:#006600;\
                            }\
                            \
                            .log_debug_type .log_text{\
                                color:#33cc00;\
                            }\
                            \
                            .log_info_type{}\
                            \
                            .log_info_type .log_icon{\
                                background:#0066FF;\
                                color:#000066\
                            }\
                            \
                            .log_info_type .log_text{\
                                color:#0066FF;\
                            }\
                            \
                            .log_profile_type{}\
                            \
                            .log_profile_type .log_icon{\
                            }\
                            \
                            .log_profile_type .log_text{\
                                color:white;\
                            }\
                            \
                            .WeiyunConsole .consoleInputBox{\
                                font-family: Verdana;\
                                font-size:12px;\
                                margin:5px 0 0 0;\
                                padding:2px 0 0 0 ;\
                                border-top:1px solid #aaa;\
                                width:100%;\
                                height:20px;\
                                line-height:20px;\
                                color:#CCFF00;\
                                position:relative;\
                            }\
                            \
                            .WeiyunConsole  input.consoleInput{\
                                border:0px solid #666;\
                                background:transparent;\
                                color:#CCFF00;\
                                font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                                font-size:12px;\
                                display:block;\
                                width:100%;\
                                height:100%;\
                                line-height:100%;\
                                _padding-top: 7px;\
                                *padding-top: 7px;\
                                vtical-align:middle;\
                                outline:none;\
                                position:absolute;\
                                left:0;\
                                top:0;\
                                text-indent:10px;\
                            }\
                             ';


        createNode = function() {

            var _attr,
            _css,
            _getParam,
            _setOpacity,
            _fadeOut,
            _fadeIn,
            interval;

            _attr = function(attrs) {
                for (var i in attrs) {
                    if (i === '_class') {
                        this.className = attrs[i];
                    } else {
                        this.setAttribute(i, attrs[i]);
                    }
                }
                return this;
            };

            _css = function(styles) {
                for (var i in styles) {
                    this.style[i] = styles[i];
                }
                return this;
            };

            _getParam = function(key, value) {
                var _param = {};
                if (value) {
                    _param[key] = value;
                    return _param;
                }
                return key;
            };

            _setOpacity = function(el, number) {
                if (el.filters) {
                    el.style.filter = 'alpha(opacity=' + number + ')';
                } else {
                    el.style.opacity = number / 100;
                }
                return number;
            };


            _fadeOut = function() {
                var locked = false;

                return function(el) {
                    if (locked === true || el.style.display === 'hide') {
                        return false;
                    }
                    var _opacity = 100;
                    locked = true;
                    clearInterval(interval);
                    interval = setInterval(function() {
                        if (_setOpacity(el, _opacity -= 10) <= 0) {
                            clearInterval(interval);
                            el.style.display = 'none';
                            locked = false;
                        }
                    }, 19);
                }
            }();

            _fadeIn = function(el) {
                if (el.style.display === 'block') {
                    return false;
                }
                var _opacity = 0;
                clearInterval(interval);
                _setOpacity(el, _opacity);
                el.style.display = 'block';
                interval = setInterval(function() {
                    if (_setOpacity(el, _opacity += 7) >= 100) {
                        clearInterval(interval);
                    }
                }, 19);
            }

            return function(tagName, parent) {

                var el = document.createElement(tagName);
                (parent || document.body).appendChild(el);

                return {
                    el: el,
                    attr: function() {
                        return _attr.call(el, _getParam.apply(this, arguments));
                    },
                    css: function() {
                        return _css.apply(el, _getParam.apply(this, arguments));
                    },
                    show: function() {
                        el.style.display = 'block';
                        return el;
                    },
                    hide: function() {
                        el.style.display = 'none';
                        return el;
                    },
                    fadeOut: function() {
                        _fadeOut(el);
                    },
                    fadeIn: function() {
                        _fadeIn(el);
                    }
                };
            };

        }();


        event.listen('initConsole', getSingle(function() {
            Event.init();
            return Event.drag(title.el, container.el);
        }));


        event.listen('renderContainer', function() {
            var close,
            reload,
            prepend;

            prepend = function(parent, node) {
                if (!parent.firstChild) {
                    return parent.appendChild(node);
                }
                return parent.insertBefore(node, parent.firstChild);
            }

            var div = document.createElement("div");

            div.innerHTML = '&nbsp;<style type="text/css">' + _cssText + '</style>';
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(div);

            head.replaceChild(div.getElementsByTagName("style")[0], div);

            container = createNode('div');

            container.attr('_class', 'WeiyunConsole consoleBox');

            header = createNode('div', container.el);
            header.attr('_class', 'consoleBoxHead');


            main = createNode('div', container.el);
            main.attr('_class', 'consoleMain');

            ul = createNode('ul', main.el);
            ul.attr('_class', 'consoleOutput');



            close = createNode('a', header.el);
            close.attr({
                href: 'javascript:void(0)',
                _class: 'consoleCloseButton',
                title: '关闭'
            });
            close.el.innerHTML = 'X';

            Event.close.call(close, container);

            clear = createNode('a', header.el);
            clear.attr({
                href: 'javascript:void(0)',
                _class: 'consoleClearButton',
                title: '清除所有日志'
            });
            clear.el.innerHTML = 'C';

            triggerClear = Event.clear.call(clear, ul.el);

            recovery = createNode('a', header.el);
            recovery.attr({
                href: 'javascript:void(0)',
                _class: 'consoleRecoveryButton',
                title: '还原所有日志'
            });

            recovery.el.innerHTML = 'R';

            Event.recovery.call(recovery);


            zoom = createNode('a', header.el);
            zoom.attr({
                href: 'javascript:void(0)',
                _class: 'consoleHelpButton',
                title: '放大'
            });
            zoom.el.innerHTML = 'H';

            Event.zoom.call(zoom, container.el);


            reload = createNode('a', header.el);
            reload.attr({
                href: 'javascript:void(0)',
                _class: 'consoleReloadButton',
                title: '刷新'
            });
            reload.el.innerHTML = 'S';

            Event.reload.call(reload);


            title = createNode('h5', header.el);
            title.attr({
                _class: 'title',
                title: '控制台'
            });
            title.el.innerHTML = 'Console';
            /**
             *  控制台body部分
             */


            input_container = createNode('div', container.el);
            input_container.attr('_class', 'consoleInputBox');
            input_container.el.innerHTML = '&gt';

            input = createNode('input', input_container.el);
            input.attr({
                _class: 'consoleInput',
                title: '请输入控制台指令或者Javascript语句...'
            });


            Event.exec.call(input, main.el);

            return container;
        });


        logConfigMap = {
            "log": {
                "icon": '└',
                "className": 'log_profile_type'
            },
            "error": {
                "icon": 'x',
                "className": 'log_error_type'
            },
            "warn": {
                "icon": '!',
                "className": 'log_warning_type'
            },
            "debug": {
                "icon": '√',
                "className": 'log_debug_type'
            },
            "dir": {
                "icon": 'dir',
                "className": 'log_profile_type'
            }
        };

        /**
         *添加log
         */

        tree = function(){
            return function( obj ){
                var str = '';
                for ( var i in obj ){
                    var c = obj[i];
                    str += i + ': ' + c;
                }
                return str;
            }
        }();

        convertType = function( info ){
           return grep( info, function(i, n){
                if ( Object.prototype.toString.call(n)  === '[object String]' ){
                    return '"' + n + '"';
                }
                if ( isEmptyObj( n ) ){
                    return '{}';
                }

                if ( n === void 0 ){
                     return 'undefined';
                }
                if ( n === null ){
                    return 'null';
                }
                if ( Object.prototype.toString.call( n ) === '[object Array]' ){
                    return '[' + convertType(n) + ']';
                }
                if ( isPlainObject( n ) ){
                    return tree(n);
                }
                return n;
            });

        }

        event.listen('addField', function(logType, info, _namespace) {

            var li,
            log_icon,
            log_text,
            logConfig = logConfigMap[logType];

            ul.show();

            var _info = convertType( info ).join(', ');

            li = createNode('li', ul.el);
            li.attr('_class', logConfig.className);

            log_icon = createNode('div', li.el);
            log_icon.attr('_class', 'log_icon');
            log_icon.el.innerHTML = logConfig.icon;

            log_text = createNode('div', li.el);
            log_text.attr('_class', 'log_text');
            log_text.el.innerHTML = (_namespace ? '<span style="color:orange">' + _namespace + '     </span> ' : '') + _info;
        });

        /**
         *执行控制台输入
         */
        event.listen('execScript', function(val, ret) {
            var li = createNode('li', ul.el);
            li.el.innerHTML = '<span style="color:#ccff00">' + val + '</span><br>' + ret;
        });

        return {
            event: event
        }

    }();


    /*
     ** 绑定Ui相关事件
     */


    Event = (function() {

        var bind,
        off,
        init,
        close,
        clear,
        zoom,
        reload,
        recovery,
        exec,
        canRecovery = false;


        bind = function() {
            var _bind = document.addEventListener ? function(type, fn) {
                    this.addEventListener(type, fn, false);
                    return fn;
                } : function(type, fn) {
                    var _self = this;
                    this.attachEvent('on' + type, function(){
                        return fn.apply(_self, arguments);
                    });
                    return fn;
                };
            return function(el, type, fn) {
                var _fn = function(e) {
                    var _event = e || window.event,
                        event = {};

                    event.stopPropagation = function() {
                        return _event.stopPropagation ? _event.stopPropagation() : _event.cancelBubble = true;
                    };

                    event.preventDefault = function() {
                        return _event.preventDefault ? _event.preventDefault() : event.returnValue = false;
                    };

                    event.clientX = _event.clientX;
                    event.clientY = _event.clientY;
                    event.metaKey = _event.metaKey;
                    event.ctrlKey = _event.ctrlKey;
                    event.shiftKey = _event.shiftKey;
                    event.which = _event.which || _event.keyCode;

                    if (fn.call(this, event) === false) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
                return _bind.call(el, type, _fn);
            };
        }();

        off = function() {
            var _off = document.removeEventListener ? function(type, fn) {
                    return this.removeEventListener(type, fn, false);
                } : function(type, fn) {
                    return this.detachEvent('on' + type, fn);
                }
            return function(el, type, fn) {
                return _off.call(el, type, fn);
            }
        }();


        init = function() {
            container = Ui.event.trigger('renderContainer');
            container[displayDefault]();

            return container;
        };


        clear = function(el) {
            var fn = function() {
                canRecovery = true; //可以还原
                el.innerHTML = '';
                return false;
            };
            bind(this.el, 'click', fn );
            return fn;
        };


        recovery = function() {
            bind(this.el, 'click', function() {
                if (canRecovery === false) return;
                triggerClear();
                cache.eachAll(function(){
                    Ui.event.trigger('addField', this[0], this[1], this[2]);
                })
                canRecovery = false;
                return false;
            });
        };


        zoom = function() {

            var origLeft,
                origTop,
                mode = 0; //0为正常, 1为放大之后

            return function(el) {
                var _self = this;
                bind(_self.el, 'click', function() {
                    if (mode === 0) {
                        origLeft = el.offsetLeft,
                        origTop = el.offsetTop;
                        el.style.width = document.body.clientWidth - 40 + 'px';
                        el.style.height = document.body.clientHeight - 40 + 'px';
                        el.style.left = '10px';
                        el.style.top = '10px';
                        _self.el.innerHTML = 'M';
                        _self.el.title = '缩小'
                        mode = 1;
                    } else {
                        el.style.width = width + 'px';
                        el.style.height = height + 'px';
                        _self.el.innerHTML = 'H';
                        el.style.left = origLeft + 'px';
                        el.style.top = origTop + 'px';
                        _self.el.title = '放大'
                        mode = 0;
                    }
                    return false;
                });
            };

        }();


        reload = function() {
            bind(this.el, 'click', function() {
                return window.location.reload(true);
            });
        };


        exec = function(el) {
            var custom_histroy = [],
                histroy_index,
                history_value,
                go_history,
                trim,
                interCommand;

            trim = function( str ){
                return ( str || '' ).replace(/(^\s*)|(\s*$)/g, '');
            }

            interCommand = function(){
                var g = {
                    'filter log': 'log',
                    'filter warn': 'warn',
                    'filter error': 'error',
                    'filter debug': 'debug',
                    'filter dir': 'dir',
                    'filter all': 'all'
                };

                return function( command ){
                    var _command = trim( command ),
                        callback = function(){
                            Ui.event.trigger('addField', this[0], this[1], this[2]);
                        };

                    if ( _command.indexOf( 'filter namespace' ) >= 0 ){
                        triggerClear();
                        _namespace = _command.substr( 17, _command.length );
                        _namespace = trim( _namespace );
                        cache.each( 'namespace_' + _namespace, callback );
                        return true;
                    }

                    _command = g[ command ];

                    if ( _command ){
                        return (function(){

                            triggerClear && triggerClear();

                            if ( command === 'filter all' ){
                                cache.eachAll( callback );
                            }else{
                                cache.each( _command, callback ); 
                            }
                            return canRecovery = true;
                        })();
                    }
                    return false;
                }
            }();

            go_history = function(key) {
                var index,
                _temp_index;

                if (key !== 38 && key !== 40) {
                    return;
                }

                if (histroy_index === void 0) {
                    index = custom_histroy.length || 0;
                } else {
                    index = histroy_index;
                }

                _temp_index = index + key - 39;

                if (_temp_index < 0 || _temp_index >= custom_histroy.length) {
                    return;
                }

                this.value = custom_histroy[_temp_index];

                histroy_index = _temp_index;
            }

            bind(this.el, 'keydown', function(event) {
                var special,
                type,
                ret,
                value,
                k = event.which;

                go_history.call(this, k);

                if (k !== 13) {
                    return event.stopPropagation();
                }    

                custom_histroy.push(this.value);

                value = this.value.replace(/;/g, ' ');

                if ( interCommand( value ) === true ){
                    return event.stopPropagation();
                }

                try {
                    ret = eval('(' + value + ')');
                } catch (e) {
                    ret = void 0;
                }

                special = specialExecType(value); //如果是用户自己输入的console.log, 已经被eval执行过，不用再添加log

                setTimeout(function() {
                    el.scrollTop = 100000;
                }, 0);

                if (special) {
                    return false;
                }

                Ui.event.trigger('execScript', this.value, ret);

                histroy_index = void 0;

                this.value = '';

                event.stopPropagation();
            });
        };


        drag = function(el, container) {
            return Drag.init(el, container);
        };


        close = function(container) {
            bind(this.el, 'click', function() {
                container.fadeOut();
                return false;
            });
        }


        return {
            bind: bind,
            off: off,
            init: init,
            clear: clear,
            zoom: zoom,
            exec: exec,
            reload: reload,
            recovery: recovery,
            drag: drag,
            close: close
        }


    })();



    Drag = (function() {

        var init,
        move,
        _left,
        _top,
        start,
        bindMoveEvent,
        stop,
        throttle;

        MoveEvent = (function() {
            var _el,
            _drag_el,
            _move_event,
            _select_event,
            move;

            move = function(e) {

                var left = e.clientX - _left,
                    top = e.clientY - _top;

                left = Math.max(0, left);
                top = Math.max(0, top);

                left = Math.min(document.body.clientWidth - _drag_el.offsetWidth, left);
                top = Math.min(document.body.clientHeight - _drag_el.offsetHeight, top);

                _drag_el.style.left = left + 'px';
                _drag_el.style.top = top + 'px';

                e.stopPropagation();
                e.preventDefault();

            };

            var on = function(e, drag_el, el) {
                off(el);
                _drag_el = drag_el;
                _left = e.clientX - drag_el.offsetLeft, //差值
                _top = e.clientY - drag_el.offsetTop; //差值
                _move_event = Event.bind(document, 'mousemove', move);
                _select_event = Event.bind(document, 'selectstart', function() {
                    return false;
                });
            }

            var off = function(el) {
                if (_move_event) {
                    Event.off(document, 'mousemove', _move_event);
                }
                if (_select_event) {
                    Event.off(document, 'selectstart', _select_event);
                }
            }

            return {
                on: on,
                off: off
            }

        })();


        init = function(el, drag_el) {

            Event.bind(el, 'mousedown', function(e) {
                MoveEvent.on(e, drag_el, el);
                e.stopPropagation();
            });

            Event.bind(el, 'mouseup', function(e) {
                MoveEvent.off(el);
                e.stopPropagation();
            });

            Event.bind(el, 'selectstart', function(e) {
                return false;
            });

            return true;
        }

        return {
            init: init
        }


    })();



    Ready = function() {

        var isReady = false,
            readyList = [],
            t,
            run,
            startInterval,

            startInterval = function() {
                if (t) {
                    return;
                }
                t = setInterval(function() {
                    if (document.body) {
                        clearTimeout(t);
                        t = null;
                        while (readyList.length > 0){
                            readyList.shift()();
                        }
                        isReady = true;
                    }
                }, 13);
            };

        add = function(fn) {
            if (isReady) {
                return fn();
            }
            return readyList.push(fn);
        };

        run = function(){
            if ( isReady ){
                return;
            }
            if ( !document.body ){  //如果body还没加载好.
                return startInterval();
            }
            while (readyList.length > 0){
                readyList.shift()();
            }
            isReady = true;
        }

        return {
            add: add,
            run: run
        }

    }();


    set_funcs = function(_console, _namespace) {
        var __namespace;
        if ( _namespace ){
            __namespace = '【' + _namespace + '】';
            _console = {};
        }
        each( 'log,error,warn,debug,dir'.split(','), function(i, n){
            _console[n] = function() {
                var args = Array.prototype.slice.call(arguments);
                Ready.add(function() {
                    Ui.event.trigger('initConsole');
                    cache.set(n, [n, args, __namespace]);
                    if ( _namespace ){
                        cache.set( 'namespace_' + _namespace, [n, args, __namespace] );
                    }
                    return Ui.event.trigger('addField', n, args, __namespace);
                });

                if (isChrome) {
                    window.console[n].apply(window.console, args);
                }
            }
        });
        return _console;

    }

    set_funcs(_console);

    _console.namespace = function(_namespace) {
        try{
            return set_funcs( _console, _namespace );
        }catch(e){
            return _console;
        }
    }

    Event.bind(document, 'keydown', function(e) {

        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.which === 192) {
            Ready.run();
            container.fadeIn();
        }
        e.stopPropagation();
    });

    // 初始化
    $(function () {
        _console.debug('console init ok.');
    });

    return window._console = _console;

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

define.pack("./cookie",["./json"],function (require, exports, module) {

    var JSON = require('./json'),
        loc = location,
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
/**
 * 日期时间模块
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./date_time",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        D = Date,

        str_date_format = '{year}-{month}-{date}',
        str_datetime_format = str_date_format + ' {hour}:{minute}:{second}',

        re_parse_str = new RegExp('^(\\d{4})\\-(\\d{2})\\-(\\d{2})\\s+(\\d{2})\\:(\\d{2})\\:(\\d{2})(\\s*000)?$'),
        re_left_0 = new RegExp('^0?'),

        parse_int = parseInt,

        today,
        yesterday,
        tomorrow,

        undefined;

    var date_time = {

        /**
         * 获取当前浏览器时间
         * @returns {Date}
         */
        now: function () {
            return new D();
        },

        /**
         * 获取当前浏览器时间的易读的格式
         * @returns {String}
         */
        now_str: function () {
            return this._format(str_datetime_format, this.now());
        },

        /**
         * 今天
         */
        today: function () {
            var d = this.now();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            return d;
        },

        /**
         * 昨天
         */
        yesterday: function () {
            var d = this.today();
            d.setDate(d.getDate() - 1);
            return d;
        },

        /**
         * 明天
         */
        tomorrow: function () {
            var d = this.today();
            d.setDate(d.getDate() + 1);
            return d;
        },

        /**
         * 计算在当前时间的基础上增加 N 天后的时间
         * @param {Number} days
         * @returns {Date}
         */
        add_days: function (days) {
            var now = this.now();
            now.setDate(now.getDate() + days);
            return now;
        },

        /**
         * 计算在当前时间的基础上增加 N 天后的时间，返回易读的格式
         * @param {Number} days
         * @returns {Date}
         */
        add_days_str: function (days) {
            return this._format(str_date_format, this.add_days(days));
        },

        _format: function (format, date) {
            return text.format(format, {
                year: date.getFullYear(),
                month: fix_2_num(date.getMonth() + 1),
                date: fix_2_num(date.getDate()),
                hour: fix_2_num(date.getHours()),
                minute: fix_2_num(date.getMinutes()),
                second: fix_2_num(date.getSeconds())
            });
        },

        /**
         * 解析字符串
         * @param {String} str 支持 yyyy-MM-dd hh:mm:ss 或 yyyy-MM-dd hh:mm:ss 000 这样的结构
         */
        parse_str: function (str) {
            var m = str.match(re_parse_str);
            if (!m) {
                throw 'date_time.parse_str() 无效的参数';
            }

            var date = this.now();

            date.setFullYear(to_int(m[1]));
            date.setMonth(to_int(m[2]) - 1);
            date.setDate(to_int(m[3]));
            date.setHours(to_int(m[4]));
            date.setMinutes(to_int(m[5]));
            date.setSeconds(to_int(m[6]));

            return date;
        },

        /**
         * 转换为可读性强的日期格式
         * @param {String|Date} str 如2013-05-11 10:20:30
         * @return {Array} [ 日期类型(如today,yesterday,the_day), ... ]
         */
        readability: function (str) {
            var time;

            if (str instanceof Date) {
                time = str;
            }
            else if (typeof str === 'string') {
                time = this.parse_str(str);
            }
            else {
                return [];
            }

            var today = this.today(),
                tomorrow = this.tomorrow(),
                yesterday = this.yesterday(),
                ret;

            if (today < time && time <= tomorrow) {
                var hours = time.getHours(),
                    minutes = time.getMinutes(),
                    ampm = hours >= 12 ? '下午' : '上午';

                ret = ['today', ampm, fix_2_num(hours) + ':' + fix_2_num(minutes)];
            }
            else if (yesterday < time && time <= today) {
                ret = ['yesterday', '昨天'];
            }
            else {
                var month = time.getMonth() + 1,
                    date = time.getDate();

                date = (date < 10 ? '0' + date : date) + '';

                ret = ['the_day', date, month + '月'];
            }

            return ret;
        }

    };

    // fix_2_num(9) -> '09'
    // fix_2_num(10) -> '10'
    var fix_2_num = function (num) {
        return num < 10 ? '0' + num : num;
    };

    var to_int = function (str) {
        str = str.toString().replace(re_left_0, '');
        return parse_int(str) || 0;
    };

    return date_time;
});/**
 * 自定义事件（摘自 Backbone.Events）
 * evt = event_support();
 * evt.listen(my_object, function(){  });
 *
 * @author jameszuo
 * @date 13-1-23
 */
define.pack("./events",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        collections = lib.get('./collections'),

        console = lib.get('./console'),

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
 * 全局事件路由
 * @author svenzeng
 * @date 13-3-1
 */


 define.pack("./global.global_event",["lib","$"],function ( require, exports, module ){

 	var lib = require('lib'),
        $ = require('$'),
        events = lib.get('./events');



        var event = {};

        $.extend( event, events );

        module.exports = event;


 })

/**
 * 通过 new Image().src 方式发送请求
 * 这个模块存在的意义是为了解决 IE 下 new Image() 的bug：当这个 image 没有挂载到某个常驻内存的对象中时，有小概率会被直接GC而不会发出请求
 * @author jameszuo
 * @date 13-5-29
 */
define.pack("./image_loader",["lib","$"],function (require) {
    var lib = require('lib'),
        $ = require('$'),

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
 * 全局定时器管理
 * @sven
 */

	define.pack("./interval",[],function (require, exports, module) {

		var stack = [],
			get,
			stop,
			clear,
			timer,
			__startInterval,
			__stopInterval,
			g_interval = 13;  //全局执行间隔

		var start = function(){
			this.fn.status = 1;  //启用状态
			__startInterval();
		}

		stop = function(){
			this.fn.status = 0;  //禁止状态
			this.ftp = 0;  		 //帧数归0
			__stopInterval();
		}

		clear = function(){
			for ( var len = stack.length - 1; len >= 0; len-- ){
				if ( stack[ len ] === this.fn ){
					stack.splice( len, 1 );
				}
			}

			__stopInterval();
		}

		get = function( fn, time ){

			var ret;

			var _fn = function(){
				return fn.apply( this, arguments );
			}

			_fn.status = 1;  //启用状态
			_fn.time = time || 13; //间隔时间
			_fn.ftp = 0;     //帧数

			stack.push( _fn );

			var ret = {
				fn: _fn,
				start: start,
				stop: stop,
				clear: clear
			}

			ret.start();

			return ret;

		}

		var __interval_fn = function(){

			for ( var len = stack.length - 1; len >= 0; len-- ){

				var fn = stack[ len ];

				if ( fn.status === 0 ){  //禁止状态
					return;
				}

				if ( fn.time < g_interval || fn.ftp++ % ( fn.time / g_interval | 0 ) === 0 ){
					return fn();
				}

			}

		}

		__startInterval = function(){

			if ( timer ){
				return;
			}

			timer = setInterval( __interval_fn, g_interval );

		}

		__stopInterval = function(){

			var flag = false;

			for ( var len = stack.length - 1; len >= 0; len-- ){

				var fn = stack[ len ];
				
				if ( fn.status === 1 ){
					flag = true;
				}

			}

			if ( flag === false ){  //全部停止了
				clearTimeout( timer );
				timer = null;
			}

		}

		module.exports = {
			get: get
		};

	})


/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

define.pack("./json",[],function(require, exports, module){
    var JSON = window.JSON;
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

    return JSON;
});
define.pack("./module",[],function( require, exports, module ){

    var 
        Event,
        __Hook,
        exports = this,
        __shift = Array.prototype.shift,
        __unshift = Array.prototype.unshift,
        create,
        find,
        __waiting_module = {};



        Function.prototype.bind = function( context ){
            var __self = this,
                __args = __slice( arguments ); 
            return function(){
                return __apply( __self, context, __args.concat( __slice( arguments ) ) );
            }
        };

         /** 
         * 让一个函数在另一个函数之前执行.
         * 钩子
         */

         Function.prototype.before = function( fn ){
            var __self = this;
            return function(){
                if ( fn.apply( this, arguments ) === false ){
                    return;
                }
                return __self.apply( this, arguments );
            }
        };

         /** 
         * 让一个函数在另一个函数之后执行. 可以用于数据统计
         * 钩子
         */

        Function.prototype.after = function( fn ){
            var __self = this;
            return function(){
                var ret = __self.apply( this, arguments );
                if ( ret === false ){
                    return false;
                }
                fn.apply( this, arguments );
                return ret;
            }
        };

     /*
      *  自定义事件
      */

     Event = (function(){

        var __Event;

        __Event = function(){
            this.obj = {};
            this.ret_cache = {};
        };

        __Event.prototype.listen = function( key, fn ){
            this.obj[ key ] || ( this.obj[ key ] = [] );
            return this.obj[ key ].push( fn );
        };

        __Event.prototype.stop_listen = function( key, fn ){

            if ( !this.obj[ key ] ) return;

            if ( !fn ){   //remove one
                delete this.obj[ key ];
            }else{  //remove all
                var stack = this.obj[ key ];
                for ( var len = stack.length - 1; len >= 0; len-- ){
                    if ( stack[ len ] === fn ){
                        stack.splice( len, 1 );
                    }
                }
            }
        };

        __Event.prototype.trigger = function(){
             var key,
                queue,
                ret;

            key = __shift.call( arguments );
            queue = this.obj[ key ];

            this.ret_cache[ key ] = arguments;

            if ( !queue || !queue.length ){
                return;
            }

            for ( var i = 0, l = queue.length; i < l; i++ ) {
                ret = queue[ i ].apply( this, arguments );
                if (ret === false) {
                    return false;
                 }
              }
             return ret;
        }

        return __Event;

     })();



     /*
      *  事件钩子函数
      */


     __Hook = {};

     __Hook.listen = function( key, fn ){

        if ( key === 'listen_to' || key === 'waiting_module' ){
            throw new Error( 'Trouble you to give it another name: ' + key );
        }

        if ( key === 'ready' && this.is_ready ){   //已经加载好
            fn.apply( this, this.event.ret_cache[ key ] );
            return false;   //return false, 不再继续职责链后面的函数
        }

     };


     __Hook.trigger = function( key ){
        if ( key === 'ready' ){
            this.is_ready = true;
            __waiting_module[ this.module_name ] = this;
        }
     };


     __Hook.trigger_find_waiting = function( key ){

        var __module;

        if ( key !== 'ready' ){
            return;
        }

        if ( !__waiting_module[ this.module_name ] ){
            return;
        }

        __module = __waiting_module[ this.module_name ];

        __shift.call( arguments );

        __unshift.call( arguments, 'waiting_module' );

        __module.trigger.apply( __module, arguments );

        __module = this;

     };

     /*
      * 创建模块 
      */

    create = (function(){

        var module_cache,
            __Module;

        module_cache = {};

        __Module = function( module_name, html_str ){
            this.event = new Event();
            this.module_name = module_name;
            this.listen_from_cache = {};
            this.is_ready = false;
            this.init( html_str );
        };

        __Module.prototype.init =function( html_str ){
            module_cache[ this.module_name ] = this;
        };


        __Module.prototype.listen = function( key, fn ){
            return this.event.listen( key, fn );
        }.before( __Hook.listen );


        __Module.prototype.listen_one = function( key, fn ){
            this.event.stop_listen( key );
            return this.listen( key, fn );
        };


        __Module.prototype.listen_once = function( key, fn ){  // fn只触发一次, 而非这个key的所有监听函数只触发一次, 如果要使用后者, 请用listen_one方法
            var __fn,
                __self;

            __self = this;

            __fn = function(){
                fn.apply( __self, arguments );
                __self.event.stop_listen.call( __self.event, key, __fn );
            }

            this.listen( key, __fn );
        };


        __Module.prototype.listen_to = function( module, key, fn ){
            module.listen( 'listen_to', function( __key ){
                if ( __key === key ){
                    __shift.call( arguments );
                    fn.apply( module, arguments );
                }
            })
        };


        __Module.prototype.trigger = function( key ){
            return this.event.trigger.apply( this.event, arguments );
        }.after( __Hook.trigger ).after( function( key ){
            __unshift.call( arguments, 'listen_to' );
            this.event.trigger.apply( this.event, arguments );
        }).after( __Hook.trigger_find_waiting );


        return function( module_name, html_str ){
            if ( module_cache[ module_name ] ){
                throw new Error( 'module_name ' + module_name + ' is exsited'  );
            }
            return new __Module( module_name, html_str );
        };


    })();

    /*
     * 查找模块 
     */

    find =  function( module_name ){

        if ( __waiting_module[ module_name ] && __waiting_module[ module_name ].is_ready ){  //if created
            return __waiting_module[ module_name ];
        }

        var event = new Event();

        var __listen = event.listen;

        event.listen = function( key, fn ){
            return __listen.call( event, 'waiting_module', fn );
        };

        return __waiting_module[ module_name ] = event;

    };



   module.exports = {
        create: create,
        find: find
    }


});
/**
 * 随机数
 * @author svenzeng
 * @date 13-3-1
 */


define.pack("./random",[],function (require, exports, module) {

	var random = function(){
		return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace( /[xy]/g, function( c ){
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r&0x3|0x8 );
			return v.toString( 16 )
		}).toUpperCase();
	}

	return{
		random: random
	}

})/**
 * 利用location.hash实现的路由功能
 * @author jameszuo
 * @date 13-2-28
 */
define.pack("./routers",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        Events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),

        win = window,

        ADD = 'add',
        CHANG = 'change',
        REMOVE = 'remove',

        encode = encodeURIComponent,

        undefined;


    var routers = {

        _ready: false,

        /**
         * 初始化路由
         */
        init: function () {

            var me = this;
            if (!me._ready) {

                me._last_params = this._get_params();

                require.async('jquery_history', function () {
                    $.history.init(function () {
                        me._trigger_changes();
                    });
                });

                me.trigger('init');
            }
            me._ready = true;
        },

        /**
         * 转向目标路由
         * @param {Object} key_value_map
         * @param {Boolean} silent (optional) 是否静默修改，即不触发事件
         */
        go: function (key_value_map, silent) {
            var hash = $.map(key_value_map,function (v, k) {
                return encode(k) + '=' + encode(v);
            }).join('&');

            // 静默跳转，直接修改
            if (silent) {
                this._sync_params(key_value_map);
            }

            if ('#' + hash !== win.location.hash) {
                win.location.hash = hash;
            }
        },

        /**
         * 替换指定的路由参数
         * @param {Object} key_value_map
         * @param {Boolean} silent (optional) 是否静默修改，即不触发事件
         */
        replace: function (key_value_map, silent) {
            key_value_map = $.extend({}, this._get_params(), key_value_map);
            this.go(key_value_map, silent);
        },

        /**
         * 删除指定的hash
         * @param {string} key
         */
        unset: function (key) {
            if (key in this._last_params) {
                var new_params = $.extend({}, this._last_params);
                delete new_params[key];
                this.go(new_params);
            }
        },

        /**
         * 获取参数
         * @param {String} key
         * @return {String} val
         */
        get_param: function (key) {
            return this._last_params[key];
        },

        /**
         * 触发事件
         * @private
         */
        _trigger_changes: function () {
            var
                me = this,
                new_params = me._get_params(),
                last_params = this._last_params,
                changes = me._get_changes(new_params, last_params);

            this._sync_params(new_params);

            // 有改变
            if (changes) {
                if (changes[ADD]) {
                    $.each(changes[ADD], function (key, val) {
                        me.trigger(ADD + '.' + key, val);
                    });
                }
                if (changes[CHANG]) {
                    $.each(changes[CHANG], function (key, val) {
                        var new_val = val[0],
                            old_val = val[1];
                        me.trigger(CHANG + '.' + key, new_val, old_val);
                    });
                }
                if (changes[REMOVE]) {
                    $.each(changes[REMOVE], function (key, val) {
                        me.trigger(REMOVE + '.' + key, val);
                    });
                }
            }
        },

        _sync_params: function (params) {
            this._last_params = params;
        },

        /**
         * 获取hash参数
         * @return {Object} { added: {}, changed: {}, removed: {} }
         * @private
         */
        _get_params: function () {
            var hash = win.location.hash.replace(/^#*/, '');
            return url_parser.parse_params(hash);
        },

        // 修改前的hash
        _last_params: {},

        /**
         * 对比新旧参数，找出不相同的值
         * @param new_hash
         * @param last_hash
         * @return {Object} changed { added: {}, changed: {}, removed: {} }
         * @private
         */
        _get_changes: function (new_hash, last_hash) {
            var
            // new_hash key + last_hash key
                union_keys = $.map($.extend({}, new_hash, last_hash), function (v, k) {
                    return k;
                });

            // 对比，寻找改变
            var
                added_map = {},
                changed_map = {},
                removed_map = {};

            // 遍历所有key，找出变化的
            $.each(union_keys, function (i, key) {
                var
                    in_old = last_hash.hasOwnProperty(key),
                    in_new = new_hash.hasOwnProperty(key),
                    in_both = in_old && in_new,

                    old_val = in_old ? last_hash[key] : null,
                    new_val = in_new ? new_hash[key] : null,

                    changed = old_val !== new_val;

                if (in_both) {
                    if (changed) {
                        changed_map[key] = [new_val, old_val];
                    }
                } else if (in_new) {
                    added_map[key] = new_val;
                } else if (in_old) {
                    removed_map[key] = old_val;
                }
            });

            var is_changed = !$.isEmptyObject(added_map) || !$.isEmptyObject(changed_map) || !$.isEmptyObject(removed_map);

            if (is_changed) {
                var changes = {};
                changes[ADD] = added_map;
                changes[CHANG] = changed_map;
                changes[REMOVE] = removed_map;
                return changes;
            }
        }

    };

    $.extend(routers, Events);

    return routers;

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
 * 本地存储
 * @sven
 */
define.pack("./store",[],function (require, exports, module) {
    var api,
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        storage,
        get,
        set,
        remove,
        clear,
        key_prefix = 'weiyun_',
        ok = false;

    set = get = remove = clear = function () {
    };

    try {
        if (localStorageName in win && win[localStorageName]) {
            storage = win[localStorageName];
            set = function (key, val) {
                storage.setItem(key, val)
            };
            get = function (key) {
                return storage.getItem(key)
            };
            remove = function (key) {
                storage.removeItem(key)
            };
            clear = function () {
                storage.clear()
            };

            ok = true;
        }
    }
    catch (e) {
    }


    try {
        if (!ok && globalStorageName in win && win[globalStorageName]) {
            storage = win[globalStorageName][win.location.hostname];
            set = function (key, val) {
                storage[key] = val
            };
            get = function (key) {
                return storage[key] && storage[key].value
            };
            remove = function (key) {
                delete storage[key]
            };
            clear = function () {
                for (var key in storage) {
                    delete storage[key]
                }
            };

            ok = true;
        }
    }
    catch (e) {
    }


    if (!ok && doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) {
                return storage
            }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            storage.setAttribute('data-store-js', '');
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }

        set = function (key, val) {
            try {
                var storage = getStorage();
                storage.setAttribute(key, val);
                storage.save(localStorageName);
            }
            catch (e) {
            }
        };
        get = function (key) {
            try {
                var storage = getStorage();
                return storage.getAttribute(key);
            }
            catch (e) {
                return '';
            }
        };
        remove = function (key) {
            try {
                var storage = getStorage();
                storage.removeAttribute(key);
                storage.save(localStorageName);
            }
            catch (e) {
            }
        };
        clear = function () {
            try {
                var storage = getStorage();
                var attributes = storage.XMLDocument.documentElement.attributes;
                storage.load(localStorageName);
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    storage.removeAttribute(attr.name);
                }
                storage.save(localStorageName);
            }
            catch (e) {
            }
        }
    }

    api = {

        get: function (key) {
            return get(key_prefix + key);
        },

        set: function (key, val) {
            set(key_prefix + key, val);
        },

        remove: function (key) {
            remove(key_prefix + key);
        },

        clear: clear
    };

    module.exports = api;
});
/**
 * 字符串处理
 * @jameszuo 12-12-25 上午9:49
 */
define.pack("./text",["$"],function (require, exports, module) {

    var
        // 用于文本长度计算相关
        $ = require('$'),
        create_el = function($dom){
            var $el = $('<div></div>').css({
                                position : 'absolute',
                                top : '-1000px',
                                left : '-1000px'
                            }).hide().appendTo(document.body);
            if($dom){
                $.each( ['font-size', 'font-style', 'font-weight',
                                'font-family', 'line-height',
                                'text-transform', 'letter-spacing'],
                        function(index, cssProperty) {
                            $el.css(cssProperty, $dom.css(cssProperty));
                        });
            }
            return $el;
        },
        default_measurer,
        html_escapes = {
            '&': "&amp;",
            '<': "&lt;",
            '>': "&gt;",
            "'": "&#39;",
            '"': "&quot;",
            '/': '&#x2F;'
        },

    // 要转义的HTML字符
        re_html_escape = /[&<>'"]/g,

    // 全角字符
        re_double_words = /[^\x00-\xFF]/,

    // 全角空格
        dbc_space = String.fromCharCode(12288),

        undefined;

    var text = {
        /**
         * 格式化文本
         * text.format('Good morning {0}! This is {1}. How do you do!', ['LiLei', 'HanMeiMei']);
         *        ->    Good morning LiLei! This is HanMeiMei. How do you do!
         * @param {String} str
         * @param {Array} args
         * @return {String}
         */
        format: function (str, args) {
            return str.replace(/\{(\w+)\}/g, function (m, $1) {
                var s = args[$1];
                if (s != undefined) {
                    return s;
                } else {
                    return m;
                }
            });
        },

        /**
         * 过滤HTML文本
         * @param str 要过滤的文本
         * @type String 安全文本
         */
        text: function (str) {
            if (typeof str != 'string') return str;
            if (!str) return str;
            return str.replace(re_html_escape, function (chr) {
                return html_escapes[chr] || chr;
            });
        },

        /**
         * 按照字符数截断字符串(1个全角字符=2个半角字符, 可能会有误差)
         * Modify by cluezhang, at 2013/07/03
         * 将此函数改为长度稳定版本，例如截取4全角字符，修改前是这样：
         *   1234567    -> 1234567  (7半角字符)
         *   12345678  -> 12345678  (8..)
         *   123456789 -> 12345678..  (10..)
         * 修改后是这样：
         *   1234567    -> 1234567  (7..)
         *   12345678  -> 12345678  (8..)
         *   123456789 -> 123456..  (8..)
         * @param str
         * @param len
         */
        smart_sub: function (str, len, exceed_tail) {
            try {
                var index = 0;
                len *= 2;
                exceed_tail = typeof exceed_tail === 'string' ? exceed_tail : '..';
                // 截断符长度
                var tail_length = this.byte_len(exceed_tail);
                // 如果字串被截断，除去截断符后能显示的长度
                var exceed_max_length = len - tail_length;
                // 如果达到截断后的最大长度，记录字符位置，以便后面真要截断时快速判断
                var exceed_max_charindex;

                for (var i = 0, l = str.length; i < l; i++) {
                    if (re_double_words.test(str.charAt(i))) {
                        index += 2;
                    } else {
                        index++;
                    }
                    if(!exceed_max_charindex && index >= exceed_max_length){
                        exceed_max_charindex = i+1;
                    }
                    if (index > len) { // 要进行截断了
                        return ( str.substr(0, exceed_max_charindex) + exceed_tail );
                    }
                }
                return str;
            }
            catch (e) {
                return str;
            }
        },

        /**
         * 按照字符数截断字符串(1个全角字符=2个半角字符, 可能会有误差)

         * 将此函数改为长度稳定版本，例如截取4全角字符，修改前是这样：
         *   1234567    -> 1234567  (7半角字符)
         *   12345678  -> 12345678  
         * 修改后是这样：
         *   1234567    -> 1234567 
         *   12345678  -> 12345678 
         *   123456789 -> 12...89 
         * @param {String} str
         * @param {Number} len
         * @return {String}
         */
        smart_cut : function ( str, len ) {
            try {
                var strlen = str.length,
                    exceed_tail = '...',
                    middle = Math.floor( len/2 - 1 );

                return strlen-3 > len ? [ str.substring( 0, middle ),exceed_tail,str.substring( strlen-middle ) ].join('') : str;
                
            }
            catch (e) {
                return str;
            }
        },

        /**
         * 半角转全角
         * @param {String} str
         * @param {Object} [map] 要转换的字符白名单map
         * @returns {string}
         */
        to_dbc: function (str, map) {
            var rst = [],
                Str = String;
            for (var i = 0; i < str.length; i++) {
                var chr = str[i];
                if (chr in map) {
                    var code = str.charCodeAt(i);
                    if (code == 32) {
                        rst.push(dbc_space);
                    } else if (code < 127) {
                        rst.push(Str.fromCharCode(code + 65248));
                    }
                }
                else {
                    rst.push(chr);
                }
            }
            return rst.join('');
        },

        /**
         * 计算字符串的字节长度。全角字符unicode编码范围65281~65374
         * @param str
         * @returns {number}
         */
        byte_len: function (str) {
            if (str) {
                var len = 0;
                for (var i = 0, l = str.length; i < l; i++) {
                    var c = str.charCodeAt(i);
                    // ascii 字符，作为1个字符处理
                    if (c < 0xFF) {
                        len++;
                    }
                    // 全角字符，每个计算2长度
                    else {
                        var is_half = (0xFF61 <= c && c <= 0xFF9F) || (0xFFE8 <= c && c <= 0xFFEE);
                        len += is_half ? 1 : 2;
                    }
                }
                return len;
            }
            else {
                return 0;
            }
        },
        /**
         * 测量文本将会占用的大小
         * @{HTMLElement|jQueryElement} dom 要测量文本在哪个节点下的长度
         * @{String} str 要测量的文本内容
         * @{Number} width (optional) 是否限定宽度（用于测量固定宽度下的高度）
         * @return {Object} size 测量的结果，含width与height属性，数字。
         */
        measure : function(dom, str, width, $specify_el){
            var $measure_el = $specify_el;
            if(!$measure_el){
                $measure_el = create_el($(dom));
            }
            $measure_el.css('width', width ? ''+width+'px' : 'auto');
            $measure_el.text(str);
            var size = {
                width : $measure_el.innerWidth(),
                height : $measure_el.innerHeight()
            };
            $measure_el.text('');
            return size;
        },
        /**
         * 按实际的字符的像素宽度来进行裁剪
         * @param {String} str
         * @param {Number} width 裁剪到多宽
         * @param {String} padding (optional) 裁剪后的填充字串，默认为"..."
         * @param {Measurer} measurer 指定文本宽度测量器，见{#create_measurer}
         * @return {String} after_str
         */
        ellipsis : function(str, width, padding, measurer){
            if(!measurer){
                measurer = text.get_default_measurer();
            }
            padding = padding || '...';
            // 2分法定位合适宽度
            var dotWidth = measurer.measure(padding).width,
                fullWidth = measurer.measure(str).width,
                start, end, guess, guessValue;
            if(fullWidth < width){
                return str;
            }else{
                start = 0;
                end = str.length;
                while(end > start){
                    guess = Math.round((start + end)/2);
                    guessValue = measurer.measure(str.substr(0, guess) + padding).width + dotWidth;
                    if(guessValue > width){
                        end = guess-1;
                        guess--;
                    }else if(guessValue < width){
                        start = guess+1;
                    }else{
                        break;
                    }
                }
                return str.slice(0, guess) + padding;
            }
        },
        /**
         * 创建一个固定的计算器
         * @{HTMLElement|jQueryElement} $dom 要测量文本在哪个节点下的长度
         * @return {Measurer} measurer
         */
        create_measurer : function(dom){
            var $specify_el = create_el($(dom));
             var measurer = {
                measure : function(str, width){
                    return text.measure(null, str, width, $specify_el);
                },
                destroy : function(){
                    $specify_el.remove();
                },
                ellipsis : function(str, width, padding){
                    return text.ellipsis(str, width, padding, measurer);
                }
            };
            return measurer;
        },
        // private
        get_default_measurer : function(){
            if(!default_measurer){
                default_measurer = text.create_measurer(document.body);
            }
            return default_measurer;
        },
        /**
         * 以类windows风格进行路径缩略显示，规则如下：
         * 1. 默认显示全路径，如果空间不够，依次从第{keepFirstDirectoryNum}级目录开始隐藏。但至少显示最后{keepLastDirectoryNum}级的目录，
         * 2. 当前{keepFirstDirectoryNum}级和后{keepLastDirectoryNum}级目录名仍不够空间时，从前开始压缩目录，直到极限，例如"xx..."
         * 
         * 所以， level1>level2>level3>level4>level5>level6，在keepFirstDirectoryNum=1, keepLastDirectoryNum=2规则下，可能会进行以下压缩：
         * level1>...>level3>level4>level5>level6
         * level1>...>level4>level5>level6
         * level1>...>level5>level6
         * le...>...>level5>level6
         * le...>...>le..>level6
         * le...>...>le..>le..
         * 
         * @param {String[]} paths
         * @param {Object} config 配置如何进行缩略，有以下属性：
         *      keepFirstDirectoryNum 保留前多少级目录不隐藏（但仍可能压缩为“xx...”）
         *      keepLastDirectoryNum 保留后多少级目录不隐藏（同上）
         *      hideHtml 隐藏的路径及压缩的扩展字符，默认为"..."
         *      totalWidth 限定的总宽度，以此为参考进行压缩
         *      separatorWidth 分隔符的宽度，默认为12
         *      hidePathWidth 隐藏的路径的宽度，默认从hideHtml计算（为了性能，可以外面计算好了再传）
         *      ellipsisPathWidth 目录能被压缩的最小宽度，默认为50（像素）
         * @param {Measurer} measurer (optional) 参考{#create_measurer)
         * @return {String[]} paths
         */
        compact_paths : function(paths, config, measurer){
            measurer = measurer || text.get_default_measurer();
            config = config || {};
            var 
                // 保留路径前多少级
                keepFirstDirectoryNum = Math.min(paths.length, $.isNumeric(config.keepFirstDirectoryNum) ? config.keepFirstDirectoryNum : 1),
                // 保留路径后多少级
                keepLastDirectoryNum = Math.min(paths.length, $.isNumeric(config.keepLastDirectoryNum) ? config.keepLastDirectoryNum : 2),
                // 缩略时显示的文本
                hideHtml = config.ellipsisPadding || '...',
                // 总路径限定的显示宽度
                totalWidth = config.totalWidth || 200,
                // 路径分隔符宽度
                separatorWidth = config.separatorWidth || 12,
                // 缩略路径的宽度
                hidePathWidth = config.hidePathWidth || measurer.measure(hideHtml).width,
                // 压缩一层路径的最小宽度
                ellipsisPathWidth = config.ellipsisPathWidth || 40;
                // 
            var i, name;
            var widths = [];
            for(i=0; i<paths.length; i++){
                widths.push(measurer.measure(paths[i]).width);
            }
            var stateType = {
                None : 'none', // 未进行缩略
                Ellipsis : 'ellipsis', // 进行了压缩，如 abcdefg -> ab...
                Hide : 'hide' // 进行了隐藏，如 a\b\c\d -> a\...\d
            };
            var currentWidth, hiding, maxCompacted = false, i, states = [], state, width, remainWidth;
            test_compact: while(!maxCompacted){ // 如果没有压缩到极限，就一直尝试压缩
                // 计算当前的宽度
                currentWidth = -separatorWidth;
                hiding = false;
                for(i=0; i<paths.length; i++){
                    state = states[i] || stateType.None;
                    width = widths[i];
                    switch(state){
                        case stateType.Ellipsis:
                            currentWidth += separatorWidth + Math.min(width, ellipsisPathWidth);
                            hiding = false;
                            break;
                        case stateType.Hide:
                            if(!hiding){
                                currentWidth += separatorWidth + hidePathWidth;
                                hiding = true;
                            }
                            break;
                        //case stateType.None:
                        default:
                            currentWidth += separatorWidth + width;
                            hiding = false;
                            break;
                    }
                }
                // 如果当前宽度超出，尝试压缩
                if(currentWidth>totalWidth){
                    // 先尝试隐藏
                    for(i=0; i<paths.length; i++){
                        // 如果不在必显示区域，隐藏
                        state = states[i];
                        if(i >= keepFirstDirectoryNum && i < paths.length-keepLastDirectoryNum && state !== stateType.Hide){
                            states[i] = stateType.Hide;
                            continue test_compact;
                        }
                    }
                    // 再尝试压缩
                    for(i=0; i<paths.length; i++){
                        // 如果当前是全部显示
                        state = states[i];
                        if(!state || states[i] === stateType.None){
                            states[i] = stateType.Ellipsis;
                            continue test_compact;
                        }
                    }
                    // 都没生效就到极限了
                    maxCompacted = true;
                    remainWidth = 0;
                }else{ // 如果宽度符合，结束
                    // 当前仍有空余的宽度，记录，用于适当扩张Ellipsis状态的路径
                    remainWidth = totalWidth - currentWidth;
                    break;
                }
            }
            
            // 处理完毕，输出
            var htmls = [];
            // 从后往前输出
            var targetWidth, useWidth;
            hiding = false;
            for(i=paths.length-1; i>=0; i--){
                state = states[i];
                width = widths[i];
                name = paths[i];
                switch(state){
                    case stateType.Ellipsis:
                        targetWidth = ellipsisPathWidth;
                        if(targetWidth < width && remainWidth>0){
                            // 此次使用多少剩余宽度
                            useWidth = Math.min(remainWidth, width - targetWidth);
                            targetWidth += useWidth;
                            remainWidth -= useWidth;
                        }
                        htmls.push(measurer.ellipsis(name, targetWidth, hideHtml));
                        hiding = false;
                        break;
                    case stateType.Hide:
                        if(!hiding){
                            htmls.push(hideHtml);
                            hiding = true;
                        }
                        break;
                    //case stateType.None:
                    default:
                        htmls.push(name);
                        hiding = false;
                        break;
                }
            }
            htmls.reverse();
            
            return htmls;
        }
    };
    
    return text;
});/**
 * jQuery easings
 * @author jameszuo
 * @date 13-4-23
 */
define.pack("./ui.easing",["$"],function (require, exports, module) {
    var $ = require('$');

    $.extend($.easing, {
        // t: current time, b: begInnIng value, c: change In value, d: duration

//        easeInQuad: function (x, t, b, c, d) {
//            return c * (t /= d) * t + b;
//        },
//        easeOutQuad: function (x, t, b, c, d) {
//            return -c * (t /= d) * (t - 2) + b;
//        },
//        easeInOutQuad: function (x, t, b, c, d) {
//            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
//            return -c / 2 * ((--t) * (t - 2) - 1) + b;
//        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
//        easeInOutCubic: function (x, t, b, c, d) {
//            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
//            return c / 2 * ((t -= 2) * t * t + 2) + b;
//        },
//        easeInQuart: function (x, t, b, c, d) {
//            return c * (t /= d) * t * t * t + b;
//        },
//        easeOutQuart: function (x, t, b, c, d) {
//            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
//        },
//        easeInOutQuart: function (x, t, b, c, d) {
//            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
//            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
//        },
//
//        easeInQuint: function (x, t, b, c, d) {
//            return c * (t /= d) * t * t * t * t + b;
//        },
//        easeOutQuint: function (x, t, b, c, d) {
//            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
//        },
//        easeInOutQuint: function (x, t, b, c, d) {
//            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
//            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
//        },
//        easeInSine: function (x, t, b, c, d) {
//            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
//        },
//        easeOutSine: function (x, t, b, c, d) {
//            return c * Math.sin(t / d * (Math.PI / 2)) + b;
//        },
//        easeInOutSine: function (x, t, b, c, d) {
//            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
//        },
        easeInExpo: function (x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
//        easeInOutExpo: function (x, t, b, c, d) {
//            if (t == 0) return b;
//            if (t == d) return b + c;
//            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
//            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
//        },
//        easeInCirc: function (x, t, b, c, d) {
//            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
//        },
//        easeOutCirc: function (x, t, b, c, d) {
//            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
//        },
//        easeInOutCirc: function (x, t, b, c, d) {
//            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
//            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
//        },
//        easeInElastic: function (x, t, b, c, d) {
//            var s = 1.70158;
//            var p = 0;
//            var a = c;
//            if (t == 0) return b;
//            if ((t /= d) == 1) return b + c;
//            if (!p) p = d * .3;
//            if (a < Math.abs(c)) {
//                a = c;
//                var s = p / 4;
//            }
//            else var s = p / (2 * Math.PI) * Math.asin(c / a);
//            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
//        },
//        easeOutElastic: function (x, t, b, c, d) {
//            var s = 1.70158;
//            var p = 0;
//            var a = c;
//            if (t == 0) return b;
//            if ((t /= d) == 1) return b + c;
//            if (!p) p = d * .3;
//            if (a < Math.abs(c)) {
//                a = c;
//                var s = p / 4;
//            }
//            else var s = p / (2 * Math.PI) * Math.asin(c / a);
//            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
//        },
//        easeInOutElastic: function (x, t, b, c, d) {
//            var s = 1.70158;
//            var p = 0;
//            var a = c;
//            if (t == 0) return b;
//            if ((t /= d / 2) == 2) return b + c;
//            if (!p) p = d * (.3 * 1.5);
//            if (a < Math.abs(c)) {
//                a = c;
//                var s = p / 4;
//            }
//            else var s = p / (2 * Math.PI) * Math.asin(c / a);
//            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
//            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
//        },
//        easeInBack: function (x, t, b, c, d, s) {
//            if (s == undefined) s = 1.70158;
//            return c * (t /= d) * t * ((s + 1) * t - s) + b;
//        },
//        easeOutBack: function (x, t, b, c, d, s) {
//            if (s == undefined) s = 1.70158;
//            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
//        },
//        easeInOutBack: function (x, t, b, c, d, s) {
//            if (s == undefined) s = 1.70158;
//            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
//            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
//        },
//        easeInBounce: function (x, t, b, c, d) {
//            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
//        },
//        easeOutBounce: function (x, t, b, c, d) {
//            if ((t /= d) < (1 / 2.75)) {
//                return c * (7.5625 * t * t) + b;
//            } else if (t < (2 / 2.75)) {
//                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
//            } else if (t < (2.5 / 2.75)) {
//                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
//            } else {
//                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
//            }
//        },
//        easeInOutBounce: function (x, t, b, c, d) {
//            if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
//            return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
//        },
        undefined: undefined
    });

    return {
        get: function (name) {
            return name in $.easing ? name : 'swing';
        }
    };
});/**
 * 强制移除焦点
 * @date 13-5-15
 */
define.pack("./ui.force_blur",["$"],function (require, exports, module) {
    var $ = require('$'),
        support_fix = $.browser.msie && $.browser.version < 7,
        doc_el = document.documentElement,
        $el;

    return function () {
        $el || ($el = $('<button style="height:1px;width:1px;background:none;border:0 none;position:fixed;_position:absolute;left:0;top:0;' + (support_fix ? '' : doc_el.scrollTop + 'px') + '">').appendTo(document.body));
        $el.focus().remove();
    }
});/**
 * 包装 jQuery UI 的 selectable，以适应微云的需求
 * @james 2013/1/15
 */
/*global RegExp,window,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./ui.selectable",["lib","$"],function (require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        console = lib.get('./console'),
        collections = lib.get('./collections'),
        events = lib.get('./events'),
        force_blur = lib.get('./ui.force_blur'),

        CLASS_SELECTED = 'ui-selected',
        CLASS_SELECTEE = 'ui-selectee',

        $win = $(window),
        doc = document,
        $body = $(doc.body),


        undefined;

    var defaults = {
        delegater: $(doc.body),
        target: null,
        child_filter: '*',
        checkbox: '', //':checkbox',
        keep_select_on: '', // 在这些元素内部点击时不会自动清除选中
        clear_on_blur: true, // 点击外部时是否清除选中
        ctrl_multi: true, // 是否按下ctrl才可多选
        select_cancel: 'input,textarea,button,object,embed',
        item_id_field: 'id',
        enable: true
    };

    var Selectable = function (config) {
        this.config = $.extend({}, defaults, config);
        this.$el = $(this.config.delegater);
        this.$target = $(this.config.target);

        if (this.config.enable) {
            this.enable();
        }

        this._selected_files = false;
        this._selected_id_set = {};
        this._selected_id_arr = [];
        this._selected_count = 0;
        this._enabled = false;
        this._is_selecting = false; //<是否在进行框选
        this._last_unshift_selected = null; // 最后一个未按下shift时选中的元素
    };

    Selectable.prototype = {

        enable: function () {

            if (this._enabled) {
                return;
            }

            var me = this,
                config = me.config,
                $target = me.$target,
                $el = me.$el;

            this.disable();

            // 点击后选中
            $target.on('click._selectable', config.child_filter, function (e) {

                var $item = $(this);

                // cancel
                if ($(e.target).closest(config.click_cancel).length
                    || !me.is_can_select($item)) {
                    return;
                }

                // 当前元素是否是选中的
                var is_selected = me.is_selected($item);

                // 如果要按下ctrl才能多选，那么在没有按下ctrl时，需要清除选择
                if (config.ctrl_multi) {

                    if (e.ctrlKey || e.metaKey || e.shiftKey) {

                        // 按住ctrl点击未选中的元素时执行选中
                        // 点击已选中的元素时取消选中

                        me.select_item($item, !is_selected);

                    } else {
                        // 未按下ctrl时, 点击选中/未选中的元素都取消其他的选中
                        // 且点击未选中的元素时, 执行选中

                        var $items = me.get_selected_$items().not($item);

                        me.select_item($items, false);
                        me.select_item($item, true);
                    }

                } else {
                    // 选中
                    me.select_item($item, !is_selected);
                }

                me.trigger_changed();

                // 阻止点击容器外部取消选中（阻止jQuery事件冒泡，参考#1处）
                e.stopImmediatePropagation();
            });

            // #1 点击容器外部取消选中
            if (config.clear_on_blur) {
                $el.on('click._selectable', function (e) {
                    var $target = $(e.target),
                        in_keep = !!$target.closest(config.child_filter + ', ' + config.keep_select_on)[0];

                    if (!in_keep) {
                        me.clear_selected();
                    }

                    clear_text_sel(e);
                });
            } else {
                $el.on('click._selectable', function (e) {
                    clear_text_sel(e);
                });
            }

            $el.on('mousedown._selectable', function (e) {
                if (e.which === 1) {

                    var $target = $(e.target);

                    // 判断点击判断边界，防止点击滚动条时也出现框选
                    if ($target.is('html')) {     // 如果点击的是document，则强制将body设置为事件对象，并判断边界
                        if (e.clientX <= 10 || e.clientX >= $win.width() - 25) {
                            e.stopImmediatePropagation();
                        } else {
                            e.target = doc.body;
                        }
                    }

                    // 如果按下的元素是flash等特殊对象，则不处理框选动作（jqueryui.selectable有个bug，在点击flash上传时，会阻止掉flash的事件，所以这里加一段fix代码）
                    else if ($target.is('object, embed')) {
                        e.stopImmediatePropagation();
                    }

                    // 如果按下的元素是选中的，则不处理框选动作，改为处理拖拽逻辑
//                    else if ($target.closest('.ui-selected')[0]) {
//                        e.stopPropagation();
//                    }
                }
            });

            var filter = $.map(this.$target,function (target) {
                var $target = $(target);
                return '#' + $target.attr('id') + ' > ' + config.child_filter;
            }).join(', ');


            // 框选
            require.async('jquery_ui', function () {
                if (!$el.parent()[0]) {
                    return;
                }
                $el.selectable({
                    filter: filter, // -> '#_disk_files_dir_list > .ui-item, #_disk_files_file_list > .ui-item'

                    cancel: config.select_cancel,
                    distance: 5,

                    selected: function (e, ui) {
                        me.select_item($(ui.selected), true, false);
                    },
                    unselected: function (e, ui) {
                        me.select_item($(ui.selected), false, false);
                    },
                    start: function () {
                        me._is_selecting = true;
                    },
                    stop: function (e) {
                        me.trigger_changed();
                        me._is_selecting = false;
                        me.trigger('box_selection_stop'); // 框选事件
                    }
                });
            });

            me._toggle_text_select(false);

            this._enabled = true;
        },

        disable: function () {
            this.$target.off('click._selectable');
            this.$el.off('click._selectable mousedown._selectable');

            if (this.$el.data('selectable')) {
                this.$el.selectable('destroy');
                this.$el.removeData('selectable');
            }

            this._toggle_text_select(true);

            this._enabled = false;
        },

        is_selecting: function () {
            return this._is_selecting;
        },

        /**
         * 选中元素
         * @param {Array|jQuery|HTMLElement} items
         * @param {Boolean} status
         * @param {Boolean} [trigger_event] 是否触发事件(也可以手动调用trigger_changed方法来手动触发)
         */
        select_item: function (items, status, trigger_event) {
            var me = this,
                $items = $(items);

            // 只能能选中符合条件的元素
            if (status) {
                $items = $items.filter(function (i) {
                    return me.is_can_select(this);
                });
            }

            var changed = false;

            if ($items.length) {
                $items.toggleClass(CLASS_SELECTEE, !status).toggleClass(CLASS_SELECTED, status);

                // 触发事件
                if (trigger_event) {
                    changed = me.trigger_changed();
                }
            }
            return changed;
        },

        /**
         * 清除选中状态
         */
        clear_selected: function () {
            this._last_unshift_selected = null;

            if (this._selected_files) {
                this.get_selected_$items().removeClass(CLASS_SELECTED);

                // this.trigger_changed();

                this.trigger('clear', this._selected_id_arr, this._selected_id_set);

                this._selected_id_arr = [];
                this._selected_id_set = {};
                this._selected_count = 0;
                this._selected_files = false;
            }
        },

        check_changed: function () {
            var
                me = this,
                $selected_items = me.$target.children(this.config.child_filter + '.' + CLASS_SELECTED),
                item_id_field = me.config.item_id_field,

                org_sel_id_set = this._selected_id_set,
                org_sel_id_arr = this._selected_id_arr,
                org_sel_count = this._selected_count,

                new_sel_id_arr = $.map($selected_items, function (it) {
                    return it.getAttribute(item_id_field);
                }),
                new_sel_id_set = collections.array_to_set(new_sel_id_arr),

                changed = false;

            if (new_sel_id_arr.length != org_sel_count) {
                changed = true;
            } else {
                changed = !_is_keys_match(org_sel_id_set, new_sel_id_set);
            }

            me._selected_count = $selected_items.length;
            me._selected_files = me._selected_count > 0;
            me._selected_id_set = new_sel_id_set;
            me._selected_id_arr = new_sel_id_arr;

            return {
                changed: changed,
                org_sel_id_set: org_sel_id_set,
                org_sel_id_arr: org_sel_id_arr,
                new_sel_id_set: new_sel_id_set,
                new_sel_id_arr: new_sel_id_arr
            };
        },

        /**
         * 表示选中状态已变更
         */
        trigger_changed: function () {
            var change_status = this.check_changed();
            if (change_status) {
                this.trigger('select_change', change_status);
            }
            return change_status.changed;
        },

        set_filter: function (target, child_filter) {
            var me = this,
                config = me.config;

            // 清除不符合过滤器的

            // 所有元素
            var $items = me.$target.children(),
            // 已选中的元素
                $sel_items = $($.map(this._selected_id_arr, function (id) {
                    return document.getElementById(id);
                }));
            $items.filter('.' + CLASS_SELECTED);

            // 更新过滤器
            me.$target = $(target);

            if (child_filter) {
                config.child_filter = child_filter;
            }

            // 找出已选中元素中仍然可以被选中的元素，并清除无效的选中
            var $can_sel_items = me.filter_can_select($sel_items, true);

            // 使用新的过滤器重新选中
            me.select_item($can_sel_items, true, true);

            me.disable();
            me.enable();
        },

        /**
         * 设置是否默认多选（默认多选 —— 不需要按住ctrl即可多选）
         * @param {Boolean} multi
         */
        set_ctrl_multi: function (multi) {
            this.config.ctrl_multi = !!multi;
        },

        /**
         * 设置是否在点击外部的时候清除选中
         * @param {Boolean} blur
         */
        set_clear_on_blur: function (blur) {
            this.config.clear_on_blur = blur;
        },

        set_select_cancel: function (click_cancel, select_cancel) {
            this.config.click_cancel = click_cancel;
            this.config.select_cancel = select_cancel;

            // for jQueryUI.selectable
            if (this.$el.data('selectable')) {
                this.$el.selectable('option', 'cancel', select_cancel);
            }
        },

        set_keep_select_on: function (keep_select_on) {
            this.config.keep_select_on = keep_select_on;
        },

        refresh: function () {
            var $el = this.$el,
                selectable_widget = $el.data('selectable');
            if (selectable_widget) {
                selectable_widget.refresh();
                selectable_widget.selectees = $(selectable_widget.options.filter, selectable_widget.element[0])
            }
        },

        get_$items: function () {
            return this.$target.children(this.config.child_filter);
        },

        _get_item_by_id: function (id) {
            return doc.getElementById(id);
        },

        get_selected_$items: function () {
            var me = this,
                sel_id_arr = this._selected_id_arr,
                sel_items = $.map(sel_id_arr, function (id) {
                    var it = me._get_item_by_id(id);
                    if (it) {
                        return it;
                    }
                });
            return $(sel_items);
        },

        has_selected: function () {
            for (var id in this._selected_id_set) {
                var it = this._get_item_by_id(id);
                if (it) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 判断元素是否可以被选中
         * @param {jQuery|HTMLElement} item 元素DOM
         */
        is_can_select: function (item) {
            var me = this,
                $item = $(item);
            return $item.parent().is(me.$target) && $item.is(me.config.child_filter);
        },

        is_selected: function (item) {
            return $(item).hasClass(CLASS_SELECTED);
        },

        /**
         * 过滤出可以被选中的元素
         * @param {jQuery|HTMLElement} items 元素DOM数组
         * @param {Boolean} update_dom 是否更新DOM
         * @return {jQuery}
         */
        filter_can_select: function (items, update_dom) {
            var me = this;
            return $(items).filter(update_dom ? function (i) {
                var item = items[i];
                if (me.is_can_select(item)) {
                    return item;
                } else {
                    me.select_item(item, false, false);
                }
            } : function (i) {
                return me.is_can_select(items[i]);
            });
        },

        /**
         * 选中目标元素, 同时清除其他选中
         * @param {HTMLElement|jQuery} $item
         */
        select_but: function ($item) {
            $item = $($item).get(0);

            var $sibling_items = this.get_selected_$items().not($item);

            this.select_item($sibling_items, false, false);
            this.select_item($item, true, false);

            this.trigger_changed();

            return this.is_selected($item);
        },

        _toggle_text_select: function (enable) {
            $body.off('selectstart.selectable');

            if (!enable) {
                $body.on('selectstart.selectable', function (e) {
                    if (is_input(e) || is_console(e)) {
                        return true;
                    }
                    e.preventDefault();
                });
            }
        }
    };

    /**
     * 判断两个map的keys是否一致
     * @param {Object} map_1
     * @param {Object} map_2
     * @private
     */

    var _is_keys_match = function (map_1, map_2) {
        var eq = true;
        if (!map_1 && !map_2) {
            eq = false;
        } else {
            var str_1 = [], str_2 = [];
            for (var k in map_1) {
                str_1.push(k);
            }
            for (var k in map_2) {
                str_2.push(k);
            }
            return str_1.join(',') === str_2.join(',');
        }

        return eq;
    };

    var INPUT_TAGS = {
            TEXTAREA: 0,
            INPUT: 0
        },
        is_input = function (e) {
            return e.target && (e.target.tagName.toUpperCase() in INPUT_TAGS);
        },
        is_console = function (e) {
            return $(e.target).closest('.WeiyunConsole')[0];
        };


    // 清除选中文本
    var no_selection_text = 'getSelection' in window ? function () {
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

    var inputs = { TEXTAREA: 1, INPUT: 1 };

    // 清空选中的文本
    var clear_text_sel = function (e) {
        if (!inputs.hasOwnProperty(e.target.tagName) && !inputs.hasOwnProperty(document.activeElement.tagName)) {
            no_selection_text();
        }
    };

    $.extend(Selectable.prototype, events);

    return Selectable;
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