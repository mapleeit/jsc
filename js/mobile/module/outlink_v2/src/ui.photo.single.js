/**
 * 图列表ui模块 单图
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
	    request = common.get('./request'),
        logger = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
	    https_tool = common.get('./util.https_tool'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        logic_error_code = common.get('./configs.logic_error_code'),
        Previewer = require('./Previewer'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    var win_h = $(window).height();
    var win_w = $(window).width();

    var ui = new Module('ui.photo.single', {

        //单图使用
        render: function() {
            var me = this;
            //html已直出，只绑定事件即可
            this.get_$ct().on(target_action, '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = store.get_cur_node().get_id();
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [store.get(file_id)], e);
                }
            });
            $('[data-id=img]').width($(window).width());
            $('#loading').show();

            var image = store.get_cur_node().get_kid(0);

            image_loader.load(image.get_thumb_url(1024)).done(function(img) {
                if(img.height > win_h && img.height > img.width && img.width * win_h/img.height < win_w) {
                    $(img).css({
                        height: win_h + 'px',
                        width: 'auto'
                    }).addClass('wy-img-preview');
                }
                //$('#loading').replaceWith(img);
                me.previewer = new Previewer(image);
                me.listenTo(me.previewer, 'action', function(action_name, data, e) {
                    me.trigger('action', action_name, data, e);
                });
            }).fail(function(img) {
                var path = 'share' + location.pathname,
                    url = img.getAttribute('src');
                logger.report(path, {url: url, type: 'single_photo'});
            });
            selection.select(store.get_cur_node().get_kid(0));
        },

        on_view_raw: function() {
            var file = store.get_cur_node().get_kid(0),
                share_info = store.get_share_info(),
                me = this;
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                pack_name: file.get_name(),
                file_list: [{
                    file_id: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }]
            };

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.DOMAIN_NAME,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                var result;
                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }

                me.do_view_raw(https_tool.translate_url(body['download_url'].replace(/^http:|^https:/, '')));

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                widgets.reminder.error('预览原图出错');

                //日志上报
                var console_log = [];
                var  result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        //单图使用
        do_view_raw: function(raw_url) {
            var $cur_img = $('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.parent().append('<i id="_preview_loading" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {
                img.className = 'wy-img-preview';
                $(img).attr('data-size', 'raw');
                if(img.height > win_h && img.height > img.width && img.width * win_h/img.height < win_w) {
                    $(img).css({
                        height: win_h + 'px',
                        width: 'auto'
                    })
                }
                $cur_img.parent().find('i').remove();
                $cur_img.replaceWith(img);
            }).fail(function(img) {
                var path = 'share' + location.pathname,
                    url = img.getAttribute('src');
                logger.report(path, {url: url, type: 'single_photo'});
            });
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        }
    });

    return ui;
});