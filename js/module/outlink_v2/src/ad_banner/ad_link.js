/**
 * web分享页底部广告banner
 * @author xixinhuang
 * @date 2015-11-10
 */

define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),
        user_log = common.get('./user_log'),
        https_tool = common.get('./util.https_tool'),
        query_user = common.get('./query_user'),
        logger = common.get('./util.logger'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        uin = query_user.get_uin_num(),

        qboss_info,

        //block_uins = ['10001', '711029', '10321', '6508431', '10015', '10332', '542245351'], //头部广告显示 加上黑名单屏蔽 @hibincheng
        boad_id = 2425,

        undefined;

    var ad_link = {
        render: function() {
            var me = this;

            //if($.inArray(uin+'', block_uins) > -1) {//用户在黑名单中则不显示广告
            //    return;
            //}
            if(store.get_type() === 'note' || (store.get_type() == 'photo' && store.get_cur_node().get_kid_count() == 1)) {
                return;
            }

            if(qboss_info) {
                this._render_qboss_ad();
            } else {
                require.async('qboss', function(mod) {
                    qboss_info = mod.get('./qboss');
                    me._render_qboss_ad();
                });
            }
        },

        _render_qboss_ad: function() {
            var $container = $('#lay-main-con').length > 0? $('#lay-main-con') : $('#_outlink_body').parent(),
                share_info = store.get_share_info(),
                me = this;

            //当访客没有登录态时，就采用分享者的uin来代替
            uin = uin || share_info['share_uin'];

            qboss_info.get({
                board_id: boad_id,
                uin: uin
            }).done(function(repData){
                var ad;
                if(repData.data && repData.data.count > 0 && repData.data[boad_id] && (ad = repData.data[boad_id].items) && ad.length > 0){
                    if(ad[0] && ad[0].extdata) {
                        me._$ad = $(tmpl.ad_bottom()).appendTo($container);
                        me.trigger('show_ad');
                        me.init_ad_data(ad[0]);
                        qboss_info.report(me.opt);
                        me._bind_events();
                    }
                }
            }).fail(function(msg){
                //console.warn(msg);
            });
        },

        //保存广告数据
        init_ad_data: function(data) {
            var opt = {};
            opt.bosstrace = data.bosstrace;
            opt.extdata = JSON.parse(data.extdata);
            opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
            opt.from = 1;    //from：  1 pc， 2 wap， 3 手机
            opt.uin = uin;

            this.opt = opt;
        },

        show_ad: function() {
            this._$ad && this._$ad.show();
            this.trigger('show_ad');
        },

        hide_ad: function() {
            this._$ad && this._$ad.hide();
            this.trigger('hide_ad');
        },

        remove_ad: function() {
            this._$ad && this._$ad.remove();
            this.trigger('remove_ad');
        },

        _bind_events: function() {
            var me = this,
                close_btn = this._$ad.find('[data-id=ad_close]'),
                link = this._$ad.find('[data-id=ad_img]');
            close_btn && close_btn.on('click', function() {
                me.remove_ad();
                me.opt['qboper'] = 3;
                qboss_info.report(me.opt);
            });
            link && link.attr('src', this.opt.extdata['img']);
            link && link.on('click', function() {
                me.opt['qboper'] = 2;
                qboss_info.report(me.opt);
                me.remove_ad();
                window.open(me.opt.extdata['link']);
            });
        }
    }

    $.extend(ad_link, events);

    return ad_link;
});