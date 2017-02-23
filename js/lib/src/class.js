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

define(function(require, exports, module) {


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

});