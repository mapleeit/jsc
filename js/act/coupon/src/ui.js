define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        session_event = common.get('./global.global_event').namespace('session'),
        widgets = common.get('./ui.widgets'),
        IS_MOBILE = window.IS_MOBILE,
        undefined;

    var ui = new Module('ui', {
        init: function () {
            var me = this;

            if (me.hasLoaded) {
                return;
            }

            if(!IS_MOBILE){
                this.listenTo(session_event, 'session_timeout', this.to_login);
                this.set_full_year();
            }
            me.reminder = widgets.reminder;
            me.confirm = widgets.confirm;
            me._bind_events();

            me.hasLoaded = true;
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
                        var s_url = encodeURIComponent(location.href),
                            url = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent('http://weiyun.qzone.qq.com?from=1000&s_url=' + s_url);
                        location.href = url;
                    })
                    .listenToOnce(qq_login_ui, 'show', function () {

                    })
                    .listenToOnce(qq_login_ui, 'hide', function () {

                        me.stopListening(qq_login_ui);
                    });
                qq_login.show();
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

        _bind_events: function () {
            var me = this;

            me.get_$ct().on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    coupon_id = $target.closest('[data-coupon-id]').attr('data-coupon-id'),
                    coupon_type = $target.attr('data-coupon-type'),
                    action_name = $target.attr('data-action');

                if(action_name === 'buy_coupon' || action_name === 'use_coupon') {
                    me.trigger('action', action_name, {
                        coupon_id: coupon_id,
                        coupon_type: coupon_type
                    });
                    return;
                } else if(action_name === 'login') {
                    me.to_login();
                    return;
                }
                me.trigger('action', action_name, e);
            });
        },

        get_$ct: function() {
            return this._$ct || (this._$ct = $('.j-container'));
        }
    });

    return ui;
});