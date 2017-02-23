//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/photo_bridge/photo_bridge.r1118",["lib","common","$","main"],function(require,exports,module){

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
//photo_bridge/src/photo_bridge.js
//photo_bridge/src/ui.js

//js file list:
//photo_bridge/src/photo_bridge.js
//photo_bridge/src/ui.js
/**
 * 相册桥（使用iframe方式内嵌相册页面）
 * @author jameszuo
 * @date 13-6-19
 */
define.pack("./photo_bridge",["lib","common","$","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        mini_tip=common.get('./ui.mini_tip'),

        undef;



    var photo_bridge = new Module('photo_bridge', {
        
        params_invoke_map : {
            reload : 'if_reload'
        },

        ui: require('./ui'),

        render: function () {

        },
        
        if_reload : function(if_reload){
            if(if_reload){
                this.ui.refresh();
            }
        }

    });
    
    var do_photo_refresh = function(){
        photo_bridge.ui.refresh().done(function(){
            mini_tip.ok('照片列表已更新');
        });
    };
    photo_bridge.on('activate', function(){
        global_event.on('photo_refresh', do_photo_refresh);
    });
    photo_bridge.on('deactivate', function(){
        global_event.off('photo_refresh', do_photo_refresh);
    });

    return photo_bridge;
});/**
 * 相册桥UI（使用iframe方式内嵌相册页面）
 * @author jameszuo
 * @date 13-6-19
 */
define.pack("./ui",["lib","common","$","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),

        main_ui = require('main').get('./ui'),

        $iframe,

        set_interval = setInterval,
        clear_interval = clearInterval,

        itv_sync_photo,

        undef;


    var ui = new Module('photo_bridge_ui', {

        render: function () {
            var activating;
            this
                .on('activate', function () {
                    activating = query_user.on_ready(this._show, this);
                })
                .on('deactivate', function () {
                    this._hide();
                    activating.reject();
                });
        },
        
        refresh : function(callback){
            var def = $.Deferred();
            try{
                $iframe[0].contentWindow.WEIYUN_WEB.View.showPhotostream(1,1, function(){
                    def.resolve();
                });
            }catch(e){
                def.reject();
            }
            return def;
        },

        _init_if: function () {
            if (!$iframe) {
                var url = 'http://www.weiyun.com/photo/index_v131011.html?ui_ver=' + constants.UI_VER + '&v=' + Math.random(); //code by bondli 增加时间戳,改名字，防止IE8下缓存

                if (constants.IS_QZONE) {
                    url = urls.make_url(url, {
                        qzone: 1
                    });
                }

                $iframe = $('<iframe name="photo_bridge_iframe" src="' + url + '" style="display:none;" frameborder="no"/>')
                $('#_main_fixed_header').after($iframe);
            }
        },

        _show: function () {
            var me = this;
            me._init_if();

            var area_size = main_ui.get_main_area_size(),
                fix_head_height = main_ui.get_fixed_header_height();

            $iframe.css({
                display: 'block',
                position: 'absolute',
                right: 0,
                top: fix_head_height + 'px',
                width: area_size[0] + 'px',
                height: area_size[1] + 'px',
                border: '0'
            });

            var sync_thumbnail_size = function (area_height) {
                try {
                    var ifr_doc = $iframe[0].contentWindow.document,
                        thumbnail = ifr_doc.getElementById('thumbnail'),
                        tfilelist = ifr_doc.getElementById('tfilelist');
                    if(constants.UI_VER === 'APPBOX') {
                        thumbnail.style.height = Math.max(tfilelist.scrollHeight + 15, (area_height - 160), 383) + 'px';//appbox固定高度
                    } else {
                        thumbnail.style.height = Math.max(tfilelist.scrollHeight + 15, (area_height - 160)) + 'px';
                    }
                } catch (e) {
                }
            };

            this._when_iframe_load(function () {
                sync_thumbnail_size(area_size[1]);
            });

            clear_interval(itv_sync_photo);
            itv_sync_photo = set_interval(function () {
                var area_size = main_ui.get_main_area_size();
                $iframe.css({
                    width: area_size[0] + 'px',
                    height: area_size[1] + 'px'
                });
                sync_thumbnail_size(area_size[1]);
            }, 700);

            // document.title = '相册 - 微云';
        },

        _hide: function () {
            if ($iframe) {
                $iframe.hide();
            }

            clear_interval(itv_sync_photo);
        },

        _when_iframe_load: function (callback) {
            var me = this;
            // 如果iframe有内容，则立刻显示；若无内容，则轮询判断，出现内容后显示。
            if (me._iframe_load_detect()) {
                callback.call(me);
            } else {
                var itv = set_interval(function () {
                    if (me._iframe_load_detect()) {
                        clear_interval(itv);
                        callback.call(me);
                    }
                }, 50);
            }
        },

        _iframe_load_detect: function () {
            try {
                var ifr = $iframe[0];
                return ifr.contentWindow['page_ready'] === true;
            } catch (e) {
                return false;
            }
        }

    });

    return ui;
});