/**
 * @author trump
 * @date 2013-11-13
 */
define(function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),

        UN_REACHABLE = Math.pow(2, 30);//足够遥远以至于不能到达
    /**
     * 节点搜索工具对象
     * @type {{_int_css: Function, _first_visible_child: Function, _real_xy: Function, for_common_cell: Function, for_points: Function}}
     */
    var search = {
        _int_css: function ($el, attr_name) {
            return parseInt($el.css(attr_name)) || 0;
        },
        _first_visible_child: function ($els, filter) {
            for (var i = 0, l = $els.length; i < l; i++) {
                var el = $els[i],
                    n = el.firstChild;

                if (!n)
                    continue;

                for (; n; n = n.nextSibling) {
                    if (filter) {
                        if ($(n).is(filter))
                            return n;

                    } else {
                        if (n.nodeType === 1)
                            return n;
                    }
                }
            }
        },
        _real_xy: function (opt, list_par) {
            var me = this,
                $list_par = $(list_par),
                list_par_offs = $list_par.offset();
            var xy = {
                x: (list_par_offs.left + opt.$scroller.scrollLeft()) + me._int_css($list_par, 'paddingLeft'),
                y: (list_par_offs.top + opt.$scroller.scrollTop()) + me._int_css($list_par, 'paddingTop')
            };

            return xy;
        },

        for_common_cell: function (opt) {
            var first_cell = this._first_visible_child(opt.$els.filter(':visible'), opt.child_filter);
            if (!first_cell || !first_cell.id) {
                return null;
            }
            var $first_cell = $(first_cell);
            return {
                width: $first_cell.outerWidth() + this._int_css($first_cell, 'marginLeft') + this._int_css($first_cell, 'marginRight'),
                height: $first_cell.outerHeight() + this._int_css($first_cell, 'marginTop') + this._int_css($first_cell, 'marginBottom')
            };
        },
        /**
         * 重新计算所有单元格的位置（通过第一个单元格推算）
         * @param opt {
         *      {
         *          $scroller:'产生滚动条jQuery Object',
         *          $els: '匹配元素的父级元素jQuery Object',
         *          container_width:'计算容器宽度的function',
         *          child_filter:'匹配元素的选择器'
         *      }
         *  }
         */
        for_points: function (opt) {
            var me = this,
                out_size = me.for_common_cell(opt);
            if (!out_size) {
                return;
            }
            var points = [],
                cell_height = out_size.height, // 行高度
                cell_width = out_size.width, // 单元格宽度
                container_width = opt.container_width,

                list_par, // 列表容器
                list_xy,  // 列表位置
                row_index = 0, cell_index = 0; // 当前正在计算的行索引

            // 便利子元素计算位置
            var iter_cell = function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    list_par = cell.parentNode;
                    row_index = 0; // 跨父容器后，重置行索引
                    cell_index = 0;
                    list_xy = me._real_xy(opt, list_par);
                }

                // 如果超出宽度，折行。此时 row_index++, cell_index=0
                var x1 , y1;
                if (cell_width * (cell_index + 1) > container_width) {
                    row_index++;
                    cell_index = 0;
                    x1 = 0;
                } else {
                    x1 = cell_width * cell_index;
                }
                y1 = cell_height * row_index;

                points.push(new Point({
                    left: x1 + list_xy.x,
                    top: y1 + list_xy.y,
                    id: cell.id
                }));
                cell_index++;
            };

            if (opt.child_filter) {
                $.each(opt.$els, function (i, $el) {
                    $.each($($el).children(opt.child_filter), function (j, cell) {
                        iter_cell(cell);
                    });
                });
            }


            return points;
        }
    };

    var Point = function (opt) {
        this._top = opt.top;
        this._left = opt.left;
        this._id = opt.id;
    };

    $.extend(Point.prototype, {
        get_id: function () {
            return this._id;
        },
        get_top: function () {
            return this._top;
        },
        get_left: function () {
            return this._left;
        }
    });

    var AxisMap = function (opt) {
        this.o = $.extend({
            ns: 'common',
            $el: '',
            get_$els: null,
            $scroller: '',
            container_width: $.noop,
            child_filter: ''
        }, opt);
    };

    //私有方法
    $.extend(AxisMap.prototype, {
        /**
         * 获取最靠近的坐标X轴或Y轴
         * @param axis {Array<Number>}
         * @param target {Number}
         * @return {int}
         */
        _get_near_axis: function (axis, target) {
            var pos = axis.length - 1,
                max = axis[pos],
                min = axis[0];
            if (target >= max)
                return max;
            if (target <= min)
                return min;

            var diff = 0;
            while (diff >= 0 && pos > 0) {
                pos -= 1;
                diff = axis[pos] - target;
            }
            if (diff > 0) {
                return min;
            }
            if (axis[pos + 1]) {
                if (axis[pos + 1] - target < Math.abs(diff)) {
                    return axis[pos + 1];
                }
            }
            return axis[pos];
        },
        /**
         * 获取最后一点坐标点
         * @return {Point}
         * @private
         */
        _get_last_point: function () {
            var me = this, y_max = me.get_y_max();
            return me._get_map().y_axis[y_max][me._get_map().y_axis[y_max - 1]];
        },
        /**
         * 传入坐标点中的最近的坐标点
         * @param points
         * @param key_name
         * @param search_value
         * @returns {*}
         */
        _get_near_point: function (points, key_name, search_value) {
            if (!points || !points.length) {
                return null;
            }
            var diff = UN_REACHABLE,
                method_name = key_name === 'left' ? 'get_left' : 'get_top',
                match,
                point,
                len = points.length;
            while (len) {
                len -= 1;
                point = points[len];
                var match_val = point[method_name].call(point);
                if (match_val === search_value) {//已找到
                    return point;
                }
                if (Math.abs(match_val - search_value) < diff) {
                    match = points[len];
                    diff = Math.abs(match_val - search_value);
                }
            }
            return match;
        },
        /**
         * 坐标集合
         */
        _get_map: function () {
            return this._map;
        },
        /**
         * 计算坐标系
         * @param points {Array<Point>}
         */
        _paint_axis: function (points) {
            //清空坐标系
            this.x_step = [];//X轴含有的坐标点
            this.y_step = [];//X轴含有的坐标点
            this._map = {x_axis: {}, y_axis: {}};
            this.ids = [];

            if (!points || !points.length)
                return;

            //添加坐标点
            var len = points.length;
            while (len) {
                len -= 1;
                var point = points[len], top = point.get_top(), left = point.get_left();
                this.ids.push(point.get_id());
                (this._get_map().y_axis[top] ? this._get_map().y_axis[top] : (this._get_map().y_axis[top] = []) ).push(point);
                (this._get_map().x_axis[left] ? this._get_map().x_axis[left] : (this._get_map().x_axis[left] = []) ).push(point);
            }

            //排序坐标点
            this._sort_axis(this._get_map().y_axis, this.y_step, 'get_left');
            this._sort_axis(this._get_map().x_axis, this.x_step, 'get_top');
        },
        /**
         * 排序指定坐标
         * [4:{...},2:{...},1:{...},7:{...},9:{...},8:{...}] ==> [1,2,4,7,8,9]
         * @param axis {HashMap<String,Array>}
         * @param axis_step {Array}
         * @param get_fn {String}
         */
        _sort_axis: function (axis, axis_step, get_fn) {
            for (var key in axis) {
                axis_step.push(key - 0);//放入数组
                axis[key - 0].sort(function (y1, y2) {//子集升序排列
                    return y1[get_fn].call(y1) > y2[get_fn].call(y2) ? 1 : -1;
                });
            }
            axis_step.sort(function (y1, y2) {//升序排列
                return y1 > y2 ? 1 : -1;
            });
        }

    });

    //销毁、重绘地图
    $.extend(AxisMap.prototype, {
        /**
         * 销毁坐标地图
         */
        destroy: function () {
            delete this.x_step;
            delete this.y_step;
            delete this._map;
        },
        /**
         * 重绘坐标地图
         */
        re_paint: function () {
            var opt = {//搜索参数
                    container_width: this.o.container_width.call(this),
                    $scroller: this.o.$scroller,
                    $els: this.o.$el || this.o.get_$els.call(this),
                    child_filter: this.o.child_filter
                },
                points = search.for_points(opt),
                outSize = search.for_common_cell(opt);

            if (points) {
                this._paint_axis(points);
                this.width = outSize.width;
                this.height = outSize.height;
            }
            return this;
        }
    });

    //匹配元素的方法
    $.extend(AxisMap.prototype, {
        /**
         * 获取靠左的元素
         * @param point {Point} 坐标点
         * @param [except_id] {String} 排除节点ID
         * @return {null|Point}
         */
        get_left_point: function (point, except_id) {
            var y_axis = this._get_map().y_axis[point.get_top()],//对应y轴上所有的坐标
                y_len = y_axis.length,
                left_point;
            while (y_len) {
                y_len -= 1;
                if (y_axis[y_len].get_left() === point.get_left()) {
                    if (y_axis[y_len - 1] && (!except_id || except_id !== y_axis[y_len - 1].get_id())) {
                        left_point = y_axis[y_len - 1];
                    }
                    break;
                }
            }
            return left_point;
        },
        /**
         * 获取靠右的元素
         * @param point {Point} 坐标点
         * @param except_id {String} 排除节点ID
         * @return {null|Point}
         */
        get_right_point: function (point, except_id) {
            var y_axis = this._get_map().y_axis[point.get_top()],//对应y轴上所有的坐标
                y_len = y_axis.length,
                left_point;
            while (y_len) {
                y_len -= 1;
                if (y_axis[y_len].get_left() === point.get_left()) {
                    if (y_axis[y_len + 1] && (!except_id || except_id !== y_axis[y_len + 1].get_id())) {
                        left_point = y_axis[y_len + 1];
                    }
                    break;
                }
            }
            return left_point;
        },
        /**
         * 获取坐标范围内的坐标点id(优先y轴比较)
         * @param max_x
         * @param min_x
         * @param max_y
         * @param min_y
         */
        match_range: function (max_x, min_x, max_y, min_y) {
            var id_array = [], y_step = this.y_step, y_len = y_step.length, ind = 0, step;
            min_y -= (this.height - 10);//像素的偏差
            while (ind < y_len) {
                step = y_step[ind];
                ind += 1;
                if (step < min_y) {
                    continue;
                }
                if (step > max_y) {
                    break;
                }
                $.each(this._get_map().y_axis[step],function(i,point){
                    var left = point.get_left();
                    if (left <= max_x && left >= min_x) {
                        id_array.push(point.get_id());
                    }
                });
            }
            return id_array;
        },
        /**
         * 匹配选中的节点
         * @param offset
         */
        point_match: function (offset) {
            var me = this, point = null, map = me._get_map();
            var near_y = me._get_near_axis(me.y_step, offset.top),
                near_x = me._get_near_axis(me.x_step, offset.left),
                y_max = me.get_y_max(),
                near_y_point = me._get_near_point(map.y_axis[near_y], 'left', near_x);
            if (offset.top > y_max) {//超过最大Y轴边界
                if (offset.top > y_max + me.height) {//完全超出
                    point = me._get_last_point();
                } else {//只超出一个身位
                    if (Math.abs(near_y_point.get_left() - offset.left) > me.width) {//最近的Y轴元素的X轴超过一个身位
                        point = me._get_last_point();
                    }
                }
            }
            if (!point) {
                point = near_y_point;
            }
            return {
                'point': point,
                'left': (point.get_left() >= offset.left)
            };
        }
    });

    //排序检测
    $.extend(AxisMap.prototype, {
        /**
         * 获取Y轴最大值
         * @return {int}
         */
        get_y_max: function () {
            return this.y_step[ this.y_step.length - 1];
        },
        /**
         * 获取x轴最大值
         * @return {int}
         */
        get_x_max: function () {
            return this.x_step[ this.x_step.length - 1];
        }
    });

    return {
        get_instance: function (opt) {
            return new AxisMap(opt);
        }
    }
});