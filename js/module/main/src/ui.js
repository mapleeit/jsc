/**
 * Main UI
 * @author jameszuo
 * @date 13-3-21
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console').namespace('main/ui'),
        routers = lib.get('./routers'),
//        cur_url = lib.get('./url_parser').get_cur_url(),

        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        aid = common.get('./configs.aid'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        scroll_bar = common.get('./ui.scroll_bar'),

        tmpl = require('./tmpl'),
        Search_box = require('./Search_box'),
        download_guide = require('./download_guide'),
        first_guide = require('./first_guide'),
        qzone_vip = require('./qzone_vip'),
        capacity_reduce = require('./capacity_reduce.capacity_reduce'),

        $win = $(window),

        sync_size_queue = [],
        scroller,

        uiv = constants.UI_VER,
        is_visible = false,
        main, access_check,

        inited,

        undefined;

    var ui = new Module('main_ui', {

        render: function () {

            main = require('./main');
            access_check = require('./access_check');

            this._init_ui();

            this._render_user_info();

            this._init_log();

            this._render_ad_link();

            this._adjust_copyright(); //调整版权声明位置
            this.listenTo(global_event, 'window_resize', this._adjust_copyright);
        },

        _init_ui: function () {
            var me = this,
                body_class = constants.IS_APPBOX ? 'app-appbox' : 'web-app',
                $ui_root;

            if (constants.IS_PHP_OUTPUT && ($ui_root = $('#_main_ui_root')) && $ui_root[0]) {
                me._$ui_root = $ui_root;
                me._init_ui_on_user_done();
            }
            else {
                $ui_root = me._$ui_root = $(tmpl.root());
                $(document.body).addClass(body_class).append($ui_root);

                // 暂时隐藏头部，appbox 要等登录后才显示头部tab
                me._toggle_base_header(false);
                me._toggle_base_body(false);
                me.sync_size();

                // query_user 完成后才显示UI
                if (query_user.get_cached_user()) {
                    me._init_ui_on_user_done();
                } else {
                    me.listenTo(query_user, 'done', function (msg, ret) {
                        // 加载成功或返回非1024、1030的错误时，才显示UI
                        if (!ret_msgs.is_sess_timeout(ret) && !ret_msgs.is_indep_invalid(ret)) {
                            me._init_ui_on_user_done();
                        }
                    });
                    me.listenTo(query_user, 'load', function () {
                        this.stopListening(query_user, 'load done');
                        this._init_ui_on_user_done();
                    });
                }
            }

            // for 读屏软件 - james
            if (scr_reader_mode.is_enable()) {
                this._init_aria_content_tip();
            }

            // 同步节点高度
            me._render_resizing();

            me.listenTo(main, 'activate_sub_module', function () {
                me._hide_loading();
                me.sync_size();
            });

            me
                .listenTo(access_check, 'qq_login_ui_show', function () {
                    if (me.is_visible()) {
                        widgets.mask.show('qq_login', null, true);
                    }
                })
                .listenTo(access_check, 'qq_login_ui_hide', function () {
                    widgets.mask.hide('qq_login');
                });
        },

        _init_ui_on_user_done: function () {
            if (inited)
                return;

            is_visible = true;

            // 初始化导航
            this._render_nav();

            this._toggle_base_header(true);
            this._toggle_base_body(true);

            // 渲染搜索框
            this._render_search_box();

            // 渲染旧相册引导
            //this._render_photo_guide();

            // 渲染下载引导提示
            download_guide.render();

            //旧版屏蔽新手引导
            //first_guide.render();
            qzone_vip.render();

            // 缩容公告
            // capacity_reduce.render();

            // 初始分剪贴板内容拉取
            this._render_clipboard_plugin();

	        var user = query_user.get_cached_user();
            if(user && user.is_weixin_user &&  !user.is_weixin_user()) {
                //启动通知提醒
                this._render_notification();
            }

            // 更新body大小
            this.sync_size();
            inited = true;
        },

        _render_photo_guide: function () {
            var user = query_user.get_cached_user();
            if (user) {
                require.async('photo_guide', function (mod) {
                    mod.get('./photo_guide').render();
                });
            }
        },

        _render_clipboard_plugin: function() {
            var clipboard_plugin = require('./clipboard_plugin'),
                $clip_num = this._get_$nav().find('[data-id=clip-num]');
            clipboard_plugin.init($clip_num);
        },

        // 显示用户信息
        _render_user_info: function () {
            require('./user_info').render();

            this._render_space_info();
        },

        // 显示空间信息
        _render_space_info: function () {
            // 初始化web空间信息
            require('./space_info.space_info').render();
        },

        //通知提醒
        _render_notification: function() {
            require.async('notification', function(mod) {
                mod.get('./notification')();
            });
        },

        _adjust_copyright: function() {
            var nav_distance = $('#_main_nav_split').height(),
                copyright = $('.aside-ft');
            if(nav_distance < 50) {
                copyright.css('display', 'none');
            } else {
                copyright.css('display', 'block');
            }
        },

        // OZ上报
        _init_log: function () {
            $('#_main_client_down').on('click', function () {
                user_log('HEADER_USER_FACE_DOWNLOAD_CLIENT');
            });
            $('#_main_feedback').on('click', function () {
                user_log('HEADER_USER_FACE_FEEDBACK');
            });
        },

        _toggle_base_header: function (flag) {
            this.get_$header_banner().css('display', flag ? '' : 'none');
            this.get_$bars().css('display', flag ? '' : 'none');
        },

        _toggle_base_body: function (flag) {
            //this.get_$body_box().toggle(!!flag);
            this.get_$main_content().css('display', flag ? '' : 'none');
        },

        get_$header_banner: function () {
            return $('#_main_header_banner');
        },

        get_$search_box: function () {
            return this._get_$fixed_header().find('.header-search');
        },

        get_$bar1: function () {
            return $('#_main_bar1');
        },

        get_$bar2: function () {
            return $('#_main_bar2');
        },

        get_$bars: function () {
            return this.get_$bar1().add(this.get_$bar2())
        },

        get_$top: function () {
            return $('#_main_top');
        },

        get_$share_head: function () {
            return $('#_main_share_header');
        },
        get_$station_head: function() {
            return $('#_main_station_header');
        },

        get_$body_box: function () {
            return $('#_main_box');
        },

        get_$main_content: function () {
            return $('#_main_content');
        },

        get_$ui_root: function () {
            return this._$ui_root;
        },

        is_visible: function () {
            return is_visible;
        },

        get_fixed_header_height: function () {
            return this._get_$fixed_header().height();
        },

        /**
         * 获取内容区域的尺寸
         */
        get_main_area_size: function () {
            var win_w = $win.width(),
                win_h = $win.height(),
                w = win_w - this._get_$nav().width(),
                h = win_h - this.get_fixed_header_height() - 2;
            return [w, h];
        },

        update_module_ui: function (cur_mod) {
            var mod_cls_name = 'module-' + cur_mod.module_name,
                root = this.get_$ui_root()[0];
            root.className = root.className.replace(/\s*module\-\w+\s*/g, ' ').replace(/\s+/, ' ') + ' ' + mod_cls_name;
        },

        _get_$fixed_header: function () {
            return this._$fixed_header || (this._$fixed_header = $('#_main_fixed_header'));
        },

        _get_$nav: function () {
            return this._$nav || (this._$nav = $('#_main_nav'));
        },

        get_$aside_box: function(){
            return this._$aside_box || (this._$aside_box = $('#_main_nav_aside_box'));
        },
        get_$aside_wrap: function(){
            return this._$aside_wrap || (this._$aside_wrap = $('#_main_nav_aside_wrap'));
        },
        get_$nav_split: function(){
            return this._$nav_split || (this._$nav_split = $('#_main_nav_split'));
        },
        get_$aside_scroll: function(){
            return this._scroll_bar || ( this._scroll_bar = new scroll_bar({
                $parent: this.get_$aside_box()
            }));
        },

        //获取上传按钮对象
        get_$uploader: function () {
            return this._get_$nav().find('[data-action="upload"]');
        },
        // 初始化导航栏
        _render_nav: function () {
            var $nav = this._get_$nav();

            var me = this;

	        var user = query_user.get_cached_user();
            if(user && user.is_weixin_user && user.is_weixin_user()) {
                $nav.find('[data-mod=note]').hide();
            }

            $nav.show()
                .on('click', 'li[data-mod]', function (e) {
                    e.preventDefault();

                    var $el = $(this),
                        mod_alias = $el.attr('data-mod');

                    routers.go({ m: mod_alias });
                    // 如果模块已激活，点击模块入口时触发
                    if (main.is_mod_loaded(mod_alias)) {
                        global_event.trigger(mod_alias + '_reenter');
                    }
                })
                .on('click', 'a[data-refresh]', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $el = $(this),
                        mod_alias = $el.attr('data-refresh');
                    if (mod_alias) {//触发刷新事件 譬如 recent_refresh
                        var virtual_mod = main.get_virtual_modules_map()[mod_alias];
                        if (virtual_mod) {//来自映射的模块，需要指定真正对应的的刷新操作
                            mod_alias = virtual_mod.point;
                        }
                        global_event.trigger(mod_alias + '_refresh');
                    }
                })
                .on('click', 'li[data-op]', function (e) {
                    var $el = $(this),
                        op = $el.attr('data-op');
                    user_log(op);
                });

            // 更新导航栏item的选中样式
            var current_nav = function (mod_alias) {
                //   var cur_cls = uiv === 'APPBOX' ? 'nav-current' : 'current';
                var cur_cls = 'nav-current';
                $nav.find('[data-mod]').removeClass(cur_cls).filter('[data-mod="' + mod_alias + '"]').addClass(cur_cls);
            };

            // 激活子模块时，同步更新导航栏item的选中样式
            me.listenTo(main, 'activate_sub_module', function (mod_alias, virtual_mod_alias) {
                current_nav(virtual_mod_alias || mod_alias);
            });

            // 更新导航栏item的选中样式
            var cur_mod_alias = main.get_cur_nav_mod_alias();
            if (cur_mod_alias) {
                current_nav(cur_mod_alias);
            }
        },

        // 显示、隐藏 loading
        _hide_loading: function () {
            $('#loading-text').remove();
            $('#loading-icon').remove();
            $('html').css('backgroundColor', '');
        },

        //头部广告链接
        _render_ad_link: function () {
            require('./ad_link').render();
        },

        _render_search_box: function () {
            var $el = this.get_$search_box();
            $el.show();
            if (!this.search_box) {
                this.search_box = new Search_box({
                    $el: $el.find('.beautiful-input'),
                    input_selector: 'input'
                });
            }
        },

        /**
         * 自动同步节点高度
         * @private
         * @author james
         */
        _render_resizing: function () {
            var me = this,
                $nav = me._get_$nav();

            // 主体内容区
            var $content = me.get_$main_content();
            sync_size_queue.push({
                $el: $content,
                fn: function (win_width, win_height) {
                    var pos_top = $content.position().top,
                        margin_top = parseInt($content.css('marginTop')) || 0,
                        padding_top = parseInt($content.css('paddingTop')) || 0,
                        new_height = win_height - pos_top - margin_top - padding_top - 13;

                    $content.height(new_height);
                }
            });

            // 左侧导航栏
            if (uiv !== 'APPBOX') {  // appbox 窗口高度是固定的，不需要动态调整高度
                sync_size_queue.push({
                    $el: $nav,
                    fn: function (win_width, win_height) {
                        var $nav_height = win_height - $nav.position().top - 2;
                        $nav.height($nav_height);

                        var $box_height = $nav_height - (me.get_$aside_box().offset().top - $nav.offset().top);
                        me.get_$aside_box().height($box_height);
                        me.get_$nav_split().height(0);
                        var wrap_height = me.get_$aside_wrap().height();
                        if( wrap_height < $box_height ){
                            me.get_$nav_split().height($box_height - wrap_height);
                        }
                        me.get_$aside_scroll().sync();
                    }
                });
            }

            // IE6最小宽度
            if (!constants.IS_APPBOX && $.browser.msie && $.browser.version < 7) {
                var root_min_width = 960,
                    $root = this.get_$ui_root();
                sync_size_queue.push({
                    $el: $root,
                    fn: function (win_width) {
                        if (win_width < root_min_width) {
                            $root.width(root_min_width);
                        } else {
                            $root.css('width', '');
                        }
                        $root.repaint();
                    }
                });
            }

            me.sync_size();
            me.listenTo(global_event, 'window_resize_real_time', function (win_width, win_height) {
                me.sync_size(win_width, win_height);

                scroller.trigger_resized();
            });
        },

        /**
         * 同步size
         * @param {Number} [win_width]
         * @param {Number} [win_height]
         * @private
         */
        sync_size: function (win_width, win_height) {
            if (typeof win_width !== 'number') {
                win_width = $win.width();
            }
            if (typeof win_height !== 'number') {
                win_height = $win.height();
            }

            var me = this;
            for (var i = 0, l = sync_size_queue.length; i < l; i++) {
                sync_size_queue[i].fn.call(me, win_width, win_height);
            }

            var area_size = this.get_main_area_size();
            this.trigger('area_resize', area_size[0], area_size[1]);
            this.get_scroller().trigger_resized();
        },

        get_scroller: function () {
            if (!scroller) {
                var Scroller = common.get('./ui.scroller');
                scroller = new Scroller(this.get_$body_box());
            }
            return scroller;
        },

        _init_aria_content_tip: function () {
            var me = this;
            var $tip_for_keys = $('<div tabindex="0" style="position:fixed;_position:absolute;top:0;">快捷键说明：按下Alt加X键聚焦到内容区域开始位置。</div>');
            var $tip_for_aria = $('<div tabindex="0" style="position:fixed;_position:absolute;top:0;">内容区域</div>').on('focusin', function () {
                $(this).text(me.get_$body_box().children(':visible[data-label-for-aria]').attr('data-label-for-aria') || '内容区域');
            });

            // 按下快捷键聚焦到该提示上 - james
            $(document).on('keydown.tip_for_aria', function (e) {
                if (e.altKey && e.which === 88) { // 88 = X
                    $tip_for_aria.blur().focus();
                }
            });

            me._get_$nav().before($tip_for_keys).after($tip_for_aria);
        }
    });

    if (constants.IS_WEBKIT_APPBOX) {
        ui.once('render', function () {
            setTimeout(function () {
                require.async('download_route', function (mod) {
                    mod.get('./download_route');
                });
            }, 200);
        });
    }
    return ui;
});