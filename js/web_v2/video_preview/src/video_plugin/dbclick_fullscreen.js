/**
 * Created by maplemiao on 2016/9/29.
 */

"use strict";

function dbclickFullscreen(options) {
    var player = this;

    player.ready(function () {
        player.on('dblclick', function (e) {
            // 禁止点击音量调节栏双击响应
            if (e.target.className === 'vjs-menu-content') {
                return;
            }
            // When controls are disabled, hotkeys will be disabled as well
            if (player.controls()) {
                // Don't catch clicks if any control buttons are focused
                var activeEl = e.relatedTarget || e.toElement || e.target;
                if (activeEl.closest && activeEl.closest('.vjs-control')) {
                    return;
                } else { // 兼容IE
                    var classes = ['.vjs-control', '.vjs-slider-bar', '.vjs-current-time-display', '.vjs-remaining-time-display'];

                    for (var j = 0; j < classes.length; j++) {
                        var items = player.$$(classes[j]);

                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];

                            if (item == activeEl) {
                                return;
                            }
                        }
                    }
                }

                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
            }
        });
    });
}

videojs.plugin('dbclickFullscreen', dbclickFullscreen);