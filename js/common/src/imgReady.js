define(function (require) {
    var functional = require('./util.functional'),
        console = require('lib').get('./console'),
        $ = require('$');
    var run = {
        list: [],
        intervalId: null,
        tick: function () {
            var list = run.list, i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            }
            if (!list.length) {
                run.stop();
            }
        },
        start: function () {
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (!this.intervalId) {
                this.intervalId = setInterval(this.tick, 40);
            }
        },
        stop: function () {
            this.list = [];
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    };
    /**
     * @param url 路径
     * @param file_id
     * @param {function} ready
     * @param {function} [load]
     * @param {function} error
     */
    var loader = function (url, file_id, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
        img.file_id = file_id;
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        }

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
                ) {
                ready.call(img);
                onready.end = true;
            }
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            load && load.call(img);

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            run.list.push(onready);
            run.start();
        }
    };

    var imgReady = function (o) {
        this.ns = o.ns;
        this.reset();
    };
    $.extend(imgReady.prototype, {
        /**
         * 重置
         */
        reset: function () {
            this.opt = {
                er_handler: function () {
                },
                ok_handler: function () {
                },
                IMG_THUMB_MAP: {//将要显示缩略图
                    length: 0,//总长度
                    CONNECT_NUM: 5,//每次可同时获取img的个数
                    DOING_NUM: 0,//正在获取链接的个数
                    PIPE_CACHE: [],//冗余数据
                    start_pos: 0
                },
                ID_URL_MAP: {}
            };
        },
        /**
         * 初始化
         * @param ok_fn
         * @param er_fn
         */
        render: function (ok_fn, er_fn) {
            this.destroy();
            this.opt.ok_handler = ok_fn;
            this.opt.er_handler = er_fn;
        },
        /**
         * 销毁初始化的信息 和 添加的请求信息
         */
        destroy: function () {
            this.reset();
            run.stop();
        },
        /**
         * 触发加载请求
         */
        start_load: function () {
            this._run_thumb();
        },
        /**
         * 添加将要显示的图片信息
         * @param {String} src 图片地址
         * @param {String} file_id 节点ID
         */
        add_thumb: function (src, file_id) {
            var opt = this.opt;
            opt.IMG_THUMB_MAP.PIPE_CACHE.push(file_id);
            opt.IMG_THUMB_MAP.length += 1;
            opt.ID_URL_MAP[file_id] = src;
        },
        /**
         * 优先加载
         * @param start_id 优先加载的位置起点id
         */
        priority_sort: function (start_id) {
            var opt = this.opt;
            var imap = opt.IMG_THUMB_MAP,
                len = imap.length;
            while (len) {
                len -= 1;
                if ( imap.PIPE_CACHE[len] === start_id ) {
                    imap.start_pos = len;
                    return;
                }
            }
        },
        /**
         * 处理加载结果
         * @param img 克隆img
         * @param file_id 文件id
         * @param is_ok 是否成功
         * @param width 宽度
         * @param height 高度
         * @private
         */
        _process_result: function (img, file_id, is_ok, width, height) {
            var opt = this.opt;
            if (img && img.src) {
                if (is_ok) {
                    opt.ok_handler.call(null, img, file_id, width, height);
                } else {
                    opt.er_handler.call(null, img, file_id);
                }
                opt.IMG_THUMB_MAP.DOING_NUM -= 1;
            }
            this._run_thumb();
        },
        /**
         * to load
         * @private
         */
        _run_thumb: function () {
            var me = this,
                opt = me.opt,
                diff = opt.IMG_THUMB_MAP.CONNECT_NUM - opt.IMG_THUMB_MAP.DOING_NUM;

            if (diff > 0 && opt.IMG_THUMB_MAP.length > 0) {
                var thumb, thumbs = me._batch_load(diff);
                while (thumb = thumbs.shift()) {
                    opt.IMG_THUMB_MAP.DOING_NUM += 1;
                    loader(thumb.url, thumb.id, function () {//ready
                        me._process_result($.clone(this), this.file_id, true, this.width, this.height);
                    }, null, function () {//error
                        me._process_result($.clone(this), this.file_id, false);
                    });
                }
            }
        },
        /**
         * batch load
         * @param _num
         * @returns {Array}
         * @private
         */
        _batch_load: function (_num) {
            var opt = this.opt;
            var map = opt.IMG_THUMB_MAP,
                num = _num,
                thumbs = [];
            if (map.length < num) {
                num = _num = map.length;
            }
            for (; num--; num > 0) {
                if (!map.PIPE_CACHE[map.start_pos]) {
                    map.start_pos = 0;
                }
                var id = map.PIPE_CACHE.splice(map.start_pos, 1)[0],
                    url = opt.ID_URL_MAP[id];
                thumbs.push({
                    'url': url,
                    'id': id
                });
                delete opt.ID_URL_MAP[id];
            }
            map.length -= _num;
            return thumbs;
        }
    });
    return {
        get_instance: function (opt) {
            return new imgReady(opt);
        }
    };
});