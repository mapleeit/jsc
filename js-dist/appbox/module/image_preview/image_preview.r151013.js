//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/image_preview/image_preview.r151013",["lib","common","$","downloader"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//image_preview/src/image_preview.js
//image_preview/src/mode.js
//image_preview/src/store.js
//image_preview/src/view.js
//image_preview/src/image_preview.tmpl.html

//js file list:
//image_preview/src/image_preview.js
//image_preview/src/mode.js
//image_preview/src/store.js
//image_preview/src/view.js
/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define.pack("./image_preview",["lib","common","./mode","./view","./store"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        common = require('common'),

        img_ready = common.get('./imgReady').get_instance({ns: 'image_preview'}),
        user_log = common.get('./user_log'),

        mode = require('./mode'),
        view = require('./view'),
        store = require('./store'),
        options,
        undefined;
    //记录缩略图加载情况->重试三次加载
    var thumbs = {
        _tid: null,
        init: function (total) {
            var me = this;
            me.total = total;
            me.len = 0;
            me.ok = {len: 0};
            me.er = {len: 0};
            if (me._tid) {
                clearTimeout(me._tid);
                me._tid = null;
            }
            me.load_time = 0;
        },
        add: function (is_ok, index ,src) {
            var me = this;
            if (is_ok) {
                me.ok[index] = true;
                me.ok.len += 1;
            } else {
                me.er[index] = src;
                me.er.len += 1;
            }
            me.len += 1;
            //缩略图加载完成，出现超过3次加载失败，重新加载这些失败的图片  ; 重复加载次数为2次
            if (me.len === me.total && me.load_time <= 2) {
                if (me.er.len > 0) {
                    if(!options.disable_reload_thumb){//禁止自动重试加载缩略图
                        console.debug('reload');
                        me.reload();
                    }
                }
            }
        },
        reload: function () {
            this._tid = setTimeout(function () {
                var me = thumbs;
                for(var key in me.er){
                    if(key !== 'len'){
                        img_ready.add_thumb(me.er[key] + '&reload=' + me.load_time, key);
                    }
                }
                me.len -= me.er.len;
                me.er = {len:0};
                me.load_time += 1;
                img_ready.start_load();
            }, 1500);
        }
    };
    var image_preview = new mode({
        watch_ns: ['view', 'store'],
        /**
         * 开始预览
         * @param o
         */
        start: function (o) {
            o.total = o.total || 1;
            options = o;
            store.invoke('init', [ o.total, o.index || 0, view.get_visible_size() , ( !o.hasOwnProperty('complete') || o.complete === true), o.images]);
            view.invoke('spec', [
                { remove: !!o.remove, share: !!o.share, download: !!o.download, code: !!o.code, back: !!o.back }
            ]);
        },
        //图片加载
        loader: {
            //图片加载成功
            on_ok: function (img, index, width, height) {
                //大图
                if (index.indexOf('_big') > 0) {
                    view.invoke('image_state.done', [index.replace('_big', '') - 0, img, width, height]);//开始预览指定图片
                }
                //缩略图
                else {
                    thumbs.add(true, index);
                    view.invoke('thumb_state.done', [img, index]);//开始预览指定图片
                }
            },
            //图片加载失败
            on_er: function (img, index) {
                //大图预览失败
                if (index.indexOf('_big') > 0) {
                    view.invoke('image_state.error');
                }
                //缩略图预览失败
                else {
                    thumbs.add(false, index , img.src);
                }
            },
            //加载大图
            // 恶心了一把离线文件比较特殊，目前还没有拉缩略图接口，所以还得使用老的方法以方法参数get_url,get_thumb_url传入
            image: function (index, src, is_gif) {
                var me = this,
                    id = index + '_big';
                view.invoke('image_state.start', [index]);//开始预览指定图片
                if(!src && options.get_url) {
                    src = options.get_url.call(me, index, options)
                } else {
                    src = src ? src + (is_gif ? '': (src.indexOf('?') > -1 ? '&' : '?') + 'size=1024*1024') : '';
                }
                if (src) {
                    img_ready.add_thumb(src, id);
                    img_ready.priority_sort(id);
                    img_ready.start_load();
                } else {
                    me.on_er(null, id);
                }
            },
            //加载缩略图
            thumb: function (index, src) {
                if(!src && options.get_thumb_url) {
                    src = options.get_thumb_url.call(this, index, options, 64);
                } else {
                    src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'size=64*64';
                }
                src && img_ready.add_thumb(src, index + '');
            }
        },
        store_watch: {
            //预览靠近边界时，执行回调
            touch_border: function () {
                var me = this;
                if (!me._request_border) {
                    me._request_border = true;
                    options.load_more(function (ret) {
                        me._request_border = false;
                        if (!ret.fail) {
                            store.invoke('adjust_entry', [ ret.complete , ret.total, ret.images ]);
                            options.images = ret.images;
                        } else {
                            console.debug('image_preview touch_border callback fail')
                        }
                    });
                }
            },
            //加载大图
            load_image: function (index, url, is_gif) {
                this.loader.image(index, url, is_gif);
            },
            //加载缩略图
            load_thumb: function (o, urls) {
                thumbs.init(o.max - o.min + 1);
                for (var i = o.min; i < (o.max + 1); i++) {
                    if(options.get_thumb_url) {
                        this.loader.thumb(i);
                    } else {
                        var file = options.images[i];
                        this.loader.thumb(i, urls[file.get_id()]);
                    }
                }
                img_ready.start_load();

            },
            //开始加载
            load_start: function () {
                img_ready.destroy();
                img_ready.render(this.loader.on_ok, this.loader.on_er);
            }
        },
        view_watch: {
            //销毁
            destroy: function () {
                user_log('IMAGE_PREVIEW_CLOSE');
                store.invoke('destroy');
                options.close && options.close.call();
                options = null;
            },
            //返回
            back: function () {
                user_log('IMAGE_PREVIEW_CLOSE');
                store.invoke('destroy');
                options.back && options.back.call();
                options = null;
            },
            //分享
            share: function (e) {
                if (options.share) {
                    user_log('IMAGE_PREVIEW_SHARE');
                    options.share.call(this, store.get_index(), e);
                }
            },
            //删除
            remove: function (e) {
                if (options.remove) {
                    user_log('IMAGE_PREVIEW_REMOVE');
                    var index = store.get_index();
                    options.remove.call(this, index, function () {
                        store.invoke('remove', [index]);
                    }, e);
                }
            },
            //下载
            download: function (e) {
                if (options.download) {
                    user_log('IMAGE_PREVIEW_DOWNLOAD');
                    options.download.call(this, store.get_index(), e);
                }
            },
            //二维码
            code: function (e) {
                if (options.code) {
                    user_log('IMAGE_PREVIEW_CODE');
                    options.code.call(this, store.get_index(), e);
                }
            },
            //选中
            pick: function (index) {
                user_log('IMAGE_PREVIEW_THUMB_PICK');
                store.invoke('pick', [index]);
            },
            //前一个图
            prev: function () {
                user_log('IMAGE_PREVIEW_NAV_PREV');
                store.invoke('prev');
            },
            //下一个图
            next: function () {
                user_log('IMAGE_PREVIEW_NAV_NEXT');
                store.invoke('next');
            },
            //前一个组
            prev_group: function () {
                user_log('IMAGE_PREVIEW_THUMB_PREV');
                store.invoke('prev_group');
            },
            //后一个组
            next_group: function () {
                user_log('IMAGE_PREVIEW_THUMB_NEXT');
                store.invoke('next_group');
            },
            //收起
            expansion_up: function () {
                user_log('IMAGE_PREVIEW_EXPANSION_UP');
            },
            //展开
            expansion_down: function () {
                user_log('IMAGE_PREVIEW_EXPANSION_DOWN');
            },
            //窗口宽度调整
            window_resize: function () {
                store.invoke('adjust_area', [view.get_visible_size(), true]);
            }
        }
    });
    return image_preview;
});/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define.pack("./mode",["$","lib","common"],function (require, exports, module) {
    var $ = require('$'),
        events = require('lib').get('./events'),
        event = require('common').get('./global.global_event').namespace('image_preview_event'),
        sub_mode = function (o) {
            var me = this;
            $.extend(me, o, events);
            if (me.watch_ns) {
                var len = me.watch_ns.length;
                while (len) {
                    len -= 1;
                    sub_mode.watch.call(me, me.watch_ns[len]);
                }
            }
        };
    sub_mode.watch = function (ns) {
        this.listenTo(event, ns, function () {
            var fn_name = Array.prototype.shift.call(arguments),
                match_name = ns + '_watch';
            if (this[match_name][fn_name]) {
                this[match_name][fn_name].apply(this, arguments);
            }
        });
    };
    $.extend(sub_mode.prototype, {
        get_ctx: function () {
            return this;
        },
        invoke: function (ns, args) {
            ns = ns.split('.');
            var ctx = this.get_ctx()[ns[0]];
            if (ctx) {
                args = args || [];
                if (typeof ctx === 'function') {
                    ctx.apply(this, args);
                } else if (ns[1] && typeof ctx[ns[1]] === 'function') {
                    ctx[ns[1]].apply(this, args);
                }
            }
        },
        happen: function () {
            Array.prototype.unshift.call(arguments, this.ns);
            event.trigger.apply(event, arguments);
        }
    });
    return sub_mode;
});/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define.pack("./store",["lib","./mode","downloader"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        mode = require('./mode'),
        thumb_url_loader = require('downloader').get('./thumb_url_loader'),
        history = {
            update: function (area) {
                this.from = area.min;
                this.to = area.max;
            },
            get_from: function () {
                return this.from;
            },
            get_to: function () {
                return this.to;
            },
            changed: function (area) {
                return (this.from !== area.min || this.to !== area.max);
            }
        },
        action = {
            destroy: function () {
                var me = this;
                me.entry = {};
                me.area = {};
                me.images = null;
                me.urls = null;
                me.happen('destroy');
            },
            /**
             * @param total 总数
             * @param curr 当前位置
             * @param area_size 显示区域大小
             * @param complete 是否已加载完成
             */
            init: function (total, curr, area_size, complete, images) {
                var me = this,
                    entry = me.entry = { max: total - 1, cur: curr, min: 0, complete: complete },
                    size = Math.min(entry.max, area_size - 1),
                    area = me.area = { min: entry.min, max: entry.min + Math.max(size, 0), size: size };
                if (curr > size) {
                    area.min = curr;
                    area.max = Math.min((curr + Math.max(size, 0) - (entry.complete ? 0 : 1)), entry.max);
                    if (area.max - area.min < size) {
                        area.min = Math.max(area.max - size, entry.min);
                    }
                }

                me.images = images;
                me.urls = {};
                history.update(area);
                me.happen('init', area);
                action.get_thumb_urls.call(me).done(function() {
                    me.change({ thumb: true, image: true });
                });
            },
            /**
             * 调整实体对象 外部触发
             * @param complete
             * @param total
             */
            adjust_entry: function (complete, total, images) {
                this.entry.complete = complete;
                this.entry.max = total - 1;
                this.fresh_ok = true;
                this.images = images;

                var me = this;
                //预先加载后面的100个url
                action.get_thumb_urls.call(me).done(function(urls) {
                    me.change({ thumb: true, urls: urls});
                });
            },
            /**
             * 窗口重置改变缩略图显示区域宽度
             * @param size
             */
            adjust_area: function (size) {
                var me = this, E = me.entry , max = E.max, min = E.min,
                    new_size = Math.min(max, size - 1), diff = new_size - me.area.size;
                //不具备伸缩性( 列表长度为1 or 新size和旧size一致 )
                if (max === min || diff === 0)
                    return;
                //以当前预览大图为中心点，左右伸缩/扩展，以entry为边界通过左右互补的方式处理溢出问题，
                var from = history.get_from(), to = history.get_to(), rate = (E.cur - from) / (to - from);
                from -= rate * diff;
                to += (1 - rate) * diff;

                if (from < min) {
                    to += min - from;
                    from = min;
                }
                if (to > max) {
                    diff = max - to;
                    to = max;
                    diff > from ? (from = min) : (from -= diff);
                }

                me.area = {
                    max: parseInt(to),
                    min: parseInt(from),
                    size: new_size
                };
                history.update(me.area);
                me.change({ thumb: true });
            },
            /**
             * 同步历史
             */
            _sync: function () {
                var me = this, area = me.area;
                if (history.changed(area)) {
                    area.max = history.get_to();
                    area.min = history.get_from();
                    me.change({ thumb: true});
                }

            },
            /**
             * prev
             */
            prev: function () {
                var me = this, entry = me.entry, is_prev_group = false;
                action._sync.call(me);
                if (entry.cur === history.get_from()) {
                    action.prev_group.call(me);
                    is_prev_group = true;
                }
                entry.cur -= 1;
                me.change({ image: true });
                if(!is_prev_group) {
                    action.load_more_thumb_urls_if.call(me);
                }
                history.update(me.area);
            },
            /**
             * next
             */
            next: function () {
                var me = this, entry = me.entry, is_next_group = false;
                if(this.loading_urls) {
                    return;
                }
                //不同时满足： 1:达到最大边界,2:数据还有更多,3:异步请求中
                if (entry.cur !== entry.max || entry.complete || me.fresh_ok) {
                    action._sync.call(me);
                    if (entry.cur === history.get_to()) {
                        action.next_group.call(me);
                        is_next_group = true;
                    }
                    entry.cur += 1;
                    me.change({ image: true });
                    if(!is_next_group) {
                        action.load_more_thumb_urls_if.call(me);
                    }
                    history.update(me.area);
                }
            },
            /**
             * 选中某个数据项
             * @param index
             */
            pick: function (index) {
                var me = this, entry = me.entry , area = me.area, is_next_group = false;
                //同一个位置，重新加载图片
                if (index === entry.cur) {
                    me.change({ image: true });
                } else {
                    //达到缩略图显示边界 : 移动到下一组，选中当前index
                    if (index > area.max) {
                        action.next_group.call(me);
                        is_next_group = true;
                    }
                    entry.cur = index;
                    if(!is_next_group) {
                        me.change({ image: true, thumb: true});
                        action.load_more_thumb_urls_if.call(me);
                    }

                }
                history.update(area);
            },
            /**
             * 上一组
             */
            prev_group: function () {
                var me = this, entry = me.entry, area = me.area;
                area.min = Math.max(area.min - area.size - 1, entry.min);
                area.max = Math.min(area.min + area.size, entry.max);
                action.get_thumb_urls.call(me).done(function() {
                    me.change({ thumb: true, image: true});
                });
            },
            /**
             * 下一组
             */
            next_group: function () {
                var me = this, entry = me.entry, area = me.area, size = area.size;
                //不同时满足： 1:达到最大边界,2:数据还有更多,3:异步请求中
                if (area.max !== entry.max || entry.complete || me.fresh_ok) {
                    area.max = Math.min(area.max + size + 1, entry.max);
                    area.min = Math.max(area.max - size, entry.min);
                    //可视区域已经达到边界,并且总数加载不全-->显示区域最大边界加1，并触发边界touch : 向前要一个位置，用于提醒用户，后面还有数据
                    if (area.max === entry.max && !entry.complete) {
                        area.min = Math.max(area.max - size - 1, entry.min);
                        area.max = entry.max - 1;
                        me.fresh_ok = false;
                        me.happen('touch_border');
                    } else {
                        action.get_thumb_urls.call(me).done(function() {
                            me.change({ thumb: true, image: true});
                        });
                    }

                }
            },
            /**
             * remove
             */
            remove: function (index) {
                var me = this, area = me.area, entry = me.entry;
                entry.max -= 1;
                if (area.max >= entry.max) {
                    area.max = entry.max;
                    area.min -= (area.min !== entry.min) ? 1 : 0;
                }
                entry.cur -= entry.cur > area.max ? 1 : 0;
                if (area.max < 0) {//没有任何图片
                    me.invoke('destroy');
                } else {
                    me.happen('remove', index);
                    action.get_thumb_urls.call(me).done(function() {
                        me.change({ thumb: true, image: true});
                    });

                }
                history.update(me.area);
            },
            /**
             * 判断是否可以去先加载url
             */
            load_more_thumb_urls_if: function() {
                var entry = this.entry,
                    area = this.area,
                    me = this;

                if(entry.cur + 4 > area.max || entry.cur - 4 < area.min) {
                    action.get_thumb_urls.call(this).done(function(urls) {
                        me.change({ thumb: true, image: true});
                    });
                }
            },

            /**
             * 加载url
             * @returns {*}
             */
            get_thumb_urls: function() {
                var area = this.area,
                    min = Math.max(area.min-20, 0),
                    max = area.max + 30,
                    def = $.Deferred(),
                    me = this;
                if(!this.images) {//离线文件不在这里加载缩略图url
                    def.resolve();
                    return def;
                }
                this.loading_urls = true;
                var images = this.images.slice(min, max);

                thumb_url_loader.get_urls(images).done(function(urls) {
                    $.extend(me.urls, urls);
                    def.resolve(urls);
                    me.loading_urls = false;
                });

                return def;
            }
        };

    return new mode({
        ns: 'store',
        /**
         * @override
         */
        get_ctx: function () {
            return action;
        },
        change: function (o) {
            var me = this, entry = me.entry , cur = entry.cur , area = me.area, urls = me.urls;
            //-->1:加载大图
            if (o.image) {
                var file_id = me.images && me.images[me.entry.cur].get_id();
                var is_gif = me.images && me.images[me.entry.cur].get_type() === 'gif';
	            me.happen('load_start');
                me.happen('load_image', me.entry.cur, urls[file_id], is_gif);
            }
            //-->2:缩略图html结构,加载缩略图
            if (o.thumb) {
                me.happen('load_html', me.get_area());
                me.happen('load_start');
                me.happen('load_thumb', me.get_area(), urls);
            }

            //-->3:选中预览的图片/view页面限制条件
            me.happen('selected', {
                index: cur,
                max: entry.max,
                has_prev: cur !== entry.min,
                has_next: cur !== entry.max || !entry.complete,
                has_prev_group: area.min > entry.min,
                has_next_group: (area.max < entry.max) || !entry.complete,
                complete: entry.complete
            });
        },
        /**
         * view可视区域
         * @returns {{min: int, max: int}}
         */
        get_area: function () {
            var area = this.area, entry = this.entry;
            return {
                min: area.min,
                max: area.max >= entry.max ? area.max : area.max + 1
            };
        },
        /**
         * 当前正在预览的位置
         * @returns {int}
         */
        get_index: function () {
            return this.entry.cur;
        }
    });
});/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define.pack("./view",["common","$","lib","./tmpl","./mode"],function (require, exports, module) {
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
//tmpl file list:
//image_preview/src/image_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'image_preview_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div data-no-selection class="viewer" style="z-index: 999;">\r\n\
        <div class="preview-back"><a data-id="back" class="pvb-btn" href="#"></a></div>\r\n\
        <div class="viewer-header">\r\n\
            <!-- 关闭按钮 -->\r\n\
            <a data-id="destroy" class="viewer-close" hidefocus="true" href="#">×</a>\r\n\
        </div>\r\n\
        <table class="img-viewer">\r\n\
            <tbody><tr>\r\n\
                <td class="viewer-inner" data-id="big_img"></td>\r\n\
            </tr>\r\n\
            </tbody></table>\r\n\
        <!-- 图片预览控制\r\n\
        <div>            -->\r\n\
            <div style="margin-bottom: 0px;" class="viewer-info ui-pos">\r\n\
                <div class="bar-top">\r\n\
                    <!--展开：expansion_down，收起：expansion_up-->\r\n\
                    <a href="#" class="expansion expansion_up" data-id="expansion"><i></i><span data-id="total-info" class="viewer-info-text">第3/63张</span></a>\r\n\
                    <div class="viewer-info-action ui-pos-right">\r\n\
                        <a data-id="download" class="viewer-download" href="#"><i></i></a><!--快捷按钮 下载-->\r\n\
                        <a data-id="share" class="viewer-share" href="#"><i></i></a><!--快捷按钮 分享-->\r\n\
                        <a data-id="remove" class="viewer-del" href="#" style=""><i></i></a><!--快捷按钮 删除-->\r\n\
                        <a data-id="code" class="viewer-code" href="#" style=""><i></i></a><!--快捷按钮 二维码-->\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="img-thumbnail-list" data-id="img-thumbnail-list" style="display:none;">\r\n\
                    <!--翻页不可用时加：disable-prev-->\r\n\
                    <a data-id="prev_group" href="#" class="list-prev disable-prev"></a>\r\n\
                    <div class="img-thumbnail-content">\r\n\
                        <ul data-id="img-thumbnail-content"></ul>\r\n\
                    </div>\r\n\
                    <!--翻页不可用时加：disable-next-->\r\n\
                    <a data-id="next_group" href="#" class="list-next"></a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!--翻页不可用时，加上 disable-next disable-prev-->\r\n\
            <a data-id="prev" class="viewer-prev disable-prev" title="上一张" href="#"></a>\r\n\
            <a data-id="next" class="viewer-next" title="下一张" href="#"></a>\r\n\
        <!--</div>                                            -->\r\n\
        <div data-id="loading" class="viewer-loading" style="display: none;"></div>\r\n\
    </div>');

return __p.join("");
},

'thumb_instance': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li  data-index="');
_p(data);
__p.push('" data-id="pick"><a href="#" class="img-error"><i></i></a></li>');

return __p.join("");
},

'error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <i class="loading-img-error"></i>');

return __p.join("");
}
};
return tmpl;
});
