/**
 * 新手引导
 * @author xixinhuang
 * @date 2015-10-22
 */
define(function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        remote_config = common.get('./remote_config'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        tmpl = require('./tmpl'),

        undefined;

    return new Module('qzone_vip', {

        render: function(){
            query_user.on_ready(this.render_weiyun_vip, this);
        },

        render_weiyun_vip: function(user) {
            var weiyun_vip_info = user.get_weiyun_vip_info();

            var btn_text = '<i class="icon"></i>' + '会员中心';
            this._$vip = $(tmpl['qzone_vip']()).appendTo($('body').find('.diff-adright'));
            this._$vip.html(btn_text);

            this._$vip.on('click', function(e) {
                user_log('RECHARGE_QZONE_VIP');
                e.stopPropagation();
                window.open(constants.GET_WEIYUN_VIP_URL + 'from%3D1011');
            });
        },

        render_qzone_vip: function(user) {
            var qzone_info = user.get_qzone_info();

            var renew_type = (qzone_info && qzone_info['qzone_vip'])? '续费' : '开通',
                vip_type = (qzone_info && qzone_info['qzone_nf'])? '年费黄钻' : '黄钻',
                btn_text = '<i class="icon"></i>开通会员';
            this._$vip = $(tmpl['qzone_vip']()).appendTo($('body').find('.diff-adright'));
            this._$vip.html(btn_text);

            this._$vip.on('click', function(e) {
                user_log('RECHARGE_QZONE_VIP');
                e.stopPropagation();
                window.open(constants.GET_QZONE_VIP_URL);
            });

            //暂时不显示催费的banner，后续要显示再发布
            //if(!constants.IS_APPBOX && qzone_info && qzone_info['qzone_end_time']) {
            //    this.render_qzone_vip_banner(qzone_info);
            //}
        },

        render_qzone_vip_banner: function(qzone_info) {
            var expire_day = this.get_expire_day(qzone_info['qzone_end_time']);
            this._$vip_banner = $(tmpl['qzone_vip_banner']());
            this._$vip_banner.find('[data-name="expires_date"]').text(expire_day);

            var close_banner = this._$vip_banner.find('.icon-banner-close'),
                renew_btn = this._$vip_banner.find('.renew-btn'),
                lay_aside = $('body').find('.lay-aside'),
                me = this;

            close_banner.on('click', function() {
                me._$vip_banner.remove();
                e.stopPropagation();
                lay_aside.removeClass('hasBanner');
            });
            renew_btn.on('click', function() {
                user_log('RECHARGE_QZONE_VIP');
                e.stopPropagation();
                window.open(constants.GET_QZONE_VIP_URL);
            });

            lay_aside.addClass('hasBanner');
            lay_aside.before(this._$vip_banner);
        },

        get_expire_day: function(qzone_end_time) {
            var time = qzone_end_time - new Date().getTime(),
                day;
            if(time < 0){
                return 0;
            }
            day = parseInt(time / (24*60*60*1000));
            return day;
        }
    });
});