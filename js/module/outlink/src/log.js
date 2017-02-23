/**
 * 外链独立页71表上报
 * @author yuyanghe
 * @date 2013-9-29
 */
define(function(require, exports, module){
    var special_log = require('special_log');
    var act_id = 106;
    return special_log.build_logger({
        //外链页面浏览
        visit : {
            act_id : act_id,
            op_id : 0
        },
        //外链文件下载
        download : {
            act_id : act_id,
            op_id : 1
        },
        //外链转存
        store : {
            act_id : act_id,
            op_id : 2
        },
        //外链密码验证
        pwd_login : {
            act_id : act_id,
            op_id : 3
        }
    });
});