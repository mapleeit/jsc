/**
 * 一些常用小挂件
 * @author hibincheng
 * @date 2014-12-20
 */

"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        Module = lib.get('./Module'),
        tmpl = require('./tmpl'),

        undefined;

    var exports = {};
    var $mask;
    var mask = function(is_trans) {
        $mask = $mask || $('<div class="ui-mask"></div>').appendTo(document.body);
        $mask.toggleClass('ui-mask-trans', is_trans);
        $mask.show('false');
    };

    var unmask = function() {
        $mask && $mask.hide('hide');
    };

    exports.reminder = new Module('widgets.reminder', {

        render: function(data) {
            if(this.$el) {
                this.$el.remove();
            }
            mask(true);
            var $el = $(tmpl.reminder(data)).appendTo(document.body);
            clearTimeout(this.timer);
            if(data.auto_remove) {
                this.timer = setTimeout(function() {
                    unmask();
                    $el.remove();
                    if (data.callback) {
                        data.callback();
                    }
                }, 1000);
            }

            this.$el = $el;
        },
        // modified by maplemiao, add callback
        // 在setTimeout中执行callback
        ok: function(text, callback) {
            text = text || '操作成功';
            this.render({
                type: 'ok',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },
        error: function(text, callback) {
            text = text || '出错啦';

            this.render({
                type: 'error',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },
        help: function(text, callback) {
            this.render({
                type: 'help',
                text: text,
                auto_remove: true,
                callback: callback
            });
        },

        loading: function(text, callback) {
            text = text || '加载中';
            this.render({
                type: 'loading',
                text: text,
                auto_remove: false,
                callback: callback
            });
        },
        // modified done

        hide: function() {
            if(this.$el) {
                this.$el.remove();
            }
            this.timer && clearTimeout(this.timer);
            unmask();
        }
    });

    /**
     * confirm component for mobile
     * @param {Object} options - the config options which control the behavior of this component
     * @param {string} options.tip - main tip
     * @param {string} options.sub_tip - sub tip
     * @param {function} options.ok_fn - callback when user click the 'ok' button
     * @param {function} options.cancel_fn - callback when user click the 'cancel' button
     * @param {Array} options.btns_text - the text rendered to the confirm component. e.g. ['ok', 'cancel']
     */
    exports.confirm = function(options) {
        options = options || {};
        var tip = options.tip,
            sub_tip = options.sub_tip,
            ok_fn = options.ok_fn,
            cancel_fn = options.cancel_fn,
            btns_text = options.btns_text;

        exports.reminder.hide();//如果有reminder，先隐藏

        var $el = $(tmpl.confirm({
            tip: tip,
            sub_tip: sub_tip || '',
            ok_text: btns_text && btns_text[0] || '确定',
            cancel_text: btns_text && btns_text[1] || '取消'
        })).appendTo(document.body);

        $el.on('click', '[data-id=ok]', function(e) {
            e.preventDefault();
            ok_fn && ok_fn(e);
            $el.remove();
            unmask();
        }).on('touchend.wigdets_confirm', '[data-id=cancel]', function(e) {
            e.preventDefault();
            cancel_fn && cancel_fn(e);
            $el.remove();
            unmask();
        });

        mask(true);
        $el.show();
    };

    return exports;
});