/**
 * for 普通网盘文件列表
 * @author jameszuo
 * @date 13-11-12
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        PopPanel = common.get('./ui.pop_panel'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        classes = {
            newestlist: 'vm-time',
            azlist: 'vm-az',
            grid: 'vm-thum'
        },

        view_switch,

        undefined;


    var ui = new Module('disk_view_switch_ui', {

        render: function ($to) {
            if (this._rendered) return;

            view_switch = require('./view_switch.view_switch'),
                cur_view = view_switch.get_cur_view(),
                $el = this._$el = $(tmpl['view_switch']({
                    cur_view: cur_view,
                    cur_cls: classes[cur_view] //,
                    // is_sidebar_view: view_switch.is_sidebar_view()
                }));

            $el.appendTo($to);


            var $base_btn = $el.children('[data-action="base_btn"]'),
                $list = $el.find('ul'),
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

            $el.on('click', function (e) {
                e.preventDefault();
            });

            var class_list = collections.values(classes).join(' ');

            // 点击视图列表中的item
            $el.on('click.view_switch', '[data-view]:not(.selected,.disable)', function (e) {

                var $btn = $(this),
                    view_name = $btn.attr('data-view');

                $btn.addClass('focus').siblings().removeClass('focus');
                $base_btn.removeClass(class_list).addClass(classes[view_name]);
                view_switch.set_cur_view(view_name, false);

                if (!scr_reader_mode.is_enable()) { // 针对读屏软件，不隐藏菜单 - james
                    $list.hide();
                }
            });

            // 点击切换侧边栏
            var $side_btn = this.$side_btn = $el.find('[data-action="sidebar"]');
            $side_btn.on('click', function () {
                view_switch.set_sidebar_view(!view_switch.is_sidebar_view());
            });

            this.set_sidebar_activated(view_switch.is_sidebar_view());

            // 修复 bug#48663950 chrome下没有显示“缩略图”和“列表”切换图标
            this._fix_chrome();

            this._rendered = 1;
        },

        set_sidebar_activated: function (active) {
            this.$side_btn && this.$side_btn.toggleClass('dbview-focus', active)
                // 修改此处的 wording 时，需要同步修改模板
                .attr('title', (active ? '隐藏' : '查看') + '目录树');
        },

        toggle: function (visible) {
            this._$el.toggle(visible);
        },

        toggle_mode: function(mode_name, disable) {
            this._$el.find('[data-view='+mode_name+']').toggleClass('disable', disable);
            if(mode_name == 'newestlist' && view_switch.get_cur_view() == 'newestlist') {
                if(disable) {
                    this._$el.find('[data-view=newestlist]').removeClass('focus');
                    this._$el.find('[data-view=azlist]').addClass('focus');
                } else {
                    this._$el.find('.focus').removeClass('focus');
                    this._$el.find('[data-view=newestlist]').addClass('focus');
                }
            }
        },

        _fix_chrome: function () {
            if ($.browser.chrome) {
                var i_imgs = [],
                    $i_els = this._$el.find('i');

                $i_els.each(function (i, tag) {
                    i_imgs[i] = $(tag).css('background-image');
                });
                setTimeout(function () {
                    $i_els.each(function (i, tag) {
                        $(tag).css('background-image', i_imgs[i]);
                    });
                }, 1);
            }
        }
    });

    return ui;
});