//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","$","i18n","main"],function(require,exports,module){

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
//recent/src/ui.js
//recent/src/recent.APPBOX.tmpl.html
//recent/src/recent.WEB.tmpl.html
//recent/src/recent.tmpl.html

//js file list:
//recent/src/file_list/file.js
//recent/src/file_list/file_list.js
//recent/src/file_list/ui.js
//recent/src/recent.js
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
        max_length   = 100; //最大容量

    return {
        T:[],//today
        Y:[],//yesterday
        L:[],//longtimeago
        ALL:[],
        is_full: false,
        clear: function(){
            this.T = [];
            this.Y = [];
            this.L = [];
            this.ALL = [];
            this.is_full = false;
        },
        grep_data: function(list , total, cover){
            var me       = this,
                today     = date_time.today().getTime(),
                yesterday = date_time.yesterday().getTime();

            //覆盖
            if( cover ){
                me.clear();
            }

            //计算最大容量
            var cache_total = list.length + this.ALL.length,
                max_len     = Math.min( total , max_length );
            if( cache_total >= max_len ){
                me.is_full = true;
                var dLen = cache_total - max_len ;
                if( dLen > 0 && dLen < list.length ){
                    list = list.slice(0 , list.length - dLen );
                }
                if( !list.length ){
                    return;
                }
            }else{
                me.is_full = false;
            }
            $.each(list,function(i,unit){
                if( unit ) {//unit可能为空
                    //适配 返回数据与前端数据结构
                    var file = new File_Node({
                            "name"       : unit.name,
                            "create_time": ( unit.ctime && unit.ctime.length==23 ? unit.ctime.substring(0,19) : unit.ctime ),
                            "cur_size"   : unit.size,
                            "pid"        : unit.file_id.substring(0,32),
                            "id"         : unit.file_id.substring(32),
                            "size"       : unit.size
                        }),
                        time = date_time.parse_str( file.get_create_time() ).getTime();
                    //按日期分类
                    if(time >= today){
                        me.T.push(file);
                    } else if(time >= yesterday){
                        me.Y.push(file);
                    } else {
                        me.L.push(file);
                    }
                    me.ALL.push(file);
                }
            });

            //按时间排序
            me.T.sort(me._sort_fn);
            me.Y.sort(me._sort_fn);
            me.L.sort(me._sort_fn);
        },
        _sort_fn: function(f1,f2){
            return date_time.parse_str( f2.get_create_time()).getTime() - date_time.parse_str( f1.get_create_time()).getTime();
        },
        get_file_by_id: function(id){
            var ret;
            if(this.ALL.length){
                $.each(this.ALL,function(i,file){
                    if( file.get_id() === id ){
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
define.pack("./file_list.file_list",["lib","common","$","i18n","./file_list.file","./file_list.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        _ = require('i18n'),

        _console = lib.get('./console'),
        security = lib.get('./security'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),

        global_event = common.get('./global.global_event'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip'),
        Paging_Helper = common.get('./ui.paging_helper'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        filter = common.get('./filter.session_filter'),
        urls = common.get('./urls'),
        m_speed = common.get('./m_speed'),
        helper = new Paging_Helper({}),

        MAX_LENGTH = 100,//最大加载数据大小
        downloader, //下载模块
        doc_preview, //文档预览模块

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

        _speed_report: function (submod) { /*发送测速数据*/
            var me = this;
            // 测速
            try {
                if ('js_css' === submod) {
                    if (!me._speed_js_css) {
                        m_speed.send('recent', submod);
                        me._speed_js_css = true;
                    }
                } else if ('first_batch_data' === submod) {
                    if (!me._speed_first_batch_data) {
                        m_speed.done('recent', submod);
                        m_speed.send('recent', submod);
                        me._speed_first_batch_data = true;
                    }
                }
            } catch (e) {
            }
        },
        /*根据窗口的可视高宽，需改图片预览的尺寸*/
        _set_pre_size: function (width, height) {
            this.pre_size = Math.max(width, height) > 1024 ? '1024*1024' : '640*640';
        },

        render: function () {
            this._render_event();
            this.on('activate', this._render_activate);

            if (uiv === 'WEB') {
                this.on('deactivate', function () {
                    $(document.body).removeClass('app-recent');
                });
            }
        },
        _render_activate: function () {
            if (uiv === 'WEB') {
                $(document.body).addClass('app-recent');
            }

            //文件下载不存在时，刷新列表
            this.listenTo(session_event, 'downloadfile_not_exist', function () {
                this.refresh();
            });

            var me = this;
            me._speed_report('js_css');
            m_speed.start('recent', 'first_batch_data'); //测速第一批数据
            if (!me.data.is_full) {
                me.on_win_resize($(window).width(), $(window).height(), true); //设置列表显示条数 , 刷新列表
            }
            !downloader && require.async('downloader', function (mod) { //异步加载downloader
                downloader = mod;
                me.ui.set_func_for_img_logo(function (fileid, ext) { //初始化 ui 获取image图片的方法
                    var file = me.data.get_file_by_id(fileid),
                        url;
                    if (file) {
                        url = downloader.get_down_url(file, ext);
                    }
                    return url;
                });
            });
            !doc_preview && require.async('doc_preview', function (mod) { //异步加载doc_preview
                doc_preview = mod.get('./doc_preview');
            });
        },
        _render_event: function () {
            this.off(global_event, 'recent_refresh').off(global_event, 'window_scroll').off(global_event, 'window_resize')
                .listenTo(global_event, 'recent_refresh', this.refresh)
                .listenTo(global_event, 'window_scroll', this.on_win_scroll)
                .listenTo(global_event, 'window_resize', this.on_win_resize)

                .off(this.ui, 'enter').off(this.ui, 'download')
                .listenTo(this.ui, 'enter', this.enter)
                .listenTo(this.ui, 'download', this.download);
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

                    // 压缩包预览
                    if (file.is_compress_file()) {
                        return me._preview_zip_file(file);
                    }

                    // 文档预览
                    if (file.is_preview_doc()) {
                        var size_limit = constants.DOC_PREVIEW_SIZE_LIMIT[file.get_type()];
                        if (!size_limit || file.get_size() < size_limit) {
                            return me.doc_preview(file);
                        }
                    }

                    // 图片预览
                    if (file.is_image()) {
                        return me._preview_image(file);
                    }

                    // 其他类型文件，直接下载
                    user_log('ITEM_CLICK_DOWNLOAD');
                    me.download(fileid, e);
                }
            });
        },

        // 压缩包预览
        _preview_zip_file: function (file) {

            require.async('compress_file_iframe', function (mod) {
                var compress_file_iframe = mod.get('./compress_file_iframe'),
                    iframe = compress_file_iframe.create_preview({
                        file: file,
                        max_width: constants.IS_APPBOX ? 670 : 915
                    });

                iframe.set_title(file.get_name());
                iframe.show();
            });

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

            require.async('image_preview', function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                // 所有的图片(按照时间顺序显示)
                    images = $.grep(me.data.T.concat(me.data.Y).concat(me.data.L), function (file) {
                        return file.is_image();
                    });


                // 当前图片所在的索引位置
                var index = $.inArray(file, images);

                image_preview.start({
                    support_nav: true,
                    total: images.length,
                    index: index,
                    raw: true,
                    downloader: true,
                    get_url: function (index) {
                        var file = images[index];
                        return file ? downloader.get_down_url(file, { abs: '640*640' }) : null;
                    },
                    download: function (index, e) {
                        var file = images[index];
                        if (file) {
                            downloader.down(file, e);
                        }
                    },

                    raw: function (index) {
                        var file = images[index];
                        return file ? downloader.get_down_url(file, {
                            dtype: 0
                        }) : null;
                    }
                });
            });
            user_log('ITEM_CLICK_IMAGE_PREVIEW');//数据上报
        },

        /*
         *文档预览
         *@param file fileObject 对象
         */
        doc_preview: function (file) {
            if (!doc_preview) {
                _console.log('doc_preview未初始化');
                return false;
            }
            doc_preview.preview(file);
            user_log('ITEM_CLICK_DOC_PREVIEW');
            return true;
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
        /*
         *刷新列表 ，入口包括 menu上刷新按钮、初始化时的加载动作
         */
        refresh: function (tips_hide) {
            var me = this;
            if (!me.loading) {
                me._request({
                    'offset': 0,
                    'number': MAX_LENGTH, //加载，重新加载数据
                    'cover': true,
                    'before': function () {
                        me.ui.empty_list();
                        if (uiv === 'APPBOX') {
                            me.ui._get_container().hide();
                        }
                        widgets.loading.show();
                    },
                    'after': function (msg, ret) {
                        widgets.loading.hide();
                        if (!ret && uiv === 'APPBOX') {
                            me.ui._get_container().show();
                        }
                    },
                    'ok_tips': tips_hide ? '' : 'Updated'
                });
            }
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
                var tips_hide = true;
                me.refresh(tips_hide);
            } else if (!me.loading) { //窗口大小改变
                me.ui.paint(true);//渲染数据
            }
        },
        /*滚动条滚动时的处理逻辑*/
        on_win_scroll: function () {
            if (!this.is_activated()) return;
            var me = this;
            if (!me.loading && helper.is_reach_bottom()) {
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
                content = body.content || [],
                len = req_num - content.length;
            me._cgi_load();
            if (len > 0) { //针对后台不返回破损文件，但将破损文件计入到最近文件总数中；进行补差操作
                while (len) {
                    content.push(undefined);
                    len -= 1;
                }
            }
            //body={content:[],total:0};//测试无数据时的场景 todo
            me.data.grep_data(content, body.total, cover); //数据过滤
            me.ui.paint(true); //ui 显示加载的数据，首屏渲染
            me.all_loaded = true;//数据只加载一次， 就加载完了
            me._speed_report('first_batch_data');
            ok_tips && mini_tip.ok(ok_tips, 3, msg_top); //刷新成功后提示消息
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
                    },
                    cgi_url = 'http://api.weiyun.com/get_list?appid=' + 30207 //写死30207
                        +
                        '&libtype=recent&req_type=jsonp' + '&token=' + security.getAntiCSRFToken() + '&offset=' + (_opts.offset || 0) + '&number=' + (_opts.number || 20);

                me.loading = true;
                me._abort_request();
                _opts.before(); //请求开始之前的操作

                me.last_load_req = request.get({
                    just_plain_url: true,
                    url: cgi_url,
                    //cmd             :'get_list',
                    cavil: true,
                    resend: true,
                    adaptDate: function (resp) { //老接口，用adaptDate方法匹配前端数据响应结构
                        resp.rsp_header = {
                            'ret': resp.ret || 0
                        };
                        resp.rsp_body = {
                            'content': resp.data && resp.data.content || [],
                            'total': resp.data && resp.data.file_total || 0
                        };
                        if (resp.rsp_header.ret === 30013) { //容错offset偏移错误
                            resp.rsp_header.ret = 0;
                        }
                        delete resp.data;
                        delete resp.ret;
                        return resp;
                    }
                }).ok(function (msg, body) {
                        if(_opts.ok_tips === ''){
                            return;
                        }
                        me._cgi_ok(msg, body, _opts.cover, _opts.number, _opts.ok_tips);
                    }).fail(function (msg) {
                        me._cgi_error(msg);
                    }).done(_opts.after); //请求结束后的操作
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
define.pack("./file_list.ui",["common","$","./tmpl","./file_list.file"],function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        tmpl = require('./tmpl'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        file_data = require('./file_list.file'),

        uiv = constants.UI_VER,

        STEP_COUNT = 10,//第次滚动渲染数据的条数
        LINEHEIGHT = 50, //列表行高
        HEADHEIGHT = 50, //页头高度
        TIMES = 1.5, //可见列表高度倍数

        today_queue,//等待渲染的今天数据
        yesterday_queue,//等待渲染的昨天数据
        longtime_queue,//等待渲染的更早数据
        undef;

    var ui = new Module('recent_ui', {

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
        _get_paint_unit: function (ary, type) {
            var html = '';
            if (ary && ary.length) {
                html = tmpl.row({'files': ary, 'time': type});
                if (html && ary[0].get_id() === file_data[type][0].get_id()) {//首次渲染把单元标题加上
                    return tmpl['bar_' + uiv]({'time': type}) + html;
                }
            }
            return html;
        },
        /*
         *@today     今天的变更文件 array
         *@yesterday 昨天的变更文件 array
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
                html = '',
                paint_data;

            //首屏渲染
            if (is_first_page) {
                paint_count = Math.max(Math.ceil((($(window).height() - HEADHEIGHT) / LINEHEIGHT) * TIMES), STEP_COUNT); //首屏渲染的列表文件条数
                today_queue = file_data.T.slice(0);
                yesterday_queue = file_data.Y.slice(0);
                longtime_queue = file_data.L.slice(0);
            } else {
                paint_count = STEP_COUNT;//非首屏渲染时，每滚动渲染10条
            }

            //今天
            if (today_queue.length > 0) {
                paint_data = today_queue.splice(0, paint_count);
                html += me._get_paint_unit(paint_data, 'T');
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //昨天
            if (yesterday_queue.length > 0 && paint_count > 0) {
                paint_data = yesterday_queue.splice(0, paint_count);
                html += me._get_paint_unit(paint_data, 'Y');
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //更早
            if (longtime_queue.length > 0 && paint_count > 0) {
                html += me._get_paint_unit(longtime_queue.splice(0, paint_count), 'L');
            }

            if (html !== '') {
                if (is_first_page) {
                    me._get_data_wraper().html('');
                }
                me._get_data_wraper().append(html);
                me._init_img_logo();
                me._has_data = true;
            }

            if (is_first_page) {//首屏渲染时，如果都没数据显示，则显示无数据背景
                me.load_empty_body(html == '' ? true : false);
            }
            //me._finished(isfinished);
        },
        //外部控制器 提供生成缩略图的方法 call by file_list
        set_func_for_img_logo: function (fn) {
            var me = this;
            me._get_img_url = fn;
            me._init_img_logo();
        },
        _get_img_url: $.noop(),
        _init_img_logo: function () {
            var me = this;
            if (me._get_img_url) {
                me._get_data_wraper().find('img[data-init=0]').each(function (i, n) {
                    var id = me._get_file_id(n),
                        url = me._get_img_url(id, {abs: '32*32'});
                    if (url) {
                        $(n).attr({'data-init': '1', 'src': url});
                    }
                });
            }
        },
        /*清空列表*/
        empty_list: function () {
            $(window).scrollTop(0);
            this._get_data_wraper().empty();
        },
        /*返回列表数据对象的包裹jQuery对象*/
        _get_data_wraper: function () {
            return this.$wraper || (this.$wraper = constants.UI_VER === 'APPBOX' ? this._get_container() : this._get_container().children('[data-id="file_list_container"]'));
        },
        /*返回列表框架的包裹jQuery对象*/
        _get_container: function () {
            return this.$table ? this.$table : this.$table = $('#recent_table');
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
        }
        /*列表加载完成
         _finished: function(is_show){
         ( this.$loaded || ( this.$loaded = $(tmpl.tail_loaded()).appendTo(this._get_container()))   )
         [ is_show ? 'show' : 'hide' ]();
         }
         */


    });
    return ui;
});

/**
 * 回收站主
 * @author trumpli
 * @date 13-6-
 */
define.pack("./recent",["lib","common","$","./ui","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        Module = common.get('./module'),

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
        var ui = this.ui,
            recent_list = require('./file_list.file_list');

        this.render_sub(recent_list);
    });

    return recent;
});/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define.pack("./ui",["common","i18n","$","main","./tmpl"],function (require, exports, module) {
    var common = require('common'),
        _ = require('i18n'),
        $ = require('$'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        uiv = constants.UI_VER,

        tmpl = require('./tmpl');

    var ui = new Module('recent_ui', {

        render: function () {

            this.get_$body().appendTo(main_ui.get_$body_box());

            this
                .on('activate', function () {
                    this._$body.show();
                    if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                        this.get_$body().repaint();
                    }

                    if (uiv === 'WEB') {
                        global_event.trigger('page_header_height_changed');
                    }
                    document.title = _('最近') + ' - '+_('微云');
                })
                .on('deactivate', function () {
                    this._$body.hide();
                });
            this._render_ie6_fix();
        },
        get_$body: function () {
            return this._$body || (this._$body = $(tmpl['body_' + uiv]()));
        },
        get_recent_table: function () {
            return this._$recent_table || (this._$recent_table = $('#recent_table'));
        },
        //ie6 鼠标hover效果
        _render_ie6_fix: function () {
            if ($.browser.msie && $.browser.version < 7){
                var me = this,
                    hover_cls = constants.UI_VER === 'WEB' ? 'hover' : 'list-hover';
                me.get_recent_table()
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
//recent/src/recent.APPBOX.tmpl.html
//recent/src/recent.WEB.tmpl.html
//recent/src/recent.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'body_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_box">\r\n\
        <div class="box_mod_datalist">\r\n\
            <div id="recent_table" class="disk-view ui-view ui-listview"></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'bar_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <h3 class="disk-title">');
_p(( data.time==='T'?'今天':data.time==='Y'?'昨天':'更早' ));
__p.push('</h3>');

return __p.join("");
},

'body_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="main-box">\r\n\
        <div id="recent_table" class="ui-view ui-listview recent-view"><div data-id="file_list_container"></div></div>\r\n\
    </div>');

return __p.join("");
},

'bar_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var _ = require('i18n'); __p.push('    <h3 class="ui-title">');
_p(( data.time==='T'?_('今天'):data.time==='Y'?_('昨天'):_('更早') ));
__p.push('</h3>');

return __p.join("");
},

'empty_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var _ = require('i18n'); __p.push('    <div class="sl-empty recent-empty">\r\n\
        <span class="icon-empty" id="empty_txt">');
_p(_('暂无文件'));
__p.push('<s></s></span>\r\n\
    </div>');

return __p.join("");
},

'row': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        _ = require('i18n'),

        $ = require('$'),

        date_time = lib.get('./date_time'),
        common = require('common'),
        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),

        files        = data.files,
        only_content = data.only_content === true,
        tType        = data.time,

        // 默认图片
        default_image = constants.RESOURCE_BASE + '/img/img-32.png',
        fixNum = function(num){
            var n = num - 0;
            if((n+'').length == 1){
                return '0'+n;
            }
            return n;
        },
        getTimeFormat = function(time){
            var time  = date_time.parse_str(time);
            if(tType === 'T'){
                return _('今天')+' '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else if(tType === 'Y'){
                return _('昨天')+' '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else {
                return time.getFullYear() + '-' + ( time.getMonth() + 1) + '-' + time.getDate() + ' ' + fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            }
        };

    if (constants.UI_VER === 'APPBOX') {
        $.each(files, function (i, file) {
            var is_image = file.is_image(); __p.push('            <div id="_disk_file_item_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('"');
_p(click_tj.make_tj_str('RECENT_CLICK_ITEM'));
__p.push(' \'data-whole-click\' data-list="file" class="list list-nocheckbox clear">\r\n\
                <label class="checkbox"></label>\r\n\
                <span class="img">');
if (is_image) {__p.push('                    <!-- 缩略图 -->\r\n\
                    <img data-action="enter" data-init="0" src="');
_p(default_image);
__p.push('" unselectable="on"/>');
} else {__p.push('                    <!-- 图标 -->\r\n\
                    <i data-action="enter" class="filetype ');
_p( file.get_icon() || ('icon-' + (file.get_type() || 'file')) );
__p.push('"></i>');
}__p.push('                </span>\r\n\
                <span class="name ellipsis" data-action="enter" data-name="file_name" title="');
_p(text.text(file.get_name()));
__p.push('">\r\n\
                    <p class="text"><em> ');
_p(text.text(file.get_name()));
__p.push('</em></p>\r\n\
                </span>\r\n\
                <span class="tool">\r\n\
                    <a class="link-download" data-function="download" hidefocus="on" data-tj-action="btn-adtag-tj" data-tj-value="57001" title="');
_p(_('下载'));
__p.push('" href="#"><i class="ico-download"></i></a>\r\n\
                </span>\r\n\
                <span class="size">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                <span class="time">');
_p(getTimeFormat( file.get_modify_time() || file.get_create_time() ));
__p.push('</span>\r\n\
            </div>');
});
    } else {
        __p.push('<div class="files">');

            $.each(files, function (i, file) {
                var is_image = file.is_image(); __p.push('                <div id="_disk_file_item_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('"');
_p(click_tj.make_tj_str('RECENT_CLICK_ITEM'));
__p.push(' \'data-whole-click\' class="ui-item ui-whole-click">\r\n\
                    <span class="filemain">\r\n\
                        <label class="filecheck"></label>\r\n\
                        <!-- code by fixed ie6 bug -->\r\n\
                        <span class="fileie6">\r\n\
                            <span class="fileimg">');
if (is_image) {__p.push('                                    <!-- 缩略图 -->\r\n\
                                    <img data-action="enter" class="default" data-init="0" src="');
_p(default_image);
__p.push('" unselectable="on"/>');
} else {__p.push('                                    <!-- 图标 -->\r\n\
                                    <i data-action="enter" class="filetype ');
_p( file.get_icon() || ('icon-' + (file.get_type() || 'file')) );
__p.push('"></i>');
}__p.push('                            </span>\r\n\
                            <!-- 文件名 -->\r\n\
                            <span data-action="enter" data-name="file_name" class="filename" title="');
_p(text.text(file.get_name()));
__p.push('">');
_p(text.text(file.get_name()));
__p.push('                            </span>\r\n\
                        </span>\r\n\
                        <!-- 文件功能菜单 -->\r\n\
                        <span class="filemenu">\r\n\
                            <a class="icon-download" data-function="download" title="');
_p(_('下载'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('RECENT_DOWNLOAD_BTN'));
__p.push('></a>\r\n\
                        </span>\r\n\
                    </span>\r\n\
                    <span class="filetime">');
_p(getTimeFormat( file.get_modify_time() || file.get_create_time() ));
__p.push('</span>\r\n\
                    <span class="filesize">');
_p(file.get_readability_size());
__p.push('</span>\r\n\
                </div>');

            });
        __p.push('</div>');

    }
    __p.push('');

return __p.join("");
},

'tail_load': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj'), _ = require('i18n');__p.push('    <a href="javascript:void(0)" class="load-more"><i class="icon-loading"></i>');
_p(_('正在加载'));
__p.push('</a>');

return __p.join("");
},

'tail_loaded': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
var click_tj = require('common').get('./configs.click_tj'), _ = require('i18n');__p.push('    <a href="javascript:void(0)" class="load-more" style="cursor: default;">');
_p(_('加载完成'));
__p.push('</a>');

return __p.join("");
}
};
return tmpl;
});
