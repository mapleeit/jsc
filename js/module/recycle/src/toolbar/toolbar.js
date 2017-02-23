/**
 * 回收站工具条
 * @author unitwang
 * @date 13-8-26
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),


        rec_list = require('./rec_list.rec_list'),
        selection = require('./rec_list.selection.selection'),

        toolbar,
        nil = '请选择文件',
        status,

        undef;

    var tbar = new Module('recycle_toolbar', {

//        ui: require('./toolbar.ui'),

        render: function ($to) {
            var btns = [
                //还原
                new Button({
                    id: 'restore',
                    label: '还原',
                    cls: 'btn btn-restore',
                    icon: 'ico ico-restore',
                    handler: function () {
                        rec_list.restore_files();
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_RESTORE');
                    },
                    validate: function () {
                        if (selection.get_selected_files().length === 0) {
                            return [nil, 'ok'];
                        }
                    }
                }),
                //清空回收站
                new Button({
                    id: 'emptyrecycle',
                    label: '清空回收站',
                    icon: 'ico ico-emptyrecycle',
                    handler: function () {
                        widgets.confirm('清空回收站', '确定清空回收站吗？', '清空后将无法找回已删除的文件', function () {
                            if (rec_list) {
                                rec_list.clear_files();
                            }
                        }, $.noop, ['确定']);
                    },
                    before_handler: function () {
                        user_log('TOOLBAR_RECYCLE_CLEAR');
                    },
                    validate: function () {
                        if (!rec_list.has_files()) {
                            return ["您的回收站内没有文件", 'ok'];
                        }
                    }
                }),
                //刷新
                new Button({
                    id: 'refresh',
                    label: '',
                    icon: 'ico ico-ref',
                    handler: function () {
                        global_event.trigger('recycle_refresh');
                    }
                })
            ];

            toolbar = new Toolbar({
                cls: 'recycle-toolbar',
                btns: btns
            });

            toolbar.render($to);

            var $btns = toolbar.get_$el().children().detach();

            var $wrapper = $('<div class="inner"/>').appendTo(toolbar.get_$el());
            $btns.appendTo($wrapper);

            var user = query_user.get_cached_user();
            var is_vip = user && user.is_weiyun_vip();
            var expire = user && user.get_recycle_nonvip_tip();
            var vip_expire = user && user.get_recycle_vip_tip();
            var vip_info = user && user.get_weiyun_vip_info() || {};
            var vip_level = (is_vip && vip_info && vip_info.weiyun_vip_level_info && vip_info.weiyun_vip_level_info.level) ? vip_info.weiyun_vip_level_info.level : 0;
            var textString = is_vip
                ? '您是微云LV' + vip_level + '级用户，专享回收站文件保存' + vip_expire + '天'
                : '文件保存' + expire + '天，会员专享最长保存' + vip_expire + '天 ' + '<a href="' + constants.GET_WEIYUN_VIP_URL + 'from%3D1019' + '" target="_blank" style="color: #2688EA;">开通会员</a>';
            $('<div class="infor">' + textString + '</div>').appendTo($wrapper);
        },

        get_$el: function () {
            return toolbar.get_$el();
        }
    });

    return tbar;
});