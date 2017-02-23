//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/file_qrcode/file_qrcode.r150609",["lib","common","$","dimensional_code_css"],function(require,exports,module){

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
//file_qrcode/src/file_qrcode.js
//file_qrcode/src/ui.js
//file_qrcode/src/file_qrcode.tmpl.html

//js file list:
//file_qrcode/src/file_qrcode.js
//file_qrcode/src/ui.js
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-1-6
 * Time: 上午10:13
 * To change this template use File | Settings | File Templates.
 */

define.pack("./file_qrcode",["lib","common","$","./tmpl","dimensional_code_css","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        update_cookie = common.get('./update_cookie'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        tmpl = require('./tmpl'),
        mini_tip = common.get('./ui.mini_tip'),
        undefined;

    require('dimensional_code_css');

    var file_qrcode = new Module('file_qrcode', {
        _ui: require('./ui'),

        render: function () {

        },
        show:function(files, is_client){
            var me = this,
                file = files[0],
                name = file.get_name(),
                size = file.get_readability_size(true),
                icon = file.get_type() || this.get_default_icon();
            me.create_file_qrcode_req(file,name,size,icon,is_client);
        },

        get_default_icon: function() {
            if(constants.IS_OLD) {
                return 'image';
            }
            return 'nor';
        },

        show_file_qrcode: function (url, name, size, icon) {
            var me = this;
            me._ui.show(url, name, size, icon);
        },

        //TODO:创建分享链接cgi联调
        create_file_qrcode_req: function (file,name,size,icon,is_client) {
            var me=this,
                _files = [],
                pid = file.get_pid();

            _files.push(file.get_id());
            var req_body;
            if(file.is_temporary && file.is_temporary()) {
                req_body = {
                    "qr_flag":1,//是否是二维码外链 0表示不是，1表示是
                    "share_type":12,//12表示中转站文件
                    dir_info_list: [{
                        dir_key: pid,
                        file_id_list: _files
                    }]
                }
            } else {
                req_body = {
                    pdir_key: pid,
                    file_id: _files,
                    "qr_flag": 1,//是否是二维码外链 0表示不是，1表示是
                    "share_type": 3,//0表示原始外链，2表示笔记分享，3表示单文件临时外链分享（外链有效期5分钟），4表示笔记临时外链分享
                    "share_business": 0 //0表示微云外链，1表示qzone分享

                };
            }
            request
                .xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunShareAdd',
                    body: req_body,
                    cavil: true,
                    pb_v2: true
                })
                .ok(function (msg, body) {
                    var _url = body['raw_url'];
                    me.show_file_qrcode(_url, name, size, icon);
                })
                .fail(function (msg, ret) {
                    if(!!is_client && (ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065)) {
                        update_cookie.update(function() {
                            me.create_file_qrcode_req(file,name,size,icon,is_client);
                        });
                    } else {
                        mini_tip.error(msg);
                    }
                })
        }

    });

    return file_qrcode;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-1-6
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define.pack("./ui",["lib","common","$","./tmpl"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        text = lib.get('./text'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),
        https_tool = common.get('./util.https_tool'),
        undefined;


    var ui = new Module('file_qrcode_ui', {
        _$file_qrcode_dialog: null,
        _$file_qrcode_pic: null,
        _$file_qrcode_name: null,
        _$file_qrcode_size: null,
        _$file_qrcode_icon: null,
        _$file_qrcode_mask:null,
        render: function () {

        },
        show: function (url, filename, size,icon) {
            var me = this;
            widgets.mask.show();
            me.get_$file_qrcode_dialog().appendTo($('body'));
            ui_center.listen(this._$file_qrcode_dialog);
            me.get_$dimensional_close().bind('click', function () {
                me.hide(icon);
                return false;
            });
            me.get_$dimensional_mask().bind('click',function(){
                me.hide(icon);
                return false;
            })
            me.set_pic(url);
            me.set_name(text.ellipsis_cut(filename,168,'...',text.create_measurer(me.get_$dimensional_name())));
            me.set_name_tip(filename);
            me.set_size(size);
            me.set_icon(icon);
            me.get_$file_qrcode_dialog().show();
        },

        hide: function (icon) {
            var me=this;
            widgets.mask.hide();
            this._$file_qrcode_dialog.hide();
            //移除添加的样式
            me.get_$dimensional_icon().removeClass('icon-'+icon + '-m');
            me.get_$dimensional_mask().unbind('click');

        },

        //获取下载弹出层对象
        get_$file_qrcode_dialog: function () {
            return this._$file_qrcode_dialog || ( this._$file_qrcode_dialog = $(tmpl.file_qrcode_box()) );
        },

        get_$dimensional_close: function () {
            return this._$file_qrcode_close || (this._$file_qrcode_close = this._$file_qrcode_dialog.find('#dimensional_close'));
        },

        get_$dimensional_pic: function () {
            return this._$file_qrcode_pic || (this._$file_qrcode_pic = this._$file_qrcode_dialog.find('#dimensional_code_pic'));
        },
        get_$dimensional_name: function () {
            return this._$file_qrcode_name || (this._$file_qrcode_name = this._$file_qrcode_dialog.find('#dimensional_code_name'));
        },
        get_$dimensional_size: function () {
            return this._$file_qrcode_size || (this._$file_qrcode_size = this._$file_qrcode_dialog.find('#dimensional_code_size'));
        },

        get_$dimensional_icon: function () {
            return this._$file_qrcode_icon || (this._$file_qrcode_icon = this._$file_qrcode_dialog.find('#dimensional_code_icon'));
        },

        get_$dimensional_mask:function(){
            return this._$file_qrcode_mask || (this._$file_qrcode_mask = $('#_widgets_mask'));
        },

        set_pic: function (url) {
            var _url = 'http://www.weiyun.com/php/phpqrcode/qrcode.php?data='
                + url + '&level=5&size=4';
            _url = https_tool.translate_url(_url);
            this.get_$dimensional_pic().attr('src', _url);
        },

        set_name: function (name) {
            this.get_$dimensional_name().text(name);

        },
        set_name_tip: function (name) {
            this.get_$dimensional_name().attr('title',name);

        },

        set_size: function (size) {
            this.get_$dimensional_size().text(size);
        },

        set_icon:function(icon){
            this.get_$dimensional_icon().addClass('icon-' + icon + '-m');
        }
    });

    return ui;
});


//tmpl file list:
//file_qrcode/src/file_qrcode.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'file_qrcode_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="dimensional_code" data-no-selection style="">\r\n\
        <div class="dimensional_img">\r\n\
            <img id=\'dimensional_code_pic\' alt="二维码">\r\n\
\r\n\
            <p>手机扫描二维码，可迅速将文件传到手机</p>\r\n\
        </div>\r\n\
        <div class="dimensional_txt">\r\n\
            <div class="dimensional_pic icon-image">\r\n\
                <i id=\'dimensional_code_icon\' data-quick-drag="" data-ico="" class="filetype icon icon-m"></i>\r\n\
            </div>\r\n\
            <div class="dimensional_desc">\r\n\
                <p id=\'dimensional_code_name\' title=\'\'>Despicable.Me.2010.卑鄙的我 双语字幕.HR-HDD...制作.png</p>\r\n\
                <span id=\'dimensional_code_size\'>5.7MB</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="dimensional_action"><a href="#" class="g-btn g-btn-blue" id=\'dimensional_close\'><span class="btn-inner">关闭</span></a></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
