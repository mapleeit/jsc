/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午10:33
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),
		$ = require('$'),

		inherit = lib.get('./inherit'),
		console = lib.get('./console'),
		Event = lib.get('./Event'),
		cookie = lib.get('./cookie'),
		constants = common.get('./constants'),
		request = common.get('./request'),
		logger = common.get('./util.logger'),
		query_user = common.get('./query_user'),
		ret_msgs = common.get('./ret_msgs'),
		record = require('./record'),
		widgets = common.get('./ui.widgets'),
		mini_tip = common.get('./ui.mini_tip'),
		progress = common.get('./ui.progress'),
		global_event = common.get('./global.global_event'),
		https_tool = common.get('./util.https_tool'),
		update_cookie = common.get('./update_cookie'),
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
		constructor: function(cfg) {
			$.extend(this, cfg);
			window.call_save_note = this.on_save_note;
			window.call_save_article = this.on_save_article;
			window.call_save_upload_pic = this.on_save_upload_pic;
			window.call_close_note_pic_upload_mask = this.on_close_note_pic_upload_mask;
			window.call_note_show_tip = this.on_note_show_tip;
			this.bind_events();
		},

		load_files: function(is_refresh) {
			var me = this;
			me.loader._load_done = false;
			me.loader.load_list(is_refresh);
		},

		bind_events: function() {
			var me = this;
			me.listenTo(me.view, 'action', function(action_name, e) {
				this.process_action(action_name, e);
			});
			me.listenTo(me.toolbar, "action", function(action_name, e) {
				this.process_action(action_name, e);
			});

			me.listenTo(me.loader, "load_list", function(records, is_refresh) {
				this.on_load_list(records, is_refresh);
			});

			me.listenTo(me.loader, "show_note", function(record) {
				this.show_note(record);
			});

			me.listenTo(me.loader, "error", function(msg, ret) {
				mini_tip.error(msg);
			});
			me.listenTo(me.loader, "show_load_more", function() {
				me.view.get_$load_more().show();
			});
			me.listenTo(me.loader, "hide_load_more", function() {
				me.view.get_$load_more().hide();
			});
			me.listenTo(global_event, "note_list_refresh", function(note_item) {
				var me = this;
				if(note_item == null) {
					note_item = window.current_record_note
				}
				me.store.remove(note_item);
				me.store.add(note_item, 0, true);
				note_item.set_save_status("", true);
				me.view.get_scroller().to(0);
				this.refresh();

			});
			me.listenTo(global_event, "remark_article", function() {
				this.do_save_article();
			});
			me.listenTo(global_event, "_note_upload_pic_mask", function() {
				this.do_save_upload_pic();
			});

			me.listenTo(global_event, "close_note_pic_upload_mask", function() {
				this.do_close_note_pic_upload_mask();
			});

			me.listenTo(global_event, "note_timing_save", function() {
				timing_save_id = setInterval(function() {
					me.auto_save_note();
				}, 1000 * 10);
			});
			me.listenTo(global_event, "note_stop_timing_save", function() {
				clearInterval(timing_save_id);
			});
		},

		// 分派动作
		process_action: function(action_name, e) {
			var fn_name = 'on_' + action_name;
			if(typeof this[fn_name] === 'function') {
				this[fn_name]();
			}
			if(e) {
				e.preventDefault();
			}
			// 不再触发recordclick
			return false;
		},

		//清除cookie，测试所用
		on_clear: function() {
			if(!this.toolbar.is_debug) {
				return;
			}

			var cookie_options = {
				domain: constants.MAIN_DOMAIN,
				path: '/'
			};
			$.each(['skey', 'clientuin', 'wx_login_ticket', 'p_skey', 'indep','lskey', 'p_uin', 'access_token' /*, 'openid', 'key_type', 'wy_appid'*/], function (i, key) {
				cookie.unset(key, cookie_options);
			});
			mini_tip.warn('清除cookie成功');
		},

		on_delete: function() {
			var me = this;
			var records = me.view.get_selected_files();
			if(records.length >= 1) {
				me.do_delete(records);
			} else {
				mini_tip.warn('请选择笔记');
			}

		},

		on_create: function() {

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
			if(me.store.size() == 0 || me.store.get(0).get_id() != "") {
				//新增记录以后重绘整个列表
				me.store.add(_new_note, 0);
				me.refresh();
				me.view.clear_select();
				me.loader.trigger('show_note', _new_note);
				if(me.store.size() == 1) {
					me.view.on_datachanged();
				}
				_new_note.set("selected", true);
				me.view.get_scroller().to(0);
			}
		},

		on_refresh: function() {
			var me = this;
			me.load_files(true);
		},

		on_share: function() {
			var me = this;
			var records = me.view.get_selected_files();

			if(records.length == 0) {
				mini_tip.warn('请选择笔记');
				return
			}

			if(!share_enter) {
				require.async('share_enter', function(mod) {
					share_enter = mod.get('./share_enter');
					share_enter.start_share(records, true);
				});
			} else {
				share_enter.start_share(records, true);
			}
		},

		/**
		 * 执行删除笔记操作
		 * @param records
		 */
		do_delete: function(records) {
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

					}).fail(function(msg, ret) {
						if(ret_msgs.is_sess_timeout(ret)) {
							update_cookie.update(function() {
								_do_delete_note();
							});
						} else {
							me.trigger('error', msg, ret);
						}
					}).done(function(msg, ret) {
						//如果是登录态失效，不执行done中的内容，带之后刷新登录态后重试
						if(ret_msgs.is_sess_timeout(ret)) {
							return ;
						}
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
		on_load_list: function(records, is_refresh) {
			var me = this;
			if(me.store.size() == 0 || is_refresh) {
				me.store.load(records);
				//第一次进来默认展示第一条笔记
				if(records.length > 0 && !is_refresh) {
					records[0].set("selected", true);
					me.loader.load_detail(records[0]);
				} else if(records.length > 0 && is_refresh && window.current_record_note) {         //刷新操作
					if(window.current_record_note.get_id() == "") {  //新建笔记则重新插入到最前
						me.store.add(window.current_record_note, 0);
						me.refresh();
					} else {                                       //否则  直接显示第一条笔记 并滚动到顶部
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

		auto_save_note: function() {
			var current_record_note = window.current_record_note;
			if(current_record_note && current_record_note.get_notetype && current_record_note.get_notetype() == 2 && current_record_note.get_auto_save_status() !== 24402) {
				note_editor.contentWindow.CallJS_SaveFromWeiyun(current_record_note.get_id(), true);
			}
		},

		/**
		 * 保存笔记
		 * @param recordid
		 * @param noteitem
		 * @param autosave
		 */
		on_save_note: function(recordid, noteitem, autosave) {
			var me = this,
				current_record_note = (window.current_record_note);

			//这里对内容复杂的笔记内容，需求清除<br>标签的干扰，再进行比较
			var current_note_content = current_record_note.get_htmlcontent().replace(/<br\s*(\/)*>/g, ''),
				note_content = noteitem.content.replace(/<br\s*(\/)*>/g, '');

			if(current_note_content != note_content && current_record_note.get_id() == recordid) {
				if(noteitem.content.length >= MAX_CONTENTLENGTH) {
					mini_tip.warn('笔记内容字数超限，请另新建笔记');
					return;
				}
				//图片笔记保存逻辑
				if(noteitem.title == "" && noteitem.pics.length > 0) {
					noteitem.title = "图片笔记";
				} else if(noteitem.title == "") {
					noteitem.title = "新建笔记";
				}

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
				if(noteitem.pics.length > 10) {
					mini_tip.warn('笔记图片个数超过限制,请删除图片后再试,笔记保存失败');
					return;
				} else if(noteitem.pics.length > 0) {
					_thumb_url = noteitem.pics[0];
					//笔记图片URL还原代理前缀
					_thumb_url = _thumb_url.replace(/https?:\/\/h5\.weiyun\.com\/tx_tls_gate=/i, 'http://')
						.replace(/https?:\/\/proxy\.gtimg\.cn\/tx_tls_gate=/i, 'http://');
					_data['thumb_url'] = _thumb_url;
				} else {
					_data['thumb_url'] = "http://";         //后台接口,取消缩略图  传入http://字符串
				}

				if(current_record_note.get_id() != "") {
					_data['local_mtime'] = current_record_note.get_version();
					_data['note_id'] = current_record_note.get_id();
					_cmd = "NoteModify";
				}
				note_editor.contentWindow.CallJS_ChangeSaveState(current_record_note.get_id(), 1);     //1 按钮处于保存状态
				if(me._last_save_req) {//有请求未完成，则要先清除
					me._last_save_req.destroy();
				}
				me._last_save_req = request.xhr_post({
					url: default_url,
					cmd: _cmd,
					pb_v2: true,
					body: _data
				})
					.ok(function(msg, body) {
						current_record_note.set_save_status("note_saved");
						current_record_note.set_htmlcontent(noteitem.content);
						current_record_note.set_name(noteitem.title);
						current_record_note.set_version(body.diff_version);
						current_record_note.set_thumb_url(_thumb_url);
						if(_cmd == "NoteAdd") {
							current_record_note.set_id(body.note_id);
							note_editor.contentWindow.CallJS_ShowNote(current_record_note.get_id(), current_record_note.get_notetype(), current_record_note.get_htmlcontent());
						}
						setTimeout(function() {     //延迟刷新，　　实现笔记保存的动画效果。
							global_event.trigger("note_list_refresh", current_record_note);
						}, 100);
						if(autosave) {
							mini_tip.ok("自动保存成功");
						} else {
							mini_tip.ok("保存成功");
						}

					}).fail(function(msg, ret) {
						if(ret_msgs.is_sess_timeout(ret)) {
							update_cookie.update(function () {
								me.call_save_note(recordid, noteitem, autosave);
							});
						} else if(autosave) {
							current_record_note.set_auto_save_status(ret);
							mini_tip.error('保存失败:' + msg);
						} else {
							mini_tip.error('保存失败:' + msg);
						}
						logger.write([
							'pc_save_note error --------> recordid: ' + recordid,
							'pc_save_note error --------> notetype: ' + current_record_note.get_notetype(),
							'pc_save_note error --------> title: ' + noteitem.title,
							'pc_save_note error --------> _thumb_url: ' + _thumb_url,
							'pc_save_note error --------> msg: ' + msg,
							'pc_save_note error --------> err: ' + ret,
							'pc_save_note error --------> time: ' + new Date()
						], 'save_note_error', ret);
					}).done(function(msg, ret) {
						//如果是登录态失效，不执行done中的内容，带之后刷新登录态后重试
						if(ret_msgs.is_sess_timeout(ret)) {
							return;
						}

						note_editor.contentWindow.CallJS_ChangeSaveState(current_record_note.get_id(), 0);    //0 按钮恢复正常状态
					});
			}
		},

		/**
		 * 修改文章
		 */
		on_save_article: function() {
			global_event.trigger('remark_article');
		},

		do_save_article: function() {
			var me = this,
				current_record_note = (window.current_record_note);
			if(!me.dialog) {
				me.dialog = new widgets.Dialog({
					klass: 'full-pop-small',
					buttons: [
						'OK',
						'CANCEL',
						{ id: 'CLOSE', text: '关闭', klass: 'g-btn-gray', disabled: false, visible: false }
					],
					handlers: {
						OK: function() {
							var _rearktxt = me.view.get_note_article_comment().value;
							me.do_save_article_remark(_rearktxt);
						}
					}
				});
				me.dialog.set_content(tmpl.note_remark());
			}
			me.view.get_note_article_comment().value = current_record_note.get_article_comment();
			if(current_record_note.get_article_comment() != "") {
				me.dialog.set_title("修改备注");
			} else {
				me.dialog.set_title("增加备注");
			}
			me.dialog.show();
		},

		do_save_article_remark: function(remarkTxt) {
			var me = this;
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
			}).ok(function(msg, body) {
				current_record_note.set_save_status("note_saved");
				current_record_note.set_version(body.diff_version);
				current_record_note.set_article_comment(remarkTxt);
				if(note_article.contentWindow.remarkTxt) {
					note_article.contentWindow.remarkTxt(remarkTxt);
					me.dialog.hide();
					global_event.trigger("note_list_refresh", current_record_note);
					mini_tip.ok("修改成功");
					me.view.get_scroller().to(0);
				}
			}).fail(function(msg, ret) {
				if(ret_msgs.is_sess_timeout(ret)) {
					update_cookie.update(function() {
						me.do_save_article_remark(remarkTxt);
					});
				} else {
					current_record_note.set_save_status("");
					mini_tip.error('修改失败:' + msg);
				}
			}).done(function(msg, ret) {
			});
		},


		/**
		 * 上传图片弹窗
		 */
		on_save_upload_pic: function() {
			global_event.trigger('_note_upload_pic_mask');
		},

		do_save_upload_pic: function() {
			this.view.show_upload_pic_mask();
		},

		on_close_note_pic_upload_mask: function() {
			global_event.trigger('close_note_pic_upload_mask');
		},

		do_close_note_pic_upload_mask: function() {
			this.view.hide_upload_pic_mask();
		},

		/**
		 * 取消图片上传
		 */
		on_cancel_upload_pic: function() {
			if(this.get_note_editor().contentWindow.CallJS_CancelUploadPic) {
				this.get_note_editor().contentWindow.CallJS_CancelUploadPic();
			}
			if(this.get_note_editor().contentWindow.CallJS_UpdateImageUrl) {
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
		_contain: function(text, json) {
			for(var i = 0; i < json.length; i++) {
				if(text === json[i].note_id) {
					if(json[i].retcode === 0) {
						return true;
					}
					// 114300 表示服务端没有找到该数据， WEB端可认为是删除成功。
					if(json[i].retcode != 114300) {
						return false;
					} else {
						return true;
					}
				}
			}
			return true;
		},

		show_note: function(record) {
			var me = this,
				note_id = record.get_id(),
				notetype = record.get_notetype();
			if(window.current_record_note && window.current_record_note.get_id() == "") {          //. 将未保存的新建笔记内容缓存下来.
				try {
					var _html_content = me.get_note_editor().contentWindow.CallJS_GetNoteContent();
					window.current_record_note.set_htmlcontent(_html_content.content);
				} catch(e) {
				}
			}
			window.current_record_note = record;
			if(notetype != 1) {
				var htmlcontent = record.get_htmlcontent();
				me.view.get_note_article_frame().hide();
				me.view.get_note_editor_frame().show();
				if(me.get_note_editor().contentWindow && me.get_note_editor().contentWindow.CallJS_ShowNote) {
					me.get_note_editor().contentWindow.CallJS_ShowNote(note_id, notetype, htmlcontent);
				} else {
					//延迟显示
					setTimeout(function() {
						me.show_note(record);
					}, 1000);
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
		set_scroller: function(scroller) {
			this.scroller = scroller;
		},

		get_note_editor: function() {
			return note_editor || (note_editor = $('#_note_edit_frame')[0]);
		},

		get_note_article: function() {
			return note_article || (note_article = $('#_note_article_frame')[0]);
		},

		refresh: function() {
			var me = this;
			var records = me.store.data;
			me.view.$list.html(me.view.get_html(records));
			me.view.on_datachanged();
			me.view.trigger('refresh');
		}
	});
	return Mgr;
});