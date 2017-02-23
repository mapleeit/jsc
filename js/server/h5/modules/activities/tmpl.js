
//tmpl file list:
//activities/src/base.tmpl.html
//activities/src/body.tmpl.html
//activities/src/list.tmpl.html
define("club/weiyun/js/server/h5/modules/activities/tmpl",["weiyun/util/appid","weiyun/util/inline","weiyun/util/dateformat"],function(require, exports, module){
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
        <title>活动</title>\r\n\
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
	    <meta itemprop="image" content="https://img.weiyun.com/vipstyle/nr/box/img/logo/96x96.png" />\r\n\
        <scr');
__p.push('ipt>var IS_TEST_ENV = ');
_p(is_test_env);
__p.push(';window.APPID = ');
_p(APPID);
__p.push(';window.g_serv_taken = ');
_p(serv_taken);
__p.push(';window.g_start_time = +new Date();</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').css(['g-reset', 'g-retina-border', 'g-component'], true));
__p.push('        <scr');
__p.push('ipt>window.g_css_time = +new Date();document.domain=\'weiyun.com\';</scr');
__p.push('ipt>\r\n\
		<link rel="shortcut icon" href="https://img.weiyun.com/vipstyle/nr/box/img/favicon.ico?max_age=31536000" type="image/x-icon" />\r\n\
    </head>\r\n\
    <body cz-shortcut-listen="true">');

return __p.join("");
},

'baseBottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        setTimeout(function() {\r\n\
            window.g_end_time = +new Date();\r\n\
        }, 0);\r\n\
    </scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">');
 if(data) { __p.push(' //已经失败就不进行初始化了\r\n\
            window.node_sync = true;\r\n\
            seajs.use([\'$\', \'lib\',\'common\', \'signin\'], function($, lib, common, signin) {\r\n\
                window.g_js_time = +new Date();\r\n\
                var signin = signin.get(\'./signin\');\r\n\
                signin.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
            });');
 } __p.push('    </scr');
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
                    virtualURL: \'/mobile/activities\',\r\n\
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

'personal': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-checkin-personal'], true));
__p.push('    <div id="act_personal" class="app-checkin-personal">\r\n\
        <div class="information-list">\r\n\
            <div data-id="address" class="item tBor">\r\n\
                <div class="text"><span>收货地址</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
            <div data-id="records" class="item tBor bBor">\r\n\
                <div class="text"><span>兑换记录</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
            <div data-id="rule" class="item rule tBor bBor">\r\n\
                <div class="text"><span>兑换规则</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'history': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-checkin-history'], true));
__p.push('\r\n\
    <div class="app-checkin-history">\r\n\
        <ul class="shop-list">');

            var dateformat = require('weiyun/util/dateformat');
            var item,
                time,
                is_ticket,
                is_jd_ticket,
                itemClass,
                head_url;

            if(data && data.length) {
                for(var key in data) {
                    item = data[key];
                    time = dateformat(new Date((item.time || item.redeem_time) * 1000), 'yyyy-mm-dd');
                    head_url = item.prizeid ? '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/checkin-exchange-gift/gift-s-' + item.prizeid + '.jpg' : item.thumbnail;
                    is_ticket = item.prizename && item.prizename.indexOf('券') > -1;
                    is_jd_ticket = item.prizename && item.prizename.indexOf('京东') > -1;
                    if(item.visible && !is_ticket) {
            __p.push('            <li class="item bBor tBor">\r\n\
                <div class="pic trblBor"><img src="');
_p(head_url);
__p.push('"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">');
_p(item.prizename || item.name);
__p.push('</p>\r\n\
                    <p class="date">');
_p(time);
__p.push('</p>\r\n\
                </div>\r\n\
            </li>');

                    } else {
                        itemClass = is_jd_ticket? 'jd' : 'dz';
                        time = is_jd_ticket? item.cdkey : time;
            __p.push('            <li class="item trblBor ticket ');
_p(itemClass);
__p.push('">\r\n\
                <div class="wrap">\r\n\
                    <div class="ticket-inner">\r\n\
                        <div class="price"><span>');
_p(item.price);
__p.push('</span></div>\r\n\
                        <p class="ticket-num"><span class="num">');
_p(item.score);
__p.push('</span><span>积分</span></p>\r\n\
                    </div>\r\n\
                    <div class="main" data-action="touch">\r\n\
                        <p class="text" style="user-select: none;-webkit-user-select: none;">');
_p(item.prizename || item.name);
__p.push('</p>');
 if(is_jd_ticket) { __p.push('                        <p class="subtext">(长按兑换码复制使用)</p>');
 } __p.push('                        <p class="date" >');
_p(time);
__p.push('</p>\r\n\
                    </div>');
 if(is_jd_ticket) { __p.push('                    <div class="right" data-action="get_coupon" data-name="jd_get_coupon">\r\n\
                        <div class="btn disabled"><span>使用</span></div>\r\n\
                    </div>');
 } __p.push('                </div>\r\n\
            </li>');

                    }
                }
            } else {
            __p.push('            <p>暂无兑换记录</p>');

            }
            __p.push('        </ul>\r\n\
    </div>');

return __p.join("");
},

'address': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['mobile-select-area','dialog']));
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-checkin-address','app-checkin-edit'], true));
__p.push('    ');

        var _data = data.data;
        _data.city = _data.city==='0'? '' : _data.city;
        var cities = {'北京':1,'上海':1,'天津':1,'重庆':1};
        var province = (_data.province && _data.province !== '0')? (cities[_data.province]? '' : _data.province + '省') : '';
    __p.push('    <div id="show_address" class="app-checkin-address">\r\n\
        <div data-id="address_info" data-id="name" class="address-wrap tBor bBor" style="');
_p((_data.name && _data.name !== '0')? '' : 'display: none');
__p.push('">\r\n\
            <div class="content bBor">\r\n\
                <div class="name-phone"><span data-id="name" class="name">');
_p(_data.name);
__p.push('</span><span data-id="phone" class="phone">');
_p(_data.phone);
__p.push('</span></div>\r\n\
                <div class="address"><span data-id="addr">');
_p(province + _data.city + _data.addr);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="bottom">\r\n\
                <div class="default"><i class="icon"></i><span>默认地址</span></div>\r\n\
                <div data-action="edit" class="edit"><i class="icon icon-edit"></i><span>编辑</span></div>\r\n\
                <div data-action="delete" class="trash"><i class="icon icon-trash"></i><span>删除</span></div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div data-id="no_address" class="no-address" style="');
_p((_data.name && _data.name !== '0')? 'display: none' : '');
__p.push('">\r\n\
            <div class="no-address-bg"><p class="text">请添加新地址</p></div>\r\n\
            <div data-action="create" class="add-address-wrap tBor"><div class="btn"><span>添加新地址</span></div></div>\r\n\
        </div>\r\n\
    </div>\r\n\
\r\n\
    <div id="edit_address" class="app-checkin-edit" style="display: none">\r\n\
        <ul class="edit-wrap">\r\n\
            <li class="item bBor tBor">\r\n\
                <span class="term">收货人</span>\r\n\
                <p class="content" data-id="name" contenteditable="true"><span class="info"></span></p>\r\n\
            </li>\r\n\
            <li class="item bBor">\r\n\
                <span class="term">联系方式</span>\r\n\
                <p class="content" data-id="phone"  contenteditable="true"><span class="info"></span></p>\r\n\
            </li>\r\n\
            <li class="item bBor">\r\n\
                <span class="term">所在地区</span>\r\n\
                <input type="text" data-id="city" class="info-input content" id="txt_area" value=""/>\r\n\
                <input type="hidden" id="hd_area" value="1,1"/>\r\n\
                <!--<p class="content" data-id="city" contenteditable="true"><span class="info"></span></p>-->\r\n\
            </li>\r\n\
            <li class="item bBor">\r\n\
                <span class="term">详细地址</span>\r\n\
                <p class="content" data-id="addr" contenteditable="true"><span class="info"></span></p>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <div data-action="save_address" class="confirm-wrap tBor"><div class="btn"><span>确认</span></div></div>\r\n\
    </div>');

return __p.join("");
},

'order': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-checkin-order','app-checkin-order-result'], true));
__p.push('    <div class="app-checkin-order">\r\n\
        <ul class="shop-list tBor">\r\n\
            <li class="item bBor">\r\n\
                <div class="pic trblBor"><img src="../img/gift-1.jpg"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">QQ猴年公仔</p>\r\n\
                    <p class="integral-num"><span class="num">800</span><span>积分</span></p>\r\n\
                </div>\r\n\
                <div class="right"><p class="text">X1</p></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <div class="address-wrap tBor bBor">\r\n\
            <div class="personal">\r\n\
                <div class="name"><span>收件人：何俊志</span></div>\r\n\
                <div class="num"><span>18025308405</span></div>\r\n\
            </div>\r\n\
            <div class="address"><span>配送地址：广东省深圳市南山区腾讯大厦15F</span></div>\r\n\
            <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
        </div>\r\n\
        <div class="information-list">\r\n\
            <div class="item tBor bBor">\r\n\
                <div class="text"><span>您还没有添加地址</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="add-address-wrap tBor"><div class="btn"><span>添加新地址</span></div></div>\r\n\
    </div>\r\n\
\r\n\
    <div class="app-checkin-order-result" style="display: none">\r\n\
        <!-- 兑换成功添加类名success，失败fail-->\r\n\
        <div class="result-wrap success">\r\n\
            <div class="result"></div>\r\n\
            <p class="tip">兑换成功，我们会尽快发货</p>\r\n\
            <p class="remain">积分余额：85</p>\r\n\
            <div class="again-btn"><span>重新兑换</span></div>\r\n\
        </div>\r\n\
        <ul class="shop-list tBor">\r\n\
            <li class="item bBor">\r\n\
                <div class="pic trblBor"><img src="../img/gift-1.jpg"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">QQ猴年公仔</p>\r\n\
                    <p class="integral-num"><span class="num">800</span><span>积分</span></p>\r\n\
                </div>\r\n\
                <div class="right"><p class="text">X1</p></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <div class="address-wrap tBor bBor">\r\n\
            <div class="personal">\r\n\
                <div class="name"><span>收件人：何俊志</span></div>\r\n\
                <div class="num"><span>18025308405</span></div>\r\n\
            </div>\r\n\
            <div class="address"><span>配送地址：广东省深圳市南山区腾讯大厦15F</span></div>\r\n\
            <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'act_first': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-checkin-exchange', 'app-checkin-order','app-checkin-order-result'], true));
__p.push('    <div id="frist" class="act-wrapper">\r\n\
        <ul class="list">\r\n\
            <li id="Act_qiandao" data-action="sign_in" class="item normal" role="button" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/iap/checkin.png)">\r\n\
                <div class="text-wrapper">\r\n\
                    <p class="sub-title" id="checkret">');
_p(data.text);
__p.push('</p>\r\n\
                </div>\r\n\
            </li>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'act_second': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var signCount = data['data']['sign_in_count'];
    __p.push('    <div id="second" style="display:none" class="app-checkin-exchange checkin">\r\n\
        <!-- 头部签到 S -->\r\n\
        <div class="main">\r\n\
            <div class="personal-center trblBor"><span>个人中心</span></div>\r\n\
            <!-- 头像 S -->\r\n\
            <div class="avatar-wrapper">\r\n\
                <p class="avatar" style="background-image: url(');
_p( data.userImg? data.userImg.replace(/^http:|^https:/, '') : '//qzonestyle.gtimg.cn/aoi/sola/20151130112348_mNOoJ4weaY.png');
__p.push(')"></p>\r\n\
                <p class="user-name">');
_p(data.nickname);
__p.push('</p>\r\n\
            </div>\r\n\
            <!-- 头像 E -->\r\n\
            <div class="integral-wrapper">');
 var points = data.totalSize.toString();__p.push('                <p class="integral" id="total_point">拥有');
 for(var i=0; i < points.length; i++) { __p.push('                    <span class="integral-num integral-num-');
_p(i+1);
__p.push('"><span class="num1">');
_p(points[i]);
__p.push('</span><span class="num2">');
_p(points[i]);
__p.push('</span></span>');
 } __p.push('                    积分\r\n\
                </p>\r\n\
            </div>\r\n\
            <!-- 签到 S -->\r\n\
            <div class="checkin-box">\r\n\
                <h2 class="box-title">已连续签到<span>');
_p(signCount);
__p.push('</span>天</h2>\r\n\
                <ul class="list">\r\n\
                    <!-- 已经签到的 添加.on -->');

                        var itemClass = '';
                        for(var i = 0; i < 4; i++){
                            itemClass = (signCount>i && signCount !== 7)? 'on' : '';
                    __p.push('                    <li class="item item_');
_p((i+1));
__p.push(' ');
_p(itemClass);
__p.push('">\r\n\
                        <span class="item-cont"><sapn class="checkin-num">');
_p(5*(i+1));
__p.push('</sapn><i class="icon icon-tick"></i></span>\r\n\
                        <h3 class="item-title">第');
_p(i+1);
__p.push('天</h3>\r\n\
                    </li>');
 } __p.push('                </ul>\r\n\
                <ul class="list">\r\n\
                    <!-- 已经签到的 添加.on -->');

                        var itemClass = '';
                        for(var i = 4; i < 7; i++){
                            itemClass = (signCount>i && signCount !== 7)? 'on' : '';
                    __p.push('                    <li class="item item_');
_p((i+1));
__p.push(' ');
_p(itemClass);
__p.push('">\r\n\
                        <span class="item-cont"><sapn class="checkin-num">');
_p(5*(i+1));
__p.push('</sapn><i class="icon icon-tick"></i></span>\r\n\
                        <h3 class="item-title">第');
_p(i+1);
__p.push('天</h3>\r\n\
                    </li>');
 } __p.push('                </ul>\r\n\
            </div>\r\n\
            <!-- 签到 E -->\r\n\
        </div>\r\n\
        <!-- 头部签到 E -->\r\n\
        <!-- 积分兑换 S -->\r\n\
        <div class="act-exchange">\r\n\
            <!-- 兑换礼物 S -->\r\n\
            <div class="box">\r\n\
                <div class="hd"><h4>积分换好礼（限量）</h4></div>\r\n\
                <div class="bd">\r\n\
                    <ul class="gift-list clearfix">');

                        var list = data.goodsList['data']['rule'];
                        var total_point,
                            head_url,
                            btn_text,
                            is_limit,
                            itemClass,
                            item;
                        for(var key in list) {
                            item = list[key];
                            itemClass = (item.budget.left && total_point >= item.score)? '' : 'not-enough';
                            btn_text = item.budget.left? '兑换' : '已抢光';
                            is_limit = item.name.indexOf('企鹅学生公仔') !== -1? 'limit' : '';
                            head_url = '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/gift-' + item.prizeid + '.jpg';
                            if(item.name.indexOf('京东') === -1 && item.visible) {
                    __p.push('                        <li class="item trblBor good ');
_p(is_limit);
__p.push('">\r\n\
                            <div class="pic bBor"><div class="info" style="background-image:url(');
_p(head_url);
__p.push(')"></div></div>\r\n\
                            <div class="title"><span>');
_p(item.name);
__p.push('</span></div>\r\n\
                            <div class="gift-num"><span class="num">');
_p(item.score);
__p.push('</span><span>积分</span></div>\r\n\
                            <p class="description" style="display: none">');
_p(item.name);
__p.push('</p>\r\n\
                            <!-- 积分不足加类名 not-enough -->\r\n\
                            <div class="btn ');
_p(itemClass);
__p.push('" data-id="');
_p(key);
__p.push('" data-action="exchange" onclick="javascript:if(!$(this).hasClass(\'not-enough\')) { pvClickSend(\'weiyun.act.exchange\'); }"><span>');
_p(btn_text);
__p.push('</span></div>\r\n\
                        </li>');

                            }
                        }
                    __p.push('                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- 兑换礼物 E -->\r\n\
            <!-- 兑换券 S -->\r\n\
            <div class="box" style="display: none">\r\n\
                <div class="hd"><h4>积分换券（限量）</h4></div>\r\n\
                <div class="bd">\r\n\
                    <ul class="ticket-list clearfix">');

                            var list = data.goodsList['data']['rule'];
                            var itemClass,
                                btn_text,
                                price,
                                arr,
                                item;

                            for(var key in list) {
                                item = list[key];
                                itemClass = (total_point < item.score || item.has_exchange || item.budget.left === 0)? 'not-enough' : '';
                                if(key == 2017) {
                                    itemClass = '';
                                }
                                head_url = '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/gift-' + item.prizeid + '.jpg';
                                btn_text = item.has_exchange? '已兑换' : (item.budget.left? '兑换' : '今日已兑完');
                                if(item.name.indexOf('京东') !== -1 && item.visible) {
                                    arr = item.name.match(/\d+/g);
                                    price = (arr && arr.length > 1)? parseInt(arr[1]) : 0;

                        __p.push('                        <li class="item good jd ');
_p(item.has_exchange? '' : 'good');
__p.push('">\r\n\
                            <div class="ticket-wrap">\r\n\
                                <div class="price-box">\r\n\
                                    <div class="price"><span>');
_p(price);
__p.push('</span></div>\r\n\
                                    <div class="integral-wrap">\r\n\
                                        <p class="text">京东券</p>\r\n\
                                        <p class="integral-num"><span class="num">');
_p(item.score);
__p.push('</span><span>积分</span></p>\r\n\
                                        <p class="description" style="display: none">');
_p(item.name);
__p.push('</p>\r\n\
                                    </div>\r\n\
                                </div>\r\n\
                                <!-- 积分不足加类名 not-enough -->\r\n\
                                <div class="btn ');
_p(itemClass);
__p.push('" data-name="');
_p(key);
__p.push('" data-action="jd_exchange" onclick="javascript:if(!$(this).hasClass(\'not-enough\')) { pvClickSend(\'weiyun.act.exchange\');}"><span>');
_p(btn_text);
__p.push('</span></div>\r\n\
                            </div>\r\n\
                        </li>');

                                }
                            }
                        __p.push('                    </ul>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- 兑换券 E -->\r\n\
            <div class="pop checkin show" id="j-pop" style="display: none">\r\n\
                <div class="layout">\r\n\
                    <div class="confirm-box">\r\n\
                        <div class="plate-wrapper">\r\n\
                            <i class="icon icon-plate-base">\r\n\
                                <i class="icon icon-plate trblBor"></i>\r\n\
                                <i class="icon icon-wave-wrapper">\r\n\
                                    <i class="icon icon-wave-base">\r\n\
                                        <i class="icon icon-wave"></i>\r\n\
                                    </i>\r\n\
                                </i>\r\n\
                                <i class="icon icon-plate-logo"></i>\r\n\
                            </i>\r\n\
                            <i class="icon icon-light">\r\n\
                                <i class="icon icon-light-cover"></i>\r\n\
                            </i>\r\n\
                        </div>\r\n\
                        <!-- 改变 <strong> 里面 -->\r\n\
                        <p class="cont">获得了<strong id="j-add-space"></strong>积分</p>\r\n\
                        <div class="btn-group" id="j-close">\r\n\
                            <button class="btn btn-block">确定</button>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <!-- 积分兑换 E -->\r\n\
        <!-- 兑换京东券弹窗 S -->\r\n\
        <div id="jd-box" class="ticket-dialog" style="display:none;">\r\n\
            <div id="jd-tips" class="box rule" style="display:none;">\r\n\
                <div class="hd">\r\n\
                    <h4>京东券使用规则</h4>\r\n\
                    <div class="confetti-bg"></div>\r\n\
                    <div class="icon icon-ticket-close" data-action="jd_close"></div>\r\n\
                </div>\r\n\
                <div class="bd">\r\n\
                    <div class="content">\r\n\
                        <p class="rule-item">*兑换后，得到一个兑换码，登入京东兑换页面，输入兑换码领取优惠券</p>\r\n\
                        <p class="rule-item">*每个用户每类额度的京东券限领一次</p>\r\n\
                        <p class="rule-item">*有效期：<span data-name="deadline">2016-12-12</span></p>\r\n\
                        <p class="rule-item" data-name="msg">*全品类通用</p>\r\n\
                        <p class="rule-item">*消耗<span data-name="cost" class="important">200</span>积分</p>\r\n\
                    </div>\r\n\
                    <!--<div class="btn-wrap">-->\r\n\
                    <div class="btn-wrap" data-name="confirm" data-action="confirm">\r\n\
                        <div class="btn"><span>立即兑换</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div id="jd-info" class="box redemption" style="display:none;">\r\n\
                <div class="hd">\r\n\
                    <h4>恭喜获得京东券兑换码</h4>\r\n\
                    <div class="confetti-bg"></div>\r\n\
                    <div class="icon icon-ticket-close" data-action="jd_close"></div>\r\n\
                </div>\r\n\
                <div class="bd">\r\n\
                    <div data-action="touch" class="ticket-wrap">\r\n\
                        <div class="ticket">\r\n\
                            <div class="price"><span data-name="jd_price" style="user-select: none;-webkit-user-select: none;">10</span></div>\r\n\
                            <div class="redemption-code"><span data-name="cdkey" style="user-select: all; -webkit-user-select: text;">a715c04aa191615b</span></div>\r\n\
                        </div>\r\n\
                    </div>\r\n\
                    <p class="txt" style="user-select: none;-webkit-user-select: none;">长按复制兑换码，进入换券页面领券</p>\r\n\
                    <div class="btn-wrap" data-name="jd_get_coupon" data-action="get_coupon">\r\n\
                        <div class="btn disabled"><span style="user-select: none;-webkit-user-select: none;">去领券</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <!-- 兑换京东券弹窗 E -->\r\n\
        <!-- 确认消耗积分弹窗 S -->\r\n\
        <div class="num-dialog" style="display:none;">\r\n\
            <div class="box">\r\n\
                <div class="hd"><p data-name="confirm_text"></p></div>\r\n\
                <div class="bd">\r\n\
                    <div data-action="cancel" class="btn"><span>取消</span></div>\r\n\
                    <div data-name="confirm" data-action="confirm" class="btn"><span>兑换</span></div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <!-- 确认消耗积分弹窗 E -->\r\n\
        <!-- 兑换成功弹窗 S -->\r\n\
        <div class="success-dialog" style="display:none;">\r\n\
            <div class="box">\r\n\
                <i class="icon icon-done"></i>\r\n\
                <p class="text">兑换成功</p>\r\n\
                <p class="tips">已开通1个月微云会员</p>\r\n\
                <div class="btn" data-action="confirm"><span>确定</span></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="error-dialog" style="display:none; width: 150px;\r\n\
          height: 100px;\r\n\
          background-color: rgba(0,0,0,0.7);\r\n\
          position: fixed;\r\n\
          top: 50%;\r\n\
          left: 50%;\r\n\
          margin: -0.5rem 0 0 -0.75rem;\r\n\
          border-radius: 5px;\r\n\
          z-index: 150;\r\n\
          color: #fff;\r\n\
          text-align: center;\r\n\
          font-size: 16px;">\r\n\
        <p class="text" style="margin-top: 30%">兑换失败</p>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
