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
        tmpl = require('./tmpl'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        undefined;

    var column_model = new Module('column_model', {

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
                    //console.log('column_model/_bind_action:' + action_property_name);
                    me.trigger('action', 'checkall', checkalled, e);
                } else {
                    me.trigger('action', $target.attr(action_property_name), e);
                    //console.log('column_model/_bind_action:' + action_property_name);
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
                console.log('column_model/checkall:' + new_checkalled);
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

        make_checkall: function() {
            if(!this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, true);
                checkalled = true;
            }
        },

        //是否已全选
        is_checkalled: function() {
            return checkalled;
        },

        update: function() {

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

    return column_model;

});