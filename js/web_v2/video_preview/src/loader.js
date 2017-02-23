/**
 * Created by maplemiao on 2016/9/18.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var request = common.get('./request');

    return {
        loadEpisode: function (dirKey, pdirKey) {
            var me = this;
            var def = $.Deferred();

            var params = {
                pdir_key: pdirKey,
                dir_list: [{
                    dir_key: dirKey,
                    start: 100, // 直出已经拉了前100个，故从100开始往后拉取
                    file_type: 4 //文件类型,与库id相同(2216协议使用)(文档:1; 图片:2; 音乐:3; 视频:4;)
                }]
            };

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskDirBatchListByType',
                pb_v2: true,
                body: params
            }).ok(function (msg, body) {
                def.resolve(msg, body);
            }).fail(function (msg, err) {
                def.reject(msg, err);
            });

            return def;
        },

        loadDownloadInfo : function (videoID, dirKey) {
            var def = $.Deferred();

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
                cmd: 'DiskFileBatchDownload',
                cavil: true,
                pb_v2: true,
                body: {
                    file_list: [{
                        file_id: videoID,
                        pdir_key: dirKey
                    }],
                    download_type: 15
                }
            }).ok(function (msg, data) {
                def.resolve(msg, data);
            }).fail(function (msg, ret) {
                def.reject({ret: ret, msg: msg}, null);
            });
            return def;
        }
    };
});