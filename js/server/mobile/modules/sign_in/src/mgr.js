/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr'),
        logger = common.get('./util.logger');

    var router = require('./router'),
        dom = require('./dom'),
        ar = require('./ar'),
        vm = require('./vm'),
        store = require('./store'),
        tmpl = require('./tmpl');

    // 空奖品ID
    var EMPTY_PRIZE_ID = 13144;

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
            this.observe(this.store);
            this.observe(this.router);

            this.data = this.store.get_data();

            this.console_log = [];
        },

        // hash change
        on_hash_change: function (hash) {
            var me = this;
            this.console_log.push('[HASH_CHANGE]: ' + hash);

            switch (hash) {
                case "sign_in":
                    this.view.hide_all_container();
                    this.view.render_$sign_in();

                    break;
                case "more_prize":
                    this.view.hide_all_container();
                    this.view.render_$more_prize(this.data);

                    break;
                case "goods_detail":
                    this.view.hide_all_container();
                    this.view.render_$goods_detail(this.data);

                    // 进入详情页则记录详情页面物品信息
                    this.console_log.push(
                        '[goods_detail]: ',
                        '__prizeid:' + this.store.get('__prizeid'),
                        '__ruleid:' + this.store.get('__ruleid')
                    );

                    break;
                case "exchange_success":
                    this.view.hide_all_container();
                    this.view.render_$exchange_success(this.data, true);

                    break;
                case "history":
                    // 页面中有操作可能导致history数据变更，故先脏检查
                    ar.get_history().done(function (data) {
                        var isDirty = !_.isEqual(data, me.data.qzRecords);

                        // 若脏，则更新数据
                        if (isDirty) {
                            me.data.qzRecords = data;
                            me.store.update('qzRecords', data);
                        }

                        me.view.hide_all_container();
                        me.view.render_$history(me.data, isDirty);
                    }).fail(function (err) {
                        me.console_log.push(
                            '[GO_HISTORY_GET_AJAX]: ',
                            '（前往"我的物品"时进行脏检查，拉取数据失败）',
                            'err info: ' + JSON.stringify(err)
                        );
                        logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
                    });

                    break;
                case "personal_center":
                    this.view.hide_all_container();
                    this.view.render_$personal_center();

                    break;
                case "address_manage":
                    this.view.hide_all_container();
                    this.view.render_$address_manage(this.data);

                    break;
                case "edit_address":
                    this.view.hide_all_container();
                    this.view.render_$edit_address(this.data);

                    break;
            }
        },

        on_go_goods_detail: function (prizeid, ruleid, pathway) {
            this.store.set('__prizeid', prizeid);
            this.store.set('__ruleid', ruleid);
            this.store.set('__pathway', pathway);

            router.go('goods_detail');
        },

        on_go_exchange_success: function (prizeid, ruleid, pathway) {
            this.store.set('__prizeid', prizeid);
            this.store.set('__ruleid', ruleid);
            this.store.set('__pathway', pathway);

            router.go('exchange_success');
        },

        on_go_sign_in: function () {
            router.go('sign_in');
        },

        on_go_personal_center: function () {
            router.go('personal_center');
        },

        on_go_address_manage: function () {
            router.go('address_manage');
        },

        on_go_edit_address: function (e) {
            if ($(e.target).closest('button').hasClass('disable')) {
                return;
            }
            router.go('edit_address');
        },

        on_go_history: function () {
            router.go('history');
        },

        on_go_more_prize: function () {
            router.go('more_prize');
        },

        /**
         * 删除地址
         * @param e
         */
        on_remove_address: function (e) {
            var me = this;
            // 无删除cgi，只能置0，置空也不行
            var data = {
                addr: '0',
                city: '北京市',
                id_number: '',
                mail: '',
                name: '0',
                phone: '0',
                post: '0',
                province: '北京'
            };

            ar.save_address(data).done(function (data) {
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);

                store.update('address', data);
                me.view.render_$address_manage(store.get_data(), true);
                me.view.render_$edit_address(store.get_data(), true, true);
            }).fail(function (err) {
                me.view.reminder.error('删除地址失败：' + err.msg);
                me.console_log.push(
                    '[delete_address_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        /**
         * 保存编辑好的地址
         * @param e
         */
        on_confirm_edit_address: function (e) {
            var me = this;
            // 禁止点击
            if ($(e.target).hasClass('disable')) {
                return;
            }

            ar.save_address(store.get('address')).done(function (data) {
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);

                me.view.render_$address_manage(store.get_data(), true);
                me.view.render_$exchange_success(store.get_data(), true);
                router.back();
            }).fail(function (err) {
                me.view.reminder.error('保存地址失败：' + err.msg);
                me.console_log.push(
                    '[save_address_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        /**
         * 点击"兑换"弹出确认兑换弹框
         */
        on_popup_exchange_dialog: function (e) {
            var me = this;
            me.view.show_exchange_dialog(e);
        },

        /**
         * 收回兑换弹框
         * @param e
         */
        on_withdraw_exchange_dialog: function (e) {
            var me = this;
            me.view.hide_exchange_dialog(e);
        },

        /**
         * 确认兑换
         */
        on_confirm_exchange: function (e) {
            var me = this;
            var err;

            if ($(e.target).closest('.j-exchange-confirm').hasClass('disable')) {
                return;
            }

            // check score
            if (err = me._check_score()) {
                me.console_log.push(
                    '[confirm_exchange_check_score]:',
                    'need_score: ' + err.need_score,
                    'have_score: ' + err.have_score
                );
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 655012, 2);
                me.view.reminder.error(err.msg);
                return;
            }

            ar.exchange(this.store.get('__ruleid')).done(function (data) {
                // status change
                var costScore = Number($(e.target).closest('.j-dialog').find('.j-exchange-price-list .act').text());
                store.set('signInInfo', {
                    total_point: store.get('signInInfo').total_point - costScore
                });

                me.router.go('exchange_success');
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);
            }).fail(function (err) {
                me.view.reminder.error('兑换失败：' + err.msg);

                me.console_log.push(
                    '[confirm_exchange_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        on_confirm_lottery: function (e) {
            var me = this,
                err;
            var $dialog = $(e.target).closest('.j-dialog');

            if ($(e.target).closest('.j-exchange-confirm').hasClass('disable')) {
                return;
            }

            // check score
            if (err = me._check_score()) {
                me.console_log.push(
                    '[confirm_lottery_check_score]:',
                    'need_score: ' + err.need_score,
                    'have_score: ' + err.have_score
                );
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 655022, 2);
                me.view.reminder.error(err.msg);
                return;
            }

            // yes :
            ar.lottery(this.store.get('__ruleid')).done(function (data) {
                // status change
                var costScore = Number($dialog.find('.j-exchange-price-list .act').text()),
                    newTotalPoint = store.get('signInInfo').total_point - costScore;
                store.set('signInInfo', {
                    total_point: newTotalPoint
                });
                $dialog.find('.j-total-point').text('（你的金币剩余'+ newTotalPoint +'）');
                var indexSigninText = dom.get_$index_container().find('.j-signin-text').text();
                dom.get_$index_container().find('.j-signin-text').text(indexSigninText.split('：')[0] + '：' + newTotalPoint);


                if (data) {
                    var item = data[0];
                }

                if (item.prizeid === EMPTY_PRIZE_ID) {
                    // 未抽中
                    me.view.render_lottery_fail_pop();
                } else {
                    me.on_go_exchange_success(item.prizeid, item.ruleid, 'lottery');
                }
                // me.router.go('exchange_success');
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);
            }).fail(function (err) {
                me.view.reminder.error('兑换失败：' + err.msg);

                me.console_log.push(
                    '[confirm_lottery_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },


        // private method
        _validate: function (data) {
            if(data.name === '0') {
                return 'name';
            } else if(data.phone === '0') {
                return 'phone';
            } else if(data.addr === '0') {
                return 'addr';
            }
            return '';
        },

        /**
         * 兑换时检查拥有积分是否大于兑换需要积分
         * @private
         */
        _check_score: function () {
            var me = this;
            var costScore = Number($('.j-exchange-price-list').find('.act').text());
            if (me.store.get('signInInfo').total_point < costScore) {
                return {
                    msg: '您的积分不足',
                    have_score: me.store.get('signInInfo').total_point,
                    need_score: costScore
                };
            }
        }
    });
});