/**
 * Created by maplemiao on 25/10/2016.
 */
"use strict";

function replay(options) {
    var player = this;

    player.ready(function () {
        var pEl = this.el();
        var el = videojs.createEl('div', {
            className : 'video-states replay j-replay',
            innerHTML : '<i class="icon icon-replay j-replay-btn"></i><div class="tip-wrap"><p class="tip">播放完毕，点击重新播放</p></div>'
        });
        videojs.setAttributes(el, {style: 'display:none'});;
        videojs.appendContent(pEl, el);

        player.on('ended', function () {
            videojs.setAttributes(el, {style: 'display:inherit'});
        });
        player.on('play', function () {
            videojs.setAttributes(el, {style: 'display:none'});
        });

        player.on('timeupdate', function () {
            videojs.setAttributes(el, {style: 'display:none'});
        });

        videojs.on(el, 'click', function (e) {
            // seek to the beginning
            player.currentTime(0);
            player.play();
        });
    });
}

videojs.plugin('replay', replay);