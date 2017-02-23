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
        NotePageListGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 111865371
        }
    }
};

