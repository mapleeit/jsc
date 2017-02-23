/**
 * 图片日期分组数据
 * @author xixinhuang
 * @date 16-09-28
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Module = common.get('./module'),
        time_global_event = common.get('./global.global_event').namespace('photo_time'),
        Time_Group = require('./time.Group');

    var group_map = {};

    var Store = new Module('recycle_header', {

        init_data: function (data) {
            var me = this,
                day_id,
                group,
                groups = this.sort_group(data);

            $.each(groups, function(index, item){
                day_id = item.get_day_id();
                if(!group_map[day_id]) {
                    group_map[day_id] = item;
                } else {
                    group = group_map[day_id];
                    item.set_offset(group.offset<0? 100 : group.length);
                    group_map[day_id] = me.concat_group(group, item);
                }
            });
            return groups;
        },
        /**
         * 合并两个日期分组
         * @param old_group
         * @param group
         */
        concat_group: function(old_group, group) {
            var items = group.get_array();
            $.each(items, function(index, item){
                old_group.add_node(item);
            });
            return old_group;
        },

        batch_remove: function(records) {
            if(!records || records.length === 0) {
                return;
            }
            var day_id,
                me = this;

            $.each(records, function(index, record) {
                day_id = record.get_day_id();
                if(!!group_map[day_id]) {
                    me.remove(record);
                    time_global_event.trigger('delete_item', record);
                }
            });
        },
        remove: function(record) {
            var file_id = record.get_id(),
                day_id = record.get_day_id();
            var data = {};
            data[file_id] = 1;
            group_map[day_id].remove_nodes(data);

            if(!group_map[day_id].length) {
                time_global_event.trigger('delete_group', group_map[day_id]);
                delete group_map[day_id];
            }
        },
        get_group: function(day_id) {
            return group_map[day_id];
        },
        get_groups: function() {
            return group_map;
        },
        update_group: function(group) {

        },
        destroy: function () {
            group_map = {};
        },
        remove_group : function(day_id){
            delete group_map[day_id];
        },
        /**
         * 返回排序分组后的数据
         * @param data
         * @return [Array<Time_Group>]
         */
        sort_group: function (data) {
            if (!data || !data.length)
                return [];
            //按天分组
            var group = {};
            for (var i = 0, j = data.length; i < j; i++) {
                var node = data[i],
                    day_id = node.get_day_id();
                if (!group[day_id]) {
                    group[day_id] =
                        new Time_Group({
                            'token_time': node.get_token_time()
                        });
                }
                group[day_id].add_node(node);//嫁接
            }
            //按拍摄时间排序
            var sort_array = [];
            for (var key in group) {
                sort_array.push(group[key]);
            }
            sort_array.sort(function (g1, g2) {
                return g2.get_day_id() - g1.get_day_id();
            });
            return sort_array;
        }
    });

    return Store;
});