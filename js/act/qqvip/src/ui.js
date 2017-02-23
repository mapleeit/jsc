define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        undefined;

    var ui = new Module('ui', {

        init: function() {
            if(this.hasLoaded) {
                return;
            }
            this._$ct = $('#container');
            this.bind_events();
        },

        bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    type = $target.attr('data-id'),
                    action_name = $target.attr('data-action');
                me.trigger('action', action_name, type);
            });
            this.hasLoaded = true;
        },

        show_err_tips: function(text) {
            $('.error-dialog .text').text(text);
            $('.error-dialog').show();
            setTimeout(function(){
                $('.error-dialog').hide();
            },2000);
        },

        jump_qq_vip: function() {
            var url = 'http://pay.qq.com/ipay/index.shtml?c=cjclub,ltmclub&aid=vip.gn.client.weiyun_hd_vip&ch=qdqb,kj,weixin';
            if(browser.IOS) {
                url = 'https://mc.vip.qq.com/qqwallet/index?_wv=3&aid=mios.gn.android.weiyun_hd_vip&type=svip';
            } else if(browser.android) {
                url = 'https://mc.vip.qq.com/qqwallet/index?_wv=3&aid=mvip.gn.android.weiyun_hd_vip&type=svip';
            }
            location.href = url;
        },

        jump_weiyun: function() {
            var url = '';
            if(browser.android || browser.IOS) {
                url = 'https://h5.weiyun.com/vip';
            } else {
                url = '//www.weiyun.com/vip/vip.html';
            }
            location.href = url;
        }
    });

    return ui;
});