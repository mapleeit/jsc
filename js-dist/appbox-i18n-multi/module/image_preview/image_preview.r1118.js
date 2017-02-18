//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/image_preview/image_preview.r1118",["lib","common","$","i18n"],function(require,exports,module){

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
//image_preview/src/image_preview.js
//image_preview/src/image_preview.tmpl.html

//js file list:
//image_preview/src/image_preview.js
/**
 * 图片预览
 * @author jameszuo
 * @date 13-5-7
 */
define.pack("./image_preview",["lib","common","$","./tmpl","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),
        easing = lib.get('./ui.easing'),

        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        scroller = common.get('./ui.scroller'),
        m_speed = common.get('./m_speed'),
        force_blur = lib.get('./ui.force_blur'),

        tmpl = require('./tmpl'),

        set_timeout = setTimeout, clear_timeout = clearTimeout,

        damn_ie = $.browser.msie,
        shaque_ie = damn_ie && ($.browser.version < 9 || document.documentMode < 9),
        shaque_ie6 = damn_ie && $.browser.version < 7 || document.documentMode < 7,

        error_image_url = constants.RESOURCE_BASE + '/img/500x500.png',

        load_start,

        options,
        ready = false,
        ie_complete_itv,

        $el, $major_img, $preload_img,
        $nav_prev, $nav_next,
        $download, $remove, $newsurl,
        $loading, $info, $bar, $raw,
        $button_back, $close,
        $win = $(window),

        math = Math,

        _ = require('i18n').get('./pack'),
        l_key = 'doc_preview',

        undefined;

    var image_preview = {

        /**
         * 开始预览
         * @param o
         *   {Number} total 总图片数，默认 1
         *   {Number} index 当前下标，默认 0
         *   {Function} get_url(index) 获取指定索引图片的 url（与 async_url_callback 只指定一个即可）
         *   {Function} async_url_callback(index, callback) 异步获取指定索引图片的 url（与 get_url 只指定一个即可）
         *
         * 具体用法如下：
         *  image_preview.start({
                support_nav: true,
                total: images.length,
                index: index,
                async_url_callback: function (index, is_nav, callback) {
                    ...
                    callback(index, major_url); // 已获取到URL的回调
                    return true;
                },
                remove: function (index, callback) {
                    ...
                    callback(); // 已删除的回调
                },
                raw: function (index) {
                    return 'http://xx.com/1.gif';
                }
                ...
         *  })
         */
        start: function (o) {
            var me = this;

            if ($.isFunction(o.get_url) && $.isFunction(o.async_url_callback)) {
                console.error('image_preview.start() 无效的参数');
                return;
            }

            o.total = o.total || 0;
            o.index = typeof o.index === 'number' ? o.index : 0;
            o.support_nav = o.support_nav === true; // 是否支持翻页

            options = o;

            if (!ready) {
                me._init();
            }
            /*
             * yuyanghe  判断该文件是否有文件URL字段。有则显示来源按钮，没有则默认不显示.
             */
            if (o.has_newsurl && o.has_newsurl(o.index)) {
                $newsurl.show();
            }


            // 显示
            if (!$el.is(':visible')) {
                $el.fadeIn('fast');
            }
            // 遮罩
            widgets.mask.show('image_previewer', $el, undefined, {opacity:0.9});

            //点击图片时焦点切换到外层（跳出iframe）
            force_blur();

            if (shaque_ie6) {
                $win.scrollTop(0);
            }

            this._reload(false);

            me.trigger('start');
        },

        add: function (total) {
            if (ready && options && total > 0) {
                options.total += total;
                this._update_status();
            }
        },

        close: function () {

            var me = this;

            $el.fadeOut('fast', function () {
                $major_img.attr('src', 'about:blank');
                if ($preload_img) {
                    $preload_img.off().attr('src', 'about:blank');
                }

                me._destroy();
            });

            widgets.mask.hide('image_previewer');

            me.trigger('close');
        },

        _init: function () {
            $el = $(tmpl.image_preview_box()).appendTo(document.body);

            var $els = $el.find('[data-id]'),
                $imgs = $els.filter('img'),
                $as = $els.filter('a');

            // 图片
            $major_img = $imgs.filter('img[data-id="major"]');

            // 钱一张
            $nav_prev = $as.filter('[data-id="prev"]');
            // 厚一张
            $nav_next = $as.filter('[data-id="next"]');
            // 下载
            $download = $as.filter('[data-id="down"]');
            // 删除
            $remove = $as.filter('[data-id="remove"]');
            // 原图
            $raw = $as.filter('[data-id="raw"]');
            // 来源
            $newsurl = $as.filter('[data-id="newsurl"]');
            //关闭按钮
            $close = $as.filter('[data-id="X"]');
            // 返回按钮
            $button_back = $as.filter('[data-id="back"]');

            // loading
            $loading = $el.children('[data-id="loading"]');
            // 工具条
            $bar = $els.filter('[data-id="bar"]');
            // 页码文本
            $info = $bar.children('[data-id="info"]');

            this._init_ui_event();
            this._init_statistics();

            ready = true;
        },

        _destroy: function () {
            $el.off().remove();
            this.off().stopListening();

            $(document).off('keyup.image_preview');
            clearInterval(ie_complete_itv);

            if (shaque_ie6) {
                this.stopListening(global_event, 'window_resize');
            }


            $major_img = $preload_img = $nav_prev = $nav_next = $download = $remove = $loading = $info = $bar = $raw = $button_back = $close = $newsurl = null;
            $el = options = null;

            ready = false;
        },

        _reload: function (is_nav) {
            options.index--;
            this._step(true, is_nav);  // 修复打开或删除图片时会上报“右翻页”操作的问题 - james
        },

        _prev: function (is_nav) {
            this._step(false, is_nav);
            this.trigger('nav_prev');
        },

        _next: function (is_nav) {
            this._step(true, is_nav);
            this.trigger('nav_next');
        },

        /**
         * 步进1个图片（向前或向后）
         * @param {Boolean} is_forward true=下一张，false=前一张
         * @param {Boolean} is_nav 是否是导航翻页
         * @private
         */
        _step: function (is_forward, is_nav) {
            // console.log('step (is_forward=' + is_forward + ', is_nav=' + is_nav + ')');

            var me = this,
                o = options;

            // 没有就退出
            if (o.total <= 0) {
                return this.close();
            }

            // 获取到URL的回调
            var goto_index = function (index, url) {
                o.index = to_index;
                me._load(url, is_nav);

                // 更新导航、页码等
                me._update_status();
            };


            // 向指定方向找第一个可用的 Item
            var to_index = o.index,
                step = is_forward ? +1 : -1;

            while (true) {
                to_index = math.max(0, math.min(to_index + step, o.endless ? Number.MAX_VALUE : o.total - 1));
//                if (to_index === o.index) {
//                    return this.close();
//                }

                // 同步方式获取URL
                if ($.isFunction(o.get_url)) {
                    var url = o.get_url.call(this, to_index, o);

                    // 已找到，加载
                    if (url && typeof url === 'string') {
                        goto_index(to_index, url);
                        break;
                    }
                    // 已到达边界，不执行任何动作，退出
                    else if ((!is_forward && to_index === 0) || (is_forward && !o.endless && to_index === o.total - 1)) {
                        break;
                    }
                }

                // 异步方式获取URL
                else if ($.isFunction(o.async_url_callback)) {
                    var has_url = o.async_url_callback.call(this, to_index, is_nav, function (index, url) {
                        if (ready) {
                            goto_index(index, url);
                        }
                    });
                    if (has_url) {
                        break;
                    }
                }
            }
        },

        /**
         * 加载指定URL的图片
         * @param {String} url
         * @param {Boolean} is_nav 是否是导航翻页
         * @private
         */
        _load: function (url, is_nav) {

            var me = this;

            me._load_start(is_nav);
            me._loading(true);

            if ($preload_img) {
                $preload_img.off();
            }
            $preload_img = $(new Image());

            // fix ie bug
            if ($.browser.msie && $.browser.version <= 10) {
                clearInterval(ie_complete_itv);
                ie_complete_itv = setInterval(function () {
                    var img = $preload_img[0],
                        comp = img && img.complete;

                    if (!img || comp) {
                        clearInterval(ie_complete_itv);
                        if (comp) {
                            set_timeout(function () {
                                me._load_ok(url);
                            }, 0);
                        }
                    }
                }, 60);
            }
            else {
                $preload_img.on('load.preview_image', function () {
                    me._load_ok(url);
                });
            }


            me.trigger('before_load', url);

            $preload_img
                .one('error.preview_image abort.preview_image', function () {
                    $(this).attr('src', error_image_url);
                })
                .attr('src', url);
        },

        _load_start: function (is_nav) {
            $major_img.stop(true, true).hide();
        },

        _loading: function (flag) {
            if (shaque_ie) {
                $loading.toggle(flag);
            } else {
                $loading.stop(true, true)[flag ? 'fadeIn' : 'fadeOut'](100);
            }
        },

        _load_ok: function (url) {
            var me = this,
                size = me._fix_size($preload_img),
                width = size.width,
                height = size.height,
                during = 400,
                org_css_text = $major_img[0].style.cssText;

            $major_img.replaceWith($preload_img);
            $major_img = $preload_img;

            $major_img[0].style.cssText = org_css_text;
            $major_img.removeAttr('width').removeAttr('height');

            // 边框淡入

            $major_img
                .stop(true, true)
                .css({
                    width: width + 'px',
                    height: height + 'px',
                    opacity: .3,
                    display: ''
                })
                .animate({
                    opacity: 1
                }, during, easing.get('easeOutExpo'), function () {
                    if ($major_img !== null) {
                        $major_img.css('opacity', '');
                    }
                });


            // loading
            me._loading(false);

            me.trigger('after_load', options.index, url);

        },

        _update_status: function () {
            var me = this,
                o = options;

            if (o.support_nav) {
                // 翻页按钮
                var has_prev = 0 < o.index && (!o.has_prev || o.has_prev.call(this, o));
                var has_next = o.endless || o.index < o.total - 1 && (!o.has_next || o.has_next.call(this, o));

                $nav_prev.toggle(has_prev);
                $nav_next.toggle(has_next);


                // 页码
                $info.text(text.format(o.endless ? _(l_key,'第{0}张') : _(l_key,'第{0}/{1}张'), [o.index + 1, o.total]));
            }

            // 原图
            if ($.isFunction(o.raw)) {
                var url = o.raw.call(this, o.index);
                if (url) {
                    $raw.attr('href', url);
                }
                $raw.toggle(!!url).off('click').on('click', function (e) {
                    me.trigger('raw');
                });
            } else {
                $raw.hide();
            }
        },

        // 下载
        _download: function (e) {
            if ($.isFunction(options.download)) {
                user_log('IMAGE_PREVIEW_DOWNLOAD');
                options.download.call(this, options.index, e);
            }
        },

        // 来源
        _goto: function (e) {
            if ($.isFunction(options.goto)) {
                options.goto.call(this, options.index, e);
            }
        },


        // 删除
        _remove: function () {
            var me = this;
            if ($.isFunction(options.remove)) {
                options.remove.call(this, options.index, function () {
                    me.trigger('remove');
                    //code by bondli 当用户点击了其他空白，把预览消除后这里的options为null了
                    if (options != null) {
                        options.total--;
                        me._reload(true);
                    }                                                                                            ;

                });
            }
        },

        // 返回
        _button_back: function () {
            if ($.isFunction(options.back)) {
                image_preview.close();
                options.back();
            }
        },

        _fix_size: function ($preload_img) {

            var img = $preload_img[0],
                img_width = img.width,
                img_height = img.height,
                img_url = img.src;

            if (img_url.indexOf(error_image_url) === 0) {
                var m = error_image_url.match(/\/(\d+)[^\d](\d+)/) || [];
                return {
                    width: parseInt(m[1]) || 500,
                    height: parseInt(m[2]) || 500
                };
            }

            var win_width = $win.width(),
                win_height = $win.height(),
                padding = 80,
                new_img_width = math.min(img_width, win_width - padding),
                new_img_height = math.min(img_height, win_height - padding),
                limit_side, // height / width
                limit_size = '',
                size = {};


            if (new_img_width === img_width && new_img_height === img_height) {
                size['width'] = img_width;
                size['height'] = img_height;
            }
            else {
                // 如果同时限制了高度和宽度，则只使用跟浏览器长宽比例变化大的哪一个边
                if (new_img_width < img_width && new_img_height < img_height) {
                    limit_side = 'height';
                    limit_size = new_img_height;

                    if ((img_width / new_img_width) > (img_height / new_img_height)) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }

                } else {
                    if (new_img_width < img_width) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }
                    else if (new_img_height < img_height) {
                        limit_side = 'height';
                        limit_size = new_img_height;
                    }
                }

                size[limit_side] = limit_size;
                if (limit_side === 'width') {
                    size['height'] = math.round(img_height / img_width * limit_size);
                } else {
                    size['width'] = math.round(img_width / img_height * limit_size);
                }
            }

            return size;
        },

        _init_ui_event: function () {

            var me = this,
                nav_width = $nav_next.width(),
                bar_height = 30;

            set_timeout(function () {
                // 判断是网盘图片预览还是压缩包图片预览（点击空白处处理方式不同
                var close = options.back ? function (trigger_callback) {
                    if (trigger_callback) {  // 是否关闭调用者
                        options.close();
                    }
                    me._button_back();
                } : function () {
                    me.close();
                };

                $el
                    // 点击X关闭预览
                    .on('click.image_preview', '[data-id="X"]', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        close(true);
                    })
                    .on('click.image_preview', function (e) {
                        var x = e.clientX,
                            y = e.clientY,
                            win_width = $win.width(),
                            win_height = $win.height(),

                        // 点击区域是否表示关闭行为
                            is_close_area = (!options.support_nav || (nav_width + 15 < x && x < win_width - nav_width - 15)) && y < win_height - bar_height;


                        if (is_close_area) {

                            var $target = $(e.target);
                            if (!$target.is($major_img)) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                close();
                            }
                        }
                    });

                // ESC 关闭
                me.listenTo(global_event, 'press_key_esc', function () {
                    close();
                });

            }, 400); // 0.N秒以后点击遮罩才隐藏，防止双击文件时导致图片显示后立刻隐藏的问题


            if (options.support_nav) {
                // 按键
                $(document).on('keyup.image_preview', function (e) {
                    e.preventDefault();
                    switch (e.which) {
                        // 左光标键，钱一张
                        case 37:
                            var has_prev = options.index > 0;
                            if (options.support_nav && has_prev) {
                                me._prev(true);
                            }
                            break;
                        // 右光标键，厚一张
                        case 39:
                            var has_next = options.endless || options.index < options.total - 1;
                            if (options.support_nav && has_next) {

                                me._next(true);
                            }
                            break;
                        // 删除
                        case 46:
                            me._remove();
                            break;
                    }
                });

            }

            if (shaque_ie6) {
                var fix_view_height = function () {
                    $el.height($win.height());
                };
                this.listenTo(global_event, 'window_resize', fix_view_height);
                fix_view_height();
            }

            $nav_prev.on('click', function (e) {
                e.preventDefault();
                me._prev(true);
            });

            $nav_next.on('click', function (e) {
                e.preventDefault();
                me._next(true);
            });

            $download.on('click', function (e) {
                e.preventDefault();
                me._download(e);
            });

            $newsurl.on('click', function (e) {
                e.preventDefault();
                me._goto(e);
            });
            $remove.on('click', function (e) {
                e.preventDefault();
                me._remove();
            });

            $button_back.on('click', function (e) {
                e.preventDefault();
                me._button_back();
            });

            // 下载
            $download.toggle(!!options.download);
            // 删除
            $remove.toggle(!!options.remove);

            // 工具条
            var use_bar = !!options.raw || !!options.download || !!options.remove;

            // 显示工具条
            if (use_bar) {
                // IE6无动画
                if (!shaque_ie6) {
                    $bar.css('margin-bottom', '-30px').animate({ 'margin-bottom': 0 }, 500, easing.get('easeOutExpo'));
                }
                // 因为有工具条，所以 $major_img 需要向上偏移一点
                $major_img.css('margin-bottom', '25px');
            }
            $bar.toggle(use_bar);

            //显示返回按钮
            $button_back.toggle(!!options.back);

            //显示关闭按钮
            $close.toggle(true);
        },

        // 统计
        _init_statistics: function () {
            this
                .once('before_load', function () {
                    try {
                        // 测速
                        load_start = new Date().getTime();
                    }
                    catch (e) {
                    }
                })
                .once('after_load', function () {
                    // 测速
                    try {
                        var time = new Date().getTime() - load_start;
                        m_speed.send('base', 'image_preview', time);
                    }
                    catch (e) {
                    }
                })
                .on('raw', function () {
                    user_log('IMAGE_PREVIEW_RAW');
                })
                .on('remove', function () {
                    user_log('IMAGE_PREVIEW_REMOVE');
                })
                .on('nav_prev', function () {
                    user_log('IMAGE_PREVIEW_NAV_PREV');
                })
                .on('nav_next', function () {
                    user_log('IMAGE_PREVIEW_NAV_NEXT');
                })
                .on('close', function () {
                    user_log('IMAGE_PREVIEW_CLOSE');
                });
        }


    };

    $.extend(image_preview, events);

    return image_preview;
});


//tmpl file list:
//image_preview/src/image_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'image_preview_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'doc_preview';
    __p.push('    <div data-no-selection class="viewer">\r\n\
        <div class="viewer-header">\r\n\
            <!-- 关闭按钮 -->\r\n\
            <a data-id="X" class="viewer-close" hidefocus="true" href="#">×</a>\r\n\
        </div>\r\n\
        <div class="preview-back"><a data-id="back" class="pvb-btn" href="#"></a></div>\r\n\
\r\n\
        <table class="img-viewer">\r\n\
            <tr>\r\n\
                <td class="viewer-inner">\r\n\
                    <img data-id="major"/>\r\n\
                </td>\r\n\
            </tr>\r\n\
        </table>\r\n\
\r\n\
        <!-- 图片预览控制 -->\r\n\
        <div>\r\n\
            <div data-id="bar" style="display:none;" class="viewer-info ui-pos">\r\n\
                <span data-id="info" class="viewer-info-text"></span>\r\n\
                <div class="viewer-info-action ui-pos-right">\r\n\
                    <a data-id="raw" class="viewer-source-pic" href="#" target="_blank"><i></i>');
_p(_(l_key,'原图'));
__p.push('</a>\r\n\
                    <a data-id="newsurl" class="viewer-goto" href="#" id="newsurl" style="display:none"><i></i>');
_p(_(l_key,'来源'));
__p.push('</a>\r\n\
                    <a data-id="down" class="viewer-download" href="#"><i></i>');
_p(_(l_key,'下载'));
__p.push('</a>\r\n\
                    <a data-id="remove" class="viewer-del" href="#"><i></i>');
_p(_(l_key,'删除'));
__p.push('</a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <a data-id="prev" class="viewer-prev" title="');
_p(_(l_key,'上一张'));
__p.push('" style="display:none"></a>\r\n\
            <a data-id="next" class="viewer-next" title="');
_p(_(l_key,'下一张'));
__p.push('" style="display:none"></a>\r\n\
        </div>\r\n\
\r\n\
        <div data-id="loading" class="viewer-loading" style="display:none"></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
