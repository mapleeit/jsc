/**
 * H5签到页UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        Module = lib.get('./Module'),
        router = lib.get('./router'),
        dateformat  = lib.get('./dateformat'),
        widgets = common.get('./ui.widgets'),
        browser = common.get('./util.browser'),
        session_event = common.get('./global.global_event').namespace('session_event'),

        city_data = require('./picker.city_data'),
        MobileSelectArea = require('./picker.MobileSelectArea'),

        tmpl = require('./tmpl'),
        store = require('./store'),
        mgr = require('./mgr'),

        cities = {'北京':1,'上海':1,'天津':1,'重庆':1},
        undefined;

    var ui = new Module('sign_ui', {

        render: function () {
            if(this._rendered) {
                return;
            }

            this._$err = $('.error-dialog');
            var paths = location.pathname.split('/'),
                cur_path = paths && paths[paths.length-1],
                hash = location.hash? location.hash.slice(1) : '';
            router.init(cur_path);
            if(hash) {
                router.go(hash);
            }
            this._bind_events();
            this._rendered = true;
        },

        _bind_events: function() {
            var me = this;
            $('#act_personal').on('touchend', '[data-id]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-id]'),
                    action_name = $target.attr('data-id'),
                    jump_map = {
                        'address': '//h5.weiyun.com/activities/address',
                        'records': '//h5.weiyun.com/activities/records',
                        'rule': 'https://kf.qq.com/touch/sappfaq/160413VVZJve1604136vQ3aA.html?scene_id=kf1524'
                    };
                location.href = jump_map[action_name];
            });

            $('.personal-center').on('touchend', function(e){
                location.href = '//h5.weiyun.com/activities/personal'
            });

            $(document.body).on('touchend', '[data-action]', function(e) {
                //e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');

                var item_id = $(this).attr('data-id'),
                    item_name = $(this).attr('data-name');

                switch(action_name) {
                    case 'sign_in':
                        if(store.has_signed_in()){
                            $("#frist").hide();
                            $("#second").show();
                        }else{
                            me.trigger('action','sign_in');
                        }
                        router.go('gift');
                        break;

                    case 'save_address':
                        me.check_addr();
                        break;

                    //case 'act_vip':
                    //    location.href = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://act.qzone.qq.com%2FmobileAct%2Findex.html%3FactId%3D57046b0a1eaecca610506491';
                    //    break;

                    case 'exchange':
                        if(!$(this).hasClass('not-enough') && item_id) {
                            me.trigger('action', action_name, item_id);
                        } else if(!$(this).hasClass('not-enough') && item_name) {
                            me.do_exchange($target);
                        }
                        break;

                    case 'cancel':
                        $('.num-dialog').hide();
                        break;

                    case 'confirm':
                        if(item_name === 'confirm') {
                            me.trigger('action', 'confirm', item_id);
                        } else {
                            $('.success-dialog').hide();
                        }
                        break;

                    default:
                        me.trigger('action', action_name);
                }
            });

            this.listenTo(store, 'update', function(info) {
                me.show_result(info, true);
            }).listenTo(store, 'load_done', function(data) {
                me.render_goods(data);
            }).listenTo(store, 'load_fail', function(msg, ret) {
                me._err_msg(msg);
            }).listenTo(store, 'refresh', function(info) {
                me.refresh(info);
            });

            this.listenTo(router, 'change', function(to, from) {
                if(from === 'activities' && to === 'gift') {
                    this.hide();
                    $("#frist").hide();
                    $("#second").show();
                } else if(from === 'gift' && to === 'gift') {
                    this.hide();
                    $("#frist").hide();
                    $("#second").show();
                } else if(from === 'gift'){
                    this.hide();
                    $("#frist").show();
                    $("#second").hide();
                }
            });
        },

        do_exchange: function(cur_btn) {
            var data_name = cur_btn.attr('data-name'),
                $parent = cur_btn.parent(),
                _text = '消耗' + $parent.find('.num').text() + '积分兑换' + $parent.find('.description').text();
            $('.num-dialog [data-name=confirm_text]').text(_text);
            $('.num-dialog [data-name=confirm]').attr('data-id', data_name);
            $('.num-dialog').show();

            var success_msg = data_name == '1'? '已开通' + $parent.find('.description').text() : '已兑换' + $parent.find('.description').text();
            $('.success-dialog .tips').text(success_msg);
        },

        hide: function() {
            $('.num-dialog').hide();
            $('#check_order').hide();
            $('#order_result').hide();
        },

        check_order: function(good, addr) {
            if(!this._$el) {
                this._$el = $(tmpl.order({
                    good: good,
                    addr: addr
                })).appendTo(document.body);
            } else {
                var city = addr.city==='0'? '' : addr.city;
                var province = (addr.province && addr.province !== '0')? (cities[addr.province]? '' : addr.province + '省') : '';
                var head_url = '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/gift-' + good.get_prizeid() + '.jpg';
                this._$el.find('.trblBor img').attr('src', head_url);
                this._$el.find('.main p.text').text(good.get_name());
                this._$el.find('.integral-num .num').text(good.get_score());
                this._$el.find('.personal .name span').text('收件人：' + addr.name);
                this._$el.find('.personal .num span').text(addr.phone);
                this._$el.find('.personal .address span').text(province + city + addr.addr);
                this._$el.find('#confirm_order').css('data-id',good.get_id());
            }
            if(!$('.information-list').hasClass('disable')) {
                $('.information-list').on('touchend', function(e){
                    location.href = '//h5.weiyun.com/activities/address'
                });
                $('.information-list').addClass('disable');
            }

            $('#second').hide();
            $('#check_order').show();

            var me = this;
            $('#confirm_order').on('click', function() {
                var item_id = $(this).attr('data-id');
                me.trigger('action', 'confirm', item_id);
            });
        },

        show_result: function(info, is_succeed) {
            var $check_order = $('#check_order'),
                $order_result = $('#order_result');

            if(is_succeed) {
                var text = '拥有<span class="integral-num integral-num-1" style="width: auto;">' + info.total_point + '</span>积分';
                $('#total_point').html(text);

                $order_result.find('.result-wrap').removeClass('fail').addClass('success');
                $order_result.find('#remain_score').text(info.total_point);
                $order_result.find('.result-wrap .tip').text('兑换成功，我们会尽快发货');
                $order_result.find('.shop-list').show();
                $order_result.find('.address-wrap').show();
                this.update(info.total_point);
            } else {
                $order_result.find('.result-wrap').removeClass('success').addClass('fail');
                $order_result.find('.result-wrap .tip').text('未完成兑换');
                $order_result.find('.shop-list').hide();
                $order_result.find('.address-wrap').hide();
            }

            if($('.num-dialog').css('display') !== 'none') {
                $('.num-dialog').toggle(false);
                $('.success-dialog').toggle(is_succeed);
            } else {
                $check_order.hide();
                $order_result.show();
            }
        },

        render_addr: function(addr) {
            addr.city = addr.city==='0'? '' : addr.city;
            var city = (addr.province || addr.city)? (addr.province + ' ' + addr.city) : '',
                $show_address = $('#show_address'),
                $edit_address = $('#edit_address');
            $edit_address.find('[data-id=name] .info').text(addr.name || '');
            $edit_address.find('[data-id=phone] .info').text(addr.phone || '');
            $edit_address.find('[data-id=city]').attr('value', city);
            $edit_address.find('[data-id=addr] .info').text(addr.addr || '');
            $edit_address.find('.red').removeClass('red');
            $edit_address.find('[data-id]').focus(function() {
                 $(this).removeClass('red');
            });
            $show_address.hide();
            $edit_address.show();

            if(!$edit_address.hasClass('disable')) {
                var selectArea = new MobileSelectArea();
                selectArea.init({trigger:$('#txt_area'),value:$('#hd_area').val(),level:2, default: 1,data: city_data.data});
                $edit_address.addClass('disable');
            }
        },

        show_addr: function(addr) {
            addr.city = addr.city==='0'? '' : addr.city;
            var province = (addr.province && addr.province !== '0')? (cities[addr.province]? '' : addr.province + '省') : '';
            var $show_address = $('#show_address'),
                $edit_address = $('#edit_address');
            $show_address.find('[data-id=name]').text(addr.name || '');
            $show_address.find('[data-id=phone]').text(addr.phone || '');
            $show_address.find('[data-id=addr]').text((province + addr.city + addr.addr) || '');

            if(addr.name === '0') {
                $show_address.find('[data-id=no_address]').show();
                $show_address.find('[data-id=address_info]').hide();
            } else {
                $show_address.find('[data-id=no_address]').hide();
                $show_address.find('[data-id=address_info]').show();
            }
            $edit_address.hide();
            $show_address.show();
        },

        check_addr: function() {
            var $edit_address = $('#edit_address'),
                area = $('.info-input')[0].value.split(' '),
                _data = {
                login_type: 3,
                actid: 360,
                addr: $edit_address.find('[data-id=addr]').text(),
                city: (area.length>1 && area[1])? area[1] : '0',
                id_number: '',
                mail: '',
                name: $edit_address.find('[data-id=name]').text(),
                phone: $edit_address.find('[data-id=phone]').text(),
                post: '0',
                province: area.length? area[0] : '0'
            };
            if(!this.validate(_data)) {
                this.trigger('action', 'save_address', _data);
            } else {
                var err_msg = this.validate(_data);
                $edit_address.find('[data-id=' + err_msg + ']').addClass('red');
            }
        },

        validate: function(data) {
            if(!data.name) {
                return 'name';
            } else if(!this.is_phone_number(data.phone)) {
                return 'phone';
            } else if(!data.province || (cities[data.province] &&  data.city === '0')) {
                return 'city';
            } else if(! data.addr) {
                return 'addr';
            }
            return '';
        },

        is_phone_number: function(num) {
            var reg_mobile = /^1\d{10}$/,
                reg_phone = /^0\d{2,3}-?\d{7,8}$/;
            if(reg_mobile.test(num) || reg_phone.test(num)) {
                return true;
            }
            return false;
        },

        //加减积分
        refresh: function(info) {
            var sign_in_count = parseInt(info.sign_in_count);
            var total_point = '' + info.total_point;

            var dom,
                list = [],
                pre_point = (info.total_point - info.add_point) + '',
                pre_len = pre_point.length,
                len = total_point.length,
                count = len - pre_len;

            for(var i=0; i<len; i++) {
                var num1 = i >= count? pre_point[i - count] : '',
                    is_diff = (!num1 || num1 !== total_point[i])? 'animate' : '';
                dom = '<span class="integral-num '+ is_diff + ' integral-num-' + (i + 1) +
                    '"><span class="num1">' + num1 + '</span><span class="num2">' + total_point[i] + '</span></span>';
                list.push(dom);
            }
            if(list.length) {
                $('#total_point').html('拥有' + list.join('') + '积分');
            }
            $('#checkret').text('今日已获得' + info.add_point + '积分');
            $('.checkin-box .box-title span').text(sign_in_count);
            $('.item_' + sign_in_count).addClass('on').addClass('animate');

            $("#frist").hide();
            $("#second").show();

            this.update(total_point);
        },

        retry: function() {
            $('#order_result').hide();
            $('#second').show();
        },

        update: function(total_point) {
            var good_list = $('.good');
            good_list.forEach(function(item) {
                var cost_point = parseInt($(item).find('.num').text()),
                    btn_text = $(item).find('[data-action]').text();
                if(total_point >= cost_point && btn_text === '兑换') {
                    $(item).find('[data-action]').removeClass('not-enough');
                } else {
                    $(item).find('[data-action]').addClass('not-enough');
                }
            });
        },

        //点评券只能兑换一次
        update_dianping: function(good_id) {
            var $good = $('[data-name="' + good_id +'"]');
            if($good.length) {
                $good.addClass('not-enough');
                $good.find('span').text('已兑换');
            }
        },

        _err_msg: function (tips_text) {
            var me = this;
            this._$err.find('.text').text(tips_text);
            this._$err.show();
            setTimeout(function() {
                me._$err.hide();
            }, 2000);
        }
    });

    return ui;
});