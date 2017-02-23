/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        store,
        get_store = function () {
            return store || (store = require('./file_list.offline.Store'));
        },
        selected_class = 'ui-selected',//选中样式
        selected_cache = {},
        selected_length = 0;

    return {
        /**
         * 获取页面元素
         * @param file_id
         * @returns {*|jQuery}
         * @private
         */
        g_$item_by_db_id: $.noop,
        /**
         * @param fn file_id获取$dom的处理函数
         */
        init: function (fn) {
            this.g_$item_by_db_id = fn;
            selected_cache = {};
        },
        /**
         * 选中元素
         * @param file_id
         * @param {boolean} [no_ui]
         */
        select: function (file_id , no_ui) {

            if (!file_id) {
                return;
            }

            if(!no_ui){
                var $item = this.g_$item_by_db_id(file_id); //界面元素选中
                if ($item) {
                    $item.addClass(selected_class);
                }
            }

            var file = get_store().get_file_by_id(file_id);//节点对象选中
            if (file) {
                file.get_ui().set_selected(true);
            }

            if (!selected_cache[file_id]) { //缓存选中
                selected_cache[file_id] = file_id;
                selected_length+=1;
            }

        },
        /**
         * 反选元素
         * @param file_id
         * @param {boolean} [no_ui]
         */
        un_select: function (file_id,no_ui) {

            if (!file_id) {
                return;
            }
            if(!no_ui){
                var $item = this.g_$item_by_db_id(file_id);//界面元素反选
                if ($item) {
                    $item.removeClass(selected_class);
                }
            }

            var file = get_store().get_file_by_id(file_id);//节点对象反选
            if (file) {
                file.get_ui().set_selected(false);
            }

            if (selected_cache[file_id]) {//缓存反选
                delete selected_cache[file_id];
                selected_length-=1;
            }
        },
        /**
         * 反选其他，但选中自己
         * @param file_id
         */
        unselected_but: function (file_id) {
            for (var key in selected_cache) {
                this.un_select( key );//清除选中
            }
            this.select( file_id );
        },
        /**
         * 是否被选中
         * @param file_id
         * @returns {boolean}
         */
        is_selected: function (file_id) {
            return !!selected_cache[file_id];
        },
        /**
         * 全部清除
         */
        remove_all: function(){
            selected_cache = {};
            selected_length = 0;
        },
        /**
         * 删除的节点 更新缓存
         * @param remove_id_map
         */
        remove: function(remove_id_map){
           for(var key in remove_id_map){
               if (selected_cache[key]) {//缓存反选
                   delete selected_cache[key];
                   selected_length-=1;
               }
           }
        },
        /**
         * 获取选中的节点
         * @return {Array<File_Node>}
         */
        get_selected_files: function () {
            var ret = [];
            for (var key in selected_cache) {
                var node = get_store().get_file_by_id(key);
                if (node) {
                    ret.push(node);
                }
            }
            return ret;
        },
        get_selected_length: function(){
           return selected_length;
        }
    };
});
