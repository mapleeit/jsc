//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/doc_preview/doc_preview.r110114",["lib","common","$","i18n"],function(require,exports,module){

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
define.pack("./doc_preview",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {
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
define.pack("./ui",["lib","common","$","./tmpl","i18n"],function (require, exports, module) {
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

        tmpl = require('./tmpl'),


        downloader,//下载模块


        $win = $(window),
        $doc = $(document),
        $doc_el = $(document.documentElement),
        set_interval = setInterval,
        clear_interval = clearInterval,
        set_timeout = setTimeout,

        damn_ie = $.browser.msie,
        nonsupport_fix = damn_ie && $.browser.version < 7,

        _ =  require('i18n').get('./pack'),
        l_key = 'doc_preview',

        undefined;

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
                        if (!$(e.target).closest(me._$box)[0]) {
                            me.close();
                        }
                    });

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

    // 默认文档预览的配置
    var default_config = {
        url : 'http://docview.weiyun.com/document_view.fcg', // 预览请求cgi
        cmd : 'office_view', // 预览操作cmd
        report_cgi : 'document_view.fcg', // 上报cgi名
        loading : true, // 是否显示loading
        wrap_url : null // 最终url是否进行包装
    };
    // 特定文档类型的预览配置
    var special_types = {
        pdf : {
            url : 'http://pdf.cgi.weiyun.com/pdf_view_sliced.fcg',
            cmd : 'pdf_view',
            report_cgi : 'pdf_view_sliced.fcg',
            loading : false,
            wrap_url : '/pdf_view.html'
        },
        txt : {
            url : 'http://docview.weiyun.com/txtview.fcg',
            cmd : 'dispatch',
            report_cgi : 'txtview.fcg',
            loading : true,
            wrap_url : null
        }
    };

    // 判断iframe是否加载完成
    var iframeLoadedHelper = (function(){
        /*
         * 先监听onload事件，完成后：
         * 1 如果无法访问document，跨域，立即显示成功
         * 2 如果可以访问
         * 2.1 如果wy_previewer_loading为true或无内容，等待N秒超时成功，或等wy_previewer_loading变为false或者有内容
         * 2.2 否则立即显示成功
         */
        function getState(iframe){
            var dom = $(iframe)[0], win;
            var accessible = true;
            var selfLoading = false;
            var empty = false;
            try{
                win = dom.contentWindow;
                selfLoading = win.wy_previewer_loading === true;
                empty = win.document.body.childNodes.length <= 0;
            }catch(e){
                accessible = false;
            }
            return {
                accessible : accessible,
                selfLoading : selfLoading,
                empty : empty
            };
        }
        return {
            hook : function(iframe){
                var def = $.Deferred();
                var domLoaded = false;

                var detectTimer, expireTimer;
                // 判断是否加载成功
                var ifDone = function(){
                    var state = getState(iframe);
                    if(domLoaded && (!state.accessible || !state.selfLoading && !state.empty)){
                        finalize(true);
                    }
                };
                // iframe加载时触发
                var hookLoaded = function(){
                    domLoaded = true;
                    ifDone();
                };
                // 结束出口
                var finalize = function(success){
                    clearInterval(detectTimer);
                    clearTimeout(expireTimer);
                    $(iframe).off('load', hookLoaded);
                    if(success){
                        def.resolve();
                    }else{
                        def.reject();
                    }
                    // 只能调用一次
                    finalize = $.noop;
                };

                $(iframe).on('load', hookLoaded);
                detectTimer = setInterval(ifDone, 100);
                expireTimer = setTimeout(function(){ // 超时时，如果没有加载完成则表示为失败，如果加载完只是内容及loading判断不成功，判断为成功
                    var state = getState(iframe);
                    // 这里保留原有逻辑，只对selfLoading及empty的超时作处理，对iframe load的超时不管。。。
                    if(domLoaded){
                        finalize(state.accessible);
                    }
                }, 30000);
                return def;
            }
        };
    })();

    /**
     * 文档预览类
     * @param {FileObject} file
     * @extends AbstractPreview
     * @constructor
     */
    var PreviewDocument = function (file) {
        AbstractPreview.apply(this, arguments);

        var me = this,
            timer = {};

//        me._is_pdf = file.get_type() === 'pdf';
        var file_type = file.icon_type ? file.icon_type : file.get_type();
        // 判断属于什么类型，初始化配置
        me._config = special_types.hasOwnProperty(file_type) ? special_types[file_type] : default_config;

        me
            .on('show', function () {
                me._$mask = me._$el.children('[data-name=mask]');
                me._$viewer = me._$el.find('[data-name=viewer]');
                me._$box = me._$viewer.children('[data-name=box]');
                me._$content = me._$box.find('[data-name=content]');
                me._$iframe = me._$content.children('iframe');
                me._$title = me._$content.children('[data-name=title]');
                me._$loading = me._$content.children('[data-name=loading]');
                me._$loading_bar = me._$loading.find('[data-name=loading-bar]');
                me._$loading_text = me._$loading.find('[data-name=loading-text]');
                me._$error = me._$content.siblings('[data-name=error]');

                // 下载
                me._$box.on('click', '[data-action=download]', function (e) {
                    e.preventDefault();
                    // fix bug 48708167 by cluezhang, at 2013/05/14.
                    // 修正接口使用不正确导致预览界面中下载失败的问题。
                    //downloader.down(downloader.get_down_url(file), e);
                    if(file.down_file){    //压缩包内的可预览文档走自己的下载方法 yuyanghe修改
                        file.down_file();
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
                        me._$el.children('.preview-back').find('a').show();
                    }
                    //关闭按钮时间绑定
                    me._$el.children('.viewer-header').find('a').on('click',function(){
                        file.close();
                    });
                    //聚焦 把焦点移动到文档预览的iframe中
                    force_blur();
                }
            })

            .on('close', function () {
                me.hide_loading();
                if(file.back){
                    file.back();
                }
            })

            // for 统计
            .on('show', function () {
                timer.start = new Date().getTime();
            })
            .on('load', function () {
                timer.load = new Date().getTime();
            })
            .on('done', function () {
                // 返回码上报
                var cmd = me._config.report_cgi;
                cgi_ret_report.report(cmd, me._ret || 0, new Date().getTime() - timer.start);
            });
    };

    $.extend(PreviewDocument.prototype, AbstractPreview.prototype, {

        _padding: 0,
        _max_width: 915,
        _iframe_height_fix: 50, // iframe 的高度等于盒子的高度减去这个值

        /**
         * 加载文档
         */
        load: function () {
            var me = this;

            me.show_loading();

            me._$error.hide();
            // me._$title.show();

            var $ifr = me._$iframe;

            // 重置
            $ifr.off('load').attr('src', '').hide();

            set_timeout(function () { // 这里setTimeout处理是为了防止IE在iframe src=''的情况也触发onload事件 @james
                // 检测iframe是否已出现内容，出现内容时显示iframe，隐藏loading
                iframeLoadedHelper.hook($ifr).done(function(){
                    $ifr.show();
                    me.trigger('load');
                }).fail(function(){
                        me.error(ret_msgs.UNKNOWN_CODE);
                    }).always(function(){
                        me.trigger('done');
                        if (me._config.loading !== false){
                            me.hide_loading();
                        }
                    });

                //加入错误处理， 当me._get_url请求错误时候，显示一个合理的错误页面.
                $ifr.on('load',function(){
                    try{
                        var aa=$ifr.contents().attr('body').scrollHeight;
                    }catch(e){
                        console.log('服务器CGI返回错误');
                        me._$error.show();
                        $ifr.hide();
                    }
                });
                $ifr.attr('src', me._get_extend_url());
            }, 0);
        },

        /**
         * 错误显示
         * @param {Number} ret
         * @param {Boolean} show_error
         */
        error: function (ret, show_error) {
            var me = this;

            me._ret = ret;
            me._has_err = !!ret;

            if (show_error !== false) {
                this._$error.show();
            }

            this._$iframe.hide();
        },

        _get_extend_url: function(){
            if( this._file.is_offline_node && this._file.is_offline_node() ){//离线文件预览需添加特殊参数
                return this._get_url(
                    {
                        fi: encodeURIComponent(this._file.get_id()),//替换特殊离线文件的字符
                        fsrc: 2,//离线的固定填2
                        fcat:this._file.get_down_type()//离线文件的类别，如接收列表、发送列表
                    }
                );
            }
            return this._get_url();
        },
        /**
         *
         * @param {Object} [ext_param] 扩展覆盖参数
         * @returns {*}
         * @private
         */
        _get_url: function (ext_param) {

            var //is_pdf = this._is_pdf,
//                cgi = is_pdf ? 'http://pdf.cgi.weiyun.com/pdf_view_sliced.fcg' : 'http://docview.weiyun.com/document_view.fcg',
//                cmd = is_pdf ? 'pdf_view' : 'office_view',
                config = this._config,
                cgi = config.url,
                cmd = config.cmd,
                wrap_url = config.wrap_url,
                file = this._file,
                ex = window.external;

            //code by bondli 加入PDF预览特殊处理
            var param = {
                cmd: cmd,
                mf: query_user.get_uin_num(),
                vi: query_user.get_skey(),
                fm: file.get_file_md5(),
                fn: encodeURIComponent(file.get_name()),
                fi: file.get_id(),
                pdk: file.get_pid() || file.get_parent().get_id(),
                fsize: file.get_size(),
                bv: '20130120',
                vt: 1,
                sai: constants.APPID,
                rtr: 1,
                fin: 1,
                fpath: file.get_fpath ? file.get_fpath() :'',
                fsrc: file.get_fsrc ? file.get_fsrc() : 0,
                ratio: 1
            };
            if(ext_param){//添加或覆盖新的参数
                $.extend(param,ext_param);
            }
            var url = urls.make_url(cgi, param , false);
            if (config.wrap_url) {
                return urls.make_url(config.wrap_url, {
                    url: url
                });
            } else {
                return url;
            }
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
                $loading_text.html(_(l_key,'仍在加载中'));
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
                    top: this._padding / 2,
                    left: (win_width - new_box_width) / 2,
                    width: new_box_width,
                    height: win_height - this._padding
                },
                new_iframe_css = {
                    height: new_box_css.height - this._iframe_height_fix
                };

            if (is_first) {
                new_box_css['position'] = 'absolute';
                this._$box.css(new_box_css);
                this._$iframe.css(new_iframe_css);
            } else {
                this._$box.animate(new_box_css, 'fast');
                this._$iframe.animate(new_iframe_css);
            }

            if (damn_ie) {
                this._$viewer.height(win_height);
            }
            if (nonsupport_fix) {
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
__p.push('    <div data-no-selection class="viewer">\r\n\
        <!--<div data-name="mask" class="viewer-mask"></div>-->\r\n\
        <div class="viewer-header">\r\n\
            <!-- 关闭按钮 -->\r\n\
            <a data-action="X" class="viewer-close" hidefocus="true" href="#">×</a>\r\n\
        </div>\r\n\
        <div class="preview-back"><a data-id="back" class="pvb-btn" href="#" style="display:none"></a></div>\r\n\
        <div class="viewer-inner">\r\n\
            <table class="viewer-cnt">\r\n\
                <tbody>\r\n\
                    <tr>\r\n\
                        <td data-name="inner" class="viewer-item">');
_p( tmpl.document_preview_box(data) );
__p.push('                        </td>\r\n\
                    </tr>\r\n\
                </tbody>\r\n\
            </table>\r\n\
        </div>\r\n\
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

        _ = require('i18n').get('./pack'),
        l_key = 'doc_preview',

        // 大于若干字节即表示这是一个大文件，提示文本有所不同
        is_large = file.get_size() > 500 * 1024;
    __p.push('    <div data-name="viewer" class="other-viewer">\r\n\
        <div data-name="box" class="viewer-content" id="pdf-content">\r\n\
            <div data-name="content" class="viewer-docs">\r\n\
                <h3 data-name="title" class="ui-title">\r\n\
                    <span class="ui-text">');
_p( text.text(file._meta_name ? file._meta_name:file.get_name()) );
__p.push('</span>\r\n\
                    <span class="ui-btns"><a data-action="download" class="ui-btn" href="#" hidefocus="true"><i class="icon icon-download"></i>');
_p(_(l_key,'下载'));
__p.push('</a></span>\r\n\
                </h3>\r\n\
\r\n\
                <!-- 用来预览的iframe -->\r\n\
                <iframe frameborder="0" src="javascript:document.domain=\'');
_p(constants.MAIN_DOMAIN);
__p.push('\';void 0;"></iframe>\r\n\
\r\n\
                <!-- 进度条 -->\r\n\
                <div data-name="loading" class="viewer-init" id="pdf-loading">\r\n\
                    <div class="ui-quota">\r\n\
                        <div data-name="loading-bar" class="ui-quota-bar" style="width:0%;"></div>\r\n\
                    </div>\r\n\
                    <p class="ui-quota-text">\r\n\
                        <span data-name="loading-text">');
_p( is_large ? _(l_key,'文档较大，正在加载，请耐心等候'):_(l_key,'文档正在加载中，请稍候') );
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
\r\n\
                    <p class="ui-text">');
_p(_(l_key,'附件预览时发生错误'));
__p.push('，');
_p(_(l_key,'请<a data-action="retry" href="#">重试</a> 或直接 <a data-action="download" href="#">下载</a> 查看。'));
__p.push('                        </p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
