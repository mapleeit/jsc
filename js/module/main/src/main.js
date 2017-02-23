/**
 *
 * @author jameszuo
 * @date 13-3-1
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),
        aid = common.get('./configs.aid'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        access_check = require('./access_check'),

        user_log = common.get('./user_log'),

    // url hash 中的模块参数名
        module_hash_key,
        default_module_name,
        default_module_params,
        sub_modules_map,
        virtual_modules_map,//虚拟模块
        async_sub_modules = {},

        cur_mod_alias,  // 当前模块名
        cur_nav_mod_alias,//导航显示的模块名

        exclude_mods, // 要排除掉，不初始化的模块

        undefined;

    var main = new Module('main', {

        ui: require('./ui'),

        render: function (params) {
            params = params || {};
            // 排除的模块
            exclude_mods = params.exclude_mods || {};
        },

        set_default_module: function (mod_name, mod_params) {
            default_module_name = mod_name;
            default_module_params = mod_params;
            return this;
        },

        /**
         * 将hash解析为模块路径，并分发
         * @return {String[]} path
         * @private
         */
        _parse_hash: function (hash) {
            var path = hash && hash.split ? hash.split('.') : [];
            var mod_name = path.shift();
            this.async_render_module(mod_name, {
                path: path
            });
        },

        set_module_hash_key: function (key) {
            module_hash_key = key;
            return this;
        },

        /**
         * 配置异步加载的模块
         * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        set_async_modules_map: function (map) {
            sub_modules_map = map;
            return this;
        },
        /**
         * 配置虚拟模块
         * @param {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        set_virtual_modules_map: function (map) {
            virtual_modules_map = map;
        },
        /**
         * 配置虚拟模块
         * @return {Object} map<模块URL|模块别名, 模块中主Module的相对路径>
         */
        get_virtual_modules_map: function () {
            return virtual_modules_map;
        },
        _get_history: function () {
            return this._history || (this._history = []);
        },
        /**
         * 添加历史访问信息
         * @param mode_name
         */
        add_history: function (mode_name) {
            this._get_history().push(mode_name);
        },
        /**
         *  获取历史访问信息
         * @returns {[{String}]}
         */
        get_history: function () {
            return this._get_history();
        },
        /**
         * 异步载入模块
         * @param {String} _mod_alias 模块URL|模块别名
         * @param {*} [params]  传递给目标模块的参数
         */
        async_render_module: function (_mod_alias, params) {
            var mod_alias;
            this.set_cur_nav_mod_alias(_mod_alias);
            if (_mod_alias in sub_modules_map) {//直接子模块
                mod_alias = _mod_alias;
            } else if (_mod_alias in virtual_modules_map) {//映射子模块
                mod_alias = virtual_modules_map[_mod_alias].point;
            } else {//默认模块
                this.set_cur_nav_mod_alias(mod_alias = default_module_name);
            }
            cur_mod_alias = mod_alias;
            var me = this;

            // 如果已存在，则激活
            if (async_sub_modules.hasOwnProperty(mod_alias)) {

                var mod = async_sub_modules[mod_alias];
                me.activate_sub_module(mod, params);
                me.trigger('activate_sub_module', mod_alias, _mod_alias);
                if (_mod_alias in virtual_modules_map) {//来自虚拟子模块
                    virtual_modules_map[_mod_alias].after.call();
                }
                me.add_history(_mod_alias);
            }

            // 不存在，异步加载，然后激活
            else {

                require.async(mod_alias, function (module_dir) {
                    cur_mod_alias = mod_alias;

                    var main_mod = sub_modules_map[mod_alias];

                    if (!module_dir || !module_dir.get) {  // 模块加载失败（加载失败时 module_dir 可能指向其他模块，这是seajs的一个bug）
                        console.error('模块加载失败：', mod_alias, main_mod);
                        return;
                    }

                    var mod = module_dir.get(main_mod);

                    async_sub_modules[mod_alias] = mod;

                    me.activate_sub_module(mod, params, mod_alias);
                    me.trigger('activate_sub_module', mod_alias, _mod_alias);
                    if (_mod_alias in virtual_modules_map) {//来自虚拟子模块
                        virtual_modules_map[_mod_alias].after.call();
                    }

                    me.add_history(_mod_alias);
                });
            }
        },

        /**
         * 激活指定子模块，并隐藏其他子模块
         * @param {Module} cur_mod 要激活的子模块
         * @param {*} params 传递给目标模块的参数
         * @param {String} mod_alias
         */
        activate_sub_module: function (cur_mod, params, mod_alias) {

            for (var mod_alias in async_sub_modules) {
                var async_sub_mod = async_sub_modules[mod_alias];
                if (async_sub_mod !== cur_mod) {
                    async_sub_mod.deactivate();
                    this.stopListening(async_sub_mod, 'resize', this.buffer_sync_size);
                }
            }

            this.ui.update_module_ui(cur_mod);

            cur_mod.render();
            cur_mod.activate(params);
            this.listenTo(cur_mod, 'resize', this.buffer_sync_size);
        },

        sync_size_timer: null,
        buffer_sync_size: function () {
            var me = this, timer = me.sync_size_timer;
            if (timer) {
                clearTimeout(timer);
            }
            me.sync_size_timer = setTimeout(function () {
                me.ui.sync_size();
            }, 0);
        },

        /**
         * 获取当前激活的模块别名
         * @return {String}
         */
        get_cur_mod_alias: function () {
            return cur_mod_alias;
        },
        /**
         * 获取导航显示的模块名称
         * @returns {String}
         */
        get_cur_nav_mod_alias: function () {
            return cur_nav_mod_alias;
        },
        /**
         * 设置导航显示的模块名称
         * @param {String} mod_alias
         */
        set_cur_nav_mod_alias: function (mod_alias) {
            cur_nav_mod_alias = mod_alias;
        },
        /**
         * 判断模块是否已加载并且已激活
         * @param {String} mod_alias 模块别名
         */
        is_mod_loaded: function (mod_alias) {
            var mod = async_sub_modules[mod_alias]
            return !!mod && mod.is_activated();
        },

        /**
         * 切换模块
         * @param {String} mod_alias
         * @param {Object} [params]
         * @param {boolean} [force] 强制切换模块
         */
        switch_mod: function (mod_alias, params, force) {
            if (mod_alias !== cur_mod_alias || force)
                routers.go($.extend({m: mod_alias}, params));
        },
        /**
         * 获取反馈的url
         * @returns {String}
         */
        get_feedback_url: function () {
            var ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
            return urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
        },

        // 加载upload
        async_render_upload: function () {
            var def = $.Deferred();
            require.async('upload', function (upload_mod) {
                var upload_route = upload_mod.get('./upload_route');
                upload_route.render();
                def.resolve(upload_route.type);
            });

            // 不支持极速上传的浏览器，web安装控件提示（不支持mac、safari、firefox和64位的IE）
            if (!constants.IS_APPBOX && constants.IS_WINDOWS && window.navigator.platform == 'Win32' && !$.browser.mozilla && !(window.FileReader && window.Worker)) {
                setTimeout(function () {
                    query_user.on_ready(function () {
                        require.async('install_upload_plugin', function (mod) {
                            var install;
                            // 初始化控件安装模块
                            mod && (install = mod.get('./install')) && install.tips();
                        });
                    });
                }, 1000);
            }

            return def;
        },

        //appbox上报用户环境
        report_user_env: function (upload_type) {
            var me = this;
            //操作系统、QQ版本、内核类型（浏览器类型）、上传组件类型（表单、flash、控件）
            if (constants.IS_APPBOX) {
                var rpt_data = {
                    "extInt1": 0, //QQ版本 navigator.userAgent
                    "extInt2": constants.IS_WEBKIT_APPBOX ? 1 : 0, //内核类型,1:webkit,0:ie
                    "extString1": constants.OS_NAME,//操作系统
                    "extString2": upload_type //上传组件类型
                };
                if (window.external.GetVersion) { //QQ1.98及以后直接可以获取协议号，协议号查版本号：http://qqver.server.com/
                    var qq_ver = window.external.GetVersion();
                    rpt_data.extInt1 = parseInt(qq_ver, 10);
                    user_log('APPBOX_USER_ENV', 0, rpt_data);
                }
                else {
                    var state = 'no_goto_weiyun',
                        iframe = document.createElement('iframe'),
                        loadfn = function () {
                            if (state === 'had_goto_weiyun') {
                                var qq_ver = iframe.contentWindow.name;    // 读取数据
                                rpt_data.extInt1 = parseInt(qq_ver, 10);
                                user_log('APPBOX_USER_ENV', 0, rpt_data);
                                me._remove_iframe(iframe);
                            } else if (state === 'no_goto_weiyun') {
                                state = 'had_goto_weiyun';
                                iframe.contentWindow.location = constants.HTTP_PROTOCOL + "//www.weiyun.com/set_domain.html";    // 设置的代理文件
                            }
                        };
                    iframe.src = constants.HTTP_PROTOCOL + '//www.weiyun.com/appbox/get_version.html';
                    iframe.width = iframe.height = 0;
                    if (iframe.attachEvent) {
                        iframe.attachEvent('onload', loadfn);
                    } else {
                        iframe.onload = loadfn;
                    }
                    document.body.appendChild(iframe);
                }

            }
        },

        _remove_iframe: function (iframe) {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.close();
            document.body.removeChild(iframe);
        }

    });

    main.once('render', function (params) {

        if (!query_user.check_cookie()) { //没有登陆态则只启动访问控制模块，登陆后后进行页面reload，那时才执行后面的
            access_check.start();
            return;
        }
        if (sub_modules_map && !$.isEmptyObject(sub_modules_map)) {
            // 初始化 url hash 映射
            this.
                listenTo(routers, 'init', function () {
                    var default_mod = routers.get_param(module_hash_key) || default_module_name;
                    this._parse_hash(default_mod);
                })
                .listenTo(routers, 'add.' + module_hash_key, function (mod_name) {
                    this._parse_hash(mod_name);
                })
                .listenTo(routers, 'change.' + module_hash_key, function (mod_name) {
                    this._parse_hash(mod_name);
                })
                .listenTo(routers, 'remove.' + module_hash_key, function () {
                    this.async_render_module(default_module_name, default_module_params);
                });

            // 初始化路由
            routers.init();
        }

        // 启动访问控制模块
        access_check.start();

        if (!('upload' in exclude_mods)) {
            //独立加载上传模块
            var me = this;
            if(constants.IS_APPBOX || constants.IS_PHP_OUTPUT){
                var up_def = me.async_render_upload();
                //上报用户环境
                setTimeout(function () {
                    up_def.done(function (upload_type) {
                        me.report_user_env(upload_type);
                    });
                }, 3000);
            }else{          //直出失败时 上传模块延迟加载2000ms  修复 ie8+flash player14 无法触发上传的情况.
                setTimeout(function(){
                    var up_def = me.async_render_upload();
                    //上报用户环境
                    setTimeout(function () {
                        up_def.done(function (upload_type) {
                            me.report_user_env(upload_type);
                        });
                    }, 3000);
                },2000);
            }
        }

        //WEB用户环境上报，用于对账 by jackbinwu
        if (!constants.IS_APPBOX && !constants.IS_QZONE) {
            query_user.on_ready(function () {
                user_log('WEB_USER_ENV');
            });
        }

        //启动ftn域名截持检测,20s后以免阻塞加载当前资源
        /*setTimeout(function() {
            require.async('ftn_dns_detect', function(mod) {
                mod.get('./ftn_dns_detect').start();
            });
        }, 20000);*/
        //加载系统网盘配置
        //common.get('./disk_config').load();

    });

    return main;
});