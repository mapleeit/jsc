//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/recent/recent.r160510",["lib","common","$","g-filetype-icons"],function(require,exports,module){

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
//recent/src/ListView.js
//recent/src/file/FileNode.js
//recent/src/file/file_type_map.js
//recent/src/file/parser.js
//recent/src/image_lazy_loader.js
//recent/src/mgr.js
//recent/src/recent.js
//recent/src/selection.js
//recent/src/store.js
//recent/src/ui.js
//recent/src/rencent.tmpl.html

//js file list:
//recent/src/ListView.js
//recent/src/file/FileNode.js
//recent/src/file/file_type_map.js
//recent/src/file/parser.js
//recent/src/image_lazy_loader.js
//recent/src/mgr.js
//recent/src/recent.js
//recent/src/selection.js
//recent/src/store.js
//recent/src/ui.js
/**
 * ListView列表类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./ListView",["lib","common","$","./selection","./image_lazy_loader","./store","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        widgets = common.get('./ui.widgets'),
        selection = require('./selection'),
        image_lazy_loader = require('./image_lazy_loader'),
        store = require('./store'),
        app_api = common.get('./app_api'),
        tmpl = require('./tmpl'),

        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'recent.list_view';
        this._select_mode = false; //选择模式
        if(this.auto_render) {
            this.render();
        }
    }

    ListView.prototype = {

        render: function() {
            if(this._rendered) {
                return;
            }

            image_lazy_loader.init(this.$ct);
            //this.trigger('beforerender');
            this.on_render();
            this.bind_events();
            //this.trigger('afterrender');
            this.on_refresh(store.get_cur_node().get_kid_nodes(), true);
            this._rendered = true;
        },

        /**
         * 监听store变化，更新视图
         */
        bind_events: function() {
            var store = this.store,
                me = this;
            //store events
            this.listenTo(store, 'before_refresh', function() {
                me.$ct.empty();
                me.$toolbar.hide();
                widgets.reminder.loading('加载中...');
                //widgets.reminder.loading('加载中...');
                $('#_load_more').hide();
            }).listenTo(store, 'before_load', function() {
            }).listenTo(store, 'refresh_done', function(files) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                me.on_load_fail(msg, is_refresh);
            }).listenTo(store, 'restore', function() {
                me.change_select_mode();
            });
        },

        on_render: function() {
            this.$ct = $('#_list');

            var me = this;
            var is_move = false;
            this.$ct.on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            //监听UI事件，然后让mgr处理
            this.$ct.on('touchend', '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $item = $(e.target).closest('[data-id=item]'),
                    action_name = $item.attr('data-action'),
                    file_id = $item.attr('data-file-id'),
                    file = me.store.get(file_id);

                if(me._select_mode) {
                    $item.toggleClass('checked');
                    selection.toggle_select(file);
                    me._$confirm_btn.toggleClass('btn-disable', !selection.get_selected().length);
                } else {
                    me.trigger('action', action_name, file, e);
                }
            });

            this._$confirms = this.$toolbar.find('[data-id=confirm]');
            this._$normal = this.$toolbar.find('[data-id=normal]');
            this._$confirm_btn = this.$toolbar.find('[data-action=confirm]');
            this.$toolbar.on('touchend', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(selection.is_empty() && action_name === 'confirm') {
                    return;
                }
                if(action_name === 'share') {
                    me.change_select_mode();
                } else {
                    if(action_name === 'confirm') {
                        me.trigger('action', 'share');//完成分享后，再进行change_select_mode
                    } else {
                        me.change_select_mode();
                    }
                }
            });

        },

        change_select_mode: function() {
            this._select_mode = !this._select_mode;
            this.$ct.toggleClass('active');

            var me = this,
                selected_files;
            if(!this._select_mode) {
                selected_files = selection.get_selected();
                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).removeClass('checked');
                });
                selection.clear();
                me._$normal.show();
                me._$confirms.hide();

            } else {
                me._$normal.hide();
                me._$confirm_btn.addClass('btn-disable').show();
                me._$confirms.show();
            }
        },

        on_refresh: function(files, is_async) {
            if(files.length) {
                if(!is_async) {
                    var html = tmpl.list({
                        list: files
                    });
                    this.$ct.empty().append(html);
                    this.$toolbar.show();
                }
                image_lazy_loader.load_image();
            } else {
                this.$toolbar.hide();
                this.empty();
            }
        },

        on_add: function(files) {
            var html = tmpl.list({
                list: files
            });
            this.$ct.append(html);
        },

        on_load_fail: function(msg, is_refresh) {
            var me = this;
            if(is_refresh) {
                this.$ct.empty().append(tmpl.fail({
                    msg: msg
                }));

                $('#_fail').on('touchend', function(e) {
                    me.trigger('action', 'refresh');
                });
            }
        },

        empty: function() {
            this.$ct.empty().append(tmpl.empty());
        },

        get_$item_by_id: function(file_id) {
            return $('#item_' + file_id);
        },

        get_$ct: function() {
            return this._$ct;
        }

    };

    $.extend(ListView.prototype, events);

    return ListView;
});/**
 * 文件对象类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./file.FileNode",["lib","$","common","./file.file_type_map"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        events = lib.get('./events'),
        prettysize = lib.get('./prettysize'),
        constants = common.get('./constants'),
        file_type_map = require('./file.file_type_map'),

        // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
        // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },

        // 视频文档类型
        EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },

        PREVIEW_DOC_TYPE = ['xls', 'xlsx', 'doc', 'docx', 'rtf', 'ppt', 'pptx', 'pdf', 'txt'],

        COMPRESS_TYPE = ['rar','zip','7z'],

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),

        undefined;

    function FileNode(opts) {
        var is_dir = !!opts.dir_key;
        this._is_dir = is_dir;
        if(is_dir) {
            this._ppdir_key = opts.ppdir_key || '';
            this._pdir_key = opts.pdir_key;
            this._id = opts.dir_key;
            this._name = opts.dir_name;
            this._mtime = opts.dir_mtime;
            this._ctime = opts.dir_ctime;
            this._file_size = 0;
            this._diff_version = opts.diff_version;
            this._attr = opts.dir_attr;
            this._ext_info = opts.ext_info;
        } else {
            this._ppdir_key = opts.ppdir_key;
            this._pdir_key = opts.pdir_key;
            this._id =  opts.file_id;
            this._name = opts.filename;
            this._mtime = opts.file_mtime;
            this._ctime = opts.file_ctime;
            this._diff_version = opts.diff_version;
            this._file_size = opts.file_size;
            this._file_cursize = opts.file_cursize;
            this._file_sha = opts.file_sha;
            this._file_md5 = opts.file_md5;
            this._file_version = opts.file_version;
            this._lib_id = opts.lib_id;
            this._attr = opts.file_attr;
            this._ext_info = opts.ext_info;
            this._readability_size = prettysize(this._file_size);
        }
        this._type = FileNode.get_type(this._name, is_dir);
        this._ext = FileNode.get_ext(this._name);

        /******************以下属性用于目录树*************************/
        this._kid_dirs = [];
        this._kid_files = [];
        this._kid_nodes = [];
        this._kid_map = {};
    }

    FileNode.prototype = {

        is_dir: function() {
            return !!this._is_dir;
        },

        is_image: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_IMAGE_TYPES;
        },

        is_video: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_VIDEO_TYPES;
        },

        is_preview_doc: function() {
            return $.inArray(this._type.toLowerCase(), PREVIEW_DOC_TYPE) > -1;
        },

        is_compress: function() {
            return $.inArray(this._type.toLowerCase(), COMPRESS_TYPE) > -1;
        },

        is_broken: function() {
            return this._file_cursize < this._file_size;
        },

        is_empty_file: function() {
            return this._file_size === 0;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            return this.get_pdir_key();
        },

        get_ppid: function() {
            return this.get_ppdir_key();
        },

        get_pdir_key: function() {
            return this._pdir_key || this.get_parent() && this.get_parent().get_id();
        },

        get_ppdir_key: function() {
            return this._ppdir_key;
        },

        get_name: function() {
            return this._name;
        },

        get_type: function() {
            return this._type;
        },

        get_ext: function() {
            return this._ext;
        },

        get_size: function() {
            return this._file_size;
        },

        get_readability_size: function() {
            return this._readability_size;
        },

        get_modify_time: function() {
            return this._mtime;
        },

        get_create_time: function() {
            return this._ctime;
        },

        get_file_sha: function() {
            return this._file_sha;
        },

        get_file_md5: function() {
            return this._file_md5;
        },

        get_thumb_url: function(size) {
            if((this.is_image() || this.is_video()) && this._ext_info['thumb_url']) {
                var thumb_url = constants.IS_HTTPS? this._ext_info['https_url'] : this._ext_info['thumb_url'];
                if(this.is_image() && size) {
                    size = size + '*' + size;
                    return thumb_url + (thumb_url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
                } else if(this.is_video() && size){
                    return thumb_url + '/64';
                }
                return thumb_url;
            }
            return '';
        },

        /******************以下方法用于目录树*************************/

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        },

        add_node: function(node) {
            node.set_parent(this);
            this._kid_nodes.push(node);
            if(node.is_dir()) {
                this._kid_dirs.push(node);
            } else {
                this._kid_files.push(node);
            }
            this._kid_map[node.get_id()] = node;
        },

        add_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.add_node(node);
            });
        },

        remove_node: function(node) {

        },

        remove_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.remove_node(node);
            });
        },

        remove_all: function() {
            var nodes = this.get_kid_nodes();
            this.remove_nodes(nodes);
        },

        get_kid_dirs: function() {
            return this._kid_dirs;
        },

        get_kid_files: function() {
            return this._kid_files;
        },

        get_kid_nodes: function() {
            return this._kid_nodes;
        },

        get_kid_count: function() {
            return this._kid_nodes.length;
        },

        get_kid_images: function() {
            var kid_files = this.get_kid_files(),
                images = [];

            $.each(kid_files, function(i, file) {
                if(file.is_image()) {
                    images.push(file);
                }
            });

            return images;
        }


    };

    /**
     * 获取文件类型（ 不是后缀名，如 a.wps 的get_type() 会返回 doc ）
     * @param {String} name
     * @param {Boolean} is_dir
     * @return {String}
     */
    FileNode.get_type = function (name, is_dir) {
        var ext;
        if (is_dir) {
            return file_type_map.get_folder_type();
        } else {
            ext = !is_dir ? FileNode.get_ext(name) : null;
            if (ext) {
                return file_type_map.get_type_by_ext(ext);
            }
        }
        return 'file';
    };

    FileNode.is_image = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    FileNode.get_ext = function(name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;

    }

    $.extend(FileNode.prototype, events);

    return FileNode;
});define.pack("./file.file_type_map",[],function (require, exports, module) {

    var defaults = 'normal',
        folder_type = 'folder',
        type_map = {
            doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptm'],
            bmp: ['bmp', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'ram', 'ra', 'au'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
            rmvb: ['rmvb'],
            rm: ['rm'],
            hlp: ['hlp', 'cnt'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec: ['exec', 'dll'],
            pdf: ['pdf'],
            txt: ['txt', 'text'],
            msg: ['msg'],
            rp: ['rp'],
            vsd: ['vsd'],
            ai: ['ai'],
            eps: ['eps'],
            log: ['log'],
            xmin: ['xmin'],
            psd: ['psd'],
            png: ['png'],
            gif: ['gif'],
            mod: ['mod'],
            mov: ['mov'],
            avi: ['avi'],
            swf: ['swf'],
            flv: ['flv'],
            wmv: ['wmv'],
            wma: ['wma'],
            mp3: ['mp3'],
            mp4: ['mp4'],
            ipa: ['ipa'],
            apk: ['apk'],
            ipe: ['ipe'],
            exe: ['exe'],
            msi: ['msi'],
            bat: ['bat'],
            fla: ['fla'],
            html: ['html'],
            htm: ['htm'],
            asp: ['asp'],
            xml: ['xml'],
            chm: ['chm'],
            rar: ['rar'],
            zip: ['zip'],
            tar: ['tar'],
            cab: ['cab'],
            uue: ['uue'],
            jar: ['jar'],
            iso: ['iso'],
            dmg: ['dmg'],
            bak: ['bak'],
            tmp: ['tmp'],
            ttf: ['ttf'],
            otf: ['opt'],
            old: ['old'],
            docx: ['docx'],
            wps: ['wps'],
            xlsx: ['xlsx'],
            pptx: ['pptx'],
            dps: ['dps'],
            et:  ['et'],
            key: ['key'],
            numbers: ['numbers'],
            pages: ['pages'],
            keynote: ['keynote'],
            mkv: ['mkv'],
            mpg: ['mpg'],
            mpeg: ['mpeg'],
            dat: ['dat'],
            f4a: ['f4a'],
            webm: ['webm'],
            ogg: ['ogg'],
            acc: ['acc'],
            m4a: ['m4a'],
            wave: ['wave'],
            midi: ['midi'],
            ape: ['ape'],
            aac: ['aac'],
            aiff: ['aiff'],
            mid: ['mid'],
            xmf: ['xmf'],
            rtttl: ['rtttl'],
            flac: ['flac'],
            amr: ['amr'],
            ttc: ['ttc'],
            fon: ['fon'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            sketch: ['sketch'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c', 'sketch',
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon'
        ];



    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        var sub_types = type_map[_can_ident[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident[sub_types[j]] = 1;
        }
    }

    var getWords = function (str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return ( str.substr(0, i) + '..' );
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };

    return {

        get_type_by_ext: function (type) {
            return all_map[type] || defaults;
        },
        get_folder_type: function () {
            return folder_type;
        },
        can_identify: function (type) {
            return !!can_ident[type];
        },
        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function (file_name, type) {
            switch (type) {
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring(0, 7), '...', file_name.substring(file_name.length - 7) ].join('') : file_name;
            }

        }
    };

});/**
 * 把cgi返回的数据转换成文件对象
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./file.parser",["lib","$","./file.FileNode"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        Module = lib('./Module'),
        FileNode = require('./file.FileNode'),

        undefined;

    var parser = new Module('file.parser', {

        parse: function(data) {
            var list = [];
            if(data.dir_list && data.dir_list.length > 0) {
                list = list.concat(data.dir_list);
            }

            if(data.file_list && data.file_list.length > 0) {
                list = list.concat(data.file_list);
            }

            var nodes = [];
            if(list.length > 0) {
                $.each(list || [], function(i, item) {
                    nodes.push(new FileNode(item));
                });
            }

            return nodes;
        }
    });

    return parser;
});/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./image_lazy_loader",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
	    https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants'),
        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),

        undefined;

    var img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? 120 : 64;

    common.get('./polyfill.rAF');

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                window.requestAnimationFrame(function() {
                    me.load_image();
                });

           });

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset,
                me = this;

            imgs.each(function(i, img) {
                var $img = $(img);
                var thumb_url;
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        thumb_url = constants.IS_HTTPS? $img.attr('data-https-src') : $img.attr('data-src');
                        image_loader.load(https_tool.translate_download_url(me.get_thumb_url(thumb_url, img_size))).done(function(img) {
                            $img.css('backgroundImage', "url('"+img.src+"')");
                            $img.attr('data-loaded', 'true');
                        })
                    }
                }
            });
        },

        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }
            if(url.indexOf('picabstract.preview.ftn.qq.com') !== -1 && size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else if(size){
                return url + '/64';
            }
            return url;
        }
    });

    return lazy_loader;
});/**
 * 最近文件列表模块
 * @author hibincheng
 * @date 2015-08-19
 */
define.pack("./mgr",["lib","common","./store","./selection","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        app_api = common.get('./app_api'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
	    https_tool = common.get('./util.https_tool'),
        router = lib.get('./router'),
        store = require('./store'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        undefined;

    var mgr = new Mgr('weixin.mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            mgr.observe(cfg.ui);
        },

        on_enter: function(file) {
            if(file.is_dir()) {
                var dir_key = file.get_id();
                router.go(dir_key);
            } else if(file.is_image()) {
                //do preview
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

            wx.previewImage({
                current: https_tool.translate_download_url(file.get_thumb_url(1024)), // 当前显示的图片链接
                urls: urls // 需要预览的图片链接列表
            });

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
                dir_info_list = [];

            if(selected_files.length > 100) {
                err = '分享文件不能超过100个';
            } else {
                $.each(selected_files, function(i, file) {

                    if (file.is_empty_file() && !file.is_dir()) {
                        err = '不能分享空文件';
                        return false;
                    }
                    dir_info_list.push({
                        dir_key: file.get_pdir_key(),
                        file_id_list: [file.get_id()]
                    });
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
                        dir_info_list: dir_info_list,
                        share_name: share_name,
                        share_type: 11
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
        }
    });

    return mgr;
});/**
 * 最近文件列表
 * @author hibincheng
 * @date 2015-08-25
 */
define.pack("./recent",["lib","common","./store","./ui","./mgr","g-filetype-icons"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        browser = common.get('./util.browser'),
        huatuo_speed = common.get('./huatuo_speed'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        app_api = common.get('./app_api'),

        undefined;

    var recent = new Module('recent', {

        render: function(serv_rsp) {
            if(serv_rsp && serv_rsp.ret) {//出错了
                return;
            }

            store.init(serv_rsp);
            ui.render();
            mgr.init({
                ui: ui
            });

            var share_data = {
                title: '向您推荐微云',
                desc: '腾讯微云，安全备份共享文件和照片',
                image: 'http://qzonestyle.gtimg.cn/qz-proj/wy-h5/img/icon-logo-96.png',
                url: 'http://h5.weiyun.com/?fromid=101'
            }
            this.set_share(share_data);

            setTimeout(function() {
                require('g-filetype-icons');
                seajs.use(['g-component', 'g-share-mask', 'zepto_fx']);
            },1);

            //this.report_speed();

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
                app_api.init(function() {
                    app_api.setShare(share_data);
                });
            } else if(browser.WEIXIN) {
                app_api.init(cfg, function() {
                    app_api.setShare(share_data);
                });
            }
        },

        report_speed: function() {
            //var render_time = +new Date();
            ////延时以便获取performance数据
            //setTimeout(function() {
            //    huatuo_speed.store_point('1598-1-1', 28, g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 29, g_css_time - g_start_time);
            //    huatuo_speed.store_point('1598-1-1', 30, (g_end_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.store_point('1598-1-1', 31, g_js_time - g_end_time);
            //    huatuo_speed.store_point('1598-1-1', 24, (render_time - g_start_time) + g_serv_taken);
            //    huatuo_speed.report('1598-1-1', true);
            //}, 1000);
        }
    });

    return recent;
});/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./selection",["lib","./store"],function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        store = require('./store'),
        undefined;

    var cache = [],
        cache_map = {};

    var selection = new Module('recent.selection', {

        select: function(file) {
            cache_map[file.get_id()] = file;
            cache.push(file);
        },

        unselect: function(file) {
            cache_map[file.get_id()] = undefined;
            $.each(cache, function(i, item) {
                if(item.get_id() === file.get_id()) {
                    cache.splice(i, 1);
                }
            })
        },

        toggle_select: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }

            if(cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = []
            cache_map = {};
        },

        get_selected: function() {
            return cache;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    });

    return selection;
});/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$","./file.FileNode","./file.parser"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./file.FileNode'),
        parser = require('./file.parser'),

        root_node, //文件目录根节点
        cur_node,  //当前目录节点
        node_map = {},

        undefined;

    var store = new Module('weixin.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }
            data.finish_flag = true;//最近列表最多200条，是全量拉的
            root_node = new FileNode({
                name: '微云',
                pdir_key: '_',
                dir_key: '_'
            });
            cur_node = root_node;
            node_map[cur_node.get_id()] = cur_node;

            if(data) {
                this.format2nodes(data);
            }

            this._inited = true;
        },

        refresh: function() {
            cur_node.remove_all();
            this._load_done = false;
            this.load_more(true);
        },
        
        share_restore: function() {
            this.trigger('restore');
        },

        load_dir_kid: function(dir_key) {
            if(dir_key === 'root') {
                cur_node = root_node;
            } else {
                cur_node = store.get(dir_key);
            }

            if(!cur_node) {
                return;
            }
            //有子节点说明已加载过
            if(cur_node.get_kid_count()) {
                this.trigger('refresh_done', cur_node.get_kid_nodes(), store);
            } else {
                this.load_more(true);
            }
        },

        load_more: function(is_refresh) {
            if(this._requesting || !is_refresh && this.is_load_done()) {
                return;
            }
            this._requesting = true;

            var me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/user_library.fcg'),
                cmd: 'LibPageListGet',
                body: {
                    lib_id: 100,
                    offset: cur_node.get_kid_nodes().length,
                    count: 100,
                    sort_type: 0,
                    get_abstract_url: true
                }
            }).ok(function(msg, body) {
                var nodes = me.format2nodes({
                    file_list: body.FileItem_items
                });
                if(is_refresh) {
                    me.trigger('refresh_done', nodes, store);
                } else {
                    me.trigger('load_done', nodes, store);
                }

            }).fail(function(msg, ret) {
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        format2nodes: function(data) {
            var nodes = parser.parse({
                file_list: data.file_list
            });

            this._load_done = !!data.finish_flag;

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            cur_node.add_nodes(nodes);
            return nodes;
        },

        set_cur_node: function(node) {
            cur_node = node;
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_requesting: function() {
            return !!this._requesting;
        },

        get_root_node: function() {
            return root_node;
        },

        get_cur_node: function() {
            return cur_node;
        },

        get: function(file_id) {
            return node_map[file_id];
        }
    });

    return store;
});/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./ui",["lib","common","./store","./ListView","./mgr","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        huatuo_speed = common.get('./huatuo_speed'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),

        store = require('./store'),
        ListView = require('./ListView'),
        mgr = require('./mgr'),
        app_api = common.get('./app_api'),
        tmpl = require('./tmpl'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    var ui = new Module('weixin.ui', {

        render: function() {
            if(this._rendered) {
                return;
            }

            this._$ct = $('#_container');

            this.list_view = new ListView({
                $ct:$('#_list'),
                $toolbar: $('#_toolbar'),
                store: store,
                auto_render: true
            });

            mgr.observe(this.list_view);

            var me = this;

            this.listenTo(app_api, 'init_success', function() {
                $('#_toolbar').show();
            }).listenTo(app_api, 'init_fail', function() {
                $('#_toolbar').hide();
            }).listenTo(app_api, 'share_success', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            }).listenTo(app_api, 'share_fail', function() {
                widgets.reminder.error('调用分享接口失败，重新分享分享');
                //logger.report('weixin_mp', res);
            }).listenTo(app_api, 'share_cancel', function() {
                me.$tip.remove();
                me.$tip = null;
                store.share_restore();
            });
            $('#_toolbar').show();
            //$('#_toolbar').hide();//先进行隐藏，当weixin jsapi就绪才显示

            this._rendered = true;
        },

        show_wx_tips: function() {
            this.$tip = $(tmpl.share_tip()).appendTo(document.body);
            var me = this;

            this.$tip.on('touchend', function(e) {
                me.$tip.remove();
                me.$tip = null;
                //去掉遮罩的同时把勾选文件的状态去掉
                store.share_restore();
            });
        },

        render_fail: function() {
            $('#_fail').on('touchend', function(e) {
                location.reload();
            });
        },

        //jsapi签名失败，则不显示分享按钮了
        on_jsapi_success: function() {
            //$('#_toolbar').hide();
        }
    });

    return ui;
});
//tmpl file list:
//recent/src/rencent.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="wy-blank-wrap">\r\n\
        <div class="wy-blank">\r\n\
            <i class="wy-gray-logo"></i>\r\n\
            <p>文件夹是空的</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'share_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_share_tip" class="share-dialog">\r\n\
            <span class="share-tips"></span>\r\n\
    </div>');

}
return __p.join("");
},

'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_fail" class="reload-wrap">\r\n\
        <a href="#" class="reload-btn" title="重新加载">\r\n\
            <div class="reload-btn-box">\r\n\
                <div class="reload-btn-wrap">\r\n\
                    <i class="icon icon-reload"></i>\r\n\
                    <p class="reload-txt">');
_p(data.msg);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </a>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
