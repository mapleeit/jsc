
//tmpl file list:
//mod_1/src/disk.tmpl.html
define.pack("./mod_1_tmpl",[],function(require, exports, module){
var tmpl = { 
'encodeHtml': function(s){return (s+'').replace(/[\x26\x3c\x3e\x27\x22\x60]/g,function($0){return '&#'+$0.charCodeAt(0)+';';});},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)},out=_p;
__p.push('    <div id="_disk_body" class="disk-view ui-view" data-label-for-aria="文件列表内容区域">\n        <!-- 文件列表 -->\n    </div>');

return __p.join("");
}
};
return tmpl;
});
