/**
 * 各操作实现
 * @author cluezhang
 * @date 2013-9-22
 */
define(function(require, exports, module) {
	var lib = require('lib'),
		inherit = lib.get('./inherit'),
		Event = lib.get('./Event'),

		console = lib.get('./console'),
		text = lib.get('./text'),
		routers = lib.get('./routers'),
		security = lib.get('./security'),

		common = require('common'),
		constants = common.get('./constants'),
		user_log = common.get('./user_log'),
		urls = common.get('./urls'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),

		progress = common.get('./ui.progress'),
		widgets = common.get('./ui.widgets'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		preview_dispatcher = common.get('./util.preview_dispatcher'),
		offline_event = common.get('./global.global_event').namespace('offline_download'),

		main = require('main').get('./main'),

		disk = require('disk'),
		Remover = require('./Remover'),

		$ = require('$');
	var Mgr = inherit(Object, {
		constructor: function(cfg) {
			$.extend(this, cfg);

			this.view.on('action', this.process_action, this);
			this.view.on('recordclick', this.handle_record_click, this);
			this.view.on('afterrender', this.init_operators, this);
		},
		init_operators: function() {
			var me = this;
			require.async('downloader', function(downloader) {
				me.downloader = downloader.get('./downloader');
			});
			require.async('file_qrcode', function(file_qrcode) {
				me.file_qrcode = file_qrcode.get('./file_qrcode');
			});
		},
		// 直接点击记录
		handle_record_click: function(node, event) {
			// 如果可预览，预览之
			var me = this;
			// 文档预览
			// 如果是可预览的文档，则执行预览操作
			if(preview_dispatcher.is_preview_doc(node)) {
				preview_dispatcher.preview(node);
				user_log('ITEM_CLICK_DOC_PREVIEW');
				return;
			}

			// 如果是图片，则执行预览操作
			if(node.is_image()) {
				me.appbox_preview(node).fail(function() {
					me.preview_image(node);
				});
				user_log('ITEM_CLICK_IMAGE_PREVIEW');
				return;
			}

			// 视频预览，
			// 如果是视频，则跳到云播页面进行播放
			if(node.is_video()) {
				window.open('//www.weiyun.com/video_preview?' +
					'videoID=' + node.get_id() +
					'&dirKey=' + node.get_pid() +
					'&pdirKey=34cc7db8f338fdcb41c5dfa52b9ed888');

				user_log('ITEM_CLICK_VIDEO_PREVIEW');
				return;
			}

			// 压缩包预览
			if(node.is_compress_file() && !($.browser.msie && $.browser.version < 8)) {
				me.preview_zip_file(node);                   // @see ui_virtual.js
				user_log('ITEM_CLICK_ZIP_PREVIEW');
				return;
			}

			// 目录则打开
			if(node.is_dir()) {
				me.on_open_folder(node, event);
				return;
			}

			// 如果不能，下载之
			this.on_download(node, event);
			event.preventDefault();
		},
		// 分派动作
		process_action: function(action_name, data, event, extra) {
			var fn_name = 'on_' + action_name;
			if(typeof this[fn_name] === 'function') {
				this[fn_name](data, event, extra);
			}
			event.preventDefault();
			// 不再触发recordclick
			return false;
		},

		on_enter: function(node, event) {
			this.handle_record_click(node, event);
		},
		// 删除
		on_delete: function(node, event) {
			this.do_delete(node);
			console.log('on_delete');
		},
		do_delete: function(node, callback, scope) {
			var me = this;
			this.remover = this.remover || new Remover();
			this.remover.remove_confirm([node]).done(function() {
				me.store.remove(node);
				me.store.total_length--;
				me.store.trigger('metachange');
				if(callback) {
					callback.call(scope, true);
				}
			});
		},
		// 下载
		on_download: function(node, event) {
			// 其他文件，下载
			var me = this;
			if(me.downloader) {
				me.downloader.down(node, event);
			}
			user_log('ITEM_CLICK_DOWNLOAD');
			console.log('on_download');
		},
		// 对于种子文件，点击"打开"，可以跳转离线下载
		on_offline_download: function(node, event, extra) {
			offline_event.trigger('menu_selected_offline_download', node);
		},
		//文件二维码
		on_qrcode: function(node, event, extra) {
			var me = this;
			var from_menu = extra.src === 'contextmenu';
			if(me.file_qrcode) {
				me.file_qrcode.show([node]);
			}

			if(from_menu) {
				user_log('FILE_QRCODE_SEARCH_RIGHT');
			} else {
				user_log('FILE_QRCODE_SEARCH_ITEM');
			}

		},
		// 分享
		on_share: function(record, event, extra) {
			require.async('share_enter', function(mod) {
				var share_enter = mod.get('./share_enter');
				share_enter.start_share(record);
				user_log('RIGHTKEY_MENU_SHARE');
			});
		},
		// 打开所属的目录
		//
		on_open_folder: function(node, event) {
			// 如果是相册，跳转并刷新
			if(node.is_in_album()) {
				main.async_render_module('photo', {reload: true});
				routers.replace({
					m: 'photo'
				}, true);
			} else {
				return this.do_open_folder(node, event);
			}
		},
		do_open_folder: function(node, event) {
			// 异步查询
			progress.show('正在打开');
			var dir_key = node.is_dir() ? node.get_id() : node.get_pid();
			request.xhr_get({
				url: 'http://web2.cgi.weiyun.com/user_library.fcg',
				cmd: 'LibDirPathGet',
				cavil: true,
				pb_v2: true,
				body: {
					dir_key: dir_key
				}
			}).ok(function(msg, body) {
				var path = [];
				if(body.items) {
					$.each(body.items, function(index, o) {
						path.push({
							name: o.dir_name,
							id: o.dir_key
						});
					});
				}
				path.shift();  // cgi返回的目录含微云根目录，不需要
				path.push([node.get_id()]); // 目标文件(夹)要高亮显示

				main.async_render_module('disk', {
					path: path
				});
				routers.replace({
					m: 'disk'
				}, true);
			})
				.fail(function(msg, ret) {
					mini_tip.error(msg);
				})
				.done(function() {
					progress.hide();
				});
		},
		/**
		 * 尝试使用 appbox 的全屏预览功能
		 * @param {FileNode} node
		 * @returns {jQuery.Deferred}
		 * @private
		 */
		appbox_preview: function(node) {
			var ex = window.external,
				def = $.Deferred(),
			// 判断 appbox 是否支持全屏预览
				support = constants.IS_APPBOX && (
					(ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
					(ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
					);

			if(support) {
				require.async('full_screen_preview', function(mod) {
					try {
						var full_screen_preview = mod.get('./full_screen_preview');
						full_screen_preview.preview(node);
						def.resolve();
					} catch(e) {
						console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
						def.reject();
					}
				});
			} else {
				def.reject();
			}
			return def;
		},

		/**
		 * 压缩包预览
		 * @param {FileObject} file
		 * @private
		 */
		preview_zip_file: function(file) {
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
		},

		/**
		 * 图片预览（重写 FileListUIModule 的默认实现）
		 * @overwrite
		 * @param {FileObject} file
		 * @private
		 */
		preview_image: function(file) {
			var me = this;

			require.async(['image_preview', 'downloader'], function(image_preview_mod, downloader_mod) {
				var image_preview = image_preview_mod.get('./image_preview'),
					downloader = downloader_mod.get('./downloader');
				// 当前目录下的图片
				var images = [];
				var read_images = function() {
					me.store.each(function(record) {
						if(record.is_image()) {
							images.push(record);
						}
					});
				};
				read_images();


				// 当前图片所在的索引位置
				var index = $.inArray(file, images);

				var options = {
					complete: me.store.is_complete(),
					total: images.length,
					index: index,
					images: images,
					load_more: function(callback) {
						// 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
						if(!me.store.is_complete()) { // 未加载，尝试加载之
							me.store.load_more().done(function() {
								images.splice(0, images.length);
								read_images();
								callback({
									'total': images.length,
									'complete': me.store.is_complete()
								});
							}).fail(function() {
								callback({ 'fail': true });
							});
						}
						//加载完了
						else {
							callback({
								'total': images.length,
								'complete': me.store.is_complete()
							});
						}
					},
					download: function(index, e) {
						var file = images[index];
						downloader.down(file, e);
					},
					/*remove: function (index, callback) {
					 var file = images[index];
					 me.do_delete(file, function(success){
					 if(success){
					 images.splice(index, 1);
					 }
					 callback();
					 });
					 },
					 code: function(index){
					 if(me.file_qrcode){
					 var file = images[index];
					 if(file){
					 me.file_qrcode.show([file]);
					 }
					 }
					 },*/
					share: function(index) {
						var file = images[index];
						if(file) {
							require.async('share_enter', function(mod) {
								var share_enter = mod.get('./share_enter');
								share_enter.start_share(file);
								user_log('RIGHTKEY_MENU_SHARE');
							});
						}
					}
				};
				image_preview.start(options);
			});
		}
	});
	return Mgr;
});