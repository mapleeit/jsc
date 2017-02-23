/**
 * 分享信息模块
 * @author hibincheng
 * @date 2013-09-04
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        undefined;

    var share_info = new Module('share_info', {

        render: function($ct) {
            if(!this.rendered) {
                if(constants.UI_VER === 'WEB') {
                    this.$el = $(tmpl.web_share_info()).appendTo($ct);
                } else {
                    this.$el = $(tmpl.appbox_share_info()).appendTo($ct);
                }
                this.rendered = true;
            }
        },
        /**
         * 更新分享数
         * @param {Object}count 更新数 包含公开数和私密数
         * @param {Boolean} is_refresh 是否事个数据刷新，而不是在原基础上加或减
         */
        update_share_total_count: function(count, is_refresh) {
            var old_public_num = parseInt(this.get_$public_count().text(), 10);
            var old_private_num = parseInt(this.get_$private_count().text(), 10);

            if(is_refresh) {
                this.get_$public_count().text(count.public_num || 0);
                this.get_$private_count().text(count.private_num || 0);
                return;
            }

            if(count.public_num) {
                this.get_$public_count().text(Math.max(old_public_num + count.public_num, 0));
            }
            if(count.private_num) {
                this.get_$private_count().text(Math.max(old_private_num + count.private_num, 0));
            }
        },

        hide_share_count: function() {
            this.get_$share_count_head().addClass('head-only');
        },

        show_share_count: function() {
            this.get_$share_count_head().removeClass('head-only');
            this.get_$share_count_ct().show();
        },

        get_$public_count: function() {
            return this.$public_count || (this.$public_count = this.$el.find('[data-id=public_count]'));
        },

        get_$private_count: function() {
            return this.$private_count || (this.$private_count = this.$el.find('[data-id=private_count]'));
        },

        get_$share_count_head: function() {
            return this.$share_count_head || (this.$share_count_head = this.$el.find('[class=head]'));
        },

        get_$share_count_ct: function() {
            return this.$share_count_ct || (this.$share_count_ct = this.$el.find('[data-id=share_count_ct]'));
        }
    });
    return share_info;

});