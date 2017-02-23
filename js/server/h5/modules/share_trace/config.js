/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

module.exports = {
    l5api: plug('config').l5api['web2.cgi.weiyun.com'],
    dcapi: {
        WeiyunShareListGet: {
            fromId: 211100053,
            toId: 211100054,
            interfaceId: 179000086
        },
        WeiyunShareTraceInfoGet: {
            fromId: 211100053,
            toId: 211100054,
            interfaceId: 179000087
        }
    }
};

