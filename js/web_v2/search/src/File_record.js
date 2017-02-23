/**
 * 将file_object与Record结合起来，以便复用接口。
 * @author cluezhang
 * @date 2013-8-14
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        
        common = require('common'),
        File = common.get('./file.file_object');
    var Search_file = inherit(File, {
        constructor : function(cfg){
            this.ppid = '';
            this.in_album = cfg.in_album;
            Search_file.superclass.constructor.apply(this, arguments);
        },
        get_ppid : function(){
            return this.ppid;
        },
        // 是否是相册的文件
        is_in_album : function(){
            return this.in_album;
        }
    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Search_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Search_file.prototype, fn_name, fn,
        create_delegate = function(fn_name, fn){
            var is_setter = /^set_/.test(fn_name);
            return is_setter ? function(){
                    var ret = fn.apply(this.data, arguments);
                    this.notify_update(null);
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