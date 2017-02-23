
//tmpl file list:
//video_preview/src/video_preview.tmpl.html
define("club/weiyun/js/server/web/modules/video_preview/tmpl",["weiyun/util/inline"],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var util = data.util || {};
	var err = data.err || false;
	data.videoInfo = data.videoInfo || {};
	data.episodeInfo = data.episodeInfo || {};

	if (err) {
		data.filesize = '0K';
		data.filename = '加载错误';
	} else {
		data.filesize = util.prettysize(data.videoInfo.file_size, true, true) || '0K';
		data.filename = util.htmlEscape(data.videoInfo.filename) || '';
	}
__p.push('<!DOCTYPE html>\r\n\
<html>\r\n\
<head>\r\n\
	<meta charset="utf-8">\r\n\
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n\
	<title>微云视频-');
_p(data.filename);
__p.push('</title>\r\n\
	<meta name="keywords" content="QQ, 腾讯,微云, 分享, 网盘, 网络硬盘, U盘, 云存储, 传输, 存储, 同步, 备份, 拍照, 上传, 下载, 中转, 文件, 照片, 相册, 离线, 传文件, wifi, cloud, 微云网页版, weiyun, weiyun web">\r\n\
	<meta name="description" content="微云是腾讯公司为用户精心打造的一项智能云服务, 您可以通过微云方便地在手机和电脑之间同步文件、推送照片和传输数据。">');
_p(require('weiyun/util/inline').css(['page_video_css'], true));
__p.push('	');
_p(require('weiyun/util/inline').css(['page_home_delay_css'], true));
__p.push('	<!-- videojs ie8 compatible mode -->\r\n\
	<scr');
__p.push('ipt type="text/javascript" src="//img.weiyun.com/club//weiyun/js/publics/videojs/videojs-ie8.min.js?max_age=604800"></scr');
__p.push('ipt>\r\n\
</head>\r\n\
<body class="page-video">\r\n\
<!-- wrapper s -->\r\n\
<div class="layout-wrapper">\r\n\
    <!-- 头部 s -->\r\n\
    <div class="layout-header">\r\n\
        <div class="layout-header-inner">\r\n\
            <!-- 顶部导航 s -->\r\n\
            <div class="mod-nav clearfix">\r\n\
                <div class="logo">\r\n\
                    <a href="//www.weiyun.com" title="腾讯微云" target="_blank">腾讯微云</a>\r\n\
                </div>\r\n\
                <div class="btn-wrap">\r\n\
                	<a class="btn btn-l btn-download j-download-btn"><span class="btn-txt j-download-btn-size">下载(');
_p(data.filesize);
__p.push(')</span></a>\r\n\
                	<a class="btn btn-l btn-share j-share-btn"><span class="btn-txt">分享</span></a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- 顶部导航 e -->\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 头部 e -->\r\n\
    <!-- 主体 s -->\r\n\
    <div class="layout-body">\r\n\
        <div class="layout-body-inner">\r\n\
            <!-- 主要内容 s -->\r\n\
            <div class="layout-main">\r\n\
            	<div class="video-wrap">\r\n\
            		<div class="main">\r\n\
            			<video id="videoPlayer" height="573" width="1020" class="video video-js">\r\n\
						</video>\r\n\
						<!-- 错误信息提示 -->\r\n\
						<div class="video-states error j-err" ');
if (!err){__p.push('style="display:none;"');
}__p.push('>\r\n\
							<div class="tip-wrap">\r\n\
								<p class="tip j-err-msg">');
_p( err ? err.msg: '');
__p.push('</p>\r\n\
								<a class="link j-err-action"\r\n\
								   data-action="');
_p(err.action);
__p.push('"\r\n\
								   href="javascript:void(0)">');
_p(err.actionText ? err.actionText : '');
__p.push('								</a>\r\n\
							</div>\r\n\
						</div>\r\n\
            		</div>\r\n\
            	</div>');
 if (!err && data.episodeInfo && data.episodeInfo.file_list && data.episodeInfo.file_list.length !== 0) {__p.push('            	<div class="drama-wrap">\r\n\
            		<h4 class="title">视频</h4>\r\n\
            		<div class="video-list-wrap">\r\n\
            			<!-- width为160*n px，n为li的个数；滑动时更改left的值即可。 -->');
 var episodeList = data.episodeInfo.file_list || []; __p.push('	            		<ul class="video-list clearfix j-video-list" style="width:');
_p(episodeList.length * 160);
__p.push('px;left:0;">');

								for (var i = 0; i < episodeList.length; i++) {
									var item = episodeList[i];
 							__p.push('	            			<li class="video-list-item ');
_p((item.file_id === data.videoID) ? 'act' : '');
__p.push(' j-video-list-item" data-video-index="');
_p(i);
__p.push('" data-video-id="');
_p(item.file_id);
__p.push('">\r\n\
	            				<div class="video-list-item-pic j-video-list-item-pic">\r\n\
\r\n\
	            				</div>\r\n\
	            				<div class="video-list-item-txt">\r\n\
	            					<p class="video-title">');
_p(util.htmlEscape(item.filename));
__p.push('</p>\r\n\
	            					<p class="video-sub-title">文件大小：');
_p(util.prettysize(item.file_size, true, true));
__p.push('</p>\r\n\
	            				</div>\r\n\
	            			</li>');

								}
 							__p.push('	            		</ul>\r\n\
	            		<a class="pre j-pre-btn">\r\n\
	            			<i class="icon icon-pre"></i>\r\n\
	            		</a>\r\n\
						<a class="next j-next-btn"><!-- 不可点击状态加.disable -->\r\n\
							<i class="icon icon-next"></i>\r\n\
						</a>\r\n\
	            	</div>\r\n\
            	</div>');
}__p.push('            </div>\r\n\
            <!-- 主要内容 e -->\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 主体 e -->\r\n\
    <!-- foot s -->\r\n\
    <div class="layout-foot">\r\n\
        <!-- 帮助 s -->\r\n\
        <div class="mod-txt-list">\r\n\
        	<ul class="txt-list clearfix">\r\n\
        		<li class="txt-item"><a href="javascript:void(0)">版权声明</a>\r\n\
                    <!-- 版权声明内容 s -->\r\n\
                    <div class="mod-bubble-dropdown with-border bottom-left copyright-bubble-dropdown">\r\n\
                        <div class="txt-dropdown">\r\n\
                            <p>您应尊重相关作品著作权人合法权益，未经著作权人合法授权，不能违法上传、储存、分享他人作品。</p>\r\n\
                        </div>\r\n\
                        <b class="bubble-arrow-border"></b>\r\n\
                        <b class="bubble-arrow"></b>\r\n\
                    </div>\r\n\
                    <!-- 版权声明内容 e -->\r\n\
                </li>\r\n\
        		<li class="txt-item"><a href="//www.weiyun.com/complaint.html" target="_blank">投诉指引</a></li>\r\n\
        	</ul>\r\n\
        </div>\r\n\
        <!-- 帮助 e -->\r\n\
    </div>\r\n\
    <!-- foot e -->\r\n\
</div>\r\n\
<!-- wrapper e -->\r\n\
<scr');
__p.push('ipt src="//img.weiyun.com/c/=/club/weiyun/js/publics/seajs/sea.js,/club/weiyun/js/publics/seajs-plugins/seajs-combo.js?max_age=31104000"></scr');
__p.push('ipt>\r\n\
<!--<scr');
__p.push('ipt src="//img.weiyun.com/club/weiyun/js/publics/seajs/sea.js"></scr');
__p.push('ipt>-->');
_p(require('weiyun/util/inline').js(['configs_web_v2']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\', \'common\', \'video_preview\'], function ($, lib, common, video_preview) {\r\n\
        var video_preview = video_preview.get(\'./video_preview\');\r\n\
        video_preview.init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
<!-- pv 上报 -->\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
	(function() {\r\n\
		if (typeof pgvMain == \'function\') {\r\n\
			pgvMain("", {\r\n\
				tagParamName: \'WYTAG\',\r\n\
				virtualURL: \'/video_preview\',\r\n\
				virtualDomain: "www.weiyun.com"\r\n\
			});\r\n\
		}\r\n\
	})();\r\n\
</scr');
__p.push('ipt>\r\n\
\r\n\
</body>\r\n\
</html>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
