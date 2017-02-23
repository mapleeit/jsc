/**
 * Created by maplemiao on 2016/9/13.
 */

"use strict";

var ajax = require('weiyun/util/ajax');
var Deferred = plug('pengyou/util/Deferred');
var async = require('weiyun/util/async');

var config = require('./config');

/**
 * 拉取首屏剧集列表
 * @param pdirKey
 * @param dirKey
 * @param callback
 */
var loadEpisodeInfo = function (pdirKey, dirKey, callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['EpisodeListGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskDirBatchListByType',
        data: {
            pdir_key: pdirKey,
            dir_list: [{
                dir_key: dirKey,
                file_type: 4, //文件类型,与库id相同(2216协议使用)(文档:1; 图片:2; 音乐:3; 视频:4;)
                get_abstract_url: true
            }]
        }
    }).done(function (data) {
        callback(null, data);
    }).fail(function (msg, ret) {
        callback({
            cmd: 'DiskDirBatchListByType',
            msg: msg,
            ret: ret
        }, null)
    });
};

/**
 * 拉取用于拼出真实下载链接的各种参数
 * @param videoID
 * @param dirKey
 * @param callback
 */
var loadDownloadInfo = function (videoID, dirKey, callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DownloadInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
        cmd: 'DiskFileBatchDownload',
        data: {
            file_list: [{
                file_id: videoID,
                pdir_key: dirKey
            }],
            download_type: 15
        }
    }).done(function (data) {
        callback(null, data);
    }).fail(function (msg, ret) {
        callback({
            cmd: 'DiskFileBatchDownload',
            msg: msg,
            ret: ret
        }, null)
    });
};

/**
 * 拉取该视频文件的各种信息
 * @param videoID
 * @param dirKey
 * @param callback
 */
var loadVideoInfo = function (videoID, dirKey, callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['VideoInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskFileBatchQuery',
        data: {
            file_list: [{
                file_id: videoID,
                pdir_key: dirKey
            }]
        }
    }).done(function (data) {
        callback(null, data);
    }).fail(function (msg, ret) {
        callback({
            cmd: 'DiskFileBatchQuery',
            msg: msg,
            ret: ret
        }, null)
    });
};

module.exports = {
    batchLoadData: function (videoID, dirKey, pdirKey) {
        var def = Deferred.create();

        async.parallel([
            function (callback) {
                loadDownloadInfo(videoID, dirKey, callback);
            },
            function (callback) {
                loadEpisodeInfo(pdirKey, dirKey, callback);
            },
            function (callback) {
                loadVideoInfo(videoID, dirKey, callback);
            }
        ], function (err, results) {
            if (!err) {
                def.resolve(results[0]['file_list'][0], results[1]['dir_list'][0], results[2]['file_list'][0]);
            } else {
                def.reject(err);
            }
        });

        return def;
    }
};