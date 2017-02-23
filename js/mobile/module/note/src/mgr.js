/**
 * 最近文件列表模块
 * @author hibincheng
 * @date 2015-08-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),
        app_api = common.get('./app_api'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
	    https_tool = common.get('./util.https_tool'),
        router = lib.get('./router'),
        store = require('./store'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        undefined;

    var mgr = new Mgr('note.mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            mgr.observe(cfg.ui);
        },

        on_enter: function(note) {
            this.do_open_note(note);
            router.go(note.get_id());
        },

        on_store: function() {

        },

        do_open_note: function(note) {
            var REQUEST_CGI = https_tool.translate_cgi('http://web2.cgi.weiyun.com/weiyun_note.fcg'),
                me = this;

            if (me._last_load_detail_req) {//有请求未完成，则要先清除
                me._last_load_detail_req.destroy();
            }
            me._last_load_detail_req =
                request.xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NoteDetail",
                    cavil: true,
                    pb_v2: true,
                    body: {
                        note_id: note.get_id()
                    }
                })
                .ok(function (msg, body) {
                        var note_content = body.item.item_htmltext && body.item.item_htmltext['note_html_content'],
                            note_artcile_url = body.item.item_article && body.item.item_article['note_artcile_url'];

                        me.ui.preview(note, {
                        note_summary: body.item.note_basic_info['note_summary'],
                        note_content: me.replace_img_url(note_content),
                        note_artcile_url: note_artcile_url
                    });
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);
                });
        },

        //使用https代理笔记图片
        replace_img_url: function(text) {
            if (text.indexOf('tx_tls_gate') === -1) {
                try {
                    text = text.replace(/<img.*?src=['"].*?['"].*?>/ig, function (img) {
                        return img.replace(/src=(['"])http:\/\/(.*?)['"]/i, 'src=$1https://h5.weiyun.com/tx_tls_gate=$2$1');
                    });
                } catch (e) {
                }
            }
            return text;
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
                share_type = 11,
                note_list = [],
                dir_info_list = [];

            if(selected_files.length > 100) {
                err = '分享笔记不能超过100个';
            } else {
                $.each(selected_files, function(i, file) {
                    note_list.push(file.get_id());
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
                        note_list: note_list,
                        share_name: share_name,
                        share_type: share_type
                    },
                    cavil: true
                })
                .ok(function (msg, body) {
                    var icon_url = 'http://imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_note.png';
                    var url_object = new URL(body['raw_url']),
                        share_url = 'http://h5.weiyun.com/jump_share?fromid=100&share_key=' + url_object.pathname.replace("/", ""),
                        share_data = {
                            title: '我用微云分享',
                            desc: share_name,
                            image: icon_url,
                            url: share_url
                        }

                    //微信里分享到好友和朋友圈from参数会被吃掉，这里微信公众号直接用raw_url不用h5域名转发
                    if(browser.WEIXIN) {
                        share_data.url = body['raw_url'];
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
        },

        hide_wx_share_menu: function() {
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:share:QZone"
                ]
            });
            var share_tips = $('#_share_tip');
            share_tips && share_tips.remove();
        }
    });

    return mgr;
});