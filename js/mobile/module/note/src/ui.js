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
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        store = require('./store'),
        ListView = require('./ListView'),
        note_preview = require('./note_preview'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),
        app_api = common.get('./app_api'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    var ui = new Module('note.ui', {

        render: function() {
            if(this._rendered) {
                return;
            }

            this._$ct = $('#_container');

            this.list_view = new ListView({
                $ct:$('#_note_files'),
                $toolbar: $('#_toolbar'),
                store: store,
                auto_render: true
            });

            mgr.observe(this.list_view);
            $('#_toolbar').show();
            this._bind_events();
            //$('#_toolbar').hide();//先进行隐藏，当weixin jsapi就绪才显示

            this._rendered = true;
        },

        _bind_events: function() {
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
                //logger.report('weixin_mp');
            }).listenTo(app_api, 'share_cancel', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            });

            setTimeout(function() {
                $(window).on('scroll', function(e) {
                    window.requestAnimationFrame(function() {
                        if(me.is_reach_bottom()) {
                            store.load_more();
                        }
                    });
                })
            }, 100);
        },

        is_reach_bottom: function() {
            if(window.pageYOffset + win_height > this._$ct.height() - 200) {
                return true;
            }

            return false;
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

        preview: function(data, extra){
            note_preview.preview(data, extra);
        },

        render_fail: function() {
            $('#_fail').on('touchend', function(e) {
                location.reload();
            });
        },

        //jsapi签名失败，则不显示分享按钮了
        on_jsapi_success: function() {
            $('#_toolbar').hide();
        }
    });

    return ui;
});