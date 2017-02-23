//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/office_preview/office_preview.r160107",["lib","common","office_css"],function(require,exports,module){

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
//office_preview/src/Previewer.js
//office_preview/src/office_preview.js
//office_preview/src/office_preview.tmpl.html

//js file list:
//office_preview/src/Previewer.js
//office_preview/src/office_preview.js
/**
 * office预览模块
 * @author hibincheng
 * @date 2014-05-04
 */
define.pack("./Previewer",["lib","common","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        file_type_map = {
            ppt: 'ppt',
            pptx: 'ppt',
            doc: 'doc',
            docx: 'doc',
            xls: 'excel',
            xlsx: 'excel',
            pdf: 'pdf'
        },

        MIN_VIEWER_WIDTH = constants.IS_APPBOX ? 800 : 940,

        undefined;

    var Previewer = inherit(Event, {

        auto_render: true,

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.auto_render) {
                this.render();
            }
        },

        render: function() {

            if(this.is_full_screen) {
                this._$ct = $(tmpl.full_preview({
                    file_type: file_type_map[this.file_type]
                })).appendTo(document.body);
            } else {
                this._$ct = $(tmpl.preview({
                    file_type: file_type_map[this.file_type],
                    title: this.file_name
                })).appendTo(document.body);
            }

            this._header_height = this._$ct.find('[data-id=header]').height();

            if(!this.is_full_screen) {
                widgets.mask.show('office_preview', this._$ct);
            }

            var url = this.url,
                $iframe,
                me = this;

            $iframe = $('<iframe frameBorder=false style="width:100%"></iframe>');
            $iframe.attr('src', url).appendTo(this._$ct.find('[data-id=content]'));
            $iframe.on('load', function(e){
                me.trigger('action', 'preview_page_load', e); //预览页面已加载，实际完整的预览内容并没有全部显示，只是进入了微软的预览页面
            });

            this._$iframe = $iframe;
            this.adjust_viewer();
            this._bind_events();

            this._$ct.show();
        },

        _bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(this),
                    action_name = $target.attr('data-action');
                me.trigger('action', action_name, e);
            });

            this.listenTo(global_event, 'window_resize', function() {
                this.adjust_viewer();
            });
            this.listenTo(global_event, 'press_key_esc', function() {
                this.trigger('action', 'close', null);
            });
        },

        /**
         * 调整预览窗口的宽高
         */
        adjust_viewer: function() {
            var $ct = this.get_$ct(),
                $iframe = this.get_$iframe(),
                win_width = $(window).width(),
                height = $(window).height() - (this._header_height || 0);

            if(win_width < MIN_VIEWER_WIDTH || constants.IS_APPBOX) {
                $ct.css({
                    width: MIN_VIEWER_WIDTH + 'px',
                    marginLeft: -MIN_VIEWER_WIDTH / 2 + 'px'
                });
            } else {
                var iframe_width = this.is_full_screen ? win_width : win_width*0.98
                $ct.css({
                    width: iframe_width + 'px',
                    marginLeft: -iframe_width / 2 + 'px'
                });
            }

            $iframe && $iframe.css('height', height);

        },

        get_$ct: function() {
            return this._$ct;
        },

        get_$iframe: function() {
            return this._$iframe;
        },

        get_$title: function() {
            return this._$title || (this._$title = this._$ct.find('[data-id=title]'));
        },

        destroy: function() {
            this._$ct.remove();
            this.$ct = null;
            this._$iframe = null;
            this.stopListening(global_event, 'window_resize');
            this.stopListening(global_event, 'press_key_esc');
            if(!this.is_full_screen) {
                widgets.mask.hide('office_preview');
            }
        }
    });

    return Previewer;
});/**
 * office预览模块
 * @author hibincheng
 * @date 2014-05-04
 */
define.pack("./office_preview",["lib","common","./Previewer","./tmpl","office_css"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

	    reportInvoice = common.get('./report_invoice'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),
        request = common.get('./request'),
	    huatuo_speed = common.get('./huatuo_speed'),
        https_tool = common.get('./util.https_tool'),
        Previewer = require('./Previewer'),
        tmpl = require('./tmpl'),

        cur_file,
        cur_previewer,
        downloader,
        req,

        office_preview_types = {xls: 1, xlsx: 1, doc: 1, docx: 1, ppt: 1, pptx: 1, pdf: 1},//office预览支持的文件类型
        ie67 = $.browser.msie && $.browser.version < 8,//ie67不支持office预览
        REQUEST_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/docview_dispatcher.fcg'),
        SHARE_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
        speed_flags = '21254-1-19', //页面展示测速flag
        speed_start_time, //测速开始时间

        undefined;
    require('office_css');

    var office_preview = new Module('office_preview', {
        /**
         * 预览入口
         * @param {FileNode} file
         */
        preview: function(file) {
            if(!file || !this.can_office_preview(file)) {
                return;
            }
            cur_file = file;

            var file_type = file.get_type(),
                file_name = file._fsrc && file._meta_name ? file._meta_name : file.get_name(), //压缩包内的文件get_name获取的是压缩包的名字，不知之前设计就这样还是bug
                file_id = file.get_id() || file.get_parent().get_id(),
                file_pid = file.get_pid(),
                file_fpath = file._fsrc && file._fpath || '',//压缩包内文件需要把压缩包内路径参数加上
                is_offline_file = file.is_offline_node && file.is_offline_node() ? true : false;

            this._do_preview({
                file_type: file_type,
                file_name: file_name,
                file_id: file_id,
                file_pid: file_pid,
                file_fpath: file_fpath,
                is_offline_file: is_offline_file
            });
        },
        /**
         * appbox 唤起全屏预览界面后，实际预览接口 由preview.html调用
         * @param {Object} file_opts
         */
        appbox_preview: function(file_opts) {
            var file_name = file_opts['file_name'],
                file_type = file_name && file_name.split('.').pop(),
                file_id = file_opts['file_id'],
                file_pid = file_opts['parent_dir_key'],
                is_offline_file = file_opts['file_src'] == 2;

            this._do_preview({
                file_type: file_type,
                file_name: file_name,
                file_id: file_id,
                file_pid: file_pid,
                is_offline_file: is_offline_file
            }, true);
        },

        can_office_preview: function(file) {
            if(office_preview_types[file.get_type()] && !ie67) {
                return true;
            }
            return false;
        },

        _do_preview: function(config, is_full_screen) {
            var me = this;

            speed_start_time = new Date; //开始测速
            me.async_get_preveiw_url(config)
                .done(function(url) {
                    cur_previewer = new Previewer({
                        is_full_screen: is_full_screen,
                        file_type: config.file_type,
                        file_name: config.file_name,
                        url: url
                    });
                    me.trigger('init_success');

                    !is_full_screen && me.listenTo(cur_previewer, 'action', me._dispatch_action);
                })
                .fail(function(msg, ret) {
                    me.on_init_fail(msg, ret);
                    !is_full_screen && mini_tip.error(msg);
		            //上报
		            var log = config;
		            log.access = 'async_get_preveiw_url_error';
		            log.error_ret = msg + ':' + ret;
		            log.report_time = new Date().toLocaleString();
		            reportInvoice(JSON.stringify(log));
                });

	        //上报
	        var log = config;
	        log.access = 'async_get_preveiw_url';
	        log.report_time = new Date().toLocaleString();
	        reportInvoice(JSON.stringify(log));
        },

        _dispatch_action: function(action_name, e) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](e);
            }
        },
        /**
         * 拉取预览地址
         * @param config
         * @returns {*}
         */
        async_get_preveiw_url: function(config) {

            var def = $.Deferred(),
                file_id = config.file_id,
                file_pid = config.file_pid;

            var req_cfg = {
                file_id: file_id,
                pdir_key: file_pid
            };
            if(config.share_key) {
                req_cfg['share_key'] = config.share_key;
                req_cfg['abs_type']  = 2;
            } else {
                req_cfg['type'] = (config.type === 4)? 4 : 3;
            }
            if(config.ppdir_key) {
                req_cfg['ppdir_key'] = config.ppdir_key;
            }

            req && req.destroy();
            req = request.xhr_get({
                url: config.share_key ? SHARE_CGI : REQUEST_CGI,
                cmd: config.share_key? 'WeiyunShareDocAbs' : 'DocviewDispatcherGetUrl',
                cavil: true,
                pb_v2: true,
                body: req_cfg
            }).ok(function(msg, body) {
                def.resolve(body);

            }).fail(function(ret, msg) {
                def.reject(ret, msg);

            });

            return def;
        },

        /**
         * 压缩包内文件预览，关闭回到压缩包
         * @private
         */
        _try_back2compress: function() {
            //压缩包里的文件预览关闭时要回到压缩包中
            if(cur_file.is_compress_inner_node && cur_file.is_compress_inner_node()) {
                cur_file.back && cur_file.back();
            }
        },

        _speed_time_report: function() {
	        //测速点上报
	        try {
		        huatuo_speed.store_point(speed_flags, 1, new Date() - speed_start_time);
		        huatuo_speed.report(speed_flags, true);
	        } catch (e) {

	        }
        },

        on_init_fail: function(msg, ret) {
            this.trigger('init_fail', msg, ret);
            this._try_back2compress();
            cur_file = null;
        },

        on_download: function(e) {
            //高线文件 和 压缩包内文件自行有下载方式
            if(cur_file.is_vir_node && cur_file.is_vir_node() || cur_file.is_compress_inner_node && cur_file.is_compress_inner_node()) {
                cur_file.down_file(e);
                return;
            }
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(cur_file, e);
                });
            } else {
                downloader.down(cur_file, e);
            }

        },

        on_close: function() {
            cur_previewer.destroy();
            cur_previewer = null;
            this._try_back2compress();
            cur_file = null;

        },
        /**
         * 预览页面已加载
         */
        on_preview_page_load: function() {
            this._speed_time_report();//测速上报
        }
    });

    return office_preview;
});
//tmpl file list:
//office_preview/src/office_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'preview': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var lib = require('lib'),
            text = lib.get('./text');
    __p.push('    <div data-no-selection class="mod-office office-');
_p(data.file_type);
__p.push('" style="display: none;" data-label-for-aria="文件预览内容区域">\r\n\
        <div data-id="header" class="header">\r\n\
            <h2 data-id="title" title="');
_p(text.text(data.title));
__p.push('">');
_p(text.text(data.title));
__p.push('</h2>\r\n\
            <a data-action="close" href="#" class="close" title="关闭" tabindex="0"><span>x</span></a>\r\n\
            <a data-action="download" href="#" class="download" title="下载" tabindex="0">下载</a>\r\n\
        </div>\r\n\
        <div data-id="content" class="main"></div>\r\n\
    </div>');

}
return __p.join("");
},

'full_preview': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-no-selection class="mod-office office-');
_p(data.file_type);
__p.push('" style="display: none;">\r\n\
        <div data-id="content" class="main" style="top:0"></div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
