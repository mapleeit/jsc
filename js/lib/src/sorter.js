/**
 * 排序工具
 * @author cluezhang;jameszuo
 * @date 13-3-6
 */
define(function (require, exports, module) {
    var $ = require('$'),
        collections = require('./collections'),
        console = require('./console'),
        events = require('./events'),

        default_column_model_options = {
            cols: [/*  { field: 'name', val_get: function (v) { return v.name; } }, ...  */],
            default_field: null,
            default_order: 'desc',
            get_datas: $.noop // 要排序的数据集
        },

        undefined;
    // 引入现成的JS版NatSort算法
    // 仿windows的排序方法
    var strCmpLogical = (function(){
        var match = {}, digits = ['+', '-', 0,1,2,3,4,5,6,7,8,9], digitMap = {}, digitRe = /^([+-]|[0-9]+)/;
        $.each(digits, function(index, value){
            digitMap[value] = match;
        });
        return function(str1, str2){
            var i1=0, i2=0, c1, c2, int1, int2, len1, len2;
            if(str1 && str2){
                while(i1<str1.length){
                    c1 = str1.charAt(i1);
                    if(i2>=str2.length){ // 字串长的更大
                        return 1;
                    }
                    c2 = str2.charAt(i2);
                    if(digitMap[c1] === match){
                        if(digitMap[c2] !== match){ // 数字小于字符
                            return -1;
                        }
                        // 取出数字段
                        int1 = str1.substr(i1).match(digitRe)[1];
                        int2 = str2.substr(i2).match(digitRe)[1];
                        // 记录数字段的长度
                        len1 = int1.length;
                        len2 = int2.length;
                        int1 = parseInt(int1, 10);
                        int2 = parseInt(int2, 10);
                        if(c1 === '+'){
                            int1 = -2;
                        }else if(c1 === '-'){
                            int1 = -1;
                        }
                        if(c2 === '+'){
                            int2 = -2;
                        }else if(c2 === '-'){
                            int2 = -1;
                        }
                        
                        if(int1 > int2){
                            return 1;
                        }else if(int1 < int2){
                            return -1;
                        }else{
                            // 当数字转为10进制相等时，判断长度。例如 "000" 就要比 "00" 要前，即要小 （windows规则）
                            if(len1 > len2){
                                return -1;
                            }else if(len1 < len2){
                                return 1;
                            }
                        }
                        // 如果相等，到下一段
                        i1 += len1;
                        i2 += len2;
                    }else if(digitMap[c2] === match){ // 数字小于字符
                        return 1;
                    }else{ // 如果都不是数字，则按字符比较
                        c1 = c1.toLowerCase();
                        c2 = c2.toLowerCase();
                        if(c1.localeCompare(c2) !== 0) {
                            return c1.localeCompare(c2);
                        }
                
                        i1++;
                        i2++;
                    }
                }
            }
            return 0;
        };
    })();

    /**
     * @cfg {Function} before_comparator (optional) 前置比较方法，参数为o1、o2。
     * 当返回0时表示相等，ColumnModel会继续执行自己的比较方法；
     * 当返回-1时表示o1在o2之前；
     * 当返回1时表示o2在o1之前；
     * 当返回false时表示相等，并且中止后续ColumnModel的内置比较方法及{@link #after_comparator}后续比较方法
     *
     * 应用场景：例如sortable为false的file_node优先于普通节点
     */
    /**
     * @cfg {Function} after_comparator (optional) 参数同{@link #before_comparator}。
     * 它后于ColumnModel的内置比较方法，但只会在前面比较都相等又没有中止时才会比较。
     * 返回值可参考{@link #before_comparator}
     */
    var Sorter = function (options) {

        this.options = $.extend({}, default_column_model_options, options);

        var opts = this.options;

        this._cur_field = opts.default_field;
        this._cur_order = opts.default_order;

        if (!opts.default_field) {
            console.error('ColumnModel缺少有效的default_field参数');
        }
        if (!opts.default_order) {
            console.error('ColumnModel缺少有效的default_order参数');
        }
        if (!$.isFunction(opts.get_datas)) {
            console.error('ColumnModel缺少有效的get_datas参数');
        }
    };

    Sorter.prototype = {

        /**
         * 排序
         * @param {Array<Array>} datas 要排序的数组的数组
         * @param {String} field
         * @param {String} order 'asc' or 'desc'
         */
        sort_datas: function (datas, field, order) {
            var me = this;

            field = field || me._cur_field;
            order = order || me._cur_order;

            datas = me._sort(datas, field, order);

            // 排序后的数据修复
            if ($.isFunction(me.options.after_sort)) {
                datas = me.options.after_sort(datas, field, order);
            }

            return datas;
        },

        /**
         * 排序
         * @param {String} field 根据这个字段排序
         * @param {String} [order] 方向(asc|desc), 默认为空, 为空表示切换asc/desc
         */
        sort: function (field, order) {
            var me = this;

            // 如果排序字段有变化
            if (field != me._cur_field) {
                // order 为空时用默认排序
                order = order || me.options.default_order;
            }

            // 排序字段无变化
            else {
                // 为空表示切换asc/desc
                if (!order) {
                    order = me._cur_order == 'desc' ? 'asc' : 'desc';
                }
            }

            // 如果和当前排序规则一致, 则不处理
            if (field === me._cur_field && order === me._cur_order) {
                return;
            }

            var datas = me._sort(me.options.get_datas(), field, order);

            me._cur_field = field;
            me._cur_order = order;

            // 排序后的数据修复
            if ($.isFunction(me.options.after_sort)) {
                datas = me.options.after_sort(datas, field, order);
            }

            me.trigger('sorted', datas, field);
        },
        
        _sort: function (datas, field, order) {
            var asc = order === 'asc';

            if (datas && datas.length) {

                var col = collections.first(this.options.cols, function (c) {
                    return c.field === field;
                });
                if (!col) {
                    return;
                }

                var val_get = col.val_get,
                    great = 1,
                    less = -1,
                    equal = 0,
                    skip = false,
                    ahead = asc ? less : great,
                    behind = asc ? great : less,
                    before_comparator = this.options.before_comparator,
                    after_comparator = this.options.after_comparator,
                    // 这个对比和旧有的功能相比，没有对index作处理，所以如果出现同优先级的情况，反序可能顺序仍不变。
                    // 不过目前只有固定的a-z与从新到旧两种顺序，特别是a-z时不会有同优先级(名称唯一)，所以不会有问题。
                    comparator = function(node1, node2){
                        var result;
                        if(before_comparator){ // 当有前置比较方法时，优先判断，只有相等时才继续下一步。
                            result = before_comparator(node1, node2);
                            if(result === skip){ // 有时前置比较方法得到的结果是相等，同时又不需要进一步比较，可以返回false中止，直接相等
                                return equal;
                            }
                            if(result !== equal){ // 前置不相等，直接返回
                                return result;
                            }
                        }
                        var value1 = val_get.call(col, node1),
                            value2 = val_get.call(col, node2);
                        //result = value1 === value2 ? equal : (value1 < value2 ? ahead : behind);
                        result = strCmpLogical(value1, value2);
                        if(result !== equal){
                            result = result < 0 ? ahead : behind;
                        }
                        
                        if(result === equal && after_comparator){
                            return after_comparator(node1, node2);
                        }
                        return result;
                    };

                for (var i = 0, l = datas.length; i < l; i++) {
                    if (datas[i]) {
                        // slice一下，避免直接修改原数组。
                        datas[i] = datas[i].slice(0).sort(comparator); // = collections.sort_by(datas[i], val_get, asc, col);
                    }
                }
            }
            return datas;
        }
    };

    $.extend(Sorter.prototype, events);

    return Sorter;
});