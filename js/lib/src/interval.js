/**
 * 全局定时器管理
 * @sven
 */

	define(function (require, exports, module) {

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


