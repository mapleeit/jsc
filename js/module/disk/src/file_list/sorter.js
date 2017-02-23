/**
 * 文件列表排序
 * @author jameszuo
 * @date 13-10-31
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        Sorter = lib.get('./sorter');

    return new Sorter({
        // el: $column_model_to,
        cols: [
            { field: 'name', /* klass: 'filename', title: '名称', */val_get: function (it) {
                return it.get_name().toLowerCase();
            } },
            { field: 'modify_time', /*klass: 'datetime', title: '更新时间', */val_get: function (it) {
                return it.get_modify_time();
            } },
            { field: 'size', /*klass: 'size', title: '大小', */val_get: function (it) {
                return it.get_size();
            } }
        ],
        default_field: 'modify_time',
        default_order: 'desc',
//                visible: false,
//                klass: '',
        get_datas: function (field) {
            var node = file_list.get_cur_node();
            // 对两个集合进行排序
            if (node) {
                var dirs_data = node.get_kid_dirs(),
                    files_data = node.get_kid_files();

                // 目录不参与「大小」的排序
                if (field === 'size') {
                    dirs_data = [];
                }

                return [dirs_data, files_data];
            }
            return [];
        },
        // 有些特殊节点的排序也要特殊处理，例如微信节点就要永远在前。
        before_comparator: function (node1, node2) {
            // sortable为false的节点优先级最高，永远在最前，同时它们之间也固定顺序。其它节点照常
            var fixed1 = !node1.is_sortable(),
                fixed2 = !node2.is_sortable();
            if (fixed1) {
                if (fixed2) {
                    return false; // 同为固定节点，顺序不变，同时中止后续ColumnModel比较
                }
                return -1; // 固定节点优先于普通节点，node1 在 node2 之前
            } else {
                if (fixed2) {
                    return 1; // 固定节点优先于普通节点，node1 在 node2 之后
                }
                return 0; // 同为非固定节点，交给后续ColumnModel比较方法
            }
        }
    });
});