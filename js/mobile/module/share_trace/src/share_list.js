/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        text = lib.get('./text'),
        dateformat = lib.get('./dateformat'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        request = common.get('./request'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        fileType = require('./file.fileType'),
        tmpl = require('./tmpl'),

        undefined;

    var share_list = new Module('share_list', {
        init: function (data) {
            var me = this;
            me.data = data || {};
            me.offset = (me.data.item || []).length;
            me.count = (data.item || []).length;
            me.loading = false;

            /**
             * 每页加载的分享链接条数
             * @constant {number}
             */
            me.PAGE_SIZE = 30;
            me.render_thumb();
            me._bind_events();
        },

        //加载缩略图，在这里处理是为了用common库方法来兼容https
        render_thumb: function() {
            var me = this;
            var $file_list = this.get_$share_link_list().find('[data-share-item]');
            $.each($file_list, function(i, file) {
                var share_icon = $(file).attr('data-share-icon');
                var thumb_url = $(file).attr('data-share-thumb-url');
                if(thumb_url) {
                    thumb_url = me.translate_https_url(thumb_url);
                    var file_type = (share_icon === 'package' || !share_icon)? 'shared-link' : fileType(share_icon, 'v2');
                    thumb_url = file_type==='video'? thumb_url + '/64' : (file_type==='pic'? thumb_url + '?size=64*64' : '');
                    $(file).find('i.icon').css('background-image','url(' + thumb_url + ')');
                }
            });
        },

        translate_https_url: function(url) {
            if(!constants.IS_HTTPS) {
                return url;
            }
            var url_object = new URL(url);
            return 'https://' + https_tool.translate_host(url_object.hostname) + ':8443' + url_object.pathname  + url_object.search;
        },

        _bind_events: function () {
            var me = this;

            $('.j-share-link-list').on('click', '.j-share-item', function (e) {
                var $li = $(e.target).closest('li'),
                    shareKey = $li.attr('data-share-key');
                if ($li.hasClass('fail')) {
                    return;
                }
                location.href = location.origin + '/share_trace/trace_detail?' +
                    'share_key=' + shareKey;
            });

            /**
             * 到底部自动加载
             * @listens scroll
             */
            $(window).on('scroll', function () {
                if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                    if (!me.data.done && !me.loading) {
                        me.loading = true;
                        me.get_$loading().show();
                        me._load()
                            .done(function (msg, data) {
                                me.get_$loading().hide();

                                var htmlString = '';

                                for (var i = 0, items = data.item || [], len = items.length; i < len; i++) {
                                    htmlString += tmpl.share_item({
                                        item: items[i],
                                        util: {
                                            htmlEscape: text.text,
                                            dateformat: dateformat,
                                            fileType: fileType
                                        }
                                    });
                                }
                                me.offset += (data.item || []).length;
                                me.count += (data.item || []).length;
                                me.data.done = data.done;
                                me.loading = false;

                                if (data.done) {
                                    me.get_$file_count().find('span').text(me.count + '个文件');
                                    me.get_$file_count().show();
                                }

                                me.get_$share_link_list().append(htmlString);
                            })
                            .fail(function (msg, ret) {
                                widgets.reminder.error('拉取信息失败，请重试');
                            })
                    }
                }
            })
        },

        /**
         * load more share item
         * @private
         */
        _load: function () {
            var me = this;

            var def = $.Deferred();

            //noinspection JSAnnotator
            document.domain = 'weiyun.com';

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareList',
                re_try:3,
                pb_v2: true,
                body: {
                    offset: me.offset,
                    size: me.PAGE_SIZE,
                    order: 0 // time order : 0 && name order : 1
                }
            }).ok(function (msg, data) {
                logger.write(['xhr_post success ---> WeiyunShareList '], 'h5_session_timeout', 0);
                def.resolve(msg, data);
            }).fail(function (msg, ret) {
                logger.write(['xhr_post error ---> WeiyunShareList '], 'h5_session_timeout', ret);
                def.reject(msg, ret);
            });

            return def;
        },

        // ------------------------------------ DOM -------------------------------------
        get_$loading: function () {
            var me = this;

            return me.$loading || (me.$loading = $('.j-loading'));
        },

        get_$file_count: function () {
            var me = this;

            return me.$file_count || (me.$file_count = $('.j-file-count'));
        },

        get_$share_link_list : function () {
            var me = this;

            return me.$share_link_list || (me.$share_link_list = $('.j-share-link-list'));
        }
    });

    return share_list;
});