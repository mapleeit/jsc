/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),
        main_ui = require('main').get('./ui'),
        https_tool = common.get('./util.https_tool'),
        undefined;

    var lazy_loader = {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            var scroller = main_ui.get_scroller();
            this.listenTo(scroller, 'scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var src = https_tool.translate_url($img.attr('data-src'));
                        src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'size=64*64';
                        image_loader.load(src).done(function(img) {
                            $img.css({
                                'backgroundImage': "url('"+img.src+"')",
                                'backgroundPosition': 0
                            });
                            $img.attr('data-loaded', 'true');
                        })
                    }
                }
            });
        }
    };

    $.extend(lazy_loader, events);

    return lazy_loader;
});