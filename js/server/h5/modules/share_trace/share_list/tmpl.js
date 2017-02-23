
//tmpl file list:
//share_list/src/empty.tmpl.html
//share_list/src/share_list.tmpl.html
define("club/weiyun/js/server/h5/modules/share_trace/share_list/tmpl",["weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['g-reset', 'g-err'], true));
__p.push('    <div class="wy-blank-wrap">\r\n\
        <div class="wy-blank">\r\n\
            <i class="wy-gray-logo"></i>\r\n\
            <p>分享链接是空的</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var util = data.util || {};__p.push('    ');

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
    __p.push('    ');
_p(require('weiyun/util/inline').css(['app-share-link-list'], true));
__p.push('    <div class="app-share-link-list">\r\n\
        <ul class="share-link-wrap j-share-link-list">');

                for (var i = 0, items = data.item || [], len = items.length; i < len; i++) {
                    var item = items[i];
            __p.push('            <li data-share-item\r\n\
                data-share-key="');
_p( item.share_key );
__p.push('"\r\n\
                data-share-name="');
_p(item.share_name);
__p.push('"\r\n\
                data-share-create-time="');
_p(item.create_time);
__p.push('"\r\n\
                data-share-pwd="');
_p(item.share_pwd);
__p.push('"\r\n\
                data-share-remain-time="');
_p(item.remain_time);
__p.push('"\r\n\
                data-share-icon="');
_p(item.share_icon);
__p.push('"\r\n\
                data-share-thumb-url="');
_p(item.thumb_url);
__p.push('"\r\n\
                class="wy-file-item j-share-item ');
_p((!item.share_name || !item.remain_time) ? 'fail' : '');
__p.push(' ');
_p(item.result===20002 ? 'expired' : '');
__p.push('">\r\n\
                <i class="icon icon-m icon-');
_p(util.customFileType(item.share_icon || ''));
__p.push('-m"></i>\r\n\
                <div class="file-describe bBor">\r\n\
                    <h3 class="file-name">');
_p(util.htmlEscape(item.share_name) || '该文件已删除');
__p.push('</h3>\r\n\
                    <span class="file-info">\r\n\
                        <span class="file-date">');
_p(util.dateformat(item.create_time, 'yyyy-mm-dd HH:MM'));
__p.push('</span>\r\n\
                        <span class="file-times">浏览');
_p(item.view_cnt);
__p.push('次</span>\r\n\
                        <span class="file-times">下载');
_p(item.down_cnt);
__p.push('次</span>\r\n\
                    </span>\r\n\
                </div>\r\n\
                <div class="right">');
if (!item.share_name) {__p.push('                    <span class="txt"></span>');
} else {__p.push('                    <i class="icon-grey-rarr"></i>');
}__p.push('                </div>\r\n\
            </li>');

                }
            __p.push('        </ul>\r\n\
        <div class="file-num j-file-count" ');
_p(data.done ? '' : 'style="display:none;"');
__p.push('>\r\n\
            <span>');
_p((data.item || []).length);
__p.push('个文件</span>\r\n\
        </div>\r\n\
        <div class="wy-file-loading j-loading" style="display:none;">\r\n\
            <i class="icon-load"></i>\r\n\
            <span>加载中...</span>\r\n\
        </div>\r\n\
    </div>\r\n\
    <scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club/qqdisk/web/js/lib/zepto-1.0.0.min.js?max_age=604800"></scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt>\r\n\
        seajs.use([\'$\', \'lib\',\'common\', \'share_trace\'], function($, lib, common, share_trace) {\r\n\
            var share_list = share_trace.get(\'./share_list\');\r\n\
            share_list.init(');
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
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/h5/share_list.html\',\r\n\
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
