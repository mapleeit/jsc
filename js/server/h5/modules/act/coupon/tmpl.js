
//tmpl file list:
//coupon/src/mobile/body.tmpl.html
//coupon/src/web/body.tmpl.html
define("club/weiyun/js/server/h5/modules/act/coupon/tmpl",["weiyun/util/appid","weiyun/util/prettysize","weiyun/util/dateformat","weiyun/util/inline","weiyun/util/payAids","weiyun/web/modules/footer/tmpl"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};

var server_taken = new Date() - window.serv_start_time;
var APPID = require('weiyun/util/appid')();
var server_config = plug('config') || {};
var is_test_env = !!server_config.isTest;

var prettysize = require('weiyun/util/prettysize'),
    dateformat = require('weiyun/util/dateformat');
var data = data || {};
var validCouponList = data.validCouponList || [];
var invalidCouponList = data.invalidCouponList || [];
__p.push('\r\n\
<scr');
__p.push('ipt>\r\n\
    var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';\r\n\
    window.IS_MOBILE = ');
_p(window['g_weiyun_info'].is_mobile);
__p.push(';\r\n\
    window.APPID = ');
_p(APPID);
__p.push(';\r\n\
    window.g_serv_taken = ');
_p(server_taken);
__p.push(';\r\n\
    window.g_start_time = +new Date();\r\n\
</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').css(['app-act-flow']));
_p(require('weiyun/util/inline').css(['g-err','g-component']));
__p.push('\r\n\
<scr');
__p.push('ipt>\r\n\
    window.g_css_time = +new Date();\r\n\
    document.domain=\'weiyun.com\';\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
\r\n\
<div class="app-act-flow j-container">\r\n\
    <!-- 头部 s -->\r\n\
    <div class="hd">\r\n\
        <div class="title"></div>\r\n\
        <div class="head-banner"></div>\r\n\
    </div>\r\n\
    <!-- 头部 e -->\r\n\
    <div class="bd">\r\n\
        <div class="box j-buy-box" style="display: none;">\r\n\
            <div class="box-hd">\r\n\
                <h2 class="title"><span class="inner">购买流量券 当日文件任性传</span></h2>\r\n\
            </div>\r\n\
\r\n\
            <div class="box-bd buy-box">\r\n\
  				<div class="item-ticket buy">\r\n\
                    <div class="main">\r\n\
                        <div class="tip"><span class="inner">24小时流量券</span></div>\r\n\
                        <div class="flow"><span class="num-100g"></span></div>\r\n\
                        <!-- 2705（购买100G流量券） 2704（购买无限流量券）-->\r\n\
                        <div class="btn" data-action="buy_coupon" data-coupon-type="2705"><span>10元购买</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="item-ticket buy">\r\n\
                    <div class="main">\r\n\
                        <div class="tip"><span class="inner">24小时流量券</span></div>\r\n\
                        <div class="flow"><span class="num-unlimited"></span></div>\r\n\
                        <div class="btn" data-action="buy_coupon" data-coupon-type="2704"><span>30元购买</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
  			</div>\r\n\
        </div>');
if (validCouponList.length || invalidCouponList.length) {__p.push('        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <h2 class="title"><span class="inner">我的流量券</span></h2>\r\n\
            </div>\r\n\
            <div class="box-bd">');

                    for (let i = 0; i < validCouponList.length; i++) {
                        let item = validCouponList[i];
                        let statusClass = item.flow_coupon_status == 1 ? 'use' : 'hasuse';
                __p.push('                <div data-coupon-id="');
_p(item.flow_coupon_id);
__p.push('" class="item-ticket ');
_p(statusClass);
__p.push('">\r\n\
                    <div class="main">\r\n\
                        <div class="flow"><span class="num-');
_p(item.flow_coupon_type == 0 ? '100g' : 'unlimited');
__p.push('"></span></div>\r\n\
                        <div class="tip"><span class="inner">24小时流量券</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <div ');
if (item.flow_coupon_status == 1) {__p.push('data-action="use_coupon"');
}__p.push(' class="btn">\r\n\
                            <span>');
_p(item.flow_coupon_status == 1 ? '立即使用' : '已使用');
__p.push('</span>\r\n\
                        </div>\r\n\
                        <p class="txt">');
 if (item.flow_coupon_status == 1) {__p.push('                            点击立即使用后<br>仅24小时内有效');
} else {__p.push('                                <span class="date">');
_p(dateformat(item.use_time + item.ttl, 'mm-dd HH:MM'));
__p.push('</span>前有效<br/>之后流量会失效');
}__p.push('                        </p>\r\n\
                    </div>\r\n\
                </div>');

                    }
                    for (let i = 0; i < invalidCouponList.length; i++) {
                        let item = invalidCouponList[i];
                __p.push('                <div class="item-ticket fail"><!-- 失效的券加.fail -->\r\n\
                    <div class="main">\r\n\
                        <div class="flow"><span class="num-');
_p(item.flow_coupon_type == 0 ? '100g' : 'unlimited');
__p.push('"></span></div>\r\n\
                        <div class="tip"><span class="inner">24小时流量券</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <div class="btn"><span>已使用</span></div>\r\n\
                        <p class="txt">已在<span class="date">');
_p(dateformat(item.use_time, 'mm-dd HH:MM'));
__p.push('</span>使用后失效</p>\r\n\
                    </div>\r\n\
                </div>');

                    }
                __p.push('            </div>\r\n\
        </div>');
}__p.push('\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <h2 class="title"><span class="inner">活动说明</span></h2>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="rule-list">\r\n\
                    <li class="item-rule"><i class="icon icon-point"></i><p class="txt">24小时流量券是在当前流量的基础上叠加使用。自点击“立即使用”起24小时内有效。超过24小时，流量券自动失效。</p></li>\r\n\
                    <li class="item-rule"><i class="icon icon-point"></i><p class="txt">无限量流量券可在24小时内无限上传（注：可上传流量小于等于您的微云空间总剩余容量），请根据使用情况酌情购买。</p></li>\r\n\
                    <li class="item-rule"><i class="icon icon-point"></i><p class="txt">购买后未使用的流量券将在2016年12月31日后失效。</p></li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
<div class="ft">\r\n\
    <p class="inner"><a href="http://www.tencent.com/">关于腾讯</a>|<a href="http://www.weiyun.com/mobile/xy.html">服务条款</a>|<a href="http://service.qq.com/">客服中心</a></p>\r\n\
    <p class="inner">Copyright © 1998-');
_p((new Date()).getFullYear());
__p.push(' Tencent. All Rights Reserved.</p>\r\n\
    <p class="inner">腾讯公司 版权所有</p>\r\n\
</div>\r\n\
</div>\r\n\
\r\n\
\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/act/coupon/config.js?v160822"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\', \'common\', \'index\'], function($, lib, common, index){\r\n\
        var coupon = index.get(\'./coupon\');\r\n\
        coupon.render(');
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
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/mobile/act/coupon.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
},

'web_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>');

        var server_taken = new Date() - window.serv_start_time;
        var APPID = require('weiyun/util/appid')();
        var server_config = plug('config') || {};
        var is_test_env = !!server_config.isTest;
        var AID = require('weiyun/util/payAids').get('web.mac');

        var prettysize = require('weiyun/util/prettysize'),
        dateformat = require('weiyun/util/dateformat');
        var data = data || {};
        var validCouponList = data.validCouponList || [];
        var invalidCouponList = data.invalidCouponList || [];
    __p.push('\r\n\
    <html>\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>页面标题</title>\r\n\
        <meta name="keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web">\r\n\
        <meta name="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。">\r\n\
	    <meta itemprop="name" content="腾讯微云" />\r\n\
	    <meta itemprop="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间,同步文件、推送照片和传输数据。" />\r\n\
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />\r\n\
	    <link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
\r\n\
    <scr');
__p.push('ipt>\r\n\
        var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';\r\n\
        window.IS_MOBILE = ');
_p(window['g_weiyun_info'].is_mobile);
__p.push(';\r\n\
        window.APPID = ');
_p(APPID);
__p.push(';\r\n\
        window.AID = \'');
_p(AID);
__p.push('\';\r\n\
        window.g_serv_taken = ');
_p(server_taken);
__p.push(';\r\n\
        window.g_start_time = +new Date();\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    <!--');
_p(require('weiyun/util/inline').css(['page-vip-flow'], true));
__p.push('-->\r\n\
    <link rel="stylesheet" href="//qzonestyle.gtimg.cn/qz-proj/wy-pc/css/page-vip-flow.css">\r\n\
    <scr');
__p.push('ipt>\r\n\
        window.g_css_time = +new Date();\r\n\
        document.domain=\'weiyun.com\';\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    </head>\r\n\
<body>\r\n\
\r\n\
<div class="wy-vip-wrapper vip-flow j-container">\r\n\
    <!-- 页面头部 s -->\r\n\
    <div class="wy-hd clearfix">');

            var userInfo = data.userInfo || {},
                weiyunVipInfo = userInfo.weiyun_vip_info || {};
            var nickname = userInfo.nick_name,
                isVip = weiyunVipInfo.weiyun_vip,
                isOldVip = weiyunVipInfo.old_weiyun_vip,
                avatar = userInfo.head_img_url,
                vipLogoURL = weiyunVipInfo.weiyun_vip_img_url,
                vipLevelInfo = weiyunVipInfo.weiyun_vip_level_info,
                expiresDate = weiyunVipInfo.weiyun_end_time?
                        weiyunVipInfo.weiyun_end_time + '到期' : (isVip? '按月支付中' : ''),
                posText = (isVip || isOldVip)? '续费' : '开通会员',
                iconClass = isVip? 'ico ico-vip-m' : 'ico-novip-m';

            var is_login = !!userInfo.nick_name;
        __p.push('\r\n\
        <!-- 用户信息 S -->\r\n\
        <div class="wy-acct">\r\n\
            <div class="acct">');
 if(is_login) { __p.push('                <!-- 头像 -->\r\n\
                <div class="avatar-wrapper">\r\n\
                    <img src="');
_p(avatar);
__p.push('" alt="" class="avatar">');

                        if(isVip || isOldVip) {
                            var vip_logo_url = vipLogoURL.replace(/^http:|^https:/, '').replace('.png', 'M@2x.png');
                    __p.push('                    <i class="icon icon-vip" style="background-image:url(');
_p(vip_logo_url);
__p.push(')">LV5</i>');
 } __p.push('                </div>\r\n\
                <!-- 账号信息 -->\r\n\
                <div class="info-wrapper">\r\n\
                    <p class="name">');
_p(nickname);
__p.push('</p>');
if(isVip){ __p.push('                    <p class="time">');
_p(expiresDate);
__p.push('</p>');
 } else if(isOldVip) { __p.push('                    <p class="time">会员已到期</p>');
 } else { __p.push('                    <p class="time">未开通会员</p>');
 } __p.push('                </div>\r\n\
                <!-- 退出 -->\r\n\
                <div class="logout-wrapper">\r\n\
                    <button class="btn-icon icon-logout-s" data-action="logout">退出</button>\r\n\
                </div>\r\n\
                <button class="btn btn-outline" data-action="pay" data-id="3" onclick="pvClickSend(\'weiyun.vip.coupon.paybtn3\')">');
_p(posText);
__p.push('</button>');
 } else { __p.push('                <button class="btn btn-fill" data-action="login">登录</button>');
 } __p.push('            </div>\r\n\
        </div>\r\n\
        <!-- 用户信息 E -->\r\n\
\r\n\
        <div class="wy-hd-inner clearfix">\r\n\
            <div class="logo"><a href="http://www.weiyun.com/" title="微云会员">微云会员</a></div>\r\n\
            <ul class="nav">\r\n\
                <!-- [ATTENTION!!] 选中态，添加 .act -->\r\n\
                <li class="item"><a href="//www.weiyun.com/vip/weiyun_vip.html?from=');
_p(data.source);
__p.push('">首页</a></li>\r\n\
                <li class="item"><a href="//www.weiyun.com/vip/privilege.html?from=');
_p(data.source);
__p.push('">特权介绍</a></li>\r\n\
                <li class="item"><a href="//www.weiyun.com/vip/growth.html?from=');
_p(data.source);
__p.push('">成长体系</a></li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 页面头部 e -->\r\n\
\r\n\
    <!-- 页面内容 s -->\r\n\
    <div class="wy-bd">\r\n\
        <div class="cont-hd">\r\n\
            <h1 class="title">微云流量升级啦</h1>\r\n\
        </div>\r\n\
\r\n\
        <div class="cont-bd">\r\n\
            <div class="flow-block flow-buy">\r\n\
                <div class="inner-hd">购买流量券 文件任性传</div>\r\n\
                <div class="inner-bd">\r\n\
                    <ul>\r\n\
                        <li class="item ticket-buy-100">24小时100G流量券\r\n\
                            <button class="btn btn-buy" data-action="buy_coupon" data-coupon-type="2705">10元购买</button>\r\n\
                        </li>\r\n\
                        <li class="item ticket-buy-infinite">24小时无限流量券\r\n\
                            <button class="btn btn-buy" data-action="buy_coupon" data-coupon-type="2704">30元购买</button>\r\n\
                        </li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>');
if (validCouponList.length || invalidCouponList.length) {__p.push('            <div class="flow-block flow-use">\r\n\
                <div class="inner-hd">我的流量券</div>\r\n\
                <div class="inner-bd">\r\n\
                    <ul>');

                        for (let i = 0; i < validCouponList.length; i++) {
                            let item = validCouponList[i];
                            let statusClass = item.flow_coupon_status == 1 ? '' : 'using';
                    __p.push('                        <!-- [ATTENTION!!] 使用中添加 .using，过期添加 .useless，不需要隐藏原有结构 -->\r\n\
                        <li class="item ticket-use-');
_p(item.flow_coupon_type == 0 ? '100' : 'infinite');
__p.push(' ');
_p(statusClass);
__p.push('"  data-coupon-id="');
_p(item.flow_coupon_id);
__p.push('">');
 if (item.flow_coupon_status == 1) {__p.push('                            <div class="exp not-used" data-action="use_coupon">\r\n\
                                <button class="btn btn-use">立即使用</button>\r\n\
                                <p class="txt">点击立即使用后</p>\r\n\
                                <p class="txt">仅24小时内有效</p>\r\n\
                            </div>');
 } else { __p.push('                            <div class="exp used">\r\n\
                                <p class="tag">已使用</p>\r\n\
                                <p class="txt"><strong>');
_p(dateformat(item.use_time + item.ttl, 'mm-dd HH:MM'));
__p.push('</strong>前有效</p>\r\n\
                                <p class="txt">之后流量会失效</p>\r\n\
                            </div>');
 } __p.push('                        </li>');

                        }
                        for (let i = 0; i < invalidCouponList.length; i++) {
                            let item = invalidCouponList[i];
                    __p.push('                        <li class="item ticket-use-');
_p(item.flow_coupon_type == 0 ? '100' : 'infinite');
__p.push(' useless" data-coupon-id="');
_p(item.flow_coupon_id);
__p.push('">');
 if (item.flow_coupon_status == 1) {__p.push('                            <div class="exp not-used">\r\n\
                                <button class="btn btn-use">立即使用</button>\r\n\
                                <p class="txt">点击立即使用后</p>\r\n\
                                <p class="txt">仅24小时内有效</p>\r\n\
                            </div>');
 } else { __p.push('                            <div class="exp used">\r\n\
                                <p class="tag">已使用</p>\r\n\
                                <p class="txt"><strong>');
_p(dateformat(item.use_time + item.ttl, 'mm-dd HH:MM'));
__p.push('</strong>前有效</p>\r\n\
                                <p class="txt">之后流量会失效</p>\r\n\
                            </div>');
 } __p.push('                        </li>');

                        }
                    __p.push('                    </ul>\r\n\
                </div>\r\n\
            </div>');

                }
            __p.push('            <div class="flow-block flow-txt">\r\n\
                <div class="inner-hd">活动说明</div>\r\n\
                <div class="inner-bd">\r\n\
                    <ul class="list">\r\n\
                        <li class="item">24小时流量券是在当前流量的基础上叠加使用。自点击“立即使用”起24小时内有效。超过24小时，流量券自动失效。</li>\r\n\
                        <li class="item">无限量流量券可在24小时内无限上传（注：可上传流量小于等于您的微云空间总剩余容量），请根据使用情况酌情购买。</li>\r\n\
                        <li class="item">购买后未使用的流量券将在2016年12月31日后失效。</li>\r\n\
                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 页面内容 e -->');
_p(require('weiyun/web/modules/footer/tmpl').footer());
__p.push('\r\n\
</div>\r\n\
\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/act/coupon/config.js?v160822"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" charset="utf-8" src="//fusion.qq.com/fusion_loader?appid=1450007296&platform=qzone"></scr');
__p.push('ipt>\r\n\
\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\', \'common\', \'index\'], function($, lib, common, index){\r\n\
        var coupon = index.get(\'./coupon\');\r\n\
        coupon.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
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
                virtualURL: \'/mobile/act/coupon.html\',\r\n\
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
