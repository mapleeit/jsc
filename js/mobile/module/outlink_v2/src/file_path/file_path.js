/**
 * 面包屑
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        last_path_key,
        last_left_w = 0,
        undefined;

    var moving = false;

    var file_path = new Module('outlink.file_path', {

        render: function() {
            this.$ct = $('#file_path');
            var me = this;
            me.$ct.on(target_action, 'li', function(e) {
                if(moving) {
                    return;
                }
                var $target = $(e.target);
                var dir_key = $target.attr('data-key');
                if(dir_key && last_path_key !== dir_key) {
                    me.trigger('action', 'click_path', dir_key, e);
                    me.update(store.get(dir_key));
                }
            });

            require.async('Swipe', function() {

                me.init_swipe();
            });
        },

        init_swipe: function() {
            function transformBox(value){
                var time=300;
                value = last_left_w + value;
                if(value > 0) {
                    value = 0;
                }
                if(Math.abs(value) + $(window).width() > me.get_$list().width()) {
                    return;
                }
                me.get_$list().css({
                    '-webkit-transform': 'translateX('+value+'px)',
                    '-ms-transform': 'translateX('+value+'px)',
                    '-o-transform': 'translateX('+value+'px)',
                    '-webkit-transition':time+'ms linear',
                    'transform': 'translateX('+value+'px)',
                    'transition':time+'ms linear'
                });

                last_left_w = value;
            }
            var me = this;

            me.get_$list().width($(window).width());
            me.get_$ct().Swipe({
                iniAngle:15,
                speed: 300,
                iniL:30,
                mode: 'left-right',
                sCallback: function(tPoint) {
                },
                mCallback:function(tPoint){
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        console.log(tPoint.mX);
                        transformBox(tPoint.mX);
                    }
                    moving = true;
                },
                eCallback:function(tPoint){
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        transformBox(tPoint.mX);
                    }
                    moving = false;
                }
            });
        },

        update: function(dir) {
            var parent_list = this.get_parents(dir);
            this.$ct.empty();
            this.$ct.append(tmpl.file_path(parent_list));
            var real_width = 0;
            this.$ct.find('li').each(function(i, item) {
                real_width += $(item).width() + 3;
            });
            real_width = real_width + 60;

            var $list = this.get_$list();
            var win_w = $(window).width();
            $list.width(real_width);
            if(real_width > win_w) {
                var lef_w = -(real_width - win_w);
                $list.css({
                    '-webkit-transform': 'translateX('+lef_w+'px)',
                    '-ms-transform': 'translateX('+lef_w+'px)',
                    '-o-transform': 'translateX('+lef_w+'px)',
                    'transform': 'translateX('+lef_w+'px)'
                });

                last_left_w = lef_w;
            } else {
                $list.width(real_width);
            }
            last_path_key = dir.get_id();
        },

        get_parents: function(dir) {
            var dirs = [dir];
            while (dir.get_parent() && (dir = dir.get_parent())) {
                dirs.push(dir);
            }
            dirs.reverse();

            return dirs;
        },

        get_$ct: function() {
            return this.$ct;
        },

        get_$list: function() {
            return  this.$ct.find('ul');
        }

    });

    return file_path;
});