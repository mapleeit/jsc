//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/note/note.r160510",["lib","common","$"],function(require,exports,module){

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
//note/src/ListView.js
//note/src/Record.js
//note/src/mgr.js
//note/src/note.js
//note/src/note_preview.js
//note/src/selection.js
//note/src/store.js
//note/src/ui.js
//note/src/note.tmpl.html

//js file list:
//note/src/ListView.js
//note/src/Record.js
//note/src/mgr.js
//note/src/note.js
//note/src/note_preview.js
//note/src/selection.js
//note/src/store.js
//note/src/ui.js
/**
 * ListView列表类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./ListView",["lib","common","$","./selection","./note_preview","./store","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        widgets = common.get('./ui.widgets'),
        selection = require('./selection'),
        note_preview = require('./note_preview'),
        router = lib.get('./router'),
        //image_lazy_loader = require('./image_lazy_loader'),
        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'note.list_view';
        this._select_mode = false; //选择模式
        if(this.auto_render) {
            this.render();
        }
    }

    ListView.prototype = {

        render: function() {
            if(this._rendered) {
                return;
            }
            router.init('root');
            this.on_refresh(store.get_all_records());
            this.on_render();
            this.bind_events();
            this._rendered = true;
        },

        /**
         * 监听store变化，更新视图
         */
        bind_events: function() {
            var store = this.store,
                me = this;
            //store events
            this.listenTo(store, 'before_refresh', function() {
                me.$ct.empty();
                me.$toolbar.hide();
                widgets.reminder.loading('加载中...');
                //widgets.reminder.loading('加载中...');
                $('#_load_more').hide();
            }).listenTo(store, 'before_load', function() {
                this.$toolbar.hide();
                $('#_load_more').show();
            }).listenTo(store, 'refresh_done', function(files) {
                console.log('ListView: store is refresh_done.');
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                me.on_load_fail(msg, is_refresh);
            }).listenTo(store, 'restore', function() {
                me.change_select_mode();
            });


            this.listenTo(router, 'change', function(to, from) {
                if(to === 'root'){
                    note_preview.destroy();
                    me.scroll_to_before(from);
                }
            });
        },

        scroll_to_before: function(from) {
            //alert(from + ':' + $('#item_' + from).offset().top);
            var _top = $('#item_' + from).offset().top;
            $('html, body').animate({scrollTop: _top}, 1000);

        },

        on_render: function() {
            var me = this;
            var is_move = false;
            this.$ct.on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            //监听UI事件，然后让mgr处理
            this.$ct.on('touchend', '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $item = $(e.target).closest('[data-id=item]'),
                    action_name = $item.attr('data-action'),
                    file_id = $item.attr('data-file-id'),
                    file = me.store.get_file(file_id);

                if(me._select_mode) {
                    $item.toggleClass('checked');
                    selection.toggle_select(file);
                    me._$confirm_btn.toggleClass('btn-disable', !selection.get_selected().length);
                    if(selection.get_selected().length) {
                        me._$choose_num.text('(' + selection.get_selected().length + ')');
                    } else {
                        me._$choose_num.text('');
                    }
                } else {
                    me.trigger('action', action_name, file, e);
                }
            });

            this._$confirms = this.$toolbar.find('[data-id=confirm]');
            this._$normal = this.$toolbar.find('[data-id=normal]');
            this._$confirm_btn = this.$toolbar.find('[data-action=confirm]');
            this._$choose_num = this.$toolbar.find('[data-id=choose_num]');
            this.$toolbar.on('touchend', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(selection.is_empty() && action_name === 'confirm') {
                    return;
                }
                if(action_name === 'share') {
                    me.change_select_mode();
                } else {
                    if(action_name === 'confirm') {
                        me.trigger('action', 'share');//完成分享后，再进行change_select_mode
                    } else {
                        me.change_select_mode();
                    }
                }
            });

        },

        change_select_mode: function() {
            this._select_mode = !this._select_mode;
            this.$ct.find('ul').toggleClass('active');

            var me = this,
                selected_files;
            if(!this._select_mode) {
                selected_files = selection.get_selected();
                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).removeClass('checked');
                });
                selection.clear();
                me._$normal.show();
                me._$confirms.hide();

            } else {
                me._$normal.hide();
                me._$confirm_btn.addClass('btn-disable').show();
                me._$choose_num.text('');
                me._$confirms.show();
            }
        },

        on_refresh: function(notes, is_async) {
            if(notes.length) {
                if(!is_async) {
                    var html = tmpl.note_list({
                        list: notes
                    });
                    this.$ct.empty().append(html);
                    //wx_jsapi.is_ok() && this.$toolbar.show();
                    this.last_group_day = notes[notes.length - 1][0].get_offset_day();
                    this.$toolbar.show();
                }
                $('#_load_more').hide();
                $('#_note_view_list').show();
            } else {
                this.$toolbar.hide();
                this.empty();
            }
        },

        on_add: function(items) {
            if(this.last_group_day && items[0][0].get_offset_day() === this.last_group_day) {
                var html = tmpl.note_item({
                    list: items[0]
                });
                var group = this.$ct.find('ul'),
                    last_note_list = $(group[group.length-1]).children();
                $(last_note_list[last_note_list.length - 1]).addClass('bBor');
                $(group[group.length-1]).append(html);
                items.shift();
            }
            if(items.length) {
                var html = tmpl.note_list({
                    list: items
                });
                this.$ct.append(html);
                this.last_group_day = items[items.length - 1][0].get_offset_day();
            }
            this.$toolbar.show();
        },

        on_load_fail: function(msg, is_refresh) {
            var me = this;
            if(is_refresh) {
                this.$ct.empty().append(tmpl.fail({
                    msg: msg
                }));

                $('#_fail').on('touchend', function(e) {
                    me.trigger('action', 'refresh');
                });
            }
        },

        empty: function() {
            this.$ct.empty().append(tmpl.empty());
        },

        get_$item_by_id: function(file_id) {
            return $('#item_' + file_id);
        },

        get_$ct: function() {
            return this._$ct;
        }

    };

    $.extend(ListView.prototype, events);

    return ListView;
});/**
 * 仿ExtJs中的Ext.data.Record，以便数据与视图的分离
 * @author cluezhang
 * @date 2013-8-13
 */
define.pack("./Record",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        events = lib.get('./events'),

        undefined;

    var id_seed = 0;
    var Record = function(data, id){
        this.data = data || {};
        // 生成唯一ID
        this.id = id || 'wy-record-'+(++id_seed);
    };
    Record.prototype = {
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * Record.set('a', 1);
         * Record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.data,
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.data;
            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 获取属性值
         * @param {String} name
         * @return {Mixed} value
         */
        get : function(name){
            return this.data[name];
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){
            if (this.store && typeof this.store.update === "function") {
                this.store.update(this, olds);
            }
        },

        get_id: function () {
            return (this.get('note_basic_info') && this.get('note_basic_info').note_id ) || "";
        },

        get_name: function () {
            return this.get('note_basic_info').note_title;
        },

        get_mtime: function() {
            return this.get('note_basic_info').note_mtime;
        },

        get_notetype: function () {
            return this.get('note_basic_info').note_type;
        },
        get_htmlcontent: function () {
            return this.get('item_htmltext').note_html_content;
        },

        get_version: function () {
            return this.get('note_basic_info').diff_version;
        },

        get_offset_day: function() {
            return this.get('note_basic_info').offset_day;
        },

        set_offset_day: function(offset_day) {
            this.get('note_basic_info').offset_day = offset_day;
        },

        set_id: function (note_id) {
            this.get('note_basic_info').note_id = note_id;
        },

        set_version: function (diff_version) {
            this.get('note_basic_info').diff_version = diff_version;
        },

        set_htmlcontent: function (content) {
            this.get('item_htmltext').note_html_content = content;
        },

        set_name: function (title) {
            var olds = {};
            olds['name'] = this.get('note_basic_info').note_title;
            this.get('note_basic_info').note_title = title;
        },

        is_note: function () {
            return true;
        },
        //兼容分享文件
        is_dir: function () {
            return false;
        },
        get_pid: function () {
            return "";
        },

        get_loaded: function () {
            return this.get('item_htmltext') != null;
        },

        get_articleurl: function () {
            return this.get('item_article') && this.get('item_article').note_artcile_url + "&trminal_type=30012&v=2";
        },

        get_article_comment: function () {
            //return this.get('item_article') && this.get('item_article').note_comment.note_html_content;
        },

        set_article_comment: function (comment) {
            //this.get('item_article').note_comment.note_html_content = comment;
        },

        get_note_raw_url: function () {
            //return this.get('item_article') && this.get('item_article').note_raw_url;
        },
        get_thumb_url: function () {
            return this.get('note_basic_info').thumb_url;
        },
        set_thumb_url: function (thumb_url) {
            //this.get('note_basic_info').thumb_url= https_tool.translate_cgi(thumb_url);
        },

        get_day_bar:function(){
            //return compute_day(this.get_version());
        },

        get_save_status:function(){
            return this.get('save_status') || "";
        },

        set_save_status:function(save_status,flag){
            this.set('save_status',save_status,flag);
        }
    };

    $.extend(Record.prototype, events);

    return Record;
});/**
 * 最近文件列表模块
 * @author hibincheng
 * @date 2015-08-19
 */
define.pack("./mgr",["lib","common","./store","./selection","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),
        app_api = common.get('./app_api'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
	    https_tool = common.get('./util.https_tool'),
        router = lib.get('./router'),
        store = require('./store'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        undefined;

    var mgr = new Mgr('note.mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            mgr.observe(cfg.ui);
        },

        on_enter: function(note) {
            this.do_open_note(note);
            router.go(note.get_id());
        },

        on_store: function() {

        },

        do_open_note: function(note) {
            var REQUEST_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/weiyun_note.fcg'),
                me = this;

            if (me._last_load_detail_req) {//有请求未完成，则要先清除
                me._last_load_detail_req.destroy();
            }
            me._last_load_detail_req =
                request.xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NoteDetail",
                    cavil: true,
                    pb_v2: true,
                    body: {
                        note_id: note.get_id()
                    }
                })
                .ok(function (msg, body) {
                        var note_content = body.item.item_htmltext && body.item.item_htmltext['note_html_content'],
                            note_artcile_url = body.item.item_article && body.item.item_article['note_artcile_url'];

                        me.ui.preview(note, {
                        note_summary: body.item.note_basic_info['note_summary'],
                        note_content: me.replace_img_url(note_content),
                        note_artcile_url: note_artcile_url
                    });
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);
                });
        },

        //使用https代理笔记图片
        replace_img_url: function(text) {
            if (text.indexOf('tx_tls_gate') === -1) {
                try {
                    text = text.replace(/<img.*?src=['"].*?['"].*?>/ig, function (img) {
                        return img.replace(/src=(['"])http:\/\/(.*?)['"]/i, 'src=$1https://h5.weiyun.com/tx_tls_gate=$2$1');
                    });
                } catch (e) {
                }
            }
            return text;
        },

        do_download: function(file) {

        },

        on_refresh: function() {
            store.refresh();
        },

        on_share: function() {
            if(this._request) {
                return;
            }
            this._request = true;
            var selected_files = selection.get_selected(),
                err = '',
                share_type = 11,
                note_list = [],
                dir_info_list = [];

            if(selected_files.length > 100) {
                err = '分享笔记不能超过100个';
            } else {
                $.each(selected_files, function(i, file) {
                    note_list.push(file.get_id());
                });
            }
            if(err) {
                widgets.reminder.error(err);
                return;
            }

            var one_file = selected_files[0],
                share_name = one_file.get_name() + (selected_files.length > 1 ? '等'+selected_files.length+'文件' : '');

            var me = this;
            request
                .xhr_post({
                    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                    cmd: 'WeiyunShareAdd',
                    body: {
                        note_list: note_list,
                        share_name: share_name,
                        share_type: share_type
                    },
                    cavil: true
                })
                .ok(function (msg, body) {
                    var icon_url = 'http://imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_note.png';
                    var url_object = new URL(body['raw_url']),
                        share_url = 'http://h5.weiyun.com/jump_share?fromid=100&share_key=' + url_object.pathname.replace("/", ""),
                        share_data = {
                            title: '我用微云分享',
                            desc: share_name,
                            image: icon_url,
                            url: share_url
                        }

                    //微信里分享到好友和朋友圈from参数会被吃掉，这里微信公众号直接用raw_url不用h5域名转发
                    if(browser.WEIXIN) {
                        share_data.url = body['raw_url'];
                    }
                    //app_api.setShare(_data);
                    me.set_share(share_data);

                    me._request = false;
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        set_share: function(share_data) {
            if(browser.QQ/* || browser.QZONE*/) {
                //app_api.init(function() {
                app_api.setShare(share_data);
                app_api.showShareMenu();

                //更改选择状态，是否要去掉需要跟产品确认
                store.share_restore();
                //});
            } else if(browser.WEIXIN) {
                //app_api.init(cfg, function() {
                app_api.setShare(share_data);
                this.ui.show_wx_tips();
                //});
            }
        },

        hide_wx_share_menu: function() {
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:share:QZone"
                ]
            });
            var share_tips = $('#_share_tip');
            share_tips && share_tips.remove();
        }
    });

    return mgr;
});/**
 * 笔记列表
 * @author hibincheng
 * @date 2015-08-25
 */
define.pack("./note",["lib","common","./store","./ui","./mgr"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),

        undefined;

    var note = new Module('note', {

        render: function(serv_rsp) {
            if(serv_rsp && serv_rsp.ret) {//出错了
                return;
            }

            store.init(serv_rsp);
            ui.render();
            mgr.init({
                ui: ui
            });

            var share_data = {
                title: '向您推荐微云',
                desc: '腾讯微云，安全备份共享文件和照片',
                image: 'http://qzonestyle.gtimg.cn/qz-proj/wy-h5/img/icon-logo-96.png',
                url: 'http://h5.weiyun.com/?fromid=101'
            }
            this.set_share(share_data);

            setTimeout(function() {
                seajs.use(['g-filetype-icons', 'g-share-mask',  'zepto_fx']);
            },1);

            //this.report_speed();
        },

        set_share: function(share_data) {
            var cfg = {
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'previewImage'
                ],
                hideMenuItems: ['menuItem:refresh','menuItem:copyUrl','menuItem:setFont','menuItem:setFont', 'menuItem:readMode', 'menuItem:exposeArticle', 'menuItem:favorite'
                    ,'menuItem:openWithSafari', 'menuItem:openWithQQBrowser', 'menuItem:share:email', 'menuItem:share:brand','menuItem:share:QZone']
            }
            if(browser.QQ/* || browser.QZONE*/) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                });
            } else if(browser.WEIXIN) {
                app_api.init(cfg, function() {
                    app_api.setShare(share_data);
                });
            }
        },

        report_speed: function() {
            //var render_time = +new Date();
            ////延时以便获取performance数据
            //setTimeout(function() {
            //    huatuo_speed.store_point('1598-1-1', 28, g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 29, g_css_time - g_start_time);
            //    huatuo_speed.store_point('1598-1-1', 30, (g_end_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 31, g_js_time - g_end_time);
            //    huatuo_speed.store_point('1598-1-1', 24, (render_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.report('1598-1-1', true);
            //}, 1000);
        }
    });

    return note;
});/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define.pack("./note_preview",["lib","common","$","./tmpl"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        app_api = common.get('./app_api'),
        tmpl    = require('./tmpl'),

        undefined;

    var default_app_cfg = {
        android: {
            published: true,
            packageName:"com.qq.qcloud",
            packageUrl: "weiyunweb://android",
            scheme: "weiyunweb",
            url: "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
        },
        ios: {
            published: true,
            packageName: "com.tencent.weiyun",
            packageUrl: "weiyun://ios",
            scheme: 'weisssss',//"weiyunaction",
            url: "//www.weiyun.com"
        }
    };

    var note_preview = new Module('note.note_preview', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }
            if(extra.note_artcile_url) {
                location.href = extra.note_artcile_url;
                return;
            }

            var $container = $('#_note_body');
            //把列表页隐藏
            $('#_note_view_list').hide();

            this.$ct = $(tmpl.preview_note({
                title: note.get_name(),
                time: note.get_mtime(),
                content: extra.note_content
            })).appendTo($container);

            $('#_load_more').hide();
            $('#wx_note_detail').show();
            this.bind_events(note);

            this._rendered = true;
        },

        //内嵌iframe的方式有问题，无法展示图片视频和富文本，这里gyv的意见是改为新开标签页去预览
        render_article: function(artcile_url) {
            var $article_iframe = $('#_note_article_frame'),
                $container = $('#wx_note_detail'),
                width = $(window).width(),
                height = $(window).height();
            $article_iframe.attr('src', artcile_url).css({
                width: width,
                height: height
            });
            $container.css('padding','0px');
        },

        bind_events: function(note) {
            var me = this;

            this.$ct.on('touchend', '[data-action=edit]', function(e) {
                if(browser.IS_IOS_9) {
                    me.ios9_launch_app();
                    return;
                }
                me.launch_app();
            });
        },

        ios9_launch_app: function() {
            var $toolbar = $('#wx_note_confirm'),
                me = this;

            window.location.href = 'weiyunaction://ios';

            setTimeout(function () {
                me.show_tips();
                setTimeout(function () {
                    $toolbar.hide();
                }, 1800);
            }, 300);
        },

        launch_app: function() {
            var me = this;
            app_api.isAppInstalled(default_app_cfg, function(is_install_app) {
                if(is_install_app){
                    var schema = browser.IOS? 'weiyunaction' : 'weiyunweb';
                    window.location.href = schema + '://test';
                } else{
                    me.show_tips();
                }
            });
        },

        show_tips: function() {
            var download_url = browser.IPAD? 'https://itunes.apple.com/cn/app/teng-xun-wei-yunhd/id608263551?l=cn&mt=8' : default_app_cfg.android['url'],
                $toolbar = $('#wx_note_confirm');
            //未安装app的弹出提示
            $toolbar.show();
            $toolbar.find('[data-action="cancel"]').on('click', function() {
                $toolbar.hide();
            });
            $toolbar.find('[data-action="install"]').on('click', function() {
                //未安装app的跳至微云官网页面下载app
                window.location.href = download_url;
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
            $('#_note_view_list').css('display', '');
        }
    });

    return note_preview;

});/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./selection",["lib","./store"],function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        store = require('./store'),
        undefined;

    var cache = [],
        cache_map = {};

    var selection = new Module('note.selection', {

        select: function(file) {
            cache_map[file.get_id()] = file;
            cache.push(file);
        },

        unselect: function(file) {
            cache_map[file.get_id()] = undefined;
            $.each(cache, function(i, item) {
                if(item.get_id() === file.get_id()) {
                    cache.splice(i, 1);
                }
            })
        },

        toggle_select: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }

            if(cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = []
            cache_map = {};
        },

        get_selected: function() {
            return cache;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    });

    return selection;
});/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$","./Record"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        Record = require('./Record'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),

        note_map = {},
        undefined;

    var store = new Module('note.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }

            if(data) {
                this.records = this.format2nodes(data.notelist);
                this.trigger('refresh_done',  this.records, store);
            }

            this._finish_flag = data.notelist.length < 20? true : false;
            this._total_count = this._finish_flag? data.notelist.length : 20;
            this._inited = true;
        },

        refresh: function() {
            this._load_done = false;
            this.load_more(true);
        },

        share_restore: function() {
            this.trigger('restore');
        },

        load_more: function(is_refresh) {
            if(this._requesting || this._finish_flag || !is_refresh && this.is_load_done()) {
                return;
            }
            this._requesting = true;

            var offset = this._total_count,
                me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/weiyun_note.fcg'),
                cmd: 'NotePageListGet',
                body: {
                    count: 20,
                    offset: offset,
                    order_type: 0
                }
            }).ok(function(msg, body) {
                var add_items = me.format2nodes(body.items);
                me._finish_flag = body.finish_flag;
                me._total_count += me._finish_flag? body.total_count : 20;
                me.concat_records(add_items);
                me.trigger('load_done',  add_items, store);
            }).fail(function(msg, ret) {
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        concat_records: function(recordList) {
            var me = this;
            $.each(recordList, function (i, items) {
                var offset_day = me.records[me.records.length - 1][0].get_offset_day(),
                    new_offset_day = items[0].get_offset_day();
                if(offset_day === new_offset_day){
                    me.records[me.records.length - 1].concat(items)
                } else {
                    me.records.push(items);
                }
            });
        },

        format2nodes: function(items) {

            if (!$.isArray(items)) {
                console.log('Loader.js->generateRecords: cgi返回的数据格式不对');
                return;
            }
            var zero_time = this.get_zero_time(),
                recordList = [],
                tmp = -1,
                me = this,
                records = [];
            $.each(items, function (i, item) {
                var record = new Record(item),
                    offset_day = me.get_date(zero_time, item['note_basic_info'].note_mtime);
                record.set_offset_day(me.get_group_time(offset_day));
                note_map[record.get_id()] = record;

                if(tmp < 0) {
                    tmp = offset_day;
                    records.push(record);
                } else if(me.get_group_time(tmp) === me.get_group_time(offset_day)) {
                    records.push(record);
                } else {
                    recordList.push(records);
                    records = [];
                    records.push(record);
                    tmp = offset_day;
                }
            });
            recordList.push(records);

            return recordList;
        },

        get_group_time: function(offset_day) {
            if(offset_day >= 7) {
                return 3;
            } else if(offset_day < 7 && offset_day > 1) {
                return 2;
            } else if(offset_day === 1) {
                return 1;
            }
            return 0;
        },

        get_date: function(zero_time, time) {
            if(zero_time <= time) return 0;
            return Math.floor((zero_time - time) / (1000 * 60 * 60 * 24)) + 1;
        },

        get_zero_time: function() {
            var now_time = new Date().getTime(),
                per_hour_time = 1000 * 60 * 60,
                offset_day = Math.floor(now_time / (per_hour_time *24));
            return offset_day * per_hour_time * 24 - per_hour_time * 8;
        },

        get_all_records: function() {
            return this.records;
        },

        get_file: function(file_id) {
            return note_map[file_id];
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_finish_flag: function() {
            return !!this._finish_flag;
        },

        is_requesting: function() {
            return !!this._requesting;
        }
    });

    return store;
});/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./ui",["lib","common","./store","./ListView","./note_preview","./mgr","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        store = require('./store'),
        ListView = require('./ListView'),
        note_preview = require('./note_preview'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),
        app_api = common.get('./app_api'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    var ui = new Module('note.ui', {

        render: function() {
            if(this._rendered) {
                return;
            }

            this._$ct = $('#_container');

            this.list_view = new ListView({
                $ct:$('#_note_files'),
                $toolbar: $('#_toolbar'),
                store: store,
                auto_render: true
            });

            mgr.observe(this.list_view);
            $('#_toolbar').show();
            this._bind_events();
            //$('#_toolbar').hide();//先进行隐藏，当weixin jsapi就绪才显示

            this._rendered = true;
        },

        _bind_events: function() {
            var me = this;
            this.listenTo(app_api, 'init_success', function() {
                $('#_toolbar').show();
            }).listenTo(app_api, 'init_fail', function() {
                $('#_toolbar').hide();
            }).listenTo(app_api, 'share_success', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            }).listenTo(app_api, 'share_fail', function() {
                widgets.reminder.error('调用分享接口失败，重新分享分享');
                //logger.report('weixin_mp');
            }).listenTo(app_api, 'share_cancel', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            });

            setTimeout(function() {
                $(window).on('scroll', function(e) {
                    window.requestAnimationFrame(function() {
                        if(me.is_reach_bottom()) {
                            store.load_more();
                        }
                    });
                })
            }, 100);
        },

        is_reach_bottom: function() {
            if(window.pageYOffset + win_height > this._$ct.height() - 200) {
                return true;
            }

            return false;
        },


        show_wx_tips: function() {
            this.$tip = $(tmpl.share_tip()).appendTo(document.body);
            var me = this;

            this.$tip.on('touchend', function(e) {
                me.$tip.remove();
                me.$tip = null;
                //去掉遮罩的同时把勾选文件的状态去掉
                store.share_restore();
            });
        },

        preview: function(data, extra){
            note_preview.preview(data, extra);
        },

        render_fail: function() {
            $('#_fail').on('touchend', function(e) {
                location.reload();
            });
        },

        //jsapi签名失败，则不显示分享按钮了
        on_jsapi_success: function() {
            $('#_toolbar').hide();
        }
    });

    return ui;
});
//tmpl file list:
//note/src/note.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'note_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib');

    var text = lib.get('./text');
    var prettysize = lib.get('./prettysize');
    var dateformat  = lib.get('./dateformat');
    var list = data.list || [];
    __p.push('    ');

    list.forEach(function(records){
        var date_list = ['今天','昨天','最近7天','7天前'];
        var offset_day = records[0].get_offset_day();
        var date_str = offset_day < 3? date_list[offset_day] : date_list[3];
    __p.push('    <div class="wx-list-wrapper">\r\n\
        <time class="day">');
_p(date_str);
__p.push('</time>\r\n\
        <!-- 添加 .active 进入选择模式 -->\r\n\
        <ul class="">');

            var count = 0;
            records.forEach(function(file){
                var id = file.get_id();
                var file_name = text.text(file.get_name());
                var mtime = file.get_mtime();
                count++;
                var item_class = count < records.length? 'bBor' : '';
                var thumb_url = file.get_thumb_url();
                __p.push('                <!-- 添加 .checked，选中笔记 -->\r\n\
                <li id="item_');
_p(id);
__p.push('" class="note ');
_p(item_class);
__p.push('" data-id="item" data-action="enter" data-file-id="');
_p(id);
__p.push('">\r\n\
                    <i class="icon icon-select"></i>\r\n\
                    <div class="txt-wrapper">\r\n\
                        <h2 class="note-title">');
_p(file_name);
__p.push('</h2>\r\n\
                        <time class="note-time">');
_p(dateformat(mtime, 'mm/dd HH:MM'));
__p.push('</time>\r\n\
                    </div>');

                        if(thumb_url) {
                    __p.push('                    <p class="note-img" style="background-image: url(');
_p(thumb_url.replace(/^http:|^https:/, ''));
__p.push(');"></p>');

                        }
                    __p.push('                </li>');
 }); __p.push('        </ul>\r\n\
    </div>');
 }); __p.push('');

}
return __p.join("");
},

'note_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib = require('lib');

    var text = lib.get('./text');
    var prettysize = lib.get('./prettysize');
    var dateformat  = lib.get('./dateformat');
    var list = data.list || [];
    var count = 0;
    list.forEach(function(file){
    var id = file.get_id();
    var file_name = text.text(file.get_name());
    var mtime = file.get_mtime();
    count++;
    var item_class = count < list.length? 'bBor' : '';
    var thumb_url = file.get_thumb_url();
    __p.push('    <!-- 添加 .checked，选中笔记 -->\r\n\
    <li id="item_');
_p(id);
__p.push('" class="note ');
_p(item_class);
__p.push('" data-id="item" data-action="enter" data-file-id="');
_p(id);
__p.push('">\r\n\
        <i class="icon icon-select"></i>\r\n\
        <div class="txt-wrapper">\r\n\
            <h2 class="note-title">');
_p(file_name);
__p.push('</h2>\r\n\
            <time class="note-time">');
_p(dateformat(mtime, 'mm/dd HH:MM'));
__p.push('</time>\r\n\
        </div>');

        if(thumb_url) {
        __p.push('        <p class="note-img" style="background-image: url(');
_p(thumb_url);
__p.push(');"></p>');

        }
        __p.push('    </li>');
 }); __p.push('');

}
return __p.join("");
},

'preview_note': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var lib = require('lib');
        var text = lib.get('./text');
        var prettysize = lib.get('./prettysize');
        var dateformat  = lib.get('./dateformat');
        var title = data.title;
        var content = data.content;
        var mtime = data.time;
    __p.push('    <section id="wx_note_detail" class="wx-note-cont-wrapper" style="display:none;">');
 if(content) { __p.push('            <time class="day">');
_p(dateformat(mtime, 'yyyy-mm-dd HH:MM'));
__p.push('</time>\r\n\
            <article class="note-cont">\r\n\
                <div class="note-content"><b>');
_p(content);
__p.push('</b><br></div>\r\n\
            </article>\r\n\
\r\n\
            <!-- 去微云客户端编辑，没有安装的话，弹窗提示 -->\r\n\
            <div data-action="edit" class="wy-file-controller g-bottom-bar tBor">\r\n\
                <button class="btn" id="edit" role="button">编辑</button>\r\n\
            </div>');
 } else { __p.push('            <iframe frameborder="0" id="_note_article_frame" name="_note_article_frame" src="');
_p(data.artcile_url);
__p.push('"/>');
 } __p.push('    </section>\r\n\
\r\n\
    <section id="wx_note_confirm" class="confirm-box" style="display:none;">\r\n\
        <div class="ui-modal">\r\n\
            <div class="inner">\r\n\
                <div class="ui-modal-bd">\r\n\
                    <!-- S 带标题的modal -->\r\n\
                    <p class="tips cont">您还没安装“微云”客户端</p>\r\n\
                    <!-- E 带标题的modal -->\r\n\
                </div>\r\n\
                <div class="ui-modal-ft tBor">\r\n\
                    <button data-action="cancel" class="btn btn-cancel rBor">取消</button>\r\n\
                    <button data-action="install" class="btn btn-ok">安装</button>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="ui-mask"></div>\r\n\
    </section>');

}
return __p.join("");
},

'share_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_share_tip" class="share-dialog">\r\n\
        <span class="share-tips"></span>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
