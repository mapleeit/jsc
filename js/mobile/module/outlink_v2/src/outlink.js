define(function(require, exports, module){
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
});