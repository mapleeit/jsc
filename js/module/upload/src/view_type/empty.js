/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define(function (require, exports, module) {
    var $ = require('$'),
        methods = {};
    $.each('init_dom invoke_state change_state transform_state init wait start re_start file_sign_update_process file_sign_done upload_file_update_process error done pause continuee resume_pause resume_continuee clear'.split(' '),function(i,n){
        methods[n] = $.noop;
    });
    return methods;
});


