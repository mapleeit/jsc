/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        rAF = common.get('./polyfill.rAF'),

        undefined;

    var img_size;
    var big_show = false;
    var minHeight = 0;

    var screen_h = window.screen.height;
    var win_h = $(window).height();
    var win_w = $(window).width();

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);
            if($('#photo_list').length > 0) {
                //img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? '240*240' : '120*120';
                img_size = 1024;//大图模式
                big_show = true;
               minHeight = parseInt(this.$ct.find('[data-src]').css('min-height') || 0, 10);

            } else {
                img_size = 64;
            }
            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var me = this;
            window.requestAnimationFrame(function() {
                me._load_image();
            });
        },

        _load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_scrolltop = window.pageYOffset,
                me = this;
            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_h + win_scrolltop + 100) {
                        image_loader.load(me.get_thumb_url($img.attr('data-src'), img_size)).done(function(img) {
                            $img.attr('data-loaded', 'true');
                            if(big_show) {
                                $img.parent().height('auto');
                                $img.css({
                                    minHeight: '0'
                                });

                                if(img.naturalHeight*win_w/img.naturalWidth >= screen_h*2) {//按宽度100%显示时，高度大于的2倍屏幕高为长图
                                    $img.parent().addClass('height').height(minHeight);
                                }
                                $img.attr('src', img.src);

                                if($img.height() > 0 && $img.height() < minHeight) { //跳动后，图片过小，则进行补齐
                                    me.load_image();
                                }

                            } else {
                                $img.css('backgroundImage', "url('"+img.src+"')");
                            }
                        }).fail(function(img) {
                            var path = 'share' + location.pathname,
                                url = img.getAttribute('src');
                            logger.report(path, {url: url, type: 'lazy_loader'});
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
    });

    return lazy_loader;
});