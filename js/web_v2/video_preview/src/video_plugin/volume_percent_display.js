/**
 * Created by maplemiao on 2016/9/19.
 */

"use strict";

/**
 * 音量调节栏上方的百分显示
 *
 * 由于videojs没有提供很好的dom操作接口，所以实现略微复杂
 * 虽然实现不优雅，但是避免了jquery依赖。
 * @param {Object} options
 * @param {string} options.className - volume-percent-display div's class
 */
function volumePercentDisplay(options) {
    var player = this;
    var Component = videojs.getComponent('Component');

    var className = options.className || 'volume-percent-display';

    var el;
    videojs.registerComponent('VolumePercentDisplay', videojs.extend(Component, {
        createEl: function () {
            el = videojs.createEl('span', {
                className: className,
                innerHTML: formatPercent(getVolumePercent())
            });
            return el;
        }
    }));

    player.ready(function () {
        player.controlBar.volumeMenuButton.menuContent.addChild('VolumePercentDisplay', {}, 0);

        this.on(player, 'volumechange', updateContent);
    });

    /**
     * 小数形式音量值
     * @returns {*}
     */
    var getVolumePercent = function () {
        if (player.muted()) {
            return 0;
        }
        return player.volume();
    };

    /**
     * 把小数形式变成百分数形式 0.12 -> 12%
     * @param decimals
     * @returns {string}
     */
    var formatPercent = function (decimals) {
        if (typeof decimals !== 'number') {
            return;
        }

        return (decimals * 100).toFixed(0).toString() + '%';
    };

    /**
     * 音量变化时更新值
     */
    var updateContent = function () {
        el.innerHTML = formatPercent(getVolumePercent());
    }
}

videojs.plugin('volumePercentDisplay', volumePercentDisplay);