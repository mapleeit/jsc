//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/server/h5/modules/commontmpl/index",[],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//commontmpl/src/common.tmpl.html

//js file list:

//tmpl file list:
//commontmpl/src/common.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'common': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var title = data.title || '微云',	
			body = data.body || '';
	__p.push('	<!DOCTYPE html>\n	<html>\n		<head>\n			<meta charset="utf-8">\n			<title>');
_p(title);
__p.push('</title>\n			<meta name="description" content="">\n			<meta name="HandheldFriendly" content="True">\n			<meta name="MobileOptimized" content="320">\n			<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=1, user-scalable=no" />\n			<meta name="apple-mobile-web-app-capable" content="yes">\n			<meta name="apple-mobile-web-app-status-bar-style" content="black">\n			<meta name="format-detection" content="telephone=no">\n			<style>\n				.demo-header {\n					height: 65px;\n					background-color: #f8f8f8;\n				}\n			</style>\n		</head>\n		<body>');
_p(body);
__p.push('		</body>\n	</html>');

return __p.join("");
}
};
return tmpl;
});
