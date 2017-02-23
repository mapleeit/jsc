/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        text = lib.get('./text'),
        dateformat = lib.get('./dateformat'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        fileType = require('./file.fileType'),
        tmpl = require('./tmpl'),

        undefined;

    var trace_detail = new Module('trace_detail', {
        init: function (data) {
            var me = this;

            me.data = data;
            me.currentTab = 'view'; // view OR download, current tab status
            me.viewFinishFlag = me.data.viewFinishFlag || false; // false OR true, view list finished flag status
            me.downloadFinishFlag = me.data.downloadFinishFlag || false; // false OR true, download list finished flag status
            me.viewOffset = 0;
            me.downloadOffset = 0;
            me._tab_btn_top_status = 0; // 0 OR 1, whether tab btn on the top
            // 浏览和下载列表数据缓存
            me.store = {
                'view': [],
                'download': [],
                'viewCount' : me.data.viewCount,
                'downloadCount': me.data.downloadCount
            };

            me.render_thumb();
            me._init_store();
            me._bind_events();
            console.log(data);
        },

        /**
         * 将直出拉取的首屏数据存到缓存中来
         * @private
         */
        _init_store: function () {
            var me = this;

            $.map(me.data.viewUserList, function (item, index) {
                me.store.view.push(item);
            });

            // update offset
            me.viewOffset = me.store.view.length;
            me.downloadOffset = me.store.download.length;
        },

        //加载缩略图，在这里处理是为了用common库方法来兼容https
        render_thumb: function() {
            var me = this;
            var $image = this.get_$main_div().find('.info>i.icon');
            var share_icon = me.data.itemInfo.share_icon;
            var thumb_url = me.data.itemInfo.thumb_url;
            if(thumb_url) {
                thumb_url = me.translate_https_url(thumb_url);
                var file_type = (share_icon === 'package' || !share_icon)? 'shared-link' : fileType(share_icon, 'v2');
                thumb_url = file_type==='video'? thumb_url + '/64' : (file_type==='pic'? thumb_url + '?size=64*64' : '');
                $image.css('background-image','url(' + thumb_url + ')');
            }
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

            me.get_$view_btn().on('click', function (e) {
                me._set_current_tab('view');
            });

            me.get_$download_btn().on('click', function (e) {
                me._set_current_tab('download');
            });

            me.on('change-tab', function (tab) {
                var currentTab = tab;

                var handleChange = function () {
                    me._handle_blank();
                    me._handle_tab();
                };

                // first time click the download tab, need load data
                if (tab === 'download' && me.downloadFinishFlag === false && me.downloadOffset === 0) {
                    me._load(tab)
                        .done(function (msg, data) {
                            var htmlString = '';

                            for (var i = 0, items = data[currentTab + '_user_list'] || [], len = items.length; i < len; i++) {
                                htmlString += tmpl.user_item({
                                    item: items[i],
                                    util: {
                                        htmlEscape: text.text,
                                        dateformat: dateformat
                                    }
                                });

                                me.store[currentTab].push(items[i]);
                            }
                            me[currentTab + 'Offset'] += len;
                            me[currentTab + 'FinishFlag'] = data.finish_flag;

                            me['get_$' + currentTab + '_list']().append(htmlString);

                            handleChange();
                        })
                        .fail(function (msg, err) {
                            widgets.reminder.error('拉取信息失败，请重试');

                            handleChange();
                        })
                } else {
                    handleChange();
                }
            });

            me.on('scroll-to-bottom', function () {
                var currentTab = me._get_current_tab();

                // if has finished
                if (me[currentTab + 'FinishFlag']) {
                    return;
                }

                me.get_$loading().show();

                me._load(currentTab)
                    .done(function (msg, data) {
                        var htmlString = '';

                        for (var i = 0, items = data[currentTab + '_user_list'] || [], len = items.length; i < len; i++) {
                            htmlString += tmpl.user_item({
                                item: items[i],
                                util: {
                                    htmlEscape: text.text,
                                    dateformat: dateformat
                                }
                            });

                            me.store[currentTab].push(items[i]);
                        }
                        me[currentTab + 'Offset'] += len;
                        me[currentTab + 'FinishFlag'] = data.finish_flag;

                        me['get_$' + currentTab + '_list']().append(htmlString);

                        me.get_$loading().hide();
                    })
                    .fail(function (msg, ret) {
                        widgets.reminder.error('拉取信息失败，请重试');
                    })
            });

            me.on('scroll-tab-top', function () {
                me._tab_btn_top_status = 1; // update status

                // change tab btn css position
                me.get_$link_detail().addClass('hang');
            });

            me.on('scroll-tab-top-cancel', function () {
                me._tab_btn_top_status = 0; // update status

                me.get_$link_detail().removeClass('hang');
            });

            $(window).on('scroll', function () {
                if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                    me.trigger('scroll-to-bottom');
                }

                if (me.get_$main_div().height() <= $(window).scrollTop() && !me._tab_btn_top_status) {
                    me.trigger('scroll-tab-top');
                } else if (me.get_$main_div().height() > $(window).scrollTop() && me._tab_btn_top_status) {
                    me.trigger('scroll-tab-top-cancel');
                }
            });
        },

        /**
         * set tab status
         * @param tab
         * @private
         * @fires trace_detail#change-tab
         */
        _set_current_tab: function (tab) {
            var me = this;

            me.currentTab = tab;

            me.trigger('change-tab', tab);
        },

        /**
         * get tab status
         * @returns {string|*} view | download
         * @private
         */
        _get_current_tab: function () {
            var me = this;

            return me.currentTab;
        },

        /**
         * 处理空状态
         * @private
         */
        _handle_blank: function () {
            var me = this;

            var tabTextMap = {
                'view' : '浏览',
                'download' : '下载'
            };
            var currentTab = me._get_current_tab(),
                textString = '暂无' + tabTextMap[currentTab] + '记录';

            me.get_$blank_text().text(textString);

            if (currentTab === 'view' && me.store.view.length === 0) {
                me.get_$blank_div().show();
            } else if (currentTab === 'download' && me.store.download.length === 0) {
                me.get_$blank_div().show();
            } else {
                me.get_$blank_div().hide();
            }
        },

        /**
         * 处理列表展示，
         * 处理tab按钮展示
         * @private
         */
        _handle_tab: function () {
            var me = this;

            var currentTab = me._get_current_tab();

            if (currentTab === 'view') {
                me.get_$view_btn().addClass('act');
                me.get_$download_btn().removeClass('act');

                me.get_$view_list().show();
                me.get_$download_list().hide();
            } else if (currentTab === 'download') {
                me.get_$view_btn().removeClass('act');
                me.get_$download_btn().addClass('act');

                me.get_$view_list().hide();
                me.get_$download_list().show();
            }
        },

        /**
         * load item
         * @param tab 'view' || 'download'
         * @private
         */
        _load: function (tab) {
            var me = this;
            var dataMap = {
                'view' : {
                    type: 1,
                    offset: me.viewOffset
                },
                'download' : {
                    type: 2,
                    offset: me.downloadOffset
                }
            };

            var def = $.Deferred();

            //noinspection JSAnnotator
            document.domain = 'weiyun.com';

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareTraceInfo',
                re_try:3,
                pb_v2: true,
                body: {
                    share_key: me.data.params['share_key'],
                    list_type: dataMap[tab].type,
                    offset: dataMap[tab].offset,
                    get_share_item: true
                }
            }).ok(function (msg, data) {
                logger.write(['xhr_post success ---> WeiyunShareTraceInfo '], 'h5_session_timeout', 0);
                def.resolve(msg, data);
            }).fail(function (msg, ret) {
                logger.write(['xhr_post error ---> WeiyunShareTraceInfo '], 'h5_session_timeout', ret);
                def.reject(msg, ret);
            });

            return def;
        },

        // ------------------------------------ DOM -------------------------------------
        get_$view_list: function () {
            var me = this;

            return me.$view_list || (me.$view_list = $('.j-view-list'));
        },

        get_$download_list: function () {
            var me = this;

            return me.$download_list || (me.$download_list = $('.j-download-list'));
        },

        get_$view_btn: function () {
            var me = this;

            return me.$view_btn || (me.$view_btn = $('.j-view-btn'));
        },

        get_$download_btn: function () {
            var me = this;

            return me.$download_btn || (me.$download_btn = $('.j-download-btn'));
        },

        get_$blank_text: function () {
            var me = this;

            return me.$blank_text || (me.$blank_text = $('.j-blank-text'));
        },

        get_$blank_div: function () {
            var me = this;

            return me.$blank_div || (me.$blank_div = $('.j-blank-div'));
        },

        get_$main_div: function () {
            var me = this;

            return me.$main_div || (me.$main_div = $('.j-main-div'));
        },

        get_$link_detail: function () {
            var me = this;

            return me.$link_detail || (me.$link_detail = $('.j-link-detail'));
        },

        get_$loading : function () {
            var me = this;

            return me.$loading || (me.$loading = $('.j-loading'));
        },

        get_$main_icon: function () {
            var me = this;

            return me.$main_icon || (me.$main_icon = $('.j-main-icon'));
        }
    });

    return trace_detail;
});