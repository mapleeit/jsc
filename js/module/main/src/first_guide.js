/**
 * 新手引导
 * @author xixinhuang
 * @date 2015-10-22
 */
define(function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        cloud_config = common.get('./cloud_config'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),
        undefined;

    var guide_key = 'WY_WEB_TEMPORARY_FILE_USER_GUIDE_FLOAT';

    return new Module('first_guide', {

        render: function () {
            if(constants.IS_APPBOX || query_user.get_cached_user().is_weixin_user()){
                return;
            }
            var me = this;
            cloud_config.get(guide_key).done(function (values) {
                if (values[guide_key].value != '1') {
                    me._$el = $(tmpl['first_guide']()).appendTo($('body'));
                    me.bind_events();
                    cloud_config.set(guide_key, '1');
                }
            });
        },

        close: function() {
            this._$el.remove();
            this._$el = null;
        },

        bind_events: function() {
            var close_btn = $('#close_guide'),
                continue_btn = $('.pop-btn'),
                slide_list = $('#slide_list'),
                slide_items = $('.icon-bullet'),
                me = this;

            close_btn.on('click', function() {
                me.close();
            });
            continue_btn.each( function(i, item) {
                item.addEventListener('click', function() {
                    if(i === 2){
                        //最后一个就直接关闭新手提示
                        me.close();
                        return;
                    }
                    me.slide_down(i+1);
                });
            });
            slide_items.each(function(i, slide_item) {
                slide_item.addEventListener('click', function() {
                    me.slide_down(i);
                });
            });
        },

        slide_down: function(next) {
            var slider = $('#slider'),
                mask = $('#mask'),
                slide_list = $('#slide_list'),
                current_item = $('.on');

            var next_item = $('.icon-bullet').eq(next);
            if(next_item.hasClass('on')){
                return;
            }

            current_item.removeClass('on');
            next_item.addClass('on');

            var className = 'loc' + (++next);
            var ver = next>2? 'ver' : 'hor';
            mask.removeClass();
            mask.addClass('mask-wrapper').addClass(className).addClass(ver);

            var left = (next-1) * 100;
            slider.animate({
                left: "-" + left + "%"
            }, 1000);
        }
    });
});