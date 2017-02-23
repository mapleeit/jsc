//todo:
module.exports = {
    l5api: plug('config').l5api['web2.cgi.weiyun.com'],
    dcapi: {
        DiskUserInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 176000301
        },
        VerifyIndep: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 177000209
        },
        DiskDirBatchList: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 175000201
        },
        get_user_info: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 175000237
        }
    }
};

