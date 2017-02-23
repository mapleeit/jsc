/**
 * 集合类方法
 * @jameszuo 12-12-25 下午3:49
 */
define(function (require, exports, module) {

    var $ = require('$'),

        native_keys = Object.keys,
        has_own_prop = Object.hasOwnProperty,

        undefined;

    var collections = {
        /**
         * 转换 Array 为 Set （键唯一），一般用于快速查找
         * @param {Array<String>|Array<Object>} arr
         * @param {String|Function} [the_id] ID字段名或一个用来获取ID的闭包
         */
        array_to_set: function (arr, the_id) {
            var set = {};
            for (var i = 0, l = arr.length; i < l; i++) {
                var it = arr[i];
                if (the_id) {
                    if (typeof the_id === 'function') {
                        set[the_id.call(it, it)] = it;
                    } else {
                        set[it[the_id]] = it;
                    }
                } else {
                    set[it] = it;
                }
            }
            return set;
        },

        /**
         * 获取 map 的 key 列表
         * @param {Object} map
         * @returns {String[]} keys
         */
        keys: native_keys || function (map) {
            var keys = [];

            if (map !== Object(map)) return keys;

            for (var key in map) if (this.has(map, key)) keys.push(key);
            return keys;
        },

        /**
         *
         * @param map
         * @returns {Array}
         */
        values: function(map) {
            var keys = this.keys(map),
                length = keys.length,
                values = new Array(length);

            for (var i = 0; i < length; i++) {
                values[i] = map[keys[i]];
            }
            return values;
        },

        /**
         * === Object.hasOwnProperty
         * @param {Object} map
         * @param {String} key
         * @returns {Boolean}
         */
        has: function (map, key) {
            return has_own_prop.call(map, key);
        },

        /**
         * 元素在数组中的位置
         * @param arr
         * @param value
         */
        indexOf: (function () {
            var indexOf = [].indexOf || function (value) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i] === value) {
                        return i;
                    }
                }
                return -1;
            };
            return function (arr, value) {
                return indexOf.call(arr, value);
            }
        })(),

        /**
         * 判断数组是否包含某个元素
         * @param arr
         * @param value
         * @return {Boolean}
         */
        contains: function (arr, value) {
            return this.indexOf(arr, value) > -1;
        },

        /**
         * 获取第一个符合要求的元素(非索引)
         * @param arr
         * @param filter
         */
        first: function (arr, filter) {
            if (arr) {
                if (arr instanceof Array) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var it = arr[i];
                        if (filter.call(it, it, i)) {
                            return it;
                        }
                    }
                } else if (arr instanceof Object) {
                    for (var prop in arr) {
                        var it = arr[prop];
                        if (filter.call(it, it, prop)) {
                            return it;
                        }
                    }
                }
            }
            return undefined;
        },

        /**
         * 遍历集合、映射，收集过滤器的返回值，组成新的集合
         * @param {Array|Object} arr
         * @param {Function} filter (item, i) 返回值将被收集
         */
        map: $.proxy($.map, $),

        /**
         * 遍历集合，过滤掉不符合条件的元素
         * @param {Array} arr
         * @param {Function} filter (item, i) 返回true表示保留该元素
         */
        grep: $.proxy($.grep, $),

        /**
         * 判断是否有任何一个元素符合要求(return true)
         * @param arr
         * @param filter
         */
        any: function (arr, filter) {
            if (arr) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    var it = arr[i];
                    if (true === filter.call(it, it, i)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 判断是否所有元素都符合要求(return true)
         * @param arr
         * @param filter
         */
        all: function (arr, filter) {
            if (arr) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    var it = arr[i];
                    if (true !== filter.call(it, it, i)) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 通过function切分数组，切分后原数组长度将减少
         * @param arr
         * @param {Function} fn 返回false来终止切分 .sub([1, 3, 5, true, false, false], function(it, i){
         *    return it <= 5;
         * }) // -> [1, 3, 5]
         */
        sub: function (arr, fn) {
            var result = [];
            if (arr) {
                var i = 0, l = arr.length, splice_to = 0;
                for (; i < l; i++) {
                    var it = arr[i],
                        ret = fn.call(it, it, i);
                    if (ret !== false) {
                        splice_to = i;
                        result.push(it);
                    } else {
                        break;
                    }
                }
                arr.splice(0, splice_to + 1);
            }
            return result;
        },

        /**
         * 移除符合条件的元素
         * @param arr
         * @param filter
         */
        remove: function (arr, filter) {
            if (arr && arr.length) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    var it = arr[i],
                        ret = filter.call(it, it, i);
                    if (ret === true) {
                        arr.splice(i, 1);
                    }
                }
            }
        },

        /**
         * 将数组分为多个子数组
         */
        split: function (arr, fn) {
            var results = [];
            if (arr && arr.length) {
                var i = 0,
                    l = arr.length,
                    sub = [];

                if (typeof fn == 'function') {
                    for (; i < l; i++) {
                        var it = arr[i],
                            ret = fn.call(it, it, i);

                        sub.push(it);
                        if (ret === true || i === l) {
                            results.push(sub);
                            sub = [];
                        }
                    }
                } else if (typeof fn == 'number') {
                    for (; i < l; i++) {
                        sub.push(arr[i]);
                        if ((i + 1) % fn === 0 || i === l - 1) {
                            results.push(sub);
                            sub = [];
                        }
                    }
                }
            }
            return results;
        },

        /**
         * 排序（修复了chrome v8下排序时同值对比排序后顺序错乱的bug）
         * @param {Array} array
         * @param {Function} iterator (value, index, array)
         * @param {Boolean} asc 是否从大到小，默认true
         * @param {*} [context]
         * @returns {*}
         */
        sort_by: function (array, iterator, asc, context) {
            asc = asc !== false;

            var iterator_ = iterator,
                forward = asc ? -1 : 1,
                backward = asc ? 1 : -1;

            var map = this.map(array, function (value, i, array) {
                return {
                    value: value,
                    index: i,
                    criteria: iterator_.call(context, value, i, array)
                };
            });

            var list = map.sort(function (left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0) return backward;
                    if (a < b || b === void 0) return forward;
                }
                return left.index < right.index ? forward : backward;
            });

            return this.map(list, function (item) {
                return item.value;
            });
        }

    };

    module.exports = collections;

//    // test sub
//    (function () {
//        var arr = [ 1, true, false ];
//        console.log('sub -> ', module.exports.sub(arr, function (it, i) {
//            return 0 == i || (i < 10 && typeof it == typeof arr[i - 1]);
//        }), 'arr -> ', arr);
//
//        var arr = [ 1 ];
//        console.log('sub -> ', module.exports.sub(arr, function (it, i) {
//            return true;
//        }), 'arr -> ', arr);
//    })();

//    // test first
//    (function () {
//        var obj = { a:1, b:2, c:true };
//        console.log(obj, '.first -> ', module.exports.first(obj, function (it, prop) {
//            return it === true;
//        }));
//    })();

//    (function(){
//        var arr = [1, 2, 3, 4, 5],
//            arr_str = arr.toString();
//        module.exports.remove(arr, function(it){
//            return it % 2 == 0;
//        });
//        console.log('collections.remove[(', arr_str, ']) -> ', arr);
//    })();

//    (function (n) {
//        var tests = [
//            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//            [1, 2, 3],
//            [1],
//            []
//        ];
//        for (var i = 0, l = tests.length; i < l; i++) {
//            var results = collections.split(tests[i], n);
//            console.log('collections.split(', tests[i], ',', n, ') -> ', JSON.stringify(results));
//        }
//    })(3);
});
