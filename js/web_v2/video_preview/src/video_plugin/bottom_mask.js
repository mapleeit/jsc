/**
 * Created by maplemiao on 2016/9/29.
 */

"use strict";

/**
 * 播放窗口下部控制栏背景
 * @param {Object} options
 * @param {string} options.className - mask div's class
 * @param {string} options.selectorClass - mask div's class used for jquery selection
 */
function bottomMask(options) {
    var player = this;

    var className = options.className || 'mask',
        selectorClass = options.selectorClass || 'j-video-mask';

    player.ready(function () {
        // var htmlString = '<div class="' + selectorClass + ' ' + className + '"></div>';
        // videojs.appendContent(this.el(), htmlString);

        var pEl = this.el();

        var el = videojs.createEl('div', {
            className: className + ' ' + selectorClass
        });
        videojs.appendContent(pEl, el);

        player.on('userinactive', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (player.paused()) {
                return;
            }
            videojs.addClass(el, 'hide');
            videojs.removeClass(el, 'show');
        });

        player.on('useractive', function (e) {
            e.preventDefault();
            e.stopPropagation();

            videojs.addClass(el, 'show');
            videojs.removeClass(el, 'hide');
        });
    });


}

videojs.plugin('bottomMask', bottomMask);