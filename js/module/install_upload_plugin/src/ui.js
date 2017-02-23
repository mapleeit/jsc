/**
 * 上传控件安装UI
 * @author yuyanghe
 * @date 13-7-26
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
	    constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),

        main_ui,

        install=require('./install'),

        undefined;

    var ui = new Module('install_ui', {

        render: function () {
            var me=this;
            if(!constants.IS_APPBOX && $.browser.chrome) {
                return;
            }
            //绑定浮层的关闭按钮
            $('#_upload_plugin_install_ct [data-id=close]').on('click',function(){
                me.trigger('hide');
                upload_event.trigger('upload_dialog_show');
                return false;
            });
            //安装成功界面确定按钮
            $('#install_success_ok').on('click',function(){
                me.trigger('hide');
                upload_event.trigger('upload_dialog_show');
                return false;
            });
            //安装成功界面 关闭按钮事件绑定

//            $('#install_succ_close').off('click');
//            $('#install_succ_close').on('click',function(){
//                    me.trigger('hide');
//                    upload_event.trigger('upload_dialog_show');
//                    //刷新页面
//                    me.trigger('reload');
//                    return false;
//            });

            $('#install_succ_ok').on('click',function(){
                me.trigger('hide');
                return false;
            });

            //绑定开始安装界面按钮
            $('#install_ui_start').on('click',function(){
                //OZ上报
                user_log('PLUGIN_POP_PANEL_INSTALL');
                me.trigger('install_process');
            })

            //绑定安装过程界面事件绑定按钮
            //点击此处重新安装
            var $_process_ok=$('#install_ui_process_ok');
            //再次安装按钮
//            $('#install_ui_process_restart').on('click',function(){
//                user_log('PLUGIN_POP_PANEL_REINSTALL');
//                me.trigger('install_start');
//                return false;
//            });

            //我已安装成功按钮
            $_process_ok.on('click',function(){
                user_log('PLUGIN_POP_PANEL_SUCCESS');
                me.trigger('install_check_success');
                setTimeout(function(){
                    me.trigger('check_result')
                }, 1500);
                return false;
            });
            //下载失败界面操作
            //确认按钮
            $('#install_fail_download').on('click',function(){
                user_log('PLUGIN_POP_PANEL_FAIL_REINSTALL');
                me.trigger('install_process');
            });

        },
        /*  安装浮窗显示
         *  @params 浮动窗口的对象
         */
        show: function ($Item) {
            this._$el=$Item;
            this._$el.stop(false, true).fadeIn('fast');
            center.listen(this._$el);
            main_ui = require('main').get('./ui');

            if (main_ui && main_ui.is_visible && main_ui.is_visible()) {
                widgets.mask.show('upload_install', this._$el, true);
            }
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });
                widgets.mask.hide('upload_install', this._$el, true);
                this._$el=null;
            }
            return false;
        }

    });

    return ui;
});




