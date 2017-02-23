//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/note/note.r160106",["lib","common","$","main","note_css"],function(require,exports,module){

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
//note/src/Loader.js
//note/src/Mgr.js
//note/src/Module.js
//note/src/View.js
//note/src/header/Toolbar.js
//note/src/note.js
//note/src/record.js
//note/src/header/header.tmpl.html
//note/src/view.tmpl.html

//js file list:
//note/src/Loader.js
//note/src/Mgr.js
//note/src/Module.js
//note/src/View.js
//note/src/header/Toolbar.js
//note/src/note.js
//note/src/record.js
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */

define.pack("./Loader",["lib","common","./record","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        Record = require('./record'),
        $ = require('$'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_note.fcg',
        undefined;

    var Loader = inherit(Event, {
        load_cfg: {
            count: 20,
            order_type: 0
        },
        constructor: function (cfg) {
            $.extend(this, cfg);
        },
        load_list: function (is_refresh) {
            var me = this;
            if (me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            me._loading = true;
            me.load_cfg.offset= !!is_refresh ? 0:me.store.size();
            if(me.store.size()>0 && !is_refresh){
                me.trigger('show_load_more');
            }
            me._last_load_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NotePageListGet",
                    re_try: 3,
                    pb_v2: true,
                    cavil: true,
                    body: me.load_cfg
                })
                .ok(function (msg, body) {
                    var records = [];
                    if (body.items && body.items.length > 0) {
                        records = me.generateRecords(body.items);
                    }else{
                        //本次拉取的个数为0时,代表没有后续的文档了
                        me._load_done=true;
                    }
                    me.trigger('load_list', records, is_refresh);
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);
                }).done(function (msg, ret) {
                    me._loading=false;
                    me.trigger('hide_load_more');
                });
        },

        generateRecords: function (items) {
            if (!$.isArray(items)) {
                console.error('Loader.js->generateRecords: cgi返回的数据格式不对');
                return;
            }
            var records = [];
            $.each(items, function (i, item) {
                var record;
                if(item.note_basic_info.thumb_url) {
                    item.note_basic_info.thumb_url = https_tool.translate_notepic_url(item.note_basic_info.thumb_url);
                }
                record = new Record(item);
                records.push(record);
            });

            return records;
        },

        load_detail: function (noteitem) {
            var me = this;
            if (me._last_load_detail_req) {//有请求未完成，则要先清除
                me._last_load_detail_req.destroy();
            }
            me._last_load_detail_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NoteDetail",
                    re_try: 3,
                    pb_v2: true,
                    body: {
                        note_id: noteitem.get_id()
                    }
                })
                .ok(function (msg, body) {
                    noteitem.set('item_htmltext', body.item.item_htmltext, true);
                    noteitem.set('item_article', body.item.item_article, true);
                    me.trigger('show_note', noteitem);
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);
                });
        },

        is_loading: function () {
            return this._loading;
        },

        is_all_load_done: function () {
            return this._load_done;
        }

    });

    return Loader;

});


/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午10:33
 * To change this template use File | Settings | File Templates.
 */

define.pack("./Mgr",["lib","common","./record","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        record = require('./record'),
        $ = require('$'),
        logger = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        mini_tip_v2 = common.get('./ui.mini_tip_v2'),
        progress = common.get('./ui.progress'),
        global_event = common.get('./global.global_event'),
        https_tool = common.get('./util.https_tool'),
        del_num_limit = 50,
        share_enter,
        default_url = 'http://web2.cgi.weiyun.com/weiyun_note.fcg',
        note_editor,
        note_article,
        tmpl = require('./tmpl'),
        timing_save_id,
        date_time = lib.get('./date_time'),
        undefined;


	// 最大笔记长度200kb
	var MAX_CONTENTLENGTH = 200 * 1024;

    var Mgr = inherit(Event, {

        constructor: function (cfg) {
            $.extend(this, cfg);
            //后续迁移到web_v2再干掉
            if(!constants.IS_OLD){
                mini_tip = mini_tip_v2;
            }
            window.call_save_note = this.on_save_note;
            window.call_save_article = this.on_save_article;
            window.call_save_upload_pic = this.on_save_upload_pic;
            window.call_close_note_pic_upload_mask = this.on_close_note_pic_upload_mask;
            window.call_note_show_tip = this.on_note_show_tip;
            this.bind_events();
        },

        load_files: function (is_refresh) {
            var me = this;
            me.loader._load_done = false;
            me.loader.load_list(is_refresh);
        },

        bind_events: function () {
            var me = this;
            me.listenTo(me.view, 'action', function (action_name, e) {
                this.process_action(action_name, e);
            });
            me.listenTo(me.toolbar, "action", function (action_name, e) {
                this.process_action(action_name, e);
            });

            me.listenTo(me.loader, "load_list", function (records, is_refresh) {
                this.on_load_list(records, is_refresh);
            });

            me.listenTo(me.loader, "show_note", function (record) {
                this.show_note(record);
            });

            me.listenTo(me.loader, "error", function (msg, ret) {
                mini_tip.error(msg);
            });
            me.listenTo(me.loader, "show_load_more", function () {
                me.view.get_$load_more().show();
            });
            me.listenTo(me.loader, "hide_load_more", function () {
                me.view.get_$load_more().hide();
            });
            me.listenTo(global_event, "note_list_refresh", function (note_item) {
                var me = this;
                if(note_item == null){
                    note_item= window.current_record_note
                }
                me.store.remove(note_item);
                me.store.add(note_item, 0, true);
                note_item.set_save_status("", true);
                me.view.get_scroller().to(0);
                this.refresh();

            });
            me.listenTo(global_event, "remark_article", function () {
                this.do_save_article();
            });
            me.listenTo(global_event, "_note_upload_pic_mask", function () {
                this.do_save_upload_pic();
            });

            me.listenTo(global_event, "close_note_pic_upload_mask", function () {
                this.do_close_note_pic_upload_mask();
            });

            me.listenTo(global_event, "note_timing_save", function () {
                timing_save_id = setInterval(function () {
                    me.auto_save_note();
                }, 1000 * 10);
            });
            me.listenTo(global_event, "note_stop_timing_save", function () {
                clearInterval(timing_save_id);
            });
        },

        // 分派动作
        process_action: function (action_name, e) {
            var fn_name = 'on_' + action_name;
            if (typeof this[fn_name] === 'function') {
                this[fn_name]();
            }
            if(e){
                e.preventDefault();
            }
            // 不再触发recordclick
            return false;
        },

        on_delete: function () {
            var me = this;
            var records = me.view.get_selected_files();
            if (records.length >= 1) {
                me.do_delete(records);
            } else {
                mini_tip.warn('请选择笔记');
            }

        },
        on_create: function () {

            var me = this;
            var _note_basic_info = {
                    note_type: 2,   //支持编辑格式的笔记
                    note_title: "新建笔记",
                    diff_version: date_time.now()
                },
                _item_htmltext = {
                    note_html_content: ""
                };
            var _new_note = new record({
                note_basic_info: _note_basic_info,
                item_htmltext: _item_htmltext
            });
            if (me.store.size() == 0 || me.store.get(0).get_id() != "") {
                //新增记录以后重绘整个列表
                me.store.add(_new_note, 0);
                me.refresh();
                me.view.clear_select();
                me.loader.trigger('show_note', _new_note);
                if (me.store.size() == 1) {
                    me.view.on_datachanged();
                }
                _new_note.set("selected", true);
                me.view.get_scroller().to(0);
            };
        },
        on_refresh: function () {
            var me = this;
            me.load_files(true);
        },
        on_share: function () {
            var me = this;
            var records = me.view.get_selected_files();
            //if (records.length > 1) {
            //    mini_tip.warn('只能对分享单个笔记分享');
            //    return
            if (records.length == 0) {
                mini_tip.warn('请选择笔记');
                return
            }
            //var record = records[0];
            if (!share_enter) {
                require.async('share_enter', function (mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records);
                });
            } else {
                share_enter.start_share(records);
            }
        },
        /**
         * 执行删除笔记操作
         * @param records
         */
        do_delete: function (records) {
            var me = this,
                start = 0,
                del_total = records.length,
                del_success_num = 0,
                del_success_record = [];

            var _do_delete_note = function () {
                var key_id,
	                key_list = [],
                    del_record_slice = [],
	                del_record_new = [];
                //批量取消操作
                for (var i = start; i < records.length && i < del_num_limit + start; i++) {
	                key_id = records[i].get_id() || '';
	                if(key_id) {
		                key_list.push(key_id);
		                del_record_slice.push(records[i]);
	                } else {
		                //未保存的新建笔记
		                del_record_new.push(records[i]);
	                }
                }

	            //未保存的笔记直接在页面里干掉
	            if(del_record_new.length) {
		            //静默删除
		            me.store.batch_remove(del_record_new, true);
	            }

	            //删除已经保存在后台的笔记
	            if(del_record_slice.length) {
		            request.xhr_post({
			            url: default_url,
			            cmd: 'NoteDelete',
			            pb_v2: true,
			            body: {
				            note_ids: key_list
			            }
		            }).ok(function(msg, body) {
			            var ret_list = body.ret_msg || [],
				            del_records = del_record_slice;
			            //在要删除的记录数组中，剔除删除失败的记录。
			            if(ret_list.length > 0) {
				            del_records = $.grep(del_record_slice, function(item) {
					            return me._contain(item.get_id(), ret_list);
				            });
			            }
			            //记录删除成功的总数， 与删除成功相应的记录
			            $.each(del_records, function(i, record) {
				            del_success_record.push(del_records[i])
				            del_success_num++;
			            });

		            }).done(function(msg, ret) {
			            //判断删除的情况
			            start += del_num_limit;
			            if(start >= del_total) {
				            //静默删除, 删除以后整个列表重绘
				            me.store.batch_remove(del_success_record, true);
				            //删除后显示第一篇文档.
				            if(me.store.size() > 0) {
					            var _record = me.store.get(0);
					            _record.set("selected", true);
					            if(_record.get('item_htmltext') || _record.get('item_article')) {
						            me.loader.trigger('show_note', _record);
					            } else {
						            me.loader.load_detail(_record);
					            }
				            }
				            me.refresh();
				            //隐藏删除进度
				            progress.hide();
				            //判断删除情况给出相应的提示
				            if(del_total == del_success_num) {
					            mini_tip.ok('操作成功');
					            if(!me.loader.is_loading() && !me.loader.is_all_load_done()) {
						            me.load_files();
					            }

				            } else if(del_success_num > 0) {
					            mini_tip.warn('部分笔记删除失败');
					            if(!me.loader.is_loading() && !me.loader.is_all_load_done()) {
						            me.load_files();
					            }
				            } else {
					            mini_tip.error('笔记删除失败:' + msg);
				            }
			            } else {
				            //显示当前删除进度， 递归调用该方法取消剩余的分享
				            var title = text.format('正在取消第{0}/{1}条笔记', [start, del_total]);
				            progress.show(title, false, true);
				            _do_delete_note();
			            }
		            });
	            } else {
		            //删除后显示第一篇文档.
		            if(me.store.size() > 0) {
			            var _record = me.store.get(0);
			            _record.set("selected", true);
			            if(_record.get('item_htmltext') || _record.get('item_article')) {
				            me.loader.trigger('show_note', _record);
			            } else {
				            me.loader.load_detail(_record);
			            }
		            } else {
			            window.current_record_note = null;
		            }
		            me.refresh();
		            //隐藏删除进度
		            progress.hide();
		            mini_tip.ok('操作成功');
		            if(!me.loader.is_loading() && !me.loader.is_all_load_done()) {
			            me.load_files();
		            }
	            }
            };
            var _del_text;
            if (records.length > 1) {
                _del_text = '您确定删除这' + records.length + '条笔记吗？'
            } else {
                _del_text = '您确定删除这条笔记吗？'
            }
            widgets.confirm('提示', _del_text, '', _do_delete_note, null, ['是', '否']);
        },
        /**
         * 装载请求回来的数据
         * @param records
         * @param is_refresh
         */
        on_load_list: function (records, is_refresh) {
            var me = this;
            if (me.store.size() == 0 || is_refresh) {
                me.store.load(records);
                //第一次进来默认展示第一条笔记
                if (records.length > 0 && !is_refresh) {
                    records[0].set("selected", true);
                    me.loader.load_detail(records[0]);
                }else if(records.length > 0 && is_refresh && window.current_record_note){         //刷新操作
                    if(window.current_record_note.get_id() ==""){  //新建笔记则重新插入到最前
                        me.store.add(window.current_record_note,0);
                        me.refresh();
                    }else{                                       //否则  直接显示第一条笔记 并滚动到顶部
                        records[0].set("selected", true);
                        me.loader.load_detail(records[0]);
                        me.view.get_scroller().to(0);
                    }
                }
            } else {
                me.store.add(records);
                me.refresh();
            }
        },

        //新建笔记的自动保存，id值为空串。24402说明笔记已被删除，不再发起保存命令
        auto_save_note: function() {
            var current_record_note = window.current_record_note;
            if(current_record_note && current_record_note.get_notetype && current_record_note.get_notetype() == 2 && current_record_note.get_auto_save_status() !== 24402){
                note_editor.contentWindow.CallJS_SaveFromWeiyun(current_record_note.get_id(),true);
            }
        },

        /**
         * 保存笔记
         * @param recordid
         * @param noteitem
         * @param autosave
         */
        on_save_note: function (recordid, noteitem,autosave) {
            var me = this,
                current_record_note = (window.current_record_note);

            //这里对内容复杂的笔记内容，需求清除<br>标签的干扰，再进行比较
            var current_note_content = current_record_note.get_htmlcontent().replace(/<br\s*(\/)*>/g, ''),
                note_content = noteitem.content.replace(/<br\s*(\/)*>/g, '');

            if (current_note_content != note_content && current_record_note.get_id() == recordid) {
	            if(noteitem.content.length >= MAX_CONTENTLENGTH) {
		            mini_tip.warn('笔记内容字数超限，请另新建笔记');
		            return;
	            }
                //图片笔记保存逻辑
                if (noteitem.title == "" && noteitem.pics.length > 0) {
                    noteitem.title = "图片笔记";
                }else if(noteitem.title ==""){
                    noteitem.title = "新建笔记";
                }

                //笔记图片URL还原代理前缀
                note_content = noteitem.content.replace(/<img.*?src=['"].*?['"].*?>/ig, function (img) {
                    return img.replace(/src=(['"])https?:\/\/h5\.weiyun\.com\/tx_tls_gate=/i, 'src=$1http://')
                        .replace(/src=(['"])https?:\/\/proxy\.gtimg\.cn\/tx_tls_gate=/i, 'src=$1http://');
                });
                var _data = {
                    note_type: current_record_note.get_notetype(),
                    note_title: noteitem.title,
                    item_htmltext: {
                        note_html_content: note_content
                    }
                };
                var _cmd = "NoteAdd";
                //添加缩略图
                var _thumb_url = "";
                if(noteitem.pics.length>10){
                     mini_tip.warn('笔记图片个数超过限制,请删除图片后再试,笔记保存失败');
                     return;
                }else if (noteitem.pics.length > 0) {
                    _thumb_url = noteitem.pics[0];
                    //笔记图片URL还原代理前缀
                    _thumb_url = _thumb_url.replace(/https?:\/\/h5\.weiyun\.com\/tx_tls_gate=/i, 'http://')
                        .replace(/https?:\/\/proxy\.gtimg\.cn\/tx_tls_gate=/i, 'http://');
                    _data['thumb_url'] = _thumb_url;
                }else{
                    _data['thumb_url'] = "http://";         //后台接口,取消缩略图  传入http://字符串
                }

                if (current_record_note.get_id() != "") {
                    _data['local_mtime'] = current_record_note.get_version();
                    _data['note_id'] = current_record_note.get_id();
                    _cmd = "NoteModify";
                }
                note_editor.contentWindow.CallJS_ChangeSaveState(current_record_note.get_id(), 1);     //1 按钮处于保存状态
                if (me._last_save_req) {//有请求未完成，则要先清除
                    me._last_save_req.destroy();
                }
                me._last_save_req= request.xhr_post({
                    url: default_url,
                    cmd: _cmd,
                    pb_v2: true,
                    body: _data
                })
                    .ok(function (msg, body) {
                        current_record_note.set_save_status("note_saved");
                        current_record_note.set_htmlcontent(noteitem.content);
                        current_record_note.set_name(noteitem.title);
                        current_record_note.set_version(body.diff_version);
                        current_record_note.set_mtime(body.note_mtime);
                        current_record_note.set_thumb_url(_thumb_url);
                        if (_cmd == "NoteAdd") {
                            current_record_note.set_id(body.note_id);
                            note_editor.contentWindow.CallJS_ShowNote(current_record_note.get_id(),current_record_note.get_notetype(), current_record_note.get_htmlcontent());
                        }
                        setTimeout(function () {     //延迟刷新，　　实现笔记保存的动画效果。
                            global_event.trigger("note_list_refresh",current_record_note);
                        }, 100);
                        if(autosave){
                            mini_tip.ok("自动保存成功");
                        }else{
                            mini_tip.ok("保存成功");
                        }

                    }).fail(function (msg, ret) {
                        if(autosave){
                            current_record_note.set_auto_save_status(ret);
                        }
                        mini_tip.error('保存失败:' + msg);
                        logger.write([
                            'web_save_note error --------> recordid: ' + recordid,
                            'web_save_note error --------> notetype: ' + current_record_note.get_notetype(),
                            'web_save_note error --------> title: ' + noteitem.title,
                            'web_save_note error --------> _thumb_url: ' + _thumb_url,
                            'web_save_note error --------> msg: ' + msg,
                            'web_save_note error --------> err: ' + ret,
                            'web_save_note error --------> time: ' + new Date()
                        ], 'save_note_error', ret);
                    }).done(function (msg, ret) {
                        note_editor.contentWindow.CallJS_ChangeSaveState(current_record_note.get_id(), 0);    //0 按钮恢复正常状态
                    });
            }
        },
        /**
         * 修改文章
         */
        on_save_article: function () {
            global_event.trigger('remark_article');
        },

        do_save_article: function () {
            var me = this,
                current_record_note = (window.current_record_note);
            if(!me.dialog){
                me.dialog = new widgets.Dialog({
                    klass: 'full-pop-small',
                    buttons: [
                        'OK',
                        'CANCEL',
                        { id: 'CLOSE', text: '关闭', klass: 'g-btn-gray', disabled: false, visible: false }
                    ],
                    handlers: {
                        OK: function () {
                            var _rearktxt = me.view.get_note_article_comment().value;
                            me.do_save_article_remark(_rearktxt);
                        }
                    }
                });
                me.dialog.set_content(tmpl.note_remark());
            }
            me.view.get_note_article_comment().value = current_record_note.get_article_comment();
            if (current_record_note.get_article_comment() != "") {
                me.dialog.set_title("修改备注");
            } else {
                me.dialog.set_title("增加备注");
            }
            me.dialog.show();
        },

        do_save_article_remark: function (remarkTxt) {
            var me=this;
            current_record_note.set_save_status("note_saved");
            var _data = {
                note_id: current_record_note.get_id(),
                note_type: current_record_note.get_notetype(),
                local_mtime: current_record_note.get_version(),
                item_article: {
                    note_raw_url: current_record_note.get_note_raw_url(),
                    note_comment: {
                        note_html_content: remarkTxt
                    }
                }
            };
            request.xhr_post({
                url: default_url,
                cmd: "NoteModify",
                pb_v2: true,
                body: _data
            })
                .ok(function (msg, body) {
                    current_record_note.set_save_status("note_saved");
                    current_record_note.set_version(body.diff_version);
                    current_record_note.set_article_comment(remarkTxt);
                    if (note_article.contentWindow.remarkTxt) {
                        note_article.contentWindow.remarkTxt(remarkTxt);
                        me.dialog.hide();
                        global_event.trigger("note_list_refresh",current_record_note);
                        mini_tip.ok("修改成功");
                        me.view.get_scroller().to(0);
                    }
                }).fail(function (msg, body) {
                    current_record_note.set_save_status("");
                    mini_tip.error('修改失败:' + msg);
                }).done(function (msg, ret) {
                });
        },


        /**
         * 上传图片弹窗
         */
        on_save_upload_pic:function(){
            global_event.trigger('_note_upload_pic_mask');
        },

        do_save_upload_pic:function(){
            this.view.show_upload_pic_mask();
        },

        on_close_note_pic_upload_mask:function(){
            global_event.trigger('close_note_pic_upload_mask');
        },
        do_close_note_pic_upload_mask:function(){
            this.view.hide_upload_pic_mask();
        },

        /**
         * 取消图片上传
         */
        on_cancel_upload_pic:function(){
            if(this.get_note_editor().contentWindow.CallJS_CancelUploadPic){
                this.get_note_editor().contentWindow.CallJS_CancelUploadPic();
            }
            if(this.get_note_editor().contentWindow.CallJS_UpdateImageUrl){
                this.get_note_editor().contentWindow.CallJS_UpdateImageUrl();
            }
        },
        /**
         * 从富文本编辑器中发出的提示信息
         * @param type
         * @param text
         */
        on_note_show_tip: function(type, text) {
            if(text) {
                mini_tip[type] && mini_tip[type](text);
            }
        },
        /**
         * 判断某条记录的删除是否失败。
         * @param text  note_id
         * @param json   cgi返回的数组  [{note_id:"",ret: }]
         * @returns {boolean}
         * @private
         */
        _contain: function (text, json) {
            for (var i = 0; i < json.length; i++) {
                if (text === json[i].note_id) {
                    if (json[i].retcode === 0) {
                        return true;
                    }
                    // 114300 表示服务端没有找到该数据， WEB端可认为是删除成功。
                    if (json[i].retcode != 114300) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
            return true;
        },

        show_note: function (record) {
            var me = this,
                note_id = record.get_id(),
                notetype = record.get_notetype();
            if(window.current_record_note && window.current_record_note.get_id()==""){          //. 将未保存的新建笔记内容缓存下来.
                try{
                    var _html_content=me.get_note_editor().contentWindow.CallJS_GetNoteContent();
                    window.current_record_note.set_htmlcontent(_html_content.content);
                }catch(e){
                }
            }
            window.current_record_note = record;
            if (notetype != 1) {
                var htmlcontent = record.get_htmlcontent();
                me.view.get_note_article_frame().hide();
                me.view.get_note_editor_frame().show();
                if(me.get_note_editor().contentWindow && me.get_note_editor().contentWindow.CallJS_ShowNote){
                    me.get_note_editor().contentWindow.CallJS_ShowNote(note_id, notetype, htmlcontent);
                }else{
                    //延迟显示
                    setTimeout(function(){
                        me.show_note(record);
                    },1000);
                }
            } else {
                me.view.get_note_editor_frame().hide();
                me.view.get_note_article_frame().attr("src", https_tool.translate_cgi(record.get_articleurl()));
                me.view.get_note_article_frame().show();
                me.get_note_article();
            }
        },

        /**
         * 配置分批加载数据的辅助判断工具
         * @param {Scroller} scroller
         */
        set_scroller: function (scroller) {
            this.scroller = scroller;
        },

        get_note_editor: function () {
            return note_editor || (note_editor = $('#_note_edit_frame')[0]);
        },
        get_note_article: function () {
            return note_article || (note_article = $('#_note_article_frame')[0]);
        },

        refresh: function () {
            var me = this;
            var records = me.store.data;
            me.view.$list.html(me.view.get_html(records));
            me.view.on_datachanged();
            me.view.trigger('refresh');
        }


    });
    return Mgr;
});/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:00
 * To change this template use File | Settings | File Templates.
 */

define.pack("./Module",["lib","common","main","$"],function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        common = require('common'),
        OldModule = common.get('./module'),
        query_user = common.get('./query_user'),
        main = require('main'),
        main_ui = main.get('./ui'),
        $ = require('$');

    var noop = $.noop;
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module: true,
        render: $.noop,
        activate: $.noop,
        deactivate: $.noop
    };
    var Module;
    Module = inherit(Event, {
        constructor: function (cfg) {
            $.extend(this, cfg);
        },
        get_list_view: function () {
            var view = this.list_view;
            if (!view.rendered) {
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function () {
            var header = this.list_header;
            if (!header.rendered) {
                header.render(this.$bar1_ct);
            }
            return header;
        },
        activate: function (params) {
            this.get_list_header().show();
            this.get_list_view().show();
            this.on_activate(params);
        },
        deactivate: function () {
            this.get_list_header().hide();
            this.get_list_view().hide();
            this.on_deactivate();
        },
        on_activate: noop,
        on_deactivate: noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module: function () {
            var module = this.old_module_adapter, me = this;
            if (!module) {
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui: dummy_module_ui,
                    render: function () {
                        main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$top_ct = main_ui.get_$top();
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$column_ct = main_ui.get_$share_head();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate: function (params) {

                        if (query_user.get_cached_user()) {
                            me.activate(params);
                        } else {
                            me.listenToOnce(query_user, 'load', function () {
                                me.activate();
                            });
                        }
                    },
                    deactivate: function () {
                        //yuyanghe   判断列表是否为空 为空时 移除share-empty-module 样式
                       // if (me.get_list_view().store.size() == 0) {
                            // yuyanghe 修复运营页面头部无线条BUG  用.show()命令最近文件会出现bug

                       // }
                        me.deactivate();
                        main_ui.get_$bar1().css('display', '');
                    }
                });
            }
            return module;
        }
    });
    return Module;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define.pack("./View",["lib","common","./tmpl","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        View = lib.get('./data.View'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        ContextMenu = common.get('./ui.context_menu'),
        tmpl = require('./tmpl'),
        blank_tip = common.get('./ui.blank_tip'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        ie678 = $.browser.msie && $.browser.version <= 8,
        main_ui = require('main').get('./ui'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        scroller,
        undefined;

    var File_view = inherit(View, {

        list_selector: '#_note_view_list>#_note_files',
        item_selector: 'dd[data-file-id]',
        action_property_name: 'data-action',
        _select_items_cnt: 0,//已勾选的文件个数


        list_tpl: function () {
            return tmpl.note_list();
        },

        tpl: function (file) {
            return tmpl.note_item([file]);
        },

        get_html: function (files) {
            return tmpl.note_item(files);
        },

        get_record_by_id: function (id) {
            return this.store.get(id);
        },

        //插入记录，扩展父类
        on_add: function (store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);

        },

        on_show: function () {
            this._activated = true;
        },

        on_hide: function () {
            this._activated = false;
        },

        is_activated: function () {
            return this._activated;
        },

        on_datachanged: function () {
            var me = this;
            File_view.superclass.on_datachanged.apply(this, arguments);
            if (this.store.size() === 0) {//无数据时，显示空白运营页
                this.get_$view_ct().addClass('ui-view-empty');
	            this.get_$view_empty().show();
                this.get_$note_editor().hide();
                this.get_$view_list().hide();
            } else {
                me.get_$view_ct().removeClass('ui-view-empty');
	            this.get_$view_empty().hide();
                this.get_$view_list().show();
                this.get_$note_editor().show();
            }
	        //测速
	        try{
		        var flag = '21254-1-12';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        after_render: function () {
            File_view.superclass.after_render.apply(this, arguments);
            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);
            // 点选，checkbox选择
            this.on('recordclick', this._handle_item_click, this);
            // 绑定按钮
            this.on('action', this._handle_action, this);
        },
        show_ctx_menu: function (record, e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                $target_item = $(e.target).closest(me.item_selector);
            var x = e.pageX,
                y = e.pageY;
            if (record) {
                if (!record.get('selected')) {
                    me.clear_select()
                }
                record.set('selected', true);
            } else {
                me.clear_select()
            }

            items = [];
            items.push({
                id: 'create',
                text: '新建笔记',
                icon_class: 'ico-note',
                click: default_handle_item_click
            });
            if (me.get_selected_files().length == 1) {
                items.push({
                    id: 'share',
                    text: '分享',
                    icon_class: 'ico-share',
                    click: default_handle_item_click
                });
            }
            items.push({
                id: 'delete',
                text: '删除',
                split: true,
                icon_class: 'ico-del',
                click: default_handle_item_click
            });

            menu = new ContextMenu({
                items: items
            });

            menu.show(x, y);

            //item click handle
            function default_handle_item_click(e) {
                switch(this.config.id){
                    case 'create':
                        user_log('NOTE_CREATE_RIGHT');
                        break;
                    case 'share':
                        user_log('NOTE_SHARE_RIGHT');
                        break;
                    case 'delete':
                        user_log('NOTE_DELETE_RIGHT');
                        break;
                }
                me.trigger('action', this.config.id);
            }
        },

        _handle_action: function (action, record, e) {
//            switch (action) {
//                case 'contextmenu':
//                    this.show_ctx_menu(record, e);
//                    break;
//            }
        },

        _handle_item_click: function (record, e) {
            e.preventDefault();
            var me = this;
            if (!e.ctrlKey) {
                me.clear_select();
                if (record.get('item_htmltext') || record.get('item_article') || record.get_id()=="") {
                    me.loader.trigger('show_note', record);
                } else {
                    me.loader.load_detail(record);
                }
            }
            record.set("selected", true);
        },

        /**
         * 清除所选项目
         */
        clear_select: function () {
            var store = this.store;
            store.each(function (item) {
                if (item.get('selected')) {
                    item.set('selected', false);
                }
            });
        },
        /**
         * 获取已选择的列表项
         * @returns {Array}
         */
        get_selected_files: function () {
            var store = this.store,
                selected_files = [];
            $.each(store.data, function (i, item) {
                if (item.get('selected')) {
                    selected_files.push(item);
                }
            });

            return selected_files;
        },

        get_scroller: function () {
            if (!scroller) {
                var Scroller = common.get('./ui.scroller');
                scroller = new Scroller(this.get_$view_list());
            }
            return scroller;
        },

        get_$main_bar1: function () {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },

        get_$view_list: function () {
            return this.$view_list || (this.$view_list = $('#_note_view_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_note_body'));
        },

	    get_$view_empty: function () {
            if(!this.$view_empty) {
                if(constants.IS_OLD) {
                    this.$view_empty = $(tmpl.view_empty()).appendTo(this.get_$view_ct());
                } else {
                    this.$view_empty = blank_tip.show({
                        id: 'j-note-empty',
                        to: this.get_$view_ct(),
                        icon_class: 'icon-nonote',
                        title: '暂无笔记',
                        content: '请点击右上角的“添加”按钮添加'
                    });
                }
            }
		    return this.$view_empty;
	    },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $('#note_load_more'));
        },

        get_$note_editor: function () {
            return this.$note_editor || (this.$note_editor = $('#_note_editor'));
        },

        get_note_editor_frame: function () {
            return this.$note_editor_frame || (this.$note_editor_frame = $(tmpl.note_edit_frame()).appendTo(this.get_$note_editor()));
        },
        get_note_article_frame: function () {
            return this.note_article_frame || (this.note_article_frame = $(tmpl.note_article_frame()).appendTo(this.get_$note_editor()));
        },

        get_note_article_comment: function () {
            return this.note_remark_comment_textarea || (this.note_remark_comment_textarea = $("#_note_remark_comment_textarea")[0]);
        },

        get_note_pic_upload_mask: function () {
            return this.note_pic_upload_mask || (this.note_pic_upload_mask = "");
        },


        shortcuts: {
            selected: function (value, view) {
                $(this).toggleClass('ui-selected', value);
            }
        },
        on_update: function (store, record, olds) {
            if (!this.rendered) {
                return;
            }
            var index = this.store.indexOf(record);
            var $dom = $(this.get_$view_list().find('dd')[index]);
            var can_shortcut_update = olds && (typeof olds === 'object'),
                shortcuts = this.shortcuts,
                name;
            // 判断是否都能快捷更新
            if (can_shortcut_update) {
                for (name in olds) {
                    if (olds.hasOwnProperty(name)) {
                        if (!shortcuts.hasOwnProperty(name)) {
                            can_shortcut_update = false;
                            break;
                        }
                    }
                }
            }
            if (can_shortcut_update) {
                for (name in olds) {
                    if (olds.hasOwnProperty(name)) {
                        shortcuts[name].call($dom, record.get(name), this, record);
                    }
                }
            } else { // 如果不能，直接全量更新html
                $dom.replaceWith(this.get_html([record]));
            }
            this.trigger('update');
        },

        //上传团片mask
        show_upload_pic_mask: function () {
            this.get_note_upload_pic_mask().stop(false, true).fadeIn('fast');
            center.listen(this.get_note_upload_pic_mask());
            widgets.mask.show('note_pic_upload', this, true);
            this.get_note_upload_pic_mask().show();
        },

        hide_upload_pic_mask: function () {
            widgets.mask.hide('note_pic_upload');
            this.get_note_upload_pic_mask().hide();
        },

        get_note_upload_pic_mask: function () {
            var me = this;
            if (!me.note_upload_pic_mask) {
                me.note_upload_pic_mask = $(tmpl.note_upload_pic_mask()).appendTo(document.body).hide();
                me.get_$note_upload_pic_mask_close().bind('click', function () {
                    me.hide_upload_pic_mask();
                    me.trigger('action', 'cancel_upload_pic');
                    return false;
                });
            }
            return me.note_upload_pic_mask
        },

        get_$note_upload_pic_mask_close: function () {
            return this.$note_upload_pic_mask_close || (this.$note_upload_pic_mask_close = this.get_note_upload_pic_mask().find('#note_upload_pic_mask_close'));
        },

        /**
         * 同步编辑器大小以撑满内容区
         */
        sync_editor_size: function () {
            var me = this,
                $editor = me.get_note_editor_frame();
            var height = $(window).height() - main_ui.get_$bar1().outerHeight() - main_ui.get_fixed_header_height();
            $editor.height(height - 20); //减去底部宽度
            try{
                if ($editor && $editor[0] && $editor[0].contentWindow && $editor[0].contentWindow.CallJS_ResizeExitorArea) {
                    $editor[0].contentWindow.CallJS_ResizeExitorArea(height-20,$editor.width());
                    if(ie678) {
	                    $('#_note_body').repaint();
                    }
                } else {
                    setTimeout(function () {
                        me.sync_editor_size();
                    }, 1000);
                }
            }catch(e){

            }

        }

    });
    return File_view;
});/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:29
 * To change this template use File | Settings | File Templates.
 */

define.pack("./header.Toolbar",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        collections = lib.get('./collections'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),
        action_property_name = 'data-action',
        user_log = common.get('./user_log'),
        undefined;

    var Toolbar = inherit(Event, {
        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl['note_toolbar']()).appendTo($ct);
                this.bind_action();
                this.rendered = true;
            }
        },
        /**
         * 绑定action事件
         */
        bind_action: function() {
            var me = this;
            me.current_item_map = me.current_item_map || {};
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                var action_name = $target.attr(action_property_name);
                me.trigger('action', action_name);
                switch(action_name){
                    case 'create':
                        user_log('NOTE_CREATE');
                        break;
                    case 'share':
                        user_log('NOTE_SHARE');
                        break;
                    case 'delete':
                        user_log('NOTE_DELETE');
                        break;
                }
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return Toolbar;

});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */


define.pack("./note",["lib","common","main","./Module","./Loader","./View","./header.Toolbar","./Mgr","note_css"],function (require, exports, module) //noinspection JSValidateTypes,JSValidateTypes
{
    var
        lib = require('lib'),
        common = require('common');
    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),
        main_mod = require('main').get('./main'),
        main_ui = require('main').get('./ui'),
        Module = require('./Module'),
        Loader = require('./Loader'),
        View = require('./View'),
        Toolbar  = require('./header.Toolbar'),
        Mgr = require('./Mgr'),
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,
        module_name = 'note',//
        window_resize_event = 'window_resize_real_time',
        scroller,
        console = lib.get('./console'),
        undefined;

    var store = new Store();
    var loader = new Loader({
        store:store
    });
    var toolbar = new Toolbar({
    });

    var view = new View({
        store : store,
        toolbar :toolbar,
        loader:loader
    });
    var mgr = new Mgr({
        toolbar: toolbar,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    require('note_css');

    var module = new Module({
        name: module_name,
        list_view: view,
        list_header: toolbar,
        loader: loader,
        init: function () {
	        window.maskZyj = true;
            if (!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
	            //测速
	            try{
		            var flag = '21254-1-12';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
                mgr.view.get_note_editor_frame();
                //先加载iframe  延迟 加载数据100ms
              //  setTimeout(function(){
                    mgr.load_files();
              //  },100)
                scroller = view.get_scroller();
                mgr.set_scroller(scroller);
                this.listenTo(scroller, 'scroll', this.on_win_scroll);
                inited = true;
            }

        },
        on_activate: function (params) {
            var me = this;
            me.init();
            main_ui.sync_size();
            global_event.trigger("note_timing_save");
            mgr.view.sync_editor_size();
            me.listenTo(global_event, window_resize_event, function() {
                mgr.view.sync_editor_size();
            });
            me.listenTo(global_event, "add_note", function() {
                mgr.view.trigger('action','create');
            });
            if(params && params.add_note==true){
                window.location.hash='m=note';      //手动修改hash,防止hash值错误无法跳转到其他目录
                mgr.view.trigger('action','create');
            }

            me.listenTo(global_event, 'page_unload', function() {
                mgr.auto_save_note();//关闭窗口时自动保存一下笔记
            });
            // 浏览器关闭、刷新前弹出确认框
            global_function.register('onbeforeunload', function () {
                if(main_mod.get_cur_mod_alias() === 'note' && query_user.get_skey()) {
                    //关闭窗口时自动保存一下笔记
                    mgr.auto_save_note();
                    return '您可能有数据没有保存';
                }
            });
            //appbox监听窗口关闭和刷新
            global_function.register('WYCLIENT_BeforeCloseWindow', function (is_close_QQ) {
                if(main_mod.get_cur_mod_alias() === 'note' && query_user.get_skey()) {
                    //关闭窗口时自动保存一下笔记
                    mgr.auto_save_note();
                    return true;
                }
            });
        },

        on_deactivate: function () {
            var me =  this;
            global_event.trigger("note_stop_timing_save");
            me.stopListening(global_event, window_resize_event);
            me.stopListening(global_event, "add_note");
            me.stopListening(global_event, 'page_unload');
            mgr.auto_save_note();//切换到别的tab时自动保存一下笔记
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
           if ( !loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files();
           }
        }
    });

    return module.get_common_module();
})/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define.pack("./record",["$","lib","common"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),

        common = require('common'),
        https_tool = common.get('./util.https_tool'),

        date_time = lib.get('./date_time'),
        today = date_time.today().getTime(),
        yesterday = date_time.yesterday().getTime(),
        last7day = date_time.add_days(-7).getTime();

    var record = inherit(Record, {

        get_id: function () {
            return (this.get('note_basic_info') && this.get('note_basic_info').note_id ) || "";
        },

        get_name: function () {
            return this.get('note_basic_info').note_title;
        },

        get_notetype: function () {
            return this.get('note_basic_info').note_type;
        },
        get_htmlcontent: function () {
            return this.get('item_htmltext').note_html_content;
        },

        get_mtime: function() {
            return this.get('note_basic_info').note_mtime;
        },

        get_version: function () {
            return this.get('note_basic_info').diff_version;
        },
        set_id: function (note_id) {
            this.get('note_basic_info').note_id = note_id;
        },

        set_version: function (diff_version) {
            this.get('note_basic_info').diff_version = diff_version;
        },

        set_mtime: function(mtime) {
            this.get('note_basic_info').note_mtime = mtime;
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
            return this.get('item_article') && this.get('item_article').note_comment.note_html_content;
        },

        set_article_comment: function (comment) {
            this.get('item_article').note_comment.note_html_content = comment;
        },

        get_note_raw_url: function () {
            return this.get('item_article') && this.get('item_article').note_raw_url;
        },
        get_thumb_url: function () {
            return this.get('note_basic_info').thumb_url;
        },
        set_thumb_url: function (thumb_url) {
             this.get('note_basic_info').thumb_url= https_tool.translate_notepic_url(thumb_url);
        },

        get_day_bar:function(){
            return compute_day(this.get_version());
        },

        get_auto_save_status:function(){
            return this.get('auto_save_status') || "";
        },

        //自动保存的状态保存，例如24402(笔记已删除)
        set_auto_save_status: function(auto_save_status, flag) {
            this.set('auto_save_status', auto_save_status, flag);
        },

        get_save_status:function(){
            return this.get('save_status') || "";
        },

        set_save_status:function(save_status,flag){
           this.set('save_status',save_status,flag);
        }
    });

    var compute_day=function(version){
        if(version>=today){
            return 1;
        }else if(version>=yesterday){
            return 2;
        }else if(version >=last7day){
            return 3;
        }else{
            return 4
        }
    }

    return record;
});
//tmpl file list:
//note/src/header/header.tmpl.html
//note/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'note_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="toolbar-btn clear sort-audio-toolbar">\r\n\
        <div class="btn-message">\r\n\
            <a data-no-selection data-action="create" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-mkdir"></i><span class="text">新建笔记</span></span></a>\r\n\
            <a data-no-selection data-action="share" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-share"></i><span class="text">分享</span></span></a>\r\n\
            <a data-no-selection data-action="delete" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-no-selection data-action="refresh" class="g-btn g-btn-gray" href="#" tabindex="-1"><span class="btn-inner minpad"><i class="ico ico-ref"></i><span class="text"></span></span></a>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'note_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_note_body" data-label-for-aria="笔记区域" class="note-body ui-view-empty" style="height:100%">\r\n\
        <div id="_note_view_list" class="note-list" style="display:none height:100%">\r\n\
            <!-- 文件列表 -->\r\n\
            <dl id="_note_files">\r\n\
            </dl>\r\n\
            <a href="javascript:void(0)" class="note-load-more" style="display:none;" id="note_load_more"><i class="icon-loading"></i></a>\r\n\
        </div>\r\n\
        <div class="note-editor" id="_note_editor">\r\n\
            <!--编辑器区域-->\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'note_edit_frame': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');

    __p.push('    <iframe frameborder="0" id="_note_edit_frame" name="_note_edit_frame" src="');
_p(constants.HTTP_PROTOCOL);
__p.push('//www.weiyun.com/note_web/main.html" width="100%"/>');

return __p.join("");
},

'note_article_frame': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <iframe frameborder="0" id="_note_article_frame" name="_note_article_frame" src="" width="100%" height="98%" style="display:none"/>');

return __p.join("");
},

'note_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        date_time=lib.get('./date_time'),
        text = lib.get('./text'),
        https_tool = common.get('./util.https_tool'),
        records = data,
        me = this,
        today = date_time.today().getTime(),
        yesterday = date_time.yesterday().getTime(),
        last7day = date_time.add_days(-7).getTime(),
        last_bar=5;
    __p.push('    ');

    $.each(records || [], function(i, file) {
    var note_name = file.get_name();
    var thumb_url= file.get_thumb_url();
    var has_img = thumb_url && thumb_url != "";
    var save_status = file.get_save_status();
    var is_selected = file.get("selected");
    var is_new_note = file.get_id() ==="";
    __p.push('    ');

    if( (i == 0 || last_bar < file.get_day_bar() )&& save_status == ""){
    last_bar = file.get_day_bar();
    __p.push('    ');
_p( me.bar(last_bar) );
__p.push('    ');

    }
    __p.push('    <dd data-record-id="');
_p(file.id);
__p.push('" data-file-id data-list="file" class="');
_p(is_selected ? 'ui-selected':'');
__p.push('">');

        if(save_status =="note_saved"){
        __p.push('        <div class="icon-update-done"></div>');

        }else if(save_status =="note_ing"){
        __p.push('        <div class="icon-update-ing"></div>');

        }
        __p.push('        <div class="note-list-item ');
_p( has_img ? 'note-list-item-has-img':'');
__p.push(' ');
_p( is_new_note ? 'note-list-item-new':'');
__p.push('"\r\n\
             tabindex="0"\r\n\
             style="height:50px">\r\n\
            <!-- bugfix:\r\n\
                1、复制粘贴图片or移动端上传笔记图片web端查看的时候，URL加载是外站的http链接，查看会有问题。只有自动保存后才正常；所以都需要加h5域名代理\r\n\
                2、IOS全面迁移https后，由后台来下发这类代理后的url，前端需要判断，没有带的才需要加\r\n\
            -->');

                var note_name_len=28;
                if(has_img){
                    note_name_len=20;
                    thumb_url = https_tool.translate_notepic_url(thumb_url);
            __p.push('            <img src="');
_p(thumb_url);
__p.push('"/>');

                }
            __p.push('            <em>');
_p(text.text(text.smart_sub(note_name,note_name_len,"...")));
__p.push('</em>\r\n\
\r\n\
            <p>');
_p(date_time.timestamp2date_ymdhm(file.get_mtime() || new Date()));
__p.push('</p>\r\n\
        </div>\r\n\
    </dd>');

    });
    __p.push('');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="g-empty sort-note-empty j-note-empty" style="display: none;">\r\n\
        <div class="empty-box" tabindex="0">\r\n\
            <div class="ico"></div>\r\n\
            <p data-id="title" class="title">暂无笔记</p>\r\n\
\r\n\
            <p data-id="content" class="content">您可以通过“新建笔记”进行添加</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
},

'bar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <dt>');
_p(( data===1?'今天':( data===2?'昨天':( data ===3?'最近7天':'7天前' ) ) ));
__p.push('</dt>');

return __p.join("");
},

'note_remark': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-pop-content">\r\n\
        <div class="mod-dirbox">\r\n\
            <textarea class="note-remark-textarea" id="_note_remark_comment_textarea"></textarea>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'note_upload_pic_mask': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="full-pop full-pop-medium" style="width:400px;left:550px;top:400px;margin-left: 0;margin-top: 0;">\r\n\
        <h3 class="full-pop-header"><div class="inner">上传照片</div></h3>\r\n\
        <div class="full-pop-content">\r\n\
            <div class="mod-note mod-note-loading">\r\n\
                <div class="header">\r\n\
                    <i class="ico"></i>\r\n\
                    <h3 class="title">正在上传...</h3>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <a href="#" class="full-pop-close" title="关闭" id="note_upload_pic_mask_close">×</a>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
