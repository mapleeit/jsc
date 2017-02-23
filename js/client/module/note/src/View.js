/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),

		inherit = lib.get('./inherit'),
		console = lib.get('./console'),
		View = lib.get('./data.View'),
		Event = lib.get('./Event'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),
		ContextMenu = common.get('./ui.context_menu'),
		tmpl = require('./tmpl'),
		widgets = common.get('./ui.widgets'),
		center = common.get('./ui.center'),
		user_log = common.get('./user_log'),
		huatuo_speed = common.get('./huatuo_speed'),
		padding_left = 10,
		scroller,
		undefined;

	var File_view = inherit(View, {

		list_selector: '#_note_view_list>#_note_files',
		item_selector: 'dd[data-file-id]',
		action_property_name: 'data-action',
		_select_items_cnt: 0,//已勾选的文件个数


		list_tpl: function() {
			return tmpl.note_list();
		},

		tpl: function(file) {
			return tmpl.note_item([file]);
		},

		get_html: function(files) {
			return tmpl.note_item(files);
		},

		get_record_by_id: function(id) {
			return this.store.get(id);
		},

		//插入记录，扩展父类
		on_add: function(store, records, index) {
			File_view.superclass.on_add.apply(this, arguments);

		},

		on_show: function() {
			this._activated = true;
		},

		on_hide: function() {
			this._activated = false;
		},

		is_activated: function() {
			return this._activated;
		},

		on_datachanged: function() {
			var me = this;
			File_view.superclass.on_datachanged.apply(this, arguments);
			if(this.store.size() === 0) {//无数据时，显示空白运营页
				this.get_$view_ct().addClass('ui-view-empty');
				this.get_$note_editor().hide();
				this.get_$view_list().hide();
			} else {
				me.get_$view_ct().removeClass('ui-view-empty');
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

		after_render: function() {
			File_view.superclass.after_render.apply(this, arguments);
			this.adjust_area();
			// 绑定右键
			this.on('recordcontextmenu', this.show_ctx_menu, this);
			// 点选，checkbox选择
			this.on('recordclick', this._handle_item_click, this);
			// 绑定按钮
			this.on('action', this._handle_action, this);
		},
		show_ctx_menu: function(record, e) {
			e.preventDefault();
			var menu,
				items,
				me = this,
				$target_item = $(e.target).closest(me.item_selector);
			var x = e.pageX,
				y = e.pageY;
			if(record) {
				if(!record.get('selected')) {
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
			items.push({
				id: 'share',
				text: '分享',
				icon_class: 'ico-share',
				click: default_handle_item_click
			});
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
				switch(this.config.id) {
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

		_handle_action: function(action, record, e) {
//            switch (action) {
//                case 'contextmenu':
//                    this.show_ctx_menu(record, e);
//                    break;
//            }
		},

		_handle_item_click: function(record, e) {
			e.preventDefault();
			var me = this;
			if(!e.ctrlKey) {
				me.clear_select();
				if(record.get('item_htmltext') || record.get('item_article') || record.get_id() == "") {
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
		clear_select: function() {
			var store = this.store;
			store.each(function(item) {
				if(item.get('selected')) {
					item.set('selected', false);
				}
			});
		},
		/**
		 * 获取已选择的列表项
		 * @returns {Array}
		 */
		get_selected_files: function() {
			var store = this.store,
				selected_files = [];
			$.each(store.data, function(i, item) {
				if(item.get('selected')) {
					selected_files.push(item);
				}
			});

			return selected_files;
		},

		get_scroller: function() {
			if(!scroller) {
				var Scroller = common.get('./ui.scroller');
				scroller = new Scroller(this.get_$view_list());
			}
			return scroller;
		},

		get_$main: function() {
			return this._$main || (this._$main = $('#_main_content'));
		},

		get_$main_bar1: function() {
			return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
		},

		get_$view_list: function() {
			return this.$view_list || (this.$view_list = $('#_note_view_list'));
		},

		get_$view_ct: function() {
			return this.$view_ct || (this.$view_ct = $('#_note_body'));
		},

		get_$load_more: function() {
			return this.$load_more || (this.$load_more = $('#note_load_more'));
		},

		get_$note_editor: function() {
			return this.$note_editor || (this.$note_editor = $('#_note_editor'));
		},

		get_note_editor_frame: function() {
			return this.$note_editor_frame || (this.$note_editor_frame = $(tmpl.note_edit_frame()).appendTo(this.get_$note_editor()));
		},
		get_note_article_frame: function() {
			return this.note_article_frame || (this.note_article_frame = $(tmpl.note_article_frame()).appendTo(this.get_$note_editor()));
		},

		get_note_article_comment: function() {
			return this.note_remark_comment_textarea || (this.note_remark_comment_textarea = $("#_note_remark_comment_textarea")[0]);
		},

		get_note_pic_upload_mask: function() {
			return this.note_pic_upload_mask || (this.note_pic_upload_mask = "");
		},


		shortcuts: {
			selected: function(value, view) {
				$(this).toggleClass('ui-selected', value);
			}
		},
		on_update: function(store, record, olds) {
			if(!this.rendered) {
				return;
			}
			var index = this.store.indexOf(record);
			var $dom = $(this.get_$view_list().find('dd')[index]);
			var can_shortcut_update = olds && (typeof olds === 'object'),
				shortcuts = this.shortcuts,
				name;
			// 判断是否都能快捷更新
			if(can_shortcut_update) {
				for(name in olds) {
					if(olds.hasOwnProperty(name)) {
						if(!shortcuts.hasOwnProperty(name)) {
							can_shortcut_update = false;
							break;
						}
					}
				}
			}
			if(can_shortcut_update) {
				for(name in olds) {
					if(olds.hasOwnProperty(name)) {
						shortcuts[name].call($dom, record.get(name), this, record);
					}
				}
			} else { // 如果不能，直接全量更新html
				$dom.replaceWith(this.get_html([record]));
			}
			this.adjust_area();
			this.trigger('update');
		},

		//上传团片mask
		show_upload_pic_mask: function() {
			this.get_note_upload_pic_mask().stop(false, true).fadeIn('fast');
			center.listen(this.get_note_upload_pic_mask());
			widgets.mask.show('note_pic_upload', this, true);
			this.get_note_upload_pic_mask().show();
		},

		hide_upload_pic_mask: function() {
			widgets.mask.hide('note_pic_upload');
			this.get_note_upload_pic_mask().hide();
		},

		get_note_upload_pic_mask: function() {
			var me = this;
			if(!me.note_upload_pic_mask) {
				me.note_upload_pic_mask = $(tmpl.note_upload_pic_mask()).appendTo(document.body).hide();
				me.get_$note_upload_pic_mask_close().bind('click', function() {
					me.hide_upload_pic_mask();
					me.trigger('action', 'cancel_upload_pic');
					return false;
				});
			}
			return me.note_upload_pic_mask
		},

		get_$note_upload_pic_mask_close: function() {
			return this.$note_upload_pic_mask_close || (this.$note_upload_pic_mask_close = this.get_note_upload_pic_mask().find('#note_upload_pic_mask_close'));
		},

		/**
		 * 同步编辑器大小以撑满内容区
		 */
		sync_editor_size: function() {
			var me = this,
				$editor = me.get_note_editor_frame();
			var height = $(window).height();
			$editor.height(height - 50); //减去底部宽度
			try {
				if($editor && $editor[0] && $editor[0].contentWindow && $editor[0].contentWindow.CallJS_ResizeExitorArea) {
					$editor[0].contentWindow.CallJS_ResizeExitorArea(height - 50, $editor.width());
					me.adjust_area();
				} else {
					setTimeout(function() {
						me.sync_editor_size();
						me.adjust_area();
					}, 300);
				}
			} catch(e) {

			}
		},

		adjust_area: function() {
			this.get_$view_ct().css('overflow', 'hidden');
			this.get_$main_bar1().children().css('padding-left', padding_left + 'px');
			this.get_$main().find('.inner').css('padding-left', padding_left + 'px');
			var bar_height = this.get_$main_bar1().height(),
				win_height = $(window).height(),
				height = win_height - bar_height - 25;
			this.get_$main().css('height', height + 'px');
			this.get_note_editor_frame().css('height', height + 'px');
		}

	});
	return File_view;
});