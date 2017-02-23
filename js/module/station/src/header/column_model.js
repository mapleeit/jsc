/**
 * 中转站表头模块
 * @author hibincheng
 * @date 2015-05-08
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        Scroller = common.get('./ui.scroller'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        current_has_scrollbar = false,

        undefined;

    var column = new Module('station_column', {

        render: function($ct) {

            if(!this.rendered) {
                this.$el = $(tmpl.columns()).appendTo($ct);
                this._$ct = $ct;
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', this.$el);
                if($target.is('[data-action=checkall]')) {
                    $target.toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    me.trigger('action', 'checkall', checkalled, e);
                } else {
                    me.trigger('action', $target.attr(action_property_name), e);
                }
            });
        },
        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
                this.trigger('action', 'change_checkall', new_checkalled);
            }
        },
        //取消全选
        cancel_checkall: function() {
            if(this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, false);
                checkalled = false;
            }
        },
        //是否已全选
        is_checkalled: function() {
            return checkalled;
        },
        /**
         * 当内容区出现滚动条时，要修正表头宽度，不然会出现不对齐现象
         * @param {Boolean} has_scrollbar 是否出现了滚动条
         */
        sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this.$el.find('.files-head').css('paddingRight', padding_right + 'px');//需要同步滚动条宽度不会很常操作，一般就一次，直接用选择器了
            current_has_scrollbar = has_scrollbar;

        },

        show: function() {
            this.$el.show();
            if(constants.UI_VER === 'WEB') {
                this._$ct.show();
            }
        },

        hide: function() {
            this.$el.hide();
            if(constants.UI_VER === 'WEB') {
                this._$ct.hide();
            }
        },

        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        }
    });

    return column;

});