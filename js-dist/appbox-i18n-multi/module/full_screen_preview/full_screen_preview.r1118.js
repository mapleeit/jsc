//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/full_screen_preview/full_screen_preview.r1118",["lib","common","$"],function(require,exports,module){

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
//full_screen_preview/src/full_screen_preview.js

//js file list:
//full_screen_preview/src/full_screen_preview.js
/**
 * 全屏预览模块，在appbox中使用
 * @hibincheng 2013-07-15
 *
 */
define.pack("./full_screen_preview",["lib","common","$"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        constants = common.get('./constants'),

        downloader,//下载模块
        image_full_preview_size = '1024*1024',//全屏预览图片大小

        url_handler,//获取预览地址的处理函数
        undefined;

    var full_screen_preview = new Module('full_screen_preview', {
        _call_preview_image: function(url,file_name){
            window.external.PreviewImage && window.external.PreviewImage(url, file_name);
            //console.log('全屏预览图片启动：file.url:' + url, 'file.name:' + file_name);
        },
        /**
         * 全屏预览图片
         * @param file 要预览的图片文件对象
         * @private
         */
        _preview_image: function (file) {
            var file_name = file.get_name();
            if (url_handler) {
                full_screen_preview._call_preview_image(url_handler.call(null, file, true),file_name);
            } else if(downloader) {
                full_screen_preview._call_preview_image(downloader.get_down_url(file, {abs: image_full_preview_size}),file_name);
            } else {
                require.async('downloader', function (mod) {
                    downloader = mod.get('./downloader');
                    full_screen_preview._call_preview_image(downloader.get_down_url(file, {abs: image_full_preview_size}),file_name);
                });
            }
        },

        /**
         * 全屏预览文档文件对象
         * @param file
         * @private
         */
        _preview_doc: function (file) {
            var file_id = file.get_id(),
                folder_id = file.get_pid() || file.get_parent().get_id(),
                file_size = file.get_size(),
                file_name = file.get_name();
            if (file.is_offline_node && file.is_offline_node()) {
                //fsrc 离线的固定填2
                //fcat 离线文件的类别，如接收列表、发送列表
                file_name += '&fsrc=2&fcat=' + file.get_down_type();
            }
            window.external.PreviewDocument && window.external.PreviewDocument(folder_id, file_id, file_name, file_size + '');
            console.log('全屏预览文档启动：file.folder_id:' + folder_id, 'file.id:' + file_id, 'file.name:' + file_name, 'file.size:' + file_size + '');
        },


        /**
         * 全屏预览接口
         * @param file 文件对象
         * @param _url_handler 获取预览地址的处理函数
         */
        preview: function (file, _url_handler) {
            if (!file && !constants.IS_APPBOX) {
                console.log('参数错误');
            }
            url_handler = _url_handler;
            if (file.is_image()) {//图片
                this._preview_image(file);
            } else if (file.is_preview_doc()) {//文档
                this._preview_doc(file);
            } else {
                console.warn('该文件：' + file.get_name() + '不可预览');
            }
        }
    });

    return full_screen_preview;
});