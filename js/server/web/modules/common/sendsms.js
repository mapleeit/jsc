/**
 * 发短信
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');
    var parseBody	= plug('pengyou/util/http/parseBody.js');
    var net         = require('net');
    var querystring = require('querystring');


    parseBody(request,response,function(){
        onPost(request,response);
    });

    function onPost(request, response) {
        var number = request.POST['number'] || '';
        var captcha = request.POST['captcha'];
        var clientIp	= (request.headers['x-forwarded-for'] || (request.socket && request.socket.remoteAddress));
        var params = {
            'uin': '10011111',
            'cmd': 'sms',
            'client_ip': clientIp,
            'mb_number': number
        };

        //发短信服务器
        var smsHost = '10.151.0.102';
        var smsPort = 8993;

        if(captcha) {
            params['auth_code'] = captcha;
            params['verify_session'] = request.cookies.verifysession;
        }

        if(!number) {
            responseData({
                ret: 1
            });
        } else {
            var client = new net.Socket();
            client.connect(smsPort, smsHost, function() {

                client.write(querystring.stringify(params));
            });

            client.on('data', function(data) {
                // console.log('server data:', data);
                var data = data.replace('\r\n', '');
                responseData(data);
            });

            client.on('close', function() {
                // console.log('Connection closed');
            });
        }

    }



    function responseData(data) {
        var gzipResponse = gzipHttp.getGzipResponse({
            request: request,
            response: response,
            plug: plug,
            code: 200,
            contentType: 'text/html'
        });

        if(typeof data === 'object') {
            data = JSON.stringify(data);
        }
        gzipResponse.write(data);
        gzipResponse.end();
    }
};