
module.exports = {
    l5api: plug('config').l5api['web2.cgi.weiyun.com'],
    dcapi: {
        DiskUserInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 176000301
        },

        DiskDirBatchList: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 175000201
        },

        CloudConfigGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 175000200
        },

        TemporaryFileDiskDirList: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 111865291
        }
    },

    loginCode: [1024, 10000, 190051, 1031, 190011, 190072]
};
