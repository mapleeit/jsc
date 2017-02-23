//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/outlink_v2/outlink_v2.r160928",["lib","common","$","zepto_fx"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//outlink_v2/src/ListView.js
//outlink_v2/src/Previewer.js
//outlink_v2/src/ad_link.js
//outlink_v2/src/android_serv.js
//outlink_v2/src/app_cfg.js
//outlink_v2/src/file/FileNode.js
//outlink_v2/src/file/NoteNode.js
//outlink_v2/src/file/file_type_map.js
//outlink_v2/src/file/parser.js
//outlink_v2/src/file_path/file_path.js
//outlink_v2/src/image_lazy_loader.js
//outlink_v2/src/mgr.js
//outlink_v2/src/note.js
//outlink_v2/src/outlink.js
//outlink_v2/src/selection.js
//outlink_v2/src/store.js
//outlink_v2/src/ui.file_list.js
//outlink_v2/src/ui.group.js
//outlink_v2/src/ui.js
//outlink_v2/src/ui.photo.js
//outlink_v2/src/ui.photo.single.js
//outlink_v2/src/verify_code.js
//outlink_v2/src/video.js
//outlink_v2/src/file_path/file_path.tmpl.html
//outlink_v2/src/outlink.tmpl.html
//outlink_v2/src/previewer.tmpl.html

//js file list:
//outlink_v2/src/ListView.js
//outlink_v2/src/Previewer.js
//outlink_v2/src/ad_link.js
//outlink_v2/src/android_serv.js
//outlink_v2/src/app_cfg.js
//outlink_v2/src/file/FileNode.js
//outlink_v2/src/file/NoteNode.js
//outlink_v2/src/file/file_type_map.js
//outlink_v2/src/file/parser.js
//outlink_v2/src/file_path/file_path.js
//outlink_v2/src/image_lazy_loader.js
//outlink_v2/src/mgr.js
//outlink_v2/src/note.js
//outlink_v2/src/outlink.js
//outlink_v2/src/selection.js
//outlink_v2/src/store.js
//outlink_v2/src/ui.file_list.js
//outlink_v2/src/ui.group.js
//outlink_v2/src/ui.js
//outlink_v2/src/ui.photo.js
//outlink_v2/src/ui.photo.single.js
//outlink_v2/src/verify_code.js
//outlink_v2/src/video.js
/**
 * ListView列表类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./ListView",["lib","common","$","./selection","./image_lazy_loader","./store","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        widgets = common.get('./ui.widgets'),
        selection = require('./selection'),
        image_lazy_loader = require('./image_lazy_loader'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        browser = common.get('./util.browser'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',


        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'outlink.list_view';
        this._select_mode = false; //选择模式
        if(this.auto_render) {
            this.render();
        }
    }

    ListView.prototype = {

        render: function() {
            if(this._rendered) {
                return;
            }

            image_lazy_loader.init(this.$ct);
            this.on_render();
            this.bind_events();
            this.on_refresh(store.get_cur_node().get_kid_nodes(), true);
            this._rendered = true;
        },

        /**
         * 监听store变化，更新视图
         */
        bind_events: function() {
            var store = this.store,
                me = this;
            //store events
            this.listenTo(store, 'before_refresh', function() {
                me.$ct.empty();
                me.$toolbar.hide();
                widgets.reminder.loading('加载中...');
                //widgets.reminder.loading('加载中...');
            }).listenTo(store, 'before_load', function() {
                $('#_load_more').show();
            }).listenTo(store, 'refresh_done', function(files) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);

                //屏蔽save_all行为
                //if(files.length === 1 && files[0].get_parent() && !files[0].get_parent().get_parent()) {
                //    this._$normal.find('button').attr('data-action', 'save_all');
                //} else {
                    this._$normal.find('button').attr('data-action', 'save');
                //}

            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                me.default_all_selected(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_load_fail(msg, is_refresh);
            });
        },

        on_render: function() {
            var me = this;
            var is_move = false;
            this.$ct.on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            //监听UI事件，然后让mgr处理
            this.$ct.on(target_action, '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $item = $(e.target).closest('[data-id=item]'),
                    action_name = $item.attr('data-action'),
                    file_id = $item.attr('data-file-id'),
                    file = me.store.get(file_id);
                if(me._select_mode) {
                    $item.toggleClass('checked');
                    selection.toggle_select(file);
                    me._$confirm_btn.toggleClass('btn-disable', !selection.get_selected().length);
                } else {
                    me.trigger('action', action_name, file, e);
                }
            });

            this._$confirms = this.$toolbar.find('[data-id=confirm]');
            this._$normal = this.$toolbar.find('[data-id=normal]');
            this._$confirm_btn = this.$toolbar.find('[data-action=confirm]');
            this.$toolbar.on(target_action, '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(selection.is_empty() && action_name === 'confirm') {
                    return;
                }

                if((action_name === 'save' || action_name === 'save_all' || action_name === 'download') && store.is_single_file() && (store.get_cur_node() === store.get_root_node())) {
                    //根目录是单个文件，直接一键保存
                    //me.default_all_selected(store.get_cur_node().get_kid_nodes());
                    me.trigger('action', action_name, store.get_cur_node().get_kid_nodes());
                    return;
                }

                if(action_name === 'save_all') {
                    me.trigger('action', action_name);
                    return;
                }
                if(action_name === 'save' || action_name === 'save_all' || action_name === 'download') {
                    me._$normal.hide();
                    //me._$confirm_btn.addClass('btn-disable').show();
	                me._$confirm_btn.attr('data-target', action_name === 'download' ? 'download' : 'save');
                    me._$confirm_btn.show();
                    me._$confirms.show();
                    me.default_all_selected(store.get_cur_node().get_kid_nodes());
                } else {
                    me._$normal.show();
                    me._$confirms.hide();
                    me._$confirm_btn.removeClass('btn-disable');
                    if(action_name === 'confirm') {
                        me.trigger('action', $target.attr('data-target'), selection.get_selected());
                    }
                }
                me.change_select_mode();
            });

        },

        change_select_mode: function() {
            this._select_mode = !this._select_mode;
            if(this._select_mode) {
                this.$ct.removeClass('unactive').addClass('active');
            } else {
                this.$ct.removeClass('active').addClass('unactive');
            }

            var me = this,
                selected_files = selection.get_selected();
            if(!this._select_mode) {

                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).removeClass('checked');
                });
                selection.clear();

            } else {
                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).addClass('checked');
                });
            }
        },

        on_refresh: function(files, is_async) {

            if(files.length) {
                if(!is_async) {
                    var html = tmpl.list({
                        list: files
                    });
                    this.$ct.empty().append(html);
                }
                this.$toolbar.show();
                image_lazy_loader.load_image();
            } else {
                this.$toolbar.hide();
                this.empty();
            }
        },

        default_all_selected: function(files) {
            var me = this;
            $.each(files, function(i, file) {
                me.get_$item_by_id(file.get_id()).addClass('checked');
                selection.select(file);
            });
        },

        on_add: function(files) {
            var html = tmpl.list({
                list: files
            });
            this.$ct.append(html);
        },

        on_load_fail: function(msg, is_refresh) {
            var me = this;
            if(is_refresh) {
                this.$ct.empty().append(tmpl.fail({
                    msg: msg
                }));

                $('#_fail').on(target_action, function(e) {
                    me.trigger('action', 'refresh');
                });
            }
        },

        empty: function() {
            this.$ct.empty().append(tmpl.empty());
        },

        get_$item_by_id: function(file_id) {
            return $('#item_' + file_id);
        },

        get_$ct: function() {
            return this._$ct;
        }

    };

    $.extend(ListView.prototype, events);

    return ListView;
});/**
 * 图片预览类
 * @author:hibincheng
 * @date:20150-01-30
 */
define.pack("./Previewer",["$","lib","common","./store","./tmpl"],function(require, exports, module) {
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
});/**
 * H5分享页顶部广告banner
 * @author xixinhuang
 * @date 2015-11-10
 */

define.pack("./ad_link",["lib","common","$","./store","./tmpl"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        user_log = common.get('./user_log'),
        urls = common.get('./urls'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        uin = cookie.get('uin'),

        boad_id = 2426,

        undefined;

    var ad_link = {
        render: function() {
            //当访客没有登录态时，就采用分享者的uin来代替
            var share_info = store.get_share_info(),
                me = this;

            uin = parseInt(uin.replace(/^[oO0]*/, '')) || share_info['share_uin'];

            if(typeof uin == "string") {
                uin = parseInt(uin.slice(1));
            }

            var opt = {
                    board_id: boad_id,
                    uin: uin
                };

            this.load_ad(opt)
                .done(function(rspData) {
                var ad;
                if(rspData.data && rspData.data.count > 0 && rspData.data[boad_id] && (ad = rspData.data[boad_id].items) && ad.length > 0) {
                    if (ad[0] && ad[0].extdata) {
                        me.init_ad_data(ad[0]);
                        me.render_ad();
                        me.reporter();
                        me._bind_events();
                    }
                }
            });
        },

        render_ad: function() {
            var background_url = this.opt.extdata['img'];
            this._$ad = $(tmpl.ad_h5());
            this._$ad.css('background-image', 'url(' + background_url + ');');
            $('#banner').after(this._$ad);
        },

        //保存广告数据
        init_ad_data: function(data) {
            var opt = {};
            opt.bosstrace = data.bosstrace;
            opt.extdata = JSON.parse(data.extdata);
            opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
            opt.from = (browser.IOS || browser.android)? 3 : 2;  //from：  1 pc， 2 wap， 3 手机
            opt.uin = uin;

            this.opt = opt;
        },

        _bind_events: function() {
            var me = this,
                close_btn = this._$ad.find('[data-id=ad_close]');
            close_btn && close_btn.on('click', function(e) {
                e.stopPropagation();
                me.remove_ad();
                me.opt['qboper'] = 3;
                me.reporter();
            });
            this._$ad.on('click', function() {
                me.opt['qboper'] = 2;
                me.reporter();
                me.remove_ad();
                window.open(me.opt.extdata['link']);
            });
        },

        show_ad: function(){
            this._$ad && this._$ad.show();
        },

        hide_ad: function() {
            this._$ad && this._$ad.hide();
        },

        remove_ad: function() {
            this._$ad && this._$ad.remove();
        },

        reporter: function() {
            var opt = this.opt;
            var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                from: opt.from,
                uin: opt.uin,
                bosstrace: opt.bosstrace,
                qboper: opt.qboper
            });
            //上报
            var img = new Image();

            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
            };
            img.src = report_url;
        },

        load_ad: function(opt) {
            var defer		= $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_strategy',
                data :{
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback",
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });

            return defer.promise();
        }
    }

    $.extend(ad_link, events);

    return ad_link;
});/**
 * 通过与安卓客户端的通信来获取某些信息。目前实现的主要接口是拿到客户端的版本号，后续可能还会再增加。
 * @author xixinhuang
 * @date 16-07-19
 */
define.pack("./android_serv",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),
        Module  = lib.get('./Module'),
        $ = require('$'),
        undefined;

    var default_url = 'weiyunserver://action/start_local_server',
        default_ports = [9091, 5656, 7374];

    var android_serv = new Module('android_serv', {
        /*
         * 启动客户端的server，这里使用schema，但不呼起客户端
         * */
        version_name: null,
        version_code: null,
        req_count: 0,

        start_server: function() {
            var me = this;

            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = '<iframe id="schema" src="' + default_url + '" scrolling="no" width="0" height="0"></iframe>';
            document.body.appendChild(div);

            //WebSocket方案暂时有问题，这里用http请求代替
            //var android_conn = new WebSocket('ws://' + schema_url);
            //android_conn.onmessage = function(event) {
            //    alert('message:' + event.data);
            //}
            //android_conn.onopen = function(event) {
            //    alert('open' + JSON.stringify(event));
            //    android_conn.send({'method': 'get_version'});
            //}
            //android_conn.onclose = function(event) {
            //    alert('onclose' + JSON.stringify(event))
            //}
            //android_conn.onerror = function(event) {
            //    alert('onerror' + JSON.stringify(event));
            //    android_conn.close();
            //}
            setTimeout(function () {
                document.body.removeChild(div);
                me.conn_server();
            }, 300);
        },

        conn_server: function() {
            if(this.req_count && !default_ports[this.req_count]) {
                return;
            }
            var me = this,
                url = 'http://localhost:' + default_ports[this.req_count] + '/?method=get_version';
                //url = 'http://localhost:' + default_ports[this.req_count] + '/?method=get_version';

            this.get_version(url).done(function(rspData) {
                if(rspData.error_code === 0) {
                    me.set_version(rspData);
                } else {
                    me.req_count++;
                    me.conn_server();
                }
            });
        },

        get_version: function(url) {
            var defer		= $.Deferred();
            $.ajax({
                type: 'GET',
                url: url,
                data: {},
                timeout: 3000,
                success: function(data){
                    (data && data.error_code === 0)? defer.resolve(data) : defer.reject(data);
                },
                error: function(res) {
                    defer.reject(res);
                }
            });
            return defer.promise();
        },

        set_version: function(data) {
            this.version_name = data.version_name;
            this.version_code = data.version_code;
        },

        compare_version: function(version, callback) {
            if(!this.version_name && !this.version_code) {
                this.start_server(default_url);
                callback(false);
            } else if((typeof version == 'number' && this.version_code >= version) || (typeof version == 'string' && this.version_name >= version)){
                callback(true);
            } else {
                callback(false);
            }
        },

        close: function() {

        }
    });

    return android_serv;
});/**
 * 微云app的schema配置
 * @author xixinhuang
 * @date 2015-12-24
 */
define.pack("./app_cfg",["lib","common","$","./store"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        store   = require('./store'),

        undefined;

    var app_cfg = new Module('outlink.app_cfg', {
        config_data: null,

        default_app_cfg: {
            android: {
                published: true,
                packageName:"com.qq.qcloud",
                packageUrl: "weiyunweb://android",
                scheme: "weiyunweb",
                url: window.location.protocol + "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
            },
            ios: {
                published: true,
                packageName: "com.tencent.weiyun",
                packageUrl: "weiyunaction://ios",
                scheme: "weiyun",
                url: window.location.protocol + "//www.weiyun.com"
            },
            appid: 'wx786ab81fe758bec2'
        },

        //这里给IOS使用，浏览器中检测手机是否安装了微云app。后续可能删除
        get_ios_schema: function(file) {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'],
                pdir_key =  file.get_pdir_key(),
                uin = share_info['share_uin'],
                file_id = file.get_id(),
                file_name = file.get_name(),
                file_size = file.get_size(),
                time = file.get_duration() || 0,
                thumb_url = file.get_video_thumb(1024);
            if(thumb_url) {
                thumb_url = thumb_url.slice(0, thumb_url.length-5);
            }

            var schema_url = 'weiyunaction://outlink_video/?share_key=' + share_key +'&pdir_key=' + pdir_key +'&file_owner=' + uin + '&file_id=' + file_id
                + '&file_name=' + encodeURIComponent(file_name) + '&file_size=' + file_size +'&duration=' + time +'&thumb_url=' + thumb_url;

            return schema_url;
        },

        get_config_data: function(callback) {
            var me = this;
            if(this.config_data) {
                callback(this.get_download_url());
                return;
            }
            require.async(constants.HTTP_PROTOCOL + '//imgcache.qq.com/qzone/qzactStatics/configSystem/data/65/config1.js', function(config_data) {
                if(!config_data) {
                    return;
                }
                me.config_data = config_data;
                callback(me.get_download_url());
            });
        },

        get_download_url: function() {
            var data = this.config_data;
            if(browser.IPAD) {
                return data.ipad['download_url'];
            } else if(browser.IOS){
                return data.iphone['download_url'];
            } else if(browser.android){
                return data.android['download_url'];
            }
        },

        //只针对IOS：注册一个新的schema来判断app的版本号，目前可以界定的版本是3.7
        get_version_cfg: function() {
            var version_cfg = this.default_app_cfg;
	        if(!browser.QQ) {
		        version_cfg.ios['packageUrl'] = 'weiyunsharedir://ios';
		        version_cfg.ios['scheme'] = 'weiyunsharedir';
	        }
            return version_cfg;
        },

        start_local_server: function() {
            //location.href = 'weiyun://action/start_local_server';

            var me = this;
            setTimeout(function() {
                window.onerror = function(event) {
                    alert('error' + event);
                }
                //$.ajax({
                //    type: 'GET',
                //    url: 'localhost:8080?method=get_version',
                //    success: function(result) {
                //       alert(JSON.stringify(result));
                //    },
                //    error: function(result) {
                //        alert(JSON.stringify(result));
                //    }
                //});
                var android_conn = new WebSocket('ws://localhost:5656');

                android_conn.onmessage = function(event) {
                    alert(event.data);
                }
                android_conn.onopen = function(event) {
                    android_conn.send({'method': 'get_version'});
                    android_conn.close();
                }
                android_conn.onclose = function(event) {
                    //alert(event.data);
                    alert('onclose')
                }
                android_conn.onerror = function(event) {
                    //alert(event.data);
                    alert('onerror')
                }
            }, 1000);
        },

        set_visibility: function(is_hidden) {
            this.is_visibility = !is_hidden;
            this.time = +new Date();
            var me = this;

            setTimeout(function() {
                me.is_visibility = true;
                me.time = 0;
            }, 5000);
        },
        /*
        * 判断页面可见性，需满足条件：1）设置过is_visibility; 2）时间在500ms内; 3) is_visibility属性为false，即不可见
        * */
        get_visibility: function() {
            var now = +new Date();
            if(this.time && (now - this.time < 500) && !this.is_visibility) {
                this.is_visibility = true;
                this.time = 0;
                return false;
            } else {
                return true;
            }
        },

        get_app_cfg: function(file){
            this.default_app_cfg.ios['packageUrl'] = this.get_ios_schema(file);
            //this.default_app_cfg.ios['packageUrl'] = 'weiyunaction://ios';
            //this.default_app_cfg.ios['scheme'] = 'weiyun';
            return this.default_app_cfg;
        }
    });

    return app_cfg;

});/**
 * 文件对象类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./file.FileNode",["lib","common","$","./file.file_type_map"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        prettysize = lib.get('./prettysize'),

        file_type_map = require('./file.file_type_map'),

        // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
        // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },
        // 视频文档类型
        EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },
        // 音乐文档类型
	    EXT_MUSIC_TYPES = { mp3: 1, wma: 1 },

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),

        PREVIEW_DOC_TYPE = ['xls', 'xlsx', 'doc', 'docx', 'rtf', 'ppt', 'pptx', 'pdf', 'txt'],

        COMPRESS_TYPE = ['rar','zip','7z'],

        undefined;

    function FileNode(opts) {
        var is_dir = !!opts.dir_key;
        this._is_dir = is_dir;
        if(is_dir) {
            this._ppdir_key = opts.ppdir_key || '';
            this._pdir_key = opts.pdir_key;
            this._id = opts.dir_key;
            this._name = opts.dir_name;
            this._mtime = opts.dir_mtime;
            this._ctime = opts.dir_ctime;
            this._file_size = 0;
            this._diff_version = opts.diff_version;
            this._attr = opts.dir_attr;
            this._ext_info = opts.ext_info;
        } else {
            this._ppdir_key = opts.ppdir_key;
            this._pdir_key = opts.pdir_key;
            this._id =  opts.file_id;
            this._name = opts.filename || opts.file_name;
            this._mtime = opts.file_mtime;
            this._ctime = opts.file_ctime;
            this._diff_version = opts.diff_version;
            this._file_size = opts.file_size;
            this._file_cursize = opts.file_cursize;
            this._file_sha = opts.file_sha;
            this._file_md5 = opts.file_md5;
            this._file_version = opts.file_version;
            this._lib_id = opts.lib_id;
            this._attr = opts.file_attr;
            this._ext_info = opts.ext_info;
            this._thumb_url = opts.thumb_url || opts.ext_info && opts.ext_info.thumb_url || '';
            this._video_thumb = opts.video_thumb || opts.ext_info && opts.ext_info.video_thumb || '';
            this._long_time = opts.long_time || opts.ext_info && opts.ext_info.long_time || '';
            this._readability_size = FileNode.get_readability_size(this._file_size);
        }
        this._type = FileNode.get_type(this._name, is_dir);
        this._ext = FileNode.get_ext(this._name);

        /******************以下属性用于目录树*************************/
        this._kid_dirs = [];
        this._kid_files = [];
        this._kid_nodes = [];
        this._kid_map = {};
    }

    FileNode.prototype = {

        is_root: function() {
            return this._id === 'root';
        },

        is_dir: function() {
            return !!this._is_dir;
        },

        is_note: function() {
            return false;
        },

        is_image: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_IMAGE_TYPES;
        },

        is_video: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_VIDEO_TYPES;
        },

	    is_music: function() {
		    var type = FileNode.get_type(this._name, false);
		    return type in EXT_MUSIC_TYPES;
	    },

        is_broken: function() {
            return this._file_cursize < this._file_size;
        },

        is_empty_file: function() {
            return this._file_size === 0;
        },

        is_preview_doc: function() {
            return $.inArray(this._type.toLowerCase(), PREVIEW_DOC_TYPE) > -1;
        },

        is_compress: function() {
            return $.inArray(this._type.toLowerCase(), COMPRESS_TYPE) > -1;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            return this.get_pdir_key();
        },

        get_ppid: function() {
            return this.get_ppdir_key();
        },

        get_pdir_key: function() {
            return this._pdir_key || this.get_parent() && this.get_parent().get_id();
        },

        get_ppdir_key: function() {
            return this._ppdir_key;
        },

        get_name: function() {
            return this._name;
        },

        get_type: function() {
            return this._type;
        },

        get_ext: function() {
            return this._ext;
        },

        get_size: function() {
            return this._file_size;
        },

        get_readability_size: function() {
            return this._readability_size;
        },

        get_modify_time: function() {
            return this._mtime;
        },

        get_create_time: function() {
            return this._ctime;
        },

        get_file_sha: function() {
            return this._file_sha;
        },

        get_file_md5: function() {
            return this._file_md5;
        },

        get_thumb_url: function(size) {
            if(this.is_image() && this._thumb_url) {
                if(size) {
                    size = size + '*' + size;
                    return this._thumb_url+ (this._thumb_url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
                } else {
                    return this._thumb_url;
                }
            }
            return '';
        },

        //后台返回的fileItem可能没有video_thumb，而是放在了thumb_url上
        get_video_thumb: function(size) {
            if(this.is_video()) {
                return (this._video_thumb || this._thumb_url) + '/' + size || '';
            }
        },

        /**
         * 视频时长
         */
        get_duration: function() {
            if(this.is_video()) {
                return this._long_time;
            }
            return '';
        },

        /******************以下方法用于目录树*************************/

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        },

        add_node: function(node) {
            node.set_parent(this);
            this._kid_nodes.push(node);
            if(node.is_dir()) {
                this._kid_dirs.push(node);
            } else {
                this._kid_files.push(node);
            }
            this._kid_map[node.get_id()] = node;
        },

        add_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.add_node(node);
            });
        },

        remove_node: function(node) {

        },

        remove_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.remove_node(node);
            });
        },

        remove_all: function() {
            var nodes = this.get_kid_nodes();
            this.remove_nodes(nodes);
            this.set_load_done(false);
        },

        get_kid_dirs: function() {
            return this._kid_dirs;
        },

        get_kid_files: function() {
            return this._kid_files;
        },

        get_kid_nodes: function() {
            return this._kid_nodes;
        },

        get_kid_count: function() {
            return this._kid_nodes.length;
        },

        get_kid_images: function() {
            var kid_files = this.get_kid_files(),
                images = [];

            $.each(kid_files, function(i, file) {
                if(file.is_image()) {
                    images.push(file);
                }
            });

            return images;
        },

        get_kid: function(index) {
            return this._kid_nodes && this._kid_nodes[index];
        },

        set_load_done: function(done) {
            this._load_done = !!done;
        },

        is_load_done: function() {
            return this._load_done;
        }


    };

    /**
     * 获取文件类型（ 不是后缀名，如 a.wps 的get_type() 会返回 doc ）
     * @param {String} name
     * @param {Boolean} is_dir
     * @return {String}
     */
    FileNode.get_type = function (name, is_dir) {
        var ext;
        if (is_dir) {
            return file_type_map.get_folder_type();
        } else {
            ext = !is_dir ? FileNode.get_ext(name) : null;
            if (ext) {
                return file_type_map.get_type_by_ext(ext);
            }
        }
        // 没有后缀名的默认为file
        return 'file';
    };

    FileNode.is_image = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    FileNode.is_video = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_VIDEO_TYPES;
    };

	FileNode.is_music = function (name) {
		var type = FileNode.get_type(name, false);
		return type in EXT_MUSIC_TYPES;
	};

    FileNode.get_ext = function(name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;

    }

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Boolean} [is_dir] 是否目录（目录会返回空字符串）
     * @param {Number} [decimal_digits] 保留小数位，默认1位
     */
    FileNode.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        if(bytes === -1){
            return '超过4G';
        }

        bytes = parseInt(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

        if (!bytes)
            return '0B';

        var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        var size = bytes / Math.pow(1024, unit);
        var decimal_mag = Math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = Math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
        var int_size = parseInt(decimal_size);
        var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

        return result + BYTE_UNITS[unit];
    };

    $.extend(FileNode.prototype, events);

    return FileNode;
});/**
 * 笔记对象类
 * @date 2015-07-29
 * @author hibincheng
 */
define.pack("./file.NoteNode",[],function(require, exports, module) {

    function NoteNode(opt) {
        this._id = opt.note_id;
        this._name = opt.note_title;
        this._create_time = opt.note_ctime;
        this._modify_time = opt.note_mtime;
    }

    NoteNode.prototype = {

        is_dir: function() {
            return false;
        },

        is_image: function() {
            return false;
        },

        is_note: function() {
            return true;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            if(this.get_parent()) {
                return this.get_parent().get_id();
            }

        },

        get_pdir_key: function() {
            return this.get_pid();
        },

        get_name: function() {
            return this._name;
        },

        get_create_time: function() {
            return this._create_time;
        },

        get_modify_time: function() {
            return this._modify_time;
        },

        get_type: function() {
            return 'note';
        },

        //===========================

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        }
    }

    return NoteNode;
});define.pack("./file.file_type_map",[],function (require, exports, module) {

    var defaults = 'normal',
        folder_type = 'folder',
        type_map = {
            doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptm'],
            bmp: ['bmp', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'ram', 'ra', 'au'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
            rmvb: ['rmvb'],
            rm: ['rm'],
            hlp: ['hlp', 'cnt'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec: ['exec', 'dll'],
            pdf: ['pdf'],
            txt: ['txt', 'text'],
            msg: ['msg'],
            rp: ['rp'],
            vsd: ['vsd'],
            ai: ['ai'],
            eps: ['eps'],
            log: ['log'],
            xmin: ['xmin'],
            psd: ['psd'],
            png: ['png'],
            gif: ['gif'],
            mod: ['mod'],
            mov: ['mov'],
            avi: ['avi'],
            swf: ['swf'],
            flv: ['flv'],
            wmv: ['wmv'],
            wma: ['wma'],
            mp3: ['mp3'],
            mp4: ['mp4'],
            ipa: ['ipa'],
            apk: ['apk'],
            ipe: ['ipe'],
            exe: ['exe'],
            msi: ['msi'],
            bat: ['bat'],
            fla: ['fla'],
            html: ['html'],
            htm: ['htm'],
            asp: ['asp'],
            xml: ['xml'],
            chm: ['chm'],
            rar: ['rar'],
            zip: ['zip'],
            tar: ['tar'],
            cab: ['cab'],
            uue: ['uue'],
            jar: ['jar'],
            iso: ['iso'],
            dmg: ['dmg'],
            bak: ['bak'],
            tmp: ['tmp'],
            ttf: ['ttf'],
            otf: ['opt'],
            old: ['old'],
            docx: ['docx'],
            wps: ['wps'],
            xlsx: ['xlsx'],
            pptx: ['pptx'],
            dps: ['dps'],
            et:  ['et'],
            key: ['key'],
            numbers: ['numbers'],
            pages: ['pages'],
            keynote: ['keynote'],
            mkv: ['mkv'],
            mpg: ['mpg'],
            mpeg: ['mpeg'],
            dat: ['dat'],
            f4a: ['f4a'],
            webm: ['webm'],
            ogg: ['ogg'],
            acc: ['acc'],
            m4a: ['m4a'],
            wave: ['wave'],
            midi: ['midi'],
            ape: ['ape'],
            aac: ['aac'],
            aiff: ['aiff'],
            mid: ['mid'],
            xmf: ['xmf'],
            rtttl: ['rtttl'],
            flac: ['flac'],
            amr: ['amr'],
            ttc: ['ttc'],
            fon: ['fon'],
            sketch: ['sketch'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c', 'sketch',
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon'
        ];



    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        var sub_types = type_map[_can_ident[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident[sub_types[j]] = 1;
        }
    }

    var getWords = function (str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return ( str.substr(0, i) + '..' );
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };

    return {

        get_type_by_ext: function (type) {
            return all_map[type] || defaults;
        },
        get_folder_type: function () {
            return folder_type;
        },
        can_identify: function (type) {
            return !!can_ident[type];
        },
        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function (file_name, type) {
            switch (type) {
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring(0, 7), '...', file_name.substring(file_name.length - 7) ].join('') : file_name;
            }

        }
    };

});/**
 * 把cgi返回的数据转换成文件对象
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./file.parser",["lib","$","./file.FileNode"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        Module = lib('./Module'),
        FileNode = require('./file.FileNode'),

        undefined;

    var parser = new Module('file.parser', {

        parse: function(data) {
            var list = [];
            if(data.dir_list && data.dir_list.length > 0) {
                list = list.concat(data.dir_list);
            }

            if(data.file_list && data.file_list.length > 0) {
                list = list.concat(data.file_list);
            }

            var nodes = [];
            if(list.length > 0) {
                $.each(list || [], function(i, item) {
                    nodes.push(new FileNode(item));
                });
            }

            return nodes;
        }
    });

    return parser;
});/**
 * 面包屑
 */
define.pack("./file_path.file_path",["$","lib","common","./store","./tmpl"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        last_path_key,
        last_left_w = 0,
        undefined;

    var moving = false;

    var file_path = new Module('outlink.file_path', {

        render: function() {
            this.$ct = $('#file_path');
            var me = this;
            me.$ct.on(target_action, 'li', function(e) {
                if(moving) {
                    return;
                }
                var $target = $(e.target);
                var dir_key = $target.attr('data-key');
                if(dir_key && last_path_key !== dir_key) {
                    me.trigger('action', 'click_path', dir_key, e);
                    me.update(store.get(dir_key));
                }
            });

            require.async('Swipe', function() {

                me.init_swipe();
            });
        },

        init_swipe: function() {
            function transformBox(value){
                var time=300;
                value = last_left_w + value;
                if(value > 0) {
                    value = 0;
                }
                if(Math.abs(value) + $(window).width() > me.get_$list().width()) {
                    return;
                }
                me.get_$list().css({
                    '-webkit-transform': 'translateX('+value+'px)',
                    '-ms-transform': 'translateX('+value+'px)',
                    '-o-transform': 'translateX('+value+'px)',
                    '-webkit-transition':time+'ms linear',
                    'transform': 'translateX('+value+'px)',
                    'transition':time+'ms linear'
                });

                last_left_w = value;
            }
            var me = this;

            me.get_$list().width($(window).width());
            me.get_$ct().Swipe({
                iniAngle:15,
                speed: 300,
                iniL:30,
                mode: 'left-right',
                sCallback: function(tPoint) {
                },
                mCallback:function(tPoint){
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        console.log(tPoint.mX);
                        transformBox(tPoint.mX);
                    }
                    moving = true;
                },
                eCallback:function(tPoint){
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        transformBox(tPoint.mX);
                    }
                    moving = false;
                }
            });
        },

        update: function(dir) {
            var parent_list = this.get_parents(dir);
            this.$ct.empty();
            this.$ct.append(tmpl.file_path(parent_list));
            var real_width = 0;
            this.$ct.find('li').each(function(i, item) {
                real_width += $(item).width() + 3;
            });
            real_width = real_width + 60;

            var $list = this.get_$list();
            var win_w = $(window).width();
            $list.width(real_width);
            if(real_width > win_w) {
                var lef_w = -(real_width - win_w);
                $list.css({
                    '-webkit-transform': 'translateX('+lef_w+'px)',
                    '-ms-transform': 'translateX('+lef_w+'px)',
                    '-o-transform': 'translateX('+lef_w+'px)',
                    'transform': 'translateX('+lef_w+'px)'
                });

                last_left_w = lef_w;
            } else {
                $list.width(real_width);
            }
            last_path_key = dir.get_id();
        },

        get_parents: function(dir) {
            var dirs = [dir];
            while (dir.get_parent() && (dir = dir.get_parent())) {
                dirs.push(dir);
            }
            dirs.reverse();

            return dirs;
        },

        get_$ct: function() {
            return this.$ct;
        },

        get_$list: function() {
            return  this.$ct.find('ul');
        }

    });

    return file_path;
});/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./image_lazy_loader",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        rAF = common.get('./polyfill.rAF'),

        undefined;

    var img_size;
    var big_show = false;
    var minHeight = 0;

    var screen_h = window.screen.height;
    var win_h = $(window).height();
    var win_w = $(window).width();

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);
            if($('#photo_list').length > 0) {
                //img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? '240*240' : '120*120';
                img_size = 1024;//大图模式
                big_show = true;
               minHeight = parseInt(this.$ct.find('[data-src]').css('min-height') || 0, 10);

            } else {
                img_size = 64;
            }
            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var me = this;
            window.requestAnimationFrame(function() {
                me._load_image();
            });
        },

        _load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_scrolltop = window.pageYOffset,
                me = this;
            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_h + win_scrolltop + 100) {
                        image_loader.load(me.get_thumb_url($img.attr('data-src'), img_size)).done(function(img) {
                            $img.attr('data-loaded', 'true');
                            if(big_show) {
                                $img.parent().height('auto');
                                $img.css({
                                    minHeight: '0'
                                });

                                if(img.naturalHeight*win_w/img.naturalWidth >= screen_h*2) {//按宽度100%显示时，高度大于的2倍屏幕高为长图
                                    $img.parent().addClass('height').height(minHeight);
                                }
                                $img.attr('src', img.src);

                                if($img.height() > 0 && $img.height() < minHeight) { //跳动后，图片过小，则进行补齐
                                    me.load_image();
                                }

                            } else {
                                $img.css('backgroundImage', "url('"+img.src+"')");
                            }
                        }).fail(function(img) {
                            var path = 'share' + location.pathname,
                                url = img.getAttribute('src');
                            logger.report(path, {url: url, type: 'lazy_loader'});
                        });
                    }
                }
            });
        },


        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }

            if(size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else {
                return url;
            }
        }
    });

    return lazy_loader;
});/**
 * mgr
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./mgr",["lib","$","common","./selection","./store","./ad_link","./app_cfg","./verify_code"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        logic_error_code = common.get('./configs.logic_error_code'),
        ret_msgs = common.get('./ret_msgs'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        app_api = common.get('./app_api'),
        user = common.get('./user'),
	    https_tool = common.get('./util.https_tool'),
        selection = require('./selection'),
        store = require('./store'),
        ad_link = require('./ad_link'),
        app_cfg = require('./app_cfg'),
        verify_code = require('./verify_code'),

        default_app_cfg,
        DEFAULT_TIMEOUT = 10, //默认超时时间为10s

        undefined;

    var ios_preview_file_type = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
    var compress_type_map = ['rar','zip','7z'];

    var mgr = new Mgr('outlink.mgr', {

        init: function(cfg) {
            var me = this;
            session_event.on('session_timeout', function() {
                me.to_login();
            });

            $.extend(this, cfg);
            this.observe(this.file_path);
            this.observe(this.view);
        },

        //定位到某个目录
        on_click_path: function(dir_key) {
            store.load_dir_kid(dir_key);
            if(dir_key === store.get_root_node().get_id()) {
                ad_link.show_ad();
            }
        },

        //以下是自定义的事件处理逻辑

        on_download: function(files) {
            var selected_files = files || selection.get_selected();
	        if(0 && browser.QQ) {
		        this.do_qq_download(selected_files);
	        } else {
		        this.do_download(selected_files[0]);
	        }
        },

        on_save: function(files) {
            if(files.length && !files[0].is_note()) {
                var me = this;
                default_app_cfg = app_cfg.get_version_cfg();

                if(browser.android && (browser.QQ || browser.QZONE)) {
                    app_api.getAppVersion(default_app_cfg, function(app_version) {
                        if(app_version && app_version >= '3.8.0') {
                            me.do_launch_save(files);
                        } else {
                            me.do_save(files);
                        }
                    });
                } else if(browser.android && browser.WEIXIN) {
                    app_api.isAppInstalled(default_app_cfg, function (result) {
                        if ((result && result.indexOf("get_install_state:yes") >= 0)) {
                            var arr = result.split('_'),
                                version_code = arr && arr.length > 1 ? arr[arr.length - 1] : '';
                            if (version_code > '858') {
                                me.do_launch_save(files);
                            } else {
                                me.do_save(files);
                            }
                        } else {
                            me.do_save(files);
                        }
                    });
                //} else if(browser.android && !constants.IS_HTTPS) {
                //    android_serv.get_version('3.8.0', function (result) {
                //        if (result) {
                //            me.do_launch_save(files);
                //        } else {
                //            me.do_save(files);
                //        }
                //    });
                //} else if(browser.IOS && browser.WEIXIN) {
                //    widgets.reminder.ok('IOS weixin save');
                //    app_api.launchWyApp(default_app_cfg, function(result) {
                //        if(!result){
                //            me.do_save(files);
                //        }
                //    });
                } else if(browser.IOS && browser.QQ) {
                    me.do_launch_save(files);
                } else {
                    me.do_save(files);
                }
            } else {
                this.do_save(files);
            }
        },

        /*
        * 呼起客户端起来选目录，支持安卓微信手Q和IOS手Q
        * */
        do_launch_save: function(files) {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加载中...');

            var me = this,
                file_size = 0,
                selected_files = files || selection.get_selected(),
                origin_share_key = store.get_share_info()['share_key'],
                owner_uin = store.get_share_info().share_uin,
                note_list = [],
                file_list = [],
                dir_list = [];

            $.each(selected_files, function(i, file) {
                if(file.is_dir()) {
                    dir_list.push({
                        pdir_key: file.get_pdir_key(),
                        dir_key: file.get_id(),
                        owner_uin: owner_uin
                    });
                } else {
                    file_list.push({
                        pdir_key: file.get_pdir_key(),
                        file_id: file.get_id()
                    });
                    file_size += file.get_size();
                }
            });

            var req_body = {
                origin_share_key: origin_share_key,
                note_list: note_list,
                dir_list: dir_list,
                file_list: file_list
            };

            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var one_file = selected_files[0],
                title = one_file.get_name() + (selected_files.length > 1 ? '等'+ selected_files.length + '个文件' : ''),
                thumb_url = 'http://imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_' + one_file.get_type() + '.png';
            default_app_cfg = app_cfg.get_version_cfg();

            this.handle_timeout(5, true, {
                'launch_save': JSON.stringify(req_body)
            });

            request
                .xhr_post({
                    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                    cmd: 'WeiyunShareAddTemp',
                    use_proxy: false,
                    header: {
                        device_info: JSON.stringify({browser: browser_name})
                    },
                    body: req_body,
                    timeout: 5,
                    cavil: true
                })
                .ok(function (msg, body) {
                    me._request = false;
                    widgets.reminder.hide();
                    var schema = browser.IOS? 'weiyunsharedir' : 'weiyunweb';
                    var schema_url = schema + '://save/?share_key=' + body['trans_key'] + '&title=' + encodeURIComponent(title) + '&file_size=' + file_size + '&thumb_url=' + encodeURIComponent(thumb_url);
                    if(browser.IOS && browser.QQ) {
                        setTimeout(function() {
                            var is_visibility = app_cfg.get_visibility();
                            if(is_visibility) {
                                me.do_save(files);
                            }
                        }, 100);
                    }
                    location.href = schema_url;
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        do_save: function(files) {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加载中...');

            var selected_files = files || selection.get_selected();
            var share_info = store.get_share_info();
            var me = this;
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                dir_list: [],
                file_list: [],
                note_list: []
            }
            for(var i = 0, len = selected_files.length ; i < len; i++) {
                var file = selected_files[i];
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data['note_list'].push({
                        note_id: file.get_id()
                    });
                } else {
                    data['file_list'].push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            this.handle_timeout(5, true, {
                'h5_save': JSON.stringify(data)
            });

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: share_info['type'] === 'note' ? 'WeiyunShareSaveData' : 'WeiyunSharePartSaveData',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                timeout: 5,
                body: data
            }).ok(function() {
                me._request = false;
                widgets.reminder.ok('保存成功');
                me.jump_app();
            }).fail(function(msg, ret) {
                me._request = false;
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '保存失败');
                } else {
                    widgets.reminder.hide();
                }
            });
        },

        on_join: function() {
            if(store.get_share_info().share_type !== 13) {
                return;
            }
            var file = store.get_root_node().get_kid_nodes()[0],
                me = this;
            default_app_cfg = app_cfg.get_version_cfg();

            if(browser.android && (browser.QQ || browser.QZONE)) {
                app_api.getAppVersion(default_app_cfg, function(app_version) {
                    if(app_version && app_version >= '3.8.0') {
                        me.do_launch_join();
                    } else {
                        me.do_join();
                    }
                });
            } else if(browser.android && browser.WEIXIN) {
                app_api.isAppInstalled(default_app_cfg, function(result) {
                    if((result && result.indexOf("get_install_state:yes") >= 0)) {
                        var arr = result.split('_'),
                            version_code = arr && arr.length > 1? arr[arr.length - 1] : '';
                        if(version_code > '858') {
                            me.do_launch_join();
                        } else {
                            me.do_join();
                        }
                    } else {
                        me.do_join();
                    }
                });
            //} else if(browser.android && !constants.IS_HTTPS) {
            //    android_serv.get_version('3.8.0', function (result) {
            //        if (result) {
            //            me.do_launch_join();
            //        } else {
            //            me.do_join();
            //        }
            //    });
            //} else if(browser.IOS && browser.WEIXIN) {
            //    me.do_launch_join();
                //app_api.launchWyApp(default_app_cfg, function(result) {
                //    if(!result){
                //        me.do_join();
                //    }
                //});
            } else if(browser.IOS && (browser.QQ || browser.WEIXIN)) {
                me.do_launch_join();
            } else {
                me.do_join();
            }
        },

        do_launch_join: function() {
            var me = this,
                file = store.get_root_node().get_kid_nodes()[0],
                schema = browser.android? 'weiyun://action/group_join' : 'weiyunsharedir://group_join',
                schema_url,
                share_uin = store.get_share_info().share_uin,
                nickname = store.get_share_info().share_nick_name,
                dir_key = file.get_id(),
                dir_name = file.get_name(),
                group_key = file.get_id();

            schema_url = schema + '?group_owner_uin=' + share_uin + '&invite_nickname=' + nickname + '&dir_key=' + dir_key + '&dir_name=' + encodeURIComponent(dir_name) + '&group_key=' + group_key;

            if(browser.IOS && browser.QQ) {
                setTimeout(function() {
                    var is_visibility = app_cfg.get_visibility();
                    if(is_visibility) {
                        me.do_join();
                    }
                }, 100);
            } else if(browser.IOS && browser.WEIXIN) {
                setTimeout(function() {
                    me.do_join();
                }, 300);
            }

            location.href = schema_url;
        },
        /*
        * H5加入共享
        * */
        do_join: function() {
            if(this._request) {
                return;
            }
            this._request = true;
            widgets.reminder.loading('加入中...');

            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var selected_files = store.get_root_node().get_kid_nodes();
            var share_info = store.get_share_info();
            var me = this;

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                dir_list: [],
                file_list: [],
                note_list: []
            }
            for(var i = 0, len = selected_files.length ; i < len; i++) {
                var file = selected_files[i];
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data['note_list'].push({
                        note_id: file.get_id()
                    });
                } else {
                    data['file_list'].push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            this.handle_timeout(5, true, {
                'h5_join_group': JSON.stringify(data)
            });

            request
                .xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartSaveData',
                    use_proxy: false,
                    header: {
                        device_info: JSON.stringify({browser: browser_name})
                    },
                    body: data,
                    timeout: 5,
                    cavil: true
                })
                .ok(function (msg, body) {
                    me._request = false;
                    widgets.reminder.hide();
                    //widgets.reminder.ok('加入成功');
                    me.view.show_tips();
                })
                .fail(function (msg, ret) {
                    widgets.reminder.error(msg);
                    me._request = false;
                });
        },

        //暂时不用
        on_mobile_save: function(files) {
            var file = files.length>0? files[0] : '',
                share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                me = this;

            if(!file) {
                widgets.reminder.error('保存失败');
            }
            if(typeof mqq === 'undefined') {
                return;
            } else if(!mqq.compare('5.2') < 0) {
                widgets.reminder.error('保存失败，请升级qq版本');
                return;
            }
            if(!mqq.android) { //android下本身有loading提示
                widgets.reminder.loading('保存中...');
            }

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

                mqq.media.saveImage({
                    content: https_tool.translate_url(body['download_url'].replace(/^http:|^https:/, ''))
                }, function(data) {
                    if(data.retCode !== 0) {
                        error = data.msg || '保存失败';
                    }
                    widgets.reminder.ok('保存成功');
                });

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                widgets.reminder.error('保存失败' + msg);

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> files_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        //这里为支持呼起选目录，屏蔽掉save_all行为
        on_save_all: function() {
            widgets.reminder.loading('保存中...');
            var share_info = store.get_share_info();
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var me = this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareSaveData',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: {
                    share_key: share_info['share_key'],
                    pwd: share_info['pwd']
                }
            }).ok(function() {
                widgets.reminder.ok('保存成功');
                me.jump_app();
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '保存失败');
                }
            })
        },

        on_open: function(file) {
            var file = store.get(file);

            if(file.is_dir()) {
                this.file_path.update(file);
                store.load_dir_kid(file.get_id());
                ad_link.hide_ad();
            } else if(0 && browser.QQ) {
	            this.do_qq_download([file]);
            } else if(file.is_note()) {
                this.preview_note(file);
            } else if(file.is_image()) {
                this.view.image_preview(file);
            } else if(file.is_preview_doc() || compress_type_map.indexOf(file.get_type()) > -1) {
                this.preview_doc(file);
            } else if(file.is_video()) {
                this.play_video(file, true);
            } else {
                this.do_download(file);
            }

        },

        preview_note: function(note) {
            var browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME);
            var share_info = store.get_share_info();
            var me = this;
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                note_id: note.get_id()
            };

            widgets.reminder.loading();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareNoteView',
                use_proxy: false,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: data
            }).ok(function(msg, body) {
                widgets.reminder.hide();
                if(body.note_info) {
                    me.view.note_preview(note, {
                        note_summary: body.note_info['note_summary'],
                        note_content: body.note_info['html_content'],
                        note_article_url: body.note_info['article_url']
                    });
                } else {
                    widgets.reminder.error('获取笔记内容失败');
                }
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '获取笔记内容失败');
                }
            });
        },

        preview_doc: function(file) {
            var share_info = store.get_share_info(),
	            me = this;

            this.view.doc_preview(file, {
                share_key: share_info['share_key'],
                share_pwd: share_info['pwd']
            }, null, function() {
	            setTimeout(function () {
		            me.show_tips();
	            }, 300);
            });
        },

        play_video: function(file, need_show_tips) {
            var type = file.get_type().toLowerCase(),
                $toolbar = $('#wx_note_confirm'),
                size = file.get_size(),
                me = this;

            default_app_cfg = app_cfg.get_app_cfg(file);

            //IOS9.0的微信呼起接口，需要IOS先发版本，后续H5再切过去
            if(browser.IS_IOS_9 && (browser.WEIXIN || browser.QZONE)) {
            //if(browser.IS_IOS_9 && browser.WEIXIN && app_api.launchWyApp) {
            //    app_api.launchWyApp(default_app_cfg, function (res) {
            //        alert(JSON.stringify(res));
            //        //呼起失败，给出提示语
            //    });
            //    return;
            //} else if(browser.IS_IOS_9 && browser.QZONE) {
            //    if(size < LIMIT_VEDIO_SIZE && type == 'mp4') {
            //        this.play_mp4_video(file);
            //        return;
            //    }
                //IOS9.0以上系统不支持用应用API去判断是否安装app
                window.location.href = default_app_cfg.ios['packageUrl'];

                need_show_tips && setTimeout(function () {
                    me.show_tips(file.is_video() ? 1 : 0);

                    //再隔2s后提示浮层自动消失
                    setTimeout(function () {
                        $toolbar.hide();
                    }, 5000);
                }, 300);
                return;
            }

            app_api.isAppInstalled(default_app_cfg, function(is_install_app) {
                if(is_install_app){
                    me.play_common_video(file);
                //} else if(size < LIMIT_VEDIO_SIZE && type == 'mp4') {
                //    me.play_mp4_video(file);
                } else {
                    //未安装app的跳至微云官网页面下载app
                    need_show_tips && me.show_tips(file.is_video() ? 1 : 0);
                }
            });
        },

        play_common_video: function(file) {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'],
                pdir_key =  file.get_pdir_key(),
                uin = share_info['share_uin'],
                file_id = file.get_id(),
                file_name = file.get_name(),
                file_size = file.get_size(),
                time = file.get_duration() || 0,
                thumb_url = file.get_video_thumb(1024);
            if(thumb_url) {
                thumb_url = thumb_url.slice(0, thumb_url.length-5);
            }
            var schema = browser.IOS? 'weiyunaction' : 'weiyunweb';

            var schema_url = schema + '://outlink_video/?share_key=' + share_key +'&pdir_key=' + pdir_key +'&file_owner=' + uin + '&file_id=' + file_id
                + '&file_name=' + encodeURIComponent(file_name) + '&file_size=' + file_size +'&duration=' + time +'&thumb_url=' + thumb_url;

            window.location.href = schema_url;
        },

        play_mp4_video: function(file) {
            var share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                me = this;

            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                download_type: browser.android ? 5 : 9
            }
            data['file_list'] = [{
                file_id: file.get_id(),
                pdir_key: file.get_pdir_key()
            }];

            widgets.reminder.loading();

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

                me.view.video_play(file, {
                    video_src: https_tool.translate_url(body['download_url'].replace(/^http:|^https:/, ''))
                });
                widgets.reminder.hide();

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '下载失败');
                }

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        show_tips: function(mode) {
            var $toolbar = $('#wx_note_confirm'),
	            title = $toolbar.find('.wx_note_title'),
	            desc = $toolbar.find('.wx_note_description');
	        //设置文案
	        mode = mode || 0;
	        title.html(mode ? '用微云丰富生活' : '用微云管理文件');
	        desc.html(mode ? '视频在线播放、音乐流畅收听' : '文档在线预览、笔记随记随存');
	        //未安装app的弹出提示
            $toolbar.show();
            $toolbar.find('[data-action="cancel"]').off('click').on('click', function() {
                $toolbar.hide();
            });
            $toolbar.find('[data-action="install"]').off('click').on('click', function() {
                //未安装app的跳至微云官网页面下载app
                app_cfg.get_config_data(function(download_url) {
                    if(download_url) {
                        window.location.href = download_url;
                    } else {
                        $toolbar.hide();
                        widgets.reminder.error('没有对应系统的客户端');
                    }
                });
            });
        },

	    do_qq_download: function(files) {
		    var share_info = store.get_share_info();
		    var data = {
			    share_key: share_info['share_key'],
			    pwd: share_info['pwd']
		    };
		    data.file_list = [];
		    for(var i=0, len=files.length; i<len; i++) {
			    if(!files[i].is_dir()) {
				    data.file_list.push({
					    file_id: files[i].get_id(),
					    pdir_key: files[i].get_pdir_key()
				    });
			    }
		    }

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
			    cmd: 'WeiyunShareBatchDownload',
			    use_proxy: false,
			    header: {
				    device_info: JSON.stringify({browser: 'qq'})
			    },
			    body: data
		    }).ok(function(msg, body) {
			    setTimeout(function() {
				    var config = {
					    file_list: []
				    };
				    for(var i=0, ilen=files.length; i<ilen; i++) {
					    for(var j=0, jlen=body.file_list.length; j<jlen; j++) {
						    if(files[i].get_id() === body.file_list[j].file_id) {
							    config.file_list.push({
								    url: https_tool.translate_url(body.file_list[j].download_url).replace(/^http:|^https:/, 'https:'),
								    file_id: files[i].get_id(),
								    file_size: files[i].get_size(),
								    pdir_key: files[i].get_pdir_key(),
								    pack_name: files[i].get_name(),
								    FTN5K: body.file_list[j].cookie_value
							    });
						    }
					    }
				    }
				    if(!app_api.createDownload(config, function(jobid) {
					    if(jobid) {
						    setInterval(function() {
							    app_api.checkDownload(jobid, function(path) {
								    if(path) {
									    window.location.href = 'file://' + path;
								    }
							    });
						    }, 5000);
					    } else {
						    widgets.reminder.error('创建下载任务失败[jobid null]');
					    }
				    })) {
					    widgets.reminder.error('创建下载任务失败');
				    }
			    }, 10);

			    //成功的也上报, 方便统计和设置告警
			    logger.monitor('js_download_error', 0, 0);
		    }).fail(function(msg, ret) {
			    widgets.reminder.error('请求下载任务失败');
		    });
	    },

        do_download: function(file) {
	        var me = this;
            var share_info = store.get_share_info();
            var browser_name = browser.WEIXIN ? 'weixin' : (browser.QQ ? 'qq' : constants.BROWSER_NAME);
            var data = {
                share_key: share_info['share_key'],
                pwd: share_info['pwd'],
                pdir_key: file.get_pdir_key(),
                pack_name: file.get_name()
            };
            //ios下限定下载为office文件，防止存储型xss
            if(browser.IOS && !file.is_dir() && ios_preview_file_type.indexOf(file.get_type()) < 0) {
	            file.is_music() ? me.show_tips(1) : widgets.reminder.error('暂时不支持此格式预览');
                return;
            }
            //目前先支持单文件转存
            if(file.is_dir()) {
                data['dir_list'] = [{
                    dir_key: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }];
            } else {
                data['file_list'] = [{
                    file_id: file.get_id(),
                    pdir_key: file.get_pdir_key()
                }];
            }

            var msg = file.is_dir() ? '是否下载此文件夹' : '是否下载此文件';

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
                setTimeout(function() {
	                var downloadUrl = body['download_url'];
	                window.location.href = https_tool.translate_url(downloadUrl.replace(/^http:|^https:/, ''));
                }, 10);

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                if(!ret_msgs.is_sess_timeout(ret)) {
                    widgets.reminder.error(msg || '下载失败');
                }

                //日志上报
                var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                console_log.push('view_raw error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                console_log.push('error --------> file_name: ' + file._name + ', type: ' + file._type + ', size: ' + file._readability_size + ', file_id: ' + file._id);
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },


        on_secret_view: function(data) {
            widgets.reminder.loading('请稍候...');
            var me = this,
                verify_sig = cookie.get('verifysession'),
                share_info = store.get_share_info(),
                browser_name = browser.WEIXIN? 'weixin' : (browser.QQ? 'qq' : constants.BROWSER_NAME),
                req_body = {
                    os_info: constants.OS_NAME,
                    browser: constants.BROWSER_NAME,
                    share_key: location.pathname.replace('/',''),
                    share_pwd: data['pwd']
                };

            if (data.verify_code && verify_sig) {//有验证码需要加上
                req_body.verify_code = data.verify_code;
                req_body.verify_sig = verify_sig;
            }
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareView',
                use_proxy: false,
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: browser_name})
                },
                body: req_body
            }).ok(function(msg, body) {
                cookie.set('sharepwd', data['pwd']);
                location.reload();
            }).fail(function(msg, ret) {
                if (ret == 114303) {      //114303  代表密码错误
                    if (me.view.is_need_verify_code()) {  //需要验证码时，错误后需要刷新下验证码至最新
                        verify_code.change_verify_code();
                    }
                    widgets.reminder.error('密码错误');
                } else if (ret == 114304) { // 输入错误次数频率过高，需要输入验证码
                    verify_code.show();
                    me.view.set_need_verify_code();
                    me.view.set_pwd_err_text('密码输错多次，请输入验证码');
                    widgets.reminder.hide();
                } else if (ret == 114305) { //验证码错误
                    verify_code.change_verify_code();
                    me.view.set_verify_err_text('验证码错误');
                    widgets.reminder.hide();
                } else {
                    if (verify_code.has_verify_code()) {
                        verify_code.change_verify_code();
                    }
                    me.view.set_pwd_err_text(msg);
                    widgets.reminder.hide();
                }
            });
        },

        on_refresh: function() {
            store.refresh();
        },

        jump_app: function() {
            var accountType;
            if (cookie.get('wx_nickname')) {
                accountType = 'weixin';
            } else if (cookie.get('p_uin').replace(/^[oO0]*/, '') || cookie.get('uin').replace(/^[oO0]*/, '')) {
                accountType = 'qq';
            } else {
                accountType = 'none';
            }

            var ACCOUNT_TEXT_MAP = {
                'qq' : '保存至QQ（'+ (cookie.get('p_uin').replace(/^[oO0]*/, '') || cookie.get('uin').replace(/^[oO0]*/, '')) +'）',
                'weixin' : '保存至微信（' + cookie.get('wx_nickname') + '）',
                'none' : ''
            };

            widgets.confirm({
                tip: '保存成功',
                sub_tip: ACCOUNT_TEXT_MAP[accountType],
                ok_fn: null,
                cancel_fn: function() {
                    location.href = window.location.protocol + '//www.weiyun.com/mobile/jump_app.html';
                },
                btns_text: ['知道了', '去微云查看']
            });
        },

        /**
         * 处理弱网络下请求未发出去造成UI未响应，超过timeout时间后去掉loading态，并出提示。依赖于this._request来判断当然是否有请求
         * @author xixinhuang
         * @data 16/10/22
         * @param timeout
         */
        handle_timeout: function(timeout, is_show_tips, extra) {
            timeout = timeout && DEFAULT_TIMEOUT;
            if(!this._request) {
                return;
            }

            var me = this;
            setTimeout(function() {
                //me._request为true说明请求已超时或请求未发出去
                if(me._request) {
                    me._request = false;

                    //日志上报
                    if(extra) {
                        var console_log = [];
                        console_log.push('handle_timeout');
                        for(var key in extra) {
                            console_log.push('[ ' + key + ' ]' + extra[key]);
                        }
                        logger.write(console_log, 'outlink_v2_error', -1);
                    }

                    if(is_show_tips) {
                        widgets.reminder.error('连接服务器超时');
                        me.retry_loading();
                    }
                }
            }, timeout * 1000 + 500);
        },

        retry_loading: function() {
            setTimeout(function() {
                widgets.reminder.loading('重新加载中...');
            }, 1000);
        },

        on_video: function() {
            $(document.body).append('<div style="position: fixed;top:0;left: 0;height: 300px;background-color: #000000;"><video webkit-playsinline style="position:fixed;top:0;left:0;background-color: #000000" width="100%" height="200px;" class="vplayinside notaplink" x-webkit-airplay controls loop="loop" src="//183.57.53.19/vcloud.tc.qq.com/1033_0d09c2a725dc4fbc937de2f6ba6670fe.f20.mp4?sha=1b177d31db73448fc7d22a554b7e4e9a4211087b&vkey=EEFD8B15339DE26E06CEF1DA903033488861ADD65F35E68546ECB7A76A21B58677C0476335CB67A2"></video></div>');
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('p_skey') || cookie.get('skey'),
                sid = store.get_sid();
            if(uin && skey || sid) {
                return true;
            }

            if(browser.WEIXIN || browser.QQ || browser.QZONE) {
                logger.report('weiyun_share_no_login', {
                    time: (new Date()).toString(),
                    url: location.href,
                    uin: uin || '',
                    skey: skey || '',
                    sid: sid || ''
                });
            }
            return false;
        },

        to_login: function() {
            if (browser.WEIXIN) {
                var max_time = new Date();
                max_time.setMinutes(max_time.getMinutes() + 1);
                var r_url =  location.href.indexOf('#') > -1? location.href.slice(0, location.href.indexOf('#')) : location.href;
                var redirect_url = 'http://web2.cgi.weiyun.com/weixin_oauth20.fcg?g_tk=5381&appid=wxd15b727733345a40&action=save_share&r_url=' + encodeURIComponent(r_url) + '&use_r_url=1';
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd15b727733345a40&redirect_uri=' + encodeURIComponent(redirect_url) + '%26use_r_url%3D1&response_type=code&scope=snsapi_userinfo&state=save_share#wechat_redirect';
            } else {
                var go_url = window.location.href;
                window.location.href = "https://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&pt_wxtest=1&hide_close_icon=1&daid=372&low_login=0&qlogin_auto_login=1&s_url=" + encodeURIComponent(go_url) + "&style=9&hln_css=https%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Fwy-logo-qq@2x.png";
            }
        }
    });

    return mgr;
});/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define.pack("./note",["lib","common","$","./tmpl"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        tmpl    = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    var note = new Module('outlink.note', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }

            //把列表页隐藏
            $('#container').hide();
            $(document.body).addClass('weiyun-note');

            this.$ct = $(tmpl.note({
                title: note.get_name(),
                time: note.get_modify_time(),
                content: extra.note_content
            })).appendTo(document.body);

            // 给所有a标签的href加上U镜检查
            this.UMirrorCheck(this.$ct);

            this.bind_events(note);

            this._rendered = true;

            return this;
        },

        /**
         * U镜检查
         * 替换所有$dom中a标签的href
         * @param $dom
         */
        UMirrorCheck: function ($dom) {
            $dom.find('a').each(function (index) {
                var originURL = $(this).attr('href');
                // 防止嵌套添加
                if (!/^(http:|https:)?\/\/www\.urlshare\.cn\/umirror_url_check/.test(originURL)) {
                    $(this).attr('href', '//www.urlshare.cn/umirror_url_check?plateform=mqq.weiyun&url=' + encodeURIComponent(originURL));
                }
            })
        },

        bind_events: function(note) {
            var me = this;
            this.$ct.on(target_action, '[data-action=save]', function(e) {
                me.trigger('action', 'save', [note], e);
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
            $('#container').show();
            $(document.body).removeClass('weiyun-note');
        }
    });

    return note;

});define.pack("./outlink",["$","lib","common","./store","./ui","./mgr","./file_path.file_path","./ad_link","./app_cfg","zepto_fx","./ui.file_list","./ui.photo.single","./ui.photo","./ui.group"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        user_log = common.get('./user_log'),
        huatuo_speed = common.get('./huatuo_speed'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        widgets = common.get('./ui.widgets'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        file_path = require('./file_path.file_path'),
        ad_link = require('./ad_link'),
        app_cfg = require('./app_cfg'),

        undefined;

    require('zepto_fx');

    var outlink = new Module('outlink', {

        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            var share_type;
            store.init(serv_rsp);
            if(!store.get_share_info()['need_pwd']) {
                share_type = store.get_type();
                if(share_type == 'file_list') {
                    ui = require('./ui.file_list');
                    file_path.render();
                } else if(share_type == 'photo') {
                    var image = store.get_cur_node().get_kid(0);
                    if(store.get_cur_node().get_kid_nodes().length === 1 && image.get_thumb_url()) {
                        ui = require('./ui.photo.single');
                    } else {
                        ui = require('./ui.photo');
                    }

                } else if(share_type == 'group') {
                    ui = require('./ui.group');
                } else {
                    ui = require('./ui');
                }
            } else {
                ui = require('./ui');
            }

            ui.render();
            ad_link.render();

            mgr.init({
                file_path: file_path,
                view: ui
            });

            if(!serv_rsp.need_pwd) {
                this.set_share();
            }

            this.speed_time_report();
            $('#_avator').css('backgroundImage', 'url('+$('#_avator').attr('data-src')+')'); //头像也延迟加载
        },

        set_share: function() {
            var me = this,
                share_type = store.get_type(),
                files = store.get_root_node().get_kid_nodes(),
                file = files[0],
                share_url = location.href.indexOf('#') > -1? location.href.slice(0, location.href.indexOf('#')) : location.href,
                share_desc = file.get_name() + '等' + files.length + '个文件',
                share_icon = file.is_image()? file.get_thumb_url(64) :
                            file.is_dir()? constants.HTTP_PROTOCOL + '//imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_folder_share.png'
                            : constants.HTTP_PROTOCOL + '//imgcache.qq.com/vipstyle/nr/box/web/images/weixin-icons/small_ico_' + file.get_type() + '.png',
                share_data = {
                    title: '我用微云分享',
                    desc: share_desc,
                    url: share_url,
                    image: share_icon
                },
                _data = {
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'launch3rdApp',
                        'previewImage'
                    ],
                    hideMenuItems: []
                };
            if(share_type == 'group') {
                share_data = {
                    title: '加入共享组',
                    desc: store.get_share_name() || '',
                    url: share_url,
                    image: constants.HTTP_PROTOCOL + '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/share-join/icon-share-join.png'
                }
            }
            if(browser.QQ || browser.QZONE) {
                app_api.init(function() {
                    // app_api.setShare(share_data);
                    me.bind_pageVisibility_events();
                });
            } else if(browser.WEIXIN) {
                //share域名下加载引入js sdk有冲突问题，必须得通过require引入
                require.async(constants.HTTP_PROTOCOL + '//res.wx.qq.com/open/js/jweixin-1.0.0.js', function (res) {
                    wx = res;
                    app_api.init(_data, function() {
                        app_api.setShare(share_data);
                    });
                });
            }
        },

        bind_pageVisibility_events: function() {
            document.addEventListener("qbrowserVisibilityChange", function(e){
                if(e.hidden){
                    app_cfg.set_visibility(e.hidden);
                }
                //widgets.reminder.ok(typeof e.hidden + ':' + e.hidden + ':' + app_cfg.get_visibility());
            });
        },

        speed_time_report: function() {
            //延时以便获取performance数据
            $(document).ready(function() {
                huatuo_speed.store_point('1483-1-1', 23, window.g_dom_ready_time - (huatuo_speed.base_time || window.g_start_time)); // dom ready
                huatuo_speed.store_point('1483-1-1', 24, new Date() - (huatuo_speed.base_time || window.g_start_time)); //active
                huatuo_speed.report('1483-1-1', true);
            });
        }
    });

    return outlink;
});/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./selection",["lib","./store"],function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        store = require('./store'),
        undefined;

    var cache = [],
        cache_map = {};

    var selection = new Module('outlink.selection', {

        select: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }
            cache_map[file.get_id()] = file;
            cache.push(file);
        },

        unselect: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }
            cache_map[file.get_id()] = undefined;
            $.each(cache, function(i, item) {
                if(item.get_id() === file.get_id()) {
                    cache.splice(i, 1);
                }
            })
        },

        toggle_select: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }

            if(cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = []
            cache_map = {};
        },

        get_selected: function() {
            return cache;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    });

    return selection;
});/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$","./file.FileNode","./file.NoteNode"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./file.FileNode'),
        NoteNode = require('./file.NoteNode'),
        root_node, //文件目录根节点
        cur_node,  //当前目录节点
        node_map = {},

        undefined;

    function parse(data) {
        var list = [];
        var note_list = [];
        if(data.dir_list && data.dir_list.length > 0) {
            list = list.concat(data.dir_list);
        }

        if(data.file_list && data.file_list.length > 0) {
            list = list.concat(data.file_list);
        }

        if(data.note_list && data.note_list.length > 0) {
            note_list = data.note_list;
        }

        var nodes = [];
        if(list.length > 0) {
            $.each(list || [], function(i, item) {
                nodes.push(new FileNode(item));
            });
        }

        if(note_list.length > 0) {
            $.each(note_list, function(i, note) {
                nodes.push(new NoteNode(note));
            });
        }

        return nodes;
    }

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            this.share_info = data;
            root_node = new FileNode({
                dir_name: '微云分享',
                pdir_key: '_',
                dir_key: data['pdir_key'] || 'root'
            });
            cur_node = root_node;
            node_map[cur_node.get_id()] = cur_node;

            if(data) {
                this.format2nodes(data);
            }

            cur_node.set_load_done(true);
            var dir_len = data.dir_list? data.dir_list.length : 0,
                file_len = data.file_list? data.file_list.length : 0,
                note_len = data.note_list? data.note_list.length : 0;

            if((dir_len + file_len + note_len) === 1) {
                this._single_file = true;
            } else {
                this._single_file = false;
            }

            this._inited = true;
        },

        refresh: function() {
            cur_node.remove_all();
            this.load_more(true);
        },

	    get_vip_info: function() {
		    var defer = $.Deferred();

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
			    cmd: 'DiskUserInfoGet',
			    cavil: false,
			    pb_v2: true,
			    header: { appid: 30111 },
			    body: {
				    is_get_weiyun_flag: true
			    }
		    }).done(function(msg, ret, body, header) {
			    if(ret == 0) {
				    defer.resolve(body.weiyun_vip_info ? body.weiyun_vip_info.weiyun_vip : null);
			    } else if(ret == 1031) {   //设置了独立密码的用户
				    defer.resolve(body.weiyun_vip_info ? body.weiyun_vip_info.weiyun_vip : null);
			    } else {
				    defer.reject(null);
			    }
		    }).fail(function() {
			    defer.reject(null);
		    });

		    return defer;
	    },

        load_dir_kid: function(dir_key) {
            if(dir_key === 'root') {
                cur_node = root_node;
            } else {
                cur_node = store.get(dir_key);
            }

            if(!cur_node) {
                return;
            }

            this.abort_load();
            //有子节点说明已加载过
            if(cur_node.get_kid_count()) {
                this.trigger('refresh_done', cur_node.get_kid_nodes(), store);
            } else {
                this.load_more(true);
            }
        },

        load_more: function(is_refresh) {

            if(this._requesting || !is_refresh && cur_node.is_load_done()) {
                return;
            }
            this._requesting = true;

            var me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            this.req = request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareDirList',
                pb_v2: true,
                use_proxy: false,
                body: {
                    dir_key: cur_node.get_id(),
                    get_virtual_dir: false,
                    get_type: 0,
                    start: cur_node.get_kid_nodes().length,
                    count: 50,
                    sort_field: 2,
                    reverse_order: false,
                    get_abstract_url: true
                }
            }).ok(function(msg, body) {
                me._requesting = false;
                var nodes = me.format2nodes(body);
                if(is_refresh) {
                    me.trigger('refresh_done', nodes, store);
                } else {
                    me.trigger('load_done', nodes, store);
                }

            }).fail(function(msg, ret) {
                me._requesting = false;
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        abort_load: function() {
            this._requesting = false;
            this.req && this.req.destroy();
        },

        format2nodes: function(data) {
            var nodes = parse({
                dir_list: data.dir_list,
                file_list: data.file_list,
                note_list: data.note_list
            });

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            cur_node.add_nodes(nodes);
            cur_node.set_load_done(data.finish_flag);
            return nodes;
        },

        set_cur_node: function(node) {
            cur_node = node;
        },

        is_load_done: function() {
            return !!cur_node.is_load_done();
        },

        is_single_file: function() {
            return !!this._single_file;
        },

        get_root_node: function() {
            return root_node;
        },

        get_cur_node: function() {
            return cur_node;
        },

        get: function(file_id) {
            if(typeof file_id == 'string') {
                return node_map[file_id];
            }
            return file_id;

        },

        get_type: function() {
            return this.type = this.type || (this.type = this.share_info.type);
        },

        get_share_info: function() {
            return this.share_info;
        },

        get_share_name: function() {
            return this.share_name = this.share_name || (this.share_name = this.share_info.share_name);
        },

        get_sid: function() {
            return this.share_info['sid'];
        }
    };

    $.extend(store, events);

    return store;
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui.file_list",["lib","$","common","./store","./ListView","./mgr","./selection","./Previewer","./video","./note","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        router = lib.get('./router'),
        store = require('./store'),
        ListView = require('./ListView'),
        mgr = require('./mgr'),
        selection = require('./selection'),
        Previewer = require('./Previewer'),

        video = require('./video'),
        note = require('./note'),

        tmpl = require('./tmpl'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    function toMMSS(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    var ui = new Module('ui.file_list', {

        render: function() {
            router.init('root');
            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });


            this._$ct = $('#container');

            this.list_view = new ListView({
                $ct:$('#file_list'),
                store: store,
                $toolbar: $('#_toolbar'),
                auto_render: true
            });

            mgr.observe(this.list_view);

            var me = this;
            setTimeout(function() {

                $(window).on('scroll', function(e) {
                    window.requestAnimationFrame(function() {
                        if(me.is_reach_bottom()) {
                            store.load_more();
                        }
                       /* if(window.pageYOffset + win_height >= me._$ct.height() && !store.is_load_done()) {
                            $('#_load_more').show();
                        } else {
                            $('#_load_more').hide();
                        }*/
                    });
                })
            }, 100);
        },

        image_preview: function(file) {
            this.previewer = new Previewer(file);
            router.go('preview');
            selection.clear();
            selection.select(file);
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
            //this.get_$ct().hide();
        },

        note_preview: function(file, extra) {
            if(extra.note_article_url) {
                location.href = extra.note_article_url;
                return;
            }

            this.previewer = note.preview(file, extra);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        doc_preview: function(file, extra, success, fail) {
            var me = this;
            require.async('ftn_preview', function(mod) {
                me.previewer = mod.get('./ftn_preview').preview(file, extra, success, fail);
                router.go('preview');
            });
        },

        video_play: function(file, extra) {
            this.previewer = video.play(file, extra);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        back_to_list: function() {
            this.previewer.destroy();
            this.stopListening(this.previewer);
            this.previewer = null;
            selection.clear();
            //this.get_$ct().show();
            //this.get_$banner().show();
        },

        is_reach_bottom: function() {
            if(window.pageYOffset + win_height > this._$ct.height() - 200) {
                return true;
            }

            return false;
        },


        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$file_list: function() {
            return this.$file_list = this.$file_list || (this.$file_list = $('#file_list'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});/**
 * ui模块-共享文件夹
 * @author xixinhuang
 * @date 2016-06-27
 */
define.pack("./ui.group",["lib","$","common","./store","./mgr","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        router = lib.get('./router'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),

        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',

        undefined;

    common.get('./polyfill.rAF');

    var ui = new Module('ui.group', {

        render: function() {
            this._$ct = $('#container');
            this.bind_events();
        },

        bind_events: function() {
            var me = this;
            this.get_$ct().on(target_action, '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(action_name === 'confirm') {
                    location.href = 'http://www.weiyun.com/';
                } else if(action_name === 'cancel') {
                    me.get_$tips().hide();
                }
                me.trigger('action', action_name, e);
            });
        },

        show_tips: function() {
            this.get_$tips().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$tips: function() {
            return this.$tips = this.$tips || (this.$tips = this.get_$ct().find('[data-id=tips]'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui",["lib","$","common","./store","./image_lazy_loader","./Previewer","./ui.file_list","./ui.photo","./mgr","./tmpl"],function(require, exports, module) {
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
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            if(store.get_share_info()['need_pwd']) {
                this.render_secret();
                return;
            }
            this.render_note();

            this.bind_action();

        },

        bind_action: function() {
            var me = this;
            this.get_$ct().on(target_action, '[data-action]', function(e) {
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
                    verify_code = me.get_verify_code_text(),
                    pwd = $inputs.val();

                if(!pwd) {
                    widgets.reminder.error('密码不能为空');
                    return;
                } else if(pwd.length !== 4 && pwd.length !== 6) {
                    widgets.reminder.error('请输入完整密码');
                    return;
                }
                var _data = {
                    pwd: pwd
                };
                if(me.is_need_verify_code()) {
                    _data.verify_code = verify_code;
                }
                if(me.validate()) {
                    me.trigger('action', 'secret_view', _data, e);
                }
            });
            this.get_$verify().on('focus', 'input', function(e) {
                me.clear();
            });
        },

        render_note: function() {
            this.get_$ct().find('[data-id=content] img').addClass('.note-img');
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$pwd: function() {
            return this.$pwd = this.$pwd || (this.$pwd = $('.pw-input'));
        },

        get_$verify: function() {
            return this.$verify = this.$verify || (this.$verify = $('#_verify_code_cnt'));
        },

        clear: function() {
            this.get_$ct().find('[data-id=verify_code_text]').val('');
            this.get_$ct().find('[data-id=tip]').text('');
        },

        set_pwd_err_text: function(text) {
            this.get_$ct().find('[data-id=password-tip]').text(text);
        },

        set_need_verify_code: function() {
            this._need_verify_code = true;
        },

        is_need_verify_code: function() {
            return !!this._need_verify_code;
        },

        get_verify_code_text: function() {
            var val;
            if(!this.is_need_verify_code()) {
                return;
            }
            val = this.get_$verify().find('[data-id=verify_code_text]').val();
            return $.trim(val);
        },

        set_verify_err_text: function(text) {
            if(!this.is_need_verify_code()) {
                return;
            }
            this.get_$verify().addClass('err');
            this.get_$verify().find('[data-id=tip]').text(text);
        },

        validate: function() {
            var code;
            if(!this.is_need_verify_code()) {
                return true;
            }

            code = this.get_verify_code_text();
            if(code.length < 4) {
                this.set_verify_err_text('请输入正确的验证码');
                return false;
            }
            return true;
        }
    });

    return ui;
});/**
 * 图列表ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui.photo",["lib","$","common","./mgr","./store","./image_lazy_loader","./Previewer","./selection","./ListView","./video","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        router = lib.get('./router'),
        image_loader = lib.get('./image_loader'),
        widgets = common.get('./ui.widgets'),
        browser = common.get('./util.browser'),
        mgr = require('./mgr'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        selection = require('./selection'),
        ListView = require('./ListView'),
        video = require('./video'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        move_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'touchmove' : 'touchmove',
        undefined;

    var ui = new Module('ui.photo', {

        render: function() {
            this.render_img_list();
            router.init('root');

            this._$ct = $('#container');

            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });
        },

        toggle_batch: function(action_name) {
            var $img_list = this.get_$ct().find('[data-id=img]'),
                me = this;
            /*$img_list.each(function(i, img) {
                var $img = $(img);
                $img.empty();
                if(!me.batch_operating) {
                    $img.append('<i data-id="check" class="icons icon-blue-checked"></i>');
                    selection.toggle_select($img.attr('id'));
                }
            });*/
            this.get_$img_list().toggleClass('active');
            this.get_$choose_bar().toggleClass('active').find('[data-id=choose]').removeClass('cancel');
            if(!me.batch_operating) {
                me.get_$ct().find('[data-id=bbar_normal]').hide();
                me.get_$ct().find('[data-id=bbar_confirm]').show().find('[data-id=confirm]').attr('data-action', action_name);
            } else {
                me.get_$ct().find('[data-id=bbar_normal]').show();
                me.get_$ct().find('[data-id=bbar_confirm]').hide();
                me.get_$confrim_btn().toggleClass('btn-disable', false);
            }
            me.batch_operating = !me.batch_operating;
            return me.batch_operating;
        },

        render_img_list: function() {
            var me = this;
            image_lazy_loader.init('#container');
            var is_move = false;
            var $ct = this.get_$ct();
            this.get_$confrim_btn().addClass('btn-disable');

            $ct.on(target_action, '[data-id=choose]', function(e) {
                var $target = $(e.target).closest('[data-id=choose]');
                if(!$target.is('.cancel')) {
                    me.choose_all();
                    $target.addClass('cancel');
                } else {
                    me.cancel_choose_all();
                    $target.removeClass('cancel');
                }
            });

            $ct.on(move_action, '[data-id=img]', function(e) {
                is_move = true;
            });
            $ct.on(target_action, '[data-id=img]',  function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }

                var $target = $(e.target).closest('[data-id=img]');
                if(me.batch_operating) {
                    selection.toggle_select($target.attr('id'));
                    $target.toggleClass('choosen');
                    me.get_$confrim_btn().toggleClass('btn-disable', selection.is_empty());
                    var select_cnt = selection.get_selected().length;
                    var total = store.get_cur_node().get_kid_nodes().length;
                    if(select_cnt < total) {
                        me.get_$choose_bar().find('[data-id=choose]').removeClass('cancel');
                    } else {
                        me.get_$choose_bar().find('[data-id=choose]').addClass('cancel');
                    }
                } else {
                    if($target.attr('data-action') === 'open') {
                        mgr.play_video(store.get($target.attr('data-file-id')), true);
                    } else if($target.attr('data-action') === 'preview'){
                        me.preview_img($target.attr('data-src'), $target.attr('id'));
                    }
                }
            });
            //批量操作按钮
            $ct.find('[data-id=bbar_normal],[data-id=bbar_confirm]').on(target_action, '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();

                if(action_name === 'save' && store.is_single_file() && (store.get_cur_node() === store.get_root_node())) {
                    me.trigger('action', 'save', store.get_cur_node().get_kid_nodes());
                    return;
                }
                if(action_name !== 'cancel' && selection.is_empty() && me.batch_operating) {
                    return;
                }
                if(!me.toggle_batch(action_name)) {
                    var selected_items = selection.get_selected();
                    if(action_name !=='cancel' && selected_items.length) {
                        me.trigger('action', action_name, selected_items, e);
                    }
                    //selection.clear();
                    me.cancel_choose_all();
                }
            });
        },

        choose_all: function() {
            selection.clear();
            var $img_list = this.get_$img_list().children();
            $img_list.each(function(i, img) {
                var $img = $(img);
                selection.select($img.attr('id'));
                $img.addClass('choosen');
            });

            this.get_$confrim_btn().removeClass('btn-disable');
        },

        cancel_choose_all: function() {
            var $img_list = this.get_$img_list().children();
            $img_list.each(function(i, img) {
                var $img = $(img);
                $img.removeClass('choosen');
            });
            selection.clear();

            this.get_$confrim_btn().addClass('btn-disable');
        },

        preview_img: function(src, file_id) {
            //this.get_$ct().hide();
            //this.get_$banner().hide();
            selection.clear();
            selection.select(store.get(file_id));
            this.previewer = new Previewer(store.get(file_id));
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        video_play: function(file, extra) {
            this.previewer = video.play(file, extra);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        back_to_list: function() {
            this.previewer.destroy();
            this.stopListening(this.previewer);
            this.previewer = null;
            selection.clear();
            //this.get_$ct().show();
            //this.get_$banner().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        },

        get_$img_list: function() {
            return this.$img_list = this.$img_list || (this.$img_list = $('#photo_list'));
        },

        get_$choose_bar: function() {
            return this.$choose_bar = this.$choose_bar || (this.$choose_bar = $('#choose_bar'));
        }
    });

    return ui;
});/**
 * 图列表ui模块 单图
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui.photo.single",["lib","$","common","./store","./image_lazy_loader","./Previewer","./selection","./tmpl"],function(require, exports, module) {
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
});/**
 * 分享密码的验证码
 * @author xixinhuang
 * @date 2016-06-01
 */
define.pack("./verify_code",["lib","common","$"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        Module = lib.get('./Module'),

        undefined;

    var verify_code = new Module('verify_code', {

        render: function() {
            if(this._rendered) {
                return;
            }

            var $el = this._$el = $('#_verify_code_cnt'),
                me = this;

            $el.on('click', '[data-action=change_verify_code]', function(e) {
                e.preventDefault();
                me.change_verify_code();
            });

            this._rendered = true;
        },

        //显示验证码
        show: function() {
            if(!this._rendered) {
                this.render();
            }
            this._has_verify_code = true;
            this.change_verify_code();
            this._$el.show();
        },

        hide: function() {
            if(!this._rendered) {
                return;
            }
            this._$el.hide();
            this._$el.find('[data-id=verify_code_text]').val('');
            this._has_verify_code = false;
        },
        //换一个验证码
        change_verify_code: function() {
            var url;
            if(!this.has_verify_code()) {
                return;
            }
            url = constants.BASE_VERIFY_CODE_URL + Math.random();
            this._$el.find('[data-id=code_img]').css('background-image', 'url('+url + ')');
        },
        /**
         * 是否有验证码，当验证码显示时有，隐藏当作没
         * @returns {boolean}
         */
        has_verify_code: function() {
            return !!this._has_verify_code;
        }
    });

    return verify_code;
});/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define.pack("./video",["lib","common","$","./tmpl"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        tmpl    = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    function toMMSS(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    var video = new Module('outlink.video', {

        play: function(file, extra) {
            if(this._rendered) {
                return;
            }

            var me = this;
            var time = file.get_duration() / 1000;
            var minutes_3 = 3*60;
            if(time > minutes_3) {
                time = minutes_3;
            }
            this.$ct = $(tmpl.video({
                title: file.get_name(),
                file_size: file.get_size(),
                time: toMMSS(time),
                poster: file.get_video_thumb(1024),
                video_src: extra.video_src
            })).appendTo(document.body);

            this.bind_events(file);
            this._rendered = true;

            return this;
        },

        bind_events: function(file) {
            var me = this;
            this.$ct.on(target_action, '[data-action=save]', function(e) {
                me.trigger('action', 'save', [file], e);
            }).find( '[data-action=close]').on(target_action, function(e) {
                me.trigger('exit');
            });

            var is_play_start = false;

            var $video_elem = this.$ct.find('[data-id=video_elem]');

            $video_elem.css('maxHeight', $(window).height() - 180);
            this.$ct.show();
            $video_elem.on('play', function(e) {
                is_play_start = true;
            }).on('error', function(e) {
                if(browser.android && is_play_start || browser.IOS) {
                    //widgets.reminder.error('播放失败，请重试。');
                    logger.report('weiyun_video', {
                        file_id: file.get_id(),
                        file_name: file.get_name(),
                        msg: 'error'
                    });
                }
            }).on('stalled', function(e) {
                if(browser.android && is_play_start || browser.IOS) {
                    //widgets.reminder.error('视频加载失败，请重试。');
                    logger.report('weiyun_video', {
                        file_id: file.get_id(),
                        file_name: file.get_name(),
                        msg: 'stalled'
                    });
                }
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
        }
    });

    return video;

});
//tmpl file list:
//outlink_v2/src/file_path/file_path.tmpl.html
//outlink_v2/src/outlink.tmpl.html
//outlink_v2/src/previewer.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'file_path': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <ul class="wy-dir-crumbs">\r\n\
        <!-- 点击时添加 wy-hl-dir class -->');

            var $ = require('$');
            var lib = require('lib');
            var text = lib.get('./text');
            var len = data.length;
            $.each(data, function(i, dir){
        __p.push('            <li class="wy-dir ');
if(i== len-1) { __p.push(' wy-dir-current ');
 } __p.push('" data-key="');
_p(dir.get_id());
__p.push('">');
_p(text.text(dir.get_name()));
__p.push('</li>');

            });
        __p.push('    </ul>');

}
return __p.join("");
},

'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$');
        var lib = require('lib');
        var text = lib.get('./text');
        var prettysize = lib.get('./prettysize');
        var list = data.list;

        $.each(list, function(i, file) {
            var thumb_url = file.get_thumb_url();
            var file_type = file.get_type();
            var is_dir = file.is_dir();
            var file_size = file.get_size();
            var id = file.get_id();
            var file_name = text.text(file.get_name());
    __p.push('\r\n\
        <li data-action="open" data-id="item" data-file-id="');
_p(id);
__p.push('" id="item_');
_p(id);
__p.push('" class="wy-file-item">\r\n\
            <!-- icons icons-filetype是公共class，\r\n\
                 icon-doc 文档\r\n\
                 icon-ppt 演示文件\r\n\
                 icon-folder 文件夹 -->');
 if(thumb_url) { __p.push('            <i class="icons-filetype icon-');
_p(file_type);
__p.push('" data-src="');
_p(thumb_url);
__p.push('"></i>');
 } else { __p.push('            <i class="icons-filetype icon-');
_p(file_type);
__p.push('"></i>');
 } __p.push('            <div class="file-describe bBor">\r\n\
                <h3 class="file-name">');
_p(file_name);
__p.push('</h3>\r\n\
                <span class="file-info">');

                        if(!is_dir) {
                    __p.push('                            <span data-action="open" class="file-size">');
_p(prettysize(file_size));
__p.push('</span>');

                        }
                    __p.push('                </span>\r\n\
            </div>');
 if(is_dir) { __p.push('            <i class="icon-grey-rarr"></i>');
 } __p.push('        </li>');

        });
    __p.push('');

}
return __p.join("");
},

'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="wy-blank-wrap">\r\n\
        <div class="wy-blank">\r\n\
            <i class="wy-gray-logo"></i>\r\n\
            <p>文件夹是空的</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_fail" class="wy-reload-wrap">\r\n\
        <a href="#" class="reload-btn" title="重新加载">\r\n\
            <div class="reload-btn-box">\r\n\
                <div class="reload-btn-wrap">\r\n\
                    <i class="icon icon-reload"></i>\r\n\
                    <p class="reload-txt">');
_p(data.msg);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </a>\r\n\
    </div>');

}
return __p.join("");
},

'video': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib         = require('lib');
    var text        = lib.get('./text');
    var prettysize  = lib.get('./prettysize');
    __p.push('    <div class="wy-previewer-wrapper" style="display: none;">\r\n\
        <!-- 视频名称，点 .wy-previewer-title:after 关闭视频 -->\r\n\
        <h1 class="wy-previewer-title">');
_p(text.text(data.title));
__p.push('</h1>\r\n\
        <div class="wy-video-wrap">\r\n\
            <!--  视频内容，以下地址为测试用 -->\r\n\
            <video data-id="video_elem" webkit-playsinline x-webkit-airplay controls poster="');
_p(data.poster);
__p.push('" src="');
_p(data.video_src);
__p.push('" class="wy-video">\r\n\
                你的浏览器不支持视频播放，请保存到微云后查看。\r\n\
            </video>\r\n\
        </div>\r\n\
\r\n\
        <!-- 视频描述 -->\r\n\
        <div class="wy-previewer-desc">\r\n\
            <div class="file-info">\r\n\
                <span class="info file-size">');
_p(prettysize(data.file_size));
__p.push('</span>\r\n\
                <time class="info file-duration">');
_p(data.time);
__p.push('</time>\r\n\
            </div>\r\n\
            <p class="reminder">保存到微云即可查看完整版</p>\r\n\
        </div>\r\n\
\r\n\
        <!-- image preveiw nav-->\r\n\
        <footer class="wy-preview-controller">\r\n\
            <button data-action="save" class="btn-item" role="button">保存到微云</button>\r\n\
        </footer>\r\n\
        <!-- end image preview nav -->\r\n\
    </div>');

}
return __p.join("");
},

'note': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var lib         = require('lib');
    var text        = lib.get('./text');
    var dateformat  = lib.get('./dateformat');
    __p.push('    <div id="note_container">\r\n\
        <section class="wy-notes-wrapper">\r\n\
            <header class="note-title-wrapper">\r\n\
                <h2 class="note-title">');
_p(text.text(data.title));
__p.push('</h2>\r\n\
                <time class="note-time">');
_p(dateformat(data.time, 'yyyy-mm-dd HH:MM:ss'));
__p.push('</time>\r\n\
            </header>\r\n\
            <article data-id="content" class="note-body">\r\n\
                <div class="note-content"><b>');
_p(data.content);
__p.push('</b><br></div>\r\n\
            </article>\r\n\
        </section>\r\n\
        <div class="wy-file-controller g-bottom-bar">\r\n\
            <button data-action="save" class="btn" role="button">保存到微云</button>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'ad_h5': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-id="ad_container" class="wy-ad" style="">\r\n\
        <i data-id="ad_close" class="icon icon-close"></i>\r\n\
    </div>');

}
return __p.join("");
},

'previewer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wy-img-previewer-wrapper" style="opacity: 0">\r\n\
        <nav data-id="page_text" data-id="back" class="wy-back-nav" style="');
if(data.one_img) {__p.push('display:none;');
}__p.push('">');
_p(data.page_text);
__p.push('</nav>\r\n\
        <div class="wy-hor-img-bg">\r\n\
            <ul data-id="img_list" class="wy-img-preview-list">\r\n\
            </ul>\r\n\
        </div>\r\n\
        <footer data-id="bbar" class="wy-preview-controller verticle-wy-preview-controller">');

                var action_name = window.mqq ? 'mobile_save' : 'view_raw',
                    action_text = window.mqq ? '保存到手机' : '查看原图';

                var store = require('./store');
            __p.push('            <button data-action="');
_p(action_name);
__p.push('" class="btn-item" role="button">');
_p(action_text);
__p.push('<span data-id="file_size" class="file-size"></span></button>\r\n\
            <button data-action="save" class="btn-item" role="button">保存到微云</button>\r\n\
        </footer>\r\n\
    </div>');

return __p.join("");
},

'previewer_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$'),
            width = $(window).width();
    __p.push('    ');
for(var i=0, len=data.total; i<len;i++) { __p.push('        <li class="wy-img-item" style="width:');
_p(width);
__p.push('px">\r\n\
            <i id="previewer_item_');
_p(i);
__p.push('" class="icons icons-reminder icon-reminder-loading" style=""></i>');
 if(i == len-1) { __p.push('        </li>');
}__p.push('    ');
}__p.push('');

return __p.join("");
}
};
return tmpl;
});
