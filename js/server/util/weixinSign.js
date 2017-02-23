/**
 * 微信jssdk使用的票据获取
 */

var https = require('https');
var Deferred = plug('pengyou/util/Deferred');

var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须与调用 JSAPI 时的页面 URL 完全一致
 */
var sign = function (jsapi_ticket, url) {
    var ret = {
        appid: APPID,
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var string = raw(ret);
    var jsSHA = require('weiyun/util/sha');
    var shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');

    return ret;
};

var timingClearJSapiTicket = function() {
    setTimeout(function() {
        delete global.jsapiTicket;
    }, 7200*1000);
}

var APPID = 'wxd15b727733345a40';
var APPSECRET = '19673f8e07282ba2f13c8734a271aeb6';

module.exports = function(url) {
    var defer = Deferred.create();
    if(global.jsapiTicket) {
        defer.resolve(sign(global.jsapiTicket, url));
    } else {
        https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APPID+'&secret='+APPSECRET, function(res) {
            res.on('data', function(d) {
                var jsonData = JSON.parse(d.toString('UTF-8'));
                var access_token = jsonData.access_token;
                https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' + access_token, function(res) {
                    res.on('data', function(d) {
                        var jsonData = JSON.parse(d.toString('UTF-8'));
                        global.jsapiTicket = jsonData.ticket;
                        timingClearJSapiTicket();
                        defer.resolve(sign(jsonData.ticket, url));
                    })
                }).on('error', function(e) {
                    defer.reject(e);
                })
            });

        }).on('error', function(e) {
            defer.reject(e);
        });
    }

    return defer;

}