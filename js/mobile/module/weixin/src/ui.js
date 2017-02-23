/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        huatuo_speed = common.get('./huatuo_speed'),
        app_api = common.get('./app_api'),

        store = require('./store'),
        ListView = require('./ListView'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    var ui = new Module('weixin.ui', {
        render: function() {
            if(this._rendered) {
                return;
            }

            this._$ct = $('#_container');

            this.list_view = new ListView({
                $ct:$('#_list'),
                $toolbar: $('#_toolbar'),
                store: store,
                auto_render: true
            });

            mgr.observe(this.list_view);
            this.bind_jsapi_events();

            var me = this;
            setTimeout(function() {
                $(window).on('scroll', function(e) {
                    window.requestAnimationFrame(function() {
                        if(me.is_reach_bottom()) {
                            store.load_more();
                        }
                    });
                })
            }, 100);

            $('#_toolbar').hide();//先进行隐藏，当weixin jsapi就绪才显示
            //this.report_speed();

            this._rendered = true;
        },

        bind_jsapi_events: function() {
            var me = this;

            this.listenTo(app_api, 'init_success', function() {
                $('#_toolbar').show();
            }).listenTo(app_api, 'init_fail', function() {
                $('#_toolbar').hide();
            }).listenTo(app_api, 'share_success', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            }).listenTo(app_api, 'share_fail', function() {
                widgets.reminder.error('调用分享接口失败，重新分享分享');
                //logger.report('weixin_mp', res);
            }).listenTo(app_api, 'share_cancel', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            });
        },

        show_wx_tips: function() {
            this.$tip = $(tmpl.share_tip()).appendTo(document.body);
            var me = this;

            this.$tip.on('touchend', function(e) {
                me.$tip.remove();
                me.$tip = null;
                //去掉遮罩的同时把勾选文件的状态去掉
                store.share_restore();
            });
        },

        report_speed: function() {
            var render_time = +new Date();
            //延时以便获取performance数据
            setTimeout(function() {
                huatuo_speed.store_point('1512-1-1', 20, g_serv_taken);
                huatuo_speed.store_point('1512-1-1', 21, g_css_time - g_start_time);
                huatuo_speed.store_point('1512-1-1', 22, (g_end_time - g_start_time) + g_serv_taken);
                huatuo_speed.store_point('1512-1-1', 23, g_js_time - g_end_time);
                huatuo_speed.store_point('1512-1-1', 24, (render_time - g_start_time) + g_serv_taken);
                huatuo_speed.report('1512-1-1', true);
            }, 1000);
        },

        //jsapi签名失败，则不显示分享按钮了
        on_jsapi_success: function() {
            $('#_toolbar').hide();
        },

        is_reach_bottom: function() {
            if(window.pageYOffset + win_height > this._$ct.height() - 200) {
                return true;
            }

            return false;
        }
    });

    return ui;
});