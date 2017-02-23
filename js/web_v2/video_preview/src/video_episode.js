/**
 * Created by maplemiao on 2016/9/18.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        request = common.get('./request'),
        urls = common.get('./urls'),
	    https_tool = common.get('./util.https_tool'),
        mini_tip = common.get('./ui.mini_tip_v2');

    var loader = require('./loader'),
        cgi2file = require('./file.cgi2file'),
        tmpl = require('./tmpl'),
        get_real_down_url = require('./url.get_real_down_url'),
        login = require('./login'),
        dom = require('./dom');

    var UP_LIMIT_CACHE_COUNT = 50,
        PER_PAGE_COUNT = 6;

    return inherit(Event, {
        VIDEO_ID_ATTR_SELECTOR: 'data-video-id',
        VIDEO_INDEX_ATTR_SELECTOR: 'data-video-index',

        constructor: function (cfg) {
            $.extend(this, cfg);
            $.extend(this, dom);

            this.init();
        },

        init: function () {
            var me = this;

            me.store = []; // 数据模型，每个元素都是file object对象

            me._finishFlag = me.episodeInfo.finish_flag;

            me._bind_events();
            me._sync_data_init();
            me.syncVideoCount = me.store.length;
            me.videoCount = me.store.length;

            me.current = 0; // 目前剧集视口第一个视频在缓存中的索引值

            me._init_img_src();
            // 拉取有限条数据
            me._load_episode_gt_limit_count(UP_LIMIT_CACHE_COUNT)
                .done(function (msg, body) {
                    me._get_$video_list().css('width', me.videoCount * 160 + 'px');
                    me._init_li();
                    me._update_pre_next_btn_class();
                })
                .fail(function (err) {
                    mini_tip.warn('拉取剧集失败，请重试');
                });
        },

        /**
         * bind events
         * @private
         */
        _bind_events: function () {
            var me = this;

            // handle click <
            me._get_$pre_btn().on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!me._get_$pre_btn().hasClass('disable')) {
                    me.current -= PER_PAGE_COUNT;
                    me._update_pre_next_btn_class();
                    me._get_$video_list().css('left', '-' + me.current * 160 + 'px');
                }
            });

            // handle click >
            me._get_$next_btn().on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!me._get_$next_btn().hasClass('disable')) {
                    me.current += PER_PAGE_COUNT;
                    me._get_$video_list().css('left', '-' + me.current * 160 + 'px');
                    me._update_pre_next_btn_class();
                }
            });

            // handle click episode item
            me._get_$video_list().on('click', '.j-video-list-item-pic', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $target = $(e.target);
                var file = me.store[$target.closest('li').attr(me.VIDEO_INDEX_ATTR_SELECTOR)];
                var videoID = file.get_id();
                var dirKey = me.dirKey;

                // bug fix：解决切换到别的视频开始播放时，报错仍然不消失的问题
                me._get_$err().hide();

                // use history.pushState to change the url
                var params = urls.parse_params(location.href);
                params.videoID = videoID;
                history.pushState && history.pushState({videoID: videoID}, '', urls.make_url(location.pathname, params));

                me._get_$video_list().find('li').removeClass('act');
                $target.closest('li').addClass('act');

                loader.loadDownloadInfo(videoID, dirKey)
                    .done(function (msg, data) {
                        var downloadInfo = data && data.file_list && data.file_list[0];

                        // update
                        me.trigger('fileobjectchange', file);
                        me._get_$download_btn_size().text('下载(' + file.get_readability_size(true) + ')');

                        // update
                        me.trigger('downurlready', get_real_down_url(downloadInfo));

                        me._get_$video_player_title().text(file.get_name());
                        document.title = '微云视频-' + file.get_name();

                        // report success
                        logger.dcmdWrite([], 'video_preview_monitor', 0, 0);
                    })
                    .fail(function (err) {
                        me.trigger('error', err);
                    });
            });
        },

        /**
         * 更新剧集左右翻页按钮状态
         * @private
         */
        _update_pre_next_btn_class: function () {
            var me = this;
            if (me.current === 0) {
                me._get_$pre_btn().addClass('disable');
            } else {
                me._get_$pre_btn().removeClass('disable');
            }

            if (me.current + PER_PAGE_COUNT >= me.videoCount) {
                me._get_$next_btn().addClass('disable');
            } else {
                me._get_$next_btn().removeClass('disable');
            }
        },

        /**
         * 直出输出的li节点添加img标签，为了使img请求不堵塞正常请求
         * @private
         */
        _init_img_src: function () {
            var me = this;

            me._get_$video_list_item_array().map(function (index, item) {
                image_loader.load(https_tool.translate_cgi(me.store[index].get_thumb_url(320, 'http') + '/320'))
                    .done(function (imgEl) {
                        $(item).find(".j-video-list-item-pic")
                            .empty()
                            .append(imgEl);
                    })
                    .fail(function () {
                        $(item).find(".j-video-list-item-pic")
                            .empty()
                            .append('<img src="//qzonestyle.gtimg.cn/qz-proj/wy-pc/img/temp/video.png"/>');
                    });
            });
        },

        /**
         * 异步需要添加的li节点
         * @private
         */
        _init_li: function () {
            var me = this;

            var htmlString = '';
            for (var i = me.syncVideoCount; i < me.videoCount; i++) {
                var imgString = '';
                image_loader.load(https_tool.translate_cgi(me.store[i].get_thumb_url(320, 'http') + '/320'))
                    .done(function (imgEl) {
                        imgString = imgEl.outerHTML;
                    })
                    .fail(function () {
                        imgString = '<img src="//qzonestyle.gtimg.cn/qz-proj/wy-pc/img/temp/video.png"/>';
                    });
                htmlString += tmpl.episode_li({
                    id: me.store[i].get_id(),
                    videoIndex: i,
                    imgString: imgString,
                    videoTitle: me.store[i].get_name(),
                    videoSize: me.store[i].get_readability_size()
                });
            }
            me._get_$video_list().append(htmlString);

        },

        /**
         * 拉取略大于或等于上限数据量的剧集列表数据，存在store中
         * @private
         */
        _load_episode_gt_limit_count: function (limitCount) {
            var me = this;

            var def = $.Deferred();

            var _load = function () {
                loader.loadEpisode(me.dirKey, me.pdirKey)
                    .done(function (msg, body) {
                        var dirList = body.dir_list || [],
                            dirInfo = dirList[0] || {},
                            fileList = dirInfo.file_list || [];

                        me._finishFlag = dirInfo.finish_flag || true;
                        fileList.map(function (item, index) {
                            me.store.push(cgi2file(item));
                            me.videoCount = me.store.length;
                        });

                        if (me.videoCount < limitCount && !me._finishFlag) {
                            _load();
                        } else {
                            def.resolve({ret: 0, msg: 'success'}, me.store);
                        }
                    })
                    .fail(function (msg, err) {
                        me._finishFlag = true;
                        def.reject(err);
                    })
            };

            if (me.videoCount < limitCount && !me._finishFlag) {
                _load();
            } else {
                def.resolve({ret: 0, msg: 'success: no need to fetch through ajax'}, me.store);
            }

            return def;
        },

        /**
         * 对直出拉取的剧集进行缓存，放到数据模型中
         * @private
         */
        _sync_data_init: function () {
            var me = this;

            (me.episodeInfo.file_list || []).map(function (item, index) {
                me.store.push(cgi2file(item));
            });
        }
    });

});