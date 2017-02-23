/**
 * 头部链接广告
 * @hibincheng 2013-06-24
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls'),
        logger = common.get('./util.logger'),
        tmpl = require('./tmpl'),
        request = common.get('./request'),
        uin = query_user.get_uin_num(),

        install_app = require('./install_app.install_app'),

        qboss_info,

        //block_uins = ['10001','711029','10321','6508431','10015','10332','542245351'], //头部广告显示 加上黑名单屏蔽 @hibincheng

        undefined;

    var ad_link = {

        render : function() {
            var me = this;

            if(qboss_info) {
                this._render_qboss_ad();
            } else if(!constants.IS_APPBOX){
                require.async('qboss', function(mod) {
                    qboss_info = mod.get('./qboss');
                    me._render_qboss_ad();
                });
            } else if(constants.IS_APPBOX) {
                this._render_left_ad();
            }

            this._render_right_ad();
        },

        _render_left_ad: function(){
            var me = this;

            this._get_left_ad_data().done(function(data) {
                if(!data || data.length === 0) {
                    return;
                }

                if(data.length === 1) {
                    var item = data[0];
                    $(tmpl.ad_left_2({
                        title: item.bar_text,
                        bar_url: item.bar_go_url,
                        report_id: item.report_id || ''
                    })).appendTo($('#_head_ad_left'));
                } else if(data.length > 1) {
                    me.slide_left_ad(data);
                }
            });
        },

        /*
        * 多个公告则进行轮播，每个显示2分钟
        * */
        slide_left_ad: function(items) {
            var count = items.length,
                $container = $('#_head_ad_left'),
                time = 0,
                me = this;
            if(typeof this.toggle_count == 'undefined') {
                this.toggle_count = Math.round(Math.random() * 100) % count;
            } else {
                time = 1000 * 60 * 2;
            }

            setTimeout(function() {
                var item = items[me.toggle_count % count];
                $container.html('');
                $(tmpl.ad_left_2({
                    title: item.bar_text,
                    bar_url: item.bar_go_url,
                    report_id: item.report_id || ''
                })).appendTo($container);
                me.toggle_count++;
                me.slide_left_ad(items);
            }, time);
        },

        _get_left_ad_data: function() {
            var def = $.Deferred();

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
                cmd: 'WeiyunActGetActivity',
                pb_v2: true,
                re_try: 3,
                body: {
                    get_yellow_bar: true
                }
            }).ok(function(msg, body) {
                def.resolve(body.bar_items);
            }).fail(function(msg) {
                def.reject(msg);
            });

            return def;
        },

        _render_right_ad: function() {
            var me = this;
            require.async(constants.HTTP_PROTOCOL + '//imgcache.qq.com/qzone/qzactStatics/configSystem/data/65/config1.js', function(config_data) {
                if(!config_data) {
                    return;
                }

                $(tmpl.ad_right({
                    qzvip_enable: true,
                    text: '开通会员',//config_data.ad_right && config_data.ad_right.text,
                    link: 'http://wwww.weiyun.com/weiyun_vip.html',//config_data.ad_right && config_data.ad_right.link,
                    feedback_url: me.get_feedback_url()
                })).appendTo($('#_head_ad_right'));

                //反馈
                $('#_head_ad_right').on('click', function(e) {
                    e.preventDefault();
                    install_app.show_install_guide();
                });

                install_app.render(config_data);
            });
        },

        /*
        * 未加载到qboss广告，则显示微云的关注微信广告
        * */
        _render_install_app_ad: function() {
            var $ad_left = $('#_head_ad_left'),
                animate_timer;
            $ad_left.html('');
            $(tmpl.ad_left()).appendTo($ad_left);

            $ad_left.find('[data-id=qrcode]').hover(function() {
                clearTimeout(animate_timer);
                $('#_head_ad_left .g-bubble').show(300);
            }, function(e) {
                animate_timer = setTimeout(function() {
                    $('#_head_ad_left .g-bubble').hide();
                },300);
            });

            $ad_left.find('.g-bubble').hover(function() {
                clearTimeout(animate_timer);
                $('#_head_ad_left .g-bubble').show();
            }, function() {
                animate_timer = setTimeout(function() {
                    $('#_head_ad_left .g-bubble').hide();
                },300);
            });
        },

        /**
         * 获取反馈的url
         * @returns {String}
         */
        get_feedback_url: function () {
            var ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
            return urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
        },

        /**
         * 接入qboss广告
         */
        _render_qboss_ad: function() {
            var boad_id = 2424,
                me = this;
            if(constants.IS_HTTPS) {
                //HTTPS暂不支持qboss请求
                this._render_left_ad();
                return;
            }
            qboss_info.get({
                board_id: boad_id,
                uin: uin
            }).done(function(repData){
                //微云官网以及分享页广告
                var ad;
                if(repData.data && repData.data.count > 0 && repData.data[boad_id] && (ad = repData.data[boad_id].items) && ad.length > 0){
                    if(ad[0] && ad[0].extdata) {
                        me._$ad = $(tmpl.ad_web()).appendTo($('#_head_ad_left'));
                        me.init_ad_data(ad[0]);
                        me._$ad.find('[data-id=ad_title]').text(me.opt.extdata['text']);
                        qboss_info.report(me.opt);
                        me._bind_events();
                        return;
                    }
                }
                me._render_left_ad();
            }).fail(function(msg){
                me._render_left_ad();
            });
        },

        show_ad: function() {
            this._$ad && this._$ad.show();
        },

        remove_ad: function() {
            this._$ad && this._$ad.hide();
        },

        //保存广告数据
        init_ad_data: function(data) {
            var opt = {};
            opt.bosstrace = data.bosstrace;
            opt.extdata = JSON.parse(data.extdata);
            opt.qboper = 1;     //qboper：1曝光 ， 2点击， 3关闭
            opt.from = 1;       //from：  1 pc， 2 wap， 3 手机
            opt.uin = uin;

            this.opt = opt;
        },

        _bind_events: function() {
            var me = this,
                link = this._$ad.find('[data-id=ad_title]');

            link && link.on('click', function() {
                me.opt['qboper'] = 2;
                qboss_info.report(me.opt);
                me.remove_ad();
                window.open(me.opt.extdata['link']);
            });
        }
    };

    $.extend(ad_link, events);

    return ad_link;
});
