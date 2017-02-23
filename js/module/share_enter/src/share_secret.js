/**
 * 外链分享_私密外链模块
 * @author bondli
 * @date 2013-9-16
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        share_enter = require('./share_enter'),

        cur_pwd,//当前密码

        undefined;

    var REQUEST_CGI = 'http://web2.cgi.weiyun.com/outlink.fcg',
        ADD_PASSWD_CMD = 'WeiyunSharePwdCreate',
        EDIT_PASSWD_CMD = 'WeiyunSharePwdModify',
        DEL_PASSWD_CMD = 'WeiyunSharePwdDelete',
        PWD_BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
        ALL_NUM_REG = /^[0-9]+$/;

    function get_random_num() {
        return Math.round(Math.random() * PWD_BASE_CHARS.length);
    }

    var share_secret = {
    
        /**
         * 获取一个随机密码(4位)
         */
        get_random_passwd: function(){
            var t = '';
            for(var i =0 ; i < 4; i++) {
                t += PWD_BASE_CHARS.charAt(get_random_num());
            }
            if(ALL_NUM_REG.test(t)) { //不能全是数字
                t = arguments.callee.call(this);
            }
            return t;
        },

        /**
         * 发CGI，保存密码
         */
        set_passwd: function(sharekey, cmd, passwd){
            var def = $.Deferred();
            //验证传入的sharekey是否合法
            if(!sharekey.length) {
                def.reject('sharekey不合法');
                return def;
            }
            //验证请求的命令字是否合法
            if( $.inArray(cmd,[ADD_PASSWD_CMD,EDIT_PASSWD_CMD,DEL_PASSWD_CMD]) == -1 ) return;
            var data = {share_key: sharekey};
            if(cmd === EDIT_PASSWD_CMD) {
                data['share_new_pwd'] = passwd;
            } else if(cmd === ADD_PASSWD_CMD){
                data = {
                    share_key: sharekey,
                    share_pwd: passwd
                };
            }
            request.xhr_post({
                url: REQUEST_CGI,
                cmd: cmd,
                pb_v2: true,
                body: data
            }).ok(function(){
                def.resolve(passwd);
            }).fail(function (msg) {
                def.reject(msg);
            });

            return def;
        },
        /**
         * 创建密码
         * @returns {*}
         */
        create_pwd: function() {
            var me = this,
                passwd = me.get_random_passwd(),
                sharekey = share_enter._get_share_key(),
                def = $.Deferred();

            share_secret.set_passwd(sharekey, ADD_PASSWD_CMD, passwd)
                .done(function(){
                    cur_pwd = passwd;
                    def.resolve(passwd);
                })
                .fail(function(msg, ret){
                    //me.trigger('create_pwd_fail');
                    //重设密码
                    if(ret == 114501){
                        me.set_passwd(sharekey, EDIT_PASSWD_CMD, passwd)
                            .done(function(){
                                cur_pwd = passwd;
                                def.resolve(passwd);
                            })
                            .fail(function(msg){
                                def.reject(msg);
                            });
                    } else {
                        def.reject();
                    }
                });

            return def;
        },
        /**
         * 修改密码
         * @param {String} passwd
         */
        modify_pwd: function(passwd) {
            var sharekey = share_enter._get_share_key(),
                def = $.Deferred();
            //修改密码前需要校验是否和原来密码相同
            if(passwd == cur_pwd) {
                def.resolve(passwd);
                return def;
            }

            this.set_passwd(sharekey, EDIT_PASSWD_CMD, passwd)
                .done(function(){
                    cur_pwd = passwd;
                    def.resolve(passwd);
                })
                .fail(function(msg){
                    def.reject(msg);
                });

            return def;
        },
        /**
         * 删除密码
         * @returns {*}
         */
        delete_pwd: function() {
            var sharekey = share_enter._get_share_key(),
                def = $.Deferred();

            this.set_passwd(sharekey, DEL_PASSWD_CMD, '')
                .done(function(){
                    def.resolve();
                })
                .fail(function(msg){
                    def.reject(msg);
                });

            return def;

        }

    };

    return share_secret;
});