/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define(function (require, exports, module) {
    var common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),

        main_ui = require('main').get('./ui'),

        uiv = constants.UI_VER,

        tmpl = require('./tmpl'),
        tbar = require('./tbar');

    var ui = new Module('recent_ui', {

        render: function () {

            this.get_$body().appendTo(main_ui.get_$body_box());

            this
                .on('activate', function () {
                    main_ui.get_$body_box().children().addClass('mod-list-group-recent');
                    this.get_$body().show();
                    if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                        this.get_$body().repaint();
                    }
                })
                .on('deactivate', function () {
                    this.get_$body().hide();
                    main_ui.get_$body_box().children().removeClass('mod-list-group-recent');
                });


            this._render_ie6_fix();

            tbar.render(this.get_$main_bar1());
        },
        get_$body: function () {
            return this._$body || (this._$body = $(tmpl['body']()));
        },
        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },
        //ie6 鼠标hover效果
        _render_ie6_fix: function () {
            if ($.browser.msie && $.browser.version < 7){
                var me = this,
                   // hover_cls = constants.UI_VER === 'WEB' ? 'hover' : 'list-hover';
                   hover_cls = 'list-hover';
                me.get_$body()
                    .on('mouseenter', '[data-file-id]', function () {
                        $(this).addClass(hover_cls);
                    })
                    .on('mouseleave', '[data-file-id]', function () {
                        $(this).removeClass(hover_cls);
                    });
            }
        }
    });
    return ui;
});
