/**
 * Created by maplemiao on 14/11/2016.
 */
"use strict";

// @todo maplemiao
module.exports = {
    l5api: plug('config').l5api['web2.cgi.weiyun.com'],
    dcapi: {
        UserInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000161
        },
        SpaceInfoGet: {
            fromId			: 211100053,
            toId			: 211100054,
            interfaceId		: 179000162
        }
    }
};

