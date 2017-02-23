/**
 * User: trumpli
 * Date: 13-11-7
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
	    common = require('common'),
        date_time = lib.get('./date_time'),
        inherit = lib.get('./inherit'),
	    constants = common.get('./constants'),
        Photo_Node = inherit(common.get('./file.file_object'), {
            constructor: function (cfg) {
                //转换成file_object的参数
                var props = {};
                props.id = cfg.file_id;
                props.pid = cfg.pdir_key;
                props.ppid = cfg.ppdir_key;
                props.name = cfg.file_name || cfg.filename;
                props.size = cfg.file_size;
                props.cur_size = cfg.file_size;
                props.create_time = cfg.file_ctime;
                props.modify_time = cfg.file_mtime;
                props.file_md5 = cfg.file_md5;
                props.file_sha = cfg.file_sha;
                props.file_ver = cfg.file_version;
                Photo_Node.superclass.constructor.apply(this, [props]);
	            if(cfg.ext_info && (cfg.ext_info.thumb_url || cfg.ext_info.https_url)) {
		            this.set_thumb_url(cfg.ext_info.thumb_url, cfg.ext_info.https_url);
	            }
                this._checked = false;
                this.token_time = cfg.file_ttime || cfg.ext_info && cfg.ext_info.take_time;//拍摄时间
                if(typeof this.token_time === 'number') {
                  this.token_time = date_time.timestamp2date(this.token_time);
                }
                this.tdate = date_time.parse_str(this.token_time);
                this.pid = cfg.pdir_key;
                this.ppid = cfg.ppdir_key;
            }
        });
    /**
     * 返回下载地址
     * @param node
     * @param size
     * @returns {string}
     */
    Photo_Node.getDownUrl = function (node, size) {
        return '';
    };
   /* require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
        Photo_Node.getDownUrl = function (node, size) { //初始化 ui 获取image图片的方法
            if (size) {
                return downloader.get_down_url([node], {abs: size , thumb: true}, true);
            }
            return downloader.get_down_url([node], {}, true);
        };
    });*/
    $.extend(Photo_Node.prototype, {
        get_ppid: function() {
            return this.ppid;
        },
        get_pid: function(){
            return this.pid;
        },
        /**
         * 10 -> '10' ; 1 -> '01'
         * @param num
         * @returns {string}
         * @private
         */
        _ten: function (num) {
            return num < 10 ? '0' + num : num;
        },
        /**
         * 获取日期ID
         * @returns {String}
         */
        get_day_id: function () {
            if( this.day_id){
                return this.day_id;
            }
            return (this.day_id =  this.tdate.getFullYear() + '' + this._ten(this.tdate.getMonth() + 1) + '' + this._ten(this.tdate.getDate()));
        },
        /**
         * 获取拍摄时间
         * @returns {*}
         */
        get_token_time: function () {
            return this.token_time;
        },
        get_token_date: function(){
            return this.tdate;
        },
        /**
         * 节点反选
         * @returns {boolean}
         */
        toggle_check: function () {
            return this._checked = !this._checked;
        },
        set_checked: function(){
            this._checked = true;
        },
        set_unChecked: function(){
            this._checked = false;
        },
	    set_thumb_url: function(thumb_url, https_url) {
		    this._thumb_url = thumb_url;
		    this._https_url = https_url;
	    },
        /**
         * 获取缩略图地址
         * @param size
         * @returns {String}
         */
        get_thumb_url: function (size, order) {
	        if(order == 'http') {
		        return this._thumb_url || (this._thumb_url = Photo_Node.getDownUrl(this, size));
	        } else if(order == 'https') {
		        return this._https_url;
	        } else {
		        return constants.IS_HTTPS ? this._https_url : (this._thumb_url || ( this._thumb_url = Photo_Node.getDownUrl(this, size)));
	        }
        },
        /**
         * 获取预览地址
         * @param size
         * @returns {String}
         */
        get_preview_url: function (size) {
            var urls = !this._preview_url || (this._preview_url = {});
            return urls[size] || (urls[size] = Photo_Node.getDownUrl(this, size));
        },
        /**
         * 获取下载地址
         * @returns {String}
         */
        get_down_url: function () {
            return this._down_url || ( this._down_url = Photo_Node.getDownUrl(this));
        }
    });
    return Photo_Node;
});
