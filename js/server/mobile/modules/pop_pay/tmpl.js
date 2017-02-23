
//tmpl file list:
//pop_pay/src/tmpl/body.tmpl.html
define("club/weiyun/js/server/mobile/modules/pop_pay/tmpl",["weiyun/util/appid","weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <section class="app-pop pop-pay">\r\n\
        <section class="pop-inner">\r\n\
            <section class="hd">\r\n\
                <!-- [ATTENTION!!] 换banner的时候，换的是 style="background-image:url()"" -->\r\n\
                <b class="banner j-banner" style="background-image: url(');
_p(data.banner_img_url);
__p.push(')">微云会员</b>\r\n\
            </section>\r\n\
\r\n\
            <section class="bd">\r\n\
                <ul class="list j-price-list">');

                    for (var i = 0, len = data.price_list.length; i < len; i++) {
                        var item = data.price_list[i];
                    __p.push('                        ');
 if (item.month === 'other') { __p.push('                        <li class="item trblBor ');
_p(item.cur_class ? 'cur' : '');
__p.push('" data-month="');
_p(item.month);
__p.push('" data-price="');
_p(item.price);
__p.push('"><input class="input-txt j-other-input" type="tel" value="');
_p(item.text);
__p.push('"></li>');
 } else { __p.push('                        <li class="item trblBor ');
_p(item.cur_class ? 'cur' : '');
__p.push('" data-month="');
_p(item.month);
__p.push('" data-price="');
_p(item.price);
__p.push('">');
_p(item.text);
__p.push('</li>');
 } __p.push('                    ');
 } __p.push('                </ul>\r\n\
                <p class="txt">');
_p(data.act_info.plain_text);
 if (data.act_info.need_show_link) { __p.push('<a href="');
_p(data.act_info.link);
__p.push('" class="link">');
_p(data.act_info.link_text);
 } __p.push('</a></p>\r\n\
                <div class="price bBor">\r\n\
                    <p class="num"><strong class="j-price-num">');
_p(data.init_price);
__p.push('</strong>元</p>\r\n\
                    <div class="ticket">暂无抵用券</div>\r\n\
                </div>\r\n\
                <p class="user bBor">');
_p(data.nick_name);
 if (data.wy_uf === '0') { __p.push('(');
_p(data.uin);
__p.push(')');
 } __p.push('</p>\r\n\
            </section>\r\n\
\r\n\
            <section class="ft">\r\n\
                <button class="btn btn-active j-pay-btn">立即开通</button>\r\n\
            </section>\r\n\
        </section>\r\n\
    </section>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">console.log(');
_p(JSON.stringify(data));
__p.push(');</scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        window.IS_TEST_ENV = ');
_p((plug('config') || {}).isTest);
__p.push(';\r\n\
        window.APPID = ');
_p(require('weiyun/util/appid')());
__p.push(';\r\n\
        window.g_start_time = +new Date();\r\n\
    </scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',  \'common\', \'pop_pay\'], function($, lib, common, index){\r\n\
            index.get(\'./pop_pay\').init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//imgcache.gtimg.cn/club/platform/lib/pay/smartpay.js?_bid=193\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\'>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/pop_pay\',\r\n\
                    virtualDomain: "h5.weiyun.com"\r\n\
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
