//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/drag_files/drag_files.r140710",["lib","common","$","downloader"],function(require,exports,module){

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
//drag_files/src/drag_files.js

//js file list:
//drag_files/src/drag_files.js
/**
 * 从appbox拖拽发送qq文件
 * @author bondli
 * @date 13-10-17
 */
define.pack("./drag_files",["lib","common","$","downloader"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        functional = common.get('./util.functional'),

        FileObject = common('./file.file_object'),

        console = lib.get('./console'),
        JSON = lib.get('./json'),

        text = lib.get('./text'),
        security = lib.get('./security'),
        url_parser = lib.get('./url_parser'),

        query_user = common.get('./query_user'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        ret_msgs = common.get('./ret_msgs'),
        urls = common.get('./urls'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip'),
        request = common.get('./request'),
        downloader = require('downloader').get('./downloader'),

    // 单文件下载URL模板
        url_tpl_single = 'http://download.cgi.weiyun.com/wy_down.fcg',

    // 打包下载URL模板
        url_tpl_zip = 'http://sync.box.qq.com/pack_dl.fcg',

        encode = encodeURIComponent,
        pack_file_name_len = 28, // 打包下载文件名长度上限
        pack_file_ext = 'zip', // 打包下载的文件类型
        re_cn_char = /[^\x00-\xff]/, // 全角字符
        pack_default_size = -1, // 打包下载无法取得文件大小时的默认值

        undefined;


    /**
     * 文件被拖入QQ聊天框后客户端回调接口
     * @param taskid
     * @param error
     * @param destType  表示拖入的端（0：个人聊天/临时会话/1：讨论组/2：群）
     * @param destId  对方QQ号码（对方qq号，讨论组id，或者群id）
     */
    window.WYCLIENT_OnSendDragFiles = function (taskid, error, destType, destId) {
        console.debug('WYCLIENT_OnSendDragFiles', taskid, error, destType, destId);
        //数据上报
        if (error === "0") {
            var arr = {
                0: 'DRAG_FILE_SEND_TO_QQ',
                1: 'DRAG_FILE_SEND_TO_QUN',
                2: 'DRAG_FILE_SEND_TO_TMP',
                3: 'DRAG_FILE_SEND_TO_GROUP'
            };
            user_log(arr[destType]);
        }
        return 1;
    };

    var plugin_route = {
        /**
         * 调用控件的拖拽事件
         * @param {String} args.filesInfo[].url
         * @param {String} args.filesInfo[].size
         * @param {String} args.filesInfo[].name
         * @param {String} args.filesInfo[].fleId
         * @param {String} args.filesInfo[].thumUrl
         * @param {String} args.filesInfo[].isFolder
         * @param {String} args.filesInfo[].fileResource
         * @param {String} args.filesInfo[].cookie
         *
         * @param {String} args.packInfo.url
         * @param {String} args.packInfo.name
         * @param {String} args.packInfo.cookie
         */
        drag_files: function (args) {  //是否打包下载由客户端管理，文件选择是否合法由客户端处理
            var url = args.packInfo.url || args.filesInfo[0].url;

            if (can_use_cookie(url)) {
                this._handle_drag(args);
            }
            else {
                //返回taskid
                return window.external.DragFiles(JSON.stringify(args));
            }
        },


        /**
         * 通过句柄+回调方式实现拖拽下载，等待客户端回调。（通过CGI取得FTN地址后再请求，避免旋风控件发出大量指向CGI的重试请求） - james
         * @param {Object} args
         * @private
         */
        _handle_drag: function (args) {
            var me = this,
                handle_id = new Date().getTime().toString(32);

            // 传给客户端接口的 handler_id
            args['dataHandle'] = handle_id;
            // 本地记录 handler_id
            me._drag_handlers[handle_id] = args;
            // 监听拖拽下载回调
            if (!me._drag_listening) {

                /**
                 * 拖拽下载的回调
                 * @param {String} handler_id 句柄ID
                 * @param {String} save_path 文件拖拽到的目录
                 */
                var on_drag_download = function (handler_id, save_path) {

                    console.debug('已回调 WYCLIENT_OnDragDownload，handler_id=' + handler_id + ', save_path=' + save_path);

                    // 通过句柄取得下载参数（可能出现拖拽到回收站等操作，drag_handlers中的数据不一定能够完全销毁，这里暂时没有好的方案） - james
                    var args = me._drag_handlers[handler_id];
                    delete me._drag_handlers[handler_id];

                    var pack_info = args['packInfo'];
                    var files_info = args['filesInfo'];
                    var meta_data = {
                        url: pack_info.url || files_info[0].url,
                        name: pack_info.name || files_info[0].name,
                        size: (pack_info.size || files_info[0].size || 0) + '',
                        thumb: pack_info.thumUrl || files_info[0].thumUrl,
                        cookie: args['cookie']
                    };


                    // 开始下载，cgi2.0支持拉实际下载地址，则可以直接下载
                    external.RawDownloadFile(
                        meta_data.url,
                        meta_data.size,
                        meta_data.name,
                        meta_data.thumb,
                        save_path + '\\' + meta_data.name,
                        meta_data.cookie
                    );

                    // 请求CGI获取FTN下载地址
/*                    request.xhr_get({
                        url: meta_data.url + '&redirect=0',
                        just_plain_url: true,
                        re_try: 0,
                        data_adapter: function (rsp_data, headers) {
                            var ret = parseInt('ret' in rsp_data ? rsp_data.ret : headers['X-ERRNO']) || 0;
                            rsp_data = ret == 0 ? {
                                rsp_header: { ret: ret },
                                rsp_body: {
                                    cookie: (rsp_data['cookie_name'] || rsp_data['cookie_name:']) + '=' + (rsp_data['cookie_value'] || rsp_data['cookie_value:']) + ';',
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
                            console.debug([
                                '调用客户端下载接口 RawDownloadFile(',
                                'url=' + body.url,
                                'size=' + meta_data.size,
                                'name=' + meta_data.name,
                                'thumb=' + meta_data.thumb,
                                'path=' + save_path + '\\' + meta_data.name,
                                'cookie=' + body.cookie
                            ].join('<br>'));

                            // 开始下载
                            external.RawDownloadFile(
                                body.url,
                                meta_data.size,
                                meta_data.name,
                                meta_data.thumb,
                                save_path + '\\' + meta_data.name,
                                body.cookie
                            );
                        })
                        .fail(function (msg, ret) {
                            console.error('获取FTN下载地址失败, msg=' + msg + ', ret=' + ret);
                            mini_tip.warn(msg);
                        });*/
                };

                var global_function = common.get('./global.global_function');
                global_function.register('WYCLIENT_OnDragDownload', on_drag_download);
                me._drag_listening = 1;
            }

            // 调客户端“预”拖拽接口
            console.debug('调客户端预拖拽接口 DragFiles()');
            external.DragFiles(JSON.stringify(args));
        },
        _drag_handlers: {},
        _drag_listening: 0
    };

    var drag_files = {

        //准备好文件给客户端调用
        set_drag_files: function (files, e) {
            var me = this;

            if (!this._check_down_cookie() || !files || !files.length) {
                console.warn('drag_files._check_down_cookie()参数无效');
                return false;
            }

            if (!files) {
                console.warn('drag_files.down()参数无效');
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn('drag_files.down()参数无效');
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('drag_files.down()没有可下载的文件');
                return false;
            }

            e.preventDefault();

            //console.log('aaa:'+files);
            //1.97以上的版采用cgi拉ftn下载地址进行下载，单文件才采用，打包下载走老接口，等appbox代码拿到了再看看接口参数来调整
            var me = this;
            if(supported_cookie() && files.length == 1 && !files[0].is_dir()) {
                downloader.pre_down(files).done(function(opt) {
                    var args = me._get_drag_args_for_client_v2(files, opt.ftn_url);
                    args.cookie = opt.cookie_name + '=' + opt.cookie_value + ';';

                    me.drag2down(args);
                });

                return;
            }
            var select_file_object = this._get_drag_args_for_client(files);
            me.drag2down(select_file_object);

        },

        /**
         * 准备好参数后，开始调用控件进行拖拽下载
         * @param args
         */
        drag2down: function(args) {
            setTimeout(function () {
                try {
                    plugin_route.drag_files(args);
                }
                catch (e) {
                    console.error('拖拽失败 ', e.message);
                }
            }, 10);
        },

        //离线文件拖拽下载
        set_offline_drag_files: function (files, e) {
            var me = this;

            if (!this._check_down_cookie() || !files || !files.length) {
                console.warn('drag_files._check_down_cookie()参数无效');
                return false;
            }

            if (!files) {
                console.warn('drag_files.down()参数无效');
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn('drag_files.down()参数无效');
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('drag_files.down()没有可下载的文件');
                return false;
            }

            e.preventDefault();

            //console.log('aaa:'+files);
            downloader.pre_down(files).done(function(opt) {
                var args = me._get_offline_drag_args_for_client(files, opt.ftn_url);
                args.cookie = opt.cookie_name + '=' + opt.cookie_value + ';';

                me.drag2down(args);
            });
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

        /**
         * 获取QQ客户端所需的参数
         * @param {Array<FileObject>} files
         * @return {Object} 包含了 url, size, name, fileid, ico 的对象
         * @private
         */
        _get_drag_args_for_client: function (files) {
            var me = this,
                args,
                is_single_down = files.length === 1 && !files[0].is_dir(),

                param = [],
                packUrl = {};

            var down_url = me.get_down_url(files);

            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    url: down_url,
                    size: file_size,
                    name: files[0].get_name(),//.replace(/\s/g, '_'),
                    fleId: files[0].get_pid() + files[0].get_id(),
                    thumUrl: 'ico-' + (files[0].get_type() || 'file'),
                    isFolder: "0",
                    fileResource: "0",  //0：表示网盘，1：表示相册
                    cookie: document.cookie
                };

                param.push(args);
            }
            // 是目录或包含多个文件时
            else {
                $.each(files, function (i, file) {
                    var args = {
                        url: me.get_down_url(file),
                        size: '' + (file.get_size() == 0 ? "-1" : file.get_size()),
                        name: file.get_name(),//.replace(/\s/g, '_'),
                        fleId: file.get_pid() + file.get_id(),
                        thumUrl: 'ico-' + (file.get_type() || 'file'),
                        isFolder: file.is_dir() ? "1" : "0",
                        fileResource: "0",  //0：表示网盘，1：表示相册
                        cookie: document.cookie
                    };
                    param.push(args);
                });
                packUrl = {
                    url: down_url,
                    name: this._get_zip_name(files) + '.' + pack_file_ext,
                    cookie: document.cookie
                };
            }

            return {"filesInfo": param, "packInfo": packUrl, "enablePackDownload": "1"};
        },

        _get_drag_args_for_client_v2: function (files, down_url) {
            var me = this,
                args,
                is_single_down = files.length === 1 && !files[0].is_dir(),

                param = [],
                packUrl = {};

            down_url = down_url;

            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    url: down_url,
                    size: file_size,
                    name: files[0].get_name(),//.replace(/\s/g, '_'),
                    fleId: files[0].get_pid() + files[0].get_id(),
                    thumUrl: 'ico-' + (files[0].get_type() || 'file'),
                    isFolder: "0",
                    fileResource: "0",  //0：表示网盘，1：表示相册
                    cookie: document.cookie
                };

                param.push(args);
            }
            // 是目录或包含多个文件时
            else {
                $.each(files, function (i, file) {
                    var args = {
                        url: '',
                        size: '' + (file.get_size() == 0 ? "-1" : file.get_size()),
                        name: file.get_name(),//.replace(/\s/g, '_'),
                        fleId: file.get_pid() + file.get_id(),
                        thumUrl: 'ico-' + (file.get_type() || 'file'),
                        isFolder: file.is_dir() ? "1" : "0",
                        fileResource: "0",  //0：表示网盘，1：表示相册
                        cookie: document.cookie
                    };
                    param.push(args);
                });
                packUrl = {
                    url: down_url,
                    name: this._get_zip_name(files) + '.' + pack_file_ext,
                    cookie: document.cookie
                };
            }

            return {"filesInfo": param, "packInfo": packUrl, "enablePackDownload": "1"};
        },

        //离线文件拖拽下载
        _get_offline_drag_args_for_client: function (files, url) {
            var me = this,
                args,

                param = [],
                packUrl = {};

            var file_size = files[0].get_size() + '';
            if (file_size == 0) file_size = "-1";

            args = {
                url: url,
                size: file_size,
                name: files[0].get_name(),//.replace(/\s/g, '_'),
                fleId: files[0].get_pid() + files[0].get_id(),
                thumUrl: 'ico-' + (files[0].get_type() || 'file'),
                isFolder: "0",
                fileResource: "0",  //0：表示网盘，1：表示相册
                cookie: document.cookie
            };

            param.push(args);

            return {"filesInfo": param, "packInfo": packUrl, "enablePackDownload": "1"};
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

            // 默认参数
            if (!supported_cookie() || !(/^https?:\/\/(\w+\.)*weiyun\.com\/.?/.test(tpl_url))) {
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
            return s + ext;
        },

        _get_zip_name: function (files) {
            var zip_name_len = pack_file_name_len,
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
            return zip_name;
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
        return url.indexOf('weiyun.com') > 0;
    };

    // 请求下载地址时能否在cookie中带上验证信息
    var can_use_cookie = function (url) {
        return supported_cookie() && is_same_domain(url);
    };

    return drag_files;

});