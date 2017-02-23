/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define(function(require, exports, module) {
    var dateformat = require('weiyun/mobile/lib/dateformat'),
        prettysize = require('weiyun/mobile/lib/prettysize');

    var busiConfig = require('./busiConfig');
    return function (data) {
        data = data || {};
        var userInfo = data.userInfo || {};
        var spaceInfo = (data.spaceInfo || {}).space_info || {};

        var vipInfo = userInfo.weiyun_vip_info || {};

        var __isVip = vipInfo.weiyun_vip || false,
            __totalSpace = spaceInfo.total_space || 10 * Math.pow(1024, 3),
            __usedSpace = userInfo.used_space || 0,
            __remainSpace = (__totalSpace - __usedSpace) <= 0 ? 0 : (__totalSpace - __usedSpace),
            __initialSpace = (spaceInfo.normal_init_space || {}).space_size || 10 * Math.pow(1024, 3),
            __vipSpace = (spaceInfo.vip_init_space || {}).space_size || 0,
            __oldSpace = (spaceInfo.vip_present_space || {}).space_size || 0,
            __buySpace = spaceInfo.space_coupon_total_space || 0,

            // 会员总共初始容量组成：初始容量 + 会员特权赠送容量
            __vipInitialSpace = __initialSpace + __vipSpace,

            __initialPercent = Math.round((__initialSpace / __totalSpace) * 100),
            __vipPercent = Math.round((__vipSpace/ __totalSpace) * 100),
            __oldPercent = Math.round((__oldSpace / __totalSpace) * 100),
            __buyPercent = 100 - __initialPercent - __vipPercent - __oldPercent,

            __initialExpire = (spaceInfo.normal_init_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.normal_init_space || {}).end_time, 'yyyy-mm-dd') + '到期'),
            __vipExpire = (spaceInfo.vip_init_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.vip_init_space || {}).end_time, 'yyyy-mm-dd') + '到期'),
            __oldExpire = (spaceInfo.vip_present_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.vip_present_space || {}).end_time, 'yyyy-mm-dd') + '到期'),

            undefined;

        // 如果总容量大于1G，则用G为单位显示，否则就prettysize自动处理
        var __totalSpaceText = maxPrettysizeG(__totalSpace),
            __remainSpaceText = maxPrettysizeG(__remainSpace);

        // 视图层渲染使用的模型
        var __buyListModel = {
            // space_price_map
            '20G': 20,
                '50G': 45,
                '200G': 160,
                '1T': 600
        },
        // ios使用的价格
        __buyListModelIAP = {
            // space_price_map
            '20G': 25,
                '50G': 45,
                '200G': 163,
                '1T': 618
        },
        __spaceBarModel = {
            'initial': 'width:' + __initialPercent + '%',
                'vip': 'width:' + __vipPercent + '%',
                'old': 'width:' + __oldPercent + '%',
                'buy': 'width:' + __buyPercent + '%'
        },
        __spaceDetailModel = {
            'initial': {
                'show': __initialSpace !== 0,
                    'spaceText' : '免费容量：' + maxPrettysizeG(__initialSpace),
                    'expire': __initialExpire
            },
            'vip': {
                'show': __vipSpace !== 0,
                    'spaceText' : '会员特权：' + maxPrettysizeG(__vipSpace),
                    'expire': __vipExpire
            },
            'old': {
                'show': __oldSpace !== 0,
                    'spaceText' : '赠送容量：' + maxPrettysizeG(__oldSpace),
                    'expire': __oldExpire
            },
            'buy': getBuyList()
        };

        /**
         * 最大单位到G，无T及T以上单位
         * @param spaceNum
         */
        function maxPrettysizeG(spaceNum) {
            var result;
            if (spaceNum >= Math.pow(1024, 4)) {
                result = (spaceNum / Math.pow(1024, 3)).toFixed(2);
                result = (result.indexOf('.0') === result.length - 3) ? result.slice(0, -3) : result;
                result += 'G';
            } else {
                result = prettysize(spaceNum, true, true);
            }

            return result;
        }
        /**
         * 整理由购买容量券所产生的购买条目视图模型
         * 如果两张券在同一天到期，那么合并显示；如果不是同一天到期，分开显示
         * @return {Array}
         */
        function getBuyList() {
            var __spaceCouponList = spaceInfo.space_coupon_list || [];
            var tempObj = {},
                item, key, i, len;
            for (i = 0, len = __spaceCouponList.length; i < len; i++ ) {
                item = __spaceCouponList[i];
                key = dateformat(item['end_time'], 'yyyy-mm-dd');
                if (tempObj[key]) {
                    tempObj[key] = {
                        space_size: item['space_size'] + tempObj[key]['space_size'],
                        extra_id: item['extra_id'] + ',' + tempObj[key]['extra_id'],
                        add_time: item['add_time'] + ',' + tempObj[key]['add_time']
                    }
                } else {
                    tempObj[key] = {
                        space_size: item['space_size'],
                        extra_id: item['extra_id'],
                        add_time: item['add_time']
                    }
                }
            }
            var buyList = [];
            for (key in tempObj) {
                item = tempObj[key];
                buyList.push({
                    show: item.space_size !== 0,
                    expire: key + '到期',
                    spaceText: '购买容量：' + maxPrettysizeG(item.space_size),
                    space_size: item.space_size,
                    extra_id: item.extra_id,
                    add_time: item.add_time
                })
            }
            return buyList;
        }

        return {
            // data : data,

            __isVip : __isVip,
            __totalSpace : __totalSpace,
            __usedSpace : __usedSpace,
            __remainSpace : __remainSpace,
            __initialSpace : __initialSpace,
            __vipSpace : __vipSpace,
            __oldSpace : __oldSpace,
            __buySpace : __buySpace,

            // 会员总共初始容量组成：初始容量 + 会员特权赠送容量
            __vipInitialSpace : __vipInitialSpace,

            __initialPercent : __initialPercent,
            __vipPercent : __vipPercent,
            __oldPercent : __oldPercent,
            __buyPercent : __buyPercent,

            __initialExpire : __initialExpire,
            __vipExpire : __vipExpire,
            __oldExpire : __oldExpire,

            __totalSpaceText: __totalSpaceText,
            __remainSpaceText: __remainSpaceText,

            // 视图层渲染使用的模型
            __buyListModel : __buyListModel,
            // ios使用的价格
            __buyListModelIAP : __buyListModelIAP,
            __spaceBarModel : __spaceBarModel,
            __spaceDetailModel : __spaceDetailModel,

            VIP_INITIAL_CAPACITY : busiConfig.VIP_INITIAL_CAPACITY
        };
    }
});