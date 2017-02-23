/**
 * @author trump
 * @date 2013-11-13
 */
define(function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),
        $win = $(window),
        $doc = $(document),
        $body = $('body'),
        _elem = document.documentElement,
        INPUT_TAG = ['input', 'textarea'],
        isIE6 = !-[1, ] && !('minWidth' in _elem.style),
        assistant = {
            isLoseCapture: 'onlosecapture' in _elem,
            isSetCapture: 'setCapture' in _elem,
            clearSelect: (function () {//清除选中
                if ('getSelection' in window) {
                    return function () {
                        window.getSelection().removeAllRanges();
                    }
                }
                return function () {
                    try {
                        document.selection.empty();
                    } catch (e) {
                    }
                }
            })(),
            intCss: function ($el, attr_name) {
                return parseInt($el.css(attr_name).replace('px')) || 0;
            },
            setHelper: function (e) {
                var ctx = dragRun.ctx,
                    $self = ctx.$self,
                    css = $self.position(),
                    $papa = $self.offsetParent(),
                    ost = $papa.position();

                //加上内边距
                css.top += this.intCss($self, 'padding-top');
                css.left += this.intCss($self, 'padding-left');

                //加上外层容器偏移量
                while ($papa.get(0)) {
                    if ($papa.get(0) === ctx.$parent.get(0)) {
                        ost = $papa.offset();//ctx.$parent must be have the static relative position
                        css.top = css.top - this.intCss($papa, 'padding-top') + $papa.scrollTop();
                        css.left = css.left - this.intCss($papa, 'padding-left') + $papa.scrollLeft();
                        break;
                    }
                    css.top  = css.top + $papa.scrollTop() + ost.top + this.intCss($papa, 'padding-top');
                    css.left = css.left + $papa.scrollLeft() + ost.left + this.intCss($papa, 'padding-left');
                    $papa = $papa.offsetParent();
                    ost = $papa.position();
                }

                //拖动元素相对定位
                ctx.$helpPosition = {
                    left: css.left,
                    top: css.top,
                    width: ctx.$help.width(),
                    height: ctx.$help.height()
                };

                //鼠标相对拖动元素的位置
                var m_left = e.clientX - ost.left + $papa.scrollLeft() - css.left,
                    m_top  = e.clientY - ost.top + $papa.scrollTop() - css.top;
                ctx.mouseStartPosition = {
                    left: m_left,
                    top: m_top,
                    bottom: ctx.$helpPosition.width - m_top,
                    right: ctx.$helpPosition.height - m_left
                };

                //定位拖动help的位置
                ctx.$help.css({
                    top: css.top,
                    left: css.left,
                    position: 'absolute',
                    zIndex: ctx.zIndex || 1
                });

            },
            addCursor: function (e) {
                var ctx = dragRun.ctx;

                ctx.$help.css('cursor', ctx.cursor);
                ctx.$help.find('*').css('cursor', ctx.cursor);

                //for ie
                var refer = $(e.srcElement);
                if (refer.get(0)) {
                    ctx._referItem = refer;
                    if (refer.css('cursor')) {
                        ctx._referCursor = refer.css('cursor');
                    }
                    ctx._referItem.css('cursor', ctx.cursor);
                }
            },
            delCursor: function () {
                var ctx = dragRun.ctx;
                if (ctx._referItem) {
                    ctx._referItem.css('cursor', ctx._referCursor);
                    delete ctx._referItem;
                }
            },
            getOffset: function () {
                var ctx = dragRun.ctx;
                return {
                    top: ctx.$helpPosition.top + ctx.ost.top,
                    left: ctx.$helpPosition.left + ctx.ost.left
                };
            },
            drag: {
                //X轴拖动
                toLeft: function (left, right) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        mouse = ctx.mouseStartPosition,
                        range = ctx.range;
                    if (left < mouse.left) {//贴左
                        pos.left = range.minX;
                    } else if (right < mouse.right) {//贴右
                        pos.left = range.maxX;
                    } else {
                        pos.left = Math.max(range.minX, Math.min(range.maxX, left - mouse.left));
                    }
                },
                //Y轴非滚动位移
                toTop: function (y, top, bottom) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        mouse = ctx.mouseStartPosition,
                        limit = ctx.innerArea ,
                        range = ctx.range;
                    if (top < mouse.top) {//贴上
                        pos.top = range.minY + limit.mScroll;
                    } else if (bottom < mouse.bottom) {//贴下
                        pos.top = limit.height - pos.height + limit.mScroll;
                    } else {
                        pos.top = Math.max(range.minY, Math.min(limit.height - pos.height + limit.mScroll, top - mouse.top + limit.mScroll));
                    }
                },
                scrollTop: function (y) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition,
                        range = ctx.range,
                        limit = ctx.innerArea;
                    var step = y > 0 ? limit.step : -limit.step;
                    if (pos.top + step > range.maxY) {
                        step = range.maxY - pos.top;
                    } else if (pos.top + step < range.minY) {
                        step = range.minY - pos.top;
                    }
                    ctx.$parent.scrollTop(ctx.$parent.scrollTop() + step);
                    pos.top += step;
                },
                //Y轴滚动位移
                toScrollTop: function (y, top, bottom) {
                    var ctx = dragRun.ctx ,
                        pos = ctx.$helpPosition ,
                        range = ctx.range,
                        mScroll = ctx.$parent.scrollTop();
                    if (( y > 0 && pos.top + pos.height > mScroll + ctx.innerArea.height )//向下滚动触动可视区域底端
                        ||
                        (y < 0 && mScroll > pos.top)    //向上滚动触动可视区域顶端
                        ) {
                        this.scrollTop(y);
                        return pos.top < range.maxY && pos.top > range.minY;//是否支持触底继续滚动
                    } else {
                        pos.top = Math.max(range.minY, Math.min(range.maxY, (top - ctx.mouseStartPosition.top + mScroll)));
                    }
                },
                auto: {
                    start: function (y) {
                        var me = this;
                        me.stop();
                        me.y = y;
                        me._autoScroll = setInterval(me.run, 15);
                    },
                    stop: function () {
                        var me = this;
                        if (me._autoScroll) {
                            clearInterval(me._autoScroll);
                            delete me._autoScroll;
                            delete me.y;
                        }
                    },
                    run: function () {
                        var ctx = dragRun.ctx ,
                            pos = ctx.$helpPosition,
                            range = ctx.range,
                            limit = ctx.innerArea ,
                            me = assistant.drag.auto;
                        if (!pos || !range || !limit) {
                            me.stop();
                            return;
                        }
                        assistant.drag.scrollTop(me.y);
                        ctx.$help.css(ctx.$helpPosition);
                        ctx.drag.call(ctx.$self.get(0), assistant.getOffset());
                        if (pos.top <= range.minY || pos.top >= range.maxY) {
                            me.stop();
                        }
                    }
                }
            }
        };

    var dragRun = {
            start: function (e) {
                var me = dragRun;
                assistant.clearSelect();
                $doc.on('mousemove', me.drag)
                    .on('mouseup', me.end)
                    .on('dblclick', me.end);
                me._sClientX = e.clientX;
                me._sClientY = e.clientY;
                if (!isIE6) {
                    assistant.isLoseCapture ? me.ctx.$help.on('losecapture', this.end) : $win.on('blur', this.end);
                }
                assistant.isSetCapture && me.ctx.$help.get(0).setCapture();
                me.doStart(e);
                return false;
            },
            doStart: function (e) {
                var ctx = this.ctx;
                ctx.start.call(ctx.$self.get(0), e, assistant.getOffset());
            },
            drag: function (e) {
                assistant.clearSelect();
                var me = dragRun,
                    limit = me.ctx.innerArea,
                    x = 0,//X轴上移动距离
                    y = 0;//Y轴上移动距离
                //检测X轴是否超出目标范围
                if (e.clientX <= limit.maxX && e.clientX >= limit.minX) {
                    x = e.clientX - me._sClientX;//X轴上移动距离
                }
                //检测Y轴是否超出目标范围
                if (e.clientY <= limit.maxY && e.clientY >= limit.minY) {
                    y = e.clientY - me._sClientY;//Y轴上移动距离
                }
                me._sClientX = e.clientX;
                me._sClientY = e.clientY;
                //存在有效移动时，call 拖动事件
                if (x || y) {
                    me.doDrag(e, x, y);
                }
                e.preventDefault();
            },
            doDrag: function (e, x, y) {
                var ctx = dragRun.ctx ,
                    limit = ctx.innerArea ,
                    left = e.clientX - limit.minX,
                    right = limit.maxX - e.clientX,
                    top = e.clientY - limit.minY,
                    bottom = limit.maxY - e.clientY,
                    touchWallAbleScroll;
                x !== 0 && assistant.drag.toLeft(left, right);
                if (y !== 0) {
                    touchWallAbleScroll = !ctx.scroll ? assistant.drag.toTop(y, top, bottom) : assistant.drag.toScrollTop(y, top, bottom);
                }
                //位置变化更新到页面
                ctx.$help.css(ctx.$helpPosition);
                //执行回调
                ctx.drag.call(ctx.$self.get(0), assistant.getOffset());
                if (touchWallAbleScroll) {//
                    assistant.drag.auto.start(y);
                } else {
                    assistant.drag.auto.stop();
                }
            },
            end: function (e) {
                var me = dragRun;
                $doc.off('mousemove', me.drag)
                    .off('mouseup', me.end)
                    .off('dblclick', me.end);
                if (!isIE6) {
                    assistant.isLoseCapture ? me.ctx.$help.off('losecapture', this.end) : $win.off('blur', this.end);
                }
                assistant.isSetCapture && me.ctx.$help.get(0).releaseCapture();
                me.doEnd(e);
                return false;
            },
            doEnd: function (e) {
                this.ctx.stop.call(this.ctx.$self.get(0), e, assistant.getOffset());
                this.destroy();
            },
            /**
             * 会话环境
             */
            ctx: {
            },
            /**
             * 初始化会话环境
             */
            setCtx: function ($self, watch, opt) {
                var ctx = this.ctx = $.extend({}, opt);
                ctx.$parent = ctx.$parent || $body;//拖动对象追加的位置
                ctx.zIndex = ctx.zIndex || 100;//拖动层的z-index
                ctx.cursor = ctx.cursor || 'move';//拖动时的鼠标样式
                ctx.ost = ctx.$parent.offset();//拖动元素父元素的位置属性
                if (ctx.helper) {
                    ctx.$help = ctx.helper.call($self.get(0)).appendTo(ctx.$parent);//拖动对象
                } else {
                    ctx.$help = $self;
                }
                ctx.$self = $self;//目标元素
                ctx.watch = watch;

                ctx.innerArea = {//父元素可视区域
                    minY: ctx.ost.top,
                    maxY: ctx.ost.top + ctx.$parent.height(),
                    minX: ctx.ost.left,
                    maxX: ctx.ost.left + ctx.$parent.width(),
                    width: ctx.$parent.width(),//可视区域宽度
                    height: ctx.$parent.height(),//可视区域高度
                    mScroll: ctx.$parent.scrollTop(),//可视区域滚动高度
                    step: 5//每次滚动距离
                };

                //拖动范围
                ctx.range = (typeof ctx.moveRange === 'function') ?
                    ctx.moveRange.call($self.get(0))
                    : {
                    minX: 0,
                    maxX: ctx.innerArea.width - ctx.$help.width(),
                    minY: 0,
                    maxY: ctx.innerArea.height - ctx.$help.height()
                };
            },
            /**
             * @param e {$.Event}
             * @param $self {jQuery}
             * @param opt {Object}
             * @param watch {watchEvent}
             * ---> opt(调用者输入项) ===
             * {
                 cursor: {in_String} || 'move',//拖动时的鼠标样式
                 zIndex: {in_Number} || 100,//拖动层的z-index
                 moveRange: {in_Function}, || $parent的可见区域
                 $parent: {in_jQuery} || $(document),//拖动对象追加的位置
                 childFilter: {in_String},//子元素匹配器用于指定是那些可以支持拖拽 (必选)
                 helper: {in_Function},//返回拖动对象的回调方法，其this指向当前选中的dom对象 (必选)
                 start: {in_Function},//拖动开始的回调方法 (必选)
                 drag: {in_Function},//拖动进行中的回调方法 (必选)
                 end: {in_Function}//拖动结束的回调方法 (必选)
         * }
             */
            run: function (e, $self, opt, watch) {
                if (!this.started) {
                    this.started = true;
                    this.setCtx($self, watch, opt);//设置会话环境
                    assistant.addCursor(e);//设置光标
                    assistant.setHelper(e);//初始化拖动对象
                    this.start(e);//开启拖动
                }
            },
            destroy: function () {
                assistant.delCursor();//重置光标
                if (this.ctx.helper) {
                    this.ctx.$help.remove();//销毁拖动元素
                }
                this.ctx.watch.destroy();
                this.ctx = {};
                this.started = false;
            }
        }
        ;

    var watchEvent = function (opt) {
        var me = this;
        (opt.$on || opt.$parent || $doc)
            .on('mousedown', opt.childFilter, function (e) {
                if($.inArray(e.target.tagName.toLowerCase(), INPUT_TAG) > -1) {//有输入框是进行输入操作就不需要移动了
                    return;
                }
                if (e.which === 1) {
                    me._down_start = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    me._can_run = true;
                    return false;
                }
            })
            .on('mousemove', opt.childFilter, function (e) {
                if (me._can_run) {
                    //范围内5像素移动，激活拖拽
                    if(me._down_start){
                        if( Math.abs(e.clientX - me._down_start.x) > 5 ||  Math.abs(e.clientY - me._down_start.y) > 5 ){
                            e.preventDefault();
                            dragRun.run(e, $(this), opt, me);
                        }
                    }
                }
            })
            .on('mouseup', opt.childFilter, function () {
                me._down_start = null;
                me._can_run = false;
            });
    };

    $.extend(watchEvent.prototype, {
        destroy: function () {
            this._can_run = false;
        }
    });
    return watchEvent;
})
;