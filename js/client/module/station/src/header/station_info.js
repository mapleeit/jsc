/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        File = require('./file.FileNode'),
        Loader = require('./loader'),

        tmpl = require('./tmpl'),

        undefined;
    var loader = new Loader();
    var station_info = new Module('header._station_info', {

        render: function($ct) {
            if(this._rendered) {
                return;
            }
            var me = this;

            this.$info_ct = $(tmpl.station_info()).appendTo($ct);

            loader.load_station_info().done(function(data) {
                me.show_info(data);
            });

            this._rendered = true;

        },

        update_info: function() {
            var me = this;
            loader.load_station_info().done(function(data) {
                me.show_info(data);
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