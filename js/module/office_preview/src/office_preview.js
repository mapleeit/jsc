/**
 * office预览模块
 * @author hibincheng
 * @date 2014-05-04
 */
define(function(require, exports, module) {
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