/**
 * Created by maplemiao on 2016/9/29.
 */

"use strict";

/**
 * 播放窗口上方标题栏
 * @param {Object} options
 * @param {string} options.className - title div's class
 * @param {string} options.filename - title filename init
 * @param {string} options.selectorClass - title div's class used for jquery selection
 */
function topTitle(options) {
    var player = this;

    var className = options.className || 'video-title',
        filename = options.filename || '',
        selectorClass = options.selectorClass || 'j-video-player-title';

    player.ready(function () {
        var pEl = this.el();
        var el = videojs.createEl('div', {
            className : className + ' show',
            innerHTML : '<h3 class="' + selectorClass + '">' + filename + '</h3>'
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

videojs.plugin('topTitle', topTitle);