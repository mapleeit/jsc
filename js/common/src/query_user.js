/**
 * 获取用户信息
 * @author jameszuo
 * @date 13-1-15
 */

define(function (require, exports, module) {

    var lib = require('lib'),


        $ = require('$'),
        console = lib.get('./console'),
        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        cur_url = lib.get('./url_parser').get_cur_url(),
        covert = lib.get('./covert'),


        constants = require('./constants'),
        request = require('./request'),
        session_event = require('./global.global_event').namespace('session'),

	    local_skey,  //第一次进入的skey, 用来请求CGI时附加在header上供后台校验多个帐号通过appbox跳web时的登录态.
        local_uin,  //第一次进入的uin, 用来比较登录态是否过期.
        last_login_uin, // 最近一次进入的uin，用来比较是用户故意切换不同用户还是在其它页面无意切换的

        cached_user,
        loading_request,

        switching_user, //是否是切换用户登陆

        is_serv_put_data = false, // 服务端已吐出用户信息
        serv_data_loaded = false, // 服务端直出的信息已加载

        ok_stack = [],
        fail_stack = [],

        Math = window.Math,
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/qdisk_get.fcg',

        undefined;


    var query_user = {

        /**
         * 处理直出数据
         * @param {Object} usr_rsp_head 从CGI返回的header
         * @param {Object} usr_rsp_body 从CGI返回的body
         */
        set_init_data: function (usr_rsp_head, usr_rsp_body) {
            is_serv_put_data = true;
            serv_data_loaded = false;
             return this._set_user_from_cgi_rsp(usr_rsp_head, usr_rsp_body);
        },

        /**
         * 从CGI响应结果中获取User
         * @param {Object} head
         * @param {Object} body
         * @param {Boolean} [change_local_uin] 强制更新uin，默认false
         * @private
         */
        _set_user_from_cgi_rsp: function (head, body, change_local_uin) {
            cached_user = new User(head.uin, body);
            if (change_local_uin || !local_uin) {
                local_uin = cached_user.get_uin();
	            local_skey = cached_user.get_skey();
            }
            return cached_user;
        },

        /**
         * 查询登录用户的信息
         * @param {Boolean} force 是否从服务器获取，默认 false
         * @param {Boolean} cavil 挑剔（会话超时时弹出登录框、独立密码失效时弹出独立密码框）
         * @param {boolean} reset_tip_status 是否重置各种‘首次访问’状态，默认false（如是否是QQ网盘迁移用户首次访问微云等）
         * @param {Function} silent_callback 回调方法，传入该参数后将不会触发 load/error 事件
         * @param {Boolean} change_local_uin 强制更新uin，默认false
         */
        get: function (force, cavil, reset_tip_status, silent_callback, change_local_uin) {
            var me = this,
                silent = $.isFunction(silent_callback);

            reset_tip_status = reset_tip_status === true;

            // 如果是从服务端直出的数据，且数据尚未加载，则触发load、done事件 --- 直出时即使直接创建了user，也需要触发事件 - james
            if (is_serv_put_data && !serv_data_loaded) {
                serv_data_loaded = true;
                setTimeout(function () {
                    me._ok_callback(cached_user);
                    query_user.trigger('load', cached_user);
                    query_user.trigger('done', '', 0);
                }, 20);
            }
            // 如果不强制刷新, 那么当已有user信息时不重复获取
            else if (!force && cached_user) {
                setTimeout(function () {
                    me._ok_callback(cached_user);
                }, 20);
            }
            else {
                if (loading_request && this.get_switching_user()) {//如果是切换用户登陆，要把上一次请求销毁，避免无法发出请求 fixed bug48758599 by hibincheng
                    loading_request.destroy();
                }
                else if (loading_request) {
                    return this;
                }

                var req_body = reset_tip_status ? {
                    show_migrate_favorites: true,
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true,
                    is_get_upload_flow_flag: true
                } : {
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true,
                    is_get_upload_flow_flag: true
                };
                loading_request = request.xhr_get({  // james 2013-6-5 请求有可能因UIN变化而未发出
                    url: REQUEST_CGI,
                    cmd: 'DiskUserInfoGet',
                    cavil: cavil,
                    pb_v2: true,
                    change_local_uin: change_local_uin,
                    body: req_body
                })
                    .ok(function (msg, body, header) {
                        if(body['is_pwd_open'] && !me.check_indep_cookie()) { //开启了独立密码，但没有进行独立密码验证
                            session_event.trigger('invalid_indep_pwd', null, body);
                           // !silent && query_user.trigger('error', msg, 1031); //pb2.0前使用的是1031错误码
                            return;
                        }

                        me._set_user_from_cgi_rsp(header, body, change_local_uin);

                        if (silent) {
                            silent_callback.call(me, cached_user);
                        } else {
                            me._ok_callback.call(me, cached_user);
                            query_user.trigger('load', cached_user);
                        }
                    })
                    .fail(function (msg, ret) {
                        if (!silent) {
                            me._fail_callback.apply(me, arguments);
                            query_user.trigger('error', msg, ret);
                        }
                    })
                    .done(function (msg, ret) {
                        loading_request = false;
                        if (!silent) {
                            query_user.trigger('done', msg, ret);
                        }
                    })
            }
            return this;
        },


        /**
         * 检查用户会话状态是否有效
         */
        check: function () {
            var def = $.Deferred();
            request.xhr_get({
                url: REQUEST_CGI,
                cmd: 'DiskUserInfoGet',
                cavil: true,
                pb_v2: true
            })
                .ok(function () {
                    def.resolve();
                })
                .fail(function () {
                    def.reject();
                });
            return def;
        },

        check_indep_cookie: function() {
            var indep = cookie.get('indep');
            return indep ? true : false;
        },


        ok: function (fn) {
            if ($.inArray(fn, ok_stack) === -1) {
                ok_stack.push(fn);
            }
            return this;
        },

        fail: function (fn) {
            if ($.inArray(fn, fail_stack) === -1) {
                fail_stack.push(fn);
            }
            return this;
        },

        _ok_callback: function () {
            var me = this;
            if (ok_stack.length) {
                $.each(ok_stack, function (i, fn) {
                    fn.call(me, cached_user);
                });
                ok_stack = [];
            }
        },
        _fail_callback: function () {
            var me = this,
                args = $.makeArray(arguments);
            if (fail_stack.length) {
                $.each(fail_stack, function (i, fn) {
                    fn.apply(me, args);
                });
                fail_stack = [];
            }
        },
        //重新登陆时，切换用户登陆标识
        set_switching_user: function (done) {
            switching_user = true;
        },

        get_switching_user: function () {
            return switching_user;
        }
    };

    $.extend(query_user, events);

    // 获取当前登录用户的uin
    query_user.get_uin = function () {
        return cookie.get('uin') || cookie.get('clientuin'); // todo ok.oa.com uin
    };

    // 获取当前登录用户的skey
    query_user.get_skey = function () {
        return cookie.get('skey');
    };

    //微信登录态
    query_user.get_wx_ticket = function () {
        return cookie.get('wx_login_ticket');
    };

    // 获取当前登录用户的clientskey
    query_user.get_client_skey = function () {
        console.warn('query_user.get_client_skey() 尚未验证');
        return cur_url.get_param('clientuin'); // todo 验证
    };

    // 获取无前缀的用户uin
    query_user.get_uin_num = function () {
        if(cached_user) {
            return cached_user.get_uin();
        }
        return parseInt(this.get_uin().replace(/^[oO0]*/, '')) || '';
    };

    //判断用户是否是alpha用户
    query_user.is_alpha_user = function() {
        if(cached_user) {
            return cached_user.is_alpha_user();
        }
        return false;
    };
    
    // 获取uin的hex代码
    query_user.get_uin_hex = function(){
        var uin = query_user.get_uin_num() || 0;
        var hex = uin.toString(16);
        // 补到8位
        if(hex.length < 8) {
            hex = new Array(8-hex.length+1).join('0') + hex;
        }
        // 用字节序
        return hex.match(/../g).reverse().join('');
    };

    // 清除用户的登录态
    query_user.destroy = function () {
        var cookie_options = {
            domain: constants.MAIN_DOMAIN,
            path: '/'
        };
        $.each(['skey', 'uin', 'clientuin', 'wx_login_ticket', 'p_skey', 'indep','lskey', 'wy_uf', 'openid', 'key_type', 'access_token', 'p_uin', 'wy_appid'], function (i, key) {
            cookie.unset(key, cookie_options);
        });

        return true;
    };

    query_user.check_cookie = function () {
        return !!(this.get_uin() && this.get_skey() || this.get_wx_ticket());
    };

    // 获取当前用户（缓存）
    query_user.get_cached_user = function () {
        return cached_user;
    };
    
    /**
     * 快捷用法，当用户信息首次加载完成时触发，如果调用前已经加载过，也会执行一次
     * 
     * @param {Function} callback
     * @param {Object} scope (optional)
     * @return {$.Deferred} def 可以通过它中止尚未完成的回调，或附加额外的回调
     */
    query_user.on_ready = function(callback, scope){
        var def = $.Deferred().done(function(user){
            callback.call(scope, user);
        });
        if(cached_user){
            def.resolve(cached_user);
        }else{
            query_user.once('load', def.resolve, def);
        }
        return def;
    };
    
    /**
     * 快捷用法，当用户信息每次加载完成时触发，如果调用前已经加载过，也会执行一次
     * 
     * @param {Function} callback
     * @param {Object} scope (optional)
     * @return {$.Deferred} def 可以通过它中止尚未完成的回调，也可以通过progress来附加新的回调
     */
    query_user.on_every_ready = function(callback, scope){
        var def = $.Deferred().progress(function(user){
            callback.call(scope, user);
        });
        var init_def = query_user.on_ready(def.notify, def).done(function(){
            query_user.on('load', def.notify, def);
            def.fail(function(){
                query_user.off('load', def.notify, def);
            });
        });
        return def;
    };

    query_user.get_local_skey = function () {
        return local_skey;
    };

	query_user.get_local_uin = function () {
		return local_uin;
	};
    
    // 最近一次在此页面登录的uin（数字）
    query_user.get_last_login_uin = function(){
        return last_login_uin;
    };
    query_user.set_last_lgoin_uin = function(){
        last_login_uin = query_user.get_uin_num();
    };

    // 灰度代码 - 判断是否使用 cgi2.0
    query_user.is_use_cgiv2 = function () {
        return true;
    };

    // james: 修复UIN不是一个有效的值时（如abc），服务端返回1014的问题
    /*if (typeof query_user.get_uin_num() !== 'number') {
        query_user.destroy();
    }*/

    var User = function (uin, data) {
        this._uin = uin || query_user.get_uin_num() || data.uin; //因安全问题，uin不在包体返回了
        this._d = data;
    };


    User.prototype = {
        get_uin: function () {
            return this._uin;
        },
        /**
         * @deprecated 使用 query_user.get_skey()
         */
        get_skey: function () {
            return query_user.get_skey()
        },
        // 是否启用用户独立密码
        has_pwd: function () {
            return this._d['is_pwd_open'] === true;
        },
        set_has_pwd: function (has) {
            this._d['is_pwd_open'] = has ? true : false;
        },
//        get_MaxBatchCopyFileCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileCnt']) || 0;
//        },
//        get_MaxBatchCopyFileToOffineCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileToOffineCnt']) || 0;
//        },
//        get_MaxBatchCopyFileToOtherbidCnt: function () {
//            return parseInt(this._d['MaxBatchCopyFileToOtherbidCnt']) || 0;
//        },
        //文件批量下载最大数量
        get_files_download_count_limit: function () {
            return this._get_int('max_batch_file_download_number', 10);
        },
        get_files_remove_step_size: function () {
            return Math.min(this._get_int('max_batch_file_delete_number'), this._get_int('max_batch_dir_delete_number'));
        },
        get_files_move_step_size: function () {
            return Math.min(this._get_int('max_batch_file_move_number'), this._get_int('max_batch_dir_move_number'));
        },
        get_rec_restore_step_size: function () {
            return Math.min(this._get_int('max_batch_file_restore_number'), this._get_int('max_batch_dir_restore_number'));
        },
        //文件批量从回收站清除最大数量
        get_rec_shred_step_size: function () {
            return Math.min(this._get_int('max_batch_file_clear_number'), this._get_int('max_batch_dir_clear_number'));
        },
        get_files_packpage_download_size: function() {
            return Math.min(this._get_int('max_batch_dir_package_download_number'), this._get_int('max_batch_file_package_download_number'));
        },
        //最大索引(包括文件和目录)条数
        get_MaxFileAndFolderCnt: function () {
            return this._get_int('max_index_number', 65534);
        },
        //用户目录总数
        get_dir_count: function () {
            return this._d['dir_total']
        },
        //单层目录下最大索引(包括文件和目录)数
        get_dir_level_max: function () {
            return this._d['max_index_number_per_level']
        },
        //用户文件总数
        get_file_count: function () {
            return this._d['file_total']
        },
        //文件名称最大长度，字为单位
        get_filename_max_len: function () {
            return this._get_int('max_filename_length');
        },
        //目录名称最大长度，字为单位
        get_filepath_max_len: function () {
            return this._get_int('max_dir_name_length');
        },
	    //上传文件夹最大层级
	    get_dir_layer_max_number: function () {
		    return this._get_int('max_dir_layer_number');
	    },
        //没使用
        get_get_timestamp_interval: function () {
            return this._d['get_timestamp_interval']
        },
        //没使用
        get_getlist_timestamp_flag: function () {
            return this._d['getlist_timestamp_flag']
        },
        //用户根目录key
        get_root_key: function () {
            return this._d['root_dir_key'] || ''
        },
        //用户主目录key
        get_main_key: function () {
            return this._d['main_dir_key'] || ''
        },
        //用户主目录key
        get_main_dir_key: function () {
            return this._d['main_dir_key'] || ''
        },
        get_main_dir_name: function () {
            return this._d['main_dir_name'] || '微云'
        },
        //没用到
        get_max_batch_dirs: function () {
            return this._d['max_batch_dirs']
        },
        //没用到
        get_max_cur_dir_file: function () {
            return this._d['max_cur_dir_file']
        },
        //没用到
        get_max_dir_file: function () {
            return this._d['max_dir_file']
        },
        //没用到
        get_max_dl_tasks: function () {
            return this._d['max_dl_tasks']
        },
        //没用到
        get_max_dts: function () {
            return this._d['max_dts']
        },
        //没用到
        get_max_fz: function () {
            return this._d['max_fz']
        },
        //单层目录下最大索引(包括文件和目录)数
        get_max_indexs_per_dir: function () {
            return this._d['max_index_number_per_level']
        },
        //没用到
        get_max_interval_getlist: function () {
            return this._d['max_interval_getlist']
        },
        //没用到
        get_max_note_len: function () {
            return this._get_int('max_note_len');
        },
        //没用到
        get_max_retry: function () {
            return this._d['max_retry']
        },
        //没用到
        get_max_retry_interval: function () {
            return this._d['max_retry_interval']
        },
        //单个文件大小限制,单位为字节
        get_max_single_file_size: function () {
            return this._d['max_single_file_size']
        },
	    //当日剩余上传流量
	    get_remain_flow_size: function () {
		    return typeof this._d['remain_flow_size'] === 'undefined' ? this._d['max_single_file_size'] : this._d['remain_flow_size'];
	    },
	    set_remain_flow_size: function (size) {
		    this._d['remain_flow_size'] = size;
	    },
        //没用到
        get_max_tasks: function () {
            return this._d['max_tasks']
        },
        //没用到
        get_max_thread_getlist: function () {
            return this._d['max_thread_getlist']
        },
        //没用到
        get_max_ul_tasks: function () {
            return this._d['max_ul_tasks']
        },
        //没用到
        get_pic_key: function () {
            return this._d['photo_key']
        },
        //没用到
        get_qdisk_psw: function () {
            return this._d['qdisk_psw']
        },
        //没用到
        get_stat_flag: function () {
            return this._d['stat_flag']
        },
        //没用到
        get_stat_interval: function () {
            return this._d['stat_interval']
        },
        //用户总空间 单位为字节
        get_total_space: function () {
            return parseInt(this._d['total_space']);
        },
        //用户已用空间，单位为字节
        get_used_space: function () {
            // 已使用的空间可能会大于空间上限, 这里fix一下  @jameszuo
            // james, 你好, 这里又被产品打回了，要显示实际的大小. @svenzeng
            //return Math.min(this._get_int('used_space'), this.get_total_space());
            return this._get_int('used_space');
        },

        //------------使用云配置拉取的数据 s-------------
	    //每日离线下载使用次数
	    get_od_count_per_day: function() {
		    return this._d['Od_count_per_day'];
	    },
        // 非会员用户，回收站有效期天数，固定
        get_recycle_nonvip_tip: function () {
            return this._d['Recycle_nonvip_tip'];
        },
        // 会员用户，回收站有效期天数，非固定
        // 逻辑为：1.用户非会员，那么后台返回最高等级会员的保存天数；2.用户是会员，返回当前用户会员等级对应的保存天数
        get_recycle_vip_tip: function () {
            return this._d['Recycle_vip_tip'];
        },
        //------------使用云配置拉取的数据 e-------------

        get_terminal_info: function() {
            return this._d['terminal_info'];
        },
        get_vip_terminal_info: function() {
            return this._d['vip_terminal_info'];
        },
        //没用到
        get_user_authed: function () {
            return this._d['user_authed']
        },
        //用户创建时间
        get_user_ctime: function () {
            return this._d['user_ctime']
        },
        //用户修改时间
        get_user_mtime: function () {
            return this._d['user_mtime']
        },
        //没用到
        get_user_type: function () {
            return this._d['user_type']
        },
        //没用到
        get_user_wright: function () {
            return this._d['user_wright']
        },
        //没用到
        get_vip_level: function () {
            return this._d['vip_level']
        },
        // 昵称
        get_nickname: function () {
            return this._d['nick_name'];
        },
        // 头像
        get_avatar: function() {
            return this._d['head_img_url'];
        },

        // 判断是否QQ网盘迁移用户
        is_qqdisk_user: function () {
            return !!this._d['is_weiyun_qqdisk_user'];
        },

        // 判断QQ网盘迁移用户是否首次访问微云网盘
        is_qqdisk_user_first_access: function () {
            return !!this._d['is_show_qqdisk_migrate_user'];
        },

        // 判断用户在QQ网盘中是否已设置独立密码
        has_qqdisk_pwd: function () {
            return !!this._d['is_qqdisk_pwd_open'];
        },

        // 判断用户是否是网络收藏夹用户
        is_favorites_user: function () {
            return !!this._d['is_favorites_user'];
        },

        // 判断是否网络收藏夹用户首次访问微云
        is_fav_user_first_access: function () {
            return !!this._d['is_show_migrate_favorites'];
        },

        // 是否已安装手机微云
        is_wy_mobile_user: function () {
            return !!this._d['is_weiyun_mobile_user'];
        },

        // 是否是微云登录用户
        is_weixin_user: function () {
	        var wy_uf = parseInt(cookie.get('wy_uf')) || 0;
            return !!wy_uf;
        },

        //是否alpha用户
        is_alpha_user: function() {
            return !!this._d['is_alpha_user'];
        },

        //是否是微云会员用户
        is_weiyun_vip: function() {
            return this._d['weiyun_vip_info'] && this._d['weiyun_vip_info']['weiyun_vip'];
        },

        //是否是黄钻用户
        is_qzone_vip: function() {
            return this._d['qzone_info'] && this._d['qzone_info']['qzone_vip'];
        },

        is_lib3_user: function() {
            return !!this._d['lib3_trans_flag'];
        },

        _get_int: function (key, defaults) {
            return parseInt(this._d[key]) || defaults || 0;
        },
        /**
         * 下载时需要带上这个码 - james
         * @returns {String}
         */
        get_checksum: function () {
            return this._d['checksum'];
        },
        /**
         * owa支持文档预览的后缀
         * @returns {*}
         */
        get_owa_supported_ext: function() {
            return this._d['owa_supported_ext'];
        },
        /**
         * owa支持文档预览的大小
         * @returns {*}
         */
        get_owa_max_file_size: function() {
            return this._d['owa_max_file_size'];
        },

        get_qzone_info: function() {
            return this._d['qzone_info'] || {};
        },

        get_weiyun_vip_info: function() {
            return this._d['weiyun_vip_info'] || {};
        },

        //流量相关信息
        get_flow_info: function() {
            return this._d['qdisk_flow_info'] || {};
        }

    };

    return query_user;
});
