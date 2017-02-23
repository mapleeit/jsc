/**
 * 组视图界面
 * @author trump
 * @date 2013-11-06
 */
define(function (require, exports, module) {
    var inherit = require('lib').get('./inherit'),
        user_log = require('common').get('./user_log'),
        $ = require('$');

    var Module = inherit(require('./View_mode'), {
        inspect: function () {
            var me = this;
            if (me.store) {
                return;
            }
            me.store = require('./time.store');
            me.view = require('./time.view');
            me.view.set_thumb_loader(this.thumb_loader);
            me.listenTo(me.store, 'change', function (event, args) {
                var view_fn = this.view[ 'on_' + event ];
                if (typeof view_fn == 'function') {
                    view_fn.apply(this.view, args);
                }
            });
            me.listenTo(me.view, 'change', function (event, args) {
                var store_fn = this.store['on_' + event];
                if (typeof store_fn == 'function') {
                    store_fn.apply(this.store, args);
                }
            });
        },
        on_activate: function () {
            var me = this;
            me.inspect();
            me.view.render(me.$ct);
            me.store.render();
        },
        on_deactivate: function () {
            this.store.destroy();
            this.view.destroy();
        },

        get_toolbar_meta: function () {
            return {
                batch_delete: 1
            };
        },
        on_toolbar_act: function (act) {
            if(this.view[act]){
                this.view[act].call(this.view);
            }
        },
        on_refresh : function(){
            var me = this;
            Module.superclass.on_refresh.apply(this, arguments);
            me.store.render(true);
        }
    });
    return Module;
});