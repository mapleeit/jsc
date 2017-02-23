/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets');

    var ar = require('./ar'),
        dom = require('./dom'),
        vm = require('./vm'),
        tmpl = require('./tmpl');

    var _ = require('weiyun/mobile/lib/underscore');

    return new Module('view', {
        init: function (syncData) {
            var me = this;

            me._bind_events();
        },

        _bind_events: function () {
            var me = this;

            var oldPrice = dom.get_$price_num().text();

            dom.get_$pay_btn().on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var month = dom.get_$price_list().find('li.cur').data('month');
                month = month === 'other' ? dom.get_$other_input().val() : month;

                me.trigger('action', 'pay_btn', {
                    month: month
                });
            });

            dom.get_$price_list().on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var $thisLi = $(e.target).closest('li');

                oldPrice = dom.get_$price_num().text();

                if ($thisLi.length) {
                    $thisLi.addClass('cur').siblings().removeClass('cur');

                    if ($thisLi.data('month') !== 'other') {
                        dom.get_$other_input().blur();
                        dom.get_$price_num().text($thisLi.data('price'));
                    } else if (!/^[1-9]\d{0,2}/.test(dom.get_$other_input().val())) { // 若不是有效数字 1-999
                        dom.get_$other_input().val('').focus();
                    } else {
                        dom.get_$other_input().focus();
                        dom.get_$price_num().text(dom.get_$other_input().val() * 10);
                    }
                }
            });

            dom.get_$other_input().on('keydown', function (e) {
                if (e.key && !/(\d|Backspace)/.test(e.key)) {
                    e.preventDefault();
                }

                if (e.key !== 'Backspace' && $(this).val().length === 3) { // 最多三位数
                    e.preventDefault();
                }
            });

            dom.get_$other_input().on('keyup', function (e) {
                if ($(this).val() === '0') {
                    $(this).val('其他');

                    var month = Number(oldPrice) / 10;
                    dom.get_$price_list().find('[data-month="' + month + '"]').addClass('cur').siblings().removeClass('cur');
                    dom.get_$price_num().text(oldPrice);
                    $(this).blur();
                } else if ($(this).val() === '') {
                    // nothing
                } else {
                    oldPrice = $(this).val() * 10;
                    dom.get_$price_num().text($(this).val() * 10);
                }
            });

            dom.get_$other_input().on('blur', function (e) {
                if (!$(this).val()) {
                    $(this).val('其他');

                    var month = Number(oldPrice) / 10;
                    dom.get_$price_list().find('[data-month="' + month + '"]').addClass('cur').siblings().removeClass('cur');
                    dom.get_$price_num().text(oldPrice);
                }
            });
        }
    });
});