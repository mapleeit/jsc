/**
 * 离线下载模块
 * @author iscowei
 * @date 2016-09-29
 */
define(function(require, exports, module) {
	var $ = require('$'),
		lib = require('lib'),
		common = require('common'),

		text = lib.get('./text'),
		Module = common.get('./module'),
		widgets = common.get('./ui.widgets'),
		logger = common.get('./util.logger'),
		toast = common.get('./ui.toast'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		ui_center = common.get('./ui.center'),
		constants = common.get('./constants'),
		query_user = common.get('./query_user'),
		offline_event = common.get('./global.global_event').namespace('offline_download'),

		tmpl = require('./tmpl'),
		validata = require('./upload_file_validata.upload_file_validata'),
		upload_static = require('./tool.upload_static'),
		file_dir_list = require('./offline_download.file_dir_list'),
		offline_download = require('./offline_download.offline_download'),

		//扩展模块
		main = require('main').get('./main'),
		main_ui = require('main').get('./ui'),
		disk = require('disk').get('./disk'),
		file_list = require('disk').get('./file_list.file_list'),
		undefined;

	var	cur_user = query_user.get_cached_user() || {},
		coupon_count = 0,
		per_node_id,
		cur_node_id,
		cur_node_path,
		interval,
		save_lock = false,
		parse_lock = false,
		TIP_TEXT = '会员专享离线下载';

	var stop_prop_default = function(e) {//阻止默认行为和冒泡
		e.preventDefault();
		e.stopImmediatePropagation();
	};

	var offline_download_start = new Module('offline_download.offline_download_start', {
		init: function() {
			var me = this;

			//接收右键菜单离线下载事件
			offline_event.off('menu_selected_offline_download').on('menu_selected_offline_download', function(node) {
				me.destroy();
				if(node) {
					//关闭操作栏
					main_ui.toggle_edit(false);
					//拉取离线下载试用券
					upload_static.get_od_info().done(function(res) {
						coupon_count = res.coupon_count;

						toast.loading('正在解析种子文件...');
						me.torrent = {
							name: node.get_name(),
							size: node.get_size(),
							lastModified: node.get_modify_time()
						};
						offline_download.parse_weiyun_torrent(node).done(function(result) {
							toast.hide();
							me.torrent_info = result;
							me.select_file();
						}).fail(function(result) {
							toast.tips(result.msg, 3);
							me.report_error('offline_download_parse_weiyun_torrent', result.msg, result.ret || 2001004, null, result);
						});
					}).fail(function(msg, ret, body, header) {
						mini_tip.error(msg);
					});
					pvClickSend && pvClickSend('weiyun.offline.menu');
				} else {
					toast.tips('文件读取失败，请重试', 3);
				}
			});

			me.get_task_list();
			interval = setInterval(me.get_task_list, 30000);
		},

		//拉取任务列表
		get_task_list: function() {
			var me = this;
			offline_download.get_task_list().done(function(result) {
				if(result.task_list && result.task_list.length) {
					offline_event.trigger('update_task', result.task_list);
				}
			}).fail(function(result) {
				me.report_error('offline_download_get_task_list', result.msg, result.ret || 2001031, null, result);
			});
		},

		//获取当前网盘路径
		get_current_path: function() {
			var node,
				node_id,
				per_node_id,
				node_name,
				path = ['微云'],
				path_name;

			if (disk.is_rendered() && disk.is_activated()) {
				node = file_list.get_cur_node();
				//判断是否虚拟目录,是虚拟目录强制回到根目录
				if ( node && node.is_vir_dir() ) {
					node = file_list.get_root_node();
				}
				node_id = node.get_id();
				per_node_id = node.get_parent().get_id();
				node_name = node.get_name();
			} else {
				node_id = query_user.get_cached_user().get_main_key();
				per_node_id = query_user.get_cached_user().get_root_key();
				node_name = query_user.get_cached_user().get_main_dir_name();
			}

			if( node_name == '微云' || node_name == '网盘' ){
				path = ['微云'];
			} else {
				while(node_name != '微云' && node_name != '网盘') {
					path.push(node_name);
					node = node.get_parent();
					node_name = node.get_name();
				}
			}

			path_name = $.isArray(path) ? path.join('\\') : path;

			return {
				path_name: path_name,
				node_id: node_id,
				per_node_id: per_node_id
			};
		},

		//选择离线下载种子文件 & 添加磁力链接
		select_torrent: function() {
			var me = this,
				$el = tmpl.offline_download();
			me.dialog = new widgets.Dialog({
				title: '离线下载',
				empty_on_hide: true,
				destroy_on_hide: true,
				content: $el,
				tmpl: tmpl.offline_download_dialog,
				klass: 'pop-offline-select',
				mask_ns: 'gt_4g_tips',
				buttons: [
					{id: 'OK', text: '保存', klass: 'g-btn g-btn-blue j-parse-magnet', visible: false},
					{id: 'CANCEL', text: '取消', klass: 'g-btn g-btn-gray j-offline-cancel', visible: true}
				]
			});
			me.dialog.show();
			//当关闭或者隐藏的时候
			me.listenTo(me.dialog, 'hide', function () {
				file_dir_list.hide();
			});

			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			var el = me.dialog.get_$el(),
				okBtn = el.find('.j-parse-magnet'),
				cancelBtn = el.find('.j-offline-cancel'),
				tabs = el.find('[data-id=offline_tab]'),
				textNode = el.find('.j-offline-magnet'),
				tryNode = el.find('[data-id=try_tips]'),
				vipNode = el.find('[data-id=vip_tips]'),
				vipBtn = el.find('[data-action=open_vip]'),
				dir_change = el.find('[data-action=change_dir]'),
				dir_text = el.find('.j-offline-dir'),
				dir_tree = el.find('.j-tree-container'),
				tipsNode = is_vip ? vipNode : tryNode,
				countNode = tipsNode.find('[data-id=' + (is_vip ? 'vip' : 'try') + '_count]'),
				perDayNode = tipsNode.find('[data-id=use_count]'),
				dir_cur = me.get_current_path();

			dir_text.text(cur_node_path || '微云/离线下载');

			//定义一个选择的目录的事件
			offline_download_start.off('selected').on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ) {
				cur_node_id = pdir;
				per_node_id = ppdir;
				cur_node_path = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
				dir_text.text(cur_node_path);
			});

			//每日可用次数
			perDayNode.text(cur_user.get_od_count_per_day() || TIP_TEXT);
			//磁力链接
			okBtn.off('click').on('click', function(e) {
				var target = $(e.target);
				if(!target.hasClass('disabled')) {
					me.magnet = textNode.val().replace(/(^\s*)|(\s*$)/g, '');
					me.on_parse_magnet();
					pvClickSend && pvClickSend('weiyun.offline.magnet');
				}
			});
			//开通会员
			vipBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				var is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
					from = is_weixin_user? 1026 : 1021;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
				pvClickSend && pvClickSend('weiyun.offline.vip');
			});
			//tab
			tabs.off('click').on('click', function(e) {
				stop_prop_default(e);

				var elm = $(e.target).closest('[data-id=offline_tab]'),
					tab = elm.data('tab');
				tabs.each(function(i, t) {
					var node = $(t),
						nodeTab = node.data('tab');
					if(nodeTab === tab) {
						node.addClass('on');
						me.dialog.set_button_visible('OK', nodeTab !== 'bt');
						el.find('[data-id=offline_' + nodeTab + ']').show();
					} else {
						node.removeClass('on');
						el.find('[data-id=offline_' + nodeTab + ']').hide();
					}
					pvClickSend && pvClickSend('weiyun.offline.tab' + i);
				});
			});
			//取消
			cancelBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				me.dialog.hide();
				pvClickSend && pvClickSend('weiyun.offline.cancel');
			});
			//保存目录
			dir_change.off('click').on('click', function(e) {
				stop_prop_default(e);

				//加载目录列表
				file_dir_list.show(dir_tree, dir_cur.node_id, true);
				dir_change.hide();
				dir_tree.show();
				//调整选择框的位置
				ui_center.update(me.dialog.get_$el());
				pvClickSend && pvClickSend('weiyun.offline.dir_change');
			});
			//开通引导，使用次数
			me.dialog.set_button_enable('OK', false);
			textNode.off('change keyup paste').on('change keyup paste', function() {
				if(textNode.val().replace(/(^\s*)|(\s*$)/g, '') != '' && coupon_count > 0) {
					me.dialog.set_button_enable('OK', true);
				} else {
					me.dialog.set_button_enable('OK', false);
				}
			});
			if(coupon_count > 0) {
				el.find('[data-action=select_torrent]').off('click').on('click', function(e) {
					stop_prop_default(e);
					me.on_select();
				}).focus();
				perDayNode.text((is_vip ? cur_user.get_od_count_per_day() : ('您还可以试用离线下载' + coupon_count + '次')) || TIP_TEXT);
				countNode.text('(' + (is_vip ? '剩余' : '试用机会') + coupon_count + '次)');
			} else {
				el.find('[data-action=select_torrent] .btn-inner').addClass('disabled');
				perDayNode.text(is_vip ? ('今日使用已超过限制，请明日再试' || TIP_TEXT) : TIP_TEXT);
				countNode.text(is_vip ? '(次数用完)' : '(次数用完)');
			}
			if(is_vip) {
				tryNode.hide();
				vipNode.show();
			} else {
				vipNode.hide();
				tryNode.show();
			}
		},

		//校验选好的种子文件
		on_select: function() {
			var me = this;
			$('<input type="file" accept=".torrent, application/x-bittorrent" style="margin-left:-9999px">').appendTo(document.body).on('change', function(e) {
				var file = (e.target.files && e.target.files.length) ? e.target.files[0] : null,
					validator = validata.create(),
					ret;
				if(file) {
					validator.add_validata('check_name', file.name);
					validator.add_validata('check_torrent', file.name);
					ret = validator.run();
					if(ret) {
						mini_tip.error(ret[0]);
					} else {
						me.torrent = file;
						me.on_torrent_select();
					}
					pvClickSend && pvClickSend('weiyun.offline.select');
				} else {
					mini_tip.error('种子文件读取失败');
				}

				$(e.target).remove();
			}).click();
		},

		//发送磁力链接到后台解析文件信息
		on_parse_magnet: function() {
			var me = this, params;
			if(parse_lock) {
				return;
			}
			parse_lock = true;
			me.dialog.hide();
			if(me.magnet) {
				toast.loading('正在解析链接...');
				params = {
					url: me.magnet
				};
				if(cur_node_id && per_node_id) {
					params.is_default_dir = false;
					params.ppdir_key = per_node_id;
					params.pdir_key = cur_node_id;
				}
				offline_download.parse_magnet(params).done(function(result) {
					toast.hide();
					if(result && result.is_magnet_url) {
						me.torrent_info = result;
						me.select_file();
					} else {
						//http或电驴链接，不用选择文件直接加入任务列表
						toast.hide();
						me.destroy();
						//刷新网盘文件列表
						file_list.reload(false, false);
						//更新任务
						me.get_task_list();
						main_ui.show_manage_num();
					}
					parse_lock = false;
				}).fail(function(result) {
					toast.tips(result.msg, 3);
					me.report_error('offline_download_parse_magnet', result.msg, result.ret || 2001003, null, result);
					parse_lock = false;
				});
			} else {
				toast.tips('链接解析失败，请重试', 3);
				parse_lock = false;
			}
		},

		//上传种子文件到后台解析文件信息
		on_torrent_select: function() {
			var me = this;
			me.dialog.hide();
			if(me.torrent) {
				toast.loading('正在解析种子文件...');
				offline_download.parse_torrent(me.torrent).done(function(result) {
					toast.hide();
					me.torrent_info = result;
					me.select_file();
				}).fail(function(result) {
					toast.tips(result.msg, 3);
					me.report_error('offline_download_parse_torrent', result.msg, result.ret || 2001002, null, result);
				});
			} else {
				toast.tips('文件读取失败，请重试', 3);
				me.report_error('offline_download_parse_torrent', '种子文件读取失败', 2001001, null, {
					'torrent_name': me.torrent.name,
					'torrent_size': me.torrent.size
				});
			}
		},

		//选择种子里的文件确认离线下载
		select_file: function() {
			var me = this;
			var $el = tmpl.offline_file_select({
				torrent: me.torrent,
				magnet: me.magnet,
				files: me.torrent_info.file_list
			});

			me.dialog = new widgets.Dialog({
				title: '离线下载',
				empty_on_hide: true,
				destroy_on_hide: true,
				content: $el,
				tmpl: tmpl.offline_download_dialog,
				klass: 'pop-offline-download',
				mask_ns: 'gt_4g_tips',
				buttons: [
					{id: 'OK', text: '保存', klass: 'g-btn g-btn-blue j-add-task', visible: true},
					{id: 'CANCEL', text: '取消', klass: 'g-btn g-btn-gray j-offline-cancel', visible: true}
				]
			});
			me.dialog.show();
			//当关闭或者隐藏的时候
			me.listenTo(me.dialog, 'hide', function () {
				file_dir_list.hide();
			});

			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			var el = me.dialog.get_$el(),
				tryNode = el.find('[data-id=try_tips]'),
				vipNode = el.find('[data-id=vip_tips]'),
				tipsNode = is_vip ? vipNode : tryNode,
				countNode = tipsNode.find('[data-id=' + (is_vip ? 'vip' : 'try') + '_count]'),
				perDayNode = tipsNode.find('[data-id=use_count]');

			//每日可用次数
			perDayNode.text(cur_user.get_od_count_per_day() || TIP_TEXT);
			//开通引导，使用次数
			if(coupon_count > 0) {
				perDayNode.text((is_vip ? cur_user.get_od_count_per_day() : ('您还可以试用离线下载' + coupon_count + '次')) || TIP_TEXT);
				countNode.text('(' + (is_vip ? '剩余' : '试用机会') + coupon_count + '次)');
				me.dialog.set_button_enable('OK', true);
			} else {
				el.find('[data-action=select_torrent] .btn-inner').addClass('disabled');
				perDayNode.text(is_vip ? ('今日使用已超过限制，请明日再试' || TIP_TEXT) : TIP_TEXT);
				countNode.text(is_vip ? '(次数用完)' : '(次数用完)');
				me.dialog.set_button_enable('OK', false);
			}
			if(is_vip) {
				tryNode.hide();
				vipNode.show();
			} else {
				vipNode.hide();
				tryNode.show();
			}
			me.bind_select_file_event(el);
		},

		bind_select_file_event: function(wrap) {
			var me = this;
			var list = wrap.find('.j-offline-file'),
				all = wrap.find('[data-action=offline_select_all]'),
				dir_change = wrap.find('[data-action=change_dir]'),
				dir_text = wrap.find('.j-offline-dir'),
				dir_tree = wrap.find('.j-tree-container'),
				add_task = wrap.find('.j-add-task'),
				offline_cancel = wrap.find('.j-offline-cancel'),
				vipBtn = wrap.find('[data-action=open_vip]'),
				dir_cur = this.get_current_path();

			dir_text.text(cur_node_path || '微云/离线下载');

			//开通会员
			vipBtn.off('click').on('click', function(e) {
				stop_prop_default(e);
				var is_weixin_user = cur_user.is_weixin_user && cur_user.is_weixin_user(),
					from = is_weixin_user? 1026 : 1021;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
				pvClickSend && pvClickSend('weiyun.offline.vip');
			});
			//保存
			add_task.off('click').on('click', function(e) {
				stop_prop_default(e);
				var target = $(e.target);
				if(!target.hasClass('disabled')) {
					me.on_file_select();
					pvClickSend && pvClickSend('weiyun.offline.confirm');
				}
			});

			//取消
			offline_cancel.off('click').on('click', function(e) {
				stop_prop_default(e);
				me.dialog.hide();

				pvClickSend && pvClickSend('weiyun.offline.cancel');
			});

			//全选
			if(list.size() === wrap.find('.j-offline-file.act').size()) {
				all.data('act', 1).addClass('act');
			} else {
				all.data('act', 0).removeClass('act');
			}
			wrap.off('click').on('click', '[data-action=offline_select_all]', function(e) {
				stop_prop_default(e);

				if(parseInt(all.data('act')) === 0) {
					all.data('act', 1).addClass('act');
					list.data('act', 1).addClass('act');
				} else {
					all.data('act', 0).removeClass('act');
					list.data('act', 0).removeClass('act');
				}
			});

			//单选
			list.off('click').on('click', function(e) {
				stop_prop_default(e);

				var target = $(e.target).closest('.j-offline-file');
				if(!target.size()) {
					return;
				}

				if(parseInt(target.data('act')) === 0) {
					target.data('act', 1).addClass('act');
				} else {
					target.data('act', 0).removeClass('act');
				}

				if(list.size() === wrap.find('.j-offline-file.act').size()) {
					all.data('act', 1).addClass('act');
				} else {
					all.data('act', 0).removeClass('act');
				}
			});

			//选择目录
			dir_change.off('click').on('click',function(e) {
				stop_prop_default(e);

				//加载目录列表
				file_dir_list.show(dir_tree, dir_cur.node_id, true);
				dir_change.hide();
				dir_tree.show();
				//调整选择框的位置
				ui_center.update(me.dialog.get_$el());

				pvClickSend && pvClickSend('weiyun.offline.dir_change');
			});

			//定义一个选择的目录的事件
			offline_download_start.off('selected').on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ) {
				cur_node_id = pdir;
				per_node_id = ppdir;
				cur_node_path = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
				dir_text.text(cur_node_path);
			});
		},

		//确认要保存的离线文件，发起离起下载请求
		on_file_select: function() {
			//操作锁
			if(save_lock) {
				return;
			}
			save_lock = true;

			var me = this;
			var el = me.dialog.get_$el(),
				list = el.find('.j-offline-file.act'),
				torrent = me.torrent_info.file_list,
				files = [];

			for(var i=0, ilen=list.length; i<ilen; i++) {
				for(var j=0, jlen=torrent.length; j<jlen; j++) {
					if(parseInt($(list[i]).data('index')) === torrent[j].torrent_index) {
						files.push(torrent[j]);
						break;
					}
				}
			}

			if(files.length) {
				me.dialog.hide();
				toast.loading('正在添加离线任务...');
				offline_download.add_task({
					torrent_hex: me.torrent_info.torrent_hex,
					is_default_dir: (cur_node_id && per_node_id) ? false : true,
					dir_name: me.torrent_info.dir_name,
					ppdir_key: per_node_id || '',
					pdir_key: cur_node_id || '',
					file_list: files
				}).done(function() {
					save_lock = false;
					toast.hide();
					me.destroy();
					//刷新网盘文件列表
					file_list.reload(false, false);
					//更新任务
					me.get_task_list();
					main_ui.show_manage_num();
				}).fail(function(result) {
					save_lock = false;
					toast.tips(result.msg, 3);
					me.destroy();
					me.report_error('offline_download_add_task', result.msg, result.ret || 2001021, null, result);
				});
			} else {
				save_lock = false;
				mini_tip.error('请选择需要保存的离线文件');
			}
		},

		destroy: function() {
			var me = this;
			me.dialog = null;
			me.magnet = null;
			me.torrent = null;
			me.torrent_info = null;
			per_node_id = null;
			cur_node_id = null;
			cur_node_path = null;
		},

		start: function() {
			var me = this;
			var is_vip = cur_user.is_weiyun_vip && cur_user.is_weiyun_vip();
			me.destroy();

			//拉取离线下载试用券
			upload_static.get_od_info().done(function(res) {
				coupon_count = res.coupon_count;
				me.select_torrent();
			}).fail(function(msg, ret, body, header) {
				mini_tip.error(msg);
				me.report_error('offline_download_get_od_info', msg, ret, body, header);
			});

			pvClickSend && pvClickSend('weiyun.offline.enter');
		},

		report_error: function(mod, msg, ret, body, header) {
			var error = msg;
			try {
				error = JSON.stringify(header);
			} catch(e) {}
			logger.dcmdWrite([mod + ' error: --------> ' + error], 'offline_download_monitor', ret, 2);
		}
	});

	return offline_download_start;
});