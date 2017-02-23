/**
 *
 * @author hibincheng
 * @date 13-12-09
 */
define(function (require, exports, module) {
    var $ = require('$');

    //IE11 userAgent的MSIE弃用了，改用mozilla，虽然官方认为IE11可以当成标准浏览器看待了，但项目中有使用控件区分IE和其它浏览器、浏览器使用情况数据上报，所以还是要把IE11标识为MSIE
    //version不需要修复，IE11的userAgent表示版本的是rv:正好与mozilla标识相同，也正是IE11当成了Mozilla
    if($.browser.mozilla && window.ActiveXObject !== undefined) {
        $.browser.msie = true;
        delete $.browser.mozilla;
    }
});