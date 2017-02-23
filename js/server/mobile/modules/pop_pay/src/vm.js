/**
 * 工具函数，无状态
 * 产生视图渲染所用到的数据模型
 * Created by maplemiao on 22/01/2017.
 */
"use strict";


define(function(require, exports, module) {
    var _ = require('weiyun/mobile/lib/underscore'),
        dateformat = require('weiyun/mobile/lib/dateformat');
    var payAids = require('weiyun/mobile/common/payAids');

    return function vm(data, wy_uf) {
        var browser = require('weiyun/mobile/lib/browser')();

        data = data || {};
        var userInfo = data.userInfo || {};
        var onlineConfig = data.onlineConfig || {};

        var AndroidPriceListModel = [{
            text: _.escape('12个月'),
            month: '12',
            price: 120,
            cur_class: true
        }, {
            text: _.escape('6个月'),
            month: '6',
            price: 60,
            cur_class: false
        }, {
            text: _.escape('3个月'),
            month: '3',
            price: 30,
            cur_class: false
        }, {
            text: _.escape('其他'),
            month: 'other',
            price: 'other',
            cur_class: false
        }];

        var IOSPriceListModel = [{
            text: _.escape('12个月'),
            month: '12',
            price: 118,
            cur_class: true
        }, {
            text: _.escape('6个月'),
            month: '6',
            price: 60,
            cur_class: false
        }, {
            text: _.escape('3个月'),
            month: '3',
            price: 30,
            cur_class: false
        }, {
            text: _.escape('1个月'),
            month: '1',
            price: 12,
            cur_class: false
        }];

        var aid = payAids.aid;
        var banner_img_url = (function () {
            var aid_img_maplist = onlineConfig.aid_img_maplist;
            var mapObj = {};
            for (var i = 0, len = aid_img_maplist.length; i < len; i++ ) {
                var item = aid_img_maplist[i];
                var pair = item.split('::');

                mapObj[pair[0]] = pair[1];
            }

            if (!mapObj['default']) {
                // 若是配置中缺少默认banner图，需要在本地开发时候就暴露出来
                console.error('Missing default img url in online config');
            }

            return mapObj[aid] || mapObj['default'];
        })();
        var need_show_link = (function () {
            switch (onlineConfig.act_info.show_link_account) {
                case 'qq':
                    return wy_uf === '0';
                    break;
                case 'weixin':
                    return wy_uf === '1';
                    break;
                case 'all':
                    return true;
                    break;
                default:
                    return false;
            }
        })();

        return {
            // 首页vm模型
            getModel: function () {
                return {
                    _rawData: data,
                    // 支付渠道统计
                    aid: aid,
                    wy_uf: wy_uf,

                    nick_name : _.escape(userInfo.nick_name || ''),
                    uin: userInfo.uin || '',
                    price_list: browser.ANDROID ? AndroidPriceListModel : IOSPriceListModel,
                    init_price: browser.ANDROID ? '120' : '118',

                    // online config start
                    banner_img_url: _.escape(banner_img_url),
                    act_info: {
                        plain_text: _.escape(onlineConfig.act_info.plain_text),
                        link: "weiyun://newwebview/fullscreen?url=" + encodeURIComponent('https://jump.weiyun.com/?from=3060&r_url=' + encodeURIComponent(onlineConfig.act_info.link)),
                        link_text: _.escape(onlineConfig.act_info.link_text),
                        need_show_link: need_show_link
                    }
                    // online config end

                }
            }
        }
    }
});
