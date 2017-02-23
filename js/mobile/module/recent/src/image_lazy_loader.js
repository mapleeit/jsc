/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
	    https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants'),
        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),

        undefined;

    var img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? 120 : 64;

    common.get('./polyfill.rAF');

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                window.requestAnimationFrame(function() {
                    me.load_image();
                });

           });

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset,
                me = this;

            imgs.each(function(i, img) {
                var $img = $(img);
                var thumb_url;
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        thumb_url = constants.IS_HTTPS? $img.attr('data-https-src') : $img.attr('data-src');
                        image_loader.load(https_tool.translate_download_url(me.get_thumb_url(thumb_url, img_size))).done(function(img) {
                            $img.css('backgroundImage', "url('"+img.src+"')");
                            $img.attr('data-loaded', 'true');
                        })
                    }
                }
            });
        },

        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }
            if(url.indexOf('picabstract.preview.ftn.qq.com') !== -1 && size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else if(size){
                return url + '/64';
            }
            return url;
        }
    });

    return lazy_loader;
});