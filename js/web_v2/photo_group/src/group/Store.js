/**
 * 图片更改分组模块
 * @author xixinhuang
 * @date 2016-08-31
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        Group_record = lib.get('./data.Record'),

        common = require('common'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        Loader = require('./Loader');

    var coverStore = inherit(Store, {
        old_group: null,
        new_group: null,
        photo_records : [],
        constructor : function(){
            coverStore.superclass.constructor.apply(this, arguments);
        },
        load_groups: function() {
            //if(this.groups) {
            //    this.load(this.groups, null);
            //} else {
                this.reload();
            //}
        },
        set_group: function(group) {
            this.new_group = group;
        },
        get_data: function() {
            return {
                photos: this.get_records(),
                old_group_id: this.old_group? this.old_group.get('id') : '',
                new_group_id: this.new_group? this.new_group.get('id') : ''
            }
        },
        get_records : function(){
            return this.photo_records;
        },
        init_data: function (data) {
            var groups = [],
                group;
            $.each(data.groups, function(index, item){
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
            });
            return groups;
        },
        reload : function(){
            var me = this;
            if(me.loading){
                return me.loading;
            }
            widgets.loading.show();
            // 首屏加载2.5倍屏幕
            me.loading = this.loader.load_groups().done(function(data){
                me.load(me.init_data(data));
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        }
    });
    return coverStore;
});