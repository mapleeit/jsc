/**
 * @author trump
 * @date 2013-11-13
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        DragRun = common.get('./ui.dragRun'),
        dragRun,
        axis_map,
        drag_sort = {
            render: function (opt) {
                var me = this;
                if (me.timeoutid) {
                    clearTimeout(me.timeoutid);
                    me.timeoutid = null;
                }
                me.timeoutid = setTimeout(function () {
                    me._render_opt(opt);
                    me._render_map();
                    me._render_drag();
                }, 100);
            },
            /**
             * 初始化参数
             * @param opt
             */
            _render_opt: function (opt) {
                var me = this;
                me.opt = $.extend({
                    parent: null,//拖动外层(position:relative方便定位)
                    $el: null,//匹配元素的直接父元素
                    $scroller: '',//滚动条

                    child_filter: '',//元素匹配的过滤器
                    drag_class: '',//被拖动元素的样式
                    helper_class: '',//被拖动元素的辅助样式
                    left_class: '',//靠左样式
                    right_class: '',//靠右样式

                    width: 0,//元素宽度
                    height: 0,//元素高度
                    get_parent_all_height: $.noop,
                    get_helper: function ($item) {//获取辅助参数
                        return $item.clone().removeAttr('id');
                    },
                    success: $.noop//排序完成后的回调函数

                }, opt);
                me.opt.slide_class = me.opt.left_class + ' ' + me.opt.right_class;
            },
            /**
             * 初始化地图
             */
            _render_map: function () {
                var me = this;
                me.old_match = {
                    point: null,
                    left: false
                };
                if (!axis_map) {
                    axis_map = require('./axisMap').get_instance({
                        ns: 'photo_group',
                        $el: me.opt.$el,
                        $scroller: me.opt.$scroller,
                        child_filter: me.opt.child_filter,
                        container_width: function () {
                            return me.opt.$el.width();
                        }
                    });
                }
                axis_map.re_paint();
            },
            /**
             * 初始化拖拽
             */
            _render_drag: function () {
                if (!dragRun) {
                    var me = this;
                    dragRun = new DragRun({
                        scroll: true,//支持滚动条
                        moveRange: function () {//设置滚动范围
                            var height = me.opt.get_parent_all_height(),
                                pHeight = me.opt.parent.height();
                            height = height < pHeight ? (pHeight - me.opt.height -10) : height;
                            return {
                                minX: 0,
                                maxX: me.opt.parent.width() - me.opt.width - 10,
                                minY: 0,
                                maxY: height
                            };
                        },
                        childFilter: me.opt.child_filter,
                        start: function (e, offset) {
                            me._on_start.call(this, offset);
                        },
                        drag: function ( offset) {
                            me._on_drag.call(this, offset);
                        },
                        stop: function (e, offset) {
                            me._on_stop.call(this, e);
                        },
                        helper: function () {
                            return me.opt.get_helper($(this));
                        },
                        $parent: me.opt.parent
                    });
                }
            },

            /**
             * 添加靠右样式
             * @param point
             * @param except_id 排除坐标的id
             * @param them_class 靠边元素的样式
             * @param self_class 自身元素的样式
             */
            add_right_class: function (point, except_id, them_class, self_class) {
                var r_point = axis_map.get_right_point(point, except_id);
                if (r_point) {
                    $('#' + r_point.get_id()).addClass(them_class);
                }
                if (except_id !== point.get_id()) {
                    $('#' + point.get_id()).addClass(self_class);
                }
            },
            /**
             * 添加靠左样式
             * @param point
             * @param except_id 排除坐标的id
             * @param them_class 靠边元素的样式
             * @param self_class 自身元素的样式
             */
            add_left_class: function (point, except_id, them_class, self_class) {
                var l_point = axis_map.get_left_point(point, except_id);
                if (l_point) {
                    $('#' + l_point.get_id()).addClass(them_class);
                }
                if (except_id !== point.get_id()) {
                    $('#' + point.get_id()).addClass(self_class);
                }
            },
            /**
             * 移除样式
             * @param point
             * @param except_id
             * @param classs
             */
            remove_class: function (point, except_id, classs) {
                var r_point = axis_map.get_right_point(point, except_id);
                r_point && $('#' + r_point.get_id()).removeClass(classs);

                var l_point = axis_map.get_left_point(point, except_id);
                l_point && $('#' + l_point.get_id()).removeClass(classs);

                $('#' + point.get_id()).removeClass(classs);
            },
            /**
             * on start
             */
            _on_start: function (offset) {
                $(this).addClass(drag_sort.opt.drag_class);
            },
            /**
             * on drag
             * @param offset
             */
            _on_drag: function (offset) {
                var me = drag_sort,
                    new_match = axis_map.point_match(offset);
                if (me.old_match.point !== new_match.point || me.old_match.left !== new_match.left) {
                    //除旧
                    if (me.old_match.point) {
                        me.remove_class(me.old_match.point, this.id, me.opt.slide_class);
                    }
                    if(this.id !== new_match.point.get_id()){
                        //迎新
                        if (new_match.left) {//在匹配元素左边
                            var lp = axis_map.get_left_point(new_match.point);
                            if(!lp || lp.get_id() !== this.id){//左节点不是被拖动节点
                                me.add_left_class(new_match.point, this.id, me.opt.right_class, me.opt.left_class);
                            }
                        } else {//在匹配元素右边
                            var rp = axis_map.get_right_point(new_match.point);
                            if(!rp || rp.get_id() !== this.id){//右节点不是被拖动节点
                                me.add_right_class(new_match.point, this.id, me.opt.left_class, me.opt.right_class);
                            }
                        }
                    }
                }
                me.old_match = new_match;
            },
            /**
             * on stop
             * @param e
             */
            _on_stop: function (e) {
                var me = drag_sort,
                    $source = $(this).removeClass(me.opt.drag_class),
                    left = me.old_match.left,
                    point = me.old_match.point;
                if (point) {
                    me.remove_class(point, this.id, me.opt.slide_class);
                    if (point.get_id() !== this.id) {
                        me.opt.success(e, $source, $('#' + point.get_id()), left);
                    }
                }
                me.old_match = {
                    point: null,
                    left: false
                };
            }
        };

    return drag_sort;
});