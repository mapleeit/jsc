/**
 * 文件列表集合，模拟Ext.data.Store，但仅实现最简的功能，够用就好。
 * @author cluezhang
 * @date 2013-8-12
 */
define(function(require, exports, module){
    var $ = require('$'),
        inherit = require('./inherit'),
        Event = require('./Event');
    /*
     * 事件列表
     * datachanged 全盘更新
     * add [批量]添加, record[], index
     * clear 全盘清空 
     * remove [批量]删除 record[], index
     * update 单个更新 TODO 可考虑再扩展FileNode，让它支持注册到某一store
     */
     var Store = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
            cfg = cfg || {};
            this.data = [];
            this.map = {};
            if(cfg.data){
                this.load(cfg.data);
            }
        },
        /**
         * @param {Record[]} 装载Record
         * @param {Number} totalLength (optional) 总数量，适用于分批加载的情况
         */
        load : function(records, total_length){
            //this.data = records;
            this.clear(true);
            this.add(records, 0, true);
            this.loaded = true;
            total_length = Math.max(total_length || 0, records.length);
            this.total_length = total_length;
            this.trigger('datachanged', this);
        },
        /**
         * 获取指定的记录
         * @param {Number/String} index 可以为序号或ID
         */
        get : function(index){
            switch(typeof index){
                case 'number':
                    return this.data[index];
                case 'string':
                    return this.map[index];
            }
        },
        /**
         * 获取给定记录在store中的位置
         * @param {Record} record
         * @return {Number} index
         */
        indexOf : function(record){
            return $.inArray(record, this.data);
        },
        /**
         * @private
         */
        update : function(record, olds){
//            var index = this.indexOf(record);
//            if(index>=0){
            if(this.map.hasOwnProperty(record.id)){
                this.trigger('update', this, record, olds);
            }
        },
        /**
         * 添加记录到指定位置
         * @param {Record[]} records
         * @param {Number} index (optional) 要插入的位置，如果没有则放到最后
         * @param {Boolean} prevent_events (optional) 是否静默修改，默认为false
         */
        add : function(records, index, prevent_events){
            index = typeof index === 'number' ? index : this.size();
            var data = this.data, map = this.map, i, record;
            records = [].concat(records);
            // 插入到数组中
            data.splice.apply(data, [index, 0].concat(records));
            // 添加到hash map中，并注册
            for(i=0; i<records.length; i++){
                record = records[i];
                map[record.id] = record;
                record.store = this;
            }
            if(prevent_events !== true){
                this.trigger('add', this, records, index);
            }
        },
        /**
         * 从store中删除记录
         * @param {Record} record
         * @param {Boolean} prevent_events (optional) 是否静默修改，默认为false
         */
        remove : function(record, prevent_events, index){
            var index = index || this.indexOf(record);
            if(index>=0){
                this.data.splice(index, 1);
                delete this.map[record.id];
                record.store = null;
                if(prevent_events !== true){
                    this.trigger('remove', this, [record], index);
                }
            }
        },
        /**
         * 从store中删除记录，不同的是为批量作优化
         * @param {Record[]} records
         * @param {Boolean} prevent_events (optional) 是否静默修改，默认为false
         */
        batch_remove : function(records, prevent_events){
            var indexes = [], map = {};
            // 记录id
            $.each(records, function(index, record){
                map[record.id] = index;
            });
            // 一次定位出它们所有的位置
            this.each(function(record, index){
                var id = record.id;
                if(map.hasOwnProperty(id)){
                    indexes[id] = index;
                }
            });
            // 逐个删除，从后往前删
            records = records.slice(0);
            records.sort(function(rec1, rec2){
                return indexes[rec2.id] - indexes[rec1.id];
            });
            var me = this;
            $.each(records, function(index, record){
                me.remove(record, prevent_events, indexes[record.id]);
            });
        },
        /**
         * 清空store
         * @param {Boolean} prevent_events (optional) 是否静默修改，默认为false
         */
        clear : function(prevent_events){
            // 清空数组、map，去掉record中的关联
            var i, records = this.data;
            this.data = [];
            this.map = {};
            for(i=0; i<records.length; i++){
                records[i].store = null;
            }
            if(prevent_events !== true){
                this.trigger('clear', this);
            }
        },
        /**
         * 获取store大小
         * @return {Number} 返回当前store中的记录数
         */
        size : function(){
            return this.data.length;
        },
        /**
         * 获取store的总大小，即所有页的数量，包括未加载的那些
         * @return {Number} total_length 所有记录的数量
         */
        get_total_length : function(){
            return this.total_length;
        },
        /**
         * 是否所有记录都加载完了，适用于store分页加载的情况
         * @return {Boolean} complete
         */
        is_complete : function(){
            return this.data.length >= this.total_length;
        },
        /**
         * 获取一段范围内的记录，同Array.prototype.slice
         */
        slice : function(){
            return this.data.slice.apply(this.data, arguments);
        },
        /**
         * 遍历
         * @param {Function} fn 遍历walker，返回false时中止遍历
         * @param {Object} scope (optional) 执行作用域
         */
        each : function(fn, scope){
            var i, records = this.data;
            for(i=0; i<records.length; i++){
                if(fn.call(scope, records[i], i) === false){
                    break;
                }
            }
        }
     });
     return Store;
});