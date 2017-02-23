/**
 * Created by maplemiao on 2016/9/14.
 */

"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        logger = common.get('./util.logger');

    var dom = require('./dom');

    return inherit(Event, {
        constructor: function (cfg) {
            $.extend(this, cfg);
            $.extend(this, dom);

            this.init();
        },
        init: function () {
            var me = this;

            me._video_init();
            me._bind_events();
        },

        /**
         * 初始化视频播放
         * 1. 载入video.js库
         * 2. 载入播放源，开始播放
         * 3. trigger playerready
         * @private
         */
        _video_init: function () {
            var me = this;
            require('./library.video');
            // video.js plugin
            require('./video_plugin.volume_percent_display');
            require('./video_plugin.top_title');
            require('./video_plugin.bottom_mask');
            require('./video_plugin.dbclick_fullscreen');
            require('./video_plugin.replay_when_ended');

            // localize
            videojs.addLanguage('zh', {
                "Play": "播放",
                "Pause": "暂停",
                "Current Time": "当前时间",
                "Duration Time": "时长",
                "Remaining Time": "剩余时间",
                "Stream Type": "媒体流类型",
                "LIVE": "直播",
                "Loaded": "加载完毕",
                "Progress": "进度",
                "Fullscreen": "全屏",
                "Non-Fullscreen": "退出全屏",
                "Mute": "静音",
                "Unmute": "取消静音",
                "Playback Rate": "播放码率",
                "Subtitles": "字幕",
                "subtitles off": "字幕关闭",
                "Captions": "内嵌字幕",
                "captions off": "内嵌字幕关闭",
                "Chapters": "节目段落",
                "You aborted the media playback": "视频播放被终止",
                "A network error caused the media download to fail part-way.": "网络错误导致视频下载中途失败。",
                "The media could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载。",
                "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。",
                "No compatible source was found for this media.": "无法找到此视频兼容的源。",
                "The media is encrypted and we do not have the keys to decrypt it.": "视频已加密，无法解密。"
            });
            // initialize
            videojs('videoPlayer', {
                height: 573,
                width: 1020,
                controlBar: {
                    children: [
                        "playToggle",
                        "currentTimeDisplay",
                        "progressControl",
                        "durationDisplay",
                        "RemainingTimeDisplay",
                        "volumeMenuButton",
                        "fullscreenToggle"
                    ],
                    // After declaring children in the array, then specify
                    // further options for a child by referencing its name
                    volumeMenuButton: {
                        inline: false
                    }
                },
                controls: true,
                plugins: {
                    volumePercentDisplay: {
                        className: 'volume-percent-display'
                    },
                    topTitle: {
                        filename: me.filename,
                        selectorClass: 'j-video-player-title'
                    },
                    bottomMask: {
                        selectorClass: 'j-video-mask'
                    },
                    dbclickFullscreen: {},
                    replay: {}
                },
                inactivityTimeout: 2000
            }, function () {
                me.player = this;
                me.player.src([{
                    type: 'video/mp4',
                    src: me.downloadURL
                }]);
                me.player.play();

                me.trigger('playerready');

                // report success
                logger.dcmdWrite([], 'video_preview_monitor', 0, 0);
            });
        },

        _bind_events: function () {
            var me = this;

            me.on('playerready', function () {
                // 兼容上下mask无法点击控制play or pause的问题
                me.player.on('mousedown', function (e) {
                    var $target = $(e.target);

                    if ($target.closest('.vjs-control-bar').length) {
                        return;
                    }

                    var isMaskOrTitle = $target.closest('.j-video-mask').length || $target.closest('.video-title').length;
                    if (me.player.controls() && isMaskOrTitle) {
                        if (me.player.paused()) {
                            me.player.play();
                        } else {
                            me.player.pause();
                        }
                    }
                });

                // handle error
                me.player.on('error', function (e, msg) { // msg: custom trigger 'error' arguments
                    var errMsg = $(e.target).find('.vjs-modal-dialog-content').text() || msg;

                    // 如果已经存在错误信息，则不覆盖
                    me._get_$err_msg().text() || me._get_$err_msg().text(errMsg);
                    me._get_$err().show();
                });

                // remove button 'title' attr
                me.player.on('play', function () {
                    $(me.player.controlBar.playToggle.el_).removeAttr('title');
                });
                me.player.on('pause', function () {
                    $(me.player.controlBar.playToggle.el_).removeAttr('title');
                });
                $(me.player.controlBar.fullscreenToggle.el_).removeAttr('title');
                me.player.on('fullscreenchange', function () {
                    $(me.player.controlBar.fullscreenToggle.el_).removeAttr('title');
                });
            });
        }
    });
});