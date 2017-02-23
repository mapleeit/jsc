module.exports = {
    l5api: {
        WeiyunYoutuPorn: plug('config').l5api['imageporn.api.youtu.qq.com'],
        WeiyunYoutuTag: plug('config').l5api['imagetag.api.youtu.qq.com'],
        WeiyunPic: plug('config').l5api['web.cgi.weiyun.com']
    },
    dcapi: {
        WeiyunYoutuPorn: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 177000188
        },
        WeiyunYoutuTag: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 177000189
        },
        WeiyunPic: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 177000190
        }
    }
};

