/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
	    https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants'),
        app_api = common.get('./app_api'),
        router = lib.get('./router'),
        cookie = lib.get('./cookie'),
        store = require('./store'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        undefined;

    var mgr = new Mgr('weixin.mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            mgr.observe(cfg.ui);
            router.init('root');
            this.listenTo(router, 'change', function(dir_key) {
                if(dir_key) {
                    store.load_dir_kid(dir_key);
                    $('#_toolbar').show();
                }
            });
        },

        on_enter: function(file) {
            if(file.is_dir()) {
                var dir_key = file.get_id();
                router.go(dir_key);
            } else if(file.is_image()) {
                this.do_preview_img(file);
            } else if(file.is_preview_doc() || file.is_compress()) {
                this.do_preview_file(file);
            } else {
                this.do_download(file);
            }
        },

        do_preview_img: function(file) {
            var images = store.get_cur_node().get_kid_images(),
                cur_idx,
                urls = [];

            $.each(images, function(i, img) {
                var thumb_url = https_tool.translate_download_url(img.get_thumb_url(1024));
                urls.push(thumb_url);
                if(img.get_id() === file.get_id()) {
                    cur_idx = i;
                }
            });
            if(app_api.previewImage) {
                app_api.previewImage({
                    urls: urls,
                    cur_idx: cur_idx,
                    cur_url: https_tool.translate_download_url(file.get_thumb_url(1024))
                });
            }
        },

        do_preview_file: function(file) {
            require.async('ftn_preview', function(mod) {
                var ftn_preview = mod.get('./ftn_preview');
                ftn_preview.preview(file);
            });
        },

        do_download: function(file) {

        },

        on_refresh: function() {
            store.refresh();
        },

        on_share: function() {
            if(this._request) {
                return;
            }
            this._request = true;

            var selected_files = selection.get_selected(),
                err = '',
                dir_key_list = [],
                file_id_list = [];
            if(selected_files.length > 100) {
                err = '分享文件不能超过100个';
            } else {
                $.each(selected_files, function(i, file) {
                    if(file.is_dir()) {
                        dir_key_list.push(file.get_id());
                    } else {
                        file_id_list.push(file.get_id());
                    }
                });
            }
            if(err) {
                widgets.reminder.error(err);
                return;
            }

            var one_file = selected_files[0],
                share_name = one_file.get_name() + (selected_files.length > 1 ? '等'+selected_files.length+'文件' : '');

            var me = this;
            request
                .xhr_post({
                    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                    cmd: 'WeiyunShareAdd',
                    body: {
                        pdir_key: one_file.get_pdir_key(),
                        dir_key: dir_key_list,
                        file_id: file_id_list,
                        share_name: share_name,
                        share_type: 0
                    },
                    cavil: true
                })
                .ok(function (msg, body) {
                    var icon_url;
                    if(one_file.is_image()) {
                        icon_url = one_file.get_thumb_url(64);
                    } else if(one_file.is_dir()) {
                        icon_url = constants.HTTP_PROTOCOL + '//imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_folder_share.png';
                    } else {
                        icon_url = constants.HTTP_PROTOCOL + '//imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_'+one_file.get_type()+'.png';
                    }
                    var url_object = new URL(body['raw_url']),
                        share_url = 'http://h5.weiyun.com/jump_share?fromid=100&share_key=' + url_object.pathname.replace("/", ""),
                        share_data = {
                        title: '我用微云分享',
                        desc: share_name,
                        image: icon_url,
                        url: share_url
                    }

                    //app_api.setShare(_data);
                    me.set_share(share_data);
                    me._request = false;
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        set_share: function(share_data) {
            var cfg = {
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'previewImage'
                ],
                hideMenuItems: ['menuItem:refresh','menuItem:copyUrl','menuItem:setFont','menuItem:setFont', 'menuItem:readMode', 'menuItem:exposeArticle', 'menuItem:favorite'
                    ,'menuItem:openWithSafari', 'menuItem:openWithQQBrowser', 'menuItem:share:email', 'menuItem:share:brand','menuItem:share:QZone']
            }
            if(browser.QQ/* || browser.QZONE*/) {
                //app_api.init(function() {
                app_api.setShare(share_data);
                app_api.showShareMenu();

                //更改选择状态，是否要去掉需要跟产品确认
                store.share_restore();
                //});
            } else if(browser.WEIXIN) {
                //app_api.init(cfg, function() {
                app_api.setShare(share_data);
                this.ui.show_wx_tips();
                //});
            }
        }
    });

    return mgr;
});