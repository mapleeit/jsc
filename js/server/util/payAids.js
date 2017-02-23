/**
 * 支付页面的aid配置
 * @author xixinhuang
 * @date 2016/10/22
 *
 */

var browser = require('weiyun/util/browser');

var config = {
    //默认aid
    'default': {
        h5: 'h5_head_pay',
        web: 'web_vip_center'
    },
    //直接跳转支付页pay.qq.com，这里是统一收集在这里，方便查阅
    //direct: {
    //
    //},
    app: {
        android:'an_wyvip_introduce',                 //android微云app里会员页面
        ios:'gf_wyvip_introduce'                      //ios微云app里会员页面
    },
    h5: {
        qq_mail: 'qqmail_limit_mobile',               //手机QQ邮箱转存文件超限
        public: 'weixin_public_tips',               //微云公众号催费提醒
        qq_browser: 'qqbrowser_limit',                //手机QQ浏览器上传到微云受限
        public_vipcenter: 'weixin_public_vipcenter',  //微云公众号会员入口
        qqvip_privilege: 'qqvip_privilege',           //手Q里QQ会员专享特权页面，跳转微云H5会员页，入口URL：http://mc.vip.qq.com/privilegelist/index
        share: 'h5_head_pay',                         //H5分享页头像转去会员支付
        capacity_purchase: 'h5_capacity_purchase'     //H5容量购买页面转去会员支付
    },
    web: {
        mac: 'mac_vip_center',                          //mac客户端会员中心
        web: 'web_vip_center',                          //web网页版会员中心
        web_menu: 'web_menu_pay',                       //web容量面板页面开通按钮
        web_speedup: 'web_speedup',                     //web上传加速
        web_btdownload: 'web_wyvip_btdownload',         //web离线下载
        web_limit: 'web_limit_pay',                     //web上传受限时去开会员
        web_recycle_empty_view: 'web_old_wyvip_recyclebinemptyview', //web旧版，回收站空页面，跳转会员页面
        web_recycle_top_bar: 'web_old_wyvip_recyclebinvipbar', //web旧版，回收站上方提示bar，跳转会员页面
        web_capacity: 'web_wyvip_shrink_transfer_yellow_bar', //web容量受限去开会员
        capacity_purchase: 'web_capacity_purchase',     //web容量购买页面转去会员支付，注意：在异步中调用了，全局搜索web_capacity_purchase
        qq_tips: 'qqtips',                              //QQ催费提示
        qq_mail: 'qqmail_limit_pc',                     //QQ邮箱转存时超限
        qq_allinone: 'qqchat_limit',                    //window QQ转存文件超限时跳转会员页
        share: 'web_head_pay',                          //web分享页头像
        pc: 'pc_menu_pay',                              //window客户端菜单里开通/续费会员
        pc_limit: 'pc_limit_pay',                       //window客户端上传受限去开会员
        pc_center: 'pc_vip_center',                     //window客户端会员中心
        pc_speedup: 'pc_speedup',                       //window客户端加速上传开会员
        pc_qboss: 'pc_qboss_pay',                       //window客户端广告位直接到pay支付页
        pc_capacity: 'pc_wyvip_shrink_transfer_yellow_bar' //window客户端容量受限去开会员
    }
};

module.exports = {
    /**
     * 获取aid字段，可以用 或者get('web.mac')，不区分大小写
     * @example
     * var appid = require('weiyun/util/payAids');
     * module.exports = {
     *      payAids.get('web', 'mac')
     *      payAids.get('web.mac')
     * }
     * 注意，在直出模版里把AID定义好，异步js里不再定义此变量,直接使用window.AID。具体可参考appid的做法
     * @example
     * window.AID = require('weiyun/util/payAids').get('web.mac');
     *
     * @param type
     * @param key
     * @returns {*}
     */
    get: function(type, key) {
        var arr = [];
        var _browser = browser();
        if(!key) {
            arr = type.toLowerCase().split('.');
        } else {
            arr = [type.toLowerCase(), key.toLowerCase()];
        }
        if(arr.length > 1 && config[arr[0]] && typeof config[arr[0]][arr[1]] == 'string') {
            return config[arr[0]][arr[1]];
        }

        return _browser.mobile? config['default']['h5'] : config['default']['web'];
    },

    get_default_aid: function() {
        var _browser = browser();
        return _browser.mobile? config['default']['h5'] : config['default']['web'];
    },

    get_all_aids: function() {
        return config;
    }
}
