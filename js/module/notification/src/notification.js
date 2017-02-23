/**
 * 通知中心
 * @author hibincheng
 * @date 2015-05-26
 */
define(function(require, exports, module) {

    return function() {
        //中转站过期提醒
        require('./station')();

    }
});