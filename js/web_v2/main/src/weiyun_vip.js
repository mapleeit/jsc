/**
 * 会员中心
 * @author xixinhuang
 * @date 2015-10-22
 */
define(function(require, exports, module) {
	var $ = require('$'),
		common = require('common'),

		remote_config = common.get('./remote_config'),
		Module = common.get('./module'),
		constants = common.get('./constants'),
		user_log = common.get('./user_log'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),

		tmpl = require('./tmpl'),
		vip_state,
		vip_icon,
		vip_date,
		vip_btn,
		vip_txt,
		undefined;

	return new Module('qzone_vip', {

		render: function() {
			vip_state = $('.j-vip-state');
			vip_icon = $('.j-vip-icon');
			vip_date = vip_state.find('.j-vip-date');
			vip_btn = vip_state.find('.j-vip-btn');
			vip_txt = vip_state.find('.j-vip-txt');
			query_user.on_ready(this.render_weiyun_vip, this);
		},

		render_weiyun_vip: function(user) {
			var weiyun_vip_info = user.get_weiyun_vip_info();
			if(weiyun_vip_info.weiyun_vip) {
				vip_icon.show();
				if(weiyun_vip_info.weiyun_end_time) {
					vip_date.html('会员&nbsp;' + this.get_expire_date(weiyun_vip_info.weiyun_end_time) + '&nbsp;到期');
				} else {
					vip_date.text('会员到期时间：按月支付中');
				}
				vip_txt.text('续费');
			} else {
				vip_icon.hide();
				vip_date.text('开通会员，尊享特权');
				vip_txt.text('开通');
				vip_state.addClass('fail');
			}
			vip_state.css('visibility', 'visible');

			vip_state.on('click', function(e) {
				e.stopPropagation();
				user_log('RECHARGE_QZONE_VIP');
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D1011');
			});

			vip_btn.on('click', function(e) {
				e.stopPropagation();
				user_log('RECHARGE_QZONE_VIP');
				var is_weixin_user = user.is_weixin_user && user.is_weixin_user(),
					from = is_weixin_user? 1025 : 1015;
				window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D' + from);
			});
		},

		get_expire_date: function(end_time) {
			var d = new Date(end_time);
			return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);
		}
	});
});