/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define(function (require, exports, module) {
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
                { remove: !!o.remove, share: !!o.share, download: !!o.download, code: !!o.code, zoomin: o.zoomin !== 'false', zoomout: o.zoomout !== 'false', match: o.match !== 'false', back: !!o.back, close: true }
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
	            view.invoke('image_state.close', [function() {
		            store.invoke('destroy');
		            options.close && options.close.call();
		            options = null;
                }]);
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
	        //放大
	        zoomin: function (e) {
		        if (typeof options.zoomin === 'function') {
			        options.zoomin.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.zoomin');
		        }
	        },
	        //缩小
	        zoomout: function (e) {
		        if (typeof options.zoomout === 'function') {
			        options.zoomout.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.zoomout');
		        }
	        },
	        //自适应
	        match: function (e) {
		        if (typeof options.match === 'function') {
			        options.match.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.match');
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
});