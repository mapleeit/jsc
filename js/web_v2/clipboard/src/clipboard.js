/**
 * 剪贴板模块
 * @author iscowei
 * @date 2016-07-18
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Module = common.get('./module'),
        undefined;

    var clipboard = new Module('clipboard', {
        ui: require('./ui')
    });

    return clipboard;
});