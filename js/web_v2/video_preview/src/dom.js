/**
 * dom元素获取
 * Created by maplemiao on 26/10/2016.
 */
"use strict";

define(function (require, exports, module) {
    return {
        /**
         * get download btn
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _get_$download_btn: function () {
            var me = this;

            return me.$download_btn || (me.$download_btn = $('.j-download-btn'));
        },

        /**
         * get share btn
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _get_$share_btn: function () {
            var me = this;

            return me.$share_btn || (me.$share_btn = $('.j-share-btn'));
        },

        _get_$video_player_title: function () {
            var me = this;

            return me.$video_player_title || (me.$video_player_title = $('.j-video-player-title'));
        },

        _get_$video_mask: function () {
            var me = this;

            return me.$video_mask || (me.$video_mask = $('.j-video-mask'));
        },

        _get_$video_list: function () {
            var me = this;

            return me.$video_list || (me.$video_list = $('.j-video-list'));
        },

        _get_$video_list_item_array : function () {
            var me = this;

            // 不能缓存，因为这个不断变化
            return me.$video_list_item_array = $('.j-video-list-item');
        },

        _get_$next_btn: function () {
            var me = this;

            return me.$next_btn || (me.$next_btn = $('.j-next-btn'));
        },

        _get_$pre_btn: function () {
            var me = this;

            return me.$pre_btn || (me.$pre_btn = $('.j-pre-btn'));
        },

        _get_$download_btn_size: function () {
            var me = this;

            return me.$download_btn_size || (me.$download_btn_size = $('.j-download-btn-size'));
        },

        _get_$err: function () {
            var me = this;

            return me.$err || (me.$err = $('.j-err'));
        },

        _get_$err_msg: function () {
            var me = this;

            return me.$err_msg || (me.$err_msg = $('.j-err-msg'));
        },

        _get_$err_action: function () {
            var me = this;

            return me.$err_action || (me.$err_action = $('.j-err-action'));
        }
    }
});