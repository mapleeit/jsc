
//tmpl file list:
//commontmpl/src/common.tmpl.html
define("club/weiyun/js/server/mobile/tmpl/commontmpl/tmpl",[],function(require, exports, module){
var tmpl = { 
'common': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var title = data.title || '微云',	
			body = data.body || '',
			cssString = data.cssString || '';
	__p.push('	<!DOCTYPE html>\r\n\
	<html>\r\n\
		<head>\r\n\
			<meta charset="utf-8">\r\n\
			<title>');
_p(title);
__p.push('</title>\r\n\
			<meta name="description" content="">\r\n\
			<meta name="HandheldFriendly" content="True">\r\n\
			<meta name="MobileOptimized" content="320">\r\n\
			<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no" />\r\n\
			<meta name="apple-mobile-web-app-capable" content="yes">\r\n\
			<meta name="apple-mobile-web-app-status-bar-style" content="black">\r\n\
			<meta name="format-detection" content="telephone=no">\r\n\
			<style>\r\n\
				.demo-header {\r\n\
					height: 65px;\r\n\
					background-color: #f8f8f8;\r\n\
				}\r\n\
			</style>');
_p(cssString);
__p.push('		</head>\r\n\
		<body>\r\n\
			<!-- 这里整体包上一层div -->\r\n\
			<!-- 避免iOS某些场景下冒泡不到body标签上引起的事件委托失效问题 -->\r\n\
			<div class="base_main_div">');
_p(body);
__p.push('			</div>\r\n\
		</body>\r\n\
	</html>');

return __p.join("");
}
};
return tmpl;
});
