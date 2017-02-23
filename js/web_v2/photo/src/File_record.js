/**
 * 将file_object与Record结合起来，以便复用接口。
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        date_time = lib.get('./date_time'),
        common = require('common'),
        https_tool = common.get('./util.https_tool'),

        File = common.get('./file.file_object');

    var Photo_file = inherit(File, {
        constructor : function(cfg){
            this.pid = cfg.pdir_key;
            this.ppid = cfg.ppdir_key;
            this.take_time = cfg.take_time;
            this.thumb_url = https_tool.translate_cgi(cfg.thumb_url);//缩略图，视频类有用到
            if(cfg.ext_info && cfg.ext_info.thumb_url) {
                this.thumb_url = https_tool.translate_cgi(cfg.ext_info.thumb_url);//缩略图，视频类有用到
                this.long_time = cfg.ext_info.long_time || 0;
            }
            this._checked = false;
            this.token_time = cfg.file_ttime || cfg.ext_info && cfg.ext_info.take_time;//拍摄时间
            if(typeof this.token_time === 'number') {
                this.token_time = date_time.timestamp2date(this.token_time);
            }
            this.tdate = date_time.parse_str(this.token_time);
            //转换成file_object的参数
            var props = {};
            props.pid = cfg.pdir_key;
            props.ppid = cfg.ppdir_key;
            props.name = cfg.file_name || cfg.filename;
            props.size = cfg.file_size;
            props.cur_size = cfg.file_size;//库列表拉出来的文件不会有破损文件
            props.id = cfg.file_id;
            props.create_time = cfg.file_ctime;
            props.modify_time = cfg.file_mtime;
            props.file_md5 = cfg.file_md5;
            props.file_sha = cfg.file_sha;
            props.file_ver = cfg.file_version;
            Photo_file.superclass.constructor.apply(this, [props]);
        },
        get_pid: function(){
            return this.pid;
        },

        get_ppid: function() {
            return this.ppid;
        },

        get_thumb_url: function() {
            return this.thumb_url;
        },

        // 获取拍摄时间
        get_take_time : function(){
            return this.take_time;
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

    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Photo_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Photo_file.prototype, fn_name, fn,
        create_delegate = function(fn_name, fn){
            var is_setter = /^set_/.test(fn_name);
            var property_name = fn_name.slice(fn_name.indexOf('_'));
            return is_setter ? function(){
                    var olds = {};
                    var ret;
                    olds[property_name] = this['get_'+property_name];
                    ret = fn.apply(this.data, arguments);
                    this.notify_update(olds);
                    return ret;
                } : function(){
                    return fn.apply(this.data, arguments);
                };
        };
    for(fn_name in file_prototype){
        if(/*file_prototype.hasOwnProperty(fn_name) && */!file_record_prototype.hasOwnProperty(fn_name)){
            fn = file_prototype[fn_name];
            file_record_prototype[fn_name] = typeof fn === 'function' ? create_delegate(fn_name, fn) : fn;
        }
    }
    return File_record;
});