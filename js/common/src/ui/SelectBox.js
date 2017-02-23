/**
 * 框选
 *
 *************************************************************************
 *                                                                      **
 *              注意：每一个节点都必须包含一个全局唯一的 ID !!!              **
 *                                                                      **
 *************************************************************************
 *
 * @author jameszuo
 * @date 13-10-24
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        console = lib.get('./console').namespace('SelectBox'),
        events = lib.get('./events'),

        functional = require('./util.functional'),
        constants = require('./constants'),

        DEFAULT_KEEP_ON = 'a, [data-no-selection], input, textarea, button, object, embed',

        default_ops = {
            /**
             * 命名空间
             * @type {String}
             */
            ns: 'your_namespace',
            /**
             * 列表父容器
             * @type {jQuery|HTMLElement|String}
             */
            $el: null,
            /**
             * 是否有复选框
             * @type {Boolean}
             */
            has_checkbox: false,
            /**
             * 获取列表容器
             * @type {Function}
             * @return {jQuery}
             */
            get_$els: $.noop,
            /**
             * 滚动容器
             * @type {jQuery|HTMLElement|String}
             */
            $scroller: 'body',
            /**
             * 所有单元格尺寸都一样
             * @type {Boolean}
             */
            all_same_size: true,
            /**
             * 获取容器宽度
             * @returns {Number}
             */
            container_width: function () {
                return this.o.$scroller.width();
            },
            /**
             * 子节点过滤器
             * @type {String}
             */
            child_filter: null,
            /**
             * 获取容器的碰触体积，默认返回null使用实际体积
             * @param {String} el_id
             * @returns {{ width: Number, height: Number }}
             */
            touch_size: $.noop,
            /**
             * 是否检查真实碰触体积
             * @returns {Boolean} 是否计算碰触体积。true-计算；false-不计算，使用实际体积
             */
            enable_touch_size: $.noop,
            /**
             * 拖拽辅助层
             * @type {String}
             */
            helper: (constants.IS_OLD || constants.IS_APPBOX)? '<div class="ui-selectable-helper"></div>' : '<div class="mod-selectable-helper"></div>',
            /**
             * 选中的样式
             * @type {String}
             */
            selected_class: (constants.IS_OLD || constants.IS_APPBOX)? 'ui-selected' : 'act',
            /**
             * 选择前的拦截器，用于过滤掉不允许选中的节点
             * @type {Function}
             * @param {String} el_id
             */
            is_selectable: $.noop,
            /**
             * 自定义开始框选前的拦截，用于取消开始框选的动作
             * @type {Function}
             * @param {String} el_id
             */
            before_start_select: $.noop,
            keep_on_selector: DEFAULT_KEEP_ON,
            /**
             * mousedown 这些元素时，不会执行选中和取消动作（覆盖该参数不会覆盖这个动作，只是加多一个条件）
             * @type {Function}
             */
            keep_on: $.noop,
            /**
             * 点击这些元素时取消选中（默认点击元素外部时取消选中，覆盖该参数不会覆盖这个动作，只是加多一个条件）
             * @type {Function}
             */
            clear_on: $.noop,
            /**
             * 按下鼠标后，延迟若干毫秒后才启动拖拽动作
             * @type {Number}
             */
            // delay: 300,
            /**
             * 按下鼠标后，移动若干像素后才启动拖拽动作
             * @type {Number}
             */
            distance: 20
        },
        seq = 0,
        doc = document,
        get_by_id = function (id) {
            return doc.getElementById(id)
        },
        $doc = $(document),
        support_selectstart = 'onselectstart' in document.createElement('div'),

        SCROLLBAR_WIDTH = 20,

        namespaces = {},

        undef;

    /**
     * 框选对象构造函数
     * 事件列表:
     *    select_change (Object sel_id_map, Object org_sel_id_map)
     * @param {Object} o
     * @constructor
     */
    var SelectBox = function (o) {
        if (!o.ns)
            throw 'new SelectBox() 时未指定 ns 参数';
        if (o.ns in namespaces)
            throw ('new SelectBox() ns 参数不允许重复，"' + o.ns + '" 已存在');
        else
            namespaces[o.ns] = 1;

        var me = this,
            o = me.o = $.extend({}, default_ops, o);

        o.$scroller = $(o.$scroller);
        me._ns = '.SelectBox' + (seq++);
        me._id_map_pos = {};
        me._touch_size_map = {};
        me._sel_id_map = {};
        me._org_sel_id_map = null;
        me._inited = false;
        me._enabled = false;
        me._started = false;

        SelectBox.instances.push(me);
    };

    SelectBox.instances = [];

    SelectBox.prototype = {
        destroy: function () {
            if (this.destroyed) {
                return;
            }
            this.cancel();
            if (this._enabled) {
                this.disable();
            }
            delete namespaces[this.o.ns];
            var index = $.inArray(this, SelectBox.instances);
            SelectBox.instances.splice(index, 1);
            this.destroyed = true;
        },

        /*_init: function () {
         var me = this;
         if (me._inited) return;

         me._inited = true;
         },
         */
        is_enabled : function(){
            return this._enabled;
        },
        enable: function () {
            var me = this, ns = me._ns;

            me.disable();

            me._reg_start_event();
            me._reg_clear_event();
            me._toggle_text_select(false);
            me._enabled = true;
        },

        disable: function () {
            var me = this;
            me._unreg_start_event();
            me._unreg_clear_event();
            me._toggle_text_select(true);
            me._enabled = false;
        },

        refresh: function () {
            if (this._started && this._enabled) {
                this._calc_id_map_pos(this._get_$els());
            }
        },

        /**
         * 手动设置已选中的元素（不覆盖其他元素）
         * @param {String[]} el_ids
         * @param {Boolean} is_sel
         */
        set_selected_status: function (el_ids, is_sel) {
            var me = this,
                sel_id_map = me._sel_id_map;

            for (var i = 0, l = el_ids.length; i < l; i++) {
                var el_id = el_ids[i];

                // 选中或取消之前，先过滤下
                if (!me._is_selectable(el_id)) {
                    continue;
                }

                if (is_sel) {
                    sel_id_map[el_id] = 1;
                } else {
                    delete sel_id_map[el_id];
                }

                me.set_dom_selected(el_id, is_sel);
            }

//            console.log($.map(me._sel_id_map, function (_, el_id) {
//                return $('#' + el_id)[0]
//            }));
//            console.log(me._sel_id_map);
        },

        /**
         * 手动设置DOM的选中状态
         * @param {String|String[]} el_ids
         * @param {Boolean} is_sel
         */
        set_dom_selected: function (el_ids, is_sel) {
            var o = this.o, $ck;
            el_ids = typeof el_ids === 'string' ? [el_ids] : el_ids;
            for (var i = 0, l = el_ids.length; i < l; i++) {
                var el_id = el_ids[i];
                if (this._is_selectable(el_id)) {
                    var item = get_by_id(el_id);
                    if (item) {
                        var $item = $(item);
                        $item.toggleClass(this.o.selected_class, is_sel);

                        // 复选框
                        if (o.has_checkbox && ($ck = $item.find(':checkbox')) && $ck[0]) {
                            is_sel ? $ck.attr('checked', 'checked') : $ck.removeAttr('checked');
                        }
                    }
                }
            }
        },

        get_selected_id_map: function () {
            return this._sel_id_map;
        },

        has_selected: function () {
            return !$.isEmptyObject(this.get_selected_id_map());
        },

        /**
         * 判断指定DOM是否已选中
         * @param {String|HTMLElement|jQuery} item
         * @returns {boolean}
         */
        is_selected: function (item) {
            var id = typeof item === 'string' ? item : $(item).attr('id');
            return id in this.get_selected_id_map();
        },

        is_selecting: function () {
            return this._is_selecting;
        },

        cancel: function () {
            var me = this, o = me.o;

            /*if (o.delay > 0) {
             me._cancel_on_delay();
             } else */
            if (o.distance > 0) {
                me._cancel_on_distance();
            } else {
                me._cancel();
            }
        },

        clear_selected: function () {
            var me = this,
                sel_id_map = me._sel_id_map;

            if (sel_id_map && !$.isEmptyObject(sel_id_map)) {
                for (var el_id in sel_id_map) {
                    this.set_dom_selected(el_id, false);
                }
            }

            if (!this._is_batch_mode) {
                this._trigger_change(this._sel_id_map, this._sel_id_map = {});
            }
        },

        batch: function (fn) {
            var org_sel_id_map = $.extend({}, this._sel_id_map);

            this._is_batch_mode = true;
            fn.call(this);
            this._is_batch_mode = false;

            this._trigger_change(org_sel_id_map, this._sel_id_map);
        },

        _reg_start_event: function () {
            var me = this, o = me.o, ns = me._ns;// + '_start_event';

            // 先解除所有事件，避免重复绑定
            me._unreg_all_events();

            $doc.on('mousedown' + ns, function (e) {
                // 只处理左键
                var is_left_btn = e.which === 1;
                if (!is_left_btn)
                    return;

                var $tar = $(e.target);

                // mousedown 某些元素不执行选中、取消动作（默认行为）
                if (me._is_keep_on_el($tar))
                    return;

                if (!me._before_start_select($tar))
                    return;

                // 避免在滚动条上点击
                if (e.clientX >= o.$scroller.offset().left + o.$scroller.width() - SCROLLBAR_WIDTH)
                    return;

                // 清除选中
                if (me.has_selected() && me._is_click_to_clear(e, $tar))
                    me.clear_selected();

                // 如果没有按下ctrl/meta，清除选中
//                var is_multi = is_multi_key(e);
//                if (!is_multi)
//                    me.clear_selected();

                // 避免文本选中
                e.preventDefault();


                // 清除文本选中
                clear_text_sel(e);

                // 开始框选
                me._mouse_down(e);
            });
        },

        _unreg_start_event: function () {
            var me = this, ns = me._ns;// + '_start_event';
            // 绑定按下鼠标后启动框选的事件
            $doc.off('mousedown' + ns + ' click' + ns);
        },

        _reg_clear_event: function () {
            var me = this, o = me.o, ns = me._ns;// + '_clear_event';

            me._unreg_clear_event();

            $doc.on('click' + ns, function (e) {
                var $tar = $(e.target);
                if (me.has_selected() && me._is_click_to_clear(e, $tar) && !me._is_keep_on_el($tar)) {
                    me.clear_selected();
                }
            });
        },

        _unreg_clear_event: function () {
            $doc.off('click' + this._ns);// + '_clear_event');
        },

        _unreg_all_events: function () {
            var $scroller = this.o.$scroller, ns = this._ns;
            this._unreg_start_event();
            // 先解除所有事件，避免重复绑定
            $doc.off('mousemove' + ns + ' mouseup' + ns);
            $scroller.off('scroll' + ns);
        },

        _mouse_down: function (e) {
            var me = this, o = me.o;

            // 移动一定距离后启动框选
            if (o.distance > 0) {
                me._start_on_distance(e);
            }
//            // 延迟一定时间后启动框选
//            else if (o.delay > 0) {
//                me._start_on_delay(e);
//            }
            // 立刻开始启动框选
            else {
                var is_multi = is_multi_key(e);
                me._start(e.clientX, e.clientY, is_multi);
            }
        },

        /**
         * 开始框选
         * @param {Number} x 开始的x坐标
         * @param {Number} y 开始的y坐标
         * @param {Boolean} is_multi 保持多选
         * @private
         */
        _start: function (x, y, is_multi) {

            if (this._is_conflicted())
                return;

            this._started = true;

            var me = this, o = me.o, ns = me._ns, $scroller = o.$scroller,
                start_xy = me._start_xy = me._calc_start_xy(x, y),
                sel_range, fixed_range;

            me._org_sel_id_map = $.extend({}, me._sel_id_map);

            // 计算所有单元格位置
            me._calc_id_map_pos(me._get_$els());

            // 初始化 helper 位置
            me._create_$helper(start_xy.x, start_xy.y);

            /**
             * 更新框选区域
             * @param {Number} x
             * @param {Number} y
             */
            var update_select = function (x, y) {
                sel_range = me._calc_range(start_xy, x, y);
                fixed_range = me._fix_range(sel_range);

                // 如果不保持选中，则重置 _sel_id_map
                // var sel_id_map = keep_selected ? me._sel_id_map : (me._sel_id_map = {});

                // 更新helper位置
                me._update_$helper(fixed_range);
                // 选中节点
                me._select_by_range(fixed_range, is_multi);
            };


            me._unreg_all_events();

            // 拖拽鼠标时，更新框选位置
            $doc.on('mousemove' + ns, function (e) {
                update_select(e.clientX, e.clientY);
            });

            // 弹起鼠标时，销毁事件，重新监听mousedown
            $doc.on('mouseup' + ns, function (e) {
                me._stop();
            });

            // 在容器中滚动时，更新框选位置
            $scroller.on('scroll' + ns, function (e) {
                if (sel_range) {
                    update_select(sel_range.x2, sel_range.y2);
                }
            });
        },

        _stop: function () {
            var me = this;

            this._trigger_change(me._org_sel_id_map, me._sel_id_map);

            me._reg_start_event();
            me._remove_$helper();

            me._started = false;
        },

        _cancel: function () {
            // this._unreg_all_events();
            this._reg_start_event();
        },

        /*_start_on_delay: function (e) {
         var me = this, o = me.o, ns = me._ns,
         keep_selected = is_multi_key(e);

         me._start_delay_tmr = setTimeout(function () {
         me._start(e.clientX, e.clientY, keep_selected);
         }, o.delay);

         // 如果延迟过程中鼠标弹起，则不执行
         $doc.one('mouseup' + ns, function () {
         clearTimeout(me._start_delay_tmr);
         });
         },

         _cancel_on_delay: function () {
         clearTimeout(this._start_delay_tmr);
         $doc.off('mouseup' + this._ns);
         },*/

        // distance 方式启动框选
        _start_on_distance: function (e) {
            var me = this, o = me.o, ns = me._ns,
                start_xy = { x: e.clientX, y: e.clientY },
                is_multi = is_multi_key(e);

            // 鼠标弹起的话，取消
            $doc.on('mouseup' + ns/* + '.distance'*/, function (e) {
                $doc.off('mousemove' + ns/* + '.distance'*/ + ' mouseup' + ns/* + '.distance'*/);
            });

            // 鼠标移动达到指定值后，启动框选
            $doc.on('mousemove' + ns/* + '.distance'*/, function (e) {

                if (Math.max(
                        Math.abs(start_xy.x - e.clientX),
                        Math.abs(start_xy.y - e.clientY)
                    ) > o.distance) {

                    $doc.off('mousemove' + ns/* + '.distance'*/ + ' mouseup' + ns/* + '.distance'*/);

                    me._start(start_xy.x, start_xy.y, is_multi);
                }
            });
        },

        _cancel_on_distance: function () {
            var ns = this._ns;
            $doc.off('mouseup' + ns/* + '.distance'*/ + ' mousemove' + ns);
        },

        _is_keep_on_el: function ($tar) {
            var o = this.o;
            return !!$tar.closest(o.keep_on_selector).length || (o.keep_on !== default_ops.keep_on && o.keep_on.call(this, $tar));
        },

        _calc_start_xy: function (client_x, client_y) {
            var o = this.o,
                scr_x = o.$scroller.scrollLeft(),
                scr_y = o.$scroller.scrollTop();

            return {
                x: client_x,
                y: client_y,
                scr_x: scr_x,
                scr_y: scr_y
            };
        },

        _calc_range: function (start_xy, x, y) {
            var o = this.o,
                scr_x = o.$scroller.scrollLeft(),
                scr_y = o.$scroller.scrollTop(),
                x1 = start_xy.x - (scr_x - start_xy.scr_x),
                y1 = start_xy.y - (scr_y - start_xy.scr_y),
                x2 = x,
                y2 = y,
                r = {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    scr_x: scr_x,
                    scr_y: scr_y
                };
            return r;
        },

        _calc_id_map_pos: function ($els) {
            this.o.all_same_size ? this._calc_id_map_pos_by_first($els) : this._calc_id_map_pos_by_offs($els);
        },

        /**
         * 重新计算所有单元格的位置（通过第一个单元格推算）
         * @param {jQuery} $els
         * @private
         */
        _calc_id_map_pos_by_first: function ($els) {
            var me = this, o = me.o,
                id_map_pos = me._id_map_pos = {},
            // test code
//                test_data = [],
                first_cell = me._get_first_cell($els);

            if (!first_cell)
                return id_map_pos;
            if (!first_cell.id) {
                console.error('SelectBox 需要读取每一个文件DOM的id来优化计算速度，请给每一个DOM绑定一个唯一的ID');
                return id_map_pos;
            }

            var
                $first_cell = $(first_cell),
                cell_size = out_size($first_cell),
                cell_height = cell_size.height, // 行高度
                cell_width = cell_size.width, // 单元格宽度
                container_width = o.container_width.call(me),

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

                    list_xy = me._real_xy(list_par);
                }

                // 如果超出宽度，折行。此时 row_index++, cell_index=0
                var x1;
                if (cell_width * (cell_index + 1) > container_width) {
                    row_index++;
                    cell_index = 0;
                    x1 = 0;
                } else {
                    x1 = cell_width * cell_index;
                }

                var x2 = cell_width * (cell_index + 1),
                    y1 = cell_height * row_index,
                    y2 = cell_height * (row_index + 1),
                    cell_pos = {
                        x1: x1 + list_xy.x,
                        x2: x2 + list_xy.x,
                        y1: y1 + list_xy.y,
                        y2: y2 + list_xy.y
                    };

                id_map_pos[cell.id] = cell_pos;

                // test code
//                test_data.push({
//                    el_id: cell.id,
//                    cell_index: cell_index,
//                    row_index: row_index,
//                    pos: cell_pos
//                });

                cell_index++;
            };

            if (o.child_filter) {
                $.each($els, function (i, $el) {
                    $.each($($el).children(o.child_filter), function (j, cell) {
                        iter_cell(cell);
                    });
                });
            } else {
                each_child_nodes($els, iter_cell);
            }

            // test code
//            $($.map(test_data,function (d) {
//                var el_id = d.el_id,
//                    row_index = d.row_index,
//                    cell_index = d.cell_index,
//                    pos = d.pos;
//                return ['<div style="position:absolute;top:', pos.y1, 'px;left:', pos.x1, 'px;width:', pos.x2 - pos.x1, 'px;height:', pos.y2 - pos.y1, 'px;background-color:orange;opacity:.2;filter:alpha(opacity=20);border:1px solid red;word-break:break-all;">', row_index, ':', cell_index, ' - id=', el_id, '</div>'].join('');
//            }).join('')).appendTo('body');

            return id_map_pos;
        },

        /**
         * 计算每一个单元格的位置
         * @param {jQuery} $els
         * @private
         */
        _calc_id_map_pos_by_offs: function ($els) {
            var me = this,
                id_map_pos = me._id_map_pos = {},
                scr_y = me.o.$scroller.scrollTop(),
                //因为disk缩略图模式下，文件夹和文件分布属于不同的父元素，但计算文件的时候，会把文件夹的高度重复算了一次，这里需要把文件夹的高度去掉
                pre_par_height = 0,
                list_par,
                list_xy;

            each_child_nodes($els, function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    if(list_par) {
                        pre_par_height = $(list_par.parentNode).outerHeight() + pre_par_height;
                    }
                    list_par = cell.parentNode;
                    list_xy = me._real_xy(list_par);
                }

                var id = cell.id,
                    $c = $(cell),
                    c_pos = $c.position(),
                    x1 = list_xy.x + c_pos.left,
                    x2 = x1 + $c.width(),
                    y1 = list_xy.y + c_pos.top + scr_y - pre_par_height,
                    y2 = y1 + $c.height();

                id_map_pos[id] = {
                    x1: x1,
                    x2: x2,
                    y1: y1,
                    y2: y2
                };
            });

            return id_map_pos;
        },

        _get_first_cell: function ($els) {
            return first_visible_child($els.filter(':visible'), this.o.child_filter);
        },

        /**
         * 根据框选范围选中元素
         * @param {Object} fixed_range
         * @param {Boolean} is_multi
         * @private
         */
        _select_by_range: function (fixed_range, is_multi) {
            var me = this,
                pos_map = me._id_map_pos,
                sel_id_map = me._sel_id_map;

            if (!pos_map)
                return;


            /*
             pos:
             x1,y1   x2,y1
             ┌────┐
             │     │
             └────┘
             x1,y2   x2,y2
             */

            var
                diff_scr_x = fixed_range.scr_x, // 开始框选后，可能会滚动列表，这时需要和开始框选的位置进行对比才能取得正确的范围
                diff_scr_y = fixed_range.scr_y,
                related_range = {
                    x1: fixed_range.x1 + diff_scr_x,
                    x2: fixed_range.x2 + diff_scr_x,
                    y1: fixed_range.y1 + diff_scr_y,
                    y2: fixed_range.y2 + diff_scr_y
                },
                touched_ids = [], untouched_ids = [];

            for (var el_id in pos_map) {
                var el_pos = pos_map[el_id];

                // 判断是否碰触
                var is_touched = me._is_touched(el_id, el_pos, related_range);
                if (is_touched) {
                    if (!(el_id in sel_id_map)) {
                        sel_id_map[el_id] = 1;
                        touched_ids.push(el_id);
                    }
                } else if (!is_multi && el_id in sel_id_map) {
                    delete sel_id_map[el_id];
                    untouched_ids.push(el_id);
                }
            }

            // test code
//            touched_ids.length && $.each(touched_ids, function (i, elid) {
//                return $('#' + elid + ' [data-name="file_name"]').css('border', '1px solid red')
//            });
//            untouched_ids.length && $.each(untouched_ids, function (i, elid) {
//                return $('#' + elid + ' [data-name="file_name"]').css('border', '1px solid blue')
//            });

            me.set_dom_selected(touched_ids, true);
            me.set_dom_selected(untouched_ids, false);
        },

        /**
         * 判断框选区域是否已“碰到”目标区域
         * @param {String} el_id
         * @param {Object} el_pos
         * @param {Object} related_range
         * @private
         */
        _is_touched: function (el_id, el_pos, related_range) {
            var me = this, o = me.o, touch_map = me._touch_size_map;

            // 考虑便于阅读，始终使用小于号进行判断
            var is_touched = me._is_pos_match(el_pos, related_range);

            // 修正碰触体积
            if (is_touched && o.enable_touch_size() && o.touch_size !== o.noop) {
                var touch_size = el_id in touch_map ? touch_map[el_id] : (touch_map[el_id] = o.touch_size.call(me, el_id, el_pos)),
                    x1 = el_pos.x1, x2 = el_pos.x2, y1 = el_pos.y1, y2 = el_pos.y2;
                if (touch_size) {
                    if (touch_size.width) {
                        x2 = el_pos.x1 + touch_size.width;
                    }
                    if (touch_size.height) {
                        y2 = el_pos.y1 + touch_size.height;
                    }
                }
                is_touched = me._is_pos_match({ x1: x1, x2: x2, y1: y1, y2: y2 }, related_range);
            }
            return is_touched;
        },

        _is_pos_match: function (el_pos, related_range) {
            return !(el_pos.x2 < related_range.x1 || related_range.x2 < el_pos.x1 || related_range.y2 < el_pos.y1 || el_pos.y2 < related_range.y1)
        },

        _create_$helper: function (x, y) {
            var me = this,
                o = me.o,
                $scroller = o.$scroller,
                $helper = o.$helper = $(o.helper);

            $helper.css({
                display: 'block',
                position: 'absolute',
                left: x + 'px',
                top: y + 'px',
                width: 0 + 'px',
                height: 0 + 'px'
            }).appendTo(document.body);

            // 在 helper 上滚动鼠标时，主动控制滚动条高度，以修复无法滚动的问题
            $helper.on('mousewheel', function (e) {
                var scr_y = e.originalEvent.wheelDelta,
                    org_scr_y = $scroller.scrollTop();

                // 在 $helper 上滚动鼠标后，改变滚动条高度
                $scroller.scrollTop(org_scr_y - scr_y);
            });
        },

        _update_$helper: function (range) {
            if (this.o.$helper) {
                this.o.$helper.css({
                    left: range.x1 + 'px',
                    top: range.y1 + 'px',
                    width: range.x2 - range.x1 + 'px',
                    height: range.y2 - range.y1 + 'px'
                })
            }
        },

        _remove_$helper: function () {
            var o = this.o;
            if (o.$helper) {
                if ($.browser.msie) {
                    o.$helper.remove();
                } else {
                    o.$helper.fadeOut('fast', function () {
                        $(this).remove();
                    });
                }
                o.$helper = null;
            }
        },

        _fix_range: function (r) {
            var t, f = $.extend({}, r);
            // fix range
            if (f.x1 > f.x2) {
                t = f.x1;
                f.x1 = f.x2;
                f.x2 = t;
            }
            if (f.y1 > f.y2) {
                t = f.y1;
                f.y1 = f.y2;
                f.y2 = t;
            }
            return f;
        },

        _real_xy: function (list_par) {
            var me = this, o = me.o,
                $list_par = $(list_par),
                list_par_offs = $list_par.offset(),
                xy = {
                    x: (list_par_offs.left + o.$scroller.scrollLeft())/* + int_css($list_par, 'marginLeft')*/ + int_css($list_par, 'paddingLeft'),
                    y: (list_par_offs.top + o.$scroller.scrollTop())/* + int_css($list_par, 'marginTop')*/ + int_css($list_par, 'paddingTop')
                };

            return xy;
        },

        _toggle_text_select: function (enable) {
            var o = this.o;
            if (support_selectstart) {
                var ns = this._ns;

                if (enable === this._text_selectable)
                    return;

                var $body = $($doc[0].body),
                    selectstart = 'selectstart';

                if (enable) {
                    $body.off(selectstart + ns + '_select_text');
                } else {
                    $body.on(selectstart + ns + '_select_text', function (e) {
                        if ($(e.target).closest(o.keep_on_selector).length === 0) {
                            e.preventDefault();
                        }
                    });
                }

                this._text_selectable = enable;
            }
        },

        _before_start_select: function (e) {
            var me = this, o = me.o;
            if (o.before_start_select === default_ops.before_start_select || false !== o.before_start_select.call(me, e)) {
                return true;
            }
            return false;
        },

        _is_click_to_clear: function (e, $tar) {
            var me = this, o = me.o;

            // 按下ctrlKey/metaKey时，不清空
            if (is_multi_key(e))
                return false;

            // 点击在 $el 外部时，清除选中（默认行为）
            var in_el = !!$tar.closest(me._get_$els()).length;
            if (!in_el)
                return true;

            // 点击在 $el 外部时，清除选中（自定义判断条件）
            if (o.clear_on !== default_ops.clear_on && o.clear_on.call(me, $tar))
                return true;
        },

        _is_selectable: function (el_id) {
            return !(this.o.is_selectable !== default_ops.is_selectable && false === this.o.is_selectable.call(this, el_id));
        },

        _trigger_change: function (org_sel_id_map, sel_id_map) {
            var me = this,
                unsel_id_map = {};

            // 从 org_sel_id_map 中取得被取消选中的元素
            if (org_sel_id_map) {
                for (var el_id in org_sel_id_map) {
                    if (!(el_id in sel_id_map)) {
                        unsel_id_map[el_id] = 1;
                    }
                }
            }

            /*console.log('sel', $.map(sel_id_map, function (_, el_id) {
             return $('#' + el_id)[0]
             }));
             console.log('unsel', $.map(unsel_id_map, function (_, el_id) {
             return $('#' + el_id)[0]
             }));*/

            this.trigger('select_change', sel_id_map, unsel_id_map);
            this._org_sel_id_map = $.extend({}, sel_id_map);
        },

        _get_$els: function () {
            var o = this.o;
            return (o.get_$els !== $.noop && $.isFunction(o.get_$els)) ? o.get_$els.call(this) || $() : $(o.$el)
        },

        _is_conflicted: function () {
            var ins = SelectBox.instances,
                enab_ins = [];

            for (var i = 0, l = ins.length; i < l; i++) {
                if (ins[i]._enabled) {
                    enab_ins.push(ins[i]);
                }
            }
            if (enab_ins.length > 1) {
                console.warn('你是否忘记禁用前一个 SelectBox 实例了？ 已启用的 SelectBox 实例', $.map(enab_ins, function (inst) {
                    return inst.o.ns;
                }));
            }
            return false;
        }
    };

    /**
     * 取目标节点下第一个元素（为优化性能）
     * @param {jQuery} $els
     * @param {String} filter
     * @returns {Node}
     */
    var first_visible_child = function ($els, filter) {
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
    };

    var each_child_nodes = function (els, fn) {
        var s = 0;
        $.each(els, function (i, el) {
            $.each(el.childNodes, function (j, n) {
                if (n.nodeType === 1) {
                    fn.call(n, n, s++);
                }
            });
        });
    };

    var int_css = function ($el, attr_name) {
        return parseInt($el.css(attr_name)) || 0;
    };

    var out_size = function ($el) {
        return {
            width: $el.outerWidth() + int_css($el, 'marginLeft') + int_css($el, 'marginRight'),
            height: $el.outerHeight() + int_css($el, 'marginTop') + int_css($el, 'marginBottom')
        };
    };


    // 清空选中的文本
    var clear_text_sel = function (e) {
        // input、textarea 不清除选中
        if (!(e.target.tagName in inputs || document.activeElement && document.activeElement.tagName in inputs)) {
            _clear_text_sel();
        }
    };

    var inputs = { TEXTAREA: 1, INPUT: 1 };

    // 清除选中文本
    var _clear_text_sel = 'getSelection' in window ? function () {
        try {
            window.getSelection().removeAllRanges();   //从选区中移除所有的DOM范围
        }
        catch (e) {
        }
    } : function () {
        try {
            doc.selection.empty();   //IE、同上
        }
        catch (e) {
        }
    };

    var is_multi_key = function (e) {
        return e.ctrlKey || e.metaKey || e.shiftKey;
    };

    $.extend(SelectBox.prototype, events);

    return SelectBox;
});