//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/third_party_iframe/third_party_iframe.r0903",["lib","common","$"],function(require,exports,module){

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
//third_party_iframe/src/ThirdPartyIframe.js
//third_party_iframe/src/third_party_iframe.js
//third_party_iframe/src/third_party_iframe.tmpl.html

//js file list:
//third_party_iframe/src/ThirdPartyIframe.js
//third_party_iframe/src/third_party_iframe.js
/**
 * 文档预览类
 * @author jameszuo
 * @date 13-5-8
 */
define.pack("./ThirdPartyIframe",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),

        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),
        widgets = common.get('./ui.widgets'),
        scroller = common.get('./ui.scroller'),

        tmpl = require('./tmpl'),

        damn_ie = $.browser.msie,
        nonsupport_fix = damn_ie && $.browser.version < 7,

        win_padding = 0,

        $win = $(window),
        set_timeout = setTimeout,


        undefined;

    /**
     * 构造函数
     * @param {Object} options
     *  - {String} url
     *  - {String} title
     *  - {Number} max_width 默认 915，单位像素
     * @constructor
     */
    var ThirdPartyIframe = function (options) {
        if (!options.url) {
            console.error('ThirdPartyIframe() 无效的参数url');
            return {};
        }

        var me = this;

        me._url = options.url;
        me._max_width = options.max_width || 915;

        me._$el = $(tmpl.third_party_ifr_box({ title: options.title })).hide().appendTo(document.body);
        me._$content = me._$el.find('[data-name=content]');
        me._$ifr = me._$content.children('iframe');
        me._$title = me._$content.children('[data-name=title]');
        me._$error = me._$content.siblings('[data-name=error]');
        me._$loading = me._$content.siblings('[data-name=loading]');

        me._init_ui_event();
    };

    ThirdPartyIframe.prototype = {

        show: function () {
            var me = this,
                $ifr = me._$ifr;

            // 事件 - 开始加载
            me.trigger('before_load');


            // 开始加载
            $ifr
                .off()
                .on('load.3rd_party_ifr', function () {
                    me.trigger('load');
                })
                .attr('src', me._url);


            me._$el.stop(false, true).fadeIn('fast');

            // resize 事件
            me.listenTo(global_event, 'window_resize', function () {
                me._reposition(false);
            });
            me._reposition(true);

            widgets.mask.show('ThirdPartyIframe', me._$el);

            if (nonsupport_fix) {
                scroller.go(0, 0);
            }

            // show 事件
            me.trigger('show');
        },

        /**
         * 关闭预览
         * @param {Boolean} animate 是否使用动画，默认true
         */
        close: function (animate) {
            animate = animate !== false;

            var me = this;
            if (me._$el) {

                if (animate) {
                    me._$el.stop(false, true).fadeOut('fast', function () {
                        $(this).remove();
                    });
                } else {
                    me._$el.remove();
                }

                me._url = null;
            }

            widgets.mask.hide('ThirdPartyIframe');

            // show 事件
            me.trigger('close');

            me.off().stopListening();
        },

        get_$iframe: function(){
            return this._$ifr;
        },

        _reposition: function (is_first) {
            var
                me = this,
                win_width = $win.width(),
                win_height = $win.height(),

                new_box_width = Math.min(win_width - win_padding, me._max_width),
                new_box_css = {
                    top: win_padding / 2,
                    left: (win_width - new_box_width) / 2,
                    width: new_box_width,
                    height: win_height - win_padding
                },
                new_iframe_css = {
                    height: new_box_css.height - me._$title.outerHeight() || 0
                };

            if (is_first) {
                new_box_css['position'] = 'absolute';
                me._$content.css(new_box_css);
                me._$ifr.css(new_iframe_css);
            } else {
                me._$content.animate(new_box_css, 'fast');
                me._$ifr.animate(new_iframe_css);
            }

            if (nonsupport_fix) {
                this._$el.height(win_height);
            }
        },

        _init_ui_event: function () {

            var me = this;

            set_timeout(function () {

                me._$el
                    // 点击外部关闭预览
                    .on('click.file_preview', function (e) {

                        if (!$(e.target).closest(me._$content)[0]) {

                            e.preventDefault();
                            e.stopImmediatePropagation();

                            me.close();
                        }
                    });

                me.listenToOnce(global_event, 'press_key_esc', function () {
                    me.close();
                });

            }, 400); // 0.N秒以后点击遮罩才隐藏，防止双击文件时导致图片显示后立刻隐藏的问题
        }
    };

    $.extend(ThirdPartyIframe.prototype, events);

    return ThirdPartyIframe;
});/**
 * 文档预览
 * @author jameszuo
 * @date 13-5-8
 */
define.pack("./third_party_iframe",["lib","common","$","./tmpl","./ThirdPartyIframe"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),

        ThirdPartyIframe = require('./ThirdPartyIframe'),

        cur_instance,

        undefined;

    var third_party_preview = new Module('third_party_preview', {

        /**
         * 创建一个DocPreview对象
         * @param options
         *  - {String} url
         *  - {String} title
         */
        create_preview: function (options) {
            if (cur_instance) {
                cur_instance.close();
            }

            return cur_instance = new ThirdPartyIframe(options);
        }

    });

    return third_party_preview;
});
//tmpl file list:
//third_party_iframe/src/third_party_iframe.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'third_party_ifr_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        text = lib.get('./text'),

        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        undef;
    __p.push('    <div data-no-selection class="viewer">\r\n\
        <div class="viewer-header">\r\n\
            <!-- 关闭按钮 -->\r\n\
            <a class="viewer-close" hidefocus="true" href="#">×</a>\r\n\
        </div>\r\n\
\r\n\
        <div data-name="content" class="viewer-docs">');
 if (data.title) { __p.push('                <h3 data-name="title" class="ui-title">\r\n\
                    <span class="ui-text">');
_p( text.text(data.title) );
__p.push('</span>\r\n\
                    <span class="ui-btns"><!--按钮动态加入--></span>\r\n\
                </h3>');
 } __p.push('\r\n\
            <!-- 用来预览的iframe -->\r\n\
            <iframe frameborder="0"></iframe>\r\n\
\r\n\
            <!-- 进度条 -->');
_p( tmpl.loading() );
__p.push('        </div>\r\n\
    </div>');

return __p.join("");
},

'loading': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'third_party_iframe';
    __p.push('    <div data-name="loading" class="viewer-init" style="display: none;">\r\n\
        <div class="ui-quota">\r\n\
            <div data-name="loading-bar" class="ui-quota-bar" style="width: 0%;"></div>\r\n\
        </div>\r\n\
        <p class="ui-quota-text">\r\n\
            <span data-name="loading-text">');
_p(_(l_key,'在加载中，请稍候'));
__p.push('</span>\r\n\
            <span>...</span>\r\n\
        </p>\r\n\
    </div>');

return __p.join("");
},

'error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-name="error" class="viewer-tips" style="display:none;">\r\n\
        <div class="ui-tips">\r\n\
            <i class="ui-icon icon-err"></i>\r\n\
            <p data-name="error_content" class="ui-text"></p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
