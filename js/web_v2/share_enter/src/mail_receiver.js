/**
 * 常用联系人列表模块
 * @author hibincheng
 * @date 2013-09-26
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

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
        place_holder_text = '输入收件人，多收件人中间用分号隔开',

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
            } else { //如果没有数据，再尝试拉一次
                this.fill_mail_receiver_list();
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
                    var $target = $(this),
                        val = $target.val();
                    if(!val) {
                        $target.val(place_holder_text);
                    } else {
                        $target.val(val.replace(/；/g, ';'));//分割符兼容处理
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
            var receiver_text = this.get_receiver_text().split(';');
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
            var text = this.get_receiver_text(),
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
            var text = this.get_receiver_text(),
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

        hide_mail_list: function() {
            this.get_$mail_list().hide();
        },
        //收件人地址
        get_receiver_text: function() {
            return this.get_$mail_receiver_text().val().replace(/；/g, ';'); //分割符兼容处理
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
});