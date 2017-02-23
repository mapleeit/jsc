/**
 * Created with JetBrains WebStorm.
 * User: iscowei
 * Date: 16-11-03
 * Time: 14:41
 */
define(function(require, exports, module) {
	var common = require('common'),
		File = common.get('./file.file_object'),
		functional = common.get('./util.functional'),

		view = require('./view'),
		upload_route = require('./upload_route');

	var offline_download_view = {
		get_html: function(upload_obj, view_id) {
			return {
				'view_id': view_id,
				'mask_width': '0',
				'li_class': 'waiting',
				'file_type': 'file',
				'full_name': upload_obj.file_name,
				'file_name': view.revise_file_name(upload_obj.file_name),
				'file_size': File.get_readability_size(upload_obj.file_size),
				'file_dir': upload_obj.file_dir
			};
		},
		start: function() {
			var me = this;
			me.get_click().hide();
			me.get_delete().css('display', 'inline-block');
			me.get_msg().html('离线下载中').show();
			me.get_percent_face().width('1%'); //显示进度百分比-样式
			me.set_cur_doing_vid();
		},
		wait: function() {
			var me = this;
			me.get_msg().html('排队中').show();
			me.get_click().hide();
			me.get_delete().css('display', 'inline-block');
			me.hide_error();
		},
		upload_file_update_process: function() {
			var me = this,
				upload_obj = me.get_upload_obj();
			if(!upload_obj) {
				return;
			}
			upload_obj.state = 'upload_file_update_process';
			var width = upload_obj.processed / upload_obj.file_size * 100;
			width = upload_obj.fix_percent(width);
			me.get_percent_face().width((width < 1 ? 1 : width) + '%');//显示进度百分比-样式
			me.get_msg().html(width + '%').show();//显示进度百分比-文本
		},
		/**
		 * 状态：错误
		 * */
		error: function() {
			var me = this,
				task = me.get_upload_obj();
			me.get_delete().css('display', 'inline-block');//可以删除
			me.get_click().hide();//默认不能再上传、暂停
			me.show_error(task.get_translated_error(upload_route.type === 'upload_form' ? 'tip' : null));//显示错误信息
			me.get_msg().text('');//隐藏进度信息
			me.get_file_size().text('');
			me.get_speed().hide();
			me.get_remain().text('');
			if(task.can_re_start()) {     //非本地校验出错 可以重试
				me.show_click('click_re_try');
			}
			me.get_percent_face().width('100%').hide(); //隐藏进度
			view.on_done_reset_scroll(me.v_id);
			me.clear_soft_link();
		}
	};

	return offline_download_view;
});