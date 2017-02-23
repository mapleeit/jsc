define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        events = lib.get('./events'),
        Record = require('./Record'),
        request = common.get('./request'),

        note_map = {},
        undefined;

    var store = new Module('signin.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }

            var qzGoods = data.goodsList && data.goodsList['data'];
            if(qzGoods && qzGoods.rule) {
                this.goods = this.format2nodes(qzGoods.rule);
            }

            this.wyGoods = data.wyGoodsList || [];
            this.wyInfo = data.data || {};
            this.addr = data.addr? data : [];

            var _data = {
                info: this.wyInfo,
                goods: this.goods,
                wyGoods: this.wyGoods
            }
            this.trigger('load_done', _data , store);
            this._inited = true;
        },

        format2nodes: function(items) {

            var recordList = [];
            for(var key in items) {
                var item = items[key],
                    record = new Record(item, key);
                note_map[record.get_id()] = record;
                recordList.push(record);
            }

            return recordList;
        },

        update_info: function(info) {
            this.wyInfo = info;
            this.trigger('refresh', this.wyInfo, store);
        },

        get_all_records: function() {
            return this.records;
        },

        get_good_by_id: function(id) {
            return note_map[id];
        },

        get_all_goods: function() {
            return this.goods;
        },

        get_wy_goods: function () {
            return this.wyGoods.goods_list[0];
        },

        get_info: function() {
            return this.wyInfo;
        },

        get_addr: function() {
            return this.addr;
        },

        set_addr: function(addr) {
            this.addr = addr;
        },

        has_signed_in: function() {
            return !!this.wyInfo['has_signed_in'];
        },

        get_sign_in_count: function() {
            return this.wyInfo['sign_in_count'];
        },

        get_point_rank: function() {
            return this.wyInfo['point_rank'];
        },

        get_add_point: function() {
            var app_point = this.wyInfo['has_signed_in']? this.wyInfo['add_point'] : 0;
            return app_point;
        },

        get_total_point: function() {
            return this.wyGoods['total_point'];
        },

        set_total_point: function(total_point) {
            this.wyGoods['total_point'] = total_point;
            this.wyInfo['total_point'] = total_point;
            this.trigger('update', this.wyInfo, store);
        },

        get_id: function() {
            return this.wyGoods.goods_list[0]['id'];
        },

        get_thumbnail: function() {
            return this.wyGoods.goods_list[0]['thumbnail'];
        },

        get_name: function() {
            return this.wyGoods.goods_list[0]['name'];
        },

        get_price: function() {
            return this.wyGoods.goods_list[0]['price'];
        },

        get_cost_point: function() {
            return this.wyGoods.goods_list[0]['cost_point'];
        },

        get_detail_desc: function() {
            return this.wyGoods.goods_list[0]['detail_desc'];
        },

        get_detail_url: function() {
            return this.wyGoods.goods_list[0]['detail_url'];
        },

        is_requesting: function() {
            return !!this._requesting;
        },

        is_inited: function() {
            return !!this._inited;
        }
    });

    $.extend(store, events);

    return store;
});