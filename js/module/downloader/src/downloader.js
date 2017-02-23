/**
 * 下载
 * @author jameszuo
 * @date 13-3-27
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('downloader'),
        text = lib.get('./text'),
        security = lib.get('./security'),
        url_parser = lib.get('./url_parser'),
        cookie = lib.get('./cookie'),
	    covert = lib.get('./covert'),

        query_user = common.get('./query_user'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        stat_log = common.get('./stat_log'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        urls = common.get('./urls'),
        session_event = common.get('./global.global_event').namespace('session'),
        logic_error_code = common.get('./configs.logic_error_code'),
        mini_tip = common.get('./ui.mini_tip'),
        FileObject = common.get('./file.file_object'),
        request = common.get('./request'),
        global_var = common.get('./global.global_variable'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        os = common.get('./util.os'),

        tmpl = require('./tmpl'),

    // 单文件下载URL模板
        url_tpl_single = 'http://download.cgi.weiyun.com/wy_down.fcg',
        thumb_tpl_single = 'http://download.cgi.weiyun.com/imgview.fcg',

    // 打包下载URL模板
        url_tpl_zip = 'http://sync.box.qq.com/pack_dl.fcg',

        down_fail_callback_url = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html',

    // 是否使用location跳转方式下载
        use_redirect_download = false,
        ie6_down_name_len = 16,

        shaque_ie = $.browser.msie,
        shaque_ie6 = shaque_ie && $.browser.version < 7,


        encode = encodeURIComponent,

        re_cn_char = /[^\x00-\xff]/, // 全角字符

        pack_default_size = -1, // 打包下载无法取得文件大小时的默认值
        pack_down_limit = 100, // 打包下载不能超过40个文件
        pack_file_name_len = 28, // 打包下载文件名长度上限
        pack_file_ext = 'zip', // 打包下载的文件类型

    // webkit 下，这些字符会被替换为全角
        sbc_map = {
            '#': 1,
            '?': 1,
            '&': 1,
            "'": 1,
            '%': 1,
            ';': 1,
            ',': 1
        },
        plugin_route = {
            package_size: '1',//用1字节作为 打包下载的标识
            /**
             * 调用控件下载
             * @param {string} url
             * @param {string} size
             * @param {string} name
             * @param {string} icon
             * @param {boolean} is_pack_down 是否打包下载
             */
            call_download: function (url, size, name, icon, is_pack_down) {
                if (is_pack_down) {
                    size = this.package_size;
                }
                //QQ1.97及以前版本不允许下载大于4G的文件
                if (!window.external.GetVersion && size >= Math.pow(2, 30) * 4) {
                    setTimeout(function () {
                        window.external.MsgBox_Confirm('提示', '你的QQ版本暂不支持下载4G以上的文件。', 0);
                    }, 0);
                }
                else {
                    // 可使用cookie方式下载
                    if (common_util.can_use_cookie(url)) {
                        // 请求CGI取得FTN地址
                        this._down_from_ftn(url, size, name, icon);
                    }
                    // 不支持cookie，请求发往CGI服务器并302跳转到FTN下载（url中会包含uin/skey等信息）
                    else {
                        window.external.ClickDownload(url, size, name, icon);
                    }
                }
            },
            /**
             * 调用控件的拖拽下载
             * @param {string} name
             * @param {string} size
             * @param {string} url
             * @param {string} ico
             * @param {boolean} is_pack_down 是否打包下载
             */
            call_drag_download: function (name, size, url, ico, is_pack_down) {
                if (is_pack_down) {
                    size = this.package_size;
                }
                if ($.browser.msie) {// 旧版本IE内核
                    external.DragMultiFileDownload([
                        [ name, size, url ]
                    ]);
                } else {
                    // webkit 内核
                    external.DragMultiFileDownload(url + '/?', size, name, ico);
                }
            },

            /**
             * 从FTN直接下载文件
             * @private
             */
            _down_from_ftn: function (url, size, name, icon) {
                downloader.get_ftn_url_from_cgi(url)
                    .done(function (url, cookie_name, cookie_value) {
                        cookie.set(cookie_name, cookie_value, {
                            domain: constants.MAIN_DOMAIN,
                            path: '/',
                            expires: cookie.minutes(10)
                        });
                        console.debug([
                            '调用客户端接口 ClickDownload()，下载FTN文件 ',
                            'url=' + url,
                            'cookie_name=' + cookie_name,
                            'cookie_value=' + cookie_value
                        ].join('<br>'));
                        if (cookie.get(cookie_name) !== cookie_value) {
                            console.error('FTN cookie 写入失败！');
                        }
                        external.ClickDownload(url, size, name, icon, document.cookie);
                    })
                    .fail(function (msg, ret) {
                        console.error('获取FTN下载地址失败, msg=' + msg + ', ret=' + ret);
                        mini_tip.warn(msg);
                    });
            }
        };

    var downloader_v2 = {
        /**
         * 下载
         * @param {Array<FileObject>|FileObject} files
         * @param {jQuery.Event} e
         */
        down: function (files, e, xuanfeng) {
            e.preventDefault();
            if (!files || !common_util.is_user_trigger(e) || !common_util.check_down_cookie()) {
                console.warn('downloader.down()参数无效, !files || !is_user_trigger: ' + !common_util.is_user_trigger(e) + ' || !check_down_cookie: ' + !common_util.check_down_cookie());
	            logger.report({
		            report_console_log: true
	            });
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn([
                    'downloader.down()参数无效, !(files instanceof Array)',
                    'typeof files: ' + typeof(files),
                    'file name: ' + (files && files._name) ? files._name : '',
                    'file size: ' + (files && files._size) ? files._size : '',
                    'file type: ' + (files && files._type) ? files._type : '',
                    'file pid: ' + (files && files._pid) ? files._pid : '',
                    'file id: ' + (files && files._id) ? files._id : ''
                ].join('\n'));

                logger.report({
                    report_console_log: true
                });

                var result = logic_error_code.is_logic_error_code('download', 1000500)? 2 : 1;
                logger.monitor('js_download_error', 1000500, result);
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('downloader.down()没有可下载的文件');
	            logger.report({
		            report_console_log: true
	            });
                return false;
            }


            var total_size = 0,
                has_dir = false;
            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    has_dir = true;
                    return false;
                }
                total_size += file.get_size();
            });
            var is_pack_down = files.length > 1,
                pack_down_limit = query_user.get_cached_user() && query_user.get_cached_user().get_files_packpage_download_size() || 100,
                is_limit = files.length > pack_down_limit || total_size > constants.FILE_DOWNLOAD_LIMIT,
                text = files.length > pack_down_limit? '您选择的文件过多' : (total_size > constants.FILE_DOWNLOAD_LIMIT? '您选择的文件过大' : '');

          /*  if(has_dir){
                //PC不支持下载文件夹，这里先给错误提示
                mini_tip.error('不支持下载文件夹');
                console.warn('downloader.down()不支持下载文件夹');
                logger.report({
                    report_console_log: true
                });
                return false;
            } else */
            if(is_limit && !constants.IS_APPBOX && os.name !== 'mac') {
                //单个大文件或者超过50个文件，都呼起PC起来下载
                this.download_by_client(files, text);
                return;
            }

            if (is_pack_down && !constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            //return this._down_files(files);
            var me = this;
            this.pre_down(files).done(function(opt) {
                console.log('disk go_down_file' + JSON.stringify(opt));
	            if(xuanfeng) {  //启动旋风下载标识
		            opt.xuanfeng = xuanfeng;
	            }
                me.go_down_file(files, opt);
                common_util.pre_down_report(0, files);

                //成功的也全部上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                common_util.pre_down_report(ret, files);
				//日志上报
	            var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
	            console_log.push('pre_down error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
	            if(files && files.length) {
		            for(var i=0, len=files.length; i<len; i++) {
			            console_log.push('error --------> files[' + i + ']  name: ' + files[i]._name + ', type: ' + files[i]._type + ', size: ' + files[i]._readability_size + ', md5: ' + files[i]._file_md5 + ', sha: ' + files[i]._file_sha);
		            }
	            }
	            logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        /**
         * 超过1G或者超过100个文件，呼起PC客户端起来下载
         * @param files
         */
        download_by_client: function(files, text) {
            //超过一百个，需要做批量分享，和批量操作
            var me = this;
            require.async(constants.HTTP_PROTOCOL + '//imgcache.qq.com/qzone/qzactStatics/configSystem/data/65/config1.js', function(config_data) {
                var os_name = os.name === 'mac'? 'mac_sync' : os.name,
                    download_url = (config_data && config_data[os_name] && config_data[os_name]['download_url']) || 'http://www.weiyun.com/download.html';
                me.get_share_key(files).done(function(share_key) {
                    var uin = query_user.get_uin_num(),
                        schema_url = "weiyun://download/?uin=" + uin + "&share_key=" + share_key;
                    if(!me._$download_dialog) {
                        me._$download_dialog = $(tmpl.download_dialog({text: text}));
                        me._$download_dialog.appendTo(document.body);
                    } else {
                        me._$download_dialog.find('[data-id=title]').text(text);
                    }
                    me._$download_dialog.find('#download_client').attr('href', download_url);
                    me._$download_dialog.find('#open_client').attr('href', schema_url);
                    me._$download_dialog.show();
                    me._$download_dialog.find('#close_dialog').on('click', function() {
                        me._$download_dialog.hide();
                    });
                });
            });
        },

        get_share_key: function(files) {
            var me = this,
                REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
                def = $.Deferred();

            var _files = [],
                _dirs = [];

            $.each(files, function (i, f) {
                if (f.is_dir()) {
                    _dirs.push({
                        pdir_key: f.get_pid(),
                        dir_key: f.get_id(),
                        dir_name: f.get_name()
                    });
                } else {
                    _files.push({
                        pdir_key: f.get_pid(),
                        file_id: f.get_id(),
                        filename: f.get_name(),
                        file_size: f.get_size()
                    });
                }
            });

            var req_body;
            req_body = {
                dir_list: _dirs,
                file_list: _files
            }

           request.xhr_post({
                    url: REQUEST_CGI,
                    cmd: 'ClipBoardTrans',
                    body: req_body,
                    cavil: true,
                    pb_v2: true
                }).ok(function (msg, body) {
                    var link = body['trans_key'];
                    def.resolve(link);
                }).fail(function (msg, ret) {
                   mini_tip.error(msg);
                   def.reject(msg);
                }).done(function () {
                });

            return def;
        },

        /**
         * 预下载（先向cgi拉取下载url）
         * @param files
         */
        pre_down: function(files) {
            var is_pack_down = files.length > 1 || (files.length === 1 && files[0].is_dir()),
                def = $.Deferred(),
                me = this;

            if(files[0].get_parent && files[0].get_parent().is_offline_dir && files[0].get_parent().is_offline_dir()) {
	            console.log('down_vfiles');
                this._down_vfiles(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            } else if(!is_pack_down) {
	            console.log('down_single_file');
                this._down_single_file(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            } else {
	            console.log('pack_down_files');
                this._pack_down_files(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            }

            return def;
        },

        _down_single_file: function(files) {

            var params_list = [],
                def = $.Deferred();

            $.each(files, function(i, file) {
                params_list.push({
                    file_id: file.get_id(),
                    filename: file.get_name(),
                    pdir_key: file.get_pid()
                });
            });

            var is_temporary_file = files[0].is_temporary && files[0].is_temporary(),
                url, cmd;
            if(is_temporary_file) {
                url = 'http://web2.cgi.weiyun.com/temporary_file.fcg';
                cmd = 'TemporaryFileDiskFileBatchDownload';
            } else {
                url = 'http://web2.cgi.weiyun.com/qdisk_download.fcg';
                cmd = 'DiskFileBatchDownload';
            }
            request.xhr_post({
                url: url,
                cmd: cmd,
                cavil: true,
                pb_v2: true,
                body: {
                    file_list: params_list
                }
            }).ok(function(msg , body) {
                var ftn_opt = body['file_list'][0];
                if(!ftn_opt.retcode) {
                    def.resolve(ftn_opt);
                } else {
                    mini_tip.warn(ftn_opt.retmsg || ret_msgs.get(ftn_opt.retcode) || '请求下载失败');
                    def.reject(ftn_opt.retmsg, ftn_opt.retcode);
                }
            }).fail(function(msg, ret) {
                mini_tip.warn(msg || '请求下载失败');
                def.reject(msg, ret);
            });

            return def;
        },

        _pack_down_files: function(files) {
            var first_file = files[0],
                zip_filename = common_util.get_zip_name(files),
                pdir_key = first_file.get_pid(),
                pdir_name = first_file.get_parent && first_file.get_parent().get_name() || '',
                dir_params_list = [],
                file_params_list = [];

            var def = $.Deferred(),
                me = this;

            if (!constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    dir_params_list.push({
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    });
                } else {
                    file_params_list.push({
                        file_id: file.get_id(),
                        filename: file.get_name(),
                        pdir_key: file.get_pid()
                    });
                }
            });

            var is_temporary_file = files[0].is_temporary && files[0].is_temporary(),
                url, cmd;
            if(is_temporary_file) {
                url = 'http://web2.cgi.weiyun.com/temporary_file.fcg';
                cmd = 'TemporaryFileDiskFilePackageDownload';
            } else {
                url = 'http://web2.cgi.weiyun.com/qdisk_download.fcg';
                cmd = 'DiskFilePackageDownload';
            }

            request.xhr_post({
                url: url,
                cmd: cmd,
                cavil: true,
                pb_v2: true,
                body: {
                    pdir_list: [{
                        pdir_key: pdir_key,
                        pdir_name: pdir_name,
                        file_list: file_params_list,
                        dir_list: dir_params_list
                    }],
                    zip_filename: common_util.fix_down_file_name(zip_filename)
                }
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                if((ret === 22073 || ret === 22077 || ret === 22078) && !constants.IS_APPBOX && os.name !== 'mac') {
                    var text = '您选择的文件包含文件夹';
                    switch(ret) {
                        case 22073:
                            text = '您选择的文件夹过多';
                            break;
                        case 22077:
                            text = '您选择的文件夹包含子文件夹';
                            break;
                        case 22078:
                            text = '您选择的文件夹内文件过多';
                            break;
                    }
                    me.download_by_client(files, text);
                } else {
                    mini_tip.warn(msg || '请求下载失败');
                }
                def.reject(msg, ret);
            }).done(function() {
                // 隐藏下载进度
                progress.hide_if(true, 'getting_down_url');
            });

            return def;

        },

        /**
         * 虚拟目录文件下载
         * @param files
         * @private
         */
        _down_vfiles: function(files) {
            if(files.length > 1 || files[0].is_dir()) {
                console.warn('虚拟目录文件不支持打包下载');
                return;
            }
            var params_list = [],
                def = $.Deferred();

            $.each(files, function(i, file) {
                params_list.push({
                    file_id: file.get_id(),
                    filename: file.get_name(),
                    owner_type: file.is_offline_node() && file.get_down_type()
                });
            });

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
                cmd: 'VirtualDirBatchFileDownload',
                cavil: true,
                pb_v2: true,
                body: {
                    pdir_key: files[0].get_pid(),
                    abstract: 0,
                    download_list: params_list
                }
            }).ok(function(msg , body) {
                var ftn_opt = body['ret_list'][0];
                if(!ftn_opt.retcode) {
                    def.resolve(ftn_opt);
                } else {
                    mini_tip.warn(ftn_opt.retmsg || ret_msgs.get(ftn_opt.retcode) || '请求下载失败');
                    def.reject(ftn_opt.retmsg, ftn_opt.retcode);
                }

            }).fail(function(msg, ret) {
                mini_tip.warn(msg || '请求下载失败');
                def.reject(msg, ret);
            });

            return def;
        },

        /**
         * 拼装成真正的ftn下载地址
         * @param files
         * @param ftn_opt
         * @returns {*}
         */
        get_real_down_url: function(files, ftn_opt) {
            var path,
                server_name,
                fname,
                fid,
                is_package = false,
                url;

            fid = $.map(files, function(file) {
                return file.get_id();
            });
            fid = fid.join(',');

            if(ftn_opt.download_url) {//虚拟目录文件下载会使用
                url = ftn_opt.download_url;
            }
            else {
                server_name = ftn_opt.server_name;
                if(files.length > 1 || files[0].is_dir()) { //打包下载
                    fname = common_util.get_zip_name(files);
                    path = ftn_opt.down_header + ftn_opt.down_body;
                    url = 'http://' + server_name + (ftn_opt.server_port ? ':' + ftn_opt.server_port : '') + '/ftn_handler/' + path;
                    is_package = true;
                } else {
                    fname = files[0].get_name();
                    path = ftn_opt.encode_url;
                }
                if(!is_package) {
                    url = 'http://' + server_name + (ftn_opt.server_port ? ':' + ftn_opt.server_port : '') + '/ftn_handler/' + path + '/';
                    url = urls.make_url(url, {
                        fname: fname,
                        cv: constants.APPID,
                        cn: 0
                    });
                }
            }

            url = https_tool.translate_download_url(url);
            if(constants.IS_APPBOX) {//APPBOX才会有用到
                this.save_fid_map(url.split('/')[4], fid);//key:down_key,value:fid
            }

            return url;
        },
        /**
         * 保存fid，用于appbox数据上报
         * @param key
         * @param fid
         */
        save_fid_map: function(key, fid) {
            global_var.set(key, fid);
        },

        /**
         * 到ftn下载文件
         * @param {Object} files 要下载的文件对象
         * @param {Object} ftn_opt 文件下载的参数
         * @private
         */
        go_down_file: function(files, ftn_opt) {
            var me = this,
	            $frame,
                result,
                cookie_name = ftn_opt.cookie_name,
                cookie_value = ftn_opt.cookie_value;

            var url = ftn_opt.ftn_url;

            cookie.set(cookie_name, cookie_value, {
                domain: constants.MAIN_DOMAIN,
                path: '/'
            });

            if(!cookie.get(cookie_name)) {
                //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                logger.report('weiyun_predownload', {
                    desc: 'there are no cookie',
                    appobx: constants.IS_APPBOX ? true : false
                });

                result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                logger.monitor('js_download_error', 1000501, result);
            } else if(cookie.get(cookie_name) !== cookie_value) {
                //正常来说，设置的cookie值应该会跟本地的一致，这里设置失败导致不一致的原因需要定位，所以也上报逻辑错误，先看下数据
                logger.report('weiyun_predownload', {
                    desc: cookie_value + ' cookie set fail',
                    appobx: constants.IS_APPBOX ? true : false
                });

                result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                logger.monitor('js_download_error', 1000502, result);
            }

            if(constants.IS_APPBOX) { // APPBOX 使用控件下载
                var args = common_util.get_down_args_for_client(files);
                external.ClickDownload(url + '/?', args.size, args.name, args.ico, document.cookie);
                console.log('cgi2.0 - appbox 控件下载：', url);
	            logger.report({
		            report_console_log: true
	            });

                return;
            } else if(constants.IS_QZONE && $.browser.msie) {
                //IE下在iframe内设置cookie会有问题，而且无法再用iframe方式下载，这里直接用location.href
                window.location.href = ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url;
                console.debug('qzone内嵌版微云使用location.href方式下载');
                logger.report({
                    report_console_log: true
                });
                return;
            }


            console.log('cgi2.0 - 浏览器下载：', url);

            //WEB 使用iframe or location.href跳转下载
            $frame = common_util.get_$down_iframe();
            // 如果上面的方式被IE阻止，则使用跳转方式
            try {
                if (cookie.get(cookie_name) !== cookie_value) {
                    console.error('FTN cookie 写入失败！');
                    throw 'cookie set fail';
                }
                $frame.attr('src', ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url);
                console.debug('使用iframe.src方式下载');
            }
            catch (x) {
                console.warn('使用iframe.src方式下载失败');
                window.location.href = ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url;
                console.debug('使用location.href方式下载');
            }

	        logger.report({
		        report_console_log: true
	        });
        },
        /**
         * 压缩包里的文件下载还在用这个老的方式，直接转成老的downloader处理了
         * @param url
         * @param name
         * @param size
         * @param ico
         */
        down_url_standard_post: function (url, name, size, ico) {
            downloader.down_url_standard_post.apply(downloader, arguments);
        },

        get_down_name: function(name) {
            return common_util.get_down_name(name);
        },

	    covert_xuanfeng_url: function(url) {
		    return 'qqdl://' + covert.toBase64(url);
	    }
    };

    var downloader = {
        /**允许外部扩展FileObject
         setFileNode: function( fileNode){
            FileObject = fileNode;
        },
         **/

        /**
         * 下载
         * @param {Array<FileObject>|FileObject} files
         * @param {jQuery.Event} e
         */
        down: function (files, e) {
            //引导升级吧，老的cgi不再维护
            var desc = '为了有更好的下载体验请<a href="http://im.qq.com/pcqq/" target="_blank">升级QQ</a>，或使用<a href="http://www.weiyun.com/disk/index.html" target="_blank">网页版</a>下载文件。';
            widgets.confirm('提示', '您的QQ版本过老', desc, $.noop, $.noop, ['确定'], false);
            return;

            if (!files || !common_util.is_user_trigger(e) || !common_util.check_down_cookie()) {
                console.warn('downloader.down()参数无效');
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn('downloader.down()参数无效');
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('downloader.down()没有可下载的文件');
                return false;
            }


            e.preventDefault();

            var is_pack_down = files.length > 1 || (files.length === 1 && files[0].is_dir());
            if (is_pack_down && files.length > pack_down_limit) {
                mini_tip.warn('打包下载不能超过' + pack_down_limit + '个文件');
                return false;
            }

            if (is_pack_down && !constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            return this._down_files(files);
        },
        /**
         * 拖拽下载
         * @param {Array<FileObject>} files
         */
        drag_down: function (files) {
            if (!common_util.check_down_cookie() || !files || !files.length) {
                return false;
            }

            var args = downloader._get_down_args_for_client(files);
            setTimeout(function () {
                try {
                    plugin_route.call_drag_download(args.name, args.size, args.url, args.ico, args.is_pack_down);
                }
                catch (e) {
                    console.error('拖拽下载失败 ', e.message);
                }
            }, 10);
        },

        /**
         * 下载指定URL的文件
         * @param {String} url
         * @param {String} name
         * @param {Number} size
         */
        down_url: function (url, name, size) {

            var by_client_ok = false;

            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    var type = FileObject.get_type(name);
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    plugin_route.call_download(url + '#', size + '', name, 'ico-' + (type || 'file'));
                    by_client_ok = true;
                }
                catch (e) {
                }
            }
            if (!by_client_ok) {
                var url_obj = url_parser.parse(url);

                url = urls.make_url(url_obj.get_url(), $.extend(url_obj.get_params(), { err_callback: down_fail_callback_url }));

                this._down_url(url, true);
            }
        },

        /**
         * @deprecated 已废弃  (实际上压缩包里的文件下载还在用，日哦，日后得改造)
         */
        down_url_standard_post: function (url, name, size, ico) {    //强制使用标准post, 参数放到body里
            console.debug('down_url_standard_post2');
            var by_client_ok = false;

            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    if (size === "0" || size === 0) {
                        size = "-1";
                    }
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    var ret = plugin_route.call_download(url + '#', size + '', name, 'ico-' + ico);
                    console.debug('url= ' + url, size, name, ico);
                    console.error('ret= ' + ret);
                    by_client_ok = true;
                }
                catch (e) {
                }
            }

            if (!by_client_ok) {
                var url_obj = url_parser.parse(url);

                url = urls.make_url(url_obj.get_url(), $.extend({}, { err_callback: down_fail_callback_url }, url_obj.get_params()));

                this._down_url_standard_post(url, true);
            }
        },

        /**
         * 执行下载
         * @param {Array<FileObject>} files
         * @private
         */
        _down_files: function (files) {

            var by_client_ok = false;
            var me=this;
            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    var args = downloader._get_down_args_for_client(files);
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    plugin_route.call_download(args.url + '#', args.size, args.name, args.ico, args.is_pack_down);
                    by_client_ok = true;
                }
                catch (e) {
                }
            }


            if (!by_client_ok) {
                // 如果使用客户端API下载失败，或非QQ客户端，则使用form+iframe下载


                var url = this.get_down_url(files, {
                    err_callback: down_fail_callback_url
                });

                this._down_url(url, files.length === 1);
            }
            common_util.pre_down_report(0, files);
            return true;
        },

        _down_url: function (url, is_single_file) {
            // james 20130527: IE下单文件使用location跳转，多文件使用form+iframe
            if (use_redirect_download) {
                window.location.href = url;
                return console.debug('IE单文件下载请使用location.href方式');
            }
            else {
                var
                    $frame = common_util.get_$down_iframe(),
                    $form = this._get_$down_form(),
                    _url_obj,
                    _url,
                    _url_param;

                if (!is_single_file) {     //多文件打包下载.
                    _url_obj = url_parser.parse(url);
                    _url = _url_obj.get_url() + '?post=1';
                    _url_param = _url_obj.get_params();
                } else {
                    _url = url;
                    _url_param = {};
                }

                try {
                    $form
                        .empty()
                        .attr('action', _url)
                        .attr('target', $frame.attr('name'))
                        .attr('method', 'POST');

                    //http://sync.box.qq.com/pack_dl.fcg
                    //http://sync.box.qq.com/pack_dl.fcg

                    $.each(_url_param, function (name, value) {
                        $('<input type="hidden" name="' + name + '"/>').val(value).appendTo($form);
                    });

                    $form[0].submit();

                    console.debug('使用form+iframe方式下载');
                }
                catch (e) {
                    console.warn('使用form+iframe方式下载失败');
                    // 如果上面的方式被IE阻止，则使用跳转方式
                    try {
                        $frame.attr('src', url);
                        console.debug('使用iframe.src方式下载');
                    }
                    catch (x) {
                        console.warn('使用iframe.src方式下载失败');
                        window.location.href = url;
                        console.debug('使用location.href方式下载');
                    }
                }
            }
        },

        /**
         * @deprecated 已废弃
         */
        _down_url_standard_post: function (url, is_single_file) {
            // james 20130527: IE下单文件使用location跳转，多文件使用form+iframe
            if (use_redirect_download) {
                window.location.href = url;
                return console.debug('IE单文件下载请使用location.href方式');
            }
            else {

                var
                    $frame = common_util.get_$down_iframe(),
                    $form = this._get_$down_form(),
                    _url_obj,
                    _url,
                    _url_param;

                _url_obj = url_parser.parse(url);
                _url = _url_obj.get_url() + '?post=1';
                _url_param = _url_obj.get_params();

                try {
                    $form
                        .empty()
                        .attr('action', _url)
                        .attr('target', $frame.attr('name'))
                        .attr('method', 'POST');

                    $.each(_url_param, function (name, value) {
                        $('<input type="hidden" name="' + name + '"/>').val(value).appendTo($form);
                    });

                    $form[0].submit();

                    console.debug('使用form+iframe方式下载');
                }
                catch (e) {
                    console.warning('使用form+iframe方式下载失败');
                    // 如果上面的方式被IE阻止，则使用跳转方式
                    try {
                        $frame.attr('src', url);
                        console.debug('使用iframe.src方式下载');
                    }
                    catch (x) {
                        console.warning('使用iframe.src方式下载失败');
                        window.location.href = url;
                        console.debug('使用location.href方式下载');
                    }
                }
            }
        },
        /**
         * @deprecated 已废弃 获取下载的URL
         * @param fileid
         * @param pdir
         * @param file_name
         * @returns {String} url（了扩展字段以外，只对文件名编码）
         */
        get_down_url2: function (fileid, pdir, file_name) {
            var _url = url_tpl_single,
                params = {
                    fid: fileid,
                    pdir: pdir,
                    fn: common_util.fix_down_file_name(file_name),
                    uin: query_user.get_uin_num(),
                    skey: query_user.get_skey(),
                    err_callback: down_fail_callback_url
                },

                url = urls.make_url(_url, params, false); // enc_value=false

            url += ('&ver=' + (constants.IS_APPBOX ? 12 : 11));
            //添加 sec_enc=1 作为转码标识 ,防止中文名被转码     by trump     just for safari
            if ($.browser.safari) {
                url += '&sec_enc=1';
            }
            return url;
        },
        /**
         * 获取下载的URL
         * @param {Array<FileObject>} files
         * @param {Object} [ex_params] 扩展参数（会对键值进行编码）
         * @param {Boolean} [params_uin_skey] 是否在GET参数中带上uin、skey
         * @returns {String} url（了扩展字段以外，只对文件名编码）
         */
        get_down_url: function (files, ex_params, params_uin_skey) {

            if (!files) {
                return '#';
            }
            if (FileObject.is_instance(files)) {
                files = [files];
            }

            var params,
                file_name,
                tpl_url,
                file_name_field,
            // 单文件
                single_file = files.length === 1 && !files[0].is_dir();

            if (single_file) {
                var file = files[0];

                tpl_url = url_tpl_single;
                if(ex_params){
                    //预览支持gif动画
                    if(file.is_image()){
                        if(  (FileObject.get_type(file.get_name()) || '').toLowerCase() === 'gif' && ex_params['abs'] === '1024*1024' ){
                            delete ex_params['abs'];
                        } else if( ex_params['thumb']  ){
                            tpl_url = thumb_tpl_single;
                            delete ex_params['thumb'];
                        }
                    }
                }
                file_name = common_util.trim_file_name(common_util.get_down_name(file.get_name()));
                file_name_field = 'fn';
                params = {
                    fid: file.get_id(),
                    pdir: file.get_pid() || file.get_parent().get_id()
                };
            }
            // 打包
            else {
                var _dirs = [], _files = [];
                $.each(files, function (i, f) {
                    (f.is_dir() ? _dirs : _files).push(f.get_id());
                });

                tpl_url = url_tpl_zip;
                file_name = common_util.get_zip_name(files);
                file_name_field = 'zn';
                params = {
                    fid: _files.join(','),
                    dir: _dirs.join(','),
                    pdir: files[0].get_pid() || files[0].get_parent().get_id()
                };
            }

            // 文件名参数特殊处理
            params[file_name_field] = common_util.fix_down_file_name(file_name);

            // 如果无法通过cookie下载，则带上uin/skey在GET参数里
            if (!common_util.can_use_cookie(tpl_url) || params_uin_skey) {
                params.uin = query_user.get_uin_num();
                params.skey = query_user.get_skey();
            }
            params.appid = constants.APPID;
            //QQ1.98才加上token验证
            //if(window.external.GetVersion){
            params.token = security.getAntiCSRFToken();
            //}

            // 打击盗链 - james
            var user = query_user.get_cached_user();
            params.checksum = user ? user.get_checksum() : '';

            // 扩展参数（不允许覆盖已有的参数）
            if (ex_params) {
                $.each(ex_params, function (ex_key, ex_val) {
                    if (!(ex_key in params) && ex_val != undefined) {
                        params[encode(ex_key)] = encode(ex_val);
                    }
                });
            }

            var url = urls.make_url(tpl_url, params, false); // enc_value=false

            // ver 参数要放到最后，这是appbox的一个bug导致的（appbox的下载API会在URL后面加上'/<file_name>'） @james
            url += ('&ver=' + (constants.IS_APPBOX ? 12 : 11));
            //添加 sec_enc=1 作为转码标识 ,防止中文名被转码     by trump     just for safari
            if ($.browser.safari) {
                url += '&sec_enc=1';
            }
            return url;
        },

        /**
         * 通过CGI获取下载地址
         * @param {String} url
         * @return {$.Deferred}
         */
        get_ftn_url_from_cgi: function (url) {
            var def = $.Deferred();

            // 去除URL中的err_callback参数，并添加redirect=0参数
            var url_obj = url_parser.parse(url),
                params = url_obj.get_params();

            delete params['err_callback'];
            params['redirect'] = 0;

            //获取fileid追加到存储的地址上，让客户端得到
            var fileid = params['fid'];

            url = urls.make_url(url_obj.get_url(), params);

            console.debug('请求CGI获取FTN地址 ' + url);

            request.xhr_get({
                url: url,
                just_plain_url: true,
                re_try: 0,
                safe_req: true,
                data_adapter: function (rsp_data, headers) {
                    var ret = parseInt('ret' in rsp_data ? rsp_data.ret : headers['X-ERRNO']) || 0;
                    rsp_data = ret == 0 ? {
                        rsp_header: { ret: ret },
                        rsp_body: {
                            cookie_name: rsp_data['cookie_name'],
                            cookie_value: rsp_data['cookie_value'],
                            url: rsp_data['url']
                        }
                    } : {
                        rsp_header: { ret: ret },
                        rsp_body: {}
                    };
                    return rsp_data;
                }
            })
                .ok(function (msg, body) {
                    console.debug('FTN地址已取得 url=' + body.url + ', cookie_name=' + body.cookie_name + ', cookie_value=' + body.cookie_value);
                    //追加fileid到存储url上
                    var ftn_url = body.url + '&fid=' + fileid;
                    def.resolve(ftn_url, body.cookie_name, body.cookie_value);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });
            return def;
        },

        /**
         * iframe 下载错误的回调
         * @param {Number} ret 错误码
         * @param {String} [msg] 错误消息
         */
        down_fail_callback: function (ret, msg) {
            // 会话超时 和 独立密码验证失败 特殊处理
            if (ret_msgs.is_sess_timeout(ret)) {
                session_event.trigger('session_timeout');
            } else if (ret === ret_msgs.INVALID_INDEP_PWD) {
                session_event.trigger('invalid_indep_pwd');
            } else if (ret === ret_msgs.ACCESS_FREQUENCY_LIMIT) {
                mini_tip.warn(msg ? text.text(msg) : ret_msgs.get(ret));
            } else {
                // 显示错误提示
                mini_tip.error(msg ? text.text(msg) : ret_msgs.get(ret));
                if (ret === ret_msgs.FILE_NOT_EXIST) {
                    session_event.trigger('downloadfile_not_exist');
                }
            }

            // 隐藏下载进度
            progress.hide_if(true, 'getting_down_url');
        },

        /**
         * 获取QQ客户端下载所需的参数
         * @param {Array<FileObject>} files
         * @return {Object} 包含了 url, size, name, ico 的对象
         * @private
         */
        _get_down_args_for_client: function (files) {
            var args,
                is_single_down = files.length === 1 && !files[0].is_dir(),

                down_url = this.get_down_url(files);

            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    url: down_url,
                    //size: files[0].get_size() + '',
                    size: file_size,
                    name: files[0].get_name(),
                    ico: 'ico-' + (files[0].get_type() || 'file')
                };
            }
            // 是目录或包含多个文件时，取「压缩」后的属性
            else {
                var total_size = 0;
                $.each(files, function (i, f) {
                    total_size += f.get_size();
                });

                // 我们无法取得目录的大小，所以如果size为0，则给一个 -1 表示未知文件大小
                if (total_size === 0) {
                    total_size = pack_default_size;
                }
                args = {
                    url: down_url,
                    name: common_util.get_zip_name(files) + '.' + pack_file_ext,
                    size: total_size + '',
                    ico: 'ico-' + pack_file_ext
                };
            }
            args.is_pack_down = !is_single_down;//是否打包下载
            // 修复客户端下载 400 Bad Request 的bug
            //args.name = args.name.replace(/\s/g, '_');
            //QQ1.98后修正了文件名空格问题
            if (!window.external.GetVersion) {
                args.name = args.name.replace(/\s/g, '_');
            }

            return args;
        },

        _get_$down_form: function () {
            return this._$down_form || (this._$down_form = $('<form method="GET" enctype="application/x-www-form-urlencoded"></form>').appendTo($downloader_ct));
        },
        get_down_name: function(name) {
            return common_util.get_down_name(name);
        }
    };

    var common_util = {


        get_$down_iframe: function () {
            return $down_iframe;
        },

        get_$down_els: function () {
            return $downloader_ct;
        },

        /**
         * 检查是否是用户行为
         * @param {jQuery.Event} e jQuery事件实例
         */
        is_user_trigger: function (e) {
            if (e instanceof $.Event) {
                return true;
            } else {
                console.error('该方法只能由用户行为触发，请传入jQuery.Event实例以确保该操作可以正常工作');
                return false;
            }
        },
        /**
         * 下载前的cookie检查
         * @returns {boolean}
         */
        check_down_cookie: function () {
            var is_sign_in = !!query_user.check_cookie();

            if (!is_sign_in) {
                session_event.trigger('session_timeout');
            }

            return is_sign_in;
        },
        /**
         * 获取QQ客户端下载所需的参数
         * @param {Array<FileObject>} files
         * @return {Object} 包含了 url, size, name, ico 的对象
         * @private
         */
        get_down_args_for_client: function (files) {
            var args,
                is_single_down = files.length === 1 && !files[0].is_dir();
            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    //size: files[0].get_size() + '',
                    size: file_size,
                    name: files[0].get_name(),
                    ico: 'ico-' + (files[0].get_type() || 'file')
                };
            }
            // 是目录或包含多个文件时，取「压缩」后的属性
            else {
                var total_size = 0;
                $.each(files, function (i, f) {
                    total_size += f.get_size();
                });

                // 我们无法取得目录的大小，所以如果size为0，则给一个 -1 表示未知文件大小
                if (total_size === 0) {
                    total_size = pack_default_size;
                }
                args = {
                    name: common_util.get_zip_name(files) + '.' + pack_file_ext,
                    size: total_size + '',
                    ico: 'ico-' + pack_file_ext
                };
            }
            args.is_pack_down = !is_single_down;//是否打包下载
            // 修复客户端下载 400 Bad Request 的bug
            //args.name = args.name.replace(/\s/g, '_');
            //QQ1.98后修正了文件名空格问题
            if (!window.external.GetVersion) {
                args.name = args.name.replace(/\s/g, '_');
            }

            return args;
        },

        get_zip_name: function (files) {
            var zip_name_len = shaque_ie6 ? ie6_down_name_len : pack_file_name_len,
                file_name = files[0].get_name_no_ext(),
                zip_name;

            if (files.length === 1) {
                zip_name = text.smart_sub(file_name, zip_name_len);
            }
            else {
                var suffix = ['等', '十', '个文件'];
                // 将文件名“张三的简历深圳web前端等10个文件”调整为“张三的简历深圳..等10个文件”
                file_name = text.smart_sub(file_name, zip_name_len - suffix[0].length - suffix[1].length - suffix[2].length);
                zip_name = text.format('{first_name}{suffix_0}{count}{suffix_2}', { first_name: file_name, count: files.length, suffix_0: suffix[0], suffix_2: suffix[2] });
            }
            //console.log('zip_name', zip_name);
            return zip_name;
        },
        // 整理下载的文件名
        get_down_name: function (name) {

            if (!/\./.test(name)) {
                return this.fix_ext(name, '');
            }

            var idx = name.lastIndexOf('.'),
                ext = name.substring(idx + 1),
                sub = name.substring(0, idx);

            if (re_cn_char.test(ext)) {
                return this.fix_ext(name, '');
            } else {
                return this.fix_ext(sub, ['.', ext].join(''));
            }
        },

        /**
         * 文件名特殊处理
         * 目前只编码文件名（考虑到存储侧对于chrome的下载请求输出头部文件名的问题，且chrome会自动编码，这里对chrome就只编码URL特殊字符）
         * james
         */
        fix_down_file_name: function (file_name) {
            if ($.browser.webkit && !constants.IS_WEBKIT_APPBOX) {
                return text.to_dbc(file_name, sbc_map);
            } else {
                return encode(file_name);
            }
        },

        /*
         * IE下，url最大长度限定为20xx左右，这里限定文件名只使用1500字节，避免IE10下出错。
         * 其它浏览器限定7000，基本都是够用的
         */
        trim_file_name : function(full_name){
            var limit = $.browser.msie ? 1500 : 7000;
            var ext_index = full_name.lastIndexOf('.'),
                name = full_name,
                ext = '',
                ellipsis_tail = '...';
            if(ext_index>=0){
                name = full_name.slice(0, ext_index);
                ext = full_name.slice(ext_index);
                limit -= encode(ext).length;
            }
            // 二分法定位最合适切割点
            var full_size = encode(name).length, start, end, guess, guessValue, cut_index;
            if(full_size <= limit){
                cut_index = name.length;
            }else{
                limit -= encode(ellipsis_tail).length;
                start = 0;
                end = name.length;
                while(end > start){
                    guess = Math.ceil((start + end)/2);
                    guessValue = encode(name.slice(0, guess)).length;
                    if(guessValue > limit){
                        end = guess-1;
                        guess--;
                    }else if(guessValue < limit){
                        start = guess;
                    }else{
                        break;
                    }
                }
                cut_index = guess;
            }
            return name.slice(0, cut_index) + (cut_index<name.length ? ellipsis_tail : '') + ext;
        },

        // 后缀名处理
        fix_ext: function (s, ext) {
            if (shaque_ie) {
                if (shaque_ie6 && text.byte_len(s) > 2 * ie6_down_name_len) {
                    //s = text.smart_sub(s, ie6_down_name_len) + '..';
                    s = text.smart_sub(s, ie6_down_name_len - 2) + '..' + s.substring(s.length - 2);
                }
                if ('' == ext) {
                    ext = '.-';
                }
            }
            return s + ext;
        },
        // 判断appbox的控件是否支持传入cookie
        supported_cookie: function () {
            try {
                if (!constants.IS_APPBOX)
                // 非appbox这里返回true
                    return true;

                // 1.97以下版本的控件没有 GetVersion 方法，不支持传入cookie
                if (!external.GetVersion)
                    return false;

                // 新版本可以支持
                if (external.GetVersion() >= 5287)
                    return true;
            } catch (e) {
            }
            return false;
        },
        // 判断是否是同域
        is_same_domain: function (url) {
            // return new RegExp('^https?:\\/\\/(\\w+\\.)*' + document.domain.replace(/\./, '\\.') + '\\/.?').test(url);
            return url.indexOf(url_tpl_single) === 0;
        },
        // 请求下载地址时能否在cookie中带上验证信息
        can_use_cookie: function (url) {
            return this.supported_cookie() && this.is_same_domain(url);
        },

        /**
         * 预下载数据上报
         * @param files
         */
        pre_down_report: function(ret_code, files) {
            //下载行为 上报到41表     yuyanghe 2013-12-27
            var Download_info=function(){
                this.file_size;
                this.file_name;
                this.file_id;
                this.file_ext;
                this.is_package;
            }

            var download_info=new Download_info(),
                me = this;

            if (files.length == 1 && !files[0].is_dir()) {
                download_info.is_package=false;
                download_info.file_name = me.get_down_name(files[0].get_name());
                download_info.file_size = files[0].get_size();
                var idx = files[0].get_name().lastIndexOf('.');
                if (idx > 0) {
                    download_info.file_ext = files[0].get_name().substring(idx + 1);
                }
                download_info.file_id = files[0].get_id();
            } else {
                download_info.is_package=true;
                download_info.file_name = common_util.get_zip_name(files);
                $.each(files, function (i, f) {
                    download_info.file_size += f.get_size();
                });
                download_info.file_ext = 'zip';
            }

            download_info.ret_code = ret_code;
            stat_log.pre_download_stat_report_41(download_info);
        }
    };

    var $downloader_ct,
        $down_iframe;

    function create_$down_iframe() {
        $downloader_ct = $('<div data-id="downloader" style="display:none;"></div>').appendTo(document.body);
        $down_iframe = $('<iframe name="_download_iframe" src="' + constants.DOMAIN + '/set_domain.html"></iframe>').appendTo($downloader_ct);
    }

    // 提前加载iframe
    $(function () {
        create_$down_iframe();
    });

    downloader.supported_cookie = downloader_v2.supported_cookie = common_util.supported_cookie;
    if(common_util.supported_cookie()) {
        return downloader_v2;
    } else { //appbox 1.97及之前的老版本采用老的downloader
        return downloader;
    }

});