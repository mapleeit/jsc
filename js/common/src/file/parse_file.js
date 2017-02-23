/**
 * 读取文件属性并生成文件对象
 * @author jameszuo
 * @date 13-1-15
 */

define(function (require, exports, module) {

    var lib = require('lib'),
        collections = lib.get('./collections'),

        File = require('./file.file_object'),

        empty = [],
        parse_int = parseInt,

        undefined;


    return {
        parse_file_attr: function (obj) {
            var
            // 公共属性
                is_dir = !!obj['dir_attr'],
                attr = obj[ is_dir ? 'dir_attr' : 'file_attr' ],
                id = obj[ is_dir ? 'dir_key' : 'file_id' ],
                name = attr[ is_dir ? 'dir_name' : 'file_name' ],
                create_time = obj[ is_dir ? 'dir_ctime' : 'file_ctime' ],
                modify_time = is_dir ? obj[ 'dir_mtime' ] : attr[ 'file_mtime' ],

            // 文件属性
                size = is_dir ? 0 : parse_int(obj[ 'file_size' ]) || 0,
                cur_size = is_dir ? 0 : parse_int(obj[ 'file_cur_size' ]) || 0,
                file_ver = is_dir ? '' : obj[ 'file_ver' ] || '',
                file_md5 = is_dir ? '' : obj[ 'file_md5' ] || '',
                file_sha = is_dir ? '' : obj[ 'file_sha' ] || '';

            return {
                is_dir: is_dir,
                id: id,
                name: name,
                create_time: create_time,
                modify_time: modify_time,

                size: size,
                cur_size: cur_size,
                file_ver: file_ver,
                file_md5: file_md5,
                file_sha: file_sha
            };
        },
        parse_file: function (obj) {
            return obj && new File(this.parse_file_attr(obj));
        },
        parse_files: function (objs) {
            var me = this;
            if (objs && objs.length) {
                return collections.map(objs, function (obj) {
                    return new File(me.parse_file_attr(obj));
                });
            } else {
                return empty;
            }
        }
    }
});
