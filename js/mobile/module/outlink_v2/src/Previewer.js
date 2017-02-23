/**
 * 图片预览类
 * @author:hibincheng
 * @date:20150-01-30
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        router = lib.get('./router'),
        prettysize = lib.get('./prettysize'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
	    https_tool = common.get('./util.https_tool'),
        logic_error_code = common.get('./configs.logic_error_code'),

        store = require('./store'),
        tmpl = require('./tmpl'),

        start_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchstart',
        move_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'touchmove' : 'touchmove',
        undefined;



    var win_h = $(window).height();
    var win_w = $(window).width();

    /**
     *
     * @param {Object} cfg
     * @constructor
     */
    var Previewer = function(file) {
        var images = store.get_cur_node().get_kid_images();
        var urls = [];
        var index;
        $.each(images, function(i, img) {
            if(img == file) {
                index = i;
            }
            urls.push(img.get_thumb_url(1024));
        });

        this.urls = urls;
        this.total = this.urls.length;
        this.index = index;
        this.one_img = store.get_cur_node().get_kid_count() === 1;
        this.render();
    };

    Previewer.prototype = {

        render: function() {
            this.$previewer = $(tmpl.previewer({
                page_text: this.index+1 + '/' + this.total,
                one_img: this.one_img
            })).appendTo(document.body);

            if(this.one_img) {
                this.$previewer.css({
                    opacity: 1
                });
            } else {
                this.$previewer.animate({
                    opacity: 1
                }, 500, 'ease-out');
            }

            this.$img_list = this.$previewer.find('[data-id=img_list]');

            var me = this,
                vm = $(window).width() + 15; //15px是每张图的margin-right

            this.$img_list.width(vm*this.total).css({
                '-webkit-transform':'translate(-'+this.index*vm+'px,-50%)',
                'webkit-transform':'translate(-'+this.index*vm+'px,-50%)'
            });

            this.$previewer.on(move_action, function(e) {
                e.preventDefault();
            });

            this.$previewer.find('[data-id=bbar]').on(start_action, '[data-action]', function(e) {
                e.preventDefault();
                var action_name = $(e.target).closest('[data-action]').attr('data-action');
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [me.get_cur_image()], e);
                }
            });

            //先占位，当划到某图才加载
            $(tmpl.previewer_item({
                total: this.total,
                item: this.urls
            })).appendTo(this.$img_list);
            this.load_more(this.index);
            require.async('Swipe', function() {
                me.init_swipe();
            })
        },

        init_swipe: function() {
            function transformBox(obj,value,time){
                var time=time?time:0;
                obj.css({
                    '-webkit-transform':"translate3d("+value+"px, -50%,0)",
                    '-webkit-transition':time+'ms linear',
                    'transform':"translate("+value+"px, -50%)",
                    'transition':time+'ms linear'
                });
            }

            function transfromImg(obj, scale, trans) {
                obj.css({
                    '-webkit-transform':"scale("+scale+")" + " translate3d("+trans[0]+"px, "+trans[1]+"px, 0)",
                    'webkit-transform':"scale("+scale+")" + " translate3d("+trans[0]+"px, "+trans[1]+"px, 0)"
                });
            }

            function initZoom() {
                zoom_params = {
                    scale : 1,
                    maxScale: 3,
                    start: [0,0],
                    zoomXY:[0,0],
                    borderXY:[0,0],
                    width: $(window).width(),
                    height: $(window).height(),
                    lastStartTime: 0,
                    lastScale: 1
                };
            }

            var me = this;
            var zoom_params;
            var $cur_img;
            initZoom();

            this.$img_list.parent().Swipe({
                iniAngle:15,
                speed: 300,
                iniL:50,
                mode: 'left-right',
                sCallback:function(tPoint){
                    tPoint.setAttr('total', me.total);
                    tPoint.setAttr('count', me.index);
                    $cur_img = $('#previewer_item_' + me.index);
                    $cur_img.css({
                        "transitionDuration": "0ms"
                    });
                    var scale_w = $cur_img[0].naturalWidth / $cur_img[0].clientWidth;
                    var scale_h = $cur_img[0].naturalHeight / $cur_img[0].clientHeight;
                    zoom_params.maxScale = Math.max(scale_h, scale_w)*2;
                    zoom_params.start = [tPoint.startX, tPoint.startY];
                    zoom_params.lastScale = zoom_params.scale;

                },
                mCallback:function(tPoint){
                    if(tPoint.mutiTouch && tPoint.scale) { //缩放
                        zoom_params.scale = zoom_params.lastScale * tPoint.scale;
                        transfromImg($cur_img, zoom_params.scale,zoom_params.zoomXY);

                    } else if(!tPoint.mutiTouch ){
                        if(zoom_params.scale != 1) { //放大后进行移动

                            zoom_params.borderXY[0] = ($cur_img[0].clientWidth *zoom_params.scale - zoom_params.width) / 2 / zoom_params.scale;
                            zoom_params.borderXY[1] = ($cur_img[0].clientHeight *zoom_params.scale - zoom_params.height) / 2 / zoom_params.scale;

                            var deltaX = (tPoint.endX - zoom_params.start[0]) / zoom_params.scale;
                            var deltaY = (tPoint.endY - zoom_params.start[1]) / zoom_params.scale;
                            zoom_params.start = [tPoint.endX, tPoint.endY];

                            if(zoom_params.borderXY[0] > 0 && (zoom_params.zoomXY[0] < -zoom_params.borderXY[0] || zoom_params.zoomXY[0] > zoom_params.borderXY[0])) {
                                deltaX /= 3;
                            }

                            if(zoom_params.borderXY[1] > 0 && (zoom_params.zoomXY[1] < -zoom_params.borderXY[1] || zoom_params.zoomXY[1] > zoom_params.borderXY[1])) {
                                deltaY /= 3;
                            }
                            if(zoom_params.borderXY[0] >= 0) {
                                zoom_params.zoomXY[0] += deltaX;
                            }
                            if(zoom_params.borderXY[1] > 0) {
                                zoom_params.zoomXY[1] += deltaY;
                            }

                            transfromImg($cur_img, zoom_params.scale, zoom_params.zoomXY);
                        } else if(Math.abs(tPoint.mX) > 5 || Math.abs(tPoint.mY) > 5) { //正常移动
                            var innerW=me.$img_list.width();
                            var offset=tPoint.mX+(-tPoint.count*innerW/tPoint.total);
                            transformBox(me.$img_list,offset,0);
                        }
                    }
                },
                eCallback:function(tPoint){
                    if(tPoint.oriEvent.touches.length > 1 && zoom_params.scale != 1) {
                        //对缩小进行特殊处理
                        if(zoom_params.scale <= 1) {
                            //zoom_params.scale = 1;
                            zoom_params.zoomXY = [0,0];
                            $cur_img.css({
                                "transitionDuration": "300ms"
                            })
                        }
                        zoom_params.scale = Math.max(Math.min(zoom_params.scale, zoom_params.maxScale), 1);
                        //zoom_params.zoomXY = zoom_params.scale == 1 ? [0,0] : zoom_params.zoomXY;
                        transfromImg($cur_img, zoom_params.scale, zoom_params.zoomXY);
                        return;
                    }

                    if(tPoint.oriEvent.touches.length > 1) {//swipe.js中mutilTouch是在tochmove才检测，所以这里采用原始事件判断
                        return;
                    }

                    var now = +new Date();
                    var lastTime = zoom_params.lastStartTime;
                    var double_click = lastTime !== 0 && now - lastTime <  300;

                    zoom_params.lastStartTime = now;

                    if(zoom_params.scale != 1) {
                        if(!double_click) {
                            var is_slide = false;
                            var replair = false;
                            //边界检测
                            if(zoom_params.borderXY[0] >= 0 && (zoom_params.zoomXY[0] < -zoom_params.borderXY[0] || zoom_params.zoomXY[0] > zoom_params.borderXY[0])) {
                                zoom_params.zoomXY[0] = zoom_params.zoomXY[0] < 0 ? -zoom_params.borderXY[0] : zoom_params.borderXY[0];
                                is_slide = Math.abs(tPoint.mX) > 200;
                                replair= true;
                            }

                            if(zoom_params.borderXY[1] > 0 && (zoom_params.zoomXY[1] < -zoom_params.borderXY[1] || zoom_params.zoomXY[1] > zoom_params.borderXY[1])) {
                                zoom_params.zoomXY[1]= zoom_params.zoomXY[1] < 0 ? -zoom_params.borderXY[1] : zoom_params.borderXY[1];
                                replair = true
                            }
                            if(!is_slide ) {
                                replair && transfromImg($cur_img, zoom_params.scale, zoom_params.zoomXY);
                                return;
                            }
                        }

                        transfromImg($cur_img, 1, [0,0]);
                    }

                    initZoom();

                    var innerW=me.$img_list.width(),
                        count=tPoint.count;

                    function slide(d){
                        switch(d){
                            case "left":
                                ++count;
                                count = Math.min(count, tPoint.total-1); //不能超过边界
                                break;
                            case "right":
                                --count;
                                count = Math.max(count, 0); //不能超过边界
                        }
                        var offset = -count * innerW/tPoint.total;
                        transformBox(me.$img_list,offset,tPoint.speed);
                    }

                    slide(tPoint.direction);
                    tPoint.setAttr("count",count);
                    if(!tPoint.mX && !tPoint.mutiTouch && !double_click) {
                        router.go('root');
                    } else if(tPoint.direction) {
                        me.load_more(count);
                    }
                }
            });
        },

        load_more: function(index) {
            this.index = index;
            if(!this.one_img) {
                var $page_text = this.get_$page_text();
                $page_text.text(index + 1 + '/' + this.total).css('opacity', '0');
                clearTimeout(this.page_timer);
                $page_text.animate({
                    opacity: 0.5
                }, 500, 'ease-out');
                this.page_timer = setTimeout(function(){
                    $page_text.animate({
                        opacity: 0
                    }, 500, 'ease-out');
                },2000);
            }
            var file_size = this.get_cur_image().get_size();

            this.get_$file_size().text('(' + prettysize(file_size) + ')');
            if($('#previewer_item_' + index).attr('src')) {
                return;
            }
            this.load_image(index).done(function(img) {
                if(img.height > win_h && img.height > img.width && img.width * win_h/img.height < win_w) {
                    $(img).css({
                        height: win_h + 'px',
                        width: 'auto'
                    })
                }
                $('#' + img.id).replaceWith(img);
            }).fail(function() {
                $('#previewer_item_' + index).replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        load_image: function(index, def) {
            var me = this,
                url = this.urls[index];

            def = def || $.Deferred();
            def.try_num = def.try_num || 3;
            image_loader.load(url).done(function(img) {
                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
                def.resolve(img);
            }).fail(function(img) {
                if(!--def.try_num) {
                    //h5错误上报
                    var path = 'share' + location.pathname,
                        url = img.getAttribute('src');
                    logger.report(path, {url: url, type: 'more_photo'});

                    //img.className = 'wy-img-preview';
                    // img.id = 'previewer_item_'+ index;
                    def.reject(img);
                } else {
                    me.load_image(index, def);
                }
            });

            return def;
        },

        on_view_raw: function() {
            var file = this.get_cur_image(),
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
            }

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
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        do_view_raw: function(raw_url) {
            var index = this.index;
            var $cur_img = $(this.$img_list.children()[index]).find('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.parent().append('<i id="previewer_item_'+index+'" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {

                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
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
                logger.report(path, {url: url, type: 'more_photo'});

                $cur_img.parent().find('i').remove();
                $cur_img.replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        get_cur_image: function() {
            return store.get_cur_node().get_kid_images()[this.index];
        },

        get_$img_list: function() {
            return this.$img_list;
        },

        get_$page_text: function() {
            return this.$page_text = this.$page_text || (this.$page_text = this.$previewer.find('[data-id=page_text]'));
        },

        get_$file_size: function() {
            return this.$file_size = this.$file_size || (this.$file_size = this.$previewer.find('[data-id=file_size]'));
        },

        destroy: function() {
            var me = this;
            this.$previewer.animate({
                opacity: 0
            }, 500, 'ease-out', function() {
                me.$previewer.remove();
            });

        }
    };

    $.extend(Previewer.prototype, events);

    return Previewer;
});