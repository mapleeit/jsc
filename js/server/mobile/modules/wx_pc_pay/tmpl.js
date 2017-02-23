
//tmpl file list:
//wx_pc_pay/src/tmpl/body.tmpl.html
define("club/weiyun/js/server/mobile/modules/wx_pc_pay/tmpl",["weiyun/mobile/lib/underscore","weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var _ = require('weiyun/mobile/lib/underscore'); __p.push('    ');
_p(require('weiyun/util/inline').css('app-wx-pay', true));
__p.push('    <div class="app-wx-pay">\r\n\
        <div class="main-container">\r\n\
            <div class="mod-head">\r\n\
                <div class="head-inner">\r\n\
                    <i class="icon icon-logo"></i>\r\n\
                    <span class="tit j-title"></span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="mod-input-new">\r\n\
                <span class="tit">开通账号：</span>\r\n\
                <span class="name">');
_p(data.nick_name || '');
__p.push('</span>\r\n\
            </div>\r\n\
            <div class="mod-btn">\r\n\
                <a href="javascript:void(0);" class="btn-open j-btn" data-type="');
_p(_.escape(data.pay_type));
__p.push('" data-params="');
_p(_.escape(data.pay_params));
__p.push('">确认开通</a>\r\n\
            </div>\r\n\
\r\n\
        </div>\r\n\
    </div>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript" src="//imgcache.qq.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    var _MAP = {\r\n\
        \'vip\': {\r\n\
            \'title\': \'开通微云会员\',\r\n\
            \'actionText\': \'确认开通\',\r\n\
            \'action\': \'vip_purchase\'\r\n\
        }\r\n\
    };\r\n\
\r\n\
    var $btn = $(\'.j-btn\'),\r\n\
        $title = $(\'.j-title\');\r\n\
\r\n\
    var type = $btn.data(\'type\'),\r\n\
        params = $btn.data(\'params\'),\r\n\
        item =_MAP[type] || _MAP[\'vip\'],\r\n\
        action = item.action,\r\n\
        actionText = item.actionText,\r\n\
        title = item.title;\r\n\
\r\n\
    $btn.text(actionText);\r\n\
    $title.text(title);\r\n\
    $btn.on(\'click\', function(e) {\r\n\
        e.stopPropagation();\r\n\
        e.preventDefault();\r\n\
\r\n\
        var aid,\r\n\
            openid = _getCookie(\'openid\'),\r\n\
            wxAppid2 = _getCookie(\'wy_appid\'),\r\n\
            openkey = _getCookie(\'access_token\');\r\n\
\r\n\
        var redirect_url;\r\n\
\r\n\
        switch (action) {\r\n\
            // 开通会员\r\n\
            case \'vip_purchase\':\r\n\
                aid = \'web_weixin_pay\';\r\n\
\r\n\
                redirect_url = \'https://pay.qq.com/h5/index.shtml?m=buy&c=subscribe&service=wyhyh5&appid=1450005554&aid=\' + aid +\r\n\
                    \'&wxAppid2=\' + wxAppid2 + \'&pf=sq.lz.khd&\' + \'openid=\' + openid + \'&sessionid=hy_gameid&sessiontype=wc_actoken&openkey=\' + openkey;\r\n\
                break;\r\n\
            default:\r\n\
                redirect_url = \'EMPTY PAGE\';\r\n\
        }\r\n\
\r\n\
        location.href = redirect_url;\r\n\
    });\r\n\
\r\n\
    var _getCookie = function(name){\r\n\
        var cookieValue = \'\';\r\n\
        if (document.cookie && document.cookie != \'\') {\r\n\
            var cookies = document.cookie.split(\';\');\r\n\
            for (var i = 0; i < cookies.length; i++) {\r\n\
                var cookie = $.trim(cookies[i]);\r\n\
\r\n\
                if (cookie.substring(0, name.length + 1) == (name + \'=\')) {\r\n\
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));\r\n\
                    break;\r\n\
                }\r\n\
            }\r\n\
        }\r\n\
        return cookieValue;\r\n\
    };\r\n\
\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    (function(){\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/h5/wx_pc_pay.html\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
