/**
 * 文档类预览采用ftn的方案
 * @author: hibincheng
 * @date: 2014-12-05
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),
        request = common.get('./request'),
	    huatuo_speed = common.get('./huatuo_speed'),
        https_tool = common.get('./util.https_tool'),
        FileObject = common.get('./file.file_object'),
        Previewer = require('./Previewer'),
        tmpl = require('./tmpl'),

        cur_file,
        cur_previewer,
        downloader,
        req,

        preview_types = { rar: 1, zip:1, '7z':1},
        LIMIT_MAX_SIZE_M = 100,

        office_preview_types = {xls: 1, xlsx: 1, doc: 1, docx: 1, ppt: 1, pptx: 1, pdf: 1, txt:1},//office预览支持的文件类型
        ie67 = $.browser.msie && $.browser.version < 8,//ie67不支持office预览
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/file_preview.fcg',
        SHARE_CGI = 'http://web2.cgi.weiyun.com/outlink.fcg',
        speed_flags = '7830-4-12-1', //页面展示测速flag
        speed_start_time, //测速开始时间

        undefined;

    var file_type_map = {
        doc: 1,
        docx: 2,
        xls: 3,
        xlsx: 4,
        ppt: 5,
        pptx: 6,
        rtf: 7,
        pdf: 8,
        txt: 16
    };

    var compress_type_map = {
        zip: 13,
        rar :14,
        '7z': 15
    }

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
                is_offline_file: is_offline_file,
                share_key: file._share_key, //分享的文件预览时需求带上_share_key参数
                share_pwd: file._share_pwd  //分享的文件预览时需求带上_share_key参数
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

	        this.speedStart = new Date();
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
                });

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
                file_pid = config.file_pid,
                file_fpath = config.file_fpath,
                is_offline_file = config.is_offline_file,
                share_key = config.share_key, //分享的文件
                share_pwd = config.share_pwd,// 分享的文件
                me = this;

            var req_cfg = {
                file_id: file_id,
                pdir_key: file_pid
            };
            if(share_key) {
                req_cfg.share_key = share_key;
                req_cfg.pwd = share_pwd || '';
            }
            req && req.destroy();
            req = request.xhr_get({
                url: share_key ? SHARE_CGI : REQUEST_CGI,
                cmd: share_key ? 'WeiyunShareDocAbs' : 'DiskFileDocDownloadAbs',
                cavil: true,
                pb_v2: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: req_cfg
            }).ok(function(msg, body) {
                var host = https_tool.translate_host(body['downloaddns']),
                    port = constants.IS_HTTPS ? 8443 : body['downloadport'], //预览服务https使用8443端口接入
                    filetype = '',
                    path = '/ftn_doc_previewer',
                    previewtype = me.can_compress_preview(config.file_type.toLowerCase()),
                    preview_url = '',
                    rkey = body['downloadkey'],
                    html = previewtype? 'compress_file_previewer.html' : 'weiyun_previewer.html';

                if(previewtype) {
                    var appbox = constants.IS_APPBOX? 1 : 0,
                        file_ext = FileObject.get_ext(cur_file.get_name()),
                        file_type = compress_type_map[cur_file.get_type().toLowerCase()] || 0;
                    //新版UI压缩包只有zip一种格式，而架平需要区分zip，rar和7z，此处做兼容
                    if(!constants.IS_OLD && file_ext !== 'zip' && compress_type_map[file_ext]) {
                        file_type = compress_type_map[file_ext]
                    }
                    preview_url = constants.HTTP_PROTOCOL + '//' + host + ':' + port + path + '/' + html + '?rkey=' + rkey + '&filetype=' + file_type
                        + '&is_appbox=' + appbox + '&filename=' + encodeURIComponent(cur_file.get_name()) + '&filesize=' + cur_file.get_size();
                } else {
                    filetype = body['filetype'] || file_type_map[config.file_type.toLowerCase()];
                    preview_url = constants.HTTP_PROTOCOL + '//' + host + ':' + port + path + '/' + html + '?rkey='+ rkey +'&filetype='+filetype;
                }

                cookie.set('FTN5K', body['cookie'], {
                    domain: constants.MAIN_DOMAIN,
                    path: '/'
                });
                if(preview_url) {
                    def.resolve(preview_url);
                } else {
                    def.reject('获取预览地址失败，请稍后重试', 0);
                }

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

        on_init_fail: function(msg, ret) {
            this.trigger('init_fail', msg, ret);
            this._try_back2compress();
            cur_file = null;
        },

        on_download: function(e) {
            //高线文件 和 压缩包内文件自行有下载方式
            if($.isFunction(cur_file.down_file) || cur_file.is_vir_node && cur_file.is_vir_node() || cur_file.is_compress_inner_node && cur_file.is_compress_inner_node()) {
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
            // 测速
	        try{
		        var flag = '21254-1-16';
		        if(this.speedStart) {
			        huatuo_speed.store_point(flag, 1, new Date() - this.speedStart);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        /**
         * PC侧压缩包预览入口
         */
        compress_preview: function(file) {
            var file_id = file.get_id(),
                file_pid = file.get_pid(),
                file_name = file.get_name(),
                file_size = file.get_size(),
                file_type = file.get_type(),
                file_fpath = file._fsrc && file._fpath || '',//压缩包内文件需要把压缩包内路径参数加上
                is_offline_file = file.is_offline_node && file.is_offline_node() ? true : false,
                me = this;

            cur_file = file;

            //不可预览的文件
            if(!this.can_compress_preview(file.get_type())) {
	            this.show_error_tips('该文件类型不支持预览', file_name);
	            return;
            }
	        //mf by iscowei，不再限制大小，由后台输出限制错误
            /*} else if(this.is_limit_size(file_size)) {
                this.show_error_tips('压缩包大小超过' + LIMIT_MAX_SIZE_M + 'M，暂不支持预览', file_name);
                return;
            }*/

            me.async_get_preveiw_url({
                file_type: file_type,
                file_name: file_name,
                file_id: file_id,
                file_pid: file_pid,
                file_fpath: file_fpath,
                is_offline_file: is_offline_file,
                share_key: file._share_key, //分享的文件预览时需求带上_share_key参数
                share_pwd: file._share_pwd  //分享的文件预览时需求带上_share_key参数
            }).done(function(url) {
                    cur_previewer = new Previewer({
                        is_full_screen: false,
                        is_compress: true,
                        file_type: file_type,
                        file_name: file_name,
                        url: url
                    });

                    me.listenTo(cur_previewer, 'download', function(e) {
                        me.on_download(e);
                    });
            }).fail(function(msg, ret) {
                me.show_error_tips(msg, file_name);
            });
        },

        show_error_tips: function(tips, file_name) {
            //此次iframe有三种高度，分布适应三种尺寸的屏幕，而用 window.devicePixelRatio判断来兼容mac中的retina屏幕
            var winHeight = (window.devicePixelRatio && window.devicePixelRatio > 1)? Math.round($(window).height() / window.devicePixelRatio) : $(window).height();
            var iframeHeight = winHeight>800? 830 : (winHeight<630? 450 : 600),
                height = constants.IS_APPBOX? 400 : iframeHeight,
                marginTop = constants.IS_APPBOX? -210: -iframeHeight/2,
                marginLeft = constants.IS_APPBOX? -321 : -401,
                width = constants.IS_APPBOX? 640 : 800,
                me = this;

            this.$ct = $(tmpl.compress_preview({

            })).appendTo(document.body);

            this.$ct.css({
                "height": height + "px",
                "width": width + "px",
                "margin-left": marginLeft + "px",
                "margin-top":  marginTop + "px"
            });

            var $div = $(tmpl.compress_error_tips({
                IS_OLD: constants.IS_OLD,
                title: file_name,
                tips: tips
            }));
            $div.appendTo(this.$ct);

            this.add_full_mask();
            this._bind_compress_events();
            this.$ct.show();
        },

        is_limit_size: function(size) {
            var size_limit = LIMIT_MAX_SIZE_M * Math.pow(1024, 2);
            return size > size_limit;
        },

        can_compress_preview: function(file_type) {
            return !!preview_types[file_type];
        },

        add_full_mask: function() {
            this.$mask = $('<div class="full-mask"></div>').appendTo(document.body);
        },

        _bind_compress_events: function() {
            var me = this;

            this.$ct.find('[data-btn-id="CANCEL"]').on('click', function(e) {
                me.$ct && me.$ct.remove();
                me.$ct = null;

                me.$mask && me.$mask.remove();
                me.$mask = null;

                cur_file = null;
            });

            this.$ct.find('a[download="compress"]').on('click', function (e) {
                e.preventDefault();
                if(cur_file._share_key) {
                    me.trigger('download', cur_file);
                } else {
                    me.on_download(e);
                }
            });
        }
    });

    return office_preview;
});