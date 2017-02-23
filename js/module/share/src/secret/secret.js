/**
 * 外链密码模块
 * @author bondli
 * @date 2013-9-16
 */
define(function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var inherit = lib.get('./inherit'),
        text = lib.get('./text'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        cur_record,//当前操作对应的外链
        cur_operator,//当前操作（创建密码、管理密码）
        cur_sub_operator,//当前子操作（修改密码、删除密码）
        NUM_WORD_REG = /[0-9a-zA-Z]/,
        NUM_WORD_FILTER_REG = /[^0-9a-zA-Z]/g,
        filter_key_code = [8, 9, 37, 39, 35, 46],//BackSpace、Tab、Left、Right Delete、End,字符过滤时不对这几个操作字符过虑
        ico_checked_class = 'ico-checked',

        OPERATOR = {
            CREATE: 'create',
            MANAGE: 'manage'
        },

        SUB_OPERATOR = {
            CHANGE: 'change',
            DELETE: 'delete'
        },

        undefined;

    var REQUEST_CGI = 'http://web2.cgi.weiyun.com/outlink.fcg',
        ADD_PASSWD_CMD = 'WeiyunSharePwdCreate',
        EDIT_PASSWD_CMD = 'WeiyunSharePwdModify',
        DEL_PASSWD_CMD = 'WeiyunSharePwdDelete';

    var secret = new Module('secret', {

        set_passwd : function(sharekey, passwd, cmd){
            //删除密码不验证老密码，其他需要验证长度
            //if(passwd.length != 4 && cmd == EDIT_PASSWD_CMD) return;
            //验证传入的sharekey是否合法
            var def = $.Deferred();
            if(!sharekey.length) {
                def.reject('sharekey不合法');
                return;
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
            }).fail(function (msg, ret) {
                def.reject(msg, ret);
            });

            return def;
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
                container_selector: '#_share_secret_pop_container',
                target_selector: '[data-clipboard-target-pop]'     //hack，使用特别的target_selector，避免被当前模块的contextmenu中的复制绑定在body上事件先执行
            });

            this
                .listenTo(this.copy, 'provide_text', function() {
                    return me.get_$success_pwd().text();
                })
                .listenTo(this.copy, 'copy_done', function() {
                    me.show_msg_tip(true, '链接复制成功');
                })
                .listenTo(this.copy, 'copy_error', function() {
                    me.show_msg_tip(false, '链接复制失败');
                });
        },
        /**
         * 创建密码管理窗口
         * @returns {widgets.Dialog}
         * @private
         */
        _create_secret_dialog: function() {
            var me = this;
            var dialog = new widgets.Dialog({
                title: '创建密码',
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.secret_dialog,
                mask_bg: 'ui-mask-white',
                buttons: [{
                    id: 'OK',
                    text: '确定',
                    disabled: true,
                    klass: 'g-btn-blue'
                }, {
                    id: 'COPY',
                    text: '复制链接和密码',
                    disabled:true,
                    klass: 'g-btn-blue btn-copy'
                }, {
                    id: 'CLOSE',
                    text: '确定',
                    disabled:true,
                    klass: 'g-btn-gray'
                }, {
                    id: 'CANCEL',
                    text: '取消',
                    disabled: true,
                    klass: 'g-btn-gray'
                }],
                handlers: {
                    OK: function(e) {
                        e && e.preventDefault();
                        if(me.get_$ok_btn().attr('disabled')) {//禁用时，不进行操作
                            return;
                        }
                        if(cur_operator === OPERATOR.CREATE) {
                            me.do_create_pwd();
                        } else if(cur_sub_operator === SUB_OPERATOR.CHANGE) {
                            me.do_change_pwd();
                        } else {
                            me.do_delete_pwd();
                        }
                    },
                    COPY: function(e) {
                        e.preventDefault();
                        me.copy.ie_copy(me.get_$success_pwd().text());
                    },
                    CANCEL: function() {
                        me.release_quote();
                    },
                    CLOSE: function() {
                        me.release_quote();
                    }
                }
            });

            dialog.render_if();
            dialog.$buttons = dialog.$el.find('a[type=button]');//这里的按钮不是button,而是a标签

            this._init_copy();

            this.bind_events(dialog);

            return dialog;
        },
        /**
         * 绑定ui事件
         */
        bind_events: function(dialog) {
            var me = this;
            //判断keyCode是否是数字和字母
            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }
            dialog.$el
                .on('keydown', '[data-id=pwd_text],[data-id=change_pwd_text]', function(e) {
                    var keycode = e.keyCode;
                    if(!is_num_word_key(keycode)
                        && $.inArray(keycode, filter_key_code) === -1
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
                .on('keyup', '[data-id=pwd_text],[data-id=change_pwd_text]', function(e) {
                    var pwd = $.trim($(this).val());
                    var keycode = e.keyCode;
                    var char = String.fromCharCode(keycode);
                    if(($.browser.webkit || $.browser.opera) && !NUM_WORD_REG.test(char) && $.inArray(keycode, filter_key_code) === -1) {//webkit opera 中文输入法下禁止输入，此时keyCode并不固定，先在keydown拦截，没成功再在这里拦一次
                        pwd = pwd.replace(NUM_WORD_FILTER_REG, '');
                        $(this).val(pwd);
                    }
                    if(cur_operator === OPERATOR.MANAGE && cur_sub_operator !== SUB_OPERATOR.CHANGE) {//非修改密码选中时，不进行按钮连动
                        return;
                    }
                    if(pwd.length === 4) {
                        dialog.set_button_enable('OK', true);
                    } else {
                        dialog.set_button_enable('OK', false);
                    }
                })
                .on('click', '[data-id=del_pwd_check],[data-id=del_pwd_check_tip]', function(e) {//选择删除密码
                    me.switch_manage_sub_operator(SUB_OPERATOR.DELETE);
                    dialog.set_button_enable('OK', true);
                })
                .on('click', '[data-id=change_pwd_check],[data-id=change_pwd_check_tip]', function(e) {//选择修改密码
                    me.switch_manage_sub_operator(SUB_OPERATOR.CHANGE);
                    if(me.get_$change_pwd_text().val().length === 4) {
                        dialog.set_button_enable('OK', true);
                    } else {
                        dialog.set_button_enable('OK', false);
                    }
                });
            //密码框禁用粘贴
            dialog.$el.find('[data-id=pwd_text],[data-id=change_pwd_text]')
                .on('paste', function(e) {
                    e.preventDefault();
                    return false;
                });
        },

        get_secret_dialog: function() {
            if(!this.secret_dialog) {
                this.secret_dialog = this._create_secret_dialog();
            }
            return this.secret_dialog;
        },
        /**
         * 密码管理框，切换checkbox（删除密码 or 修改密码）
         * @param sub_operator
         */
        switch_manage_sub_operator: function(sub_operator) {
            if(sub_operator === SUB_OPERATOR.CHANGE) {
                this.get_$change_pwd_check().addClass(ico_checked_class);
                this.get_$del_pwd_check().removeClass(ico_checked_class);
                cur_sub_operator = SUB_OPERATOR.CHANGE;
            } else {
                this.get_$change_pwd_check().removeClass(ico_checked_class);
                this.get_$del_pwd_check().addClass(ico_checked_class);
                cur_sub_operator = SUB_OPERATOR.DELETE;
            }
        },
        /**
         * 切换窗口内容（创建密码、管理密码、密码生成成功）
         * @param content_type
         */
        switch_dialog_content: function(content_type) {
            var dialog = this.get_secret_dialog();
            switch(content_type) {
                case 'create':
                    dialog.set_title('创建密码');
                    dialog.set_button_enable('OK', false);
                    dialog.set_button_visible('OK', true);
                    dialog.set_button_visible('CANCEL', true);
                    dialog.set_button_visible('COPY', false);
                    dialog.set_button_visible('CLOSE', false);
                    this.get_$pwd_text().val('');
                    this.get_$create_content().show();
                    this.get_$change_content().hide();
                    this.get_$success_content().hide();
                    break;
                case 'manage':
                    dialog.set_title('密码管理');
                    dialog.set_button_enable('OK', true);
                    dialog.set_button_visible('OK', true);
                    dialog.set_button_visible('CANCEL', true);
                    dialog.set_button_visible('COPY', false);
                    dialog.set_button_visible('CLOSE', false);
                    this.get_$change_pwd_text().val('');
                    this.switch_manage_sub_operator(SUB_OPERATOR.CHANGE);
                    this.get_$create_content().hide();
                    this.get_$change_content().show();
                    this.get_$success_content().hide();
                    break;
                case 'success':
                    dialog.set_button_visible('OK', false);
                    if(Copy.can_copy()) {
                        dialog.set_button_visible('COPY', true);
                    }
                    dialog.set_button_visible('CLOSE', true);
                    dialog.set_button_visible('CANCEL', false);
                    this.get_$create_content().hide();
                    this.get_$change_content().hide();
                    this.get_$success_content().show();
                    this.fill_success_data();
                    break;

            }
        },
        /**
         * 重置窗口（每次打开窗口前需要先重置）
         */
        reset_dialog: function() {
            this.get_$msg_tip().hide();
            this.switch_dialog_content(cur_operator);
        },

        /**
         * 创建/修改密码成功后，对成功页面进行填充相应的信息
         */
        fill_success_data: function() {
            var pwd;
                //share_name = cur_record.get('share_name'),
                //append_str = share_name.slice(share_name.length-6),
                //share_name = text.smart_sub(share_name.slice(0, share_name.length-6), 10) + append_str;//截取一个合理长度一行能显示的字条

            if(cur_operator === OPERATOR.CREATE) {
                this.get_$success_title().text('访问密码创建成功！');
                pwd = this.get_$pwd_text().val();
            } else {
                this.get_$success_title().text('密码修改成功！');
                pwd = this.get_$change_pwd_text().val();
            }

            //this.get_$success_info().text('我通过微云给你分享了“' + share_name + '”');
            this.get_$success_pwd().text('链接：' + cur_record.get('raw_url') + '（密码：' + pwd + '）');
        },
        /**
         * 创建密码操作
         */
        do_create_pwd: function() {
            var me = this,
                pwd = this.get_$pwd_text().val();
            this.set_passwd(cur_record.get('share_key'), pwd, ADD_PASSWD_CMD)
                .done(function() {
                    me.switch_dialog_content('success');
                    me.trigger('create_pwd_success', cur_record, pwd);
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_PWD_OK_CREATE');
        },
        /**
         * 修改密码操作
         */
        do_change_pwd: function() {
            var me = this,
                pwd = this.get_$change_pwd_text().val();
            this.set_passwd(cur_record.get('share_key'), pwd, EDIT_PASSWD_CMD)
                .done(function() {
                    me.switch_dialog_content('success');
                    me.trigger('change_pwd_success', cur_record, pwd);
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_CHANGE_CHECKBOX');
        },
        /**
         * 删除密码操作
         */
        do_delete_pwd: function() {
            var me = this;
            this.set_passwd(cur_record.get('share_key'), '', DEL_PASSWD_CMD)
                .done(function() {
                    me.trigger('delete_pwd_success', cur_record);
                    me.get_secret_dialog().hide();
                    mini_tip.ok('密码删除成功');
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_DELETE_CHECKBOX');
        },
        /**
         * 创建访问密码
         * @param {Record} record 要创建访问密码的外链
         */
        create_pwd: function(record) {
            var dialog = this.get_secret_dialog();
            cur_record = record;
            cur_operator = OPERATOR.CREATE;
            this.reset_dialog();
            dialog.show();
            this.get_$pwd_text().focus();//窗口显示出来后，聚焦到密码输入框
        },

        /**
         * 管理访问密码
         * @param {Record} record 要进行管理访问密码的外链
         */
        manage_pwd: function(record) {
            var dialog = this.get_secret_dialog();
            cur_record = record;
            cur_operator = OPERATOR.MANAGE;
            this.reset_dialog();
            dialog.show();
            this.get_$change_pwd_text().val(record.get('share_pwd')).focus();//窗口显示出来后，聚焦到密码输入框
        },

        /**
         * 释放引用
         */
        release_quote: function() {
            cur_record = null;
            cur_operator = null
            cur_sub_operator = null;
        },

        /**
         * 显示提示信息
         * @param {Boolean} is_succ 是否成功
         * @param {String} msg 要提示的信息
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


        //=========================== DOM 相关 ================================//
        get_$pwd_text: function() {
            return this.$pwd_text || (this.$pwd_text = this.get_secret_dialog().$el.find('[data-id=pwd_text]'));
        },

        get_$create_content: function() {
            return this.$create_content || (this.$create_content = this.get_secret_dialog().get_$body().find('[data-id=create_content]'));
        },

        get_$change_content: function() {
            return this.$change_content || (this.$change_content = this.get_secret_dialog().get_$body().find('[data-id=change_content]'));
        },

        get_$success_content: function() {
            return this.$success_content || (this.$success_content = this.get_secret_dialog().get_$body().find('[data-id=success_content]'));
        },

        get_$success_title: function() {
            return this.$success_title || (this.$success_title = this.get_secret_dialog().$el.find('[data-id=success_title]'));
        },

        get_$success_info: function() {
            return this.$success_info || (this.$success_info = this.get_secret_dialog().$el.find('[data-id=success_info]'));
        },

        get_$success_pwd: function() {
            return this.$success_pwd || (this.$success_pwd = this.get_secret_dialog().$el.find('[data-id=success_pwd]'));
        },

        get_$del_pwd_check: function() {
            return this.$del_pwd_check || (this.$del_pwd_check = this.get_$change_content().find('[data-id=del_pwd_check]'));
        },

        get_$change_pwd_check: function() {
            return this.$change_pwd_check || (this.$change_pwd_check = this.get_$change_content().find('[data-id=change_pwd_check]'));
        },

        get_$change_pwd_text: function() {
            return this.$change_pwd_text || (this.$change_pwd_text = this.get_$change_content().find('[data-id=change_pwd_text]'));
        },

        get_$msg_tip: function() {
            return this.$msg_tip || (this.$msg_tip = this.get_secret_dialog().$el.find('[data-id=msg_tip]'));
        },

        get_$ok_btn: function() {
            return this.$ok_btn || (this.$ok_btn = this.get_secret_dialog().$el.find('[data-btn-id=OK]'));
        }
    });

    return secret;
});