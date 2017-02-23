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
        widgets = common.get('./ui.widgets'),
        huatuo_speed = common.get('./huatuo_speed'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        ui_file_list = require('./ui.file_list'),
        ui_photo = require('./ui.photo'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            $('#_avator').css('backgroundImage', 'url('+$('#_avator').attr('data-src')+')'); //头像也延迟加载
            if(store.is_need_pwd()) {
                this.render_secret();
                return;
            }else if(store.is_photo_list()) {
                mgr.observe(ui_photo);
                ui_photo.render();
                this.report_speed();
                return;
            } else if(store.is_note()) {
                this.render_note();
            } else if(store.is_file_list()) {
                mgr.observe(ui_file_list);
                ui_file_list.render();
                this.report_speed();
                return;
            }

            this.bind_action();
            this.report_speed();
        },

        report_speed: function() {
            var render_time = +new Date();
            //延时以便获取performance数据
            setTimeout(function() {
                huatuo_speed.store_point('1483-1-1', 20, g_serv_taken);
                huatuo_speed.store_point('1483-1-1', 21, g_css_time - g_start_time);
                huatuo_speed.store_point('1483-1-1', 22, (g_end_time - g_start_time) + g_serv_taken);
                huatuo_speed.store_point('1483-1-1', 23, g_js_time - g_end_time);
                huatuo_speed.store_point('1483-1-1', 24, (render_time - g_start_time) + g_serv_taken);
                huatuo_speed.report('1483-1-1', true);
            }, 1000);
        },

        bind_action: function() {
            var me = this;
            this.get_$ct().on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = $target.closest('[data-id=item]').attr('id');

                me.trigger('action', action_name, file_id, e);
            });
        },

        render_secret: function() {
            var me = this;
            if(store.share_info['retry']) {
                cookie.unset('sharepwd');
                widgets.reminder.error(store.share_info['msg'] || '密码错误');
            }

            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }

            this.get_$ct().on('click', '[data-action=secret_view]', function(e) {
                var $inputs = me.get_$ct().find('input[type=password]'),
                    pwd = '';

                $inputs.forEach(function(input) {
                    pwd = pwd + ($(input).val() || '');
                });

                if(!pwd) {
                    widgets.reminder.error('密码不能为空');
                    return;
                } else if(pwd.length !== 4) {
                    widgets.reminder.error('请输入完整密码');
                    return;
                }
                me.trigger('action', 'secret_view', pwd, e);
            });

            this.get_$ct().find('[data-id=pwdContainer] input').on('keydown', function(e) {
                var $target = $(e.target),
                    keycode = e.keyCode;

                var $cur = $target.parent(),
                    $pre = $cur.prev();

                if(keycode == 8) {//回退键
                    if($target.attr('name') == 'pwd1') {
                        return;
                    }

                    $cur.clone().insertAfter($cur);
                    $target.val($pre.children('input').val());
                    $target.attr('name', $pre.children('input').attr('name'));
                    $pre.remove();
                }
            }).on('keyup', function(e) {
                var $target = $(e.target),
                    keycode = e.keyCode;

                var $cur = $target.parent(),
                    $next = $cur.next();

                if(keycode != 8) {
                    if($target.attr('name') == 'pwd4') {
                        $target[0].blur();
                        return;
                    }

                    $cur.clone().insertBefore($cur);
                    $target.val($next.children('input').val());
                    $target.attr('name', $next.children('input').attr('name'));
                    $next.remove();
                }
            });

        },

        render_note: function() {
            this.get_$ct().find('[data-id=content] img').addClass('.note-img');
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$pwd: function() {
            return this.$pwd = this.$pwd || (this.$pwd = $('#pw-input'));
        }
    });

    return ui;
});