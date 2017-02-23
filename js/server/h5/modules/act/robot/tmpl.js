
//tmpl file list:
//robot/src/body.tmpl.html
define("club/weiyun/js/server/h5/modules/act/robot/tmpl",["weiyun/util/browser"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!DOCTYPE html>\r\n\
    <html lang="en">\r\n\
    <head>\r\n\
        <meta charset="UTF-8">\r\n\
        <title>机器人云云识图</title>\r\n\
        <meta charset="utf-8">\r\n\
        <meta http-equiv="Content-Language" content="zh-cn">\r\n\
        <meta name="author" content="Tencent-ISUX">\r\n\
        <meta name="Copyright" content="Tencent">\r\n\
        <meta name="keywords", content="">\r\n\
        <meta name="description" content="">\r\n\
\r\n\
        <meta name="HandheldFriendly" content="True">\r\n\
        <meta name="MobileOptimized" content="320">\r\n\
        <meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no" />\r\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">\r\n\
        <meta name="apple-mobile-web-app-capable" content="yes">\r\n\
        <meta name="apple-mobile-web-app-status-bar-style" content="black">\r\n\
        <meta name="format-detection" content="telephone=no,email=no" />\r\n\
\r\n\
        <link rel="stylesheet" type="text/css" href="//qzonestyle.gtimg.cn/qz-proj/wy-h5/act-pr-2016.css">\r\n\
\r\n\
    </head>\r\n\
<body>\r\n\
<!-- [ATTENTION!!] document.ready 后添加 .wy-anim-start -->\r\n\
<section id="container" class="wy-act-wrap wy-act-pr-wrap wy-anim-start">\r\n\
    <!-- S loading -->\r\n\
    <section id="robot_loading" class="wy-act-pr-load-wrap" style="display:none;">\r\n\
        <div class="cont">\r\n\
            <img class=\'logo-img\' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABaCAMAAAB0UnP8AAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8g2+bRAAAAK3RSTlMAD9sfBRf1npAvJOBDsVHswWEL8GvUPHA2iuZLzqWqgFsrZse7V7eFe3SWnzsQ+QAAB7FJREFUaN6sV9mWqjAQZF8TdnBAURDFJf//f/fQWWgF73FG62loTCpd3V1htN8gKNxdwxjLDXohmfZ12NeSYTg0sr5LcHfYAmHxvVSsAhFgGMT6UgqjFMfJd7Slp9BxJOf9K4n4odh/2PQipG/vjSApzS8wOKK8P4/xtOQvGv9ThiAGgpIsXxUNcMTBZwx6CQx7a7VICSQS2h/10h0YvFfvW+AYP+mrCqRwEWem6xna0QWOzQdJJNMGg3q0q6tL6T0NdE2CQprmZ0k4gaxLajABSnQZhNj+zxRwxFr2VsIQXFljAlL1f5Bogj6tdmzB0LAHlHLX/fTUar9CZgdVd9xsuitogLuX5aERisE2JDccRP+NI/mHgSFEPAx0zq4wNb3yQl4QC8l5fJ+AUPYImwsXYznsERLpRDVgNt5l6Fv2hAZtYzw1giHSyCcFrfdqHOXCtRujLEsDDcXmSQwdtNoiPv+9m0ccfKi3pmVZ9vRw0gCH6e8KeyAS7gaqvc8Q062MTIInyywA0NChBthOL69vUES83dM50sy7ED4KwY8vNd9NkYxfKXD/vXsxJNj8oXl1nmIDEhrMSfHEBXwp9srXsCgUV1dC2KbtopIWTMDROOCl+UBh/b+rfuCUptjf77z9iZ7wLNAnimRO0YffVeeiOJNe/7/jpYLOyxkH8qisDeEUF21WLkeFEhZmeOQFiQ3l1ABdzDDUlXduk4Sm2OdHJSJGvX6Zp3MSHXsCQRV7zLpAZUEYVsfQBbdUxsniZN/SgafTrJxqizUMGSA0DJF/uZbHTunkwm+OE51ZcM89mcvPN9SnPd+2jiqSutzzx2xJkcsVVo4/v/QTrHj+TKt2kKmJdIp9QU7ZC2+fwhd1pMvcBlwEI0WpmykPbkSrOWIJHrAwW6W4qk6JsOgc47Eys+lG/EkpY3icj6gnsAlLYMc7qEn1HlxEIKTe9VrvDfHYWnhHvOS4fpmHD7XIIzM4XztLNv0SuSf7txYTmvo+qSxlwsaCIlFRFxaAeURCqSUSUU78ehjycKPa01lQ1Mo3+3m292oPbwyZQnw6qC7uIT4DgqP6C4PMeqaK46CEyvSo3ielYewG6nUwcejzLT/kkt0CSZZZyC+MnK/tEgag8DjKu98KKkJ++gxPIB+bm5YmDu9tCMdwlS1Qoz4Mbu04tpvZT0ZtFWRQ3RsU99a9EOyQC5i5NEKAbWO7O68R6Bteh/Z5ykae2RIHULV7il7AfqyVW3LbAgG2Amzta0aY8crdbJxazTsLYhh2dG+YgFMHy//RqbYG3+D7dXJFIK2ioYeot2ZictvHDOFU9JKA3B2g9V9U7187drakKAxAYfgkEBJCBGRTxAURVMz7v9+ETdDpdmZu5qq/KgsLkb+EQBmGhlOLzbpct6J29NMu5PmmKst1cuLzNRJWl/GNSHyl/JZT3UvwDRXqkRM7+nfO62p6k929exR4dHFBfev8+9OUw22vv5TmCoZ1C/QbmuADuzw6r0eZwE0OVL8JVm2GUcF3emH3UPiMNXk4fCW+8LVEh6hEXPeB7jm05m1hYRYV9xUdZ07XW2Hjz6QqkyRZF26EJ1tui3JdJVXpZzLCO5b568R8qCR+/Pjx48f/J8+GBBQB2BXG+GR87X74UgnDUuglNj5htMdwSICG9pMeiQ6nXu2iPRoHfuwJjI4cDKhW6BZZiknkvjmbutRqu1VaIqkBfgKgKHrWtrxb8HOj9vIOdzCQ2sfFxSYEaoXHA5OSvpOApSMT19Z9pUUe1EKIdCd8DCIbETHuF9LJNAYHasNRfcLzWTd5OTN02PZd1CUIQLTVCi5WsTAeYkzMkhAdd0wUugDiKVF08216wDfmBGGErARhzCyZSYMopc4YbF4SMuD2IkGkOea6+HOin2IQzLI0pZevEvZlRWASLtY1QH2YHhz3U8IGbG1daZpqaqSXlN4BRFIm3te/guEsoeOdo3c7XSCVgP6YiIMg1lZR3fWmMk46qcbti98To/SGrCmbpiz9CHEGaPkp0f3d1ZaNw8HuRPUJI/+7RKMFZrQA0ewvzoXyyLgmYO+Jqn5NpCZR8YHEvoTUNgz2BfJMRF6wGnBeLxKZMEJPGKcpcXdqgVIMLKxaZDGMbdDxghfeM7EKT7eBU+zbOaG4cdlxQ4yJTG+4gD2IbAgBn8KwLYPRo/ViSjShrKJBnLl19EzYxLiHpDMkzg63u0TWY8DmivsVE+YUv52Ls2WdtSRWjEGsQD6dbltGMAkVpIb3ANQOR4HJJrDxSupe93OmRPbHEdUlfI8ZOQeYJl6DyYXjjavNhtIkzGsQNxb5qwSMEwdA83nMWssHU8ParYNh0DL95Oz/LfFwQkxaz8Ykc2S/CMYEyFPp/X1iFdnY6jUme4EnOzzA8OmUmPn/kuAJ1vo+n9oMM9XvNwmHRE4nfJnYym8TtE/stAt6eY6iO8VSmgPID0PCbSbbRSJz1CLBtDUn2rBPaPPOI7Sd97lUde3VCXi/izV0TMRxjkUC4XFOhKc+QSPL8c2WBJ2zPmOJ6ALwzGtTU8zaR3waE1rgJSG9vT8mtsNoUWf7cgBw5ei0ev+q20MeAQchMctFg4F1w0CNTbBThc7jdppWKU66+JHAkOt3Ln4BpQ5RS3Lw10MAAAAASUVORK5CYII=" alt="logo-腾讯微云" class="logo">\r\n\
            <div class="process-wrapper">\r\n\
                <!-- [ATTENTION!!] scaleX 的比例控制进度条 -->\r\n\
                <div id="process_bar" class="process-bar" style="-webkit-transform: scaleX(.5);"></div>\r\n\
            </div>\r\n\
            <p class="txt">Loading...</p>\r\n\
        </div>\r\n\
    </section>\r\n\
\r\n\
    <!-- S 首页 -->\r\n\
    <section id="robot_index" class="wy-act-pr-index-wrap" style="display:none;">\r\n\
        <h1 class="title">机器人云云识图</h1>\r\n\
        <!-- [ATTENTION!!] 页面加载完成的时候，加上 .anim-start -->\r\n\
        <div class="robot">\r\n\
            <b class="r-hand">\r\n\
                <b class="m-eye"></b>\r\n\
            </b>\r\n\
        </div>\r\n\
        <p class="txt">主人主人，我是机器人云云，今天又get到新技能了呢，智能识图！感觉自己就快要突破天际了呢，哈哈哈~不信，你来考考云云呗~</p>\r\n\
        <input id="input_file" class="btn-inner" accept="image/*" type="file" value="上传照片"/>\r\n\
        <div id="upload_photo" data-id="robot_input" class="btn">\r\n\
            <!-- [ATTENTION!!] 点击时添加 .hover -->\r\n\
            <!--<button class="btn">上传照片</button>-->\r\n\
        </div>\r\n\
    </section>\r\n\
\r\n\
    <!-- S 识别过程页 -->\r\n\
    <section id="robot_process" class="wy-act-pr-scan-wrap with-frame" style="display: none">\r\n\
        <div class="box-wrap">\r\n\
            <!-- [ATTENTION!!] 用户上传的图片，放在 .img 的 bgimg 属性中 -->\r\n\
            <!-- [ATTENTION!!] 图片要计算宽高比例，放在 -->\r\n\
            <b class="img"  style="width:288px; height:190px; "></b>\r\n\
            <!-- 屏幕的扫描光束 -->\r\n\
            <b class="scaner-light"></b>\r\n\
            <!-- 遮罩 -->\r\n\
            <b class="upl-img"></b>\r\n\
            <!-- tv, :before :after 是两条天线 -->\r\n\
            <b class="box"></b>\r\n\
        </div>\r\n\
\r\n\
        <!-- 机器人 -->\r\n\
        <div class="scan-robot">\r\n\
            <b class="robot"></b>\r\n\
        </div>\r\n\
\r\n\
        <!-- 文案 -->\r\n\
        <h1 class="txt">云云思考中,稍等片刻</h1>\r\n\
    </section>\r\n\
\r\n\
    <!-- S 黄暴结果页 -->\r\n\
    <section id="robot_yellow" class="wy-act-pr-porn-wrap with-frame wy-result" style="display:none;">\r\n\
        <div class="box-wrap">\r\n\
            <!-- [ATTENTION!!] 用户上传的图片，放在 .img 的 bgimg 属性中 -->\r\n\
            <!-- [ATTENTION!!] 图片要计算宽高比例，放在 -->\r\n\
            <b class="img"  style="width:288px; height:190px; "></b>\r\n\
            <!-- 遮罩 -->\r\n\
            <b class="upl-img"></b>\r\n\
            <!-- tv, :before :after 是两条天线 -->\r\n\
            <b class="box"></b>\r\n\
\r\n\
            <b class="decos">\r\n\
                <b class="circle"></b>\r\n\
                <b class="circle"></b>\r\n\
            </b>\r\n\
        </div>\r\n\
\r\n\
        <!-- 机器人 -->\r\n\
        <div class="porn-robot">\r\n\
            <b class="robot">\r\n\
                <b class="l-eye"></b>\r\n\
                <b class="r-eye"></b>\r\n\
            </b>\r\n\
\r\n\
            <h1 class="txt">好黄好暴力，主人你真是邪恶！</h1>\r\n\
        </div>\r\n\
\r\n\
        <!-- 按钮 -->\r\n\
        <div id="yellow_tools" class="btn-group">\r\n\
            <button data-id="retry" class="btn try" onclick="javascript:pvClickSend(\'weiyun.act.robot.retry\');">再试一次</button>\r\n\
            <button data-id="share" class="btn share" onclick="javascript:pvClickSend(\'weiyun.act.robot.share\');">分享</button>\r\n\
\r\n\
            <a data-id="follow" href="http://mp.weixin.qq.com/s?__biz=MjM5MTA1ODI4MA==&mid=405333355&idx=1&sn=449cc353ae829a1457f50f4caae37293&scene=0" class="btn-link"  onclick="javascript:pvClickSend(\'weiyun.act.robot.follow\');">关注微云</a>\r\n\
            <p class="youtu">技术支持 by <a href="http://open.youtu.qq.com/" class="btn-link">腾讯优图</a></p>\r\n\
        </div>\r\n\
\r\n\
    </section>\r\n\
\r\n\
    <!-- S 正常结果页 -->\r\n\
    <section id="robot_result" class="wy-act-pr-nor-wrap with-frame wy-result" style="display:none;">\r\n\
        <div class="box-wrap">\r\n\
            <!-- [ATTENTION!!] 用户上传的图片，放在 .img 的 bgimg 属性中 -->\r\n\
            <!-- [ATTENTION!!] 图片要计算宽高比例，放在 -->\r\n\
            <b class="img"  style="width:288px; height:190px; "></b>\r\n\
            <!-- 遮罩 -->\r\n\
            <b class="upl-img"></b>\r\n\
            <!-- tv, :before :after 是两条天线 -->\r\n\
            <b class="box"></b>\r\n\
\r\n\
            <b class="decos">\r\n\
                <b class="circle"></b>\r\n\
                <b class="circle"></b>\r\n\
            </b>\r\n\
\r\n\
            <h1 data-id="tag_name" class="txt">萝莉</h1>\r\n\
        </div>\r\n\
\r\n\
        <!-- 机器人 -->\r\n\
        <div class="nor-robot">\r\n\
            <b class="robot"></b>\r\n\
            <p data-id="tag_desc" class="txt">\r\n\
            </p>\r\n\
        </div>\r\n\
\r\n\
        <!-- 按钮 -->\r\n\
        <div id="robot_tools" class="btn-group">\r\n\
            <button data-id="retry" class="btn try" onclick="javascript:pvClickSend(\'weiyun.act.robot.retry\');">再试一次</button>\r\n\
            <button data-id="share" class="btn share" onclick="javascript:pvClickSend(\'weiyun.act.robot.share\');">分享</button>\r\n\
\r\n\
            <a data-id="follow" href="http://mp.weixin.qq.com/s?__biz=MjM5MTA1ODI4MA==&mid=405333355&idx=1&sn=449cc353ae829a1457f50f4caae37293&scene=0" class="btn-link"  onclick="javascript:pvClickSend(\'weiyun.act.robot.follow\');">关注微云</a>\r\n\
            <p class="youtu">技术支持 by <a href="http://open.youtu.qq.com/" class="btn-link">腾讯优图</a></p>\r\n\
        </div>\r\n\
    </section>\r\n\
\r\n\
    <!-- S 识别失败页 -->\r\n\
    <section id="robot_tips" class="wy-act-pr-err-wrap wy-result" style="display:none;">\r\n\
        <!-- 机器人 -->\r\n\
        <div class="err-robot">\r\n\
            <!-- 文案 -->\r\n\
            <h1 class="txt">识别失败，请再尝试一次\r\n\
                <b class="circle"></b>\r\n\
                <b class="circle"></b>\r\n\
            </h1>\r\n\
\r\n\
            <!-- 机器人零件 -->\r\n\
            <b class="l-eye"></b>\r\n\
            <b class="r-eye"></b>\r\n\
            <b class="screw01"></b>\r\n\
            <b class="screw02"></b>\r\n\
        </div>\r\n\
\r\n\
        <!-- 按钮 -->\r\n\
        <div data-id="retry" class="btn-group" onclick="javascript:pvClickSend(\'weiyun.act.robot.retry\');">\r\n\
            <button class="btn try">再试一次</button>\r\n\
        </div>\r\n\
    </section>\r\n\
\r\n\
    <!-- S 分享弹层-->\r\n\
    <section id="robot_share" class="wy-act-pr-share-wrap" style="display:none;">\r\n\
        <div class="robot">\r\n\
            <h1 class="txt">点击右上角，分享到朋友圈</h1>\r\n\
        </div>\r\n\
    </section>\r\n\
</section>\r\n\
<scr');
__p.push('ipt src="//imgcache.qq.com/club/qqdisk/web/js/lib/zepto-1.0.0.min.js?max_age=604800"></scr');
__p.push('ipt>\r\n\
<!--<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js?max_age=31104000"></scr');
__p.push('ipt>-->\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/act/robot/js/config.js?v140320"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'http://pingjs.qq.com/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    process(0);\r\n\
\r\n\
    (function(){\r\n\
        $(\'#robot_loading\').show();\r\n\
\r\n\
        seajs.use(\'index\', function(index){\r\n\
            var robot = index.get(\'./robot\');\r\n\
            robot.render(');
_p(JSON.stringify(data));
__p.push(');\r\n\
        });\r\n\
    })();\r\n\
\r\n\
    //显示进度条\r\n\
    function process(loading_number) {\r\n\
        var $bar = $(\'#process_bar\'),\r\n\
            me = this;\r\n\
        if(!me.loadingNumber) {\r\n\
            me.loadingNumber = 1;\r\n\
        }\r\n\
\r\n\
        setTimeout(function () {\r\n\
            if(this.hasLoaded){\r\n\
                $bar.css(\'-webkit-transform\', \'scaleX(1)\');\r\n\
                me.loadingNumber = 0;\r\n\
                return;\r\n\
            }\r\n\
\r\n\
            // 随机进度\r\n\
            me.loadingNumber = loading_number > me.loadingNumber? loading_number: me.loadingNumber;\r\n\
            me.loadingNumber += Math.floor(Math.random() * 10);\r\n\
\r\n\
            // 随机进度不能超过99%，以免页面还没加载完毕，进度已经100%了\r\n\
            if(me.loadingNumber > 95){\r\n\
                me.loadingNumber = 95;\r\n\
            } else{\r\n\
                process(me.loadingNumber);\r\n\
            }\r\n\
            $bar.css(\'-webkit-transform\', \'scaleX(.\' + me.loadingNumber + \')\');\r\n\
        }, 10);\r\n\
    }\r\n\
</scr');
__p.push('ipt>');

var browser = require('weiyun/util/browser')();
if(browser.QQ) {
__p.push('<scr');
__p.push('ipt src="//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152"></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    mqq.invoke("ui","setWebViewBehavior",{\r\n\
        "historyBack":"true",//true按返回时后退页面，false按返回时退出\r\n\
        "bottomBar":"false"//隐藏\r\n\
    });\r\n\
</scr');
__p.push('ipt>');

} else if(browser.WEIXIN) {
__p.push('<scr');
__p.push('ipt src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></scr');
__p.push('ipt>');

}
__p.push('</body>\r\n\
</html>\r\n\
\r\n\
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
                virtualURL: \'/mobile/act/robot.html\',\r\n\
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
