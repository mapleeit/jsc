/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define(function (require, exports, module) {
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
});