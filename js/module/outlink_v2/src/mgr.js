/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        url_parser = lib.get('./url_parser'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        logic_error_code = common.get('./configs.logic_error_code'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
	    https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        cookie = lib.get('./cookie'),

        ad_link = require('./ad_banner.ad_link'),
        selection = require('./selection'),
        store = require('./store'),
        login = require('./login'),
        note = require('./note'),
        tmpl = require('./tmpl'),
        verify_code = require('./verify_code'),

        
        share_enter,
        downloader,
        file_qrcode,

        ftn_preview,
        undefined;

    var mgr = {

        init: function(cfg) {
            $.extend(this, cfg);
            login.init();
	        this.listenTo(login, 'login_done', this.on_restore);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e, extra){
                    this.process_action(action_name, record, e, extra);
                    return false;// 不再触发recordclick
                }, this);
//                this.listenTo(this.view, 'recordclick', this.handle_record_click, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, e) {
                    var records = selection.get_selected();
                    this.process_action(action_name, records, e);
                }, this);
            }

            if(this.file_path) {
                this.listenTo(this.file_path, 'action', function(action_name, data) {
                    this.process_action(action_name, data);
                });
            }

        },
        // 分派动作
        process_action : function(action_name){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name].apply(this, [].slice.call(arguments, 1));
            }
        },

        //全选
        on_checkall: function(to_check) {
            var kid_nodes = store.get_cur_node().get_kid_nodes();
            if(to_check){
                selection.clear();
                selection.select(kid_nodes);
            } else{
                selection.unselect(kid_nodes, true);
            }
        },

        //定位到某个目录
        on_click_path: function(dir_key) {
            store.load_dir_kid(dir_key);
            this.header.show_btn('download');
            if(dir_key === store.get_root_node().get_id()) {
                ad_link.show_ad();
            }
        },

        //打开
        on_enter: function(file_id) {
            var node = store.get(file_id),
                share_info = store.get_share_info(),
                me = this;
            if(node.is_dir()) {
                this.file_path.update(node, true);
                store.load_dir_kid(file_id);
                ad_link.hide_ad();
            } else if(node.is_note()) {
                this.preview_note(node);
            } else if(preview_dispatcher.is_preview_doc(node) && share_info.share_flag != 12) {
                node._share_key = share_info.share_key;
                node._share_pwd = share_info.pwd;
                node.down_file = function (e) {
                    me.on_download([node], e);
                }
                preview_dispatcher.preview(node);
            } else if(this.is_compress_file(node)  && !($.browser.msie && $.browser.version < 8)) {
                this.preview_zip_file(node);
            } else if(node.is_image()) {
                this.preview_image(node);
            } else {
                this.on_download([node]);
            }
        },

        //下载
        on_download: function(files, e) {
            if(!files || !files.length) {
                mini_tip.warn('请选择文件');
                return;
            }

            var total_size = 0;

            var has_note = false,
                has_dir = false;
            $.each(files, function(i, file) {
                if(file.is_note()) {
                   has_note = true;
                   return false;
                } else if(file.is_dir()) {
                    has_dir = true;
                    return false;
                }
                total_size += file.get_size();
            });

            if(has_note) {
                mini_tip.warn('您选择的文件中包含笔记，无法进行下载。');
                return;
            //} else if(has_dir) {
            //    mini_tip.warn('您选择的文件中包含文件夹，无法进行下载。');
            //    return;
            }

            var share_info = store.get_share_info(),
                data = {},
                referer = 0,
                me = this;

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];
            data.pack_name = files.length > 1 ? files[0].get_name() + '等' + files.length + '个文件' : files[0].get_name();
            data.pdir_key = files[0].get_pdir_key();

            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    data.dir_list = data.dir_list || [];
                    data.dir_list.push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else {
                    data.file_list = data.file_list || [];
                    data.file_list.push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            });

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                cavil: true,
                pb_v2: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data
            }).ok(function(msg, body) {
                var result;
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.MAIN_DOMAIN,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    console.error('FTN cookie 写入失败！');
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }
                me.do_download(body.download_url);

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);

            }).fail(function(msg, ret) {
                mini_tip.error(msg);

                //日志上报
                var console_log = [];
                console_log.push('pre_down error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                if(files && files.length) {
                    for(var i=0, len=files.length; i<len; i++) {
                        console_log.push('error --------> files[' + i + ']  name: ' + files[i]._name + ', type: ' + files[i]._type + ', size: ' + files[i]._readability_size + ', file_id: ' + files[i]._id);
                    }
                }
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        do_download: function(download_url) {
            var params = download_url.split(':');
            var index = (params[2] && params[2].indexOf('/') > -1)? params[2].indexOf('/') : 0;
            var port = constants.IS_HTTPS? 443 : params[2].slice(0, index);
            var url = constants.HTTP_PROTOCOL + this.translate_host(params[1]) + ':'  + port + params[2].slice(index);
            this.get_$down_iframe().attr('src', url);
        },

        translate_host:function (host) {
            if(!host) {
                return host;
            }

            if(host.indexOf('.ftn.') > -1) {
                return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
            }

            return host.replace(/\.qq\.com/, '.weiyun.com');
        },

	    //登录后重试转存
	    on_restore: function() {
			if(this.need_restore) {
				if(this.restore_file) {
					this.on_store(this.restore_file);
				} else {
					this.on_store();
				}
			}
	    },

        //转存
        on_store: function(files) {
            var share_type = store.get_type();
            if(share_type == "note"){
                this.on_store_note();
            } else{
                this.on_store_file(files);
            }
        },

        on_store_note: function(){
	        var me = this;
            var share_info = store.get_share_info(),
                referer = 0,
                data = {};

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareSaveData',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data
            }).ok(function(msg, body) {
                var dialog = new widgets.Dialog({
                    title: '提示',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: tmpl.store_dialog({
                        path: '/笔记'
                    }),
                    buttons: [ {id: 'CANCEL', text: '关闭', klass: 'g-btn-gray', visible: true} ]
                });
                dialog.show();
            }).fail(function(msg, ret, body, header) {
	            //登录后重新发起转存请求
	            if(ret === 190011) {
		            me.need_restore = 1;
	            }
                mini_tip.error(msg || header.retmsg);
            });
        },

        on_store_file: function(files){
	        var me = this;
            if(!files || !files.length) {
                mini_tip.warn('请选择文件');
                return;
            }

            var share_info = store.get_share_info(),
                data = {},
                me = this;

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];

            //data.src_pdir_key = share_info['pdir_key'];
            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    data.dir_list = data.dir_list || [];
                    data.dir_list.push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data.note_list = data.note_list || [];
                    data.note_list.push({
                        note_id: file.get_id()
                    });
                } else {
                    data.file_list = data.file_list || [];
                    data.file_list.push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            });

            request.xhr_post({
	            url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunSharePartSaveData',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data,
	            resend: true
            }).ok(function(msg, body) {
                var dialog = new widgets.Dialog({
                    title: '提示',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: tmpl.store_dialog({
                        path: '/微云'
                    }),
                    buttons: [ {id: 'CANCEL', text: '关闭', klass: 'g-btn-gray', visible: true} ]
                });
                dialog.show();
            }).fail(function(msg, ret, body, header) {
	            //登录后重新发起转存请求
	            if(ret === 190011) {
					me.need_restore = 1;
		            me.restore_file = files;
	            }
	            mini_tip.error(msg || header.retmsg);
            });
        },

        //二维码
        on_qrcode: function() {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'];
            var qrcode_src = window.location.protocol + '//www.weiyun.com/php/phpqrcode/qrcode.php?data=http%3A%2F%2Fshare.weiyun.com/' +
                share_key+ '&level=4&size=2';
            var dialog = new widgets.Dialog({
                title: '二维码下载',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: tmpl.qrcode_dialog({
                    qrcode_src: qrcode_src
                }),
                buttons: []
            });
            dialog.show();
        },

        on_secret_view: function(data) {
            var me = this,
                verify_sig = cookie.get('verifysession'),
                share_info = store.get_share_info(),
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
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
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
                    me.view.set_pwd_err_text('密码错误');
                } else if (ret == 114304) { // 输入错误次数频率过高，需要输入验证码
                    verify_code.show();
                    me.view.set_need_verify_code();
                    me.view.set_pwd_err_text('密码错误次数过多，请输入验证码');
                } else if (ret == 114305) { //验证码错误
                    verify_code.change_verify_code();
                    me.view.set_verify_err_text('验证码错误');
                } else {
                    if (verify_code.has_verify_code()) {
                        verify_code.change_verify_code();
                    }
                    me.view.set_pwd_err_text(msg);
                }
            });
        },

        is_compress_file: function(file) {
            var compress_type_map = {'zip':1, 'rar': 1, '7z': 1};
            return compress_type_map[file.get_type()];
        },

        preview_zip_file: function (file) {
            var me = this,
                share_info = store.get_share_info();
            file._share_key = share_info['share_key'];
            file._share_pwd = share_info['pwd'];

            if(!ftn_preview) {
                require.async('ftn_preview', function(mod) {
                    ftn_preview = mod.get('./ftn_preview');
                    ftn_preview.compress_preview(file);
                    me._bind_compress_events();
                });
            } else {
                ftn_preview.compress_preview(file);
            }

        },

        //因为分享页的下载与网盘下载不同，这里要使用分享外链的下载方式
        _bind_compress_events: function() {
            var me = this;
            this.listenTo(ftn_preview, 'download', function(file) {
                me.on_download([file], null);
            });
        },

        preview_image: function(node) {
            var me = this;
            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                var cur_img_list = store.get_cur_node().get_kid_images();
                // 当前图片所在的索引位置
                var index = $.inArray(node, cur_img_list);
                image_preview.start({
                    total: cur_img_list.length,
                    index: index,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return cur_img_list[index] && cur_img_list[index].get_thumb_url(64);
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return cur_img_list[index] && cur_img_list[index].get_thumb_url(1024);
                    },
                    download: function(index, e) {
                        var file = cur_img_list[index];
                        me.on_download([file], e);
                    }
                });
            });
        },

        preview_note: function(node) {
            var share_info = store.get_share_info();
            var me = this;
            progress.show('加载数据中，请稍候。');
            request.xhr_get({
	            url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareNoteView',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: {
                    share_key: share_info['share_key'],
                    pwd: share_info['pwd'],
                    note_id: node.get_id()
                }
            }).ok(function(msg, body) {
                if(body.note_info) {
                    note.preview(node, {
                        note_summary: body.note_info['note_summary'],
                        note_content: body.note_info['html_content'],
                        note_article_url: body.note_info['article_url']
                    });

                    me.header.hide_btn('download');
                    me.file_path.update(node, true);
                } else {
                    mini_tip.error('获取笔记内容失败。');
                }
            }).fail(function(msg ,ret) {
                mini_tip.error(msg || '获取笔记内容失败。');
            }).done(function() {
                progress.hide();
            });
        },

        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        }
    };

    $.extend(mgr, events);

    return mgr;
});