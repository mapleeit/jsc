
define(function( require, exports, module ){

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