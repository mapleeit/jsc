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
        logic_error_code = common.get('./configs.logic_error_code'),
        ret_msgs = common.get('./ret_msgs'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        app_api = common.get('./app_api'),
        user = common.get('./user'),
	    https_tool = common.get('./util.https_tool'),
        selection = require('./selection'),
        store = require('./store'),
        ad_link = require('./ad_link'),
        app_cfg = require('./app_cfg'),
        verify_code = require('./verify_code'),

        default_app_cfg,
        DEFAULT_TIMEOUT = 10, //默认超时时间为10s

        undefined;

    var ios_preview_file_type = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
    var compress_type_map = ['rar','zip','7z'];

    var mgr = new Mgr('outlink.mgr', {

        init: function(cfg) {
            var me = this;
            session_event.on('session_timeout', function() {
                me.to_login();
            });

            $.extend(this, cfg);
            this.observe(this.file_path);
            this.observe(this.view);
        },

        //定位到某个目录
        on_click_path: function(dir_key) {
            store.load_dir_kid(dir_key);
            if(dir_key === store.get_root_node().get_id()) {
                ad_link.show_ad();
            }
        },

        //以下是自定义的事件处理逻辑

        on_download: function(files) {
            var selected_files = files || selection.get_selected();
	        if(0 && browser.QQ) {
		        this.do_qq_download(selected_files);
	        } else {
		        this.do_download(selected_files[0]);
	        }
        },

        on_save: function(files) {
            if(files.length && !files[0].is_note()) {
                var me = this;
                default_app_cfg = app_cfg.get_version_cfg();

                if(browser.android && (browser.QQ || browser.QZONE)) {
                    app_api.getAppVersion(default_app_cfg, function(app_version) {
                        if(app_version && app_version >= '3.8.0') {
                            me.do_launch_save(files);
                        } else {
                            me.do_save(files);
                        }
                    });
                } else if(browser.android && browser.WEIXIN) {
                    app_api.isAppInstalled(default_app_cfg, function (result) {
                        if ((result && result.indexOf("get_install_state:yes") >= 0)) {
                            var arr = result.split('_'),
                                version_code = arr && arr.length > 1 ? arr[arr.length - 1] : '';
                            if (version_code > '858') {
                                me.do_launch_save(files);
                            } else {
                                me.do_save(files);
                            }
                        } else {
                            me.do_save(files);
                        }
                    });
                //} else if(browser.android && !constants.IS_HTTPS) {
                //    android_serv.get_version('3.8.0', function (result) {
                //        if (result) {
                //            me.do_launch_save(files);
                //        } else {
                //            me.do_save(files);
                //        }
                //    });
                //} else if(browser.IOS && browser.WEIXIN) {
                //    widgets.reminder.ok('IOS weixin save');
                //    app_api.launchWyApp(default_app_cfg, function(result) {
                //        if(!result){
                //            me.do_save(files);
                //        }
                //    });
                } else if(browser.IOS && browser.QQ) {
                    me.do_launch_save(files);
                } else {
                    me.do_save(files);
                }
            } else {
                this.do_save(files);
            }
        },

        /*
        * 呼起客户端起来选目录，支持安卓微信手Q和IOS手Q
        * */
        do_launch_save: function(files) {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加载中...');

            var me = this,
                file_size = 0,
                selected_files = files || selection.get_selected(),
                origin_share_key = store.get_share_info()['share_key'],
                owner_uin = store.get_share_info().share_uin,
                note_list = [],
                file_list = [],
                dir_list = [];

            $.each(selected_files, function(i, file) {
                if(file.is_dir()) {
                    dir_list.push({
                        pdir_key: file.get_pdir_key(),
                        dir_key: file.get_id(),
                        owner_uin: owner_uin
                    });
                } else {
                    file_list.push({
                        pdir_key: file.get_pdir_key(),
                        file_id: file.get_id()
                    });
                    file_size += file.get_size();
                }
            });

            var req_body = {
                origin_share_key: origin_share_key,
                note_list: note_list,
                dir_list: dir_list,
                file_list: file_list
            };

            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var one_file = selected_files[0],
                title = one_file.get_name() + (selected_files.length > 1 ? '等'+ selected_files.length + '个文件' : ''),
                thumb_url = 'http://imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_' + one_file.get_type() + '.png';
            default_app_cfg = app_cfg.get_version_cfg();

            this.handle_timeout(5, true, {
                'launch_save': JSON.stringify(req_body)
            });

            request
                .xhr_post({
                    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                    cmd: 'WeiyunShareAddTemp',
                    use_proxy: false,
                    header: {
                        device_info: JSON.stringify({browser: browser_name})
                    },
                    body: req_body,
                    timeout: 5,
                    cavil: true
                })
                .ok(function (msg, body) {
                    me._request = false;
                    widgets.reminder.hide();
                    var schema = browser.IOS? 'weiyunsharedir' : 'weiyunweb';
                    var schema_url = schema + '://save/?share_key=' + body['trans_key'] + '&title=' + encodeURIComponent(title) + '&file_size=' + file_size + '&thumb_url=' + encodeURIComponent(thumb_url);
                    if(browser.IOS && browser.QQ) {
                        setTimeout(function() {
                            var is_visibility = app_cfg.get_visibility();
                            if(is_visibility) {
                                me.do_save(files);
                            }
                        }, 100);
                    }
                    location.href = schema_url;
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        do_save: function(files) {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加载中...');

            var selected_files = files || selection.get_selected();
            var share_info = store.get_share_info();
            var me = this;
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                dir_list: [],
                file_list: [],
                note_list: []
            }
            for(var i = 0, len = selected_files.length ; i < len; i++) {
                var file = selected_files[i];
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data['note_list'].push({
                        note_id: file.get_id()
                    });
                } else {
                    data['file_list'].push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            this.handle_timeout(5, true, {
                'h5_save': JSON.stringify(data)
            });

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: share_info['type'] === 'note' ? 'WeiyunShareSaveData' : 'WeiyunSharePartSaveData',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                timeout: 5,
                body: data
            }).ok(function() {
                me._request = false;
                widgets.reminder.ok('保存成功');
                me.jump_app();
            }).fail(function(msg, ret) {
                me._request = false;
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '保存失败');
                } else {
                    widgets.reminder.hide();
                }
            });
        },

        on_join: function() {
            if(store.get_share_info().share_type !== 13) {
                return;
            }
            var file = store.get_root_node().get_kid_nodes()[0],
                me = this;
            default_app_cfg = app_cfg.get_version_cfg();

            if(browser.android && (browser.QQ || browser.QZONE)) {
                app_api.getAppVersion(default_app_cfg, function(app_version) {
                    if(app_version && app_version >= '3.8.0') {
                        me.do_launch_join();
                    } else {
                        me.do_join();
                    }
                });
            } else if(browser.android && browser.WEIXIN) {
                app_api.isAppInstalled(default_app_cfg, function(result) {
                    if((result && result.indexOf("get_install_state:yes") >= 0)) {
                        var arr = result.split('_'),
                            version_code = arr && arr.length > 1? arr[arr.length - 1] : '';
                        if(version_code > '858') {
                            me.do_launch_join();
                        } else {
                            me.do_join();
                        }
                    } else {
                        me.do_join();
                    }
                });
            //} else if(browser.android && !constants.IS_HTTPS) {
            //    android_serv.get_version('3.8.0', function (result) {
            //        if (result) {
            //            me.do_launch_join();
            //        } else {
            //            me.do_join();
            //        }
            //    });
            //} else if(browser.IOS && browser.WEIXIN) {
            //    me.do_launch_join();
                //app_api.launchWyApp(default_app_cfg, function(result) {
                //    if(!result){
                //        me.do_join();
                //    }
                //});
            } else if(browser.IOS && (browser.QQ || browser.WEIXIN)) {
                me.do_launch_join();
            } else {
                me.do_join();
            }
        },

        do_launch_join: function() {
            var me = this,
                file = store.get_root_node().get_kid_nodes()[0],
                schema = browser.android? 'weiyun://action/group_join' : 'weiyunsharedir://group_join',
                schema_url,
                share_uin = store.get_share_info().share_uin,
                nickname = store.get_share_info().share_nick_name,
                dir_key = file.get_id(),
                dir_name = file.get_name(),
                group_key = file.get_id();

            schema_url = schema + '?group_owner_uin=' + share_uin + '&invite_nickname=' + nickname + '&dir_key=' + dir_key + '&dir_name=' + encodeURIComponent(dir_name) + '&group_key=' + group_key;

            if(browser.IOS && browser.QQ) {
                setTimeout(function() {
                    var is_visibility = app_cfg.get_visibility();
                    if(is_visibility) {
                        me.do_join();
                    }
                }, 100);
            } else if(browser.IOS && browser.WEIXIN) {
                setTimeout(function() {
                    me.do_join();
                }, 300);
            }

            location.href = schema_url;
        },
        /*
        * H5加入共享
        * */
        do_join: function() {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加入中...');

            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var selected_files = store.get_root_node().get_kid_nodes();
            var share_info = store.get_share_info();
            var me = this;

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                dir_list: [],
                file_list: [],
                note_list: []
            }
            for(var i = 0, len = selected_files.length ; i < len; i++) {
                var file = selected_files[i];
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data['note_list'].push({
                        note_id: file.get_id()
                    });
                } else {
                    data['file_list'].push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            this.handle_timeout(5, true, {
                'h5_join_group': JSON.stringify(data)
            });

            request
                .xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartSaveData',
                    use_proxy: false,
                    header: {
                        device_info: JSON.stringify({browser: browser_name})
                    },
                    body: data,
                    timeout: 5,
                    cavil: true
                })
                .ok(function (msg, body) {
                    me._request = false;
                    widgets.reminder.hide();
                    //widgets.reminder.ok('加入成功');
                    me.view.show_tips();
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        //暂时不用
        on_mobile_save: function(files) {
            var file = files.length>0? files[0] : '',
                share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                me = this;

            if(!file) {
                widgets.reminder.error('保存失败');
            }
            if(typeof mqq === 'undefined') {
                return;
            } else if(!mqq.compare('5.2') < 0) {
                widgets.reminder.error('保存失败，请升级qq版本');
                return;
            }
            if(!mqq.android) { //android下本身有loading提示
                widgets.reminder.loading('保存中...');
            }

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                pack_name: file.get_name(),
                file_list: [{
                    file_id: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }]
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.DOMAIN_NAME,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                var result;
                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }

                mqq.media.saveImage({
                    content: https_tool.translate_url(body['download_url'].replace(/^http:|^https:/, ''))
                }, function(data) {
                    if(data.retCode !== 0) {
                        error = data.msg || '保存失败';
                    }
                    widgets.reminder.ok('保存成功');
                });

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                widgets.reminder.error('保存失败' + msg);

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> files_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        //这里为支持呼起选目录，屏蔽掉save_all行为
        on_save_all: function() {
            widgets.reminder.loading('保存中...');
            var share_info = store.get_share_info();
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var me = this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareSaveData',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: {
                    share_key: share_info['share_key'],
                    pwd: share_info['pwd']
                }
            }).ok(function() {
                widgets.reminder.ok('保存成功');
                me.jump_app();
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '保存失败');
                }
            })
        },

        on_open: function(file) {
            var file = store.get(file);

            if(file.is_dir()) {
                this.file_path.update(file);
                store.load_dir_kid(file.get_id());
                ad_link.hide_ad();
            } else if(0 && browser.QQ) {
	            this.do_qq_download([file]);
            } else if(file.is_note()) {
                this.preview_note(file);
            } else if(file.is_image()) {
                this.view.image_preview(file);
            } else if(file.is_preview_doc() || compress_type_map.indexOf(file.get_type()) > -1) {
                this.preview_doc(file);
            } else if(file.is_video()) {
                this.play_video(file, true);
            } else {
                this.do_download(file);
            }

        },

        preview_note: function(note) {
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var share_info = store.get_share_info();
            var me = this;
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                note_id: note.get_id()
            };

            widgets.reminder.loading();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareNoteView',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                widgets.reminder.hide();
                if(body.note_info) {
                    me.view.note_preview(note, {
                        note_summary: body.note_info['note_summary'],
                        note_content: body.note_info['html_content'],
                        note_article_url: body.note_info['article_url']
                    });
                } else {
                    widgets.reminder.error('获取笔记内容失败');
                }
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '获取笔记内容失败');
                }
            });
        },

        preview_doc: function(file) {
            var share_info = store.get_share_info(),
	            me = this;

            this.view.doc_preview(file, {
                share_key: share_info['share_key'],
                share_pwd: share_info['pwd']
            }, null, function() {
	            setTimeout(function () {
		            me.show_tips();
	            }, 300);
            });
        },

        play_video: function(file, need_show_tips) {
            var type = file.get_type().toLowerCase(),
                $toolbar = $('#wx_note_confirm'),
                size = file.get_size(),
                me = this;

            default_app_cfg = app_cfg.get_app_cfg(file);

            //IOS9.0的微信呼起接口，需要IOS先发版本，后续H5再切过去
            if(browser.IS_IOS_9 && (browser.WEIXIN || browser.QZONE)) {
            //if(browser.IS_IOS_9 && browser.WEIXIN && app_api.launchWyApp) {
            //    app_api.launchWyApp(default_app_cfg, function (res) {
            //        alert(JSON.stringify(res));
            //        //呼起失败，给出提示语
            //    });
            //    return;
            //} else if(browser.IS_IOS_9 && browser.QZONE) {
            //    if(size < LIMIT_VEDIO_SIZE && type == 'mp4') {
            //        this.play_mp4_video(file);
            //        return;
            //    }
                //IOS9.0以上系统不支持用应用API去判断是否安装app
                window.location.href = default_app_cfg.ios['packageUrl'];

                need_show_tips && setTimeout(function () {
                    me.show_tips(file.is_video() ? 1 : 0);

                    //再隔2s后提示浮层自动消失
                    setTimeout(function () {
                        $toolbar.hide();
                    }, 5000);
                }, 300);
                return;
            }

            app_api.isAppInstalled(default_app_cfg, function(is_install_app) {
                if(is_install_app){
                    me.play_common_video(file);
                //} else if(size < LIMIT_VEDIO_SIZE && type == 'mp4') {
                //    me.play_mp4_video(file);
                } else {
                    //未安装app的跳至微云官网页面下载app
                    need_show_tips && me.show_tips(file.is_video() ? 1 : 0);
                }
            });
        },

        play_common_video: function(file) {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'],
                pdir_key =  file.get_pdir_key(),
                uin = share_info['share_uin'],
                file_id = file.get_id(),
                file_name = file.get_name(),
                file_size = file.get_size(),
                time = file.get_duration() || 0,
                thumb_url = file.get_video_thumb(1024);
            if(thumb_url) {
                thumb_url = thumb_url.slice(0, thumb_url.length-5);
            }
            var schema = browser.IOS? 'weiyunaction' : 'weiyunweb';

            var schema_url = schema + '://outlink_video/?share_key=' + share_key +'&pdir_key=' + pdir_key +'&file_owner=' + uin + '&file_id=' + file_id
                + '&file_name=' + encodeURIComponent(file_name) + '&file_size=' + file_size +'&duration=' + time +'&thumb_url=' + thumb_url;

            window.location.href = schema_url;
        },

        play_mp4_video: function(file) {
            var share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                me = this;

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                download_type: browser.android ? 5 : 9
            }
            data['file_list'] = [{
                file_id: file.get_id(),
                pdir_key: file.get_pdir_key()
            }];

            widgets.reminder.loading();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.DOMAIN_NAME,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                var result;
                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }

                me.view.video_play(file, {
                    video_src: https_tool.translate_url(body['download_url'].replace(/^http:|^https:/, ''))
                });
                widgets.reminder.hide();

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '下载失败');
                }

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        show_tips: function(mode) {
            var $toolbar = $('#wx_note_confirm'),
	            title = $toolbar.find('.wx_note_title'),
	            desc = $toolbar.find('.wx_note_description');
	        //设置文案
	        mode = mode || 0;
	        title.html(mode ? '用微云丰富生活' : '用微云管理文件');
	        desc.html(mode ? '视频在线播放、音乐流畅收听' : '文档在线预览、笔记随记随存');
	        //未安装app的弹出提示
            $toolbar.show();
            $toolbar.find('[data-action="cancel"]').off('click').on('click', function() {
                $toolbar.hide();
            });
            $toolbar.find('[data-action="install"]').off('click').on('click', function() {
                //未安装app的跳至微云官网页面下载app
                app_cfg.get_config_data(function(download_url) {
                    if(download_url) {
                        window.location.href = download_url;
                    } else {
                        $toolbar.hide();
                        widgets.reminder.error('没有对应系统的客户端');
                    }
                });
            });
        },

	    do_qq_download: function(files) {
		    var share_info = store.get_share_info();
		    var data = {
			    share_key: share_info['share_key'],
			    pwd: share_info['pwd']
		    };
		    data.file_list = [];
		    for(var i=0, len=files.length; i<len; i++) {
			    if(!files[i].is_dir()) {
				    data.file_list.push({
					    file_id: files[i].get_id(),
					    pdir_key: files[i].get_pdir_key()
				    });
			    }
		    }

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
			    cmd: 'WeiyunShareBatchDownload',
			    use_proxy: false,
			    header: {
				    device_info: JSON.stringify({browser: 'qq'})
			    },
			    body: data
		    }).ok(function(msg, body) {
			    setTimeout(function() {
				    var config = {
					    file_list: []
				    };
				    for(var i=0, ilen=files.length; i<ilen; i++) {
					    for(var j=0, jlen=body.file_list.length; j<jlen; j++) {
						    if(files[i].get_id() === body.file_list[j].file_id) {
							    config.file_list.push({
								    url: https_tool.translate_url(body.file_list[j].download_url).replace(/^http:|^https:/, 'https:'),
								    file_id: files[i].get_id(),
								    file_size: files[i].get_size(),
								    pdir_key: files[i].get_pdir_key(),
								    pack_name: files[i].get_name(),
								    FTN5K: body.file_list[j].cookie_value
							    });
						    }
					    }
				    }
				    if(!app_api.createDownload(config, function(jobid) {
					    if(jobid) {
						    setInterval(function() {
							    app_api.checkDownload(jobid, function(path) {
								    if(path) {
									    window.location.href = 'file://' + path;
								    }
							    });
						    }, 5000);
					    } else {
						    widgets.reminder.error('创建下载任务失败[jobid null]');
					    }
				    })) {
					    widgets.reminder.error('创建下载任务失败');
				    }
			    }, 10);

			    //成功的也上报, 方便统计和设置告警
			    logger.monitor('js_download_error', 0, 0);
		    }).fail(function(msg, ret) {
			    widgets.reminder.error('请求下载任务失败');
		    });
	    },

        do_download: function(file) {
	        var me = this;
            var share_info = store.get_share_info();
            var browser_name = browser.WEIXIN ? 'weixin' : (browser.QQ ? 'qq' : constants.BROWSER_NAME);
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                pack_name: file.get_name()
            };
            //ios下限定下载为office文件，防止存储型xss
            if(browser.IOS && !file.is_dir() && ios_preview_file_type.indexOf(file.get_type()) < 0) {
	            file.is_music() ? me.show_tips(1) : widgets.reminder.error('暂时不支持此格式预览');
                return;
            }
            //目前先支持单文件转存
            if(file.is_dir()) {
                data['dir_list'] = [{
                    dir_key: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }];
            } else {
                data['file_list'] = [{
                    file_id: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }];
            }

            var msg = file.is_dir() ? '是否下载此文件夹' : '是否下载此文件';

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.DOMAIN_NAME,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                var result;
                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }
                setTimeout(function() {
	                var downloadUrl = body['download_url'];
	                window.location.href = https_tool.translate_url(downloadUrl.replace(/^http:|^https:/, ''));
                }, 10);

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '下载失败');
                }

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },


        on_secret_view: function(data) {
            widgets.reminder.loading('请稍候...');
            var me = this,
                verify_sig = cookie.get('verifysession'),
                share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                req_body = {
                    os_info: constants.OS_NAME,
                    browser: constants.BROWSER_NAME,
                    share_key: location.pathname.replace('/',''),
                    share_pwd: data['pwd']
                };

            if (data.verify_code && verify_sig) {//有验证码需要加上
                req_body.verify_code = data.verify_code;
                req_body.verify_sig = verify_sig;
            }
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareView',
                use_proxy: false,
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: req_body
            }).ok(function(msg, body) {
                cookie.set('sharepwd', data['pwd']);
                location.reload();
            }).fail(function(msg, ret) {
                if (ret == 114303) {      //114303  代表密码错误
                    if (me.view.is_need_verify_code()) {  //需要验证码时，错误后需要刷新下验证码至最新
                        verify_code.change_verify_code();
                    }
                    widgets.reminder.error('密码错误');
                } else if (ret == 114304) { // 输入错误次数频率过高，需要输入验证码
                    verify_code.show();
                    me.view.set_need_verify_code();
                    me.view.set_pwd_err_text('密码输错多次，请输入验证码');
                    widgets.reminder.hide();
                } else if (ret == 114305) { //验证码错误
                    verify_code.change_verify_code();
                    me.view.set_verify_err_text('验证码错误');
                    widgets.reminder.hide();
                } else {
                    if (verify_code.has_verify_code()) {
                        verify_code.change_verify_code();
                    }
                    me.view.set_pwd_err_text(msg);
                    widgets.reminder.hide();
                }
            });
        },

        on_refresh: function() {
            store.refresh();
        },

        jump_app: function() {
            var accountType;
            if (cookie.get('wx_nickname')) {
                accountType = 'weixin';
            } else if (cookie.get('p_uin').replace(/^[oO0]*/, '') || cookie.get('uin').replace(/^[oO0]*/, '')) {
                accountType = 'qq';
            } else {
                accountType = 'none';
            }

            var ACCOUNT_TEXT_MAP = {
                'qq' : '保存至QQ（'+ (cookie.get('p_uin').replace(/^[oO0]*/, '') || cookie.get('uin').replace(/^[oO0]*/, '')) +'）',
                'weixin' : '保存至微信（' + cookie.get('wx_nickname') + '）',
                'none' : ''
            };

            widgets.confirm({
                tip: '保存成功',
                sub_tip: ACCOUNT_TEXT_MAP[accountType],
                ok_fn: null,
                cancel_fn: function() {
                    location.href = window.location.protocol + '//www.weiyun.com/mobile/jump_app.html';
                },
                btns_text: ['知道了', '去微云查看']
            });
        },

        /**
         * 处理弱网络下请求未发出去造成UI未响应，超过timeout时间后去掉loading态，并出提示。依赖于this._request来判断当然是否有请求
         * @author xixinhuang
         * @data 16/10/22
         * @param timeout
         */
        handle_timeout: function(timeout, is_show_tips, extra) {
            timeout = timeout && DEFAULT_TIMEOUT;
            if(!this._request) {
                return;
            }

            var me = this;
            setTimeout(function() {
                //me._request为true说明请求已超时或请求未发出去
                if(me._request) {
                    me._request = false;

                    //日志上报
                    if(extra) {
                        var console_log = [];
                        console_log.push('handle_timeout');
                        for(var key in extra) {
                            console_log.push('[ ' + key + ' ]' + extra[key]);
                        }
                        logger.write(console_log, 'outlink_v2_error', -1);
                    }

                    if(is_show_tips) {
                        widgets.reminder.error('连接服务器超时');
                        me.retry_loading();
                    }
                }
            }, timeout * 1000 + 500);
        },

        retry_loading: function() {
            setTimeout(function() {
                widgets.reminder.loading('重新加载中...');
            }, 1000);
        },

        on_video: function() {
            $(document.body).append('<div style="position: fixed;top:0;left: 0;height: 300px;background-color: #000000;"><video webkit-playsinline style="position:fixed;top:0;left:0;background-color: #000000" width="100%" height="200px;" class="vplayinside notaplink" x-webkit-airplay controls loop="loop" src="//183.57.53.19/vcloud.tc.qq.com/1033_0d09c2a725dc4fbc937de2f6ba6670fe.f20.mp4?sha=1b177d31db73448fc7d22a554b7e4e9a4211087b&vkey=EEFD8B15339DE26E06CEF1DA903033488861ADD65F35E68546ECB7A76A21B58677C0476335CB67A2"></video></div>');
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('p_skey') || cookie.get('skey'),
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

        to_login: function() {
            if (browser.WEIXIN) {
                var max_time = new Date();
                max_time.setMinutes(max_time.getMinutes() + 1);
                var r_url =  location.href.indexOf('#') > -1? location.href.slice(0, location.href.indexOf('#')) : location.href;
                var redirect_url = 'http://web2.cgi.weiyun.com/weixin_oauth20.fcg?g_tk=5381&appid=wxd15b727733345a40&action=save_share&r_url=' + encodeURIComponent(r_url) + '&use_r_url=1';
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd15b727733345a40&redirect_uri=' + encodeURIComponent(redirect_url) + '%26use_r_url%3D1&response_type=code&scope=snsapi_userinfo&state=save_share#wechat_redirect';
            } else {
                var go_url = window.location.href;
                window.location.href = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&pt_wxtest=1&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url=" + encodeURIComponent(go_url) + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
            }
        }
    });

    return mgr;
});