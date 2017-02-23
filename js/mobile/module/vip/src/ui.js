/**
 * vip ui module
 * @author : maplemiao
 * @time : 2016/8/10
 **/

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        store = require('./store');
        
    var Module = lib.get('./Module'),

        undefined;
        
    var ui = new Module('ui', {
        render: function () {
            var me = this;
            if(store.is_grow()) {
                me.set_avatar_center();
            } else {
                me.show_growth();
            }
            me._bind_events();
        },

        //设置头像屏幕水平居中
        set_avatar_center: function() {
            var $dom = $('.level-now')[0],
                $avatar = $('.avatar-wrap')[0];
            if($dom && $avatar) {
                var windowWidth = $(window).width(),
                    offsetLeft = $dom.offsetLeft,
                    offsetWidth = $avatar.offsetWidth,
                    scrollLeft = Math.round(offsetLeft - (windowWidth/2 - offsetWidth) );

                $('.hd-wrap')[0].scrollLeft = scrollLeft;
            }
        },

        show_growth: function() {
            var width,
                left_width = 26;
            var line_width = $('.grow-line').width();
            var growthScoreList = store.get_score_list();
            var level_info = store.get_level_info();
            var level = level_info.level;
            if(level == 8) {
                $('.grow-line .inner').css('width', '100%');
            } else {
                width = Math.round((line_width-left_width*2) * (level_info.current_score - growthScoreList[level]) / growthScoreList[level + 1]) + 26;
                $('.grow-line .inner').css('width', width + 'px');
            }
        },

        _bind_events: function () {
            var me = this;
            $('.j-grow-btn').on('click', function () {
                location.href = constants.HTTP_PROTOCOL + '//h5.weiyun.com/vip?grow';
            });

            $('.j-pay-btn').on('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).addClass('touch');
            });

            $('.j-pay-btn').on('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).removeClass('touch');
                var month = $(this).attr('data-id');
                me.trigger('action', 'pay', month);
            });
        }
    });

    return ui;
});