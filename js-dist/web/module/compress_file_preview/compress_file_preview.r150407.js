//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/compress_file_preview/compress_file_preview.r150407",["lib","common","$","downloader"],function(require,exports,module){

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
//compress_file_preview/src/compress_file_preview.js
//compress_file_preview/src/request.js
//compress_file_preview/src/view.js
//compress_file_preview/src/compress_file_preview.tmpl.html

//js file list:
//compress_file_preview/src/compress_file_preview.js
//compress_file_preview/src/request.js
//compress_file_preview/src/view.js
/**
 * 压缩包预览
 * @author svenzeng
 * @date 13-7-4
 */
define.pack("./compress_file_preview",["lib","common","$","./request","./view"],function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        url_parser = lib.get('./url_parser'),
        request = require('./request'),
        View = require('./view'),

        iframe_instance;


    var get_iframe_instance = function (callback) {
        if (iframe_instance) {
            callback(iframe_instance);
        } else {
            parent.seajs.use('compress_file_iframe', function (mod) {
                var compress_file_iframe = mod.get('./compress_file_iframe');
                iframe_instance = compress_file_iframe.get_cur_instance();

                callback(iframe_instance);
            });
        }
    };

    get_iframe_instance(function (instance) {
        View.init(instance);
    });

});/**
 * 图片、文档预览
 * @author svenzeng
 * @date 13-3-15
 * todo 图片预览会话超时检测
 */
define.pack("./request",["lib","common","$"],function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        security = lib.get('./security'),

        constants = common.get('./constants'),
        request = common.get('./request'),
        last_req;

    var make_params = function (file, file_path) {
        return {
            file_md5: file.get_file_md5() || security.md5(file.get_id()),
            file_name: encodeURIComponent(file.get_name()),
            file_id: file.get_id(),
            pdir_key: file.get_pid(),
            file_path: file_path,
            file_size: file.get_size()
        };
    };


    var list = function (file, file_path, fail_callback, succ_callback) {
        abort();

        var param = make_params(file, file_path);
        last_req = request.xhr_post({
            url: 'http://web2.cgi.weiyun.com/compress_view.fcg',
            cmd: 'ListFile',
            pb_v2: true,
            body: param
        })
            .fail(function (msg, ret, rsp_body, rsp_header) {
                fail_callback(msg, ret, param, rsp_body);
            })
            .ok(function (msg, rsp_body, rsp_header) {
                succ_callback(rsp_body, param);
            })
            .done(function () {
                last_req = null;
            });
    };

    var abort = function () {
        if (last_req) {
            last_req.destroy();
        }
    };

    return {
        list: list,
        abort: abort
    };

});/**
 * 图片、文档预览UI逻辑
 * @author svenzeng
 * @date 13-3-15
 * @date 13-8-20 yuyanghe　添加实现压缩包文档预览时添加了一个file适配器类
 */
define.pack("./view",["lib","common","$","downloader","./request","./tmpl"],function (require, exports, module) {

    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        security = lib.get('./security'),
        events = lib.get('./events'),
        force_blur = lib.get('./ui.force_blur'),

        constants = common.get('./constants'),
        FileObject = common.get('./file.file_object'),
        urls = common.get('./urls'),
        functional = common.get('./util.functional'),
        user_log = common.get('./user_log'),
        widgets = common.get('./ui.widgets'),
        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        mini_tip = common.get('./ui.mini_tip'),
        global_event = common.get('./global.global_event'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        downloader = require('downloader').get('./downloader'),

        request = require('./request'),
        tmpl = require('./tmpl'),

        compress_instance,  // CompressFileIframe 实例
        retry_delay = 5000, // 重试间隔
        retry_timer,
        root_delay = 5000,  // 首次拉取延迟这么久后中断请求重新发送
        root_timer,
        fake_delay = 1000,   // 假的1%
        fake_timer,

        paths = [],
        ignore_sel = '[data-encrypted="true"]',
        $title,
        list_render_timeout,

        is_loading = false;


    var Event = function () {

        var filter_enter = function (list) {
            list.on('click', '[data-encrypted="true"]', function (e) {
                mini_tip.error(ret_msgs.get(10408));
            });
        };

        var open_dir = function (dirs) {
            filter_enter(dirs);

            var sel = '[data-isdir-action]:not(' + ignore_sel + ')';
            dirs.off('click', sel).on('click', sel, function () {
                var name = $(this).attr('data-file-name');
                View.enter_dir(name, true);   //true为主动点击进入目录
            });
        };

        /*
         *  f5&file_path=/wyTool/common.xml&file_name=wyTool.7z
         */

        var click_file = function ($list) {
            filter_enter($list);
            var sel = '[data-isfile-action]:not(' + ignore_sel + ')';

            var $files = $list.find('[data-isfile-action=file]');

            //因压缩包cgi过老不再支持下载和预览，现进行屏蔽
        /*    $list.off('click', sel).on('click', sel, function () {
                var $file = $(this);
                var meta = get_meta($file);
                // 判断点击文件类型，图片则启动预览
                if (FileObject.is_image(meta.name)) {
                    var $image = $.grep($files, function (file) {
                        return is_image(file);
                    })
                    preview_image($image, $file);
                }
                //　判断点击文件类型，可预览文件则启动预览，暂不支持预览
                /*else if (preview_dispatcher.is_preview_by_name(meta.name)) {

                    preview_doc($file);
                }*/
                // 下载
                /*else {
                    down_file($file);
                }*/

           //});
        };

        var preview_image = function ($files, $file) {

            // require.async('image_preview', function (mod) {
            parent.seajs.use('image_preview', function (mod) {
                var image_preview = mod.get('./image_preview');
                compress_instance.toggle(false);
                image_preview.start({
                    total: $files.length,
                    index: $.inArray($file.get(0), $files),
                    get_url: function (index) {
                        // todo 通过index获取URL
                        if (is_image($files[index])) {
                            return get_url($files[index]);
                        }
                    },
                    get_thumb_url: function(index){
                        if (is_image($files[index])) {
                            return get_url($files[index]);
                        }
                    },
                    download: function (index, e) {
                        down_file($files[index]);
                    },
                    back: function () {
                        compress_instance.toggle(true);
                        //图片预览返回后焦点退回iframe
                        force_blur();
                    },
                    close: function () {
                        compress_instance.close();
                    }
                });

            });
        };

        var preview_doc = function ($file) {

            var meta = get_meta($file);
            parent.seajs.use('common', function (mod) {

                var preview_dispatcher = mod.get('./util.preview_dispatcher');
                compress_instance.toggle(false);
                var zip_file = compress_instance.get_file();
                //压缩包文档初始化
                var doc_options = {
                    id: zip_file.get_id(),
                    is_dir: false,
                    name: zip_file.get_name(),
                    size: meta.size,
                    cur_size: meta.size,
                    pid: zip_file.get_pid(),
                    md5: zip_file.get_file_md5() || security.md5(zip_file.get_id()),
                    meta_name: meta.name,
                    icon_type: meta.icon_type,
                    fpath: encodeURIComponent(paths.join('/') + '/' + meta.name),
                    fsrc: 1
                }
                var doc_node = new Compress_preview_doc_node(doc_options);
                preview_dispatcher.preview(doc_node);//压缩包里的文件预览在appbox不能采用全屏，因为关闭预览还要回到压缩包里来的
            });
        };


        var down_file = function ($file) {
            var url = get_url($file);
            var meta = get_meta($file);
            downloader.down_url_standard_post(url, meta.name, meta.size, meta.icon_type);
            user_log('COMPRESS_DOWNLOAD');
        };

        var is_image = function ($file) {
            var meta = get_meta($file);
            return FileObject.is_image(meta.name);
        };

        var get_meta = function ($file) {
            return {
                name: $($file).attr('data-file-name'),
                size: $($file).attr('data-file-size'),
                icon_type: $($file).attr('data-file-icon-type')
            }
        };

        var get_url = function ($file) {
            var meta = get_meta($file),
                name = meta.name,
                zip_file = compress_instance.get_file();
            var url = urls.make_url(constants.HTTP_PROTOCOL + '//user.weiyun.com/zipview/weiyun_web_download.fcg', {
                cmd: 'extract_zip_file',
                appid: constants.APPID,
                version: 20130704,
                pdir_key: zip_file.get_pid(),
                file_md5: zip_file.get_file_md5() || security.md5(zip_file.get_id()),
                file_id: zip_file.get_id(),
                file_path: encodeURIComponent(paths.join('/') + '/' + name),
                download_name: downloader.get_down_name(name),
                file_name: zip_file.get_name(),
                uin: query_user.get_uin(),
                skey: query_user.get_skey(),
                err_callback: constants.DOMAIN + '/web/callback/iframe_zip_file_down_fail.html'
            });
            return url;
        };


        var bind_hover = function ($parent) {
            if ($.browser.msie && $.browser.version < 7) {
                $parent
                    .off('mouseenter mouseleave', '.ui-item')
                    .on('mouseenter', '.ui-item', function () {
                        $(this).addClass('hover');
                        return false;
                    })
                    .on('mouseleave', '.ui-item', function () {
                        $(this).removeClass('hover');
                        return false;
                    });
            }
        };

        return {
            open_dir: open_dir,
            click_file: click_file,
            bind_hover: bind_hover
        };

    }();

    //压缩包文档预览适配器类     yuyanghe 　增加此类的原因是因为不想对doc_preview做太大的改动.
    var Compress_preview_doc_node = function (options) {
        var me = this;
        FileObject.apply(me, arguments);
        me._fsrc = options.fsrc || 0;        //是否来自压缩包，０不是，１是
        me._fpath = options.fpath || '';      //压缩包内的路径
        me._meta_name = options.meta_name || '';
        me.icon_type = options.icon_type || '';
    };

    Compress_preview_doc_node.prototype = $.extend({}, FileObject.prototype, {
        // 是否来自压缩包
        get_fsrc: function () {
            return this._fsrc;
        },

        // 压缩包内的路径
        get_fpath: function () {
            return this._fpath;
        },

        get_type: function() {
            return (this._meta_name.split('.').pop() || '').toLowerCase();
        },

        is_compress_inner_node: function() {
            return true;
        },
        // 可预览文档适配器类,百分百返回true;　　
        is_preview_doc: function () {
            return true;
        },
        close: function () {
            compress_instance.close();
        },
        back: function () {
            compress_instance.toggle(true);
        },
        down_file: function () {
            var me = this;
            var url = urls.make_url(constants.HTTP_PROTOCOL + '//user.weiyun.com/zipview/weiyun_web_download.fcg', {
                cmd: 'extract_zip_file',
                appid: constants.APPID,
                version: 20130704,
                pdir_key: me._pid,
                file_md5: me.get_file_md5() || security.md5(me.get_id()),
                file_id: me.get_id(),
                file_path: me.get_fpath(),
                download_name: downloader.get_down_name(me._meta_name),
                file_name: me.get_name(),
                uin: query_user.get_uin(),
                skey: query_user.get_skey(),
                err_callback: constants.DOMAIN + '/web/callback/iframe_zip_file_down_fail.html'
            });
            downloader.down_url_standard_post(url, me._meta_name, me.get_size(), me.icon_type);
            user_log('COMPRESS_DOWNLOAD');
        }
    });


    var View = function () {

        var body = $('body'),
            parent,
            dirs_parent,
            dirs_empty;


        var Loading = function () {

            var parent,
                first = true;

            var get_err = functional.getSingle(function () {
                var parent = $(tmpl.err()).appendTo(body);

                parent
                    .on('click', '[data-action="retry"]', function (e) {
                        e.preventDefault();
                        re_try();
                    })
                    .on('click', '[data-action="down"]', function (e) {
                        e.preventDefault();
                        down(e);
                    });
                return parent;
            });

            var get_err_encryption = functional.getSingle(function () {
                var parent = $(tmpl.err_encryption()).appendTo(body);

                parent
                    .on('click', '[data-action="retry"]', function (e) {
                        e.preventDefault();
                        re_try();
                    })
                    .on('click', '[data-action="down"]', function (e) {
                        e.preventDefault();
                        down(e);
                    });
                return parent;
            });

            var show = function () {
                if (!first) {
                    return widgets.loading.show();
                }
            };

            /**
             * 隐藏loading
             * @param {Boolean} is_err
             */
            var hide = function (is_err) {
                if (!first) {
                    return widgets.loading.hide();
                }

                compress_instance.loading.hide.call(compress_instance, is_err);
                first = false;
            };

            var err = function (err_msg) {
                hide(true);
                err_msg = err_msg || '拉取数据时发生错误';
                get_err().find('[data-id=err_desc]').text(err_msg).show();
                first = false;
            };

            var err_encryption = function (wording) {
                hide(true);
                get_err_encryption().show().find('p').append(wording);
                first = false;
            };

            var err_hide = function () {
                get_err().hide();
            };

            return {
                show: show,
                hide: hide,
                err_encryption: err_encryption,
                err: err,
                err_hide: err_hide
            };

        }();


        var sort = function (data) {
            var dirs = [],
                files = [];

            $.each(data, function (i, n) {
                ( n.file_type === 'dir' ? dirs : files ).push(n);
            });

            return {
                dirs: dirs,
                files: files
            };
        };


        var render = function (data) {
            Loading.hide();
            if (!data.items || data.items.length === 0) {
                return $(tmpl.dirs_empty()).appendTo(parent).show();
            }
            var obj = sort(data.items);
            init_dirs_container(obj.dirs, obj.files.length);
            init_files_container(obj.files, obj.dirs.length);
        };


        var set_title = function () {
            var title1, title2,
                file = compress_instance.get_file();

            if (paths.length <= 1) {
                title1 = file.get_name();
            } else {
                title1 = paths.length === 2 ? file.get_name() : paths[ paths.length - 2 ];
                title2 = paths[ paths.length - 1 ];
            }

            if ($title) {
                $title.off().remove();
            }


            compress_instance.set_title(title1, title2);

            // 点击跳转
            compress_instance.get_$main_title().off().on('click', function () {
                paths.pop();
                var path = paths.pop();
                enter_dir(path, false);

                user_log('COMPRESS_PREV');
            });
        };

        var enter_dir = function (path, enter_flag, is_init_root) {
            if (is_loading) {
                return;
            }

            is_loading = true;

            if (enter_flag === true) {
                user_log('COMPRESS_ENTER');   //是用户主动点击下一级目录
            }
            Loading.show();

            if (path !== '') {
                paths.push(path);
            }

            parent.off().empty();
            set_title();
            clearTimeout(list_render_timeout);

            console.log('拉取压缩包内文件列表: ' + paths.join('/'));


            // 拉取列表
            request.list(compress_instance.get_file(), paths.join('/'), function (retmsg, ret, params, body) {
                is_loading = false;
                clearTimeout(root_timer);
                clearTimeout(fake_timer);
                clearTimeout(retry_timer);

                if (ret === 10408) {
                    return Loading.err_encryption('该压缩包已经加密，无法预览<br>请<a data-action="down" href="#">下载</a>后查看');
                }
                if (ret === 10401) {
                    return Loading.err_encryption('文件已损坏');
                }
                if (ret === 10603) {  // 10603 文档正在下载到解析服务器中
                    // 更新进度
                    var already_size = parseInt(body['already_size']) || 0;
                    update_process(already_size);

                    // 延迟后重试
                    return retry_timer = setTimeout(function () {
                        paths.pop();
                        enter_dir(path, enter_flag);
                    }, retry_delay);
                }
                // 未知错误
                else {
                    // 终止未结束的请求
                    request.abort();

                    // 显示错误消息
                    return Loading.err(retmsg || '');
                }
            }, function (data) {
                is_loading = false;
                clearTimeout(root_timer);
                clearTimeout(fake_timer);

                update_process('100%');

                list_render_timeout = setTimeout(function () {
                    render(data);
                    Event.bind_hover(parent);
                }, 500);

            });

            // 如果是第一次加载，则延迟5秒后中断请求，然后再次发送请求
            if (is_init_root === true) {

                root_timer = setTimeout(function () {
                    console.log('中断拉取压缩包文件列表请求，重新发送..');
                    request.abort();
                    is_loading = false;

                    paths = [];
                    enter_dir(path, enter_flag, false);
                }, root_delay);

                // 显示一个 1% 的假进度
                fake_timer = setTimeout(function () {
                    update_process('1%');
                }, fake_delay);
            }


            //点击进入压缩包、进入压缩包内文件时焦点切换到iframe
            force_blur();
        };

        /**
         * 更新加载进度
         * @param {Number|String} already_size or 'done'
         */
        var update_process = function (already_size) {
            compress_instance.loading.process.call(compress_instance, already_size);
        };

        var re_try = function () {
            Loading.err_hide();
            paths = [];
            enter_dir('/', false, true);
        };

        var down = function (e) {
            var file = compress_instance.get_file(e);
           /* e = window.parent.$.Event(e); //包一层给父级调用，不然判断e参数错误不为$.Event对象，因为是iframe里面发出的
            window.parent.seajs.use('downloader', function(mod) {
                var downloader = mod.get('./downloader');
                downloader.down(file, e);
            });*/
            downloader.down(file, e);

        };

        var init_dirs_container = function (data, files_length) {
            if (data.length === 0) {
                return;
            }
            var $dirs = $(tmpl.render_dirs(data)).appendTo(parent);
            if (files_length === 0) {
                $dirs.find('.ui-title-bar').hide();
            }
            Event.open_dir($dirs);
        };


        var init_files_container = function (data, dirs_length) {
            if (data.length === 0) {
                return;
            }
            var $files = $(tmpl.render_files(data)).appendTo(parent);
            if (dirs_length === 0) {
                $files.find('.ui-title-bar').hide();
            }

            Event.click_file($files);
        };

        // 预览初始化
        var init = function (_compress_instance) {
            compress_instance = _compress_instance;
            //user_log( '' );
            parent = $(tmpl.compress_file_preview_parent()).appendTo(body).find('.disk-view');
            dirs_parent = parent.find('.dirs-view');
            dirs_empty = parent.find('.dirs-empty');

            // 加载根目录
            enter_dir('/', false, true);

            init_event.call(this, compress_instance);
        };

        var init_event = function () {
            this.listenTo(global_event, 'press_key_esc', function () {
                compress_instance.close();
            });

            $(document).on('keydown.dir_back', function (e) {
                if (e.which === 8) {
                    e.preventDefault();
                    if (paths.length > 1) {
                        paths.pop();
                        enter_dir('');
                    } else {
                        compress_instance.close();
                    }
                }
                /*else if (e.which === 27) {
                 compress_instance.close();
                 }*/
            });
        }

        var error = function (ret, msg) {
            mini_tip.error(ret_msgs.get(ret));
        };

        return {
            init: init,
            render: render,
            enter_dir: enter_dir,
            error: error
        };

    }();

    $.extend(View, events);


    return View;

});
//tmpl file list:
//compress_file_preview/src/compress_file_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'compress_file_preview_parent': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_main_wrapper">\r\n\
        <div class="disk-view ui-view view-when-default ui-thumbview">\r\n\
\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'render_dirs': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var lib = require('lib'),
        text = lib.get('./text');

        var getWords = function(str, num) {
            try {
                var index = 0;
                for (var i = 0, l = str.length; i < l; i++) {
                    if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                        index += 2;
                    } else {
                        index++;
                    }
                    if (index > num) {
                        return (str.substr(0, i) + '...');
                    }
                }
                return str;
            } catch (e) {
                return str;
            }
        };
    __p.push('\r\n\
\r\n\
    <div class="dir_view dirs-view disk-list clear" style="">\r\n\
        <div class="ui-title-bar" style="display: block;">\r\n\
            <h3 class="ui-title">文件夹</h3>\r\n\
            <div class="ui-title-line"></div>\r\n\
        </div>\r\n\
\r\n\
        <div class="dirs" style="display: block;">');

                for ( var i=0,l=data.length; i<l; i++ ){
                    var item = data[i];

            __p.push('  \r\n\
                    <div data-isdir-action="dir" data-encrypted="');
_p(item.encrypted==1);
__p.push('" data-file-name="');
_p(text.text(item.file_name));
__p.push('" class="ui-item ui-whole-click ui-draggable ui-droppable">\r\n\
                        <span class="filemain"><!-- code by fixed ie6 bug -->\r\n\
                        <span class="fileie6"><span class="fileimg"><!-- 图标 --><i data-action="enter" class="filetype icon-folder"></i></span> <!-- 文件名 -->\r\n\
                        <span data-action="enter" data-name="file_name" class="filename" title="');
_p(text.text(item.file_name));
__p.push('" data-tj-action="btn-adtag-tj" data-tj-value="52302">');
_p(text.text(getWords(item.file_name, 16)));
__p.push('</span></span></span>\r\n\
                        <span class="filetime">2013-07-02 10:04</span>\r\n\
                    </div>');

                }
            __p.push('        </div>\r\n\
\r\n\
    </div>\r\n\
');

return __p.join("");
},

'render_files': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push(' ');



    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),

        text = lib.get('./text'),

        FileObject = common.get('./file.file_object'),

        tj_value = constants.APPID;

    var getWords = function(str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return (str.substr(0, i) + '...');
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };
    __p.push('\r\n\
    <div class="files_view files-view disk-list clear">\r\n\
        <div class="ui-title-bar" style="display: block;">\r\n\
            <h3 class="ui-title">文件</h3>\r\n\
            <div class="ui-title-line"></div>\r\n\
        </div>\r\n\
\r\n\
        <div class="files">');

                for ( var i in data ){
                    var item = data[i],
                        type = FileObject.get_type(item.file_name);
            __p.push('                    <div data-isfile-action="file" data-encrypted="');
_p(item.encrypted==1);
__p.push('" data-file-icon-type="');
_p(type);
__p.push('" data-file-size="');
_p(item.file_size);
__p.push('" data-file-name="');
_p(text.text(item.file_name));
__p.push('" class="ui-item ui-whole-click">\r\n\
                            <span class="filemain"><!-- code by fixed ie6 bug -->\r\n\
                             <span class="fileie6"><span class="fileimg" data-tj-action="btn-adtag-tj" data-tj-value="');
_p(tj_value);
__p.push('"><!-- 图标 --><i data-action="enter" class="filetype icon-');
_p(type||'file');
__p.push('"></i></span> <!-- 文件名 -->\r\n\
                             <span data-action="enter" data-name="file_name" class="filename" title="');
_p(text.text(item.file_name));
__p.push('" data-tj-action="btn-adtag-tj" data-tj-value="52306">');
_p(text.text(getWords(item.file_name, 16)));
__p.push('</span></span></span>\r\n\
                        </div>');

                }
            __p.push('\r\n\
        </div>\r\n\
\r\n\
    </div>\r\n\
');

return __p.join("");
},

'dirs_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="dirs-empty">\r\n\
        该文件夹为空。\r\n\
    </div>');

return __p.join("");
},

'err': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-name="error" class="viewer-tips" style="">\r\n\
        <div class="ui-tips">\r\n\
            <i class="ui-icon icon-err"></i>\r\n\
            <p class="ui-text"><span data-id="err_desc">拉取数据时发生错误</span>，请<a data-action="retry" href="#">重试</a>或直接<a data-action="down" href="#">下载</a></p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'err_encryption': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-name="error" class="viewer-tips" style="">\r\n\
        <div class="ui-tips">\r\n\
            <i class="ui-icon icon-err"></i>\r\n\
            <p class="ui-text"></p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
