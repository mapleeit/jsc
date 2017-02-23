/**
 * 工具栏基础类
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        collections = lib.get('./collections'),
        constants = common.get('./constants'),
        PopPanel = common.get('./ui.pop_panel'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',
        classes = {
            mtime: 'vm-time',
            az: 'vm-az'
        },

        undefined;

    var Toolbar = inherit(Event, {

        module_name: '',

        constructor : function(cfg){
            $.extend(this, cfg);
        },

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl[this.module_name+'_toolbar']()).appendTo($ct);
                this.init_current_tool();
                this.bind_action();
                this.rendered = true;
            }
        },
        /**
         * 初始化工具栏中的默认选项
         */
        init_current_tool: function() {
            this.current_item_map = {};
            //过滤类型默认为：全部
            this.current_item_map['filter'] = this.$el.find('[data-filter=all]').addClass('on');
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
                var action_data = $target.attr('data-' + action_name);
                var $last_click_item = me.current_item_map[action_name];

                if(action_name !== 'batch_delete' && $last_click_item) {
                    if($last_click_item[0] == $target[0]) {//重复点击，无效
                        return;
                    } else {
                        $last_click_item.removeClass('on');
                    }
                }
                $target.addClass('on');
                if(action_name !== 'refresh') {//刷新就一个按钮，无需判断是否切换
                    me.current_item_map[action_name] = $target;
                }
                me.trigger('action', action_name, action_data, e);
            });

            var $base_btn = this.$el.find('[data-id="sort"]'),
                $list = this.$el.find('[data-dropdown]'),
                $combine = $base_btn.add($list);

            // hover时显示列表，移出时隐藏
            var pop_panel = new PopPanel({
                host_$dom: $combine,
                $dom: $list,
                delay_time: 200
            });

            this
                .listenTo(pop_panel, 'show', function() {
                    $base_btn.addClass('vm-on');
                }).
                listenTo(pop_panel, 'hide', function() {
                    $base_btn.removeClass('vm-on');
                })

            var class_list = collections.values(classes).join(' ');

            // 点击视图列表中的item
            this.$el.on('click.view_switch', '[data-view]:not(.selected)', function (e) {

                var $btn = $(this),
                    view_name = $btn.attr('data-view');

                $btn.addClass('focus').siblings().removeClass('focus');
                $base_btn.removeClass(class_list).addClass(classes[view_name]);

                if (!scr_reader_mode.is_enable()) { // 针对读屏软件，不隐藏菜单 - james
                    $list.hide();
                }
                me.trigger('action', 'sort', view_name, e);
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