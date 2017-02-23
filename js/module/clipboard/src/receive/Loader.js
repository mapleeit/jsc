/**
 * 剪贴板模块 接收tab 列表数据加载器
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),
        Record = lib.get('./data.Record'),

        widgets = common.get('./ui.widgets'),
        clipboard_plugin = require('main').get('./clipboard_plugin'),

        max_clipboard_record_count = 5, //最多显示5条消息
        undefined;

    var Loader = inherit(Event, {

        auto_load: false,

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.store && this.auto_load) {
                this.start_load();
            }
        },

        /**
         * 开始加载剪贴板消息数据
         */
        start_load: function() {
            var me = this;

            if(clipboard_plugin.is_first_load_done()) {
                me.fill_store(clipboard_plugin.get_records());
            } else {
                widgets.loading.show();
                this.listenToOnce(clipboard_plugin, 'clipboard_load_done', function(records) {
                    widgets.loading.hide();
                    me.fill_store(records);
                });
            }

            this.listenTo(clipboard_plugin, 'clipboard_update', function(new_records) {
                this.insert_records(new_records);
            });

            this.listenTo(clipboard_plugin, 'clipboard_all_read', function() {
                this.set_records_read();
            });
        },

        /**
         * 插入新拉取的数据到store
         * @param items
         */
        insert_records: function(items) {
            var rs = [],
                me = this;

            $.each(items, function(i, item) {
                rs.push(me.create_record(item));
            });

            this.store.add(rs, 0); //插入到最前
            var size = this.store.size(),
                rm_records;
            if(size > max_clipboard_record_count) { //保持最多5条记录
                rm_records = this.store.slice(max_clipboard_record_count);
                this.store.batch_remove(rm_records);
            }

        },

        /**
         * 装载数据到store
         * @param items
         */
        fill_store: function(items) {
            var rs = [],
                me = this;

            $.each(items, function(i, item) {
                rs.push(me.create_record(item));
            });

            this.store.load(rs);
        },

        /**
         * 由原始数据组装成Record
         * @param {Array} item
         * @returns {Record}
         */
        create_record: function(item) {
            var rd = new Record({
                dev_id:     item.dev_id,
                msg_info:   item.msg_info,
                ctime:      item.ctime,
                content:    item['items'][0].content,
                unread:     item.unread     //该字段非cgi返回，是本地用于标识未读的
            });

            return rd;
        },

        set_records_read: function() {
            this.store.each(function(rd) {
                rd.set('unread', false, true);
            });
        }
    });

    return Loader;
});