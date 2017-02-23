/**
 * cgi data to file object model
 * Created by maplemiao on 2016/9/22.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var File = common.get('./file.file_object');
        
    var cgi2file = function (cgiInfo) {
        var is_dir = !!cgiInfo['dir_attr'];

        return new File({
            is_dir: is_dir,
            id: cgiInfo[ is_dir ? 'dir_key' : 'file_id' ],
            pid: cgiInfo['pdir_key'],
            name: cgiInfo[ is_dir ? 'dir_name' : 'filename' ],
            create_time: cgiInfo[ is_dir ? 'dir_ctime' : 'file_ctime' ],
            modify_time: is_dir ? cgiInfo[ 'dir_mtime' ] : cgiInfo[ 'file_mtime' ],

            size: is_dir ? 0 : parseInt(cgiInfo[ 'file_size' ]) || 0,
            cur_size: is_dir ? 0 : parseInt(cgiInfo[ 'file_cur_size' ]) || 0,
            file_ver: is_dir ? '' : cgiInfo[ 'file_ver' ] || '',
            file_md5: is_dir ? '' : cgiInfo[ 'file_md5' ] || '',
            file_sha: is_dir ? '' : cgiInfo[ 'file_sha' ] || '',

            ext_info: cgiInfo.ext_info || {}
        })
    };
    return cgi2file;
});