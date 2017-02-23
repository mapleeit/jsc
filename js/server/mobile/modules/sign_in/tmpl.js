
//tmpl file list:
//sign_in/src/tmpl/addr_mgr/addr_mgr.tmpl.html
//sign_in/src/tmpl/addr_mgr/edit_addr.tmpl.html
//sign_in/src/tmpl/captcha/captcha.tmpl.html
//sign_in/src/tmpl/goods_detail/exchange_success.tmpl.html
//sign_in/src/tmpl/goods_detail/goods_detail.tmpl.html
//sign_in/src/tmpl/history/history.tmpl.html
//sign_in/src/tmpl/index/index.tmpl.html
//sign_in/src/tmpl/index/more_prize.tmpl.html
//sign_in/src/tmpl/personal_center/personal_center.tmpl.html
define("club/weiyun/js/server/mobile/modules/sign_in/tmpl",["weiyun/util/appid","weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'addr_mgr': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __addressModel = data.__addressModel || {};

        var i, j, key, len, list, item;
    __p.push('    <div class="app-checkin-address j-container" style="display: none">\r\n\
        <ul class="address-list" style="display:');
_p(__addressModel.has_address ? 'block' : 'none');
__p.push(';">\r\n\
            <li class="item">\r\n\
                <div class="address-wrap tBor bBor">\r\n\
                    <div class="content bBor">\r\n\
                        <div class="name-phone"><span class="name">');
_p(__addressModel.name);
__p.push('</span><span class="phone">');
_p(__addressModel.phone);
__p.push('</span></div>\r\n\
                        <div class="address"><span>');
_p(__addressModel.address);
__p.push('</span></div>\r\n\
                    </div>\r\n\
                    <div class="bottom">\r\n\
                        <div class="edit" data-action="go_edit_address"><i class="icon icon-edit"></i><span>编辑</span></div>\r\n\
                        <div class="trash" data-action="remove_address"><i class="icon icon-trash"></i><span>删除</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </li>\r\n\
        </ul>\r\n\
\r\n\
        <div class="no-address" style="display:');
_p(__addressModel.has_address ? 'none' : 'block');
__p.push(';">\r\n\
            <div class="no-address-bg"><p class="text">请添加新地址</p></div>\r\n\
        </div>\r\n\
        <div class="btn-wrap btn-add tBor">\r\n\
            <!-- 不可点击.disable -->\r\n\
            <button class="btn ');
_p(__addressModel.has_address ? 'disable' : '');
__p.push('" data-action="go_edit_address"><span>添加新地址</span></button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'edit_addr': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __addressModel = data.__addressModel || {};
    __p.push('\r\n\
    <div class="app-checkin-edit j-container" style="display: none">\r\n\
    <ul class="edit-wrap j-edit-address">\r\n\
        <li class="item bBor tBor">\r\n\
            <span class="term">收货人</span>\r\n\
            <input class="content j-address-name" type="text" placeholder="" value="');
_p(__addressModel.name);
__p.push('">\r\n\
        </li>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">联系方式</span>\r\n\
            <input class="content j-address-phone" type="tel" placeholder="" value="');
_p(__addressModel.phone);
__p.push('">\r\n\
        </li>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">所在地区</span>\r\n\
            <!--<input type="text" class="info-input j-address-province-city" id="txt_area" value="');
_p(__addressModel.province ? __addressModel.province : '北京');
__p.push(' ');
_p(__addressModel.city ? __addressModel.city : '北京市');
__p.push('" readonly="readonly" data-value="1,1">-->\r\n\
            <input type="text" data-id="city" class="info-input content j-address-province-city" id="txt_area" value="');
_p(__addressModel.province ? __addressModel.province : '北京');
__p.push(' ');
_p(__addressModel.city ? __addressModel.city : '北京市');
__p.push('"/>\r\n\
            <input type="hidden" id="hd_area" value="1,1"/>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">详细地址</span>\r\n\
            <input class="content j-address-detail" type="text" placeholder="" value="');
_p(__addressModel.detail);
__p.push('">\r\n\
        </li>\r\n\
    </ul>\r\n\
    <div class="btn-wrap tBor">\r\n\
        <!-- 不可点击.disable -->\r\n\
        <button class="btn j-add-address-btn ');
_p(__addressModel.has_address ? '' : 'disable');
__p.push('" data-action="confirm_edit_address"><span>确认</span></button>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'captcha': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var isHttps = data.isHttps || false;
    __p.push('    <scr');
__p.push('ipt src="');
_p(isHttps ? 'https://ssl.captcha.qq.com/template/TCapIframeApi.js?clientype=1&apptype=1&aid=543009514&rand=' + Math.random()
            : 'http://captcha.qq.com/template/TCapIframeApi.js?clientype=1&apptype=1&aid=543009514&rand=' + Math.random());
__p.push('"></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        window.capInit && capInit(document, {\r\n\
            callback: function(retJson) {\r\n\
                if (retJson.ret === 0) { // 验证成功\r\n\
                    var ticket = retJson.ticket;\r\n\
                    location.href += \'?captcha_ticket=\' + ticket;\r\n\
                }\r\n\
            },\r\n\
            showHeader: false\r\n\
        });\r\n\
    </scr');
__p.push('ipt>');

return __p.join("");
},

'exchange_success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};

        var __exchangeSuccessModel = data.__exchangeSuccessModel || {};
        var goodsInfo = __exchangeSuccessModel.goodsInfo || {};
        var addressInfo = __exchangeSuccessModel.addressInfo || {};
        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-order-result j-container" style="display: none">\r\n\
    <div class="result-wrap success">\r\n\
        <div class="result"><i class="icon icon-result"></i></div>\r\n\
        <p class="tip">');
_p(goodsInfo.pathway === 'lottery' ? '恭喜，抽中奖品' : '兑换成功');
__p.push('</p>\r\n\
        <p class="text">您可以在我的物品页面中查看兑换记录</p>\r\n\
    </div>\r\n\
    <ul class="shop-list">\r\n\
        <li class="item">\r\n\
            <div class="pic"><div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div></div>\r\n\
            <div class="main">\r\n\
                <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="right"><p class="text">X1</p></div>\r\n\
        </li>\r\n\
    </ul>');
 if (addressInfo.has_address) { __p.push('    <div class="address-wrap">\r\n\
        <div class="personal">\r\n\
            <div class="name"><span>收件人：');
_p(addressInfo.name);
__p.push('</span></div>\r\n\
            <div class="num"><span>');
_p(addressInfo.phone);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="address"><span>配送地址：');
_p(addressInfo.address);
__p.push('</span></div>\r\n\
        <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
    </div>\r\n\
    <div class="btn-wrap tBor">\r\n\
        <button class="btn" data-action="go_sign_in"><span>返回商城</span></button>\r\n\
    </div>');
 } else { __p.push('    <div class="btn-wrap tBor">\r\n\
        <button class="btn" data-action="go_edit_address"><span>填写地址</span></button>\r\n\
    </div>');
 } __p.push('</div>\r\n\
');

return __p.join("");
},

'goods_detail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __goodsDetailModel = data.__goodsDetailModel || {};
        var goodsInfo = __goodsDetailModel.goodsInfo || {};
        var signInInfo = __goodsDetailModel.signInInfo || {};

        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-order j-container" style="display: none">\r\n\
    <div class="inner">\r\n\
        <div class="pic">\r\n\
            <div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div>');
 if (!goodsInfo.time_valid) { __p.push('            <p class="tip">');
_p(goodsInfo.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('        </div>\r\n\
        <div class="infor">\r\n\
            <div class="main">\r\n\
                <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="right"><p class="text">X1</p></div>\r\n\
        </div>\r\n\
        <div class="address j-address" data-action="go_address_manage"><span>收货地址</span><i class="icon icon-more"></i></div>\r\n\
        <div class="rule">\r\n\
            <h4>');
_p(goodsInfo.rule_title);
__p.push('</h4>\r\n\
            <p>');
_p(goodsInfo.rule_text);
__p.push('</p>\r\n\
        </div>\r\n\
        <div class="btn-wrap tBor j-exchange-btn" data-action="popup_exchange_dialog"><button class="btn"><span>');
_p(goodsInfo.pathway === 'lottery' ? '参与抽奖' : '兑换');
__p.push('</span></button></div>\r\n\
    </div>\r\n\
\r\n\
    <!-- 弹窗浮层 -->\r\n\
    <div class="dialog j-dialog" style="display: none;">\r\n\
        <div class="box j-dialog-box">\r\n\
            <div class="hd"><button class="btn btn-close" data-action="withdraw_exchange_dialog"><i class="icon icon-close"></i></button></div>\r\n\
            <div class="bd">\r\n\
                <div class="infor">\r\n\
                    <div class="pic"><div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div></div>\r\n\
                    <div class="main">\r\n\
                        <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                        <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
                    </div>\r\n\
                    <div class="right"><p class="text">X1</p></div>\r\n\
                </div>\r\n\
                <div class="pay">\r\n\
                    <h5 class="title">');
_p(goodsInfo.pathway === 'lottery' ? '抽奖' : '兑换');
__p.push('支付<span class="j-total-point">（你的金币剩余');
_p(signInInfo.total_score);
__p.push('）</span></h5>\r\n\
                    <div class="price j-exchange-price-list">\r\n\
                        <!-- 选中态.act -->\r\n\
                        <span class="num act">');
_p(goodsInfo.score);
__p.push('</span>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="btn-wrap tBor">\r\n\
                    <!-- 不可点击.disable -->\r\n\
                    <button class="btn j-exchange-confirm ');
_p(signInInfo.total_score < goodsInfo.score ? 'disable' : '' );
__p.push('" data-action="');
_p(goodsInfo.pathway === 'lottery' ? 'confirm_lottery' : 'confirm_exchange');
__p.push('"><span>');
_p(goodsInfo.pathway === 'lottery' ? '参与抽奖' : '兑换');
__p.push('</span></button>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="mask j-dialog-mask" data-action="withdraw_exchange_dialog"></div>\r\n\
    </div>\r\n\
\r\n\
    <!-- 抽奖未抽中弹窗 -->\r\n\
    <div class="pop j-pop" style="display: none;">\r\n\
        <div class="box">\r\n\
            <div class="bd">\r\n\
                <p class="text">好遗憾！差点就抽中了</p>\r\n\
            </div>\r\n\
            <div class="ft">\r\n\
                <button class="btn j-pop-btn"><span>继续加油</span></button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="mask j-pop-mask"></div>\r\n\
    </div>\r\n\
</div>\r\n\
');

return __p.join("");
},

'history': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __historyModel = data.__historyModel || [];

        var i, j, key, item, len;
    __p.push('    <div class="app-checkin-history j-container" style="display: none">\r\n\
        <ul class="shop-list">');
 for (i = 0, len = __historyModel.length; i < len; i++) {
                item = __historyModel[i];
            __p.push('            <li class="item" ');
_p( item.is_old ? '' : 'data-action="go_exchange_success"');
__p.push(' data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-pathway="');
_p(item.pathway);
__p.push('">\r\n\
                <div class="pic"><img src="');
_p(item.img_url);
__p.push('"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">');
_p(item.name);
__p.push('</p>\r\n\
                    <span class="lottery">');
_p(item.pathway === 'lottery' ? '抽奖获得' : '兑换获得');
__p.push('</span>\r\n\
                </div>\r\n\
                <!--<div class="right">-->\r\n\
                    <!--<p class="express">顺丰速递</p>-->\r\n\
                    <!--<p class="express-num">运单号:754855823238</p>-->\r\n\
                <!--</div>-->\r\n\
            </li>');
 } __p.push('            <!--<li class="item">-->\r\n\
                <!--<div class="pic"><img src="../img/checkin-exchange-gift/gift-s-11290.jpg"></div>-->\r\n\
                <!--<div class="main">-->\r\n\
                    <!--<p class="text">QQ猴年公仔QQ猴年公仔QQ猴年公仔</p>-->\r\n\
                    <!--<span class="lottery">抽奖获得</span>-->\r\n\
                <!--</div>-->\r\n\
                <!--<div class="right">-->\r\n\
                    <!--<p class="express">准备配送</p>-->\r\n\
                <!--</div>-->\r\n\
            <!--</li>-->\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'index': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var rawData = data.rawData || {};
        var vmData = data.vmData || {};
        var __signInModel = vmData.__signInModel || {},
            __giftListModel = vmData.__giftListModel || {};

        var i, j, key, len, list, item;
    __p.push('    <scr');
__p.push('ipt type="text/javascript"> console.log(');
_p(JSON.stringify(data));
__p.push(')</scr');
__p.push('ipt>\r\n\
<div class="app-checkin-exchange j-index-container j-container" style="display: none">\r\n\
    <div class="hd">\r\n\
        <button class="btn btn-personal j-personal-center" data-action="go_personal_center"><i class="icon icon-personal"></i></button>\r\n\
        <div class="infor">\r\n\
            <i class="icon icon-calendar"></i>\r\n\
            <h2 class="text">今日已签到</h2>\r\n\
            <p class="sub-text j-signin-text">已连续签到');
_p(__signInModel.__signInCount);
__p.push('天，总金币：');
_p(__signInModel.__totalPoint);
__p.push('</p>\r\n\
        </div>\r\n\
        <div class="checkin-list">\r\n\
            <ul>');
 for (i = 0, len = __signInModel.__signInListModel.length; i < len; i++ ) {
                    item = __signInModel.__signInListModel[i];
                __p.push('                <li class="item-checkin ');
_p(__signInModel.__signInCount > i + 1 ? 'on' : '');
__p.push(' ');
_p(__signInModel.__signInCount === i + 1 ? 'act' : '');
__p.push('">\r\n\
                    <div class="num"><span>+');
_p(item.score);
__p.push('</span></div>\r\n\
                    <span class="day">');
_p(item.text);
__p.push('</span>\r\n\
                </li>');
 } __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="bd">');

            for (key in __giftListModel) {
                if (__giftListModel.hasOwnProperty(key)) {
                    list = __giftListModel[key];
        __p.push('        <div class="box ');
_p(key === '人气推荐' ? 'gift-hot' : 'gift-exchange' );
__p.push('">\r\n\
            <div class="box-hd bBor"><h4>');
_p(key);
__p.push('</h4></div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="gift-list clearfix">');
 for (i = 0, len = list.length; i < len; i++) {
                        item = list[i];
                    __p.push('                    <li class="item-gift rBor j-item-gift ');
_p( item.is_empty ? 'soldout' : '');
__p.push('" data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-action="go_goods_detail" data-pathway="');
_p(item.pathway);
__p.push('">\r\n\
                        <div class="pic">\r\n\
                            <div class="info" style="background-image:url(');
_p(item.image_url);
__p.push(')"></div>');
 if (!item.time_valid) { __p.push('                            <p class="tip">');
_p(item.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('                            ');
 if (item.is_empty) { __p.push('                            <div class="mask"><span>已抢光</span></div>');
 } __p.push('                        </div>\r\n\
                        <div class="title"><span>');
_p(item.name);
__p.push('</span></div>\r\n\
                        <div class="gift-num">');
 if (item.pathway === 'exchange') { __p.push('                            <i class="icon icon-coin"></i><span class="num">');
_p(item.score);
__p.push('</span>');
 } else if (item.pathway === 'lottery') { __p.push('                            <span class="lottery">抽奖获得</span>');
 } __p.push('                        </div>\r\n\
                    </li>');
 } __p.push('                </ul>\r\n\
            </div>\r\n\
        </div>');

                }
            }
        __p.push('        <div class="more-bar j-more-bar" data-action="go_more_prize">\r\n\
            <span>查看更多</span>\r\n\
            <i class="icon icon-more"></i>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>\r\n\
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
                virtualURL: \'/mobile/sign_in#sign_in\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    window.IS_TEST_ENV = ');
_p((plug('config') || {}).isTest);
__p.push(';\r\n\
    window.IS_MOBILE = ');
_p(window['g_weiyun_info'].is_mobile);
__p.push(';\r\n\
    window.APPID = ');
_p(require('weiyun/util/appid')());
__p.push(';\r\n\
    window.g_serv_taken = ');
_p(new Date() - window['g_weiyun_info'].serv_start_time);
__p.push(';\r\n\
    window.g_start_time = +new Date();\r\n\
</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\',  \'common\', \'sign_in\'], function($, lib, common, index){\r\n\
        index.get(\'./signin\').init(');
_p(JSON.stringify(rawData));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
},

'more_prize': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __morePrizeListModel = data.__morePrizeListModel || [];

        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-detail j-container" style="display: none">\r\n\
    <div class="box gift-exchange">\r\n\
        <div class="box-bd">\r\n\
            <ul class="gift-list clearfix">');
 for (i = 0, len = __morePrizeListModel.length; i < len; i++) {
                    item = __morePrizeListModel[i] || {};
                __p.push('                <!-- 礼品抢光.soldout -->\r\n\
                <li class="item-gift rBor ');
_p(item.is_empty? 'soldout' : '');
__p.push('" data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-action="go_goods_detail">\r\n\
                    <div class="pic">\r\n\
                        <div class="info" style="background-image:url(');
_p(item.image_url);
__p.push(')"></div>');
 if (!item.time_valid) { __p.push('                        <p class="tip">');
_p(item.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('                        <!-- 礼品抢光加上这个结构 -->');
 if (item.is_empty) { __p.push('                        <div class="mask"><span>已抢光</span></div>');
 } __p.push('                    </div>\r\n\
                    <div class="title"><span>');
_p(item.name);
__p.push('</span></div>\r\n\
                    <div class="gift-num">');
 if (item.pathway === 'exchange') { __p.push('                        <i class="icon icon-coin"></i><span class="num">');
_p(item.score);
__p.push('</span>');
 } else if (item.pathway === 'lottery') { __p.push('                        <span class="lottery">抽奖获得</span>');
 } __p.push('                    </div>\r\n\
                </li>');
 } __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'personal_center': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="app-checkin-personal j-container" style="display: none">\r\n\
        <div class="information-list">\r\n\
            <div class="item" data-action="go_history">\r\n\
                <div class="text"><span>我的物品</span><i class="icon icon-more"></i></div>\r\n\
            </div>\r\n\
            <div class="item" data-action="go_address_manage">\r\n\
                <div class="text"><span>收货地址</span><i class="icon icon-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
