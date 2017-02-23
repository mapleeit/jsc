/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-7-27
 * Time: 上午11:46
 */
define(function (require, exports, module) {
    var console = require('lib').get('./console'),
        Cache= require('./tool.upload_cache'),
        bar_info,//统计信息UI模块
        BOX= require('./speed.count_box'),//正真的速度计算模块

        done_states = ' done error ',//已完成的状态
        get_bar = function(){
            return bar_info || (bar_info = require('./tool.bar_info'));
        },
        watch_fn = function () {
            if (Cache.get_dw_main_cache().is_done()) {//任务已经完成，返回
                return;
            }
            var cache = Cache.get_dw_main_cache().get_cache(),
                speed = 0;
            for (var key in cache) {
                if(key !== 'length'){
                    var unit = cache[key];
                    if( -1 !== done_states.indexOf(' '+ unit.state + ' ') ){
                        BOX.down.remove(key);
                    } else{
                        BOX.down.add(key);
                        var tmp = BOX.down.get_speed.call(unit,key);
                        speed += tmp;
                    }
                }
            }
            get_bar().update(get_bar().OPS.DOWN_SPEED, speed );
        };

    return {
        /**
         * 速度计算轮询函数
         */
        watch_fn: watch_fn,
        /**
         * 重置计速
         */
        reset: function(){
            BOX && BOX.reset_speed();
        }
    };
});