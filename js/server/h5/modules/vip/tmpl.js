
//tmpl file list:
//vip/src/body.tmpl.html
//vip/src/error.tmpl.html
//vip/src/grow.tmpl.html
//vip/src/iap.tmpl.html
//vip/src/qzone.tmpl.html
define("club/weiyun/js/server/h5/modules/vip/tmpl",["weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var nickname = data.nickname,
            avatar = data.avatar,
            isVip = data.isVip,
            isOldVip = data.oldVip,
            vipLevelInfo = data.vipLevelInfo || {},
            currentLevel = parseInt(vipLevelInfo.level),
            growthScoreList = data.growthScoreList,
            headURL = data.headURL && data.headURL.replace(/^http:|^https:/, ''),
            userType = data.isWxUser? 'icon-wechat' : 'icon-qq',
            expiresDate = data.expiresDate,
            posText = isVip? '续费' : '开通';

        var growSpeed = vipLevelInfo.grow_speed>0? '+' + vipLevelInfo.grow_speed : vipLevelInfo.grow_speed;
        var scoreNextLevel = currentLevel<8? (growthScoreList[currentLevel+1] - vipLevelInfo.current_score) : '';
        var growText = currentLevel<8? (currentLevel == 0? '升级需开通会员' : '升级还需' + scoreNextLevel) : '已达最高等级';
        var iconClass = currentLevel<8? '' : 'level-full';
    _p(require('weiyun/util/inline').css(['app-iap-privilege-v2']));
__p.push('<div class="app-iap-privilege">\r\n\
    <div class="user-wrap clearfix">\r\n\
        <div class="avatar-wrap">\r\n\
            <img class="avatar" src="');
_p(headURL);
__p.push('">');

                if(isVip || isOldVip) {
                    var vip_logo_url = data.vipLogoURL.replace(/^http:|^https:/, '').replace('.png', 'L.png');;
            __p.push('            <i class="icon icon-vip" style="background-image: url(');
_p(vip_logo_url);
__p.push(')"></i>');
 } __p.push('        </div>\r\n\
        <div class="main">\r\n\
            <!-- qq为icon-qq,微信为icon-wechat -->\r\n\
            <div class="name">\r\n\
                <div class="name-info"><span>');
_p(nickname);
__p.push('</span>\r\n\
                    </div>\r\n\
                <span class="icon ');
_p(userType);
__p.push('"></span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="right">');
 if(isVip) { __p.push('        <span class="time">');
_p(expiresDate);
__p.push('</span>');
 } else if(isOldVip){__p.push('        <span class="time">会员已到期</span>');
 } else {__p.push('        <span class="time">未开通会员</span>');
 } __p.push('        </div>\r\n\
    </div>\r\n\
    <div class="grow-wrap">\r\n\
        <div class="grow tBor bBor j-grow-btn">\r\n\
            <div class="grow-infor clearfix">\r\n\
                <span class="grow-num">我的成长值');
_p(vipLevelInfo.current_score);
__p.push('(');
_p(growSpeed);
__p.push('点/天)</span>\r\n\
                <span class="grow-lack">');
_p(growText);
__p.push('</span>\r\n\
            </div>\r\n\
            <div class="grow-line ');
_p(iconClass);
__p.push('">\r\n\
                <div class="inner" style="width: 0px"></div>\r\n\
                <div class="level-now">\r\n\
                    <span class="point"></span>\r\n\
                    <span class="level">LV');
_p(currentLevel<8? currentLevel : currentLevel-1);
__p.push('</span>\r\n\
                </div>\r\n\
                <div class="level-next">\r\n\
                    <span class="point"></span>\r\n\
                    <span class="level">LV');
_p(currentLevel<8? currentLevel + 1 : currentLevel);
__p.push('</span>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="pay-wrap">\r\n\
        <ul class="pay-list clearfix">\r\n\
            <li data-id="12" class="pay-item trblBor j-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-normal.paybtn12\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">12个月<span class="num">120</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
            <li data-id="9" class="pay-item trblBor j-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-normal.paybtn9\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">9个月<span class="num">90</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
            <li data-id="6" class="pay-item trblBor j-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-normal.paybtn6\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">6个月<span class="num">60</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><div class="icon icon-more"></div></div>\r\n\
            </li>\r\n\
            <li data-id="3" class="pay-item trblBor j-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-normal.paybtn3\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">3个月<span class="num">30</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>\r\n\
\r\n\
    <div class="banner-wrap j-ad-container" ');
_p(data.isWxUser ? 'style="display:none"' : '');
__p.push('>\r\n\
        <!--ad 广告-->\r\n\
    </div>\r\n\
\r\n\
    <div class="power-wrap">\r\n\
        <div class="hd clearfix">\r\n\
            <span class="title">会员特权</span>\r\n\
            <a href="//www.weiyun.com/mobile/vip-more-privilege.html" onclick="pvClickSend(\'weiyun.vip.h5-normal.moreprivilege\')" class="more">更多<i class="icon icon-more"></i></a>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
            <ul class="power-list clearfix">\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-space"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">存储容量4T</p>\r\n\
                    <p class="note">免费用户10G</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-flow"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">单日流量35G</p>\r\n\
                    <p class="note">免费用户1G</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-share"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">分享有效期65天</p>\r\n\
                    <p class="note">免费用户7天</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-transmission"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description"><span>极速传输</span></p>\r\n\
                    <p class="note">免费用户无加速</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-offline"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">离线下载55次</p>\r\n\
                    <p class="note">免费用户5次</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-term"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">回收站有效期45天</p>\r\n\
                    <p class="note">免费用户7天</p>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>\r\n\
<div class="iap-success-dialog" style="display:none">\r\n\
    <div class="box">\r\n\
        <div class="hd">\r\n\
        <div class="hd-bg"></div>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
        <div class="text">\r\n\
            <p class="title">开通成功</p>\r\n\
            <p class="description">开始畅游微云服务吧</p>\r\n\
        </div>\r\n\
        <div class="btn confirm"><span>我知道了</span>\r\n\
        </div>\r\n\
    </div>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt>\r\n\
    window.AID = "');
_p(window.g_weiyun_info.AID);
__p.push('";\r\n\
    seajs.use([\'$\', \'lib\',\'common\', \'vip\'], function($, lib, common, vip) {\r\n\
        var vip = vip.get(\'./vip\');\r\n\
        vip.init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    var pvClickSend = function (tag) {\r\n\
        if (typeof pgvSendClick == "function") {\r\n\
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
                virtualURL: \'/h5/vip.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
');

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

'grow': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var nickname = data.nickname,
        avatar = data.avatar,
        isVip = data.isVip,
        isOldVip = data.oldVip,
        vipLevelInfo = data.vipLevelInfo,
        currentLevel = parseInt(vipLevelInfo.level),
        growthScoreList = data.growthScoreList,
        growthRate = Math.ceil(vipLevelInfo.current_score / growthScoreList[currentLevel+1]),
        iconClass = (isVip || isOldVip)? 'icon-level-' + currentLevel : '',
        expireClass = (!isVip && isOldVip)? 'icon-level-gray' : '' ,
        headURL = data.headURL && data.headURL.replace(/^http:|^https:/, ''),
        userType = data.isWxUser? 'icon-wechat' : 'icon-qq',
        expiresDate = data.expiresDate,
        posText = isVip? '续费' : '开通';

    var growSpeed = vipLevelInfo.grow_speed>0? vipLevelInfo.grow_speed : 0;
    var scoreNextLevel = currentLevel<8? (growthScoreList[currentLevel+1] - vipLevelInfo.current_score) : '';
    var upgradeDay = growSpeed!=0? Math.abs(Math.ceil(scoreNextLevel / growSpeed)) : 0;
    var growText = currentLevel<8? '升级还需' + scoreNextLevel : '已达最高等级';
    __p.push('    ');
_p(require('weiyun/util/inline').css(['app-iap-grow']));
__p.push('    <div class="app-iap-grow">\r\n\
        <div class="box">\r\n\
            <div class="box-hd">\r\n\
                <div class="hd-wrap">\r\n\
                    <div id="level" class="hd-bg level-');
_p(currentLevel);
__p.push('">\r\n\
                        <div class="');
_p(currentLevel == 0? '' : 'point');
__p.push('"></div>\r\n\
                        <div class="path"></div>\r\n\
                    </div>\r\n\
                    <div class="hd-infor">\r\n\
                        <div class="infor">');

                            for(var i=1; i < growthScoreList.length; i++) {
                                if(currentLevel!=i) {
                            __p.push('                                <div class="level-wrap">\r\n\
                                    <span class="level">LV');
_p(i);
__p.push('</span>\r\n\
                                    <span class="num">');
_p(growthScoreList[i]);
__p.push('</span>\r\n\
                                </div>');
 } else { __p.push('                                <div class="level-wrap level-now">\r\n\
                                    <div class="avatar-wrap">\r\n\
                                        <img class="avatar" src="');
_p(headURL);
__p.push('">');

                                            if(isVip || isOldVip) {
                                                var vip_logo_url = data.vipLogoURL.replace('[http|https]:','').replace('.png', 'L.png');
                                        __p.push('                                        <i class="icon icon-vip" style="background-image: url(');
_p(vip_logo_url);
__p.push(')"></i>');
 } __p.push('                                    </div>\r\n\
                                    <span class="num">');
_p(vipLevelInfo.current_score);
__p.push('</span>\r\n\
                                </div>');
  }
                            }
                            __p.push('                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="hd-grow">');

                        if(currentLevel<8 && currentLevel>0) {
                    __p.push('                    <div class="item rBor">\r\n\
                        <h4 class="title">我的成长值</h4>\r\n\
                        <span class="num">');
_p(vipLevelInfo.current_score);
__p.push('</span>');
 if(growSpeed > 0) { __p.push('                        <span class="tip">+');
_p(growSpeed);
__p.push('点/天</span>');
 } __p.push('                    </div>\r\n\
                    <div class="item">\r\n\
                        <h4 class="title">升级还需</h4>\r\n\
                        <span class="num">');
_p(scoreNextLevel);
__p.push('</span>');
 if(upgradeDay > 0) { __p.push('                        <span class="tip">');
_p(upgradeDay);
__p.push('天</span>');
 } __p.push('                    </div>');

                        } else if(currentLevel == 8){
                    __p.push('                    <div class="item rBor">\r\n\
                        <h4 class="title">我的成长值</h4>\r\n\
                        <span class="num">');
_p(vipLevelInfo.current_score);
__p.push('</span>');
 if(growSpeed > 0) { __p.push('                        <span class="tip">+');
_p(growSpeed);
__p.push('点/天</span>');
 } __p.push('                    </div>\r\n\
                    <div class="item level-full">\r\n\
                        <h4 class="title">已达最高等级</h4>\r\n\
                    </div>');

                        } else {
                    __p.push('                    <div class="pay-wrap j-pay-wrap" style="display: none">\r\n\
                        <div class="btn j-pay-btn" data-id="1"><span>开通会员</span></div>\r\n\
                        <p class="tip">开通微云会员 开启等级成长之旅</p>\r\n\
                    </div>');
 } __p.push('                </div>\r\n\
            </div>\r\n\
            <div class="box-bd">\r\n\
                <div class="main">\r\n\
                    <h3 class="title">每日成长速度</h3>\r\n\
                    <img src="//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/iap/table-speed.png">\r\n\
                    <span class="tip">注：用户会员过期后，成长值将以10点/天的速度下降</span>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/qqdisk/web/js/lib/zepto-1.0.0.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt>\r\n\
    seajs.use([\'$\', \'lib\',\'common\', \'vip\'], function($, lib, common, vip) {\r\n\
        var vip = vip.get(\'./vip\');\r\n\
        vip.init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
\r\n\
    // iap屏蔽入口\r\n\
    if (window.location.href.indexOf(\'ios\') === -1) {\r\n\
        $(\'.j-pay-wrap\').show();\r\n\
    }\r\n\
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
                virtualURL: \'/h5/vip.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
},

'iap': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var nickname = data.nickname,
        avatar = data.avatar,
        isVip = data.isVip,
        isOldVip = data.oldVip,
        vipLevelInfo = data.vipLevelInfo || {},
        currentLevel = parseInt(vipLevelInfo.level),
        growthScoreList = data.growthScoreList,
        growthRate = Math.ceil(vipLevelInfo.current_score / growthScoreList[currentLevel+1]),
        iconClass = (isVip || isOldVip)? 'icon-level-' + currentLevel : '',
        expireClass = (!isVip && isOldVip)? 'icon-level-gray' : '' ,
        headURL = data.headURL && data.headURL.replace(/^http:|^https:/, ''),
        userType = data.isWxUser? 'icon-wechat' : 'icon-qq',
        expiresDate = data.expiresDate,
        posText = isVip? '续费' : '开通';

    var growSpeed = vipLevelInfo.grow_speed>0? '+' + vipLevelInfo.grow_speed : vipLevelInfo.grow_speed;
    _p(require('weiyun/util/inline').css(['app-iap-privilege-v2']));
__p.push('<div class="app-iap-privilege">\r\n\
    <div class="user-wrap clearfix">\r\n\
        <div class="avatar-wrap">\r\n\
            <img class="avatar" src="');
_p(headURL);
__p.push('">');

                if(isVip || isOldVip) {
                    var vip_logo_url = data.vipLogoURL.replace(/^http:|^https:/, '').replace('.png', 'L.png');;
            __p.push('            <i class="icon icon-vip" style="background-image: url(');
_p(vip_logo_url);
__p.push(')"></i>');
 } __p.push('        </div>\r\n\
        <div class="main">\r\n\
            <!-- qq为icon-qq,微信为icon-wechat -->\r\n\
            <div class="name">\r\n\
                <div class="name-info"><span>');
_p(nickname);
__p.push('</span>\r\n\
                    </div>\r\n\
                <span class="icon ');
_p(userType);
__p.push('"></span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="right">');
 if(isVip) { __p.push('        <span class="time">');
_p(expiresDate);
__p.push('</span>');
 } else if(isOldVip){__p.push('        <span class="time">会员已到期</span>');
 } else {__p.push('        <span class="time">未开通会员</span>');
 } __p.push('        </div>\r\n\
    </div>\r\n\
    <div class="grow-wrap">\r\n\
        <div class="grow tBor bBor j-grow-btn">\r\n\
            <div class="grow-infor clearfix">\r\n\
                <span class="grow-num">我的成长值');
_p(vipLevelInfo.current_score);
__p.push('(');
_p(growSpeed);
__p.push('点/天)</span>\r\n\
                <span class="grow-lack">升级还需');
_p(growthScoreList[currentLevel+1] - vipLevelInfo.current_score);
__p.push('</span>\r\n\
            </div>\r\n\
            <div class="grow-line">\r\n\
                <div class="inner" style="width: 0px"></div>\r\n\
                <div class="level-now">\r\n\
                    <span class="point"></span>\r\n\
                    <span class="level">LV');
_p(currentLevel);
__p.push('</span>\r\n\
                </div>\r\n\
                <div class="level-next">\r\n\
                    <span class="point"></span>\r\n\
                    <span class="level">LV');
_p(currentLevel + 1);
__p.push('</span>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="pay-wrap">\r\n\
        <ul class="pay-list clearfix">\r\n\
            <li data-id="12" class="pay-item trblBor j-iap-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-iap.paybtn12\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">12个月<span class="num">118</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
            <li data-id="6" class="pay-item trblBor j-iap-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-iap.paybtn6\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">6个月<span class="num">60</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
            <li data-id="3" class="pay-item trblBor j-iap-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-iap.paybtn3\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">3个月<span class="num">30</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><div class="icon icon-more"></div></div>\r\n\
            </li>\r\n\
            <li data-id="1" class="pay-item trblBor j-iap-pay-btn" onclick="pvClickSend(\'weiyun.vip.h5-iap.paybtn1\')">\r\n\
                <div class="price-wrap">\r\n\
                    <span class="price">1个月<span class="num">12</span>元</span>\r\n\
                </div>\r\n\
                <div class="right"><i class="icon icon-more"></i></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>\r\n\
\r\n\
    <div class="banner-wrap j-ad-container" ');
_p(data.isWxUser ? 'style="display:none"' : '');
__p.push('>\r\n\
        <!--ad 广告-->\r\n\
    </div>\r\n\
\r\n\
    <div class="power-wrap">\r\n\
        <div class="hd clearfix">\r\n\
            <span class="title">会员特权</span>\r\n\
            <a href="//www.weiyun.com/mobile/vip-more-privilege.html" onclick="pvClickSend(\'weiyun.vip.h5-iap.moreprivilege\')" class="more">更多<i class="icon icon-more"></i></a>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
            <ul class="power-list clearfix">\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-space"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">存储容量4T</p>\r\n\
                    <p class="note">免费用户10G</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-flow"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">单日流量35G</p>\r\n\
                    <p class="note">免费用户1G</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-share"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">分享有效期65天</p>\r\n\
                    <p class="note">免费用户7天</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-transmission"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description"><span>极速传输</span></p>\r\n\
                    <p class="note">免费用户无加速</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-offline"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">离线下载55次</p>\r\n\
                    <p class="note">免费用户5次</p>\r\n\
                </li>\r\n\
                <li class="power-item rBor">\r\n\
                    <div class="pic">\r\n\
                        <i class="icon icon-term"></i>\r\n\
                        <div class="animate"></div>\r\n\
                    </div>\r\n\
                    <p class="description">回收站有效期45天</p>\r\n\
                    <p class="note">免费用户7天</p>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>\r\n\
<div class="iap-success-dialog" style="display:none">\r\n\
    <div class="box">\r\n\
        <div class="hd">\r\n\
        <div class="hd-bg"></div>\r\n\
        </div>\r\n\
        <div class="bd">\r\n\
        <div class="text">\r\n\
            <p class="title">开通成功</p>\r\n\
            <p class="description">开始畅游微云服务吧</p>\r\n\
        </div>\r\n\
        <div class="btn confirm"><span>我知道了</span>\r\n\
        </div>\r\n\
    </div>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\',\'common\', \'vip\'], function($, lib, common, vip) {\r\n\
        vip.get(\'./vip\').iap_init();\r\n\
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
        if (typeof pgvSendClick == "function") {\r\n\
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
                virtualURL: \'/h5/vip.html?iap\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
},

'qzone_download_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<style>\r\n\
		.qzone-download-guide{position:absolute;left:0;top:0;bottom:0;right:0}.qzone-download-guide .wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-80%);-webkit-transform:translate(-50%,-80%)}.qzone-download-guide .wrap .txt{width:160px;text-align:center;color:#575a5f;font-size:16px;line-height:1.5;margin:0 auto}.qzone-download-guide .wrap .btn{width:133px;height:40px;line-height:40px;font-size:16px;text-align:center;background:#00a4ff;color:#fff;margin:18px auto 0;border-radius:30px}\r\n\
	</style>\r\n\
	<div class="qzone-download-guide">\r\n\
		<div class="wrap">\r\n\
			<p class="txt">会员服务已升级<br>请下载最新版微云使用</p>\r\n\
			<div class="btn j-download-btn"><span>立即下载</span></div>\r\n\
		</div>\r\n\
	</div>\r\n\
\r\n\
	<scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club/qqdisk/web/js/lib/zepto-1.0.0.min.js?max_age=604800"></scr');
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
				virtualURL: \'/h5/vip_qzone.html\',\r\n\
				virtualDomain: "www.weiyun.com"\r\n\
			});\r\n\
		}\r\n\
	})();\r\n\
\r\n\
	$(\'.j-download-btn\').on(\'click\', function(e) {\r\n\
		if (navigator.userAgent.match(/Android/i)) {\r\n\
			window.open(\'https://m.qzone.com/l?g=1513\');\r\n\
		} else {\r\n\
			window.open(\'https://itunes.apple.com/cn/app/id522700349?mt=8&ls=1\');\r\n\
		}\r\n\
	});\r\n\
\r\n\
</scr');
__p.push('ipt>');

return __p.join("");
}
};
return tmpl;
});
