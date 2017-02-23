/**
 * 空间信息UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        tmpl = require('./tmpl'),
        space_info,

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var ui = new Module('main_space_info_ui', {

        _used_space: 0,
        _total_space: 0,

        render: function () {
            space_info = require('./space_info.space_info');

            this._$el = $('#_main_space_info');
            this._$el.html(tmpl.space_info());

            // 文字
            this.$used_space_text = $('#_main_space_info_used_space_text');
            // 文字
            this.$total_space_$text = $('#_main_space_info_total_space_text');
            // 进度条
            this._$bar = $('#_main_space_info_bar');

            this
                // 每次加载完成后更新DOM
                .listenTo(space_info, 'load', function (used_space, total_space) {
                    this._used_space = used_space;
                    this._total_space = total_space;
                    this.trigger('space_size_changed');
                })

                .on('space_size_changed', function () {
                    this._update_text();
                    this._update_bar();
                });
        },

        /**
         * 增加已使用的空间（仅本地缓存）
         * @param {Number} size
         */
        add_used_space_size: function (size) {
            this._used_space += size;
            this.trigger('space_size_changed');
        },

        // 文字
        _update_text: function () {
            this.$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this.$total_space_$text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.ceil(this._used_space / this._total_space * 100);
            this._$bar
                .css('width', Math.min(percent, 100) + '%')

                .parent()
                .toggleClass('full', percent >= 90)
                .attr('title', percent + '%');

            percent >= 100 && $('#_main_space_info').addClass('exceed');
        },

        get_used_space: function(){
            return this._used_space;
        },
        get_total_space: function(){
            return this._total_space;
        }
    });

    return ui;
});