/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define(function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        app_api = common.get('./app_api'),
        tmpl    = require('./tmpl'),

        undefined;

    var default_app_cfg = {
        android: {
            published: true,
            packageName:"com.qq.qcloud",
            packageUrl: "weiyunweb://android",
            scheme: "weiyunweb",
            url: "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
        },
        ios: {
            published: true,
            packageName: "com.tencent.weiyun",
            packageUrl: "weiyun://ios",
            scheme: 'weisssss',//"weiyunaction",
            url: "//www.weiyun.com"
        }
    };

    var note_preview = new Module('note.note_preview', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }
            if(extra.note_artcile_url) {
                location.href = extra.note_artcile_url;
                return;
            }

            var $container = $('#_note_body');
            //把列表页隐藏
            $('#_note_view_list').hide();

            this.$ct = $(tmpl.preview_note({
                title: note.get_name(),
                time: note.get_mtime(),
                content: extra.note_content
            })).appendTo($container);

            $('#_load_more').hide();
            $('#wx_note_detail').show();
            this.bind_events(note);

            this._rendered = true;
        },

        //内嵌iframe的方式有问题，无法展示图片视频和富文本，这里gyv的意见是改为新开标签页去预览
        render_article: function(artcile_url) {
            var $article_iframe = $('#_note_article_frame'),
                $container = $('#wx_note_detail'),
                width = $(window).width(),
                height = $(window).height();
            $article_iframe.attr('src', artcile_url).css({
                width: width,
                height: height
            });
            $container.css('padding','0px');
        },

        bind_events: function(note) {
            var me = this;

            this.$ct.on('touchend', '[data-action=edit]', function(e) {
                if(browser.IS_IOS_9) {
                    me.ios9_launch_app();
                    return;
                }
                me.launch_app();
            });
        },

        ios9_launch_app: function() {
            var $toolbar = $('#wx_note_confirm'),
                me = this;

            window.location.href = 'weiyunaction://ios';

            setTimeout(function () {
                me.show_tips();
                setTimeout(function () {
                    $toolbar.hide();
                }, 1800);
            }, 300);
        },

        launch_app: function() {
            var me = this;
            app_api.isAppInstalled(default_app_cfg, function(is_install_app) {
                if(is_install_app){
                    var schema = browser.IOS? 'weiyunaction' : 'weiyunweb';
                    window.location.href = schema + '://test';
                } else{
                    me.show_tips();
                }
            });
        },

        show_tips: function() {
            var download_url = browser.IPAD? 'https://itunes.apple.com/cn/app/teng-xun-wei-yunhd/id608263551?l=cn&mt=8' : default_app_cfg.android['url'],
                $toolbar = $('#wx_note_confirm');
            //未安装app的弹出提示
            $toolbar.show();
            $toolbar.find('[data-action="cancel"]').on('click', function() {
                $toolbar.hide();
            });
            $toolbar.find('[data-action="install"]').on('click', function() {
                //未安装app的跳至微云官网页面下载app
                window.location.href = download_url;
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
            $('#_note_view_list').css('display', '');
        }
    });

    return note_preview;

});