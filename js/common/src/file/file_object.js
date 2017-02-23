/**
 * 文件类
 *  @author jameszuo
 *  @date 13-1-16
 */

define(function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),


        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('file_object'),
        text = lib.get('./text'),
        covert = lib.get('./covert'),
        date_time = lib.get('./date_time'),

        constants = require('./constants'),

    // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
    // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1, pic: 1 },
    // 可预览的文档类型
        EXT_PREVIEW_DOC_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, rtf: 1, wps: 1/*, ppt: 1, pptx: 1*/, pdf: 1, txt: 1, text: 1 },
    // 视频文档类型
        EXT_VIDEO_TYPES = { video: 1, swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },

        EXT_COMPRESS_TYPES = { zip: 1, '7z': 1, rar: 1 },

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),

    //根据后缀名获取文件类型
        file_type_map = require('./file.file_type_map'),

        empty_str = '',

        math = Math,
        parse_int = parseInt,

        undefined;

    /**
     * 构造函数
     * @param props
     *    {String} id                 文件ID
     *    {String} pid                父目录ID
     *    {String} [is_dir]           是否目录，默认false
     *    {String} name               文件名
     *    {Number} [size]             字节数，默认0
     *    {Number} [cur_size]         已上传的字节数，默认0
     *    {String} [create_time]      创建时间，默认''
     *    {String} [modify_time]      修改时间，默认''
     *    {String} [file_ver]         版本号，默认''
     *    {String} [file_md5]         MD5，默认''
     *    {String} [file_sha]         SHA，默认''
     *    {Boolean} [is_dirty]        是否脏目录，默认false
     *    {Boolean} [is_downable]     是否可下载，默认true，破损文件为false
     *    {Boolean} [is_movable]      是否可移动，默认true，破损文件为false
     *    {Boolean} [is_removable]    是否可删除，默认true
     *    {Boolean} [is_renamable]    是否可重命名，默认true
     *    {Boolean} [is_sortable]     是否可排序，默认true
     *    {Boolean} [is_selectable]   是否可选中，默认true
     *    {Boolean} [is_droppable]    是否可丢放文件，默认true，文件为false
     *    {String} [icon]            图标class，默认''
     *    {Boolean} [whole_click]     是否整个文件DIV都可点击，默认false
     *    {Boolean} [is_tempcreate]   是否是新建文件夹，默认false，文件为false
     * @constructor
     */
    var File = function (props) {
        var me = this;

        if (!props.id) {
            console.warn('new File(props) 无效的参数 id');
            return;
        }

        me._id = props.id;
        me._is_dir = !!props.is_dir;

        me.set_name(props.name);
        me.set_size(props.size || 0);
        me.set_cur_size(props.cur_size || 0);
        me.set_create_time(props.create_time);
        me.set_modify_time(props.modify_time || props.create_time);
        me.set_file_ver(props.file_ver);
        me.set_file_md5(props.file_md5);
        me.set_file_sha(props.file_sha);
	    if(props.ext_info && (props.ext_info.thumb_url || props.ext_info.https_url)) {
		    me.set_thumb_url(props.ext_info.thumb_url, props.ext_info.https_url);
            me.set_long_time(props.ext_info.long_time);
	    }

	    me._pid = props.pid;//父级ID
        me._is_dirty = props.is_dirty === true;
        me._is_downable = props.is_downable !== false;
        me._is_sortable = props.is_sortable !== false;
        me._is_movable = props.is_movable !== false;
        me._is_removable = props.is_removable !== false;
        me._is_renamable = props.is_renamable !== false;
        me._is_selectable = props.is_selectable !== false;
        me._is_droppable = me.is_dir() && props.is_droppable !== false;
        me._is_draggable = props.is_draggable !== false;
        me._icon = props.icon || '';
        me._whole_click = props.whole_click === true;

        me._is_tempcreate = props.is_tempcreate && me.is_dir();

        // 破文件不可移动、不可下载
        if (me.is_broken_file()) {
            me._is_movable = false;
            me._is_downable = false;
        }
    };

    File.prototype = {
        _is_file_instance: true,
        // 只读属性:是否是图片
        is_image: function () {
            return this._is_image;
        },
	    // 只读属性:是否种子文件
	    is_torrent_file: function () {
		    return this._is_torrent;
	    },
        is_compress_file: function () {
            return this._is_compress_file;
        },

        // 只读属性：是否可预览
        is_preview_doc: function () {
            return this._is_preview_doc;
        },
        // 只读属性：是否是视频
        is_video: function () {
            return this._is_video;
        },
        // 只读属性:是否破损文件
        is_broken_file: function () {
            return this._is_broken;
        },
        // 只读属性:是否空文件
        is_empty_file: function () {
            return this._is_empty;
        },
        // 只读属性:是否目录
        is_dir: function () {
            return this._is_dir;
        },
        //只读属性:ID
        get_id: function () {
            return this._id;
        },
        // 只读属性:文件类型
        get_type: function () {
            return this._type;
        },
        // 只读属性:可读的文件大小（1M、10G）
        get_readability_size: function () {
            return this._readability_size;
        },

        get_name: function () {
            return this._name;
        },
	    get_thumb_url: function (size, order) {
		    if(order == 'http') {
			    return this._thumb_url;
		    } else if(order == 'https') {
			    return this._https_url;
		    } else {
			    return constants.IS_HTTPS ? this._https_url : this._thumb_url;
		    }
	    },
        //获取视频url，这里字段跟图片一样，但没有区分https
        get_video_thumb_url: function(size) {
            if(!this.is_video() || !this.get_thumb_url(size, 'http')) {
                return '';
            } else {
                //兼容https
                var thumb_url = this.get_thumb_url(size, 'http');
                if(constants.IS_HTTPS && thumb_url.indexOf('https') === -1) {
                    thumb_url = thumb_url.replace('http', 'https');
                }
                return thumb_url + '/' + size;
            }
        },
        get_name_no_ext: function () {
            var n = this.get_name();
            if (this.is_dir()) {
                return n;
            } else {
                var m = n.match(NAME_NO_EXT_RE);
                m = m ? m[1] : n;
                return $.trim(m) || n;
            }
        },
        get_size: function () {
            return this._size;
        },
        get_cur_size: function () {
            return this._cur_size;
        },
        get_create_time: function () {
            return this._create_time || empty_str;
        },
        get_modify_time: function () {
            return this._modify_time || empty_str;
        },
        get_file_ver: function () {
            return this._file_ver;
        },
        get_file_md5: function () {
            return this._file_md5;
        },
        get_file_sha: function () {
            return this._file_sha;
        },
        set_name: function (name) {
            this._name = name;
            var type = this._type = File.get_type(this._name, this._is_dir);
	        var ext = File.get_ext(this._name);
            // 图片类型
            this._is_image = type in EXT_IMAGE_TYPES;
            // 是否可预览的文档
            this._is_preview_doc = type in EXT_PREVIEW_DOC_TYPES;
            // 是否视频
            this._is_video = type in EXT_VIDEO_TYPES;
	        // 是否种子
	        this._is_torrent = ext === 'torrent';
            // 是否压缩包
            this._is_compress_file = type in EXT_COMPRESS_TYPES;
        },
        set_size: function (size) {
            this._size = parse_int(size);
        },
        set_cur_size: function (cur_size) {
            this._cur_size = parse_int(cur_size) || 0;
            this._is_empty = !this._is_dir && !this._cur_size;
            this._is_broken = !this._is_dir && this._cur_size < this._size;
            this._readability_size = File.get_readability_size(this._size, this._is_dir);
        },
        set_create_time: function (create_time) {
            if(typeof create_time === 'number') {
                create_time = date_time.timestamp2date(create_time);
            }
            this._create_time = create_time;
        },
        set_modify_time: function (modify_time) {
            if(typeof modify_time === 'number') {
                modify_time = date_time.timestamp2date(modify_time);
            }
            this._modify_time = modify_time;
        },
        set_file_ver: function (file_ver) {
            this._file_ver = file_ver;
        },
        set_file_md5: function (file_md5) {
            this._file_md5 = file_md5;
        },
        set_file_sha: function (file_sha) {
            this._file_sha = file_sha;
        },
	    set_thumb_url: function(thumb_url, https_url) {
		    this._thumb_url = thumb_url;
		    this._https_url = https_url;
	    },
        set_long_time: function(long_time) {
            this._long_time = long_time || '';
        },
        set_tempcreate: function (is_temp) {
            this._is_tempcreate = is_temp;
        },

        // 判断目录是否脏
        is_dirty: function () {
            return this._is_dirty;
        },

        // 判断目录是否可以删除
        is_removable: function () {
            return !this._is_tempcreate && this._is_removable;
        },

        // 判断目录是否可以移动
        is_movable: function () {
            return !this._is_tempcreate && this._is_movable;
        },

        // 判断文件、目录是否可以下载
        is_downable: function () {
            return !this._is_tempcreate && this._is_downable;
        },

        // 判断文件、目录是否可以重命名
        is_renamable: function () {
            return !this._is_tempcreate && this._is_renamable;
        },

        // 判断文件、目录是否参与排序
        is_sortable: function () {
            return !this._is_tempcreate && this._is_sortable;
        },

        // 是否可以选中
        is_selectable: function () {
            return !this._is_tempcreate && this._is_selectable;
        },

        // 是否可以丢放文件
        is_droppable: function () {
            return !this._is_tempcreate && this._is_droppable;
        },

        // 是否可以拖拽文件
        is_draggable: function () {
            return !this._is_tempcreate && this._is_draggable;
        },

        // 是否整个文件节点都可以点击
        is_whole_click: function () {
            return this._whole_click;
        },

        // 是否为临时新建节点，即本地临时创建的节点，仅作为下一步确认新建文件名用。
        is_tempcreate: function () {
            return this._is_tempcreate;
        },
        get_icon: function () {
            return this._icon;
        },
        get_pid: function () {
            return this._pid;
        }
    };

    /**
     * 获取文件类型（ 不是后缀名，如 a.wps 的get_type() 会返回 doc ）
     * @param {String} name
     * @param {Boolean} is_dir
     * @return {String}
     */
    File.get_type = function (name, is_dir) {
        var ext;
        if (is_dir) {
            return (constants.IS_OLD || constants.IS_APPBOX)? file_type_map.get_folder_type() : file_type_map.get_folder_type_v2();
        } else {
            ext = !is_dir ? File.get_ext(name) : null;
            if (ext) {
                return (constants.IS_OLD || constants.IS_APPBOX)? file_type_map.get_type_by_ext(ext) : file_type_map.get_type_by_ext_v2(ext);
            }
        }
        return '';
    };

    File.is_image = function (name) {
        var type = File.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    File.is_preview_doc = function (name) {
        var type = File.get_type(name, false);
        return type in EXT_PREVIEW_DOC_TYPES;
    };

    /**
     * 获取文件后缀名(小写)
     * @param {String} name
     * @return {String}
     */
    File.get_ext = function (name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;
    };

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Boolean} [is_dir] 是否目录（目录会返回空字符串）
     * @param {Number} [decimal_digits] 保留小数位，默认1位
     */
    File.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        if(bytes === -1){
            return '超过4G';
        }

        bytes = parse_int(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

        if (!bytes)
            return '0B';

        var unit = parse_int(math.floor(math.log(bytes) / math.log(1024)));
        var size = bytes / math.pow(1024, unit);
        var decimal_mag = math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
        var int_size = parse_int(decimal_size);
        var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

        /*
         // 这是旧的需求实现：12.345G要显示为12.34G；12.00G要显示为12G - james
         var decimal_size = (math.floor(size * 100) / 100);  // 12.345 -> 12.34

         // 如果小数位有值，则保留2位；小数位为0，则不保留 @james
         if (decimal_size !== parse_int(decimal_size)) {
         result = decimal_size.toFixed(2);
         }
         // 整数
         else {
         result = parse_int(size);
         }*/

        return result + BYTE_UNITS[unit];
    };

    var re_name_deny = new RegExp('[\\:*?/\"<>|]'), // 禁止使用的字符
        max_len = 255, // 文件名最大字符数
        file_error_code = {
            EMPTY_NAME: 'EMPTY_NAME',
            DENY_CHAR: 'DENY_CHAR',
            OVER_LIMIT: 'OVER_LIMIT'
        },
        file_error_msgs = {
            EMPTY_NAME: '名不能为空，请重新命名',
            DENY_CHAR: '不能包含以下字符之一 /\\:?*\"><|',
            OVER_LIMIT: '名过长，请重新命名'
        };
    /**
     * 判断一个文件名是否有效
     * @param {String} name
     * @return {String} 返回错误类型
     */
    File.check_name_error_code = function (name) {
        // 检查字符个数
        if (!name) {
            return file_error_code.EMPTY_NAME;
        }
        else if (re_name_deny.test(name)) {
            return file_error_code.DENY_CHAR;
        }
        else if (/*text.byte_len(name)*/name.length > max_len) { // Fix bug 48823337，各操作系统的文件名是按字符计的，而非字节
            return file_error_code.OVER_LIMIT;
        }
    };
    /**
     * 判断一个文件名是否有效
     * @param {String} name
     * @param {Boolean} is_dir
     */
    File.check_name = function (name, is_dir) {
        var error_msg = file_error_msgs[File.check_name_error_code(name)];
        return error_msg ? (is_dir ? '文件夹' : '文件') + error_msg : undefined;
    };

    /**
     * 判断对象是不是File的实例
     * @param obj
     */
    File.is_instance = function (obj) {
        return obj && obj._is_file_instance;
    };

    File.get_readability_size(1314, false, 2);
    for (var i = 0; i < 100; i++) {
        var v = parse_int(Math.random() * 100000);
        File.get_readability_size(v, false, 2);
    }

    return File;
});
