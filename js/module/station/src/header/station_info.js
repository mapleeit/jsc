/**
 * 中转站信息模块
 * @author hibincheng
 * @date 2015-05-08
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        File = common.get('./file.file_object'),

        tmpl = require('./tmpl'),

        undefined;

    var station_info = new Module('station_info', {

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this.$info_ct = $(tmpl.station_info()).appendTo($ct);

            this.load_info();

            this._rendered = true;

        },

        load_info: function() {
            var me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                me.show_info(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
            });
        },

        show_info: function(data) {

            $(tmpl.bubbble({
                max_date: Math.ceil(data.temporary_file_max_valid_time / (60*60*24)),
                max_single_file_size: File.get_readability_size(data.max_single_file_size),
                file_total: data.file_total
            })).appendTo(this.get_$info_ct());

            var $bubbble = this.$info_ct.find('[data-id=station_bubbble]');
            this.$info_ct.find('[data-id=bubbble_hint]').hover(function(e) {
                $bubbble.show();
            }, function(e) {
                $bubbble.hide();
            });
        },

        get_$info_ct: function() {
            return this.$info_ct;
        }
    });
    return station_info;

});