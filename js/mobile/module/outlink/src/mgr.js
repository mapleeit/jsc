/**
 * mgr
 * @author hibincheng
 * @date 2014-12-22
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),

        store = require('./store'),
        //preview_dispatcher = common.get('./util.preview_dispatcher'),

        ftn_preview,

        undefined;

    var ios_preview_file_type = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];

    var mgr = new Mgr('outlink.mgr', {

        init: function() {
            var me = this;
            session_event.on('session_timeout', function() {
                me.to_login();
            });
        },
        //以下是自定义的事件处理逻辑

        on_save: function(file_ids) {
           /* if(!this.check_login()) {
                this.to_login();
                return;
            }*/

            widgets.reminder.loading('保存中...');
            var data = {
                share_key: store.get_share_key(),
                pwd: store.get_share_pwd(),
                dir_list: [],
                file_list: [],
                src_pdir_key: store.get_node_by_id(file_ids[0]).get_pdir_key()
            }
            for(var i = 0, len = file_ids.length ; i < len; i++) {
                var file = store.get_node_by_id(file_ids[i]);
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file_ids[i]
                    });
                } else {
                    data['file_list'].push({
                        file_id: file_ids[i],
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg' + (store.get_sid() ? '?sid='+store.get_sid() : ''),
                cmd: store.is_note() ? 'WeiyunShareSaveData' : 'WeiyunSharePartSaveData',
                use_proxy: true,
                body: data
            }).ok(function() {
                widgets.reminder.ok('保存成功');
            }).fail(function(msg) {
                widgets.reminder.error(msg || '保存失败');
            })
        },

        on_mobile_save: function(file_ids) {
            var len = file_ids.length,
                error = '';
            if(typeof mqq === 'undefined') {
                return;
            } else if(!mqq.compare('5.2') < 0) {
                widgets.reminder.error('保存失败，请升级qq版本');
                return;
            }
            widgets.reminder.loading('保存中...');
            for(var i= 0; i< len; i++) {
                var file = store.get_node_by_id(file_ids[i]);
                mqq.media.saveImage({
                    content: file.get_thumb_url()
                }, function(data) {
                    if(data.retCode !== 0) {
                        error = data.msg || '保存失败';
                    }
                    if(--len === 0) {
                        if(error) {
                            widgets.reminder.error(error);
                        } else {
                            widgets.reminder.ok('保存成功');
                        }
                    }

                });
            }
        },

        on_save_all: function() {
            /*if(!this.check_login()) {
                this.to_login();
                return;
            }*/
            widgets.reminder.loading('保存中...');
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg' + (store.get_sid() ? '?sid='+store.get_sid() : ''),
                cmd: 'WeiyunShareSaveData',
                use_proxy: true,
                body: {
                    share_key: store.get_share_key(),
                    pwd: store.get_share_pwd()
                }
            }).ok(function() {
                widgets.reminder.ok('保存成功');
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '保存失败');
            })
        },

        on_open: function(file_id) {
            var file = store.get_node_by_id(file_id);
            this.on_preview(file);
        },

        on_preview: function(node){
            var me = this;
            require.async('ftn_preview', function(mod) {
                ftn_preview = mod.get('./ftn_preview');

                if(ftn_preview.can_preview(node)){
                    node._share_key = store.get_share_key();
                    node._share_pwd = store.get_share_pwd();
                    node.down_file = function (e) {
                        me.on_download([node], e);
                    }
                    ftn_preview.preview(node);
                } else{
                    //不支持预览的文件跳转至下载
                    me.on_download(node);
                }
            });
        },

        on_secret_view: function(pwd) {
            widgets.reminder.loading('请稍候...');
            cookie.set('sharepwd', pwd);
            setTimeout(function() {
                location.reload();
            }, 10);
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('skey'),
                sid = store.get_sid();
            if(uin && skey || sid) {
                return true;
            }

            if(browser.WEIXIN || browser.QQ || browser.QZONE) {
                logger.report('weiyun_share_no_login', {
                    time: (new Date()).toString(),
                    url: location.href,
                    uin: uin || '',
                    skey: skey || '',
                    sid: sid || ''
                });
            }
            return false;
        },

        //下载
        on_download: function(file) {
            var data = {},
                me = this;

            data.share_key = store.get_share_key();
            data.pwd = store.get_share_pwd();
            data.pack_name = file.get_name();
            data.pdir_key = file.get_pdir_key();

            data.file_list = [];
            data.file_list.push({
                file_id: file.get_id(),
                pdir_key: file.get_pdir_key()
            });

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunSharePartDownload',
                use_proxy: true,
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                me.do_download(body.download_url);
            }).fail(function(msg) {
                widgets.reminder.error(msg || '下载失败');
            });
        },

        do_download: function(download_url) {
            this.get_$down_iframe().attr('src', download_url);
        },
        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },

        to_login: function() {
            var go_url = window.location.href;
            window.location.href = "http://ui.ptlogin2.weiyun.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&s_url="+encodeURIComponent(go_url)+"&style=9&hln_css=http%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Flogo-v2.png";
        }
    });

    return mgr;
});