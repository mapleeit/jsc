/**
 * 初始化一些东西
 * @author jameszuo
 * @date 13-1-10 下午4:10
 */
define(function (require, exports, module) {

    return function () {
        //IE11
        require('./init.fix_ie11');

        // 阻止一些浏览器默认事件
        require('./init.prevent_events');

        // 阻止异常消息冒泡
        require('./init.prevent_error');

        // 一些默认全局事件
        require('./init.default_global_events');

        // IE6
        require('./init.fix_ie6');

        //热点点击统计
        require('./init.click_tj');

        // 重绘方法引入
        require('./init.enable_repaint');

        // 启用、关闭读屏支持
        require('./scr_reader_mode').init();
    };
});