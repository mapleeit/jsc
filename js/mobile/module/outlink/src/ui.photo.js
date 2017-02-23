/**
 * 图列表ui模块
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
        image_loader = lib.get('./image_loader'),
        widgets = common.get('./ui.widgets'),

        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        select_mode = require('./select_mode'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('ui.photo', {

        render: function() {
            //单张图
            if(store.get_root_node().get_file_children().length === 1) {
                this.render_one_img();
            } else {
                this.render_img_list();
                router.init('root');
                this.listenTo(router, 'change', function(to, from) {
                    if(from === 'preview') {
                        this.back_to_list();
                    }
                });
            }
        },
        //单图使用
        render_one_img: function() {
            var me = this;
            //html已直出，只绑定事件即可
            this.get_$ct().on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = store.get_node_by_index(0).get_id();
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [file_id], e);
                }
            });
            $('[data-id=img]').width($(window).width());
        },
        //单图使用
        on_view_raw: function() {
            var raw_url = store.get_node_by_index(0).get_thumb_url();
            var $cur_img = $('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.replaceWith('<i id="_preview_loading" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {
                img.className = 'wy-img-preview';
                $(img).attr('data-size', 'raw');
                $('#_preview_loading').replaceWith(img);
            });
        },

        toggle_batch: function(action_name) {
            var $img_list = this.get_$ct().find('[data-id=img]'),
                me = this;
            $img_list.each(function(i, img) {
                var $img = $(img);
                $img.empty();
                if(!me.batch_operating) {
                    $img.append('<i data-id="check" class="icons icon-blue-checked"></i>');
                    select_mode.toggle_select($img.attr('id'));
                }
            });
            if(!me.batch_operating) {
                me.get_$ct().find('[data-id=bbar_normal]').hide();
                me.get_$ct().find('[data-id=bbar_confirm]').show().find('[data-id=confirm]').attr('data-action', action_name);
            } else {
                me.get_$ct().find('[data-id=bbar_normal]').show();
                me.get_$ct().find('[data-id=bbar_confirm]').hide();
                me.get_$confrim_btn().toggleClass('btn-disable', false);
            }
            me.batch_operating = !me.batch_operating;
            return me.batch_operating;
        },

        render_img_list: function() {
            var me = this;
            image_lazy_loader.init('#container');
            var is_move = false;
            this.get_$ct().on('touchmove', '[data-id=img]', function(e) {
                is_move = true;
            });
            this.get_$ct().on('touchend', '[data-id=img]',  function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $target = $(e.target).closest('[data-id=img]');
                if(me.batch_operating) {
                    select_mode.toggle_select($target.attr('id'));
                    $target.find('[data-id=check]').toggleClass('icon-grey-check').toggleClass('icon-blue-checked');
                    me.get_$confrim_btn().toggleClass('btn-disable', select_mode.is_empty());
                } else {
                    me.preview_img($target.attr('data-src'), $target.attr('id'));
                }
            });
            //批量操作按钮
            this.get_$ct().find('[data-id=bbar_normal],[data-id=bbar_confirm]').on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();
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

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});