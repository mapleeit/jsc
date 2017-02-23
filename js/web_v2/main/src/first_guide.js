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
    var guide_key_len = 3;
    var guide_page = 3;

    return new Module('first_guide', {

        render: function () {
            if(constants.IS_APPBOX){
                return;
            }
            var me = this;
            /**
             * 拉取云配置请求，这里复用以前的字段，但不覆盖，在前面加一位来标记
             * @example，以前的value占用个位，分别是0和1。则这次用0x和1x来标记
             */
            cloud_config.get(guide_key).done(function (values) {
                var value = values[guide_key].value;

                if (value.length < guide_key_len || value[0] != '1') {
                    guide_page = (value.length === guide_key_len-1 && value[0] === '1')? 1 : 3;
                    me._$el = $(tmpl['first_guide']({
                        guide_page: guide_page
                    })).appendTo($('body'));
                    me.bind_events();
                    var new_value = '11' + value[value.length-1];
                    cloud_config.set(guide_key, new_value);
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
                    if(i === guide_key_len-1){
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
            var ver = next>guide_page? 'ver' : 'hor';
            mask.removeClass();
            mask.addClass('mask-wrapper').addClass(className).addClass(ver);

            var left = (next-1) * 100;
            slider.animate({
                left: "-" + left + "%"
            }, 1000);
            slider.find('.item').eq(next).show();
        }
    });
});