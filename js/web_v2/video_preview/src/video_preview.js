/**
 * Created by maplemiao on 2016/9/8.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var events = lib.get('./events'),
        session_event = common.get('./global.global_event').namespace('session'),
        logger = common.get('./util.logger'),
        File = common.get('./file.file_object');

    var VideoController = require('./video_controller'),
        VideoEpisode = require('./video_episode'),
        cgi2file = require('./file.cgi2file'),
        get_real_down_url = require('./url.get_real_down_url'),
        login = require('./login'),
        dom = require('./dom');

    return {
        init: function (data) {
            var me = this;

            $.extend(me, events);
            $.extend(me, dom);

            me.episodeInfo = data.episodeInfo || {}; // 直出时拉取的剧集数据
            me.downloadInfo = data.downloadInfo || {};
            me.videoInfo = data.videoInfo || {};
            me.dirKey = data.dirKey || '';
            me.pdirKey = data.pdirKey || '';
            me.videoID = data.videoID || '';
            me.filesize = data.filesize;
            me.filename = data.filename;

            me.fileObject = cgi2file(me.videoInfo);
            me.downloadURL = get_real_down_url(me.downloadInfo);

            // 将www.weiyun.com => weiyun.com，与web2.cgi.weiyun.com能够无碍通信
            // noinspection JSAnnotator
            document.domain = 'weiyun.com';

            me.videoController = new VideoController({
                downloadURL: me.downloadURL,
                filename : me.filename
            });
            me.videoEpisode = new VideoEpisode({
                dirKey: me.dirKey,
                pdirKey: me.pdirKey,
                episodeInfo : me.episodeInfo
            });

            me._bind_events();
            me._handle_sub_module();
        },

        /**
         * 处理子模块事件
         * @private
         */
        _handle_sub_module: function () {
            var me = this;

            me.videoEpisode.on('fileobjectchange', function (file) {
                me.fileObject = file;
            });

            me.videoController.on('playerready', function (e) {
                var player = me.videoController.player;

                // 当更换视频的时候，准备好更换的url之后执行
                me.videoEpisode.on('downurlready', function (downloadURL) {
                    me.downloadURL = downloadURL;

                    player.src(me.downloadURL);
                    player.load();
                    player.play();
                });

                // 处理点击下方视频列表时产生的报错
                me.videoEpisode.on('error', function (err) {
                    player.error({
                        code: err.ret,
                        message: err.msg,
                        custom: true,
                        from: 'episode'
                    });
                });

                // 错误上报
                player.on('error', function (e) {
                    var err = player.error_;
                    me._error_report(err, player);
                });

                // 预先过滤一下播放的视频格式是否支持，如果不支持的话就直接弹出报错
                var support_video_ext = ['mov', 'mkv', 'mp4', 'webm'];
                if (me.fileObject.get_name() && support_video_ext.indexOf(File.get_ext(me.fileObject.get_name())) === -1) {
                    player.error({
                        code: 4002,
                        message: '不支持播放该格式的视频，请您下载之后观看。',
                        custom: true,
                        from: 'pre-filter-format',
                        ext: File.get_ext(me.fileObject.get_name())
                    });
                }
            })
        },

        /**
         * bind events
         * @private
         */
        _bind_events: function () {
            var me = this;

            // download button click
            me._get_$download_btn().on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                location.href = me.downloadURL;
            });

            // share button click
            me._get_$share_btn().on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                require.async('share_enter', function (mod) {
                    var share_enter = mod.get('./share_enter');
                    share_enter.start_share([me.fileObject]);
                })
            });

            // error action text click
            // 有些错误需要有动作发起，如登陆，reload等
            if (!(me._get_$err().css('display') === 'none')) {
                me._get_$err_action().on('click', function (e) {
                    switch (me._get_$err_action().attr('data-action')) {
                        case 'reload':
                            location.reload();
                            break;
                        case 'login':
                            login();
                            break;
                        case 'none':
                            e.preventDefault();
                            e.stopPropagation();
                            break;
                        default:
                            e.preventDefault();
                            e.stopPropagation();
                    }
                });
            }

            // alert the login modal when session invalid
            session_event.on('session_timeout', function () {
                login();
            })
        },

        /**
         * unbind events
         * @private
         */
        _off_events: function () {
            var me = this;

            me._get_$download_btn().off('click');
            me._get_$share_btn().off('click');
            me._get_$err_action().off('click');
            session_event.off('session_timeout');
        },

        /**
         * 错误上报
         * @param err
         * @param player
         * @private
         */
        _error_report: function (err, player) {
            var me = this;

            // report dc && md
            var console_log = [];

            // trigger custom error
            if (err.custom) {
                console_log.push(
                    '【触发自定义错误：】',
                    'error --------> url location href:' + location.href,
                    'error --------> user agent:' + navigator.userAgent,
                    'error --------> code:' + err.code,
                    'error --------> message:' + err.message,
                    'error --------> from:' + err.from
                );
                // 后台返回异常值统一算成失败
                err.result = 1;
                if (err.ext) {
                    console_log.push('error --------> ext:' + err.ext);
                    console_log.push('注意：经过pre-filter-format之后的报错还会触发一次播放器内部错误。');
                    // 逻辑失败
                    err.result = 2;
                }
            } else {
                console_log.push(
                    '【触发播放器内部错误：】',
                    'url INFO',
                    'error --------> url location href:' + location.href,
                    'browser INFO',
                    'error --------> user agent:' + navigator.userAgent,
                    'video INFO',
                    'error --------> video name:' + me.fileObject.get_name(),
                    'error --------> video pid:' + me.fileObject.get_pid(),
                    'error --------> video id:' + me.fileObject.get_id(),
                    'error --------> video sha:' + me.fileObject.get_file_sha(),
                    'error --------> video md5:' + me.fileObject.get_file_md5(),
                    'error --------> video size:' + me.fileObject.get_readability_size(),
                    'error --------> video ext format:' + File.get_ext(me.fileObject.get_name()),
                    'player INFO',
                    'error --------> player src:' + player.cache_.src,
                    'error --------> player tech:' + player.techName_,
                    'error --------> player type:' + player.currentType_,
                    'error --------> player language:' + player.language(),
                    'error --------> player current time:' + player.currentTime(),
                    'error INFO',
                    'error --------> error code:' + err.code,
                    'error --------> error message:' + err.message
                );
                // 逻辑失败
                err.result = 2;
            }

            console_log.push(
                '【错误类型】',
                'err result: ' + err.result,
                '【注意】0为成功，1为失败，2为逻辑失败'
            );

            logger.dcmdWrite(console_log, 'video_preview_monitor', err.code, err.result);
        }
    };
});