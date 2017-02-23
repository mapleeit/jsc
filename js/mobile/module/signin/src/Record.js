/**
 * 仿ExtJs中的Ext.data.Record，以便数据与视图的分离
 * @author xixinhuang
 * @date 16-03-29
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        events = lib.get('./events'),

        undefined;

    var id_seed = 0;
    var Record = function(data, id){
        this.data = data || {};
        // 生成唯一ID
        this.id = id || 'wy-record-'+(++id_seed);
    };
    Record.prototype = {
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * Record.set('a', 1);
         * Record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.data,
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.data;
            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 获取属性值
         * @param {String} name
         * @return {Mixed} value
         */
        get : function(name){
            return this.data[name];
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){
            if (this.store && typeof this.store.update === "function") {
                this.store.update(this, olds);
            }
        },

        get_id: function () {
            return this.id;
        },

        get_name: function() {
            return this.get('name');
        },

        get_start_time: function() {
            return this.get('starttm');
        },

        get_end_time: function() {
            return this.get('endtm');
        },

        get_budget: function () {
            return this.get('budget').budget;
        },

        get_left: function() {
            return this.get('budget').left;
        },

        get_used: function() {
            return this.get('budget').used;
        },

        get_type: function() {
            return this.get('type');
        },

        get_prizeid: function() {
            return this.get('prizeid');
        },

        get_refer: function() {
            return this.get('refer');
        },

        get_score: function() {
            return this.get('score');
        }
    };

    $.extend(Record.prototype, events);

    return Record;
});