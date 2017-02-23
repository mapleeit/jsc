/**
 * 全局错误页
 */
function fail(data){

    var __p=[],_p=function(s){__p.push(s)};
    __p.push('    <!DOCTYPE html>\r\n\
    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>错误啦</title>\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no">\r\n\
        <link rel="stylesheet" href="//imgcache.qq.com/vipstyle/nr/box/web/css/weiyun-global.css">\r\n\
        <style>\r\n\
            /* 网络错误，重新加载 */\r\n\
            .wy-reload-wrap{width: 100%;margin-top: 45%;display: -webkit-flex;display: flex;-webkit-box-align: center;-moz-box-align: center;-webkit-align-items: center;-ms-flex-align: center;align-items: center;}\r\n\
            .wy-reload-wrap .reload-btn{overflow:hidden;display: block;width: 100%;height: 100%;position: relative;}\r\n\
            .wy-reload-wrap .reload-btn .reload-btn-box{position: relative;left: 50%;top: 50%;float: left;}\r\n\
            .wy-reload-wrap .reload-btn .reload-btn-box .reload-btn-wrap{position: relative;left: -50%;top: 0;text-align: center;float: left;}\r\n\
            .wy-reload-wrap .icon-reload{display: inline-block;width: 84px;height: 100px;background-image: url(//imgcache.qq.com/vipstyle/nr/box/web/images/icon-reload.png);margin-bottom: 12px;}\r\n\
            .wy-reload-wrap .reload-txt{color: #b7bfcb;text-align: center;font-size: 18px;}\r\n\
\r\n\
            @media only screen and (-webkit-min-device-pixel-ratio: 1.25), only screen and (min-resolution: 120dpi), only screen and (min-resolution: 1.25dppx){\r\n\
                .reload-wrap .icon-reload{\r\n\
                    background-image: url(//imgcache.qq.com/vipstyle/nr/box/web/images/icon-reload@2x.png);\r\n\
                    background-size: 252px 152px;\r\n\
                    background-position: 0 0;\r\n\
                }\r\n\
            }\r\n\
        </style>\r\n\
    </head>\r\n\
    <body>\r\n\
    <!-- End weiyun file shera-er, jump to weiyun -->\r\n\
    <div class="wy-reload-wrap">\r\n\
        <a href="javascript:void(0)" onclick="location.reload()" class="reload-btn" title="重新加载">\r\n\
            <div class="reload-btn-box">\r\n\
                <div class="reload-btn-wrap">\r\n\
                    <i class="icon icon-reload"></i>\r\n\
                    <p class="reload-txt">');
    _p(data);
    __p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </a>\r\n\
    </div>\r\n\
    </body>\r\n\
    </html>');

    return __p.join("");
}

var logger = plug('logger');
module.exports = function(request,response,msg) {
    msg = msg || '服务器错误，请重试';
    logger.report();
    response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    response.end(fail(msg));
};