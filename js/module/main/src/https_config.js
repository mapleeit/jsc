/**
 * https模式设置
 * @author hibincheng
 * @date 2014-09-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        cookie = lib.get('./cookie'),
        Module = common.get('./module'),
        cloud_config = common.get('./cloud_config'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),

        HTTPS_CLOUD_CONFIG_KEY = 'is_use_https',

        undefined;

    var https_config = new Module('https_config', {

        render: function() {
            var me = this,
                is_https = constants.IS_HTTPS;

            cookie.unset('ssl',{
                domain: 'www.weiyun.com',
                path: '/'
            });

            if(constants.IS_QZONE) {
                me._get_$https_config().hide();
            }
            cloud_config.get(HTTPS_CLOUD_CONFIG_KEY).done(function(data) {
                //debugger;
            })
            me._get_$https_config().on('click', function(e) {
                e.preventDefault();
                var desc = !is_https ? '是否开启https模式？' : '是否关闭https模式？',
                    sub_desc = !is_https ? 'https能加密保护您在微云的所有操作以及传输的数据，开启后重新进入才能生效。' : '关闭后重新进入才能生效。';
                if(!is_https && $.browser.msie && $.browser.version < 9) {
                    sub_desc = '请升级为Chrome浏览器或高版本IE浏览器才能生效。';
                }
                widgets.confirm('设置https模式', desc, sub_desc, function() {
                    cloud_config
                        .set(HTTPS_CLOUD_CONFIG_KEY, !is_https ? 'true' : '')
                        .done(function() {
                            mini_tip.ok('设置成功');
                            is_https = !is_https; //设置后取反
                            me._toggle_btn_desc(is_https);
                        })
                        .fail(function(msg) {
                            mini_tip.warn(msg || '设置失败');
                        });
                }, $.noop,[!is_https?'开启':'关闭', '取消']);
            }).find('span').toggle(!is_https);

            if(is_https) { //统计https使用情况
                user_log('HTTPS_USE');
            }
        },

        _toggle_btn_desc: function(is_https) {
            this._get_$https_config().find('span').toggle(!is_https);
        },


        _get_$https_config: function() {
            return $('#_main_https_config');
        }
    });

    return https_config;
});