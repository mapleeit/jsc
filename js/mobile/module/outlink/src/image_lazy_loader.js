/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        Module = lib.get('./Module'),
        undefined;

    var img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? '240*240' : '120*120';

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
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
                        var src = $img.attr('data-src');
                        src = src.indexOf('?') > -1 ? src + '&size=' + img_size : src + '?size=' + img_size;
                        $img.css('backgroundImage', "url('"+src+"')");
                        $img.attr('data-loaded', 'true');
                    }
                }
            });
        }
    });

    return lazy_loader;
});