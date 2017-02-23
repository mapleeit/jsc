/**
 * Created by maplemiao on 2016/9/8.
 */

"use strict";

module.exports = {
    l5api: plug('config').l5api['web2.cgi.weiyun.com'],
    dcapi: {
        DownloadInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000077
        },
        EpisodeListGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000079
        },
        VideoInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000080
        }
    }
};