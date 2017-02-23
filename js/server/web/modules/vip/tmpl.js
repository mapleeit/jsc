
//tmpl file list:
//vip/src/capacity_purchase/capacity_purchase.tmpl.html
//vip/src/error.tmpl.html
//vip/src/footer.tmpl.html
//vip/src/grow/grow.tmpl.html
//vip/src/header.tmpl.html
//vip/src/main.tmpl.html
//vip/src/privilege/privilege.tmpl.html
//vip/src/reduce_capacity_announcement/announcement.tmpl.html
//vip/src/vip/wy_vip.tmpl.html
define("club/weiyun/js/server/web/modules/vip/tmpl",["weiyun/util/prettysize","weiyun/web/modules/footer/tmpl","weiyun/util/inline","weiyun/util/appid"],function(require, exports, module){
var tmpl = { 
'capacity_purchase_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var prettysize = require('weiyun/util/prettysize');
        var key, i, item, it, len;
        var is_login = !!data.is_login;
    __p.push('    ');
 if (is_login) { __p.push('    <!-- 剩余容量 -->\r\n\
    <div class="space">\r\n\
        <p class="txt">剩余</p>\r\n\
        <!-- [ATTENTION!!] 小于 1G，添加 .alert -->\r\n\
        <p class="num ');
_p( data.__remainSpace <= Math.pow(1024, 3) ? 'alert' : '');
__p.push('">');
_p(data.__remainSpaceText);
__p.push('</p>\r\n\
    </div>\r\n\
    <!-- 剩余容量构成 -->\r\n\
    <div class="figure-wrapper">');
 if (data.__isVip) {__p.push('        <p class="txt clearfix"><span class="exp">尊贵的会员专享初始容量3T <a href="javascript:void(0);" data-action="pay" class="link">续费会员</a></span>\r\n\
            总容量: ');
_p(data.__totalSpaceText);
__p.push('        </p>');
 } else { __p.push('        <p class="txt clearfix"><span class="exp">会员专享初始容量3T <a href="javascript:void(0);" data-action="pay" class="link">开通会员</a></span>\r\n\
            总容量: ');
_p(data.__totalSpaceText);
__p.push('        </p>');
 } __p.push('\r\n\
\r\n\
        <div class="figure" aria-hidden="true">');

            for (key in data.__spaceBarModel) {
                if (data.__spaceBarModel.hasOwnProperty(key)) {
            __p.push('            <div class="fig ');
_p(key);
__p.push('" style="');
_p(data.__spaceBarModel[key]);
__p.push('"></div>');
 }} __p.push('        </div>');

        for (key in data.__spaceDetailModel) {
            if (data.__spaceDetailModel.hasOwnProperty(key)) {
                item = data.__spaceDetailModel[key];
        __p.push('            ');

                // buy list
            if (Array.isArray(item)) {
            for (i = 0, len = item.length; i < len; i ++) {
                it = item[i];
            __p.push('            <p class="txt clearfix" ');
_p(it.show ? '' : 'style="display:none;"');
__p.push('>\r\n\
                <span class="exp">');
_p(it.expire);
__p.push('</span>\r\n\
                <i class="icon icon-tag-');
_p(key);
__p.push('"></i>');
_p(it.spaceText);
__p.push('            </p>');

                }
            } else { __p.push('            <p class="txt clearfix" ');
_p(item.show ? '' : 'style="display:none;"');
__p.push('>\r\n\
                <span class="exp">');
_p(item.expire);
__p.push('</span>\r\n\
                <i class="icon icon-tag-');
_p(key);
__p.push('"></i>');
_p(item.spaceText);
 if (key === 'regular') { __p.push('                <i class="icon icon-question">疑问\r\n\
                    <b class="mod-bubble-dropdown with-border top-left question-dropdown">\r\n\
                        <b class="txt-dropdown">\r\n\
                            <b>赠送容量在实行新的服务策略后对普通用户已取消，您是会员用户，我们将继续为您保留，感谢您对微云的支持。</b>\r\n\
                        </b>\r\n\
                        <b class="bubble-arrow-border"></b>\r\n\
                        <b class="bubble-arrow"></b>\r\n\
                    </b>\r\n\
                </i>');
 } __p.push('            </p>');
 } __p.push('        ');
 }} __p.push('    </div>');
 } __p.push('\r\n\
    <!-- 容量券购买 -->\r\n\
    <div class="ticket-wrapper">\r\n\
        <h1 class="txt">购买容量</h1>');

        for (i = 0, len = data.__buyListModel.length; i < len; i++ ) {
            item = data.__buyListModel[i];
        __p.push('        <ul class="list clearfix">');

            for (key in item) {
                if (item.hasOwnProperty(key)) {
                    it = item[key];
            __p.push('            <li class="ticket" data-type="');
_p(key);
__p.push('">\r\n\
                <div class="num-wrapper clearfix">\r\n\
                    <span class="num">');
_p(key);
__p.push('</span>\r\n\
                    <span class="cost"><strong>');
_p(it);
__p.push('</strong>元/年</span>\r\n\
                </div>\r\n\
                <button class="btn btn-outline j-purchase-btn" data-action="');
_p(is_login ? 'capacity_purchase' : 'login' );
__p.push('">立即购买</button>\r\n\
            </li>');
 }} __p.push('        </ul>');
 } __p.push('    </div>');

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

'footer': function(data){

var __p=[],_p=function(s){__p.push(s)};
_p(require('weiyun/web/modules/footer/tmpl').footer());
__p.push('<scr');
__p.push('ipt type="text/javascript" charset="utf-8" src="//imgcache.qq.com/bossweb/ipay/js/api/cashier.js"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" charset="utf-8" src="//fusion.qzone.qq.com/fusion_loader?appid=1450007296&platform=qzone"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_web_v2']));
__p.push('<scr');
__p.push('ipt>\r\n\
    seajs.use([\'$\', \'lib\', \'common\', \'vip\'], function($, lib, common, vip) {\r\n\
        var vip = vip.get(\'./vip\');\r\n\
        vip.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" src="//ui.ptlogin2.qq.com/js/ptloginout.js"></scr');
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
        var virtualURL;\r\n\
        if (window.location && /^\\/vip\\/growth.html$/.test(location.pathname)) {\r\n\
            virtualURL = \'/web/vip/growth.html\';\r\n\
            window.g_which_page = \'growth\';\r\n\
        } else if (window.location && /^\\/vip\\/privilege.html$/.test(location.pathname)) {\r\n\
            virtualURL = \'/web/vip/privilege.html\';\r\n\
            window.g_which_page = \'privilege\';\r\n\
        } else if (window.location && /^\\/vip\\/announcement.html$/.test(location.pathname)) {\r\n\
            virtualURL = \'/web/vip/announcement.html\';\r\n\
            window.g_which_page = \'announcement\';\r\n\
        } else {\r\n\
            virtualURL = \'/web/vip.html\';\r\n\
            window.g_which_page = \'vip\';\r\n\
        }\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: virtualURL,\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>');

return __p.join("");
},

'growth_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var is_login = !!data.is_login;

    if(is_login) {
        var nickname = data.nickname,
                isVip = data.isVip,
                __vipLevel = data.__vipLevel,
                isOldVip = data.oldVip,
                head_url = data.headUrl,
                aid = data.aid,
                expiresDate = data.expiresDate,
                posText = (isVip || isOldVip) ? '续费' : '开通会员',
                vipLevelInfo = data.vipLevelInfo,
                currentLevel = parseInt(vipLevelInfo.level),
                growthScoreList = data.growthScoreList,
                growthRate = Math.ceil(vipLevelInfo.current_score / growthScoreList[currentLevel + 1]);

        var growSpeed = vipLevelInfo.grow_speed > 0 ? vipLevelInfo.grow_speed : 0;
        var scoreNextLevel = currentLevel < 8 ? (growthScoreList[currentLevel + 1] - vipLevelInfo.current_score) : '';
        var upgradeDay = growSpeed != 0 ? Math.abs(Math.ceil(scoreNextLevel / growSpeed)) : 0;
        var growText = currentLevel < 8 ? '升级还需' + scoreNextLevel : '已达最高等级';
    }
    __p.push('\r\n\
    <!-- 页面内容 s -->\r\n\
    <div class="hd">\r\n\
        <!-- 当前等级为n,则加.now-level-0n -->\r\n\
        <div class="hd-path now-level-0');
_p(currentLevel);
__p.push('">\r\n\
            <div class="inner">\r\n\
                <div class="title-wrap">\r\n\
                    <h1 class="title">成长体系</h1>\r\n\
                    <h3 class="sub-title">成长值=每日成长值+开通成长值-非会员状态成长下降值</h3>\r\n\
                </div>');

                    if(is_login && currentLevel>0) {
                __p.push('                <div class="bubble">\r\n\
                    <div class="bubble-hd">\r\n\
                        <div class="avatar"><img src="');
_p(head_url);
__p.push('"></div>\r\n\
                        <div class="info"><span>当前等级 LV');
_p(currentLevel);
__p.push('</span></div>\r\n\
                    </div>\r\n\
                    <div class="bubble-bd clearfix">\r\n\
                        <div class="item">\r\n\
                            <h5 class="title">当前成长值</h5>\r\n\
                            <span class="num">');
_p(vipLevelInfo.current_score);
__p.push('</span>');
 if(growSpeed > 0) { __p.push('                            <span class="tip">+');
_p(growSpeed);
__p.push('点/天</span>');
 } __p.push('                        </div>\r\n\
                        <div class="item">\r\n\
                            <h5 class="title">升级还需</h5>\r\n\
                            <span class="num">');
_p(scoreNextLevel);
__p.push('</span>');
 if(upgradeDay > 0) { __p.push('                            <span class="tip">');
_p(upgradeDay);
__p.push('天</span>');
 } __p.push('                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <span class="point"></span>');
 } __p.push('            </div>\r\n\
        </div>\r\n\
        <ul class="level-list clearfix">\r\n\
            <li class="item level-01">\r\n\
                <div class="level"><span>lv1</span></div>\r\n\
                <div class="num"><span>0</span></div>\r\n\
            </li>\r\n\
            <li class="item level-02">\r\n\
                <div class="level"><span>lv2</span></div>\r\n\
                <div class="num"><span>600</span></div>\r\n\
            </li>\r\n\
            <li class="item level-03">\r\n\
                <div class="level"><span>lv3</span></div>\r\n\
                <div class="num"><span>1800</span></div>\r\n\
            </li>\r\n\
\r\n\
            <li class="item level-04">\r\n\
                <div class="level"><span>lv4</span></div>\r\n\
                <div class="num"><span>3600</span></div>\r\n\
            </li>\r\n\
            <li class="item level-05">\r\n\
                <div class="level"><span>lv5</span></div>\r\n\
                <div class="num"><span>6000</span></div>\r\n\
            </li>\r\n\
            <li class="item level-06">\r\n\
                <div class="level"><span>lv6</span></div>\r\n\
                <div class="num"><span>10000</span></div>\r\n\
            </li>\r\n\
            <li class="item level-07">\r\n\
                <div class="level"><span>lv7</span></div>\r\n\
                <div class="num"><span>20000</span></div>\r\n\
            </li>\r\n\
            <li class="item level-08">\r\n\
                <div class="level"><span>lv8</span></div>\r\n\
                <div class="num"><span>35000</span></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>\r\n\
    <div class="bd">\r\n\
        <div class="title-wrap">\r\n\
            <h1 class="title">每日成长速度</h1>\r\n\
            <h3 class="sub-title">用户会员过期后，成长值将以10点/天的速度下降</h3>\r\n\
        </div>\r\n\
        <div class="table">\r\n\
            <table>\r\n\
                <thead>\r\n\
                <tr>\r\n\
                    <th class="ctg"></th>\r\n\
                    <th>LV1-3</th>\r\n\
                    <th>LV4-6</th>\r\n\
                    <th>LV7-8</th>\r\n\
                </tr>\r\n\
                </thead>\r\n\
                <tbody>\r\n\
                <tr>\r\n\
                    <td>财付通/微信</td>\r\n\
                    <td class="regular highlight">16点/天</td>\r\n\
                    <td class="regular highlight">18点/天</td>\r\n\
                    <td class="regular highlight">20点/天</td>\r\n\
                </tr>\r\n\
                <tr class="gray">\r\n\
                    <td>Q币</td>\r\n\
                    <td class="regular">15点/天</td>\r\n\
                    <td class="regular">17点/天</td>\r\n\
                    <td class="regular">19点/天</td>\r\n\
                </tr>\r\n\
                <tr>\r\n\
                    <td>手机渠道</td>\r\n\
                    <td class="regular">13点/天</td>\r\n\
                    <td class="regular">15点/天</td>\r\n\
                    <td class="regular">17点/天</td>\r\n\
                </tr>\r\n\
                </tbody>\r\n\
            </table>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 页面内容 e -->');

return __p.join("");
},

'header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 if (data.need_vip_bar) { __p.push('    <!-- 页面头部 s -->\r\n\
    <!-- 用户信息 S -->\r\n\
    <div class="wy-acct">');

        var is_login = !!data.is_login;

        if(is_login) {
            var nickname = data.nickname,
                isVip = data.isVip,
                __vipLevel = data.__vipLevel,
                isOldVip = data.oldVip,
                head_url = data.headUrl,
                expiresDate = data.expiresDate,
                posText = (isVip || isOldVip)? '续费' : '开通会员';
        __p.push('        <div class="acct">\r\n\
            <!-- 头像 -->\r\n\
            <div class="avatar-wrapper">\r\n\
                <img src="');
_p(head_url);
__p.push('" alt="" class="avatar">');

                if(isVip || isOldVip) {
                    var iconClass = isVip ? 'icon-vip-' + __vipLevel + '-on-s' : 'icon-vip-' + __vipLevel + '-off-s';
                __p.push('                <i class="icon icon-vip-s ');
_p(iconClass);
__p.push('" title="LV');
_p(__vipLevel);
__p.push('"></i>');
 } __p.push('            </div>\r\n\
            <!-- 账号信息 -->\r\n\
            <div class="info-wrapper">\r\n\
                <p class="name">');
_p(nickname);
__p.push('</p>');
if(isVip){ __p.push('                <p class="time">');
_p(expiresDate);
__p.push('</p>');
 } else if(isOldVip) { __p.push('                <p class="time">会员已到期</p>');
 } else { __p.push('                <p class="time">未开通会员</p>');
 } __p.push('            </div>\r\n\
            <!-- 退出 -->\r\n\
            <div class="logout-wrapper">\r\n\
                <button class="btn-icon icon-logout-s" data-action="logout">退出</button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <button class="btn btn-outline" data-action="pay" data-id="3" onclick="pvClickSend(\'weiyun.vip.web.paybtn3\')">');
_p(posText);
__p.push('</button>');
 } else { __p.push('        <button class="btn btn-fill" data-action="login">登录</button>');
 } __p.push('    </div>\r\n\
    <!-- 用户信息 E -->');
 } __p.push('\r\n\
    <div class="wy-hd-inner clearfix">\r\n\
        <div class="logo"><a href="//www.weiyun.com" title="微云会员">微云会员</a></div>\r\n\
        <ul class="nav j-nav-list">\r\n\
            <!-- [ATTENTION!!] 选中态，添加 .act -->\r\n\
            <li class="item" data-page="weiyun_vip"><a href="//www.weiyun.com/vip/weiyun_vip.html?from=');
_p(data.source);
__p.push('">首页</a></li>\r\n\
            <li class="item" data-page="privilege"><a href="//www.weiyun.com/vip/privilege.html?from=');
_p(data.source);
__p.push('">特权介绍</a></li>\r\n\
            <li class="item" data-page="growth"><a href="//www.weiyun.com/vip/growth.html?from=');
_p(data.source);
__p.push('">成长体系</a></li>\r\n\
            <li class="item" data-page="capacity_purchase">\r\n\
                <a href="//www.weiyun.com/vip/capacity_purchase.html?from=');
_p(data.source);
__p.push('">购买容量</a>\r\n\
                <span class="tag tag-fornew"></span>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>\r\n\
    <!-- 页面头部 e -->');

return __p.join("");
},

'main': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\r\n\
<!DOCTYPE html>\r\n\
<!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->\r\n\
<!--[if IE 7 ]> <html class="ie7"> <![endif]-->\r\n\
<!--[if IE 8 ]> <html class="ie8"> <![endif]-->\r\n\
<!--[if IE 9 ]> <html class="ie9"> <![endif]-->\r\n\
<!--[if (gt IE 9)|!(IE)]>--> <html> <!--<![endif]-->\r\n\
<head>\r\n\
<scr');
__p.push('ipt>\r\n\
    var serverConfig = ');
_p(JSON.stringify(plug('config') || {}));
__p.push(';\r\n\
    var IS_TEST_ENV = serverConfig.isTest;\r\n\
    window.APPID = ');
_p(require('weiyun/util/appid')());
__p.push(';\r\n\
    window.AID = "');
_p(data.aid);
__p.push('";\r\n\
    window.g_serv_taken = ');
_p(new Date() - window['g_weiyun_info'].serv_start_time);
__p.push(';\r\n\
    window.g_start_time = +new Date();\r\n\
    window.IS_MOBILE = ');
_p(window['g_weiyun_info'].is_mobile);
__p.push(';\r\n\
    window.IS_WEIXIN_USER = ');
_p(window['g_weiyun_info'].is_weixin_user);
__p.push(';\r\n\
    document.domain=\'weiyun.com\';\r\n\
</scr');
__p.push('ipt>\r\n\
<meta charset="utf-8">\r\n\
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">\r\n\
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n\
<title>微云会员</title>\r\n\
<meta name="Keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web"/>\r\n\
<meta name="Description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。"/>');
_p(data.cssString);
__p.push('</head>\r\n\
<body>\r\n\
<div id="container">\r\n\
    <div class="wy-vip-wrapper ');
_p(data.diffClass);
__p.push('">\r\n\
        <div class="wy-hd clearfix">');
_p(data.header);
__p.push('        </div>\r\n\
        <div class="wy-bd vip-intro">');
_p(data.body);
__p.push('        </div>\r\n\
    </div>\r\n\
    <!-- 弹层 S -->\r\n\
    <div class="dialog j-tips" style="display: none">\r\n\
        <i class="ico ico-done"></i>\r\n\
        <span class="text">购买成功，已为您开通会员服务</span>\r\n\
    </div>\r\n\
    <!-- 弹层 E -->\r\n\
    <!-- 扫码弹层 S -->\r\n\
    <div class="qr-dialog j-qr-dialog" style="display: none">\r\n\
        <div class="box">\r\n\
            <div class="hd">\r\n\
                <h4 class="title j-qr-dialog-title">开通微云会员</h4>\r\n\
            </div>\r\n\
            <div class="bd">\r\n\
                <div class="qr-code j-qrcode">\r\n\
                    <!--<img src="//img.weiyun.com/vipstyle/nr/box/img/qrcode_weixin_pay.png">-->\r\n\
                </div>\r\n\
                <p class="text">使用微信扫二维码</p>\r\n\
                <div class="btn" data-action="close_qrcode"><span>关闭</span></div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="ui-mask"></div>\r\n\
    </div>\r\n\
    <!-- 扫码弹层 E -->\r\n\
</div>');
_p(tmpl.footer(data));
__p.push('</body>\r\n\
\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    window.g_dom_ready_time = +new Date();\r\n\
</scr');
__p.push('ipt>\r\n\
</html>\r\n\
');

return __p.join("");
},

'privilege_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 页面内容 s -->\r\n\
    <ul class="intro-list">\r\n\
        <li class="item privilege-space">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-space"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">存储容量4T</h2>\r\n\
                        <p class="sub-title">免费用户10G</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员，可享有最大4T存储容量，容量有效期与会员时长一致。</p>\r\n\
                        <table>\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>1/2/3/4</th>\r\n\
                                <th>5/6/7/8</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>容量</td>\r\n\
                                <td class="regular">3T</td>\r\n\
                                <td class="regular highlight">4T</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-flow">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-flow"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">单日流量35G</h2>\r\n\
                        <p class="sub-title">免费用户1G</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员，单个自然日可上传累计最多35G的文件(包含从QQ邮箱、QQ离线消息、QQ群/讨论组、离线下载、分享链接转存文件到微云)。当天流量用完后，任务列表中超出流量外的任务会暂停，到下一自然日时，可以手动恢复上传。</p>\r\n\
                        <table>\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>1/2</th>\r\n\
                                <th>3/4</th>\r\n\
                                <th>5/6</th>\r\n\
                                <th>7/8</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>流量</td>\r\n\
                                <td class="regular">20G</td>\r\n\
                                <td class="regular">25G</td>\r\n\
                                <td class="regular">30G</td>\r\n\
                                <td class="regular highlight">35G</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-share">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-share"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">分享有效期65天</h2>\r\n\
                        <p class="sub-title">免费用户7天</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员，尊享链接有效时长最长65天。</p>\r\n\
                        <table class="above-table">\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>1</th>\r\n\
                                <th>2</th>\r\n\
                                <th>3</th>\r\n\
                                <th>4</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>有效期</td>\r\n\
                                <td class="regular">30天</td>\r\n\
                                <td class="regular">35天</td>\r\n\
                                <td class="regular">40天</td>\r\n\
                                <td class="regular">45天</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                        <table class="under-table">\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>5</th>\r\n\
                                <th>6</th>\r\n\
                                <th>7</th>\r\n\
                                <th>8</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>有效期</td>\r\n\
                                <td class="regular">50天</td>\r\n\
                                <td class="regular">55天</td>\r\n\
                                <td class="regular">60天</td>\r\n\
                                <td class="regular highlight">65天</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-term">\r\n\
            <div class="item-inner clearfix">\r\n\
                <!-- 特权 icon 标识 -->\r\n\
                <i class="icon icon-privilege icon-term"></i>\r\n\
                <!-- 截图指引 -->\r\n\
                <div class="exp-img"></div>\r\n\
                <!-- 文本部分 -->\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">回收站有效期45天</h2>\r\n\
                        <p class="sub-title">免费用户7天</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员，回收站文件专享最长45天超长保存时间。</p>\r\n\
                        <table>\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>1/2</th>\r\n\
                                <th>3/4</th>\r\n\
                                <th>5/6</th>\r\n\
                                <th>7/8</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>有效期</td>\r\n\
                                <td class="regular">30天</td>\r\n\
                                <td class="regular">35天</td>\r\n\
                                <td class="regular">40天</td>\r\n\
                                <td class="regular highlight">45天</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-transmission">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-transmission"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">极速传输</h2>\r\n\
                        <p class="sub-title">免费用户无加速</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员使用专属的下载通道，提升用户所有任务的上传/下载速度。</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-offline">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-offline"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">离线下载55次</h2>\r\n\
                        <p class="sub-title">免费用户5次</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员每日使用离线下载最多55次，免费用户5次。</p>\r\n\
                        <table class="above-table">\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>1</th>\r\n\
                                <th>2</th>\r\n\
                                <th>3</th>\r\n\
                                <th>4</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>次数</td>\r\n\
                                <td class="regular">20次</td>\r\n\
                                <td class="regular">25次</td>\r\n\
                                <td class="regular">30次</td>\r\n\
                                <td class="regular">35次</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                        <table class="under-table">\r\n\
                            <thead>\r\n\
                            <tr>\r\n\
                                <th class="ctg">等级LV</th>\r\n\
                                <th>5</th>\r\n\
                                <th>6</th>\r\n\
                                <th>7</th>\r\n\
                                <th>8</th>\r\n\
                            </tr>\r\n\
                            </thead>\r\n\
                            <tbody>\r\n\
                            <tr>\r\n\
                                <td>次数</td>\r\n\
                                <td class="regular">40次</td>\r\n\
                                <td class="regular">45次</td>\r\n\
                                <td class="regular">50次</td>\r\n\
                                <td class="regular highlight">55次</td>\r\n\
                            </tr>\r\n\
                            </tbody>\r\n\
                        </table>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-video">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-video"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">备份原画视频</h2>\r\n\
                        <p class="sub-title">免费用户高清</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">微云会员可在上传/自动备份视频文件时，使用原画质量，原汁原味保留原始文件。</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
        <li class="item privilege-label">\r\n\
            <div class="item-inner clearfix">\r\n\
                <i class="icon icon-privilege icon-label"></i>\r\n\
                <div class="exp-img"></div>\r\n\
                <div class="txt-wrapper">\r\n\
                    <div class="title-wrapper">\r\n\
                        <h2 class="title">开放全部标签</h2>\r\n\
                        <p class="sub-title">免费用户8个</p>\r\n\
                    </div>\r\n\
                    <div class="exp-wrapper">\r\n\
                        <p class="exp">在照片-标签下，微云提供了智能分类标签功能。非会员只能展示最多8个照片的分类信息，会员尊享全部照片的智能标签分类特权。</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>\r\n\
    </ul>\r\n\
    <!-- 页面内容 e -->');

return __p.join("");
},

'announcement_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wy-bd">\r\n\
        <div class="hd">\r\n\
            <div class="title1">\r\n\
                <!-- svg动画 s -->\r\n\
                <svg class="svg1" width="167px" height="119px" viewBox="373 -2 174 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\r\n\
                    <path class="title1-path1" stroke="#06B998" stroke-width="4" fill="#0EC9A6" fill-rule="evenodd" d="M429.732302,94.2983425 L534.002569,94.2983425 C537.318182,94.2983425 540,91.6092611 540,88.292111 L540,6.00623156 C540,2.69531492 537.314859,0 534.002569,0 L379.555623,0 C376.24001,0 373.558192,2.68908147 373.558192,6.00623156 L373.558192,88.292111 C373.558192,91.6030276 376.243333,94.2983425 379.555623,94.2983425 L390.202373,94.2983425 L390.202373,116.64315 C390.202373,118.848021 391.695423,119.65124 393.537193,118.423636 L429.732302,94.2983425 Z" id="path-1"></path>\r\n\
                    <path d="M442.215438,51.9160912 C446.029748,58.8498275 448.890438,66.3034822 450.797594,74.277279 L439.614785,74.277279 C439.441407,73.5839054 439.268032,72.6305309 439.094654,71.4171271 C438.747899,70.55041 438.574523,69.9437172 438.574523,69.5970304 C425.74457,71.6771513 414.475185,72.6305257 404.766031,72.4571823 L399.304659,72.4571823 L399.304659,63.6167127 C406.066392,56.8563198 411.441021,48.1892794 415.42871,37.6153315 L428.431976,37.6153315 C424.097532,48.1892794 418.202777,56.8563198 410.747534,63.6167127 C419.589799,63.6167127 428.171869,63.2700311 436.494001,62.5766575 C435.280357,58.9364459 433.806668,55.3829593 432.07289,51.9160912 L442.215438,51.9160912 Z M453.398247,48.015884 C438.834516,42.9889251 430.252446,32.6751471 427.65178,17.0742403 L439.354719,17.0742403 C440.915119,27.6481882 445.596248,35.6218654 453.398247,40.995511 L453.398247,48.015884 Z M393.583222,48.015884 L393.583222,40.995511 C401.385221,35.6218654 406.06635,27.6481882 407.62675,17.0742403 L419.329689,17.0742403 C416.729023,32.6751471 408.146953,42.9889251 393.583222,48.015884 Z M466.401513,74.277279 L466.401513,49.315953 L514.773664,49.315953 L514.773664,64.3967541 C514.773664,71.1571471 511.566223,74.4506224 505.151247,74.277279 L466.401513,74.277279 Z M520.235035,45.4157459 L459.89988,45.4157459 L459.89988,37.8753453 L485.906412,37.8753453 L485.906412,28.5148481 L474.723604,28.5148481 C472.296315,31.9817162 468.308687,34.5818283 462.760599,36.3152624 L462.760599,29.8149171 C466.054776,26.5213924 467.961902,22.2745426 468.482036,17.0742403 L478.884649,17.0742403 C478.711271,18.2876442 478.451208,19.5877002 478.104453,20.9744475 L485.906412,20.9744475 L485.906412,15.5141575 L497.609352,15.5141575 L497.609352,20.9744475 L516.594121,20.9744475 L516.594121,28.5148481 L497.609352,28.5148481 L497.609352,37.8753453 L520.235035,37.8753453 L520.235035,45.4157459 Z M477.844387,57.1163674 L477.844387,67.2569061 L500.210005,67.2569061 C502.463916,67.4302495 503.504167,66.3035342 503.330789,63.8767265 L503.330789,57.1163674 L477.844387,57.1163674 Z" id="公告" stroke="none" fill="#FFFFFF" fill-rule="evenodd"></path>\r\n\
                </svg>\r\n\
                <!-- svg动画 e -->\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
            <p class="text">\r\n\
                亲爱的用户：\r\n\
                <br><br>\r\n\
                感谢您选择微云！近年来，选择云存储的个人用户数量正在飞速上涨。为了让更多的人能够共享稳定、长久的云存储资源，实现平台的可持续发展，我们将微云的存储服务方案调整如下：\r\n\
            </p>\r\n\
            <ul class="list">\r\n\
                <li class="item"><p class="txt">普通用户的免费存储容量调整为10G。原存储文件已超过10G的普通用户，仍然可以下载和访问文件，但上传新文件将受到限制；</p></li>\r\n\
                <li class="item"><p class="txt">会员存储容量保持不变。</p></li>\r\n\
            </ul>\r\n\
            <p class="text">微云将从<span class="bold">2017年1月16日</span>起实施以上服务方案。与此同时，我们近期也从以下三方面进行对微云功能升级：</p>\r\n\
            <ul class="list">\r\n\
                <li class="item"><p class="txt">更便利：加强与社交场景的连接，目前可将QQ聊天文件一键转存到微云，也可通过关注微云公众号将微信聊天内容备份到微云；</p></li>\r\n\
                <li class="item"><p class="txt">更安全：联合腾讯电脑管家软件，实时查杀恶意软件、文件，保障用户的数据安全；</p></li>\r\n\
                <li class="item"><p class="txt">办公能力更强：与微软展开合作，目前已经实现云端office文档快速编辑功能。</p></li>\r\n\
            </ul>\r\n\
            <p class="text">在过去的4年里，微云已累计服务超过4亿用户，存储了数以百亿计的文件。个人云存储市场的长远发展需要您的理解与支持，我们希望通过持续的努力，为每一位用户提供安全、便利、长久的服务。</p>\r\n\
            <p class="inscribed"> 微云团队<br>2016年12月15日</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'weiyun_vip_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 页面内容 s -->');

    var is_login = !!data.is_login;
    var nickname = data.nickname,
        isVip = data.isVip,
        __vipLevel = data.__vipLevel,
        isOldVip = data.oldVip,
        head_url = data.headUrl,
        expiresDate = data.expiresDate,
        posText = isVip ? '续费' : '开通';
    __p.push('    ');
 if (is_login) { __p.push('    <div class="hd">\r\n\
        <div class="inner">\r\n\
            <div class="user-avatar">\r\n\
                <div class="avatar-pic"><img src="');
_p(head_url);
__p.push('" alt="用户昵称"></div>');

                    if(isVip || isOldVip) {
                        var iconClass = isVip ? 'icon-vip-' + __vipLevel + '-on-l' : 'icon-vip-' + __vipLevel + '-off-l';
                __p.push('                <i class="icon icon-vip-l ');
_p(iconClass);
__p.push('" title="LV');
_p(__vipLevel);
__p.push('"></i>');
 } __p.push('            </div>\r\n\
            <div class="user-name">\r\n\
                <span>');
_p(nickname);
__p.push('</span>\r\n\
                <i class="icon icon-logout" style="visibility: visible;" data-action="logout"></i>\r\n\
            </div>');
if(isVip){ __p.push('            <div class="user-info"><span>');
_p(expiresDate);
__p.push('</span></div>');
 } else if(isOldVip) { __p.push('            <div class="user-info"><span>会员已到期</span></div>');
 } else { __p.push('            <div class="user-info"><span>未开通会员</span></div>');
 } __p.push('        </div>\r\n\
        <div class="hd-bg"></div>\r\n\
    </div>');
 } else { __p.push('    <div class="hd">\r\n\
        <div class="inner">\r\n\
            <div class="user-avatar logout">\r\n\
                <!-- 非登陆态默认头像 -->\r\n\
                <div class="avatar-pic">\r\n\
                    <img src="//img.weiyun.com/qz-proj/wy-pc/img/vip-v2/avatar.png" alt="用户昵称">\r\n\
                </div>\r\n\
                <button class="btn" data-action="login"><span>登录</span></button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="hd-bg"></div>\r\n\
    </div>');
 } __p.push('    <div class="bd">\r\n\
        <!-- 开通支付 s -->\r\n\
        <div class="pay-wrap">\r\n\
            <ul class="pay-list clearfix">\r\n\
                <li class="item pay-item-01">\r\n\
                    <div class="inner">\r\n\
                        <div class="month"><span>12个月</span></div>\r\n\
                        <div class="price"><span class="num">120</span><span class="unit">元</span></div>\r\n\
                        <button class="btn" data-action="');
_p(is_login ? 'pay' : 'login');
__p.push('" data-id="12" onclick="pvClickSend(\'weiyun.vip.web.paybtn12\')"><span>');
_p(posText);
__p.push('</span></button>\r\n\
                    </div>\r\n\
                </li>\r\n\
                <li class="item pay-item-02">\r\n\
                    <div class="inner">\r\n\
                        <div class="month"><span>9个月</span></div>\r\n\
                        <div class="price"><span class="num">90</span><span class="unit">元</span></div>\r\n\
                        <button class="btn" data-action="');
_p(is_login ? 'pay' : 'login');
__p.push('" data-id="9" onclick="pvClickSend(\'weiyun.vip.web.paybtn9\')"><span>');
_p(posText);
__p.push('</span></button>\r\n\
                    </div>\r\n\
                </li>\r\n\
                <li class="item pay-item-03">\r\n\
                    <div class="inner">\r\n\
                        <div class="month"><span>6个月</span></div>\r\n\
                        <div class="price"><span class="num">60</span><span class="unit">元</span></div>\r\n\
                        <button class="btn" data-action="');
_p(is_login ? 'pay' : 'login');
__p.push('" data-id="6" onclick="pvClickSend(\'weiyun.vip.web.paybtn6\')"><span>');
_p(posText);
__p.push('</span></button>\r\n\
                    </div>\r\n\
                </li>\r\n\
                <li class="item pay-item-04">\r\n\
                    <div class="inner">\r\n\
                        <div class="month"><span>3个月</span></div>\r\n\
                        <div class="price"><span class="num">30</span><span class="unit">元</span></div>\r\n\
                        <button class="btn" data-action="');
_p(is_login ? 'pay' : 'login');
__p.push('" data-id="3" onclick="pvClickSend(\'weiyun.vip.web.paybtn3\')"><span>');
_p(posText);
__p.push('</span></button>\r\n\
                    </div>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <!-- 开通支付 e -->\r\n\
        <!-- banner s -->\r\n\
        <div class="banner-wrap" style="display: none;">\r\n\
            <div id="ad_container" class="list-wrap">\r\n\
            </div>');
 if (!is_login) { __p.push('            <span class="pre">\r\n\
                <i class="icon icon-pre"></i>\r\n\
            </span>\r\n\
            <span class="next disable"><!-- 不可点击状态加.disable -->\r\n\
                <i class="icon icon-next"></i>\r\n\
            </span>');
 } __p.push('        </div>\r\n\
        <!-- banner e -->\r\n\
        <div class="intro-wrap">\r\n\
            <div class="intro-hd clearfix">\r\n\
                <div class="title-wrap">\r\n\
                    <h1 class="title">会员特权</h1>\r\n\
                    <h3 class="sub-title">畅享至尊“云”体验</h3>\r\n\
                </div>\r\n\
                <a href="//www.weiyun.com/vip/privilege.html" class="more" onclick="pvClickSend(\'weiyun.vip.web.moreprivilege\')">更多&gt;</a>\r\n\
            </div>\r\n\
            <div class="intro-bd">\r\n\
                <ul class="intro-list clearfix">\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner">\r\n\
                            <i class="icon icon-privilege icon-space"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">存储容量4T</h2>\r\n\
                                    <p class="sub-title">免费用户10G</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner">\r\n\
                            <i class="icon icon-privilege icon-flow">\r\n\
                            </i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">单日流量35G</h2>\r\n\
                                    <p class="sub-title">免费用户1G</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner">\r\n\
                            <i class="icon icon-privilege icon-share"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">分享有效期65天</h2>\r\n\
                                    <p class="sub-title">免费用户7天</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner clearfix">\r\n\
                            <i class="icon icon-privilege icon-term"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">回收站有效期45天</h2>\r\n\
                                    <p class="sub-title">免费用户7天</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner clearfix">\r\n\
                            <i class="icon icon-privilege icon-video"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">备份原画视频</h2>\r\n\
                                    <p class="sub-title">免费用户高清</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner">\r\n\
                            <i class="icon icon-privilege icon-offline"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">离线下载55次</h2>\r\n\
                                    <p class="sub-title">免费用户5次</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner clearfix">\r\n\
                            <i class="icon icon-privilege icon-label"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">开放全部标签</h2>\r\n\
                                    <p class="sub-title">免费用户8个</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                    <li class="item">\r\n\
                        <div class="item-inner">\r\n\
                            <i class="icon icon-privilege icon-transmission"></i>\r\n\
                            <div class="txt-wrapper">\r\n\
                                <div class="title-wrapper">\r\n\
                                    <h2 class="title">极速传输</h2>\r\n\
                                    <p class="sub-title">免费用户无加速</p>\r\n\
                                </div>\r\n\
                            </div>\r\n\
                        </div>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 页面内容 e -->');

return __p.join("");
}
};
return tmpl;
});
