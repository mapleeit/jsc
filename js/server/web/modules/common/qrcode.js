/**
 * 二维码
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');
    var qrCode      = require('weiyun/util/qrcode-npm/qrcode.js');
    var base64      = require('weiyun/util/base64');

    var data = request.GET['data'] || '';
    var size = request.GET['size'] || 4;
    var level = request.GET['level'] || 5;
    var qr = qrCode.qrcode(level, 'M');

    var gzipResponse = gzipHttp.getGzipResponse({
        request: request,
        response: response,
        plug: plug,
        code: 200,
        contentType: 'image/png'
    });

    try{

        qr.addData(data);
        qr.make();

        var buffer = qr.createImgBuffer(size);    // creates an img buffer

        gzipResponse.write(buffer);
        gzipResponse.end();
    } catch(e) {
        gzipResponse.write('服务器繁忙');
        gzipResponse.end();
    }
};