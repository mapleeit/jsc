//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","$","main"],function(require,exports,module){

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

        undef;



    var photo_bridge = new Module('photo_bridge', {

        ui: require('./ui'),

        render: function () {

        }

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

        $iframe,
        height,
        $win = $(window),
        $doc_el = $(document.documentElement),

        set_interval = setInterval,
        clear_interval = clearInterval,

        undef;


    var ui = new Module('photo_bridge_ui', {

        render: function () {
            this
                .on('activate', function () {
                    if (query_user.get_cached_user()) {
                        this._show();
                    } else {
                        this.listenToOnce(query_user, 'load', function () {
                            this._show();
                        });
                    }
                })
                .on('deactivate', function () {
                    this._hide();
                    this.stopListening(query_user, 'load');
                });

//            var user = query_user.get_cached_user();
//            if (user) {
//                this._show();
//            } else {
//                this.listenToOnce(query_user, 'load', function () {
//                    this._show();
//                });
//            }
        },

        _init_if: function () {
            if (!$iframe) {
                var url = 'http://www.weiyun.com/photo/index_en_v130906.html?ui_ver=' + constants.UI_VER + '&v=' + Math.random(); //code by bondli 增加时间戳,改名字，防止IE8下缓存

                if (constants.IS_QZONE) {
                    url = urls.make_url(url, {
                        qzone: 1
                    });
                }

                $iframe = $('<iframe name="photo_bridge_iframe" src="' + url + '" style="display:none;width:100%;top:0;left:0;" frameborder="no"/>')
                //.prependTo(document.body);
                if (constants.UI_VER === 'APPBOX') {
                    $('#_main_fixed_header').after($iframe);
                } else {
                    $('#_main_header_placeholder').after($iframe);
                }
            }
        },

        _show: function () {
            var me = this;
            me._init_if();

            $iframe.css({
                visibility: 'hidden',
                display: 'block'
            });
            if (constants.UI_VER === 'APPBOX') {
                $iframe.css({
                    paddingTop: me._get_main_ui().get_fixed_header_height() + 'px'
                });
            }

            me._when_iframe_load(function () {
                $iframe.css({
                    visibility: 'visible',
                    overflow: 'hidden'
                });

                var async_iframe_height = function () {
                    if (me.is_activated()) {
                        var main_header_height = me._get_main_ui().get_fixed_header_height();
                        $iframe.height(Math.max(iframe_doc_el.scrollHeight, $win.height() - main_header_height) - 10);
                    }
                };

                // 使iframe的高度和iframe body高度一致，避免出现滚动条 james
                var iframe_doc_el = $iframe[0].contentWindow.document.documentElement;

                // appbox 这里使用固定高度
                if (!constants.IS_APPBOX) {
                    set_interval(async_iframe_height, 500);
                }

                async_iframe_height();

                document.title = '相册 - 微云'; // 相册页面初始化flash后，title又会被改为 #m=photo。这里fix一下 - james
            });

            document.title = '相册 - 微云';
        },

        _hide: function () {
            var me = this;
            me._init_if();

            $iframe.hide();
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
        },

        _get_main_ui: function () {
            var main_mod = require('main'),
                main_ui = main_mod.get('./ui');
            return main_ui;
        }

    });

    return ui;
});