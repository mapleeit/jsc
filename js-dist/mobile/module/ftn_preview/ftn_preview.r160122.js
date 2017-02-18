//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/ftn_preview/ftn_preview.r160122",["lib","common"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
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
//ftn_preview/src/ftn_preview.js
//ftn_preview/src/ftn_preview.tmpl.html

//js file list:
//ftn_preview/src/ftn_preview.js
/**
 * 手机web微云分享页文件预览
 * @author: xixinhuang
 * @date: 2015-06-29
 */
define.pack("./ftn_preview",["lib","common"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        browser = common.get('./util.browser'),
        req,
        MB_1 = 1024 * 1024,
        preview_types = {xls: 1, xlsx: 1, doc: 1, docx: 1, ppt: 1, pptx: 1, pdf: 1, txt:1, rtf: 1, rar: 1, zip:1, '7z':1},

        REQUEST_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/file_preview.fcg'),
        SHARE_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
        COMPRESS_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/compress_view.fcg');

    var file_type_map = {
        doc: 1,
        docx: 2,
        xls: 3,
        xlsx: 4,
        ppt: 5,
        pptx: 6,
        rtf: 7,
        pdf: 8,
        zip: 13,
        rar :14,
        '7z': 15,
        txt: 16
    };

    var viewport_content = $('#viewport').attr('content');

    var ftn_preview = new Module('ftn_preview', {

        /**
         * 对外接口
         * @param {FileNode} file 文件对象
         * @param {Object} extra 额外参数
         * @param {Function} success 请求成功回调
         * @param {Function} fail 请求失败回调
         */
        preview: function(file, extra, success, fail) {
            //不可预览的文件
            if(!this.is_can_preview(file)) {
                return;
            }

            var share_key;
            var share_pwd;
            var file_id = file.get_id();
            var file_pid = file.get_pid();
            var file_name = file.get_name();
            var file_size = file.get_size();
            if(extra && extra['share_key']) {
                share_key = extra['share_key'];
                share_pwd = extra['share_pwd'];
            }

            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);

            var req_cfg = {
                file_id: file_id,
                pdir_key: file_pid
            };
            var me = this;

            if(share_key) {
                req_cfg.share_key = share_key;
                req_cfg.pwd = share_pwd || '';
            }

            req = request.xhr_get({
                url: share_key ? SHARE_CGI : REQUEST_CGI,
                cmd: share_key ? 'WeiyunShareDocAbs' : 'DiskFileDocDownloadAbs',
                cavil: true,
                pb_v2: true,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: req_cfg
            }).ok(function(msg, body) {
	            if(success && typeof(success) == 'function') {
		            success(msg, body);
	            } else {
		            var host = me.translate_host(body['downloaddns']),
			            ip = body['downloadip'],
			            port = constants.IS_HTTPS ? 8443 : body['downloadport'], //预览服务https使用8443端口接入
			            rkey = body['downloadkey'],
			            file_type = file_type_map[file.get_type()] || 0,
			            path = '/ftn_doc_previewer',
			            html = (file_type == 13 || file_type == 14 || file_type == 15) ? 'h5_weiyun_compress_previewer.html' : 'h5_weiyun_previewer.html',

		            //preview_url = '//' + host + ':' + port + path + '/weiyun_previewer.html?rkey=' + rkey + '&filetype=' + file_type;
			            preview_url = constants.HTTP_PROTOCOL + '//' + host + ':' + port + path + '/' + html + '?rkey=' + rkey + '&filetype=' + file_type +
				            '&filename=' + encodeURIComponent(file_name) + '&filesize=' + file_size;

		            cookie.set('FTN5K', body['cookie'], {
			            domain: constants.DOMAIN_NAME,
			            path: '/'
		            });
		            window.location.href = preview_url;
	            }
            }).fail(function(msg, ret) {
	            if(fail && typeof(fail) == 'function') {
		            fail(msg, ret);
	            } else {
		            widgets.reminder.error(msg || '预览失败');
	            }
            });

            return this;
        },

        translate_host:function (host) {
            if(!host) {
                return host;
            }

            if(host.indexOf('.ftn.') > -1) {
                return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
            }

            return host.replace(/\.qq\.com/, '.weiyun.com');
        },

        do_preview: function(preview_url) {
            this.$ct && this.$ct.remove();
            var $iframe = $('<iframe frameborder="false" style="width:100%;position: fixed;top:0;left:0;transform: translate3d(0, 0, 0);"></iframe>');
            $iframe.css({
                'zIndex': '100',
                'height': $(window).height() + 'px'
            }).attr('src', preview_url).appendTo(document.body);

            this.$ct = $iframe;
        },

        is_can_preview: function(file) {
            var type = (file.get_type() || '').toUpperCase(),
                limit_size = (type === 'XLS' || type == 'XLSX')? constants.DOC_PREVIEW_SIZE_LIMIT['XLS'] : constants.DOC_PREVIEW_SIZE_LIMIT['DEFAULT'],
                limit_mb = limit_size/MB_1,
                is_pass_limit = file.get_size() > limit_size;

            if(0 && is_pass_limit) { // office预览，超过大小限制，则采用提示下载
                widgets.reminder.error('文件大于' + limit_mb + 'M，暂时无法在线预览。请保存到微云后，进入微云APP查看');
                return false;
            } else if(!preview_types[file.get_type()]){
                widgets.reminder.error('该文件类型不支持预览');
                return false;
            }
            return true;
        },

        destroy: function() {
            $('#viewport').attr('content', viewport_content);
            this.$ct && this.$ct.remove();
            this.$ct = null;

            $('#banner').show();
            $('#container').show();
        }
    });

    return ftn_preview;
})
//tmpl file list:
//ftn_preview/src/ftn_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'preview': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib'),
    text = lib.get('./text');
    __p.push('    <div data-no-selection class="preview_area" style="display: block; box-shadow: 0 0 9px #999;" data-label-for-aria="文件预览内容区域">\r\n\
        <span class="back-btn" id="call-back" style="z-index: 1000; left:10px; position: absolute"><span style="font-size:30px">返回</span></span>\r\n\
        <div data-id="content"></div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
