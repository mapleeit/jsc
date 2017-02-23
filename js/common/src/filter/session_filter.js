/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 *
 * 切面过滤器，一些页面动作在调用之前，需要做权限控制
 */
define(function (require, exports, module) {
    var query_user=require('./query_user');

    return function(caller,args,callback){
        if( !query_user.check_cookie() ){
            //弹出登录框
            require('./global.global_event').namespace('session').trigger('session_timeout');
            return;
        }
        if( callback ){
            return callback.apply( caller || window, args );
        }
    };
});
