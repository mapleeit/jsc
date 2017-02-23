/**
 * 图片、文档预览UI逻辑
 * @author jameszuo
 * @date 13-3-15
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        force_blur = lib.get('./ui.force_blur'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        urls = common.get('./urls'),
        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        cgi_ret_report = common.get('./cgi_ret_report'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        
        previewer_mod = require('previewer'),
        previewer_factory = previewer_mod.get('./previewer.factory'),
        iframeLoadedHelper = previewer_mod.get('./iframe_load_helper'),

        tmpl = require('./tmpl'),


        downloader,//下载模块


        $win = $(window),
        $doc = $(document),
        $doc_el = $(document.documentElement),
        set_interval = setInterval,
        clear_interval = clearInterval,
        set_timeout = setTimeout,

        damn_ie = $.browser.msie,
        nonsupport_fix = damn_ie && $.browser.version < 7;



    require.async('downloader',function(mod){
        downloader = mod.get('./downloader');
    });

    var ui = new Module('doc_preview_ui', {

        preview: function (url) {
            return new PreviewDocument(url).show();
        }
    });

    /**
     * 预览的抽象类
     * @param {FileNode} file
     * @constructor
     */
    var AbstractPreview = function (file) {
        this._file = file;
    };
    AbstractPreview.prototype = {
        show: function () {
            var me = this;

            this._$el = $(tmpl.file_preview_box({
                file: this._file
            }));

            // DOM
            var $el = this._$el.hide()
                .appendTo(document.body)
                .fadeIn('fast');

            set_timeout(function () {
                $el
                    .on('click.file_preview', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        // 点击 $box 外部时隐藏iframe
                        if (!$(e.target).closest(me._$wrapper)[0]) {
                            me.close();
                        }
                    });

                $el.on('click', '[data-action=close]', function(e) {
                    e.preventDefault();
                    me.close();
                })

                me.listenTo(global_event, 'press_key_esc', function () {
                    me.close();
                });
            }, 400); // 0.N秒以后点击遮罩才隐藏，防止双击文件时导致图片显示后立刻隐藏的问题

            // show 事件
            this.trigger('show');

            // resize 事件
            if (this.resize) {
                this.listenTo(global_event, 'window_resize', function () {
                    this.resize();
                });
            }

            widgets.mask.show('doc_repview');

            return this;
        },

        close: function (animate) {
            animate = animate !== false;

            var me = this;
            if (me._$el) {
                if(animate) {
                    me._$el.fadeOut('fast', function () {
                        $(this).remove();
                    });
                } else {
                    me._$el.remove();
                }
                me.trigger('close');

                widgets.mask.hide('doc_repview');

                // me._file = null;
                me.off().stopListening();
            }
        },

        resize: $.noop
    };
    $.extend(AbstractPreview.prototype, events);

    /**
     * 文档预览类
     * @param {FileObject} file
     * @extends AbstractPreview
     * @constructor
     */
    var PreviewDocument = function (file) {
        AbstractPreview.apply(this, arguments);
        
        var me = this;
        
        var properties = {
            uin : query_user.get_uin_num(),
            skey : query_user.get_skey(),
            appid : constants.APPID,
            
            file_id : file.get_id(),
            file_md5 : file.get_file_md5(),
            file_name : file.get_name(),
            file_size : file.get_size(),
            parent_dir_key : file.get_pid() || file.get_parent().get_id(),
            
            file_src : this._file.is_offline_node && this._file.is_offline_node() ? 2 : (file.get_fsrc ? file.get_fsrc() : 0),
            compress_path : file.get_fpath ? file.get_fpath() :'',
            offline_type : this._file.is_offline_node && this._file.is_offline_node() ? this._file.get_down_type() : undefined
        };
        

        me
            .on('show', function () {
                // Previewor构造
                var $preview = me._$el.find('[data-name=preview-container]');
                var file_type = file.icon_type ? file.icon_type : file.get_type();
                me.previewer = previewer_factory.create(file_type, {
                    properties : properties,
                    $container : $preview
                });
                me._$wrapper = me._$el.children('[data-id=wrapper]');
                me._$title = me._$wrapper.find('[data-id=title]');
                me._$mask = me._$el.children('[data-name=mask]');
                me._$viewer = me._$el.find('[data-name=viewer]');
                me._$box = me._$viewer.children('[data-name=box]');
                me._$content = me._$box.find('[data-name=content]');
                //me._$iframe = me._$content.children('iframe');
                me._$ct = $preview; //me._$box.find('[data-name=preview-container]');
                me._$title = me._$content.children('[data-name=title]');
                me._$loading = me._$content.children('[data-name=loading]');
                me._$loading_bar = me._$loading.find('[data-name=loading-bar]');
                me._$loading_text = me._$loading.find('[data-name=loading-text]');
                me._$error = me._$content.siblings('[data-name=error]');
                
                // 下载
                me._$el.on('click', '[data-action=download]', function (e) {
                    e.preventDefault();
                    // fix bug 48708167 by cluezhang, at 2013/05/14.
                    // 修正接口使用不正确导致预览界面中下载失败的问题。
                    //downloader.down(downloader.get_down_url(file), e);
                    if(file.down_file){    //压缩包内的可预览文档走自己的下载方法 yuyanghe修改
                        file.down_file(e);
                    } else{
                        downloader.down(file, e);
                    }
                });

                // 点击重试
                me._$error.on('click', '[data-action=retry]', function (e) {
                    e.preventDefault();
                    me.trigger('reload');
                });


                me.resize(true);

                me.load();

                if (nonsupport_fix) {
                    $win.scrollTop(0);
                }

                //压缩包传入文档特殊处理　　返回标志显示。mask隐藏  关闭按钮事件绑定
                if(file.close){
                    me._$mask.hide();
                    if(!constants.IS_APPBOX){
                        me._$el.children('.preview-back').show();
                    }
                    //关闭按钮时间绑定
                    /*me._$el.on('click', '[data-action=close]', function(){
                        file.close();
                    });*/
                    //聚焦 把焦点移动到文档预览的iframe中
                    force_blur();
                }
            })

            .on('close', function () {
                me.previewer.destroy();
                me.hide_loading();
                if(file.back){
                    file.back();
                    //$('#_compress_preview_box').show();
                }
            });
    };

    $.extend(PreviewDocument.prototype, AbstractPreview.prototype, {

        _padding: 0,
        _max_width: 940, // 原本的915 pdf宽度不够用
        _iframe_height_fix: 64, // iframe 的高度等于盒子的高度减去这个值

        /**
         * 加载文档
         */
        load: function () {
            var me = this;

            me.show_loading();

            me._$error.hide();
            
            me._$ct.hide();
            me.previewer.on('load', function(){
                me._$ct.show();
                me.hide_loading();
            });
            var def = me.previewer.init().fail(function(type, errcode, meta){
                var tip_meta;
                if(type === 'server'){
                    tip_meta = meta;
                }else{
                    tip_meta = {
                        tip : '附件预览时发生错误',
                        retry : true,
                        download : true
                    };
                }
                me.error(errcode, true, tip_meta);
            });
        },

        /**
         * 错误显示
         * @param {Number} ret
         * @param {Boolean} show_error
         */
        error: function (ret, show_error, meta) {
            var me = this;

            me._ret = ret;
            me._has_err = !!ret;

            if (show_error !== false) {
                this._$error.find('.ui-text').html(tmpl.preview_error(meta));
                this._$error.show();
            }

            this._$ct.hide();
        },

        show_loading: function () {
            clear_interval(this._timer_loading);
            clear_interval(this._intrv_detect);
            clear_interval(this._timer_loading_text);

            var time = 30000, //总执行时间
                step = (time / 90), //执行间隔
                percent = 1, //百分比
                times = 0, //执行次数

                $loading = this._$loading,
                $loading_text = this._$loading_text,
                $bar = this._$loading_bar,

                timer_loading;

            $loading.show();

            $bar.css({
                'width': '1%'
            });

            // 一段时间后如果还在加载，则提示『仍在加载中...』
            this._timer_loading_text = set_timeout(function () {
                $loading_text.html('仍在加载中');
            }, 4000);


            //进度条更新
            timer_loading = this._timer_loading = set_interval(function () {
                if ((times++) * step > time) {
                    clear_interval(timer_loading);
                } else {
                    $bar.width((percent++) + '%');
                }
            }, step);
        },

        hide_loading: function () {
            if (this._$loading) {
                this._$loading.hide();
            }
            clear_interval(this._timer_loading);
            clear_interval(this._timer_loading_text);
            clear_interval(this._intrv_detect);
        },

        resize: function (is_first) {

            var
                win_width = $win.width(),
                win_height = $win.height(),
                doc_height = $doc.height(),
                doc_el_height = $doc_el.height(),

                new_box_width = Math.min(win_width - this._padding, this._max_width),
                new_box_css = {
                    top: 0,
                    left: 0,
                    width: new_box_width,
                    height: win_height - this._padding
                },
                new_iframe_css = {
                    height: new_box_css.height - this._iframe_height_fix
                };

            this._$wrapper.css({
                width: new_box_width,
                marginLeft: -new_box_width/2 + 'px'
            });

            if (is_first) {
                new_box_css['position'] = 'absolute';
                this._$box.css(new_box_css);
                this._$ct.css(new_iframe_css);
            } else {
                this._$box.animate(new_box_css, 'fast');
                this._$ct.animate(new_iframe_css);
            }

            if (damn_ie) {
                this._$viewer.height(win_height);
            }
            if (nonsupport_fix) {
                this._$title.width(new_box_width - 240);
                this._$el.height(win_height);
                this._$mask.height(Math.max(doc_height, doc_el_height, win_height));
            }


        }

    });

    return ui;
});