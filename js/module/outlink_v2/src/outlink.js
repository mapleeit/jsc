/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
	    huatuo_speed = common.get('./huatuo_speed'),
        store = require('./store'),
        header = require('./header.header'),
        ad_link = require('./ad_banner.ad_link'),
        file_path,
        mgr = require('./mgr'),

        ui,
        undefined;

    var outlink = new Module('outlink_v2', {

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
            header.render();
            ad_link.render();

            var share_type = store.get_type();
            if(share_type == 'file_list') {
                ui = require('./ui.file_list');
                file_path = require('./file_path.file_path');
                file_path.render();
            } else if(share_type == 'photo') {
                ui = require('./ui.photo');
                if (store.get_cur_node().get_kid_count() > 1) {
                    file_path = require('./file_path.file_path');
                    file_path.render();
                }
            } else {
                ui = require('./ui');
            }

            ui.render();

            mgr.init({
                header: header,
                file_path: file_path,
                view: ui
            });

            if(share_type == 'file_list' || share_type == 'photo') {
                // 初始化一些全局兼容性修正
                common.get('./init.init')();
            }

            this.speed_time_report();

            require.async(['dimensional_code_css', 'link_css'])
        },

        /**
         * 测速上报
         */
        speed_time_report: function() {
	        //测速点上报
	        var flag = '21254-1-28';

	        $(document).ready(function () {
                huatuo_speed.store_point(flag, 23, window.g_dom_ready_time - (huatuo_speed.base_time || windows.g_start_time)); // dom ready
                huatuo_speed.store_point(flag, 24, new Date() - (huatuo_speed.base_time || windows.g_start_time)); // active
                huatuo_speed.report(flag, true);
            });
        }
    });

    return outlink;
});