//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/recent/recent.r151015",["lib","common","$","main"],function(require,exports,module){

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
//recent/src/file_list/file.js
//recent/src/file_list/file_list.js
//recent/src/file_list/ui.js
//recent/src/recent.js
//recent/src/tbar.js
//recent/src/ui.js
//recent/src/recent.tmpl.html

//js file list:
//recent/src/file_list/file.js
//recent/src/file_list/file_list.js
//recent/src/file_list/ui.js
//recent/src/recent.js
//recent/src/tbar.js
//recent/src/ui.js
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define.pack("./file_list.file",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        File_Node = common.get('./file.file_object'),

        collections = lib.get('./collections'),
        date_time = lib.get('./date_time'),
        max_length = 100; //最大容量

    return {
        T: [],//today
        Y: [],//yesterday
        S: [],//last7day
        L: [],//longtimeago
        ALL: [],
        is_full: false,
        get_length: function(){
            return this.ALL.length;
        },
        clear: function () {
            this.T = [];
            this.Y = [];
            this.S = [];
            this.L = [];
            this.ALL = [];
            this.is_full = false;
        },
        grep_data: function (list, cover) {
            var me = this,
                today = date_time.today().getTime(),
                yesterday = date_time.yesterday().getTime(),
                last7day = date_time.add_days(-7).getTime();

            //覆盖
            if (cover) {
                me.clear();
            }

            $.each(list, function (i, unit) {
                if (unit) {//unit可能为空
                    //适配 返回数据与前端数据结构
                    var file = new File_Node({
                            "name": unit.filename,
                            "create_time": unit.file_ctime,
                            "modify_time": unit.file_mtime,
                            "cur_size": unit.file_size,
                            "pid": unit.pdir_key,
                            "id": unit.file_id,
                            "size": unit.file_size,
		                    "ext_info": unit.ext_info
                        }),
                        date = new Date(unit.file_mtime),
                        time = unit.file_mtime;
                    //按日期分类
                    if (time >= today) {
                        file._html_time = me._get_html_time(date,'T');
                        me.T.push(file);
                    } else if (time >= yesterday) {
                        file._html_time = me._get_html_time(date,'Y');
                        me.Y.push(file);
                    } else if (time >= last7day) { //增加最近7天的数据
                        file._html_time = me._get_html_time(date);
                        me.S.push(file);
                    } else {
                        file._html_time = me._get_html_time(date);
                        me.L.push(file);
                    }
                    me.ALL.push(file);
                }
            });

            //按时间排序
            me.T.sort(me._sort_fn);
            me.Y.sort(me._sort_fn);
            me.S.sort(me._sort_fn);
            me.L.sort(me._sort_fn);
        },
        /**
         * 返回页面显示时间
         * @param {Date} date
         * @param {String} [type]
         * @returns {string}
         */
        _get_html_time: function(date , type){
            var me = this;
            if(type==='T'){
                return '今天 ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            } else if( type === 'Y'){
                return '昨天 ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            } else {
                return date.getFullYear() + '-' + ( date.getMonth() + 1) + '-' + date.getDate() + ' ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            }
        },
        fixNum: function (num) {
            var n = num - 0;
            if ((n + '').length == 1) {
                return '0' + n;
            }
            return n;
        },
        _sort_fn: function (f1, f2) {
            var f1_time = date_time.parse_str(f1.get_modify_time()).getTime(),
                f2_time = date_time.parse_str(f2.get_modify_time()).getTime();
            return f1_time -f2_time > 0 ? -1 : (f1_time - f2_time === 0 ? 0 : 1);
        },
        get_file_by_id: function (id) {
            var ret;
            if (this.ALL.length) {
                $.each(this.ALL, function (i, file) {
                    if (file.get_id() === id) {
                        ret = file;
                        return false;
                    }
                });
            }
            return ret;
        }
    };
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define.pack("./file_list.file_list",["lib","common","$","main","./ui","./tbar","./file_list.file","./file_list.ui"],function (require, exports, module) {
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
        mini_tip = common.get('./ui.mini_tip_v2'),
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
	        //try{
		     //   var flag = '21254-1-9';
		     //   if(window.g_start_time) {
			 //       huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
		     //   }
	        //} catch(e) {

	        //}
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
                    var $target = $(e.target).closest('[data-function]');
                    if ($target && $target.attr('data-function') == 'qr_code') {
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

                        // 视频预览，
                        // 如果是视频，则跳到云播页面进行播放
                        if (file.is_video()) {
                            window.open('//www.weiyun.com/video_preview?' +
                                'videoID=' + file.get_id() +
                                '&dirKey=' + file.get_pid() +
                                '&pdirKey=34cc7db8f338fdcb41c5dfa52b9ed888');

                            user_log('ITEM_CLICK_VIDEO_PREVIEW');
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
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define.pack("./file_list.ui",["lib","common","$","./tmpl","./file_list.file"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        tmpl = require('./tmpl'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
	    huatuo_speed = common.get('./huatuo_speed'),
        https_tool = common.get('./util.https_tool'),
        image_loader = lib.get('./image_loader'),

        file_data = require('./file_list.file'),

        jquery_ui,
        drag_files,
        thumb_loader, //缩略图加载器

        STEP_COUNT = 10,//第次滚动渲染数据的条数
        LINEHEIGHT = 50, //列表行高
        HEADHEIGHT = 50, //页头高度
        TIMES = 1.5, //可见列表高度倍数

        today_queue,//等待渲染的今天数据
        yesterday_queue,//等待渲染的昨天数据
        last7day_queue,//等待渲染最近7天的数据
        longtime_queue,//等待渲染的更早数据
        undef;

    var ui = new Module('recent_ui', {

        //拖拽的支持
        draggable : false,
        draggable_key : 'recent',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        render: function () {
            var me = this,
                _download = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    me.trigger('download', me._get_file_id(this), e);
                },
                _enter = function (e) {
                    e.preventDefault();
                    me.trigger('enter', me._get_file_id(this), e);
                };
            this._get_data_wraper()
                .off('click.icon-download', '[data-function=download]')
                .on('click.icon-download', '[data-function=download]', _download)
                .off('click.ui-item', '[data-file-id]')
                .on('click.ui-item', '[data-file-id]', _enter);

        },
        _get_file_id: function (dom) {
            return $(dom).closest('[data-file-id]').attr('data-file-id');
        },
        //把模版html外层再包一个div
        get_recent_group: function(html) {
            return '<div class="list-group-recent-item">' + html + '</div>'
        },
        get_list_group: function(html) {
            return '<ul class="list-group">' + html + '</ul>'
        },
        _get_paint_unit: function (ary, type) {
            var html = '';
            if (ary && ary.length) {
                html = this.get_list_group(tmpl.row({'files': ary, 'time': type}));
                if (html && ary[0].get_id() === file_data[type][0].get_id()) {//首次渲染把单元标题加上
                    return this.get_recent_group(tmpl['bar']({'time': type}) + html);
                }
            }
            return this.get_recent_group(html);
        },
        /*
         *@today     今天的变更文件 array
         *@yesterday 昨天的变更文件 array
         *@last7day  最近7天的变更文件 array
         *@longtime  昨天的变更文件 array
         *call by file_list
         */
        _has_data: false,

        /**
         * 渲染数据
         * @param is_first_page 是否是首屏
         */
        paint: function (is_first_page) {
            var me = this,
                paint_count,//要渲染的条数
                html = [],
                paint_data;

            //首屏渲染
            if (is_first_page) {
                paint_count = Math.max(Math.ceil((($(window).height() - HEADHEIGHT) / LINEHEIGHT) * TIMES), STEP_COUNT); //首屏渲染的列表文件条数
                today_queue = file_data.T.slice(0);
                yesterday_queue = file_data.Y.slice(0);
                last7day_queue = file_data.S.slice(0);
                longtime_queue = file_data.L.slice(0);
            } else {
                paint_count = STEP_COUNT;//非首屏渲染时，每滚动渲染10条
            }

            //今天
            if (today_queue.length > 0) {
                paint_data = today_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'T'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //昨天
            if (yesterday_queue.length > 0 && paint_count > 0) {
                paint_data = yesterday_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'Y'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //最近7天
            if (last7day_queue.length > 0 && paint_count > 0) {
                paint_data = last7day_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'S'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //7天前
            if (longtime_queue.length > 0 && paint_count > 0) {
                html.push(me._get_paint_unit(longtime_queue.splice(0, paint_count), 'L'));
            }

            if (html.length) {
                if (is_first_page) {
                    me._get_data_wraper().empty();
                }
                me._get_data_wraper().append(html.join(''));
                me._render_thumb();
                me._render_video_thumb();
                me._has_data = true;
            }

            if (is_first_page) {//首屏渲染时，如果都没数据显示，则显示无数据背景
                me.load_empty_body(!html.length);
            }
            //me._finished(isfinished);

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {

                this.set_draggable(true);

                me._render_drag_files();

            }

	        //测速
	        //try{
		     //   var flag = '21254-1-9';
		     //   if(is_first_page && window.g_start_time) {
			 //       huatuo_speed.store_point(flag, 3, new Date() - window.g_start_time);
			 //       huatuo_speed.report(flag);
		     //   }
	        //} catch(e) {
            //
	        //}
        },

        get_thumb_loader: function() {
            var def = $.Deferred();

            if(!thumb_loader) {
                require.async('downloader', function(mod) {
                    var Thumb_loader = mod.get('./Thumb_loader');
                    thumb_loader = new Thumb_loader({
                        width: 32,
                        height: 32
                    });
                    def.resolve(thumb_loader);
                });
            } else {
                def.resolve(thumb_loader);
            }

            return def;
        },

        _render_thumb: function() {
            var me = this;
            this.get_thumb_loader().done(function(thumb_loader) {
                me._get_data_wraper().find('[data-init=0]').each(function (i, n) {
                    var id = me._get_file_id(n),
                        file = file_data.get_file_by_id(id);
                    if(file.is_image()) {
                        thumb_loader.get(file.get_pid(), file.get_id(), file.get_name(), file.get_thumb_url()).done(function(url, img) {
                            var $icon = $(n);
                            $icon.attr({'data-init': '1'});
                            me.set_image($icon, img);
                        });
                    }
                });
            });
        },

        _render_video_thumb: function() {
            var me = this;

            me._get_data_wraper().find('[data-init=0]').each(function (i, n) {
                var id = me._get_file_id(n),
                    file = file_data.get_file_by_id(id),
                    video_thumb_url = https_tool.translate_cgi(file.get_video_thumb_url(64));

                if(file.is_video()) {
                    image_loader.load(video_thumb_url).done(function(img) {
                        var $icon = $(n);
                        $icon.attr({'data-init': '1'});
                        me.set_image($icon, img);
                    }).fail(function() {
                        //todo 是否选择重试
                    });
                }
            });
        },
        /**
         * 替换真正的缩略图
         * @param $icon 默认图标
         * @param img 拉取的缩略图
         */
        set_image: function ($icon, img) {
            if ($icon[0]) {
                var $img_copy = $(img).clone();

                $.each($icon[0].attributes, function (i, attr) {
                    if (attr.nodeName.indexOf('data-') === 0) {
                        $img_copy.attr(attr.nodeName, $icon.attr(attr.nodeName));
                    }
                });

                var copy_attr_list = { unselectable: 1 };
                $.each(copy_attr_list, function (attr_name) {
                    $img_copy.attr(attr_name, $icon.attr(attr_name));
                });

                //$img_copy[0].className = $icon[0].className;
                $img_copy.attr('unselectable', 'on');
                $img_copy.addClass('icon icon-m icon-pic-m');
                $icon.replaceWith($img_copy);
            }
        },
        /*清空列表*/
        empty_list: function () {
            this._get_data_wraper().empty();
        },
        /*返回列表数据对象的包裹jQuery对象*/
        _get_data_wraper: function () {
     //       return this.$wraper || (this.$wraper = constants.UI_VER === 'APPBOX' ? this._get_container() : this._get_container().children('[data-id="file_list_container"]'));
            return this.$wraper || (this.$wraper =this._get_container().find('[data-id=file_list]'));

        },
        /*返回列表框架的包裹jQuery对象*/
        _get_container: function () {
            return this.$table ? this.$table : this.$table = $('#_recent_body');
        },
        /*隐藏或显示 正在加载button call by file_list*/
        loadBtn: function (is_show) {
            ( this.$load_btn || ( this.$load_btn = $(tmpl.tail_load()).appendTo(this._get_container())) )
                [ is_show ? 'show' : 'hide' ]();
            is_show && this._has_data && user_log('RECENT_LOAD_MORE');//添加 加载更多统计
        },
        /*列表为空,加载无文件背景*/
        load_empty_body: function (is_show) {
            ( this.$empty_body || ( this.$empty_body = $(tmpl.empty_body()).appendTo(this._get_container()))   )
               [ is_show ? 'show' : 'hide' ]();
            this._get_container().toggleClass('ui-view-empty', is_show);
        },
        /*列表加载完成
         _finished: function(is_show){
         ( this.$loaded || ( this.$loaded = $(tmpl.tail_loaded()).appendTo(this._get_container()))   )
         [ is_show ? 'show' : 'hide' ]();
         }
         */

        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },

        update_draggable : function(){
            if(!this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me._get_data_wraper().children('[data-file-id]');
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        handle_start_drag : function(e, ui){
            var $target_el = $(e.originalEvent.target),
                $curr_item = $target_el.closest('[data-file-id]'),
                curr_item_id = $curr_item.attr('data-file-id');

            var item = file_data.get_file_by_id(curr_item_id),
                items = [item];

            if(!this.draggable || !items){
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        }


    });
    return ui;
});

/**
 * 回收站主
 * @author trumpli
 * @date 13-6-
 */
define.pack("./recent",["lib","common","./file_list.file_list","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        console = lib.get('./console'),
        Module = common.get('./module'),
	    huatuo_speed = common.get('./huatuo_speed'),
        file_list = require('./file_list.file_list'),
        slice = [].slice,

        undefined;


    var recent = new Module('recent', {

        ui: require('./ui'),

        /**
         * 渲染子模块
         * @param {Module} sub_module
         * @param {*} arg1
         * @param {*} arg2
         */
        render_sub: function (sub_module, arg1, arg2 /*...*/) {
            try {
                var args = slice.call(arguments, 1);
                sub_module.render.apply(sub_module, args);

                this.add_sub_module(sub_module);
            } catch (e) {
                console.error('recent.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;

        }
    });

    recent.on('render', function () {
	    try{
		    var flag = '21254-1-9';
		    if(window.g_start_time) {
			    huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		    }
	    } catch(e) {

	    }
        this.render_sub(file_list);
    });

    return recent;
});/**
 * 工具条
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./tbar",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('recent/tbar'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),

        toolbar,

        undef;


    return new Module('recent_tbar', {

        /**
         * 渲染工具栏
         * @param $to 工具类添加的位置
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                        e.stopImmediatePropagation();
                    }
                },

                btns = [

                    //清空记录按钮
                    new Button({
                        id: 'clear_recent',
                        label: '清空记录',
                        icon: 'ico-clearrecnet',
                        filter: 'normal',
                        handler: default_handler
                    }),

                    //刷新按钮
                    new Button({
                        id: 'refresh',
                        label: '',
                        icon: 'ico-ref',
                        filter: 'normal',
                        short_key: 'ctrl+alt+r',
                        handler: default_handler
                    })
                ];


            toolbar = new Toolbar({
                btns: btns,
                cls: 'recent-toolbar',
                filter_visible: true
            });
            toolbar.render($to);
        }
    });
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define.pack("./ui",["common","$","main","./tmpl","./tbar"],function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),

        main_ui = require('main').get('./ui'),

        uiv = constants.UI_VER,

        tmpl = require('./tmpl'),
        tbar = require('./tbar');

    var ui = new Module('recent_ui', {

        render: function () {

            this.get_$body().appendTo(main_ui.get_$body_box());

            this
                .on('activate', function () {
                    main_ui.get_$body_box().children().addClass('mod-list-group-recent');
                    this.get_$body().show();
                    if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                        this.get_$body().repaint();
                    }
                })
                .on('deactivate', function () {
                    this.get_$body().hide();
                    main_ui.get_$body_box().children().removeClass('mod-list-group-recent');
                });


            this._render_ie6_fix();

            tbar.render(this.get_$main_bar1());
        },
        get_$body: function () {
            return this._$body || (this._$body = $(tmpl['body']()));
        },
        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },
        //ie6 鼠标hover效果
        _render_ie6_fix: function () {
            if ($.browser.msie && $.browser.version < 7){
                var me = this,
                   // hover_cls = constants.UI_VER === 'WEB' ? 'hover' : 'list-hover';
                   hover_cls = 'list-hover';
                me.get_$body()
                    .on('mouseenter', '[data-file-id]', function () {
                        $(this).addClass(hover_cls);
                    })
                    .on('mouseleave', '[data-file-id]', function () {
                        $(this).removeClass(hover_cls);
                    });
            }
        }
    });
    return ui;
});

//tmpl file list:
//recent/src/recent.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'empty_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_recent_files_empty" class="g-empty sort-recent-empty" style="display: none;">\r\n\
        <div class="empty-box">\r\n\
            <!-- 最近为空 -->\r\n\
            <div class="status-inner">\r\n\
                <i class="icon icon-norecent"></i>\r\n\
                <h2 class="title">最近为空</h2>\r\n\
                <p class="txt">您最近还没有操作过任何文件哦~</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'row': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),

        $ = require('$'),

        date_time = lib.get('./date_time'),
        common = require('common'),
        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        read_mode = scr_reader_mode.is_enable(),

        files        = data.files,
        only_content = data.only_content === true,
        tType        = data.time,

        // 默认图片
        default_image = constants.RESOURCE_BASE + '/img/img-32.png';

    $.each(files, function (i, file) {
        var is_image = file.is_image() || file.is_video(),
            icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'nor'),
            text_name = text.text(file.get_name());
    __p.push('    <li data-file-id="');
_p(file.get_id());
__p.push('" class="list-group-item">\r\n\
        <div class="item-tit">');
 if(is_image) { __p.push('            <div data-action="enter" class="thumb"><i data-init="0" class="icon icon-m icon-pic-m"></i></div>');
 } else { __p.push('            <div data-action="enter" class="thumb"><i class="icon icon-m ');
_p(icon_class);
__p.push('-m"></i></div>');
 } __p.push('            <div data-action="enter" class="info">\r\n\
                <span class="tit" data-quick-drag data-name="file_name" title="');
_p(text_name);
__p.push('">');
_p(text_name);
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div data-action="enter" class="item-info">\r\n\
             <span class="item-info-list">\r\n\
              <span class="mod-act-list tool">\r\n\
                    <a data-function="download" data-tj-action="btn-adtag-tj" data-tj-value="57001" title="下载" aria-label="');
_p(text_name);
__p.push('" tabindex="0" hidefocus="on" class="act-list" title="下载" href="#"><i class="icon icon-down"></i></a>\r\n\
                    <a data-function="qr_code" tabindex="0" class="act-list" title="二维码" href="#"><i class="icon icon-code"></i></a>\r\n\
              </span>\r\n\
         </span>\r\n\
            <span class="item-info-list item-info-size">\r\n\
                <span class="txt txt-size">');
_p( file.get_readability_size(true) );
__p.push('</span>\r\n\
            </span>\r\n\
            <span class="item-info-list item-info-time-size">\r\n\
                <span class="txt txt-time">');
_p( file._html_time );
__p.push('</span>\r\n\
            </span>\r\n\
        </div>\r\n\
    </li>');
});__p.push('');

return __p.join("");
},

'tail_load': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj');__p.push('    <a href="javascript:void(0)" class="load-more"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
},

'tail_loaded': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj');__p.push('    <a href="javascript:void(0)" class="load-more" style="cursor: default;">加载完成</a>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_recent_body" class="mod-list-group" data-label-for-aria="最近文件列表内容区域">\r\n\
        <div class="list-group-bd">\r\n\
            <ul id="_recent_view_list" data-id="file_list" class="list-group-recent">\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'bar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="recent-item-tit">\r\n\
        <span class="tit">');
_p(( data.time==='T'?'今天':( data.time==='Y'?'昨天':( data.time ==='S'?'最近7天':'7天前' ) ) ));
__p.push('</span>\r\n\
    </div>');

return __p.join("");
},

'drag_cursor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),

        length = data.files.length,
        files = data.files.slice(0, 4);
    __p.push('    <div class="icons">');
 $.each(files, function (i, file) { __p.push('            <i class="icon icon');
_p( i );
__p.push(' filetype icon-');
_p( file.get_type() );
__p.push('"></i>');
 }); __p.push('    </div>\r\n\
    <span class="sum">');
_p( length );
__p.push('</span>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
