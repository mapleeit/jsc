//todo:
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
        }
    }
};

