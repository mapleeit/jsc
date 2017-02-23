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
        browser = common.get('./util.browser'),
        mgr = require('./mgr'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        selection = require('./selection'),
        ListView = require('./ListView'),
        video = require('./video'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        move_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'touchmove' : 'touchmove',
        undefined;

    var ui = new Module('ui.photo', {

        render: function() {
            this.render_img_list();
            router.init('root');

            this._$ct = $('#container');

            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });
        },

        toggle_batch: function(action_name) {
            var $img_list = this.get_$ct().find('[data-id=img]'),
                me = this;
            /*$img_list.each(function(i, img) {
                var $img = $(img);
                $img.empty();
                if(!me.batch_operating) {
                    $img.append('<i data-id="check" class="icons icon-blue-checked"></i>');
                    selection.toggle_select($img.attr('id'));
                }
            });*/
            this.get_$img_list().toggleClass('active');
            this.get_$choose_bar().toggleClass('active').find('[data-id=choose]').removeClass('cancel');
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
            var $ct = this.get_$ct();
            this.get_$confrim_btn().addClass('btn-disable');

            $ct.on(target_action, '[data-id=choose]', function(e) {
                var $target = $(e.target).closest('[data-id=choose]');
                if(!$target.is('.cancel')) {
                    me.choose_all();
                    $target.addClass('cancel');
                } else {
                    me.cancel_choose_all();
                    $target.removeClass('cancel');
                }
            });

            $ct.on(move_action, '[data-id=img]', function(e) {
                is_move = true;
            });
            $ct.on(target_action, '[data-id=img]',  function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }

                var $target = $(e.target).closest('[data-id=img]');
                if(me.batch_operating) {
                    selection.toggle_select($target.attr('id'));
                    $target.toggleClass('choosen');
                    me.get_$confrim_btn().toggleClass('btn-disable', selection.is_empty());
                    var select_cnt = selection.get_selected().length;
                    var total = store.get_cur_node().get_kid_nodes().length;
                    if(select_cnt < total) {
                        me.get_$choose_bar().find('[data-id=choose]').removeClass('cancel');
                    } else {
                        me.get_$choose_bar().find('[data-id=choose]').addClass('cancel');
                    }
                } else {
                    if($target.attr('data-action') === 'open') {
                        mgr.play_video(store.get($target.attr('data-file-id')), true);
                    } else if($target.attr('data-action') === 'preview'){
                        me.preview_img($target.attr('data-src'), $target.attr('id'));
                    }
                }
            });
            //批量操作按钮
            $ct.find('[data-id=bbar_normal],[data-id=bbar_confirm]').on(target_action, '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();

                if(action_name === 'save' && store.is_single_file() && (store.get_cur_node() === store.get_root_node())) {
                    me.trigger('action', 'save', store.get_cur_node().get_kid_nodes());
                    return;
                }
                if(action_name !== 'cancel' && selection.is_empty() && me.batch_operating) {
                    return;
                }
                if(!me.toggle_batch(action_name)) {
                    var selected_items = selection.get_selected();
                    if(action_name !=='cancel' && selected_items.length) {
                        me.trigger('action', action_name, selected_items, e);
                    }
                    //selection.clear();
                    me.cancel_choose_all();
                }
            });
        },

        choose_all: function() {
            selection.clear();
            var $img_list = this.get_$img_list().children();
            $img_list.each(function(i, img) {
                var $img = $(img);
                selection.select($img.attr('id'));
                $img.addClass('choosen');
            });

            this.get_$confrim_btn().removeClass('btn-disable');
        },

        cancel_choose_all: function() {
            var $img_list = this.get_$img_list().children();
            $img_list.each(function(i, img) {
                var $img = $(img);
                $img.removeClass('choosen');
            });
            selection.clear();

            this.get_$confrim_btn().addClass('btn-disable');
        },

        preview_img: function(src, file_id) {
            //this.get_$ct().hide();
            //this.get_$banner().hide();
            selection.clear();
            selection.select(store.get(file_id));
            this.previewer = new Previewer(store.get(file_id));
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        video_play: function(file, extra) {
            this.previewer = video.play(file, extra);
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
            selection.clear();
            //this.get_$ct().show();
            //this.get_$banner().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        },

        get_$img_list: function() {
            return this.$img_list = this.$img_list || (this.$img_list = $('#photo_list'));
        },

        get_$choose_bar: function() {
            return this.$choose_bar = this.$choose_bar || (this.$choose_bar = $('#choose_bar'));
        }
    });

    return ui;
});