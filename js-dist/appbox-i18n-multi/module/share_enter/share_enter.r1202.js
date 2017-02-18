//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/share_enter/share_enter.r1202",["lib","common","$","i18n"],function(require,exports,module){

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
//share_enter/src/mail_receiver.js
//share_enter/src/share_enter.js
//share_enter/src/share_mail.js
//share_enter/src/share_secret.js
//share_enter/src/ui.js
//share_enter/src/share.WEB.tmpl.html
//share_enter/src/share_enter.tmpl.html

//js file list:
//share_enter/src/mail_receiver.js
//share_enter/src/share_enter.js
//share_enter/src/share_mail.js
//share_enter/src/share_secret.js
//share_enter/src/ui.js
/**
 * 常用联系人列表模块
 * @author hibincheng
 * @date 2013-09-26
 */
define.pack("./mail_receiver",["lib","common","$","./share_mail","./tmpl","i18n"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        View = lib.get('./data.View'),
        Module = common.get('./module'),
        share_mail = require('./share_mail'),
        tmpl = require('./tmpl'),

        ie6 = $.browser.msie && $.browser.version < 7,
        lowie9 = $.browser.msie && $.browser.version < 9,
        has_limit_list_heigth = false,
        can_navi_match_list = false,
        navi_match_cursor = 0,
        navi_match_cursor_max = 0,
        FILTER_KEY = [38, 40 , 13],//up down enter

        _ = require('i18n').get('./pack'),
        l_key = 'share_enter',

        place_holder_text = _(l_key,'输入收件人，多收件人中间用分号隔开'),

        undefined;

    var mail_receiver = new Module('mail_receiver', {

        render: function($mail_receiver_ct) {
            if(this.rendered) {
                return;
            }
            this.$mail_receiver_ct = $mail_receiver_ct;
            $(tmpl.mail_receiver()).appendTo($mail_receiver_ct);

            this.rendered = true;

            this.fill_mail_receiver_list();
            this.bind_events();

        },
        /**
         * 重置UI，因每次分享都会用到而只render一次，所以再次进入要先重置
         */
        reset_ui: function() {
            if(!this.rendered) {
                return;
            }
            var store = share_mail.get_receiver_store();
            if(store) {
                store.each(function(record) {
                    var is_selected = record.get('selected');
                    is_selected && record.set('selected', false);//有选择的要清除
                });
            }
            this.get_$mail_receiver_text().val(place_holder_text);
            this.hide_mail_list();
        },

        /**
         * 绑定UI事件
         */
        bind_events: function() {
            var me = this;

            //收件人地址
            this.$mail_receiver_ct
                .on('focus', '[data-id=mail_receiver_text]', function(e) {//聚焦
                    var $target = $(this);
                    if($target.val() === place_holder_text) {
                        $target.val('');
                    }
                    if(lowie9) {
                        $target.addClass('focus');
                    }
                })
                .on('blur', '[data-id=mail_receiver_text]', function(e) {//失去焦点
                    var $target = $(this);
                    if(!$target.val()) {
                        $target.val(place_holder_text);
                    }
                    if(lowie9) {
                        $target.removeClass('focus');
                    }
                    me.get_$mail_match_list().hide();//input框失去焦点，自动匹配列表隐藏
                    can_navi_match_list = false;
                })
                .on('keyup', '[data-id=mail_receiver_text]', function(e) {
                    var match;
                    if($.inArray(e.keyCode, FILTER_KEY) > -1) {
                        return;
                    }
                    match = $(this).val().split(';').pop();//分号为邮箱分割符
                    if(match) {
                        me.auto_match_receiver(match);//收件人智能提示
                    } else {
                        me.get_$mail_match_list().hide();//清空，自动匹配列表隐藏
                    }
                })
                //点击“常用联系人”
                .on('click', '[data-id=mail_list_trigger]', function(e) {
                    e.preventDefault();
                    me.toggle();
                })

                .on('keydown', function(e) {
                    var keyCode = e.keyCode;
                    if(keyCode === 38 || keyCode === 40) {
                        me.navi_match_list(keyCode === 38 ? 'up' : 'down');
                    }

                    var $match_list,
                        mail_text;
                    if(e.keyCode === 13 && can_navi_match_list) {//enter键
                        $match_list = me.get_$mail_match_list();
                        mail_text = $match_list.children(':eq(' + navi_match_cursor + ')').attr('data-mail');
                        me.select_match_mail(mail_text);
                        $match_list.hide();
                    }
                });

            this.get_$mail_match_list()
                //选中自动匹配中的邮箱
                .on('mousedown', 'a', function(e) {
                    me.select_match_mail($(this).attr('data-mail'));
                })
                .on('mouseenter', 'a', function(e) {
                    var $match_list = me.get_$mail_match_list(),
                        $target = $(this);

                    $match_list.children(':eq(' + navi_match_cursor + ')').removeClass('hover');
                    navi_match_cursor = $target.attr('data-index');
                    $target.addClass('hover');
                });

            //关闭常用联系人列表
            this.get_$mail_list()
                .on('click', '.close', function(e) {
                    me.hide_mail_list();
                })
                //联系人列表全选
                .on('click', '[data-id=checkall]', function(e) {
                    var $target = $(this),
                        is_checked = $target.is('.checked');
                    $target.toggleClass('checked', !is_checked);
                    me.select_all_receiver(!is_checked);

                });

            //IE6 hover hack
            if(ie6) {
                this.get_$mail_list()
                    .on('mouseenter', '.mail-list .con-list', function(e) {
                        $(this).addClass('con-list-hover');
                    })
                    .on('mouseleave', '.mail-list .con-list', function(e) {
                        $(this).removeClass('con-list-hover');
                    });
            }

        },

        toggle: function() {
            var $mail_list,
                list_view = this.get_mail_list_view();

            if(!list_view) {
                return;//有可能没有联系人
            }

            $mail_list = this.get_$mail_list();
            $mail_list.toggle();

            if(!has_limit_list_heigth && $mail_list.is(':visible')) {
                //限制最大高度
                if(list_view.$list.height() > 130) {
                    list_view.$list.height(130);
                }
                has_limit_list_heigth = true;
            }
        },


        /**
         * 填充常用联系人列表
         */
        fill_mail_receiver_list: function() {
            var me = this;
            share_mail.async_get_mail_receiver()
                .done(function(store) {
                    if(store.size() > 0) {
                        me.create_mail_list_view();
                        me.get_$mail_list_ct().show();
                    }
                })
                .fail(function() {
                    me.get_$mail_list_ct().hide();
                });
        },
        /**
         * 创建常用联系人列表视图
         */
        create_mail_list_view: function() {
            var me = this,
                store = share_mail.get_receiver_store(),
                view;

            view = new View({
                store: store,
                list_tpl: function() {
                    return tmpl.mail_receiver_list();
                },
                list_selector: 'div.con',
                item_selector: 'div.con-list',
                get_html: function(records) {
                    return tmpl.mail_receiver_item(records);
                },
                shortcuts : {
                    selected : function(value){
                        $(this).toggleClass('checked', value);
                    }
                }
            });
            view.render(me.get_$mail_list());

            this.listenTo(view, {
                'recordclick': function(record, e) {
                    e.preventDefault();
                    me.select_receiver_record(record);
                }
            });

            this.mail_list_view = view;
        },
        /**
         * 常用联系人列表视图
         * @returns {*}
         */
        get_mail_list_view: function() {
            return this.mail_list_view;
        },

        /**
         * 根据输入的收件人，智能提示匹配的列表
         * @param {String} match
         */
        auto_match_receiver: function(match) {
            var has_match_list,
                $match_list;

            if(!match) {
                return;
            }
            has_match_list = share_mail.search_match_receiver(match);
            $match_list = this.get_$mail_match_list();

            if(has_match_list.length > 0) {
                $match_list.html(tmpl.mail_match_list(has_match_list)).show();
                can_navi_match_list = true;
                navi_match_cursor = 0;
                navi_match_cursor_max = has_match_list.length-1;
                $match_list.children(':eq(0)').addClass('hover');
            } else {
                $match_list.hide();
                can_navi_match_list = false;
            }
        },

        navi_match_list: function(point) {
            //match列表隐藏时不用进行链接导航
            if(!can_navi_match_list) {
                return;
            }

            var $match_list = this.get_$mail_match_list();
            $match_list.children(':eq(' + navi_match_cursor +')').removeClass('hover');
            if(point === 'up') {//向上
                navi_match_cursor--;
                if(navi_match_cursor < 0) {
                    navi_match_cursor = navi_match_cursor_max;
                }
            } else if(point === 'down') {//向下
                navi_match_cursor++;
                if(navi_match_cursor > navi_match_cursor_max) {
                    navi_match_cursor = 0;
                }
            }

            $match_list.children(':eq(' + navi_match_cursor +')').addClass('hover');


        },
        /**
         * 选中自动匹配中的邮箱
         * @param {String} mail 选中相匹配的邮箱
         */
        select_match_mail: function(mail) {
            var $receiver_text = this.get_$mail_receiver_text(),
                receiver_text = $receiver_text.val().split(';');
            receiver_text.pop();//把刚输入的去掉，用匹配选中的
            this.get_$mail_receiver_text().val(receiver_text.join(';'));
            this.select_receiver(mail, true);
        },

        /**
         * 选择常用联系人列表中的一项
         * @param {Record} record 联系人记录
         */
        select_receiver_record: function(record) {
            var is_selected = record.get('selected'),
                $checkall = this.get_$mail_list_checkall(),
                is_checkall = $checkall.is('.checked'),
                should_checkall = true,
                store = share_mail.get_receiver_store();

            record.set('selected', !is_selected);
            this.select_receiver(record.get('mail_addr'), !is_selected);

            if(is_selected && is_checkall) {//当前为不勾选，则不能是全选
                $checkall.toggleClass('checked', false);
            } else {//当前勾选时，判断是否全都勾选了，如果全都勾选了，则全选勾上
                store.each(function(item) {
                    if(!item.get('selected')) {
                        should_checkall = false;
                        return false;//break;
                    }
                });
                should_checkall && $checkall.toggleClass('checked', true);
            }

        },

        /**
         * 选择/反选 选定的邮件联系人
         * @param {String} mail 邮箱
         * @param {Boolean} is_select 是否选中
         */
        select_receiver: function(mail, is_select) {
            var text = this.get_$mail_receiver_text().val(),
                has_mails = this.filter_place_holder_text(text).split(';'),
                index;

            !has_mails[0] && has_mails.shift();
            !has_mails[has_mails.length-1] && has_mails.pop();
            index = $.inArray(mail, has_mails);
            if(index > -1) {
                !is_select && has_mails.splice(index, 1);//取消选择
            } else {
                has_mails.push(mail);
            }

            this.get_$mail_receiver_text().val(has_mails.length > 0 ? has_mails.join(';') + ';' : place_holder_text);
        },

        /**
         * 全选/反选 所有联系人
         * @param {Boolean} selectall 是否全选
         */
        select_all_receiver: function(selectall) {
            var text = this.get_$mail_receiver_text().val(),
                has_mails = this.filter_place_holder_text(text).split(';'),
                store = share_mail.get_receiver_store();

            !has_mails[0] && has_mails.shift();
            !has_mails[has_mails.length-1] && has_mails.pop();

            store.each(function(record) {
                var mail = record.get('mail_addr'),
                    index = $.inArray(mail, has_mails);

                record.set('selected', selectall);
                if(selectall) {//全选
                    index === -1 && has_mails.push(mail);
                } else {//反选
                    index > -1 && has_mails.splice(index, 1);
                }
            });

            this.get_$mail_receiver_text().val(has_mails.length > 0 ? has_mails.join(';') + ';' : place_holder_text);

        },

        /**
         * 过滤掉默认的提示字符串
         * @param {String} text
         * @returns {*|XML|string|void}
         */
        filter_place_holder_text: function(text) {
            if(text.indexOf(place_holder_text) > -1) {
                return text.replace(place_holder_text, '');
            } else {
                return text;
            }
        },
        /**
         * 发送邮件
         */
        send_mail: function() {
            var me = this,
                receiver = me.get_$mail_receiver_text().val().split(';'),
                content,
                $tip = me.get_$send_succ_tip(),
                inval_cnt;

            $tip.hide();
            //收件人个数上限
            if(receiver.length > 20) {
                $tip.text(_(l_key,'收件人最多20个'));
                return;
            }
            //邮箱合法性校验
            inval_cnt = share_mail.validate_mail(receiver);
            if(inval_cnt) {
                $tip.text(text.format(_(l_key,'有{0}个收件人邮箱不合法'),[inval_cnt]));
                return;
            }

            content = me.get_$mail_con();
            share_mail.send_mail(receiver, content)
                .done(function() {
                    $tip.text(_(l_key,'发送成功'));
                })
                .fail(function(msg) {
                    $tip.text(msg);
                });

        },

        hide_mail_list: function() {
            this.get_$mail_list().hide();
        },
        //收件人地址
        get_receiver_text: function() {
            return this.get_$mail_receiver_text().val();
        },
        //收件人框默认显示提示
        get_placeholder_text: function() {
            return place_holder_text;
        },
        //====================== DOM 相关 =============================//

        get_$mail_list_checkall: function() {
            return this.$mail_list_checkall || (this.$mail_list_checkall = this.$mail_receiver_ct.find('[data-id=checkall]'));
        },

        get_$mail_receiver_text: function() {
            return this.$mail_receiver_text || (this.$mail_receiver_text = this.$mail_receiver_ct.find('[data-id=mail_receiver_text]'));
        },

        get_$mail_list_ct: function() {
            return this.$mail_list_ct || (this.$mail_list_ct = this.$mail_receiver_ct.find('[data-id=mail_list_ct]'));
        },

        get_$mail_list: function() {
            return this.$mail_list || (this.$mail_list = this.$mail_receiver_ct.find('[data-id=mail_list]'));
        },

        get_$mail_match_list: function() {
            return this.$mail_match_list || (this.$mail_match_list = this.$mail_receiver_ct.find('[data-id=mail_match_list]'));
        }
    });

    return mail_receiver;
});/**
 * 邮件\外链分享入口模块
 * @author hibincheng
 * @date 2013-09-16
 */
define.pack("./share_enter",["lib","common","$","i18n","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        text = lib.get('./text'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        ret_msgs = common.get('./ret_msgs'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
    // 可分享的文件字节数上限，0表示不限制
        size_limit = 0,

        File = common.get('./file.file_object'),

        create_share_req,

        _ = require('i18n').get('./pack'),
        l_key = 'share_enter',

        undefined;

    var share_enter = new Module('share_enter', {

        ui: require('./ui'),

        render: function() {
            console.log('render__________________________');
            if(this._rendered) {
                return;
            }

            this._rendered = true;
        },

        /**
         * 校验
         * @param {File} file
         * @returns {string}
         * @private
         */
        _validate: function (file) {
            if (file.is_broken_file()) {
                return _(l_key,'不能分享破损的文件');
            }
            else if (file.is_empty_file()) {
                return _(l_key,'不能分享空文件');
            }
            else if (size_limit > 0 && file.get_cur_size() > size_limit) {
                return text.format(_(l_key,'分享的文件应小于{0}'),[File.get_readability_size(size_limit)]);
            }
        },

        /**
         * 判断所选择的文件是否可以被分享
         * @param files 所选择的文件
         * @returns {String} error_msg
         */
        is_sharable: function(files) {
            var err,
                me = this;
            //分享文件上限数判断
            if(files.length > constants.LINK_SHARE_LIMIT) {
                return err = text.format(_(l_key,'分享一次最多支持{0}个文件'),[constants.LINK_SHARE_LIMIT]);
            }
            //每个文件是否可以被分享判断，如果其中有一个不能分享，则此次不能分享
            $.each(files, function(i, file) {
                if(!file.is_dir() && (err = me._validate(file))) {
                    return false;
                }
            });

            return err;
        },
        /**
         * 创建要分享文件的链接
         * @param {Array<FileNode>} files 要分享的文件
         * @private
         */
        _create_share_link: function(files) {
            var me = this;

            var _files = [],
                _dirs = [],
                first_file = files[0],
                pid = first_file.get_pid(),
                ppid = first_file.get_parent ? first_file.get_parent().get_pid() : first_file.get_ppid();
            $.each(files, function (i, f) {
                if (f.is_dir()) {
                    _dirs.push({ dir_key: f.get_id(), dir_name: f.get_name() });
                } else {
                    _files.push({ file_id: f.get_id(), file_name: f.get_name() });
                }
            });

            //防止分享多余100个文件
            if (files.length > constants.LINK_SHARE_LIMIT) {
                mini_tip.warn(text.format(_(l_key,'链接分享一次最多支持{0}个文件',[constants.LINK_SHARE_LIMIT])));
                return;
            }

            if(create_share_req) {
                create_share_req.destroy();
            }

            //TODO:创建分享链接cgi联调
            create_share_req = request
                .post({
                    url: 'http://web.cgi.weiyun.com/wy_share.fcg',
                    cmd: 'add_share',
                    header: {"uin" : query_user.get_cached_user().get_uin()},
                    body: {
                        ppdir_key: ppid,
                        pdir_key: pid,
                        files: _files,
                        dirs: _dirs
                    },
                    cavil: true,
                    resend: true
                })
                .ok(function(msg, body) {
                    var link = body['short_url'],
                        curr_pwd = body['share_pwd'];
                    me._set_share_key(body['raw_url']);
                    me.trigger('create_share_success', files, link, curr_pwd);
                })
                .fail(function(msg, ret) {
                    mini_tip.error(msg);
                })
                .done(function() {
                    create_share_req = null;
                });
        },

        _share_key: '',

        /**
         * 设置当前的sharekey
         */
        _set_share_key: function(sharelink){
            this._share_key = sharelink.replace('http://share.weiyun.com/','');
        },

        /**
         * 获取当前的sharekey
         */
        _get_share_key: function(){
            return this._share_key;
        },

        /**
         * 分享文件，外部统一入口
         * @param files
         */
        start_share: function(files) {

            if(!files || files.length === 0) {
                console.log('参数错误');
            }
            if(!$.isArray(files)) {
                files = [files];
            }

            var err = this.is_sharable(files);

            if(err) {
                mini_tip.warn(err);
                return;
            }
            if(!this._rendered) {
                this.render();
            }

            this._create_share_link(files);
        }
    });

    return share_enter;

});/**
 * 邮箱分享模块
 * @author bondli
 * @date 2013-9-16
 */
define.pack("./share_mail",["lib","common","$","i18n"],function(require, exports, module){
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

        _ = require('i18n').get('./pack'),
        l_key = 'share_enter',

        mail_subject = _(l_key,'【微云分享】'),//发送邮件主题

        MAIL_REG = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

        undefined;

    var REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg';

    var share_mail = {

        /**
         * 发送邮件 “发送”按钮点击事件
         * @param {Array} to_addrs 收件人地址
         * @param {Array} title 分享的标题
         * @param {String} content 邮件内容
         */
        send_mail : function(to_addrs, title, content){
            //发送请求
            var def = $.Deferred();
            request.post({
                url: REQUEST_CGI,
                cmd: 'send_mail',
                header:{ "uin": query_user.get_uin_num() },
                body: {
                    from: send_owner,
                    to_addrs: to_addrs,
                    subject: mail_subject + title,//形成帅标题
                    content: content,
                    texttype: 'text'//发送格式，默认使用text文本
                }
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
                .post({
                    url: REQUEST_CGI,
                    cmd: 'get_addr_list',
                    header:{ "uin": query_user.get_uin_num() },
                    body: {
                        offset: 0,
                        count: 100
                    }
                })
                .ok(function(msg, body){
                    me._fill_store(body.items);
                    def.resolve(me.get_receiver_store());
                })
                .fail(function(msg) {
                    def.reject(msg);
                });

            /*//for test
             me._fill_store([{
             name: 'hi',
             mail: '32333@qq.com'
             },{
             name: 'bin',
             mail: '323a33@163.com'
             }]);
             def.resolve(me.get_receiver_store());*/

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
});/**
 * 外链分享_私密外链模块
 * @author bondli
 * @date 2013-9-16
 */
define.pack("./share_secret",["lib","common","$","./share_enter"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        share_enter = require('./share_enter'),

        cur_pwd,//当前密码

        undefined;

    var REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
        ADD_PASSWD_CMD = 'create_pwd',
        EDIT_PASSWD_CMD = 'modify_pwd',
        DEL_PASSWD_CMD = 'delete_pwd',
        PWD_BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
        ALL_NUM_REG = /^[0-9]+$/;

    function get_random_num() {
        return Math.floor(Math.random() * PWD_BASE_CHARS.length);
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
            if(sharekey.length != 32) {
                //hyytodo 未修改。 待确认。   目测这个wording不会显示
                def.reject('sharekey不合法');
                return def;
            }
            //验证请求的命令字是否合法
            if( $.inArray(cmd,[ADD_PASSWD_CMD,EDIT_PASSWD_CMD,DEL_PASSWD_CMD]) == -1 ) return;
            var data = {share_key: sharekey};
            if(cmd != DEL_PASSWD_CMD){
                data = {
                    share_key: sharekey,
                    share_pwd: passwd
                };
            }
            request.post({
                url: REQUEST_CGI,
                cmd: cmd,
                header:{ "uin": query_user.get_uin_num() },
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
});/**
 * 邮件\外链分享UI逻辑
 * @author hibincheng
 * @date 2013-09-16
 */
define.pack("./ui",["lib","common","$","./tmpl","i18n","./share_enter","./share_mail","./share_secret","./mail_receiver"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        Copy = common.get('./util.Copy'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        share_mail,
        share_secret,
        share_enter,
        mail_receiver,

        share_dialog,//分享窗口
        has_bind_dialog_event,//是否已经绑定窗口事件
        cur_share_link,//当前要分享的链接
        cur_mail_share_name,
        send_mail_title,
        cur_tab,

        TAB_INFO = {
            LINK: 'link',
            MAIL: 'mail'
        },
        NUM_WORD_REG = /[0-9a-zA-Z]/,
        NUM_WORD_FILTER_REG = /[^0-9a-zA-Z]/g,
        filter_key_code = [8, 9, 37, 39, 35, 46],//BackSpace、Tab、Left、Right Delete、End,字符过滤时不对这几个操作字符过虑

        _ = require('i18n').get('./pack'),
        l_key = 'share_enter',

        undefined;

    var ui = new Module('share_enter_ui', {

        render: function() {
            share_enter = require('./share_enter');
            share_mail = require('./share_mail');
            share_secret = require('./share_secret');
            this.listenTo(share_enter, 'create_share_success', this.on_create_share_success);
        },
        /**
         * 创建分享密码
         */
        start_create_pwd: function() {
            var me = this;
            me.on_loading_show();
            share_secret.create_pwd()
                .done(function(pwd) {
                    me.on_create_pwd_done(true, pwd);
                })
                .fail(function(msg) {
                    me.on_create_pwd_done(false, msg);
                });
        },
        /**
         * 修改分享密码
         * @param {String} pwd
         */
        start_modify_pwd: function(pwd) {
            var me = this;
            me.on_loading_show();
            share_secret.modify_pwd(pwd)
                .done(function(pwd) {
                    me.on_create_pwd_done(true, pwd);
                })
                .fail(function(msg) {
                    me.on_create_pwd_done(false, msg);
                });
        },
        /**
         * 删除分享密码
         */
        start_delete_pwd: function() {
            var me = this;
            share_secret.delete_pwd()
                .done(function() {
                    me.on_delete_pwd_done();
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
        },
        /**
         * 发送邮件
         */
        start_send_mail: function() {
            var me = this,
                receiver = mail_receiver.get_receiver_text().split(';'),
                content,
                $send_btn = this.get_$send_btn(),
                inval_cnt;

            mail_receiver.hide_mail_list();

            !receiver[0] && has_mails.shift();
            !receiver[receiver.length-1] && receiver.pop();
            if(receiver.length === 0 || receiver[0] === mail_receiver.get_placeholder_text()) {
                me.show_msg_tip(false, _(l_key,'请填写收件人'));
                return;
            }
            //收件人个数上限
            if(receiver.length > 20) {
                me.show_msg_tip(false, _(l_key,'收件人最多20个'));
                return;
            }
            //邮箱合法性校验
            inval_cnt = share_mail.validate_mail(receiver);
            if(inval_cnt) {
                me.show_msg_tip(false, text.format(_(l_key,'有{0}个收件人邮箱不合法'),[inval_cnt]));
                return;
            }
            //防止狂点发送
            if($send_btn.is('.disabled')) {
                return;
            }
            $send_btn.addClass('disabled');
            content = me.get_$mail_con().val();
            share_mail.send_mail(receiver, send_mail_title, content)
                .done(function() {
                    me.show_msg_tip(true, _(l_key,'发送成功'));
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                })
                .always(function() {
                    $send_btn.removeClass('disabled');
                });
        },

        /**
         * 初始化复制操作
         * @private
         */
        _init_copy: function() {
            var me = this;

            if(!Copy.can_copy()) {
                return;
            }

            this.copy = new Copy({
                container_selector: '#_disk_share_pop_container',
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function() {
                    return me.get_copy_text();
                }, this)
                .listenTo(this.copy, 'copy_done', function() {
                    user_log('SHARE_CREATE_COPY_BUTTON');
                    me.show_msg_tip(true, _(l_key,'复制链接成功'));
                })
                .listenTo(this.copy, 'copy_error', function() {
                    user_log('SHARE_CREATE_COPY_BUTTON');
                    me.show_msg_tip(false, _(l_key,'复制链接失败'));
                });
        },

        get_copy_text : function () {
            return this.copy_text || '';
        },

        set_copy_text : function (text) {
            this.copy_text = text;
        },
        /**
         * 绑定窗口事件
         */
        bind_dialog_event: function() {
            var me = this;
            //判断keyCode是否是数字和字母
            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }
            if(!has_bind_dialog_event) {
                share_dialog.$el
                    .on('click', '[data-action=create_pwd]', function(e) {//给分享加密
                        e.preventDefault();
                        user_log('ADD_SHARE_PWD');
                        me.start_create_pwd();
                    })
                    .on('click', '[data-action=cancel_pwd]', function(e) {//取消加密
                        e.preventDefault();
                        me.start_delete_pwd();
                        user_log('CANCEL_SHARE_PWD');
                    })
                    .on('keydown', '[data-id=pwd_text]', function(e) {
                        var keycode = e.keyCode;
                        if(!is_num_word_key(keycode) && $.inArray(keycode, filter_key_code) === -1
                            || e.shiftKey === true) {//非数字或字母，不给输入
                            e.preventDefault();
                            //webkit、opera 中文输入法下禁止输入，此时keyCode为固定的值  ie firefox采用 html:style="ime-mode:disabled"
                            if($.browser.webkit && keycode === 229 || $.browser.opera && keycode === 197) {
                                var pwd = $.trim($(this).val());
                                $(this).val(pwd.replace(NUM_WORD_FILTER_REG, ''));
                            }
                            return false;
                        }
                    })
                    .on('keyup', '[data-id=pwd_text]', function(e) {//修改密码
                        e.preventDefault();
                        var value = $.trim($(this).val());
                        var keycode = e.keyCode;
                        var char = String.fromCharCode(keycode);
                        if(($.browser.webkit || $.browser.opera) && !NUM_WORD_REG.test(char) && $.inArray(keycode, filter_key_code) === -1) {//webkit opera 中文输入法下禁止输入，些时keyCode并不固定，先在keydown拦截，没成功再在这里拦一次
                            value = value.replace(NUM_WORD_FILTER_REG, '');
                            $(this).val(value);
                        }
                        if(value.length === 4) {
                            if($.inArray(keycode, filter_key_code) > -1) {
                                return;
                            }
                            //将焦点移除
                            //$(this).blur(); //移到方法内部实现，防止密码没有变化的情况下发请求
                            //me.trigger('modify_pwd', value);
                            me.get_$pwd_con().removeClass('error');
                            me.start_modify_pwd(value);
                            user_log('SHARE_CREATE_CHANGE_PWD');
                        }
                        else{
                            //去掉“打勾”图标
                            me.get_$pwd_con().removeClass('success');
                        }
                    })
                    .on('focus', '[data-id=pwd_text]', function(e) {
                        me.get_$pwd_con().removeClass('error');
                    })
                    .on('blur', '[data-id=pwd_text]', function(e) {
                        var $target = $(this);
                        var value = $.trim($target.val());
                        if($target.is(':visible') && value.length < 4) {
                            me.get_$pwd_con().addClass('error');
                        }
                    })
                    .on('click', '[data-id=tab_head_link],[data-id=tab_head_mail]', function(e) {//给分享加密
                        e.preventDefault();
                        me.switch_tab($(this).attr('data-id'));
                    })/*.
                 //去掉之前网盘中默认不给选中文本的事件
                 on('click._selectable', '[data-id=sub_title]', function(e) {
                 e.stopImmediatePropagation();
                 })
                 .on('selectstart.selectable', '[data-id=sub_title]', function(e) {
                 e.stopImmediatePropagation();
                 })*/;

                //密码框禁用粘贴
                share_dialog.$el.find('[data-id=pwd_text],[data-id=change_pwd_text]')
                    .on('paste', function(e) {
                        e.preventDefault();
                        return false;
                    });


                has_bind_dialog_event = true;
            }
        },
        /**
         * 创建分享窗口
         * @private
         */
        _create_share_dialog: function() {
            var me = this;
            share_dialog = new widgets.Dialog({
                title: _(l_key,'分享文件'),
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.share_dialog,
                mask_bg: 'ui-mask-white',
                buttons: [{
                    id:'copy',
                    text:_(l_key,'复制链接'),
                    disabled:false
                }, {
                    id: 'send',
                    text: _(l_key,'发送'),
                    disabled: false
                }],
                handlers: {
                    copy: function(e) {
                        e.preventDefault();
                        me.copy.ie_copy(me.get_copy_text());
                        user_log('SHARE_CREATE_COPY_BUTTON');
                    },
                    send: function(e) {
                        e.preventDefault();
                        me.start_send_mail();
                        user_log('MAIL_SHARE_SEND_BUTTON');
                    }
                }
            });

            share_dialog.render_if();
            this.bind_dialog_event();

            this._init_copy();//初始化复制操作
        },
        /**
         * 获取分享窗口
         * @private
         */
        get_share_dialog: function() {
            if(!share_dialog) {
                this._create_share_dialog();
            }

            return share_dialog;
        },

        show_share_dialog: function(share_name, link) {
            var dialog = this.get_share_dialog();
            this.reset_dialog();
            dialog.set_title(share_name);
            //this.get_$sub_title().html('已创建链接 ' + '<a href="'+ link +'" target="_blank">' + link + '</a>');
            this.get_$link_text().html('<a href="'+ link +'" target="_blank">' + link + '</a>');
            this.set_copy_text(link);

            dialog.show();
            dialog.get_$body().repaint();

        },
        /**
         * 恢复dialog的默认显示
         */
        reset_dialog: function() {
            if(Copy.can_copy()) {
                this.get_$copy_btn().show();
            }
            this.get_$send_btn().hide();
            this.get_$copy_succ_tip().hide();
            this.get_$send_succ_tip().hide();
            this.get_$link_tab().show();
            this.get_$mail_tab().hide();
            this.get_$tab_head_link().addClass('on');
            this.get_$tab_head_mail().removeClass('on');
            this.get_$create_pwd_btn().show();
            this.get_$pwd_con().removeClass('error').hide();
            //防止上次修改了这个值，导致这里还显示上次的“复制链接和密码”
            this.get_share_dialog().set_button_text('copy','<span>'+_(l_key,'复制链接')+'</span>');
            cur_tab = TAB_INFO.LINK;
        },

        /**
         * 计算出符合阅读的分享文件名
         * @param {Array<FileNode>} files
         * @returns {String} share_name
         */
        get_realable_share_name: function(files) {
            var share_name = files[0].get_name(),
                append_str = share_name.slice(share_name.length-6),
                files_len = files.length,
                cut_len = files_len >= 10 ? 5 : files_len > 1 ? 6 : 13,
                share_name = text.smart_sub(share_name.slice(0, share_name.length-6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            if(files_len > 1) {
                //hyytodo
                share_name = text.format(_(l_key,'分享：{0}等{1}个文件（夹）'),[share_name,files_len]);
            } else {
                share_name = _(l_key,'分享')+'：' + share_name;
            }
            return share_name;
        },
        /**
         * 创建分享链接成功后，进行分享窗口显示
         * @param {Array<FileNode>} files 要分享的文件
         * @param {String} link 要分享的链接
         * @param {Boolean} old_pwd 是否已加密过
         */
        on_create_share_success: function(files, link, old_pwd) {
            var title = this.get_realable_share_name(files);

            cur_mail_share_name = '“' + files[0].get_name()+ '”';
            send_mail_title = files[0].get_name();
            cur_share_link = link;
            if(files.length > 1) {
                //hyytodo
                cur_mail_share_name = text.format( _(l_key,'{0}等{1}个文件（夹）'),[cur_mail_share_name,files.length]);
                send_mail_title = text.format(_(l_key,'{0}等{1}个文件（夹）'),[send_mail_title,files.length]);
            }
            this.show_share_dialog(title, link);
            //如果有老密码
            if(old_pwd) {
                this._show_old_pwd(old_pwd);
            }
            //常用联系人列表
            if(!mail_receiver) {
                mail_receiver = require('./mail_receiver');
                mail_receiver.render(this.get_$mail_receiver_ct());
            } else {
                mail_receiver.reset_ui();
            }
        },

        //显示老密码
        _show_old_pwd: function(password){
            this.get_$create_pwd_btn().hide();
            this.get_$pwd_text().val(password).blur();
            this.get_$pwd_con().show().removeClass('loading').addClass('success').repaint();

            //将密码追加到复制提示文本框中
            //var old_text = this.get_$link_text().val();
            this.set_copy_text(_(l_key,'链接')+'：' + cur_share_link + ' （'+_(l_key,'密码')+'：'+password + '）');
            this.get_$link_text().html(_(l_key,'链接')+'：<a href="'+cur_share_link+'" target="_blank">' + cur_share_link + '</a> （'+_(l_key,'密码')+'：'+password + '）');

            //将复制按钮文本修改成“复制链接和密码”
            this.get_share_dialog().set_button_text('copy','<span>'+_(l_key,'复制链接和密码')+'</span>');
        },

        /**
         * 创建密码后的UI处理逻辑
         * @param {Boolean} success 创建是否成功
         * @param {String} info 创建好的密码 or 错误信息
         */
        on_create_pwd_done: function(success, info) {
            var me = this;
            this.get_$create_pwd_btn().hide();
            this.get_$pwd_text().blur();
            this.get_$pwd_con().show().repaint();
            if(success) {
                this.get_$pwd_text().val(info);
                this.loading_hide(true, function() {
                    //将密码追加到复制提示文本框中
                    //var old_text = me.get_$link_text().text();
                    me.set_copy_text(_(l_key,'链接')+'：' + cur_share_link + ' （'+_(l_key,'密码')+'：'+ info + '）');
                    me.get_$link_text().html(_(l_key,'链接')+'：<a href="'+cur_share_link+'" target="_blank">' + cur_share_link + '</a> （'+_(l_key,'密码')+'：'+info + '）');

                    //将复制按钮文本修改成“复制链接和密码”
                    me.get_share_dialog().set_button_text('copy','<span>'+_(l_key,'复制链接和密码')+'</span>');

                    me.fill_mail_conent();//更新邮件内容
                });
            } else {
                this.loading_hide(false);
                this.show_msg_tip(false, info);
            }

        },
        /**
         * 取消分享加密
         */
        on_delete_pwd_done: function() {
            this.get_$create_pwd_btn().show();
            this.get_$pwd_con().hide().removeClass('error');

            //将密码充复制提示文本框中移除
            //var old_text = this.get_$link_text().text();
            this.set_copy_text(cur_share_link);
            this.get_$link_text().html('<a href="'+cur_share_link+'" target="_blank">' + cur_share_link + '</a>');

            //将复制按钮文本修改成“复制链接”
            this.get_share_dialog().set_button_text('copy','<span>'+_(l_key,'复制链接')+'</span>');

            this.fill_mail_conent();//更新邮件内容
        },

        /**
         * 填充发送邮件内容
         */
        fill_mail_conent: function() {
            var link_text = this.get_copy_text();
            this.get_$mail_con().text(_(l_key,'我通过微云给你分享了') + cur_mail_share_name + '，\n' + link_text);
        },

        /**
         * 切换tab
         * @param {String} tab_head tab标识
         */
        switch_tab: function(tab_head) {
            if(tab_head === 'tab_head_link') {//复制链接分享tab
                this.get_$link_tab().show();
                this.get_$mail_tab().hide();
                this.get_$tab_head_link().addClass('on');
                this.get_$tab_head_mail().removeClass('on');
                if(Copy.can_copy()) {
                    this.get_$copy_btn().show();
                }
                this.get_$send_btn().hide();
                cur_tab = TAB_INFO.LINK;
                user_log('SHARE_LINK_TAB');
            } else if(tab_head === 'tab_head_mail') {//邮件分享tab
                this.get_$link_tab().hide();
                this.get_$mail_tab().show();
                this.get_$tab_head_mail().addClass('on');
                this.get_$tab_head_link().removeClass('on');
                if(Copy.can_copy()) {
                    this.get_$copy_btn().hide();
                }
                this.get_$send_btn().show();
                this.fill_mail_conent();//更新邮件内容
                cur_tab = TAB_INFO.MAIL;
                user_log('SHARE_MAIL_TAB');
            }
        },

        //显示loading
        on_loading_show: function() {
            this.get_$pwd_con().removeClass('success').addClass('loading');
        },

        //取消loading，显示成功
        loading_hide: function(success, callback) {
            var me = this;
            var $pwd_con = me.get_$pwd_con();
            $pwd_con.removeClass('loading');
            success && $pwd_con.addClass('success').removeClass('error');
            callback && callback.call(me);
        },
        /**
         * 操作错误or成功提示
         * @param {Boolean} is_succ 是否成功
         * @param {String} msg 要显示的信息
         */
        show_msg_tip: function(is_succ, msg) {
            var $tip = this.get_$msg_tip();
            if(is_succ) {
                $tip.hide().removeClass('err').text(msg).fadeIn(200);
            } else {
                $tip.hide().addClass('err').text(msg).fadeIn(200);
            }
            setTimeout(function() {
                $tip.fadeOut(200);
            }, 3000);
        },

        get_$msg_tip: function() {
            var $tip;
            if(cur_tab === TAB_INFO.LINK) {
                $tip = this.get_$copy_succ_tip();
            } else {
                $tip = this.get_$send_succ_tip();
            }
            return $tip;
        },

        //=========================== DOM 相关 ================================//

        get_$copy_btn: function() {
            return this.$copy_btn || (this.$copy_btn = share_dialog.$el.find('[data-id=copy_btn]'));
        },

        get_$send_btn: function() {
            return this.$send_btn || (this.$send_btn = share_dialog.$el.find('[data-id=send_btn]'));
        },

        get_$copy_succ_tip: function() {
            return this.$copy_succ_tip || (this.$copy_succ_tip = this.get_$copy_btn().find('.infor'));
        },

        get_$send_succ_tip: function() {
            return this.$send_succ_tip || (this.$send_succ_tip = this.get_$send_btn().find('.infor'));
        },

        get_$link_tab: function() {
            return this.$link_tab || (this.$link_tab = share_dialog.$el.find('[data-id=link_tab]'));
        },

        get_$mail_tab: function() {
            return this.$mail_tab || (this.$mail_tab = share_dialog.$el.find('[data-id=mail_tab]'));
        },

        get_$tab_head_link: function() {
            return this.$tab_head_link || (this.$tab_head_link = share_dialog.$el.find('[data-id=tab_head_link]'));
        },

        get_$tab_head_mail: function() {
            return this.$tab_head_mail || (this.$tab_head_mail = share_dialog.$el.find('[data-id=tab_head_mail]'));
        },

        get_$create_pwd_btn: function() {
            return this.$create_pwd_btn || (this.$create_pwd_btn = share_dialog.$el.find('[data-id=create_pwd_btn]'));
        },

        get_$pwd_con: function() {
            return this.$pwd_con || (this.$pwd_con = share_dialog.$el.find('[data-id=pwd_con]'));
        },

        get_$pwd_text: function() {
            return this.$pwd_text || (this.$pwd_text = this.get_$pwd_con().find('[data-id=pwd_text]'));
        },

        get_$link_text: function() {
            return this.$link_text || (this.$link_text = this.get_$link_tab().find('[data-id=link_text]'));
        },

        get_$sub_title: function() {
            return this.$sub_title || (this.$sub_title = share_dialog.$el.find('[data-id=sub_title]'));
        },

        get_$mail_con: function() {
            return this.$mail_con || (this.$mail_con = share_dialog.$el.find('[data-id=mail_con]'));
        },

        get_$mail_receiver_ct: function() {
            return this.$mail_receiver_ct || (this.$mail_receiver_ct = share_dialog.$el.find('[data-id=mail_receiver_ct]'));
        }


    });

    return ui;

});
//tmpl file list:
//share_enter/src/share.WEB.tmpl.html
//share_enter/src/share_enter.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'share_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        Copy = common.get('./util.Copy');
        var _ = require('i18n').get('./pack'),
            l_key = 'share_enter';
    __p.push('    <div id="_disk_share_pop_container" data-no-selection class="popshare-box popshare-make" close-box="true" style="">\r\n\
        <h3 data-draggable-target class="popshare-head" style=""><div class="inner __title"></div></h3>\r\n\
        <div class="popshare-main __content">\r\n\
            <div class="pass-box clear">\r\n\
                <div class="msg"><i class="icon"></i>');
_p(_(l_key,'已创建链接'));
__p.push('</div>\r\n\
                <!-- loading 为密码检查模式，带loading图标 -->\r\n\
                <!-- success 为密码规则验证成功 -->\r\n\
                <!-- error 为密码规则验证失败 -->\r\n\
                <div data-id="pwd_con" class="topass buf-password" style="display:none;">');
_p(_(l_key,'密码'));
__p.push('：<input style="ime-mode:disabled" data-id="pwd_text" type="text" maxlength="4" value=""><i class="ico"></i><a href="#" data-action="cancel_pwd">');
_p(_(l_key,'取消加密'));
__p.push('</a>\r\n\
                    <span class="err-msg">');
_p(_(l_key,'密码不足四位'));
__p.push('<i class="arr-border"></i><i class="arr"></i></span>\r\n\
                </div>\r\n\
                <div data-id="create_pwd_btn" class="topass">\r\n\
                    <a data-action="create_pwd" href="#">');
_p(_(l_key,'添加访问密码'));
__p.push('</a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <ul class="tab-head">\r\n\
                <li data-id="tab_head_link" class="link on"><a href="#"><i class="icon"></i>');
_p(_(l_key,'链接分享'));
__p.push('</a></li>\r\n\
                <li data-id="tab_head_mail" class="email"><a href="#"><i class="icon"></i>');
_p(_(l_key,'邮件分享'));
__p.push('</a></li>\r\n\
            </ul>\r\n\
            <ul class="tab-body">\r\n\
                <li data-id="link_tab" style="display:block;">\r\n\
                    <p calss="infor">');
_p(_(l_key,'复制链接发送给您的好友吧！'));
__p.push('</p>\r\n\
                    <p class="copyurl">\r\n\
                        <input data-id="link_text" type="text" ');
 if(Copy.can_copy()) { __p.push(' disabled="disabled" ');
 } __p.push(' value="http://weiyun.cn/135dcc">\r\n\
                    </p>\r\n\
                </li>\r\n\
                <li data-id="mail_tab" style="display: none;">\r\n\
                    <dl data-id="mail_receiver_ct" class="clear">\r\n\
                    </dl>\r\n\
                    <dl class="clear">\r\n\
                        <dt><label>');
_p(_(l_key,'发送内容：'));
__p.push('</label></dt>\r\n\
                        <dd class="con"><textarea data-id="mail_con"></textarea></dd>\r\n\
                    </dl>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="popshare-foot popshare-btn __buttons">\r\n\
            <ul data-id="buttons" class="tab-footer">');

                $.each(data.buttons || [], function(i, btn) {
                __p.push('                    ');
 if(btn.id === 'copy') { __p.push('                        <li data-id="');
_p(btn.id );
__p.push('_btn" class="popshare-foot-copy" style="display:none;">\r\n\
                            <span class="infor" style="display:none;"></span>\r\n\
                            <a data-clipboard-target data-btn-id="');
_p(btn.id );
__p.push('" type="button" class="btn-blue" href="#"><span>');
_p( btn.text );
__p.push('</span></a>\r\n\
                        </li>');
 } else { __p.push('                        <li data-id="');
_p(btn.id );
__p.push('_btn" class="" style="display:none;">\r\n\
                            <span class="infor" style="display:none;"></span>\r\n\
                            <a data-btn-id="');
_p(btn.id );
__p.push('" type="button" class="btn-blue" href="#"><span>');
_p( btn.text );
__p.push('</span></a>\r\n\
                        </li>');
 } __p.push('                ');

                });
                __p.push('            </ul>\r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" href="javascript:void(0);" class="popshare-close" close-btn="true" title="');
_p(_(l_key,'关闭'));
__p.push('"></a>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'mail_receiver': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'share_enter';
    __p.push('    <dt><label>');
_p(_(l_key,'收件人：'));
__p.push('</label></dt>\r\n\
    <dd class="email">\r\n\
        <!-- 获取焦点时ie6使用.focus样式 -->\r\n\
        <input data-id="mail_receiver_text" type="text" value="');
_p(_(l_key,'输入收件人，多收件人中间用分号隔开'));
__p.push('" />\r\n\
        <div class="normal">\r\n\
            <a data-id="mail_list_trigger" class="link" href="#">');
_p(_(l_key,'常用联系人'));
__p.push('<i></i></a>\r\n\
            <div data-id="mail_list" class="mail-list" style="display:none;"></div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 高度请使用js判断，高度大于132px时设置固定高度，小于132px时不需要设置 -->\r\n\
        <div data-id="mail_match_list" class="autocompletion" style="display:none;"></div>\r\n\
    </dd>');

}
return __p.join("");
},

'mail_match_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            lib = require('lib'),
            text = lib.get('./text');
    __p.push('    ');

    $.each(data || [], function(i, item) { __p.push('        <!-- 这里的name 不需要html转义，因为匹配成功的已经有加粗，在获取时已经先转义过了-->\r\n\
        <a href="javascript:void(0);" data-mail="');
_p( item[2] );
__p.push('" data-index="');
_p( i );
__p.push('">"');
_p( item[0] );
__p.push('" ');
_p( item[1] );
__p.push('</a>');
 }); __p.push('');

}
return __p.join("");
},

'mail_receiver_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'share_enter';
    __p.push('        <div>\r\n\
            <div class="title">\r\n\
                <span class="t1"><span data-id="checkall" class="checkbox"></span></span>\r\n\
                <span class="t2">');
_p(_(l_key,'姓名'));
__p.push('</span>\r\n\
                <span class="t3">');
_p(_(l_key,'Email地址'));
__p.push('</span>\r\n\
            </div>\r\n\
            <!-- 高度请使用js判断，高度大于130时设置固定高度，小于130时不需要设置 -->\r\n\
            <div data-id="mail_receiver_list_con" class="con" style="">\r\n\
            </div>\r\n\
            <a href="javascript:void(0);" class="close"></a>\r\n\
        </div>');

}
return __p.join("");
},

'mail_receiver_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text');
    __p.push('    <!-- ie6使用con-list-hover样式 -->');

    $.each(data || [], function(i, record) { __p.push('    <div class="con-list">\r\n\
        <span class="c1"><span class="checkbox" data-mail="');
_p( record.get('mail'));
__p.push('"></span></span>\r\n\
        <span class="c2 ellipsis">');
_p( text.text(record.get('user_name')) );
__p.push('</span>\r\n\
        <span class="c3 ellipsis">');
_p( record.get('mail_addr') );
__p.push('</span>\r\n\
    </div>');
 }); __p.push('');

}
return __p.join("");
},

'share_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text'),
        common = require('common'),
        Copy = common.get('./util.Copy');
        var _ = require('i18n').get('./pack'),
            l_key = 'share_enter';
    __p.push('    <div id="_disk_share_pop_container" data-no-selection class="popshare-box popshare-make" close-box="true" style="">\r\n\
        <h3 data-draggable-target class="popshare-head" style=""><div class="inner __title"></div></h3>\r\n\
        <div class="popshare-main __content">\r\n\
            <div class="pass-box clear">\r\n\
                <div class="msg"><i class="icon"></i>');
_p(_(l_key,'已创建链接'));
__p.push('</div>\r\n\
                <!-- loading 为密码检查模式，带loading图标 -->\r\n\
                <!-- success 为密码规则验证成功 -->\r\n\
                <!-- error 为密码规则验证失败 -->\r\n\
                <div data-id="pwd_con" class="topass buf-password" style="display:none;">');
_p(_(l_key,'密码'));
__p.push('：<input style="ime-mode:disabled" data-id="pwd_text" type="text" maxlength="4" value=""><i class="ico"></i>\r\n\
                    <a href="#" data-action="cancel_pwd">');
_p(_(l_key,'取消加密'));
__p.push('</a>\r\n\
                    <span class="err-msg">');
_p(_(l_key,'密码不足四位'));
__p.push('<i class="arr-border"></i><i class="arr"></i></span>\r\n\
                </div>\r\n\
                <div data-id="create_pwd_btn" class="topass">\r\n\
                    <a data-action="create_pwd" href="#">');
_p(_(l_key,'添加访问密码'));
__p.push('</a>\r\n\
                </div>\r\n\
            </div>\r\n\
            <ul class="tab-head">\r\n\
                <li data-id="tab_head_link" class="link on"><a href="#"><i class="icon"></i>');
_p(_(l_key,'链接分享'));
__p.push('</a></li>\r\n\
                <li data-id="tab_head_mail" class="email"><a href="#"><i class="icon"></i>');
_p(_(l_key,'邮件分享'));
__p.push('</a></li>\r\n\
            </ul>\r\n\
            <ul class="tab-body">\r\n\
                <li data-id="link_tab" style="display:block;">\r\n\
                    <p calss="infor">');
_p(_(l_key,'复制链接发送给您的好友吧！'));
__p.push('</p>\r\n\
                    <p class="copyurl">\r\n\
                        <span data-id="link_text">\r\n\
                        </span>\r\n\
                    </p>\r\n\
                </li>\r\n\
                <li data-id="mail_tab" style="display: none;">\r\n\
                    <dl data-id="mail_receiver_ct" class="clear">\r\n\
                    </dl>\r\n\
                    <dl class="clear">\r\n\
                        <dt><label>');
_p(_(l_key,'发送内容：'));
__p.push('</label></dt>\r\n\
                        <dd class="con"><textarea data-id="mail_con"></textarea></dd>\r\n\
                    </dl>\r\n\
                </li>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="popshare-foot popshare-btn __buttons">\r\n\
            <ul data-id="buttons" class="tab-footer">');

                $.each(data.buttons || [], function(i, btn) {
                __p.push('                    ');
 if(btn.id === 'copy') { __p.push('                        <li data-id="');
_p(btn.id );
__p.push('_btn" class="popshare-foot-copy" style="display:none;">\r\n\
                            <span class="infor" style="display:none;"></span>\r\n\
                            <a data-clipboard-target data-btn-id="');
_p(btn.id );
__p.push('" type="button" class="btn-blue" href="#"><span>');
_p( btn.text );
__p.push('</span></a>\r\n\
                        </li>');
 } else { __p.push('                        <li data-id="');
_p(btn.id );
__p.push('_btn" class="" style="display:none;">\r\n\
                            <span class="infor" style="display:none;"></span>\r\n\
                            <a data-btn-id="');
_p(btn.id );
__p.push('" type="button" class="btn-blue" href="#"><span>');
_p( btn.text );
__p.push('</span></a>\r\n\
                        </li>');
 } __p.push('                ');

                });
                __p.push('            </ul>\r\n\
        </div>\r\n\
        <a data-btn-id="CANCEL" href="javascript:void(0);" class="popshare-close" close-btn="true" title="');
_p(_(l_key,'关闭'));
__p.push('"></a>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'mail_receiver': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'share_enter';
    __p.push('    <dt><label>');
_p(_(l_key,'收件人：'));
__p.push('</label></dt>\r\n\
    <dd class="email">\r\n\
        <!-- 获取焦点时ie6使用.focus样式 -->\r\n\
        <input data-id="mail_receiver_text" type="text" value="');
_p(_(l_key,'输入收件人，多收件人中间用分号隔开'));
__p.push('" />\r\n\
        <div data-id="mail_list_ct" class="normal">\r\n\
            <a data-id="mail_list_trigger" class="link" href="#">');
_p(_(l_key,'常用联系人'));
__p.push('<i></i></a>\r\n\
            <div data-id="mail_list" class="mail-list" style="display:none;"></div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 高度请使用js判断，高度大于132px时设置固定高度，小于132px时不需要设置 -->\r\n\
        <div data-id="mail_match_list" class="autocompletion" style="display:none;"></div>\r\n\
    </dd>');

}
return __p.join("");
},

'mail_match_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            lib = require('lib'),
            text = lib.get('./text');
    __p.push('    ');

    $.each(data || [], function(i, item) { __p.push('        <!-- 这里的name 不需要html转义，因为匹配成功的已经有加粗，在获取时已经先转义过了-->\r\n\
        <a href="javascript:void(0);" data-mail="');
_p( item[2] );
__p.push('" data-index="');
_p( i );
__p.push('">"');
_p( item[0] );
__p.push('" ');
_p( item[1] );
__p.push('</a>');
 }); __p.push('');

}
return __p.join("");
},

'mail_receiver_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('        ');

            var _ = require('i18n').get('./pack'),
                l_key = 'share_enter';
        __p.push('        <div>\r\n\
            <div class="title">\r\n\
                <span class="t1"><span data-id="checkall" class="checkbox"></span></span>\r\n\
                <span class="t2">');
_p(_(l_key,'姓名'));
__p.push('</span>\r\n\
                <span class="t3">');
_p(_(l_key,'Email地址'));
__p.push('</span>\r\n\
            </div>\r\n\
            <!-- 高度请使用js判断，高度大于130时设置固定高度，小于130时不需要设置 -->\r\n\
            <div data-id="mail_receiver_list_con" class="con" style="">\r\n\
            </div>\r\n\
            <a href="javascript:void(0);" class="close"></a>\r\n\
        </div>');

}
return __p.join("");
},

'mail_receiver_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var $ = require('$'),
        lib = require('lib'),
        text = lib.get('./text');
    __p.push('    <!-- ie6使用con-list-hover样式 -->');

    $.each(data || [], function(i, record) { __p.push('    <div class="con-list">\r\n\
        <span class="c1"><span class="checkbox" data-mail="');
_p( record.get('mail'));
__p.push('"></span></span>\r\n\
        <span class="c2 ellipsis">');
_p( text.text(record.get('user_name')) );
__p.push('</span>\r\n\
        <span class="c3 ellipsis">');
_p( record.get('mail_addr') );
__p.push('</span>\r\n\
    </div>');
 }); __p.push('');

}
return __p.join("");
}
};
return tmpl;
});
