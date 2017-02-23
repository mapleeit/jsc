/**
 * 回收站File对象
 * @author jameszuo
 * @date 13-3-22
 */
define(function (require, exports, module) {

    var common = require('common'),
        File = common.get('./file.file_object'),
        https_tool = common.get('./util.https_tool'),
	    constants = common.get('./constants'),

        undefined;

	var getExt = function(_name) {
		var EXT_REX = /\.([^\.]+)$/;
		var m = (_name || '').match(EXT_REX);
		return m ? m[1].toLowerCase() : null;
	};

	var isVideo = function(fileName) {
		var EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1},
			fileType = getExt(fileName),
			is_video = fileType in EXT_VIDEO_TYPES;

		return is_video;
	};

    var RecFile = function (options) {
        File.apply(this, arguments);

        this._del_time = options.del_time;
        this._thumb_url = options.thumb_url;
	    this._https_url = options.https_url;
        this._ftn_cookie_k = options.ftn_cookie_k;
        this._ftn_cookie_v = options.ftn_cookie_v;
        this._is_selected = false;
    };

    $.extend(RecFile.prototype, File.prototype, {

        get_del_time: function () {
            return this._del_time;
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

        get_ftn_cookie_k: function () {
            return this._ftn_cookie_k;
        },

        get_ftn_cookie_v: function () {
            return this._ftn_cookie_v;
        },

        is_selected: function () {
            return this._is_selected;
        },

        set_selected: function (is_sel) {
            this._is_selected = !!is_sel;
        }

    });

    /**
     * 解析CGI返回的文件数据
     * @param {Object} obj
     */
    RecFile.from_cgi = function (obj) {
        var
            is_dir = !!obj['dir_key'],
        // 公共属性
            id = obj[ is_dir ? 'dir_key' : 'file_id' ],
            name = obj[ is_dir ? 'dir_name' : 'filename' ],
            del_time = obj[ is_dir ? 'dir_dtime' : 'file_dtime' ],
            thumb_url = obj[ 'abstract_url' ],
	        https_url = obj[ 'https_url' ],

            ftn_cookie_k = thumb_url ? obj[ 'cookie_name' ] : undefined,
            ftn_cookie_v = thumb_url ? obj[ 'cookie_value' ] : undefined,

        // 文件属性
            size = is_dir ? parseInt(obj['space']) : parseInt(obj[ 'file_size' ]) || 0;

        if (thumb_url) {
	        if(!isVideo(name)) {
		        thumb_url = thumb_url + (thumb_url.indexOf('?') > -1 ? '&' : '?') + 'size=32*32';
	        } else {
		        thumb_url = thumb_url + '/64';
	        }
        }

	    if (https_url) {
		    if(!isVideo(name)) {
			    https_url = https_url + (https_url.indexOf('?') > -1 ? '&' : '?') + 'size=32*32';
		    } else {
			    https_url = https_url + '/64';
		    }
	    }


        return new RecFile({
            is_dir: is_dir,
            id: id,
            name: name,
            del_time: del_time,
            thumb_url: thumb_url,
	        https_url: https_url,
            ftn_cookie_k: ftn_cookie_k,
            ftn_cookie_v: ftn_cookie_v,
            size: size,
            cur_size: size
        });
    };

    return RecFile;
});