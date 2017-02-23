/**
 * 文档预览类
 * @author svenzeng
 * @date 13-5-8
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        url_parser = lib.get('./url_parser'),
        easing = lib.get('./ui.easing'),

        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),
        scroller = common.get('./ui.scroller'),
        global_event = common.get('./global.global_event'),

        downloader = require('downloader').get('./downloader'),
        tmpl = require('./tmpl'),

        damn_ie = $.browser.msie,
        nonsupport_fix = damn_ie && $.browser.version < 7,

        win_padding = 0,

        $win = $(window),
        set_timeout = setTimeout,

        size_limit_M = 30,// 可预览的文件大小上限（单位M）,几乎无限制  (新版cgi2.0限制为30M)
        size_limit = size_limit_M * Math.pow(1024, 2),


        undefined;

    /**
     * 构造函数
     * @param options
     *  - {FileObject} file
     *  - {Number} max_width 预览框的最大宽度
     * @constructor
     */
    var CompressFileIframe = function (options) {
        var file = options.file;

        if (!file) {
            console.error('ThirdPartyIframe() 无效的参数 file');
            return {};
        }

        var url = constants.HTTP_PROTOCOL + '//www.weiyun.com/compress_file.html';

        var url = urls.make_url(url, (function () {
            var param = {};
            /*var param = {
             file_md5: file.get_file_md5(),
             file_name: file.get_name(),
             file_id: file.get_id(),
             pdir_key: file.get_pid()
             };*/
            if (constants.IS_APPBOX) {
                param.IS_APPBOX = 1;
            }
            if (constants.IS_QZONE) {
                param.IS_QZONE = 1;
            }
            if (constants.IS_DEBUG) {
                param.IS_DEBUG = 1;
            }
            return param;
        })());

        var me = this;

        me._url = url;
        me._file = options.file;
        me._max_width = options.max_width || 915;

        me._$el = $(tmpl.compress_preview_box()).hide().appendTo(document.body);
        me._$content = me._$el.find('[data-name=content]');
        me._$box = me._$el.find('[data-name=box]');
        me._$ifr = me._$content.children('iframe');
        me._$title = me._$content.children('[data-name=title]');
        me._$error = me._$content.children('[data-name=error]');
        me._$loading = me._$el.find('[data-name=loading]');
        me._$title1 = me._$el.find('[data-name=title1]');
        me._$title2 = me._$el.find('[data-name=title2]');

        me._init_ui_event();
    };


    CompressFileIframe.prototype = {

        set_title: function (title1, title2) {
            if (title2) {
                this._$title1.find('.view-zip-dir-parent').text(title1);
                this._$title1.find('.view-zip-dir-current').text(title2);
                this._$title1.show();
                this._$title2.hide();
            } else {
                this._$title2.find('.view-zip-dir-only').text(title1);
                this._$title2.show();
                this._$title1.hide();
            }
        },

        get_$main_title: function () {
            return this._$title1.find('.view-zip-dir-parent');
        },

        loading: {
            /**
             * 更新进度
             * @param {String|Number} size 传入number表示文件大小，传入'50%'百分比字符串表示进度条宽度
             */
            process: function (size) {
                var loading_text = this._$loading.find('[data-name=loading-text]'),
                    loading_bar = this._$loading.find('[data-name=loading-bar]'),
                    percent;

                if (typeof size === 'number') {
                    percent = Math.ceil(size / this._file.get_size() * 100);

                    this._$loading.fadeIn('fast');

                    if (size >= 0) {
                        loading_text.text('已加载' + Math.max(1, percent) + '%');  // 最小值1
                    } else {
                        loading_text.text('正在加载中...');
                    }
                }
                else {
                    percent = parseInt(size.replace('%', '')) || 0;

                    loading_text.text('已加载' + Math.max(1, percent) + '%');  // 最小值1

                    // 100% 后隐藏
                    if (percent === 100) {
                        this._$loading.delay(500).fadeOut('fast');
                    }
                }

                // 要更新的进度不能小于现有宽度
                loading_bar.stop(false, true).animate({ width: Math.max(4, percent) + '%' }, 500, easing.get('easeOutCubic'));
            },
            show: function () {
                this.loading.process.call(this, 0);
            },
            hide: function (is_err) {
                if (is_err !== false) {
                    this._$loading.hide();
                } else {
                    this.loading.process.call(this, '100%');
                }
            }
        },

        show: function () {
            var me = this,
                $ifr = me._$ifr;

            // 限制文件大小
	        //mf by iscowei，不再限制大小，由后台输出限制错误
            if (1 || me._file.get_size() <= size_limit) {

                me.loading.show.call(me);

                // 开始加载
                $ifr
                    .off()
                    .on('load.doc_preview', function () {
                        me.trigger('load');
                    })
                    .attr('src', me._url);

            }
            else {
                me.error_size_limit();
            }

            me._$el.stop(false, true).fadeIn('fast');

            // resize 事件
            me.listenTo(global_event, 'window_resize', function () {
                me._reposition(false);
            });

            me._reposition(true);

            widgets.mask.show('CompressFileIframe', me._$el);

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

            widgets.mask.hide('CompressFileIframe');

            // show 事件
            me.trigger('close');

            me.off().stopListening();

            user_log('COMPRESS_CLOSE');
        },

        toggle: function (visible) {
            this._$el.toggle(visible);
            if(visible) {
                widgets.mask.show('CompressFileIframe');
            } else {
                widgets.mask.hide('CompressFileIframe');
            }
        },

        error: function (wording) {
            var $err = this._$error,
                $txt = $err.find('span');

            wording ? $txt.append(wording) : $txt.empty();
            $err.toggle(!!wording);
        },

        error_size_limit: function () {
            var file = this._file,
                $wording = $('<span>压缩包大小超过' + size_limit_M + 'M，暂不支持预览，请直接<a href="#">下载</a></span>');

            $wording.on('click', function (e) {
                e.preventDefault();
                downloader.down(file, e);
            });

            this.error($wording);
        },

        get_$iframe: function () {
            return this._$ifr;
        },

        get_file: function () {
            return this._file;
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
                    height: new_box_css.height - 10 - me._$title1.height() || 0
                };

            if (is_first) {
                new_box_css['position'] = 'absolute';
                me._$box.css(new_box_css);
                me._$ifr.css(new_iframe_css);
            } else {
                me._$box.animate(new_box_css, 'fast');
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

                me.listenTo(global_event, 'press_key_esc', function () {
                    if (me._$el.is(':visible')) {
                        me.close();
                    }
                });

            }, 400); // 0.N秒以后点击遮罩才隐藏，防止双击文件时导致图片显示后立刻隐藏的问题
        }
    };

    $.extend(CompressFileIframe.prototype, events);

    return CompressFileIframe;
});