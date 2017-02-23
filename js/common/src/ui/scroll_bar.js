/**
 * 滚动条
 * User: trumpli
 * Date: 13-12-26
 * Time: 上午11:51
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        pop_panel = require('./ui.pop_panel'),
        dragRun = require('./ui.dragRun'),
        tmpl = require('./tmpl'),
        hover_class = 'bar-hover',//滚动条聚焦样式
        isIE6 = !-[1, ] && !('minWidth' in document.documentElement.style),
        wheel_event = $.browser.msie || $.browser.webkit ? 'mousewheel' : 'DOMMouseScroll';
    /**
     * @param o {$parent: xxx, style: xxx || 'ios' （默认ios）}
     */
    var scroll_bar = function (o) {
        this.o = {
            style: !o.style ? 'ios' : o.style,//显示风格 默认ios风格
            $parent: $(o.$parent),//依附元素
            step: 15,//滑轮滚动单次移动距离（单位:dpi）
            $scroll: $(tmpl.g_scrollbar()).appendTo(o.$parent)//滚动条
        };
        this.render_wheel().render_mouse().render_hover().sync();
    };
    //get
    $.extend(scroll_bar.prototype, {
        /**
         * 返回滚动条对象
         * @returns {jQuery}
         */
        get_$scroll: function () {
            return this.o.$scroll;
        },
        /**
         * 拖动对象
         * @returns {jQuery}
         */
        get_$drager: function () {
            return this.o._$drager || (this.o._$drager = this.get_$scroll().find('[data-action="dragger"]'));
        },
        /**
         * 拖动对象条
         * @returns {jQuery}
         */
        get_$drager_bar: function () {
            return this.o._$drager_bar || (this.o._$drager_bar = this.get_$scroll().find('[data-action="bar"]'));
        },
        /**
         * 依附元素
         * @returns {jQuery}
         */
        get_$attach: function () {
            return this.o.$parent;
        },
        /**
         * 依附元素页面范围
         * @returns {Object}
         */
        get_$attach_range: function () {
            var me = this,
                ost = me.get_$attach().offset();
            return {
                x1: ost.left,
                x2: ost.left + me.get_$attach().width(),
                y1: ost.top,
                y2: ost.top + me.get_$attach().height()
            };
        },
        /**
         * @returns {jQuery}
         */
        get_$attach_body: function () {
            if (!this.o.$attach_body) {
                this.o.$attach_body = $(this.get_$attach().children()[0]).css('position', 'absolute');
                this.get_$attach().css('overflow', 'hidden');
            }
            return this.o.$attach_body;
        },
        /**
         * 依附元素的 实际高度
         * @returns {Number}
         */
        get_all_height: function () {
            return this.get_$attach_body().height();
        },
        /**
         * 依附元素的 可见高度
         * @returns {Number}
         */
        get_see_height: function () {
            return this.get_$attach().height();
        },
        /**
         * 滚动条和依附元素的高度比率
         * @returns {float}
         */
        get_rate: function () {
            return this.o.rate;
        },
        /**
         * 滚动条最小滚动top
         * @returns {Number}
         */
        get_scroll_max_top: function () {
            return this.o.scroll_max_top;
        },
        /**
         * 支持仅在悬浮、拖动滚动条时，才显示滚动条
         * @returns {Boolean}
         */
        support_hover: function () {
            return this.o.style === 'ios';
        }
    });
    //渲染、滚动
    $.extend(scroll_bar.prototype, {
        //隐藏滚动条
        real_hide: function () {
            this.state = 'hide';
            this.get_$scroll().hide();
        },
        //显示滚动条
        real_show: function () {
            this.state = 'show';
            this.get_$scroll().show();
        },
        //滚动条聚焦
        scroll_focus: function () {
            this.get_$drager_bar().addClass(hover_class);//添加悬浮滚动条样式
        },
        //滚动条失焦
        scroll_blue: function () {
            this.get_$drager_bar().removeClass(hover_class);//移除悬浮滚动条样式
        },
        /**
         * 鼠标拖动事件
         */
        render_mouse: function () {
            var me = this , start;
            new dragRun({
                $on: me.get_$drager(),
                $parent: me.get_$scroll(),
                cursor: 'pointer',
                start: function () {
                    me.drag_ing = true;//正在拖动滚动条
                    me.scroll_focus();
                    if (me.support_hover()) {
                        me.scroll_hover.disable();
                    }
                    start = me.get_$scroll().offset().top;
                },
                drag: function (ost) {
                    me.absolute_go(ost.top - start);
                },
                stop: function (e, ost) {
                    me.absolute_go(ost.top - start);
                    me.scroll_blue();
                    me.drag_ing = false;//木有正在拖动滚动条
                    if (me.support_hover()) {
                        me.scroll_hover.enable(e);
                        //鼠标不在依附范围内，隐藏滚动条
                        var range = me.get_$attach_range();
                        if (e.clientX < range.x1 || e.clientX > range.x2 || e.clientY < range.y1 || e.clientY > range.y2) {
                            me.real_hide();
                        }
                    }
                }
            });
            return me;
        },
        /**
         * 鼠标滑动事件
         */
        render_wheel: function () {
            var me = this;
            me.get_$attach().on(wheel_event, function (e) {
                if (me.o.able_scroll) {
                    me.relative_go(me.o.step * ((e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ? -1 : 1));
                    return false;
                }
            });
            return me;
        },
        /**
         * 鼠标进入依附区域
         */
        render_hover: function () {
            var me = this;
            if (me.support_hover()) {
                me.scroll_hover = new pop_panel({
                    host_$dom: me.get_$attach_body(),
                    $dom: me.get_$scroll(),
                    show: function () {
                        if (me.o.able_scroll) {
                            me.real_show();
                        }
                    },
                    hide: function () {
                        me.real_hide();
                    },
                    delay_time: 300
                });
            }
            if(!isIE6){
                me.get_$drager()
                    .on('mouseenter',function () {
                        me.scroll_focus();
                    }).on('mouseleave', function () {
                        if (!me.drag_ing) {//弹层可用时,退出聚焦状态
                            me.scroll_blue();
                        }
                    });
            }
            return me;
        },
        /**
         * @param top 滚动条距顶部高度
         */
        go: function (top) {
            var me = this, b_top = -top / me.get_rate();
            //变更位置
            me.get_$drager().css('top', top);
            me.get_$attach_body().css('top', b_top);
            //触发事件
            this.trigger('scroll', { top: -b_top });//滚动事件
            if (top >= this.get_scroll_max_top()) {
                this.trigger('reach_bottom');//滚动到达底部
            }
        },
        /**
         * 增量滚动
         * @param inc 增量变化
         */
        relative_go: function (inc) {
            this.go(Math.max(0, Math.min(parseInt(this.get_$drager().css('top')) + inc, this.get_scroll_max_top())));
        },
        /**
         * 直接滚动到指定位置
         * @param y
         */
        absolute_go: function (y) {
            this.go(Math.max(0, Math.min(y, this.get_scroll_max_top())));
        }
    });
    //对外暴露方法
    $.extend(scroll_bar.prototype, {
        _sync: function () {
            var me = this,
                all_h = me.get_all_height(),//可见高度
                see_h = me.get_see_height(),//实际高度
                diff = see_h - all_h;
            if (me.o.able_scroll = ( diff < 0 )) {//需要滚动条
                me.o.rate = see_h / all_h;//依附的可见区间和总区间比率
                var scroll_h = me.o.rate * see_h,//滚动条高度
                    top = Math.max(parseInt(me.get_$attach_body().css('top')) || me.get_$attach_body().position().top, diff);//$attach body 偏移量
                me.o.scroll_max_top = Math.floor(see_h - scroll_h);//滚动条最大向下滚动距离 (类型: int，单位: dpi)
                me.get_$drager().height(scroll_h);
                if(isIE6){
                    me.get_$drager().repaint();
                }
                me.absolute_go(-me.o.rate * top);
                !me.support_hover() && me.real_show();
            } else {
                me.get_$attach_body().css('top', me.get_$attach_body().position().top);
                me.real_hide();
            }
        },
        /**
         * 滚动元素的高度/形状发生改变时，call同步方法，同步到滚动条上
         */
        sync: function () {
            var me = this;
            if (me.sync_tid) {
                clearTimeout(me.sync_tid);
                me.sync_tid = null;
            }
            me.sync_tid = setTimeout(function () {
                me._sync();
            }, 100);
            return me;
        },
        /**
         * 滚回顶部
         */
        top: function () {
            this.go(0);
        },
        /**
         * 滚回底部
         */
        bottom: function () {
            this.go(this.get_scroll_max_top());
        }
    }, events);

    return scroll_bar;
});
