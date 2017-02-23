/**
 * 压缩包预览
 * @author svenzeng
 * @date 13-7-4
 */
define(function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        url_parser = lib.get('./url_parser'),
        request = require('./request'),
        View = require('./view'),

        iframe_instance;


    var get_iframe_instance = function (callback) {
        if (iframe_instance) {
            callback(iframe_instance);
        } else {
            parent.seajs.use('compress_file_iframe', function (mod) {
                var compress_file_iframe = mod.get('./compress_file_iframe');
                iframe_instance = compress_file_iframe.get_cur_instance();

                callback(iframe_instance);
            });
        }
    };

    get_iframe_instance(function (instance) {
        View.init(instance);
    });

});