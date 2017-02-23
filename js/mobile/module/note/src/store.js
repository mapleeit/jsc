/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        Record = require('./Record'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),

        note_map = {},
        undefined;

    var store = new Module('note.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }

            if(data) {
                this.records = this.format2nodes(data.notelist);
                this.trigger('refresh_done',  this.records, store);
            }

            this._finish_flag = data.notelist.length < 20? true : false;
            this._total_count = this._finish_flag? data.notelist.length : 20;
            this._inited = true;
        },

        refresh: function() {
            this._load_done = false;
            this.load_more(true);
        },

        share_restore: function() {
            this.trigger('restore');
        },

        load_more: function(is_refresh) {
            if(this._requesting || this._finish_flag || !is_refresh && this.is_load_done()) {
                return;
            }
            this._requesting = true;

            var offset = this._total_count,
                me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/weiyun_note.fcg'),
                cmd: 'NotePageListGet',
                body: {
                    count: 20,
                    offset: offset,
                    order_type: 0
                }
            }).ok(function(msg, body) {
                var add_items = me.format2nodes(body.items);
                me._finish_flag = body.finish_flag;
                me._total_count += me._finish_flag? body.total_count : 20;
                me.concat_records(add_items);
                me.trigger('load_done',  add_items, store);
            }).fail(function(msg, ret) {
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        concat_records: function(recordList) {
            var me = this;
            $.each(recordList, function (i, items) {
                var offset_day = me.records[me.records.length - 1][0].get_offset_day(),
                    new_offset_day = items[0].get_offset_day();
                if(offset_day === new_offset_day){
                    me.records[me.records.length - 1].concat(items)
                } else {
                    me.records.push(items);
                }
            });
        },

        format2nodes: function(items) {

            if (!$.isArray(items)) {
                console.log('Loader.js->generateRecords: cgi返回的数据格式不对');
                return;
            }
            var zero_time = this.get_zero_time(),
                recordList = [],
                tmp = -1,
                me = this,
                records = [];
            $.each(items, function (i, item) {
                var record = new Record(item),
                    offset_day = me.get_date(zero_time, item['note_basic_info'].note_mtime);
                record.set_offset_day(me.get_group_time(offset_day));
                note_map[record.get_id()] = record;

                if(tmp < 0) {
                    tmp = offset_day;
                    records.push(record);
                } else if(me.get_group_time(tmp) === me.get_group_time(offset_day)) {
                    records.push(record);
                } else {
                    recordList.push(records);
                    records = [];
                    records.push(record);
                    tmp = offset_day;
                }
            });
            recordList.push(records);

            return recordList;
        },

        get_group_time: function(offset_day) {
            if(offset_day >= 7) {
                return 3;
            } else if(offset_day < 7 && offset_day > 1) {
                return 2;
            } else if(offset_day === 1) {
                return 1;
            }
            return 0;
        },

        get_date: function(zero_time, time) {
            if(zero_time <= time) return 0;
            return Math.floor((zero_time - time) / (1000 * 60 * 60 * 24)) + 1;
        },

        get_zero_time: function() {
            var now_time = new Date().getTime(),
                per_hour_time = 1000 * 60 * 60,
                offset_day = Math.floor(now_time / (per_hour_time *24));
            return offset_day * per_hour_time * 24 - per_hour_time * 8;
        },

        get_all_records: function() {
            return this.records;
        },

        get_file: function(file_id) {
            return note_map[file_id];
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_finish_flag: function() {
            return !!this._finish_flag;
        },

        is_requesting: function() {
            return !!this._requesting;
        }
    });

    return store;
});