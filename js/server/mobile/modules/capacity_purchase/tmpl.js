
//tmpl file list:
//capacity_purchase/src/tmpl/body.tmpl.html
//capacity_purchase/src/tmpl/iap.tmpl.html
define("club/weiyun/js/server/mobile/modules/capacity_purchase/tmpl",["weiyun/util/inline","weiyun/util/appid","weiyun/util/prettysize"],function(require, exports, module){
var tmpl = { 
'bodyHTML': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var data = data || {};

    var key, item, i, len, it;
    __p.push('\r\n\
    <div class="act-buy-space j-top-div">\r\n\
        <div class="top-bar bBor">');
 if (data.__isVip) {__p.push('            <h4 class="text">尊贵的会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>\r\n\
            <a href="//h5.weiyun.com/vip?from=capacity_purchase" class="link">续费会员</a>');
 } else { __p.push('            <h4 class="text">会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>\r\n\
            <a href="//h5.weiyun.com/vip?from=capacity_purchase" class="link">开通会员</a>');
 } __p.push('        </div>\r\n\
        <div class="remain-wrap ');
_p(data.__remainSpace < Math.pow(1024, 3) ? 'warning' : '');
__p.push('">\r\n\
            <h2 class="title">\r\n\
                <span>剩余</span>\r\n\
            </h2>\r\n\
            <div class="remain-num"><span>');
_p(data.__remainSpaceText);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="space-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>总容量');
_p(data.__totalSpaceText);
__p.push('</span>\r\n\
            </h2>\r\n\
            <div class="space-bar">\r\n\
                <ul>');

                    for (key in data.__spaceBarModel) {
                    if (data.__spaceBarModel.hasOwnProperty(key)) {
                        item = data.__spaceBarModel[key];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('" style="');
_p(item);
__p.push('"></li>');

                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <div class="space-detail">\r\n\
                <ul>');

                    for (key in data.__spaceDetailModel) {
                    if (data.__spaceDetailModel.hasOwnProperty(key)) {
                        item = data.__spaceDetailModel[key];
                    
                        // buy list
                    if (Array.isArray(item)) {
                    for (i = 0, len = item.length; i < len; i ++) {
                        it = item[i];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('"');
_p(it.show ? '' : 'style="display: none;"');
__p.push('                        data-extraid-list="');
_p(it.extra_id);
__p.push('"\r\n\
                    >\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(it.spaceText);
__p.push('</span>\r\n\
                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(it.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');

                    }
                    } else {__p.push('                    <li class="item ');
_p(key);
__p.push('" ');
_p(item.show ? '' : 'style="display: none;"');
__p.push('>\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(item.spaceText);
__p.push('</span>');
 if (key === 'old') { __p.push('                            <i class="icon icon-question j-question">疑问\r\n\
                                <b class="mod-bubble-dropdown with-border top-left question-dropdown j-question-dropdown">\r\n\
                                    <b class="txt-dropdown">\r\n\
                                        <b>赠送容量在实行新的服务策略后对免费用户已取消，您是会员用户，我们将继续为您保留，感谢您对微云的支持。</b>\r\n\
                                    </b>\r\n\
                                    <b class="bubble-arrow-border"></b>\r\n\
                                    <b class="bubble-arrow"></b>\r\n\
                                </b>\r\n\
                            </i>');
 } __p.push('                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(item.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');
 } 
                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <ul>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="buy-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>购买容量</span>\r\n\
            </h2>\r\n\
            <ul class="buy-list">');

                for (key in data.__buyListModel) {
                if (data.__buyListModel.hasOwnProperty(key)) {
                    item = data.__buyListModel[key];
                __p.push('                <li class="item trblBor" data-type="');
_p(key);
__p.push('">\r\n\
                    <div class="main">\r\n\
                        <div class="space"><span>');
_p(key);
__p.push('</span></div>\r\n\
                        <div class="price"><span class="num">');
_p(item);
__p.push('</span><span>元/年</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <button class="btn j-purchase-btn"><span>购买</span></button>\r\n\
                    </div>\r\n\
                </li>');

                }}
                __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-act-buy-space'], true));
__p.push('    ');
_p(require('weiyun/util/inline').css(['g-err','g-component'], true));
__p.push('\r\n\
    <div id="body_container">');
_p(tmpl.bodyHTML(data));
__p.push('    </div>\r\n\
\r\n\
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
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',  \'common\', \'capacity_purchase\'], function($, lib, common, index){\r\n\
            var capacityPurchase = index.get(\'./capacity_purchase\');\r\n\
            capacityPurchase.init(');
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
                    virtualURL: \'/h5/capacity_purchase.html\',\r\n\
                    virtualDomain: "www.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>');

return __p.join("");
},

'iap': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    const prettysize = require('weiyun/util/prettysize');

    var data = data || {};

    var key, item, i, len, it;
    _p(require('weiyun/util/inline').css(['app-act-buy-space'], true));
__p.push('    ');
_p(require('weiyun/util/inline').css(['g-err','g-component'], true));
__p.push('    <div class="act-buy-space j-top-div">\r\n\
        <div class="top-bar bBor">');
 if (data.__isVip) {__p.push('            <h4 class="text">尊贵的会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>');
 } else { __p.push('            <h4 class="text">会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>');
 } __p.push('        </div>\r\n\
        <div class="remain-wrap ');
_p(data.__remainSpace < Math.pow(1024, 3) ? 'warning' : '');
__p.push('">\r\n\
            <h2 class="title">\r\n\
                <span>剩余</span>\r\n\
            </h2>\r\n\
            <div class="remain-num"><span>');
_p(data.__remainSpaceText);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="space-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>总容量');
_p(data.__totalSpaceText);
__p.push('</span>\r\n\
            </h2>\r\n\
            <div class="space-bar">\r\n\
                <ul>');

                    for (key in data.__spaceBarModel) {
                    if (data.__spaceBarModel.hasOwnProperty(key)) {
                        item = data.__spaceBarModel[key];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('" style="');
_p(item);
__p.push('"></li>');

                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <div class="space-detail">\r\n\
                <ul>');

                    for (key in data.__spaceDetailModel) {
                    if (data.__spaceDetailModel.hasOwnProperty(key)) {
                        item = data.__spaceDetailModel[key];
                    
                        // buy list
                    if (Array.isArray(item)) {
                    for (i = 0, len = item.length; i < len; i ++) {
                        it = item[i];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('"');
_p(it.show ? '' : 'style="display: none;"');
__p.push('                        data-extraid-list="');
_p(it.extra_id);
__p.push('"\r\n\
                    >\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(it.spaceText);
__p.push('</span>\r\n\
                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(it.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');

                    }
                    } else {__p.push('                    <li class="item ');
_p(key);
__p.push('" ');
_p(item.show ? '' : 'style="display: none;"');
__p.push('>\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(item.spaceText);
__p.push('</span>');
 if (key === 'old') { __p.push('                            <i class="icon icon-question j-question">疑问\r\n\
                                <b class="mod-bubble-dropdown with-border top-left question-dropdown j-question-dropdown">\r\n\
                                    <b class="txt-dropdown">\r\n\
                                        <b>赠送容量在实行新的服务策略后对免费用户已取消，您是会员用户，我们将继续为您保留，感谢您对微云的支持。</b>\r\n\
                                    </b>\r\n\
                                    <b class="bubble-arrow-border"></b>\r\n\
                                    <b class="bubble-arrow"></b>\r\n\
                                </b>\r\n\
                            </i>');
 } __p.push('                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(item.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');
 } 
                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <ul>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="buy-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>购买容量</span>\r\n\
            </h2>\r\n\
            <ul class="buy-list">');

                for (key in data.__buyListModelIAP) {
                if (data.__buyListModelIAP.hasOwnProperty(key)) {
                    item = data.__buyListModelIAP[key];
                __p.push('                <li class="item trblBor" data-type="');
_p(key);
__p.push('">\r\n\
                    <div class="main">\r\n\
                        <div class="space"><span>');
_p(key);
__p.push('</span></div>\r\n\
                        <div class="price"><span class="num">');
_p(item);
__p.push('</span><span>元/年</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <button class="btn j-purchase-btn" data-price="');
_p(item);
__p.push('"><span>购买</span></button>\r\n\
                    </div>\r\n\
                </li>');

                }}
                __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\'], function($){\r\n\
        $(\'.j-purchase-btn\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            var $this = $(this);\r\n\
\r\n\
            // 跳转ios客户端给的支付scheme\r\n\
            location.href = \'weiyun://arouse/capacity/\' + $this.closest(\'li\').data(\'type\').toLowerCase();\r\n\
        });\r\n\
\r\n\
        $(\'.j-question\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            var $dropdown = $(this).find(\'.j-question-dropdown\');\r\n\
            $dropdown.toggleClass(\'show\');\r\n\
        });\r\n\
\r\n\
        $(\'.j-top-div\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            $dropdown = $(\'.j-question-dropdown\');\r\n\
            if ($dropdown.hasClass(\'show\')) {\r\n\
                $dropdown.toggleClass(\'show\');\r\n\
            }\r\n\
        });\r\n\
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
                virtualURL: \'/h5/capacity_purchase.html?iap\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>');

return __p.join("");
}
};
return tmpl;
});
