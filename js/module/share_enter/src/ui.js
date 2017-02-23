/**
 * 邮件\外链分享UI逻辑
 * @author hibincheng
 * @date 2013-09-16
 */
define(function (require, exports, module) {
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
        scr_reader_mode = common.get('./scr_reader_mode'),
        tmpl = require('./tmpl'),
        share_mail,
        share_secret,
        share_enter,
        mail_receiver,
        verify_code,

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

        undefined;

    var ui = new Module('share_enter_ui', {

        render: function() {
            share_enter = require('./share_enter');
            share_mail = require('./share_mail');
            share_secret = require('./share_secret');
            verify_code = require('./verify_code');
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
                verify_code_text,
                $send_btn = this.get_$send_btn(),
                inval_cnt,
                err_msg;

            mail_receiver.hide_mail_list();

            !receiver[0] && receiver.shift();
            !receiver[receiver.length-1] && receiver.pop();
            if(receiver.length === 0 || receiver[0] === mail_receiver.get_placeholder_text()) {
                me.show_msg_tip(false, '请填写收件人');
                return;
            }
            //收件人个数上限
            if(receiver.length > 20) {
                me.show_msg_tip(false, '收件人最多20个');
                return;
            }
            //邮箱合法性校验
            inval_cnt = share_mail.validate_mail(receiver);
            if(inval_cnt) {
                me.show_msg_tip(false, '有' + inval_cnt + '个收件人邮箱不合法');
                return;
            }

            err_msg = verify_code.validate();
            //需要验证码时，本地先校验一下
            if(err_msg) {
                me.show_msg_tip(false, err_msg);
                return;
            }
            verify_code_text = verify_code.get_verify_code_text();
            //防止狂点发送
            if($send_btn.is('.disabled')) {
                return;
            }
            $send_btn.addClass('disabled');
            content = me.get_$mail_con().val();
            share_mail.send_mail(receiver, send_mail_title, content, verify_code_text)
                .done(function() {
                    me.show_msg_tip(true, '发送成功');
                    verify_code.change_verify_code();//每次都更新下验证码
                })
                .fail(function(msg, ret) {
                    if(ret == '102037') { //超过频率限制，需提供验证码
                        verify_code.show();
                    }
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
                    me.show_msg_tip(true, '复制链接成功');
                })
                .listenTo(this.copy, 'copy_error', function() {
                    user_log('SHARE_CREATE_COPY_BUTTON');
                    me.show_msg_tip(false, '复制链接失败');
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
                title: '分享文件',
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.share_dialog,
                mask_bg: 'ui-mask-white',
                buttons: [{
                    id:'copy',
                    text:'复制链接',
                    disabled:false
                }, {
                    id: 'send',
                    text: '发送',
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

            if (scr_reader_mode.is_enable()) {
                this.get_$link_text().html('<input value="'+ link +'" aria-label="按下Ctrl加C复制链接" readonly="readonly"/>');
            } else {
                this.get_$link_text().html('<a href="'+ link +'" target="_blank" tabindex="0">' + link + '</a>');
            }
            this.set_copy_text(link);

            dialog.show();
            //dialog.get_$body().repaint();

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
            this.get_share_dialog().set_button_text('copy','<span class="btn-inner">复制链接</span>');
            verify_code.hide();
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
                share_name = '分享：' + share_name + ' 等' + files_len + '个文件';
            } else {
                share_name = '分享：' + share_name;
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
                cur_mail_share_name = cur_mail_share_name + ' 等' + files.length + '个文件';
                send_mail_title = send_mail_title + ' 等' + files.length + '个文件';
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
            this.set_copy_text('链接：' + cur_share_link + ' （密码：'+password + '）');
            this.get_$link_text().html('链接： <a href="'+cur_share_link+'" target="_blank">' + cur_share_link + '</a> （密码：'+password + '）');

            //将复制按钮文本修改成“复制链接和密码”
            this.get_share_dialog().set_button_text('copy','<span class="btn-inner">复制链接和密码</span>');
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
            this.get_$pwd_con().show();
            if(success) {
                this.get_$pwd_text().val(info);
                this.loading_hide(true, function() {
                    //将密码追加到复制提示文本框中
                    //var old_text = me.get_$link_text().text();
                    me.set_copy_text('链接：' + cur_share_link + ' （密码：'+ info + '）');
                    me.get_$link_text().html('链接： <a href="'+cur_share_link+'" target="_blank">' + cur_share_link + '</a> （密码：'+info + '）');

                    //将复制按钮文本修改成“复制链接和密码”
                    me.get_share_dialog().set_button_text('copy','<span class="btn-inner">复制链接和密码</span>');

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
            this.get_share_dialog().set_button_text('copy','<span class="btn-inner">复制链接</span>');

            this.fill_mail_conent();//更新邮件内容
        },

        /**
         * 填充发送邮件内容
         */
        fill_mail_conent: function() {
            var link_text = this.get_copy_text();
            this.get_$mail_con().text('我通过微云给你分享了' + cur_mail_share_name + '，\n' + link_text);
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
        },

        get_$verify_code_ct: function() {
            return this.$verify_code_ct || (this.$verify_code_ct = share_dialog.$el.find('[data-id=verify_code_ct]'));
        }

    });

    return ui;

});