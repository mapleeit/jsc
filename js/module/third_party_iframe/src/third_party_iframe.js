/**
 * 文档预览
 * @author jameszuo
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

        ThirdPartyIframe = require('./ThirdPartyIframe'),

        cur_instance,

        undefined;

    var third_party_preview = new Module('third_party_preview', {

        /**
         * 创建一个DocPreview对象
         * @param options
         *  - {String} url
         *  - {String} title
         */
        create_preview: function (options) {
            if (cur_instance) {
                cur_instance.close();
            }

            return cur_instance = new ThirdPartyIframe(options);
        }

    });

    return third_party_preview;
});