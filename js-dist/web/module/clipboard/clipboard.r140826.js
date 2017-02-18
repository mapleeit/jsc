//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/clipboard/clipboard.r140826",["lib","common","$","clipboard_css","main"],function(require,exports,module){

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
//clipboard/src/clipboard.js
//clipboard/src/receive/Detail.js
//clipboard/src/receive/Loader.js
//clipboard/src/receive/Mgr.js
//clipboard/src/receive/Receive.js
//clipboard/src/receive/View.js
//clipboard/src/send/Editor.js
//clipboard/src/send/FootBar.js
//clipboard/src/send/Mgr.js
//clipboard/src/send/Send.js
//clipboard/src/tab/TabBar.js
//clipboard/src/tab/TabView.js
//clipboard/src/ui.js
//clipboard/src/clipboard.tmpl.html
//clipboard/src/receive/receive.tmpl.html
//clipboard/src/send/send.tmpl.html
//clipboard/src/tab/tabview.tmpl.html

//js file list:
//clipboard/src/clipboard.js
//clipboard/src/receive/Detail.js
//clipboard/src/receive/Loader.js
//clipboard/src/receive/Mgr.js
//clipboard/src/receive/Receive.js
//clipboard/src/receive/View.js
//clipboard/src/send/Editor.js
//clipboard/src/send/FootBar.js
//clipboard/src/send/Mgr.js
//clipboard/src/send/Send.js
//clipboard/src/tab/TabBar.js
//clipboard/src/tab/TabView.js
//clipboard/src/ui.js
/**
 * 剪贴板模块
 * 注： 各子模块的destroy方法未启用，后续要启用时要测试是否有错误
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./clipboard",["lib","common","$","clipboard_css","./ui"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),

        undefined;

    //css
    require('clipboard_css');

    var clipboard = new Module('clipboard', {

        ui: require('./ui')

    });

    return clipboard;
});/**
 * 剪贴板模块 接收tab 详细视图
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./receive.Detail",["lib","common","$","main","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        View = lib.get('./data.View'),
        console = lib.get('./console').namespace('clipboard'),
        text = lib.get('./text'),

        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        ie67 = $.browser.msie && $.browser.version < 8,
        url_reg = /(?:(?:http|https|ftp)\:\/\/|\bwww\.)(?:[a-z0-9\-]+\.)+[a-z]{2,4}(?:\:\d{2,})?([a-z\u00C0-\u017F0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~]*)?/gi, //增加对前缀为www.开始的url,因为一般用户输入时不会以http开头
        protocol_reg = /^(?:(?:http|https|ftp):\/\/)/i,

        undefined;

    var Detail = inherit(Event, {

        name: 'receive_detail',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            if(this._rendered) {
                return;
            }
            this._$ct = $(tmpl.receive_detail()).appendTo($render_to);
            this.render_tbar();
            this.init_copy();
            this._rendered = true;
        },

        sync_$container_size: function() {
            var $body_box = main_ui.get_$body_box(),
                height = $body_box.height(),
                width = $body_box.width(),
                $content = this.get_$content();

            $content.height(height - 24);
            $content.width(width - 12);
        },

        render_tbar: function() {
            var me = this;
            $bar_ct = main_ui.get_$bar1();
            this._$tbar = $(tmpl.toolbar()).appendTo($bar_ct).show();
            main_ui.sync_size();
            this._$tbar.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var action_name = $(this).attr('data-action');
                me.trigger('action', action_name, me.get_record(), e, {src: 'detailmenu'});
            });
        },

        /**
         * 初始化复制操作
         * @private
         */
        init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }
            //因contextmenu是在body中的，所以不能使用container_selector
            this.copy = new Copy({
                container_selector: '.clip-top-operate',
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var content = me.get_record().get('content');
                    return content;
                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功');
                    user_log('CLIPBOARD_RECEIVE_DETAIL_COPY_BTN');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                });
        },

        is_renderd: function() {
            return !!this._rendered;
        },

        /**
         * 修复用户产生的文本消息（HTML转义 + URL添加链接）
         * @param {String} str 需要处理的用户文本
         * @param {Number} [len] 截取长度（参考.smart_sub()方法），可选
         *
         */
        fix_user_text: function (str, len) {
            if (!str || !(typeof str === 'string')) return '';

            var me = this;

            // 首先要将文本和URL分离开，然后对文本进行HTML转义，对URL进行修复
            // 如“你好www.g.cn世界”，需要拆分为 "你好", "www.g.cn", "世界"
            var texts = [],
                is_urls = {}, // { 1: String, 3: String } 保存所有的URL以及URL在文本数组中出现的索引位置
                last_end = 0,
                i = 0;

            var match;
            while (match = url_reg.exec(str)) {
                var url = match[0],
                    start = match.index,
                    end = start + url.length,
                    left_text = str.substring(last_end, start);

                texts.push(left_text);  // 取URL左侧的文字
                texts.push(url);
                is_urls[texts.length - 1] = url;

                last_end = end;
                i++;
            }
            // 取URL右侧的文字
            if (texts.length && last_end < str.length - 1) {
                texts.push(str.substr(last_end));

	            // 先截断
	            if (len > 0) {
		            texts = me._smart_sub_arr(texts, len);
	            }


	            texts = $.map(texts, function (str, i) {
		            var url;
		            // 生成链接（如果URL被截断了，则不处理链接）
		            if (i in is_urls && str === (url = is_urls[i])) {
			            if (!protocol_reg.test(url)) {
				            url = 'http://' + url;
			            }
			            return '<a href="' + url + '" target="_blank">' + str + '</a>'; // 这里用text作为文本，是因为它有可能由"www.weiyun.com"被截断为"www.wei.."
		            }
		            else {
			            // 字符串HTML转义
			            return text.text(str);
		            }
	            });
            } else {
	            texts.push(str);
            }

            return texts.join('');
        },

        set_record: function(rd) {
            this._record = rd;
            var content = rd.get('content');
            content = this.fix_user_text(content);

            content = content.replace(/\r\n|\r|\n/g, '<br />');
            this.set_content(content);
        },

        get_record: function() {
            return this._record;
        },

        set_content: function(con) {
            var $content = this.get_$content();
            $content.html(con);
        },

        get_$content: function() {
            return this._$content || (this._$content = this._$ct.find('[data-id=content]'));
        },

        is_hide: function() {
            return !!this._is_hidden;
        },

        show: function() {
            this._$ct.show();
            this.show_tbar();
            this._is_hidden = false;
        },

        hide: function() {
            this._$ct.hide();
            this.hide_tbar();
            this._is_hidden = true;
        },

        show_tbar: function() {
            this._$tbar.show();
            main_ui.sync_size();

            if(ie67) {
                main_ui.get_$body_box().css({
                    'border-bottom-width': '1px',
                    'background-image': 'none'
                });
            }
        },

        hide_tbar: function() {
            this._$tbar.hide();
            main_ui.sync_size();

            if(ie67) {
                main_ui.get_$body_box().css({
                    'border-bottom-width': '',
                    'background-image': ''
                });
            }
        },

        destroy: function() {
            this._$ct.remove();
            this._$tbar.remove();
            this.$render_to = null;
            this._record = null;
        }
    });

    return Detail;
});/**
 * 剪贴板模块 接收tab 列表数据加载器
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./receive.Loader",["lib","common","$","main"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),
        Record = lib.get('./data.Record'),

        widgets = common.get('./ui.widgets'),
        clipboard_plugin = require('main').get('./clipboard_plugin'),

        max_clipboard_record_count = 5, //最多显示5条消息
        undefined;

    var Loader = inherit(Event, {

        auto_load: false,

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.store && this.auto_load) {
                this.start_load();
            }
        },

        /**
         * 开始加载剪贴板消息数据
         */
        start_load: function() {
            var me = this;

            if(clipboard_plugin.is_first_load_done()) {
                me.fill_store(clipboard_plugin.get_records());
            } else {
                widgets.loading.show();
                this.listenToOnce(clipboard_plugin, 'clipboard_load_done', function(records) {
                    widgets.loading.hide();
                    me.fill_store(records);
                });
            }

            this.listenTo(clipboard_plugin, 'clipboard_update', function(new_records) {
                this.insert_records(new_records);
            });

            this.listenTo(clipboard_plugin, 'clipboard_all_read', function() {
                this.set_records_read();
            });
        },

        /**
         * 插入新拉取的数据到store
         * @param items
         */
        insert_records: function(items) {
            var rs = [],
                me = this;

            $.each(items, function(i, item) {
                rs.push(me.create_record(item));
            });

            this.store.add(rs, 0); //插入到最前
            var size = this.store.size(),
                rm_records;
            if(size > max_clipboard_record_count) { //保持最多5条记录
                rm_records = this.store.slice(max_clipboard_record_count);
                this.store.batch_remove(rm_records);
            }

        },

        /**
         * 装载数据到store
         * @param items
         */
        fill_store: function(items) {
            var rs = [],
                me = this;

            $.each(items, function(i, item) {
                rs.push(me.create_record(item));
            });

            this.store.load(rs);
        },

        /**
         * 由原始数据组装成Record
         * @param {Array} item
         * @returns {Record}
         */
        create_record: function(item) {
            var rd = new Record({
                dev_id:     item.dev_id,
                msg_info:   item.msg_info,
                ctime:      item.ctime,
                content:    item['items'][0].content,
                unread:     item.unread     //该字段非cgi返回，是本地用于标识未读的
            });

            return rd;
        },

        set_records_read: function() {
            this.store.each(function(rd) {
                rd.set('unread', false, true);
            });
        }
    });

    return Loader;
});/**
 * 剪贴板模块 接收tab 管理器，列表及详细视图都由这mgr管理
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./receive.Mgr",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),
        store = lib.get('./store'),
        json = lib.get('./json'),

        global_event = common.get('./global.global_event'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),

        REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
        undefined;

    var Mgr = inherit(Event, {

        constructor: function(cfg) {
            $.extend(this, cfg);
            this._observe_mods_map = {};
        },
        /**
         * 观察者模式实现，监听模块的自定义事件
         * @param {Module} mod 模块
         */
        observe: function(mod) {
            if(this.has_observe_mod(mod)) {
                return;
            }
            this._observe_mods_map[mod.name] = mod;
            this.bind_action(mod);
        },

        has_observe_mod: function(mod) {
            if(!mod.name) {
                console.error('observe module must have name');
                return false;
            }
            return !!this._observe_mods_map[mod.name];
        },
        /**
         * 绑定自定义事件
         * @param mod
         */
        bind_action: function(mod) {
            this.listenTo(mod, 'action', function(action_name, data, event, extra) {
                this.dispatch_action(action_name, data, event, extra);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event, extra) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event, extra);
            }
            event.preventDefault();
        },

        /**
         * 返回到接收列表
         */
        on_back: function(record, event, extra) {
            this.get_list_view().show();
            this.get_detail_view().hide();
            global_event.trigger('enter_clipboard_list');
            if(extra && extra.src === 'detailmenu') {
                user_log('CLIPBOARD_RECEIVE_DETAIL_BACK_BTN');
            }
        },

        /**
         * 复制操作，ie非flash时走这里逻辑，其它用flash实现
         * @param record
         * @param event
         */
        on_copy: function(record, event, extra) {
            event.preventDefault();
            var view = this.get_list_view();
            view.copy.ie_copy(record.get('content'));
            if(extra) {
                switch(extra.src) {
                    case 'contextmenu':
                        user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_COPY');
                        break;
                    case 'detailmenu':
                        user_log('CLIPBOARD_RECEIVE_DETAIL_COPY_BTN');
                        break;
                }
            }
        },

        /**
         * 删除一条剪贴板内容
         * @param record
         * @param event
         */
        on_delete: function(record, event, extra) {
            var ctime = record.get('ctime'),
                me = this;

            widgets.confirm('删除', '您确定删除吗？', '', function() {
                request.xhr_post({
                    url: REQUEST_CGI,
                    cmd: 'ClipBoardDelete',
                    cavil: true,
                    pb_v2: true,
                    body: {
                        msg_ctime: ctime
                    }
                })
                    .ok(function(msg, body) {
                        mini_tip.ok('删除成功');
                        me.store.remove(record);
                        global_event.trigger('remove_clipboard_success', ctime);
                        if(me.is_detail_mode()) {
                            me.on_back();
                        }
                    })
                    .fail(function(msg, ret) {
                        mini_tip.error(msg || '删除失败');
                    });

                if(extra) {
                    switch(extra.src) {
                        case 'contextmenu':
                            user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_DELETE');
                            break;
                        case 'detailmenu':
                            user_log('CLIPBOARD_RECEIVE_DETAIL_DELETE_BTN');
                            break;
                    }
                }

            }, null, ['是', '否']);

        },

        /**
         * 根据模块名找到对应已监听的模块
         * @param name
         * @returns {*}
         */
        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },
        /**
         * 详情视图模式
         */
        is_detail_mode: function() {
            var detail_view = this.get_detail_view();
            return detail_view && !detail_view.is_hide();
        },

        /**
         * 详细视图
         * @returns {*}
         */
        get_detail_view: function() {
            return this.get_observe_mod_by_name('receive_detail');
        },
        /**
         * 列表视图
         * @returns {*}
         */
        get_list_view: function() {
            return this.get_observe_mod_by_name('receive_list');
        },

        destroy: function() {
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }

    });

    return Mgr;
});/**
 * 剪贴板模块 接收tab
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./receive.Receive",["lib","common","$","./receive.Loader","./receive.View","./receive.Mgr","./receive.Detail","main","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),

        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),

        Loader = require('./receive.Loader'),
        View = require('./receive.View'),
        Mgr = require('./receive.Mgr'),
        Detail = require('./receive.Detail'),
        clipboard_plugin = require('main').get('./clipboard_plugin'),

        tmpl = require('./tmpl'),

        undefined;

    var Receive = inherit(Event, {

        name: 'receive',

        title: '接收',

        render: function($render_to) {
            if(this._rendered) {
                return;
            }
            this._$ct = $(tmpl.receive()).appendTo($render_to);
            this.store = new Store();
            this.list_view = new View({
                name: 'receive_list',
                list_selector: '.clip-receive-list',
                item_selector: '[data-file-id]',
                store: this.store
            });

            this.list_view.render(this._$ct);
            this.listenTo(this.list_view, 'recordclick', this.on_show_detail, this);

            this.loader = new Loader({
                store: this.store,
                auto_load: true
            });

            //this.bind_loader_events(this.loader);
            //this.loader.load_data();

            this.mgr = new Mgr({
                store: this.store
            });
            this.mgr.observe(this.list_view);
            this.activate();
            this._rendered = true;
        },

        is_rendered: function() {
            return !!this._rendered;
        },

        /**
         * 监听加载器发出的事件
         * @param loader
         */
        /*bind_loader_events: function(loader) {
            this
                .listenTo(loader, 'before_load', function() {
                    widgets.loading.show();
                })
                .listenTo(loader, 'after_load', function() {
                    widgets.loading.hide();
                })
                .listenTo(loader, 'error', function(msg) {
                    mini_tip.error(msg);
                });
        },*/

        /**
         * 创建详细视图
         * @returns {Detail}
         */
        create_detail_view: function() {
            var detail_view = new Detail({
                $render_to: this.get_$ct()
            });
            this.mgr.observe(detail_view);
            this.detail_view = detail_view;
            return detail_view;
        },

        /**
         * 显示详细视图
         * @param record
         * @param event
         */
        on_show_detail: function(record, event) {
            var list_view = this.get_list_view(),
                detail_view = this.get_detail_view();

            event.preventDefault();
            if(!detail_view) {
                detail_view = this.create_detail_view();
            }

            list_view.hide();
            detail_view.set_record(record);
            detail_view.show();
            global_event.trigger('exit_clipboard_list');
            user_log('CLIPBOARD_RECEIVE_SHOW_DETAIL');
        },

        get_list_view: function() {
            return this.list_view;
        },

        get_detail_view: function() {
            return this.detail_view;
        },

        is_activated: function() {
            return !!this._is_activated;
        },

        /**
         * 是否是详细视图模式
         * @returns {boolean|*}
         */
        is_detail_mode: function() {
            return this.detail_view && !this.detail_view.is_hide();
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            //有未读消息，强制进入接收列表
            if(clipboard_plugin.get_unread_records_num() && this.is_detail_mode()) {
                this.get_list_view().show();
                this.get_detail_view().hide();
            }
            this.show();
            this._is_activated = true;
            if(!this.is_detail_mode()) {
                global_event.trigger('enter_clipboard_list');
                user_log('CLIPBOARD_RECEIVE_TAB');
            }
        },

        deactivate: function() {
            if(!this.is_activated()) {
                return;
            }
            this.hide();
            //this.mgr.abort_ajax();
            //this.loader.abort();
            this._is_activated = false;
            if(!this.is_detail_mode()) {
                global_event.trigger('exit_clipboard_list');
            }
        },

        show: function() {
            var detail_view = this.detail_view;
            this.get_$ct().show();
            if(detail_view && !detail_view.is_hide()) {
                detail_view.show_tbar();
            }
        },

        hide: function() {
            var detail_view = this.detail_view;
            this.get_$ct().hide();
            if(detail_view && !detail_view.is_hide()) {
                detail_view.hide_tbar();
            }
        },

        get_$ct: function() {
            return this._$ct;
        },

        destroy: function() {
            this.list_view.destroy();
            this.detail_view && this.detail_view.destroy();
            this.list_view = null;
            this.detail_view = null;
            this._$ct.remove();
            this._$ct = null;
        }
    });

    return Receive;
});/**
 * 剪贴板模块 接收tab 列表视图
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./receive.View",["lib","common","$","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        View = lib.get('./data.View'),
        console = lib.get('./console').namespace('clipboard'),
        ContextMenu = common.get('./ui.context_menu'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var View = inherit(View, {

        name: 'receive_list',

        enable_empty_ui: true,

        constructor: function() {
            View.superclass.constructor.apply(this, arguments);
            this.init_highlight();
        },

        list_tpl : function(){
            return tmpl.receive_list();
        },

        tpl : function(file){
            return tmpl.receive_list_item([file]);
        },

        get_html : function(files){
            return tmpl.receive_list_item(files);
        },

        render: function($render_to) {
            this._$ct = $(tmpl.receive_view()).appendTo($render_to);
            View.superclass.render.call(this, this._$ct.find('[data-id=list_wrap]'));
        },

        after_render : function(){
            View.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            this.render_ie6_fix();

            this.init_copy();

            this
                .listenTo(global_event, 'enter_clipboard_list', function() {
                    //初始化复制工具
                    if (!this.copy) {
                        this.init_copy();
                    }
                })
                .listenTo(global_event, 'exit_clipboard_list', function() {
                    //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
                    this.copy && this.copy.destroy();
                    this.copy = null;
                });

        },

        show_empty_ui: function() {
            //this._$ct.addClass('clip-empty');
            if(!this._$empty) {
                this._$empty = $(tmpl.view_empty()).appendTo(this._$ct);
            }
            this._$empty.show();
        },

        hide_empty_ui: function() {
            this._$empty && this._$empty.hide();
        },

        // ie6 鼠标hover效果
        render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list
                    .on('mouseenter', me.item_selector, function () {
                        $(this).addClass(hover_class);
                    }).on('mouseleave', me.item_selector, function () {
                            $(this).removeClass(hover_class);
                    });
            }
        },

        /**
         * 初始化复制操作
         * @private
         */
        init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }
            //因contextmenu是在body中的，所以不能使用container_selector
            this.copy = new Copy({
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var $target = me.copy.get_$cur_target(),
                        $list_item,
                        record,
                        record_id = $target.attr('record-id'),
                        content;

                    if (record_id) {//菜单上的“复制”按钮
                        record = me.store.get(record_id);
                    } else {
                        $list_item = $target.closest(me.item_selector);
                        record = me.get_record($list_item);
                    }

                    content = record.get('content');
                    user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_COPY');
                    return content;

                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                });
        },

        init_highlight: function() {
            var me = this;
            this.listenTo(global_event, 'enter_clipboard_list', function() {
                if(me.rendered) { //已渲染列表
                    me.highlight_unread_item();
                } else {
                    me.on('afterrender', function() {
                        me.highlight_unread_item();
                    });
                }
            });
        },

        /**
         * 高亮未读的消息
         */
        highlight_unread_item: function() {
            var me = this,
                highlight_item = [];
            this.store.each(function(rd) {
                if(rd.get('unread')) {
                    me.get_dom(rd).addClass('ui-selected');
                    highlight_item.push(rd);
                }
            });

            setTimeout(function() {
               $.each(highlight_item, function(i, rd) {
                    me.get_dom(rd).removeClass('ui-selected');
                    rd.set('unread', false, true);
                });
            }, 5000);
        },
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_ctx_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var menu = this.get_context_menu();


            menu.show(e.pageX, e.pageY);
            if (Copy.can_copy()) {
                menu.$el.find('[data-item-id="copy"] a')
                    .attr('data-clipboard-target', true)
                    .attr('record-id', record.id);
            }

            var me = this;
            me.is_menu_on = true;
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.is_menu_on = false;
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_record, e, {src:'contextmenu'});
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });

                menu.on('show_on', function() {
                    var $target_dom = me.get_dom(me.context_record);
                    $target_dom && $target_dom.addClass('list-hover');
                });
                menu.on('hide', function() {
                    var $target_dom = me.get_dom(me.context_record);
                    $target_dom && $target_dom.removeClass('list-hover');
                })
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            var cfg = [
                {
                    id: 'delete',
                    text: '删除',
                    icon_class: 'ico-null'
                }
            ];

            if(Copy.can_copy()) {
                cfg.unshift({
                    id: 'copy',
                    text: '复制',
                    icon_class: 'ico-null'
                });
            }



            return cfg;
        },

        show: function() {
            this._$ct.show();
        },

        hide: function() {
            this._$ct.hide();
        },

        destroy: function() {
            View.superclass.destroy.apply(this, arguments);
            this._$ct.remove();
            this.context_menu = null;
        }
    });

    return View;
});/**
 * 剪贴板模块 发送tab 富文本编辑器
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./send.Editor",["lib","common","$","main","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),

        scr_reader_mode = common.get('./scr_reader_mode'),
        global_event = common.get('./global.global_event'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        has_content = false, //editor中是否有内容
        ie67 = $.browser.msie && $.browser.version < 8,
        window_resize_event = 'window_resize_real_time',
        undefined;

    var Editor = inherit(Event, {

        name: 'editor',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this._$ct = $ct;

            this.render_editor();
            this.activate();
            this._rendered = true;

        },

        /**
         * 渲染编辑器，采用textarea，不能使用富文本，不然其它端会显示出html标签
         */
        render_editor: function() {
            var $textarea = $('<textarea class="editor" placeholder="输入或粘贴一段内容，可以发送到自己的手机上（需要安装手机版微云）。" style=""></textarea>');
            var me = this;

            if(!scr_reader_mode.is_enable()) {
                $textarea.css('outline', 'none');
            }
            //simulate placeholder
            if($.browser.msie) {
                $textarea.val($textarea.attr('placeholder')).css('color', '#7d838f');
                $textarea.
                    on('focus', function(e) {
                        $textarea.css('color', '');
                        if($.trim($textarea.val()) === $textarea.attr('placeholder')) {
                            $textarea.val('');
                            me.trigger('action', 'empty', true);
                        }
                    })
                    .on('blur', function(e) {
                         if($.trim($textarea.val()) === '') {
                             $textarea.val($textarea.attr('placeholder')).css('color', '#7d838f');
                             me.trigger('action', 'empty', true);
                             has_content = false;
                         } else {
                             me.trigger('action', 'empty', false);
                         }
                    });
            } else {
                $textarea
                    .on('blur', function(e) {
                        if(me.get_content()) {
                            me.trigger('action', 'empty', false);
                        } else {
                            me.trigger('action', 'empty', true);
                            has_content = false;
                        }
                    });
            }

            $textarea.on('keyup', function(e) {
                if(!me.get_content()) {
                    me.trigger('action', 'empty', true);
                    has_content = false;
                } else if(!has_content) {//键入第一个字符后
                    me.trigger('action', 'empty', false);
                    has_content = true;
                }
            })
                .on('paste', function(e) {
                    me.paste_detect_empty();
                });

            this._$editor = $textarea.appendTo(this._$ct);

        },

        /**
         * 粘贴时对内容是否为空进行检测，从而是否开启发送按钮
         */
        paste_detect_empty: function() {
            var me = this;
            setTimeout(function() { //异步去检测，以便内容已经粘贴了
                if(me.get_content()) {
                    me.trigger('action', 'empty', false);
                }
            },0);
        },

        /**
         * 同步编辑器大小以撑满内容区
         */
        sync_editor_size: function() {
            var me = this,
                $editor = me.get_$editor();
            var height = $(window).height() - main_ui.get_$bar1().outerHeight() - main_ui.get_fixed_header_height();
            $editor.height(height - 100); //等给下方工具栏高度
            if(ie67) {
                $('#_clipboard_body').repaint();
            }
        },

        //不采用富文本实现，因客户端无法接收
       /* render_editor: function() {
            var $ifr = $('<iframe id="_iframe_editor" frameBorder=0 style="width:100%;height:100%;"></iframe>'),
                ie = $.browser.msie,
                me = this;


            $ifr.on('load', function() {
                var editor_doc,
                    ifr = $ifr[0],
                    default_style = '*{padding:0;margin:0;} body{padding:10px 0 0 5px;}'
                    default_tip = '<p id="'+editor_tip_id+'" style="color: #bababa;">输入或粘贴一段内容，可以发送到自己的手机上（需要安装手机版微云）。</p>';

                $ifr.off('load');

                editor_doc = ifr.contentDocument || ifr.contentWindow.document;
                editor_doc.open();
                editor_doc.write('<!DOCTYPE html><html><head><style>' + default_style + '</style>' +
                    '</head><body>' + default_tip + '</body></html>');
                editor_doc.close();
                if(ie) {
                    editor_doc.body.disabled = true;
                    editor_doc.body.contentEditable = true;
                    editor_doc.body.removeAttribute('disabled');
                } else {
                    editor_doc.designMode = 'on';
                }

                me._$editor_doc = $(editor_doc);
                me._editor_win = ifr.contentWindow;
                $(editor_doc.body)
                    .on('focus', function(e) {
                        console.log('enter body');
                        e.preventDefault();
                        if($('#'+editor_tip_id, editor_doc).length) {
                            $(editor_doc.body).empty();
                        } else {
                           // $('<input>').appendTo(editor_doc.body).focus().remove();
                        }
                    })
                    .on('blur', function(e) {
                        console.log('back body');
                        e.preventDefault();
                        var con = $(editor_doc.body).html();
                        if(!$.trim(con)) {
                            $(editor_doc.body).html(default_tip);
                            me.trigger('action', 'empty', true);
                        } else {
                            me.trigger('action', 'empty', false);
                        }
                    });
            });

            if(ie) {
                $ifr.attr('src', 'javascript:void(function(){document.open();document.domain = "'+document.domain+'";document.close();}());');
            }

            //同步iframe高度使之撑满内容区
            var height = main_ui.get_$main_content().height();
            $ifr.height(height - 6);
            this.listenTo(main_ui, 'area_resize', function() {
                $ifr.height(main_ui.get_$main_content().height() - 6);
            });

            this._$editor = $ifr.appendTo(this._$ct);
            this.start_listen_empty();
        },*/

        /*start_listen_empty: function() {
            var me = this;
            this.get_$editor_doc().on('keyup', function(e) {
                if(!me.get_content()) {
                    me.trigger('action', 'empty', true);
                }
            });
        },*/
        /**
         * 清除内容
         */
        clear: function() {
            this.get_$editor().val('').blur();
            has_content = false;
        },

        /*get_content: function() {
            if($('#'+editor_tip_id, this._$editor_doc).length) {
                return '';
            }
            return $.trim($('body', this._$editor_doc).html());
        },*/

        /**
         * 获取编辑器中的内容
         * @returns {*}
         */
        get_content: function() {
            return this.get_$editor().val();
        },

        is_activated: function() {
            return this._is_activated;
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            var me = this;
            me.sync_editor_size();
            //同步editor高度使之撑满内容区
            this.listenTo(global_event, window_resize_event, function() {
                this.sync_editor_size();
            });
            this._is_activated = true;
        },

        deactivate: function() {
            this.stopListening(global_event, window_resize_event);
            this._is_activated = false;
        },

        get_$editor: function() {
            return this._$editor;
        }

    });

    return Editor;
});/**
 * 剪贴板模块 发送tab 底部工具栏
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./send.FootBar",["lib","common","$","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        tmpl = require('./tmpl'),

        undefined;

    var FootBar = inherit(Event, {

        name: 'footbar',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this._$ct = $ct;
            $(tmpl.footbar()).appendTo($ct);
            this.bind_events();
            this._rendered = true;
        },

        bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                var $target = $(this),
                    action_name = $target.attr('data-action');
                e.preventDefault();
                if(action_name === 'send') {
                    if($target.find('.btn-inner').is('.disabled')) { //禁用状态
                        return;
                    }
                    me.toggle_send_btn(false);
                } else if(action_name === 'clear') {
                    me.toggle_clear_btn(false);
                }
                me.trigger('action', action_name, null, e); //mgr 处理
            });
        },
        /**
         *
         * @param {Boolean} is_show 是否显示发送按钮
         */
        toggle_send_btn: function(is_show) {
            if(is_show) {
                this.get_$send_btn().show();
                this.get_$sending_btn().hide();
            } else {
                this.get_$send_btn().hide();
                this.get_$sending_btn().show();
            }
        },

        /**
         * 显示/隐藏清除按钮 由mgr判断编辑器中是否有内容来调用
         * @param is_show
         */
        toggle_clear_btn: function(is_show) {
            if(is_show) {
                this.get_$clear_btn().show();
                this.get_$send_btn().find('.btn-inner').removeClass('disabled');
            } else {
                this.get_$clear_btn().hide();
                this.get_$send_btn().find('.btn-inner').addClass('disabled');
            }
        },

        /**
         * 发送是否成功后对发送按钮进行控制，由mgr调用
         * @param is_succ
         */
        on_send_succ: function(is_succ) {
            var me = this,
                $succ_tip;
            if(is_succ) {
                this.get_$send_btn().hide();
                this.get_$sending_btn().hide();
                $succ_tip = this.get_$send_succ_tip();

                $succ_tip.show();
                setTimeout(function() {
                    $succ_tip.hide();
                    me.toggle_send_btn(true);
                }, 3000);
            } else {
                me.toggle_send_btn(true);
            }
        },

        is_activated: function() {
            return this._is_activated;
        },

        activate: function() {
            this._is_activated = true;
        },
        deactivate: function() {
            this._is_activated = false;
        },

        get_$clear_btn: function() {
            return this._$clear_btn || (this._$clear_btn = this._$ct.find('[data-action=clear]'));
        },

        get_$send_btn: function() {
            return this._$send_btn || (this._$send_btn = this._$ct.find('[data-action=send]'));
        },

        get_$sending_btn: function() {
            return this._$sending_btn || (this._$sending_btn = this._$ct.find('[data-id=sending]'));
        },

        get_$send_succ_tip: function() {
            return this._$succ_tip || (this._$succ_tip = this._$ct.find('[data-id=send_succ_tip]'));
        }

    });

    return FootBar;
});/**
 * 剪贴板模块 发送tab 管理器
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./send.Mgr",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),
        store = lib.get('./store'),
        json = lib.get('./json'),
        text = lib.get('./text'),

        global_event = common.get('./global.global_event'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
        device_id = constants.DEVICE_ID,

        undefined;

    var Mgr = inherit(Event, {

        constructor: function(cfg) {
            this._observe_mods_map = {};
        },

        /**
         * 观察者模式实现，监听模块的自定义事件
         * @param {Module} mod 模块
         */
        observe: function(mod) {
            if(this.has_observe_mod(mod)) {
                return;
            }
            this._observe_mods_map[mod.name] = mod;
            this.bind_action(mod);
        },

        has_observe_mod: function(mod) {
            if(!mod.name) {
                console.error('observe module must have name');
                return false;
            }
            return !!this._observe_mods_map[mod.name];
        },

        /**
         * 绑定自定义事件
         * @param mod
         */
        bind_action: function(mod) {
            this.listenTo(mod, 'action', function(action_name, data, event) {
                this.dispatch_action(action_name, data, event);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event);
            }
            event && event.preventDefault();
        },

        /**
         * 发送剪贴内容
         * @param event
         */
        on_send: function(event) {
            var content = this.get_editor().get_content(),
                me = this;
            if(!content) {
                mini_tip.warn('发送内容为空');
                me.get_fbar().toggle_send_btn(true);
                return;
            }

            if(this._send_req) {
                this._send_req.destroy();
            }
            this._send_req = request.xhr_post({
                url: REQUEST_CGI,
                cmd: 'ClipBoardUpload',
                cavil: true,
                pb_v2: true,
                body: {
                    msg_info: {
                        items: [{
                            type: 1,
                            content: content
                        }],
                        device_id: device_id
                    }
                }
            })
                .ok(function(msg, body) {
                    //mini_tip.ok(msg || '发送成功');    foobar中提示
                    me.get_fbar().on_send_succ(true);
                    me.store_owner_send_ctime(body.msg_ctime);
                })
                .fail(function(msg, ret) {
                    if(ret == 190013) {
                        msg = '字符数超出限制';
                    }
                    mini_tip.error(msg || '发送失败');
                    me.get_fbar().on_send_succ(false);
                });

            user_log('CLIPBOARD_SEND_SEND_BTN');
        },

        /**
         * 保存自己发送的消息的创建时间，用于轮询更新消息时过滤掉自己发的
         */
        store_owner_send_ctime: function(ctime) {
            var local_ctimes;
            if(ctime) {
                global_event.trigger('send_clipboard_success', ctime);
            }
        },

        /**
         * 清除编辑器中的内容
         * @param event
         */
        on_clear: function(event) {
            var editor = this.get_editor(),
                fbar = this.get_fbar();
            editor.clear();
            fbar.toggle_clear_btn(false);
            user_log('CLIPBOARD_SEND_CLEAR_BTN');
        },

        on_empty: function(is_empty) {
            var fbar = this.get_fbar();
            fbar.toggle_clear_btn(!is_empty);
        },

        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },

        get_editor: function() {
            return this.get_observe_mod_by_name('editor');
        },

        get_fbar: function() {
            return this.get_observe_mod_by_name('footbar');
        },

        abort_ajax: function() {
            this._send_req && this._send_req.destroy();
        },

        destroy: function() {
            var me = this;
            this.abort_ajax();
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }

    });

    return Mgr;
});/**
 * 剪贴板模块 发送tab
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./send.Send",["lib","common","$","./send.Editor","./send.FootBar","./send.Mgr","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        user_log = common.get('./user_log'),

        Editor = require('./send.Editor'),
        FootBar = require('./send.FootBar'),
        Mgr = require('./send.Mgr'),
        tmpl = require('./tmpl'),

        ie67 = $.browser.msie && $.browser.version < 8,

        undefined;

    var Send = inherit(Event, {

        name: 'send',

        title: '发送',

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.mgr = new Mgr();
        },

        render: function($render_to) {

            if(this._rendered) {
                return;
            }

            this._$render_to = $render_to;
            this._$ct = $(tmpl.send()).appendTo($render_to);
            this.render_editor();
            this.render_fbar();
            this.activate();
            this._rendered = true;
        },

        is_rendered: function() {
            return !!this._rendered;
        },

        render_editor: function() {
            this._editor = new Editor({
                $render_to: this.get_$editor_ct()
            });

            this.add_sub_mod(this._editor);
            this.mgr.observe(this._editor);
        },

        render_fbar: function() {
            this._fbar = new FootBar({
                $render_to: this.get_$fbar_ct()
            });

            this.add_sub_mod(this._fbar);
            this.mgr.observe(this._fbar);
        },

        /**
         * 添加子模块，便于管理
         * @param mod
         */
        add_sub_mod: function(mod) {
            if(!this._sub_mods) {
                this._sub_mods = [];
            }

            this._sub_mods.push(mod);
        },

        is_activated: function() {
            return !!this._is_activated;
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            this.show();
            this.get_$clipboard_body().addClass('clipboard-send-active');
            this._editor.activate();
            if(ie67) {
                $('#_main_box').css('overflow', 'hidden').repaint();
            }
            user_log('CLIPBOARD_SEND_TAB');
            this._is_activated = true;
        },

        deactivate: function() {
            if(!this.is_activated()) {
                return;
            }
            this.hide();
            this.mgr.abort_ajax();
            if(ie67) {
                $('#_main_box').css('overflow', '');
            }
            this.get_$clipboard_body().removeClass('clipboard-send-active');
            this._editor.deactivate();
            this._is_activated = false;
        },

        show: function() {
            this.get_$ct().show();
        },

        hide: function() {
            this.get_$ct().hide();
        },

        get_$ct: function() {
            return this._$ct;
        },

        get_$clipboard_body: function() {
            return this._$clipboard_body || (this._$clipboard_body = $('#_clipboard_body'));
        },

        get_$editor_ct: function() {
            return this._$ct.find('[data-id=editor_ct]');
        },

        get_$fbar_ct: function() {
            return this._$ct.find('[data-id=footbar_ct]');
        },


        destroy: function() {
            $.each(this.sub_mods, function(i, sub_mod) {
                sub_mod.destroy();
            });

            this._sub_mods = null;
            this.mgr.destroy();
            this.mgr = null;
        }

    });

    return Send;
});/**
 * 剪贴板模块 TabBar
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./tab.TabBar",["lib","common","$","main","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        undefined;

    var TabBar = inherit(Event, {

        activeIndex: 0,
        active_cls: 'tab-act',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            var tab_bar,
                activeIndex;

            if(this._rendered) {
                return;
            }

            this._$ct = $(tmpl.tab_bar({
                            items: this.items
                        })).appendTo($render_to);

            var me = this;

            this._$ct.on('click', '[data-bar]', function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr('data-index'), 10);
                if(index !== me.activeIndex) {
                    me.trigger('switch', index, me.activeIndex);
                    me.activate(index);
                }
            });
            main_ui.sync_size();

            this._rendered = true;
        },

        /**
         * 切换tab
         * @param index
         */
        activate: function(index) {
            $bars = this._$ct.find('li');
            $bars.filter(':eq('+this.activeIndex+')').removeClass(this.active_cls);
            $bars.filter(':eq('+index+')').addClass(this.active_cls);
            this.activeIndex = index;
        },

        get_$ct: function() {
            return this._$ct;
        },

        destroy: function() {
            this._$ct.remove();
            this._$ct = null;
            this.$render_to = null;
            this.items = null;
        }
    });

    return TabBar;
});/**
 * 剪贴板模块 TabView
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./tab.TabView",["lib","common","$","./tab.TabBar","./tmpl","main"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
	    huatuo_speed = common.get('./huatuo_speed'),

        TabBar = require('./tab.TabBar'),
        tmpl = require('./tmpl'),

        main_ui = require('main').get('./ui'),

        undefined;

    var TabView = inherit(Event, {

        activeIndex: 0,//默认显示tab 的index

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            var tab_bar,
                activeIndex;

            if(this._rendered) {
                return;
            }

            tab_bar = [];
            activeIndex = this.activeIndex;

           // this.trigger('before_render');

            this._$ct = $(tmpl.tab_view()).appendTo($render_to);

            var me = this;
            //从tab items取title作为tabbar
            $.each(this.items, function(i, item) {
                tab_bar.push({
                    title: item.title,
                    cls: item.name == 'send' ? 'tab-send': 'tab-receive',
                    active: i === activeIndex
                });
            });


            this.render_bar(tab_bar); //render tabbar
            this.activate(this.activeIndex);

           // this.on_render();

            this.bind_events();

           // this.trigger('after_render');

	        //测速
	        try{
		        var flag = '21254-1-20';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }

            this._rendered = true;
        },

        render_bar: function(bars) {
            this.tab_bar = new TabBar({
                $render_to: main_ui.get_$bar1(),
                items: bars,
                activeIndex: this.activeIndex,
                active_cls: 'tab-act'
            });
        },

        on_render: $.noop,

        /**
         * 绑定事件
         */
        bind_events: function() {
            this.listenTo(this.tab_bar, 'switch', function(new_idx, old_idx) {
                this.switch_tab(new_idx, old_idx);
            });
        },

        /**
         * 切换tab
         * @param {Number} new_idx 要激活显示tab的下标
         * @param {Number} old_idx 当前显示tab的下标
         */
        switch_tab: function(new_idx, old_idx) {
            var items = this.items,
                old_tab = items[old_idx],
                new_tab = items[new_idx];

            old_tab.deactivate();
            //已经渲染则直接激活，否则要渲染
            if(new_tab.is_rendered()) {
                new_tab.activate();
            } else {
                new_tab.render(this.get_$ct());
            }
            this.activeIndex = new_idx;
        },

        is_activated: function() {
            return !!this._activated;
        },

        /**
         * 激活一个tab
         * @param {Number} activeIndex 要激活的tab index
         */
        activate: function(activeIndex) {
            var active_tab;
            if(this.is_activated()) {
                return;
            }
            if(this.activeIndex !== activeIndex) {
                this.tab_bar.activate(activeIndex);
                this.switch_tab(activeIndex, this.activeIndex);
            } else {
                active_tab = this.items[this.activeIndex];
                if(active_tab.is_rendered()) {
                    active_tab.activate();
                } else {
                    active_tab.render(this.get_$ct());
                }
            }

            this._activated = true;
        },
        /**
         * 当离开剪贴板模块时，对激活状态的tab进行deactivate处理
         */
        deactivate: function() {
            var active_tab = this.items[this.activeIndex];
            active_tab && active_tab.deactivate();

            this._activated = false;
        },

        get_$ct: function() {
            return this._$ct;
        },

        destroy: function() {
            $.each(this.items, function(i, item) {
                item.destroy();
            });

            this.tab_bar.destroy();
            this._$ct.remove();
            this._$ct = null;
            this.$render_to = null;
        }
    });

    return TabView;
});/**
 * 剪贴板模块 ui
 * @author hibincheng
 * @date 2014-01-14
 */
define.pack("./ui",["lib","common","$","main","./tab.TabView","./send.Send","./receive.Receive","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),

        main_ui = require('main').get('./ui'),

        TabView = require('./tab.TabView'),
        Send = require('./send.Send'),
        Receive = require('./receive.Receive'),

        clipboard_plugin = require('main').get('./clipboard_plugin'),
        tmpl = require('./tmpl'),


        tabview,

        undefined;

    var ui = new Module('clipboard_ui', {

        render: function() {

            var me = this;
            this._$ct = $(tmpl.clipboard()).appendTo(main_ui.get_$body_box());

            query_user.on_ready(function() {
                var has_unread_num = !!clipboard_plugin.get_unread_records_num(); //是否有未读消息
	            //测速
	            try{
		            var flag = '21254-1-20';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
                //tabview 两个tab:发送和接收（详细视图在接收tab里）
                tabview = new TabView({
                    $render_to: me._$ct,
                    activeIndex: has_unread_num ? 1 : 0, //默认显示发送tab，有未读消息时进入接收列表
                    items: [new Send(), new Receive()]
                });

                //模块切换时处理
                me
                    .on('activate', function() {
                        var has_unread_num = !!clipboard_plugin.get_unread_records_num(); //是否有未读消息
                        me.show();
                        tabview.activate(has_unread_num ? 1 : 0);
                    })
                    .on('deactivate', function() {
                        me.hide();
                        tabview.deactivate();
                    });
            });
        },

        show: function() {
            this.get_$ct().show();
        },

        hide: function() {
            this.get_$ct().hide();
        },

        get_$ct: function() {
            return this._$ct || (this._$ct = $('#_clipboard_body'));
        }

    });

    return ui;
});
//tmpl file list:
//clipboard/src/clipboard.tmpl.html
//clipboard/src/receive/receive.tmpl.html
//clipboard/src/send/send.tmpl.html
//clipboard/src/tab/tabview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'clipboard': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_clipboard_body" class="ui-view clipboard-view" data-label-for-aria="剪贴板内容区域"></div>');

}
return __p.join("");
},

'receive': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-id="receive_ct"></div>');

}
return __p.join("");
},

'receive_view': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="clip-txt">\r\n\
        <div data-id="list_wrap" class="clip-txt-inner">\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="g-empty clip-empty" style="display:none;">\r\n\
        <div class="empty-box" tabindex="0">\r\n\
            <div class="ico"></div>\r\n\
            <p data-id="title" class="title">剪贴板无内容</p>\r\n\
            <p data-id="content" class="content">安装微云手机版，使用“剪贴板”功能可以将文字发送到这里</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'receive_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <ul class="clip-receive-list"></ul>');

}
return __p.join("");
},

'receive_list_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            lib = require('lib'),
            common = require('common'),
            scr_reader_mode = common.get('./scr_reader_mode'),
            read_mode = scr_reader_mode.is_enable(),  //读屏模式
            text = lib.get('./text'),
            records = data;

        $.each(records|| [], function(i, rd) {
            var content = text.text(rd.get('content'));
    __p.push('        <li data-action="show_detail" data-file-id class="item">\r\n\
            <div class="clip-receive-list-inner">');
 if(read_mode) { __p.push('                    <a class="text" href="#" tabindex="0" title="点击进入详情">');
_p(content);
__p.push('</a>');
 } else {
                    content = content.replace(/^([\r\n]+)+/, '').replace(/[\r\n]+/g, '<br />')
                __p.push('                    <div class="text">');
_p(content);
__p.push('</div>');
 } __p.push('                <span class="ico-jiao"></span>\r\n\
            </div>\r\n\
        </li>');
  }); __p.push('');

}
return __p.join("");
},

'receive_detail': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="clip-txt">\r\n\
        <div class="clip-txt-inner" style="">\r\n\
            <div data-id="content" class="textinput" ></div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var common = require('common'),
            Copy = common.get('./util.Copy');
    __p.push('    <div class="clip-operate-wrap">\r\n\
        <div class="clip-top-operate">\r\n\
            <a data-action="back" href="#" class="clip-return" tabindex="0" title="返回"><i class="ico ico-return"></i><span>返回</span></a>\r\n\
            <div class="clip-top-btns">');

                    if(Copy.can_copy()) {
                __p.push('                    <a data-clipboard-target data-action="copy" href="#" class="g-btn g-btn-gray" tabindex="-1" title="复制">\r\n\
                        <span class="btn-inner"><i class="ico ico-copy"></i><span class="text">复制</span></span>\r\n\
                    </a>');

                   }
                __p.push('                <a data-action="delete" href="#" class="g-btn g-btn-gray"  tabindex="0" title="删除">\r\n\
                    <span class="btn-inner"><i class="ico ico-del"></i><span class="text">删除</span></span>\r\n\
                </a>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'send': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="clip-txt">\r\n\
        <div class="clip-txt-inner" style="">\r\n\
            <div data-id="editor_ct" class="editor-wrap"></div>\r\n\
            <div data-id="footbar_ct"></div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'footbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="clip-txt-bot">\r\n\
        <a href="#" class="g-btn g-btn-gray btn-clear" data-action="clear" style="display:none;" tabindex="0"  title="清空"><span class="btn-inner">清空</span></a>\r\n\
        <a href="#" class="g-btn g-btn-blue btn-send" data-action="send" tabindex="0"  title="发送"><span class="btn-inner"><i class="ico ico-send"></i><span class="text">发送</span></span></a>\r\n\
        <a href="javascript:void(0);" class="g-btn g-btn-blue btn-send" data-id="sending" style="display:none;" tabindex="-1"><span class="btn-inner disabled">发送中...</span></a>\r\n\
        <div data-id="send_succ_tip" style="display:none;">\r\n\
            <div class="send-suc"><span class="ico-right"></span>发送成功！</div>\r\n\
            <div class="ui-dialog ui-light-dialog ui-light-dialog-s ui-popover ui-popover-right-top ui-super-light-dialog">\r\n\
                <div class="ui-dl-inner clear" style="width:238px;">\r\n\
                    <b class="ui-dl-arrow ui-dl-arrow1"></b>\r\n\
                    <b class="ui-dl-arrow ui-dl-arrow2"></b>\r\n\
                    <div class="ui-dl-bd">\r\n\
                        <p>可以在您其他安装了微云的设备上接收。</p>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'tab_view': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-id="tab_body"></div>');

}
return __p.join("");
},

'tab_bar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            common = require('common'),
            scr_reader_mode = common.get('./scr_reader_mode'),
            read_mode = scr_reader_mode.is_enable(),  //读屏模式
            items = data.items;
    __p.push('    <div class="clip-tab-wrap">\r\n\
        <div data-id="tab_bar" class="clip-tab">\r\n\
            <div class="clip-tabbar">\r\n\
                <ul>');

                    $.each(items, function(i, item) {
                __p.push('                    <li data-bar data-index=');
_p(i);
__p.push(' class="');
_p(item.cls);
__p.push('  ');
_p(item.active ? 'tab-act': '');
__p.push('"><a href="#" tabindex="0" ');
 if(read_mode) { __p.push('title="');
_p(item.title);
__p.push('内容区" ');
 } __p.push(' >');
_p(item.title);
__p.push('</a></li>');

                    });
                __p.push('                </ul>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
