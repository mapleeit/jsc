/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:29
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        collections = lib.get('./collections'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),
        action_property_name = 'data-action',
        user_log = common.get('./user_log'),
        undefined;

    var Toolbar = inherit(Event, {
        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl['note_toolbar']()).appendTo($ct);
                this.bind_action();
                this.rendered = true;
            }
        },
        /**
         * 绑定action事件
         */
        bind_action: function() {
            var me = this;
            me.current_item_map = me.current_item_map || {};
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                var action_name = $target.attr(action_property_name);
                me.trigger('action', action_name);
                switch(action_name){
                    case 'create':
                        user_log('NOTE_CREATE');
                        break;
                    case 'share':
                        user_log('NOTE_SHARE');
                        break;
                    case 'delete':
                        user_log('NOTE_DELETE');
                        break;
                }
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return Toolbar;

});
