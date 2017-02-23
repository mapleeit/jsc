/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var widgets = common.get('./ui.widgets'),
        Module = lib.get('./Module');

    var dom = require('./dom'),
        tmpl = require('./tmpl'),
        vm = require('./vm'),
        store = require('./store');

    var city_data = require('./picker.city_data'),
        MobileSelectArea = require('./picker.MobileSelectArea');

    return new Module('view', {
        render: function (data) {
            if(this._rendered) {
                return;
            }

            this.reminder = widgets.reminder;
            this.confirm = widgets.confirm;

            this._bind_events();
            this.render_$sign_in();
            this._rendered = true;
        },

        render_$sign_in: function () {
            var me = this;

            me.$sign_in = me.$sign_in || dom.get_$index_container();
            me.$sign_in.show();
        },

        render_$more_prize: function (data) {
            var me = this;

            if (me.$more_prize) {
                me.$more_prize.show();
            } else {
                me.$more_prize = $(tmpl.more_prize(vm(data).getMorePrizeListModel()));
                me.$more_prize.appendTo(dom.get_$body());
                me.$more_prize.show();
            }
        },

        render_$goods_detail: function (data) {
            var me = this;

            if (me.$goods_detail) {
                me.$goods_detail.remove();
            }

            me.$goods_detail = $(tmpl.goods_detail(vm(data).getGoodsDetailModel()));
            me.$goods_detail.appendTo(dom.get_$body());
            me.$goods_detail.show();
        },

        render_$exchange_success: function (data, updateFlag) {
            var me = this;

            if (me.$exchange_success) {
                if (updateFlag) {
                    var $new = $(tmpl.exchange_success(vm(data).getExchangeSuccessModel()));
                    me.$exchange_success.replaceWith($new);
                    me.$exchange_success = $new;
                }

                me.$exchange_success.show();
            } else {
                me.$exchange_success = $(tmpl.exchange_success(vm(data).getExchangeSuccessModel()));
                me.$exchange_success.appendTo(dom.get_$body());
                me.$exchange_success.show();
            }
        },

        render_$personal_center: function (data) {
            var me = this;

            if (me.$personal_center) {
                me.$personal_center.show();
            } else {
                me.$personal_center = $(tmpl.personal_center());
                me.$personal_center.appendTo(dom.get_$body());
                me.$personal_center.show();
            }
        },

        render_$address_manage: function (data, updateFlag) {
            var me = this;

            if (me.$address_manage) {
                if (updateFlag) {
                    var $new = $(tmpl.addr_mgr(vm(data).getAddressModel()));
                    me.$address_manage.replaceWith($new);
                    me.$address_manage = $new;
                }
                me.$address_manage.show();
            } else {
                me.$address_manage = $(tmpl.addr_mgr(vm(data).getAddressModel()));
                me.$address_manage.appendTo(dom.get_$body());
                me.$address_manage.show();
            }
        },

        render_$edit_address: function (data, updateFlag, hideFlag) {
            var me = this;

            if (me.$edit_address) {
                if (updateFlag) {
                    var $new = $(tmpl.edit_addr(vm(data).getAddressModel()));
                    me.$edit_address.replaceWith($new);
                    me.$edit_address = $new;
                    me._render_picker();
                }
                if (!hideFlag) {
                    me.$edit_address.show();
                }
            } else {
                me.$edit_address = $(tmpl.edit_addr(vm(data).getAddressModel()));
                me.$edit_address.appendTo(dom.get_$body());
                me.$edit_address.show();
                me._render_picker();
            }
        },

        render_$history: function (data, updateFlag) {
            var me = this;

            if (me.$history) {
                if (updateFlag) {
                    var $new = $(tmpl.history(vm(data).getHistoryModel()));
                    me.$history.replaceWith($new);
                    me.$history = $new;
                }
                me.$history.show();
            } else {
                me.$history = $(tmpl.history(vm(data).getHistoryModel()));
                me.$history.appendTo(dom.get_$body());
                me.$history.show();
            }
        },

        hide_all_container: function() {
            dom.get_$all_container().hide();
        },

        _bind_events: function () {
            var me = this;
            // common
            dom.get_$body().on('click', '[data-action]', function (e) {
                var $target = $(e.target);
                var actionName = $target.closest('[data-action]').data('action');
                switch (actionName) {
                    case "go_goods_detail":
                        me.trigger('action', actionName, $(this).data('prize-id'), $(this).data('rule-id'), $(this).data('pathway'));
                        break;

                    case "go_exchange_success":
                        me.trigger('action', actionName, $(this).data('prize-id'), $(this).data('rule-id'), $(this).data('pathway'));
                        break;

                    default:
                        // alert(actionName);
                        me.trigger('action', actionName, e);
                }
            });

            // address manage
            dom.get_$body().on('input', '.j-edit-address', function (e) {
                var $this = $(this);
                var province_city = $this.find('.j-address-province-city').val().split(' ');

                var data = {
                    name : $this.find('.j-address-name').val(),
                    addr : $this.find('.j-address-detail').val(),
                    phone: $this.find('.j-address-phone').val(),
                    province : province_city[0],
                    city: province_city[1],
                    id_number: '',
                    mail: '',
                    post: '0'
                };

                if (!me._validate(data)) {
                    store.update('address', data);
                    $this.closest('.j-container').find('.j-add-address-btn').removeClass('disable');
                } else {
                    $this.closest('.j-container').find('.j-add-address-btn').addClass('disable');
                }
            });
        },

        show_exchange_dialog: function(e) {
            $(e.target).closest('.j-container').find('.j-dialog').show();
        },

        hide_exchange_dialog: function(e) {
            $(e.target).closest('.j-container').find('.j-dialog').hide();
        },

        render_lottery_fail_pop: function () {
            var $pop = $('.j-pop');
            $pop.show();

            $pop.on('click', '.j-pop-mask', function (e) {
                $pop.hide();
            });
            $pop.on('click', '.j-pop-btn', function (e) {
                $pop.hide();
            });

        },

        // private method
        _validate: function (data) {
            if(!data.name) {
                return 'name';
            } else if(!data.phone) {
                return 'phone';
            } else if(!data.addr) {
                return 'addr';
            }
            return '';
        },

        _render_picker: function () {
            // address manage, place picker
            var selectArea = new MobileSelectArea();
            selectArea.init({
                trigger: $('#txt_area'),
                value: $('#hd_area').val(),
                level: 2,
                default: 1,
                data: city_data.data,
                callback: function () {
                    // 触发更改事件，走到event handler
                    this.trigger.trigger('input');
                }
            });
        },
    });
});