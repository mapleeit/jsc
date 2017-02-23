define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        cookie = lib.get('./cookie'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        session_event = common.get('./global.global_event').namespace('session'),
        mini_tip = common.get('./ui.mini_tip_v2'),

        undefined;

    return new Module('vip_ui', {

        render: function () {
            this.mini_tip = mini_tip;

            this.listenTo(session_event, 'session_timeout', this.to_login);
            this.set_nav_act();
            this.set_full_year();
            this._bind_events();
        },


        /**
         * 根据当前页面URL
         * 设置导航栏选中状态
         */
        set_nav_act: function () {
            var added = false;
            var page = location.pathname.split('/').pop().split('.')[0];
            $.map(this.get_$nav_list().find('li'), function (item, index) {
                if ($(item).data('page') === page) {
                    $(item).addClass('act');
                    added = true;
                }
            });

            if (page === 'announcement') { // 如果是公告页，那么久都不是选中态
                added = true;
            }
            // 其他各种奇怪的url都是默认weiyun_vip这个页面
            !added && this.get_$nav_list().find('li[data-page="weiyun_vip"]').addClass('act');
        },

        to_login: function() {
            var me = this;
            require.async('qq_login', function (mod) {
                var qq_login = mod.get('./qq_login'),
                    qq_login_ui = qq_login.ui;

                me
                    .stopListening(qq_login)
                    .stopListening(qq_login_ui)
                    .listenTo(qq_login, 'qq_login_ok', function () {
                        //me.trigger('login_done');
                        //location.reload();
                        var s_url = location.href;
                        location.href = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl='
                            + encodeURIComponent('http://jump.weiyun.qq.com?from=2000&s_url=' + encodeURIComponent(s_url));
                    })
                    .listenToOnce(qq_login_ui, 'show', function () {

                    })
                    .listenToOnce(qq_login_ui, 'hide', function () {
                        me.stopListening(qq_login_ui);
                    });
                qq_login.show();
            });
        },

        _bind_events: function() {
            var me = this;
            this.get_$ct().on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                switch (action_name) {
                    case 'close_qrcode':
                        me.get_$dialog().hide();
                        break;
                    case 'login':
                        me.to_login();
                        break;
                    case 'pay' :
                        var month = $target.attr('data-id');
                        me.trigger('action', action_name, month, e);
                        break;
                    case 'capacity_purchase':
                        var type = $target.closest('li').data('type');
                        me.trigger('action', action_name, type, e);
                        break;
                    default :
                        me.trigger('action', action_name, e);
                }
            });
        },

        set_full_year: function() {
            var year = 2015,
                $this_year = $('#this_year');
            if(new Date().getFullYear() > year) {
                year = new Date().getFullYear();
                $this_year.text(year);
            }
        },

        show_error_tips: function (err) {
            //this._$err.html(err).show();
            //this._$tip.hide();
        },

        get_$ct: function() {
            return this._$ct || (this._$ct = $('#container'));
        },

        get_$dialog: function() {
            return this._$dialog || (this._$dialog = $('.j-qr-dialog'));
        },

        get_$dialog_title: function() {
            return this._$dialog_title || (this._$dialog_title = $('.j-qr-dialog-title'));
        },

        get_$tips: function() {
            return this._$tips || (this._$tips = $('.j-tips'));
        },

        get_$nav_list: function() {
            return this._$nav_list || (this._$nav_list = $('.j-nav-list'));
        }
    });
});