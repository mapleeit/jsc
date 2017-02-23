/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define(function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        tmpl    = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    function toMMSS(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    var video = new Module('outlink.video', {

        play: function(file, extra) {
            if(this._rendered) {
                return;
            }

            var me = this;
            var time = file.get_duration() / 1000;
            var minutes_3 = 3*60;
            if(time > minutes_3) {
                time = minutes_3;
            }
            this.$ct = $(tmpl.video({
                title: file.get_name(),
                file_size: file.get_size(),
                time: toMMSS(time),
                poster: file.get_video_thumb(1024),
                video_src: extra.video_src
            })).appendTo(document.body);

            this.bind_events(file);
            this._rendered = true;

            return this;
        },

        bind_events: function(file) {
            var me = this;
            this.$ct.on(target_action, '[data-action=save]', function(e) {
                me.trigger('action', 'save', [file], e);
            }).find( '[data-action=close]').on(target_action, function(e) {
                me.trigger('exit');
            });

            var is_play_start = false;

            var $video_elem = this.$ct.find('[data-id=video_elem]');

            $video_elem.css('maxHeight', $(window).height() - 180);
            this.$ct.show();
            $video_elem.on('play', function(e) {
                is_play_start = true;
            }).on('error', function(e) {
                if(browser.android && is_play_start || browser.IOS) {
                    //widgets.reminder.error('播放失败，请重试。');
                    logger.report('weiyun_video', {
                        file_id: file.get_id(),
                        file_name: file.get_name(),
                        msg: 'error'
                    });
                }
            }).on('stalled', function(e) {
                if(browser.android && is_play_start || browser.IOS) {
                    //widgets.reminder.error('视频加载失败，请重试。');
                    logger.report('weiyun_video', {
                        file_id: file.get_id(),
                        file_name: file.get_name(),
                        msg: 'stalled'
                    });
                }
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
        }
    });

    return video;

});