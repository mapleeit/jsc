/**
 * 中转站工具栏模块
 * @author hibincheng
 * @date 2015-05-08
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        station_info = require('./header.station_info'),

        undefined;

    var toolbar = new Module('station_toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl.toolbar()).appendTo($ct);
                station_info.render(this.$el);
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
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