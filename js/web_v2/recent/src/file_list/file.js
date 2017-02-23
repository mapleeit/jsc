/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        File_Node = common.get('./file.file_object'),

        collections = lib.get('./collections'),
        date_time = lib.get('./date_time'),
        max_length = 100; //最大容量

    return {
        T: [],//today
        Y: [],//yesterday
        S: [],//last7day
        L: [],//longtimeago
        ALL: [],
        is_full: false,
        get_length: function(){
            return this.ALL.length;
        },
        clear: function () {
            this.T = [];
            this.Y = [];
            this.S = [];
            this.L = [];
            this.ALL = [];
            this.is_full = false;
        },
        grep_data: function (list, cover) {
            var me = this,
                today = date_time.today().getTime(),
                yesterday = date_time.yesterday().getTime(),
                last7day = date_time.add_days(-7).getTime();

            //覆盖
            if (cover) {
                me.clear();
            }

            $.each(list, function (i, unit) {
                if (unit) {//unit可能为空
                    //适配 返回数据与前端数据结构
                    var file = new File_Node({
                            "name": unit.filename,
                            "create_time": unit.file_ctime,
                            "modify_time": unit.file_mtime,
                            "cur_size": unit.file_size,
                            "pid": unit.pdir_key,
                            "id": unit.file_id,
                            "size": unit.file_size,
		                    "ext_info": unit.ext_info
                        }),
                        date = new Date(unit.file_mtime),
                        time = unit.file_mtime;
                    //按日期分类
                    if (time >= today) {
                        file._html_time = me._get_html_time(date,'T');
                        me.T.push(file);
                    } else if (time >= yesterday) {
                        file._html_time = me._get_html_time(date,'Y');
                        me.Y.push(file);
                    } else if (time >= last7day) { //增加最近7天的数据
                        file._html_time = me._get_html_time(date);
                        me.S.push(file);
                    } else {
                        file._html_time = me._get_html_time(date);
                        me.L.push(file);
                    }
                    me.ALL.push(file);
                }
            });

            //按时间排序
            me.T.sort(me._sort_fn);
            me.Y.sort(me._sort_fn);
            me.S.sort(me._sort_fn);
            me.L.sort(me._sort_fn);
        },
        /**
         * 返回页面显示时间
         * @param {Date} date
         * @param {String} [type]
         * @returns {string}
         */
        _get_html_time: function(date , type){
            var me = this;
            if(type==='T'){
                return '今天 ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            } else if( type === 'Y'){
                return '昨天 ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            } else {
                return date.getFullYear() + '-' + ( date.getMonth() + 1) + '-' + date.getDate() + ' ' + me.fixNum(date.getHours()) + ':' + me.fixNum(date.getMinutes());
            }
        },
        fixNum: function (num) {
            var n = num - 0;
            if ((n + '').length == 1) {
                return '0' + n;
            }
            return n;
        },
        _sort_fn: function (f1, f2) {
            var f1_time = date_time.parse_str(f1.get_modify_time()).getTime(),
                f2_time = date_time.parse_str(f2.get_modify_time()).getTime();
            return f1_time -f2_time > 0 ? -1 : (f1_time - f2_time === 0 ? 0 : 1);
        },
        get_file_by_id: function (id) {
            var ret;
            if (this.ALL.length) {
                $.each(this.ALL, function (i, file) {
                    if (file.get_id() === id) {
                        ret = file;
                        return false;
                    }
                });
            }
            return ret;
        }
    };
});