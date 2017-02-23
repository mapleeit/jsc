
//tmpl file list:
//qqvip/src/mobile/base.tmpl.html
//qqvip/src/mobile/body.tmpl.html
//qqvip/src/mobile/error.tmpl.html
//qqvip/src/web/base.tmpl.html
//qqvip/src/web/body.tmpl.html
//qqvip/src/web/error.tmpl.html
//qqvip/src/web/no_login.tmpl.html
define("club/weiyun/js/server/h5/modules/act/qqvip/tmpl",["weiyun/util/appid","weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'baseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

    var serv_taken = new Date() - window.serv_start_time;
    var APPID = require('weiyun/util/appid')();
    var serverConfig = plug('config') || {};
    var is_test_env = !!serverConfig.isTest;
    __p.push('    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>QQ会员微云特权</title>\r\n\
        <meta http-equiv="Content-Language" content="zh-cn">\r\n\
        <meta name="author" content="Tencent-ISUX">\r\n\
        <meta name="Copyright" content="Tencent">\r\n\
\r\n\
        <meta name="HandheldFriendly" content="True">\r\n\
        <meta name="MobileOptimized" content="320">\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no" />\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">\r\n\
        <meta name="apple-mobile-web-app-capable" content="yes">\r\n\
        <meta name="apple-mobile-web-app-status-bar-style" content="black">\r\n\
        <meta name="format-detection" content="telephone=no,email=no" />\r\n\
	    <meta itemprop="name" content="腾讯微云" />\r\n\
	    <meta itemprop="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。" />\r\n\
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />');

            var g_info = window['g_weiyun_info'];
        __p.push('        <scr');
__p.push('ipt>var IS_TEST_ENV = ');
_p(is_test_env);
__p.push('; var IS_MOBILE = ');
_p(g_info.is_mobile);
__p.push('; window.APPID = ');
_p(APPID);
__p.push(';window.g_serv_taken = ');
_p(serv_taken);
__p.push(';window.g_start_time = +new Date();</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'g-err','g-component'], true));
__p.push('<scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
<link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
</head>\r\n\
<body cz-shortcut-listen="true">');

return __p.join("");
},

'baseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/act/qqvip/config.js?v140320"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\',\'common\', \'index\'], function($, lib, common, index) {\r\n\
        var qqvip = index.get(\'./qqvip\');\r\n\
        qqvip.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    var pvClickSend = function (tag) {\r\n\
        if (typeof(pgvSendClick) == "function") {\r\n\
            pgvSendClick({\r\n\
                hottag: tag,\r\n\
                virtualDomain: \'www.weiyun.com\'\r\n\
            });\r\n\
        }\r\n\
    };\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/mobile/act/qqvip.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
_p(require('weiyun/util/inline').css(['app-qq-privilege'], true));
__p.push('<div id="container" class="app-qq-privilege">\r\n\
    <div class="hd">\r\n\
        <div class="inner"></div>\r\n\
    </div>\r\n\
    <div class="bd">\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-privilege"></div>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="privilege-list clearfix">\r\n\
                    <li class="item speed">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>尊享极速传输</span></div>\r\n\
                        <div class="description"><span>普通用户无加速</span></div>\r\n\
                    </li>\r\n\
                    <li class="item single">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>单文件最大20G</span></div>\r\n\
                        <div class="description"><span>普通用户1G</span></div>\r\n\
                    </li>\r\n\
                    <li class="item capacity">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>储存空间4T</span></div>\r\n\
                        <div class="description"><span>普通用户10G</span></div>\r\n\
                    </li>\r\n\
                    <li class="item more-privilege">\r\n\
                        <div data-action="more_privilege" class="btn" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.morePrivilege\');"><span>更多特权</span></div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-open"></div>\r\n\
                <p class="text">首次开通1个月微云会员享受历史超低价</p>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="price-list open">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-super-vip"></i>\r\n\
                                <span class="inner">超级会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="svip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.svip.pay\');"></i><span>现在开通</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-qq-vip"></i>\r\n\
                                <span class="inner">QQ会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="vip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.vip.pay\');"></i><span>现在开通</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-renewals"></div>\r\n\
                <p class="text">续费微云会员还可享受专属折扣</p>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="price-list renewals">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-super-vip"></i>\r\n\
                                <span class="inner">超级会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="svip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.svip.repay\');"></i><span>续费</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-qq-vip"></i>\r\n\
                                <span class="inner">QQ会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="vip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.vip.repay\');"></i><span>续费</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-rule"></div>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="rule-list">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">1</span>\r\n\
                            <p class="content">本活动只针对超级会员或QQ会员。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">2</span>\r\n\
                            <p class="content">首次开通1个月微云会员可享受1元或3元超低特价，续费微云会员可享受专属折扣7.5折或8.5折。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">3</span>\r\n\
                            <p class="content">仅限通过本页面进行开通/续费微云会员，才享受优惠价。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">4</span>\r\n\
                            <p class="content">禁止违规刷取及多次超低价开通微云会员的行为，否则将会被取消非法获得的微云会员资格。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">5</span>\r\n\
                            <p class="content">优惠价开通微云会员的时长不得高于用户当前QQ会员/超级会员的有效期。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">6</span>\r\n\
                            <p class="content">若用户QQ会员时长大于超级会员时长，本活动页面会只判断用户的超级会员身份，所有购买资格按超级会员身份判断。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">7</span>\r\n\
                            <p class="content">手机渠道开通会员的用户不能参与此次活动。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">8</span>\r\n\
                            <p class="content">开通QQ会员/超级会员：<a href="javascript:void(0)" data-action="pay_qq_vip" class="more" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.topayqqvip\');">点击进入&gt;&gt;</a></p>\r\n\
                            <p class="content">前往微云官网：<a href="//www.weiyun.com/" class="more" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.towy\');">点击进入&gt;&gt;</a></p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">9</span>\r\n\
                            <p class="content">腾讯保留在法律允许的范围内对活动规则进行解释的权利。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
    <div class="ft">\r\n\
        <p class="inner"><a href="https://www.tencent.com/" target="_blank">关于腾讯</a>|<a href="https://www.weiyun.com/mobile/xy.html" target="_blank">服务条款</a>|<a href="https://service.qq.com/" target="_blank">客服中心</a>|<a href="#">电脑版</a></p>\r\n\
        <p class="inner">Copyright © 1998-2016 Tencent. All Rights Reserved.</p>\r\n\
        <p class="inner">腾讯公司&nbsp;版权所有</p>\r\n\
    </div>\r\n\
    <div class="bg">\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_fail" class="reload-wrap">\r\n\
        <a href="#" class="reload-btn" title="重新加载">\r\n\
            <div class="reload-btn-box">\r\n\
                <div class="reload-btn-wrap">\r\n\
                    <i class="icon icon-reload"></i>\r\n\
                    <p class="reload-txt">');
_p(data.msg);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </a>\r\n\
    </div>');

return __p.join("");
},

'webBaseHeader': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

    var serv_taken = new Date() - window.serv_start_time;
    var APPID = require('weiyun/util/appid')();
    var serverConfig = plug('config') || {};
    var is_test_env = !!serverConfig.isTest;
    __p.push('    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>QQ会员微云特权</title>\r\n\
        <meta http-equiv="Content-Language" content="zh-cn">\r\n\
        <meta name="author" content="Tencent-ISUX">\r\n\
        <meta name="Copyright" content="Tencent">\r\n\
	    <meta itemprop="name" content="腾讯微云" />\r\n\
	    <meta itemprop="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。" />\r\n\
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />');

            var g_info = window['g_weiyun_info'];
        __p.push('<scr');
__p.push('ipt>var IS_TEST_ENV = ');
_p(is_test_env);
__p.push('; var IS_MOBILE = ');
_p(g_info.is_mobile);
__p.push('; window.APPID = ');
_p(APPID);
__p.push(';window.g_serv_taken = ');
_p(serv_taken);
__p.push(';window.g_start_time = +new Date();</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
<link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
</head>\r\n\
<body cz-shortcut-listen="true">');

return __p.join("");
},

'webBaseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/act/qqvip/config.js?v140320"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" charset="utf-8" src="//fusion.qq.com/fusion_loader?appid=1450007296&platform=qzone"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\',\'common\', \'index\'], function($, lib, common, index) {\r\n\
        var qqvip = index.get(\'./qqvip\');\r\n\
        qqvip.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    var pvClickSend = function (tag) {\r\n\
        if (typeof(pgvSendClick) == "function") {\r\n\
            pgvSendClick({\r\n\
                hottag: tag,\r\n\
                virtualDomain: \'www.weiyun.com\'\r\n\
            });\r\n\
        }\r\n\
    };\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/web/act/qqvip.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
},

'webBody': function(data){

var __p=[],_p=function(s){__p.push(s)};
_p(require('weiyun/util/inline').css(['qq-privilege'], true));
__p.push('<div id="container" class="qq-privilege">\r\n\
    <div class="hd">\r\n\
        <div class="inner"></div>\r\n\
    </div>\r\n\
    <div class="bd">\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-privilege"></div>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <!-- 滑动到该区域时添加.show -->\r\n\
                <ul class="privilege-list clearfix show">\r\n\
                    <li class="item speed">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>尊享极速传输</span></div>\r\n\
                        <div class="description"><span>普通用户无加速</span></div>\r\n\
                    </li>\r\n\
                    <li class="item single">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>单文件最大20G</span></div>\r\n\
                        <div class="description"><span>普通用户1G</span></div>\r\n\
                    </li>\r\n\
                    <li class="item capacity">\r\n\
                        <div class="pic"></div>\r\n\
                        <div class="title"><span>储存空间4T</span></div>\r\n\
                        <div class="description"><span>普通用户10G</span></div>\r\n\
                    </li>\r\n\
                    <li class="item more-privilege">\r\n\
                        <a href="javascript:void(0)" data-action="more_privilege" class="btn" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.morePrivilege\');">更多特权</a>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-open"></div>\r\n\
                <p class="text">首次开通1个月微云会员享受历史超低价</p>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="price-list open clearfix">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-super-vip"></i>\r\n\
                                <span class="inner">超级会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price price1">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="svip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.svip.pay\');"></i><span>现在开通</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-qq-vip"></i>\r\n\
                                <span class="inner">QQ会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price price2">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="vip" class="btn" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.vip.pay\');"><i class="icon icon-wy"></i><span>现在开通</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-renewals"></div>\r\n\
                <p class="text">续费微云会员还可享受专属折扣</p>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="price-list renewals clearfix">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-super-vip"></i>\r\n\
                                <span class="inner">超级会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price price3">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="svip" class="btn" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.svip.repay\');"><i class="icon icon-wy"></i><span>续费</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <h5 class="title">\r\n\
                                <i class="icon icon-qq-vip"></i>\r\n\
                                <span class="inner">QQ会员专享价</span>\r\n\
                            </h5>\r\n\
                            <div class="price price4">\r\n\
                                <div class="now"></div>\r\n\
                                <div class="before"></div>\r\n\
                            </div>\r\n\
                            <div data-action="pay" data-id="vip" class="btn"><i class="icon icon-wy" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.vip.repay\');"></i><span>续费</span></div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="inner-rule"></div>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="rule-list">\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">1</span>\r\n\
                            <p class="content">本活动只针对超级会员或QQ会员。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">2</span>\r\n\
                            <p class="content">首次开通1个月微云会员可享受1元或3元超低特价，续费微云会员可享受专属折扣7.5折或8.5折。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">3</span>\r\n\
                            <p class="content">仅限通过本页面进行开通/续费微云会员，才享受优惠价。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">4</span>\r\n\
                            <p class="content">禁止违规刷取及多次超低价开通微云会员的行为，否则将会被取消非法获得的微云会员资格。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">5</span>\r\n\
                            <p class="content">优惠价开通微云会员的时长不得高于用户当前QQ会员/超级会员的有效期。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">6</span>\r\n\
                            <p class="content">若用户QQ会员时长大于超级会员时长，本活动页面会只判断用户的超级会员身份，所有购买资格按超级会员身份判断。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">7</span>\r\n\
                            <p class="content">手机渠道开通会员的用户不能参与此次活动。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">8</span>\r\n\
                            <p class="content">开通QQ会员/超级会员：<a href="javascript:void(0)" data-action="pay_qq_vip" class="more" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.topayqqvip\');">点击进入&gt;&gt;</a></p>\r\n\
                            <p class="content">前往微云官网：<a href="//www.weiyun.com/" class="more" onclick="javascript:pvClickSend(\'weiyun.act.qqvip.towy\');">点击进入&gt;&gt;</a></p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="wrap">\r\n\
                            <span class="num">9</span>\r\n\
                            <p class="content">腾讯保留在法律允许的范围内对活动规则进行解释的权利。</p>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
    <div class="ft">\r\n\
        <p class="inner"><a href="https://www.tencent.com/" target="_blank">关于腾讯</a>|<a href="https://www.weiyun.com/xy.html" target="_blank">服务条款</a>|<a href="https://service.qq.com/" target="_blank">客服中心</a>|<a href="#">电脑版</a></p>\r\n\
        <p class="inner">Copyright © 1998-2016 Tencent. All Rights Reserved.</p>\r\n\
        <p class="inner">腾讯公司&nbsp;版权所有</p>\r\n\
    </div>\r\n\
    <div class="bg">\r\n\
    </div>\r\n\
    <!-- 错误提示弹层 S -->\r\n\
    <div class="error-dialog" style="display: none">\r\n\
        <i class="icon icon-error"></i>\r\n\
        <p class="text">开通微云会员的时常不能高于用户当前QQ会员和超级会员的有效期</p>\r\n\
    </div>\r\n\
    <!-- 错误提示弹层 E -->\r\n\
</div>');

return __p.join("");
},

'webError': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_fail" class="reload-wrap">\r\n\
        <a href="#" class="reload-btn" title="重新加载">\r\n\
            <div class="reload-btn-box">\r\n\
                <div class="reload-btn-wrap">\r\n\
                    <i class="icon icon-reload"></i>\r\n\
                    <p class="reload-txt">');
_p(data.msg);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </a>\r\n\
    </div>');

return __p.join("");
},

'login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['qq-privilege'], true));
__p.push('    <div id="container" class="qq-privilege">\r\n\
        <div class="hd">\r\n\
            <div class="inner"></div>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
            <div class="box">\r\n\
                <div class="box-hd">\r\n\
                    <div class="inner-privilege"></div>\r\n\
                </div>\r\n\
                <div class="box-bd">\r\n\
                    <!-- 滑动到该区域时添加.show -->\r\n\
                    <ul class="privilege-list clearfix show">\r\n\
                        <li class="item speed">\r\n\
                            <div class="pic"></div>\r\n\
                            <div class="title"><span>尊享极速传输</span></div>\r\n\
                            <div class="description"><span>普通用户无加速</span></div>\r\n\
                        </li>\r\n\
                        <li class="item single">\r\n\
                            <div class="pic"></div>\r\n\
                            <div class="title"><span>单文件最大20G</span></div>\r\n\
                            <div class="description"><span>普通用户1G</span></div>\r\n\
                        </li>\r\n\
                        <li class="item capacity">\r\n\
                            <div class="pic"></div>\r\n\
                            <div class="title"><span>储存空间4T</span></div>\r\n\
                            <div class="description"><span>普通用户10G</span></div>\r\n\
                        </li>\r\n\
                        <li class="item more-privilege">\r\n\
                            <a href="javascript:void(0)" data-action="more_privilege" class="btn">更多特权</a>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="box">\r\n\
                <div class="box-hd">\r\n\
                    <div class="inner-open"></div>\r\n\
                    <p class="text">首次开通1个月微云会员享受历史超低价</p>\r\n\
                </div>\r\n\
                <div class="box-bd">\r\n\
                    <ul class="price-list open clearfix">\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <h5 class="title">\r\n\
                                    <i class="icon icon-super-vip"></i>\r\n\
                                    <span class="inner">超级会员专享价</span>\r\n\
                                </h5>\r\n\
                                <div class="price price1">\r\n\
                                    <div class="now"></div>\r\n\
                                    <div class="before"></div>\r\n\
                                </div>\r\n\
                                <div data-action="pay" data-id="svip" class="btn"><i class="icon icon-wy"></i><span>现在开通</span></div>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <h5 class="title">\r\n\
                                    <i class="icon icon-qq-vip"></i>\r\n\
                                    <span class="inner">QQ会员专享价</span>\r\n\
                                </h5>\r\n\
                                <div class="price price2">\r\n\
                                    <div class="now"></div>\r\n\
                                    <div class="before"></div>\r\n\
                                </div>\r\n\
                                <div data-action="pay" data-id="vip" class="btn"><i class="icon icon-wy"></i><span>现在开通</span></div>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="box">\r\n\
                <div class="box-hd">\r\n\
                    <div class="inner-renewals"></div>\r\n\
                    <p class="text">续费微云会员还可享受专属折扣</p>\r\n\
                </div>\r\n\
                <div class="box-bd">\r\n\
                    <ul class="price-list renewals clearfix">\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <h5 class="title">\r\n\
                                    <i class="icon icon-super-vip"></i>\r\n\
                                    <span class="inner">超级会员专享价</span>\r\n\
                                </h5>\r\n\
                                <div class="price price3">\r\n\
                                    <div class="now"></div>\r\n\
                                    <div class="before"></div>\r\n\
                                </div>\r\n\
                                <div data-action="pay" data-id="svip" class="btn"><i class="icon icon-wy"></i><span>续费</span></div>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <h5 class="title">\r\n\
                                    <i class="icon icon-qq-vip"></i>\r\n\
                                    <span class="inner">QQ会员专享价</span>\r\n\
                                </h5>\r\n\
                                <div class="price price4">\r\n\
                                    <div class="now"></div>\r\n\
                                    <div class="before"></div>\r\n\
                                </div>\r\n\
                                <div data-action="pay" data-id="vip" class="btn"><i class="icon icon-wy"></i><span>续费</span></div>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="box">\r\n\
                <div class="box-hd">\r\n\
                    <div class="inner-rule"></div>\r\n\
                </div>\r\n\
                <div class="box-bd">\r\n\
                    <ul class="rule-list">\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">1</span>\r\n\
                                <p class="content">本活动只针对超级会员或QQ会员。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">2</span>\r\n\
                                <p class="content">首次开通1个月微云会员可享受1元或3元超低特价，续费微云会员可享受专属折扣7.5折或8.5折。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">3</span>\r\n\
                                <p class="content">仅限通过本页面进行开通/续费微云会员，才享受优惠价。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">4</span>\r\n\
                                <p class="content">禁止违规刷取及多次超低价开通微云会员的行为，否则将会被取消非法获得的微云会员资格。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">5</span>\r\n\
                                <p class="content">优惠价开通微云会员的时长不得高于用户当前QQ会员/超级会员的有效期。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">6</span>\r\n\
                                <p class="content">若用户QQ会员时长大于超级会员时长，本活动页面会只判断用户的超级会员身份，所有购买资格按超级会员身份判断。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">7</span>\r\n\
                                <p class="content">手机渠道开通会员的用户不能参与此次活动。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">8</span>\r\n\
                                <p class="content">开通QQ会员/超级会员：<a href="javascript:void(0)" data-action="pay_qq_vip" class="more">点击进入&gt;&gt;</a></p>\r\n\
                                <p class="content">前往微云官网：<a href="//www.weiyun.com/" class="more">点击进入&gt;&gt;</a></p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                        <li class="item">\r\n\
                            <div class="wrap">\r\n\
                                <span class="num">9</span>\r\n\
                                <p class="content">腾讯保留在法律允许的范围内对活动规则进行解释的权利。</p>\r\n\
                            </div>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
        </div>\r\n\
        <div class="ft">\r\n\
            <p class="inner"><a href="https://www.tencent.com/" target="_blank">关于腾讯</a>|<a href="https://www.weiyun.com/xy.html" target="_blank">服务条款</a>|<a href="https://service.qq.com/" target="_blank">客服中心</a>|<a href="#">电脑版</a></p>\r\n\
            <p class="inner">Copyright © 1998-2016 Tencent. All Rights Reserved.</p>\r\n\
            <p class="inner">腾讯公司&nbsp;版权所有</p>\r\n\
        </div>\r\n\
        <div class="bg">\r\n\
        </div>\r\n\
    </div>\r\n\
    <scr');
__p.push('ipt src="//imgcache.qq.com/c/=/club/weiyun/js/publics/jquery/jquery-1.8.3.min.js?max_age=604800"></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['configs_web']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\', \'common\', \'qq_login\', \'outlink_v2\'], function ($, lib, common, qq_login_mod, outlink_v2) {\r\n\
            var cookie = lib.get(\'./cookie\'),\r\n\
                    request = common.get(\'./request\'),\r\n\
                    session_event = common(\'./global.global_event\').namespace(\'session\'),\r\n\
                    outlink = outlink_v2.get(\'./login\'),\r\n\
                    qq_login = qq_login_mod.get(\'./qq_login\'),\r\n\
                    query_user = common.get(\'./query_user\');\r\n\
            var uin = cookie.get(\'uin\'),\r\n\
                skey = cookie.get(\'skey\'),\r\n\
                me = this;\r\n\
            //弹出登录框\r\n\
            document.domain = \'weiyun.com\';\r\n\
            $(\'#container\').on(\'click\', \'[data-action]\', function(e) {\r\n\
                login();\r\n\
            });\r\n\
\r\n\
            function login() {\r\n\
                var qq_login_ui = qq_login.ui;\r\n\
\r\n\
                outlink.stopListening(qq_login)\r\n\
                        .stopListening(qq_login_ui)\r\n\
                        .listenTo(qq_login, \'qq_login_ok\', function () {\r\n\
                            console.log(\'qq_login_ok\');\r\n\
                        })\r\n\
                        .listenToOnce(qq_login_ui, \'show\', function () {\r\n\
                            console.log(\'show\');\r\n\
                        })\r\n\
                        .listenToOnce(qq_login_ui, \'hide\', function () {\r\n\
                            console.log(\'hide\');\r\n\
                            outlink.stopListening(qq_login_ui);\r\n\
                            location.href = \'https://jump.weiyun.qq.com/?from=3014\';\r\n\
                        });\r\n\
\r\n\
                qq_login.show();\r\n\
            }\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        var pvClickSend = function (tag) {\r\n\
            if (typeof(pgvSendClick) == "function") {\r\n\
                pgvSendClick({\r\n\
                    hottag: tag,\r\n\
                    virtualDomain: \'www.weiyun.com\'\r\n\
                });\r\n\
            }\r\n\
        };\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/mobile/act/qqvip.html\',\r\n\
                    virtualDomain: "www.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>\r\n\
</body>\r\n\
</html>');

return __p.join("");
}
};
return tmpl;
});
