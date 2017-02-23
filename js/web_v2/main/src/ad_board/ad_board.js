/**
 * Created by maplemiao on 28/12/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Module = common.get('./module'),
        query_user = common.get('./query_user'),
        reportMD = common.get('./report_md'),
        cookie = lib.get('./cookie');

    var tmpl = require('./tmpl');

    var uin = query_user.get_uin_num(),
        BOARD_ID = 2557;  //http://qboss.cm.com/front/v2/html/home.html  @xiaomoliu

    return new Module('ad_board', {
        render: function () {
            var me = this;

            /**
             * require qboss module
             */
            require.async('qboss', function (mod) {
                me.qboss_info = mod.get('./qboss');

                me.qboss_info.get({
                    board_id: BOARD_ID,
                    uin: uin
                }).done(function(data){
                    if (data.code !== 0) {
                        //fail
                        reportMD(277000034, 179000184, data.code, 1);
                    } else if (data && data.data && data.data.count === 0) {
                        // 1111返回码代表用户没有被投放到广告
                        reportMD(277000034, 179000184, 1111, 2);
                    } else {
                        var tempData = data.data || {};
                        tempData = tempData[BOARD_ID] || {};
                        tempData = tempData.items || [];
                        tempData = tempData[0] || {};
                        var extdata = tempData.extdata ? JSON.parse(tempData.extdata) : {};

                        me.bosstrace = tempData.bosstrace || '';

                        me._$el = $(tmpl.ad_board({
                            validated: extdata.link && extdata.img,
                            link: extdata.link ? extdata.link.replace(/^http:/, '') : '',
                            img_url: extdata.img ? extdata.img.replace(/^http:/, '') : ''
                        }));
                        me._$el.appendTo($('.layout-aside-ft'));

                        me._bind_events();
                    }
                }).fail(function(err){
                    // logger
                    reportMD(277000034, 179000184, err.ret, 1);
                });
            });
        },

        _bind_events: function () {
            var me = this;

            me._$el.on('click', '.j-ad-board-close-btn', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me._destroy();

                me.qboss_info.report({
                    from :0,
                    uin: uin,
                    qboper: 3,
                    bosstrace: me.bosstrace
                });
            });

            me._$el.on('click', '.j-ad-board-bd', function (e) {
                me.qboss_info.report({
                    from :0,
                    uin: uin,
                    qboper: 2,
                    bosstrace: me.bosstrace
                });
            });
        },

        _unbind_events: function () {
            var me = this;

            me._$el.off('click');
        },

        _destroy: function () {
            var me = this;

            me._unbind_events();

            me._$el.remove();
            me._$el = null;
        }
    })
});