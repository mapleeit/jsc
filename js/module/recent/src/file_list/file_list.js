/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        _console = lib.get('./console'),
        security = lib.get('./security'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),

        global_event = common.get('./global.global_event'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        filter = common.get('./filter.session_filter'),
        urls = common.get('./urls'),
	    huatuo_speed = common.get('./huatuo_speed'),
        progress = common.get('./ui.progress'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),

        main_ui = require('main').get('./ui'),
        recent_ui = require('./ui'),
        tbar = require('./tbar'),

        scroller,
        MAX_LENGTH = 100,//最大加载数据大小
        downloader, //下载模块
        office_preview, //文档预览模块
        file_qrcode,
        msg_top = '51px',
        uiv = constants.UI_VER,
        undef;


    // 文件列表模块
    var file_list = new Module('file_list', {

        data: require('./file_list.file'),
        ui: require('./file_list.ui'),

        last_load_req: null,
        loading: false, //当前批次数据正在加载中
        all_loaded: false, //CGI所有最近文件是否已经加载完成
        pre_size: '640*640', //图片预览的默认尺寸
        _speed_js_css: false, //js测速
        _speed_first_batch_data: false, //第一次cgi数据请求测速
        /*根据窗口的可视高宽，需改图片预览的尺寸*/
        _set_pre_size: function (width, height) {
            this.pre_size = Math.max(width, height) > 1024 ? '1024*1024' : '640*640';
        },

        render: function () {

            scroller = main_ui.get_scroller();

            this._render_event();
            this.on('activate', this._render_activate);

//            if (uiv === 'WEB') {
//                this.on('deactivate', function () {
//                    $(document.body).removeClass('app-recent');
//                });
//            }
        },
        _render_activate: function () {
//            if (uiv === 'WEB') {
//                $(document.body).addClass('app-recent');
//            }

            //文件下载不存在时，刷新列表
            this.listenTo(session_event, 'downloadfile_not_exist', function () {
                this.refresh();
            });

            var me = this;
	        //测速第一批数据
	        try{
		        var flag = '21254-1-9';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
		        }
	        } catch(e) {

	        }
            //if (!me.data.is_full) {
            me.on_win_resize($(window).width(), $(window).height(), true); //设置列表显示条数 , 刷新列表
            //}
            !downloader && require.async('downloader', function (mod) { //异步加载downloader
                downloader = mod.get('./downloader');
            });
            !file_qrcode && require.async('file_qrcode', function (mod) { //异步加载文件二维码模块
                file_qrcode = mod.get('./file_qrcode');
            });
            !office_preview && require.async('office_preview', function (mod) { //异步加载office_preview
                office_preview = mod.get('./office_preview');
            });
        },
        _render_event: function () {
            this/*.off(global_event, 'recent_refresh')
             .listenTo(global_event, 'recent_refresh', this.refresh)
             */
                .off(this.ui, 'enter').off(this.ui, 'download')
                .listenTo(this.ui, 'enter', this.enter)
                .listenTo(this.ui, 'download', this.download);

            this.stopListening(scroller, 'scroll resize')
                .listenTo(scroller, {
                    scroll: this.on_win_scroll,
                    resize: this.on_win_resize
                });

            this.listenTo(tbar, {
                'clear_recent': function () {
                    var me = this;
                    if( me.data.get_length() > 0 ){
                        widgets.confirm( '清空记录',   '确定要清空最近记录吗？', '清空记录不会删除文件',
                            function () {
                                me.clear();
                            }, $.noop
                        );
                    } else {
                        mini_tip.warn('您没有最近使用记录');
                    }
                    user_log('RECENT_CLEAR');
                },
                'refresh': function () {
                    this.refresh(true);
                    user_log('RECENT_REFRESH');
                }
            });

        },
        /*
         *列表行点击 的处理逻辑
         *@param file_id : 文件id,
         *@param e       : 触发的事件对象jQuery(Event)
         **/
        enter: function () {
            filter(this, arguments, function (fileid, e) {
                var me = this,
                    file = me.data.get_file_by_id(fileid);

                if (file) {
                    if (e.target.className == 'ico-dimensional') {
                        if (file_qrcode) {
                            file_qrcode.show([file]);
                            user_log('FILE_QRCODE_RECENT_ITEM');
                            return false;
                        }
                    } else {
                        // 压缩包预览
                        if (file.is_compress_file()  && !($.browser.msie && $.browser.version < 8)) {
                            return me._preview_zip_file(file);
                        }

                        // 如果是可预览的文档，则执行预览操作
                        if (preview_dispatcher.is_preview_doc(file)) {
                            preview_dispatcher.preview(file);
                            user_log('ITEM_CLICK_DOC_PREVIEW');
                            return;
                        }

                        // 图片预览
                        if (file.is_image()) {
                            return me._preview_image(file);
                        }

                        // 其他类型文件，直接下载
                        user_log('ITEM_CLICK_DOWNLOAD');
                        me.download(fileid, e);
                    }
                }
            });
        },

        // 压缩包预览
        _preview_zip_file: function (file) {
            require.async('ftn_preview', function(mod) {
                var ftn_preview = mod.get('./ftn_preview');
                ftn_preview.compress_preview(file);
            });
            //require.async('compress_file_iframe', function (mod) {
            //    var compress_file_iframe = mod.get('./compress_file_iframe'),
            //        iframe = compress_file_iframe.create_preview({
            //            file: file,
            //            max_width: constants.IS_APPBOX ? 670 : 915
            //        });
            //
            //    iframe.set_title(file.get_name());
            //    iframe.show();
            //});

            user_log('ITEM_CLICK_ZIP_PREVIEW');
        },


        /**
         * 图片预览
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        _preview_image: function (file) {
            var me = this;
            me.appbox_preview(file).fail(function () {
                me.web_preview(file);
            });
            user_log('ITEM_CLICK_IMAGE_PREVIEW');//数据上报
        },
        appbox_preview: function (node) {
            var ex = window.external,
                def = $.Deferred(),
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
                        (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
                    );
            _console.debug('support == ', support);
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        mod.get('./full_screen_preview').preview(node);
                        def.resolve();
                    } catch (e) {
                        _console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },
        web_preview: function (file) {
            var me = this;
            require.async('image_preview', function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                // 所有的图片(按照时间顺序显示)
                    images = $.grep(me.data.T.concat(me.data.Y).concat(me.data.S).concat(me.data.L), function (file) {
                        return file.is_image();
                    });
                // 当前图片所在的索引位置
                var index = $.inArray(file, images);

                image_preview.start({
                    total: images.length,
                    index: index,
                    images: images,
                    downloader: true,
                    download: function (index, e) {
                        var file = images[index];
                        if (file) {
                            downloader.down(file, e);
                        }
                    }
                });
            });
        },
        /*
         *下载
         *@param file_id : 文件id,
         *@param e       : 触发的事件对象jQuery(Event)
         */
        download: function () {
            filter(this, arguments, function (file_id, e) {
                if (!downloader) {
                    _console.log('downloader未初始化');
                    return;
                }
                downloader.down(this.data.get_file_by_id(file_id), e);
            });
        },
        /**
         *刷新列表 ，入口包括 menu上刷新按钮、初始化时的加载动作
         * @param [need_tip] 刷新成功后，是否tips提示
         */
        refresh: function (need_tip) {
            var me = this;
            if (!me.loading) {
                me._request({
                    'offset': 0,
                    'number': MAX_LENGTH, //加载，重新加载数据
                    'cover': true,
                    'before': function () {
                        me.ui.empty_list();
                        me.ui._get_data_wraper().hide();
                        widgets.loading.show();
                    },
                    'after': function (msg, ret) {
                        widgets.loading.hide();
                        if (!ret) {
                            me.ui._get_data_wraper().show();
                        }
                        if(need_tip){
                            mini_tip.ok('刷新成功')
                        }
                    }
                });
            }
        },
        /**
         * 清空记录
         */
        clear: function () {
            var me = this;
            if (me.clearRequest) {
                me.clearRequest.destroy();
                delete me.clearRequest;
            }
            progress.show('清空记录...', false, true);
            me.clearRequest =
                request.xhr_get({
                    'cavil': true,
                    'url': 'http://web2.cgi.weiyun.com/user_library.fcg',
                    'cmd': 'Lib3DelRecentFileList',
                    'pb_v2': true
                })
                    .ok(function () {
                        me.ui.empty_list();
                        me.data.clear();
                        me.ui.paint(true);
                        mini_tip.ok('记录已清除');
                        main_ui.sync_size();
                    })
                    .fail(function (msg, ret) {
                        mini_tip.error(msg, 3, msg_top);
                    })
                    .done(function () {
                        progress.hide();
                    });
        },
        /*
         *窗口重置时的处理逻辑
         *@param x : 窗口可见宽度
         *@param y : 窗口可见高度
         *@param forceFresh: 强制刷新
         **/
        on_win_resize: function (x, y, forceFresh) {
            if (!forceFresh && !this.is_activated()) return;
            var me = this;
            me._set_pre_size(x, y);

            if (!me.loading && forceFresh) { //首次进入， 加载数据
                me.refresh();
            } else if (!me.loading) { //窗口大小改变
                me.ui.paint(true);//渲染数据
            }
        },
        /*滚动条滚动时的处理逻辑*/
        on_win_scroll: function () {
            if (!this.is_activated()) return;
            var me = this;
            if (!me.loading && scroller.is_reach_bottom()) {
                me.ui.paint();//渲染数据
            }
        },

        /*获取列表 完成 后回调事件*/
        _cgi_load: function () {
            this.last_load_req = null;
            this.loading = false;
        },
        /*获取列表 出错 后回调事件*/
        _cgi_error: function (msg) {
            this._cgi_load();
            mini_tip.error(msg, 3, msg_top);
        },
        /*获取列表 成功 后回调事件*/
        _cgi_ok: function (msg, body, cover, req_num, ok_tips) {
            var me = this,
                content = body.FileItem_items || [],
                len = req_num - content.length;
            me._cgi_load();
            if (len > 0) { //针对后台不返回破损文件，但将破损文件计入到最近文件总数中；进行补差操作
                while (len) {
                    content.push(undefined);
                    len -= 1;
                }
            }
            //body={content:[],total:0};//测试无数据时的场景 todo
            me.data.grep_data(content, cover); //数据过滤
            me.ui.paint(true); //ui 显示加载的数据，首屏渲染
            me.all_loaded = true;//数据只加载一次， 就加载完了
            ok_tips && mini_tip.ok(ok_tips, 3, msg_top); //刷新成功后提示消息

            main_ui.sync_size();
        },

        /*abort ajax 服务请求*/
        _abort_request: function () {
            var me = this;
            if (me.last_load_req) {
                me.last_load_req.destory();
                me._cgi_load();
            }
        },
        /*
         *请求列表数据
         *@param opts 请求封装参数
         **/
        _request: function () {
            filter(this, arguments, function (opts) {
                var me = this,
                    _opts = {
                        'offset': opts.offset,
                        'number': opts.number || MAX_LENGTH,
                        'after': opts.after || function () {
                            me.ui.loadBtn(false);
                        },
                        'before': opts.before || function () {
                            me.ui.loadBtn(true);
                        },
                        'cover': opts.cover || false,
                        'ok_tips': opts.ok_tips || false
                    };

                me.loading = true;
                me._abort_request();
                _opts.before(); //请求开始之前的操作


                var cgi_url = 'http://web2.cgi.weiyun.com/library.fcg',
                    cgi_cmd = 'LibAllListGet';
                //直接通过hash进入最近文件时有可能quey_user还未完成（非直出下）
                query_user.on_ready(function(user) {
                    if(user && user.is_lib3_user()) {
                        cgi_url = 'http://web2.cgi.weiyun.com/user_library.fcg';
                        cgi_cmd = 'LibPageListGet';
                    }
                    me.last_load_req = request.xhr_get({
                        url: cgi_url,
                        cmd: cgi_cmd,
                        cavil: true,
                        pb_v2: true,
                        body: {
                            lib_id: 100,
                            count: 200,
                            sort_type: 0,
	                        get_abstract_url: true
                        }
                    }).ok(function (msg, body) {
                        if (_opts.ok_tips === '') {
                            return;
                        }
                        me._cgi_ok(msg, body, _opts.cover, _opts.number, _opts.ok_tips);
                    }).fail(function (msg) {
                        me._cgi_error(msg);
                    }).done(_opts.after); //请求结束后的操作
                });

            });
        }
    });
    module.exports = file_list;
});