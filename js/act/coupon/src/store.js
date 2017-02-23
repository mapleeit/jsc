define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var events = lib.get('./events'),

        undefined;

    var store = {
        init : function (data) {
            if (this._inited) {
                return;
            }

            if (data) {
                this.couponTotalCount = data['couponTotalCount'];
                this.invalidCouponList = data['invalidCouponList'];
                this.validCouponList = data['validCouponList'];
            } else {
                this.couponTotalCount = 0;
                this.invalidCouponList = [];
                this.validCouponList = [];
            }

            this._inited = true;
        },

        get_coupon_total_count: function () {
            return this.couponTotalCount;
        },

        get_invalid_coupon_list: function () {
            return this.invalidCouponList;
        },

        get_valid_coupon_list: function () {
            return this.validCouponList;
        },

        /**
         * find out is there any coupon are valid now
         */
        is_using_coupon: function () {
            for (var i = 0; i < this.validCouponList.length; i++) {
                if (this.validCouponList[i].flow_coupon_status === 2) {
                    return true;
                }
            }
            return false;
        }
    };

    $.extend(store, events);

    return store;
});