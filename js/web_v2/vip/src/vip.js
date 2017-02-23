define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = common.get('./module'),
        huatuo_speed = common.get('./huatuo_speed');

    var ad_link = require('./ad_link'),
        store = require('./store'),
        ui = require('./ui'),
        Mgr = require('./Mgr'),
        ar = require('./ar'),

        undefined;

    var mgr = new Mgr({
        store: store,
        view: ui,
        ar: ar
    });

    var vip = new Module('vip', {

        /**
         * 页面初始化
         * @param {Object} serv_rsp 直出的数据
         */
        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            store.init(serv_rsp);
            ad_link.render();
            ui.render();


            var point_key;
            switch (window.g_which_page) {
                case 'vip' :
                    point_key = '21378-1-1';
                    break;
                case 'growth':
                    point_key = '21378-1-2';
                    break;
                case 'privilege':
                    point_key = '21378-1-4';
                    break;
                default:
                    point_key = '21378-1-1';
            }

            $(document).ready(function () {
                huatuo_speed.store_point(point_key, 23, window.g_dom_ready_time - (huatuo_speed.base_time || window.g_start_time)); // dom ready
                huatuo_speed.store_point(point_key, 24, +new Date() - (huatuo_speed.base_time || window.g_start_time)); // active
                huatuo_speed.report(point_key, true);
            })
        }
    });


    return vip;
});