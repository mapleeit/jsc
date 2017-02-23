
//tmpl file list:
//trace_detail/src/trace_detail.tmpl.html
define("club/weiyun/js/server/h5/modules/share_trace/trace_detail/tmpl",["weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var util = data.util || {};
        var viewUserList = data.view_user_list || [];
        var viewCount = data.view_count || 0;
        var downloadCount = data.download_count || 0;
        var viewFinishFlag = data.finish_flag || false;
        var params = data.params || {};
        var itemInfo = data.weiyun_share_list_item || {};

        util.formatSource = function (source) {
            source = JSON.parse(source || "{}").browser;
            var map = {
                'weixin': '来自微信',
                'qq': '来自QQ'
            };

            return map[source] || '来自Web';
        };

        // 把fileType方法包一层，adapter
        util.customFileType = function(ext) {
            var result;
            var fileType = function(name) {
                return util.fileType(name, 'v2');
            };

            if (ext === 'package' || !ext) {
                result = 'shared-link';
            } else {
                result = fileType(ext);
            }
            return result;
        };

        for (var j = 0, item; j < viewUserList.length; j++) {
            item = viewUserList[j]

            item.__nickname = util.htmlEscape(item.nickname) || '未知用户';
            item.__from_source = util.formatSource(item.from_source);
        }
    __p.push('    ');
_p(require('weiyun/util/inline').css(['app-share-link-list'], true));
__p.push('    <div class="app-share-link-detail">\r\n\
        <div class="main bBor j-main-div">\r\n\
            <div class="info">\r\n\
                <i class="icon icon-l icon-');
_p(util.customFileType(itemInfo.share_icon));
__p.push('-l"></i>\r\n\
                <h3 class="file-name">');
_p(util.htmlEscape(decodeURIComponent(itemInfo.share_name)));
__p.push('</h3>\r\n\
                <span class="file-info">\r\n\
                    <span class="file-date">');
_p(util.dateformat(parseInt(itemInfo.create_time), 'yyyy-mm-dd HH:MM'));
__p.push('</span>\r\n\
                </span>\r\n\
            </div>\r\n\
            <div class="other-info">\r\n\
                <div class="item rBor">\r\n\
                    <i class="icon icon-password"></i>\r\n\
                    <span>密码：\r\n\
                        <span>');
_p(util.htmlEscape(itemInfo.share_pwd) || '无');
__p.push('</span>\r\n\
                    </span>\r\n\
                </div>\r\n\
                <div class="item">\r\n\
                    <i class="icon icon-term"></i>\r\n\
                    <span>有效期：\r\n\
                        <span>');
if (parseInt(itemInfo.remain_time)) {__p.push('剩');
_p(Math.round(parseInt(itemInfo.remain_time) / 3600 / 24));
__p.push('天');
 } else {__p.push('已失效');
}__p.push('</span>\r\n\
                    </span>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="link-detail j-link-detail">\r\n\
            <div class="tab-hd bBor">\r\n\
                <ul class="wrap">\r\n\
                    <!-- active状态加.act -->\r\n\
                    <li class="item act j-view-btn">\r\n\
                        <span>浏览');
_p(viewCount || 0);
__p.push('次</span>\r\n\
                    </li>\r\n\
                    <li class="item j-download-btn">\r\n\
                        <span>下载');
_p(downloadCount || 0);
__p.push('次</span>\r\n\
                    </li>\r\n\
                </ul>\r\n\
            </div>\r\n\
\r\n\
            <div class="tab-bd">\r\n\
                <!-- 浏览 s -->\r\n\
                <div class="wrap">\r\n\
                    <ul class="share-guest-wrap j-view-list">');
 for (var i = 0, len = viewUserList.length; i < len; i++) { __p.push('                        ');
 var item = viewUserList[i]; __p.push('                        <li data-user-uin="');
_p( item.uin );
__p.push('" class="guest-item">\r\n\
                            <div class="avatar" style="background-image:url(');
_p(item.head_logo_url);
__p.push(')"></div>\r\n\
                            <div class="guest bBor">\r\n\
                                <h3 class="name">');
_p(item.__nickname);
__p.push('</h3>\r\n\
                                <span class="info">\r\n\
                                    <span class="from">');
_p(item.__from_source);
__p.push('</span>\r\n\
                                </span>\r\n\
                            </div>\r\n\
                            <div class="right">\r\n\
                                <span class="date">');
_p(util.dateformat(parseInt(item.op_time), 'mm/dd HH:MM'));
__p.push('</span>\r\n\
                            </div>\r\n\
                        </li>');
 } __p.push('                    </ul>\r\n\
                </div>\r\n\
                <!-- 浏览 e -->\r\n\
                <!-- 下载 s -->\r\n\
                <div class="wrap">\r\n\
                    <ul class="share-guest-wrap j-download-list">\r\n\
                        \r\n\
                    </ul>\r\n\
                </div>\r\n\
                <!-- 下载 e -->\r\n\
                <!-- 无记录 s -->\r\n\
                <div class="blank j-blank-div" ');
 if (viewUserList.length) { __p.push('style="display:none;"');
 } __p.push('>\r\n\
                    <p class="j-blank-text">暂无浏览记录</p>\r\n\
                </div>\r\n\
                <!-- 无记录 e -->\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="wy-file-loading j-loading" style="display:none;">\r\n\
            <i class="icon-load"></i>\r\n\
            <span>加载中...</span>\r\n\
        </div>\r\n\
    </div>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club//weiyun/js/publics/zepto/zepto-1.1.6.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',\'common\', \'share_trace\'], function($, lib, common, share_trace) {\r\n\
            var trace_detail = share_trace.get(\'./trace_detail\');\r\n\
            trace_detail.init({\r\n\
                params: ');
_p(JSON.stringify(params));
__p.push(',\r\n\
                viewUserList: ');
_p(JSON.stringify(viewUserList));
__p.push(',\r\n\
                viewFinishFlag: ');
_p(viewFinishFlag);
__p.push(',\r\n\
                viewCount: ');
_p(viewCount);
__p.push(',\r\n\
                downloadCount: ');
_p(downloadCount);
__p.push(',\r\n\
                itemInfo: ');
_p(JSON.stringify(itemInfo));
__p.push('            });\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/h5/trace_detail.html\',\r\n\
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
