/**
 * Created by maplemiao on 2016/9/23.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        urls = common.get('./urls'),
        https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants'),
        cookie = lib.get('./cookie');


    /**
     * 通过后台传过来的参数拼接成真正的下载链接
     * @param downloadInfo
     * @returns {*}
     * @private
     */
    return function (downloadInfo) {
        var path,
            server_name,
            fname,
            url;

        if ($.isEmptyObject(downloadInfo)) {
            return;
        }

        // 填写防盗链cookie
        cookie.set(downloadInfo.cookie_name, downloadInfo.cookie_value, {
            domain: constants.MAIN_DOMAIN,
            path: '/'
        });

        server_name = downloadInfo.server_name;

        fname = decodeURIComponent(downloadInfo.download_url.split('?')[1].split('&')[0].split('=')[1]);
        path = downloadInfo.encode_url;

        url = 'http://' + server_name + (downloadInfo.server_port ? ':' + downloadInfo.server_port : '') + '/ftn_handler/' + path + '/';
        url = urls.make_url(url, {
            fname: fname,
            cv: constants.APPID,
            cn: 0
        });

        url = https_tool.translate_download_url(url);

        return url;
    }
});