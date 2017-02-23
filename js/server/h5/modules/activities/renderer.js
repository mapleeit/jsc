/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

var renderer = {

    baseHeader: function() {
        return tmpl.baseHeader();
    },

    baseBottom: function(data) {
        return tmpl.baseBottom(data);
    },

    actList: function(data) {
        return tmpl.act_first(data) + tmpl.act_second(data);
    },

    //对goods数据进行预处理，主要是加上是否展示和是否兑换的标志
    formatGoods: function(qzGoods, qzRecords) {
        var list = qzGoods['data']['rule'],
            records = qzRecords['data']['list'];
        for(var key in list) {
            list[key].has_exchange = this.has_exchange(key, records);
            list[key].visible = this.is_visible(key) && !this.is_expired(list[key]);
        }
        qzGoods['data']['rule'] = list;
        return qzGoods;
    },

    //对records数据进行预处理，主要是加上积分和价格等
    formatRecords: function(qzRecords, qzGoods) {
        var record,
            index = 0,
            arr = [],
            list = qzGoods['data']['rule'],
            records = qzRecords['data']['list'];
        for(var i=0; i<records.length; i++) {
            record = records[i];
            record.score = 0;
            record.price = 0;
            for(var key in list) {
                if(parseInt(key) === record.ruleid) {
                    record.score = list[key].score;
                    arr = list[key].name.match(/\d+/g);
                    index = list[key].name.indexOf('京东') > -1? 1 : 0;
                    record.price = (arr && arr.length)? parseInt(arr[index]) : 0;
                    break;
                }
            }
        }
        return records;
    },

    //奖品是否展示 在这里控制奖品的开放入口。 2017是测试用奖品
    is_visible: function(ruleId) {
        var goodMap = {'1': 1, '2013':1, '2014': 1, '2015': 1, '2016': 1};
        return !!goodMap[ruleId];
    },

    //奖品是否已过期
    is_expired: function(qzGoods) {
        var now = +new Date() / 1000;
        if(now > qzGoods.starttm && now < qzGoods.endtm) {
            return false;
        }
        return true;
    },

    //奖品里没有是否已经兑换过的标志，这里需要判断一遍
    has_exchange: function(ruleId, qzRecords) {
        if(!qzRecords || qzRecords.length === 0) {
            return false;
        }
        for(var i=0; i<qzRecords.length; i++) {
            if(parseInt(ruleId) === qzRecords[i].ruleid) {
                return true;
            }
        }
        return false;
    },

    personalRender: function() {
        var headerHtml = this.baseHeader();
        var fileHtml = tmpl.personal();
        var baseBottomHtml = this.baseBottom({});

        return headerHtml + fileHtml + baseBottomHtml;
    },

    historyRender: function(qzGoods, qzRecords, wyRecords) {
        qzRecords = (qzRecords && qzRecords.data['total']>0)? this.formatRecords(qzRecords, qzGoods) : [];
        wyRecords = (wyRecords && wyRecords['records'] && wyRecords['records'].length>0)? wyRecords['records'] : [];
        var data = wyRecords.concat(qzRecords);
        for(var i=0; i<data.length; i++) {
            data[i].visible = this.is_visible(data[i].ruleid || data[i].goods_id);
        }
        var headerHtml = this.baseHeader();
        var fileHtml = tmpl.history(data);
        var baseBottomHtml = this.baseBottom(data);

        return headerHtml + fileHtml + baseBottomHtml;
    },

    addressRender: function(data) {
        var headerHtml = this.baseHeader();
        var fileHtml = tmpl.address(data);
        var baseBottomHtml = this.baseBottom(data.data);

        return headerHtml + fileHtml + baseBottomHtml;
    },

    orderRender: function() {
        var headerHtml = this.baseHeader();
        var fileHtml = tmpl.order();
        var baseBottomHtml = this.baseBottom({});

        return headerHtml + fileHtml + baseBottomHtml;
    },

    render: function(data) {
        data.goodsList = this.formatGoods(data.goodsList, data.qzRecords);
        var headerHtml = this.baseHeader();
        var fileHtml = this.actList(data);
        var baseBottomHtml = this.baseBottom(data);

        return headerHtml + fileHtml + baseBottomHtml;

    }
}

module.exports = renderer;