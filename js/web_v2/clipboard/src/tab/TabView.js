/**
 * 剪贴板模块 TabView
 * @author iscowei
 * @date 2016-07-18
 */
define(function(require, exports, module) {
    var $ = require('$'),
	    lib = require('lib'),
        common = require('common'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
	    huatuo_speed = common.get('./huatuo_speed'),

        TabBar = require('./tab.TabBar'),
        tmpl = require('./tmpl'),
        main_ui = require('main').get('./ui'),
        undefined;

    var TabView = inherit(Event, {

        activeIndex: 0,//默认显示tab 的index

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            var tab_bar,
                activeIndex;

            if(this._rendered) {
                return;
            }

            tab_bar = [];
            activeIndex = this.activeIndex;

            this._$ct = $(tmpl.tab_view()).appendTo($render_to);
	        this._$fr = this.$frame_to;

            //从tab items取title作为tabbar
            $.each(this.items, function(i, item) {
                tab_bar.push({
                    title: item.title,
                    cls: 'tab-item',
                    active: i === activeIndex
                });
            });


            this.render_bar(tab_bar); //render tabbar
            this.activate(this.activeIndex);

           // this.on_render();

            this.bind_events();

           // this.trigger('after_render');

	        //测速
	        try{
		        var flag = '21254-1-20';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }

            this._rendered = true;
        },

        render_bar: function(bars) {
            this.tab_bar = new TabBar({
                $render_to: this.get_$ct(),
                items: bars,
                activeIndex: this.activeIndex,
                active_cls: 'on'
            });
        },

        on_render: $.noop,

        /**
         * 绑定事件
         */
        bind_events: function() {
            this.listenTo(this.tab_bar, 'switch', function(new_idx, old_idx) {
                this.switch_tab(new_idx, old_idx);
            });
        },

        /**
         * 切换tab
         * @param {Number} new_idx 要激活显示tab的下标
         * @param {Number} old_idx 当前显示tab的下标
         */
        switch_tab: function(new_idx, old_idx) {
            var items = this.items,
                old_tab = items[old_idx],
                new_tab = items[new_idx];

            old_tab.deactivate();
            //已经渲染则直接激活，否则要渲染
            if(new_tab.is_rendered()) {
                new_tab.activate();
            } else {
                new_tab.render(this.get_$fr());
            }
            this.activeIndex = new_idx;
        },

        is_activated: function() {
            return !!this._activated;
        },

        /**
         * 激活一个tab
         * @param {Number} activeIndex 要激活的tab index
         */
        activate: function(activeIndex) {
            var active_tab;
            if(this.is_activated()) {
                return;
            }
            if(this.activeIndex !== activeIndex) {
                this.tab_bar.activate(activeIndex);
                this.switch_tab(activeIndex, this.activeIndex);
            } else {
                active_tab = this.items[this.activeIndex];
                if(active_tab.is_rendered()) {
                    active_tab.activate();
                } else {
                    active_tab.render(this.get_$fr());
                }
            }

            this._activated = true;
        },

        /**
         * 当离开剪贴板模块时，对激活状态的tab进行deactivate处理
         */
        deactivate: function() {
            var active_tab = this.items[this.activeIndex];
            active_tab && active_tab.deactivate();

            this._activated = false;
        },

        get_$ct: function() {
            return this._$ct;
        },

	    get_$fr: function() {
		    return this._$fr;
	    },

        destroy: function() {
            $.each(this.items, function(i, item) {
                item.destroy();
            });

            this.tab_bar.destroy();
            this._$ct.remove();
	        this._$fr.remove();
            this._$ct = null;
	        this._$fr = null;
            this.$render_to = null;
        }
    });

    return TabView;
});