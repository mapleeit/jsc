/**
 * 剪贴板模块
 * 注： 各子模块的destroy方法未启用，后续要启用时要测试是否有错误
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),

        undefined;

    //css
    require('clipboard_css');

    var clipboard = new Module('clipboard', {

        ui: require('./ui')

    });

    return clipboard;
});