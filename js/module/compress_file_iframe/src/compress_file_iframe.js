/**
 * 文档预览
 * @author svenzeng
 * @date 13-5-8
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),

        CompressFileIframe = require('./CompressFileIframe'),

        cur_instance,

        undefined;

    var compress_file_iframe = new Module('compress_file_iframe', {

        /**
         * 创建一个DocPreview对象
         * @param options
         *  - {FileObject} file
         *  - {Number} max_width 预览框的最大宽度
         */
        create_preview: function (options) {
            if (cur_instance) {
                cur_instance.close();
            }

            return cur_instance = new CompressFileIframe(options);
        }

    });

    compress_file_iframe.get_cur_instance = function(){
        return cur_instance;
    };

    return compress_file_iframe;
});