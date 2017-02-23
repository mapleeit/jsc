/**
 * 图片分组数据
 * @author xixinhuang
 * @date 16-08-10
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        Group_record = lib.get('./data.Record');

    var group_map = {};

    var Store = {

        init_data: function (data) {
            var groups = [],
                group,
                pic_group;
            pic_group = data.groups;
            $.each(pic_group, function(index, item){
                group = new Group_record({
                    id : item.group_id,
                    name : item.group_name,
                    create_time : item.group_ctime,
                    modify_time : item.group_mtime,
                    size : item.total_count,
                    cover : [item.file_item],
                    readonly : item.group_id === 1
                }, item.group_id);
                groups.push(group);
                group_map[item.group_id] = group;
            });
            this.data = groups;
        },
        init_group: function (data) {
            this.init_data(data);
        },
        add_group: function(groups) {
            var me = this;
            $.each(groups, function(index, group){
                if(group.id) {
                    me.data.push(group);
                    group_map[group.id] = group;
                }
            });
        },
        get_groups: function() {
            return this.data;
        },
        get_group: function(id) {
            return group_map[id];
        },
        update_group: function(group) {
            group_map[group.get('id')].set('name', group.get('name'));
            $.each(this.get_groups(), function(index, item){
                if(item.get('id') === group.get('id')) {
                    item.set('name', group.get('name'));
                }
            });
        },
        remove: function(record) {
            if(record) {
                if(group_map[record.group_id]) {
                    delete group_map[record.group_id];
                }
                this.remove_group(record);
            }
        },
        destroy: function () {
            this.data = null;
        },
        remove_group : function(record, index){
            var index = index || $.inArray(record, this.data);
            if(index>=0){
                this.data.splice(index, 1);
            }
        },
        set_cur_group : function(group){
            this.cur_group = group;
        },
        get_cur_group : function(){
            return this.cur_group;
        }
    };

    return Store;
});