/**
 * vip store module
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var Module = lib.get('./Module'),
    
        undefined;
        
    var store = new Module('store', {
        init: function (data) {
            var me = this;

            me.data = data;
        },


        //区分会员页还是等级页
        is_grow: function() {
            return this.data['type'] === 'grow';
        },

        get_level_info: function() {
            return this.data['vipLevelInfo'] || {};
        },

        get_score_list: function() {
            return this.data['growthScoreList'] || {};
        }
    });

    return store;
});