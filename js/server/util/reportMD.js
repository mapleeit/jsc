/**
 * node直出上报模调
 * @author: xixin
 * @date: 2016/04/22
 **/

var dcapi       = plug('api/libdcapi/dcapi.js'),
    serverInfo  = plug('serverInfo');

/**
 * node端返回码模调上报
 *
 * @module server/util/reportMD
 * @param {number} interfaceId m.isd.com申请的接口id
 * @param {number} code 返回码
 * @param {number} isFail 0/1
 */
module.exports = function(interfaceId, code, isFail) {
    dcapi.report({
        fromId: 204971707,
        toId: 277000034,
        interfaceId: interfaceId,
        toIp: serverInfo.intranetIp,
        code: code,
        isFail: isFail,
        delay: 100
    });
};

