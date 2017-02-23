/**
 * 离线文件初次使用引导
 * @author hibincheng
 * @date 2013-11-25
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        remote_config = common.get('./remote_config'),
        ui_offline = require('./file_list.ui_offline'),
        tmpl = require('./tmpl'),

        enable_guide_key = 'is_offline_user_first_access', //是否要引导的key字段名


        undefined;

    //require('offline_guide_css');
    var offline_guide = new Module('offline_guide', {

        render: function() {
            if(this._rendered) {
                return;
            }
            //remote_config.set(enable_guide_key, '');//字符串类型
            var me = this;
            var def = remote_config
                .get(enable_guide_key)
                .done(function(values) {
                    if(!values[0][enable_guide_key]) {
                        me._init_guide();
                    }
                });

            this.listenTo(ui_offline, 'offline_destroy', function() {
                def && def.abort();//退出离线文件了，异步请求还没返回，则要abort掉
            });

            this._rendered = true;
        },

        /**
         * 展示引导图
         * @private
         */
        _init_guide: function() {
            var $el = $(tmpl.offline_guide()).appendTo($('body')),
                me = this;

            widgets.mask.show('offline_guide_mask', $el);
            $el.show();
            $el.on('click', '[data-id=close]', function(e) {
                e.preventDefault();
                $el.remove();
                me.set_offline_guide_done();
                me.stopListening(ui_offline, 'offline_destroy');
                widgets.mask.hide('offline_guide_mask');
            });
        },
        /**
         * 在服务端保存已引导过了，下次不用再显示了
         */
        set_offline_guide_done: function() {
            remote_config.set(enable_guide_key, 'true');//字符串类型
        }
    });


    return offline_guide;
});