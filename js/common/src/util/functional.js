/**
 * 函数的扩展功能
 * @author svenzeng
 * @date 2013-3-6
 */


define(function (require, exports, module) {

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
