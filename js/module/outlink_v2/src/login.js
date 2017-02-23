/**
 * 新版PC侧分享页
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        session_event = common('./global.global_event').namespace('session'),

        undefined;

	var qq_login,
		qq_login_ui;
    var login = new Module('outlink.login', {

        init: function() {
            this.listenTo(session_event, 'session_timeout', this.to_login);
        },

        to_login: function() {
            var me = this;
	        if(qq_login) {
		        qq_login.show();
	        } else {
		        require.async('qq_login', function(mod) {
			        qq_login = mod.get('./qq_login');
				    qq_login_ui = qq_login.ui;

			        me
				        .stopListening(qq_login)
				        .stopListening(qq_login_ui)
				        .listenTo(qq_login, 'qq_login_ok', function() {
					        me.trigger('login_done');
				        })
				        .listenToOnce(qq_login_ui, 'show', function() {
					        widgets.mask.show('qq_login', null, true);
				        })
				        .listenToOnce(qq_login_ui, 'hide', function() {
					        widgets.mask.hide('qq_login');

					        me.stopListening(qq_login_ui);
				        });

			        qq_login.show();
		        });
	        }
        }

    });

    return login;
});