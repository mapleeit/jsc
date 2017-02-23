//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/photo_guide/photo_guide.r140313",["lib","common","$","disk","photo_guide_css"],function(require,exports,module){

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
//photo_guide/src/photo_guide.js
//photo_guide/src/photo_guide.tmpl.html

//js file list:
//photo_guide/src/photo_guide.js
/**
 * 相册迁移至网盘引导
 * @author hibincheng
 * @date 2013-11-18
 */
define.pack("./photo_guide",["lib","common","$","./tmpl","disk","photo_guide_css"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        remote_config = common.get('./remote_config'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        disk = require('disk'),
        file_list = disk.get('./file_list.file_list'),
        ui_normal = disk.get('./file_list.ui_normal'),

        enable_guide_key = 'is_photo_user_first_access',//是否要引导的key字段名
        client_guide_key = 'is_first_client_photo_guide',
        client_guide_param = 'photoguide',


        undefined;

    require('photo_guide_css');


    var photo_guide = new Module('photo_guide', {

        render: function() {
            //remote_config.set(enable_guide_key, '');//字符串类型
            var me = this;
            var params = url_parser.parse_params(window.location.search);
            if(params['s'] === client_guide_param) {
                enable_guide_key = client_guide_key;
            }
            remote_config
                .get(enable_guide_key)
                .done(function(values) {
                    if(!values[0][enable_guide_key]) {
                        me._init_guide_if();
                    }
                })
        },

        _init_guide_if: function() {
            var root_node = file_list.get_root_node(),
                me = this,
                photo_dir;

            if(enable_guide_key === client_guide_key) { //客户端跳转引导
                me._init_guide();
                return;
            }
            if(!root_node) {
                me.listenToOnce(file_list, 'first_load_done', function() {
                    root_node = file_list.get_root_node();
                    photo_dir = me.get_wy_photo_dir(root_node);
                    if(photo_dir) { //有微云相册才初始化引导
                        me._init_guide();
                    }
                });
            } else{

                photo_dir = me.get_wy_photo_dir(root_node);
                if(photo_dir) { //有微云相册才初始化引导
                    me._init_guide();
                }
            }
        },

        /**
         * 展示引导图
         * @private
         */
        _init_guide: function() {
            var $el = this._$el = $(tmpl.guide()).appendTo($('body')),
                me = this;

            widgets.mask.show('photo_guide_mask', $el);
            $el.show();
            $el.on('click', '.btn', function(e) {
                e.preventDefault();
                me._on_ok();
            });
            $el.find('[tabindex=0]:first').focus();

            this.listenTo(global_event, 'press_key_esc', function () {
                me._on_ok();
            });
        },

        _on_ok: function () {
            var me = this,
                $el = me._$el;
            $el.remove();
            widgets.mask.hide('photo_guide_mask');
            me.set_photo_guide_done();
            if(enable_guide_key !== client_guide_key) { //客户端跳转引导是直接进入微云相册
                me.highlight_photo_dir();
            }
            ui_normal.set_should_switch_grid(true);//引导后，当进行微云相册后要切换为缩略图浏览模式
            this.stopListening(global_event, 'press_key_esc');
        },

        /**
         * 高亮“微云相册”文件夹
         */
        highlight_photo_dir: function() {
            var root_node = file_list.get_root_node(),
                me = this;
            if(!root_node) {
                this.listenToOnce(file_list, 'first_load_done', function() {
                    root_node = file_list.get_root_node();
                    me._highlight_photo_dir(root_node);
                });
            } else{

                me._highlight_photo_dir(root_node);
            }

        },

        _highlight_photo_dir: function(root_node) {
            var photo_dir = this.get_wy_photo_dir(root_node);
            if(photo_dir) {
                file_list.ui.highlight_$item(photo_dir.get_id());
            }
        },

        get_wy_photo_dir: function(root_node) {
            var kid_dirs = root_node.get_kid_dirs(),
                name = '微云相册',
                photo_dir,
                kid_node;

            //file_id 不固定，只能通过文件名查找
            for (var i = 0, len = kid_dirs.length; i < len ; i++) {
                kid_node = kid_dirs[i];
                if (kid_node.get_name() === name) {
                    photo_dir = kid_node;
                    break;//break;
                }
            }
            return photo_dir;
        },

        /**
         * 在服务端保存已引导过了，下次不用再显示了
         */
        set_photo_guide_done: function() {
            remote_config.set(enable_guide_key, 'true');//字符串类型
        }
    });


    return photo_guide;
});
//tmpl file list:
//photo_guide/src/photo_guide.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="photo-guide" style="diplay:none;">\r\n\
        <div class="img" aria-label="提示：微云相册和微云网盘合并了。按下ESC关闭这条消息。"></div>\r\n\
        <a href="#" class="btn"  tabindex="0" hidefocus="on">我知道了</a>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
