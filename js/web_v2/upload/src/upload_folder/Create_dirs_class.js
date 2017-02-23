/**
 * 拖拽上传创建目录工具类
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        create_dirs = require('./upload_folder.create_dirs'),

        undefined;

    var Create_dirs_class = function(cfg) {
        $.extend(this, cfg);
    };

    Create_dirs_class.prototype = create_dirs;

    return Create_dirs_class;

});