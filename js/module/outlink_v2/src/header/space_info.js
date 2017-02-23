/**
 * 空间信息
 * @author yuyanghe
 * @date 13-9-21
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
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        user_info=require('./header.user_info'),

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var space_info = new Module('outlink_space_info', {
        _used_space:0,
        _total_space:0,
        _$text:null,
        _$bar: null,

        render: function () {
            // 文字
            var me=this;
            // 进度条
            this._$bar = $('#_main_space_info_bar');
            this.listenTo(user_info, 'load', function (used_space,total_space) {
                me._$used_space_text = $('#_used_space_info_text');
                me._$total_space_text = $('#_total_space_info_text');
                me._used_space=used_space;
                me._total_space= total_space;
                me._update_text();
                me._update_bar();
            });

        },
        // 文字
        _update_text: function () {
            this._$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this._$total_space_text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.floor((this._used_space / this._total_space *100));
            this._$bar
                .css('width', Math.min(percent, 100) + '%')
                .parent()
                .toggleClass('full', percent >= 90)
                .attr('title', percent + '%');
        },

        get_used_space: function(){
            return this._used_space;
        },
        get_total_space: function(){
            return this._total_space;
        }
    });

    return space_info;
});