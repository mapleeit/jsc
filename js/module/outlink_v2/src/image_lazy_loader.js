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
        global_event = common.get('./global.global_event'),

        undefined;

    var lazy_loader = {

        init: function(img_container, scroller) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            this.listenTo(scroller, 'scroll', function() {
                me.load_image();
            })

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
                me = this;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var thumb_url = me.get_thumb_url($img.attr('data-src'), 64);
                        image_loader.load(thumb_url).done(function(img) {
                            $img.css({
                                'backgroundImage': "url('"+img.src+"')",
                                'backgroundPosition': 0
                            });
                            $img.attr('data-loaded', 'true');
                        });
                    }
                }
            });
        },

        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }

            if(size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else {
                return url;
            }
        }
    };

    $.extend(lazy_loader, events);

    return lazy_loader;
});