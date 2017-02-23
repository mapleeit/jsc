//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/good-photo/module/outlink/outlink.r1702202",["lib","common","$"],function(require,exports,module){

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
//outlink/src/app_cfg.js
//outlink/src/file/FileNode.js
//outlink/src/file/file_type_map.js
//outlink/src/file/parser.js
//outlink/src/image_lazy_loader.js
//outlink/src/mgr.js
//outlink/src/outlink.js
//outlink/src/retry.js
//outlink/src/store.js
//outlink/src/text.js
//outlink/src/ui.js
//outlink/src/user_info.js
//outlink/src/user_log.js
//outlink/src/outlink.tmpl.html

//js file list:
//outlink/src/app_cfg.js
//outlink/src/file/FileNode.js
//outlink/src/file/file_type_map.js
//outlink/src/file/parser.js
//outlink/src/image_lazy_loader.js
//outlink/src/mgr.js
//outlink/src/outlink.js
//outlink/src/retry.js
//outlink/src/store.js
//outlink/src/text.js
//outlink/src/ui.js
//outlink/src/user_info.js
//outlink/src/user_log.js
/**
 * 好照片app相关
 * @author xixinhuang
 * @date 2015-12-24
 */
define.pack("./app_cfg",["lib","common","$"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        cookie = lib.get('./cookie'),
        Module  = lib.get('./Module'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),

        REGEXP_ANDROID_HZP_APP = /Android.*? haozp\/(\d\.\d\.\d)/,
        REGEXP_IOS_HZP_APP = /(iPad|iPhone|iPod).*? haozp\/(\d\.\d\.\d)/,
        REGEXP_HZP_VERSION = /(iPad|iPhone|iPod|Android).*? haozp\/(\d+).(\d+).(\d+)/i,
        user_agent = navigator.userAgent,
        undefined;

    var app_cfg = new Module('outlink.app_cfg', {

        init: function() {
            if(window.g_info) {
                this.data = JSON.parse(window.g_info);
                return;
            }
            var data = {
                is_ios_app: false,
                is_android_app: false,
                is_hzp_app: false,
                is_h5: false,
                is_web: false,
                is_debug: false,
                is_test: false
            }
            if(REGEXP_IOS_HZP_APP.test(user_agent)) {
                data.is_ios_app = true;
                data.is_hzp_app = true;
            }
            if(REGEXP_ANDROID_HZP_APP.test(user_agent)) {
                data.is_android_app = true;
                data.is_hzp_app = true;
            }
            if(browser.IOS || browser.android) {
                data.is_h5 = true;
            } else {
                data.is_web = true;
            }
            data.is_debug = location.search.indexOf('__debug__') > -1 || cookie.get('debug') === 'on';
            data.is_test = location.hostname === 'hzp-test.qq.com';

            this.data = data;
        },

        is_IOS_app: function() {
            //return REGEXP_IOS_HZP_APP.test(user_agent);
            return this.data['is_ios_app'];
        },

        is_android_app: function() {
            //return REGEXP_ANDROID_HZP_APP.test(user_agent);
            return this.data['is_android_app'];
        },

        is_hzp_app: function() {
            //return this.is_IOS_app() || this.is_android_app();
            return this.data['is_hzp_app'];
        },

        //大于某个版本返回true，否则返回false
        compare_hzp_version: function(version) {
            var value,
                result = false,
                version_arr = this.get_version_code_list(version),    //IOS1.5.3以上才能支持输入框
                match_arr = REGEXP_HZP_VERSION.exec(user_agent);

            if(match_arr && match_arr.length>1) {
                for(var i=2; i<match_arr.length; i++) {
                    value = parseInt(match_arr[i]);
                    if(value > version_arr[i-1]) {
                        result = true;
                        break;
                    } else if(value < version_arr[i-1]) {
                        result = false;
                        break;
                    }
                }
            }

            return result;
        },

        //example: '1.5.4' ==> [0, 1, 5, 4]
        get_version_code_list: function(version) {
            var arr = ['0'].concat(version.split('.'));
            arr.forEach(function(item, i) {
                arr[i] = parseInt(item);
            });

            return arr;
        },

        get_app_cfg: function() {
            return this.data;
        },

        set_visibility: function(is_hidden) {
            this.is_visibility = !is_hidden;
            this.time = +new Date();
            var me = this;

            setTimeout(function() {
                me.is_visibility = true;
                me.time = 0;
            }, 5000);
        },
        /*
         * 判断页面可见性，需满足条件：1）设置过is_visibility; 2）时间在500ms内; 3) is_visibility属性为false，即不可见
         * */
        get_visibility: function() {
            var now = +new Date();
            if(this.time && (now - this.time < 500) && !this.is_visibility) {
                this.is_visibility = true;
                this.time = 0;
                return false;
            } else {
                return true;
            }
        },

        //hex2bin，把后台返回的dir_key转换为客户端使用的字符串格式
        hex2String: function(strInput){
            var HexStr = '',
                nInputLength = strInput.length;

            //当输入够偶数位,奇数是非法输入
            if(nInputLength%2 === 0) {
                for (var i=0; i < nInputLength; i = i + 2 )
                {
                    var str = strInput.substr(i, 2); //16进制；
                    //StrHex = StrHex + .toString(16);

                    var n = parseInt(str, 16);//10进制；
                    HexStr = HexStr + String.fromCharCode(n);
                }
            }
            return HexStr;
        }
    });

    return app_cfg;

});
/**
 * 文件对象类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./file.FileNode",["lib","common","$","./file.file_type_map"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        prettysize = lib.get('./prettysize'),

        file_type_map = require('./file.file_type_map'),

        // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
        // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },
        // 视频文档类型
        EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },
        // 音乐文档类型
	    EXT_MUSIC_TYPES = { mp3: 1, wma: 1 },

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),

        PREVIEW_DOC_TYPE = ['doc', 'docx', 'rtf', 'ppt', 'pptx', 'pdf', 'txt'],

        COMPRESS_TYPE = ['rar','zip','7z'],

        undefined;

    function FileNode(opts) {
        this._pdir_key = opts.pdir_key;
        this._id =  opts.file_id;
        this._name = opts.filename || opts.file_name;
        //this._mtime = opts.file_mtime;
        //this._ctime = opts.file_ctime;
        //this._diff_version = opts.diff_version;
        this._file_size = opts.file_size;
        //this._file_cursize = opts.file_cursize;
        //this._file_sha = opts.file_sha;
        //this._file_md5 = opts.file_md5;
        //this._file_version = opts.file_version;
        this._lib_id = opts.lib_id;
        //this._attr = opts.file_attr;
        //this._ext_info = opts.ext_info;
        this._thumb_url = opts.thumb_url || (opts.ext_info && opts.ext_info.thumb_url) || '';
        this._video_thumb = opts.video_thumb || (opts.ext_info && opts.ext_info.video_thumb) || opts.thumb_url || '';
        this._long_time = FileNode.toMMSS(opts.long_time || (opts.ext_info && opts.ext_info.long_time) || 0) || '';
        this._readability_size = FileNode.get_readability_size(this._file_size);

        this._type = FileNode.get_type(this._name, false);
        this._ext = FileNode.get_ext(this._name);
    }

    FileNode.prototype = {

        is_image: function() {
            var lib_id = this.get_lib_id(),
                type = FileNode.get_type(this._name, false);
            return lib_id? lib_id === 2 : type in EXT_IMAGE_TYPES;
        },

        is_video: function() {
            var lib_id = this.get_lib_id(),
                type = FileNode.get_type(this._name, false);
            return lib_id? lib_id === 4 : type in EXT_VIDEO_TYPES;
        },

	    is_music: function() {
		    var type = FileNode.get_type(this._name, false);
		    return type in EXT_MUSIC_TYPES;
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

        get_pdir_key: function() {
            return this._pdir_key || '';
        },

        get_lib_id: function() {
            return this._lib_id;
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

        //get_modify_time: function() {
        //    return this._mtime;
        //},
        //
        //get_create_time: function() {
        //    return this._ctime;
        //},
        //
        //get_file_sha: function() {
        //    return this._file_sha;
        //},
        //
        //get_file_md5: function() {
        //    return this._file_md5;
        //},

        get_thumb_url: function(size) {
            if(this.is_image() && this._thumb_url) {
                if(size) {
                    size = size + '*' + size;
                    return this._thumb_url+ (this._thumb_url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
                } else {
                    return this._thumb_url;
                }
            }
            return '';
        },

        get_video_thumb: function(size) {
            if(this.is_video()) {
                if(size) {
                    return this._video_thumb + '/' + size;
                } else {
                    return this._video_thumb;
                }
            }
            return '';
        },

        /**
         * 视频时长
         */
        get_duration: function() {
            if(this.is_video()) {
                return this._long_time;
            }
            return '';
        },

        set_load_done: function(done) {
            this._load_done = !!done;
        },

        is_load_done: function() {
            return this._load_done;
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
        // 没有后缀名的默认为file
        return 'file';
    };

    FileNode.is_image = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    FileNode.is_video = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_VIDEO_TYPES;
    };

	FileNode.is_music = function (name) {
		var type = FileNode.get_type(name, false);
		return type in EXT_MUSIC_TYPES;
	};

    FileNode.get_ext = function(name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;

    }

    FileNode.toMMSS = function (time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Boolean} [is_dir] 是否目录（目录会返回空字符串）
     * @param {Number} [decimal_digits] 保留小数位，默认1位
     */
    FileNode.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        if(bytes === -1){
            return '超过4G';
        }

        bytes = parseInt(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

        if (!bytes)
            return '0B';

        var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        var size = bytes / Math.pow(1024, unit);
        var decimal_mag = Math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = Math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
        var int_size = parseInt(decimal_size);
        var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

        return result + BYTE_UNITS[unit];
    };

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
            dmg: ['dmg'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c',
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon', 'dmg'
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

        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        rAF = common.get('./polyfill.rAF'),

        undefined;

    var img_size;
    var big_show = false;
    var minHeight = 0;

    var screen_h = window.screen.height;
    var win_h = $(window).height();
    var win_w = $(window).width();

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);
            if($('#photo_list').length > 0) {
                //img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? '240*240' : '120*120';
                img_size = 1024;//大图模式
                big_show = true;
               minHeight = parseInt(this.$ct.find('[data-src]').css('min-height') || 0, 10);

            } else {
                img_size = 64;
            }
            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var me = this;
            window.requestAnimationFrame(function() {
                me._load_image();
            });
        },

        _load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_scrolltop = window.pageYOffset,
                me = this;
            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_h + win_scrolltop + 100) {
                        image_loader.load(me.get_thumb_url($img.attr('data-src'), img_size)).done(function(img) {
                            $img.attr('data-loaded', 'true');
                            if(big_show) {
                                $img.parent().height('auto');
                                $img.css({
                                    minHeight: '0'
                                });

                                if(img.naturalHeight*win_w/img.naturalWidth >= screen_h*2) {//按宽度100%显示时，高度大于的2倍屏幕高为长图
                                    $img.parent().addClass('height').height(minHeight);
                                }
                                $img.attr('src', img.src);

                                if($img.height() > 0 && $img.height() < minHeight) { //跳动后，图片过小，则进行补齐
                                    me.load_image();
                                }

                            } else {
                                $img.css('backgroundImage', "url('"+img.src+"')");
                            }
                        }).fail(function(img) {
                            var path = 'share' + location.pathname,
                                url = img.getAttribute('src');
                            logger.report(path, {url: url, type: 'lazy_loader'});
                        });
                    }
                }
            });
        },


        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }

            if(size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else {
                return url;
            }
        }
    });

    return lazy_loader;
});/**
 * mgr
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./mgr",["lib","$","common","./retry","./store","./user_info","./user_log"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        ret_msgs = common.get('./ret_msgs'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        user = common.get('./user'),
	    https_tool = common.get('./util.https_tool'),
        retry = require('./retry'),
        store = require('./store'),
        user_info = require('./user_info'),

        user_log = require('./user_log'),
        undefined;

    var default_app_cfg = {
        android: {
            published: true,
            packageName: 'com.tencent.weiyungallery',
            packageUrl: "weiyunphototool://share",
            scheme: "weiyunphototool",
            url: window.location.protocol + "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
        },
        ios: {
            published: true,
            packageName: "com.tencent.albumtool",
            packageUrl: "weiyunphototool://share",
            scheme: "weiyunphototool",
            url: window.location.protocol + "//www.weiyun.com"
        },
        appid: 'wxbed0eb0b57304fd0'
    };

    var mgr = new Mgr('outlink.mgr', {

        init: function(cfg) {
            var me = this;
            session_event.on('session_timeout', function() {
                user_info.clear();
                me.clear_cookie();
                retry.init({
                    name: 'auto_join'
                });
                me.to_login();
            });

            $.extend(this, cfg);
            this.observe(user_info);
            this.observe(this.view);

        },

        //以下是自定义的事件处理逻辑
        on_join_album: function() {
            //已加入过相册的不再发请求加入
            if(store.is_album_user()) {
                this.launch_app(false);
                return;
            }

            if(!user_info.is_login() && browser.WEIXIN) {
                this.to_login();
                return;
            } else {
                //异常上报，不予加入
                user_log.write_log('on_join_album', 'is_login: ' + user_info.is_login());
                user_log.report('hzp_outlink_error', -1);

                //return;
            }

            widgets.reminder.loading('加入中...');
            var uin = cookie.get('uin') || cookie.get('p_uin'),
                skey = cookie.get('skey') || cookie.get('p_skey'),
                info = user_info.get_user_info(),
                nickname = info.nickname,
                head_url = info.logo,
                access_token = cookie.get('wx_access_token'),
                share_info = store.get_share_info(),
                openid = cookie.get('wx_openid'),
                me = this;

            logger.write([
                'hzp before join',
                'hzp --------> url:' + location.href,
                'hzp --------> uin: ' + (uin || ''),
                'hzp --------> skey: ' + (skey || ''),
                'hzp --------> nickname: ' + (nickname || ''),
                'hzp --------> head_url: ' + (head_url || ''),
                'hzp --------> access_token: ' + (access_token || ''),
                'hzp --------> openid: ' + (openid || ''),
                'hzp --------> time: ' + new Date()
            ], 'hzp_error', 1);

            uin = uin && parseInt(uin.replace(/^[oO0]*/, ''));
            request.xhr_get({
                url: https_tool.translate_cgi('http://hzp.qq.com/hzp_interface.fcg'),
                cmd: 'WeiyunShareSaveData',
                use_proxy: false,
                cavil: true,
                body: {
                    share_key: share_info['share_key'],
                    join_nickname: nickname || '',
                    join_headurl: head_url || ''
                }
            }).ok(function() {
                logger.write([
                    'hzp join share album success',
                    'hzp --------> uin: ' + (uin || ''),
                    'hzp --------> time: ' + new Date()
                ], 'hzp_error', 2);
                widgets.reminder.hide();
                //widgets.reminder.ok('加入成功');
                store.set_join(true);
                me.view.get_$page_3().find('[data-action=join_album] .txt').text('打开相册');
                me.view.get_$tips().show();

            }).fail(function(msg, ret) {
                if(ret == 24702) {
                    msg = '群人数已达上限';
                }
                logger.write([
                    'hzp join share album fail',
                    'hzp error--------> uin: ' + (uin || ''),
                    'hzp error--------> msg: ' + (msg || ''),
                    'hzp error--------> ret: ' + (ret || ''),
                    'hzp error--------> time: ' + new Date()
                ], 'hzp_error', -1);
                widgets.reminder.error(msg || '加入失败');
            });
        },

        launch_app: function(is_refresh) {
            var me = this,
                dir_key = this.hex2String(store.get_dir_key()),
                user_id = cookie.get('user_id') || cookie.get('uin') || cookie.get('p_uin'),
                schema_url = browser.IOS? default_app_cfg['ios']['packageUrl'] : default_app_cfg['android']['packageUrl'];

            if(user_id) {
                user_id = user_id.replace(/^[oO0]*/, '');
            }

            schema_url = schema_url + '/' + dir_key + (user_id? '?user_id=' + user_id : '');

            if(browser.android && (browser.WEIXIN || browser.QQ || browser.QZONE)) {
                app_api.isAppInstalled(default_app_cfg, function(result) {
                    if(is_refresh){
                        me.view.show_tips();
                    }
                    if(result) {
                        window.location.href = schema_url;
                    } else {
                        me.to_download_app();
                    }
                });
            //} else if(browser.IOS && (browser.WEIXIN)) {
            //    app_api.launchWyApp(default_app_cfg, function(result) {
            //        alert(JSON.stringify(result));
            //        //widgets.reminder.error('加入啊啊啊啊失败');
            //        //if(!result){
            //        //    me.view.show_tips();
            //        //}
            //    });
            //    window.location.href = schema_url;
            //    if(is_refresh){
            //        me.view.show_tips();
            //    } else {
            //        setTimeout(function() {
            //            me.to_download_app();
            //        },300);
            //    }
            } else if(browser.IOS && (browser.QQ || browser.QZONE)) {

                window.location.href = schema_url;
                if(is_refresh){
                    me.view.show_tips();
                } else {
                    setTimeout(function() {
                        var is_visibility = store.get_visibility();
                        is_visibility && me.to_download_app();
                    }, 100);
                }
                //app_api.launchWyApp(default_app_cfg, function(result) {
                //    if(!result){
                //        me.view.show_tips();
                //    } else if(is_refresh) {
                //        setTimeout(function() {
                //            me.to_download_app();
                //        },300);
                //    }
                //});
            } else {
                window.location.href = schema_url;
                if(is_refresh){
                    me.view.show_tips();
                } else {
                    setTimeout(function() {
                        me.to_download_app();
                    },300);
                }
            }
        },

        on_close_tips: function() {
            this.view.get_$tips().hide();
        },

        //下载app
        on_download: function() {
            this.launch_app(false);
        },

        to_download_app: function() {
            var download_url = browser.IOS? 'https://itunes.apple.com/cn/app/id1102283957' : 'http://img.weiyun.com/vipstyle/nr/box/data/android/WeiyunGallery_1.0.1.100_android_r42054_20160603202511_release_5.apk';
            location.href = download_url;
        },

        on_open: function() {
            var me = this;
            widgets.confirm({
                tip: '打开“好照片”播放视频',
                sub_tip: '',
                ok_fn: null,
                cancel_fn: function() {
                    me.launch_app(false);
                },
                btns_text: ['取消', '打开']
            });
        },

        //hex2bin，把后台返回的dir_key转换为客户端使用的字符串格式
        hex2String: function(strInput){
            var HexStr = '',
                nInputLength = strInput.length;

            //当输入够偶数位,奇数是非法输入
            if(nInputLength%2 === 0) {
                for (var i=0; i < nInputLength; i = i + 2 )
                {
                    var str = strInput.substr(i, 2); //16进制；
                    //StrHex = StrHex + .toString(16);

                    var n = parseInt(str, 16);//10进制；
                    HexStr = HexStr + String.fromCharCode(n);
                }
            }
            return HexStr;
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('skey');
            if(uin && skey || sid) {
                return true;
            }

            if(browser.WEIXIN || browser.QQ || browser.QZONE) {
                logger.report('weiyun_share_no_login', {
                    time: (new Date()).toString(),
                    url: location.href,
                    uin: uin || '',
                    skey: skey || '',
                    sid:  ''
                });
            }
            return false;
        },

        clear_cookie: function() {
            var cookie_list = ['wx_nickname', 'wx_headimgurl','wx_openid', 'wy_appid', 'wy_uf', 'user_id', 'access_token', 'openid', 'uin', 'skey', 'p_uin', 'p_skey'];
            var opition = {
                raw: true,
                domain: 'qq.com',
                path: '/'
            };
            for(var key in cookie_list) {
                cookie.unset(cookie_list[key], opition);
            }
        },

        to_login: function() {
            if(browser.WEIXIN) {
                var r_url = location.href.slice(0,location.href.indexOf('?'));
                var redirect_url = 'http://hzp.qq.com/weixin_oauth20.fcg?g_tk=5381&appid=wx847160118bbab80c&action=join_hzp&r_url=' + encodeURIComponent(r_url) + '&use_r_url=1';
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847160118bbab80c&redirect_uri=' + encodeURIComponent(redirect_url) + '%26use_r_url%3D1&response_type=code&scope=snsapi_userinfo&state=join_hzp#wechat_redirect';
            } else {
                var go_url = window.location.href;
                window.location.href = "http://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&daid=442&no_verifyimg=1&pt_wxtest=1&f_url=loginerroralert&hide_close_icon=1&s_url=" + encodeURIComponent(go_url) + "&style=9&hln_css=https%3A%2F%2Fqzonestyle.gtimg.cn%2Fqz-proj%2Fwy-photo%2Fimg%2Flogo-488x200.png";
            }
        }
    });

    return mgr;
});define.pack("./outlink",["$","lib","common","./store","./user_info","./ui","./user_log","./mgr"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        store = require('./store'),
        user_info = require('./user_info'),
        ui = require('./ui'),
        user_log = require('./user_log'),
        mgr = require('./mgr'),

        undefined;

    var outlink = new Module('outlink', {

        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            store.init(serv_rsp);

            ui.render();
            //ad_link.render();
            user_log.init();
            user_info.render();

            mgr.init({
                view: ui
            });
            
            this.set_share(serv_rsp);

            //setTimeout(function() {
            //    seajs.use(['g-component', 'zepto_fx']);
            //},1);
        },

        set_share: function(data) {
            var me = this,
                title = '邀请你加入相册',
                share_nickname = data.share_nick_name || '',
                owner_nickname = data.album_owner_nickname,
                files = data['dir_list'].length? data['dir_list'][0].file_list : [],
                share_desc = data['dir_list'].length? data['dir_list'][0]['dir_name'] : '',
                share_url = location.href.indexOf('?') > -1? location.href.slice(0, location.href.indexOf('?')) : location.href,
                share_icon = (files && files.length)? files[0].thumb_url : 'http://qzonestyle.gtimg.cn/qz-proj/wy-photo/img/logo-200.jpg',
                share_data = {
                    title: title,
                    desc: share_desc,
                    url: share_url + '?_ws=5&_wv=2098177',
                    image: share_icon
                },
                _data = {
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
                    hideMenuItems: []
                };
            if(browser.QQ || browser.QZONE) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                    me.bind_pageVisibility_events();
                });
            } else if(browser.WEIXIN) {
                //share域名下加载引入js sdk有冲突问题，必须得通过require引入
                require.async(constants.HTTP_PROTOCOL + '//res.wx.qq.com/open/js/jweixin-1.0.0.js', function (res) {
                    wx = res;
                    app_api.init(_data, function() {
                        app_api.setShare(share_data);
                    });
                });
            }
        },

        bind_pageVisibility_events: function() {
            document.addEventListener("qbrowserVisibilityChange", function(e){
                if(e.hidden){
                    store.set_visibility(e.hidden);
                }
                //widgets.reminder.ok(typeof e.hidden + ':' + e.hidden + ':' + app_cfg.get_visibility());
            });
        }
    });

    return outlink;
});/**
 * 微信授权后自动操作（点赞和加入相册等）
 * @author xixinhuang
 * @date 2017-02-14
 */
define.pack("./retry",["$","lib","common","./user_log"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        browser = common.get('./util.browser'),
        user_log = require('./user_log'),
        undefined;

    var action_list = ['auto_join'];
    var EXPIRES = 20; //20秒过期时间

    var retry = new Module('retry', {
        //展示点赞列表，去掉重复操作
        init: function(opts) {
            //绑定事件,trigger出来给mgr处理
            var now = +new Date();

            cookie.set(opts.name, now, {
                domain: 'qq.com',
                expires: 1,
                path: '/'
            });
        },

        //自动尝试
        auto_retry: function() {
            var now = +new Date(),
                cookie_name,
                cookie_value;

            for(var i=0; i<action_list.length; i++) {
                cookie_name = action_list[i];
                cookie_value = Number(cookie.get(cookie_name));

                if((now - cookie_value) / 1000 < EXPIRES) {
                    this.destroy(cookie_name);
                    this.trigger(cookie_name);

                    user_log.write_log('auto_retry', cookie_name);
                    user_log.report('hzp_error', 0);
                }
            }
        },

        /**
         * 自动操作后需要清除残留的cookie，以免重刷新时造成干扰
         * 如果不带参数则是清除所有cookie字段
         * @param cookie_name
         */
        destroy: function(cookie_name) {
            var opition = {
                raw: true,
                domain: 'qq.com',
                path: '/'
            };

            if(cookie_name) {
                cookie.unset(cookie_name, opition);
            } else {
                for(var key in action_list) {
                    cookie.unset(action_list[key], opition);
                }
            }
        }
    });

    return retry;
});/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$","./file.FileNode"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./file.FileNode'),

        node_map = {},

        undefined;

    function parse(data) {
        var list = [];

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

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            this.share_info = data;
            if(data && data.dir_list && data.dir_list.length) {
                this.file_list = this.format2nodes(data.dir_list[0]);
                this.set_states(data);
            }
            this._inited = true;
        },

        format2nodes: function(data) {
            var nodes = parse({
                file_list: data.file_list || []
            });

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            return nodes;
        },

        //设置状态，主要是是否加入过
        set_states: function(data) {
            //this._is_album_user = data.already_join;//前端不该信任后台字段

            var me = this,
                user_list = data.haozp_user_list || [],
                user_id = cookie.get('uin') || cookie.get('p_uin') || cookie.get('user_id');

            if(user_id) {
                user_id = user_id.replace(/^o0*/,'');
                $.each(user_list, function(i, user) {
                    if(user_id === user.user_id) {
                        me._is_album_user = true;
                    }
                });
            }
        },

        is_album_user: function() {
            return !!this._is_album_user;
        },

        set_join: function(is_album_user) {
            this._is_album_user = is_album_user;
        },

        set_visibility: function(is_hidden) {
            this.is_visibility = !is_hidden;
            this.time = +new Date();
            var me = this;

            setTimeout(function() {
                me.is_visibility = true;
                me.time = 0;
            }, 5000);
        },

        /*
         * 判断页面可见性，需满足条件：1）设置过is_visibility; 2）时间在500ms内; 3) is_visibility属性为false，即不可见
         * */
        get_visibility: function() {
            var now = +new Date();
            if(this.time && (now - this.time < 500) && !this.is_visibility) {
                this.is_visibility = true;
                this.time = 0;
                return false;
            } else {
                return true;
            }
        },

        get: function(file_id) {
            if(typeof file_id == 'string') {
                return node_map[file_id];
            }
            return file_id;
        },

        get_dir_key: function() {
            var share_info = this.get_share_info(),
                dir_key = '';

            if(share_info.dir_list && share_info.dir_list.length) {
                dir_key = share_info.dir_list[0].dir_key;
            }
            return dir_key;
        },

        get_dir_name: function() {
            var share_info = this.get_share_info(),
                dir_name = '';

            if(share_info.dir_list && share_info.dir_list.length) {
                dir_name = share_info.dir_list[0].dir_name;
            }
            return dir_name;
        },

        get_user_id: function() {
            var user_id = cookie.get('user_id') || cookie.get('uin') || cookie.get('p_uin');
            if(user_id) {
                user_id = user_id.replace(/^[oO0]*/, '');
            }

            return user_id;
        },

        get_user_list: function() {
            var list = [],
                share_info = this.get_share_info(),
                share_uid = share_info.share_user_id,
                user_list = share_info.haozp_user_list;

            for(var i=0; i<user_list.length; i++) {
                if(user_list[i].user_id && user_list[i].logo && user_list[i].user_id !== share_uid) {
                    list.push(user_list[i]);
                }
            }

            return list;
        },

        get_file_list: function() {
            return this.file_list;
        },

        get_type: function() {
            return this.type = this.type || (this.type = this.share_info.share_flag);
        },

        get_share_info: function() {
            return this.share_info;
        }
    };

    $.extend(store, events);

    return store;
});/**
 * 获取头像昵称等数据
 * @author xixinhuang
 * @date 2017-01-13
 */
define.pack("./text",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        request = common.get('./request'),
        widgets = common.get('./ui.widgets'),
        default_options = {
            container: null,
            item_selector: null,
            text_selector: null,
            max_width: 0,
            max_size: 0,
            min_size: 0
        },
        undefined;

    var Text = function(opts) {
        if (opts.container) {
            opts.container = $(opts.container);
        } else {
            throw '无效的参数，须指定$container';
        }
        this._options = $.extend({}, default_options, opts);
    };

    Text.prototype = {
        /**
         * 获取文件DOM节点列表
         * @returns {DOM} 文件列表
         */
        get_$list: function () {
            this.$list = this._options.container.find(this._options.item_selector);
            return this.$list;
        },

        is_empty: function() {
            return this._options.container && this.get_$list().length === 0;
        },

        adjust: function() {
            if(!this.is_empty()) {
                var me = this,
                    $item,
                    current_width,
                    list = this.get_$list(),
                    max_width = this._options.max_width,
                    max_size = this._options.max_size,
                    min_size = this._options.min_size;

                $.each(list, function(index, item) {
                    $item = $(item);
                    $item.css('font-size', min_size + 'px');

                    //循环修改大小直至大于最大高度
                    for (var i = min_size; i < max_size; i++) {
                        current_width = $item.find(me._options.text_selector).width();

                        if (current_width && current_width > max_width) {
                            $item.css('font-size', (i - 1) + 'px');
                            break;
                        } else {
                            $item.css('font-size', i + 'px');
                        }
                    }
                });
            }
        },

        destroy: function() {

        }
    }

    return Text;
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui",["lib","$","common","./retry","./store","./text","./tmpl","./mgr"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        router = lib.get('./router'),
        cookie = lib.get('./cookie'),
        retry = require('./retry'),
        store = require('./store'),
        Text = require('./text'),
        tmpl = require('./tmpl'),
        mgr = require('./mgr'),

        text_helper,
        last_slide_time,
        MAX_PHOTO_LEN = 30,
        undefined;

    var win_height = $(window).height(),
        win_width = $(window).width();

    var ui = new Module('ui', {

        render: function() {
            var me = this,
                share_info = store.get_share_info(),
                already_join = store.is_album_user(),
                nickname = share_info.share_nick_name,
                avatar = share_info.share_head_image_url,
                dir_name = store.get_dir_name(),
                filter_user_list = store.get_user_list(),
                user_list = share_info.haozp_user_list,
                file_list = store.get_file_list();

            var tempSlider = document.getElementById('slider-box');
            var $page1 =  $(tmpl.page_1({
                    already_join: already_join,
                    dir_name: dir_name,
                    nickname: nickname,
                    avatar: avatar,
                    user_list: user_list
                })),
                $page2 = $(tmpl.page_2({
                    filter_user_list: filter_user_list,
                    already_join: already_join,
                    nickname: nickname,
                    avatar: avatar,
                    user_list: user_list
                })),
                $page3 = $(tmpl.page_3({
                    already_join: already_join,
                    file_list: file_list
                }));
            var data =[
                {content: $page1[0].outerHTML},
                {content: $page2[0].outerHTML},
                {content: $page3[0].outerHTML}
            ];

            this.islider = new iSlider(tempSlider, data,{
                //isLooping: true,
                isOverspread: true,
                animateTime: 800,
                //dampingForce: 0,
                //isDebug: true,
                isVertical: true,
                animateEasing: 'ease-out',
                //animateType: 'fade',
                onSlideStart: function(e) {
                    //console.log(new Date() + ':onSlideStart');
                },
                onSlide: function(e) {
                    //console.log(new Date() + ':onSlide');
                    me.islider.hold();
                },
                onSlideEnd: function(e) {
                    //console.log(new Date() + ':onSlideEnd');
                    me.islider.unhold();

                    var $target = $(e.target).closest('[data-action]');
                    if($target && $target.length) {
                        var action_name = $target.attr('data-action');
                        me.trigger('action', action_name, e);
                    }
                },
                onSlideChange: function(index, dom) {
                    //console.log(new Date() + ':onSlideChange');
                    me.islider.hold();
                },
                onSlideChanged: function(index, dom) {
                    //当场景改变完成(动画完成)时触发 or 执行loadData时触发
                    //console.log(new Date() + ':onSlideChanged');
                    me.islider.unhold();

                    //每次滑动重新计算字号
                    if(text_helper) {
                        text_helper.adjust();
                    }
                },
                onSlideRestore: function(index, dom) {
                    //console.log(new Date() + ':onSlideRestore');
                    me.islider.hold();
                },
                onSlideRestored: function(index, dom) {
                    //console.log(new Date() + ':onSlideRestored');
                    me.islider.unhold();
                }
            });

            this.adjust_text();
            //this.islider.hold();

            this._bind_events();
            this.listen_auto_events();
            this._bind_landscape_events();

            //检测是否需要自动操作
            retry.auto_retry();
        },

        _bind_events: function() {
            var me = this;
            this.get_$ct().on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                me.trigger('action', action_name, e);
            });
        },

        _bind_landscape_events: function() {
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
                if (window.orientation === 180 || window.orientation === 0) {
                    $('.j-landscape').hide();
                }
                if (window.orientation === 90 || window.orientation === -90 ){
                    $('.j-landscape').show();
                }
            }, false);
        },

        //监听自动操作
        listen_auto_events: function() {
            var me = this;
            this.listenTo(retry, 'auto_join', function() {
                me.islider.slideTo(2);
                mgr.on_join_album();
            });
        },

        //标题自适应调整文本字号
        adjust_text: function() {
            text_helper = new Text({
                container: '#container',
                item_selector: '.photo-title',
                text_selector: 'span.title-inner',
                max_width: Math.round(win_width * 0.75),
                max_size: 31,
                min_size: 25
            });

            text_helper.adjust();
        },

        slide_next: function(slideTop, index) {
            var me = this,
                $items = this.get_$ct().find('.j-animate');
            var total_length = $items.length;

            if(last_slide_time && (last_slide_time && +new Date() - last_slide_time)<600) {
                return;
            }
            last_slide_time = +new Date();

            //禁用循环
            if((!slideTop && index===1) || (slideTop && index===total_length)) {
                return;
            }

            //干掉start
            //$('.j-animate-next').removeClass('start');

            var next_index = slideTop? index + 1 : index - 1;
            var $now = $('.j-page-' + index),
                $next = $('.j-page-' + next_index);

            if(slideTop){
                $next.css('transform', 'translateY(0%)').addClass('animate');
                $now.css('transform', 'translateY(-100%)').removeClass('animate');
                //左滑动
            } else if(!slideTop) {
                $next.css('transform', 'translateY(0%)').addClass('animate');
                $now.css('transform', 'translateY(100%)').removeClass('animate');
            }
        },

        show_tips: function() {
            //var photo_list = store.get_file_list();
            //if(photo_list.length > 1) {
            //    this.get_$ct().find('.photo-banner').removeClass('slide').addClass('lattice');
            //    this.get_$ct().find('.photo-banner').removeAttr('style');
            //}
        },

        get_$page_1: function() {
            return this.$page1 = this.$page1 || (this.$page1 = $('.j-page-1'));
        },

        get_$page_2: function() {
            return this.$page2 = this.$page2 || (this.$page2 = $('.j-page-2'));
        },

        get_$page_3: function() {
            return this.$page3 = this.$page3 || (this.$page3 = $('.j-page-3'));
        },

        get_$tips: function() {
            return this.$tips = this.$tips || (this.$tips = $('.j-tips'));
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        }
    });

    return ui;
});/**
 * 获取头像昵称等数据
 * @author xixinhuang
 * @date 2017-01-13
 */
define.pack("./user_info",["$","lib","common","./user_log"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        https_tool = common.get('./util.https_tool'),
        user_info_event = common.get('./global.global_event').namespace('user_info_event'),

        user_log = require('./user_log'),
        undefined;

    var user_info = new Module('user_info', {
        _is_login: false,
        _nickname: '',
        _logo: '',

        render: function() {
            if(this._rendered && this._is_login) {
                return;
            }
            this.check_user_info();
            this._bind_events();
            this._rendered = true;
        },

        _bind_events: function() {
            var me = this;
            //更新cookie后，需要重新拉取头像昵称信息
            user_info_event.off('update_cookie').on('update_cookie', function() {
                me.check_user_info();
            });
        },

        is_login: function() {
            return this._is_login;
        },

        get_user_info: function() {
            return {
                nickname: this._nickname,
                logo: this._logo,
                user_id: ''
            }
        },

        check_user_info: function() {
            var me = this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://hzp.qq.com/hzp_interface.fcg'),
                cmd: 'AuthProxyGetUserInfo',
                use_proxy: false,
                re_try: 3,
                body: {}
            }).ok(function(msg, body) {
                me._nickname = body.nick_name;
                me._logo = body.head_img_url;
                me._is_login = true;
                user_log.write_log('AuthProxyGetUserInfo', body);
                user_log.report('hzp_outlink_error', 0);

            }).fail(function(msg, ret) {
                user_log.write_log('AuthProxyGetUserInfo_error', msg + ':' + ret);
                if (!ret_msgs.is_sess_timeout(ret)) {
                    user_log.report('hzp_outlink_error', ret);
                }
                me._is_login = false;
            });
        },

        clear: function() {
            this._is_login = false;
            this._rendered = false;
            this._nickname = '';
            this._logo = '';
        }
    });

    return user_info;
});/**
 * 用户操作日志
 * 后续再并入common库
 * @author xixinhuang
 * @date 2017-01-13
 */
define.pack("./user_log",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        dateformat  = lib.get('./dateformat'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        reportMD = common.get('./report_md'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        log_data = [],
        undefined;

    var last_time,
        cache_log = [],
        cache_error = [],
        timer = {},
        uin = '';
    var view_key = 'hzp_' + uin;

    var user_log = new Module('user_log', {

        init: function() {
            log_data = [
                'hzp --------> time: ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss'),
                'hzp --------> url:' + location.href,
                'hzp --------> uin:' + (cookie.get('user_id') || cookie.get('uin') || cookie.get('p_uin')),
                'hzp --------> skey: ' + (cookie.get('skey') || cookie.get('p_skey')),
                'hzp --------> access_token: ' + cookie.get('access_token'),
                'hzp --------> openid: ' + cookie.get('openid')
            ];
        },

        write_log: function(key, str) {
            if(typeof str === 'object') {
                log_data.push('hzp --------> ' + key + ': ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss') + ' ' + JSON.stringify(str));
            } else {
                log_data.push('hzp --------> ' + key + ': ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss') + ' ' + str);
            }
        },

        //微信或者微信帐号登录等场景，如果没有uin数据，则从user_id种取出，种入uin字段，方便查询log。如果user_id非数字则使用10000代替
        set_cookie: function() {
            var user_id = cookie.get('user_id'),
                uin = cookie.get('uin'),
                p_uin = cookie.get('p_uin');

            if(!uin) {
                user_id = (!user_id || isNaN(user_id))? (p_uin || 10000) : user_id;
                cookie.set('uin', user_id, {
                    domain: 'qq.com',
                    expires: 1,
                    path: '/'
                });
            }
        },

        //异常上报一次，退出页面上报一次，预览则自动上报一次
        report: function(mode, ret) {
            var now = new Date().getTime(),
                take_time = 4,      //实时上报
            //last_time ? (now - last_time) / 1000 : 4,
                url = (constants.IS_HTTPS ? 'https:': 'http:') + '//hzp.qq.com/report/error/' + (mode || view_key),
                interfaceMap = {
                    'hzp_show_image_error': 179000212,  //好照片换图异常
                    'hzp_mv_save_error': 179000206,     //好照片MV保存接口
                    'hzp_like_error': 179000207,        //好照片MV点赞接口
                    'hzp_outlink_error': 179000221,     //好照片邀请页异常log上报
                    'hzp_error': 178000359              //好照片操作异常log上报
                };

            this.set_cookie();

            //三秒上报一次, 这里last_time标识上次上报的时间点。
            if(take_time > 3) {
                timer && clearTimeout(timer);
                cache_error.push(log_data.join('\n'));
                timer = setTimeout(function() {
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: cache_error.join('\n'),
                        contentType: 'text/plain',
                        xhrFields: {
                            withCredentials: true
                        }
                    });
                    cache_error = [];
                }, 3 * 1000);
                last_time = now;
            } else {
                cache_error.push(log_data.join('\n'));
            }

            if(mode && ret) {
                reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
            }
        }
    });

    return user_log;
});
//tmpl file list:
//outlink/src/outlink.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_fail" class="wy-reload-wrap">\r\n\
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
},

'tips': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="dialog-wrap">\r\n\
        <div class="dialog">\r\n\
            <div class="bd">\r\n\
                <p class="text">你已加入此相册</p>\r\n\
                <p class="tip">安装好照片客户端立即查看相册内容</p>\r\n\
            </div>\r\n\
            <div class="ft">\r\n\
                <div class="btn cancel-btn"><span>以后再说</span></div>\r\n\
                <div class="btn confirm-btn"><span>立即安装</span></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'page_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="section sec1 page page-1 j-page-1 j-animate" data-index="1">\r\n\
        <div class="inner">');

                var dir_name = data.dir_name;
                var nickname = data.nickname;
                var avatar = data.avatar;
                var user_list = data.user_list;
                var len = user_list.length;
                var already_join = data.already_join;
                var btn_text = already_join? '打开相册' : '加入相册';
                var user;
            __p.push('            <div class="photo-title"><h1><span>《</span><span class="title-inner">');
_p(dir_name);
__p.push('</span><span>》</span></h1></div>\r\n\
            <div class="title"></div>\r\n\
            <div class="sub-title">\r\n\
                <p class="text-1">你的朋友<span class="name">');
_p(nickname);
__p.push('</span></p>\r\n\
                <p class="text-2">诚邀你加入相册</p>\r\n\
            </div>\r\n\
            <div class="paper-bg"></div>\r\n\
            <!-- 动画预留结构 S -->\r\n\
            <div class="circle">\r\n\
                <div class="circle-1"></div>\r\n\
                <div class="circle-2"></div>\r\n\
                <div class="circle-3"></div>\r\n\
                <div class="circle-4"></div>\r\n\
                <div class="circle-5"></div>\r\n\
                <div class="circle-6"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="next-tip"><span>滑动查看下一页</span></div>\r\n\
        <i class="icon icon-slide"></i>\r\n\
        <!-- 动画预留结构 E -->\r\n\
    </div>');

return __p.join("");
},

'page_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="section sec2 page page-2 j-page-2 j-animate" data-index="2">\r\n\
        <div class="inner">');

                var nickname = data.nickname;
                var avatar = data.avatar;
                var user_list = data.user_list;
                var filter_user_list = data.filter_user_list;
                var len = filter_user_list.length>8? 8 : (filter_user_list.length>0? filter_user_list.length : 0);
                var member_class = len>0? 'member-' + len : '';
                var already_join = data.already_join;
                var btn_text = already_join? '打开相册' : '加入相册';
                var user;
            __p.push('            <div class="main">\r\n\
                <div class="member-list-wrap">\r\n\
                    <div class="host-wrap">\r\n\
                        <div class="avatar" style="background-image:url(');
_p(avatar);
__p.push(')"></div>\r\n\
                        <div class="name"><span>');
_p(nickname);
__p.push('</span></div>\r\n\
                    </div>\r\n\
\r\n\
                    <ul class="member-list ');
_p(member_class);
__p.push('">');

                            for(var i=0; i < len; i++) {
                                user = filter_user_list[i];
                        __p.push('                        <li class="item-member j-item" data-id="');
_p(user.user_id);
__p.push('">\r\n\
                            <div class="avatar" style="background-image:url(');
_p(user.logo);
__p.push(')" ');
 if(i === len-1) { __p.push(' data-type="finish" ');
 } __p.push(' ></div>\r\n\
                            <div class="name"><span>');
_p(user.nickname);
__p.push('</span></div>\r\n\
                        </li>');

                            }
                        __p.push('                    </ul>\r\n\
                    <div class="circle-bg"></div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="text">\r\n\
                <p class="text-1">等');
_p(user_list.length);
__p.push('人已加入该相册</p>\r\n\
                <p class="text-2"><span class="name">');
_p(nickname);
__p.push('</span>呼唤你快来加入</p>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="next-tip"><span>滑动查看下一页</span></div>\r\n\
        <i class="icon icon-slide"></i>\r\n\
    </div>');

return __p.join("");
},

'page_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="section sec3 page page-3 j-page-3 j-animate" data-index="3">\r\n\
        <div class="inner">');

                var file_list = data.file_list;
                var len = file_list.length>7? 7 : (file_list.length>0? file_list.length : 1);
                var already_join = data.already_join;
                var btn_text = already_join? '打开相册' : '加入相册';
                var file;
            __p.push('            <!-- 有n张则加class photo-n，最多7张 -->\r\n\
            <div class="photo-list-wrap photo-');
_p(len);
__p.push('">\r\n\
                <ul class="photo-list">');

                        if(file_list.length === 0) {
                    __p.push('                    <li class="item-photo">\r\n\
                        <div class="photo" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/invite/invite-normal.jpg)"></div>\r\n\
                    </li>');

                        } else {
                            for(var i=0; i < len; i++) {
                                file = file_list[i];
                                if(file.is_image()) {
                    __p.push('                    <li class="item-photo">\r\n\
                        <div class="photo" style="background-image:url(');
_p(file.get_thumb_url());
__p.push(')"></div>\r\n\
                    </li>');

                                } else if(file.is_video()) {
                    __p.push('                    <li class="item-photo">\r\n\
                        <div class="photo" style="background-image:url(');
_p(file.get_video_thumb());
__p.push(')"></div>\r\n\
                        <div class="video-tip">\r\n\
                            <div class="time"><span>');
_p(file.get_duration());
__p.push('</span></div>\r\n\
                            <i class="icon icon-play"></i>\r\n\
                        </div>\r\n\
                    </li>');

                                }
                            }
                        }
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <p class="text">加入相册查看更多照片</p>\r\n\
            <div class="bg"></div>\r\n\
        </div>\r\n\
        <div class="btn-add-wrap" data-action="join_album">\r\n\
            <button class="btn-add">\r\n\
                <span class="txt">');
_p(btn_text);
__p.push('</span>\r\n\
            </button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
