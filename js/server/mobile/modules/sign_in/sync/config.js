/**
 * Created by maplemiao on 05/12/2016.
 */
"use strict";

module.exports = {
    l5api: {
        Weiyun: plug('config').l5api['web2.cgi.weiyun.com'],
        Qzone: plug('config').l5api['activity.qzone.qq.com']
    },
    dcapi: {
        DiskUserInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 176000301
        },
        // 废弃，目前只用WeiyunDailySignIn
        WeiyunCheckSignIn: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 176000346
        },
        WeiyunDailySignIn: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 111865294
        },
        QzoneActGoodsGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 178000315
        },
        QzoneActRecordsGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 178000316
        },
        QzoneActAddressGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 178000317
        },
        OnlineConfig: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000183
        }
    }
};

