/**
 * 拉取微云目录结构树
 * @author bondli
 * @date 13-7-4
 */
define(function(require, exports, module) {
	var lib = require('lib'),
		common = require('common'),

		$ = require('$'),
		collections = lib.get('./collections'),
		console = lib.get('./console'),
		text = lib.get('./text'),
		events = lib.get('./events'),

		Module = common.get('./module'),

		disk_mod = require('disk'),
		disk = disk_mod.get('./disk'),
		file_list = disk_mod.get('./file_list.file_list'),
		file_node_from_cgi = disk_mod.get('./file.utils.file_node_from_cgi'),

		query_user = common.get('./query_user'),
		constants = common.get('./constants'),

		upload_route = require('./upload_route'),
		tmpl = require('./tmpl'),
		parse_file = common.get('./file.parse_file'),
		request = common.get('./request'),
		upload_event = common.get('./global.global_event').namespace('upload2'),


		offline_download,
		FileNode,

		long_long_ago = '1970-01-01 00:00:00',

		file_box,

		undefined;

	var file_dir_list = new Module('file_dir_list', {

		render: function() {
			offline_download = require('./offline_download.offline_download_start');
		},

		/**
		 * 显示目录列表
		 * @param {jQuery|HTMLElement}
		 */
		show: function($container, selected_id, isNew) {
			this.render();

			//强行把原来选中的都去掉选中
			$container.find('a').removeClass('selected');

			if(!file_box || isNew) {
				file_box = new FileBox($container);
			}
			file_box.show(selected_id);
		},

		/**
		 * 隐藏目录列表
		 */
		hide: function() {
			if(file_box) {
				file_box.hide();
			}
		},

		/**
		 * 获取指定目录的子目录
		 * @param {String} node_par_id
		 * @param {String} node_id
		 * @param {Number} level
		 */
		load_sub_dirs: function(node_par_id, node_id, level) {
			var me = this;

			me.trigger('before_load_sub_dirs', node_id);

			request.xhr_get({
				url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
				cmd: 'DiskDirBatchList',
				cavil: true,
				resent: true,
				pb_v2: true,
				body: {
					pdir_key: node_par_id,
					dir_list: [
						{
							dir_key: node_id,
							get_type: 1
						}
					]
				}
			})
				.ok(function(msg, body) {

					var result = body['dir_list'][0],
						retcode = result['retcode'],
						dirs;
					if(!retcode) {
						dirs = result['dir_list'];
						dirs = file_node_from_cgi.dirs_from_cgi2(dirs);
						me.trigger('load_sub_dirs', dirs, node_id, level);
					} else {
						var msg = result.retmsg || ret_msgs.get(retcode);
						me.trigger('load_sub_dirs_error', msg, retcode);
					}

				})
				.fail(function(msg, ret) {
					me.trigger('load_sub_dirs_error', msg, ret);
				})
				.done(function() {
					me.trigger('after_load_sub_dirs', node_id);
				});
		}
	});

	/**
	 * 目录对话框
	 * @constructor
	 */
	var FileBox = function($container) {

		var me = this;

		me._chosen_id = me._chosen_par_id = null;

		var root_dir = file_list.get_root_node();
		var par_id = root_dir.get_parent().get_id();
		//根目录ID
		this.root_id = root_dir.get_id();

		me._$el = $(tmpl.file_box({
			root_dir: root_dir,
			par_id: par_id,
			is_root: true//标识是根目录
		})).appendTo($container);

		// 点击目录名选中并展开
		me._$el.off('click', 'li[data-file-id]').on('click', 'li[data-file-id]', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var $dir = $(e.target).closest('[data-file-id]'),
				par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),
				level = parseInt($dir.attr('data-level'));
			if(dir_id === me.root_id) {//根目录不折起来 todo ku2.0
				me.set_chosen(par_id, dir_id);
				return;
			}
			if(dir_id !== "-1") {//相册返回
				me.toggle_expand($dir, level);
			}
			me.set_chosen(par_id, dir_id);
		});

		// 显示对话框时，监听拉取子目录列表事件
		file_dir_list.off('load_sub_dirs').on('load_sub_dirs', function(dir_nodes, par_id, level) {
			me.render_$dirs_dom(dir_nodes, par_id, level);
		});
		file_dir_list.off('before_load_sub_dirs').on('before_load_sub_dirs', function(dir_id) {
			me.mark_loading(dir_id, true);
		});
		file_dir_list.off('after_load_sub_dirs').on('after_load_sub_dirs', function(dir_id) {
			// 标记当前的选择
			if(me._chosen_id) {
				me.get_$node(me._chosen_id).children('a').addClass('selected');
			}
			// 计算宽度，判断是否超出，如果超出增加左右滚动条
			var $node = me.get_$node(me._chosen_id);
			if(!$node[0]) {//选中ID没有被加载过(网盘默认目录上传)
				me.mark_loading(dir_id, false);
				return;
			}
			var bar_width = ($.browser.chrome) ? 10 : 18;
			var container_width = $('#_offline_download_dialog .dirbox-tree').width() - bar_width,
				$cur_a = $node.children('a'),
				cur_span_width = $cur_a.children('span')[0].offsetWidth,
				total_width = parseInt($cur_a.css('paddingLeft'), 10) + cur_span_width;

			//展开了，需要读取下级目录
			if($cur_a.hasClass('expand')) {
				var $lis = $cur_a.siblings('ul').children('li');
				var lis_widths = [];
				$.each($lis, function(i, n) {
					var tmp = parseInt($(n).children('a').css('paddingLeft'), 10) + $(n).children('a').children('span')[0].offsetWidth;
					lis_widths.push(tmp);
				});
				var total_width = Math.max.apply(null, lis_widths);
			}

			var $tree = $('#_offline_download_dialog ._tree')[0];
			if($tree) {
				if(total_width > container_width) {
					$tree.style.width = total_width + 'px';
				}
				else {
					$tree.style.width = container_width + 'px';
				}
			}
			me.mark_loading(dir_id, false);
		});

		// 选择目录前的判断
		me.off('chosen').on('chosen', function(par_id, dir_id) {
			var cur_node = file_list.get_cur_node(),
				cur_dir_id = cur_node ? cur_node.get_id() : undefined;

			// 选中的节点DOM
			var $node = this.get_$node(dir_id),
				dir_paths = $.map($node.add($node.parents('[data-dir-name]')), function(node) {
					return $(node).attr('data-dir-name');
				}),
			//增加路径ID数组
				dir_id_paths = $.map($node.add($node.parents('[data-file-id]')), function(node) {
					return $(node).attr('data-file-id');
				});

			//派发事件
			offline_download.trigger('selected', par_id, dir_id, dir_paths, dir_id_paths);
		});
	};

	FileBox.prototype = $.extend({

		parse_file_node: function(obj) {
			if(!FileNode) {
				FileNode = require('disk').get('./file.file_node');
			}
			return obj && new FileNode(parse_file.parse_file_attr(obj));
		},

		show: function(selected_id) {
			this._chosen_id = selected_id;
			var root_dir = file_list.get_root_node(),
				root_id = root_dir.get_id(),
				root_par_id = root_dir.get_parent().get_id();
			this.expand_load(root_par_id, root_id, 0);
		},

		hide: function() {
			var root_dir = file_list.get_root_node(),
				root_id = root_dir.get_id();
			this.get_$node(root_id).children('ul').remove();
		},

		/**
		 * 渲染子目录DOM
		 * @param {Array<File>} dirs
		 * @param {String} dir_par_id
		 * @param {Number} level
		 */
		render_$dirs_dom: function(dirs, dir_par_id, level) {
			var me = this,
				$dir = this.get_$node(dir_par_id);
			if($dir[0]) {

				$dir.children('ul').remove();

				// 箭头。
				var $arrow = $dir.children('a');
				if(dirs.length > 0) {

					// 标记节点为已读取过
					$dir.attr('data-loaded', 'true');

					// 插入DOM
					var $dirs_dom = $(tmpl.file_box_node_list({
						files: dirs,
						par_id: dir_par_id,
						level: level
					}));

					//默认是相册的时候不需要展开
					if(me._chosen_id != constants.UPLOAD_DIR_PHOTO) {
						// 箭头
						$arrow.addClass('expand');
						// 展开
						$dirs_dom.hide().appendTo($dir).slideDown('fast');
					}
					else {
						// 箭头
						$arrow.removeClass('expand');
						// 不展开
						$dirs_dom.hide().appendTo($dir);
					}
				}
				// 没有子节点就
				else {
					// 隐藏箭头（如果移除箭头会导致滚动条抖一下）
					$arrow.children('.ui-text').children('._expander').css('visibility', 'hidden');
				}
			}
		},

		/**
		 * 展开节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 * @param {Number} level
		 */
		expand_load: function(par_id, dir_id, level) {
			file_dir_list.load_sub_dirs(par_id, dir_id, level);
		},

		/**
		 * 展开、收起文件夹
		 * @param {jQuery|HTMLElement} $dir
		 * @param {Number} level
		 */
		toggle_expand: function($dir, level) {
			$dir = $($dir);

			var par_id = $dir.attr('data-file-pid'),
				dir_id = $dir.attr('data-file-id'),

				$ul = $dir.children('ul'),
				loaded = 'true' === $dir.attr('data-loaded');

			// 已加载过
			if(loaded) {
				var $arrow = $dir.children('a'),
					expanded = $arrow.is('.expand');

				if(expanded) {
					$ul.stop(false, true).slideUp('fast', function() {
						$arrow.removeClass('expand');
					});
				} else {
					$ul.stop(false, true).slideDown('fast');
					$arrow.addClass('expand');
				}
			}
			else {
				// 有 UL 节点表示已加载
				this.expand_load(par_id, dir_id, level);
			}
		},

		/**
		 * 设置指定节点ID为已选中的节点
		 * @param {String} par_id
		 * @param {String} dir_id
		 */
		set_chosen: function(par_id, dir_id) {
			if(this._chosen_id === dir_id && this._chosen_par_id === par_id) {
				return;
			}

			// 清除现有的选择
			if(this._chosen_id) {
				this.get_$node(this._chosen_id).children('a').removeClass('selected');
			}

			this._chosen_id = dir_id;
			this._chosen_par_id = par_id;
			this.get_$node(dir_id).children('a').addClass('selected');

			this.trigger('chosen', par_id, dir_id);
		},

		get_$node: function(dir_id) {
			return $('#_file_box_node_' + dir_id);
		},

		mark_loading: function(dir_id, loading) {
			if(dir_id == constants.UPLOAD_DIR_PHOTO) {
				return;
			}
			this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
		}

	}, upload_event);

	return file_dir_list;
});