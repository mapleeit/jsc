/**
 * User: trumpli
 * Date: 13-11-7
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        date_time = lib.get('./date_time'),
        Time_Group = function (opt) {
            this.same_photo_map = {};
            this.array = [];
            this.length = 0;
            this.offset = 0;//已被读取的位置
            var date = date_time.parse_str(opt.token_time);
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.date = date.getDate();
            this._is_dirty = false;
            this.day_id = this.year + '' + this._ten(this.month) + '' + this._ten(this.date);
        };
    $.extend(Time_Group.prototype, {
        /**
         * 标记为需要没有完成输出
         * @param dirty
         */
        set_dirty: function(dirty){
            this._is_dirty = dirty;
        },
        /**
         * 返回是否全部输出
         * @returns {boolean}
         */
        is_dirty: function(){
            return this._is_dirty;
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
            return this.day_id;
        },
        get_year: function () {
            return this.year;
        },
        get_month: function () {
            return this.month;
        },
        get_date: function () {
            return this.date;
        },
        /**
         * 添加节点
         * @param {Photo_Node} node
         */
        add_node: function (node) {
            var file_sha = node.get_file_sha();
            if(!this.same_photo_map[file_sha]) {
                this.array.push(node);
                this.length += 1;
            }

            this.same_photo_map[file_sha] = this.same_photo_map[file_sha] || [];
            this.same_photo_map[file_sha].push(node);
        },
        /**
         * 删除节点
         * @param {HashMap<String,boolean>} id_map
         */
        remove_nodes: function (id_map) {
            var me = this,len = me.length;
            while(len){
                len-=1;
                var cur_node = me.array[len];
                if ( id_map.hasOwnProperty(cur_node.get_id()) ) {
                    var file_sha = cur_node.get_file_sha(),
                        same_nodes = me.same_photo_map[file_sha],
                        same_nodes_len = same_nodes.length;
                    //要判断相同的照片是否删除完
                    $.each(same_nodes, function(i, node) {
                        if(id_map.hasOwnProperty(node.get_id())) {
                            same_nodes_len--;
                        }
                    });
                    if(same_nodes_len <= 0) {
                        me.array.splice(len, 1);
                        me.length -= 1;
                        me.same_photo_map[file_sha] = [];
                    }
                }
            }
            /**

             for (var len = me.length - 1; len >= 0; len--) {
                if ( id_map.hasOwnProperty(me.array[len].get_id()) ) {
                    me.array.splice(len, 1);
                    me.length -= 1;
                }
            }
             */
            return me.length;
        },
        /**
         * offset代表该日期已经有图片，渲染的时候插入前面的记录即可
         */
        set_offset: function(offset) {
            this.offset = offset;
        },
        /**
         * 重置
         */
        reset: function () {
            this.offset = 0;
        },
        get_array: function () {
            return this.array;
        },
        each: function(fn){
            for(var i = 0 ,j = this.array.length;i<j;i++){
                fn.call(null,this.array[i]);
            }
        },

        get_same_nodes_by_sha: function(file_sha) {
            return this.same_photo_map[file_sha];
        },

        has_del_same_nodes: function(node) {
            var file_sha = node.get_file_sha();
            if(!this.get_same_nodes_by_sha(file_sha).length) {
                return true;
            }

            return false;
        }
    });
    return Time_Group;
});
