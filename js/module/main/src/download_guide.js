/**
 * 引导提示下载微云PC客户端
 * @author trumpli
 * @date 2014-01-22
 */
define(function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        remote_config = common.get('./remote_config'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        ua = navigator.userAgent.toLowerCase(),
        is_windows = ua.indexOf("windows") > -1 || ua.indexOf("win32") > -1,
        remote_key = 'is_download_guide_tip_0122_user_first_access'; //是否要引导的key字段名

    return new Module('download_guide', {

        render: function () {
            /*if (constants.IS_APPBOX || is_windows) {
                var me = this;
                remote_config
                    .get(remote_key)
                    .done(function (values) {
                        if (!values[0][remote_key]) {
                            me._init();
                        }
                    });
            }*/
        },

        /**
         * 展示引导图
         */
        _init: function () {
            var me = this;
            var url = 'http://www.weiyun.com/download.html?source=windows';
            if(constants.IS_APPBOX) {
                url = url + '&WYTAG=weiyun.app.appbox';
            } else {
                url = url + '&WYTAG=weiyun.app.web';
            }
            (me._$el = $(tmpl['download_guide']()).appendTo($('body')))
                .on('click', function (e) {
                    e.preventDefault();
                    window.open(url);//官网下载页面
                    me.set_download_guide_done(true);
                    //return false;
                })
                .find('[data-id="close"]').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    me.set_download_guide_done();
                    return false;
                });
        },

        /**
         * 在服务端保存已引导过了，下次不用再显示了
         * @param [to_link] {boolean}
         */
        set_download_guide_done: function (to_link) {
            this._$el.remove();
            remote_config
                .set(remote_key, 'true')
                .done(function () {
                    if (to_link) {
                        user_log('PC_GUIDE_DOWNLOAD_AD');
                    } else {
                        user_log('PC_GUIDE_DOWNLOAD_CLOSE');
                    }
                });
        }
    });
});