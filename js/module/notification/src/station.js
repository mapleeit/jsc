/**
 * 中转站通知提醒
 * @author hibincheng
 * @date 2015-05-26
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        routers = lib.get('./routers'),
        store = lib.get('./store'),
        request = common.get('./request'),
        widgets = common.get('./ui.widgets'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        cloud_config = common.get('./cloud_config'),

        tmpl = require('./tmpl'),

        undefined;

    var redhot_key = 'WY_WEB_TEMPORARY_FILE_RED_POINT';
    var guide_key = 'WY_WEB_TEMPORARY_FILE_USER_GUIDE_FLOAT';

    var red_dot = {

        start: function () {
            var me = this;
            cloud_config.get(redhot_key).done(function (values) {
                //if (!values[redhot_key].value) {
                //    var $station_red_dot = $('.trans-file .red-dot');
                //    $station_red_dot.show()
                //
                //    me.listenTo(routers, 'add.m', function(mod_name) {
                //        if (mod_name === 'station') {
                //            me.cancel();
                //        }
                //    }).listenTo(routers, 'change.m', function (mod_name) {
                //        if (mod_name === 'station') {
                //            me.cancel();
                //        }
                //    });
                //}

            });
        },

        cancel: function() {
            //$('.trans-file .red-dot').hide();
            //cloud_config.set(redhot_key, 'true');
        }
    };

    var guide = {

        render: function() {
            var me = this;
            cloud_config.get(guide_key).done(function (values) {
                if (!values[guide_key].value) {


                    me.$ct = $(tmpl.station_guide()).appendTo(document.body);

                    me.$ct.on('click', '[data-action=enter]', function(e) {
                        me.enter();
                    }).on('click', '[data-action=close]', function(e) {
                        //me.close();
                        me.enter();
                    });
                }

            });
        },

        enter: function() {
            this.$ct.remove();
            this.$ct = null;
            cloud_config.set(guide_key, 'true');
            routers.go({ m: 'station' });
        },

        close: function() {
            this.$ct.remove();
            this.$ct = null;
        }
    }

    $.extend(red_dot, events);

    return function() {

        red_dot.start();

        //guide.render();

        var user = query_user.get_cached_user();
        var desc = user.is_weiyun_vip() ? '' : '您可以<a href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>，最大可上传20G文件且永久保存';
        var date = (new Date()).getDate();
        var last_tip_date = store.get(query_user.get_uin() + '_notification_station');
        if(last_tip_date && last_tip_date == date) {//当天只提示一次
            return;
        }

        store.set(query_user.get_uin() + '_notification_station', date);

        request.xhr_get({
            url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
            cmd: 'TemporaryFileExpiredInfoGet',
            pb_v2: true
        }).ok(function(msg, body) {
            if(body['to_be_expired_file_count']) {

                widgets.confirm('提醒', '中转站有'+body['to_be_expired_file_count'] +'个文件即将过期', desc, function(e) {
                    routers.go({ m: 'station' });
                }, $.noop, ['查看', '取消'], false)
            };
        }).fail(function(msg, ret) {
            //失败就不管了
        });

    }
});