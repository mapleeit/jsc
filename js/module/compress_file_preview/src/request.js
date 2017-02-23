/**
 * 图片、文档预览
 * @author svenzeng
 * @date 13-3-15
 * todo 图片预览会话超时检测
 */
define(function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        security = lib.get('./security'),

        constants = common.get('./constants'),
        request = common.get('./request'),
        last_req;

    var make_params = function (file, file_path) {
        return {
            file_md5: file.get_file_md5() || security.md5(file.get_id()),
            file_name: encodeURIComponent(file.get_name()),
            file_id: file.get_id(),
            pdir_key: file.get_pid(),
            file_path: file_path,
            file_size: file.get_size()
        };
    };


    var list = function (file, file_path, fail_callback, succ_callback) {
        abort();

        var param = make_params(file, file_path);
        last_req = request.xhr_post({
            url: 'http://web2.cgi.weiyun.com/compress_view.fcg',
            cmd: 'ListFile',
            pb_v2: true,
            body: param
        })
            .fail(function (msg, ret, rsp_body, rsp_header) {
                fail_callback(msg, ret, param, rsp_body);
            })
            .ok(function (msg, rsp_body, rsp_header) {
                succ_callback(rsp_body, param);
            })
            .done(function () {
                last_req = null;
            });
    };

    var abort = function () {
        if (last_req) {
            last_req.destroy();
        }
    };

    return {
        list: list,
        abort: abort
    };

});