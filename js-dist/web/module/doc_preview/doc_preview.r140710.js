//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/doc_preview/doc_preview.r140710",["lib","common","$","office_css","previewer"],function(require,exports,module){

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
//doc_preview/src/doc_preview.js
//doc_preview/src/ui.js
//doc_preview/src/doc_preview.tmpl.html

//js file list:
//doc_preview/src/doc_preview.js
//doc_preview/src/ui.js
/**
 * 图片、文档预览
 * @author jameszuo
 * @date 13-3-15
 * todo 图片预览会话超时检测
 */
define.pack("./doc_preview",["lib","common","$","./tmpl","office_css","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        session_event = common.get('./global.global_event').namespace('session'),

        tmpl = require('./tmpl'),

        preview_instance,

        undefined;

    require('office_css');

    var doc_preview = new Module('doc_preview', {

        ui: require('./ui'),

        /**
         * 预览文件
         * @param {File|FileNode} file
         */
        preview: function (file) {
            var me = this;

            if (file.is_preview_doc()) {

                me.render();


                if (query_user.check_cookie()) {

                    me._preview(file);

                } else {

                    this._require_login(ret_msgs.INVALID_SESSION, file);

                }
            }
        },

        _preview: function (file) {
            var me = this;

            me._close();

            preview_instance = me.ui.preview(file);

            // 刷新
            preview_instance.on('reload', function () {
                me._preview(file);
            });

            // 预览出错
            preview_instance.listenToOnce(global_event, 'preview_document_error', function (ret) {
                // 是否需要登录验证
                var invalid_session = ret === ret_msgs.INVALID_SESSION || ret === ret_msgs.INVALID_INDEP_PWD;

                preview_instance.error(ret, !invalid_session);

                if (invalid_session) {
                    // 关闭当前的预览
                    preview_instance.close();

                    me._require_login(ret, file);
                }
            });
        },

        _close: function () {
            if (preview_instance) {
                preview_instance.off().stopListening(global_event, 'preview_document_error').close();
                preview_instance = undefined;
            }
        },

        _require_login: function (ret, file) {
            var me = this;
            // 弹出登录框
            if (ret === ret_msgs.INVALID_SESSION) {
                console.debug('文档预览触发了session_timeout事件，已监听回调');
                session_event.trigger('session_timeout', function () {
                    me.preview(file);
                });
            } else if (ret === ret_msgs.INVALID_INDEP_PWD) {
                console.debug('文档预览触发了invalid_indep_pwd事件，已监听回调');
                session_event.trigger('invalid_indep_pwd', function () {
                    me.preview(file);
                });
            }
        }
    });

    return doc_preview;
});/**
 * 图片、文档预览UI逻辑
 * @author jameszuo
 * @date 13-3-15
 */
define.pack("./ui",["lib","common","$","previewer","./tmpl"],function (require, exports, module) {
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
//tmpl file list:
//doc_preview/src/doc_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'file_preview_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
            text = lib.get('./text');
        var file_type_map = {
            ppt: 'ppt',
            pptx: 'ppt',
            doc: 'doc',
            docx: 'doc',
            rtf: 'doc',
            wps: 'doc',
            txt: 'doc',
            text: 'doc',
            xls: 'excel',
            xlsx: 'excel',
            pdf: 'pdf'
        };
        var cls_type = file_type_map[data.file.get_type()] || 'doc';
    __p.push('    <div class="viewer">\r\n\
        <div data-id="wrapper" data-no-selection class="mod-office office-');
_p(cls_type);
__p.push(' " style="" data-label-for-aria="文件预览内容区域">\r\n\
            <div data-id="header" class="header">\r\n\
                <h2 data-id="title" title="" style="text-align: left;">');
_p(text.text(data.file._meta_name ? data.file._meta_name : data.file.get_name()));
__p.push('</h2>\r\n\
                <a data-action="close" href="#" class="close" title="关闭" tabindex="0"><span>x</span></a>\r\n\
                <a data-action="download" href="#" class="download" title="下载" tabindex="0">下载</a>\r\n\
            </div>\r\n\
            <div data-id="content" class="main">');
_p( tmpl.document_preview_box(data) );
__p.push('            </div>\r\n\
        </div>\r\n\
        <div class="preview-back" style="display:none;"><a data-id="back" class="pvb-btn" href="#" style=""></a></div>\r\n\
    </div>');

return __p.join("");
},

'document_preview_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        text = lib.get('./text'),
        constants = common.get('./constants'),

        file = data.file,

        // 大于若干字节即表示这是一个大文件，提示文本有所不同
        is_large = file.get_size() > 500 * 1024;
    __p.push('    <div data-name="viewer" class="other-viewer">\r\n\
        <div data-name="box" class="" id="pdf-content">\r\n\
            <div data-name="content" class="viewer-docs">\r\n\
                <!--<h3 data-name="title" class="ui-title">\r\n\
                    <span class="ui-text">');
_p( text.text(file._meta_name ? file._meta_name:file.get_name()) );
__p.push('</span>\r\n\
                    <span class="ui-btns"><a data-action="download" class="ui-btn" href="#" hidefocus="true"><i class="icon icon-download"></i>下载</a></span>\r\n\
                </h3>-->\r\n\
\r\n\
                <!-- 用来预览的iframe -->\r\n\
                <!--<iframe frameborder="0" src="javascript:document.domain=\'');
_p(constants.MAIN_DOMAIN);
__p.push('\';void 0;"></iframe>-->\r\n\
                <div class data-name="preview-container" style="overflow:auto;">\r\n\
                </div>\r\n\
\r\n\
\r\n\
                <!-- 进度条 -->\r\n\
                <div data-name="loading" class="viewer-init" id="pdf-loading">\r\n\
                    <div class="ui-quota">\r\n\
                        <div data-name="loading-bar" class="ui-quota-bar" style="width:0%;"></div>\r\n\
                    </div>\r\n\
                    <p class="ui-quota-text">\r\n\
                        <span data-name="loading-text">');
_p( is_large ? '文档较大，正在加载，请耐心等候':'文档正在加载中，请稍候' );
__p.push('</span>\r\n\
                        <span>...</span>\r\n\
                        <!--<span class="jumping-dots">\r\n\
                            <span>.</span>\r\n\
                            <span>.</span>\r\n\
                            <span>.</span>\r\n\
                        </span>-->\r\n\
                    </p>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
            <div data-name="error" class="viewer-tips" style="display:none;">\r\n\
                <div class="ui-tips">\r\n\
                    <i class="ui-icon icon-err"></i>\r\n\
                    <p class="ui-text">附件预览时发生错误，请 <a data-action="retry" href="#">重试</a> 或直接 <a data-action="download" href="#">下载</a> 查看。</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'dynamic_preview': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-name="preview-content" class="previewer-dynamic-content"></div>\r\n\
    <div data-name="preview-loadmore-container" class="previewer-dynamic-loadmore-container" style="height: 1px;">\r\n\
        <div data-name="preview-loadmore" class="previewer-dynamic-loadmore" style="background-color: #eee;height: 36px;line-height: 36px;text-align: center;margin-top: -36px;position: relative;width: 100%;vertical-align: middle;display:none;">\r\n\
            <img style="vertical-align: middle;" src="http://imgcache.qq.com/vipstyle/nr/box/img/loading.gif" /> 加载中...\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'preview_error': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var operate_tips = {
        'retry-down' : '请点击<a data-action="retry" href="#">重试</a>或直接 <a data-action="download" href="#">下载</a> 查看',
        'retry-none' : '请点击<a data-action="retry" href="#">重试</a>',
        'none-down' : '请直接 <a data-action="download" href="#">下载</a> 查看',
        'none-none' : ''
    };
    var opr_key = [(data.retry ? 'retry' : 'none'), (data.download ? 'down' : 'none')].join('-'),
        operate = operate_tips[opr_key];

    var sentences = [data.tip];
    if(operate){
        sentences.push(operate);
    }
_p( sentences.join('，') );
__p.push('。');

return __p.join("");
}
};
return tmpl;
});
