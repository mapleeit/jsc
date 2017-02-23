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
        busiConfig = require('./busiConfig'),
        vm = require('./vm'),
        tmpl = require('./tmpl');

    var _ = require('weiyun/mobile/lib/underscore');

    return new Module('view', {
        init: function (syncData) {
            var me = this;

            me.reminder = widgets.reminder;

            me._bind_events();
            me.data_dirty_check(syncData);
        },

        _bind_events: function () {
            var me = this;

            dom.get_$body_container().on('touchend', '.j-purchase-btn, .j-question, .j-top-div', function (e) {
                    if ($(this).hasClass('j-purchase-btn')) {
                        var type = $(this).closest('li').data('type');
                        me.trigger('action', 'buy_btn', {
                            ruleid: busiConfig.SPACE_RULEID_MAP[type],
                            buy_num: 1
                        })
                    } else if ($(this).hasClass('j-question')) {
                        var $dropdown = $(this).find('.j-question-dropdown');
                        $dropdown.toggleClass('show');
                    } else {
                        $dropdown = dom.get_$question_dropdown();
                        if ($dropdown.hasClass('show')) {
                            $dropdown.toggleClass('show');
                        }
                    }

                });
        },

        /**
         * 异步拉取数据，检查数据是否过时，需要更新UI
         * @private
         */
        data_dirty_check: function (syncData) {
            var me = this;
            
            $.when(ar.get_user_info_def(), ar.get_space_info_def())
                .done(function (r1, r2) {
                    var asyncData = vm({
                        userInfo: r1,
                        spaceInfo: r2
                    });

                    // 数据变脏则重绘页面
                    !_.isEqual(asyncData, syncData) && me.repaint(asyncData);
                })
                .fail(function (err) {
                    // 异步拉取失败，静默处理
                })
        },

        repaint: function (asyncData) {
            var me = this;

            $('#body_container').html(tmpl.bodyHTML(asyncData));
        }
    });
});