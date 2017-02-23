/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),

        tation_info = require('./header.station_info'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        undefined;

    var toolbar = new Module('header.toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl.toolbar()).appendTo($ct);
                tation_info.render(this.$el);
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                //console.log('toolbar/_bind_action:' + action_property_name);
                me.trigger('action', $target.attr(action_property_name), e);
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return toolbar;

});