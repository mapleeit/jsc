/**
 * 邮箱分享模块
 * @author bondli
 * @date 2013-9-16
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record'),
        text = lib.get('./text'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        friend_mail_req,
        receiver_store,//收件人
        send_owner = query_user.get_uin_num() + '@qq.com',
        mail_subject = '【微云分享】',//发送邮件主题

        MAIL_REG = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

        undefined;

    var REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_other.fcg';

    var share_mail = {

        /**
         * 发送邮件 “发送”按钮点击事件
         * @param {Array} to_addrs 收件人地址
         * @param {Array} title 分享的标题
         * @param {String} content 邮件内容
         * @param {String} verify_code 验证码
         */
        send_mail : function(to_addrs, title, content, verify_code){
            var me = this,
                //发送请求
                def = $.Deferred(),
                req_body = {
                    from_user: send_owner,
                    to_user_list: to_addrs,
                    subject: mail_subject + title,//形成帅标题
                    content: content,
                    text_type: 'text'//发送格式，默认使用text文本
                };

            if(verify_code) {
                req_body.verify_code = verify_code;
            }

            request.xhr_post({
                url: REQUEST_CGI,
                cmd: 'QmailSendMail',
                pb_v2: true,
                body: req_body
            }).ok(function(rsp_msg, rsp_body){
                def.resolve();
            }).fail(function (msg, ret) {
                def.reject(msg, ret);
            });

            return def;
        },

        /**
         * 装载数据
         * @private
         * @param {Array} data 邮箱列表原始数据
         */
        _fill_store: function(data) {
            var records = [];
            receiver_store = new Store();
            $.each(data || [], function(i, item) {
                records.push(new Record(item));
            });
            receiver_store.load(records);
        },


        /**
         * 获取好友邮箱列表
         */
        async_get_mail_receiver: function() {
            var me = this,
                def;

            if(receiver_store) {//邮件收件人数据已经获取过了
                return;
            }
            def = $.Deferred();

            if(friend_mail_req) {
                friend_mail_req.destroy();
            }

            friend_mail_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: 'QmailGetAddrList',
                    pb_v2: true,
                    body: {
                        offset: 0,
                        count: 100
                    }
                })
                .ok(function(msg, body){
                    if(body.qmail_addr_list && body.qmail_addr_list.length) {
                        me._fill_store(body.qmail_addr_list);
                        def.resolve(me.get_receiver_store());
                    } else { //无数据当失败处理，不显示联系人列表
                        def.reject();
                    }
                })
                .fail(function(msg) {
                    def.reject(msg);
                });

            return def;
        },

        get_receiver_store: function() {
            return receiver_store;
        },
        /**
         * 根据指定字符串，模糊匹配邮件联系人
         * @param {String} match 要匹配的字符串
         * @returns {Array<Record>}
         * @private
         */
        _match_receiver: function(match) {
            var me = this,
                limit = 8,
                match_cnt = 0,
                store = me.get_receiver_store(),
                match_list = [];

            store.each(function(record) {
                var name = record.get('user_name'),
                    mail = record.get('mail_addr'),
                    name_split;

                if(match_cnt >= limit) {//匹配8个就够了
                    return false;
                }

                if(name.indexOf(match) > -1) {//nicname匹配
                    name_split = name.split(match);
                    name = text.text(name_split[0]) + '<b>' + text.text(match) + '</b>' + text.text(name_split[1]);//分开转义
                    match_list.push([name, mail, mail]);
                    match_cnt++;
                } else if(mail.indexOf(match) > -1) {//mail匹配
                    mail = mail.replace(match, '<b>' + match + '</b>');//加粗
                    match_list.push([name, mail, record.get('mail_addr')]);
                    match_cnt++;
                }
            });

            return match_list;
        },

        /**
         * 查找相匹配的收件人
         * @param {String} match
         */
        search_match_receiver: function(match) {
            var me = this,
                match_list = [],
                store = me.get_receiver_store();

            if(!store) {
                this.async_get_mail_receiver()
                    .done(function() {
                        match_list = me._match_receiver(match);
                    });
            } else {
                match_list = me._match_receiver(match);
            }


            return match_list;
        },

        /**
         * 校验邮箱地址正确性
         * @param {Array} mail_list 邮箱地址
         */
        validate_mail: function(mail_list) {
            var inval_cnt = 0;
            $.each(mail_list || [], function(i, mail) {
                if(mail && !MAIL_REG.test(mail)) {
                    inval_cnt++;
                }
            });
            return inval_cnt;
        }
    };

    return share_mail;
});