/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        router = lib.get('./router'),
        widgets = common.get('./ui.widgets'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        select_mode = require('./select_mode'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('ui.file_list', {

        render: function() {
            this.render_list();
            this.bind_action();
            image_lazy_loader.init('#container');
            router.init('root');
            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });
        },

        render_list: function() {
            var me = this;
            var is_move = false;
            this.get_$file_list().on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            this.get_$file_list().on('touchend', '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $target = $(e.target).closest('[data-id=item]'),
                    src = $target.find('.icons').attr('data-src');
                if(me.batch_operating) {
                    select_mode.toggle_select($target.attr('id'));
                    $target.toggleClass('checked');
                    me.get_$confrim_btn().toggleClass('btn-disable', select_mode.is_empty());
                }else if(src) { //图片则进行预览
                    me.preview_img(src, $target.attr('id'));
                } else {
                    me.trigger('action', $target.attr('data-action'), $target.attr('id'), e);
                }
            })
        },

        preview_img: function(src, file_id) {
            this.get_$ct().hide();
            this.get_$banner().hide();
            this.previewer = new Previewer(file_id);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        back_to_list: function() {
            this.previewer.destroy();
            this.stopListening(this.previewer);
            this.previewer = null;
            this.get_$ct().show();
            this.get_$banner().show();
        },

        bind_action: function() {
            var me = this;
            //批量操作按钮
            this.get_$ct().find('[data-id=bbar_normal],[data-id=bbar_confirm]').on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();
                if(action_name === 'save_all') {
                    me.trigger('action', action_name, e);
                    return;
                }
                if(action_name !== 'cancel' && select_mode.is_empty() && me.batch_operating) {
                    return;
                }
                if(!me.toggle_batch(action_name)) {
                    var selected_items = select_mode.get_selected_items();
                    if(action_name !=='cancel' && selected_items.length) {
                        me.trigger('action', action_name, selected_items, e);
                    }
                    select_mode.clear();
                }
            });
        },

        toggle_batch: function(action_name) {
            var $item_list = this.get_$ct().find('[data-id=item]'),
                me = this;
            $item_list.each(function(i,item) {
                var $item = $(item);
                if(!me.batch_operating) {
                    $item.addClass('choseable checked');
                    select_mode.toggle_select($item.attr('id'));
                } else {
                    $item.removeClass('choseable checked');
                }
            });

            if(!me.batch_operating) {
                me.get_$file_list().addClass('active').removeClass('unactive');
                me.get_$ct().find('[data-id=bbar_normal]').hide();
                me.get_$ct().find('[data-id=bbar_confirm]').show().find('[data-id=confirm]').attr('data-action', action_name);
            } else {
                me.get_$file_list().removeClass('active').addClass('unactive');
                me.get_$ct().find('[data-id=bbar_normal]').show();
                me.get_$ct().find('[data-id=bbar_confirm]').hide();
                me.get_$confrim_btn().toggleClass('btn-disable', false);
            }
            me.batch_operating = !me.batch_operating;
            return me.batch_operating;
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$file_list: function() {
            return this.$file_list = this.$file_list || (this.$file_list = $('#file_list'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});