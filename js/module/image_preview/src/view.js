/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define(function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),

        console = require('lib').get('./console'),
        functional = common.get('./util.functional'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),
        mode = require('./mode'),
        $win = $(window),
        $doc = $(document),
        wheel_event = $.browser.msie || $.browser.webkit ? 'mousewheel' : 'DOMMouseScroll',
        isIe6 = !-[1, ] && !('minWidth' in document.documentElement.style),
        undefined;
    var view = new mode({
        ns: 'view',
        watch_ns: ['store'],
        //可以展示的缩略图数目
        get_visible_size: function () {
            return Math.floor(( $win.width() - 2 * 52 ) / 72);
        },
        //show遮盖
        show_mask: function () {
            widgets.mask.always_styles({
                opacity: 0.9,//透明度
                bg_color: '#000'//背景色
            });
            widgets.mask.show('image_previewer', this.$view);
        },
        //hide遮盖
        hide_mask: function () {
            widgets.mask.remove_styles();
            widgets.mask.hide('image_previewer');
        },
        //渲染(ui、event)
        _render: {
            ie6: function () {
                if (isIe6) {
                    this.$view.repaint();
                }
            },
            activate: function () {
                var me = this;
                //只渲染一次
                if (!me._run_once) {
                    me._run_once = true;
                    me._render.once.call(me);
                }
                //监听重置窗口-->宽度变化，影响缩略图显示个数 / 调整预览图位置
                $win.on('resize.image_preview_view', functional.throttle(function () {
                    me.happen('window_resize');
                    me.image_state.location.call(me);
                    me._render.ie6.call(me);
                }, 100));
                //键盘快捷按键-->37:前,39:后,46:删除
                $doc.on('keyup.image_preview_view', function (e) {
                    e.preventDefault();
                    switch (e.which) {
                        case 37:
                            if (!me.children.$prev.hasClass('disable-prev')) {
                                me.happen('prev');
                            }
                            break;
                        case 39:
                            if (!me.children.$next.hasClass('disable-next')) {
                                me.happen('next');
                            }
                            break;
                        case 46:
                            me.happen('remove');
                            break;
                        case 27:
                            me.happen('destroy');
                            break;
                    }
                });
                //滚动快捷键-->向上：向前翻 ; 向下： 向后翻
                $doc.on(wheel_event + '.image_preview_view', function (e) {
                    if (!me._scroll_time || (+new Date() - me._scroll_time > 50)) {
                        if (((e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ? -1 : 1) === 1) {
                            if (!me.children.$next.hasClass('disable-next')) {
                                me.happen('next');
                            }
                        } else {
                            if (!me.children.$prev.hasClass('disable-prev')) {
                                me.happen('prev');
                            }
                        }
                    }
                    me._scroll_time = +new Date();
                });
            },
            deactivate: function () {
                $win.off('resize.image_preview_view');
                $doc.off('keyup.image_preview_view');
                $doc.off(wheel_event + '.image_preview_view');
            },
            once: function () {
                var me = this, $view = me.$view = $(tmpl.image_preview_box()).appendTo($('body')),
                    m = me.children = {
                        $big_img: $view.find('[data-id="big_img"]'),//大图容器
                        $expansion: $view.find('[data-id="expansion"]'),//缩略图开关按钮
                        $total_info: $view.find('[data-id="total-info"]'),//定位信息（第3/63张）
                        $list: $view.find('[data-id="img-thumbnail-list"]'), //缩略图列表容器
                        $content: $view.find('[data-id="img-thumbnail-content"]'), //缩略图内容容器
                        $prev_group: $view.find('[data-id="prev_group"]'),  //上一组缩略图
                        $next_group: $view.find('[data-id="next_group"]'),  //下一组缩略图
                        $prev: $view.find('[data-id="prev"]'),  //上一张图片按钮
                        $next: $view.find('[data-id="next"]'),  //下一张图片按钮
                        $loading: $view.find('[data-id="loading"]'), //加载图标

                        $back: $view.find('[data-id="back"]').hide(),//返回关闭
                        $download: $view.find('[data-id="download"]'),
                        $share: $view.find('[data-id="share"]'),
                        $remove: $view.find('[data-id="remove"]'),
                        $code: $view.find('[data-id="code"]')
                    };
                $view.on('click', '[data-id]', function (e) {
                    var $self = $(this) , id = $self.attr('data-id') , touch = true;
                    //退出、分享、删除、下载、二维码
                    if (me._render._ev_simple[id]) {
                        me.happen(id, e);
                    }
                    //前后图、前后组
                    else if (me._render._ev_limit[id]) {
                        if (!$self.hasClass('disable-next') && !$self.hasClass('disable-prev')) {
                            me.happen(id);
                        }
                    }
                    //收起、展开
                    else if (id === 'expansion') {
                        if ($self.hasClass('expansion_down')) {
                            m.$list.hide();
                            $self.removeClass('expansion_down').addClass('expansion_up');
                            me.happen('expansion_down');
                        } else {
                            m.$list.show();
                            $self.removeClass('expansion_up').addClass('expansion_down');
                            me.happen('expansion_up');
                        }
                    }
                    //选中某个图片
                    else if (id === 'pick') {
                        me.happen(id, ($self.attr('data-index') - 0));
                    } else {
                        touch = false;
                    }
                    //阻止默认行为、冒泡
                    if (touch) {
                        e.stopPropagation();
                        return false;
                    }
                });
            },
            _ev_simple: {'back': 1, 'destroy': 1, 'share': 1, 'remove': 1, 'download': 1, 'code': 1},
            _ev_limit: {'prev_group': 1, 'next_group': 1, 'prev': 1, 'next': 1}
        },
        //大图加载流程状态
        image_state: {
            //开始加载
            start: function (index) {
                var m = this.children;
                m.$loading.show();//显示loading图标
                m.$big_img.hide().empty();
            },
            //图片位置定位(支持重新调整位置)
            location: function (_$img, img_w, img_h ,noanimate) {
                var me = this, $img = _$img, h = img_h , w = img_w , win_h = $win.height() ,win_w = $win.width(), diff_h = 110 , diff_w = 120;
                if (!$img) {
                    $img = $(me.children.$big_img.find('img')[0]);
                    if (!$img.get(0)) {
                        return;
                    }
                    h = $img.attr('src_h') - 0;
                    w = $img.attr('src_w') - 0;
                }
                var rate = h / w , css = { height: h, width: w, marginBottom: isIe6 ? 45 : 30}, attr = {src_h: h, src_w: w};
                if (h > win_h - 116) {
                    css.height = win_h - 116;
                    css.width = css.height / rate;
                }
                if(css.width > win_w - diff_w){
                    css.width = win_w - diff_w;
                    css.height = css.width * rate;
                }
                if(noanimate){
                    $img.attr(attr).css(css);
                } else {
                    $img.attr(attr).animate(css, 'fast');
                }
                me._render.ie6.call(me);
            },
            //加载成功
            done: function (index, img, width, height) {//大图加载完成
                var me = this , child = me.children;
                child.$loading.hide();
                me.image_state.location.call(me, $(img).appendTo(child.$big_img.empty().show()), width, height ,true);
            },
            //加载失败
            error: function () {//大图加载失败
                var m = this.children;
                m.$loading.hide();
                m.$big_img.html(tmpl.error()).show();
            }
        },
        //缩略图加载流程状态
        thumb_state: {
            done: function (img, index) {
                this.children.$content.find('li[data-index="' + index + '"]').find('i').replaceWith(img);
            }
        },
        spec: function (args) {
            var m = this.children;
            //console.debug(args)
            m.$back.toggle(args.back);
            m.$remove.toggle(args.remove);
            m.$share.toggle(args.share);
            m.$code.toggle(args.code);
            m.$download.toggle(args.download);
        },
        //缩略图html结构
        _thumb: {
            _html: function (start, end) {
                var ary = [];
                for (var i = start; i < (end + 1); i++) {
                    ary.push(tmpl.thumb_instance(i));
                }
                return ary.join('');
            },
            _update: function (start) {
                var sibling = this.children.$content.find('li[data-index="' + start + '"]')[0];
                //遍历从指定位置遍历后面的元素，将data-index累积减一
                start -= 1;
                while (sibling) {
                    if (sibling.tagName && sibling.tagName.toLowerCase() === 'li') {
                        $(sibling).attr('data-index', start + '');
                        start += 1;
                    }
                    sibling = sibling.nextSibling;
                }
            },
            //新加一段区域的缩略图
            add: function (min, max) {
                var me = this , $content = me.children.$content;
                //first time
                if (!me.hasOwnProperty('from')) {
                    me.from = min;
                    me.to = max;
                    $content.append($(me._thumb._html(min, max)));
                    $content.css({marginLeft: 0});
                }
                //
                else {
                    if (max > me.to) {//后面插入
                        $(me._thumb._html(me.to + 1, max)).insertAfter($content.find('li[data-index="' + me.to + '"]'));
                    }
                    if (min < me.from) {//前面插入
                        $(me._thumb._html(min, me.from - 1)).insertBefore($content.find('li[data-index="' + me.from + '"]'));
                    }
                    //更新显示段落
                    me.from = Math.min(min, me.from);
                    me.to = Math.max(max, me.to);
                    //更新偏移量
                    $content.animate({marginLeft: -( min - me.from ) * 72}, 'fast');
                }
            },
            del: function (index) {
                this.children.$content.find('li[data-index="' + index + '"]').remove();
                this._thumb._update.call(this, index + 1);
                this.to -= 1;
            },
            destroy: function () {
                delete this.from;
                this.children.$content.empty();
            }
        },
        //store的响应事件
        store_watch: {
            //初始化
            init: function () {
                var me = this;
                me._render.activate.call(me);//a:事件、UI激活
                me.$view.show();//b:显示视图
                me.show_mask();//c:show mask
                me.children.$list.show();//d:恢复缩略图区域样式
                me.children.$expansion.removeClass('expansion_up').addClass('expansion_down');
            },
            //销毁
            destroy: function () {
                var me = this;
                me._render.deactivate.call(me);//a:事件、UI去激活
                me.$view.hide();//b:隐藏视图
                me.hide_mask();//c:hide mask
                me._thumb.destroy.call(me);//d:清空缩略图区域
            },
            //选中某数据项 ,更新按钮的可操作性
            selected: function (limit) {
                var m = this.children;
                m.$prev_group[limit.has_prev_group ? 'removeClass' : 'addClass']('disable-prev');//上一组缩略图
                m.$next_group[limit.has_next_group ? 'removeClass' : 'addClass']('disable-next');//下一组缩略图
                m.$prev[limit.has_prev ? 'removeClass' : 'addClass']('disable-prev')
                    .attr('title',limit.has_prev ? '上一张' : '已是第一张');  //上一张图片按钮
                m.$next[limit.has_next ? 'removeClass' : 'addClass']('disable-next')
                    .attr('title',limit.has_next ? '下一张' : '已是最后一张');  //下一张图片按钮
                if (limit.complete) {
                    m.$total_info.text('第' + (limit.index + 1) + '/' + (limit.max + 1) + '张');//更新浏览信息
                } else {
                    m.$total_info.text('第' + (limit.index + 1) + '张');//更新浏览信息
                }
                m.$content.find('.current').removeClass('current');
                m.$content.find('li[data-index="' + limit.index + '"]').find('a').addClass('current');//添加选中图标
            },
            //切换显示区域
            load_html: function (area) {
                this._thumb.add.call(this, area.min, area.max);
            },
            //删除
            remove: function (index) {
                this._thumb.del.call(this, index);
            }
        }
    });
    return view;
});