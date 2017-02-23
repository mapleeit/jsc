/**
 * web上传控件安装逻辑
 * 注：
 *   IE分两种模式安装，进入页面时先自动安装：
 *      1） 在线自动安装
 *      2） 手动下载安装
 *   chrome firefox 只有下载安装
 *   其余的不管 且 只能在windows系统中才能安装
 *   在线升级: 通过版本号区分，common/utill/plugin_detect.js中有接口获取版本号(done 2013-08-22)
 *
 * @autor hibincheng
 * @date 2013-07-29
 */
(function(){

    document.domain = 'weiyun.com';

    seajs.use(['$', 'common', 'http://imgcache.qq.com/club/weiyun/js/plugin_install/tips_config.js'], function($, common, tips_config){

            var user_log = common.get('./user_log'),
                plugin_detect = common.get('./util.plugin_detect'),
                //操作系统类型
                OS_TYPE = {
                    WINDOWS: 'Windows',
                    UNIX: 'Unix',
                    MAC: 'Mac'
                },
                //跳转过来的类型
                FROM_TYPE = {
                    NARMAL: 'narmal',//普通跳转
                    JISU: 'jisu',//极速上传时，跳转过来进行安装
                    AD: 'ad'//tip广告等第三方入口
                },
                //安装模式
                INSTALL_MOD = {
                    AUTO: 'auto',//自动
                    MANUAL: 'manual'//手动
                },
                //控件url
                URL_CONFIG = {
                    IE_ONLINE: 'http://imgcache.qq.com/club/qqdisk/web/data/TXWYFTNActiveX.cab',
                    IE_DOWNLOAD: 'http://imgcache.qq.com/club/qqdisk/web/data/TencentWeiYunActiveXInstall.exe',
                    OTHER_DOWNLOAD: 'http://imgcache.qq.com/club/qqdisk/web/data/WeiYunWebKitPlugin.exe'
                },

                START_INSTALL_FLAG = 'install',//标识点击安装控件刷新了页面
                RE_INSTALL_FLAG = 're_install',//标识点击“重新在线安装”

                is_ie = $.browser.msie || window.ActiveXObject !== undefined, //兼容IE11//$.browser.msie,
                is_chrome = $.browser.chrome,
                is_firefox = $.browser.mozilla,
                is_download_browser = is_chrome || is_firefox,

                $install_ad = $('#install_ad'),
                $plugin_container = $('#plugin_container'),
                $ie_install_auto = $('#ie_install_auto'),
                $ie_install_manual = $('#ie_install_manual'),
                $other_install = $('#other_install'),
                $auto_step_list = $('#auto_step_list'),
                $manual_step_list = is_ie ? $('#ie_manual_step_list') : $('#other_manual_step_list'),
                $install_success = $('#install_success'),
                $install_fail = $('#install_fail'),
                $install_fail_title = $('#install_fail_title'),
                $reinstall_text = $('#install_fail a[data-action=reinstall]'),

                os,
                from_type,//跳转过来的类型
                GLOBAL_TIMER_DURING = 5*60*1000,//5分钟内安装未完成，则显示安装失败
                global_timer,//全局定时器，用于检测整个安装是否完成了
                ie_loop_detect_timer,//IE轮询检查安装控件是否成功定时器
                other_loop_detect_timer,//chrome or firefox 轮询检查安装控件是否成功定时器
                can_detect = false,//标识可以开始检测控件安装
                installed = false,//安装是否成功

                undefined;

            //IE安装流程
            var ie_install = {
                //初始化
                init: function() {
                    if(!this._detect_has_install()) {
                        $ie_install_auto.show();
                        //this._init_detect();
                        //this.auto_install();
                        this.manual_install();//因自动安装要重启电脑，现改成只有手动安装，等控件修改好了再启用自动安装
                    } else {//已经安装过了，显示安装成功
                        install_success();
                    }
                },
                //切换安装模式,自动or手动
                _switch_mod: function(mod) {
                    this._mod = mod;
                    if(mod === INSTALL_MOD.AUTO) {
                        $ie_install_auto.show();
                        $ie_install_manual.hide();
                    } else {
                        $ie_install_auto.hide();
                        $ie_install_manual.show();
                    }
                },
                //获取下载模式,自动or手动
                get_mod: function() {
                    return this._mod;
                },
                //检测控件是否已经安装
                _detect_has_install: function() {
                    if(plugin_detect.is_newest_version()) { //已安装了最新的控件
                        return true;
                    }
                    return false;
                },
                //开始自动安装
                auto_install: function() {
                    var me = this,
                        plugin_html;

                    me._switch_mod(INSTALL_MOD.AUTO);//自动安装模式
                    plugin_html = '<object classid="clsid:6CE20149-ABE3-462E-A1B4-5B549971AA38" codebase="'+URL_CONFIG.IE_ONLINE+'"></oject>';
                    $plugin_container.children().remove();
                    $(plugin_html)
                        .appendTo($plugin_container)[0]
                        .onreadystatechange = function() {//只能使用onreadystatechange才能监听到事件
                            if(can_detect) {//点击安装后刷新页面才开始检测控件安装
                                me._do_detect();
                            } else {
                                window.name = START_INSTALL_FLAG;//把flag传进去刷新后的页面
                            }
                        }

                    me._loop_detect_install();//一开始就自动检测，以防各类奇怪配置，导致安装步骤不是按引导的来
                    start_global_timer();//开启全局定时

                },
                //初始化检测
                _init_detect: function() {
                    if(window.name === START_INSTALL_FLAG) {// 在线安装，点击“安装”后会刷新一次页面，使用window.name来标识点击安装刷新页面
                        can_detect = true;
                    }
                },

                //检测安装
                _do_detect: function() {

                    if(this._detect_has_install()) {
                        installed = true;
                        install_success();
                    } else {
                        install_fail();
                        window.name = '';
                    }
                },

                //手动下载控件
                manual_install: function() {
                    this._switch_mod(INSTALL_MOD.MANUAL);
                    download_by_src(URL_CONFIG.IE_DOWNLOAD);
                    this._loop_detect_install();
                    start_global_timer();//开启全局定时
                },

                //轮询检测是否安装成功
                _loop_detect_install: function() {
                    var fn = arguments.callee,
                        me = this;
                    if(ie_loop_detect_timer) {
                        clearTimeout(ie_loop_detect_timer);
                    }

                    ie_loop_detect_timer = setTimeout(function() {
                        if(me._detect_has_install()) {
                            clearTimeout(ie_loop_detect_timer);
                            installed = true;
                            install_success();
                        } else {
                            fn.call(me);
                        }
                    }, 3000);
                }
            };

            //chrome or firefox 安装流程
            var other_install = {
                //初始化
                init: function() {
                    if(!this._detect_has_install()) {//未安装，则开始下载安装
                        $other_install.show();
                        download_by_src(URL_CONFIG.OTHER_DOWNLOAD);
                        this._loop_detect_install();
                        start_global_timer();//开启全局定时
                    } else {
                        install_success();
                    }
                },
                //判断是否已经安装过了
                _detect_has_install: function() {
                    if(plugin_detect.is_newest_version()) { //已安装了最新的控件
                        return true;
                    }
                    return false;
                },

                //轮询检查控件是否安装成功
                _loop_detect_install: function() {
                    var fn = arguments.callee,
                        me = this;

                    if(other_loop_detect_timer) {
                        clearTimeout(other_loop_detect_timer);
                    }

                    other_loop_detect_timer = setTimeout(function() {
                        if(me._detect_has_install()) {
                            clearTimeout(other_loop_detect_timer);
                            installed = true;
                            install_success();
                        } else {
                            fn.call(me);
                        }
                    }, 3000);
                }
            };






            //===========================主程序入口========================================================================

            os = get_os();//先判断操作系统类型

            //根据不同跳转参数来开启安装流程
            function start_route() {

                //var from_params = location.search.split('?from=');

                //from_type = from_params.length > 1 && from_params[1].split('&')[0];//标识跳转来源，用于数据统计

                if(os === OS_TYPE.WINDOWS) {//只给windows安装
                    if(!is_ie && !is_download_browser) {//非ie,chrome,firefox 不支持安装
                        $('#unsupport').show().find('#unsupport_text').text('当前浏览器暂不支持安装控件');
                        return;
                    }
                   /* if(from_type === FROM_TYPE.AD && window.name !== START_INSTALL_FLAG) {//第三方入口，先显示提示安装界面
                        if(!is_ie) {//目前非IE还无上传文件夹功能
                            $install_ad.find('[data-id=feature-dir]').hide();
                        }
                        $install_ad.show();
                        $install_ad.on('click', '[data-action=start_download]', function(evt) {
                            evt.preventDefault();
                            $install_ad.hide();
                            main();
                        });
                    } else {*/
                        main();
                   // }
                } else {//非windows系统不支持安装
                    $('#unsupport').show().find('#unsupport_text').text('当前操作系统暂不支持安装控件');
                }
            }

            function main() {
                configure_tips();
                if(is_ie) {//IE在线安装
                    ie_install.init();
                    window.name !== START_INSTALL_FLAG && window.name !== RE_INSTALL_FLAG && user_log('PLUGIN_ONLINE_ENTER');//统计上报 在线安装进入
                } else if(is_download_browser) {//下载安装
                    other_install.init();
                    user_log('PLUGIN_DOWNLOAD_ENTER');//数据上报 下载安装页面-进入
                }

                /********************* 以下是事件绑定 ******************************/
                //安装过程页 点击下载安装
                $('a[data-action=download]').on('click', function(evt) {
                    evt.preventDefault();
                    if(is_ie) {
                        ie_install.manual_install();//手动下载安装
                        user_log('PLUGIN_ONLINE_REINSTALL');//统计上报 在线安装页面-重新下载/安装
                    } else if(is_download_browser) {
                        other_install.init();//下载安装
                        user_log('PLUGIN_DOWNLOAD_REINSTALL');//统计上报 下载安装页面-重新下载/安装
                    }
                });

                //IE下，安装过程页，点击在线安装
                $('#ie_install_manual [data-action=install_auto]').on('click', function(evt) {
                    evt.preventDefault();
                    window.name = RE_INSTALL_FLAG;//标识重新在线安装
                    //ie_install.auto_install();
                    user_log('PLUGIN_DOWNLOAD_REINSTALL');//统计上报 下载安装页面-重新下载/安装
                    //异步，让统计先上报
                    setTimeout(function() {
                        location.href = 'http://www.weiyun.com/plugin_install.html';//刷新==重新安装
                    }, 300);
                });

                //安装失败页，再点击“重新安装”
                $('#install_fail [data-action=reinstall]').on('click', function(evt) {
                    evt.preventDefault();
                    $install_fail.hide();//隐藏失败页
                    if(is_ie && ie_install.get_mod() === INSTALL_MOD.MANUAL) {//IE手动安装失败 -》在线安装
                        window.name = RE_INSTALL_FLAG;//标识重新在线安装
                        //ie_install.auto_install();
                        ie_install.manual_install();//手动下载安装 只有手动安装了 by hibincheng 20130827
                        user_log('PLUGIN_DOWNLOAD_REINSTALL');//统计上报 下载安装页面-重新下载/安装

                        //异步，让统计先上报
                       /* setTimeout(function() {
                            location.href = 'http://www.weiyun.com/plugin_install.html';//刷新==重新安装
                        }, 300);*/
                    } else if(is_ie && ie_install.get_mod() === INSTALL_MOD.AUTO) {//IE自动安装失败 -》手动下载安装
                        ie_install.manual_install();//手动下载安装
                        user_log('PLUGIN_ONLINE_REINSTALL');//统计上报 在线安装页面-重新下载/安装
                    } else if(is_download_browser) { //chrome or firefox
                        other_install.init();
                        user_log('PLUGIN_DOWNLOAD_REINSTALL');//统计上报 下载安装页面-重新下载/安装
                    }
                });
            }

            //根据不同浏览器，配置显示对应的安装引导提示
            function configure_tips() {
                var auto_config,
                    manual_config,
                    html = '',
                    version = parseInt($.browser.version, 10) > 9 ? 9 : parseInt($.browser.version, 10);//IE9以上的使用IE9的引导提示
                if(is_ie) {
                    auto_config = tips_config['ie' + version].auto;
                    manual_config = tips_config['ie' + version].manual;
                } else if(is_chrome) {
                    manual_config = tips_config['chrome'];
                } else if(is_firefox) {
                    manual_config = tips_config['firefox'];
                }

                if(auto_config) {
                    $.each(auto_config, function(i, item) {
                        html += '<li><p class="ui-text">'+item.text+'</p><img class="ui-img" src="'+item.img+'" /></li>'
                    });
                    $(html).appendTo($auto_step_list);
                    html = '';
                }
                if(manual_config) {
                    $.each(manual_config, function(i, item) {
                        html += '<li><p class="ui-text">'+item.text+'</p><img class="ui-img" src="'+item.img+'" /></li>'
                    });
                    $(html).appendTo($manual_step_list);
                }
            }

            start_route();//程序启动



            //===========================================分割线 公用 函数==========================================================


            //全局定时器，用于检查整个安装过程是否成功，默认当开始安装后5分钟内无操作或失败无响应等，都认为安装失败了
            function start_global_timer() {

                if(global_timer) {
                    clearTimeout(global_timer);
                }

                global_timer = setTimeout(function() {
                    if(is_ie && ie_loop_detect_timer) {
                        clearTimeout(ie_loop_detect_timer);
                        install_fail();
                    } else if(is_download_browser && other_loop_detect_timer) {
                        clearTimeout(other_loop_detect_timer);
                        install_fail();
                    }
                }, GLOBAL_TIMER_DURING);
            }


            //控件下载安装
            function download_by_src(url) {
                var plugin_html = '<iframe style="display:none" src="'+url+'"></iframe>';
                $('body').append(plugin_html);
            }

            //安装完成
            function install_success() {
                if(!installed) {//本次不需要安装，用户本身之前就安装过了
                    $install_success.find('.plugin-state-cnt p').text('若您当前还无法使用“极速上传”，请刷新微云的页面或重启浏览器。');
                }
                clearTimeout(global_timer);
                $install_success.show();
                $install_fail.hide();
                $ie_install_auto.hide();
                $ie_install_manual.hide();
                $other_install.hide();
                //统计上报
                if(is_ie && ie_install.get_mod() === INSTALL_MOD.AUTO) {
                    user_log('PLUGIN_ONLINE_SUCCESS');//在线安装页面-成功
                } else {
                    user_log('PLUGIN_DOWNLOAD_SUCCESS');//下载安装页面-成功
                }
            }

            //安装失败
            function install_fail() {
                $install_success.hide();
                $install_fail.show();
                $ie_install_auto.hide();
                $ie_install_manual.hide();
                $other_install.hide();
                if(is_ie && ie_install.get_mod() === INSTALL_MOD.AUTO) {
                    $install_fail_title.text('在线安装出现问题，您可以：');
                    $reinstall_text.text('下载安装');
                } else {
                    $install_fail_title.text('下载安装出现问题，您可以：');
                    $reinstall_text.text('重新安装');
                }
            }

            //获取操作系统
            function get_os() {
                var platform = navigator.platform;
                var isWin = (platform == "Win32") || (platform == "Windows");
                var isMac = (platform == "Mac68K") || (platform == "MacPPC") || (platform == "Macintosh") || (platform == "MacIntel");
                var isUnix = (platform == "X11") && !isWin && !isMac;

                if (isMac)
                    return OS_TYPE.MAC;

                if (isUnix)
                    return OS_TYPE.UNIX;

                return OS_TYPE.WINDOWS;
            }
        });

        //pv/uv
        seajs.use(['http://pingjs.qq.com/tcss.ping.js'], function(){
            if (typeof window.pgvMain === 'function') {
                window.pgvMain("", {
                    tagParamName: 'WYTAG',
                    virtualURL: '/plugin_install.html',
                    virtualDomain: "www.weiyun.com"
                });
            }
        });

})();