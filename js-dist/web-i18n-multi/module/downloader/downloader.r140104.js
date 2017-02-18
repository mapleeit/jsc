//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/downloader/downloader.r140104",["lib","common","$","i18n"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//downloader/src/downloader.js

//js file list:
//downloader/src/downloader.js
/**
 * 下载
 * @author jameszuo
 * @date 13-3-27
 */
define.pack("./downloader",["lib","common","$","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('downloader'),
        text = lib.get('./text'),
        security = lib.get('./security'),
        url_parser = lib.get('./url_parser'),
        cookie = lib.get('./cookie'),

        query_user = common.get('./query_user'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        ret_msgs = common.get('./ret_msgs'),
        urls = common.get('./urls'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip'),
        FileObject = common('./file.file_object'),
        request = common('./request'),

        _ = require('i18n').get('./pack'),
        l_key = 'downloader',

    // 单文件下载URL模板
        url_tpl_single = 'http://download.cgi.weiyun.com/wy_down.fcg',

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
                        window.external.MsgBox_Confirm(_(l_key, '提示'), _(l_key, '你的QQ版本暂不支持下载4G以上的文件。'), 0);
                    }, 0);
                }
                else {
                    // 可使用cookie方式下载
                    if (can_use_cookie(url)) {

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
                    external.DragMultiFileDownload(url + '#', size, name, ico);
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
            if (!files || !this._is_user_trigger(e) || !this._check_down_cookie()) {
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
                mini_tip.warn(text.format('打包下载不能超过{0}个文件', pack_down_limit));
                return false;
            }

            if (is_pack_down && !constants.IS_WEBKIT_APPBOX) {
                progress.show(_(l_key, '正在获取下载地址'), 2, true, 'getting_down_url');
            }

            return this._down_files(files);
        },

        /**
         * 拖拽下载
         * @param {Array<FileObject>} files
         */
        drag_down: function (files) {
            if (!this._check_down_cookie() || !files || !files.length) {
                return false;
            }

            var args = this._get_down_args_for_client(files);

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
         * @deprecated 已废弃
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

            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    var args = this._get_down_args_for_client(files);
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
                    $frame = this._get_$down_iframe(),
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
                    $frame = this._get_$down_iframe(),
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
                    fn: this._fix_down_file_name(file_name),
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
         * @returns {String} url（了扩展字段以外，只对文件名编码）
         */
        get_down_url: function (files, ex_params) {

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
                file_name = this.get_down_name(file.get_name());
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
                file_name = this._get_zip_name(files);
                file_name_field = 'zn';
                params = {
                    fid: _files.join(','),
                    dir: _dirs.join(','),
                    pdir: files[0].get_pid() || files[0].get_parent().get_id()
                };
            }

            // 文件名参数特殊处理
            params[file_name_field] = this._fix_down_file_name(file_name);

            // 如果无法通过cookie下载，则带上uin/skey在GET参数里
            if (!can_use_cookie(tpl_url)) {
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

            url = urls.make_url(url_obj.get_url(), params);

            console.debug('请求CGI获取FTN地址 ' + url);

            request.xhr_get({
                url: url,
                just_plain_url: true,
                re_try: 0,
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
                    def.resolve(body.url, body.cookie_name, body.cookie_value);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });
            return def;
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
                    name: this._get_zip_name(files) + '.' + pack_file_ext,
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

        /**
         * iframe 下载错误的回调
         * @param {Number} ret 错误码
         * @param {String} [msg] 错误消息
         */
        down_fail_callback: function (ret, msg) {
            // 会话超时 和 独立密码验证失败 特殊处理
            if (ret === ret_msgs.INVALID_SESSION) {
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
         * 下载前的cookie检查
         * @returns {boolean}
         */
        _check_down_cookie: function () {
            var is_sign_in = !!query_user.get_uin() && !!query_user.get_skey();

            if (!is_sign_in) {
                session_event.trigger('session_timeout');
            }

            return is_sign_in;
        },

        _get_zip_name: function (files) {
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
            console.log('zip_name', zip_name);
            return zip_name;
        },

        /**
         * 检查是否是用户行为
         * @param {jQuery.Event} e jQuery事件实例
         */
        _is_user_trigger: function (e) {
            if (e instanceof $.Event) {
                return true;
            } else {
                console.error('该方法只能由用户行为触发，请传入jQuery.Event实例以确保该操作可以正常工作');
                return false;
            }
        },

        // 整理下载的文件名
        get_down_name: function (name) {

            if (!/\./.test(name)) {
                return this._fix_ext(name, '');
            }

            var idx = name.lastIndexOf('.'),
                ext = name.substring(idx + 1),
                sub = name.substring(0, idx);

            if (re_cn_char.test(ext)) {
                return this._fix_ext(name, '');
            } else {
                return this._fix_ext(sub, ['.', ext].join(''));
            }
        },

        // 后缀名处理
        _fix_ext: function (s, ext) {
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

        _get_$down_els: function () {
            return this._$down_el = (this._$down_el || $('<div data-id="downloader" style="display:none;"></div>').appendTo(document.body));
        },

        _get_$down_iframe: function () {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="_download_iframe" src="' + constants.DOMAIN + '/set_domain.html"></iframe>').appendTo(this._get_$down_els()));
        },

        _get_$down_form: function () {
            return this._$down_form || (this._$down_form = $('<form method="GET" enctype="application/x-www-form-urlencoded"></form>').appendTo(this._get_$down_els()));
        },

        /**
         * 文件名特殊处理
         * 目前只编码文件名（考虑到存储侧对于chrome的下载请求输出头部文件名的问题，且chrome会自动编码，这里对chrome就只编码URL特殊字符）
         * james
         */
        _fix_down_file_name: function (file_name) {
            if ($.browser.webkit && !constants.IS_WEBKIT_APPBOX) {
                return text.to_dbc(file_name, sbc_map);
            } else {
                return encode(file_name);
            }
        }
    };

    // 判断appbox的控件是否支持传入cookie
    var supported_cookie = function () {
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
    };

    // 判断是否是同域
    var is_same_domain = function (url) {
        // return new RegExp('^https?:\\/\\/(\\w+\\.)*' + document.domain.replace(/\./, '\\.') + '\\/.?').test(url);
        return url.indexOf(url_tpl_single) === 0;
    };

    // 请求下载地址时能否在cookie中带上验证信息
    var can_use_cookie = function (url) {
        return supported_cookie() && is_same_domain(url);
    };

    // 提前加载iframe
    $(function () {
        downloader._get_$down_iframe();
    });

    return downloader;
});