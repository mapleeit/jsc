/**
 * 复制操作工具类
 * IE内核的appbox和IE6优先使用clipboardData，其它使用flash的zclip插件,如果IE7以上的且无flash则使用clipboardData
 * 使用时应先使用类方法can_copy()进行判断显示可使用复制
 * @author hibincheng
 * @date 2013-09-09
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        constants = require('./constants'),
        console = lib.get('./console'),

        ie = $.browser.msie,
        ie6 = ie && $.browser.version < 7,
        MOVIE_PATH = require.resolve('publics/plugins/ZeroClipboard/') + 'WyZeroClipboard.swf',

        __has_flash,
        flash_hover_class = 'flash-hover',
        singleton_clip,

        undefined;

    var Copy = inherit(Event, {
        /**
         *
         * @param {Object} cfg:
         *                {String} container_selector 复制功能的区域容器选择器
         *                {String} target_selector 复制按钮选择器
         * eg: new Copy({
         *    container_selector: '#copy_container',
         *    target_selector: '[data-clipboard-target]'
         * })
         */
        target_selector: '[data-clipboard-target]',//默认
        container_selector: null,
        constructor: function(cfg) {
            $.extend(this, cfg);
            // 非appbox 下的IE内核和非IE6且有flash的先初始化zclip
            if(!(constants.IS_APPBOX && ie) && !ie6 && has_flash()) {
                this._init_zclip();
            }
        },
        //IE使用clipboardData进行复制的方法
        ie_copy: function(text) {
            if ($.browser.msie && window.clipboardData) {
                var me = this;
                var ie_clipboard = window.clipboardData;

                setTimeout(function () {
                    if (ie_clipboard.getData('Text') == text) {
                        me.trigger('copy_done');
                    } else {
                        me.trigger('copy_error');
                    }
                }, 50);

                ie_clipboard.setData('Text', text || '');
                return true;
            }
            return false;
        },
        //初始化zclip插件
        _init_zclip: function() {
            var me = this;
            if(me._zclip_inited) {
                return;
            }

            // 加载剪切板
            require.async('wy_zclip', function () {
                var is_appbox = constants.IS_APPBOX;
                //bugfix 在视频云播页面不更新title
                var is_need_refresh = document.title.indexOf('微云视频') > -1? false : true;

                WyZeroClipboard.console = console;
                WyZeroClipboard.IS_APPBOX = is_appbox;
                WyZeroClipboard.setDefaults( {allowScriptAccess: "always",trustedDomains: 'www.weiyun.com' } );
                if(!singleton_clip) {
                    singleton_clip = new WyZeroClipboard(null, {
                        moviePath: MOVIE_PATH,
                        hoverClass: flash_hover_class//flash会影响到DOM的hover效果，所以要使用增加样式名来控制
                    });
                    if(is_need_refresh) {
                        document.title = is_appbox ? '微云' : '微云网页版';
                    }
                    singleton_clip.addEventListener('load', function(clip) {
                        if(is_need_refresh) {
                            document.title = is_appbox ? '微云' : '微云网页版';
                        }
                    });

                    singleton_clip.addEventListener('mousedown', function() {
                        var copy_text = singleton_clip.target_ctx.trigger('provide_text');
                        singleton_clip.setText(copy_text);
                    });
                    singleton_clip.addEventListener('complete', function() {
                        singleton_clip.target_ctx.trigger('copy_done');
                        // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug
                        if(is_need_refresh) {
                            document.title = is_appbox ? '微云' : '微云网页版';
                        }

                    });

                    singleton_clip.addEventListener('mouseout', function() {
                        singleton_clip.target_ctx.trigger('mouseout');
                    });
                }
               $(me.container_selector ? me.container_selector : 'body').on('mouseenter.copyfun', me.target_selector, function(e) {
                   me._$cur_target = $(this);
                   singleton_clip.setCurrent(me._$cur_target[0]);
                   singleton_clip.target_ctx = me;//保存当前copy对象的引用，后续事件触发的对象为该引用
                   me.trigger('mouseover');
                   e.stopPropagation();  //阻止事件冒泡，防止多次设置target_ctx
               });

               me._zclip_inited = true;
            });


        },

        get_$cur_target: function() {
            return this._$cur_target;
        },

        destroy: function() {
            if(!this._zclip_inited) {//ie使用原生clipboard不需要下面操作
                return;
            }
            this._$cur_target = null;
            if(singleton_clip.target_ctx == this) {
                singleton_clip.target_ctx = null;
            }
            if(this.container_selector) {
                $(this.container_selector).off('mouseenter.copyfun', this.target_selector);
            } else {
                $('body').off('mouseenter.copyfun', this.target_selector);
            }
        }
    });

    /**
     * 是否可进行复制操作
     * @returns {boolean}
     */
    Copy.can_copy = function() {
        if(has_flash()) {
            return true;
        } else if(ie) {
            return true;
        } else {
            return false;
        }
    }

    //helper
    var has_flash = function () {
        if (__has_flash !== undefined) {
            return __has_flash;
        }

        var hasFlash = false;
        var plugin;
        try {
            if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                hasFlash = true;
            }
        }
        catch (error) {
            plugin = navigator.mimeTypes["application/x-shockwave-flash"];
            if (plugin && plugin.enabledPlugin) {
                hasFlash = true;
            }
        }

        // for appbox
        if (!hasFlash) {
            hasFlash = window.external && window.external.FlashEnable && window.external.FlashEnable();
        }

        return __has_flash = !!hasFlash;
    }

    return Copy;
});