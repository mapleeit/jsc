/**
 * 工具函数，无状态
 * 产生视图渲染所用到的数据模型
 * Created by maplemiao on 05/12/2016.
 */
"use strict";


define(function(require, exports, module) {
    var _ = require('weiyun/mobile/lib/underscore'),
        dateformat = require('weiyun/mobile/lib/dateformat');
    var busiConfig = require('./busiConfig');

    return function vm(data) {
        data = data || {};
        data.signInInfo = data.signInInfo || {};
        data.userInfo = data.userInfo || {};
        data.goodsList = data.goodsList || {};
        data.address = data.address || {};
        data.qzRecords = data.qzRecords || {};
        data.wyRecords = data.wyRecords || {};
        data.onlineConfig = data.onlineConfig || {};
        data.exchangeTime = data.exchangeTime || {}; // 限时兑换的时间

        /**
         * 根据ruleid拿取图片url
         * 依赖data.onlineConfig
         * @param ruleid
         * @return {string}
         * @private
         */
        function _getImageURL(ruleid) {
            data.onlineConfig.array = data.onlineConfig.array || [];

            var object = _.find(data.onlineConfig.array, function (obj) {
                return obj.ruleid === String(ruleid);
            });

            var url = (object || {}).img_url;

            return url || 'http://10.100.64.102/qz-proj/wy-h5/img/gift-11291.jpg';
        }

        /**
         * 获取限时兑换的限制时间
         * @param ruleid
         * @private
         */
        function _getLimitTime(ruleid) {
            data.exchangeTime.rule_list = data.exchangeTime.rule_list || [];

            return _.find(data.exchangeTime.rule_list, function (item) {
                return item.rule_id == ruleid;
            });
        }

        // underscore未提供深拷贝，hack。
        // https://github.com/jashkenas/underscore/issues/162
        // 注意：不能clone原型和方法
        function _deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        /**
         * 把兑换规则按照规则"分类{slash}名称"整理
         * @private
         */
        function _getRuleClassList(goodsList) {
            goodsList = goodsList || {};
            var list = _deepClone(goodsList);
            list = list.rule || {};

            var key, item, name, category,
                ruleClassList = {},
                slash = busiConfig.giftClassSlash;

            for (key in list) {
                if (list.hasOwnProperty(key)) {
                    item = list[key];

                    // "分类{slash}名称"
                    name = item.name || '';

                    // 忽略没有正确命名的规则
                    if (!name.split(slash)[1]) {
                        continue;
                    }

                    category = name.split(slash)[0] || '';
                    name = name.split(slash)[1] || '';

                    if (!ruleClassList[category]) {
                        ruleClassList[category] = [];
                        ruleClassList[category].push(_.extend(item, {
                            'ruleid': key,
                            'name': name,
                            'category': category,
                            'tlimit': _getLimitTime(key)
                        }));
                    } else {
                        ruleClassList[category].push(_.extend(item, {
                            'ruleid': key,
                            'name': name,
                            'category': category,
                            'tlimit': _getLimitTime(key)
                        }));
                    }
                }
            }

            return ruleClassList;
        }

        /**
         * 获取首页顶部签到模块数据展示模型
         * @param signInInfo
         */
        function getSignInModel(signInInfo) {
            signInInfo = signInInfo || {};
            var has_signed_in = signInInfo.has_signed_in || false,
                sign_in_count = signInInfo.sign_in_count || 0,
                total_point = signInInfo.total_point || 0;
            var i, signInList = [];
            for (i = 0; i < 7; i++) {
                signInList.push({
                    'index' : i,
                    'text' : (i + 1) === sign_in_count ? '今天' : '第' + (i + 1) + '天',
                    'score': i * 5 + 5,
                    'signed': (i + 1) <= sign_in_count
                });
            }

            return {
                __hasSignedIn: has_signed_in,
                __signInCount : sign_in_count,
                __totalPoint: total_point,
                __signInListModel : signInList
            }
        }

        /**
         * 获取首页奖品数据模型
         * @param goodsList
         * @param onlineConfig
         */
        function getIndexGiftListModel(goodsList, onlineConfig) {
            goodsList = goodsList || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};

            var i, j, len, item, it, numLimit, obj,
                indexGiftListModel = {},
                indexShowCategories = busiConfig.indexShowCategories;
            var rules = goodsList.rule || {};

            for (i = 0, len = indexShowCategories.length; i < len; i++) {
                item = indexShowCategories[i];

                it = ruleClassList[item];
                if (!it) {
                    return {};
                }
                for (j = 0; j < it.length; j++ ) {
                    if (it[j]) {
                        var beginTime = !!it[j].tlimit ? it[j].tlimit.begin_time : '00:00:00',
                            endTime = !!it[j].tlimit ? it[j].tlimit.end_time : '24:00:00',
                            totalLeft = (it[j].budget || {}).left || 0,
                            dailyLeft = (it[j].daily_budget || {}).left || 0,
                            isEmpty = totalLeft === 0 || dailyLeft === 0,
                            timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;

                        obj = {
                            'pathway': (rules[it[j].ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                            'is_empty': isEmpty,
                            'left' : totalLeft,
                            'daily_left' : dailyLeft,
                            'image_url': _getImageURL(it[j].ruleid),
                            'prizeid': it[j].prizeid || -1,
                            'ruleid' : it[j].ruleid || '',
                            'name': it[j].name || '',
                            'score': it[j].score || 0,
                            'limit': !!it[j].tlimit,
                            'limit_begin_time': beginTime,
                            'limit_end_time' : endTime,
                            'time_valid': timeValid // 处于有效时间内，即begin_time & end_time之间
                        };

                        if (!indexGiftListModel[item]) {
                            indexGiftListModel[item] = [];
                            indexGiftListModel[item].push(obj);
                        } else {
                            numLimit = (busiConfig.numLimitMap || {})[item] || 4;
                            if (indexGiftListModel[item].length < numLimit) {
                                indexGiftListModel[item].push(obj);
                            }
                        }
                    }
                }
            }
            return indexGiftListModel;
        }

        /**
         * 获取"查看更多"页面数据模型
         * @param goodsList
         * @return {Array}
         */
        function getMorePrizeListModel(goodsList) {
            goodsList = goodsList || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};

            var j, item, it, key,
                result,
                // 当前已空礼品
                currentEmptyList = [],
                // 当前时间未到还不能兑换或者抽取的礼品
                currentInvalidList = [],
                // 当前可以兑换的礼品
                currentValidList = [];
            var rules = goodsList.rule || {};

            for (key in ruleClassList) {
                if (ruleClassList.hasOwnProperty(key)) {
                    item = ruleClassList[key];

                    for (j = 0; j < item.length; j++) {
                        it = item[j];

                        var beginTime = !!it.tlimit ? it.tlimit.begin_time : '00:00:00',
                            endTime = !!it.tlimit ? it.tlimit.end_time : '24:00:00',
                            totalLeft = (it.budget || {}).left || 0,
                            dailyLeft = (it.daily_budget || {}).left || 0,
                            isEmpty = totalLeft === 0 || dailyLeft === 0,
                            timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;


                        it = {
                            'pathway': (rules[it.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                            'is_empty' : isEmpty,
                            'left' : totalLeft,
                            'daily_left' : dailyLeft,
                            'image_url': _getImageURL(it.ruleid),
                            'prizeid': it.prizeid || -1,
                            'ruleid' : it.ruleid || '',
                            'name': it.name || '',
                            'score': it.score || 0,
                            'limit': !!it.tlimit,
                            'limit_begin_time': beginTime,
                            'limit_end_time' : endTime,
                            'time_valid': timeValid // 处于有效时间内，即begin_time & end_time之间
                        };

                        if (isEmpty) {
                            currentEmptyList.push(it);
                        } else {
                            if (timeValid) {
                                currentValidList.push(it);
                            } else {
                                currentInvalidList.push(it);
                            }
                        }
                    }
                }
            }

            result = currentValidList.concat(_.sortBy(currentInvalidList, 'limit_begin_time'), currentEmptyList);

            return result;
        }


        /**
         * 获取奖品详情页数据模型
         * @param goodsList
         * @param signInInfo
         */
        function getGoodsDetailModel(goodsList, signInInfo) {
            goodsList = goodsList || {};
            signInInfo = signInInfo || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};
            var list = _.flatten(_.values(ruleClassList), true);

            // 这里不会有一个奖品既出现在兑换里面，也出现在抽奖里面
            // 有这种需求需要奖品上架两次
            var thisItem = _.pick(list, function (value, key, object) {
                return value.prizeid === Number(data.__prizeid);
            });

            // 如果真的大于1，那说明产品配置有问题，挑第一个展示
            thisItem = thisItem[_.keys(thisItem)[0]];

            if (!thisItem) {
                return;
            }

            var pathway = thisItem.type === 4 ? 'lottery' : 'exchange',
                beginTime = !!thisItem.tlimit ? thisItem.tlimit.begin_time : '00:00:00',
                endTime = !!thisItem.tlimit ? thisItem.tlimit.end_time : '24:00:00',
                totalLeft = (thisItem.budget || {}).left || 0,
                dailyLeft = (thisItem.daily_budget || {}).left || 0,
                isEmpty = totalLeft === 0 || dailyLeft === 0,
                timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;
            return {
                goodsInfo: {
                    pathway : pathway,
                    is_empty: isEmpty,
                    image_url : _getImageURL(thisItem.ruleid),
                    time_valid : timeValid,
                    name : thisItem.name,
                    score: pathway === 'lottery' ? thisItem.limit[0].count_num : thisItem.score, // 抽奖每次消耗的积分使用limit.count_num
                    limit: !!thisItem.tlimit,
                    limit_begin_time: beginTime,
                    limit_end_time: endTime,
                    rule_title: pathway === 'exchange' ? '兑换规则' : '抽奖规则',
                    rule_text: pathway === 'exchange'
                        ? '本商品为分时段限时兑换礼品，每日到达指定时间方可兑换。'
                        : '本商品采用抽奖玩法获得，每次参与抽奖需要支付一定的金币。'
                },
                signInInfo: {
                    total_score: signInInfo.total_point || 0
                }
            };
        }

        function getExchangeSuccessModel(goodsList, address) {
            goodsList = goodsList || {};
            address = address || {};

            var ruleClassList = _getRuleClassList(goodsList) || {};
            var list = _.flatten(_.values(ruleClassList), true);

            var has_address = address.name && address.name !== '0',
                name = has_address ? _.escape(address.name) : '',
                addr = has_address ? _.escape(address.province + address.city + address.addr) : '',
                phone = has_address ? _.escape(address.phone) : '',
                province = has_address ? _.escape(address.province) :'',
                city = has_address ? _.escape(address.city) : '',
                detail = has_address ? _.escape(address.addr) : '';

            // 这里不会有一个奖品既出现在兑换里面，也出现在抽奖里面
            // 有这种需求需要奖品上架两次
            var thisItem = _.pick(list, function (value, key, object) {
                return value.prizeid === Number(data.__prizeid);
            });

            // 如果真的大于1，那说明产品配置有问题，挑第一个展示
            thisItem = thisItem[_.keys(thisItem)[0]];

            if (!thisItem) {
                return;
            }

            return {
                goodsInfo: {
                    pathway : thisItem.type === 4 ? 'lottery' : 'exchange',
                    image_url : _getImageURL(thisItem.ruleid),
                    name : thisItem.name,
                    score: thisItem.score,
                    limit_time: (thisItem.tlimit || {}).begin_time || '',
                    rule_title: '兑换规则',
                    rule_text: '本商品采用倒计时开放兑换玩法，倒计时结束时所有用户可以进行兑换'
                },
                addressInfo: {
                    name: name,
                    phone: phone,
                    address: addr,
                    province: province,
                    city: city,
                    detail: detail,
                    has_address: has_address
                }
            }
        }

        /**
         * 获取地址页数据模型
         * @param address
         * @return {{name: string, phone: string, address: string, province: string, city: string, detail: string, has_address: boolean}}
         */
        function getAddressModel(address) {
            address = address || {};
            var has_address = address.name && address.name !== '0',
                name = has_address ? _.escape(address.name) : '',
                addr = has_address ? _.escape(address.province + address.city + address.addr) : '',
                phone = has_address ? _.escape(address.phone) : '',
                province = has_address ? _.escape(address.province) :'',
                city = has_address ? _.escape(address.city) : '',
                detail = has_address ? _.escape(address.addr) : '';
            return {
                name: name,
                phone: phone,
                address: addr,
                province: province,
                city: city,
                detail: detail,
                has_address: has_address
            }
        }

        /**
         * 获取"我的物品"历史记录页面数据模型
         * @param qzRecords
         * @param wyRecords
         * @param goodsList
         * @return {Array}
         */
        function getHistoryModel(qzRecords, wyRecords, goodsList) {
            var result = [],
                list,
                i, j, len, item;

            goodsList = goodsList || {};
            var rules = _deepClone(goodsList).rule || {};

            var wrapVip = function wrapVip(obj) {
                return {
                    is_old: true,
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange', // lottery or exchange
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            var wrapVirtualPrize = function wrapVirtualPrize(obj) {
                return {
                    is_old: Number(obj.time) < 1482768000, // 2016.12.27 00:00:00这个时间点之后兑换的礼品都是新版本的
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            var wrapRealPrize = function wrapRealPrize(obj) {
                return {
                    is_old: Number(obj.time) < 1482768000, // 2016.12.27 00:00:00这个时间点之后兑换的礼品都是新版本的
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            list = _deepClone(qzRecords.list || []);
            // 联合两个记录，格式化微云会员兑换记录
            for (i = 0, len = (wyRecords.records || []).length; i < len; i++) {
                item = wyRecords.records[i];
                list = list.concat({
                    time: item.redeem_time,
                    prizename: '微云会员（1个月）',
                    cost_point: item.cost_point,
                    goods_id: item.goods_id,
                    // 微云会员没走营收活动平台，自定义为1000001
                    prizeid: 1000001,
                    ruleid: 1000001,
                    type: 111 //虚拟物品 401， 实物 105， 微云会员 111
                })
            }
            // 按时间排序
            list = _.sortBy(list, 'time').reverse();

            // 生成数据模型
            for (i = 0, len = list.length; i < len; i++) {
                item = list[i];
                switch (item.type) {
                    case 111:
                        result.push(wrapVip(item));
                        break;
                    case 401:
                        result.push(wrapVirtualPrize(item));
                        break;
                    case 105:
                        result.push(wrapRealPrize(item));
                        break;
                }
            }

            return result;
        }

        return {
            // 首页vm模型
            getIndexModel: function () {
                return {
                    __signInModel: getSignInModel(data.signInInfo),
                    __giftListModel: getIndexGiftListModel(data.goodsList)
                }
            },

            getMorePrizeListModel: function () {
                return {
                    __morePrizeListModel: getMorePrizeListModel(data.goodsList)
                }
            },

            getGoodsDetailModel: function () {
                return {
                    __goodsDetailModel: getGoodsDetailModel(data.goodsList, data.signInInfo)
                }
            },

            getExchangeSuccessModel: function () {
                return {
                    __exchangeSuccessModel: getExchangeSuccessModel(data.goodsList, data.address)
                }
            },

            getAddressModel: function () {
                return {
                    __addressModel: getAddressModel(data.address)
                }
            },

            getHistoryModel: function () {
                return {
                    __historyModel: getHistoryModel(data.qzRecords, data.wyRecords, data.goodsList)
                }
            }
        }
    }
});