/**
 * 剪贴板模块 TabBar
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        undefined;

    var TabBar = inherit(Event, {

        activeIndex: 0,
        active_cls: 'on',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            if(this._rendered) {
                return;
            }

            this._$ct = $(tmpl.tab_bar({
                items: this.items
            })).appendTo($render_to);

            var me = this;
            this._$ct.on('click', '[data-bar]', function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr('data-index'), 10);
                if(index !== me.activeIndex) {
                    me.trigger('switch', index, me.activeIndex);
                    me.activate(index);
                }
            });
            main_ui.sync_size();

            this._rendered = true;
        },

        /**
         * 切换tab
         * @param index
         */
        activate: function(index) {
            $bars = this._$ct.find('li');
            $bars.filter(':eq('+this.activeIndex+')').removeClass(this.active_cls);
            $bars.filter(':eq('+index+')').addClass(this.active_cls);
            this.activeIndex = index;
        },

        get_$ct: function() {
            return this._$ct;
        },

        destroy: function() {
            this._$ct.remove();
            this._$ct = null;
            this.$render_to = null;
            this.items = null;
        }
    });

    return TabBar;
});